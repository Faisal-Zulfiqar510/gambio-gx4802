'use strict';

/* --------------------------------------------------------------
 filemanager.js 2020-06-26
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Filemanager Widget
 *
 * Creates an input field and a button in order to make it possible to upload files or to select already
 * uploaded files. This widget checks if the responsive filemanager is present, if it is, the responsive
 * filemanager will be used, else a fallback will be used, which is an input field of type 'file'.
 *
 * ### Options
 *
 * **Type | `data-filemanager-type` | String | Optional**
 *
 * Provide the allowed file upload type. Currently there are 3 options which are:
 *    * 'all' - All file types are allowed
 *    * 'videos' - Only video files are allowed
 *    * 'images' - Only images are allowed
 * If you don't provide any type, the filemanager will default to 'all'.
 *
 * **Content Directory | `data-filemanager-content-directory` | String | Required**
 *
 * Provide the directory which should be opened when the filemanager gets opened, e.g. 'media'.
 * You can also provide a path from the root of your shop e.g 'images/slider_images'.
 *
 * **Name | `data-filemanager-name` | String | Required**
 *
 * The name of the input field. It will be set as the HTML name attribute.
 *
 * **Previous File | `data-filemanager-previous-file` | String | Optional**
 *
 * Name of the previous file. The name will be used in order to auto fill the input field.
 *
 * **Page | `data-filemanager-page` | String | Optional**
 *
 * The name of the current page in snake case, for example: new_category or responsive_filemanager.
 * This option will be used in order to load custom configuration files for the responsive file manager like
 * responsive_filemanager.config.php. These custom configuration files will be available or should be created
 * in the 'page' directory of the responsive file manager.
 *
 * **Page Active | `data-filemanager-page-active` | Boolean | Required**
 *
 * This option is required in order to check whether the file manager module is active, and if the configuration
 * option from the file manager is set to active, for the current page. If the module is not active, or active
 * in general but not active for the current page, the fallback will be used, which is a standard input field.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-widget="filemanager"
 *     data-filemanager-name="categories_icon" // Required
 *     data-filemanager-type="images" // Optional
 *     data-filemanager-content-directory="images/categories/icons" // Required
 *     data-filemanager-previous-file="filename.extension" // Optional
 *     data-filemanager-page="responsive_filemanager" // Optional
 *     data-filemanager-page-active="true"> // Required
 * </div>
 * ```
 *
 * @module Admin/Widgets/filemanager
 */
gx.widgets.module('filemanager', ['xhr', 'modal'],

/** @lends module:Widgets/filemanager */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Widget Reference
     *
     * @type {object}
     */

    var $this = $(this);

    /**
     * Default Widget Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Widget Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    /**
     * Id of the file manager input field.
     *
     * @type {string}
     */
    var fieldId = void 0;

    /**
     * Ajax request url fetch the file managers configuration settings.
     *
     * @type {string}
     */
    var fileManagerConfigurationUrl = jse.core.config.get('appUrl') + '/admin/admin.php?do=ResponsiveFileManagerModuleCenterModule/GetConfiguration';

    /**
     *  Cache key.
     *
     * @type {string}
     */
    var cacheKey = 'responsiveFileManager';

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------
    // FILE MANAGER CONFIGURATIONS
    // ------------------------------------------------------------------------
    /**
     * Returns the allowed file type as an integer, which is mapped
     * for the external Responsive Filemanager plugin. It will be used
     * as a GET parameter in the URL for the file manager.
     *
     * @returns {number} Flag integer value between 0 and 3.
     */
    var _getFMType = function _getFMType() {
        switch (options.type) {
            case 'images':
                return 1;
            case 'all':
                return 2;
            case 'videos':
                return 3;
            default:
                return 0;
        }
    };

    /**
     * File managers request url.
     *
     * @returns {string} Request url of file manager.
     */
    var _getFMUrl = function _getFMUrl() {
        // Language parameter used for the file manager
        var lang = jse.core.registry.get('languageId') === 2 ? 'de' : 'en_EN';

        // Don't use the popup mode if the file manager will be opened in a modal.
        var popUp = _isCompatibilityModeEnabled() ? 1 : '';

        return jse.core.config.get('appUrl') + '/' + 'ResponsiveFilemanager/filemanager/filemanager.php?type=' + _getFMType() + _getSubDirectoryQueryString() + '&field_id=' + fieldId + '&popup=' + popUp + '&relative_url=1&lang=' + lang + _getPageQueryString();
    };

    /**
     * Returns the 'sub_folder' query argument for the file manager request.
     *
     * @returns {string} Query parameter for file manager request to set the root directory.
     */
    var _getSubDirectoryQueryString = function _getSubDirectoryQueryString() {
        if (options.contentDirectory !== undefined) {
            return '&sub_folder=' + options.contentDirectory;
        }

        return '';
    };

    /**
     * Returns the 'page' query string for the file manager request.
     *
     * @returns {string} Query parameter for the file manager request to load a custom configuration file.
     */
    var _getPageQueryString = function _getPageQueryString() {
        if (options.page !== undefined) {
            return '&page=' + options.page;
        }

        return '';
    };

    /**
     * Generates a global unique identifier for each input that is generated by this widget.
     * This ID will be used in order to identify an input fields. With the help of this ID,
     * the widget knows, in which input field the file name of the chose file should be entered.
     *
     * @returns {string} Global unique identifier as string.
     */
    var guidGenerator = function guidGenerator() {
        var s4 = function s4() {
            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        };

        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };

    // ------------------------------------------------------------------------
    // CREATING THE FILE MANAGER
    // ------------------------------------------------------------------------
    /**
     * Factory, which creates either the responsive file manager or the fallback,
     * which is a standard input field of the type 'file'.
     *
     * @type {{responsive: (function()), fallback: (function())}}
     */
    var factory = {
        responsive: function responsive() {
            var $uploadIcon = $('<i/>', {
                'class': 'fa fa-upload',
                'aria-hidden': true
            });

            var $removeIcon = $('<i/>', {
                'class': 'fa fa-remove',
                'aria-hidden': true
            });

            var $input = $('<input/>', {
                'type': 'text',
                'name': options.name,
                'id': fieldId,
                'class': 'form-control',
                'readonly': 'readonly'
            });

            // Auto fill the input field with the previous file name
            if (options.previousFile) {
                $input.val(options.previousFile);
            }

            var $uploadButton = $('<a/>', {
                'class': 'btn responsive-file-manager',
                'type': 'button',
                'html': $uploadIcon,
                'on': {
                    'click': function click() {
                        return _openFileManager();
                    }
                }
            });

            var $removeButton = $('<a/>', {
                'class': 'btn responsive-file-manager',
                'type': 'button',
                'html': $removeIcon,
                'on': {
                    'click': function click() {
                        return $input.val('');
                    }
                }
            });

            var $span = $('<span/>', {
                'class': 'input-group-btn'
            });

            var $container = $('<div/>', {
                'class': 'input-group responsive-file-manager'
            });

            $span.append($uploadButton);
            $span.append($removeButton);

            $container.append($input).append($span);
            $this.append($container);
        },

        fallback: function fallback() {
            var $input = $('<input/>', {
                'name': options.name,
                'type': 'file'
            });

            $this.append($input);
        }
    };

    /**
     /**
     * Creates the widget after the request the responsive file manager
     * request is being made. After the request, either the 'responsive'
     * widget is created or the fallback, depending on if the file manager
     * is available.
     *
     * @param done Done callback function for module.init.
     */
    var _createWidget = function _createWidget(done) {
        jse.libs.xhr.get({ url: fileManagerConfigurationUrl }).done(function (response) {
            return jse.core.registry.set(cacheKey, response.isInstalled ? 'responsive' : 'fallback');
        }).fail(function () {
            return jse.core.registry.set(cacheKey, 'fallback');
        }).always(function () {
            // Create the file manager or fallback.
            factory[jse.core.registry.get(cacheKey)]();
            done();
        });
    };

    /**
     * Creates the widget when the cache key changes from pending.
     * After the cache key changed to either the 'responsive' or 'fallback',
     * the according widget will be created, depending on if the file manager
     * is available.
     *
     * @param done Done callback function for module.init.
     */
    var _createWidgetWhenCacheKeyAvailable = function _createWidgetWhenCacheKeyAvailable(done) {
        var interval = setInterval(function () {
            if (jse.core.registry.get(cacheKey) !== 'pending') {
                clearInterval(interval);

                // Create the file manager or fallback.
                factory[jse.core.registry.get(cacheKey)]();
                done();
            }
        }, 100);
    };

    // ------------------------------------------------------------------------
    // OPENING THE FILE MANAGER
    // ------------------------------------------------------------------------
    /**
     * Opens the file manager in a new window popup.
     */
    var _openFMPopup = function _openFMPopup() {
        var w = 990;
        var h = 600;
        var l = Math.floor((screen.width - w) / 2);
        var t = Math.floor((screen.height - h) / 2);

        window.open(_getFMUrl(), 'ResponsiveFilemanager', "scrollbars=1,width=" + w + ",height=" + h + ",top=" + t + ",left=" + l);
    };

    /**
     * Opens the file manager in a bootstrap modal.
     */
    var _openFMModal = function _openFMModal() {

        // Use the fallback if bootstraps modal function is not available.
        if ($.fn.modal === undefined) {
            return _openFMPopup();
        }

        var iFrame = '<iframe src="' + _getFMUrl() + '" width="100%" height="550" frameborder="0"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tclass="responsive-filemanager"></iframe>';

        jse.libs.modal.showMessage('Filemanager', iFrame);
        _makeModalLarge();
    };

    /**
     * Makes the modal large by adding the modal-lg css class.
     */
    var _makeModalLarge = function _makeModalLarge() {
        $('.modal-dialog:last').addClass('modal-lg');
    };

    /**
     * Checks if compatibility mode is active.
     *
     * @returns {boolean} True on compatibility mode, false otherwise.
     */
    var _isCompatibilityModeEnabled = function _isCompatibilityModeEnabled() {
        return $('body.gx-compatibility').length !== 0;
    };

    /**
     * Opens the file manager in a modal, dialog or window with the priority in
     * the same order. If bootstrap is not available, the file
     * manager will be opened in a new window.
     */
    var _openFileManager = function _openFileManager() {
        if (_isCompatibilityModeEnabled()) {
            return _openFMPopup();
        }

        _openFMModal();
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        fieldId = guidGenerator();

        // Required option not provided
        if (options.contentDirectory === undefined || options.contentDirectory === '') {
            jse.core.debug.error('content-directory attribute was not provided for the "filemanager" widget.');
            return;
        }

        // Required option not provided
        if (options.name === undefined || options.name === '') {
            jse.core.debug.error('name attribute was not provided for the "filemanager" widget.');
            return;
        }

        // Required option not provided
        if (options.pageActive === undefined) {
            jse.core.debug.error('page-active attribute was not provided for the "filemanager" widget.');
            return;
        }

        // Module is not active at all or not active for the used page.
        if (!options.pageActive) {
            factory.fallback();
            done();
            return;
        }

        // No cache key available yet. Create the widget and set the cache key to 'fallback' or 'responsive'
        // after the responsive has arrived (done by the _createWidget function).
        if (jse.core.registry.get(cacheKey) === undefined) {
            jse.core.registry.set(cacheKey, 'pending');
            _createWidget(done);
            return;
        }

        // Cache key is on 'pending' which means we have to wait until the key changes (done by the _createWidget function).
        // Afterwards we can create the correct widget.
        if (jse.core.registry.get(cacheKey) === 'pending') {
            _createWidgetWhenCacheKeyAvailable(done);
            return;
        }

        // Build the fallback or responsive file manager.
        factory[jse.core.registry.get(cacheKey)]();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGVtYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJmaWVsZElkIiwiZmlsZU1hbmFnZXJDb25maWd1cmF0aW9uVXJsIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsImNhY2hlS2V5IiwiX2dldEZNVHlwZSIsInR5cGUiLCJfZ2V0Rk1VcmwiLCJsYW5nIiwicmVnaXN0cnkiLCJwb3BVcCIsIl9pc0NvbXBhdGliaWxpdHlNb2RlRW5hYmxlZCIsIl9nZXRTdWJEaXJlY3RvcnlRdWVyeVN0cmluZyIsIl9nZXRQYWdlUXVlcnlTdHJpbmciLCJjb250ZW50RGlyZWN0b3J5IiwidW5kZWZpbmVkIiwicGFnZSIsImd1aWRHZW5lcmF0b3IiLCJzNCIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsImZhY3RvcnkiLCJyZXNwb25zaXZlIiwiJHVwbG9hZEljb24iLCIkcmVtb3ZlSWNvbiIsIiRpbnB1dCIsIm5hbWUiLCJwcmV2aW91c0ZpbGUiLCJ2YWwiLCIkdXBsb2FkQnV0dG9uIiwiX29wZW5GaWxlTWFuYWdlciIsIiRyZW1vdmVCdXR0b24iLCIkc3BhbiIsIiRjb250YWluZXIiLCJhcHBlbmQiLCJmYWxsYmFjayIsIl9jcmVhdGVXaWRnZXQiLCJsaWJzIiwieGhyIiwidXJsIiwiZG9uZSIsInNldCIsInJlc3BvbnNlIiwiaXNJbnN0YWxsZWQiLCJmYWlsIiwiYWx3YXlzIiwiX2NyZWF0ZVdpZGdldFdoZW5DYWNoZUtleUF2YWlsYWJsZSIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwiX29wZW5GTVBvcHVwIiwidyIsImgiLCJsIiwiZmxvb3IiLCJzY3JlZW4iLCJ3aWR0aCIsInQiLCJoZWlnaHQiLCJ3aW5kb3ciLCJvcGVuIiwiX29wZW5GTU1vZGFsIiwiZm4iLCJtb2RhbCIsImlGcmFtZSIsInNob3dNZXNzYWdlIiwiX21ha2VNb2RhbExhcmdlIiwiYWRkQ2xhc3MiLCJsZW5ndGgiLCJpbml0IiwiZGVidWciLCJlcnJvciIsInBhZ2VBY3RpdmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBEQUEsR0FBR0MsT0FBSCxDQUFXQyxNQUFYLENBQ0ksYUFESixFQUdJLENBQUMsS0FBRCxFQUFRLE9BQVIsQ0FISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBSU8sZ0JBQUo7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsOEJBQThCQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQzlCLDhFQUROOztBQUdBOzs7OztBQUtBLFFBQU1DLFdBQVcsdUJBQWpCOztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BLFFBQU1DLGFBQWEsU0FBYkEsVUFBYSxHQUFNO0FBQ3JCLGdCQUFRVCxRQUFRVSxJQUFoQjtBQUNJLGlCQUFLLFFBQUw7QUFDSSx1QkFBTyxDQUFQO0FBQ0osaUJBQUssS0FBTDtBQUNJLHVCQUFPLENBQVA7QUFDSixpQkFBSyxRQUFMO0FBQ0ksdUJBQU8sQ0FBUDtBQUNKO0FBQ0ksdUJBQU8sQ0FBUDtBQVJSO0FBVUgsS0FYRDs7QUFhQTs7Ozs7QUFLQSxRQUFN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QUFULENBQWVDLEtBQWYsQ0FBcUIsc0VBQXJCO0FBQ0E7QUFDSDs7QUFFRDtBQUNBLFlBQUksQ0FBQzdFLFFBQVE4RSxVQUFiLEVBQXlCO0FBQ3JCbkQsb0JBQVFjLFFBQVI7QUFDQUs7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQSxZQUFJMUMsSUFBSUMsSUFBSixDQUFTUSxRQUFULENBQWtCTixHQUFsQixDQUFzQkMsUUFBdEIsTUFBb0NXLFNBQXhDLEVBQW1EO0FBQy9DZixnQkFBSUMsSUFBSixDQUFTUSxRQUFULENBQWtCa0MsR0FBbEIsQ0FBc0J2QyxRQUF0QixFQUFnQyxTQUFoQztBQUNBa0MsMEJBQWNJLElBQWQ7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQSxZQUFJMUMsSUFBSUMsSUFBSixDQUFTUSxRQUFULENBQWtCTixHQUFsQixDQUFzQkMsUUFBdEIsTUFBb0MsU0FBeEMsRUFBbUQ7QUFDL0M0QywrQ0FBbUNOLElBQW5DO0FBQ0E7QUFDSDs7QUFFRDtBQUNBbkIsZ0JBQVF2QixJQUFJQyxJQUFKLENBQVNRLFFBQVQsQ0FBa0JOLEdBQWxCLENBQXNCQyxRQUF0QixDQUFSO0FBQ0gsS0E3Q0Q7O0FBK0NBO0FBQ0EsV0FBT2IsTUFBUDtBQUNILENBcFlMIiwiZmlsZSI6ImZpbGVtYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBmaWxlbWFuYWdlci5qcyAyMDIwLTA2LTI2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBGaWxlbWFuYWdlciBXaWRnZXRcbiAqXG4gKiBDcmVhdGVzIGFuIGlucHV0IGZpZWxkIGFuZCBhIGJ1dHRvbiBpbiBvcmRlciB0byBtYWtlIGl0IHBvc3NpYmxlIHRvIHVwbG9hZCBmaWxlcyBvciB0byBzZWxlY3QgYWxyZWFkeVxuICogdXBsb2FkZWQgZmlsZXMuIFRoaXMgd2lkZ2V0IGNoZWNrcyBpZiB0aGUgcmVzcG9uc2l2ZSBmaWxlbWFuYWdlciBpcyBwcmVzZW50LCBpZiBpdCBpcywgdGhlIHJlc3BvbnNpdmVcbiAqIGZpbGVtYW5hZ2VyIHdpbGwgYmUgdXNlZCwgZWxzZSBhIGZhbGxiYWNrIHdpbGwgYmUgdXNlZCwgd2hpY2ggaXMgYW4gaW5wdXQgZmllbGQgb2YgdHlwZSAnZmlsZScuXG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKlR5cGUgfCBgZGF0YS1maWxlbWFuYWdlci10eXBlYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIHRoZSBhbGxvd2VkIGZpbGUgdXBsb2FkIHR5cGUuIEN1cnJlbnRseSB0aGVyZSBhcmUgMyBvcHRpb25zIHdoaWNoIGFyZTpcbiAqICAgICogJ2FsbCcgLSBBbGwgZmlsZSB0eXBlcyBhcmUgYWxsb3dlZFxuICogICAgKiAndmlkZW9zJyAtIE9ubHkgdmlkZW8gZmlsZXMgYXJlIGFsbG93ZWRcbiAqICAgICogJ2ltYWdlcycgLSBPbmx5IGltYWdlcyBhcmUgYWxsb3dlZFxuICogSWYgeW91IGRvbid0IHByb3ZpZGUgYW55IHR5cGUsIHRoZSBmaWxlbWFuYWdlciB3aWxsIGRlZmF1bHQgdG8gJ2FsbCcuXG4gKlxuICogKipDb250ZW50IERpcmVjdG9yeSB8IGBkYXRhLWZpbGVtYW5hZ2VyLWNvbnRlbnQtZGlyZWN0b3J5YCB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBQcm92aWRlIHRoZSBkaXJlY3Rvcnkgd2hpY2ggc2hvdWxkIGJlIG9wZW5lZCB3aGVuIHRoZSBmaWxlbWFuYWdlciBnZXRzIG9wZW5lZCwgZS5nLiAnbWVkaWEnLlxuICogWW91IGNhbiBhbHNvIHByb3ZpZGUgYSBwYXRoIGZyb20gdGhlIHJvb3Qgb2YgeW91ciBzaG9wIGUuZyAnaW1hZ2VzL3NsaWRlcl9pbWFnZXMnLlxuICpcbiAqICoqTmFtZSB8IGBkYXRhLWZpbGVtYW5hZ2VyLW5hbWVgIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIFRoZSBuYW1lIG9mIHRoZSBpbnB1dCBmaWVsZC4gSXQgd2lsbCBiZSBzZXQgYXMgdGhlIEhUTUwgbmFtZSBhdHRyaWJ1dGUuXG4gKlxuICogKipQcmV2aW91cyBGaWxlIHwgYGRhdGEtZmlsZW1hbmFnZXItcHJldmlvdXMtZmlsZWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogTmFtZSBvZiB0aGUgcHJldmlvdXMgZmlsZS4gVGhlIG5hbWUgd2lsbCBiZSB1c2VkIGluIG9yZGVyIHRvIGF1dG8gZmlsbCB0aGUgaW5wdXQgZmllbGQuXG4gKlxuICogKipQYWdlIHwgYGRhdGEtZmlsZW1hbmFnZXItcGFnZWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGFnZSBpbiBzbmFrZSBjYXNlLCBmb3IgZXhhbXBsZTogbmV3X2NhdGVnb3J5IG9yIHJlc3BvbnNpdmVfZmlsZW1hbmFnZXIuXG4gKiBUaGlzIG9wdGlvbiB3aWxsIGJlIHVzZWQgaW4gb3JkZXIgdG8gbG9hZCBjdXN0b20gY29uZmlndXJhdGlvbiBmaWxlcyBmb3IgdGhlIHJlc3BvbnNpdmUgZmlsZSBtYW5hZ2VyIGxpa2VcbiAqIHJlc3BvbnNpdmVfZmlsZW1hbmFnZXIuY29uZmlnLnBocC4gVGhlc2UgY3VzdG9tIGNvbmZpZ3VyYXRpb24gZmlsZXMgd2lsbCBiZSBhdmFpbGFibGUgb3Igc2hvdWxkIGJlIGNyZWF0ZWRcbiAqIGluIHRoZSAncGFnZScgZGlyZWN0b3J5IG9mIHRoZSByZXNwb25zaXZlIGZpbGUgbWFuYWdlci5cbiAqXG4gKiAqKlBhZ2UgQWN0aXZlIHwgYGRhdGEtZmlsZW1hbmFnZXItcGFnZS1hY3RpdmVgIHwgQm9vbGVhbiB8IFJlcXVpcmVkKipcbiAqXG4gKiBUaGlzIG9wdGlvbiBpcyByZXF1aXJlZCBpbiBvcmRlciB0byBjaGVjayB3aGV0aGVyIHRoZSBmaWxlIG1hbmFnZXIgbW9kdWxlIGlzIGFjdGl2ZSwgYW5kIGlmIHRoZSBjb25maWd1cmF0aW9uXG4gKiBvcHRpb24gZnJvbSB0aGUgZmlsZSBtYW5hZ2VyIGlzIHNldCB0byBhY3RpdmUsIGZvciB0aGUgY3VycmVudCBwYWdlLiBJZiB0aGUgbW9kdWxlIGlzIG5vdCBhY3RpdmUsIG9yIGFjdGl2ZVxuICogaW4gZ2VuZXJhbCBidXQgbm90IGFjdGl2ZSBmb3IgdGhlIGN1cnJlbnQgcGFnZSwgdGhlIGZhbGxiYWNrIHdpbGwgYmUgdXNlZCwgd2hpY2ggaXMgYSBzdGFuZGFyZCBpbnB1dCBmaWVsZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJmaWxlbWFuYWdlclwiXG4gKiAgICAgZGF0YS1maWxlbWFuYWdlci1uYW1lPVwiY2F0ZWdvcmllc19pY29uXCIgLy8gUmVxdWlyZWRcbiAqICAgICBkYXRhLWZpbGVtYW5hZ2VyLXR5cGU9XCJpbWFnZXNcIiAvLyBPcHRpb25hbFxuICogICAgIGRhdGEtZmlsZW1hbmFnZXItY29udGVudC1kaXJlY3Rvcnk9XCJpbWFnZXMvY2F0ZWdvcmllcy9pY29uc1wiIC8vIFJlcXVpcmVkXG4gKiAgICAgZGF0YS1maWxlbWFuYWdlci1wcmV2aW91cy1maWxlPVwiZmlsZW5hbWUuZXh0ZW5zaW9uXCIgLy8gT3B0aW9uYWxcbiAqICAgICBkYXRhLWZpbGVtYW5hZ2VyLXBhZ2U9XCJyZXNwb25zaXZlX2ZpbGVtYW5hZ2VyXCIgLy8gT3B0aW9uYWxcbiAqICAgICBkYXRhLWZpbGVtYW5hZ2VyLXBhZ2UtYWN0aXZlPVwidHJ1ZVwiPiAvLyBSZXF1aXJlZFxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvZmlsZW1hbmFnZXJcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2ZpbGVtYW5hZ2VyJyxcblxuICAgIFsneGhyJywgJ21vZGFsJ10sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpXaWRnZXRzL2ZpbGVtYW5hZ2VyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IFdpZGdldCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZCBvZiB0aGUgZmlsZSBtYW5hZ2VyIGlucHV0IGZpZWxkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGZpZWxkSWQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFqYXggcmVxdWVzdCB1cmwgZmV0Y2ggdGhlIGZpbGUgbWFuYWdlcnMgY29uZmlndXJhdGlvbiBzZXR0aW5ncy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGZpbGVNYW5hZ2VyQ29uZmlndXJhdGlvblVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpXG4gICAgICAgICAgICArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVJlc3BvbnNpdmVGaWxlTWFuYWdlck1vZHVsZUNlbnRlck1vZHVsZS9HZXRDb25maWd1cmF0aW9uJztcblxuICAgICAgICAvKipcbiAgICAgICAgICogIENhY2hlIGtleS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gJ3Jlc3BvbnNpdmVGaWxlTWFuYWdlcic7XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGSUxFIE1BTkFHRVIgQ09ORklHVVJBVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBhbGxvd2VkIGZpbGUgdHlwZSBhcyBhbiBpbnRlZ2VyLCB3aGljaCBpcyBtYXBwZWRcbiAgICAgICAgICogZm9yIHRoZSBleHRlcm5hbCBSZXNwb25zaXZlIEZpbGVtYW5hZ2VyIHBsdWdpbi4gSXQgd2lsbCBiZSB1c2VkXG4gICAgICAgICAqIGFzIGEgR0VUIHBhcmFtZXRlciBpbiB0aGUgVVJMIGZvciB0aGUgZmlsZSBtYW5hZ2VyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBGbGFnIGludGVnZXIgdmFsdWUgYmV0d2VlbiAwIGFuZCAzLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2dldEZNVHlwZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaW1hZ2VzJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWxsJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICAgICAgY2FzZSAndmlkZW9zJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDM7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbGUgbWFuYWdlcnMgcmVxdWVzdCB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJlcXVlc3QgdXJsIG9mIGZpbGUgbWFuYWdlci5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9nZXRGTVVybCA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIExhbmd1YWdlIHBhcmFtZXRlciB1c2VkIGZvciB0aGUgZmlsZSBtYW5hZ2VyXG4gICAgICAgICAgICBjb25zdCBsYW5nID0ganNlLmNvcmUucmVnaXN0cnkuZ2V0KCdsYW5ndWFnZUlkJykgPT09IDIgPyAnZGUnIDogJ2VuX0VOJztcblxuICAgICAgICAgICAgLy8gRG9uJ3QgdXNlIHRoZSBwb3B1cCBtb2RlIGlmIHRoZSBmaWxlIG1hbmFnZXIgd2lsbCBiZSBvcGVuZWQgaW4gYSBtb2RhbC5cbiAgICAgICAgICAgIGNvbnN0IHBvcFVwID0gX2lzQ29tcGF0aWJpbGl0eU1vZGVFbmFibGVkKCkgPyAxIDogJyc7XG5cbiAgICAgICAgICAgIHJldHVybiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvJ1xuICAgICAgICAgICAgICAgICsgJ1Jlc3BvbnNpdmVGaWxlbWFuYWdlci9maWxlbWFuYWdlci9maWxlbWFuYWdlci5waHA/dHlwZT0nICsgX2dldEZNVHlwZSgpXG4gICAgICAgICAgICAgICAgKyBfZ2V0U3ViRGlyZWN0b3J5UXVlcnlTdHJpbmcoKSArICcmZmllbGRfaWQ9JyArIGZpZWxkSWRcbiAgICAgICAgICAgICAgICArICcmcG9wdXA9JyArIHBvcFVwICsgJyZyZWxhdGl2ZV91cmw9MSZsYW5nPScgKyBsYW5nXG4gICAgICAgICAgICAgICAgKyBfZ2V0UGFnZVF1ZXJ5U3RyaW5nKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlICdzdWJfZm9sZGVyJyBxdWVyeSBhcmd1bWVudCBmb3IgdGhlIGZpbGUgbWFuYWdlciByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBRdWVyeSBwYXJhbWV0ZXIgZm9yIGZpbGUgbWFuYWdlciByZXF1ZXN0IHRvIHNldCB0aGUgcm9vdCBkaXJlY3RvcnkuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZ2V0U3ViRGlyZWN0b3J5UXVlcnlTdHJpbmcgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb250ZW50RGlyZWN0b3J5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyZzdWJfZm9sZGVyPScgKyBvcHRpb25zLmNvbnRlbnREaXJlY3Rvcnk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgJ3BhZ2UnIHF1ZXJ5IHN0cmluZyBmb3IgdGhlIGZpbGUgbWFuYWdlciByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBRdWVyeSBwYXJhbWV0ZXIgZm9yIHRoZSBmaWxlIG1hbmFnZXIgcmVxdWVzdCB0byBsb2FkIGEgY3VzdG9tIGNvbmZpZ3VyYXRpb24gZmlsZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9nZXRQYWdlUXVlcnlTdHJpbmcgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJyZwYWdlPScgKyBvcHRpb25zLnBhZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGVzIGEgZ2xvYmFsIHVuaXF1ZSBpZGVudGlmaWVyIGZvciBlYWNoIGlucHV0IHRoYXQgaXMgZ2VuZXJhdGVkIGJ5IHRoaXMgd2lkZ2V0LlxuICAgICAgICAgKiBUaGlzIElEIHdpbGwgYmUgdXNlZCBpbiBvcmRlciB0byBpZGVudGlmeSBhbiBpbnB1dCBmaWVsZHMuIFdpdGggdGhlIGhlbHAgb2YgdGhpcyBJRCxcbiAgICAgICAgICogdGhlIHdpZGdldCBrbm93cywgaW4gd2hpY2ggaW5wdXQgZmllbGQgdGhlIGZpbGUgbmFtZSBvZiB0aGUgY2hvc2UgZmlsZSBzaG91bGQgYmUgZW50ZXJlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gR2xvYmFsIHVuaXF1ZSBpZGVudGlmaWVyIGFzIHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGd1aWRHZW5lcmF0b3IgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzNCA9ICgpID0+ICgoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApIHwgMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcblxuICAgICAgICAgICAgcmV0dXJuIChzNCgpICsgczQoKSArIFwiLVwiICsgczQoKSArIFwiLVwiICsgczQoKSArIFwiLVwiICsgczQoKSArIFwiLVwiICsgczQoKSArIHM0KCkgKyBzNCgpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gQ1JFQVRJTkcgVEhFIEZJTEUgTUFOQUdFUlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZhY3RvcnksIHdoaWNoIGNyZWF0ZXMgZWl0aGVyIHRoZSByZXNwb25zaXZlIGZpbGUgbWFuYWdlciBvciB0aGUgZmFsbGJhY2ssXG4gICAgICAgICAqIHdoaWNoIGlzIGEgc3RhbmRhcmQgaW5wdXQgZmllbGQgb2YgdGhlIHR5cGUgJ2ZpbGUnLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7e3Jlc3BvbnNpdmU6IChmdW5jdGlvbigpKSwgZmFsbGJhY2s6IChmdW5jdGlvbigpKX19XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBmYWN0b3J5ID0ge1xuICAgICAgICAgICAgcmVzcG9uc2l2ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICR1cGxvYWRJY29uID0gJCgnPGkvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2ZhIGZhLXVwbG9hZCcsXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLWhpZGRlbic6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0ICRyZW1vdmVJY29uID0gJCgnPGkvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2ZhIGZhLXJlbW92ZScsXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLWhpZGRlbic6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoJzxpbnB1dC8+Jywge1xuICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBvcHRpb25zLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdpZCc6IGZpZWxkSWQsXG4gICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdmb3JtLWNvbnRyb2wnLFxuICAgICAgICAgICAgICAgICAgICAncmVhZG9ubHknOiAncmVhZG9ubHknXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBdXRvIGZpbGwgdGhlIGlucHV0IGZpZWxkIHdpdGggdGhlIHByZXZpb3VzIGZpbGUgbmFtZVxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnByZXZpb3VzRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXQudmFsKG9wdGlvbnMucHJldmlvdXNGaWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkdXBsb2FkQnV0dG9uID0gJCgnPGEvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biByZXNwb25zaXZlLWZpbGUtbWFuYWdlcicsXG4gICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICdodG1sJzogJHVwbG9hZEljb24sXG4gICAgICAgICAgICAgICAgICAgICdvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6ICgpID0+IF9vcGVuRmlsZU1hbmFnZXIoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkcmVtb3ZlQnV0dG9uID0gJCgnPGEvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biByZXNwb25zaXZlLWZpbGUtbWFuYWdlcicsXG4gICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgICdodG1sJzogJHJlbW92ZUljb24sXG4gICAgICAgICAgICAgICAgICAgICdvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6ICgpID0+ICRpbnB1dC52YWwoJycpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0ICRzcGFuID0gJCgnPHNwYW4vPicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2lucHV0LWdyb3VwLWJ0bidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNvbnN0ICRjb250YWluZXIgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdpbnB1dC1ncm91cCByZXNwb25zaXZlLWZpbGUtbWFuYWdlcidcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRzcGFuLmFwcGVuZCgkdXBsb2FkQnV0dG9uKTtcbiAgICAgICAgICAgICAgICAkc3Bhbi5hcHBlbmQoJHJlbW92ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkaW5wdXQpLmFwcGVuZCgkc3Bhbik7XG4gICAgICAgICAgICAgICAgJHRoaXMuYXBwZW5kKCRjb250YWluZXIpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZmFsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkKCc8aW5wdXQvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBvcHRpb25zLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ2ZpbGUnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5hcHBlbmQoJGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIHRoZSB3aWRnZXQgYWZ0ZXIgdGhlIHJlcXVlc3QgdGhlIHJlc3BvbnNpdmUgZmlsZSBtYW5hZ2VyXG4gICAgICAgICAqIHJlcXVlc3QgaXMgYmVpbmcgbWFkZS4gQWZ0ZXIgdGhlIHJlcXVlc3QsIGVpdGhlciB0aGUgJ3Jlc3BvbnNpdmUnXG4gICAgICAgICAqIHdpZGdldCBpcyBjcmVhdGVkIG9yIHRoZSBmYWxsYmFjaywgZGVwZW5kaW5nIG9uIGlmIHRoZSBmaWxlIG1hbmFnZXJcbiAgICAgICAgICogaXMgYXZhaWxhYmxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZG9uZSBEb25lIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBtb2R1bGUuaW5pdC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9jcmVhdGVXaWRnZXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIGpzZS5saWJzLnhoci5nZXQoe3VybDogZmlsZU1hbmFnZXJDb25maWd1cmF0aW9uVXJsfSlcbiAgICAgICAgICAgICAgICAuZG9uZShyZXNwb25zZSA9PiBqc2UuY29yZS5yZWdpc3RyeS5zZXQoY2FjaGVLZXksIHJlc3BvbnNlLmlzSW5zdGFsbGVkID8gJ3Jlc3BvbnNpdmUnIDogJ2ZhbGxiYWNrJykpXG4gICAgICAgICAgICAgICAgLmZhaWwoKCkgPT4ganNlLmNvcmUucmVnaXN0cnkuc2V0KGNhY2hlS2V5LCAnZmFsbGJhY2snKSlcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBmaWxlIG1hbmFnZXIgb3IgZmFsbGJhY2suXG4gICAgICAgICAgICAgICAgICAgIGZhY3RvcnlbanNlLmNvcmUucmVnaXN0cnkuZ2V0KGNhY2hlS2V5KV0oKTtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIHRoZSB3aWRnZXQgd2hlbiB0aGUgY2FjaGUga2V5IGNoYW5nZXMgZnJvbSBwZW5kaW5nLlxuICAgICAgICAgKiBBZnRlciB0aGUgY2FjaGUga2V5IGNoYW5nZWQgdG8gZWl0aGVyIHRoZSAncmVzcG9uc2l2ZScgb3IgJ2ZhbGxiYWNrJyxcbiAgICAgICAgICogdGhlIGFjY29yZGluZyB3aWRnZXQgd2lsbCBiZSBjcmVhdGVkLCBkZXBlbmRpbmcgb24gaWYgdGhlIGZpbGUgbWFuYWdlclxuICAgICAgICAgKiBpcyBhdmFpbGFibGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBkb25lIERvbmUgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIG1vZHVsZS5pbml0LlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2NyZWF0ZVdpZGdldFdoZW5DYWNoZUtleUF2YWlsYWJsZSA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGpzZS5jb3JlLnJlZ2lzdHJ5LmdldChjYWNoZUtleSkgIT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGZpbGUgbWFuYWdlciBvciBmYWxsYmFjay5cbiAgICAgICAgICAgICAgICAgICAgZmFjdG9yeVtqc2UuY29yZS5yZWdpc3RyeS5nZXQoY2FjaGVLZXkpXSgpO1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gT1BFTklORyBUSEUgRklMRSBNQU5BR0VSXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbnMgdGhlIGZpbGUgbWFuYWdlciBpbiBhIG5ldyB3aW5kb3cgcG9wdXAuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfb3BlbkZNUG9wdXAgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3ID0gOTkwO1xuICAgICAgICAgICAgY29uc3QgaCA9IDYwMDtcbiAgICAgICAgICAgIGNvbnN0IGwgPSBNYXRoLmZsb29yKChzY3JlZW4ud2lkdGggLSB3KSAvIDIpO1xuICAgICAgICAgICAgY29uc3QgdCA9IE1hdGguZmxvb3IoKHNjcmVlbi5oZWlnaHQgLSBoKSAvIDIpO1xuXG4gICAgICAgICAgICB3aW5kb3cub3BlbihfZ2V0Rk1VcmwoKSwgJ1Jlc3BvbnNpdmVGaWxlbWFuYWdlcicsIFwic2Nyb2xsYmFycz0xLHdpZHRoPVwiICsgdyArIFwiLGhlaWdodD1cIiArIGhcbiAgICAgICAgICAgICAgICArIFwiLHRvcD1cIlxuICAgICAgICAgICAgICAgICsgdCArIFwiLGxlZnQ9XCIgKyBsKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbnMgdGhlIGZpbGUgbWFuYWdlciBpbiBhIGJvb3RzdHJhcCBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9vcGVuRk1Nb2RhbCA9ICgpID0+IHtcblxuICAgICAgICAgICAgLy8gVXNlIHRoZSBmYWxsYmFjayBpZiBib290c3RyYXBzIG1vZGFsIGZ1bmN0aW9uIGlzIG5vdCBhdmFpbGFibGUuXG4gICAgICAgICAgICBpZiAoJC5mbi5tb2RhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9vcGVuRk1Qb3B1cCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBpRnJhbWUgPSBgPGlmcmFtZSBzcmM9XCIke19nZXRGTVVybCgpfVwiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjU1MFwiIGZyYW1lYm9yZGVyPVwiMFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjbGFzcz1cInJlc3BvbnNpdmUtZmlsZW1hbmFnZXJcIj48L2lmcmFtZT5gO1xuXG4gICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZSgnRmlsZW1hbmFnZXInLCBpRnJhbWUpO1xuICAgICAgICAgICAgX21ha2VNb2RhbExhcmdlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1ha2VzIHRoZSBtb2RhbCBsYXJnZSBieSBhZGRpbmcgdGhlIG1vZGFsLWxnIGNzcyBjbGFzcy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9tYWtlTW9kYWxMYXJnZSA9ICgpID0+IHtcbiAgICAgICAgICAgICQoJy5tb2RhbC1kaWFsb2c6bGFzdCcpLmFkZENsYXNzKCdtb2RhbC1sZycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgY29tcGF0aWJpbGl0eSBtb2RlIGlzIGFjdGl2ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgb24gY29tcGF0aWJpbGl0eSBtb2RlLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaXNDb21wYXRpYmlsaXR5TW9kZUVuYWJsZWQgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gJCgnYm9keS5neC1jb21wYXRpYmlsaXR5JykubGVuZ3RoICE9PSAwO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVucyB0aGUgZmlsZSBtYW5hZ2VyIGluIGEgbW9kYWwsIGRpYWxvZyBvciB3aW5kb3cgd2l0aCB0aGUgcHJpb3JpdHkgaW5cbiAgICAgICAgICogdGhlIHNhbWUgb3JkZXIuIElmIGJvb3RzdHJhcCBpcyBub3QgYXZhaWxhYmxlLCB0aGUgZmlsZVxuICAgICAgICAgKiBtYW5hZ2VyIHdpbGwgYmUgb3BlbmVkIGluIGEgbmV3IHdpbmRvdy5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9vcGVuRmlsZU1hbmFnZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoX2lzQ29tcGF0aWJpbGl0eU1vZGVFbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX29wZW5GTVBvcHVwKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9vcGVuRk1Nb2RhbCgpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICBmaWVsZElkID0gZ3VpZEdlbmVyYXRvcigpO1xuXG4gICAgICAgICAgICAvLyBSZXF1aXJlZCBvcHRpb24gbm90IHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb250ZW50RGlyZWN0b3J5ID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5jb250ZW50RGlyZWN0b3J5ID09PSAnJykge1xuICAgICAgICAgICAgICAgIGpzZS5jb3JlLmRlYnVnLmVycm9yKCdjb250ZW50LWRpcmVjdG9yeSBhdHRyaWJ1dGUgd2FzIG5vdCBwcm92aWRlZCBmb3IgdGhlIFwiZmlsZW1hbmFnZXJcIiB3aWRnZXQuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXF1aXJlZCBvcHRpb24gbm90IHByb3ZpZGVkXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5uYW1lID09PSB1bmRlZmluZWQgfHwgb3B0aW9ucy5uYW1lID09PSAnJykge1xuICAgICAgICAgICAgICAgIGpzZS5jb3JlLmRlYnVnLmVycm9yKCduYW1lIGF0dHJpYnV0ZSB3YXMgbm90IHByb3ZpZGVkIGZvciB0aGUgXCJmaWxlbWFuYWdlclwiIHdpZGdldC4nKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlcXVpcmVkIG9wdGlvbiBub3QgcHJvdmlkZWRcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBhZ2VBY3RpdmUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGpzZS5jb3JlLmRlYnVnLmVycm9yKCdwYWdlLWFjdGl2ZSBhdHRyaWJ1dGUgd2FzIG5vdCBwcm92aWRlZCBmb3IgdGhlIFwiZmlsZW1hbmFnZXJcIiB3aWRnZXQuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNb2R1bGUgaXMgbm90IGFjdGl2ZSBhdCBhbGwgb3Igbm90IGFjdGl2ZSBmb3IgdGhlIHVzZWQgcGFnZS5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5wYWdlQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgZmFjdG9yeS5mYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIGNhY2hlIGtleSBhdmFpbGFibGUgeWV0LiBDcmVhdGUgdGhlIHdpZGdldCBhbmQgc2V0IHRoZSBjYWNoZSBrZXkgdG8gJ2ZhbGxiYWNrJyBvciAncmVzcG9uc2l2ZSdcbiAgICAgICAgICAgIC8vIGFmdGVyIHRoZSByZXNwb25zaXZlIGhhcyBhcnJpdmVkIChkb25lIGJ5IHRoZSBfY3JlYXRlV2lkZ2V0IGZ1bmN0aW9uKS5cbiAgICAgICAgICAgIGlmIChqc2UuY29yZS5yZWdpc3RyeS5nZXQoY2FjaGVLZXkpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBqc2UuY29yZS5yZWdpc3RyeS5zZXQoY2FjaGVLZXksICdwZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgX2NyZWF0ZVdpZGdldChkb25lKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENhY2hlIGtleSBpcyBvbiAncGVuZGluZycgd2hpY2ggbWVhbnMgd2UgaGF2ZSB0byB3YWl0IHVudGlsIHRoZSBrZXkgY2hhbmdlcyAoZG9uZSBieSB0aGUgX2NyZWF0ZVdpZGdldCBmdW5jdGlvbikuXG4gICAgICAgICAgICAvLyBBZnRlcndhcmRzIHdlIGNhbiBjcmVhdGUgdGhlIGNvcnJlY3Qgd2lkZ2V0LlxuICAgICAgICAgICAgaWYgKGpzZS5jb3JlLnJlZ2lzdHJ5LmdldChjYWNoZUtleSkgPT09ICdwZW5kaW5nJykge1xuICAgICAgICAgICAgICAgIF9jcmVhdGVXaWRnZXRXaGVuQ2FjaGVLZXlBdmFpbGFibGUoZG9uZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBCdWlsZCB0aGUgZmFsbGJhY2sgb3IgcmVzcG9uc2l2ZSBmaWxlIG1hbmFnZXIuXG4gICAgICAgICAgICBmYWN0b3J5W2pzZS5jb3JlLnJlZ2lzdHJ5LmdldChjYWNoZUtleSldKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
