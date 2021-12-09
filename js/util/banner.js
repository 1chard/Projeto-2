import $ from "../jquery.js";

class Banner {
    #x = 0;

    constructor(banner) {
        banner.style.position = 'relative';

        this.$container = $(document.createElement('div'));
        this.$container.css("position", "absolute");
        this.$container.append(banner.children);
        this.$container.appendTo(banner);
    }
    moveBy(x) {
        this.#x += x;
        this.$container.css("translate", parseInt(this.$container.css("left")) + x);
    }
    moveTo(x) {
        this.#x = x;
        this.$container.css("left", x);
    }
}

class ImageBanner extends Banner{
    #main;
    #atual = 0;
    #hold = false;
    
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
    
    moveRight(timeToSleep){
        if(!this.#hold){
            this.#hold = true
            
            this.$container.css("trans")
   
            if(this.#atual >= this.length - 1)
                this.moveTo(0)
            else
                this.moveBy(this.#main.innerWidth() * -1)
        
            this.$
        }
        
    
        
    }
}

export {Banner, ImageBanner};