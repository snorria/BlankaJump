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
    //TODO: this.el.blanka.toggleClass('blankaJump',this.jumping); fer þá alltaf þegar this.jumping er true;
    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');
  };

  Player.prototype.collision = function(objects){
    for (var i = 0; i < objects.length; i++) {
      //checka hvaða object þetta er.
      if(objects[i] instanceof Platform){
        //checka hvort playerinn sé að falla niður
        if(this.vel.y>=0){
          //checkar 15pixla bil hvort að playerinn sé að fara lenda á platform eða sé búinn að fara í gegn (-5)
          if(10>=objects[i].pos.y+this.pos.y-35 &&objects[i].pos.y+this.pos.y-35>-10){
            //checkar x hnit hvort playerinn sé að hitta á platformið á x ás, bæti við 40pixlum báðum meginn því characterinn er miklu stærri en hnitið.
            if(this.pos.x+40 >= objects[i].pos.x && this.pos.x-40 <= objects[i].pos.x+objects[i].width){
              this.vel.y = 0;//set velocity í 0 til að stoppa.
              this.pos.y = -objects[i].pos.y; //set pos.y þar sem platforminn er (notaði margin á platforms til að hann væri ofaná.)
              this.vel.y = -JUMP_VELOCITY;

              /*
              if(this.jumping == true)//hopp animations eins og áður.
              {
                this.jumping = false;
                this.el.blanka.toggleClass('blankaJump');
              }*/
            }
          }
        }
      }
    }
  };


  return Player;
});
