"use strict";

function Inventory(canvas, geometry){
    this.init(canvas, geometry);
}

Inventory.prototype = new Drawable();

Inventory.prototype.paint = function(ctx, items, frame){
    var width = this.geometry.width / 48;
    var height = this.geometry.height / 48;

    patch9(ctx, Images.parchment_dark, this.geometry.width, this.geometry.height);

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
};
