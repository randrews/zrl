"use strict";

function Input(canvas){
    var that = this;
    canvas.onclick = function(e){
        var pt = new Point(e.offsetX, e.offsetY);
        var g = that.game;

        if(that.inRect(pt, g.display.geometry))
            that.mapClick(that.toTile(pt,
                                      g.display.geometry));
        else if(that.inRect(pt, g.inventory.geometry))
            that.inventoryClick(that.toTile(pt,
                                            g.inventory.geometry));

        return false;
    };

    KeyboardJS.on('up', function(){
        that.mapClick(that.game.player.add(Point.up));
        return false;
    });

    KeyboardJS.on('down', function(){
        that.mapClick(that.game.player.add(Point.down));
        return false;
    });

    KeyboardJS.on('left', function(){
        that.mapClick(that.game.player.add(Point.left));
        return false;
    });

    KeyboardJS.on('right', function(){
        that.mapClick(that.game.player.add(Point.right));
        return false;
    });
}

Input.prototype.mapClick = function(pt){
    if(!this.game) throw "Game not set";
    if(this.game.animating) return;

    var room = this.game.currentRoom();

    var dest = room.at(pt);
    if(dest.type == 'floor') {
        if(pt.adjacent(this.game.player, true)){
            this.game.movePlayer(pt);
        } else {
            var isFloor = function(pt){
                return room.at(pt).type == 'floor';
            };

            var path = room.path(this.game.player, pt, isFloor, true);
            if(path) this.game.movePath(path);
        }
    }
};

Input.prototype.inventoryClick = function(pt){
    if(!this.game) throw "Game not set";
    if(this.game.animating) return;
    var inv_width = this.game.inventory.geometry.width/48;
    var n = pt.x + inv_width*pt.y;
    this.game.useItem(n);
};

Input.prototype.inRect = function(pt, geometry){
    return (pt.x >= geometry.x && pt.y >= geometry.y &&
            pt.x < geometry.x+geometry.width &&
            pt.y < geometry.y+geometry.height);
};

Input.prototype.toTile = function(pt, geometry){
    var x = Math.floor((pt.x-geometry.x)/48);
    var y = Math.floor((pt.y-geometry.y)/48);
    return new Point(x, y);
};
