"use strict";

function Target(game, type){
    this.game = game;
    this.type = type;
    this.filters = [];

    if(type == 'item') this.geometry = game.inventory.geometry;
    else if(type == 'map') this.geometry = game.display.geometry;
    else throw "Unknown target type " + type;

    this.promise = new Promise();
}

Target.cancel = function(){
    Target.active = null;
};

Target.item = function(game){
    var t = new Target(game, 'item');
    Target.active = t;
    return t;
};

Target.map = function(game){
    var t = new Target(game, 'map');
    Target.active = t;
    return t;
};

Target.prototype.then = function(fn){
    this.promise.then(fn);
    return this;
};

Target.prototype.click = function(pt){
    if(!inRect(pt, this.geometry)) return;

    var obj = null;
    if(this.type == 'item') obj = this.toItem(pt.x-this.geometry.x,
                                              pt.y-this.geometry.y);
    else obj = this.toMap(pt.x-this.geometry.x,
                          pt.y-this.geometry.y);

    if(!obj) return;

    for(var n=0; n<this.filters.length; n++){
        var f = this.filters[n]
        if(!f(this.game, obj)) return;
    }

    // We made it this far, they've chosen
    Target.cancel();
    this.promise.finish(obj);
};

Target.prototype.where = function(filter){
    if(typeof(filter) == 'string') filter = Target.filters[filter];
    this.filters.push(filter);
    return this;
};

Target.prototype.toItem = function(x, y){
    x = Math.floor(x/48);
    y = Math.floor(y/48);

    var inv_width = this.game.inventory.geometry.width/48;
    var n = x + inv_width*y;

    if(n >= 0 && n < this.game.player_inventory.length)
        return this.game.player_inventory[n];
    else return null;
};

Target.prototype.toMap = function(x, y){
    var pt = new Point(Math.floor(x/48),
                     Math.floor(y/48));

    if(this.game.currentRoom().inside(pt))
        return pt;
    else return null;
};

Target.filters = {
    adjacent: function(game, pt){
        return pt.adjacent(game.player, true);
    },

    wall: function(game, pt){
        return game.currentRoom().at(pt).type == 'wall';
    },

    floor: function(game, pt){
        return game.currentRoom().at(pt).type == 'floor';
    },

    noitem: function(game, pt){
        return game.currentRoom().items.at(pt).length == 0;
    },

    empty: function(game, pt){
        return Target.filters.floor(game, pt) &&
            Target.filters.noitem(game, pt);
    },

    visible: function(game, pt){
        var vis = game.calculateFov(game.currentRoom(), game.player);
        return vis.at(pt);
    },

    enemy: function(game, pt){
        return game.enemyAt(pt);
    }
};
