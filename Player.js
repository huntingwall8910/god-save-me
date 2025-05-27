import {mouseX, mouseY} from "./mouseTracking.js"
export default class Player {
    constructor(canvas,moving,x,y,health = 100){
        this.canvas = canvas
        this.hitbox = false
        this.image = new Image()
        this.image.src = "player.png"
        this.c = this.canvas.getContext("2d")
        this.health = health
        this.totalHealth = health
        this.x = x
        this.y = y
        this.dx = this.dy = 0
        this.width = this.height = 100
        this.speed = 0.2
        this.moving = moving
    }
    angleToMouse(){
        return Math.atan2(mouseY - (this.y + this.height/2), mouseX - (this.x + this.width/2))
    }
    wallCollisions(){
        if (this.x < 0) {
            this.x = 0 
            this.dx = -this.dx
        }
        if (this.x > this.canvas.width - this.width){
            this.x = this.canvas.width - this.width
            this.dx = -this.dx
        }
        if (this.y < 0) {
            this.y = 0 
            this.dy = -this.dy
        }
        if (this.y > this.canvas.height - this.height){
            this.y = this.canvas.height - this.height
            this.dy = -this.dy
        }
    }
    draw() {
        this.c.save();
        this.c.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.c.rotate(this.angleToMouse());
        this.c.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        this.c.drawImage(this.image,this.x,this.y,this.width,this.height)
        this.c.strokeStyle = 'green'
        if (this.hitbox) this.c.strokeRect(this.x,this.y,this.width,this.height)
        this.c.restore();
        this.c.beginPath()
        this.c.strokeStyle = 'blue'
        if (this.hitbox){ 
            this.c.strokeRect(this.x,this.y,this.width,this.height)
            this.c.fillStyle = 'red'
            this.c.arc(this.x + this.width / 2, this.y + this.height / 2, 10,0,Math.PI * 2)
            this.c.fill()
        }
        if (this.health < this.totalHealth){
            this.c.fillStyle = `rgb(${255 - (this.health / this.totalHealth) * 255}, ${(this.health / this.totalHealth) * 255}, 0)`
            this.c.fillRect(this.x - 5,this.y + this.height + 5,(this.health * (this.width/ this.totalHealth)) + 5, 10)
        }
        this.c.closePath()
    }
    update(){
        this.wallCollisions()
        this.dy += this.moving.forward ? -this.speed : this.moving.backward ? this.speed : 0;
        this.dx += this.moving.left ? -this.speed : this.moving.right ? this.speed : 0; 
        if (Math.abs(this.dx) > 15) this.dx = this.dx > 0 ? 15 : -15
        if (Math.abs(this.dy) > 15) this.dy = this.dy > 0 ? 15 : -15
        this.dx *= 0.99
        this.dy *= 0.99
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
}