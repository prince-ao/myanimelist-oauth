const fetch = require("cross-fetch");

const _clientID = Symbol();
const _callback = Symbol();
const _codeChallenge = Symbol();
const _state = Symbol();
const _clientSecret = Symbol();
const _refreshToken = Symbol();

module.exports = class MalOauth {
	constructor(params) {
		if (params.clientID == "" || params.callback == "" || !params.clientID || !params.callback) {
			throw Error("clientID and callback are required");
		}
		const generateChallenge = () => {
			var result = "";
			var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
			var charactersLength = characters.length;
			for (var i = 0; i < 128; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		};
		this[_clientID] = params.clientID;
		this[_callback] = params.callback;
		this[_clientSecret] = params.clientSecret;
		this[_codeChallenge] = params.codeChallenge || generateChallenge();
		this[_state] = params.state;
	}
	authorize = (req, res) => {
		res.redirect(
			`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${this[_clientID]}&code_challenge=${this[_codeChallenge]}&redirect_uri=${this[_callback]}&code_challenge_method=plain`
		);
		return;
	};

	access_token = async (req, res, next) => {
		const response = req.query;
		const rn = await fetch(`https://myanimelist.net/v1/oauth2/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `grant_type=authorization_code&code=${response.code}&client_id=${this[_clientID]}${
				this[_clientSecret] ? `&client_secret=${this[_clientSecret]}` : ""
			}&code_verifier=${this[_codeChallenge]}&redirect_uri=${this[_callback]}`,
		});

		const data = await rn.json();
		req.get_data = data;
		this[_refreshToken] = data.refresh_token;
		next();
	};

	refresh = async () => {
		if (!this[_refreshToken]) {
			throw Error("Could not find the refresh token. Try authorizing again.");
		}
		const rn = await fetch(`https://myanimelist.net/v1/oauth2/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `grant_type=refresh_token&client_id=${this[_clientID]}&client_secret=${this[_clientSecret]}&refresh_token=${this[_refreshToken]}`,
		});
		const data = await rn.json();
		return data;
	};
};
