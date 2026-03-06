'use strict';

/* --------------------------------------------------------------
 page_nav_tabs.js 2016-07-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Page Navigation Tabs
 *
 * This module will convert old table-style navigation to the new theme navigation tabs for
 * every page. It searches for specific HTML patterns and creates new markup for the page
 * navigation.
 *
 * **Important!** If you need to exclude an old navigation table from being converted you must add
 * the "exclude-page-nav" class to its table tag as in the following example.
 *
 * ```html
 * <table class="exclude-page-nav"> ... </table>
 * ```
 *
 * @module Compatibility/page_nav_tabs
 */
gx.compatibility.module('page_nav_tabs', [],

/**  @lends module:Compatibility/page_nav_tabs */

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
    defaults = {
        EXCLUDE_CLASS: 'exclude-page-nav',
        CONVERT_CLASS: 'convert-to-tabs'
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
    module = {},


    /**
     * The original position of the tab navigation
     *
     * @type int
     */
    originalPosition = 0,


    /**
     * The last scroll position
     *
     * @type int
     */
    scrollPosition = $(window).scrollTop(),


    /**
     * The original left position of the pageHeading
     *
     * @type {number}
     */
    originalLeft = 0,


    /**
     * Tells if the tab navigation is within the view port
     *
     * @type boolean
     */
    isOut = true;

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Change the first .pageHeading HTML to contain the ".page-nav-title" class.
     */
    var _fixPageHeading = function _fixPageHeading() {
        var $pageHeading = $('.pageHeading:first-child');
        $pageHeading.html('<div class="page-nav-title">' + $pageHeading.html() + '</div>');

        $pageHeading.wrap('<div class="pageHeadingWrapper"></div>');
        $('.pageHeadingWrapper').height($pageHeading.height() + 1);
        originalLeft = $('.pageHeading').length ? $('.pageHeading').offset().left : 0;
    };

    /**
     * Checks if the page has the old table-style navigation system.
     *
     * @return {string} Returns Returns the selector that matches the string or null if none was found.
     */
    var _detectHtmlPattern = function _detectHtmlPattern() {
        var patterns = ['.main table .dataTableHeadingRow .dataTableHeadingContentText a', '.pdf_menu tr td.dataTableHeadingContent', '.boxCenter table tr td.dataTableHeadingContent a'],
            selector = null;

        $.each(patterns, function () {
            if ($this.find(this).length > 0 && !$this.find(this).closest('table').hasClass(options.EXCLUDE_CLASS)) {
                selector = this;
                return false; // exit loop
            }
        });

        return selector;
    };

    /**
     * Performs the conversion of the old style to the new navigation HTML.
     *
     * It will also hide the old navigation markup. Styling for the new HTML is located in the
     * "_compatibility.scss".
     *
     * @param {string} selector The selector string to be used for selecting the old table td cells.
     */
    var _convertNavigationTabs = function _convertNavigationTabs(selector) {
        var $selector = $this.find(selector),
            $table = $selector.closest('table'),
            $pageHeading = $('.pageHeading:first-child'),
            $pageNavTabs = $('<div class="page-nav-tabs"></div>');

        $table.find('tr td').each(function () {
            var $navTab = $('<div class="nav-tab">' + $(this).html() + '</div>');

            // Style current page tabs.
            if ($navTab.find('a').length === 0) {
                $navTab.addClass('no-link');
            }

            $navTab.appendTo($pageNavTabs);
        });

        $pageNavTabs.appendTo($pageHeading);

        $table.hide();
    };

    /**
     * Quick Return Check
     *
     * Reset the page navigation frame to the original position if the user scrolls directly
     * to top.
     */
    var _quickReturn = function _quickReturn() {
        var newScrollPosition = $(window).scrollTop();
        var isScrollDown = scrollPosition - newScrollPosition < 0;
        var isScrollUp = scrollPosition - newScrollPosition > 0;
        originalPosition = $('.main-top-header').height();
        _setPageHeadingLeftAbsolute();

        var scrolledToTop = _checkScrolledToTop();

        if (!scrolledToTop) {
            if (isScrollDown && !isScrollUp && !isOut) {
                _rollOut();
            } else if (!isScrollDown && isScrollUp && isOut) {
                _rollIn();
            }
        }

        scrollPosition = newScrollPosition;
    };

    /**
     * Roll-in Animation Function
     */
    var _rollIn = function _rollIn() {
        isOut = false;
        $('.pageHeading').css({
            top: '0px',
            position: 'fixed'
        });

        $('.pageHeading').animate({
            top: originalPosition + 'px'
        }, {
            complete: _checkScrolledToTop
        }, 'fast');
    };

    /**
     * Sets the left position of the pageHeading absolute
     */
    var _setPageHeadingLeftAbsolute = function _setPageHeadingLeftAbsolute() {
        var contentHeaderLeft = originalLeft - $(window).scrollLeft();
        var menuWidth = $('.columnLeft2').outerWidth();
        $('.pageHeading').css('left', (contentHeaderLeft < menuWidth ? menuWidth : contentHeaderLeft) + 'px');
    };

    /**
     * Roll-out Animation Function
     */
    var _rollOut = function _rollOut() {
        isOut = true;
        $('.pageHeading').animate({
            top: '0px'
        }, 'fast', 'swing', function () {
            $('.pageHeading').css({
                top: originalPosition + 'px',
                position: 'static'
            });
        });
    };

    /**
     * Check if user has scrolled to top of the page.
     *
     * @returns {bool} Returns the check result.
     */
    var _checkScrolledToTop = function _checkScrolledToTop() {
        if ($(window).scrollTop() === 0) {
            $('.pageHeading').css({
                top: originalPosition + 'px',
                position: 'static'
            });

            return true;
        }

        return false;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        setTimeout(function () {
            _fixPageHeading(); // must be executed for every page

            // Convert only the pages that have a recognizable table navigation style.
            var selector = _detectHtmlPattern();

            if (selector !== null) {
                _convertNavigationTabs(selector);
            }

            $(window).on('scroll', _quickReturn);

            // Set height for parent element of the page heading bar to avoid that the main content moves up when
            // the heading bar switches into sticky mode
            $('.pageHeading').parent().height($('.pageHeading').parent().height());

            done();
        }, 300);
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VfbmF2X3RhYnMuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiRVhDTFVERV9DTEFTUyIsIkNPTlZFUlRfQ0xBU1MiLCJvcHRpb25zIiwiZXh0ZW5kIiwib3JpZ2luYWxQb3NpdGlvbiIsInNjcm9sbFBvc2l0aW9uIiwid2luZG93Iiwic2Nyb2xsVG9wIiwib3JpZ2luYWxMZWZ0IiwiaXNPdXQiLCJfZml4UGFnZUhlYWRpbmciLCIkcGFnZUhlYWRpbmciLCJodG1sIiwid3JhcCIsImhlaWdodCIsImxlbmd0aCIsIm9mZnNldCIsImxlZnQiLCJfZGV0ZWN0SHRtbFBhdHRlcm4iLCJwYXR0ZXJucyIsInNlbGVjdG9yIiwiZWFjaCIsImZpbmQiLCJjbG9zZXN0IiwiaGFzQ2xhc3MiLCJfY29udmVydE5hdmlnYXRpb25UYWJzIiwiJHNlbGVjdG9yIiwiJHRhYmxlIiwiJHBhZ2VOYXZUYWJzIiwiJG5hdlRhYiIsImFkZENsYXNzIiwiYXBwZW5kVG8iLCJoaWRlIiwiX3F1aWNrUmV0dXJuIiwibmV3U2Nyb2xsUG9zaXRpb24iLCJpc1Njcm9sbERvd24iLCJpc1Njcm9sbFVwIiwiX3NldFBhZ2VIZWFkaW5nTGVmdEFic29sdXRlIiwic2Nyb2xsZWRUb1RvcCIsIl9jaGVja1Njcm9sbGVkVG9Ub3AiLCJfcm9sbE91dCIsIl9yb2xsSW4iLCJjc3MiLCJ0b3AiLCJwb3NpdGlvbiIsImFuaW1hdGUiLCJjb21wbGV0ZSIsImNvbnRlbnRIZWFkZXJMZWZ0Iiwic2Nyb2xsTGVmdCIsIm1lbnVXaWR0aCIsIm91dGVyV2lkdGgiLCJpbml0IiwiZG9uZSIsInNldFRpbWVvdXQiLCJvbiIsInBhcmVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGVBREosRUFHSSxFQUhKOztB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QWxDOztBQUVBc0M7QUFDSCxTQWpCRCxFQWlCRyxHQWpCSDtBQWtCSCxLQW5CRDs7QUFxQkEsV0FBT3pELE1BQVA7QUFDSCxDQWxRTCIsImZpbGUiOiJwYWdlX25hdl90YWJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBwYWdlX25hdl90YWJzLmpzIDIwMTYtMDctMTNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFBhZ2UgTmF2aWdhdGlvbiBUYWJzXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCBjb252ZXJ0IG9sZCB0YWJsZS1zdHlsZSBuYXZpZ2F0aW9uIHRvIHRoZSBuZXcgdGhlbWUgbmF2aWdhdGlvbiB0YWJzIGZvclxuICogZXZlcnkgcGFnZS4gSXQgc2VhcmNoZXMgZm9yIHNwZWNpZmljIEhUTUwgcGF0dGVybnMgYW5kIGNyZWF0ZXMgbmV3IG1hcmt1cCBmb3IgdGhlIHBhZ2VcbiAqIG5hdmlnYXRpb24uXG4gKlxuICogKipJbXBvcnRhbnQhKiogSWYgeW91IG5lZWQgdG8gZXhjbHVkZSBhbiBvbGQgbmF2aWdhdGlvbiB0YWJsZSBmcm9tIGJlaW5nIGNvbnZlcnRlZCB5b3UgbXVzdCBhZGRcbiAqIHRoZSBcImV4Y2x1ZGUtcGFnZS1uYXZcIiBjbGFzcyB0byBpdHMgdGFibGUgdGFnIGFzIGluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZS5cbiAqXG4gKiBgYGBodG1sXG4gKiA8dGFibGUgY2xhc3M9XCJleGNsdWRlLXBhZ2UtbmF2XCI+IC4uLiA8L3RhYmxlPlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L3BhZ2VfbmF2X3RhYnNcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ3BhZ2VfbmF2X3RhYnMnLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9wYWdlX25hdl90YWJzICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIEVYQ0xVREVfQ0xBU1M6ICdleGNsdWRlLXBhZ2UtbmF2JyxcbiAgICAgICAgICAgICAgICBDT05WRVJUX0NMQVNTOiAnY29udmVydC10by10YWJzJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIG9yaWdpbmFsIHBvc2l0aW9uIG9mIHRoZSB0YWIgbmF2aWdhdGlvblxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIGludFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcmlnaW5hbFBvc2l0aW9uID0gMCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgbGFzdCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSBpbnRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIG9yaWdpbmFsIGxlZnQgcG9zaXRpb24gb2YgdGhlIHBhZ2VIZWFkaW5nXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3JpZ2luYWxMZWZ0ID0gMCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUZWxscyBpZiB0aGUgdGFiIG5hdmlnYXRpb24gaXMgd2l0aGluIHRoZSB2aWV3IHBvcnRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlzT3V0ID0gdHJ1ZTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFuZ2UgdGhlIGZpcnN0IC5wYWdlSGVhZGluZyBIVE1MIHRvIGNvbnRhaW4gdGhlIFwiLnBhZ2UtbmF2LXRpdGxlXCIgY2xhc3MuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2ZpeFBhZ2VIZWFkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRwYWdlSGVhZGluZyA9ICQoJy5wYWdlSGVhZGluZzpmaXJzdC1jaGlsZCcpO1xuICAgICAgICAgICAgJHBhZ2VIZWFkaW5nLmh0bWwoJzxkaXYgY2xhc3M9XCJwYWdlLW5hdi10aXRsZVwiPicgKyAkcGFnZUhlYWRpbmcuaHRtbCgpICsgJzwvZGl2PicpO1xuXG4gICAgICAgICAgICAkcGFnZUhlYWRpbmcud3JhcCgnPGRpdiBjbGFzcz1cInBhZ2VIZWFkaW5nV3JhcHBlclwiPjwvZGl2PicpO1xuICAgICAgICAgICAgJCgnLnBhZ2VIZWFkaW5nV3JhcHBlcicpLmhlaWdodCgkcGFnZUhlYWRpbmcuaGVpZ2h0KCkgKyAxKTtcbiAgICAgICAgICAgIG9yaWdpbmFsTGVmdCA9ICQoJy5wYWdlSGVhZGluZycpLmxlbmd0aCA/ICQoJy5wYWdlSGVhZGluZycpLm9mZnNldCgpLmxlZnQgOiAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgdGhlIHBhZ2UgaGFzIHRoZSBvbGQgdGFibGUtc3R5bGUgbmF2aWdhdGlvbiBzeXN0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gUmV0dXJucyBSZXR1cm5zIHRoZSBzZWxlY3RvciB0aGF0IG1hdGNoZXMgdGhlIHN0cmluZyBvciBudWxsIGlmIG5vbmUgd2FzIGZvdW5kLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9kZXRlY3RIdG1sUGF0dGVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwYXR0ZXJucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgJy5tYWluIHRhYmxlIC5kYXRhVGFibGVIZWFkaW5nUm93IC5kYXRhVGFibGVIZWFkaW5nQ29udGVudFRleHQgYScsXG4gICAgICAgICAgICAgICAgICAgICcucGRmX21lbnUgdHIgdGQuZGF0YVRhYmxlSGVhZGluZ0NvbnRlbnQnLFxuICAgICAgICAgICAgICAgICAgICAnLmJveENlbnRlciB0YWJsZSB0ciB0ZC5kYXRhVGFibGVIZWFkaW5nQ29udGVudCBhJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBudWxsO1xuXG4gICAgICAgICAgICAkLmVhY2gocGF0dGVybnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuZmluZCh0aGlzKS5sZW5ndGggPiAwICYmICEkdGhpcy5maW5kKHRoaXMpLmNsb3Nlc3QoJ3RhYmxlJykuaGFzQ2xhc3Mob3B0aW9ucy5FWENMVURFX0NMQVNTKSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gZXhpdCBsb29wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUGVyZm9ybXMgdGhlIGNvbnZlcnNpb24gb2YgdGhlIG9sZCBzdHlsZSB0byB0aGUgbmV3IG5hdmlnYXRpb24gSFRNTC5cbiAgICAgICAgICpcbiAgICAgICAgICogSXQgd2lsbCBhbHNvIGhpZGUgdGhlIG9sZCBuYXZpZ2F0aW9uIG1hcmt1cC4gU3R5bGluZyBmb3IgdGhlIG5ldyBIVE1MIGlzIGxvY2F0ZWQgaW4gdGhlXG4gICAgICAgICAqIFwiX2NvbXBhdGliaWxpdHkuc2Nzc1wiLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgVGhlIHNlbGVjdG9yIHN0cmluZyB0byBiZSB1c2VkIGZvciBzZWxlY3RpbmcgdGhlIG9sZCB0YWJsZSB0ZCBjZWxscy5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY29udmVydE5hdmlnYXRpb25UYWJzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB2YXIgJHNlbGVjdG9yID0gJHRoaXMuZmluZChzZWxlY3RvciksXG4gICAgICAgICAgICAgICAgJHRhYmxlID0gJHNlbGVjdG9yLmNsb3Nlc3QoJ3RhYmxlJyksXG4gICAgICAgICAgICAgICAgJHBhZ2VIZWFkaW5nID0gJCgnLnBhZ2VIZWFkaW5nOmZpcnN0LWNoaWxkJyksXG4gICAgICAgICAgICAgICAgJHBhZ2VOYXZUYWJzID0gJCgnPGRpdiBjbGFzcz1cInBhZ2UtbmF2LXRhYnNcIj48L2Rpdj4nKTtcblxuICAgICAgICAgICAgJHRhYmxlLmZpbmQoJ3RyIHRkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRuYXZUYWIgPSAkKCc8ZGl2IGNsYXNzPVwibmF2LXRhYlwiPicgKyAkKHRoaXMpLmh0bWwoKSArICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgICAgIC8vIFN0eWxlIGN1cnJlbnQgcGFnZSB0YWJzLlxuICAgICAgICAgICAgICAgIGlmICgkbmF2VGFiLmZpbmQoJ2EnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJG5hdlRhYi5hZGRDbGFzcygnbm8tbGluaycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRuYXZUYWIuYXBwZW5kVG8oJHBhZ2VOYXZUYWJzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkcGFnZU5hdlRhYnMuYXBwZW5kVG8oJHBhZ2VIZWFkaW5nKTtcblxuICAgICAgICAgICAgJHRhYmxlLmhpZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUXVpY2sgUmV0dXJuIENoZWNrXG4gICAgICAgICAqXG4gICAgICAgICAqIFJlc2V0IHRoZSBwYWdlIG5hdmlnYXRpb24gZnJhbWUgdG8gdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGlmIHRoZSB1c2VyIHNjcm9sbHMgZGlyZWN0bHlcbiAgICAgICAgICogdG8gdG9wLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9xdWlja1JldHVybiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBuZXdTY3JvbGxQb3NpdGlvbiA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgICAgIHZhciBpc1Njcm9sbERvd24gPSBzY3JvbGxQb3NpdGlvbiAtIG5ld1Njcm9sbFBvc2l0aW9uIDwgMDtcbiAgICAgICAgICAgIHZhciBpc1Njcm9sbFVwID0gc2Nyb2xsUG9zaXRpb24gLSBuZXdTY3JvbGxQb3NpdGlvbiA+IDA7XG4gICAgICAgICAgICBvcmlnaW5hbFBvc2l0aW9uID0gJCgnLm1haW4tdG9wLWhlYWRlcicpLmhlaWdodCgpO1xuICAgICAgICAgICAgX3NldFBhZ2VIZWFkaW5nTGVmdEFic29sdXRlKCk7XG5cbiAgICAgICAgICAgIHZhciBzY3JvbGxlZFRvVG9wID0gX2NoZWNrU2Nyb2xsZWRUb1RvcCgpO1xuXG4gICAgICAgICAgICBpZiAoIXNjcm9sbGVkVG9Ub3ApIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTY3JvbGxEb3duICYmICFpc1Njcm9sbFVwICYmICFpc091dCkge1xuICAgICAgICAgICAgICAgICAgICBfcm9sbE91dCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIWlzU2Nyb2xsRG93biAmJiBpc1Njcm9sbFVwICYmIGlzT3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIF9yb2xsSW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uID0gbmV3U2Nyb2xsUG9zaXRpb247XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJvbGwtaW4gQW5pbWF0aW9uIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3JvbGxJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlzT3V0ID0gZmFsc2U7XG4gICAgICAgICAgICAkKCcucGFnZUhlYWRpbmcnKS5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCcsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcucGFnZUhlYWRpbmcnKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiBvcmlnaW5hbFBvc2l0aW9uICsgJ3B4J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogX2NoZWNrU2Nyb2xsZWRUb1RvcFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2Zhc3QnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgbGVmdCBwb3NpdGlvbiBvZiB0aGUgcGFnZUhlYWRpbmcgYWJzb2x1dGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2V0UGFnZUhlYWRpbmdMZWZ0QWJzb2x1dGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29udGVudEhlYWRlckxlZnQgPSBvcmlnaW5hbExlZnQgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgdmFyIG1lbnVXaWR0aCA9ICQoJy5jb2x1bW5MZWZ0MicpLm91dGVyV2lkdGgoKTtcbiAgICAgICAgICAgICQoJy5wYWdlSGVhZGluZycpLmNzcygnbGVmdCcsIChjb250ZW50SGVhZGVyTGVmdCA8IG1lbnVXaWR0aCA/IG1lbnVXaWR0aCA6IGNvbnRlbnRIZWFkZXJMZWZ0KSArICdweCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSb2xsLW91dCBBbmltYXRpb24gRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfcm9sbE91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlzT3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICQoJy5wYWdlSGVhZGluZycpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHRvcDogJzBweCdcbiAgICAgICAgICAgIH0sICdmYXN0JywgJ3N3aW5nJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlSGVhZGluZycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogb3JpZ2luYWxQb3NpdGlvbiArICdweCcsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnc3RhdGljJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIHVzZXIgaGFzIHNjcm9sbGVkIHRvIHRvcCBvZiB0aGUgcGFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2x9IFJldHVybnMgdGhlIGNoZWNrIHJlc3VsdC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2hlY2tTY3JvbGxlZFRvVG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICQoJy5wYWdlSGVhZGluZycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogb3JpZ2luYWxQb3NpdGlvbiArICdweCcsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnc3RhdGljJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX2ZpeFBhZ2VIZWFkaW5nKCk7IC8vIG11c3QgYmUgZXhlY3V0ZWQgZm9yIGV2ZXJ5IHBhZ2VcblxuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgb25seSB0aGUgcGFnZXMgdGhhdCBoYXZlIGEgcmVjb2duaXphYmxlIHRhYmxlIG5hdmlnYXRpb24gc3R5bGUuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gX2RldGVjdEh0bWxQYXR0ZXJuKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgX2NvbnZlcnROYXZpZ2F0aW9uVGFicyhzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfcXVpY2tSZXR1cm4pO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IGhlaWdodCBmb3IgcGFyZW50IGVsZW1lbnQgb2YgdGhlIHBhZ2UgaGVhZGluZyBiYXIgdG8gYXZvaWQgdGhhdCB0aGUgbWFpbiBjb250ZW50IG1vdmVzIHVwIHdoZW5cbiAgICAgICAgICAgICAgICAvLyB0aGUgaGVhZGluZyBiYXIgc3dpdGNoZXMgaW50byBzdGlja3kgbW9kZVxuICAgICAgICAgICAgICAgICQoJy5wYWdlSGVhZGluZycpLnBhcmVudCgpLmhlaWdodCgkKCcucGFnZUhlYWRpbmcnKS5wYXJlbnQoKS5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
