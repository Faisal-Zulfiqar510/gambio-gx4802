'use strict';

/* --------------------------------------------------------------
 create_missing_documents.js 2021-11-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('overview', ['modal', 'xhr', gx.source + '/libs/info_messages'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default Module Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Module Options
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
     * Quantity Unit Creation modal.
     *
     * @type {*}
     */
    var $creationModal = $('.create-modal');

    /**
     * Quantity QuantityUnitQuantityUnitQuantityUnitQuantityUnitQuantityUnitQuantityUnitUnit edit modal.
     *
     * @type {*}
     */
    var $editModal = $('.edit-modal');

    /**
     * Quantity Unit remove confirmation modal.
     *
     * @type {*}
     */
    var $removeConfirmationModal = $('.remove-confirmation-modal');

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Initializes the creation modal.
     *
     * @private
     */
    var _initCreationModal = function _initCreationModal() {
        var $inputs = $creationModal.find('input[type="text"]');
        var i = 0;

        for (; i < $inputs.length; i++) {
            $inputs[i].value = '';
            $($inputs[i]).parent().removeClass('has-error');
        }
        $creationModal.find('p.quantity-units-modal-info').first().text(jse.core.lang.translate('TEXT_INFO_INSERT_INTRO', 'quantity_units')).removeClass('text-danger');
        $creationModal.modal('show');
    };

    /**
     * Initializes the edit modal.
     *
     * @param e Event object to fetch targets id.
     * @private
     */
    var _initEditModal = function _initEditModal(e) {
        jse.libs.xhr.get({
            url: './admin.php?do=QuantityUnitAjax/getById&id=' + e.target.dataset.id
        }).done(function (r) {
            var $editModalForm = $editModal.find('form');
            var $idInput = $('<input/>').attr('type', 'hidden').attr('name', 'id');
            $editModalForm.empty();

            $idInput.val(r.id.toString());
            $editModalForm.append($idInput);
            $editModal.find('p.quantity-units-modal-info').first().text(jse.core.lang.translate('TEXT_INFO_EDIT_INTRO', 'quantity_units')).removeClass('text-danger');

            for (var languageCode in r.names) {
                var $formGroup = $('<div/>').addClass('form-group');
                var $inputContainer = $('<div/>').addClass('col-sm-12');
                var $input = $('<input/>').attr('type', 'text').attr('data-gx-widget', 'icon_input').attr('data-lang-id', r.languageIds[languageCode]).attr('name', 'name[' + r.languageIds[languageCode] + ']').addClass('form-control').val(r.names[languageCode]);

                $inputContainer.append($input);
                $formGroup.append($inputContainer);
                $editModalForm.append($formGroup);
            }

            gx.widgets.init($editModalForm);
            $editModal.modal('show');
        });
    };

    /**
     * Initializes the remove confirmation modal.
     *
     * @param e Event object to fetch targets id.
     * @private
     */
    var _initRemoveConfirmationModal = function _initRemoveConfirmationModal(e) {
        $removeConfirmationModal.modal('show');
        jse.libs.xhr.get({
            url: './admin.php?do=QuantityUnitAjax/getById&id=' + e.target.dataset.id
        }).done(function (r) {
            var $info = $('.quantity-units-modal-remove-info');
            $info.empty();
            $('.quantity-units-remove-id').val(r.id);

            for (var languageCode in r.names) {
                var newContent = languageCode + ': ' + r.names[languageCode] + '<br/>';
                var oldContent = $info.html();
                $info.html(oldContent + newContent);
            }
        });
    };

    /**
     * Sends an ajax request to store a new quantity units entity.
     *
     * @private
     */
    var _storeQuantityUnit = function _storeQuantityUnit() {
        var $button = $('#create-quantity-units');

        if (_validateInputFields('create')) {
            $button.prop('disabled', true);
            jse.libs.xhr.post({
                url: './admin.php?do=QuantityUnitAjax/store',
                data: _inputData('create')
            }).done(function () {
                return _renderTable(jse.core.lang.translate('TEXT_INFO_ADD_SUCCESS', 'quantity_units'));
            }).always(function () {
                return $button.prop('disabled', false);
            });
        }
    };

    /**
     * Sends an ajax request to update a new quantity unit entity.
     *
     * @private
     */
    var _editQuantityUnit = function _editQuantityUnit() {
        if (_validateInputFields('edit')) {
            jse.libs.xhr.post({
                url: './admin.php?do=QuantityUnitAjax/edit',
                data: _inputData('edit')
            }).done(function () {
                return _renderTable(jse.core.lang.translate('TEXT_INFO_EDIT_SUCCESS', 'quantity_units'));
            });
        }
    };

    /**
     * Sends an ajax request to remove a new quantity unit entity.
     *
     * @private
     */
    var _removeQuantityUnit = function _removeQuantityUnit() {
        jse.libs.xhr.post({
            url: './admin.php?do=QuantityUnitAjax/remove',
            data: {
                id: $('.quantity-units-remove-id').val()
            }
        }).done(function () {
            return _renderTable(jse.core.lang.translate('TEXT_INFO_DELETE_SUCCESS', 'quantity_units'));
        });
    };

    /**
     * Renders the quantity unit table again.
     *
     * @private
     */
    var _renderTable = function _renderTable(msg) {
        $creationModal.modal('hide');
        $editModal.modal('hide');
        $removeConfirmationModal.modal('hide');

        if (undefined !== msg) {
            jse.libs.info_box.addSuccessMessage(msg);
        }

        jse.libs.xhr.get({
            url: './admin.php?do=QuantityUnitAjax/getData'
        }).done(function (r) {
            var i = 0;
            var $body = $('.quantity-units-table tbody');
            $body.empty();

            for (; i < r.data.length; i++) {
                var $row = $('<tr/>');
                var $dataCol = $('<td/>');
                var $actionsCol = $('<td/>').addClass('actions');
                var $actionsContainer = $('<div/>').addClass('pull-right action-list visible-on-hover');
                var $edit = $('<i/>').addClass('fa fa-pencil edit').attr('data-id', r.data[i].id);
                var $delete = $('<i/>').addClass('fa fa-trash-o delete').attr('data-id', r.data[i].id);

                $actionsContainer.append($edit).append($delete);
                $actionsCol.append($actionsContainer);
                $dataCol.text(r.data[i].names[r.languageCode] + ' (ID: ' + r.data[i].id + ')');

                $row.append($dataCol).append($actionsCol);
                $body.append($row);
            }
            $this.find('.edit').on('click', _initEditModal);
            $this.find('.delete').on('click', _initRemoveConfirmationModal);
        });
    };

    /**
     * Validates the input fields, returns true if they are valid and false otherwise.
     *
     * @param {string} modal Modal instance, whether 'create' or 'edit'.
     * @returns {boolean}
     * @private
     */
    var _validateInputFields = function _validateInputFields(modal) {
        var $modal = modal === 'edit' ? $editModal : $creationModal;
        var $inputs = $modal.find('input[type="text"]');
        var valid = false;

        for (var i = 0; i < $inputs.length; i++) {
            if ($inputs[i].value !== '') {
                valid = true;
            }
        }

        if (!valid) {
            for (var _i = 0; _i < $inputs.length; _i++) {
                $($inputs[_i]).parent().addClass('has-error');
            }
            $modal.find('p.quantity-units-modal-info').first().text(jse.core.lang.translate('ERROR_INVALID_INPUT_FIELDS', 'quantity_units')).removeClass('text-info').addClass('text-danger');

            return false;
        } else {
            for (var _i2 = 0; _i2 < $inputs.length; _i2++) {
                $($inputs[_i2]).parent().removeClass('has-error');
            }
            var textConstant = modal === 'edit' ? 'TEXT_QUANTITYUNIT' : 'TEXT_NEW_QUANTITYUNIT';
            $modal.find('p.quantity-units-modal-info').first().text(jse.core.lang.translate(textConstant, 'quantity_units')).removeClass('text-danger');

            return true;
        }
    };

    /**
     * Fetches the data from the input fields.
     *
     * @param {string} modal Modal instance, whether 'create' or 'edit'.
     * @returns {{id: int, name: object}}
     * @private
     */
    var _inputData = function _inputData(modal) {
        var data = {};
        var $modal = modal === 'edit' ? $editModal : $creationModal;
        var $inputs = $modal.find('input[type="text"]');
        var $id = $modal.find('input[name="id"]').val();

        for (var i = 0; i < $inputs.length; i++) {
            data[$inputs[i].getAttribute('name')] = $inputs[i].value;
        }

        if (undefined !== $id) {
            data['id'] = $id;
        }

        return data;
    };

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('#add-quantity-units').on('click', _initCreationModal);
        $this.find('.edit').on('click', _initEditModal);
        $this.find('.delete').on('click', _initRemoveConfirmationModal);

        // actions
        $('#create-quantity-units').on('click', _storeQuantityUnit);
        $('#edit-quantity-units').on('click', _editQuantityUnit);
        $('#remove-quantity-units').on('click', _removeQuantityUnit);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1YW50aXR5X3VuaXRzL292ZXJ2aWV3LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiJGNyZWF0aW9uTW9kYWwiLCIkZWRpdE1vZGFsIiwiJHJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsIiwiX2luaXRDcmVhdGlvbk1vZGFsIiwiJGlucHV0cyIsImZpbmQiLCJpIiwibGVuZ3RoIiwidmFsdWUiLCJwYXJlbnQiLCJyZW1vdmVDbGFzcyIsImZpcnN0IiwidGV4dCIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwibW9kYWwiLCJfaW5pdEVkaXRNb2RhbCIsImxpYnMiLCJ4aHIiLCJnZXQiLCJ1cmwiLCJlIiwidGFyZ2V0IiwiZGF0YXNldCIsImlkIiwiZG9uZSIsIiRlZGl0TW9kYWxGb3JtIiwiJGlkSW5wdXQiLCJhdHRyIiwiZW1wdHkiLCJ2YWwiLCJyIiwidG9TdHJpbmciLCJhcHBlbmQiLCJsYW5ndWFnZUNvZGUiLCJuYW1lcyIsIiRmb3JtR3JvdXAiLCJhZGRDbGFzcyIsIiRpbnB1dENvbnRhaW5lciIsIiRpbnB1dCIsImxhbmd1YWdlSWRzIiwid2lkZ2V0cyIsImluaXQiLCJfaW5pdFJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsIiwiJGluZm8iLCJuZXdDb250ZW50Iiwib2xkQ29udGVudCIsImh0bWwiLCJfc3RvcmVRdWFudGl0eVVuaXQiLCIkYnV0dG9uIiwiX3ZhbGlkYXRlSW5wdXRGaWVsZHMiLCJwcm9wIiwicG9zdCIsIl9pbnB1dERhdGEiLCJfcmVuZGVyVGFibGUiLCJhbHdheXMiLCJfZWRpdFF1YW50aXR5VW5pdCIsIl9yZW1vdmVRdWFudGl0eVVuaXQiLCJtc2ciLCJ1bmRlZmluZWQiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiJGJvZHkiLCIkcm93IiwiJGRhdGFDb2wiLCIkYWN0aW9uc0NvbCIsIiRhY3Rpb25zQ29udGFpbmVyIiwiJGVkaXQiLCIkZGVsZXRlIiwib24iLCIkbW9kYWwiLCJ2YWxpZCIsInRleHRDb25zdGFudCIsIiRpZCIsImdldEF0dHJpYnV0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsVUFBdEIsRUFBa0MsQ0FBQyxPQUFELEVBQVUsS0FBVixFQUFpQkYsR0FBR0csTUFBSCxHQUFZLHFCQUE3QixDQUFsQyxFQUF1RixVQUFVQyxJQUFWLEVBQWdCOztBQUVuRzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFdBQVcsRUFBakI7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTUYsU0FBUyxFQUFmOztBQUVBOzs7OztBQUtBLFFBQU1RLGlCQUFpQkosRUFBRSxlQUFGLENBQXZCOztBQUVBOzs7OztBQUtBLFFBQU1LLGFBQWFMLEVBQUUsYUFBRixDQUFuQjs7QUFFQTs7Ozs7QUFLQSxRQUFNTSwyQkFBMkJOLEVBQUUsNEJBQUYsQ0FBakM7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFFBQU1PLHFCQUFxQixTQUFyQkEsa0JBQXFCLEdBQU07QUFDN0IsWUFBTUMsVUFBVUosZUFBZUssSUFBZixDQUFvQixvQkFBcEIsQ0FBaEI7QUFDQSxZQUFJQyxJQUFJLENBQVI7O0FBRUEsZUFBT0EsSUFBSUYsUUFBUUcsTUFBbkIsRUFBMkJELEdBQTNCLEVBQWdDO0FBQzVCRixvQkFBUUUsQ0FBUixFQUFXRSxLQUFYLEdBQW1CLEVBQW5CO0FBQ0FaLGNBQUVRLFFBQVFFLENBQVIsQ0FBRixFQUFjRyxNQUFkLEdBQXVCQyxXQUF2QixDQUFtQyxXQUFuQztBQUNI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RUFBdEIsQ0FBeUIsT0FBekIsRUFBa0MxQiw0QkFBbEM7O0FBRUE7QUFDQWpELFVBQUUsd0JBQUYsRUFBNEIyRSxFQUE1QixDQUErQixPQUEvQixFQUF3Q3JCLGtCQUF4QztBQUNBdEQsVUFBRSxzQkFBRixFQUEwQjJFLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDYixpQkFBdEM7QUFDQTlELFVBQUUsd0JBQUYsRUFBNEIyRSxFQUE1QixDQUErQixPQUEvQixFQUF3Q1osbUJBQXhDOztBQUVBaEM7QUFDSCxLQVhEOztBQWFBLFdBQU9uQyxNQUFQO0FBQ0gsQ0FqVUQiLCJmaWxlIjoicXVhbnRpdHlfdW5pdHMvb3ZlcnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNyZWF0ZV9taXNzaW5nX2RvY3VtZW50cy5qcyAyMDIxLTExLTA5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29udHJvbGxlcnMubW9kdWxlKCdvdmVydmlldycsIFsnbW9kYWwnLCAneGhyJywgZ3guc291cmNlICsgJy9saWJzL2luZm9fbWVzc2FnZXMnXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgTW9kdWxlIE9wdGlvbnNcbiAgICAgKlxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEZpbmFsIE1vZHVsZSBPcHRpb25zXG4gICAgICpcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIE9iamVjdFxuICAgICAqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFF1YW50aXR5IFVuaXQgQ3JlYXRpb24gbW9kYWwuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCAkY3JlYXRpb25Nb2RhbCA9ICQoJy5jcmVhdGUtbW9kYWwnKTtcblxuICAgIC8qKlxuICAgICAqIFF1YW50aXR5IFF1YW50aXR5VW5pdFF1YW50aXR5VW5pdFF1YW50aXR5VW5pdFF1YW50aXR5VW5pdFF1YW50aXR5VW5pdFF1YW50aXR5VW5pdFVuaXQgZWRpdCBtb2RhbC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHsqfVxuICAgICAqL1xuICAgIGNvbnN0ICRlZGl0TW9kYWwgPSAkKCcuZWRpdC1tb2RhbCcpO1xuXG4gICAgLyoqXG4gICAgICogUXVhbnRpdHkgVW5pdCByZW1vdmUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAqXG4gICAgICogQHR5cGUgeyp9XG4gICAgICovXG4gICAgY29uc3QgJHJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsID0gJCgnLnJlbW92ZS1jb25maXJtYXRpb24tbW9kYWwnKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIGNyZWF0aW9uIG1vZGFsLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfaW5pdENyZWF0aW9uTW9kYWwgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0ICRpbnB1dHMgPSAkY3JlYXRpb25Nb2RhbC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpO1xuICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgZm9yICg7IGkgPCAkaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkaW5wdXRzW2ldLnZhbHVlID0gJyc7XG4gICAgICAgICAgICAkKCRpbnB1dHNbaV0pLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICAkY3JlYXRpb25Nb2RhbC5maW5kKCdwLnF1YW50aXR5LXVuaXRzLW1vZGFsLWluZm8nKVxuICAgICAgICAgICAgLmZpcnN0KClcbiAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fSU5TRVJUX0lOVFJPJywgJ3F1YW50aXR5X3VuaXRzJykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG4gICAgICAgICRjcmVhdGlvbk1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBlZGl0IG1vZGFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIGUgRXZlbnQgb2JqZWN0IHRvIGZldGNoIHRhcmdldHMgaWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfaW5pdEVkaXRNb2RhbCA9IGUgPT4ge1xuICAgICAgICBqc2UubGlicy54aHIuZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPVF1YW50aXR5VW5pdEFqYXgvZ2V0QnlJZCZpZD0nICsgZS50YXJnZXQuZGF0YXNldC5pZFxuICAgICAgICB9KS5kb25lKHIgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGVkaXRNb2RhbEZvcm0gPSAkZWRpdE1vZGFsLmZpbmQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGNvbnN0ICRpZElucHV0ID0gJCgnPGlucHV0Lz4nKS5hdHRyKCd0eXBlJywgJ2hpZGRlbicpLmF0dHIoJ25hbWUnLCAnaWQnKTtcbiAgICAgICAgICAgICRlZGl0TW9kYWxGb3JtLmVtcHR5KCk7XG5cbiAgICAgICAgICAgICRpZElucHV0LnZhbChyLmlkLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgJGVkaXRNb2RhbEZvcm0uYXBwZW5kKCRpZElucHV0KTtcbiAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgncC5xdWFudGl0eS11bml0cy1tb2RhbC1pbmZvJylcbiAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fRURJVF9JTlRSTycsICdxdWFudGl0eV91bml0cycpKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygndGV4dC1kYW5nZXInKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbGFuZ3VhZ2VDb2RlIGluIHIubmFtZXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgJGZvcm1Hcm91cCA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdmb3JtLWdyb3VwJyk7XG4gICAgICAgICAgICAgICAgbGV0ICRpbnB1dENvbnRhaW5lciA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdjb2wtc20tMTInKTtcbiAgICAgICAgICAgICAgICBsZXQgJGlucHV0ID0gJCgnPGlucHV0Lz4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtZ3gtd2lkZ2V0JywgJ2ljb25faW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1sYW5nLWlkJywgci5sYW5ndWFnZUlkc1tsYW5ndWFnZUNvZGVdKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignbmFtZScsICduYW1lWycgKyByLmxhbmd1YWdlSWRzW2xhbmd1YWdlQ29kZV0gKyAnXScpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZm9ybS1jb250cm9sJylcbiAgICAgICAgICAgICAgICAgICAgLnZhbChyLm5hbWVzW2xhbmd1YWdlQ29kZV0pO1xuXG4gICAgICAgICAgICAgICAgJGlucHV0Q29udGFpbmVyLmFwcGVuZCgkaW5wdXQpO1xuICAgICAgICAgICAgICAgICRmb3JtR3JvdXAuYXBwZW5kKCRpbnB1dENvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgJGVkaXRNb2RhbEZvcm0uYXBwZW5kKCRmb3JtR3JvdXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJGVkaXRNb2RhbEZvcm0pO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgcmVtb3ZlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlIEV2ZW50IG9iamVjdCB0byBmZXRjaCB0YXJnZXRzIGlkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCA9IGUgPT4ge1xuICAgICAgICAkcmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1RdWFudGl0eVVuaXRBamF4L2dldEJ5SWQmaWQ9JyArIGUudGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgICAgfSkuZG9uZShyID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRpbmZvID0gJCgnLnF1YW50aXR5LXVuaXRzLW1vZGFsLXJlbW92ZS1pbmZvJyk7XG4gICAgICAgICAgICAkaW5mby5lbXB0eSgpO1xuICAgICAgICAgICAgJCgnLnF1YW50aXR5LXVuaXRzLXJlbW92ZS1pZCcpLnZhbChyLmlkKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbGFuZ3VhZ2VDb2RlIGluIHIubmFtZXMpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3Q29udGVudCA9IGxhbmd1YWdlQ29kZSArICc6ICcgKyByLm5hbWVzW2xhbmd1YWdlQ29kZV0gKyAnPGJyLz4nO1xuICAgICAgICAgICAgICAgIGxldCBvbGRDb250ZW50ID0gJGluZm8uaHRtbCgpO1xuICAgICAgICAgICAgICAgICRpbmZvLmh0bWwob2xkQ29udGVudCArIG5ld0NvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhbiBhamF4IHJlcXVlc3QgdG8gc3RvcmUgYSBuZXcgcXVhbnRpdHkgdW5pdHMgZW50aXR5LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfc3RvcmVRdWFudGl0eVVuaXQgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0ICRidXR0b24gPSAkKCcjY3JlYXRlLXF1YW50aXR5LXVuaXRzJylcblxuICAgICAgICBpZiAoX3ZhbGlkYXRlSW5wdXRGaWVsZHMoJ2NyZWF0ZScpKSB7XG4gICAgICAgICAgICAkYnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICBqc2UubGlicy54aHIucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89UXVhbnRpdHlVbml0QWpheC9zdG9yZScsXG4gICAgICAgICAgICAgICAgZGF0YTogX2lucHV0RGF0YSgnY3JlYXRlJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4gX3JlbmRlclRhYmxlKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fQUREX1NVQ0NFU1MnLCAncXVhbnRpdHlfdW5pdHMnKSkpXG4gICAgICAgICAgICAgICAgLmFsd2F5cygoKSA9PiAkYnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmRzIGFuIGFqYXggcmVxdWVzdCB0byB1cGRhdGUgYSBuZXcgcXVhbnRpdHkgdW5pdCBlbnRpdHkuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0IF9lZGl0UXVhbnRpdHlVbml0ID0gKCkgPT4ge1xuICAgICAgICBpZiAoX3ZhbGlkYXRlSW5wdXRGaWVsZHMoJ2VkaXQnKSkge1xuICAgICAgICAgICAganNlLmxpYnMueGhyLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPVF1YW50aXR5VW5pdEFqYXgvZWRpdCcsXG4gICAgICAgICAgICAgICAgZGF0YTogX2lucHV0RGF0YSgnZWRpdCcpXG4gICAgICAgICAgICB9KS5kb25lKCgpID0+IF9yZW5kZXJUYWJsZShqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9JTkZPX0VESVRfU1VDQ0VTUycsICdxdWFudGl0eV91bml0cycpKSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYW4gYWpheCByZXF1ZXN0IHRvIHJlbW92ZSBhIG5ldyBxdWFudGl0eSB1bml0IGVudGl0eS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX3JlbW92ZVF1YW50aXR5VW5pdCA9ICgpID0+IHtcbiAgICAgICAganNlLmxpYnMueGhyLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89UXVhbnRpdHlVbml0QWpheC9yZW1vdmUnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGlkOiAkKCcucXVhbnRpdHktdW5pdHMtcmVtb3ZlLWlkJykudmFsKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZG9uZSgoKSA9PiBfcmVuZGVyVGFibGUoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19ERUxFVEVfU1VDQ0VTUycsICdxdWFudGl0eV91bml0cycpKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhlIHF1YW50aXR5IHVuaXQgdGFibGUgYWdhaW4uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0IF9yZW5kZXJUYWJsZSA9IChtc2cpID0+IHtcbiAgICAgICAgJGNyZWF0aW9uTW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgJGVkaXRNb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAkcmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwubW9kYWwoJ2hpZGUnKTtcblxuICAgICAgICBpZiAodW5kZWZpbmVkICE9PSBtc2cpIHtcbiAgICAgICAgICAgIGpzZS5saWJzLmluZm9fYm94LmFkZFN1Y2Nlc3NNZXNzYWdlKG1zZyk7XG4gICAgICAgIH1cblxuICAgICAgICBqc2UubGlicy54aHIuZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPVF1YW50aXR5VW5pdEFqYXgvZ2V0RGF0YSdcbiAgICAgICAgfSkuZG9uZShyID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGNvbnN0ICRib2R5ID0gJCgnLnF1YW50aXR5LXVuaXRzLXRhYmxlIHRib2R5Jyk7XG4gICAgICAgICAgICAkYm9keS5lbXB0eSgpO1xuXG4gICAgICAgICAgICBmb3IgKDsgaSA8IHIuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCAkcm93ID0gJCgnPHRyLz4nKTtcbiAgICAgICAgICAgICAgICBsZXQgJGRhdGFDb2wgPSAkKCc8dGQvPicpO1xuICAgICAgICAgICAgICAgIGxldCAkYWN0aW9uc0NvbCA9ICQoJzx0ZC8+JykuYWRkQ2xhc3MoJ2FjdGlvbnMnKTtcbiAgICAgICAgICAgICAgICBsZXQgJGFjdGlvbnNDb250YWluZXIgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygncHVsbC1yaWdodCBhY3Rpb24tbGlzdCB2aXNpYmxlLW9uLWhvdmVyJyk7XG4gICAgICAgICAgICAgICAgbGV0ICRlZGl0ID0gJCgnPGkvPicpLmFkZENsYXNzKCdmYSBmYS1wZW5jaWwgZWRpdCcpLmF0dHIoJ2RhdGEtaWQnLCByLmRhdGFbaV0uaWQpO1xuICAgICAgICAgICAgICAgIGxldCAkZGVsZXRlID0gJCgnPGkvPicpLmFkZENsYXNzKCdmYSBmYS10cmFzaC1vIGRlbGV0ZScpLmF0dHIoJ2RhdGEtaWQnLCByLmRhdGFbaV0uaWQpO1xuXG4gICAgICAgICAgICAgICAgJGFjdGlvbnNDb250YWluZXIuYXBwZW5kKCRlZGl0KS5hcHBlbmQoJGRlbGV0ZSk7XG4gICAgICAgICAgICAgICAgJGFjdGlvbnNDb2wuYXBwZW5kKCRhY3Rpb25zQ29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAkZGF0YUNvbC50ZXh0KGAke3IuZGF0YVtpXS5uYW1lc1tyLmxhbmd1YWdlQ29kZV19IChJRDogJHtyLmRhdGFbaV0uaWR9KWApO1xuXG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmQoJGRhdGFDb2wpLmFwcGVuZCgkYWN0aW9uc0NvbCk7XG4gICAgICAgICAgICAgICAgJGJvZHkuYXBwZW5kKCRyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmVkaXQnKS5vbignY2xpY2snLCBfaW5pdEVkaXRNb2RhbCk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcuZGVsZXRlJykub24oJ2NsaWNrJywgX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgdGhlIGlucHV0IGZpZWxkcywgcmV0dXJucyB0cnVlIGlmIHRoZXkgYXJlIHZhbGlkIGFuZCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWwgTW9kYWwgaW5zdGFuY2UsIHdoZXRoZXIgJ2NyZWF0ZScgb3IgJ2VkaXQnLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX3ZhbGlkYXRlSW5wdXRGaWVsZHMgPSAobW9kYWwpID0+IHtcbiAgICAgICAgY29uc3QgJG1vZGFsID0gbW9kYWwgPT09ICdlZGl0JyA/ICRlZGl0TW9kYWwgOiAkY3JlYXRpb25Nb2RhbDtcbiAgICAgICAgY29uc3QgJGlucHV0cyA9ICRtb2RhbC5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpO1xuICAgICAgICBsZXQgdmFsaWQgPSBmYWxzZTtcblxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCRpbnB1dHNbaV0udmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJCgkaW5wdXRzW2ldKS5wYXJlbnQoKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgncC5xdWFudGl0eS11bml0cy1tb2RhbC1pbmZvJylcbiAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFUlJPUl9JTlZBTElEX0lOUFVUX0ZJRUxEUycsICdxdWFudGl0eV91bml0cycpKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygndGV4dC1pbmZvJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICQoJGlucHV0c1tpXSkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRleHRDb25zdGFudCA9IG1vZGFsID09PSAnZWRpdCcgPyAnVEVYVF9RVUFOVElUWVVOSVQnIDogJ1RFWFRfTkVXX1FVQU5USVRZVU5JVCc7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgncC5xdWFudGl0eS11bml0cy1tb2RhbC1pbmZvJylcbiAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKHRleHRDb25zdGFudCwgJ3F1YW50aXR5X3VuaXRzJykpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LWRhbmdlcicpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBkYXRhIGZyb20gdGhlIGlucHV0IGZpZWxkcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbCBNb2RhbCBpbnN0YW5jZSwgd2hldGhlciAnY3JlYXRlJyBvciAnZWRpdCcuXG4gICAgICogQHJldHVybnMge3tpZDogaW50LCBuYW1lOiBvYmplY3R9fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX2lucHV0RGF0YSA9IChtb2RhbCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0ICRtb2RhbCA9IG1vZGFsID09PSAnZWRpdCcgPyAkZWRpdE1vZGFsIDogJGNyZWF0aW9uTW9kYWw7XG4gICAgICAgIGNvbnN0ICRpbnB1dHMgPSAkbW9kYWwuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKTtcbiAgICAgICAgY29uc3QgJGlkID0gJG1vZGFsLmZpbmQoJ2lucHV0W25hbWU9XCJpZFwiXScpLnZhbCgpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGF0YVskaW5wdXRzW2ldLmdldEF0dHJpYnV0ZSgnbmFtZScpXSA9ICRpbnB1dHNbaV0udmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodW5kZWZpbmVkICE9PSAkaWQpIHtcbiAgICAgICAgICAgIGRhdGFbJ2lkJ10gPSAkaWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJCgnI2FkZC1xdWFudGl0eS11bml0cycpLm9uKCdjbGljaycsIF9pbml0Q3JlYXRpb25Nb2RhbCk7XG4gICAgICAgICR0aGlzLmZpbmQoJy5lZGl0Jykub24oJ2NsaWNrJywgX2luaXRFZGl0TW9kYWwpO1xuICAgICAgICAkdGhpcy5maW5kKCcuZGVsZXRlJykub24oJ2NsaWNrJywgX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCk7XG5cbiAgICAgICAgLy8gYWN0aW9uc1xuICAgICAgICAkKCcjY3JlYXRlLXF1YW50aXR5LXVuaXRzJykub24oJ2NsaWNrJywgX3N0b3JlUXVhbnRpdHlVbml0KTtcbiAgICAgICAgJCgnI2VkaXQtcXVhbnRpdHktdW5pdHMnKS5vbignY2xpY2snLCBfZWRpdFF1YW50aXR5VW5pdCk7XG4gICAgICAgICQoJyNyZW1vdmUtcXVhbnRpdHktdW5pdHMnKS5vbignY2xpY2snLCBfcmVtb3ZlUXVhbnRpdHlVbml0KTtcblxuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59KTsiXX0=
