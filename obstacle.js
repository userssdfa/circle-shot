class LineObstacle {
    constructor(game,vertices,width = 5){
        this.game = game;
        this.vertices = vertices;
        this.v1 = vertices[0]
        this.v2 = vertices[1]
        this.width = width;
    }
    update(){
        for(let ballet of this.game.ballets){
            if(lineCircleCollision(this.vertices[0],this.vertices[1],ballet)){
                ballet.delete = true;
            }
        }
        if(lineCircleCollision(this.vertices[0],this.vertices[1],this.game.player)){
            
            let positioning = null;
            if(positionLC(this.vertices[0],this.vertices[1],this.game.player)){
                positioning = 1
            }else{
                positioning = -1
            }
            if(this.v1.x === this.v2.x){

                this.game.player.x = this.v1.x - this.game.player.r*positioning
            }else if(this.v1.y === this.v2.y){

                this.game.player.y = this.v1.y + this.game.player.r*positioning
            }else{

                let m1 = (this.v2.y-this.v1.y)/(this.v2.x-this.v1.x);
                let m2 = -1/m1

                let b1 = this.v1.y-m1*this.v1.x
                let b2 = this.game.player.y-m2*this.game.player.x

          
                let m3 = m1;
                let b3 = b1+(this.game.player.r+2) * Math.sqrt(1+m3**2) * positioning// 2はラインの幅

                let x2 = (b2-b3) / (m3-m2);
                let y2 = m3*x2+b3;

                this.game.player.x = x2
                this.game.player.y = y2
            }
        }
    }
    draw(ctx){
        ctx.save();
        
        ctx.shadowBlur = 10; // ぼかしの半径
        ctx.shadowColor = "orange"; // ぼか しの色
        ctx.strokeStyle = "orange"
        ctx.lineWidth = this.width
        this.vertices.forEach((vertex,i)=>{
            if(i===0){
                ctx.beginPath();
                ctx.moveTo(vertex.x,vertex.y);
            }else if(i===this.vertices.length-1){
                ctx.lineTo(vertex.x,vertex.y);
                ctx.closePath();
                ctx.stroke();
            }else{
                ctx.lineTo(vertex.x,vertex.y);
            }
        })

        ctx.restore();
    }
}

class CircleObstacle{

}