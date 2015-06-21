"use strict";

function Input(canvas){
    var that = this;
    canvas.onclick = function(e){
        var x = Math.floor(e.offsetX/48);
        var y = Math.floor(e.offsetY/48);
        that.click(x, y);
    };
}

Input.prototype.click = function(x, y){
    if(!this.game) throw "Game not set";
    if(this.game.animating) return;

    var room = this.game.currentRoom();

    var midx = Math.floor(room.width/2);
    var midy = Math.floor(room.height/2);
    var maxx = room.width-1;
    var maxy = room.height-1;
    var frame = room.animationFrame % 8;

    if(x == midx && y == 0)
        this.game.moveRoom('n');
    else if(x == midx && y == maxy)
        this.game.moveRoom('s');
    else if(x == maxx && y == midy)
        this.game.moveRoom('e');
    else if(x == 0 && y == midy)
        this.game.moveRoom('w');
};
