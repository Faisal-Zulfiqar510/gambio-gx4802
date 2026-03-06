'use strict';

/* --------------------------------------------------------------
	shipcloud.js 2018-10-15
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2015 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

$(function () {
    'use strict';

    var _openSingleFormModal = function _openSingleFormModal(event) {
        var orderId = $(event.target).parents('tr').attr('id') || $('body').find('#gm_order_id').val();
        $('#sc_modal_content').empty().addClass('sc_loading');
        var button_create_label = jse.core.lang.translate('create_label', 'shipcloud');
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
            width: 1200,
            position: { my: 'center top', at: 'center bottom', of: '#main-header' }
        });
        $('#shipcloud_modal').dialog('open');
        //$('#sc_modal_content').html('<p>Hallo!</p>');
        $('#sc_modal_content').load('admin.php?do=Shipcloud/CreateLabelForm&template_version=2&orders_id=' + orderId, _singleFormInit);
    };

    var _showLabelsHandler = function _showLabelsHandler(e) {
        var orders_id = $('#sc_single_form input[name="orders_id"]').val();
        $('#sc_modal_content').empty().addClass('sc_loading');
        _loadLabelList(orders_id);
        $('#sc_show_labels').hide();
        $('#sc_get_quote').hide();
        return false;
    };

    var _loadLabelList = function _loadLabelList(orders_id) {
        $('#sc_modal_content').load('admin.php?do=Shipcloud/LoadLabelList&orders_id=' + orders_id + '&template_version=2', function () {
            gx.widgets.init($('#sc_modal_content'));
            $('#shipcloud_modal').dialog({
                'title': jse.core.lang.translate('labellist_for', 'shipcloud') + ' ' + orders_id
            });
            $('#sc_modal_content').removeClass('sc_loading');

            $('form#sc_pickup').on('submit', function (e) {
                e.preventDefault();
            });
            $('#download_labels').on('click', _packedDownloadHandler);
            $('#order_pickups').on('click', _pickupSubmitHandler);
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
                    $row = $(this).closest('tr');
                $.ajax({
                    type: 'POST',
                    url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/DeleteShipment',
                    data: { shipment_id: shipment_id },
                    dataType: 'json'
                }).done(function (data) {
                    if (data.result === 'ERROR') {
                        $('#status-output').html(data.error_message).show();
                        $('#status-output').addClass('alert alert-danger');
                    } else {
                        $('#status-output').html(jse.core.lang.translate('shipment_deleted', 'shipcloud')).removeClass().addClass('alert alert-info').show();
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
            $('#pickup_result').addClass('alert alert-warning');
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

    var _labellistPickupCheckboxHandler = function _labellistPickupCheckboxHandler() {
        $('#sc-labellist-dropdown button, div.pickup_time input').prop('disabled', $('input.pickup_checkbox:checked').length === 0);
    };

    var _loadUnconfiguredNote = function _loadUnconfiguredNote() {
        $('#sc_modal_content').load('admin.php?do=Shipcloud/UnconfiguredNote');
    };

    var _singleFormGetQuoteHandler = function _singleFormGetQuoteHandler() {
        var $form = $('#sc_single_form');
        var quote = '';

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
        var $form = $(this).closest('form'),
            $template = $('option:selected', $(this));
        if ($template.val() !== '-1') {
            $('input[name="package[weight]"]', $form).val($template.data('weight'));
            $('input[name="package[height]"]', $form).val($template.data('height'));
            $('input[name="package[width]"]', $form).val($template.data('width'));
            $('input[name="package[length]"]', $form).val($template.data('length'));
            $('select[name="package[type]"]', $form).val($template.data('type'));
        }
    };

    var _singleFormSubmitHandler = function _singleFormSubmitHandler(e) {
        $('#sc_show_labels').hide();
        $('#sc_get_quote').hide();
        var carrier = $(this).attr('name');
        $('input[name="carrier"]').val(carrier);
        var formdata = $('#sc_single_form').serialize();
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

            $('.orders .table-main').DataTable().ajax.reload();
            $('.orders .table-main').orders_overview_filter('reload');
        }).fail(function (data) {
            alert(jse.core.lang.translate('submit_error', 'shipcloud'));
        });
        return false;
    };

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

    var _multiDropdownHandler = function _multiDropdownHandler(e) {
        var selected_orders = [],
            orders_param = '';
        $('table.table tbody tr').each(function () {
            var order_id = $(this).attr('id'),
                $checkbox = $('td:nth-child(1) span.single-checkbox', this);
            if ($checkbox.hasClass('checked')) {
                selected_orders.push(order_id);
            }
        });
        $('#sc_modal_content').empty().addClass('sc_loading');
        var shipcloud_modal_buttons = [];
        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('get_quotes', 'shipcloud'),
            'class': 'btn btn-primary',
            'click': _multiFormGetQuoteHandler,
            'id': 'sc_get_quote'
        });
        shipcloud_modal_buttons.push({
            'text': jse.core.lang.translate('close', 'buttons'),
            'class': 'btn',
            'click': function click() {
                $(this).dialog('close');
                $('#sc_get_quote').show();
            }
        });

        $('#shipcloud_modal').dialog({
            autoOpen: false,
            modal: true,
            'title': jse.core.lang.translate('create_labels', 'shipcloud'),
            'dialogClass': 'gx-container',
            buttons: shipcloud_modal_buttons,
            width: 1200,
            position: { my: 'center top', at: 'center bottom', of: '#main-header' }
        });

        $('#shipcloud_modal').dialog('open');
        selected_orders.forEach(function (item) {
            orders_param += 'orders[]=' + item + '&';
        });
        $('#sc_modal_content').load('admin.php?do=Shipcloud/CreateMultiLabelForm&template_version=2&' + orders_param, _multiFormInit);
    };

    var _multiFormInit = function _multiFormInit() {
        gx.widgets.init($('#shipcloud_modal'));
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
        var carrier = $(this).attr('name');
        $('#sc_multi_form input[name="carrier"]').val(carrier);
        var formdata = $('#sc_multi_form').serialize();
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

            $('.orders .table-main').DataTable().ajax.reload();
            $('.orders .table-main').orders_overview_filter('reload');
        }).fail(function (data) {
            alert(jse.core.lang.translate('submit_error', 'shipcloud'));
        });
        return false;
    };

    var _loadMultiLabelList = function _loadMultiLabelList(orders_ids, shipments) {
        var multiLabelListParams = { 'orders_ids': orders_ids, 'shipments': shipments };

        $('#sc_modal_content').load(jse.core.config.get('appUrl') + '/admin/admin.php?do=Shipcloud/LoadMultiLabelList&template_version=2', { "json": JSON.stringify(multiLabelListParams) }, function () {
            gx.widgets.init($('#shipcloud_modal'));
            $('#shipcloud_modal').dialog({
                'title': jse.core.lang.translate('labellist', 'shipcloud')
            });
            $('#sc_modal_content').removeClass('sc_loading');
            $('#sc_get_quote').hide();

            $('form#sc_pickup').on('submit', function (e) {
                e.preventDefault();
            });
            $('#download_labels').on('click', _packedDownloadHandler);
            $('#order_pickups').on('click', _pickupSubmitHandler);
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
        var formdata = $('#sc_multi_form').serialize();
        $('div.sc_quote').html('');
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

    /* =========================================================================================================== */

    $('body').prepend($('<div id="shipcloud_modal" title="' + jse.core.lang.translate('create_label_window_title', 'shipcloud') + '" style="display: none;"><div id="sc_modal_content"></div></div>'));

    var $table = $('.orders .table-main');

    $table.on('init.dt', function () {
        var addRowAction = function addRowAction() {
            $table.find('.btn-group.dropdown').each(function () {
                var orderId = $(this).parents('tr').data('id'),
                    defaultRowAction = $table.data('init-default-row-action') || 'edit';

                jse.libs.button_dropdown.addAction($(this), {
                    text: jse.core.lang.translate('admin_menu_entry', 'shipcloud'),
                    href: 'orders.php?oID=' + orderId + '&action=edit',
                    class: 'sc-single',
                    data: { configurationValue: 'sc-single' },
                    isDefault: defaultRowAction === 'sc-single',
                    callback: function callback(e) {
                        e.preventDefault();
                        _openSingleFormModal(e);
                    }
                });
            });
        };
        $table.on('draw.dt', addRowAction);
        addRowAction();

        var $bulkActions = $('.bulk-action'),
            defaultBulkAction = $table.data('init-default-bulk-action') || 'edit';
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('admin_menu_entry', 'shipcloud'),
            class: 'sc-multi',
            data: { configurationValue: 'sc-multi' },
            isDefault: defaultBulkAction === 'sc-multi',
            callback: function callback(e) {
                e.preventDefault();
                _multiDropdownHandler(e);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNoaXBjbG91ZC5qcyJdLCJuYW1lcyI6WyIkIiwiX29wZW5TaW5nbGVGb3JtTW9kYWwiLCJldmVudCIsIm9yZGVySWQiLCJ0YXJnZXQiLCJwYXJlbnRzIiwiYXR0ciIsImZpbmQiLCJ2YWwiLCJlbXB0eSIsImFkZENsYXNzIiwiYnV0dG9uX2NyZWF0ZV9sYWJlbCIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwic2hpcGNsb3VkX21vZGFsX2J1dHRvbnMiLCJwdXNoIiwiZGlhbG9nIiwic2hvdyIsIl9zaG93TGFiZWxzSGFuZGxlciIsIl9zaW5nbGVGb3JtR2V0UXVvdGVIYW5kbGVyIiwiYXV0b09wZW4iLCJtb2RhbCIsImJ1dHRvbnMiLCJ3aWR0aCIsInBvc2l0aW9uIiwibXkiLCJhdCIsIm9mIiwibG9hZCIsIl9zaW5nbGVGb3JtSW5pdCIsImUiLCJvcmRlcnNfaWQiLCJfbG9hZExhYmVsTGlzdCIsImhpZGUiLCJneCIsIndpZGdldHMiLCJpbml0IiwicmVtb3ZlQ2xhc3MiLCJvbiIsInByZXZlbnREZWZhdWx0IiwiX3BhY2tlZERvd25sb2FkSGFuZGxlciIsIl9waWNrdXBTdWJtaXRIYW5kbGVyIiwiX2xhYmVsbGlzdFBpY2t1cENoZWNrYm94SGFuZGxlciIsInNldFRpbWVvdXQiLCJwcm9wIiwicGFyZW50Iiwic2hpcG1lbnRfaWQiLCJkYXRhIiwiJHJvdyIsImNsb3Nlc3QiLCJhamF4IiwidHlwZSIsInVybCIsImNvbmZpZyIsImdldCIsImRhdGFUeXBlIiwiZG9uZSIsInJlc3VsdCIsImh0bWwiLCJlcnJvcl9tZXNzYWdlIiwicmVtb3ZlIiwiZmFpbCIsIiRidXR0b25QbGFjZSIsInVybHMiLCJyZXF1ZXN0IiwiZWFjaCIsImhyZWYiLCJwYWdlX3Rva2VuIiwiSlNPTiIsInN0cmluZ2lmeSIsImRvd25sb2FkbGluayIsImRvd25sb2FkS2V5IiwibGVuZ3RoIiwiZm9ybWRhdGEiLCJzZXJpYWxpemUiLCJyZXN1bHRfbWVzc2FnZSIsInJlc3VsdF9tZXNzYWdlcyIsImZvckVhY2giLCJtZXNzYWdlIiwiYWxlcnQiLCJfbG9hZFVuY29uZmlndXJlZE5vdGUiLCIkZm9ybSIsInF1b3RlIiwiY2FycmllciIsIiRjcmVhdGVfbGFiZWwiLCJzaGlwbWVudF9xdW90ZSIsIl9zaW5nbGVGb3JtU3VibWl0SGFuZGxlciIsInRyaWdnZXIiLCJub3QiLCJfdGVtcGxhdGVTZWxlY3Rpb25IYW5kbGVyIiwiYnV0dG9uIiwiJHRlbXBsYXRlIiwiRGF0YVRhYmxlIiwicmVsb2FkIiwib3JkZXJzX292ZXJ2aWV3X2ZpbHRlciIsIl9tdWx0aURyb3Bkb3duSGFuZGxlciIsInNlbGVjdGVkX29yZGVycyIsIm9yZGVyc19wYXJhbSIsIm9yZGVyX2lkIiwiJGNoZWNrYm94IiwiaGFzQ2xhc3MiLCJfbXVsdGlGb3JtR2V0UXVvdGVIYW5kbGVyIiwiaXRlbSIsIl9tdWx0aUZvcm1Jbml0IiwiX211bHRpRm9ybVN1Ym1pdEhhbmRsZXIiLCJfbG9hZE11bHRpTGFiZWxMaXN0Iiwib3JkZXJzX2lkcyIsInNoaXBtZW50cyIsIm11bHRpTGFiZWxMaXN0UGFyYW1zIiwiX211bHRpUGlja3VwU3VibWl0SGFuZGxlciIsInNxdW90ZSIsInNoaXBtZW50X3F1b3RlcyIsImNhcnJpZXJzX3RvdGFsIiwicHJlcGVuZCIsIiR0YWJsZSIsImFkZFJvd0FjdGlvbiIsImRlZmF1bHRSb3dBY3Rpb24iLCJsaWJzIiwiYnV0dG9uX2Ryb3Bkb3duIiwiYWRkQWN0aW9uIiwidGV4dCIsImNsYXNzIiwiY29uZmlndXJhdGlvblZhbHVlIiwiaXNEZWZhdWx0IiwiY2FsbGJhY2siLCIkYnVsa0FjdGlvbnMiLCJkZWZhdWx0QnVsa0FjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxFQUFFLFlBQVk7QUFDVjs7QUFFQSxRQUFNQyx1QkFBdUIsU0FBdkJBLG9CQUF1QixDQUFVQyxLQUFWLEVBQWlCO0FBQzFDLFlBQU1DLFVBQVVILEVBQUVFLE1BQU1FLE1BQVIsRUFBZ0JD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O0FBQ3hDMEgsMEJBQU05RyxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixrQkFBeEIsRUFBNEMsV0FBNUMsQ0FEa0M7QUFFeENxRCw4Q0FBd0JqRSxPQUF4QixpQkFGd0M7QUFHeEN3SCwyQkFBTyxXQUhpQztBQUl4QzFFLDBCQUFNLEVBQUMyRSxvQkFBb0IsV0FBckIsRUFKa0M7QUFLeENDLCtCQUFXUCxxQkFBcUIsV0FMUTtBQU14Q1EsOEJBQVUsa0JBQVU5RixDQUFWLEVBQWE7QUFDbkJBLDBCQUFFUyxjQUFGO0FBQ0F4Qyw2Q0FBcUIrQixDQUFyQjtBQUNIO0FBVHVDLGlCQUE1QztBQVdILGFBZkQ7QUFnQkgsU0FqQkQ7QUFrQkFvRixlQUFPNUUsRUFBUCxDQUFVLFNBQVYsRUFBcUI2RSxZQUFyQjtBQUNBQTs7QUFFQSxZQUFNVSxlQUFlL0gsRUFBRSxjQUFGLENBQXJCO0FBQUEsWUFDSWdJLG9CQUFvQlosT0FBT25FLElBQVAsQ0FBWSwwQkFBWixLQUEyQyxNQURuRTtBQUVBckMsWUFBSTJHLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FBbUNNLFlBQW5DLEVBQWlEO0FBQzdDTCxrQkFBTTlHLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGtCQUF4QixFQUE0QyxXQUE1QyxDQUR1QztBQUU3QzRHLG1CQUFPLFVBRnNDO0FBRzdDMUUsa0JBQU0sRUFBQzJFLG9CQUFvQixVQUFyQixFQUh1QztBQUk3Q0MsdUJBQVdHLHNCQUFzQixVQUpZO0FBSzdDRixzQkFBVSxrQkFBVTlGLENBQVYsRUFBYTtBQUNuQkEsa0JBQUVTLGNBQUY7QUFDQXdELHNDQUFzQmpFLENBQXRCO0FBQ0g7QUFSNEMsU0FBakQ7QUFVSCxLQWxDRDtBQW9DSCxDQS9mRCIsImZpbGUiOiJzaGlwY2xvdWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRzaGlwY2xvdWQuanMgMjAxOC0xMC0xNVxuXHRHYW1iaW8gR21iSFxuXHRodHRwOi8vd3d3LmdhbWJpby5kZVxuXHRDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcblx0UmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG5cdFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc3QgX29wZW5TaW5nbGVGb3JtTW9kYWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc3Qgb3JkZXJJZCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJykgfHwgJCgnYm9keScpLmZpbmQoJyNnbV9vcmRlcl9pZCcpLnZhbCgpO1xuICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLmVtcHR5KCkuYWRkQ2xhc3MoJ3NjX2xvYWRpbmcnKTtcbiAgICAgICAgY29uc3QgYnV0dG9uX2NyZWF0ZV9sYWJlbCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjcmVhdGVfbGFiZWwnLCAnc2hpcGNsb3VkJyk7XG4gICAgICAgIGxldCBzaGlwY2xvdWRfbW9kYWxfYnV0dG9ucyA9IFtdO1xuXG4gICAgICAgIHNoaXBjbG91ZF9tb2RhbF9idXR0b25zLnB1c2goe1xuICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgJCgnI3NjX2dldF9xdW90ZScpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNoaXBjbG91ZF9tb2RhbF9idXR0b25zLnB1c2goe1xuICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2hvd19leGlzdGluZ19sYWJlbHMnLCAnc2hpcGNsb3VkJyksXG4gICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICdjbGljayc6IF9zaG93TGFiZWxzSGFuZGxlcixcbiAgICAgICAgICAgICdpZCc6ICdzY19zaG93X2xhYmVscydcbiAgICAgICAgfSk7XG4gICAgICAgIHNoaXBjbG91ZF9tb2RhbF9idXR0b25zLnB1c2goe1xuICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZ2V0X3F1b3RlcycsICdzaGlwY2xvdWQnKSxcbiAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgJ2NsaWNrJzogX3NpbmdsZUZvcm1HZXRRdW90ZUhhbmRsZXIsXG4gICAgICAgICAgICAnaWQnOiAnc2NfZ2V0X3F1b3RlJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjc2hpcGNsb3VkX21vZGFsJykuZGlhbG9nKHtcbiAgICAgICAgICAgIGF1dG9PcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NyZWF0ZV9sYWJlbCcsICdzaGlwY2xvdWQnKSxcbiAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgYnV0dG9uczogc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMsXG4gICAgICAgICAgICB3aWR0aDogMTIwMCxcbiAgICAgICAgICAgIHBvc2l0aW9uOiB7bXk6ICdjZW50ZXIgdG9wJywgYXQ6ICdjZW50ZXIgYm90dG9tJywgb2Y6ICcjbWFpbi1oZWFkZXInfVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI3NoaXBjbG91ZF9tb2RhbCcpLmRpYWxvZygnb3BlbicpO1xuICAgICAgICAvLyQoJyNzY19tb2RhbF9jb250ZW50JykuaHRtbCgnPHA+SGFsbG8hPC9wPicpO1xuICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLmxvYWQoJ2FkbWluLnBocD9kbz1TaGlwY2xvdWQvQ3JlYXRlTGFiZWxGb3JtJnRlbXBsYXRlX3ZlcnNpb249MiZvcmRlcnNfaWQ9JyArIG9yZGVySWQsIF9zaW5nbGVGb3JtSW5pdCk7XG4gICAgfTtcblxuICAgIGNvbnN0IF9zaG93TGFiZWxzSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnN0IG9yZGVyc19pZCA9ICQoJyNzY19zaW5nbGVfZm9ybSBpbnB1dFtuYW1lPVwib3JkZXJzX2lkXCJdJykudmFsKCk7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuZW1wdHkoKS5hZGRDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICBfbG9hZExhYmVsTGlzdChvcmRlcnNfaWQpO1xuICAgICAgICAkKCcjc2Nfc2hvd19sYWJlbHMnKS5oaWRlKCk7XG4gICAgICAgICQoJyNzY19nZXRfcXVvdGUnKS5oaWRlKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgX2xvYWRMYWJlbExpc3QgPSBmdW5jdGlvbiAob3JkZXJzX2lkKSB7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykubG9hZCgnYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9Mb2FkTGFiZWxMaXN0Jm9yZGVyc19pZD0nICsgb3JkZXJzX2lkICsgJyZ0ZW1wbGF0ZV92ZXJzaW9uPTInLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkKCcjc2NfbW9kYWxfY29udGVudCcpKTtcbiAgICAgICAgICAgICAgICAkKCcjc2hpcGNsb3VkX21vZGFsJykuZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsbGlzdF9mb3InLCAnc2hpcGNsb3VkJykgKyAnICcgKyBvcmRlcnNfaWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLnJlbW92ZUNsYXNzKCdzY19sb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICAkKCdmb3JtI3NjX3BpY2t1cCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnI2Rvd25sb2FkX2xhYmVscycpLm9uKCdjbGljaycsIF9wYWNrZWREb3dubG9hZEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICQoJyNvcmRlcl9waWNrdXBzJykub24oJ2NsaWNrJywgX3BpY2t1cFN1Ym1pdEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLm9uKCdjbGljaycsIF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoX2xhYmVsbGlzdFBpY2t1cENoZWNrYm94SGFuZGxlciwgMjAwKTtcbiAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3hfYWxsJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLnBhcmVudCgpLmFkZENsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94JykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfbGFiZWxsaXN0UGlja3VwQ2hlY2tib3hIYW5kbGVyKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnYS5zYy1kZWwtbGFiZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBtZW50X2lkID0gJCh0aGlzKS5kYXRhKCdzaGlwbWVudC1pZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvdyA9ICQodGhpcykuY2xvc2VzdCgndHInKTtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1TaGlwY2xvdWQvRGVsZXRlU2hpcG1lbnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge3NoaXBtZW50X2lkOiBzaGlwbWVudF9pZH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ0VSUk9SJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjc3RhdHVzLW91dHB1dCcpLmh0bWwoZGF0YS5lcnJvcl9tZXNzYWdlKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzdGF0dXMtb3V0cHV0JykuYWRkQ2xhc3MoJ2FsZXJ0IGFsZXJ0LWRhbmdlcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzdGF0dXMtb3V0cHV0JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzaGlwbWVudF9kZWxldGVkJywgJ3NoaXBjbG91ZCcpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnYWxlcnQgYWxlcnQtaW5mbycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCdhLCBpbnB1dCwgdGQuY2hlY2tib3ggPiAqJywgJHJvdykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3cuYWRkQ2xhc3MoJ2RlbGV0ZWQtc2hpcG1lbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYnV0dG9uUGxhY2UuaHRtbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc3VibWl0X2Vycm9yJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IF9wYWNrZWREb3dubG9hZEhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCB1cmxzID0gW10sIHJlcXVlc3QgPSB7fTtcbiAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGhyZWYgPSAkKCdhLmxhYmVsLWxpbmsnLCAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIHVybHMucHVzaChocmVmKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1cmxzKSB7XG4gICAgICAgICAgICAkKCcjZG93bmxvYWRfcmVzdWx0Jykuc2hvdygpO1xuICAgICAgICAgICAgJCgnI2Rvd25sb2FkX3Jlc3VsdCcpLmh0bWwoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xvYWRpbmcnLCAnc2hpcGNsb3VkJykpO1xuICAgICAgICAgICAgcmVxdWVzdC51cmxzID0gdXJscztcbiAgICAgICAgICAgIHJlcXVlc3QucGFnZV90b2tlbiA9ICQoJyNzY19tb2RhbF9jb250ZW50IGlucHV0W25hbWU9XCJwYWdlX3Rva2VuXCJdJykudmFsKCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1QYWNrZWREb3dubG9hZC9Eb3dubG9hZEJ5SnNvbicsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkocmVxdWVzdCksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb3dubG9hZGxpbmsgPVxuICAgICAgICAgICAgICAgICAgICAgICAganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJy9hZG1pbi9hZG1pbi5waHA/ZG89UGFja2VkRG93bmxvYWQvRG93bmxvYWRQYWNrYWdlJmtleT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZG93bmxvYWRLZXk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2Rvd25sb2FkX3Jlc3VsdCcpLmh0bWwoJzxpZnJhbWUgY2xhc3M9XCJkb3dubG9hZF9pZnJhbWVcIiBzcmM9XCInICsgZG93bmxvYWRsaW5rICsgJ1wiPjwvaWZyYW1lPicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ0VSUk9SJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2Rvd25sb2FkX3Jlc3VsdCcpLmh0bWwoZGF0YS5lcnJvcl9tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Rvd25sb2FkX3Jlc3VsdCcpLmh0bWwoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGNvbnN0IF9waWNrdXBTdWJtaXRIYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoJCgnaW5wdXQucGlja3VwX2NoZWNrYm94OmNoZWNrZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtZGF0YSA9ICQoJ2Zvcm0jc2NfcGlja3VwJykuc2VyaWFsaXplKCk7XG4gICAgICAgICAgICAkKCcjcGlja3VwX3Jlc3VsdCcpLmh0bWwoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3NlbmRpbmdfcGlja3VwX3JlcXVlc3QnLCAnc2hpcGNsb3VkJykpO1xuICAgICAgICAgICAgJCgnI3BpY2t1cF9yZXN1bHQnKS5zaG93KCk7XG4gICAgICAgICAgICAkKCcjcGlja3VwX3Jlc3VsdCcpLmFkZENsYXNzKCdhbGVydCBhbGVydC13YXJuaW5nJyk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89U2hpcGNsb3VkL1BpY2t1cFNoaXBtZW50cycsXG4gICAgICAgICAgICAgICAgZGF0YTogZm9ybWRhdGEsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0X21lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5yZXN1bHRfbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0X21lc3NhZ2UgPSByZXN1bHRfbWVzc2FnZSArIG1lc3NhZ2UgKyAnPGJyPic7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjcGlja3VwX3Jlc3VsdCcpLmh0bWwocmVzdWx0X21lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGNvbnN0IF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJyNzYy1sYWJlbGxpc3QtZHJvcGRvd24gYnV0dG9uLCBkaXYucGlja3VwX3RpbWUgaW5wdXQnKVxuICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94OmNoZWNrZWQnKS5sZW5ndGggPT09IDApO1xuICAgIH07XG5cbiAgICBjb25zdCBfbG9hZFVuY29uZmlndXJlZE5vdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykubG9hZCgnYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9VbmNvbmZpZ3VyZWROb3RlJyk7XG4gICAgfTtcblxuXG4gICAgY29uc3QgX3NpbmdsZUZvcm1HZXRRdW90ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0ICRmb3JtID0gJCgnI3NjX3NpbmdsZV9mb3JtJyk7XG4gICAgICAgIGxldCBxdW90ZSA9ICcnO1xuXG4gICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSAuc2NfcXVvdGUnKS5odG1sKCcnKTtcbiAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIC5zY19xdW90ZScpLmF0dHIoJ3RpdGxlJywgJycpO1xuXG4gICAgICAgICQoJ2lucHV0W25hbWU9XCJxdW90ZV9jYXJyaWVyc1tdXCJdOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhcnJpZXIgPSAkKHRoaXMpLnZhbCgpLFxuICAgICAgICAgICAgICAgICRjcmVhdGVfbGFiZWwgPSAkKCdpbnB1dC5jcmVhdGVfbGFiZWwnLCAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImNhcnJpZXJcIl0nLCAkZm9ybSkudmFsKGNhcnJpZXIpO1xuICAgICAgICAgICAgJCgnI3NjX3F1b3RlXycgKyBjYXJyaWVyKS5odG1sKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdsb2FkaW5nJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1TaGlwY2xvdWQvR2V0U2hpcG1lbnRRdW90ZScsXG4gICAgICAgICAgICAgICAgZGF0YTogJGZvcm0uc2VyaWFsaXplKCksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT09ICdPSycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1b3RlID0gZGF0YS5zaGlwbWVudF9xdW90ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19xdW90ZV8nICsgY2FycmllcikuaHRtbChxdW90ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5yZXN1bHQgPT09ICdFUlJPUicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19xdW90ZV8nICsgY2FycmllcikuaHRtbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm90X3Bvc3NpYmxlJywgJ3NoaXBjbG91ZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19xdW90ZV8nICsgY2FycmllcikuYXR0cigndGl0bGUnLCBkYXRhLmVycm9yX21lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEucmVzdWx0ID09PSAnVU5DT05GSUdVUkVEJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2xvYWRVbmNvbmZpZ3VyZWROb3RlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1b3RlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2dldF9xdW90ZV9lcnJvcicsICdzaGlwY2xvdWQnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NjX3F1b3RlXycgKyBjYXJyaWVyKS5odG1sKHF1b3RlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImNhcnJpZXJcIl0nLCAkZm9ybSkudmFsKCcnKTtcbiAgICB9O1xuXG4gICAgY29uc3QgX3NpbmdsZUZvcm1Jbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBneC53aWRnZXRzLmluaXQoJCgnI3NoaXBjbG91ZF9tb2RhbCcpKTtcbiAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICBpZiAoJCgnI3NjX3NpbmdsZV9jb250YWluZXInKS5kYXRhKCdpc19jb25maWd1cmVkJykgPT09IDEpIHtcbiAgICAgICAgICAgICQoJyNzY19zaG93X2xhYmVscycpLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyNzY19zaG93X2xhYmVscycpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICAkKCcjc2Nfc2luZ2xlX2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSBpbnB1dC5jcmVhdGVfbGFiZWwnKS5vbignY2xpY2snLCBfc2luZ2xlRm9ybVN1Ym1pdEhhbmRsZXIpO1xuICAgICAgICAkKCcjc2Nfc2luZ2xlX2Zvcm0gc2VsZWN0W25hbWU9XCJjYXJyaWVyXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAkKCcjc2Nfc2luZ2xlX2Zvcm0gaW5wdXRbdHlwZT1cInRleHRcIl0nKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSAuY2Fycmllci1zcGVjaWZpYycpLm5vdCgnLmNhcnJpZXItJyArICQodGhpcykudmFsKCkpLmhpZGUoJ2Zhc3QnKTtcbiAgICAgICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSAuY2Fycmllci0nICsgJCh0aGlzKS52YWwoKSkubm90KCc6dmlzaWJsZScpLnNob3coJ2Zhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSAucHJpY2VfdmFsdWUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGRpdi5zY19xdW90ZScpLmh0bWwoJycpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnI3NjX3BhY2thZ2VfdGVtcGxhdGUnKS5vbignY2hhbmdlJywgX3RlbXBsYXRlU2VsZWN0aW9uSGFuZGxlcik7XG4gICAgICAgICQoJyNzY19wYWNrYWdlX3RlbXBsYXRlJykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICQoJyNzY19zaW5nbGVfZm9ybSBpbnB1dC50ZW1wbGF0ZV92YWx1ZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjc2NfcGFja2FnZV90ZW1wbGF0ZScpLnZhbCgnLTEnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNzY19nZXRfcXVvdGUnKS5idXR0b24oJ2Rpc2FibGUnKTtcbiAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGlucHV0W25hbWU9XCJxdW90ZV9jYXJyaWVyc1tdXCJdJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKCcjc2Nfc2luZ2xlX2Zvcm0gaW5wdXRbbmFtZT1cInF1b3RlX2NhcnJpZXJzW11cIl06Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKCcjc2NfZ2V0X3F1b3RlJykuYnV0dG9uKCdlbmFibGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnI3NjX2dldF9xdW90ZScpLmJ1dHRvbignZGlzYWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI3NjX3NpbmdsZV9mb3JtIGlucHV0W25hbWU9XCJxdW90ZV9jYXJyaWVyc1tdXCJdOmZpcnN0JykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfTtcblxuICAgIGNvbnN0IF90ZW1wbGF0ZVNlbGVjdGlvbkhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBjb25zdCAkZm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpLFxuICAgICAgICAgICAgJHRlbXBsYXRlID0gJCgnb3B0aW9uOnNlbGVjdGVkJywgJCh0aGlzKSk7XG4gICAgICAgIGlmICgkdGVtcGxhdGUudmFsKCkgIT09ICctMScpIHtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJwYWNrYWdlW3dlaWdodF1cIl0nLCAkZm9ybSkudmFsKCR0ZW1wbGF0ZS5kYXRhKCd3ZWlnaHQnKSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwicGFja2FnZVtoZWlnaHRdXCJdJywgJGZvcm0pLnZhbCgkdGVtcGxhdGUuZGF0YSgnaGVpZ2h0JykpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInBhY2thZ2Vbd2lkdGhdXCJdJywgJGZvcm0pLnZhbCgkdGVtcGxhdGUuZGF0YSgnd2lkdGgnKSk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwicGFja2FnZVtsZW5ndGhdXCJdJywgJGZvcm0pLnZhbCgkdGVtcGxhdGUuZGF0YSgnbGVuZ3RoJykpO1xuICAgICAgICAgICAgJCgnc2VsZWN0W25hbWU9XCJwYWNrYWdlW3R5cGVdXCJdJywgJGZvcm0pLnZhbCgkdGVtcGxhdGUuZGF0YSgndHlwZScpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBfc2luZ2xlRm9ybVN1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAkKCcjc2Nfc2hvd19sYWJlbHMnKS5oaWRlKCk7XG4gICAgICAgICQoJyNzY19nZXRfcXVvdGUnKS5oaWRlKCk7XG4gICAgICAgIGNvbnN0IGNhcnJpZXIgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgJCgnaW5wdXRbbmFtZT1cImNhcnJpZXJcIl0nKS52YWwoY2Fycmllcik7XG4gICAgICAgIGNvbnN0IGZvcm1kYXRhID0gJCgnI3NjX3NpbmdsZV9mb3JtJykuc2VyaWFsaXplKCk7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuZW1wdHkoKS5hZGRDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAvLyBhbGVydCgnZGF0YTogJytmb3JtZGF0YSk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89U2hpcGNsb3VkL0NyZWF0ZUxhYmVsRm9ybVN1Ym1pdCcsXG4gICAgICAgICAgICBkYXRhOiBmb3JtZGF0YSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ1VOQ09ORklHVVJFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgX2xvYWRVbmNvbmZpZ3VyZWROb3RlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnJlc3VsdCA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICBfbG9hZExhYmVsTGlzdChkYXRhLm9yZGVyc19pZCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3JfbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5odG1sKCc8ZGl2IGNsYXNzPVwic2NfZXJyb3JcIj4nICsgZGF0YS5lcnJvcl9tZXNzYWdlICsgJzwvZGl2PicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLm9yZGVyc19vdmVydmlld19maWx0ZXIoJ3JlbG9hZCcpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKiAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAqL1xuXG4gICAgY29uc3QgX211bHRpRHJvcGRvd25IYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkX29yZGVycyA9IFtdLCBvcmRlcnNfcGFyYW0gPSAnJztcbiAgICAgICAgJCgndGFibGUudGFibGUgdGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVyX2lkID0gJCh0aGlzKS5hdHRyKCdpZCcpLFxuICAgICAgICAgICAgICAgICRjaGVja2JveCA9ICQoJ3RkOm50aC1jaGlsZCgxKSBzcGFuLnNpbmdsZS1jaGVja2JveCcsIHRoaXMpO1xuICAgICAgICAgICAgaWYgKCRjaGVja2JveC5oYXNDbGFzcygnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRfb3JkZXJzLnB1c2gob3JkZXJfaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5lbXB0eSgpLmFkZENsYXNzKCdzY19sb2FkaW5nJyk7XG4gICAgICAgIGxldCBzaGlwY2xvdWRfbW9kYWxfYnV0dG9ucyA9IFtdO1xuICAgICAgICBzaGlwY2xvdWRfbW9kYWxfYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2dldF9xdW90ZXMnLCAnc2hpcGNsb3VkJyksXG4gICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICdjbGljayc6IF9tdWx0aUZvcm1HZXRRdW90ZUhhbmRsZXIsXG4gICAgICAgICAgICAnaWQnOiAnc2NfZ2V0X3F1b3RlJ1xuICAgICAgICB9KTtcbiAgICAgICAgc2hpcGNsb3VkX21vZGFsX2J1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjbG9zZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAkKCcjc2NfZ2V0X3F1b3RlJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjc2hpcGNsb3VkX21vZGFsJykuZGlhbG9nKHtcbiAgICAgICAgICAgIGF1dG9PcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NyZWF0ZV9sYWJlbHMnLCAnc2hpcGNsb3VkJyksXG4gICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHNoaXBjbG91ZF9tb2RhbF9idXR0b25zLFxuICAgICAgICAgICAgd2lkdGg6IDEyMDAsXG4gICAgICAgICAgICBwb3NpdGlvbjoge215OiAnY2VudGVyIHRvcCcsIGF0OiAnY2VudGVyIGJvdHRvbScsIG9mOiAnI21haW4taGVhZGVyJ31cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI3NoaXBjbG91ZF9tb2RhbCcpLmRpYWxvZygnb3BlbicpO1xuICAgICAgICBzZWxlY3RlZF9vcmRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgb3JkZXJzX3BhcmFtICs9ICdvcmRlcnNbXT0nICsgaXRlbSArICcmJztcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykubG9hZCgnYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9DcmVhdGVNdWx0aUxhYmVsRm9ybSZ0ZW1wbGF0ZV92ZXJzaW9uPTImJyArIG9yZGVyc19wYXJhbSwgX211bHRpRm9ybUluaXQpO1xuICAgIH07XG5cbiAgICBjb25zdCBfbXVsdGlGb3JtSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCQoJyNzaGlwY2xvdWRfbW9kYWwnKSk7XG4gICAgICAgICQoJyNzaGlwY2xvdWRfbW9kYWwnKS5kaWFsb2coe1xuICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NyZWF0ZV9sYWJlbHMnLCAnc2hpcGNsb3VkJylcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykucmVtb3ZlQ2xhc3MoJ3NjX2xvYWRpbmcnKTtcbiAgICAgICAgJCgnI3NjX211bHRpX2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNzY19jcmVhdGVfbGFiZWwnKS5oaWRlKCk7XG4gICAgICAgICQoJyNzY19zaG93X2xhYmVscycpLmhpZGUoKTtcbiAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQgaW5wdXQsICNzY19tb2RhbF9jb250ZW50IHNlbGVjdCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuc2NfbXVsdGlfcXVvdGUnKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcjc2NfcGFja2FnZV90ZW1wbGF0ZScpLm9uKCdjaGFuZ2UnLCBfdGVtcGxhdGVTZWxlY3Rpb25IYW5kbGVyKTtcbiAgICAgICAgJCgnaW5wdXQuY3JlYXRlX2xhYmVsJykub24oJ2NsaWNrJywgX211bHRpRm9ybVN1Ym1pdEhhbmRsZXIpO1xuICAgIH07XG5cbiAgICBjb25zdCBfbXVsdGlGb3JtU3VibWl0SGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBjb25zdCBjYXJyaWVyID0gJCh0aGlzKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICQoJyNzY19tdWx0aV9mb3JtIGlucHV0W25hbWU9XCJjYXJyaWVyXCJdJykudmFsKGNhcnJpZXIpO1xuICAgICAgICBjb25zdCBmb3JtZGF0YSA9ICQoJyNzY19tdWx0aV9mb3JtJykuc2VyaWFsaXplKCk7XG4gICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuZW1wdHkoKS5hZGRDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9DcmVhdGVNdWx0aUxhYmVsRm9ybVN1Ym1pdCcsXG4gICAgICAgICAgICBkYXRhOiBmb3JtZGF0YSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgJCgnI3NjX21vZGFsX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnc2NfbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ1VOQ09ORklHVVJFRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgX2xvYWRVbmNvbmZpZ3VyZWROb3RlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnJlc3VsdCA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICBfbG9hZE11bHRpTGFiZWxMaXN0KGRhdGEub3JkZXJzX2lkcywgZGF0YS5zaGlwbWVudHMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmVycm9yX21lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykuaHRtbCgnPGRpdiBjbGFzcz1cInNjX2Vycm9yXCI+JyArIGRhdGEuZXJyb3JfbWVzc2FnZSArICc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoJy5vcmRlcnMgLnRhYmxlLW1haW4nKS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICQoJy5vcmRlcnMgLnRhYmxlLW1haW4nKS5vcmRlcnNfb3ZlcnZpZXdfZmlsdGVyKCdyZWxvYWQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzdWJtaXRfZXJyb3InLCAnc2hpcGNsb3VkJykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgY29uc3QgX2xvYWRNdWx0aUxhYmVsTGlzdCA9IGZ1bmN0aW9uIChvcmRlcnNfaWRzLCBzaGlwbWVudHMpIHtcbiAgICAgICAgY29uc3QgbXVsdGlMYWJlbExpc3RQYXJhbXMgPSB7J29yZGVyc19pZHMnOiBvcmRlcnNfaWRzLCAnc2hpcG1lbnRzJzogc2hpcG1lbnRzfTtcblxuICAgICAgICAkKCcjc2NfbW9kYWxfY29udGVudCcpLmxvYWQoXG4gICAgICAgICAgICBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9Mb2FkTXVsdGlMYWJlbExpc3QmdGVtcGxhdGVfdmVyc2lvbj0yJyxcbiAgICAgICAgICAgIHtcImpzb25cIjogSlNPTi5zdHJpbmdpZnkobXVsdGlMYWJlbExpc3RQYXJhbXMpfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJCgnI3NoaXBjbG91ZF9tb2RhbCcpKTtcbiAgICAgICAgICAgICAgICAkKCcjc2hpcGNsb3VkX21vZGFsJykuZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2xhYmVsbGlzdCcsICdzaGlwY2xvdWQnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJyNzY19tb2RhbF9jb250ZW50JykucmVtb3ZlQ2xhc3MoJ3NjX2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAkKCcjc2NfZ2V0X3F1b3RlJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAgICAgJCgnZm9ybSNzY19waWNrdXAnKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJyNkb3dubG9hZF9sYWJlbHMnKS5vbignY2xpY2snLCBfcGFja2VkRG93bmxvYWRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAkKCcjb3JkZXJfcGlja3VwcycpLm9uKCdjbGljaycsIF9waWNrdXBTdWJtaXRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5vbignY2xpY2snLCBfbGFiZWxsaXN0UGlja3VwQ2hlY2tib3hIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KF9sYWJlbGxpc3RQaWNrdXBDaGVja2JveEhhbmRsZXIsIDIwMCk7XG4gICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94X2FsbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykucHJvcCgnY2hlY2tlZCcpID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dC5waWNrdXBfY2hlY2tib3gnKS5wYXJlbnQoKS5hZGRDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQucGlja3VwX2NoZWNrYm94JykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0LnBpY2t1cF9jaGVja2JveCcpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX2xhYmVsbGlzdFBpY2t1cENoZWNrYm94SGFuZGxlcigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBfbXVsdGlQaWNrdXBTdWJtaXRIYW5kbGVyID0gX3BpY2t1cFN1Ym1pdEhhbmRsZXI7XG5cbiAgICBjb25zdCBfbXVsdGlGb3JtR2V0UXVvdGVIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zdCBmb3JtZGF0YSA9ICQoJyNzY19tdWx0aV9mb3JtJykuc2VyaWFsaXplKCk7XG4gICAgICAgICQoJ2Rpdi5zY19xdW90ZScpLmh0bWwoJycpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVNoaXBjbG91ZC9HZXRNdWx0aVNoaXBtZW50UXVvdGUnLFxuICAgICAgICAgICAgZGF0YTogZm9ybWRhdGEsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBzcXVvdGUgaW4gZGF0YS5zaGlwbWVudF9xdW90ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzY19tdWx0aV9xdW90ZV8nICsgZGF0YS5zaGlwbWVudF9xdW90ZXNbc3F1b3RlXS5vcmRlcnNfaWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmh0bWwoZGF0YS5zaGlwbWVudF9xdW90ZXNbc3F1b3RlXS5zaGlwbWVudF9xdW90ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCgnZGl2LnNjX211bHRpX3F1b3RlJykuc2hvdygnZmFzdCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGNhcnJpZXIgaW4gZGF0YS5jYXJyaWVyc190b3RhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3NjX3F1b3RlXycgKyBjYXJyaWVyKS5odG1sKGRhdGEuY2FycmllcnNfdG90YWxbY2Fycmllcl0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N1Ym1pdF9lcnJvcicsICdzaGlwY2xvdWQnKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICAgJCgnYm9keScpLnByZXBlbmQoJCgnPGRpdiBpZD1cInNoaXBjbG91ZF9tb2RhbFwiIHRpdGxlPVwiJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKFxuICAgICAgICAnY3JlYXRlX2xhYmVsX3dpbmRvd190aXRsZScsICdzaGlwY2xvdWQnKSArXG4gICAgICAgICdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+PGRpdiBpZD1cInNjX21vZGFsX2NvbnRlbnRcIj48L2Rpdj48L2Rpdj4nKSk7XG5cbiAgICBjb25zdCAkdGFibGUgPSAkKCcub3JkZXJzIC50YWJsZS1tYWluJyk7XG5cbiAgICAkdGFibGUub24oJ2luaXQuZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhZGRSb3dBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkdGFibGUuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVySWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvd0FjdGlvbiA9ICR0YWJsZS5kYXRhKCdpbml0LWRlZmF1bHQtcm93LWFjdGlvbicpIHx8ICdlZGl0JztcblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fbWVudV9lbnRyeScsICdzaGlwY2xvdWQnKSxcbiAgICAgICAgICAgICAgICAgICAgaHJlZjogYG9yZGVycy5waHA/b0lEPSR7b3JkZXJJZH0mYWN0aW9uPWVkaXRgLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3NjLXNpbmdsZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdzYy1zaW5nbGUnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnc2Mtc2luZ2xlJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfb3BlblNpbmdsZUZvcm1Nb2RhbChlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgICR0YWJsZS5vbignZHJhdy5kdCcsIGFkZFJvd0FjdGlvbik7XG4gICAgICAgIGFkZFJvd0FjdGlvbigpO1xuXG4gICAgICAgIGNvbnN0ICRidWxrQWN0aW9ucyA9ICQoJy5idWxrLWFjdGlvbicpLFxuICAgICAgICAgICAgZGVmYXVsdEJ1bGtBY3Rpb24gPSAkdGFibGUuZGF0YSgnaW5pdC1kZWZhdWx0LWJ1bGstYWN0aW9uJykgfHwgJ2VkaXQnO1xuICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2FkbWluX21lbnVfZW50cnknLCAnc2hpcGNsb3VkJyksXG4gICAgICAgICAgICBjbGFzczogJ3NjLW11bHRpJyxcbiAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdzYy1tdWx0aSd9LFxuICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0QnVsa0FjdGlvbiA9PT0gJ3NjLW11bHRpJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBfbXVsdGlEcm9wZG93bkhhbmRsZXIoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTtcbiJdfQ==
