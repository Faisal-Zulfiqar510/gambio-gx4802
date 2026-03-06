'use strict';

/* --------------------------------------------------------------
 ajax_file_upload.js 2016-02-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## AJAX File Upload Extension
 *
 * This extension will enable an existing **input[type=file]** element to upload files through AJAX.
 * The upload method can be invoked either manually by calling the "upload" function or automatically
 * once the file is selected. A "validate" event is triggered before upload starts so that you can
 * validate the selected file before it is uploaded and stop the procedure if needed.
 *
 * Currently the module supports the basic upload functionality but you can add extra logic on your own
 * by following code examples in the official page of the plugin.
 *
 * The "auto" option is enabled by default which means that the extension will automatically trigger
 * the upload operation when the user selects a file.
 *
 * {@link https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin}
 *
 * **Important**: If you need to support older versions of Internet Explorer you should use the automatic upload
 * mode because the manual mode uses the JavaScript File API and this is supported from IE 10+.
 *
 * ### Options
 *
 * **URL | `data-ajax_upload_file-url` | String | Required**
 *
 * Define the upload URL that will handle the file upload.
 *
 * **Auto | `data-ajax_upload_file-auto` | Boolean | Optional**
 *
 * Define whether the upload process will be started automatically after the user selects a file.
 *
 * ### Events
 * ```javascript
 * // Add your validation rules, triggered before upload (Manual Mode - Requires JS file API support).
 * $('#upload-file').on('validate', function(event, file) {});
 *
 * // Triggered when server responds to upload request (Manual + Auto Mode).
 * $('#upload-file').on('upload', function(event, response) {});
 * ```
 *
 * ### Methods
 * ```javascript
 * // Trigger the selected file validation, returns a bool value.
 * $('#upload-file').validate();
 *
 * // Trigger the file upload, callback argument is optional.
 * $('#upload-file').upload(callback);
 * ```
 *
 * ### Example
 *
 * **Automatic Upload**
 *
 * The upload process will be triggered automatically after the user selects a file.
 *
 * ```html
 * <!-- HTML -->
 * <input id="upload-file" type="file" data-gx-extension="ajax_file_upload"
 *             data-ajax_file_upload-url="http://url/to/upload-script.php" />
 *
 * <!-- JavaScript -->
 * <script>
 *     $('#upload-file').on('validate', function(event, file) {
 *          // Validation Checks (Only IE 10+) ...
 *          return true; // Return true for success or false for failure - will stop the upload.
 *     });
 *
 *     $('#upload-file').on('upload', function(event, response) {
 *          // The "response" parameter contains the server's response information.
 *     });
 * </script>
 * ```
 *
 * **Manual Upload**
 *
 * The upload process needs to be triggered through JavaScript as shown in the following example.
 *
 *
 * ```html
 * <!-- HTML -->
 * <input id="upload-file" type="file" data-gx-extension="ajax_file_upload"
 *         data-ajax_file_upload-url="http://url/to/upload-script.php"
 *         data-ajax_file_upload-auto="false" />
 * <button id="upload-file-button">Trigger Upload</button>
 *
 * <!-- JavaScript -->
 * <script>
 *     $('#upload-file-button').on('click', function() {
 *          $('#upload-file').upload(function(response) {
 *              // Callback Function (Optional)
 *          });
 *     });
 * </script>
 * ```
 *
 * @module Admin/Extensions/ajax_file_upload
 * @requires jQuery-File-Upload
 */
gx.extensions.module('ajax_file_upload', [jse.source + '/vendor/blueimp-file-upload/jquery.fileupload.min.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference Selector
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options for Extension.
     *
     * @type {object}
     */
    defaults = {
        auto: true
    },


    /**
     * Final Extension Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONALITY
    // ------------------------------------------------------------------------

    /**
     * Check method element type.
     *
     * The element that uses the extended jquery methods must be an input[type=file].
     * Otherwise an exception is thrown.
     *
     * @param {object} $element jQuery selector for the element to be checked.
     *
     * @throws Exception when the element called is not a valid input[type=file].
     *
     * @private
     */
    var _checkElementType = function _checkElementType($element) {
        if (!$element.is('input[type=file]')) {
            throw '$.upload() method is supported only in input[type=file] elements.';
        }
    };

    /**
     * Uploads selected file to server.
     *
     * This method uses the JavaScript File API that is supported from IE10+. If
     * you need to support older browser just enable the auto-upload option and do
     * not use this method.
     *
     * @param callback
     */
    var _upload = function _upload(callback) {
        // Trigger "validate" event for file upload element.
        var file = $this.get(0).files[0];
        if (!_validate(file) || !$this.trigger('validate', [file])) {
            return; // Do not continue as validation checks failed.
        }

        // Create a new instance of the plugin and upload the selected file.
        $this.fileupload({
            url: options.url,
            dataType: 'json'
        });

        $this.fileupload('send', {
            files: [file]
        }).done(function (result, textStatus, jqXHR, file) {
            jse.core.debug.info('AJAX File Upload Success Response:', result, textStatus);
            if (typeof callback === 'function') {
                callback(result);
            }
        }).error(function (jqXHR, textStatus, errorThrown) {
            jse.core.debug.error('AJAX File Upload Failure Response:', jqXHR, textStatus, errorThrown);
        }).complete(function (result, textStatus, jqXHR) {
            $this.fileupload('destroy'); // Not necessary anymore.
        });
    };

    /**
     * Default Validation Rules
     *
     * This method will check for invalid filenames or exceeded file size (if necessary).
     *
     * @param {object} file Contains the information of the file to be uploaded.
     */
    var _validate = function _validate(file) {
        // @todo Implement default file validation.
        try {
            // Check if a file was selected.
            if (file === undefined) {
                throw 'No file was selected for upload.';
            }
            return true;
        } catch (exception) {
            jse.core.debug.error(exception);
            return false;
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize function of the extension, called by the engine.
     */
    module.init = function (done) {
        // Check if upload script URL was provided (required value).
        if (options.url === undefined || options.url === '') {
            jse.core.debug.error('Upload URL was not provided for "ajax_file_upload" extension.');
            return;
        }

        if (options.auto === true) {
            $this.fileupload({
                'dataType': 'json',
                'url': options.url,
                done: function done(event, data) {
                    $(this).trigger('upload', [data.result]);
                }
            });
        } else {
            // Extend jQuery object with upload method for element.
            $.fn.extend({
                upload: function upload(callback) {
                    _checkElementType($(this));
                    _upload(callback); // Trigger upload handler
                },
                validate: function validate() {
                    _checkElementType($(this));
                    return _validate(this.files[0]);
                }
            });
        }

        // Notify engine that the extension initialization is complete.
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXhfZmlsZV91cGxvYWQuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiYXV0byIsIm9wdGlvbnMiLCJleHRlbmQiLCJfY2hlY2tFbGVtZW50VHlwZSIsIiRlbGVtZW50IiwiaXMiLCJfdXBsb2FkIiwiY2FsbGJhY2siLCJmaWxlIiwiZ2V0IiwiZmlsZXMiLCJfdmFsaWRhdGUiLCJ0cmlnZ2VyIiwiZmlsZXVwbG9hZCIsInVybCIsImRhdGFUeXBlIiwiZG9uZSIsInJlc3VsdCIsInRleHRTdGF0dXMiLCJqcVhIUiIsImNvcmUiLCJkZWJ1ZyIsImluZm8iLCJlcnJvciIsImVycm9yVGhyb3duIiwiY29tcGxldGUiLCJ1bmRlZmluZWQiLCJleGNlcHRpb24iLCJpbml0IiwiZXZlbnQiLCJmbiIsInVwbG9hZCIsInZhbGlkYXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdHQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksa0JBREosRUFHSSxDQUNJQyxJQUFJQyxNQUFKLEdBQWEsc0RBRGpCLENBSEosRUFPSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUEMsY0FBTTtBQURDLEtBYmY7OztBQWlCSTs7Ozs7QUFLQUMsY0FBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSCxRQUFuQixFQUE2QkgsSUFBN0IsQ0F0QmQ7OztBQXdCSTs7Ozs7QUFLQUgsYUFBUyxFQTdCYjs7QUErQkE7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RCxNQVFPO0FBQ0g7QUFDQW5CLGNBQUVnQyxFQUFGLENBQUs1QixNQUFMLENBQVk7QUFDUjZCLHdCQUFRLGdCQUFVeEIsUUFBVixFQUFvQjtBQUN4Qkosc0NBQWtCTCxFQUFFLElBQUYsQ0FBbEI7QUFDQVEsNEJBQVFDLFFBQVIsRUFGd0IsQ0FFTDtBQUN0QixpQkFKTztBQUtSeUIsMEJBQVUsb0JBQVk7QUFDbEI3QixzQ0FBa0JMLEVBQUUsSUFBRixDQUFsQjtBQUNBLDJCQUFPYSxVQUFVLEtBQUtELEtBQUwsQ0FBVyxDQUFYLENBQVYsQ0FBUDtBQUNIO0FBUk8sYUFBWjtBQVVIOztBQUVEO0FBQ0FNO0FBQ0gsS0EvQkQ7O0FBaUNBO0FBQ0EsV0FBT3ZCLE1BQVA7QUFDSCxDQTFLTCIsImZpbGUiOiJhamF4X2ZpbGVfdXBsb2FkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBhamF4X2ZpbGVfdXBsb2FkLmpzIDIwMTYtMDItMTFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEFKQVggRmlsZSBVcGxvYWQgRXh0ZW5zaW9uXG4gKlxuICogVGhpcyBleHRlbnNpb24gd2lsbCBlbmFibGUgYW4gZXhpc3RpbmcgKippbnB1dFt0eXBlPWZpbGVdKiogZWxlbWVudCB0byB1cGxvYWQgZmlsZXMgdGhyb3VnaCBBSkFYLlxuICogVGhlIHVwbG9hZCBtZXRob2QgY2FuIGJlIGludm9rZWQgZWl0aGVyIG1hbnVhbGx5IGJ5IGNhbGxpbmcgdGhlIFwidXBsb2FkXCIgZnVuY3Rpb24gb3IgYXV0b21hdGljYWxseVxuICogb25jZSB0aGUgZmlsZSBpcyBzZWxlY3RlZC4gQSBcInZhbGlkYXRlXCIgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSB1cGxvYWQgc3RhcnRzIHNvIHRoYXQgeW91IGNhblxuICogdmFsaWRhdGUgdGhlIHNlbGVjdGVkIGZpbGUgYmVmb3JlIGl0IGlzIHVwbG9hZGVkIGFuZCBzdG9wIHRoZSBwcm9jZWR1cmUgaWYgbmVlZGVkLlxuICpcbiAqIEN1cnJlbnRseSB0aGUgbW9kdWxlIHN1cHBvcnRzIHRoZSBiYXNpYyB1cGxvYWQgZnVuY3Rpb25hbGl0eSBidXQgeW91IGNhbiBhZGQgZXh0cmEgbG9naWMgb24geW91ciBvd25cbiAqIGJ5IGZvbGxvd2luZyBjb2RlIGV4YW1wbGVzIGluIHRoZSBvZmZpY2lhbCBwYWdlIG9mIHRoZSBwbHVnaW4uXG4gKlxuICogVGhlIFwiYXV0b1wiIG9wdGlvbiBpcyBlbmFibGVkIGJ5IGRlZmF1bHQgd2hpY2ggbWVhbnMgdGhhdCB0aGUgZXh0ZW5zaW9uIHdpbGwgYXV0b21hdGljYWxseSB0cmlnZ2VyXG4gKiB0aGUgdXBsb2FkIG9wZXJhdGlvbiB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBmaWxlLlxuICpcbiAqIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vYmx1ZWltcC9qUXVlcnktRmlsZS1VcGxvYWQvd2lraS9CYXNpYy1wbHVnaW59XG4gKlxuICogKipJbXBvcnRhbnQqKjogSWYgeW91IG5lZWQgdG8gc3VwcG9ydCBvbGRlciB2ZXJzaW9ucyBvZiBJbnRlcm5ldCBFeHBsb3JlciB5b3Ugc2hvdWxkIHVzZSB0aGUgYXV0b21hdGljIHVwbG9hZFxuICogbW9kZSBiZWNhdXNlIHRoZSBtYW51YWwgbW9kZSB1c2VzIHRoZSBKYXZhU2NyaXB0IEZpbGUgQVBJIGFuZCB0aGlzIGlzIHN1cHBvcnRlZCBmcm9tIElFIDEwKy5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqVVJMIHwgYGRhdGEtYWpheF91cGxvYWRfZmlsZS11cmxgIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIERlZmluZSB0aGUgdXBsb2FkIFVSTCB0aGF0IHdpbGwgaGFuZGxlIHRoZSBmaWxlIHVwbG9hZC5cbiAqXG4gKiAqKkF1dG8gfCBgZGF0YS1hamF4X3VwbG9hZF9maWxlLWF1dG9gIHwgQm9vbGVhbiB8IE9wdGlvbmFsKipcbiAqXG4gKiBEZWZpbmUgd2hldGhlciB0aGUgdXBsb2FkIHByb2Nlc3Mgd2lsbCBiZSBzdGFydGVkIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgdGhlIHVzZXIgc2VsZWN0cyBhIGZpbGUuXG4gKlxuICogIyMjIEV2ZW50c1xuICogYGBgamF2YXNjcmlwdFxuICogLy8gQWRkIHlvdXIgdmFsaWRhdGlvbiBydWxlcywgdHJpZ2dlcmVkIGJlZm9yZSB1cGxvYWQgKE1hbnVhbCBNb2RlIC0gUmVxdWlyZXMgSlMgZmlsZSBBUEkgc3VwcG9ydCkuXG4gKiAkKCcjdXBsb2FkLWZpbGUnKS5vbigndmFsaWRhdGUnLCBmdW5jdGlvbihldmVudCwgZmlsZSkge30pO1xuICpcbiAqIC8vIFRyaWdnZXJlZCB3aGVuIHNlcnZlciByZXNwb25kcyB0byB1cGxvYWQgcmVxdWVzdCAoTWFudWFsICsgQXV0byBNb2RlKS5cbiAqICQoJyN1cGxvYWQtZmlsZScpLm9uKCd1cGxvYWQnLCBmdW5jdGlvbihldmVudCwgcmVzcG9uc2UpIHt9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBNZXRob2RzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBUcmlnZ2VyIHRoZSBzZWxlY3RlZCBmaWxlIHZhbGlkYXRpb24sIHJldHVybnMgYSBib29sIHZhbHVlLlxuICogJCgnI3VwbG9hZC1maWxlJykudmFsaWRhdGUoKTtcbiAqXG4gKiAvLyBUcmlnZ2VyIHRoZSBmaWxlIHVwbG9hZCwgY2FsbGJhY2sgYXJndW1lbnQgaXMgb3B0aW9uYWwuXG4gKiAkKCcjdXBsb2FkLWZpbGUnKS51cGxvYWQoY2FsbGJhY2spO1xuICogYGBgXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiAqKkF1dG9tYXRpYyBVcGxvYWQqKlxuICpcbiAqIFRoZSB1cGxvYWQgcHJvY2VzcyB3aWxsIGJlIHRyaWdnZXJlZCBhdXRvbWF0aWNhbGx5IGFmdGVyIHRoZSB1c2VyIHNlbGVjdHMgYSBmaWxlLlxuICpcbiAqIGBgYGh0bWxcbiAqIDwhLS0gSFRNTCAtLT5cbiAqIDxpbnB1dCBpZD1cInVwbG9hZC1maWxlXCIgdHlwZT1cImZpbGVcIiBkYXRhLWd4LWV4dGVuc2lvbj1cImFqYXhfZmlsZV91cGxvYWRcIlxuICogICAgICAgICAgICAgZGF0YS1hamF4X2ZpbGVfdXBsb2FkLXVybD1cImh0dHA6Ly91cmwvdG8vdXBsb2FkLXNjcmlwdC5waHBcIiAvPlxuICpcbiAqIDwhLS0gSmF2YVNjcmlwdCAtLT5cbiAqIDxzY3JpcHQ+XG4gKiAgICAgJCgnI3VwbG9hZC1maWxlJykub24oJ3ZhbGlkYXRlJywgZnVuY3Rpb24oZXZlbnQsIGZpbGUpIHtcbiAqICAgICAgICAgIC8vIFZhbGlkYXRpb24gQ2hlY2tzIChPbmx5IElFIDEwKykgLi4uXG4gKiAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gUmV0dXJuIHRydWUgZm9yIHN1Y2Nlc3Mgb3IgZmFsc2UgZm9yIGZhaWx1cmUgLSB3aWxsIHN0b3AgdGhlIHVwbG9hZC5cbiAqICAgICB9KTtcbiAqXG4gKiAgICAgJCgnI3VwbG9hZC1maWxlJykub24oJ3VwbG9hZCcsIGZ1bmN0aW9uKGV2ZW50LCByZXNwb25zZSkge1xuICogICAgICAgICAgLy8gVGhlIFwicmVzcG9uc2VcIiBwYXJhbWV0ZXIgY29udGFpbnMgdGhlIHNlcnZlcidzIHJlc3BvbnNlIGluZm9ybWF0aW9uLlxuICogICAgIH0pO1xuICogPC9zY3JpcHQ+XG4gKiBgYGBcbiAqXG4gKiAqKk1hbnVhbCBVcGxvYWQqKlxuICpcbiAqIFRoZSB1cGxvYWQgcHJvY2VzcyBuZWVkcyB0byBiZSB0cmlnZ2VyZWQgdGhyb3VnaCBKYXZhU2NyaXB0IGFzIHNob3duIGluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZS5cbiAqXG4gKlxuICogYGBgaHRtbFxuICogPCEtLSBIVE1MIC0tPlxuICogPGlucHV0IGlkPVwidXBsb2FkLWZpbGVcIiB0eXBlPVwiZmlsZVwiIGRhdGEtZ3gtZXh0ZW5zaW9uPVwiYWpheF9maWxlX3VwbG9hZFwiXG4gKiAgICAgICAgIGRhdGEtYWpheF9maWxlX3VwbG9hZC11cmw9XCJodHRwOi8vdXJsL3RvL3VwbG9hZC1zY3JpcHQucGhwXCJcbiAqICAgICAgICAgZGF0YS1hamF4X2ZpbGVfdXBsb2FkLWF1dG89XCJmYWxzZVwiIC8+XG4gKiA8YnV0dG9uIGlkPVwidXBsb2FkLWZpbGUtYnV0dG9uXCI+VHJpZ2dlciBVcGxvYWQ8L2J1dHRvbj5cbiAqXG4gKiA8IS0tIEphdmFTY3JpcHQgLS0+XG4gKiA8c2NyaXB0PlxuICogICAgICQoJyN1cGxvYWQtZmlsZS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICQoJyN1cGxvYWQtZmlsZScpLnVwbG9hZChmdW5jdGlvbihyZXNwb25zZSkge1xuICogICAgICAgICAgICAgIC8vIENhbGxiYWNrIEZ1bmN0aW9uIChPcHRpb25hbClcbiAqICAgICAgICAgIH0pO1xuICogICAgIH0pO1xuICogPC9zY3JpcHQ+XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL0V4dGVuc2lvbnMvYWpheF9maWxlX3VwbG9hZFxuICogQHJlcXVpcmVzIGpRdWVyeS1GaWxlLVVwbG9hZFxuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAnYWpheF9maWxlX3VwbG9hZCcsXG5cbiAgICBbXG4gICAgICAgIGpzZS5zb3VyY2UgKyAnL3ZlbmRvci9ibHVlaW1wLWZpbGUtdXBsb2FkL2pxdWVyeS5maWxldXBsb2FkLm1pbi5qcydcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiBSZWZlcmVuY2UgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb24uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgYXV0bzogdHJ1ZVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBFeHRlbnNpb24gT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05BTElUWVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2sgbWV0aG9kIGVsZW1lbnQgdHlwZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGVsZW1lbnQgdGhhdCB1c2VzIHRoZSBleHRlbmRlZCBqcXVlcnkgbWV0aG9kcyBtdXN0IGJlIGFuIGlucHV0W3R5cGU9ZmlsZV0uXG4gICAgICAgICAqIE90aGVyd2lzZSBhbiBleGNlcHRpb24gaXMgdGhyb3duLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gJGVsZW1lbnQgalF1ZXJ5IHNlbGVjdG9yIGZvciB0aGUgZWxlbWVudCB0byBiZSBjaGVja2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdGhyb3dzIEV4Y2VwdGlvbiB3aGVuIHRoZSBlbGVtZW50IGNhbGxlZCBpcyBub3QgYSB2YWxpZCBpbnB1dFt0eXBlPWZpbGVdLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jaGVja0VsZW1lbnRUeXBlID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgICAgICAgICBpZiAoISRlbGVtZW50LmlzKCdpbnB1dFt0eXBlPWZpbGVdJykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyAnJC51cGxvYWQoKSBtZXRob2QgaXMgc3VwcG9ydGVkIG9ubHkgaW4gaW5wdXRbdHlwZT1maWxlXSBlbGVtZW50cy4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGxvYWRzIHNlbGVjdGVkIGZpbGUgdG8gc2VydmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBKYXZhU2NyaXB0IEZpbGUgQVBJIHRoYXQgaXMgc3VwcG9ydGVkIGZyb20gSUUxMCsuIElmXG4gICAgICAgICAqIHlvdSBuZWVkIHRvIHN1cHBvcnQgb2xkZXIgYnJvd3NlciBqdXN0IGVuYWJsZSB0aGUgYXV0by11cGxvYWQgb3B0aW9uIGFuZCBkb1xuICAgICAgICAgKiBub3QgdXNlIHRoaXMgbWV0aG9kLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfdXBsb2FkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBUcmlnZ2VyIFwidmFsaWRhdGVcIiBldmVudCBmb3IgZmlsZSB1cGxvYWQgZWxlbWVudC5cbiAgICAgICAgICAgIHZhciBmaWxlID0gJHRoaXMuZ2V0KDApLmZpbGVzWzBdO1xuICAgICAgICAgICAgaWYgKCFfdmFsaWRhdGUoZmlsZSkgfHwgISR0aGlzLnRyaWdnZXIoJ3ZhbGlkYXRlJywgW2ZpbGVdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gRG8gbm90IGNvbnRpbnVlIGFzIHZhbGlkYXRpb24gY2hlY2tzIGZhaWxlZC5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBwbHVnaW4gYW5kIHVwbG9hZCB0aGUgc2VsZWN0ZWQgZmlsZS5cbiAgICAgICAgICAgICR0aGlzLmZpbGV1cGxvYWQoe1xuICAgICAgICAgICAgICAgIHVybDogb3B0aW9ucy51cmwsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbGV1cGxvYWQoJ3NlbmQnLCB7XG4gICAgICAgICAgICAgICAgZmlsZXM6IFtmaWxlXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzdWx0LCB0ZXh0U3RhdHVzLCBqcVhIUiwgZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5pbmZvKCdBSkFYIEZpbGUgVXBsb2FkIFN1Y2Nlc3MgUmVzcG9uc2U6JywgcmVzdWx0LCB0ZXh0U3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUuZGVidWcuZXJyb3IoJ0FKQVggRmlsZSBVcGxvYWQgRmFpbHVyZSBSZXNwb25zZTonLCBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNvbXBsZXRlKGZ1bmN0aW9uIChyZXN1bHQsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbGV1cGxvYWQoJ2Rlc3Ryb3knKTsgLy8gTm90IG5lY2Vzc2FyeSBhbnltb3JlLlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IFZhbGlkYXRpb24gUnVsZXNcbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBjaGVjayBmb3IgaW52YWxpZCBmaWxlbmFtZXMgb3IgZXhjZWVkZWQgZmlsZSBzaXplIChpZiBuZWNlc3NhcnkpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZmlsZSBDb250YWlucyB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIGZpbGUgdG8gYmUgdXBsb2FkZWQuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3ZhbGlkYXRlID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgIC8vIEB0b2RvIEltcGxlbWVudCBkZWZhdWx0IGZpbGUgdmFsaWRhdGlvbi5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYSBmaWxlIHdhcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICAgICBpZiAoZmlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdObyBmaWxlIHdhcyBzZWxlY3RlZCBmb3IgdXBsb2FkLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAganNlLmNvcmUuZGVidWcuZXJyb3IoZXhjZXB0aW9uKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIGZ1bmN0aW9uIG9mIHRoZSBleHRlbnNpb24sIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdXBsb2FkIHNjcmlwdCBVUkwgd2FzIHByb3ZpZGVkIChyZXF1aXJlZCB2YWx1ZSkuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy51cmwgPT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnVybCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5lcnJvcignVXBsb2FkIFVSTCB3YXMgbm90IHByb3ZpZGVkIGZvciBcImFqYXhfZmlsZV91cGxvYWRcIiBleHRlbnNpb24uJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hdXRvID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmlsZXVwbG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICdkYXRhVHlwZSc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgJ3VybCc6IG9wdGlvbnMudXJsLFxuICAgICAgICAgICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcigndXBsb2FkJywgW2RhdGEucmVzdWx0XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRXh0ZW5kIGpRdWVyeSBvYmplY3Qgd2l0aCB1cGxvYWQgbWV0aG9kIGZvciBlbGVtZW50LlxuICAgICAgICAgICAgICAgICQuZm4uZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGVja0VsZW1lbnRUeXBlKCQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3VwbG9hZChjYWxsYmFjayk7IC8vIFRyaWdnZXIgdXBsb2FkIGhhbmRsZXJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGVja0VsZW1lbnRUeXBlKCQodGhpcykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF92YWxpZGF0ZSh0aGlzLmZpbGVzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOb3RpZnkgZW5naW5lIHRoYXQgdGhlIGV4dGVuc2lvbiBpbml0aWFsaXphdGlvbiBpcyBjb21wbGV0ZS5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
