const { Vector } = require('matter-js');
const FileSystem = require('fs');

const HeightMap = require('./height-map.js');

const SIDE_LENGTH = 64;

const TOTAL_HEIGHT = 100;
const WATER_HEIGHT = 50;

const heightmap = new HeightMap(
	SIDE_LENGTH, // mapDimension
	1, // unitCount
	7, // roughness
	false, // tile
).mapData;

const tile_out = [];

// constants for radius etc
const radius = 8;
const a = Math.cos(Math.PI / 6) * radius;
const b = 3 / 2 * radius;

const height = heightmap.length;
var width = Math.min(heightmap[0].length, heightmap[1].length);
width = width % 2 == 0 ? width : width - 1;
const map_width = width / 2;

var index = 0;
for(var y = 0; y < height; y ++)
{
	var x = 0;
	for(var col = 0; col < width; col ++)
	{
		if((y % 2 == 0 && col % 2 == 0) || (y % 2 == 1 && col % 2 == 1))
		{
			index = y * map_width + x;

			var position = null;
			if(y % 2 == 0)
				position = Vector.create(x * 2 * b, y * a);
			else
				position = Vector.create(x * 2 * b + b, y * a);

			var tile_height = heightmap[y][col] * TOTAL_HEIGHT - WATER_HEIGHT;

			var type = '';
			if(tile_height >= 25)
				type = 'grass-tile';
			else if (tile_height >= 0)
			{
				type = 'sand-tile';
			}
			else
				type = 'water-tile';

			const adjacents = [];

			if(y % 2 != 0)
			{
				if(y - 1 >= 0) // top-left
					adjacents.push((y - 1) * map_width + x);
				else
					adjacents.push(null);
				if(y - 2 >= 0) // top
					adjacents.push((y - 2) * map_width + x);
				else
					adjacents.push(null);
				if(x + 1 < map_width && y - 1 >= 0) // top-right
					adjacents.push((y - 1) * map_width + (x + 1));
				else
					adjacents.push(null);
				if(x + 1 < map_width && y + 1 < height) // bottom-right
					adjacents.push((y + 1) * map_width + (x + 1));
				else
					adjacents.push(null);
				if(y + 2 < height) // bottom
					adjacents.push((y + 2) * map_width + x);
				else
					adjacents.push(null);
				if(y + 1 < height) // bottom-left
					adjacents.push((y + 1) * map_width + x);
				else
					adjacents.push(null);
			}
			else
			{
				if(y - 1 >= 0 && x - 1 >= 0) // top-left
					adjacents.push((y - 1) * map_width + (x - 1));
				else
					adjacents.push(null);
				if(y - 2 >= 0) // top
					adjacents.push((y - 2) * map_width + x);
				else
					adjacents.push(null);
				if(y - 1 >= 0) // top-right
					adjacents.push((y - 1) * map_width + x);
				else
					adjacents.push(null);
				if(y + 1 < height) // bottom-right
					adjacents.push((y + 1) * map_width + x);
				else
					adjacents.push(null);
				if(y + 2 < height) // bottom
					adjacents.push((y + 2) * map_width + x);
				else
					adjacents.push(null);
				if(y + 1 < height && x - 1 >= 0) // bottom-left
					adjacents.push((y + 1) * map_width + (x - 1));
				else
					adjacents.push(null);
			}

			tile_out.push({
				id: index,
				type: type,
				height: tile_height,
				position_x: position.x,
				position_y: position.y,
				adjacents: adjacents,
			});
			x ++;
		}
	}
}

const map_width_b = map_width * 2 * b - b;
const map_height = height * a - a;

tile_out.push({
	id: index ++,
	type: 'world-border',
	border_width: map_width_b,
	border_height: map_height,
	position_x: map_width_b / 2,
	position_y: map_height / 2,
});

FileSystem.writeFileSync('../frontend/src/test-map.json', JSON.stringify(tile_out));
