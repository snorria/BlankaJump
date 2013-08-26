/*global define, $ */

define(['player','platform','dhalsim'], function(Player,Platform,Dhalsim) {
  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */

  //wtf is this?
  var Game = function(el) {
    this.el = el;
    this.player = new Player(this.el.find('.player'));
    this.viewEl = el.find('.view');
    this.platforms = this.el.find('.platforms'); 
    this.viewPortY = 0;
    this.objects = [];
    this.i = 1;
    console.log(this.viewEl);

    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {
    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    this.player.onFrame(delta);
    this.updateView();
    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  Game.prototype.updateView = function() {
    //this.viewEl.css('transform', 'translate3d(0px,'+this.i+'px,0)');
    //this.i++;
    var diff = this.viewPortY + this.player.pos.y;
    if(diff < -100){
      this.viewEl.css('transform', 'translate3d(0px,'+(-diff)+'px,0)');
      this.viewportY = this.viewPortY+(-diff);
    }
    
  }


  /**
  * Adding objects
  */
  Game.prototype.addPlatform = function(platform) {
    this.objects.push(platform);
    this.platforms.append(platform.el);
  }
  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    // Restart the onFrame loop
    this.lastFrame = +new Date() / 1000;
    requestAnimFrame(this.onFrame);

  /**
  * Creating objects
  */
  this.addPlatform(new Platform({
    x: 150,
    y: 300},
    150,
    10
  ));
  };

  /**
   * Cross browser RequestAnimationFrame
   */
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */ callback) {
          window.setTimeout(callback, 1000 / 60);
        };
  })();

  return Game;
});