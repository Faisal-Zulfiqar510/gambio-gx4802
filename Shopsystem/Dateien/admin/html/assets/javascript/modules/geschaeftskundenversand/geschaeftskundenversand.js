'use strict';

/* --------------------------------------------------------------
	geschaeftskundenversand.js 2016-07-06
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

        var _initSingleAction = function _initSingleAction($theTable) {
            $theTable.find('.btn-group.dropdown').each(function () {
                var orderId = $(this).parents('tr').data('id'),
                    defaultRowAction = $theTable.data('init-default-row-action') || 'edit';

                jse.libs.button_dropdown.addAction($(this), {
                    text: jse.core.lang.translate('gkv_label_get', 'module_center_module'),
                    href: jse.core.config.get('appUrl') + '/admin/admin.php?do=Geschaeftskundenversand/PrepareLabel&oID=' + orderId,
                    class: 'gkv-single',
                    data: { configurationValue: 'gkv-single' },
                    isDefault: defaultRowAction === 'gkv-single'
                });
            });
        };

        /*
        const _initBulkAction = function() {
            var isDefault = $table.data('defaultBulkAction') === 'gkv-bulk';
            jse.libs.button_dropdown.addAction($('.bulk-action'), {
                text: jse.core.lang.translate('gkv_label_get', 'module_center_module'),
                href: jse.core.config.get('appUrl') + '/admin/admin.php?do=Geschaeftskundenversand/PrepareLabelBulk',
                data: {configurationValue: 'gkv-bulk'},
                isDefault: isDefault,
            });
        }
        */

        $table.on('draw.dt', function () {
            return _initSingleAction($table);
        });

        _initSingleAction($table);
        // _initBulkAction();
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdlc2NoYWVmdHNrdW5kZW52ZXJzYW5kLmpzIl0sIm5hbWVzIjpbIiQiLCIkdGFibGUiLCJvbiIsIl9pbml0U2luZ2xlQWN0aW9uIiwiJHRoZVRhYmxlIiwiZmluZCIsImVhY2giLCJvcmRlcklkIiwicGFyZW50cyIsImRhdGEiLCJkZWZhdWx0Um93QWN0aW9uIiwianNlIiwibGlicyIsImJ1dHRvbl9kcm9wZG93biIsImFkZEFjdGlvbiIsInRleHQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImhyZWYiLCJjb25maWciLCJnZXQiLCJjbGFzcyIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsImlzRGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVdBQSxFQUFFLFlBQVk7QUFDVjs7QUFFQSxRQUFNQyxTQUFTRCxFQUFFLHFCQUFGLENBQWY7O0FBRUFDLFdBQU9DLEVBQVAsQ0FBVSxTQUFWLEVBQXFCLFlBQVk7O0FBRTdCLFlBQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQVVDLFNBQVYsRUFBcUI7QUFDM0NBLHNCQUFVQyxJQUFWLENBQWUscUJBQWYsRUFBc0NDLElBQXRDLENBQTJDLFlBQVk7QUFDbkQsb0JBQU1DLFVBQVVQLEVBQUUsSUFBRixFQUFRUSxPQUFSLENBQWdCLElBQWhCLEVBQXNCQyxJQUF0QixDQUEyQixJQUEzQixDQUFoQjtBQUFBLG9CQUNJQyxtQkFBbUJOLFVBQVVLLElBQVYsQ0FBZSx5QkFBZixLQUE2QyxNQURwRTs7QUFHQUUsb0JBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FBbUNkLEVBQUUsSUFBRixDQUFuQyxFQUE0QztBQUN4Q2UsMEJBQU1KLElBQUlLLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGVBQXhCLEVBQXlDLHNCQUF6QyxDQURrQztBQUV4Q0MsMEJBQU1SLElBQUlLLElBQUosQ0FBU0ksTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0MsK0RBQWhDLEdBQWtHZCxPQUZoRTtBQUd4Q2UsMkJBQU8sWUFIaUM7QUFJeENiLDBCQUFNLEVBQUNjLG9CQUFvQixZQUFyQixFQUprQztBQUt4Q0MsK0JBQVdkLHFCQUFxQjtBQUxRLGlCQUE1QztBQU9ILGFBWEQ7QUFZSCxTQWJEOztBQWVBOzs7Ozs7Ozs7Ozs7QUFZQVQsZUFBT0MsRUFBUCxDQUFVLFNBQVYsRUFBcUI7QUFBQSxtQkFBTUMsa0JBQWtCRixNQUFsQixDQUFOO0FBQUEsU0FBckI7O0FBRUFFLDBCQUFrQkYsTUFBbEI7QUFDQTtBQUNILEtBakNEO0FBa0NILENBdkNEIiwiZmlsZSI6Imdlc2NoYWVmdHNrdW5kZW52ZXJzYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Z2VzY2hhZWZ0c2t1bmRlbnZlcnNhbmQuanMgMjAxNi0wNy0wNlxuXHRHYW1iaW8gR21iSFxuXHRodHRwOi8vd3d3LmdhbWJpby5kZVxuXHRDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcblx0UmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG5cdFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cblxuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBjb25zdCAkdGFibGUgPSAkKCcub3JkZXJzIC50YWJsZS1tYWluJyk7XG5cbiAgICAkdGFibGUub24oJ2luaXQuZHQnLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgY29uc3QgX2luaXRTaW5nbGVBY3Rpb24gPSBmdW5jdGlvbiAoJHRoZVRhYmxlKSB7XG4gICAgICAgICAgICAkdGhlVGFibGUuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVySWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFJvd0FjdGlvbiA9ICR0aGVUYWJsZS5kYXRhKCdpbml0LWRlZmF1bHQtcm93LWFjdGlvbicpIHx8ICdlZGl0JztcblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZ2t2X2xhYmVsX2dldCcsICdtb2R1bGVfY2VudGVyX21vZHVsZScpLFxuICAgICAgICAgICAgICAgICAgICBocmVmOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUdlc2NoYWVmdHNrdW5kZW52ZXJzYW5kL1ByZXBhcmVMYWJlbCZvSUQ9JyArIG9yZGVySWQsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnZ2t2LXNpbmdsZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdna3Ytc2luZ2xlJ30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ2drdi1zaW5nbGUnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKlxuICAgICAgICBjb25zdCBfaW5pdEJ1bGtBY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpc0RlZmF1bHQgPSAkdGFibGUuZGF0YSgnZGVmYXVsdEJ1bGtBY3Rpb24nKSA9PT0gJ2drdi1idWxrJztcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCgnLmJ1bGstYWN0aW9uJyksIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZ2t2X2xhYmVsX2dldCcsICdtb2R1bGVfY2VudGVyX21vZHVsZScpLFxuICAgICAgICAgICAgICAgIGhyZWY6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89R2VzY2hhZWZ0c2t1bmRlbnZlcnNhbmQvUHJlcGFyZUxhYmVsQnVsaycsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2drdi1idWxrJ30sXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBpc0RlZmF1bHQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG4gICAgICAgICR0YWJsZS5vbignZHJhdy5kdCcsICgpID0+IF9pbml0U2luZ2xlQWN0aW9uKCR0YWJsZSkpO1xuXG4gICAgICAgIF9pbml0U2luZ2xlQWN0aW9uKCR0YWJsZSk7XG4gICAgICAgIC8vIF9pbml0QnVsa0FjdGlvbigpO1xuICAgIH0pO1xufSk7XG4iXX0=
