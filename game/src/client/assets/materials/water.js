const { MeshStandardMaterial } = require('three');

function copyToShader(userData, shader)
{
	Object.keys(userData).forEach(key => {
		shader.uniforms[key] = userData[key]
	})
}

export class WaterMaterial extends MeshStandardMaterial
{
	constructor()
	{
		super();

		this.extensions = {
			derivatives: true, // set to use derivatives
			drawBuffers: false, // set to use draw buffers
			fragDepth: false, // set to use fragment depth values
			shaderTextureLOD: false, // set to use shader texture LOD
		}

		this.userData = {
			t: { value: 0 },
		}

		/* Manipulates meshphysical_vert.glsl and meshphysical_frag.glsl to support instances. */
		this.onBeforeCompile = (shader) => {
			copyToShader(this.userData, shader)
			shader['name'] = 'WaterMaterial'
			extendShader(shader)
		}
	}
}

function extendShader(shader)
{
	shader.vertexShader = shader.vertexShader
		// .replace('#include <color_pars_vertex>', DEFINE_VARYINGS)
		// .replace('#include <color_vertex>', OVERRIDE_COLOR_VERTEX)
		.replace('void main() {', INSERT_VERTEX_MAIN)
		.replace('#include <begin_vertex>', OVERRIDE_VERTEX)
		.replace('#include <beginnormal_vertex>', OVERRIDE_NORMAL)

	shader.fragmentShader = shader.fragmentShader
		// .replace('#include <color_pars_fragment>', DEFINE_VARYINGS)
		.replace('void main() {', INSERT_FRAG_MAIN)
		.replace('vec4 diffuseColor = vec4( diffuse, opacity );', OVERRIDE_DIFFUSE_COLOR)
}

/** Removes the #ifdef USE_COLOR block and adds additional graph space position varying. */
// const DEFINE_VARYINGS = `
//	 varying vec3 vMyNormal;
//	 `

// use the shader GLSL file to take advantage of syntax highlighting rather than embed inline
const INSERT_VERTEX_MAIN = `
attribute vec3 vert1;
attribute vec3 vert2;
attribute vec3 vert3;

uniform float t;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i	= floor(v + dot(v, C.yy) );
	vec2 x0 = v -	 i + dot(i, C.xx);
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod(i, 289.0);
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
	+ i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
		dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	vec3 g;
	g.x	= a0.x	* x0.x	+ h.x	* x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float calculateSurface(float x, float z) {
		float scale = 40.0;
		float y = snoise(vec2(x + t / 3.0,z + t / 3.0)) / 2.0;
		y += (sin(x * 1.0 / scale + t * 1.0) + sin(x * 2.3 / scale + t * 1.5) + sin(x * 3.3 / scale + t * 0.4)) / 3.0;
		y += (sin(z * 0.2 / scale + t * 1.8) + sin(z * 1.8 / scale + t * 1.8) + sin(z * 2.8 / scale + t * 0.8)) / 3.0;
		return y;
}

void main() {
`

/** Scales vertices per the instance data, and flattens the origin surface. */
const OVERRIDE_VERTEX = `
	float y = calculateSurface(position.x, position.z) + 2.2;

	vec3 transformed = vec3(position.z - 205.0, position.x - 20.0, y);
	`

/** Overrides normals for vertices on flattened origin surface. */
const OVERRIDE_NORMAL = `
	vec3 s1 = vec3(vert1.x, calculateSurface(vert1.x, vert1.z), vert1.z);
	vec3 s2 = vec3(vert2.x, calculateSurface(vert2.x, vert2.z), vert2.z);
	vec3 s3 = vec3(vert3.x, calculateSurface(vert3.x, vert3.z), vert3.z);

	vec3 objectNormal = normalize(cross(s2 - s3, s1 - s2));
`

const INSERT_FRAG_MAIN = `
precision mediump float;

	void main() {
`

const OVERRIDE_DIFFUSE_COLOR = `
	vec4 diffuseColor = vec4(vec3(0.0, 1.0, 1.0), opacity);
`
// vec3(0.0, 0.717, 1)
