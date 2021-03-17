const { MeshStandardMaterial, FaceColors } = require('three');

const Tile = require('./tile.js');

exports.TYPE = 'sand-tile';

exports.COLOR = '#ffecbc';

exports.MATERIAL = new MeshStandardMaterial({
	roughness: .95,
	transparent: false,
	color: exports.COLOR,
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

	getColor()
	{
		return exports.COLOR;
	}
}
