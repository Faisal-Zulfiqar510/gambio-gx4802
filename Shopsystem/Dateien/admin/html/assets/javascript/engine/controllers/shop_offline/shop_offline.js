'use strict';

/* --------------------------------------------------------------
 shop_offline.js 2016-09-06
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * General Controller of Shop Online/Offline
 */
gx.controllers.module('shop_offline', [], function (data) {

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

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    function _toggleLanguageSelection() {
        var $languagesButtonBar = $('.languages.buttonbar');

        if ($(this).attr('href') === '#status') {
            $languagesButtonBar.css('visibility', 'hidden');
        } else {
            $languagesButtonBar.css('visibility', 'visible');
        }
    }

    function _correctCodeMirrorDisplay() {
        setTimeout(function () {
            $('.CodeMirror:visible').each(function (index, codeMirror) {
                codeMirror.CodeMirror.refresh();
            });
        }, 100);
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.find('.tab-headline-wrapper > a').on('click', _toggleLanguageSelection).on('click', _correctCodeMirrorDisplay);

        _toggleLanguageSelection.call($('.tab-headline-wrapper a')[0]);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3Bfb2ZmbGluZS9zaG9wX29mZmxpbmUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJfdG9nZ2xlTGFuZ3VhZ2VTZWxlY3Rpb24iLCIkbGFuZ3VhZ2VzQnV0dG9uQmFyIiwiYXR0ciIsImNzcyIsIl9jb3JyZWN0Q29kZU1pcnJvckRpc3BsYXkiLCJzZXRUaW1lb3V0IiwiZWFjaCIsImluZGV4IiwiY29kZU1pcnJvciIsIkNvZGVNaXJyb3IiLCJyZWZyZXNoIiwiaW5pdCIsImRvbmUiLCJmaW5kIiwib24iLCJjYWxsIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7OztBQUdBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsY0FBdEIsRUFBc0MsRUFBdEMsRUFBMEMsVUFBVUMsSUFBVixFQUFnQjs7QUFFdEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQVNJLHdCQUFULEdBQW9DO0FBQ2hDLFlBQU1DLHNCQUFzQkYsRUFBRSxzQkFBRixDQUE1Qjs7QUFFQSxZQUFJQSxFQUFFLElBQUYsRUFBUUcsSUFBUixDQUFhLE1BQWIsTUFBeUIsU0FBN0IsRUFBd0M7QUFDcENELGdDQUFvQkUsR0FBcEIsQ0FBd0IsWUFBeEIsRUFBc0MsUUFBdEM7QUFDSCxTQUZELE1BRU87QUFDSEYsZ0NBQW9CRSxHQUFwQixDQUF3QixZQUF4QixFQUFzQyxTQUF0QztBQUNIO0FBQ0o7O0FBRUQsYUFBU0MseUJBQVQsR0FBcUM7QUFDakNDLG1CQUFXLFlBQU07QUFDYk4sY0FBRSxxQkFBRixFQUF5Qk8sSUFBekIsQ0FBOEIsVUFBQ0MsS0FBRCxFQUFRQyxVQUFSLEVBQXVCO0FBQ2pEQSwyQkFBV0MsVUFBWCxDQUFzQkMsT0FBdEI7QUFDSCxhQUZEO0FBR0gsU0FKRCxFQUlHLEdBSkg7QUFLSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFkLFdBQU9lLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCZCxjQUFNZSxJQUFOLENBQVcsMkJBQVgsRUFDS0MsRUFETCxDQUNRLE9BRFIsRUFDaUJkLHdCQURqQixFQUVLYyxFQUZMLENBRVEsT0FGUixFQUVpQlYseUJBRmpCOztBQUlBSixpQ0FBeUJlLElBQXpCLENBQThCaEIsRUFBRSx5QkFBRixFQUE2QixDQUE3QixDQUE5Qjs7QUFFQWE7QUFDSCxLQVJEOztBQVVBLFdBQU9oQixNQUFQO0FBRUgsQ0E1REQiLCJmaWxlIjoic2hvcF9vZmZsaW5lL3Nob3Bfb2ZmbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2hvcF9vZmZsaW5lLmpzIDIwMTYtMDktMDZcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEdlbmVyYWwgQ29udHJvbGxlciBvZiBTaG9wIE9ubGluZS9PZmZsaW5lXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnc2hvcF9vZmZsaW5lJywgW10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGZ1bmN0aW9uIF90b2dnbGVMYW5ndWFnZVNlbGVjdGlvbigpIHtcbiAgICAgICAgY29uc3QgJGxhbmd1YWdlc0J1dHRvbkJhciA9ICQoJy5sYW5ndWFnZXMuYnV0dG9uYmFyJyk7XG5cbiAgICAgICAgaWYgKCQodGhpcykuYXR0cignaHJlZicpID09PSAnI3N0YXR1cycpIHtcbiAgICAgICAgICAgICRsYW5ndWFnZXNCdXR0b25CYXIuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGxhbmd1YWdlc0J1dHRvbkJhci5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2NvcnJlY3RDb2RlTWlycm9yRGlzcGxheSgpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkKCcuQ29kZU1pcnJvcjp2aXNpYmxlJykuZWFjaCgoaW5kZXgsIGNvZGVNaXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb2RlTWlycm9yLkNvZGVNaXJyb3IucmVmcmVzaCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpcy5maW5kKCcudGFiLWhlYWRsaW5lLXdyYXBwZXIgPiBhJylcbiAgICAgICAgICAgIC5vbignY2xpY2snLCBfdG9nZ2xlTGFuZ3VhZ2VTZWxlY3Rpb24pXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgX2NvcnJlY3RDb2RlTWlycm9yRGlzcGxheSk7XG5cbiAgICAgICAgX3RvZ2dsZUxhbmd1YWdlU2VsZWN0aW9uLmNhbGwoJCgnLnRhYi1oZWFkbGluZS13cmFwcGVyIGEnKVswXSk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuXG59KTsgIl19
