'use strict';

/* --------------------------------------------------------------
 orders_parcel_tracking.js 2015-08-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Order Tracking Codes Controller
 *
 * @module Controllers/orders_parcel_tracking
 */
gx.controllers.module('orders_parcel_tracking', ['fallback'],

/** @lends module:Controllers/orders_parcel_tracking */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _addTrackingCode = function _addTrackingCode(event) {

        event.stopPropagation();

        var orderId = options.orderId;
        var trackingNumber = $('#tracking-number').val();
        var parcelServiceId = $('#delivery-service option:selected').val();
        var isReturnDelivery = $('#isReturnDelivery').prop('checked') ? 'true' : 'false';
        var shipmentType = $('#shipmentType').val();

        console.log(options);

        $.ajax({
            url: './admin.php?do=OrdersModalsAjax/StoreTrackingNumber',
            data: {
                orderId: orderId,
                trackingNumber: trackingNumber,
                parcelServiceId: parcelServiceId,
                isReturnDelivery: isReturnDelivery,
                shipmentType: shipmentType,
                pageToken: jse.core.config.get('pageToken')
            },
            method: 'POST',
            dataType: 'JSON',
            success: function success(response) {
                if (response[0] === 'error') {
                    jse.libs.modal.message({
                        title: jse.core.lang.translate('error', 'messages'),
                        content: jse.core.lang.translate('TEXT_ADD_TRACKING_CODE_ERROR', 'orders')
                    });

                    return;
                }

                location.reload();
            }
        });

        return false;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Init function of the widget
     */
    module.init = function (done) {
        $('#tracking_code_wrapper a.add-tracking-code').on('click', function (event) {
            event.preventDefault();

            var modal = $('.add-tracking-number.modal-body');

            modal.dialog({
                'title': jse.core.lang.translate('HEADING_TRACKING_CODE', 'orders'),
                'modal': true,
                'dialogClass': 'gx-container',
                'buttons': [{
                    'text': jse.core.lang.translate('close', 'buttons'),
                    'class': 'btn',
                    'click': function click() {
                        $(this).dialog('close');
                    }
                }, {
                    'text': jse.core.lang.translate('add', 'buttons'),
                    'class': 'btn btn-primary',
                    'click': _addTrackingCode
                }],
                'width': 420
            });
        });

        done();
    };

    // Return data to widget engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfcGFyY2VsX3RyYWNraW5nLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2FkZFRyYWNraW5nQ29kZSIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwib3JkZXJJZCIsInRyYWNraW5nTnVtYmVyIiwidmFsIiwicGFyY2VsU2VydmljZUlkIiwiaXNSZXR1cm5EZWxpdmVyeSIsInByb3AiLCJzaGlwbWVudFR5cGUiLCJjb25zb2xlIiwibG9nIiwiYWpheCIsInVybCIsInBhZ2VUb2tlbiIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJtZXRob2QiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImxpYnMiLCJtb2RhbCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJjb250ZW50IiwibG9jYXRpb24iLCJyZWxvYWQiLCJpbml0IiwiZG9uZSIsIm9uIiwicHJldmVudERlZmF1bHQiLCJkaWFsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksd0JBREosRUFHSSxDQUFDLFVBQUQsQ0FISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBcEJkOzs7QUFzQkk7Ozs7O0FBS0FELGFBQVMsRUEzQmI7O0FBNkJBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJTyxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFVQyxLQUFWLEVBQWlCOztBQUVwQ0EsY0FBTUMsZUFBTjs7QUFFQSxZQUFNQyxVQUFVTCxRQUFRSyxPQUF4QjtBQUNBLFlBQU1DLGlCQUFpQlIsRUFBRSxrQkFBRixFQUFzQlMsR0FBdEIsRUFBdkI7QUFDQSxZQUFNQyxrQkFBa0JWLEVBQUUsbUNBQUYsRUFBdUNTLEdBQXZDLEVBQXhCO0FBQ0EsWUFBTUUsbUJBQW1CWCxFQUFFLG1CQUFGLEVBQXVCWSxJQUF2QixDQUE0QixTQUE1QixJQUF3QyxNQUF4QyxHQUFpRCxPQUExRTtBQUNBLFlBQU1DLGVBQWViLEVBQUUsZUFBRixFQUFtQlMsR0FBbkIsRUFBckI7O0FBRUFLLGdCQUFRQyxHQUFSLENBQVliLE9BQVo7O0FBRUFGLFVBQUVnQixJQUFGLENBQU87QUFDSEMsaUJBQUsscURBREY7QUFFSG5CLGtCQUFNO0FBQ0ZTLGdDQURFO0FBRUZDLDhDQUZFO0FBR0ZFLGdEQUhFO0FBSUZDLGtEQUpFO0FBS0ZFLDBDQUxFO0FBTUZLLDJCQUFXQyxJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFdBQXBCO0FBTlQsYUFGSDtBQVVIQyxvQkFBUSxNQVZMO0FBV0hDLHNCQUFVLE1BWFA7QUFZSEMscUJBQVMsaUJBQVVDLFFBQVYsRUFBb0I7QUFDekIsb0JBQUdBLFNBQVMsQ0FBVCxNQUFnQixPQUFuQixFQUEyQjtBQUN2QlAsd0JBQUlRLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxPQUFmLENBQXVCO0FBQ25CQywrQkFBT1gsSUFBSUMsSUFBSixDQUFTVyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBakMsQ0FEWTtBQUVuQkMsaUNBQVNkLElBQUlDLElBQUosQ0FBU1csSUFBVCxDQUFjQyxTQUFkLENBQXdCLDhCQUF4QixFQUF3RCxRQUF4RDtBQUZVLHFCQUF2Qjs7QUFLQTtBQUNIOztBQUVERSx5QkFBU0MsTUFBVDtBQUNIO0FBdkJFLFNBQVA7O0FBMEJBLGVBQU8sS0FBUDtBQUNILEtBdkNEOztBQXlDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBdEMsV0FBT3VDLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCckMsVUFBRSw0Q0FBRixFQUFnRHNDLEVBQWhELENBQW1ELE9BQW5ELEVBQ0ksVUFBU2pDLEtBQVQsRUFBZ0I7QUFDWkEsa0JBQU1rQyxjQUFOOztBQUVBLGdCQUFNWCxRQUFRNUIsRUFBRSxpQ0FBRixDQUFkOztBQUVBNEIsa0JBQU1ZLE1BQU4sQ0FBYTtBQUNULHlCQUFTckIsSUFBSUMsSUFBSixDQUFTVyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsdUJBQXhCLEVBQWlELFFBQWpELENBREE7QUFFVCx5QkFBUyxJQUZBO0FBR1QsK0JBQWUsY0FITjtBQUlULDJCQUFXLENBQ1A7QUFDSSw0QkFBUWIsSUFBSUMsSUFBSixDQUFTVyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsT0FBeEIsRUFBaUMsU0FBakMsQ0FEWjtBQUVJLDZCQUFTLEtBRmI7QUFHSSw2QkFBUyxpQkFBWTtBQUNqQmhDLDBCQUFFLElBQUYsRUFBUXdDLE1BQVIsQ0FBZSxPQUFmO0FBQ0g7QUFMTCxpQkFETyxFQVFQO0FBQ0ksNEJBQVFyQixJQUFJQyxJQUFKLENBQVNXLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixLQUF4QixFQUErQixTQUEvQixDQURaO0FBRUksNkJBQVMsaUJBRmI7QUFHSSw2QkFBUzVCO0FBSGIsaUJBUk8sQ0FKRjtBQWtCVCx5QkFBUztBQWxCQSxhQUFiO0FBb0JILFNBMUJMOztBQTZCQWlDO0FBQ0gsS0EvQkQ7O0FBaUNBO0FBQ0EsV0FBT3hDLE1BQVA7QUFDSCxDQW5JTCIsImZpbGUiOiJvcmRlcnMvb3JkZXJzX3BhcmNlbF90cmFja2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gb3JkZXJzX3BhcmNlbF90cmFja2luZy5qcyAyMDE1LTA4LTI3XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBPcmRlciBUcmFja2luZyBDb2RlcyBDb250cm9sbGVyXG4gKlxuICogQG1vZHVsZSBDb250cm9sbGVycy9vcmRlcnNfcGFyY2VsX3RyYWNraW5nXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnb3JkZXJzX3BhcmNlbF90cmFja2luZycsXG5cbiAgICBbJ2ZhbGxiYWNrJ10sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpDb250cm9sbGVycy9vcmRlcnNfcGFyY2VsX3RyYWNraW5nICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfYWRkVHJhY2tpbmdDb2RlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBjb25zdCBvcmRlcklkID0gb3B0aW9ucy5vcmRlcklkO1xuICAgICAgICAgICAgY29uc3QgdHJhY2tpbmdOdW1iZXIgPSAkKCcjdHJhY2tpbmctbnVtYmVyJykudmFsKCk7XG4gICAgICAgICAgICBjb25zdCBwYXJjZWxTZXJ2aWNlSWQgPSAkKCcjZGVsaXZlcnktc2VydmljZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IGlzUmV0dXJuRGVsaXZlcnkgPSAkKCcjaXNSZXR1cm5EZWxpdmVyeScpLnByb3AoJ2NoZWNrZWQnKT8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICAgICAgICAgIGNvbnN0IHNoaXBtZW50VHlwZSA9ICQoJyNzaGlwbWVudFR5cGUnKS52YWwoKTtcbiAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPU9yZGVyc01vZGFsc0FqYXgvU3RvcmVUcmFja2luZ051bWJlcicsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBvcmRlcklkLFxuICAgICAgICAgICAgICAgICAgICB0cmFja2luZ051bWJlcixcbiAgICAgICAgICAgICAgICAgICAgcGFyY2VsU2VydmljZUlkLFxuICAgICAgICAgICAgICAgICAgICBpc1JldHVybkRlbGl2ZXJ5LFxuICAgICAgICAgICAgICAgICAgICBzaGlwbWVudFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlWzBdID09PSAnZXJyb3InKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9BRERfVFJBQ0tJTkdfQ09ERV9FUlJPUicsICdvcmRlcnMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgZnVuY3Rpb24gb2YgdGhlIHdpZGdldFxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCgnI3RyYWNraW5nX2NvZGVfd3JhcHBlciBhLmFkZC10cmFja2luZy1jb2RlJykub24oJ2NsaWNrJyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kYWwgPSAkKCcuYWRkLXRyYWNraW5nLW51bWJlci5tb2RhbC1ib2R5Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbW9kYWwuZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdIRUFESU5HX1RSQUNLSU5HX0NPREUnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpYWxvZ0NsYXNzJzogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2FkZCcsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBfYWRkVHJhY2tpbmdDb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCc6IDQyMFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gd2lkZ2V0IGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
