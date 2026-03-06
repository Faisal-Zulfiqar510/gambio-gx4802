'use strict';

/* --------------------------------------------------------------
 change_status.js 2016-05-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Change Order Status Modal Controller
 */
gx.controllers.module('change_status', ['modal'], function (data) {

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
            selectedOrders: $this.find('.selected-orders'),
            status: $this.find('#status-dropdown'),
            notifyCustomer: $this.find('#notify-customer'),
            sendParcelTrackingCode: $this.find('#send-parcel-tracking-code'),
            sendComment: $this.find('#send-comment'),
            comment: $this.find('#comment')
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
    function _changeStatus(event) {
        event.stopPropagation();

        if (module.bindings.status.get() === '') {
            return;
        }

        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=OrdersModalsAjax/ChangeOrderStatus';
        var data = {
            selectedOrders: module.bindings.selectedOrders.get().split(', '),
            statusId: module.bindings.status.get(),
            notifyCustomer: module.bindings.notifyCustomer.get(),
            sendParcelTrackingCode: module.bindings.sendParcelTrackingCode.get(),
            sendComment: module.bindings.sendComment.get(),
            comment: module.bindings.comment.get(),
            pageToken: jse.core.config.get('pageToken')
        };
        var $saveButton = $(event.target);

        $saveButton.addClass('disabled').attr('disabled', true);

        $.ajax({
            url: url,
            data: data,
            method: 'POST'
        }).done(function (response) {
            var content = data.notifyCustomer ? jse.core.lang.translate('MAIL_SUCCESS', 'gm_send_order') : jse.core.lang.translate('SUCCESS_ORDER_UPDATED', 'orders');

            if ($('.orders.overview').length) {
                $('.orders .table-main').DataTable().ajax.reload(null, false);
                $('.orders .table-main').orders_overview_filter('reload');
            } else {
                $('.invoices .table-main').DataTable().ajax.reload(null, false);
                $('.invoices .table-main').invoices_overview_filter('reload');
            }

            // Show success message in the admin info box.
            jse.libs.info_box.addSuccessMessage(content);
        }).always(function () {
            $this.modal('hide');
            $saveButton.removeClass('disabled').attr('disabled', false);
        });
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', '.btn.save', _changeStatus);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvY2hhbmdlX3N0YXR1cy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImJpbmRpbmdzIiwic2VsZWN0ZWRPcmRlcnMiLCJmaW5kIiwic3RhdHVzIiwibm90aWZ5Q3VzdG9tZXIiLCJzZW5kUGFyY2VsVHJhY2tpbmdDb2RlIiwic2VuZENvbW1lbnQiLCJjb21tZW50IiwiX2NoYW5nZVN0YXR1cyIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZ2V0IiwidXJsIiwianNlIiwiY29yZSIsImNvbmZpZyIsInNwbGl0Iiwic3RhdHVzSWQiLCJwYWdlVG9rZW4iLCIkc2F2ZUJ1dHRvbiIsInRhcmdldCIsImFkZENsYXNzIiwiYXR0ciIsImFqYXgiLCJtZXRob2QiLCJkb25lIiwicmVzcG9uc2UiLCJjb250ZW50IiwibGFuZyIsInRyYW5zbGF0ZSIsImxlbmd0aCIsIkRhdGFUYWJsZSIsInJlbG9hZCIsIm9yZGVyc19vdmVydmlld19maWx0ZXIiLCJpbnZvaWNlc19vdmVydmlld19maWx0ZXIiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsImFsd2F5cyIsIm1vZGFsIiwicmVtb3ZlQ2xhc3MiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7O0FBR0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixlQUF0QixFQUF1QyxDQUFDLE9BQUQsQ0FBdkMsRUFBa0QsVUFBVUMsSUFBVixFQUFnQjs7QUFFOUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTO0FBQ1hJLGtCQUFVO0FBQ05DLDRCQUFnQkgsTUFBTUksSUFBTixDQUFXLGtCQUFYLENBRFY7QUFFTkMsb0JBQVFMLE1BQU1JLElBQU4sQ0FBVyxrQkFBWCxD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QTFCLFdBQU82QyxJQUFQLEdBQWMsVUFBVWhCLElBQVYsRUFBZ0I7QUFDMUIzQixjQUFNNEMsRUFBTixDQUFTLE9BQVQsRUFBa0IsV0FBbEIsRUFBK0JsQyxhQUEvQjtBQUNBaUI7QUFDSCxLQUhEOztBQUtBLFdBQU83QixNQUFQO0FBQ0gsQ0FsR0QiLCJmaWxlIjoib3JkZXJzL21vZGFscy9jaGFuZ2Vfc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBjaGFuZ2Vfc3RhdHVzLmpzIDIwMTYtMDUtMDlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIENoYW5nZSBPcmRlciBTdGF0dXMgTW9kYWwgQ29udHJvbGxlclxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ2NoYW5nZV9zdGF0dXMnLCBbJ21vZGFsJ10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge1xuICAgICAgICBiaW5kaW5nczoge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcmRlcnM6ICR0aGlzLmZpbmQoJy5zZWxlY3RlZC1vcmRlcnMnKSxcbiAgICAgICAgICAgIHN0YXR1czogJHRoaXMuZmluZCgnI3N0YXR1cy1kcm9wZG93bicpLFxuICAgICAgICAgICAgbm90aWZ5Q3VzdG9tZXI6ICR0aGlzLmZpbmQoJyNub3RpZnktY3VzdG9tZXInKSxcbiAgICAgICAgICAgIHNlbmRQYXJjZWxUcmFja2luZ0NvZGU6ICR0aGlzLmZpbmQoJyNzZW5kLXBhcmNlbC10cmFja2luZy1jb2RlJyksXG4gICAgICAgICAgICBzZW5kQ29tbWVudDogJHRoaXMuZmluZCgnI3NlbmQtY29tbWVudCcpLFxuICAgICAgICAgICAgY29tbWVudDogJHRoaXMuZmluZCgnI2NvbW1lbnQnKVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogU2VuZCB0aGUgbW9kYWwgZGF0YSB0byB0aGUgZm9ybSB0aHJvdWdoIGFuIEFKQVggY2FsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9jaGFuZ2VTdGF0dXMoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgaWYgKG1vZHVsZS5iaW5kaW5ncy5zdGF0dXMuZ2V0KCkgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPU9yZGVyc01vZGFsc0FqYXgvQ2hhbmdlT3JkZXJTdGF0dXMnO1xuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgc2VsZWN0ZWRPcmRlcnM6IG1vZHVsZS5iaW5kaW5ncy5zZWxlY3RlZE9yZGVycy5nZXQoKS5zcGxpdCgnLCAnKSxcbiAgICAgICAgICAgIHN0YXR1c0lkOiBtb2R1bGUuYmluZGluZ3Muc3RhdHVzLmdldCgpLFxuICAgICAgICAgICAgbm90aWZ5Q3VzdG9tZXI6IG1vZHVsZS5iaW5kaW5ncy5ub3RpZnlDdXN0b21lci5nZXQoKSxcbiAgICAgICAgICAgIHNlbmRQYXJjZWxUcmFja2luZ0NvZGU6IG1vZHVsZS5iaW5kaW5ncy5zZW5kUGFyY2VsVHJhY2tpbmdDb2RlLmdldCgpLFxuICAgICAgICAgICAgc2VuZENvbW1lbnQ6IG1vZHVsZS5iaW5kaW5ncy5zZW5kQ29tbWVudC5nZXQoKSxcbiAgICAgICAgICAgIGNvbW1lbnQ6IG1vZHVsZS5iaW5kaW5ncy5jb21tZW50LmdldCgpLFxuICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCAkc2F2ZUJ1dHRvbiA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAkc2F2ZUJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkYXRhLm5vdGlmeUN1c3RvbWVyID9cbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01BSUxfU1VDQ0VTUycsICdnbV9zZW5kX29yZGVyJykgOlxuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1VDQ0VTU19PUkRFUl9VUERBVEVEJywgJ29yZGVycycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQoJy5vcmRlcnMub3ZlcnZpZXcnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVycyAudGFibGUtbWFpbicpLm9yZGVyc19vdmVydmlld19maWx0ZXIoJ3JlbG9hZCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5pbnZvaWNlcyAudGFibGUtbWFpbicpLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKG51bGwsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmludm9pY2VzIC50YWJsZS1tYWluJykuaW52b2ljZXNfb3ZlcnZpZXdfZmlsdGVyKCdyZWxvYWQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTaG93IHN1Y2Nlc3MgbWVzc2FnZSBpbiB0aGUgYWRtaW4gaW5mbyBib3guXG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoY29udGVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAkc2F2ZUJ1dHRvbi5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKS5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICR0aGlzLm9uKCdjbGljaycsICcuYnRuLnNhdmUnLCBfY2hhbmdlU3RhdHVzKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7Il19
