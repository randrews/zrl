"use strict";

function Drawable(){}

Drawable.prototype.init = function(canvas, geometry){
    this.canvas = canvas;
    this.geometry = geometry;

    this.buffer = document.createElement("canvas");
    this.buffer.width = this.geometry.width;
    this.buffer.height = this.geometry.height;
};

Drawable.prototype.draw = function(){
    if(!this.canvas) throw("Canvas not set");
    if(this.buffer) var ctx = this.buffer.getContext("2d");
    else var ctx = this.canvas.getContext("2d");

    var args = [ctx];
    for(var n=0; n<arguments.length; n++) args[n+1] = arguments[n];
    this.paint.apply(this, args);

    if(this.buffer){
        var realctx = this.canvas.getContext("2d");
        realctx.drawImage(this.buffer, this.geometry.x, this.geometry.y);
    }
};
