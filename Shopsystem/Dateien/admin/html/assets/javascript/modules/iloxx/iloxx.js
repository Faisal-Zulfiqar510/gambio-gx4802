'use strict';

/* --------------------------------------------------------------
	iloxx.js 2016-06-20
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2015 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

$(function () {
    'use strict';

    var $table = $('.orders .table-main');

    var _iloxxBulkActionDropdownHandler = function _iloxxBulkActionDropdownHandler(e) {
        var selected_orders = [],
            orders_param = '',
            redirect_url = '';
        $('table.table tbody tr').each(function () {
            var order_id = $(this).attr('id'),
                $checkbox = $('td:nth-child(1) span.single-checkbox', this);
            if ($checkbox.hasClass('checked')) {
                selected_orders.push(order_id);
                orders_param += '&orders_id[]=' + order_id;
            }
        });

        redirect_url = jse.core.config.get('appUrl') + '/admin/orders_iloxx.php?' + orders_param;
        document.location = redirect_url;
    };

    var _initBulkAction = function _initBulkAction() {
        var $bulkActions = $('.bulk-action'),
            defaultBulkAction = $table.data('init-default-bulk-action') || 'edit';
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('get_labels', 'iloxx'),
            class: 'iloxx-multi',
            data: { configurationValue: 'iloxx-multi' },
            isDefault: defaultBulkAction === 'iloxx-multi',
            callback: function callback(e) {
                e.preventDefault();
                _iloxxBulkActionDropdownHandler(e);
            }
        });
    };

    var _initSingleAction = function _initSingleAction() {
        $table.find('.btn-group.dropdown').each(function () {
            var orderId = $(this).parents('tr').data('id'),
                defaultRowAction = $table.data('init-default-row-action') || 'edit';

            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('get_labels', 'iloxx'),
                href: jse.core.config.get('appUrl') + '/admin/orders_iloxx.php?oID=' + orderId,
                class: 'iloxx-single',
                data: { configurationValue: 'iloxx-single' },
                isDefault: defaultRowAction === 'iloxx-single'
            });
        });
    };

    $table.on('init.dt', function () {
        _initSingleAction();
        _initBulkAction();
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlsb3h4LmpzIl0sIm5hbWVzIjpbIiQiLCIkdGFibGUiLCJfaWxveHhCdWxrQWN0aW9uRHJvcGRvd25IYW5kbGVyIiwiZSIsInNlbGVjdGVkX29yZGVycyIsIm9yZGVyc19wYXJhbSIsInJlZGlyZWN0X3VybCIsImVhY2giLCJvcmRlcl9pZCIsImF0dHIiLCIkY2hlY2tib3giLCJoYXNDbGFzcyIsInB1c2giLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsIl9pbml0QnVsa0FjdGlvbiIsIiRidWxrQWN0aW9ucyIsImRlZmF1bHRCdWxrQWN0aW9uIiwiZGF0YSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJhZGRBY3Rpb24iLCJ0ZXh0IiwibGFuZyIsInRyYW5zbGF0ZSIsImNsYXNzIiwiY29uZmlndXJhdGlvblZhbHVlIiwiaXNEZWZhdWx0IiwiY2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsIl9pbml0U2luZ2xlQWN0aW9uIiwiZmluZCIsIm9yZGVySWQiLCJwYXJlbnRzIiwiZGVmYXVsdFJvd0FjdGlvbiIsImhyZWYiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxFQUFFLFlBQVk7QUFDVjs7QUFFQSxRQUFNQyxTQUFTRCxFQUFFLHFCQUFGLENBQWY7O0FBRUEsUUFBTUUsa0NBQWtDLFNBQWxDQSwrQkFBa0MsQ0FBVUMsQ0FBVixFQUFhO0FBQ2pELFlBQUlDLGtCQUFrQixFQUF0QjtBQUFBLFlBQTBCQyxlQUFlLEVBQXpDO0FBQUEsWUFBNkNDLGVBQWUsRUFBNUQ7QUFDQU4sVUFBRSxzQkFBRixFQUEwQk8sSUFBMUIsQ0FBK0IsWUFBWTtBQUN2QyxnQkFBSUMsV0FBV1IsRUFBRSxJQUFGLEVBQVFTLElBQVIsQ0FBYSxJQUFiLENBQWY7QUFBQSxnQkFDSUMsWUFBWVYsRUFBRSxzQ0FBRixFQUEwQyxJQUExQyxDQURoQjtBQUVBLGdCQUFJVSxVQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDL0JQLGdDQUFnQlEsSUFBaEIsQ0FBcUJKLFFBQXJCO0FBQ0FILGdDQUFnQixrQkFBa0JHLFFBQWxDO0FBQ0g7QUFDSixTQVBEOztBQVNBRix1QkFBZU8sSUFBSUMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQywwQkFBaEMsR0FBNkRYLFlBQTVFO0FBQ0FZLGlCQUFTQyxRQUFULEdBQW9CWixZQUFwQjtBQUNILEtBYkQ7O0FBZUEsUUFBTWEsa0JBQWtCLFNBQWxCQSxlQUFrQixHQUFZO0FBQ2hDLFlBQU1DLGVBQWVwQixFQUFFLGNBQUYsQ0FBckI7QUFBQSxZQUNJcUIsb0JBQW9CcEIsT0FBT3FCLElBQVAsQ0FBWSwwQkFBWixLQUEyQyxNQURuRTtBQUVBVCxZQUFJVSxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLENBQW1DTCxZQUFuQyxFQUFpRDtBQUM3Q00sa0JBQU1iLElBQUlDLElBQUosQ0FBU2EsSUFBVCxDQUFjQyxTQUFkLENBQXdCLFlBQXhCLEVBQXNDLE9BQXRDLENBRHVDO0FBRTdDQyxtQkFBTyxhQUZzQztBQUc3Q1Asa0JBQU0sRUFBQ1Esb0JBQW9CLGFBQXJCLEVBSHVDO0FBSTdDQyx1QkFBV1Ysc0JBQXNCLGFBSlk7QUFLN0NXLHNCQUFVLGtCQUFVN0IsQ0FBVixFQUFhO0FBQ25CQSxrQkFBRThCLGNBQUY7QUFDQS9CLGdEQUFnQ0MsQ0FBaEM7QUFDSDtBQVI0QyxTQUFqRDtBQVVILEtBYkQ7O0FBZUEsUUFBTStCLG9CQUFvQixTQUFwQkEsaUJBQW9CLEdBQVk7QUFDbENqQyxlQUFPa0MsSUFBUCxDQUFZLHFCQUFaLEVBQW1DNUIsSUFBbkMsQ0FBd0MsWUFBWTtBQUNoRCxnQkFBTTZCLFVBQVVwQyxFQUFFLElBQUYsRUFBUXFDLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JmLElBQXRCLENBQTJCLElBQTNCLENBQWhCO0FBQUEsZ0JBQ0lnQixtQkFBbUJyQyxPQUFPcUIsSUFBUCxDQUFZLHlCQUFaLEtBQTBDLE1BRGpFOztBQUdBVCxnQkFBSVUsSUFBSixDQUFTQyxlQUFULENBQXlCQyxTQUF6QixDQUFtQ3pCLEVBQUUsSUFBRixDQUFuQyxFQUE0QztBQUN4QzBCLHNCQUFNYixJQUFJQyxJQUFKLENBQVNhLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixZQUF4QixFQUFzQyxPQUF0QyxDQURrQztBQUV4Q1csc0JBQU0xQixJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLDhCQUFoQyxHQUFpRW9CLE9BRi9CO0FBR3hDUCx1QkFBTyxjQUhpQztBQUl4Q1Asc0JBQU0sRUFBQ1Esb0JBQW9CLGNBQXJCLEVBSmtDO0FBS3hDQywyQkFBV08scUJBQXFCO0FBTFEsYUFBNUM7QUFPSCxTQVhEO0FBWUgsS0FiRDs7QUFlQXJDLFdBQU91QyxFQUFQLENBQVUsU0FBVixFQUFxQixZQUFZO0FBQzdCTjtBQUNBZjtBQUNILEtBSEQ7QUFJSCxDQXRERCIsImZpbGUiOiJpbG94eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGlsb3h4LmpzIDIwMTYtMDYtMjBcblx0R2FtYmlvIEdtYkhcblx0aHR0cDovL3d3dy5nYW1iaW8uZGVcblx0Q29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG5cdFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuXHRbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5cbiQoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGNvbnN0ICR0YWJsZSA9ICQoJy5vcmRlcnMgLnRhYmxlLW1haW4nKTtcblxuICAgIGNvbnN0IF9pbG94eEJ1bGtBY3Rpb25Ecm9wZG93bkhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBsZXQgc2VsZWN0ZWRfb3JkZXJzID0gW10sIG9yZGVyc19wYXJhbSA9ICcnLCByZWRpcmVjdF91cmwgPSAnJztcbiAgICAgICAgJCgndGFibGUudGFibGUgdGJvZHkgdHInKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBvcmRlcl9pZCA9ICQodGhpcykuYXR0cignaWQnKSxcbiAgICAgICAgICAgICAgICAkY2hlY2tib3ggPSAkKCd0ZDpudGgtY2hpbGQoMSkgc3Bhbi5zaW5nbGUtY2hlY2tib3gnLCB0aGlzKTtcbiAgICAgICAgICAgIGlmICgkY2hlY2tib3guaGFzQ2xhc3MoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkX29yZGVycy5wdXNoKG9yZGVyX2lkKTtcbiAgICAgICAgICAgICAgICBvcmRlcnNfcGFyYW0gKz0gJyZvcmRlcnNfaWRbXT0nICsgb3JkZXJfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlZGlyZWN0X3VybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9vcmRlcnNfaWxveHgucGhwPycgKyBvcmRlcnNfcGFyYW07XG4gICAgICAgIGRvY3VtZW50LmxvY2F0aW9uID0gcmVkaXJlY3RfdXJsO1xuICAgIH07XG5cbiAgICBjb25zdCBfaW5pdEJ1bGtBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0ICRidWxrQWN0aW9ucyA9ICQoJy5idWxrLWFjdGlvbicpLFxuICAgICAgICAgICAgZGVmYXVsdEJ1bGtBY3Rpb24gPSAkdGFibGUuZGF0YSgnaW5pdC1kZWZhdWx0LWJ1bGstYWN0aW9uJykgfHwgJ2VkaXQnO1xuICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2dldF9sYWJlbHMnLCAnaWxveHgnKSxcbiAgICAgICAgICAgIGNsYXNzOiAnaWxveHgtbXVsdGknLFxuICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2lsb3h4LW11bHRpJ30sXG4gICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnaWxveHgtbXVsdGknLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIF9pbG94eEJ1bGtBY3Rpb25Ecm9wZG93bkhhbmRsZXIoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBfaW5pdFNpbmdsZUFjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHRhYmxlLmZpbmQoJy5idG4tZ3JvdXAuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IG9yZGVySWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0Um93QWN0aW9uID0gJHRhYmxlLmRhdGEoJ2luaXQtZGVmYXVsdC1yb3ctYWN0aW9uJykgfHwgJ2VkaXQnO1xuXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZ2V0X2xhYmVscycsICdpbG94eCcpLFxuICAgICAgICAgICAgICAgIGhyZWY6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9vcmRlcnNfaWxveHgucGhwP29JRD0nICsgb3JkZXJJZCxcbiAgICAgICAgICAgICAgICBjbGFzczogJ2lsb3h4LXNpbmdsZScsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2lsb3h4LXNpbmdsZSd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ2lsb3h4LXNpbmdsZScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHRhYmxlLm9uKCdpbml0LmR0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICBfaW5pdFNpbmdsZUFjdGlvbigpO1xuICAgICAgICBfaW5pdEJ1bGtBY3Rpb24oKTtcbiAgICB9KTtcbn0pO1xuIl19
