'use strict';

/* --------------------------------------------------------------
 language_selection.js 2016-06-03
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('language_selection', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js'], function (data) {

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

    /**
     * On Language Link Click
     *
     * Prevent the default link behavior and regenerate the correct URL by taking into concern the dynamic
     * GET parameters (e.g. from table filtering).
     *
     * @param {jQuery.Event} event
     */
    function _onClickLanguageLink(event) {
        event.preventDefault();

        var currentUrlParameters = $.deparam(window.location.search.slice(1));

        currentUrlParameters.language = $(this).data('languageCode');

        window.location.href = window.location.pathname + '?' + $.param(currentUrlParameters);
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', 'a', _onClickLanguageLink);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9mb290ZXIvbGFuZ3VhZ2Vfc2VsZWN0aW9uLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiX29uQ2xpY2tMYW5ndWFnZUxpbmsiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiY3VycmVudFVybFBhcmFtZXRlcnMiLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzbGljZSIsImxhbmd1YWdlIiwiaHJlZiIsInBhdGhuYW1lIiwicGFyYW0iLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLG9CQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCxrREFISixFQU9JLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNTCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQVFBLGFBQVNNLG9CQUFULENBQThCQyxLQUE5QixFQUFxQztBQUNqQ0EsY0FBTUMsY0FBTjs7QUFFQSxZQUFNQyx1QkFBdUJKLEVBQUVLLE9BQUYsQ0FBVUMsT0FBT0MsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJDLEtBQXZCLENBQTZCLENBQTdCLENBQVYsQ0FBN0I7O0FBRUFMLDZCQUFxQk0sUUFBckIsR0FBZ0NWLEVBQUUsSUFBRixFQUFRRixJQUFSLENBQWEsY0FBYixDQUFoQzs7QUFFQVEsZUFBT0MsUUFBUCxDQUFnQkksSUFBaEIsR0FBdUJMLE9BQU9DLFFBQVAsQ0FBZ0JLLFFBQWhCLEdBQTJCLEdBQTNCLEdBQWlDWixFQUFFYSxLQUFGLENBQVFULG9CQUFSLENBQXhEO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBVCxXQUFPbUIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJoQixjQUFNaUIsRUFBTixDQUFTLE9BQVQsRUFBa0IsR0FBbEIsRUFBdUJmLG9CQUF2QjtBQUNBYztBQUNILEtBSEQ7O0FBS0EsV0FBT3BCLE1BQVA7QUFFSCxDQTlETCIsImZpbGUiOiJsYXlvdXRzL21haW4vZm9vdGVyL2xhbmd1YWdlX3NlbGVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gbGFuZ3VhZ2Vfc2VsZWN0aW9uLmpzIDIwMTYtMDYtMDNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2xhbmd1YWdlX3NlbGVjdGlvbicsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9qcXVlcnktZGVwYXJhbS9qcXVlcnktZGVwYXJhbS5taW4uanNgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIExhbmd1YWdlIExpbmsgQ2xpY2tcbiAgICAgICAgICpcbiAgICAgICAgICogUHJldmVudCB0aGUgZGVmYXVsdCBsaW5rIGJlaGF2aW9yIGFuZCByZWdlbmVyYXRlIHRoZSBjb3JyZWN0IFVSTCBieSB0YWtpbmcgaW50byBjb25jZXJuIHRoZSBkeW5hbWljXG4gICAgICAgICAqIEdFVCBwYXJhbWV0ZXJzIChlLmcuIGZyb20gdGFibGUgZmlsdGVyaW5nKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25DbGlja0xhbmd1YWdlTGluayhldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgY3VycmVudFVybFBhcmFtZXRlcnMgPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRVcmxQYXJhbWV0ZXJzLmxhbmd1YWdlID0gJCh0aGlzKS5kYXRhKCdsYW5ndWFnZUNvZGUnKTtcblxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAnPycgKyAkLnBhcmFtKGN1cnJlbnRVcmxQYXJhbWV0ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnYScsIF9vbkNsaWNrTGFuZ3VhZ2VMaW5rKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuXG4gICAgfSk7ICJdfQ==
