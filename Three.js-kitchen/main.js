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
	const planeSize = 40;

	const loader = new THREE.TextureLoader();
	const texture = loader.load('./textures/wood-floor.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.NearestFilter;
	const repeats = planeSize / 2;
	texture.repeat.set(repeats, repeats);

	const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
	const planeMat = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(planeGeo, planeMat);
	mesh.rotation.x = Math.PI * -.5;
	scene.add(mesh);

	// Adding cube
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({color: 0x44aa88});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	// Adding dircetional light
	const color = 0xFFFFFF;
	const intensity = 1;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(0, 1, 0);
	scene.add(light);

	// Camera controls
	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.update();

	// Animation loop
	var animate = function() {
		requestAnimationFrame(animate);

		//cube.rotation.x += 0.01;
		//cube.rotation.y += 0.01;

		controls.update();

		renderer.render(scene, camera);
	}

	animate();
}

main();


