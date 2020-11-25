const WIDTH = window.innerWidth - 15;
const HEIGHT = window.innerHeight - 100;

const URL = "https://borzzzenko.github.io/ComputerGraphics/Three.js-kitchen/";


function main() {
	// Create scene, camera and render
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAAAAAA);

	const FOV = 90;
	const ASPECT = WIDTH/HEIGHT;
	const NEAR = 0.1;
	const FAR = 1000;
	
	var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
	camera.position.z = 5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);
	
	// Floor
	const planeSize = 10;
	const loader = new THREE.TextureLoader();
	
	const texture = loader.load(URL + "textures/wood-floor.jpg");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	
	const repeats = planeSize / 2;
	texture.repeat.set(repeats, repeats);

	const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshPhongMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});
	
	const floor = new THREE.Mesh(planeGeo, planeMat);
	floor.rotation.x = Math.PI * -0.5;
	floor.position.y += 0.1;
	floor.receiveShadow = true;
	
	scene.add(floor);

	// Adding room walls
	let width = 10;
	let height = 5;
	let depth = 10;
	
	var geometry = new THREE.BoxGeometry(width, height, depth);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide
	});

	var roomCube = new THREE.Mesh(geometry, material);
	roomCube.receiveShadow = true;
	roomCube.position.y += 2.5;
	
	scene.add(roomCube);

	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	// Lamp fiber
	var fiberRadius = 0.2;
	var fiberHeight = 5;
	
	var fiberGeometry = new THREE.CylinderGeometry(fiberRadius,
		 fiberRadius, fiberHeight);
	var fiberMaterial = new THREE.MeshPhongMaterial();
	
	var lampFiber = new THREE.Mesh(fiberGeometry, fiberMaterial);
	lampFiber.position.y += 4.7;
	lampFiber.scale.set(0.1, 0.1, 0.1);
	
	scene.add(lampFiber);
	
	// Lamp
	var lampRadius = 2
	var lampSegments = 64

	var lampGeometry = new THREE.SphereGeometry(lampRadius, lampSegments,
		 lampSegments);
	var lampMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
	});
	
	var lamp = new THREE.Mesh(lampGeometry, lampMaterial);
	lamp.position.y += 4.5;
	lamp.scale.set(0.1, 0.1, 0.1);
	
	scene.add(lamp);

	// Lamp light
	var lampLightIntensity = 1;
	var lampLightDistance = 15;

	const lampLight = new THREE.PointLight( 0xffffff, lampLightIntensity,
		 lampLightDistance);
	lampLight.position.set(0, 3.8, 0);
	lampLight.castShadow = true;
	
	scene.add(lampLight);
	
	// Load chairs
	const mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath(URL + "models/")
	mtlLoader.load("chair.mtl", (materials) => {
		materials.preload();

		const objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath(URL + "models/");
		objLoader.load("chair.obj", (chair) => {
				chair.traverse(function(child){child.castShadow = true;});
				chair.scale.set(0.02, 0.02, 0.02)
				chair.rotation.x = Math.PI * -0.5;
				chair.rotation.z += Math.PI * -0.3;
				
				chair.position.y += 0.97
				chair.position.x += 3.1
				chair.position.z -= 1.3

				scene.add(chair);

				clone = chair.clone();
				clone.position.z += 3.4
				clone.position.x -= 1
				clone.rotation.z += Math.PI * -0.7;

				scene.add(clone);
		});
	})
	
	// Animation loop
	var animate = function() {
		requestAnimationFrame(animate);

		controls.update();

		renderer.render(scene, camera);
	}

	animate();
}

main();
