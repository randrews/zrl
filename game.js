"use strict";

function Game(){
    this.level = makemaze();
    this.player_inventory = [];

    this.room = new Point(random(this.level.width-1),
                          random(this.level.height-1));

    this.level.each(function(pt, exits){
        this.at(pt, makemap(exits));
    });

    this.player = new Point( (this.currentRoom().width-1)/2,
                             (this.currentRoom().height-1)/2 );

    this.animating = false;
    this.animationFrame = 0;

    this.stats = {
        maxHealth: 20,
        health: 20,
        level: 1
    };
}

Game.prototype.currentRoom = function(){
    return this.level.at(this.room);
};

Game.prototype.getInventory = function(){
    return this.player_inventory;
};

Game.prototype.movePlayer = function(pt){
    var dest = this.currentRoom().at(pt);
    var enemy = this.enemyAt(pt);

    if(enemy) {
        this.attackEnemy(enemy);
        this.tick();
        return true;
    } else if(dest.door) {
        this.player = pt;
        this.moveRoom(dest.door);
        return true;
    } else {
        this.player = pt;

        var items = this.currentRoom().items.at(pt);
        if(items.length > 0) {
            var item = items[0];
            if(item.grabbable && item.grab()) {
                this.player_inventory.push(item);
                items.splice(0, 1);
            }
        }

        return this.tick();
    }
};

Game.prototype.movePath = function(path){
    var that = this;
    var current_idx = 0;
    var prom = new Promise();
    this.animating = true;

    var timer = setInterval( function(){
        var interrupted = that.movePlayer(path[current_idx]);

        if(++current_idx == path.length || interrupted){
            clearInterval(timer);
            that.animating = false;
            prom.finish();
        }
    }, 50 );

    return prom;
};

Game.prototype.moveRoom = function(dir){
    var that = this;
    this.animating = true;

    var room = this.currentRoom();
    if(dir == 'n' && room.exits.n) this.room.y--;
    if(dir == 's' && room.exits.s) this.room.y++;
    if(dir == 'e' && room.exits.e) this.room.x++;
    if(dir == 'w' && room.exits.w) this.room.x--;
    var new_room = this.currentRoom();

    if(room == new_room) return;

    var midx = Math.floor(room.width/2);
    var midy = Math.floor(room.height/2);
    var maxx = room.width-1;
    var maxy = room.height-1;

    switch(dir){
    case 'n': this.player = new Point(midx, maxy); break;
    case 's': this.player = new Point(midx, 0); break;
    case 'e': this.player = new Point(0, midy); break;
    case 'w': this.player = new Point(maxx, midy); break;
    };

    this.display.animate(room, new_room, dir).then(function(){
        that.animating = false;
    });
};

Game.prototype.useItem = function(index){
    var item = this.player_inventory[index];
    if(!item || !item.usable) return;

    item.use(this, index);
};

Game.prototype.removeItem = function(index){
    this.player_inventory.splice(index, 1);
};

Game.prototype.draw = function(frame){
    this.display.draw(frame);
    this.inventory.draw(this.getInventory(), frame);
    this.status.draw(frame);
};

Game.prototype.calculateFov = function(room, player){
    var fov = new Map(room.width, room.height, false);

    var input = function(x, y){
        var cell = room.at(new Point(x, y));
        return cell && cell.type == 'floor';
    };

    new ROT.FOV.PreciseShadowcasting(input).compute(
        player.x, player.y, room.width,
        function(x, y, r, visibility){
            fov.at(new Point(x,y), true);
        }
    );

    return fov;
};

Game.prototype.attackPlayer = function(enemy){
    var attack_desc;
    if(Math.random() < enemy.accuracy){
        var dmg = random(enemy.dmg[0], enemy.dmg[1]);
        this.stats.health -= dmg;
        attack_desc = "hits for " + dmg + " damage";
    } else {
        attack_desc = "misses";
    }

    Log.print("The " + enemy.name + " " + attack_desc);
};

Game.prototype.moveTowardPlayer = function(enemy){
    var room = this.currentRoom();
    var enemies = room.enemies;
    var i = -1; while(enemies[++i][1] != enemy);

    var isFloor = function(pt){
        return room.at(pt).type == 'floor';
    };

    var path = room.path(enemies[i][0], this.player, isFloor, true);
    if(room.at(path[0]).door) return;
    enemies[i][0] = path[0];
};

Game.prototype.tick = function(){
    var interrupt = false;
    var room = this.currentRoom();
    for(var i=0; i<room.enemies.length; i++){
        var pt = room.enemies[i][0];
        var enemy = room.enemies[i][1];
        interrupt = enemy.tick(this, pt) || interrupt;
    }

    return interrupt;
};

Game.prototype.enemyAt = function(pt){
    var enemies = this.currentRoom().enemies;
    for(var i=0; i<enemies.length; i++)
        if(enemies[i][0].eq(pt)) return enemies[i][1];
};

Game.prototype.canMove = function(pt){
    var room = this.currentRoom();
    if(!room.inside(pt)) return false;

    var dest = room.at(pt);
    if(dest.type != 'floor') return false;

    return true;
};

Game.prototype.attackEnemy = function(enemy){
    var hit = (random(2) == 1);
    var dmg = random(2);

    if(hit) {
        Log.print("You hit the " + enemy.name + " for " + dmg + " damage");
        enemy.hurt(this, dmg);
    } else {
        Log.print("You miss the " + enemy.name);
    }
};

Game.prototype.removeEnemy = function(enemy){
    var enemies = this.currentRoom().enemies;
    var i = -1; while(enemies[++i][1] != enemy);
    enemies.splice(i, 1);
};
