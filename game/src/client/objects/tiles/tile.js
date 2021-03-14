const { BufferAttribute, BufferGeometry, Mesh, Vector3, Color, } = Three = require('three');

const notImplementedError = require('../../../errors/not-implemented.js');

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

		this.mesh = null;
	}

	addTo(terrain)
	{
		terrain.addTile(this);
	}

	generateMesh(neighbors)
	{
		const radius = this.radius.value;

		const vertices = [
			[0, this.height.value, 0], // center
			[0, 0, radius], // bottom, rotated to left
			[-radius * Math.sin(Math.PI / 3), 0, radius * Math.cos(Math.PI / 3)], // bottom left, rotated to top left
			[-radius * Math.sin(Math.PI / 3), 0, -radius * Math.cos(Math.PI / 3)], // top left, rotated to top right
			[0, 0, -radius], // top, rotated to bot right
			[radius * Math.sin(Math.PI / 3), 0, -radius * Math.cos(Math.PI / 3)], // top right, rotated to bottom right
			[radius * Math.sin(Math.PI / 3), 0, radius * Math.cos(Math.PI / 3)], // bottom right, rotated to bottom left
		];

		for(const vertex_id of [1, 2, 3, 4, 5, 6])
		{
			const adj_1 = this.adjacents.value[vertex_id - 1];
			const adj_2 = this.adjacents.value[vertex_id != 1 ? vertex_id - 2 : 5];

			const height_0 = this.height.value;
			const height_1 = (adj_1 != null && neighbors.has(adj_1)) ? neighbors.get(adj_1).height.value : null;
			const height_2 = (adj_2 != null && neighbors.has(adj_2)) ? neighbors.get(adj_2).height.value : null;


			var avg_height = 0;

			if(height_1 != null && height_2 != null)
				avg_height = (height_0 + height_1 + height_2) / 3;

			vertices[vertex_id][1] = avg_height;
		}

		const vertex_output = new Float32Array([
			...vertices[0],
			...vertices[2],
			...vertices[1],

			...vertices[0],
			...vertices[3],
			...vertices[2],

			...vertices[0],
			...vertices[4],
			...vertices[3],

			...vertices[0],
			...vertices[5],
			...vertices[4],

			...vertices[0],
			...vertices[6],
			...vertices[5],

			...vertices[0],
			...vertices[1],
			...vertices[6],
		]);

		var colors = [];

		for(var i = 0; i < 18; i ++)
		{
			const color = new Color(this.getColor());
			color.add(new Color(
                Three.Math.randFloat(-.03, .03),
                Three.Math.randFloat(-.03, .03),
                Three.Math.randFloat(-.03, .03),
			));

			colors = [ ...colors, color.r, color.g, color.b ];
		}

		const color_output = new Float32Array(colors);

		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(vertex_output, 3));
		geometry.setAttribute('color', new BufferAttribute(color_output, 3));

		const material = this.getMaterial();

		this.mesh = new Mesh(geometry, this.getMaterial());
		this.mesh.receiveShadow = true;
		this.mesh.castShadow = true;
		this.mesh.position.set(this.position_x.value, 0, this.position_y.value);
		this.mesh.rotation.set(0, this.angle.value, 0, "YXZ");

		return this.mesh;
	}

	getColor()
	{
		throw notImplementedError('Tile.getColor()');
	}

	getMaterial()
	{
		throw notImplementedError('Tile.getMaterial()');
	}
}
