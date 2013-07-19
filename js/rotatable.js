/*!
 * jQuery Element Rotation Plugin
3*
 * Requires jQueryUI 
 *
 * Copyright (c) 2010 Pavel Markovnin @ vremenno.net
 * Dual licensed under the MIT and GPL licenses.
 *
 * Extended by Trevor Wistaff @ a07.com.au
 *
 */

(function ($) {
  'use strict';

  $.fn.rotatable = function (options) {

    // Default Values
    var defaults = {
      rotatorClass: 'rotatable-handle',
      mtx: [1, 0, 0, 1],
      autoHide: true
    }, opts = $.extend(defaults, options),
      _this = this,
      _rotator, center_coords, dims;

    // Initialization 
    this.initialize = function () {
      this.createHandler();

      dims = {
        'w': _this.width(),
        'h': _this.height()
      };

      this.updateRotationMatrix(opts.mtx);
    };

    // Create Rotation Handler
    this.createHandler = function () {
      _rotator = $('<div class="' + opts.rotatorClass + '"></div>');
      _this.append(_rotator);
      _this.rotating = false;

      if(opts.autoHide) {
        $(_this).addClass('rotatable-autohide')
          .mouseenter(function() {
            $(this).removeClass('rotatable-autohide');
          })
          .mouseleave(function() {
            if(!_this.rotating) {
              $(this).addClass('rotatable-autohide');
            }
          });
      }

      this.bindRotation();
    };

    // Bind Rotation to Handler
    this.bindRotation = function () {

      _rotator.draggable({
        helper: 'clone',
        revert: false,
        start: function (e) {
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Element Width & Height()
          dims = {
            'w': _this.width(),
            'h': _this.height()
          };

          // Center Coords
          center_coords = {
            'x': _this.offset().left + _this.width() * 0.5,
            'y': _this.offset().top + _this.height() * 0.5
          };
        },
        drag: function (e) {
          var mouse_coords, angle;

          e.stopPropagation();
          e.stopImmediatePropagation();

          _this.rotating = true;

          // Mouse Coords
          mouse_coords = {
            'x': e.pageX,
            'y': e.pageY
          };

          angle = _this.radToDeg(_this.getAngle(mouse_coords, center_coords)) - 90;

          return _this.rotate(angle);
        },
        stop: function () {
          _this.rotating = false;
        }
      });
    };

    // Get Angle
    this.getAngle = function (ms, ctr) {
      var x = ms.x - ctr.x,
        y = -ms.y + ctr.y,
        hyp = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
        angle = Math.acos(x / hyp);

      if (y < 0) {
        angle = 2 * Math.PI - angle;
      }

      return angle;
    };

    // Convert from Degrees to Radians
    this.degToRad = function (d) {
      return (d * (Math.PI / 180));
    };

    // Convert from Radians to Degrees
    this.radToDeg = function (r) {
      return (r * (180 / Math.PI));
    };

    // Rotate Element to the Given Degree
    this.rotate = function (degree) {
      var cos = Math.cos(_this.degToRad(-degree)),
        sin = Math.sin(_this.degToRad(-degree)),
        mtx = [cos, sin, (-sin), cos];

      this.updateRotationMatrix(mtx);
    };

    // Get CSS Transform Matrix (transform: matrix)
    this.getRotationMatrix = function () {
      var _matrix = _this.css('transform') || 'matrix(1, 0, 0, 1, 0, 0)',
        _m = _matrix.split(','),
        m = [],
        i;

      for (i = 0; i < 4; i++) {
        m[i] = parseFloat(_m[i].replace('matrix(', ''));
      }
      return m;
    };

    // Update CSS Transform Matrix (transform: matrix)
    this.updateRotationMatrix = function (m) {
      var matrix = 'matrix(' + m[0] + ', ' + m[1] + ', ' + m[2] + ', ' + m[3] + ', 0, 0)'

      _this.css({
        '-moz-transform': matrix,
        '-o-transform': matrix,
        '-webkit-transform': matrix,
        '-ms-transform': matrix,
        'transform': matrix,
      });
    };

    return this.initialize();
  };
})(jQuery);
