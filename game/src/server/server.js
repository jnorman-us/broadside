const { Engine, Render, World } = require('matter-js');

const noSuchTypeError = require('../errors/no-such-type.js');

// a list of all instantiable game object classes
const WaterTile = require('./objects/tiles/water-tile.js');
const SandTile = require('./objects/tiles/sand-tile.js');
const GrassTile = require('./objects/tiles/grass-tile.js');
const WorldBorder = require('./objects/utils/world-border.js');

module.exports = class Server
{
	constructor()
	{
		this.engine = Engine.create();
		this.engine.world.gravity.y = 0;
		this.world = this.engine.world;

		this.id_iterator = 0;
		this.game_objects = new Map();
	}

	start()
	{
		this.engine_runner = setInterval(this.tick.bind(this), 50);
	}

	tick()
	{
		Engine.update(this.engine, 50);
	}

	stop()
	{
		clearInterval(this.engine_runner);
	}

	addObject(base)
	{
		this.id_iterator = base.id != null ? base.id : this.id_iterator;

		var game_object = null;

		switch(base.type)
		{
			case GrassTile.TYPE:
				game_object = new GrassTile.Obj(this.id_iterator);
				break;
			case SandTile.TYPE:
				game_object = new SandTile.Obj(this.id_iterator);
				break;
			case WaterTile.TYPE:
				game_object = new WaterTile.Obj(this.id_iterator);
				break;
			case WorldBorder.TYPE:
				game_object = new WorldBorder.Obj(this.id_iterator);
				break;
			default:
				game_object = null;
				break;
		}

		if(game_object == null)
			throw noSuchTypeError(base.type);
		game_object.initialize(base);
		game_object.addTo(this.world);

		this.game_objects.set(game_object.id, game_object);
		this.id_iterator ++;
	}

	mount(mount_element)
	{
		this.mount_element = mount_element;
		this.render = Render.create({
			element: this.mount_element,
			engine: this.engine,
			options: {
				wireframes: false,
				width: this.mount_element.clientWidth,
				height: this.mount_element.clientHeight,
			}
		});

		Render.run(this.render);
	}

	unmount()
	{
		Render.stop(this.render);

		this.render = null;
	}
}
