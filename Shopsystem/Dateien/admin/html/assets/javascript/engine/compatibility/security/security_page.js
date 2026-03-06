'use strict';

/* --------------------------------------------------------------
 security_page.js 2018-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Security Page Controller
 *
 * Changing behavior in the security page.
 * Add readonly-attribute to input elements if captcha_type-dropdown value 'standard' is selected
 *
 * @module Compatibility/security_page
 */
gx.compatibility.module('security_page', [],

/**  @lends module:Compatibility/security_page */

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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _disableInputs = function _disableInputs() {
        console.log('change');
        var selectors = ['#GM_RECAPTCHA_PUBLIC_KEY', '#GM_RECAPTCHA_PRIVATE_KEY'];

        var read_only = true;
        var captchaType = $('#captcha_type').val();
        if (captchaType === 'recaptcha_v2') {
            read_only = false;
        }

        $.each(selectors, function () {
            $(this).attr('readonly', read_only);
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _disableInputs();
        $this.on('change', _disableInputs);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlY3VyaXR5L3NlY3VyaXR5X3BhZ2UuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9kaXNhYmxlSW5wdXRzIiwiY29uc29sZSIsImxvZyIsInNlbGVjdG9ycyIsInJlYWRfb25seSIsImNhcHRjaGFUeXBlIiwidmFsIiwiZWFjaCIsImF0dHIiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7O0FBUUFBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksZUFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxjQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxhQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSU8saUJBQWlCLFNBQWpCQSxjQUFpQixHQUFZO0FBQzdCQyxnQkFBUUMsR0FBUixDQUFZLFFBQVo7QUFDQSxZQUFJQyxZQUFZLENBQ1osMEJBRFksRUFFWiwyQkFGWSxDQUFoQjs7QUFLQSxZQUFJQyxZQUFZLElBQWhCO0FBQ0EsWUFBSUMsY0FBY1QsRUFBRSxlQUFGLEVBQW1CVSxHQUFuQixFQUFsQjtBQUNBLFlBQUlELGdCQUFnQixjQUFwQixFQUFvQztBQUNoQ0Qsd0JBQVksS0FBWjtBQUNIOztBQUVEUixVQUFFVyxJQUFGLENBQU9KLFNBQVAsRUFBa0IsWUFBWTtBQUMxQlAsY0FBRSxJQUFGLEVBQVFZLElBQVIsQ0FBYSxVQUFiLEVBQXlCSixTQUF6QjtBQUNILFNBRkQ7QUFHSCxLQWhCRDs7QUFrQkE7QUFDQTtBQUNBOztBQUVBWCxXQUFPZ0IsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJWO0FBQ0FMLGNBQU1nQixFQUFOLENBQVMsUUFBVCxFQUFtQlgsY0FBbkI7QUFDQVU7QUFDSCxLQUpEOztBQU1BLFdBQU9qQixNQUFQO0FBQ0gsQ0E3RUwiLCJmaWxlIjoic2VjdXJpdHkvc2VjdXJpdHlfcGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2VjdXJpdHlfcGFnZS5qcyAyMDE4LTAyLTIzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTZWN1cml0eSBQYWdlIENvbnRyb2xsZXJcbiAqXG4gKiBDaGFuZ2luZyBiZWhhdmlvciBpbiB0aGUgc2VjdXJpdHkgcGFnZS5cbiAqIEFkZCByZWFkb25seS1hdHRyaWJ1dGUgdG8gaW5wdXQgZWxlbWVudHMgaWYgY2FwdGNoYV90eXBlLWRyb3Bkb3duIHZhbHVlICdzdGFuZGFyZCcgaXMgc2VsZWN0ZWRcbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvc2VjdXJpdHlfcGFnZVxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnc2VjdXJpdHlfcGFnZScsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L3NlY3VyaXR5X3BhZ2UgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfZGlzYWJsZUlucHV0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgIHZhciBzZWxlY3RvcnMgPSBbXG4gICAgICAgICAgICAgICAgJyNHTV9SRUNBUFRDSEFfUFVCTElDX0tFWScsXG4gICAgICAgICAgICAgICAgJyNHTV9SRUNBUFRDSEFfUFJJVkFURV9LRVknXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICB2YXIgcmVhZF9vbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBjYXB0Y2hhVHlwZSA9ICQoJyNjYXB0Y2hhX3R5cGUnKS52YWwoKTtcbiAgICAgICAgICAgIGlmIChjYXB0Y2hhVHlwZSA9PT0gJ3JlY2FwdGNoYV92MicpIHtcbiAgICAgICAgICAgICAgICByZWFkX29ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5lYWNoKHNlbGVjdG9ycywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cigncmVhZG9ubHknLCByZWFkX29ubHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIF9kaXNhYmxlSW5wdXRzKCk7XG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgX2Rpc2FibGVJbnB1dHMpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
