class Coin {
    constructor(game,x,y,dx,dy,balletSpeed){
        this.game = game;
        this.player = game.player;
        this.ix = x;
        this.iy = y;
        this.x = -50//とりあえず画面恥
        this.y = -50//とりあえず画面恥
        this.distance = 10000;//とりあえず
        this.dx = dx;
        this.dy = dy;
        this.rollRange = 50
        this.balletSpeed = balletSpeed;
        this.r = 6;
        this.time = 0;
        this.stopTime = 2000

        this.glossTime = 0;
        this.glossLimit = 200;
        this.glossFlag = false;
        this.glossChance = 0.03;
        this.glossOffset = this.r*1.5
        this.glossLength = 5;
        this.noiseX = Math.random()*-this.r*1.5-30 + this.r*1.5/2+15;
        this.noiseY = Math.random()*-10 + 5;

        this.delete = false;
    }
    update(deltaTime){

        //当たり判定及び消去フラグ
        this.distance = Math.sqrt((this.x-this.player.x)**2+(this.y-this.player.y)**2)
        if(this.distance<this.r+this.player.r){
            this.delete = true;
            this.game.statuses[2].getCoin();
        }

        // 座標計算
        this.time += deltaTime;
        if(this.time > this.stopTime) this.time = this.stopTime;

        this.x = pp(this.time/this.stopTime)*this.rollRange*this.balletSpeed*this.dx+this.ix
        this.y = pp(this.time/this.stopTime)*this.rollRange*this.balletSpeed*this.dy+this.iy


        //　輝き計算
        if(Math.random()<this.glossChance && this.glossTime==0){
            this.noiseX = Math.random()*-10 + 5;
            this.noiseY = Math.random()*-10 + 5;
            this.glossFlag = true;
        }
        if(this.glossFlag){
            this.glossTime += deltaTime;

        }
        if(this.glossTime > this.glossLimit){
            this.glossFlag = false;
            this.glossTime = 0;
        }

    }
    draw(ctx){
        ctx.lineWidth = 2
        ctx.strokeStyle = "white";
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r*1.5,0,Math.PI*2)
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "lightgreen";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2)
        ctx.fill();
        ctx.stroke();

        //gloss
        if(this.glossFlag){
            let x = this.x + this.noiseX
            let y = this.y-this.glossOffset + this.noiseY
            let l = pp(this.glossTime/this.glossLimit)*this.glossLength;
            ctx.lineWidth = 2
            ctx.lineCap = "round"
            ctx.strokeStyle = "orange"
            ctx.beginPath();
            ctx.moveTo(x-l,y)
            ctx.lineTo(x+l,y)
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x,y-l)
            ctx.lineTo(x,y+l)
            ctx.stroke();
        }
    }
}


class Orb {
    constructor(game,x,y){
        this.game = game;
        this.player = game.player
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.r = 4;
        this.time = 0;
        this.birthTime = 0;
        this.tracking = 0;
        this.trackingSpeed = 0.2;
        this.distance = null;

        this.delete = false;
        this.deleteDistance = 10;
        this.trackingDistance = 100;
        this.releaseDistance = 150;
    }
    update(){
        this.birthTime += 0.01
        this.distance = Math.sqrt((this.x-this.player.x)**2+(this.y-this.player.y)**2)
        if(this.distance<this.deleteDistance){///オーブ獲得
            this.delete = true;
            this.game.statuses[1].getOrb();
        }
        else if(this.distance>this.trackingDistance)this.tracking = 0;
        else if(this.distance<this.releaseDistance)this.tracking = 1;

        if(this.tracking){
            this.trackingSpeed+=0.012
            let angle = Math.atan2(this.player.y-this.y,this.player.x-this.x);
            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);
            this.r = this.r > 7 ? 7 : this.r+0.02;

            this.time = 0;

        }else{

            this.y += gradualCurve(this.time)
            this.dx = Math.abs(this.dx)<0.1 ? 0 : this.dx*0.99;
            this.dy = Math.abs(this.dy)<0.1 ? 0 : this.dy*0.99;
            this.trackingSpeed = this.trackingSpeed<0.2 ? 0.2 : this.trackingSpeed*0.99;
            this.r = this.r < 4 ? 4 : this.r-0.02;

            this.time+=0.02
        }
        this.x += this.dx * this.trackingSpeed;
        this.y += this.dy * this.trackingSpeed;


    }
    

    draw(ctx){
        let MAGIC = 30//透明度を管理する変数
        ctx.save()
        let random = gradualCurve(this.birthTime,0.2,4,0.2)+1
        let gradient = ctx.createRadialGradient(this.x,this.y,this.r,this.x,this.y,this.r*2*random);
        gradient.addColorStop(0, "rgba(255, 165, 0, 0.5)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r*2*random,0,Math.PI*2);
        ctx.fill();


        ctx.fillStyle = "orange"
        ctx.globalAlpha = Math.max(this.birthTime/1, (1/this.distance)*MAGIC)
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        ctx.restore()
    }
}
