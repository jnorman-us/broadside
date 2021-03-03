const { } = require('three');

module.exports = class Terrain
{
	constructor(scene)
	{
		this.scene = scene;

		this.terrain_tiles = new Map(); // id, tile
	}

	addTile(tile)
	{
		tile.generateMesh();
		this.scene.add(tile.mesh);
	}
}
