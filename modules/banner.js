'use strict'

const moveImage = (banner, value) => {
    banner.transitionPosition += value;
    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveImageSafe = (banner, value) => {

    if (banner.transitionPosition + value >= 0)
        banner.transitionPosition = 0;

    else if (banner.transitionPosition + value < -(banner.subcontainer.children[0]?.clientWidth * (banner.elementCount - 1)))
        banner.transitionPosition = -(banner.subcontainer.children[0]?.clientWidth * (banner.elementCount - 1));

    else
        banner.transitionPosition += value;

    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveElements = (banner, direction = '') => {
    if (!banner.isLocked) {
        banner.isLocked = true;
        banner.subcontainer.style.transitionDuration = '1.2s'
        banner.subcontainer.style.transitionProperty = 'left'

        switch (direction.toUpperCase()) {
            case "LEFT":
                moveOneLeft(banner)
                break;
            case "RIGHT":
                moveOneRight(banner)
                break;
        }

        if(this.intervalTracker)
            banner.autoMove()

        banner.buttonSelect.children[banner.elementPosition].checked = 'true'

        setTimeout(() => {
            banner.subcontainer.style.transitionDuration = '0s'
            banner.isLocked = false
        }, 1200)
    }
}


function moveOneLeft(banner) {
    if (banner.elementPosition > 0) { //se n for o ultimo elemento
        banner.elementPosition--;

        moveImage(banner, banner.container.clientWidth);
    }
    else {
        banner.elementPosition = (banner.elementCount - 1);
        moveImage(banner, -(banner.container.clientWidth * (banner.elementPosition)));
    }

}

function moveOneRight(banner) {
    if (banner.elementPosition < (banner.elementCount - 1)) { //se n for o ultimo elemento
        banner.elementPosition++;
        moveImage(banner, -banner.subcontainer.children[0]?.clientWidth);

    } else {
        banner.elementPosition = 0;
        moveImage(banner, banner.subcontainer.clientWidth - banner.subcontainer.children[0]?.clientWidth);
    }
}

const moveFromSelect = (banner, movePosition = 0) => {
    if(movePosition >= 0 && movePosition < banner.elementCount && !banner.isLocked) {
            banner.isLocked = true;
            banner.subcontainer.style.transitionDuration = '1.2s'
            banner.subcontainer.style.transitionProperty = 'left'
    
            moveImage(banner, (movePosition  - banner.elementPosition ) * banner.subcontainer.children[0]?.clientWidth * -1)
            console.log(`moveposition: ${movePosition  - banner.elementPosition} + moved: ${(movePosition  - banner.elementPosition ) * banner.subcontainer.children[0]?.clientWidth}`)
    
            banner.elementPosition =  movePosition
            
    
            setTimeout(() => {
                banner.subcontainer.style.transitionDuration = '0s'
                banner.isLocked = false
            }, 1200)
        }
    
}


class Banner {
    //booleano que permite checkar se esta movendo
    isMoving = false;
    isLocked = false;

    //conta a quantidade de elementos
    elementPosition = 0;
    elementCount = 0;

    //rastreia movimento
    transitionPosition = 0
    lastTouch = 0


    constructor(banner) {
        this.container = banner
        this.container.draggable = false
        this.container.style.overflow = 'hidden'

        //cria o container que se meche
        this.generateSubContainer()

        window.addEventListener("resize", () => this.resizeElements());

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
            if (this.isMoving && !this.isLocked) {
                moveImageSafe(this, e.movementX);
            }

        })

        this.container.addEventListener("touchstart", e => {
            this.isMoving = true

            this.lastTouch = e.touches[e.touches.length - 1].screenX;
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

            if (this.isMoving && !this.isLocked) {
                moveImageSafe(this, (this.lastTouch - movimento) * -1.5);
            }


            this.lastTouch = e.touches[e.touches.length - 1].screenX;
        })

        //cria os botoes
        this.generateMoveButtons()
        this.generateSelectButtons()
    }

    generateSelectButtons(){
        this.buttonSelect = document.createElement("div")
        this.buttonSelect.classList.add('buttonSelect')
        this.buttonSelect.id = `${Math.random()}`

        for(let i = 0; i < this.elementCount; i++)
            this.appendSelectButton(i)

        this.container.parentElement.appendChild(this.buttonSelect)
    }

    appendSelectButton(i){
        let select = document.createElement("input")
        select.name = this.buttonSelect.name
    
        select.type = "radio"
        
        select.checked = this.buttonSelect.children.length === 0;
        select.onchange = () => {
            moveFromSelect(banner, i)
        }

        this.buttonSelect.appendChild(select)
    }

    generateMoveButtons() {
        this.buttonLeft = document.createElement("div");
        this.buttonRight = document.createElement("div");

        this.buttonLeft.classList.add('buttonBanner')
        this.buttonLeft.classList.add('buttonBannerLeft')

        this.buttonRight.classList.add('buttonBanner')
        this.buttonRight.classList.add('buttonBannerRight')

        this.buttonLeft.onclick = () => {
            moveElements(this, 'LEFT');
        }

        this.buttonRight.onclick = () => {
            moveElements(this, 'RIGHT');
        }

        this.container.parentElement.insertBefore(this.buttonLeft, this.container);
        this.container.parentElement.appendChild(this.buttonRight);
    }

    insertElement(element = document.createElement("div")) {
        this.subcontainer.appendChild(element)

        this.elementCount++;
        this.resizeElements();
    }

    generateImage(imageLink = new String()) {
        let image = document.createElement("div")

        image.style.height = '100%'
        image.style.backgroundImage = `url('${imageLink}')`;
        image.style.backgroundSize = 'cover'
        image.style.backgroundRepeat = 'no-repeat'
        image.style.backgroundPosition = 'center'
        image.style.left = '0px'
        image.draggable = false
        image.style.float = "left"

        this.insertElement(image)
    }

    resizeElements() {
        this.isLocked = true;
        
        if(this.intervalTracker)
            this.autoMove()

        this.subcontainer.style.width = (this.elementCount || 1) * 100 + '%';

        for (const child of this.subcontainer.children)
            child.style.width = 100 / (this.elementCount || 1) + "%"
    


        console.log(999)
        
        this.transitionPosition = (this.elementPosition || 0) * (this.subcontainer.children[0]?.clientWidth ?? 0) * -1;
        this.subcontainer.style.left = this.transitionPosition + 'px'
        
        this.isLocked = false;
    }

    regenerateSelects(){
        
    }

    generateSubContainer() {
        if (!this.subcontainer) {
            this.subcontainer = document.createElement("div");

            this.subcontainer.style.height = "100%"
            this.subcontainer.style.position = 'relative'
            this.subcontainer.style.left = '0px'
            this.subcontainer.id = 'containerBanner'
            this.subcontainer.draggable = false
            this.subcontainer.style.backgroundColor = "blue"


            this.container.appendChild(this.subcontainer)
        }
    }

    autoMove(timeInMS = 5000){
        clearInterval(this.intervalTracker)

        this.timeInterval = timeInMS ?? this.timeInterval

        this.intervalTracker = setInterval(() => {
            moveElements(this, 'RIGHT')
        }, this.timeInterval)
    }
}



//export default Banner;