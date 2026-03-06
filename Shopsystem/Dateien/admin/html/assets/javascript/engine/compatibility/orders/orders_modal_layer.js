'use strict';

/* --------------------------------------------------------------
 orders_modal_layer.js 2021-05-15
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Orders Modal Layer Module
 *
 * This module will open a modal layer for order actions like deleting or changing the oder status.
 *
 * @module Compatibility/orders_modal_layer
 */
gx.compatibility.module('orders_modal_layer', ['xhr', 'fallback'],

/**  @lends module:Compatibility/orders_modal_layer */

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
     * Modal Selector
     *
     * @type {object}
     */
    $modal = $('#modal_layer_container'),


    /**
     * Checkboxes Selector
     *
     * @type {object}
     */
    $checkboxes = $('.gx-orders-table tr:not(.dataTableHeadingRow) input'),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        detail_page: false,
        comment: ''
    },


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------

    var _openDeleteDialog = function _openDeleteDialog(event) {

        var $form = $('#delete_confirm_form');
        $form.attr('action', $form.attr('action') + '&oID=' + $this.data('order_id'));

        event.preventDefault();

        var title = jse.core.lang.translate('TEXT_INFO_HEADING_DELETE_ORDER', 'orders').replace('%s', $this.data('order_id'));

        $form.dialog({
            'title': title,
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 420
        });
    };

    var _openTrackingCodeDeleteDialog = function _openTrackingCodeDeleteDialog(event) {
        var $form = $('#delete_tracking_code_confirm_form');
        var data_set = jse.libs.fallback._data($(this), 'orders_modal_layer');
        $form.dialog({
            'title': jse.core.lang.translate('TXT_PARCEL_TRACKING_DELETE_BUTTON', 'parcel_services').replace('%s', data_set.tracking_code),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': [{
                'text': jse.core.lang.translate('close', 'buttons'),
                'class': 'btn',
                'click': function click() {
                    $(this).dialog('close');
                }
            }, {
                'text': jse.core.lang.translate('delete', 'buttons'),
                'class': 'btn btn-primary',
                'click': function click() {
                    $(this).dialog('close');

                    var url = 'request_port.php?module=ParcelServices&action=delete_tracking_code';

                    jse.libs.xhr.post({
                        'url': url,
                        'data': {
                            'tracking_code_id': data_set.tracking_code_id,
                            'order_id': data_set.order_id,
                            'page_token': data_set.page_token
                        }
                    }).done(function (response) {
                        $('#tracking_code_wrapper > .frame-content > table').html(response.html);
                    });
                }
            }],
            'width': 420
        });
    };

    var _openMultiDeleteDialog = function _openMultiDeleteDialog(event) {

        var $form = $('#multi_delete_confirm_form'),
            orderId = 0;

        event.preventDefault();

        if ($checkboxes.filter(':checked').length === 0) {
            return false;
        }

        _readSelectedOrders($form);

        $form.attr('action', $form.attr('action') + '&oID=' + $this.data('order_id'));

        $form.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_MULTI_DELETE_ORDER', 'orders').replace('%s', $this.data('order_id')),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 420
        });
    };

    var _openMultiCancelDialog = function _openMultiCancelDialog(event) {
        var $form = $('#multi_cancel_confirm_form');
        var origin = '';
        event.preventDefault();

        if (options.detail_page) {
            // Orders detail page
            $form.append('<input type="hidden" name="gm_multi_status[]" value="' + options.order_id + '" />');
            $form.find('.selected_orders').text(options.order_id);
            $form.find('textarea[name="gm_comments"]').html(options.comment);
        } else {
            // Orders page
            if ($checkboxes.filter(':checked').length === 0) {
                return false;
            }
            _readSelectedOrders($form);
            origin = '&origin=old_orders_overview';
        }

        $form.attr('action', $form.attr('action') + '?oID=' + $this.data('order_id') + origin);

        $form.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_MULTI_CANCEL_ORDER', 'orders').replace('%s', $this.data('order_id')),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 420
        });
    };

    var _openUpdateOrdersStatusDialog = function _openUpdateOrdersStatusDialog(event) {
        var $form = $('#update_orders_status_form');

        event.preventDefault();

        if (options.detail_page) {
            // Orders detail page
            $form.append('<input type="hidden" name="gm_multi_status[]" value="' + options.order_id + '" />');
            $form.find('.selected_orders').text(options.order_id);
            $form.find('textarea[name="gm_comments"]').html(options.comment);
        } else {
            // Orders page
            if ($checkboxes.filter(':checked').length === 0) {
                return false;
            }
            _readSelectedOrders($form);
        }

        $form.dialog({
            'title': jse.core.lang.translate('HEADING_GM_STATUS', 'orders'),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 580
        });
    };

    var _openTrackingCodeDialog = function _openTrackingCodeDialog(event) {

        var $form = $('#add_tracking_code_form');

        event.preventDefault();
        $form.dialog({
            'title': jse.core.lang.translate('TXT_PARCEL_TRACKING_HEADING', 'parcel_services').replace('%s', $this.data('order_id')),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 420
        });
    };

    var _openEmailInvoiceDialog = function _openEmailInvoiceDialog(event) {

        var $modal = $('.email-invoice-modal-body');
        var url = jse.core.config.get('appUrl') + '/admin/admin.php';
        var data = {
            id: options.order_id,
            do: 'OrdersModalsAjax/GetEmailInvoiceSubject',
            pageToken: jse.core.config.get('pageToken')
        };
        var invoiceNumbersHtml = '';

        $('.email-invoice-form').show();
        $('.email-invoice-success').hide();

        if ($modal.find('.message_stack_container').length < 1) {
            $modal.find('.alert').wrap('<div class="message_stack_container"></div>');
        }

        $modal.find('.customer-info').text('"' + options.name + '"');
        $modal.find('.email-address').val(options.email);

        $modal.data('orderId', options.order_id);

        $.ajax({ url: url, data: data, dataType: 'json' }).done(function (response) {
            $modal.attr('data-gx-widget', 'single_checkbox');

            $modal.find('.subject').val(response.subject);
            if (!response.invoiceIdExists) {
                $modal.find('.invoice-num-info').addClass('hidden');
                $modal.find('.no-invoice').removeClass('hidden');
                $modal.find('.email-invoice-form .message_stack_container').removeClass('hidden');
            } else {
                $modal.find('.invoice-num-info').removeClass('hidden');
                $modal.find('.no-invoice').addClass('hidden');
                $modal.find('.email-invoice-form .message_stack_container').addClass('hidden');
            }

            if (Object.keys(response.invoiceNumbers).length <= 1) {
                $modal.find('.invoice-numbers').addClass('hidden');
            } else {
                $modal.find('.invoice-numbers').removeClass('hidden');
            }

            for (var invoiceId in response.invoiceNumbers) {
                invoiceNumbersHtml += '<p><input type="checkbox" name="invoice_ids[]" value="' + invoiceId + '" checked="checked" class="invoice-numbers-checkbox" /> ' + response.invoiceNumbers[invoiceId] + '</p>';
            }

            $modal.find('.invoice-numbers-checkboxes').html(invoiceNumbersHtml);

            gx.widgets.init($modal);

            $modal.dialog({
                'title': jse.core.lang.translate('TITLE_INVOICE', 'gm_order_menu'),
                'modal': true,
                'dialogClass': 'gx-container',
                'buttons': _getModalButtons($modal),
                'width': 600
            });

            $modal.find('.invoice-numbers-checkbox').on('change', function () {
                _onChangeEmailInvoiceCheckbox($modal);
            });
        });

        event.preventDefault();
    };

    /**
     * On Email Invoice Checkbox Change
     *
     * Disable send button if all invoice number checkboxes are unchecked. Otherwise enable the send button again.
     */
    var _onChangeEmailInvoiceCheckbox = function _onChangeEmailInvoiceCheckbox($modal) {
        if ($modal.find('.invoice-numbers-checkbox').length > 0) {
            if ($modal.find('.invoice-numbers-checkbox:checked').length > 0) {
                $('.btn-send-invoice-mail').prop('disabled', false);
            } else {
                $('.btn-send-invoice-mail').prop('disabled', true);
            }
        } else {
            $('.btn-send-invoice-mail').prop('disabled', false);
        }
    };

    var _getModalButtons = function _getModalButtons($form) {
        var buttons = [{
            'text': jse.core.lang.translate('close', 'buttons'),
            'class': 'btn',
            'click': function click() {
                $(this).dialog('close');
            }
        }];
        switch (options.action) {
            case 'delete':
            case 'multi_delete':
                buttons.push({
                    'text': jse.core.lang.translate('delete', 'buttons'),
                    'class': 'btn btn-primary',
                    'click': function click() {
                        $form.submit();
                    }
                });
                break;
            case 'add_tracking_code':
                buttons.push({
                    'text': jse.core.lang.translate('add', 'buttons'),
                    'class': 'btn btn-primary',
                    'click': function click(event) {
                        _addTrackingCodeFromOverview(event);
                    }
                });
                break;
            case 'update_orders_status':
                buttons.push({
                    'text': jse.core.lang.translate('execute', 'buttons'),
                    'class': 'btn btn-primary',
                    'click': function click(event) {
                        $form.submit();
                    }
                });
                break;
            case 'multi_cancel':
                buttons.push({
                    'text': jse.core.lang.translate('send', 'buttons'),
                    'class': 'btn btn-primary',
                    'click': function click(event) {
                        //event.preventDefault();
                        //gm_cancel('gm_send_order.php', '&type=cancel', 'CANCEL');
                        $form.submit();
                    }
                });
                break;
            case 'email_invoice':
                buttons.push({
                    'text': jse.core.lang.translate('send', 'buttons'),
                    'class': 'btn btn-primary btn-send-invoice-mail',
                    'click': function click(event) {
                        event.preventDefault();

                        var url = 'gm_pdf_order.php?oID=' + $form.data('orderId') + '&type=invoice&mail=1&gm_quick_mail=1';
                        var data = $form.find('form').serialize();

                        $.ajax({ url: url, data: data, type: 'POST', dataType: 'html' }).done(function (response) {
                            $('.email-invoice-form').hide();
                            $('.email-invoice-success').show();

                            $('.btn-send-invoice-mail').hide();
                        });
                    }
                });
        }

        return buttons;
    };

    var _addTrackingCodeFromOverview = function _addTrackingCodeFromOverview(event) {
        event.stopPropagation();

        var tracking_code = $('#parcel_service_tracking_code').val();
        if (tracking_code === '') {
            return false;
        }

        $.ajax({
            'type': 'POST',
            'url': 'request_port.php?module=ParcelServices&action=add_tracking_code',
            'timeout': 30000,
            'dataType': 'json',
            'context': this,
            'data': {

                'tracking_code': tracking_code,
                'service_id': $('#parcel_services_dropdown option:selected').val(),
                'order_id': $this.data('order_id'),
                'page_token': $('.page_token').val()
            },
            done: function done() {
                document.location.reload();
            }
        });

        return false;
    };

    var _readSelectedOrders = function _readSelectedOrders($form) {
        var orderIds = [];

        $checkboxes.filter(':checked').each(function () {
            $form.append('<input type="hidden" name="gm_multi_status[]" value="' + $(this).val() + '" />');

            orderIds.push($(this).val());
        });

        $form.find('.selected_orders').text(orderIds.join(', '));
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        switch (options.action) {
            case 'delete':
                $this.on('click', _openDeleteDialog);
                break;
            case 'multi_delete':
                $this.on('click', _openMultiDeleteDialog);
                break;
            case 'add_tracking_code':
                $this.on('click', _openTrackingCodeDialog);
                break;
            case 'update_orders_status':
                $this.on('click', _openUpdateOrdersStatusDialog);
                break;
            case 'multi_cancel':
                $this.on('click', _openMultiCancelDialog);
                break;
            case 'email_invoice':
                $this.on('click', _openEmailInvoiceDialog);
                break;
        }

        if (options.container === 'tracking_code_wrapper') {
            $this.on('click', '.btn-delete', _openTrackingCodeDeleteDialog);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfbW9kYWxfbGF5ZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRtb2RhbCIsIiRjaGVja2JveGVzIiwiZGVmYXVsdHMiLCJkZXRhaWxfcGFnZSIsImNvbW1lbnQiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX29wZW5EZWxldGVEaWFsb2ciLCJldmVudCIsIiRmb3JtIiwiYXR0ciIsInByZXZlbnREZWZhdWx0IiwidGl0bGUiLCJqc2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInJlcGxhY2UiLCJkaWFsb2ciLCJfZ2V0TW9kYWxCdXR0b25zIiwiX29wZW5UcmFja2luZ0NvZGVEZWxldGVEaWFsb2ciLCJkYXRhX3NldCIsImxpYnMiLCJmYWxsYmFjayIsIl9kYXRhIiwidHJhY2tpbmdfY29kZSIsInVybCIsInhociIsInBvc3QiLCJ0cmFja2luZ19jb2RlX2lkIiwib3JkZXJfaWQiLCJwYWdlX3Rva2VuIiwiZG9uZSIsInJlc3BvbnNlIiwiaHRtbCIsIl9vcGVuTXVsdGlEZWxldGVEaWFsb2ciLCJvcmRlcklkIiwiZmlsdGVyIiwibGVuZ3RoIiwiX3JlYWRTZWxlY3RlZE9yZGVycyIsIl9vcGVuTXVsdGlDYW5jZWxEaWFsb2ciLCJvcmlnaW4iLCJhcHBlbmQiLCJmaW5kIiwidGV4dCIsIl9vcGVuVXBkYXRlT3JkZXJzU3RhdHVzRGlhbG9nIiwiX29wZW5UcmFja2luZ0NvZGVEaWFsb2ciLCJfb3BlbkVtYWlsSW52b2ljZURpYWxvZyIsImNvbmZpZyIsImdldCIsImlkIiwiZG8iLCJwYWdlVG9rZW4iLCJpbnZvaWNlTnVtYmVyc0h0bWwiLCJzaG93IiwiaGlkZSIsIndyYXAiLCJuYW1lIiwidmFsIiwiZW1haWwiLCJhamF4IiwiZGF0YVR5cGUiLCJzdWJqZWN0IiwiaW52b2ljZUlkRXhpc3RzIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIk9iamVjdCIsImtleXMiLCJpbnZvaWNlTnVtYmVycyIsImludm9pY2VJZCIsIndpZGdldHMiLCJpbml0Iiwib24iLCJfb25DaGFuZ2VFbWFpbEludm9pY2VDaGVja2JveCIsInByb3AiLCJidXR0b25zIiwiYWN0aW9uIiwicHVzaCIsInN1Ym1pdCIsIl9hZGRUcmFja2luZ0NvZGVGcm9tT3ZlcnZpZXciLCJzZXJpYWxpemUiLCJ0eXBlIiwic3RvcFByb3BhZ2F0aW9uIiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9yZGVySWRzIiwiZWFjaCIsImpvaW4iLCJjb250YWluZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLG9CQURKLEVBR0ksQ0FBQyxLQUFELEVBQVEsVUFBUixDQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsYUFBU0QsRUFBRSx3QkFBRixDQWJiOzs7QUFlSTs7Ozs7QUFLQUUsa0JBQWNGLEVBQUUscURBQUYsQ0FwQmxCOzs7QUFzQkk7Ozs7O0FBS0FHLGVBQVc7QUFDUEMscUJBQWEsS0FETjtBQUVQQyxpQkFBUztBQUZGLEtBM0JmOzs7QUFnQ0k7Ozs7O0FBS0FDLGNBQVVOLEVBQUVPLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkosUUFBbkIsRUFBNkJMLElBQTdCLENBckNkOzs7QUF1Q0k7Ozs7O0FBS0FELGFBQVMsRUE1Q2I7O0FBOENBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJVyxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFVQyxLQUFWLEVBQWlCOztBQUVyQyxZQUFJQyxRQUFRVixFQUFFLHNCQUFGLENBQVo7QUFDQVUsY0FBTUMsSUFBTixDQUFXLFFBQVgsRUFBcUJELE1BQU1DLElBQU4sQ0FBVyxRQUFYLElBQXVCLE9BQXZCLEdB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RSxzQkFBTTBFLEVBQU4sQ0FBUyxPQUFULEVBQWtCakUsaUJBQWxCO0FBQ0E7QUFDSixpQkFBSyxjQUFMO0FBQ0lULHNCQUFNMEUsRUFBTixDQUFTLE9BQVQsRUFBa0JyQyxzQkFBbEI7QUFDQTtBQUNKLGlCQUFLLG1CQUFMO0FBQ0lyQyxzQkFBTTBFLEVBQU4sQ0FBUyxPQUFULEVBQWtCMUIsdUJBQWxCO0FBQ0E7QUFDSixpQkFBSyxzQkFBTDtBQUNJaEQsc0JBQU0wRSxFQUFOLENBQVMsT0FBVCxFQUFrQjNCLDZCQUFsQjtBQUNBO0FBQ0osaUJBQUssY0FBTDtBQUNJL0Msc0JBQU0wRSxFQUFOLENBQVMsT0FBVCxFQUFrQmhDLHNCQUFsQjtBQUNBO0FBQ0osaUJBQUssZUFBTDtBQUNJMUMsc0JBQU0wRSxFQUFOLENBQVMsT0FBVCxFQUFrQnpCLHVCQUFsQjtBQUNBO0FBbEJSOztBQXFCQSxZQUFJMUMsUUFBUW9GLFNBQVIsS0FBc0IsdUJBQTFCLEVBQW1EO0FBQy9DM0Ysa0JBQU0wRSxFQUFOLENBQVMsT0FBVCxFQUFrQixhQUFsQixFQUFpQ3BELDZCQUFqQztBQUNIOztBQUVEWTtBQUNILEtBM0JEOztBQTZCQSxXQUFPcEMsTUFBUDtBQUNILENBcmRMIiwiZmlsZSI6Im9yZGVycy9vcmRlcnNfbW9kYWxfbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyc19tb2RhbF9sYXllci5qcyAyMDIxLTA1LTE1XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBPcmRlcnMgTW9kYWwgTGF5ZXIgTW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCBvcGVuIGEgbW9kYWwgbGF5ZXIgZm9yIG9yZGVyIGFjdGlvbnMgbGlrZSBkZWxldGluZyBvciBjaGFuZ2luZyB0aGUgb2RlciBzdGF0dXMuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L29yZGVyc19tb2RhbF9sYXllclxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnb3JkZXJzX21vZGFsX2xheWVyJyxcblxuICAgIFsneGhyJywgJ2ZhbGxiYWNrJ10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9vcmRlcnNfbW9kYWxfbGF5ZXIgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kYWwgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkbW9kYWwgPSAkKCcjbW9kYWxfbGF5ZXJfY29udGFpbmVyJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ2hlY2tib3hlcyBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRjaGVja2JveGVzID0gJCgnLmd4LW9yZGVycy10YWJsZSB0cjpub3QoLmRhdGFUYWJsZUhlYWRpbmdSb3cpIGlucHV0JyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgZGV0YWlsX3BhZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICcnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9vcGVuRGVsZXRlRGlhbG9nID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQoJyNkZWxldGVfY29uZmlybV9mb3JtJyk7XG4gICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCAkZm9ybS5hdHRyKCdhY3Rpb24nKSArICcmb0lEPScgKyAkdGhpcy5kYXRhKCdvcmRlcl9pZCcpKTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19IRUFESU5HX0RFTEVURV9PUkRFUicsICdvcmRlcnMnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclcycsICR0aGlzLmRhdGEoJ29yZGVyX2lkJykpO1xuXG4gICAgICAgICAgICAkZm9ybS5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IHRpdGxlLFxuICAgICAgICAgICAgICAgICdtb2RhbCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ2RpYWxvZ0NsYXNzJzogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgJ2J1dHRvbnMnOiBfZ2V0TW9kYWxCdXR0b25zKCRmb3JtKSxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiA0MjBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9vcGVuVHJhY2tpbmdDb2RlRGVsZXRlRGlhbG9nID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKCcjZGVsZXRlX3RyYWNraW5nX2NvZGVfY29uZmlybV9mb3JtJyk7XG4gICAgICAgICAgICB2YXIgZGF0YV9zZXQgPSBqc2UubGlicy5mYWxsYmFjay5fZGF0YSgkKHRoaXMpLCAnb3JkZXJzX21vZGFsX2xheWVyJyk7XG4gICAgICAgICAgICAkZm9ybS5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUWFRfUEFSQ0VMX1RSQUNLSU5HX0RFTEVURV9CVVRUT04nLCAncGFyY2VsX3NlcnZpY2VzJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAnJXMnLCBkYXRhX3NldC50cmFja2luZ19jb2RlKSxcbiAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICdidXR0b25zJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjbG9zZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZGVsZXRlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9ICdyZXF1ZXN0X3BvcnQucGhwP21vZHVsZT1QYXJjZWxTZXJ2aWNlcyZhY3Rpb249ZGVsZXRlX3RyYWNraW5nX2NvZGUnO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMueGhyLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXJsJzogdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0cmFja2luZ19jb2RlX2lkJzogZGF0YV9zZXQudHJhY2tpbmdfY29kZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvcmRlcl9pZCc6IGRhdGFfc2V0Lm9yZGVyX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BhZ2VfdG9rZW4nOiBkYXRhX3NldC5wYWdlX3Rva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjdHJhY2tpbmdfY29kZV93cmFwcGVyID4gLmZyYW1lLWNvbnRlbnQgPiB0YWJsZScpLmh0bWwocmVzcG9uc2UuaHRtbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDQyMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29wZW5NdWx0aURlbGV0ZURpYWxvZyA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKCcjbXVsdGlfZGVsZXRlX2NvbmZpcm1fZm9ybScpLFxuICAgICAgICAgICAgICAgIG9yZGVySWQgPSAwO1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoJGNoZWNrYm94ZXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3JlYWRTZWxlY3RlZE9yZGVycygkZm9ybSk7XG5cbiAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsICRmb3JtLmF0dHIoJ2FjdGlvbicpICsgJyZvSUQ9JyArICR0aGlzLmRhdGEoJ29yZGVyX2lkJykpO1xuXG4gICAgICAgICAgICAkZm9ybS5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fSEVBRElOR19NVUxUSV9ERUxFVEVfT1JERVInLCAnb3JkZXJzJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmRhdGEoJ29yZGVyX2lkJykpLFxuICAgICAgICAgICAgICAgICdtb2RhbCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ2RpYWxvZ0NsYXNzJzogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgJ2J1dHRvbnMnOiBfZ2V0TW9kYWxCdXR0b25zKCRmb3JtKSxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiA0MjBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfb3Blbk11bHRpQ2FuY2VsRGlhbG9nID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKCcjbXVsdGlfY2FuY2VsX2NvbmZpcm1fZm9ybScpO1xuICAgICAgICAgICAgdmFyIG9yaWdpbiA9ICcnO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGV0YWlsX3BhZ2UpIHtcbiAgICAgICAgICAgICAgICAvLyBPcmRlcnMgZGV0YWlsIHBhZ2VcbiAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImdtX211bHRpX3N0YXR1c1tdXCIgdmFsdWU9XCInICsgb3B0aW9ucy5vcmRlcl9pZCArXG4gICAgICAgICAgICAgICAgICAgICdcIiAvPicpO1xuICAgICAgICAgICAgICAgICRmb3JtLmZpbmQoJy5zZWxlY3RlZF9vcmRlcnMnKS50ZXh0KG9wdGlvbnMub3JkZXJfaWQpO1xuICAgICAgICAgICAgICAgICRmb3JtLmZpbmQoJ3RleHRhcmVhW25hbWU9XCJnbV9jb21tZW50c1wiXScpLmh0bWwob3B0aW9ucy5jb21tZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3JkZXJzIHBhZ2VcbiAgICAgICAgICAgICAgICBpZiAoJGNoZWNrYm94ZXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF9yZWFkU2VsZWN0ZWRPcmRlcnMoJGZvcm0pO1xuICAgICAgICAgICAgICAgIG9yaWdpbiA9ICcmb3JpZ2luPW9sZF9vcmRlcnNfb3ZlcnZpZXcnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCAkZm9ybS5hdHRyKCdhY3Rpb24nKSArICc/b0lEPScgKyAkdGhpcy5kYXRhKCdvcmRlcl9pZCcpICsgb3JpZ2luKTtcblxuICAgICAgICAgICAgJGZvcm0uZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAndGl0bGUnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9JTkZPX0hFQURJTkdfTVVMVElfQ0FOQ0VMX09SREVSJywgJ29yZGVycycpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCclcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5kYXRhKCdvcmRlcl9pZCcpKSxcbiAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICdidXR0b25zJzogX2dldE1vZGFsQnV0dG9ucygkZm9ybSksXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogNDIwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29wZW5VcGRhdGVPcmRlcnNTdGF0dXNEaWFsb2cgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQoJyN1cGRhdGVfb3JkZXJzX3N0YXR1c19mb3JtJyk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRldGFpbF9wYWdlKSB7XG4gICAgICAgICAgICAgICAgLy8gT3JkZXJzIGRldGFpbCBwYWdlXG4gICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJnbV9tdWx0aV9zdGF0dXNbXVwiIHZhbHVlPVwiJyArIG9wdGlvbnMub3JkZXJfaWQgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgLz4nKTtcbiAgICAgICAgICAgICAgICAkZm9ybS5maW5kKCcuc2VsZWN0ZWRfb3JkZXJzJykudGV4dChvcHRpb25zLm9yZGVyX2lkKTtcbiAgICAgICAgICAgICAgICAkZm9ybS5maW5kKCd0ZXh0YXJlYVtuYW1lPVwiZ21fY29tbWVudHNcIl0nKS5odG1sKG9wdGlvbnMuY29tbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE9yZGVycyBwYWdlXG4gICAgICAgICAgICAgICAgaWYgKCRjaGVja2JveGVzLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfcmVhZFNlbGVjdGVkT3JkZXJzKCRmb3JtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGZvcm0uZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAndGl0bGUnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnSEVBRElOR19HTV9TVEFUVVMnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IF9nZXRNb2RhbEJ1dHRvbnMoJGZvcm0pLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDU4MFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9vcGVuVHJhY2tpbmdDb2RlRGlhbG9nID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQoJyNhZGRfdHJhY2tpbmdfY29kZV9mb3JtJyk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkZm9ybS5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUWFRfUEFSQ0VMX1RSQUNLSU5HX0hFQURJTkcnLCAncGFyY2VsX3NlcnZpY2VzJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJyVzJywgJHRoaXMuZGF0YSgnb3JkZXJfaWQnKSksXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IF9nZXRNb2RhbEJ1dHRvbnMoJGZvcm0pLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDQyMFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29wZW5FbWFpbEludm9pY2VEaWFsb2cgPSBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmVtYWlsLWludm9pY2UtbW9kYWwtYm9keScpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocCc7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiBvcHRpb25zLm9yZGVyX2lkLFxuICAgICAgICAgICAgICAgIGRvOiAnT3JkZXJzTW9kYWxzQWpheC9HZXRFbWFpbEludm9pY2VTdWJqZWN0JyxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGludm9pY2VOdW1iZXJzSHRtbCA9ICcnO1xuXG4gICAgICAgICAgICAkKCcuZW1haWwtaW52b2ljZS1mb3JtJykuc2hvdygpO1xuICAgICAgICAgICAgJCgnLmVtYWlsLWludm9pY2Utc3VjY2VzcycpLmhpZGUoKTtcblxuICAgICAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcubWVzc2FnZV9zdGFja19jb250YWluZXInKS5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5hbGVydCcpLndyYXAoJzxkaXYgY2xhc3M9XCJtZXNzYWdlX3N0YWNrX2NvbnRhaW5lclwiPjwvZGl2PicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLmN1c3RvbWVyLWluZm8nKS50ZXh0KGBcIiR7b3B0aW9ucy5uYW1lfVwiYCk7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLmVtYWlsLWFkZHJlc3MnKS52YWwob3B0aW9ucy5lbWFpbCk7XG5cbiAgICAgICAgICAgICRtb2RhbFxuICAgICAgICAgICAgICAgIC5kYXRhKCdvcmRlcklkJywgb3B0aW9ucy5vcmRlcl9pZCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7dXJsLCBkYXRhLCBkYXRhVHlwZTogJ2pzb24nfSkuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAkbW9kYWwuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc2luZ2xlX2NoZWNrYm94Jyk7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLnN1YmplY3QnKS52YWwocmVzcG9uc2Uuc3ViamVjdCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5pbnZvaWNlSWRFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bS1pbmZvJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLm5vLWludm9pY2UnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuZW1haWwtaW52b2ljZS1mb3JtIC5tZXNzYWdlX3N0YWNrX2NvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtLWluZm8nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcubm8taW52b2ljZScpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5lbWFpbC1pbnZvaWNlLWZvcm0gLm1lc3NhZ2Vfc3RhY2tfY29udGFpbmVyJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXNwb25zZS5pbnZvaWNlTnVtYmVycykubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW52b2ljZUlkIGluIHJlc3BvbnNlLmludm9pY2VOdW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9pY2VOdW1iZXJzSHRtbCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgJzxwPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiaW52b2ljZV9pZHNbXVwiIHZhbHVlPVwiJyArIGludm9pY2VJZFxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnXCIgY2hlY2tlZD1cImNoZWNrZWRcIiBjbGFzcz1cImludm9pY2UtbnVtYmVycy1jaGVja2JveFwiIC8+ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICsgcmVzcG9uc2UuaW52b2ljZU51bWJlcnNbaW52b2ljZUlkXSArICc8L3A+JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycy1jaGVja2JveGVzJykuaHRtbChpbnZvaWNlTnVtYmVyc0h0bWwpO1xuXG4gICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCRtb2RhbCk7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwuZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RJVExFX0lOVk9JQ0UnLCAnZ21fb3JkZXJfbWVudScpLFxuICAgICAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbnMnOiBfZ2V0TW9kYWxCdXR0b25zKCRtb2RhbCksXG4gICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IDYwMFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMtY2hlY2tib3gnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfb25DaGFuZ2VFbWFpbEludm9pY2VDaGVja2JveCgkbW9kYWwpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gRW1haWwgSW52b2ljZSBDaGVja2JveCBDaGFuZ2VcbiAgICAgICAgICpcbiAgICAgICAgICogRGlzYWJsZSBzZW5kIGJ1dHRvbiBpZiBhbGwgaW52b2ljZSBudW1iZXIgY2hlY2tib3hlcyBhcmUgdW5jaGVja2VkLiBPdGhlcndpc2UgZW5hYmxlIHRoZSBzZW5kIGJ1dHRvbiBhZ2Fpbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25DaGFuZ2VFbWFpbEludm9pY2VDaGVja2JveCA9IGZ1bmN0aW9uICgkbW9kYWwpIHtcbiAgICAgICAgICAgIGlmICgkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycy1jaGVja2JveCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMtY2hlY2tib3g6Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1zZW5kLWludm9pY2UtbWFpbCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5idG4tc2VuZC1pbnZvaWNlLW1haWwnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmJ0bi1zZW5kLWludm9pY2UtbWFpbCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfZ2V0TW9kYWxCdXR0b25zID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy5hY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ211bHRpX2RlbGV0ZSc6XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdkZWxldGUnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdhZGRfdHJhY2tpbmdfY29kZSc6XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdhZGQnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYWRkVHJhY2tpbmdDb2RlRnJvbU92ZXJ2aWV3KGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VwZGF0ZV9vcmRlcnNfc3RhdHVzJzpcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2V4ZWN1dGUnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ211bHRpX2NhbmNlbCc6XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzZW5kJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZ21fY2FuY2VsKCdnbV9zZW5kX29yZGVyLnBocCcsICcmdHlwZT1jYW5jZWwnLCAnQ0FOQ0VMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlbWFpbF9pbnZvaWNlJzpcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3NlbmQnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBidG4tcHJpbWFyeSBidG4tc2VuZC1pbnZvaWNlLW1haWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSAnZ21fcGRmX29yZGVyLnBocD9vSUQ9JyArICRmb3JtLmRhdGEoJ29yZGVySWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmdHlwZT1pbnZvaWNlJm1haWw9MSZnbV9xdWlja19tYWlsPTEnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0gJGZvcm0uZmluZCgnZm9ybScpLnNlcmlhbGl6ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHt1cmwsIGRhdGEsIHR5cGU6ICdQT1NUJywgZGF0YVR5cGU6ICdodG1sJ30pLmRvbmUoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lbWFpbC1pbnZvaWNlLWZvcm0nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5lbWFpbC1pbnZvaWNlLXN1Y2Nlc3MnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJ0bi1zZW5kLWludm9pY2UtbWFpbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBidXR0b25zO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfYWRkVHJhY2tpbmdDb2RlRnJvbU92ZXJ2aWV3ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgdmFyIHRyYWNraW5nX2NvZGUgPSAkKCcjcGFyY2VsX3NlcnZpY2VfdHJhY2tpbmdfY29kZScpLnZhbCgpO1xuICAgICAgICAgICAgaWYgKHRyYWNraW5nX2NvZGUgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICd1cmwnOiAncmVxdWVzdF9wb3J0LnBocD9tb2R1bGU9UGFyY2VsU2VydmljZXMmYWN0aW9uPWFkZF90cmFja2luZ19jb2RlJyxcbiAgICAgICAgICAgICAgICAndGltZW91dCc6IDMwMDAwLFxuICAgICAgICAgICAgICAgICdkYXRhVHlwZSc6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAnY29udGV4dCc6IHRoaXMsXG4gICAgICAgICAgICAgICAgJ2RhdGEnOiB7XG5cbiAgICAgICAgICAgICAgICAgICAgJ3RyYWNraW5nX2NvZGUnOiB0cmFja2luZ19jb2RlLFxuICAgICAgICAgICAgICAgICAgICAnc2VydmljZV9pZCc6ICQoJyNwYXJjZWxfc2VydmljZXNfZHJvcGRvd24gb3B0aW9uOnNlbGVjdGVkJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICdvcmRlcl9pZCc6ICR0aGlzLmRhdGEoJ29yZGVyX2lkJyksXG4gICAgICAgICAgICAgICAgICAgICdwYWdlX3Rva2VuJzogJCgnLnBhZ2VfdG9rZW4nKS52YWwoKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfcmVhZFNlbGVjdGVkT3JkZXJzID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgICAgICB2YXIgb3JkZXJJZHMgPSBbXTtcblxuICAgICAgICAgICAgJGNoZWNrYm94ZXMuZmlsdGVyKCc6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZ21fbXVsdGlfc3RhdHVzW11cIiB2YWx1ZT1cIicgKyAkKHRoaXMpLnZhbCgpICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIC8+Jyk7XG5cbiAgICAgICAgICAgICAgICBvcmRlcklkcy5wdXNoKCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRmb3JtLmZpbmQoJy5zZWxlY3RlZF9vcmRlcnMnKS50ZXh0KG9yZGVySWRzLmpvaW4oJywgJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG9wdGlvbnMuYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgX29wZW5EZWxldGVEaWFsb2cpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtdWx0aV9kZWxldGUnOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBfb3Blbk11bHRpRGVsZXRlRGlhbG9nKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYWRkX3RyYWNraW5nX2NvZGUnOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBfb3BlblRyYWNraW5nQ29kZURpYWxvZyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VwZGF0ZV9vcmRlcnNfc3RhdHVzJzpcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgX29wZW5VcGRhdGVPcmRlcnNTdGF0dXNEaWFsb2cpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdtdWx0aV9jYW5jZWwnOlxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBfb3Blbk11bHRpQ2FuY2VsRGlhbG9nKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZW1haWxfaW52b2ljZSc6XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsIF9vcGVuRW1haWxJbnZvaWNlRGlhbG9nKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbnRhaW5lciA9PT0gJ3RyYWNraW5nX2NvZGVfd3JhcHBlcicpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLmJ0bi1kZWxldGUnLCBfb3BlblRyYWNraW5nQ29kZURlbGV0ZURpYWxvZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
