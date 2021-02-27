const Three = require('three');

module.exports = class Client
{
	constructor()
	{
		this.mount_element = null;

		this.scene = new Three.Scene();
		this.scene.add(new Three.AxesHelper(1000));

		const material = new Three.ShaderMaterial({
			uniforms: {},
			vertexShader: [
				'void main() {',
				'	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
				'	gl_Position.x = gl_Position.x;',
				'}',
			].join('\n'),
			fragmentShader: [
				'void main() {',
				'	gl_FragColor = vec4(1, 1, 1, 1);',
				'}'
			].join('\n'),
		});

		this.scene.add(new Three.Mesh(
			new Three.PlaneGeometry(100, 100, 10, 10),
			material,
		));

		this.renderer = new Three.WebGLRenderer();

		this.camera = new Three.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
		this.camera.position.set(100, 100, 100);
		this.camera.lookAt(new Three.Vector3(0, 0, 0));
	}

	start()
	{
		this.animate();
	}

	animate()
	{
		requestAnimationFrame(this.animate.bind(this));

		this.render();
	}

	mount(mount_element)
	{
		this.mount_element = mount_element;
		this.mount_element.appendChild(this.renderer.domElement);

		this.renderer.setSize(this.mount_element.clientWidth, this.mount_element.clientHeight);

		const aspect = this.mount_element.clientWidth / this.mount_element.clientHeight;
		const d = 100;
		this.camera.left = aspect * -d;
		this.camera.right = aspect * d;
		this.camera.top = 1 * d;
		this.camera.bottom = 1 * -d;
		this.camera.updateProjectionMatrix();

		this.scene.add(this.camera);
	}

	render()
	{
		this.renderer.render(this.scene, this.camera);
	}

	unmount()
	{
		this.scene.remove(this.camera);
	}
}
