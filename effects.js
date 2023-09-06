
class Particle {
    constructor(x,y,c,vx,vy){
        this.x = x;
        this.y = y;
        this.c = c;
        this.r = Math.random()*5+5;
        this.vx = Math.random()-0.5 + vx*0.5;
        this.vy = Math.random()-0.5 + vy*0.5;

        this.time = 0;
        this.limit = 1000;
        this.delete = false
    }
    update(a,deltaTime = 16.6){
        this.time += deltaTime;
        if(this.limit < this.time){
            this.r*=0.8
        }
        this.x += this.vx;
        this.y += this.vy;
        this.r *= 0.99

        if(this.r < 0.01)this.delete = true;
    }
    draw(ctx){
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();

    }
}

class Trail{
    constructor(remainTime,radius,color){
        this.remainTime = remainTime;
        this.radius = radius;
        this.color = color;
        this.array = [];
        

        this.estimate = 0;
    }
    update(x,y,r,deltaTime = 16.6){
        this.radius = r;
        this.array.push({x:x,y:y,time:this.remainTime});
        this.array = this.array.filter(item => item.time>0)
        this.array.forEach(item => {
            item.time -= deltaTime;
        });

        this.estimate = Math.round(this.remainTime / deltaTime)
    }
    draw(ctx){
        ctx.save();

        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.strokeStyle = this.color
        ctx.globalAlpha = 0.02
        ctx.lineWidth = this.radius*2;
        
        let drawArray = [this.array[this.array.length-1]]
        let count = 0;
        while(count < this.estimate){
            count++;
            if(drawArray.length<this.array.length){
                drawArray.push(this.array[this.array.length-1-drawArray.length]);
            }
            ctx.beginPath();
            for(let i=0; i<drawArray.length-1; i++){
                if(i%2 === 0){
                    if(i===0)ctx.moveTo(drawArray[i].x,drawArray[i].y)
                    else ctx.lineTo(drawArray[i].x,drawArray[i].y)
                }
            }
            ctx.stroke();
            
        }
        ctx.restore();
    }
}
