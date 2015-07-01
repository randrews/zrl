"use strict";

var G = null;
var Log = null;

$(document).ready(function(){
    loadImages().then(function(){
        var canvas = document.getElementById("map");
        var game = new Game(); G = game;

        Log = new LogObj(canvas, {x: 0, y: 48*9,
                                  width: 48*13, height: 48*3});

        Dialog.canvas = canvas;

        var display = new Display(canvas, {x: 0, y: 0,
                                           width: 48*13, height:48*9});
        game.display = display;
        display.game = game;

        var input = new Input(canvas);
        game.input = input;
        input.game = game;

        var inventory = new Inventory(canvas, {x: 48*13, y: 48*5,
                                               width: 48*5, height:48*7});
        inventory.game = game;
        game.inventory = inventory;

        var status = new Status(canvas, {x: 48*13, y: 0,
                                         width: 48*5, height:48*5});
        status.game = game;
        game.status = status;

        var timer = new Timer(function(frame){
            Log.draw(frame);
            game.draw(frame);
            if(Dialog.active) Dialog.active.draw(frame);
        }, 60, 15);

        timer.start();
    });
});
