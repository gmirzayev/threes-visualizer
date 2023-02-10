import * as THREE from 'three';

//src="/public/Intro.mp3"
const audioPlayer = document.querySelector('audio');
audioPlayer.src = "/Intro.mp3";
const audioContext = new AudioContext();
const audioSource = audioContext.createMediaElementSource(audioPlayer);

const analyser = audioContext.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, 1, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

const spinningCollection = new THREE.Group();
// const cubeSegment = new THREE.Group();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00bfff } );
const cubeArray = [];


for(let x = -1; x < 2; x++) {
  for(let y = -1; y < 2; y++) {
    for(let z = -1; z < 2; z++) {
      const material = new THREE.MeshBasicMaterial( { color: new THREE.Color(Math.random(),Math.random(),Math.random()) } );
      const mesh = new THREE.Mesh( geometry, material );
      mesh.position.set(x*1.1,y*1.1, z*1.1);
      cubeArray.push(mesh);
      spinningCollection.add( mesh );
    }
  }
}

scene.add( spinningCollection );

camera.position.z = 5;

function animate() {
  if (audioPlayer.duration > 0 && !audioPlayer.paused) {
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < cubeArray.length; i++) {
      const scaleX = dataArray[i];
      cubeArray[i].scale.x = (scaleX/100)+1;
      console.log(scaleX);
      console.log(cubeArray[i]);
    }
  }
  // analyser.getByteFrequencyData(dataArray);
  // console.log(dataArray);
	requestAnimationFrame( animate );
  spinningCollection.rotation.x += 0.01;
  spinningCollection.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();