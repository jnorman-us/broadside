const { Vector } = require('matter-js');
const FileSystem = require('fs');

const HeightMap = require('./height-map.js');

const SIDE_LENGTH = 64;
const WIDTH = 8;
const RADIUS = WIDTH / Math.cos(Math.PI / 4);

console.log(RADIUS);

const HEIGHT_STEPS = 10;
const TOTAL_HEIGHT = 200;
const SAND_HEIGHT = 110;
const WATER_HEIGHT = 80;

const heightmap = new HeightMap(
	SIDE_LENGTH, // mapDimension
	1, // unitCount
	1, // roughness
	false, // tile
).mapData;

const tile_out = [];

var index = 0;
for(var y = 0; y < SIDE_LENGTH; y ++)
{
	for(var x = 0; x < SIDE_LENGTH; x ++)
	{
		var index = y * SIDE_LENGTH + x;

		var position = Vector.create(x * 2 * WIDTH, y * 2 * WIDTH);
		var tile_height = (Math.round(heightmap[y][x] * HEIGHT_STEPS) + .5) / HEIGHT_STEPS * TOTAL_HEIGHT; // 10 steps
		var type = '';

		if(tile_height >= SAND_HEIGHT)
			type = 'grass-tile';
		else if(tile_height >= WATER_HEIGHT)
			type = 'sand-tile';
		else
			type = 'water-tile';

		tile_height -= WATER_HEIGHT;

		const adjacents = [ null, null, null, null ];
		adjacents[0] = x - 1 >= 0 ? y * SIDE_LENGTH + (x - 1) : null; // left
		adjacents[1] = y - 1 >= 0 ? (y - 1) * SIDE_LENGTH + x : null; // top
		adjacents[2] = x + 1 < SIDE_LENGTH ? y * SIDE_LENGTH + (x + 1) : null; // right
		adjacents[3] = y + 1 < SIDE_LENGTH ? (y + 1) * SIDE_LENGTH + x : null; // bottom

		tile_out.push({
			id: index,
			type: type,
			height: tile_height,
			radius: RADIUS,
			position_x: position.x,
			position_y: position.y,
			adjacents: adjacents,
		});
	}
}

tile_out.push({
	id: index ++,
	type: 'world-border',
	border_width: SIDE_LENGTH * 2 * RADIUS,
	border_height: SIDE_LENGTH * 2 * RADIUS,
	position_x: SIDE_LENGTH * 2 * RADIUS / 2,
	position_y: SIDE_LENGTH * 2 * RADIUS / 2,
});

FileSystem.writeFileSync('../frontend/src/test-map.json', JSON.stringify(tile_out));
