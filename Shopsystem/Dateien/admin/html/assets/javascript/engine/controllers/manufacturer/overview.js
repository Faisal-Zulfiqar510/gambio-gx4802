'use strict';

/* --------------------------------------------------------------
 overview.js 2018-10-17
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('overview',

// controller libraries
['xhr', gx.source + '/libs/info_messages', 'modal', gx.source + '/libs/info_box'],

// controller business logic
function (data) {
    'use strict';

    /**
     * Module Selector.
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Manufacturer creation modal.
     *
     * @type {*}
     */
    var $creationModal = $this.find('.creation-modal');

    /**
     * Manufacturer remove confirmation modal.
     *
     * @type {*}
     */
    var $removeConfirmationModal = $this.find('.remove-confirmation-modal');

    /**
     * Manufacturer edit modal.
     *
     * @type {*}
     */
    var $editModal = $this.find('.edit-modal');

    /**
     * Ajax object.
     *
     * @type {object}
     */
    var ajax = jse.libs.xhr;

    /**
     * Info box Object.
     *
     * @type {object}
     */
    var infoBox = jse.libs.info_box;

    /**
     * Language object.
     *
     * @type {object}
     */
    var lang = jse.core.lang;

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

    /**
     * Initializes the remove confirmation modal.
     *
     * @param eventObject Event object to fetch targets id.
     */
    var _initRemoveConfirmationModal = function _initRemoveConfirmationModal(eventObject) {
        ajax.get({
            url: './admin.php?do=ManufacturerAjax/getById&id=' + eventObject.target.dataset.id
        }).done(function (response) {
            $removeConfirmationModal.modal('show');
            _renderRemoveConfirmationModal(response);
        });
    };

    /**
     * Initializes the edit modal.
     *
     * @param eventObject Event object to fetch targets id.
     */
    var _initEditModal = function _initEditModal(eventObject) {
        ajax.get({
            url: './admin.php?do=ManufacturerAjax/getById&id=' + eventObject.target.dataset.id
        }).done(function (response) {
            $editModal.modal('show');
            _renderEditModal(response);
            if (response.image !== '') {
                _setImagePreview(response);
            }
        });
    };

    /**
     * Initializes the editing of an Manufacturer.
     *
     * @private
     */
    var _editManufacturer = function _editManufacturer() {
        if (_validateNameInput($editModal)) {
            _updateData();
        }
    };

    /**
     * Initializes the creation of an Manufacturer.
     *
     * @private
     */
    var _createManufacturer = function _createManufacturer() {
        if (_validateNameInput($creationModal)) {
            _storeData();
        }
    };

    /**
     * Initializes the cleaning process from create Modal.
     *
     * @private
     */
    var _cleanupCreationModal = function _cleanupCreationModal() {
        _truncateModalFields($creationModal);
        _truncateModalFieldClasses($creationModal);
        _resetModalMessages($creationModal);
    };

    /**
     * Initializes the cleaning process from edit Modal.
     *
     * @private
     */
    var _cleanupEditModal = function _cleanupEditModal() {
        _removeWarning();
        _truncateModalFields($editModal);
        _truncateModalFieldClasses($editModal);
        _resetModalMessages($editModal);
        _removeImagePreview();
        _removeImageCheckboxChecked();
        _removeImageCheckboxText();
        _removeImageCheckbox();
    };

    /**
     * Sends an ajax request to store a new manufacturer entity.
     *
     * @private
     */
    var _storeData = function _storeData() {
        ajax.post({
            url: './admin.php?do=ManufacturerAjax/save',
            data: _createInputData('create'),
            processData: false,
            contentType: false
        }).then(function (response) {
            if (response.success) {
                _renderTable();
                $creationModal.modal('hide');

                if (response.renamed) {
                    _createImageRenameInfo();
                } else {
                    infoBox.addSuccessMessage(lang.translate('TEXT_SAVE_SUCCESS', 'manufacturers'));
                }
            }
        });
    };

    /**
     * Sends an ajax request to edit an manufacturer entity.
     *
     * @private
     */
    var _updateData = function _updateData() {
        ajax.post({
            url: './admin.php?do=ManufacturerAjax/update',
            data: _createInputData('edit'),
            processData: false,
            contentType: false
        }).then(function (response) {
            if (response.success) {
                _renderTable();
                $editModal.modal('hide');

                $creationModal.modal('hide');
                if (response.renamed) {
                    _createImageRenameInfo();
                } else {
                    infoBox.addSuccessMessage(lang.translate('TEXT_EDIT_SUCCESS', 'manufacturers'));
                }
            }
        });
    };

    /**
     * Creates an info box with renamed image info.
     *
     * @private
     */
    var _createImageRenameInfo = function _createImageRenameInfo() {
        infoBox.addMessage({
            source: 'ajax',
            status: 'new',
            type: 'info',
            customerId: 1,
            visibility: 'removable',
            headline: lang.translate('TEXT_MANUFACTURERS_IMAGE', 'manufacturers'),
            message: lang.translate('TEXT_RENAMED_IMAGE', 'manufacturers')
        }).done(function () {
            return $('.info-box').trigger('refresh:messages');
        });
    };

    /**
     * Sends an ajax request to remove an manufacturer entity.
     *
     * @private
     */
    var _removeManufacturer = function _removeManufacturer() {
        ajax.post({
            url: './admin.php?do=ManufacturerAjax/remove',
            data: {
                id: $('.manufacturer-remove-id').val()
            }
        }).then(function (response) {
            if (response.success) {
                _renderTable();
                $removeConfirmationModal.modal('hide');
                infoBox.addSuccessMessage(lang.translate('TEXT_INFO_DELETE_SUCCESS', 'manufacturers'));
            }
        });
    };

    /**
     * Returns true if the name input not empty and false if empty.
     *
     * @param modal
     * @returns {boolean}
     * @private
     */
    var _validateNameInput = function _validateNameInput(modal) {
        var $nameInput = modal.find('input[name="manufacturer_name"]');

        if ($nameInput.val() === '') {
            $nameInput.parent().addClass('has-error');
            modal.find('p.manufacturer-modal-info').first().text(lang.translate('ERROR_MISSING_NAME', 'manufacturers')).addClass('text-danger');
            $('#input-manufacturers-name').focus();
            return false;
        }
        return true;
    };

    /**
     * Removes the has-error class from parent name input in modal.
     *
     * @param modal
     * @private
     */
    var _truncateModalFieldClasses = function _truncateModalFieldClasses(modal) {
        var $nameInput = modal.find('input[name="manufacturer_name"]');
        $nameInput.parent().removeClass('has-error');
    };

    /**
     * Removes the image delete checkbox text if one exists.
     *
     * @private
     */
    var _removeImageCheckboxText = function _removeImageCheckboxText() {
        if ($editModal.find('.checkbox-info-text')) {
            $editModal.find('.checkbox-info-text').remove('.checkbox-info-text');
        }
    };

    /**
     * Removes the image delete checkbox text if one exists.
     *
     * @private
     */
    var _removeImageCheckboxChecked = function _removeImageCheckboxChecked() {
        if ($editModal.find('.delete-image-checkbox').is(':checked')) {
            $editModal.find('.delete-image-checkbox').removeAttr('checked');
        }
    };
    /**
     * Removes the image delete checkbox text if one exists.
     *
     * @private
     */
    var _removeImagePreview = function _removeImagePreview() {
        if ($editModal.find('.manufacturer-image')) {
            $editModal.find('.manufacturer-image').remove();
        }
    };

    /**
     * Set the Checkbox type to hidden.
     *
     * @private
     */
    var _removeImageCheckbox = function _removeImageCheckbox() {
        if ($editModal.find('.single-checkbox')) {
            $editModal.find('.single-checkbox').remove();
        }
    };

    /**
     * Resets the info message from modal.
     *
     * @param modal
     * @private
     */
    var _resetModalMessages = function _resetModalMessages(modal) {
        modal.find('p.manufacturer-modal-info').first().text(lang.translate('TEXT_NEW_INTRO', 'manufacturers')).removeClass('text-danger');
    };

    /**
     * Truncate all input values from modal.
     *
     * @param modal
     * @private
     */
    var _truncateModalFields = function _truncateModalFields(modal) {
        modal.find('input').each(function (key, value) {
            value.value = '';
        });
    };

    /**
     * Renders overview table , to see changes immediately.
     *
     * @private
     */
    var _renderTable = function _renderTable() {
        ajax.get({
            url: './admin.php?do=ManufacturerAjax/getData'
        }).done(function (response) {
            var $body = $('.manufacturer-table tbody');
            $body.empty();

            for (var i = 0; i < response.length; i++) {
                var $row = $('<tr/>');
                var $nameColumn = $('<td/>', {
                    'text': response[i].name + ' (ID: ' + response[i].id + ')'
                });
                var $actionsContainer = $('<div/>', {
                    'class': 'pull-right action-list visible-on-hover'
                });
                var $edit = $('<i/>', {
                    'data-id': response[i].id,
                    'data-toggle': 'modal',
                    'data-target': '.edit-modal',
                    'class': 'fa fa-pencil edit'
                });
                var $delete = $('<i/>', {
                    'data-id': response[i].id,
                    'data-toggle': 'modal',
                    'data-target': '.remove-confirmation-modal',
                    'class': 'fa fa-trash-o delete'
                });
                var $actionsCol = $('<td/>', {
                    'class': 'actions'
                });

                $actionsContainer.append($edit).append($delete).appendTo($actionsCol);
                $row.append($nameColumn).append($actionsCol).appendTo($body);
            }
            $this.find('.delete').on('click', _initRemoveConfirmationModal);
            $this.find('.edit').on('click', _initEditModal);
        });
    };

    /**
     * Renders remove confirmation modal with given data.
     *
     * @param response
     * @private
     */
    var _renderRemoveConfirmationModal = function _renderRemoveConfirmationModal(response) {
        var $info = $('.manufacturer-modal-remove-info');
        var $name = lang.translate('TEXT_MANUFACTURERS', 'manufacturers') + response.name + '<br><br>';

        $info.empty();
        $('.manufacturer-remove-id').val(response.id);
        $info.append($name);
    };

    /**
     * Renders edit modal with given data.
     *
     * @param response
     * @private
     */
    var _renderEditModal = function _renderEditModal(response) {
        $editModal.find('.manufacturer-id').val(response.id.toString());
        $editModal.find('#input-manufacturers-name').val(response.name);

        for (var languageCode in response.urls) {
            $editModal.find('.manufacturer-' + languageCode).val(response.urls[languageCode]);
        }

        if ($editModal.find('input[name="manufacturer_logo"]').attr('type') === 'text') {
            $editModal.find('input[name="manufacturer_logo"]').val(response.image);
        }

        if (response.image !== '') {
            _setDeleteImageCheckbox();
        }

        $editModal.find('.manufacturers-img-path').text(response.image);
        $editModal.find('.manufacturer-date-added').text('').append(response.dateAdded);

        $editModal.find('.manufacturer-last-modified').text('').append(response.lastModified);
    };

    /**
     * Sets an image preview in an manufacturer-image-container.
     *
     * @param response {{
     *                   imagePath : string
     *                   name      : string
     *                   image     : string
     *                 }}
     * @private
     */
    var _setImagePreview = function _setImagePreview(response) {
        var $manufacturerImage = $('<img/>', {
            'class': 'manufacturer-image ',
            'src': response.imagePath,
            'alt': response.name,
            'title': response.image
        });
        $editModal.find('.manufacturer-image-container').append($manufacturerImage);
    };

    /**
     * Sets the image delete Checkbox input.
     *
     * @private
     */
    var _setDeleteImageCheckbox = function _setDeleteImageCheckbox() {
        var $checkboxText = $('<span/>', {
            'class': 'checkbox-info-text',
            'text': ' ' + lang.translate('TEXT_DELETE_IMAGE', 'manufacturers')
        });
        var $checkboxInput = $('<input/>', {
            'class': 'delete-image-checkbox',
            'type': 'checkbox',
            'title': lang.translate('TEXT_DELETE_IMAGE', 'manufacturers')
        });

        if ($editModal.find('.single-checkbox')) {
            $editModal.find('.single-checkbox').remove();
        }
        $editModal.find('.manufacturer-image-data').append($checkboxInput).append($checkboxText).attr('data-gx-widget', 'single_checkbox');

        gx.widgets.init($editModal);
    };

    /**
     * Removes the warning text.
     *
     * @private
     */
    var _removeWarning = function _removeWarning() {
        $editModal.find('p.manufacturer-modal-info').text('').removeClass('text-danger');
    };

    /**
     * Creates and return data object from formula information's.
     *
     * @param modalType
     * @returns {{}}
     * @private
     */
    var _createInputData = function _createInputData(modalType) {
        var $modal = modalType === 'edit' ? $editModal : $creationModal;
        var $inputs = $modal.find('input[type="text"]');
        var $id = $modal.find('input[name="id"]').val();
        var $img = $modal.find('input[name="manufacturer_logo"]');
        var $imgPath = $img.val();
        var isFileManagerInput = $modal.find('.responsive-file-manager').length !== 0;
        var data = new FormData(document.querySelector('.manufacturer-form'));

        data.append('manufacturer_file', !isFileManagerInput);

        for (var i = 0; i < $inputs.length; i++) {
            data.append($inputs[i].getAttribute('name'), $inputs[i].value);
        }

        if (undefined !== $id) {
            data.append('id', $id);
        }

        if (!isFileManagerInput && undefined !== $img) {
            var file = $img[0].files[0] === null ? $imgPath : $img[0].files[0];
            if (file) {
                data.append('manufacturer_logo', file);
            }
        }

        if ($modal === $editModal) {
            data.append('manufacturer_checkbox', $editModal.find('.delete-image-checkbox').is(':checked'));

            if (data['manufacturer_logo'] === '' && $imgPath !== '') {
                data.append('manufacturer_logo', $imgPath);
            }
        }

        return data;
    };

    // event handler

    // initialization
    module.init = function (done) {
        // initialization logic

        $this.find('.delete').on('click', _initRemoveConfirmationModal);
        $creationModal.find('.btn-primary').on('click', _createManufacturer);
        $removeConfirmationModal.find('.btn-danger').on('click', _removeManufacturer);
        $editModal.find('.btn-primary').on('click', _editManufacturer);
        $this.find('.edit').on('click', _initEditModal);

        //actions
        $creationModal.on('hide.bs.modal', _cleanupCreationModal);
        $editModal.on('hide.bs.modal', _cleanupEditModal);

        done();
    };
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hbnVmYWN0dXJlci9vdmVydmlldy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRjcmVhdGlvbk1vZGFsIiwiZmluZCIsIiRyZW1vdmVDb25maXJtYXRpb25Nb2RhbCIsIiRlZGl0TW9kYWwiLCJhamF4IiwianNlIiwibGlicyIsInhociIsImluZm9Cb3giLCJpbmZvX2JveCIsImxhbmciLCJjb3JlIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCIsImdldCIsInVybCIsImV2ZW50T2JqZWN0IiwidGFyZ2V0IiwiZGF0YXNldCIsImlkIiwiZG9uZSIsIm1vZGFsIiwiX3JlbmRlclJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsIiwicmVzcG9uc2UiLCJfaW5pdEVkaXRNb2RhbCIsIl9yZW5kZXJFZGl0TW9kYWwiLCJpbWFnZSIsIl9zZXRJbWFnZVByZXZpZXciLCJfZWRpdE1hbnVmYWN0dXJlciIsIl92YWxpZGF0ZU5hbWVJbnB1dCIsIl91cGRhdGVEYXRhIiwiX2NyZWF0ZU1hbnVmYWN0dXJlciIsIl9zdG9yZURhdGEiLCJfY2xlYW51cENyZWF0aW9uTW9kYWwiLCJfdHJ1bmNhdGVNb2RhbEZpZWxkcyIsIl90cnVuY2F0ZU1vZGFsRmllbGRDbGFzc2VzIiwiX3Jlc2V0TW9kYWxNZXNzYWdlcyIsIl9jbGVhbnVwRWRpdE1vZGFsIiwiX3JlbW92ZVdhcm5pbmciLCJfcmVtb3ZlSW1hZ2VQcmV2aWV3IiwiX3JlbW92ZUltYWdlQ2hlY2tib3hDaGVja2VkIiwiX3JlbW92ZUltYWdlQ2hlY2tib3hUZXh0IiwiX3JlbW92ZUltYWdlQ2hlY2tib3giLCJwb3N0IiwiX2NyZWF0ZUlucHV0RGF0YSIsInByb2Nlc3NEYXRhIiwiY29udGVudFR5cGUiLCJ0aGVuIiwic3VjY2VzcyIsIl9yZW5kZXJUYWJsZSIsInJlbmFtZWQiLCJfY3JlYXRlSW1hZ2VSZW5hbWVJbmZvIiwiYWRkU3VjY2Vzc01lc3NhZ2UiLCJ0cmFuc2xhdGUiLCJhZGRNZXNzYWdlIiwic3RhdHVzIiwidHlwZSIsImN1c3RvbWVySWQiLCJ2aXNpYmlsaXR5IiwiaGVhZGxpbmUiLCJtZXNzYWdlIiwidHJpZ2dlciIsIl9yZW1vdmVNYW51ZmFjdHVyZXIiLCJ2YWwiLCIkbmFtZUlucHV0IiwicGFyZW50IiwiYWRkQ2xhc3MiLCJmaXJzdCIsInRleHQiLCJmb2N1cyIsInJlbW92ZUNsYXNzIiwicmVtb3ZlIiwiaXMiLCJyZW1vdmVBdHRyIiwiZWFjaCIsImtleSIsInZhbHVlIiwiJGJvZHkiLCJlbXB0eSIsImkiLCJsZW5ndGgiLCIkcm93IiwiJG5hbWVDb2x1bW4iLCJuYW1lIiwiJGFjdGlvbnNDb250YWluZXIiLCIkZWRpdCIsIiRkZWxldGUiLCIkYWN0aW9uc0NvbCIsImFwcGVuZCIsImFwcGVuZFRvIiwib24iLCIkaW5mbyIsIiRuYW1lIiwidG9TdHJpbmciLCJsYW5ndWFnZUNvZGUiLCJ1cmxzIiwiYXR0ciIsIl9zZXREZWxldGVJbWFnZUNoZWNrYm94IiwiZGF0ZUFkZGVkIiwibGFzdE1vZGlmaWVkIiwiJG1hbnVmYWN0dXJlckltYWdlIiwiaW1hZ2VQYXRoIiwiJGNoZWNrYm94VGV4dCIsIiRjaGVja2JveElucHV0Iiwid2lkZ2V0cyIsImluaXQiLCIkbW9kYWwiLCJtb2RhbFR5cGUiLCIkaW5wdXRzIiwiJGlkIiwiJGltZyIsIiRpbWdQYXRoIiwiaXNGaWxlTWFuYWdlcklucHV0IiwiRm9ybURhdGEiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRBdHRyaWJ1dGUiLCJ1bmRlZmluZWQiLCJmaWxlIiwiZmlsZXMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksVUFESjs7QUFHSTtBQUNBLENBQUMsS0FBRCxFQUFRRixHQUFHRyxNQUFILEdBQVkscUJBQXBCLEVBQTJDLE9BQTNDLEVB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LFlBQUlaLFdBQVd6RyxVQUFmLEVBQTJCO0FBQ3ZCTixpQkFBSzZGLE1BQUwsQ0FBWSx1QkFBWixFQUFxQ3ZGLFdBQVdGLElBQVgsQ0FBZ0Isd0JBQWhCLEVBQTBDeUUsRUFBMUMsQ0FBNkMsVUFBN0MsQ0FBckM7O0FBRUEsZ0JBQUk3RSxLQUFLLG1CQUFMLE1BQThCLEVBQTlCLElBQW9Db0gsYUFBYSxFQUFyRCxFQUF5RDtBQUNyRHBILHFCQUFLNkYsTUFBTCxDQUFZLG1CQUFaLEVBQWlDdUIsUUFBakM7QUFDSDtBQUNKOztBQUVELGVBQU9wSCxJQUFQO0FBQ0gsS0FuQ0Q7O0FBcUNBOztBQUVBO0FBQ0FGLFdBQU9nSCxJQUFQLEdBQWMsZ0JBQVE7QUFDbEI7O0FBRUE3RyxjQUFNRyxJQUFOLENBQVcsU0FBWCxFQUFzQjJGLEVBQXRCLENBQXlCLE9BQXpCLEVBQWtDN0UsNEJBQWxDO0FBQ0FmLHVCQUFlQyxJQUFmLENBQW9CLGNBQXBCLEVBQW9DMkYsRUFBcEMsQ0FBdUMsT0FBdkMsRUFBZ0QzRCxtQkFBaEQ7QUFDQS9CLGlDQUF5QkQsSUFBekIsQ0FBOEIsYUFBOUIsRUFBNkMyRixFQUE3QyxDQUFnRCxPQUFoRCxFQUF5RDVCLG1CQUF6RDtBQUNBN0QsbUJBQVdGLElBQVgsQ0FBZ0IsY0FBaEIsRUFBZ0MyRixFQUFoQyxDQUFtQyxPQUFuQyxFQUE0QzlELGlCQUE1QztBQUNBaEMsY0FBTUcsSUFBTixDQUFXLE9BQVgsRUFBb0IyRixFQUFwQixDQUF1QixPQUF2QixFQUFnQ2xFLGNBQWhDOztBQUVBO0FBQ0ExQix1QkFBZTRGLEVBQWYsQ0FBa0IsZUFBbEIsRUFBbUN6RCxxQkFBbkM7QUFDQWhDLG1CQUFXeUYsRUFBWCxDQUFjLGVBQWQsRUFBK0JyRCxpQkFBL0I7O0FBRUFqQjtBQUNILEtBZEQ7QUFlQSxXQUFPM0IsTUFBUDtBQUNILENBbmpCTCIsImZpbGUiOiJtYW51ZmFjdHVyZXIvb3ZlcnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG92ZXJ2aWV3LmpzIDIwMTgtMTAtMTdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ292ZXJ2aWV3JyxcblxuICAgIC8vIGNvbnRyb2xsZXIgbGlicmFyaWVzXG4gICAgWyd4aHInLCBneC5zb3VyY2UgKyAnL2xpYnMvaW5mb19tZXNzYWdlcycsICdtb2RhbCcsIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBdLFxuXG4gICAgLy8gY29udHJvbGxlciBidXNpbmVzcyBsb2dpY1xuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYW51ZmFjdHVyZXIgY3JlYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGNyZWF0aW9uTW9kYWwgPSAkdGhpcy5maW5kKCcuY3JlYXRpb24tbW9kYWwnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFudWZhY3R1cmVyIHJlbW92ZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsID0gJHRoaXMuZmluZCgnLnJlbW92ZS1jb25maXJtYXRpb24tbW9kYWwnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFudWZhY3R1cmVyIGVkaXQgbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGVkaXRNb2RhbCA9ICR0aGlzLmZpbmQoJy5lZGl0LW1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFqYXggb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgYWpheCA9IGpzZS5saWJzLnhocjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5mbyBib3ggT2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgaW5mb0JveCA9IGpzZS5saWJzLmluZm9fYm94O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMYW5ndWFnZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBsYW5nID0ganNlLmNvcmUubGFuZztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplcyB0aGUgcmVtb3ZlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGV2ZW50T2JqZWN0IEV2ZW50IG9iamVjdCB0byBmZXRjaCB0YXJnZXRzIGlkLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCA9IGV2ZW50T2JqZWN0ID0+IHtcbiAgICAgICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1NYW51ZmFjdHVyZXJBamF4L2dldEJ5SWQmaWQ9JyArIGV2ZW50T2JqZWN0LnRhcmdldC5kYXRhc2V0LmlkXG4gICAgICAgICAgICB9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAkcmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyUmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemVzIHRoZSBlZGl0IG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRPYmplY3QgRXZlbnQgb2JqZWN0IHRvIGZldGNoIHRhcmdldHMgaWQuXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaW5pdEVkaXRNb2RhbCA9IGV2ZW50T2JqZWN0ID0+IHtcbiAgICAgICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1NYW51ZmFjdHVyZXJBamF4L2dldEJ5SWQmaWQ9JyArIGV2ZW50T2JqZWN0LnRhcmdldC5kYXRhc2V0LmlkXG4gICAgICAgICAgICB9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAkZWRpdE1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgX3JlbmRlckVkaXRNb2RhbChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmltYWdlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBfc2V0SW1hZ2VQcmV2aWV3KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIGVkaXRpbmcgb2YgYW4gTWFudWZhY3R1cmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2VkaXRNYW51ZmFjdHVyZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoX3ZhbGlkYXRlTmFtZUlucHV0KCRlZGl0TW9kYWwpKSB7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZURhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIGNyZWF0aW9uIG9mIGFuIE1hbnVmYWN0dXJlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9jcmVhdGVNYW51ZmFjdHVyZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoX3ZhbGlkYXRlTmFtZUlucHV0KCRjcmVhdGlvbk1vZGFsKSkge1xuICAgICAgICAgICAgICAgIF9zdG9yZURhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIGNsZWFuaW5nIHByb2Nlc3MgZnJvbSBjcmVhdGUgTW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfY2xlYW51cENyZWF0aW9uTW9kYWwgPSAoKSA9PiB7XG4gICAgICAgICAgICBfdHJ1bmNhdGVNb2RhbEZpZWxkcygkY3JlYXRpb25Nb2RhbCk7XG4gICAgICAgICAgICBfdHJ1bmNhdGVNb2RhbEZpZWxkQ2xhc3NlcygkY3JlYXRpb25Nb2RhbCk7XG4gICAgICAgICAgICBfcmVzZXRNb2RhbE1lc3NhZ2VzKCRjcmVhdGlvbk1vZGFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIGNsZWFuaW5nIHByb2Nlc3MgZnJvbSBlZGl0IE1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2NsZWFudXBFZGl0TW9kYWwgPSAoKSA9PiB7XG4gICAgICAgICAgICBfcmVtb3ZlV2FybmluZygpO1xuICAgICAgICAgICAgX3RydW5jYXRlTW9kYWxGaWVsZHMoJGVkaXRNb2RhbCk7XG4gICAgICAgICAgICBfdHJ1bmNhdGVNb2RhbEZpZWxkQ2xhc3NlcygkZWRpdE1vZGFsKTtcbiAgICAgICAgICAgIF9yZXNldE1vZGFsTWVzc2FnZXMoJGVkaXRNb2RhbCk7XG4gICAgICAgICAgICBfcmVtb3ZlSW1hZ2VQcmV2aWV3KCk7XG4gICAgICAgICAgICBfcmVtb3ZlSW1hZ2VDaGVja2JveENoZWNrZWQoKTtcbiAgICAgICAgICAgIF9yZW1vdmVJbWFnZUNoZWNrYm94VGV4dCgpO1xuICAgICAgICAgICAgX3JlbW92ZUltYWdlQ2hlY2tib3goKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VuZHMgYW4gYWpheCByZXF1ZXN0IHRvIHN0b3JlIGEgbmV3IG1hbnVmYWN0dXJlciBlbnRpdHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfc3RvcmVEYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1NYW51ZmFjdHVyZXJBamF4L3NhdmUnLFxuICAgICAgICAgICAgICAgIGRhdGE6IF9jcmVhdGVJbnB1dERhdGEoJ2NyZWF0ZScpLFxuICAgICAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2VcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZW5kZXJUYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICAkY3JlYXRpb25Nb2RhbC5tb2RhbCgnaGlkZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZW5hbWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3JlYXRlSW1hZ2VSZW5hbWVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvQm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGxhbmcudHJhbnNsYXRlKCdURVhUX1NBVkVfU1VDQ0VTUycsICdtYW51ZmFjdHVyZXJzJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIGFqYXggcmVxdWVzdCB0byBlZGl0IGFuIG1hbnVmYWN0dXJlciBlbnRpdHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfdXBkYXRlRGF0YSA9ICgpID0+IHtcbiAgICAgICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89TWFudWZhY3R1cmVyQWpheC91cGRhdGUnLFxuICAgICAgICAgICAgICAgIGRhdGE6IF9jcmVhdGVJbnB1dERhdGEoJ2VkaXQnKSxcbiAgICAgICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlXG4gICAgICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICBfcmVuZGVyVGFibGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJGVkaXRNb2RhbC5tb2RhbCgnaGlkZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICRjcmVhdGlvbk1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5yZW5hbWVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY3JlYXRlSW1hZ2VSZW5hbWVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvQm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGxhbmcudHJhbnNsYXRlKCdURVhUX0VESVRfU1VDQ0VTUycsICdtYW51ZmFjdHVyZXJzJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhbiBpbmZvIGJveCB3aXRoIHJlbmFtZWQgaW1hZ2UgaW5mby5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9jcmVhdGVJbWFnZVJlbmFtZUluZm8gPSAoKSA9PiB7XG4gICAgICAgICAgICBpbmZvQm94LmFkZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHNvdXJjZTogJ2FqYXgnLFxuICAgICAgICAgICAgICAgIHN0YXR1czogJ25ldycsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxuICAgICAgICAgICAgICAgIGN1c3RvbWVySWQ6IDEsXG4gICAgICAgICAgICAgICAgdmlzaWJpbGl0eTogJ3JlbW92YWJsZScsXG4gICAgICAgICAgICAgICAgaGVhZGxpbmU6IGxhbmcudHJhbnNsYXRlKCdURVhUX01BTlVGQUNUVVJFUlNfSU1BR0UnLCAnbWFudWZhY3R1cmVycycpLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGxhbmcudHJhbnNsYXRlKCdURVhUX1JFTkFNRURfSU1BR0UnLCAnbWFudWZhY3R1cmVycycpLFxuICAgICAgICAgICAgfSkuZG9uZSgoKSA9PiAkKCcuaW5mby1ib3gnKS50cmlnZ2VyKCdyZWZyZXNoOm1lc3NhZ2VzJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kcyBhbiBhamF4IHJlcXVlc3QgdG8gcmVtb3ZlIGFuIG1hbnVmYWN0dXJlciBlbnRpdHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVtb3ZlTWFudWZhY3R1cmVyID0gKCkgPT4ge1xuICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1NYW51ZmFjdHVyZXJBamF4L3JlbW92ZScsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBpZDogJCgnLm1hbnVmYWN0dXJlci1yZW1vdmUtaWQnKS52YWwoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZW5kZXJUYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICAkcmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaW5mb0JveC5hZGRTdWNjZXNzTWVzc2FnZShsYW5nLnRyYW5zbGF0ZSgnVEVYVF9JTkZPX0RFTEVURV9TVUNDRVNTJywgJ21hbnVmYWN0dXJlcnMnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgbmFtZSBpbnB1dCBub3QgZW1wdHkgYW5kIGZhbHNlIGlmIGVtcHR5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbW9kYWxcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfdmFsaWRhdGVOYW1lSW5wdXQgPSBtb2RhbCA9PiB7XG4gICAgICAgICAgICBjb25zdCAkbmFtZUlucHV0ID0gbW9kYWwuZmluZCgnaW5wdXRbbmFtZT1cIm1hbnVmYWN0dXJlcl9uYW1lXCJdJyk7XG5cbiAgICAgICAgICAgIGlmICgkbmFtZUlucHV0LnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgICRuYW1lSW5wdXQucGFyZW50KCkuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgICAgIG1vZGFsLmZpbmQoJ3AubWFudWZhY3R1cmVyLW1vZGFsLWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICAudGV4dChsYW5nLnRyYW5zbGF0ZSgnRVJST1JfTUlTU0lOR19OQU1FJywgJ21hbnVmYWN0dXJlcnMnKSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCd0ZXh0LWRhbmdlcicpO1xuICAgICAgICAgICAgICAgICQoJyNpbnB1dC1tYW51ZmFjdHVyZXJzLW5hbWUnKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSBoYXMtZXJyb3IgY2xhc3MgZnJvbSBwYXJlbnQgbmFtZSBpbnB1dCBpbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1vZGFsXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfdHJ1bmNhdGVNb2RhbEZpZWxkQ2xhc3NlcyA9IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG5hbWVJbnB1dCA9IG1vZGFsLmZpbmQoJ2lucHV0W25hbWU9XCJtYW51ZmFjdHVyZXJfbmFtZVwiXScpO1xuICAgICAgICAgICAgJG5hbWVJbnB1dC5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGltYWdlIGRlbGV0ZSBjaGVja2JveCB0ZXh0IGlmIG9uZSBleGlzdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVtb3ZlSW1hZ2VDaGVja2JveFRleHQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoJGVkaXRNb2RhbC5maW5kKCcuY2hlY2tib3gtaW5mby10ZXh0JykpIHtcbiAgICAgICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoJy5jaGVja2JveC1pbmZvLXRleHQnKS5yZW1vdmUoJy5jaGVja2JveC1pbmZvLXRleHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgaW1hZ2UgZGVsZXRlIGNoZWNrYm94IHRleHQgaWYgb25lIGV4aXN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW1vdmVJbWFnZUNoZWNrYm94Q2hlY2tlZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICgkZWRpdE1vZGFsLmZpbmQoJy5kZWxldGUtaW1hZ2UtY2hlY2tib3gnKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgnLmRlbGV0ZS1pbWFnZS1jaGVja2JveCcpLnJlbW92ZUF0dHIoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGltYWdlIGRlbGV0ZSBjaGVja2JveCB0ZXh0IGlmIG9uZSBleGlzdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVtb3ZlSW1hZ2VQcmV2aWV3ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCRlZGl0TW9kYWwuZmluZCgnLm1hbnVmYWN0dXJlci1pbWFnZScpKSB7XG4gICAgICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcubWFudWZhY3R1cmVyLWltYWdlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgQ2hlY2tib3ggdHlwZSB0byBoaWRkZW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVtb3ZlSW1hZ2VDaGVja2JveCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICgkZWRpdE1vZGFsLmZpbmQoJy5zaW5nbGUtY2hlY2tib3gnKSkge1xuICAgICAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgnLnNpbmdsZS1jaGVja2JveCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIGluZm8gbWVzc2FnZSBmcm9tIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbW9kYWxcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZXNldE1vZGFsTWVzc2FnZXMgPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIG1vZGFsLmZpbmQoJ3AubWFudWZhY3R1cmVyLW1vZGFsLWluZm8nKVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLnRleHQobGFuZy50cmFuc2xhdGUoJ1RFWFRfTkVXX0lOVFJPJywgJ21hbnVmYWN0dXJlcnMnKSkucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRydW5jYXRlIGFsbCBpbnB1dCB2YWx1ZXMgZnJvbSBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1vZGFsXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfdHJ1bmNhdGVNb2RhbEZpZWxkcyA9IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgbW9kYWwuZmluZCgnaW5wdXQnKS5lYWNoKChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFsdWUudmFsdWUgPSAnJztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW5kZXJzIG92ZXJ2aWV3IHRhYmxlICwgdG8gc2VlIGNoYW5nZXMgaW1tZWRpYXRlbHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVuZGVyVGFibGUgPSAoKSA9PiB7XG4gICAgICAgICAgICBhamF4LmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89TWFudWZhY3R1cmVyQWpheC9nZXREYXRhJ1xuICAgICAgICAgICAgfSkuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJvZHkgPSAkKCcubWFudWZhY3R1cmVyLXRhYmxlIHRib2R5Jyk7XG4gICAgICAgICAgICAgICAgJGJvZHkuZW1wdHkoKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcG9uc2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJHJvdyA9ICQoJzx0ci8+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRuYW1lQ29sdW1uID0gJCgnPHRkLz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IHJlc3BvbnNlW2ldLm5hbWUgKyAnIChJRDogJyArIHJlc3BvbnNlW2ldLmlkICsgJyknXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkYWN0aW9uc0NvbnRhaW5lciA9ICQoJzxkaXYvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdwdWxsLXJpZ2h0IGFjdGlvbi1saXN0IHZpc2libGUtb24taG92ZXInXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkZWRpdCA9ICQoJzxpLz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1pZCc6IHJlc3BvbnNlW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ21vZGFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXRhcmdldCc6ICcuZWRpdC1tb2RhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnZmEgZmEtcGVuY2lsIGVkaXQnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGRlbGV0ZSA9ICQoJzxpLz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1pZCc6IHJlc3BvbnNlW2ldLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ21vZGFsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXRhcmdldCc6ICcucmVtb3ZlLWNvbmZpcm1hdGlvbi1tb2RhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnZmEgZmEtdHJhc2gtbyBkZWxldGUnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkYWN0aW9uc0NvbCA9ICQoJzx0ZC8+Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2FjdGlvbnMnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICRhY3Rpb25zQ29udGFpbmVyLmFwcGVuZCgkZWRpdCkuYXBwZW5kKCRkZWxldGUpLmFwcGVuZFRvKCRhY3Rpb25zQ29sKTtcbiAgICAgICAgICAgICAgICAgICAgJHJvdy5hcHBlbmQoJG5hbWVDb2x1bW4pLmFwcGVuZCgkYWN0aW9uc0NvbCkuYXBwZW5kVG8oJGJvZHkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuZGVsZXRlJykub24oJ2NsaWNrJywgX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmVkaXQnKS5vbignY2xpY2snLCBfaW5pdEVkaXRNb2RhbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyByZW1vdmUgY29uZmlybWF0aW9uIG1vZGFsIHdpdGggZ2l2ZW4gZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHJlc3BvbnNlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVuZGVyUmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwgPSAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRpbmZvID0gJCgnLm1hbnVmYWN0dXJlci1tb2RhbC1yZW1vdmUtaW5mbycpO1xuICAgICAgICAgICAgY29uc3QgJG5hbWUgPSBsYW5nLnRyYW5zbGF0ZSgnVEVYVF9NQU5VRkFDVFVSRVJTJywgJ21hbnVmYWN0dXJlcnMnKSArIHJlc3BvbnNlLm5hbWVcbiAgICAgICAgICAgICAgICArICc8YnI+PGJyPic7XG5cbiAgICAgICAgICAgICRpbmZvLmVtcHR5KCk7XG4gICAgICAgICAgICAkKCcubWFudWZhY3R1cmVyLXJlbW92ZS1pZCcpLnZhbChyZXNwb25zZS5pZCk7XG4gICAgICAgICAgICAkaW5mby5hcHBlbmQoJG5hbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW5kZXJzIGVkaXQgbW9kYWwgd2l0aCBnaXZlbiBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmVzcG9uc2VcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW5kZXJFZGl0TW9kYWwgPSByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoJy5tYW51ZmFjdHVyZXItaWQnKS52YWwocmVzcG9uc2UuaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoJyNpbnB1dC1tYW51ZmFjdHVyZXJzLW5hbWUnKS52YWwocmVzcG9uc2UubmFtZSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGxhbmd1YWdlQ29kZSBpbiByZXNwb25zZS51cmxzKSB7XG4gICAgICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcubWFudWZhY3R1cmVyLScgKyBsYW5ndWFnZUNvZGUpLnZhbChyZXNwb25zZS51cmxzW2xhbmd1YWdlQ29kZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJGVkaXRNb2RhbC5maW5kKCdpbnB1dFtuYW1lPVwibWFudWZhY3R1cmVyX2xvZ29cIl0nKS5hdHRyKCd0eXBlJykgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgnaW5wdXRbbmFtZT1cIm1hbnVmYWN0dXJlcl9sb2dvXCJdJykudmFsKHJlc3BvbnNlLmltYWdlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmltYWdlICE9PSAnJykge1xuICAgICAgICAgICAgICAgIF9zZXREZWxldGVJbWFnZUNoZWNrYm94KClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcubWFudWZhY3R1cmVycy1pbWctcGF0aCcpLnRleHQocmVzcG9uc2UuaW1hZ2UpO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcubWFudWZhY3R1cmVyLWRhdGUtYWRkZWQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KCcnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQocmVzcG9uc2UuZGF0ZUFkZGVkKTtcblxuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcubWFudWZhY3R1cmVyLWxhc3QtbW9kaWZpZWQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KCcnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQocmVzcG9uc2UubGFzdE1vZGlmaWVkKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyBhbiBpbWFnZSBwcmV2aWV3IGluIGFuIG1hbnVmYWN0dXJlci1pbWFnZS1jb250YWluZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByZXNwb25zZSB7e1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICBpbWFnZVBhdGggOiBzdHJpbmdcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgbmFtZSAgICAgIDogc3RyaW5nXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIGltYWdlICAgICA6IHN0cmluZ1xuICAgICAgICAgKiAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zZXRJbWFnZVByZXZpZXcgPSAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRtYW51ZmFjdHVyZXJJbWFnZSA9ICQoJzxpbWcvPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnbWFudWZhY3R1cmVyLWltYWdlICcsXG4gICAgICAgICAgICAgICAgJ3NyYyc6IHJlc3BvbnNlLmltYWdlUGF0aCxcbiAgICAgICAgICAgICAgICAnYWx0JzogcmVzcG9uc2UubmFtZSxcbiAgICAgICAgICAgICAgICAndGl0bGUnOiByZXNwb25zZS5pbWFnZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoJy5tYW51ZmFjdHVyZXItaW1hZ2UtY29udGFpbmVyJykuYXBwZW5kKCRtYW51ZmFjdHVyZXJJbWFnZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGltYWdlIGRlbGV0ZSBDaGVja2JveCBpbnB1dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zZXREZWxldGVJbWFnZUNoZWNrYm94ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGNoZWNrYm94VGV4dCA9ICQoJzxzcGFuLz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2NoZWNrYm94LWluZm8tdGV4dCcsXG4gICAgICAgICAgICAgICAgJ3RleHQnOiAnICcgKyBsYW5nLnRyYW5zbGF0ZSgnVEVYVF9ERUxFVEVfSU1BR0UnLCAnbWFudWZhY3R1cmVycycpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0ICRjaGVja2JveElucHV0ID0gJCgnPGlucHV0Lz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2RlbGV0ZS1pbWFnZS1jaGVja2JveCcsXG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICAgICd0aXRsZSc6IGxhbmcudHJhbnNsYXRlKCdURVhUX0RFTEVURV9JTUFHRScsICdtYW51ZmFjdHVyZXJzJylcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoJGVkaXRNb2RhbC5maW5kKCcuc2luZ2xlLWNoZWNrYm94JykpIHtcbiAgICAgICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoJy5zaW5nbGUtY2hlY2tib3gnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcubWFudWZhY3R1cmVyLWltYWdlLWRhdGEnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJGNoZWNrYm94SW5wdXQpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkY2hlY2tib3hUZXh0KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLWd4LXdpZGdldCcsICdzaW5nbGVfY2hlY2tib3gnKTtcblxuICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCRlZGl0TW9kYWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSB3YXJuaW5nIHRleHQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVtb3ZlV2FybmluZyA9ICgpID0+IHtcbiAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgncC5tYW51ZmFjdHVyZXItbW9kYWwtaW5mbycpXG4gICAgICAgICAgICAgICAgLnRleHQoJycpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LWRhbmdlcicpO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYW5kIHJldHVybiBkYXRhIG9iamVjdCBmcm9tIGZvcm11bGEgaW5mb3JtYXRpb24ncy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1vZGFsVHlwZVxuICAgICAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfY3JlYXRlSW5wdXREYXRhID0gbW9kYWxUeXBlID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbCA9IG1vZGFsVHlwZSA9PT0gJ2VkaXQnID8gJGVkaXRNb2RhbCA6ICRjcmVhdGlvbk1vZGFsO1xuICAgICAgICAgICAgY29uc3QgJGlucHV0cyA9ICRtb2RhbC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpO1xuICAgICAgICAgICAgY29uc3QgJGlkID0gJG1vZGFsLmZpbmQoJ2lucHV0W25hbWU9XCJpZFwiXScpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgJGltZyA9ICRtb2RhbC5maW5kKCdpbnB1dFtuYW1lPVwibWFudWZhY3R1cmVyX2xvZ29cIl0nKTtcbiAgICAgICAgICAgIGNvbnN0ICRpbWdQYXRoID0gJGltZy52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IGlzRmlsZU1hbmFnZXJJbnB1dCA9ICRtb2RhbC5maW5kKCcucmVzcG9uc2l2ZS1maWxlLW1hbmFnZXInKS5sZW5ndGggIT09IDA7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYW51ZmFjdHVyZXItZm9ybScpKTtcblxuICAgICAgICAgICAgZGF0YS5hcHBlbmQoJ21hbnVmYWN0dXJlcl9maWxlJywgIWlzRmlsZU1hbmFnZXJJbnB1dCk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGRhdGEuYXBwZW5kKCRpbnB1dHNbaV0uZ2V0QXR0cmlidXRlKCduYW1lJyksICRpbnB1dHNbaV0udmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkICE9PSAkaWQpIHtcbiAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnaWQnLCAkaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzRmlsZU1hbmFnZXJJbnB1dCAmJiB1bmRlZmluZWQgIT09ICRpbWcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gJGltZ1swXS5maWxlc1swXSA9PT0gbnVsbCA/ICRpbWdQYXRoIDogJGltZ1swXS5maWxlc1swXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnbWFudWZhY3R1cmVyX2xvZ28nLCBmaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkbW9kYWwgPT09ICRlZGl0TW9kYWwpIHtcbiAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnbWFudWZhY3R1cmVyX2NoZWNrYm94JywgJGVkaXRNb2RhbC5maW5kKCcuZGVsZXRlLWltYWdlLWNoZWNrYm94JykuaXMoJzpjaGVja2VkJykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbJ21hbnVmYWN0dXJlcl9sb2dvJ10gPT09ICcnICYmICRpbWdQYXRoICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnbWFudWZhY3R1cmVyX2xvZ28nLCAkaW1nUGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBldmVudCBoYW5kbGVyXG5cbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb25cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIC8vIGluaXRpYWxpemF0aW9uIGxvZ2ljXG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5kZWxldGUnKS5vbignY2xpY2snLCBfaW5pdFJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsKTtcbiAgICAgICAgICAgICRjcmVhdGlvbk1vZGFsLmZpbmQoJy5idG4tcHJpbWFyeScpLm9uKCdjbGljaycsIF9jcmVhdGVNYW51ZmFjdHVyZXIpO1xuICAgICAgICAgICAgJHJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsLmZpbmQoJy5idG4tZGFuZ2VyJykub24oJ2NsaWNrJywgX3JlbW92ZU1hbnVmYWN0dXJlcik7XG4gICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoJy5idG4tcHJpbWFyeScpLm9uKCdjbGljaycsIF9lZGl0TWFudWZhY3R1cmVyKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5lZGl0Jykub24oJ2NsaWNrJywgX2luaXRFZGl0TW9kYWwpO1xuXG4gICAgICAgICAgICAvL2FjdGlvbnNcbiAgICAgICAgICAgICRjcmVhdGlvbk1vZGFsLm9uKCdoaWRlLmJzLm1vZGFsJywgX2NsZWFudXBDcmVhdGlvbk1vZGFsKTtcbiAgICAgICAgICAgICRlZGl0TW9kYWwub24oJ2hpZGUuYnMubW9kYWwnLCBfY2xlYW51cEVkaXRNb2RhbCk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
