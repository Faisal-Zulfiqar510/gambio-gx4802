'use strict';

/* --------------------------------------------------------------
 email_order.js 2016-05-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Email Order Modal Controller
 */
gx.controllers.module('email_order', ['modal'], function (data) {

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
            subject: $this.find('.subject'),
            emailAddress: $this.find('.email-address')
        }
    };

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Send the modal data to the form through an AJAX call.
     *
     * @param {jQuery.Event} event
     */
    function _onSendClick(event) {
        var getParams = {
            oID: $this.data('orderId'),
            type: 'send_order'
        };
        var url = jse.core.config.get('appUrl') + '/admin/gm_send_order.php?' + $.param(getParams);
        var data = {
            gm_mail: module.bindings.emailAddress.get(),
            gm_subject: module.bindings.subject.get()
        };
        var $sendButton = $(event.target);

        $sendButton.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: url,
            data: data,
            method: 'POST'
        }).done(function (response) {
            var message = jse.core.lang.translate('MAIL_SUCCESS', 'gm_send_order');
            var $tableRow = $('tbody tr#' + getParams.oID);

            // Remove the e-mail symbol
            $tableRow.find('td.actions i.tooltip-confirmation-not-sent').remove();

            // Show success message in the admin info box.
            jse.libs.info_box.addSuccessMessage(message);
        }).fail(function (jqxhr, textStatus, errorThrown) {
            var title = jse.core.lang.translate('error', 'messages');
            var content = jse.core.lang.translate('MAIL_UNSUCCESS', 'gm_send_order');

            // Show error message in a modal.
            jse.libs.modal.message({ title: title, content: content });
        }).always(function () {
            $this.modal('hide');
            $sendButton.removeClass('disabled').prop('disabled', false);
        });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvZW1haWxfb3JkZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJiaW5kaW5ncyIsInN1YmplY3QiLCJmaW5kIiwiZW1haWxBZGRyZXNzIiwiX29uU2VuZENsaWNrIiwiZXZlbnQiLCJnZXRQYXJhbXMiLCJvSUQiLCJ0eXBlIiwidXJsIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsInBhcmFtIiwiZ21fbWFpbCIsImdtX3N1YmplY3QiLCIkc2VuZEJ1dHRvbiIsInRhcmdldCIsImFkZENsYXNzIiwicHJvcCIsImFqYXgiLCJtZXRob2QiLCJkb25lIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwibGFuZyIsInRyYW5zbGF0ZSIsIiR0YWJsZVJvdyIsInJlbW92ZSIsImxpYnMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiZmFpbCIsImpxeGhyIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwidGl0bGUiLCJjb250ZW50IiwibW9kYWwiLCJhbHdheXMiLCJyZW1vdmVDbGFzcyIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7QUFHQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQXNCLGFBQXRCLEVBQXFDLENBQUMsT0FBRCxDQUFyQyxFQUFnRCxVQUFVQyxJQUFWLEVBQWdCOztBQUU1RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVM7QUFDWEksa0JBQVU7QUFDTkMscUJBQVNILE1BQU1JLElBQU4sQ0FBVyxVQUFYLENBREg7QUFFTkMsMEJBQWNMLE1BQU1JLElBQU4sQ0FBVyxnQkFBWDtBQUZSO0FBREMsS0FBZjs7QUFPQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0UsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDekIsWUFBTUMsWUFBWTtBQUNkQyxpQkFBS1QsTUFBTUQsSUFBTixDQUFXLFNBQVgsQ0FEUztBQUVkVyxrQkFBTTtBQUZRLFNBQWxCO0FBSUEsWUFBTUMsTUFBTUMsSUFBSUMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQywyQkFBaEMsR0FBOERkLEVBQUVlLEtBQUYsQ0FBUVIsU0FBUixDQUExRTtBQUNBLFlBQU1ULE9BQU87QUFDVGtCLHFCQUFTbkIsT0FBT0ksUUFBUCxDQUFnQkcsWUFBaEIsQ0FBNkJVLEdBQTdCLEVBREE7QUFFVEcsd0JBQVlwQixPQUFPSSxRQUFQLENBQWdCQyxPQUFoQixDQUF3QlksR0FBeEI7QUFGSCxTQUFiO0FBSUEsWUFBTUksY0FBY2xCLEVBQUVNLE1BQU1hLE1BQVIsQ0FBcEI7O0FBRUFELG9CQUFZRSxRQUFaLENBQXFCLFVBQXJCLEVBQWlDQyxJQUFqQyxDQUFzQyxVQUF0QyxFQUFrRCxJQUFsRDs7QUFFQXJCLFVBQUVzQixJQUFGLENBQU87QUFDSFosb0JBREc7QUFFSFosc0JBRkc7QUFHSHlCLG9CQUFRO0FBSEwsU0FBUCxFQUtLQyxJQUxMLENBS1UsVUFBVUMsUUFBVixFQUFvQjtBQUN0QixnQkFBTUMsVUFBVWYsSUFBSUMsSUFBSixDQUFTZSxJQUFULENBQWNDLFNBQWQsQ0FBd0IsY0FBeEIsRUFBd0MsZUFBeEMsQ0FBaEI7QUFDQSxnQkFBTUMsWUFBWTdCLGdCQUFjTyxVQUFVQyxHQUF4QixDQUFsQjs7QUFFQTtBQUNBcUIsc0JBQVUxQixJQUFWLENBQWUsNENBQWYsRUFBNkQyQixNQUE3RDs7QUFFQTtBQUNBbkIsZ0JBQUlvQixJQUFKLENBQVNDLFFBQVQsQ0FBa0JDLGlCQUFsQixDQUFvQ1AsT0FBcEM7QUFDSCxTQWRMLEVBZUtRLElBZkwsQ0FlVSxVQUFVQyxLQUFWLEVBQWlCQyxVQUFqQixFQUE2QkMsV0FBN0IsRUFBMEM7QUFDNUMsZ0JBQU1DLFFBQVEzQixJQUFJQyxJQUFKLENBQVNlLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixPQUF4QixFQUFpQyxVQUFqQyxDQUFkO0FBQ0EsZ0JBQU1XLFVBQVU1QixJQUFJQyxJQUFKLENBQVNlLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixnQkFBeEIsRUFBMEMsZUFBMUMsQ0FBaEI7O0FBRUE7QUFDQWpCLGdCQUFJb0IsSUFBSixDQUFTUyxLQUFULENBQWVkLE9BQWYsQ0FBdUIsRUFBQ1ksWUFBRCxFQUFRQyxnQkFBUixFQUF2QjtBQUNILFNBckJMLEVBc0JLRSxNQXRCTCxDQXNCWSxZQUFZO0FBQ2hCMUMsa0JBQU15QyxLQUFOLENBQVksTUFBWjtBQUNBdEIsd0JBQVl3QixXQUFaLENBQXdCLFVBQXhCLEVBQW9DckIsSUFBcEMsQ0FBeUMsVUFBekMsRUFBcUQsS0FBckQ7QUFDSCxTQXpCTDtBQTBCSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUF4QixXQUFPOEMsSUFBUCxHQUFjLFVBQVVuQixJQUFWLEVBQWdCO0FBQzFCekIsY0FBTTZDLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFdBQWxCLEVBQStCdkMsWUFBL0I7QUFDQW1CO0FBQ0gsS0FIRDs7QUFLQSxXQUFPM0IsTUFBUDtBQUNILENBeEZEIiwiZmlsZSI6Im9yZGVycy9tb2RhbHMvZW1haWxfb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGVtYWlsX29yZGVyLmpzIDIwMTYtMDUtMDVcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEVtYWlsIE9yZGVyIE1vZGFsIENvbnRyb2xsZXJcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdlbWFpbF9vcmRlcicsIFsnbW9kYWwnXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7XG4gICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICBzdWJqZWN0OiAkdGhpcy5maW5kKCcuc3ViamVjdCcpLFxuICAgICAgICAgICAgZW1haWxBZGRyZXNzOiAkdGhpcy5maW5kKCcuZW1haWwtYWRkcmVzcycpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBTZW5kIHRoZSBtb2RhbCBkYXRhIHRvIHRoZSBmb3JtIHRocm91Z2ggYW4gQUpBWCBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uU2VuZENsaWNrKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGdldFBhcmFtcyA9IHtcbiAgICAgICAgICAgIG9JRDogJHRoaXMuZGF0YSgnb3JkZXJJZCcpLFxuICAgICAgICAgICAgdHlwZTogJ3NlbmRfb3JkZXInXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9nbV9zZW5kX29yZGVyLnBocD8nICsgJC5wYXJhbShnZXRQYXJhbXMpO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ21fbWFpbDogbW9kdWxlLmJpbmRpbmdzLmVtYWlsQWRkcmVzcy5nZXQoKSxcbiAgICAgICAgICAgIGdtX3N1YmplY3Q6IG1vZHVsZS5iaW5kaW5ncy5zdWJqZWN0LmdldCgpXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0ICRzZW5kQnV0dG9uID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgICRzZW5kQnV0dG9uLmFkZENsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNQUlMX1NVQ0NFU1MnLCAnZ21fc2VuZF9vcmRlcicpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQoYHRib2R5IHRyIyR7Z2V0UGFyYW1zLm9JRH1gKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZS1tYWlsIHN5bWJvbFxuICAgICAgICAgICAgICAgICR0YWJsZVJvdy5maW5kKCd0ZC5hY3Rpb25zIGkudG9vbHRpcC1jb25maXJtYXRpb24tbm90LXNlbnQnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIC8vIFNob3cgc3VjY2VzcyBtZXNzYWdlIGluIHRoZSBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01BSUxfVU5TVUNDRVNTJywgJ2dtX3NlbmRfb3JkZXInKTtcblxuICAgICAgICAgICAgICAgIC8vIFNob3cgZXJyb3IgbWVzc2FnZSBpbiBhIG1vZGFsLlxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe3RpdGxlLCBjb250ZW50fSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAkc2VuZEJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICR0aGlzLm9uKCdjbGljaycsICcuYnRuLnNlbmQnLCBfb25TZW5kQ2xpY2spO1xuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG59KTsiXX0=
