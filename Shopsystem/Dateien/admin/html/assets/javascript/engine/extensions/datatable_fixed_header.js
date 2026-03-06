'use strict';

/* --------------------------------------------------------------
 datatable_fixed_header.js 2016-07-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable Fixed DataTable Header
 *
 * The table header will remain in the viewport as the user scrolls down the page. The style change of this
 * module is a bit tricky because we need to remove the thead from the normal flow, something that breaks the
 * display of the table. Therefore a helper clone of the thead is used to maintain the table formatting.
 *
 * **Notice #1**: The .table-fixed-header class is styled by the _tables.scss and is part of this solution.
 *
 * **Notice #2**: This method will take into concern the .content-header element which shouldn't overlap the
 * table header.
 *
 * @module Admin/Extensions/datatable_fixed_header
 */
gx.extensions.module('datatable_fixed_header', [], function (data) {

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
     * Table Header Selector
     *
     * @type {jQuery}
     */
    var $thead = $this.children('thead');

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Marks the end of the table.
     *
     * This value is used to stop the fixed header when the user reaches the end of the table.
     *
     * @type {Number}
     */
    var tableOffsetBottom = void 0;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * On DataTable Draw Event
     *
     * Re-calculate the table bottom offset value.
     */
    function _onDataTableDraw() {
        tableOffsetBottom = $this.offset().top + $this.height() - $thead.height();
    }

    /**
     * On DataTable Initialization
     *
     * Modify the table HTML and set the required event handling for the fixed header functionality.
     */
    function _onDataTableInit() {
        var $mainHeader = $('#main-header');
        var $contentHeader = $('.content-header');
        var $clone = $thead.clone();
        var originalTop = $thead.offset().top;
        var isFixed = false;
        var rollingAnimationInterval = null;

        $clone.hide().addClass('table-fixed-header-helper').prependTo($this);

        $(window).on('scroll', function () {
            var scrollTop = $(window).scrollTop();

            if (!isFixed && scrollTop + $mainHeader.outerHeight() > originalTop) {
                $this.addClass('table-fixed-header');
                $thead.outerWidth($this.outerWidth()).addClass('fixed');
                $clone.show();
                isFixed = true;
            } else if (isFixed && scrollTop + $mainHeader.outerHeight() < originalTop) {
                $this.removeClass('table-fixed-header');
                $thead.outerWidth('').removeClass('fixed');
                $clone.hide();
                isFixed = false;
            }

            if (scrollTop >= tableOffsetBottom) {
                $thead.removeClass('fixed');
            } else if ($(window).scrollTop() < tableOffsetBottom && !$thead.hasClass('fixed')) {
                $thead.addClass('fixed');
            }
        }).on('content_header:roll_in', function () {
            rollingAnimationInterval = setInterval(function () {
                $thead.css('top', $contentHeader.position().top + $contentHeader.outerHeight());
                if ($contentHeader.hasClass('fixed')) {
                    clearInterval(rollingAnimationInterval);
                }
            }, 1);
        }).on('content_header:roll_out', function () {
            clearInterval(rollingAnimationInterval);
            $thead.css('top', $mainHeader.outerHeight());
        });
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(window).on('JSENGINE_INIT_FINISHED', function () {
            $this.on('draw.dt', _onDataTableDraw).on('init.dt', _onDataTableInit);

            // Setup fixed header functionality if the table is already initialized.
            if ($this.DataTable().ajax.json() !== undefined) {
                _onDataTableInit();
            }
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9maXhlZF9oZWFkZXIuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiR0aGVhZCIsImNoaWxkcmVuIiwidGFibGVPZmZzZXRCb3R0b20iLCJfb25EYXRhVGFibGVEcmF3Iiwib2Zmc2V0IiwidG9wIiwiaGVpZ2h0IiwiX29uRGF0YVRhYmxlSW5pdCIsIiRtYWluSGVhZGVyIiwiJGNvbnRlbnRIZWFkZXIiLCIkY2xvbmUiLCJjbG9uZSIsIm9yaWdpbmFsVG9wIiwiaXNGaXhlZCIsInJvbGxpbmdBbmltYXRpb25JbnRlcnZhbCIsImhpZGUiLCJhZGRDbGFzcyIsInByZXBlbmRUbyIsIndpbmRvdyIsIm9uIiwic2Nyb2xsVG9wIiwib3V0ZXJIZWlnaHQiLCJvdXRlcldpZHRoIiwic2hvdyIsInJlbW92ZUNsYXNzIiwiaGFzQ2xhc3MiLCJzZXRJbnRlcnZhbCIsImNzcyIsInBvc2l0aW9uIiwiY2xlYXJJbnRlcnZhbCIsImluaXQiLCJkb25lIiwiRGF0YVRhYmxlIiwiYWpheCIsImpzb24iLCJ1bmRlZmluZWQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7QUFjQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQXFCLHdCQUFyQixFQUErQyxFQUEvQyxFQUFtRCxVQUFVQyxJQUFWLEVBQWdCOztBQUUvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFNBQVNGLE1BQU1HLFFBQU4sQ0FBZSxPQUFmLENBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTUwsU0FBUyxFQUFmOztBQUVBOzs7Ozs7O0FBT0EsUUFBSU0sMEJBQUo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLGFBQVNDLGdCQUFULEdBQTRCO0FBQ3hCRCw0QkFBb0JKLE1BQU1NLE1BQU4s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IiwiZmlsZSI6ImRhdGF0YWJsZV9maXhlZF9oZWFkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGF0YWJsZV9maXhlZF9oZWFkZXIuanMgMjAxNi0wNy0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRW5hYmxlIEZpeGVkIERhdGFUYWJsZSBIZWFkZXJcbiAqXG4gKiBUaGUgdGFibGUgaGVhZGVyIHdpbGwgcmVtYWluIGluIHRoZSB2aWV3cG9ydCBhcyB0aGUgdXNlciBzY3JvbGxzIGRvd24gdGhlIHBhZ2UuIFRoZSBzdHlsZSBjaGFuZ2Ugb2YgdGhpc1xuICogbW9kdWxlIGlzIGEgYml0IHRyaWNreSBiZWNhdXNlIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSB0aGVhZCBmcm9tIHRoZSBub3JtYWwgZmxvdywgc29tZXRoaW5nIHRoYXQgYnJlYWtzIHRoZVxuICogZGlzcGxheSBvZiB0aGUgdGFibGUuIFRoZXJlZm9yZSBhIGhlbHBlciBjbG9uZSBvZiB0aGUgdGhlYWQgaXMgdXNlZCB0byBtYWludGFpbiB0aGUgdGFibGUgZm9ybWF0dGluZy5cbiAqXG4gKiAqKk5vdGljZSAjMSoqOiBUaGUgLnRhYmxlLWZpeGVkLWhlYWRlciBjbGFzcyBpcyBzdHlsZWQgYnkgdGhlIF90YWJsZXMuc2NzcyBhbmQgaXMgcGFydCBvZiB0aGlzIHNvbHV0aW9uLlxuICpcbiAqICoqTm90aWNlICMyKio6IFRoaXMgbWV0aG9kIHdpbGwgdGFrZSBpbnRvIGNvbmNlcm4gdGhlIC5jb250ZW50LWhlYWRlciBlbGVtZW50IHdoaWNoIHNob3VsZG4ndCBvdmVybGFwIHRoZVxuICogdGFibGUgaGVhZGVyLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9kYXRhdGFibGVfZml4ZWRfaGVhZGVyXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKCdkYXRhdGFibGVfZml4ZWRfaGVhZGVyJywgW10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBUYWJsZSBIZWFkZXIgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoZWFkID0gJHRoaXMuY2hpbGRyZW4oJ3RoZWFkJyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvKipcbiAgICAgKiBNYXJrcyB0aGUgZW5kIG9mIHRoZSB0YWJsZS5cbiAgICAgKlxuICAgICAqIFRoaXMgdmFsdWUgaXMgdXNlZCB0byBzdG9wIHRoZSBmaXhlZCBoZWFkZXIgd2hlbiB0aGUgdXNlciByZWFjaGVzIHRoZSBlbmQgb2YgdGhlIHRhYmxlLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICBsZXQgdGFibGVPZmZzZXRCb3R0b207XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE9uIERhdGFUYWJsZSBEcmF3IEV2ZW50XG4gICAgICpcbiAgICAgKiBSZS1jYWxjdWxhdGUgdGhlIHRhYmxlIGJvdHRvbSBvZmZzZXQgdmFsdWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uRGF0YVRhYmxlRHJhdygpIHtcbiAgICAgICAgdGFibGVPZmZzZXRCb3R0b20gPSAkdGhpcy5vZmZzZXQoKS50b3AgKyAkdGhpcy5oZWlnaHQoKSAtICR0aGVhZC5oZWlnaHQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBEYXRhVGFibGUgSW5pdGlhbGl6YXRpb25cbiAgICAgKlxuICAgICAqIE1vZGlmeSB0aGUgdGFibGUgSFRNTCBhbmQgc2V0IHRoZSByZXF1aXJlZCBldmVudCBoYW5kbGluZyBmb3IgdGhlIGZpeGVkIGhlYWRlciBmdW5jdGlvbmFsaXR5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkRhdGFUYWJsZUluaXQoKSB7XG4gICAgICAgIGNvbnN0ICRtYWluSGVhZGVyID0gJCgnI21haW4taGVhZGVyJyk7XG4gICAgICAgIGNvbnN0ICRjb250ZW50SGVhZGVyID0gJCgnLmNvbnRlbnQtaGVhZGVyJyk7XG4gICAgICAgIGNvbnN0ICRjbG9uZSA9ICR0aGVhZC5jbG9uZSgpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbFRvcCA9ICR0aGVhZC5vZmZzZXQoKS50b3A7XG4gICAgICAgIGxldCBpc0ZpeGVkID0gZmFsc2U7XG4gICAgICAgIGxldCByb2xsaW5nQW5pbWF0aW9uSW50ZXJ2YWwgPSBudWxsO1xuXG4gICAgICAgICRjbG9uZVxuICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgICAgLmFkZENsYXNzKCd0YWJsZS1maXhlZC1oZWFkZXItaGVscGVyJylcbiAgICAgICAgICAgIC5wcmVwZW5kVG8oJHRoaXMpO1xuXG4gICAgICAgICQod2luZG93KVxuICAgICAgICAgICAgLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZpeGVkICYmIHNjcm9sbFRvcCArICRtYWluSGVhZGVyLm91dGVySGVpZ2h0KCkgPiBvcmlnaW5hbFRvcCkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygndGFibGUtZml4ZWQtaGVhZGVyJyk7XG4gICAgICAgICAgICAgICAgICAgICR0aGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgLm91dGVyV2lkdGgoJHRoaXMub3V0ZXJXaWR0aCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgICAgICAgICAkY2xvbmUuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICBpc0ZpeGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzRml4ZWQgJiYgc2Nyb2xsVG9wICsgJG1haW5IZWFkZXIub3V0ZXJIZWlnaHQoKSA8IG9yaWdpbmFsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKCd0YWJsZS1maXhlZC1oZWFkZXInKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAub3V0ZXJXaWR0aCgnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgJGNsb25lLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaXNGaXhlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3AgPj0gdGFibGVPZmZzZXRCb3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoZWFkLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpIDwgdGFibGVPZmZzZXRCb3R0b20gJiYgISR0aGVhZC5oYXNDbGFzcygnZml4ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkdGhlYWQuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5vbignY29udGVudF9oZWFkZXI6cm9sbF9pbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByb2xsaW5nQW5pbWF0aW9uSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICR0aGVhZC5jc3MoJ3RvcCcsICRjb250ZW50SGVhZGVyLnBvc2l0aW9uKCkudG9wICsgJGNvbnRlbnRIZWFkZXIub3V0ZXJIZWlnaHQoKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkY29udGVudEhlYWRlci5oYXNDbGFzcygnZml4ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChyb2xsaW5nQW5pbWF0aW9uSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm9uKCdjb250ZW50X2hlYWRlcjpyb2xsX291dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHJvbGxpbmdBbmltYXRpb25JbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgJHRoZWFkLmNzcygndG9wJywgJG1haW5IZWFkZXIub3V0ZXJIZWlnaHQoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICQod2luZG93KS5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsICgpID0+IHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdkcmF3LmR0JywgX29uRGF0YVRhYmxlRHJhdylcbiAgICAgICAgICAgICAgICAub24oJ2luaXQuZHQnLCBfb25EYXRhVGFibGVJbml0KTtcblxuICAgICAgICAgICAgLy8gU2V0dXAgZml4ZWQgaGVhZGVyIGZ1bmN0aW9uYWxpdHkgaWYgdGhlIHRhYmxlIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQuXG4gICAgICAgICAgICBpZiAoJHRoaXMuRGF0YVRhYmxlKCkuYWpheC5qc29uKCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIF9vbkRhdGFUYWJsZUluaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuXG59KTsiXX0=
