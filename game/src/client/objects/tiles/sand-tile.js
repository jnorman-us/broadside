const Tile = require('./tile.js');

exports.TYPE = 'sand-tile';

exports.Obj = class SandTile extends Tile.Obj
{
	getType()
	{
		return exports.TYPE;
	}
}
