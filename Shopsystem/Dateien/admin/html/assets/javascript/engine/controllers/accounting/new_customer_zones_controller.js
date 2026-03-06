'use strict';

/* --------------------------------------------------------------
 new_customer_zones_controller.js 2017-03-27
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
gx.compatibility.module('new_customer_zones_controller', ['form', 'xhr'], function (data) {

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY291bnRpbmcvbmV3X2N1c3RvbWVyX3pvbmVzX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRjdXN0b21lclN0YXRlcyIsIiRkZWxpdmVyeVN0YXRlcyIsIiRiaWxsaW5nU3RhdGVzIiwiJGN1c3RvbWVyRm9ybUdyb3VwIiwiY2xvc2VzdCIsIiRkZWxpdmVyeUZvcm1Hcm91cCIsIiRiaWxsaW5nRm9ybUdyb3VwIiwiZGVmYXVsdHMiLCJsb2FkU3RhdGVzIiwiY3VzdG9tZXJzQ291bnRyeSIsImRlbGl2ZXJ5Q291bnRyeSIsImJpbGxpbmdDb3VudHJ5Iiwib3B0aW9ucyIsImV4dGVuZCIsIl9jaGFuZ2VIYW5kbGVyIiwiZSIsImRhdGFzZXQiLCJqc2UiLCJsaWJzIiwiZm9ybSIsImdldERhdGEiLCJzZWxlY3RvcnMiLCJ4aHIiLCJhamF4IiwidXJsIiwiZG9uZSIsInJlc3VsdCIsIiRzZWxlY3RvciIsIiRzZWxlY3RvckZvcm1Hcm91cCIsInNlbGVjdG9yIiwic3VjY2VzcyIsImNoaWxkcmVuIiwicmVtb3ZlIiwicHJvcCIsImVhY2giLCJrZXkiLCJ2YWx1ZSIsInNlbGVjdGVkIiwiYXBwZW5kIiwidmFsIiwibmFtZSIsInRleHQiLCJzaG93IiwiaGlkZSIsImluaXQiLCJvbiIsImZpbmQiLCJ0cmlnZ2VyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksK0JBREosRUFHSSxDQUNJLE1BREosRUFFSSxLQUZKLENBSEosRUFRSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBOztBQUVBLFFBQUlDLFFBQVFDLEVBQUUsSUFBRixDQUFaO0FBQUEsUUFDSUMsa0JBQWtCRCxFQUFFLDhCQUFGLENBRHRCO0FBQUEsUUFFSUUsa0JBQWtCRixFQUFFLDZCQUFGLENBRnRCO0FBQUEsUUFH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LEVBT2tCakMsUUFBUUYsZUFQMUIsRUFPMkM7QUFDbkMseUJBQWE7QUFDVCwyQkFBVyxrQkFERjtBQUVULHlCQUFTLGdCQUZBO0FBR1QsNEJBQVk7QUFISDtBQURzQixTQVAzQyxFQWFPSSxjQWJQLEVBY0srQixFQWRMLENBY1EsUUFkUixFQWNrQmpDLFFBQVFELGNBZDFCLEVBYzBDO0FBQ2xDLHlCQUFhO0FBQ1QsMkJBQVcsaUJBREY7QUFFVCx5QkFBUyxlQUZBO0FBR1QsNEJBQVk7QUFISDtBQURxQixTQWQxQyxFQW9CT0csY0FwQlA7O0FBc0JBaEIsY0FBTWdELElBQU4sQ0FBV2xDLFFBQVFILGdCQUFuQixFQUFxQ3NDLE9BQXJDLENBQTZDLFFBQTdDLEVBQXVEO0FBQ25ELHlCQUFhO0FBQ1QsMkJBQVcsbUJBREY7QUFFVCx5QkFBUyxpQkFGQTtBQUdULDRCQUFZO0FBSEg7QUFEc0MsU0FBdkQ7QUFPQWpELGNBQU1nRCxJQUFOLENBQVdsQyxRQUFRRixlQUFuQixFQUFvQ3FDLE9BQXBDLENBQTRDLFFBQTVDLEVBQXNEO0FBQ2xELHlCQUFhO0FBQ1QsMkJBQVcsa0JBREY7QUFFVCx5QkFBUyxnQkFGQTtBQUdULDRCQUFZO0FBSEg7QUFEcUMsU0FBdEQ7QUFPQWpELGNBQU1nRCxJQUFOLENBQVdsQyxRQUFRRCxjQUFuQixFQUFtQ29DLE9BQW5DLENBQTJDLFFBQTNDLEVBQXFEO0FBQ2pELHlCQUFhO0FBQ1QsMkJBQVcsaUJBREY7QUFFVCx5QkFBUyxlQUZBO0FBR1QsNEJBQVk7QUFISDtBQURvQyxTQUFyRDs7QUFRQXRCO0FBQ0gsS0EvQ0Q7O0FBaURBO0FBQ0EsV0FBTzdCLE1BQVA7QUFDSCxDQTVJTCIsImZpbGUiOiJhY2NvdW50aW5nL25ld19jdXN0b21lcl96b25lc19jb250cm9sbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBuZXdfY3VzdG9tZXJfem9uZXNfY29udHJvbGxlci5qcyAyMDE3LTAzLTI3XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBUaGUgQ29tcG9uZW50IGZvciBoYW5kbGluZyB0aGUgZmVkZXJhbCBzdGF0ZSBkcm9wZG93biBkZXBlbmRpbmcgb24gdGhlIGNvdW50cnkuXG4gKiBUaGUgZmllbGQgd2lsbCBiZSBibGFja2VkIG91dCBpZiB0aGVyZSBhcmUgbm8gZmVkZXJhbCBzdGF0ZXMgZm9yIHRoZSBzZWxlY3RlZFxuICogY291bnRyeS5cbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ25ld19jdXN0b21lcl96b25lc19jb250cm9sbGVyJyxcblxuICAgIFtcbiAgICAgICAgJ2Zvcm0nLFxuICAgICAgICAneGhyJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAjIyMjIyMjIyMjIFZBUklBQkxFIElOSVRJQUxJWkFUSU9OICMjIyMjIyMjIyNcblxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgJGN1c3RvbWVyU3RhdGVzID0gJCgnc2VsZWN0W25hbWU9Y3VzdG9tZXJzX3N0YXRlXScpLFxuICAgICAgICAgICAgJGRlbGl2ZXJ5U3RhdGVzID0gJCgnc2VsZWN0W25hbWU9ZGVsaXZlcnlfc3RhdGVdJyksXG4gICAgICAgICAgICAkYmlsbGluZ1N0YXRlcyA9ICQoJ3NlbGVjdFtuYW1lPWJpbGxpbmdfc3RhdGVdJyksXG5cbiAgICAgICAgICAgICRjdXN0b21lckZvcm1Hcm91cCA9ICQoJ3NlbGVjdFtuYW1lPWN1c3RvbWVyc19zdGF0ZV0nKS5jbG9zZXN0KCdkaXYuZ3JpZCcpLFxuICAgICAgICAgICAgJGRlbGl2ZXJ5Rm9ybUdyb3VwID0gJCgnc2VsZWN0W25hbWU9ZGVsaXZlcnlfc3RhdGVdJykuY2xvc2VzdCgnZGl2LmdyaWQnKSxcbiAgICAgICAgICAgICRiaWxsaW5nRm9ybUdyb3VwID0gJCgnc2VsZWN0W25hbWU9YmlsbGluZ19zdGF0ZV0nKS5jbG9zZXN0KCdkaXYuZ3JpZCcpLFxuXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBsb2FkU3RhdGVzOiAnYWRtaW4ucGhwP2RvPVpvbmVzL09yZGVyQWRkcmVzc0VkaXQnLFxuICAgICAgICAgICAgICAgIGN1c3RvbWVyc0NvdW50cnk6ICdzZWxlY3RbbmFtZT1jdXN0b21lcnNfY291bnRyeV0nLFxuICAgICAgICAgICAgICAgIGRlbGl2ZXJ5Q291bnRyeTogJ3NlbGVjdFtuYW1lPWRlbGl2ZXJ5X2NvdW50cnlfaXNvX2NvZGVfMl0nLFxuICAgICAgICAgICAgICAgIGJpbGxpbmdDb3VudHJ5OiAnc2VsZWN0W25hbWU9YmlsbGluZ19jb3VudHJ5X2lzb19jb2RlXzJdJyxcblxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuXG4gICAgICAgIHZhciBfY2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YXNldCA9IGpzZS5saWJzLmZvcm0uZ2V0RGF0YSgkdGhpcyk7XG4gICAgICAgICAgICBkYXRhc2V0LnNlbGVjdG9ycyA9IGUuZGF0YS5zZWxlY3RvcnM7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLnhoci5hamF4KHt1cmw6IG9wdGlvbnMubG9hZFN0YXRlcywgZGF0YTogZGF0YXNldH0sIHRydWUpLmRvbmUoZnVuY3Rpb24gKHJlc3VsdCkge1xuXG4gICAgICAgICAgICAgICAgdmFyICRzZWxlY3RvcjtcbiAgICAgICAgICAgICAgICB2YXIgJHNlbGVjdG9yRm9ybUdyb3VwO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChyZXN1bHQuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3VzdG9tZXJzX2NvdW50cnknOlxuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yID0gJGN1c3RvbWVyU3RhdGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yRm9ybUdyb3VwID0gJGN1c3RvbWVyRm9ybUdyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlbGl2ZXJ5X2NvdW50cnknOlxuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yID0gJGRlbGl2ZXJ5U3RhdGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yRm9ybUdyb3VwID0gJGRlbGl2ZXJ5Rm9ybUdyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2JpbGxpbmdfY291bnRyeSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0b3IgPSAkYmlsbGluZ1N0YXRlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3RvckZvcm1Hcm91cCA9ICRiaWxsaW5nRm9ybUdyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yLmNoaWxkcmVuKCdvcHRpb24nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHJlc3VsdC5kYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yLmFwcGVuZCgkKFwiPG9wdGlvbiBzZWxlY3RlZC8+XCIpLnZhbCh2YWx1ZS5uYW1lKS50ZXh0KHZhbHVlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdG9yLmFwcGVuZCgkKFwiPG9wdGlvbiAvPlwiKS52YWwodmFsdWUubmFtZSkudGV4dCh2YWx1ZS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3RvckZvcm1Hcm91cC5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0b3JGb3JtR3JvdXAuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0b3IucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAjIyMjIyMjIyMjIElOSVRJQUxJWkFUSU9OICMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBmdW5jdGlvbiBvZiB0aGUgd2lkZ2V0XG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgb3B0aW9ucy5jdXN0b21lcnNDb3VudHJ5LCB7XG4gICAgICAgICAgICAgICAgJ3NlbGVjdG9ycyc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvdW50cnknOiAnY3VzdG9tZXJzX2NvdW50cnknLFxuICAgICAgICAgICAgICAgICAgICAnc3RhdGUnOiAnY3VzdG9tZXJzX3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkJzogJ3NlbGVjdF9jdXN0b21lcnNfc3RhdGUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgX2NoYW5nZUhhbmRsZXIpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBvcHRpb25zLmRlbGl2ZXJ5Q291bnRyeSwge1xuICAgICAgICAgICAgICAgICAgICAnc2VsZWN0b3JzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvdW50cnknOiAnZGVsaXZlcnlfY291bnRyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3RhdGUnOiAnZGVsaXZlcnlfc3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkJzogJ3NlbGVjdF9kZWxpdmVyeV9zdGF0ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIF9jaGFuZ2VIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgb3B0aW9ucy5iaWxsaW5nQ291bnRyeSwge1xuICAgICAgICAgICAgICAgICAgICAnc2VsZWN0b3JzJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvdW50cnknOiAnYmlsbGluZ19jb3VudHJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdiaWxsaW5nX3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzZWxlY3RlZCc6ICdzZWxlY3RfYmlsbGluZ19zdGF0ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIF9jaGFuZ2VIYW5kbGVyKTtcblxuICAgICAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLmN1c3RvbWVyc0NvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAnc2VsZWN0b3JzJzoge1xuICAgICAgICAgICAgICAgICAgICAnY291bnRyeSc6ICdjdXN0b21lcnNfY291bnRyeScsXG4gICAgICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdjdXN0b21lcnNfc3RhdGUnLFxuICAgICAgICAgICAgICAgICAgICAnc2VsZWN0ZWQnOiAnc2VsZWN0X2N1c3RvbWVyc19zdGF0ZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy5kZWxpdmVyeUNvdW50cnkpLnRyaWdnZXIoJ2NoYW5nZScsIHtcbiAgICAgICAgICAgICAgICAnc2VsZWN0b3JzJzoge1xuICAgICAgICAgICAgICAgICAgICAnY291bnRyeSc6ICdkZWxpdmVyeV9jb3VudHJ5JyxcbiAgICAgICAgICAgICAgICAgICAgJ3N0YXRlJzogJ2RlbGl2ZXJ5X3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkJzogJ3NlbGVjdF9kZWxpdmVyeV9zdGF0ZSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQob3B0aW9ucy5iaWxsaW5nQ291bnRyeSkudHJpZ2dlcignY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICdzZWxlY3RvcnMnOiB7XG4gICAgICAgICAgICAgICAgICAgICdjb3VudHJ5JzogJ2JpbGxpbmdfY291bnRyeScsXG4gICAgICAgICAgICAgICAgICAgICdzdGF0ZSc6ICdiaWxsaW5nX3N0YXRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ3NlbGVjdGVkJzogJ3NlbGVjdF9iaWxsaW5nX3N0YXRlJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gd2lkZ2V0IGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
