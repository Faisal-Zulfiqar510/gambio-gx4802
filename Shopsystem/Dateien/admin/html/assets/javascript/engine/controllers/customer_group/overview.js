'use strict';

/* --------------------------------------------------------------
 overview.js 2019-03-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
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
     * Ajax object.
     *
     * @type {object}
     */
    var ajax = jse.libs.xhr;

    /**
     * Info box Object.
     *
     * @type {object} /admin/info_box.js
     */
    var infoBox = jse.libs.info_box;

    /**
     * Language Code.
     *
     * @type {string}
     */
    var langCode = jse.core.config.get('languageCode').toUpperCase();

    /**
     * Language object.
     *
     * @type {object}
     */
    var lang = jse.core.lang;

    /**
     * Customer group creation modal.
     *
     * @type {*}
     */
    var $creationModal = $this.find('.creation-modal');

    /**
     * Customer Group remove confirmation modal.
     *
     * @type {*}
     */
    var $deleteModal = $this.find('.remove-confirmation-modal');

    /**
     * Manufacturer edit modal.
     *
     * @type {*}
     */
    var $editModal = $this.find('.edit-modal');

    // Initializations

    /**
     * Init the customer group create process.
     *
     * @private
     */
    var _initCreateCustomerGroup = function _initCreateCustomerGroup() {
        if (_initValidation($creationModal)) {
            _storeData();
        }
    };

    /**
     * Init the customer group edit process.
     *
     * @private
     */
    var _initEditCustomerGroup = function _initEditCustomerGroup() {
        if (_initValidation($editModal)) {
            _updateData();
        }
    };

    /**
     * Init the customer group delete process.
     *
     * @private
     */
    var _intiDeleteCustomerGroup = function _intiDeleteCustomerGroup() {
        _deleteData();
    };

    /**
     * Init the validation process.
     *
     * @param modal
     * @returns {boolean}
     * @private
     */
    var _initValidation = function _initValidation(modal) {
        return _validateNameInput(modal) && _validateMinMaxPrices(modal) && _validateFormInputs(modal);
    };

    /**
     * Init the cleanup for the creation modal.
     *
     * @private
     */
    var _initCleanupCreationModal = function _initCleanupCreationModal() {
        _resetForm($creationModal);
        _resetCheckboxes($creationModal);
    };

    /**
     * Init the cleanup for the edit modal.
     *
     * @private
     */
    var _initCleanupEditModal = function _initCleanupEditModal() {
        _resetForm($editModal);
        _resetCheckboxes($editModal);
        _resetHiddenFields();
    };

    /**
     * Init the button display handling.
     *
     * @param defaultSetting
     * @param id
     * @private
     */
    var _initDisplaying = function _initDisplaying(defaultSetting, id) {
        var $defaultSetting = $editModal.find('.default-button');
        var $defaultButton = $editModal.find('.default-input');
        var $graduatedSetting = $editModal.find('.graduated-prices-button');
        var $waringGuestDefaultText = $editModal.find('.warning-guest-default');
        var defaultCase = _hideElementByValue($defaultSetting, defaultSetting);
        var adminCase = _hideElementByValue($defaultSetting, id, 0);
        var guestCase = _hideElementByValue($defaultSetting, id, 1);
        var guestDefaultCase = guestCase ? _showElementByValue($defaultSetting, defaultCase, guestCase) : false;

        $waringGuestDefaultText.hide();
        _hideElementByValue($graduatedSetting, adminCase);
        _hideElementByValue($defaultButton, guestDefaultCase);
        _showElementByValue($waringGuestDefaultText, guestDefaultCase);
    };

    //Validations

    /**
     * Returns true if the name input not empty and false if empty.
     *
     * @param modal
     * @returns {boolean}
     * @private
     */
    var _validateNameInput = function _validateNameInput(modal) {
        _resetNameInputErrorMessage(modal);
        return _setNameInputErrorMessage(modal);
    };

    var _validateMinMaxPrices = function _validateMinMaxPrices(modal) {
        _resetMinMaxErrorMessage(modal);
        return _setMinMaxErrorMessage(modal);
    };

    /**
     * Checks validity of html5 input tags and shows native html5 error messages if not valid.
     *
     * @param modal
     * @returns {boolean}
     * @private
     */
    var _validateFormInputs = function _validateFormInputs(modal) {
        var $form = modal.find('.customer-group-form');

        if (!$form[0].checkValidity()) {
            $form.find(':submit').click();
            return false;
        }

        return true;
    };

    //Setter

    /**
     * Sets an Error message to customer-group-modal-info for name input.
     *
     * @param modal
     * @returns {boolean}
     * @private
     */
    var _setNameInputErrorMessage = function _setNameInputErrorMessage(modal) {
        var $nameInput = modal.find('input:first-of-type#customer-group-name');

        if ($nameInput.val() === '') {
            $nameInput.parent().addClass('has-error');
            modal.find('p.customer-group-modal-info').first().text(lang.translate('ERROR_MISSING_NAME', 'customers_status')).addClass('text-danger');
            $('#customer-group-name').focus();
            return false;
        }

        return true;
    };

    /**
     * Sets an Error message to customer-group-modal-order-values-info for min max order values.
     *
     * @param modal
     * @returns {boolean}
     * @private
     */
    var _setMinMaxErrorMessage = function _setMinMaxErrorMessage(modal) {
        var $minInput = modal.find('input#customer-group-min-order');
        var $maxInput = modal.find('input#customer-group-max-order');

        if ($minInput.val() === '' || $maxInput.val() === '') {
            return true;
        }

        if (Number($minInput.val()) > Number($maxInput.val())) {
            $maxInput.parent().addClass('has-error');
            $minInput.parent().addClass('has-error');
            modal.find('p.customer-group-modal-order-values-info').first().text(lang.translate('ERROR_MIN_VALUE_GRATER_THAN_MAX_VALUE', 'customers_status')).addClass('text-danger');
            $('#customer-group-min-order').focus();
            return false;
        }

        return true;
    };

    //Reseter

    /**
     * Resets hidden field sets from edit modal.
     *
     * @private
     */
    var _resetHiddenFields = function _resetHiddenFields() {
        $editModal.find('.default-button').show();
        $editModal.find('.default-input').show();
        $editModal.find('.graduated-prices-button').show();
    };

    /**
     * Resets the form to the default values.
     *
     * @param modal
     * @private
     */
    var _resetForm = function _resetForm(modal) {
        modal.find('form.customer-group-form')[0].reset();
        modal.find('input[name="show_add_tax"]').val("false");
        modal.find('input[name="base"]').val("0");
    };

    /**
     * resets all checkbox inputs.
     *
     * @param modal
     * @private
     */
    var _resetCheckboxes = function _resetCheckboxes(modal) {
        modal.find('.switcher.checked').each(function (index, switcher) {
            return $(switcher).removeClass('checked').find(':checkbox').prop('checked', false).trigger('change');
        });
    };

    /**
     * Replaces the name required error message with the info message.
     *
     * @param modal
     * @private
     */
    var _resetNameInputErrorMessage = function _resetNameInputErrorMessage(modal) {
        if (modal.find('p.customer-group-modal-info').hasClass('text-danger')) {
            modal.find('p.customer-group-modal-info').first().text(lang.translate('TEXT_INFO_INSERT_INTRO', 'customers_status')).removeClass('text-danger');

            modal.find('input:first-of-type#customer-group-name').parent().removeClass('has-error');
        }
    };

    /**
     * Replace the min max error message whit an empty string.
     *
     * @param modal
     * @private
     */
    var _resetMinMaxErrorMessage = function _resetMinMaxErrorMessage(modal) {
        if (modal.find('p.customer-group-modal-order-values-info').hasClass('text-danger')) {
            modal.find('p.customer-group-modal-order-values-info').first().text('').removeClass('text-danger');

            modal.find('input#customer-group-min-order').parent().removeClass('has-error');
            modal.find('input#customer-group-max-order').parent().removeClass('has-error');
        }
    };

    //Rendering

    /**
     * Renders the delete modal.
     *
     * @param response ajax response to render the right data.
     * @private
     */
    var _renderDeleteModal = function _renderDeleteModal(response) {
        var $info = $deleteModal.find('.remove-info');
        var $name = lang.translate('TEXT_INFO_CUSTOMERS_STATUS_NAME', 'customers_status') + ' ' + response.name[langCode];

        $info.empty();
        $deleteModal.find('.customer-group-remove-id').val(response.id);
        $info.append($name);
    };

    /**
     *
     * @param response {{
     *                   name                   : {
     *                                             LanguageCode : String
     *                                            }
     *                   id                     : number,
     *                   members                : number,
     *                   min_order              : number,
     *                   max_order              : number,
     *                   discount_price         : number,
     *                   order_discount_price   : number,
     *                   payment_unallowed      : string,
     *                   shipping_unallowed     : string,
     *                   public                 : bool,
     *                   order_discount         : bool,
     *                   graduated_prices       : bool,
     *                   customer_show_         : bool,
     *                   show_add_tax           : bool,
     *                   add_tax                : bool,
     *                   discount_attributes    : bool,
     *                   fsk18                  : bool,
     *                   fsk18_display          : bool,
     *                   write_reviews          : bool,
     *                   read_reviews           : bool,
     *                   default                : bool,
     *                   }}
     * @private
     */
    var _renderEditModal = function _renderEditModal(response) {
        _setNameInputs(response.name);
        delete response.name;

        _initDisplaying(response.default, response.id);
        _setInputData(response);

        $editModal.find('select[name="show_add_tax"]').val(response.show_add_tax.toString());
    };

    /**
     * Renders the overview table with given response data.
     *
     * @param response {{}}  {0{name,id,min_order,...}
     *                       {1{name,id,min_order,...}
     *                       {..{       ...         }}
     * @private
     */
    var _renderOverviewTable = function _renderOverviewTable(response) {
        var $body = $('.customer-group-table tbody');
        $body.empty();

        for (var i = 0; i < response.length; i++) {
            var $row = $('<tr/>');
            var $customerNumber = _createTableColumn(response[i].members);
            var $mwstColumn = _createTableColumn(lang.translate(response[i].show_add_tax ? 'TAX_YES' : 'TAX_NO', 'customers_status'));
            var $mwstOrderColumn = _getIconColumn(response[i].add_tax);
            var $discountColumn = _createTableColumn(response[i].discount_price + '%');
            var $orderDiscountColumn = _createTableColumn(response[i].order_discount_price + '%');
            var $fsk18Column = _getIconColumn(response[i].fsk18_display, response[i].fsk18_purchasable);
            var $customerReviewsColumn = _getIconColumn(response[i].read_reviews, response[i].write_reviews);
            var $actionColumn = _getActionColumn(response[i].id, response[i].default);
            var $graduatedPricesColumn = response[i].id > 0 ? _getIconColumn(response[i].graduated_prices) : _getIconColumn(false);
            var $nameColumn = _createTableColumn().attr('title', 'ID : ' + response[i].id).append(response[i].default ? '<b>' + response[i].name[langCode] + '</b>' : response[i].name[langCode]);

            $row.append($customerNumber).append($nameColumn).append($mwstColumn).append($mwstOrderColumn).append($discountColumn).append($orderDiscountColumn).append($graduatedPricesColumn).append($fsk18Column).append($customerReviewsColumn).append($actionColumn).appendTo($body);
        }
        $this.find('.delete').on('click', _initDeleteModal);
        $this.find('.edit').on('click', _initEditModal);
    };

    //Ajax handling

    /**
     * Init the render of the edit modal.
     *
     * @param eventObject
     * @private
     */
    var _initEditModal = function _initEditModal(eventObject) {
        ajax.get({
            url: './admin.php?do=CustomerGroupAjax/getById&id=' + eventObject.target.dataset.id
        }).done(function (response) {
            _renderEditModal(response);
            $editModal.modal('show');
        });
    };

    /**
     * Init the render of the overview table.
     *
     * @private
     */
    var _initRenderOverviewTable = function _initRenderOverviewTable() {
        ajax.get({
            url: './admin.php?do=CustomerGroupAjax/getData'
        }).done(function (response) {
            _renderOverviewTable(response);
        });
    };

    /**
     * Init the render of the delete modal.
     *
     * @param eventObject {{}}
     * @private
     */
    var _initDeleteModal = function _initDeleteModal(eventObject) {
        ajax.get({
            url: './admin.php?do=CustomerGroupAjax/getNameById&id=' + eventObject.target.dataset.id
        }).done(function (response) {
            _renderDeleteModal(response);
            $deleteModal.modal('show');
        });
    };

    /**
     * Sends an ajax request to store a new customer group entity in database.
     *
     * @private
     */
    var _storeData = function _storeData() {
        ajax.post({
            url: './admin.php?do=CustomerGroupAjax/store',
            data: _createInputData($creationModal)
        }).then(function (response) {
            if (response.success) {
                $creationModal.modal('hide');
                _initRenderOverviewTable();
                _initCleanupCreationModal();

                infoBox.addSuccessMessage(lang.translate('TEXT_SAVE_SUCCESS', 'customers_status'));
            }
        });
    };

    var _updateData = function _updateData() {
        ajax.post({
            url: './admin.php?do=CustomerGroupAjax/update',
            data: _createInputData($editModal)
        }).then(function (response) {
            if (response.success) {
                $editModal.modal('hide');
                _initRenderOverviewTable();
                _initCleanupEditModal();
                infoBox.addSuccessMessage(lang.translate('TEXT_EDIT_SUCCESS', 'customers_status'));
            }
        });
    };

    /**
     * Sends an ajax request to delete an customer group entity from database;
     *
     * @private
     */
    var _deleteData = function _deleteData() {
        ajax.post({
            url: './admin.php?do=CustomerGroupAjax/delete',
            data: {
                id: $deleteModal.find('.customer-group-remove-id').val()
            }
        }).then(function (response) {
            if (response.success) {
                _initRenderOverviewTable();
                $deleteModal.modal('hide');
                infoBox.addSuccessMessage(lang.translate('TEXT_INFO_DELETE_SUCCESS', 'customers_status'));
            }
        });
    };

    //Create functions

    /**
     * Creates an data object from inputs.
     *
     * @param modal the given modal where inputs shod get from.
     * @returns {{}} an data object with input data.
     * @private
     */
    var _createInputData = function _createInputData(modal) {
        var data = {};
        var $inputs = modal.find('input[type="text"], input[type="number"], input[type="checkbox"]');
        var $id = modal.find('input[name="id"]').val();

        data['show_add_tax'] = modal.find('select[name="show_add_tax"]').val();
        data['base'] = modal.find('select[name="base"]').val();

        data = _getDataFromInputs($inputs, data);

        if (undefined !== $id) {
            data['id'] = $id;
        }

        return data;
    };

    /**
     * Creates an table column with given text value as text attribute.
     *
     * @param textValue
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    var _createTableColumn = function _createTableColumn() {
        var textValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        return $('<td/>', {
            'text': textValue
        });
    };

    /**
     * Creates an i tag with given class value.
     *
     * @param classValue
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    var _createITag = function _createITag(classValue) {
        return $('<i/>', {
            'class': 'fa ' + classValue,
            'aria-hidden': true
        });
    };

    //Getter

    /**
     * Gets all data from given inputs and saves them into the given data object.
     *
     * @param inputs collection to get the value and states.
     * @param data object to extend the input data in it.
     * @returns {*} data object from input fields.
     * @private
     */
    var _getDataFromInputs = function _getDataFromInputs(inputs, data) {
        for (var i = 0; i < inputs.length; i++) {
            data[inputs[i].getAttribute('name')] = inputs[i].value === ('on' || 'off') ? inputs[i].checked : inputs[i].value;
        }

        return data;
    };

    /**
     * Gets an check or cross icon , determine by boolValue.
     *
     * @param boolValue
     * @private
     */
    var _getIcon = function _getIcon(boolValue) {
        var check = 'fa-check';
        var cross = 'fa-times';

        return boolValue ? _createITag(check) : _createITag(cross);
    };

    /**
     * Returns an table column with an icon in it.
     *
     * @param boolValue
     * @param optionalBool
     * @private
     */
    var _getIconColumn = function _getIconColumn(boolValue) {
        var optionalBool = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (optionalBool === null) {
            return _createTableColumn().append(_getIcon(boolValue));
        }

        return _createTableColumn().append(_getIcon(boolValue).append(' | ').append(_getIcon(optionalBool)));
    };

    /**
     * Returns an action column.
     *
     * @param id
     * @param defaultSetting
     * @private
     */
    var _getActionColumn = function _getActionColumn(id, defaultSetting) {
        var $actionsContainer = $('<div/>', {
            'class': 'pull-right action-list visible-on-hover'
        });
        var $actionsColumn = $('<td/>', {
            'class': 'actions'
        });
        var $edit = $('<i/>', {
            'data-id': id.toString(),
            'data-toggle': 'modal',
            'class': 'fa fa-pencil edit'
        });
        var $delete = $('<i/>', {
            'data-id': id.toString(),
            'data-toggle': 'modal',
            'class': 'fa fa-trash-o delete'
        });

        if (id > 3 && !defaultSetting) {
            $actionsContainer.append($edit).append($delete).appendTo($actionsColumn);
        } else {
            $actionsContainer.append($edit).appendTo($actionsColumn);
        }

        return $actionsColumn;
    };

    //Setter

    /**
     * Sets checkboxes in from to true, if response data is true.
     *
     * @param response {{}}
     * @param data
     * @returns {boolean}
     * @private
     */
    var _setCheckBoxes = function _setCheckBoxes(response, data) {
        if (response[data] === true) {
            $editModal.find('input[name="' + data + '"]').prop('checked', response[data]).val('on').parent('.switcher').addClass('checked').trigger('change');
        }
    };

    /**
     * Sets the name inputs by language code.
     *
     * @param name {{
     *               LanguageCode : String
     *             }}
     * @private
     */
    var _setNameInputs = function _setNameInputs(name) {
        for (var languageCode in name) {
            $editModal.find('.customer-group-name-' + languageCode).val(name[languageCode]);
        }
    };

    /**
     * Sets the input data from response object to the input fields.
     *
     * @param response {{}}
     * @private
     */
    var _setInputData = function _setInputData(response) {
        for (var _data in response) {
            if (typeof response[_data] === 'boolean') {
                _setCheckBoxes(response, _data);
            } else {
                $editModal.find('input[name="' + _data + '"]').val(response[_data]);
            }
        }
    };

    // Helper functions

    /**
     * Hides element if firstValue true or the same as the second Value.
     * Returns true if hidden and false if not.
     *
     * @param $element
     * @param firstValue
     * @param secondValue
     * @returns {boolean}
     * @private
     */
    var _hideElementByValue = function _hideElementByValue($element, firstValue) {
        var secondValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (firstValue === secondValue) {
            $element.hide();
            return true;
        }
        return false;
    };

    /**
     * Shows element if firstValue true or the same as the second Value.
     * Returns true if Shown and false if not.
     *
     * @param $element
     * @param firstValue
     * @param secondValue
     * @returns {boolean}
     * @private
     */
    var _showElementByValue = function _showElementByValue($element, firstValue) {
        var secondValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (firstValue === secondValue) {
            $element.show();
            return true;
        }
        return false;
    };

    // event handler

    // initialization
    module.init = function (done) {

        // initialization logic
        $creationModal.find('.btn-primary').on('click', _initCreateCustomerGroup);
        $deleteModal.find('.btn-danger').on('click', _intiDeleteCustomerGroup);
        $editModal.find('.btn-primary').on('click', _initEditCustomerGroup);
        $deleteModal.find('.btn btn-default').on('click', $deleteModal.find('.remove-info').empty());

        //actions
        $this.find('.delete').on('click', _initDeleteModal);
        $this.find('.edit').on('click', _initEditModal);

        $creationModal.on('hide.bs.modal', _initCleanupCreationModal);
        $editModal.on('hide.bs.modal', _initCleanupEditModal);
        done();
    };
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbWVyX2dyb3VwL292ZXJ2aWV3LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiYWpheCIsImpzZSIsImxpYnMiLCJ4aHIiLCJpbmZvQm94IiwiaW5mb19ib3giLCJsYW5nQ29kZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJ0b1VwcGVyQ2FzZSIsImxhbmciLCIkY3JlYXRpb25Nb2RhbCIsImZpbmQiLCIkZGVsZXRlTW9kYWwiLCIkZWRpdE1vZGFsIiwiX2luaXRDcmVhdGVDdXN0b21lckdyb3VwIiwiX2luaXRWYWxpZGF0aW9uIiwiX3N0b3JlRGF0YSIsIl9pbml0RWRpdEN1c3RvbWVyR3JvdXAiLCJfdXBkYXRlRGF0YSIsIl9pbnRpRGVsZXRlQ3VzdG9tZXJHcm91cCIsIl9kZWxldGVEYXRhIiwibW9kYWwiLCJfdmFsaWRhdGVOYW1lSW5wdXQiLCJfdmFsaWRhdGVNaW5NYXhQcmljZXMiLCJfdmFsaWRhdGVGb3JtSW5wdXRzIiwiX2luaXRDbGVhbnVwQ3JlYXRpb25Nb2RhbCIsIl9yZXNldEZvcm0iLCJfcmVzZXRDaGVja2JveGVzIiwiX2luaXRDbGVhbnVwRWRpdE1vZGFsIiwiX3Jlc2V0SGlkZGVuRmllbGRzIiwiX2luaXREaXNwbGF5aW5nIiwiZGVmYXVsdFNldHRpbmciLCJpZCIsIiRkZWZhdWx0U2V0dGluZyIsIiRkZWZhdWx0QnV0dG9uIiwiJGdyYWR1YXRlZFNldHRpbmciLCIkd2FyaW5nR3Vlc3REZWZhdWx0VGV4dCIsImRlZmF1bHRDYXNlIiwiX2hpZGVFbGVtZW50QnlWYWx1ZSIsImFkbWluQ2FzZSIsImd1ZXN0Q2FzZSIsImd1ZXN0RGVmYXVsdENhc2UiLCJfc2hvd0VsZW1lbnRCeVZhbHVlIiwiaGlkZSIsIl9yZXNldE5hbWVJbnB1dEVycm9yTWVzc2FnZSIsIl9zZXROYW1lSW5wdXRFcnJvck1lc3NhZ2UiLCJfcmVzZXRNaW5NYXhFcnJvck1lc3NhZ2UiLCJfc2V0TWluTWF4RXJyb3JNZXNzYWdlIiwiJGZvcm0iLCJjaGVja1ZhbGlkaXR5IiwiY2xpY2siLCIkbmFtZUlucHV0IiwidmFsIiwicGFyZW50IiwiYWRkQ2xhc3MiLCJmaXJzdCIsInRleHQiLCJ0cmFuc2xhdGUiLCJmb2N1cyIsIiRtaW5JbnB1dCIsIiRtYXhJbnB1dCIsIk51bWJlciIsInNob3ciLCJyZXNldCIsImVhY2giLCJpbmRleCIsInN3aXRjaGVyIiwicmVtb3ZlQ2xhc3MiLCJwcm9wIiwidHJpZ2dlciIsImhhc0NsYXNzIiwiX3JlbmRlckRlbGV0ZU1vZGFsIiwicmVzcG9uc2UiLCIkaW5mbyIsIiRuYW1lIiwibmFtZSIsImVtcHR5IiwiYXBwZW5kIiwiX3JlbmRlckVkaXRNb2RhbCIsIl9zZXROYW1lSW5wdXRzIiwiZGVmYXVsdCIsIl9zZXRJbnB1dERhdGEiLCJzaG93X2FkZF90YXgiLCJ0b1N0cmluZyIsIl9yZW5kZXJPdmVydmlld1RhYmxlIiwiJGJvZHkiLCJpIiwibGVuZ3RoIiwiJHJvdyIsIiRjdXN0b21lck51bWJlciIsIl9jcmVhdGVUYWJsZUNvbHVtbiIsIm1lbWJlcnMiLCIkbXdzdENvbHVtbiIsIiRtd3N0T3JkZXJDb2x1bW4iLCJfZ2V0SWNvbkNvbHVtbiIsImFkZF90YXgiLCIkZGlzY291bnRDb2x1bW4iLCJkaXNjb3VudF9wcmljZSIsIiRvcmRlckRpc2NvdW50Q29sdW1uIiwib3JkZXJfZGlzY291bnRfcHJpY2UiLCIkZnNrMThDb2x1bW4iLCJmc2sxOF9kaXNwbGF5IiwiZnNrMThfcHVyY2hhc2FibGUiLCIkY3VzdG9tZXJSZXZpZXdzQ29sdW1uIiwicmVhZF9yZXZpZXdzIiwid3JpdGVfcmV2aWV3cyIsIiRhY3Rpb25Db2x1bW4iLCJfZ2V0QWN0aW9uQ29sdW1uIiwiJGdyYWR1YXRlZFByaWNlc0NvbHVtbiIsImdyYWR1YXRlZF9wcmljZXMiLCIkbmFtZUNvbHVtbiIsImF0dHIiLCJhcHBlbmRUbyIsIm9uIiwiX2luaXREZWxldGVNb2RhbCIsIl9pbml0RWRpdE1vZGFsIiwiZXZlbnRPYmplY3QiLCJ1cmwiLCJ0YXJnZXQiLCJkYXRhc2V0IiwiZG9uZSIsIl9pbml0UmVuZGVyT3ZlcnZpZXdUYWJsZSIsInBvc3QiLCJfY3JlYXRlSW5wdXREYXRhIiwidGhlbiIsInN1Y2Nlc3MiLCJhZGRTdWNjZXNzTWVzc2FnZSIsIiRpbnB1dHMiLCIkaWQiLCJfZ2V0RGF0YUZyb21JbnB1dHMiLCJ1bmRlZmluZWQiLCJ0ZXh0VmFsdWUiLCJfY3JlYXRlSVRhZyIsImNsYXNzVmFsdWUiLCJpbnB1dHMiLCJnZXRBdHRyaWJ1dGUiLCJ2YWx1ZSIsImNoZWNrZWQiLCJfZ2V0SWNvbiIsImJvb2xWYWx1ZSIsImNoZWNrIiwiY3Jvc3MiLCJvcHRpb25hbEJvb2wiLCIkYWN0aW9uc0NvbnRhaW5lciIsIiRhY3Rpb25zQ29sdW1uIiwiJGVkaXQiLCIkZGVsZXRlIiwiX3NldENoZWNrQm94ZXMiLCJsYW5ndWFnZUNvZGUiLCIkZWxlbWVudCIsImZpcnN0VmFsdWUiLCJzZWNvbmRWYWx1ZSIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksVUFESjs7QUFHSTtBQUNBLENBQ0ksS0FESixFQUNjRixHQUFHRyxNQURqQiwwQkFFSSxPQUZKLEVBRWdCSCxHQUFHRyxNQUZuQixvQkFKSjs7QUFTSTtBQUNBLFVBQVVDLElBQVYsRUFBZ0I7QUFDWjs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRixTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTVEsT0FBT0MsSUFBSUMsSUFB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QUEvQjtBQUNBNEY7QUFDSCxLQWhCRDtBQWlCQSxXQUFPbEksTUFBUDtBQUVILENBenhCTCIsImZpbGUiOiJjdXN0b21lcl9ncm91cC9vdmVydmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gb3ZlcnZpZXcuanMgMjAxOS0wMy0xMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnb3ZlcnZpZXcnLFxuXG4gICAgLy8gY29udHJvbGxlciBsaWJyYXJpZXNcbiAgICBbXG4gICAgICAgICd4aHInLCBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19tZXNzYWdlc2AsXG4gICAgICAgICdtb2RhbCcsIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGAsXG4gICAgXSxcblxuICAgIC8vIGNvbnRyb2xsZXIgYnVzaW5lc3MgbG9naWNcbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3Rvci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBamF4IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGFqYXggPSBqc2UubGlicy54aHI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluZm8gYm94IE9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH0gL2FkbWluL2luZm9fYm94LmpzXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBpbmZvQm94ID0ganNlLmxpYnMuaW5mb19ib3g7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExhbmd1YWdlIENvZGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBsYW5nQ29kZSA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIExhbmd1YWdlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGxhbmcgPSBqc2UuY29yZS5sYW5nO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDdXN0b21lciBncm91cCBjcmVhdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkY3JlYXRpb25Nb2RhbCA9ICR0aGlzLmZpbmQoJy5jcmVhdGlvbi1tb2RhbCcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDdXN0b21lciBHcm91cCByZW1vdmUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRkZWxldGVNb2RhbCA9ICR0aGlzLmZpbmQoJy5yZW1vdmUtY29uZmlybWF0aW9uLW1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hbnVmYWN0dXJlciBlZGl0IG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7Kn1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRlZGl0TW9kYWwgPSAkdGhpcy5maW5kKCcuZWRpdC1tb2RhbCcpO1xuXG4gICAgICAgIC8vIEluaXRpYWxpemF0aW9uc1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IHRoZSBjdXN0b21lciBncm91cCBjcmVhdGUgcHJvY2Vzcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9pbml0Q3JlYXRlQ3VzdG9tZXJHcm91cCA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChfaW5pdFZhbGlkYXRpb24oJGNyZWF0aW9uTW9kYWwpKSB7XG4gICAgICAgICAgICAgICAgX3N0b3JlRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IHRoZSBjdXN0b21lciBncm91cCBlZGl0IHByb2Nlc3MuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaW5pdEVkaXRDdXN0b21lckdyb3VwID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKF9pbml0VmFsaWRhdGlvbigkZWRpdE1vZGFsKSkge1xuICAgICAgICAgICAgICAgIF91cGRhdGVEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgdGhlIGN1c3RvbWVyIGdyb3VwIGRlbGV0ZSBwcm9jZXNzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2ludGlEZWxldGVDdXN0b21lckdyb3VwID0gKCkgPT4ge1xuICAgICAgICAgICAgX2RlbGV0ZURhdGEoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCB0aGUgdmFsaWRhdGlvbiBwcm9jZXNzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbW9kYWxcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaW5pdFZhbGlkYXRpb24gPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBfdmFsaWRhdGVOYW1lSW5wdXQobW9kYWwpICYmIF92YWxpZGF0ZU1pbk1heFByaWNlcyhtb2RhbCkgJiYgX3ZhbGlkYXRlRm9ybUlucHV0cyhtb2RhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgdGhlIGNsZWFudXAgZm9yIHRoZSBjcmVhdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9pbml0Q2xlYW51cENyZWF0aW9uTW9kYWwgPSAoKSA9PiB7XG4gICAgICAgICAgICBfcmVzZXRGb3JtKCRjcmVhdGlvbk1vZGFsKTtcbiAgICAgICAgICAgIF9yZXNldENoZWNrYm94ZXMoJGNyZWF0aW9uTW9kYWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IHRoZSBjbGVhbnVwIGZvciB0aGUgZWRpdCBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9pbml0Q2xlYW51cEVkaXRNb2RhbCA9ICgpID0+IHtcbiAgICAgICAgICAgIF9yZXNldEZvcm0oJGVkaXRNb2RhbCk7XG4gICAgICAgICAgICBfcmVzZXRDaGVja2JveGVzKCRlZGl0TW9kYWwpO1xuICAgICAgICAgICAgX3Jlc2V0SGlkZGVuRmllbGRzKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgdGhlIGJ1dHRvbiBkaXNwbGF5IGhhbmRsaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZGVmYXVsdFNldHRpbmdcbiAgICAgICAgICogQHBhcmFtIGlkXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaW5pdERpc3BsYXlpbmcgPSAoZGVmYXVsdFNldHRpbmcsIGlkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkZGVmYXVsdFNldHRpbmcgPSAkZWRpdE1vZGFsLmZpbmQoJy5kZWZhdWx0LWJ1dHRvbicpO1xuICAgICAgICAgICAgY29uc3QgJGRlZmF1bHRCdXR0b24gPSAkZWRpdE1vZGFsLmZpbmQoJy5kZWZhdWx0LWlucHV0Jyk7XG4gICAgICAgICAgICBjb25zdCAkZ3JhZHVhdGVkU2V0dGluZyA9ICRlZGl0TW9kYWwuZmluZCgnLmdyYWR1YXRlZC1wcmljZXMtYnV0dG9uJyk7XG4gICAgICAgICAgICBjb25zdCAkd2FyaW5nR3Vlc3REZWZhdWx0VGV4dCA9ICRlZGl0TW9kYWwuZmluZCgnLndhcm5pbmctZ3Vlc3QtZGVmYXVsdCcpO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdENhc2UgPSBfaGlkZUVsZW1lbnRCeVZhbHVlKCRkZWZhdWx0U2V0dGluZywgZGVmYXVsdFNldHRpbmcpO1xuICAgICAgICAgICAgY29uc3QgYWRtaW5DYXNlID0gX2hpZGVFbGVtZW50QnlWYWx1ZSgkZGVmYXVsdFNldHRpbmcsIGlkLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IGd1ZXN0Q2FzZSA9IF9oaWRlRWxlbWVudEJ5VmFsdWUoJGRlZmF1bHRTZXR0aW5nLCBpZCwgMSk7XG4gICAgICAgICAgICBjb25zdCBndWVzdERlZmF1bHRDYXNlID0gZ3Vlc3RDYXNlID8gX3Nob3dFbGVtZW50QnlWYWx1ZSgkZGVmYXVsdFNldHRpbmcsIGRlZmF1bHRDYXNlLCBndWVzdENhc2UpIDogZmFsc2U7XG5cbiAgICAgICAgICAgICR3YXJpbmdHdWVzdERlZmF1bHRUZXh0LmhpZGUoKTtcbiAgICAgICAgICAgIF9oaWRlRWxlbWVudEJ5VmFsdWUoJGdyYWR1YXRlZFNldHRpbmcsIGFkbWluQ2FzZSk7XG4gICAgICAgICAgICBfaGlkZUVsZW1lbnRCeVZhbHVlKCRkZWZhdWx0QnV0dG9uLCBndWVzdERlZmF1bHRDYXNlKTtcbiAgICAgICAgICAgIF9zaG93RWxlbWVudEJ5VmFsdWUoJHdhcmluZ0d1ZXN0RGVmYXVsdFRleHQsIGd1ZXN0RGVmYXVsdENhc2UpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vVmFsaWRhdGlvbnNcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBuYW1lIGlucHV0IG5vdCBlbXB0eSBhbmQgZmFsc2UgaWYgZW1wdHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtb2RhbFxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF92YWxpZGF0ZU5hbWVJbnB1dCA9IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgX3Jlc2V0TmFtZUlucHV0RXJyb3JNZXNzYWdlKG1vZGFsKTtcbiAgICAgICAgICAgIHJldHVybiBfc2V0TmFtZUlucHV0RXJyb3JNZXNzYWdlKG1vZGFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfdmFsaWRhdGVNaW5NYXhQcmljZXMgPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIF9yZXNldE1pbk1heEVycm9yTWVzc2FnZShtb2RhbCk7XG4gICAgICAgICAgICByZXR1cm4gX3NldE1pbk1heEVycm9yTWVzc2FnZShtb2RhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyB2YWxpZGl0eSBvZiBodG1sNSBpbnB1dCB0YWdzIGFuZCBzaG93cyBuYXRpdmUgaHRtbDUgZXJyb3IgbWVzc2FnZXMgaWYgbm90IHZhbGlkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbW9kYWxcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfdmFsaWRhdGVGb3JtSW5wdXRzID0gKG1vZGFsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkZm9ybSA9IG1vZGFsLmZpbmQoJy5jdXN0b21lci1ncm91cC1mb3JtJyk7XG5cbiAgICAgICAgICAgIGlmICghJGZvcm1bMF0uY2hlY2tWYWxpZGl0eSgpKSB7XG4gICAgICAgICAgICAgICAgJGZvcm0uZmluZCgnOnN1Ym1pdCcpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL1NldHRlclxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIGFuIEVycm9yIG1lc3NhZ2UgdG8gY3VzdG9tZXItZ3JvdXAtbW9kYWwtaW5mbyBmb3IgbmFtZSBpbnB1dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1vZGFsXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NldE5hbWVJbnB1dEVycm9yTWVzc2FnZSA9IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG5hbWVJbnB1dCA9IG1vZGFsLmZpbmQoJ2lucHV0OmZpcnN0LW9mLXR5cGUjY3VzdG9tZXItZ3JvdXAtbmFtZScpO1xuXG4gICAgICAgICAgICBpZiAoJG5hbWVJbnB1dC52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAkbmFtZUlucHV0LnBhcmVudCgpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCdwLmN1c3RvbWVyLWdyb3VwLW1vZGFsLWluZm8nKVxuICAgICAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICAudGV4dChsYW5nLnRyYW5zbGF0ZSgnRVJST1JfTUlTU0lOR19OQU1FJywgJ2N1c3RvbWVyc19zdGF0dXMnKSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCd0ZXh0LWRhbmdlcicpO1xuICAgICAgICAgICAgICAgICQoJyNjdXN0b21lci1ncm91cC1uYW1lJykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgYW4gRXJyb3IgbWVzc2FnZSB0byBjdXN0b21lci1ncm91cC1tb2RhbC1vcmRlci12YWx1ZXMtaW5mbyBmb3IgbWluIG1heCBvcmRlciB2YWx1ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtb2RhbFxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zZXRNaW5NYXhFcnJvck1lc3NhZ2UgPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRtaW5JbnB1dCA9IG1vZGFsLmZpbmQoJ2lucHV0I2N1c3RvbWVyLWdyb3VwLW1pbi1vcmRlcicpO1xuICAgICAgICAgICAgY29uc3QgJG1heElucHV0ID0gbW9kYWwuZmluZCgnaW5wdXQjY3VzdG9tZXItZ3JvdXAtbWF4LW9yZGVyJyk7XG5cbiAgICAgICAgICAgIGlmICgkbWluSW5wdXQudmFsKCkgPT09ICcnIHx8ICRtYXhJbnB1dC52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKE51bWJlcigkbWluSW5wdXQudmFsKCkpID4gTnVtYmVyKCRtYXhJbnB1dC52YWwoKSkpIHtcbiAgICAgICAgICAgICAgICAkbWF4SW5wdXQucGFyZW50KCkuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgICAgICRtaW5JbnB1dC5wYXJlbnQoKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgncC5jdXN0b21lci1ncm91cC1tb2RhbC1vcmRlci12YWx1ZXMtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGxhbmcudHJhbnNsYXRlKCdFUlJPUl9NSU5fVkFMVUVfR1JBVEVSX1RIQU5fTUFYX1ZBTFVFJywgJ2N1c3RvbWVyc19zdGF0dXMnKSlcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCd0ZXh0LWRhbmdlcicpO1xuICAgICAgICAgICAgICAgICQoJyNjdXN0b21lci1ncm91cC1taW4tb3JkZXInKS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICAvL1Jlc2V0ZXJcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXRzIGhpZGRlbiBmaWVsZCBzZXRzIGZyb20gZWRpdCBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZXNldEhpZGRlbkZpZWxkcyA9ICgpID0+IHtcbiAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgnLmRlZmF1bHQtYnV0dG9uJykuc2hvdygpO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcuZGVmYXVsdC1pbnB1dCcpLnNob3coKTtcbiAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgnLmdyYWR1YXRlZC1wcmljZXMtYnV0dG9uJykuc2hvdygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldHMgdGhlIGZvcm0gdG8gdGhlIGRlZmF1bHQgdmFsdWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbW9kYWxcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZXNldEZvcm0gPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIG1vZGFsLmZpbmQoJ2Zvcm0uY3VzdG9tZXItZ3JvdXAtZm9ybScpWzBdLnJlc2V0KCk7XG4gICAgICAgICAgICBtb2RhbC5maW5kKCdpbnB1dFtuYW1lPVwic2hvd19hZGRfdGF4XCJdJykudmFsKFwiZmFsc2VcIik7XG4gICAgICAgICAgICBtb2RhbC5maW5kKCdpbnB1dFtuYW1lPVwiYmFzZVwiXScpLnZhbChcIjBcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHJlc2V0cyBhbGwgY2hlY2tib3ggaW5wdXRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbW9kYWxcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZXNldENoZWNrYm94ZXMgPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIG1vZGFsLmZpbmQoJy5zd2l0Y2hlci5jaGVja2VkJylcbiAgICAgICAgICAgICAgICAuZWFjaCgoaW5kZXgsIHN3aXRjaGVyKSA9PiAkKHN3aXRjaGVyKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnOmNoZWNrYm94JylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXBsYWNlcyB0aGUgbmFtZSByZXF1aXJlZCBlcnJvciBtZXNzYWdlIHdpdGggdGhlIGluZm8gbWVzc2FnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1vZGFsXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVzZXROYW1lSW5wdXRFcnJvck1lc3NhZ2UgPSAobW9kYWwpID0+IHtcbiAgICAgICAgICAgIGlmIChtb2RhbC5maW5kKCdwLmN1c3RvbWVyLWdyb3VwLW1vZGFsLWluZm8nKS5oYXNDbGFzcygndGV4dC1kYW5nZXInKSkge1xuICAgICAgICAgICAgICAgIG1vZGFsLmZpbmQoJ3AuY3VzdG9tZXItZ3JvdXAtbW9kYWwtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fSU5TRVJUX0lOVFJPJywgJ2N1c3RvbWVyc19zdGF0dXMnKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LWRhbmdlcicpO1xuXG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnaW5wdXQ6Zmlyc3Qtb2YtdHlwZSNjdXN0b21lci1ncm91cC1uYW1lJykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXBsYWNlIHRoZSBtaW4gbWF4IGVycm9yIG1lc3NhZ2Ugd2hpdCBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBtb2RhbFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3Jlc2V0TWluTWF4RXJyb3JNZXNzYWdlID0gKG1vZGFsKSA9PiB7XG4gICAgICAgICAgICBpZiAobW9kYWwuZmluZCgncC5jdXN0b21lci1ncm91cC1tb2RhbC1vcmRlci12YWx1ZXMtaW5mbycpLmhhc0NsYXNzKCd0ZXh0LWRhbmdlcicpKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgncC5jdXN0b21lci1ncm91cC1tb2RhbC1vcmRlci12YWx1ZXMtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KCcnKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgICAgICBtb2RhbC5maW5kKCdpbnB1dCNjdXN0b21lci1ncm91cC1taW4tb3JkZXInKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZCgnaW5wdXQjY3VzdG9tZXItZ3JvdXAtbWF4LW9yZGVyJykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vUmVuZGVyaW5nXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbmRlcnMgdGhlIGRlbGV0ZSBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHJlc3BvbnNlIGFqYXggcmVzcG9uc2UgdG8gcmVuZGVyIHRoZSByaWdodCBkYXRhLlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3JlbmRlckRlbGV0ZU1vZGFsID0gKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkaW5mbyA9ICRkZWxldGVNb2RhbC5maW5kKCcucmVtb3ZlLWluZm8nKTtcbiAgICAgICAgICAgIGNvbnN0ICRuYW1lID0gYCR7bGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19DVVNUT01FUlNfU1RBVFVTX05BTUUnLCAnY3VzdG9tZXJzX3N0YXR1cycpfSAke3Jlc3BvbnNlLm5hbWVbbGFuZ0NvZGVdfWA7XG5cbiAgICAgICAgICAgICRpbmZvLmVtcHR5KCk7XG4gICAgICAgICAgICAkZGVsZXRlTW9kYWwuZmluZCgnLmN1c3RvbWVyLWdyb3VwLXJlbW92ZS1pZCcpLnZhbChyZXNwb25zZS5pZCk7XG4gICAgICAgICAgICAkaW5mby5hcHBlbmQoJG5hbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmVzcG9uc2Uge3tcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgbmFtZSAgICAgICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMYW5ndWFnZUNvZGUgOiBTdHJpbmdcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgaWQgICAgICAgICAgICAgICAgICAgICA6IG51bWJlcixcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgbWVtYmVycyAgICAgICAgICAgICAgICA6IG51bWJlcixcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgbWluX29yZGVyICAgICAgICAgICAgICA6IG51bWJlcixcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgbWF4X29yZGVyICAgICAgICAgICAgICA6IG51bWJlcixcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgZGlzY291bnRfcHJpY2UgICAgICAgICA6IG51bWJlcixcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgb3JkZXJfZGlzY291bnRfcHJpY2UgICA6IG51bWJlcixcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgcGF5bWVudF91bmFsbG93ZWQgICAgICA6IHN0cmluZyxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgc2hpcHBpbmdfdW5hbGxvd2VkICAgICA6IHN0cmluZyxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgcHVibGljICAgICAgICAgICAgICAgICA6IGJvb2wsXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIG9yZGVyX2Rpc2NvdW50ICAgICAgICAgOiBib29sLFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICBncmFkdWF0ZWRfcHJpY2VzICAgICAgIDogYm9vbCxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgY3VzdG9tZXJfc2hvd18gICAgICAgICA6IGJvb2wsXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIHNob3dfYWRkX3RheCAgICAgICAgICAgOiBib29sLFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICBhZGRfdGF4ICAgICAgICAgICAgICAgIDogYm9vbCxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgZGlzY291bnRfYXR0cmlidXRlcyAgICA6IGJvb2wsXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIGZzazE4ICAgICAgICAgICAgICAgICAgOiBib29sLFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICBmc2sxOF9kaXNwbGF5ICAgICAgICAgIDogYm9vbCxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgd3JpdGVfcmV2aWV3cyAgICAgICAgICA6IGJvb2wsXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIHJlYWRfcmV2aWV3cyAgICAgICAgICAgOiBib29sLFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICBkZWZhdWx0ICAgICAgICAgICAgICAgIDogYm9vbCxcbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW5kZXJFZGl0TW9kYWwgPSAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIF9zZXROYW1lSW5wdXRzKHJlc3BvbnNlLm5hbWUpO1xuICAgICAgICAgICAgZGVsZXRlIHJlc3BvbnNlLm5hbWU7XG5cbiAgICAgICAgICAgIF9pbml0RGlzcGxheWluZyhyZXNwb25zZS5kZWZhdWx0LCByZXNwb25zZS5pZCk7XG4gICAgICAgICAgICBfc2V0SW5wdXREYXRhKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCdzZWxlY3RbbmFtZT1cInNob3dfYWRkX3RheFwiXScpLnZhbChyZXNwb25zZS5zaG93X2FkZF90YXgudG9TdHJpbmcoKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbmRlcnMgdGhlIG92ZXJ2aWV3IHRhYmxlIHdpdGggZ2l2ZW4gcmVzcG9uc2UgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHJlc3BvbnNlIHt7fX0gIHswe25hbWUsaWQsbWluX29yZGVyLC4uLn1cbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgIHsxe25hbWUsaWQsbWluX29yZGVyLC4uLn1cbiAgICAgICAgICogICAgICAgICAgICAgICAgICAgICAgIHsuLnsgICAgICAgLi4uICAgICAgICAgfX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW5kZXJPdmVydmlld1RhYmxlID0gKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCAkYm9keSA9ICQoJy5jdXN0b21lci1ncm91cC10YWJsZSB0Ym9keScpO1xuICAgICAgICAgICAgJGJvZHkuZW1wdHkoKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRyb3cgPSAkKCc8dHIvPicpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjdXN0b21lck51bWJlciA9IF9jcmVhdGVUYWJsZUNvbHVtbihyZXNwb25zZVtpXS5tZW1iZXJzKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkbXdzdENvbHVtbiA9IF9jcmVhdGVUYWJsZUNvbHVtbihsYW5nLnRyYW5zbGF0ZShyZXNwb25zZVtpXS5zaG93X2FkZF90YXggPyAnVEFYX1lFUycgOiAnVEFYX05PJywgJ2N1c3RvbWVyc19zdGF0dXMnKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgJG13c3RPcmRlckNvbHVtbiA9IF9nZXRJY29uQ29sdW1uKHJlc3BvbnNlW2ldLmFkZF90YXgpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRkaXNjb3VudENvbHVtbiA9IF9jcmVhdGVUYWJsZUNvbHVtbihgJHtyZXNwb25zZVtpXS5kaXNjb3VudF9wcmljZX0lYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgJG9yZGVyRGlzY291bnRDb2x1bW4gPSBfY3JlYXRlVGFibGVDb2x1bW4oYCR7cmVzcG9uc2VbaV0ub3JkZXJfZGlzY291bnRfcHJpY2V9JWApO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRmc2sxOENvbHVtbiA9IF9nZXRJY29uQ29sdW1uKHJlc3BvbnNlW2ldLmZzazE4X2Rpc3BsYXksIHJlc3BvbnNlW2ldLmZzazE4X3B1cmNoYXNhYmxlKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkY3VzdG9tZXJSZXZpZXdzQ29sdW1uID0gX2dldEljb25Db2x1bW4ocmVzcG9uc2VbaV0ucmVhZF9yZXZpZXdzLCByZXNwb25zZVtpXS53cml0ZV9yZXZpZXdzKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkYWN0aW9uQ29sdW1uID0gX2dldEFjdGlvbkNvbHVtbihyZXNwb25zZVtpXS5pZCwgcmVzcG9uc2VbaV0uZGVmYXVsdCk7XG4gICAgICAgICAgICAgICAgY29uc3QgJGdyYWR1YXRlZFByaWNlc0NvbHVtbiA9IHJlc3BvbnNlW2ldLmlkID4gMCA/XG4gICAgICAgICAgICAgICAgICAgIF9nZXRJY29uQ29sdW1uKHJlc3BvbnNlW2ldLmdyYWR1YXRlZF9wcmljZXMpIDpcbiAgICAgICAgICAgICAgICAgICAgX2dldEljb25Db2x1bW4oZmFsc2UpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRuYW1lQ29sdW1uID0gX2NyZWF0ZVRhYmxlQ29sdW1uKClcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgJ0lEIDogJyArIHJlc3BvbnNlW2ldLmlkKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKHJlc3BvbnNlW2ldLmRlZmF1bHQgP1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxiPicgKyByZXNwb25zZVtpXS5uYW1lW2xhbmdDb2RlXSArICc8L2I+JyA6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVtpXS5uYW1lW2xhbmdDb2RlXSk7XG5cbiAgICAgICAgICAgICAgICAkcm93LmFwcGVuZCgkY3VzdG9tZXJOdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJG5hbWVDb2x1bW4pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJG13c3RDb2x1bW4pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJG13c3RPcmRlckNvbHVtbilcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkZGlzY291bnRDb2x1bW4pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJG9yZGVyRGlzY291bnRDb2x1bW4pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGdyYWR1YXRlZFByaWNlc0NvbHVtbilcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkZnNrMThDb2x1bW4pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGN1c3RvbWVyUmV2aWV3c0NvbHVtbilcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkYWN0aW9uQ29sdW1uKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJGJvZHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmRlbGV0ZScpLm9uKCdjbGljaycsIF9pbml0RGVsZXRlTW9kYWwpO1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmVkaXQnKS5vbignY2xpY2snLCBfaW5pdEVkaXRNb2RhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9BamF4IGhhbmRsaW5nXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgdGhlIHJlbmRlciBvZiB0aGUgZWRpdCBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGV2ZW50T2JqZWN0XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaW5pdEVkaXRNb2RhbCA9IChldmVudE9iamVjdCkgPT4ge1xuICAgICAgICAgICAgYWpheC5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogYC4vYWRtaW4ucGhwP2RvPUN1c3RvbWVyR3JvdXBBamF4L2dldEJ5SWQmaWQ9JHtldmVudE9iamVjdC50YXJnZXQuZGF0YXNldC5pZH1gXG4gICAgICAgICAgICB9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBfcmVuZGVyRWRpdE1vZGFsKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkZWRpdE1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCB0aGUgcmVuZGVyIG9mIHRoZSBvdmVydmlldyB0YWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9pbml0UmVuZGVyT3ZlcnZpZXdUYWJsZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGFqYXguZ2V0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1DdXN0b21lckdyb3VwQWpheC9nZXREYXRhJ1xuICAgICAgICAgICAgfSkuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgX3JlbmRlck92ZXJ2aWV3VGFibGUocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgdGhlIHJlbmRlciBvZiB0aGUgZGVsZXRlIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRPYmplY3Qge3t9fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2luaXREZWxldGVNb2RhbCA9IChldmVudE9iamVjdCkgPT4ge1xuICAgICAgICAgICAgYWpheC5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogYC4vYWRtaW4ucGhwP2RvPUN1c3RvbWVyR3JvdXBBamF4L2dldE5hbWVCeUlkJmlkPSR7ZXZlbnRPYmplY3QudGFyZ2V0LmRhdGFzZXQuaWR9YFxuICAgICAgICAgICAgfSkuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgX3JlbmRlckRlbGV0ZU1vZGFsKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAkZGVsZXRlTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kcyBhbiBhamF4IHJlcXVlc3QgdG8gc3RvcmUgYSBuZXcgY3VzdG9tZXIgZ3JvdXAgZW50aXR5IGluIGRhdGFiYXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3N0b3JlRGF0YSA9ICgpID0+IHtcbiAgICAgICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89Q3VzdG9tZXJHcm91cEFqYXgvc3RvcmUnLFxuICAgICAgICAgICAgICAgIGRhdGE6IF9jcmVhdGVJbnB1dERhdGEoJGNyZWF0aW9uTW9kYWwpLFxuICAgICAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNyZWF0aW9uTW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgX2luaXRSZW5kZXJPdmVydmlld1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIF9pbml0Q2xlYW51cENyZWF0aW9uTW9kYWwoKTtcblxuICAgICAgICAgICAgICAgICAgICBpbmZvQm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGxhbmcudHJhbnNsYXRlKCdURVhUX1NBVkVfU1VDQ0VTUycsICdjdXN0b21lcnNfc3RhdHVzJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF91cGRhdGVEYXRhID0gKCkgPT4ge1xuICAgICAgICAgICAgYWpheC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1DdXN0b21lckdyb3VwQWpheC91cGRhdGUnLFxuICAgICAgICAgICAgICAgIGRhdGE6IF9jcmVhdGVJbnB1dERhdGEoJGVkaXRNb2RhbClcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICRlZGl0TW9kYWwubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgX2luaXRSZW5kZXJPdmVydmlld1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIF9pbml0Q2xlYW51cEVkaXRNb2RhbCgpO1xuICAgICAgICAgICAgICAgICAgICBpbmZvQm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGxhbmcudHJhbnNsYXRlKCdURVhUX0VESVRfU1VDQ0VTUycsICdjdXN0b21lcnNfc3RhdHVzJykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmRzIGFuIGFqYXggcmVxdWVzdCB0byBkZWxldGUgYW4gY3VzdG9tZXIgZ3JvdXAgZW50aXR5IGZyb20gZGF0YWJhc2U7XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZGVsZXRlRGF0YSA9ICgpID0+IHtcbiAgICAgICAgICAgIGFqYXgucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89Q3VzdG9tZXJHcm91cEFqYXgvZGVsZXRlJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAkZGVsZXRlTW9kYWwuZmluZCgnLmN1c3RvbWVyLWdyb3VwLXJlbW92ZS1pZCcpLnZhbCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgX2luaXRSZW5kZXJPdmVydmlld1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgICRkZWxldGVNb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBpbmZvQm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fREVMRVRFX1NVQ0NFU1MnLCAnY3VzdG9tZXJzX3N0YXR1cycpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvL0NyZWF0ZSBmdW5jdGlvbnNcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhbiBkYXRhIG9iamVjdCBmcm9tIGlucHV0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIG1vZGFsIHRoZSBnaXZlbiBtb2RhbCB3aGVyZSBpbnB1dHMgc2hvZCBnZXQgZnJvbS5cbiAgICAgICAgICogQHJldHVybnMge3t9fSBhbiBkYXRhIG9iamVjdCB3aXRoIGlucHV0IGRhdGEuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfY3JlYXRlSW5wdXREYXRhID0gKG1vZGFsKSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgJGlucHV0cyA9IG1vZGFsLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdLCBpbnB1dFt0eXBlPVwibnVtYmVyXCJdLCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgICAgICAgIGNvbnN0ICRpZCA9IG1vZGFsLmZpbmQoJ2lucHV0W25hbWU9XCJpZFwiXScpLnZhbCgpO1xuXG4gICAgICAgICAgICBkYXRhWydzaG93X2FkZF90YXgnXSA9IG1vZGFsLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2hvd19hZGRfdGF4XCJdJykudmFsKCk7XG4gICAgICAgICAgICBkYXRhWydiYXNlJ10gPSBtb2RhbC5maW5kKCdzZWxlY3RbbmFtZT1cImJhc2VcIl0nKS52YWwoKTtcblxuICAgICAgICAgICAgZGF0YSA9IF9nZXREYXRhRnJvbUlucHV0cygkaW5wdXRzLCBkYXRhKTtcblxuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gJGlkKSB7XG4gICAgICAgICAgICAgICAgZGF0YVsnaWQnXSA9ICRpZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYW4gdGFibGUgY29sdW1uIHdpdGggZ2l2ZW4gdGV4dCB2YWx1ZSBhcyB0ZXh0IGF0dHJpYnV0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHRleHRWYWx1ZVxuICAgICAgICAgKiBAcmV0dXJucyB7KnxqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfY3JlYXRlVGFibGVDb2x1bW4gPSAodGV4dFZhbHVlID0gJycpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAkKCc8dGQvPicsIHtcbiAgICAgICAgICAgICAgICAndGV4dCc6IHRleHRWYWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYW4gaSB0YWcgd2l0aCBnaXZlbiBjbGFzcyB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGNsYXNzVmFsdWVcbiAgICAgICAgICogQHJldHVybnMgeyp8alF1ZXJ5fEhUTUxFbGVtZW50fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2NyZWF0ZUlUYWcgPSAoY2xhc3NWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICQoJzxpLz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2ZhICcgKyBjbGFzc1ZhbHVlLFxuICAgICAgICAgICAgICAgICdhcmlhLWhpZGRlbic6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2V0dGVyXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgYWxsIGRhdGEgZnJvbSBnaXZlbiBpbnB1dHMgYW5kIHNhdmVzIHRoZW0gaW50byB0aGUgZ2l2ZW4gZGF0YSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBpbnB1dHMgY29sbGVjdGlvbiB0byBnZXQgdGhlIHZhbHVlIGFuZCBzdGF0ZXMuXG4gICAgICAgICAqIEBwYXJhbSBkYXRhIG9iamVjdCB0byBleHRlbmQgdGhlIGlucHV0IGRhdGEgaW4gaXQuXG4gICAgICAgICAqIEByZXR1cm5zIHsqfSBkYXRhIG9iamVjdCBmcm9tIGlucHV0IGZpZWxkcy5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9nZXREYXRhRnJvbUlucHV0cyA9IChpbnB1dHMsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtpbnB1dHNbaV0uZ2V0QXR0cmlidXRlKCduYW1lJyldID1cbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2ldLnZhbHVlID09PSAoJ29uJyB8fCAnb2ZmJykgPyBpbnB1dHNbaV0uY2hlY2tlZCA6IGlucHV0c1tpXS52YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgYW4gY2hlY2sgb3IgY3Jvc3MgaWNvbiAsIGRldGVybWluZSBieSBib29sVmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBib29sVmFsdWVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9nZXRJY29uID0gKGJvb2xWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hlY2sgPSAnZmEtY2hlY2snO1xuICAgICAgICAgICAgY29uc3QgY3Jvc3MgPSAnZmEtdGltZXMnO1xuXG4gICAgICAgICAgICByZXR1cm4gYm9vbFZhbHVlID8gX2NyZWF0ZUlUYWcoY2hlY2spIDogX2NyZWF0ZUlUYWcoY3Jvc3MpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIHRhYmxlIGNvbHVtbiB3aXRoIGFuIGljb24gaW4gaXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBib29sVmFsdWVcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbmFsQm9vbFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2dldEljb25Db2x1bW4gPSAoYm9vbFZhbHVlLCBvcHRpb25hbEJvb2wgPSBudWxsKSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9uYWxCb29sID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jcmVhdGVUYWJsZUNvbHVtbigpLmFwcGVuZChfZ2V0SWNvbihib29sVmFsdWUpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIF9jcmVhdGVUYWJsZUNvbHVtbigpLmFwcGVuZChfZ2V0SWNvbihib29sVmFsdWUpLmFwcGVuZCgnIHwgJykuYXBwZW5kKF9nZXRJY29uKG9wdGlvbmFsQm9vbCkpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhbiBhY3Rpb24gY29sdW1uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gaWRcbiAgICAgICAgICogQHBhcmFtIGRlZmF1bHRTZXR0aW5nXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfZ2V0QWN0aW9uQ29sdW1uID0gKGlkLCBkZWZhdWx0U2V0dGluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGFjdGlvbnNDb250YWluZXIgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ3B1bGwtcmlnaHQgYWN0aW9uLWxpc3QgdmlzaWJsZS1vbi1ob3ZlcidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgJGFjdGlvbnNDb2x1bW4gPSAkKCc8dGQvPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYWN0aW9ucydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgJGVkaXQgPSAkKCc8aS8+Jywge1xuICAgICAgICAgICAgICAgICdkYXRhLWlkJzogaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGF0YS10b2dnbGUnOiAnbW9kYWwnLFxuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdmYSBmYS1wZW5jaWwgZWRpdCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0ICRkZWxldGUgPSAkKCc8aS8+Jywge1xuICAgICAgICAgICAgICAgICdkYXRhLWlkJzogaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGF0YS10b2dnbGUnOiAnbW9kYWwnLFxuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdmYSBmYS10cmFzaC1vIGRlbGV0ZSdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoaWQgPiAzICYmICFkZWZhdWx0U2V0dGluZykge1xuICAgICAgICAgICAgICAgICRhY3Rpb25zQ29udGFpbmVyLmFwcGVuZCgkZWRpdCkuYXBwZW5kKCRkZWxldGUpLmFwcGVuZFRvKCRhY3Rpb25zQ29sdW1uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGFjdGlvbnNDb250YWluZXIuYXBwZW5kKCRlZGl0KS5hcHBlbmRUbygkYWN0aW9uc0NvbHVtbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkYWN0aW9uc0NvbHVtbjtcbiAgICAgICAgfTtcblxuICAgICAgICAvL1NldHRlclxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIGNoZWNrYm94ZXMgaW4gZnJvbSB0byB0cnVlLCBpZiByZXNwb25zZSBkYXRhIGlzIHRydWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByZXNwb25zZSB7e319XG4gICAgICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NldENoZWNrQm94ZXMgPSAocmVzcG9uc2UsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZVtkYXRhXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZChgaW5wdXRbbmFtZT1cIiR7ZGF0YX1cIl1gKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIHJlc3BvbnNlW2RhdGFdKVxuICAgICAgICAgICAgICAgICAgICAudmFsKCdvbicpXG4gICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoJy5zd2l0Y2hlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBuYW1lIGlucHV0cyBieSBsYW5ndWFnZSBjb2RlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbmFtZSB7e1xuICAgICAgICAgKiAgICAgICAgICAgICAgIExhbmd1YWdlQ29kZSA6IFN0cmluZ1xuICAgICAgICAgKiAgICAgICAgICAgICB9fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NldE5hbWVJbnB1dHMgPSAobmFtZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgbGFuZ3VhZ2VDb2RlIGluIG5hbWUpIHtcbiAgICAgICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoYC5jdXN0b21lci1ncm91cC1uYW1lLSR7bGFuZ3VhZ2VDb2RlfWApLnZhbChuYW1lW2xhbmd1YWdlQ29kZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBpbnB1dCBkYXRhIGZyb20gcmVzcG9uc2Ugb2JqZWN0IHRvIHRoZSBpbnB1dCBmaWVsZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSByZXNwb25zZSB7e319XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfc2V0SW5wdXREYXRhID0gKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBkYXRhICBpbiByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHJlc3BvbnNlW2RhdGFdKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgIF9zZXRDaGVja0JveGVzKHJlc3BvbnNlLCBkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkZWRpdE1vZGFsLmZpbmQoYGlucHV0W25hbWU9XCIke2RhdGF9XCJdYCkudmFsKHJlc3BvbnNlW2RhdGFdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSGVscGVyIGZ1bmN0aW9uc1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIaWRlcyBlbGVtZW50IGlmIGZpcnN0VmFsdWUgdHJ1ZSBvciB0aGUgc2FtZSBhcyB0aGUgc2Vjb25kIFZhbHVlLlxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgaGlkZGVuIGFuZCBmYWxzZSBpZiBub3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0gZmlyc3RWYWx1ZVxuICAgICAgICAgKiBAcGFyYW0gc2Vjb25kVmFsdWVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaGlkZUVsZW1lbnRCeVZhbHVlID0gKCRlbGVtZW50LCBmaXJzdFZhbHVlLCBzZWNvbmRWYWx1ZSA9IHRydWUpID0+IHtcbiAgICAgICAgICAgIGlmIChmaXJzdFZhbHVlID09PSBzZWNvbmRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICRlbGVtZW50LmhpZGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG93cyBlbGVtZW50IGlmIGZpcnN0VmFsdWUgdHJ1ZSBvciB0aGUgc2FtZSBhcyB0aGUgc2Vjb25kIFZhbHVlLlxuICAgICAgICAgKiBSZXR1cm5zIHRydWUgaWYgU2hvd24gYW5kIGZhbHNlIGlmIG5vdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSBmaXJzdFZhbHVlXG4gICAgICAgICAqIEBwYXJhbSBzZWNvbmRWYWx1ZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zaG93RWxlbWVudEJ5VmFsdWUgPSAoJGVsZW1lbnQsIGZpcnN0VmFsdWUsIHNlY29uZFZhbHVlID0gdHJ1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGZpcnN0VmFsdWUgPT09IHNlY29uZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQuc2hvdygpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gZXZlbnQgaGFuZGxlclxuXG4gICAgICAgIC8vIGluaXRpYWxpemF0aW9uXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG5cblxuICAgICAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gbG9naWNcbiAgICAgICAgICAgICRjcmVhdGlvbk1vZGFsLmZpbmQoJy5idG4tcHJpbWFyeScpLm9uKCdjbGljaycsIF9pbml0Q3JlYXRlQ3VzdG9tZXJHcm91cCk7XG4gICAgICAgICAgICAkZGVsZXRlTW9kYWwuZmluZCgnLmJ0bi1kYW5nZXInKS5vbignY2xpY2snLCBfaW50aURlbGV0ZUN1c3RvbWVyR3JvdXApO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCcuYnRuLXByaW1hcnknKS5vbignY2xpY2snLCBfaW5pdEVkaXRDdXN0b21lckdyb3VwKTtcbiAgICAgICAgICAgICRkZWxldGVNb2RhbC5maW5kKCcuYnRuIGJ0bi1kZWZhdWx0Jykub24oJ2NsaWNrJywgJGRlbGV0ZU1vZGFsLmZpbmQoJy5yZW1vdmUtaW5mbycpLmVtcHR5KCkpO1xuXG4gICAgICAgICAgICAvL2FjdGlvbnNcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5kZWxldGUnKS5vbignY2xpY2snLCBfaW5pdERlbGV0ZU1vZGFsKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5lZGl0Jykub24oJ2NsaWNrJywgX2luaXRFZGl0TW9kYWwpO1xuXG4gICAgICAgICAgICAkY3JlYXRpb25Nb2RhbC5vbignaGlkZS5icy5tb2RhbCcsIF9pbml0Q2xlYW51cENyZWF0aW9uTW9kYWwpO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5vbignaGlkZS5icy5tb2RhbCcsIF9pbml0Q2xlYW51cEVkaXRNb2RhbCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG5cbiAgICB9KVxuO1xuIl19
