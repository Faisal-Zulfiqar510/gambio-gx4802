'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------------------------------------------------------
 admin_favicon_fix.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Admin Section Favicon - JS Fix
 *
 * Many pages in the admin section are missing the favicon.ico file because they do not specify this
 * directive in the <head> tag. The following code (pure JavaScript) will fix the issue. This solution
 * will not work in IE9 see: http://stackoverflow.com/a/13388728.
 *
 * This module requires two attributes to be provided as in the following example:
 *
 * ```html
 * <div class="page-wrapper-element"
 *      data-gx-compatibility="admin_favicon_fix"
 *      data-admin_favicon_fix-status="enabled"
 *      data-admin_favicon_fix-filename="favicon.ico"> ... </div>
 * ```
 *
 * @module Compatibility/admin_favicon_fix
 */
gx.compatibility.module('admin_favicon_fix', [],

/** @lends module:Compatibility/admin_favicon_fix */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DECLARATION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Element Selector
     *
     * @var {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        'filename': '/admin/html/assets/images/gx-admin/favicon-gambio-de.ico'
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
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        try {
            if (!document.querySelector('head link[rel="shortcut icon"]') && options.status === 'enabled') {
                var favicon = document.createElement('link');
                favicon.rel = 'shortcut icon';
                favicon.href = jse.core.config.get('appUrl') + options.filename;
                document.getElementsByTagName('head')[0].appendChild(favicon);
            }
        } catch (exception) {
            if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object') {
                console.log('Failed to create favicon tag in document <head> element. Exception: ' + exception);
            }
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluX2Zhdmljb25fZml4LmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJpbml0IiwiZG9uZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInN0YXR1cyIsImZhdmljb24iLCJjcmVhdGVFbGVtZW50IiwicmVsIiwiaHJlZiIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJmaWxlbmFtZSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXBwZW5kQ2hpbGQiLCJleGNlcHRpb24iLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLG1CQURKLEVBR0ksRUFISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUCxvQkFBWTtBQURMLEtBYmY7OztBQWlCSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0F0QmQ7OztBQXdCSTs7Ozs7QUFLQUQsYUFBUyxFQTdCYjs7QUErQkE7QUFDQTtBQUNBOztBQUVBQSxXQUFPTyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQixZQUFJO0FBQ0EsZ0JBQUksQ0FBQ0MsU0FBU0MsYUFBVCxDQUF1QixnQ0FBdkIsQ0FBRCxJQUE2REwsUUFBUU0sTUFBUixLQUFtQixTQUFwRixFQUErRjtBQUMzRixvQkFBSUMsVUFBVUgsU0FBU0ksYUFBVCxDQUF1QixNQUF2QixDQUFkO0FBQ0FELHdCQUFRRSxHQUFSLEdBQWMsZUFBZDtBQUNBRix3QkFBUUcsSUFBUixHQUFlQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDZCxRQUFRZSxRQUF2RDtBQUNBWCx5QkFBU1ksb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUNDLFdBQXpDLENBQXFEVixPQUFyRDtBQUNIO0FBQ0osU0FQRCxDQU9FLE9BQU9XLFNBQVAsRUFBa0I7QUFDaEIsZ0JBQUksUUFBT0MsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUF2QixFQUFpQztBQUM3QkEsd0JBQVFDLEdBQVIsQ0FBWSx5RUFDUkYsU0FESjtBQUVIO0FBQ0o7O0FBRURmO0FBQ0gsS0FoQkQ7O0FBa0JBLFdBQU9SLE1BQVA7QUFDSCxDQXJFTCIsImZpbGUiOiJhZG1pbl9mYXZpY29uX2ZpeC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWRtaW5fZmF2aWNvbl9maXguanMgMjAxNS0xMC0xNSBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQWRtaW4gU2VjdGlvbiBGYXZpY29uIC0gSlMgRml4XG4gKlxuICogTWFueSBwYWdlcyBpbiB0aGUgYWRtaW4gc2VjdGlvbiBhcmUgbWlzc2luZyB0aGUgZmF2aWNvbi5pY28gZmlsZSBiZWNhdXNlIHRoZXkgZG8gbm90IHNwZWNpZnkgdGhpc1xuICogZGlyZWN0aXZlIGluIHRoZSA8aGVhZD4gdGFnLiBUaGUgZm9sbG93aW5nIGNvZGUgKHB1cmUgSmF2YVNjcmlwdCkgd2lsbCBmaXggdGhlIGlzc3VlLiBUaGlzIHNvbHV0aW9uXG4gKiB3aWxsIG5vdCB3b3JrIGluIElFOSBzZWU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEzMzg4NzI4LlxuICpcbiAqIFRoaXMgbW9kdWxlIHJlcXVpcmVzIHR3byBhdHRyaWJ1dGVzIHRvIGJlIHByb3ZpZGVkIGFzIGluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZTpcbiAqXG4gKiBgYGBodG1sXG4gKiA8ZGl2IGNsYXNzPVwicGFnZS13cmFwcGVyLWVsZW1lbnRcIlxuICogICAgICBkYXRhLWd4LWNvbXBhdGliaWxpdHk9XCJhZG1pbl9mYXZpY29uX2ZpeFwiXG4gKiAgICAgIGRhdGEtYWRtaW5fZmF2aWNvbl9maXgtc3RhdHVzPVwiZW5hYmxlZFwiXG4gKiAgICAgIGRhdGEtYWRtaW5fZmF2aWNvbl9maXgtZmlsZW5hbWU9XCJmYXZpY29uLmljb1wiPiAuLi4gPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvYWRtaW5fZmF2aWNvbl9maXhcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ2FkbWluX2Zhdmljb25fZml4JyxcblxuICAgIFtdLFxuXG4gICAgLyoqIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9hZG1pbl9mYXZpY29uX2ZpeCAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUNMQVJBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIEVsZW1lbnQgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAnZmlsZW5hbWUnOiAnL2FkbWluL2h0bWwvYXNzZXRzL2ltYWdlcy9neC1hZG1pbi9mYXZpY29uLWdhbWJpby1kZS5pY28nXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQgbGlua1tyZWw9XCJzaG9ydGN1dCBpY29uXCJdJykgJiYgb3B0aW9ucy5zdGF0dXMgPT09ICdlbmFibGVkJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmF2aWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgZmF2aWNvbi5yZWwgPSAnc2hvcnRjdXQgaWNvbic7XG4gICAgICAgICAgICAgICAgICAgIGZhdmljb24uaHJlZiA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgb3B0aW9ucy5maWxlbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChmYXZpY29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gY3JlYXRlIGZhdmljb24gdGFnIGluIGRvY3VtZW50IDxoZWFkPiBlbGVtZW50LiBFeGNlcHRpb246ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhjZXB0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
