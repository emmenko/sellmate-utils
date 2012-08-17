sellmate-utils
==============

Useful authentication module to help you connect your App with [www.sellmate.com](http://www.sellmate.com).
REST API Documentation is also available [here](http://commercetools.github.com/sellmate-api/).

Installation
============

```bash
$ npm install sellmate-utils
```

or

```bash
$ git clone git://github.com/emmenko/sellmate-utils.git
$ cd sellmate-utils
$ npm install
```

Quick start - OAuth2
====================

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
with the `code` as a query parameter. Then you can **request an AccessToken*:*

	```javascript
	oa.getAccessToken(code, {
		'shop': 'my-shop',
		'grant_type': 'authorization_code',
	}, function(error, response, body) {
		// The body response contains some parameters among which you will 
		// find the `access_token` and the `refresh_token`
	});
	```

Quick start - REST
==================

1. **Create a new Rest** object with the target url and the parameters needed for the authentication (`mac_key` and `access_token`):

	```javascript
	var target = "http://api.sellmate.com/<shop-handle>/rest/<resource>";	
	var rest = new Rest(target, {
		"mac_key": "abcd",
		"access_token": "abcd"
	});
	```

2. Use one of the four verbs `CRUD` to access a resource:

	```javascript
	rest.GET(function(error, response, body){
		// Handle callback
	});	
	```

3. You can also request the `Authorization Header` with:

	```javascript
	var authHeader = rest.getAuthHeader();
	```