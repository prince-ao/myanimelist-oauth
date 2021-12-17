const app = require("express")();
const malOauth = require("../lib");
require("dotenv").config();

app.get("/", (req, res) => {
	res.send("hello world");
});

var myanimelist = new malOauth({
	clientID: process.env.CLIENT_ID,
	callback: process.env.CALLBACK,
	clientSecret: process.env.CLIENT_SECRET,
});

app.get("/auth", myanimelist.authorize);

app.get("/callback", myanimelist.access_token, (req, res) => {
	res.json(req.get_data);
});

app.listen("3000", () => console.log("listening on port 3000"));
