'use strict';

/* --------------------------------------------------------------
 events.js 2021-05-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Main Table Events
 *
 * Handles the events of the main orders table.
 */
gx.controllers.module('events', [jse.source + '/vendor/momentjs/moment.min.js', 'loading_spinner', 'modal', 'xhr'], function (data) {

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
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * On Bulk Selection Change
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {Boolean} propagate Whether to affect the body elements. We do not need this on "draw.dt" event.
     */
    function _onBulkSelectionChange(event) {
        var propagate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (propagate === false) {
            return; // Do not propagate on draw event because the body checkboxes are unchecked by default.
        }

        $this.find('tbody input:checkbox').single_checkbox('checked', $(this).prop('checked')).trigger('change');
    }

    /**
     * On Table Row Click
     *
     * When a row is clicked then the row-checkbox must be toggled.
     *
     * @param {jQuery.Event} event
     */
    function _onTableRowClick(event) {
        if (!$(event.target).is('td')) {
            return;
        }

        $(this).find('input:checkbox').prop('checked', !$(this).find('input:checkbox').prop('checked')).trigger('change');
    }

    /**
     * On Table Row Checkbox Change
     *
     * Adjust the bulk actions state whenever there are changes in the table checkboxes.
     */
    function _onTableRowCheckboxChange() {
        if ($this.find('input:checkbox:checked').length > 0) {
            $this.parents('.orders').find('.bulk-action > button').removeClass('disabled');
        } else {
            $this.parents('.orders').find('.bulk-action > button').addClass('disabled');
        }
    }

    /**
     * On Cancel Order Click
     *
     * @param {jQuery.Event} event
     */
    function _onCancelOrderClick(event) {
        event.preventDefault();

        var selectedOrders = _getSelectedOrders($(this));

        // Show the order delete modal.
        $('.cancel.modal .selected-orders').text(selectedOrders.join(', '));
        $('.cancel.modal').modal('show');
    }

    /**
     * On Send Order Click.
     *
     * Sends the email order confirmations.
     *
     * @param {jQuery.Event} event jQuery event object.
     */
    function _onBulkEmailOrderClick(event) {
        var $modal = $('.bulk-email-order.modal');
        var $mailList = $modal.find('.email-list');

        var generateMailRowMarkup = function generateMailRowMarkup(data) {
            var $row = $('<div/>', { class: 'form-group email-list-item' });
            var $idColumn = $('<div/>', { class: 'col-sm-3' });
            var $emailColumn = $('<div/>', { class: 'col-sm-9' });

            var $idLabel = $('<label/>', {
                class: 'control-label id-label force-text-color-black force-text-normal-weight',
                text: data.id
            });

            var $emailInput = $('<input/>', {
                class: 'form-control email-input',
                type: 'text',
                value: data.customerEmail
            });

            $idLabel.appendTo($idColumn);
            $emailInput.appendTo($emailColumn);

            $row.append([$idColumn, $emailColumn]);
            $row.data('order', data);

            return $row;
        };

        var selectedOrders = [];

        event.preventDefault();

        $this.find('tbody input:checkbox:checked').each(function () {
            var rowData = $(this).parents('tr').data();
            selectedOrders.push(rowData);
        });

        if (selectedOrders.length) {
            $mailList.empty();
            selectedOrders.forEach(function (order) {
                return $mailList.append(generateMailRowMarkup(order));
            });
            $modal.modal('show');
        }
    }

    /**
     * On Send Invoice Click.
     *
     * Sends the email invoice.
     *
     * @param {jQuery.Event} event Fired event.
     */
    function _onBulkEmailInvoiceClick(event) {
        var $modal = $('.bulk-email-invoice.modal');
        var $mailList = $modal.find('.email-list');

        var generateMailRowMarkup = function generateMailRowMarkup(data) {
            var $row = $('<div/>', { class: 'form-group email-list-item' });
            var $idColumn = $('<div/>', { class: 'col-sm-3' });
            var $invoiceColumn = $('<div/>', { class: 'col-sm-3' });
            var $emailColumn = $('<div/>', { class: 'col-sm-6' });

            var $latestInvoiceIdInput = $('<input/>', {
                class: 'form-control latest-invoice-id',
                type: 'hidden',
                value: data.latestInvoiceId
            });

            var $idLabel = $('<label/>', {
                class: 'control-label id-label force-text-color-black force-text-normal-weight',
                text: data.id
            });

            var $invoiceLink = $('<label/>', {
                class: 'control-label id-label force-text-color-black force-text-normal-weight',
                html: data.latestInvoiceNumber ? '<a href="request_port.php?module=OrderAdmin&action=showPdf&type=invoice' + ('&invoice_number=' + data.latestInvoiceNumber + '&order_id=' + data.id + '" target="_blank">') + (data.latestInvoiceNumber + '</a>') : '-'
            });

            var $emailInput = $('<input/>', {
                class: 'form-control email-input',
                type: 'text',
                value: data.customerEmail
            });

            $idLabel.appendTo($idColumn);
            $invoiceLink.appendTo($invoiceColumn);
            $emailInput.appendTo($emailColumn);

            $row.append([$idColumn, $invoiceColumn, $emailColumn, $latestInvoiceIdInput]);
            $row.data('order', data);

            return $row;
        };

        var selectedInvoice = [];

        event.preventDefault();

        $this.find('tbody input:checkbox:checked').each(function () {
            var rowData = $(this).parents('tr').data();
            selectedInvoice.push(rowData);
        });

        if (selectedInvoice.length) {
            $mailList.empty();
            selectedInvoice.forEach(function (order) {
                return $mailList.append(generateMailRowMarkup(order));
            });
            $modal.modal('show');
        }
    }

    /**
     * Collects the IDs of the selected orders and returns them as an array.
     *
     * @param {jQuery} $target The triggering target
     *
     * @return {Number[]} array of order IDs
     */
    function _getSelectedOrders($target) {
        var selectedOrders = [];

        if ($target.parents('.bulk-action').length > 0) {
            // Fetch the selected order IDs.
            $this.find('tbody input:checkbox:checked').each(function () {
                selectedOrders.push($(this).parents('tr').data('id'));
            });
        } else {
            var rowId = $target.parents('tr').data('id');

            if (!rowId) {
                return; // No order ID was found.
            }

            selectedOrders.push(rowId);
        }

        return selectedOrders;
    }

    /**
     * On Email Invoice Click
     *
     * Display the email-invoice modal.
     */
    function _onEmailInvoiceClick() {
        var $modal = $('.email-invoice.modal');
        var rowData = $(this).parents('tr').data();
        var url = jse.core.config.get('appUrl') + '/admin/admin.php';
        var data = {
            id: rowData.id,
            do: 'OrdersModalsAjax/GetEmailInvoiceSubject',
            pageToken: jse.core.config.get('pageToken')
        };
        var invoiceNumbersHtml = '';

        $modal.find('.customer-info').text('"' + rowData.customerName + '"');
        $modal.find('.email-address').val(rowData.customerEmail);

        $modal.data('orderId', rowData.id).modal('show');

        $.ajax({ url: url, data: data, dataType: 'json' }).done(function (response) {
            $modal.attr('data-gx-widget', 'single_checkbox');

            $modal.find('.subject').val(response.subject);
            if (!response.invoiceIdExists) {
                $modal.find('.invoice-num-info').addClass('hidden');
                $modal.find('.no-invoice').removeClass('hidden');
            } else {
                $modal.find('.invoice-num-info').removeClass('hidden');
                $modal.find('.no-invoice').addClass('hidden');
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

            $modal.find('.invoice-numbers-checkbox').on('change', _onChangeEmailInvoiceCheckbox);

            gx.widgets.init($modal);
        });
    }

    /**
     * On Email Invoice Checkbox Change
     *
     * Disable send button if all invoice number checkboxes are unchecked. Otherwise enable the send button again.
     */
    function _onChangeEmailInvoiceCheckbox() {
        var $modal = $('.email-invoice.modal');

        if ($modal.find('.invoice-numbers-checkbox').length > 0) {
            if ($modal.find('.invoice-numbers-checkbox:checked').length > 0) {
                $modal.find('.send').prop('disabled', false);
            } else {
                $modal.find('.send').prop('disabled', true);
            }
        } else {
            $modal.find('.send').prop('disabled', false);
        }
    }

    /**
     * On Email Order Click
     *
     * Display the email-order modal.
     *
     * @param {jQuery.Event} event
     */
    function _onEmailOrderClick(event) {
        var $modal = $('.email-order.modal');
        var rowData = $(this).parents('tr').data();
        var dateFormat = jse.core.config.get('languageCode') === 'de' ? 'DD.MM.YY' : 'MM/DD/YY';

        $modal.find('.customer-info').text('"' + rowData.customerName + '"');
        $modal.find('.subject').val(jse.core.lang.translate('ORDER_SUBJECT', 'gm_order_menu') + rowData.id + jse.core.lang.translate('ORDER_SUBJECT_FROM', 'gm_order_menu') + moment(rowData.purchaseDate.date).format(dateFormat));
        $modal.find('.email-address').val(rowData.customerEmail);

        $modal.data('orderId', rowData.id).modal('show');
    }

    /**
     * On Change Order Status Click
     *
     * Display the change order status modal.
     *
     * @param {jQuery.Event} event
     */
    function _onChangeOrderStatusClick(event) {
        if ($(event.target).hasClass('order-status')) {
            event.stopPropagation();
        }

        var $modal = $('.status.modal');
        var rowData = $(this).parents('tr').data();
        var selectedOrders = _getSelectedOrders($(this));

        $modal.find('#status-dropdown').val(rowData ? rowData.statusId : '');

        $modal.find('#comment').val('');
        $modal.find('#notify-customer, #send-parcel-tracking-code, #send-comment').prop('checked', false).parents('.single-checkbox').removeClass('checked');

        // Show the order change status modal.
        $modal.find('.selected-orders').text(selectedOrders.join(', '));
        $modal.modal('show');
    }

    /**
     * On Add Tracking Number Click
     *
     * @param {jQuery.Event} event
     */
    function _onAddTrackingNumberClick(event) {
        var $modal = $('.add-tracking-number.modal');
        var rowData = $(event.target).parents('tr').data();

        $modal.data('orderId', rowData.id);
        $modal.modal('show');
    }

    /**
     * Opens the gm_pdf_order.php in a new tab with invoices as type $_GET argument.
     *
     * The order ids are passed as a serialized array to the oID $_GET argument.
     */
    function _onBulkDownloadInvoiceClick() {
        var orderIds = [];
        var maxAmountInvoicesBulkPdf = data.maxAmountInvoicesBulkPdf;

        $this.find('tbody input:checkbox:checked').each(function () {
            orderIds.push($(this).parents('tr').data('id'));
        });

        if (orderIds.length > maxAmountInvoicesBulkPdf) {
            var $modal = $('.bulk-error.modal');
            $modal.modal('show');

            var $invoiceMessageContainer = $modal.find('.invoices-message');
            $invoiceMessageContainer.removeClass('hidden');
            $modal.on('hide.bs.modal', function () {
                return $invoiceMessageContainer.addClass('hidden');
            });

            return;
        }

        _createBulkPdf(orderIds, 'invoice');
    }

    /**
     * Opens the gm_pdf_order.php in a new tab with packing slip as type $_GET argument.
     *
     * The order ids are passed as a serialized array to the oID $_GET argument.
     */
    function _onBulkDownloadPackingSlipClick() {
        var orderIds = [];
        var maxAmountPackingSlipsBulkPdf = data.maxAmountPackingSlipsBulkPdf;
        var $modal = void 0;
        var $packingSlipsMessageContainer = void 0;

        $this.find('tbody input:checkbox:checked').each(function () {
            orderIds.push($(this).parents('tr').data('id'));
        });

        if (orderIds.length > maxAmountPackingSlipsBulkPdf) {
            $modal = $('.bulk-error.modal');
            $modal.modal('show');
            $packingSlipsMessageContainer = $modal.find('.packing-slips-message');

            $packingSlipsMessageContainer.removeClass('hidden');

            $modal.on('hide.bs.modal', function () {
                $packingSlipsMessageContainer.addClass('hidden');
            });

            return;
        }

        _createBulkPdf(orderIds, 'packingslip');
    }

    /**
     * Creates a bulk pdf with invoices or packing slips information.
     *
     * This method will check if all the selected orders have a document and open a concatenated PDF file. If there
     * are orders that do not have any document then a modal will be shown, prompting the user to create the missing
     * documents or continue without them.
     *
     * @param {Number[]} orderIds Provide the selected order IDs.
     * @param {String} type Provide the bulk PDF type "invoice" or "packingslip".
     */
    function _createBulkPdf(orderIds, type) {
        if (type !== 'invoice' && type !== 'packingslip') {
            throw new Error('Invalid type provided: ' + type);
        }

        var url = jse.core.config.get('appUrl') + '/admin/admin.php';
        var data = {
            do: 'OrdersOverviewAjax/GetOrdersWithoutDocuments',
            pageToken: jse.core.config.get('pageToken'),
            type: type,
            orderIds: orderIds
        };

        $.getJSON(url, data).done(function (orderIdsWithoutDocument) {
            if (orderIdsWithoutDocument.exception) {
                var title = jse.core.lang.translate('error', 'messages');
                var message = jse.core.lang.translate('GET_ORDERS_WITHOUT_DOCUMENT_ERROR', 'admin_orders');
                jse.libs.modal.showMessage(title, message);
                return;
            }

            if (!orderIdsWithoutDocument.length) {
                _openBulkPdfUrl(orderIds, type); // All the selected order have documents.
                return;
            }

            // Some orders do not have documents, display the confirmation modal.
            var $modal = $('.modal.create-missing-documents');
            $modal.find('.order-ids-list').text(orderIdsWithoutDocument.join(', '));
            $modal.data({
                orderIds: orderIds,
                orderIdsWithoutDocument: orderIdsWithoutDocument,
                type: type
            }).modal('show');
        }).fail(function (jqxhr, textStatus, errorThrown) {
            var title = jse.core.lang.translate('error', 'messages');
            var message = jse.core.lang.translate('GET_ORDERS_WITHOUT_DOCUMENT_ERROR', 'admin_orders');
            jse.libs.modal.showMessage(title, message);
        });
    }

    /**
     * Create Missing Documents Proceed Handler
     *
     * This handler will be executed whenever the user proceeds through the "create-missing-documents" modal. It will
     * be resolved even if the user does not select the checkbox "create-missing-documents".
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {Number[]} orderIds The selected orders to be included in the PDF.
     * @param {String} type Whether 'invoice' or 'packingslip'.
     * @param {Object} downloadPdfWindow Provide a window handle for bypassing browser's popup blocking.
     */
    function _onCreateMissingDocumentsProceed(event, orderIds, type, downloadPdfWindow) {
        _openBulkPdfUrl(orderIds, type, downloadPdfWindow);
    }

    /**
     * On Single Checkbox Ready
     *
     * This callback will use the event.data.orderIds to set the checked checkboxes after a table re-render.
     *
     * @param {jQuery.Event} event
     */
    function _onSingleCheckboxReady(event) {
        event.data.orderIds.forEach(function (id) {
            $this.find('tr#' + id + ' input:checkbox').single_checkbox('checked', true).trigger('change');
        });

        // Bulk action button should't be disabled after a datatable reload.
        if ($('tr input:checkbox:checked').length) {
            $('.bulk-action').find('button').removeClass('disabled');
        }
    }

    /**
     * Opens the URL which provides the bulk PDF for download.
     *
     * @param {Number[]} orderIds The orders to be used for the concatenated document.
     * @param {String} type Whether 'invoice' or 'packingslip'.
     */
    function _openBulkPdfUrl(orderIds, type) {
        var parameters = {
            do: 'OrdersModalsAjax/BulkPdf' + (type === 'invoice' ? 'Invoices' : 'PackingSlips'),
            pageToken: jse.core.config.get('pageToken'),
            o: orderIds
        };

        var url = jse.core.config.get('appUrl') + '/admin/admin.php?' + $.param(parameters);

        window.open(url, '_parent');

        // Keep checkboxes checked after a datatable reload.
        $this.DataTable().ajax.reload(function () {
            $this.off('single_checkbox:ready', _onSingleCheckboxReady).on('single_checkbox:ready', { orderIds: orderIds }, _onSingleCheckboxReady);
        });
        $this.orders_overview_filter('reload');
    }

    /**
     * On Packing Slip Click
     */
    function _onShowPackingSlipClick() {
        // Message modal data.
        var title = jse.core.lang.translate('TITLE_SHOW_PACKINGSLIP', 'orders');
        var message = jse.core.lang.translate('NO_PACKINGSLIP_AVAILABLE', 'orders');

        // Request data.
        var rowData = $(this).parents('tr').data();
        var url = jse.core.config.get('appUrl') + '/admin/admin.php';

        // Request parameters.
        var data = {
            id: rowData.id,
            do: 'OrdersOverviewAjax/GetLatestPackingSlip',
            pageToken: jse.core.config.get('pageToken')
        };

        // Directly open a new tab (popup blocker workaround)
        var newTab = window.open('about:blank');

        $.ajax({ dataType: 'json', url: url, data: data }).done(function (response) {
            if (response.length) {
                // Get the file name from the response.
                var filename = response[0].file;

                // Packing slip link parameters.
                var parameters = {
                    module: 'OrderAdmin',
                    action: 'showPdf',
                    type: 'packingslip',
                    file: filename
                };

                // Open package slip.
                newTab.location = jse.core.config.get('appUrl') + '/admin/request_port.php?' + $.param(parameters);
            } else {
                // No packing slip found
                newTab.close();
                jse.libs.modal.showMessage(title, message);
            }
        });
    }

    /**
     * On Invoice Create Click
     */
    function _onCreateInvoiceClick() {
        var link = $(this).attr('href');
        var $loadingSpinner = jse.libs.loading_spinner.show($this);
        var pageToken = jse.core.config.get('pageToken');
        var orderId = $(this).parents('tr').data().id;
        var url = jse.core.config.get('appUrl') + ('/admin/admin.php?do=OrdersModalsAjax/GetInvoiceCount&pageToken=' + pageToken + '&orderId=' + orderId);

        // Directly open a new tab (popup blocker workaround)
        var newTab = window.open('about:blank');

        function createInvoice() {
            newTab.location = link;
            $this.DataTable().ajax.reload(null, false);
        }

        function addInvoice() {
            window.open(link, '_blank');
            $this.DataTable().ajax.reload(null, false);
        }

        function onRequestSuccess(response) {
            var modalTitle = jse.core.lang.translate('TITLE_CREATE_INVOICE', 'orders');
            var modalMessage = jse.core.lang.translate('TEXT_CREATE_INVOICE_CONFIRMATION', 'orders');
            var modalButtons = [{
                title: jse.core.lang.translate('yes', 'buttons'),
                callback: function callback(event) {
                    closeModal(event);
                    addInvoice();
                }
            }, {
                title: jse.core.lang.translate('no', 'buttons'),
                callback: closeModal
            }];

            function closeModal(event) {
                $(event.target).parents('.modal').modal('hide');
            }

            jse.libs.loading_spinner.hide($loadingSpinner);

            if (!response.count) {
                createInvoice();
            } else {
                newTab.close();
                jse.libs.modal.showMessage(modalTitle, modalMessage, modalButtons);
            }
        }

        function onRequestFailure() {
            jse.libs.loading_spinner.hide($loadingSpinner);
            createInvoice();
        }

        jse.libs.xhr.get({ url: url }).done(onRequestSuccess).fail(onRequestFailure);
    }

    /**
     * On Invoice Link Click
     *
     * The script that generates the PDFs is changing the status of an order to "invoice-created". Thus the
     * table data need to be redrawn and the filter options to be updated.
     */
    function _onShowInvoiceClick() {
        // Message modal data.
        var title = jse.core.lang.translate('TITLE_SHOW_INVOICE', 'orders');
        var message = jse.core.lang.translate('NO_INVOICE_AVAILABLE', 'orders');

        // Request data.
        var rowData = $(this).parents('tr').data();
        var url = jse.core.config.get('appUrl') + '/admin/admin.php';

        // Request parameters.
        var data = {
            id: rowData.id,
            do: 'OrdersOverviewAjax/GetInvoices',
            pageToken: jse.core.config.get('pageToken')
        };

        // Directly open a new tab (popup blocker workaround)
        var newTab = window.open('about:blank');

        $.ajax({ dataType: 'json', url: url, data: data }).done(function (response) {
            if (response.length) {
                // Get the file name from object with the highest ID within response array.
                var _response$ = response[0],
                    invoiceNumber = _response$.invoiceNumber,
                    orderId = _response$.orderId;

                // Invoice link parameters.

                var parameters = {
                    module: 'OrderAdmin',
                    action: 'showPdf',
                    type: 'invoice',
                    invoice_number: invoiceNumber,
                    order_id: orderId
                };

                // Open invoice
                newTab.location = jse.core.config.get('appUrl') + '/admin/request_port.php?' + $.param(parameters);
            } else {
                // No invoice found
                newTab.close();
                jse.libs.modal.showMessage(title, message);
            }
        });
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Bind table row actions.
        $this.on('click', 'tbody tr', _onTableRowClick).on('change', '.bulk-selection', _onBulkSelectionChange).on('change', 'input:checkbox', _onTableRowCheckboxChange).on('click', '.show-invoice', _onShowInvoiceClick).on('click', '.show-packing-slip', _onShowPackingSlipClick).on('click', '.create-invoice', _onCreateInvoiceClick).on('click', '.email-invoice', _onEmailInvoiceClick).on('click', '.email-order', _onEmailOrderClick).on('click', '.order-status.label', _onChangeOrderStatusClick).on('click', '.add-tracking-number', _onAddTrackingNumberClick);

        // Bind table row and bulk actions.
        $this.parents('.orders').on('click', '.btn-group .change-status', _onChangeOrderStatusClick).on('click', '.btn-group .cancel', _onCancelOrderClick).on('click', '.btn-group .bulk-email-order', _onBulkEmailOrderClick).on('click', '.btn-group .bulk-email-invoice', _onBulkEmailInvoiceClick).on('click', '.btn-group .bulk-download-invoice', _onBulkDownloadInvoiceClick).on('click', '.btn-group .bulk-download-packing-slip', _onBulkDownloadPackingSlipClick);

        // Bind custom events.
        $(document).on('create_missing_documents:proceed', '.modal.create-missing-documents', _onCreateMissingDocumentsProceed);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vdmVydmlldy9ldmVudHMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJfb25CdWxrU2VsZWN0aW9uQ2hhbmdlIiwiZXZlbnQiLCJwcm9wYWdhdGUiLCJmaW5kIiwic2luZ2xlX2NoZWNrYm94IiwicHJvcCIsInRyaWdnZXIiLCJfb25UYWJsZVJvd0NsaWNrIiwidGFyZ2V0IiwiaXMiLCJfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlIiwibGVuZ3RoIiwicGFyZW50cyIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJfb25DYW5jZWxPcmRlckNsaWNrIiwicHJldmVudERlZmF1bHQiLCJzZWxlY3RlZE9yZGVycyIsIl9nZXRTZWxlY3RlZE9yZGVycyIsInRleHQiLCJqb2luIiwibW9kYWwiLCJfb25CdWxrRW1haWxPcmRlckNsaWNrIiwiJG1vZGFsIiwiJG1haWxMaXN0IiwiZ2VuZXJhdGVNYWlsUm93TWFya3VwIiwiJHJvdyIsImNsYXNzIiwiJGlkQ29sdW1uIiwiJGVtYWlsQ29sdW1uIiwiJGlkTGFiZWwiLCJpZCIsIiRlbWFpbElucHV0IiwidHlwZSIsInZhbHVlIiwiY3VzdG9tZXJFbWFpbCIsImFwcGVuZFRvIiwiYXBwZW5kIiwiZWFjaCIsInJvd0RhdGEiLCJwdXNoIiwiZW1wdHkiLCJmb3JFYWNoIiwib3JkZXIiLCJfb25CdWxrRW1haWxJbnZvaWNlQ2xpY2siLCIkaW52b2ljZUNvbHVtbiIsIiRsYXRlc3RJbnZvaWNlSWRJbnB1dCIsImxhdGVzdEludm9pY2VJZCIsIiRpbnZvaWNlTGluayIsImh0bWwiLCJsYXRlc3RJbnZvaWNlTnVtYmVyIiwic2VsZWN0ZWRJbnZvaWNlIiwiJHRhcmdldCIsInJvd0lkIiwiX29uRW1haWxJbnZvaWNlQ2xpY2siLCJ1cmwiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiZG8iLCJwYWdlVG9rZW4iLCJpbnZvaWNlTnVtYmVyc0h0bWwiLCJjdXN0b21lck5hbWUiLCJ2YWwiLCJhamF4IiwiZGF0YVR5cGUiLCJkb25lIiwicmVzcG9uc2UiLCJhdHRyIiwic3ViamVjdCIsImludm9pY2VJZEV4aXN0cyIsIk9iamVjdCIsImtleXMiLCJpbnZvaWNlTnVtYmVycyIsImludm9pY2VJZCIsIm9uIiwiX29uQ2hhbmdlRW1haWxJbnZvaWNlQ2hlY2tib3giLCJ3aWRnZXRzIiwiaW5pdCIsIl9vbkVtYWlsT3JkZXJDbGljayIsImRhdGVGb3JtYXQiLCJsYW5nIiwidHJhbnNsYXRlIiwibW9tZW50IiwicHVyY2hhc2VEYXRlIiwiZGF0ZSIsImZvcm1hdCIsIl9vbkNoYW5nZU9yZGVyU3RhdHVzQ2xpY2siLCJoYXNDbGFzcyIsInN0b3BQcm9wYWdhdGlvbiIsInN0YXR1c0lkIiwiX29uQWRkVHJhY2tpbmdOdW1iZXJDbGljayIsIl9vbkJ1bGtEb3dubG9hZEludm9pY2VDbGljayIsIm9yZGVySWRzIiwibWF4QW1vdW50SW52b2ljZXNCdWxrUGRmIiwiJGludm9pY2VNZXNzYWdlQ29udGFpbmVyIiwiX2NyZWF0ZUJ1bGtQZGYiLCJfb25CdWxrRG93bmxvYWRQYWNraW5nU2xpcENsaWNrIiwibWF4QW1vdW50UGFja2luZ1NsaXBzQnVsa1BkZiIsIiRwYWNraW5nU2xpcHNNZXNzYWdlQ29udGFpbmVyIiwiRXJyb3IiLCJnZXRKU09OIiwib3JkZXJJZHNXaXRob3V0RG9jdW1lbnQiLCJleGNlcHRpb24iLCJ0aXRsZSIsIm1lc3NhZ2UiLCJsaWJzIiwic2hvd01lc3NhZ2UiLCJfb3BlbkJ1bGtQZGZVcmwiLCJmYWlsIiwianF4aHIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJfb25DcmVhdGVNaXNzaW5nRG9jdW1lbnRzUHJvY2VlZCIsImRvd25sb2FkUGRmV2luZG93IiwiX29uU2luZ2xlQ2hlY2tib3hSZWFkeSIsInBhcmFtZXRlcnMiLCJvIiwicGFyYW0iLCJ3aW5kb3ciLCJvcGVuIiwiRGF0YVRhYmxlIiwicmVsb2FkIiwib2ZmIiwib3JkZXJzX292ZXJ2aWV3X2ZpbHRlciIsIl9vblNob3dQYWNraW5nU2xpcENsaWNrIiwibmV3VGFiIiwiZmlsZW5hbWUiLCJmaWxlIiwiYWN0aW9uIiwibG9jYXRpb24iLCJjbG9zZSIsIl9vbkNyZWF0ZUludm9pY2VDbGljayIsImxpbmsiLCIkbG9hZGluZ1NwaW5uZXIiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93Iiwib3JkZXJJZCIsImNyZWF0ZUludm9pY2UiLCJhZGRJbnZvaWNlIiwib25SZXF1ZXN0U3VjY2VzcyIsIm1vZGFsVGl0bGUiLCJtb2RhbE1lc3NhZ2UiLCJtb2RhbEJ1dHRvbnMiLCJjYWxsYmFjayIsImNsb3NlTW9kYWwiLCJoaWRlIiwiY291bnQiLCJvblJlcXVlc3RGYWlsdXJlIiwieGhyIiwiX29uU2hvd0ludm9pY2VDbGljayIsImludm9pY2VOdW1iZXIiLCJpbnZvaWNlX251bWJlciIsIm9yZGVyX2lkIiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksUUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgscUNBRUksaUJBRkosRUFHSSxPQUhKLEVBSUksS0FKSixDQUhKLEVBVUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1MLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1BLGFBQVNNLHNCQUFULENBQWdDQyxLQUFoQyxFQUF5RDtBQUFBLFlBQWxCQyxTQUFrQix1RUFBTixJQUFNOztBQUNyRCxZQUFJQSxjQUFjLEtBQWxCLEVBQXlCO0FBQ3JCLG1CQURxQixDQUNiO0FBQ1g7O0FBRURKLGNBQU1LLElBQU4sQ0FBVyxzQkFBWCxFQUFtQ0MsZUFBbkMsQ0FBbUQsU0FBbkQsRUFBOERMLEVBQUUsSUFBRixFQUFRTSxJQUFSLENBQWEsU0FBYixDQUE5RCxFQUF1RkMsT0FBdkYsQ0FBK0YsUUFBL0Y7QUFDSDs7QUFFRDs7Ozs7OztBQU9BLGFBQVNDLGdCQUFULENBQTBCTixLQUExQixFQUFpQztBQUM3QixZQUFJLENBQUNGLEVBQUVFLE1BQU1PLE1BQVIsRUFBZ0JDLEVBQWhCLENBQW1CLElBQW5CLENBQUwsRUFBK0I7QUFDM0I7QUFDSDs7QUFFRFYsVUFBRSxJQUFGLEVBQVFJLElBQVIsQ0FBYSxnQkFBYixFQUNLRSxJQURMLENBQ1UsU0FEVixFQUNxQixDQUFDTixFQUFFLElBQUYsRUFBUUksSUFBUixDQUFhLGdCQUFiLEVBQStCRSxJQUEvQixDQUFvQyxTQUFwQyxDQUR0QixFQUVLQyxPQUZMLENBRWEsUUFGYjtBQUdIOztBQUVEOzs7OztBQUtBLGFBQVNJLHlCQUFULEdBQXFDO0FBQ2pDLFlBQUlaLE1BQU1LLElBQU4sQ0FBVyx3QkFBWCxFQUFxQ1EsTUFBckMsR0FBOEMsQ0FBbEQsRUFBcUQ7QUFDakRiLGtCQUFNYyxPQUFOLENBQWMsU0FBZCxFQUF5QlQsSUFBekIsQ0FBOEIsdUJBQTlCLEVBQXVEVSxXQUF2RCxDQUFtRSxVQUFuRTtBQUNILFNBRkQsTUFFTztBQUNIZixrQkFBTWMsT0FBTixDQUFjLFNBQWQsRUFBeUJULElBQXpCLENBQThCLHVCQUE5QixFQUF1RFcsUUFBdkQsQ0FBZ0UsVUFBaEU7QUFDSDtBQUNKOztBQUVEOzs7OztBQUtBLGFBQVNDLG1CQUFULENBQTZCZCxLQUE3QixFQUFvQztBQUNoQ0EsY0FBTWUsY0FBTjs7QUFFQSxZQUFNQyxpQkFBaUJDLG1CQUFtQm5CLEVBQUUsSUFBRixDQUFuQixDQUF2Qjs7QUFFQTtBQUNBQSxVQUFFLGdDQUFGLEVBQW9Db0IsSUFBcEMsQ0FBeUNGLGVBQWVHLElBQWYsQ0FBb0IsSUFBcEIsQ0FBekM7QUFDQXJCLFVBQUUsZUFBRixFQUFtQnNCLEtBQW5CLENBQXlCLE1BQXpCO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTQyxzQkFBVCxDQUFnQ3JCLEtBQWhDLEVBQXVDO0FBQ25DLFlBQU1zQixTQUFTeEIsRUFBRSx5QkFBRixDQUFmO0FBQ0EsWUFBTXlCLFlBQVlELE9BQU9wQixJQUFQLENBQVksYUFBWixDQUFsQjs7QUFFQSxZQUFNc0Isd0JBQXdCLFNBQXhCQSxxQkFBd0IsT0FBUTtBQUNsQyxnQkFBTUMsT0FBTzNCLEVBQUUsUUFBRixFQUFZLEVBQUM0QixPQUFPLDRCQUFSLEVBQVosQ0FBYjtBQUNBLGdCQUFNQyxZQUFZN0IsRUFBRSxRQUFGLEVBQVksRUFBQzRCLE9BQU8sVUFBUixFQUFaLENBQWxCO0FBQ0EsZ0JBQU1FLGVBQWU5QixFQUFFLFFBQUYsRUFBWSxFQUFDNEIsT0FBTyxVQUFSLEVBQVosQ0FBckI7O0FBRUEsZ0JBQU1HLFdBQVcvQixFQUFFLFVBQUYsRUFBYztBQUMzQjRCLHVCQUFPLHdFQURvQjtBQUUzQlIsc0JBQU10QixLQUFLa0M7QUFGZ0IsYUFBZCxDQUFqQjs7QUFLQSxnQkFBTUMsY0FBY2pDLEVBQUUsVUFBRixFQUFjO0FBQzlCNEIsdUJBQU8sMEJBRHVCO0FBRTlCTSxzQkFBTSxNQUZ3QjtBQUc5QkMsdUJBQU9yQyxLQUFLc0M7QUFIa0IsYUFBZCxDQUFwQjs7QUFNQUwscUJBQVNNLFFBQVQsQ0FBa0JSLFNBQWxCO0FBQ0FJLHdCQUFZSSxRQUFaLENBQXFCUCxZQUFyQjs7QUFFQUgsaUJBQUtXLE1BQUwsQ0FBWSxDQUFDVCxTQUFELEVBQVlDLFlBQVosQ0FBWjtBQUNBSCxpQkFBSzdCLElBQUwsQ0FBVSxPQUFWLEVBQW1CQSxJQUFuQjs7QUFFQSxtQkFBTzZCLElBQVA7QUFDSCxTQXZCRDs7QUF5QkEsWUFBTVQsaUJBQWlCLEVBQXZCOztBQUVBaEIsY0FBTWUsY0FBTjs7QUFFQWxCLGNBQU1LLElBQU4sQ0FBVyw4QkFBWCxFQUEyQ21DLElBQTNDLENBQWdELFlBQVk7QUFDeEQsZ0JBQU1DLFVBQVV4QyxFQUFFLElBQUYsRUFBUWEsT0FBUixDQUFnQixJQUFoQixFQUFzQmYsSUFBdEIsRUFBaEI7QUFDQW9CLDJCQUFldUIsSUFBZixDQUFvQkQsT0FBcEI7QUFDSCxTQUhEOztBQUtBLFlBQUl0QixlQUFlTixNQUFuQixFQUEyQjtBQUN2QmEsc0JBQVVpQixLQUFWO0FBQ0F4QiwyQkFBZXlCLE9BQWYsQ0FBdUI7QUFBQSx1QkFBU2xCLFVBQVVhLE1BQVYsQ0FBaUJaLHNCQUFzQmtCLEtBQXRCLENBQWpCLENBQVQ7QUFBQSxhQUF2QjtBQUNBcEIsbUJBQU9GLEtBQVAsQ0FBYSxNQUFiO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7OztBQU9BLGFBQVN1Qix3QkFBVCxDQUFrQzNDLEtBQWxDLEVBQXlDO0FBQ3JDLFlBQU1zQixTQUFTeEIsRUFBRSwyQkFBRixDQUFmO0FBQ0EsWUFBTXlCLFlBQVlELE9BQU9wQixJQUFQLENBQVksYUFBWixDQUFsQjs7QUFFQSxZQUFNc0Isd0JBQXdCLFNBQXhCQSxxQkFBd0IsT0FBUTtBQUNsQyxnQkFBTUMsT0FBTzNCLEVBQUUsUUFBRixFQUFZLEVBQUM0QixPQUFPLDRCQUFSLEVBQVosQ0FBYjtBQUNBLGdCQUFNQyxZQUFZN0IsRUFBRSxRQUFGLEVBQVksRUFBQzRCLE9BQU8sVUFBUixFQUFaLENBQWxCO0FBQ0EsZ0JBQU1rQixpQkFBaUI5QyxFQUFFLFFBQUYsRUFBWSxFQUFDNEIsT0FBTyxVQUFSLEVBQVosQ0FBdkI7QUFDQSxnQkFBTUUsZUFBZTlCLEVBQUUsUUFBRixFQUFZLEVBQUM0QixPQUFPLFVBQVIsRUFBWixDQUFyQjs7QUFFQSxnQkFBTW1CLHdCQUF3Qi9DLEVBQUUsVUFBRixFQUFjO0FBQ3hDNEIsdUJBQU8sZ0NBRGlDO0FBRXhDTSxzQkFBTSxRQUZrQztBQUd4Q0MsdUJBQU9yQyxLQUFLa0Q7QUFINEIsYUFBZCxDQUE5Qjs7QUFNQSxnQkFBTWpCLFdBQVcvQixFQUFFLFVBQUYsRUFBYztBQUMzQjRCLHVCQUFPLHdFQURvQjtBQUUzQlIsc0JBQU10QixLQUFLa0M7QUFGZ0IsYUFBZCxDQUFqQjs7QUFLQSxnQkFBTWlCLGVBQWVqRCxFQUFFLFVBQUYsRUFBYztBQUMvQjRCLHVCQUFPLHdFQUR3QjtBQUUvQnNCLHNCQUFNcEQsS0FBS3FELG1CQUFMLEdBQTJCLGtHQUNSckQsS0FBS3FELG1CQURHLGtCQUM2QnJELEtBQUtrQyxFQURsQyw0QkFFeEJsQyxLQUFLcUQsbUJBRm1CLFVBQTNCO0FBRnlCLGFBQWQsQ0FBckI7O0FBT0EsZ0JBQU1sQixjQUFjakMsRUFBRSxVQUFGLEVBQWM7QUFDOUI0Qix1QkFBTywwQkFEdUI7QUFFOUJNLHNCQUFNLE1BRndCO0FBRzlCQyx1QkFBT3JDLEtBQUtzQztBQUhrQixhQUFkLENBQXBCOztBQU1BTCxxQkFBU00sUUFBVCxDQUFrQlIsU0FBbEI7QUFDQW9CLHlCQUFhWixRQUFiLENBQXNCUyxjQUF0QjtBQUNBYix3QkFBWUksUUFBWixDQUFxQlAsWUFBckI7O0FBRUFILGlCQUFLVyxNQUFMLENBQVksQ0FBQ1QsU0FBRCxFQUFZaUIsY0FBWixFQUE0QmhCLFlBQTVCLEVBQTBDaUIscUJBQTFDLENBQVo7QUFDQXBCLGlCQUFLN0IsSUFBTCxDQUFVLE9BQVYsRUFBbUJBLElBQW5COztBQUVBLG1CQUFPNkIsSUFBUDtBQUNILFNBdENEOztBQXdDQSxZQUFNeUIsa0JBQWtCLEVBQXhCOztBQUVBbEQsY0FBTWUsY0FBTjs7QUFFQWxCLGNBQU1LLElBQU4sQ0FBVyw4QkFBWCxFQUEyQ21DLElBQTNDLENBQWdELFlBQVk7QUFDeEQsZ0JBQU1DLFVBQVV4QyxFQUFFLElBQUYsRUFBUWEsT0FBUixDQUFnQixJQUFoQixFQUFzQmYsSUFBdEIsRUFBaEI7QUFDQXNELDRCQUFnQlgsSUFBaEIsQ0FBcUJELE9BQXJCO0FBQ0gsU0FIRDs7QUFLQSxZQUFJWSxnQkFBZ0J4QyxNQUFwQixFQUE0QjtBQUN4QmEsc0JBQVVpQixLQUFWO0FBQ0FVLDRCQUFnQlQsT0FBaEIsQ0FBd0I7QUFBQSx1QkFBU2xCLFVBQVVhLE1BQVYsQ0FBaUJaLHNCQUFzQmtCLEtBQXRCLENBQWpCLENBQVQ7QUFBQSxhQUF4QjtBQUNBcEIsbUJBQU9GLEtBQVAsQ0FBYSxNQUFiO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7OztBQU9BLGFBQVNILGtCQUFULENBQTRCa0MsT0FBNUIsRUFBcUM7QUFDakMsWUFBTW5DLGlCQUFpQixFQUF2Qjs7QUFFQSxZQUFJbUMsUUFBUXhDLE9BQVIsQ0FBZ0IsY0FBaEIsRUFBZ0NELE1BQWhDLEdBQXlDLENBQTdDLEVBQWdEO0FBQzVDO0FBQ0FiLGtCQUFNSyxJQUFOLENBQVcsOEJBQVgsRUFBMkNtQyxJQUEzQyxDQUFnRCxZQUFZO0FBQ3hEckIsK0JBQWV1QixJQUFmLENBQW9CekMsRUFBRSxJQUFGLEVBQVFhLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JmLElBQXRCLENBQTJCLElBQTNCLENBQXBCO0FBQ0gsYUFGRDtBQUdILFNBTEQsTUFLTztBQUNILGdCQUFNd0QsUUFBUUQsUUFBUXhDLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JmLElBQXRCLENBQTJCLElBQTNCLENBQWQ7O0FBRUEsZ0JBQUksQ0FBQ3dELEtBQUwsRUFBWTtBQUNSLHVCQURRLENBQ0E7QUFDWDs7QUFFRHBDLDJCQUFldUIsSUFBZixDQUFvQmEsS0FBcEI7QUFDSDs7QUFFRCxlQUFPcEMsY0FBUDtBQUNIOztBQUVEOzs7OztBQUtBLGFBQVNxQyxvQkFBVCxHQUFnQztBQUM1QixZQUFNL0IsU0FBU3hCLEVBQUUsc0JBQUYsQ0FBZjtBQUNBLFlBQU13QyxVQUFVeEMsRUFBRSxJQUFGLEVBQVFhLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JmLElBQXRCLEVBQWhCO0FBQ0EsWUFBTTBELE1BQU01RCxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxrQkFBNUM7QUFDQSxZQUFNN0QsT0FBTztBQUNUa0MsZ0JBQUlRLFFBQVFSLEVBREg7QUFFVDRCLGdCQUFJLHlDQUZLO0FBR1RDLHVCQUFXakUsSUFBSTZELElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsV0FBcEI7QUFIRixTQUFiO0FBS0EsWUFBSUcscUJBQXFCLEVBQXpCOztBQUVBdEMsZUFBT3BCLElBQVAsQ0FBWSxnQkFBWixFQUE4QmdCLElBQTlCLE9BQXVDb0IsUUFBUXVCLFlBQS9DO0FBQ0F2QyxlQUFPcEIsSUFBUCxDQUFZLGdCQUFaLEVBQThCNEQsR0FBOUIsQ0FBa0N4QixRQUFRSixhQUExQzs7QUFFQVosZUFDSzFCLElBREwsQ0FDVSxTQURWLEVBQ3FCMEMsUUFBUVIsRUFEN0IsRUFFS1YsS0FGTCxDQUVXLE1BRlg7O0FBSUF0QixVQUFFaUUsSUFBRixDQUFPLEVBQUNULFFBQUQsRUFBTTFELFVBQU4sRUFBWW9FLFVBQVUsTUFBdEIsRUFBUCxFQUFzQ0MsSUFBdEMsQ0FBMkMsVUFBQ0MsUUFBRCxFQUFjO0FBQ3JENUMsbUJBQU82QyxJQUFQLENBQVksZ0JBQVosRUFBOEIsaUJBQTlCOztBQUVBN0MsbUJBQU9wQixJQUFQLENBQVksVUFBWixFQUF3QjRELEdBQXhCLENBQTRCSSxTQUFTRSxPQUFyQztBQUNBLGdCQUFJLENBQUNGLFNBQVNHLGVBQWQsRUFBK0I7QUFDM0IvQyx1QkFBT3BCLElBQVAsQ0FBWSxtQkFBWixFQUFpQ1csUUFBakMsQ0FBMEMsUUFBMUM7QUFDQVMsdUJBQU9wQixJQUFQLENBQVksYUFBWixFQUEyQlUsV0FBM0IsQ0FBdUMsUUFBdkM7QUFDSCxhQUhELE1BR087QUFDSFUsdUJBQU9wQixJQUFQLENBQVksbUJBQVosRUFBaUNVLFdBQWpDLENBQTZDLFFBQTdDO0FBQ0FVLHVCQUFPcEIsSUFBUCxDQUFZLGFBQVosRUFBMkJXLFFBQTNCLENBQW9DLFFBQXBDO0FBQ0g7O0FBRUQsZ0JBQUl5RCxPQUFPQyxJQUFQLENBQVlMLFNBQVNNLGNBQXJCLEVBQXFDOUQsTUFBckMsSUFBK0MsQ0FBbkQsRUFBc0Q7QUFDbERZLHVCQUFPcEIsSUFBUCxDQUFZLGtCQUFaLEVBQWdDVyxRQUFoQyxDQUF5QyxRQUF6QztBQUNILGFBRkQsTUFFTztBQUNIUyx1QkFBT3BCLElBQVAsQ0FBWSxrQkFBWixFQUFnQ1UsV0FBaEMsQ0FBNEMsUUFBNUM7QUFDSDs7QUFFRCxpQkFBSyxJQUFJNkQsU0FBVCxJQUFzQlAsU0FBU00sY0FBL0IsRUFBK0M7QUFDM0NaLHNDQUNJLDJEQUEyRGEsU0FBM0QsR0FDRSwwREFERixHQUVFUCxTQUFTTSxjQUFULENBQXdCQyxTQUF4QixDQUZGLEdBRXVDLE1BSDNDO0FBSUg7O0FBRURuRCxtQkFBT3BCLElBQVAsQ0FBWSw2QkFBWixFQUEyQzhDLElBQTNDLENBQWdEWSxrQkFBaEQ7O0FBRUF0QyxtQkFBT3BCLElBQVAsQ0FBWSwyQkFBWixFQUF5Q3dFLEVBQXpDLENBQTRDLFFBQTVDLEVBQXNEQyw2QkFBdEQ7O0FBRUFwRixlQUFHcUYsT0FBSCxDQUFXQyxJQUFYLENBQWdCdkQsTUFBaEI7QUFDSCxTQTlCRDtBQStCSDs7QUFFRDs7Ozs7QUFLQSxhQUFTcUQsNkJBQVQsR0FBeUM7QUFDckMsWUFBTXJELFNBQVN4QixFQUFFLHNCQUFGLENBQWY7O0FBRUEsWUFBSXdCLE9BQU9wQixJQUFQLENBQVksMkJBQVosRUFBeUNRLE1BQXpDLEdBQWtELENBQXRELEVBQXlEO0FBQ3JELGdCQUFJWSxPQUFPcEIsSUFBUCxDQUFZLG1DQUFaLEVBQWlEUSxNQUFqRCxHQUEwRCxDQUE5RCxFQUFpRTtBQUM3RFksdUJBQU9wQixJQUFQLENBQVksT0FBWixFQUFxQkUsSUFBckIsQ0FBMEIsVUFBMUIsRUFBc0MsS0FBdEM7QUFDSCxhQUZELE1BRU87QUFDSGtCLHVCQUFPcEIsSUFBUCxDQUFZLE9BQVosRUFBcUJFLElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLElBQXRDO0FBQ0g7QUFDSixTQU5ELE1BTU87QUFDSGtCLG1CQUFPcEIsSUFBUCxDQUFZLE9BQVosRUFBcUJFLElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLEtBQXRDO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7OztBQU9BLGFBQVMwRSxrQkFBVCxDQUE0QjlFLEtBQTVCLEVBQW1DO0FBQy9CLFlBQU1zQixTQUFTeEIsRUFBRSxvQkFBRixDQUFmO0FBQ0EsWUFBTXdDLFVBQVV4QyxFQUFFLElBQUYsRUFBUWEsT0FBUixDQUFnQixJQUFoQixFQUFzQmYsSUFBdEIsRUFBaEI7QUFDQSxZQUFNbUYsYUFBYXJGLElBQUk2RCxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLGNBQXBCLE1BQXdDLElBQXhDLEdBQStDLFVBQS9DLEdBQTRELFVBQS9FOztBQUVBbkMsZUFBT3BCLElBQVAsQ0FBWSxnQkFBWixFQUE4QmdCLElBQTlCLE9BQXVDb0IsUUFBUXVCLFlBQS9DO0FBQ0F2QyxlQUFPcEIsSUFBUCxDQUFZLFVBQVosRUFBd0I0RCxHQUF4QixDQUE0QnBFLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0IsZUFBeEIsRUFBeUMsZUFBekMsSUFBNEQzQyxRQUFRUixFQUFwRSxHQUN0QnBDLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0Isb0JBQXhCLEVBQThDLGVBQTlDLENBRHNCLEdBRXRCQyxPQUFPNUMsUUFBUTZDLFlBQVIsQ0FBcUJDLElBQTVCLEVBQWtDQyxNQUFsQyxDQUF5Q04sVUFBekMsQ0FGTjtBQUdBekQsZUFBT3BCLElBQVAsQ0FBWSxnQkFBWixFQUE4QjRELEdBQTlCLENBQWtDeEIsUUFBUUosYUFBMUM7O0FBRUFaLGVBQ0sxQixJQURMLENBQ1UsU0FEVixFQUNxQjBDLFFBQVFSLEVBRDdCLEVBRUtWLEtBRkwsQ0FFVyxNQUZYO0FBR0g7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTa0UseUJBQVQsQ0FBbUN0RixLQUFuQyxFQUEwQztBQUN0QyxZQUFJRixFQUFFRSxNQUFNTyxNQUFSLEVBQWdCZ0YsUUFBaEIsQ0FBeUIsY0FBekIsQ0FBSixFQUE4QztBQUMxQ3ZGLGtCQUFNd0YsZUFBTjtBQUNIOztBQUVELFlBQU1sRSxTQUFTeEIsRUFBRSxlQUFGLENBQWY7QUFDQSxZQUFNd0MsVUFBVXhDLEVBQUUsSUFBRixFQUFRYSxPQUFSLENBQWdCLElBQWhCLEVBQXNCZixJQUF0QixFQUFoQjtBQUNBLFlBQU1vQixpQkFBaUJDLG1CQUFtQm5CLEVBQUUsSUFBRixDQUFuQixDQUF2Qjs7QUFFQXdCLGVBQU9wQixJQUFQLENBQVksa0JBQVosRUFBZ0M0RCxHQUFoQyxDQUFxQ3hCLE9BQUQsR0FBWUEsUUFBUW1ELFFBQXBCLEdBQStCLEVBQW5FOztBQUVBbkUsZUFBT3BCLElBQVAsQ0FBWSxVQUFaLEVBQXdCNEQsR0FBeEIsQ0FBNEIsRUFBNUI7QUFDQXhDLGVBQU9wQixJQUFQLENBQVksNkRBQVosRUFDS0UsSUFETCxDQUNVLFNBRFYsRUFDcUIsS0FEckIsRUFFS08sT0FGTCxDQUVhLGtCQUZiLEVBR0tDLFdBSEwsQ0FHaUIsU0FIakI7O0FBS0E7QUFDQVUsZUFBT3BCLElBQVAsQ0FBWSxrQkFBWixFQUFnQ2dCLElBQWhDLENBQXFDRixlQUFlRyxJQUFmLENBQW9CLElBQXBCLENBQXJDO0FBQ0FHLGVBQU9GLEtBQVAsQ0FBYSxNQUFiO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU3NFLHlCQUFULENBQW1DMUYsS0FBbkMsRUFBMEM7QUFDdEMsWUFBTXNCLFNBQVN4QixFQUFFLDRCQUFGLENBQWY7QUFDQSxZQUFNd0MsVUFBVXhDLEVBQUVFLE1BQU1PLE1BQVIsRUFBZ0JJLE9BQWhCLENBQXdCLElBQXhCLEVBQThCZixJQUE5QixFQUFoQjs7QUFFQTBCLGVBQU8xQixJQUFQLENBQVksU0FBWixFQUF1QjBDLFFBQVFSLEVBQS9CO0FBQ0FSLGVBQU9GLEtBQVAsQ0FBYSxNQUFiO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU3VFLDJCQUFULEdBQXVDO0FBQ25DLFlBQU1DLFdBQVcsRUFBakI7QUFDQSxZQUFNQywyQkFBMkJqRyxLQUFLaUcsd0JBQXRDOztBQUVBaEcsY0FBTUssSUFBTixDQUFXLDhCQUFYLEVBQTJDbUMsSUFBM0MsQ0FBZ0QsWUFBWTtBQUN4RHVELHFCQUFTckQsSUFBVCxDQUFjekMsRUFBRSxJQUFGLEVBQVFhLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JmLElBQXRCLENBQTJCLElBQTNCLENBQWQ7QUFDSCxTQUZEOztBQUlBLFlBQUlnRyxTQUFTbEYsTUFBVCxHQUFrQm1GLHdCQUF0QixFQUFnRDtBQUM1QyxnQkFBTXZFLFNBQVN4QixFQUFFLG1CQUFGLENBQWY7QUFDQXdCLG1CQUFPRixLQUFQLENBQWEsTUFBYjs7QUFFQSxnQkFBTTBFLDJCQUEyQnhFLE9BQU9wQixJQUFQLENBQVksbUJBQVosQ0FBakM7QUFDQTRGLHFDQUF5QmxGLFdBQXpCLENBQXFDLFFBQXJDO0FBQ0FVLG1CQUFPb0QsRUFBUCxDQUFVLGVBQVYsRUFBMkI7QUFBQSx1QkFBTW9CLHlCQUF5QmpGLFFBQXpCLENBQWtDLFFBQWxDLENBQU47QUFBQSxhQUEzQjs7QUFFQTtBQUNIOztBQUVEa0YsdUJBQWVILFFBQWYsRUFBeUIsU0FBekI7QUFDSDs7QUFHRDs7Ozs7QUFLQSxhQUFTSSwrQkFBVCxHQUEyQztBQUN2QyxZQUFNSixXQUFXLEVBQWpCO0FBQ0EsWUFBTUssK0JBQStCckcsS0FBS3FHLDRCQUExQztBQUNBLFlBQUkzRSxlQUFKO0FBQ0EsWUFBSTRFLHNDQUFKOztBQUVBckcsY0FBTUssSUFBTixDQUFXLDhCQUFYLEVBQTJDbUMsSUFBM0MsQ0FBZ0QsWUFBWTtBQUN4RHVELHFCQUFTckQsSUFBVCxDQUFjekMsRUFBRSxJQUFGLEVBQVFhLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JmLElBQXRCLENBQTJCLElBQTNCLENBQWQ7QUFDSCxTQUZEOztBQUlBLFlBQUlnRyxTQUFTbEYsTUFBVCxHQUFrQnVGLDRCQUF0QixFQUFvRDtBQUNoRDNFLHFCQUFTeEIsRUFBRSxtQkFBRixDQUFUO0FBQ0F3QixtQkFBT0YsS0FBUCxDQUFhLE1BQWI7QUFDQThFLDRDQUFnQzVFLE9BQU9wQixJQUFQLENBQVksd0JBQVosQ0FBaEM7O0FBRUFnRywwQ0FBOEJ0RixXQUE5QixDQUEwQyxRQUExQzs7QUFFQVUsbUJBQU9vRCxFQUFQLENBQVUsZUFBVixFQUEyQixZQUFZO0FBQ25Dd0IsOENBQThCckYsUUFBOUIsQ0FBdUMsUUFBdkM7QUFDSCxhQUZEOztBQUlBO0FBQ0g7O0FBRURrRix1QkFBZUgsUUFBZixFQUF5QixhQUF6QjtBQUNIOztBQUVEOzs7Ozs7Ozs7O0FBVUEsYUFBU0csY0FBVCxDQUF3QkgsUUFBeEIsRUFBa0M1RCxJQUFsQyxFQUF3QztBQUNwQyxZQUFJQSxTQUFTLFNBQVQsSUFBc0JBLFNBQVMsYUFBbkMsRUFBa0Q7QUFDOUMsa0JBQU0sSUFBSW1FLEtBQUosQ0FBVSw0QkFBNEJuRSxJQUF0QyxDQUFOO0FBQ0g7O0FBRUQsWUFBTXNCLE1BQU01RCxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxrQkFBNUM7QUFDQSxZQUFNN0QsT0FBTztBQUNUOEQsZ0JBQUksOENBREs7QUFFVEMsdUJBQVdqRSxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQixDQUZGO0FBR1R6QixzQkFIUztBQUlUNEQ7QUFKUyxTQUFiOztBQU9BOUYsVUFBRXNHLE9BQUYsQ0FBVTlDLEdBQVYsRUFBZTFELElBQWYsRUFDS3FFLElBREwsQ0FDVSxtQ0FBMkI7QUFDN0IsZ0JBQUlvQyx3QkFBd0JDLFNBQTVCLEVBQXVDO0FBQ25DLG9CQUFNQyxRQUFRN0csSUFBSTZELElBQUosQ0FBU3lCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixPQUF4QixFQUFpQyxVQUFqQyxDQUFkO0FBQ0Esb0JBQU11QixVQUFVOUcsSUFBSTZELElBQUosQ0FBU3lCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixtQ0FBeEIsRUFBNkQsY0FBN0QsQ0FBaEI7QUFDQXZGLG9CQUFJK0csSUFBSixDQUFTckYsS0FBVCxDQUFlc0YsV0FBZixDQUEyQkgsS0FBM0IsRUFBa0NDLE9BQWxDO0FBQ0E7QUFDSDs7QUFFRCxnQkFBSSxDQUFDSCx3QkFBd0IzRixNQUE3QixFQUFxQztBQUNqQ2lHLGdDQUFnQmYsUUFBaEIsRUFBMEI1RCxJQUExQixFQURpQyxDQUNBO0FBQ2pDO0FBQ0g7O0FBRUQ7QUFDQSxnQkFBTVYsU0FBU3hCLEVBQUUsaUNBQUYsQ0FBZjtBQUNBd0IsbUJBQU9wQixJQUFQLENBQVksaUJBQVosRUFBK0JnQixJQUEvQixDQUFvQ21GLHdCQUF3QmxGLElBQXhCLENBQTZCLElBQTdCLENBQXBDO0FBQ0FHLG1CQUNLMUIsSUFETCxDQUNVO0FBQ0ZnRyxrQ0FERTtBQUVGUyxnRUFGRTtBQUdGckU7QUFIRSxhQURWLEVBTUtaLEtBTkwsQ0FNVyxNQU5YO0FBT0gsU0F4QkwsRUF5Qkt3RixJQXpCTCxDQXlCVSxVQUFDQyxLQUFELEVBQVFDLFVBQVIsRUFBb0JDLFdBQXBCLEVBQW9DO0FBQ3RDLGdCQUFNUixRQUFRN0csSUFBSTZELElBQUosQ0FBU3lCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixPQUF4QixFQUFpQyxVQUFqQyxDQUFkO0FBQ0EsZ0JBQU11QixVQUFVOUcsSUFBSTZELElBQUosQ0FBU3lCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixtQ0FBeEIsRUFBNkQsY0FBN0QsQ0FBaEI7QUFDQXZGLGdCQUFJK0csSUFBSixDQUFTckYsS0FBVCxDQUFlc0YsV0FBZixDQUEyQkgsS0FBM0IsRUFBa0NDLE9BQWxDO0FBQ0gsU0E3Qkw7QUE4Qkg7O0FBRUQ7Ozs7Ozs7Ozs7O0FBV0EsYUFBU1EsZ0NBQVQsQ0FBMENoSCxLQUExQyxFQUFpRDRGLFFBQWpELEVBQTJENUQsSUFBM0QsRUFBaUVpRixpQkFBakUsRUFBb0Y7QUFDaEZOLHdCQUFnQmYsUUFBaEIsRUFBMEI1RCxJQUExQixFQUFnQ2lGLGlCQUFoQztBQUNIOztBQUVEOzs7Ozs7O0FBT0EsYUFBU0Msc0JBQVQsQ0FBZ0NsSCxLQUFoQyxFQUF1QztBQUNuQ0EsY0FBTUosSUFBTixDQUFXZ0csUUFBWCxDQUFvQm5ELE9BQXBCLENBQTRCLGNBQU07QUFDOUI1QyxrQkFBTUssSUFBTixTQUFpQjRCLEVBQWpCLHNCQUFzQzNCLGVBQXRDLENBQXNELFNBQXRELEVBQWlFLElBQWpFLEVBQXVFRSxPQUF2RSxDQUErRSxRQUEvRTtBQUNILFNBRkQ7O0FBSUE7QUFDQSxZQUFJUCxFQUFFLDJCQUFGLEVBQStCWSxNQUFuQyxFQUEyQztBQUN2Q1osY0FBRSxjQUFGLEVBQWtCSSxJQUFsQixDQUF1QixRQUF2QixFQUFpQ1UsV0FBakMsQ0FBNkMsVUFBN0M7QUFDSDtBQUNKOztBQUVEOzs7Ozs7QUFNQSxhQUFTK0YsZUFBVCxDQUF5QmYsUUFBekIsRUFBbUM1RCxJQUFuQyxFQUF5QztBQUNyQyxZQUFNbUYsYUFBYTtBQUNmekQsZ0JBQUksOEJBQThCMUIsU0FBUyxTQUFULEdBQXFCLFVBQXJCLEdBQWtDLGNBQWhFLENBRFc7QUFFZjJCLHVCQUFXakUsSUFBSTZELElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsV0FBcEIsQ0FGSTtBQUdmMkQsZUFBR3hCO0FBSFksU0FBbkI7O0FBTUEsWUFBTXRDLE1BQU01RCxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxtQkFBaEMsR0FBc0QzRCxFQUFFdUgsS0FBRixDQUFRRixVQUFSLENBQWxFOztBQUVBRyxlQUFPQyxJQUFQLENBQVlqRSxHQUFaLEVBQWlCLFNBQWpCOztBQUVBO0FBQ0F6RCxjQUFNMkgsU0FBTixHQUFrQnpELElBQWxCLENBQXVCMEQsTUFBdkIsQ0FBOEIsWUFBTTtBQUNoQzVILGtCQUNLNkgsR0FETCxDQUNTLHVCQURULEVBQ2tDUixzQkFEbEMsRUFFS3hDLEVBRkwsQ0FFUSx1QkFGUixFQUVpQyxFQUFDa0Isa0JBQUQsRUFGakMsRUFFNkNzQixzQkFGN0M7QUFHSCxTQUpEO0FBS0FySCxjQUFNOEgsc0JBQU4sQ0FBNkIsUUFBN0I7QUFDSDs7QUFFRDs7O0FBR0EsYUFBU0MsdUJBQVQsR0FBbUM7QUFDL0I7QUFDQSxZQUFNckIsUUFBUTdHLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0Isd0JBQXhCLEVBQWtELFFBQWxELENBQWQ7QUFDQSxZQUFNdUIsVUFBVTlHLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0IsMEJBQXhCLEVBQW9ELFFBQXBELENBQWhCOztBQUVBO0FBQ0EsWUFBTTNDLFVBQVV4QyxFQUFFLElBQUYsRUFBUWEsT0FBUixDQUFnQixJQUFoQixFQUFzQmYsSUFBdEIsRUFBaEI7QUFDQSxZQUFNMEQsTUFBTTVELElBQUk2RCxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLGtCQUE1Qzs7QUFFQTtBQUNBLFlBQU03RCxPQUFPO0FBQ1RrQyxnQkFBSVEsUUFBUVIsRUFESDtBQUVUNEIsZ0JBQUkseUNBRks7QUFHVEMsdUJBQVdqRSxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQjtBQUhGLFNBQWI7O0FBTUE7QUFDQSxZQUFNb0UsU0FBU1AsT0FBT0MsSUFBUCxDQUFZLGFBQVosQ0FBZjs7QUFFQXpILFVBQUVpRSxJQUFGLENBQU8sRUFBQ0MsVUFBVSxNQUFYLEVBQW1CVixRQUFuQixFQUF3QjFELFVBQXhCLEVBQVAsRUFDS3FFLElBREwsQ0FDVSxvQkFBWTtBQUNkLGdCQUFJQyxTQUFTeEQsTUFBYixFQUFxQjtBQUNqQjtBQUNBLG9CQUFNb0gsV0FBVzVELFNBQVMsQ0FBVCxFQUFZNkQsSUFBN0I7O0FBRUE7QUFDQSxvQkFBTVosYUFBYTtBQUNmMUgsNEJBQVEsWUFETztBQUVmdUksNEJBQVEsU0FGTztBQUdmaEcsMEJBQU0sYUFIUztBQUlmK0YsMEJBQU1EO0FBSlMsaUJBQW5COztBQU9BO0FBQ0FELHVCQUFPSSxRQUFQLEdBQ092SSxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixDQURQLGdDQUMrRDNELEVBQUV1SCxLQUFGLENBQVFGLFVBQVIsQ0FEL0Q7QUFFSCxhQWZELE1BZU87QUFDSDtBQUNBVSx1QkFBT0ssS0FBUDtBQUNBeEksb0JBQUkrRyxJQUFKLENBQVNyRixLQUFULENBQWVzRixXQUFmLENBQTJCSCxLQUEzQixFQUFrQ0MsT0FBbEM7QUFDSDtBQUNKLFNBdEJMO0FBdUJIOztBQUVEOzs7QUFHQSxhQUFTMkIscUJBQVQsR0FBaUM7QUFDN0IsWUFBTUMsT0FBT3RJLEVBQUUsSUFBRixFQUFRcUUsSUFBUixDQUFhLE1BQWIsQ0FBYjtBQUNBLFlBQU1rRSxrQkFBa0IzSSxJQUFJK0csSUFBSixDQUFTNkIsZUFBVCxDQUF5QkMsSUFBekIsQ0FBOEIxSSxLQUE5QixDQUF4QjtBQUNBLFlBQU04RCxZQUFZakUsSUFBSTZELElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsV0FBcEIsQ0FBbEI7QUFDQSxZQUFNK0UsVUFBVTFJLEVBQUUsSUFBRixFQUFRYSxPQUFSLENBQWdCLElBQWhCLEVBQXNCZixJQUF0QixHQUE2QmtDLEVBQTdDO0FBQ0EsWUFBTXdCLE1BQU01RCxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQix5RUFDNERFLFNBRDVELGlCQUNpRjZFLE9BRGpGLENBQVo7O0FBR0E7QUFDQSxZQUFNWCxTQUFTUCxPQUFPQyxJQUFQLENBQVksYUFBWixDQUFmOztBQUVBLGlCQUFTa0IsYUFBVCxHQUF5QjtBQUNyQlosbUJBQU9JLFFBQVAsR0FBa0JHLElBQWxCO0FBQ0F2SSxrQkFBTTJILFNBQU4sR0FBa0J6RCxJQUFsQixDQUF1QjBELE1BQXZCLENBQThCLElBQTlCLEVBQW9DLEtBQXBDO0FBQ0g7O0FBRUQsaUJBQVNpQixVQUFULEdBQXNCO0FBQ2xCcEIsbUJBQU9DLElBQVAsQ0FBWWEsSUFBWixFQUFrQixRQUFsQjtBQUNBdkksa0JBQU0ySCxTQUFOLEdBQWtCekQsSUFBbEIsQ0FBdUIwRCxNQUF2QixDQUE4QixJQUE5QixFQUFvQyxLQUFwQztBQUNIOztBQUVELGlCQUFTa0IsZ0JBQVQsQ0FBMEJ6RSxRQUExQixFQUFvQztBQUNoQyxnQkFBTTBFLGFBQWFsSixJQUFJNkQsSUFBSixDQUFTeUIsSUFBVCxDQUFjQyxTQUFkLENBQXdCLHNCQUF4QixFQUFnRCxRQUFoRCxDQUFuQjtBQUNBLGdCQUFNNEQsZUFBZW5KLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0Isa0NBQXhCLEVBQTRELFFBQTVELENBQXJCO0FBQ0EsZ0JBQU02RCxlQUFlLENBQ2pCO0FBQ0l2Qyx1QkFBTzdHLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0IsS0FBeEIsRUFBK0IsU0FBL0IsQ0FEWDtBQUVJOEQsMEJBQVUseUJBQVM7QUFDZkMsK0JBQVdoSixLQUFYO0FBQ0EwSTtBQUNIO0FBTEwsYUFEaUIsRUFRakI7QUFDSW5DLHVCQUFPN0csSUFBSTZELElBQUosQ0FBU3lCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixJQUF4QixFQUE4QixTQUE5QixDQURYO0FBRUk4RCwwQkFBVUM7QUFGZCxhQVJpQixDQUFyQjs7QUFjQSxxQkFBU0EsVUFBVCxDQUFvQmhKLEtBQXBCLEVBQTJCO0FBQ3ZCRixrQkFBRUUsTUFBTU8sTUFBUixFQUFnQkksT0FBaEIsQ0FBd0IsUUFBeEIsRUFBa0NTLEtBQWxDLENBQXdDLE1BQXhDO0FBQ0g7O0FBRUQxQixnQkFBSStHLElBQUosQ0FBUzZCLGVBQVQsQ0FBeUJXLElBQXpCLENBQThCWixlQUE5Qjs7QUFFQSxnQkFBSSxDQUFDbkUsU0FBU2dGLEtBQWQsRUFBcUI7QUFDakJUO0FBQ0gsYUFGRCxNQUVPO0FBQ0haLHVCQUFPSyxLQUFQO0FBQ0F4SSxvQkFBSStHLElBQUosQ0FBU3JGLEtBQVQsQ0FBZXNGLFdBQWYsQ0FBMkJrQyxVQUEzQixFQUF1Q0MsWUFBdkMsRUFBcURDLFlBQXJEO0FBQ0g7QUFDSjs7QUFFRCxpQkFBU0ssZ0JBQVQsR0FBNEI7QUFDeEJ6SixnQkFBSStHLElBQUosQ0FBUzZCLGVBQVQsQ0FBeUJXLElBQXpCLENBQThCWixlQUE5QjtBQUNBSTtBQUNIOztBQUVEL0ksWUFBSStHLElBQUosQ0FBUzJDLEdBQVQsQ0FBYTNGLEdBQWIsQ0FBaUIsRUFBQ0gsUUFBRCxFQUFqQixFQUNLVyxJQURMLENBQ1UwRSxnQkFEVixFQUVLL0IsSUFGTCxDQUVVdUMsZ0JBRlY7QUFHSDs7QUFFRDs7Ozs7O0FBTUEsYUFBU0UsbUJBQVQsR0FBK0I7QUFDM0I7QUFDQSxZQUFNOUMsUUFBUTdHLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0Isb0JBQXhCLEVBQThDLFFBQTlDLENBQWQ7QUFDQSxZQUFNdUIsVUFBVTlHLElBQUk2RCxJQUFKLENBQVN5QixJQUFULENBQWNDLFNBQWQsQ0FBd0Isc0JBQXhCLEVBQWdELFFBQWhELENBQWhCOztBQUVBO0FBQ0EsWUFBTTNDLFVBQVV4QyxFQUFFLElBQUYsRUFBUWEsT0FBUixDQUFnQixJQUFoQixFQUFzQmYsSUFBdEIsRUFBaEI7QUFDQSxZQUFNMEQsTUFBTTVELElBQUk2RCxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLGtCQUE1Qzs7QUFFQTtBQUNBLFlBQU03RCxPQUFPO0FBQ1RrQyxnQkFBSVEsUUFBUVIsRUFESDtBQUVUNEIsZ0JBQUksZ0NBRks7QUFHVEMsdUJBQVdqRSxJQUFJNkQsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQjtBQUhGLFNBQWI7O0FBTUE7QUFDQSxZQUFNb0UsU0FBU1AsT0FBT0MsSUFBUCxDQUFZLGFBQVosQ0FBZjs7QUFFQXpILFVBQUVpRSxJQUFGLENBQU8sRUFBQ0MsVUFBVSxNQUFYLEVBQW1CVixRQUFuQixFQUF3QjFELFVBQXhCLEVBQVAsRUFDS3FFLElBREwsQ0FDVSxvQkFBWTtBQUNkLGdCQUFJQyxTQUFTeEQsTUFBYixFQUFxQjtBQUNqQjtBQURpQixpQ0FFZ0J3RCxTQUFTLENBQVQsQ0FGaEI7QUFBQSxvQkFFVm9GLGFBRlUsY0FFVkEsYUFGVTtBQUFBLG9CQUVLZCxPQUZMLGNBRUtBLE9BRkw7O0FBSWpCOztBQUNBLG9CQUFNckIsYUFBYTtBQUNmMUgsNEJBQVEsWUFETztBQUVmdUksNEJBQVEsU0FGTztBQUdmaEcsMEJBQU0sU0FIUztBQUlmdUgsb0NBQWdCRCxhQUpEO0FBS2ZFLDhCQUFVaEI7QUFMSyxpQkFBbkI7O0FBUUE7QUFDQVgsdUJBQU9JLFFBQVAsR0FDT3ZJLElBQUk2RCxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLENBRFAsZ0NBQytEM0QsRUFBRXVILEtBQUYsQ0FBUUYsVUFBUixDQUQvRDtBQUVILGFBaEJELE1BZ0JPO0FBQ0g7QUFDQVUsdUJBQU9LLEtBQVA7QUFDQXhJLG9CQUFJK0csSUFBSixDQUFTckYsS0FBVCxDQUFlc0YsV0FBZixDQUEyQkgsS0FBM0IsRUFBa0NDLE9BQWxDO0FBQ0g7QUFDSixTQXZCTDtBQXdCSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUEvRyxXQUFPb0YsSUFBUCxHQUFjLFVBQVVaLElBQVYsRUFBZ0I7QUFDMUI7QUFDQXBFLGNBQ0s2RSxFQURMLENBQ1EsT0FEUixFQUNpQixVQURqQixFQUM2QnBFLGdCQUQ3QixFQUVLb0UsRUFGTCxDQUVRLFFBRlIsRUFFa0IsaUJBRmxCLEVBRXFDM0Usc0JBRnJDLEVBR0syRSxFQUhMLENBR1EsUUFIUixFQUdrQixnQkFIbEIsRUFHb0NqRSx5QkFIcEMsRUFJS2lFLEVBSkwsQ0FJUSxPQUpSLEVBSWlCLGVBSmpCLEVBSWtDMkUsbUJBSmxDLEVBS0szRSxFQUxMLENBS1EsT0FMUixFQUtpQixvQkFMakIsRUFLdUNrRCx1QkFMdkMsRUFNS2xELEVBTkwsQ0FNUSxPQU5SLEVBTWlCLGlCQU5qQixFQU1vQ3lELHFCQU5wQyxFQU9LekQsRUFQTCxDQU9RLE9BUFIsRUFPaUIsZ0JBUGpCLEVBT21DckIsb0JBUG5DLEVBUUtxQixFQVJMLENBUVEsT0FSUixFQVFpQixjQVJqQixFQVFpQ0ksa0JBUmpDLEVBU0tKLEVBVEwsQ0FTUSxPQVRSLEVBU2lCLHFCQVRqQixFQVN3Q1kseUJBVHhDLEVBVUtaLEVBVkwsQ0FVUSxPQVZSLEVBVWlCLHNCQVZqQixFQVV5Q2dCLHlCQVZ6Qzs7QUFZQTtBQUNBN0YsY0FBTWMsT0FBTixDQUFjLFNBQWQsRUFDSytELEVBREwsQ0FDUSxPQURSLEVBQ2lCLDJCQURqQixFQUM4Q1kseUJBRDlDLEVBRUtaLEVBRkwsQ0FFUSxPQUZSLEVBRWlCLG9CQUZqQixFQUV1QzVELG1CQUZ2QyxFQUdLNEQsRUFITCxDQUdRLE9BSFIsRUFHaUIsOEJBSGpCLEVBR2lEckQsc0JBSGpELEVBSUtxRCxFQUpMLENBSVEsT0FKUixFQUlpQixnQ0FKakIsRUFJbUQvQix3QkFKbkQsRUFLSytCLEVBTEwsQ0FLUSxPQUxSLEVBS2lCLG1DQUxqQixFQUtzRGlCLDJCQUx0RCxFQU1LakIsRUFOTCxDQU1RLE9BTlIsRUFNaUIsd0NBTmpCLEVBTTJEc0IsK0JBTjNEOztBQVFBO0FBQ0FsRyxVQUFFMkosUUFBRixFQUFZL0UsRUFBWixDQUFlLGtDQUFmLEVBQW1ELGlDQUFuRCxFQUNJc0MsZ0NBREo7O0FBR0EvQztBQUNILEtBNUJEOztBQThCQSxXQUFPeEUsTUFBUDtBQUNILENBbHZCTCIsImZpbGUiOiJvcmRlcnMvb3ZlcnZpZXcvZXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBldmVudHMuanMgMjAyMS0wNS0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjEgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogTWFpbiBUYWJsZSBFdmVudHNcbiAqXG4gKiBIYW5kbGVzIHRoZSBldmVudHMgb2YgdGhlIG1haW4gb3JkZXJzIHRhYmxlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2V2ZW50cycsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9tb21lbnRqcy9tb21lbnQubWluLmpzYCxcbiAgICAgICAgJ2xvYWRpbmdfc3Bpbm5lcicsXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgICd4aHInXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIEJ1bGsgU2VsZWN0aW9uIENoYW5nZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBwcm9wYWdhdGUgV2hldGhlciB0byBhZmZlY3QgdGhlIGJvZHkgZWxlbWVudHMuIFdlIGRvIG5vdCBuZWVkIHRoaXMgb24gXCJkcmF3LmR0XCIgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25CdWxrU2VsZWN0aW9uQ2hhbmdlKGV2ZW50LCBwcm9wYWdhdGUgPSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAocHJvcGFnYXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gRG8gbm90IHByb3BhZ2F0ZSBvbiBkcmF3IGV2ZW50IGJlY2F1c2UgdGhlIGJvZHkgY2hlY2tib3hlcyBhcmUgdW5jaGVja2VkIGJ5IGRlZmF1bHQuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5IGlucHV0OmNoZWNrYm94Jykuc2luZ2xlX2NoZWNrYm94KCdjaGVja2VkJywgJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFRhYmxlIFJvdyBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBXaGVuIGEgcm93IGlzIGNsaWNrZWQgdGhlbiB0aGUgcm93LWNoZWNrYm94IG11c3QgYmUgdG9nZ2xlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd0NsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoISQoZXZlbnQudGFyZ2V0KS5pcygndGQnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dDpjaGVja2JveCcpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCAhJCh0aGlzKS5maW5kKCdpbnB1dDpjaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gVGFibGUgUm93IENoZWNrYm94IENoYW5nZVxuICAgICAgICAgKlxuICAgICAgICAgKiBBZGp1c3QgdGhlIGJ1bGsgYWN0aW9ucyBzdGF0ZSB3aGVuZXZlciB0aGVyZSBhcmUgY2hhbmdlcyBpbiB0aGUgdGFibGUgY2hlY2tib3hlcy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UoKSB7XG4gICAgICAgICAgICBpZiAoJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5wYXJlbnRzKCcub3JkZXJzJykuZmluZCgnLmJ1bGstYWN0aW9uID4gYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0aGlzLnBhcmVudHMoJy5vcmRlcnMnKS5maW5kKCcuYnVsay1hY3Rpb24gPiBidXR0b24nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBDYW5jZWwgT3JkZXIgQ2xpY2tcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25DYW5jZWxPcmRlckNsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZE9yZGVycyA9IF9nZXRTZWxlY3RlZE9yZGVycygkKHRoaXMpKTtcblxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgb3JkZXIgZGVsZXRlIG1vZGFsLlxuICAgICAgICAgICAgJCgnLmNhbmNlbC5tb2RhbCAuc2VsZWN0ZWQtb3JkZXJzJykudGV4dChzZWxlY3RlZE9yZGVycy5qb2luKCcsICcpKTtcbiAgICAgICAgICAgICQoJy5jYW5jZWwubW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFNlbmQgT3JkZXIgQ2xpY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIFNlbmRzIHRoZSBlbWFpbCBvcmRlciBjb25maXJtYXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkJ1bGtFbWFpbE9yZGVyQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5idWxrLWVtYWlsLW9yZGVyLm1vZGFsJyk7XG4gICAgICAgICAgICBjb25zdCAkbWFpbExpc3QgPSAkbW9kYWwuZmluZCgnLmVtYWlsLWxpc3QnKTtcblxuICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVNYWlsUm93TWFya3VwID0gZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHJvdyA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2Zvcm0tZ3JvdXAgZW1haWwtbGlzdC1pdGVtJ30pO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRpZENvbHVtbiA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2NvbC1zbS0zJ30pO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRlbWFpbENvbHVtbiA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2NvbC1zbS05J30pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgJGlkTGFiZWwgPSAkKCc8bGFiZWwvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjb250cm9sLWxhYmVsIGlkLWxhYmVsIGZvcmNlLXRleHQtY29sb3ItYmxhY2sgZm9yY2UtdGV4dC1ub3JtYWwtd2VpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5pZFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgJGVtYWlsSW5wdXQgPSAkKCc8aW5wdXQvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdmb3JtLWNvbnRyb2wgZW1haWwtaW5wdXQnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBkYXRhLmN1c3RvbWVyRW1haWxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRpZExhYmVsLmFwcGVuZFRvKCRpZENvbHVtbik7XG4gICAgICAgICAgICAgICAgJGVtYWlsSW5wdXQuYXBwZW5kVG8oJGVtYWlsQ29sdW1uKTtcblxuICAgICAgICAgICAgICAgICRyb3cuYXBwZW5kKFskaWRDb2x1bW4sICRlbWFpbENvbHVtbl0pO1xuICAgICAgICAgICAgICAgICRyb3cuZGF0YSgnb3JkZXInLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAkcm93O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRPcmRlcnMgPSBbXTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0RhdGEgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgpO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkT3JkZXJzLnB1c2gocm93RGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkT3JkZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRtYWlsTGlzdC5lbXB0eSgpO1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkT3JkZXJzLmZvckVhY2gob3JkZXIgPT4gJG1haWxMaXN0LmFwcGVuZChnZW5lcmF0ZU1haWxSb3dNYXJrdXAob3JkZXIpKSk7XG4gICAgICAgICAgICAgICAgJG1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gU2VuZCBJbnZvaWNlIENsaWNrLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTZW5kcyB0aGUgZW1haWwgaW52b2ljZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IEZpcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQnVsa0VtYWlsSW52b2ljZUNsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcuYnVsay1lbWFpbC1pbnZvaWNlLm1vZGFsJyk7XG4gICAgICAgICAgICBjb25zdCAkbWFpbExpc3QgPSAkbW9kYWwuZmluZCgnLmVtYWlsLWxpc3QnKTtcblxuICAgICAgICAgICAgY29uc3QgZ2VuZXJhdGVNYWlsUm93TWFya3VwID0gZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHJvdyA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2Zvcm0tZ3JvdXAgZW1haWwtbGlzdC1pdGVtJ30pO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRpZENvbHVtbiA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2NvbC1zbS0zJ30pO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRpbnZvaWNlQ29sdW1uID0gJCgnPGRpdi8+Jywge2NsYXNzOiAnY29sLXNtLTMnfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgJGVtYWlsQ29sdW1uID0gJCgnPGRpdi8+Jywge2NsYXNzOiAnY29sLXNtLTYnfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkbGF0ZXN0SW52b2ljZUlkSW5wdXQgPSAkKCc8aW5wdXQvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdmb3JtLWNvbnRyb2wgbGF0ZXN0LWludm9pY2UtaWQnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRhdGEubGF0ZXN0SW52b2ljZUlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkaWRMYWJlbCA9ICQoJzxsYWJlbC8+Jywge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2NvbnRyb2wtbGFiZWwgaWQtbGFiZWwgZm9yY2UtdGV4dC1jb2xvci1ibGFjayBmb3JjZS10ZXh0LW5vcm1hbC13ZWlnaHQnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLmlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkaW52b2ljZUxpbmsgPSAkKCc8bGFiZWwvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjb250cm9sLWxhYmVsIGlkLWxhYmVsIGZvcmNlLXRleHQtY29sb3ItYmxhY2sgZm9yY2UtdGV4dC1ub3JtYWwtd2VpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgaHRtbDogZGF0YS5sYXRlc3RJbnZvaWNlTnVtYmVyID8gYDxhIGhyZWY9XCJyZXF1ZXN0X3BvcnQucGhwP21vZHVsZT1PcmRlckFkbWluJmFjdGlvbj1zaG93UGRmJnR5cGU9aW52b2ljZWBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgYCZpbnZvaWNlX251bWJlcj0ke2RhdGEubGF0ZXN0SW52b2ljZU51bWJlcn0mb3JkZXJfaWQ9JHtkYXRhLmlkfVwiIHRhcmdldD1cIl9ibGFua1wiPmBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgYCR7ZGF0YS5sYXRlc3RJbnZvaWNlTnVtYmVyfTwvYT5gIDogYC1gXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkZW1haWxJbnB1dCA9ICQoJzxpbnB1dC8+Jywge1xuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2Zvcm0tY29udHJvbCBlbWFpbC1pbnB1dCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGRhdGEuY3VzdG9tZXJFbWFpbFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGlkTGFiZWwuYXBwZW5kVG8oJGlkQ29sdW1uKTtcbiAgICAgICAgICAgICAgICAkaW52b2ljZUxpbmsuYXBwZW5kVG8oJGludm9pY2VDb2x1bW4pO1xuICAgICAgICAgICAgICAgICRlbWFpbElucHV0LmFwcGVuZFRvKCRlbWFpbENvbHVtbik7XG5cbiAgICAgICAgICAgICAgICAkcm93LmFwcGVuZChbJGlkQ29sdW1uLCAkaW52b2ljZUNvbHVtbiwgJGVtYWlsQ29sdW1uLCAkbGF0ZXN0SW52b2ljZUlkSW5wdXRdKTtcbiAgICAgICAgICAgICAgICAkcm93LmRhdGEoJ29yZGVyJywgZGF0YSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gJHJvdztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSW52b2ljZSA9IFtdO1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93RGF0YSA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbnZvaWNlLnB1c2gocm93RGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW52b2ljZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkbWFpbExpc3QuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEludm9pY2UuZm9yRWFjaChvcmRlciA9PiAkbWFpbExpc3QuYXBwZW5kKGdlbmVyYXRlTWFpbFJvd01hcmt1cChvcmRlcikpKTtcbiAgICAgICAgICAgICAgICAkbW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb2xsZWN0cyB0aGUgSURzIG9mIHRoZSBzZWxlY3RlZCBvcmRlcnMgYW5kIHJldHVybnMgdGhlbSBhcyBhbiBhcnJheS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICR0YXJnZXQgVGhlIHRyaWdnZXJpbmcgdGFyZ2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcltdfSBhcnJheSBvZiBvcmRlciBJRHNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTZWxlY3RlZE9yZGVycygkdGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZE9yZGVycyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoJHRhcmdldC5wYXJlbnRzKCcuYnVsay1hY3Rpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmV0Y2ggdGhlIHNlbGVjdGVkIG9yZGVyIElEcy5cbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkT3JkZXJzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByb3dJZCA9ICR0YXJnZXQucGFyZW50cygndHInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFyb3dJZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIE5vIG9yZGVyIElEIHdhcyBmb3VuZC5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxlY3RlZE9yZGVycy5wdXNoKHJvd0lkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdGVkT3JkZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIEVtYWlsIEludm9pY2UgQ2xpY2tcbiAgICAgICAgICpcbiAgICAgICAgICogRGlzcGxheSB0aGUgZW1haWwtaW52b2ljZSBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkVtYWlsSW52b2ljZUNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmVtYWlsLWludm9pY2UubW9kYWwnKTtcbiAgICAgICAgICAgIGNvbnN0IHJvd0RhdGEgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgpO1xuICAgICAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocCc7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiByb3dEYXRhLmlkLFxuICAgICAgICAgICAgICAgIGRvOiAnT3JkZXJzTW9kYWxzQWpheC9HZXRFbWFpbEludm9pY2VTdWJqZWN0JyxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGludm9pY2VOdW1iZXJzSHRtbCA9ICcnO1xuXG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLmN1c3RvbWVyLWluZm8nKS50ZXh0KGBcIiR7cm93RGF0YS5jdXN0b21lck5hbWV9XCJgKTtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuZW1haWwtYWRkcmVzcycpLnZhbChyb3dEYXRhLmN1c3RvbWVyRW1haWwpO1xuXG4gICAgICAgICAgICAkbW9kYWxcbiAgICAgICAgICAgICAgICAuZGF0YSgnb3JkZXJJZCcsIHJvd0RhdGEuaWQpXG4gICAgICAgICAgICAgICAgLm1vZGFsKCdzaG93Jyk7XG5cbiAgICAgICAgICAgICQuYWpheCh7dXJsLCBkYXRhLCBkYXRhVHlwZTogJ2pzb24nfSkuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAkbW9kYWwuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc2luZ2xlX2NoZWNrYm94Jyk7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLnN1YmplY3QnKS52YWwocmVzcG9uc2Uuc3ViamVjdCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5pbnZvaWNlSWRFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bS1pbmZvJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLm5vLWludm9pY2UnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bS1pbmZvJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLm5vLWludm9pY2UnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlc3BvbnNlLmludm9pY2VOdW1iZXJzKS5sZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycycpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbnZvaWNlSWQgaW4gcmVzcG9uc2UuaW52b2ljZU51bWJlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZU51bWJlcnNIdG1sICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAnPHA+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJpbnZvaWNlX2lkc1tdXCIgdmFsdWU9XCInICsgaW52b2ljZUlkXG4gICAgICAgICAgICAgICAgICAgICAgICArICdcIiBjaGVja2VkPVwiY2hlY2tlZFwiIGNsYXNzPVwiaW52b2ljZS1udW1iZXJzLWNoZWNrYm94XCIgLz4gJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKyByZXNwb25zZS5pbnZvaWNlTnVtYmVyc1tpbnZvaWNlSWRdICsgJzwvcD4nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuaW52b2ljZS1udW1iZXJzLWNoZWNrYm94ZXMnKS5odG1sKGludm9pY2VOdW1iZXJzSHRtbCk7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycy1jaGVja2JveCcpLm9uKCdjaGFuZ2UnLCBfb25DaGFuZ2VFbWFpbEludm9pY2VDaGVja2JveCk7XG5cbiAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJG1vZGFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIEVtYWlsIEludm9pY2UgQ2hlY2tib3ggQ2hhbmdlXG4gICAgICAgICAqXG4gICAgICAgICAqIERpc2FibGUgc2VuZCBidXR0b24gaWYgYWxsIGludm9pY2UgbnVtYmVyIGNoZWNrYm94ZXMgYXJlIHVuY2hlY2tlZC4gT3RoZXJ3aXNlIGVuYWJsZSB0aGUgc2VuZCBidXR0b24gYWdhaW4uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25DaGFuZ2VFbWFpbEludm9pY2VDaGVja2JveCgpIHtcbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5lbWFpbC1pbnZvaWNlLm1vZGFsJyk7XG5cbiAgICAgICAgICAgIGlmICgkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycy1jaGVja2JveCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMtY2hlY2tib3g6Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5zZW5kJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5zZW5kJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuc2VuZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIEVtYWlsIE9yZGVyIENsaWNrXG4gICAgICAgICAqXG4gICAgICAgICAqIERpc3BsYXkgdGhlIGVtYWlsLW9yZGVyIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkVtYWlsT3JkZXJDbGljayhldmVudCkge1xuICAgICAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmVtYWlsLW9yZGVyLm1vZGFsJyk7XG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSA9PT0gJ2RlJyA/ICdERC5NTS5ZWScgOiAnTU0vREQvWVknO1xuXG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLmN1c3RvbWVyLWluZm8nKS50ZXh0KGBcIiR7cm93RGF0YS5jdXN0b21lck5hbWV9XCJgKTtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuc3ViamVjdCcpLnZhbChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnT1JERVJfU1VCSkVDVCcsICdnbV9vcmRlcl9tZW51JykgKyByb3dEYXRhLmlkXG4gICAgICAgICAgICAgICAgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnT1JERVJfU1VCSkVDVF9GUk9NJywgJ2dtX29yZGVyX21lbnUnKVxuICAgICAgICAgICAgICAgICsgbW9tZW50KHJvd0RhdGEucHVyY2hhc2VEYXRlLmRhdGUpLmZvcm1hdChkYXRlRm9ybWF0KSk7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLmVtYWlsLWFkZHJlc3MnKS52YWwocm93RGF0YS5jdXN0b21lckVtYWlsKTtcblxuICAgICAgICAgICAgJG1vZGFsXG4gICAgICAgICAgICAgICAgLmRhdGEoJ29yZGVySWQnLCByb3dEYXRhLmlkKVxuICAgICAgICAgICAgICAgIC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIENoYW5nZSBPcmRlciBTdGF0dXMgQ2xpY2tcbiAgICAgICAgICpcbiAgICAgICAgICogRGlzcGxheSB0aGUgY2hhbmdlIG9yZGVyIHN0YXR1cyBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25DaGFuZ2VPcmRlclN0YXR1c0NsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJChldmVudC50YXJnZXQpLmhhc0NsYXNzKCdvcmRlci1zdGF0dXMnKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcuc3RhdHVzLm1vZGFsJyk7XG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkT3JkZXJzID0gX2dldFNlbGVjdGVkT3JkZXJzKCQodGhpcykpO1xuXG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnI3N0YXR1cy1kcm9wZG93bicpLnZhbCgocm93RGF0YSkgPyByb3dEYXRhLnN0YXR1c0lkIDogJycpO1xuXG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnI2NvbW1lbnQnKS52YWwoJycpO1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNub3RpZnktY3VzdG9tZXIsICNzZW5kLXBhcmNlbC10cmFja2luZy1jb2RlLCAjc2VuZC1jb21tZW50JylcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsIGZhbHNlKVxuICAgICAgICAgICAgICAgIC5wYXJlbnRzKCcuc2luZ2xlLWNoZWNrYm94JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcblxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgb3JkZXIgY2hhbmdlIHN0YXR1cyBtb2RhbC5cbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuc2VsZWN0ZWQtb3JkZXJzJykudGV4dChzZWxlY3RlZE9yZGVycy5qb2luKCcsICcpKTtcbiAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIEFkZCBUcmFja2luZyBOdW1iZXIgQ2xpY2tcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25BZGRUcmFja2luZ051bWJlckNsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcuYWRkLXRyYWNraW5nLW51bWJlci5tb2RhbCcpO1xuICAgICAgICAgICAgY29uc3Qgcm93RGF0YSA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcblxuICAgICAgICAgICAgJG1vZGFsLmRhdGEoJ29yZGVySWQnLCByb3dEYXRhLmlkKTtcbiAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wZW5zIHRoZSBnbV9wZGZfb3JkZXIucGhwIGluIGEgbmV3IHRhYiB3aXRoIGludm9pY2VzIGFzIHR5cGUgJF9HRVQgYXJndW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBvcmRlciBpZHMgYXJlIHBhc3NlZCBhcyBhIHNlcmlhbGl6ZWQgYXJyYXkgdG8gdGhlIG9JRCAkX0dFVCBhcmd1bWVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkJ1bGtEb3dubG9hZEludm9pY2VDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySWRzID0gW107XG4gICAgICAgICAgICBjb25zdCBtYXhBbW91bnRJbnZvaWNlc0J1bGtQZGYgPSBkYXRhLm1heEFtb3VudEludm9pY2VzQnVsa1BkZjtcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG9yZGVySWRzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChvcmRlcklkcy5sZW5ndGggPiBtYXhBbW91bnRJbnZvaWNlc0J1bGtQZGYpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcuYnVsay1lcnJvci5tb2RhbCcpO1xuICAgICAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgJGludm9pY2VNZXNzYWdlQ29udGFpbmVyID0gJG1vZGFsLmZpbmQoJy5pbnZvaWNlcy1tZXNzYWdlJyk7XG4gICAgICAgICAgICAgICAgJGludm9pY2VNZXNzYWdlQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkbW9kYWwub24oJ2hpZGUuYnMubW9kYWwnLCAoKSA9PiAkaW52b2ljZU1lc3NhZ2VDb250YWluZXIuYWRkQ2xhc3MoJ2hpZGRlbicpKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2NyZWF0ZUJ1bGtQZGYob3JkZXJJZHMsICdpbnZvaWNlJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVucyB0aGUgZ21fcGRmX29yZGVyLnBocCBpbiBhIG5ldyB0YWIgd2l0aCBwYWNraW5nIHNsaXAgYXMgdHlwZSAkX0dFVCBhcmd1bWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIG9yZGVyIGlkcyBhcmUgcGFzc2VkIGFzIGEgc2VyaWFsaXplZCBhcnJheSB0byB0aGUgb0lEICRfR0VUIGFyZ3VtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQnVsa0Rvd25sb2FkUGFja2luZ1NsaXBDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySWRzID0gW107XG4gICAgICAgICAgICBjb25zdCBtYXhBbW91bnRQYWNraW5nU2xpcHNCdWxrUGRmID0gZGF0YS5tYXhBbW91bnRQYWNraW5nU2xpcHNCdWxrUGRmO1xuICAgICAgICAgICAgbGV0ICRtb2RhbDtcbiAgICAgICAgICAgIGxldCAkcGFja2luZ1NsaXBzTWVzc2FnZUNvbnRhaW5lcjtcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG9yZGVySWRzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChvcmRlcklkcy5sZW5ndGggPiBtYXhBbW91bnRQYWNraW5nU2xpcHNCdWxrUGRmKSB7XG4gICAgICAgICAgICAgICAgJG1vZGFsID0gJCgnLmJ1bGstZXJyb3IubW9kYWwnKTtcbiAgICAgICAgICAgICAgICAkbW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAkcGFja2luZ1NsaXBzTWVzc2FnZUNvbnRhaW5lciA9ICRtb2RhbC5maW5kKCcucGFja2luZy1zbGlwcy1tZXNzYWdlJyk7XG5cbiAgICAgICAgICAgICAgICAkcGFja2luZ1NsaXBzTWVzc2FnZUNvbnRhaW5lci5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYWNraW5nU2xpcHNNZXNzYWdlQ29udGFpbmVyLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2NyZWF0ZUJ1bGtQZGYob3JkZXJJZHMsICdwYWNraW5nc2xpcCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBidWxrIHBkZiB3aXRoIGludm9pY2VzIG9yIHBhY2tpbmcgc2xpcHMgaW5mb3JtYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgY2hlY2sgaWYgYWxsIHRoZSBzZWxlY3RlZCBvcmRlcnMgaGF2ZSBhIGRvY3VtZW50IGFuZCBvcGVuIGEgY29uY2F0ZW5hdGVkIFBERiBmaWxlLiBJZiB0aGVyZVxuICAgICAgICAgKiBhcmUgb3JkZXJzIHRoYXQgZG8gbm90IGhhdmUgYW55IGRvY3VtZW50IHRoZW4gYSBtb2RhbCB3aWxsIGJlIHNob3duLCBwcm9tcHRpbmcgdGhlIHVzZXIgdG8gY3JlYXRlIHRoZSBtaXNzaW5nXG4gICAgICAgICAqIGRvY3VtZW50cyBvciBjb250aW51ZSB3aXRob3V0IHRoZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyW119IG9yZGVySWRzIFByb3ZpZGUgdGhlIHNlbGVjdGVkIG9yZGVyIElEcy5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgUHJvdmlkZSB0aGUgYnVsayBQREYgdHlwZSBcImludm9pY2VcIiBvciBcInBhY2tpbmdzbGlwXCIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlQnVsa1BkZihvcmRlcklkcywgdHlwZSkge1xuICAgICAgICAgICAgaWYgKHR5cGUgIT09ICdpbnZvaWNlJyAmJiB0eXBlICE9PSAncGFja2luZ3NsaXAnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHR5cGUgcHJvdmlkZWQ6ICcgKyB0eXBlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocCc7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGRvOiAnT3JkZXJzT3ZlcnZpZXdBamF4L0dldE9yZGVyc1dpdGhvdXREb2N1bWVudHMnLFxuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyksXG4gICAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgICBvcmRlcklkc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJC5nZXRKU09OKHVybCwgZGF0YSlcbiAgICAgICAgICAgICAgICAuZG9uZShvcmRlcklkc1dpdGhvdXREb2N1bWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmRlcklkc1dpdGhvdXREb2N1bWVudC5leGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0dFVF9PUkRFUlNfV0lUSE9VVF9ET0NVTUVOVF9FUlJPUicsICdhZG1pbl9vcmRlcnMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghb3JkZXJJZHNXaXRob3V0RG9jdW1lbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfb3BlbkJ1bGtQZGZVcmwob3JkZXJJZHMsIHR5cGUpOyAvLyBBbGwgdGhlIHNlbGVjdGVkIG9yZGVyIGhhdmUgZG9jdW1lbnRzLlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU29tZSBvcmRlcnMgZG8gbm90IGhhdmUgZG9jdW1lbnRzLCBkaXNwbGF5IHRoZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5tb2RhbC5jcmVhdGUtbWlzc2luZy1kb2N1bWVudHMnKTtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5vcmRlci1pZHMtbGlzdCcpLnRleHQob3JkZXJJZHNXaXRob3V0RG9jdW1lbnQuam9pbignLCAnKSk7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbFxuICAgICAgICAgICAgICAgICAgICAgICAgLmRhdGEoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVySWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVySWRzV2l0aG91dERvY3VtZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKChqcXhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdHRVRfT1JERVJTX1dJVEhPVVRfRE9DVU1FTlRfRVJST1InLCAnYWRtaW5fb3JkZXJzJyk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgTWlzc2luZyBEb2N1bWVudHMgUHJvY2VlZCBIYW5kbGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgaGFuZGxlciB3aWxsIGJlIGV4ZWN1dGVkIHdoZW5ldmVyIHRoZSB1c2VyIHByb2NlZWRzIHRocm91Z2ggdGhlIFwiY3JlYXRlLW1pc3NpbmctZG9jdW1lbnRzXCIgbW9kYWwuIEl0IHdpbGxcbiAgICAgICAgICogYmUgcmVzb2x2ZWQgZXZlbiBpZiB0aGUgdXNlciBkb2VzIG5vdCBzZWxlY3QgdGhlIGNoZWNrYm94IFwiY3JlYXRlLW1pc3NpbmctZG9jdW1lbnRzXCIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcltdfSBvcmRlcklkcyBUaGUgc2VsZWN0ZWQgb3JkZXJzIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBQREYuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFdoZXRoZXIgJ2ludm9pY2UnIG9yICdwYWNraW5nc2xpcCcuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkb3dubG9hZFBkZldpbmRvdyBQcm92aWRlIGEgd2luZG93IGhhbmRsZSBmb3IgYnlwYXNzaW5nIGJyb3dzZXIncyBwb3B1cCBibG9ja2luZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkNyZWF0ZU1pc3NpbmdEb2N1bWVudHNQcm9jZWVkKGV2ZW50LCBvcmRlcklkcywgdHlwZSwgZG93bmxvYWRQZGZXaW5kb3cpIHtcbiAgICAgICAgICAgIF9vcGVuQnVsa1BkZlVybChvcmRlcklkcywgdHlwZSwgZG93bmxvYWRQZGZXaW5kb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFNpbmdsZSBDaGVja2JveCBSZWFkeVxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGNhbGxiYWNrIHdpbGwgdXNlIHRoZSBldmVudC5kYXRhLm9yZGVySWRzIHRvIHNldCB0aGUgY2hlY2tlZCBjaGVja2JveGVzIGFmdGVyIGEgdGFibGUgcmUtcmVuZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNpbmdsZUNoZWNrYm94UmVhZHkoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEub3JkZXJJZHMuZm9yRWFjaChpZCA9PiB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZChgdHIjJHtpZH0gaW5wdXQ6Y2hlY2tib3hgKS5zaW5nbGVfY2hlY2tib3goJ2NoZWNrZWQnLCB0cnVlKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBCdWxrIGFjdGlvbiBidXR0b24gc2hvdWxkJ3QgYmUgZGlzYWJsZWQgYWZ0ZXIgYSBkYXRhdGFibGUgcmVsb2FkLlxuICAgICAgICAgICAgaWYgKCQoJ3RyIGlucHV0OmNoZWNrYm94OmNoZWNrZWQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcuYnVsay1hY3Rpb24nKS5maW5kKCdidXR0b24nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVucyB0aGUgVVJMIHdoaWNoIHByb3ZpZGVzIHRoZSBidWxrIFBERiBmb3IgZG93bmxvYWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyW119IG9yZGVySWRzIFRoZSBvcmRlcnMgdG8gYmUgdXNlZCBmb3IgdGhlIGNvbmNhdGVuYXRlZCBkb2N1bWVudC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgV2hldGhlciAnaW52b2ljZScgb3IgJ3BhY2tpbmdzbGlwJy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vcGVuQnVsa1BkZlVybChvcmRlcklkcywgdHlwZSkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgICAgICBkbzogJ09yZGVyc01vZGFsc0FqYXgvQnVsa1BkZicgKyAodHlwZSA9PT0gJ2ludm9pY2UnID8gJ0ludm9pY2VzJyA6ICdQYWNraW5nU2xpcHMnKSxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpLFxuICAgICAgICAgICAgICAgIG86IG9yZGVySWRzXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwPycgKyAkLnBhcmFtKHBhcmFtZXRlcnMpO1xuXG4gICAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfcGFyZW50Jyk7XG5cbiAgICAgICAgICAgIC8vIEtlZXAgY2hlY2tib3hlcyBjaGVja2VkIGFmdGVyIGEgZGF0YXRhYmxlIHJlbG9hZC5cbiAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAub2ZmKCdzaW5nbGVfY2hlY2tib3g6cmVhZHknLCBfb25TaW5nbGVDaGVja2JveFJlYWR5KVxuICAgICAgICAgICAgICAgICAgICAub24oJ3NpbmdsZV9jaGVja2JveDpyZWFkeScsIHtvcmRlcklkc30sIF9vblNpbmdsZUNoZWNrYm94UmVhZHkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkdGhpcy5vcmRlcnNfb3ZlcnZpZXdfZmlsdGVyKCdyZWxvYWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBQYWNraW5nIFNsaXAgQ2xpY2tcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNob3dQYWNraW5nU2xpcENsaWNrKCkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBtb2RhbCBkYXRhLlxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfU0hPV19QQUNLSU5HU0xJUCcsICdvcmRlcnMnKTtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTk9fUEFDS0lOR1NMSVBfQVZBSUxBQkxFJywgJ29yZGVycycpO1xuXG4gICAgICAgICAgICAvLyBSZXF1ZXN0IGRhdGEuXG4gICAgICAgICAgICBjb25zdCByb3dEYXRhID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHAnO1xuXG4gICAgICAgICAgICAvLyBSZXF1ZXN0IHBhcmFtZXRlcnMuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiByb3dEYXRhLmlkLFxuICAgICAgICAgICAgICAgIGRvOiAnT3JkZXJzT3ZlcnZpZXdBamF4L0dldExhdGVzdFBhY2tpbmdTbGlwJyxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBEaXJlY3RseSBvcGVuIGEgbmV3IHRhYiAocG9wdXAgYmxvY2tlciB3b3JrYXJvdW5kKVxuICAgICAgICAgICAgY29uc3QgbmV3VGFiID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XG5cbiAgICAgICAgICAgICQuYWpheCh7ZGF0YVR5cGU6ICdqc29uJywgdXJsLCBkYXRhfSlcbiAgICAgICAgICAgICAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgZmlsZSBuYW1lIGZyb20gdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZW5hbWUgPSByZXNwb25zZVswXS5maWxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQYWNraW5nIHNsaXAgbGluayBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGU6ICdPcmRlckFkbWluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdzaG93UGRmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGFja2luZ3NsaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGU6IGZpbGVuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIHBhY2thZ2Ugc2xpcC5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RhYi5sb2NhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7anNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJyl9L2FkbWluL3JlcXVlc3RfcG9ydC5waHA/JHskLnBhcmFtKHBhcmFtZXRlcnMpfWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBObyBwYWNraW5nIHNsaXAgZm91bmRcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RhYi5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gSW52b2ljZSBDcmVhdGUgQ2xpY2tcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkNyZWF0ZUludm9pY2VDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIGNvbnN0ICRsb2FkaW5nU3Bpbm5lciA9IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5zaG93KCR0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VUb2tlbiA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpO1xuICAgICAgICAgICAgY29uc3Qgb3JkZXJJZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCkuaWQ7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKVxuICAgICAgICAgICAgICAgICsgYC9hZG1pbi9hZG1pbi5waHA/ZG89T3JkZXJzTW9kYWxzQWpheC9HZXRJbnZvaWNlQ291bnQmcGFnZVRva2VuPSR7cGFnZVRva2VufSZvcmRlcklkPSR7b3JkZXJJZH1gO1xuXG4gICAgICAgICAgICAvLyBEaXJlY3RseSBvcGVuIGEgbmV3IHRhYiAocG9wdXAgYmxvY2tlciB3b3JrYXJvdW5kKVxuICAgICAgICAgICAgY29uc3QgbmV3VGFiID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUludm9pY2UoKSB7XG4gICAgICAgICAgICAgICAgbmV3VGFiLmxvY2F0aW9uID0gbGluaztcbiAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnJlbG9hZChudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZEludm9pY2UoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm9wZW4obGluaywgJ19ibGFuaycpO1xuICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25SZXF1ZXN0U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGFsVGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfQ1JFQVRFX0lOVk9JQ0UnLCAnb3JkZXJzJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbW9kYWxNZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfQ1JFQVRFX0lOVk9JQ0VfQ09ORklSTUFUSU9OJywgJ29yZGVycycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGFsQnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCd5ZXMnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zZU1vZGFsKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRJbnZvaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm8nLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGNsb3NlTW9kYWxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjbG9zZU1vZGFsKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKCRsb2FkaW5nU3Bpbm5lcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLmNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUludm9pY2UoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdUYWIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UobW9kYWxUaXRsZSwgbW9kYWxNZXNzYWdlLCBtb2RhbEJ1dHRvbnMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlcXVlc3RGYWlsdXJlKCkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKCRsb2FkaW5nU3Bpbm5lcik7XG4gICAgICAgICAgICAgICAgY3JlYXRlSW52b2ljZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBqc2UubGlicy54aHIuZ2V0KHt1cmx9KVxuICAgICAgICAgICAgICAgIC5kb25lKG9uUmVxdWVzdFN1Y2Nlc3MpXG4gICAgICAgICAgICAgICAgLmZhaWwob25SZXF1ZXN0RmFpbHVyZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gSW52b2ljZSBMaW5rIENsaWNrXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBzY3JpcHQgdGhhdCBnZW5lcmF0ZXMgdGhlIFBERnMgaXMgY2hhbmdpbmcgdGhlIHN0YXR1cyBvZiBhbiBvcmRlciB0byBcImludm9pY2UtY3JlYXRlZFwiLiBUaHVzIHRoZVxuICAgICAgICAgKiB0YWJsZSBkYXRhIG5lZWQgdG8gYmUgcmVkcmF3biBhbmQgdGhlIGZpbHRlciBvcHRpb25zIHRvIGJlIHVwZGF0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25TaG93SW52b2ljZUNsaWNrKCkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBtb2RhbCBkYXRhLlxuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfU0hPV19JTlZPSUNFJywgJ29yZGVycycpO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdOT19JTlZPSUNFX0FWQUlMQUJMRScsICdvcmRlcnMnKTtcblxuICAgICAgICAgICAgLy8gUmVxdWVzdCBkYXRhLlxuICAgICAgICAgICAgY29uc3Qgcm93RGF0YSA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwJztcblxuICAgICAgICAgICAgLy8gUmVxdWVzdCBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBpZDogcm93RGF0YS5pZCxcbiAgICAgICAgICAgICAgICBkbzogJ09yZGVyc092ZXJ2aWV3QWpheC9HZXRJbnZvaWNlcycsXG4gICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRGlyZWN0bHkgb3BlbiBhIG5ldyB0YWIgKHBvcHVwIGJsb2NrZXIgd29ya2Fyb3VuZClcbiAgICAgICAgICAgIGNvbnN0IG5ld1RhYiA9IHdpbmRvdy5vcGVuKCdhYm91dDpibGFuaycpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe2RhdGFUeXBlOiAnanNvbicsIHVybCwgZGF0YX0pXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGZpbGUgbmFtZSBmcm9tIG9iamVjdCB3aXRoIHRoZSBoaWdoZXN0IElEIHdpdGhpbiByZXNwb25zZSBhcnJheS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHtpbnZvaWNlTnVtYmVyLCBvcmRlcklkfSA9IHJlc3BvbnNlWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbnZvaWNlIGxpbmsgcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlOiAnT3JkZXJBZG1pbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc2hvd1BkZicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2ludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludm9pY2VfbnVtYmVyOiBpbnZvaWNlTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyX2lkOiBvcmRlcklkXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIGludm9pY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1RhYi5sb2NhdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCR7anNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJyl9L2FkbWluL3JlcXVlc3RfcG9ydC5waHA/JHskLnBhcmFtKHBhcmFtZXRlcnMpfWA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBObyBpbnZvaWNlIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdUYWIuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEJpbmQgdGFibGUgcm93IGFjdGlvbnMuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAndGJvZHkgdHInLCBfb25UYWJsZVJvd0NsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgJy5idWxrLXNlbGVjdGlvbicsIF9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnaW5wdXQ6Y2hlY2tib3gnLCBfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnNob3ctaW52b2ljZScsIF9vblNob3dJbnZvaWNlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuc2hvdy1wYWNraW5nLXNsaXAnLCBfb25TaG93UGFja2luZ1NsaXBDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5jcmVhdGUtaW52b2ljZScsIF9vbkNyZWF0ZUludm9pY2VDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5lbWFpbC1pbnZvaWNlJywgX29uRW1haWxJbnZvaWNlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuZW1haWwtb3JkZXInLCBfb25FbWFpbE9yZGVyQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcub3JkZXItc3RhdHVzLmxhYmVsJywgX29uQ2hhbmdlT3JkZXJTdGF0dXNDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5hZGQtdHJhY2tpbmctbnVtYmVyJywgX29uQWRkVHJhY2tpbmdOdW1iZXJDbGljayk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgdGFibGUgcm93IGFuZCBidWxrIGFjdGlvbnMuXG4gICAgICAgICAgICAkdGhpcy5wYXJlbnRzKCcub3JkZXJzJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4tZ3JvdXAgLmNoYW5nZS1zdGF0dXMnLCBfb25DaGFuZ2VPcmRlclN0YXR1c0NsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmJ0bi1ncm91cCAuY2FuY2VsJywgX29uQ2FuY2VsT3JkZXJDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4tZ3JvdXAgLmJ1bGstZW1haWwtb3JkZXInLCBfb25CdWxrRW1haWxPcmRlckNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmJ0bi1ncm91cCAuYnVsay1lbWFpbC1pbnZvaWNlJywgX29uQnVsa0VtYWlsSW52b2ljZUNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmJ0bi1ncm91cCAuYnVsay1kb3dubG9hZC1pbnZvaWNlJywgX29uQnVsa0Rvd25sb2FkSW52b2ljZUNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmJ0bi1ncm91cCAuYnVsay1kb3dubG9hZC1wYWNraW5nLXNsaXAnLCBfb25CdWxrRG93bmxvYWRQYWNraW5nU2xpcENsaWNrKTtcblxuICAgICAgICAgICAgLy8gQmluZCBjdXN0b20gZXZlbnRzLlxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NyZWF0ZV9taXNzaW5nX2RvY3VtZW50czpwcm9jZWVkJywgJy5tb2RhbC5jcmVhdGUtbWlzc2luZy1kb2N1bWVudHMnLFxuICAgICAgICAgICAgICAgIF9vbkNyZWF0ZU1pc3NpbmdEb2N1bWVudHNQcm9jZWVkKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
