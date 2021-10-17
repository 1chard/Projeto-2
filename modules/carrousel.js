'use strict'

const moveImage = (banner, value) => {
    banner.transitionPosition += value;
    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveImageSafe = (banner, value) => {
    if (banner.transitionPosition + value >= 0)
        banner.transitionPosition = 0;

    else if (banner.transitionPosition + value < (banner.subcontainer.clientWidth * -1 + banner.subcontainer.children[0].clientWidth))
        banner.transitionPosition = (banner.subcontainer.clientWidth * -1 + banner.subcontainer.children[0].clientWidth);

    else
        banner.transitionPosition += value;

    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveElements = (banner, direction, event) => {
    if (!banner.isLocked) {
        banner.isLocked = true;
        banner.subcontainer.style.transitionDuration = '1.2s'
        banner.subcontainer.style.transitionProperty = 'left'

        if (banner.options.step !== 1) {
            switch (direction) {
                case "LEFT":
                    moveElementsLeft(banner)
                    break;
                case "RIGHT":
                    moveElementsRight(banner)
                    break;
            }
        }
        else {
            switch (direction) {
                case "LEFT":
                    moveOneLeft(banner)
                    break;
                case "RIGHT":
                    moveOneRight(banner)
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

        moveImageSafe(banner, banner.container.clientWidth);
    }
}


const moveElementsRight = (banner) => {
    if (banner.elementPosition < (banner.elementCount - banner.options.step)) { //se n for o ultimo elemen
        banner.elementPosition += banner.options.step;

        moveImageSafe(banner, -banner.subcontainer.children[0].clientWidth * banner.options.step);
    }

}


function moveOneLeft(banner) {
    if (banner.elementPosition > 0) { //se n for o ultimo elemento
        banner.elementPosition--;

        moveImageSafe(banner, banner.container.clientWidth);
    }
    else {
        banner.elementPosition = (banner.elementCount - 1);

        moveImageSafe(banner, -(banner.container.clientWidth * (banner.elementPosition)));
    }

}

function moveOneRight(banner) {
    if (banner.elementPosition < (banner.elementCount - 1)) { //se n for o ultimo elemento
        banner.elementPosition++;

        moveImage(banner, -banner.subcontainer.children[0].clientWidth);

    } else {
        banner.elementPosition = 0;
        moveImage(banner, banner.subcontainer.clientWidth - banner.subcontainer.children[0].clientWidth);
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


    constructor(banner, optionsIn = { "size": "100%", "step": 1 }) {
        this.container = banner
        this.container.draggable = false
        this.container.style.overflow = 'hidden'

        this.options = optionsIn

        //cria o container que se meche
        this.subcontainer = this.generateSubContainer()
        this.container.appendChild(this.subcontainer)

        window.addEventListener("resize", () => this.resize());

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
                moveImageSafe(this, (this.lastTouch - movimento) * -1);
            }


            this.lastTouch = e.touches[e.touches.length - 1].screenX;
        })

        //cria os botoes
        this.generateButtons()
    }

    generateButtons() {
        this.buttonLeft = document.createElement("div");
        this.buttonRight = document.createElement("div");

        this.buttonLeft.textContent = 'arrow_back'
        this.buttonLeft.classList.add('material-icons')
        this.buttonLeft.classList.add('buttonBanner')
        this.buttonLeft.classList.add('buttonBannerLeft')

        if (this.elementPosition === 0 && this.options.step !== 1)
            this.buttonLeft.style.visibility = "hidden"

        this.buttonLeft.addEventListener("click", () => {

            console.log("ff")

            moveElements(this, 'LEFT');

            if (this.elementPosition === 0 && this.options.step !== 1)
                this.buttonLeft.style.visibility = "hidden"
            else
                this.buttonLeft.style.visibility = "visible"
        })

        if (this.elementPosition === (this.elementCount - this.options.step) && this.options.step !== 1)
            this.buttonRight.style.visibility = "hidden"

        this.buttonRight.addEventListener("click", () => {

            console.log("ff")
            moveElements(this, 'RIGHT');

            if (this.elementPosition === (this.elementCount - this.options.step) && this.options.step !== 1)
                this.buttonRight.style.visibility = "hidden"
            else
                this.buttonRight.style.visibility = "visible"
        })




        this.buttonRight.textContent = 'arrow_forward'
        this.buttonRight.classList.add('material-icons')
        this.buttonRight.classList.add('buttonBanner')
        this.buttonRight.classList.add('buttonBannerRight')

        this.container.parentElement.insertBefore(this.buttonLeft, this.container);
        this.container.parentElement.appendChild(this.buttonRight);
    }

    insertElement(element = document.createElement("div")) {
        this.subcontainer.appendChild(element)

        this.elementCount++;
        this.resize();
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

    resize() {
        this.subcontainer.style.width = ((this.elementCount || 1) * parseInt(this.options.size)) +
            (this.options.size.endsWith('%') ? '%' : 'px');

        for (const child of this.subcontainer.children)
            child.style.width = this.options.size.endsWith('%') ? 100 / (this.elementCount || 1) + "%" : parseInt(this.options.size) + 'px'
    }

    generateSubContainer() {
        if (!this.subcontainer) {
            let subcontainer = document.createElement("div");

            subcontainer.style.height = "100%"
            subcontainer.style.position = 'relative'
            subcontainer.style.left = '0px'
            subcontainer.id = 'containerBanner'
            subcontainer.draggable = false
            subcontainer.style.backgroundColor = "blue"

            return subcontainer;
        }
    }
}



//export default Banner;