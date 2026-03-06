'use strict';

/* --------------------------------------------------------------
 viewport.js 2016-06-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('viewport', [], function (data) {

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
     * Info Row
     *
     * @type {jQuery}
     */
    var $infoRow = $('#main-footer .info.row');

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Checks if the provided dropdown is out of the vertical viewport.
     *
     * @param {jQuery} $dropDownMenu
     *
     * @returns {boolean}
     */
    function _isDropDownOutOfVerticalView($dropDownMenu) {
        var infoRowTopPosition = $infoRow.offset().top;
        var dropDownMenuTopPosition = $dropDownMenu.height() + $dropDownMenu.siblings('.dropdown-toggle').offset().top;

        return dropDownMenuTopPosition > infoRowTopPosition;
    }

    /**
     * Checks if the provided dropdown is out of the horizontal viewport.
     *
     * @param {jQuery} $dropDownMenu
     *
     * @returns {boolean}
     */
    function _isDropDownOutOfHorizontalView($dropDownMenu) {
        var viewportWidth = $('body').width();
        var dropDownMenuLeftPosition = $dropDownMenu.width() + $dropDownMenu.siblings('.dropdown-toggle').prev().offset().left;

        return dropDownMenuLeftPosition > viewportWidth;
    }

    /**
     * Adjust the dropdown position, depending on the current viewport.
     */
    function _adjustDropDownPosition() {

        var $target = $(this);

        var $dropDownMenu = $target.find('.dropdown-menu');

        // Put the dropdown menu above the clicked target,
        // if the menu would touch or even be larger than the info row in the main footer.
        if (_isDropDownOutOfVerticalView($dropDownMenu)) {
            $target.addClass('dropup');
            $target.removeClass('dropdown');
            $target.find('.caret').addClass('caret-reversed');
        } else if ($target.hasClass('dropup')) {
            $target.removeClass('dropup');
            $target.addClass('dropdown');
            $target.find('.caret').removeClass('caret-reversed');
        }

        if (_isDropDownOutOfHorizontalView($dropDownMenu)) {
            $dropDownMenu.addClass('dropdown-menu-right');
        } else if ($target.hasClass('dropdown-menu-right')) {
            $target.removeClass('dropdown-menu-right');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('body').on('show.bs.dropdown', '.btn-group.dropdown, .btn-group.dropup', _adjustDropDownPosition);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi92aWV3cG9ydC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRpbmZvUm93IiwiX2lzRHJvcERvd25PdXRPZlZlcnRpY2FsVmlldyIsIiRkcm9wRG93bk1lbnUiLCJpbmZvUm93VG9wUG9zaXRpb24iLCJvZmZzZXQiLCJ0b3AiLCJkcm9wRG93bk1lbnVUb3BQb3NpdGlvbiIsImhlaWdodCIsInNpYmxpbmdzIiwiX2lzRHJvcERvd25PdXRPZkhvcml6b250YWxWaWV3Iiwidmlld3BvcnRXaWR0aCIsIndpZHRoIiwiZHJvcERvd25NZW51TGVmdFBvc2l0aW9uIiwicHJldiIsImxlZnQiLCJfYWRqdXN0RHJvcERvd25Qb3NpdGlvbiIsIiR0YXJnZXQiLCJmaW5kIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImhhc0NsYXNzIiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsVUFBdEIsRUFBa0MsRUFBbEMsRUFBc0MsVUFBVUMsSUFBVixFQUFnQjs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTUksV0FBV0QsRUFBRSx3QkFBRixDQUFqQjs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQSxhQUFTRSw0QkFBVCxDQUFzQ0MsYUFBdEMsRUFBcUQ7QUFDakQsWUFBTUMscUJBQXFCSCxTQUFTSSxNQUFULEdBQWtCQyxHQUE3QztBQUNBLFlBQU1DLDBCQUEwQkosY0FBY0ssTUFBZCxLQUF5QkwsY0FBY00sUUFBZCxDQUF1QixrQkFBdkIsRUFBMkNKLE1BQTNDLEdBQW9EQyxHQUE3Rzs7QUFFQSxlQUFPQywwQkFBMEJILGtCQUFqQztBQUNIOztBQUVEOzs7Ozs7O0FBT0EsYUFBU00sOEJBQVQsQ0FBd0NQLGFBQXhDLEVBQXVEO0FBQ25ELFlBQU1RLGdCQUFnQlgsRUFBRSxNQUFGLEVBQVVZLEtBQVYsRUFBdEI7QUFDQSxZQUFNQywyQkFBMkJWLGNBQWNTLEtBQWQsS0FBd0JULGNBQWNNLFFBQWQsQ0FBdUIsa0JBQXZCLEVBQ3BESyxJQURvRCxHQUVwRFQsTUFGb0QsR0FFM0NVLElBRmQ7O0FBSUEsZUFBT0YsMkJBQTJCRixhQUFsQztBQUNIOztBQUVEOzs7QUFHQSxhQUFTSyx1QkFBVCxHQUFtQzs7QUFFL0IsWUFBTUMsVUFBVWpCLEVBQUUsSUFBRixDQUFoQjs7QUFFQSxZQUFJRyxnQkFBZ0JjLFFBQVFDLElBQVIsQ0FBYSxnQkFBYixDQUFwQjs7QUFFQTtBQUNBO0FBQ0EsWUFBSWhCLDZCQUE2QkMsYUFBN0IsQ0FBSixFQUFpRDtBQUM3Q2Msb0JBQVFFLFFBQVIsQ0FBaUIsUUFBakI7QUFDQUYsb0JBQVFHLFdBQVIsQ0FBb0IsVUFBcEI7QUFDQUgsb0JBQVFDLElBQVIsQ0FBYSxRQUFiLEVBQXVCQyxRQUF2QixDQUFnQyxnQkFBaEM7QUFDSCxTQUpELE1BSU8sSUFBSUYsUUFBUUksUUFBUixDQUFpQixRQUFqQixDQUFKLEVBQWdDO0FBQ25DSixvQkFBUUcsV0FBUixDQUFvQixRQUFwQjtBQUNBSCxvQkFBUUUsUUFBUixDQUFpQixVQUFqQjtBQUNBRixvQkFBUUMsSUFBUixDQUFhLFFBQWIsRUFBdUJFLFdBQXZCLENBQW1DLGdCQUFuQztBQUNIOztBQUVELFlBQUlWLCtCQUErQlAsYUFBL0IsQ0FBSixFQUFtRDtBQUMvQ0EsMEJBQWNnQixRQUFkLENBQXVCLHFCQUF2QjtBQUNILFNBRkQsTUFFTyxJQUFJRixRQUFRSSxRQUFSLENBQWlCLHFCQUFqQixDQUFKLEVBQTZDO0FBQ2hESixvQkFBUUcsV0FBUixDQUFvQixxQkFBcEI7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXZCLFdBQU95QixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnZCLFVBQUUsTUFBRixFQUFVd0IsRUFBVixDQUFhLGtCQUFiLEVBQWlDLHdDQUFqQyxFQUEyRVIsdUJBQTNFOztBQUVBTztBQUNILEtBSkQ7O0FBTUEsV0FBTzFCLE1BQVA7QUFDSCxDQXZHRCIsImZpbGUiOiJsYXlvdXRzL21haW4vdmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHZpZXdwb3J0LmpzIDIwMTYtMDYtMTRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ3ZpZXdwb3J0JywgW10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvKipcbiAgICAgKiBJbmZvIFJvd1xuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkaW5mb1JvdyA9ICQoJyNtYWluLWZvb3RlciAuaW5mby5yb3cnKTtcblxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGRyb3Bkb3duIGlzIG91dCBvZiB0aGUgdmVydGljYWwgdmlld3BvcnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGRyb3BEb3duTWVudVxuICAgICAqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzRHJvcERvd25PdXRPZlZlcnRpY2FsVmlldygkZHJvcERvd25NZW51KSB7XG4gICAgICAgIGNvbnN0IGluZm9Sb3dUb3BQb3NpdGlvbiA9ICRpbmZvUm93Lm9mZnNldCgpLnRvcDtcbiAgICAgICAgY29uc3QgZHJvcERvd25NZW51VG9wUG9zaXRpb24gPSAkZHJvcERvd25NZW51LmhlaWdodCgpICsgJGRyb3BEb3duTWVudS5zaWJsaW5ncygnLmRyb3Bkb3duLXRvZ2dsZScpLm9mZnNldCgpLnRvcFxuXG4gICAgICAgIHJldHVybiBkcm9wRG93bk1lbnVUb3BQb3NpdGlvbiA+IGluZm9Sb3dUb3BQb3NpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGRyb3Bkb3duIGlzIG91dCBvZiB0aGUgaG9yaXpvbnRhbCB2aWV3cG9ydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkZHJvcERvd25NZW51XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNEcm9wRG93bk91dE9mSG9yaXpvbnRhbFZpZXcoJGRyb3BEb3duTWVudSkge1xuICAgICAgICBjb25zdCB2aWV3cG9ydFdpZHRoID0gJCgnYm9keScpLndpZHRoKCk7XG4gICAgICAgIGNvbnN0IGRyb3BEb3duTWVudUxlZnRQb3NpdGlvbiA9ICRkcm9wRG93bk1lbnUud2lkdGgoKSArICRkcm9wRG93bk1lbnUuc2libGluZ3MoJy5kcm9wZG93bi10b2dnbGUnKVxuICAgICAgICAgICAgLnByZXYoKVxuICAgICAgICAgICAgLm9mZnNldCgpLmxlZnQ7XG5cbiAgICAgICAgcmV0dXJuIGRyb3BEb3duTWVudUxlZnRQb3NpdGlvbiA+IHZpZXdwb3J0V2lkdGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRqdXN0IHRoZSBkcm9wZG93biBwb3NpdGlvbiwgZGVwZW5kaW5nIG9uIHRoZSBjdXJyZW50IHZpZXdwb3J0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9hZGp1c3REcm9wRG93blBvc2l0aW9uKCkge1xuXG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKHRoaXMpO1xuXG4gICAgICAgIGxldCAkZHJvcERvd25NZW51ID0gJHRhcmdldC5maW5kKCcuZHJvcGRvd24tbWVudScpO1xuXG4gICAgICAgIC8vIFB1dCB0aGUgZHJvcGRvd24gbWVudSBhYm92ZSB0aGUgY2xpY2tlZCB0YXJnZXQsXG4gICAgICAgIC8vIGlmIHRoZSBtZW51IHdvdWxkIHRvdWNoIG9yIGV2ZW4gYmUgbGFyZ2VyIHRoYW4gdGhlIGluZm8gcm93IGluIHRoZSBtYWluIGZvb3Rlci5cbiAgICAgICAgaWYgKF9pc0Ryb3BEb3duT3V0T2ZWZXJ0aWNhbFZpZXcoJGRyb3BEb3duTWVudSkpIHtcbiAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoJ2Ryb3B1cCcpO1xuICAgICAgICAgICAgJHRhcmdldC5yZW1vdmVDbGFzcygnZHJvcGRvd24nKTtcbiAgICAgICAgICAgICR0YXJnZXQuZmluZCgnLmNhcmV0JykuYWRkQ2xhc3MoJ2NhcmV0LXJldmVyc2VkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcygnZHJvcHVwJykpIHtcbiAgICAgICAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ2Ryb3B1cCcpO1xuICAgICAgICAgICAgJHRhcmdldC5hZGRDbGFzcygnZHJvcGRvd24nKTtcbiAgICAgICAgICAgICR0YXJnZXQuZmluZCgnLmNhcmV0JykucmVtb3ZlQ2xhc3MoJ2NhcmV0LXJldmVyc2VkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2lzRHJvcERvd25PdXRPZkhvcml6b250YWxWaWV3KCRkcm9wRG93bk1lbnUpKSB7XG4gICAgICAgICAgICAkZHJvcERvd25NZW51LmFkZENsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4gICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcygnZHJvcGRvd24tbWVudS1yaWdodCcpKSB7XG4gICAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKCdkcm9wZG93bi1tZW51LXJpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkKCdib2R5Jykub24oJ3Nob3cuYnMuZHJvcGRvd24nLCAnLmJ0bi1ncm91cC5kcm9wZG93biwgLmJ0bi1ncm91cC5kcm9wdXAnLCBfYWRqdXN0RHJvcERvd25Qb3NpdGlvbik7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7XG4iXX0=
