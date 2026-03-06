'use strict';

/* --------------------------------------------------------------
 content_header.js 2016-04-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Content Header Controller
 *
 * This module handles the behavior of the header controller. It will roll-in whenever the user scrolls to top.
 * The widget will emmit an event "content_header:roll_in" when it is rolled in and a "content_header:roll_out"
 * whenever it's hiding. These events can be useful if there's a need to re-position elements that are static
 * e.g. fixed table headers.
 *
 * In extend the content-header element will have the "fixed" class as long as it stays fixed on the viewport.
 */
gx.controllers.module('content_header', [], function (data) {

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
     * The original position of the tab navigation
     *
     * @type {Number}
     */
    var originalPosition = 0;

    /**
     * The last scroll position
     *
     * @type {Number}
     */
    var scrollPosition = $(window).scrollTop();

    /**
     * The original left position of the pageHeading
     *
     * @type {Number}
     */
    var originalLeft = 0;

    /**
     * Tells if the tab navigation is within the view port
     *
     * @type {Boolean}
     */
    var isOut = true;

    /**
     * Whether the content header is currently on animation.
     *
     * @type {Boolean}
     */
    var onAnimation = false;

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
     * On Window Scroll Handler
     *
     * Reset the page navigation frame to the original position if the user scrolls directly to top.
     */
    function _onWindowScroll() {
        if (onAnimation) {
            return;
        }

        var newScrollPosition = $(window).scrollTop();
        var isScrollDown = scrollPosition - newScrollPosition < 0;
        var isScrollUp = scrollPosition - newScrollPosition > 0;

        originalPosition = $('#main-header').height();
        originalLeft = $('#main-menu').outerWidth();

        _setContentHeaderAbsoluteLeft();

        var scrolledToTop = _checkScrolledToTop();

        if (!scrolledToTop) {
            if (isScrollDown && !isScrollUp && !isOut) {
                _rollOut();
            } else if (!isScrollDown && isScrollUp && isOut) {
                _rollIn();
            }
        }

        scrollPosition = newScrollPosition;
    }

    /**
     * Roll-in Animation Function
     */
    function _rollIn() {
        isOut = false;
        onAnimation = true;

        $this.trigger('content_header:roll_in');

        $this.css({
            top: '0',
            position: 'fixed'
        });

        // Retain the page height with a temporary padding.
        $this.parent().css('padding-top', $this.outerHeight() + 'px');

        $this.animate({
            top: originalPosition + 'px'
        }, {
            complete: function complete() {
                _checkScrolledToTop();
                onAnimation = false;
                _onWindowScroll(); // Check if it's necessary to re-render the position of the content-header.
                $this.addClass('fixed');
            }
        }, 'fast');
    }

    /**
     * Roll-out Animation Function
     */
    function _rollOut() {
        isOut = true;
        onAnimation = true;

        $this.trigger('content_header:roll_out');

        $this.animate({
            top: '0'
        }, 'fast', 'swing', function () {
            $this.css({
                top: originalPosition + 'px',
                position: ''
            });

            $this.parent().css('padding-top', ''); // Remove temporary padding.

            onAnimation = false;

            $this.removeClass('fixed');
        });
    }

    /**
     * Sets the left position of the pageHeading absolute
     */
    function _setContentHeaderAbsoluteLeft() {
        $this.css('left', originalLeft - $(window).scrollLeft());
    }

    /**
     * Check if user has scrolled to top of the page.
     *
     * @return {Boolean} Returns the check result.
     */
    function _checkScrolledToTop() {
        if ($(window).scrollTop() === 0) {
            $this.css({
                top: originalPosition + 'px',
                position: ''
            });

            $this.parent().css('padding-top', ''); // Remove temporary padding.

            return true;
        }

        return false;
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(window).on('scroll', _onWindowScroll);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9jb250ZW50L2NvbnRlbnRfaGVhZGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwib3JpZ2luYWxQb3NpdGlvbiIsInNjcm9sbFBvc2l0aW9uIiwid2luZG93Iiwic2Nyb2xsVG9wIiwib3JpZ2luYWxMZWZ0IiwiaXNPdXQiLCJvbkFuaW1hdGlvbiIsIl9vbldpbmRvd1Njcm9sbCIsIm5ld1Njcm9sbFBvc2l0aW9uIiwiaXNTY3JvbGxEb3duIiwiaXNTY3JvbGxVcCIsImhlaWdodCIsIm91dGVyV2lkdGgiLCJfc2V0Q29udGVudEhlYWRlckFic29sdXRlTGVmdCIsInNjcm9sbGVkVG9Ub3AiLCJfY2hlY2tTY3JvbGxlZFRvVG9wIiwiX3JvbGxPdXQiLCJfcm9sbEluIiwidHJpZ2dlciIsImNzcyIsInRvcCIsInBvc2l0aW9uIiwicGFyZW50Iiwib3V0ZXJIZWlnaHQiLCJhbmltYXRlIiwiY29tcGxldGUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwic2Nyb2xsTGVmdCIsImluaXQiLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsZ0JBQXRCLEVBQXdDLEVBQXhDLEVBQTRDLFVBQVVDLElBQVYsRUFBZ0I7O0FBRXhEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBSUMsbUJBQW1CLENBQXZCOztBQUVBOzs7OztBQUtBLFFBQUlDLGlCQUFpQkYsRUFBRUcsTUFBRixFQUFVQyxTQUFWLEVBQXJCOztBQUVBOzs7OztBQUtBLFFBQUlDLGVBQWUsQ0FBbkI7O0FBRUE7Ozs7O0FBS0EsUUFBSUMsUUFBUSxJQUFaOztBQUVBOzs7OztBQUtBLFFBQUlDLGNBQWMsS0FBbEI7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QUFnQjtBQUMxQi9CLFVBQUVHLE1BQUYsRUFBVTZCLEVBQVYsQ0FBYSxRQUFiLEVBQXVCeEIsZUFBdkI7QUFDQXVCO0FBQ0gsS0FIRDs7QUFLQSxXQUFPbEMsTUFBUDtBQUNILENBeExEIiwiZmlsZSI6ImxheW91dHMvbWFpbi9jb250ZW50L2NvbnRlbnRfaGVhZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBjb250ZW50X2hlYWRlci5qcyAyMDE2LTA0LTI3XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBDb250ZW50IEhlYWRlciBDb250cm9sbGVyXG4gKlxuICogVGhpcyBtb2R1bGUgaGFuZGxlcyB0aGUgYmVoYXZpb3Igb2YgdGhlIGhlYWRlciBjb250cm9sbGVyLiBJdCB3aWxsIHJvbGwtaW4gd2hlbmV2ZXIgdGhlIHVzZXIgc2Nyb2xscyB0byB0b3AuXG4gKiBUaGUgd2lkZ2V0IHdpbGwgZW1taXQgYW4gZXZlbnQgXCJjb250ZW50X2hlYWRlcjpyb2xsX2luXCIgd2hlbiBpdCBpcyByb2xsZWQgaW4gYW5kIGEgXCJjb250ZW50X2hlYWRlcjpyb2xsX291dFwiXG4gKiB3aGVuZXZlciBpdCdzIGhpZGluZy4gVGhlc2UgZXZlbnRzIGNhbiBiZSB1c2VmdWwgaWYgdGhlcmUncyBhIG5lZWQgdG8gcmUtcG9zaXRpb24gZWxlbWVudHMgdGhhdCBhcmUgc3RhdGljXG4gKiBlLmcuIGZpeGVkIHRhYmxlIGhlYWRlcnMuXG4gKlxuICogSW4gZXh0ZW5kIHRoZSBjb250ZW50LWhlYWRlciBlbGVtZW50IHdpbGwgaGF2ZSB0aGUgXCJmaXhlZFwiIGNsYXNzIGFzIGxvbmcgYXMgaXQgc3RheXMgZml4ZWQgb24gdGhlIHZpZXdwb3J0LlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ2NvbnRlbnRfaGVhZGVyJywgW10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3JpZ2luYWwgcG9zaXRpb24gb2YgdGhlIHRhYiBuYXZpZ2F0aW9uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIGxldCBvcmlnaW5hbFBvc2l0aW9uID0gMDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsYXN0IHNjcm9sbCBwb3NpdGlvblxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBsZXQgc2Nyb2xsUG9zaXRpb24gPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3JpZ2luYWwgbGVmdCBwb3NpdGlvbiBvZiB0aGUgcGFnZUhlYWRpbmdcbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgbGV0IG9yaWdpbmFsTGVmdCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBUZWxscyBpZiB0aGUgdGFiIG5hdmlnYXRpb24gaXMgd2l0aGluIHRoZSB2aWV3IHBvcnRcbiAgICAgKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIGxldCBpc091dCA9IHRydWU7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBjb250ZW50IGhlYWRlciBpcyBjdXJyZW50bHkgb24gYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgbGV0IG9uQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE9uIFdpbmRvdyBTY3JvbGwgSGFuZGxlclxuICAgICAqXG4gICAgICogUmVzZXQgdGhlIHBhZ2UgbmF2aWdhdGlvbiBmcmFtZSB0byB0aGUgb3JpZ2luYWwgcG9zaXRpb24gaWYgdGhlIHVzZXIgc2Nyb2xscyBkaXJlY3RseSB0byB0b3AuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uV2luZG93U2Nyb2xsKCkge1xuICAgICAgICBpZiAob25BbmltYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1Njcm9sbFBvc2l0aW9uID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICBjb25zdCBpc1Njcm9sbERvd24gPSBzY3JvbGxQb3NpdGlvbiAtIG5ld1Njcm9sbFBvc2l0aW9uIDwgMDtcbiAgICAgICAgY29uc3QgaXNTY3JvbGxVcCA9IHNjcm9sbFBvc2l0aW9uIC0gbmV3U2Nyb2xsUG9zaXRpb24gPiAwO1xuXG4gICAgICAgIG9yaWdpbmFsUG9zaXRpb24gPSAkKCcjbWFpbi1oZWFkZXInKS5oZWlnaHQoKTtcbiAgICAgICAgb3JpZ2luYWxMZWZ0ID0gJCgnI21haW4tbWVudScpLm91dGVyV2lkdGgoKTtcblxuICAgICAgICBfc2V0Q29udGVudEhlYWRlckFic29sdXRlTGVmdCgpO1xuXG4gICAgICAgIGxldCBzY3JvbGxlZFRvVG9wID0gX2NoZWNrU2Nyb2xsZWRUb1RvcCgpO1xuXG4gICAgICAgIGlmICghc2Nyb2xsZWRUb1RvcCkge1xuICAgICAgICAgICAgaWYgKGlzU2Nyb2xsRG93biAmJiAhaXNTY3JvbGxVcCAmJiAhaXNPdXQpIHtcbiAgICAgICAgICAgICAgICBfcm9sbE91dCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXNTY3JvbGxEb3duICYmIGlzU2Nyb2xsVXAgJiYgaXNPdXQpIHtcbiAgICAgICAgICAgICAgICBfcm9sbEluKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxQb3NpdGlvbiA9IG5ld1Njcm9sbFBvc2l0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJvbGwtaW4gQW5pbWF0aW9uIEZ1bmN0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JvbGxJbigpIHtcbiAgICAgICAgaXNPdXQgPSBmYWxzZTtcbiAgICAgICAgb25BbmltYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICR0aGlzLnRyaWdnZXIoJ2NvbnRlbnRfaGVhZGVyOnJvbGxfaW4nKTtcblxuICAgICAgICAkdGhpcy5jc3Moe1xuICAgICAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXRhaW4gdGhlIHBhZ2UgaGVpZ2h0IHdpdGggYSB0ZW1wb3JhcnkgcGFkZGluZy5cbiAgICAgICAgJHRoaXMucGFyZW50KCkuY3NzKCdwYWRkaW5nLXRvcCcsICR0aGlzLm91dGVySGVpZ2h0KCkgKyAncHgnKTtcblxuICAgICAgICAkdGhpcy5hbmltYXRlKHtcbiAgICAgICAgICAgIHRvcDogb3JpZ2luYWxQb3NpdGlvbiArICdweCdcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfY2hlY2tTY3JvbGxlZFRvVG9wKCk7XG4gICAgICAgICAgICAgICAgb25BbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBfb25XaW5kb3dTY3JvbGwoKTsgLy8gQ2hlY2sgaWYgaXQncyBuZWNlc3NhcnkgdG8gcmUtcmVuZGVyIHRoZSBwb3NpdGlvbiBvZiB0aGUgY29udGVudC1oZWFkZXIuXG4gICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICdmYXN0Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm9sbC1vdXQgQW5pbWF0aW9uIEZ1bmN0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JvbGxPdXQoKSB7XG4gICAgICAgIGlzT3V0ID0gdHJ1ZTtcbiAgICAgICAgb25BbmltYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICR0aGlzLnRyaWdnZXIoJ2NvbnRlbnRfaGVhZGVyOnJvbGxfb3V0Jyk7XG5cbiAgICAgICAgJHRoaXMuYW5pbWF0ZSh7XG4gICAgICAgICAgICB0b3A6ICcwJ1xuICAgICAgICB9LCAnZmFzdCcsICdzd2luZycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICR0aGlzLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiBvcmlnaW5hbFBvc2l0aW9uICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJydcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy5wYXJlbnQoKS5jc3MoJ3BhZGRpbmctdG9wJywgJycpOyAvLyBSZW1vdmUgdGVtcG9yYXJ5IHBhZGRpbmcuXG5cbiAgICAgICAgICAgIG9uQW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBsZWZ0IHBvc2l0aW9uIG9mIHRoZSBwYWdlSGVhZGluZyBhYnNvbHV0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9zZXRDb250ZW50SGVhZGVyQWJzb2x1dGVMZWZ0KCkge1xuICAgICAgICAkdGhpcy5jc3MoJ2xlZnQnLCBvcmlnaW5hbExlZnQgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB1c2VyIGhhcyBzY3JvbGxlZCB0byB0b3Agb2YgdGhlIHBhZ2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRoZSBjaGVjayByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2NoZWNrU2Nyb2xsZWRUb1RvcCgpIHtcbiAgICAgICAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA9PT0gMCkge1xuICAgICAgICAgICAgJHRoaXMuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IG9yaWdpbmFsUG9zaXRpb24gKyAncHgnLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLnBhcmVudCgpLmNzcygncGFkZGluZy10b3AnLCAnJyk7IC8vIFJlbW92ZSB0ZW1wb3JhcnkgcGFkZGluZy5cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfb25XaW5kb3dTY3JvbGwpO1xuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59KTsiXX0=
