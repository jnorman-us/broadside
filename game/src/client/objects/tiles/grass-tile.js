const { MeshPhysicalMaterial, FaceColors } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'grass-tile';

exports.COLOR = '#7cfc00',

exports.MATERIAL = new MeshPhysicalMaterial({
	color: exports.COLOR,
	reflectivity: 0,
	clearcoat: 1,
	clearcoatRoughness: 1,
	metalness: 0,
	roughness: .5,
	flatShading: true,
});

exports.Obj = class GrassTile extends Tile.Obj
{
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
