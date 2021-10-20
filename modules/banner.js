'use strict'

const moveImage = (banner, value) => {
    banner.transitionPosition += value;
    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveImageSafe = (banner, value) => {
    if (banner.transitionPosition + value >= 0)
        banner.transitionPosition = 0;
    else if (banner.transitionPosition + value < -(banner.subcontainer.children[0].clientWidth * (banner.elementCount - 1)))
        banner.transitionPosition = -(banner.subcontainer.children[0].clientWidth * (banner.elementCount - 1));
    else
        banner.transitionPosition += value;

    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveEffect = (banner, otherTime = 0) => {
    banner.isLocked = true;
    banner.subcontainer.style.transitionDuration = `${otherTime || banner.transitionMiliseconds}ms`
    banner.subcontainer.style.transitionProperty = 'left'

    setTimeout(() => {
        banner.subcontainer.style.transitionDuration = '0s'
        banner.isLocked = false
    }, otherTime || banner.transitionMiliseconds)
}

const moveElements = (banner, direction = '') => {
    if (!banner.isLocked) {
        moveEffect(banner)

        switch (direction.toUpperCase()) {
            case "LEFT":
                moveOneLeft(banner)
                break;
            case "RIGHT":
                moveOneRight(banner)
                break;
        }

        if(banner.intervalTracker ?? false)
            banner.autoMove()

        banner.buttonSelect.children[banner.elementPosition].checked = 'true'

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
        moveImage(banner, -banner.subcontainer.children[0].clientWidth);

    } else {
        banner.elementPosition = 0;
        moveImage(banner, banner.subcontainer.clientWidth - banner.subcontainer.children[0]?.clientWidth);
    }
}


const moveFromSelect = (banner, movePosition = 0) => {
    if (movePosition >= 0 && movePosition < banner.elementCount) {
        moveEffect(banner)

        moveImage(banner, (movePosition - banner.elementPosition) * banner.subcontainer.children[0]?.clientWidth * -1)
       
        banner.elementPosition = movePosition
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

    transitionMiliseconds = 1000

    constructor(banner) {
        this.container = banner
        this.container.draggable = false
        this.container.style.overflowX = 'hidden'

        //cria o container que se meche
        this.generateSubContainer()

        window.addEventListener("resize", () => this.resizeElements());

       


        //cria os botoes
        this.generateMoveButtons()
        this.generateSelectButtons()
        this.generateTouchMovement()

        
        for(const child of this.container.children){
            this.insertElement(child)
        }

        this.generateImage('img/hamburguer_classico.jpg')
        this.generateImage('img/hamburguer_salada.jpg')
        this.generateImage('img/hamburguer_salada.jpg')
        this.generateImage('img/hamburguer_salada.jpg')
        
    }

    generateTouchMovement() {

        if (!this.touchable) {
            this.touchable = true

            let tempCallback = () => {
                this.isMoving = false
                let endMove = (this.beginMove - this.transitionPosition)

                if (endMove > this.subcontainer.children[0]?.clientWidth / 4) {
                    moveEffect(this)
                    moveImage(this, (this.subcontainer.children[0]?.clientWidth - endMove) * -1)
                    this.elementPosition++;
                }
                else if (endMove < (this.subcontainer.children[0]?.clientWidth / 4 * -1)) {
                    moveEffect(this)
                    moveImage(this, this.subcontainer.children[0]?.clientWidth + endMove)
                    this.elementPosition--;
                }
                else{
                    moveEffect(this, this.transitionMiliseconds / 1.5)
                    moveImage(this, endMove)
                }
                this.autoMove()

                this.buttonSelect.children[this.elementPosition].checked = 'true'
            }

            this.container.addEventListener("touchstart", e => {
                this.isMoving = true
                this.lastTouch = e.touches[e.touches.length - 1].screenX;
                this.beginMove = this.transitionPosition
            })

            this.container.addEventListener("touchend", tempCallback)
            this.container.addEventListener("touchcancel", tempCallback)

            this.container.addEventListener("touchmove", e => {
                let movimento = e.touches[e.touches.length - 1].screenX;

                if (this.isMoving && !this.isLocked)
                    moveImageSafe(this, (this.lastTouch - movimento) * -1.5);


                this.lastTouch = e.touches[e.touches.length - 1].screenX;
            })
        }
    }

    generateMouseMovement() {
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
    }

    generateSelectButtons() {
        this.buttonSelect = document.createElement("div")
        this.buttonSelect.classList.add('buttonSelect')
        this.buttonSelect.setAttribute('data-name', `${Math.random()}`)
        this.container.parentElement.appendChild(this.buttonSelect)
    }

    appendSelectButton(i) {
        let select = document.createElement("input")

        select.name = this.buttonSelect?.getAttribute('data-name')

        select.type = "radio"

        select.checked = this.buttonSelect.children.length === 0;
        select.onchange = () => {
            moveFromSelect(this, i)
        }

        this.buttonSelect.appendChild(select)
    }

    generateMoveButtons() {
        this.buttonLeft = document.createElement("div");
        this.buttonRight = document.createElement("div");

        this.buttonLeft.classList.add('buttonBanner', 'buttonBannerLeft')

        this.buttonRight.classList.add('buttonBanner', 'buttonBannerRight')

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
        element.style.height = '100%'
        element.style.left = '0px'
        element.draggable = false
        element.style.float = "left"

        this.subcontainer.appendChild(element)

        this.appendSelectButton(this.elementCount++);
        
        this.resizeElements();
    }

    generateImage(imageLink = '') {
        let image = document.createElement("div")

        image.style.backgroundImage = `url('${imageLink}')`;
        image.style.backgroundSize = 'cover'
        image.style.backgroundRepeat = 'no-repeat'
        image.style.backgroundPosition = 'center'

        this.insertElement(image)
    }

    resizeElements() {
        this.isLocked = true;

        if (this.intervalTracker)
            this.autoMove()

        this.subcontainer.style.width = (this.elementCount || 1) * 100 + '%';

        for (const child of this.subcontainer.children)
            child.style.width = 100 / (this.elementCount || 1) + "%"

        this.transitionPosition = (this.elementPosition || 0) * (this.subcontainer.children[0]?.clientWidth ?? 0) * -1;
        this.subcontainer.style.left = this.transitionPosition + 'px'

        this.isLocked = false;
    }

    generateSubContainer() {
        if (!this.subcontainer) {
            this.subcontainer = document.createElement("div");

            this.subcontainer.style.height = "100%"
            this.subcontainer.style.position = 'relative'
            this.subcontainer.style.left = '0px'
            this.subcontainer.classList.add('bannerContainer')
            this.subcontainer.draggable = false


            this.container.appendChild(this.subcontainer)
        }
    }

    autoMove(timeInMS = 5000) {
        clearInterval(this.intervalTracker)

        this.timeInterval = timeInMS ?? this.timeInterval

        this.intervalTracker = setInterval(() => {
            moveElements(this, 'RIGHT')
        }, this.timeInterval)
    }
}



//export default Banner;