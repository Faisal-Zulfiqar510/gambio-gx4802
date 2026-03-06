'use strict';

/* --------------------------------------------------------------
 modules_overview.js 2015-09-28 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Modules Overview Listing Handler
 *
 * This module will handle the listing actions on module pages like payment, shipping or order total
 *
 * @module Compatibility/modules_overview
 */
gx.compatibility.module('modules_overview', [],

/**  @lends module:Compatibility/modules_overview */

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
  // PRIVATE METHODS
  // ------------------------------------------------------------------------

  var _toggle = function _toggle(event) {
    var id = $(this).prop('id');

    $('.' + id).toggleClass('hidden');
    $(this).toggleClass('closed');

    $(this).find('i:last-child').toggleClass('fa-plus-square-o');
    $(this).find('i:last-child').toggleClass('fa-minus-square-o');
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {

    // init method

    $('.module-head').on('click', _toggle);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvbW9kdWxlc19vdmVydmlldy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX3RvZ2dsZSIsImV2ZW50IiwiaWQiLCJwcm9wIiwidG9nZ2xlQ2xhc3MiLCJmaW5kIiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksa0JBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFVBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsYUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsWUFBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7Ozs7QUFLQUQsV0FBUyxFQTNCYjs7QUE2QkE7QUFDQTtBQUNBOztBQUVBLE1BQUlPLFVBQVUsU0FBVkEsT0FBVSxDQUFVQyxLQUFWLEVBQWlCO0FBQzNCLFFBQUlDLEtBQUtOLEVBQUUsSUFBRixFQUFRTyxJQUFSLENBQWEsSUFBYixDQUFUOztBQUVBUCxNQUFFLE1BQU1NLEVBQVIsRUFBWUUsV0FBWixDQUF3QixRQUF4QjtBQUNBUixNQUFFLElBQUYsRUFBUVEsV0FBUixDQUFvQixRQUFwQjs7QUFFQVIsTUFBRSxJQUFGLEVBQVFTLElBQVIsQ0FBYSxjQUFiLEVBQTZCRCxXQUE3QixDQUF5QyxrQkFBekM7QUFDQVIsTUFBRSxJQUFGLEVBQVFTLElBQVIsQ0FBYSxjQUFiLEVBQTZCRCxXQUE3QixDQUF5QyxtQkFBekM7QUFDSCxHQVJEOztBQVVBO0FBQ0E7QUFDQTs7QUFFQVgsU0FBT2EsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7O0FBRTFCOztBQUVBWCxNQUFFLGNBQUYsRUFBa0JZLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCUixPQUE5Qjs7QUFFQU87QUFDSCxHQVBEOztBQVNBLFNBQU9kLE1BQVA7QUFDSCxDQXhFTCIsImZpbGUiOiJtb2R1bGVzL21vZHVsZXNfb3ZlcnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG1vZHVsZXNfb3ZlcnZpZXcuanMgMjAxNS0wOS0yOCBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgTW9kdWxlcyBPdmVydmlldyBMaXN0aW5nIEhhbmRsZXJcbiAqXG4gKiBUaGlzIG1vZHVsZSB3aWxsIGhhbmRsZSB0aGUgbGlzdGluZyBhY3Rpb25zIG9uIG1vZHVsZSBwYWdlcyBsaWtlIHBheW1lbnQsIHNoaXBwaW5nIG9yIG9yZGVyIHRvdGFsXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L21vZHVsZXNfb3ZlcnZpZXdcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ21vZHVsZXNfb3ZlcnZpZXcnLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9tb2R1bGVzX292ZXJ2aWV3ICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF90b2dnbGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykucHJvcCgnaWQnKTtcblxuICAgICAgICAgICAgJCgnLicgKyBpZCkudG9nZ2xlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY2xvc2VkJyk7XG5cbiAgICAgICAgICAgICQodGhpcykuZmluZCgnaTpsYXN0LWNoaWxkJykudG9nZ2xlQ2xhc3MoJ2ZhLXBsdXMtc3F1YXJlLW8nKTtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnaTpsYXN0LWNoaWxkJykudG9nZ2xlQ2xhc3MoJ2ZhLW1pbnVzLXNxdWFyZS1vJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgLy8gaW5pdCBtZXRob2RcblxuICAgICAgICAgICAgJCgnLm1vZHVsZS1oZWFkJykub24oJ2NsaWNrJywgX3RvZ2dsZSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
