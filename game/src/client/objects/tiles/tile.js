const { Face3, BufferGeometry, Mesh, Vector3, SphereGeometry } = require('three');

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

	generateMesh()
	{
		const radius = this.radius.value;

		const vertices = [];
		vertices.push(new Vector3(0, 0, 0)); // 0
		vertices.push(new Vector3(0, 0, radius)); // 1, bottom, then left
		vertices.push(new Vector3(-radius * Math.sin(Math.PI / 3), 0, radius * Math.cos(Math.PI / 3))); // 2, bot left, then top left
		vertices.push(new Vector3(-radius * Math.sin(Math.PI / 3), 0, -radius * Math.cos(Math.PI / 3))); // 3, top left, then top right
		vertices.push(new Vector3(0, 0, -radius)); // 4, top, then bot right
		vertices.push(new Vector3(radius * Math.sin(Math.PI / 3), 0, -radius * Math.cos(Math.PI / 3))); // 5, top right, then bottom right
		vertices.push(new Vector3(radius * Math.sin(Math.PI / 3), 0, radius * Math.cos(Math.PI / 3))); // 6, bot right, then bot left

		const faces = [];
		faces.push(new Face3(0, 2, 1));
		faces.push(new Face3(0, 3, 2));
		faces.push(new Face3(0, 4, 3));
		faces.push(new Face3(0, 5, 4));
		faces.push(new Face3(0, 6, 5));
		faces.push(new Face3(0, 1, 6));

		const geometry = new SphereGeometry(radius, 32, 32);
		//geometry.vertices = vertices;
		//geometry.faces = faces;

		this.mesh = new Mesh(geometry, this.getMaterial());
		this.mesh.receiveShadow = true;
		this.mesh.castShadow = true;
		this.mesh.position.set(this.position_x.value, this.height.value, this.position_y.value);
		this.mesh.rotation.set(0, this.angle.value, 0, "YXZ");

		return this.mesh;
	}

	getMaterial()
	{
		throw notImplementedError('Tile.getMaterial()');
	}
}
