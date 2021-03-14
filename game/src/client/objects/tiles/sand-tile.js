const { MeshStandardMaterial } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'sand-tile';

exports.MATERIAL = new MeshStandardMaterial({
	roughness: .95,
	transparent: false,
	color: '#ffecbc',
	flatShading: true,
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
