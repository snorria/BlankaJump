/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 800;
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
      this.jumping = false;
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

  return Player;
});
