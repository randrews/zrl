"use strict";

function Game(){
    this.level = makemaze();
    this.player_inventory = [];

    this.room = new Point(random(this.level.width-1),
                          random(this.level.height-1));

    this.level.each(function(pt, exits){
        this.at(pt, makemap(exits));
    });

    this.player = new Point( (this.currentRoom().width-1)/2,
                             (this.currentRoom().height-1)/2 );

    this.animating = false;
    this.animationFrame = 0;
}

Game.prototype.currentRoom = function(){
    return this.level.at(this.room);
};

Game.prototype.getInventory = function(){
    return this.player_inventory;
};

Game.prototype.movePlayer = function(pt){
    this.player = pt;
    var dest = this.currentRoom().at(pt);
    if(dest.door)
        this.moveRoom(dest.door);
    else {
        var items = this.currentRoom().items.at(pt);
        if(items.length > 0) {
            var item = items[0];
            if(item.grabbable && item.grab()) {
                this.player_inventory.push(item);
                items.splice(0, 1);
            }
        }
    }
};

Game.prototype.movePath = function(path){
    var that = this;
    var current_idx = 0;
    var prom = new Promise();
    this.animating = true;

    var timer = setInterval( function(){
        that.movePlayer(path[current_idx]);

        if(++current_idx == path.length){
            clearInterval(timer);
            that.animating = false;
            prom.finish();
        }
    }, 50 );

    return prom;
};

Game.prototype.moveRoom = function(dir){
    var that = this;
    this.animating = true;

    var room = this.currentRoom();
    if(dir == 'n' && room.exits.n) this.room.y--;
    if(dir == 's' && room.exits.s) this.room.y++;
    if(dir == 'e' && room.exits.e) this.room.x++;
    if(dir == 'w' && room.exits.w) this.room.x--;
    var new_room = this.currentRoom();

    if(room == new_room) return;

    var midx = Math.floor(room.width/2);
    var midy = Math.floor(room.height/2);
    var maxx = room.width-1;
    var maxy = room.height-1;

    switch(dir){
    case 'n': this.player = new Point(midx, maxy); break;
    case 's': this.player = new Point(midx, 0); break;
    case 'e': this.player = new Point(0, midy); break;
    case 'w': this.player = new Point(maxx, midy); break;
    };

    this.display.animate(room, new_room, dir).then(function(){
        that.animating = false;
    });
};

Game.prototype.useItem = function(index){
    var item = this.player_inventory[index];
    if(!item) return;

    item.consume(this, index);
};

Game.prototype.removeItem = function(index){
    this.player_inventory.splice(index, 1);
};

Game.prototype.draw = function(frame){
    this.display.draw(frame);
    this.inventory.draw(this.getInventory(), frame);
    this.status.draw(frame);
};
