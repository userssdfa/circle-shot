class ConstellationLine {
    constructor(game,twincleA,twincleB){
        this.game = game;
        this.installationItems = game.installationItems;
        this.A = this.installationItems[twincleA];
        this.B = this.installationItems[twincleB];
    }
    update(deltaTime){

    }
    draw(ctx){
        ctx.beginPath();
        ctx.moveTo(this.A.x,this.A.y)
        ctx.lineTo(this.B.x,this.B.y)
        ctx.stroke();
    }
}

class Twincle {
    constructor(game,x,y,random = 0.9){
        this.game = game;
        this.type = Math.random()>random ? "star" : "rhombus"
        
        this.x = x;
        this.y = y;
        this.radius = 15 //star専用
        this.size = this.type==="star" ? 15 : 10;//rhombus専用

        this.lifeTime = 200
        this.delete = false;

        this.requestAct = false;
        this.rotate = Math.PI*2;
        this.spreadRadius = 40;
        this.angle = 0;
        this.spread = 0;
        
        this.raySize = 2;
        this.setTime = 300
        this.timer = 0;
        this.maxAround = 1;
        this.rayPos = 1;
        this.rayAngle = -1;

        this.constellationEnabled = []

        this.exp = this.type === "star" ? 100: 10;
    }
    checkConstellation(){
        this.constellationEnabled = []
        const index = this.game.installationItems.findIndex(item => item === this);

        this.game.installationItems.forEach((item,i) => {
            let distance = Math.sqrt((item.x-this.x)**2+(item.y-this.y)**2);

            let temp;
            if(i===index){
                temp = "this"
            }else if(distance > 30 && distance < 80){
                temp = "true"
            }else{
                temp = "false"
            }

            this.constellationEnabled.push(temp);
        })
    }    
    update(deltaTime = 16.66){

        /* むり
        this.lifeTime -= deltaTime;
        if(this.lifeTime<0){
            let conect = this.constellationEnabled.indexOf("true");
            let thisIndex = this.constellationEnabled.indexOf("this");
            if(conect === -1){
                this.delete = true;
            }else{
                //this.game.conectInstallationItem(thisIndex,conect)
            }
        }
        */

        this.game.ballets.forEach(ballet => {
            let distance = Math.sqrt((ballet.x-this.x)**2+(ballet.y-this.y)**2);

            if(distance<ballet.r+this.size){
                this.requestAct = true;
            }
        })


        if(this.requestAct){
            this.angle += (this.rotate-this.angle)/15;
            this.spread += (this.spreadRadius-this.spread)/20;
        }
        if(Math.abs(this.angle)>this.rotate-0.01){
            this.requestAct = false
            this.angle = 0
            this.spread = 0;
        }
        this.timer += deltaTime;
        if(this.timer > this.setTime){
            this.timer = 0;
            this.rayPos += this.rayAngle;
            this.rayAngle = Math.abs(this.rayPos) === this.maxAround ? this.rayAngle*-1 : this.rayAngle;
        }
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);


        ctx.globalAlpha = 1-this.spread/this.spreadRadius
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white"
        ctx.beginPath();
        ctx.arc(0,0,this.spread,0,Math.PI*2)
        ctx.stroke();

        ctx.globalAlpha = 1
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "#FF9204"
        ctx.fillStyle = "#FFA500"

        if(this.type === "star"){
            let relativeAngle = Math.PI/2
            let starTurn = Math.PI*2/5;
            let skipCorner = 2

            let rayRelativeAngle = Math.PI/5;
            ctx.beginPath();
            for(let i=0; i<5; i++){
                let angle = starTurn*i*skipCorner-relativeAngle;
                let x = Math.cos(angle)*this.size;
                let y = Math.sin(angle)*this.size;
                if(i===0)ctx.moveTo(x,y)
                else ctx.lineTo(x,y)
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            for(let i=0; i<6; i++){
                let rayAngle = starTurn*i+rayRelativeAngle-relativeAngle;
                let x = Math.cos(rayAngle)*(this.size+this.rayPos)
                let y = Math.sin(rayAngle)*(this.size+this.rayPos)
                ctx.fillRect(x-1,y-1,2,2)
            }

        }else if("rhombus"){
            ctx.beginPath();
            ctx.arc(-this.size,-this.size,this.size,0,Math.PI/2)
            ctx.arc(-this.size,-this.size+this.size*2,this.size,Math.PI*1.5,0)
            ctx.arc(-this.size+this.size*2,-this.size+this.size*2,this.size,Math.PI*1,Math.PI*1.5)
            ctx.arc(-this.size+this.size*2,-this.size,this.size,Math.PI*0.5,Math.PI*1)
            ctx.fill();
            ctx.stroke();
    
            //ray
            ctx.fillRect(-this.size-this.raySize-this.rayPos,-this.size+this.size-this.raySize/2,this.raySize,this.raySize)
            ctx.fillRect(-this.size+this.size*2+this.rayPos,-this.size+this.size-this.raySize/2,this.raySize,this.raySize,this.raySize)
            ctx.fillRect(-this.size+this.size-this.raySize/2,-this.size-this.raySize-this.rayPos,this.raySize,this.raySize)
            ctx.fillRect(-this.size+this.size-this.raySize/2,-this.size+this.size*2+this.rayPos,this.raySize,this.raySize)
        }
        ctx.restore();
    }
}

class Spin{
    constructor(x,y){
        this.x = 400;
        this.y = 200;
        this.r = 10;
        this.c = "#ff2da9";

        this.angle = 0;
        this.gradient = this.c
    }
    update(){
        this.angle += 0.02;

        this.gradient = ctx.createConicGradient(this.angle, this.x, this.y);
        this.gradient.addColorStop(0, "rgba(255,255,255,0)");
        this.gradient.addColorStop(0.4, "rgba(255,255,255,0.2)");
        this.gradient.addColorStop(1, this.c);


    }
    draw(ctx){
        ctx.strokeStyle = this.gradient;
        ctx.fillStyle = this.c;
        ctx.lineWidth = this.r*2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.stroke();

        let x = Math.cos(this.angle)*this.r+this.x
        let y = Math.sin(this.angle)*this.r+this.y
        ctx.beginPath();
        ctx.arc(x,y,this.r,0,Math.PI*2)
        ctx.fill();
    }
}

 
class ShootingStar{
    constructor(x,y,w,h){
        this.x = 300;
        this.y = 300;
        this.w = 40;
        this.h = 40;
        this.number = 10;
        this.color = "blue";

        this.stars = []
        this.init();

        this.time = 0
    }
    init(){
        for(let i=0; i<this.number; i++){

            let [sx,sy,ex,ey] = this.choice()

            const segment = {
                sx: sx,
                sy: sy,
                ex: ex,
                ey: ey,
                time: Math.random()*2,
                init: [sx,sy,ex,ey],
            }
            this.stars.push(segment)
        }
    }

    p(t){
        return -(t**2) + t*2;
    }
    p2(t){
        return t**2
    }
    update(){
        this.time =  0.015
        
        this.stars.forEach(star => {
            star.time += this.time;
            if(star.time > 2){
                star.time = 0;
                star.init = this.choice()
            }
            let x = star.init[0] - star.init[2];
            let y = star.init[1] - star.init[3];
            star.sx = star.init[2] + x*this.p(star.time);
            star.sy = star.init[3] + y*this.p(star.time);
            star.ex = star.init[2] + x*this.p2(star.time);
            star.ey = star.init[3] + y*this.p2(star.time);
        })
    }
    draw(ctx){
        this.stars.forEach(star => {
            if(star.time<1){
                let gradient = ctx.createLinearGradient(star.sx,star.sy,star.ex,star.ey);
                
                gradient.addColorStop(0, "rgba(0,0,255,0.8)");
                gradient.addColorStop(0.2, 'rgba(0,0,255,0.5)');
                gradient.addColorStop(1, 'rgba(0,0,255,0)');
                ctx.lineWidth = 3;
                ctx.lineCap = "round"
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(star.sx,star.sy);
                ctx.lineTo(star.ex,star.ey);
                ctx.stroke()
            }
        })

    }
    choice(){
        const rising = Math.random() < 0.5;
        const horizonDirection =  Math.random()<0.5;
        let direction;
        if(horizonDirection){
            direction = Math.random()<0.5 ? "left" : "right"
        }else{
            direction = Math.random()<0.5 ? "top" : "bottom";
        }
        let sx,sy,ex,ey;
        switch(direction){
            case "left":
                sx = this.x
                sy = Math.random()*this.h + this.y;
                ex = this.x + this.w;
                ey = rising ? sy + this.w : sy - this.w;
                break;
            case "right":
                sx = this.x + this.w;
                sy = Math.random()*this.h + this.y;
                ex = this.x;
                ey = rising ? sy - this.w : sy + this.w;
                break;
            case "top":
                sx = Math.random()*this.w + this.x;
                sy = this.y;
                ex = rising ? sx - this.w : sx + this.w;
                ey = this.y + this.h;
                break;
            case "bottom":
                sx = Math.random()*this.w + this.x;
                sy = this.y + this.h;
                ex = rising ? sx + this.w : sx - this.w;
                ey = this.y;
                break;
        }
        return [sx,sy,ex,ey]
    }

}

