/*global define, $ */

define(['player','platform','dhalsim','controls','movingplatform'], function(Player,Platform,Dhalsim,controls,MovingPlatform) {
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
    this.menuEl = this.el.find('.menu');
    this.playButton = this.menuEl.find('.play');
    this.hudEl = $('.hud');
    this.messageEl = $('.message');
    this.objects = [];
    this.isPlaying = false;
    this.objectPool = [];

    var that = this;
    this.playButton.click(function(){
      that.start();
    });
    this.menuEl.addClass('start');
    this.playButton.focus();
    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };


  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
    this.gameoverScreen();
  };

  Game.prototype.unFreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.gameoverScreen();

      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };
  Game.prototype.gameoverScreen = function() {
    this.menuEl.toggleClass('dead',!this.isPlaying);
    this.playButton.text('Play Again');
    //this.playButton.focus();
  };
  Game.prototype.createWorld = function() {
   /* numbers for what to spawn:
    * 0. Platform
    * 1. Dhalsim
    * 2. MovingPlatform
    * weighted random array.
    */
    this.objectPool[0] = 0;
    this.objectPool[1] = 0;
    this.objectPool[2] = 100


    //earth
  this.addPlatform(new Platform({
    x: -25,
    y: 0},
    550,
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
    60,
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
    60,
    5
  ));
  this.addPlatform(new Platform({
    x: 300,
    y: 600},
    70,
    5
  ));
  this.addPlatform(new Platform({
    x: 400,
    y: 700},
    70,
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
  this.addPlatform(new MovingPlatform({start:{x: 0,y:200}, end:{x:200,y:200}}));

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

    controls.onFrame(delta);
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
    var minY = this.viewport.y - VIEWPORT_PADDING/6;
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
        if(this.poolCounter === 50){
          //this.objectPool[0]++;//adda platform í poolið.
          if(this.viewport.y>1500 && this.objectPool[1]<11){
            this.objectPool[1]++; //eftir y:1500 þá byrja að spawna dhalsims
          }
          if(this.viewport.y>500){
            this.objectPool[2]++;
          }
          this.poolCounter = 0;
        }
        /*if(true){//Math.random()>1.0-(this.objectsSpawned/1000)){
          if(this.enemySpawn)
            this.addEnemy(new Dhalsim({start:{x: Math.random()*(this.viewport.width-100)+50, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*(this.viewport.width-100)+50, y: (this.viewport.y+this.viewport.height)}}));
          this.enemySpawn = !this.enemySpawn;
        
        }*/
        
        var WhatToSpawn = this.whatToSpawn();
        console.log(WhatToSpawn);
        console.log(this.objectPool);
        if(WhatToSpawn === 0){
          this.addPlatform(new Platform({x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, Math.random()*(this.viewport.width/this.objectsSpawned)+20,5));
        } else if (WhatToSpawn === 1) {
          this.addEnemy(new Dhalsim({start:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}}));
        } else if (WhatToSpawn === 2) {
          this.addPlatform(new MovingPlatform({start:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}}));
        }
        this.lastSpawnY = this.lastSpawnY + 35;
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

    
  };
  Game.prototype.whatToSpawn = function(){
    var sum = this.objectPool.reduce(function(pv, cv) { return pv + cv; }, 0);
    var probe = Math.floor(Math.random()*sum);
    if(0<=probe && probe <= this.objectPool[0]){
      return 0;
    } else if (this.objectPool[0]<probe && probe <= this.objectPool[0]+this.objectPool[1]){
      return 1;
    } else if (this.objectPool[0]+this.objectPool[1]<probe && probe <= this.objectPool[0]+this.objectPool[1]+this.objectPool[2]){
      return 2;
    } else {
      return -1;//error?
    }

  };


  /**
  * Adding objects
  */
  Game.prototype.addPlatform = function(platform) {
    this.objects.push(platform);
    this.platforms.append(platform.el);
  };
  Game.prototype.addEnemy = function(enemy) {
    this.objects.push(enemy);
    this.objectsEl.append(enemy.el);
  };


  Game.prototype.gameOver = function() {
    this.forEachEnemy(function(e) { e.taunt();});
    this.freezeGame();
    //alert('Game over! Score: '+this.score);

    /*var game = this;
    setTimeout(function() {
      game.start();
    }, 1000);*/
  };

  /**
   * Starts the game.
   */
  Game.prototype.start = function() {
    this.menuEl.removeClass('start');
    console.log("start");
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
      if (e instanceof MovingPlatform) {
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
      if (e instanceof MovingPlatform) {
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