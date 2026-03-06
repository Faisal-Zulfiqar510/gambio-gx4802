'use strict';

/* --------------------------------------------------------------
 page_loading.js 2015-09-17 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Page Loading Module
 *
 * This module will display a loading page screen for approximately 1 second,
 * the time needed by the engine for the conversion. It will also fade the page
 * out when the user leaves a page, making the transition very smooth.
 *
 * @module Compatibility/page_loading
 */
gx.compatibility.module('page_loading', [],

/**  @lends module:Compatibility/page_loading */

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
     * Default Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Excluded pages to prevent white fade in.
     * @type {string[]}
     */
    excludedPages = ['backup.php', 'gm_backup_files_zip.php', 'orders_iloxx.php'],


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------

    var _pageLoad = function _pageLoad() {
        // show page content
        $this.delay(300).fadeIn(200, function () {
            $this.removeClass('hidden');
        });
    };

    var _pageUnload = function _pageUnload() {
        $('body').fadeOut(100); // Hide the entire body tag
    };

    /**
     * Indicates if the current page is contained in excluded pages array.
     * @return {boolean}
     */
    var _isExcludedPage = function _isExcludedPage() {
        var currentFile, found, result;

        currentFile = jse.libs.url_arguments.getCurrentFile();
        found = excludedPages.indexOf(currentFile);

        return found !== -1 ? true : false;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        //_pageLoad();

        $(window).on('beforeunload', function () {
            if (!_isExcludedPage()) {
                _pageUnload();
            }
        });

        $('body').on('JSENGINE_INIT_FINISHED', function () {
            $this.fadeIn(200, function () {
                $this.removeClass('hidden');
            });
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VfbG9hZGluZy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiZXhjbHVkZWRQYWdlcyIsIl9wYWdlTG9hZCIsImRlbGF5IiwiZmFkZUluIiwicmVtb3ZlQ2xhc3MiLCJfcGFnZVVubG9hZCIsImZhZGVPdXQiLCJfaXNFeGNsdWRlZFBhZ2UiLCJjdXJyZW50RmlsZSIsImZvdW5kIiwicmVzdWx0IiwianNlIiwibGlicyIsInVybF9hcmd1bWVudHMiLCJnZXRDdXJyZW50RmlsZSIsImluZGV4T2YiLCJpbml0IiwiZG9uZSIsIndpbmRvdyIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7OztBQVNBQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGNBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7OztBQUlBTSxvQkFBZ0IsQ0FDWixZQURZLEVBRVoseUJBRlksRUFHWixrQkFIWSxDQTFCcEI7OztBQWdDSTs7Ozs7QUFLQVAsYUFBUyxFQXJDYjs7QUF1Q0E7QUFDQTtBQUNBOztBQUVBLFFBQUlRLFlBQVksU0FBWkEsU0FBWSxHQUFZO0FBQ3hCO0FBQ0FOLGNBQU1PLEtBQU4sQ0FBWSxHQUFaLEVBQWlCQyxNQUFqQixDQUF3QixHQUF4QixFQUE2QixZQUFZO0FBQ3JDUixrQkFBTVMsV0FBTixDQUFrQixRQUFsQjtBQUNILFNBRkQ7QUFHSCxLQUxEOztBQU9BLFFBQUlDLGNBQWMsU0FBZEEsV0FBYyxHQUFZO0FBQzFCVCxVQUFFLE1BQUYsRUFBVVUsT0FBVixDQUFrQixHQUFsQixFQUQwQixDQUNGO0FBQzNCLEtBRkQ7O0FBSUE7Ozs7QUFJQSxRQUFJQyxrQkFBa0IsU0FBbEJBLGVBQWtCLEdBQVk7QUFDOUIsWUFBSUMsV0FBSixFQUFpQkMsS0FBakIsRUFBd0JDLE1BQXhCOztBQUVBRixzQkFBY0csSUFBSUMsSUFBSixDQUFTQyxhQUFULENBQXVCQyxjQUF2QixFQUFkO0FBQ0FMLGdCQUFRVCxjQUFjZSxPQUFkLENBQXNCUCxXQUF0QixDQUFSOztBQUVBLGVBQU9DLFVBQVUsQ0FBQyxDQUFYLEdBQWUsSUFBZixHQUFzQixLQUE3QjtBQUNILEtBUEQ7O0FBU0E7QUFDQTtBQUNBOztBQUVBaEIsV0FBT3VCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQjs7QUFFQXJCLFVBQUVzQixNQUFGLEVBQVVDLEVBQVYsQ0FBYSxjQUFiLEVBQTZCLFlBQVk7QUFDckMsZ0JBQUksQ0FBQ1osaUJBQUwsRUFBd0I7QUFDcEJGO0FBQ0g7QUFDSixTQUpEOztBQU9BVCxVQUFFLE1BQUYsRUFBVXVCLEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFZO0FBQy9DeEIsa0JBQU1RLE1BQU4sQ0FBYSxHQUFiLEVBQWtCLFlBQVk7QUFDMUJSLHNCQUFNUyxXQUFOLENBQWtCLFFBQWxCO0FBQ0gsYUFGRDtBQUdILFNBSkQ7O0FBTUFhO0FBQ0gsS0FsQkQ7O0FBb0JBLFdBQU94QixNQUFQO0FBQ0gsQ0EzR0wiLCJmaWxlIjoicGFnZV9sb2FkaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBwYWdlX2xvYWRpbmcuanMgMjAxNS0wOS0xNyBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgUGFnZSBMb2FkaW5nIE1vZHVsZVxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgZGlzcGxheSBhIGxvYWRpbmcgcGFnZSBzY3JlZW4gZm9yIGFwcHJveGltYXRlbHkgMSBzZWNvbmQsXG4gKiB0aGUgdGltZSBuZWVkZWQgYnkgdGhlIGVuZ2luZSBmb3IgdGhlIGNvbnZlcnNpb24uIEl0IHdpbGwgYWxzbyBmYWRlIHRoZSBwYWdlXG4gKiBvdXQgd2hlbiB0aGUgdXNlciBsZWF2ZXMgYSBwYWdlLCBtYWtpbmcgdGhlIHRyYW5zaXRpb24gdmVyeSBzbW9vdGguXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L3BhZ2VfbG9hZGluZ1xuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAncGFnZV9sb2FkaW5nJyxcblxuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvcGFnZV9sb2FkaW5nICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXhjbHVkZWQgcGFnZXMgdG8gcHJldmVudCB3aGl0ZSBmYWRlIGluLlxuICAgICAgICAgICAgICogQHR5cGUge3N0cmluZ1tdfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBleGNsdWRlZFBhZ2VzID0gW1xuICAgICAgICAgICAgICAgICdiYWNrdXAucGhwJyxcbiAgICAgICAgICAgICAgICAnZ21fYmFja3VwX2ZpbGVzX3ppcC5waHAnLFxuICAgICAgICAgICAgICAgICdvcmRlcnNfaWxveHgucGhwJ1xuICAgICAgICAgICAgXSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfcGFnZUxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBzaG93IHBhZ2UgY29udGVudFxuICAgICAgICAgICAgJHRoaXMuZGVsYXkoMzAwKS5mYWRlSW4oMjAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9wYWdlVW5sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnYm9keScpLmZhZGVPdXQoMTAwKTsgLy8gSGlkZSB0aGUgZW50aXJlIGJvZHkgdGFnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZGljYXRlcyBpZiB0aGUgY3VycmVudCBwYWdlIGlzIGNvbnRhaW5lZCBpbiBleGNsdWRlZCBwYWdlcyBhcnJheS5cbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaXNFeGNsdWRlZFBhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudEZpbGUsIGZvdW5kLCByZXN1bHQ7XG5cbiAgICAgICAgICAgIGN1cnJlbnRGaWxlID0ganNlLmxpYnMudXJsX2FyZ3VtZW50cy5nZXRDdXJyZW50RmlsZSgpO1xuICAgICAgICAgICAgZm91bmQgPSBleGNsdWRlZFBhZ2VzLmluZGV4T2YoY3VycmVudEZpbGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gZm91bmQgIT09IC0xID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgICAgICAgIC8vX3BhZ2VMb2FkKCk7XG5cbiAgICAgICAgICAgICQod2luZG93KS5vbignYmVmb3JldW5sb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghX2lzRXhjbHVkZWRQYWdlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgX3BhZ2VVbmxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmFkZUluKDIwMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
