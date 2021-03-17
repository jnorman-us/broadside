const { Mesh, MeshStandardMaterial, PlaneBufferGeometry } = require('three');

const WaterMaterial = require('../assets/materials/water.js');

const WaterTile = require('../objects/tiles/water-tile.js');
const SandTile = require('../objects/tiles/sand-tile.js');
const GrassTile = require('../objects/tiles/grass-tile.js');

module.exports = class Terrain
{
	constructor()
	{
		this.tiles = new Map(); // id, tile

		const tile_width = 8;
		const side_length = 64;

		const height = 2 * tile_width * side_length;
		const width = height;

		/*this.water = new Mesh(new PlaneBufferGeometry(width + 5, height + 5, 32, 32), new WaterMaterial.WaterMaterial({
			roughness: .2,
			metalness: .2,
			attach: 'material',
			lights: true,
		}));*/

		this.water = new Mesh(new PlaneBufferGeometry(width, height, 32, 32), new MeshStandardMaterial({
			color: 0x00dfff,
		}));
		this.water.rotation.set(-Math.PI / 2, 0, 0, "YXZ");
		this.water.position.set(width / 2 - tile_width, 0, height / 2 - tile_width);
		this.water.receiveShadow = true;
		this.water.castShadow = true;
	}

	addTile(tile)
	{
		this.tiles.set(tile.id, tile);
	}

	generate(scene)
	{
		for(const [id, tile] of this.tiles)
		{
			scene.add(tile.generateMesh(this.tiles));
		}

		scene.add(this.water);

	}
}
