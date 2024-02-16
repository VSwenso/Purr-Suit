/*
Tory Swenson
pizza purr-suit
30+ Hours

Creative Tilt:
I wanted to add pickup objects like pizza, but ran out of time :P.
In the beginning i was very indecisive on what direction to go with for the project. 
this project took me so much longer than i anticipated. i started early and still ran into a ton of problems. 
but this was my first time trying out 8-bit art and admittedly i spent wayyyy to much time on that. the banground
and all the assets i did myself. One thing i am particularly proud of with this project was making my own 
animated spritesheets n stuff. I will most likely be working on this more outside of class and out of the scope
of this project, cuz i definitely want to experiment and see what else i can do with it. 
Credits:
  * https://pixabay.com/sound-effects/
*/



"use strict"

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000},
            debug: false
        }
    },
    width: 640,
    height: 500,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config)

let cursors
let { height, width } = game.config
let playerDirection