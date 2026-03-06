'use strict';

/* --------------------------------------------------------------
 switch_datepicker_field.js 2016-09-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.compatibility.module('switch_datepicker_field', [], function (data) {

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
    defaults = {
        current_select: '#GM_PDF_INVOICE_USE_CURRENT_DATE',
        notice: '.manual-invoice-date-notice'
    },


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

    var _checkVisibility = function _checkVisibility() {
        if ($(options.current_select).val() == 1) {
            $this.attr('disabled', 'disabled');
            $(options.notice).hide();
        } else {
            $this.removeAttr('disabled');
            $(options.notice).show();
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        _checkVisibility();

        $(options.current_select).on('change', function () {
            _checkVisibility();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdtX3BkZi9zd2l0Y2hfZGF0ZXBpY2tlcl9maWVsZC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJjdXJyZW50X3NlbGVjdCIsIm5vdGljZSIsIm9wdGlvbnMiLCJleHRlbmQiLCJfY2hlY2tWaXNpYmlsaXR5IiwidmFsIiwiYXR0ciIsImhpZGUiLCJyZW1vdmVBdHRyIiwic2hvdyIsImluaXQiLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSx5QkFESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUEMsd0JBQWdCLGtDQURUO0FBRVBDLGdCQUFRO0FBRkQsS0FiZjs7O0FBa0JJOzs7OztBQUtBQyxjQUFVSixFQUFFSyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJKLFFBQW5CLEVBQTZCSCxJQUE3QixDQXZCZDs7O0FBeUJJOzs7OztBQUtBRCxhQUFTLEVBOUJiOztBQWdDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSVMsbUJBQW1CLFNBQW5CQSxnQkFBbUIsR0FBWTtBQUMvQixZQUFJTixFQUFFSSxRQUFRRixjQUFWLEVBQTBCSyxHQUExQixNQUFtQyxDQUF2QyxFQUEwQztBQUN0Q1Isa0JBQU1TLElBQU4sQ0FBVyxVQUFYLEVBQXVCLFVBQXZCO0FBQ0FSLGNBQUVJLFFBQVFELE1BQVYsRUFBa0JNLElBQWxCO0FBQ0gsU0FIRCxNQUdPO0FBQ0hWLGtCQUFNVyxVQUFOLENBQWlCLFVBQWpCO0FBQ0FWLGNBQUVJLFFBQVFELE1BQVYsRUFBa0JRLElBQWxCO0FBQ0g7QUFDSixLQVJEOztBQVVBO0FBQ0E7QUFDQTs7QUFFQWQsV0FBT2UsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7O0FBRTFCUDs7QUFFQU4sVUFBRUksUUFBUUYsY0FBVixFQUEwQlksRUFBMUIsQ0FBNkIsUUFBN0IsRUFBdUMsWUFBWTtBQUMvQ1I7QUFDSCxTQUZEOztBQUlBTztBQUNILEtBVEQ7O0FBV0EsV0FBT2hCLE1BQVA7QUFDSCxDQTNFTCIsImZpbGUiOiJnbV9wZGYvc3dpdGNoX2RhdGVwaWNrZXJfZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHN3aXRjaF9kYXRlcGlja2VyX2ZpZWxkLmpzIDIwMTYtMDktMjlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnc3dpdGNoX2RhdGVwaWNrZXJfZmllbGQnLFxuXG4gICAgW10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRfc2VsZWN0OiAnI0dNX1BERl9JTlZPSUNFX1VTRV9DVVJSRU5UX0RBVEUnLFxuICAgICAgICAgICAgICAgIG5vdGljZTogJy5tYW51YWwtaW52b2ljZS1kYXRlLW5vdGljZSdcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX2NoZWNrVmlzaWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKG9wdGlvbnMuY3VycmVudF9zZWxlY3QpLnZhbCgpID09IDEpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgICQob3B0aW9ucy5ub3RpY2UpLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAkKG9wdGlvbnMubm90aWNlKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgX2NoZWNrVmlzaWJpbGl0eSgpO1xuXG4gICAgICAgICAgICAkKG9wdGlvbnMuY3VycmVudF9zZWxlY3QpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX2NoZWNrVmlzaWJpbGl0eSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
