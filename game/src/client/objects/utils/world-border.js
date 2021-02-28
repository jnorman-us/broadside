const GameObject = require('../game-object.js');
const KeyValue = require('../key-value.js');

exports.TYPE = 'world-border';

exports.Obj = class WorldBorder extends GameObject.Obj
{
	constructor(id)
	{
		super(id);

		this.border_width = this.addKeyValue(new KeyValue('border_width'));
		this.border_height = this.addKeyValue(new KeyValue('border_height'));
		this.border_thickness = this.addKeyValue(new KeyValue('border_thickness'));
	}

	addTo(u_interface)
	{
		// this will be added to the interface to make sure the camera doesn't go past the world-border
	}

	getType()
	{
		return exports.TYPE;
	}
}
