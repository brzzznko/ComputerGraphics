const WIDTH = window.innerWidth - 15
const HEIGHT = window.innerHeight - 100

const FOV = 90
const ASPECT = WIDTH/HEIGHT
const NEAR = 0.1
const FAR = 1000


function main() {
	// Create scene, camera and render
	var scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAAAAAA);

	var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
	camera.position.z = 5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);
	
	//Floor
	const planeSize = 10;

	const loader = new THREE.TextureLoader();
	const texture = loader.load('https://borzzzenko.github.io/ComputerGraphics/Three.js-kitchen/textures/wood-floor.jpg');
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
	floor.rotation.x = Math.PI * -.5;
	floor.position.y += 0.1
	scene.add(floor);

	// Adding room walls
	var geometry = new THREE.BoxGeometry(10, 5, 10);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide
	});
	var roomCube = new THREE.Mesh(geometry, material);
	roomCube.position.y += 2.5
	scene.add(roomCube);

	// Light
	const light = new THREE.PointLight( 0xffffff, 1, 15);
	light.position.set(0, 4, 0);
	scene.add( light );

	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	// Load Lamps model
	const mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath('https://borzzzenko.github.io/ComputerGraphics/Three.js-kitchen/models/')
	mtlLoader.load('lamp.mtl', (materials) => {
		materials.preload();

		const objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('https://borzzzenko.github.io/ComputerGraphics/Three.js-kitchen/models/');
		objLoader.load('lamp.obj', (root) => {
				root.scale.set(0.0025, 0.0025, 0.0025)
				root.position.y += 4.33
				scene.add(root);
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


