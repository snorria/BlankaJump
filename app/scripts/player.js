/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 800; //á að vera 800
  var JUMP_VELOCITY = 1000;
  var GRAVITY = 2000;
  var HELL_Y = 2000;
  var PLAYER_HALF_WIDTH = 30;
  var PLAYER_RADIUS = 30;

  var Player = function(el, game) {
    this.game = game;
    this.el = el;
    this.el.blanka = this.el.find('.blanka');
    
  };
  Player.prototype.reset = function() {
    this.jumping = false;
    this.turnedRight = true;
    this.pos = { x: 250, y: 0 };
    this.vel = { x: 0, y: 0 };
    controls.keys.right = false;
    controls.keys.left = false;
  }

  Player.prototype.onFrame = function(delta) {
    // Player input
    if (controls.keys.right) {
      this.vel.x = PLAYER_SPEED;
      this.turnedRight = true;
    } else if (controls.keys.left) {
      this.vel.x = -PLAYER_SPEED;
      this.turnedRight = false;
    } else {
      this.vel.x = 0;
    }


    //mouse
    /*if(controls.keys.mouse != this.pos.x){
      this.pos.x = controls.keys.mouse-860;
    }*/
    /*
    // Jumping
    if (controls.keys.space && !this.jumping) {
      this.vel.y = -JUMP_VELOCITY;
      this.jumping = true;
    }*/

    // Gravity
    this.vel.y += GRAVITY * delta;

    var oldY = this.pos.y;
    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;
    if(this.pos.x >525){
      this.pos.x = -25;
    } else if( this.pos.x <-25){
      this.pos.x = 525;
    }
/*
    // Collision with ground
    if (this.pos.y > 0) {
      this.pos.y = 0;
      this.vel.y = 0;
      if(this.jumping == true)
      {
        this.jumping = false;
        //this.el.blanka.toggleClass('blankaJump');
      }
    }
*/
    // Collision Detection
    this.checkPlatforms(oldY);
    this.checkEnemies();
    this.checkGameOver();
    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');

    this.el.blanka.toggleClass('blankaJump',this.jumping);
    this.el.blanka.toggleClass('blankaWalk',this.vel.x !=0 && !this.jumping);
    this.el.blanka.toggleClass('blankaLeft',!this.turnedRight);
  };

  Player.prototype.checkGameOver = function() {
    if (this.pos.y > HELL_Y){
      this.game.gameOver();
    }
  }

  Player.prototype.checkPlatforms = function(oldY){
    var that = this;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
      //console.log("p.y:"+p.pos.y);
      //console.log("oldY:"+(-oldY));
      //console.log("that.pos.y;"+(-that.pos.y));
      if (p.pos.y <= -oldY && p.pos.y > -that.pos.y && that.vel.y >=0) {
        //console.log("lol");
        //console.log("p.y:"+p.pos.y);
        //console.log("oldY:"+oldY);
        //console.log("that.pos.y;"+(-that.pos.y));
        // Are inside X bounds.
        //console.log("that.pos.x;"+that.pos.x);
        //console.log("p.rightX:"+p.rightX);
        if (that.pos.x + PLAYER_HALF_WIDTH >= p.pos.x && that.pos.x - PLAYER_HALF_WIDTH <= p.rightX) {
          // COLLISION. Let's stop gravity.
          that.pos.y = -p.pos.y;
          that.vel.y = 0;
          that.jumping = true;
          that.vel.y = -JUMP_VELOCITY;
        }
      }
    });
  };

  Player.prototype.checkEnemies = function() {
    
    var centerX = this.pos.x;
    var centerY = -this.pos.y + 35;
    var that = this;
    this.game.forEachEnemy(function(enemy) {
      // Distance squared
      var distanceX = enemy.pos.x - centerX;
      var distanceY = enemy.pos.y - centerY;

      // Minimum distance squared
      var distanceSq = distanceX * distanceX + distanceY * distanceY;
      var minDistanceSq = (enemy.radius + PLAYER_RADIUS) * (enemy.radius + PLAYER_RADIUS);

      // What up?
      if (distanceSq < minDistanceSq) {
        if(centerY> enemy.pos.y+enemy.radius){
          that.vel.y = -JUMP_VELOCITY;
          enemy.dead = true;
          that.game.score*=2;
        } else {
          that.game.gameOver();
        }

      }
    });
  
  };
  /*
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

              
          }
        }
      }
    }
  };*/


  return Player;
});
