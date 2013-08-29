define(function() { 

var Dhalsim = function(options) {
  this.el = $('<div class="dhalsim"></div>');
  this.pos = {x:0,y:0};
  this.radius = 33;
  this.start = options.start;
  this.end = options.end;
  this.duration = options.duration || 3;
  this.current = 0;
};

  Dhalsim.prototype.onFrame = function(delta) {
  	if(this.dead){
  		this.el.remove();
  	}
	this.current = (this.current + delta) % this.duration;

    var relPosition = Math.sin((Math.PI*2) * (this.current / this.duration)) / 2 + 0.5;
    console.log(relPosition);
    this.pos.x = this.start.x + (this.end.x - this.start.x) * relPosition;
    this.pos.y = this.start.y + (this.end.y - this.start.y) * relPosition;

    // Update UI
    //console.log(this.pos.x);
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + (-this.pos.y) + 'px,0)');
  };
  return Dhalsim;
});