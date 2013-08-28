/*global define, $ */

define(['player','platform','dhalsim'], function(Player,Platform,Dhalsim) {
  var VIEWPORT_PADDING = 250;
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
    this.viewport = {x:0,y:0,width:500,height:500};
    this.objects = [];

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
    this.player.collision(this.objects); //collision detection.
    this.updateView();
    // Request next frame.
    requestAnimFrame(this.onFrame);
  };

  Game.prototype.updateView = function() {
    var minY = this.viewport.y;// - VIEWPORT_PADDING;
    var maxY = this.viewport.y + this.viewport.height - VIEWPORT_PADDING;

    var playerY = -this.player.pos.y;
    if(playerY < minY) {
      this.viewport.y = playerY;// + VIEWPORT_PADDING;
    } else if(playerY > maxY){
      this.viewport.y = playerY - this.viewport.height + VIEWPORT_PADDING;
    }
    this.viewEl.css('transform', 'translate3d(0px,'+(this.viewport.y)+'px,0)');
    /*console.log("playerY:"+playerY);
    console.log("y:"+this.viewport.y);
    console.log("MAX:"+maxY);
    console.log("MIN:"+minY);*/
    /*
    //this.viewEl.css('transform', 'translate3d(0px,'+this.i+'px,0)');
    //this.i++;
    var diff = this.viewPortY + this.player.pos.y;
    //if(diff < -100){
      this.viewEl.css('transform', 'translate3d(0px,'+(-diff)+'px,0)');
      this.viewportY = this.viewPortY+(-diff);
    //}
    //else if(this.player.pos.y == 0){
      //this.viewEl.css('transform', 'translate3d(0px,0px,0)');
      //this.viewportY = 0;
    //}*/

    
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
  * Starting position
  */
  this.player.pos.x = 250;
  /**
  * Creating objects
  */
  this.addPlatform(new Platform({
    x: 400,
    y: 150},
    150,
    10
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 50},
    150,
    10
  ));
  this.addPlatform(new Platform({
    x: 150,
    y: 300},
    10,
    10
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 400},
    20,
    10
  ));
  this.addPlatform(new Platform({
    x: 200,
    y: 500},
    30,
    10
  ));
  this.addPlatform(new Platform({
    x: 300,
    y: 600},
    40,
    10
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 700},
    50,
    10
  ));
  this.addPlatform(new Platform({
    x: 300,
    y: 800},
    60,
    10
  ));
  this.addPlatform(new Platform({
    x: 150,
    y: 900},
    70,
    10
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 1000},
    80,
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