const p_processResponse = async (response, done, error) => {
	const text = await response.text();
	
	if (response.ok && done) {
		done.call(null, response.status, text);
	}
	else if(error){
		error.call(null, response.status, text);
	}
}

const p_post = (url, done, error, body, method) => {
	fetch(url, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).then( (response) => p_processResponse(response, done, error) );
}

const p_get = (url, done, error, body, method) => {
	let fetchPromise;

		if(body !== null){
			const link = new URLSearchParams();
			Object.entries(body).forEach(entry => {
				link.set(entry[0], entry[1]);
			});

			fetchPromise = fetch(url + "?" + link.toString(), { method: method });
		}
		else{
			fetchPromise = fetch(url, { method: method });
		}
		
		fetchPromise.then( (response) => p_processResponse(response, done, error) );
}

const ajax = {
	post: function (url, done = function(statusOK, message){}, error = function(statusError, message){}, body = {}){
		p_post(url, done, error, body, "post");
	},
	get: function (url, done = function(statusOK, message){}, error = function(statusError, message){}, body = null) {
		p_get(url, done, error, body, "get");
	},
	put: function (url, done = function(statusOK, message){}, error = function(statusError, message){}, body = {}){
		p_post(url, done, error, body, "put");
	},
	delete: function (url, done = function(statusOK, message){}, error = function(statusError, message){}, body = null) {
		p_get(url, done, error, body, "delete");
	}
};

const functionTypeSafe = (callback, ...args) => {
	if (callback.constructor !== Function)
		throw new TypeError('callback is not a Function');

	args.forEach((arg, index) => {
		if (arg.constructor !== Function) {
			throw new TypeError(typeof arg + " (at index " + index + ') is not a Function');
		}
	});

	return function () {
		"use strict";
		args.forEach((arg, index) => {
			if (arguments[index].constructor !== arg) {
				throw new TypeError(typeof arguments[index] + " (at index " + index + ') is not of type ' + typeof arg.name);
			}
		});

		return callback.apply(null, arguments);
	};
};

export { ajax, functionTypeSafe };