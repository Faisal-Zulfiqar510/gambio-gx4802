'use strict';

/* --------------------------------------------------------------
   hermeshsi-orderdetails.js 2019-10-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

$(function () {
    $('div.hermeshsi_orderdetails').closest('div.frame-wrapper').hide();

    var hermeshsiButtonDropdownHandler = function hermeshsiButtonDropdownHandler(event) {
        var orderId = $(event.target).parents('tr').data('row-id') || $('body').find('#gm_order_id').val();
        window.location = jse.core.config.get('appUrl') + '/admin/admin.php?do=HermesHSI/PrepareLabel&oID=' + orderId;
    };

    var interval_counter = 10,
        interval = setInterval(function () {
        if (jse.libs.button_dropdown && $('.js-button-dropdown').length) {
            clearInterval(interval);
            jse.libs.button_dropdown.mapAction($('.bottom-save-bar'), 'hermeshsi_label_get', 'admin_labels', hermeshsiButtonDropdownHandler);
        }
        if (interval_counter-- === 0) {
            clearInterval(interval);
        }
    }, 400);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlcm1lc2hzaS1vcmRlcmRldGFpbHMuanMiXSwibmFtZXMiOlsiJCIsImNsb3Nlc3QiLCJoaWRlIiwiaGVybWVzaHNpQnV0dG9uRHJvcGRvd25IYW5kbGVyIiwiZXZlbnQiLCJvcmRlcklkIiwidGFyZ2V0IiwicGFyZW50cyIsImRhdGEiLCJmaW5kIiwidmFsIiwid2luZG93IiwibG9jYXRpb24iLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiaW50ZXJ2YWxfY291bnRlciIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJsaWJzIiwiYnV0dG9uX2Ryb3Bkb3duIiwibGVuZ3RoIiwiY2xlYXJJbnRlcnZhbCIsIm1hcEFjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVdBQSxFQUFFLFlBQVk7QUFDVkEsTUFBRSw0QkFBRixFQUFnQ0MsT0FBaEMsQ0FBd0MsbUJBQXhDLEVBQTZEQyxJQUE3RDs7QUFFQSxRQUFJQyxpQ0FBaUMsU0FBakNBLDhCQUFpQyxDQUFVQyxLQUFWLEVBQWlCO0FBQ2xELFlBQUlDLFVBQVVMLEVBQUVJLE1BQU1FLE1BQVIsRUFBZ0JDLE9BQWhCLENBQXdCLElBQXhCLEVBQThCQyxJQUE5QixDQUFtQyxRQUFuQyxLQUFnRFIsRUFBRSxNQUFGLEVBQVVTLElBQVYsQ0FBZSxjQUFmLEVBQStCQyxHQUEvQixFQUE5RDtBQUNBQyxlQUFPQyxRQUFQLEdBQWtCQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLGlEQUFoQyxHQUFvRlgsT0FBdEc7QUFDSCxLQUhEOztBQUtBLFFBQUlZLG1CQUFtQixFQUF2QjtBQUFBLFFBQ0lDLFdBQVdDLFlBQVksWUFBWTtBQUMvQixZQUFJTixJQUFJTyxJQUFKLENBQVNDLGVBQVQsSUFBNEJyQixFQUFFLHFCQUFGLEVBQXlCc0IsTUFBekQsRUFBaUU7QUFDN0RDLDBCQUFjTCxRQUFkO0FBQ0FMLGdCQUFJTyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJHLFNBQXpCLENBQW1DeEIsRUFBRSxrQkFBRixDQUFuQyxFQUEwRCxxQkFBMUQsRUFBaUYsY0FBakYsRUFBaUdHLDhCQUFqRztBQUNIO0FBQ0QsWUFBSWMsdUJBQXVCLENBQTNCLEVBQThCO0FBQzFCTSwwQkFBY0wsUUFBZDtBQUNIO0FBQ0osS0FSVSxFQVFSLEdBUlEsQ0FEZjtBQVVILENBbEJEIiwiZmlsZSI6Imhlcm1lc2hzaS1vcmRlcmRldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgaGVybWVzaHNpLW9yZGVyZGV0YWlscy5qcyAyMDE5LTEwLTIzXG4gICBHYW1iaW8gR21iSFxuICAgaHR0cDovL3d3dy5nYW1iaW8uZGVcbiAgIENvcHlyaWdodCAoYykgMjAxOSBHYW1iaW8gR21iSFxuICAgUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gICBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuXG5cbiQoZnVuY3Rpb24gKCkge1xuICAgICQoJ2Rpdi5oZXJtZXNoc2lfb3JkZXJkZXRhaWxzJykuY2xvc2VzdCgnZGl2LmZyYW1lLXdyYXBwZXInKS5oaWRlKCk7XG5cbiAgICB2YXIgaGVybWVzaHNpQnV0dG9uRHJvcGRvd25IYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBvcmRlcklkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RyJykuZGF0YSgncm93LWlkJykgfHwgJCgnYm9keScpLmZpbmQoJyNnbV9vcmRlcl9pZCcpLnZhbCgpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUhlcm1lc0hTSS9QcmVwYXJlTGFiZWwmb0lEPScgKyBvcmRlcklkO1xuICAgIH1cblxuICAgIHZhciBpbnRlcnZhbF9jb3VudGVyID0gMTAsXG4gICAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93biAmJiAkKCcuanMtYnV0dG9uLWRyb3Bkb3duJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkKCcuYm90dG9tLXNhdmUtYmFyJyksICdoZXJtZXNoc2lfbGFiZWxfZ2V0JywgJ2FkbWluX2xhYmVscycsIGhlcm1lc2hzaUJ1dHRvbkRyb3Bkb3duSGFuZGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWxfY291bnRlci0tID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDQwMCk7XG59KTtcbiJdfQ==
