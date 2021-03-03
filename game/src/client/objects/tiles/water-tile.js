const { MeshStandardMaterial } = require('three');

const Tile = require('./tile.js');
const KeyValue = require('../key-value.js');

exports.TYPE = 'water-tile';

exports.MATERIAL = new MeshStandardMaterial({
	roughness: .95,
	transparent: false,
	color: 0x0f0,
	flatShading: true,
});

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

	getMaterial()
	{
		return exports.MATERIAL;
	}
}
