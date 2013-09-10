define(function() { 

var Platform = function(pos,type) {
  this.el = $('<div class="platform"></div>');
  this.pos = pos;
  this.width = 70;
  this.height = 5;
  this.rightX = this.pos.x+this.width;  
  this.dead = false;
  this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + (-this.pos.y) + 'px,0)');
  this.type = type || 'normal';
  if(this.type == 'double'){
    this.el.css('background','blue');
  }
  
};

  Platform.prototype.onFrame = function() {
    if(this.dead){
      this.el.remove();
    }

  };
  return Platform;
});