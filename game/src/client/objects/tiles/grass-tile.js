const { MeshStandardMaterial } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'grass-tile';

exports.MATERIAL = new MeshStandardMaterial({
	color: 0x00ff00,
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
