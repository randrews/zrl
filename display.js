"use strict";

function Display(canvas, geometry){
    this.init(canvas, geometry);
}

Display.prototype = new Drawable();

Display.prototype.paint = function(ctx, frame){
    if(this.animating)
        this.animationCallback(ctx, frame);
    else {
        var room = this.game.currentRoom();
        var player = this.game.player;
        var fov = this.game.calculateFov(room, player);

        this.drawRoom(ctx, room, frame,
                      { player: player,
                        fov: fov });
    }
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

        if(++stepsTaken == steps){
            clearInterval(timer);
            that.animating = false;
            that.animationCallback = null;
            prom.finish();
        }
    }, 500 / steps );

    this.animating = true;
    this.animationCallback = function(ctx, frame){
        var fov = that.game.calculateFov(room2, that.game.player);

        that.drawRoom(ctx, room1, frame,
                      { offset: offset,
                        dark: true });
        that.drawRoom(ctx, room2, frame,
                      { offset: room2_offset.add(offset),
                        player: that.game.player,
                        fov: fov });
    };

    return prom;
};

Display.prototype.drawRoom = function(ctx, room, frame, opts){
    opts = opts || {};
    var offset = opts.offset || new Point(0,0);
    var player = opts.player;
    var fov = opts.fov;
    var dark = opts.dark;

    ctx.fillStyle = "rgba(0,0,0,0.4)";

    room.each(function(pt, cell){
        var col = cell.draw;
        var dest = pt.add(offset);
        if(!this.inside(dest)) return;

        var tile = new Point(col, this.biome);

        ctx.drawImage( Images.terrain,
                       tile.x*48, tile.y*48,
                       48, 48,
                       dest.x*48, dest.y*48,
                       48, 48);

        if(dark || fov && !fov.at(pt)) {
            ctx.fillRect( dest.x*48, dest.y*48, 48, 48 );
        }
    });

    // Draw items
    room.items.each(function(pt, items){
        var dest = pt.add(offset);
        if(!this.inside(dest)) return;

        if(dark || fov && !fov.at(pt)) return;

        for(var i=0; i<items.length; i++){
            var tile = items[i].draw;
            ctx.drawImage( Images.items,
                           tile.x*32, tile.y*32,
                           32, 32,
                           dest.x*48+8, dest.y*48+8,
                           32, 32 );
        };
    });

    var midx = Math.floor(room.width/2);
    var midy = Math.floor(room.height/2);
    var maxx = room.width-1;
    var maxy = room.height-1;
    var arrowFrame = Math.floor(frame/2) % 8;
    if(arrowFrame > 4) arrowFrame = 8-arrowFrame;

    if(room.exits.n)
        ctx.drawImage( Images.arrows,
                       0 + arrowFrame*96, 0,
                       48, 48,
                       midx * 48 + offset.x*48, 0 + offset.y*48,
                       48, 48 );

    if(room.exits.s)
        ctx.drawImage( Images.arrows,
                       48 + arrowFrame*96, 0,
                       48, 48,
                       midx * 48 + offset.x*48, maxy * 48 + offset.y*48,
                       48, 48 );

    if(room.exits.e)
        ctx.drawImage( Images.arrows,
                       48 + arrowFrame*96, 48,
                       48, 48,
                       maxx * 48 + offset.x*48, midy * 48 + offset.y*48,
                       48, 48 );

    if(room.exits.w)
        ctx.drawImage( Images.arrows,
                       0 + arrowFrame*96, 48,
                       48, 48,
                       0 + offset.x*48, midy * 48 + offset.y*48,
                       48, 48 );
    

    // Draw player
    if(player){
        var playerFrame = (Math.floor(frame / 10)) % 2;
        ctx.drawImage( Images.creatures,
                       3 * 48, (3 + playerFrame) * 48,
                       48, 48,
                       (player.x +offset.x) * 48, (player.y +offset.y) * 48,
                       48, 48);
    }
};
