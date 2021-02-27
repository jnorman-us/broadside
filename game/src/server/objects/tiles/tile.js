const { Bodies } = require('matter-js');

const GameObject = require('../game-object.js');
const KeyValue = require('../key-value.js');

exports.TYPE = 'tile';

exports.Obj = class Tile extends GameObject.Obj
{
	constructor(id)
	{
		super(id);

		this.radius = this.addKeyValue(new KeyValue('radius', false));
		this.height = this.addKeyValue(new KeyValue('height', false));
		this.adjacents = this.addKeyValue(new KeyValue('adjacents', false));

	}

	initialize(values)
	{
		values.moveable = false;
		values.radius = 15;
		values.angle = Math.PI / 2;

		super.initialize(values);
	}

	getBody()
	{
		const body = Bodies.polygon(0, 0, 6, this.radius.value);

		return body; // x, y, # sides, radius
	}
}
