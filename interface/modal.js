


var modal = {
    container: undefined,
    main: undefined,
    hidden: true,
    toggle: function () {
        this.container.style.display = this.hidden? "block": "none";
        this.hidden = !this.hidden;
    },
    hide: function () {
        this.container.style.display = "none";
        this.hidden = true;
    },
    show: function () {
        this.container.style.display = "block";
        this.hidden = false;
    },
    html: function (html) {
        this.main.innerHTML = html;
    }
}


modal.container = document.createElement('div');
modal.container.id = "modalContainer";


modal.container.onclick = function (e) {
    if(e.target === this)
        modal.toggle();
}

document.body.appendChild(modal.container);

modal.main = document.createElement('div');
modal.main.id = "modal";
modal.container.appendChild(modal.main)

if(window.getComputedStyle(modal.container).getPropertyValue('display') !== 'none')
    modal.container.style.display = 'none'