'use strict'

const generateSubContainer = (arrayLinks) => {
    if(!arrayLinks instanceof Array)
        throw null

    let subcontainer = document.createElement("div")

    subcontainer.style.width = (arrayLinks.length * 100) + '%'
    subcontainer.style.height = "100%"
    subcontainer.style.position = 'relative'
    subcontainer.style.left = '0px'
    subcontainer.style.display = 'flex'
    subcontainer.style.flexDirection = 'row'
    subcontainer.id = 'containerBanner'

    return subcontainer
}

class Banner{
    isMoving = false;
    isLocked = false;

    imageTracker = 0;
    container;


    constructor(banner) {
        this.container = banner
        this.container.style.overflow = 'hidden'

        //cria o container que se meche
        this.imageLinkArray = ["../img/hamburguer_classico.jpg", "../img/hamburguer_salada.jpg", "../img/hamburguer_salada.jpg"];

        this.subcontainer = generateSubContainer(this.imageLinkArray)

        this.container.appendChild(this.subcontainer)


        //cria imagens
        for(const imageLink of this.imageLinkArray){


            let image = document.createElement("div")

            image.style.width = this.subcontainer.scrollWidth / this.imageLinkArray.length + 'px'
            image.style.height = this.subcontainer.offsetHeight + 'px'
            image.style.backgroundImage = "url('" + imageLink + "')";
            image.style.backgroundSize = 'cover'
            image.style.backgroundRepeat = 'no-repeat'
            image.style.backgroundPosition = 'center'
            image.style.left = '0px'

            this.subcontainer.appendChild(image)
        }

        this.subcontainer.children[0].style.backgroundColor = 'red'
        this.subcontainer.children[1].style.backgroundColor = 'blue'
        this.subcontainer.children[2].style.backgroundColor = 'green'

        window.addEventListener("resize" ,() => {
            for(const child of this.subcontainer.children) {
                child.style.width = this.subcontainer.clientWidth / this.imageLinkArray.length + 'px'
                child.style.height = this.subcontainer.clientHeight + 'px'
            }
        });

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

            let baseMove = parseInt(this.subcontainer.style.left.substring(0, this.subcontainer.style.left.length - 2))


            if(this.isMoving && !this.isLocked)
                this.subcontainer.style.left = (e.movementX + baseMove) + 'px'


            //console.log( e.offsetX + '/' + e.movementX + '/' + this.subcontainer.style.left)

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
        this.container.appendChild(buttonRight);
    }

    moveRight(){

        if(this.imageTracker < (this.subcontainer.children.length - 1)){ //se n for o ultimo elemento

            this.subcontainer.style.transitionDuration = '1.5s'
            this.subcontainer.style.transitionProperty = 'left'
            this.isLocked = true;

            this.subcontainer.ontransitionend = () =>{
                this.subcontainer.style.transitionDuration = '0s'
                this.isLocked = false
            }

            this.imageTracker++;

            let baseMove = parseInt(this.subcontainer.style.left.substring(0, this.subcontainer.style.left.length - 2))

                console.log(this.subcontainer.style.left = (baseMove - this.container.clientWidth) + 'px')


        }
    }



}

export default Banner;