"use strict";

function Display(canvas, double_buffered){
    this.canvas = canvas;

    if(double_buffered){
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.canvas.width;
        this.buffer.height = this.canvas.height;
    }
}

Display.prototype.start = function(){
    if(!this.game) throw "Game not set";
    var that = this;
    var zero = new Point(0,0);

    this.timer = setInterval(function(){
        var room = that.game.currentRoom();
        room.animationFrame++;
        that.drawRoom(room, zero);
    }, 100);
};

Display.prototype.stop = function(){
    if(this.timer) clearInterval(this.timer);
    this.timer = null;
};

Display.prototype.animate = function(room1, room2, dir){
    var that = this;
    var prom = new Promise();

    var offset = new Point(0,0);
    var room2_offset = null
    if(dir=='n') room2_offset = new Point(0, -room2.height);
    if(dir=='s') room2_offset = new Point(0, room2.height);
    if(dir=='w') room2_offset = new Point(-room2.width, 0);
    if(dir=='e') room2_offset = new Point(room2.width, 0);

    var steps = ( (dir=='n'||dir=='s') ? room1.height :
                  room1.width );
    var stepsTaken = 0;

    var timer = setInterval( function(){
        if(dir=='n')offset.y++;
        if(dir=='s')offset.y--;
        if(dir=='e')offset.x--;
        if(dir=='w')offset.x++;

        that.drawRoom(room1, offset);
        that.drawRoom(room2, room2_offset.add(offset));

        if(++stepsTaken == steps){
            clearInterval(timer);
            prom.finish();
        }
    }, 500 / steps );
    

    return prom;
};

Display.prototype.drawRoom = function(room, offset){
    if(this.buffer) var ctx = this.buffer.getContext("2d");
    else var ctx = this.canvas.getContext("2d");

    room.each(function(pt, col){
        var dest = pt.add(offset);
        if(!this.inside(dest)) return;

        var tile = new Point(col, this.biome);

        ctx.drawImage( Images.terrain,
                       tile.x*48, tile.y*48,
                       48, 48,
                       dest.x*48, dest.y*48,
                       48, 48);
    });

    var midx = Math.floor(room.width/2);
    var midy = Math.floor(room.height/2);
    var maxx = room.width-1;
    var maxy = room.height-1;
    var frame = room.animationFrame % 8;
    if(frame > 4) frame = 8-frame;

    if(room.exits.n)
        ctx.drawImage( Images.arrows,
                       0 + frame*96, 0,
                       48, 48,
                       midx * 48 + offset.x*48, 0 + offset.y*48,
                       48, 48 );

    if(room.exits.s)
        ctx.drawImage( Images.arrows,
                       48 + frame*96, 0,
                       48, 48,
                       midx * 48 + offset.x*48, maxy * 48 + offset.y*48,
                       48, 48 );

    if(room.exits.e)
        ctx.drawImage( Images.arrows,
                       48 + frame*96, 48,
                       48, 48,
                       maxx * 48 + offset.x*48, midy * 48 + offset.y*48,
                       48, 48 );

    if(room.exits.w)
        ctx.drawImage( Images.arrows,
                       0 + frame*96, 48,
                       48, 48,
                       0 + offset.x*48, midy * 48 + offset.y*48,
                       48, 48 );

    if(this.buffer){
        var realctx = this.canvas.getContext("2d");
        realctx.drawImage(this.buffer, 0, 0);
    }
};
