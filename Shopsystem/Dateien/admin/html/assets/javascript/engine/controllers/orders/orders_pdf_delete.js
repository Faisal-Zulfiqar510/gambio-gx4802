'use strict';

/* --------------------------------------------------------------
 orders_pdf_delete.js 2019-025
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Order PDF Delete Controller
 *
 * @module Controllers/orders_pdf_delete
 */
gx.controllers.module('orders_pdf_delete', ['xhr', 'fallback'],

/** @lends module:Controllers/orders_pdf_delete */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var $this = $(this),
        defaults = {},
        options = $.extend(true, {}, defaults, data),
        module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _deleteHandler = function _deleteHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        var $self = $(this),
            dataset = $.extend({}, $this.data(), jse.libs.fallback._data($this, 'orders_pdf_delete'));

        var href = 'lightbox_confirm.html?section=admin_orders&amp;message=DELETE_PDF_CONFIRM_MESSAGE&amp;' + 'buttons=cancel-delete';

        var t_a_tag = $('<a href="' + href + '"></a>');
        var tmp_lightbox_identifier = $(t_a_tag).lightbox_plugin({
            'lightbox_width': '360px'
        });

        $('#lightbox_package_' + tmp_lightbox_identifier).on('click', '.delete', function () {
            $.lightbox_plugin('close', tmp_lightbox_identifier);
            if ($self.hasClass('active')) {
                return false;
            }
            $self.addClass('active');

            var data = {
                'type': 'packingslip',
                'file': $self.attr('rel'),
                'id': $self.data('packing-slip-id'),
                'number': $self.data('packing-slip-number')
            };

            jse.libs.xhr.post({
                'url': 'request_port.php?module=OrderAdmin&action=deletePdf',
                'data': data
            }).done(function (response) {
                $self.closest('tr').remove();
                if ($('tr.' + options.type).length === 1) {
                    $('tr.' + options.type).show();
                }
                $('.page_token').val(response.page_token);
            });
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Init function of the widget
     */
    module.init = function (done) {
        $this.on('click', '.delete_pdf', _deleteHandler);
        done();
    };

    // Return data to widget engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfcGRmX2RlbGV0ZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9kZWxldGVIYW5kbGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsIiRzZWxmIiwiZGF0YXNldCIsImpzZSIsImxpYnMiLCJmYWxsYmFjayIsIl9kYXRhIiwiaHJlZiIsInRfYV90YWciLCJ0bXBfbGlnaHRib3hfaWRlbnRpZmllciIsImxpZ2h0Ym94X3BsdWdpbiIsIm9uIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsImF0dHIiLCJ4aHIiLCJwb3N0IiwiZG9uZSIsInJlc3BvbnNlIiwiY2xvc2VzdCIsInJlbW92ZSIsInR5cGUiLCJsZW5ndGgiLCJzaG93IiwidmFsIiwicGFnZV90b2tlbiIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksbUJBREosRUFHSSxDQUFDLEtBQUQsRUFBUSxVQUFSLENBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUMsUUFBUUMsRUFBRSxJQUFGLENBQVo7QUFBQSxRQUNJQyxXQUFXLEVBRGY7QUFBQSxRQUVJQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUZkO0FBQUEsUUFHSUQsU0FBUyxFQUhiOztBQUtBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJTyxpQkFBaUIsU0FBakJBLGNBQWlCLENBQVVDLEtBQVYsRUFBaUI7QUFDbENBLGNBQU1DLGNBQU47QUFDQUQsY0FBTUUsZUFBTjs7QUFFQSxZQUFJQyxRQUFRUixFQUFFLElBQUYsQ0FBWjtBQUFBLFlBQ0lTLFVBQVVULEVBQUVHLE1BQUYsQ0FBUyxFQUFULEVBQWFKLE1BQU1ELElBQU4sRUFBYixFQUEyQlksSUFBSUMsSUFBSixDQUFTQyxRQUFULENBQWtCQyxLQUFsQixDQUF3QmQsS0FBeEIsRUFBK0IsbUJBQS9CLENBQTNCLENBRGQ7O0FBR0EsWUFBSWUsT0FDQSwyRkFDQSx1QkFGSjs7QUFJQSxZQUFJQyxVQUFVZixFQUNWLGNBQWNjLElBQWQsR0FBcUIsUUFEWCxDQUFkO0FBR0EsWUFBSUUsMEJBQTBCaEIsRUFBRWUsT0FBRixFQUFXRSxlQUFYLENBQzFCO0FBQ0ksOEJBQWtCO0FBRHRCLFNBRDBCLENBQTlCOztBQUtBakIsVUFBRSx1QkFBdUJnQix1QkFBekIsRUFBa0RFLEVBQWxELENBQXFELE9BQXJELEVBQThELFNBQTlELEVBQXlFLFlBQVk7QUFDakZsQixjQUFFaUIsZUFBRixDQUFrQixPQUFsQixFQUEyQkQsdUJBQTNCO0FBQ0EsZ0JBQUlSLE1BQU1XLFFBQU4sQ0FBZSxRQUFmLENBQUosRUFBOEI7QUFDMUIsdUJBQU8sS0FBUDtBQUNIO0FBQ0RYLGtCQUFNWSxRQUFOLENBQWUsUUFBZjs7QUFFQSxnQkFBSXRCLE9BQU87QUFDUCx3QkFBUSxhQUREO0FBRVAsd0JBQVFVLE1BQU1hLElBQU4sQ0FBVyxLQUFYLENBRkQ7QUFHUCxzQkFBTWIsTUFBTVYsSUFBTixDQUFXLGlCQUFYLENBSEM7QUFJUCwwQkFBVVUsTUFBTVYsSUFBTixDQUFXLHFCQUFYO0FBSkgsYUFBWDs7QUFPQVksZ0JBQUlDLElBQUosQ0FBU1csR0FBVCxDQUFhQyxJQUFiLENBQWtCO0FBQ2QsdUJBQU8scURBRE87QUFFZCx3QkFBUXpCO0FBRk0sYUFBbEIsRUFHRzBCLElBSEgsQ0FHUSxVQUFVQyxRQUFWLEVBQW9CO0FBQ3hCakIsc0JBQU1rQixPQUFOLENBQWMsSUFBZCxFQUFvQkMsTUFBcEI7QUFDQSxvQkFBSTNCLEVBQUUsUUFBUUUsUUFBUTBCLElBQWxCLEVBQXdCQyxNQUF4QixLQUFtQyxDQUF2QyxFQUEwQztBQUN0QzdCLHNCQUFFLFFBQVFFLFFBQVEwQixJQUFsQixFQUF3QkUsSUFBeEI7QUFDSDtBQUNEOUIsa0JBQUUsYUFBRixFQUFpQitCLEdBQWpCLENBQXFCTixTQUFTTyxVQUE5QjtBQUNILGFBVEQ7QUFVSCxTQXhCRDtBQXlCSCxLQTVDRDs7QUE4Q0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQW5DLFdBQU9vQyxJQUFQLEdBQWMsVUFBVVQsSUFBVixFQUFnQjtBQUMxQnpCLGNBQU1tQixFQUFOLENBQVMsT0FBVCxFQUFrQixhQUFsQixFQUFpQ2QsY0FBakM7QUFDQW9CO0FBQ0gsS0FIRDs7QUFLQTtBQUNBLFdBQU8zQixNQUFQO0FBQ0gsQ0FwRkwiLCJmaWxlIjoib3JkZXJzL29yZGVyc19wZGZfZGVsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBvcmRlcnNfcGRmX2RlbGV0ZS5qcyAyMDE5LTAyNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgT3JkZXIgUERGIERlbGV0ZSBDb250cm9sbGVyXG4gKlxuICogQG1vZHVsZSBDb250cm9sbGVycy9vcmRlcnNfcGRmX2RlbGV0ZVxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ29yZGVyc19wZGZfZGVsZXRlJyxcblxuICAgIFsneGhyJywgJ2ZhbGxiYWNrJ10sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpDb250cm9sbGVycy9vcmRlcnNfcGRmX2RlbGV0ZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX2RlbGV0ZUhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0ID0gJC5leHRlbmQoe30sICR0aGlzLmRhdGEoKSwganNlLmxpYnMuZmFsbGJhY2suX2RhdGEoJHRoaXMsICdvcmRlcnNfcGRmX2RlbGV0ZScpKTtcblxuICAgICAgICAgICAgdmFyIGhyZWYgPVxuICAgICAgICAgICAgICAgICdsaWdodGJveF9jb25maXJtLmh0bWw/c2VjdGlvbj1hZG1pbl9vcmRlcnMmYW1wO21lc3NhZ2U9REVMRVRFX1BERl9DT05GSVJNX01FU1NBR0UmYW1wOycgK1xuICAgICAgICAgICAgICAgICdidXR0b25zPWNhbmNlbC1kZWxldGUnO1xuXG4gICAgICAgICAgICB2YXIgdF9hX3RhZyA9ICQoXG4gICAgICAgICAgICAgICAgJzxhIGhyZWY9XCInICsgaHJlZiArICdcIj48L2E+J1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHZhciB0bXBfbGlnaHRib3hfaWRlbnRpZmllciA9ICQodF9hX3RhZykubGlnaHRib3hfcGx1Z2luKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ2xpZ2h0Ym94X3dpZHRoJzogJzM2MHB4J1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjbGlnaHRib3hfcGFja2FnZV8nICsgdG1wX2xpZ2h0Ym94X2lkZW50aWZpZXIpLm9uKCdjbGljaycsICcuZGVsZXRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQubGlnaHRib3hfcGx1Z2luKCdjbG9zZScsIHRtcF9saWdodGJveF9pZGVudGlmaWVyKTtcbiAgICAgICAgICAgICAgICBpZiAoJHNlbGYuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICd0eXBlJzogJ3BhY2tpbmdzbGlwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpbGUnOiAkc2VsZi5hdHRyKCdyZWwnKSxcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogJHNlbGYuZGF0YSgncGFja2luZy1zbGlwLWlkJyksXG4gICAgICAgICAgICAgICAgICAgICdudW1iZXInOiAkc2VsZi5kYXRhKCdwYWNraW5nLXNsaXAtbnVtYmVyJylcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAganNlLmxpYnMueGhyLnBvc3Qoe1xuICAgICAgICAgICAgICAgICAgICAndXJsJzogJ3JlcXVlc3RfcG9ydC5waHA/bW9kdWxlPU9yZGVyQWRtaW4mYWN0aW9uPWRlbGV0ZVBkZicsXG4gICAgICAgICAgICAgICAgICAgICdkYXRhJzogZGF0YVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmNsb3Nlc3QoJ3RyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCd0ci4nICsgb3B0aW9ucy50eXBlKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ3RyLicgKyBvcHRpb25zLnR5cGUpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKCcucGFnZV90b2tlbicpLnZhbChyZXNwb25zZS5wYWdlX3Rva2VuKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBmdW5jdGlvbiBvZiB0aGUgd2lkZ2V0XG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLmRlbGV0ZV9wZGYnLCBfZGVsZXRlSGFuZGxlcik7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gd2lkZ2V0IGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
