'use strict';

/* --------------------------------------------------------------
 link.js 2015-09-29 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/* globals getSelection */

/**
 * ## Link Extension
 *
 * Use this extension to simulate any HTML element as an `<a>` link. Whenever the user clicks that element
 * he will be navigated into the target page as if he was clicking an `<a>` element.
 *
 * This module requires one extra option which will define the target URL to be used when navigating to
 * the next page. Provide it in the same element as in the following example.
 *
 * ### Options
 *
 * **URL | data-link-url | String | Required**
 *
 * The destination URL to be used after the user clicks on the element.
 *
 * ### Example
 *
 * ```html
 * <label data-gx-extension="link" data-link-url="http://gambio.de">Navigate To Official Website</label>
 * ```
 *
 * @module Admin/Extensions/link
 */
gx.extensions.module('link', [], function (data) {

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
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        url: '#'
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

        $this.on('mouseup', function (event) {

            // 1 = left click, 2 = middle click
            if (event.which === 1 || event.which === 2) {
                event.preventDefault();
                event.stopPropagation();

                var target = event.which === 1 ? '_self' : '_blank';
                var sel = getSelection().toString();

                if (!sel) {
                    window.open(options.url, target);
                }
            }
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpbmsuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwidXJsIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwib24iLCJldmVudCIsIndoaWNoIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJ0YXJnZXQiLCJzZWwiLCJnZXRTZWxlY3Rpb24iLCJ0b1N0cmluZyIsIndpbmRvdyIsIm9wZW4iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLE1BREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1BDLGFBQUs7QUFERSxLQWJmOzs7QUFpQkk7Ozs7O0FBS0FDLGNBQVVILEVBQUVJLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkgsUUFBbkIsRUFBNkJILElBQTdCLENBdEJkOzs7QUF3Qkk7Ozs7O0FBS0FELGFBQVMsRUE3QmI7O0FBK0JBO0FBQ0E7QUFDQTs7QUFFQUEsV0FBT1EsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7O0FBRTFCUCxjQUFNUSxFQUFOLENBQVMsU0FBVCxFQUFvQixVQUFVQyxLQUFWLEVBQWlCOztBQUVqQztBQUNBLGdCQUFJQSxNQUFNQyxLQUFOLEtBQWdCLENBQWhCLElBQXFCRCxNQUFNQyxLQUFOLEtBQWdCLENBQXpDLEVBQTRDO0FBQ3hDRCxzQkFBTUUsY0FBTjtBQUNBRixzQkFBTUcsZUFBTjs7QUFFQSxvQkFBSUMsU0FBVUosTUFBTUMsS0FBTixLQUFnQixDQUFqQixHQUFzQixPQUF0QixHQUFnQyxRQUE3QztBQUNBLG9CQUFJSSxNQUFNQyxlQUFlQyxRQUFmLEVBQVY7O0FBRUEsb0JBQUksQ0FBQ0YsR0FBTCxFQUFVO0FBQ05HLDJCQUFPQyxJQUFQLENBQVlkLFFBQVFELEdBQXBCLEVBQXlCVSxNQUF6QjtBQUNIO0FBQ0o7QUFFSixTQWZEOztBQWlCQU47QUFDSCxLQXBCRDs7QUFzQkEsV0FBT1QsTUFBUDtBQUNILENBdkVMIiwiZmlsZSI6ImxpbmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGxpbmsuanMgMjAxNS0wOS0yOSBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qIGdsb2JhbHMgZ2V0U2VsZWN0aW9uICovXG5cbi8qKlxuICogIyMgTGluayBFeHRlbnNpb25cbiAqXG4gKiBVc2UgdGhpcyBleHRlbnNpb24gdG8gc2ltdWxhdGUgYW55IEhUTUwgZWxlbWVudCBhcyBhbiBgPGE+YCBsaW5rLiBXaGVuZXZlciB0aGUgdXNlciBjbGlja3MgdGhhdCBlbGVtZW50XG4gKiBoZSB3aWxsIGJlIG5hdmlnYXRlZCBpbnRvIHRoZSB0YXJnZXQgcGFnZSBhcyBpZiBoZSB3YXMgY2xpY2tpbmcgYW4gYDxhPmAgZWxlbWVudC5cbiAqXG4gKiBUaGlzIG1vZHVsZSByZXF1aXJlcyBvbmUgZXh0cmEgb3B0aW9uIHdoaWNoIHdpbGwgZGVmaW5lIHRoZSB0YXJnZXQgVVJMIHRvIGJlIHVzZWQgd2hlbiBuYXZpZ2F0aW5nIHRvXG4gKiB0aGUgbmV4dCBwYWdlLiBQcm92aWRlIGl0IGluIHRoZSBzYW1lIGVsZW1lbnQgYXMgaW4gdGhlIGZvbGxvd2luZyBleGFtcGxlLlxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipVUkwgfCBkYXRhLWxpbmstdXJsIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIFRoZSBkZXN0aW5hdGlvbiBVUkwgdG8gYmUgdXNlZCBhZnRlciB0aGUgdXNlciBjbGlja3Mgb24gdGhlIGVsZW1lbnQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBodG1sXG4gKiA8bGFiZWwgZGF0YS1neC1leHRlbnNpb249XCJsaW5rXCIgZGF0YS1saW5rLXVybD1cImh0dHA6Ly9nYW1iaW8uZGVcIj5OYXZpZ2F0ZSBUbyBPZmZpY2lhbCBXZWJzaXRlPC9sYWJlbD5cbiAqIGBgYFxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9saW5rXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICdsaW5rJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICB1cmw6ICcjJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgJHRoaXMub24oJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgICAgIC8vIDEgPSBsZWZ0IGNsaWNrLCAyID0gbWlkZGxlIGNsaWNrXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSAxIHx8IGV2ZW50LndoaWNoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAoZXZlbnQud2hpY2ggPT09IDEpID8gJ19zZWxmJyA6ICdfYmxhbmsnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsID0gZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4ob3B0aW9ucy51cmwsIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
