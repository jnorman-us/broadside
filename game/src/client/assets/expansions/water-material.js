/**
 * @author jbouny / https://github.com/jbouny
 *
 * Work based on :
 * @author Slayvin / http://slayvin.net : Flat mirror for three.js
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * @author Jonas Wagner / http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

THREE.Water = function (renderer, camera, scene, options) {

  THREE.Object3D.call(this);
  this.name = 'water_' + this.id;

  function optionalParameter (value, defaultValue) {
    return value !== undefined ? value : defaultValue;
  };

  options = options || {};

  this.matrixNeedsUpdate = true;

  var width = optionalParameter(options.textureWidth, 512);
  var height = optionalParameter(options.textureHeight, 512);
  this.clipBias = optionalParameter(options.clipBias, -0.0001);
  this.alpha = optionalParameter(options.alpha, 1.0);
  this.time = optionalParameter(options.time, 0.0);
  this.normalSampler = optionalParameter(options.waterNormals, null);
  this.sunDirection = optionalParameter(options.sunDirection, new THREE.Vector3(0.70707, 0.70707, 0.0));
  this.sunColor = new THREE.Color(optionalParameter(options.sunColor, 0xffffff));
  this.waterColor = new THREE.Color(optionalParameter(options.waterColor, 0x7F7F7F));
  this.eye = optionalParameter(options.eye, new THREE.Vector3(0, 0, 0));
  this.distortionScale = optionalParameter(options.distortionScale, 20.0);
  this.noiseScale = optionalParameter(options.noiseScale, 1.0);
  this.side = optionalParameter(options.side, THREE.FrontSide);
  this.fog = optionalParameter(options.fog, false);

  this.renderer = renderer;
  this.scene = scene;
  this.mirrorPlane = new THREE.Plane();
  this.normal = new THREE.Vector3(0, 0, 1);
  this.cameraWorldPosition = new THREE.Vector3();
  this.rotationMatrix = new THREE.Matrix4();
  this.lookAtPosition = new THREE.Vector3(0, 0, -1);
  this.clipPlane = new THREE.Vector4();

  if ( camera instanceof THREE.PerspectiveCamera ) {
    this.camera = camera;
  }
  else  {
    this.camera = new THREE.PerspectiveCamera();
    console.log(this.name + ': camera is not a Perspective Camera!')
  }

  this.textureMatrix = new THREE.Matrix4();

  this.mirrorCamera = this.camera.clone();

  this.texture = new THREE.WebGLRenderTarget(width, height);
  this.tempTexture = new THREE.WebGLRenderTarget(width, height);

  var mirrorShader = THREE.ShaderLib["water"];
  var mirrorUniforms = THREE.UniformsUtils.clone(mirrorShader.uniforms);

  this.material = new THREE.ShaderMaterial({
    fragmentShader: mirrorShader.fragmentShader,
    vertexShader: mirrorShader.vertexShader,
    uniforms: mirrorUniforms,
    transparent: true,
    side: this.side,
    fog: this.fog
  });

  this.mesh = new THREE.Object3D();

  this.material.uniforms.mirrorSampler.value = this.texture;
  this.material.uniforms.textureMatrix.value = this.textureMatrix;
  this.material.uniforms.alpha.value = this.alpha;
  this.material.uniforms.time.value = this.time;
  this.material.uniforms.normalSampler.value = this.normalSampler;
  this.material.uniforms.sunColor.value = this.sunColor;
  this.material.uniforms.waterColor.value = this.waterColor;
  this.material.uniforms.sunDirection.value = this.sunDirection;
  this.material.uniforms.distortionScale.value = this.distortionScale;
  this.material.uniforms.noiseScale.value = this.noiseScale;

  this.material.uniforms.eye.value = this.eye;

  if ( !THREE.Math.isPowerOfTwo(width) || !THREE.Math.isPowerOfTwo(height) ) {
    this.texture.generateMipmaps = false;
    this.tempTexture.generateMipmaps = false;
  }
};

THREE.Water.prototype = Object.create(THREE.Object3D.prototype);

THREE.Water.prototype.renderWithMirror = function (otherMirror) {

  // update the mirror matrix to mirror the current view
  this.updateTextureMatrix();
  this.matrixNeedsUpdate = false;

  // set the camera of the other mirror so the mirrored view is the reference view
  var tempCamera = otherMirror.camera;
  otherMirror.camera = this.mirrorCamera;

  // render the other mirror in temp texture
  otherMirror.render(true);

  // render the current mirror
  this.render();
  this.matrixNeedsUpdate = true;

  // restore material and camera of other mirror
  otherMirror.camera = tempCamera;

  // restore texture matrix of other mirror
  otherMirror.updateTextureMatrix();
};

THREE.Water.prototype.updateTextureMatrix = function () {
  if ( this.parent !== undefined ) {
    this.mesh = this.parent;
  }
  function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }

  this.updateMatrixWorld();
  this.camera.updateMatrixWorld();

  this.cameraWorldPosition.setFromMatrixPosition(this.camera.matrixWorld);

  this.rotationMatrix.extractRotation(this.matrixWorld);

  this.normal = (new THREE.Vector3(0, 0, 1)).applyEuler(this.mesh.rotation);
  var cameraPosition = this.camera.position.clone().sub( this.mesh.position );
  if ( this.normal.dot(cameraPosition) < 0 ) {
    var meshNormal = (new THREE.Vector3(0, 0, 1)).applyEuler(this.mesh.rotation);
    this.normal.reflect(meshNormal);
  }

  var view = this.mesh.position.clone().sub(this.cameraWorldPosition);
  view.reflect(this.normal).negate();
  view.add(this.mesh.position);

  this.rotationMatrix.extractRotation(this.camera.matrixWorld);

  this.lookAtPosition.set(0, 0, -1);
  this.lookAtPosition.applyMatrix4(this.rotationMatrix);
  this.lookAtPosition.add(this.cameraWorldPosition);

  var target = this.mesh.position.clone().sub(this.lookAtPosition);
  target.reflect(this.normal).negate();
  target.add(this.mesh.position);

  this.up.set(0, -1, 0);
  this.up.applyMatrix4(this.rotationMatrix);
  this.up.reflect(this.normal).negate();

  this.mirrorCamera.position.copy(view);
  this.mirrorCamera.up = this.up;
  this.mirrorCamera.lookAt(target);
  this.mirrorCamera.aspect = this.camera.aspect;

  this.mirrorCamera.updateProjectionMatrix();
  this.mirrorCamera.updateMatrixWorld();
  this.mirrorCamera.matrixWorldInverse.getInverse(this.mirrorCamera.matrixWorld);

  // Update the texture matrix
  this.textureMatrix.set(0.5, 0.0, 0.0, 0.5,
              0.0, 0.5, 0.0, 0.5,
              0.0, 0.0, 0.5, 0.5,
              0.0, 0.0, 0.0, 1.0);
  this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
  this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

  // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
  // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
  this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal, this.mesh.position);
  this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);

  this.clipPlane.set(this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant);

  var q = new THREE.Vector4();
  var projectionMatrix = this.mirrorCamera.projectionMatrix;

  q.x = (sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
  q.y = (sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
  q.z = -1.0;
  q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

  // Calculate the scaled plane vector
  var c = new THREE.Vector4();
  c = this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(q));

  // Replacing the third row of the projection matrix
  projectionMatrix.elements[2] = c.x;
  projectionMatrix.elements[6] = c.y;
  projectionMatrix.elements[10] = c.z + 1.0 - this.clipBias;
  projectionMatrix.elements[14] = c.w;

  var worldCoordinates = new THREE.Vector3();
  worldCoordinates.setFromMatrixPosition(this.camera.matrixWorld);
  this.eye = worldCoordinates;
  this.material.uniforms.eye.value = this.eye;
};

THREE.Water.prototype.render = function (isTempTexture) {

  if ( this.matrixNeedsUpdate ) {
    this.updateTextureMatrix();
  }

  this.matrixNeedsUpdate = true;

  // Render the mirrored view of the current scene into the target texture
  if ( this.scene !== undefined && this.scene instanceof THREE.Scene ) {
    // Remove the mirror texture from the scene the moment it is used as render texture
    // https://github.com/jbouny/ocean/issues/7
    this.material.visible = false;

    var renderTexture = (isTempTexture !== undefined && isTempTexture)? this.tempTexture : this.texture;
    this.renderer.render(this.scene, this.mirrorCamera, renderTexture, true);

    this.material.visible = true;
    this.material.uniforms.mirrorSampler.value = renderTexture;
  }

};
