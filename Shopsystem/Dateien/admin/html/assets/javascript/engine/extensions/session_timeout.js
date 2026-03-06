'use strict';

/* --------------------------------------------------------------
 session_timeout.js 2021-08-31
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.extensions.module('session_timeout', [], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        url: jse.core.config.get('appUrl') + '/admin/session/keep-alive',
        timeout: 1000
    },


    /**
     * Final Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Is firing by <div data-gx-extension="session_timeout" hidden></div>
     *
     * @see admin/html/content/admin_menu.html
     * @private
     */
    var _initializeTimeout = function _initializeTimeout() {
        $.getJSON(options.url).done(function (response) {
            if (!response.data.keepAlive) {
                return;
            }

            options.timeout = response.data.timeout;
            setTimeout(_initializeTimeout, options.timeout);
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(document).on('JSENGINE_INIT_FINISHED', _initializeTimeout);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlc3Npb25fdGltZW91dC5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJ1cmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwidGltZW91dCIsIm9wdGlvbnMiLCJleHRlbmQiLCJfaW5pdGlhbGl6ZVRpbWVvdXQiLCJnZXRKU09OIiwiZG9uZSIsInJlc3BvbnNlIiwia2VlcEFsaXZlIiwic2V0VGltZW91dCIsImluaXQiLCJkb2N1bWVudCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBV0FBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLGlCQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVztBQUNQQyxhQUFLQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLDJCQUQ5QjtBQUVQQyxpQkFBUztBQUZGLEtBYmY7OztBQWtCSTs7Ozs7QUFLQUMsY0FBVVIsRUFBRVMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CUixRQUFuQixFQUE2QkgsSUFBN0IsQ0F2QmQ7OztBQXlCSTs7Ozs7QUFLQUQsYUFBUyxFQTlCYjs7QUFnQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQSxRQUFJYSxxQkFBcUIsU0FBckJBLGtCQUFxQixHQUFZO0FBQ2pDVixVQUFFVyxPQUFGLENBQVVILFFBQVFOLEdBQWxCLEVBQ0tVLElBREwsQ0FDVSxVQUFVQyxRQUFWLEVBQW9CO0FBQ3RCLGdCQUFJLENBQUNBLFNBQVNmLElBQVQsQ0FBY2dCLFNBQW5CLEVBQThCO0FBQzFCO0FBQ0g7O0FBRUROLG9CQUFRRCxPQUFSLEdBQWtCTSxTQUFTZixJQUFULENBQWNTLE9BQWhDO0FBQ0FRLHVCQUFXTCxrQkFBWCxFQUErQkYsUUFBUUQsT0FBdkM7QUFDSCxTQVJMO0FBU0gsS0FWRDs7QUFZQTtBQUNBO0FBQ0E7O0FBRUFWLFdBQU9tQixJQUFQLEdBQWMsVUFBVUosSUFBVixFQUFnQjtBQUMxQlosVUFBRWlCLFFBQUYsRUFBWUMsRUFBWixDQUFlLHdCQUFmLEVBQXlDUixrQkFBekM7O0FBRUFFO0FBQ0gsS0FKRDs7QUFNQSxXQUFPZixNQUFQO0FBQ0gsQ0E5RUwiLCJmaWxlIjoic2Vzc2lvbl90aW1lb3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzZXNzaW9uX3RpbWVvdXQuanMgMjAyMS0wOC0zMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjEgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cblxuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ3Nlc3Npb25fdGltZW91dCcsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbGV0XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9zZXNzaW9uL2tlZXAtYWxpdmUnLFxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDEwMDAsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSXMgZmlyaW5nIGJ5IDxkaXYgZGF0YS1neC1leHRlbnNpb249XCJzZXNzaW9uX3RpbWVvdXRcIiBoaWRkZW4+PC9kaXY+XG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWUgYWRtaW4vaHRtbC9jb250ZW50L2FkbWluX21lbnUuaHRtbFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9pbml0aWFsaXplVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQuZ2V0SlNPTihvcHRpb25zLnVybClcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5kYXRhLmtlZXBBbGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50aW1lb3V0ID0gcmVzcG9uc2UuZGF0YS50aW1lb3V0O1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KF9pbml0aWFsaXplVGltZW91dCwgb3B0aW9ucy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCBfaW5pdGlhbGl6ZVRpbWVvdXQpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTsiXX0=
