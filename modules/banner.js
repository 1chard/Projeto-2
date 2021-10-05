'use strict'

const moveImage = (banner, value) =>{
    banner.transitionPosition += value;
    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

const moveImageSafe = (banner, value) =>{
    console.log(banner.transitionPosition + value )

    if(banner.transitionPosition + value >= 0)
        banner.transitionPosition = 0;
   else if(banner.transitionPosition + value < (banner.container.clientWidth * (banner.imageCount - 1) * -1) )
        banner.transitionPosition = (banner.container.clientWidth * (banner.imageCount - 1) * -1);
    else
        banner.transitionPosition += value;
    banner.subcontainer.style.left = banner.transitionPosition + 'px'
}

class Banner{
    //booleano que rastreia tudo
    isMoving = false;
    isLocked = false;

    //rastreia imagem
    imageTracker = 0;
    imageCount = 0;

    //guarda tudo
    container = null;
    subcontainer = null

    //rastreia movimento
    transitionPosition = 0

    constructor(banner) {
        this.container = banner
        this.container.style.overflow = 'hidden'


        //cria o container que se meche
        this.subcontainer = this.generateSubContainer()

        this.container.appendChild(this.subcontainer)

        //let imageLinkArray = ["../img/hamburguer_classico.jpg", "../img/hamburguer_salada.jpg", "../img/hamburguer_salada.jpg"];

        this.generateImage('../img/hamburguer_classico.jpg')
        this.generateImage('../img/hamburguer_salada.jpg')


        this.subcontainer.children[0].style.backgroundColor = 'red'
        this.subcontainer.children[1].style.backgroundColor = 'blue'
        //this.subcontainer.children[2].style.backgroundColor = 'green'

        window.addEventListener("resize" ,() => this.resize());

        //moveffect que segura as infos
        this.isMoving = false
        this.imageTracker = 0

        this.container.addEventListener("mousedown", e => {
            this.isMoving = true
        })

        this.container.addEventListener("mouseup", e => {
            this.isMoving = false
        })

        this.container.addEventListener("mousemove", e => {
            if(this.isMoving && !this.isLocked) {
                //if( (this.transitionPosition + e.movementX) <= 0 &&
                    //(this.transitionPosition + e.movementX) >= (this.subcontainer.offsetWidth * -1))

                    moveImageSafe(this, e.movementX);
            }

        })

        //cria os botoes
        this.generateButtons()

    }

    generateButtons(){
        let buttonLeft = document.createElement("div");
        buttonLeft.style.position = 'relative'
        buttonLeft.textContent = '<<'
        buttonLeft.id = 'buttonBannerLeft'
        this.container.appendChild(buttonLeft);


        let buttonRight = document.createElement("div");
        buttonRight.style.position = 'relative'
        buttonRight.textContent = '>>'
        buttonRight.id = 'buttonBannerRight'

        buttonRight.onclick = () => this.moveRight();
        buttonLeft.onclick = () => this.moveLeft();
        this.container.appendChild(buttonRight);
    }

    moveLeft(){

        if(this.imageTracker > 0 && !this.isLocked){ //se n for o ultimo elemento

            this.subcontainer.style.transitionDuration = '1.5s'
            this.subcontainer.style.transitionProperty = 'left'
            this.isLocked = true;

            setTimeout( () => {
                this.subcontainer.style.transitionDuration = '0s'
                this.isLocked = false
            }, 1500)

            this.imageTracker--;

            moveImage(this, this.container.clientWidth);
        }
    }


    moveRight(){

        if(this.imageTracker < (this.subcontainer.children.length - 1) && !this.isLocked){ //se n for o ultimo elemento

            this.subcontainer.style.transitionDuration = '1.5s'
            this.subcontainer.style.transitionProperty = 'left'
            this.isLocked = true;

            setTimeout( () => {
                this.subcontainer.style.transitionDuration = '0s'
                this.isLocked = false
            }, 1500)

            this.imageTracker++;

            moveImage(this, -this.container.clientWidth);


        }
    }

    generateImage(imageLink){
            let image = document.createElement("div")

            image.style.height = '100%'
            image.style.backgroundImage = "url('" + imageLink + "')";
            image.style.backgroundSize = 'cover'
            image.style.backgroundRepeat = 'no-repeat'
            image.style.backgroundPosition = 'center'
            image.style.left = '0px'

            this.subcontainer.appendChild(image)

            this.imageCount++;
            this.resize();
    }

    resize(){

        this.subcontainer.style.width = (this.imageCount * 100) + '%'

        for(const child of this.subcontainer.children)
            child.style.width = this.subcontainer.clientWidth / this.imageCount + 'px'

    }

    generateSubContainer(){
        let subcontainer = document.createElement("div");

        subcontainer.style.height = "100%"
        subcontainer.style.position = 'relative'
        subcontainer.style.left = '0px'
        subcontainer.style.display = 'flex'
        subcontainer.style.flexDirection = 'row'
        subcontainer.id = 'containerBanner'

        return subcontainer
    }
}



export default Banner;