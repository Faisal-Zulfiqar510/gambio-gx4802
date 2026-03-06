'use strict';

/* --------------------------------------------------------------
 resize_page.js 2015-10-03
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Resize Page
 *
 * Resizes the page to a calculated height including the (absolutely positioned) configuration box on the right side.
 *
 * @module Compatibility/resize_page
 */
gx.compatibility.module('resize_page', [],

/**  @lends module:Compatibility/resize_page */

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
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Resizes the page to the maximum height of boxCenterWrapper and gx-configuration-box
     */
    var _resizePage = function _resizePage() {
        $('.boxCenterWrapper').height(Math.max($('.boxCenterWrapper').height(), $('.configuration-box-content').height()));
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        if ($('div.gx-configuration-box').length) {
            $('div.gx-configuration-box').on('resize', _resizePage);
            $('.boxCenterWrapper').on('resize', _resizePage);
            window.setTimeout(function () {
                _resizePage();
            }, 500);
        }

        if ($('#toolbar').length) {
            $('#toolbar').on('click', _resizePage);
            $('#gm_gprint_content').on('dblclick', _resizePage);
            $('#element_type').on('change', _resizePage);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc2l6ZV9wYWdlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfcmVzaXplUGFnZSIsImhlaWdodCIsIk1hdGgiLCJtYXgiLCJpbml0IiwiZG9uZSIsImxlbmd0aCIsIm9uIiwid2luZG93Iiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksYUFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxjQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxhQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBLFFBQUlPLGNBQWMsU0FBZEEsV0FBYyxHQUFZO0FBQzFCSixVQUFFLG1CQUFGLEVBQXVCSyxNQUF2QixDQUE4QkMsS0FBS0MsR0FBTCxDQUFTUCxFQUFFLG1CQUFGLEVBQXVCSyxNQUF2QixFQUFULEVBQTBDTCxFQUNwRSw0QkFEb0UsRUFDdENLLE1BRHNDLEVBQTFDLENBQTlCO0FBR0gsS0FKRDs7QUFNQTtBQUNBO0FBQ0E7O0FBRUFSLFdBQU9XLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCLFlBQUlULEVBQUUsMEJBQUYsRUFBOEJVLE1BQWxDLEVBQTBDO0FBQ3RDVixjQUFFLDBCQUFGLEVBQThCVyxFQUE5QixDQUFpQyxRQUFqQyxFQUEyQ1AsV0FBM0M7QUFDQUosY0FBRSxtQkFBRixFQUF1QlcsRUFBdkIsQ0FBMEIsUUFBMUIsRUFBb0NQLFdBQXBDO0FBQ0FRLG1CQUFPQyxVQUFQLENBQWtCLFlBQVk7QUFDMUJUO0FBQ0gsYUFGRCxFQUVHLEdBRkg7QUFHSDs7QUFFRCxZQUFJSixFQUFFLFVBQUYsRUFBY1UsTUFBbEIsRUFBMEI7QUFDdEJWLGNBQUUsVUFBRixFQUFjVyxFQUFkLENBQWlCLE9BQWpCLEVBQTBCUCxXQUExQjtBQUNBSixjQUFFLG9CQUFGLEVBQXdCVyxFQUF4QixDQUEyQixVQUEzQixFQUF1Q1AsV0FBdkM7QUFDQUosY0FBRSxlQUFGLEVBQW1CVyxFQUFuQixDQUFzQixRQUF0QixFQUFnQ1AsV0FBaEM7QUFDSDs7QUFFREs7QUFDSCxLQWhCRDs7QUFrQkEsV0FBT1osTUFBUDtBQUNILENBaEZMIiwiZmlsZSI6InJlc2l6ZV9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiByZXNpemVfcGFnZS5qcyAyMDE1LTEwLTAzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBSZXNpemUgUGFnZVxuICpcbiAqIFJlc2l6ZXMgdGhlIHBhZ2UgdG8gYSBjYWxjdWxhdGVkIGhlaWdodCBpbmNsdWRpbmcgdGhlIChhYnNvbHV0ZWx5IHBvc2l0aW9uZWQpIGNvbmZpZ3VyYXRpb24gYm94IG9uIHRoZSByaWdodCBzaWRlLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9yZXNpemVfcGFnZVxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAncmVzaXplX3BhZ2UnLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9yZXNpemVfcGFnZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2l6ZXMgdGhlIHBhZ2UgdG8gdGhlIG1heGltdW0gaGVpZ2h0IG9mIGJveENlbnRlcldyYXBwZXIgYW5kIGd4LWNvbmZpZ3VyYXRpb24tYm94XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Jlc2l6ZVBhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuYm94Q2VudGVyV3JhcHBlcicpLmhlaWdodChNYXRoLm1heCgkKCcuYm94Q2VudGVyV3JhcHBlcicpLmhlaWdodCgpLCAkKFxuICAgICAgICAgICAgICAgICcuY29uZmlndXJhdGlvbi1ib3gtY29udGVudCcpLmhlaWdodCgpKSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgaWYgKCQoJ2Rpdi5neC1jb25maWd1cmF0aW9uLWJveCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJ2Rpdi5neC1jb25maWd1cmF0aW9uLWJveCcpLm9uKCdyZXNpemUnLCBfcmVzaXplUGFnZSk7XG4gICAgICAgICAgICAgICAgJCgnLmJveENlbnRlcldyYXBwZXInKS5vbigncmVzaXplJywgX3Jlc2l6ZVBhZ2UpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlc2l6ZVBhZ2UoKTtcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJCgnI3Rvb2xiYXInKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcjdG9vbGJhcicpLm9uKCdjbGljaycsIF9yZXNpemVQYWdlKTtcbiAgICAgICAgICAgICAgICAkKCcjZ21fZ3ByaW50X2NvbnRlbnQnKS5vbignZGJsY2xpY2snLCBfcmVzaXplUGFnZSk7XG4gICAgICAgICAgICAgICAgJCgnI2VsZW1lbnRfdHlwZScpLm9uKCdjaGFuZ2UnLCBfcmVzaXplUGFnZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
