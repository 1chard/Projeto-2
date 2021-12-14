class Banner {
    #x = 0;

    /**
     * @param {HTMLElement} banner 
     */
    constructor(banner) {
        /**
         * @type {HTMLElement}
         */
        this.container = document.createElement('div');
        this.container.style.position = "relative";
        this.container.append(...banner.children);
        this.container.style.transform =  "translateX(0px)";

        banner.append(this.container);
    }
    moveBy(x) {
        this.#x += x;
        this.container.style.transform = `translateX(${this.#x}px)`;
    }
    moveTo(x) {
        this.#x = x;
        this.container.style.transform = `translateX(${x})`;
    }
}

class ImageBanner extends Banner{
    /**
     * @type {HTMLElement} 
     */
    #main;
    #atual = 0;
    
    /**
     * @param {HTMLElement} banner 
     */
    constructor(banner){
        super(banner)
        
        console.log(this.container.children)

        this.#main = (banner)
        this.length = this.container.childElementCount
        
        this.container.style.width = `${100 * this.length}%`

        this.container.childNodes.forEach( e => {
            e.style.width = `${100 / this.length}%`
            e.style.display = 'block'
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
    
    /**
     * @param {number} msToWait 
     * @returns {Promise<Void>}
     */
    waitAndMoveLeft(msToWait){
        return new Promise( exit => {
            this.moveLeftOrEnd();
            
            setTimeout( () => exit(), msToWait);
        })
    }

    /**
     * @param {number} msToWait 
     * @returns {Promise<Void>}
     */
	waitAndMoveRight(msToWait){
        return new Promise( exit => {
            this.moveRightOrBeggining();
            
            setTimeout( () => exit(), msToWait);
        })
    }
}

export {Banner, ImageBanner, PromisedImageBanner};