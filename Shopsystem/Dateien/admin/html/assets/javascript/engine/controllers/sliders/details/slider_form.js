'use strict';

/* --------------------------------------------------------------
 slider_form.js 2016-12-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Controller Module For Slider Edit Form
 *
 * Handles the sliders details form operations.
 */
gx.controllers.module('slider_form', ['xhr', 'modal', 'loading_spinner'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Master data panel selector.
     *
     * @type {jQuery}
     */
    var $masterDataPanel = $this.find('.panel.master-data');

    /**
     * Slide panel containers (each language holds a container, that contains the slide panels).
     *
     * @type {jQuery}
     */
    var $tabContents = $this.find('.tab-pane');

    /**
     * Deleter select box.
     *
     * @type {jQuery}
     */
    var $imageDeleteSelect = $this.find('#delete_images');

    /**
     * Spinner Selector
     *
     * @type {jQuery}
     */
    var $spinner = null;

    /**
     * Do a refresh instead of redirecting?
     *
     * @type {Boolean}
     */
    var doRefresh = false;

    /**
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Handles the form submit event.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {Object} data Event data.
     */
    function _onFormSubmit(event, data) {
        // Prevent the submit of the form.
        event.preventDefault();

        // Check refresh parameter.
        var refresh = data && data.refresh;
        _submit(refresh);
    }

    function _submit(refresh) {
        // Check refresh parameter.
        if (refresh) {
            doRefresh = true;
        }

        // Show loading spinner.
        $spinner = jse.libs.loading_spinner.show($this);

        // Upload files.
        _uploadFiles().then(_deleteFiles, _showFailMessage).then(_performSubmit, _showFailMessage).then(function () {
            return jse.libs.loading_spinner.hide($spinner);
        });
    }

    /**
     * Shows the submit error message modal.
     */
    function _showFailMessage() {
        // Message texts.
        var errorTitle = jse.core.lang.translate('FORM_SUBMIT_ERROR_MODAL_TITLE', 'sliders');
        var errorMessage = jse.core.lang.translate('FORM_SUBMIT_ERROR_MODAL_TEXT', 'sliders');

        // Show modal.
        jse.libs.modal.showMessage(errorTitle, errorMessage);

        // Hide loading spinner.
        if ($spinner) {
            jse.libs.loading_spinner.hide($spinner);
        }
    }

    /**
     * Performs the form submit AJAX request.
     */
    function _performSubmit() {
        // AJAX request options.
        var requestOptions = {
            url: $this.attr('action'),
            data: _getFormData()
        };

        jse.libs.xhr.post(requestOptions).done(function (response) {
            // URL to redirect to.
            var url = doRefresh ? 'admin.php?do=SlidersDetails&id=' + response.id : options.redirectUrl;

            // Prevent that the page unload prompt is displayed on save action.
            window.onbeforeunload = null;

            // Open overview page.
            window.open(url, '_self');
        }).fail(_showFailMessage);
    }

    /**
     * Returns the gathered form data.
     *
     * @return {Object} Form data.
     */
    function _getFormData() {
        // Form data object.
        var data = {
            id: $this.data('id')
        };

        // Extend form data object with all necessary properties.
        return $.extend(true, data, _getMasterData(), _getSlidesData());
    }

    /**
     * Returns the slider's master data.
     *
     * @return {Object} Slider master data.
     */
    function _getMasterData() {
        var name = $masterDataPanel.find('input[name="name"]').val();

        var speed = $masterDataPanel.find('input[name="speed"]').val();

        return { name: name, speed: speed };
    }

    /**
     * Returns the slides data by iterating over the tab content elements
     * which represent a container for each language.
     *
     * The returned object contains a property for each language.
     * The key is the language code and the value is an array containing
     * all slides information as collection.
     *
     * Example output:
     * {
     *   de: [{
     *     id: 1,
     *     thumbnail: 'My picture',
     *     ...
     *   }]
     * }
     *
     * @return {Object} Slides data.
     */
    function _getSlidesData() {
        // Slides data object.
        var slides = {};

        // Iterate over each slider panel container.
        $tabContents.each(function (index, element) {
            // Slide panel container element.
            var $slidePanelContainer = $(element);

            // Slide panel elements.
            var $slidePanels = $slidePanelContainer.find('.panel');

            // Get slide panel container language code.
            var languageCode = $slidePanelContainer.data('language');

            // Add property to slides data object,
            // which contains the language code as key and the slides data as value.
            slides[languageCode] = $.map($slidePanels, function (element) {
                return _getSlideData(element);
            });
        });

        return { slides: slides };
    }

    /**
     * Returns the data for a slide.
     *
     * @param {HTMLElement} slidePanel Slide panel element.
     *
     * @return {Object} Slide data.
     */
    function _getSlideData(slidePanel) {
        var $element = $(slidePanel);

        return {
            id: $element.data('id'),
            title: $element.find('input[name="title"]').val(),
            alt_text: $element.find('input[name="alt_text"]').val(),
            thumbnail: $element.find('select[name="thumbnail"]').val(),
            link: $element.find('input[name="link"]').val(),
            link_target: $element.find('select[name="link_target"]').val(),
            images: _getSlideImagesData(slidePanel)
        };
    }

    /**
     * Returns the slide images data.
     *
     * @param {HTMLElement} slidePanel Slide panel element.
     *
     * @return {Object} Slide images data.
     */
    function _getSlideImagesData(slidePanel) {
        // Image dropdown container elements (without thumbnail).
        var $imageDropdownContainers = $(slidePanel).find('.row.form-group').filter(function (index, element) {
            var $dropdown = $(element).find('.dropdown-input');

            return $dropdown.length && !$dropdown.is('[name="thumbnail"]');
        });

        // Iterate over each dropdown element and retrieve the data.
        return $.map($imageDropdownContainers, function (element) {
            // Dropdown container element.
            var $element = $(element);

            // Dropdown element.
            var $dropdown = $element.find('.dropdown-input');

            // Image data object.
            return {
                id: $element.data('id'),
                breakpoint: $dropdown.attr('name').replace('breakpoint_', ''),
                image: $dropdown.val(),
                areas: _getSlideImageAreaData(element)
            };
        });
    }

    /**
     * Returns the slide image area data.
     *
     * @param {HTMLElement} slideImageContainer Slide image configuration row element.
     *
     * @return {Object} Slide image area data.
     */
    function _getSlideImageAreaData(slideImageContainer) {
        // Slide image area data container list items.
        var $listItems = $(slideImageContainer).find('.image-map-data-list').children();

        // Iterate over each dropdown list item element and retrieve the data.
        return $.map($listItems, function (element) {
            // List item element.
            var $element = $(element);

            return {
                id: $element.data('id'),
                linkTitle: $element.data('linkTitle'),
                linkUrl: $element.data('linkUrl'),
                linkTarget: $element.data('linkTarget'),
                coordinates: $element.data('coordinates')
            };
        });
    }

    /**
     * Performs the images upload AJAX request.
     *
     * @return {jQuery.jqXHR} jQuery deferred object.
     */
    function _uploadFiles() {
        // Form data object.
        var formData = new FormData();

        // File inputs.
        var $fileInputs = $this.find(':file');

        // Append files to form data object.
        $fileInputs.each(function (index, element) {
            // File.
            var file = element.files[0];

            // Data entry key.
            var key = element.id + '[]';

            // Append file to form data object.
            if (file) {
                formData.append(key, file);
            }
        });

        // AJAX request options.
        var requestOptions = {
            url: options.imagesUploadUrl,
            data: formData,
            processData: false,
            contentType: false
        };

        // Perform AJAX request.
        return jse.libs.xhr.post(requestOptions);
    }

    /**
     * Performs the image deletion AJAX request.
     */
    function _deleteFiles() {
        // List of image file names.
        var fileNames = [];

        // List of thumbnail images.
        var thumbnailNames = [];

        // Fill the file names list.
        $imageDeleteSelect.children().each(function (index, element) {
            element.className === 'thumbnail' ? thumbnailNames.push(element.value) : fileNames.push(element.value);
        });

        // AJAX request options.
        var requestOptions = {
            url: options.imagesDeleteUrl,
            data: { file_names: fileNames, thumbnail_names: thumbnailNames }
        };

        return jse.libs.xhr.post(requestOptions);
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to form submit event.
        $this.on('submit', _onFormSubmit);
        var $bottomSaveBar = $('.bottom-save-bar-content');

        var $saveBtn = $bottomSaveBar.find('.btn.save');
        var $refreshBtn = $bottomSaveBar.find('.refresh a');

        $saveBtn.on('click', function () {
            return _submit(false);
        });
        $refreshBtn.on('click', function () {
            return _submit(true);
        });

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcnMvZGV0YWlscy9zbGlkZXJfZm9ybS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRtYXN0ZXJEYXRhUGFuZWwiLCJmaW5kIiwiJHRhYkNvbnRlbnRzIiwiJGltYWdlRGVsZXRlU2VsZWN0IiwiJHNwaW5uZXIiLCJkb1JlZnJlc2giLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfb25Gb3JtU3VibWl0IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInJlZnJlc2giLCJfc3VibWl0IiwianNlIiwibGlicyIsImxvYWRpbmdfc3Bpbm5lciIsInNob3ciLCJfdXBsb2FkRmlsZXMiLCJ0aGVuIiwiX2RlbGV0ZUZpbGVzIiwiX3Nob3dGYWlsTWVzc2FnZSIsIl9wZXJmb3JtU3VibWl0IiwiaGlkZSIsImVycm9yVGl0bGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImVycm9yTWVzc2FnZSIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJyZXF1ZXN0T3B0aW9ucyIsInVybCIsImF0dHIiLCJfZ2V0Rm9ybURhdGEiLCJ4aHIiLCJwb3N0IiwiZG9uZSIsInJlc3BvbnNlIiwiaWQiLCJyZWRpcmVjdFVybCIsIndpbmRvdyIsIm9uYmVmb3JldW5sb2FkIiwib3BlbiIsImZhaWwiLCJfZ2V0TWFzdGVyRGF0YSIsIl9nZXRTbGlkZXNEYXRhIiwibmFtZSIsInZhbCIsInNwZWVkIiwic2xpZGVzIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsIiRzbGlkZVBhbmVsQ29udGFpbmVyIiwiJHNsaWRlUGFuZWxzIiwibGFuZ3VhZ2VDb2RlIiwibWFwIiwiX2dldFNsaWRlRGF0YSIsInNsaWRlUGFuZWwiLCIkZWxlbWVudCIsInRpdGxlIiwiYWx0X3RleHQiLCJ0aHVtYm5haWwiLCJsaW5rIiwibGlua190YXJnZXQiLCJpbWFnZXMiLCJfZ2V0U2xpZGVJbWFnZXNEYXRhIiwiJGltYWdlRHJvcGRvd25Db250YWluZXJzIiwiZmlsdGVyIiwiJGRyb3Bkb3duIiwibGVuZ3RoIiwiaXMiLCJicmVha3BvaW50IiwicmVwbGFjZSIsImltYWdlIiwiYXJlYXMiLCJfZ2V0U2xpZGVJbWFnZUFyZWFEYXRhIiwic2xpZGVJbWFnZUNvbnRhaW5lciIsIiRsaXN0SXRlbXMiLCJjaGlsZHJlbiIsImxpbmtUaXRsZSIsImxpbmtVcmwiLCJsaW5rVGFyZ2V0IiwiY29vcmRpbmF0ZXMiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiJGZpbGVJbnB1dHMiLCJmaWxlIiwiZmlsZXMiLCJrZXkiLCJhcHBlbmQiLCJpbWFnZXNVcGxvYWRVcmwiLCJwcm9jZXNzRGF0YSIsImNvbnRlbnRUeXBlIiwiZmlsZU5hbWVzIiwidGh1bWJuYWlsTmFtZXMiLCJjbGFzc05hbWUiLCJwdXNoIiwidmFsdWUiLCJpbWFnZXNEZWxldGVVcmwiLCJmaWxlX25hbWVzIiwidGh1bWJuYWlsX25hbWVzIiwiaW5pdCIsIm9uIiwiJGJvdHRvbVNhdmVCYXIiLCIkc2F2ZUJ0biIsIiRyZWZyZXNoQnRuIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGFBREosRUFHSSxDQUNJLEtBREosRUFFSSxPQUZKLEVBR0ksaUJBSEosQ0FISixFQVNJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxtQkFBbUJGLE1BQU1HLElBQU4sQ0FBVyxvQkFBWCxDQUF6Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxlQUFlSixNQUFNRyxJQUFOLENBQVcsV0FBWCxDQUFyQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRSxxQkFBcUJMLE1BQU1HLElBQU4sQ0FBVyxnQkFBWCxDQUEzQjs7QUFFQTs7Ozs7QUFLQSxRQUFJRyxXQUFXLElBQWY7O0FBRUE7Ozs7O0FBS0Es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LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzbGlkZXJfZm9ybS5qcyAyMDE2LTEyLTEyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBDb250cm9sbGVyIE1vZHVsZSBGb3IgU2xpZGVyIEVkaXQgRm9ybVxuICpcbiAqIEhhbmRsZXMgdGhlIHNsaWRlcnMgZGV0YWlscyBmb3JtIG9wZXJhdGlvbnMuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc2xpZGVyX2Zvcm0nLFxuXG4gICAgW1xuICAgICAgICAneGhyJyxcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgJ2xvYWRpbmdfc3Bpbm5lcidcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXN0ZXIgZGF0YSBwYW5lbCBzZWxlY3Rvci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtYXN0ZXJEYXRhUGFuZWwgPSAkdGhpcy5maW5kKCcucGFuZWwubWFzdGVyLWRhdGEnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2xpZGUgcGFuZWwgY29udGFpbmVycyAoZWFjaCBsYW5ndWFnZSBob2xkcyBhIGNvbnRhaW5lciwgdGhhdCBjb250YWlucyB0aGUgc2xpZGUgcGFuZWxzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0YWJDb250ZW50cyA9ICR0aGlzLmZpbmQoJy50YWItcGFuZScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGVyIHNlbGVjdCBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkaW1hZ2VEZWxldGVTZWxlY3QgPSAkdGhpcy5maW5kKCcjZGVsZXRlX2ltYWdlcycpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGlubmVyIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgJHNwaW5uZXIgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEbyBhIHJlZnJlc2ggaW5zdGVhZCBvZiByZWRpcmVjdGluZz9cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgZG9SZWZyZXNoID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGZvcm0gc3VibWl0IGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBFdmVudCBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRm9ybVN1Ym1pdChldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgLy8gUHJldmVudCB0aGUgc3VibWl0IG9mIHRoZSBmb3JtLlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgcmVmcmVzaCBwYXJhbWV0ZXIuXG4gICAgICAgICAgICBjb25zdCByZWZyZXNoID0gZGF0YSAmJiBkYXRhLnJlZnJlc2g7XG4gICAgICAgICAgICBfc3VibWl0KHJlZnJlc2gpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBfc3VibWl0IChyZWZyZXNoKSB7XG4gICAgICAgICAgICAvLyBDaGVjayByZWZyZXNoIHBhcmFtZXRlci5cbiAgICAgICAgICAgIGlmIChyZWZyZXNoKSB7XG4gICAgICAgICAgICAgICAgZG9SZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIC8vIFNob3cgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcyk7XG4gICAgXG4gICAgICAgICAgICAvLyBVcGxvYWQgZmlsZXMuXG4gICAgICAgICAgICBfdXBsb2FkRmlsZXMoKVxuICAgICAgICAgICAgICAgIC50aGVuKF9kZWxldGVGaWxlcywgX3Nob3dGYWlsTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAudGhlbihfcGVyZm9ybVN1Ym1pdCwgX3Nob3dGYWlsTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIHRoZSBzdWJtaXQgZXJyb3IgbWVzc2FnZSBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RmFpbE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAvLyBNZXNzYWdlIHRleHRzLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JUaXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdGT1JNX1NVQk1JVF9FUlJPUl9NT0RBTF9USVRMRScsICdzbGlkZXJzJyk7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRk9STV9TVUJNSVRfRVJST1JfTU9EQUxfVEVYVCcsICdzbGlkZXJzJyk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgbW9kYWwuXG4gICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShlcnJvclRpdGxlLCBlcnJvck1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgIGlmICgkc3Bpbm5lcikge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKCRzcGlubmVyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBlcmZvcm1zIHRoZSBmb3JtIHN1Ym1pdCBBSkFYIHJlcXVlc3QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcGVyZm9ybVN1Ym1pdCgpIHtcbiAgICAgICAgICAgIC8vIEFKQVggcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiAkdGhpcy5hdHRyKCdhY3Rpb24nKSxcbiAgICAgICAgICAgICAgICBkYXRhOiBfZ2V0Rm9ybURhdGEoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAganNlLmxpYnMueGhyLnBvc3QocmVxdWVzdE9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBVUkwgdG8gcmVkaXJlY3QgdG8uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGRvUmVmcmVzaCA/IGBhZG1pbi5waHA/ZG89U2xpZGVyc0RldGFpbHMmaWQ9JHtyZXNwb25zZS5pZH1gIDogb3B0aW9ucy5yZWRpcmVjdFVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHRoYXQgdGhlIHBhZ2UgdW5sb2FkIHByb21wdCBpcyBkaXNwbGF5ZWQgb24gc2F2ZSBhY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlbiBvdmVydmlldyBwYWdlLlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoX3Nob3dGYWlsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBnYXRoZXJlZCBmb3JtIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gRm9ybSBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldEZvcm1EYXRhKCkge1xuICAgICAgICAgICAgLy8gRm9ybSBkYXRhIG9iamVjdC5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgaWQ6ICR0aGlzLmRhdGEoJ2lkJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEV4dGVuZCBmb3JtIGRhdGEgb2JqZWN0IHdpdGggYWxsIG5lY2Vzc2FyeSBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHRydWUsIGRhdGEsIF9nZXRNYXN0ZXJEYXRhKCksIF9nZXRTbGlkZXNEYXRhKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIHNsaWRlcidzIG1hc3RlciBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFNsaWRlciBtYXN0ZXIgZGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRNYXN0ZXJEYXRhKCkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICRtYXN0ZXJEYXRhUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1cIm5hbWVcIl0nKVxuICAgICAgICAgICAgICAgIC52YWwoKTtcblxuICAgICAgICAgICAgY29uc3Qgc3BlZWQgPSAkbWFzdGVyRGF0YVBhbmVsXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9XCJzcGVlZFwiXScpXG4gICAgICAgICAgICAgICAgLnZhbCgpO1xuXG4gICAgICAgICAgICByZXR1cm4ge25hbWUsIHNwZWVkfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzbGlkZXMgZGF0YSBieSBpdGVyYXRpbmcgb3ZlciB0aGUgdGFiIGNvbnRlbnQgZWxlbWVudHNcbiAgICAgICAgICogd2hpY2ggcmVwcmVzZW50IGEgY29udGFpbmVyIGZvciBlYWNoIGxhbmd1YWdlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgcmV0dXJuZWQgb2JqZWN0IGNvbnRhaW5zIGEgcHJvcGVydHkgZm9yIGVhY2ggbGFuZ3VhZ2UuXG4gICAgICAgICAqIFRoZSBrZXkgaXMgdGhlIGxhbmd1YWdlIGNvZGUgYW5kIHRoZSB2YWx1ZSBpcyBhbiBhcnJheSBjb250YWluaW5nXG4gICAgICAgICAqIGFsbCBzbGlkZXMgaW5mb3JtYXRpb24gYXMgY29sbGVjdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogRXhhbXBsZSBvdXRwdXQ6XG4gICAgICAgICAqIHtcbiAgICAgICAgICogICBkZTogW3tcbiAgICAgICAgICogICAgIGlkOiAxLFxuICAgICAgICAgKiAgICAgdGh1bWJuYWlsOiAnTXkgcGljdHVyZScsXG4gICAgICAgICAqICAgICAuLi5cbiAgICAgICAgICogICB9XVxuICAgICAgICAgKiB9XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gU2xpZGVzIGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0U2xpZGVzRGF0YSgpIHtcbiAgICAgICAgICAgIC8vIFNsaWRlcyBkYXRhIG9iamVjdC5cbiAgICAgICAgICAgIGNvbnN0IHNsaWRlcyA9IHt9O1xuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBzbGlkZXIgcGFuZWwgY29udGFpbmVyLlxuICAgICAgICAgICAgJHRhYkNvbnRlbnRzLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2xpZGUgcGFuZWwgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgY29uc3QgJHNsaWRlUGFuZWxDb250YWluZXIgPSAkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2xpZGUgcGFuZWwgZWxlbWVudHMuXG4gICAgICAgICAgICAgICAgY29uc3QgJHNsaWRlUGFuZWxzID0gJHNsaWRlUGFuZWxDb250YWluZXIuZmluZCgnLnBhbmVsJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgc2xpZGUgcGFuZWwgY29udGFpbmVyIGxhbmd1YWdlIGNvZGUuXG4gICAgICAgICAgICAgICAgY29uc3QgbGFuZ3VhZ2VDb2RlID0gJHNsaWRlUGFuZWxDb250YWluZXIuZGF0YSgnbGFuZ3VhZ2UnKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBwcm9wZXJ0eSB0byBzbGlkZXMgZGF0YSBvYmplY3QsXG4gICAgICAgICAgICAgICAgLy8gd2hpY2ggY29udGFpbnMgdGhlIGxhbmd1YWdlIGNvZGUgYXMga2V5IGFuZCB0aGUgc2xpZGVzIGRhdGEgYXMgdmFsdWUuXG4gICAgICAgICAgICAgICAgc2xpZGVzW2xhbmd1YWdlQ29kZV0gPSAkLm1hcCgkc2xpZGVQYW5lbHMsIGVsZW1lbnQgPT4gX2dldFNsaWRlRGF0YShlbGVtZW50KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtzbGlkZXN9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGRhdGEgZm9yIGEgc2xpZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNsaWRlUGFuZWwgU2xpZGUgcGFuZWwgZWxlbWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBTbGlkZSBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldFNsaWRlRGF0YShzbGlkZVBhbmVsKSB7XG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9ICQoc2xpZGVQYW5lbCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWQ6ICRlbGVtZW50LmRhdGEoJ2lkJyksXG4gICAgICAgICAgICAgICAgdGl0bGU6ICRlbGVtZW50LmZpbmQoJ2lucHV0W25hbWU9XCJ0aXRsZVwiXScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIGFsdF90ZXh0OiAkZWxlbWVudC5maW5kKCdpbnB1dFtuYW1lPVwiYWx0X3RleHRcIl0nKS52YWwoKSxcbiAgICAgICAgICAgICAgICB0aHVtYm5haWw6ICRlbGVtZW50LmZpbmQoJ3NlbGVjdFtuYW1lPVwidGh1bWJuYWlsXCJdJykudmFsKCksXG4gICAgICAgICAgICAgICAgbGluazogJGVsZW1lbnQuZmluZCgnaW5wdXRbbmFtZT1cImxpbmtcIl0nKS52YWwoKSxcbiAgICAgICAgICAgICAgICBsaW5rX3RhcmdldDogJGVsZW1lbnQuZmluZCgnc2VsZWN0W25hbWU9XCJsaW5rX3RhcmdldFwiXScpLnZhbCgpLFxuICAgICAgICAgICAgICAgIGltYWdlczogX2dldFNsaWRlSW1hZ2VzRGF0YShzbGlkZVBhbmVsKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzbGlkZSBpbWFnZXMgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2xpZGVQYW5lbCBTbGlkZSBwYW5lbCBlbGVtZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFNsaWRlIGltYWdlcyBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldFNsaWRlSW1hZ2VzRGF0YShzbGlkZVBhbmVsKSB7XG4gICAgICAgICAgICAvLyBJbWFnZSBkcm9wZG93biBjb250YWluZXIgZWxlbWVudHMgKHdpdGhvdXQgdGh1bWJuYWlsKS5cbiAgICAgICAgICAgIGNvbnN0ICRpbWFnZURyb3Bkb3duQ29udGFpbmVycyA9ICQoc2xpZGVQYW5lbClcbiAgICAgICAgICAgICAgICAuZmluZCgnLnJvdy5mb3JtLWdyb3VwJylcbiAgICAgICAgICAgICAgICAuZmlsdGVyKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkZHJvcGRvd24gPSAkKGVsZW1lbnQpLmZpbmQoJy5kcm9wZG93bi1pbnB1dCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkZHJvcGRvd24ubGVuZ3RoICYmICEkZHJvcGRvd24uaXMoJ1tuYW1lPVwidGh1bWJuYWlsXCJdJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIGRyb3Bkb3duIGVsZW1lbnQgYW5kIHJldHJpZXZlIHRoZSBkYXRhLlxuICAgICAgICAgICAgcmV0dXJuICQubWFwKCRpbWFnZURyb3Bkb3duQ29udGFpbmVycywgZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gRHJvcGRvd24gY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gRHJvcGRvd24gZWxlbWVudC5cbiAgICAgICAgICAgICAgICBjb25zdCAkZHJvcGRvd24gPSAkZWxlbWVudC5maW5kKCcuZHJvcGRvd24taW5wdXQnKTtcblxuICAgICAgICAgICAgICAgIC8vIEltYWdlIGRhdGEgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAkZWxlbWVudC5kYXRhKCdpZCcpLFxuICAgICAgICAgICAgICAgICAgICBicmVha3BvaW50OiAkZHJvcGRvd24uYXR0cignbmFtZScpLnJlcGxhY2UoJ2JyZWFrcG9pbnRfJywgJycpLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogJGRyb3Bkb3duLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICBhcmVhczogX2dldFNsaWRlSW1hZ2VBcmVhRGF0YShlbGVtZW50KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzbGlkZSBpbWFnZSBhcmVhIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNsaWRlSW1hZ2VDb250YWluZXIgU2xpZGUgaW1hZ2UgY29uZmlndXJhdGlvbiByb3cgZWxlbWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBTbGlkZSBpbWFnZSBhcmVhIGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0U2xpZGVJbWFnZUFyZWFEYXRhKHNsaWRlSW1hZ2VDb250YWluZXIpIHtcbiAgICAgICAgICAgIC8vIFNsaWRlIGltYWdlIGFyZWEgZGF0YSBjb250YWluZXIgbGlzdCBpdGVtcy5cbiAgICAgICAgICAgIGNvbnN0ICRsaXN0SXRlbXMgPSAkKHNsaWRlSW1hZ2VDb250YWluZXIpXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5pbWFnZS1tYXAtZGF0YS1saXN0JylcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKTtcblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggZHJvcGRvd24gbGlzdCBpdGVtIGVsZW1lbnQgYW5kIHJldHJpZXZlIHRoZSBkYXRhLlxuICAgICAgICAgICAgcmV0dXJuICQubWFwKCRsaXN0SXRlbXMsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIExpc3QgaXRlbSBlbGVtZW50LlxuICAgICAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAkZWxlbWVudC5kYXRhKCdpZCcpLFxuICAgICAgICAgICAgICAgICAgICBsaW5rVGl0bGU6ICRlbGVtZW50LmRhdGEoJ2xpbmtUaXRsZScpLFxuICAgICAgICAgICAgICAgICAgICBsaW5rVXJsOiAkZWxlbWVudC5kYXRhKCdsaW5rVXJsJyksXG4gICAgICAgICAgICAgICAgICAgIGxpbmtUYXJnZXQ6ICRlbGVtZW50LmRhdGEoJ2xpbmtUYXJnZXQnKSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6ICRlbGVtZW50LmRhdGEoJ2Nvb3JkaW5hdGVzJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQZXJmb3JtcyB0aGUgaW1hZ2VzIHVwbG9hZCBBSkFYIHJlcXVlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2pRdWVyeS5qcVhIUn0galF1ZXJ5IGRlZmVycmVkIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF91cGxvYWRGaWxlcygpIHtcbiAgICAgICAgICAgIC8vIEZvcm0gZGF0YSBvYmplY3QuXG4gICAgICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICAgICAgICAvLyBGaWxlIGlucHV0cy5cbiAgICAgICAgICAgIGNvbnN0ICRmaWxlSW5wdXRzID0gJHRoaXMuZmluZCgnOmZpbGUnKTtcblxuICAgICAgICAgICAgLy8gQXBwZW5kIGZpbGVzIHRvIGZvcm0gZGF0YSBvYmplY3QuXG4gICAgICAgICAgICAkZmlsZUlucHV0cy5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIEZpbGUuXG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IGVsZW1lbnQuZmlsZXNbMF07XG5cbiAgICAgICAgICAgICAgICAvLyBEYXRhIGVudHJ5IGtleS5cbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtZW50LmlkICsgJ1tdJztcblxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCBmaWxlIHRvIGZvcm0gZGF0YSBvYmplY3QuXG4gICAgICAgICAgICAgICAgaWYgKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGtleSwgZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFKQVggcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiBvcHRpb25zLmltYWdlc1VwbG9hZFVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBQZXJmb3JtIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICAgIHJldHVybiBqc2UubGlicy54aHIucG9zdChyZXF1ZXN0T3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUGVyZm9ybXMgdGhlIGltYWdlIGRlbGV0aW9uIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9kZWxldGVGaWxlcygpIHtcbiAgICAgICAgICAgIC8vIExpc3Qgb2YgaW1hZ2UgZmlsZSBuYW1lcy5cbiAgICAgICAgICAgIGxldCBmaWxlTmFtZXMgPSBbXTtcblxuICAgICAgICAgICAgLy8gTGlzdCBvZiB0aHVtYm5haWwgaW1hZ2VzLlxuICAgICAgICAgICAgbGV0IHRodW1ibmFpbE5hbWVzID0gW107XG5cbiAgICAgICAgICAgIC8vIEZpbGwgdGhlIGZpbGUgbmFtZXMgbGlzdC5cbiAgICAgICAgICAgICRpbWFnZURlbGV0ZVNlbGVjdFxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID09PSAndGh1bWJuYWlsJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHVtYm5haWxOYW1lcy5wdXNoKGVsZW1lbnQudmFsdWUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lcy5wdXNoKGVsZW1lbnQudmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBSkFYIHJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogb3B0aW9ucy5pbWFnZXNEZWxldGVVcmwsXG4gICAgICAgICAgICAgICAgZGF0YToge2ZpbGVfbmFtZXM6IGZpbGVOYW1lcywgdGh1bWJuYWlsX25hbWVzOiB0aHVtYm5haWxOYW1lc31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBqc2UubGlicy54aHIucG9zdChyZXF1ZXN0T3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBMaXN0ZW4gdG8gZm9ybSBzdWJtaXQgZXZlbnQuXG4gICAgICAgICAgICAkdGhpcy5vbignc3VibWl0JywgX29uRm9ybVN1Ym1pdCk7XG4gICAgICAgICAgICBjb25zdCAkYm90dG9tU2F2ZUJhciA9ICQoJy5ib3R0b20tc2F2ZS1iYXItY29udGVudCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCAkc2F2ZUJ0biA9ICRib3R0b21TYXZlQmFyLmZpbmQoJy5idG4uc2F2ZScpO1xuICAgICAgICAgICAgY29uc3QgJHJlZnJlc2hCdG4gPSAkYm90dG9tU2F2ZUJhci5maW5kKCcucmVmcmVzaCBhJyk7XG5cbiAgICAgICAgICAgICRzYXZlQnRuLm9uKCdjbGljaycsICgpID0+IF9zdWJtaXQoZmFsc2UpKTtcbiAgICAgICAgICAgICRyZWZyZXNoQnRuLm9uKCdjbGljaycsICgpID0+IF9zdWJtaXQodHJ1ZSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBGaW5pc2ggaW5pdGlhbGl6YXRpb24uXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pXG47Il19
