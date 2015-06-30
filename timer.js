"use strict";

function Timer(callback, fps, animationFps){
    this.callback = callback;
    if(!this.callback) throw "Callback not set";
    this.animationFrame = 0;
    this.fps = fps || 50;
    this.animationFps = animationFps || 20;
}

Timer.prototype.start = function(){
    var that = this;

    this.timer = setInterval(function(){
        that.callback(that.animationFrame);
    }, 1000 / this.fps);

    this.animTimer = setInterval(function(){
        that.animationFrame++;
    }, 1000 / this.animationFps);
};

Timer.prototype.stop = function(){
    if(this.timer) clearInterval(this.timer);
    this.timer = null;

    if(this.animTimer) clearInterval(this.animTimer);
    this.animTimer = null;
};
