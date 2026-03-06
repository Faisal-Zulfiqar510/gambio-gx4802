'use strict';

/* --------------------------------------------------------------
 bulk_email_order.js 2021-04-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Bulk Email Order Modal Controller
 */
gx.controllers.module('bulk_email_order', [jse.source + '/vendor/momentjs/moment.min.js', 'modal', 'loading_spinner'], function (data) {

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
     * Placeholder map.
     * Used to replace the placeholder with the respective variables.
     *
     * Format: '{Placeholder}' : 'Attribute'
     *
     * @type {Object}
     */
    var placeholderMap = {
        '{ORDER_ID}': 'id',
        '{ORDER_DATE}': 'purchaseDate'
    };

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
     * @param {Object} orderData Order data.
     *
     * @return {String}
     */
    function _getParsedSubject(orderData) {
        // Subject.
        var subject = module.bindings.subject.get();

        // Iterate over the placeholders and replace the values.
        Object.keys(placeholderMap).forEach(function (placeholder) {
            return subject = subject.replace(placeholder, orderData[placeholderMap[placeholder]]);
        });

        return subject;
    }

    /**
     * Handles the successful delivery of all messages.
     */
    function _handleDeliverySuccess() {
        var message = jse.core.lang.translate('BULK_MAIL_SUCCESS', 'gm_send_order');

        // Show success message in the admin info box.
        jse.libs.info_box.addSuccessMessage(message);

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
        var content = jse.core.lang.translate('BULK_MAIL_UNSUCCESS', 'gm_send_order');

        // Show error message in a modal.
        jse.libs.modal.message({ title: title, content: content });

        // Hide modal and the loading spinner and reenable the send button.
        _toggleSpinner(false);
        $this.modal('hide');
        $sendButton.removeClass('disabled').prop('disabled', false);
    }

    /**
     * Send the modal data to the form through an AJAX call.
     */
    function _onSendClick(event) {
        // Send type.
        var REQUEST_SEND_TYPE = 'send_order';

        // Request base URL.
        var REQUEST_URL = jse.core.config.get('appUrl') + '/admin/gm_send_order.php';

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
            var orderData = $(element).data('order');

            // Format the purchase date.
            var dateFormat = jse.core.config.get('languageCode') === 'de' ? 'DD.MM.YY' : 'MM.DD.YY';
            orderData.purchaseDate = moment(orderData.purchaseDate.date).format(dateFormat);

            // Email address entered in input field.
            var enteredEmail = $(element).find(emailListItemEmailSelector).val();

            // Request GET parameters to send.
            var getParameters = {
                oID: orderData.id,
                type: REQUEST_SEND_TYPE
            };

            // Composed request URL.
            var url = REQUEST_URL + '?' + $.param(getParameters);

            // Data to send.
            var data = {
                gm_mail: enteredEmail,
                gm_subject: _getParsedSubject(orderData)
            };

            // Promise wrapper for AJAX response.
            var promise = new Promise(function (resolve, reject) {
                // Create AJAX request.
                var request = $.ajax({ method: 'POST', url: url, data: data });

                request.done(function () {
                    var orderId = getParameters.oID;
                    var $tableRow = $('tbody tr#' + orderId);

                    // Remove the e-mail symbol
                    $tableRow.find('td.actions i.tooltip-confirmation-not-sent').remove();
                });

                // Resolve promise on success.
                request.done(function (response) {
                    return resolve(response);
                });

                // Reject promise on fail.
                request.fail(function () {
                    return reject();
                });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvYnVsa19lbWFpbF9vcmRlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImJpbmRpbmdzIiwic3ViamVjdCIsImZpbmQiLCJlbWFpbExpc3RJdGVtU2VsZWN0b3IiLCJlbWFpbExpc3RJdGVtRW1haWxTZWxlY3RvciIsIm1vZGFsQ29udGVudFNlbGVjdG9yIiwicGxhY2Vob2xkZXJNYXAiLCIkc3Bpbm5lciIsIiRzZW5kQnV0dG9uIiwiX3RvZ2dsZVNwaW5uZXIiLCJkb1Nob3ciLCJsaWJzIiwibG9hZGluZ19zcGlubmVyIiwic2hvdyIsImNzcyIsImhpZGUiLCJfZ2V0UGFyc2VkU3ViamVjdCIsIm9yZGVyRGF0YSIsImdldCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwicmVwbGFjZSIsInBsYWNlaG9sZGVyIiwiX2hhbmRsZURlbGl2ZXJ5U3VjY2VzcyIsIm1lc3NhZ2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImluZm9fYm94IiwiYWRkU3VjY2Vzc01lc3NhZ2UiLCJtb2RhbCIsInJlbW92ZUNsYXNzIiwicHJvcCIsIl9oYW5kbGVEZWxpdmVyeUZhaWwiLCJ0aXRsZSIsImNvbnRlbnQiLCJfb25TZW5kQ2xpY2siLCJldmVudCIsIlJFUVVFU1RfU0VORF9UWVBFIiwiUkVRVUVTVF9VUkwiLCJjb25maWciLCJwcm9taXNlcyIsIiRlbWFpbExpc3RJdGVtcyIsImxlbmd0aCIsInRhcmdldCIsImFkZENsYXNzIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsImRhdGVGb3JtYXQiLCJwdXJjaGFzZURhdGUiLCJtb21lbnQiLCJkYXRlIiwiZm9ybWF0IiwiZW50ZXJlZEVtYWlsIiwidmFsIiwiZ2V0UGFyYW1ldGVycyIsIm9JRCIsImlkIiwidHlwZSIsInVybCIsInBhcmFtIiwiZ21fbWFpbCIsImdtX3N1YmplY3QiLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiYWpheCIsIm1ldGhvZCIsImRvbmUiLCJvcmRlcklkIiwiJHRhYmxlUm93IiwicmVtb3ZlIiwicmVzcG9uc2UiLCJmYWlsIiwicHVzaCIsImFsbCIsInRoZW4iLCJjYXRjaCIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7QUFHQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksa0JBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLHFDQUVJLE9BRkosRUFHSSxpQkFISixDQUhKLEVBU0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1MLFNBQVM7QUFDWE0sa0JBQVUsRUFBQ0MsU0FBU0gsTUFBTUksSUFBTixDQUFXLFVBQVgsQ0FBVjtBQURDLEtBQWY7O0FBSUE7Ozs7O0FBS0EsUUFBTUMsd0JBQXdCLGtCQUE5Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyw2QkFBNkIsY0FBbkM7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsdUJBQXVCLGdCQUE3Qjs7QUFFQTs7Ozs7Ozs7QUFRQSxRQUFNQyxpQkFBaUI7QUFDbkIsc0JBQWMsSUFESztBQUVuQix3QkFBZ0I7QUFGRyxLQUF2Qjs7QUFLQTs7Ozs7QUFLQSxRQUFJQyxXQUFXLElBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBSUMsY0FBYyxJQUFsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0MsY0FBVCxDQUF3QkMsTUFBeEIsRUFBZ0M7QUFDNUIsWUFBSUEsTUFBSixFQUFZO0FBQ1JILHVCQUFXWixJQUFJZ0IsSUFBSixDQUFTQyxlQUFULENBQXlCQyxJQUF6QixDQUE4QmYsTUFBTUksSUFBTixDQUFXRyxvQkFBWCxDQUE5QixFQUFnRVAsTUFBTWdCLEdBQU4sQ0FBVSxTQUFWLENBQWhFLENBQVg7QUFD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QUFDQUMsZ0JBQVFhLEdBQVIsQ0FBWXJDLFFBQVosRUFDS3NDLElBREwsQ0FDVXhELHNCQURWLEVBRUt5RCxLQUZMLENBRVcvQyxtQkFGWDtBQUdIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXhDLFdBQU93RixJQUFQLEdBQWMsVUFBVVYsSUFBVixFQUFnQjtBQUMxQjFFLGNBQU1xRixFQUFOLENBQVMsT0FBVCxFQUFrQixXQUFsQixFQUErQjlDLFlBQS9CO0FBQ0FtQztBQUNILEtBSEQ7O0FBS0EsV0FBTzlFLE1BQVA7QUFDSCxDQW5QTCIsImZpbGUiOiJvcmRlcnMvbW9kYWxzL2J1bGtfZW1haWxfb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGJ1bGtfZW1haWxfb3JkZXIuanMgMjAyMS0wNC0yMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjEgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogQnVsayBFbWFpbCBPcmRlciBNb2RhbCBDb250cm9sbGVyXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnYnVsa19lbWFpbF9vcmRlcicsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9tb21lbnRqcy9tb21lbnQubWluLmpzYCxcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgJ2xvYWRpbmdfc3Bpbm5lcidcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge1xuICAgICAgICAgICAgYmluZGluZ3M6IHtzdWJqZWN0OiAkdGhpcy5maW5kKCcuc3ViamVjdCcpfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3RvciBmb3IgdGhlIGVtYWlsIGxpc3QgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGVtYWlsTGlzdEl0ZW1TZWxlY3RvciA9ICcuZW1haWwtbGlzdC1pdGVtJztcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VsZWN0b3IgZm9yIHRoZSBlbWFpbCBsaXN0IGl0ZW0gSUQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBlbWFpbExpc3RJdGVtRW1haWxTZWxlY3RvciA9ICcuZW1haWwtaW5wdXQnO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3RvciBmb3IgdGhlIG1vZGFsIGNvbnRlbnQgYm9keSBsYXllci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZGFsQ29udGVudFNlbGVjdG9yID0gJy5tb2RhbC1jb250ZW50JztcblxuICAgICAgICAvKipcbiAgICAgICAgICogUGxhY2Vob2xkZXIgbWFwLlxuICAgICAgICAgKiBVc2VkIHRvIHJlcGxhY2UgdGhlIHBsYWNlaG9sZGVyIHdpdGggdGhlIHJlc3BlY3RpdmUgdmFyaWFibGVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBGb3JtYXQ6ICd7UGxhY2Vob2xkZXJ9JyA6ICdBdHRyaWJ1dGUnXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBwbGFjZWhvbGRlck1hcCA9IHtcbiAgICAgICAgICAgICd7T1JERVJfSUR9JzogJ2lkJyxcbiAgICAgICAgICAgICd7T1JERVJfREFURX0nOiAncHVyY2hhc2VEYXRlJ1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkaW5nIHNwaW5uZXIgaW5zdGFuY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl8bnVsbH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCAkc3Bpbm5lciA9IG51bGw7XG4gICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZW5kIGJ1dHRvbiBzZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fG51bGx9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgJHNlbmRCdXR0b24gPSBudWxsO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3cvaGlkZSBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZG9TaG93IFNob3cgdGhlIGxvYWRpbmcgc3Bpbm5lcj9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF90b2dnbGVTcGlubmVyKGRvU2hvdykge1xuICAgICAgICAgICAgaWYgKGRvU2hvdykge1xuICAgICAgICAgICAgICAgICRzcGlubmVyID0ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coJHRoaXMuZmluZChtb2RhbENvbnRlbnRTZWxlY3RvciksICR0aGlzLmNzcygnei1pbmRleCcpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJHNwaW5uZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlIHN1YmplY3QgYW5kIHJlcGxhY2UgdGhlIHBsYWNlaG9sZGVycyB3aXRoIHRoZSB2YXJpYWJsZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcmRlckRhdGEgT3JkZXIgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldFBhcnNlZFN1YmplY3Qob3JkZXJEYXRhKSB7XG4gICAgICAgICAgICAvLyBTdWJqZWN0LlxuICAgICAgICAgICAgbGV0IHN1YmplY3QgPSBtb2R1bGUuYmluZGluZ3Muc3ViamVjdC5nZXQoKTtcblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBwbGFjZWhvbGRlcnMgYW5kIHJlcGxhY2UgdGhlIHZhbHVlcy5cbiAgICAgICAgICAgIE9iamVjdFxuICAgICAgICAgICAgICAgIC5rZXlzKHBsYWNlaG9sZGVyTWFwKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKHBsYWNlaG9sZGVyID0+IHN1YmplY3QgPSBzdWJqZWN0LnJlcGxhY2UocGxhY2Vob2xkZXIsIG9yZGVyRGF0YVtwbGFjZWhvbGRlck1hcFtwbGFjZWhvbGRlcl1dKSk7XG5cbiAgICAgICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIHN1Y2Nlc3NmdWwgZGVsaXZlcnkgb2YgYWxsIG1lc3NhZ2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2hhbmRsZURlbGl2ZXJ5U3VjY2VzcygpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVMS19NQUlMX1NVQ0NFU1MnLCAnZ21fc2VuZF9vcmRlcicpO1xuXG4gICAgICAgICAgICAvLyBTaG93IHN1Y2Nlc3MgbWVzc2FnZSBpbiB0aGUgYWRtaW4gaW5mbyBib3guXG4gICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZShtZXNzYWdlKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBtb2RhbCBhbmQgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgICAgX3RvZ2dsZVNwaW5uZXIoZmFsc2UpO1xuICAgICAgICAgICAgJHRoaXMubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICRzZW5kQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGZhaWx1cmUgb2YgdGhlIG1lc3NhZ2UgZGVsaXZlcnkuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlRGVsaXZlcnlGYWlsKCkge1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVMS19NQUlMX1VOU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJyk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgZXJyb3IgbWVzc2FnZSBpbiBhIG1vZGFsLlxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7dGl0bGUsIGNvbnRlbnR9KTtcblxuICAgICAgICAgICAgLy8gSGlkZSBtb2RhbCBhbmQgdGhlIGxvYWRpbmcgc3Bpbm5lciBhbmQgcmVlbmFibGUgdGhlIHNlbmQgYnV0dG9uLlxuICAgICAgICAgICAgX3RvZ2dsZVNwaW5uZXIoZmFsc2UpO1xuICAgICAgICAgICAgJHRoaXMubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICRzZW5kQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbmQgdGhlIG1vZGFsIGRhdGEgdG8gdGhlIGZvcm0gdGhyb3VnaCBhbiBBSkFYIGNhbGwuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25TZW5kQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFNlbmQgdHlwZS5cbiAgICAgICAgICAgIGNvbnN0IFJFUVVFU1RfU0VORF9UWVBFID0gJ3NlbmRfb3JkZXInO1xuXG4gICAgICAgICAgICAvLyBSZXF1ZXN0IGJhc2UgVVJMLlxuICAgICAgICAgICAgY29uc3QgUkVRVUVTVF9VUkwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vZ21fc2VuZF9vcmRlci5waHAnO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0aW9uIG9mIHJlcXVlc3RzIGluIHByb21pc2UgZm9ybWF0LlxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSBbXTtcblxuICAgICAgICAgICAgLy8gRW1haWwgbGlzdCBpdGVtIGVsZW1lbnRzLlxuICAgICAgICAgICAgY29uc3QgJGVtYWlsTGlzdEl0ZW1zID0gJHRoaXMuZmluZChlbWFpbExpc3RJdGVtU2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAvLyBBYm9ydCBhbmQgaGlkZSBtb2RhbCBvbiBlbXB0eSBlbWFpbCBsaXN0IGVudHJpZXMuXG4gICAgICAgICAgICBpZiAoISRlbWFpbExpc3RJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICRzZW5kQnV0dG9uID0gJChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgJHNlbmRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAgICBfdG9nZ2xlU3Bpbm5lcih0cnVlKTtcblxuICAgICAgICAgICAgLy8gRmlsbCBvcmRlcnMgYXJyYXkgd2l0aCBkYXRhLlxuICAgICAgICAgICAgJGVtYWlsTGlzdEl0ZW1zLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gT3JkZXIgZGF0YS5cbiAgICAgICAgICAgICAgICBjb25zdCBvcmRlckRhdGEgPSAkKGVsZW1lbnQpLmRhdGEoJ29yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBGb3JtYXQgdGhlIHB1cmNoYXNlIGRhdGUuXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpID09PSAnZGUnID8gJ0RELk1NLllZJyA6ICdNTS5ERC5ZWSc7XG4gICAgICAgICAgICAgICAgb3JkZXJEYXRhLnB1cmNoYXNlRGF0ZSA9IG1vbWVudChvcmRlckRhdGEucHVyY2hhc2VEYXRlLmRhdGUpLmZvcm1hdChkYXRlRm9ybWF0KTtcblxuICAgICAgICAgICAgICAgIC8vIEVtYWlsIGFkZHJlc3MgZW50ZXJlZCBpbiBpbnB1dCBmaWVsZC5cbiAgICAgICAgICAgICAgICBjb25zdCBlbnRlcmVkRW1haWwgPSAkKGVsZW1lbnQpLmZpbmQoZW1haWxMaXN0SXRlbUVtYWlsU2VsZWN0b3IpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVxdWVzdCBHRVQgcGFyYW1ldGVycyB0byBzZW5kLlxuICAgICAgICAgICAgICAgIGNvbnN0IGdldFBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9JRDogb3JkZXJEYXRhLmlkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBSRVFVRVNUX1NFTkRfVFlQRVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBDb21wb3NlZCByZXF1ZXN0IFVSTC5cbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBSRVFVRVNUX1VSTCArICc/JyArICQucGFyYW0oZ2V0UGFyYW1ldGVycyk7XG5cbiAgICAgICAgICAgICAgICAvLyBEYXRhIHRvIHNlbmQuXG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZ21fbWFpbDogZW50ZXJlZEVtYWlsLFxuICAgICAgICAgICAgICAgICAgICBnbV9zdWJqZWN0OiBfZ2V0UGFyc2VkU3ViamVjdChvcmRlckRhdGEpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vIFByb21pc2Ugd3JhcHBlciBmb3IgQUpBWCByZXNwb25zZS5cbiAgICAgICAgICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgQUpBWCByZXF1ZXN0LlxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gJC5hamF4KHttZXRob2Q6ICdQT1NUJywgdXJsLCBkYXRhfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5kb25lKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVySWQgPSBnZXRQYXJhbWV0ZXJzLm9JRDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQoYHRib2R5IHRyIyR7b3JkZXJJZH1gKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBlLW1haWwgc3ltYm9sXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGFibGVSb3cuZmluZCgndGQuYWN0aW9ucyBpLnRvb2x0aXAtY29uZmlybWF0aW9uLW5vdC1zZW50JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgcHJvbWlzZSBvbiBzdWNjZXNzLlxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0LmRvbmUocmVzcG9uc2UgPT4gcmVzb2x2ZShyZXNwb25zZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlamVjdCBwcm9taXNlIG9uIGZhaWwuXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuZmFpbCgoKSA9PiByZWplY3QoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgcHJvbWlzZSB0byBhcnJheS5cbiAgICAgICAgICAgICAgICBwcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFdhaXQgZm9yIGFsbCBwcm9taXNlIHRvIHJlc3BvbmQgYW5kIGhhbmRsZSBzdWNjZXNzL2Vycm9yLlxuICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpXG4gICAgICAgICAgICAgICAgLnRoZW4oX2hhbmRsZURlbGl2ZXJ5U3VjY2VzcylcbiAgICAgICAgICAgICAgICAuY2F0Y2goX2hhbmRsZURlbGl2ZXJ5RmFpbCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5idG4uc2VuZCcsIF9vblNlbmRDbGljayk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
