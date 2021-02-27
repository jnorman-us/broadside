const { } = require('three');

const RenderCamera = require('./render-camera.js');

module.exports = class Interface
{
	constructor()
	{
		this.mount_element = null;

		this.render_camera = new RenderCamera();
	}

	mount(scene, mount_element)
	{
		this.mount_element = mount_element;
		this.mount_element.appendChild(this.render_camera.render_element);

		const width = this.mount_element.clientWidth;
		const height = this.mount_element.clientHeight;
		this.render_camera.mount(scene, width, height);
	}

	get mounted()
	{
		return this.mount_element != null;
	}

	update()
	{
		// on
	}

	render(scene)
	{
		this.render_camera.render(scene);
	}

	unmount(scene)
	{
		this.render_camera.unmount(scene);

		this.mount_element.removeChild(this.render_camera.render_element);
		this.mount_element = null;
	}
}
