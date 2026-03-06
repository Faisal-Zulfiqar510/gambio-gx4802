'use strict';

/* --------------------------------------------------------------
 email_invoice.js 2016-05-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Email Invoice Modal Controller
 *
 * Handles the functionality of the Email Invoice modal.
 */
gx.controllers.module('email_invoice', ['modal'], function (data) {

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
        $this.find('.has-error').removeClass('has-error');

        var _$this$data = $this.data(),
            orderId = _$this$data.orderId,
            invoiceId = _$this$data.invoiceId;

        var parameters = {
            oID: orderId,
            iID: invoiceId,
            type: 'invoice',
            mail: '1',
            gm_quick_mail: '1',
            preview: '1'
        };
        var url = jse.core.config.get('appUrl') + '/admin/gm_pdf_order.php?' + $.param(parameters);
        var data = {
            gm_mail: module.bindings.emailAddress.get(),
            gm_subject: module.bindings.subject.get()
        };

        if (data.gm_subject === '') {
            $this.find('.subject').parents('.form-group').addClass('has-error');
        }

        if (data.gm_mail === '') {
            $this.find('.email-address').parents('.form-group').addClass('has-error');
        }

        if ($this.find('.has-error').length) {
            return;
        }

        var $sendButton = $(event.target);

        $sendButton.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: url,
            data: data,
            method: 'POST'
        }).done(function (response) {
            var message = jse.core.lang.translate('MAIL_SUCCESS', 'gm_send_order');

            $('.invoices .table-main').DataTable().ajax.reload(null, false);
            $('.invoices .table-main').invoices_overview_filter('reload');

            // Show success message in the admin info box.
            jse.libs.info_box.addSuccessMessage(message);
            $this.modal('hide');
        }).fail(function (jqxhr, textStatus, errorThrown) {
            var title = jse.core.lang.translate('error', 'messages');
            var message = jse.core.lang.translate('MAIL_UNSUCCESS', 'gm_send_order');

            // Show error message in a modal.
            jse.libs.modal.showMessage(title, message);
        }).always(function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL21vZGFscy9lbWFpbF9pbnZvaWNlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiYmluZGluZ3MiLCJzdWJqZWN0IiwiZmluZCIsImVtYWlsQWRkcmVzcyIsIl9vblNlbmRDbGljayIsImV2ZW50IiwicmVtb3ZlQ2xhc3MiLCJvcmRlcklkIiwiaW52b2ljZUlkIiwicGFyYW1ldGVycyIsIm9JRCIsImlJRCIsInR5cGUiLCJtYWlsIiwiZ21fcXVpY2tfbWFpbCIsInByZXZpZXciLCJ1cmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwicGFyYW0iLCJnbV9tYWlsIiwiZ21fc3ViamVjdCIsInBhcmVudHMiLCJhZGRDbGFzcyIsImxlbmd0aCIsIiRzZW5kQnV0dG9uIiwidGFyZ2V0IiwicHJvcCIsImFqYXgiLCJtZXRob2QiLCJkb25lIiwibWVzc2FnZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJEYXRhVGFibGUiLCJyZWxvYWQiLCJpbnZvaWNlc19vdmVydmlld19maWx0ZXIiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsIm1vZGFsIiwiZmFpbCIsImpxeGhyIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwidGl0bGUiLCJzaG93TWVzc2FnZSIsImFsd2F5cyIsImluaXQiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsZUFBdEIsRUFBdUMsQ0FBQyxPQUFELENBQXZDLEVBQWtELFVBQVVDLElBQVYsRUFBZ0I7O0FBRTlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUgsU0FBUztBQUNYSSxrQkFBVTtBQUNOQyxxQkFBU0gsTUFBTUksSUFBTixDQUFXLFVBQVgs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QkwsQ0FzQlksWUFBTTtBQUNWdEIsd0JBQVlyQixXQUFaLENBQXdCLFVBQXhCLEVBQW9DdUIsSUFBcEMsQ0FBeUMsVUFBekMsRUFBcUQsS0FBckQ7QUFDSCxTQXhCTDtBQXlCSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFqQyxXQUFPc0QsSUFBUCxHQUFjLFVBQVVsQixJQUFWLEVBQWdCO0FBQzFCbEMsY0FBTXFELEVBQU4sQ0FBUyxPQUFULEVBQWtCLFdBQWxCLEVBQStCL0MsWUFBL0I7QUFDQTRCO0FBQ0gsS0FIRDs7QUFLQSxXQUFPcEMsTUFBUDtBQUNILENBNUdEIiwiZmlsZSI6Imludm9pY2VzL21vZGFscy9lbWFpbF9pbnZvaWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBlbWFpbF9pbnZvaWNlLmpzIDIwMTYtMDUtMDVcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEVtYWlsIEludm9pY2UgTW9kYWwgQ29udHJvbGxlclxuICpcbiAqIEhhbmRsZXMgdGhlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIEVtYWlsIEludm9pY2UgbW9kYWwuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnZW1haWxfaW52b2ljZScsIFsnbW9kYWwnXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7XG4gICAgICAgIGJpbmRpbmdzOiB7XG4gICAgICAgICAgICBzdWJqZWN0OiAkdGhpcy5maW5kKCcuc3ViamVjdCcpLFxuICAgICAgICAgICAgZW1haWxBZGRyZXNzOiAkdGhpcy5maW5kKCcuZW1haWwtYWRkcmVzcycpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBTZW5kIHRoZSBtb2RhbCBkYXRhIHRvIHRoZSBmb3JtIHRocm91Z2ggYW4gQUpBWCBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uU2VuZENsaWNrKGV2ZW50KSB7XG4gICAgICAgICR0aGlzLmZpbmQoJy5oYXMtZXJyb3InKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG5cbiAgICAgICAgY29uc3Qge29yZGVySWQsIGludm9pY2VJZH0gPSAkdGhpcy5kYXRhKCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICAgICAgICAgIG9JRDogb3JkZXJJZCxcbiAgICAgICAgICAgIGlJRDogaW52b2ljZUlkLFxuICAgICAgICAgICAgdHlwZTogJ2ludm9pY2UnLFxuICAgICAgICAgICAgbWFpbDogJzEnLFxuICAgICAgICAgICAgZ21fcXVpY2tfbWFpbDogJzEnLFxuICAgICAgICAgICAgcHJldmlldzogJzEnXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9nbV9wZGZfb3JkZXIucGhwPycgKyAkLnBhcmFtKHBhcmFtZXRlcnMpO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZ21fbWFpbDogbW9kdWxlLmJpbmRpbmdzLmVtYWlsQWRkcmVzcy5nZXQoKSxcbiAgICAgICAgICAgIGdtX3N1YmplY3Q6IG1vZHVsZS5iaW5kaW5ncy5zdWJqZWN0LmdldCgpXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGRhdGEuZ21fc3ViamVjdCA9PT0gJycpIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5zdWJqZWN0JykucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF0YS5nbV9tYWlsID09PSAnJykge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmVtYWlsLWFkZHJlc3MnKS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkdGhpcy5maW5kKCcuaGFzLWVycm9yJykubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkc2VuZEJ1dHRvbiA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAkc2VuZEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01BSUxfU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICAkKCcuaW52b2ljZXMgLnRhYmxlLW1haW4nKS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZChudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJCgnLmludm9pY2VzIC50YWJsZS1tYWluJykuaW52b2ljZXNfb3ZlcnZpZXdfZmlsdGVyKCdyZWxvYWQnKTtcblxuICAgICAgICAgICAgICAgIC8vIFNob3cgc3VjY2VzcyBtZXNzYWdlIGluIHRoZSBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKChqcXhociwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTUFJTF9VTlNVQ0NFU1MnLCAnZ21fc2VuZF9vcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlIGluIGEgbW9kYWwuXG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xuICAgICAgICAgICAgICAgICRzZW5kQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5idG4uc2VuZCcsIF9vblNlbmRDbGljayk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn0pOyJdfQ==
