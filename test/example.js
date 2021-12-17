const app = require("express")();
const oauth = require("../lib/oauth");

app.get("/", (req, res) => {
	res.send("hello world");
});

//app.use(bodyParser.json());

var myanimelist = new oauth({
	clientID: "5e1da7881ad6030e9a8f4a1a33119fd4",
	callback: "http://localhost:3000/callback",
	clientSecret: "e50c5c302a4291e90754ebac76e554c4e96edd5d063a27cd554c3e2876860f27",
});

app.get("/auth", myanimelist.authorize);

app.get("/callback", myanimelist.access_token);

app.get("/test", myanimelist.get_data);

app.listen("3000", () => console.log("listening on port 3000"));
