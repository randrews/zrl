"use strict";

var Images = {};

function loadImages(){
    var to_load = [
        ["terrain", "img/oryx_16bit_fantasy_world_trans.png"],
        ["arrows", "img/arrows.png"],
        ["creatures", "img/oryx_16bit_fantasy_creatures_trans.png"],
        ["items", "img/oryx_16bit_fantasy_items_trans.png"],
        ["parchment_light", "img/parchment-light.png"],
        ["parchment_dark", "img/parchment-dark.png"]
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
