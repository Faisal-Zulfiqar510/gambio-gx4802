'use strict';

/* --------------------------------------------------------------
 order_amazon.js 2015-09-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Amazon Payment Details on Order Page
 *
 * This module add the amazon payment informationen to the order details page.
 *
 * @module Compatibility/order_amazon
 */
gx.compatibility.module('order_amazon', [],

/**  @lends module:Compatibility/order_amazon */

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
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $('table.pdf_menu').remove();

    if ($('.amazonadvpay').length > 0) {
      $this.append($('.amazonadvpay'));
      $this.parents('.content:first').show();
    }

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcl9hbWF6b24uanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwicmVtb3ZlIiwibGVuZ3RoIiwiYXBwZW5kIiwicGFyZW50cyIsInNob3ciXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGNBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFVBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsYUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsWUFBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7Ozs7QUFLQUQsV0FBUyxFQTNCYjs7QUE2QkE7QUFDQTtBQUNBOztBQUVBQSxTQUFPTyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQkwsTUFBRSxnQkFBRixFQUFvQk0sTUFBcEI7O0FBRUEsUUFBSU4sRUFBRSxlQUFGLEVBQW1CTyxNQUFuQixHQUE0QixDQUFoQyxFQUFtQztBQUMvQlIsWUFBTVMsTUFBTixDQUFhUixFQUFFLGVBQUYsQ0FBYjtBQUNBRCxZQUFNVSxPQUFOLENBQWMsZ0JBQWQsRUFBZ0NDLElBQWhDO0FBQ0g7O0FBRURMO0FBQ0gsR0FURDs7QUFXQSxTQUFPUixNQUFQO0FBQ0gsQ0E1REwiLCJmaWxlIjoib3JkZXJzL29yZGVyX2FtYXpvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gb3JkZXJfYW1hem9uLmpzIDIwMTUtMDktMjJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEFtYXpvbiBQYXltZW50IERldGFpbHMgb24gT3JkZXIgUGFnZVxuICpcbiAqIFRoaXMgbW9kdWxlIGFkZCB0aGUgYW1hem9uIHBheW1lbnQgaW5mb3JtYXRpb25lbiB0byB0aGUgb3JkZXIgZGV0YWlscyBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9vcmRlcl9hbWF6b25cbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ29yZGVyX2FtYXpvbicsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L29yZGVyX2FtYXpvbiAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCgndGFibGUucGRmX21lbnUnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgaWYgKCQoJy5hbWF6b25hZHZwYXknKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuYXBwZW5kKCQoJy5hbWF6b25hZHZwYXknKSk7XG4gICAgICAgICAgICAgICAgJHRoaXMucGFyZW50cygnLmNvbnRlbnQ6Zmlyc3QnKS5zaG93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
