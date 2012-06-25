var express = require('express'),
	 OAuth2 = require('../lib/oauth2').OAuth2,
	 querystring = require('querystring');

// Setup the Express.js server
var app = express.createServer();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
	secret: "skjghskdjfhbqigohqdiouk"
}));
var oa = new OAuth2('12002', 'GDqbHdpkm4kbJ7loT', 'http://localhost:8888/callback', "auth.sellmatepages.com");

// Home Page
app.get('/', function(req, res){
	console.log("Checking if access token is in the session...");
	if(!req.session.oauth_access_token) {
		console.log("redirecting to login page");
		res.redirect("/login");
	}
	else {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("AccessToken: " + req.session.oauth_access_token + "<br>"
			+"RefreshToken: " + req.session.oauth_refresh_token);
		res.end();

		// TODO: make the REST call
	}

});

// Request an OAuth Request Token, and redirects the user to authorize it
app.get('/login', function(req, res) {

	var authUrl = oa.getAuthorizeUrl({
		'shop': 'test'
	});

	console.log("Getting auth url: " + authUrl);
	res.redirect(authUrl);

});

// Callback for the authorization page. Request then an OAuth Access Token
app.get('/callback', function(req, res) {

	var code = req.query['code'];
	console.log("Callback received with code: " + code);

	oa.getAccessToken(code, {
		'shop': 'test',
		'grant_type': 'authorization_code',
	}, function(error, response, body) {
		console.log("Body received: " + body);
		var json_body = JSON.parse(body);

		if (response.statusCode == 200) {
			// Save the tokens
			req.session.oauth_access_token = json_body.access_token;
			req.session.oauth_refresh_token = json_body.refresh_token;
		} else {
			console.log('Error code: ' + response.statusCode);
		}
		res.writeHead(200, {"Content-Type": "application/json"});
		res.write(JSON.stringify(json_body, null, 4));
		res.end();
	});

});

app.listen(8888);
console.log("listening on http://localhost:8888");