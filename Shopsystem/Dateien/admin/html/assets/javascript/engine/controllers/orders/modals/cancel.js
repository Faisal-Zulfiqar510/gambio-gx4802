'use strict';

/* --------------------------------------------------------------
 cancel_modal.js 2016-10-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Cancel Order Modal Controller
 */
gx.controllers.module('cancel', ['modal'], function (data) {

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
            reStock: $this.find('.re-stock'),
            reShip: $this.find('.re-ship'),
            reActivate: $this.find('.re-activate'),
            notifyCustomer: $this.find('.notify-customer'),
            sendComments: $this.find('.send-comments'),
            cancellationComments: $this.find('.cancellation-comments')
        }
    };

    if ($this.find('.cancel-invoice').length) {
        module.bindings.cancelInvoice = $this.find('.cancel-invoice');
    }

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Send the modal data to the form through an AJAX call.
     *
     * @param {jQuery.Event} event
     */
    function _onSendClick(event) {
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=OrdersModalsAjax/CancelOrder';
        var data = {
            selectedOrders: module.bindings.selectedOrders.get().split(', '),
            reStock: module.bindings.reStock.get(),
            reShip: module.bindings.reShip.get(),
            reActivate: module.bindings.reActivate.get(),
            notifyCustomer: module.bindings.notifyCustomer.get(),
            sendComments: module.bindings.sendComments.get(),
            cancellationComments: module.bindings.cancellationComments.get(),
            pageToken: jse.core.config.get('pageToken')
        };

        if (module.bindings.cancelInvoice) {
            data.cancelInvoice = module.bindings.cancelInvoice.get();
        }

        var $sendButton = $(event.target);

        $sendButton.addClass('disabled').prop('disabled', true);

        $.ajax({
            url: url,
            data: data,
            method: 'POST',
            dataType: 'json'
        }).done(function (response) {

            for (var key in response.urls) {
                $.ajax({
                    type: "POST",
                    url: response.urls[key],
                    async: false
                });
            }

            jse.libs.info_box.addSuccessMessage(jse.core.lang.translate('CANCEL_ORDERS_SUCCESS', 'admin_orders'));
            $('.orders .table-main').DataTable().ajax.reload(null, false);
            $('.orders .table-main').orders_overview_filter('reload');
        }).fail(function (jqxhr, textStatus, errorThrown) {
            jse.libs.modal.message({
                title: jse.core.lang.translate('error', 'messages'),
                content: jse.core.lang.translate('CANCEL_ORDERS_ERROR', 'admin_orders')
            });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvY2FuY2VsLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiYmluZGluZ3MiLCJzZWxlY3RlZE9yZGVycyIsImZpbmQiLCJyZVN0b2NrIiwicmVTaGlwIiwicmVBY3RpdmF0ZSIsIm5vdGlmeUN1c3RvbWVyIiwic2VuZENvbW1lbnRzIiwiY2FuY2VsbGF0aW9uQ29tbWVudHMiLCJsZW5ndGgiLCJjYW5jZWxJbnZvaWNlIiwiX29uU2VuZENsaWNrIiwiZXZlbnQiLCJ1cmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0Iiwic3BsaXQiLCJwYWdlVG9rZW4iLCIkc2VuZEJ1dHRvbiIsInRhcmdldCIsImFkZENsYXNzIiwicHJvcCIsImFqYXgiLCJtZXRob2QiLCJkYXRhVHlwZSIsImRvbmUiLCJyZXNwb25zZSIsImtleSIsInVybHMiLCJ0eXBlIiwiYXN5bmMiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJEYXRhVGFibGUiLCJyZWxvYWQiLCJvcmRlcnNfb3ZlcnZpZXdfZmlsdGVyIiwiZmFpbCIsImpxeGhyIiwidGV4dFN0YXR1cyIsImVycm9yVGhyb3duIiwibW9kYWwiLCJtZXNzYWdlIiwidGl0bGUiLCJjb250ZW50IiwiYWx3YXlzIiwicmVtb3ZlQ2xhc3MiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7O0FBR0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixRQUF0QixFQUFnQyxDQUFDLE9BQUQsQ0FBaEMsRUFBMkMsVUFBVUMsSUFBVixFQUFnQjs7QUFFdkQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTO0FBQ1hJLGtCQUFVO0FBQ05DLDRCQUFnQkgs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SCxTQXBCTCxFQXFCS0MsSUFyQkwsQ0FxQlUsVUFBVUMsS0FBVixFQUFpQkMsVUFBakIsRUFBNkJDLFdBQTdCLEVBQTBDO0FBQzVDOUIsZ0JBQUltQixJQUFKLENBQVNZLEtBQVQsQ0FBZUMsT0FBZixDQUF1QjtBQUNuQkMsdUJBQU9qQyxJQUFJQyxJQUFKLENBQVNxQixJQUFULENBQWNDLFNBQWQsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBakMsQ0FEWTtBQUVuQlcseUJBQVNsQyxJQUFJQyxJQUFKLENBQVNxQixJQUFULENBQWNDLFNBQWQsQ0FBd0IscUJBQXhCLEVBQStDLGNBQS9DO0FBRlUsYUFBdkI7QUFJSCxTQTFCTCxFQTJCS1ksTUEzQkwsQ0EyQlksWUFBWTtBQUNoQm5ELGtCQUFNK0MsS0FBTixDQUFZLE1BQVo7QUFDQXpCLHdCQUFZOEIsV0FBWixDQUF3QixVQUF4QixFQUFvQzNCLElBQXBDLENBQXlDLFVBQXpDLEVBQXFELEtBQXJEO0FBQ0gsU0E5Qkw7QUErQkg7O0FBRUQ7QUFDQTtBQUNBOztBQUVBM0IsV0FBT3VELElBQVAsR0FBYyxVQUFVeEIsSUFBVixFQUFnQjtBQUMxQjdCLGNBQU1zRCxFQUFOLENBQVMsT0FBVCxFQUFrQixXQUFsQixFQUErQnpDLFlBQS9CO0FBQ0FnQjtBQUNILEtBSEQ7O0FBS0EsV0FBTy9CLE1BQVA7QUFDSCxDQTdHRCIsImZpbGUiOiJvcmRlcnMvbW9kYWxzL2NhbmNlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY2FuY2VsX21vZGFsLmpzIDIwMTYtMTAtMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIENhbmNlbCBPcmRlciBNb2RhbCBDb250cm9sbGVyXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnY2FuY2VsJywgWydtb2RhbCddLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHtcbiAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgIHNlbGVjdGVkT3JkZXJzOiAkdGhpcy5maW5kKCcuc2VsZWN0ZWQtb3JkZXJzJyksXG4gICAgICAgICAgICByZVN0b2NrOiAkdGhpcy5maW5kKCcucmUtc3RvY2snKSxcbiAgICAgICAgICAgIHJlU2hpcDogJHRoaXMuZmluZCgnLnJlLXNoaXAnKSxcbiAgICAgICAgICAgIHJlQWN0aXZhdGU6ICR0aGlzLmZpbmQoJy5yZS1hY3RpdmF0ZScpLFxuICAgICAgICAgICAgbm90aWZ5Q3VzdG9tZXI6ICR0aGlzLmZpbmQoJy5ub3RpZnktY3VzdG9tZXInKSxcbiAgICAgICAgICAgIHNlbmRDb21tZW50czogJHRoaXMuZmluZCgnLnNlbmQtY29tbWVudHMnKSxcbiAgICAgICAgICAgIGNhbmNlbGxhdGlvbkNvbW1lbnRzOiAkdGhpcy5maW5kKCcuY2FuY2VsbGF0aW9uLWNvbW1lbnRzJylcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoJHRoaXMuZmluZCgnLmNhbmNlbC1pbnZvaWNlJykubGVuZ3RoKSB7XG4gICAgICAgIG1vZHVsZS5iaW5kaW5ncy5jYW5jZWxJbnZvaWNlID0gJHRoaXMuZmluZCgnLmNhbmNlbC1pbnZvaWNlJyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBTZW5kIHRoZSBtb2RhbCBkYXRhIHRvIHRoZSBmb3JtIHRocm91Z2ggYW4gQUpBWCBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uU2VuZENsaWNrKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89T3JkZXJzTW9kYWxzQWpheC9DYW5jZWxPcmRlcic7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBzZWxlY3RlZE9yZGVyczogbW9kdWxlLmJpbmRpbmdzLnNlbGVjdGVkT3JkZXJzLmdldCgpLnNwbGl0KCcsICcpLFxuICAgICAgICAgICAgcmVTdG9jazogbW9kdWxlLmJpbmRpbmdzLnJlU3RvY2suZ2V0KCksXG4gICAgICAgICAgICByZVNoaXA6IG1vZHVsZS5iaW5kaW5ncy5yZVNoaXAuZ2V0KCksXG4gICAgICAgICAgICByZUFjdGl2YXRlOiBtb2R1bGUuYmluZGluZ3MucmVBY3RpdmF0ZS5nZXQoKSxcbiAgICAgICAgICAgIG5vdGlmeUN1c3RvbWVyOiBtb2R1bGUuYmluZGluZ3Mubm90aWZ5Q3VzdG9tZXIuZ2V0KCksXG4gICAgICAgICAgICBzZW5kQ29tbWVudHM6IG1vZHVsZS5iaW5kaW5ncy5zZW5kQ29tbWVudHMuZ2V0KCksXG4gICAgICAgICAgICBjYW5jZWxsYXRpb25Db21tZW50czogbW9kdWxlLmJpbmRpbmdzLmNhbmNlbGxhdGlvbkNvbW1lbnRzLmdldCgpLFxuICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChtb2R1bGUuYmluZGluZ3MuY2FuY2VsSW52b2ljZSkge1xuICAgICAgICAgICAgZGF0YS5jYW5jZWxJbnZvaWNlID0gbW9kdWxlLmJpbmRpbmdzLmNhbmNlbEludm9pY2UuZ2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkc2VuZEJ1dHRvbiA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAkc2VuZEJ1dHRvbi5hZGRDbGFzcygnZGlzYWJsZWQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiByZXNwb25zZS51cmxzKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcmVzcG9uc2UudXJsc1trZXldLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmluZm9fYm94LmFkZFN1Y2Nlc3NNZXNzYWdlKFxuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQ0FOQ0VMX09SREVSU19TVUNDRVNTJywgJ2FkbWluX29yZGVycycpKTtcbiAgICAgICAgICAgICAgICAkKCcub3JkZXJzIC50YWJsZS1tYWluJykuRGF0YVRhYmxlKCkuYWpheC5yZWxvYWQobnVsbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICQoJy5vcmRlcnMgLnRhYmxlLW1haW4nKS5vcmRlcnNfb3ZlcnZpZXdfZmlsdGVyKCdyZWxvYWQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0NBTkNFTF9PUkRFUlNfRVJST1InLCAnYWRtaW5fb3JkZXJzJylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICRzZW5kQnV0dG9uLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5idG4uc2VuZCcsIF9vblNlbmRDbGljayk7XG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn0pOyJdfQ==
