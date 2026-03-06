"use strict";

/* --------------------------------------------------------------
 form_images_validator.js 2016-08-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.form_images_validator = jse.libs.form_images_validator || {};

/**
 * Form Images Validator Library.
 *
 * Provides callback methods that can be overridden to provide custom functionality.
 *
 * @module Admin/Libs/form_images_validator
 * @exports jse.libs.form_images_validator
 */
(function (exports) {
  /**
   * Provides callback methods, that can be overridden.
   *
   * @type {Object}
   */
  exports.callbackMethods = {
    /**
     * Invoked callback method on validation errors.
     *
     * @param {jQuery.Event} event Triggered form submit event.
     * @param {HTMLElement[]} errors Array containing the input fields that failed on the validation.
     * @abstract
     */
    onValidationError: function onValidationError(event, errors) {},


    /**
     * Invoked callback method on validation success.
     *
     * @param {jQuery.Event} event Triggered form submit event.
     * @abstract
     */
    onValidationSuccess: function onValidationSuccess(event) {}
  };
})(jse.libs.form_images_validator);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm1faW1hZ2VzX3ZhbGlkYXRvci5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwiZm9ybV9pbWFnZXNfdmFsaWRhdG9yIiwiZXhwb3J0cyIsImNhbGxiYWNrTWV0aG9kcyIsIm9uVmFsaWRhdGlvbkVycm9yIiwiZXZlbnQiLCJlcnJvcnMiLCJvblZhbGlkYXRpb25TdWNjZXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLElBQUlDLElBQUosQ0FBU0MscUJBQVQsR0FBaUNGLElBQUlDLElBQUosQ0FBU0MscUJBQVQsSUFBa0MsRUFBbkU7O0FBRUE7Ozs7Ozs7O0FBUUMsV0FBVUMsT0FBVixFQUFtQjtBQUNoQjs7Ozs7QUFLQUEsVUFBUUMsZUFBUixHQUEwQjtBQUN0Qjs7Ozs7OztBQU9BQyxxQkFSc0IsNkJBUUpDLEtBUkksRUFRR0MsTUFSSCxFQVFXLENBQ2hDLENBVHFCOzs7QUFXdEI7Ozs7OztBQU1BQyx1QkFqQnNCLCtCQWlCRkYsS0FqQkUsRUFpQkssQ0FDMUI7QUFsQnFCLEdBQTFCO0FBb0JILENBMUJBLEVBMEJDTixJQUFJQyxJQUFKLENBQVNDLHFCQTFCVixDQUFEIiwiZmlsZSI6ImZvcm1faW1hZ2VzX3ZhbGlkYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZm9ybV9pbWFnZXNfdmFsaWRhdG9yLmpzIDIwMTYtMDgtMjlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5qc2UubGlicy5mb3JtX2ltYWdlc192YWxpZGF0b3IgPSBqc2UubGlicy5mb3JtX2ltYWdlc192YWxpZGF0b3IgfHwge307XG5cbi8qKlxuICogRm9ybSBJbWFnZXMgVmFsaWRhdG9yIExpYnJhcnkuXG4gKlxuICogUHJvdmlkZXMgY2FsbGJhY2sgbWV0aG9kcyB0aGF0IGNhbiBiZSBvdmVycmlkZGVuIHRvIHByb3ZpZGUgY3VzdG9tIGZ1bmN0aW9uYWxpdHkuXG4gKlxuICogQG1vZHVsZSBBZG1pbi9MaWJzL2Zvcm1faW1hZ2VzX3ZhbGlkYXRvclxuICogQGV4cG9ydHMganNlLmxpYnMuZm9ybV9pbWFnZXNfdmFsaWRhdG9yXG4gKi9cbihmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIGNhbGxiYWNrIG1ldGhvZHMsIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGV4cG9ydHMuY2FsbGJhY2tNZXRob2RzID0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogSW52b2tlZCBjYWxsYmFjayBtZXRob2Qgb24gdmFsaWRhdGlvbiBlcnJvcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZm9ybSBzdWJtaXQgZXZlbnQuXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gZXJyb3JzIEFycmF5IGNvbnRhaW5pbmcgdGhlIGlucHV0IGZpZWxkcyB0aGF0IGZhaWxlZCBvbiB0aGUgdmFsaWRhdGlvbi5cbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqL1xuICAgICAgICBvblZhbGlkYXRpb25FcnJvcihldmVudCwgZXJyb3JzKSB7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludm9rZWQgY2FsbGJhY2sgbWV0aG9kIG9uIHZhbGlkYXRpb24gc3VjY2Vzcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBmb3JtIHN1Ym1pdCBldmVudC5cbiAgICAgICAgICogQGFic3RyYWN0XG4gICAgICAgICAqL1xuICAgICAgICBvblZhbGlkYXRpb25TdWNjZXNzKGV2ZW50KSB7XG4gICAgICAgIH1cbiAgICB9O1xufShqc2UubGlicy5mb3JtX2ltYWdlc192YWxpZGF0b3IpKTtcbiJdfQ==
