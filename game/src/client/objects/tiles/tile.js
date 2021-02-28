const GameObject = require('../game-object.js');
const KeyValue = require('../key-value.js');

exports.TYPE = 'tile';

exports.Obj = class Tile extends GameObject.Obj
{
	constructor(id)
	{
		super(id);

		this.radius = this.addKeyValue(new KeyValue('radius'));
		this.height = this.addKeyValue(new KeyValue('height'));
		this.adjacents = this.addKeyValue(new KeyValue('adjacents'));
	}

	addTo(terrain)
	{
		terrain.addTile(this);
	}
}
