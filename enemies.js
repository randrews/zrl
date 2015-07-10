"use strict";

function Enemy(){}

Enemy.prototype.name = "monster";
Enemy.prototype.hp = [1, 100];
Enemy.prototype.dmg = [1, 10];
Enemy.prototype.speed = 1; // Higher speed means slower actions
Enemy.prototype.draw = new Point(8, 13);
Enemy.prototype.accuracy = 0.5;

Enemy.prototype.init = function(){
    this.maxHealth = random(this.hp[0], this.hp[1]);
    this.health = this.maxHealth;
};

Enemy.prototype.tick = function(game, pt){
    if(pt.adjacent(game.player, true))
        game.attackPlayer(this);
    else
        game.moveTowardPlayer(this);
};

Enemy.prototype.attack = function(game){
    Log.print("Attacking the " + this.name);
};

////////////////////////////////////////

function Rat(){ this.init(); }
Rat.prototype = new Enemy();

Rat.prototype.name = "rat";
Rat.prototype.hp = [5, 10];
Rat.prototype.dmg = [1, 3];
Rat.prototype.draw = new Point(8, 13);
