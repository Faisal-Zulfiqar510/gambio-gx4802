'use strict';

/* --------------------------------------------------------------
 scroll_top.js 2015-09-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Scroll Top Module
 *
 * This module will display a scroll-to-top arrow on the left side of the admin menu. When the users
 * press this arrow the browser will automatically scroll to the top of the page.
 *
 * @module Compatibility/scroll_top
 */
gx.compatibility.module(
// Module name
'scroll_top',

// Module dependencies
[],

/**  @lends module:Compatibility/scroll_top */

function () {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var module = {},
        $button;

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    var _initialize = function _initialize() {
        $button = $('<div>').addClass('js-scroll-top-button').html('<i class="fa fa-caret-up"></i>').hide().appendTo('body').on('click', function () {
            $('html, body').animate({
                scrollTop: 0
            });
        });

        $(document).on('scroll', function () {
            var reachedMinimumScrolled = $(document).scrollTop() > 2500,
                reachedDocumentBottom = $(document).scrollTop() + window.innerHeight === $(document).height();

            // Fade In / Out
            if (reachedMinimumScrolled) {
                $button.fadeIn();
            } else {
                $button.fadeOut();
            }

            // Fix poistion
            if (reachedMinimumScrolled) {
                $button.css({
                    bottom: reachedDocumentBottom ? '100px' : '50px'
                });
            }
        });

        $(document).on('leftmenu:collapse', function () {
            $button.animate({
                left: '9px'
            });
        });

        $(document).on('leftmenu:expand', function () {
            $button.animate({
                left: '89px'
            });
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _initialize();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjcm9sbF90b3AuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiJGJ1dHRvbiIsIl9pbml0aWFsaXplIiwiJCIsImFkZENsYXNzIiwiaHRtbCIsImhpZGUiLCJhcHBlbmRUbyIsIm9uIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsImRvY3VtZW50IiwicmVhY2hlZE1pbmltdW1TY3JvbGxlZCIsInJlYWNoZWREb2N1bWVudEJvdHRvbSIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiaGVpZ2h0IiwiZmFkZUluIiwiZmFkZU91dCIsImNzcyIsImJvdHRvbSIsImxlZnQiLCJpbml0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7OztBQVFBQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQjtBQUNJO0FBQ0EsWUFGSjs7QUFJSTtBQUNBLEVBTEo7O0FBT0k7O0FBRUEsWUFBWTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUEsU0FBUyxFQUFiO0FBQUEsUUFDSUMsT0FESjs7QUFHQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUMsY0FBYyxTQUFkQSxXQUFjLEdBQVk7QUFDMUJELGtCQUFVRSxFQUFFLE9BQUYsRUFDTEMsUUFESyxDQUNJLHNCQURKLEVBRUxDLElBRkssQ0FFQSxnQ0FGQSxFQUdMQyxJQUhLLEdBSUxDLFFBSkssQ0FJSSxNQUpKLEVBS0xDLEVBTEssQ0FLRixPQUxFLEVBS08sWUFBWTtBQUNyQkwsY0FBRSxZQUFGLEVBQWdCTSxPQUFoQixDQUF3QjtBQUNwQkMsMkJBQVc7QUFEUyxhQUF4QjtBQUdILFNBVEssQ0FBVjs7QUFXQVAsVUFBRVEsUUFBRixFQUFZSCxFQUFaLENBQWUsUUFBZixFQUF5QixZQUFZO0FBQ2pDLGdCQUFJSSx5QkFBMEJULEVBQUVRLFFBQUYsRUFBWUQsU0FBWixLQUEwQixJQUF4RDtBQUFBLGdCQUNJRyx3QkFDSVYsRUFBRVEsUUFBRixFQUFZRCxTQUFaLEtBQ0FJLE9BQU9DLFdBRFAsS0FDdUJaLEVBQUVRLFFBQUYsRUFBWUssTUFBWixFQUgvQjs7QUFLQTtBQUNBLGdCQUFJSixzQkFBSixFQUE0QjtBQUN4Qlgsd0JBQVFnQixNQUFSO0FBQ0gsYUFGRCxNQUVPO0FBQ0hoQix3QkFBUWlCLE9BQVI7QUFDSDs7QUFFRDtBQUNBLGdCQUFJTixzQkFBSixFQUE0QjtBQUN4Qlgsd0JBQVFrQixHQUFSLENBQVk7QUFDUkMsNEJBQVNQLHdCQUF3QixPQUF4QixHQUFrQztBQURuQyxpQkFBWjtBQUdIO0FBQ0osU0FuQkQ7O0FBcUJBVixVQUFFUSxRQUFGLEVBQVlILEVBQVosQ0FBZSxtQkFBZixFQUFvQyxZQUFZO0FBQzVDUCxvQkFBUVEsT0FBUixDQUFnQjtBQUNaWSxzQkFBTTtBQURNLGFBQWhCO0FBR0gsU0FKRDs7QUFNQWxCLFVBQUVRLFFBQUYsRUFBWUgsRUFBWixDQUFlLGlCQUFmLEVBQWtDLFlBQVk7QUFDMUNQLG9CQUFRUSxPQUFSLENBQWdCO0FBQ1pZLHNCQUFNO0FBRE0sYUFBaEI7QUFHSCxTQUpEO0FBS0gsS0E1Q0Q7O0FBOENBO0FBQ0E7QUFDQTs7QUFFQXJCLFdBQU9zQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnJCO0FBQ0FxQjtBQUNILEtBSEQ7O0FBS0EsV0FBT3ZCLE1BQVA7QUFDSCxDQWhGTCIsImZpbGUiOiJzY3JvbGxfdG9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzY3JvbGxfdG9wLmpzIDIwMTUtMDktMjNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFNjcm9sbCBUb3AgTW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCBkaXNwbGF5IGEgc2Nyb2xsLXRvLXRvcCBhcnJvdyBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBhZG1pbiBtZW51LiBXaGVuIHRoZSB1c2Vyc1xuICogcHJlc3MgdGhpcyBhcnJvdyB0aGUgYnJvd3NlciB3aWxsIGF1dG9tYXRpY2FsbHkgc2Nyb2xsIHRvIHRoZSB0b3Agb2YgdGhlIHBhZ2UuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L3Njcm9sbF90b3BcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgLy8gTW9kdWxlIG5hbWVcbiAgICAnc2Nyb2xsX3RvcCcsXG5cbiAgICAvLyBNb2R1bGUgZGVwZW5kZW5jaWVzXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9zY3JvbGxfdG9wICovXG5cbiAgICBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgbW9kdWxlID0ge30sXG4gICAgICAgICAgICAkYnV0dG9uO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRidXR0b24gPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdqcy1zY3JvbGwtdG9wLWJ1dHRvbicpXG4gICAgICAgICAgICAgICAgLmh0bWwoJzxpIGNsYXNzPVwiZmEgZmEtY2FyZXQtdXBcIj48L2k+JylcbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdib2R5JylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IDBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlYWNoZWRNaW5pbXVtU2Nyb2xsZWQgPSAoJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgPiAyNTAwKSxcbiAgICAgICAgICAgICAgICAgICAgcmVhY2hlZERvY3VtZW50Qm90dG9tID0gKFxuICAgICAgICAgICAgICAgICAgICAgICAgJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmlubmVySGVpZ2h0ID09PSAkKGRvY3VtZW50KS5oZWlnaHQoKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBGYWRlIEluIC8gT3V0XG4gICAgICAgICAgICAgICAgaWYgKHJlYWNoZWRNaW5pbXVtU2Nyb2xsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5mYWRlSW4oKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBGaXggcG9pc3Rpb25cbiAgICAgICAgICAgICAgICBpZiAocmVhY2hlZE1pbmltdW1TY3JvbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IChyZWFjaGVkRG9jdW1lbnRCb3R0b20gPyAnMTAwcHgnIDogJzUwcHgnKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2xlZnRtZW51OmNvbGxhcHNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRidXR0b24uYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICc5cHgnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2xlZnRtZW51OmV4cGFuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnODlweCdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBfaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
