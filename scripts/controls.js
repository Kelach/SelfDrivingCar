// JavaScript source code

class Controls {

    constructor(type) {
        this.foward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;
        switch (type) {
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "NOKEYS":
                this.forward = true;
                break;
        }
        
    }

    #addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch(event.key) {
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowUp":
                    this.forward = true;
                    break;
                case "ArrowDown":
                    this.reverse = true;
                    break;
            }
        }   
        document.onkeyup = (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowUp":
                    this.forward = false;
                    break;
                case "ArrowDown":
                    this.reverse = false;
                    break;
            }
        }
    }
}