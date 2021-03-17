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
		const width = radius * Math.cos(Math.PI / 4);
		const height = this.height.value;

		const adjacents = this.adjacents.value;
		console.log(adjacents);

		const left_nbr = (adjacents[0] != null && neighbors.has(adjacents[0]))
			? neighbors.get(adjacents[0]) : null;
		const top_nbr = (adjacents[1] != null && neighbors.has(adjacents[1]))
			? neighbors.get(adjacents[1]) : null;
		const right_nbr = (adjacents[2] != null && neighbors.has(adjacents[2]))
			? neighbors.get(adjacents[2]) : null;
		const bottom_nbr = (adjacents[3] != null && neighbors.has(adjacents[3]))
			? neighbors.get(adjacents[3]) : null;

		const left_height = left_nbr != null ? (left_nbr.height.value < height ? left_nbr.height.value : null) : -100;
		const top_height = top_nbr != null ? (top_nbr.height.value < height ? top_nbr.height.value : null) : -100;
		const right_height = right_nbr != null ? (right_nbr.height.value < height ? right_nbr.height.value : null) : -100;
		const bottom_height = bottom_nbr != null ? (bottom_nbr.height.value < height ? bottom_nbr.height.value : null) : -100;

		const vertices = [
			[-width, height, width], // bottom left 0
			[-width, height, -width], // top left 1
			[width, height, -width], // top right 2
			[width, height, width], // bottom right 3

			// left flap
			left_height != null ? [-width, left_height, width] : null, // 4
			left_height != null ? [-width, left_height, -width] : null, // 5

			// top flap
			top_height != null ? [-width, top_height, -width] : null, // 6
			top_height != null ? [width, top_height, -width] : null, // 7

			// right flap
			right_height != null ? [width, right_height, -width] : null, // 8
			right_height != null ? [width, right_height, width] : null, // 9

			// bottom flap
			bottom_height != null ? [width, bottom_height, width] : null, // 10
			bottom_height != null ? [-width, bottom_height, width] : null, // 11
		];

		console.log(vertices);
		console.log((vertices[10] != null ? vertices[4] : []))

		const vertex_output = new Float32Array([
			...vertices[0],
			...vertices[2],
			...vertices[1],

			...vertices[0],
			...vertices[3],
			...vertices[2],

			// left flap
			...(vertices[4] != null ? vertices[0] : []),
			...(vertices[4] != null ? vertices[1] : []),
			...(vertices[4] != null ? vertices[4] : []),

			...(vertices[4] != null ? vertices[1] : []),
			...(vertices[4] != null ? vertices[5] : []),
			...(vertices[4] != null ? vertices[4] : []),

			// top flap
			...(vertices[6] != null ? vertices[1] : []),
			...(vertices[6] != null ? vertices[2] : []),
			...(vertices[6] != null ? vertices[6] : []),

			...(vertices[6] != null ? vertices[2] : []),
			...(vertices[6] != null ? vertices[7] : []),
			...(vertices[6] != null ? vertices[6] : []),

			// right flap
			...(vertices[8] != null ? vertices[2] : []),
			...(vertices[8] != null ? vertices[3] : []),
			...(vertices[8] != null ? vertices[8] : []),

			...(vertices[8] != null ? vertices[3] : []),
			...(vertices[8] != null ? vertices[9] : []),
			...(vertices[8] != null ? vertices[8] : []),

			// bottom flap
			...(vertices[10] != null ? vertices[3] : []),
			...(vertices[10] != null ? vertices[0] : []),
			...(vertices[10] != null ? vertices[10] : []),

			...(vertices[10] != null ? vertices[0] : []),
			...(vertices[10] != null ? vertices[11] : []),
			...(vertices[10] != null ? vertices[10] : []),
		]);

		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(vertex_output, 3));

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
