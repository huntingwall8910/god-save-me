import Pellet from "./Pellet.js"
export function summonPelletArc(canvas,x,y,offset,startAngle,endAngle,amount,pArr){
    const increment = (endAngle - startAngle) / amount
    for (let i=0;i<amount;i++){
        pArr.push(new Pellet(canvas,null,increment * i + offset,true,false,x,y,10,10,5,true))
    }
}
export default class Enemy {
    constructor(canvas,pArr,x,y,w,h,c,dx,dy,health = 100,behavior = 1){
        this.canvas = canvas
        this.c = canvas.getContext("2d")
        this.dx = dx
        this.dy = dy
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.hitbox = false
        window.addEventListener("keyup", (e) => {
            if (e.key == 'h') this.hitbox = !this.hitbox
        })
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
        this.start(canvas,pArr)
    }
    start(canvas,pArr){
        if (this.behavior == 2){
            this.shootInterval = setInterval(() => {
                summonPelletArc(canvas,this.x + this.width /2,this.y + this.height / 2,this.counter,0,Math.PI * 2, 10,pArr)
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
        if (this.color) this.c.fillStyle = this.color
        this.c.beginPath()
        if (this.image){
            this.c.drawImage(this.image,this.x,this.y,this.width,this.height)
        }
        else{
            this.c.fillRect(this.x,this.y,this.width,this.height)
        }
        this.c.strokeStyle = "red"
        if (this.hitbox) this.c.strokeRect(this.x,this.y,this.width,this.height)
        if (this.health < this.totalHealth){
            this.c.fillStyle = `rgb(${255 - (this.health / this.totalHealth) * 255}, ${(this.health / this.totalHealth) * 255}, 0)`
            this.c.fillRect(this.x - 5,this.y + this.height + 5,(this.health * (this.width/ this.totalHealth)) + 5, 10)
        }
        this.c.closePath()
    }
    update(){
        if (this.x < 0 || this.x + this.width > this.canvas.width) this.dx *= -1
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
}