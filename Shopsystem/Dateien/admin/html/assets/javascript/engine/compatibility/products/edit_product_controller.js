'use strict';

/* --------------------------------------------------------------
 edit_product_controller.js 2015-09-01 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Edit product controller
 *
 * This controller contains the dynamic form changes of the new_product page.
 *
 * @module Compatibility/edit_product_controller
 */
gx.compatibility.module('edit_product_controller', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js'],

/**  @lends module:Compatibility/edit_product_controller */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @var {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('.delete_personal_offer').on('click', function () {
            var t_quantity = $(this).closest('.old_personal_offer').find('input[name^="products_quantity_staffel_"]').val();
            var t_group_id = '' + $(this).closest('.personal_offers').prop('id').replace('scale_price_', '');

            $(this).closest('.personal_offers').find('.added_personal_offers').append('<input type="hidden" name="delete_products_quantity_staffel_' + t_group_id + '[]" value="' + t_quantity + '" />');
            $(this).closest('.old_personal_offer').remove();

            return false;
        });

        $('.add_personal_offer').on('click', function () {
            $(this).closest('.personal_offers').find('.added_personal_offers').append($(this).closest('.personal_offers').find('.new_personal_offer').html());
            $(this).closest('.personal_offers').find('.added_personal_offers input[name^="products_quantity_staffel_"]:last').val('');
            $(this).closest('.personal_offers').find('.added_personal_offers input[name^="products_price_staffel_"]:last').val('0');

            return false;
        });

        $('input[name=products_model]').bind('change', function () {
            if ($(this).val().match(/GIFT_/g)) {
                $('select[name=products_tax_class_id]').val(0);
                $('select[name=products_tax_class_id]').attr('disabled', 'disabled');
                $('select[name=products_tax_class_id]').parent().append('<span style="display: inline-block; margin: 0 0 0 20px; color: red;">' + '<?php echo TEXT_NO_TAX_RATE_BY_GIFT; ?></span>');
            } else if ($('select[name=products_tax_class_id]').attr('disabled')) {
                $('select[name=products_tax_class_id]').removeAttr('disabled');
                $('select[name=products_tax_class_id]').parent().find('span').remove();
            }
        });

        $('.category-details').sortable({
            // axis: 'y',
            items: '> .tab-section',
            containment: 'parent'
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3RzL2VkaXRfcHJvZHVjdF9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJpbml0IiwiZG9uZSIsIm9uIiwidF9xdWFudGl0eSIsImNsb3Nlc3QiLCJmaW5kIiwidmFsIiwidF9ncm91cF9pZCIsInByb3AiLCJyZXBsYWNlIiwiYXBwZW5kIiwicmVtb3ZlIiwiaHRtbCIsImJpbmQiLCJtYXRjaCIsImF0dHIiLCJwYXJlbnQiLCJyZW1vdmVBdHRyIiwic29ydGFibGUiLCJpdGVtcyIsImNvbnRhaW5tZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSx5QkFESixFQUdJLENBQ0lDLElBQUlDLE1BQUosR0FBYSwwQ0FEakIsRUFFSUQsSUFBSUMsTUFBSixHQUFhLHlDQUZqQixDQUhKOztBQVFJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7Ozs7QUFLQUgsYUFBUyxFQTNCYjs7QUE2QkE7QUFDQTtBQUNBOztBQUVBQSxXQUFPUyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQkwsVUFBRSx3QkFBRixFQUE0Qk0sRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsWUFBWTtBQUNoRCxnQkFBSUMsYUFBYVAsRUFBRSxJQUFGLEVBQVFRLE9BQVIsQ0FBZ0IscUJBQWhCLEVBQXVDQyxJQUF2QyxDQUNiLDJDQURhLEVBQ2dDQyxHQURoQyxFQUFqQjtBQUVBLGdCQUFJQyxhQUFhLEtBQUtYLEVBQUUsSUFBRixFQUFRUSxPQUFSLENBQWdCLGtCQUFoQixFQUFvQ0ksSUFBcEMsQ0FBeUMsSUFBekMsRUFBK0NDLE9BQS9DLENBQXVELGNBQXZELEVBQ2xCLEVBRGtCLENBQXRCOztBQUdBYixjQUFFLElBQUYsRUFBUVEsT0FBUixDQUFnQixrQkFBaEIsRUFBb0NDLElBQXBDLENBQXlDLHdCQUF6QyxFQUFtRUssTUFBbkUsQ0FDSSxpRUFBaUVILFVBQWpFLEdBQ0EsYUFEQSxHQUNnQkosVUFEaEIsR0FFQSxNQUhKO0FBSUFQLGNBQUUsSUFBRixFQUFRUSxPQUFSLENBQWdCLHFCQUFoQixFQUF1Q08sTUFBdkM7O0FBRUEsbUJBQU8sS0FBUDtBQUNILFNBYkQ7O0FBZUFmLFVBQUUscUJBQUYsRUFBeUJNLEVBQXpCLENBQTRCLE9BQTVCLEVBQXFDLFlBQVk7QUFDN0NOLGNBQUUsSUFBRixFQUFRUSxPQUFSLENBQWdCLGtCQUFoQixFQUFvQ0MsSUFBcEMsQ0FBeUMsd0JBQXpDLEVBQW1FSyxNQUFuRSxDQUEwRWQsRUFBRSxJQUFGLEVBQVFRLE9BQVIsQ0FDdEUsa0JBRHNFLEVBQ2xEQyxJQURrRCxDQUV0RSxxQkFGc0UsRUFFL0NPLElBRitDLEVBQTFFO0FBR0FoQixjQUFFLElBQUYsRUFBUVEsT0FBUixDQUFnQixrQkFBaEIsRUFBb0NDLElBQXBDLENBQ0ksdUVBREosRUFDNkVDLEdBRDdFLENBQ2lGLEVBRGpGO0FBRUFWLGNBQUUsSUFBRixFQUFRUSxPQUFSLENBQWdCLGtCQUFoQixFQUFvQ0MsSUFBcEMsQ0FDSSxvRUFESixFQUMwRUMsR0FEMUUsQ0FFSSxHQUZKOztBQUlBLG1CQUFPLEtBQVA7QUFDSCxTQVhEOztBQWFBVixVQUFFLDRCQUFGLEVBQWdDaUIsSUFBaEMsQ0FBcUMsUUFBckMsRUFBK0MsWUFBWTtBQUN2RCxnQkFBSWpCLEVBQUUsSUFBRixFQUFRVSxHQUFSLEdBQWNRLEtBQWQsQ0FBb0IsUUFBcEIsQ0FBSixFQUFtQztBQUMvQmxCLGtCQUFFLG9DQUFGLEVBQXdDVSxHQUF4QyxDQUE0QyxDQUE1QztBQUNBVixrQkFBRSxvQ0FBRixFQUF3Q21CLElBQXhDLENBQTZDLFVBQTdDLEVBQXlELFVBQXpEO0FBQ0FuQixrQkFBRSxvQ0FBRixFQUF3Q29CLE1BQXhDLEdBQWlETixNQUFqRCxDQUNJLDBFQUNBLGdEQUZKO0FBSUgsYUFQRCxNQU9PLElBQUlkLEVBQUUsb0NBQUYsRUFBd0NtQixJQUF4QyxDQUE2QyxVQUE3QyxDQUFKLEVBQThEO0FBQ2pFbkIsa0JBQUUsb0NBQUYsRUFBd0NxQixVQUF4QyxDQUFtRCxVQUFuRDtBQUNBckIsa0JBQUUsb0NBQUYsRUFBd0NvQixNQUF4QyxHQUFpRFgsSUFBakQsQ0FBc0QsTUFBdEQsRUFBOERNLE1BQTlEO0FBQ0g7QUFDSixTQVpEOztBQWNBZixVQUFFLG1CQUFGLEVBQXVCc0IsUUFBdkIsQ0FBZ0M7QUFDNUI7QUFDQUMsbUJBQU8sZ0JBRnFCO0FBRzVCQyx5QkFBYTtBQUhlLFNBQWhDOztBQU1BbkI7QUFDSCxLQWxERDs7QUFvREEsV0FBT1YsTUFBUDtBQUNILENBeEdMIiwiZmlsZSI6InByb2R1Y3RzL2VkaXRfcHJvZHVjdF9jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBlZGl0X3Byb2R1Y3RfY29udHJvbGxlci5qcyAyMDE1LTA5LTAxIGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBFZGl0IHByb2R1Y3QgY29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBjb250YWlucyB0aGUgZHluYW1pYyBmb3JtIGNoYW5nZXMgb2YgdGhlIG5ld19wcm9kdWN0IHBhZ2UuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L2VkaXRfcHJvZHVjdF9jb250cm9sbGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdlZGl0X3Byb2R1Y3RfY29udHJvbGxlcicsXG5cbiAgICBbXG4gICAgICAgIGpzZS5zb3VyY2UgKyAnL3ZlbmRvci9qcXVlcnktdWktZGlzdC9qcXVlcnktdWkubWluLmNzcycsXG4gICAgICAgIGpzZS5zb3VyY2UgKyAnL3ZlbmRvci9qcXVlcnktdWktZGlzdC9qcXVlcnktdWkubWluLmpzJ1xuICAgIF0sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9lZGl0X3Byb2R1Y3RfY29udHJvbGxlciAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCgnLmRlbGV0ZV9wZXJzb25hbF9vZmZlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdF9xdWFudGl0eSA9ICQodGhpcykuY2xvc2VzdCgnLm9sZF9wZXJzb25hbF9vZmZlcicpLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgICdpbnB1dFtuYW1lXj1cInByb2R1Y3RzX3F1YW50aXR5X3N0YWZmZWxfXCJdJykudmFsKCk7XG4gICAgICAgICAgICAgICAgdmFyIHRfZ3JvdXBfaWQgPSAnJyArICQodGhpcykuY2xvc2VzdCgnLnBlcnNvbmFsX29mZmVycycpLnByb3AoJ2lkJykucmVwbGFjZSgnc2NhbGVfcHJpY2VfJyxcbiAgICAgICAgICAgICAgICAgICAgJycpO1xuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcucGVyc29uYWxfb2ZmZXJzJykuZmluZCgnLmFkZGVkX3BlcnNvbmFsX29mZmVycycpLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRlbGV0ZV9wcm9kdWN0c19xdWFudGl0eV9zdGFmZmVsXycgKyB0X2dyb3VwX2lkICtcbiAgICAgICAgICAgICAgICAgICAgJ1tdXCIgdmFsdWU9XCInICsgdF9xdWFudGl0eSArXG4gICAgICAgICAgICAgICAgICAgICdcIiAvPicpO1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLm9sZF9wZXJzb25hbF9vZmZlcicpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJy5hZGRfcGVyc29uYWxfb2ZmZXInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcucGVyc29uYWxfb2ZmZXJzJykuZmluZCgnLmFkZGVkX3BlcnNvbmFsX29mZmVycycpLmFwcGVuZCgkKHRoaXMpLmNsb3Nlc3QoXG4gICAgICAgICAgICAgICAgICAgICcucGVyc29uYWxfb2ZmZXJzJykuZmluZChcbiAgICAgICAgICAgICAgICAgICAgJy5uZXdfcGVyc29uYWxfb2ZmZXInKS5odG1sKCkpO1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnBlcnNvbmFsX29mZmVycycpLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgICcuYWRkZWRfcGVyc29uYWxfb2ZmZXJzIGlucHV0W25hbWVePVwicHJvZHVjdHNfcXVhbnRpdHlfc3RhZmZlbF9cIl06bGFzdCcpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCcucGVyc29uYWxfb2ZmZXJzJykuZmluZChcbiAgICAgICAgICAgICAgICAgICAgJy5hZGRlZF9wZXJzb25hbF9vZmZlcnMgaW5wdXRbbmFtZV49XCJwcm9kdWN0c19wcmljZV9zdGFmZmVsX1wiXTpsYXN0JykudmFsKFxuICAgICAgICAgICAgICAgICAgICAnMCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9cHJvZHVjdHNfbW9kZWxdJykuYmluZCgnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnZhbCgpLm1hdGNoKC9HSUZUXy9nKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3RbbmFtZT1wcm9kdWN0c190YXhfY2xhc3NfaWRdJykudmFsKDApO1xuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3RbbmFtZT1wcm9kdWN0c190YXhfY2xhc3NfaWRdJykuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnc2VsZWN0W25hbWU9cHJvZHVjdHNfdGF4X2NsYXNzX2lkXScpLnBhcmVudCgpLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazsgbWFyZ2luOiAwIDAgMCAyMHB4OyBjb2xvcjogcmVkO1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzw/cGhwIGVjaG8gVEVYVF9OT19UQVhfUkFURV9CWV9HSUZUOyA/Pjwvc3Bhbj4nXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkKCdzZWxlY3RbbmFtZT1wcm9kdWN0c190YXhfY2xhc3NfaWRdJykuYXR0cignZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCdzZWxlY3RbbmFtZT1wcm9kdWN0c190YXhfY2xhc3NfaWRdJykucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnc2VsZWN0W25hbWU9cHJvZHVjdHNfdGF4X2NsYXNzX2lkXScpLnBhcmVudCgpLmZpbmQoJ3NwYW4nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnLmNhdGVnb3J5LWRldGFpbHMnKS5zb3J0YWJsZSh7XG4gICAgICAgICAgICAgICAgLy8gYXhpczogJ3knLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiAnPiAudGFiLXNlY3Rpb24nLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5tZW50OiAncGFyZW50J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
