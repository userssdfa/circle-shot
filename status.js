class Status{
    constructor(game,type){
        this.game = game;
        this.type = type;

        this.status = 0;
        
        this.images = [];
        
        //右上のプロパティ
        this.width = 70;
        this.height = 35;
        this.textPadding = 20;
        this.left = this.game.can.width - this.width + this.textPadding;
        //size,position,statusvalue etc...
        switch(this.type){
            case "exp":
                this.expInit();
                break;
            case "orb":
                this.orbInit();
                break;
            case "coin":
                this.coinInit();
                break;
        }
        
    }
    update(deltaTime){
        this.status = this.game.status[this.type]

        this.images.forEach(image => {
            image.update(deltaTime);
        })
    }
    draw(ctx){
        this.images.forEach(image => {
            image.draw(ctx);
        })
    }
    expInit(){
        this.maxStatus = 300;

        this.images.push(new DecorationStar(this))
        this.images.push(new ExpBar(this))
        
    }
    orbInit(){
        this.top = this.height*2

        this.images.push(new DecorationOrb(this.left-this.textPadding,this.top))
        this.images.push(new Inventory(this))
    }
    coinInit(){
        this.top = this.height*4

        this.images.push(new DecorationCoin(this.left-this.textPadding*2,this.top-(this.height/2),this.width+this.textPadding,this.height))
        this.images.push(new Inventory(this))
    }
    getOrb(){
        this.game.status.orb += 10
        this.images[1].getEffect.push({text:`${this.game.status.orb}`,time:0})
        this.images[0].getOrbEffect = 10;
        this.images[0].lastGotTime = 0;
        this.images[0].lastTargetTime = 0;
        this.images[0].targetIndex = (this.images[0].targetIndex+2)%5;
    }
    getCoin(){
        this.game.status.coin += 10
        this.images[1].getEffect.push({text:`${this.game.status.orb}`,time:0});
        this.images[0].spawn();
    }
}

class Inventory {
    constructor(parent){
        this.parent = parent;
        this.textPadding = parent.textPadding;
        this.height = parent.height;
        this.left = parent.left - this.textPadding;
        this.top = parent.top;
        this.text = parent.status.toString();

        this.getEffect = [];
        this.effectLimit = 700
    }
    update(deltaTime){
        this.getEffect.forEach(item => {item.time += deltaTime;})
        this.getEffect = this.getEffect.filter(item => item.time<this.effectLimit);

        this.text = this.parent.status.toString();
    }
    draw(ctx){
        let w = ctx.measureText(this.text).width;
        ctx.save();
        ctx.lineWidth = 1
        ctx.textBaseline = "middle"
        ctx.textAlign = "center"
        let gradient = ctx.createLinearGradient(this.left,0,this.left+this.parent.width+this.textPadding,0);
        gradient.addColorStop(0, "rgba(119, 136, 153, 0.2)")
        gradient.addColorStop(1, "rgba(119, 136, 153, 1)")
        ctx.fillStyle = gradient
        ctx.fillRect(this.left,this.top,this.parent.width,this.height/3)
        gradient = ctx.createLinearGradient(this.left,0,this.left+this.parent.width+this.textPadding,0);
        gradient.addColorStop(0, "rgba(119, 136, 153, 1)")
        gradient.addColorStop(1, "rgba(119, 136, 153, 0.2)")
        ctx.strokeStyle = gradient
        ctx.strokeRect(this.left,this.top,this.parent.width+this.textPadding,this.height/3)
        ctx.fillStyle = "DeepSkyBlue"
        ctx.strokeStyle = "blue"
        this.getEffect.forEach(item => {
            ctx.font = `bold ${pp(item.time/this.effectLimit)*(this.height*0.75)+this.height}px Consolas`;
            ctx.globalAlpha = 1 - item.time/this.effectLimit;
            ctx.fillText(item.text,this.left+w,this.top);
            
        })
        ctx.font = `${this.height}px Consolas`
        ctx.globalAlpha = 1;

        ctx.fillText(this.text,this.left+w,this.top)
        ctx.strokeText(this.text,this.left+w,this.top)
        ctx.restore()
    }
}
