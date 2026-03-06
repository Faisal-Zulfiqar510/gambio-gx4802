'use strict';

/* --------------------------------------------------------------
 scroll_to_top.js 2016-04-25
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Scroll to top functionality.
 */
gx.controllers.module('scroll_to_top', [], function () {

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
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Animation Flag
     *
     * @type {Boolean}
     */
    var onAnimation = false;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * On Window Scroll
     *
     * If the site content is large and the user has scrolled to bottom display the caret icon.
     */
    function _onWindowScroll() {
        var scrollPercentage = ($(window).scrollTop() + window.innerHeight) / $(document).outerHeight();

        if (!onAnimation && !$('#main-menu > nav > ul').hasClass('collapse') && scrollPercentage > 0.9 && $(document).outerHeight() > 2500) {
            $this.fadeIn();
        } else if ($this.is(':visible')) {
            $this.fadeOut();
        }
    }

    /**
     * On Icon Click
     *
     * Scroll to the top of the page whenever the user clicks on the caret icon.
     */
    function _onIconClick() {
        onAnimation = true;

        $('html, body').animate({
            scrollTop: 0
        }, 'fast', function () {
            onAnimation = false;
        });

        $this.fadeOut();
    }

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(window).on('scroll', _onWindowScroll);
        $this.on('click', 'i', _onIconClick);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9tZW51L3Njcm9sbF90b190b3AuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsIiR0aGlzIiwiJCIsIm9uQW5pbWF0aW9uIiwiX29uV2luZG93U2Nyb2xsIiwic2Nyb2xsUGVyY2VudGFnZSIsIndpbmRvdyIsInNjcm9sbFRvcCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnQiLCJvdXRlckhlaWdodCIsImhhc0NsYXNzIiwiZmFkZUluIiwiaXMiLCJmYWRlT3V0IiwiX29uSWNvbkNsaWNrIiwiYW5pbWF0ZSIsImluaXQiLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7O0FBR0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixlQUF0QixFQUF1QyxFQUF2QyxFQUEyQyxZQUFZOztBQUVuRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1GLFNBQVMsRUFBZjs7QUFFQTs7Ozs7QUFLQSxRQUFJRyxjQUFjLEtBQWxCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxhQUFTQyxlQUFULEdBQTJCO0FBQ3ZCLFlBQUlDLG1CQUFtQixDQUFDSCxFQUFFSSxNQUFGLEVBQVVDLFNBQVYsS0FBd0JELE9BQU9FLFdBQWhDLElBQStDTixFQUFFTyxRQUFGLEVBQVlDLFdBQVosRUFBdEU7O0FBRUEsWUFBSSxDQUFDUCxXQUFELElBQWdCLENBQUNELEVBQUUsdUJBQUYsRUFBMkJTLFFBQTNCLENBQW9DLFVBQXBDLENBQWpCLElBQ0dOLG1CQUFtQixHQUR0QixJQUM2QkgsRUFBRU8sUUFBRixFQUFZQyxXQUFaLEtBQTRCLElBRDdELEVBQ21FO0FBQy9EVCxrQkFBTVcsTUFBTjtBQUNILFNBSEQsTUFHTyxJQUFJWCxNQUFNWSxFQUFOLENBQVMsVUFBVCxDQUFKLEVBQTBCO0FBQzdCWixrQkFBTWEsT0FBTjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7O0FBS0EsYUFBU0MsWUFBVCxHQUF3QjtBQUNwQlosc0JBQWMsSUFBZDs7QUFFQUQsVUFBRSxZQUFGLEVBQWdCYyxPQUFoQixDQUF3QjtBQUNwQlQsdUJBQVc7QUFEUyxTQUF4QixFQUVHLE1BRkgsRUFFVyxZQUFZO0FBQ25CSiwwQkFBYyxLQUFkO0FBQ0gsU0FKRDs7QUFNQUYsY0FBTWEsT0FBTjtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQWQsV0FBT2lCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCaEIsVUFBRUksTUFBRixFQUFVYSxFQUFWLENBQWEsUUFBYixFQUF1QmYsZUFBdkI7QUFDQUgsY0FBTWtCLEVBQU4sQ0FBUyxPQUFULEVBQWtCLEdBQWxCLEVBQXVCSixZQUF2QjtBQUNBRztBQUNILEtBSkQ7O0FBTUEsV0FBT2xCLE1BQVA7QUFFSCxDQTlFRCIsImZpbGUiOiJsYXlvdXRzL21haW4vbWVudS9zY3JvbGxfdG9fdG9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzY3JvbGxfdG9fdG9wLmpzIDIwMTYtMDQtMjVcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFNjcm9sbCB0byB0b3AgZnVuY3Rpb25hbGl0eS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdzY3JvbGxfdG9fdG9wJywgW10sIGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFuaW1hdGlvbiBGbGFnXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBsZXQgb25BbmltYXRpb24gPSBmYWxzZTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogT24gV2luZG93IFNjcm9sbFxuICAgICAqXG4gICAgICogSWYgdGhlIHNpdGUgY29udGVudCBpcyBsYXJnZSBhbmQgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHRvIGJvdHRvbSBkaXNwbGF5IHRoZSBjYXJldCBpY29uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbldpbmRvd1Njcm9sbCgpIHtcbiAgICAgICAgbGV0IHNjcm9sbFBlcmNlbnRhZ2UgPSAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgd2luZG93LmlubmVySGVpZ2h0KSAvICQoZG9jdW1lbnQpLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKCFvbkFuaW1hdGlvbiAmJiAhJCgnI21haW4tbWVudSA+IG5hdiA+IHVsJykuaGFzQ2xhc3MoJ2NvbGxhcHNlJylcbiAgICAgICAgICAgICYmIHNjcm9sbFBlcmNlbnRhZ2UgPiAwLjkgJiYgJChkb2N1bWVudCkub3V0ZXJIZWlnaHQoKSA+IDI1MDApIHtcbiAgICAgICAgICAgICR0aGlzLmZhZGVJbigpO1xuICAgICAgICB9IGVsc2UgaWYgKCR0aGlzLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAkdGhpcy5mYWRlT3V0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBJY29uIENsaWNrXG4gICAgICpcbiAgICAgKiBTY3JvbGwgdG8gdGhlIHRvcCBvZiB0aGUgcGFnZSB3aGVuZXZlciB0aGUgdXNlciBjbGlja3Mgb24gdGhlIGNhcmV0IGljb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uSWNvbkNsaWNrKCkge1xuICAgICAgICBvbkFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgc2Nyb2xsVG9wOiAwXG4gICAgICAgIH0sICdmYXN0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb25BbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHRoaXMuZmFkZU91dCgpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfb25XaW5kb3dTY3JvbGwpO1xuICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnaScsIF9vbkljb25DbGljayk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcblxufSk7ICJdfQ==
