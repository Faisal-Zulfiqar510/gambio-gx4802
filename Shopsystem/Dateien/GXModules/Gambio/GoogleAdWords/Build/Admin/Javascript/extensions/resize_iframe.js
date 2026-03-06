'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* --------------------------------------------------------------
 connect_account.js 2017-12-15
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

(function () {
    var _window = window,
        iFrameResize = _window.iFrameResize,
        document = _window.document;

    var _document$getElements = document.getElementsByTagName('iframe'),
        _document$getElements2 = _slicedToArray(_document$getElements, 1),
        iframe = _document$getElements2[0];

    var options = { heightCalculationMethod: 'max' };

    function onLoad() {
        iFrameResize(options, 'iframe');
    }

    if (iframe) {
        iframe.addEventListener('load', onLoad);
    }
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvZXh0ZW5zaW9ucy9yZXNpemVfaWZyYW1lLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImlGcmFtZVJlc2l6ZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJpZnJhbWUiLCJvcHRpb25zIiwiaGVpZ2h0Q2FsY3VsYXRpb25NZXRob2QiLCJvbkxvYWQiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQSxDQUFDLFlBQVk7QUFBQSxrQkFDd0JBLE1BRHhCO0FBQUEsUUFDRkMsWUFERSxXQUNGQSxZQURFO0FBQUEsUUFDWUMsUUFEWixXQUNZQSxRQURaOztBQUFBLGdDQUVRQSxTQUFTQyxvQkFBVCxDQUE4QixRQUE5QixDQUZSO0FBQUE7QUFBQSxRQUVGQyxNQUZFOztBQUdULFFBQU1DLFVBQVUsRUFBQ0MseUJBQXlCLEtBQTFCLEVBQWhCOztBQUVBLGFBQVNDLE1BQVQsR0FBa0I7QUFDZE4scUJBQWFJLE9BQWIsRUFBc0IsUUFBdEI7QUFDSDs7QUFFRCxRQUFJRCxNQUFKLEVBQVk7QUFDUkEsZUFBT0ksZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0NELE1BQWhDO0FBQ0g7QUFDSixDQVpEIiwiZmlsZSI6IkFkbWluL0phdmFzY3JpcHQvZXh0ZW5zaW9ucy9yZXNpemVfaWZyYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBjb25uZWN0X2FjY291bnQuanMgMjAxNy0xMi0xNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qge2lGcmFtZVJlc2l6ZSwgZG9jdW1lbnR9ID0gd2luZG93O1xuICAgIGNvbnN0IFtpZnJhbWVdID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lmcmFtZScpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7aGVpZ2h0Q2FsY3VsYXRpb25NZXRob2Q6ICdtYXgnfTtcblxuICAgIGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgaUZyYW1lUmVzaXplKG9wdGlvbnMsICdpZnJhbWUnKTtcbiAgICB9XG5cbiAgICBpZiAoaWZyYW1lKSB7XG4gICAgICAgIGlmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICB9XG59KSgpOyJdfQ==
