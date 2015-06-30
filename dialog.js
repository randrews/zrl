"use strict";

function Dialog(width, height){
    width = width || 48*7;
    height = height || 48*5;
    var x = Math.floor((Dialog.canvas.width - width)/2);
    var y = Math.floor((Dialog.canvas.height - height)/2);
    this.buttons = [];
    this.promise = new Promise();
    this.init(Dialog.canvas,
              {x: x, y: y, width: width, height: height});
}

Dialog.prototype = new Drawable();

Dialog.prototype.paint = function(ctx){
    patch9(ctx, Images.parchment_light,
           this.geometry.width, this.geometry.height);

    ctx.font = "16px Munro";
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    for(var n=0; n<this.buttons.length; n++){
        var btn = this.buttons[n];
        ctx.drawImage(Images.parchment_light,
                      0, 144, 78, 30,
                      btn.x, btn.y, 78, 30);
        ctx.fillText(btn.label, btn.x+39, btn.y+17);
    }
};

Dialog.open = function(width, height){
    Dialog.active = new Dialog(width, height);
    return Dialog.active.promise;
};

Dialog.close = function(){
    Dialog.active = null;
};

Dialog.prototype.click = function(pt){
    for(var n=0; n<this.buttons.length; n++){
        var btn = this.buttons[n];
        if(inRect(pt, btn)){
            this.promise.finish(btn.label);
        }
    }
};

Dialog.prototype.addButton = function(label){
    this.buttons.push({label: label});
    this.repack();
};

Dialog.prototype.repack = function(){
    // Number of buttons we can fit in a row
    var btnwidth = Math.floor(this.geometry.width / 96);
    // Number of rows
    var rows = Math.ceil(this.buttons.length / btnwidth);

    var top = this.geometry.height - rows * 48;
    var left = Math.floor((this.geometry.width - 96*btnwidth)/2);
    for(var row = 0; row < rows; row++){
        if(row == rows-1 && this.buttons.length - rows*btnwidth){
            left = Math.floor((this.geometry.width-96*(this.buttons.length%btnwidth))/2);
        }

        for(var col = 0; col < btnwidth; col++){
            var btn = this.buttons[col + row*btnwidth];
            if(btn){
                btn.x = col * 96 + left + 9;
                btn.y = row * 48 + top + 9;
                btn.width = 78;
                btn.height = 30;
            }
        }
    }
};
