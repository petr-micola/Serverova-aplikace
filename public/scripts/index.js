const start = document.getElementById('start');
const end = document.getElementById('gameOver');
const info = document.getElementById('tail');

let btn = ['startBtn1', 'gameOverBtn1', 'fullscreenBtn', 'soundsBtn'];
for (let i = 0; i < btn.length; i++) {
    btn[i] = document.getElementById(btn[i]);
}

let sound1, sound2;
let canvas;
let scl = 20;
let snake;
let food;

class Snake {
    constructor(posX, posY, speedX, speedY) {
        this.body = [];
        this.body[0] = createVector(posX, posY);
        this.sX = speedX;
        this.sY = speedY;
    }

    get head() {
        return this.body[this.body.length - 1];
    }

    move() {
        let head = this.head.copy();
        this.body.shift();
        head.x += this.sX * scl;
        head.y += this.sY * scl;
        this.body.push(head);
    }

    controls() {
        if (keyIsDown(87)) {
            if (this.sY != 1) {
                this.sX = 0;
                this.sY = -1;
            }
        }
        if (keyIsDown(83)) {
            if (this.sY != -1) {
                this.sX = 0;
                this.sY = 1;
            }
        }
        if (keyIsDown(65)) {
            if (this.sX != 1) {
                this.sX = -1;
                this.sY = 0;
            }
        }
        if (keyIsDown(68)) {
            if (this.sX != -1) {
                this.sX = 1;
                this.sY = 0;
            }
        }
    }

    grow() {
        let head = this.head.copy();
        this.body.push(head);
        info.innerHTML = this.body.length;
    }

    eat(x, y) {
        if (this.head.x == x && this.head.y == y) {
            this.grow();
            return true;
        }
        return false;
    }

    end() {
        if (this.head.x > width - 1 || this.head.x < 0 || this.head.y > height - 1 || this.head.y < 0) return true;
        for (let i = 0; i < this.body.length - 1; i++) {
            if (this.body[i].x == this.head.x && this.body[i].y == this.head.y) return true;
        }
        return false;
    }

    draw() {
        for (let i = 0; i < this.body.length; i++) {
            fill('#ffffff');
            rect(this.body[i].x, this.body[i].y, scl, scl);
        }
    }
}

class Food {
    constructor() {
        this.w = floor(width / scl);
        this.h = floor(height / scl);
    }

    location() {
        this.x = floor(random(this.w)) * scl;
        this.y = floor(random(this.h)) * scl;
        for (let i = 0; i < snake.body.length - 1; i++) {
            if (snake.body[i].x == this.x && snake.body[i].y == this.y) this.location();
        }
    }

    draw() {
        fill('#16c60c');
        rect(this.x, this.y, scl, scl);
    }
}

function startGame() {
    noLoop();
    start.classList.add('visible');
    btn[0].addEventListener('click', () => {
        start.classList.remove('visible');
        loop();
    });
}

function endGame() {
    noLoop();
    end.classList.add('visible');
    btn[1].addEventListener('click', () => {
        end.classList.remove('visible');
        snake = new Snake(0, 0, 1, 0);
        snake.grow();
        food = new Food();
        loop();
        food.location();
    });
}

function fullscreenToggle() {
    let j = 0;
    btn[2].addEventListener('click', () => {
        if (j % 2 == 0) btn[2].classList.add('selected');
        else btn[2].classList.remove('selected');
        let fs = fullscreen();
        fullscreen(!fs);
        j++;
    });
}

function soundsToggle() {
    let j = 0;
    sound1.setVolume(0.0);
    sound2.setVolume(0.0);
    btn[3].addEventListener('click', () => {
        if (j % 2 == 0) {
            btn[3].classList.add('selected');
            sound1.setVolume(1.0);
            sound2.setVolume(1.0);
        } else {
            btn[3].classList.remove('selected');
            sound1.setVolume(0.0);
            sound2.setVolume(0.0);
        }
        j++;
    });
}

function preload() {
    soundFormats('mp3');
    sound1 = loadSound('sounds/1.mp3');
    sound2 = loadSound('sounds/2.mp3');
}

function setup() {
    canvas = createCanvas(400, 400);
    canvas.parent('myCanvas');
    frameRate(10);
    stroke('#000000');
    strokeWeight(2);
    fullscreenToggle();
    soundsToggle();
    startGame();
    snake = new Snake(0, 0, 1, 0);
    snake.grow();
    food = new Food();
    food.location();
}

function draw() {
    background('#000000');
    if (snake.eat(food.x, food.y)) {
        sound1.play();
        food.location();
    }
    snake.controls();
    snake.move();
    snake.draw();
    if (snake.end()) {
        sound2.play();
        endGame();
    }
    food.draw();
}