'use strict';

/* --------------------------------------------------------------
	geschaeftskundenversand-orderdetails.js 2016-08-31
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2016 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

$(function () {
    $('div.gkv_orderdetails').closest('div.frame-wrapper').hide();

    var gkvButtonDropdownHandler = function gkvButtonDropdownHandler(event) {
        var orderId = $(event.target).parents('tr').data('row-id') || $('body').find('#gm_order_id').val();
        window.location = jse.core.config.get('appUrl') + '/admin/admin.php?do=Geschaeftskundenversand/PrepareLabel&oID=' + orderId;
    };

    var interval_counter = 10,
        interval = setInterval(function () {
        if (jse.libs.button_dropdown && $('.js-button-dropdown').length) {
            clearInterval(interval);
            jse.libs.button_dropdown.mapAction($('.bottom-save-bar'), 'gkv_label_get', 'admin_labels', gkvButtonDropdownHandler);
        }
        if (interval_counter-- === 0) {
            clearInterval(interval);
        }
    }, 400);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdlc2NoYWVmdHNrdW5kZW52ZXJzYW5kLW9yZGVyZGV0YWlscy5qcyJdLCJuYW1lcyI6WyIkIiwiY2xvc2VzdCIsImhpZGUiLCJna3ZCdXR0b25Ecm9wZG93bkhhbmRsZXIiLCJldmVudCIsIm9yZGVySWQiLCJ0YXJnZXQiLCJwYXJlbnRzIiwiZGF0YSIsImZpbmQiLCJ2YWwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJpbnRlcnZhbF9jb3VudGVyIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJsZW5ndGgiLCJjbGVhckludGVydmFsIiwibWFwQWN0aW9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEVBQUUsWUFBWTtBQUNWQSxNQUFFLHNCQUFGLEVBQTBCQyxPQUExQixDQUFrQyxtQkFBbEMsRUFBdURDLElBQXZEOztBQUVBLFFBQUlDLDJCQUEyQixTQUEzQkEsd0JBQTJCLENBQVVDLEtBQVYsRUFBaUI7QUFDNUMsWUFBSUMsVUFBVUwsRUFBRUksTUFBTUUsTUFBUixFQUFnQkMsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEJDLElBQTlCLENBQW1DLFFBQW5DLEtBQWdEUixFQUFFLE1BQUYsRUFBVVMsSUFBVixDQUFlLGNBQWYsRUFBK0JDLEdBQS9CLEVBQTlEO0FBQ0FDLGVBQU9DLFFBQVAsR0FBa0JDLElBQUlDLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0MsK0RBQWhDLEdBQWtHWCxPQUFwSDtBQUNILEtBSEQ7O0FBS0EsUUFBSVksbUJBQW1CLEVBQXZCO0FBQUEsUUFDSUMsV0FBV0MsWUFBWSxZQUFZO0FBQy9CLFlBQUlOLElBQUlPLElBQUosQ0FBU0MsZUFBVCxJQUE0QnJCLEVBQUUscUJBQUYsRUFBeUJzQixNQUF6RCxFQUFpRTtBQUM3REMsMEJBQWNMLFFBQWQ7QUFDQUwsZ0JBQUlPLElBQUosQ0FBU0MsZUFBVCxDQUF5QkcsU0FBekIsQ0FBbUN4QixFQUFFLGtCQUFGLENBQW5DLEVBQTBELGVBQTFELEVBQTJFLGNBQTNFLEVBQTJGRyx3QkFBM0Y7QUFDSDtBQUNELFlBQUljLHVCQUF1QixDQUEzQixFQUE4QjtBQUMxQk0sMEJBQWNMLFFBQWQ7QUFDSDtBQUNKLEtBUlUsRUFRUixHQVJRLENBRGY7QUFVSCxDQWxCRCIsImZpbGUiOiJnZXNjaGFlZnRza3VuZGVudmVyc2FuZC1vcmRlcmRldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRnZXNjaGFlZnRza3VuZGVudmVyc2FuZC1vcmRlcmRldGFpbHMuanMgMjAxNi0wOC0zMVxuXHRHYW1iaW8gR21iSFxuXHRodHRwOi8vd3d3LmdhbWJpby5kZVxuXHRDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcblx0UmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG5cdFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuKi9cblxuJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnZGl2Lmdrdl9vcmRlcmRldGFpbHMnKS5jbG9zZXN0KCdkaXYuZnJhbWUtd3JhcHBlcicpLmhpZGUoKTtcblxuICAgIHZhciBna3ZCdXR0b25Ecm9wZG93bkhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIG9yZGVySWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5kYXRhKCdyb3ctaWQnKSB8fCAkKCdib2R5JykuZmluZCgnI2dtX29yZGVyX2lkJykudmFsKCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89R2VzY2hhZWZ0c2t1bmRlbnZlcnNhbmQvUHJlcGFyZUxhYmVsJm9JRD0nICsgb3JkZXJJZDtcbiAgICB9XG5cbiAgICB2YXIgaW50ZXJ2YWxfY291bnRlciA9IDEwLFxuICAgICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChqc2UubGlicy5idXR0b25fZHJvcGRvd24gJiYgJCgnLmpzLWJ1dHRvbi1kcm9wZG93bicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oJCgnLmJvdHRvbS1zYXZlLWJhcicpLCAnZ2t2X2xhYmVsX2dldCcsICdhZG1pbl9sYWJlbHMnLCBna3ZCdXR0b25Ecm9wZG93bkhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVydmFsX2NvdW50ZXItLSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA0MDApO1xufSk7XG4iXX0=
