'use strict';

/* --------------------------------------------------------------
 paypal_config.js 2015-09-20 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## PayPal Configuration
 *
 * Display info text in info message box.
 *
 * @module Compatibility/main_top_header
 */
gx.compatibility.module('paypal_config', [gx.source + '/libs/info_messages'],

/**  @lends module:Compatibility/paypal_config */

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
     * Reference to the info messages library
     * @var {object}
     */
    messages = jse.libs.info_messages,


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        if ($('.firstconfig_note').length > 0) {
            $('.firstconfig_note').hide();
            messages.addInfo($('.firstconfig_note').html());
        }

        $('p.message').each(function () {
            messages.addInfo($(this).html());
            $(this).hide();
        });

        $('p.message_info').each(function () {
            messages.addWarning($(this).html());
            $(this).hide();
        });

        $('p.message_success').each(function () {
            messages.addSuccess($(this).html());
            $(this).hide();
        });

        $('p.message_error').each(function () {
            messages.addError($(this).html());
            $(this).hide();
        });

        $('.message_stack_container').addClass('breakpoint-large');

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBheXBhbC9wYXlwYWxfY29uZmlnLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJtZXNzYWdlcyIsImpzZSIsImxpYnMiLCJpbmZvX21lc3NhZ2VzIiwiaW5pdCIsImRvbmUiLCJsZW5ndGgiLCJoaWRlIiwiYWRkSW5mbyIsImh0bWwiLCJlYWNoIiwiYWRkV2FybmluZyIsImFkZFN1Y2Nlc3MiLCJhZGRFcnJvciIsImFkZENsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxlQURKLEVBR0ksQ0FDSUYsR0FBR0csTUFBSCxHQUFZLHFCQURoQixDQUhKOztBQU9JOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7OztBQUlBTSxlQUFXQyxJQUFJQyxJQUFKLENBQVNDLGFBMUJ4Qjs7O0FBNEJJOzs7OztBQUtBWCxhQUFTLEVBakNiOztBQW1DQTtBQUNBO0FBQ0E7O0FBRUFBLFdBQU9ZLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQixZQUFJVCxFQUFFLG1CQUFGLEVBQXVCVSxNQUF2QixHQUFnQyxDQUFwQyxFQUF1QztBQUNuQ1YsY0FBRSxtQkFBRixFQUF1QlcsSUFBdkI7QUFDQVAscUJBQVNRLE9BQVQsQ0FBaUJaLEVBQUUsbUJBQUYsRUFBdUJhLElBQXZCLEVBQWpCO0FBQ0g7O0FBRURiLFVBQUUsV0FBRixFQUFlYyxJQUFmLENBQW9CLFlBQVk7QUFDNUJWLHFCQUFTUSxPQUFULENBQWlCWixFQUFFLElBQUYsRUFBUWEsSUFBUixFQUFqQjtBQUNBYixjQUFFLElBQUYsRUFBUVcsSUFBUjtBQUNILFNBSEQ7O0FBS0FYLFVBQUUsZ0JBQUYsRUFBb0JjLElBQXBCLENBQXlCLFlBQVk7QUFDakNWLHFCQUFTVyxVQUFULENBQW9CZixFQUFFLElBQUYsRUFBUWEsSUFBUixFQUFwQjtBQUNBYixjQUFFLElBQUYsRUFBUVcsSUFBUjtBQUNILFNBSEQ7O0FBS0FYLFVBQUUsbUJBQUYsRUFBdUJjLElBQXZCLENBQTRCLFlBQVk7QUFDcENWLHFCQUFTWSxVQUFULENBQW9CaEIsRUFBRSxJQUFGLEVBQVFhLElBQVIsRUFBcEI7QUFDQWIsY0FBRSxJQUFGLEVBQVFXLElBQVI7QUFDSCxTQUhEOztBQUtBWCxVQUFFLGlCQUFGLEVBQXFCYyxJQUFyQixDQUEwQixZQUFZO0FBQ2xDVixxQkFBU2EsUUFBVCxDQUFrQmpCLEVBQUUsSUFBRixFQUFRYSxJQUFSLEVBQWxCO0FBQ0FiLGNBQUUsSUFBRixFQUFRVyxJQUFSO0FBQ0gsU0FIRDs7QUFLQVgsVUFBRSwwQkFBRixFQUE4QmtCLFFBQTlCLENBQXVDLGtCQUF2Qzs7QUFFQVQ7QUFDSCxLQTlCRDs7QUFnQ0EsV0FBT2IsTUFBUDtBQUNILENBekZMIiwiZmlsZSI6InBheXBhbC9wYXlwYWxfY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBwYXlwYWxfY29uZmlnLmpzIDIwMTUtMDktMjAgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFBheVBhbCBDb25maWd1cmF0aW9uXG4gKlxuICogRGlzcGxheSBpbmZvIHRleHQgaW4gaW5mbyBtZXNzYWdlIGJveC5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvbWFpbl90b3BfaGVhZGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdwYXlwYWxfY29uZmlnJyxcblxuICAgIFtcbiAgICAgICAgZ3guc291cmNlICsgJy9saWJzL2luZm9fbWVzc2FnZXMnXG4gICAgXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L3BheXBhbF9jb25maWcgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZWZlcmVuY2UgdG8gdGhlIGluZm8gbWVzc2FnZXMgbGlicmFyeVxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXNzYWdlcyA9IGpzZS5saWJzLmluZm9fbWVzc2FnZXMsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgICAgICAgIGlmICgkKCcuZmlyc3Rjb25maWdfbm90ZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKCcuZmlyc3Rjb25maWdfbm90ZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5hZGRJbmZvKCQoJy5maXJzdGNvbmZpZ19ub3RlJykuaHRtbCgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCgncC5tZXNzYWdlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMuYWRkSW5mbygkKHRoaXMpLmh0bWwoKSk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgncC5tZXNzYWdlX2luZm8nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5hZGRXYXJuaW5nKCQodGhpcykuaHRtbCgpKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCdwLm1lc3NhZ2Vfc3VjY2VzcycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLmFkZFN1Y2Nlc3MoJCh0aGlzKS5odG1sKCkpO1xuICAgICAgICAgICAgICAgICQodGhpcykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ3AubWVzc2FnZV9lcnJvcicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLmFkZEVycm9yKCQodGhpcykuaHRtbCgpKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcubWVzc2FnZV9zdGFja19jb250YWluZXInKS5hZGRDbGFzcygnYnJlYWtwb2ludC1sYXJnZScpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
