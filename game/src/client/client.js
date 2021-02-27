const { AxesHelper, Scene } = require('three');

const Interface = require('./interface/interface.js');

module.exports = class Client
{
	constructor()
	{
		this.scene = new Scene();
		this.scene.add(new AxesHelper(1000));

		this.interface = new Interface();
	}

	start()
	{
		this.animate();
	}

	animate()
	{
		requestAnimationFrame(this.animate.bind(this));

		if(this.interface.mounted)
		{
			this.interface.render(this.scene);
		}
	}

	mount(mount_element)
	{
		this.interface.mount(this.scene, mount_element);
	}

	unmount()
	{
		this.interface.unmount(this.scene);
	}
}
