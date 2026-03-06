'use strict';

/* --------------------------------------------------------------
 statistic_chart.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Statistic Chart Widget
 *
 * Widget for showing statistics
 *
 * Markup:
 * ```html
 * <div
 *     id="dashboard-chart"
 *     data-gx-widget="statistic_chart"
 *     data-statistic_chart-user-id="1"
 * ></div>
 * ```
 * Data-Attributes:
 * - `data-statistic_chart-user-id` is the userId from current logged in user
 *
 * Events:
 * - `get:data` loads the data from server (requires parameter)
 *
 * Example:
 * ```js
 * $('#dashboard-chart').trigger('get:data', {
        item: 'orders,' //  which statistic
 *      interval: 'today' // which value
 * });
 * ```
 * Retrieve data from server
 *
 * ```js
 * {
 *     item            : 'orders'  // Passed in via event trigger
 *     interval        : 1231232,  // Passed in via event trigger
 *     userId          : 1,        // Passed in via data attribute
 * }
 * ```
 *
 * The data returned from server should look like this:
 *
 * ```js
 * [
 *     { period: '2008', amount: 20 },
 *     { period: '2009', amount: 10 }
 * ]
 * ```
 *
 * @module Admin/Widgets/statistic_chart
 * @requires jQueryUI-Library
 * @ignore
 */
gx.widgets.module(
// Module name
'statistic_chart',

// Dependencies
[jse.source + '/vendor/raphael/raphael.js', jse.source + '/vendor/morris.js/morris.min.css', jse.source + '/vendor/morris.js/morris.min.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    // Widget Reference

    var $this = $(this);

    // User ID
    var myUserId = data.userId;

    // Item dropdown
    var $itemDropdown = $('.statistic-chart-dropdown');

    /**
     * Map item related values
     * Each items contains key values for use in this widget
     * @type {object}
     */
    var itemMap = {

        // Sales (Umsatz)
        sales: {
            apiUrl: './admin.php?do=Dashboard/getSalesStatisticsData',
            title: jse.core.lang.translate('STATISTICS_SALES', 'start')
        },

        // Visitors (Besucher)
        visitors: {
            apiUrl: './admin.php?do=Dashboard/getVisitorsStatisticsData',
            title: jse.core.lang.translate('STATISTICS_VISITORS', 'start')
        },

        // New Customers (Neue Kunden)
        newCustomers: {
            apiUrl: './admin.php?do=Dashboard/getNewCustomerStatisticsData',
            title: jse.core.lang.translate('STATISTICS_NEW_CUSTOMERS', 'start')
        },

        // Orders (Bestellungen)
        orders: {
            apiUrl: './admin.php?do=Dashboard/getOrderStatisticsData',
            title: jse.core.lang.translate('STATISTICS_ORDERS_COUNT', 'start')
        }
    };

    // Meta Object
    var module = {};

    // ------------------------------------------------------------------------
    // LOADING STATE
    // ------------------------------------------------------------------------

    /**
     * Turns on/off loading state
     * @param {boolean} isLoading - If true, the loading state will be triggered
     * @private
     */
    var _toggleLoading = function _toggleLoading(isLoading) {
        // Existant spinner element
        var $existantSpinner = $this.find('.loader');
        var isSpinnerAlreadyExists = $existantSpinner.length;

        // New spinner element
        var spinnerClass = 'loader fa fa-fw fa-spinner fa-spin';
        var $newSpinner = $('<i class="' + spinnerClass + '"></i>');

        // Look for existant spinner element and remove it
        if (isSpinnerAlreadyExists) {
            $existantSpinner.remove();
        }

        // Show new one if 'isLoading' argument is true
        if (isLoading) {
            $this.append($newSpinner);
        }

        return;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Retrieve data from server and builds the chart
     * The server request parameters should look like this:
     * @requires MorrisJS
     * @param {Event | jQuery} event
     * @param {string} interval
     * @param {string} [item] - If undefined, it will get value from dropdown
     * @private
     */
    var _buildChart = function _buildChart(event, interval, item) {

        // Clear element
        $this.empty();

        // Get item value from dropdown if not passed via argument
        if (!item) {
            item = $itemDropdown.find('option:selected').val();
        }

        // Throw error if item is not defined in map
        if (item && item in itemMap === false) {
            throw new Error('Invalid item!');
        }

        // Show loading spinner
        _toggleLoading(true);

        // Perform Request
        var request = $.ajax({
            url: itemMap[item].apiUrl,
            type: 'GET',
            dataType: 'JSON',
            data: {
                userId: myUserId,
                item: item,
                interval: interval
            }
        });

        // On success
        request.done(function (response) {

            // Hide loading spinner
            _toggleLoading(false);

            $this.empty();

            $.each(response.data, function () {
                this.amount = parseInt(this.amount);
            });

            // Draw chart
            Morris.Area({
                element: $this,
                data: response.data,
                xkey: 'period',
                ykeys: ['amount'],
                xLabels: response.type,
                labels: [itemMap[item].title],
                lineWidth: 2,
                eventStrokeWidth: 1,
                goalStrokeWidth: 1,
                fillOpacity: 0.25,
                behaveLikeLine: true,
                hideHover: 'auto',
                lineColors: ['#002337'],
                dateFormat: function dateFormat(timestamp) {
                    var date = new Date(timestamp);
                    var day = date.getDate().toString();
                    var month = (date.getMonth() + 1).toString();
                    var year = date.getFullYear().toString();
                    return (day[1] ? day : '0' + day[0]) + '.' + (month[1] ? month : '0' + month[0]) + '.' + year;
                }
            });
        });
    };

    // Initialize method of the widget, called by the engine.
    module.init = function (done) {
        // Delegate event
        $this.on('get:data', _buildChart);
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpc3RpY19jaGFydC5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwibXlVc2VySWQiLCJ1c2VySWQiLCIkaXRlbURyb3Bkb3duIiwiaXRlbU1hcCIsInNhbGVzIiwiYXBpVXJsIiwidGl0bGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInZpc2l0b3JzIiwibmV3Q3VzdG9tZXJzIiwib3JkZXJzIiwiX3RvZ2dsZUxvYWRpbmciLCJpc0xvYWRpbmciLCIkZXhpc3RhbnRTcGlubmVyIiwiZmluZCIsImlzU3Bpbm5lckFscmVhZHlFeGlzdHMiLCJsZW5ndGgiLCJzcGlubmVyQ2xhc3MiLCIkbmV3U3Bpbm5lciIsInJlbW92ZSIsImFwcGVuZCIsIl9idWlsZENoYXJ0IiwiZXZlbnQiLCJpbnRlcnZhbCIsIml0ZW0iLCJlbXB0eSIsInZhbCIsIkVycm9yIiwicmVxdWVzdCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YVR5cGUiLCJkb25lIiwicmVzcG9uc2UiLCJlYWNoIiwiYW1vdW50IiwicGFyc2VJbnQiLCJNb3JyaXMiLCJBcmVhIiwiZWxlbWVudCIsInhrZXkiLCJ5a2V5cyIsInhMYWJlbHMiLCJsYWJlbHMiLCJsaW5lV2lkdGgiLCJldmVudFN0cm9rZVdpZHRoIiwiZ29hbFN0cm9rZVdpZHRoIiwiZmlsbE9wYWNpdHkiLCJiZWhhdmVMaWtlTGluZSIsImhpZGVIb3ZlciIsImxpbmVDb2xvcnMiLCJkYXRlRm9ybWF0IiwidGltZXN0YW1wIiwiZGF0ZSIsIkRhdGUiLCJkYXkiLCJnZXREYXRlIiwidG9TdHJpbmciLCJtb250aCIsImdldE1vbnRoIiwieWVhciIsImdldEZ1bGxZZWFyIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpREFB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QUFVOUIsSUFBVixFQUFnQjtBQUMxQjtBQUNBckMsY0FBTW9FLEVBQU4sQ0FBUyxVQUFULEVBQXFCM0MsV0FBckI7QUFDQVk7QUFDSCxLQUpEOztBQU1BO0FBQ0EsV0FBT3pDLE1BQVA7QUFDSCxDQXpMTCIsImZpbGUiOiJzdGF0aXN0aWNfY2hhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHN0YXRpc3RpY19jaGFydC5qcyAyMDE2LTAyLTIzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTdGF0aXN0aWMgQ2hhcnQgV2lkZ2V0XG4gKlxuICogV2lkZ2V0IGZvciBzaG93aW5nIHN0YXRpc3RpY3NcbiAqXG4gKiBNYXJrdXA6XG4gKiBgYGBodG1sXG4gKiA8ZGl2XG4gKiAgICAgaWQ9XCJkYXNoYm9hcmQtY2hhcnRcIlxuICogICAgIGRhdGEtZ3gtd2lkZ2V0PVwic3RhdGlzdGljX2NoYXJ0XCJcbiAqICAgICBkYXRhLXN0YXRpc3RpY19jaGFydC11c2VyLWlkPVwiMVwiXG4gKiA+PC9kaXY+XG4gKiBgYGBcbiAqIERhdGEtQXR0cmlidXRlczpcbiAqIC0gYGRhdGEtc3RhdGlzdGljX2NoYXJ0LXVzZXItaWRgIGlzIHRoZSB1c2VySWQgZnJvbSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyXG4gKlxuICogRXZlbnRzOlxuICogLSBgZ2V0OmRhdGFgIGxvYWRzIHRoZSBkYXRhIGZyb20gc2VydmVyIChyZXF1aXJlcyBwYXJhbWV0ZXIpXG4gKlxuICogRXhhbXBsZTpcbiAqIGBgYGpzXG4gKiAkKCcjZGFzaGJvYXJkLWNoYXJ0JykudHJpZ2dlcignZ2V0OmRhdGEnLCB7XG4gICAgICAgIGl0ZW06ICdvcmRlcnMsJyAvLyAgd2hpY2ggc3RhdGlzdGljXG4gKiAgICAgIGludGVydmFsOiAndG9kYXknIC8vIHdoaWNoIHZhbHVlXG4gKiB9KTtcbiAqIGBgYFxuICogUmV0cmlldmUgZGF0YSBmcm9tIHNlcnZlclxuICpcbiAqIGBgYGpzXG4gKiB7XG4gKiAgICAgaXRlbSAgICAgICAgICAgIDogJ29yZGVycycgIC8vIFBhc3NlZCBpbiB2aWEgZXZlbnQgdHJpZ2dlclxuICogICAgIGludGVydmFsICAgICAgICA6IDEyMzEyMzIsICAvLyBQYXNzZWQgaW4gdmlhIGV2ZW50IHRyaWdnZXJcbiAqICAgICB1c2VySWQgICAgICAgICAgOiAxLCAgICAgICAgLy8gUGFzc2VkIGluIHZpYSBkYXRhIGF0dHJpYnV0ZVxuICogfVxuICogYGBgXG4gKlxuICogVGhlIGRhdGEgcmV0dXJuZWQgZnJvbSBzZXJ2ZXIgc2hvdWxkIGxvb2sgbGlrZSB0aGlzOlxuICpcbiAqIGBgYGpzXG4gKiBbXG4gKiAgICAgeyBwZXJpb2Q6ICcyMDA4JywgYW1vdW50OiAyMCB9LFxuICogICAgIHsgcGVyaW9kOiAnMjAwOScsIGFtb3VudDogMTAgfVxuICogXVxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3N0YXRpc3RpY19jaGFydFxuICogQHJlcXVpcmVzIGpRdWVyeVVJLUxpYnJhcnlcbiAqIEBpZ25vcmVcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgLy8gTW9kdWxlIG5hbWVcbiAgICAnc3RhdGlzdGljX2NoYXJ0JyxcblxuICAgIC8vIERlcGVuZGVuY2llc1xuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL3JhcGhhZWwvcmFwaGFlbC5qc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9tb3JyaXMuanMvbW9ycmlzLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvbW9ycmlzLmpzL21vcnJpcy5taW4uanNgLFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLy8gVXNlciBJRFxuICAgICAgICB2YXIgbXlVc2VySWQgPSBkYXRhLnVzZXJJZDtcblxuICAgICAgICAvLyBJdGVtIGRyb3Bkb3duXG4gICAgICAgIHZhciAkaXRlbURyb3Bkb3duID0gJCgnLnN0YXRpc3RpYy1jaGFydC1kcm9wZG93bicpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgaXRlbSByZWxhdGVkIHZhbHVlc1xuICAgICAgICAgKiBFYWNoIGl0ZW1zIGNvbnRhaW5zIGtleSB2YWx1ZXMgZm9yIHVzZSBpbiB0aGlzIHdpZGdldFxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIGl0ZW1NYXAgPSB7XG5cbiAgICAgICAgICAgIC8vIFNhbGVzIChVbXNhdHopXG4gICAgICAgICAgICBzYWxlczoge1xuICAgICAgICAgICAgICAgIGFwaVVybDogJy4vYWRtaW4ucGhwP2RvPURhc2hib2FyZC9nZXRTYWxlc1N0YXRpc3RpY3NEYXRhJyxcbiAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJU1RJQ1NfU0FMRVMnLCAnc3RhcnQnKVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gVmlzaXRvcnMgKEJlc3VjaGVyKVxuICAgICAgICAgICAgdmlzaXRvcnM6IHtcbiAgICAgICAgICAgICAgICBhcGlVcmw6ICcuL2FkbWluLnBocD9kbz1EYXNoYm9hcmQvZ2V0VmlzaXRvcnNTdGF0aXN0aWNzRGF0YScsXG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSVNUSUNTX1ZJU0lUT1JTJywgJ3N0YXJ0JylcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIE5ldyBDdXN0b21lcnMgKE5ldWUgS3VuZGVuKVxuICAgICAgICAgICAgbmV3Q3VzdG9tZXJzOiB7XG4gICAgICAgICAgICAgICAgYXBpVXJsOiAnLi9hZG1pbi5waHA/ZG89RGFzaGJvYXJkL2dldE5ld0N1c3RvbWVyU3RhdGlzdGljc0RhdGEnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1RBVElTVElDU19ORVdfQ1VTVE9NRVJTJywgJ3N0YXJ0JylcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIE9yZGVycyAoQmVzdGVsbHVuZ2VuKVxuICAgICAgICAgICAgb3JkZXJzOiB7XG4gICAgICAgICAgICAgICAgYXBpVXJsOiAnLi9hZG1pbi5waHA/ZG89RGFzaGJvYXJkL2dldE9yZGVyU3RhdGlzdGljc0RhdGEnLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1RBVElTVElDU19PUkRFUlNfQ09VTlQnLCAnc3RhcnQnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1ldGEgT2JqZWN0XG4gICAgICAgIHZhciBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gTE9BRElORyBTVEFURVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVHVybnMgb24vb2ZmIGxvYWRpbmcgc3RhdGVcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBpc0xvYWRpbmcgLSBJZiB0cnVlLCB0aGUgbG9hZGluZyBzdGF0ZSB3aWxsIGJlIHRyaWdnZXJlZFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF90b2dnbGVMb2FkaW5nID0gZnVuY3Rpb24gKGlzTG9hZGluZykge1xuICAgICAgICAgICAgLy8gRXhpc3RhbnQgc3Bpbm5lciBlbGVtZW50XG4gICAgICAgICAgICB2YXIgJGV4aXN0YW50U3Bpbm5lciA9ICR0aGlzLmZpbmQoJy5sb2FkZXInKTtcbiAgICAgICAgICAgIHZhciBpc1NwaW5uZXJBbHJlYWR5RXhpc3RzID0gJGV4aXN0YW50U3Bpbm5lci5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIE5ldyBzcGlubmVyIGVsZW1lbnRcbiAgICAgICAgICAgIHZhciBzcGlubmVyQ2xhc3MgPSAnbG9hZGVyIGZhIGZhLWZ3IGZhLXNwaW5uZXIgZmEtc3Bpbic7XG4gICAgICAgICAgICB2YXIgJG5ld1NwaW5uZXIgPSAkKCc8aSBjbGFzcz1cIicgKyBzcGlubmVyQ2xhc3MgKyAnXCI+PC9pPicpO1xuXG4gICAgICAgICAgICAvLyBMb29rIGZvciBleGlzdGFudCBzcGlubmVyIGVsZW1lbnQgYW5kIHJlbW92ZSBpdFxuICAgICAgICAgICAgaWYgKGlzU3Bpbm5lckFscmVhZHlFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAkZXhpc3RhbnRTcGlubmVyLnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaG93IG5ldyBvbmUgaWYgJ2lzTG9hZGluZycgYXJndW1lbnQgaXMgdHJ1ZVxuICAgICAgICAgICAgaWYgKGlzTG9hZGluZykge1xuICAgICAgICAgICAgICAgICR0aGlzLmFwcGVuZCgkbmV3U3Bpbm5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlIGRhdGEgZnJvbSBzZXJ2ZXIgYW5kIGJ1aWxkcyB0aGUgY2hhcnRcbiAgICAgICAgICogVGhlIHNlcnZlciByZXF1ZXN0IHBhcmFtZXRlcnMgc2hvdWxkIGxvb2sgbGlrZSB0aGlzOlxuICAgICAgICAgKiBAcmVxdWlyZXMgTW9ycmlzSlNcbiAgICAgICAgICogQHBhcmFtIHtFdmVudCB8IGpRdWVyeX0gZXZlbnRcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGludGVydmFsXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbaXRlbV0gLSBJZiB1bmRlZmluZWQsIGl0IHdpbGwgZ2V0IHZhbHVlIGZyb20gZHJvcGRvd25cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfYnVpbGRDaGFydCA9IGZ1bmN0aW9uIChldmVudCwgaW50ZXJ2YWwsIGl0ZW0pIHtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgZWxlbWVudFxuICAgICAgICAgICAgJHRoaXMuZW1wdHkoKTtcblxuICAgICAgICAgICAgLy8gR2V0IGl0ZW0gdmFsdWUgZnJvbSBkcm9wZG93biBpZiBub3QgcGFzc2VkIHZpYSBhcmd1bWVudFxuICAgICAgICAgICAgaWYgKCFpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9ICRpdGVtRHJvcGRvd24uZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRocm93IGVycm9yIGlmIGl0ZW0gaXMgbm90IGRlZmluZWQgaW4gbWFwXG4gICAgICAgICAgICBpZiAoaXRlbSAmJiBpdGVtIGluIGl0ZW1NYXAgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGl0ZW0hJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgbG9hZGluZyBzcGlubmVyXG4gICAgICAgICAgICBfdG9nZ2xlTG9hZGluZyh0cnVlKTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSBSZXF1ZXN0XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBpdGVtTWFwW2l0ZW1dLmFwaVVybCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ0pTT04nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBteVVzZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbTogaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWw6IGludGVydmFsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE9uIHN1Y2Nlc3NcbiAgICAgICAgICAgIHJlcXVlc3QuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgIC8vIEhpZGUgbG9hZGluZyBzcGlubmVyXG4gICAgICAgICAgICAgICAgX3RvZ2dsZUxvYWRpbmcoZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMuZW1wdHkoKTtcblxuICAgICAgICAgICAgICAgICQuZWFjaChyZXNwb25zZS5kYXRhLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW1vdW50ID0gcGFyc2VJbnQodGhpcy5hbW91bnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gRHJhdyBjaGFydFxuICAgICAgICAgICAgICAgIE1vcnJpcy5BcmVhKHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHhrZXk6ICdwZXJpb2QnLFxuICAgICAgICAgICAgICAgICAgICB5a2V5czogWydhbW91bnQnXSxcbiAgICAgICAgICAgICAgICAgICAgeExhYmVsczogcmVzcG9uc2UudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxzOiBbaXRlbU1hcFtpdGVtXS50aXRsZV0sXG4gICAgICAgICAgICAgICAgICAgIGxpbmVXaWR0aDogMixcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRTdHJva2VXaWR0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgZ29hbFN0cm9rZVdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICBmaWxsT3BhY2l0eTogMC4yNSxcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZlTGlrZUxpbmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGhpZGVIb3ZlcjogJ2F1dG8nLFxuICAgICAgICAgICAgICAgICAgICBsaW5lQ29sb3JzOiBbJyMwMDIzMzcnXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0ZUZvcm1hdDogZnVuY3Rpb24gKHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lc3RhbXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRheSA9IGRhdGUuZ2V0RGF0ZSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW9udGggPSAoZGF0ZS5nZXRNb250aCgpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGRheVsxXSA/IGRheSA6ICcwJyArIGRheVswXSkgKyAnLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb250aFsxXSA/IG1vbnRoIDogJzAnICsgbW9udGhbMF0pICsgJy4nICsgeWVhcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIERlbGVnYXRlIGV2ZW50XG4gICAgICAgICAgICAkdGhpcy5vbignZ2V0OmRhdGEnLCBfYnVpbGRDaGFydCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
