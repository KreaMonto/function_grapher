import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// functional Vairbles
// ----------------------------------

let graph = null
let scene

// Creating the function
// ----------------------------------

function functionGraper(func) {

// Main configuration
// ----------------------------------


// --------------------------------------------------------
// Main Setup
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000)

// creating the DOM canvas
document.body.appendChild(renderer.domElement)

// creating the scene
scene = new THREE.Scene()

// creating the camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)


// Setting up controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25;
controls.enableZoom = true
controls.update()


// Grid Helper -----> necesary this time
const gridHelper = new THREE.GridHelper(10, 10)
gridHelper.material.color.setHex(0x808080);
scene.add(gridHelper)


// Axes Helper -----> necesary this time
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)


// Camera initial position
camera.position.set(0, 3, 10)
camera.lookAt(axesHelper.position)


// Adding a plane
// -------------------------
// const planeGeometry = new THREE.PlaneGeometry(100, 100)
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, opacity: 0.1 })
// const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// plane.rotation.x = Math.PI / 2
// scene.add(plane)


// Data generation
// -------------------------
function generatePoints(func) {
    const points = [];
    const step = 0.1;
    const range = 2;

    for (let x = -range; x <= range; x += step) {
        for (let y = -range; y <= range; y += step) {
            const z = func(y, x);
            points.push(new THREE.Vector3(x, z, y));
        }
    }

    return points;
}

// Geometry creation
// ---------------------------------------
function createGeometry(points, normal) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);

    points.forEach((point, index) => {
        vertices[index * 3] = point.x; 
        vertices[index * 3 + 1] = point.y;
        vertices[index * 3 + 2] = point.z;

        const color = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
        };

        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: true });
    return new THREE.Mesh(geometry, material);
}

// Creating the MESH and adding to the scene
// ---------------------------------------
const points = generatePoints(func);
graph = createGeometry(points);
scene.add(graph);


// animation and render
// -------------------------

// -------------------------------------
function animate() {
    controls.update()
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

// Allowing the window resize
// -------------------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// -------------------------------------
} // End of the function


// Functions to be graphed
// -------------------------------------
function dot() {
    return Math.PI / 30;
}

function cone(x, y) {
    return Math.sqrt(x * x + y * y) / 2; 
}

function hyperbolicParaboloid(x, y) {
    return x * x - y * y; 
}

// funtions dict
const functions = {
    'cone' : cone,
    'hyperbolicParaboloid': hyperbolicParaboloid
}

// Calling the function
// ----------------------------------
functionGraper(dot)


// adding an element to select wich function to show
// ----------------------------------
const select = document.getElementById('selector')
select.innerHTML = `
<option value="none">Select a function...</option>
<option value="cone">Cone</option>
<option value="hyperbolicParaboloid">Hyperbolic Paraboloid</option>
`
console.log(select)

select.addEventListener('change', (e) => {
    const func = e.target.value
    console.log(func)
    if (graph) {
        scene.remove(graph)
        graph = null
    }
    // if func is undefined then renderizar cube
    if (func === 'none' || typeof func === 'undefined') {
        return
    }
    functionGraper(functions[`${func}`])
})
