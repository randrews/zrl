"use strict";

function Map(width, height, fill){
  fill = fill || 0;
  this.width = width;
  this.height = height;
  this.cells = [];

  for(var i=0; i < width*height; i++)
    this.cells[i] = fill;
}

//////////////////////////////////////////////////

Map.prototype.at = function(pt, val){
  if(this.inside(pt)){
    if(val != undefined)
      this.cells[pt.x + pt.y*this.width] = val;
    return this.cells[pt.x + pt.y*this.width];
  } else return null;
};

Map.prototype.clamp = function(pt){
  pt = pt.copy();
  if(pt.x < 0) pt.x = 0;
  if(pt.x > this.width-1) pt.x = this.width-1;
  if(pt.y < 0) pt.y = 0;
  if(pt.y > this.height-1) pt.y = this.height-1;
  return pt
};

Map.prototype.inside = function(pt){
  return (pt.x >= 0 &&
          pt.y >= 0 &&
          pt.x < this.width &&
          pt.y < this.height);
};

Map.prototype.clear = function(value){
  var that = this;
  this.each(function(pt){
    that.at(pt, value);
  });
};

Map.prototype.each = function(callback){
  for(var y = 0; y < this.height; y++){
    for(var x = 0; x < this.width; x++){
      callback.apply(this,
                     [ new Point(x,y),
                       this.cells[x + y * this.width] ]);
    }
  }
};

Map.prototype.valueOf = function(){
  return "[Map width=" + this.width + " height=" + height + "]";
};

Map.prototype.find = function(fn){
  var fit = [];
  this.each(function(pt){
    if(fn.apply(this, arguments)) fit.push(pt);
  });

  return fit;
};

Map.prototype.find_value = function(value){
  var fn = function(pt){
    return this.cells[pt.x+pt.y*this.width] == value;
  }
  return this.find(fn);
};

Map.prototype.random = function(fn){
  fn = fn || function(){return true};
  var fit = this.find(fn);
  if(fit.length == 0) return null;
  else {
    var i = Math.floor( Math.random() * fit.length );
    return fit[i];
  }
};

//////////////////////////////////////////////////

Map.prototype.empty = function(pt, val){
  return val == '' || val == 0;
};

Map.prototype.full = function(pt){
  return !(this.empty(pt));
};

Map.prototype.neighbors = function(pt, fn, diag){
  var all = [ pt.add(new Point(-1, 0)),
              pt.add(new Point(1, 0)),
              pt.add(new Point(0, -1)),
              pt.add(new Point(0, 1)) ];

  if(diag) {
    all.push(pt.add(Point.southwest));
    all.push(pt.add(Point.northwest));
    all.push(pt.add(Point.southeast));
    all.push(pt.add(Point.northeast));
  }

  if(fn && typeof(fn) != 'function'){
    var val = fn;
    fn = function(p){ return this.at(p) == val; }
  }

  var fit = [];
  for(var i = 0; i < all.length; i++){
    if( this.inside(all[i]) &&
        (!fn || fn.apply(this,[all[i], this.at(all[i])])) )
      fit.push(all[i]);
  }
  return fit;
};

//////////////////////////////////////////////////

Map.test = function(){
  var assert = function(bool){
    if(!bool) throw "Assertion failed";
  };

  // Constructor
  var m = new Map(10, 10);
  assert(m.width == 10);
  assert(m.inside(new Point(3,3)));
  assert(! m.inside(new Point(10,10)));

  // clear / set
  m.clear(0);
  m.at(new Point(3,2),1)

  // at
  assert(m.at(new Point(1,1)) == 0);
  assert(m.at(new Point(3,2)) == 1);
  assert(m.at(new Point(10,10)) == null);

  // each
  var n = 0;
  m.each(function(){ n++; });
  assert(n == 100);

  // fit
  m.clear('');
  m.at(new Point(1,0),1);
  assert(m.neighbors(new Point(5,5)).length == 4);
  assert(m.neighbors(new Point(0,1)).length == 3);
  assert(m.neighbors(new Point(0,0)).length == 2);
  assert(m.neighbors(new Point(0,0), m.empty).length == 1);
};
