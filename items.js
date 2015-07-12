"use strict";

var Item = {
    solid: false,
    grabbable: true,
    equippable: false,
    usable: false,
    tickable: false,

    description: "Nothing important",

    bump: function(game, pt){},
    tick: function(game, pt){},
    grab: function(game){ return true; },
    use: function(game){}
};

Item.drop = function(game, id){
    var that = this;
    Log.print("Drop where?");
    Target.map(game).where('empty').where('adjacent').
        then(function(pt){
            game.currentRoom().items.at(pt).push(that);
            game.removeItem(id);
            game.tick();
            Log.print("Dropped");
        });
};

Item.throwItem = function(game, id){
    var that = this;
    Log.print("Throw where?");
    Target.map(game).where('visible').where('floor').then(function(pt){
        game.removeItem(id);
        game.tick();
        Log.print("It splashes harmlessly on the ground");
    });
};

////////////////////////////////////////

var Potion = Object.create(Item);
Potion.usable  = true;

var HealthPotion = Object.create(Potion);
HealthPotion.description = "Health potion";
HealthPotion.draw = new Point(9, 1);
HealthPotion.use = function(game, id){
    var that = this;
    Dialog.open().
        setButtons(["Drink", "Drop", "Throw"]).
        setItem(this).
        then(function(verb){
            if(verb == 'Drink'){
                Log.print("You drink the health potion");
                game.removeItem(id);
                var gains = Math.round(game.stats.maxHealth / 4);
                if(gains > 10) gains = 10;
                game.stats.health += gains;
                if(game.stats.health > game.stats.maxHealth)
                    game.stats.health = game.stats.maxHealth;
                game.tick();
            } else if(verb == 'Drop') {
                that.drop(dame, id);
            } else if(verb == 'Throw') {
                that.throwItem(game, id);
            }

            Dialog.close();
        });
};

HealthPotion.grab = function(game){
    Log.print("You found a health potion");
    return true;
};

////////////////////////////////////////

var Scroll = Object.create(Item);
Scroll.description = "'LOB NA'";
Scroll.draw = new Point(1,0);
Scroll.usable  = true;

Scroll.use = function(game, id){
    var that = this;

    Dialog.open().
        setButtons(["Read", "Drop"]).
        setItem(this).
        then(function(verb){
            if(verb == 'Read'){
                Log.print("Choose an enemy to target");
                Target.map(game).where('enemy').then(function(pt){
                    var enemy = game.enemyAt(pt);
                    var dmg = random(5, 10);
                    Log.print("A fireball burns the " + enemy.name + " for " + dmg + " damage");
                    enemy.hurt(game, dmg);
                    game.removeItem(id);
                    game.tick();
                });
            } else if(verb == 'Drop'){
                that.drop(game, id);
            }

            Dialog.close();
        });
};

Scroll.grab = function(game){
    Log.print("You found a scroll: 'LOB NA'");
    return true;
};
