/*global define, $ */

define(['player','platform','dhalsim','controls','movingplatform','fallingplatform','Howler'], function(Player,Platform,Dhalsim,controls,MovingPlatform,FallingPlatform,howler) {
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
    this.highscoreButton = this.menuEl.find('.highscoreButton');
    this.highscoreSubmitButton = this.el.find('.highscoreSubmit');
    this.highscoreEl = this.el.find('.highscore');
    this.highscoreListEl = this.el.find('.highscoreList');
    this.highscoreListShowing = false;
    this.hudEl = $('.hud');
    this.messageEl = $('.message');
    this.objects = [];
    this.isPlaying = false;
    this.objectPool = [];
    this.highScore = 0;
    this.sounds = {};
    this.mIsPressed = false;
    this.soundMute = false;
    this.sentScore = false;

    /* Sounds: These are sounds from street fighter 4, along with the blanka theme from sf2.
    */
    this.sounds.hit = new howler.Howl({
      urls: ['sounds/hit.mp3', 'sounds/hit.ogg','sounds/hit.wav']
    });
    this.sounds.gameover = new howler.Howl({
      urls: ['sounds/gameover.mp3','sounds/gameover.ogg','sounds/gameover.wav']
    });
    this.sounds.go = new howler.Howl({
      urls: ['sounds/go.mp3', 'sounds/go.ogg', 'sounds/go.wav']
    });
    this.sounds.step = new howler.Howl({
      urls: ['sounds/frontstep.mp3','sounds/frontstep.ogg','sounds/frontstep.wav'],
      volume: 0.1
    });
    this.sounds.theme = new howler.Howl({
      urls: ['sounds/theme.mp3','sounds/theme.ogg','sounds/theme.wav'],
      loop: true
    });
    this.sounds.dropped = new howler.Howl({
      urls: ['sounds/dropped.mp3','sounds/dropped.ogg','sounds/dropped.wav']
    });
    /* Click events for the buttons.
    */
    var that = this;
    this.playButton.click(function(){
      that.start();
    });
    $(document).on('click', '.highscoreButton', function (ev) {
      that.highscoreList();
    });
    this.highscoreSubmitButton.click(function(){
      that.submitScore();
    });
    /* adding class start for the start menu.
    */
    this.menuEl.addClass('start');
    
    // Cache a bound onFrame since we need it each frame.
    this.onFrame = this.onFrame.bind(this);
  };
  Game.prototype.submitScore = function(){
    //getting name from the text box.
    var userName = $('#name').val();
    if(this.sentScore){//if you've already sent this score you can't do it again.
      return;
    }
    if(userName === '' ||userName === null || typeof userName === "undefined"){//username is required. 
      return;
    }
    if(typeof this.score === "undefined"){//if you haven't played yet.
      return;
    }
    //grab the score and username and put them in a object.
    var scoreobj = { name: userName,
                  score: this.score};
    ;
    //send the object via post.
    $.post('http://likdis.servegame.com:15000', scoreobj);
    //grab a new list of scores.
    $.getJSON('http://likdis.servegame.com:15000', function(data) {
        var items = [];
       
        $.each(data, function(key, val) {
          items.push('<li id="' + key + '">' + val.name + ' - ' + val.score+ '</li>');
        });
       $('.scores').empty();
        $('<ol/>', {
          'class': 'scorelist',
          html: items.join('')
        }).appendTo('.scores');
      });
    //set sentScore as true so you can't send it again.
    this.sentScore = true;
  };
  Game.prototype.highscoreList = function() {
    //toggle class for the menus.
    this.highscoreListEl.toggleClass('showList');
    if(!this.highscoreListShowing){
      $(document).find('.highscoreButton').text('Back');
      this.highscoreListShowing = true;
      //JSON ná í highscore
      $.getJSON('http://likdis.servegame.com:15000', function(data) {
        var items = [];
       
        $.each(data, function(key, val) {
          items.push('<li id="' + key + '">' + val.name + ' - ' + val.score+ '</li>');
        });
       $('.scores').empty();
        $('<ol/>', {
          'class': 'scorelist',
          html: items.join('')
        }).appendTo('.scores');
      });
    } else{
      $(document).find('.highscoreButton').text('Highscore List');
      this.highscoreListShowing = false;
    }

  };

  Game.prototype.freezeGame = function() {
    this.isPlaying = false;
    this.gameoverScreen();
    this.sounds.theme.stop();
    this.sounds.gameover.play();
  };
  Game.prototype.unFreezeGame = function() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.gameoverScreen();
      this.sounds.go.play();
      this.sounds.theme.play();
      // Restart the onFrame loop
      this.lastFrame = +new Date() / 1000;
      requestAnimFrame(this.onFrame);
    }
  };
  Game.prototype.gameoverScreen = function() {
    this.menuEl.toggleClass('dead',!this.isPlaying);
    this.playButton.text('Play Again');
    this.sentScore = false;
    //this.playButton.focus();
  };
  Game.prototype.createWorld = function() {
   /* numbers for what to spawn:
    * 0. Platform
    * 1. Dhalsim
    * 2. MovingPlatform
    * 3. verticalMovingPlatform
    * 4. FallingPlatform
    * weighted random array.
    */
    this.objectPool[0] = 70;
    this.objectPool[1] = 0;
    this.objectPool[2] = 10;
    this.objectPool[3] = 10;
    this.objectPool[4] = 10;

  this.addPlatform(new Platform({
    x: 250,
    y: 0}
  ));
  this.addPlatform(new Platform({
    x: 150,
    y: 0}
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 0}
  ));
  this.addPlatform(new Platform({
    x: 350,
    y: 0}
  ));
  this.addPlatform(new Platform({
    x: 450,
    y: 0}
  ));
  this.addPlatform(new Platform({
    x: 400,
    y: 150}
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 50}
  ));
  this.addPlatform(new Platform({
    x: 150,
    y: 300}
  ));
  this.addPlatform(new Platform({
    x: 50,
    y: 400}
  ));
  this.addPlatform(new Platform({
    x: 200,
    y: 500}
  ));
  this.addPlatform(new Platform({
    x: 300,
    y: 600}
  ));
  this.addPlatform(new Platform({
    x: 400,
    y: 700}
  ));
  this.addPlatform(new MovingPlatform({start:{x: 0,y:200}, end:{x:200,y:200}}));

  this.addEnemy(new Dhalsim({start:{x: 250, y: 300}, end:{x: 400, y: 350}}));
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

    if (controls.keys.m) {
      if(this.mIsPressed == false){
        if(this.soundMute){
          howler.Howler.unmute();
          this.soundMute = false;
        }
        else{
          howler.Howler.mute();
          this.soundMute = true;
        }
        this.mIsPressed = true;
      }
    }
    else{
      this.mIsPressed = false;
    }
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
      this.score += -Math.floor((this.oldViewportY-this.viewport.y));
      this.oldViewportY = this.viewport.y;
      //remova objects out of view
      var that = this;
      this.forEachObject(function(object) {
        if(object.pos.y < that.viewport.y- VIEWPORT_PADDING/2){
          object.dead = true;
        }
      });
      if(this.viewport.y>this.lastSpawnY){
        this.poolCounter++;
        if(this.poolCounter === 50){
          //this.objectPool[0]++;//adda platform í poolið.
          if(this.viewport.y>1500){
            this.objectPool[1]++; //eftir y:1500 þá byrja að spawna dhalsims
          }
          if(this.viewport.y>500){
            this.objectPool[2]++;
            this.objectPool[3]++;
            this.objectPool[4]++;
          }
          if(this.viewport.y>500 && this.difficulty <60){
            this.difficulty +=0.01;
          }

          
          this.poolCounter = 0;
        }
        
        var WhatToSpawn = this.whatToSpawn();
        if(WhatToSpawn === 0){
          var platformtype = Math.random();
          if(platformtype<0.01){
          this.addPlatform(new Platform({x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)},'double'));
          } else{
          this.addPlatform(new Platform({x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}));
          }
        } else if (WhatToSpawn === 1) {
          this.addEnemy(new Dhalsim({start:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}}));
        } else if (WhatToSpawn === 2) {
          this.addPlatform(new MovingPlatform({start:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}, end:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}}));
        } else if (WhatToSpawn === 3) {
          var randomX = Math.random()*this.viewport.width;
          //duration sett í 10 til þess að maður detti ekki stundum í gegnum platform sem movar of hratt.
          this.addPlatform(new MovingPlatform({start:{x: randomX, y: (this.viewport.y+this.viewport.height)}, end:{x: randomX, y: (this.viewport.y+this.viewport.height-150)}, duration: 10}));
        } else if (WhatToSpawn === 4) {
          this.addPlatform(new FallingPlatform({pos:{x: Math.random()*this.viewport.width, y: (this.viewport.y+this.viewport.height)}}));
        }
        this.lastSpawnY = this.lastSpawnY + this.difficulty;
      }

    }
    //moves the viewport.
    this.viewEl.css('transform', 'translate3d(0px,'+(this.viewport.y)+'px,0)');

    
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
    } else if (this.objectPool[0]+this.objectPool[1]+this.objectPool[2]<probe && probe <= this.objectPool[0]+this.objectPool[1]+this.objectPool[2]+this.objectPool[3]){
      return 3;
    } else if (this.objectPool[0]+this.objectPool[1]+this.objectPool[2]+this.objectPool[3]<probe && probe <= this.objectPool[0]+this.objectPool[1]+this.objectPool[2]+this.objectPool[3]+this.objectPool[4]){
      return 4;
    }else {
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
    this.highscoreEl.html('Your score was: '+this.score).wrap('<pre />');
    this.freezeGame();
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
    this.difficulty = 35; //length between spawns
    this.oldViewportY = 0;
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
      if (e instanceof FallingPlatform) {
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
      if (e instanceof FallingPlatform) {
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