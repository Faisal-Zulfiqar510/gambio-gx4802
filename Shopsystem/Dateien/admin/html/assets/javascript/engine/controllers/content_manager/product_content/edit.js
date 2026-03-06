'use strict';

gx.controllers.module(
// controller name
'edit',

// controller libraries
[],

// controller business logic
function (data) {
    'use strict';

    // variables
    /**
     * Controller reference.
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default options for controller,
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final controller options.
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module object.
     *
     * @type {{}}
     */
    var module = {};

    // private methods

    /**
     * Sets all event handler for the product content forms.
     *
     * @private
     */
    var _setEventHandler = function _setEventHandler() {
        $this.find('form').on('submit', _formValidation);
    };

    // event handler

    /**
     * Validates the product contents creation and edit form.
     * Ensures that the internal_name value is set.
     *
     * @param {jQuery.Event} e Event object.
     * @private
     */
    var _formValidation = function _formValidation(e) {
        var $form = $(e.currentTarget);
        var $internalName = $form.find('input[name="content_manager[' + $form.attr('id') + '][internal_name]"]');

        if ($internalName.val() === '') {
            e.stopPropagation();
            e.preventDefault();

            $internalName.parents('.form-group').addClass('has-error');
            return;
        }
        $internalName.parents('.form-group').removeClass('has-error');
    };

    // initialization
    module.init = function (done) {
        _setEventHandler();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9wcm9kdWN0X2NvbnRlbnQvZWRpdC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9zZXRFdmVudEhhbmRsZXIiLCJmaW5kIiwib24iLCJfZm9ybVZhbGlkYXRpb24iLCIkZm9ybSIsImUiLCJjdXJyZW50VGFyZ2V0IiwiJGludGVybmFsTmFtZSIsImF0dHIiLCJ2YWwiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsInBhcmVudHMiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiaW5pdCIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZjtBQUNJO0FBQ0EsTUFGSjs7QUFJSTtBQUNBLEVBTEo7O0FBT0k7QUFDQSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRCxTQUFTLEVBQWY7O0FBRUE7O0FBRUE7Ozs7O0FBS0EsUUFBTU8sbUJBQW1CLFNBQW5CQSxnQkFBbUIsR0FBTTtBQUMzQkwsY0FBTU0sSUFBTixDQUFXLE1BQVgsRUFBbUJDLEVBQW5CLENBQXNCLFFBQXRCLEVBQWdDQyxlQUFoQztBQUNILEtBRkQ7O0FBSUE7O0FBRUE7Ozs7Ozs7QUFPQSxRQUFNQSxrQkFBa0IsU0FBbEJBLGVBQWtCLElBQUs7QUFDekIsWUFBTUMsUUFBUVIsRUFBRVMsRUFBRUMsYUFBSixDQUFkO0FBQ0EsWUFBTUMsZ0JBQWdCSCxNQUFNSCxJQUFOLENBQVcsaUNBQWlDRyxNQUFNSSxJQUFOLENBQVcsSUFBWCxDQUFqQyxHQUMzQixvQkFEZ0IsQ0FBdEI7O0FBR0EsWUFBSUQsY0FBY0UsR0FBZCxPQUF3QixFQUE1QixFQUFnQztBQUM1QkosY0FBRUssZUFBRjtBQUNBTCxjQUFFTSxjQUFGOztBQUVBSiwwQkFBY0ssT0FBZCxDQUFzQixhQUF0QixFQUFxQ0MsUUFBckMsQ0FBOEMsV0FBOUM7QUFDQTtBQUNIO0FBQ0ROLHNCQUFjSyxPQUFkLENBQXNCLGFBQXRCLEVBQXFDRSxXQUFyQyxDQUFpRCxXQUFqRDtBQUNILEtBYkQ7O0FBZUE7QUFDQXJCLFdBQU9zQixJQUFQLEdBQWMsZ0JBQVE7QUFDbEJmO0FBQ0FnQjtBQUNILEtBSEQ7O0FBS0EsV0FBT3ZCLE1BQVA7QUFDSCxDQWxGTCIsImZpbGUiOiJjb250ZW50X21hbmFnZXIvcHJvZHVjdF9jb250ZW50L2VkaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJneC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgLy8gY29udHJvbGxlciBuYW1lXG4gICAgJ2VkaXQnLFxuXG4gICAgLy8gY29udHJvbGxlciBsaWJyYXJpZXNcbiAgICBbXSxcblxuICAgIC8vIGNvbnRyb2xsZXIgYnVzaW5lc3MgbG9naWNcbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250cm9sbGVyIHJlZmVyZW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIGFsbCBldmVudCBoYW5kbGVyIGZvciB0aGUgcHJvZHVjdCBjb250ZW50IGZvcm1zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NldEV2ZW50SGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ2Zvcm0nKS5vbignc3VibWl0JywgX2Zvcm1WYWxpZGF0aW9uKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBldmVudCBoYW5kbGVyXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFZhbGlkYXRlcyB0aGUgcHJvZHVjdCBjb250ZW50cyBjcmVhdGlvbiBhbmQgZWRpdCBmb3JtLlxuICAgICAgICAgKiBFbnN1cmVzIHRoYXQgdGhlIGludGVybmFsX25hbWUgdmFsdWUgaXMgc2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZSBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZm9ybVZhbGlkYXRpb24gPSBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgY29uc3QgJGludGVybmFsTmFtZSA9ICRmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJjb250ZW50X21hbmFnZXJbJyArICRmb3JtLmF0dHIoJ2lkJylcbiAgICAgICAgICAgICAgICArICddW2ludGVybmFsX25hbWVdXCJdJyk7XG5cbiAgICAgICAgICAgIGlmICgkaW50ZXJuYWxOYW1lLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgJGludGVybmFsTmFtZS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkaW50ZXJuYWxOYW1lLnBhcmVudHMoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGluaXRpYWxpemF0aW9uXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICBfc2V0RXZlbnRIYW5kbGVyKCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pOyJdfQ==
