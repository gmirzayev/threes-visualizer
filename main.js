import * as THREE from 'three';

//src="/public/Intro.mp3"
const audioPlayer = document.querySelector('audio');
audioPlayer.src = "/Intro.mp3";
const audioContext = new AudioContext();
const audioSource = audioContext.createMediaElementSource(audioPlayer);

const analyser = audioContext.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 128;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 125, 1, 0.1, 1000 );
camera.position.x = 2;
camera.position.z = 7;
camera.position.y = 4;
// camera.position.x = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 600, 600 );
document.body.appendChild( renderer.domElement );

const spinningCollection = new THREE.Group();
// const cubeSegment = new THREE.Group();

// const material = new THREE.MeshBasicMaterial( { color: 0x00bfff } );



// for(let x = -1; x < 2; x++) {
//   for(let y = -1; y < 2; y++) {
//     for(let z = -1; z < 2; z++) {
//       const material = new THREE.MeshStandardMaterial( { color: new THREE.Color(Math.random(),Math.random(),Math.random()) } );
//       material.roughness = 0.5;
//       const mesh = new THREE.Mesh( geometry, material );
//       mesh.position.set(0,y*1.1, z*1.1);
//       cubeArray.push(mesh);
//       spinningCollection.add( mesh );
//     }
//   }
// }
const cubeArray = [];
let faceHash = {
  'x': [-1,1],
  'y': [-1,1],
  'z': [-1,1]
}
for(let side in faceHash) {
  if(side === 'x') {
    const geometry = new THREE.BoxGeometry( 1, 0.25, 0.25 );
    for(let direction of faceHash[side]) {
      //create 9 cubes per side
      for(let y = 1; y < 2; y++) { 
        for(let z = 1; z < 2; z++) {
          const cubeGroup = new THREE.Group();
          
          // const material = new THREE.MeshStandardMaterial( { color: 'white' } );
          // const material = new THREE.MeshStandardMaterial( { color: new THREE.Color(Math.random(),Math.random(),Math.random()) } );
          // material.roughness = 0.5;
          // const mesh = new THREE.Mesh( geometry, material );
          const xCoordinate = direction;
          const yCoordinate = y * 1.1;
          const zCoordinate = z * 1.1;
          //create 16 "cubes" per cube
          for(let a = 0; a < 4; a++) {
            for(let b = 0; b < 4; b++) { 
              const material = new THREE.MeshStandardMaterial( { color: new THREE.Color(Math.random(),Math.random(),Math.random()) } );
              material.roughness = 0.5;
              const mesh = new THREE.Mesh( geometry, material );
              mesh.position.set(direction, 1 - .25 * a, 1 - .25 * b);
              cubeGroup.add(mesh);
            }
          }
          cubeGroup.position.set(xCoordinate, yCoordinate, zCoordinate);
          cubeArray.push({mesh: cubeGroup, scaleAxis: 'x', direction: direction, 'x':xCoordinate, 'y':yCoordinate, 'z':zCoordinate});
          spinningCollection.add( cubeGroup );
        }
      }
    }
  }
  // if(side === 'y') {
  //   const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //   for(let direction of faceHash[side]) {
  //     for(let x = -1; x < 2; x++) { 
  //       for(let z = -1; z < 2; z++) {
  //         const material = new THREE.MeshStandardMaterial( { color: 'white' } );
  //         material.roughness = 0.5;
  //         const mesh = new THREE.Mesh( geometry, material );
  //         const xCoordinate = x * 1.1;
  //         const yCoordinate = direction;
  //         const zCoordinate = z * 1.1;
  //         mesh.position.set(xCoordinate, yCoordinate, zCoordinate);
  //         cubeArray.push({mesh: mesh, scaleAxis: 'y', direction: direction, position: new THREE.Vector3(xCoordinate, yCoordinate, zCoordinate)});
  //         spinningCollection.add( mesh );
  //       }
  //     }
  //   }
  // }
  // if(side === 'z') {
  //   const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //   for(let direction of faceHash[side]) {
  //     for(let x = -1; x < 2; x++) { 
  //       for(let y = -1; y < 2; y++) {
  //         const material = new THREE.MeshStandardMaterial( { color: 'white' } );
  //         material.roughness = 0.5;
  //         const mesh = new THREE.Mesh( geometry, material );
  //         const xCoordinate = x * 1.1;
  //         const yCoordinate = y * 1.1;
  //         const zCoordinate = direction;
  //         mesh.position.set(xCoordinate, yCoordinate, zCoordinate);
  //         cubeArray.push({mesh: mesh, scaleAxis: 'z', direction: direction, position: new THREE.Vector3(xCoordinate, yCoordinate, zCoordinate)});
  //         spinningCollection.add( mesh );
  //       }
  //     }
  //   }
  // }
  
}
// 0 width, grows in +x, -x direction
// 0 height, grows in +y, -y
// 0 depth, grows in +z, -z

spinningCollection.rotation.x = -0.70;
spinningCollection.rotation.y = 0.78;
scene.add( spinningCollection );

const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
const sideLight = new THREE.PointLight( 0xE97451, 2, 4 );
sideLight.position.set(3,0.2,2); 
scene.add( sideLight );

const directionalLightAbove = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add(directionalLightAbove);

function animate() {
  if (audioPlayer.duration > 0 && !audioPlayer.paused) {
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < cubeArray.length; i++) {
      const scaleValue = dataArray[i];
      const cubeElement = cubeArray[i];
      
      switch(cubeElement.scaleAxis) {
        case 'x':
          cubeElement.mesh.scale.x = (scaleValue/100) || 0.1;
          console.log("x position",cubeElement['x']);
          console.log(cubeArray[i]);
          cubeElement.mesh.position.x = cubeElement['x']+((scaleValue/100)/2*cubeElement.direction);
          break;
        case 'y':
          cubeElement.mesh.scale.y = (scaleValue/100) || 0.1;
          cubeElement.mesh.position.y = cubeElement.position.y+((scaleValue/100)/2*cubeElement.direction);
          break;
        case 'z':
          cubeElement.mesh.scale.z = (scaleValue/100) || 0.1;
          cubeElement.mesh.position.z = cubeElement.position.z+((scaleValue/100)/2*cubeElement.direction);
          break;
        }
    }
  }
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();