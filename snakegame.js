class SnakeGame {

    constructor() {
    }

    KEYBOARD;

    OFF = "#000000";
    SNAKE_COLOR = "#0023ff";
    SNAKE_HEAD_COLOR = "#00ffe1";
    FRUIT_COLOR = "#0fff00";
    DIRECTIONKEY_COLOR = "#ffffff";
    SCORE_COLOR = "#ff0000"
    GAME_GRID = [[], []];
    SNAKE = [34, 50];
    ALIVE = true;
    FRUIT = -1;
    MAX_SCORE = 52;
    WIN = false;

    DIRECTION = " ";

    onReady(keyboard) {
        console.log('Welcome to Snake Vulcan!')
        //super.onReady(keyboard);
        this.KEYBOARD = keyboard;
        //keyboard.fillAll(this.BACKGROUND_COLOR);
        this.generateGrid();
        this.startGame();
    }


    generateGrid() {

        let grid = this.KEYBOARD.getGrid();

        for (let i = 1; i < 5; i++) {

            this.GAME_GRID[i - 1] = [];

            for (let j = 0; j < 13; j++) {

                this.GAME_GRID[i - 1][j] = grid[i][j];
            }
        }
    }

    startGame() {

        this.SNAKE = [34, 50];
        this.FRUIT = -1;
        this.DIRECTION = " ";
        this.ALIVE = true;

        this.renderField();
        this.runSnake(-1)
    }

    renderField() {


        this.KEYBOARD.updateKeys(this.SNAKE, this.SNAKE_COLOR);
        this.KEYBOARD.updateKey(this.SNAKE[0], this.SNAKE_HEAD_COLOR)
        this.KEYBOARD.updateKey(this.FRUIT, this.FRUIT_COLOR);
        this.KEYBOARD.render();

    }

    snakeRunId = 0;

    runSnake(snakeId) {
        if (this.WIN) {
            return;
        }

        let tempSnakeId = snakeId === -1 ? ++this.snakeRunId : snakeId;

        this.KEYBOARD.updateKeys(this.SNAKE, this.OFF)

        this.spawnFruit()

        this.moveSnake()

        this.checkFruitCollect(this.SNAKE[0])
        this.renderField();

        setTimeout(() => {
            if (this.ALIVE) {

                this.runSnake(tempSnakeId)
            } else {

                this.ending()

            }
        }, 1000);

        if (this.IsSnakeDed()) {
            this.ALIVE = false;
        }
    }


    ending() {

        if (this.WIN) return;

        this.KEYBOARD.fillAll(this.DIRECTIONKEY_COLOR)

        // this.startGame()
        let scoreArray = Array.from(String(this.SNAKE.length), Number);

        for (let i = 0; i < 4; i++) {

            //this.showDedScore(0, scoreArray, undefined)
            this.animateDed(0, scoreArray)
            this.KEYBOARD.fillAll(this.OFF)

        }
    }

    animateDed(amount, scoreArray) {
        if (amount >= 3) {
            if (!this.ALIVE)
                this.startGame()
            return;
        }

        setTimeout(() => {
            this.showDedScore(0, scoreArray, undefined, () => {
                amount++;
                this.animateDed(amount, scoreArray);
            });
        }, 2000);
    }

    showDedScore(i, scoreArray, lastKey, onDone) {
        // check ded end
        if (i >= scoreArray.length) {
            onDone();
            return;
        }

        setTimeout(() => {

            let key = scoreArray[i++] + "";
            this.KEYBOARD.updateKey(key, this.SCORE_COLOR);

            if (lastKey !== undefined) {
                this.KEYBOARD.updateKey(lastKey, this.OFF)
            }

            this.KEYBOARD.render();
            setTimeout(() => {
                this.KEYBOARD.fillAll(this.OFF)
                this.KEYBOARD.render()
                this.showDedScore(i, scoreArray, key, onDone)
            }, 500);
        }, 1000);
    }

    moveSnake() {
        let movement;

        for (let i = 0; i < this.GAME_GRID.length; i++) {

            for (let j = 0; j < this.GAME_GRID[i].length; j++) {

                if (movement) {
                    break;
                }

                switch (this.DIRECTION) {

                    case "UP":
                        movement = this.MoveUp(this.SNAKE[0], i, j);
                        break;

                    case "DOWN":
                        movement = this.MoveDown(this.SNAKE[0], i, j);
                        break;

                    case "LEFT":
                        movement = this.MoveLeft(this.SNAKE[0], i, j);
                        break;

                    case "RIGHT":
                        movement = this.MoveRight(this.SNAKE[0], i, j);
                        break;
                }

            }
        }

        if (movement === undefined) return;
        this.SNAKE.unshift(movement)
        this.SNAKE.pop();
    }


    MoveRight(key, i, j) {

        if (this.GAME_GRID[i][j] === key && j !== this.GAME_GRID[i].length - 1) {

            return this.GAME_GRID[i][j + 1];

        } else if (this.GAME_GRID[i][j] === key && j === this.GAME_GRID[i].length - 1) {

            return this.GAME_GRID[i][0];
        }
    }

    MoveLeft(key, i, j) {

        if (this.GAME_GRID[i][j] === key && j !== 0) {

            return this.GAME_GRID[i][j - 1];

        } else if (this.GAME_GRID[i][j] === key && j === 0) {

            return this.GAME_GRID[i][this.GAME_GRID[i].length - 1];
        }
    }


    MoveUp(key, i, j) {

        if (this.GAME_GRID[i][j] === key && i !== 0) {

            return this.GAME_GRID[i - 1][j];

        } else if (this.GAME_GRID[i][j] === key && i === 0) {

            return this.GAME_GRID[this.GAME_GRID.length - 1][j];
        }
    }

    MoveDown(key, i, j) {

        if (this.GAME_GRID[i][j] === key && i !== this.GAME_GRID.length - 1) {

            return this.GAME_GRID[i + 1][j];

        } else if (this.GAME_GRID[i][j] === key && i === this.GAME_GRID.length - 1) {

            return this.GAME_GRID[0][j];
        }
    }


    spawnFruit() {

        if (this.FRUIT === -1) {

            this.FRUIT = this.GAME_GRID[this.getRandomInt(4)][this.getRandomInt(13)]
        }

        for (let i = 0; i < this.SNAKE.length; i++) {

            if (this.FRUIT === this.SNAKE[i]) {

                this.FRUIT = -1;
                this.spawnFruit();
            }
        }
    }

    checkFruitCollect(key) {

        if (key === this.FRUIT) {

            this.addNewSnakeElement();
            this.FRUIT = -1;
        }

    }

    addNewSnakeElement() {

        let key = this.SNAKE[this.SNAKE.length - 1]

        let movement;

        for (let i = 0; i < this.GAME_GRID.length; i++) {

            for (let j = 0; j < this.GAME_GRID[i].length; j++) {

                if (movement) {
                    break;
                }

                switch (this.DIRECTION) {

                    case "UP":

                        movement = this.MoveDown(key, i, j);
                        break;

                    case "DOWN":


                        movement = this.MoveUp(key, i, j);
                        break;

                    case "LEFT":

                        movement = this.MoveRight(key, i, j);
                        break;

                    case "RIGHT":

                        movement = this.MoveLeft(key, i, j);
                        break;
                }
            }
        }

        if (movement) {
            this.SNAKE.push(movement);
        }
    }


    updateDirection() {

        this.KEYBOARD.updateKeys([106, 107, 102, 111], this.OFF)
        this.KEYBOARD.updateKey(this.DIRECTION, this.DIRECTIONKEY_COLOR)
        this.KEYBOARD.render()
    }

    IsSnakeDed() {

        if (this.SNAKE.length >= this.MAX_SCORE) {
            this.snakeWin(0);
            return true;
        }

        for (let i = 0; i < this.SNAKE.length; i++) {
            if (this.SNAKE.indexOf(this.SNAKE[i]) !== this.SNAKE.lastIndexOf(this.SNAKE[i])) {
                console.log("ded")
                return true
            }
        }
        return false
    }

    onKeyPress(keyboard, event) {
        //super.onKeyPress(keyboard, event);

        switch (event.key) {
            case 106:
                this.DIRECTION = "UP";
                break;
            case 107:
                this.DIRECTION = "DOWN";
                break;
            case 102:
                this.DIRECTION = "LEFT";
                break;
            case 111:
                this.DIRECTION = "RIGHT";
                break;
        }

        this.updateDirection()
    }

    getRandomInt(max) {

        return Math.floor(Math.random() * max);

    }

    BACKGROUND_COLOR = '#d000ff';
    WAVE_COLOR = '#00fff7';
    STATE = false;

    snakeWin(index) {
        this.WIN = true;

        setTimeout(() => {
            let grid = this.KEYBOARD.getGrid();

            if (!this.STATE && index >= 22 || this.STATE && index <= 0) {
                if (this.STATE) {
                    this.WIN = false;
                    this.startGame()
                    return;
                }
                this.STATE = !this.STATE;
            }

            for (let gridEntry of grid) {

                let key = gridEntry[index];
                let previous;
                if (this.STATE) {
                    previous = gridEntry[index + 1];
                } else {
                    previous = gridEntry[index - 1];
                }

                this.KEYBOARD.animateKeys([key], this.BACKGROUND_COLOR, this.WAVE_COLOR, 100);
                setTimeout(() => {
                    this.KEYBOARD.animateKeys([key], this.WAVE_COLOR, this.BACKGROUND_COLOR, 1000);
                }, 1000)
                this.KEYBOARD.render();
            }
            if (this.STATE) {
                index--;
            } else {
                index++;
            }
            this.snakeWin(index);
        }, 200);
    }
}

module.exports = {SnakeGame};
