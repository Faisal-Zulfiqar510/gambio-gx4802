'use strict';

/* --------------------------------------------------------------
	orders_shipcloud.js 2018-10-15
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2015 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

/**
 * ## Orders Shipcloud Module
 *
 * This module implements the user interface for creating shipping labels via Shipcloud.io
 *
 * @module Compatibility/orders_shipcloud
 */
gx.compatibility.module('orders_shipcloud', [gx.source + '/libs/action_mapper', gx.source + '/libs/button_dropdown', 'loading_spinner'],

/**  @lends module:Compatibility/orders_shipcloud */
function (data) {

    'use strict';

    var
    /**
     * Module Selector
     *
     * @var {object}
     */
    $this = $(this),


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

    var _singleFormInit = function _singleFormInit() {
        gx.widgets.init($('#shipcloud_modal'));
        $('#sc_modal_content').removeClass('sc_loading');
        if ($('#sc_single_container').data('is_configured') === 1) {
            $('#sc_show_labels').show();
        } else {
            $('#sc_show_labels').hide();
        }
        $('#sc_single_form').on('submit', function (e) {
            e.preventDefault();
        });
        $('#sc_single_form input.create_label').on('click', _singleFormSubmitHandler);
        $('#sc_single_form select[name="carrier"]').on('change', function (e) {
            $('#sc_single_form input[type="text"]').trigger('change');
            $('#sc_single_form .carrier-specific').not('.carrier-' + $(this).val()).hide('fast');
            $('#sc_single_form .carrier-' + $(this).val()).not(':visible').show('fast');
        });
        $('#sc_single_form .price_value').on('change', function () {
            $('#sc_single_form div.sc_quote').html('');
        });
        $('#sc_package_template').on('change', _templateSelectionHandler);
        $('#sc_package_template').trigger('change');
        $('#sc_single_form input.template_value').on('change', function () {
            $('#sc_package_template').val('-1');
        });
        $('#sc_get_quote').button('disable');
        $('#sc_single_form input[name="quote_carriers[]"]').on('change', function () {
            if ($('#sc_single_form input[name="quote_carriers[]"]:checked').length > 0) {
                $('#sc_get_quote').button('enable');
            } else {
                $('#sc_get_quote').button('disable');
            }
        });
        $('#sc_single_form input[name="quote_carriers[]"]:first').trigger('change');
    };

    var _templateSelectionHandler = function _templateSelectionHandler(e) {
        var $form, $template;
        $form = $(this).closest('form');
        $template = $('option:selected', $(this));
        if ($template.val() !== '-1') {
            $('input[name="package[weight]"]', $form).val($template.data('weight'));
            $('input[name="package[height]"]', $form).val($template.data('height'));
            $('input[name="package[width]"]', $form).val($template.data('width'));
            $('input[name="package[length]"]', $form).val($template.data('length'));
            $('select[name="package[type]"]', $form).val($template.data('type'));
        }
    };

    var _openSingleFormModal = function _openSingleFormModal(event) {
        var orderId = $(event.target).parents('tr').data('row-id') || $('body').find('#gm_order_id').val();
        $('#sc_modal_content').empty().addClass('sc_loading');
        var button_create_label = jse.core.lang.translate('create_label', 'shipcloud'),
            shipcloud_modal_buttons = [];

        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('close', 'buttons'),
            'class': 'btn',
            'click': function click() {
                $(this).dialog('close');
                $('#sc_get_quote').show();
            }
        });
        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('show_existing_labels', 'shipcloud'),
            'class': 'btn',
            'click': _showLabelsHandler,
            'id': 'sc_show_labels'
        });
        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('get_quotes', 'shipcloud'),
            'class': 'btn btn-primary',
            'click': _singleFormGetQuoteHandler,
            'id': 'sc_get_quote'
        });

        $('#shipcloud_modal').dialog({
            autoOpen: false,
            modal: true,
            'title': jse.core.lang.translate('create_label', 'shipcloud'),
            'dialogClass': 'gx-container',
            buttons: shipcloud_modal_buttons,
            width: 1000,
            position: { my: 'center top', at: 'center bottom', of: '.main-top-header' }
        });
        $('#shipcloud_modal').dialog('open');
        $('#sc_modal_content').load('admin.php?do=Shipcloud/CreateLabelForm&orders_id=' + orderId, _singleFormInit);
    };

    var _addShipcloudDropdownEntry = function _addShipcloudDropdownEntry() {
        $('.gx-orders-table tr').not('.dataTableHeadingRow').each(function () {
            jse.libs.button_dropdown.mapAction($(this), 'admin_menu_entry', 'shipcloud', _openSingleFormModal);
        });
        jse.libs.button_dropdown.mapAction($('.bottom-save-bar'), 'admin_menu_entry', 'shipcloud', _openSingleFormModal);
    };

    var _labellistPickupCheckboxHandler = function _labellistPickupCheckboxHandler() {
        $('#sc-labellist-dropdown button, div.pickup_time input').prop('disabled', $('input.pickup_checkbox:checked').length === 0);
    };

    var _loadLabelList = function _loadLabelList(orders_id) {
        $('#sc_modal_content').load('admin.php?do=Shipcloud/LoadLabelList&orders_id=' + orders_id, function () {
            gx.widgets.init($('#sc_modal_content'));
            $('#shipcloud_modal').dialog({
                'title': jse.core.lang.translate('labellist_for', 'shipcloud') + ' ' + orders_id
            });
            $('#sc_modal_content').removeClass('sc_loading');

            $('form#sc_pickup').on('submit', function (e) {
                e.preventDefault();
            });
            jse.libs.button_dropdown.mapAction($('#sc-labellist-dropdown'), 'download_labels', 'shipcloud', _packedDownloadHandler);
            jse.libs.button_dropdown.mapAction($('#sc-labellist-dropdown'), 'order_pickups', 'shipcloud', _pickupSubmitHandler);
            $('input.pickup_checkbox').on('click', _labellistPickupCheckboxHandler);
            setTimeout(_labellistPickupCheckboxHandler, 200);
            $('input.pickup_checkbox_all').on('click', function () {
                if ($(this).prop('checked') === true) {
                    $('input.pickup_checkbox').prop('checked', true);
                    $('input.pickup_checkbox').parent().addClass('checked');
                } else {
                    $('input.pickup_checkbox').prop('checked', false);
                    $('input.pickup_checkbox').parent().removeClass('checked');
                }
                _labellistPickupCheckboxHandler();
            });
            $('a.sc-del-label').on('click', function (e) {
                e.preventDefault();
                var shipment_id = $(this).data('shipment-id'),
                    $buttonPlace = $(this).closest('span.sc-del-label'),
                    $row = $(this).closest('tr');
                $.ajax({
                    type: 'POST',
                    url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/DeleteShipment',
                    data: { shipment_id: shipment_id },
                    dataType: 'json'
                }).done(function (data) {
                    if (data.result === 'ERROR') {
                        $buttonPlace.html(data.error_message);
                        $buttonPlace.addClass('badge').addClass('badge-danger');
                    } else {
                        $buttonPlace.html(jse.core.lang.translate('shipment_deleted', 'shipcloud'));
                        $('a, input, td.checkbox > *', $row).remove();
                        $row.addClass('deleted-shipment');
                    }
                }).fail(function (data) {
                    $buttonPlace.html(jse.core.lang.translate('submit_error', 'shipcloud'));
                });
            });
        });
    };

    var _packedDownloadHandler = function _packedDownloadHandler(e) {
        e.preventDefault();
        var urls = [],
            request = {};
        $('input.pickup_checkbox:checked').each(function () {
            var href = $('a.label-link', $(this).closest('tr')).attr('href');
            urls.push(href);
        });
        if (urls) {
            $('#download_result').show();
            $('#download_result').html(jse.core.lang.translate('loading', 'shipcloud'));
            request.urls = urls;
            request.page_token = $('#sc_modal_content input[name="page_token"]').val();

            $.ajax({
                type: 'POST',
                url: jse.core.config.get('appUrl') + '/admin/admin.php?do=PackedDownload/DownloadByJson',
                data: JSON.stringify(request),
                dataType: 'json'
            }).done(function (data) {
                var downloadlink = jse.core.config.get('appUrl') + '/admin/admin.php?do=PackedDownload/DownloadPackage&key=' + data.downloadKey;
                if (data.result === 'OK') {
                    $('#download_result').html('<iframe class="download_iframe" src="' + downloadlink + '"></iframe>');
                }
                if (data.result === 'ERROR') {
                    $('#download_result').html(data.error_message);
                }
            }).fail(function (data) {
                $('#download_result').html(jse.core.lang.translate('submit_error', 'shipcloud'));
            });
        }
        return true;
    };

    var _pickupSubmitHandler = function _pickupSubmitHandler(e) {
        e.preventDefault();
        if ($('input.pickup_checkbox:checked').length > 0) {
            var formdata = $('form#sc_pickup').serialize();
            $('#pickup_result').html(jse.core.lang.translate('sending_pickup_request', 'shipcloud'));
            $('#pickup_result').show();
            $.ajax({
                type: 'POST',
                url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/PickupShipments',
                data: formdata,
                dataType: 'json'
            }).done(function (data) {
                var result_message = '';
                data.result_messages.forEach(function (message) {
                    result_message = result_message + message + '<br>';
                });
                $('#pickup_result').html(result_message);
            }).fail(function (data) {
                alert(jse.core.lang.translate('submit_error', 'shipcloud'));
            });
        }
        return true;
    };

    var _loadUnconfiguredNote = function _loadUnconfiguredNote() {
        $('#sc_modal_content').load('admin.php?do=Shipcloud/UnconfiguredNote');
    };

    var _showLabelsHandler = function _showLabelsHandler(e) {
        var orders_id = $('#sc_single_form input[name="orders_id"]').val();
        $('#sc_modal_content').empty().addClass('sc_loading');
        _loadLabelList(orders_id);
        $('#sc_show_labels').hide();
        $('#sc_get_quote').hide();
        return false;
    };

    var _singleFormGetQuoteHandler = function _singleFormGetQuoteHandler() {
        var $form = $('#sc_single_form'),
            quote = '';

        $('#sc_single_form .sc_quote').html('');
        $('#sc_single_form .sc_quote').attr('title', '');

        $('input[name="quote_carriers[]"]:checked').each(function () {
            var carrier = $(this).val(),
                $create_label = $('input.create_label', $(this).closest('tr'));
            $('input[name="carrier"]', $form).val(carrier);
            $('#sc_quote_' + carrier).html(jse.core.lang.translate('loading', 'shipcloud'));
            $.ajax({
                type: 'POST',
                url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/GetShipmentQuote',
                data: $form.serialize(),
                dataType: 'json'
            }).done(function (data) {
                if (data.result === 'OK') {
                    quote = data.shipment_quote;
                    $('#sc_quote_' + carrier).html(quote);
                } else if (data.result === 'ERROR') {
                    $('#sc_quote_' + carrier).html(jse.core.lang.translate('not_possible', 'shipcloud'));
                    $('#sc_quote_' + carrier).attr('title', data.error_message);
                } else if (data.result === 'UNCONFIGURED') {
                    _loadUnconfiguredNote();
                }
            }).fail(function (data) {
                quote = jse.core.lang.translate('get_quote_error', 'shipcloud');
                $('#sc_quote_' + carrier).html(quote);
            });
        });

        $('input[name="carrier"]', $form).val('');
    };

    var _singleFormSubmitHandler = function _singleFormSubmitHandler(e) {
        var carrier, formdata;
        $('#sc_show_labels').hide();
        $('#sc_get_quote').hide();
        carrier = $(this).attr('name');
        $('input[name="carrier"]').val(carrier);
        formdata = $('#sc_single_form').serialize();
        $('#sc_modal_content').empty().addClass('sc_loading');
        // alert('data: '+formdata);
        $.ajax({
            type: 'POST',
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/CreateLabelFormSubmit',
            data: formdata,
            dataType: 'json'
        }).done(function (data) {
            $('#sc_modal_content').removeClass('sc_loading');
            if (data.result === 'UNCONFIGURED') {
                _loadUnconfiguredNote();
            } else if (data.result === 'OK') {
                _loadLabelList(data.orders_id);
            } else {
                if (data.error_message) {
                    $('#sc_modal_content').html('<div class="sc_error">' + data.error_message + '</div>');
                }
            }
        }).fail(function (data) {
            alert(jse.core.lang.translate('submit_error', 'shipcloud'));
        });
        return false;
    };

    var _multiDropdownHandler = function _multiDropdownHandler(e) {
        var selected_orders = [],
            orders_param = '';
        $('input[name="gm_multi_status[]"]:checked').each(function () {
            selected_orders.push($(this).val());
        });
        $('#sc_modal_content').empty().addClass('sc_loading');
        var shipcloud_modal_buttons = [];
        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('close', 'buttons'),
            'class': 'btn',
            'click': function click() {
                $(this).dialog('close');
                $('#sc_get_quote').show();
            }
        });
        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('get_quotes', 'shipcloud'),
            'class': 'btn btn-primary',
            'click': _multiFormGetQuoteHandler,
            'id': 'sc_get_quote'
        });

        $('#shipcloud_modal').dialog({
            autoOpen: false,
            modal: true,
            'title': jse.core.lang.translate('create_labels', 'shipcloud'),
            'dialogClass': 'gx-container',
            buttons: shipcloud_modal_buttons,
            width: 1000,
            position: { my: 'center top', at: 'center bottom', of: '.main-top-header' }
        });

        $('#shipcloud_modal').dialog('open');
        selected_orders.forEach(function (item) {
            orders_param += 'orders[]=' + item + '&';
        });
        $('#sc_modal_content').load('admin.php?do=Shipcloud/CreateMultiLabelForm&' + orders_param, _multiFormInit);
    };

    var _multiFormInit = function _multiFormInit() {
        $('#shipcloud_modal').dialog({
            'title': jse.core.lang.translate('create_labels', 'shipcloud')
        });
        $('#sc_modal_content').removeClass('sc_loading');
        $('#sc_multi_form').on('submit', function (e) {
            e.preventDefault();
            return false;
        });
        $('#sc_create_label').hide();
        $('#sc_show_labels').hide();
        $('#sc_modal_content input, #sc_modal_content select').on('change', function () {
            $('.sc_multi_quote').hide();
        });
        $('#sc_package_template').on('change', _templateSelectionHandler);
        $('input.create_label').on('click', _multiFormSubmitHandler);
    };

    var _multiFormSubmitHandler = function _multiFormSubmitHandler(event) {
        var formdata, carrier;
        carrier = $(this).attr('name');
        $('#sc_multi_form input[name="carrier"]').val(carrier);
        formdata = $('#sc_multi_form').serialize();
        $('#sc_modal_content').empty().addClass('sc_loading');
        $.ajax({
            type: 'POST',
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/CreateMultiLabelFormSubmit',
            data: formdata,
            dataType: 'json'
        }).done(function (data) {
            $('#sc_modal_content').removeClass('sc_loading');
            if (data.result === 'UNCONFIGURED') {
                _loadUnconfiguredNote();
            } else if (data.result === 'OK') {
                _loadMultiLabelList(data.orders_ids, data.shipments);
            } else {
                if (data.error_message) {
                    $('#sc_modal_content').html('<div class="sc_error">' + data.error_message + '</div>');
                }
            }
        }).fail(function (data) {
            alert(jse.core.lang.translate('submit_error', 'shipcloud'));
        });
        return false;
    };

    var _loadMultiLabelList = function _loadMultiLabelList(orders_ids, shipments) {
        var multiLabelListParams = { 'orders_ids': orders_ids, 'shipments': shipments };

        $('#sc_modal_content').load(jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/LoadMultiLabelList', { "json": JSON.stringify(multiLabelListParams) }, function () {
            gx.widgets.init($('#shipcloud_modal'));
            $('#shipcloud_modal').dialog({
                'title': jse.core.lang.translate('labellist', 'shipcloud')
            });
            $('#sc_modal_content').removeClass('sc_loading');
            $('#sc_get_quote').hide();

            $('form#sc_pickup').on('submit', function (e) {
                e.preventDefault();
            });
            jse.libs.button_dropdown.mapAction($('#sc-labellist-dropdown'), 'download_labels', 'shipcloud', _packedDownloadHandler);
            jse.libs.button_dropdown.mapAction($('#sc-labellist-dropdown'), 'order_pickups', 'shipcloud', _pickupSubmitHandler);
            $('input.pickup_checkbox').on('click', _labellistPickupCheckboxHandler);
            setTimeout(_labellistPickupCheckboxHandler, 200);
            $('input.pickup_checkbox_all').on('click', function () {
                if ($(this).prop('checked') === true) {
                    $('input.pickup_checkbox').prop('checked', true);
                    $('input.pickup_checkbox').parent().addClass('checked');
                } else {
                    $('input.pickup_checkbox').prop('checked', false);
                    $('input.pickup_checkbox').parent().removeClass('checked');
                }
                _labellistPickupCheckboxHandler();
            });
        });
    };

    var _multiPickupSubmitHandler = _pickupSubmitHandler;

    var _multiFormGetQuoteHandler = function _multiFormGetQuoteHandler() {
        var formdata;
        $('div.sc_quote').html('');
        formdata = $('#sc_multi_form').serialize();
        $.ajax({
            type: 'POST',
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/GetMultiShipmentQuote',
            data: formdata,
            dataType: 'json'
        }).done(function (data) {
            if (data.result === 'OK') {
                for (var squote in data.shipment_quotes) {
                    $('#sc_multi_quote_' + data.shipment_quotes[squote].orders_id).html(data.shipment_quotes[squote].shipment_quote);
                }
                $('div.sc_multi_quote').show('fast');

                for (var carrier in data.carriers_total) {
                    $('#sc_quote_' + carrier).html(data.carriers_total[carrier]);
                }
            }
        }).fail(function (data) {
            alert(jse.core.lang.translate('submit_error', 'shipcloud'));
        });
        return false;
    };

    module.init = function (done) {
        $('body').prepend($('<div id="shipcloud_modal" title="' + jse.core.lang.translate('create_label_window_title', 'shipcloud') + '" style="display: none;"><div id="sc_modal_content"></div></div>'));

        var interval_counter = 10,
            interval = setInterval(function () {
            if ($('.js-button-dropdown').length) {
                clearInterval(interval);
                _addShipcloudDropdownEntry();
            }
            if (interval_counter-- === 0) {
                clearInterval(interval);
            }
        }, 400);

        jse.libs.button_dropdown.mapAction($('#orders-table-dropdown'), 'create_labels', 'shipcloud', _multiDropdownHandler);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfc2hpcGNsb3VkLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJtYXBwZXIiLCJqc2UiLCJsaWJzIiwiYWN0aW9uX21hcHBlciIsIl9zaW5nbGVGb3JtSW5pdCIsIndpZGdldHMiLCJpbml0IiwicmVtb3ZlQ2xhc3MiLCJzaG93IiwiaGlkZSIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiX3NpbmdsZUZvcm1TdWJtaXRIYW5kbGVyIiwidHJpZ2dlciIsIm5vdCIsInZhbCIsImh0bWwiLCJfdGVtcGxhdGVTZWxlY3Rpb25IYW5kbGVyIiwiYnV0dG9uIiwibGVuZ3RoIiwiJGZvcm0iLCIkdGVtcGxhdGUiLCJjbG9zZXN0IiwiX29wZW5TaW5nbGVGb3JtTW9kYWwiLCJldmVudCIsIm9yZGVySWQiLCJ0YXJnZXQiLCJwYXJlbnRzIiwiZmluZCIsImVtcHR5IiwiYWRkQ2xhc3MiLCJidXR0b25fY3JlYXRlX2xhYmVsIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJzaGlwY2xvdWRfbW9kYWxfYnV0dG9ucyIsInB1c2giLCJkaWFsb2ciLCJfc2hvd0xhYmVsc0hhbmRsZXIiLCJfc2luZ2xlRm9ybUdldFF1b3RlSGFuZGxlciIsImF1dG9PcGVuIiwibW9kYWwiLCJidXR0b25zIiwid2lkdGgiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCJvZiIsImxvYWQiLCJfYWRkU2hpcGNsb3VkRHJvcGRvd25FbnRyeSIsImVhY2giLCJidXR0b25fZHJvcGRvd24iLCJtYXBBY3Rpb24iLCJfbGFiZWxsaXN0UGlja3VwQ2hlY2tib3hIYW5kbGVyIiwicHJvcCIsIl9sb2FkTGFiZWxMaXN0Iiwib3JkZXJzX2lkIiwiX3BhY2tlZERvd25sb2FkSGFuZGxlciIsIl9waWNrdXBTdWJtaXRIYW5kbGVyIiwic2V0VGltZW91dCIsInBhcmVudCIsInNoaXBtZW50X2lkIiwiJGJ1dHRvblBsYWNlIiwiJHJvdyIsImFqYXgiLCJ0eXBlIiwidXJsIiwiY29uZmlnIiwiZ2V0IiwiZGF0YVR5cGUiLCJkb25lIiwicmVzdWx0IiwiZXJyb3JfbWVzc2FnZSIsInJlbW92ZSIsImZhaWwiLCJ1cmxzIiwicmVxdWVzdCIsImhyZWYiLCJhdHRyIiwicGFnZV90b2tlbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJkb3dubG9hZGxpbmsiLCJkb3dubG9hZEtleSIsImZvcm1kYXRhIiwic2VyaWFsaXplIiwicmVzdWx0X21lc3NhZ2UiLCJyZXN1bHRfbWVzc2FnZXMiLCJmb3JFYWNoIiwibWVzc2FnZSIsImFsZXJ0IiwiX2xvYWRVbmNvbmZpZ3VyZWROb3RlIiwicXVvdGUiLCJjYXJyaWVyIiwiJGNyZWF0ZV9sYWJlbCIsInNoaXBtZW50X3F1b3RlIiwiX211bHRpRHJvcGRvd25IYW5kbGVyIiwic2VsZWN0ZWRfb3JkZXJzIiwib3JkZXJzX3BhcmFtIiwiX211bHRpRm9ybUdldFF1b3RlSGFuZGxlciIsIml0ZW0iLCJfbXVsdGlGb3JtSW5pdCIsIl9tdWx0aUZvcm1TdWJtaXRIYW5kbGVyIiwiX2xvYWRNdWx0aUxhYmVsTGlzdCIsIm9yZGVyc19pZHMiLCJzaGlwbWVudHMiLCJtdWx0aUxhYmVsTGlzdFBhcmFtcyIsIl9tdWx0aVBpY2t1cFN1Ym1pdEhhbmRsZXIiLCJzcXVvdGUiLCJzaGlwbWVudF9xdW90ZXMiLCJjYXJyaWVyc190b3RhbCIsInByZXBlbmQiLCJpbnRlcnZhbF9jb3VudGVyIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGtCQURKLEVBR0ksQ0FDSUYsR0FBR0csTUFBSCxHQUFZLHFCQURoQixFQUVJSCxHQUFHRyxNQUFILEdBQVksdUJBRmhCLEVBR0ksaUJBSEosQ0FISjs7QUFTSTtBQUNBLFVBQVVDLElBQVYsRUFBZ0I7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bEI7O0FBSUEsWUFBSThFLG1CQUFtQixFQUF2QjtBQUFBLFlBQ0lDLFdBQVdDLFlBQVksWUFBWTtBQUMvQixnQkFBSXBILEVBQUUscUJBQUYsRUFBeUJxQixNQUE3QixFQUFxQztBQUNqQ2dHLDhCQUFjRixRQUFkO0FBQ0FoRTtBQUNIO0FBQ0QsZ0JBQUkrRCx1QkFBdUIsQ0FBM0IsRUFBOEI7QUFDMUJHLDhCQUFjRixRQUFkO0FBQ0g7QUFDSixTQVJVLEVBUVIsR0FSUSxDQURmOztBQVdBakgsWUFBSUMsSUFBSixDQUFTa0QsZUFBVCxDQUF5QkMsU0FBekIsQ0FBbUN0RCxFQUFFLHdCQUFGLENBQW5DLEVBQWdFLGVBQWhFLEVBQWlGLFdBQWpGLEVBQThGa0cscUJBQTlGOztBQUVBMUI7QUFDSCxLQW5CRDs7QUFxQkEsV0FBTzVFLE1BQVA7QUFDSCxDQXhoQkwiLCJmaWxlIjoib3JkZXJzL29yZGVyc19zaGlwY2xvdWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRvcmRlcnNfc2hpcGNsb3VkLmpzIDIwMTgtMTAtMTVcblx0R2FtYmlvIEdtYkhcblx0aHR0cDovL3d3dy5nYW1iaW8uZGVcblx0Q29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG5cdFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuXHRbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5cbi8qKlxuICogIyMgT3JkZXJzIFNoaXBjbG91ZCBNb2R1bGVcbiAqXG4gKiBUaGlzIG1vZHVsZSBpbXBsZW1lbnRzIHRoZSB1c2VyIGludGVyZmFjZSBmb3IgY3JlYXRpbmcgc2hpcHBpbmcgbGFiZWxzIHZpYSBTaGlwY2xvdWQuaW9cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvb3JkZXJzX3NoaXBjbG91ZFxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnb3JkZXJzX3NoaXBjbG91ZCcsXG5cbiAgICBbXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9hY3Rpb25fbWFwcGVyJyxcbiAgICAgICAgZ3guc291cmNlICsgJy9saWJzL2J1dHRvbl9kcm9wZG93bicsXG4gICAgICAgICdsb2FkaW5nX3NwaW5uZXInXG4gICAgXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L29yZGVyc19zaGlwY2xvdWQgKi9cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhlIG1hcHBlciBsaWJyYXJ5XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtYXBwZXIgPSBqc2UubGlicy5hY3Rpb25fbWFwcGVyLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICB2YXIgX3NpbmdsZUZvcm1Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCQoJyNzaGlwY2xvdWRfbW9kYWwnKSk7XG4gICAgICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLnJlbW92ZUNsYXNzKCdzY19sb2FkaW5nJyk7XG4gICAgICAgICAgICBpZiAoJCgnI3NjX3NpbmdsZV9jb250YWluZXInKS5kYXRhKCdpc19jb25maWd1cmVkJykgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAkKCcjc2Nfc2hvd19sYWJlbHMnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJyNzY19zaG93X2xhYmVscycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJyNzY19zaW5nbGVfZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGlucHV0LmNyZWF0ZV9sYWJlbCcpLm9uKCdjbGljaycsIF9zaW5nbGVGb3JtU3VibWl0SGFuZGxlcik7XG4gICAgICAgICAgICAkKCcjc2Nfc2luZ2xlX2Zvcm0gc2VsZWN0W25hbWU9XCJjYXJyaWVyXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGlucHV0W3R5cGU9XCJ0ZXh0XCJdJykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIC5jYXJyaWVyLXNwZWNpZmljJykubm90KCcuY2Fycmllci0nICsgJCh0aGlzKS52YWwoKSkuaGlkZSgnZmFzdCcpO1xuICAgICAgICAgICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSAuY2Fycmllci0nICsgJCh0aGlzKS52YWwoKSkubm90KCc6dmlzaWJsZScpLnNob3coJ2Zhc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIC5wcmljZV92YWx1ZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGRpdi5zY19xdW90ZScpLmh0bWwoJycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjc2NfcGFja2FnZV90ZW1wbGF0ZScpLm9uKCdjaGFuZ2UnLCBfdGVtcGxhdGVTZWxlY3Rpb25IYW5kbGVyKTtcbiAgICAgICAgICAgICQoJyNzY19wYWNrYWdlX3RlbXBsYXRlJykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAkKCcjc2Nfc2luZ2xlX2Zvcm0gaW5wdXQudGVtcGxhdGVfdmFsdWUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJyNzY19wYWNrYWdlX3RlbXBsYXRlJykudmFsKCctMScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjc2NfZ2V0X3F1b3RlJykuYnV0dG9uKCdkaXNhYmxlJyk7XG4gICAgICAgICAgICAkKCcjc2Nfc2luZ2xlX2Zvcm0gaW5wdXRbbmFtZT1cInF1b3RlX2NhcnJpZXJzW11cIl0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjc2Nfc2luZ2xlX2Zvcm0gaW5wdXRbbmFtZT1cInF1b3RlX2NhcnJpZXJzW11cIl06Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NjX2dldF9xdW90ZScpLmJ1dHRvbignZW5hYmxlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NjX2dldF9xdW90ZScpLmJ1dHRvbignZGlzYWJsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGlucHV0W25hbWU9XCJxdW90ZV9jYXJyaWVyc1tdXCJdOmZpcnN0JykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF90ZW1wbGF0ZVNlbGVjdGlvbkhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyICRmb3JtLCAkdGVtcGxhdGU7XG4gICAgICAgICAgICAkZm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xuICAgICAgICAgICAgJHRlbXBsYXRlID0gJCgnb3B0aW9uOnNlbGVjdGVkJywgJCh0aGlzKSk7XG4gICAgICAgICAgICBpZiAoJHRlbXBsYXRlLnZhbCgpICE9PSAnLTEnKSB7XG4gICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInBhY2thZ2Vbd2VpZ2h0XVwiXScsICRmb3JtKS52YWwoJHRlbXBsYXRlLmRhdGEoJ3dlaWdodCcpKTtcbiAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwicGFja2FnZVtoZWlnaHRdXCJdJywgJGZvcm0pLnZhbCgkdGVtcGxhdGUuZGF0YSgnaGVpZ2h0JykpO1xuICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJwYWNrYWdlW3dpZHRoXVwiXScsICRmb3JtKS52YWwoJHRlbXBsYXRlLmRhdGEoJ3dpZHRoJykpO1xuICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJwYWNrYWdlW2xlbmd0aF1cIl0nLCAkZm9ybSkudmFsKCR0ZW1wbGF0ZS5kYXRhKCdsZW5ndGgnKSk7XG4gICAgICAgICAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJwYWNrYWdlW3R5cGVdXCJdJywgJGZvcm0pLnZhbCgkdGVtcGxhdGUuZGF0YSgndHlwZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29wZW5TaW5nbGVGb3JtTW9kYWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJykgfHwgJCgnYm9keScpLmZpbmQoJyNnbV9vcmRlcl9pZCcpLnZhbCgpO1xuICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5lbXB0eSgpLmFkZENsYXNzKCdzY19sb2FkaW5nJyk7XG4gICAgICAgICAgICB2YXIgYnV0dG9uX2NyZWF0ZV9sYWJlbCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjcmVhdGVfbGFiZWwnLCAnc2hpcGNsb3VkJyksXG4gICAgICAgICAgICAgICAgc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMgPSBbXTtcblxuICAgICAgICAgICAgc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4nLFxuICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzY19nZXRfcXVvdGUnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzaGlwY2xvdWRfbW9kYWxfYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzaG93X2V4aXN0aW5nX2xhYmVscycsICdzaGlwY2xvdWQnKSxcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAnY2xpY2snOiBfc2hvd0xhYmVsc0hhbmRsZXIsXG4gICAgICAgICAgICAgICAgJ2lkJzogJ3NjX3Nob3dfbGFiZWxzJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzaGlwY2xvdWRfbW9kYWxfYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdnZXRfcXVvdGVzJywgJ3NoaXBjbG91ZCcpLFxuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICdjbGljayc6IF9zaW5nbGVGb3JtR2V0UXVvdGVIYW5kbGVyLFxuICAgICAgICAgICAgICAgICdpZCc6ICdzY19nZXRfcXVvdGUnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI3NoaXBjbG91ZF9tb2RhbCcpLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgYXV0b09wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjcmVhdGVfbGFiZWwnLCAnc2hpcGNsb3VkJyksXG4gICAgICAgICAgICAgICAgJ2RpYWxvZ0NsYXNzJzogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgYnV0dG9uczogc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtteTogJ2NlbnRlciB0b3AnLCBhdDogJ2NlbnRlciBib3R0b20nLCBvZjogJy5tYWluLXRvcC1oZWFkZXInfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjc2hpcGNsb3VkX21vZGFsJykuZGlhbG9nKCdvcGVuJyk7XG4gICAgICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLmxvYWQoJ2FkbWluLnBocD9kbz1TaGlwY2xvdWQvQ3JlYXRlTGFiZWxGb3JtJm9yZGVyc19pZD0nICsgb3JkZXJJZCxcbiAgICAgICAgICAgICAgICBfc2luZ2xlRm9ybUluaXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfYWRkU2hpcGNsb3VkRHJvcGRvd25FbnRyeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5neC1vcmRlcnMtdGFibGUgdHInKS5ub3QoJy5kYXRhVGFibGVIZWFkaW5nUm93JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkKHRoaXMpLCAnYWRtaW5fbWVudV9lbnRyeScsICdzaGlwY2xvdWQnLCBfb3BlblNpbmdsZUZvcm1Nb2RhbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oJCgnLmJvdHRvbS1zYXZlLWJhcicpLCAnYWRtaW5fbWVudV9lbnRyeScsICdzaGlwY2xvdWQnLCBfb3BlblNpbmdsZUZvcm1Nb2RhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjc2MtbGFiZWxsaXN0LWRyb3Bkb3duIGJ1dHRvbiwgZGl2LnBpY2t1cF90aW1lIGlucHV0JylcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3g6Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9sb2FkTGFiZWxMaXN0ID0gZnVuY3Rpb24gKG9yZGVyc19pZCkge1xuICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5sb2FkKCdhZG1pbi5waHA/ZG89U2hpcGNsb3VkL0xvYWRMYWJlbExpc3Qmb3JkZXJzX2lkPScgKyBvcmRlcnNfaWQsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJCgnI3NjX21vZGFsX2NvbnRlbnQnKSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzaGlwY2xvdWRfbW9kYWwnKS5kaWFsb2coe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsbGlzdF9mb3InLCAnc2hpcGNsb3VkJykgKyAnICcgKyBvcmRlcnNfaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykucmVtb3ZlQ2xhc3MoJ3NjX2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICAkKCdmb3JtI3NjX3BpY2t1cCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzYy1sYWJlbGxpc3QtZHJvcGRvd24nKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkb3dubG9hZF9sYWJlbHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NoaXBjbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBfcGFja2VkRG93bmxvYWRIYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2MtbGFiZWxsaXN0LWRyb3Bkb3duJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnb3JkZXJfcGlja3VwcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2hpcGNsb3VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9waWNrdXBTdWJtaXRIYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLm9uKCdjbGljaycsIF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIsIDIwMCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveF9hbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94JykucGFyZW50KCkuYWRkQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94JykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgX2xhYmVsbGlzdFBpY2t1cENoZWNrYm94SGFuZGxlcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnYS5zYy1kZWwtbGFiZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNoaXBtZW50X2lkID0gJCh0aGlzKS5kYXRhKCdzaGlwbWVudC1pZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b25QbGFjZSA9ICQodGhpcykuY2xvc2VzdCgnc3Bhbi5zYy1kZWwtbGFiZWwnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm93ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9EZWxldGVTaGlwbWVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge3NoaXBtZW50X2lkOiBzaGlwbWVudF9pZH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdFUlJPUicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b25QbGFjZS5odG1sKGRhdGEuZXJyb3JfbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYnV0dG9uUGxhY2UuYWRkQ2xhc3MoJ2JhZGdlJykuYWRkQ2xhc3MoJ2JhZGdlLWRhbmdlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvblBsYWNlLmh0bWwoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3NoaXBtZW50X2RlbGV0ZWQnLCAnc2hpcGNsb3VkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnYSwgaW5wdXQsIHRkLmNoZWNrYm94ID4gKicsICRyb3cpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdy5hZGRDbGFzcygnZGVsZXRlZC1zaGlwbWVudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYnV0dG9uUGxhY2UuaHRtbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3VibWl0X2Vycm9yJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9wYWNrZWREb3dubG9hZEhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHVybHMgPSBbXSwgcmVxdWVzdCA9IHt9O1xuICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgaHJlZiA9ICQoJ2EubGFiZWwtbGluaycsICQodGhpcykuY2xvc2VzdCgndHInKSkuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgICAgIHVybHMucHVzaChocmVmKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHVybHMpIHtcbiAgICAgICAgICAgICAgICAkKCcjZG93bmxvYWRfcmVzdWx0Jykuc2hvdygpO1xuICAgICAgICAgICAgICAgICQoJyNkb3dubG9hZF9yZXN1bHQnKS5odG1sKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdsb2FkaW5nJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnVybHMgPSB1cmxzO1xuICAgICAgICAgICAgICAgIHJlcXVlc3QucGFnZV90b2tlbiA9ICQoJyNzY19tb2RhbF9jb250ZW50IGlucHV0W25hbWU9XCJwYWdlX3Rva2VuXCJdJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1QYWNrZWREb3dubG9hZC9Eb3dubG9hZEJ5SnNvbicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkb3dubG9hZGxpbmsgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnL2FkbWluL2FkbWluLnBocD9kbz1QYWNrZWREb3dubG9hZC9Eb3dubG9hZFBhY2thZ2Uma2V5PScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZG93bmxvYWRLZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdPSycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZG93bmxvYWRfcmVzdWx0JykuaHRtbCgnPGlmcmFtZSBjbGFzcz1cImRvd25sb2FkX2lmcmFtZVwiIHNyYz1cIicgKyBkb3dubG9hZGxpbmsgKyAnXCI+PC9pZnJhbWU+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdFUlJPUicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjZG93bmxvYWRfcmVzdWx0JykuaHRtbChkYXRhLmVycm9yX21lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2Rvd25sb2FkX3Jlc3VsdCcpLmh0bWwoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9waWNrdXBTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICgkKCdpbnB1dC5waWNrdXBfY2hlY2tib3g6Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWRhdGEgPSAkKCdmb3JtI3NjX3BpY2t1cCcpLnNlcmlhbGl6ZSgpO1xuICAgICAgICAgICAgICAgICQoJyNwaWNrdXBfcmVzdWx0JykuaHRtbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2VuZGluZ19waWNrdXBfcmVxdWVzdCcsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICAgICAgJCgnI3BpY2t1cF9yZXN1bHQnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89U2hpcGNsb3VkL1BpY2t1cFNoaXBtZW50cycsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGZvcm1kYXRhLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHRfbWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5yZXN1bHRfbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdF9tZXNzYWdlID0gcmVzdWx0X21lc3NhZ2UgKyBtZXNzYWdlICsgJzxicj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGlja3VwX3Jlc3VsdCcpLmh0bWwocmVzdWx0X21lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9sb2FkVW5jb25maWd1cmVkTm90ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykubG9hZCgnYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9VbmNvbmZpZ3VyZWROb3RlJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9zaG93TGFiZWxzSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgb3JkZXJzX2lkID0gJCgnI3NjX3NpbmdsZV9mb3JtIGlucHV0W25hbWU9XCJvcmRlcnNfaWRcIl0nKS52YWwoKTtcbiAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuZW1wdHkoKS5hZGRDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAgICAgX2xvYWRMYWJlbExpc3Qob3JkZXJzX2lkKTtcbiAgICAgICAgICAgICQoJyNzY19zaG93X2xhYmVscycpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJyNzY19nZXRfcXVvdGUnKS5oaWRlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9zaW5nbGVGb3JtR2V0UXVvdGVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCgnI3NjX3NpbmdsZV9mb3JtJyksXG4gICAgICAgICAgICAgICAgcXVvdGUgPSAnJztcblxuICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIC5zY19xdW90ZScpLmh0bWwoJycpO1xuICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIC5zY19xdW90ZScpLmF0dHIoJ3RpdGxlJywgJycpO1xuXG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwicXVvdGVfY2FycmllcnNbXVwiXTpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhcnJpZXIgPSAkKHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAkY3JlYXRlX2xhYmVsID0gJCgnaW5wdXQuY3JlYXRlX2xhYmVsJywgJCh0aGlzKS5jbG9zZXN0KCd0cicpKTtcbiAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiY2FycmllclwiXScsICRmb3JtKS52YWwoY2Fycmllcik7XG4gICAgICAgICAgICAgICAgJCgnI3NjX3F1b3RlXycgKyBjYXJyaWVyKS5odG1sKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdsb2FkaW5nJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1TaGlwY2xvdWQvR2V0U2hpcG1lbnRRdW90ZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6ICRmb3JtLnNlcmlhbGl6ZSgpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlID0gZGF0YS5zaGlwbWVudF9xdW90ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2NfcXVvdGVfJyArIGNhcnJpZXIpLmh0bWwocXVvdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnJlc3VsdCA9PT0gJ0VSUk9SJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19xdW90ZV8nICsgY2FycmllcikuaHRtbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm90X3Bvc3NpYmxlJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2NfcXVvdGVfJyArIGNhcnJpZXIpLmF0dHIoJ3RpdGxlJywgZGF0YS5lcnJvcl9tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5yZXN1bHQgPT09ICdVTkNPTkZJR1VSRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2xvYWRVbmNvbmZpZ3VyZWROb3RlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdW90ZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdnZXRfcXVvdGVfZXJyb3InLCAnc2hpcGNsb3VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2NfcXVvdGVfJyArIGNhcnJpZXIpLmh0bWwocXVvdGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiY2FycmllclwiXScsICRmb3JtKS52YWwoJycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfc2luZ2xlRm9ybVN1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGNhcnJpZXIsIGZvcm1kYXRhO1xuICAgICAgICAgICAgJCgnI3NjX3Nob3dfbGFiZWxzJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI3NjX2dldF9xdW90ZScpLmhpZGUoKTtcbiAgICAgICAgICAgIGNhcnJpZXIgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJjYXJyaWVyXCJdJykudmFsKGNhcnJpZXIpO1xuICAgICAgICAgICAgZm9ybWRhdGEgPSAkKCcjc2Nfc2luZ2xlX2Zvcm0nKS5zZXJpYWxpemUoKTtcbiAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuZW1wdHkoKS5hZGRDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAgICAgLy8gYWxlcnQoJ2RhdGE6ICcrZm9ybWRhdGEpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9DcmVhdGVMYWJlbEZvcm1TdWJtaXQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IGZvcm1kYXRhLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdVTkNPTkZJR1VSRUQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbG9hZFVuY29uZmlndXJlZE5vdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnJlc3VsdCA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2xvYWRMYWJlbExpc3QoZGF0YS5vcmRlcnNfaWQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3JfbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuaHRtbCgnPGRpdiBjbGFzcz1cInNjX2Vycm9yXCI+JyArIGRhdGEuZXJyb3JfbWVzc2FnZSArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9tdWx0aURyb3Bkb3duSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRfb3JkZXJzID0gW10sIG9yZGVyc19wYXJhbSA9ICcnO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImdtX211bHRpX3N0YXR1c1tdXCJdOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZF9vcmRlcnMucHVzaCgkKHRoaXMpLnZhbCgpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5lbXB0eSgpLmFkZENsYXNzKCdzY19sb2FkaW5nJyk7XG4gICAgICAgICAgICB2YXIgc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMgPSBbXTtcbiAgICAgICAgICAgIHNoaXBjbG91ZF9tb2RhbF9idXR0b25zLnB1c2goe1xuICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjc2NfZ2V0X3F1b3RlJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZ2V0X3F1b3RlcycsICdzaGlwY2xvdWQnKSxcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAnY2xpY2snOiBfbXVsdGlGb3JtR2V0UXVvdGVIYW5kbGVyLFxuICAgICAgICAgICAgICAgICdpZCc6ICdzY19nZXRfcXVvdGUnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI3NoaXBjbG91ZF9tb2RhbCcpLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgYXV0b09wZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjcmVhdGVfbGFiZWxzJywgJ3NoaXBjbG91ZCcpLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IHNoaXBjbG91ZF9tb2RhbF9idXR0b25zLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAwLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7bXk6ICdjZW50ZXIgdG9wJywgYXQ6ICdjZW50ZXIgYm90dG9tJywgb2Y6ICcubWFpbi10b3AtaGVhZGVyJ31cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjc2hpcGNsb3VkX21vZGFsJykuZGlhbG9nKCdvcGVuJyk7XG4gICAgICAgICAgICBzZWxlY3RlZF9vcmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIG9yZGVyc19wYXJhbSArPSAnb3JkZXJzW109JyArIGl0ZW0gKyAnJic7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykubG9hZCgnYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9DcmVhdGVNdWx0aUxhYmVsRm9ybSYnICsgb3JkZXJzX3BhcmFtLCBfbXVsdGlGb3JtSW5pdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9tdWx0aUZvcm1Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnI3NoaXBjbG91ZF9tb2RhbCcpLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NyZWF0ZV9sYWJlbHMnLCAnc2hpcGNsb3VkJylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAgICAgJCgnI3NjX211bHRpX2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjc2NfY3JlYXRlX2xhYmVsJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI3NjX3Nob3dfbGFiZWxzJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQgaW5wdXQsICNzY19tb2RhbF9jb250ZW50IHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNjX211bHRpX3F1b3RlJykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjc2NfcGFja2FnZV90ZW1wbGF0ZScpLm9uKCdjaGFuZ2UnLCBfdGVtcGxhdGVTZWxlY3Rpb25IYW5kbGVyKTtcbiAgICAgICAgICAgICQoJ2lucHV0LmNyZWF0ZV9sYWJlbCcpLm9uKCdjbGljaycsIF9tdWx0aUZvcm1TdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX211bHRpRm9ybVN1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBmb3JtZGF0YSwgY2FycmllcjtcbiAgICAgICAgICAgIGNhcnJpZXIgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICQoJyNzY19tdWx0aV9mb3JtIGlucHV0W25hbWU9XCJjYXJyaWVyXCJdJykudmFsKGNhcnJpZXIpO1xuICAgICAgICAgICAgZm9ybWRhdGEgPSAkKCcjc2NfbXVsdGlfZm9ybScpLnNlcmlhbGl6ZSgpO1xuICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5lbXB0eSgpLmFkZENsYXNzKCdzY19sb2FkaW5nJyk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89U2hpcGNsb3VkL0NyZWF0ZU11bHRpTGFiZWxGb3JtU3VibWl0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiBmb3JtZGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykucmVtb3ZlQ2xhc3MoJ3NjX2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucmVzdWx0ID09PSAnVU5DT05GSUdVUkVEJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2xvYWRVbmNvbmZpZ3VyZWROb3RlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5yZXN1bHQgPT09ICdPSycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sb2FkTXVsdGlMYWJlbExpc3QoZGF0YS5vcmRlcnNfaWRzLCBkYXRhLnNoaXBtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5lcnJvcl9tZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5odG1sKCc8ZGl2IGNsYXNzPVwic2NfZXJyb3JcIj4nICsgZGF0YS5lcnJvcl9tZXNzYWdlICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3VibWl0X2Vycm9yJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2xvYWRNdWx0aUxhYmVsTGlzdCA9IGZ1bmN0aW9uIChvcmRlcnNfaWRzLCBzaGlwbWVudHMpIHtcbiAgICAgICAgICAgIHZhciBtdWx0aUxhYmVsTGlzdFBhcmFtcyA9IHsnb3JkZXJzX2lkcyc6IG9yZGVyc19pZHMsICdzaGlwbWVudHMnOiBzaGlwbWVudHN9O1xuXG4gICAgICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLmxvYWQoXG4gICAgICAgICAgICAgICAganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1TaGlwY2xvdWQvTG9hZE11bHRpTGFiZWxMaXN0JyxcbiAgICAgICAgICAgICAgICB7XCJqc29uXCI6IEpTT04uc3RyaW5naWZ5KG11bHRpTGFiZWxMaXN0UGFyYW1zKX0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJCgnI3NoaXBjbG91ZF9tb2RhbCcpKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NoaXBjbG91ZF9tb2RhbCcpLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGl0bGUnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbGFiZWxsaXN0JywgJ3NoaXBjbG91ZCcpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLnJlbW92ZUNsYXNzKCdzY19sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzY19nZXRfcXVvdGUnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJCgnZm9ybSNzY19waWNrdXAnKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2MtbGFiZWxsaXN0LWRyb3Bkb3duJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnZG93bmxvYWRfbGFiZWxzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzaGlwY2xvdWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgX3BhY2tlZERvd25sb2FkSGFuZGxlclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24ubWFwQWN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3NjLWxhYmVsbGlzdC1kcm9wZG93bicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ29yZGVyX3BpY2t1cHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NoaXBjbG91ZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBfcGlja3VwU3VibWl0SGFuZGxlclxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5vbignY2xpY2snLCBfbGFiZWxsaXN0UGlja3VwQ2hlY2tib3hIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChfbGFiZWxsaXN0UGlja3VwQ2hlY2tib3hIYW5kbGVyLCAyMDApO1xuICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3hfYWxsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykucHJvcCgnY2hlY2tlZCcpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94JykucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLnBhcmVudCgpLmFkZENsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94JykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX211bHRpUGlja3VwU3VibWl0SGFuZGxlciA9IF9waWNrdXBTdWJtaXRIYW5kbGVyO1xuXG4gICAgICAgIHZhciBfbXVsdGlGb3JtR2V0UXVvdGVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZvcm1kYXRhO1xuICAgICAgICAgICAgJCgnZGl2LnNjX3F1b3RlJykuaHRtbCgnJyk7XG4gICAgICAgICAgICBmb3JtZGF0YSA9ICQoJyNzY19tdWx0aV9mb3JtJykuc2VyaWFsaXplKCk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89U2hpcGNsb3VkL0dldE11bHRpU2hpcG1lbnRRdW90ZScsXG4gICAgICAgICAgICAgICAgZGF0YTogZm9ybWRhdGEsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdPSycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHNxdW90ZSBpbiBkYXRhLnNoaXBtZW50X3F1b3Rlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19tdWx0aV9xdW90ZV8nICsgZGF0YS5zaGlwbWVudF9xdW90ZXNbc3F1b3RlXS5vcmRlcnNfaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKGRhdGEuc2hpcG1lbnRfcXVvdGVzW3NxdW90ZV0uc2hpcG1lbnRfcXVvdGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnZGl2LnNjX211bHRpX3F1b3RlJykuc2hvdygnZmFzdCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBjYXJyaWVyIGluIGRhdGEuY2FycmllcnNfdG90YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjc2NfcXVvdGVfJyArIGNhcnJpZXIpLmh0bWwoZGF0YS5jYXJyaWVyc190b3RhbFtjYXJyaWVyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzdWJtaXRfZXJyb3InLCAnc2hpcGNsb3VkJykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCgnYm9keScpLnByZXBlbmQoJCgnPGRpdiBpZD1cInNoaXBjbG91ZF9tb2RhbFwiIHRpdGxlPVwiJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICdjcmVhdGVfbGFiZWxfd2luZG93X3RpdGxlJywgJ3NoaXBjbG91ZCcpICtcbiAgICAgICAgICAgICAgICAnXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPjxkaXYgaWQ9XCJzY19tb2RhbF9jb250ZW50XCI+PC9kaXY+PC9kaXY+JykpO1xuXG4gICAgICAgICAgICB2YXIgaW50ZXJ2YWxfY291bnRlciA9IDEwLFxuICAgICAgICAgICAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLmpzLWJ1dHRvbi1kcm9wZG93bicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfYWRkU2hpcGNsb3VkRHJvcGRvd25FbnRyeSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnRlcnZhbF9jb3VudGVyLS0gPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgNDAwKTtcblxuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkKCcjb3JkZXJzLXRhYmxlLWRyb3Bkb3duJyksICdjcmVhdGVfbGFiZWxzJywgJ3NoaXBjbG91ZCcsIF9tdWx0aURyb3Bkb3duSGFuZGxlcik7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG5cbiJdfQ==
