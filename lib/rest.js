var url = require('url'),
	randomstring = require("randomstring"),
    crypto = require('crypto');


exports.Rest = function(target, req, callback) {
	this._target = target;
	this._req = req;
	this.callback = callback;
}

exports.prototype.generateAuthHeader = function() {
	console.log("Generating Auth Header...");
	// Get timestamp
	var timestamp = Math.round(new Date().getTime() / 1000);
	console.log("Timestamp: " + timestamp);
	// Set port
	var uri = url.parse(this._target);
	if (!uri.port) uri.port = (uri.protocol == 'https:') ? '443' : '80';
	console.log("Set port: " + uri.port);
	// Define a random nonce
	var nonce = randomstring.generate(12);
	console.log("Created nonce: " + nonce);
	// Create the normalized string:
	// timestamp\n
	// nonce\n
	// method\n
	// target_url\n
	// host\n
	// port\n
	// \n
	var normalized = timestamp + "\n" + nonce + "\n" + "GET" + "\n" +
		uri.path + "\n" + uri.host + "\n" + uri.port + "\n";
	console.log("Created normalized: \n" + normalized);
	console.log("Auth token: " + this._req.session.oauth_mac_key);
	// Create the request mac
	var mac_string = crypto.createHmac('SHA256', this._req.session.oauth_mac_key).update(normalized).digest('base64');
	console.log("Created mac_string: " + mac_string);

	var auth_header = "Mac id=\"" + req.session.oauth_access_token 
		+ "\", ts=\"" + timestamp 
		+ "\", nonce=\"" + nonce 
		+ "\", mac=\"" + mac_string + "\"";
	console.log("auth header: " + auth_header);

	return auth_header;
}

exports.prototype.GET = function() {
	var options = {
		uri: this._target,
		method: 'GET',
		headers: {
			'Authorization': generateAuthHeader(this._target, this._req)
		},
		timeout: 20000
	};

	makeRequest(options, this._callback)
}

exports.prototype.POST = function(payload) {
	// Check that the payload is either a buffer or a string

	var options = {
		uri: this._target,
		method: 'POST',
		body: payload,
		headers: {
			'Authorization': generateAuthHeader(this._target, this._req)
		},
		timeout: 20000
	};

	makeRequest(options, this._callback)
}

exports.prototype.PUT = function(payload) {
	// Check that the payload is either a buffer or a string

	var options = {
		uri: this._target,
		method: 'PUT',
		body: payload,
		headers: {
			'Authorization': generateAuthHeader(this._target, this._req)
		},
		timeout: 20000
	};

	makeRequest(options, this._callback)
}

exports.prototype.DELETE = function() {
	var options = {
		uri: this._target,
		method: 'DELETE',
		headers: {
			'Authorization': generateAuthHeader(this._target, this._req)
		},
		timeout: 20000
	};

	makeRequest(options, this._callback)
}

function makeRequest(options, callback) {
	request(options, function(error, response, body){
		callback(error, response, body);
	});
}