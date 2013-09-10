/*global define */

define(['controls'], function(controls) {

  var PLAYER_SPEED = 600; 
  var JUMP_VELOCITY = 850;//750 
  var GRAVITY = 1500;
  var PLAYER_RADIUS = 20;

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
    this.combo = 0;
  }

  Player.prototype.onFrame = function(delta) {
    //x axis velocity.
    this.vel.x = controls.inputVec.x * PLAYER_SPEED;


    // Gravity
    this.vel.y += GRAVITY * delta;

    var oldY = this.pos.y;
    this.pos.x += delta * this.vel.x;
    this.pos.y += delta * this.vel.y;
    if(this.pos.x >510){
      this.pos.x = -10;
    } else if( this.pos.x <-10){
      this.pos.x = 510;
    }

    // Collision Detection
    this.checkPlatforms(oldY);
    this.checkEnemies();
    //this.checkGameOver();
    // Update UI
    this.el.css('transform', 'translate3d(' + this.pos.x + 'px,' + this.pos.y + 'px,0)');

    this.el.blanka.toggleClass('blankaJump',this.jumping);
    this.el.blanka.toggleClass('blankaWalk',this.vel.x !=0 && !this.jumping);
    this.el.blanka.toggleClass('blankaLeft',this.vel.x<0);//!this.turnedRight);
  };


  Player.prototype.checkPlatforms = function(oldY){
    var that = this;

    this.game.forEachPlatform(function(p) {
      // Are we crossing Y.
      if (p.pos.y <= -oldY && p.pos.y > -that.pos.y && that.vel.y >=0) {
        // Are inside X bounds.
        if (that.pos.x + PLAYER_RADIUS >= p.pos.x && that.pos.x - PLAYER_RADIUS <= p.rightX) {
          // COLLISION. Let's stop gravity.
          that.pos.y = -p.pos.y-1;
          that.vel.y = 0;
          that.jumping = true;
          that.vel.y = -JUMP_VELOCITY;
          that.game.sounds.step.play();
          /**/
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
        //radius-3 til að geta farið í efrihelming og drepið.
        if(centerY> enemy.pos.y+enemy.radius-3){
          that.vel.y = -JUMP_VELOCITY;
          enemy.dead = true;
          that.combo++;
          that.game.score+=(10*that.combo);
          that.game.messageEl.text(that.combo+" hit COMBO!");
          that.game.sounds.hit.play(); //Þetta ætti að vera á öllu nema android :(
        } else {
          if(that.combo >0){
            that.game.messageEl.text("Dropped Combo");
            that.combo = 0;
            enemy.dead = true;
            that.game.sounds.dropped.play();
          } else {
            that.game.gameOver();
          }
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
