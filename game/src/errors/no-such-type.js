module.exports = function noSuchTypeError(type) {
	return new Error(`No such type: ${ type }`);
}
