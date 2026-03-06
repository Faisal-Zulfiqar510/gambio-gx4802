'use strict';

/* --------------------------------------------------------------
 update_stock.js 2018-05-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'update_stock',

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

  // ------------------------------------------------------------------------
  // EVENT HANDLER
  // ------------------------------------------------------------------------

  /**
   * Click handler for the create role button.
   *
   * @param {object} event jQuery event object contains information of the event.
   */
  function _updateStockValue() {
    $('input[name="update_stock"]').not($this).val($this.is(':checked') ? '1' : '0');
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------
  module.init = function (done) {
    $this.on('change', _updateStockValue);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVyc19lZGl0L3VwZGF0ZV9zdG9jay5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl91cGRhdGVTdG9ja1ZhbHVlIiwibm90IiwidmFsIiwiaXMiLCJpbml0Iiwib24iLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZjtBQUNJO0FBQ0E7QUFDQTtBQUNBLGNBSko7O0FBTUk7QUFDQTtBQUNBO0FBQ0EsRUFUSjs7QUFXSTtBQUNBO0FBQ0E7QUFDQSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxNQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLE1BQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLE1BQU1ELFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFdBQVNPLGlCQUFULEdBQTZCO0FBQ3pCSixNQUFFLDRCQUFGLEVBQWdDSyxHQUFoQyxDQUFvQ04sS0FBcEMsRUFBMkNPLEdBQTNDLENBQStDUCxNQUFNUSxFQUFOLENBQVMsVUFBVCxJQUF1QixHQUF2QixHQUE2QixHQUE1RTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBVixTQUFPVyxJQUFQLEdBQWMsZ0JBQVE7QUFDbEJULFVBQU1VLEVBQU4sQ0FBUyxRQUFULEVBQW1CTCxpQkFBbkI7O0FBRUFNO0FBQ0gsR0FKRDs7QUFNQSxTQUFPYixNQUFQO0FBQ0gsQ0E1RUwiLCJmaWxlIjoib3JkZXJzX2VkaXQvdXBkYXRlX3N0b2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB1cGRhdGVfc3RvY2suanMgMjAxOC0wNS0yOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIE5BTUVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAndXBkYXRlX3N0b2NrJyxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgTElCUkFSSUVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgW10sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIEJVU0lORVNTIExPR0lDXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnRyb2xsZXIgcmVmZXJlbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IG9wdGlvbnMgZm9yIGNvbnRyb2xsZXIsXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBjb250cm9sbGVyIG9wdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge3t9fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgdGhlIGNyZWF0ZSByb2xlIGJ1dHRvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZVN0b2NrVmFsdWUoKSB7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwidXBkYXRlX3N0b2NrXCJdJykubm90KCR0aGlzKS52YWwoJHRoaXMuaXMoJzpjaGVja2VkJykgPyAnMScgOiAnMCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgJHRoaXMub24oJ2NoYW5nZScsIF91cGRhdGVTdG9ja1ZhbHVlKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pOyJdfQ==
