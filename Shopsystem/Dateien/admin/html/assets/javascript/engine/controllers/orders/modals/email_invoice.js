'use strict';

/* --------------------------------------------------------------
 email_invoice.js 2016-10-17
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
    var module = {};

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
            type: 'invoice',
            mail: '1',
            gm_quick_mail: '1'
        };
        var url = jse.core.config.get('appUrl') + '/admin/gm_pdf_order.php?' + $.param(getParams);
        var data = $this.find('form').serialize();
        var $sendButton = $(event.target);

        $sendButton.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: url,
            data: data,
            method: 'POST'
        }).done(function (response) {
            var message = jse.core.lang.translate('MAIL_SUCCESS', 'gm_send_order');
            $('.orders .table-main').DataTable().ajax.reload(null, false);
            $('.orders .table-main').orders_overview_filter('reload');

            // Show success message in the admin info box.
            jse.libs.info_box.addSuccessMessage(message);
        }).fail(function (jqxhr, textStatus, errorThrown) {
            var title = jse.core.lang.translate('error', 'messages');
            var message = jse.core.lang.translate('MAIL_UNSUCCESS', 'gm_send_order');
            jse.libs.modal.showMessage(title, message);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvZW1haWxfaW52b2ljZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIl9vblNlbmRDbGljayIsImV2ZW50IiwiZ2V0UGFyYW1zIiwib0lEIiwidHlwZSIsIm1haWwiLCJnbV9xdWlja19tYWlsIiwidXJsIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsInBhcmFtIiwiZmluZCIsInNlcmlhbGl6ZSIsIiRzZW5kQnV0dG9uIiwidGFyZ2V0IiwiYWRkQ2xhc3MiLCJwcm9wIiwiYWpheCIsIm1ldGhvZCIsImRvbmUiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJsYW5nIiwidHJhbnNsYXRlIiwiRGF0YVRhYmxlIiwicmVsb2FkIiwib3JkZXJzX292ZXJ2aWV3X2ZpbHRlciIsImxpYnMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiZmFpbCIsImpxeGhyIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwidGl0bGUiLCJtb2RhbCIsInNob3dNZXNzYWdlIiwiYWx3YXlzIiwicmVtb3ZlQ2xhc3MiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQXNCLGVBQXRCLEVBQXVDLENBQUMsT0FBRCxDQUF2QyxFQUFrRCxVQUFVQyxJQUFWLEVBQWdCOztBQUU5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0ksWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDekIsWUFBTUMsWUFBWTtBQUNkQyxpQkFBS0wsTUFBTUQsSUFBTixDQUFXLFNBQVgsQ0FEUztBQUVkTyxrQkFBTSxTQUZRO0FBR2RDLGtCQUFNLEdBSFE7QUFJZEMsMkJBQWU7QUFKRCxTQUFsQjtBQU1BLFlBQU1DLE1BQU1DLElBQUlDLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0MsMEJBQWhDLEdBQTZEWixFQUFFYSxLQUFGLENBQVFWLFNBQVIsQ0FBekU7QUFDQSxZQUFNTCxPQUFPQyxNQUFNZSxJQUFOLENBQVcsTUFBWCxFQUFtQkMsU0FBbkIsRUFBYjtBQUNBLFlBQU1DLGNBQWNoQixFQUFFRSxNQUFNZSxNQUFSLENBQXBCOztBQUVBRCxvQkFBWUUsUUFBWixDQUFxQixVQUFyQixFQUFpQ0MsSUFBakMsQ0FBc0MsVUFBdEMsRUFBa0QsSUFBbEQ7O0FBRUFuQixVQUFFb0IsSUFBRixDQUFPO0FBQ0haLG9CQURHO0FBRUhWLHNCQUZHO0FBR0h1QixvQkFBUTtBQUhMLFNBQVAsRUFLS0MsSUFMTCxDQUtVLFVBQVVDLFFBQVYsRUFBb0I7QUFDdEIsZ0JBQU1DLFVBQVVmLElBQUlDLElBQUosQ0FBU2UsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGNBQXhCLEVBQXdDLGVBQXhDLENBQWhCO0FBQ0ExQixjQUFFLHFCQUFGLEVBQXlCMkIsU0FBekIsR0FBcUNQLElBQXJDLENBQTBDUSxNQUExQyxDQUFpRCxJQUFqRCxFQUF1RCxLQUF2RDtBQUNBNUIsY0FBRSxxQkFBRixFQUF5QjZCLHNCQUF6QixDQUFnRCxRQUFoRDs7QUFFQTtBQUNBcEIsZ0JBQUlxQixJQUFKLENBQVNDLFFBQVQsQ0FBa0JDLGlCQUFsQixDQUFvQ1IsT0FBcEM7QUFDSCxTQVpMLEVBYUtTLElBYkwsQ0FhVSxVQUFVQyxLQUFWLEVBQWlCQyxVQUFqQixFQUE2QkMsV0FBN0IsRUFBMEM7QUFDNUMsZ0JBQU1DLFFBQVE1QixJQUFJQyxJQUFKLENBQVNlLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixPQUF4QixFQUFpQyxVQUFqQyxDQUFkO0FBQ0EsZ0JBQU1GLFVBQVVmLElBQUlDLElBQUosQ0FBU2UsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGdCQUF4QixFQUEwQyxlQUExQyxDQUFoQjtBQUNBakIsZ0JBQUlxQixJQUFKLENBQVNRLEtBQVQsQ0FBZUMsV0FBZixDQUEyQkYsS0FBM0IsRUFBa0NiLE9BQWxDO0FBQ0gsU0FqQkwsRUFrQktnQixNQWxCTCxDQWtCWSxZQUFZO0FBQ2hCekMsa0JBQU11QyxLQUFOLENBQVksTUFBWjtBQUNBdEIsd0JBQVl5QixXQUFaLENBQXdCLFVBQXhCLEVBQW9DdEIsSUFBcEMsQ0FBeUMsVUFBekMsRUFBcUQsS0FBckQ7QUFDSCxTQXJCTDtBQXNCSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUF0QixXQUFPNkMsSUFBUCxHQUFjLFVBQVVwQixJQUFWLEVBQWdCO0FBQzFCdkIsY0FBTTRDLEVBQU4sQ0FBUyxPQUFULEVBQWtCLFdBQWxCLEVBQStCMUMsWUFBL0I7QUFDQXFCO0FBQ0gsS0FIRDs7QUFLQSxXQUFPekIsTUFBUDtBQUNILENBOUVEIiwiZmlsZSI6Im9yZGVycy9tb2RhbHMvZW1haWxfaW52b2ljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZW1haWxfaW52b2ljZS5qcyAyMDE2LTEwLTE3XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBFbWFpbCBJbnZvaWNlIE1vZGFsIENvbnRyb2xsZXJcbiAqXG4gKiBIYW5kbGVzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBFbWFpbCBJbnZvaWNlIG1vZGFsLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ2VtYWlsX2ludm9pY2UnLCBbJ21vZGFsJ10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIFNlbmQgdGhlIG1vZGFsIGRhdGEgdG8gdGhlIGZvcm0gdGhyb3VnaCBhbiBBSkFYIGNhbGwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25TZW5kQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgY29uc3QgZ2V0UGFyYW1zID0ge1xuICAgICAgICAgICAgb0lEOiAkdGhpcy5kYXRhKCdvcmRlcklkJyksXG4gICAgICAgICAgICB0eXBlOiAnaW52b2ljZScsXG4gICAgICAgICAgICBtYWlsOiAnMScsXG4gICAgICAgICAgICBnbV9xdWlja19tYWlsOiAnMSdcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2dtX3BkZl9vcmRlci5waHA/JyArICQucGFyYW0oZ2V0UGFyYW1zKTtcbiAgICAgICAgY29uc3QgZGF0YSA9ICR0aGlzLmZpbmQoJ2Zvcm0nKS5zZXJpYWxpemUoKTtcbiAgICAgICAgY29uc3QgJHNlbmRCdXR0b24gPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgJHNlbmRCdXR0b24uYWRkQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01BSUxfU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJyk7XG4gICAgICAgICAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkKCcub3JkZXJzIC50YWJsZS1tYWluJykub3JkZXJzX292ZXJ2aWV3X2ZpbHRlcigncmVsb2FkJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBTaG93IHN1Y2Nlc3MgbWVzc2FnZSBpbiB0aGUgYWRtaW4gaW5mbyBib3guXG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNQUlMX1VOU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICR0aGlzLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgJHNlbmRCdXR0b24ucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLmJ0bi5zZW5kJywgX29uU2VuZENsaWNrKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7Il19
