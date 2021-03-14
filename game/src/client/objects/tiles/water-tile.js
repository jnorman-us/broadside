const { MeshStandardMaterial, MeshPhysicalMaterial, FaceColors } = require('three');

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

exports.COLOR = '#ffdc7f';

exports.MATERIAL = new MeshPhysicalMaterial({
	reflectivity: 0,
	clearcoat: 1,
	clearcoatRoughness: 1,
	metalness: 0,
	roughness: .5,
	flatShading: true,
	vertexColors: FaceColors,
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

	getColor()
	{
		return exports.COLOR;
	}
}
