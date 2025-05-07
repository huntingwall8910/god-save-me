const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
const body = document.getElementById("body")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const height = canvas.height
const width = canvas.width
c.fillStyle = "white"
c.strokeStyle = "white"
let x1 = width/2
let x2 = width/4
let m1 = 10000
let m2 = 1
let v1 = -2
let v2 = 0
let collisions = 0
let sound = new Audio("click.wav")
let ratioArr = []
function draw(){
    c.beginPath()
    c.fillRect(x1,height/2,100,100)
    c.fillRect(x2,height/2 + 50,50,50)
    c.font = "48px arial"
    c.fillText(`Collisions: ${collisions}`, 10, 50)
    c.font = "24px arial"
    c.fillText(`${m1} kg`, x1, height/2 - 10)
    c.fillText(`${m2} kg`, x2, height/2 + 40)
    c.fillText(`bigger square: ${Math.abs(v1.toPrecision(4))} px/frame`,0,height/2 + 124)
    c.fillText(`smaller square: ${Math.abs(v2.toPrecision(4))} px/frame`,0,height/2 + 148)
    c.fillText(`velocity ratio: ${Math.abs((v2/v1).toPrecision(4))}`,0,height/2 + 172)
    c.fill()
    c.moveTo(0,height/2 + 100)
    c.lineTo(width,height/2 + 100)
    c.stroke()
    c.closePath()
}
function collision(){
    if (x2 <= 0) {
        v2 = -v2 
        collisions++
        sound.cloneNode().play()
    }
    if (x1 < x2 + 50){
        let temp1 = v1
        let temp2 = v2
        v1 = ((m1 - m2) * temp1 + 2 * m2 * temp2)/ (m1 + m2)
        v2 = ((m2 - m1) * temp2 + 2 * m1 * temp1) / (m1 + m2)
        collisions++
	    ratioArr.push(Math.abs(v2 / v1))
        sound.cloneNode().play()
    }
}
function loop(){
    c.clearRect(0,0,width,height)
    x1 += v1
    x2 += v2
    collision()
    draw()
    requestAnimationFrame(loop)
}
draw()
function func() {
    loop()
    document.removeEventListener("click", func)
}
document.addEventListener("click",func)
document.addEventListener("keyup", (e) => {
	if (e.key == "a") console.log(ratioArr)
})