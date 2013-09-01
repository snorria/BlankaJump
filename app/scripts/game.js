/*global define, $ */

define(['player','platform','dhalsim','controls'], function(Player,Platform,Dhalsim,controls) {
  var VIEWPORT_PADDING = 400;
  /**
   * Main game class.
   * @param {Element} el DOM element containig the game.
   * @constructor
   */

  var Game = function(el) {
    this.el = el;
    this.player = new Player(this.el.find('.player'),this);
    this.viewEl = this.el.find('.view');
    this.objectsEl = this.el.find('.objects');
    this.platforms = this.el.find('.platforms'); 
    this.hudEl = $('.hud');
    this.messageEl = $('.message');
    this.objects = [];
    this.isPlaying = false;
    this.objectPool = [];

    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };


  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
  };

  Game.prototype.unFreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };

  Game.prototype.createWorld = function() {
   /* numbers for what to spawn:
    * 1. Platform
    * 2. Dhalsim
    * weighted random array.
    */
    for(var i = 0;  i<100;i++){
      this.objectPool.push(1);
    }


    //earth
  this.addPlatform(new Platform({
    x: 0,
    y: 0},
    500,
    5
  ));
  
  this.addPlatform(new Platform({
    x: 400,
    y: 150},
    150,
    5
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 50},
    150,
    5
  ));
  this.addPlatform(new Platform({
    x: 150,
    y: 300},
    50,
    5
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 400},
    20,
    5
  ));
  this.addPlatform(new Platform({
    x: 200,
    y: 500},
    30,
    5
  ));
  this.addPlatform(new Platform({
    x: 300,
    y: 600},
    40,
    5
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 700},
    50,
    5
  ));/*
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
  ));*/

  this.addEnemy(new Dhalsim({start:{x: 250, y: 300}, end:{x: 400, y: 350}}));
  /*this.addEnemy(new Dhalsim({start:{x: 100, y: 700}, end:{x: 450, y: 850}}));
  this.addEnemy(new Dhalsim({start:{x: 200, y: 1050}, end:{x: 50, y: 800}}));*/
  };

  /**
   * Runs every frame. Calculates a delta and allows each game entity to update itself.
   */
  Game.prototype.onFrame = function() {
    if (!this.isPlaying) {
      return;
    }
    var now = +new Date() / 1000,
        delta = now - this.lastFrame;
    this.lastFrame = now;

    this.player.onFrame(delta);
    for (var i = 0, e; e = this.objects[i]; i++) {
      e.onFrame(delta);

      if (e.dead) {
        this.objects.splice(i--, 1);
      }
    }

    this.updateView();
    this.updateHud();

    // Request next frame.
    requestAnimFrame(this.onFrame);
  };
  Game.prototype.updateHud = function() {
    this.hudEl.text(this.score);
  };

  Game.prototype.updateView = function() {
    var minY = this.viewport.y - VIEWPORT_PADDING/2;
    var maxY = this.viewport.y + this.viewport.height - VIEWPORT_PADDING;

    var playerY = -this.player.pos.y;
    if(playerY < minY) {
      this.gameOver();
      //this.viewport.y = playerY;// + VIEWPORT_PADDING;
    } else if(playerY > maxY){
      //hækka viewport.y
      this.viewport.y = playerY - this.viewport.height + VIEWPORT_PADDING;
      this.score++;
      //remova objects out of view
      var that = this;
      this.forEachObject(function(object) {
        if(object.pos.y < that.viewport.y- VIEWPORT_PADDING/2){
          object.dead = true;
        }
      });
      if(this.viewport.y>this.lastSpawnY){
        //console.log("adding enemy");
        //console.log("this.viewport.y"+this.viewport.y);
        this.objectsSpawned +=0.01;
        this.poolCounter++;
        if(this.poolCounter === 100){
          this.objectPool.push(1);//adda platform í poolið.
          if(this.viewport.y>1500){
            this.objectPool.push(2); //eftir y:1500 þá byrja að spawna dhalsims
          }
          this.poolCounter = 0;
        }
        /*if(true){//Math.random()>1.0-(this.objectsSpawned/1000)){
          if(this.enemySpawn)
            this.addEnemy(new Dhalsim({start:{x: Math.random()*(this.viewport.width-100)+50, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*(this.viewport.width-100)+50, y: (this.viewport.y+this.viewport.height)}}));
          this.enemySpawn = !this.enemySpawn;
        
        }*/
        var WhatToSpawn = this.objectPool[Math.floor(Math.random()*this.objectPool.length)];
        console.log(WhatToSpawn);
        console.log("out of :"+ this.objectPool.length);
        if(WhatToSpawn === 1){
          this.addPlatform(new Platform({x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, Math.random()*(this.viewport.width/this.objectsSpawned)+20,5));
        } else if (WhatToSpawn === 2) {
          this.addEnemy(new Dhalsim({start:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}}));
        }
        this.lastSpawnY = this.lastSpawnY + 30;
      }

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
  Game.prototype.addEnemy = function(enemy) {
    this.objects.push(enemy);
    this.objectsEl.append(enemy.el);
  };


  Game.prototype.gameOver = function() {
    this.forEachEnemy(function(e) { e.taunt();});

    this.freezeGame();
    alert('Game over! Score: '+this.score);

    var game = this;
    setTimeout(function() {
      game.start();
    }, 1000);
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {

    //Cleanup last game.
    this.objects.forEach(function(e) { e.el.remove(); });
    this.objects = [];

    // Set the stage.
    this.objectPool = [];
    this.poolCounter = 0;
    this.createWorld();
    this.player.reset();
    this.viewport = {x:0,y:0,width:500,height:800};
    this.lastSpawnY = 0;
    this.score = 0;
    this.enemySpawn = true;
    this.objectsSpawned = 1;
    this.messageEl.text("");
    // Then start.
    this.unFreezeGame();
  };

  Game.prototype.forEachPlatform = function(handler) {
    for (var i = 0, e; e = this.objects[i]; i++) {
      if (e instanceof Platform) {
        handler(e);
      }
    }
  };

  Game.prototype.forEachEnemy = function(handler) {
    for (var i = 0, e; e = this.objects[i]; i++) {
      if (e instanceof Dhalsim) {
        handler(e);
      }
    }
  };
  Game.prototype.forEachObject = function(handler){
    for (var i = 0, e; e = this.objects[i]; i++) {
      if (e instanceof Dhalsim) {
        handler(e);
      }
      if (e instanceof Platform) {
        handler(e);
      }
    }
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