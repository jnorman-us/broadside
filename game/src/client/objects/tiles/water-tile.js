const { MeshStandardMaterial, MeshPhysicalMaterial } = require('three');

const Tile = require('./tile.js');
const KeyValue = require('../key-value.js');

exports.TYPE = 'water-tile';

/*
exports.MATERIAL = new MeshStandardMaterial({
	roughness: .1,
	transparent: false,
	color: '#ffdc7f',
	flatShading: true,
});*/

exports.MATERIAL = new MeshPhysicalMaterial({
	color: '#ffdc7f',
	reflectivity: 0,
	clearcoat: 1,
	clearcoatRoughness: 0,
	metalness: 0,
	roughness: .5,
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
