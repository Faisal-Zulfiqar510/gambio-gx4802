'use strict';

/* --------------------------------------------------------------
 sticky_footer.js 2015-09-14 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Handle footer position for backend.
 *
 * This module will handle the footer position on scrolling or whenever the page window size changes.
 *
 * @module Compatibility/sticky_footer
 */
gx.compatibility.module('sticky_footer', [],

/**  @lends module:Compatibility/sticky_footer */

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
     * Copyright Element Selector
     *
     * @var {object}
     */
    $copyright = $('.main-bottom-copyright'),


    /**
     * Footer Offset Top
     *
     * @var {int}
     */
    initialOffsetTop = $this.offset().top,


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
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _checkOffset = function _checkOffset() {
        var copyrightOffsetTop = $copyright.offset().top;
        if (copyrightOffsetTop == 0) {
            copyrightOffsetTop = 50; // default value to avoid a bug refs #55075
        }
        if ($(document).scrollTop() + window.innerHeight < copyrightOffsetTop) {
            $this.css('position', 'fixed');
        } else if ($this.offset().top + $this.height() >= copyrightOffsetTop) {
            $this.css('position', 'absolute');
        }
    };

    var _fixMainContentHeight = function _fixMainContentHeight() {
        if (initialOffsetTop + $this.height() <= window.innerHeight) {
            var newContentHeight = window.innerHeight - $('.main-page-content').offset().top;
            $('.main-page-content').css('min-height', newContentHeight + 'px');
            // First table of the page needs to be also resized.
            $('td.columnLeft2').parents('table:first').css('min-height', newContentHeight + 'px');
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Delay the footer position by some time until so that most elements are rendered
        // properly. Adjust the timeout interval approximately.
        setTimeout(function () {
            _fixMainContentHeight();

            $(window).on('scroll', _checkOffset).on('resize', _checkOffset).on('resize', _fixMainContentHeight);
            _checkOffset();
        }, 300);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0aWNreV9mb290ZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRjb3B5cmlnaHQiLCJpbml0aWFsT2Zmc2V0VG9wIiwib2Zmc2V0IiwidG9wIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NoZWNrT2Zmc2V0IiwiY29weXJpZ2h0T2Zmc2V0VG9wIiwiZG9jdW1lbnQiLCJzY3JvbGxUb3AiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImNzcyIsImhlaWdodCIsIl9maXhNYWluQ29udGVudEhlaWdodCIsIm5ld0NvbnRlbnRIZWlnaHQiLCJwYXJlbnRzIiwiaW5pdCIsImRvbmUiLCJzZXRUaW1lb3V0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGVBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsaUJBQWFELEVBQUUsd0JBQUYsQ0FiakI7OztBQWVJOzs7OztBQUtBRSx1QkFBbUJILE1BQU1JLE1BQU4sR0FBZUMsR0FwQnRDOzs7QUFzQkk7Ozs7O0FBS0FDLGVBQVcsRUEzQmY7OztBQTZCSTs7Ozs7QUFLQUMsY0FBVU4sRUFBRU8sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QlAsSUFBN0IsQ0FsQ2Q7OztBQW9DSTs7Ozs7QUFLQUQsYUFBUyxFQXpDYjs7QUEyQ0E7QUFDQTtBQUNBOztBQUVBLFFBQUlXLGVBQWUsU0FBZkEsWUFBZSxHQUFZO0FBQzNCLFlBQUlDLHFCQUFxQlIsV0FBV0UsTUFBWCxHQUFvQkMsR0FBN0M7QUFDQSxZQUFJSyxzQkFBc0IsQ0FBMUIsRUFBNkI7QUFDekJBLGlDQUFxQixFQUFyQixDQUR5QixDQUNBO0FBQzVCO0FBQ0QsWUFBS1QsRUFBRVUsUUFBRixFQUFZQyxTQUFaLEtBQTBCQyxPQUFPQyxXQUFsQyxHQUFpREosa0JBQXJELEVBQXlFO0FBQ3JFVixrQkFBTWUsR0FBTixDQUFVLFVBQVYsRUFBc0IsT0FBdEI7QUFDSCxTQUZELE1BRU8sSUFBSWYsTUFBTUksTUFBTixHQUFlQyxHQUFmLEdBQXFCTCxNQUFNZ0IsTUFBTixFQUFyQixJQUF1Q04sa0JBQTNDLEVBQStEO0FBQ2xFVixrQkFBTWUsR0FBTixDQUFVLFVBQVYsRUFBc0IsVUFBdEI7QUFDSDtBQUNKLEtBVkQ7O0FBWUEsUUFBSUUsd0JBQXdCLFNBQXhCQSxxQkFBd0IsR0FBWTtBQUNwQyxZQUFJZCxtQkFBbUJILE1BQU1nQixNQUFOLEVBQW5CLElBQXFDSCxPQUFPQyxXQUFoRCxFQUE2RDtBQUN6RCxnQkFBSUksbUJBQW1CTCxPQUFPQyxXQUFQLEdBQXFCYixFQUFFLG9CQUFGLEVBQXdCRyxNQUF4QixHQUFpQ0MsR0FBN0U7QUFDQUosY0FBRSxvQkFBRixFQUF3QmMsR0FBeEIsQ0FBNEIsWUFBNUIsRUFBMENHLG1CQUFtQixJQUE3RDtBQUNBO0FBQ0FqQixjQUFFLGdCQUFGLEVBQW9Ca0IsT0FBcEIsQ0FBNEIsYUFBNUIsRUFBMkNKLEdBQTNDLENBQStDLFlBQS9DLEVBQTZERyxtQkFBbUIsSUFBaEY7QUFDSDtBQUNKLEtBUEQ7O0FBU0E7QUFDQTtBQUNBOztBQUVBcEIsV0FBT3NCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCO0FBQ0E7QUFDQUMsbUJBQVcsWUFBWTtBQUNuQkw7O0FBRUFoQixjQUFFWSxNQUFGLEVBQ0tVLEVBREwsQ0FDUSxRQURSLEVBQ2tCZCxZQURsQixFQUVLYyxFQUZMLENBRVEsUUFGUixFQUVrQmQsWUFGbEIsRUFHS2MsRUFITCxDQUdRLFFBSFIsRUFHa0JOLHFCQUhsQjtBQUlBUjtBQUNILFNBUkQsRUFRRyxHQVJIOztBQVVBWTtBQUNILEtBZEQ7O0FBZ0JBLFdBQU92QixNQUFQO0FBQ0gsQ0F4R0wiLCJmaWxlIjoic3RpY2t5X2Zvb3Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3RpY2t5X2Zvb3Rlci5qcyAyMDE1LTA5LTE0IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBIYW5kbGUgZm9vdGVyIHBvc2l0aW9uIGZvciBiYWNrZW5kLlxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgaGFuZGxlIHRoZSBmb290ZXIgcG9zaXRpb24gb24gc2Nyb2xsaW5nIG9yIHdoZW5ldmVyIHRoZSBwYWdlIHdpbmRvdyBzaXplIGNoYW5nZXMuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L3N0aWNreV9mb290ZXJcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ3N0aWNreV9mb290ZXInLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9zdGlja3lfZm9vdGVyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENvcHlyaWdodCBFbGVtZW50IFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkY29weXJpZ2h0ID0gJCgnLm1haW4tYm90dG9tLWNvcHlyaWdodCcpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZvb3RlciBPZmZzZXQgVG9wXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7aW50fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpbml0aWFsT2Zmc2V0VG9wID0gJHRoaXMub2Zmc2V0KCkudG9wLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX2NoZWNrT2Zmc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvcHlyaWdodE9mZnNldFRvcCA9ICRjb3B5cmlnaHQub2Zmc2V0KCkudG9wO1xuICAgICAgICAgICAgaWYgKGNvcHlyaWdodE9mZnNldFRvcCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29weXJpZ2h0T2Zmc2V0VG9wID0gNTA7IC8vIGRlZmF1bHQgdmFsdWUgdG8gYXZvaWQgYSBidWcgcmVmcyAjNTUwNzVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgKyB3aW5kb3cuaW5uZXJIZWlnaHQpIDwgY29weXJpZ2h0T2Zmc2V0VG9wKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuY3NzKCdwb3NpdGlvbicsICdmaXhlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgkdGhpcy5vZmZzZXQoKS50b3AgKyAkdGhpcy5oZWlnaHQoKSA+PSBjb3B5cmlnaHRPZmZzZXRUb3ApIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5jc3MoJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9maXhNYWluQ29udGVudEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbml0aWFsT2Zmc2V0VG9wICsgJHRoaXMuaGVpZ2h0KCkgPD0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0NvbnRlbnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAkKCcubWFpbi1wYWdlLWNvbnRlbnQnKS5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgJCgnLm1haW4tcGFnZS1jb250ZW50JykuY3NzKCdtaW4taGVpZ2h0JywgbmV3Q29udGVudEhlaWdodCArICdweCcpO1xuICAgICAgICAgICAgICAgIC8vIEZpcnN0IHRhYmxlIG9mIHRoZSBwYWdlIG5lZWRzIHRvIGJlIGFsc28gcmVzaXplZC5cbiAgICAgICAgICAgICAgICAkKCd0ZC5jb2x1bW5MZWZ0MicpLnBhcmVudHMoJ3RhYmxlOmZpcnN0JykuY3NzKCdtaW4taGVpZ2h0JywgbmV3Q29udGVudEhlaWdodCArICdweCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBEZWxheSB0aGUgZm9vdGVyIHBvc2l0aW9uIGJ5IHNvbWUgdGltZSB1bnRpbCBzbyB0aGF0IG1vc3QgZWxlbWVudHMgYXJlIHJlbmRlcmVkXG4gICAgICAgICAgICAvLyBwcm9wZXJseS4gQWRqdXN0IHRoZSB0aW1lb3V0IGludGVydmFsIGFwcHJveGltYXRlbHkuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfZml4TWFpbkNvbnRlbnRIZWlnaHQoKTtcblxuICAgICAgICAgICAgICAgICQod2luZG93KVxuICAgICAgICAgICAgICAgICAgICAub24oJ3Njcm9sbCcsIF9jaGVja09mZnNldClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdyZXNpemUnLCBfY2hlY2tPZmZzZXQpXG4gICAgICAgICAgICAgICAgICAgIC5vbigncmVzaXplJywgX2ZpeE1haW5Db250ZW50SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICBfY2hlY2tPZmZzZXQoKTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
