
class Ballet {
    constructor(can,x,y,vx,vy,r){
        this.can = can;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.r = r;
        this.delete = false;
        this.speed = 1
        this.color = "lightgreen"

        this.trail = new Trail(500,this.r,"white");
    }
    update(){
        if(this.x<0 || this.x>this.can.width || this.y<0 || this.y>this.can.height)this.delete = true;
        
        this.trail.update(this.x,this.y,this.r)
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;

    }
    draw(ctx){
        this.trail.draw(ctx)
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
    }
}

class Character{
    constructor(game,x,y,r,type){
        this.game = game;
        this.x = x;
        this.y = y;
        this.r = r;
        this.orb = r;
        this.type = type;
        this.color = "orange"

        this.delete = false;
        this.dx = 0;
        this.dy = 0;


        const speed = {player:3,enemy:1.2}
        this.trailRemainTime = 1000
        if(type === "PLAYER"){
            this.speed = speed.player
            this.color = "skyblue"
            this.control = new Control();
            this.trail = null//new Trail(300,this.r)
        }else if(type === "ENEMY"){
            this.speed = speed.enemy;
            let colorAngle = Math.random()*50 - 25;
            this.color = `hsl(${colorAngle},60%,50%)`
            this.trail = new Trail(this.trailRemainTime,this.r,this.color)
        }

    }
    update(deltaTime = 16.6){
        if(this.trail)this.trail.update(this.x,this.y,this.r,deltaTime)
        if(this.type === "PLAYER"){
            this.vertical = this.control.left + this.control.right;
            this.horizon = this.control.up + this.control.down;
            if(this.vertical && this.horizon){
                const angle = Math.atan2(this.horizon,this.vertical)
                this.dx = Math.cos(angle)
                this.dy = Math.sin(angle)
            }else{
                this.dx = this.vertical;
                this.dy = this.horizon;
            }

            this.game.enemies.forEach(enemy =>{
                let distance = Math.sqrt((this.x-enemy.x)**2+(this.y-enemy.y)**2);
                if(distance < this.r+enemy.r){
                    this.game.gameOver = true;
                }
            })
        }else if(this.type === "ENEMY"){
            this.game.ballets.forEach(item => {
                if(this.game.checkHit(this,item)){
                    item.delete = true;
                    this.r -= 15;
                    if(this.r<15){
                        this.delete = true;
                        for(let i=0; i<12; i++){
                            this.game.particles.push(new Particle(this.x,this.y,this.color,item.vx,item.vy))//x,y,c,vx,vy
                        }
                        this.game.pushOrb(this.x,this.y)
                        this.game.pushCoin(this.x,this.y,item.vx,item.vy,item.speed)
                    }
                }
            })

            const angle = Math.atan2(this.game.player.y-this.y,this.game.player.x-this.x)
            this.dx = Math.cos(angle)
            this.dy = Math.sin(angle)
        }
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    }
    draw(ctx){

        if(this.type === "PLAYER"){
            ctx.fillStyle = this.color;
            ctx.strokeStyle = "blue"
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
        }else if(this.type === "ENEMY"){
            if(this.trail)this.trail.draw(ctx)
            ctx.lineWidth = 1
            ctx.fillStyle = this.color;
            ctx.strokeStyle = "deepPink"
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
            ctx.fill();
            ctx.stroke();
        }
    }
}
