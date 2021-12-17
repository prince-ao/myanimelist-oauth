<p align="center"><img src="assets/oauth.png" width="200px" /></p>

# myanimelist-oauth

This is a simple Oauth 2.0 library for myanimelist API hosted on npm. This library can be used in browsers or node.

Note: all the bundles are in the dist directory, so you can pick whichever you want.

## Installation

```bash
yarn add myanimelist-oauth
```

## Initialization

```javascript
const malOauth = require("myanimelist-oauth");
```

## Usage

```javascript
const app = require("express")();
const malOauth = require("myanimelist-oauth");

app.get("/", (req, res) => {
	res.send("hello world");
});

var myanimelist = new malOauth({
	clientID: "your client ID",
	callback: "http://localhost:3000/callback",
	clientSecret: "your client secret", // not required if your application is registered as "Android", "IOS", or "Other"
});

app.get("/auth", myanimelist.authorize);

app.get("/callback", myanimelist.access_token, (req, res) => {
	res.json(req.get_data);
});

app.listen("3000", () => console.log("listening on port 3000"));
```

## Functions

```javascript
// Initializer
malOauth({
  clientID!: string,
  callback!: string,
  clientSecret?: string,
  codeChallange?: string,
  state?: string
})

authorize() => null // redirects to the uri you specified in your application registration

access_token() => null // middleware that sends final json response to req.get_data

refresh() => {
  'token-type': 'Bearer',
  'expires_in': int,
  'access_token': string,
  'refresh_token'string
}
```

## Contact

- Author: prince-ao
- Contact: princeaddo608@gmail.com
