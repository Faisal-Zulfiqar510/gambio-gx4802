'use strict';

/* --------------------------------------------------------------
 form_changes_checker.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## From Changes Checker Extension
 *
 * Stores all form data inside $(this) an waits for an trigger to compare the data with the
 * original. A, with the trigger delivered deferred object gets resolved or rejected depending
 * on the result.
 *
 * @todo Create some jQuery selector methods so that it is easier to check if something was changed.
 * @todo The extension must add a 'changed' or 'updated' class to the form so that other modules or code can determine
 * directly that something was changed.
 * @todo If a value is changed inside a input/select/textarea element this plugin must automatically perform the check.
 * Currently it just waits for the consumers to call the 'formchanges.check' event.
 *
 * @module Admin/Extensions/form_changes_checker
 * @ignore
 */
gx.extensions.module('form_changes_checker', ['form'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options for Extension
     *
     * @type {object}
     */
    defaults = {
        'ignoreClass': '.ignore_changes'
    },


    /**
     * Final Extension Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Initial Form Data
     *
     * @type {array}
     *
     * @todo Replace the initial value to an object.
     */
    formData = [],


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    /**
     * Check Forms
     *
     * Function to compare the original data with the data that is currently in the
     * form. the given deferred object gets resolved or rejected.
     *
     * @param {object} event jQuery event object
     * @param {object} deferred JSON object containing the deferred object.
     */
    var _checkForms = function _checkForms(event, deferred) {
        event.stopPropagation();

        deferred = deferred.deferred;

        var newData = jse.libs.form.getData($this, options.ignoreClass),
            cache = JSON.stringify(formData),
            current = JSON.stringify(newData),
            returnData = {
            'original': $.extend({}, formData),
            'current': $.extend({}, newData)
        };

        if (cache === current) {
            deferred.resolve(returnData);
        } else {
            deferred.reject(returnData);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Init function of the extension, called by the engine.
     */
    module.init = function (done) {

        formData = jse.libs.form.getData($this, options.ignoreClass);
        $this.on('formchanges.check', _checkForms).on('formchanges.update', function () {
            // Updates the form data stored in cache
            formData = jse.libs.form.getData($this, options.ignoreClass);
        });

        $('body').on('formchanges.check', function (e, d) {
            // Event listener that performs on every formchanges.check trigger that isn't handled
            // by the form_changes_checker
            if (d && d.deferred) {
                d.deferred.resolve();
            }
        });

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1fY2hhbmdlc19jaGVja2VyLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJmb3JtRGF0YSIsIl9jaGVja0Zvcm1zIiwiZXZlbnQiLCJkZWZlcnJlZCIsInN0b3BQcm9wYWdhdGlvbiIsIm5ld0RhdGEiLCJqc2UiLCJsaWJzIiwiZm9ybSIsImdldERhdGEiLCJpZ25vcmVDbGFzcyIsImNhY2hlIiwiSlNPTiIsInN0cmluZ2lmeSIsImN1cnJlbnQiLCJyZXR1cm5EYXRhIiwicmVzb2x2ZSIsInJlamVjdCIsImluaXQiLCJkb25lIiwib24iLCJlIiwiZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FDSSxzQkFESixFQUdJLENBQUMsTUFBRCxDQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1AsdUJBQWU7QUFEUixLQWJmOzs7QUFpQkk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBdEJkOzs7QUF3Qkk7Ozs7Ozs7QUFPQU0sZUFBVyxFQS9CZjs7O0FBaUNJOzs7OztBQUtBUCxhQUFTLEVBdENiOztBQXdDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQVNBLFFBQUlRLGNBQWMsU0FBZEEsV0FBYyxDQUFVQyxLQUFWLEVBQWlCQyxRQUFqQixFQUEyQjtBQUN6Q0QsY0FBTUUsZUFBTjs7QUFFQUQsbUJBQVdBLFNBQVNBLFFBQXBCOztBQUVBLFlBQUlFLFVBQVVDLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxPQUFkLENBQXNCZCxLQUF0QixFQUE2QkcsUUFBUVksV0FBckMsQ0FBZDtBQUFBLFlBQ0lDLFFBQVFDLEtBQUtDLFNBQUwsQ0FBZWIsUUFBZixDQURaO0FBQUEsWUFFSWMsVUFBVUYsS0FBS0MsU0FBTCxDQUFlUixPQUFmLENBRmQ7QUFBQSxZQUdJVSxhQUFhO0FBQ1Qsd0JBQVluQixFQUFFRyxNQUFGLENBQVMsRUFBVCxFQUFhQyxRQUFiLENBREg7QUFFVCx1QkFBV0osRUFBRUcsTUFBRixDQUFTLEVBQVQsRUFBYU0sT0FBYjtBQUZGLFNBSGpCOztBQVFBLFlBQUlNLFVBQVVHLE9BQWQsRUFBdUI7QUFDbkJYLHFCQUFTYSxPQUFULENBQWlCRCxVQUFqQjtBQUNILFNBRkQsTUFFTztBQUNIWixxQkFBU2MsTUFBVCxDQUFnQkYsVUFBaEI7QUFDSDtBQUNKLEtBbEJEOztBQW9CQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBdEIsV0FBT3lCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQm5CLG1CQUFXTSxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsT0FBZCxDQUFzQmQsS0FBdEIsRUFBNkJHLFFBQVFZLFdBQXJDLENBQVg7QUFDQWYsY0FDS3lCLEVBREwsQ0FDUSxtQkFEUixFQUM2Qm5CLFdBRDdCLEVBRUttQixFQUZMLENBRVEsb0JBRlIsRUFFOEIsWUFBWTtBQUNsQztBQUNBcEIsdUJBQVdNLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxPQUFkLENBQXNCZCxLQUF0QixFQUE2QkcsUUFBUVksV0FBckMsQ0FBWDtBQUNILFNBTEw7O0FBT0FkLFVBQUUsTUFBRixFQUFVd0IsRUFBVixDQUFhLG1CQUFiLEVBQWtDLFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtBQUM5QztBQUNBO0FBQ0EsZ0JBQUlBLEtBQUtBLEVBQUVuQixRQUFYLEVBQXFCO0FBQ2pCbUIsa0JBQUVuQixRQUFGLENBQVdhLE9BQVg7QUFDSDtBQUNKLFNBTkQ7O0FBUUFHO0FBQ0gsS0FuQkQ7O0FBcUJBO0FBQ0EsV0FBTzFCLE1BQVA7QUFDSCxDQXBITCIsImZpbGUiOiJmb3JtX2NoYW5nZXNfY2hlY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZm9ybV9jaGFuZ2VzX2NoZWNrZXIuanMgMjAxNS0xMC0xNSBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRnJvbSBDaGFuZ2VzIENoZWNrZXIgRXh0ZW5zaW9uXG4gKlxuICogU3RvcmVzIGFsbCBmb3JtIGRhdGEgaW5zaWRlICQodGhpcykgYW4gd2FpdHMgZm9yIGFuIHRyaWdnZXIgdG8gY29tcGFyZSB0aGUgZGF0YSB3aXRoIHRoZVxuICogb3JpZ2luYWwuIEEsIHdpdGggdGhlIHRyaWdnZXIgZGVsaXZlcmVkIGRlZmVycmVkIG9iamVjdCBnZXRzIHJlc29sdmVkIG9yIHJlamVjdGVkIGRlcGVuZGluZ1xuICogb24gdGhlIHJlc3VsdC5cbiAqXG4gKiBAdG9kbyBDcmVhdGUgc29tZSBqUXVlcnkgc2VsZWN0b3IgbWV0aG9kcyBzbyB0aGF0IGl0IGlzIGVhc2llciB0byBjaGVjayBpZiBzb21ldGhpbmcgd2FzIGNoYW5nZWQuXG4gKiBAdG9kbyBUaGUgZXh0ZW5zaW9uIG11c3QgYWRkIGEgJ2NoYW5nZWQnIG9yICd1cGRhdGVkJyBjbGFzcyB0byB0aGUgZm9ybSBzbyB0aGF0IG90aGVyIG1vZHVsZXMgb3IgY29kZSBjYW4gZGV0ZXJtaW5lXG4gKiBkaXJlY3RseSB0aGF0IHNvbWV0aGluZyB3YXMgY2hhbmdlZC5cbiAqIEB0b2RvIElmIGEgdmFsdWUgaXMgY2hhbmdlZCBpbnNpZGUgYSBpbnB1dC9zZWxlY3QvdGV4dGFyZWEgZWxlbWVudCB0aGlzIHBsdWdpbiBtdXN0IGF1dG9tYXRpY2FsbHkgcGVyZm9ybSB0aGUgY2hlY2suXG4gKiBDdXJyZW50bHkgaXQganVzdCB3YWl0cyBmb3IgdGhlIGNvbnN1bWVycyB0byBjYWxsIHRoZSAnZm9ybWNoYW5nZXMuY2hlY2snIGV2ZW50LlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9mb3JtX2NoYW5nZXNfY2hlY2tlclxuICogQGlnbm9yZVxuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAnZm9ybV9jaGFuZ2VzX2NoZWNrZXInLFxuXG4gICAgWydmb3JtJ10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXh0ZW5zaW9uIFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIEV4dGVuc2lvblxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICdpZ25vcmVDbGFzcyc6ICcuaWdub3JlX2NoYW5nZXMnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIEV4dGVuc2lvbiBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5pdGlhbCBGb3JtIERhdGFcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7YXJyYXl9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHRvZG8gUmVwbGFjZSB0aGUgaW5pdGlhbCB2YWx1ZSB0byBhbiBvYmplY3QuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvcm1EYXRhID0gW10sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBGb3Jtc1xuICAgICAgICAgKlxuICAgICAgICAgKiBGdW5jdGlvbiB0byBjb21wYXJlIHRoZSBvcmlnaW5hbCBkYXRhIHdpdGggdGhlIGRhdGEgdGhhdCBpcyBjdXJyZW50bHkgaW4gdGhlXG4gICAgICAgICAqIGZvcm0uIHRoZSBnaXZlbiBkZWZlcnJlZCBvYmplY3QgZ2V0cyByZXNvbHZlZCBvciByZWplY3RlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGRlZmVycmVkIEpTT04gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGRlZmVycmVkIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2hlY2tGb3JtcyA9IGZ1bmN0aW9uIChldmVudCwgZGVmZXJyZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBkZWZlcnJlZCA9IGRlZmVycmVkLmRlZmVycmVkO1xuXG4gICAgICAgICAgICB2YXIgbmV3RGF0YSA9IGpzZS5saWJzLmZvcm0uZ2V0RGF0YSgkdGhpcywgb3B0aW9ucy5pZ25vcmVDbGFzcyksXG4gICAgICAgICAgICAgICAgY2FjaGUgPSBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSksXG4gICAgICAgICAgICAgICAgY3VycmVudCA9IEpTT04uc3RyaW5naWZ5KG5ld0RhdGEpLFxuICAgICAgICAgICAgICAgIHJldHVybkRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICdvcmlnaW5hbCc6ICQuZXh0ZW5kKHt9LCBmb3JtRGF0YSksXG4gICAgICAgICAgICAgICAgICAgICdjdXJyZW50JzogJC5leHRlbmQoe30sIG5ld0RhdGEpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGNhY2hlID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXR1cm5EYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJldHVybkRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBmdW5jdGlvbiBvZiB0aGUgZXh0ZW5zaW9uLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgZm9ybURhdGEgPSBqc2UubGlicy5mb3JtLmdldERhdGEoJHRoaXMsIG9wdGlvbnMuaWdub3JlQ2xhc3MpO1xuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub24oJ2Zvcm1jaGFuZ2VzLmNoZWNrJywgX2NoZWNrRm9ybXMpXG4gICAgICAgICAgICAgICAgLm9uKCdmb3JtY2hhbmdlcy51cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZXMgdGhlIGZvcm0gZGF0YSBzdG9yZWQgaW4gY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEgPSBqc2UubGlicy5mb3JtLmdldERhdGEoJHRoaXMsIG9wdGlvbnMuaWdub3JlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2Zvcm1jaGFuZ2VzLmNoZWNrJywgZnVuY3Rpb24gKGUsIGQpIHtcbiAgICAgICAgICAgICAgICAvLyBFdmVudCBsaXN0ZW5lciB0aGF0IHBlcmZvcm1zIG9uIGV2ZXJ5IGZvcm1jaGFuZ2VzLmNoZWNrIHRyaWdnZXIgdGhhdCBpc24ndCBoYW5kbGVkXG4gICAgICAgICAgICAgICAgLy8gYnkgdGhlIGZvcm1fY2hhbmdlc19jaGVja2VyXG4gICAgICAgICAgICAgICAgaWYgKGQgJiYgZC5kZWZlcnJlZCkge1xuICAgICAgICAgICAgICAgICAgICBkLmRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
