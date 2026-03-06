'use strict';

/* --------------------------------------------------------------
 datatable_fixed_row_actions.js 2016-07-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable fixed table row actions that do not hide on mouse leave.
 *
 * By default the actions will be hidden when on mouse leave event. This module will make sure that they
 * stay visible.
 *
 * @module Admin/Extensions/datatable_fixed_row_actions
 */
gx.extensions.module('datatable_fixed_row_actions', [], function (data) {

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
  // FUNCTIONS
  // ------------------------------------------------------------------------

  /**
   * On Table Row Mouse Leave
   *
   * The dropdown must remain visible if it was open when the cursor leaves the table row.
   */
  function _onTableRowMouseLeave() {
    var visibility = $(this).find('.btn-group.dropdown').hasClass('open') ? 'visible' : '';
    $(this).find('.actions .visible-on-hover').css('visibility', visibility);
  }

  /**
   * On Bootstrap Dropdown Menu Toggle
   *
   * Remove any custom visibility set by this module whenever the user interacts with a dropdown toggle.
   */
  function _onBootstrapDropdownToggle() {
    $this.find('.actions .visible-on-hover').css('visibility', '');
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $this.on('mouseleave', 'tr', _onTableRowMouseLeave).on('shown.bs.dropdown hidden.bs.dropdown', _onBootstrapDropdownToggle);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9maXhlZF9yb3dfYWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiX29uVGFibGVSb3dNb3VzZUxlYXZlIiwidmlzaWJpbGl0eSIsImZpbmQiLCJoYXNDbGFzcyIsImNzcyIsIl9vbkJvb3RzdHJhcERyb3Bkb3duVG9nZ2xlIiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7OztBQVFBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FBcUIsNkJBQXJCLEVBQW9ELEVBQXBELEVBQXdELFVBQVVDLElBQVYsRUFBZ0I7O0FBRXBFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUgsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxXQUFTSSxxQkFBVCxHQUFpQztBQUM3QixRQUFNQyxhQUFhRixFQUFFLElBQUYsRUFBUUcsSUFBUixDQUFhLHFCQUFiLEVBQW9DQyxRQUFwQyxDQUE2QyxNQUE3QyxJQUF1RCxTQUF2RCxHQUFtRSxFQUF0RjtBQUNBSixNQUFFLElBQUYsRUFBUUcsSUFBUixDQUFhLDRCQUFiLEVBQTJDRSxHQUEzQyxDQUErQyxZQUEvQyxFQUE2REgsVUFBN0Q7QUFDSDs7QUFFRDs7Ozs7QUFLQSxXQUFTSSwwQkFBVCxHQUFzQztBQUNsQ1AsVUFBTUksSUFBTixDQUFXLDRCQUFYLEVBQXlDRSxHQUF6QyxDQUE2QyxZQUE3QyxFQUEyRCxFQUEzRDtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQVIsU0FBT1UsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJULFVBQ0tVLEVBREwsQ0FDUSxZQURSLEVBQ3NCLElBRHRCLEVBQzRCUixxQkFENUIsRUFFS1EsRUFGTCxDQUVRLHNDQUZSLEVBRWdESCwwQkFGaEQ7O0FBSUFFO0FBQ0gsR0FORDs7QUFRQSxTQUFPWCxNQUFQO0FBRUgsQ0EzREQiLCJmaWxlIjoiZGF0YXRhYmxlX2ZpeGVkX3Jvd19hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBkYXRhdGFibGVfZml4ZWRfcm93X2FjdGlvbnMuanMgMjAxNi0wNy0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRW5hYmxlIGZpeGVkIHRhYmxlIHJvdyBhY3Rpb25zIHRoYXQgZG8gbm90IGhpZGUgb24gbW91c2UgbGVhdmUuXG4gKlxuICogQnkgZGVmYXVsdCB0aGUgYWN0aW9ucyB3aWxsIGJlIGhpZGRlbiB3aGVuIG9uIG1vdXNlIGxlYXZlIGV2ZW50LiBUaGlzIG1vZHVsZSB3aWxsIG1ha2Ugc3VyZSB0aGF0IHRoZXlcbiAqIHN0YXkgdmlzaWJsZS5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0V4dGVuc2lvbnMvZGF0YXRhYmxlX2ZpeGVkX3Jvd19hY3Rpb25zXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKCdkYXRhdGFibGVfZml4ZWRfcm93X2FjdGlvbnMnLCBbXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogT24gVGFibGUgUm93IE1vdXNlIExlYXZlXG4gICAgICpcbiAgICAgKiBUaGUgZHJvcGRvd24gbXVzdCByZW1haW4gdmlzaWJsZSBpZiBpdCB3YXMgb3BlbiB3aGVuIHRoZSBjdXJzb3IgbGVhdmVzIHRoZSB0YWJsZSByb3cuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uVGFibGVSb3dNb3VzZUxlYXZlKCkge1xuICAgICAgICBjb25zdCB2aXNpYmlsaXR5ID0gJCh0aGlzKS5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJykuaGFzQ2xhc3MoJ29wZW4nKSA/ICd2aXNpYmxlJyA6ICcnO1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5hY3Rpb25zIC52aXNpYmxlLW9uLWhvdmVyJykuY3NzKCd2aXNpYmlsaXR5JywgdmlzaWJpbGl0eSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gQm9vdHN0cmFwIERyb3Bkb3duIE1lbnUgVG9nZ2xlXG4gICAgICpcbiAgICAgKiBSZW1vdmUgYW55IGN1c3RvbSB2aXNpYmlsaXR5IHNldCBieSB0aGlzIG1vZHVsZSB3aGVuZXZlciB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aCBhIGRyb3Bkb3duIHRvZ2dsZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25Cb290c3RyYXBEcm9wZG93blRvZ2dsZSgpIHtcbiAgICAgICAgJHRoaXMuZmluZCgnLmFjdGlvbnMgLnZpc2libGUtb24taG92ZXInKS5jc3MoJ3Zpc2liaWxpdHknLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJHRoaXNcbiAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsICd0cicsIF9vblRhYmxlUm93TW91c2VMZWF2ZSlcbiAgICAgICAgICAgIC5vbignc2hvd24uYnMuZHJvcGRvd24gaGlkZGVuLmJzLmRyb3Bkb3duJywgX29uQm9vdHN0cmFwRHJvcGRvd25Ub2dnbGUpO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcblxufSk7Il19
