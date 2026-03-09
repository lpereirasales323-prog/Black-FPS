let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

let renderer = new THREE.WebGLRenderer({antialias:true})

renderer.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(renderer.domElement)

let light = new THREE.HemisphereLight(0xffffff,0x444444,1)
scene.add(light)

camera.position.y=1.7

let controls = new THREE.PointerLockControls(camera,document.body)

document.body.onclick=()=>controls.lock()

scene.add(controls.getObject())

let floorGeo = new THREE.PlaneGeometry(200,200)
let floorMat = new THREE.MeshPhongMaterial({color:0x222222})
let floor = new THREE.Mesh(floorGeo,floorMat)

floor.rotation.x=-Math.PI/2

scene.add(floor)

let obstacles=[]

for(let i=0;i<40;i++){

let geo = new THREE.BoxGeometry(4,4,4)

let mat = new THREE.MeshPhongMaterial({color:0x555555})

let box = new THREE.Mesh(geo,mat)

box.position.x=Math.random()*100-50
box.position.z=Math.random()*100-50
box.position.y=2

scene.add(box)

obstacles.push(box)

}

let gunGeo = new THREE.BoxGeometry(0.3,0.3,1)

let gunMat = new THREE.MeshBasicMaterial({color:0x111111})

let gun = new THREE.Mesh(gunGeo,gunMat)

gun.position.set(0.5,-0.5,-1)

camera.add(gun)

scene.add(camera)

let enemies=[]

function spawnEnemy(){

let geo = new THREE.BoxGeometry(1,2,1)

let mat = new THREE.MeshPhongMaterial({color:0xff0000})

let enemy = new THREE.Mesh(geo,mat)

enemy.position.x=Math.random()*80-40
enemy.position.z=Math.random()*80-40
enemy.position.y=1

enemy.hp=3

scene.add(enemy)

enemies.push(enemy)

}

for(let i=0;i<10;i++)spawnEnemy()

let raycaster = new THREE.Raycaster()

let kills=0

function shoot(){

raycaster.setFromCamera(new THREE.Vector2(0,0),camera)

let hits=raycaster.intersectObjects(enemies)

if(hits.length>0){

let e=hits[0].object

e.hp--

if(e.hp<=0){

scene.remove(e)

enemies.splice(enemies.indexOf(e),1)

kills++

document.getElementById("kills").innerText=kills

spawnEnemy()

}

}

}

document.addEventListener("mousedown",shoot)

let hp=100

function enemyAI(){

enemies.forEach(e=>{

let dir=camera.position.clone().sub(e.position)

let dist=dir.length()

if(dist<25){

dir.normalize()

e.position.add(dir.multiplyScalar(0.03))

}

if(dist<2){

hp--

document.getElementById("hp").innerText=hp

}

})

}

let keys={}

document.addEventListener("keydown",e=>keys[e.key]=true)

document.addEventListener("keyup",e=>keys[e.key]=false)

function moveKeyboard(){

let speed=0.15

if(keys["w"])controls.moveForward(speed)
if(keys["s"])controls.moveForward(-speed)
if(keys["a"])controls.moveRight(-speed)
if(keys["d"])controls.moveRight(speed)

}

function gamepad(){

let gp=navigator.getGamepads()[0]

if(!gp)return

let moveX=gp.axes[0]

let moveZ=gp.axes[1]

controls.moveRight(moveX*0.2)

controls.moveForward(moveZ*0.2)

if(gp.buttons[0].pressed)shoot()

}

function animate(){

requestAnimationFrame(animate)

moveKeyboard()

gamepad()

enemyAI()

renderer.render(scene,camera)

}

animate()
🚀 Como colocar o
