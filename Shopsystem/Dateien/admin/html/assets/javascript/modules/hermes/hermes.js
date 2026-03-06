'use strict';

/* --------------------------------------------------------------
	hermes.js 2016-06-16
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2016 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

$(function () {
    'use strict';

    var $table = $('.orders .table-main');

    $table.on('init.dt', function () {
        var _initSingleAction = function _initSingleAction($table) {
            $table.find('.btn-group.dropdown').each(function () {
                var orderId = $(this).parents('tr').data('id');
                var defaultRowAction = $table.data('defaultRowAction') || 'edit';

                jse.libs.button_dropdown.addAction($(this), {
                    text: jse.core.lang.translate('hermes_shipping', 'hermes'),
                    href: jse.core.config.get('appUrl') + '/admin/hermes_order.php?orders_id=' + orderId,
                    class: 'hermes-single',
                    data: { configurationValue: 'hermes-single' },
                    isDefault: defaultRowAction === 'hermes-single'
                });
            });
        };

        $table.on('draw.dt', function () {
            _initSingleAction($table);
        });

        _initSingleAction($table);
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm1lcy5qcyJdLCJuYW1lcyI6WyIkIiwiJHRhYmxlIiwib24iLCJfaW5pdFNpbmdsZUFjdGlvbiIsImZpbmQiLCJlYWNoIiwib3JkZXJJZCIsInBhcmVudHMiLCJkYXRhIiwiZGVmYXVsdFJvd0FjdGlvbiIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJhZGRBY3Rpb24iLCJ0ZXh0IiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJocmVmIiwiY29uZmlnIiwiZ2V0IiwiY2xhc3MiLCJjb25maWd1cmF0aW9uVmFsdWUiLCJpc0RlZmF1bHQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsRUFBRSxZQUFZO0FBQ1Y7O0FBRUEsUUFBTUMsU0FBU0QsRUFBRSxxQkFBRixDQUFmOztBQUVBQyxXQUFPQyxFQUFQLENBQVUsU0FBVixFQUFxQixZQUFZO0FBQzdCLFlBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQVVGLE1BQVYsRUFBa0I7QUFDeENBLG1CQUFPRyxJQUFQLENBQVkscUJBQVosRUFBbUNDLElBQW5DLENBQXdDLFlBQVk7QUFDaEQsb0JBQU1DLFVBQVVOLEVBQUUsSUFBRixFQUFRTyxPQUFSLENBQWdCLElBQWhCLEVBQXNCQyxJQUF0QixDQUEyQixJQUEzQixDQUFoQjtBQUNBLG9CQUFNQyxtQkFBbUJSLE9BQU9PLElBQVAsQ0FBWSxrQkFBWixLQUFtQyxNQUE1RDs7QUFFQUUsb0JBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FBbUNiLEVBQUUsSUFBRixDQUFuQyxFQUE0QztBQUN4Q2MsMEJBQU1KLElBQUlLLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGlCQUF4QixFQUEyQyxRQUEzQyxDQURrQztBQUV4Q0MsMEJBQU1SLElBQUlLLElBQUosQ0FBU0ksTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0Msb0NBQWhDLEdBQXVFZCxPQUZyQztBQUd4Q2UsMkJBQU8sZUFIaUM7QUFJeENiLDBCQUFNLEVBQUNjLG9CQUFvQixlQUFyQixFQUprQztBQUt4Q0MsK0JBQVdkLHFCQUFxQjtBQUxRLGlCQUE1QztBQU9ILGFBWEQ7QUFZSCxTQWJEOztBQWVBUixlQUFPQyxFQUFQLENBQVUsU0FBVixFQUFxQixZQUFZO0FBQzdCQyw4QkFBa0JGLE1BQWxCO0FBQ0gsU0FGRDs7QUFJQUUsMEJBQWtCRixNQUFsQjtBQUNILEtBckJEO0FBdUJILENBNUJEIiwiZmlsZSI6Imhlcm1lcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdGhlcm1lcy5qcyAyMDE2LTA2LTE2XG5cdEdhbWJpbyBHbWJIXG5cdGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG5cdENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuXHRSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcblx0W2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCAkdGFibGUgPSAkKCcub3JkZXJzIC50YWJsZS1tYWluJyk7XG5cbiAgICAkdGFibGUub24oJ2luaXQuZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IF9pbml0U2luZ2xlQWN0aW9uID0gZnVuY3Rpb24gKCR0YWJsZSkge1xuICAgICAgICAgICAgJHRhYmxlLmZpbmQoJy5idG4tZ3JvdXAuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmRlcklkID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdFJvd0FjdGlvbiA9ICR0YWJsZS5kYXRhKCdkZWZhdWx0Um93QWN0aW9uJykgfHwgJ2VkaXQnO1xuXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdoZXJtZXNfc2hpcHBpbmcnLCAnaGVybWVzJyksXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9oZXJtZXNfb3JkZXIucGhwP29yZGVyc19pZD0nICsgb3JkZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdoZXJtZXMtc2luZ2xlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2hlcm1lcy1zaW5nbGUnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnaGVybWVzLXNpbmdsZSdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICR0YWJsZS5vbignZHJhdy5kdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9pbml0U2luZ2xlQWN0aW9uKCR0YWJsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF9pbml0U2luZ2xlQWN0aW9uKCR0YWJsZSk7XG4gICAgfSk7XG5cbn0pO1xuIl19
