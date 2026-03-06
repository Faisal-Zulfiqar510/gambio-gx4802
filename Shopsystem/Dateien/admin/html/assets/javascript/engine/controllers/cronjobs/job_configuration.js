'use strict';

/* --------------------------------------------------------------
 job_configuration.js 2018-08-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * TODO: Change URL for Ajax calls when endpoint is ready
 */
gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'job_configuration',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
['xhr', 'modal', gx.source + '/libs/info_box'],

// ------------------------------------------------------------------------
// CONTROLLER BUSINESS LOGIC
// ------------------------------------------------------------------------
function (data) {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

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

    var $btnOpenConfig = $('.open-configuration');

    var $modal = $('.modal.configuration');

    var $modalBody = $modal.find('.modal-body');

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Get configuration elements for specific task
     *
     * @param task
     * @private
     */
    var _getConfigurationContent = function _getConfigurationContent(task) {
        // Perform request.
        $.ajax({
            url: 'admin.php?do=CronjobAjax/getConfiguration&task=' + task
        }).done(function (response) {
            return response;
        }).fail(function () {
            return 'No configuration found';
        });
    };

    /**
     * Triggers Ajax call to save new configuration values
     *
     * @param task
     * @param data
     * @private
     */
    var _saveConfiguration = function _saveConfiguration(task, data) {
        // AJAX request options.
        var requestOptions = {
            type: 'POST',
            data: { data: data },
            url: 'admin.php?do=CronjobAjax/saveConfiguration&task=' + task
        };

        var $modal = $('.modal.configuration');

        // Perform request.
        $.ajax(requestOptions).done(function (response) {
            return _handleSaveRequestResponse(response);
        }).always(function () {
            return $modal.modal('hide');
        });
    };

    /**
     * Shows success message if save was successful otherwise an error will be displayed
     *
     * @param response
     * @private
     */
    var _handleSaveRequestResponse = function _handleSaveRequestResponse(response) {
        // Error message phrases.
        var errorTitle = jse.core.lang.translate('save_configuration_error_title', 'cronjobs');
        var errorMessage = jse.core.lang.translate('save_configuration_error_text', 'cronjobs');

        // Check for action success.
        if (response.includes('success')) {
            // Add success message to admin info box.
            jse.libs.info_box.addSuccessMessage();
        } else {
            // Show error message modal.
            jse.libs.modal.showMessage(errorTitle, errorMessage);
        }
    };

    var _showCronjobConfiguration = function _showCronjobConfiguration(response) {

        $modalBody.empty();

        $modalBody.attr('data-gx-widget', 'switcher');

        var $form = $('<form/>', {
            'class': 'form-horizontal'
        });
        $form.appendTo($modalBody);

        var configuration = response.configuration;

        for (var i = 0; i < configuration.length; i++) {

            var fieldset = _renderFieldset(jse.core.lang.translate(configuration[i].title, response.language_section));

            for (var test in configuration[i].fields) {
                if (!configuration[i].fields.hasOwnProperty(test)) {
                    continue;
                }

                var configField = configuration[i].fields[test];
                var $input = $('<input/>', {
                    'type': configField.type,
                    'id': configField.name,
                    'name': configField.name,
                    'class': 'form-control',
                    'value': undefined !== configField.value ? configField.value : configField.defaultValue
                });

                if (configuration[i].fields[test].type === 'hidden') {
                    $form.prepend($input);
                    continue;
                }

                if (configField.type === 'select') {
                    var $select = $('<select/>', {
                        'class': 'form-control'
                    });

                    for (var k = 0; k < configField.values.length; k++) {
                        $select.append($('<option/>', {
                            'value': configField.values[k].value,
                            'text': jse.core.lang.translate(configField.values[k].text, response.language_section)
                        }));
                    }
                    var $formGroup = _renderFormGroup(configField.label, response.language_section, $select);
                    fieldset.append($formGroup);
                } else {
                    var _$formGroup = _renderFormGroup(configField.label, response.language_section, $input);
                    fieldset.append(_$formGroup);
                }
            }

            $form.append(fieldset);
        }

        gx.widgets.init($modalBody);
        $modal.modal('show');
    };

    var _renderFieldset = function _renderFieldset(legendTitle) {
        var $fieldset = $('<fieldset/>');
        var $legend = $('<legend/>', { 'text': legendTitle });

        return $fieldset.append($legend);
    };

    var _renderFormGroup = function _renderFormGroup(label, section, $inputHtml) {
        var $formGroup = $('<div/>', {
            'class': 'form-group'
        });
        var $label = $('<label/>', {
            'class': 'col-sm-3 control-label',
            'for': 'active',
            'text': jse.core.lang.translate(label, section)
        });
        var $container = $('<div/>', {
            'class': 'col-sm-9'
        });

        $container.append($inputHtml);
        return $formGroup.append($label).append($container);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    module.init = function (done) {
        $btnOpenConfig.on('click', function (event) {
            var task = $(this).closest('.cronjob-element').attr('data-task');

            event.preventDefault();

            jse.libs.xhr.get({
                url: './admin.php?do=CronjobAjax/getConfiguration&task=' + task
            }).done(_showCronjobConfiguration).fail(function (r) {
                return console.error(r);
            });

            // let confData = _getConfigurationContent(task);
            //
            // $('.configuration.modal .modal-body').html(confData);
            //
            // $modal.attr('data-task', task);
            // $modal.modal('show');
        });

        $('.modal.configuration button[type="submit"]').on('click', function (event) {
            event.preventDefault();

            var formData = $(this).serializeArray();
            var task = $('.modal.configuration').attr('data-task');

            _saveConfiguration(task, formData);
        });

        $('.modal.configuration').on('hide.bs.modal', function () {
            $('.modal.configuration').removeAttr('data-task');
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL2pvYl9jb25maWd1cmF0aW9uLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiJGJ0bk9wZW5Db25maWciLCIkbW9kYWwiLCIkbW9kYWxCb2R5IiwiZmluZCIsIl9nZXRDb25maWd1cmF0aW9uQ29udGVudCIsInRhc2siLCJhamF4IiwidXJsIiwiZG9uZSIsInJlc3BvbnNlIiwiZmFpbCIsIl9zYXZlQ29uZmlndXJhdGlvbiIsInJlcXVlc3RPcHRpb25zIiwidHlwZSIsIl9oYW5kbGVTYXZlUmVxdWVzdFJlc3BvbnNlIiwiYWx3YXlzIiwibW9kYWwiLCJlcnJvclRpdGxlIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJlcnJvck1lc3NhZ2UiLCJpbmNsdWRlcyIsImxpYnMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwic2hvd01lc3NhZ2UiLCJfc2hvd0Nyb25qb2JDb25maWd1cmF0aW9uIiwiZW1wdHkiLCJhdHRyIiwiJGZvcm0iLCJhcHBlbmRUbyIsImNvbmZpZ3VyYXRpb24iLCJpIiwibGVuZ3RoIiwiZmllbGRzZXQiLCJfcmVuZGVyRmllbGRzZXQiLCJ0aXRsZSIsImxhbmd1YWdlX3NlY3Rpb24iLCJ0ZXN0IiwiZmllbGRzIiwiaGFzT3duUHJvcGVydHkiLCJjb25maWdGaWVsZCIsIiRpbnB1dCIsIm5hbWUiLCJ1bmRlZmluZWQiLCJ2YWx1ZSIsImRlZmF1bHRWYWx1ZSIsInByZXBlbmQiLCIkc2VsZWN0IiwiayIsInZhbHVlcyIsImFwcGVuZCIsInRleHQiLCIkZm9ybUdyb3VwIiwiX3JlbmRlckZvcm1Hcm91cCIsImxhYmVsIiwid2lkZ2V0cyIsImluaXQiLCJsZWdlbmRUaXRsZSIsIiRmaWVsZHNldCIsIiRsZWdlbmQiLCJzZWN0aW9uIiwiJGlucHV0SHRtbCIsIiRsYWJlbCIsIiRjb250YWluZXIiLCJvbiIsImV2ZW50IiwiY2xvc2VzdCIsInByZXZlbnREZWZhdWx0IiwieGhyIiwiZ2V0IiwiY29uc29sZSIsImVycm9yIiwiciIsImZvcm1EYXRhIiwic2VyaWFsaXplQXJyYXkiLCJyZW1vdmVBdHRyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7OztBQUdBQSxHQUFHQyxXQUFILENBQWVDLE1BQWY7QUFDSTtBQUNBO0FBQ0E7QUFDQSxtQkFKSjs7QUFNSTtBQUNBO0FBQ0E7QUFDQSxDQUNJLEtBREosRUFFSSxPQUZKLEVBR09GLEdBQUdHLE1BSFYsb0JBVEo7O0FBZUk7QUFDQTtBQUNBO0FBQ0EsVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRixTQUFTLEVBQWY7O0FBRUEsUUFBTVEsaUJBQWlCSixFQUFFLHFCQUFGLENBQXZCOztBQUVBLFFBQU1LLFNBQVNMLEVBQUUsc0JBQUYsQ0FBZjs7QUFFQSxRQUFNTSxhQUFhRCxPQUFPRSxJQUFQLENBQVksYUFBWixDQUFuQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1BLFFBQU1DLDJCQUEyQixTQUEzQkEsd0JBQTJCLENBQVVDLElBQVYsRUFBZ0I7QUFDN0M7QUFDQVQsVUFBRVUsSUFBRixDQUFPO0FBQ0hDLGlCQUFLLG9EQUFvREY7QUFEdEQsU0FBUCxFQUVHRyxJQUZILENBR0ksVUFBVUMsUUFBVixFQUFvQjtBQUNoQixtQkFBT0EsUUFBUDtBQUNILFNBTEwsRUFNRUMsSUFORixDQU9JLFlBQVk7QUFDUixtQkFBTyx3QkFBUDtBQUNILFNBVEw7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K0QsUUFBUUMsS0FBUixDQUFjQyxDQUFkLENBQUw7QUFBQSxhQUZ4Qzs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSCxTQWZEOztBQWlCQS9FLFVBQUUsNENBQUYsRUFBZ0R1RSxFQUFoRCxDQUFtRCxPQUFuRCxFQUE0RCxVQUFVQyxLQUFWLEVBQWlCO0FBQ3pFQSxrQkFBTUUsY0FBTjs7QUFFQSxnQkFBSU0sV0FBV2hGLEVBQUUsSUFBRixFQUFRaUYsY0FBUixFQUFmO0FBQ0EsZ0JBQUl4RSxPQUFPVCxFQUFFLHNCQUFGLEVBQTBCa0MsSUFBMUIsQ0FBK0IsV0FBL0IsQ0FBWDs7QUFFQW5CLCtCQUFtQk4sSUFBbkIsRUFBeUJ1RSxRQUF6QjtBQUNILFNBUEQ7O0FBU0FoRixVQUFFLHNCQUFGLEVBQTBCdUUsRUFBMUIsQ0FBNkIsZUFBN0IsRUFBOEMsWUFBWTtBQUN0RHZFLGNBQUUsc0JBQUYsRUFBMEJrRixVQUExQixDQUFxQyxXQUFyQztBQUNILFNBRkQ7O0FBSUF0RTtBQUNILEtBaENEOztBQWtDQSxXQUFPaEIsTUFBUDtBQUNILENBOVBMIiwiZmlsZSI6ImNyb25qb2JzL2pvYl9jb25maWd1cmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBqb2JfY29uZmlndXJhdGlvbi5qcyAyMDE4LTA4LTI0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBUT0RPOiBDaGFuZ2UgVVJMIGZvciBBamF4IGNhbGxzIHdoZW4gZW5kcG9pbnQgaXMgcmVhZHlcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgTkFNRVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICdqb2JfY29uZmlndXJhdGlvbicsXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIExJQlJBUklFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFtcbiAgICAgICAgJ3hocicsXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBcbiAgICBdLFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ09OVFJPTExFUiBCVVNJTkVTUyBMT0dJQ1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250cm9sbGVyIHJlZmVyZW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIGNvbnN0ICRidG5PcGVuQ29uZmlnID0gJCgnLm9wZW4tY29uZmlndXJhdGlvbicpO1xuXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5tb2RhbC5jb25maWd1cmF0aW9uJyk7XG5cbiAgICAgICAgY29uc3QgJG1vZGFsQm9keSA9ICRtb2RhbC5maW5kKCcubW9kYWwtYm9keScpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBjb25maWd1cmF0aW9uIGVsZW1lbnRzIGZvciBzcGVjaWZpYyB0YXNrXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB0YXNrXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZ2V0Q29uZmlndXJhdGlvbkNvbnRlbnQgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICAgICAgLy8gUGVyZm9ybSByZXF1ZXN0LlxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICdhZG1pbi5waHA/ZG89Q3JvbmpvYkFqYXgvZ2V0Q29uZmlndXJhdGlvbiZ0YXNrPScgKyB0YXNrXG4gICAgICAgICAgICB9KS5kb25lKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS5mYWlsKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdObyBjb25maWd1cmF0aW9uIGZvdW5kJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaWdnZXJzIEFqYXggY2FsbCB0byBzYXZlIG5ldyBjb25maWd1cmF0aW9uIHZhbHVlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gdGFza1xuICAgICAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NhdmVDb25maWd1cmF0aW9uID0gZnVuY3Rpb24gKHRhc2ssIGRhdGEpIHtcbiAgICAgICAgICAgIC8vIEFKQVggcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtkYXRhfSxcbiAgICAgICAgICAgICAgICB1cmw6ICdhZG1pbi5waHA/ZG89Q3JvbmpvYkFqYXgvc2F2ZUNvbmZpZ3VyYXRpb24mdGFzaz0nICsgdGFza1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLm1vZGFsLmNvbmZpZ3VyYXRpb24nKTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSByZXF1ZXN0LlxuICAgICAgICAgICAgJC5hamF4KHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgICAgICAgIC5kb25lKHJlc3BvbnNlID0+IF9oYW5kbGVTYXZlUmVxdWVzdFJlc3BvbnNlKHJlc3BvbnNlKSlcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+ICRtb2RhbC5tb2RhbCgnaGlkZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG93cyBzdWNjZXNzIG1lc3NhZ2UgaWYgc2F2ZSB3YXMgc3VjY2Vzc2Z1bCBvdGhlcndpc2UgYW4gZXJyb3Igd2lsbCBiZSBkaXNwbGF5ZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHJlc3BvbnNlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaGFuZGxlU2F2ZVJlcXVlc3RSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZSBwaHJhc2VzLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JUaXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzYXZlX2NvbmZpZ3VyYXRpb25fZXJyb3JfdGl0bGUnLCAnY3JvbmpvYnMnKTtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzYXZlX2NvbmZpZ3VyYXRpb25fZXJyb3JfdGV4dCcsICdjcm9uam9icycpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgYWN0aW9uIHN1Y2Nlc3MuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuaW5jbHVkZXMoJ3N1Y2Nlc3MnKSkge1xuICAgICAgICAgICAgICAgIC8vIEFkZCBzdWNjZXNzIG1lc3NhZ2UgdG8gYWRtaW4gaW5mbyBib3guXG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlIG1vZGFsLlxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKGVycm9yVGl0bGUsIGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IF9zaG93Q3JvbmpvYkNvbmZpZ3VyYXRpb24gPSByZXNwb25zZSA9PiB7XG5cbiAgICAgICAgICAgICRtb2RhbEJvZHkuZW1wdHkoKTtcblxuICAgICAgICAgICAgJG1vZGFsQm9keS5hdHRyKCdkYXRhLWd4LXdpZGdldCcsICdzd2l0Y2hlcicpXG5cbiAgICAgICAgICAgIGNvbnN0ICRmb3JtID0gJCgnPGZvcm0vPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnZm9ybS1ob3Jpem9udGFsJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkZm9ybS5hcHBlbmRUbygkbW9kYWxCb2R5KTtcblxuICAgICAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbiA9IHJlc3BvbnNlLmNvbmZpZ3VyYXRpb247XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlndXJhdGlvbi5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZmllbGRzZXQgPSBfcmVuZGVyRmllbGRzZXQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoY29uZmlndXJhdGlvbltpXS50aXRsZSwgcmVzcG9uc2UubGFuZ3VhZ2Vfc2VjdGlvbikpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdGVzdCBpbiBjb25maWd1cmF0aW9uW2ldLmZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbmZpZ3VyYXRpb25baV0uZmllbGRzLmhhc093blByb3BlcnR5KHRlc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29uZmlnRmllbGQgPSBjb25maWd1cmF0aW9uW2ldLmZpZWxkc1t0ZXN0XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJCgnPGlucHV0Lz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6IGNvbmZpZ0ZpZWxkLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaWQnOiBjb25maWdGaWVsZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBjb25maWdGaWVsZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2Zvcm0tY29udHJvbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB1bmRlZmluZWQgIT09IGNvbmZpZ0ZpZWxkLnZhbHVlID8gY29uZmlnRmllbGQudmFsdWUgOiBjb25maWdGaWVsZC5kZWZhdWx0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZ3VyYXRpb25baV0uZmllbGRzW3Rlc3RdLnR5cGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wcmVwZW5kKCRpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maWdGaWVsZC50eXBlID09PSAnc2VsZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICQoJzxzZWxlY3QvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnZm9ybS1jb250cm9sJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgY29uZmlnRmllbGQudmFsdWVzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbi8+Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiBjb25maWdGaWVsZC52YWx1ZXNba10udmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoY29uZmlnRmllbGQudmFsdWVzW2tdLnRleHQsIHJlc3BvbnNlLmxhbmd1YWdlX3NlY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJGZvcm1Hcm91cCA9IF9yZW5kZXJGb3JtR3JvdXAoY29uZmlnRmllbGQubGFiZWwsIHJlc3BvbnNlLmxhbmd1YWdlX3NlY3Rpb24sICRzZWxlY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzZXQuYXBwZW5kKCRmb3JtR3JvdXApO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCAkZm9ybUdyb3VwID0gX3JlbmRlckZvcm1Hcm91cChjb25maWdGaWVsZC5sYWJlbCwgcmVzcG9uc2UubGFuZ3VhZ2Vfc2VjdGlvbiwgJGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkc2V0LmFwcGVuZCgkZm9ybUdyb3VwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZChmaWVsZHNldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkbW9kYWxCb2R5KTtcbiAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF9yZW5kZXJGaWVsZHNldCA9IChsZWdlbmRUaXRsZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGZpZWxkc2V0ID0gJCgnPGZpZWxkc2V0Lz4nKTtcbiAgICAgICAgICAgIGNvbnN0ICRsZWdlbmQgPSAkKCc8bGVnZW5kLz4nLCB7J3RleHQnOiBsZWdlbmRUaXRsZX0pO1xuXG4gICAgICAgICAgICByZXR1cm4gJGZpZWxkc2V0LmFwcGVuZCgkbGVnZW5kKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9yZW5kZXJGb3JtR3JvdXAgPSAobGFiZWwsIHNlY3Rpb24sICRpbnB1dEh0bWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtR3JvdXAgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2Zvcm0tZ3JvdXAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0ICRsYWJlbCA9ICQoJzxsYWJlbC8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdjb2wtc20tMyBjb250cm9sLWxhYmVsJyxcbiAgICAgICAgICAgICAgICAnZm9yJzogJ2FjdGl2ZScsXG4gICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZShsYWJlbCwgc2VjdGlvbilcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgJGNvbnRhaW5lciA9ICQoJzxkaXYvPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnY29sLXNtLTknXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGNvbnRhaW5lci5hcHBlbmQoJGlucHV0SHRtbClcbiAgICAgICAgICAgIHJldHVybiAkZm9ybUdyb3VwLmFwcGVuZCgkbGFiZWwpLmFwcGVuZCgkY29udGFpbmVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAkYnRuT3BlbkNvbmZpZy5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXNrID0gJCh0aGlzKS5jbG9zZXN0KCcuY3JvbmpvYi1lbGVtZW50JykuYXR0cignZGF0YS10YXNrJyk7XG5cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPUNyb25qb2JBamF4L2dldENvbmZpZ3VyYXRpb24mdGFzaz0nICsgdGFza1xuICAgICAgICAgICAgICAgIH0pLmRvbmUoX3Nob3dDcm9uam9iQ29uZmlndXJhdGlvbikuZmFpbChyID0+IGNvbnNvbGUuZXJyb3IocikpO1xuXG4gICAgICAgICAgICAgICAgLy8gbGV0IGNvbmZEYXRhID0gX2dldENvbmZpZ3VyYXRpb25Db250ZW50KHRhc2spO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gJCgnLmNvbmZpZ3VyYXRpb24ubW9kYWwgLm1vZGFsLWJvZHknKS5odG1sKGNvbmZEYXRhKTtcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vICRtb2RhbC5hdHRyKCdkYXRhLXRhc2snLCB0YXNrKTtcbiAgICAgICAgICAgICAgICAvLyAkbW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICQoJy5tb2RhbC5jb25maWd1cmF0aW9uIGJ1dHRvblt0eXBlPVwic3VibWl0XCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9ICQodGhpcykuc2VyaWFsaXplQXJyYXkoKTtcbiAgICAgICAgICAgICAgICBsZXQgdGFzayA9ICQoJy5tb2RhbC5jb25maWd1cmF0aW9uJykuYXR0cignZGF0YS10YXNrJyk7XG5cbiAgICAgICAgICAgICAgICBfc2F2ZUNvbmZpZ3VyYXRpb24odGFzaywgZm9ybURhdGEpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJy5tb2RhbC5jb25maWd1cmF0aW9uJykub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnLm1vZGFsLmNvbmZpZ3VyYXRpb24nKS5yZW1vdmVBdHRyKCdkYXRhLXRhc2snKTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTsiXX0=
