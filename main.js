import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, 1, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

const spinningCollection = new THREE.Group();
// const cubeSegment = new THREE.Group();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00bfff } );

for(let x = -1; x < 2; x++) {
  for(let y = -1; y < 2; y++) {
    for(let z = -1; z < 2; z++) {
      const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(Math.random(),Math.random(),Math.random()) } );
      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(x*1.1,y*1.1, z*1.1);
      spinningCollection.add( mesh );
    }
  }
}

scene.add( spinningCollection );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
  spinningCollection.rotation.x += 0.01;
  spinningCollection.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();