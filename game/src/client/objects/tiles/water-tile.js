const Tile = require('./tile.js');
const KeyValue = require('../key-value.js');

exports.TYPE = 'water-tile';

exports.Obj = class WaterTile extends Tile.Obj
{
	constructor(id)
	{
		super(id);

		this.water_height = this.addKeyValue(new KeyValue('water_height'));
	}

	getType()
	{
		return exports.TYPE;
	}
}
