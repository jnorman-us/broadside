const { MeshPhysicalMaterial } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'grass-tile';

exports.MATERIAL = new MeshPhysicalMaterial({
	color: '#7cfc00',
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
}
