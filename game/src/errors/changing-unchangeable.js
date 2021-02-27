module.exports = function changingUnchangeableError(key) {
	return new Error(`Cannot change unchangeable: ${ key }`);
}
