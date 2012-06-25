node-sellmate
============

Useful authentication module to connect your App with Sellmate (wwww.sellmate.com).


Testing
=======

    % npm test

Running with npm
================

    % npm install node-sellmate

Run example

    % node examples/server.js
    % open http://localhost


How to use it
=============

Create a new OAuth2 object with some parameters (host is optional, default is 'auth.sellmate.com'):

	var oa = new OAuth2(client_id, client_secret, redirectUri, host);

[example]
	var oa = new OAuth2('1234', 'qwertasdfgzxcv', 'http://localhost:8888/callback');

Get the OAuth Request Token URL and call it

	var authUrl = oa.getAuthorizeUrl({ 'shop': 'my-shop' });

Your App should have a callback servlet (i.e. http://localhost:8888/callback) where you get the notification
with the 'code' as a parameter. Now you can request an AccessToken

	oa.getAccessToken(code, {
		'shop': 'my-shop',
		'grant_type': 'authorization_code',
	}, function(error, response, body) {});


Changelog
=========
 * 0.1.1  
		Added 'server.js' as a sample code and created some tests.
 * 0.1.0  
		Created OAuth2 lib.
