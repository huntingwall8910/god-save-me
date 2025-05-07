const canvas = document.getElementById("canvas")
const c = canvas.getContext("2d")
canvas.width = screen.width
canvas.height = screen.height
const width = canvas.width
const height = canvas.height
c.translate(width/2,height/2)
const cos = (angle) => {const theta = angle * (Math.PI / 180); return Math.cos(theta)}
const sin = (angle) => {const theta = angle * (Math.PI / 180); return Math.sin(theta)}
function Satellite(x,y,da,h,s,l){
    this.x = x
    this.y = y
    this.da = da
    this.color = `hsl(${h} ${s}% ${l}%`
    this.rotate = () => {
        let tempx = this.x
        this.x = (this.x * cos(da)) + (this.y * sin(da))
        this.y = (this.y * cos(da)) - (tempx * sin(da))
        this.draw()
    }
    this.draw = () => {
        c.fillStyle = this.color
        c.beginPath()
        c.arc(this.x,this.y,3,0,Math.PI * 2)
        c.fill()
        c.closePath()
    }
}
let objects = []
function init(){
    for (i=0;i<75;i++){
        objects.push(new Satellite(i * 3,i * 3,-i / 50,100,100,100))
    }
}
function animate(){
    c.fillStyle = 'rgba(0, 0, 0, .25)';
    c.fillRect(-width, -height,width * 2,height * 2);
    for (i=0;i<objects.length;i++){
        objects[i].rotate()
    }
    requestAnimationFrame(animate)
}
canvas.addEventListener('mousedown', (event) => {
    console.log(`${event.clientX},${event.clientY}`)
    objects.push(new Satellite(event.clientX - (width/2), event.clientY - (height / 2), 1, Math.random() * 360,Math.random() * 50 + 50,50))
});
init()
requestAnimationFrame(animate)