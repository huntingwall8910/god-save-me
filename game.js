if (window.devicePixelRatio !== 1){
    alert("please play at 100% zoom")
    window.location.reload()
}
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || localStorage.getItem("mobile")){
    alert("mobile isnt supported, sending to shadow realm")
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
c.fillStyle = "yellow"
c.lineWidth = 5
let pellets = false
let moving = {
    forward:false,
    backward:false,
    left:false,
    right:false,
}
let mouseX = 0;
let mouseY = 0;
let stopped = false;
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
        c.strokeStyle = 'green'
        if (hitbox) c.strokeRect(this.x,this.y,this.width,this.height)
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
        if (Math.abs(this.dx) > 15) this.dx = this.dx > 0 ? 15 : -15
        if (Math.abs(this.dy) > 15) this.dy = this.dy > 0 ? 15 : -15
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
    constructor(angleOffset = 0,evil = false,pointToPlayer = false,x,y,r = 10, speed = 25, damage = 5,wallBounce = false){
        this.evil = evil
        this.damage = damage
        this.radius = r
        this.wb = wallBounce
        if (!this.evil) {
            this.dx = speed * Math.cos(player.angleToMouse() + angleOffset)
            this.dy = speed *  Math.sin(player.angleToMouse() + angleOffset)
            this.x = player.x + player.width / 2 + this.dx
            this.y = player.y + player.height / 2 + this.dy
        }
        if (evil){
            this.x = x
            this.y = y
            this.dx = speed * Math.cos(angleOffset)
            this.dy = speed *  Math.sin(angleOffset)
            if (pointToPlayer){
                const angleToPlayer = Math.atan2((player.y + player.height / 2)-this.y,(player.x + player.width / 2)-this.x)
                this.dx = speed * Math.cos(angleToPlayer)
                this.dy = speed * Math.sin(angleToPlayer)
            }
        }
    }
    draw(){
        c.beginPath()
        c.fillStyle = "yellow"
        if (this.evil) c.fillStyle = "red"
        c.arc(this.x,this.y,this.radius,0,Math.PI*2)
        c.fill()
        c.closePath()
    }
    update(){
        if (this.wb){ 
            if (this.x < 0 || this.x > width) {
                this.dx = -this.dx
            }
        }
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
    isOoB(){
        return this.x < 0 || this.x > width || this.y < 0 || this.y > height
    }
}
function pelletCollision(pellet,rect,isPlayer = false){
    const closestX = Math.max(rect.x, Math.min(pellet.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(pellet.y, rect.y + rect.height));
    if (isPlayer){
        const centerX = player.x + player.width / 2;
        const centerY = player.y + player.height / 2;
        const dx = centerX - pellet.x;
        const dy = centerY - pellet.y;
        const dist = Math.hypot(dx, dy);
        if (dist < pellet.radius + 10) {
            pArr.splice(pArr.indexOf(pellet),1)
            console.log("pellet touch player");
            player.health -= pellet.damage
        }
    }
    else {
        const dx = pellet.x - closestX;
        const dy = pellet.y - closestY;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < (pellet.radius * pellet.radius)) {
            // return true
            console.log("collision")
            pArr.splice(pArr.indexOf(pellet),1)
            rect.health -= pellet.damage
        }
    }
}
//reverse pelletCollision due to player circle hitbox
function playerEnemyCollision(enemy){
    let centerX = player.x + player.width / 2
    let centerY = player.y + player.height / 2
    let closestX = Math.max(enemy.x, Math.min(centerX, enemy.x + enemy.width))
    let closestY = Math.max(enemy.y, Math.min(centerY, enemy.y + enemy.height))
    if (((centerX - closestX) ** 2 + (centerY - closestY) ** 2) < 400){
        console.log("enemy touch player")
        player.health -= 1
    }
}
function summonPelletArc(x,y,offset,startAngle,endAngle,amount){
    const increment = (endAngle - startAngle) / amount
    for (i=0;i<amount;i++){
        pArr.push(new Pellet(increment * i + offset,true,false,x,y,10,10,5,true))
    }
}
class Enemy {
    constructor(x,y,w,h,c,dx,dy,health = 100,behavior = 1){
        this.dx = dx
        this.dy = dy
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        if (/\./.test(c)){
            this.image = new Image()
            this.image.src = c
        }
        else {
            this.color = c
        }
        this.health = health
        this.totalHealth = health
        console.log("constructed")
        this.counter = 0
        this.behavior = behavior
        this.start()
    }
    start(){
        if (this.behavior == 2){
            this.shootInterval = setInterval(() => {
                summonPelletArc(this.x + this.width /2,this.y + this.height / 2,this.counter,0,Math.PI * 2, 10)
                this.counter += 0.1
            },250)
            console.log(this.shootInterval)
        }
    }
    stop(){
        if (this.shootInterval) {
            clearInterval(this.shootInterval);
            this.shootInterval = null;
        }
    }
    draw(){
        if (this.color) c.fillStyle = this.color
        c.beginPath()
        if (this.image){
            c.drawImage(this.image,this.x,this.y,this.width,this.height)
            c.strokeStyle = "red"
            if (hitbox) c.strokeRect(this.x,this.y,this.width,this.height)
        }
        else{
            c.fillRect(this.x,this.y,this.width,this.height)
        }
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
let xparallax = 0
let yparallax = 0

function animate(){
    if (stopped) return
    c.clearRect(0,0,width,height)
    if (enemiesArr.length <= 0) enemiesArr.push(new Enemy(width * Math.random(),-75,50,50,"White",0,2,100))
    function end(){
        document.body.removeChild(document.getElementById("canvas"))
        setTimeout(() =>{alert("u die")},10)
        window.location.reload()
    }
    if (player.health <= 0) end()
    for (let i=0;i<pArr.length;i++){
        if(!pArr[i]) continue
        pArr[i].update()
        if (pArr[i].isOoB()){ 
            pArr.splice(i,1)
            continue
        }
        if (pArr[i].evil) {
            pelletCollision(pArr[i],player,true)
            continue
        }
    }
    for (let i=0;i < enemiesArr.length;i++){
        if (!enemiesArr[i]) continue
        if (enemiesArr[i].health <= 0){
            summonPelletArc(enemiesArr[i].x + enemiesArr[i].width / 2, enemiesArr[i].y + enemiesArr[i].height / 2,0,0,Math.PI * 2,10)
            enemiesArr[i].stop()
            enemiesArr.splice(i,1)
            continue
        }
        enemiesArr[i].update()
        if (enemiesArr[i].y > height) end()
        playerEnemyCollision(enemiesArr[i])
    }
    for (let i = 0; i < enemiesArr.length; i++) {
        for (let j = 0; j < pArr.length; j++) {
            if (!pArr[j].evil) {
                pelletCollision(pArr[j],enemiesArr[i])
            }
        }
      }
    player.update()
    xparallax += player.dx / 10
    yparallax += player.dy / 10
    canvas.style.backgroundPositionY = `${yparallax}px`
    canvas.style.backgroundPositionX = `${xparallax}px`
    requestAnimationFrame(animate)
}
animate()
let pelletInterval;
let count = 0;
window.addEventListener("keydown", (e) => {
    if (e.getModifierState('CapsLock')) alert("caps lock is on")
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
    if (e.key == 'h') hitbox = !hitbox
    if (e.key == "p") console.log(pArr)
    if (e.key == "w") moving.forward = false
    if (e.key == "a") moving.left = false
    if (e.key == "s") moving.backward = false
    if (e.key == "d") moving.right = false
    if (e.key == "c"){
        if (count > 10){
            pArr.push(new Pellet(0,false,false,0,0,100,10,250))
        }
        console.log(count)
        count = 0
        return
    }
    if (e.code === "Space" && pelletInterval) {
        e.preventDefault()
        clearInterval(pelletInterval);
        pelletInterval = null;
    }
})
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        clearInterval(pelletInterval);
        pelletInterval = null;
        stopped = true
    }
    else {
        stopped = false
    }
});