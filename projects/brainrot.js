const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const width = canvas.width
const height = canvas.height
c.translate(width/2,height/2)
let tau = 2 * Math.PI
let borderRadius = height/2 - 50
let gravity = 0.1
let sound = new Audio("rizz.wav")
class Ball {
    constructor(pos,velocity,radius){
        this.pos = pos
        this.velocity = velocity
        this.radius = radius
    }
    dist = () => {
        return Math.sqrt(Math.pow(this.pos.x,2) + Math.pow(this.pos.y,2))
    }
    draw(){
        c.beginPath()
        c.arc(this.pos.x,this.pos.y,this.radius,0,tau)            
        c.fill()
        c.stroke()
        c.closePath()
    }
    update(){
        this.pos.x += this.velocity.x
        this.pos.y += this.velocity.y
        this.velocity.y += gravity
        if (this.dist() > borderRadius - this.radius){
            this.radius += 1
            sound.cloneNode().play()
            let totalV = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)
            let angleToCollisionPoint = Math.atan2(-this.pos.y,this.pos.x)
            let oldAngle = Math.atan2(-this.velocity.y,this.velocity.x)
            let newAngle = 2 * angleToCollisionPoint - oldAngle
            this.velocity.x = -totalV * Math.cos(newAngle)
            this.velocity.y = totalV * Math.sin(newAngle)
            this.pos.x = (this.pos.x / this.dist()) * (borderRadius  - this.radius)
            this.pos.y = (this.pos.y / this.dist()) * (borderRadius  - this.radius)
        }
        if (this.radius > borderRadius){
            this.radius = 1;
            this.velocity.x = Math.random() * 5 - 3;
            this.velocity.y = 0;
	    }
        this.draw()
    }
}
let ballArr = []
function init(){
    for(let i=0;i<1;i++){
        ballArr.push(new Ball({x:Math.random() * 200 - 100,y:Math.random() * 200 - 100},{x:Math.random() * 2 - 1, y:0},1))
    }
}
c.strokeStyle = "white"
c.fillStyle = "White"
let hue = 0;
function animate(){
    c.fillStyle = 'rgba(0, 0, 0, .05)';
    c.fillRect(-width, -height,width * 2,height * 2);
    // c.clearRect(-width,-height,width * 2,height * 2)
    c.fillStyle = `hsl(${hue % 360} 100% 50%)`
    c.beginPath()
    c.arc(0,0,borderRadius,0,tau)
    c.strokeStyle= `hsl(${hue % 360} 100% 50%)`
    c.lineWidth = 5
    c.stroke()
    c.closePath()
    c.lineWidth = 1
    c.strokeStyle = "White"
    for (i=0;i<ballArr.length;i++){
        ballArr[i].update()
    }
    hue++
    c.closePath()
    requestAnimationFrame(animate)
}
init()
animate()