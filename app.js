let RoccatVulcan = require('roccatvulcan');
let Snake = require("./snakegame");

let ready = false;
let game = new Snake.SnakeGame();

let keyboard = new RoccatVulcan({
    layout: 'de-de',
    ready: () => {
        console.log("Keyboard (Dinner) is ready!");
        ready = true;
        game.onReady(keyboard);
    },
    onData: (event) => {
        game.onKeyPress(keyboard, event);
    }
});
