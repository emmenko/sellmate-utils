// Module dependencies
var url = require('url'),
	randomstring = require("randomstring"),
    crypto = require('crypto'),
    request = require('request');


exports.Rest = function(target, tokens) {
	this._target = target;
	this._tokens = tokens;
}

exports.Rest.prototype.generateAuthHeader = function() {
	console.log("Generating Auth Header...");
	// Get timestamp
	var timestamp = Math.round(new Date().getTime() / 1000);
	
	var uri = url.parse(this._target);

	// Set port
	if (!uri.port) uri.port = (uri.protocol == 'https:') ? '443' : '80';
	
	// Define a random nonce
	var nonce = randomstring.generate(12);
	// Create the normalized string:
	// timestamp\n
	// nonce\n
	// method\n
	// target_url\n
	// host\n
	// port\n
	// \n
	var normalized = timestamp + "\n" + nonce + "\n" + "GET" + "\n" +
		uri.pathname + "\n" + uri.host + "\n" + uri.port + "\n";
	// Create the request mac
	var mac_string = crypto.createHmac('SHA256', this._tokens.mac_key).update(normalized).digest('base64');

	var auth_header = "Mac id=\"" + this._tokens.access_token 
		+ "\", ts=\"" + timestamp 
		+ "\", nonce=\"" + nonce 
		+ "\", mac=\"" + mac_string + "\"";
	console.log(auth_header);

	return auth_header;
}

exports.Rest.prototype.GET = function(callback) {
	var options = {
		uri: this._target,
		method: 'GET',
		headers: {
			'Authorization': this.generateAuthHeader()
		},
		timeout: 20000
	};

	makeRequest(options, callback)
}

exports.Rest.prototype.POST = function(payload, callback) {
	// Check that the payload is either a buffer or a string

	var options = {
		uri: this._target,
		method: 'POST',
		body: payload,
		headers: {
			'Authorization': this.generateAuthHeader()
		},
		timeout: 20000
	};

	makeRequest(options, callback)
}

exports.Rest.prototype.PUT = function(payload, callback) {
	// Check that the payload is either a buffer or a string

	var options = {
		uri: this._target,
		method: 'PUT',
		body: payload,
		headers: {
			'Authorization': generateAuthHeader()
		},
		timeout: 20000
	};

	makeRequest(options, callback)
}

exports.Rest.prototype.DELETE = function(callback) {
	var options = {
		uri: this._target,
		method: 'DELETE',
		headers: {
			'Authorization': generateAuthHeader()
		},
		timeout: 20000
	};

	makeRequest(options, callback)
}

function makeRequest(options, callback) {
	request(options, function(error, response, body){
		console.log("Response received: " + body);
		callback(error, response, body);
	});
}