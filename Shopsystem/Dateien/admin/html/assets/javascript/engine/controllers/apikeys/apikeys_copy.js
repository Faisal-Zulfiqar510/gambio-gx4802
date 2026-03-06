'use strict';

/* --------------------------------------------------------------
 apikeys_copy.js 2018-08-09
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
'apikeys_copy',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
[],

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
    var tokenId = this.dataset.tokenid;
    var tokenArea = $('textarea#token_' + tokenId);
    tokenArea.focus();
    tokenArea.select();
    document.execCommand('copy');
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------
  module.init = function (done) {
    $('.copytoken').on('click', _copyButtonListener);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaWtleXMvYXBpa2V5c19jb3B5LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NvcHlCdXR0b25MaXN0ZW5lciIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJ0b2tlbklkIiwiZGF0YXNldCIsInRva2VuaWQiLCJ0b2tlbkFyZWEiLCJmb2N1cyIsInNlbGVjdCIsImRvY3VtZW50IiwiZXhlY0NvbW1hbmQiLCJpbml0Iiwib24iLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZjtBQUNJO0FBQ0E7QUFDQTtBQUNBLGNBSko7O0FBTUk7QUFDQTtBQUNBO0FBQ0EsRUFUSjs7QUFXSTtBQUNBO0FBQ0E7QUFDQSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxNQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLE1BQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLE1BQU1ELFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsTUFBSU8sc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBVUMsS0FBVixFQUFpQjtBQUN2Q0EsVUFBTUMsY0FBTjtBQUNBLFFBQUlDLFVBQVUsS0FBS0MsT0FBTCxDQUFhQyxPQUEzQjtBQUNBLFFBQUlDLFlBQVlWLEVBQUUsb0JBQW9CTyxPQUF0QixDQUFoQjtBQUNBRyxjQUFVQyxLQUFWO0FBQ0FELGNBQVVFLE1BQVY7QUFDQUMsYUFBU0MsV0FBVCxDQUFxQixNQUFyQjtBQUNILEdBUEQ7O0FBU0E7QUFDQTtBQUNBO0FBQ0FqQixTQUFPa0IsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCZixNQUFFLFlBQUYsRUFBZ0JnQixFQUFoQixDQUFtQixPQUFuQixFQUE0QlosbUJBQTVCOztBQUVBYTtBQUNILEdBSkQ7O0FBTUEsU0FBT3BCLE1BQVA7QUFDSCxDQXhFTCIsImZpbGUiOiJhcGlrZXlzL2FwaWtleXNfY29weS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYXBpa2V5c19jb3B5LmpzIDIwMTgtMDgtMDlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ09OVFJPTExFUiBOQU1FXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgJ2FwaWtleXNfY29weScsXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIExJQlJBUklFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFtdLFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ09OVFJPTExFUiBCVVNJTkVTUyBMT0dJQ1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250cm9sbGVyIHJlZmVyZW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbGV0IF9jb3B5QnV0dG9uTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgdG9rZW5JZCA9IHRoaXMuZGF0YXNldC50b2tlbmlkO1xuICAgICAgICAgICAgbGV0IHRva2VuQXJlYSA9ICQoJ3RleHRhcmVhI3Rva2VuXycgKyB0b2tlbklkKTtcbiAgICAgICAgICAgIHRva2VuQXJlYS5mb2N1cygpO1xuICAgICAgICAgICAgdG9rZW5BcmVhLnNlbGVjdCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgICQoJy5jb3B5dG9rZW4nKS5vbignY2xpY2snLCBfY29weUJ1dHRvbkxpc3RlbmVyKVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7Il19
