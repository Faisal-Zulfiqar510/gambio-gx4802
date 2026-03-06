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
        bindings: { subject: $this.find('.subject') }
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
     * Selector for the modal content body layer.
     *
     * @type {String}
     */
    var modalContentSelector = '.modal-content';

    /**
     * Request URL
     *
     * @type {String}
     */
    var requestUrl = jse.core.config.get('appUrl') + '/admin/gm_pdf_order.php';

    /**
     * Loading spinner instance.
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
     * @param {Boolean} doShow Show the loading spinner?
     */
    function _toggleSpinner(doShow) {
        if (doShow) {
            $spinner = jse.libs.loading_spinner.show($this.find(modalContentSelector), $this.css('z-index'));
        } else {
            jse.libs.loading_spinner.hide($spinner);
        }
    }

    /**
     * Parse subject and replace the placeholders with the variables.
     *
     * @param {Object} invoiceData Invoice data
     *
     * @return {String}
     */
    function _getParsedSubject(invoiceData) {
        var dateFormat = jse.core.config.get('languageCode') === 'de' ? 'DD.MM.YY' : 'MM.DD.YY';

        return module.bindings.subject.get().replace('{INVOICE_NUM}', invoiceData.invoiceNumber).replace('{INVOICE_DATE}', moment(invoiceData).format(dateFormat)).replace('{ORDER_ID}', invoiceData.orderId);
    }

    /**
     * Handles the successful delivery of all messages.
     */
    function _handleDeliverySuccess() {
        var message = jse.core.lang.translate('BULK_MAIL_SUCCESS', 'gm_send_order');

        // Show success message in the admin info box.
        jse.libs.info_box.addSuccessMessage(message);

        $('.invoices .table-main').DataTable().ajax.reload(null, false);
        $('.invoices .table-main').invoices_overview_filter('reload');

        // Hide modal and loading spinner.
        _toggleSpinner(false);
        $this.modal('hide');
        $sendButton.removeClass('disabled').prop('disabled', false);
    }

    /**
     * Handles the failure of the message delivery.
     */
    function _handleDeliveryFail() {
        var title = jse.core.lang.translate('error', 'messages');
        var message = jse.core.lang.translate('BULK_MAIL_UNSUCCESS', 'gm_send_order');

        // Show error message in a modal.
        jse.libs.modal.showMessage(title, message);

        // Hide modal and the loading spinner and re-enable the send button.
        _toggleSpinner(false);
        $this.modal('hide');
        $sendButton.removeClass('disabled').prop('disabled', false);
    }

    /**
     * Validate the form for empty fields.
     *
     * @return {Boolean}
     */
    function _validateForm() {
        $this.find('.has-error').removeClass('has-error');

        $this.find('input:text').each(function (index, input) {
            var $input = $(input);

            if ($input.val() === '') {
                $input.parents('.form-group').addClass('has-error');
            }
        });

        return !$this.find('.has-error').length;
    }

    /**
     * Send the modal data to the form through an AJAX call.
     */
    function _onSendClick(event) {
        if (!_validateForm()) {
            return;
        }

        // Collection of requests in promise format.
        var promises = [];

        // Email list item elements.
        var $emailListItems = $this.find(emailListItemSelector);

        // Abort and hide modal on empty email list entries.
        if (!$emailListItems.length) {
            $this.modal('hide');
            return;
        }

        $sendButton = $(event.target);
        $sendButton.addClass('disabled').prop('disabled', true);

        // Show loading spinner.
        _toggleSpinner(true);

        // Fill orders array with data.
        $emailListItems.each(function (index, element) {
            // Order data.
            var invoiceData = $(element).data('invoice');

            // Email address entered in input field.
            var enteredEmail = $(element).find(emailListItemEmailSelector).val();

            // Promise wrapper for AJAX requests.
            var promise = new Promise(function (resolve, reject) {
                // Request GET parameters to send.
                var getParameters = {
                    oID: invoiceData.orderId,
                    iID: invoiceData.invoiceId,
                    type: 'invoice',
                    mail: '1',
                    gm_quick_mail: '1',
                    preview: '1'
                };

                // Composed request URL.
                var url = requestUrl + '?' + $.param(getParameters);

                // Data to send.
                var data = {
                    gm_mail: enteredEmail,
                    gm_subject: _getParsedSubject(invoiceData)
                };

                $.ajax({ method: 'POST', url: url, data: data }).done(resolve).fail(reject);
            });

            // Add promise to array.
            promises.push(promise);
        });

        // Wait for all promise to respond and handle success/error.
        Promise.all(promises).then(_handleDeliverySuccess).catch(_handleDeliveryFail);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL21vZGFscy9idWxrX2VtYWlsX2ludm9pY2UuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJiaW5kaW5ncyIsInN1YmplY3QiLCJmaW5kIiwiZW1haWxMaXN0SXRlbVNlbGVjdG9yIiwiZW1haWxMaXN0SXRlbUVtYWlsU2VsZWN0b3IiLCJtb2RhbENvbnRlbnRTZWxlY3RvciIsInJlcXVlc3RVcmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiJHNwaW5uZXIiLCIkc2VuZEJ1dHRvbiIsIl90b2dnbGVTcGlubmVyIiwiZG9TaG93IiwibGlicyIsImxvYWRpbmdfc3Bpbm5lciIsInNob3ciLCJjc3MiLCJoaWRlIiwiX2dldFBhcnNlZFN1YmplY3QiLCJpbnZvaWNlRGF0YSIsImRhdGVGb3JtYXQiLCJyZXBsYWNlIiwiaW52b2ljZU51bWJlciIsIm1vbWVudCIsImZvcm1hdCIsIm9yZGVySWQiLCJfaGFuZGxlRGVsaXZlcnlTdWNjZXNzIiwibWVzc2FnZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiRGF0YVRhYmxlIiwiYWpheCIsInJlbG9hZCIsImludm9pY2VzX292ZXJ2aWV3X2ZpbHRlciIsIm1vZGFsIiwicmVtb3ZlQ2xhc3MiLCJwcm9wIiwiX2hhbmRsZURlbGl2ZXJ5RmFpbCIsInRpdGxlIiwic2hvd01lc3NhZ2UiLCJfdmFsaWRhdGVGb3JtIiwiZWFjaCIsImluZGV4IiwiaW5wdXQiLCIkaW5wdXQiLCJ2YWwiLCJwYXJlbnRzIiwiYWRkQ2xhc3MiLCJsZW5ndGgiLCJfb25TZW5kQ2xpY2siLCJldmVudCIsInByb21pc2VzIiwiJGVtYWlsTGlzdEl0ZW1zIiwidGFyZ2V0IiwiZWxlbWVudCIsImVudGVyZWRFbWFpbCIsInByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldFBhcmFtZXRlcnMiLCJvSUQiLCJpSUQiLCJpbnZvaWNlSWQiLCJ0eXBlIiwibWFpbCIsImdtX3F1aWNrX21haWwiLCJwcmV2aWV3IiwidXJsIiwicGFyYW0iLCJnbV9tYWlsIiwiZ21fc3ViamVjdCIsIm1ldGhvZCIsImRvbmUiLCJmYWlsIiwicHVzaCIsImFsbCIsInRoZW4iLCJjYXRjaCIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7QUFHQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQXNCLG9CQUF0QixFQUE0QyxDQUFDLE9BQUQsRUFBVSxpQkFBVixDQUE1QyxFQUEwRSxVQUFVQyxJQUFWLEVBQWdCOztBQUV0Rjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVM7QUFDWEksa0JBQVUsRUFBQ0MsU0FBU0gsTUFBTUksSUFBTixDQUFXLFVBQVgsQ0FBVjtBQURDLEtBQWY7O0FBSUE7Ozs7O0FBS0EsUUFBTUMsd0JBQXdCLGtCQUE5Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyw2QkFBNkIsY0FBbkM7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsdUJBQXVCLGdCQUE3Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxhQUFhQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLHlCQUFuRDs7QUFFQTs7Ozs7QUFLQSxRQUFJQyxXQUFXLElBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBSUMsY0FBYyxJQUFsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0MsY0FBVCxDQUF3QkMsTUFBeEIsRUFBZ0M7QUFDNUIsWUFBSUEsTUFBSixFQUFZO0FBQ1JILHVCQUFXSixJQUFJUSxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLElBQXpCLENBQThCbkIsTUFBTUksSUFBTixDQUFXRyxvQkFBWCxDQUE5QixFQUFnRVAsTUFBTW9CLEdBQU4sQ0FBVSxTQUFW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Z0YsSUFETCxDQUNVZixPQURWLEVBRUtnQixJQUZMLENBRVVmLE1BRlY7QUFHSCxhQXZCZSxDQUFoQjs7QUF5QkE7QUFDQVIscUJBQVN3QixJQUFULENBQWNuQixPQUFkO0FBQ0gsU0FuQ0Q7O0FBcUNBO0FBQ0FDLGdCQUFRbUIsR0FBUixDQUFZekIsUUFBWixFQUNLMEIsSUFETCxDQUNVckQsc0JBRFYsRUFFS3NELEtBRkwsQ0FFV3pDLG1CQUZYO0FBR0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBN0MsV0FBT3VGLElBQVAsR0FBYyxVQUFVTixJQUFWLEVBQWdCO0FBQzFCL0UsY0FBTXNGLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFdBQWxCLEVBQStCL0IsWUFBL0I7QUFDQXdCO0FBQ0gsS0FIRDs7QUFLQSxXQUFPakYsTUFBUDtBQUNILENBeE9EIiwiZmlsZSI6Imludm9pY2VzL21vZGFscy9idWxrX2VtYWlsX2ludm9pY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGJ1bGtfZW1haWxfaW52b2ljZS5qcyAyMDIxLTA0LTIyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBCdWxrIEVtYWlsIEludm9pY2UgTW9kYWwgQ29udHJvbGxlclxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ2J1bGtfZW1haWxfaW52b2ljZScsIFsnbW9kYWwnLCAnbG9hZGluZ19zcGlubmVyJ10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge1xuICAgICAgICBiaW5kaW5nczoge3N1YmplY3Q6ICR0aGlzLmZpbmQoJy5zdWJqZWN0Jyl9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNlbGVjdG9yIGZvciB0aGUgZW1haWwgbGlzdCBpdGVtLlxuICAgICAqXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBjb25zdCBlbWFpbExpc3RJdGVtU2VsZWN0b3IgPSAnLmVtYWlsLWxpc3QtaXRlbSc7XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RvciBmb3IgdGhlIGVtYWlsIGxpc3QgaXRlbSBJRC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgY29uc3QgZW1haWxMaXN0SXRlbUVtYWlsU2VsZWN0b3IgPSAnLmVtYWlsLWlucHV0JztcblxuICAgIC8qKlxuICAgICAqIFNlbGVjdG9yIGZvciB0aGUgbW9kYWwgY29udGVudCBib2R5IGxheWVyLlxuICAgICAqXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBjb25zdCBtb2RhbENvbnRlbnRTZWxlY3RvciA9ICcubW9kYWwtY29udGVudCc7XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IFVSTFxuICAgICAqXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBjb25zdCByZXF1ZXN0VXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2dtX3BkZl9vcmRlci5waHAnO1xuXG4gICAgLyoqXG4gICAgICogTG9hZGluZyBzcGlubmVyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeXxudWxsfVxuICAgICAqL1xuICAgIGxldCAkc3Bpbm5lciA9IG51bGw7XG4gICAgXG4gICAgLyoqXG4gICAgICogU2VuZCBidXR0b24gc2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl8bnVsbH1cbiAgICAgKi9cbiAgICBsZXQgJHNlbmRCdXR0b24gPSBudWxsO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBTaG93L2hpZGUgbG9hZGluZyBzcGlubmVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkb1Nob3cgU2hvdyB0aGUgbG9hZGluZyBzcGlubmVyP1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIF90b2dnbGVTcGlubmVyKGRvU2hvdykge1xuICAgICAgICBpZiAoZG9TaG93KSB7XG4gICAgICAgICAgICAkc3Bpbm5lciA9IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5zaG93KCR0aGlzLmZpbmQobW9kYWxDb250ZW50U2VsZWN0b3IpLCAkdGhpcy5jc3MoJ3otaW5kZXgnKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZSBzdWJqZWN0IGFuZCByZXBsYWNlIHRoZSBwbGFjZWhvbGRlcnMgd2l0aCB0aGUgdmFyaWFibGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGludm9pY2VEYXRhIEludm9pY2UgZGF0YVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRQYXJzZWRTdWJqZWN0KGludm9pY2VEYXRhKSB7XG4gICAgICAgIGNvbnN0IGRhdGVGb3JtYXQgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSA9PT0gJ2RlJyA/ICdERC5NTS5ZWScgOiAnTU0uREQuWVknO1xuXG4gICAgICAgIHJldHVybiBtb2R1bGUuYmluZGluZ3Muc3ViamVjdC5nZXQoKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tJTlZPSUNFX05VTX0nLCBpbnZvaWNlRGF0YS5pbnZvaWNlTnVtYmVyKVxuICAgICAgICAgICAgLnJlcGxhY2UoJ3tJTlZPSUNFX0RBVEV9JywgbW9tZW50KGludm9pY2VEYXRhKS5mb3JtYXQoZGF0ZUZvcm1hdCkpXG4gICAgICAgICAgICAucmVwbGFjZSgne09SREVSX0lEfScsIGludm9pY2VEYXRhLm9yZGVySWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgdGhlIHN1Y2Nlc3NmdWwgZGVsaXZlcnkgb2YgYWxsIG1lc3NhZ2VzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVEZWxpdmVyeVN1Y2Nlc3MoKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVMS19NQUlMX1NVQ0NFU1MnLCAnZ21fc2VuZF9vcmRlcicpO1xuXG4gICAgICAgIC8vIFNob3cgc3VjY2VzcyBtZXNzYWdlIGluIHRoZSBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgICAgJCgnLmludm9pY2VzIC50YWJsZS1tYWluJykuRGF0YVRhYmxlKCkuYWpheC5yZWxvYWQobnVsbCwgZmFsc2UpO1xuICAgICAgICAkKCcuaW52b2ljZXMgLnRhYmxlLW1haW4nKS5pbnZvaWNlc19vdmVydmlld19maWx0ZXIoJ3JlbG9hZCcpO1xuXG4gICAgICAgIC8vIEhpZGUgbW9kYWwgYW5kIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgX3RvZ2dsZVNwaW5uZXIoZmFsc2UpO1xuICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAkc2VuZEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHRoZSBmYWlsdXJlIG9mIHRoZSBtZXNzYWdlIGRlbGl2ZXJ5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVEZWxpdmVyeUZhaWwoKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVMS19NQUlMX1VOU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJyk7XG5cbiAgICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlIGluIGEgbW9kYWwuXG4gICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcblxuICAgICAgICAvLyBIaWRlIG1vZGFsIGFuZCB0aGUgbG9hZGluZyBzcGlubmVyIGFuZCByZS1lbmFibGUgdGhlIHNlbmQgYnV0dG9uLlxuICAgICAgICBfdG9nZ2xlU3Bpbm5lcihmYWxzZSk7XG4gICAgICAgICR0aGlzLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICRzZW5kQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlIHRoZSBmb3JtIGZvciBlbXB0eSBmaWVsZHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF92YWxpZGF0ZUZvcm0oKSB7XG4gICAgICAgICR0aGlzLmZpbmQoJy5oYXMtZXJyb3InKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG5cbiAgICAgICAgJHRoaXMuZmluZCgnaW5wdXQ6dGV4dCcpLmVhY2goKGluZGV4LCBpbnB1dCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJChpbnB1dCk7XG5cbiAgICAgICAgICAgIGlmICgkaW5wdXQudmFsKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgJGlucHV0LnBhcmVudHMoJy5mb3JtLWdyb3VwJykuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gISR0aGlzLmZpbmQoJy5oYXMtZXJyb3InKS5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZCB0aGUgbW9kYWwgZGF0YSB0byB0aGUgZm9ybSB0aHJvdWdoIGFuIEFKQVggY2FsbC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25TZW5kQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgaWYgKCFfdmFsaWRhdGVGb3JtKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbGxlY3Rpb24gb2YgcmVxdWVzdHMgaW4gcHJvbWlzZSBmb3JtYXQuXG4gICAgICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICAgICAgLy8gRW1haWwgbGlzdCBpdGVtIGVsZW1lbnRzLlxuICAgICAgICBjb25zdCAkZW1haWxMaXN0SXRlbXMgPSAkdGhpcy5maW5kKGVtYWlsTGlzdEl0ZW1TZWxlY3Rvcik7XG5cbiAgICAgICAgLy8gQWJvcnQgYW5kIGhpZGUgbW9kYWwgb24gZW1wdHkgZW1haWwgbGlzdCBlbnRyaWVzLlxuICAgICAgICBpZiAoISRlbWFpbExpc3RJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICR0aGlzLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkc2VuZEJ1dHRvbiA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgJHNlbmRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIFNob3cgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICBfdG9nZ2xlU3Bpbm5lcih0cnVlKTtcblxuICAgICAgICAvLyBGaWxsIG9yZGVycyBhcnJheSB3aXRoIGRhdGEuXG4gICAgICAgICRlbWFpbExpc3RJdGVtcy5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgLy8gT3JkZXIgZGF0YS5cbiAgICAgICAgICAgIGNvbnN0IGludm9pY2VEYXRhID0gJChlbGVtZW50KS5kYXRhKCdpbnZvaWNlJyk7XG5cbiAgICAgICAgICAgIC8vIEVtYWlsIGFkZHJlc3MgZW50ZXJlZCBpbiBpbnB1dCBmaWVsZC5cbiAgICAgICAgICAgIGNvbnN0IGVudGVyZWRFbWFpbCA9ICQoZWxlbWVudCkuZmluZChlbWFpbExpc3RJdGVtRW1haWxTZWxlY3RvcikudmFsKCk7XG5cbiAgICAgICAgICAgIC8vIFByb21pc2Ugd3JhcHBlciBmb3IgQUpBWCByZXF1ZXN0cy5cbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUmVxdWVzdCBHRVQgcGFyYW1ldGVycyB0byBzZW5kLlxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9JRDogaW52b2ljZURhdGEub3JkZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgaUlEOiBpbnZvaWNlRGF0YS5pbnZvaWNlSWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbnZvaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgbWFpbDogJzEnLFxuICAgICAgICAgICAgICAgICAgICBnbV9xdWlja19tYWlsOiAnMScsXG4gICAgICAgICAgICAgICAgICAgIHByZXZpZXc6ICcxJ1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBDb21wb3NlZCByZXF1ZXN0IFVSTC5cbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSByZXF1ZXN0VXJsICsgJz8nICsgJC5wYXJhbShnZXRQYXJhbWV0ZXJzKTtcblxuICAgICAgICAgICAgICAgIC8vIERhdGEgdG8gc2VuZC5cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBnbV9tYWlsOiBlbnRlcmVkRW1haWwsXG4gICAgICAgICAgICAgICAgICAgIGdtX3N1YmplY3Q6IF9nZXRQYXJzZWRTdWJqZWN0KGludm9pY2VEYXRhKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe21ldGhvZDogJ1BPU1QnLCB1cmwsIGRhdGF9KVxuICAgICAgICAgICAgICAgICAgICAuZG9uZShyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgICAuZmFpbChyZWplY3QpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBwcm9taXNlIHRvIGFycmF5LlxuICAgICAgICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gV2FpdCBmb3IgYWxsIHByb21pc2UgdG8gcmVzcG9uZCBhbmQgaGFuZGxlIHN1Y2Nlc3MvZXJyb3IuXG4gICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgICAgICAgICAgLnRoZW4oX2hhbmRsZURlbGl2ZXJ5U3VjY2VzcylcbiAgICAgICAgICAgIC5jYXRjaChfaGFuZGxlRGVsaXZlcnlGYWlsKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLmJ0bi5zZW5kJywgX29uU2VuZENsaWNrKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7Il19
