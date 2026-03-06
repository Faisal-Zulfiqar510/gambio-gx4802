'use strict';

/* --------------------------------------------------------------
 initialize.js 2018-04-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Admin Layout Initialization Controller
 *
 * This controller will handle the initialization of the admin pages. Bind this controller
 * in the body element of the page.
 */
gx.controllers.module('initialize', ['hooks'], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  /**
   * Module Selector
   *
   * @type {jQuery}
   */

  var $this = $(this);

  /**
   * Module Instance
   *
   * @type {Object}
   */
  var module = {};

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $('body').on('JSENGINE_INIT_FINISHED', function () {
      $this.fadeIn(200, function () {
        $this.removeClass('page-loading');
      });
    });

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9pbml0aWFsaXplLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiaW5pdCIsImRvbmUiLCJvbiIsImZhZGVJbiIsInJlbW92ZUNsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7OztBQU1BQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsWUFBdEIsRUFBb0MsQ0FBQyxPQUFELENBQXBDLEVBQStDLFVBQVVDLElBQVYsRUFBZ0I7O0FBRTNEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUgsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQUEsU0FBT0ksSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJGLE1BQUUsTUFBRixFQUFVRyxFQUFWLENBQWEsd0JBQWIsRUFBdUMsWUFBTTtBQUN6Q0osWUFBTUssTUFBTixDQUFhLEdBQWIsRUFBa0IsWUFBTTtBQUNwQkwsY0FBTU0sV0FBTixDQUFrQixjQUFsQjtBQUNILE9BRkQ7QUFHSCxLQUpEOztBQU1BSDtBQUNILEdBUkQ7O0FBVUEsU0FBT0wsTUFBUDtBQUVILENBdENEIiwiZmlsZSI6ImxheW91dHMvbWFpbi9pbml0aWFsaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbml0aWFsaXplLmpzIDIwMTgtMDQtMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEFkbWluIExheW91dCBJbml0aWFsaXphdGlvbiBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIHdpbGwgaGFuZGxlIHRoZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgYWRtaW4gcGFnZXMuIEJpbmQgdGhpcyBjb250cm9sbGVyXG4gKiBpbiB0aGUgYm9keSBlbGVtZW50IG9mIHRoZSBwYWdlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ2luaXRpYWxpemUnLCBbJ2hvb2tzJ10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkKCdib2R5Jykub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkdGhpcy5mYWRlSW4oMjAwLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ3BhZ2UtbG9hZGluZycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcblxufSk7Il19
