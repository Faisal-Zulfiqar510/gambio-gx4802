'use strict';

/* --------------------------------------------------------------
 save_bar.js 2017-11-06
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('save_bar', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES DEFINITION
  // ------------------------------------------------------------------------
  /**
   * Module Selector
   *
   * @type {jQuery}
   */

  var _this = this;

  var $this = $(this);

  /**
   * Bottom save bar
   *
   * @type {jQuery}
   */
  var $bottomSaveBar = $('.bottom-save-bar');

  /**
   * Save button
   *
   * @type {jQuery}
   */
  var $saveButton = $bottomSaveBar.find('button[name="save"]');

  /**
   * Update button
   *
   * @type {jQuery}
   */
  var $updateButton = $bottomSaveBar.find('button[name="update"]');

  /**
   * Default Options
   *
   * @type {object}
   */
  var defaults = {};

  /**
   * Final Options
   *
   * @type {object}
   */
  var options = $.extend(true, {}, defaults, data);

  /**
   * Module Object
   *
   * @type {object}
   */
  var module = {};

  // ------------------------------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  // Handle save button click
  $saveButton.on('click', function (event) {
    event.preventDefault();
    var formName = $(_this).attr('form');
    var $form = $('form#' + formName);

    $form.submit();
  });

  // Handle update button click
  $updateButton.on('click', function (event) {
    event.preventDefault();
    var formName = $(_this).attr('form');
    var $form = $('form#' + formName);
    var formURL = $form.attr('action');

    // Add another parameter, so that we stay on the same page after
    // the form was submitted
    $form.attr('action', formURL + '&update=1');

    $form.submit();
  });

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9zYXZlX2Jhci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRib3R0b21TYXZlQmFyIiwiJHNhdmVCdXR0b24iLCJmaW5kIiwiJHVwZGF0ZUJ1dHRvbiIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIm9uIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1OYW1lIiwiYXR0ciIsIiRmb3JtIiwic3VibWl0IiwiZm9ybVVSTCIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixVQUF0QixFQUFrQyxFQUFsQyxFQUVJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQVBZOztBQVlaLE1BQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLE1BQU1DLGlCQUFpQkQsRUFBRSxrQkFBRixDQUF2Qjs7QUFFQTs7Ozs7QUFLQSxNQUFNRSxjQUFjRCxlQUFlRSxJQUFmLENBQW9CLHFCQUFwQixDQUFwQjs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxnQkFBZ0JILGVBQWVFLElBQWYsQ0FBb0IsdUJBQXBCLENBQXRCOztBQUVBOzs7OztBQUtBLE1BQU1FLFdBQVcsRUFBakI7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsVUFBVU4sRUFBRU8sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QlAsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsTUFBTUQsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBSyxjQUFZTSxFQUFaLENBQWUsT0FBZixFQUF3QixVQUFDQyxLQUFELEVBQVc7QUFDL0JBLFVBQU1DLGNBQU47QUFDQSxRQUFNQyxXQUFXWCxFQUFFLEtBQUYsRUFBUVksSUFBUixDQUFhLE1BQWIsQ0FBakI7QUFDQSxRQUFNQyxRQUFRYixFQUFFLFVBQVVXLFFBQVosQ0FBZDs7QUFFQUUsVUFBTUMsTUFBTjtBQUNILEdBTkQ7O0FBUUE7QUFDQVYsZ0JBQWNJLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsVUFBQ0MsS0FBRCxFQUFXO0FBQ2pDQSxVQUFNQyxjQUFOO0FBQ0EsUUFBTUMsV0FBV1gsRUFBRSxLQUFGLEVBQVFZLElBQVIsQ0FBYSxNQUFiLENBQWpCO0FBQ0EsUUFBTUMsUUFBUWIsRUFBRSxVQUFVVyxRQUFaLENBQWQ7QUFDQSxRQUFNSSxVQUFVRixNQUFNRCxJQUFOLENBQVcsUUFBWCxDQUFoQjs7QUFFQTtBQUNBO0FBQ0FDLFVBQU1ELElBQU4sQ0FBVyxRQUFYLEVBQXFCRyxVQUFVLFdBQS9COztBQUVBRixVQUFNQyxNQUFOO0FBQ0gsR0FYRDs7QUFhQTtBQUNBO0FBQ0E7O0FBRUFqQixTQUFPbUIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJBO0FBQ0gsR0FGRDs7QUFJQSxTQUFPcEIsTUFBUDtBQUNILENBOUZMIiwiZmlsZSI6ImNvbnRlbnRfbWFuYWdlci9zYXZlX2Jhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2F2ZV9iYXIuanMgMjAxNy0xMS0wNlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnc2F2ZV9iYXInLCBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCb3R0b20gc2F2ZSBiYXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRib3R0b21TYXZlQmFyID0gJCgnLmJvdHRvbS1zYXZlLWJhcicpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIGJ1dHRvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHNhdmVCdXR0b24gPSAkYm90dG9tU2F2ZUJhci5maW5kKCdidXR0b25bbmFtZT1cInNhdmVcIl0nKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIGJ1dHRvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHVwZGF0ZUJ1dHRvbiA9ICRib3R0b21TYXZlQmFyLmZpbmQoJ2J1dHRvbltuYW1lPVwidXBkYXRlXCJdJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyBIYW5kbGUgc2F2ZSBidXR0b24gY2xpY2tcbiAgICAgICAgJHNhdmVCdXR0b24ub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgZm9ybU5hbWUgPSAkKHRoaXMpLmF0dHIoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtID0gJCgnZm9ybSMnICsgZm9ybU5hbWUpO1xuXG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSGFuZGxlIHVwZGF0ZSBidXR0b24gY2xpY2tcbiAgICAgICAgJHVwZGF0ZUJ1dHRvbi5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCBmb3JtTmFtZSA9ICQodGhpcykuYXR0cignZm9ybScpO1xuICAgICAgICAgICAgY29uc3QgJGZvcm0gPSAkKCdmb3JtIycgKyBmb3JtTmFtZSk7XG4gICAgICAgICAgICBjb25zdCBmb3JtVVJMID0gJGZvcm0uYXR0cignYWN0aW9uJyk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBhbm90aGVyIHBhcmFtZXRlciwgc28gdGhhdCB3ZSBzdGF5IG9uIHRoZSBzYW1lIHBhZ2UgYWZ0ZXJcbiAgICAgICAgICAgIC8vIHRoZSBmb3JtIHdhcyBzdWJtaXR0ZWRcbiAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIGZvcm1VUkwgKyAnJnVwZGF0ZT0xJyk7XG5cbiAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
