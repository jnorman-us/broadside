const { Mesh, MeshPhysicalMaterial, PlaneGeometry } = require('three');

module.exports = class Terrain
{
	constructor()
	{
		this.tiles = new Map(); // id, tile

		const width = 500;

		this.water = new Mesh(new PlaneGeometry(width + 5, width + 5), new MeshPhysicalMaterial({
			color: 0xd4f1f9,
			metalness: 0,
			roughness: 0,
			alphaTest: 0.5,
			envMapIntensity: 1,
			depthWrite: false,
			transmission: .9, // use material.transmission for glass materials
			opacity: 1, // set material.opacity to 1 when material.transmission is non-zero
			transparent: true
		}));
		this.water.rotation.set(-Math.PI / 2, 0, 0, "YXZ");
		this.water.position.set(width / 2 - 5, 0, width / 2 - 5)

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
