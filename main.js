"use strict";

var Images = {};

function loadImages(){
    var to_load = [
        ["terrain", "img/oryx_16bit_fantasy_world_trans.png"],
        ["arrows", "img/arrows.png"]
    ];
    var loaded = 0;
    var prom = new Promise();

    for(var i=0; i<to_load.length; i++){
        var tuple = to_load[i];
        var img = new Image();

        img.addEventListener("load", function(){
            if(++loaded == to_load.length)
                prom.finish();
        });

        Images[tuple[0]] = img;
        img.src = tuple[1];
    }

    return prom;
};

var G = null;

$(document).ready(function(){
    loadImages().then(function(){
        var canvas = document.getElementById("map");
        var game = new Game(); G = game;

        var display = new Display(canvas);
        game.display = display;
        display.game = game;

        var input = new Input(canvas);
        game.input = input;
        input.game = game;

        game.start();
    });
});
