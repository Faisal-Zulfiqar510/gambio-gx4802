'use strict';

/* --------------------------------------------------------------
 sortable.js 2016-09-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Sortable Extension
 *
 * Uses jQuery UI's sortable plugin to realize sortable functionality. You can pass sortable options via
 * data attributes.
 *
 * ### Options
 *
 * **URL | data-sortable-handle | String | Optional**
 *
 * The destination URL to be used after the user clicks on the element.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-extension="sortable" data-sortable-handle=".drag-handle">
 *   <img src="handle.jpg" class="drag-handle" />
 * </div>
 * ```
 *
 * This extension is based in the jQuery UI sortable interaction utility:
 * {@link http://api.jqueryui.com/sortable}
 *
 * @module Admin/Extensions/sortable
 * @requires jQueryUI
 */
gx.extensions.module('sortable', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    // Widget element.

    var $this = $(this);

    // Default widget options (Sortable options).
    var defaults = {
        revert: true,
        containment: 'parent'
    };

    // Widget options.
    var options = $.extend(true, {}, defaults, data);

    // Module instance.
    var module = {};

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        // Enable sortable.
        $this.sortable(options);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvcnRhYmxlLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsInJldmVydCIsImNvbnRhaW5tZW50Iiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJzb3J0YWJsZSIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLFVBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLCtDQUVPRCxJQUFJQyxNQUZYLDZDQUhKLEVBUUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBQ0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7QUFDQSxRQUFNQyxXQUFXO0FBQ2JDLGdCQUFRLElBREs7QUFFYkMscUJBQWE7QUFGQSxLQUFqQjs7QUFLQTtBQUNBLFFBQU1DLFVBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkosUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBO0FBQ0EsUUFBTUgsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FBLFdBQU9XLElBQVAsR0FBYyxnQkFBUTtBQUNsQjtBQUNBUCxjQUFNUSxRQUFOLENBQWVILE9BQWY7O0FBRUE7QUFDQUk7QUFDSCxLQU5EOztBQVFBLFdBQU9iLE1BQVA7QUFDSCxDQS9DTCIsImZpbGUiOiJzb3J0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc29ydGFibGUuanMgMjAxNi0wOS0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgU29ydGFibGUgRXh0ZW5zaW9uXG4gKlxuICogVXNlcyBqUXVlcnkgVUkncyBzb3J0YWJsZSBwbHVnaW4gdG8gcmVhbGl6ZSBzb3J0YWJsZSBmdW5jdGlvbmFsaXR5LiBZb3UgY2FuIHBhc3Mgc29ydGFibGUgb3B0aW9ucyB2aWFcbiAqIGRhdGEgYXR0cmlidXRlcy5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqVVJMIHwgZGF0YS1zb3J0YWJsZS1oYW5kbGUgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIGRlc3RpbmF0aW9uIFVSTCB0byBiZSB1c2VkIGFmdGVyIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgZWxlbWVudC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC1leHRlbnNpb249XCJzb3J0YWJsZVwiIGRhdGEtc29ydGFibGUtaGFuZGxlPVwiLmRyYWctaGFuZGxlXCI+XG4gKiAgIDxpbWcgc3JjPVwiaGFuZGxlLmpwZ1wiIGNsYXNzPVwiZHJhZy1oYW5kbGVcIiAvPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBUaGlzIGV4dGVuc2lvbiBpcyBiYXNlZCBpbiB0aGUgalF1ZXJ5IFVJIHNvcnRhYmxlIGludGVyYWN0aW9uIHV0aWxpdHk6XG4gKiB7QGxpbmsgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vc29ydGFibGV9XG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL3NvcnRhYmxlXG4gKiBAcmVxdWlyZXMgalF1ZXJ5VUlcbiAqL1xuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ3NvcnRhYmxlJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uanNgLFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIFdpZGdldCBlbGVtZW50LlxuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLy8gRGVmYXVsdCB3aWRnZXQgb3B0aW9ucyAoU29ydGFibGUgb3B0aW9ucykuXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgcmV2ZXJ0OiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbm1lbnQ6ICdwYXJlbnQnXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gV2lkZ2V0IG9wdGlvbnMuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8vIE1vZHVsZSBpbnN0YW5jZS5cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBFbmFibGUgc29ydGFibGUuXG4gICAgICAgICAgICAkdGhpcy5zb3J0YWJsZShvcHRpb25zKTtcblxuICAgICAgICAgICAgLy8gRmluaXNoIGluaXRpYWxpemF0aW9uLlxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
