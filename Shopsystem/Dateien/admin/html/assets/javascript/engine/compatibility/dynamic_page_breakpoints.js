'use strict';

/* --------------------------------------------------------------
 dynamic_page_breakpoints.js 2015-09-24 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Add the breakpoint class to elements dynamically.
 *
 * In some pages it is not possible to add the correct breakpoints because some content might
 * be loaded dynamically or it might change position through compatibility JS (e.g. message_stack_container).
 * Use this module to set the breakpoint after the page is loaded.
 *
 * ```html
 * <div data-gx-compatibility="dynamic_page_breakpoints"
 *         data-dynamic_page_breakpoints-small='.class-one .class-two'
 *         data-dynamic_pate_breakpoints-large='.class-three #id-one'>
 *    <!-- HTML CONTENT -->
 * </div>
 * ```
 *
 * @module Compatibility/dynamic_page_breakpoints
 */
gx.compatibility.module('dynamic_page_breakpoints', [],

/**  @lends module:Compatibility/dynamic_page_breakpoints */

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
     * Callbacks for checking common patterns.
     *
     * @var {array}
     */
    fixes = [],


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        lifetime: 30000, // wait half minute before stopping the element search
        interval: 300
    },


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
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------

    var _watch = function _watch(selector, breakpointClass) {
        var startTimestamp = Date.now;

        var intv = setInterval(function () {
            if ($(selector).length > 0) {
                $(selector).addClass(breakpointClass);
                clearInterval(intv);
            }

            if (Date.now - startTimestamp > options.lifetime) {
                clearInterval(intv);
            }
        }, options.interval);
    };

    // ------------------------------------------------------------------------
    // INITIALIZE MODULE
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _watch(options.small, 'breakpoint-small');
        _watch(options.large, 'breakpoint-large');
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImR5bmFtaWNfcGFnZV9icmVha3BvaW50cy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZml4ZXMiLCJkZWZhdWx0cyIsImxpZmV0aW1lIiwiaW50ZXJ2YWwiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX3dhdGNoIiwic2VsZWN0b3IiLCJicmVha3BvaW50Q2xhc3MiLCJzdGFydFRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJpbnR2Iiwic2V0SW50ZXJ2YWwiLCJsZW5ndGgiLCJhZGRDbGFzcyIsImNsZWFySW50ZXJ2YWwiLCJpbml0IiwiZG9uZSIsInNtYWxsIiwibGFyZ2UiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkFBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksMEJBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsWUFBUSxFQWJaOzs7QUFlSTs7Ozs7QUFLQUMsZUFBVztBQUNQQyxrQkFBVSxLQURILEVBQ1U7QUFDakJDLGtCQUFVO0FBRkgsS0FwQmY7OztBQXlCSTs7Ozs7QUFLQUMsY0FBVUwsRUFBRU0sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSixRQUFuQixFQUE2QkosSUFBN0IsQ0E5QmQ7OztBQWdDSTs7Ozs7QUFLQUQsYUFBUyxFQXJDYjs7QUF1Q0E7QUFDQTtBQUNBOztBQUVBLFFBQUlVLFNBQVMsU0FBVEEsTUFBUyxDQUFVQyxRQUFWLEVBQW9CQyxlQUFwQixFQUFxQztBQUM5QyxZQUFJQyxpQkFBaUJDLEtBQUtDLEdBQTFCOztBQUVBLFlBQUlDLE9BQU9DLFlBQVksWUFBWTtBQUMvQixnQkFBSWQsRUFBRVEsUUFBRixFQUFZTyxNQUFaLEdBQXFCLENBQXpCLEVBQTRCO0FBQ3hCZixrQkFBRVEsUUFBRixFQUFZUSxRQUFaLENBQXFCUCxlQUFyQjtBQUNBUSw4QkFBY0osSUFBZDtBQUNIOztBQUVELGdCQUFJRixLQUFLQyxHQUFMLEdBQVdGLGNBQVgsR0FBNEJMLFFBQVFGLFFBQXhDLEVBQWtEO0FBQzlDYyw4QkFBY0osSUFBZDtBQUNIO0FBQ0osU0FUVSxFQVNSUixRQUFRRCxRQVRBLENBQVg7QUFVSCxLQWJEOztBQWVBO0FBQ0E7QUFDQTs7QUFFQVAsV0FBT3FCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCWixlQUFPRixRQUFRZSxLQUFmLEVBQXNCLGtCQUF0QjtBQUNBYixlQUFPRixRQUFRZ0IsS0FBZixFQUFzQixrQkFBdEI7QUFDQUY7QUFDSCxLQUpEOztBQU1BLFdBQU90QixNQUFQO0FBQ0gsQ0FwRkwiLCJmaWxlIjoiZHluYW1pY19wYWdlX2JyZWFrcG9pbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBkeW5hbWljX3BhZ2VfYnJlYWtwb2ludHMuanMgMjAxNS0wOS0yNCBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQWRkIHRoZSBicmVha3BvaW50IGNsYXNzIHRvIGVsZW1lbnRzIGR5bmFtaWNhbGx5LlxuICpcbiAqIEluIHNvbWUgcGFnZXMgaXQgaXMgbm90IHBvc3NpYmxlIHRvIGFkZCB0aGUgY29ycmVjdCBicmVha3BvaW50cyBiZWNhdXNlIHNvbWUgY29udGVudCBtaWdodFxuICogYmUgbG9hZGVkIGR5bmFtaWNhbGx5IG9yIGl0IG1pZ2h0IGNoYW5nZSBwb3NpdGlvbiB0aHJvdWdoIGNvbXBhdGliaWxpdHkgSlMgKGUuZy4gbWVzc2FnZV9zdGFja19jb250YWluZXIpLlxuICogVXNlIHRoaXMgbW9kdWxlIHRvIHNldCB0aGUgYnJlYWtwb2ludCBhZnRlciB0aGUgcGFnZSBpcyBsb2FkZWQuXG4gKlxuICogYGBgaHRtbFxuICogPGRpdiBkYXRhLWd4LWNvbXBhdGliaWxpdHk9XCJkeW5hbWljX3BhZ2VfYnJlYWtwb2ludHNcIlxuICogICAgICAgICBkYXRhLWR5bmFtaWNfcGFnZV9icmVha3BvaW50cy1zbWFsbD0nLmNsYXNzLW9uZSAuY2xhc3MtdHdvJ1xuICogICAgICAgICBkYXRhLWR5bmFtaWNfcGF0ZV9icmVha3BvaW50cy1sYXJnZT0nLmNsYXNzLXRocmVlICNpZC1vbmUnPlxuICogICAgPCEtLSBIVE1MIENPTlRFTlQgLS0+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9keW5hbWljX3BhZ2VfYnJlYWtwb2ludHNcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ2R5bmFtaWNfcGFnZV9icmVha3BvaW50cycsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L2R5bmFtaWNfcGFnZV9icmVha3BvaW50cyAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDYWxsYmFja3MgZm9yIGNoZWNraW5nIGNvbW1vbiBwYXR0ZXJucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHthcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZml4ZXMgPSBbXSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBsaWZldGltZTogMzAwMDAsIC8vIHdhaXQgaGFsZiBtaW51dGUgYmVmb3JlIHN0b3BwaW5nIHRoZSBlbGVtZW50IHNlYXJjaFxuICAgICAgICAgICAgICAgIGludGVydmFsOiAzMDBcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX3dhdGNoID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBicmVha3BvaW50Q2xhc3MpIHtcbiAgICAgICAgICAgIHZhciBzdGFydFRpbWVzdGFtcCA9IERhdGUubm93O1xuXG4gICAgICAgICAgICB2YXIgaW50diA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJChzZWxlY3RvcikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHNlbGVjdG9yKS5hZGRDbGFzcyhicmVha3BvaW50Q2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludHYpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChEYXRlLm5vdyAtIHN0YXJ0VGltZXN0YW1wID4gb3B0aW9ucy5saWZldGltZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG9wdGlvbnMuaW50ZXJ2YWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpFIE1PRFVMRVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBfd2F0Y2gob3B0aW9ucy5zbWFsbCwgJ2JyZWFrcG9pbnQtc21hbGwnKTtcbiAgICAgICAgICAgIF93YXRjaChvcHRpb25zLmxhcmdlLCAnYnJlYWtwb2ludC1sYXJnZScpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
