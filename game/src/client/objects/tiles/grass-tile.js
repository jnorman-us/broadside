const { MeshStandardMaterial } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'grass-tile';

exports.MATERIAL = new MeshStandardMaterial({
	roughness: .95,
	transparent: false,
	color: 0x7cfc00,
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
