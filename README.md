node-sellmate
============

Useful authentication module to connect your App with Sellmate [www.sellmate.com](http://www.sellmate.com).


Installation
============

```bash
$ npm install node-sellmate
```

or

```bash
$ git clone git://github.com/emmenko/node-sellmate.git
$ cd node-sellmate
$ npm install
```

Quick start
===========

1. **Create a new OAuth2** object with some parameters (`host` is optional, default is 'auth.sellmate.com'):

	```javascript
	var oa = new OAuth2(client_id, client_secret, redirectUri, host);

	e.g.: var oa = new OAuth2('1234', 'qwertasdfgzxcv', 'http://localhost:8888/callback');
	```

2. Get the **OAuth Request Token URL** and call it (parameters are optional, i.e. `shop`):

	```javascript
	var authUrl = oa.getAuthorizeUrl(params);

	e.g.: var authUrl = oa.getAuthorizeUrl({ 'shop': 'my-shop' });
	```

3. Your App should have a **callback servlet** (i.e. http://localhost:8888/callback) where you get the notification
with the `code` as a parameter. Now you can **request an AccessToken*:*

	```javascript
	oa.getAccessToken(code, {
		'shop': 'my-shop',
		'grant_type': 'authorization_code',
	}, function(error, response, body) {
		// The body response contains some parameters among which you will find the `access_token` and the `refresh_token`
	});
	```

Example
=======

There is an example app at [./example](https://github.com/emmenko/node-sellmate/tree/master/examples)

```bash
$ node examples/server.js
$ open http://localhost:8888
```

Testing
=======

```bash
$ npm test
```