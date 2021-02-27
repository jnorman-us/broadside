const { Bodies, Body } = require('matter-js');

const GameObject = require('../game-object.js');
const KeyValue = require('../key-value.js');

const Categories = require('../../categories.js');

exports.TYPE = 'world-border';

exports.Obj = class WorldBorder extends GameObject.Obj
{
	constructor(id)
	{
		super(id);

		this.border_width = this.addKeyValue(new KeyValue('border_width', false));
		this.border_height = this.addKeyValue(new KeyValue('border_height', false));
		this.border_thickness = this.addKeyValue(new KeyValue('border_thickness', false));
	}

	initialize(values)
	{
		values.border_thickness = 20;
		values.collision_category = Categories.Border;
		values.collision_mask = 0;
		values.moveable = false;
		values.angle = 0;

		super.initialize(values);
	}

	tick()
	{
		const angle = this.angle.value;

		Body.setAngle(this.body, angle + .1);

		this.angle.update(this.body.angle);
	}

	getType()
	{
		return exports.TYPE;
	}

	getBody()
	{
		const width = this.border_width.value;
		const height = this.border_height.value;
		const border = this.border_thickness.value;

		return Body.create({
			parts: [
				Bodies.rectangle(width / 2, 0 - border / 2, width, border), // top rect
				Bodies.rectangle(0 - border / 2, height / 2, border, height), // left rect
				Bodies.rectangle(width + border / 2, height / 2, border, height), // right rect,
				Bodies.rectangle(width / 2, height + border / 2, width, border),
			],
		});
	}
}
