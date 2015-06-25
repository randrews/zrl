"use strict";

var G = null;
var Log = null;

$(document).ready(function(){
    Log = new LogObj();

    loadImages().then(function(){
        var map_canvas = document.getElementById("map");
        var inv_canvas = document.getElementById("inventory");
        var game = new Game(); G = game;

        var display = new Display(map_canvas, true);
        game.display = display;
        display.game = game;

        var input = new Input(map_canvas, inv_canvas);
        game.input = input;
        input.game = game;

        var inventory = new Inventory(inv_canvas, true);
        inventory.game = game;
        game.inventory = inventory;

        game.start();
    });
});
