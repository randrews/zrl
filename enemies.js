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

// Return true if a multi-step move should be interrupted by anything
// we're doing (like we attacked the player)
Enemy.prototype.tick = function(game, pt){
    if(pt.adjacent(game.player, true)) {
        game.attackPlayer(this);
        return true;
    } else {
        game.moveTowardPlayer(this);
        return false;
    }
};

Enemy.prototype.kill = function(game){};

Enemy.prototype.hurt = function(game, dmg){
    this.health -= dmg;
    if(this.health <= 0) {
        Log.print("You killed the " + this.name);
        this.kill();
        game.removeEnemy(this);
    }
};

////////////////////////////////////////

function Rat(){ this.init(); }
Rat.prototype = new Enemy();

Rat.prototype.name = "rat";
Rat.prototype.hp = [5, 10];
Rat.prototype.dmg = [1, 3];
Rat.prototype.draw = new Point(8, 13);
