define(function() { 

var Dhalsim = function(pos,width,height) {
  this.el = $('<div class="dhalsim"></div>');
  this.pos = pos;
  this.width = width;
  this.height = height;
  this.radius = width;
  //this.rightX = this.pos.x+this.width;
  this.el.css({
    left: this.pos.x,
    bottom: this.pos.y,
    width: this.width,
    height: this.height
  });
};

  Dhalsim.prototype.onFrame = function() {};
  return Dhalsim;
});