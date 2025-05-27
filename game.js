if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || localStorage.getItem("mobile")){
    alert("mobile isnt supported, sending to shadow realm")
    window.location.replace("https://youtube.com/@hw8910")
    localStorage.setItem("mobile",true)
}
if (window.devicePixelRatio !== 1){
    if (window.devicePixelRatio > 1){alert("zoom out until this number equals 1: " + window.devicePixelRatio)}
    if (window.devicePixelRatio < 1){alert("zoom in until this number equals 1: " + window.devicePixelRatio)}
    window.location.reload()
}
import Enemy from "./Enemy.js"
import Pellet from "./Pellet.js"
import Player from "./Player.js"
import { summonPelletArc } from "./Enemy.js"
const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let height = canvas.height
let width = canvas.width
c.fillStyle = "yellow"
c.lineWidth = 5
let moving = {
    forward:false,
    backward:false,
    left:false,
    right:false,
}
let stopped = false;
let player = new Player(canvas,moving,width/2,height/2)
let pArr = []
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
            console.log(player.health);
            player.health -= pellet.damage
        }
    }
    else {
        const dx = pellet.x - closestX;
        const dy = pellet.y - closestY;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < (pellet.radius * pellet.radius)) {
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
        player.health -= 1
    }
}
let enemiesArr = []
enemiesArr.push(new Enemy(canvas,pArr,width * Math.random(),-75,50,50,"White",0,2,100))
let xparallax = 0
let yparallax = 0
let enemiesKilled = 0
let startTime = performance.now()
function animate(){
    if (stopped) return
    c.clearRect(0,0,width,height)
    if (enemiesArr.length <= 0) enemiesArr.push(new Enemy(canvas,pArr,width * Math.random(),-75,50,50,"White",0,2,100))
    function end(){
        document.body.removeChild(canvas)
        alert(`u die, ${enemiesKilled} enemies killed`)
        window.location.refresh
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
        if (enemiesArr[i].y > height) end()
        if (enemiesArr[i].health <= 0){
            enemiesKilled++
            summonPelletArc(canvas,enemiesArr[i].x + enemiesArr[i].width / 2, enemiesArr[i].y + enemiesArr[i].height / 2,0,0,Math.PI * 2,10,pArr)
            enemiesArr[i].stop()
            enemiesArr.splice(i,1)
            continue
        }
        enemiesArr[i].update()
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
    xparallax += player.dx / 32
    yparallax += player.dy / 32
    canvas.style.backgroundPositionY = `${yparallax}px`
    canvas.style.backgroundPositionX = `${xparallax}px`
    let now = performance.now();
    let deltaTime = (now - startTime) / 1000
    startTime = performance.now()
    c.font = "12px Arial"
    c.fillStyle = "White"
    c.fillText(`FPS:${(1 / deltaTime).toPrecision(3)}`,0,10)
    c.font = "8px Arial"
    c.fillText(`(based on time between animation cycles)`,0,20)
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
            pArr.push(new Pellet(canvas,player,0));        
        }, 100);
    }
})
window.addEventListener("keyup", (e) => {
    if (e.key == "h") {
        player.hitbox = !player.hitbox
        for (let enemy of enemiesArr) {
            enemy.hitbox = !enemy.hitbox;
        }
    }
    if (e.key == "p") console.log(pArr)
    if (e.key == "w") moving.forward = false
    if (e.key == "a") moving.left = false
    if (e.key == "s") moving.backward = false
    if (e.key == "d") moving.right = false
    if (e.key == "c"){
        if (count > 10){
            pArr.push(new Pellet(canvas,player,0,false,false,0,0,100,10,250))
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
window.addEventListener("resize", () => {
    if (window.devicePixelRatio !== 1){
        if (window.devicePixelRatio > 1){alert("zoom out until this number equals 1: " + window.devicePixelRatio)}
        if (window.devicePixelRatio < 1){alert("zoom in until this number equals 1: " + window.devicePixelRatio)}
        window.location.reload()
    }
})