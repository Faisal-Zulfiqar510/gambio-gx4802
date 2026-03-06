'use strict';

/* --------------------------------------------------------------
 image_map.js 2016-11-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Controller Module For Slide Image Map Modal.
 *
 * Public methods:
 *  - 'show' shows the dropdown.
 */
gx.controllers.module('image_map', [jse.source + '/vendor/jquery-canvas-area-draw/jquery.canvasAreaDraw.min.js'], function () {
    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module element (modal element).
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * CSS Class Map
     *
     * @type {Object}
     */
    var classes = {
        // Hidden class.
        hidden: 'hidden',

        // New inserted option.
        newOption: 'new'
    };

    /**
     * CSS ID Map
     *
     * @type {Object}
     */
    var ids = {
        canvas: 'canvas'
    };

    /**
     * Element Map
     *
     * @type {Object}
     */
    var elements = {
        // Canvas extension element.
        extension: $this.find('#' + ids.canvas),

        // Container elements.
        containers: {
            // Image container.
            image: $this.find('.row.image'),

            // Canvas container.
            canvas: $this.find('.row.canvas'),

            // Action buttons container.
            actionButtons: $this.find('.row.actions')
        },

        // Form inputs.
        inputs: {
            // Link area dropdown.
            area: $this.find('#image-map-area'),

            // Link title.
            linkTitle: $this.find('#image-map-link-title'),

            // Link URL.
            linkUrl: $this.find('#image-map-link-url'),

            // Link target.
            linkTarget: $this.find('#image-map-link-target')
        },

        // Buttons.
        buttons: {
            // Close modal.
            close: $this.find('.btn.action-close'),

            // Create image area.
            create: $this.find('.btn.action-create'),

            // Abort edit.
            abort: $this.find('.btn.action-abort'),

            // Delete image area.
            delete: $this.find('.btn.action-delete'),

            // Apply image area changes.
            apply: $this.find('.btn.action-apply'),

            // Reset path.
            reset: $this.find('.btn-default.action-reset')
        },

        // Alerts
        alerts: {
            info: $this.find('.alert')
        }
    };

    /**
     * Value Map
     *
     * @type {Object}
     */
    var values = {
        // Empty string.
        empty: '',

        // 'Please select' value.
        nil: '',

        // Open in same window.
        sameWindowTarget: '_self'
    };

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Data container list.
     *
     * @type {jQuery|null}
     */
    var $list = null;

    /**
     * Slide image URL.
     *
     * @type {String|null}
     */
    var imageUrl = null;

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Fills the area dropdown with the data container list items.
     */
    function _fillAreaDropdown() {
        /**
         * Transfers the data from the data container list item to the area dropdown.
         *
         * @param {Number} index Iteration index.
         * @param {Element} element Iteration element.
         */
        var _transferToAreaDropdown = function _transferToAreaDropdown(index, element) {
            // Create new option element.
            var $option = $('<option>');

            // Set text content and value and append option to area dropdown.
            $option.text(element.dataset.linkTitle).val(index).appendTo(elements.inputs.area);
        };

        // Delete all children, except the first one.
        elements.inputs.area.children().not(':first').remove();

        // Transfer data container list items to area dropdown.
        $list.children().each(_transferToAreaDropdown);
    }

    /**
     * Switches to the default view.
     */
    function _switchToDefaultView() {
        // Image tag.
        var $image = $('<img src="' + imageUrl + '">');

        // Enable area dropdown.
        elements.inputs.area.prop('disabled', false);

        // Disable and empty the link title input.
        elements.inputs.linkTitle.prop('disabled', true).val(values.empty);

        // Disable and empty the link URL title input.
        elements.inputs.linkUrl.prop('disabled', true).val(values.empty);

        // Disable and empty the link target title input.
        elements.inputs.linkTarget.prop('disabled', true).val(values.sameWindowTarget);

        // Hide button container.
        elements.containers.actionButtons.addClass(classes.hidden);

        // Show and empty image container and append image.
        elements.containers.image.empty().removeClass(classes.hidden).append($image);

        // Hide canvas container.
        elements.containers.canvas.addClass(classes.hidden);

        // Empty extension element.
        elements.extension.empty();

        // Show create button.
        elements.buttons.create.removeClass(classes.hidden);

        // Hide reset button.
        elements.buttons.reset.addClass(classes.hidden);

        // Hide information alert-box.
        elements.alerts.info.addClass('hidden');
    }

    /**
     * Switches to the new image area view.
     */
    function _switchToNewView() {
        // Create new draw extension element.
        var $extension = $('<div\n\t\t\t\tid="' + ids.canvas + '"\n\t\t\t\tdata-gx-extension="canvas_area_draw"\n\t\t\t\tdata-canvas_area_draw-image-url="' + imageUrl + '">');

        // Enable link title input.
        elements.inputs.linkTitle.prop('disabled', false);

        // Enable link URL input.
        elements.inputs.linkUrl.prop('disabled', false);

        // Enable the link target input and set the value to 'self'.
        elements.inputs.linkTarget.prop('disabled', false).val(values.sameWindowTarget);

        // Disable the area dropdown.
        elements.inputs.area.prop('disabled', true);

        // Hide create button.
        elements.buttons.create.addClass(classes.hidden);

        // Show apply button.
        elements.buttons.apply.removeClass(classes.hidden);

        // Show abort button.
        elements.buttons.abort.removeClass(classes.hidden);

        // Hide delete button.
        elements.buttons.delete.addClass(classes.hidden);

        // Show action button container.
        elements.containers.actionButtons.removeClass(classes.hidden);

        // Hide image container.
        elements.containers.image.addClass(classes.hidden);

        // Show canvas container.
        elements.containers.canvas.removeClass(classes.hidden);

        // Remove existing canvas element.
        elements.extension.remove();

        // Add newly created canvas extension element.
        elements.containers.canvas.append($extension);

        // Assign new element reference.
        elements.extension = $extension;

        // Initialize extension.
        gx.extensions.init($extension);

        // Insert text into link title input and focus to that element.
        elements.inputs.linkTitle.val(jse.core.lang.translate('NEW_LINKED_AREA', 'sliders')).trigger('focus').trigger('select');

        // Show reset button.
        elements.buttons.reset.removeClass(classes.hidden);

        // Display information alert-box.
        elements.alerts.info.removeClass('hidden');
    }

    /**
     * Switches to the image area edit view.
     */
    function _switchToEditView() {
        // Index of the selected option (subtracted 1 to be compatible with data container list element).
        var optionIndex = elements.inputs.area.find('option:selected').index() - 1;

        // Corresponding list item in the data container list element.
        var $listItem = $list.children().eq(optionIndex);

        // Create new draw extension element.
        var $extension = $('<div\n\t\t\t\tid="' + ids.canvas + '"\n\t\t\t\tdata-gx-extension="canvas_area_draw"\n\t\t\t\tdata-canvas_area_draw-image-url="' + imageUrl + '"\n\t\t\t\tdata-canvas_area_draw-coordinates="' + $listItem.data('coordinates') + '"\n\t\t\t>');

        // Enable the link title input element and assign value.
        elements.inputs.linkTitle.prop('disabled', false).val($listItem.data('linkTitle'));

        // Enable the link URL input element and assign value.
        elements.inputs.linkUrl.prop('disabled', false).val($listItem.data('linkUrl'));

        // Enable the link target input element and assign value.
        elements.inputs.linkTarget.prop('disabled', false).val($listItem.data('linkTarget'));

        // Disable area dropdown.
        elements.inputs.area.prop('disabled', true);

        // Show apply button.
        elements.buttons.apply.removeClass(classes.hidden);

        // Show abort button.
        elements.buttons.abort.removeClass(classes.hidden);

        // Show delete button.
        elements.buttons.delete.removeClass(classes.hidden);

        // Hide create button.
        elements.buttons.create.addClass(classes.hidden);

        // Show action button container.
        elements.containers.actionButtons.removeClass(classes.hidden);

        // Hide image container.
        elements.containers.image.addClass(classes.hidden);

        // Show canvas container.
        elements.containers.canvas.removeClass(classes.hidden);

        // Remove existing canvas element.
        elements.extension.remove();

        // Add newly created canvas extension element.
        elements.containers.canvas.append($extension);

        // Assign new element reference.
        elements.extension = $extension;

        // Initialize extension.
        gx.extensions.init($extension);

        // Show reset button.
        elements.buttons.reset.removeClass(classes.hidden);

        // Display information alert-box.
        elements.alerts.info.removeClass('hidden');
    }

    /**
     * Handles the 'input' event on the link title input field.
     */
    function _onLinkTitleInput() {
        // Link title input value.
        var linkTitle = elements.inputs.linkTitle.val();

        // Transfer link title value to option text.
        elements.inputs.area.find('option:selected').text(linkTitle);
    }

    /**
     * Switches to a specific image map view, depending on the area dropdown selection.
     */
    function _onSwitchArea() {
        // Selected option element.
        var $selectedOption = elements.inputs.area.find('option:selected');

        // Is the 'please select' selected?
        var isDefaultValueSelected = !$selectedOption.index();

        // Is a newly added option selected?
        var isNewOptionSelected = $selectedOption.hasClass(classes.newOption);

        // If option is selected, then switch to default view.
        // Or if the a new option is selected, switch to new area view.
        // Otherwise switch to edit view.
        if (isDefaultValueSelected) {
            _switchToDefaultView();
        } else if (isNewOptionSelected) {
            _switchToNewView();
        } else {
            _switchToEditView();
        }
    }

    /**
     * Creates a new image area.
     */
    function _onCreate() {
        // Create new option with random value.
        var $option = $('<option>', {
            class: classes.newOption,
            value: Math.random() * Math.pow(10, 5) ^ 1,
            text: jse.core.lang.translate('NEW_LINKED_AREA', 'sliders')
        });

        // Add new option to input.
        elements.inputs.area.append($option);

        // Select new option in dropdown.
        elements.inputs.area.val($option.val());

        // Trigger change event in area dropdown to switch to image area.
        elements.inputs.area.trigger('change');
    }

    /**
     * Handles the 'click' event on the apply button.
     */
    function _onApply() {
        // Selected option.
        var $selected = elements.inputs.area.find('option:selected');

        // Index of the selected option (subtracted 1 to be compatible with data container list element).
        var optionIndex = $selected.index() - 1;

        // Is the image area new?
        var isNewImageArea = $selected.hasClass(classes.newOption);

        // Image map coordinates.
        var coordinates = elements.extension.find(':hidden').val();

        // Create new list item element.
        var $listItem = $('<li\n\t\t\t\tdata-id="0"\n\t\t\t\tdata-link-title="' + elements.inputs.linkTitle.val() + '"\n\t\t\t\tdata-link-url="' + elements.inputs.linkUrl.val() + '"\n\t\t\t\tdata-link-target="' + elements.inputs.linkTarget.val() + '"\n\t\t\t\tdata-coordinates="' + coordinates + '"\n\t\t\t>');

        // Trimmed link title value.
        var linkTitle = elements.inputs.linkTitle.val().trim();

        // Abort and show modal, if link title or coordinates are empty.
        if (!coordinates || !linkTitle) {
            jse.libs.modal.showMessage(jse.core.lang.translate('MISSING_PATH_OR_LINK_TITLE_MODAL_TITLE', 'sliders'), jse.core.lang.translate('MISSING_PATH_OR_LINK_TITLE_MODAL_TEXT', 'sliders'));

            return;
        }

        // Add list item, if the selected image area is new.
        // Otherwise replace the already listed item.
        if (isNewImageArea) {
            // Remove new option class.
            $selected.removeClass(classes.newOption);

            // Add list item to data container list element.
            $list.append($listItem);
        } else {
            // Replace data container list item with created one.
            $list.children().eq(optionIndex).replaceWith($listItem);
        }

        // Select 'please select' dropdown item.
        elements.inputs.area.val(values.nil);

        // Trigger 'change' event to get to the default view.
        elements.inputs.area.trigger('change');
    }

    /**
     * Handles the 'click' event on the abort button.
     */
    function _onAbort() {
        // Selected option.
        var $selected = elements.inputs.area.find('option:selected');

        // Is the image area new?
        var isNewImageArea = $selected.hasClass(classes.newOption);

        // Remove option from area dropdown, if the selected image area is new.
        // Otherwise the area dropdown will be refilled.
        if (isNewImageArea) {
            $selected.remove();
        } else {
            _fillAreaDropdown();
        }

        // Select 'please select' dropdown item.
        elements.inputs.area.val(values.nil);

        // Trigger 'change' event to get to the default view.
        elements.inputs.area.trigger('change');
    }

    /**
     * Handles the 'click' event on the delete button.
     */
    function _onDelete() {
        // Selected option.
        var $selected = elements.inputs.area.find('option:selected');

        // Index of the selected option (subtracted 1 to be compatible with data container list element).
        var optionIndex = $selected.index() - 1;

        // Delete data container list item.
        $list.children().eq(optionIndex).remove();

        // Syncronize area dropdown.
        _fillAreaDropdown();

        // Select 'please select' dropdown item.
        elements.inputs.area.val(values.nil);

        // Trigger 'change' event to get to the default view.
        elements.inputs.area.trigger('change');
    }

    /**
     * Handles the 'click' event on the reset button.
     */
    function _onReset() {
        // Trigger the 'reset' event to clear the path.
        elements.extension.trigger('reset');
    }

    /**
     * Handles the 'show' event.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {jQuery} $listParameter Data container list element.
     * @param {String} imageUrlPath URL to slide image.
     */
    function _onShow(event, $listParameter, imageUrlPath) {
        // Show modal.
        $this.modal('show');

        // Assign data container list element value.
        $list = $listParameter;

        // Assign image URL value.
        imageUrl = imageUrlPath;
    }

    /**
     * Handles the 'click' event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onClick(event) {
        // Check, whether the create button is clicked.
        if (elements.buttons.create.is(event.target)) {
            _onCreate();
            return;
        }

        // Check, whether the apply button is clicked.
        if (elements.buttons.apply.is(event.target)) {
            _onApply();
            return;
        }

        // Check, whether the abort button is clicked.
        if (elements.buttons.abort.is(event.target)) {
            _onAbort();
            return;
        }

        // Check, whether the delete button is clicked.
        if (elements.buttons.delete.is(event.target)) {
            _onDelete();
            return;
        }

        // Check, whether the reset button is clicked.
        if (elements.buttons.reset.is(event.target)) {
            _onReset();
            return;
        }
    }

    /**
     * Handles the 'change' event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onChange(event) {
        // Check, whether the area dropdown is changed.
        if (elements.inputs.area.is(event.target)) {
            _onSwitchArea();
        }
    }

    /**
     * Handles the modal shown event, which is triggered by the bootstrap modal plugin.
     */
    function _onModalShown() {
        // Fill the area dropdown with the values from the data container list.
        _fillAreaDropdown();

        // Select 'please select' dropdown item and trigger 'change' event to get to the default view.
        elements.inputs.area.val(values.nil).trigger('change');
    }

    /**
     * Handles the modal hidden event, which is triggered by the bootstrap modal plugin.
     */
    function _onModalHidden() {
        // Select 'please select' dropdown item and trigger 'change' event to get to the default view.
        elements.inputs.area.val(values.nil).trigger('change');
    }

    /**
     * Handles the 'input' event.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onInput(event) {
        // Check, whether the link title is the changed element.
        if (elements.inputs.linkTitle.is(event.target)) {
            _onLinkTitleInput();
        }
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Bind event handlers.
        $this.on('click', _onClick).on('change', _onChange).on('shown.bs.modal', _onModalShown).on('hidden.bs.modal', _onModalHidden).on('show', _onShow).on('input', _onInput);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcnMvZGV0YWlscy9tb2RhbHMvaW1hZ2VfbWFwLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCIkdGhpcyIsIiQiLCJjbGFzc2VzIiwiaGlkZGVuIiwibmV3T3B0aW9uIiwiaWRzIiwiY2FudmFzIiwiZWxlbWVudHMiLCJleHRlbnNpb24iLCJmaW5kIiwiY29udGFpbmVycyIsImltYWdlIiwiYWN0aW9uQnV0dG9ucyIsImlucHV0cyIsImFyZWEiLCJsaW5rVGl0bGUiLCJsaW5rVXJsIiwibGlua1RhcmdldCIsImJ1dHRvbnMiLCJjbG9zZSIsImNyZWF0ZSIsImFib3J0IiwiZGVsZXRlIiwiYXBwbHkiLCJyZXNldCIsImFsZXJ0cyIsImluZm8iLCJ2YWx1ZXMiLCJlbXB0eSIsIm5pbCIsInNhbWVXaW5kb3dUYXJnZXQiLCIkbGlzdCIsImltYWdlVXJsIiwiX2ZpbGxBcmVhRHJvcGRvd24iLCJfdHJhbnNmZXJUb0FyZWFEcm9wZG93biIsImluZGV4IiwiZWxlbWVudCIsIiRvcHRpb24iLCJ0ZXh0IiwiZGF0YXNldCIsInZhbCIsImFwcGVuZFRvIiwiY2hpbGRyZW4iLCJub3QiLCJyZW1vdmUiLCJlYWNoIiwiX3N3aXRjaFRvRGVmYXVsdFZpZXciLCIkaW1hZ2UiLCJwcm9wIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImFwcGVuZCIsIl9zd2l0Y2hUb05ld1ZpZXciLCIkZXh0ZW5zaW9uIiwiZXh0ZW5zaW9ucyIsImluaXQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInRyaWdnZXIiLCJfc3dpdGNoVG9FZGl0VmlldyIsIm9wdGlvbkluZGV4IiwiJGxpc3RJdGVtIiwiZXEiLCJkYXRhIiwiX29uTGlua1RpdGxlSW5wdXQiLCJfb25Td2l0Y2hBcmVhIiwiJHNlbGVjdGVkT3B0aW9uIiwiaXNEZWZhdWx0VmFsdWVTZWxlY3RlZCIsImlzTmV3T3B0aW9uU2VsZWN0ZWQiLCJoYXNDbGFzcyIsIl9vbkNyZWF0ZSIsImNsYXNzIiwidmFsdWUiLCJNYXRoIiwicmFuZG9tIiwicG93IiwiX29uQXBwbHkiLCIkc2VsZWN0ZWQiLCJpc05ld0ltYWdlQXJlYSIsImNvb3JkaW5hdGVzIiwidHJpbSIsImxpYnMiLCJtb2RhbCIsInNob3dNZXNzYWdlIiwicmVwbGFjZVdpdGgiLCJfb25BYm9ydCIsIl9vbkRlbGV0ZSIsIl9vblJlc2V0IiwiX29uU2hvdyIsImV2ZW50IiwiJGxpc3RQYXJhbWV0ZXIiLCJpbWFnZVVybFBhdGgiLCJfb25DbGljayIsImlzIiwidGFyZ2V0IiwiX29uQ2hhbmdlIiwiX29uTW9kYWxTaG93biIsIl9vbk1vZGFsSGlkZGVuIiwiX29uSW5wdXQiLCJvbiIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7O0FBTUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFdBREosRUFHSSxDQUFJQyxJQUFJQyxNQUFSLGtFQUhKLEVBS0ksWUFBWTtBQUNSOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVTtBQUNaO0FBQ0FDLGdCQUFRLFFBRkk7O0FBSVo7QUFDQUMsbUJBQVc7QUFMQyxLQUFoQjs7QUFRQTs7Ozs7QUFLQSxRQUFNQyxNQUFNO0FBQ1JDLGdCQUFRO0FBREEsS0FBWjs7QUFJQTs7Ozs7QUFLQSxRQUFNQyxXQUFXO0FBQ2I7QUFDQUMsbUJBQVdSLE1BQU1TLElBQU4sT0FBZUosSUFBSUMsTUFBbkIsQ0FGRTs7QUFJYjtBQUNBSSxvQkFBWTtBQUNSO0FBQ0FDLG1CQUFPWCxNQUFNUyxJQUFOLENBQVcsWUFBWCxDQUZDOztBQUlSO0FBQ0FILG9CQUFRTixNQUFNUyxJQUFOLENBQVcsYUFBWCxDQUxBOztBQU9SO0FBQ0FHLDJCQUFlWixNQUFNUyxJQUFOLENBQVcsY0FBWDtBQVJQLFNBTEM7O0FBZ0JiO0FBQ0FJLGdCQUFRO0FBQ0o7QUFDQUMs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ckI7QUFDQWhFOztBQUVBO0FBQ0ExQixpQkFBU00sTUFBVCxDQUFnQkMsSUFBaEIsQ0FDSzBCLEdBREwsQ0FDU2IsT0FBT0UsR0FEaEIsRUFFSzhCLE9BRkwsQ0FFYSxRQUZiO0FBR0g7O0FBRUQ7OztBQUdBLGFBQVN1QyxjQUFULEdBQTBCO0FBQ3RCO0FBQ0EzRixpQkFBU00sTUFBVCxDQUFnQkMsSUFBaEIsQ0FDSzBCLEdBREwsQ0FDU2IsT0FBT0UsR0FEaEIsRUFFSzhCLE9BRkwsQ0FFYSxRQUZiO0FBR0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU3dDLFFBQVQsQ0FBa0JULEtBQWxCLEVBQXlCO0FBQ3JCO0FBQ0EsWUFBSW5GLFNBQVNNLE1BQVQsQ0FBZ0JFLFNBQWhCLENBQTBCK0UsRUFBMUIsQ0FBNkJKLE1BQU1LLE1BQW5DLENBQUosRUFBZ0Q7QUFDNUM5QjtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOztBQUVBcEUsV0FBTzBELElBQVAsR0FBYyxnQkFBUTtBQUNsQjtBQUNBdkQsY0FDS29HLEVBREwsQ0FDUSxPQURSLEVBQ2lCUCxRQURqQixFQUVLTyxFQUZMLENBRVEsUUFGUixFQUVrQkosU0FGbEIsRUFHS0ksRUFITCxDQUdRLGdCQUhSLEVBRzBCSCxhQUgxQixFQUlLRyxFQUpMLENBSVEsaUJBSlIsRUFJMkJGLGNBSjNCLEVBS0tFLEVBTEwsQ0FLUSxNQUxSLEVBS2dCWCxPQUxoQixFQU1LVyxFQU5MLENBTVEsT0FOUixFQU1pQkQsUUFOakI7O0FBUUE7QUFDQUU7QUFDSCxLQVpEOztBQWNBLFdBQU94RyxNQUFQO0FBQ0gsQ0F4ckJMIiwiZmlsZSI6InNsaWRlcnMvZGV0YWlscy9tb2RhbHMvaW1hZ2VfbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbWFnZV9tYXAuanMgMjAxNi0xMS0yMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogQ29udHJvbGxlciBNb2R1bGUgRm9yIFNsaWRlIEltYWdlIE1hcCBNb2RhbC5cbiAqXG4gKiBQdWJsaWMgbWV0aG9kczpcbiAqICAtICdzaG93JyBzaG93cyB0aGUgZHJvcGRvd24uXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnaW1hZ2VfbWFwJyxcblxuICAgIFtgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LWNhbnZhcy1hcmVhLWRyYXcvanF1ZXJ5LmNhbnZhc0FyZWFEcmF3Lm1pbi5qc2BdLFxuXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBlbGVtZW50IChtb2RhbCBlbGVtZW50KS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ1NTIENsYXNzIE1hcFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAgICAgICAgIC8vIEhpZGRlbiBjbGFzcy5cbiAgICAgICAgICAgIGhpZGRlbjogJ2hpZGRlbicsXG5cbiAgICAgICAgICAgIC8vIE5ldyBpbnNlcnRlZCBvcHRpb24uXG4gICAgICAgICAgICBuZXdPcHRpb246ICduZXcnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENTUyBJRCBNYXBcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGlkcyA9IHtcbiAgICAgICAgICAgIGNhbnZhczogJ2NhbnZhcydcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWxlbWVudCBNYXBcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0ge1xuICAgICAgICAgICAgLy8gQ2FudmFzIGV4dGVuc2lvbiBlbGVtZW50LlxuICAgICAgICAgICAgZXh0ZW5zaW9uOiAkdGhpcy5maW5kKGAjJHtpZHMuY2FudmFzfWApLFxuXG4gICAgICAgICAgICAvLyBDb250YWluZXIgZWxlbWVudHMuXG4gICAgICAgICAgICBjb250YWluZXJzOiB7XG4gICAgICAgICAgICAgICAgLy8gSW1hZ2UgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgIGltYWdlOiAkdGhpcy5maW5kKCcucm93LmltYWdlJyksXG5cbiAgICAgICAgICAgICAgICAvLyBDYW52YXMgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgIGNhbnZhczogJHRoaXMuZmluZCgnLnJvdy5jYW52YXMnKSxcblxuICAgICAgICAgICAgICAgIC8vIEFjdGlvbiBidXR0b25zIGNvbnRhaW5lci5cbiAgICAgICAgICAgICAgICBhY3Rpb25CdXR0b25zOiAkdGhpcy5maW5kKCcucm93LmFjdGlvbnMnKVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gRm9ybSBpbnB1dHMuXG4gICAgICAgICAgICBpbnB1dHM6IHtcbiAgICAgICAgICAgICAgICAvLyBMaW5rIGFyZWEgZHJvcGRvd24uXG4gICAgICAgICAgICAgICAgYXJlYTogJHRoaXMuZmluZCgnI2ltYWdlLW1hcC1hcmVhJyksXG5cbiAgICAgICAgICAgICAgICAvLyBMaW5rIHRpdGxlLlxuICAgICAgICAgICAgICAgIGxpbmtUaXRsZTogJHRoaXMuZmluZCgnI2ltYWdlLW1hcC1saW5rLXRpdGxlJyksXG5cbiAgICAgICAgICAgICAgICAvLyBMaW5rIFVSTC5cbiAgICAgICAgICAgICAgICBsaW5rVXJsOiAkdGhpcy5maW5kKCcjaW1hZ2UtbWFwLWxpbmstdXJsJyksXG5cbiAgICAgICAgICAgICAgICAvLyBMaW5rIHRhcmdldC5cbiAgICAgICAgICAgICAgICBsaW5rVGFyZ2V0OiAkdGhpcy5maW5kKCcjaW1hZ2UtbWFwLWxpbmstdGFyZ2V0JylcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIEJ1dHRvbnMuXG4gICAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICAgICAgLy8gQ2xvc2UgbW9kYWwuXG4gICAgICAgICAgICAgICAgY2xvc2U6ICR0aGlzLmZpbmQoJy5idG4uYWN0aW9uLWNsb3NlJyksXG5cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgaW1hZ2UgYXJlYS5cbiAgICAgICAgICAgICAgICBjcmVhdGU6ICR0aGlzLmZpbmQoJy5idG4uYWN0aW9uLWNyZWF0ZScpLFxuXG4gICAgICAgICAgICAgICAgLy8gQWJvcnQgZWRpdC5cbiAgICAgICAgICAgICAgICBhYm9ydDogJHRoaXMuZmluZCgnLmJ0bi5hY3Rpb24tYWJvcnQnKSxcblxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBpbWFnZSBhcmVhLlxuICAgICAgICAgICAgICAgIGRlbGV0ZTogJHRoaXMuZmluZCgnLmJ0bi5hY3Rpb24tZGVsZXRlJyksXG5cbiAgICAgICAgICAgICAgICAvLyBBcHBseSBpbWFnZSBhcmVhIGNoYW5nZXMuXG4gICAgICAgICAgICAgICAgYXBwbHk6ICR0aGlzLmZpbmQoJy5idG4uYWN0aW9uLWFwcGx5JyksXG5cbiAgICAgICAgICAgICAgICAvLyBSZXNldCBwYXRoLlxuICAgICAgICAgICAgICAgIHJlc2V0OiAkdGhpcy5maW5kKCcuYnRuLWRlZmF1bHQuYWN0aW9uLXJlc2V0JylcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIEFsZXJ0c1xuICAgICAgICAgICAgYWxlcnRzOiB7XG4gICAgICAgICAgICAgICAgaW5mbzogJHRoaXMuZmluZCgnLmFsZXJ0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVmFsdWUgTWFwXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSB7XG4gICAgICAgICAgICAvLyBFbXB0eSBzdHJpbmcuXG4gICAgICAgICAgICBlbXB0eTogJycsXG5cbiAgICAgICAgICAgIC8vICdQbGVhc2Ugc2VsZWN0JyB2YWx1ZS5cbiAgICAgICAgICAgIG5pbDogJycsXG5cbiAgICAgICAgICAgIC8vIE9wZW4gaW4gc2FtZSB3aW5kb3cuXG4gICAgICAgICAgICBzYW1lV2luZG93VGFyZ2V0OiAnX3NlbGYnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERhdGEgY29udGFpbmVyIGxpc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl8bnVsbH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCAkbGlzdCA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNsaWRlIGltYWdlIFVSTC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge1N0cmluZ3xudWxsfVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGltYWdlVXJsID0gbnVsbDtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsbHMgdGhlIGFyZWEgZHJvcGRvd24gd2l0aCB0aGUgZGF0YSBjb250YWluZXIgbGlzdCBpdGVtcy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9maWxsQXJlYURyb3Bkb3duKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUcmFuc2ZlcnMgdGhlIGRhdGEgZnJvbSB0aGUgZGF0YSBjb250YWluZXIgbGlzdCBpdGVtIHRvIHRoZSBhcmVhIGRyb3Bkb3duLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBJdGVyYXRpb24gaW5kZXguXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgSXRlcmF0aW9uIGVsZW1lbnQuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IF90cmFuc2ZlclRvQXJlYURyb3Bkb3duID0gKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBvcHRpb24gZWxlbWVudC5cbiAgICAgICAgICAgICAgICBjb25zdCAkb3B0aW9uID0gJCgnPG9wdGlvbj4nKTtcblxuICAgICAgICAgICAgICAgIC8vIFNldCB0ZXh0IGNvbnRlbnQgYW5kIHZhbHVlIGFuZCBhcHBlbmQgb3B0aW9uIHRvIGFyZWEgZHJvcGRvd24uXG4gICAgICAgICAgICAgICAgJG9wdGlvblxuICAgICAgICAgICAgICAgICAgICAudGV4dChlbGVtZW50LmRhdGFzZXQubGlua1RpdGxlKVxuICAgICAgICAgICAgICAgICAgICAudmFsKGluZGV4KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZWxlbWVudHMuaW5wdXRzLmFyZWEpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRGVsZXRlIGFsbCBjaGlsZHJlbiwgZXhjZXB0IHRoZSBmaXJzdCBvbmUuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMuYXJlYVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgLm5vdCgnOmZpcnN0JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIFRyYW5zZmVyIGRhdGEgY29udGFpbmVyIGxpc3QgaXRlbXMgdG8gYXJlYSBkcm9wZG93bi5cbiAgICAgICAgICAgICRsaXN0LmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAuZWFjaChfdHJhbnNmZXJUb0FyZWFEcm9wZG93bik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3dpdGNoZXMgdG8gdGhlIGRlZmF1bHQgdmlldy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zd2l0Y2hUb0RlZmF1bHRWaWV3KCkge1xuICAgICAgICAgICAgLy8gSW1hZ2UgdGFnLlxuICAgICAgICAgICAgY29uc3QgJGltYWdlID0gJChgPGltZyBzcmM9XCIke2ltYWdlVXJsfVwiPmApO1xuXG4gICAgICAgICAgICAvLyBFbmFibGUgYXJlYSBkcm9wZG93bi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhXG4gICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBEaXNhYmxlIGFuZCBlbXB0eSB0aGUgbGluayB0aXRsZSBpbnB1dC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5saW5rVGl0bGVcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgIC52YWwodmFsdWVzLmVtcHR5KTtcblxuICAgICAgICAgICAgLy8gRGlzYWJsZSBhbmQgZW1wdHkgdGhlIGxpbmsgVVJMIHRpdGxlIGlucHV0LlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRzLmxpbmtVcmxcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgIC52YWwodmFsdWVzLmVtcHR5KTtcblxuICAgICAgICAgICAgLy8gRGlzYWJsZSBhbmQgZW1wdHkgdGhlIGxpbmsgdGFyZ2V0IHRpdGxlIGlucHV0LlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRzLmxpbmtUYXJnZXRcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgIC52YWwodmFsdWVzLnNhbWVXaW5kb3dUYXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGJ1dHRvbiBjb250YWluZXIuXG4gICAgICAgICAgICBlbGVtZW50cy5jb250YWluZXJzLmFjdGlvbkJ1dHRvbnNcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBTaG93IGFuZCBlbXB0eSBpbWFnZSBjb250YWluZXIgYW5kIGFwcGVuZCBpbWFnZS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmNvbnRhaW5lcnMuaW1hZ2VcbiAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc2VzLmhpZGRlbilcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCRpbWFnZSk7XG5cbiAgICAgICAgICAgIC8vIEhpZGUgY2FudmFzIGNvbnRhaW5lci5cbiAgICAgICAgICAgIGVsZW1lbnRzLmNvbnRhaW5lcnMuY2FudmFzXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKGNsYXNzZXMuaGlkZGVuKTtcblxuICAgICAgICAgICAgLy8gRW1wdHkgZXh0ZW5zaW9uIGVsZW1lbnQuXG4gICAgICAgICAgICBlbGVtZW50cy5leHRlbnNpb24uZW1wdHkoKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBjcmVhdGUgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5jcmVhdGVcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIHJlc2V0IGJ1dHRvbi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmJ1dHRvbnMucmVzZXRcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGluZm9ybWF0aW9uIGFsZXJ0LWJveC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmFsZXJ0cy5pbmZvLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTd2l0Y2hlcyB0byB0aGUgbmV3IGltYWdlIGFyZWEgdmlldy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zd2l0Y2hUb05ld1ZpZXcoKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGRyYXcgZXh0ZW5zaW9uIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkZXh0ZW5zaW9uID0gJChgPGRpdlxuXHRcdFx0XHRpZD1cIiR7aWRzLmNhbnZhc31cIlxuXHRcdFx0XHRkYXRhLWd4LWV4dGVuc2lvbj1cImNhbnZhc19hcmVhX2RyYXdcIlxuXHRcdFx0XHRkYXRhLWNhbnZhc19hcmVhX2RyYXctaW1hZ2UtdXJsPVwiJHtpbWFnZVVybH1cIj5gKTtcblxuICAgICAgICAgICAgLy8gRW5hYmxlIGxpbmsgdGl0bGUgaW5wdXQuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMubGlua1RpdGxlXG4gICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBFbmFibGUgbGluayBVUkwgaW5wdXQuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMubGlua1VybFxuICAgICAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gRW5hYmxlIHRoZSBsaW5rIHRhcmdldCBpbnB1dCBhbmQgc2V0IHRoZSB2YWx1ZSB0byAnc2VsZicuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMubGlua1RhcmdldFxuICAgICAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgIC52YWwodmFsdWVzLnNhbWVXaW5kb3dUYXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBEaXNhYmxlIHRoZSBhcmVhIGRyb3Bkb3duLlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRzLmFyZWFcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBjcmVhdGUgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5jcmVhdGVcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBTaG93IGFwcGx5IGJ1dHRvbi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmJ1dHRvbnMuYXBwbHlcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBTaG93IGFib3J0IGJ1dHRvbi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmJ1dHRvbnMuYWJvcnRcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGRlbGV0ZSBidXR0b24uXG4gICAgICAgICAgICBlbGVtZW50cy5idXR0b25zLmRlbGV0ZVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhjbGFzc2VzLmhpZGRlbik7XG5cbiAgICAgICAgICAgIC8vIFNob3cgYWN0aW9uIGJ1dHRvbiBjb250YWluZXIuXG4gICAgICAgICAgICBlbGVtZW50cy5jb250YWluZXJzLmFjdGlvbkJ1dHRvbnNcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGltYWdlIGNvbnRhaW5lci5cbiAgICAgICAgICAgIGVsZW1lbnRzLmNvbnRhaW5lcnMuaW1hZ2VcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBTaG93IGNhbnZhcyBjb250YWluZXIuXG4gICAgICAgICAgICBlbGVtZW50cy5jb250YWluZXJzLmNhbnZhc1xuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc2VzLmhpZGRlbik7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBleGlzdGluZyBjYW52YXMgZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmV4dGVuc2lvblxuICAgICAgICAgICAgICAgIC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgLy8gQWRkIG5ld2x5IGNyZWF0ZWQgY2FudmFzIGV4dGVuc2lvbiBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbWVudHMuY29udGFpbmVycy5jYW52YXNcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCRleHRlbnNpb24pO1xuXG4gICAgICAgICAgICAvLyBBc3NpZ24gbmV3IGVsZW1lbnQgcmVmZXJlbmNlLlxuICAgICAgICAgICAgZWxlbWVudHMuZXh0ZW5zaW9uID0gJGV4dGVuc2lvbjtcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSBleHRlbnNpb24uXG4gICAgICAgICAgICBneC5leHRlbnNpb25zLmluaXQoJGV4dGVuc2lvbik7XG5cbiAgICAgICAgICAgIC8vIEluc2VydCB0ZXh0IGludG8gbGluayB0aXRsZSBpbnB1dCBhbmQgZm9jdXMgdG8gdGhhdCBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRzLmxpbmtUaXRsZVxuICAgICAgICAgICAgICAgIC52YWwoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ05FV19MSU5LRURfQVJFQScsICdzbGlkZXJzJykpXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJylcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignc2VsZWN0Jyk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgcmVzZXQgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5yZXNldFxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc2VzLmhpZGRlbik7XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgaW5mb3JtYXRpb24gYWxlcnQtYm94LlxuICAgICAgICAgICAgZWxlbWVudHMuYWxlcnRzLmluZm8ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN3aXRjaGVzIHRvIHRoZSBpbWFnZSBhcmVhIGVkaXQgdmlldy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zd2l0Y2hUb0VkaXRWaWV3KCkge1xuICAgICAgICAgICAgLy8gSW5kZXggb2YgdGhlIHNlbGVjdGVkIG9wdGlvbiAoc3VidHJhY3RlZCAxIHRvIGJlIGNvbXBhdGlibGUgd2l0aCBkYXRhIGNvbnRhaW5lciBsaXN0IGVsZW1lbnQpLlxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uSW5kZXggPSBlbGVtZW50cy5pbnB1dHMuYXJlYS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5pbmRleCgpIC0gMTtcblxuICAgICAgICAgICAgLy8gQ29ycmVzcG9uZGluZyBsaXN0IGl0ZW0gaW4gdGhlIGRhdGEgY29udGFpbmVyIGxpc3QgZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRsaXN0SXRlbSA9ICRsaXN0XG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAuZXEob3B0aW9uSW5kZXgpO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGRyYXcgZXh0ZW5zaW9uIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkZXh0ZW5zaW9uID0gJChgPGRpdlxuXHRcdFx0XHRpZD1cIiR7aWRzLmNhbnZhc31cIlxuXHRcdFx0XHRkYXRhLWd4LWV4dGVuc2lvbj1cImNhbnZhc19hcmVhX2RyYXdcIlxuXHRcdFx0XHRkYXRhLWNhbnZhc19hcmVhX2RyYXctaW1hZ2UtdXJsPVwiJHtpbWFnZVVybH1cIlxuXHRcdFx0XHRkYXRhLWNhbnZhc19hcmVhX2RyYXctY29vcmRpbmF0ZXM9XCIkeyRsaXN0SXRlbS5kYXRhKCdjb29yZGluYXRlcycpfVwiXG5cdFx0XHQ+YCk7XG5cbiAgICAgICAgICAgIC8vIEVuYWJsZSB0aGUgbGluayB0aXRsZSBpbnB1dCBlbGVtZW50IGFuZCBhc3NpZ24gdmFsdWUuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMubGlua1RpdGxlXG4gICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgICAgICAgLnZhbCgkbGlzdEl0ZW0uZGF0YSgnbGlua1RpdGxlJykpO1xuXG4gICAgICAgICAgICAvLyBFbmFibGUgdGhlIGxpbmsgVVJMIGlucHV0IGVsZW1lbnQgYW5kIGFzc2lnbiB2YWx1ZS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5saW5rVXJsXG4gICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgICAgICAgLnZhbCgkbGlzdEl0ZW0uZGF0YSgnbGlua1VybCcpKTtcblxuICAgICAgICAgICAgLy8gRW5hYmxlIHRoZSBsaW5rIHRhcmdldCBpbnB1dCBlbGVtZW50IGFuZCBhc3NpZ24gdmFsdWUuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMubGlua1RhcmdldFxuICAgICAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgIC52YWwoJGxpc3RJdGVtLmRhdGEoJ2xpbmtUYXJnZXQnKSk7XG5cbiAgICAgICAgICAgIC8vIERpc2FibGUgYXJlYSBkcm9wZG93bi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhXG4gICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgYXBwbHkgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5hcHBseVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc2VzLmhpZGRlbik7XG5cbiAgICAgICAgICAgIC8vIFNob3cgYWJvcnQgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5hYm9ydFxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhjbGFzc2VzLmhpZGRlbik7XG5cbiAgICAgICAgICAgIC8vIFNob3cgZGVsZXRlIGJ1dHRvbi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmJ1dHRvbnMuZGVsZXRlXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGNsYXNzZXMuaGlkZGVuKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBjcmVhdGUgYnV0dG9uLlxuICAgICAgICAgICAgZWxlbWVudHMuYnV0dG9ucy5jcmVhdGVcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBTaG93IGFjdGlvbiBidXR0b24gY29udGFpbmVyLlxuICAgICAgICAgICAgZWxlbWVudHMuY29udGFpbmVycy5hY3Rpb25CdXR0b25zXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGNsYXNzZXMuaGlkZGVuKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBpbWFnZSBjb250YWluZXIuXG4gICAgICAgICAgICBlbGVtZW50cy5jb250YWluZXJzLmltYWdlXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKGNsYXNzZXMuaGlkZGVuKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBjYW52YXMgY29udGFpbmVyLlxuICAgICAgICAgICAgZWxlbWVudHMuY29udGFpbmVycy5jYW52YXNcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgZXhpc3RpbmcgY2FudmFzIGVsZW1lbnQuXG4gICAgICAgICAgICBlbGVtZW50cy5leHRlbnNpb25cbiAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBuZXdseSBjcmVhdGVkIGNhbnZhcyBleHRlbnNpb24gZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmNvbnRhaW5lcnMuY2FudmFzXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkZXh0ZW5zaW9uKTtcblxuICAgICAgICAgICAgLy8gQXNzaWduIG5ldyBlbGVtZW50IHJlZmVyZW5jZS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmV4dGVuc2lvbiA9ICRleHRlbnNpb247XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgZXh0ZW5zaW9uLlxuICAgICAgICAgICAgZ3guZXh0ZW5zaW9ucy5pbml0KCRleHRlbnNpb24pO1xuXG4gICAgICAgICAgICAvLyBTaG93IHJlc2V0IGJ1dHRvbi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmJ1dHRvbnMucmVzZXRcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoY2xhc3Nlcy5oaWRkZW4pO1xuXG4gICAgICAgICAgICAvLyBEaXNwbGF5IGluZm9ybWF0aW9uIGFsZXJ0LWJveC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmFsZXJ0cy5pbmZvLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSAnaW5wdXQnIGV2ZW50IG9uIHRoZSBsaW5rIHRpdGxlIGlucHV0IGZpZWxkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uTGlua1RpdGxlSW5wdXQoKSB7XG4gICAgICAgICAgICAvLyBMaW5rIHRpdGxlIGlucHV0IHZhbHVlLlxuICAgICAgICAgICAgY29uc3QgbGlua1RpdGxlID0gZWxlbWVudHMuaW5wdXRzLmxpbmtUaXRsZS52YWwoKTtcblxuICAgICAgICAgICAgLy8gVHJhbnNmZXIgbGluayB0aXRsZSB2YWx1ZSB0byBvcHRpb24gdGV4dC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQobGlua1RpdGxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTd2l0Y2hlcyB0byBhIHNwZWNpZmljIGltYWdlIG1hcCB2aWV3LCBkZXBlbmRpbmcgb24gdGhlIGFyZWEgZHJvcGRvd24gc2VsZWN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uU3dpdGNoQXJlYSgpIHtcbiAgICAgICAgICAgIC8vIFNlbGVjdGVkIG9wdGlvbiBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdGVkT3B0aW9uID0gZWxlbWVudHMuaW5wdXRzLmFyZWEuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgIC8vIElzIHRoZSAncGxlYXNlIHNlbGVjdCcgc2VsZWN0ZWQ/XG4gICAgICAgICAgICBjb25zdCBpc0RlZmF1bHRWYWx1ZVNlbGVjdGVkID0gISRzZWxlY3RlZE9wdGlvbi5pbmRleCgpO1xuXG4gICAgICAgICAgICAvLyBJcyBhIG5ld2x5IGFkZGVkIG9wdGlvbiBzZWxlY3RlZD9cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3T3B0aW9uU2VsZWN0ZWQgPSAkc2VsZWN0ZWRPcHRpb24uaGFzQ2xhc3MoY2xhc3Nlcy5uZXdPcHRpb24pO1xuXG4gICAgICAgICAgICAvLyBJZiBvcHRpb24gaXMgc2VsZWN0ZWQsIHRoZW4gc3dpdGNoIHRvIGRlZmF1bHQgdmlldy5cbiAgICAgICAgICAgIC8vIE9yIGlmIHRoZSBhIG5ldyBvcHRpb24gaXMgc2VsZWN0ZWQsIHN3aXRjaCB0byBuZXcgYXJlYSB2aWV3LlxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHN3aXRjaCB0byBlZGl0IHZpZXcuXG4gICAgICAgICAgICBpZiAoaXNEZWZhdWx0VmFsdWVTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIF9zd2l0Y2hUb0RlZmF1bHRWaWV3KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzTmV3T3B0aW9uU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBfc3dpdGNoVG9OZXdWaWV3KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9zd2l0Y2hUb0VkaXRWaWV3KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBpbWFnZSBhcmVhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ3JlYXRlKCkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBvcHRpb24gd2l0aCByYW5kb20gdmFsdWUuXG4gICAgICAgICAgICBjb25zdCAkb3B0aW9uID0gJCgnPG9wdGlvbj4nLCB7XG4gICAgICAgICAgICAgICAgY2xhc3M6IGNsYXNzZXMubmV3T3B0aW9uLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMTAsIDUpIF4gMSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTkVXX0xJTktFRF9BUkVBJywgJ3NsaWRlcnMnKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBuZXcgb3B0aW9uIHRvIGlucHV0LlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRzLmFyZWEuYXBwZW5kKCRvcHRpb24pO1xuXG4gICAgICAgICAgICAvLyBTZWxlY3QgbmV3IG9wdGlvbiBpbiBkcm9wZG93bi5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLnZhbCgkb3B0aW9uLnZhbCgpKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBjaGFuZ2UgZXZlbnQgaW4gYXJlYSBkcm9wZG93biB0byBzd2l0Y2ggdG8gaW1hZ2UgYXJlYS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlICdjbGljaycgZXZlbnQgb24gdGhlIGFwcGx5IGJ1dHRvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkFwcGx5KCkge1xuICAgICAgICAgICAgLy8gU2VsZWN0ZWQgb3B0aW9uLlxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdGVkID0gZWxlbWVudHMuaW5wdXRzLmFyZWEuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgIC8vIEluZGV4IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gKHN1YnRyYWN0ZWQgMSB0byBiZSBjb21wYXRpYmxlIHdpdGggZGF0YSBjb250YWluZXIgbGlzdCBlbGVtZW50KS5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gJHNlbGVjdGVkLmluZGV4KCkgLSAxO1xuXG4gICAgICAgICAgICAvLyBJcyB0aGUgaW1hZ2UgYXJlYSBuZXc/XG4gICAgICAgICAgICBjb25zdCBpc05ld0ltYWdlQXJlYSA9ICRzZWxlY3RlZC5oYXNDbGFzcyhjbGFzc2VzLm5ld09wdGlvbik7XG5cbiAgICAgICAgICAgIC8vIEltYWdlIG1hcCBjb29yZGluYXRlcy5cbiAgICAgICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZWxlbWVudHMuZXh0ZW5zaW9uLmZpbmQoJzpoaWRkZW4nKS52YWwoKTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBsaXN0IGl0ZW0gZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICRsaXN0SXRlbSA9ICQoYDxsaVxuXHRcdFx0XHRkYXRhLWlkPVwiMFwiXG5cdFx0XHRcdGRhdGEtbGluay10aXRsZT1cIiR7ZWxlbWVudHMuaW5wdXRzLmxpbmtUaXRsZS52YWwoKX1cIlxuXHRcdFx0XHRkYXRhLWxpbmstdXJsPVwiJHtlbGVtZW50cy5pbnB1dHMubGlua1VybC52YWwoKX1cIlxuXHRcdFx0XHRkYXRhLWxpbmstdGFyZ2V0PVwiJHtlbGVtZW50cy5pbnB1dHMubGlua1RhcmdldC52YWwoKX1cIlxuXHRcdFx0XHRkYXRhLWNvb3JkaW5hdGVzPVwiJHtjb29yZGluYXRlc31cIlxuXHRcdFx0PmApO1xuXG4gICAgICAgICAgICAvLyBUcmltbWVkIGxpbmsgdGl0bGUgdmFsdWUuXG4gICAgICAgICAgICBjb25zdCBsaW5rVGl0bGUgPSBlbGVtZW50cy5pbnB1dHMubGlua1RpdGxlLnZhbCgpLnRyaW0oKTtcblxuICAgICAgICAgICAgLy8gQWJvcnQgYW5kIHNob3cgbW9kYWwsIGlmIGxpbmsgdGl0bGUgb3IgY29vcmRpbmF0ZXMgYXJlIGVtcHR5LlxuICAgICAgICAgICAgaWYgKCFjb29yZGluYXRlcyB8fCAhbGlua1RpdGxlKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNSVNTSU5HX1BBVEhfT1JfTElOS19USVRMRV9NT0RBTF9USVRMRScsICdzbGlkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNSVNTSU5HX1BBVEhfT1JfTElOS19USVRMRV9NT0RBTF9URVhUJywgJ3NsaWRlcnMnKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBsaXN0IGl0ZW0sIGlmIHRoZSBzZWxlY3RlZCBpbWFnZSBhcmVhIGlzIG5ldy5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSByZXBsYWNlIHRoZSBhbHJlYWR5IGxpc3RlZCBpdGVtLlxuICAgICAgICAgICAgaWYgKGlzTmV3SW1hZ2VBcmVhKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIG5ldyBvcHRpb24gY2xhc3MuXG4gICAgICAgICAgICAgICAgJHNlbGVjdGVkLnJlbW92ZUNsYXNzKGNsYXNzZXMubmV3T3B0aW9uKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBsaXN0IGl0ZW0gdG8gZGF0YSBjb250YWluZXIgbGlzdCBlbGVtZW50LlxuICAgICAgICAgICAgICAgICRsaXN0LmFwcGVuZCgkbGlzdEl0ZW0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIGRhdGEgY29udGFpbmVyIGxpc3QgaXRlbSB3aXRoIGNyZWF0ZWQgb25lLlxuICAgICAgICAgICAgICAgICRsaXN0LmNoaWxkcmVuKCkuZXEob3B0aW9uSW5kZXgpLnJlcGxhY2VXaXRoKCRsaXN0SXRlbSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNlbGVjdCAncGxlYXNlIHNlbGVjdCcgZHJvcGRvd24gaXRlbS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLnZhbCh2YWx1ZXMubmlsKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciAnY2hhbmdlJyBldmVudCB0byBnZXQgdG8gdGhlIGRlZmF1bHQgdmlldy5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlICdjbGljaycgZXZlbnQgb24gdGhlIGFib3J0IGJ1dHRvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkFib3J0KCkge1xuICAgICAgICAgICAgLy8gU2VsZWN0ZWQgb3B0aW9uLlxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdGVkID0gZWxlbWVudHMuaW5wdXRzLmFyZWEuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgIC8vIElzIHRoZSBpbWFnZSBhcmVhIG5ldz9cbiAgICAgICAgICAgIGNvbnN0IGlzTmV3SW1hZ2VBcmVhID0gJHNlbGVjdGVkLmhhc0NsYXNzKGNsYXNzZXMubmV3T3B0aW9uKTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIG9wdGlvbiBmcm9tIGFyZWEgZHJvcGRvd24sIGlmIHRoZSBzZWxlY3RlZCBpbWFnZSBhcmVhIGlzIG5ldy5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSB0aGUgYXJlYSBkcm9wZG93biB3aWxsIGJlIHJlZmlsbGVkLlxuICAgICAgICAgICAgaWYgKGlzTmV3SW1hZ2VBcmVhKSB7XG4gICAgICAgICAgICAgICAgJHNlbGVjdGVkLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfZmlsbEFyZWFEcm9wZG93bigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZWxlY3QgJ3BsZWFzZSBzZWxlY3QnIGRyb3Bkb3duIGl0ZW0uXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMuYXJlYS52YWwodmFsdWVzLm5pbCk7XG5cbiAgICAgICAgICAgIC8vIFRyaWdnZXIgJ2NoYW5nZScgZXZlbnQgdG8gZ2V0IHRvIHRoZSBkZWZhdWx0IHZpZXcuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMuYXJlYS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSAnY2xpY2snIGV2ZW50IG9uIHRoZSBkZWxldGUgYnV0dG9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRGVsZXRlKCkge1xuICAgICAgICAgICAgLy8gU2VsZWN0ZWQgb3B0aW9uLlxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdGVkID0gZWxlbWVudHMuaW5wdXRzLmFyZWEuZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgIC8vIEluZGV4IG9mIHRoZSBzZWxlY3RlZCBvcHRpb24gKHN1YnRyYWN0ZWQgMSB0byBiZSBjb21wYXRpYmxlIHdpdGggZGF0YSBjb250YWluZXIgbGlzdCBlbGVtZW50KS5cbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbkluZGV4ID0gJHNlbGVjdGVkLmluZGV4KCkgLSAxO1xuXG4gICAgICAgICAgICAvLyBEZWxldGUgZGF0YSBjb250YWluZXIgbGlzdCBpdGVtLlxuICAgICAgICAgICAgJGxpc3QuY2hpbGRyZW4oKS5lcShvcHRpb25JbmRleCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIFN5bmNyb25pemUgYXJlYSBkcm9wZG93bi5cbiAgICAgICAgICAgIF9maWxsQXJlYURyb3Bkb3duKCk7XG5cbiAgICAgICAgICAgIC8vIFNlbGVjdCAncGxlYXNlIHNlbGVjdCcgZHJvcGRvd24gaXRlbS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLnZhbCh2YWx1ZXMubmlsKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciAnY2hhbmdlJyBldmVudCB0byBnZXQgdG8gdGhlIGRlZmF1bHQgdmlldy5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0cy5hcmVhLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlICdjbGljaycgZXZlbnQgb24gdGhlIHJlc2V0IGJ1dHRvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblJlc2V0KCkge1xuICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgJ3Jlc2V0JyBldmVudCB0byBjbGVhciB0aGUgcGF0aC5cbiAgICAgICAgICAgIGVsZW1lbnRzLmV4dGVuc2lvbi50cmlnZ2VyKCdyZXNldCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlICdzaG93JyBldmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICRsaXN0UGFyYW1ldGVyIERhdGEgY29udGFpbmVyIGxpc3QgZWxlbWVudC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGltYWdlVXJsUGF0aCBVUkwgdG8gc2xpZGUgaW1hZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25TaG93KGV2ZW50LCAkbGlzdFBhcmFtZXRlciwgaW1hZ2VVcmxQYXRoKSB7XG4gICAgICAgICAgICAvLyBTaG93IG1vZGFsLlxuICAgICAgICAgICAgJHRoaXMubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgLy8gQXNzaWduIGRhdGEgY29udGFpbmVyIGxpc3QgZWxlbWVudCB2YWx1ZS5cbiAgICAgICAgICAgICRsaXN0ID0gJGxpc3RQYXJhbWV0ZXI7XG5cbiAgICAgICAgICAgIC8vIEFzc2lnbiBpbWFnZSBVUkwgdmFsdWUuXG4gICAgICAgICAgICBpbWFnZVVybCA9IGltYWdlVXJsUGF0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSAnY2xpY2snIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIENoZWNrLCB3aGV0aGVyIHRoZSBjcmVhdGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAgICAgICAgICBpZiAoZWxlbWVudHMuYnV0dG9ucy5jcmVhdGUuaXMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIF9vbkNyZWF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2ssIHdoZXRoZXIgdGhlIGFwcGx5IGJ1dHRvbiBpcyBjbGlja2VkLlxuICAgICAgICAgICAgaWYgKGVsZW1lbnRzLmJ1dHRvbnMuYXBwbHkuaXMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIF9vbkFwcGx5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjaywgd2hldGhlciB0aGUgYWJvcnQgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAgICAgICAgICBpZiAoZWxlbWVudHMuYnV0dG9ucy5hYm9ydC5pcyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgX29uQWJvcnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrLCB3aGV0aGVyIHRoZSBkZWxldGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gICAgICAgICAgICBpZiAoZWxlbWVudHMuYnV0dG9ucy5kZWxldGUuaXMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIF9vbkRlbGV0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2ssIHdoZXRoZXIgdGhlIHJlc2V0IGJ1dHRvbiBpcyBjbGlja2VkLlxuICAgICAgICAgICAgaWYgKGVsZW1lbnRzLmJ1dHRvbnMucmVzZXQuaXMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIF9vblJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlICdjaGFuZ2UnIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBDaGVjaywgd2hldGhlciB0aGUgYXJlYSBkcm9wZG93biBpcyBjaGFuZ2VkLlxuICAgICAgICAgICAgaWYgKGVsZW1lbnRzLmlucHV0cy5hcmVhLmlzKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICBfb25Td2l0Y2hBcmVhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgbW9kYWwgc2hvd24gZXZlbnQsIHdoaWNoIGlzIHRyaWdnZXJlZCBieSB0aGUgYm9vdHN0cmFwIG1vZGFsIHBsdWdpbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbk1vZGFsU2hvd24oKSB7XG4gICAgICAgICAgICAvLyBGaWxsIHRoZSBhcmVhIGRyb3Bkb3duIHdpdGggdGhlIHZhbHVlcyBmcm9tIHRoZSBkYXRhIGNvbnRhaW5lciBsaXN0LlxuICAgICAgICAgICAgX2ZpbGxBcmVhRHJvcGRvd24oKTtcblxuICAgICAgICAgICAgLy8gU2VsZWN0ICdwbGVhc2Ugc2VsZWN0JyBkcm9wZG93biBpdGVtIGFuZCB0cmlnZ2VyICdjaGFuZ2UnIGV2ZW50IHRvIGdldCB0byB0aGUgZGVmYXVsdCB2aWV3LlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRzLmFyZWFcbiAgICAgICAgICAgICAgICAudmFsKHZhbHVlcy5uaWwpXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIG1vZGFsIGhpZGRlbiBldmVudCwgd2hpY2ggaXMgdHJpZ2dlcmVkIGJ5IHRoZSBib290c3RyYXAgbW9kYWwgcGx1Z2luLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uTW9kYWxIaWRkZW4oKSB7XG4gICAgICAgICAgICAvLyBTZWxlY3QgJ3BsZWFzZSBzZWxlY3QnIGRyb3Bkb3duIGl0ZW0gYW5kIHRyaWdnZXIgJ2NoYW5nZScgZXZlbnQgdG8gZ2V0IHRvIHRoZSBkZWZhdWx0IHZpZXcuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dHMuYXJlYVxuICAgICAgICAgICAgICAgIC52YWwodmFsdWVzLm5pbClcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgJ2lucHV0JyBldmVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbklucHV0KGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBDaGVjaywgd2hldGhlciB0aGUgbGluayB0aXRsZSBpcyB0aGUgY2hhbmdlZCBlbGVtZW50LlxuICAgICAgICAgICAgaWYgKGVsZW1lbnRzLmlucHV0cy5saW5rVGl0bGUuaXMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIF9vbkxpbmtUaXRsZUlucHV0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgX29uQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBfb25DaGFuZ2UpXG4gICAgICAgICAgICAgICAgLm9uKCdzaG93bi5icy5tb2RhbCcsIF9vbk1vZGFsU2hvd24pXG4gICAgICAgICAgICAgICAgLm9uKCdoaWRkZW4uYnMubW9kYWwnLCBfb25Nb2RhbEhpZGRlbilcbiAgICAgICAgICAgICAgICAub24oJ3Nob3cnLCBfb25TaG93KVxuICAgICAgICAgICAgICAgIC5vbignaW5wdXQnLCBfb25JbnB1dCk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
