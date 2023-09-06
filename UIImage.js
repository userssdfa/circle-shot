class DecorationStar{
    constructor(parent){
        this.parent = parent;
        this.x = 150;
        this.y = 550;
        this.r = 50;
        this.angle = 0;
    }
    update(deltaTime){
        this.angle += 0.001
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);
        let relativeAngle = Math.PI/2
        let starTurn = Math.PI*2/5;
        let skipCorner = 2

        let rayRelativeAngle = Math.PI/5;
        ctx.fillStyle = "IndianRed"
        ctx.beginPath();
        for(let i=0; i<5; i++){
            let angle = starTurn*i*skipCorner-relativeAngle;
            let x = Math.cos(angle)*(this.r+5);
            let y = Math.sin(angle)*(this.r+5);
            if(i===0)ctx.moveTo(x,y)
            else ctx.lineTo(x,y)
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "yellow"
        ctx.beginPath();
        for(let i=0; i<5; i++){
            let angle = starTurn*i*skipCorner-relativeAngle;
            let x = Math.cos(angle)*this.r;
            let y = Math.sin(angle)*this.r;
            if(i===0)ctx.moveTo(x,y)
            else ctx.lineTo(x,y)
        }

        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}


class ExpBar{
    constructor(parent){
        this.parent = parent
        this.t = parent.status/parent.maxStatus
        this.magicA = {x:300,y:-120,r:700,a1:1.35,a2:1.82,counterclockwise:false};
        this.magicB = {x:350,y:-79,r:650,a1:1.87,a2:1.41,counterclockwise:true};
    }
    update(){
        this.t = this.parent.status/this.parent.maxStatus
    }
    draw(ctx){
        ctx.lineJoin = "round"
        ctx.lineWidth = 3
        ctx.strokeStyle ="skyblue"
        ctx.fillStyle ="pink"
        let Aangle = lerp(this.magicA.a2,this.magicA.a1,1-this.t)
        let Bangle = lerp(this.magicB.a1,this.magicB.a2,1-this.t)
        ctx.beginPath();
        ctx.arc(this.magicA.x,this.magicA.y,this.magicA.r,this.magicA.a1,Aangle,this.magicA.counterclockwise);
        ctx.arc(this.magicB.x,this.magicB.y,this.magicB.r,Bangle,this.magicB.a2,this.magicB.counterclockwise);
        ctx.closePath();
        ctx.fill()
        
        ctx.beginPath();
        ctx.arc(this.magicA.x,this.magicA.y,this.magicA.r,this.magicA.a1,this.magicA.a2,this.magicA.counterclockwise);
        ctx.arc(this.magicB.x,this.magicB.y,this.magicB.r,this.magicB.a1,this.magicB.a2,this.magicB.counterclockwise);
        ctx.closePath();
        ctx.stroke()
    }
}

class DecorationCoin {
    constructor(left,top,w,h){
        this.left = left;
        this.top = top;
        this.w = w;
        this.h = h;
        this.r = 6;
        this.x = this.left + this.w/2
        this.y = this.top+this.h-this.r;

        this.dx = Math.random()*-1+0.5;
        this.dy = Math.random()*1+0.5;

        //a----b
        //|    |
        //c----d
        
        this.a = {x:this.left,y:this.top}
        this.b = {x:this.left+this.w,y:this.top}
        this.c = {x:this.left,y:this.top+this.h}
        this.d = {x:this.left+this.w,y:this.top+this.h}

        this.spawns = []
        this.spawnNumber = 2;
    }
    spawn(){
        for(let i=0; i<this.spawnNumber; i++){
            let dx = Math.random()*-1+0.5
            let dy = Math.random()*1+0.5;

            this.spawns.push({x:this.left + this.w/2, y:this.top+this.h-this.r,dx:dx,dy:dy,delete:false})
        }
    }
    update(){
        this.moveFunction(this,true);
        this.spawns = this.spawns.filter(coin => !coin.delete)
        this.spawns.forEach(coin => {
            this.moveFunction(coin)
        })
    }
    moveFunction(coin,remain=false){
        if(this.top > coin.y-this.r){
            coin.dy = -coin.dy
        }
        else if(this.top+this.h < coin.y+this.r){
            coin.dy = -Math.random()*0.6-0.2
            coin.dx = Math.sign(coin.dx) * Math.random()*0.5
        }
        if(this.left > coin.x-this.r){
            coin.dx = -coin.dx
        }else if(this.left+this.w < coin.x+this.r){
            if(remain){
                coin.dx = -coin.dx
            }else if(this.left+this.w < coin.x-this.r){
                coin.delete = true;
            }
        }

        coin.dy += 0.01

        coin.x += coin.dx;
        coin.y += coin.dy; 
    }
    draw(ctx){
        this.drawFunction(this,ctx);
        this.spawns.forEach(coin => {
            this.drawFunction(coin,ctx)
        })
    }
    drawFunction(coin,ctx){
        ctx.lineWidth = 2
        ctx.strokeStyle = "white";
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(coin.x,coin.y,this.r*1.5,0,Math.PI*2)
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "lightgreen";
        ctx.beginPath();
        ctx.arc(coin.x,coin.y,this.r,0,Math.PI*2)
        ctx.fill();
        ctx.stroke();
    }
}

class DecorationOrb {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.r = 40;

        this.ox = x;
        this.oy = y;
        this.or = 5;

        this.tx = 0;
        this.ty = 0;

        this.dx = 0;
        this.dy = 0;

        this.targets = [Math.PI,Math.PI+Math.PI*1/5*2,Math.PI+Math.PI*2/5*2,Math.PI+Math.PI*3/5*2,Math.PI+Math.PI*4/5*2,Math.PI+Math.PI*5/5*2]
        this.targetIndex = 0;
        this.lastTargetTime = 0;
        this.targetChangeTime = 2000;
        
        this.getOrbEffect = 1; //最低値　1
        this.lastGotTime = 1000;
        this.activeTime = 2000;
    }
    update(deltaTime){

        //オーブの座標更新
        this.ox += this.dx * this.getOrbEffect;
        this.oy += this.dy * this.getOrbEffect;
        
        //各タイマーの更新
        this.lastTargetTime += deltaTime * Math.max(1,this.getOrbEffect/2);
        this.lastGotTime += deltaTime;

        //活性化時間が終了したら徐々に勢いをへらす
        if(this.lastGotTime > this.activeTime){
            this.getOrbEffect = Math.max(this.getOrbEffect-0.1, 1);
        }

        //オーブの目的場所の変更
        if(this.lastTargetTime > this.targetChangeTime){
            this.targetIndex = (this.targetIndex+2)%5;
            let x = Math.sin(this.targets[this.targetIndex])*this.r+this.x
            let y = Math.cos(this.targets[this.targetIndex])*this.r+this.y
            this.tx = x;
            this.ty = y;
            this.lastTargetTime = 0;
        }

        //オーブと目的場所、中心場所の距離と角度
        let oTAngle = Math.atan2(this.oy-this.ty,this.ox-this.tx);
        let oTDistance = Math.sqrt((this.ox-this.tx)**2+(this.oy-this.ty)**2);
        let oCAngle = Math.atan2(this.oy-this.y,this.ox-this.x);
        let oCDistance = Math.sqrt((this.ox-this.x)**2+(this.oy-this.y)**2);

        //オーブが目的場所へ向かうように、離れすぎていたら少し早く
        this.dx -= Math.cos(oCAngle)*0.004
        this.dy -= Math.sin(oCAngle)*0.004
        if(oTDistance>this.r*0.5){
            this.dx -= Math.cos(oTAngle)*0.005
            this.dy -= Math.sin(oTAngle)*0.005
        }

        //中心から離れすぎないように
        if(oCDistance>this.r){
            this.ox = Math.cos(oCAngle)*(this.r)*0.99 + this.x
            this.oy = Math.sin(oCAngle)*(this.r)*0.99 + this.y
        }
    }
    draw(ctx){
        ctx.save();
        let gradient = ctx.createRadialGradient(this.ox, this.oy, this.or, this.ox-this.dx*20, this.oy-this.dy*20, this.or*5);
        gradient.addColorStop(0, "rgba(255, 165, 0, 1)");
        gradient.addColorStop(0.8, "rgba(0, 0, 0, 0.0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.ox,this.oy,this.or*5,0,Math.PI*2)
        ctx.fill();
        ctx.fillStyle = "orange"
        ctx.beginPath();
        ctx.arc(this.ox,this.oy,this.or,0,Math.PI*2)
        ctx.fill();
        ctx.restore();


    }
}
