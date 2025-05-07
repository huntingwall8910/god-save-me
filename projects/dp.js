const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
const body = document.getElementById("body")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let height = canvas.height
let width = canvas.width
c.translate(width/2,height/2)
const tau = Math.PI * 2
c.rotate(tau/2)
c.strokeStyle = "white"
c.fillStyle = "white"
const sin = (angle) => {return Math.sin(angle * Math.PI/180)}
const cos = (angle) => {return Math.cos(angle * Math.PI/180)}
let dot1 = true
let dot2 = true
let lines = true
let trails = true
let paused = false
let gravity = 0.25
let damping = 1
class DoublePendulum {
    constructor(a1,a2,l1,l2,m1,m2){
        this.a1 = a1
        this.a2 = a2
        this.l1 = l1
        this.l2 = l2
        this.m1 = m1
        this.m2 = m2
        this.v1 = 0
        this.v2 = 0
        this.trail = []
    }
    accel1() {
        let part1 = -gravity * (2 * this.m1 + this.m2) * Math.sin(this.a1);
        let part2 = -this.m2 * gravity * Math.sin(this.a1 - 2 * this.a2);
        let part3 = -2 * Math.sin(this.a1 - this.a2) * this.m2;
        let part4 = this.v2 * this.v2 * this.l2 + this.v1 * this.v1 * this.l1 * Math.cos(this.a1 - this.a2);
        let div = this.l1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
        return (part1 + part2 + part3 * part4) / div;
    }
      
    accel2() {
        let part1 = 2 * Math.sin(this.a1 - this.a2);
        let part2 = this.v1 * this.v1 * this.l1 * (this.m1 + this.m2);
        let part3 = gravity * (this.m1 + this.m2) * Math.cos(this.a1);
        let part4 = this.v2 * this.v2 * this.l2 * this.m2 * Math.cos(this.a1 - this.a2);
        let div = this.l2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * this.a1 - 2 * this.a2));
        return (part1 * (part2 + part3 + part4)) / div;
    }
    update(){
        this.v1 += this.accel1()
        this.v2 += this.accel2()
        this.a1 += this.v1
        this.a2 += this.v2
        this.v1 *= damping
        this.v2 *= damping
    }
    draw(){
        let x1 = this.l1 * Math.sin(this.a1)
        let y1 = -this.l1 * Math.cos(this.a1)
        let x2 = x1 + this.l2 * Math.sin(this.a2)
        let y2 = y1 - this.l2 * Math.cos(this.a2)
        if (dot1) this.trail.push([x1,y1])
        if (dot2) this.trail.push([x2,y2])
        if (this.trail.length > 250 && this.trail.length > 0) this.trail.splice(0,2)
        if (!trails) this.trail = []
        for (i=0;i<this.trail.length;i++){
            c.beginPath()
            c.arc(this.trail[i][0],this.trail[i][1],5,0,tau)
            c.fillStyle = `rgba(0,0,255, ${i/this.trail.length})`
            c.fill()
            c.closePath()
        }
        c.fillStyle = "white"
        c.strokeStyle = "white"
        if (lines){
            c.beginPath()
            c.moveTo(0,0)
            c.lineTo(x1,y1)
            c.moveTo(x1,y1)
            c.lineTo(x2,y2)
            c.stroke()
            c.closePath()
        }
        c.beginPath()
        if (dot1) c.arc(x1,y1,this.m1,0,tau)
        if (dot2) c.arc(x2,y2,this.m2,0,tau)
        c.fill()
        c.closePath()
    }
}
let dparr = []
function init(){
    let a;
    for (i=0;i<1;i++){
        a = Math.PI + (i*0.0000001) + 0.0000001
        dparr.push(new DoublePendulum(a,Math.PI,height/4 - 5,height/4 - 5,10,10))
    }
}
let hue = 0
function animate(){
    // c.fillStyle = "rgba(0,0,0,0.5)"
    // c.fillRect(-width,-height,width*2,height*2)
    // c.fillStyle = "white"
    c.clearRect(-width,-height,width*2,height*2)
    // c.strokeStyle = `hsl(${hue},100%,50%)`
    // c.fillStyle = `hsl(${hue},100%,50%)`
    // hue++
        for(let dp of dparr){
            if (!paused) dp.update()
            dp.draw()
        }
    requestAnimationFrame(animate)
}
init()
animate()
document.addEventListener("keydown", (e) => {
    console.log(e.key)
    if (e.key == "f") damping += 0.0001
    if (e.key == "ArrowLeft") c.translate(10,0)
    if (e.key == "ArrowRight") c.translate(-10,0)
    if (e.key == "ArrowDown") c.translate(0,-10)
    if (e.key == "ArrowUp") c.translate(0,10)
    if (e.key == "1") dot1 = !dot1
    if (e.key == "2") dot2 = !dot2
    if (e.key == "3") lines = !lines
    if (e.key == "4") trails = !trails
    if (e.key == "p") paused = !paused
    if (paused){
        if (e.key == "a"){
            for (i=0;i<dparr.length;i++){
                dparr[i].a1 += 0.05
            }
        }
        if (e.key == "d"){
            for (i=0;i<dparr.length;i++){
                dparr[i].a1 -= 0.05
            }
        }
        if (e.key == "q"){
            for (i=0;i<dparr.length;i++){
                dparr[i].a2 += 0.05
            }
        }
        if (e.key == "e"){
            for (i=0;i<dparr.length;i++){
                dparr[i].a2 -= 0.05
            }
        }
    }
    if (e.key == "r"){
        for (i=0;i<dparr.length;i++){
            dparr[i].v1 = 0
            dparr[i].v2 = 0
        }
    }
})
window.addEventListener("resize", () =>{
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    height = canvas.height
    width = canvas.width
    c.translate(width/2,height/2)
    c.rotate(tau/2)
})