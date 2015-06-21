"use strict";

var PubSub = { channels: {} };

PubSub.subscribe = function(channel, callback){
    if(! PubSub.channels[channel]) PubSub.channels[channel] = [];
    PubSub.channels[channel].push(callback);
};

PubSub.publish = function(channel, message){
    if(PubSub.channels[channel]){
        var subs = PubSub.channels[channel];
        for(var i = 0; i < subs.length; i++){
            subs[i](message);
        }
    }
};

function Promise(){
    this.fulfilled = false;
    this.callbacks = [];
}

Promise.prototype.then = function(callback){
    this.callbacks.push(callback);
    if(this.fulfilled) callback();
    return this;
};

Promise.prototype.finish = function(){
    this.fulfilled = true;
    for(var i=0; i<this.callbacks.length; i++)
        (this.callbacks[i])();
    return this;
};
