import React from 'react';

import { Client, Server } from 'game';

import test_map from './test-map.json';

import './styles/app.css';

export default class App extends React.Component
{
	constructor(props)
	{
		super(props);

		this.server = new Server();
		this.client = new Client();

		this.renderer_mount = null;
		this.physics_mount = null;

		console.log(this.server);

	}

	componentDidMount()
	{
		this.server.mount(this.physics_mount);
		this.server.start();

		this.client.mount(this.renderer_mount);
		this.client.start();

		for(const base of test_map)
		{
			this.server.addObject(base);
		}
	}

	render()
	{
		return (
			<div className="app">
				<div className="app-renderer" ref={
					ref => (this.renderer_mount = ref)
				} />
				<div className="app-physics" ref={
					ref => (this.physics_mount = ref)
				} />
			</div>
		);
	}
}
