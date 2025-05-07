const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d");
const body = document.getElementById("body")
canvas.height = window.innerHeight
canvas.width = window.innerWidth
let height = canvas.height
let width = canvas.width
c.lineWidth = 3
console.log(height);
console.log(width);
let mouseX,mouseY;
let imageSrc = "https://yt3.ggpht.com/yti/ANjgQV-_n3UiIYSTJ1TY27V1zHuHyh1c6-RyQ3g9gceraY3rFLQ=s88-c-k-c0x00ffffff-no-rj-mo"
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
let g = 0.1
function randHex() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
}
function collide(a,b) {
    let xDiff = a.x - b.x
    let yDiff = a.y - b.y
    let minDist = a.radius + b.radius
    let distance = Math.sqrt((xDiff) ** 2 + (yDiff) ** 2)
    if (distance < minDist) {
        let normalX = xDiff / distance
        let normalY = yDiff / distance
        let overlap = minDist - distance
        a.x += (overlap * (b.radius / minDist)) * normalX
        a.y += (overlap * (b.radius / minDist)) * normalY
        b.x -= (overlap * (a.radius / minDist)) * normalX
        b.y -= (overlap * (a.radius / minDist)) * normalY
        let dxDiff = a.dx - b.dx
        let dyDiff = a.dy - b.dy
        let dot = dxDiff * normalX + dyDiff * normalY
        if (dot < 0){
            let totalMass = a.radius + b.radius
            let scalarFactor = (2 * dot) / totalMass
            a.dx -= scalarFactor * b.radius * normalX
            a.dy -= scalarFactor * b.radius * normalY
            b.dx += scalarFactor * a.radius * normalX
            b.dy += scalarFactor * a.radius * normalY
            a.dx *= 0.99
            a.dy *= 0.99
            b.dx *= 0.99
            b.dy *= 0.99
        }
    }
}
function Ball(x, y, dx, dy, ddx, ddy, radius) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.ddx = ddx
    this.ddy = ddy
    this.radius = radius
    this.distFromMouse = function(){
        return Math.hypot((mouseX - this.x),(mouseY - this.y))
    }
    this.update = function() {
        // if (Math.abs(this.dx) < 0.01) this.dx = 0
        // if (Math.abs(this.dy) < 0.01) this.dy = 0
        // if (this.distFromMouse() < 150) {
        //     while (this.distFromMouse() < 150){
        //         if (this.x > mouseX) this.x += 1
        //         else this.x -= 1
        //         if (this.y > mouseY) this.y += 1
        //         else this.y -= 1
        //     }
        // }
        this.x += this.dx
        this.y += this.dy
        this.reflectY = function() {
            this.dy = -this.dy
            this.dy = this.dy * 0.99
        }
        this.reflectX = function() {
            this.dx = -this.dx
            this.dx = this.dx * 0.99
        }
        if (this.y + this.dy > height - this.radius) {
            this.y = height - this.radius
            this.reflectY()
        } 
        else if (this.y + this.dy< this.radius){
            this.y = this.radius
            this.reflectY()
        }
        else {
            this.dy += this.ddy
        }
        if (this.x + this.dx < this.radius) {
            this.x = this.radius
            this.reflectX()
        } 
        else if (this.x + this.radius > width){
            this.x = width - this.radius
            this.reflectX()
        }
        else {
            this.dx += this.ddx
        }
        this.draw()
    }
    this.draw = function() {
        c.fillStyle = `hsl(${hue + count}, 50%, 50%)`
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }
}
let ball;
let balls = [];
const img = new Image();
img.src = imageSrc
img.width = canvas.width
img.height = canvas.height
img.onload = () => {
  const pattern = c.createPattern(img, "repeat");
  c.fillStyle = pattern;
};
function initBalls() {
    balls = [];
    for (i = 0; i < 1000; i++) {
        const radius = randInt(5,15)
        let dx = randInt(-10, 10)
        let dy = randInt(-10, 10)
        const x = randInt(0 + radius, width - radius)
        const y = randInt(0 + radius, height - radius)
        balls.push(new Ball(x, y, dx, dy, 0, g, radius))
    }
}
initBalls();
let hue = 0
let count = 0
function animate() {
    c.clearRect(0,0,width,height)
    balls.sort((a,b) => a.x - b.x)
    for (i = 0; i < balls.length; i++) {
        for (let j=i+1; j<balls.length; j++){
            if (balls[j].x - balls[i].x > balls[i].radius + balls[j].radius) {
                break
            }
            collide(balls[i],balls[j])
        }
    }
    balls.sort((a,b) => a.x - b.x)
    count = 0
    for (let ball of balls){
        count += 1
        ball.update()
    }
    hue += 3
    requestAnimationFrame(animate)
}
animate()
window.addEventListener("resize", () =>{
    const img = new Image();
    img.src = imageSrc
    img.width = canvas.width
    img.height = canvas.height
    img.onload = () => {
    const pattern = c.createPattern(img, "repeat");
    c.fillStyle = pattern;
    };
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    height = canvas.height
    width = canvas.width
})
document.addEventListener("keyup", (e) => {
    if (e.key =="w") {
        for (let ball of balls){
            ball.ddy = -g
            ball.ddx = 0
        }
    }
    if (e.key == "a") {
        for (let ball of balls){
            ball.ddy = 0
            ball.ddx = -g
        }
    }
    if (e.key == "s") {
        for (let ball of balls){
            ball.ddy = g
            ball.ddx = 0
        }
    }
    if (e.key == "d") {
        for (let ball of balls){
            ball.ddy = 0
            ball.ddx = g
        }
    }
    if (e.key == "e") {
        for (let ball of balls){
            ball.ddy = 0
            ball.ddx = 0
        }
    }
})
document.addEventListener("keydown", (e) => {
    if (e.key =="i") {
        for (let ball of balls){
            ball.dy -= 3
        }
    }
    if (e.key == "j") {
        for (let ball of balls){
            ball.dx -= 3
        }
    }
    if (e.key == "k") {
        for (let ball of balls){
            ball.dy += 3
        }
    }
    if (e.key == "l") {
        for (let ball of balls){
            ball.dx += 3
        }
    }
})
