"use strict";

function Status(canvas, geometry){
    this.init(canvas, geometry);
}

Status.prototype = new Drawable();

Status.prototype.paint = function(ctx){
    patch9(ctx, Images.parchment_gray, 48*5, 48*5);
    var hp = this.game.stats.health / this.game.stats.maxHealth;
    if(hp > 1) hp = 1; if(hp < 0) hp = 0;

    this.paintBar(ctx, 16, 40, hp);
    this.paintBar(ctx, 40, 60, 1);
    this.paintBar(ctx, 64, 20, 0);
};

Status.prototype.paintBar = function(ctx, y, bary, pct){
    var left = 12;
    var right = this.geometry.width-12;
    var width = Math.floor(pct * (right-left));
    var end = left + width;

    ctx.drawImage( Images.bars,
                   0, 0, 4, 20,
                   left, y, 4, 20 );
    ctx.drawImage( Images.bars,
                   4, 0, 1, 20,
                   left+4, y, (right-left)-8, 20 );
    ctx.drawImage( Images.bars,
                   92, 0, 4, 20,
                   right-4, y, 4, 20 );

    if(width > 8) {
        ctx.drawImage( Images.bars,
                       0, bary, 4, 20,
                       left, y, 4, 20 );

        ctx.drawImage( Images.bars,
                       4, bary, 1, 20,
                       left+4, y, width-8, 20 );

        ctx.drawImage( Images.bars,
                       92, bary, 4, 20,
                       end-4, y, 4, 20 );
    } else {
        var half = Math.max(2, Math.floor(width/2));
        ctx.drawImage( Images.bars,
                       0, bary, half, 20,
                       left, y, half, 20 );
        ctx.drawImage( Images.bars,
                       92+half, bary, half, 20,
                       left, y, half, 20 );        
    }
};
