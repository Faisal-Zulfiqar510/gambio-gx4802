'use strict';

/* --------------------------------------------------------------
 orders_table_controller.js 2016-10-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Orders Table Controller
 *
 * This controller contains the mapping logic of the orders table.
 *
 * @module Compatibility/orders_table_controller
 */
gx.compatibility.module('orders_table_controller', [gx.source + '/libs/action_mapper', gx.source + '/libs/button_dropdown'],

/**  @lends module:Compatibility/orders_table_controller */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @var {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Array of mapped buttons
     *
     * @var Array
     */
    mappedButtons = [],


    /**
     * The mapper library
     *
     * @var {object}
     */
    mapper = jse.libs.action_mapper,


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Disable/Enable the buttons on the bottom button-dropdown
     * dependent on the checkboxes selection
     * @private
     */
    var _toggleMultiActionButton = function _toggleMultiActionButton() {
        var $checked = $('tr[data-row-id] input[type="checkbox"]:checked');
        $('.js-bottom-dropdown button').prop('disabled', !$checked.length);
    };

    /**
     * Map actions for every row in the table.
     *
     * This method will map the actions for each
     * row of the table.
     *
     * @private
     */
    var _mapRowAction = function _mapRowAction($that) {
        /**
         * Reference to the row action dropdown
         * @var {object | jQuery}
         */
        var $dropdown = $that.find('.js-button-dropdown');

        if ($dropdown.length) {
            _mapRowButtonDropdown($dropdown);
        }
    };

    var _mapRowButtonDropdown = function _mapRowButtonDropdown($dropdown) {
        var actions = ['TEXT_SHOW', 'TEXT_GM_STATUS', 'delete', 'BUTTON_GM_CANCEL', 'BUTTON_CREATE_INVOICE', 'TITLE_INVOICE_MAIL', 'BUTTON_CREATE_PACKING_SLIP', 'TITLE_ORDER', 'TITLE_RECREATE_ORDER', 'TITLE_SEND_ORDER', 'TEXT_CREATE_WITHDRAWAL', 'TXT_PARCEL_TRACKING_SENDBUTTON_TITLE', 'BUTTON_DHL_LABEL', 'MAILBEEZ_OVERVIEW', 'MAILBEEZ_NOTIFICATIONS', 'MAILBEEZ_CONVERSATIONS', 'BUTTON_HERMES'];

        for (var index in actions) {
            _bindEventHandler($dropdown, actions[index], '.single-order-dropdown');
        }
    };

    /**
     * Defines the language section for each text tile
     *
     * @type {object}
     * @private
     */
    var _sectionMapping = {
        'TEXT_SHOW': 'orders',
        'TEXT_GM_STATUS': 'orders',
        'delete': 'buttons',
        'BUTTON_GM_CANCEL': 'orders',
        'BUTTON_CREATE_INVOICE': 'orders',
        'TITLE_INVOICE_MAIL': 'orders',
        'BUTTON_CREATE_PACKING_SLIP': 'orders',
        'TITLE_ORDER': 'orders',
        'TITLE_RECREATE_ORDER': 'orders',
        'TITLE_SEND_ORDER': 'orders',
        'TEXT_CREATE_WITHDRAWAL': 'orders',
        'TXT_PARCEL_TRACKING_SENDBUTTON_TITLE': 'parcel_services',
        'BUTTON_DHL_LABEL': 'orders',
        'MAILBEEZ_OVERVIEW': 'orders',
        'MAILBEEZ_NOTIFICATIONS': 'orders',
        'MAILBEEZ_CONVERSATIONS': 'orders',
        'BUTTON_MULTI_CANCEL': 'orders',
        'BUTTON_MULTI_CHANGE_ORDER_STATUS': 'orders',
        'BUTTON_MULTI_DELETE': 'orders',
        'BUTTON_HERMES': 'orders',
        'get_labels': 'iloxx'
    };

    /**
     * Defines target selectors
     *
     * @type {object}
     * @private
     */
    var _selectorMapping = {
        'TEXT_SHOW': '.contentTable .infoBoxContent a.btn-details',
        'TEXT_GM_STATUS': '.contentTable .infoBoxContent a.btn-update_order_status',
        'delete': '.contentTable .infoBoxContent a.btn-delete',
        'BUTTON_GM_CANCEL': '.contentTable .infoBoxContent .GM_CANCEL',
        'BUTTON_CREATE_INVOICE': '.contentTable .infoBoxContent a.btn-invoice',
        'TITLE_INVOICE_MAIL': '.contentTable .infoBoxContent .GM_INVOICE_MAIL',
        'BUTTON_CREATE_PACKING_SLIP': '.contentTable .infoBoxContent a.btn-packing_slip',
        'TITLE_ORDER': '.contentTable .infoBoxContent a.btn-order_confirmation',
        'TITLE_RECREATE_ORDER': '.contentTable .infoBoxContent a.btn-recreate_order_confirmation',
        'TITLE_SEND_ORDER': '.contentTable .infoBoxContent .GM_SEND_ORDER',
        'TEXT_CREATE_WITHDRAWAL': '.contentTable .infoBoxContent a.btn-create_withdrawal',
        'TXT_PARCEL_TRACKING_SENDBUTTON_TITLE': '.contentTable .infoBoxContent a.btn-add_tracking_code',
        'BUTTON_DHL_LABEL': '.contentTable .infoBoxContent a.btn-dhl_label',
        'MAILBEEZ_OVERVIEW': '.contentTable .infoBoxContent a.context_view_button.btn_left',
        'MAILBEEZ_NOTIFICATIONS': '.contentTable .infoBoxContent a.context_view_button.btn_middle',
        'MAILBEEZ_CONVERSATIONS': '.contentTable .infoBoxContent a.context_view_button.btn_right',
        'BUTTON_MULTI_CANCEL': '.contentTable .infoBoxContent a.btn-multi_cancel',
        'BUTTON_MULTI_CHANGE_ORDER_STATUS': '.contentTable .infoBoxContent a.btn-update_order_status',
        'BUTTON_MULTI_DELETE': '.contentTable .infoBoxContent a.btn-multi_delete',
        'BUTTON_HERMES': '.contentTable .infoBoxContent a.btn-hermes',
        'get_labels': '#iloxx_orders'
    };

    var _getActionCallback = function _getActionCallback(action) {
        switch (action) {
            case 'TEXT_SHOW':
                return _showOrderCallback;
            case 'TEXT_GM_STATUS':
                return _changeOrderStatusCallback;
            case 'delete':
                return _deleteCallback;
            case 'BUTTON_GM_CANCEL':
                return _cancelCallback;
            case 'BUTTON_CREATE_INVOICE':
                return _invoiceCallback;
            case 'TITLE_INVOICE_MAIL':
                return _emailInvoiceCallback;
            case 'BUTTON_CREATE_PACKING_SLIP':
                return _packingSlipCallback;
            case 'TITLE_ORDER':
                return _orderConfirmationCallback;
            case 'TITLE_RECREATE_ORDER':
                return _recreateOrderConfirmationCallback;
            case 'TITLE_SEND_ORDER':
                return _sendOrderConfirmationCallback;
            case 'TEXT_CREATE_WITHDRAWAL':
                return _withdrawalCallback;
            case 'TXT_PARCEL_TRACKING_SENDBUTTON_TITLE':
                return _addTrackingCodeCallback;
            case 'BUTTON_DHL_LABEL':
                return _dhlLabelCallback;
            case 'MAILBEEZ_OVERVIEW':
                return _mailBeezOverviewCallback;
            case 'MAILBEEZ_NOTIFICATIONS':
                return _mailBeezNotificationsCallback;
            case 'MAILBEEZ_CONVERSATIONS':
                return _mailBeezConversationsCallback;
            case 'BUTTON_MULTI_CANCEL':
                return _multiCancelCallback;
            case 'BUTTON_MULTI_CHANGE_ORDER_STATUS':
                return _multiChangeOrderStatusCallback;
            case 'BUTTON_MULTI_DELETE':
                return _multiDeleteCallback;
            case 'BUTTON_HERMES':
                return _hermesCallback;
            case 'get_labels':
                return _iloxxCallback;
        }
    };

    var _showOrderCallback = function _showOrderCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.TEXT_SHOW).attr('href');
        window.open(url.replace(/oID=(.*)&/, 'oID=' + orderId + '&'), '_self');
    };

    var _changeOrderStatusCallback = function _changeOrderStatusCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        $('#gm_order_id').val(orderId);
        $('.gx-orders-table .single-checkbox').removeClass('checked');
        $('.gx-orders-table input:checkbox').prop('checked', false);
        $(event.target).parents('tr').eq(0).find('.single-checkbox').addClass('checked');
        $(event.target).parents('tr').eq(0).find('input:checkbox').prop('checked', true);
        $(_selectorMapping.TEXT_GM_STATUS).click();
    };

    var _deleteCallback = function _deleteCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var $delete = $(_selectorMapping.delete);
        $delete.data('order_id', orderId);
        $delete.get(0).click();
    };

    var _cancelCallback = function _cancelCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        $('#gm_order_id').val(orderId);
        $('.gx-orders-table .single-checkbox').removeClass('checked');
        $('.gx-orders-table input:checkbox').prop('checked', false);
        $(event.target).parents('tr').eq(0).find('.single-checkbox').addClass('checked');
        $(event.target).parents('tr').eq(0).find('input:checkbox').prop('checked', true);
        $(_selectorMapping.BUTTON_MULTI_CANCEL).click();
    };

    var _invoiceCallback = function _invoiceCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.BUTTON_CREATE_INVOICE).attr('href');
        window.open(url.replace(/oID=(.*)&/, 'oID=' + orderId + '&'), '_blank');
    };

    var _emailInvoiceCallback = function _emailInvoiceCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        $('#gm_order_id').val(orderId);
        $('.GM_INVOICE_MAIL').click();
    };

    var _packingSlipCallback = function _packingSlipCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.BUTTON_CREATE_PACKING_SLIP).attr('href');
        window.open(url.replace(/oID=(.*)&/, 'oID=' + orderId + '&'), '_blank');
    };

    var _orderConfirmationCallback = function _orderConfirmationCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.TITLE_ORDER).attr('href');
        window.open(url.replace(/oID=(.*)&/, 'oID=' + orderId + '&'), '_blank');
    };

    var _recreateOrderConfirmationCallback = function _recreateOrderConfirmationCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.TITLE_RECREATE_ORDER).attr('href');
        window.open(url.replace(/oID=(.*)&/, 'oID=' + orderId + '&'), '_blank');
    };

    var _sendOrderConfirmationCallback = function _sendOrderConfirmationCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        $('#gm_order_id').val(orderId);
        $('.GM_SEND_ORDER').click();
    };

    var _withdrawalCallback = function _withdrawalCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.TEXT_CREATE_WITHDRAWAL).attr('href');
        window.open(url.replace(/order=[^&]*/, 'order_id=' + orderId), '_blank');
    };

    var _addTrackingCodeCallback = function _addTrackingCodeCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var $target = $(_selectorMapping.TXT_PARCEL_TRACKING_SENDBUTTON_TITLE);
        $target.data('order_id', orderId);
        $target.get(0).click();
    };

    var _dhlLabelCallback = function _dhlLabelCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var url = $(_selectorMapping.BUTTON_DHL_LABEL).attr('href');
        window.open(url.replace(/oID=(.*)/, 'oID=' + orderId), '_blank');
    };

    var _mailBeezOverviewCallback = function _mailBeezOverviewCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var $target = $(_selectorMapping.MAILBEEZ_OVERVIEW);
        var url = $target.attr('onclick');
        url = url.replace(/oID=(.*)&/, 'oID=' + orderId + '&');
        $target.attr('onclick', url);
        $target.get(0).click();
    };

    var _mailBeezNotificationsCallback = function _mailBeezNotificationsCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var $target = $(_selectorMapping.MAILBEEZ_NOTIFICATIONS);
        var url = $target.attr('onclick');
        url = url.replace(/oID=(.*)&/, 'oID=' + orderId + '&');
        $target.attr('onclick', url);
        $target.get(0).click();
    };

    var _mailBeezConversationsCallback = function _mailBeezConversationsCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var $target = $(_selectorMapping.MAILBEEZ_CONVERSATIONS);
        var url = $target.attr('onclick');
        url = url.replace(/oID=(.*)&/, 'oID=' + orderId + '&');
        $target.attr('onclick', url);
        $target.get(0).click();
    };

    var _hermesCallback = function _hermesCallback(event) {
        var orderId = $(event.target).parents('tr').data('row-id');
        var $target = $(_selectorMapping.BUTTON_HERMES);
        var url = $target.attr('href');
        url = url.replace(/orders_id=(.*)/, 'orders_id=' + orderId);
        $target.attr('href', url);
        $target.get(0).click();
    };

    var _iloxxCallback = function _iloxxCallback(event) {
        var $target = $(_selectorMapping.get_labels);
        $target.click();
    };

    var _multiChangeOrderStatusCallback = function _multiChangeOrderStatusCallback(event) {
        $(_selectorMapping.BUTTON_MULTI_CHANGE_ORDER_STATUS).get(0).click();
    };

    var _multiDeleteCallback = function _multiDeleteCallback(event) {
        $(_selectorMapping.BUTTON_MULTI_DELETE).get(0).click();
    };

    var _multiCancelCallback = function _multiCancelCallback(event) {
        $(_selectorMapping.BUTTON_MULTI_CANCEL).get(0).click();
    };

    /**
     * Map table actions to bottom dropdown button.
     *
     * @private
     */
    var _mapTableActions = function _mapTableActions() {
        var $dropdown = $('#orders-table-dropdown');

        _bindEventHandler($dropdown, 'BUTTON_MULTI_CHANGE_ORDER_STATUS');

        if ($(_selectorMapping.get_labels).length) {
            _bindEventHandler($dropdown, 'get_labels');
        }

        _bindEventHandler($dropdown, 'BUTTON_MULTI_DELETE');
        _bindEventHandler($dropdown, 'BUTTON_MULTI_CANCEL');
    };

    /**
     * Map actions for every row in the table generically.
     *
     * This method will use the action_mapper library to map the actions for each
     * row of the table. It maps only those buttons, that haven't already explicitly
     * mapped by the _mapRowActions function.
     *
     * @private
     */
    var _mapUnmappedRowActions = function _mapUnmappedRowActions($this) {
        var unmappedRowActions = [];
        $('.action_buttons .extended_single_actions a,' + '.action_buttons .extended_single_actions button,' + '.action_buttons .extended_single_actions input[type="button"],' + '.action_buttons .extended_single_actions input[type="submit"]').each(function () {
            if (!_alreadyMapped($(this))) {
                unmappedRowActions.push($(this));
            }
        });

        var orderId = $this.data('row-id'),
            $dropdown = $this.find('.js-button-dropdown');

        $.each(unmappedRowActions, function () {
            var $button = $(this);
            var callback = function callback() {
                if ($button.prop('href') !== undefined) {
                    $button.prop('href', $button.prop('href').replace(/oID=(.*)\d(?=&)?/, 'oID=' + orderId));
                }
                $button.get(0).click();
            };

            jse.libs.button_dropdown.mapAction($dropdown, $button.text(), '', callback);
            mappedButtons.push($button);
        });
    };

    var _mapUnmappedMultiActions = function _mapUnmappedMultiActions() {
        var unmappedMultiActions = [];
        $('.action_buttons .extended_multi_actions a,' + '.action_buttons .extended_multi_actions button,' + '.action_buttons .extended_multi_actions input[type="button"],' + '.action_buttons .extended_multi_actions input[type="submit"]').each(function () {
            if (!_alreadyMapped($(this))) {
                unmappedMultiActions.push($(this));
            }
        });

        var $dropdown = $('#orders-table-dropdown');
        $.each(unmappedMultiActions, function () {
            var $button = $(this);
            var callback = function callback() {
                $button.get(0).click();
            };

            jse.libs.button_dropdown.mapAction($dropdown, $button.text(), '', callback);
            mappedButtons.push($button);
        });
    };

    /**
     * Checks if the button was already mapped
     *
     * @private
     */
    var _alreadyMapped = function _alreadyMapped($button) {
        for (var index in mappedButtons) {
            if ($button.is(mappedButtons[index])) {
                return true;
            }
        }
        return false;
    };

    /**
     * Add Button to Mapped Array
     *
     * @param buttonSelector
     * @returns {boolean}
     *
     * @private
     */
    var _addButtonToMappedArray = function _addButtonToMappedArray(buttonSelector) {
        if (mappedButtons[buttonSelector] !== undefined) {
            return true;
        }
        mappedButtons[buttonSelector] = $(buttonSelector);
    };

    /**
     * Bind Event handler
     *
     * @param $dropdown
     * @param action
     * @param customRecentButtonSelector
     *
     * @private
     */
    var _bindEventHandler = function _bindEventHandler($dropdown, action, customRecentButtonSelector) {
        var targetSelector = _selectorMapping[action],
            section = _sectionMapping[action],
            callback = _getActionCallback(action),
            customElement = $(customRecentButtonSelector).length ? $(customRecentButtonSelector) : $dropdown;
        if ($(targetSelector).length) {
            _addButtonToMappedArray(targetSelector);
            jse.libs.button_dropdown.mapAction($dropdown, action, section, callback, customElement);
        }
    };

    /**
     * Fix for row selection controls.
     *
     * @private
     */
    var _fixRowSelectionForControlElements = function _fixRowSelectionForControlElements() {
        $('input.checkbox[name="gm_multi_status[]"]').add('.single-checkbox').add('a.action-icon').add('.js-button-dropdown').add('tr.dataTableRow a').on('click', function (event) {
            event.stopPropagation();
            _toggleMultiActionButton();
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Wait until the buttons are converted to dropdown for every row.
        var interval = setInterval(function () {
            if ($('.js-button-dropdown').length) {
                clearInterval(interval);

                _mapTableActions();
                _mapUnmappedMultiActions();

                var tableActions = mappedButtons;

                // Remove Mailbeez conversations badge.
                _addButtonToMappedArray('.contentTable .infoBoxContent a.context_view_button.btn_right');

                $('.gx-orders-table tr').not('.dataTableHeadingRow').each(function () {
                    mappedButtons = [];

                    for (var index in tableActions) {
                        mappedButtons[index] = tableActions[index];
                    }

                    _mapRowAction($(this));
                    _mapUnmappedRowActions($(this));
                });

                _fixRowSelectionForControlElements();

                // Initialize checkboxes
                _toggleMultiActionButton();
            }
        }, 300);

        // Check for selected checkboxes also
        // before all rows and their dropdown widgets have been initialized.
        _toggleMultiActionButton();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfdGFibGVfY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwibWFwcGVkQnV0dG9ucyIsIm1hcHBlciIsImpzZSIsImxpYnMiLCJhY3Rpb25fbWFwcGVyIiwiX3RvZ2dsZU11bHRpQWN0aW9uQnV0dG9uIiwiJGNoZWNrZWQiLCJwcm9wIiwibGVuZ3RoIiwiX21hcFJvd0FjdGlvbiIsIiR0aGF0IiwiJGRyb3Bkb3duIiwiZmluZCIsIl9tYXBSb3dCdXR0b25Ecm9wZG93biIsImFjdGlvbnMiLCJpbmRleCIsIl9iaW5kRXZlbnRIYW5kbGVyIiwiX3NlY3Rpb25NYXBwaW5nIiwiX3NlbGVjdG9yTWFwcGluZyIsIl9nZXRBY3Rpb25DYWxsYmFjayIsImFjdGlvbiIsIl9zaG93T3JkZXJDYWxsYmFjayIsIl9jaGFuZ2VPcmRlclN0YXR1c0NhbGxiYWNrIiwiX2RlbGV0ZUNhbGxiYWNrIiwiX2NhbmNlbENhbGxiYWNrIiwiX2ludm9pY2VDYWxsYmFjayIsIl9lbWFpbEludm9pY2VDYWxsYmFjayIsIl9wYWNraW5nU2xpcENhbGxiYWNrIiwiX29yZGVyQ29uZmlybWF0aW9uQ2FsbGJhY2siLCJfcmVjcmVhdGVPcmRlckNvbmZpcm1hdGlvbkNhbGxiYWNrIiwiX3NlbmRPcmRlckNvbmZpcm1hdGlvbkNhbGxiYWNrIiwiX3dpdGhkcmF3YWxDYWxsYmFjayIsIl9hZGRUcmFja2luZ0NvZGVDYWxsYmFjayIsIl9kaGxMYWJlbENhbGxiYWNrIiwiX21haWxCZWV6T3ZlcnZpZXdDYWxsYmFjayIsIl9tYWlsQmVlek5vdGlmaWNhdGlvbnNDYWxsYmFjayIsIl9tYWlsQmVlekNvbnZlcnNhdGlvbnNDYWxsYmFjayIsIl9tdWx0aUNhbmNlbENhbGxiYWNrIiwiX211bHRpQ2hhbmdlT3JkZXJTdGF0dXNDYWxsYmFjayIsIl9tdWx0aURlbGV0ZUNhbGxiYWNrIiwiX2hlcm1lc0NhbGxiYWNrIiwiX2lsb3h4Q2FsbGJhY2siLCJldmVudCIsIm9yZGVySWQiLCJ0YXJnZXQiLCJwYXJlbnRzIiwidXJsIiwiVEVYVF9TSE9XIiwiYXR0ciIsIndpbmRvdyIsIm9wZW4iLCJyZXBsYWNlIiwidmFsIiwicmVtb3ZlQ2xhc3MiLCJlcSIsImFkZENsYXNzIiwiVEVYVF9HTV9TVEFUVVMiLCJjbGljayIsIiRkZWxldGUiLCJkZWxldGUiLCJnZXQiLCJCVVRUT05fTVVMVElfQ0FOQ0VMIiwiQlVUVE9OX0NSRUFURV9JTlZPSUNFIiwiQlVUVE9OX0NSRUFURV9QQUNLSU5HX1NMSVAiLCJUSVRMRV9PUkRFUiIsIlRJVExFX1JFQ1JFQVRFX09SREVSIiwiVEVYVF9DUkVBVEVfV0lUSERSQVdBTCIsIiR0YXJnZXQiLCJUWFRfUEFSQ0VMX1RSQUNLSU5HX1NFTkRCVVRUT05fVElUTEUiLCJCVVRUT05fREhMX0xBQkVMIiwiTUFJTEJFRVpfT1ZFUlZJRVciLCJNQUlMQkVFWl9OT1RJRklDQVRJT05TIiwiTUFJTEJFRVpfQ09OVkVSU0FUSU9OUyIsIkJVVFRPTl9IRVJNRVMiLCJnZXRfbGFiZWxzIiwiQlVUVE9OX01VTFRJX0NIQU5HRV9PUkRFUl9TVEFUVVMiLCJCVVRUT05fTVVMVElfREVMRVRFIiwiX21hcFRhYmxlQWN0aW9ucyIsIl9tYXBVbm1hcHBlZFJvd0FjdGlvbnMiLCJ1bm1hcHBlZFJvd0FjdGlvbnMiLCJlYWNoIiwiX2FscmVhZHlNYXBwZWQiLCJwdXNoIiwiJGJ1dHRvbiIsImNhbGxiYWNrIiwidW5kZWZpbmVkIiwiYnV0dG9uX2Ryb3Bkb3duIiwibWFwQWN0aW9uIiwidGV4dCIsIl9tYXBVbm1hcHBlZE11bHRpQWN0aW9ucyIsInVubWFwcGVkTXVsdGlBY3Rpb25zIiwiaXMiLCJfYWRkQnV0dG9uVG9NYXBwZWRBcnJheSIsImJ1dHRvblNlbGVjdG9yIiwiY3VzdG9tUmVjZW50QnV0dG9uU2VsZWN0b3IiLCJ0YXJnZXRTZWxlY3RvciIsInNlY3Rpb24iLCJjdXN0b21FbGVtZW50IiwiX2ZpeFJvd1NlbGVjdGlvbkZvckNvbnRyb2xFbGVtZW50cyIsImFkZCIsIm9uIiwic3RvcFByb3BhZ2F0aW9uIiwiaW5pdCIsImRvbmUiLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsInRhYmxlQWN0aW9ucyIsIm5vdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0kseUJBREosRUFHSSxDQUNJRixHQUFHRyxNQUFILEdBQVkscUJBRGhCLEVBRUlILEdBQUdHLE1BQUgsR0FBWSx1QkFGaEIsQ0FISjs7QUFRSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBcEJkOzs7QUFzQkk7Ozs7O0FBS0FNLG9CQUFnQixFQTNCcEI7OztBQTZCSTs7Ozs7QUFLQUMsYUFBU0MsSUFBSUMsSUFBSixDQUFTQyxhQWxDdEI7OztBQW9DSTs7Ozs7QUFLQVosYUFBUyxFQXpDYjs7QUEyQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFFBQUlhLDJCQUEyQixTQUEzQkEsd0JBQTJCLEdBQVk7QUFDdkMsWUFBSUMsV0FBV1YsRUFBRSxnREFBRixDQUFmO0FBQ0FBLFVBQUUsNEJBQUYsRUFBZ0NXLElBQWhDLENBQXFDLFVBQXJDLEVBQWlELENBQUNELFNBQVNFLE1BQTNEO0FBQ0gsS0FIRDs7QUFLQTs7Ozs7Ozs7QUFRQSxRQUFJQyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQVVDLEtBQVYsRUFBaUI7QUFDakM7Ozs7QUFJQSxZQUFJQyxZ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OEJBQWNGLFFBQWQ7O0FBRUEzQjtBQUNBWTs7QUFFQSxvQkFBSWtCLGVBQWUzRyxhQUFuQjs7QUFFQTtBQUNBNEYsd0NBQXdCLCtEQUF4Qjs7QUFFQWhHLGtCQUFFLHFCQUFGLEVBQXlCZ0gsR0FBekIsQ0FBNkIsc0JBQTdCLEVBQXFENUIsSUFBckQsQ0FBMEQsWUFBWTtBQUNsRWhGLG9DQUFnQixFQUFoQjs7QUFFQSx5QkFBSyxJQUFJZSxLQUFULElBQWtCNEYsWUFBbEIsRUFBZ0M7QUFDNUIzRyxzQ0FBY2UsS0FBZCxJQUF1QjRGLGFBQWE1RixLQUFiLENBQXZCO0FBQ0g7O0FBRUROLGtDQUFjYixFQUFFLElBQUYsQ0FBZDtBQUNBa0YsMkNBQXVCbEYsRUFBRSxJQUFGLENBQXZCO0FBQ0gsaUJBVEQ7O0FBV0FzRzs7QUFFQTtBQUNBN0Y7QUFDSDtBQUNKLFNBNUJjLEVBNEJaLEdBNUJZLENBQWY7O0FBOEJBO0FBQ0E7QUFDQUE7O0FBRUFrRztBQUNILEtBckNEOztBQXVDQSxXQUFPL0csTUFBUDtBQUNILENBOWlCTCIsImZpbGUiOiJvcmRlcnMvb3JkZXJzX3RhYmxlX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyc190YWJsZV9jb250cm9sbGVyLmpzIDIwMTYtMTAtMjNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIE9yZGVycyBUYWJsZSBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGNvbnRhaW5zIHRoZSBtYXBwaW5nIGxvZ2ljIG9mIHRoZSBvcmRlcnMgdGFibGUuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L29yZGVyc190YWJsZV9jb250cm9sbGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdvcmRlcnNfdGFibGVfY29udHJvbGxlcicsXG5cbiAgICBbXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9hY3Rpb25fbWFwcGVyJyxcbiAgICAgICAgZ3guc291cmNlICsgJy9saWJzL2J1dHRvbl9kcm9wZG93bidcbiAgICBdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvb3JkZXJzX3RhYmxlX2NvbnRyb2xsZXIgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBcnJheSBvZiBtYXBwZWQgYnV0dG9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIgQXJyYXlcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWFwcGVkQnV0dG9ucyA9IFtdLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFRoZSBtYXBwZXIgbGlicmFyeVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbWFwcGVyID0ganNlLmxpYnMuYWN0aW9uX21hcHBlcixcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZS9FbmFibGUgdGhlIGJ1dHRvbnMgb24gdGhlIGJvdHRvbSBidXR0b24tZHJvcGRvd25cbiAgICAgICAgICogZGVwZW5kZW50IG9uIHRoZSBjaGVja2JveGVzIHNlbGVjdGlvblxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF90b2dnbGVNdWx0aUFjdGlvbkJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkY2hlY2tlZCA9ICQoJ3RyW2RhdGEtcm93LWlkXSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCcpO1xuICAgICAgICAgICAgJCgnLmpzLWJvdHRvbS1kcm9wZG93biBidXR0b24nKS5wcm9wKCdkaXNhYmxlZCcsICEkY2hlY2tlZC5sZW5ndGgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgYWN0aW9ucyBmb3IgZXZlcnkgcm93IGluIHRoZSB0YWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBtYXAgdGhlIGFjdGlvbnMgZm9yIGVhY2hcbiAgICAgICAgICogcm93IG9mIHRoZSB0YWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbWFwUm93QWN0aW9uID0gZnVuY3Rpb24gKCR0aGF0KSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFJlZmVyZW5jZSB0byB0aGUgcm93IGFjdGlvbiBkcm9wZG93blxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0IHwgalF1ZXJ5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgJGRyb3Bkb3duID0gJHRoYXQuZmluZCgnLmpzLWJ1dHRvbi1kcm9wZG93bicpO1xuXG4gICAgICAgICAgICBpZiAoJGRyb3Bkb3duLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIF9tYXBSb3dCdXR0b25Ecm9wZG93bigkZHJvcGRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfbWFwUm93QnV0dG9uRHJvcGRvd24gPSBmdW5jdGlvbiAoJGRyb3Bkb3duKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtcbiAgICAgICAgICAgICAgICAnVEVYVF9TSE9XJyxcbiAgICAgICAgICAgICAgICAnVEVYVF9HTV9TVEFUVVMnLFxuICAgICAgICAgICAgICAgICdkZWxldGUnLFxuICAgICAgICAgICAgICAgICdCVVRUT05fR01fQ0FOQ0VMJyxcbiAgICAgICAgICAgICAgICAnQlVUVE9OX0NSRUFURV9JTlZPSUNFJyxcbiAgICAgICAgICAgICAgICAnVElUTEVfSU5WT0lDRV9NQUlMJyxcbiAgICAgICAgICAgICAgICAnQlVUVE9OX0NSRUFURV9QQUNLSU5HX1NMSVAnLFxuICAgICAgICAgICAgICAgICdUSVRMRV9PUkRFUicsXG4gICAgICAgICAgICAgICAgJ1RJVExFX1JFQ1JFQVRFX09SREVSJyxcbiAgICAgICAgICAgICAgICAnVElUTEVfU0VORF9PUkRFUicsXG4gICAgICAgICAgICAgICAgJ1RFWFRfQ1JFQVRFX1dJVEhEUkFXQUwnLFxuICAgICAgICAgICAgICAgICdUWFRfUEFSQ0VMX1RSQUNLSU5HX1NFTkRCVVRUT05fVElUTEUnLFxuICAgICAgICAgICAgICAgICdCVVRUT05fREhMX0xBQkVMJyxcbiAgICAgICAgICAgICAgICAnTUFJTEJFRVpfT1ZFUlZJRVcnLFxuICAgICAgICAgICAgICAgICdNQUlMQkVFWl9OT1RJRklDQVRJT05TJyxcbiAgICAgICAgICAgICAgICAnTUFJTEJFRVpfQ09OVkVSU0FUSU9OUycsXG4gICAgICAgICAgICAgICAgJ0JVVFRPTl9IRVJNRVMnXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpbmRleCBpbiBhY3Rpb25zKSB7XG4gICAgICAgICAgICAgICAgX2JpbmRFdmVudEhhbmRsZXIoJGRyb3Bkb3duLCBhY3Rpb25zW2luZGV4XSwgJy5zaW5nbGUtb3JkZXItZHJvcGRvd24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmaW5lcyB0aGUgbGFuZ3VhZ2Ugc2VjdGlvbiBmb3IgZWFjaCB0ZXh0IHRpbGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2VjdGlvbk1hcHBpbmcgPSB7XG4gICAgICAgICAgICAnVEVYVF9TSE9XJzogJ29yZGVycycsXG4gICAgICAgICAgICAnVEVYVF9HTV9TVEFUVVMnOiAnb3JkZXJzJyxcbiAgICAgICAgICAgICdkZWxldGUnOiAnYnV0dG9ucycsXG4gICAgICAgICAgICAnQlVUVE9OX0dNX0NBTkNFTCc6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ0JVVFRPTl9DUkVBVEVfSU5WT0lDRSc6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ1RJVExFX0lOVk9JQ0VfTUFJTCc6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ0JVVFRPTl9DUkVBVEVfUEFDS0lOR19TTElQJzogJ29yZGVycycsXG4gICAgICAgICAgICAnVElUTEVfT1JERVInOiAnb3JkZXJzJyxcbiAgICAgICAgICAgICdUSVRMRV9SRUNSRUFURV9PUkRFUic6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ1RJVExFX1NFTkRfT1JERVInOiAnb3JkZXJzJyxcbiAgICAgICAgICAgICdURVhUX0NSRUFURV9XSVRIRFJBV0FMJzogJ29yZGVycycsXG4gICAgICAgICAgICAnVFhUX1BBUkNFTF9UUkFDS0lOR19TRU5EQlVUVE9OX1RJVExFJzogJ3BhcmNlbF9zZXJ2aWNlcycsXG4gICAgICAgICAgICAnQlVUVE9OX0RITF9MQUJFTCc6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ01BSUxCRUVaX09WRVJWSUVXJzogJ29yZGVycycsXG4gICAgICAgICAgICAnTUFJTEJFRVpfTk9USUZJQ0FUSU9OUyc6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ01BSUxCRUVaX0NPTlZFUlNBVElPTlMnOiAnb3JkZXJzJyxcbiAgICAgICAgICAgICdCVVRUT05fTVVMVElfQ0FOQ0VMJzogJ29yZGVycycsXG4gICAgICAgICAgICAnQlVUVE9OX01VTFRJX0NIQU5HRV9PUkRFUl9TVEFUVVMnOiAnb3JkZXJzJyxcbiAgICAgICAgICAgICdCVVRUT05fTVVMVElfREVMRVRFJzogJ29yZGVycycsXG4gICAgICAgICAgICAnQlVUVE9OX0hFUk1FUyc6ICdvcmRlcnMnLFxuICAgICAgICAgICAgJ2dldF9sYWJlbHMnOiAnaWxveHgnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmluZXMgdGFyZ2V0IHNlbGVjdG9yc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zZWxlY3Rvck1hcHBpbmcgPSB7XG4gICAgICAgICAgICAnVEVYVF9TSE9XJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLWRldGFpbHMnLFxuICAgICAgICAgICAgJ1RFWFRfR01fU1RBVFVTJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLXVwZGF0ZV9vcmRlcl9zdGF0dXMnLFxuICAgICAgICAgICAgJ2RlbGV0ZSc6ICcuY29udGVudFRhYmxlIC5pbmZvQm94Q29udGVudCBhLmJ0bi1kZWxldGUnLFxuICAgICAgICAgICAgJ0JVVFRPTl9HTV9DQU5DRUwnOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgLkdNX0NBTkNFTCcsXG4gICAgICAgICAgICAnQlVUVE9OX0NSRUFURV9JTlZPSUNFJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLWludm9pY2UnLFxuICAgICAgICAgICAgJ1RJVExFX0lOVk9JQ0VfTUFJTCc6ICcuY29udGVudFRhYmxlIC5pbmZvQm94Q29udGVudCAuR01fSU5WT0lDRV9NQUlMJyxcbiAgICAgICAgICAgICdCVVRUT05fQ1JFQVRFX1BBQ0tJTkdfU0xJUCc6ICcuY29udGVudFRhYmxlIC5pbmZvQm94Q29udGVudCBhLmJ0bi1wYWNraW5nX3NsaXAnLFxuICAgICAgICAgICAgJ1RJVExFX09SREVSJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLW9yZGVyX2NvbmZpcm1hdGlvbicsXG4gICAgICAgICAgICAnVElUTEVfUkVDUkVBVEVfT1JERVInOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5idG4tcmVjcmVhdGVfb3JkZXJfY29uZmlybWF0aW9uJyxcbiAgICAgICAgICAgICdUSVRMRV9TRU5EX09SREVSJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IC5HTV9TRU5EX09SREVSJyxcbiAgICAgICAgICAgICdURVhUX0NSRUFURV9XSVRIRFJBV0FMJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLWNyZWF0ZV93aXRoZHJhd2FsJyxcbiAgICAgICAgICAgICdUWFRfUEFSQ0VMX1RSQUNLSU5HX1NFTkRCVVRUT05fVElUTEUnOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5idG4tYWRkX3RyYWNraW5nX2NvZGUnLFxuICAgICAgICAgICAgJ0JVVFRPTl9ESExfTEFCRUwnOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5idG4tZGhsX2xhYmVsJyxcbiAgICAgICAgICAgICdNQUlMQkVFWl9PVkVSVklFVyc6ICcuY29udGVudFRhYmxlIC5pbmZvQm94Q29udGVudCBhLmNvbnRleHRfdmlld19idXR0b24uYnRuX2xlZnQnLFxuICAgICAgICAgICAgJ01BSUxCRUVaX05PVElGSUNBVElPTlMnOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5jb250ZXh0X3ZpZXdfYnV0dG9uLmJ0bl9taWRkbGUnLFxuICAgICAgICAgICAgJ01BSUxCRUVaX0NPTlZFUlNBVElPTlMnOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5jb250ZXh0X3ZpZXdfYnV0dG9uLmJ0bl9yaWdodCcsXG4gICAgICAgICAgICAnQlVUVE9OX01VTFRJX0NBTkNFTCc6ICcuY29udGVudFRhYmxlIC5pbmZvQm94Q29udGVudCBhLmJ0bi1tdWx0aV9jYW5jZWwnLFxuICAgICAgICAgICAgJ0JVVFRPTl9NVUxUSV9DSEFOR0VfT1JERVJfU1RBVFVTJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLXVwZGF0ZV9vcmRlcl9zdGF0dXMnLFxuICAgICAgICAgICAgJ0JVVFRPTl9NVUxUSV9ERUxFVEUnOiAnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5idG4tbXVsdGlfZGVsZXRlJyxcbiAgICAgICAgICAgICdCVVRUT05fSEVSTUVTJzogJy5jb250ZW50VGFibGUgLmluZm9Cb3hDb250ZW50IGEuYnRuLWhlcm1lcycsXG4gICAgICAgICAgICAnZ2V0X2xhYmVscyc6ICcjaWxveHhfb3JkZXJzJ1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfZ2V0QWN0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RFWFRfU0hPVyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfc2hvd09yZGVyQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEVYVF9HTV9TVEFUVVMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NoYW5nZU9yZGVyU3RhdHVzQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9kZWxldGVDYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYXNlICdCVVRUT05fR01fQ0FOQ0VMJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jYW5jZWxDYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYXNlICdCVVRUT05fQ1JFQVRFX0lOVk9JQ0UnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2ludm9pY2VDYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYXNlICdUSVRMRV9JTlZPSUNFX01BSUwnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2VtYWlsSW52b2ljZUNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0JVVFRPTl9DUkVBVEVfUEFDS0lOR19TTElQJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wYWNraW5nU2xpcENhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RJVExFX09SREVSJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9vcmRlckNvbmZpcm1hdGlvbkNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RJVExFX1JFQ1JFQVRFX09SREVSJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yZWNyZWF0ZU9yZGVyQ29uZmlybWF0aW9uQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FzZSAnVElUTEVfU0VORF9PUkRFUic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfc2VuZE9yZGVyQ29uZmlybWF0aW9uQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEVYVF9DUkVBVEVfV0lUSERSQVdBTCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfd2l0aGRyYXdhbENhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1RYVF9QQVJDRUxfVFJBQ0tJTkdfU0VOREJVVFRPTl9USVRMRSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfYWRkVHJhY2tpbmdDb2RlQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FzZSAnQlVUVE9OX0RITF9MQUJFTCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfZGhsTGFiZWxDYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYXNlICdNQUlMQkVFWl9PVkVSVklFVyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfbWFpbEJlZXpPdmVydmlld0NhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ01BSUxCRUVaX05PVElGSUNBVElPTlMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX21haWxCZWV6Tm90aWZpY2F0aW9uc0NhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ01BSUxCRUVaX0NPTlZFUlNBVElPTlMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX21haWxCZWV6Q29udmVyc2F0aW9uc0NhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0JVVFRPTl9NVUxUSV9DQU5DRUwnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX211bHRpQ2FuY2VsQ2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgY2FzZSAnQlVUVE9OX01VTFRJX0NIQU5HRV9PUkRFUl9TVEFUVVMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX211bHRpQ2hhbmdlT3JkZXJTdGF0dXNDYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYXNlICdCVVRUT05fTVVMVElfREVMRVRFJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9tdWx0aURlbGV0ZUNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0JVVFRPTl9IRVJNRVMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2hlcm1lc0NhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2dldF9sYWJlbHMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2lsb3h4Q2FsbGJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9zaG93T3JkZXJDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKF9zZWxlY3Rvck1hcHBpbmcuVEVYVF9TSE9XKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICB3aW5kb3cub3Blbih1cmwucmVwbGFjZSgvb0lEPSguKikmLywgJ29JRD0nICsgb3JkZXJJZCArICcmJyksICdfc2VsZicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfY2hhbmdlT3JkZXJTdGF0dXNDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgICQoJyNnbV9vcmRlcl9pZCcpLnZhbChvcmRlcklkKTtcbiAgICAgICAgICAgICQoJy5neC1vcmRlcnMtdGFibGUgLnNpbmdsZS1jaGVja2JveCcpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAkKCcuZ3gtb3JkZXJzLXRhYmxlIGlucHV0OmNoZWNrYm94JykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmVxKDApLmZpbmQoJy5zaW5nbGUtY2hlY2tib3gnKS5hZGRDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZXEoMCkuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAkKF9zZWxlY3Rvck1hcHBpbmcuVEVYVF9HTV9TVEFUVVMpLmNsaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9kZWxldGVDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgIHZhciAkZGVsZXRlID0gJChfc2VsZWN0b3JNYXBwaW5nLmRlbGV0ZSk7XG4gICAgICAgICAgICAkZGVsZXRlLmRhdGEoJ29yZGVyX2lkJywgb3JkZXJJZCk7XG4gICAgICAgICAgICAkZGVsZXRlLmdldCgwKS5jbGljaygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfY2FuY2VsQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJyk7XG4gICAgICAgICAgICAkKCcjZ21fb3JkZXJfaWQnKS52YWwob3JkZXJJZCk7XG4gICAgICAgICAgICAkKCcuZ3gtb3JkZXJzLXRhYmxlIC5zaW5nbGUtY2hlY2tib3gnKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgJCgnLmd4LW9yZGVycy10YWJsZSBpbnB1dDpjaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5lcSgwKS5maW5kKCcuc2luZ2xlLWNoZWNrYm94JykuYWRkQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmVxKDApLmZpbmQoJ2lucHV0OmNoZWNrYm94JykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgJChfc2VsZWN0b3JNYXBwaW5nLkJVVFRPTl9NVUxUSV9DQU5DRUwpLmNsaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9pbnZvaWNlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJyk7XG4gICAgICAgICAgICB2YXIgdXJsID0gJChfc2VsZWN0b3JNYXBwaW5nLkJVVFRPTl9DUkVBVEVfSU5WT0lDRSkuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLnJlcGxhY2UoL29JRD0oLiopJi8sICdvSUQ9JyArIG9yZGVySWQgKyAnJicpLCAnX2JsYW5rJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9lbWFpbEludm9pY2VDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgICQoJyNnbV9vcmRlcl9pZCcpLnZhbChvcmRlcklkKTtcbiAgICAgICAgICAgICQoJy5HTV9JTlZPSUNFX01BSUwnKS5jbGljaygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfcGFja2luZ1NsaXBDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKF9zZWxlY3Rvck1hcHBpbmcuQlVUVE9OX0NSRUFURV9QQUNLSU5HX1NMSVApLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybC5yZXBsYWNlKC9vSUQ9KC4qKSYvLCAnb0lEPScgKyBvcmRlcklkICsgJyYnKSwgJ19ibGFuaycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfb3JkZXJDb25maXJtYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKF9zZWxlY3Rvck1hcHBpbmcuVElUTEVfT1JERVIpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybC5yZXBsYWNlKC9vSUQ9KC4qKSYvLCAnb0lEPScgKyBvcmRlcklkICsgJyYnKSwgJ19ibGFuaycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfcmVjcmVhdGVPcmRlckNvbmZpcm1hdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgb3JkZXJJZCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmRhdGEoJ3Jvdy1pZCcpO1xuICAgICAgICAgICAgdmFyIHVybCA9ICQoX3NlbGVjdG9yTWFwcGluZy5USVRMRV9SRUNSRUFURV9PUkRFUikuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLnJlcGxhY2UoL29JRD0oLiopJi8sICdvSUQ9JyArIG9yZGVySWQgKyAnJicpLCAnX2JsYW5rJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9zZW5kT3JkZXJDb25maXJtYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgICQoJyNnbV9vcmRlcl9pZCcpLnZhbChvcmRlcklkKTtcbiAgICAgICAgICAgICQoJy5HTV9TRU5EX09SREVSJykuY2xpY2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3dpdGhkcmF3YWxDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKTtcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKF9zZWxlY3Rvck1hcHBpbmcuVEVYVF9DUkVBVEVfV0lUSERSQVdBTCkuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLnJlcGxhY2UoL29yZGVyPVteJl0qLywgJ29yZGVyX2lkPScgKyBvcmRlcklkKSwgJ19ibGFuaycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfYWRkVHJhY2tpbmdDb2RlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJyk7XG4gICAgICAgICAgICB2YXIgJHRhcmdldCA9ICQoX3NlbGVjdG9yTWFwcGluZy5UWFRfUEFSQ0VMX1RSQUNLSU5HX1NFTkRCVVRUT05fVElUTEUpO1xuICAgICAgICAgICAgJHRhcmdldC5kYXRhKCdvcmRlcl9pZCcsIG9yZGVySWQpO1xuICAgICAgICAgICAgJHRhcmdldC5nZXQoMCkuY2xpY2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2RobExhYmVsQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJyk7XG4gICAgICAgICAgICB2YXIgdXJsID0gJChfc2VsZWN0b3JNYXBwaW5nLkJVVFRPTl9ESExfTEFCRUwpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybC5yZXBsYWNlKC9vSUQ9KC4qKS8sICdvSUQ9JyArIG9yZGVySWQpLCAnX2JsYW5rJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9tYWlsQmVlek92ZXJ2aWV3Q2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJyk7XG4gICAgICAgICAgICB2YXIgJHRhcmdldCA9ICQoX3NlbGVjdG9yTWFwcGluZy5NQUlMQkVFWl9PVkVSVklFVyk7XG4gICAgICAgICAgICB2YXIgdXJsID0gJHRhcmdldC5hdHRyKCdvbmNsaWNrJyk7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvb0lEPSguKikmLywgJ29JRD0nICsgb3JkZXJJZCArICcmJyk7XG4gICAgICAgICAgICAkdGFyZ2V0LmF0dHIoJ29uY2xpY2snLCB1cmwpO1xuICAgICAgICAgICAgJHRhcmdldC5nZXQoMCkuY2xpY2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX21haWxCZWV6Tm90aWZpY2F0aW9uc0NhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgb3JkZXJJZCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmRhdGEoJ3Jvdy1pZCcpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKF9zZWxlY3Rvck1hcHBpbmcuTUFJTEJFRVpfTk9USUZJQ0FUSU9OUyk7XG4gICAgICAgICAgICB2YXIgdXJsID0gJHRhcmdldC5hdHRyKCdvbmNsaWNrJyk7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvb0lEPSguKikmLywgJ29JRD0nICsgb3JkZXJJZCArICcmJyk7XG4gICAgICAgICAgICAkdGFyZ2V0LmF0dHIoJ29uY2xpY2snLCB1cmwpO1xuICAgICAgICAgICAgJHRhcmdldC5nZXQoMCkuY2xpY2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX21haWxCZWV6Q29udmVyc2F0aW9uc0NhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgb3JkZXJJZCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmRhdGEoJ3Jvdy1pZCcpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKF9zZWxlY3Rvck1hcHBpbmcuTUFJTEJFRVpfQ09OVkVSU0FUSU9OUyk7XG4gICAgICAgICAgICB2YXIgdXJsID0gJHRhcmdldC5hdHRyKCdvbmNsaWNrJyk7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvb0lEPSguKikmLywgJ29JRD0nICsgb3JkZXJJZCArICcmJyk7XG4gICAgICAgICAgICAkdGFyZ2V0LmF0dHIoJ29uY2xpY2snLCB1cmwpO1xuICAgICAgICAgICAgJHRhcmdldC5nZXQoMCkuY2xpY2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2hlcm1lc0NhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgb3JkZXJJZCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmRhdGEoJ3Jvdy1pZCcpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKF9zZWxlY3Rvck1hcHBpbmcuQlVUVE9OX0hFUk1FUyk7XG4gICAgICAgICAgICB2YXIgdXJsID0gJHRhcmdldC5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgvb3JkZXJzX2lkPSguKikvLCAnb3JkZXJzX2lkPScgKyBvcmRlcklkKTtcbiAgICAgICAgICAgICR0YXJnZXQuYXR0cignaHJlZicsIHVybCk7XG4gICAgICAgICAgICAkdGFyZ2V0LmdldCgwKS5jbGljaygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfaWxveHhDYWxsYmFjayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKF9zZWxlY3Rvck1hcHBpbmcuZ2V0X2xhYmVscyk7XG4gICAgICAgICAgICAkdGFyZ2V0LmNsaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9tdWx0aUNoYW5nZU9yZGVyU3RhdHVzQ2FsbGJhY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICQoX3NlbGVjdG9yTWFwcGluZy5CVVRUT05fTVVMVElfQ0hBTkdFX09SREVSX1NUQVRVUykuZ2V0KDApLmNsaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9tdWx0aURlbGV0ZUNhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAkKF9zZWxlY3Rvck1hcHBpbmcuQlVUVE9OX01VTFRJX0RFTEVURSkuZ2V0KDApLmNsaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9tdWx0aUNhbmNlbENhbGxiYWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAkKF9zZWxlY3Rvck1hcHBpbmcuQlVUVE9OX01VTFRJX0NBTkNFTCkuZ2V0KDApLmNsaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hcCB0YWJsZSBhY3Rpb25zIHRvIGJvdHRvbSBkcm9wZG93biBidXR0b24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX21hcFRhYmxlQWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZHJvcGRvd24gPSAkKCcjb3JkZXJzLXRhYmxlLWRyb3Bkb3duJyk7XG5cbiAgICAgICAgICAgIF9iaW5kRXZlbnRIYW5kbGVyKCRkcm9wZG93biwgJ0JVVFRPTl9NVUxUSV9DSEFOR0VfT1JERVJfU1RBVFVTJyk7XG5cbiAgICAgICAgICAgIGlmICgkKF9zZWxlY3Rvck1hcHBpbmcuZ2V0X2xhYmVscykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgX2JpbmRFdmVudEhhbmRsZXIoJGRyb3Bkb3duLCAnZ2V0X2xhYmVscycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfYmluZEV2ZW50SGFuZGxlcigkZHJvcGRvd24sICdCVVRUT05fTVVMVElfREVMRVRFJyk7XG4gICAgICAgICAgICBfYmluZEV2ZW50SGFuZGxlcigkZHJvcGRvd24sICdCVVRUT05fTVVMVElfQ0FOQ0VMJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hcCBhY3Rpb25zIGZvciBldmVyeSByb3cgaW4gdGhlIHRhYmxlIGdlbmVyaWNhbGx5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIHVzZSB0aGUgYWN0aW9uX21hcHBlciBsaWJyYXJ5IHRvIG1hcCB0aGUgYWN0aW9ucyBmb3IgZWFjaFxuICAgICAgICAgKiByb3cgb2YgdGhlIHRhYmxlLiBJdCBtYXBzIG9ubHkgdGhvc2UgYnV0dG9ucywgdGhhdCBoYXZlbid0IGFscmVhZHkgZXhwbGljaXRseVxuICAgICAgICAgKiBtYXBwZWQgYnkgdGhlIF9tYXBSb3dBY3Rpb25zIGZ1bmN0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9tYXBVbm1hcHBlZFJvd0FjdGlvbnMgPSBmdW5jdGlvbiAoJHRoaXMpIHtcbiAgICAgICAgICAgIHZhciB1bm1hcHBlZFJvd0FjdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICQoJy5hY3Rpb25fYnV0dG9ucyAuZXh0ZW5kZWRfc2luZ2xlX2FjdGlvbnMgYSwnICtcbiAgICAgICAgICAgICAgICAnLmFjdGlvbl9idXR0b25zIC5leHRlbmRlZF9zaW5nbGVfYWN0aW9ucyBidXR0b24sJyArXG4gICAgICAgICAgICAgICAgJy5hY3Rpb25fYnV0dG9ucyAuZXh0ZW5kZWRfc2luZ2xlX2FjdGlvbnMgaW5wdXRbdHlwZT1cImJ1dHRvblwiXSwnICtcbiAgICAgICAgICAgICAgICAnLmFjdGlvbl9idXR0b25zIC5leHRlbmRlZF9zaW5nbGVfYWN0aW9ucyBpbnB1dFt0eXBlPVwic3VibWl0XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfYWxyZWFkeU1hcHBlZCgkKHRoaXMpKSkge1xuICAgICAgICAgICAgICAgICAgICB1bm1hcHBlZFJvd0FjdGlvbnMucHVzaCgkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIG9yZGVySWQgPSAkdGhpcy5kYXRhKCdyb3ctaWQnKSxcbiAgICAgICAgICAgICAgICAkZHJvcGRvd24gPSAkdGhpcy5maW5kKCcuanMtYnV0dG9uLWRyb3Bkb3duJyk7XG5cbiAgICAgICAgICAgICQuZWFjaCh1bm1hcHBlZFJvd0FjdGlvbnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGJ1dHRvbi5wcm9wKCdocmVmJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5wcm9wKCdocmVmJywgJGJ1dHRvbi5wcm9wKCdocmVmJykucmVwbGFjZSgvb0lEPSguKilcXGQoPz0mKT8vLCAnb0lEPScgKyBvcmRlcklkKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5nZXQoMCkuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkZHJvcGRvd24sICRidXR0b24udGV4dCgpLCAnJywgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIG1hcHBlZEJ1dHRvbnMucHVzaCgkYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfbWFwVW5tYXBwZWRNdWx0aUFjdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdW5tYXBwZWRNdWx0aUFjdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICQoJy5hY3Rpb25fYnV0dG9ucyAuZXh0ZW5kZWRfbXVsdGlfYWN0aW9ucyBhLCcgK1xuICAgICAgICAgICAgICAgICcuYWN0aW9uX2J1dHRvbnMgLmV4dGVuZGVkX211bHRpX2FjdGlvbnMgYnV0dG9uLCcgK1xuICAgICAgICAgICAgICAgICcuYWN0aW9uX2J1dHRvbnMgLmV4dGVuZGVkX211bHRpX2FjdGlvbnMgaW5wdXRbdHlwZT1cImJ1dHRvblwiXSwnICtcbiAgICAgICAgICAgICAgICAnLmFjdGlvbl9idXR0b25zIC5leHRlbmRlZF9tdWx0aV9hY3Rpb25zIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9hbHJlYWR5TWFwcGVkKCQodGhpcykpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVubWFwcGVkTXVsdGlBY3Rpb25zLnB1c2goJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciAkZHJvcGRvd24gPSAkKCcjb3JkZXJzLXRhYmxlLWRyb3Bkb3duJyk7XG4gICAgICAgICAgICAkLmVhY2godW5tYXBwZWRNdWx0aUFjdGlvbnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLmdldCgwKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24ubWFwQWN0aW9uKCRkcm9wZG93biwgJGJ1dHRvbi50ZXh0KCksICcnLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgbWFwcGVkQnV0dG9ucy5wdXNoKCRidXR0b24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBpZiB0aGUgYnV0dG9uIHdhcyBhbHJlYWR5IG1hcHBlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9hbHJlYWR5TWFwcGVkID0gZnVuY3Rpb24gKCRidXR0b24pIHtcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4IGluIG1hcHBlZEJ1dHRvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoJGJ1dHRvbi5pcyhtYXBwZWRCdXR0b25zW2luZGV4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgQnV0dG9uIHRvIE1hcHBlZCBBcnJheVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gYnV0dG9uU2VsZWN0b3JcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2FkZEJ1dHRvblRvTWFwcGVkQXJyYXkgPSBmdW5jdGlvbiAoYnV0dG9uU2VsZWN0b3IpIHtcbiAgICAgICAgICAgIGlmIChtYXBwZWRCdXR0b25zW2J1dHRvblNlbGVjdG9yXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXBwZWRCdXR0b25zW2J1dHRvblNlbGVjdG9yXSA9ICQoYnV0dG9uU2VsZWN0b3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCaW5kIEV2ZW50IGhhbmRsZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICRkcm9wZG93blxuICAgICAgICAgKiBAcGFyYW0gYWN0aW9uXG4gICAgICAgICAqIEBwYXJhbSBjdXN0b21SZWNlbnRCdXR0b25TZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9iaW5kRXZlbnRIYW5kbGVyID0gZnVuY3Rpb24gKCRkcm9wZG93biwgYWN0aW9uLCBjdXN0b21SZWNlbnRCdXR0b25TZWxlY3Rvcikge1xuICAgICAgICAgICAgdmFyIHRhcmdldFNlbGVjdG9yID0gX3NlbGVjdG9yTWFwcGluZ1thY3Rpb25dLFxuICAgICAgICAgICAgICAgIHNlY3Rpb24gPSBfc2VjdGlvbk1hcHBpbmdbYWN0aW9uXSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IF9nZXRBY3Rpb25DYWxsYmFjayhhY3Rpb24pLFxuICAgICAgICAgICAgICAgIGN1c3RvbUVsZW1lbnQgPSAkKGN1c3RvbVJlY2VudEJ1dHRvblNlbGVjdG9yKS5sZW5ndGggPyAkKGN1c3RvbVJlY2VudEJ1dHRvblNlbGVjdG9yKSA6XG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bjtcbiAgICAgICAgICAgIGlmICgkKHRhcmdldFNlbGVjdG9yKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBfYWRkQnV0dG9uVG9NYXBwZWRBcnJheSh0YXJnZXRTZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkZHJvcGRvd24sIGFjdGlvbiwgc2VjdGlvbiwgY2FsbGJhY2ssIGN1c3RvbUVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXggZm9yIHJvdyBzZWxlY3Rpb24gY29udHJvbHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2ZpeFJvd1NlbGVjdGlvbkZvckNvbnRyb2xFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJ2lucHV0LmNoZWNrYm94W25hbWU9XCJnbV9tdWx0aV9zdGF0dXNbXVwiXScpXG4gICAgICAgICAgICAgICAgLmFkZCgnLnNpbmdsZS1jaGVja2JveCcpXG4gICAgICAgICAgICAgICAgLmFkZCgnYS5hY3Rpb24taWNvbicpXG4gICAgICAgICAgICAgICAgLmFkZCgnLmpzLWJ1dHRvbi1kcm9wZG93bicpXG4gICAgICAgICAgICAgICAgLmFkZCgndHIuZGF0YVRhYmxlUm93IGEnKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIF90b2dnbGVNdWx0aUFjdGlvbkJ1dHRvbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBidXR0b25zIGFyZSBjb252ZXJ0ZWQgdG8gZHJvcGRvd24gZm9yIGV2ZXJ5IHJvdy5cbiAgICAgICAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCgnLmpzLWJ1dHRvbi1kcm9wZG93bicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcblxuICAgICAgICAgICAgICAgICAgICBfbWFwVGFibGVBY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgIF9tYXBVbm1hcHBlZE11bHRpQWN0aW9ucygpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJsZUFjdGlvbnMgPSBtYXBwZWRCdXR0b25zO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBNYWlsYmVleiBjb252ZXJzYXRpb25zIGJhZGdlLlxuICAgICAgICAgICAgICAgICAgICBfYWRkQnV0dG9uVG9NYXBwZWRBcnJheSgnLmNvbnRlbnRUYWJsZSAuaW5mb0JveENvbnRlbnQgYS5jb250ZXh0X3ZpZXdfYnV0dG9uLmJ0bl9yaWdodCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICQoJy5neC1vcmRlcnMtdGFibGUgdHInKS5ub3QoJy5kYXRhVGFibGVIZWFkaW5nUm93JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBwZWRCdXR0b25zID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4IGluIHRhYmxlQWN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcHBlZEJ1dHRvbnNbaW5kZXhdID0gdGFibGVBY3Rpb25zW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgX21hcFJvd0FjdGlvbigkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9tYXBVbm1hcHBlZFJvd0FjdGlvbnMoJCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIF9maXhSb3dTZWxlY3Rpb25Gb3JDb250cm9sRWxlbWVudHMoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJbml0aWFsaXplIGNoZWNrYm94ZXNcbiAgICAgICAgICAgICAgICAgICAgX3RvZ2dsZU11bHRpQWN0aW9uQnV0dG9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMzAwKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHNlbGVjdGVkIGNoZWNrYm94ZXMgYWxzb1xuICAgICAgICAgICAgLy8gYmVmb3JlIGFsbCByb3dzIGFuZCB0aGVpciBkcm9wZG93biB3aWRnZXRzIGhhdmUgYmVlbiBpbml0aWFsaXplZC5cbiAgICAgICAgICAgIF90b2dnbGVNdWx0aUFjdGlvbkJ1dHRvbigpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
