const { MeshBasicMaterial } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'sand-tile';

exports.MATERIAL = new MeshBasicMaterial({
	color: 0xffff00,
});

exports.Obj = class SandTile extends Tile.Obj
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
