"use strict";

function LogObj(canvas, geometry){
    this.init(canvas, geometry);

    this.max = 6;
    this.strings = [];
}

LogObj.prototype = new Drawable();

LogObj.prototype.print = function(str){
    this.strings.unshift(str);
    this.strings.splice(this.max);
}

LogObj.prototype.paint = function(ctx, frame){
    patch9(ctx, Images.parchment_light,
           this.geometry.width, this.geometry.height);

    var count = Math.min(this.strings.length, this.max);

    ctx.font = "16px Munro";

    for(var n=0; n<count; n++){
        ctx.fillText(this.strings[n],
                     16,
                     this.geometry.height-20*n-16);
    }
};
