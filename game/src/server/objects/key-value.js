const changingUnchangeableError = require('../../errors/changing-unchangeable.js');

module.exports = class KeyValue
{
	constructor(key, changeable)
	{
		this.key = key;
		this.changeable = changeable;

		this.first_change = true;
		this.history = [];
	}

	update(value)
	{
		if(this.changeable)
			this.history.push(value);
		else if(this.first_change)
		{
			this.history.push(value);
			this.first_change = false;
		}
		else throw changingUnchangeableError(this.key);
	}

	get value()
	{
		var last_i = this.history.length - 1;

		if(last_i >= 0)
			return this.history[last_i];
		return null;
	}

	isChanged()
	{
		return this.history.length > 1;
	}

	reset()
	{
		var value = this.value;
		console.log(value);
		this.history = [ value ];
	}
}
