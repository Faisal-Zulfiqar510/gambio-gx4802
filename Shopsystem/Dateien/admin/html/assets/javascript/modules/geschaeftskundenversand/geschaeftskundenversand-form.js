'use strict';

/* --------------------------------------------------------------
	geschaeftskundenversand-form.js 2016-08-22
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2016 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
	--------------------------------------------------------------
*/

$(function () {
    var $extView = $('#extd_view');
    $('#toggle-extd-view').on('click', function (e) {
        e.preventDefault();
        $('.extd-view').toggle();
        $extView.val($extView.val() === '0' ? '1' : '0');
    });
    if ($extView.val() === '1') {
        $('.extd-view').show();
    } else {
        $('.extd-view').hide();
    }

    $('select#gkv_product_index').on('change', function (e) {
        var $option = $('option:selected', this),
            product = $option.data('dhl_product'),
            isExport = $option.data('dhl_targetarea') !== 'domestic';

        $('input, select', 'div.dhl_service').attr('disabled', 'disabled');
        $('input[type="checkbox"]', 'div.dhl_service').closest('span.single-checkbox').addClass('disabled');
        $('input, select', 'div.dhl_service.' + product).removeAttr('disabled');
        $('input[type="checkbox"]', 'div.dhl_service.' + product).closest('span.single-checkbox').removeClass('disabled');
        $('div.exportdoc').toggle(isExport);
    });
    $('select#gkv_product_index').change();

    $('select.country').on('change', function (e) {
        var shipper_country = $('select.shipper_country').val(),
            receiver_country = $('select.receiver_country:visible').val(),
            isExport = shipper_country !== receiver_country;
        if (shipper_country !== undefined && receiver_country !== undefined) {
            if (isExport === true) {
                // alert('to export ' + shipper_country + ' ' + receiver_country);
                $('select#gkv_product_index').val($('select#gkv_product_index option').not('option[data-dhl_targetarea="domestic"]').first().val());
                $('select#gkv_product_index').trigger('change');
                $('div.exportdoc').show();
            } else {
                // alert('to domestic ' + shipper_country + ' ' + receiver_country);
                $('select#gkv_product_index').val($('select#gkv_product_index option[data-dhl_targetarea="domestic"]').first().val());
                $('select#gkv_product_index').trigger('change');
                $('div.exportdoc').hide();
            }
        }
    });

    $('select#receiver_type').on('change', function (e) {
        var $option = $('option:selected', this),
            receiver_type = $option.attr('value');
        $('div.receiver_data').each(function () {
            $(this).toggle($(this).hasClass('receiver_' + receiver_type));
        });
        $('select.country').first().trigger('change');
    });
    $('select#receiver_type').trigger('change');

    $('button#customize_shipper').on('click', function (e) {
        e.preventDefault();
        $('div.customize-shipper-button').remove();
        $('div.customize-shipper').css('display', 'inline-block');
    });

    $('button#customize_returnreceiver').on('click', function (e) {
        e.preventDefault();
        $('div.customize-returnreceiver-button').remove();
        $('div.customize-returnreceiver').css('display', 'inline-block');
    });

    $('input[name="identcheck"]').on('change', function (e) {
        $('.dhl_service_identcheck').toggle($(this).get(0).checked);
    });
    $('input[name="identcheck"]').trigger('change');

    /*
    $('select[name="exportdoc/exporttype"]').on('change', function(e) {
        const exportActivated = $(this).val() !== 'NONE';
        $('div.exportdoc').not($(this).closest('div.exportdoc')).toggle(exportActivated);
    });
    $('select[name="exportdoc/exporttype"]').trigger('change');
    */

    $('button#add_export_position').on('click', function (e) {
        e.preventDefault();
        var $newrow = $('table.exportpositions tr.template_row').clone(true);
        var newPosIdx = 1000 + Math.floor(Math.random() * 100000);
        $newrow.removeClass('template_row');
        $newrow.addClass('exportpos');
        $('input, select', $newrow).each(function () {
            var newName = $(this).attr('name').replace(/_x_/, '_' + newPosIdx + '_');
            $(this).attr('name', newName);
            $(this).removeAttr('disabled');
        });
        $('table.exportpositions tbody').append($newrow);
    });

    $('button.remove_row').on('click', function (e) {
        e.preventDefault();
        $(this).closest('tr').remove();
    });

    $('button#cod_helper').on('click', function (e) {
        e.preventDefault();
        var cod_amount = $(this).data('cod_amount');
        $('input[name="cashondelivery"]').val(cod_amount);
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdlc2NoYWVmdHNrdW5kZW52ZXJzYW5kLWZvcm0uanMiXSwibmFtZXMiOlsiJCIsIiRleHRWaWV3Iiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJ0b2dnbGUiLCJ2YWwiLCJzaG93IiwiaGlkZSIsIiRvcHRpb24iLCJwcm9kdWN0IiwiZGF0YSIsImlzRXhwb3J0IiwiYXR0ciIsImNsb3Nlc3QiLCJhZGRDbGFzcyIsInJlbW92ZUF0dHIiLCJyZW1vdmVDbGFzcyIsImNoYW5nZSIsInNoaXBwZXJfY291bnRyeSIsInJlY2VpdmVyX2NvdW50cnkiLCJ1bmRlZmluZWQiLCJub3QiLCJmaXJzdCIsInRyaWdnZXIiLCJyZWNlaXZlcl90eXBlIiwiZWFjaCIsImhhc0NsYXNzIiwicmVtb3ZlIiwiY3NzIiwiZ2V0IiwiY2hlY2tlZCIsIiRuZXdyb3ciLCJjbG9uZSIsIm5ld1Bvc0lkeCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIm5ld05hbWUiLCJyZXBsYWNlIiwiYXBwZW5kIiwiY29kX2Ftb3VudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxFQUFFLFlBQVk7QUFDVixRQUFJQyxXQUFXRCxFQUFFLFlBQUYsQ0FBZjtBQUNBQSxNQUFFLG1CQUFGLEVBQXVCRSxFQUF2QixDQUEwQixPQUExQixFQUFtQyxVQUFVQyxDQUFWLEVBQWE7QUFDNUNBLFVBQUVDLGNBQUY7QUFDQUosVUFBRSxZQUFGLEVBQWdCSyxNQUFoQjtBQUNBSixpQkFBU0ssR0FBVCxDQUFhTCxTQUFTSyxHQUFULE9BQW1CLEdBQW5CLEdBQXlCLEdBQXpCLEdBQStCLEdBQTVDO0FBQ0gsS0FKRDtBQUtBLFFBQUlMLFNBQVNLLEdBQVQsT0FBbUIsR0FBdkIsRUFBNEI7QUFDeEJOLFVBQUUsWUFBRixFQUFnQk8sSUFBaEI7QUFDSCxLQUZELE1BRU87QUFDSFAsVUFBRSxZQUFGLEVBQWdCUSxJQUFoQjtBQUNIOztBQUVEUixNQUFFLDBCQUFGLEVBQThCRSxFQUE5QixDQUFpQyxR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QUFFLElBQUYsRUFBUWdCLFVBQVIsQ0FBbUIsVUFBbkI7QUFDSCxTQUpEO0FBS0FoQixVQUFFLDZCQUFGLEVBQWlDd0MsTUFBakMsQ0FBd0NSLE9BQXhDO0FBQ0gsS0FaRDs7QUFjQWhDLE1BQUUsbUJBQUYsRUFBdUJFLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DLFVBQVVDLENBQVYsRUFBYTtBQUM1Q0EsVUFBRUMsY0FBRjtBQUNBSixVQUFFLElBQUYsRUFBUWMsT0FBUixDQUFnQixJQUFoQixFQUFzQmMsTUFBdEI7QUFDSCxLQUhEOztBQUtBNUIsTUFBRSxtQkFBRixFQUF1QkUsRUFBdkIsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBVUMsQ0FBVixFQUFhO0FBQzVDQSxVQUFFQyxjQUFGO0FBQ0EsWUFBSXFDLGFBQWF6QyxFQUFFLElBQUYsRUFBUVcsSUFBUixDQUFhLFlBQWIsQ0FBakI7QUFDQVgsVUFBRSw4QkFBRixFQUFrQ00sR0FBbEMsQ0FBc0NtQyxVQUF0QztBQUNILEtBSkQ7QUFNSCxDQXpHRCIsImZpbGUiOiJnZXNjaGFlZnRza3VuZGVudmVyc2FuZC1mb3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Z2VzY2hhZWZ0c2t1bmRlbnZlcnNhbmQtZm9ybS5qcyAyMDE2LTA4LTIyXG5cdEdhbWJpbyBHbWJIXG5cdGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG5cdENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuXHRSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcblx0W2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4qL1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgJGV4dFZpZXcgPSAkKCcjZXh0ZF92aWV3Jyk7XG4gICAgJCgnI3RvZ2dsZS1leHRkLXZpZXcnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJy5leHRkLXZpZXcnKS50b2dnbGUoKTtcbiAgICAgICAgJGV4dFZpZXcudmFsKCRleHRWaWV3LnZhbCgpID09PSAnMCcgPyAnMScgOiAnMCcpO1xuICAgIH0pO1xuICAgIGlmICgkZXh0Vmlldy52YWwoKSA9PT0gJzEnKSB7XG4gICAgICAgICQoJy5leHRkLXZpZXcnKS5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnLmV4dGQtdmlldycpLmhpZGUoKTtcbiAgICB9XG5cbiAgICAkKCdzZWxlY3QjZ2t2X3Byb2R1Y3RfaW5kZXgnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3QgJG9wdGlvbiA9ICQoJ29wdGlvbjpzZWxlY3RlZCcsIHRoaXMpLFxuICAgICAgICAgICAgcHJvZHVjdCA9ICRvcHRpb24uZGF0YSgnZGhsX3Byb2R1Y3QnKSxcbiAgICAgICAgICAgIGlzRXhwb3J0ID0gJG9wdGlvbi5kYXRhKCdkaGxfdGFyZ2V0YXJlYScpICE9PSAnZG9tZXN0aWMnO1xuICAgICAgICBcbiAgICAgICAgJCgnaW5wdXQsIHNlbGVjdCcsICdkaXYuZGhsX3NlcnZpY2UnKS5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICAkKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLCAnZGl2LmRobF9zZXJ2aWNlJykuY2xvc2VzdCgnc3Bhbi5zaW5nbGUtY2hlY2tib3gnKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgJCgnaW5wdXQsIHNlbGVjdCcsICdkaXYuZGhsX3NlcnZpY2UuJyArIHByb2R1Y3QpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICAgICQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScsICdkaXYuZGhsX3NlcnZpY2UuJyArIHByb2R1Y3QpLmNsb3Nlc3QoJ3NwYW4uc2luZ2xlLWNoZWNrYm94JykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICQoJ2Rpdi5leHBvcnRkb2MnKS50b2dnbGUoaXNFeHBvcnQpO1xuICAgIH0pO1xuICAgICQoJ3NlbGVjdCNna3ZfcHJvZHVjdF9pbmRleCcpLmNoYW5nZSgpO1xuXG4gICAgJCgnc2VsZWN0LmNvdW50cnknKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3Qgc2hpcHBlcl9jb3VudHJ5ID0gJCgnc2VsZWN0LnNoaXBwZXJfY291bnRyeScpLnZhbCgpLFxuICAgICAgICAgICAgcmVjZWl2ZXJfY291bnRyeSA9ICQoJ3NlbGVjdC5yZWNlaXZlcl9jb3VudHJ5OnZpc2libGUnKS52YWwoKSxcbiAgICAgICAgICAgIGlzRXhwb3J0ID0gc2hpcHBlcl9jb3VudHJ5ICE9PSByZWNlaXZlcl9jb3VudHJ5O1xuICAgICAgICBpZiAoc2hpcHBlcl9jb3VudHJ5ICE9PSB1bmRlZmluZWQgJiYgcmVjZWl2ZXJfY291bnRyeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoaXNFeHBvcnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyBhbGVydCgndG8gZXhwb3J0ICcgKyBzaGlwcGVyX2NvdW50cnkgKyAnICcgKyByZWNlaXZlcl9jb3VudHJ5KTtcbiAgICAgICAgICAgICAgICAkKCdzZWxlY3QjZ2t2X3Byb2R1Y3RfaW5kZXgnKS52YWwoJCgnc2VsZWN0I2drdl9wcm9kdWN0X2luZGV4IG9wdGlvbicpLm5vdCgnb3B0aW9uW2RhdGEtZGhsX3RhcmdldGFyZWE9XCJkb21lc3RpY1wiXScpLmZpcnN0KCkudmFsKCkpO1xuICAgICAgICAgICAgICAgICQoJ3NlbGVjdCNna3ZfcHJvZHVjdF9pbmRleCcpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICQoJ2Rpdi5leHBvcnRkb2MnKS5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KCd0byBkb21lc3RpYyAnICsgc2hpcHBlcl9jb3VudHJ5ICsgJyAnICsgcmVjZWl2ZXJfY291bnRyeSk7XG4gICAgICAgICAgICAgICAgJCgnc2VsZWN0I2drdl9wcm9kdWN0X2luZGV4JykudmFsKCQoJ3NlbGVjdCNna3ZfcHJvZHVjdF9pbmRleCBvcHRpb25bZGF0YS1kaGxfdGFyZ2V0YXJlYT1cImRvbWVzdGljXCJdJykuZmlyc3QoKS52YWwoKSk7XG4gICAgICAgICAgICAgICAgJCgnc2VsZWN0I2drdl9wcm9kdWN0X2luZGV4JykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgJCgnZGl2LmV4cG9ydGRvYycpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnc2VsZWN0I3JlY2VpdmVyX3R5cGUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgY29uc3QgJG9wdGlvbiA9ICQoJ29wdGlvbjpzZWxlY3RlZCcsIHRoaXMpLFxuICAgICAgICAgICAgcmVjZWl2ZXJfdHlwZSA9ICRvcHRpb24uYXR0cigndmFsdWUnKTtcbiAgICAgICAgJCgnZGl2LnJlY2VpdmVyX2RhdGEnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQodGhpcykudG9nZ2xlKCQodGhpcykuaGFzQ2xhc3MoJ3JlY2VpdmVyXycgKyByZWNlaXZlcl90eXBlKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdzZWxlY3QuY291bnRyeScpLmZpcnN0KCkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG4gICAgJCgnc2VsZWN0I3JlY2VpdmVyX3R5cGUnKS50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICQoJ2J1dHRvbiNjdXN0b21pemVfc2hpcHBlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCgnZGl2LmN1c3RvbWl6ZS1zaGlwcGVyLWJ1dHRvbicpLnJlbW92ZSgpO1xuICAgICAgICAkKCdkaXYuY3VzdG9taXplLXNoaXBwZXInKS5jc3MoJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJyk7XG4gICAgfSk7XG5cbiAgICAkKCdidXR0b24jY3VzdG9taXplX3JldHVybnJlY2VpdmVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAkKCdkaXYuY3VzdG9taXplLXJldHVybnJlY2VpdmVyLWJ1dHRvbicpLnJlbW92ZSgpO1xuICAgICAgICAkKCdkaXYuY3VzdG9taXplLXJldHVybnJlY2VpdmVyJykuY3NzKCdkaXNwbGF5JywgJ2lubGluZS1ibG9jaycpO1xuICAgIH0pO1xuXG4gICAgJCgnaW5wdXRbbmFtZT1cImlkZW50Y2hlY2tcIl0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgJCgnLmRobF9zZXJ2aWNlX2lkZW50Y2hlY2snKS50b2dnbGUoJCh0aGlzKS5nZXQoMCkuY2hlY2tlZCk7XG4gICAgfSk7XG4gICAgJCgnaW5wdXRbbmFtZT1cImlkZW50Y2hlY2tcIl0nKS50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgIC8qXG4gICAgJCgnc2VsZWN0W25hbWU9XCJleHBvcnRkb2MvZXhwb3J0dHlwZVwiXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnN0IGV4cG9ydEFjdGl2YXRlZCA9ICQodGhpcykudmFsKCkgIT09ICdOT05FJztcbiAgICAgICAgJCgnZGl2LmV4cG9ydGRvYycpLm5vdCgkKHRoaXMpLmNsb3Nlc3QoJ2Rpdi5leHBvcnRkb2MnKSkudG9nZ2xlKGV4cG9ydEFjdGl2YXRlZCk7XG4gICAgfSk7XG4gICAgJCgnc2VsZWN0W25hbWU9XCJleHBvcnRkb2MvZXhwb3J0dHlwZVwiXScpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICovXG5cbiAgICAkKCdidXR0b24jYWRkX2V4cG9ydF9wb3NpdGlvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0ICRuZXdyb3cgPSAkKCd0YWJsZS5leHBvcnRwb3NpdGlvbnMgdHIudGVtcGxhdGVfcm93JykuY2xvbmUodHJ1ZSk7XG4gICAgICAgIGxldCBuZXdQb3NJZHggPSAxMDAwICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAwMDAwKTtcbiAgICAgICAgJG5ld3Jvdy5yZW1vdmVDbGFzcygndGVtcGxhdGVfcm93Jyk7XG4gICAgICAgICRuZXdyb3cuYWRkQ2xhc3MoJ2V4cG9ydHBvcycpO1xuICAgICAgICAkKCdpbnB1dCwgc2VsZWN0JywgJG5ld3JvdykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBuZXdOYW1lID0gJCh0aGlzKS5hdHRyKCduYW1lJykucmVwbGFjZSgvX3hfLywgJ18nICsgbmV3UG9zSWR4ICsgJ18nKTtcbiAgICAgICAgICAgICQodGhpcykuYXR0cignbmFtZScsIG5ld05hbWUpO1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgndGFibGUuZXhwb3J0cG9zaXRpb25zIHRib2R5JykuYXBwZW5kKCRuZXdyb3cpO1xuICAgIH0pO1xuXG4gICAgJCgnYnV0dG9uLnJlbW92ZV9yb3cnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQodGhpcykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcbiAgICB9KTtcblxuICAgICQoJ2J1dHRvbiNjb2RfaGVscGVyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBsZXQgY29kX2Ftb3VudCA9ICQodGhpcykuZGF0YSgnY29kX2Ftb3VudCcpO1xuICAgICAgICAkKCdpbnB1dFtuYW1lPVwiY2FzaG9uZGVsaXZlcnlcIl0nKS52YWwoY29kX2Ftb3VudCk7XG4gICAgfSlcblxufSk7XG4iXX0=
