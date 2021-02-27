const KeyValue = require('./key-value.js');

const notImplementedError = require('../../errors/not-implemented.js');
const missingParamError = require('../../errors/missing-param.js');

exports.TYPE = 'game-object';

exports.Obj = class GameObject
{
	constructor(id)
	{
		this.id = id;
		this.state = new Map(); // key, value

		this.type = this.getType();

		this.collision_category = this.addKeyValue(new KeyValue('collision_category'));
		this.collision_mask = this.addKeyValue(new KeyValue('collision_mask'));
		this.moveable = this.addKeyValue(new KeyValue('moveable'));
		this.position_x = this.addKeyValue(new KeyValue('position_x'));
		this.position_y = this.addKeyValue(new KeyValue('position_y'));
		this.angle = this.addKeyValue(new KeyValue('angle'));
	}

	initialize(values)
	{
		for(const [key, key_value] of this.state)
		{
			if(values[key] != null)
			{
				key_value.update(values[key]);
			}
			else throw missingParamError(key);
		}
	}

	// like initialize, but not all values are required
	update(values)
	{
		for(const [key, value] of Object.entries(values))
		{
			this.state.get(key).update(value);
		}
	}

	addTo(scene)
	{
		throw notImplementedError('GameObject.addTo()');
	}

	getType()
	{
		throw notImplementedError('GameObject.getType()');
	}

	addKeyValue(key_value)
	{
		this.state.set(key_value.key, this.key_value);
		return key_value;
	}
}
