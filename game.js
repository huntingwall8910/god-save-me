if (window.devicePixelRatio == 1){
    alert("please play at 100% zoom")
    window.location.reload()
}
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || localStorage.getItem("mobile")){
    alert("mobile user detected, sending to shadow realm")
    window.location.replace("youtube.com/@hw8910")
    localStorage.setItem("mobile",true)
}
const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
const body = document.getElementById("body")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let height = canvas.height
let width = canvas.width
let image = new Image()
image.src = "player.png"
let pelletColor = "yellow"
c.fillStyle = pelletColor
let pellets = false
let moving = {
    forward:false,
    backward:false,
    left:false,
    right:false,
}
let mouseX = 0;
let mouseY = 0;
window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

let hitbox = false;
class Player {
    constructor(x,y,health = 100){
        this.health = health
        this.totalHealth = health
        this.x = x
        this.y = y
        this.dx = this.dy = 0
        this.width = this.height = 100
        this.speed = 0.2
    }
    angleToMouse(){
        return Math.atan2(mouseY - (this.y + this.height/2), mouseX - (this.x + this.width/2))
    }
    wallCollisions(){
        if (this.x < 0) {
            this.x = 0 
            this.dx = -this.dx
        }
        if (this.x > width - this.width){
            this.x = width - this.width
            this.dx = -this.dx
        }
        if (this.y < 0) {
            this.y = 0 
            this.dy = -this.dy
        }
        if (this.y > height - this.height){
            this.y = height - this.height
            this.dy = -this.dy
        }
    }
    draw() {
        c.save();
        c.translate(this.x + this.width / 2, this.y + this.height / 2);
        c.rotate(this.angleToMouse());
        c.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        c.drawImage(image,this.x,this.y,this.width,this.height)
        c.restore();
        c.beginPath()
        c.strokeStyle = 'blue'
        if (hitbox){ 
            c.strokeRect(this.x,this.y,this.width,this.height)
            c.fillStyle = 'red'
            c.arc(this.x + this.width / 2, this.y + this.height / 2, 10,0,Math.PI * 2)
            c.fill()
        }
        if (this.health < this.totalHealth){
            c.fillStyle = `rgb(${255 - (this.health / this.totalHealth) * 255}, ${(this.health / this.totalHealth) * 255}, 0)`
            c.fillRect(this.x - 5,this.y + this.height + 5,(this.health * (this.width/ this.totalHealth)) + 5, 10)
        }
        c.closePath()
    }
    update(){
        this.wallCollisions()
        this.dy += moving.forward ? -this.speed : moving.backward ? this.speed : 0;
        this.dx += moving.left ? -this.speed : moving.right ? this.speed : 0;   
        this.dx *= 0.99
        this.dy *= 0.99
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
}
let player = new Player(width/2,height/2)
let pArr = []
class Pellet {
    constructor(angleOffset = 0,evil = false,pointToPlayer = false,x,y,r = 10, speed = 25, damage = 5,){
        this.evil = evil
        this.damage = damage
        this.radius = r
        if (!this.evil) {
            this.dx = speed * Math.cos(player.angleToMouse() + angleOffset)
            this.dy = speed *  Math.sin(player.angleToMouse() + angleOffset)
            this.x = player.x + player.width / 2 + this.dx
            this.y = player.y + player.height / 2 + this.dy
        }
        if (evil){
            this.x = x
            this.y = y
            this.dx = 0
            this.dy = 5
            if (pointToPlayer){
                const angleToPlayer = Math.atan2((player.y + player.height / 2)-this.y,(player.x + player.width / 2)-this.x)
                this.dx = speed * Math.cos(angleToPlayer)
                this.dy = speed * Math.sin(angleToPlayer)
            }
        }
    }
    draw(){
        c.beginPath()
        c.fillStyle = pelletColor
        c.arc(this.x,this.y,this.radius,0,Math.PI*2)
        c.fill()
        c.closePath()
    }
    update(){
        // if (this.x < 0 || this.x > width) this.dx = -this.dx
        // if (this.y < 0 || this.y > height) this.dy = -this.dy
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
    isOoB(){
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height
    }
}
function pelletCollision(pellet,rect){
    const closestX = Math.max(rect.x, Math.min(pellet.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(pellet.y, rect.y + rect.height));
    const dx = pellet.x - closestX;
    const dy = pellet.y - closestY;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < (pellet.radius * pellet.radius)) {
        // return true
        console.log("collision")
        pArr.splice(pArr.indexOf(pellet),1)
        rect.health -= pellet.damage
    }
    else {
        //return false
    }
}
function pelletPlayerCollision(pellet){
    let centerX = player.x + player.width / 2
    let centerY = player.y + player.height / 2
    let dist = Math.hypot(pellet.x - centerX, pellet.y - centerY)
    if (dist < 10){
        //
    }
}
class Enemy {
    constructor(x,y,w,h,c,dx,dy,health = 100){
        this.dx = dx
        this.dy = dy
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.color = c
        this.health = health
        this.totalHealth = health
    }
    draw(){
        c.fillStyle = this.color
        c.beginPath()
        c.fillRect(this.x,this.y,this.width,this.height)
        if (this.health < this.totalHealth){
            c.fillStyle = `rgb(${255 - (this.health / this.totalHealth) * 255}, ${(this.health / this.totalHealth) * 255}, 0)`
            c.fillRect(this.x - 5,this.y + this.height + 5,(this.health * (this.width/ this.totalHealth)) + 5, 10)
        }
        c.closePath()
    }
    update(){
        if (this.x < 0 || this.x + this.width > width) this.dx *= -1
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
}
let enemiesArr = []
enemiesArr.push(new Enemy(width * Math.random(),-75,50,50,"White",0,2,100))
function animate(){
    c.clearRect(0,0,width,height)
    player.update()
    if (enemiesArr.length <= 0) enemiesArr.push(new Enemy(width * Math.random(),-75,50,50,"White",0,2,100))
    function end(){
        document.body.removeChild(document.getElementById("canvas"))
        setTimeout(() =>{alert("u die")},10)
        window.location.reload()
    }
    if (player.health <= 0) end()
    for (i=0;i<pArr.length;i++){
        if (pArr[i].isOoB()){ 
            pArr.splice(i,1)
            continue
        }
        pArr[i].update()
    }
    for (i=0;i < enemiesArr.length;i++){
        if (!enemiesArr[i]) continue
        if (enemiesArr[i].y > height) end()
        enemiesArr[i].update()
        if (enemiesArr[i].health <=   0){
            enemiesArr.splice(i,1)
            continue
        }
    }
    for (let i = 0; i < enemiesArr.length; i++) {
        for (let j = 0; j < pArr.length; j++) {
            if (pArr[j].evil) pelletCollision(pArr[j],player)
            else pelletCollision(pArr[j],enemiesArr[i])
        }
      }
    canvas.style.backgroundPositionY = `${player.y / 20}px`
    canvas.style.backgroundPositionX = `${player.x / 20}px`
    requestAnimationFrame(animate)
}
animate()
let pelletInterval;
let count = 0;
window.addEventListener("keydown", (e) => {
    if (e.key == "w") moving.forward = true
    if (e.key == "a") moving.left = true
    if (e.key == "s") moving.backward = true
    if (e.key == "d") moving.right = true
    if (e.key == "c"){
        count++
        return
    }
    if (e.code === "Space" && !pelletInterval) {
        e.preventDefault()
        pelletInterval = setInterval(() => {
            pArr.push(new Pellet(0));        
        }, 100);
    }
})
window.addEventListener("keyup", (e) => {
    if (e.key == "r") new Enemy(width * Math.random(),100,50,50,"White",0,0,100)
    if (e.key == 'h') hitbox = !hitbox
    if (e.key == "p") console.log(pArr)
    if (e.key == "w") moving.forward = false
    if (e.key == "a") moving.left = false
    if (e.key == "s") moving.backward = false
    if (e.key == "d") moving.right = false
    if (e.key == "c"){
        if (count > 20){
            pArr.push(new Pellet(0,false,false,0,0,100,10,1000))
        }
        console.log(count)
        count = 0
        return
    }
    if (e.code === "Space" && pelletInterval) {
        clearInterval(pelletInterval);
        pelletInterval = null;
    }
})