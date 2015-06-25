"use strict";

var Item = {
    solid: false,
    grabbable: true,
    equippable: false,
    consumable: false,
    tickable: false,

    description: "Nothing important",

    bump: function(game, pt){},
    tick: function(game, pt){},
    grab: function(game){ return true; },
    consume: function(game){}
};

var Potion = Object.create(Item);
Potion.consumable  = true;

var HealthPotion = Object.create(Potion);
HealthPotion.draw = new Point(9, 1);
HealthPotion.consume = function(game){
    Log.print("You drink the health potion");
};
HealthPotion.grab = function(game){
    Log.print("You found a health potion");
    return true;
};
