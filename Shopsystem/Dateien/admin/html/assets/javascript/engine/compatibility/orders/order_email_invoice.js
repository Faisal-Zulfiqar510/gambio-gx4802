'use strict';

/* --------------------------------------------------------------
 order_email_invoice.js 2021-05-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * This module handels the click event of the invoice email button
 *
 * @module Compatibility/order_email_invoice
 */
gx.compatibility.module('order_email_invoice', ['modal'],

/**  @lends module:Compatibility/order_email_invoice */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @var {object}
     */

    var $this = $(this);

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @var {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    /**
     * On Email Invoice Click
     *
     * Display the email-invoice modal.
     */
    function _onEmailInvoiceClick() {
        var $modal = $('.email-invoice.modal');
        var url = jse.core.config.get('appUrl') + '/admin/admin.php';
        var data = {
            id: options.id,
            do: 'OrdersModalsAjax/GetEmailInvoiceSubject',
            pageToken: jse.core.config.get('pageToken')
        };
        var invoiceNumbersHtml = '';

        $modal.find('.customer-info').text('"' + options.name + '"');
        $modal.find('.email-address').val(options.email);

        $modal.data('orderId', options.id).modal('show');

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

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', _onEmailInvoiceClick);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcl9lbWFpbF9pbnZvaWNlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfb25FbWFpbEludm9pY2VDbGljayIsIiRtb2RhbCIsInVybCIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJpZCIsImRvIiwicGFnZVRva2VuIiwiaW52b2ljZU51bWJlcnNIdG1sIiwiZmluZCIsInRleHQiLCJuYW1lIiwidmFsIiwiZW1haWwiLCJtb2RhbCIsImFqYXgiLCJkYXRhVHlwZSIsImRvbmUiLCJyZXNwb25zZSIsImF0dHIiLCJzdWJqZWN0IiwiaW52b2ljZUlkRXhpc3RzIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIk9iamVjdCIsImtleXMiLCJpbnZvaWNlTnVtYmVycyIsImxlbmd0aCIsImludm9pY2VJZCIsImh0bWwiLCJvbiIsIl9vbkNoYW5nZUVtYWlsSW52b2ljZUNoZWNrYm94Iiwid2lkZ2V0cyIsImluaXQiLCJwcm9wIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0kscUJBREosRUFHSSxDQUFDLE9BQUQsQ0FISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsYUFBU08sb0JBQVQsR0FBZ0M7QUFDNUIs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QTBCLFVBQTFCLEVBQXNDLElBQXRDO0FBQ0g7QUFDSixTQU5ELE1BTU87QUFDSG5DLG1CQUFPVSxJQUFQLENBQVksT0FBWixFQUFxQnlCLElBQXJCLENBQTBCLFVBQTFCLEVBQXNDLEtBQXRDO0FBQ0g7QUFDSjs7QUFHRDtBQUNBO0FBQ0E7O0FBRUEzQyxXQUFPMEMsSUFBUCxHQUFjLFVBQVVoQixJQUFWLEVBQWdCO0FBQzFCeEIsY0FBTXFDLEVBQU4sQ0FBUyxPQUFULEVBQWtCaEMsb0JBQWxCOztBQUVBbUI7QUFDSCxLQUpEOztBQU1BLFdBQU8xQixNQUFQO0FBQ0gsQ0FqSUwiLCJmaWxlIjoib3JkZXJzL29yZGVyX2VtYWlsX2ludm9pY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyX2VtYWlsX2ludm9pY2UuanMgMjAyMS0wNS0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjEgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogVGhpcyBtb2R1bGUgaGFuZGVscyB0aGUgY2xpY2sgZXZlbnQgb2YgdGhlIGludm9pY2UgZW1haWwgYnV0dG9uXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L29yZGVyX2VtYWlsX2ludm9pY2VcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ29yZGVyX2VtYWlsX2ludm9pY2UnLFxuXG4gICAgWydtb2RhbCddLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvb3JkZXJfZW1haWxfaW52b2ljZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBFbWFpbCBJbnZvaWNlIENsaWNrXG4gICAgICAgICAqXG4gICAgICAgICAqIERpc3BsYXkgdGhlIGVtYWlsLWludm9pY2UgbW9kYWwuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25FbWFpbEludm9pY2VDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5lbWFpbC1pbnZvaWNlLm1vZGFsJyk7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwJztcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IG9wdGlvbnMuaWQsXG4gICAgICAgICAgICAgICAgZG86ICdPcmRlcnNNb2RhbHNBamF4L0dldEVtYWlsSW52b2ljZVN1YmplY3QnLFxuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgaW52b2ljZU51bWJlcnNIdG1sID0gJyc7XG5cbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuY3VzdG9tZXItaW5mbycpLnRleHQoYFwiJHtvcHRpb25zLm5hbWV9XCJgKTtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuZW1haWwtYWRkcmVzcycpLnZhbChvcHRpb25zLmVtYWlsKTtcblxuICAgICAgICAgICAgJG1vZGFsXG4gICAgICAgICAgICAgICAgLmRhdGEoJ29yZGVySWQnLCBvcHRpb25zLmlkKVxuICAgICAgICAgICAgICAgIC5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe3VybCwgZGF0YSwgZGF0YVR5cGU6ICdqc29uJ30pLmRvbmUoKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgJG1vZGFsLmF0dHIoJ2RhdGEtZ3gtd2lkZ2V0JywgJ3NpbmdsZV9jaGVja2JveCcpO1xuXG4gICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5zdWJqZWN0JykudmFsKHJlc3BvbnNlLnN1YmplY3QpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcG9uc2UuaW52b2ljZUlkRXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuaW52b2ljZS1udW0taW5mbycpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5uby1pbnZvaWNlJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuaW52b2ljZS1udW0taW5mbycpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5uby1pbnZvaWNlJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXNwb25zZS5pbnZvaWNlTnVtYmVycykubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW52b2ljZUlkIGluIHJlc3BvbnNlLmludm9pY2VOdW1iZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9pY2VOdW1iZXJzSHRtbCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgJzxwPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiaW52b2ljZV9pZHNbXVwiIHZhbHVlPVwiJyArIGludm9pY2VJZFxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnXCIgY2hlY2tlZD1cImNoZWNrZWRcIiBjbGFzcz1cImludm9pY2UtbnVtYmVycy1jaGVja2JveFwiIC8+ICdcbiAgICAgICAgICAgICAgICAgICAgICAgICsgcmVzcG9uc2UuaW52b2ljZU51bWJlcnNbaW52b2ljZUlkXSArICc8L3A+JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmludm9pY2UtbnVtYmVycy1jaGVja2JveGVzJykuaHRtbChpbnZvaWNlTnVtYmVyc0h0bWwpO1xuXG4gICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMtY2hlY2tib3gnKS5vbignY2hhbmdlJywgX29uQ2hhbmdlRW1haWxJbnZvaWNlQ2hlY2tib3gpO1xuXG4gICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCRtb2RhbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBFbWFpbCBJbnZvaWNlIENoZWNrYm94IENoYW5nZVxuICAgICAgICAgKlxuICAgICAgICAgKiBEaXNhYmxlIHNlbmQgYnV0dG9uIGlmIGFsbCBpbnZvaWNlIG51bWJlciBjaGVja2JveGVzIGFyZSB1bmNoZWNrZWQuIE90aGVyd2lzZSBlbmFibGUgdGhlIHNlbmQgYnV0dG9uIGFnYWluLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ2hhbmdlRW1haWxJbnZvaWNlQ2hlY2tib3goKSB7XG4gICAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcuZW1haWwtaW52b2ljZS5tb2RhbCcpO1xuXG4gICAgICAgICAgICBpZiAoJG1vZGFsLmZpbmQoJy5pbnZvaWNlLW51bWJlcnMtY2hlY2tib3gnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcuaW52b2ljZS1udW1iZXJzLWNoZWNrYm94OmNoZWNrZWQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuc2VuZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuc2VuZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLnNlbmQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsIF9vbkVtYWlsSW52b2ljZUNsaWNrKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
