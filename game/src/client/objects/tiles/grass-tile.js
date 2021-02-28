const Tile = require('./tile.js');

exports.TYPE = 'grass-tile';

exports.Obj = class GrassTile extends Tile.Obj
{
	getType()
	{
		return exports.TYPE;
	}
}
