define(function() { 

var Dhalsim = function(pos,width,height) {
  this.el = $('<div class="dhalsim"></div>');
  this.pos = pos;
  this.width = width;
  this.height = height;
  this.radius = width/2;
  //this.rightX = this.pos.x+this.width;
  this.el.css({
    left: this.pos.x,
    bottom: this.pos.y,
    width: this.width,
    height: this.height
  });
};

  Dhalsim.prototype.onFrame = function(delta) {
  	if(this.dead){
  		this.el.remove();
  	}/*
	this.current = (this.current + delta) % this.duration;

    var relPosition = Math.sin((Math.PI * 2) * (this.current / this.duration)) / 2 + 0.5;

    this.pos.x = this.start.x + (this.end.x - this.start.x) * relPosition;
    this.pos.y = this.start.y + (this.end.y - this.start.y) * relPosition;

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
*/
  };
  return Dhalsim;
});