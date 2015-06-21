"use strict";

function Game(){
    this.level = makemaze();
    this.room = new Point(random(this.level.width-1),
                          random(this.level.height-1));

    this.level.each(function(pt, exits){
        this.at(pt, makemap(exits));
    });

    this.animating = false;
}

Game.prototype.currentRoom = function(){
    return this.level.at(this.room);
};

Game.prototype.start = function(){
    if(!this.display) throw "Display not set";
    if(!this.input) throw "Input not set";
    this.display.start();
};

Game.prototype.moveRoom = function(dir){
    var that = this;
    this.animating = true;
    this.display.stop();

    var room = this.currentRoom();
    if(dir == 'n' && room.exits.n) this.room.y--;
    if(dir == 's' && room.exits.s) this.room.y++;
    if(dir == 'e' && room.exits.e) this.room.x++;
    if(dir == 'w' && room.exits.w) this.room.x--;
    var new_room = this.currentRoom();

    this.display.animate(room, new_room, dir).then(function(){
        that.animating = false;
        that.display.start();
    });
};
