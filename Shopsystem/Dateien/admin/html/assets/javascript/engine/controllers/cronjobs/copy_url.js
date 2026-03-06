'use strict';

/* --------------------------------------------------------------
 copy_url.js 2018-08-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'copy_url',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
[gx.source + '/libs/info_box'],

// ------------------------------------------------------------------------
// CONTROLLER BUSINESS LOGIC
// ------------------------------------------------------------------------
function (data) {
  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  /**
   * Controller reference.
   *
   * @type {jQuery}
   */

  var $this = $(this);

  /**
   * Default options for controller,
   *
   * @type {object}
   */
  var defaults = {};

  /**
   * Final controller options.
   *
   * @type {object}
   */
  var options = $.extend(true, {}, defaults, data);

  /**
   * Module object.
   *
   * @type {{}}
   */
  var module = {};

  // ------------------------------------------------------------------------
  // PRIVATE METHODS
  // ------------------------------------------------------------------------

  var _copyButtonListener = function _copyButtonListener(event) {
    event.preventDefault();

    var cronUrlField = $('#cron-url');
    cronUrlField.focus();
    cronUrlField.select();
    document.execCommand('copy');

    // Add success message to admin info box.
    var message = jse.core.lang.translate('copy_success', 'cronjobs');
    jse.libs.info_box.addSuccessMessage(message);
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------
  module.init = function (done) {
    $('.copy-to-clipboard').on('click', _copyButtonListener);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL2NvcHlfdXJsLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NvcHlCdXR0b25MaXN0ZW5lciIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjcm9uVXJsRmllbGQiLCJmb2N1cyIsInNlbGVjdCIsImRvY3VtZW50IiwiZXhlY0NvbW1hbmQiLCJtZXNzYWdlIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsImluaXQiLCJvbiIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmO0FBQ0k7QUFDQTtBQUNBO0FBQ0EsVUFKSjs7QUFNSTtBQUNBO0FBQ0E7QUFDQSxDQUNPRixHQUFHRyxNQURWLG9CQVRKOztBQWFJO0FBQ0E7QUFDQTtBQUNBLFVBQVVDLElBQVYsRUFBZ0I7QUFDWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLE1BQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLE1BQU1DLFdBQVcsRUFBakI7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsVUFBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsTUFBTUYsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxNQUFJUSxzQkFBc0IsU0FBdEJBLG1CQUFzQixDQUFVQyxLQUFWLEVBQWlCO0FBQ3ZDQSxVQUFNQyxjQUFOOztBQUVBLFFBQUlDLGVBQWVQLEVBQUUsV0FBRixDQUFuQjtBQUNBTyxpQkFBYUMsS0FBYjtBQUNBRCxpQkFBYUUsTUFBYjtBQUNBQyxhQUFTQyxXQUFULENBQXFCLE1BQXJCOztBQUVBO0FBQ0EsUUFBTUMsVUFBVUMsSUFBSUMsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsY0FBeEIsRUFBd0MsVUFBeEMsQ0FBaEI7QUFDQUgsUUFBSUksSUFBSixDQUFTQyxRQUFULENBQWtCQyxpQkFBbEIsQ0FBb0NQLE9BQXBDO0FBQ0gsR0FYRDs7QUFhQTtBQUNBO0FBQ0E7QUFDQWhCLFNBQU93QixJQUFQLEdBQWMsZ0JBQVE7QUFDbEJwQixNQUFFLG9CQUFGLEVBQXdCcUIsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0NqQixtQkFBcEM7O0FBRUFrQjtBQUNILEdBSkQ7O0FBTUEsU0FBTzFCLE1BQVA7QUFDSCxDQTlFTCIsImZpbGUiOiJjcm9uam9icy9jb3B5X3VybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY29weV91cmwuanMgMjAxOC0wOC0yN1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTggR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIE5BTUVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAnY29weV91cmwnLFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ09OVFJPTExFUiBMSUJSQVJJRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBbXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBcbiAgICBdLFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ09OVFJPTExFUiBCVVNJTkVTUyBMT0dJQ1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250cm9sbGVyIHJlZmVyZW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbGV0IF9jb3B5QnV0dG9uTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGxldCBjcm9uVXJsRmllbGQgPSAkKCcjY3Jvbi11cmwnKTtcbiAgICAgICAgICAgIGNyb25VcmxGaWVsZC5mb2N1cygpO1xuICAgICAgICAgICAgY3JvblVybEZpZWxkLnNlbGVjdCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcblxuICAgICAgICAgICAgLy8gQWRkIHN1Y2Nlc3MgbWVzc2FnZSB0byBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY29weV9zdWNjZXNzJywgJ2Nyb25qb2JzJyk7XG4gICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgICQoJy5jb3B5LXRvLWNsaXBib2FyZCcpLm9uKCdjbGljaycsIF9jb3B5QnV0dG9uTGlzdGVuZXIpXG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTsiXX0=
