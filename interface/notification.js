'use strict';

var notif = {
    trackerTimeout: undefined,
    isIdle: false,
    message: function (title, message, time = 4000, extraHtml = '') {
        return new Promise((exit) => {
            this.main.style.display = 'none'
            clearTimeout(this.trackerTimeout ?? 0)

            this.trackerTimeout = setTimeout(() => {
                this.main.innerHTML = `
                <span class='title'>${title}</span>
                <span class='message'>${message}</span> ${extraHtml}`

                this.main.style.display = 'block'

                new Promise(() => {
                    setTimeout(() => {
                        this.main.style.display = 'none'
                        exit();
                    }, time);
                })
            }, 0)
        });
    },
    warning: async function (title, message, time = 4000, extraHtml = '') {
        this.main.setAttribute("data-mode", 'warning');
        await this.message(title, message, time);
        this.main.setAttribute("data-mode", '');
    },
    error: async function (title, message, time = 4000, extraHtml = '') {
        this.main.setAttribute("data-mode", 'error');
        await this.message(title, message, time);
        this.main.setAttribute("data-mode", '');
    },
    idle: function (title, message, extraHtml = '') {
        if(!this.isIdle){
            this.main.setAttribute("data-mode", 'idle');
            this.isIdle = true;
                this.main.innerHTML = `
                <span class='title'>${title}</span>
                <span class='message'>${message}</span> ${extraHtml}`

                this.main.style.display = 'block'
        }
    },
    stopIdle: function () {
        if(this.isIdle){
            this.main.setAttribute("data-mode", '');
            this.isIdle = false;

            this.main.style.display = 'none'
        }
    }

}

notif.main = document.createElement('div');
notif.main.id = "notification";
document.body.appendChild(notif.main);

if (window.getComputedStyle(notif.main).getPropertyValue('display') !== 'none')
    notif.main.style.display = 'none'