const Tile = require('./tile.js');

const Categories = require('../../categories.js');

exports.TYPE = 'sand-tile';

exports.Obj = class SandTile extends Tile.Obj
{
	constructor(id)
	{
		super(id);
	}

	initialize(values)
	{
		values.collision_category = Categories.Ground;
		values.collision_mask = 0;

		super.initialize(values);
	}

	getType()
	{
		return exports.TYPE;
	}

	getBody()
	{
		const body = super.getBody();

		const height = this.height.value + 50;

		const reds = (100 * ((height - 50) / 15)) + 155;

		body.render.fillStyle = `rgb(${ reds }, 255, 0)`;

		return body;
	}
}
