'use strict';

/* --------------------------------------------------------------
 bulk_email_invoice.js 2021-04-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Bulk Email Invoice Modal Controller
 *
 * This controller handles the orders bulk invoice emails modal where the user can send emails for the
 * selected orders. The controller is able to create missing invoices if needed.
 */
gx.controllers.module('bulk_email_invoice', ['modal', 'loading_spinner'], function (data) {

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
    var module = {
        bindings: {
            subject: $this.find('.subject')
        }
    };

    /**
     * Selector for the email list item.
     *
     * @type {String}
     */
    var emailListItemSelector = '.email-list-item';

    /**
     * Selector for the email list item ID.
     *
     * @type {String}
     */
    var emailListItemEmailSelector = '.email-input';

    /**
     * Selector for the latest invoice number of the list item
     *
     * @type {string}
     */
    var latestInvoiceIdSelector = '.latest-invoice-id';

    /**
     * Selector for the option that indicates if missing invoices should be created
     *
     * @type {String}
     */
    var createMissingInvoicesSelector = '.create-missing-invoices';

    /**
     * Selector for the modal content body layer.
     *
     * @type {String}
     */
    var modalContentSelector = '.modal-content';

    /**
     * GM PDF Order URL
     *
     * @type {String}
     */
    var gmPdfOrderUrl = jse.core.config.get('appUrl') + '/admin/gm_pdf_order.php';

    /**
     * Admin Request URL
     *
     * @type {String}
     */
    var adminRequestUrl = jse.core.config.get('appUrl') + '/admin/admin.php';

    /**
     * Loading Spinner Selector
     *
     * @type {jQuery|null}
     */
    var $spinner = null;

    /**
     * Send button selector
     *
     * @type {jQuery|null}
     */
    var $sendButton = null;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Show/hide loading spinner.
     *
     * @param {Boolean} spinnerVisibility Whether to show or hide the spinner.
     */
    function _toggleSpinner(spinnerVisibility) {
        if (spinnerVisibility) {
            $spinner = jse.libs.loading_spinner.show($this.find(modalContentSelector), $this.css('z-index'));
        } else {
            jse.libs.loading_spinner.hide($spinner);
        }
    }

    /**
     * Parse subject and replace the placeholders with the variables.
     *
     * @param {Object} orderData Contains the order's data.
     * @param {Object} subjectData Contains the required subject's data.
     *
     * @return {String} Returns the final email subject string.
     */
    function _getParsedSubject(orderData, subjectData) {
        return module.bindings.subject.get().replace('{INVOICE_NUM}', subjectData.invoiceNumber).replace('{INVOICE_ID}', subjectData.invoiceNumber).replace('{INVOICE_DATE}', subjectData.invoiceDate).replace('{DATE}', subjectData.invoiceDate).replace('{ORDER_ID}', orderData.id);
    }

    /**
     * Handles the successful delivery of all messages.
     */
    function _handleDeliverySuccess() {
        var message = jse.core.lang.translate('BULK_MAIL_SUCCESS', 'gm_send_order');

        // Show success message in the admin info box.
        jse.libs.info_box.addSuccessMessage(message);

        $('.orders .table-main').DataTable().ajax.reload(null, false);
        $('.orders .table-main').orders_overview_filter('reload');

        // Hide modal and loading spinner.
        _toggleSpinner(false);
        $this.modal('hide');
        $sendButton.removeClass('disabled').prop('disabled', false);
    }

    /**
     * Handles the failure of the message delivery.
     */
    function _handleDeliveryFailure() {
        var title = jse.core.lang.translate('error', 'messages');
        var content = jse.core.lang.translate('BULK_MAIL_UNSUCCESS', 'gm_send_order');

        // Show error message in a modal.
        jse.libs.modal.message({ title: title, content: content });

        // Hide modal and the loading spinner and re-enable the send button.
        _toggleSpinner(false);
        $this.modal('hide');
        $sendButton.removeClass('disabled').prop('disabled', false);
    }

    /**
     * Get the IDs of the orders that do not have an invoice.
     *
     * @param {Number[]} orderIds The orders to be validated.
     *
     * @return {Promise}
     */
    function _getOrdersWithoutDocuments(orderIds) {
        return new Promise(function (resolve, reject) {
            var data = {
                do: 'OrdersOverviewAjax/GetOrdersWithoutDocuments',
                pageToken: jse.core.config.get('pageToken'),
                type: 'invoice',
                orderIds: orderIds
            };

            $.getJSON(adminRequestUrl, data).done(function (orderIdsWithoutDocument) {
                return resolve({ orderIds: orderIds, orderIdsWithoutDocument: orderIdsWithoutDocument });
            }).fail(reject);
        });
    }

    /**
     * Validate selected orders and generate/remove the orders without documents.
     *
     * @param {Object} selection Contains the "orderIds" and "orderIdsWithoutDocument" properties.
     *
     * @return {Promise} Returns the promises of the delegated methods.
     */
    function _handleMissingDocuments(selection) {
        // Indicates if missing invoices should be created
        var createMissingInvoices = $this.find(createMissingInvoicesSelector).prop('checked');

        if (createMissingInvoices) {
            return _createMissingDocuments(selection.orderIds, selection.orderIdsWithoutDocument);
        } else {
            return _removeOrderIdsWithoutDocument(selection.orderIds, selection.orderIdsWithoutDocument);
        }
    }

    /**
     * Create Missing Order Documents and set the new latest invoice id selector for which no invoice has yet existed.
     *
     * @param {Number[]} orderIds Selected order IDs.
     * @param {Number[]} orderIdsWithoutDocument Order IDs that do not have a document.
     *
     * @return {Promise} Returns a promise that will be resolved with all the order IDs.
     */
    function _createMissingDocuments(orderIds, orderIdsWithoutDocument) {
        return new Promise(function (resolve) {
            var _$;

            var requests = [];

            orderIdsWithoutDocument.forEach(function (id) {
                var url = gmPdfOrderUrl + ('?oID=' + id + '&type=invoice&ajax=1');
                var request = $.getJSON(url);

                request.done(function (response) {
                    $(emailListItemSelector).each(function (index, emailListItem) {
                        var $emailListItem = $(emailListItem);

                        if ($emailListItem.data('order').id === parseInt(id)) {
                            $emailListItem.find(latestInvoiceIdSelector).val(response.invoiceId);
                            return false;
                        }
                    });
                });

                requests.push(request);
            });

            return (_$ = $).when.apply(_$, requests).done(function () {
                return resolve(orderIds);
            });
        });
    }

    /**
     * Remove order IDs that do not have a document.
     *
     * @param {Number[]} orderIds Selected order IDs.
     * @param {Number[]} orderIdsWithoutDocument Order IDs that do not have a document.
     *
     * @return {Promise} Returns a promise that will be resolved with the orders that do have a document.
     */
    function _removeOrderIdsWithoutDocument(orderIds, orderIdsWithoutDocument) {
        return new Promise(function (resolve) {
            var orderIdsWithDocument = orderIds.filter(function (orderId) {
                return !orderIdsWithoutDocument.includes(String(orderId));
            });
            resolve(orderIdsWithDocument);
        });
    }

    /**
     * Send Invoice Emails
     *
     * @param {Number[]} orderIds Contains the IDs of the orders to be finally sent with an email.
     */
    function _sendInvoiceEmails(orderIds) {
        return new Promise(function (resolve, reject) {
            var _$2;

            var createMissingInvoices = $this.find(createMissingInvoicesSelector).prop('checked');
            var $emailListItems = $this.find(emailListItemSelector);

            // Abort and hide modal on empty email list entries.
            if (!$emailListItems.length || !orderIds.length) {
                var title = jse.core.lang.translate('TITLE_INVOICE', 'gm_order_menu');
                var message = jse.core.lang.translate('NO_RECORDS_ERROR', 'orders');
                jse.libs.modal.showMessage(title, message);
                $this.modal('hide');
                $sendButton.removeClass('disabled').prop('disabled', false);
                return;
            }

            // Show loading spinner.
            _toggleSpinner(true);

            // Collection of requests in promise format.
            var requests = [];

            // Fill orders array with data.
            $emailListItems.each(function (index, emailListItem) {
                var orderData = $(emailListItem).data('order');

                if (!orderIds.includes(orderData.id)) {
                    return true; // Current order does not have an invoice document.
                }

                // Email address entered in input field.
                var email = $(emailListItem).find(emailListItemEmailSelector).val();

                // The latest invoice id of the order
                var invoiceId = $(emailListItem).find(latestInvoiceIdSelector).val();

                // Request GET parameters to send.
                var parameters = {
                    oID: orderData.id,
                    type: 'invoice',
                    mail: '1',
                    bulk: '1',
                    gm_quick_mail: '1'
                };

                var url = gmPdfOrderUrl + '?' + $.param(parameters);
                var data = {
                    gm_mail: email,
                    gm_subject: module.bindings.subject.get(),
                    create_missing_invoices: Number(createMissingInvoices) // 1 or 0
                };

                if (invoiceId !== '0') {
                    data.invoice_ids = [invoiceId];
                }

                // Create AJAX request.
                requests.push($.ajax({ method: 'POST', url: url, data: data }));
            });

            (_$2 = $).when.apply(_$2, requests).done(resolve).fail(reject);
        });
    }

    /**
     * Send the invoice emails.
     *
     * This method will only send emails for the orders that do have an invoice document. If the
     * "create-missing-invoices" checkbox is active, new invoices will be generated for the orders that
     * are do not have one.
     */
    function _onSendClick(event) {
        var orderIds = [];

        $sendButton = $(event.target);
        $sendButton.addClass('disabled').prop('disabled', true);

        $this.find(emailListItemSelector).each(function (index, emailListItem) {
            orderIds.push($(emailListItem).data('order').id);
        });

        _getOrdersWithoutDocuments(orderIds).then(_handleMissingDocuments).then(_sendInvoiceEmails).then(_handleDeliverySuccess).catch(_handleDeliveryFailure);
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', '.btn.send', _onSendClick);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvYnVsa19lbWFpbF9pbnZvaWNlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiYmluZGluZ3MiLCJzdWJqZWN0IiwiZmluZCIsImVtYWlsTGlzdEl0ZW1TZWxlY3RvciIsImVtYWlsTGlzdEl0ZW1FbWFpbFNlbGVjdG9yIiwibGF0ZXN0SW52b2ljZUlkU2VsZWN0b3IiLCJjcmVhdGVNaXNzaW5nSW52b2ljZXNTZWxlY3RvciIsIm1vZGFsQ29udGVudFNlbGVjdG9yIiwiZ21QZGZPcmRlclVybCIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJhZG1pblJlcXVlc3RVcmwiLCIkc3Bpbm5lciIsIiRzZW5kQnV0dG9uIiwiX3RvZ2dsZVNwaW5uZXIiLCJzcGlubmVyVmlzaWJpbGl0eSIsImxpYnMiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwiY3NzIiwiaGlkZSIsIl9nZXRQYXJzZWRTdWJqZWN0Iiwib3JkZXJEYXRhIiwic3ViamVjdERhdGEiLCJyZXBsYWNlIiwiaW52b2ljZU51bWJlciIsImludm9pY2VEYXRlIiwiaWQiLCJfaGFuZGxlRGVsaXZlcnlTdWNjZXNzIiwibWVzc2FnZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiRGF0YVRhYmxlIiwiYWpheCIsInJlbG9hZCIsIm9yZGVyc19vdmVydmlld19maWx0ZXIiLCJtb2RhbCIsInJlbW92ZUNsYXNzIiwicHJvcCIsIl9oYW5kbGVEZWxpdmVyeUZhaWx1cmUiLCJ0aXRsZSIsImNvbnRlbnQiLCJfZ2V0T3JkZXJzV2l0aG91dERvY3VtZW50cyIsIm9yZGVySWRzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJkbyIsInBhZ2VUb2tlbiIsInR5cGUiLCJnZXRKU09OIiwiZG9uZSIsIm9yZGVySWRzV2l0aG91dERvY3VtZW50IiwiZmFpbCIsIl9oYW5kbGVNaXNzaW5nRG9jdW1lbnRzIiwic2VsZWN0aW9uIiwiY3JlYXRlTWlzc2luZ0ludm9pY2VzIiwiX2NyZWF0ZU1pc3NpbmdEb2N1bWVudHMiLCJfcmVtb3ZlT3JkZXJJZHNXaXRob3V0RG9jdW1lbnQiLCJyZXF1ZXN0cyIsImZvckVhY2giLCJ1cmwiLCJyZXF1ZXN0IiwiZWFjaCIsImluZGV4IiwiZW1haWxMaXN0SXRlbSIsIiRlbWFpbExpc3RJdGVtIiwicGFyc2VJbnQiLCJ2YWwiLCJyZXNwb25zZSIsImludm9pY2VJZCIsInB1c2giLCJ3aGVuIiwib3JkZXJJZHNXaXRoRG9jdW1lbnQiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsIlN0cmluZyIsIm9yZGVySWQiLCJfc2VuZEludm9pY2VFbWFpbHMiLCIkZW1haWxMaXN0SXRlbXMiLCJsZW5ndGgiLCJzaG93TWVzc2FnZSIsImVtYWlsIiwicGFyYW1ldGVycyIsIm9JRCIsIm1haWwiLCJidWxrIiwiZ21fcXVpY2tfbWFpbCIsInBhcmFtIiwiZ21fbWFpbCIsImdtX3N1YmplY3QiLCJjcmVhdGVfbWlzc2luZ19pbnZvaWNlcyIsIk51bWJlciIsImludm9pY2VfaWRzIiwibWV0aG9kIiwiX29uU2VuZENsaWNrIiwiZXZlbnQiLCJ0YXJnZXQiLCJhZGRDbGFzcyIsInRoZW4iLCJjYXRjaCIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFNQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQXNCLG9CQUF0QixFQUE0QyxDQUFDLE9BQUQsRUFBVSxpQkFBVixDQUE1QyxFQUEwRSxVQUFVQyxJQUFWLEVBQWdCOztBQUV0Rjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVM7QUFDWEksa0JBQVU7QUFDTkMscUJBQVNILE1BQU1JLElBQU4sQ0FBVyxVQUFYO0FBREg7QUFEQyxLQUFmOztBQU1BOzs7OztBQUtBLFFB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dEYsb0JBQVl1RixRQUFaLENBQXFCLFVBQXJCLEVBQWlDNUQsSUFBakMsQ0FBc0MsVUFBdEMsRUFBa0QsSUFBbEQ7O0FBRUE1QyxjQUFNSSxJQUFOLENBQVdDLHFCQUFYLEVBQWtDZ0UsSUFBbEMsQ0FBdUMsVUFBQ0MsS0FBRCxFQUFRQyxhQUFSLEVBQTBCO0FBQzdEdEIscUJBQVM0QixJQUFULENBQWM1RSxFQUFFc0UsYUFBRixFQUFpQnhFLElBQWpCLENBQXNCLE9BQXRCLEVBQStCZ0MsRUFBN0M7QUFDSCxTQUZEOztBQUlBaUIsbUNBQTJCQyxRQUEzQixFQUNLd0QsSUFETCxDQUNVN0MsdUJBRFYsRUFFSzZDLElBRkwsQ0FFVXJCLGtCQUZWLEVBR0txQixJQUhMLENBR1V6RSxzQkFIVixFQUlLMEUsS0FKTCxDQUlXN0Qsc0JBSlg7QUFLSDs7QUFHRDtBQUNBO0FBQ0E7O0FBRUEvQyxXQUFPNkcsSUFBUCxHQUFjLFVBQVVsRCxJQUFWLEVBQWdCO0FBQzFCekQsY0FBTTRHLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFdBQWxCLEVBQStCUCxZQUEvQjtBQUNBNUM7QUFDSCxLQUhEOztBQUtBLFdBQU8zRCxNQUFQO0FBQ0gsQ0EvVkQiLCJmaWxlIjoib3JkZXJzL21vZGFscy9idWxrX2VtYWlsX2ludm9pY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGJ1bGtfZW1haWxfaW52b2ljZS5qcyAyMDIxLTA0LTIyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBCdWxrIEVtYWlsIEludm9pY2UgTW9kYWwgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBoYW5kbGVzIHRoZSBvcmRlcnMgYnVsayBpbnZvaWNlIGVtYWlscyBtb2RhbCB3aGVyZSB0aGUgdXNlciBjYW4gc2VuZCBlbWFpbHMgZm9yIHRoZVxuICogc2VsZWN0ZWQgb3JkZXJzLiBUaGUgY29udHJvbGxlciBpcyBhYmxlIHRvIGNyZWF0ZSBtaXNzaW5nIGludm9pY2VzIGlmIG5lZWRlZC5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdidWxrX2VtYWlsX2ludm9pY2UnLCBbJ21vZGFsJywgJ2xvYWRpbmdfc3Bpbm5lciddLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHtcbiAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgIHN1YmplY3Q6ICR0aGlzLmZpbmQoJy5zdWJqZWN0JylcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RvciBmb3IgdGhlIGVtYWlsIGxpc3QgaXRlbS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgY29uc3QgZW1haWxMaXN0SXRlbVNlbGVjdG9yID0gJy5lbWFpbC1saXN0LWl0ZW0nO1xuXG4gICAgLyoqXG4gICAgICogU2VsZWN0b3IgZm9yIHRoZSBlbWFpbCBsaXN0IGl0ZW0gSUQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIGNvbnN0IGVtYWlsTGlzdEl0ZW1FbWFpbFNlbGVjdG9yID0gJy5lbWFpbC1pbnB1dCc7XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RvciBmb3IgdGhlIGxhdGVzdCBpbnZvaWNlIG51bWJlciBvZiB0aGUgbGlzdCBpdGVtXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGNvbnN0IGxhdGVzdEludm9pY2VJZFNlbGVjdG9yID0gJy5sYXRlc3QtaW52b2ljZS1pZCc7XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RvciBmb3IgdGhlIG9wdGlvbiB0aGF0IGluZGljYXRlcyBpZiBtaXNzaW5nIGludm9pY2VzIHNob3VsZCBiZSBjcmVhdGVkXG4gICAgICpcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIGNvbnN0IGNyZWF0ZU1pc3NpbmdJbnZvaWNlc1NlbGVjdG9yID0gJy5jcmVhdGUtbWlzc2luZy1pbnZvaWNlcyc7XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RvciBmb3IgdGhlIG1vZGFsIGNvbnRlbnQgYm9keSBsYXllci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgY29uc3QgbW9kYWxDb250ZW50U2VsZWN0b3IgPSAnLm1vZGFsLWNvbnRlbnQnO1xuXG4gICAgLyoqXG4gICAgICogR00gUERGIE9yZGVyIFVSTFxuICAgICAqXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBjb25zdCBnbVBkZk9yZGVyVXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2dtX3BkZl9vcmRlci5waHAnO1xuXG4gICAgLyoqXG4gICAgICogQWRtaW4gUmVxdWVzdCBVUkxcbiAgICAgKlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgY29uc3QgYWRtaW5SZXF1ZXN0VXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocCc7XG5cbiAgICAvKipcbiAgICAgKiBMb2FkaW5nIFNwaW5uZXIgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl8bnVsbH1cbiAgICAgKi9cbiAgICBsZXQgJHNwaW5uZXIgPSBudWxsO1xuICAgIFxuICAgIC8qKlxuICAgICAqIFNlbmQgYnV0dG9uIHNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fG51bGx9XG4gICAgICovXG4gICAgbGV0ICRzZW5kQnV0dG9uID0gbnVsbDtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogU2hvdy9oaWRlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3Bpbm5lclZpc2liaWxpdHkgV2hldGhlciB0byBzaG93IG9yIGhpZGUgdGhlIHNwaW5uZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3RvZ2dsZVNwaW5uZXIoc3Bpbm5lclZpc2liaWxpdHkpIHtcbiAgICAgICAgaWYgKHNwaW5uZXJWaXNpYmlsaXR5KSB7XG4gICAgICAgICAgICAkc3Bpbm5lciA9IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5zaG93KCR0aGlzLmZpbmQobW9kYWxDb250ZW50U2VsZWN0b3IpLCAkdGhpcy5jc3MoJ3otaW5kZXgnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBzdWJqZWN0IGFuZCByZXBsYWNlIHRoZSBwbGFjZWhvbGRlcnMgd2l0aCB0aGUgdmFyaWFibGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9yZGVyRGF0YSBDb250YWlucyB0aGUgb3JkZXIncyBkYXRhLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdWJqZWN0RGF0YSBDb250YWlucyB0aGUgcmVxdWlyZWQgc3ViamVjdCdzIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFJldHVybnMgdGhlIGZpbmFsIGVtYWlsIHN1YmplY3Qgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRQYXJzZWRTdWJqZWN0KG9yZGVyRGF0YSwgc3ViamVjdERhdGEpIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZS5iaW5kaW5ncy5zdWJqZWN0LmdldCgpXG4gICAgICAgICAgICAucmVwbGFjZSgne0lOVk9JQ0VfTlVNfScsIHN1YmplY3REYXRhLmludm9pY2VOdW1iZXIpXG4gICAgICAgICAgICAucmVwbGFjZSgne0lOVk9JQ0VfSUR9Jywgc3ViamVjdERhdGEuaW52b2ljZU51bWJlcilcbiAgICAgICAgICAgIC5yZXBsYWNlKCd7SU5WT0lDRV9EQVRFfScsIHN1YmplY3REYXRhLmludm9pY2VEYXRlKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tEQVRFfScsIHN1YmplY3REYXRhLmludm9pY2VEYXRlKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tPUkRFUl9JRH0nLCBvcmRlckRhdGEuaWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgdGhlIHN1Y2Nlc3NmdWwgZGVsaXZlcnkgb2YgYWxsIG1lc3NhZ2VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVEZWxpdmVyeVN1Y2Nlc3MoKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVMS19NQUlMX1NVQ0NFU1MnLCAnZ21fc2VuZF9vcmRlcicpO1xuXG4gICAgICAgIC8vIFNob3cgc3VjY2VzcyBtZXNzYWdlIGluIHRoZSBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKG51bGwsIGZhbHNlKTtcbiAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLm9yZGVyc19vdmVydmlld19maWx0ZXIoJ3JlbG9hZCcpO1xuXG4gICAgICAgIC8vIEhpZGUgbW9kYWwgYW5kIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgX3RvZ2dsZVNwaW5uZXIoZmFsc2UpO1xuICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAkc2VuZEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHRoZSBmYWlsdXJlIG9mIHRoZSBtZXNzYWdlIGRlbGl2ZXJ5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVEZWxpdmVyeUZhaWx1cmUoKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVMS19NQUlMX1VOU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJyk7XG5cbiAgICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlIGluIGEgbW9kYWwuXG4gICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe3RpdGxlLCBjb250ZW50fSk7XG5cbiAgICAgICAgLy8gSGlkZSBtb2RhbCBhbmQgdGhlIGxvYWRpbmcgc3Bpbm5lciBhbmQgcmUtZW5hYmxlIHRoZSBzZW5kIGJ1dHRvbi5cbiAgICAgICAgX3RvZ2dsZVNwaW5uZXIoZmFsc2UpO1xuICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAkc2VuZEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIElEcyBvZiB0aGUgb3JkZXJzIHRoYXQgZG8gbm90IGhhdmUgYW4gaW52b2ljZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyW119IG9yZGVySWRzIFRoZSBvcmRlcnMgdG8gYmUgdmFsaWRhdGVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0T3JkZXJzV2l0aG91dERvY3VtZW50cyhvcmRlcklkcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBkbzogJ09yZGVyc092ZXJ2aWV3QWpheC9HZXRPcmRlcnNXaXRob3V0RG9jdW1lbnRzJyxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdpbnZvaWNlJyxcbiAgICAgICAgICAgICAgICBvcmRlcklkc1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJC5nZXRKU09OKGFkbWluUmVxdWVzdFVybCwgZGF0YSlcbiAgICAgICAgICAgICAgICAuZG9uZShvcmRlcklkc1dpdGhvdXREb2N1bWVudCA9PiByZXNvbHZlKHtvcmRlcklkcywgb3JkZXJJZHNXaXRob3V0RG9jdW1lbnR9KSlcbiAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZSBzZWxlY3RlZCBvcmRlcnMgYW5kIGdlbmVyYXRlL3JlbW92ZSB0aGUgb3JkZXJzIHdpdGhvdXQgZG9jdW1lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNlbGVjdGlvbiBDb250YWlucyB0aGUgXCJvcmRlcklkc1wiIGFuZCBcIm9yZGVySWRzV2l0aG91dERvY3VtZW50XCIgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2V9IFJldHVybnMgdGhlIHByb21pc2VzIG9mIHRoZSBkZWxlZ2F0ZWQgbWV0aG9kcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlTWlzc2luZ0RvY3VtZW50cyhzZWxlY3Rpb24pIHtcbiAgICAgICAgLy8gSW5kaWNhdGVzIGlmIG1pc3NpbmcgaW52b2ljZXMgc2hvdWxkIGJlIGNyZWF0ZWRcbiAgICAgICAgY29uc3QgY3JlYXRlTWlzc2luZ0ludm9pY2VzID0gJHRoaXMuZmluZChjcmVhdGVNaXNzaW5nSW52b2ljZXNTZWxlY3RvcikucHJvcCgnY2hlY2tlZCcpO1xuXG4gICAgICAgIGlmIChjcmVhdGVNaXNzaW5nSW52b2ljZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBfY3JlYXRlTWlzc2luZ0RvY3VtZW50cyhzZWxlY3Rpb24ub3JkZXJJZHMsIHNlbGVjdGlvbi5vcmRlcklkc1dpdGhvdXREb2N1bWVudClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVtb3ZlT3JkZXJJZHNXaXRob3V0RG9jdW1lbnQoc2VsZWN0aW9uLm9yZGVySWRzLCBzZWxlY3Rpb24ub3JkZXJJZHNXaXRob3V0RG9jdW1lbnQpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgTWlzc2luZyBPcmRlciBEb2N1bWVudHMgYW5kIHNldCB0aGUgbmV3IGxhdGVzdCBpbnZvaWNlIGlkIHNlbGVjdG9yIGZvciB3aGljaCBubyBpbnZvaWNlIGhhcyB5ZXQgZXhpc3RlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyW119IG9yZGVySWRzIFNlbGVjdGVkIG9yZGVyIElEcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcltdfSBvcmRlcklkc1dpdGhvdXREb2N1bWVudCBPcmRlciBJRHMgdGhhdCBkbyBub3QgaGF2ZSBhIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdpdGggYWxsIHRoZSBvcmRlciBJRHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2NyZWF0ZU1pc3NpbmdEb2N1bWVudHMob3JkZXJJZHMsIG9yZGVySWRzV2l0aG91dERvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RzID0gW107XG5cbiAgICAgICAgICAgIG9yZGVySWRzV2l0aG91dERvY3VtZW50LmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGdtUGRmT3JkZXJVcmwgKyBgP29JRD0ke2lkfSZ0eXBlPWludm9pY2UmYWpheD0xYDtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gJC5nZXRKU09OKHVybCk7XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKGVtYWlsTGlzdEl0ZW1TZWxlY3RvcikuZWFjaCgoaW5kZXgsIGVtYWlsTGlzdEl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRlbWFpbExpc3RJdGVtID0gJChlbWFpbExpc3RJdGVtKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRlbWFpbExpc3RJdGVtLmRhdGEoJ29yZGVyJykuaWQgPT09IHBhcnNlSW50KGlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRlbWFpbExpc3RJdGVtLmZpbmQobGF0ZXN0SW52b2ljZUlkU2VsZWN0b3IpLnZhbChyZXNwb25zZS5pbnZvaWNlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiAkLndoZW4oLi4ucmVxdWVzdHMpLmRvbmUoKCkgPT4gcmVzb2x2ZShvcmRlcklkcykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgb3JkZXIgSURzIHRoYXQgZG8gbm90IGhhdmUgYSBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyW119IG9yZGVySWRzIFNlbGVjdGVkIG9yZGVyIElEcy5cbiAgICAgKiBAcGFyYW0ge051bWJlcltdfSBvcmRlcklkc1dpdGhvdXREb2N1bWVudCBPcmRlciBJRHMgdGhhdCBkbyBub3QgaGF2ZSBhIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZX0gUmV0dXJucyBhIHByb21pc2UgdGhhdCB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIG9yZGVycyB0aGF0IGRvIGhhdmUgYSBkb2N1bWVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVtb3ZlT3JkZXJJZHNXaXRob3V0RG9jdW1lbnQob3JkZXJJZHMsIG9yZGVySWRzV2l0aG91dERvY3VtZW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySWRzV2l0aERvY3VtZW50ID0gb3JkZXJJZHMuZmlsdGVyKG9yZGVySWQgPT4gIW9yZGVySWRzV2l0aG91dERvY3VtZW50LmluY2x1ZGVzKFN0cmluZyhvcmRlcklkKSkpO1xuICAgICAgICAgICAgcmVzb2x2ZShvcmRlcklkc1dpdGhEb2N1bWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmQgSW52b2ljZSBFbWFpbHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TnVtYmVyW119IG9yZGVySWRzIENvbnRhaW5zIHRoZSBJRHMgb2YgdGhlIG9yZGVycyB0byBiZSBmaW5hbGx5IHNlbnQgd2l0aCBhbiBlbWFpbC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfc2VuZEludm9pY2VFbWFpbHMob3JkZXJJZHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZU1pc3NpbmdJbnZvaWNlcyA9ICR0aGlzLmZpbmQoY3JlYXRlTWlzc2luZ0ludm9pY2VzU2VsZWN0b3IpLnByb3AoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIGNvbnN0ICRlbWFpbExpc3RJdGVtcyA9ICR0aGlzLmZpbmQoZW1haWxMaXN0SXRlbVNlbGVjdG9yKTtcblxuICAgICAgICAgICAgLy8gQWJvcnQgYW5kIGhpZGUgbW9kYWwgb24gZW1wdHkgZW1haWwgbGlzdCBlbnRyaWVzLlxuICAgICAgICAgICAgaWYgKCEkZW1haWxMaXN0SXRlbXMubGVuZ3RoIHx8ICFvcmRlcklkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUSVRMRV9JTlZPSUNFJywgJ2dtX29yZGVyX21lbnUnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ05PX1JFQ09SRFNfRVJST1InLCAnb3JkZXJzJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgJHNlbmRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaG93IGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgIF90b2dnbGVTcGlubmVyKHRydWUpO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0aW9uIG9mIHJlcXVlc3RzIGluIHByb21pc2UgZm9ybWF0LlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdHMgPSBbXTtcblxuICAgICAgICAgICAgLy8gRmlsbCBvcmRlcnMgYXJyYXkgd2l0aCBkYXRhLlxuICAgICAgICAgICAgJGVtYWlsTGlzdEl0ZW1zLmVhY2goKGluZGV4LCBlbWFpbExpc3RJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JkZXJEYXRhID0gJChlbWFpbExpc3RJdGVtKS5kYXRhKCdvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFvcmRlcklkcy5pbmNsdWRlcyhvcmRlckRhdGEuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBDdXJyZW50IG9yZGVyIGRvZXMgbm90IGhhdmUgYW4gaW52b2ljZSBkb2N1bWVudC5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBFbWFpbCBhZGRyZXNzIGVudGVyZWQgaW4gaW5wdXQgZmllbGQuXG4gICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSAkKGVtYWlsTGlzdEl0ZW0pLmZpbmQoZW1haWxMaXN0SXRlbUVtYWlsU2VsZWN0b3IpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gVGhlIGxhdGVzdCBpbnZvaWNlIGlkIG9mIHRoZSBvcmRlclxuICAgICAgICAgICAgICAgIGNvbnN0IGludm9pY2VJZCA9ICQoZW1haWxMaXN0SXRlbSkuZmluZChsYXRlc3RJbnZvaWNlSWRTZWxlY3RvcikudmFsKCk7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gUmVxdWVzdCBHRVQgcGFyYW1ldGVycyB0byBzZW5kLlxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9JRDogb3JkZXJEYXRhLmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgIG1haWw6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgYnVsazogJzEnLFxuICAgICAgICAgICAgICAgICAgICBnbV9xdWlja19tYWlsOiAnMSdcbiAgICAgICAgICAgICAgICB9O1xuICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGdtUGRmT3JkZXJVcmwgKyAnPycgKyAkLnBhcmFtKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGdtX21haWw6IGVtYWlsLFxuICAgICAgICAgICAgICAgICAgICBnbV9zdWJqZWN0OiBtb2R1bGUuYmluZGluZ3Muc3ViamVjdC5nZXQoKSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlX21pc3NpbmdfaW52b2ljZXM6IE51bWJlcihjcmVhdGVNaXNzaW5nSW52b2ljZXMpIC8vIDEgb3IgMFxuICAgICAgICAgICAgICAgIH07XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKGludm9pY2VJZCAhPT0gJzAnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaW52b2ljZV9pZHMgPSBbaW52b2ljZUlkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICAgICAgICByZXF1ZXN0cy5wdXNoKCQuYWpheCh7bWV0aG9kOiAnUE9TVCcsIHVybCwgZGF0YX0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLndoZW4oLi4ucmVxdWVzdHMpXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzb2x2ZSlcbiAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kIHRoZSBpbnZvaWNlIGVtYWlscy5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgb25seSBzZW5kIGVtYWlscyBmb3IgdGhlIG9yZGVycyB0aGF0IGRvIGhhdmUgYW4gaW52b2ljZSBkb2N1bWVudC4gSWYgdGhlXG4gICAgICogXCJjcmVhdGUtbWlzc2luZy1pbnZvaWNlc1wiIGNoZWNrYm94IGlzIGFjdGl2ZSwgbmV3IGludm9pY2VzIHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB0aGUgb3JkZXJzIHRoYXRcbiAgICAgKiBhcmUgZG8gbm90IGhhdmUgb25lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblNlbmRDbGljayhldmVudCkge1xuICAgICAgICBjb25zdCBvcmRlcklkcyA9IFtdO1xuICAgIFxuICAgICAgICAkc2VuZEJ1dHRvbiA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgJHNlbmRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgXG4gICAgICAgICR0aGlzLmZpbmQoZW1haWxMaXN0SXRlbVNlbGVjdG9yKS5lYWNoKChpbmRleCwgZW1haWxMaXN0SXRlbSkgPT4ge1xuICAgICAgICAgICAgb3JkZXJJZHMucHVzaCgkKGVtYWlsTGlzdEl0ZW0pLmRhdGEoJ29yZGVyJykuaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfZ2V0T3JkZXJzV2l0aG91dERvY3VtZW50cyhvcmRlcklkcylcbiAgICAgICAgICAgIC50aGVuKF9oYW5kbGVNaXNzaW5nRG9jdW1lbnRzKVxuICAgICAgICAgICAgLnRoZW4oX3NlbmRJbnZvaWNlRW1haWxzKVxuICAgICAgICAgICAgLnRoZW4oX2hhbmRsZURlbGl2ZXJ5U3VjY2VzcylcbiAgICAgICAgICAgIC5jYXRjaChfaGFuZGxlRGVsaXZlcnlGYWlsdXJlKTtcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICR0aGlzLm9uKCdjbGljaycsICcuYnRuLnNlbmQnLCBfb25TZW5kQ2xpY2spO1xuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59KTsiXX0=
