export default class Pellet {
    constructor(canvas,player,angleOffset = 0,evil = false,pointToPlayer = false,x,y,r = 10, speed = 25, damage = 5,wallBounce = false){
        this.canvas = canvas
        this.c = this.canvas.getContext("2d")
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
        if (this.evil){
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
        this.c.beginPath()
        this.c.fillStyle = "yellow"
        if (this.evil) this.c.fillStyle = "red"
        this.c.arc(this.x,this.y,this.radius,0,Math.PI*2)
        this.c.fill()
        this.c.closePath()
    }
    update(){
        if (this.wb){ 
            if (this.x < 0 || this.x > this.canvas.width) {
                this.dx = -this.dx
            }
        }
        this.x += this.dx
        this.y += this.dy
        this.draw()
    }
    isOoB(){
        return this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height
    }
}