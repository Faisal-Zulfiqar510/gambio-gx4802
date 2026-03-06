'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* --------------------------------------------------------------
 events.js 2021-07-08
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
 * Handles the events of the main invoices table.
 */
gx.controllers.module('events', ['loading_spinner'], function (data) {

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

    /**
     * Loading spinner instance.
     *
     * @type {jQuery|null}
     */
    var $spinner = null;

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
            $this.parents('.invoices').find('.bulk-action > button').removeClass('disabled');
        } else {
            $this.parents('.invoices').find('.bulk-action > button').addClass('disabled');
        }
    }

    /**
     * Collects the required data of the selected invoices in an array.
     *
     * @param {jQuery} $target Target element which triggered the data collection.
     *
     * @return {*[]} Returns an array of the requested invoice data.
     */
    function _getSelectedInvoicesData($target, dataKey) {
        var selectedInvoices = [];

        if ($target.parents('.bulk-action').length > 0) {
            // Fetch the selected order IDs.
            $this.find('tbody input:checkbox:checked').each(function (index, checkbox) {
                return selectedInvoices.push($(checkbox).parents('tr').data(dataKey));
            });
        } else {
            var rowId = $target.parents('tr').data(dataKey);

            if (!rowId) {
                return; // No invoice ID was found.
            }

            selectedInvoices.push(rowId);
        }

        return selectedInvoices;
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
        var selectedOrders = _getSelectedInvoicesData($(this), 'orderId').filter(function (orderId) {
            return orderId !== 0;
        });

        if (!selectedOrders.length) {
            var title = jse.core.lang.translate('HEADING_GM_STATUS', 'orders');
            var message = jse.core.lang.translate('NO_RECORDS_ERROR', 'orders');
            jse.libs.modal.showMessage(title, message);
            return;
        }

        $modal.find('#status-dropdown').val(rowData ? rowData.statusId : '');
        $modal.find('#comment').val('');
        $modal.find('#notify-customer, #send-parcel-tracking-code, #send-comment').attr('checked', false).parents('.single-checkbox').removeClass('checked');

        // Show the order change status modal (remove duplicate entries from selectedOrders).
        $modal.find('.selected-orders').text(Array.from(new Set(selectedOrders)).join(', '));
        $modal.modal('show');
    }

    /**
     * Opens the URL which provide the bulk PDF's as download.
     *
     * @param {Number[]} invoiceIds The invoices to be concatenated.
     */
    function _openBulkPdfUrl(invoiceIds) {
        var parameters = {
            do: 'InvoicesModalsAjax/BulkPdfInvoices',
            pageToken: jse.core.config.get('pageToken'),
            i: invoiceIds
        };

        var url = jse.core.config.get('appUrl') + '/admin/admin.php?' + $.param(parameters);

        window.open(url, '_parent');

        jse.libs.loading_spinner.hide($spinner);
    }

    /**
     * Creates a bulk PDF with invoices.
     *
     * @param {Number[]} invoiceIds The invoices to be concatenated.
     */
    function _createBulkPdf(invoiceIds) {
        var zIndex = $('.table-fixed-header thead.fixed').css('z-index'); // Could be "undefined" as well.
        $spinner = jse.libs.loading_spinner.show($this, zIndex);
        _openBulkPdfUrl(invoiceIds);
    }

    /**
     * Opens the gm_pdf_order.php in a new tab with invoices as type $_GET argument.
     *
     * The order ids are passed as a serialized array to the oID $_GET argument.
     */
    function _onBulkDownloadInvoiceClick() {
        var invoiceIds = _getSelectedInvoicesData($(this), 'invoiceId');

        if (invoiceIds.length > data.maxAmountInvoicesBulkPdf) {
            var $modal = $('.bulk-error.modal');
            $modal.modal('show');

            var $invoiceMessageContainer = $modal.find('.invoices-message');
            $invoiceMessageContainer.removeClass('hidden');
            $modal.on('hide.bs.modal', function () {
                return $invoiceMessageContainer.addClass('hidden');
            });

            return;
        }

        _createBulkPdf(invoiceIds);
    }

    /**
     * On Single Checkbox Ready
     *
     * This callback will use the event.data.invoiceIds to set the checked checkboxes after a table re-render.
     *
     * @param {jQuery.Event} event
     */
    function _onSingleCheckboxReady(event) {
        event.data.invoiceIds.forEach(function (id) {
            $this.find('tr#' + id + ' input:checkbox').single_checkbox('checked', true).trigger('change');
        });

        // Bulk action button should't be disabled after a datatable reload.
        if ($('tr input:checkbox:checked').length) {
            $('.bulk-action').find('button').removeClass('disabled');
        }
    }

    /**
     * Cancellation Invoice Generation
     *
     * This method will create a new cancellation invoice for the selected invoices.
     */
    function _onCancellationInvoiceClick() {
        var invoices = [];

        var _$$parents$data = $(this).parents('tr').data(),
            invoiceId = _$$parents$data.invoiceId,
            invoiceNumber = _$$parents$data.invoiceNumber,
            orderId = _$$parents$data.orderId,
            isCancellationInvoice = _$$parents$data.isCancellationInvoice;

        if (isCancellationInvoice || orderId === 0) {
            return;
        }

        invoices.push({
            invoiceId: invoiceId,
            invoiceNumber: invoiceNumber,
            orderId: orderId
        });

        var title = jse.core.lang.translate('HEADING_MODAL_CANCELLATION_INVOICE', 'orders');
        var message = jse.core.lang.translate('TEXT_MODAL_CANCELLATION_INVOICE', 'orders').replace('%s', invoices.map(function (invoice) {
            return invoice.invoiceNumber;
        }).join(', '));
        var buttons = [{
            title: jse.core.lang.translate('no', 'lightbox_buttons'),
            callback: function callback(event) {
                return $(event.currentTarget).parents('.modal').modal('hide');
            }
        }, {
            title: jse.core.lang.translate('yes', 'lightbox_buttons'),
            callback: function callback() {
                var invoice = invoices.pop();
                var url = 'gm_pdf_order.php?oID=' + invoice.orderId + '&type=invoice' + ('&cancel_invoice_id=' + invoice.invoiceId);

                window.open(url, '_blank');

                var invoiceIds = invoices.map(function (invoice) {
                    return invoice.invoiceId;
                });

                $this.DataTable().ajax.reload(function () {
                    $this.off('single_checkbox:ready', _onSingleCheckboxReady).on('single_checkbox:ready', { invoiceIds: invoiceIds }, _onSingleCheckboxReady);
                });

                $(this).parents('.modal').modal('hide');
            }
        }];

        jse.libs.modal.showMessage(title, message, buttons);
    }

    /**
     * Bulk Cancellation Invoice Generation
     *
     * This method will create cancellation invoices for the selected invoices.
     */
    function _onBulkCancellationInvoiceClick() {
        var invoices = [];

        $this.find('tbody input:checkbox:checked').each(function () {
            var _$$parents$data2 = $(this).parents('tr').data(),
                invoiceId = _$$parents$data2.invoiceId,
                invoiceNumber = _$$parents$data2.invoiceNumber,
                orderId = _$$parents$data2.orderId,
                isCancellationInvoice = _$$parents$data2.isCancellationInvoice;

            if (!isCancellationInvoice && orderId > 0) {
                invoices.push({
                    invoiceId: invoiceId,
                    invoiceNumber: invoiceNumber,
                    orderId: orderId
                });
            }
        });

        if (!invoices.length) {
            var _title = jse.core.lang.translate('HEADING_MODAL_CANCELLATION_INVOICE', 'orders');
            var _message = jse.core.lang.translate('NO_RECORDS_ERROR', 'orders');
            jse.libs.modal.showMessage(_title, _message);
            return;
        }

        var title = jse.core.lang.translate('HEADING_MODAL_CANCELLATION_INVOICE', 'orders');
        var message = jse.core.lang.translate('TEXT_MODAL_CANCELLATION_INVOICE', 'orders').replace('%s', invoices.map(function (invoice) {
            return invoice.invoiceNumber;
        }).join(', '));
        var buttons = [{
            title: jse.core.lang.translate('no', 'lightbox_buttons'),
            callback: function callback(event) {
                return $(event.currentTarget).parents('.modal').modal('hide');
            }
        }, {
            title: jse.core.lang.translate('yes', 'lightbox_buttons'),
            callback: function callback() {
                var _$,
                    _this = this;

                // Create new cancellation invoices and refresh the table.
                var requests = [];

                invoices.forEach(function (invoice) {
                    var url = 'gm_pdf_order.php?oID=' + invoice.orderId + '&type=invoice' + ('&cancel_invoice_id=' + invoice.invoiceId + '&ajax=1');

                    requests.push($.get(url));
                });

                (_$ = $).when.apply(_$, requests).done(function () {
                    for (var _len = arguments.length, responses = Array(_len), _key = 0; _key < _len; _key++) {
                        responses[_key] = arguments[_key];
                    }

                    var cancellationInvoiceIds = [];

                    if (requests.length === 1) {
                        responses = [responses]; // Always treat the responses as an array.
                    }

                    responses.forEach(function (response) {
                        var _JSON$parse = JSON.parse(response[0]),
                            invoiceId = _JSON$parse.invoiceId;

                        cancellationInvoiceIds.push(invoiceId);
                    });

                    _createBulkPdf(cancellationInvoiceIds);

                    var invoiceIds = invoices.map(function (invoice) {
                        return invoice.invoiceId;
                    });

                    $this.DataTable().ajax.reload(function () {
                        $this.off('single_checkbox:ready', _onSingleCheckboxReady).on('single_checkbox:ready', { invoiceIds: invoiceIds }, _onSingleCheckboxReady);
                    });
                    $(_this).parents('.modal').modal('hide');
                });
            }
        }];

        jse.libs.modal.showMessage(title, message, buttons);
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
            do: 'InvoicesModalsAjax/GetEmailInvoiceInformation',
            pageToken: jse.core.config.get('pageToken'),
            o: [rowData.orderId]
        };

        $modal.data('invoiceId', rowData.invoiceId).data('orderId', rowData.orderId).modal('show');

        $.ajax({ url: url, data: data, dataType: 'json' }).done(function (response) {
            var dateFormat = response.date_formats[rowData.orderId];
            var subject = response.subject.replace('{INVOICE_ID}', rowData.invoiceNumber).replace('{DATE}', moment(rowData.invoiceDate.date).format(dateFormat)).replace('{ORDER_ID}', rowData.orderId);

            $modal.find('.subject').val(subject);

            var customerInfo = '"' + rowData.customerName + '"';

            if (response.emails[rowData.orderId]) {
                customerInfo += ' "' + response.emails[rowData.orderId] + '"';
            }

            $modal.find('.customer-info').text(customerInfo);
            $modal.find('.email-address').val(response.emails[rowData.orderId] || '');
        });
    }

    /**
     * Generate email row markup.
     *
     * This method is used by the bulk email modal for dynamic email-row generation.
     *
     * @param {Object} invoice Contains the required row data.
     * @param {Object} emailInformation Contains the subject and email addresses for the invoices.
     *
     * @return {jQuery} Returns the row selector.
     */
    function _generateMailRowMarkup(invoice, emailInformation) {
        var $row = $('<div/>', { class: 'form-group email-list-item' });
        var $idColumn = $('<div/>', { class: 'col-sm-3' });
        var $dateColumn = $('<div/>', { class: 'col-sm-3' });
        var $emailColumn = $('<div/>', { class: 'col-sm-6' });

        var $idLabel = $('<label/>', {
            class: 'control-label id-label force-text-color-black force-text-normal-weight',
            html: '<a href="request_port.php?module=OrderAdmin&action=showPdf&type=invoice' + ('&invoice_number=' + invoice.invoiceNumber + '&order_id=' + invoice.orderId + '" target="_blank">') + (invoice.invoiceNumber + '</a>')
        });

        var dateFormat = jse.core.config.get('languageCode') === 'de' ? 'DD.MM.YYYY' : 'MM.DD.YYYY';
        var $dateLabel = $('<label/>', {
            class: 'control-label date-label force-text-color-black force-text-normal-weight',
            text: moment(invoice.invoiceDate.date).format(dateFormat)
        });

        var $emailInput = $('<input/>', {
            class: 'form-control email-input',
            type: 'text',
            value: emailInformation.emails[invoice.orderId]
        });

        $idLabel.appendTo($idColumn);
        $dateLabel.appendTo($dateColumn);
        $emailInput.appendTo($emailColumn);

        $row.append([$idColumn, $dateColumn, $emailColumn]);
        $row.data('invoice', invoice);

        return $row;
    }

    /**
     * Bulk Email Invoice Click.
     *
     * Sends emails with the selected invoices.
     *
     * @param {jQuery.Event} event
     */
    function _onBulkEmailInvoiceClick(event) {
        event.preventDefault();

        var $modal = $('.bulk-email-invoice.modal');
        var $mailList = $modal.find('.email-list');
        var selectedInvoices = [];

        $this.find('tbody input:checkbox:checked').each(function (index, checkbox) {
            var rowData = $(checkbox).parents('tr').data();
            selectedInvoices.push(rowData);
        });

        // Sort selected invoices by date (descending).
        selectedInvoices.sort(function (invoice1, invoice2) {
            return invoice1.invoiceDate - invoice2.invoiceDate;
        }).reverse();

        if (selectedInvoices.length) {
            $mailList.empty();

            var url = jse.core.config.get('appUrl') + '/admin/admin.php';
            var _data = {
                do: 'InvoicesModalsAjax/GetEmailInvoiceInformation',
                pageToken: jse.core.config.get('pageToken'),
                o: [].concat(_toConsumableArray(new Set(selectedInvoices.map(function (invoice) {
                    return invoice.orderId;
                })))) // Unique orders number array.
            };

            $.ajax({
                url: url,
                data: _data,
                dataType: 'json'
            }).done(function (response) {
                selectedInvoices.forEach(function (invoice) {
                    return $mailList.append(_generateMailRowMarkup(invoice, response));
                });
            });

            $modal.modal('show');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Bind table row actions.
        $this.on('click', 'tbody tr', _onTableRowClick).on('change', '.bulk-selection', _onBulkSelectionChange).on('change', 'input:checkbox', _onTableRowCheckboxChange).on('click', '.email-invoice', _onEmailInvoiceClick).on('click', '.cancellation-invoice', _onCancellationInvoiceClick);

        // Bind table row and bulk actions.
        $this.parents('.invoices').on('click', '.order-status, .btn-group .change-status', _onChangeOrderStatusClick).on('click', '.btn-group .bulk-download-invoice', _onBulkDownloadInvoiceClick).on('click', '.btn-group .bulk-cancellation-invoice', _onBulkCancellationInvoiceClick).on('click', '.btn-group .bulk-email-invoice', _onBulkEmailInvoiceClick);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL292ZXJ2aWV3L2V2ZW50cy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRzcGlubmVyIiwiX29uQnVsa1NlbGVjdGlvbkNoYW5nZSIsImV2ZW50IiwicHJvcGFnYXRlIiwiZmluZCIsInNpbmdsZV9jaGVja2JveCIsInByb3AiLCJ0cmlnZ2VyIiwiX29uVGFibGVSb3dDbGljayIsInRhcmdldCIsImlzIiwiX29uVGFibGVSb3dDaGVja2JveENoYW5nZSIsImxlbmd0aCIsInBhcmVudHMiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiX2dldFNlbGVjdGVkSW52b2ljZXNEYXRhIiwiJHRhcmdldCIsImRhdGFLZXkiLCJzZWxlY3RlZEludm9pY2VzIiwiZWFjaCIsImluZGV4IiwiY2hlY2tib3giLCJwdXNoIiwicm93SWQiLCJfb25DaGFuZ2VPcmRlclN0YXR1c0NsaWNrIiwiaGFzQ2xhc3MiLCJzdG9wUHJvcGFnYXRpb24iLCIkbW9kYWwiLCJyb3dEYXRhIiwic2VsZWN0ZWRPcmRlcnMiLCJmaWx0ZXIiLCJvcmRlcklkIiwidGl0bGUiLCJqc2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIm1lc3NhZ2UiLCJsaWJzIiwibW9kYWwiLCJzaG93TWVzc2FnZSIsInZhbCIsInN0YXR1c0lkIiwiYXR0ciIsInRleHQiLCJBcnJheSIsImZyb20iLCJTZXQiLCJqb2luIiwiX29wZW5CdWxrUGRmVXJsIiwiaW52b2ljZUlkcyIsInBhcmFtZXRlcnMiLCJkbyIsInBhZ2VUb2tlbiIsImNvbmZpZyIsImdldCIsImkiLCJ1cmwiLCJwYXJhbSIsIndpbmRvdyIsIm9wZW4iLCJsb2FkaW5nX3NwaW5uZXIiLCJoaWRlIiwiX2NyZWF0ZUJ1bGtQZGYiLCJ6SW5kZXgiLCJjc3MiLCJzaG93IiwiX29uQnVsa0Rvd25sb2FkSW52b2ljZUNsaWNrIiwibWF4QW1vdW50SW52b2ljZXNCdWxrUGRmIiwiJGludm9pY2VNZXNzYWdlQ29udGFpbmVyIiwib24iLCJfb25TaW5nbGVDaGVja2JveFJlYWR5IiwiZm9yRWFjaCIsImlkIiwiX29uQ2FuY2VsbGF0aW9uSW52b2ljZUNsaWNrIiwiaW52b2ljZXMiLCJpbnZvaWNlSWQiLCJpbnZvaWNlTnVtYmVyIiwiaXNDYW5jZWxsYXRpb25JbnZvaWNlIiwicmVwbGFjZSIsIm1hcCIsImludm9pY2UiLCJidXR0b25zIiwiY2FsbGJhY2siLCJjdXJyZW50VGFyZ2V0IiwicG9wIiwiRGF0YVRhYmxlIiwiYWpheCIsInJlbG9hZCIsIm9mZiIsIl9vbkJ1bGtDYW5jZWxsYXRpb25JbnZvaWNlQ2xpY2siLCJyZXF1ZXN0cyIsIndoZW4iLCJkb25lIiwicmVzcG9uc2VzIiwiY2FuY2VsbGF0aW9uSW52b2ljZUlkcyIsIkpTT04iLCJwYXJzZSIsInJlc3BvbnNlIiwiX29uRW1haWxJbnZvaWNlQ2xpY2siLCJvIiwiZGF0YVR5cGUiLCJkYXRlRm9ybWF0IiwiZGF0ZV9mb3JtYXRzIiwic3ViamVjdCIsIm1vbWVudCIsImludm9pY2VEYXRlIiwiZGF0ZSIsImZvcm1hdCIsImN1c3RvbWVySW5mbyIsImN1c3RvbWVyTmFtZSIsImVtYWlscyIsIl9nZW5lcmF0ZU1haWxSb3dNYXJrdXAiLCJlbWFpbEluZm9ybWF0aW9uIiwiJHJvdyIsImNsYXNzIiwiJGlkQ29sdW1uIiwiJGRhdGVDb2x1bW4iLCIkZW1haWxDb2x1bW4iLCIkaWRMYWJlbCIsImh0bWwiLCIkZGF0ZUxhYmVsIiwiJGVtYWlsSW5wdXQiLCJ0eXBlIiwidmFsdWUiLCJhcHBlbmRUbyIsImFwcGVuZCIsIl9vbkJ1bGtFbWFpbEludm9pY2VDbGljayIsInByZXZlbnREZWZhdWx0IiwiJG1haWxMaXN0Iiwic29ydCIsImludm9pY2UxIiwiaW52b2ljZTIiLCJyZXZlcnNlIiwiZW1wdHkiLCJpbml0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxN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LEVBQzZEOUMseUJBRDdELEVBRUs4QyxFQUZMLENBRVEsT0FGUixFQUVpQixtQ0FGakIsRUFFc0RILDJCQUZ0RCxFQUdLRyxFQUhMLENBR1EsT0FIUixFQUdpQix1Q0FIakIsRUFHMERvQiwrQkFIMUQsRUFJS3BCLEVBSkwsQ0FJUSxPQUpSLEVBSWlCLGdDQUpqQixFQUltRHlELHdCQUpuRDs7QUFNQWxDO0FBQ0gsS0FqQkQ7O0FBbUJBLFdBQU9sRyxNQUFQO0FBQ0gsQ0E5ZUQiLCJmaWxlIjoiaW52b2ljZXMvb3ZlcnZpZXcvZXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBldmVudHMuanMgMjAyMS0wNy0wOFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjEgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogTWFpbiBUYWJsZSBFdmVudHNcbiAqXG4gKiBIYW5kbGVzIHRoZSBldmVudHMgb2YgdGhlIG1haW4gaW52b2ljZXMgdGFibGUuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnZXZlbnRzJywgWydsb2FkaW5nX3NwaW5uZXInXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIExvYWRpbmcgc3Bpbm5lciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl8bnVsbH1cbiAgICAgKi9cbiAgICBsZXQgJHNwaW5uZXIgPSBudWxsO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBPbiBCdWxrIFNlbGVjdGlvbiBDaGFuZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gcHJvcGFnYXRlIFdoZXRoZXIgdG8gYWZmZWN0IHRoZSBib2R5IGVsZW1lbnRzLiBXZSBkbyBub3QgbmVlZCB0aGlzIG9uIFwiZHJhdy5kdFwiIGV2ZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UoZXZlbnQsIHByb3BhZ2F0ZSA9IHRydWUpIHtcbiAgICAgICAgaWYgKHByb3BhZ2F0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gRG8gbm90IHByb3BhZ2F0ZSBvbiBkcmF3IGV2ZW50IGJlY2F1c2UgdGhlIGJvZHkgY2hlY2tib3hlcyBhcmUgdW5jaGVja2VkIGJ5IGRlZmF1bHQuXG4gICAgICAgIH1cblxuICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBpbnB1dDpjaGVja2JveCcpLnNpbmdsZV9jaGVja2JveCgnY2hlY2tlZCcsICQodGhpcykucHJvcCgnY2hlY2tlZCcpKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBUYWJsZSBSb3cgQ2xpY2tcbiAgICAgKlxuICAgICAqIFdoZW4gYSByb3cgaXMgY2xpY2tlZCB0aGVuIHRoZSByb3ctY2hlY2tib3ggbXVzdCBiZSB0b2dnbGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uVGFibGVSb3dDbGljayhldmVudCkge1xuICAgICAgICBpZiAoISQoZXZlbnQudGFyZ2V0KS5pcygndGQnKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCh0aGlzKS5maW5kKCdpbnB1dDpjaGVja2JveCcpXG4gICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsICEkKHRoaXMpLmZpbmQoJ2lucHV0OmNoZWNrYm94JykucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIFRhYmxlIFJvdyBDaGVja2JveCBDaGFuZ2VcbiAgICAgKlxuICAgICAqIEFkanVzdCB0aGUgYnVsayBhY3Rpb25zIHN0YXRlIHdoZW5ldmVyIHRoZXJlIGFyZSBjaGFuZ2VzIGluIHRoZSB0YWJsZSBjaGVja2JveGVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UoKSB7XG4gICAgICAgIGlmICgkdGhpcy5maW5kKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJHRoaXMucGFyZW50cygnLmludm9pY2VzJykuZmluZCgnLmJ1bGstYWN0aW9uID4gYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdGhpcy5wYXJlbnRzKCcuaW52b2ljZXMnKS5maW5kKCcuYnVsay1hY3Rpb24gPiBidXR0b24nKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbGxlY3RzIHRoZSByZXF1aXJlZCBkYXRhIG9mIHRoZSBzZWxlY3RlZCBpbnZvaWNlcyBpbiBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0IFRhcmdldCBlbGVtZW50IHdoaWNoIHRyaWdnZXJlZCB0aGUgZGF0YSBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7KltdfSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByZXF1ZXN0ZWQgaW52b2ljZSBkYXRhLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRTZWxlY3RlZEludm9pY2VzRGF0YSgkdGFyZ2V0LCBkYXRhS2V5KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSW52b2ljZXMgPSBbXTtcblxuICAgICAgICBpZiAoJHRhcmdldC5wYXJlbnRzKCcuYnVsay1hY3Rpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBGZXRjaCB0aGUgc2VsZWN0ZWQgb3JkZXIgSURzLlxuICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goKGluZGV4LCBjaGVja2JveCkgPT5cbiAgICAgICAgICAgICAgICBzZWxlY3RlZEludm9pY2VzLnB1c2goJChjaGVja2JveCkucGFyZW50cygndHInKS5kYXRhKGRhdGFLZXkpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByb3dJZCA9ICR0YXJnZXQucGFyZW50cygndHInKS5kYXRhKGRhdGFLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIXJvd0lkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBObyBpbnZvaWNlIElEIHdhcyBmb3VuZC5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZWN0ZWRJbnZvaWNlcy5wdXNoKHJvd0lkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWxlY3RlZEludm9pY2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIENoYW5nZSBPcmRlciBTdGF0dXMgQ2xpY2tcbiAgICAgKlxuICAgICAqIERpc3BsYXkgdGhlIGNoYW5nZSBvcmRlciBzdGF0dXMgbW9kYWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25DaGFuZ2VPcmRlclN0YXR1c0NsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaGFzQ2xhc3MoJ29yZGVyLXN0YXR1cycpKSB7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5zdGF0dXMubW9kYWwnKTtcbiAgICAgICAgY29uc3Qgcm93RGF0YSA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkT3JkZXJzID0gX2dldFNlbGVjdGVkSW52b2ljZXNEYXRhKCQodGhpcyksICdvcmRlcklkJykuZmlsdGVyKG9yZGVySWQgPT4gb3JkZXJJZCAhPT0gMCk7XG5cbiAgICAgICAgaWYgKCFzZWxlY3RlZE9yZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0hFQURJTkdfR01fU1RBVFVTJywgJ29yZGVycycpO1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdOT19SRUNPUkRTX0VSUk9SJywgJ29yZGVycycpO1xuICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJG1vZGFsLmZpbmQoJyNzdGF0dXMtZHJvcGRvd24nKS52YWwoKHJvd0RhdGEpID8gcm93RGF0YS5zdGF0dXNJZCA6ICcnKTtcbiAgICAgICAgJG1vZGFsLmZpbmQoJyNjb21tZW50JykudmFsKCcnKTtcbiAgICAgICAgJG1vZGFsLmZpbmQoJyNub3RpZnktY3VzdG9tZXIsICNzZW5kLXBhcmNlbC10cmFja2luZy1jb2RlLCAjc2VuZC1jb21tZW50JylcbiAgICAgICAgICAgIC5hdHRyKCdjaGVja2VkJywgZmFsc2UpXG4gICAgICAgICAgICAucGFyZW50cygnLnNpbmdsZS1jaGVja2JveCcpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcblxuICAgICAgICAvLyBTaG93IHRoZSBvcmRlciBjaGFuZ2Ugc3RhdHVzIG1vZGFsIChyZW1vdmUgZHVwbGljYXRlIGVudHJpZXMgZnJvbSBzZWxlY3RlZE9yZGVycykuXG4gICAgICAgICRtb2RhbC5maW5kKCcuc2VsZWN0ZWQtb3JkZXJzJykudGV4dChBcnJheS5mcm9tKG5ldyBTZXQoc2VsZWN0ZWRPcmRlcnMpKS5qb2luKCcsICcpKTtcbiAgICAgICAgJG1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT3BlbnMgdGhlIFVSTCB3aGljaCBwcm92aWRlIHRoZSBidWxrIFBERidzIGFzIGRvd25sb2FkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJbXX0gaW52b2ljZUlkcyBUaGUgaW52b2ljZXMgdG8gYmUgY29uY2F0ZW5hdGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vcGVuQnVsa1BkZlVybChpbnZvaWNlSWRzKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICBkbzogJ0ludm9pY2VzTW9kYWxzQWpheC9CdWxrUGRmSW52b2ljZXMnLFxuICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKSxcbiAgICAgICAgICAgIGk6IGludm9pY2VJZHNcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwPycgKyAkLnBhcmFtKHBhcmFtZXRlcnMpO1xuXG4gICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19wYXJlbnQnKTtcblxuICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGJ1bGsgUERGIHdpdGggaW52b2ljZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcltdfSBpbnZvaWNlSWRzIFRoZSBpbnZvaWNlcyB0byBiZSBjb25jYXRlbmF0ZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2NyZWF0ZUJ1bGtQZGYoaW52b2ljZUlkcykge1xuICAgICAgICBjb25zdCB6SW5kZXggPSAkKCcudGFibGUtZml4ZWQtaGVhZGVyIHRoZWFkLmZpeGVkJykuY3NzKCd6LWluZGV4Jyk7IC8vIENvdWxkIGJlIFwidW5kZWZpbmVkXCIgYXMgd2VsbC5cbiAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcywgekluZGV4KTtcbiAgICAgICAgX29wZW5CdWxrUGRmVXJsKGludm9pY2VJZHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9wZW5zIHRoZSBnbV9wZGZfb3JkZXIucGhwIGluIGEgbmV3IHRhYiB3aXRoIGludm9pY2VzIGFzIHR5cGUgJF9HRVQgYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBUaGUgb3JkZXIgaWRzIGFyZSBwYXNzZWQgYXMgYSBzZXJpYWxpemVkIGFycmF5IHRvIHRoZSBvSUQgJF9HRVQgYXJndW1lbnQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uQnVsa0Rvd25sb2FkSW52b2ljZUNsaWNrKCkge1xuICAgICAgICBjb25zdCBpbnZvaWNlSWRzID0gX2dldFNlbGVjdGVkSW52b2ljZXNEYXRhKCQodGhpcyksICdpbnZvaWNlSWQnKTtcblxuICAgICAgICBpZiAoaW52b2ljZUlkcy5sZW5ndGggPiBkYXRhLm1heEFtb3VudEludm9pY2VzQnVsa1BkZikge1xuICAgICAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmJ1bGstZXJyb3IubW9kYWwnKTtcbiAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICBjb25zdCAkaW52b2ljZU1lc3NhZ2VDb250YWluZXIgPSAkbW9kYWwuZmluZCgnLmludm9pY2VzLW1lc3NhZ2UnKTtcbiAgICAgICAgICAgICRpbnZvaWNlTWVzc2FnZUNvbnRhaW5lci5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkbW9kYWwub24oJ2hpZGUuYnMubW9kYWwnLCAoKSA9PiAkaW52b2ljZU1lc3NhZ2VDb250YWluZXIuYWRkQ2xhc3MoJ2hpZGRlbicpKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX2NyZWF0ZUJ1bGtQZGYoaW52b2ljZUlkcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gU2luZ2xlIENoZWNrYm94IFJlYWR5XG4gICAgICpcbiAgICAgKiBUaGlzIGNhbGxiYWNrIHdpbGwgdXNlIHRoZSBldmVudC5kYXRhLmludm9pY2VJZHMgdG8gc2V0IHRoZSBjaGVja2VkIGNoZWNrYm94ZXMgYWZ0ZXIgYSB0YWJsZSByZS1yZW5kZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25TaW5nbGVDaGVja2JveFJlYWR5KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LmRhdGEuaW52b2ljZUlkcy5mb3JFYWNoKGlkID0+IHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoYHRyIyR7aWR9IGlucHV0OmNoZWNrYm94YCkuc2luZ2xlX2NoZWNrYm94KCdjaGVja2VkJywgdHJ1ZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEJ1bGsgYWN0aW9uIGJ1dHRvbiBzaG91bGQndCBiZSBkaXNhYmxlZCBhZnRlciBhIGRhdGF0YWJsZSByZWxvYWQuXG4gICAgICAgIGlmICgkKCd0ciBpbnB1dDpjaGVja2JveDpjaGVja2VkJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkKCcuYnVsay1hY3Rpb24nKS5maW5kKCdidXR0b24nKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FuY2VsbGF0aW9uIEludm9pY2UgR2VuZXJhdGlvblxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCBjcmVhdGUgYSBuZXcgY2FuY2VsbGF0aW9uIGludm9pY2UgZm9yIHRoZSBzZWxlY3RlZCBpbnZvaWNlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25DYW5jZWxsYXRpb25JbnZvaWNlQ2xpY2soKSB7XG4gICAgICAgIGNvbnN0IGludm9pY2VzID0gW107XG5cbiAgICAgICAgY29uc3Qge2ludm9pY2VJZCwgaW52b2ljZU51bWJlciwgb3JkZXJJZCwgaXNDYW5jZWxsYXRpb25JbnZvaWNlfSA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG5cbiAgICAgICAgaWYgKGlzQ2FuY2VsbGF0aW9uSW52b2ljZSB8fCBvcmRlcklkID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbnZvaWNlcy5wdXNoKHtcbiAgICAgICAgICAgIGludm9pY2VJZCxcbiAgICAgICAgICAgIGludm9pY2VOdW1iZXIsXG4gICAgICAgICAgICBvcmRlcklkXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0hFQURJTkdfTU9EQUxfQ0FOQ0VMTEFUSU9OX0lOVk9JQ0UnLCAnb3JkZXJzJyk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9NT0RBTF9DQU5DRUxMQVRJT05fSU5WT0lDRScsICdvcmRlcnMnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJyVzJywgaW52b2ljZXMubWFwKGludm9pY2UgPT4gaW52b2ljZS5pbnZvaWNlTnVtYmVyKS5qb2luKCcsICcpKTtcbiAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZXZlbnQgPT4gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgneWVzJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52b2ljZSA9IGludm9pY2VzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBgZ21fcGRmX29yZGVyLnBocD9vSUQ9JHtpbnZvaWNlLm9yZGVySWR9JnR5cGU9aW52b2ljZWBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgYCZjYW5jZWxfaW52b2ljZV9pZD0ke2ludm9pY2UuaW52b2ljZUlkfWA7XG5cbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX2JsYW5rJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW52b2ljZUlkcyA9IGludm9pY2VzLm1hcChpbnZvaWNlID0+IGludm9pY2UuaW52b2ljZUlkKTtcblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vZmYoJ3NpbmdsZV9jaGVja2JveDpyZWFkeScsIF9vblNpbmdsZUNoZWNrYm94UmVhZHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdzaW5nbGVfY2hlY2tib3g6cmVhZHknLCB7aW52b2ljZUlkc30sIF9vblNpbmdsZUNoZWNrYm94UmVhZHkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5tb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWxrIENhbmNlbGxhdGlvbiBJbnZvaWNlIEdlbmVyYXRpb25cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgY3JlYXRlIGNhbmNlbGxhdGlvbiBpbnZvaWNlcyBmb3IgdGhlIHNlbGVjdGVkIGludm9pY2VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkJ1bGtDYW5jZWxsYXRpb25JbnZvaWNlQ2xpY2soKSB7XG4gICAgICAgIGNvbnN0IGludm9pY2VzID0gW107XG5cbiAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3Qge2ludm9pY2VJZCwgaW52b2ljZU51bWJlciwgb3JkZXJJZCwgaXNDYW5jZWxsYXRpb25JbnZvaWNlfSA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG5cbiAgICAgICAgICAgIGlmICghaXNDYW5jZWxsYXRpb25JbnZvaWNlICYmIG9yZGVySWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgaW52b2ljZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGludm9pY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJJZFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWludm9pY2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnSEVBRElOR19NT0RBTF9DQU5DRUxMQVRJT05fSU5WT0lDRScsICdvcmRlcnMnKTtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTk9fUkVDT1JEU19FUlJPUicsICdvcmRlcnMnKTtcbiAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0hFQURJTkdfTU9EQUxfQ0FOQ0VMTEFUSU9OX0lOVk9JQ0UnLCAnb3JkZXJzJyk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9NT0RBTF9DQU5DRUxMQVRJT05fSU5WT0lDRScsICdvcmRlcnMnKVxuICAgICAgICAgICAgLnJlcGxhY2UoJyVzJywgaW52b2ljZXMubWFwKGludm9pY2UgPT4gaW52b2ljZS5pbnZvaWNlTnVtYmVyKS5qb2luKCcsICcpKTtcbiAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZXZlbnQgPT4gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgneWVzJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyBjYW5jZWxsYXRpb24gaW52b2ljZXMgYW5kIHJlZnJlc2ggdGhlIHRhYmxlLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0cyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgIGludm9pY2VzLmZvckVhY2goaW52b2ljZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBgZ21fcGRmX29yZGVyLnBocD9vSUQ9JHtpbnZvaWNlLm9yZGVySWR9JnR5cGU9aW52b2ljZWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGAmY2FuY2VsX2ludm9pY2VfaWQ9JHtpbnZvaWNlLmludm9pY2VJZH0mYWpheD0xYDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdHMucHVzaCgkLmdldCh1cmwpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJC53aGVuKC4uLnJlcXVlc3RzKS5kb25lKCguLi5yZXNwb25zZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbmNlbGxhdGlvbkludm9pY2VJZHMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlcyA9IFtyZXNwb25zZXNdOyAvLyBBbHdheXMgdHJlYXQgdGhlIHJlc3BvbnNlcyBhcyBhbiBhcnJheS5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VzLmZvckVhY2gocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHtpbnZvaWNlSWR9ID0gSlNPTi5wYXJzZShyZXNwb25zZVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsbGF0aW9uSW52b2ljZUlkcy5wdXNoKGludm9pY2VJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgX2NyZWF0ZUJ1bGtQZGYoY2FuY2VsbGF0aW9uSW52b2ljZUlkcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGludm9pY2VJZHMgPSBpbnZvaWNlcy5tYXAoaW52b2ljZSA9PiBpbnZvaWNlLmludm9pY2VJZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub2ZmKCdzaW5nbGVfY2hlY2tib3g6cmVhZHknLCBfb25TaW5nbGVDaGVja2JveFJlYWR5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ3NpbmdsZV9jaGVja2JveDpyZWFkeScsIHtpbnZvaWNlSWRzfSwgX29uU2luZ2xlQ2hlY2tib3hSZWFkeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBFbWFpbCBJbnZvaWNlIENsaWNrXG4gICAgICpcbiAgICAgKiBEaXNwbGF5IHRoZSBlbWFpbC1pbnZvaWNlIG1vZGFsLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkVtYWlsSW52b2ljZUNsaWNrKCkge1xuICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcuZW1haWwtaW52b2ljZS5tb2RhbCcpO1xuICAgICAgICBjb25zdCByb3dEYXRhID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcbiAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocCc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBkbzogJ0ludm9pY2VzTW9kYWxzQWpheC9HZXRFbWFpbEludm9pY2VJbmZvcm1hdGlvbicsXG4gICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpLFxuICAgICAgICAgICAgbzogW3Jvd0RhdGEub3JkZXJJZF1cbiAgICAgICAgfTtcblxuICAgICAgICAkbW9kYWxcbiAgICAgICAgICAgIC5kYXRhKCdpbnZvaWNlSWQnLCByb3dEYXRhLmludm9pY2VJZClcbiAgICAgICAgICAgIC5kYXRhKCdvcmRlcklkJywgcm93RGF0YS5vcmRlcklkKVxuICAgICAgICAgICAgLm1vZGFsKCdzaG93Jyk7XG5cbiAgICAgICAgJC5hamF4KHt1cmwsIGRhdGEsIGRhdGFUeXBlOiAnanNvbid9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSByZXNwb25zZS5kYXRlX2Zvcm1hdHNbcm93RGF0YS5vcmRlcklkXTtcbiAgICAgICAgICAgIGNvbnN0IHN1YmplY3QgPSByZXNwb25zZS5zdWJqZWN0XG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ3tJTlZPSUNFX0lEfScsIHJvd0RhdGEuaW52b2ljZU51bWJlcilcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgne0RBVEV9JywgbW9tZW50KHJvd0RhdGEuaW52b2ljZURhdGUuZGF0ZSkuZm9ybWF0KGRhdGVGb3JtYXQpKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCd7T1JERVJfSUR9Jywgcm93RGF0YS5vcmRlcklkKTtcblxuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5zdWJqZWN0JykudmFsKHN1YmplY3QpO1xuXG4gICAgICAgICAgICBsZXQgY3VzdG9tZXJJbmZvID0gYFwiJHtyb3dEYXRhLmN1c3RvbWVyTmFtZX1cImA7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lbWFpbHNbcm93RGF0YS5vcmRlcklkXSkge1xuICAgICAgICAgICAgICAgIGN1c3RvbWVySW5mbyArPSBgIFwiJHtyZXNwb25zZS5lbWFpbHNbcm93RGF0YS5vcmRlcklkXX1cImA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuY3VzdG9tZXItaW5mbycpLnRleHQoY3VzdG9tZXJJbmZvKTtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuZW1haWwtYWRkcmVzcycpLnZhbChyZXNwb25zZS5lbWFpbHNbcm93RGF0YS5vcmRlcklkXSB8fCAnJyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlIGVtYWlsIHJvdyBtYXJrdXAuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyB1c2VkIGJ5IHRoZSBidWxrIGVtYWlsIG1vZGFsIGZvciBkeW5hbWljIGVtYWlsLXJvdyBnZW5lcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGludm9pY2UgQ29udGFpbnMgdGhlIHJlcXVpcmVkIHJvdyBkYXRhLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbWFpbEluZm9ybWF0aW9uIENvbnRhaW5zIHRoZSBzdWJqZWN0IGFuZCBlbWFpbCBhZGRyZXNzZXMgZm9yIHRoZSBpbnZvaWNlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0gUmV0dXJucyB0aGUgcm93IHNlbGVjdG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZW5lcmF0ZU1haWxSb3dNYXJrdXAoaW52b2ljZSwgZW1haWxJbmZvcm1hdGlvbikge1xuICAgICAgICBjb25zdCAkcm93ID0gJCgnPGRpdi8+Jywge2NsYXNzOiAnZm9ybS1ncm91cCBlbWFpbC1saXN0LWl0ZW0nfSk7XG4gICAgICAgIGNvbnN0ICRpZENvbHVtbiA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2NvbC1zbS0zJ30pO1xuICAgICAgICBjb25zdCAkZGF0ZUNvbHVtbiA9ICQoJzxkaXYvPicsIHtjbGFzczogJ2NvbC1zbS0zJ30pO1xuICAgICAgICBjb25zdCAkZW1haWxDb2x1bW4gPSAkKCc8ZGl2Lz4nLCB7Y2xhc3M6ICdjb2wtc20tNid9KTtcblxuICAgICAgICBjb25zdCAkaWRMYWJlbCA9ICQoJzxsYWJlbC8+Jywge1xuICAgICAgICAgICAgY2xhc3M6ICdjb250cm9sLWxhYmVsIGlkLWxhYmVsIGZvcmNlLXRleHQtY29sb3ItYmxhY2sgZm9yY2UtdGV4dC1ub3JtYWwtd2VpZ2h0JyxcbiAgICAgICAgICAgIGh0bWw6IGA8YSBocmVmPVwicmVxdWVzdF9wb3J0LnBocD9tb2R1bGU9T3JkZXJBZG1pbiZhY3Rpb249c2hvd1BkZiZ0eXBlPWludm9pY2VgXG4gICAgICAgICAgICAgICAgKyBgJmludm9pY2VfbnVtYmVyPSR7aW52b2ljZS5pbnZvaWNlTnVtYmVyfSZvcmRlcl9pZD0ke2ludm9pY2Uub3JkZXJJZH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5gXG4gICAgICAgICAgICAgICAgKyBgJHtpbnZvaWNlLmludm9pY2VOdW1iZXJ9PC9hPmBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpID09PSAnZGUnID8gJ0RELk1NLllZWVknIDogJ01NLkRELllZWVknO1xuICAgICAgICBjb25zdCAkZGF0ZUxhYmVsID0gJCgnPGxhYmVsLz4nLCB7XG4gICAgICAgICAgICBjbGFzczogJ2NvbnRyb2wtbGFiZWwgZGF0ZS1sYWJlbCBmb3JjZS10ZXh0LWNvbG9yLWJsYWNrIGZvcmNlLXRleHQtbm9ybWFsLXdlaWdodCcsXG4gICAgICAgICAgICB0ZXh0OiBtb21lbnQoaW52b2ljZS5pbnZvaWNlRGF0ZS5kYXRlKS5mb3JtYXQoZGF0ZUZvcm1hdClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgJGVtYWlsSW5wdXQgPSAkKCc8aW5wdXQvPicsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnZm9ybS1jb250cm9sIGVtYWlsLWlucHV0JyxcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIHZhbHVlOiBlbWFpbEluZm9ybWF0aW9uLmVtYWlsc1tpbnZvaWNlLm9yZGVySWRdXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRpZExhYmVsLmFwcGVuZFRvKCRpZENvbHVtbik7XG4gICAgICAgICRkYXRlTGFiZWwuYXBwZW5kVG8oJGRhdGVDb2x1bW4pO1xuICAgICAgICAkZW1haWxJbnB1dC5hcHBlbmRUbygkZW1haWxDb2x1bW4pO1xuXG4gICAgICAgICRyb3cuYXBwZW5kKFskaWRDb2x1bW4sICRkYXRlQ29sdW1uLCAkZW1haWxDb2x1bW5dKTtcbiAgICAgICAgJHJvdy5kYXRhKCdpbnZvaWNlJywgaW52b2ljZSk7XG5cbiAgICAgICAgcmV0dXJuICRyb3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnVsayBFbWFpbCBJbnZvaWNlIENsaWNrLlxuICAgICAqXG4gICAgICogU2VuZHMgZW1haWxzIHdpdGggdGhlIHNlbGVjdGVkIGludm9pY2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uQnVsa0VtYWlsSW52b2ljZUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmJ1bGstZW1haWwtaW52b2ljZS5tb2RhbCcpO1xuICAgICAgICBjb25zdCAkbWFpbExpc3QgPSAkbW9kYWwuZmluZCgnLmVtYWlsLWxpc3QnKTtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbnZvaWNlcyA9IFtdO1xuXG4gICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5IGlucHV0OmNoZWNrYm94OmNoZWNrZWQnKS5lYWNoKChpbmRleCwgY2hlY2tib3gpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0RhdGEgPSAkKGNoZWNrYm94KS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcbiAgICAgICAgICAgIHNlbGVjdGVkSW52b2ljZXMucHVzaChyb3dEYXRhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU29ydCBzZWxlY3RlZCBpbnZvaWNlcyBieSBkYXRlIChkZXNjZW5kaW5nKS5cbiAgICAgICAgc2VsZWN0ZWRJbnZvaWNlcy5zb3J0KChpbnZvaWNlMSwgaW52b2ljZTIpID0+IGludm9pY2UxLmludm9pY2VEYXRlIC0gaW52b2ljZTIuaW52b2ljZURhdGUpLnJldmVyc2UoKTtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRJbnZvaWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICRtYWlsTGlzdC5lbXB0eSgpO1xuXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwJztcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgZG86ICdJbnZvaWNlc01vZGFsc0FqYXgvR2V0RW1haWxJbnZvaWNlSW5mb3JtYXRpb24nLFxuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyksXG4gICAgICAgICAgICAgICAgbzogWy4uLm5ldyBTZXQoc2VsZWN0ZWRJbnZvaWNlcy5tYXAoaW52b2ljZSA9PiBpbnZvaWNlLm9yZGVySWQpKV0gLy8gVW5pcXVlIG9yZGVycyBudW1iZXIgYXJyYXkuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEludm9pY2VzLmZvckVhY2goaW52b2ljZSA9PiAkbWFpbExpc3QuYXBwZW5kKF9nZW5lcmF0ZU1haWxSb3dNYXJrdXAoaW52b2ljZSwgcmVzcG9uc2UpKSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJG1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAvLyBCaW5kIHRhYmxlIHJvdyBhY3Rpb25zLlxuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9uKCdjbGljaycsICd0Ym9keSB0cicsIF9vblRhYmxlUm93Q2xpY2spXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsICcuYnVsay1zZWxlY3Rpb24nLCBfb25CdWxrU2VsZWN0aW9uQ2hhbmdlKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnaW5wdXQ6Y2hlY2tib3gnLCBfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsICcuZW1haWwtaW52b2ljZScsIF9vbkVtYWlsSW52b2ljZUNsaWNrKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsICcuY2FuY2VsbGF0aW9uLWludm9pY2UnLCBfb25DYW5jZWxsYXRpb25JbnZvaWNlQ2xpY2spO1xuXG4gICAgICAgIC8vIEJpbmQgdGFibGUgcm93IGFuZCBidWxrIGFjdGlvbnMuXG4gICAgICAgICR0aGlzLnBhcmVudHMoJy5pbnZvaWNlcycpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5vcmRlci1zdGF0dXMsIC5idG4tZ3JvdXAgLmNoYW5nZS1zdGF0dXMnLCBfb25DaGFuZ2VPcmRlclN0YXR1c0NsaWNrKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYnRuLWdyb3VwIC5idWxrLWRvd25sb2FkLWludm9pY2UnLCBfb25CdWxrRG93bmxvYWRJbnZvaWNlQ2xpY2spXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4tZ3JvdXAgLmJ1bGstY2FuY2VsbGF0aW9uLWludm9pY2UnLCBfb25CdWxrQ2FuY2VsbGF0aW9uSW52b2ljZUNsaWNrKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYnRuLWdyb3VwIC5idWxrLWVtYWlsLWludm9pY2UnLCBfb25CdWxrRW1haWxJbnZvaWNlQ2xpY2spO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn0pO1xuIl19
