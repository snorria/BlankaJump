/*global define, $ */

define([], function() {

  var KEYS = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  /**
   * Controls singleton class.
   * @constructor
   */
  var Controls = function() {
    this.keys = {};

    $(window)
      .on('keydown', this.onKeyDown.bind(this))
      .on('keyup', this.onKeyUp.bind(this))
      .on('mousemove', this.onMouseMove.bind(this));
  };

  Controls.prototype.onKeyDown = function(e) {
    if (e.keyCode in KEYS) {
      var keyName = KEYS[e.keyCode];
      this.keys[keyName] = true;
      return false;
    }
  };

  Controls.prototype.onKeyUp = function(e) {
    if (e.keyCode in KEYS) {
      var keyName = KEYS[e.keyCode];
      this.keys[keyName] = false;
    }
  };

  Controls.prototype.onMouseMove = function(e) {
    this.keys['mouse'] = e.pageX;
  };
  
  // Export singleton.
  return new Controls();
});
