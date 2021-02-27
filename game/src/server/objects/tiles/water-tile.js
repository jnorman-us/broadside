const Tile = require('./tile.js');
const KeyValue = require('../key-value.js');

const Categories = require('../../categories.js');

exports.TYPE = 'water-tile';

exports.Obj = class WaterTile extends Tile.Obj
{
	constructor(id)
	{
		super(id);

		this.water_height = this.addKeyValue(new KeyValue('water_height', false));
	}

	initialize(values)
	{
		values.water_height = 0;
		values.collision_category = Categories.Water;
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

		const white = (this.height.value + 50) / 50 * 255;

		body.render.fillStyle = `rgb(${ white / 4 }, ${ white }, 255)`;

		return body;
	}
}
