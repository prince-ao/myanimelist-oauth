var app = require("express")();
const fetch = require("cross-fetch");
//const fetch = require("node-fetch");

const _clientID = Symbol();
const _callback = Symbol();
const _codeChallenge = Symbol();
const _state = Symbol();
const _clientSecret = Symbol();

//app.use(bodyParser.json());

module.exports = class Oauth {
	constructor(params) {
		if (params.clientID == "" || params.callback == "" || !params.clientID || !params.callback) {
			throw Error("clientID, finishRedirect, and callback are required");
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
		this[_codeChallenge] = params.code_challenge || generateChallenge();
		this[_state] = params.state;
	}
	authorize = (req, res) => {
		res.redirect(
			`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${this[_clientID]}&code_challenge=${this[_codeChallenge]}&redirect_uri=${this[_callback]}&code_challenge_method=plain`
		);
		//console.log("code challenge in authorize is : " + this[_codeChallenge]);
		return;
	};

	access_token = async (req, res, next) => {
		const response = req.query;
		// console.log({
		// 	client_id: this[_clientID],
		// 	code: response.code,
		// 	code_challenge: this[_codeChallenge],
		// 	client_secret: this[_clientSecret],
		// 	grant_type: "authorization_code",
		// });
		//const body = `client_id=${this[_clientID]}&client_secret=${this[_clientSecret]}&code=${response.code}&code_verifier=${this[_codeChallenge]}&grant_type=authorization_code`;
		//console.log(body);
		//console.log("code challenge in access_token is : " + this[_codeChallenge]);
		res.redirect(`http://localhost:3000/test?code=${response.code}`);
		// fetch(`https://myanimelist.net/v1/oauth2/token`, {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/x-www-form-urlencoded",
		// 	},
		// 	body: `grant_type=authorization_code&code=${response.code}&client_id=${this[_clientID]}&client_secret=${this[_clientSecret]}&code_verifier=${this[_codeChallenge]}`,
		// })
		// 	.then((res) => {
		// 		console.log(res);
		// 		res.json();
		// 	})
		// 	.then((json) => console.log(json));

		//const data = await rn.json();
		//console.log(rn);
		//res.json(rn);
	};

	get_data = async (req, res, next) => {
		const response = req.query.code;
		console.log({
			client_id: this[_clientID],
			code: response,
			code_challenge: this[_codeChallenge],
			client_secret: this[_clientSecret],
			grant_type: "authorization_code",
		});
		const res = await fetch(`https://myanimelist.net/v1/oauth2/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `grant_type=authorization_code&code=${response.code}&client_id=${this[_clientID]}&client_secret=${this[_clientSecret]}&code_verifier=${this[_codeChallenge]}`,
		});
	};
};
