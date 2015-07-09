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
HealthPotion.description = "Health potion";
HealthPotion.draw = new Point(9, 1);
HealthPotion.consume = function(game, id){
    var that = this;
    Dialog.open().
        setButtons(["Drink", "Drop", "Throw"]).
        setItem(this).
        then(function(verb){
            if(verb == 'Drink'){
                Log.print("You drink the health potion");
                game.removeItem(id);
            } else if(verb == 'Drop') {
                Log.print("Drop where?");
                Target.map(game).where('empty').where('adjacent').
                    then(function(pt){
                        game.currentRoom().items.at(pt).push(that);
                        game.removeItem(id);
                        Log.print("Dropped");
                    });
            } else {
                Log.print('We gotta get targeting working');
            }

            Dialog.close();
        });
};
HealthPotion.grab = function(game){
    Log.print("You found a health potion");
    return true;
};
