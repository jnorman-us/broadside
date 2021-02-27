const { Body, World } = require('matter-js');

const KeyValue = require('./key-value.js');

const notImplementedError = require('../../errors/not-implemented.js');
const missingParamError = require('../../errors/missing-param.js');

exports.TYPE = 'game-object';

exports.Obj = class GameObject
{
	constructor(id)
	{
		this.id = id;
		this.state = [];

		this.type = this.getType();

		this.collision_category = this.addKeyValue(new KeyValue('collision_category', true));
		this.collision_mask = this.addKeyValue(new KeyValue('collision_mask', true));
		this.moveable = this.addKeyValue(new KeyValue('moveable', false));
		this.position_x = this.addKeyValue(new KeyValue('position_x', true));
		this.position_y = this.addKeyValue(new KeyValue('position_y', true));
		this.angle = this.addKeyValue(new KeyValue('angle', true));
	}

	initialize(values)
	{
		for(const key_value of this.state)
		{
			const key = key_value.key;

			if(values[key] != null) // this is under the assumption that ALL of the key values are nonoptional args,
			{ // but probably not always the case
				key_value.update(values[key]);
			}
			else throw missingParamError(key);
		}

		this.body = this.getBody();

		this.body.collisionFilter.category = this.collision_category.value;
		this.body.collisionFilter.mask = this.collision_mask.value;

		Body.setStatic(this.body, this.moveable.value);
		Body.setPosition(this.body, {
			x: this.position_x.value,
			y: this.position_y.value,
		});
		Body.setAngle(this.body, this.angle.value);
	}

	addTo(world)
	{
		World.addBody(world, this.body);
	}

	getType()
	{
		throw notImplementedError('GameObject.getType()');
	}

	getBody()
	{
		throw notImplementedError('GameObject.getBody()');
	}

	// the following functions pertain to the state functions
	addKeyValue(key_value)
	{
		this.state.push(key_value);
		return key_value;
	}

	getBase()
	{
		const base = {};
		base.id = this.id;
		base.type = this.type;

		for(const key_value of this.state)
		{
			base[key_value.key] = key_value.value;
		}

		return base;
	}

	getUpdate()
	{
		const update = {};
		update.id = this.id;

		return update;
	}
}
