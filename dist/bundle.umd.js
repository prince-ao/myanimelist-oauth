(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	let malOauth = require("./malOauth.js");

	module.exports = malOauth;

}));
