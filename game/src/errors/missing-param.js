module.exports = function missingParamError(key) {
	return new Error(`Missing parameter: ${ key }`);
}
