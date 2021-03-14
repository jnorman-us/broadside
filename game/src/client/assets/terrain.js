const { Mesh, MeshStandardMaterial, PlaneBufferGeometry } = require('three');

const WaterMaterial = require('./materials/water.js');

const WaterTile = require('../objects/tiles/water-tile.js');
const SandTile = require('../objects/tiles/sand-tile.js');
const GrassTile = require('../objects/tiles/grass-tile.js');

module.exports = class Terrain
{
	constructor()
	{
		this.land_tiles = new Map(); // id, tile
		this.subsea_tiles = new Map();

		const width = 3100;
		const height = 1800;

		this.water = new Mesh(new PlaneBufferGeometry(width + 5, height + 5, 32, 32), new WaterMaterial.WaterMaterial({
			roughness: .2,
			metalness: .2,
		}));

		this.water = new Mesh(new PlaneBufferGeometry(width + 5, height + 5, 32, 32), new MeshStandardMaterial({
			color: 0x00dfff,
		}));
		this.water.rotation.set(-Math.PI / 2, 0, 0, "YXZ");
		this.water.position.set(width / 2 - 5, 0, height / 2 - 5)
		this.water.receiveShadow = true;
		this.water.castShadow = true;
	}

	addTile(tile)
	{
		var which_tiles = null;

		switch(tile.type)
		{
			case GrassTile.TYPE:
			case SandTile.TYPE:
				which_tiles = this.land_tiles;
				break;
			case WaterTile.TYPE:
				which_tiles = this.subsea_tiles;
				break;
		}
		which_tiles.set(tile.id, tile);
	}

	generate(scene)
	{
		for(const [id, tile] of this.land_tiles)
		{
			scene.add(tile.generateMesh(this.land_tiles));
		}
		for(const [id, tile] of this.subsea_tiles)
		{
			scene.add(tile.generateMesh(this.subsea_tiles));
		}

		scene.add(this.water);

	}
}
