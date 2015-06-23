"use strict";

function Input(canvas){
    var that = this;
    canvas.onclick = function(e){
        var x = Math.floor(e.offsetX/48);
        var y = Math.floor(e.offsetY/48);
        that.click(new Point(x, y));
    };

    KeyboardJS.on('up', function(){
        that.click(that.game.player.add(Point.up));
        return false;
    });

    KeyboardJS.on('down', function(){
        that.click(that.game.player.add(Point.down));
        return false;
    });

    KeyboardJS.on('left', function(){
        that.click(that.game.player.add(Point.left));
        return false;
    });

    KeyboardJS.on('right', function(){
        that.click(that.game.player.add(Point.right));
        return false;
    });
}

Input.prototype.click = function(pt){
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
            this.game.movePath(path);
        }
    }
};
