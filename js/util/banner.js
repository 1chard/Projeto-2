import $ from "../jquery.js";

class Banner {
    #x = 0;

    constructor(banner) {
        banner.style.position = 'relative';

        this.$container = $(document.createElement('div'));
        this.$container.css("position", "absolute");
        this.$container.append(banner.children);
        this.$container.appendTo(banner);
        this.$container.css("transform", "translateX(0px)")
    }
    moveBy(x) {
        this.#x += x;
        this.$container.css("transform", "translateX(" + (this.#x) + "px)");
    }
    moveTo(x) {
        this.#x = x;
        this.$container.css("transform", `translateX(${x})`);
    }
}

class ImageBanner extends Banner{
    #main;
    #atual = 0;
    
    constructor(banner){
        super(banner)
        
        this.#main = $(banner)
        this.length = this.$container.children().length;
        
        this.$container.css("width", `${100 * this.length}%`)
        this.$container.css("background", "red")

        this.$container.children().each( (i, e) => {
            e.style.width = `${100 / this.length}%`
            e.style.height = '100%'
        })
    }
    
    canMoveLeft(){
        return this.#atual > 0;
    }
    
    canMoveRight(){
        return this.#atual < (this.length - 1);
    }
    
    moveRight(){
        if(this.canMoveRight()){
            this.moveBy(this.#main.innerWidth() * -1)
            this.#atual++;
        }
    }
    
    moveLeft(){
        if(this.canMoveLeft()){
            this.moveBy(this.#main.innerWidth())
            this.#atual--;
        }
    }
    
    moveRightOrBeggining(){
        if(this.canMoveRight()){
            this.moveBy(this.#main.innerWidth() * -1)
            this.#atual++;
        }
        else{
            this.moveTo(0);
            this.#atual = 0;
        }
    }
    
    moveLeftOrEnd(){
        if(this.canMoveLeft()){
            this.moveBy(this.#main.innerWidth())
            this.#atual--;
        }
        else{
            this.moveTo(this.#main.innerWidth() * (length - 1) * -1)
            this.#atual = (length - 1)
        }
            
    }
}

class PromisedImageBanner extends ImageBanner{
    constructor(banner){
        super (banner);
    }
    
    waitAndMoveLeft(msToWait){
        return new Promise( exit => {
            this.moveLeft();
            
            setTimeout( () => exit(), msToWait);
        })
    }

	waitAndMoveRight(msToWait){
        return new Promise( exit => {
            this.moveRight();
            
            setTimeout( () => exit(), msToWait);
        })
    }
}

export {Banner, ImageBanner, PromisedImageBanner};