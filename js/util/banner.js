'use strict';

const moveBy = (banner, value) => {
    banner.transitionPosition += value;
    banner.subcontainer.style.transform = `translateX(${banner.transitionPosition}px)`
}

const moveTo = (banner, value) => {
    banner.transitionPosition = value;
    banner.subcontainer.style.transform = `translateX(${banner.transitionPosition}px)`
}

const moveBySafe = (banner, value) => {
    if (banner.transitionPosition + value >= 0)
        moveTo(banner, 0);
    else if (banner.transitionPosition + value < -(banner.subcontainer.children[0].clientWidth * (banner.elementCount - 1)))
        moveTo(banner, -(banner.subcontainer.children[0].clientWidth * (banner.elementCount - 1)));
    else
        moveBy(banner, value);
}

const preMove = (banner, otherTime = 0) => {
    banner.isLocked = true;
    banner.subcontainer.style.willchange = 'transform'
    banner.subcontainer.style.transitionDuration = `${otherTime || banner.transitionMiliseconds}ms`
    banner.subcontainer.style.transitionProperty = 'transform'

    setTimeout(() => {
        banner.subcontainer.style.transitionDuration = '0s'
        banner.isLocked = false
    }, otherTime || banner.transitionMiliseconds)
}

const move = (banner, direction) => {
    if (!banner.isLocked) {
        preMove(banner)

        switch (direction) {
            case "LEFT":
                moveLeft(banner)
                break;
            case "RIGHT":
                moveRight(banner)
                break; main
        }

        if (banner.intervalTracker)
            banner.autoMove()

        if (banner.data.selectable.status)
            banner.data.selectable.main.children[banner.elementPosition].checked = 'true'
    }
}


function moveLeft(banner) {
    if (banner.elementPosition > 0) { //se n for o ultimo elemento
        banner.elementPosition--;

        moveBy(banner, banner.container.clientWidth);
    }
    else {
        banner.elementPosition = (banner.elementCount - 1);
        moveTo(banner, -banner.subcontainer.children[0].clientWidth * (banner.elementPosition));
    }

}

function moveRight(banner) {
    if (banner.elementPosition < (banner.elementCount - 1)) { //se n for o ultimo elemento
        banner.elementPosition++;
        moveBy(banner, -banner.subcontainer.children[0].clientWidth);

    } else {
        banner.elementPosition = 0;
        moveTo(banner, 0);
    }
}


const moveFromSelect = (banner, movePosition = 0) => {
    if (movePosition >= 0 && movePosition < banner.elementCount) {
        preMove(banner)
        moveBy(banner, (movePosition - banner.elementPosition) * banner.subcontainer.children[0]?.clientWidth * -1)
        banner.elementPosition = movePosition
    }
}

class Banner {
    data = {
        touchable: {
            status: false,
        },
        selectable: {
            status: false,
        },
        moveable: {
            status: false,
        }
    }
    //booleano que permite checkar se esta movendo
    isMoving = false;
    isLocked = false;

    //conta a quantidade de elementos
    elementPosition = 0;
    elementCount = 0;

    //rastreia movimento
    transitionPosition = 0

    transitionMiliseconds = 1000

    constructor(banner) {
        this.container = banner
        this.container.style.overflowX = 'hidden'

        //cria o container que se meche
        this.subcontainer = document.createElement("div");
        this.subcontainer.style.height = "100%"
        this.subcontainer.style.position = 'relative'
        this.subcontainer.classList.add('bannerContainer')
        this.container.appendChild(this.subcontainer)

        window.addEventListener("resize", () => this.resize());

        for (const child of this.container.children)
            this.add(child)
    }

    touchable() {
        if (!this.data.touchable.status) {
            this.data.touchable.status = true;

            let tempCallback = () => {
                this.isMoving = false
                let endMove = (this.data.touchable.beginMove - this.transitionPosition)

                if (endMove > this.subcontainer.children[0]?.clientWidth / 4) {
                    preMove(this)
                    moveBy(this, (this.subcontainer.children[0]?.clientWidth - endMove) * -1)
                    this.elementPosition++;
                }
                else if (endMove < (this.subcontainer.children[0]?.clientWidth / 4 * -1)) {
                    preMove(this)
                    moveBy(this, this.subcontainer.children[0]?.clientWidth + endMove)
                    this.elementPosition--;
                }
                else {
                    preMove(this, this.transitionMiliseconds / 2)
                    moveBy(this, endMove)
                }
                this.autoMove()

                if(this.data.selectable.status)
                    this.data.selectable.main.children[this.elementPosition].checked = 'true'
            }

            this.container.addEventListener("touchstart", e => {
                this.isMoving = true
                this.data.touchable.lastTouch = e.touches[e.touches.length - 1].screenX;
                this.data.touchable.beginMove = this.transitionPosition
            })

            this.container.addEventListener("touchend", tempCallback)
            this.container.addEventListener("touchcancel", tempCallback)

            this.container.addEventListener("touchmove", e => {
                let movimento = e.touches[e.touches.length - 1].screenX;

                if (this.isMoving && !this.isLocked)
                    moveBySafe(this, (this.data.touchable.lastTouch - movimento) * -1.5);


                this.data.touchable.lastTouch = e.touches[e.touches.length - 1].screenX;
            })
        }
    }

    selectable() {
        if (!this.data.selectable.status) {
            this.data.selectable.status = true

            this.data.selectable.main = document.createElement("div")
            this.data.selectable.main.classList.add('buttonSelect')
            this.data.selectable.main.setAttribute('data-name', `${Math.random()}`)
            this.container.parentElement.appendChild(this.data.selectable.main)

            for(let i = 0; this.subcontainer.children.length > i; i++)
                this.appendSelectButton(i)
        }
    }

    appendSelectButton(i) {
        let select = document.createElement("input")
        select.name = this.data.selectable.main.getAttribute('data-name')
        select.type = "radio"
        select.checked = i === this.elementPosition;
        select.onchange = () => moveFromSelect(this, i)
        this.data.selectable.main.appendChild(select)

        console.log(i)
    }

    moveable() {
        this.buttonLeft = document.createElement("div");
        this.buttonRight = document.createElement("div");

        this.buttonLeft.classList.add('buttonBanner', 'buttonBannerLeft')
        this.buttonRight.classList.add('buttonBanner', 'buttonBannerRight')

        this.buttonLeft.onclick = () => move(this, 'LEFT');
        this.buttonRight.onclick = () => move(this, 'RIGHT');

        this.container.parentElement.insertBefore(this.buttonLeft, this.container);
        this.container.parentElement.appendChild(this.buttonRight);
    }

    add(element) {
        element.style.height = '100%'
        element.style.float = "left"

        this.subcontainer.appendChild(element)

        if (this.data.selectable.status)
            this.appendSelectButton(this.elementCount);


        this.elementCount++

        this.resize();
    }

    gen(imageLink) {
        let image = document.createElement("div")

        image.style.backgroundImage = `url('${imageLink}')`;
        image.style.backgroundSize = 'cover'
        image.style.backgroundRepeat = 'no-repeat'
        image.style.backgroundPosition = 'center'

        this.add(image)
    }

    resize() {
        this.isLocked = true;

        if (this.intervalTracker)
            this.autoMove()

        this.subcontainer.style.width = (this.elementCount || 1) * 100 + '%';

        for (const child of this.subcontainer.children)
            child.style.width = 100 / (this.elementCount || 1) + "%"

        moveTo(this, (this.elementPosition || 0) * (this.subcontainer.children[0].clientWidth || 0) * -1);

        this.isLocked = false;
    }

    autoMove(timeInMS = 5000) {
        clearInterval(this.intervalTracker)

        this.timeInterval = timeInMS ?? this.timeInterval ?? 0

        this.intervalTracker = setInterval(() => {
            move(this, 'RIGHT')
        }, this.timeInterval)
    }
}

export default Banner;