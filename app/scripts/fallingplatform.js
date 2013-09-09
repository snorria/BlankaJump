define(function() { 

var FallingPlatform = function(options) {
  this.el = $('<div class="fallingPlatform"></div>');
  this.pos = options.pos;
  this.width = 70;
  this.height = 5;
  this.rightX = this.pos.x+this.width;
  this.vel = {x:0,y:0};
  this.GRAVITY = 15;
  this.dead = false;
};

  FallingPlatform.prototype.onFrame = function(delta) {
    if(this.dead){
      this.el.remove();
    }
    this.vel.y += this.GRAVITY * delta;
    this.pos.y -= delta * this.vel.y;
    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + (-this.pos.y) + 'px,0)');
  };
  return FallingPlatform;
});