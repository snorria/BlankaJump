define(function() { 

var Platform = function(pos,width,height) {
  this.el = $('<div class="platform"></div>');
  this.pos = pos;
  this.width = width;
  this.height = height;
  this.rightX = this.pos.x+this.width;
  this.el.css({
    left: this.pos.x,
    bottom: this.pos.y,
    width: this.width,
    height: this.height
  });
};

  return Platform;
});