'use strict';

/* --------------------------------------------------------------
 slides_container.js 2016-12-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Controller Module For Slides Container (Tabs)
 *
 * Handles the sliders container functionality in the sliders details page.
 */
gx.controllers.module('slides_container', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js', 'xhr', 'modal'], function (data) {

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
    var $footer = $('.gx-admin-footer');

    /**
     * Elements
     *
     * @type {Object}
     */
    var elements = {
        // Buttons.
        buttons: {
            // Sort mode button.
            sort: $this.find('.sort-button'),

            // Create button.
            create: $this.find('.btn-create'),

            // Submit button group.
            submit: $footer.find('.submit-button-group'),

            // Submit button for save slider
            submitSave: $footer.find('.save'),

            // Submit button for save and refresh slider
            submitRefresh: $footer.find('.refresh')
        },

        // Template.
        templates: {
            // Slide panel set template.
            slidePanel: $this.find('#slide-panel-template')
        },

        // Modals.
        modals: {
            // Delete image modal.
            deleteImage: $('.delete-image.modal'),

            // Delete slide modal.
            deleteSlide: $('.delete-slide.modal'),

            // Edit image map modal.
            imageMap: $('.image-map.modal')
        },

        // Tabs.
        tabHeader: $this.find('.nav-tabs'),

        // Select box which holds all images that will be deleted.
        deleteImageSelect: $('#delete_images')
    };

    /**
     * CSS class names.
     *
     * @type {Object}
     */
    var classes = {
        // New image.
        newImage: 'new'
    };

    /**
     * Selector Strings
     *
     * @type {Object}
     */
    var selectors = {
        // Icon selector strings.
        icons: {
            // Delete button on the panel header.
            delete: '.icon.delete',

            // Drag button on the panel header.
            drag: '.drag-handle',

            // Collapser button on the panel header.
            collapser: '.collapser',

            // Image delete button.
            imageDelete: '.action-icon.delete',

            // Image map edit button.
            imageMap: '.action-icon.image-map',

            // Upload image button.
            upload: '.action-icon.upload'
        },

        // Inputs selector strings.
        inputs: {
            // General image select dropdowns.
            dropdown: '.dropdown-input',

            // Thumbnail dropdown.
            thumbnailImageDropdown: '[name="thumbnail"]',

            // Title.
            title: 'input[name="title"]',

            // File.
            file: '.file-input'
        },

        // Slide panel.
        slidePanel: '.panel',

        // Tab body.
        tabBody: '.tab-pane',

        // Slide panel title.
        slidePanelTitle: '.slide-title',

        // Setting row (form group).
        configurationRow: '.row.form-group',

        // Data list container for image map.
        imageMapDataList: '.image-map-data-list'
    };

    /**
     * Cache list of open slide panels.
     *
     * @type {jQuery[]}
     */
    var openSlidePanels = [];

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
     * Registers a change, so that the user gets a confirmation dialog while leaving the page.
     */
    function _registerChange() {
        // Object of GET parameters.
        var getParameters = $.deparam(window.location.search.slice(1));

        // Only register in slider edit mode.
        if ('id' in getParameters) {
            window.onbeforeunload = function () {
                return jse.core.lang.translate('EXIT_CONFIRMATION_TEXT', 'sliders');
            };
        }
    }

    /**
     * Handles the image dropdown change event.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {Boolean} [removeAllDataListItems = false] Remove all data list container list items?
     */
    function _onImageChange(event) {
        var removeAllDataListItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        // Image dropdown element.
        var $dropdown = $(event.target);

        // Remove icon element.
        var $removeIcon = $dropdown.parents(selectors.configurationRow).find(selectors.icons.imageDelete);

        // Image map icon element.
        var $imageMapIcon = $dropdown.parents(selectors.configurationRow).find(selectors.icons.imageMap);

        // Image map data container list element.
        var $list = $dropdown.parents(selectors.configurationRow).find(selectors.imageMapDataList);

        // Remove the remove icon if 'do not use' is selected.
        $removeIcon[$dropdown.val() ? 'show' : 'hide']();

        // Remove the image map icon if 'do not use' is selected.
        $imageMapIcon[$dropdown.val() ? 'show' : 'hide']();

        // Empty image map data container list.
        $list.children().filter(removeAllDataListItems ? '*' : '.new').remove();
    }

    /**
     * Triggers the file select (click) event of the invisible file input field.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onUploadIconClick(event) {
        $(event.target).parents(selectors.configurationRow).find(selectors.inputs.file).trigger('click');
    }

    /**
     * Handles the file select (change) event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onImageAdd(event) {
        // Exit method, if selection has been aborted.
        if (!event.target.files.length) {
            return;
        }

        // File input element.
        var $fileInput = $(event.target);

        // Image dropdown.
        var $dropdown = $fileInput.parents(selectors.configurationRow).find(selectors.inputs.dropdown);

        // Regular expression to validate the file name.
        var regex = /(.)(jpg|jpeg|png|gif|bmp)$/i;

        // File name.
        var fileName = event.target.files[0].name;

        // Is the dropdown for thumbnail images?
        var isThumbnailImage = !!$fileInput.parents(selectors.configurationRow).find(selectors.inputs.thumbnailImageDropdown).length;

        // Exit method and show modal, if file type does not match.
        if (!regex.test(fileName)) {
            // Show modal.
            jse.libs.modal.showMessage(jse.core.lang.translate('INVALID_FILE_MODAL_TITLE', 'sliders'), jse.core.lang.translate('INVALID_FILE_MODAL_TEXT', 'sliders'));

            // Reset value.
            $fileInput.val('');

            return;
        }

        // Exit method and show modal, if filename is already present in dropdown.
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = $dropdown[0].children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var $option = _step.value;

                // Check if option's text content matches with the name of the selected file.
                if ($option.textContent === fileName) {
                    // Show modal.
                    jse.libs.modal.showMessage(jse.core.lang.translate('FILENAME_ALREADY_USED_MODAL_TITLE', 'sliders'), jse.core.lang.translate('FILENAME_ALREADY_USED_MODAL_TEXT', 'sliders'));

                    // Reset value.
                    $fileInput.val('');

                    return;
                }
            }

            // Add files to dropdowns.
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        _addImageToDropdowns(fileName, isThumbnailImage);

        // Select value.
        $dropdown.val(fileName).trigger('change');
    }

    /**
     * Handles the image delete button click event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onImageDelete(event) {
        // Loading CSS class name.
        var loadingClass = 'loading';

        // Image dropdown container.
        var $configurationRow = $(event.target).parents(selectors.configurationRow);

        // Image dropdown.
        var $dropdown = $configurationRow.find(selectors.inputs.dropdown);

        // Slide ID.
        var slideId = $configurationRow.parents(selectors.slidePanel).data('id');

        // Slide image ID.
        var slideImageId = $configurationRow.data('id');

        // Is the dropdown for thumbnail images?
        var isThumbnailImage = !!$dropdown.is(selectors.inputs.thumbnailImageDropdown);

        // Selected file name.
        var fileName = $dropdown.val();

        // Add loading state.
        $dropdown.addClass(loadingClass);

        // Image usage check request options.
        var requestOptions = {
            url: 'admin.php?do=SlidersDetailsAjax/CheckImageUsage',
            data: {
                filename: fileName,
                is_thumbnail: isThumbnailImage,
                slide_id: slideId,
                slide_image_id: slideImageId
            }
        };

        // Perform deletion.
        var performDeletion = function performDeletion() {
            // Put image name into deleter select box.
            elements.deleteImageSelect.append($('<option>', {
                val: fileName,
                class: isThumbnailImage ? 'thumbnail' : ''
            }));

            // Delete image from dropdowns.
            _deleteImageFromDropdowns(fileName, isThumbnailImage);
        };

        // Check image usage.
        jse.libs.xhr.get(requestOptions).then(function (response) {
            // Remove loading state.
            $dropdown.removeClass(loadingClass);

            if (response.isUsed) {
                // Modal confirmation button element.
                var $confirmButton = elements.modals.deleteImage.find('button.confirm');

                // Show modal.
                elements.modals.deleteImage.modal('show');

                // Listen to confirmation button click event.
                $confirmButton.off('click').on('click', performDeletion);
            } else {
                performDeletion();
            }
        });
    }

    /**
     * Handles the image map edit button click event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onImageMap(event) {
        // Slide image ID.
        var slideImageId = $(event.target).parents(selectors.configurationRow).data('id');

        // List element which acts like a data container.
        var $list = $(event.target).parents(selectors.configurationRow).find(selectors.imageMapDataList);

        // Image dropdown.
        var $dropdown = $(event.target).parents(selectors.configurationRow).find(selectors.inputs.dropdown);

        // Slide image file name.
        var imageFilename = $dropdown.val();

        // Is a new image selected?
        var isNewImageSelected = $dropdown.find('option:selected').hasClass(classes.newImage);

        // Path to image URL.
        var imageUrl = jse.core.config.get('appUrl') + '/images/slider_images/' + imageFilename;

        // Show save first notice modal and return immediately, if the slide image has no ID.
        if (!slideImageId || isNewImageSelected) {
            jse.libs.modal.showMessage(jse.core.lang.translate('IMAGE_MAP_MODAL_TITLE', 'sliders'), jse.core.lang.translate('SAVE_SLIDER_FIRST_NOTICE_TEXT', 'sliders'));

            return;
        }

        // Show image map modal.
        elements.modals.imageMap.trigger('show', [$list, imageUrl]);
    }

    /**
     * Handles the sort button click event.
     */
    function _onSortButtonClick() {
        // Indicator CSS classes.
        var indicatorClass = 'mode-on btn-primary';

        // Selector string for the slide panel body.
        var slidePanelBodySelector = '.panel-body';

        // Slides container tabs, except the active one.
        var $otherTabs = elements.tabHeader.children().not('.active');

        // Is the sort mode on?
        var isModeOn = elements.buttons.sort.hasClass(indicatorClass);

        // Language-specific button texts.
        var enterText = elements.buttons.sort.data('textEnter');
        var exitText = elements.buttons.sort.data('textExit');

        // All slide panels.
        var $slides = $this.find(selectors.slidePanel);

        // Apply fade effect onto slide panels.
        $slides.hide().fadeIn();

        // Switch text and toggle indicator class.
        elements.buttons.sort[isModeOn ? 'removeClass' : 'addClass'](indicatorClass).text(isModeOn ? enterText : exitText);

        // Toggle create button.
        elements.buttons.create.prop('disabled', !isModeOn);

        // Toggle drag handle buttons.
        $slides.find(selectors.icons.drag)[isModeOn ? 'hide' : 'show']();

        // Toggle other tabs.
        $otherTabs[isModeOn ? 'fadeIn' : 'fadeOut']();

        // Toggle collapser and hide buttons.
        $slides.find(selectors.icons.collapser).add(selectors.icons.delete)[isModeOn ? 'show' : 'hide']();

        // Save open slide panels.
        if (!isModeOn) {
            openSlidePanels = $slides.filter(function (index, element) {
                return $(element).find(slidePanelBodySelector).is(':visible');
            });
        }

        // Toggle saved open slide panels.
        openSlidePanels.each(function (index, element) {
            return $(element).find(selectors.icons.collapser).trigger('click');
        });
    }

    /**
     * Handles the sort start event.
     */
    function _onSortStart() {
        // Tab content element for selected language.
        var $tabBody = $this.find(selectors.tabBody).filter(':visible');

        // Refresh tab sizes and positions.
        $tabBody.sortable('refreshPositions');
    }

    /**
     * Handles the sort stop event.
     */
    function _onSortStop() {
        // Register change, to make prompt on page unload.
        _registerChange();
    }

    /**
     * Handles the delete icon click event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onDeleteIconClick(event) {
        // Slide panel element.
        var $slidePanel = $(event.target).parents(selectors.slidePanel);

        // Modal confirmation button element.
        var $confirmButton = elements.modals.deleteSlide.find('button.confirm');

        // Show modal.
        elements.modals.deleteSlide.modal('show');

        // Listen to confirmation button click event.
        $confirmButton.off('click').on('click', function () {
            return _onDeleteConfirmationButtonClick(elements.modals.deleteSlide, $slidePanel);
        });
    }

    /**
     * Handles the create button click event.
     */
    function _onCreateButtonClick() {
        // Make a clone of the slide panel template and create a new element.
        var $slidePanel = $(elements.templates.slidePanel.clone().html());

        // Tab content element for selected language.
        var $tabBody = $this.find(selectors.tabBody).filter(':visible');

        // Slide panels.
        var $slidePanels = $tabBody.find(selectors.slidePanel);

        // Next panel index.
        var panelIndex = $slidePanels.length + 1;

        // Title for new slide panel.
        var newTitle = jse.core.lang.translate('NEW_SLIDE', 'sliders') + ' ' + panelIndex;

        // Add title to slide panel header.
        $slidePanel.find(selectors.slidePanelTitle).text(newTitle);

        // Add title to input field.
        $slidePanel.find(selectors.inputs.title).val(newTitle);

        // Add values to dropdowns.
        if ($slidePanels.length) {
            // Get all image dropdowns of the first panel.
            var $dropdowns = $slidePanels.first().find(selectors.inputs.dropdown);

            // Get the thumbnail dropdown options.
            var $thumbnailOptions = $dropdowns.filter(selectors.inputs.thumbnailImageDropdown).children().clone();

            // Get the image dropdown options.
            var $imageOptions = $dropdowns.not(selectors.inputs.thumbnailImageDropdown).first().children().clone();

            // Replace thumbnail options in new slide panel.
            $slidePanel.find(selectors.inputs.thumbnailImageDropdown).empty().append($thumbnailOptions).val('');

            // Replace image options in new slide panel.
            $slidePanel.find(selectors.inputs.dropdown).not(selectors.inputs.thumbnailImageDropdown).empty().append($imageOptions).val('');
        }

        // Add new slide panel element to tab body with fade effect.
        $slidePanel.hide().prependTo($tabBody).fadeIn();

        // Initialize widgets and extensions on the new slide panel element.
        gx.widgets.init($slidePanel);
        gx.extensions.init($slidePanel);

        // Trigger change to show the right action icons.
        $slidePanel.find('select').trigger('change');

        // Register change, to make prompt on page unload.
        _registerChange();

        // Toggle submit buttons.
        toggleSubmitButtons();
    }

    /**
     * Handles the confirmation button click event in the delete confirmation modal.
     *
     * @param {jQuery} $modal Delete confirmation modal element.
     * @param {jQuery} $slidePanel Slide panel element.
     */
    function _onDeleteConfirmationButtonClick($modal, $slidePanel) {
        // Hide modal.
        $modal.modal('hide');

        // Fade out slide panel element and then remove it.
        $slidePanel.fadeOut(400, function () {
            // Remove slide panel.
            $slidePanel.remove();

            // Toggle submit buttons.
            toggleSubmitButtons();
        });

        // Register change, to make prompt on page unload.
        _registerChange();
    }

    /**
     * Handles the key-up event on the slide title input field.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onTitleKeyup(event) {
        // Title input field.
        var $input = $(event.target);

        // Slide panel title element.
        var $title = $input.parents(selectors.slidePanel).find(selectors.slidePanelTitle);

        // Transfer input value to slide panel title.
        $title.text($input.val());
    }

    /**
     * Handles the mouse-enter event on a configuration row.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onConfigRowMouseEnter(event) {
        // Configuration row element.
        var $row = $(event.target);

        // Image map edit icon.
        var $imageMapIcon = $row.find(selectors.icons.imageMap);

        // Image map data container list element.
        var $list = $row.find(selectors.imageMapDataList);

        // Return immediately, if the image map edit icon does not exist.
        if (!$imageMapIcon.length || !$list.length) {
            return;
        }

        if ($list.children().length) {
            $imageMapIcon.removeClass('fa-external-link').addClass('fa-external-link-square');
        } else {
            $imageMapIcon.removeClass('fa-external-link-square').addClass('fa-external-link');
        }
    }

    /**
     * Handles the click event on the save button.
     */
    function _onSubmitSave() {
        $this.parents('form').trigger('submit');
    }

    /**
     * Handles the click event on the refresh list item in the submit button group.
     */
    function _onSubmitRefresh() {
        $this.parents('form').trigger('submit', { refresh: true });
    }

    /**
     * Adds an image to the image dropdowns.
     *
     * @param {String} fileName Name of the selected file.
     * @param {Boolean} [thumbnailImagesOnly = false] Apply on thumbnail image dropdowns only?
     */
    function _addImageToDropdowns(fileName) {
        var thumbnailImagesOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        // Select specific dropdowns.
        var $dropdowns = $this.find(selectors.inputs.dropdown)[thumbnailImagesOnly ? 'filter' : 'not'](selectors.inputs.thumbnailImageDropdown);

        // Create new image option element.
        var $option = $('<option>', { value: fileName, text: fileName, class: classes.newImage });

        // Append new options to dropdowns.
        $dropdowns.append($option);
    }

    /**
     * Deletes an image from the image dropdowns.
     *
     * @param {String} fileName Name of the selected file.
     * @param {Boolean} [thumbnailImagesOnly = false] Apply on thumbnail image dropdowns only?
     */
    function _deleteImageFromDropdowns(fileName) {
        var thumbnailImagesOnly = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        // Select all dropdowns.
        var $dropdowns = $this.find(selectors.inputs.dropdown)[thumbnailImagesOnly ? 'filter' : 'not'](selectors.inputs.thumbnailImageDropdown);

        // Remove image option from each dropdown.
        $dropdowns.each(function (index, element) {
            // Dropdown element.
            var $dropdown = $(element);

            // Remove option.
            $dropdown.find('[value="' + fileName + '"]').remove();

            // Set to default value if there are no image file options.
            if ($dropdown.children().length <= 1) {
                $dropdown.val('');
            }

            // Trigger change.
            $dropdown.trigger('change');
        });
    }

    /**
     * Disables or enables the submit buttons.
     */
    function toggleSubmitButtons() {
        // Enable the submit buttons?
        var doEnableSubmitButtons = true;

        // Slides.
        var $slides = $this.find(selectors.slidePanel);

        // Disable submit buttons, if there are no slides.
        if (!$slides.length) {
            doEnableSubmitButtons = false;
        }

        // Disable/Enable submit buttons.
        elements.buttons.submit.children().not('ul').prop('disabled', !doEnableSubmitButtons);
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Attach click event handler to sort button.
        elements.buttons.sort.on('click', _onSortButtonClick);

        // Attach event handlers to sort actions, slide panel delete button and inputs fields.
        $this.on('sortstart', _onSortStart).on('sortstop', _onSortStop).on('click', selectors.icons.delete, _onDeleteIconClick).on('keyup', selectors.inputs.title, _onTitleKeyup).on('change', selectors.inputs.file, _onImageAdd).on('click', selectors.icons.upload, _onUploadIconClick).on('click', selectors.icons.imageDelete, _onImageDelete).on('click', selectors.icons.imageMap, _onImageMap).on('change', selectors.inputs.dropdown, _onImageChange).on('mouseenter', selectors.configurationRow, _onConfigRowMouseEnter);

        // Attach event listeners to submit buttons.
        elements.buttons.submitSave.on('click', _onSubmitSave);
        elements.buttons.submitRefresh.on('click', _onSubmitRefresh);

        // Attach click event handler to create button.
        elements.buttons.create.on('click', _onCreateButtonClick);

        // Activate first tab.
        elements.tabHeader.children().first().addClass('active');

        // Activate first tab content.
        $this.find(selectors.tabBody).first().addClass('active in');

        // Trigger dropdown change event to hide the remove icon, if 'do not use' is selected.
        $this.find(selectors.inputs.dropdown).trigger('change', [false]);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcnMvZGV0YWlscy9zbGlkZXNfY29udGFpbmVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGZvb3RlciIsImVsZW1lbnRzIiwiYnV0dG9ucyIsInNvcnQiLCJmaW5kIiwiY3JlYXRlIiwic3VibWl0Iiwic3VibWl0U2F2ZSIsInN1Ym1pdFJlZnJlc2giLCJ0ZW1wbGF0ZXMiLCJzbGlkZVBhbmVsIiwibW9kYWxzIiwiZGVsZXRlSW1hZ2UiLCJkZWxldGVTbGlkZSIsImltYWdlTWFwIiwidGFiSGVhZGVyIiwiZGVsZXRlSW1hZ2VTZWxlY3QiLCJjbGFzc2VzIiwibmV3SW1hZ2UiLCJzZWxlY3RvcnMiLCJpY29ucyIsImRlbGV0ZSIsImRyYWciLCJjb2xsYXBzZXIiLCJpbWFnZURlbGV0ZSIsInVwbG9hZCIsImlucHV0cyIsImRyb3Bkb3duIiwidGh1bWJuYWlsSW1hZ2VEcm9wZG93biIsInRpdGxlIiwiZmlsZSIsInRhYkJvZHkiLCJzbGlkZVBhbmVsVGl0bGUiLCJjb25maWd1cmF0aW9uUm93IiwiaW1hZ2VNYXBEYXRhTGlzdCIsIm9wZW5TbGlkZVBhbmVscyIsIl9yZWdpc3RlckNoYW5nZSIsImdldFBhcmFtZXRlcnMiLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzbGljZSIsIm9uYmVmb3JldW5sb2FkIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJfb25JbWFnZUNoYW5nZSIsImV2ZW50IiwicmVtb3ZlQWxsRGF0YUxpc3RJdGVtcyIsIiRkcm9wZG93biIsInRhcmdldCIsIiRyZW1vdmVJY29uIiwicGFyZW50cyIsIiRpbWFnZU1hcEljb24iLCIkbGlzdCIsInZhbCIsImNoaWxkcmVuIiwiZmlsdGVyIiwicmVtb3ZlIiwiX29uVXBsb2FkSWNvbkNsaWNrIiwidHJpZ2dlciIsIl9vbkltYWdlQWRkIiwiZmlsZXMiLCJsZW5ndGgiLCIkZmlsZUlucHV0IiwicmVnZXgiLCJmaWxlTmFtZSIsIm5hbWUiLCJpc1RodW1ibmFpbEltYWdlIiwidGVzdCIsImxpYnMiLCJtb2RhbCIsInNob3dNZXNzYWdlIiwiJG9wdGlvbiIsInRleHRDb250ZW50IiwiX2FkZEltYWdlVG9Ecm9wZG93bnMiLCJfb25JbWFnZURlbGV0ZSIsImxvYWRpbmdDbGFzcyIsIiRjb25maWd1cmF0aW9uUm93Iiwic2xpZGVJZCIsInNsaWRlSW1hZ2VJZCIsImlzIiwiYWRkQ2xhc3MiLCJyZXF1ZXN0T3B0aW9ucyIsInVybCIsImZpbGVuYW1lIiwiaXNfdGh1bWJuYWlsIiwic2xpZGVfaWQiLCJzbGlkZV9pbWFnZV9pZCIsInBlcmZvcm1EZWxldGlvbiIsImFwcGVuZCIsImNsYXNzIiwiX2RlbGV0ZUltYWdlRnJvbURyb3Bkb3ducyIsInhociIsImdldCIsInRoZW4iLCJyZW1vdmVDbGFzcyIsInJlc3BvbnNlIiwiaXNVc2VkIiwiJGNvbmZpcm1CdXR0b24iLCJvZmYiLCJvbiIsIl9vbkltYWdlTWFwIiwiaW1hZ2VGaWxlbmFtZSIsImlzTmV3SW1hZ2VTZWxlY3RlZCIsImhhc0NsYXNzIiwiaW1hZ2VVcmwiLCJjb25maWciLCJfb25Tb3J0QnV0dG9uQ2xpY2siLCJpbmRpY2F0b3JDbGFzcyIsInNsaWRlUGFuZWxCb2R5U2VsZWN0b3IiLCIkb3RoZXJUYWJzIiwibm90IiwiaXNNb2RlT24iLCJlbnRlclRleHQiLCJleGl0VGV4dCIsIiRzbGlkZXMiLCJoaWRlIiwiZmFkZUluIiwidGV4dCIsInByb3AiLCJhZGQiLCJpbmRleCIsImVsZW1lbnQiLCJlYWNoIiwiX29uU29ydFN0YXJ0IiwiJHRhYkJvZHkiLCJzb3J0YWJsZSIsIl9vblNvcnRTdG9wIiwiX29uRGVsZXRlSWNvbkNsaWNrIiwiJHNsaWRlUGFuZWwiLCJfb25EZWxldGVDb25maXJtYXRpb25CdXR0b25DbGljayIsIl9vbkNyZWF0ZUJ1dHRvbkNsaWNrIiwiY2xvbmUiLCJodG1sIiwiJHNsaWRlUGFuZWxzIiwicGFuZWxJbmRleCIsIm5ld1RpdGxlIiwiJGRyb3Bkb3ducyIsImZpcnN0IiwiJHRodW1ibmFpbE9wdGlvbnMiLCIkaW1hZ2VPcHRpb25zIiwiZW1wdHkiLCJwcmVwZW5kVG8iLCJ3aWRnZXRzIiwiaW5pdCIsImV4dGVuc2lvbnMiLCJ0b2dnbGVTdWJtaXRCdXR0b25zIiwiJG1vZGFsIiwiZmFkZU91dCIsIl9vblRpdGxlS2V5dXAiLCIkaW5wdXQiLCIkdGl0bGUiLCJfb25Db25maWdSb3dNb3VzZUVudGVyIiwiJHJvdyIsIl9vblN1Ym1pdFNhdmUiLCJfb25TdWJtaXRSZWZyZXNoIiwicmVmcmVzaCIsInRodW1ibmFpbEltYWdlc09ubHkiLCJ2YWx1ZSIsImRvRW5hYmxlU3VibWl0QnV0dG9ucyIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksa0JBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLG1EQUVPRCxJQUFJQyxNQUZYLCtDQUdPRCxJQUFJQyxNQUhYLDhDQUlJLEtBSkosRUFLSSxPQUxKLENBSEosRUFXSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7QUFDQSxRQUFNQyxVQUFVRCxFQUFFLGtCQUFGLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1FLFdBQVc7QUFDYjtBQUNBQyxpQkFBUztBQUNMO0FBQ0FDLGtCQUFNTCxNQUFNTSxJQUFOLENBQVcsY0FBWCxDQUZEOztBQUlMO0FBQ0FDLG9CQUFRUCxNQUFNTSxJQUFOLENBQVcsYUFBWCxDQUxIOztBQU9MO0FBQ0FFLG9CQUFRTixRQUFRSSxJQUFSLENBQWEsc0JBQWIsQ0FSSDs7QUFVTDtBQUNBRyx3QkFBWVAsUUFBUUksSUFBUixDQUFhLE9BQWIsQ0FYUDs7QUFhTDtBQUNBSSwyQkFBZVIsUUFBUUksSUFBUixDQUFhLFVBQWI7QUFkVixTQUZJOztBQW1CYjtBQUNBSyxtQkFBVztBQUNQO0FBQ0FDLHdCQUFZWixNQUFNTSxJQUFOLENBQVcsdUJBQVg7QUFGTCxTQXBCRTs7QUF5QmI7QUFDQU8sZ0JBQVE7QUFDSjtBQUNBQyx5QkFBYWIsRUFBRSxxQkFBRixDQUZUOztBQUlKO0FBQ0FjLHlCQUFhZCxFQUFFLHFCQUFGLENBTFQ7O0FBT0o7QUFDQWUsc0JBQVVmLEVBQUUsa0JBQUY7QUFSTixTQTFCSzs7QUFxQ2I7QUFDQWdCLG1CQUFXakIsTUFBTU0sSUFBTixDQUFXLFdBQVgsQ0F0Q0U7O0FBd0NiO0FBQ0FZLDJCQUFtQmpCLEVBQUUsZ0JBQUY7QUF6Q04sS0FBakI7O0FBNENBOzs7OztBQUtBLFFBQU1rQixVQUFVO0FBQ1o7QUFDQUMsa0JBQVU7QUFGRSxLQUFoQjs7QUFLQTs7Ozs7QUFLQSxRQUFNQyxZQUFZO0FBQ2Q7QUFDQUMsZUFBTztBQUNIO0FBQ0FDLG9CQUFRLGNBRkw7O0FBSUg7QUFDQUMsa0JBQU0sY0FMSDs7QUFPSDtBQUNBQyx1QkFBVyxZQVJSOztBQVVIO0FBQ0FDLHlCQUFhLHFCQVhWOztBQWFIO0FBQ0FWLHNCQUFVLHdCQWRQOztBQWdCSDtBQUNBVyxvQkFBUTtBQWpCTCxTQUZPOztBQXNCZDtBQUNBQyxnQkFBUTtBQUNKO0FBQ0FDLHNCQUFVLGlCQUZOOztBQUlKO0FBQ0FDLG9DQUF3QixvQkFMcEI7O0FBT0o7QUFDQUMsbUJBQU8scUJBUkg7O0FBVUo7QUFDQUMsa0JBQU07QUFYRixTQXZCTTs7QUFxQ2Q7QUFDQXBCLG9CQUFZLFFBdENFOztBQXdDZDtBQUNBcUIsaUJBQVMsV0F6Q0s7O0FBMkNkO0FBQ0FDLHlCQUFpQixjQTVDSDs7QUE4Q2Q7QUFDQUMsMEJBQWtCLGlCQS9DSjs7QUFpRGQ7QUFDQUMsMEJBQWtCO0FBbERKLEtBQWxCOztBQXFEQTs7Ozs7QUFLQSxRQUFJQyxrQkFBa0IsRUFBdEI7O0FBRUE7Ozs7O0FBS0EsUUFBTXpDLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBLGFBQVMwQyxlQUFULEdBQTJCO0FBQ3ZCO0FBQ0EsWUFBTUMsZ0JBQWdCdEMsRUFBRXVDLE9BQUYsQ0FBVUMsT0FBT0MsUUFBUCxDQUFnQkMsTUFBaEIsQ0FBdUJDLEtBQXZCLENBQTZCLENBQTdCLENBQVYsQ0FBdEI7O0FBRUE7QUFDQSxZQUFJLFFBQVFMLGFBQVosRUFBMkI7QUFDdkJFLG1CQUFPSSxjQUFQLEdBQXdCO0FBQUEsdUJBQU1oRCxJQUFJaUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0Isd0JBQXhCLEVBQWtELFNBQWxELENBQU47QUFBQSxhQUF4QjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7OztBQU1BLGFBQVNDLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQThEO0FBQUEsWUFBL0JDLHNCQUErQix1RUFBTixJQUFNOztBQUMxRDtBQUNBLFlBQU1DLFlBQVluRCxFQUFFaUQsTUFBTUcsTUFBUixDQUFsQjs7QUFFQTtBQUNBLFlBQU1DLGNBQWNGLFVBQ2ZHLE9BRGUsQ0FDUGxDLFVBQVVjLGdCQURILEVBRWY3QixJQUZlLENBRVZlLFVBQVVDLEtBQVYsQ0FBZ0JJLFdBRk4sQ0FBcEI7O0FBSUE7QUFDQSxZQUFNOEIsZ0JBQWdCSixVQUNqQkcsT0FEaUIsQ0FDVGxDLFVBQVVjLGdCQURELEVBRWpCN0IsSUFGaUIsQ0FFWmUsVUFBVUMsS0FBVixDQUFnQk4sUUFGSixDQUF0Qjs7QUFJQTtBQUNBLFlBQU15QyxRQUFRTCxVQUNURyxPQURTLENBQ0RsQyxVQUFVYyxnQkFEVCxFQUVUN0IsSUFGUyxDQUVKZSxVQUFVZSxnQkFGTixDQUFkOztBQUlBO0FBQ0FrQixvQkFBWUYsVUFBVU0sR0FBVixLQUFrQixNQUFsQixHQUEyQixNQUF2Qzs7QUFFQTtBQUNBRixzQkFBY0osVUFBVU0sR0FBVixLQUFrQixNQUFsQixHQUEyQixNQUF6Qzs7QUFFQTtBQUNBRCxjQUNLRSxRQURMLEdBRUtDLE1BRkwsQ0FFWVQseUJBQXlCLEdBQXpCLEdBQStCLE1BRjNDLEVBR0tVLE1BSEw7QUFJSDs7QUFFRDs7Ozs7QUFLQSxhQUFTQyxrQkFBVCxDQUE0QlosS0FBNUIsRUFBbUM7QUFDL0JqRCxVQUFFaUQsTUFBTUcsTUFBUixFQUNLRSxPQURMLENBQ2FsQyxVQUFVYyxnQkFEdkIsRUFFSzdCLElBRkwsQ0FFVWUsVUFBVU8sTUFBVixDQUFpQkksSUFGM0IsRUFHSytCLE9BSEwsQ0FHYSxPQUhiO0FBSUg7O0FBRUQ7Ozs7O0FBS0EsYUFBU0MsV0FBVCxDQUFxQmQsS0FBckIsRUFBNEI7QUFDeEI7QUFDQSxZQUFJLENBQUNBLE1BQU1HLE1BQU4sQ0FBYVksS0FBYixDQUFtQkMsTUFBeEIsRUFBZ0M7QUFDNUI7QUFDSDs7QUFFRDtBQUNBLFlBQU1DLGFBQWFsRSxFQUFFaUQsTUFBTUcsTUFBUixDQUFuQjs7QUFFQTtBQUNBLFlBQU1ELFlBQVllLFdBQ2JaLE9BRGEsQ0FDTGxDLFVBQVVjLGdCQURMLEVBRWI3QixJQUZhLENBRVJlLFVBQVVPLE1BQVYsQ0FBaUJDLFFBRlQsQ0FBbEI7O0FBSUE7QUFDQSxZQUFNdUMsUUFBUSw2QkFBZDs7QUFFQTtBQUNBLFlBQU1DLFdBQVduQixNQUFNRyxNQUFOLENBQWFZLEtBQWIsQ0FBbUIsQ0FBbkIsRUFBc0JLLElBQXZDOztBQUVBO0FBQ0EsWUFBTUMsbUJBQW1CLENBQUMsQ0FBQ0osV0FDdEJaLE9BRHNCLENBQ2RsQyxVQUFVYyxnQkFESSxFQUV0QjdCLElBRnNCLENBRWpCZSxVQUFVTyxNQUFWLENBQWlCRSxzQkFGQSxFQUd0Qm9DLE1BSEw7O0FBS0E7QUFDQSxZQUFJLENBQUNFLE1BQU1JLElBQU4sQ0FBV0gsUUFBWCxDQUFMLEVBQTJCO0FBQ3ZCO0FBQ0F4RSxnQkFBSTRFLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxXQUFmLENBQ0k5RSxJQUFJaUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsMEJBQXhCLEVBQW9ELFNBQXBELENBREosRUFFSW5ELElBQUlpRCxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3Qix5QkFBeEIsRUFBbUQsU0FBbkQsQ0FGSjs7QUFLQTtBQUNBbUIsdUJBQVdULEdBQVgsQ0FBZSxFQUFmOztBQUVBO0FBQ0g7O0FBRUQ7QUF4Q3dCO0FBQUE7QUFBQTs7QUFBQTtBQXlDeEIsaUNBQXNCTixVQUFVLENBQVYsRUFBYU8sUUFBbkMsOEhBQTZDO0FBQUEsb0JBQWxDaUIsT0FBa0M7O0FBQ3pDO0FBQ0Esb0JBQUlBLFFBQVFDLFdBQVIsS0FBd0JSLFFBQTVCLEVBQXNDO0FBQ2xDO0FBQ0F4RSx3QkFBSTRFLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxXQUFmLENBQ0k5RSxJQUFJaUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsbUNBQXhCLEVBQTZELFNBQTdELENBREosRUFFSW5ELElBQUlpRCxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixrQ0FBeEIsRUFBNEQsU0FBNUQsQ0FGSjs7QUFLQTtBQUNBbUIsK0JBQVdULEdBQVgsQ0FBZSxFQUFmOztBQUVBO0FBQ0g7QUFDSjs7QUFFRDtBQXpEd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUEwRHhCb0IsNkJBQXFCVCxRQUFyQixFQUErQkUsZ0JBQS9COztBQUVBO0FBQ0FuQixrQkFDS00sR0FETCxDQUNTVyxRQURULEVBRUtOLE9BRkwsQ0FFYSxRQUZiO0FBR0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU2dCLGNBQVQsQ0FBd0I3QixLQUF4QixFQUErQjtBQUMzQjtBQUNBLFlBQU04QixlQUFlLFNBQXJCOztBQUVBO0FBQ0EsWUFBTUMsb0JBQW9CaEYsRUFBRWlELE1BQU1HLE1BQVIsRUFBZ0JFLE9BQWhCLENBQXdCbEMsVUFBVWMsZ0JBQWxDLENBQTFCOztBQUVBO0FBQ0EsWUFBTWlCLFlBQVk2QixrQkFBa0IzRSxJQUFsQixDQUF1QmUsVUFBVU8sTUFBVixDQUFpQkMsUUFBeEMsQ0FBbEI7O0FBRUE7QUFDQSxZQUFNcUQsVUFBVUQsa0JBQWtCMUIsT0FBbEIsQ0FBMEJsQyxVQUFVVCxVQUFwQyxFQUFnRGIsSUFBaEQsQ0FBcUQsSUFBckQsQ0FBaEI7O0FBRUE7QUFDQSxZQUFNb0YsZUFBZUYsa0JBQWtCbEYsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBckI7O0FBRUE7QUFDQSxZQUFNd0UsbUJBQW1CLENBQUMsQ0FBQ25CLFVBQVVnQyxFQUFWLENBQWEvRCxVQUFVTyxNQUFWLENBQWlCRSxzQkFBOUIsQ0FBM0I7O0FBRUE7QUFDQSxZQUFNdUMsV0FBV2pCLFVBQVVNLEdBQVYsRUFBakI7O0FBRUE7QUFDQU4sa0JBQVVpQyxRQUFWLENBQW1CTCxZQUFuQjs7QUFFQTtBQUNBLFlBQU1NLGlCQUFpQjtBQUNuQkMsaUJBQUssaURBRGM7QUFFbkJ4RixrQkFBTTtBQUNGeUYsMEJBQVVuQixRQURSO0FBRUZvQiw4QkFBY2xCLGdCQUZaO0FBR0ZtQiwwQkFBVVIsT0FIUjtBQUlGUyxnQ0FBZ0JSO0FBSmQ7QUFGYSxTQUF2Qjs7QUFVQTtBQUNBLFlBQU1TLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBTTtBQUMxQjtBQUNBekYscUJBQVNlLGlCQUFULENBQTJCMkUsTUFBM0IsQ0FBa0M1RixFQUFFLFVBQUYsRUFBYztBQUM1Q3lELHFCQUFLVyxRQUR1QztBQUU1Q3lCLHVCQUFPdkIsbUJBQW1CLFdBQW5CLEdBQWlDO0FBRkksYUFBZCxDQUFsQzs7QUFLQTtBQUNBd0Isc0NBQTBCMUIsUUFBMUIsRUFBb0NFLGdCQUFwQztBQUNILFNBVEQ7O0FBV0E7QUFDQTFFLFlBQUk0RSxJQUFKLENBQVN1QixHQUFULENBQWFDLEdBQWIsQ0FBaUJYLGNBQWpCLEVBQWlDWSxJQUFqQyxDQUFzQyxvQkFBWTtBQUM5QztBQUNBOUMsc0JBQVUrQyxXQUFWLENBQXNCbkIsWUFBdEI7O0FBRUEsZ0JBQUlvQixTQUFTQyxNQUFiLEVBQXFCO0FBQ2pCO0FBQ0Esb0JBQU1DLGlCQUFpQm5HLFNBQVNVLE1BQVQsQ0FBZ0JDLFdBQWhCLENBQTRCUixJQUE1QixDQUFpQyxnQkFBakMsQ0FBdkI7O0FBRUE7QUFDQUgseUJBQVNVLE1BQVQsQ0FBZ0JDLFdBQWhCLENBQTRCNEQsS0FBNUIsQ0FBa0MsTUFBbEM7O0FBRUE7QUFDQTRCLCtCQUNLQyxHQURMLENBQ1MsT0FEVCxFQUVLQyxFQUZMLENBRVEsT0FGUixFQUVpQlosZUFGakI7QUFHSCxhQVhELE1BV087QUFDSEE7QUFDSDtBQUNKLFNBbEJEO0FBbUJIOztBQUVEOzs7OztBQUtBLGFBQVNhLFdBQVQsQ0FBcUJ2RCxLQUFyQixFQUE0QjtBQUN4QjtBQUNBLFlBQU1pQyxlQUFlbEYsRUFBRWlELE1BQU1HLE1BQVIsRUFDaEJFLE9BRGdCLENBQ1JsQyxVQUFVYyxnQkFERixFQUVoQnBDLElBRmdCLENBRVgsSUFGVyxDQUFyQjs7QUFJQTtBQUNBLFlBQU0wRCxRQUFReEQsRUFBRWlELE1BQU1HLE1BQVIsRUFDVEUsT0FEUyxDQUNEbEMsVUFBVWMsZ0JBRFQsRUFFVDdCLElBRlMsQ0FFSmUsVUFBVWUsZ0JBRk4sQ0FBZDs7QUFJQTtBQUNBLFlBQU1nQixZQUFZbkQsRUFBRWlELE1BQU1HLE1BQVIsRUFDYkUsT0FEYSxDQUNMbEMsVUFBVWMsZ0JBREwsRUFFYjdCLElBRmEsQ0FFUmUsVUFBVU8sTUFBVixDQUFpQkMsUUFGVCxDQUFsQjs7QUFJQTtBQUNBLFlBQU02RSxnQkFBZ0J0RCxVQUFVTSxHQUFWLEVBQXRCOztBQUVBO0FBQ0EsWUFBTWlELHFCQUFxQnZELFVBQVU5QyxJQUFWLENBQWUsaUJBQWYsRUFBa0NzRyxRQUFsQyxDQUEyQ3pGLFFBQVFDLFFBQW5ELENBQTNCOztBQUVBO0FBQ0EsWUFBTXlGLFdBQVdoSCxJQUFJaUQsSUFBSixDQUFTZ0UsTUFBVCxDQUFnQmIsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0Msd0JBQWhDLEdBQTJEUyxhQUE1RTs7QUFFQTtBQUNBLFlBQUksQ0FBQ3ZCLFlBQUQsSUFBaUJ3QixrQkFBckIsRUFBeUM7QUFDckM5RyxnQkFBSTRFLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxXQUFmLENBQ0k5RSxJQUFJaUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsdUJBQXhCLEVBQWlELFNBQWpELENBREosRUFFSW5ELElBQUlpRCxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QiwrQkFBeEIsRUFBeUQsU0FBekQsQ0FGSjs7QUFLQTtBQUNIOztBQUVEO0FBQ0E3QyxpQkFBU1UsTUFBVCxDQUFnQkcsUUFBaEIsQ0FBeUIrQyxPQUF6QixDQUFpQyxNQUFqQyxFQUF5QyxDQUFDTixLQUFELEVBQVFvRCxRQUFSLENBQXpDO0FBQ0g7O0FBRUQ7OztBQUdBLGFBQVNFLGtCQUFULEdBQThCO0FBQzFCO0FBQ0EsWUFBTUMsaUJBQWlCLHFCQUF2Qjs7QUFFQTtBQUNBLFlBQU1DLHlCQUF5QixhQUEvQjs7QUFFQTtBQUNBLFlBQU1DLGFBQWEvRyxTQUFTYyxTQUFULENBQ2QwQyxRQURjLEdBRWR3RCxHQUZjLENBRVYsU0FGVSxDQUFuQjs7QUFJQTtBQUNBLFlBQU1DLFdBQVdqSCxTQUFTQyxPQUFULENBQWlCQyxJQUFqQixDQUFzQnVHLFFBQXRCLENBQStCSSxjQUEvQixDQUFqQjs7QUFFQTtBQUNBLFlBQU1LLFlBQVlsSCxTQUFTQyxPQUFULENBQWlCQyxJQUFqQixDQUFzQk4sSUFBdEIsQ0FBMkIsV0FBM0IsQ0FBbEI7QUFDQSxZQUFNdUgsV0FBV25ILFNBQVNDLE9BQVQsQ0FBaUJDLElBQWpCLENBQXNCTixJQUF0QixDQUEyQixVQUEzQixDQUFqQjs7QUFFQTtBQUNBLFlBQU13SCxVQUFVdkgsTUFBTU0sSUFBTixDQUFXZSxVQUFVVCxVQUFyQixDQUFoQjs7QUFFQTtBQUNBMkcsZ0JBQ0tDLElBREwsR0FFS0MsTUFGTDs7QUFJQTtBQUNBdEgsaUJBQVNDLE9BQVQsQ0FBaUJDLElBQWpCLENBQXNCK0csV0FBVyxhQUFYLEdBQTJCLFVBQWpELEVBQTZESixjQUE3RCxFQUNLVSxJQURMLENBQ1VOLFdBQVdDLFNBQVgsR0FBdUJDLFFBRGpDOztBQUdBO0FBQ0FuSCxpQkFBU0MsT0FBVCxDQUFpQkcsTUFBakIsQ0FBd0JvSCxJQUF4QixDQUE2QixVQUE3QixFQUF5QyxDQUFDUCxRQUExQzs7QUFFQTtBQUNBRyxnQkFBUWpILElBQVIsQ0FBYWUsVUFBVUMsS0FBVixDQUFnQkUsSUFBN0IsRUFBbUM0RixXQUFXLE1BQVgsR0FBb0IsTUFBdkQ7O0FBRUE7QUFDQUYsbUJBQVdFLFdBQVcsUUFBWCxHQUFzQixTQUFqQzs7QUFFQTtBQUNBRyxnQkFDS2pILElBREwsQ0FDVWUsVUFBVUMsS0FBVixDQUFnQkcsU0FEMUIsRUFFS21HLEdBRkwsQ0FFU3ZHLFVBQVVDLEtBQVYsQ0FBZ0JDLE1BRnpCLEVBRWlDNkYsV0FBVyxNQUFYLEdBQW9CLE1BRnJEOztBQUlBO0FBQ0EsWUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDWC9FLDhCQUFrQmtGLFFBQVEzRCxNQUFSLENBQWUsVUFBQ2lFLEtBQUQsRUFBUUMsT0FBUjtBQUFBLHVCQUFvQjdILEVBQUU2SCxPQUFGLEVBQ2hEeEgsSUFEZ0QsQ0FDM0MyRyxzQkFEMkMsRUFFaEQ3QixFQUZnRCxDQUU3QyxVQUY2QyxDQUFwQjtBQUFBLGFBQWYsQ0FBbEI7QUFHSDs7QUFFRDtBQUNBL0Msd0JBQWdCMEYsSUFBaEIsQ0FBcUIsVUFBQ0YsS0FBRCxFQUFRQyxPQUFSO0FBQUEsbUJBQW9CN0gsRUFBRTZILE9BQUYsRUFDcEN4SCxJQURvQyxDQUMvQmUsVUFBVUMsS0FBVixDQUFnQkcsU0FEZSxFQUVwQ3NDLE9BRm9DLENBRTVCLE9BRjRCLENBQXBCO0FBQUEsU0FBckI7QUFHSDs7QUFFRDs7O0FBR0EsYUFBU2lFLFlBQVQsR0FBd0I7QUFDcEI7QUFDQSxZQUFNQyxXQUFXakksTUFDWk0sSUFEWSxDQUNQZSxVQUFVWSxPQURILEVBRVoyQixNQUZZLENBRUwsVUFGSyxDQUFqQjs7QUFJQTtBQUNBcUUsaUJBQVNDLFFBQVQsQ0FBa0Isa0JBQWxCO0FBQ0g7O0FBRUQ7OztBQUdBLGFBQVNDLFdBQVQsR0FBdUI7QUFDbkI7QUFDQTdGO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBUzhGLGtCQUFULENBQTRCbEYsS0FBNUIsRUFBbUM7QUFDL0I7QUFDQSxZQUFNbUYsY0FBY3BJLEVBQUVpRCxNQUFNRyxNQUFSLEVBQWdCRSxPQUFoQixDQUF3QmxDLFVBQVVULFVBQWxDLENBQXBCOztBQUVBO0FBQ0EsWUFBTTBGLGlCQUFpQm5HLFNBQVNVLE1BQVQsQ0FBZ0JFLFdBQWhCLENBQTRCVCxJQUE1QixDQUFpQyxnQkFBakMsQ0FBdkI7O0FBRUE7QUFDQUgsaUJBQVNVLE1BQVQsQ0FBZ0JFLFdBQWhCLENBQTRCMkQsS0FBNUIsQ0FBa0MsTUFBbEM7O0FBRUE7QUFDQTRCLHVCQUNLQyxHQURMLENBQ1MsT0FEVCxFQUVLQyxFQUZMLENBRVEsT0FGUixFQUVpQjtBQUFBLG1CQUFNOEIsaUNBQWlDbkksU0FBU1UsTUFBVCxDQUFnQkUsV0FBakQsRUFBOERzSCxXQUE5RCxDQUFOO0FBQUEsU0FGakI7QUFHSDs7QUFFRDs7O0FBR0EsYUFBU0Usb0JBQVQsR0FBZ0M7QUFDNUI7QUFDQSxZQUFNRixjQUFjcEksRUFBRUUsU0FBU1EsU0FBVCxDQUFtQkMsVUFBbkIsQ0FBOEI0SCxLQUE5QixHQUFzQ0MsSUFBdEMsRUFBRixDQUFwQjs7QUFFQTtBQUNBLFlBQU1SLFdBQVdqSSxNQUNaTSxJQURZLENBQ1BlLFVBQVVZLE9BREgsRUFFWjJCLE1BRlksQ0FFTCxVQUZLLENBQWpCOztBQUlBO0FBQ0EsWUFBTThFLGVBQWVULFNBQVMzSCxJQUFULENBQWNlLFVBQVVULFVBQXhCLENBQXJCOztBQUVBO0FBQ0EsWUFBTStILGFBQWFELGFBQWF4RSxNQUFiLEdBQXNCLENBQXpDOztBQUVBO0FBQ0EsWUFBTTBFLFdBQWMvSSxJQUFJaUQsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsV0FBeEIsRUFBcUMsU0FBckMsQ0FBZCxTQUFpRTJGLFVBQXZFOztBQUVBO0FBQ0FOLG9CQUNLL0gsSUFETCxDQUNVZSxVQUFVYSxlQURwQixFQUVLd0YsSUFGTCxDQUVVa0IsUUFGVjs7QUFJQTtBQUNBUCxvQkFDSy9ILElBREwsQ0FDVWUsVUFBVU8sTUFBVixDQUFpQkcsS0FEM0IsRUFFSzJCLEdBRkwsQ0FFU2tGLFFBRlQ7O0FBSUE7QUFDQSxZQUFJRixhQUFheEUsTUFBakIsRUFBeUI7QUFDckI7QUFDQSxnQkFBTTJFLGFBQWFILGFBQ2RJLEtBRGMsR0FFZHhJLElBRmMsQ0FFVGUsVUFBVU8sTUFBVixDQUFpQkMsUUFGUixDQUFuQjs7QUFJQTtBQUNBLGdCQUFNa0gsb0JBQW9CRixXQUNyQmpGLE1BRHFCLENBQ2R2QyxVQUFVTyxNQUFWLENBQWlCRSxzQkFESCxFQUVyQjZCLFFBRnFCLEdBR3JCNkUsS0FIcUIsRUFBMUI7O0FBS0E7QUFDQSxnQkFBTVEsZ0JBQWdCSCxXQUNqQjFCLEdBRGlCLENBQ2I5RixVQUFVTyxNQUFWLENBQWlCRSxzQkFESixFQUVqQmdILEtBRmlCLEdBR2pCbkYsUUFIaUIsR0FJakI2RSxLQUppQixFQUF0Qjs7QUFNQTtBQUNBSCx3QkFDSy9ILElBREwsQ0FDVWUsVUFBVU8sTUFBVixDQUFpQkUsc0JBRDNCLEVBRUttSCxLQUZMLEdBR0twRCxNQUhMLENBR1lrRCxpQkFIWixFQUlLckYsR0FKTCxDQUlTLEVBSlQ7O0FBTUE7QUFDQTJFLHdCQUNLL0gsSUFETCxDQUNVZSxVQUFVTyxNQUFWLENBQWlCQyxRQUQzQixFQUVLc0YsR0FGTCxDQUVTOUYsVUFBVU8sTUFBVixDQUFpQkUsc0JBRjFCLEVBR0ttSCxLQUhMLEdBSUtwRCxNQUpMLENBSVltRCxhQUpaLEVBS0t0RixHQUxMLENBS1MsRUFMVDtBQU1IOztBQUVEO0FBQ0EyRSxvQkFDS2IsSUFETCxHQUVLMEIsU0FGTCxDQUVlakIsUUFGZixFQUdLUixNQUhMOztBQUtBO0FBQ0EvSCxXQUFHeUosT0FBSCxDQUFXQyxJQUFYLENBQWdCZixXQUFoQjtBQUNBM0ksV0FBRzJKLFVBQUgsQ0FBY0QsSUFBZCxDQUFtQmYsV0FBbkI7O0FBRUE7QUFDQUEsb0JBQ0svSCxJQURMLENBQ1UsUUFEVixFQUVLeUQsT0FGTCxDQUVhLFFBRmI7O0FBSUE7QUFDQXpCOztBQUVBO0FBQ0FnSDtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTaEIsZ0NBQVQsQ0FBMENpQixNQUExQyxFQUFrRGxCLFdBQWxELEVBQStEO0FBQzNEO0FBQ0FrQixlQUFPN0UsS0FBUCxDQUFhLE1BQWI7O0FBRUE7QUFDQTJELG9CQUFZbUIsT0FBWixDQUFvQixHQUFwQixFQUF5QixZQUFNO0FBQzNCO0FBQ0FuQix3QkFBWXhFLE1BQVo7O0FBRUE7QUFDQXlGO0FBQ0gsU0FORDs7QUFRQTtBQUNBaEg7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTbUgsYUFBVCxDQUF1QnZHLEtBQXZCLEVBQThCO0FBQzFCO0FBQ0EsWUFBTXdHLFNBQVN6SixFQUFFaUQsTUFBTUcsTUFBUixDQUFmOztBQUVBO0FBQ0EsWUFBTXNHLFNBQVNELE9BQ1ZuRyxPQURVLENBQ0ZsQyxVQUFVVCxVQURSLEVBRVZOLElBRlUsQ0FFTGUsVUFBVWEsZUFGTCxDQUFmOztBQUlBO0FBQ0F5SCxlQUFPakMsSUFBUCxDQUFZZ0MsT0FBT2hHLEdBQVAsRUFBWjtBQUNIOztBQUVEOzs7OztBQUtBLGFBQVNrRyxzQkFBVCxDQUFnQzFHLEtBQWhDLEVBQXVDO0FBQ25DO0FBQ0EsWUFBTTJHLE9BQU81SixFQUFFaUQsTUFBTUcsTUFBUixDQUFiOztBQUVBO0FBQ0EsWUFBTUcsZ0JBQWdCcUcsS0FBS3ZKLElBQUwsQ0FBVWUsVUFBVUMsS0FBVixDQUFnQk4sUUFBMUIsQ0FBdEI7O0FBRUE7QUFDQSxZQUFNeUMsUUFBUW9HLEtBQUt2SixJQUFMLENBQVVlLFVBQVVlLGdCQUFwQixDQUFkOztBQUVBO0FBQ0EsWUFBSSxDQUFDb0IsY0FBY1UsTUFBZixJQUF5QixDQUFDVCxNQUFNUyxNQUFwQyxFQUE0QztBQUN4QztBQUNIOztBQUVELFlBQUlULE1BQU1FLFFBQU4sR0FBaUJPLE1BQXJCLEVBQTZCO0FBQ3pCViwwQkFBYzJDLFdBQWQsQ0FBMEIsa0JBQTFCLEVBQThDZCxRQUE5QyxDQUF1RCx5QkFBdkQ7QUFDSCxTQUZELE1BRU87QUFDSDdCLDBCQUFjMkMsV0FBZCxDQUEwQix5QkFBMUIsRUFBcURkLFFBQXJELENBQThELGtCQUE5RDtBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBLGFBQVN5RSxhQUFULEdBQXlCO0FBQ3JCOUosY0FDS3VELE9BREwsQ0FDYSxNQURiLEVBRUtRLE9BRkwsQ0FFYSxRQUZiO0FBR0g7O0FBRUQ7OztBQUdBLGFBQVNnRyxnQkFBVCxHQUE0QjtBQUN4Qi9KLGNBQ0t1RCxPQURMLENBQ2EsTUFEYixFQUVLUSxPQUZMLENBRWEsUUFGYixFQUV1QixFQUFDaUcsU0FBUyxJQUFWLEVBRnZCO0FBR0g7O0FBRUQ7Ozs7OztBQU1BLGFBQVNsRixvQkFBVCxDQUE4QlQsUUFBOUIsRUFBcUU7QUFBQSxZQUE3QjRGLG1CQUE2Qix1RUFBUCxLQUFPOztBQUNqRTtBQUNBLFlBQU1wQixhQUFhN0ksTUFDZE0sSUFEYyxDQUNUZSxVQUFVTyxNQUFWLENBQWlCQyxRQURSLEVBRWRvSSxzQkFBc0IsUUFBdEIsR0FBaUMsS0FGbkIsRUFFMEI1SSxVQUFVTyxNQUFWLENBQWlCRSxzQkFGM0MsQ0FBbkI7O0FBSUE7QUFDQSxZQUFNOEMsVUFBVTNFLEVBQUUsVUFBRixFQUFjLEVBQUNpSyxPQUFPN0YsUUFBUixFQUFrQnFELE1BQU1yRCxRQUF4QixFQUFrQ3lCLE9BQU8zRSxRQUFRQyxRQUFqRCxFQUFkLENBQWhCOztBQUVBO0FBQ0F5SCxtQkFBV2hELE1BQVgsQ0FBa0JqQixPQUFsQjtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTbUIseUJBQVQsQ0FBbUMxQixRQUFuQyxFQUEwRTtBQUFBLFlBQTdCNEYsbUJBQTZCLHVFQUFQLEtBQU87O0FBQ3RFO0FBQ0EsWUFBTXBCLGFBQWE3SSxNQUNkTSxJQURjLENBQ1RlLFVBQVVPLE1BQVYsQ0FBaUJDLFFBRFIsRUFFZG9JLHNCQUFzQixRQUF0QixHQUFpQyxLQUZuQixFQUUwQjVJLFVBQVVPLE1BQVYsQ0FBaUJFLHNCQUYzQyxDQUFuQjs7QUFJQTtBQUNBK0csbUJBQVdkLElBQVgsQ0FBZ0IsVUFBQ0YsS0FBRCxFQUFRQyxPQUFSLEVBQW9CO0FBQ2hDO0FBQ0EsZ0JBQU0xRSxZQUFZbkQsRUFBRTZILE9BQUYsQ0FBbEI7O0FBRUE7QUFDQTFFLHNCQUFVOUMsSUFBVixjQUEwQitELFFBQTFCLFNBQXdDUixNQUF4Qzs7QUFFQTtBQUNBLGdCQUFJVCxVQUFVTyxRQUFWLEdBQXFCTyxNQUFyQixJQUErQixDQUFuQyxFQUFzQztBQUNsQ2QsMEJBQVVNLEdBQVYsQ0FBYyxFQUFkO0FBQ0g7O0FBRUQ7QUFDQU4sc0JBQVVXLE9BQVYsQ0FBa0IsUUFBbEI7QUFDSCxTQWREO0FBZUg7O0FBRUQ7OztBQUdBLGFBQVN1RixtQkFBVCxHQUErQjtBQUMzQjtBQUNBLFlBQUlhLHdCQUF3QixJQUE1Qjs7QUFFQTtBQUNBLFlBQU01QyxVQUFVdkgsTUFBTU0sSUFBTixDQUFXZSxVQUFVVCxVQUFyQixDQUFoQjs7QUFFQTtBQUNBLFlBQUksQ0FBQzJHLFFBQVFyRCxNQUFiLEVBQXFCO0FBQ2pCaUcsb0NBQXdCLEtBQXhCO0FBQ0g7O0FBRUQ7QUFDQWhLLGlCQUFTQyxPQUFULENBQWlCSSxNQUFqQixDQUNLbUQsUUFETCxHQUVLd0QsR0FGTCxDQUVTLElBRlQsRUFHS1EsSUFITCxDQUdVLFVBSFYsRUFHc0IsQ0FBQ3dDLHFCQUh2QjtBQUlIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXZLLFdBQU93SixJQUFQLEdBQWMsZ0JBQVE7QUFDbEI7QUFDQWpKLGlCQUFTQyxPQUFULENBQWlCQyxJQUFqQixDQUFzQm1HLEVBQXRCLENBQXlCLE9BQXpCLEVBQWtDTyxrQkFBbEM7O0FBRUE7QUFDQS9HLGNBQ0t3RyxFQURMLENBQ1EsV0FEUixFQUNxQndCLFlBRHJCLEVBRUt4QixFQUZMLENBRVEsVUFGUixFQUVvQjJCLFdBRnBCLEVBR0szQixFQUhMLENBR1EsT0FIUixFQUdpQm5GLFVBQVVDLEtBQVYsQ0FBZ0JDLE1BSGpDLEVBR3lDNkcsa0JBSHpDLEVBSUs1QixFQUpMLENBSVEsT0FKUixFQUlpQm5GLFVBQVVPLE1BQVYsQ0FBaUJHLEtBSmxDLEVBSXlDMEgsYUFKekMsRUFLS2pELEVBTEwsQ0FLUSxRQUxSLEVBS2tCbkYsVUFBVU8sTUFBVixDQUFpQkksSUFMbkMsRUFLeUNnQyxXQUx6QyxFQU1Ld0MsRUFOTCxDQU1RLE9BTlIsRUFNaUJuRixVQUFVQyxLQUFWLENBQWdCSyxNQU5qQyxFQU15Q21DLGtCQU56QyxFQU9LMEMsRUFQTCxDQU9RLE9BUFIsRUFPaUJuRixVQUFVQyxLQUFWLENBQWdCSSxXQVBqQyxFQU84Q3FELGNBUDlDLEVBUUt5QixFQVJMLENBUVEsT0FSUixFQVFpQm5GLFVBQVVDLEtBQVYsQ0FBZ0JOLFFBUmpDLEVBUTJDeUYsV0FSM0MsRUFTS0QsRUFUTCxDQVNRLFFBVFIsRUFTa0JuRixVQUFVTyxNQUFWLENBQWlCQyxRQVRuQyxFQVM2Q29CLGNBVDdDLEVBVUt1RCxFQVZMLENBVVEsWUFWUixFQVVzQm5GLFVBQVVjLGdCQVZoQyxFQVVrRHlILHNCQVZsRDs7QUFZQTtBQUNBekosaUJBQVNDLE9BQVQsQ0FBaUJLLFVBQWpCLENBQTRCK0YsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0NzRCxhQUF4QztBQUNBM0osaUJBQVNDLE9BQVQsQ0FBaUJNLGFBQWpCLENBQStCOEYsRUFBL0IsQ0FBa0MsT0FBbEMsRUFBMkN1RCxnQkFBM0M7O0FBRUE7QUFDQTVKLGlCQUFTQyxPQUFULENBQWlCRyxNQUFqQixDQUF3QmlHLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DK0Isb0JBQXBDOztBQUVBO0FBQ0FwSSxpQkFBU2MsU0FBVCxDQUNLMEMsUUFETCxHQUVLbUYsS0FGTCxHQUdLekQsUUFITCxDQUdjLFFBSGQ7O0FBS0E7QUFDQXJGLGNBQ0tNLElBREwsQ0FDVWUsVUFBVVksT0FEcEIsRUFFSzZHLEtBRkwsR0FHS3pELFFBSEwsQ0FHYyxXQUhkOztBQUtBO0FBQ0FyRixjQUNLTSxJQURMLENBQ1VlLFVBQVVPLE1BQVYsQ0FBaUJDLFFBRDNCLEVBRUtrQyxPQUZMLENBRWEsUUFGYixFQUV1QixDQUFDLEtBQUQsQ0FGdkI7O0FBSUE7QUFDQXFHO0FBQ0gsS0EzQ0Q7O0FBNkNBLFdBQU94SyxNQUFQO0FBQ0gsQ0E5eUJMIiwiZmlsZSI6InNsaWRlcnMvZGV0YWlscy9zbGlkZXNfY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzbGlkZXNfY29udGFpbmVyLmpzIDIwMTYtMTItMjlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIENvbnRyb2xsZXIgTW9kdWxlIEZvciBTbGlkZXMgQ29udGFpbmVyIChUYWJzKVxuICpcbiAqIEhhbmRsZXMgdGhlIHNsaWRlcnMgY29udGFpbmVyIGZ1bmN0aW9uYWxpdHkgaW4gdGhlIHNsaWRlcnMgZGV0YWlscyBwYWdlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3NsaWRlc19jb250YWluZXInLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LWRlcGFyYW0vanF1ZXJ5LWRlcGFyYW0ubWluLmpzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uanNgLFxuICAgICAgICAneGhyJyxcbiAgICAgICAgJ21vZGFsJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgIGNvbnN0ICRmb290ZXIgPSAkKCcuZ3gtYWRtaW4tZm9vdGVyJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVsZW1lbnRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHtcbiAgICAgICAgICAgIC8vIEJ1dHRvbnMuXG4gICAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICAgICAgLy8gU29ydCBtb2RlIGJ1dHRvbi5cbiAgICAgICAgICAgICAgICBzb3J0OiAkdGhpcy5maW5kKCcuc29ydC1idXR0b24nKSxcblxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBidXR0b24uXG4gICAgICAgICAgICAgICAgY3JlYXRlOiAkdGhpcy5maW5kKCcuYnRuLWNyZWF0ZScpLFxuXG4gICAgICAgICAgICAgICAgLy8gU3VibWl0IGJ1dHRvbiBncm91cC5cbiAgICAgICAgICAgICAgICBzdWJtaXQ6ICRmb290ZXIuZmluZCgnLnN1Ym1pdC1idXR0b24tZ3JvdXAnKSxcblxuICAgICAgICAgICAgICAgIC8vIFN1Ym1pdCBidXR0b24gZm9yIHNhdmUgc2xpZGVyXG4gICAgICAgICAgICAgICAgc3VibWl0U2F2ZTogJGZvb3Rlci5maW5kKCcuc2F2ZScpLFxuXG4gICAgICAgICAgICAgICAgLy8gU3VibWl0IGJ1dHRvbiBmb3Igc2F2ZSBhbmQgcmVmcmVzaCBzbGlkZXJcbiAgICAgICAgICAgICAgICBzdWJtaXRSZWZyZXNoOiAkZm9vdGVyLmZpbmQoJy5yZWZyZXNoJyksXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBUZW1wbGF0ZS5cbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAgIC8vIFNsaWRlIHBhbmVsIHNldCB0ZW1wbGF0ZS5cbiAgICAgICAgICAgICAgICBzbGlkZVBhbmVsOiAkdGhpcy5maW5kKCcjc2xpZGUtcGFuZWwtdGVtcGxhdGUnKVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gTW9kYWxzLlxuICAgICAgICAgICAgbW9kYWxzOiB7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGltYWdlIG1vZGFsLlxuICAgICAgICAgICAgICAgIGRlbGV0ZUltYWdlOiAkKCcuZGVsZXRlLWltYWdlLm1vZGFsJyksXG5cbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgc2xpZGUgbW9kYWwuXG4gICAgICAgICAgICAgICAgZGVsZXRlU2xpZGU6ICQoJy5kZWxldGUtc2xpZGUubW9kYWwnKSxcblxuICAgICAgICAgICAgICAgIC8vIEVkaXQgaW1hZ2UgbWFwIG1vZGFsLlxuICAgICAgICAgICAgICAgIGltYWdlTWFwOiAkKCcuaW1hZ2UtbWFwLm1vZGFsJyksXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBUYWJzLlxuICAgICAgICAgICAgdGFiSGVhZGVyOiAkdGhpcy5maW5kKCcubmF2LXRhYnMnKSxcblxuICAgICAgICAgICAgLy8gU2VsZWN0IGJveCB3aGljaCBob2xkcyBhbGwgaW1hZ2VzIHRoYXQgd2lsbCBiZSBkZWxldGVkLlxuICAgICAgICAgICAgZGVsZXRlSW1hZ2VTZWxlY3Q6ICQoJyNkZWxldGVfaW1hZ2VzJylcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ1NTIGNsYXNzIG5hbWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAgICAgICAgIC8vIE5ldyBpbWFnZS5cbiAgICAgICAgICAgIG5ld0ltYWdlOiAnbmV3J1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3RvciBTdHJpbmdzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSB7XG4gICAgICAgICAgICAvLyBJY29uIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAgICAgICAgICBpY29uczoge1xuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBidXR0b24gb24gdGhlIHBhbmVsIGhlYWRlci5cbiAgICAgICAgICAgICAgICBkZWxldGU6ICcuaWNvbi5kZWxldGUnLFxuXG4gICAgICAgICAgICAgICAgLy8gRHJhZyBidXR0b24gb24gdGhlIHBhbmVsIGhlYWRlci5cbiAgICAgICAgICAgICAgICBkcmFnOiAnLmRyYWctaGFuZGxlJyxcblxuICAgICAgICAgICAgICAgIC8vIENvbGxhcHNlciBidXR0b24gb24gdGhlIHBhbmVsIGhlYWRlci5cbiAgICAgICAgICAgICAgICBjb2xsYXBzZXI6ICcuY29sbGFwc2VyJyxcblxuICAgICAgICAgICAgICAgIC8vIEltYWdlIGRlbGV0ZSBidXR0b24uXG4gICAgICAgICAgICAgICAgaW1hZ2VEZWxldGU6ICcuYWN0aW9uLWljb24uZGVsZXRlJyxcblxuICAgICAgICAgICAgICAgIC8vIEltYWdlIG1hcCBlZGl0IGJ1dHRvbi5cbiAgICAgICAgICAgICAgICBpbWFnZU1hcDogJy5hY3Rpb24taWNvbi5pbWFnZS1tYXAnLFxuXG4gICAgICAgICAgICAgICAgLy8gVXBsb2FkIGltYWdlIGJ1dHRvbi5cbiAgICAgICAgICAgICAgICB1cGxvYWQ6ICcuYWN0aW9uLWljb24udXBsb2FkJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gSW5wdXRzIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAgICAgICAgICBpbnB1dHM6IHtcbiAgICAgICAgICAgICAgICAvLyBHZW5lcmFsIGltYWdlIHNlbGVjdCBkcm9wZG93bnMuXG4gICAgICAgICAgICAgICAgZHJvcGRvd246ICcuZHJvcGRvd24taW5wdXQnLFxuXG4gICAgICAgICAgICAgICAgLy8gVGh1bWJuYWlsIGRyb3Bkb3duLlxuICAgICAgICAgICAgICAgIHRodW1ibmFpbEltYWdlRHJvcGRvd246ICdbbmFtZT1cInRodW1ibmFpbFwiXScsXG5cbiAgICAgICAgICAgICAgICAvLyBUaXRsZS5cbiAgICAgICAgICAgICAgICB0aXRsZTogJ2lucHV0W25hbWU9XCJ0aXRsZVwiXScsXG5cbiAgICAgICAgICAgICAgICAvLyBGaWxlLlxuICAgICAgICAgICAgICAgIGZpbGU6ICcuZmlsZS1pbnB1dCdcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFNsaWRlIHBhbmVsLlxuICAgICAgICAgICAgc2xpZGVQYW5lbDogJy5wYW5lbCcsXG5cbiAgICAgICAgICAgIC8vIFRhYiBib2R5LlxuICAgICAgICAgICAgdGFiQm9keTogJy50YWItcGFuZScsXG5cbiAgICAgICAgICAgIC8vIFNsaWRlIHBhbmVsIHRpdGxlLlxuICAgICAgICAgICAgc2xpZGVQYW5lbFRpdGxlOiAnLnNsaWRlLXRpdGxlJyxcblxuICAgICAgICAgICAgLy8gU2V0dGluZyByb3cgKGZvcm0gZ3JvdXApLlxuICAgICAgICAgICAgY29uZmlndXJhdGlvblJvdzogJy5yb3cuZm9ybS1ncm91cCcsXG5cbiAgICAgICAgICAgIC8vIERhdGEgbGlzdCBjb250YWluZXIgZm9yIGltYWdlIG1hcC5cbiAgICAgICAgICAgIGltYWdlTWFwRGF0YUxpc3Q6ICcuaW1hZ2UtbWFwLWRhdGEtbGlzdCcsXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhY2hlIGxpc3Qgb2Ygb3BlbiBzbGlkZSBwYW5lbHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnlbXX1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBvcGVuU2xpZGVQYW5lbHMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXJzIGEgY2hhbmdlLCBzbyB0aGF0IHRoZSB1c2VyIGdldHMgYSBjb25maXJtYXRpb24gZGlhbG9nIHdoaWxlIGxlYXZpbmcgdGhlIHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVnaXN0ZXJDaGFuZ2UoKSB7XG4gICAgICAgICAgICAvLyBPYmplY3Qgb2YgR0VUIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICBjb25zdCBnZXRQYXJhbWV0ZXJzID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xuXG4gICAgICAgICAgICAvLyBPbmx5IHJlZ2lzdGVyIGluIHNsaWRlciBlZGl0IG1vZGUuXG4gICAgICAgICAgICBpZiAoJ2lkJyBpbiBnZXRQYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gKCkgPT4ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0VYSVRfQ09ORklSTUFUSU9OX1RFWFQnLCAnc2xpZGVycycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGltYWdlIGRyb3Bkb3duIGNoYW5nZSBldmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVtb3ZlQWxsRGF0YUxpc3RJdGVtcyA9IGZhbHNlXSBSZW1vdmUgYWxsIGRhdGEgbGlzdCBjb250YWluZXIgbGlzdCBpdGVtcz9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkltYWdlQ2hhbmdlKGV2ZW50LCByZW1vdmVBbGxEYXRhTGlzdEl0ZW1zID0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gSW1hZ2UgZHJvcGRvd24gZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRkcm9wZG93biA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGljb24gZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRyZW1vdmVJY29uID0gJGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgLnBhcmVudHMoc2VsZWN0b3JzLmNvbmZpZ3VyYXRpb25Sb3cpXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmljb25zLmltYWdlRGVsZXRlKTtcblxuICAgICAgICAgICAgLy8gSW1hZ2UgbWFwIGljb24gZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRpbWFnZU1hcEljb24gPSAkZHJvcGRvd25cbiAgICAgICAgICAgICAgICAucGFyZW50cyhzZWxlY3RvcnMuY29uZmlndXJhdGlvblJvdylcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuaWNvbnMuaW1hZ2VNYXApO1xuXG4gICAgICAgICAgICAvLyBJbWFnZSBtYXAgZGF0YSBjb250YWluZXIgbGlzdCBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJGxpc3QgPSAkZHJvcGRvd25cbiAgICAgICAgICAgICAgICAucGFyZW50cyhzZWxlY3RvcnMuY29uZmlndXJhdGlvblJvdylcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuaW1hZ2VNYXBEYXRhTGlzdCk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcmVtb3ZlIGljb24gaWYgJ2RvIG5vdCB1c2UnIGlzIHNlbGVjdGVkLlxuICAgICAgICAgICAgJHJlbW92ZUljb25bJGRyb3Bkb3duLnZhbCgpID8gJ3Nob3cnIDogJ2hpZGUnXSgpO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGltYWdlIG1hcCBpY29uIGlmICdkbyBub3QgdXNlJyBpcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICRpbWFnZU1hcEljb25bJGRyb3Bkb3duLnZhbCgpID8gJ3Nob3cnIDogJ2hpZGUnXSgpO1xuXG4gICAgICAgICAgICAvLyBFbXB0eSBpbWFnZSBtYXAgZGF0YSBjb250YWluZXIgbGlzdC5cbiAgICAgICAgICAgICRsaXN0XG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHJlbW92ZUFsbERhdGFMaXN0SXRlbXMgPyAnKicgOiAnLm5ldycpXG4gICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaWdnZXJzIHRoZSBmaWxlIHNlbGVjdCAoY2xpY2spIGV2ZW50IG9mIHRoZSBpbnZpc2libGUgZmlsZSBpbnB1dCBmaWVsZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblVwbG9hZEljb25DbGljayhldmVudCkge1xuICAgICAgICAgICAgJChldmVudC50YXJnZXQpXG4gICAgICAgICAgICAgICAgLnBhcmVudHMoc2VsZWN0b3JzLmNvbmZpZ3VyYXRpb25Sb3cpXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5maWxlKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGZpbGUgc2VsZWN0IChjaGFuZ2UpIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW1hZ2VBZGQoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIEV4aXQgbWV0aG9kLCBpZiBzZWxlY3Rpb24gaGFzIGJlZW4gYWJvcnRlZC5cbiAgICAgICAgICAgIGlmICghZXZlbnQudGFyZ2V0LmZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmlsZSBpbnB1dCBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJGZpbGVJbnB1dCA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gSW1hZ2UgZHJvcGRvd24uXG4gICAgICAgICAgICBjb25zdCAkZHJvcGRvd24gPSAkZmlsZUlucHV0XG4gICAgICAgICAgICAgICAgLnBhcmVudHMoc2VsZWN0b3JzLmNvbmZpZ3VyYXRpb25Sb3cpXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5kcm9wZG93bik7XG5cbiAgICAgICAgICAgIC8vIFJlZ3VsYXIgZXhwcmVzc2lvbiB0byB2YWxpZGF0ZSB0aGUgZmlsZSBuYW1lLlxuICAgICAgICAgICAgY29uc3QgcmVnZXggPSAvKC4pKGpwZ3xqcGVnfHBuZ3xnaWZ8Ym1wKSQvaTtcblxuICAgICAgICAgICAgLy8gRmlsZSBuYW1lLlxuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBldmVudC50YXJnZXQuZmlsZXNbMF0ubmFtZTtcblxuICAgICAgICAgICAgLy8gSXMgdGhlIGRyb3Bkb3duIGZvciB0aHVtYm5haWwgaW1hZ2VzP1xuICAgICAgICAgICAgY29uc3QgaXNUaHVtYm5haWxJbWFnZSA9ICEhJGZpbGVJbnB1dFxuICAgICAgICAgICAgICAgIC5wYXJlbnRzKHNlbGVjdG9ycy5jb25maWd1cmF0aW9uUm93KVxuICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy5pbnB1dHMudGh1bWJuYWlsSW1hZ2VEcm9wZG93bilcbiAgICAgICAgICAgICAgICAubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBFeGl0IG1ldGhvZCBhbmQgc2hvdyBtb2RhbCwgaWYgZmlsZSB0eXBlIGRvZXMgbm90IG1hdGNoLlxuICAgICAgICAgICAgaWYgKCFyZWdleC50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICAgICAgICAgIC8vIFNob3cgbW9kYWwuXG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdJTlZBTElEX0ZJTEVfTU9EQUxfVElUTEUnLCAnc2xpZGVycycpLFxuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnSU5WQUxJRF9GSUxFX01PREFMX1RFWFQnLCAnc2xpZGVycycpXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IHZhbHVlLlxuICAgICAgICAgICAgICAgICRmaWxlSW5wdXQudmFsKCcnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXhpdCBtZXRob2QgYW5kIHNob3cgbW9kYWwsIGlmIGZpbGVuYW1lIGlzIGFscmVhZHkgcHJlc2VudCBpbiBkcm9wZG93bi5cbiAgICAgICAgICAgIGZvciAoY29uc3QgJG9wdGlvbiBvZiAkZHJvcGRvd25bMF0uY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBvcHRpb24ncyB0ZXh0IGNvbnRlbnQgbWF0Y2hlcyB3aXRoIHRoZSBuYW1lIG9mIHRoZSBzZWxlY3RlZCBmaWxlLlxuICAgICAgICAgICAgICAgIGlmICgkb3B0aW9uLnRleHRDb250ZW50ID09PSBmaWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaG93IG1vZGFsLlxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdGSUxFTkFNRV9BTFJFQURZX1VTRURfTU9EQUxfVElUTEUnLCAnc2xpZGVycycpLFxuICAgICAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0ZJTEVOQU1FX0FMUkVBRFlfVVNFRF9NT0RBTF9URVhUJywgJ3NsaWRlcnMnKVxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc2V0IHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAkZmlsZUlucHV0LnZhbCgnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGZpbGVzIHRvIGRyb3Bkb3ducy5cbiAgICAgICAgICAgIF9hZGRJbWFnZVRvRHJvcGRvd25zKGZpbGVOYW1lLCBpc1RodW1ibmFpbEltYWdlKTtcblxuICAgICAgICAgICAgLy8gU2VsZWN0IHZhbHVlLlxuICAgICAgICAgICAgJGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgLnZhbChmaWxlTmFtZSlcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgaW1hZ2UgZGVsZXRlIGJ1dHRvbiBjbGljayBldmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkltYWdlRGVsZXRlKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBMb2FkaW5nIENTUyBjbGFzcyBuYW1lLlxuICAgICAgICAgICAgY29uc3QgbG9hZGluZ0NsYXNzID0gJ2xvYWRpbmcnO1xuXG4gICAgICAgICAgICAvLyBJbWFnZSBkcm9wZG93biBjb250YWluZXIuXG4gICAgICAgICAgICBjb25zdCAkY29uZmlndXJhdGlvblJvdyA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKHNlbGVjdG9ycy5jb25maWd1cmF0aW9uUm93KTtcblxuICAgICAgICAgICAgLy8gSW1hZ2UgZHJvcGRvd24uXG4gICAgICAgICAgICBjb25zdCAkZHJvcGRvd24gPSAkY29uZmlndXJhdGlvblJvdy5maW5kKHNlbGVjdG9ycy5pbnB1dHMuZHJvcGRvd24pO1xuXG4gICAgICAgICAgICAvLyBTbGlkZSBJRC5cbiAgICAgICAgICAgIGNvbnN0IHNsaWRlSWQgPSAkY29uZmlndXJhdGlvblJvdy5wYXJlbnRzKHNlbGVjdG9ycy5zbGlkZVBhbmVsKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgICAvLyBTbGlkZSBpbWFnZSBJRC5cbiAgICAgICAgICAgIGNvbnN0IHNsaWRlSW1hZ2VJZCA9ICRjb25maWd1cmF0aW9uUm93LmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICAgIC8vIElzIHRoZSBkcm9wZG93biBmb3IgdGh1bWJuYWlsIGltYWdlcz9cbiAgICAgICAgICAgIGNvbnN0IGlzVGh1bWJuYWlsSW1hZ2UgPSAhISRkcm9wZG93bi5pcyhzZWxlY3RvcnMuaW5wdXRzLnRodW1ibmFpbEltYWdlRHJvcGRvd24pO1xuXG4gICAgICAgICAgICAvLyBTZWxlY3RlZCBmaWxlIG5hbWUuXG4gICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9ICRkcm9wZG93bi52YWwoKTtcblxuICAgICAgICAgICAgLy8gQWRkIGxvYWRpbmcgc3RhdGUuXG4gICAgICAgICAgICAkZHJvcGRvd24uYWRkQ2xhc3MobG9hZGluZ0NsYXNzKTtcblxuICAgICAgICAgICAgLy8gSW1hZ2UgdXNhZ2UgY2hlY2sgcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdXJsOiAnYWRtaW4ucGhwP2RvPVNsaWRlcnNEZXRhaWxzQWpheC9DaGVja0ltYWdlVXNhZ2UnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgICBpc190aHVtYm5haWw6IGlzVGh1bWJuYWlsSW1hZ2UsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlX2lkOiBzbGlkZUlkLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZV9pbWFnZV9pZDogc2xpZGVJbWFnZUlkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSBkZWxldGlvbi5cbiAgICAgICAgICAgIGNvbnN0IHBlcmZvcm1EZWxldGlvbiA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBQdXQgaW1hZ2UgbmFtZSBpbnRvIGRlbGV0ZXIgc2VsZWN0IGJveC5cbiAgICAgICAgICAgICAgICBlbGVtZW50cy5kZWxldGVJbWFnZVNlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbDogZmlsZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiBpc1RodW1ibmFpbEltYWdlID8gJ3RodW1ibmFpbCcgOiAnJ1xuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBpbWFnZSBmcm9tIGRyb3Bkb3ducy5cbiAgICAgICAgICAgICAgICBfZGVsZXRlSW1hZ2VGcm9tRHJvcGRvd25zKGZpbGVOYW1lLCBpc1RodW1ibmFpbEltYWdlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGltYWdlIHVzYWdlLlxuICAgICAgICAgICAganNlLmxpYnMueGhyLmdldChyZXF1ZXN0T3B0aW9ucykudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGxvYWRpbmcgc3RhdGUuXG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLnJlbW92ZUNsYXNzKGxvYWRpbmdDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuaXNVc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1vZGFsIGNvbmZpcm1hdGlvbiBidXR0b24gZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNvbmZpcm1CdXR0b24gPSBlbGVtZW50cy5tb2RhbHMuZGVsZXRlSW1hZ2UuZmluZCgnYnV0dG9uLmNvbmZpcm0nKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTaG93IG1vZGFsLlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5tb2RhbHMuZGVsZXRlSW1hZ2UubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBMaXN0ZW4gdG8gY29uZmlybWF0aW9uIGJ1dHRvbiBjbGljayBldmVudC5cbiAgICAgICAgICAgICAgICAgICAgJGNvbmZpcm1CdXR0b25cbiAgICAgICAgICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBwZXJmb3JtRGVsZXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmZvcm1EZWxldGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGltYWdlIG1hcCBlZGl0IGJ1dHRvbiBjbGljayBldmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkltYWdlTWFwKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBTbGlkZSBpbWFnZSBJRC5cbiAgICAgICAgICAgIGNvbnN0IHNsaWRlSW1hZ2VJZCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAgICAgICAgIC5wYXJlbnRzKHNlbGVjdG9ycy5jb25maWd1cmF0aW9uUm93KVxuICAgICAgICAgICAgICAgIC5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgICAvLyBMaXN0IGVsZW1lbnQgd2hpY2ggYWN0cyBsaWtlIGEgZGF0YSBjb250YWluZXIuXG4gICAgICAgICAgICBjb25zdCAkbGlzdCA9ICQoZXZlbnQudGFyZ2V0KVxuICAgICAgICAgICAgICAgIC5wYXJlbnRzKHNlbGVjdG9ycy5jb25maWd1cmF0aW9uUm93KVxuICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy5pbWFnZU1hcERhdGFMaXN0KTtcblxuICAgICAgICAgICAgLy8gSW1hZ2UgZHJvcGRvd24uXG4gICAgICAgICAgICBjb25zdCAkZHJvcGRvd24gPSAkKGV2ZW50LnRhcmdldClcbiAgICAgICAgICAgICAgICAucGFyZW50cyhzZWxlY3RvcnMuY29uZmlndXJhdGlvblJvdylcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuaW5wdXRzLmRyb3Bkb3duKTtcblxuICAgICAgICAgICAgLy8gU2xpZGUgaW1hZ2UgZmlsZSBuYW1lLlxuICAgICAgICAgICAgY29uc3QgaW1hZ2VGaWxlbmFtZSA9ICRkcm9wZG93bi52YWwoKTtcblxuICAgICAgICAgICAgLy8gSXMgYSBuZXcgaW1hZ2Ugc2VsZWN0ZWQ/XG4gICAgICAgICAgICBjb25zdCBpc05ld0ltYWdlU2VsZWN0ZWQgPSAkZHJvcGRvd24uZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuaGFzQ2xhc3MoY2xhc3Nlcy5uZXdJbWFnZSk7XG5cbiAgICAgICAgICAgIC8vIFBhdGggdG8gaW1hZ2UgVVJMLlxuICAgICAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvaW1hZ2VzL3NsaWRlcl9pbWFnZXMvJyArIGltYWdlRmlsZW5hbWU7XG5cbiAgICAgICAgICAgIC8vIFNob3cgc2F2ZSBmaXJzdCBub3RpY2UgbW9kYWwgYW5kIHJldHVybiBpbW1lZGlhdGVseSwgaWYgdGhlIHNsaWRlIGltYWdlIGhhcyBubyBJRC5cbiAgICAgICAgICAgIGlmICghc2xpZGVJbWFnZUlkIHx8IGlzTmV3SW1hZ2VTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKFxuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnSU1BR0VfTUFQX01PREFMX1RJVExFJywgJ3NsaWRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NBVkVfU0xJREVSX0ZJUlNUX05PVElDRV9URVhUJywgJ3NsaWRlcnMnKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgaW1hZ2UgbWFwIG1vZGFsLlxuICAgICAgICAgICAgZWxlbWVudHMubW9kYWxzLmltYWdlTWFwLnRyaWdnZXIoJ3Nob3cnLCBbJGxpc3QsIGltYWdlVXJsXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgc29ydCBidXR0b24gY2xpY2sgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Tb3J0QnV0dG9uQ2xpY2soKSB7XG4gICAgICAgICAgICAvLyBJbmRpY2F0b3IgQ1NTIGNsYXNzZXMuXG4gICAgICAgICAgICBjb25zdCBpbmRpY2F0b3JDbGFzcyA9ICdtb2RlLW9uIGJ0bi1wcmltYXJ5JztcblxuICAgICAgICAgICAgLy8gU2VsZWN0b3Igc3RyaW5nIGZvciB0aGUgc2xpZGUgcGFuZWwgYm9keS5cbiAgICAgICAgICAgIGNvbnN0IHNsaWRlUGFuZWxCb2R5U2VsZWN0b3IgPSAnLnBhbmVsLWJvZHknO1xuXG4gICAgICAgICAgICAvLyBTbGlkZXMgY29udGFpbmVyIHRhYnMsIGV4Y2VwdCB0aGUgYWN0aXZlIG9uZS5cbiAgICAgICAgICAgIGNvbnN0ICRvdGhlclRhYnMgPSBlbGVtZW50cy50YWJIZWFkZXJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5ub3QoJy5hY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gSXMgdGhlIHNvcnQgbW9kZSBvbj9cbiAgICAgICAgICAgIGNvbnN0IGlzTW9kZU9uID0gZWxlbWVudHMuYnV0dG9ucy5zb3J0Lmhhc0NsYXNzKGluZGljYXRvckNsYXNzKTtcblxuICAgICAgICAgICAgLy8gTGFuZ3VhZ2Utc3BlY2lmaWMgYnV0dG9uIHRleHRzLlxuICAgICAgICAgICAgY29uc3QgZW50ZXJUZXh0ID0gZWxlbWVudHMuYnV0dG9ucy5zb3J0LmRhdGEoJ3RleHRFbnRlcicpO1xuICAgICAgICAgICAgY29uc3QgZXhpdFRleHQgPSBlbGVtZW50cy5idXR0b25zLnNvcnQuZGF0YSgndGV4dEV4aXQnKTtcblxuICAgICAgICAgICAgLy8gQWxsIHNsaWRlIHBhbmVscy5cbiAgICAgICAgICAgIGNvbnN0ICRzbGlkZXMgPSAkdGhpcy5maW5kKHNlbGVjdG9ycy5zbGlkZVBhbmVsKTtcblxuICAgICAgICAgICAgLy8gQXBwbHkgZmFkZSBlZmZlY3Qgb250byBzbGlkZSBwYW5lbHMuXG4gICAgICAgICAgICAkc2xpZGVzXG4gICAgICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgICAgICAgIC5mYWRlSW4oKTtcblxuICAgICAgICAgICAgLy8gU3dpdGNoIHRleHQgYW5kIHRvZ2dsZSBpbmRpY2F0b3IgY2xhc3MuXG4gICAgICAgICAgICBlbGVtZW50cy5idXR0b25zLnNvcnRbaXNNb2RlT24gPyAncmVtb3ZlQ2xhc3MnIDogJ2FkZENsYXNzJ10oaW5kaWNhdG9yQ2xhc3MpXG4gICAgICAgICAgICAgICAgLnRleHQoaXNNb2RlT24gPyBlbnRlclRleHQgOiBleGl0VGV4dCk7XG5cbiAgICAgICAgICAgIC8vIFRvZ2dsZSBjcmVhdGUgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5jcmVhdGUucHJvcCgnZGlzYWJsZWQnLCAhaXNNb2RlT24pO1xuXG4gICAgICAgICAgICAvLyBUb2dnbGUgZHJhZyBoYW5kbGUgYnV0dG9ucy5cbiAgICAgICAgICAgICRzbGlkZXMuZmluZChzZWxlY3RvcnMuaWNvbnMuZHJhZylbaXNNb2RlT24gPyAnaGlkZScgOiAnc2hvdyddKCk7XG5cbiAgICAgICAgICAgIC8vIFRvZ2dsZSBvdGhlciB0YWJzLlxuICAgICAgICAgICAgJG90aGVyVGFic1tpc01vZGVPbiA/ICdmYWRlSW4nIDogJ2ZhZGVPdXQnXSgpO1xuXG4gICAgICAgICAgICAvLyBUb2dnbGUgY29sbGFwc2VyIGFuZCBoaWRlIGJ1dHRvbnMuXG4gICAgICAgICAgICAkc2xpZGVzXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmljb25zLmNvbGxhcHNlcilcbiAgICAgICAgICAgICAgICAuYWRkKHNlbGVjdG9ycy5pY29ucy5kZWxldGUpW2lzTW9kZU9uID8gJ3Nob3cnIDogJ2hpZGUnXSgpO1xuXG4gICAgICAgICAgICAvLyBTYXZlIG9wZW4gc2xpZGUgcGFuZWxzLlxuICAgICAgICAgICAgaWYgKCFpc01vZGVPbikge1xuICAgICAgICAgICAgICAgIG9wZW5TbGlkZVBhbmVscyA9ICRzbGlkZXMuZmlsdGVyKChpbmRleCwgZWxlbWVudCkgPT4gJChlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAuZmluZChzbGlkZVBhbmVsQm9keVNlbGVjdG9yKVxuICAgICAgICAgICAgICAgICAgICAuaXMoJzp2aXNpYmxlJykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUb2dnbGUgc2F2ZWQgb3BlbiBzbGlkZSBwYW5lbHMuXG4gICAgICAgICAgICBvcGVuU2xpZGVQYW5lbHMuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+ICQoZWxlbWVudClcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuaWNvbnMuY29sbGFwc2VyKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGljaycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBzb3J0IHN0YXJ0IGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uU29ydFN0YXJ0KCkge1xuICAgICAgICAgICAgLy8gVGFiIGNvbnRlbnQgZWxlbWVudCBmb3Igc2VsZWN0ZWQgbGFuZ3VhZ2UuXG4gICAgICAgICAgICBjb25zdCAkdGFiQm9keSA9ICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLnRhYkJvZHkpXG4gICAgICAgICAgICAgICAgLmZpbHRlcignOnZpc2libGUnKTtcblxuICAgICAgICAgICAgLy8gUmVmcmVzaCB0YWIgc2l6ZXMgYW5kIHBvc2l0aW9ucy5cbiAgICAgICAgICAgICR0YWJCb2R5LnNvcnRhYmxlKCdyZWZyZXNoUG9zaXRpb25zJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgc29ydCBzdG9wIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uU29ydFN0b3AoKSB7XG4gICAgICAgICAgICAvLyBSZWdpc3RlciBjaGFuZ2UsIHRvIG1ha2UgcHJvbXB0IG9uIHBhZ2UgdW5sb2FkLlxuICAgICAgICAgICAgX3JlZ2lzdGVyQ2hhbmdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgZGVsZXRlIGljb24gY2xpY2sgZXZlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25EZWxldGVJY29uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFNsaWRlIHBhbmVsIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkc2xpZGVQYW5lbCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKHNlbGVjdG9ycy5zbGlkZVBhbmVsKTtcblxuICAgICAgICAgICAgLy8gTW9kYWwgY29uZmlybWF0aW9uIGJ1dHRvbiBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJGNvbmZpcm1CdXR0b24gPSBlbGVtZW50cy5tb2RhbHMuZGVsZXRlU2xpZGUuZmluZCgnYnV0dG9uLmNvbmZpcm0nKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBtb2RhbC5cbiAgICAgICAgICAgIGVsZW1lbnRzLm1vZGFscy5kZWxldGVTbGlkZS5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAvLyBMaXN0ZW4gdG8gY29uZmlybWF0aW9uIGJ1dHRvbiBjbGljayBldmVudC5cbiAgICAgICAgICAgICRjb25maXJtQnV0dG9uXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAoKSA9PiBfb25EZWxldGVDb25maXJtYXRpb25CdXR0b25DbGljayhlbGVtZW50cy5tb2RhbHMuZGVsZXRlU2xpZGUsICRzbGlkZVBhbmVsKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgY3JlYXRlIGJ1dHRvbiBjbGljayBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkNyZWF0ZUJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgLy8gTWFrZSBhIGNsb25lIG9mIHRoZSBzbGlkZSBwYW5lbCB0ZW1wbGF0ZSBhbmQgY3JlYXRlIGEgbmV3IGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkc2xpZGVQYW5lbCA9ICQoZWxlbWVudHMudGVtcGxhdGVzLnNsaWRlUGFuZWwuY2xvbmUoKS5odG1sKCkpO1xuXG4gICAgICAgICAgICAvLyBUYWIgY29udGVudCBlbGVtZW50IGZvciBzZWxlY3RlZCBsYW5ndWFnZS5cbiAgICAgICAgICAgIGNvbnN0ICR0YWJCb2R5ID0gJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMudGFiQm9keSlcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCc6dmlzaWJsZScpO1xuXG4gICAgICAgICAgICAvLyBTbGlkZSBwYW5lbHMuXG4gICAgICAgICAgICBjb25zdCAkc2xpZGVQYW5lbHMgPSAkdGFiQm9keS5maW5kKHNlbGVjdG9ycy5zbGlkZVBhbmVsKTtcblxuICAgICAgICAgICAgLy8gTmV4dCBwYW5lbCBpbmRleC5cbiAgICAgICAgICAgIGNvbnN0IHBhbmVsSW5kZXggPSAkc2xpZGVQYW5lbHMubGVuZ3RoICsgMTtcblxuICAgICAgICAgICAgLy8gVGl0bGUgZm9yIG5ldyBzbGlkZSBwYW5lbC5cbiAgICAgICAgICAgIGNvbnN0IG5ld1RpdGxlID0gYCR7anNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ05FV19TTElERScsICdzbGlkZXJzJyl9ICR7cGFuZWxJbmRleH1gO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGl0bGUgdG8gc2xpZGUgcGFuZWwgaGVhZGVyLlxuICAgICAgICAgICAgJHNsaWRlUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuc2xpZGVQYW5lbFRpdGxlKVxuICAgICAgICAgICAgICAgIC50ZXh0KG5ld1RpdGxlKTtcblxuICAgICAgICAgICAgLy8gQWRkIHRpdGxlIHRvIGlucHV0IGZpZWxkLlxuICAgICAgICAgICAgJHNsaWRlUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZChzZWxlY3RvcnMuaW5wdXRzLnRpdGxlKVxuICAgICAgICAgICAgICAgIC52YWwobmV3VGl0bGUpO1xuXG4gICAgICAgICAgICAvLyBBZGQgdmFsdWVzIHRvIGRyb3Bkb3ducy5cbiAgICAgICAgICAgIGlmICgkc2xpZGVQYW5lbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBpbWFnZSBkcm9wZG93bnMgb2YgdGhlIGZpcnN0IHBhbmVsLlxuICAgICAgICAgICAgICAgIGNvbnN0ICRkcm9wZG93bnMgPSAkc2xpZGVQYW5lbHNcbiAgICAgICAgICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5kcm9wZG93bik7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIHRodW1ibmFpbCBkcm9wZG93biBvcHRpb25zLlxuICAgICAgICAgICAgICAgIGNvbnN0ICR0aHVtYm5haWxPcHRpb25zID0gJGRyb3Bkb3duc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHNlbGVjdG9ycy5pbnB1dHMudGh1bWJuYWlsSW1hZ2VEcm9wZG93bilcbiAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAgICAgLmNsb25lKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGltYWdlIGRyb3Bkb3duIG9wdGlvbnMuXG4gICAgICAgICAgICAgICAgY29uc3QgJGltYWdlT3B0aW9ucyA9ICRkcm9wZG93bnNcbiAgICAgICAgICAgICAgICAgICAgLm5vdChzZWxlY3RvcnMuaW5wdXRzLnRodW1ibmFpbEltYWdlRHJvcGRvd24pXG4gICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgIC5jbG9uZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aHVtYm5haWwgb3B0aW9ucyBpbiBuZXcgc2xpZGUgcGFuZWwuXG4gICAgICAgICAgICAgICAgJHNsaWRlUGFuZWxcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy50aHVtYm5haWxJbWFnZURyb3Bkb3duKVxuICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCR0aHVtYm5haWxPcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudmFsKCcnKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgaW1hZ2Ugb3B0aW9ucyBpbiBuZXcgc2xpZGUgcGFuZWwuXG4gICAgICAgICAgICAgICAgJHNsaWRlUGFuZWxcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5kcm9wZG93bilcbiAgICAgICAgICAgICAgICAgICAgLm5vdChzZWxlY3RvcnMuaW5wdXRzLnRodW1ibmFpbEltYWdlRHJvcGRvd24pXG4gICAgICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGltYWdlT3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnZhbCgnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBuZXcgc2xpZGUgcGFuZWwgZWxlbWVudCB0byB0YWIgYm9keSB3aXRoIGZhZGUgZWZmZWN0LlxuICAgICAgICAgICAgJHNsaWRlUGFuZWxcbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLnByZXBlbmRUbygkdGFiQm9keSlcbiAgICAgICAgICAgICAgICAuZmFkZUluKCk7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgd2lkZ2V0cyBhbmQgZXh0ZW5zaW9ucyBvbiB0aGUgbmV3IHNsaWRlIHBhbmVsIGVsZW1lbnQuXG4gICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJHNsaWRlUGFuZWwpO1xuICAgICAgICAgICAgZ3guZXh0ZW5zaW9ucy5pbml0KCRzbGlkZVBhbmVsKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgdG8gc2hvdyB0aGUgcmlnaHQgYWN0aW9uIGljb25zLlxuICAgICAgICAgICAgJHNsaWRlUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZCgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGNoYW5nZSwgdG8gbWFrZSBwcm9tcHQgb24gcGFnZSB1bmxvYWQuXG4gICAgICAgICAgICBfcmVnaXN0ZXJDaGFuZ2UoKTtcblxuICAgICAgICAgICAgLy8gVG9nZ2xlIHN1Ym1pdCBidXR0b25zLlxuICAgICAgICAgICAgdG9nZ2xlU3VibWl0QnV0dG9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNvbmZpcm1hdGlvbiBidXR0b24gY2xpY2sgZXZlbnQgaW4gdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkbW9kYWwgRGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbCBlbGVtZW50LlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHNsaWRlUGFuZWwgU2xpZGUgcGFuZWwgZWxlbWVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkRlbGV0ZUNvbmZpcm1hdGlvbkJ1dHRvbkNsaWNrKCRtb2RhbCwgJHNsaWRlUGFuZWwpIHtcbiAgICAgICAgICAgIC8vIEhpZGUgbW9kYWwuXG4gICAgICAgICAgICAkbW9kYWwubW9kYWwoJ2hpZGUnKTtcblxuICAgICAgICAgICAgLy8gRmFkZSBvdXQgc2xpZGUgcGFuZWwgZWxlbWVudCBhbmQgdGhlbiByZW1vdmUgaXQuXG4gICAgICAgICAgICAkc2xpZGVQYW5lbC5mYWRlT3V0KDQwMCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBzbGlkZSBwYW5lbC5cbiAgICAgICAgICAgICAgICAkc2xpZGVQYW5lbC5yZW1vdmUoKVxuXG4gICAgICAgICAgICAgICAgLy8gVG9nZ2xlIHN1Ym1pdCBidXR0b25zLlxuICAgICAgICAgICAgICAgIHRvZ2dsZVN1Ym1pdEJ1dHRvbnMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBSZWdpc3RlciBjaGFuZ2UsIHRvIG1ha2UgcHJvbXB0IG9uIHBhZ2UgdW5sb2FkLlxuICAgICAgICAgICAgX3JlZ2lzdGVyQ2hhbmdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUga2V5LXVwIGV2ZW50IG9uIHRoZSBzbGlkZSB0aXRsZSBpbnB1dCBmaWVsZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRpdGxlS2V5dXAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFRpdGxlIGlucHV0IGZpZWxkLlxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBTbGlkZSBwYW5lbCB0aXRsZSBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJHRpdGxlID0gJGlucHV0XG4gICAgICAgICAgICAgICAgLnBhcmVudHMoc2VsZWN0b3JzLnNsaWRlUGFuZWwpXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLnNsaWRlUGFuZWxUaXRsZSk7XG5cbiAgICAgICAgICAgIC8vIFRyYW5zZmVyIGlucHV0IHZhbHVlIHRvIHNsaWRlIHBhbmVsIHRpdGxlLlxuICAgICAgICAgICAgJHRpdGxlLnRleHQoJGlucHV0LnZhbCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBtb3VzZS1lbnRlciBldmVudCBvbiBhIGNvbmZpZ3VyYXRpb24gcm93LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ29uZmlnUm93TW91c2VFbnRlcihldmVudCkge1xuICAgICAgICAgICAgLy8gQ29uZmlndXJhdGlvbiByb3cgZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgIC8vIEltYWdlIG1hcCBlZGl0IGljb24uXG4gICAgICAgICAgICBjb25zdCAkaW1hZ2VNYXBJY29uID0gJHJvdy5maW5kKHNlbGVjdG9ycy5pY29ucy5pbWFnZU1hcCk7XG5cbiAgICAgICAgICAgIC8vIEltYWdlIG1hcCBkYXRhIGNvbnRhaW5lciBsaXN0IGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkbGlzdCA9ICRyb3cuZmluZChzZWxlY3RvcnMuaW1hZ2VNYXBEYXRhTGlzdCk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBpbW1lZGlhdGVseSwgaWYgdGhlIGltYWdlIG1hcCBlZGl0IGljb24gZG9lcyBub3QgZXhpc3QuXG4gICAgICAgICAgICBpZiAoISRpbWFnZU1hcEljb24ubGVuZ3RoIHx8ICEkbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkbGlzdC5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRpbWFnZU1hcEljb24ucmVtb3ZlQ2xhc3MoJ2ZhLWV4dGVybmFsLWxpbmsnKS5hZGRDbGFzcygnZmEtZXh0ZXJuYWwtbGluay1zcXVhcmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGltYWdlTWFwSWNvbi5yZW1vdmVDbGFzcygnZmEtZXh0ZXJuYWwtbGluay1zcXVhcmUnKS5hZGRDbGFzcygnZmEtZXh0ZXJuYWwtbGluaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBzYXZlIGJ1dHRvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblN1Ym1pdFNhdmUoKSB7XG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5wYXJlbnRzKCdmb3JtJylcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignc3VibWl0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIHJlZnJlc2ggbGlzdCBpdGVtIGluIHRoZSBzdWJtaXQgYnV0dG9uIGdyb3VwLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uU3VibWl0UmVmcmVzaCgpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLnBhcmVudHMoJ2Zvcm0nKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdzdWJtaXQnLCB7cmVmcmVzaDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgYW4gaW1hZ2UgdG8gdGhlIGltYWdlIGRyb3Bkb3ducy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVOYW1lIE5hbWUgb2YgdGhlIHNlbGVjdGVkIGZpbGUuXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3RodW1ibmFpbEltYWdlc09ubHkgPSBmYWxzZV0gQXBwbHkgb24gdGh1bWJuYWlsIGltYWdlIGRyb3Bkb3ducyBvbmx5P1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FkZEltYWdlVG9Ecm9wZG93bnMoZmlsZU5hbWUsIHRodW1ibmFpbEltYWdlc09ubHkgPSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gU2VsZWN0IHNwZWNpZmljIGRyb3Bkb3ducy5cbiAgICAgICAgICAgIGNvbnN0ICRkcm9wZG93bnMgPSAkdGhpc1xuICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy5pbnB1dHMuZHJvcGRvd24pXG4gICAgICAgICAgICAgICAgW3RodW1ibmFpbEltYWdlc09ubHkgPyAnZmlsdGVyJyA6ICdub3QnXShzZWxlY3RvcnMuaW5wdXRzLnRodW1ibmFpbEltYWdlRHJvcGRvd24pO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGltYWdlIG9wdGlvbiBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJG9wdGlvbiA9ICQoJzxvcHRpb24+Jywge3ZhbHVlOiBmaWxlTmFtZSwgdGV4dDogZmlsZU5hbWUsIGNsYXNzOiBjbGFzc2VzLm5ld0ltYWdlfSk7XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCBuZXcgb3B0aW9ucyB0byBkcm9wZG93bnMuXG4gICAgICAgICAgICAkZHJvcGRvd25zLmFwcGVuZCgkb3B0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGVzIGFuIGltYWdlIGZyb20gdGhlIGltYWdlIGRyb3Bkb3ducy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVOYW1lIE5hbWUgb2YgdGhlIHNlbGVjdGVkIGZpbGUuXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3RodW1ibmFpbEltYWdlc09ubHkgPSBmYWxzZV0gQXBwbHkgb24gdGh1bWJuYWlsIGltYWdlIGRyb3Bkb3ducyBvbmx5P1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2RlbGV0ZUltYWdlRnJvbURyb3Bkb3ducyhmaWxlTmFtZSwgdGh1bWJuYWlsSW1hZ2VzT25seSA9IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBTZWxlY3QgYWxsIGRyb3Bkb3ducy5cbiAgICAgICAgICAgIGNvbnN0ICRkcm9wZG93bnMgPSAkdGhpc1xuICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy5pbnB1dHMuZHJvcGRvd24pXG4gICAgICAgICAgICAgICAgW3RodW1ibmFpbEltYWdlc09ubHkgPyAnZmlsdGVyJyA6ICdub3QnXShzZWxlY3RvcnMuaW5wdXRzLnRodW1ibmFpbEltYWdlRHJvcGRvd24pO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgaW1hZ2Ugb3B0aW9uIGZyb20gZWFjaCBkcm9wZG93bi5cbiAgICAgICAgICAgICRkcm9wZG93bnMuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBEcm9wZG93biBlbGVtZW50LlxuICAgICAgICAgICAgICAgIGNvbnN0ICRkcm9wZG93biA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgb3B0aW9uLlxuICAgICAgICAgICAgICAgICRkcm9wZG93bi5maW5kKGBbdmFsdWU9XCIke2ZpbGVOYW1lfVwiXWApLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRvIGRlZmF1bHQgdmFsdWUgaWYgdGhlcmUgYXJlIG5vIGltYWdlIGZpbGUgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICBpZiAoJGRyb3Bkb3duLmNoaWxkcmVuKCkubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UuXG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgb3IgZW5hYmxlcyB0aGUgc3VibWl0IGJ1dHRvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB0b2dnbGVTdWJtaXRCdXR0b25zKCkge1xuICAgICAgICAgICAgLy8gRW5hYmxlIHRoZSBzdWJtaXQgYnV0dG9ucz9cbiAgICAgICAgICAgIGxldCBkb0VuYWJsZVN1Ym1pdEJ1dHRvbnMgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBTbGlkZXMuXG4gICAgICAgICAgICBjb25zdCAkc2xpZGVzID0gJHRoaXMuZmluZChzZWxlY3RvcnMuc2xpZGVQYW5lbCk7XG5cbiAgICAgICAgICAgIC8vIERpc2FibGUgc3VibWl0IGJ1dHRvbnMsIGlmIHRoZXJlIGFyZSBubyBzbGlkZXMuXG4gICAgICAgICAgICBpZiAoISRzbGlkZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZG9FbmFibGVTdWJtaXRCdXR0b25zID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc2FibGUvRW5hYmxlIHN1Ym1pdCBidXR0b25zLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5zdWJtaXRcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5ub3QoJ3VsJylcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCAhZG9FbmFibGVTdWJtaXRCdXR0b25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIC8vIEF0dGFjaCBjbGljayBldmVudCBoYW5kbGVyIHRvIHNvcnQgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5zb3J0Lm9uKCdjbGljaycsIF9vblNvcnRCdXR0b25DbGljayk7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVycyB0byBzb3J0IGFjdGlvbnMsIHNsaWRlIHBhbmVsIGRlbGV0ZSBidXR0b24gYW5kIGlucHV0cyBmaWVsZHMuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignc29ydHN0YXJ0JywgX29uU29ydFN0YXJ0KVxuICAgICAgICAgICAgICAgIC5vbignc29ydHN0b3AnLCBfb25Tb3J0U3RvcClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgc2VsZWN0b3JzLmljb25zLmRlbGV0ZSwgX29uRGVsZXRlSWNvbkNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCBzZWxlY3RvcnMuaW5wdXRzLnRpdGxlLCBfb25UaXRsZUtleXVwKVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgc2VsZWN0b3JzLmlucHV0cy5maWxlLCBfb25JbWFnZUFkZClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgc2VsZWN0b3JzLmljb25zLnVwbG9hZCwgX29uVXBsb2FkSWNvbkNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBzZWxlY3RvcnMuaWNvbnMuaW1hZ2VEZWxldGUsIF9vbkltYWdlRGVsZXRlKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBzZWxlY3RvcnMuaWNvbnMuaW1hZ2VNYXAsIF9vbkltYWdlTWFwKVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgc2VsZWN0b3JzLmlucHV0cy5kcm9wZG93biwgX29uSW1hZ2VDaGFuZ2UpXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgc2VsZWN0b3JzLmNvbmZpZ3VyYXRpb25Sb3csIF9vbkNvbmZpZ1Jvd01vdXNlRW50ZXIpO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIHN1Ym1pdCBidXR0b25zLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5zdWJtaXRTYXZlLm9uKCdjbGljaycsIF9vblN1Ym1pdFNhdmUpO1xuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5zdWJtaXRSZWZyZXNoLm9uKCdjbGljaycsIF9vblN1Ym1pdFJlZnJlc2gpO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggY2xpY2sgZXZlbnQgaGFuZGxlciB0byBjcmVhdGUgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5jcmVhdGUub24oJ2NsaWNrJywgX29uQ3JlYXRlQnV0dG9uQ2xpY2spO1xuXG4gICAgICAgICAgICAvLyBBY3RpdmF0ZSBmaXJzdCB0YWIuXG4gICAgICAgICAgICBlbGVtZW50cy50YWJIZWFkZXJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gQWN0aXZhdGUgZmlyc3QgdGFiIGNvbnRlbnQuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy50YWJCb2R5KVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUgaW4nKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBkcm9wZG93biBjaGFuZ2UgZXZlbnQgdG8gaGlkZSB0aGUgcmVtb3ZlIGljb24sIGlmICdkbyBub3QgdXNlJyBpcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5kcm9wZG93bilcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJywgW2ZhbHNlXSk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG4iXX0=
