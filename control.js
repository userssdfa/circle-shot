
class Control{
    constructor(type){
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.addEvent();
    }
    addEvent(){
        window.addEventListener("keydown",e=>{
            switch(e.key){
                case "ArrowUp":
                case "w":
                    this.up = -1;
                    break;
                case "ArrowDown":
                case "s":
                    this.down = 1;
                    break;
                case "ArrowLeft":
                case "a":
                    this.left = -1;
                    break;
                case "ArrowRight":
                case "d":
                    this.right = 1;
                    break;
            }
        })
        window.addEventListener("keyup",e=>{
            switch(e.key){
                case "ArrowUp":
                case "w":
                    this.up = 0;
                    break;
                case "ArrowDown":
                case "s":
                    this.down = 0;
                    break;
                case "ArrowLeft":
                case "a":
                    this.left = 0;
                    break;
                case "ArrowRight":
                case "d":
                    this.right = 0;
                    break;
            }
        })
    }
}
