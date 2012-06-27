// Require modules
var querystring = require('querystring'),
		request = require('request');

exports.OAuth2 = function(client_id, client_secret, redirectUri, host) {
	this._clientId = client_id;
	this._clientSecret = client_secret;
	this._redirectUri = redirectUri;
	this._host = host || "auth.sellmate.com";
	this._authorizeUrl = "/oauth2/auth";
	this._accessTokenUrl = "/oauth2/token";
}

/**
 *
 * Build the URL to make the Authorization Request to the first endpoint, used
 * for requesting a grant_code. You will get then a notification on your callback
 * with some parameters on the URL. Use the code to request an AccessToken.
 * 
 * Parameters could be:
 * - shop: the shop-id you want to access (if given, this will skip the 'switcher' page step)
 * - redirect_uri: the callback URI registered with your App at Sellmate
 * - state: you can pass some custom parameters and you will get them back on the callback
 *
 */
exports.OAuth2.prototype.getAuthorizeUrl = function(params) {
	var params = params || {};
	params['client_id'] = this._clientId;
	params['response_type'] = 'code';

	return "https://" + this._host + this._authorizeUrl + "?" + querystring.stringify(params);
}

exports.OAuth2.prototype._setShop = function(shop) {
	this._shop = shop;
}

/**
 * This function makes a POST request to the second auth endpoint which will return 
 * a JSON containing the tokens. The function must provide a the grant_code (or the refresh_token),
 * a callback and some optional parameters:
 *
 * - client_id (required): the client_id of a registered application
 * - client_secret (required): the client_secret of a registered application
 * - grant_type (required): either 'authorization_code' or 'refresh_token'
 * - code (optional/required): required if 'authorization_code' is defined
 * - refresh_token (optional/required): required if 'refresh_token' is defined
 * - shop (required): the shop-handle/namespace
 * - redirect_uri (required): the callback uri defined in the registered application
 * - domain (required): usually 'auth.sellmate.com'
 * 
 */
exports.OAuth2.prototype.getAccessToken = function(code, params, callback) {
	if (typeof code === "function")
		throw new Error("Code cannot be a function");
	if (typeof code === "object")
		throw new Error("Code cannot be an object");

	// Make sure the callback is defined
	if (!(typeof callback === "function"))
		throw new Error("Callback is not defined")

	console.log("Setting parameters...");
	var params = params || {};
	params['shop'] = params['shop'] || this._shop;
	params['redirect_uri'] = params['redirect_uri'] || this._redirectUri;
	// Check if the grant_type is 'refresh_token', otherwise use 'authorization_code'
	if (params.grant_type === 'refresh_token') 
		params['refresh_token'] = code;
	else
		params['code'] = code;	

	var payload = querystring.stringify(params);
	console.log("Body payload: " + payload);

	/**
	 * Define the options for the OAuth Request
	 * 
	 * Basic authentication is automatically created within the URL itself, as specified in http://www.ietf.org/rfc/rfc1738.txt
	 * Simply pass the 'username:password' before the host with a '@' sign
	 * Example: http://{username}:{password}@{host}
	 * 
	 * or set the Authorization field in the header:
	 * var auth_header = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
	 * 'Authorization' : auth_header 
	 */
	var request_options = {
		uri: 'https://' + this._clientId + ':' + this._clientSecret + '@' + this._host + '/oauth2/token',
		method: 'POST',
		body: payload,	
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': payload.length
		},
		timeout: 20000
	};

	// Make the request
	request(request_options, function(error, response, body) {
		callback(error, response, body);
	});
}