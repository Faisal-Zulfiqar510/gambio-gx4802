'use strict';

/* --------------------------------------------------------------
 iframe_resizer.js 2015-11-12 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## iFrame resizer
 *
 * Widget that resizes the iframes on isolated modules page
 *
 * @module Compatibility/iframe_resizer
 */
gx.compatibility.module('iframe_resizer', [],

/**  @lends module:Compatibility/iframe_resizer */

function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES DEFINITION
  // ------------------------------------------------------------------------

  var
  /**
   * Module Selector
   *
   * @var {object}
   */
  $this = $(this),


  /**
   * Default Options
   *
   * @type {object}
   */
  defaults = {},


  /**
   * Final Options
   *
   * @var {object}
   */
  options = $.extend(true, {}, defaults, data),


  /**
   * Module Object
   *
   * @type {object}
   */
  module = {};

  // ------------------------------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  var _resize = function _resize() {
    var $iframe = $this.contents(),
        $body = $iframe.find('body'),
        height = $body.outerHeight(),
        width = $('.boxCenter').width() - 70;

    $this.css({ 'height': height + 'px', 'width': width + 'px' });
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    _resize();
    $this.one('load', _resize);
    setInterval(_resize, 100);
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlmcmFtZV9yZXNpemVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfcmVzaXplIiwiJGlmcmFtZSIsImNvbnRlbnRzIiwiJGJvZHkiLCJmaW5kIiwiaGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJ3aWR0aCIsImNzcyIsImluaXQiLCJkb25lIiwib25lIiwic2V0SW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGdCQURKLEVBR0ksRUFISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxVQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGFBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLFlBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBcEJkOzs7QUFzQkk7Ozs7O0FBS0FELFdBQVMsRUEzQmI7O0FBNkJBO0FBQ0E7QUFDQTs7QUFFQSxNQUFJTyxVQUFVLFNBQVZBLE9BQVUsR0FBWTtBQUN0QixRQUFJQyxVQUFVTixNQUFNTyxRQUFOLEVBQWQ7QUFBQSxRQUNJQyxRQUFRRixRQUFRRyxJQUFSLENBQWEsTUFBYixDQURaO0FBQUEsUUFFSUMsU0FBU0YsTUFBTUcsV0FBTixFQUZiO0FBQUEsUUFHSUMsUUFBUVgsRUFBRSxZQUFGLEVBQWdCVyxLQUFoQixLQUEwQixFQUh0Qzs7QUFLQVosVUFBTWEsR0FBTixDQUFVLEVBQUMsVUFBVUgsU0FBUyxJQUFwQixFQUEwQixTQUFTRSxRQUFRLElBQTNDLEVBQVY7QUFDSCxHQVBEOztBQVVBO0FBQ0E7QUFDQTs7QUFFQWQsU0FBT2dCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCVjtBQUNBTCxVQUFNZ0IsR0FBTixDQUFVLE1BQVYsRUFBa0JYLE9BQWxCO0FBQ0FZLGdCQUFZWixPQUFaLEVBQXFCLEdBQXJCO0FBQ0FVO0FBQ0gsR0FMRDs7QUFPQSxTQUFPakIsTUFBUDtBQUNILENBdEVMIiwiZmlsZSI6ImlmcmFtZV9yZXNpemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpZnJhbWVfcmVzaXplci5qcyAyMDE1LTExLTEyIGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBpRnJhbWUgcmVzaXplclxuICpcbiAqIFdpZGdldCB0aGF0IHJlc2l6ZXMgdGhlIGlmcmFtZXMgb24gaXNvbGF0ZWQgbW9kdWxlcyBwYWdlXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L2lmcmFtZV9yZXNpemVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdpZnJhbWVfcmVzaXplcicsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L2lmcmFtZV9yZXNpemVyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX3Jlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkaWZyYW1lID0gJHRoaXMuY29udGVudHMoKSxcbiAgICAgICAgICAgICAgICAkYm9keSA9ICRpZnJhbWUuZmluZCgnYm9keScpLFxuICAgICAgICAgICAgICAgIGhlaWdodCA9ICRib2R5Lm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggPSAkKCcuYm94Q2VudGVyJykud2lkdGgoKSAtIDcwO1xuXG4gICAgICAgICAgICAkdGhpcy5jc3MoeydoZWlnaHQnOiBoZWlnaHQgKyAncHgnLCAnd2lkdGgnOiB3aWR0aCArICdweCd9KTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBfcmVzaXplKCk7XG4gICAgICAgICAgICAkdGhpcy5vbmUoJ2xvYWQnLCBfcmVzaXplKTtcbiAgICAgICAgICAgIHNldEludGVydmFsKF9yZXNpemUsIDEwMCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
