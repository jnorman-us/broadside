const { AxesHelper, Scene } = require('three');

const noSuchObjectError = require('../errors/no-such-object.js');

const Terrain = require('./objects/tiles/terrain.js');

const GrassTile = require('./objects/tiles/grass-tile.js');
const SandTile = require('./objects/tiles/sand-tile.js');
const WaterTile = require('./objects/tiles/water-tile.js');
const WorldBorder = require('./objects/utils/world-border.js');

const Interface = require('./interface/interface.js');

module.exports = class Client
{
	constructor()
	{
		this.scene = new Scene();
		this.scene.add(new AxesHelper(1000));

		this.terrain = new Terrain();

		this.interface = new Interface();

		this.game_objects = new Map();
	}

	start()
	{
		this.animate();
	}

	animate()
	{
		requestAnimationFrame(this.animate.bind(this));

		if(this.interface.mounted)
		{
			this.interface.render(this.scene);
		}
	}

	addObject(base)
	{
		var game_object = null;

		switch(base.type)
		{
			case GrassTile.TYPE:
				game_object = new GrassTile.Obj(base.id);
				break;
			case SandTile.TYPE:
				game_object = new SandTile.Obj(base.id);
				break;
			case WaterTile.TYPE:
				game_object = new WaterTile.Obj(base.id);
				break;
			case WorldBorder.TYPE:
				game_object = new WorldBorder.Obj(base.id);
				break;
		}

		if(game_object == null)
			throw noSuchTypeError(base.type);
		game_object.initialize(base);

		switch(game_object.type)
		{
			case GrassTile.TYPE:
			case SandTile.TYPE:
			case WaterTile.TYPE:
				game_object.addTo(this.terrain);
				break;
			case WorldBorder.TYPE:
				game_object.addTo(this.interface);
				break;
			default:
				game_object.addTo(scene);
				break;
		}

		this.game_objects.set(game_object.id, game_object);
	}

	updateObject(update)
	{
		const game_object = this.game_objects.get(update.id);

		if(game_object != null)
		{
			game_object.update(update);
		}
		else throw noSuchObjectError(update.id);
	}

	mount(mount_element)
	{
		this.interface.mount(this.scene, mount_element);
	}

	unmount()
	{
		this.interface.unmount(this.scene);
	}
}
