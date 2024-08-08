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
const planeGeometry = new THREE.PlaneGeometry(5, 5, 100, 100)
const planeMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, opacity: 0.1 })
graph = new THREE.Mesh(planeGeometry, planeMaterial)
graph.rotation.x = -Math.PI / 2
graph.position.y = -1
graph.castShadow = true
graph.receiveShadow = true
scene.add(graph)

// defining colors
// -------------------------
const rainbowColors = [
    new THREE.Color(0xff0000), // Rojo
    new THREE.Color(0xffa500), // Naranja
    new THREE.Color(0x00ff00), // Verde
    new THREE.Color(0x0000ff)  // Azul
];


// Data handling
// -------------------------
const vertices = planeGeometry.attributes.position.array;
const colors = new Float32Array(vertices.length); // colors

const width = planeGeometry.parameters.width;
const height = planeGeometry.parameters.height;
const widthSegments = planeGeometry.parameters.widthSegments;
const heightSegments = planeGeometry.parameters.heightSegments;
const stepX = width / widthSegments;
const stepY = height / heightSegments;

for (let i = 0; i < vertices.length; i += 3) {
    const x = (i / 3 % (widthSegments + 1)) * stepX - width / 2;
    const y = Math.floor(i / 3 / (widthSegments + 1)) * stepY - height / 2;
    const z = func(x, y);
    vertices[i + 2] = z; 

    // Asign colors
    const colorIndex = Math.floor((i / 3) / ((widthSegments + 1) * (heightSegments + 1)) * rainbowColors.length);
    const color = rainbowColors[colorIndex];
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
}

planeGeometry.attributes.position.needsUpdate = true;
planeGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); 


// Lights
// -------------------------
const ambience = new THREE.AmbientLight(0x404040)
scene.add(ambience)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 20, 20)
light.castShadow = true
light.lookAt(axesHelper.position)
scene.add(light)

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
    return Math.PI / 2;
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

console.log(select)

select.addEventListener('change', (e) => {
    const func = e.target.value
    console.log(func)
    if (graph) {
        scene.remove(graph)
        scene.background = 0x000000
        graph = null
    }
    // if func is undefined then renderizar cube
    if (func === 'none' || typeof func === 'undefined') {
        return
    }
    functionGraper(functions[`${func}`])
})
