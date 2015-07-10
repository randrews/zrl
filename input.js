"use strict";

function Input(canvas){
    var that = this;

    canvas.onclick = function(e){
        var pt = new Point(e.offsetX, e.offsetY);
        var g = that.game;
        if(Target.active) {
            Target.active.click(pt);
        } else if(Dialog.active) {
            var geo = Dialog.active.geometry;

            if(inRect(pt, geo))
                Dialog.active.click(new Point(pt.x - geo.x,
                                              pt.y - geo.y));
            else
                Dialog.close();

        } else {
            if(inRect(pt, g.display.geometry))
                that.mapClick(that.toTile(pt,
                                          g.display.geometry));
            else if(inRect(pt, g.inventory.geometry))
                that.inventoryClick(that.toTile(pt,
                                                g.inventory.geometry));
        }

        return false;
    };

    KeyboardJS.on('up', function(){
        if(!Dialog.active)
            that.mapClick(that.game.player.add(Point.up));
        return false;
    });

    KeyboardJS.on('down', function(){
        if(!Dialog.active)
            that.mapClick(that.game.player.add(Point.down));
        return false;
    });

    KeyboardJS.on('left', function(){
        if(!Dialog.active)
            that.mapClick(that.game.player.add(Point.left));
        return false;
    });

    KeyboardJS.on('right', function(){
        if(!Dialog.active)
            that.mapClick(that.game.player.add(Point.right));
        return false;
    });
}

Input.prototype.mapClick = function(pt){
    if(!this.game) throw "Game not set";
    if(this.game.animating) return;

    if(this.game.canMove(pt)) {
        if(pt.adjacent(this.game.player, true)){
            this.game.movePlayer(pt);
        } else {
            var room = this.game.currentRoom();
            var game = this.game;

            var clear = function(pt){
                return room.at(pt).type == 'floor';
            };

            var path = room.path(this.game.player, pt, clear, true);
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

Input.prototype.toTile = function(pt, geometry){
    var x = Math.floor((pt.x-geometry.x)/48);
    var y = Math.floor((pt.y-geometry.y)/48);
    return new Point(x, y);
};
