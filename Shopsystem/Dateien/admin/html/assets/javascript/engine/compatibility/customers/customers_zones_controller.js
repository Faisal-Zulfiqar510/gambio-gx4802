'use strict';

/* --------------------------------------------------------------
 customers_zones_controller.js 2017-03-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * The Component for handling the federal state dropdown depending on the country.
 * The field will be blacked out if there are no federal states for the selected
 * country.
 */
gx.compatibility.module('customers_zones_controller', ['form', 'xhr'], function (data) {

    'use strict';

    // ########## VARIABLE INITIALIZATION ##########

    var $this = $(this),
        $customerStates = $('select[name=customers_state]'),
        $deliveryStates = $('select[name=delivery_state]'),
        $billingStates = $('select[name=billing_state]'),
        $customerFormGroup = $('select[name=customers_state]').closest('div.grid'),
        $deliveryFormGroup = $('select[name=delivery_state]').closest('div.grid'),
        $billingFormGroup = $('select[name=billing_state]').closest('div.grid'),
        defaults = {
        loadStates: 'admin.php?do=Zones/OrderAddressEdit',
        customersCountry: 'select[name=customers_country]',
        deliveryCountry: 'select[name=delivery_country_iso_code_2]',
        billingCountry: 'select[name=billing_country_iso_code_2]'

    },
        options = $.extend(true, {}, defaults, data),
        module = {};

    var _changeHandler = function _changeHandler(e) {
        var dataset = jse.libs.form.getData($this);
        dataset.selectors = e.data.selectors;

        jse.libs.xhr.ajax({ url: options.loadStates, data: dataset }, true).done(function (result) {

            var $selector;
            var $selectorFormGroup;

            switch (result.selector) {
                case 'customers_country':
                    $selector = $customerStates;
                    $selectorFormGroup = $customerFormGroup;
                    break;
                case 'delivery_country':
                    $selector = $deliveryStates;
                    $selectorFormGroup = $deliveryFormGroup;
                    break;
                case 'billing_country':
                    $selector = $billingStates;
                    $selectorFormGroup = $billingFormGroup;
                    break;
            }

            if (result.success) {

                $selector.children('option').remove();
                $selector.prop("disabled", false);

                $.each(result.data, function (key, value) {
                    if (value.selected) {
                        $selector.append($("<option selected/>").val(value.name).text(value.name));
                    } else {
                        $selector.append($("<option />").val(value.name).text(value.name));
                    }
                });

                $selectorFormGroup.show();
            } else {
                $selectorFormGroup.hide();
                $selector.prop("disabled", true);
            }
        });
    };

    // ########## INITIALIZATION ##########

    /**
     * Init function of the widget
     * @constructor
     */
    module.init = function (done) {

        $this.on('change', options.customersCountry, {
            'selectors': {
                'country': 'customers_country',
                'state': 'customers_state',
                'selected': 'select_customers_state'
            }
        }, _changeHandler).on('change', options.deliveryCountry, {
            'selectors': {
                'country': 'delivery_country',
                'state': 'delivery_state',
                'selected': 'select_delivery_state'
            }
        }, _changeHandler).on('change', options.billingCountry, {
            'selectors': {
                'country': 'billing_country',
                'state': 'billing_state',
                'selected': 'select_billing_state'
            }
        }, _changeHandler);

        $this.find(options.customersCountry).trigger('change', {
            'selectors': {
                'country': 'customers_country',
                'state': 'customers_state',
                'selected': 'select_customers_state'
            }
        });
        $this.find(options.deliveryCountry).trigger('change', {
            'selectors': {
                'country': 'delivery_country',
                'state': 'delivery_state',
                'selected': 'select_delivery_state'
            }
        });
        $this.find(options.billingCountry).trigger('change', {
            'selectors': {
                'country': 'billing_country',
                'state': 'billing_state',
                'selected': 'select_billing_state'
            }
        });

        done();
    };

    // Return data to widget engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbWVycy9jdXN0b21lcnNfem9uZXNfY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGN1c3RvbWVyU3RhdGVzIiwiJGRlbGl2ZXJ5U3RhdGVzIiwiJGJpbGxpbmdTdGF0ZXMiLCIkY3VzdG9tZXJGb3JtR3JvdXAiLCJjbG9zZXN0IiwiJGRlbGl2ZXJ5Rm9ybUdyb3VwIiwiJGJpbGxpbmdGb3JtR3JvdXAiLCJkZWZhdWx0cyIsImxvYWRTdGF0ZXMiLCJjdXN0b21lcnNDb3VudHJ5IiwiZGVsaXZlcnlDb3VudHJ5IiwiYmlsbGluZ0NvdW50cnkiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NoYW5nZUhhbmRsZXIiLCJlIiwiZGF0YXNldCIsImpzZSIsImxpYnMiLCJmb3JtIiwiZ2V0RGF0YSIsInNlbGVjdG9ycyIsInhociIsImFqYXgiLCJ1cmwiLCJkb25lIiwicmVzdWx0IiwiJHNlbGVjdG9yIiwiJHNlbGVjdG9yRm9ybUdyb3VwIiwic2VsZWN0b3IiLCJzdWNjZXNzIiwiY2hpbGRyZW4iLCJyZW1vdmUiLCJwcm9wIiwiZWFjaCIsImtleSIsInZhbHVlIiwic2VsZWN0ZWQiLCJhcHBlbmQiLCJ2YWwiLCJuYW1lIiwidGV4dCIsInNob3ciLCJoaWRlIiwiaW5pdCIsIm9uIiwiZmluZCIsInRyaWdnZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSw0QkFESixFQUdJLENBQ0ksTUFESixFQUVJLEtBRkosQ0FISixFQVFJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7O0FBRUEsUUFBSUMsUUFBUUMsRUFBRSxJQUFGLENBQVo7QUFBQSxRQUNJQyxrQkFBa0JELEVBQUUsOEJBQUYsQ0FEdEI7QUFBQSxRQUVJRSxrQkFBa0JGLEVBQUUsNkJBQUYsQ0FGdEI7QUFBQSxRQUdJRyxp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a0JqQyxRQUFRRixlQVAxQixFQU8yQztBQUNuQyx5QkFBYTtBQUNULDJCQUFXLGtCQURGO0FBRVQseUJBQVMsZ0JBRkE7QUFHVCw0QkFBWTtBQUhIO0FBRHNCLFNBUDNDLEVBYU9JLGNBYlAsRUFjSytCLEVBZEwsQ0FjUSxRQWRSLEVBY2tCakMsUUFBUUQsY0FkMUIsRUFjMEM7QUFDbEMseUJBQWE7QUFDVCwyQkFBVyxpQkFERjtBQUVULHlCQUFTLGVBRkE7QUFHVCw0QkFBWTtBQUhIO0FBRHFCLFNBZDFDLEVBb0JPRyxjQXBCUDs7QUFzQkFoQixjQUFNZ0QsSUFBTixDQUFXbEMsUUFBUUgsZ0JBQW5CLEVBQXFDc0MsT0FBckMsQ0FBNkMsUUFBN0MsRUFBdUQ7QUFDbkQseUJBQWE7QUFDVCwyQkFBVyxtQkFERjtBQUVULHlCQUFTLGlCQUZBO0FBR1QsNEJBQVk7QUFISDtBQURzQyxTQUF2RDtBQU9BakQsY0FBTWdELElBQU4sQ0FBV2xDLFFBQVFGLGVBQW5CLEVBQW9DcUMsT0FBcEMsQ0FBNEMsUUFBNUMsRUFBc0Q7QUFDbEQseUJBQWE7QUFDVCwyQkFBVyxrQkFERjtBQUVULHlCQUFTLGdCQUZBO0FBR1QsNEJBQVk7QUFISDtBQURxQyxTQUF0RDtBQU9BakQsY0FBTWdELElBQU4sQ0FBV2xDLFFBQVFELGNBQW5CLEVBQW1Db0MsT0FBbkMsQ0FBMkMsUUFBM0MsRUFBcUQ7QUFDakQseUJBQWE7QUFDVCwyQkFBVyxpQkFERjtBQUVULHlCQUFTLGVBRkE7QUFHVCw0QkFBWTtBQUhIO0FBRG9DLFNBQXJEOztBQVFBdEI7QUFDSCxLQS9DRDs7QUFpREE7QUFDQSxXQUFPN0IsTUFBUDtBQUNILENBNUlMIiwiZmlsZSI6ImN1c3RvbWVycy9jdXN0b21lcnNfem9uZXNfY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY3VzdG9tZXJzX3pvbmVzX2NvbnRyb2xsZXIuanMgMjAxNy0wMy0yMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogVGhlIENvbXBvbmVudCBmb3IgaGFuZGxpbmcgdGhlIGZlZGVyYWwgc3RhdGUgZHJvcGRvd24gZGVwZW5kaW5nIG9uIHRoZSBjb3VudHJ5LlxuICogVGhlIGZpZWxkIHdpbGwgYmUgYmxhY2tlZCBvdXQgaWYgdGhlcmUgYXJlIG5vIGZlZGVyYWwgc3RhdGVzIGZvciB0aGUgc2VsZWN0ZWRcbiAqIGNvdW50cnkuXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdjdXN0b21lcnNfem9uZXNfY29udHJvbGxlcicsXG5cbiAgICBbXG4gICAgICAgICdmb3JtJyxcbiAgICAgICAgJ3hocidcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gIyMjIyMjIyMjIyBWQVJJQUJMRSBJTklUSUFMSVpBVElPTiAjIyMjIyMjIyMjXG5cbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICRjdXN0b21lclN0YXRlcyA9ICQoJ3NlbGVjdFtuYW1lPWN1c3RvbWVyc19zdGF0ZV0nKSxcbiAgICAgICAgICAgICRkZWxpdmVyeVN0YXRlcyA9ICQoJ3NlbGVjdFtuYW1lPWRlbGl2ZXJ5X3N0YXRlXScpLFxuICAgICAgICAgICAgJGJpbGxpbmdTdGF0ZXMgPSAkKCdzZWxlY3RbbmFtZT1iaWxsaW5nX3N0YXRlXScpLFxuXG4gICAgICAgICAgICAkY3VzdG9tZXJGb3JtR3JvdXAgPSAkKCdzZWxlY3RbbmFtZT1jdXN0b21lcnNfc3RhdGVdJykuY2xvc2VzdCgnZGl2LmdyaWQnKSxcbiAgICAgICAgICAgICRkZWxpdmVyeUZvcm1Hcm91cCA9ICQoJ3NlbGVjdFtuYW1lPWRlbGl2ZXJ5X3N0YXRlXScpLmNsb3Nlc3QoJ2Rpdi5ncmlkJyksXG4gICAgICAgICAgICAkYmlsbGluZ0Zvcm1Hcm91cCA9ICQoJ3NlbGVjdFtuYW1lPWJpbGxpbmdfc3RhdGVdJykuY2xvc2VzdCgnZGl2LmdyaWQnKSxcblxuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgbG9hZFN0YXRlczogJ2FkbWluLnBocD9kbz1ab25lcy9PcmRlckFkZHJlc3NFZGl0JyxcbiAgICAgICAgICAgICAgICBjdXN0b21lcnNDb3VudHJ5OiAnc2VsZWN0W25hbWU9Y3VzdG9tZXJzX2NvdW50cnldJyxcbiAgICAgICAgICAgICAgICBkZWxpdmVyeUNvdW50cnk6ICdzZWxlY3RbbmFtZT1kZWxpdmVyeV9jb3VudHJ5X2lzb19jb2RlXzJdJyxcbiAgICAgICAgICAgICAgICBiaWxsaW5nQ291bnRyeTogJ3NlbGVjdFtuYW1lPWJpbGxpbmdfY291bnRyeV9pc29fY29kZV8yXScsXG5cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cblxuICAgICAgICB2YXIgX2NoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGRhdGFzZXQgPSBqc2UubGlicy5mb3JtLmdldERhdGEoJHRoaXMpO1xuICAgICAgICAgICAgZGF0YXNldC5zZWxlY3RvcnMgPSBlLmRhdGEuc2VsZWN0b3JzO1xuXG4gICAgICAgICAgICBqc2UubGlicy54aHIuYWpheCh7dXJsOiBvcHRpb25zLmxvYWRTdGF0ZXMsIGRhdGE6IGRhdGFzZXR9LCB0cnVlKS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcblxuICAgICAgICAgICAgICAgIHZhciAkc2VsZWN0b3I7XG4gICAgICAgICAgICAgICAgdmFyICRzZWxlY3RvckZvcm1Hcm91cDtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAocmVzdWx0LnNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2N1c3RvbWVyc19jb3VudHJ5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3RvciA9ICRjdXN0b21lclN0YXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3RvckZvcm1Hcm91cCA9ICRjdXN0b21lckZvcm1Hcm91cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWxpdmVyeV9jb3VudHJ5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3RvciA9ICRkZWxpdmVyeVN0YXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3RvckZvcm1Hcm91cCA9ICRkZWxpdmVyeUZvcm1Hcm91cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdiaWxsaW5nX2NvdW50cnknOlxuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yID0gJGJpbGxpbmdTdGF0ZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0b3JGb3JtR3JvdXAgPSAkYmlsbGluZ0Zvcm1Hcm91cDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuXG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3Rvci5jaGlsZHJlbignb3B0aW9uJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3Rvci5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChyZXN1bHQuZGF0YSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3Rvci5hcHBlbmQoJChcIjxvcHRpb24gc2VsZWN0ZWQvPlwiKS52YWwodmFsdWUubmFtZSkudGV4dCh2YWx1ZS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3Rvci5hcHBlbmQoJChcIjxvcHRpb24gLz5cIikudmFsKHZhbHVlLm5hbWUpLnRleHQodmFsdWUubmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0b3JGb3JtR3JvdXAuc2hvdygpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yRm9ybUdyb3VwLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gIyMjIyMjIyMjIyBJTklUSUFMSVpBVElPTiAjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgZnVuY3Rpb24gb2YgdGhlIHdpZGdldFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2NoYW5nZScsIG9wdGlvbnMuY3VzdG9tZXJzQ291bnRyeSwge1xuICAgICAgICAgICAgICAgICdzZWxlY3RvcnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb3VudHJ5JzogJ2N1c3RvbWVyc19jb3VudHJ5JyxcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXRlJzogJ2N1c3RvbWVyc19zdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICdzZWxlY3RlZCc6ICdzZWxlY3RfY3VzdG9tZXJzX3N0YXRlJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIF9jaGFuZ2VIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgb3B0aW9ucy5kZWxpdmVyeUNvdW50cnksIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdG9ycyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb3VudHJ5JzogJ2RlbGl2ZXJ5X2NvdW50cnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3N0YXRlJzogJ2RlbGl2ZXJ5X3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZWxlY3RlZCc6ICdzZWxlY3RfZGVsaXZlcnlfc3RhdGUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBfY2hhbmdlSGFuZGxlcilcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsIG9wdGlvbnMuYmlsbGluZ0NvdW50cnksIHtcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdG9ycyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb3VudHJ5JzogJ2JpbGxpbmdfY291bnRyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhdGUnOiAnYmlsbGluZ19zdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2VsZWN0ZWQnOiAnc2VsZWN0X2JpbGxpbmdfc3RhdGUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBfY2hhbmdlSGFuZGxlcik7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy5jdXN0b21lcnNDb3VudHJ5KS50cmlnZ2VyKCdjaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgJ3NlbGVjdG9ycyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvdW50cnknOiAnY3VzdG9tZXJzX2NvdW50cnknLFxuICAgICAgICAgICAgICAgICAgICAnc3RhdGUnOiAnY3VzdG9tZXJzX3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkJzogJ3NlbGVjdF9jdXN0b21lcnNfc3RhdGUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKG9wdGlvbnMuZGVsaXZlcnlDb3VudHJ5KS50cmlnZ2VyKCdjaGFuZ2UnLCB7XG4gICAgICAgICAgICAgICAgJ3NlbGVjdG9ycyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvdW50cnknOiAnZGVsaXZlcnlfY291bnRyeScsXG4gICAgICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdkZWxpdmVyeV9zdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICdzZWxlY3RlZCc6ICdzZWxlY3RfZGVsaXZlcnlfc3RhdGUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKG9wdGlvbnMuYmlsbGluZ0NvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAnc2VsZWN0b3JzJzoge1xuICAgICAgICAgICAgICAgICAgICAnY291bnRyeSc6ICdiaWxsaW5nX2NvdW50cnknLFxuICAgICAgICAgICAgICAgICAgICAnc3RhdGUnOiAnYmlsbGluZ19zdGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICdzZWxlY3RlZCc6ICdzZWxlY3RfYmlsbGluZ19zdGF0ZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIHdpZGdldCBlbmdpbmVcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
