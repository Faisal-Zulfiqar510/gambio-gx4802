'use strict';

/* --------------------------------------------------------------
   hermeshsi_ordersoverview.js 2019-10-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
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
					text: jse.core.lang.translate('hermeshsi_ordersoverview_hermeshsi_label', 'module_center_module'),
					href: jse.core.config.get('appUrl') + '/admin/admin.php?do=HermesHSI/PrepareLabel&oID=' + orderId,
					class: 'hermeshsi-single',
					data: { configurationValue: 'hermeshsi-single' },
					isDefault: defaultRowAction === 'hermeshsi-single'
				});
			});
		};

		$table.on('draw.dt', function () {
			return _initSingleAction($table);
		});
		_initSingleAction($table);
	});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm1lc2hzaV9vcmRlcnNvdmVydmlldy5qcyJdLCJuYW1lcyI6WyIkIiwiJHRhYmxlIiwib24iLCJfaW5pdFNpbmdsZUFjdGlvbiIsIiR0aGVUYWJsZSIsImZpbmQiLCJlYWNoIiwib3JkZXJJZCIsInBhcmVudHMiLCJkYXRhIiwiZGVmYXVsdFJvd0FjdGlvbiIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJhZGRBY3Rpb24iLCJ0ZXh0IiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJocmVmIiwiY29uZmlnIiwiZ2V0IiwiY2xhc3MiLCJjb25maWd1cmF0aW9uVmFsdWUiLCJpc0RlZmF1bHQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsRUFBRSxZQUFZO0FBQ2I7O0FBRUEsS0FBTUMsU0FBU0QsRUFBRSxxQkFBRixDQUFmOztBQUVBQyxRQUFPQyxFQUFQLENBQVUsU0FBVixFQUFxQixZQUFZO0FBQ2hDLE1BQU1DLG9CQUFvQixTQUFwQkEsaUJBQW9CLENBQVVDLFNBQVYsRUFBcUI7QUFDOUNBLGFBQVVDLElBQVYsQ0FBZSxxQkFBZixFQUFzQ0MsSUFBdEMsQ0FBMkMsWUFBWTtBQUN0RCxRQUFNQyxVQUFVUCxFQUFFLElBQUYsRUFBUVEsT0FBUixDQUFnQixJQUFoQixFQUFzQkMsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBaEI7QUFBQSxRQUNDQyxtQkFBbUJOLFVBQVVLLElBQVYsQ0FBZSx5QkFBZixLQUE2QyxNQURqRTs7QUFHQUUsUUFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCQyxTQUF6QixDQUFtQ2QsRUFBRSxJQUFGLENBQW5DLEVBQTRDO0FBQzNDZSxXQUFNSixJQUFJSyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QiwwQ0FBeEIsRUFBb0Usc0JBQXBFLENBRHFDO0FBRTNDQyxXQUFNUixJQUFJSyxJQUFKLENBQVNJLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLGlEQUFoQyxHQUFvRmQsT0FGL0M7QUFHM0NlLFlBQU8sa0JBSG9DO0FBSTNDYixXQUFNLEVBQUNjLG9CQUFvQixrQkFBckIsRUFKcUM7QUFLM0NDLGdCQUFXZCxxQkFBcUI7QUFMVyxLQUE1QztBQU9BLElBWEQ7QUFZQSxHQWJEOztBQWVBVCxTQUFPQyxFQUFQLENBQVUsU0FBVixFQUFxQjtBQUFBLFVBQU1DLGtCQUFrQkYsTUFBbEIsQ0FBTjtBQUFBLEdBQXJCO0FBQ0FFLG9CQUFrQkYsTUFBbEI7QUFDQSxFQWxCRDtBQW1CQSxDQXhCRCIsImZpbGUiOiJoZXJtZXNoc2lfb3JkZXJzb3ZlcnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgaGVybWVzaHNpX29yZGVyc292ZXJ2aWV3LmpzIDIwMTktMTAtMDFcbiAgIEdhbWJpbyBHbWJIXG4gICBodHRwOi8vd3d3LmdhbWJpby5kZVxuICAgQ29weXJpZ2h0IChjKSAyMDE5IEdhbWJpbyBHbWJIXG4gICBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiAgIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiovXG5cbiQoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdFxuXHRjb25zdCAkdGFibGUgPSAkKCcub3JkZXJzIC50YWJsZS1tYWluJyk7XG5cdFxuXHQkdGFibGUub24oJ2luaXQuZHQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0Y29uc3QgX2luaXRTaW5nbGVBY3Rpb24gPSBmdW5jdGlvbiAoJHRoZVRhYmxlKSB7XG5cdFx0XHQkdGhlVGFibGUuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRjb25zdCBvcmRlcklkID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJyksXG5cdFx0XHRcdFx0ZGVmYXVsdFJvd0FjdGlvbiA9ICR0aGVUYWJsZS5kYXRhKCdpbml0LWRlZmF1bHQtcm93LWFjdGlvbicpIHx8ICdlZGl0Jztcblx0XHRcdFx0XG5cdFx0XHRcdGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuXHRcdFx0XHRcdHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdoZXJtZXNoc2lfb3JkZXJzb3ZlcnZpZXdfaGVybWVzaHNpX2xhYmVsJywgJ21vZHVsZV9jZW50ZXJfbW9kdWxlJyksXG5cdFx0XHRcdFx0aHJlZjoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1IZXJtZXNIU0kvUHJlcGFyZUxhYmVsJm9JRD0nICsgb3JkZXJJZCxcblx0XHRcdFx0XHRjbGFzczogJ2hlcm1lc2hzaS1zaW5nbGUnLFxuXHRcdFx0XHRcdGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdoZXJtZXNoc2ktc2luZ2xlJ30sXG5cdFx0XHRcdFx0aXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnaGVybWVzaHNpLXNpbmdsZScsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0JHRhYmxlLm9uKCdkcmF3LmR0JywgKCkgPT4gX2luaXRTaW5nbGVBY3Rpb24oJHRhYmxlKSk7XG5cdFx0X2luaXRTaW5nbGVBY3Rpb24oJHRhYmxlKTtcblx0fSk7XG59KTtcbiJdfQ==
