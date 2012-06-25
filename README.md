node-sellmate
============

Useful authentication module to connect your App with Sellmate (wwww.sellmate.com).


Testing
=======

```bash
$ npm test
```

Running with npm
================

```bash
$ npm install node-sellmate
```

Run example

```bash
$ node examples/server.js
$ open http://localhost:8888
```


How to use it
=============

Create a new OAuth2 object with some parameters (host is optional, default is 'auth.sellmate.com'):

```javascript
var oa = new OAuth2(client_id, client_secret, redirectUri, host);

e.g.: var oa = new OAuth2('1234', 'qwertasdfgzxcv', 'http://localhost:8888/callback');
```

Get the OAuth Request Token URL and call it

```javascript
var authUrl = oa.getAuthorizeUrl({ 'shop': 'my-shop' });
```

Your App should have a callback servlet (i.e. http://localhost:8888/callback) where you get the notification
with the 'code' as a parameter. Now you can request an AccessToken

```javascript
oa.getAccessToken(code, {
	'shop': 'my-shop',
	'grant_type': 'authorization_code',
}, function(error, response, body) {});
```