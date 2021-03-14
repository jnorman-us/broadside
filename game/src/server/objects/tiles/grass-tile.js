const Tile = require('./tile.js');

const Categories = require('../../categories.js');

exports.TYPE = 'grass-tile';

exports.Obj = class GrassTile extends Tile.Obj
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

		const green = (this.height.value + 100 - 160) / 120 * 255;

		body.render.fillStyle = `rgb(60, ${ 255 - green }, 0)`;

		return body;
	}
}
