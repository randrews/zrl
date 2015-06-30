"use strict";

function random(a,b){
    if(b==undefined){ b=a; a=1; }
    var r = Math.floor(Math.random() * (b-a+1));
    return r + a;
}

function makemap(exits) {
    var h = exits.e || exits.w;
    var v = exits.n || exits.s;

    var half = new Map(5,7,'.');

    var num_segments = random(3, 4);
    var hv = random(2) == 1;

    for(var i=1; i<=num_segments; i++){
        var start = new Point( random(half.width-2),
                               random(half.height-2) );
        var len = random(2,3);

        if(hv){
            for( var x = start.x; x <= start.x+len; x++ )
                half.at( new Point(x, start.y), '#' );
        } else {
            for( var y = start.y; y <= start.y+len; y++ )
                half.at( new Point(start.x, y), '#' );
        }
    }

    var map = new Map( half.width*2+3,
                       half.height+2, '.' );

    for(var x=0; x < map.width; x++){
        map.at(new Point(x,0), '#');
        map.at(new Point(x,map.height-1), '#');
    }

    for(var y=1; y < map.height-1; y++){
        map.at(new Point(0,y), '#');
        map.at(new Point(map.width-1, y), '#');
    }

    half.each(function(pt, ch){
        map.at(pt.add(new Point(1,1)), ch);
    });

    if(random(2) == 1){ // Mirror
        half.each(function(pt, ch){
            map.at(new Point(map.width-2-pt.x,
                             pt.y+1),
                   ch);
        });
    } else { // Flip then mirror
        var corner = new Point(map.width-2, map.height-2);
        half.each(function(pt, ch){
            map.at(corner.sub(pt),ch);
        });
    }

    if(h){ // Draw a corridor for the horizontal doors
        for(var x=1; x <= 2; x++) {
            map.at(new Point(x, (map.height-1)/2), '.');
            map.at(new Point(map.width-x-1, (map.height-1)/2), '.');
        }
    }

    if(v){ // Draw a corridor for the vertical doors
        for(var y=1; y <= 2; y++) {
            map.at(new Point((map.width-1)/2, y), '.');
            map.at(new Point((map.width-1)/2, map.height-y-1), '.');
        }
    }

    // Various members
    map.biome = random(1, 15);

    smoothifyWalls(map, hv);
    insertDoors(map, exits);
    randomizeFloors(map);
    addItems(map);

    return map;
}

function smoothifyWalls(map, hv){
    map.at(new Point(0,0), {type:'wall', draw:17});
    map.at(new Point(map.width-1,0), {type:'wall', draw:18});
    map.at(new Point(0,map.height-1), {type:'wall', draw:19});
    map.at(new Point(map.width-1, map.height-1), {type:'wall', draw:20});

    for(var x=1; x<=map.width-2; x++) {
        map.at(new Point(x, 0), {type:'wall', draw:12});
        map.at(new Point(x, map.height-1), {type:'wall', draw:12});
    }

    for(var y=1; y<=map.height-2; y++) {
        map.at(new Point(0, y), {type:'wall', draw:15});
        map.at(new Point(map.width-1,y), {type:'wall', draw:15});
    }

    var blocks = map.find_value("#");
    for(var i=0; i<blocks.length; i++){
        var c = blocks[i];

        if(hv){
            var lt = c.x>1 && map.at(new Point(c.x-1, c.y)) != '.';
            var rt = c.x<map.width-1 && map.at(new Point(c.x+1, c.y)) != '.';

            if(!lt && !rt) map.at(c, {type:'wall', draw:10});
            if(!lt && rt) map.at(c, {type:'wall', draw:11});
            if(lt && rt) map.at(c, {type:'wall', draw:12});
            if(lt && !rt) map.at(c, {type:'wall', draw:13});
        } else {
            var up = c.y>1 && map.at(new Point(c.x, c.y-1)) != '.';
            var dn = c.y<map.height-2 && map.at(new Point(c.x, c.y+1)) != '.';

            if(!up && !dn) map.at(c, {type:'wall', draw:10});
            if(!up && dn) map.at(c, {type:'wall', draw:14});
            if(up && dn) map.at(c, {type:'wall', draw:15});
            if(up && !dn) map.at(c, {type:'wall', draw:16});
        }
    }
}

function insertDoors(map, exits){
    map.exits = exits;
    var midx = Math.floor(map.width/2);
    var midy = Math.floor(map.height/2);
    var maxx = map.width-1;
    var maxy = map.height-1;
    if(exits.n){
        map.at(new Point(midx, 0), {type:'floor', door:'n', draw: floorForBiome(map.biome)});
        map.at(new Point(midx-1, 0), {type:'wall', draw:13});
        map.at(new Point(midx+1, 0), {type:'wall', draw:11});
    }

    if(exits.s){
        map.at(new Point(midx, maxy), {type:'floor', door:'s', draw: floorForBiome(map.biome)});
        map.at(new Point(midx-1, maxy), {type:'wall', draw:13});
        map.at(new Point(midx+1, maxy), {type:'wall', draw:11});
    }

    if(exits.e){
        map.at(new Point(maxx, midy), {type:'floor', door:'e', draw: floorForBiome(map.biome)});
        map.at(new Point(maxx, midy-1), {type:'wall', draw:16});
        map.at(new Point(maxx, midy+1), {type:'wall', draw:14});
    }

    if(exits.w){
        map.at(new Point(0, midy), {type:'floor', door:'w', draw: floorForBiome(map.biome)});
        map.at(new Point(0, midy-1), {type:'wall', draw:16});
        map.at(new Point(0, midy+1), {type:'wall', draw:14});
    }
}

function randomizeFloors(map){
    var floor = map.find_value(".");
    for(var i=0; i<floor.length; i++){
        var c = floor[i];
        map.at(c, {type:'floor', draw: floorForBiome(map.biome)});
    }
}

function floorForBiome(biome){
    if(biome == 2) return 7;
    else if(biome == 5) return 4;
    else if(biome == 6) return 6;
    else if(biome == 10) return (random(9)==1 ? 5 : 4);
    else if(biome == 12) return 4;
    else if(biome == 13) return (random(9)==1 ? 5 : 4);
    else if(biome == 15) return (random(9)==1 ? 7 : 4);
    else return (random(9)==1 ? 6 : 4);
}

function addItems(map){
    var loc = map.random(function(_, c){
        return c.type == 'floor' && !c.door;
    });

    map.items = new Map(map.width, map.height);
    map.items.each(function(pt){ this.at(pt, []); });
    map.items.at(loc).push( Object.create(HealthPotion) );
}

function printmap(map){
    var str = "";
    map.each(function(pt, ch){
        if(pt.x == 0 && pt.y != 0){
            console.log(str);
            str = "";
        }
        str = str + ch;
    });

    console.log(str);
}

function makemaze(){
    var map = new Map(5,5);

    map.each(function(pt){ this.at(pt, {}); });

    var empty = function(pt, v){
        return !v.n && !v.s && !v.e && !v.w;
    };

    var forkable = function(pt, v){
        if(v.n || v.s || v.e || v.w){
            var n = this.neighbors(pt, empty);
            return n.length > 0;
        } else return false;
    };

    var empty_points = map.find(empty);
    while(empty_points.length > 0){
        var current = empty_points[ random(0,empty_points.length-1) ];
        var neighbors = map.neighbors(current, empty);

        while(neighbors.length > 0){
            var next_cell = neighbors[ random(0, neighbors.length-1) ];

            if(current.x < next_cell.x) {
                map.at(current).e = true;
                map.at(next_cell).w = true;
            } else if(current.y < next_cell.y) {
                map.at(current).s = true;
                map.at(next_cell).n = true;
            } else if(current.x > next_cell.x) {
                map.at(current).w = true;
                map.at(next_cell).e = true;
            } else if(current.y > next_cell.y) {
                map.at(current).n = true;
                map.at(next_cell).s = true;
            }

            current = next_cell;
            neighbors = map.neighbors(current, empty);
        }

        empty_points = map.find(forkable);
    }

    return map;
}

function printmaze(maze){
    var str = '';
    maze.each(function(pt, node){
        if(pt.x == 0 && pt.y != 0){
            console.log(str);
            str = '';
        }

        var s = '';
        if(node.w) s = s + 'w'; else s = s + '-';
        if(node.n) s = s + 'n'; else s = s + '-';
        if(node.s) s = s + 's'; else s = s + '-';
        if(node.e) s = s + 'e'; else s = s + '-';

        str = str + s + '  ';
    });

    console.log(str);
}
