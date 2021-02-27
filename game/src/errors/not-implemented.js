module.exports = function notImplementedError(function_name) {
	return new Error(`Function not implemented: ${ function_name }`);
}
