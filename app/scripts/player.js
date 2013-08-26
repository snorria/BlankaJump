/*global define */

define(['controls','platform'], function(controls,Platform) {

  var PLAYER_SPEED = 400; //á að vera 800
  var JUMP_VELOCITY = 800;
  var GRAVITY = 2000;

  var Player = function(el) {
    this.el = el;
    this.el.blanka = this.el.find('.blanka');
    this.jumping = false;
    this.turnedRight = true;
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
  };

  Player.prototype.onFrame = function(delta) {
    // Player input
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
      if(this.el.blanka.hasClass('blankaLeft')){
        this.el.blanka.toggleClass('blankaLeft');
      }
      if(!this.el.blanka.hasClass('blankaWalk') && !this.el.blanka.hasClass('blankaJump')){
        this.el.blanka.toggleClass('blankaWalk');
      }
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
      if(!this.el.blanka.hasClass('blankaLeft')){
        this.el.blanka.toggleClass('blankaLeft');
      }
      if(!this.el.blanka.hasClass('blankaWalk') && !this.el.blanka.hasClass('blankaJump')){
        this.el.blanka.toggleClass('blankaWalk');
      }
    } else {
      this.vel.x = 0;
      if(this.el.blanka.hasClass('blankaWalk'))
      {
        this.el.blanka.toggleClass('blankaWalk');
      }
    }


    //mouse
    /*if(controls.keys.mouse != this.pos.x){
      this.pos.x = controls.keys.mouse-860;
    }*/

    // Jumping
    if (controls.keys.space && !this.jumping) {
      this.vel.y = -JUMP_VELOCITY;
      this.jumping = true;
      this.el.blanka.toggleClass('blankaJump');
      if(this.el.blanka.hasClass('blankaWalk'))
        this.el.blanka.toggleClass('blankaWalk');
    }

    // Gravity
    this.vel.y += GRAVITY * delta;

    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;

    // Collision with ground
    if (this.pos.y > 0) {
      this.pos.y = 0;
      this.vel.y = 0;
      if(this.jumping == true)
      {
        this.jumping = false;
        this.el.blanka.toggleClass('blankaJump');
      }
    }

    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
  };

  Player.prototype.collision = function(objects){
    for (var i = 0; i < objects.length; i++) {
      if(objects[i] instanceof Platform){
        //
        if(this.vel.y>=0){
          console.log(this.vel.y);
          //console.log("objects[i].pos.y:"+objects[i].pos.y+" = this.pos.y:"+this.pos.y);
          //if(5>=objects[i].pos.y+this.pos.y){
          //console.log("sumy:"+(objects[i].pos.y+this.pos.y));
          //}
          if(10>=objects[i].pos.y+this.pos.y &&objects[i].pos.y+this.pos.y>-5){
            //console.log("objects[i].pos.x:"+objects[i].pos.x+" = this.pos.x:"+this.pos.x);
            if(this.pos.x+40 >= objects[i].pos.x && this.pos.x-40 <= objects[i].pos.x+objects[i].width){
              this.vel.y = 0;
              this.pos.y = -objects[i].pos.y;
              if(this.jumping == true)
              {
                this.jumping = false;
                this.el.blanka.toggleClass('blankaJump');
              }
              console.log("lol");
            }
          }
        }
      }
    }
  };


  return Player;
});
