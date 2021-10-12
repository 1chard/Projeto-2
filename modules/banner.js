'use strict'

const moveImage = (banner, value) =>{
    banner.transitionPosition += value;
    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveImageSafe =  (banner, value) =>{
    if(banner.transitionPosition + value >= 0)
        banner.transitionPosition = 0;

    else if(banner.transitionPosition + value < (banner.container.clientWidth * (banner.elementCount - 1) * -1) )
        banner.transitionPosition = (banner.container.clientWidth * (banner.elementCount - 1) * -1);

    else
        banner.transitionPosition += value;

    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveElements = (banner, direction, event) => {
    if(!banner.isLocked) {
        banner.isLocked = true;
        banner.subcontainer.style.transitionDuration = '1.2s'
        banner.subcontainer.style.transitionProperty = 'left'

        if (banner.options.step === 1) {
            switch (direction) {
                case "LEFT":
                    moveElementsLeft(banner)
                    break;
                case "RIGHT":
                    moveElementsRight(banner)
                    break;
            }
        }

        console.log(39201392)

        setTimeout(() => {
            banner.subcontainer.style.transitionDuration = '0s'
            banner.isLocked = false
        }, 1200)
    }
}

const moveElementsLeft = (banner) => {
        if (banner.elementPosition > 0) { //se n for o primeiro elemento
            banner.elementPosition--;

            moveImage(banner, banner.container.clientWidth);
        }
}


const moveElementsRight = (banner) => {
        if (banner.elementPosition < (banner.elementCount - banner.options.step)) { //se n for o ultimo elemento
            banner.elementPosition += banner.options.step;

            moveImage(banner, -banner.subcontainer.children[0].clientWidth * banner.options.step);
        }

}

/*
moveOneLeft(){
    if(!this.isLocked) {

        this.isLocked = true;
        this.subcontainer.style.transitionDuration = '1.2s'
        this.subcontainer.style.transitionProperty = 'left'
        setTimeout(() => {
            this.subcontainer.style.transitionDuration = '0s'
            this.isLocked = false
        }, 1200)


        if (this.elementPosition > 0) { //se n for o ultimo elemento
            this.elementPosition--;

            moveImage(this, this.container.clientWidth);
        }
        else {
            this.elementPosition = (this.elementCount - 1);

            moveImage(this, -(this.container.clientWidth * (this.elementPosition)));
        }
    }
}

moveOneRight(){
    if(!this.isLocked) {
        this.isLocked = true;
        this.subcontainer.style.transitionDuration = '1.2s'
        this.subcontainer.style.transitionProperty = 'left'
        setTimeout(() => {
            this.subcontainer.style.transitionDuration = '0s'
            this.isLocked = false
        }, 1200)

        if (this.elementPosition < (this.elementCount - 1)) { //se n for o ultimo elemento
            this.elementPosition += this.options.step;

            moveImage(this, -this.subcontainer.children[0].clientWidth);

        } else {
            this.elementPosition = 0;
            moveImage(this, this.subcontainer.clientWidth - this.subcontainer.children[0].clientWidth);
        }
    }
}
*/

class Banner{
    //booleano que permite checkar se esta movendo
    isMoving = false;
    isLocked = false;

    //conta a quantidade de elementos
    elementPosition = 0;
    elementCount = 0;

    //containers, primeiro é o elemento, segundo é o slide
    container = null;
    subcontainer = null;

    //rastreia movimento
    transitionPosition = 0
    lastTouch = 0

    //monta os movimentos
    options = { "size": "100%", "step": 1};

    //e os botoes que movem
    buttonLeft = null;
    buttonRight = null;

    constructor(banner, optionsIn = { "size": "100%", "step": 1}) {
        this.container = banner
        this.container.style.overflow = 'hidden'

        this.options = optionsIn

        //cria o container que se meche
        this.subcontainer = this.generateSubContainer()
        this.container.appendChild(this.subcontainer)

        window.addEventListener("resize" ,() => this.resize());

        this.generateImage('../img/hamburguer_classico.jpg')
        this.generateImage('../img/hamburguer_salada.jpg')
        this.generateImage('../img/hamburguer_salada.jpg')
        this.generateImage('../img/hamburguer_salada.jpg')

        this.container.addEventListener("mousedown", e => {
            this.isMoving = true
        })

        this.container.addEventListener("mouseup", e => {
            this.isMoving = false
        })
        this.container.addEventListener("mouseout", e => {
            this.isMoving = false
        })

        this.container.addEventListener("mousemove", e => {
            if(this.isMoving && !this.isLocked){
                moveImageSafe(this, e.movementX);
            }

        })

        this.container.addEventListener("touchstart", e => {
            this.isMoving = true

            this.lastTouch =  e.touches[e.touches.length - 1].screenX;
        })

        this.container.addEventListener("touchend", e => {
            this.isMoving = false


        })

        this.container.addEventListener("touchcancel", e => {
            this.isMoving = false
        })

        this.container.addEventListener("touchmove", e => {
            let movimento = e.touches[e.touches.length - 1].screenX;


            console.log(this.lastTouch)

            if(this.isMoving && !this.isLocked){
                moveImageSafe(this, (this.lastTouch - movimento) * -1);
            }


            this.lastTouch = e.touches[e.touches.length - 1].screenX;
        })

        //cria os botoes
        this.generateButtons()
    }

    generateButtons(){
        this.buttonLeft = document.createElement("div");
        this.buttonRight = document.createElement("div");

        this.buttonLeft.textContent = '<<'
        this.buttonLeft.id = 'buttonBannerLeft'


        if (this.elementPosition === 0 && this.options.step !== 1)
            this.buttonLeft.style.visibility = "hidden"

        this.buttonLeft.onclick = () => {
            moveElements(this, 'LEFT');

            if (banner.elementPosition === 0 && this.options.step !== 1)
                this.buttonRight.style.visibility = "hidden"
            else
                this.buttonRight.style.visibility = "visible"
        }

        if (this.elementPosition === (this.elementCount - this.options.step) && this.options.step !== 1)
            this.buttonRight.style.visibility = "hidden"

        this.buttonRight.onclick = () => {
            moveElements(this, 'RIGHT');

            if (this.elementPosition === (this.elementCount - this.options.step) && this.options.step !== 1)
                this.buttonLeft.style.visibility = "hidden"
            else
                this.buttonLeft.style.visibility = "visible"
        }



        //buttonRight.style.position = 'relative'
        this.buttonRight.textContent = '>>'
        this.buttonRight.id = 'buttonBannerRight'

        this.container.parentElement.insertBefore(this.buttonLeft, this.container);
        this.container.parentElement.appendChild(this.buttonRight);
    }

    insertElement(element = document.createElement("div")){

    }

    generateImage(imageLink = new String()){
            let image = document.createElement("div")

            image.style.height = '100%'
            image.style.backgroundImage = `url('${imageLink}')`;
            image.style.backgroundSize = 'cover'
            image.style.backgroundRepeat = 'no-repeat'
            image.style.backgroundPosition = 'center'
            image.style.left = '0px'
            image.draggable = false
            image.style.float = "left"

            this.subcontainer.appendChild(image)

            this.elementCount++;
            this.resize();
    }

    resize(){
        this.subcontainer.style.width = (this.elementCount * parseInt(this.options.size)) + (this.options.size.endsWith('%')? '%' : "px");

        if(this.options.size.endsWith('%'))
            for(const child of this.subcontainer.children)
                child.style.width = parseFloat(this.options.size.substring(0, this.options.size.length)) / (this.elementCount || 1) + "%"

    }

    generateSubContainer(){
        if(this.subcontainer === null) {
            let subcontainer = document.createElement("div");

            subcontainer.style.height = "100%"
            subcontainer.style.position = 'relative'
            subcontainer.style.left = '0px'
            subcontainer.id = 'containerBanner'
            subcontainer.draggable = false

            return subcontainer
        }
        else
            return null
    }
}



//export default Banner;