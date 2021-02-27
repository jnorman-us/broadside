const { MathUtils, OrthographicCamera, Vector3, WebGLRenderer } = require('three');

module.exports = class RenderCamera
{
	constructor(mode)
	{
		this.camera = new OrthographicCamera(0, 0, 0, 0, -1000, 1000);
		this.camera.position.set(100, 100, 100);
		this.camera.lookAt(new Vector3(0, 0, 0));

		this.renderer = new WebGLRenderer();
		this.renderer.physicallyCorrectLights = true;
		this.renderer.shadowMap.enabled = true;
		this.renderer.autoClearColor = false;
	}

	get render_element()
	{
		return this.renderer.domElement;
	}

	get position()
	{
		return this.camera.position;
	}

	mount(scene, width, height)
	{
		const aspect = width / height;
		const d = 100;

		this.camera.left = aspect * -d;
		this.camera.right = aspect * d;
		this.camera.top = 1 * d;
		this.camera.bottom = -1 * d;
		this.camera.updateProjectionMatrix();

		scene.add(this.camera);

		this.renderer.setSize(width, height);
	}

	moveCamera(movement, zoom)
	{
		movement.add(this.camera.position);
		this.camera.position.lerp(movement, .5);
	}

	zoomCamera(zoom)
	{
		this.camera.zoom = MathUtils.lerp(this.camera.zoom, zoom, .1);
		this.camera.updateProjectionMatrix();
	}

	render(scene)
	{
		this.renderer.render(scene, this.camera);
	}

	unmount(scene)
	{
		scene.remove(this.camera);
	}
}
