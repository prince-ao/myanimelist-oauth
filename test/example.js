const app = require("express")();
const oauth = require("../lib/oauth");

app.get("/", (req, res) => {
  res.send("hello world");
});

var myanimelist = new oauth({
  clientID: "ad890e37ef61deb935fe6e8afc7eed5a",
  callback: "http://localhost:3000/callback",
});

app.get("/auth", myanimelist.authorize);

app.get("/callback", myanimelist.access_token, (req, res) => {
  res.json(req.responseJson);
});

app.listen("3000", () => console.log("listening on port 3000"));
