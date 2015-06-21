"use strict";

//////////////////////////////////////////////////
/// Constructors
//////////////////////////////////////////////////

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.from_key = function(k){
  if(k == 'up' || k == 'n') return Point.north;
  else if(k == 'down' || k == 's') return Point.south;
  else if(k == 'right' || k == 'e') return Point.east;
  else if(k == 'left' || k == 'w') return Point.west;
}

Point.from_angle = function(a){
    return new Point(Math.cos(a), -Math.sin(a));
}

Point.north = new Point(0, -1); Point.up = Point.north;
Point.south = new Point(0, 1); Point.down = Point.south;
Point.west = new Point(-1, 0); Point.left = Point.west;
Point.east = new Point(1, 0); Point.right = Point.east;

Point.southeast = new Point(1, 1);
Point.southwest = new Point(-1, 1);
Point.northeast = new Point(1, -1);
Point.northwest = new Point(-1, -1);

Point.prototype.copy = function(){
  return new Point(this.x, this.y);
}

//////////////////////////////////////////////////
/// Utils
//////////////////////////////////////////////////

Point.prototype.ortho = function(pt2){
  return this.x == pt2.x || this.y == pt2.y;
};

Point.prototype.toward = function(pt2){
    if(!this.ortho(pt2)){
        console.error(this + ' not in a straight line with ' + pt2);
    } else {
        var v = pt2.sub(this);
        if(v.x > 0) v.x=1;
        if(v.x < 0) v.x=-1;
        if(v.y > 0) v.y=1;
        if(v.y < 0) v.y=-1;
        return v
    }
};

Point.prototype.adjacent = function(pt2, diag){
    var d = pt2.sub(this);
    if((d.x == 0 || d.y == 0) && (Math.abs(d.x+d.y) == 1))
        return true;
    else if(diag){
        return Math.abs(d.x) == 1 && Math.abs(d.y) == 1;
    }
};

Point.prototype.angle_to = function(p2){
    return Math.atan2(p2.y-this.y, p2.x-this.x);
};

Point.prototype.dot = function(p2){
    return this.x*p2.x + this.y*p2.y;
};

/// With one arg: returns the distance to pt2
/// With two args: returns whether the distance is less than or equal to the 2nd arg
Point.prototype.dist = function(pt2, max){
    var d = (this.sub(pt2)) * (this.sub(pt2));
    if(max){
        return (d.x+d.y) <= max*max;
    } else {
        return math.sqrt(d.x + d.y);
    }
};

/// Length of a line from (0,0) to self
Point.prototype.length = function(){
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

Point.prototype.magnitude = Point.prototype.length;

/// Return a point with the same direction as self, but length 1
Point.prototype.normal = function(){
    if(this.length() == 0) return this;
    else return this.div(this.length());
};

//////////////////////////////////////////////////
/// Operators
//////////////////////////////////////////////////

Point.prototype.add = function(pt2){
    return new Point(this.x+pt2.x, this.y+pt2.y);
};

Point.prototype.sub = function(pt2){
    return new Point(this.x-pt2.x, this.y-pt2.y);
};

Point.prototype.mul = function(pt2){
    if(typeof(pt2) == 'number'){
        return new Point(this.x * pt2, this.y * pt2);
    } else {
       return new Point(this.x*pt2.x, this.y*pt2.y);
    }
};

Point.prototype.div = function(pt2){
    if(typeof(pt2) == 'number'){
        return new Point(this.x / pt2, this.y / pt2);
    } else {
       return new Point(this.x / pt2.x, this.y / pt2.y);
    }
};

Point.prototype.translate = Point.prototype.add;

Point.prototype.valueOf = function(){
    return "(" + this.x + ", " + this.y + ")";
};

Point.prototype.eq = function(pt2){
    return this.x == pt2.x && this.y == pt2.y
};

Point.prototype.lt = function(pt2){
    return this.x < pt2.x && this.y < pt2.y
};

Point.prototype.le = function(pt2){
    return this.x <= pt2.x && this.y <= pt2.y
};

Point.prototype.gt = function(pt2){
    return this.x > pt2.x && this.y > pt2.y
};

//////////////////////////////////////////////////
/// Tests
//////////////////////////////////////////////////

Point.test = function(){
    var assert = function(bool){
        if(!bool) throw "Assertion failed";
    };

    var p = new Point(2,3);
    assert(p.x == 2 && p.y == 3);
    assert(p.valueOf() == "(2, 3)");

    p = p.add(new Point(1,1));
    assert(p.valueOf() == "(3, 4)");
    var p2 = p.copy();
    p2.y = p2.y-1;
    assert(p.valueOf() == "(3, 4)");
    assert(p2.valueOf() == "(3, 3)");
    assert(p2 + (new Point(1, 1)).eq(new Point(4, 4)));

    var o1 = new Point(3, 3);
    var o2 = new Point(3, 5);
    assert(o1.ortho(o2));
    assert(o2.sub(o1).eq(new Point(0, 2)));
    assert(o1.toward(o2).eq(new Point(0, 1)));

    var a1 = new Point(2, 2);
    var a2 = new Point(1, 2);
    var a3 = new Point(3, 3);
    assert(a1.adjacent(a2));
    assert(a2.adjacent(a1));
    assert(! a2.adjacent(a3));
    assert(! a1.adjacent(a3));
    assert(! a1.adjacent(a1));

    assert(a2.le(a1));
    assert(a1.lt(a3));
    assert(a3.gt(a1));
    assert(!(a2.lt(a1)));
};
