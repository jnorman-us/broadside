module.exports = function noSuchObjectError(id) {
	return new Error(`No such object: ${ id }`);
}
