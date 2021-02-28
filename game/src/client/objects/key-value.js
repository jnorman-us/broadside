module.exports = class KeyValue
{
	constructor(key)
	{
		this.key = key;
		this.value = null;
	}

	update(value)
	{
		this.value = value;
	}
}
