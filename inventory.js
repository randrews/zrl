"use strict";

function Inventory(canvas, double_buffered){
    this.canvas = canvas;

    if(double_buffered){
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.canvas.width;
        this.buffer.height = this.canvas.height;
    }
}

Inventory.prototype.start = function(){
    if(!this.game) throw "Game not set";
    var that = this;

    this.timer = setInterval(function(){
        that.draw(that.game.getInventory());
    }, 50);
};

Inventory.prototype.draw = function(items){
    if(this.buffer) var ctx = this.buffer.getContext("2d");
    else var ctx = this.canvas.getContext("2d");

    var width = this.canvas.width / 48;
    var height = this.canvas.height / 48;

    this.drawBorder(ctx);

    for(var n=0; n<items.length; n++){
        var tile = items[n].draw;
        var x = n % width;
        var y = Math.floor(n / width);
        ctx.drawImage( Images.items,
                       tile.x*32, tile.y*32,
                       32, 32,
                       x*48+8, y*48+8,
                       32, 32 )
    }

    for(var n = items.length; n <= width*height-1; n++){
        var x = n % width;
        var y = Math.floor(n / width);
        ctx.drawImage( Images.parchment,
                       144, 0,
                       32, 32,
                       x*48+8, y*48+8,
                       32, 32 )
    }

    // ctx.font = "20px Munro";
    // ctx.fillText("Hello world", 10, 50);

    if(this.buffer){
        var realctx = this.canvas.getContext("2d");
        realctx.drawImage(this.buffer, 0, 0);
    }
};

Inventory.prototype.drawBorder = function(ctx){
    var maxx = this.canvas.width / 48 - 1;
    var maxy = this.canvas.height / 48 - 1;

    ctx.drawImage( Images.parchment,
                   0, 0,
                   96, 48,
                   0, 0,
                   96, 48 );

    ctx.drawImage( Images.parchment,
                   48, 0,
                   96, 48,
                   (maxx-1) * 48, 0,
                   96, 48 );

    if(maxx >= 4)
        for(var x = 2; x <= maxx-2; x++) {
            ctx.drawImage( Images.parchment,
                           48, 0,
                           48, 48,
                           x*48, 0,
                           48, 48 );

            ctx.drawImage( Images.parchment,
                           48, 96,
                           48, 48,
                           x*48, maxy*48,
                           48, 48 );
        }

    ctx.drawImage( Images.parchment,
                   0, 96,
                   96, 48,
                   0, maxy*48,
                   96, 48 );

    ctx.drawImage( Images.parchment,
                   48, 96,
                   96, 48,
                   (maxx-1) * 48, maxy*48,
                   96, 48 );

    for(var y=1; y<=maxy-1; y++){
        ctx.drawImage( Images.parchment,
                       0, 48,
                       48, 48,
                       0, y*48,
                       48, 48 );

        ctx.drawImage( Images.parchment,
                       96, 48,
                       48, 48,
                       maxx*48, y*48,
                       48, 48 );
    }

    ctx.fillStyle = "#97714a";
    ctx.fillRect(48, 48, (maxx-1)*48, (maxy-1)*48);
};
