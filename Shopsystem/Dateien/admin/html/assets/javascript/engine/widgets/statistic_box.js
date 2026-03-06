'use strict';

/* --------------------------------------------------------------
 statistic_box.js 2016-09-19
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Statistic Box Widget
 *
 * Widget for showing statistics in the admin dashboard. The widget is bound in a container element and converts
 * the child-instances into the final widgets.
 *
 * ### Options
 *
 * **Item | `data-statistic_box-item` | String | Optional**
 *
 * The element, for which the statistics will be shown. If no value is provided, the element will be set to
 * **online**. Possible options are:
 *
 *   - 'online': Shows how many users are currently online.
 *   - 'visitors': Shows how many visitors are online.
 *   - 'orders': Shows the total amount of orders.
 *   - 'newCustomers': Shows the amount of new customers.
 *   - 'conversionRate': Conversion rate.
 *   - 'sales': Total amount of winnings in sales.
 *
 * **Icon | `data-statistics_box-icon` | String | Optional**
 *
 * Font Awesome icon for the statistic box. If no value is provided, it defaults to **fa-dashboard**.
 * Visit this [link](http://fontawesome.io/icons) to get to know more about Font Awesome icons.
 *
 * **Color | `data-statistics_box-color` | String | Optional**
 *
 * The background color for the icon container. If no value is provided, it defaults to **gray**.
 * Possible options:
 *
 *   - 'gray'
 *   - 'green'
 *   - 'yellow'
 *   - 'blue'
 *   - 'red'
 *   - 'lila'
 *
 * ### Example
 * ```html
 * <div data-gx-widget="statistic_box">
 *   <div class="statistic-widget"
 *       data-statistic_box-item="sales"
 *       data-statistic_box-icon="fa-money"
 *       data-statistic_box-color="red">
 *     <div class="statistic-icon"></div>
 *     <div class="statistic-text">
 *         <div class="statistic-heading"></div>
 *         <div class="statistic-subtext"></div>
 *         <div class="statistic-small-text"></div>
 *     </div>
 *   </div>
 * </div>
 * ```
 * @module Admin/Widgets/statistic_box
 * @requires jQueryUI-Library
 * @ignore
 */
gx.widgets.module('statistic_box', ['loading_spinner'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // ELEMENT DEFINITION
    // ------------------------------------------------------------------------

    // Elements

    var $this = $(this),
        $statisticBoxes = $this.find('[data-statistic_box-item]'),
        $dropdown = $('.js-interval-dropdown');

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    // Widget defaults
    var defaults = {
        item: 'online',
        icon: 'fa-dashboard',
        color: 'gray',
        ordersUrl: 'admin.php?do=OrdersOverview'
    },
        options = $.extend(true, {}, defaults, data),
        module = {};

    // Dates
    var date = new Date(),
        todayDay = date.getDate(),
        todayMonth = date.getMonth() + 1,
        todayYear = date.getFullYear(),
        lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
        lastWeekDay = lastWeek.getDate(),
        lastWeekMonth = lastWeek.getMonth() + 1,
        lastWeekYear = lastWeek.getFullYear(),
        lastTwoWeeks = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 14),
        lastTwoWeekskDay = lastTwoWeeks.getDate(),
        lastTwoWeeksMonth = lastTwoWeeks.getMonth() + 1,
        lastTwoWeekskYear = lastTwoWeeks.getFullYear(),
        lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
        lastMonthDay = lastMonth.getDate(),
        lastMonthMonth = lastMonth.getMonth() + 1,
        lastMonthYear = lastMonth.getFullYear(),
        lastThreeMonths = new Date(date.getFullYear(), date.getMonth() - 3, date.getDate()),
        lastThreeMonthsDay = lastThreeMonths.getDate(),
        lastThreeMonthsMonth = lastThreeMonths.getMonth() + 1,
        lastThreeMonthsYear = lastThreeMonths.getFullYear(),
        lastSixMonths = new Date(date.getFullYear(), date.getMonth() - 6, date.getDate()),
        lastSixMonthsDay = lastSixMonths.getDate(),
        lastSixMonthsMonth = lastSixMonths.getMonth() + 1,
        lastSixMonthsYear = lastSixMonths.getFullYear(),
        lastYear = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()),
        lastYearDay = lastYear.getDate(),
        lastYearMonth = lastYear.getMonth() + 1,
        lastYearYear = lastYear.getFullYear();

    // ------------------------------------------------------------------------
    // Maps
    // ------------------------------------------------------------------------

    // API map
    var map = {
        // Sales (Umsatz)
        sales: {
            apiUrl: 'admin.php?do=Dashboard/GetSales',
            heading: '%timespan%',
            subtext: jse.core.lang.translate('STATISTICS_SALES', 'start'),
            smallText: '(' + jse.core.lang.translate('STATISTICS_INTERVAL_TODAY', 'start') + ': ' + '%today%)',
            onClick: function onClick() {
                switch ($dropdown.find('option:selected').val()) {
                    case 'week':
                        window.open('stats_sales_report.php?report=4&startD=' + lastWeekDay + '&startM=' + lastWeekMonth + '&startY=' + lastWeekYear + '&detail=0&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'two_weeks':
                        window.open('stats_sales_report.php?report=3&startD=' + lastTwoWeekskDay + '&startM=' + lastTwoWeeksMonth + '&startY=' + lastTwoWeekskYear + '&detail=0&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'month':
                        window.open('stats_sales_report.php?report=3&startD=' + lastMonthDay + '&startM=' + lastMonthMonth + '&startY=' + lastMonthYear + '&detail=0&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'three_months':
                        window.open('stats_sales_report.php?report=2&startD=' + lastThreeMonthsDay + '&startM=' + lastThreeMonthsMonth + '&startY=' + lastThreeMonthsYear + '&detail=0&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'six_months':
                        window.open('stats_sales_report.php?report=2&startD=' + lastSixMonthsDay + '&startM=' + lastSixMonthsMonth + '&startY=' + lastSixMonthsYear + '&detail=0&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'year':
                        window.open('stats_sales_report.php?report=2&startD=' + lastYearDay + '&startM=' + lastYearMonth + '&startY=' + lastYearYear + '&detail=0&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;
                }
            }
        },

        // Currently online (Jetzt online)
        online: {
            apiUrl: 'admin.php?do=Dashboard/GetUsersOnline',
            heading: '%timespan%',
            subtext: jse.core.lang.translate('STATISTICS_USERS_ONLINE', 'start'),
            smallText: '',
            onClick: function onClick() {
                window.open('whos_online.php', '_self');
            }
        },

        // Visitors (Besucher)
        visitors: {
            apiUrl: 'admin.php?do=Dashboard/GetVisitors',
            heading: '%timespan%',
            subtext: jse.core.lang.translate('STATISTICS_VISITORS', 'start'),
            smallText: '(' + jse.core.lang.translate('STATISTICS_INTERVAL_TODAY', 'start') + ': ' + '%today%)',
            onClick: function onClick() {
                window.open('gm_counter.php', '_self');
            }
        },

        // New Customers (Neue Kunden)
        newCustomers: {
            apiUrl: 'admin.php?do=Dashboard/GetNewCustomers',
            heading: '%timespan%',
            subtext: jse.core.lang.translate('STATISTICS_NEW_CUSTOMERS', 'start'),
            smallText: '(' + jse.core.lang.translate('STATISTICS_INTERVAL_TODAY', 'start') + ': ' + '%today%)',
            onClick: function onClick() {
                window.open('customers.php', '_self');
            }
        },

        // Orders (Bestellungen)
        orders: {
            apiUrl: 'admin.php?do=Dashboard/GetOrdersCount',
            heading: '%timespan%',
            subtext: jse.core.lang.translate('STATISTICS_ORDERS_COUNT', 'start'),
            smallText: '(' + jse.core.lang.translate('STATISTICS_INTERVAL_TODAY', 'start') + ': ' + '%today%)',
            onClick: function onClick() {
                window.open(options.ordersUrl, '_self');
            }
        },

        // Conversion Rate
        conversionRate: {
            apiUrl: 'admin.php?do=Dashboard/GetConversionRate',
            heading: '%timespan% %',
            subtext: jse.core.lang.translate('STATISTICS_CONVERSION_RATE', 'start'),
            smallText: '(' + jse.core.lang.translate('STATISTICS_INTERVAL_TODAY', 'start') + ': ' + '%today% %)',
            onClick: function onClick() {
                window.open('gm_counter.php', '_self');
            }
        },

        // Average order total (Durchschnittlicher Bestellwert)
        avgOrderTotal: {
            apiUrl: 'admin.php?do=Dashboard/GetAverageOrderValue',
            heading: '%timespan%',
            subtext: jse.core.lang.translate('STATISTICS_AVERGAGE_ORDER_VALUE', 'start'),
            smallText: '(' + jse.core.lang.translate('STATISTICS_INTERVAL_TODAY', 'start') + ': ' + '%today%)',
            onClick: function onClick() {
                switch ($dropdown.find('option:selected').val()) {
                    case 'week':
                        window.open('stats_sales_report.php?report=4&startD=' + lastWeekDay + '&startM=' + lastWeekMonth + '&startY=' + lastWeekYear + '&detail=2&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'two_weeks':
                        window.open('stats_sales_report.php?report=3&startD=' + lastTwoWeekskDay + '&startM=' + lastTwoWeeksMonth + '&startY=' + lastTwoWeekskYear + '&detail=2&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'month':
                        window.open('stats_sales_report.php?report=3&startD=' + lastMonthDay + '&startM=' + lastMonthMonth + '&startY=' + lastMonthYear + '&detail=2&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'three_months':
                        window.open('stats_sales_report.php?report=2&startD=' + lastThreeMonthsDay + '&startM=' + lastThreeMonthsMonth + '&startY=' + lastThreeMonthsYear + '&detail=2&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'six_months':
                        window.open('stats_sales_report.php?report=2&startD=' + lastSixMonthsDay + '&startM=' + lastSixMonthsMonth + '&startY=' + lastSixMonthsYear + '&detail=2&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;

                    case 'year':
                        window.open('stats_sales_report.php?report=2&startD=' + lastYearDay + '&startM=' + lastYearMonth + '&startY=' + lastYearYear + '&detail=2&max=0&payment=0&export=0&sort=4&endD=' + todayDay + '&endM=' + todayMonth + '&endY=' + todayYear, '_self');
                        break;
                }
            }
        }
    };

    // Interpolation map for replacing strings
    var interpolationMap = {
        today: '%today%',
        timespan: '%timespan%'
    };

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Iterate over the interpolation map
     * and interpolate strings with values
     * @param {string} text - Text to interpolate
     * @param {object} values - Values to put in
     * @returns {string}
     */
    var _interpolate = function _interpolate(text, values) {
        for (var key in interpolationMap) {
            if (interpolationMap.hasOwnProperty(key)) {
                text = text.replace(interpolationMap[key], values[key]);
            }
        }
        return text;
    };

    /**
     * Retrieves data from server
     * @param {string} interval
     * @private
     */
    var _getData = function _getData(interval) {
        // Make AJAX call
        $.ajax({
            url: 'admin.php?do=Dashboard/GetStatisticBoxes&interval=' + interval,
            type: 'GET',
            dataType: 'json'
        })
        // On success
        .done(function (response) {
            for (var section in response) {
                var data = response[section];

                var $statisticBox = $this.find('[data-statistic_box-item="' + section + '"]'),
                    $heading = $statisticBox.find('.heading'),
                    $subtext = $statisticBox.find('.subtext'),
                    $smallText = $statisticBox.find('.small-text');

                /**
                 * Values map
                 * Keys should be the same as in the interpolationMap
                 * @type {object}
                 */
                var values = {
                    timespan: data.timespan,
                    today: data.today
                };

                $statisticBox.find('.icon-container, .text-container').animate({
                    opacity: 1
                }, 'slow');

                var item = $statisticBox.data('statistic_boxItem');

                // Interpolate heading text
                $heading.text(_interpolate(map[item].heading, values));

                // Interpolate subtext
                $subtext.text(_interpolate(map[item].subtext, values));

                // Interpolate small text
                $smallText.text(_interpolate(map[item].smallText, values));
            }
        })
        // On fail
        .fail(function () {
            throw new Error('Failed to load statistic resource.');
        });
    };

    /**
     * Adds classes, events and elements to the widget
     *
     * @param {jQuery} $statisticBox The currently processed statistic box selector.
     *
     * @private
     */
    var _prepare = function _prepare($statisticBox) {
        var $iconContainer, $icon, $textContainer, $heading, $subtext, $smallText;

        // Prepare icon container
        $icon = $('<i>');
        $icon.addClass('fa fa-fw fa-lg').addClass($statisticBox.data('statistic_boxIcon'));

        $iconContainer = $('<div>');
        $iconContainer.addClass('icon-container span4').addClass($statisticBox.data('statistic_boxColor')).append($icon);

        // Prepare text container
        $heading = $('<div>');
        $heading.addClass('heading');

        $subtext = $('<div>');
        $subtext.addClass('subtext');

        $smallText = $('<div>');
        $smallText.addClass('small-text');

        $textContainer = $('<div>');
        $textContainer.addClass('text-container span8').append($heading).append($subtext).append($smallText);

        // Handle click event
        $statisticBox.on('click', function (event) {
            map[$(this).data('statistic_boxItem')].onClick(event);
        });

        // Compose HTML
        $statisticBox.addClass('toolbar grid').append($iconContainer).append($textContainer);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        $statisticBoxes.each(function (index, statisticBox) {
            _prepare($(statisticBox));
        });

        // Event handler: Trigger data request
        $this.on('get:data', function (event, interval) {
            if (interval) {
                _getData(interval);
            }
        });

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpc3RpY19ib3guanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRzdGF0aXN0aWNCb3hlcyIsImZpbmQiLCIkZHJvcGRvd24iLCJkZWZhdWx0cyIsIml0ZW0iLCJpY29uIiwiY29sb3IiLCJvcmRlcnNVcmwiLCJvcHRpb25zIiwiZXh0ZW5kIiwiZGF0ZSIsIkRhdGUiLCJ0b2RheURheSIsImdldERhdGUiLCJ0b2RheU1vbnRoIiwiZ2V0TW9udGgiLCJ0b2RheVllYXIiLCJnZXRGdWxsWWVhciIsImxhc3RXZWVrIiwibGFzdFdlZWtEYXkiLCJsYXN0V2Vla01vbnRoIiwibGFzdFdlZWtZZWFyIiwibGFzdFR3b1dlZWtzIiwibGFzdFR3b1dlZWtza0RheSIsImxhc3RUd29XZWVrc01vbnRoIiwibGFzdFR3b1dlZWtza1llYXIiLCJsYXN0TW9udGgiLCJsYXN0TW9udGhEYXkiLCJsYXN0TW9udGhNb250aCIsImxhc3RNb250aFllYXIiLCJsYXN0VGhyZWVNb250aHMiLCJsYXN0VGhyZWVNb250aHNEYXkiLCJsYXN0VGhyZWVNb250aHNNb250aCIsImxhc3RUaHJlZU1vbnRoc1llYXIiLCJsYXN0U2l4TW9udGhzIiwibGFzdFNpeE1vbnRoc0RheSIsImxhc3RTaXhNb250aHNNb250aCIsImxhc3RTaXhNb250aHNZZWFyIiwibGFzdFllYXIiLCJsYXN0WWVhckRheSIsImxhc3RZZWFyTW9udGgiLCJsYXN0WWVhclllYXIiLCJtYXAiLCJzYWxlcyIsImFwaVVybCIsImhlYWRpbmciLCJzdWJ0ZXh0IiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJzbWFsbFRleHQiLCJvbkNsaWNrIiwidmFsIiwid2luZG93Iiwib3BlbiIsIm9ubGluZSIsInZpc2l0b3JzIiwibmV3Q3VzdG9tZXJzIiwib3JkZXJzIiwiY29udmVyc2lvblJhdGUiLCJhdmdPcmRlclRvdGFsIiwiaW50ZXJwb2xhdGlvbk1hcCIsInRvZGF5IiwidGltZXNwYW4iLCJfaW50ZXJwb2xhdGUiLCJ0ZXh0IiwidmFsdWVzIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJyZXBsYWNlIiwiX2dldERhdGEiLCJpbnRlcnZhbCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YVR5cGUiLCJkb25lIiwicmVzcG9uc2UiLCJzZWN0aW9uIiwiJHN0YXRpc3RpY0JveCIsIiRoZWFkaW5nIiwiJHN1YnRleHQiLCIkc21hbGxUZXh0IiwiYW5pbWF0ZSIsIm9wYWNpdHkiLCJmYWlsIiwiRXJyb3IiLCJfcHJlcGFyZSIsIiRpY29uQ29udGFpbmVyIiwiJGljb24iLCIkdGV4dENvbnRhaW5lciIsImFkZENsYXNzIiwiYXBwZW5kIiwib24iLCJldmVudCIsImluaXQiLCJlYWNoIiwiaW5kZXgiLCJzdGF0aXN0aWNCb3giXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeURBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxlQURKLEVBR0ksQ0FBQyxpQkFBRCxDQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBQ0EsUUFBSUMsUUFBUUMsRUFBRSxJQUFGLENBQVo7QUFBQSxRQUNJQyxrQkFBa0JGLE1BQU1HLElBQU4sQ0FBVywyQkFBWCxDQUR0QjtBQUFBLFFBRUlDLFlBQVlILEVBQUUsdUJBQUYsQ0FGaEI7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBSUksV0FBVztBQUNQQyxjQUFNLFFBREM7QUFFUEMsY0FBTSxjQUZDO0FBR1BDLGVBQU8sTUFIQTtBQUlQQyxtQkFBVztBQUpKLEtBQWY7QUFBQSxRQU1JQyxVQUFVVCxFQUFFVSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJOLFFBQW5CLEVBQTZCTixJQUE3QixDQU5kO0FBQUEsUUFPSUQsU0FBUyxFQVBiOztB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QUEwQixVQUFVQyxLQUFWLEVBQWlCO0FBQ3ZDckQsZ0JBQUkzQyxFQUFFLElBQUYsRUFBUUYsSUFBUixDQUFhLG1CQUFiLENBQUosRUFBdUN1RCxPQUF2QyxDQUErQzJDLEtBQS9DO0FBQ0gsU0FGRDs7QUFJQTtBQUNBZixzQkFDS1ksUUFETCxDQUNjLGNBRGQsRUFFS0MsTUFGTCxDQUVZSixjQUZaLEVBR0tJLE1BSEwsQ0FHWUYsY0FIWjtBQUlILEtBL0NEOztBQWlEQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBL0YsV0FBT29HLElBQVAsR0FBYyxVQUFVbkIsSUFBVixFQUFnQjtBQUMxQjdFLHdCQUFnQmlHLElBQWhCLENBQXFCLFVBQVVDLEtBQVYsRUFBaUJDLFlBQWpCLEVBQStCO0FBQ2hEWCxxQkFBU3pGLEVBQUVvRyxZQUFGLENBQVQ7QUFDSCxTQUZEOztBQUlBO0FBQ0FyRyxjQUFNZ0csRUFBTixDQUFTLFVBQVQsRUFBcUIsVUFBVUMsS0FBVixFQUFpQnZCLFFBQWpCLEVBQTJCO0FBQzVDLGdCQUFJQSxRQUFKLEVBQWM7QUFDVkQseUJBQVNDLFFBQVQ7QUFDSDtBQUNKLFNBSkQ7O0FBTUFLO0FBQ0gsS0FiRDs7QUFlQTtBQUNBLFdBQU9qRixNQUFQO0FBQ0gsQ0F4YUwiLCJmaWxlIjoic3RhdGlzdGljX2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3RhdGlzdGljX2JveC5qcyAyMDE2LTA5LTE5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTdGF0aXN0aWMgQm94IFdpZGdldFxuICpcbiAqIFdpZGdldCBmb3Igc2hvd2luZyBzdGF0aXN0aWNzIGluIHRoZSBhZG1pbiBkYXNoYm9hcmQuIFRoZSB3aWRnZXQgaXMgYm91bmQgaW4gYSBjb250YWluZXIgZWxlbWVudCBhbmQgY29udmVydHNcbiAqIHRoZSBjaGlsZC1pbnN0YW5jZXMgaW50byB0aGUgZmluYWwgd2lkZ2V0cy5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqSXRlbSB8IGBkYXRhLXN0YXRpc3RpY19ib3gtaXRlbWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIGVsZW1lbnQsIGZvciB3aGljaCB0aGUgc3RhdGlzdGljcyB3aWxsIGJlIHNob3duLiBJZiBubyB2YWx1ZSBpcyBwcm92aWRlZCwgdGhlIGVsZW1lbnQgd2lsbCBiZSBzZXQgdG9cbiAqICoqb25saW5lKiouIFBvc3NpYmxlIG9wdGlvbnMgYXJlOlxuICpcbiAqICAgLSAnb25saW5lJzogU2hvd3MgaG93IG1hbnkgdXNlcnMgYXJlIGN1cnJlbnRseSBvbmxpbmUuXG4gKiAgIC0gJ3Zpc2l0b3JzJzogU2hvd3MgaG93IG1hbnkgdmlzaXRvcnMgYXJlIG9ubGluZS5cbiAqICAgLSAnb3JkZXJzJzogU2hvd3MgdGhlIHRvdGFsIGFtb3VudCBvZiBvcmRlcnMuXG4gKiAgIC0gJ25ld0N1c3RvbWVycyc6IFNob3dzIHRoZSBhbW91bnQgb2YgbmV3IGN1c3RvbWVycy5cbiAqICAgLSAnY29udmVyc2lvblJhdGUnOiBDb252ZXJzaW9uIHJhdGUuXG4gKiAgIC0gJ3NhbGVzJzogVG90YWwgYW1vdW50IG9mIHdpbm5pbmdzIGluIHNhbGVzLlxuICpcbiAqICoqSWNvbiB8IGBkYXRhLXN0YXRpc3RpY3NfYm94LWljb25gIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIEZvbnQgQXdlc29tZSBpY29uIGZvciB0aGUgc3RhdGlzdGljIGJveC4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvICoqZmEtZGFzaGJvYXJkKiouXG4gKiBWaXNpdCB0aGlzIFtsaW5rXShodHRwOi8vZm9udGF3ZXNvbWUuaW8vaWNvbnMpIHRvIGdldCB0byBrbm93IG1vcmUgYWJvdXQgRm9udCBBd2Vzb21lIGljb25zLlxuICpcbiAqICoqQ29sb3IgfCBgZGF0YS1zdGF0aXN0aWNzX2JveC1jb2xvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIGJhY2tncm91bmQgY29sb3IgZm9yIHRoZSBpY29uIGNvbnRhaW5lci4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvICoqZ3JheSoqLlxuICogUG9zc2libGUgb3B0aW9uczpcbiAqXG4gKiAgIC0gJ2dyYXknXG4gKiAgIC0gJ2dyZWVuJ1xuICogICAtICd5ZWxsb3cnXG4gKiAgIC0gJ2JsdWUnXG4gKiAgIC0gJ3JlZCdcbiAqICAgLSAnbGlsYSdcbiAqXG4gKiAjIyMgRXhhbXBsZVxuICogYGBgaHRtbFxuICogPGRpdiBkYXRhLWd4LXdpZGdldD1cInN0YXRpc3RpY19ib3hcIj5cbiAqICAgPGRpdiBjbGFzcz1cInN0YXRpc3RpYy13aWRnZXRcIlxuICogICAgICAgZGF0YS1zdGF0aXN0aWNfYm94LWl0ZW09XCJzYWxlc1wiXG4gKiAgICAgICBkYXRhLXN0YXRpc3RpY19ib3gtaWNvbj1cImZhLW1vbmV5XCJcbiAqICAgICAgIGRhdGEtc3RhdGlzdGljX2JveC1jb2xvcj1cInJlZFwiPlxuICogICAgIDxkaXYgY2xhc3M9XCJzdGF0aXN0aWMtaWNvblwiPjwvZGl2PlxuICogICAgIDxkaXYgY2xhc3M9XCJzdGF0aXN0aWMtdGV4dFwiPlxuICogICAgICAgICA8ZGl2IGNsYXNzPVwic3RhdGlzdGljLWhlYWRpbmdcIj48L2Rpdj5cbiAqICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXRpc3RpYy1zdWJ0ZXh0XCI+PC9kaXY+XG4gKiAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0aXN0aWMtc21hbGwtdGV4dFwiPjwvZGl2PlxuICogICAgIDwvZGl2PlxuICogICA8L2Rpdj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvc3RhdGlzdGljX2JveFxuICogQHJlcXVpcmVzIGpRdWVyeVVJLUxpYnJhcnlcbiAqIEBpZ25vcmVcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ3N0YXRpc3RpY19ib3gnLFxuXG4gICAgWydsb2FkaW5nX3NwaW5uZXInXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFTEVNRU5UIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLy8gRWxlbWVudHNcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICRzdGF0aXN0aWNCb3hlcyA9ICR0aGlzLmZpbmQoJ1tkYXRhLXN0YXRpc3RpY19ib3gtaXRlbV0nKSxcbiAgICAgICAgICAgICRkcm9wZG93biA9ICQoJy5qcy1pbnRlcnZhbC1kcm9wZG93bicpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIFdpZGdldCBkZWZhdWx0c1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgaXRlbTogJ29ubGluZScsXG4gICAgICAgICAgICAgICAgaWNvbjogJ2ZhLWRhc2hib2FyZCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICdncmF5JyxcbiAgICAgICAgICAgICAgICBvcmRlcnNVcmw6ICdhZG1pbi5waHA/ZG89T3JkZXJzT3ZlcnZpZXcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyBEYXRlc1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCksXG4gICAgICAgICAgICB0b2RheURheSA9IGRhdGUuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgdG9kYXlNb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgICAgICAgICB0b2RheVllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCksXG5cbiAgICAgICAgICAgIGxhc3RXZWVrID0gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpIC0gNyksXG4gICAgICAgICAgICBsYXN0V2Vla0RheSA9IGxhc3RXZWVrLmdldERhdGUoKSxcbiAgICAgICAgICAgIGxhc3RXZWVrTW9udGggPSBsYXN0V2Vlay5nZXRNb250aCgpICsgMSxcbiAgICAgICAgICAgIGxhc3RXZWVrWWVhciA9IGxhc3RXZWVrLmdldEZ1bGxZZWFyKCksXG5cbiAgICAgICAgICAgIGxhc3RUd29XZWVrcyA9IG5ldyBEYXRlKGRhdGUuZ2V0RnVsbFllYXIoKSwgZGF0ZS5nZXRNb250aCgpLCBkYXRlLmdldERhdGUoKSAtIDE0KSxcbiAgICAgICAgICAgIGxhc3RUd29XZWVrc2tEYXkgPSBsYXN0VHdvV2Vla3MuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgbGFzdFR3b1dlZWtzTW9udGggPSBsYXN0VHdvV2Vla3MuZ2V0TW9udGgoKSArIDEsXG4gICAgICAgICAgICBsYXN0VHdvV2Vla3NrWWVhciA9IGxhc3RUd29XZWVrcy5nZXRGdWxsWWVhcigpLFxuXG4gICAgICAgICAgICBsYXN0TW9udGggPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSAtIDEsIGRhdGUuZ2V0RGF0ZSgpKSxcbiAgICAgICAgICAgIGxhc3RNb250aERheSA9IGxhc3RNb250aC5nZXREYXRlKCksXG4gICAgICAgICAgICBsYXN0TW9udGhNb250aCA9IGxhc3RNb250aC5nZXRNb250aCgpICsgMSxcbiAgICAgICAgICAgIGxhc3RNb250aFllYXIgPSBsYXN0TW9udGguZ2V0RnVsbFllYXIoKSxcblxuICAgICAgICAgICAgbGFzdFRocmVlTW9udGhzID0gbmV3IERhdGUoZGF0ZS5nZXRGdWxsWWVhcigpLCBkYXRlLmdldE1vbnRoKCkgLSAzLCBkYXRlLmdldERhdGUoKSksXG4gICAgICAgICAgICBsYXN0VGhyZWVNb250aHNEYXkgPSBsYXN0VGhyZWVNb250aHMuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgbGFzdFRocmVlTW9udGhzTW9udGggPSBsYXN0VGhyZWVNb250aHMuZ2V0TW9udGgoKSArIDEsXG4gICAgICAgICAgICBsYXN0VGhyZWVNb250aHNZZWFyID0gbGFzdFRocmVlTW9udGhzLmdldEZ1bGxZZWFyKCksXG5cbiAgICAgICAgICAgIGxhc3RTaXhNb250aHMgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSAtIDYsIGRhdGUuZ2V0RGF0ZSgpKSxcbiAgICAgICAgICAgIGxhc3RTaXhNb250aHNEYXkgPSBsYXN0U2l4TW9udGhzLmdldERhdGUoKSxcbiAgICAgICAgICAgIGxhc3RTaXhNb250aHNNb250aCA9IGxhc3RTaXhNb250aHMuZ2V0TW9udGgoKSArIDEsXG4gICAgICAgICAgICBsYXN0U2l4TW9udGhzWWVhciA9IGxhc3RTaXhNb250aHMuZ2V0RnVsbFllYXIoKSxcblxuICAgICAgICAgICAgbGFzdFllYXIgPSBuZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCkgLSAxLCBkYXRlLmdldE1vbnRoKCksIGRhdGUuZ2V0RGF0ZSgpKSxcbiAgICAgICAgICAgIGxhc3RZZWFyRGF5ID0gbGFzdFllYXIuZ2V0RGF0ZSgpLFxuICAgICAgICAgICAgbGFzdFllYXJNb250aCA9IGxhc3RZZWFyLmdldE1vbnRoKCkgKyAxLFxuICAgICAgICAgICAgbGFzdFllYXJZZWFyID0gbGFzdFllYXIuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gTWFwc1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyBBUEkgbWFwXG4gICAgICAgIHZhciBtYXAgPSB7XG4gICAgICAgICAgICAvLyBTYWxlcyAoVW1zYXR6KVxuICAgICAgICAgICAgc2FsZXM6IHtcbiAgICAgICAgICAgICAgICBhcGlVcmw6ICdhZG1pbi5waHA/ZG89RGFzaGJvYXJkL0dldFNhbGVzJyxcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnJXRpbWVzcGFuJScsXG4gICAgICAgICAgICAgICAgc3VidGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJU1RJQ1NfU0FMRVMnLCAnc3RhcnQnKSxcbiAgICAgICAgICAgICAgICBzbWFsbFRleHQ6ICcoJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSVNUSUNTX0lOVEVSVkFMX1RPREFZJywgJ3N0YXJ0JykgKyAnOiAnICsgJyV0b2RheSUpJyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoJGRyb3Bkb3duLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3Blbignc3RhdHNfc2FsZXNfcmVwb3J0LnBocD9yZXBvcnQ9NCZzdGFydEQ9JyArIGxhc3RXZWVrRGF5ICsgJyZzdGFydE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RXZWVrTW9udGggKyAnJnN0YXJ0WT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFdlZWtZZWFyICsgJyZkZXRhaWw9MCZtYXg9MCZwYXltZW50PTAmZXhwb3J0PTAmc29ydD00JmVuZEQ9JyArIHRvZGF5RGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJyZlbmRNPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheU1vbnRoICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyZlbmRZPScgKyB0b2RheVllYXIsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0d29fd2Vla3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdzdGF0c19zYWxlc19yZXBvcnQucGhwP3JlcG9ydD0zJnN0YXJ0RD0nICsgbGFzdFR3b1dlZWtza0RheSArICcmc3RhcnRNPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdvV2Vla3NNb250aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmc3RhcnRZPScgKyBsYXN0VHdvV2Vla3NrWWVhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZGV0YWlsPTAmbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheURheSArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdzdGF0c19zYWxlc19yZXBvcnQucGhwP3JlcG9ydD0zJnN0YXJ0RD0nICsgbGFzdE1vbnRoRGF5ICsgJyZzdGFydE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNb250aE1vbnRoICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyZzdGFydFk9JyArIGxhc3RNb250aFllYXIgKyAnJmRldGFpbD0wJm1heD0wJnBheW1lbnQ9MCZleHBvcnQ9MCZzb3J0PTQmZW5kRD0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlEYXkgKyAnJmVuZE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZGF5TW9udGggKyAnJmVuZFk9JyArIHRvZGF5WWVhciwgJ19zZWxmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RocmVlX21vbnRocyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3N0YXRzX3NhbGVzX3JlcG9ydC5waHA/cmVwb3J0PTImc3RhcnREPScgKyBsYXN0VGhyZWVNb250aHNEYXkgKyAnJnN0YXJ0TT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRocmVlTW9udGhzTW9udGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJnN0YXJ0WT0nICsgbGFzdFRocmVlTW9udGhzWWVhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZGV0YWlsPTAmbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheURheSArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2l4X21vbnRocyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3N0YXRzX3NhbGVzX3JlcG9ydC5waHA/cmVwb3J0PTImc3RhcnREPScgKyBsYXN0U2l4TW9udGhzRGF5ICsgJyZzdGFydE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTaXhNb250aHNNb250aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmc3RhcnRZPScgKyBsYXN0U2l4TW9udGhzWWVhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZGV0YWlsPTAmbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheURheSArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3N0YXRzX3NhbGVzX3JlcG9ydC5waHA/cmVwb3J0PTImc3RhcnREPScgKyBsYXN0WWVhckRheSArICcmc3RhcnRNPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0WWVhck1vbnRoICsgJyZzdGFydFk9JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RZZWFyWWVhciArICcmZGV0YWlsPTAmbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgKyB0b2RheURheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIEN1cnJlbnRseSBvbmxpbmUgKEpldHp0IG9ubGluZSlcbiAgICAgICAgICAgIG9ubGluZToge1xuICAgICAgICAgICAgICAgIGFwaVVybDogJ2FkbWluLnBocD9kbz1EYXNoYm9hcmQvR2V0VXNlcnNPbmxpbmUnLFxuICAgICAgICAgICAgICAgIGhlYWRpbmc6ICcldGltZXNwYW4lJyxcbiAgICAgICAgICAgICAgICBzdWJ0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1RBVElTVElDU19VU0VSU19PTkxJTkUnLCAnc3RhcnQnKSxcbiAgICAgICAgICAgICAgICBzbWFsbFRleHQ6ICcnLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3dob3Nfb25saW5lLnBocCcsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFZpc2l0b3JzIChCZXN1Y2hlcilcbiAgICAgICAgICAgIHZpc2l0b3JzOiB7XG4gICAgICAgICAgICAgICAgYXBpVXJsOiAnYWRtaW4ucGhwP2RvPURhc2hib2FyZC9HZXRWaXNpdG9ycycsXG4gICAgICAgICAgICAgICAgaGVhZGluZzogJyV0aW1lc3BhbiUnLFxuICAgICAgICAgICAgICAgIHN1YnRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSVNUSUNTX1ZJU0lUT1JTJywgJ3N0YXJ0JyksXG4gICAgICAgICAgICAgICAgc21hbGxUZXh0OiAnKCcgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1RBVElTVElDU19JTlRFUlZBTF9UT0RBWScsICdzdGFydCcpICsgJzogJyArICcldG9kYXklKScsXG4gICAgICAgICAgICAgICAgb25DbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbignZ21fY291bnRlci5waHAnLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBOZXcgQ3VzdG9tZXJzIChOZXVlIEt1bmRlbilcbiAgICAgICAgICAgIG5ld0N1c3RvbWVyczoge1xuICAgICAgICAgICAgICAgIGFwaVVybDogJ2FkbWluLnBocD9kbz1EYXNoYm9hcmQvR2V0TmV3Q3VzdG9tZXJzJyxcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnJXRpbWVzcGFuJScsXG4gICAgICAgICAgICAgICAgc3VidGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJU1RJQ1NfTkVXX0NVU1RPTUVSUycsICdzdGFydCcpLFxuICAgICAgICAgICAgICAgIHNtYWxsVGV4dDogJygnICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJU1RJQ1NfSU5URVJWQUxfVE9EQVknLCAnc3RhcnQnKSArICc6ICcgKyAnJXRvZGF5JSknLFxuICAgICAgICAgICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ2N1c3RvbWVycy5waHAnLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBPcmRlcnMgKEJlc3RlbGx1bmdlbilcbiAgICAgICAgICAgIG9yZGVyczoge1xuICAgICAgICAgICAgICAgIGFwaVVybDogJ2FkbWluLnBocD9kbz1EYXNoYm9hcmQvR2V0T3JkZXJzQ291bnQnLFxuICAgICAgICAgICAgICAgIGhlYWRpbmc6ICcldGltZXNwYW4lJyxcbiAgICAgICAgICAgICAgICBzdWJ0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1RBVElTVElDU19PUkRFUlNfQ09VTlQnLCAnc3RhcnQnKSxcbiAgICAgICAgICAgICAgICBzbWFsbFRleHQ6ICcoJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSVNUSUNTX0lOVEVSVkFMX1RPREFZJywgJ3N0YXJ0JykgKyAnOiAnICsgJyV0b2RheSUpJyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKG9wdGlvbnMub3JkZXJzVXJsLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBDb252ZXJzaW9uIFJhdGVcbiAgICAgICAgICAgIGNvbnZlcnNpb25SYXRlOiB7XG4gICAgICAgICAgICAgICAgYXBpVXJsOiAnYWRtaW4ucGhwP2RvPURhc2hib2FyZC9HZXRDb252ZXJzaW9uUmF0ZScsXG4gICAgICAgICAgICAgICAgaGVhZGluZzogJyV0aW1lc3BhbiUgJScsXG4gICAgICAgICAgICAgICAgc3VidGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJU1RJQ1NfQ09OVkVSU0lPTl9SQVRFJywgJ3N0YXJ0JyksXG4gICAgICAgICAgICAgICAgc21hbGxUZXh0OiAnKCcgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1RBVElTVElDU19JTlRFUlZBTF9UT0RBWScsICdzdGFydCcpICsgJzogJyArICcldG9kYXklICUpJyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdnbV9jb3VudGVyLnBocCcsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIEF2ZXJhZ2Ugb3JkZXIgdG90YWwgKER1cmNoc2Nobml0dGxpY2hlciBCZXN0ZWxsd2VydClcbiAgICAgICAgICAgIGF2Z09yZGVyVG90YWw6IHtcbiAgICAgICAgICAgICAgICBhcGlVcmw6ICdhZG1pbi5waHA/ZG89RGFzaGJvYXJkL0dldEF2ZXJhZ2VPcmRlclZhbHVlJyxcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiAnJXRpbWVzcGFuJScsXG4gICAgICAgICAgICAgICAgc3VidGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJU1RJQ1NfQVZFUkdBR0VfT1JERVJfVkFMVUUnLCAnc3RhcnQnKSxcbiAgICAgICAgICAgICAgICBzbWFsbFRleHQ6ICcoJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSVNUSUNTX0lOVEVSVkFMX1RPREFZJywgJ3N0YXJ0JykgKyAnOiAnICsgJyV0b2RheSUpJyxcbiAgICAgICAgICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoJGRyb3Bkb3duLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3Blbignc3RhdHNfc2FsZXNfcmVwb3J0LnBocD9yZXBvcnQ9NCZzdGFydEQ9JyArIGxhc3RXZWVrRGF5ICsgJyZzdGFydE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RXZWVrTW9udGggKyAnJnN0YXJ0WT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFdlZWtZZWFyICsgJyZkZXRhaWw9MiZtYXg9MCZwYXltZW50PTAmZXhwb3J0PTAmc29ydD00JmVuZEQ9JyArIHRvZGF5RGF5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJyZlbmRNPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheU1vbnRoICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyZlbmRZPScgKyB0b2RheVllYXIsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICd0d29fd2Vla3MnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdzdGF0c19zYWxlc19yZXBvcnQucGhwP3JlcG9ydD0zJnN0YXJ0RD0nICsgbGFzdFR3b1dlZWtza0RheSArICcmc3RhcnRNPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdvV2Vla3NNb250aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmc3RhcnRZPScgKyBsYXN0VHdvV2Vla3NrWWVhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZGV0YWlsPTImbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheURheSArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKCdzdGF0c19zYWxlc19yZXBvcnQucGhwP3JlcG9ydD0zJnN0YXJ0RD0nICsgbGFzdE1vbnRoRGF5ICsgJyZzdGFydE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RNb250aE1vbnRoICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyZzdGFydFk9JyArIGxhc3RNb250aFllYXIgKyAnJmRldGFpbD0yJm1heD0wJnBheW1lbnQ9MCZleHBvcnQ9MCZzb3J0PTQmZW5kRD0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlEYXkgKyAnJmVuZE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvZGF5TW9udGggKyAnJmVuZFk9JyArIHRvZGF5WWVhciwgJ19zZWxmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3RocmVlX21vbnRocyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3N0YXRzX3NhbGVzX3JlcG9ydC5waHA/cmVwb3J0PTImc3RhcnREPScgKyBsYXN0VGhyZWVNb250aHNEYXkgKyAnJnN0YXJ0TT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFRocmVlTW9udGhzTW9udGggK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnJnN0YXJ0WT0nICsgbGFzdFRocmVlTW9udGhzWWVhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZGV0YWlsPTImbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheURheSArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2l4X21vbnRocyc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3N0YXRzX3NhbGVzX3JlcG9ydC5waHA/cmVwb3J0PTImc3RhcnREPScgKyBsYXN0U2l4TW9udGhzRGF5ICsgJyZzdGFydE09JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RTaXhNb250aHNNb250aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmc3RhcnRZPScgKyBsYXN0U2l4TW9udGhzWWVhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZGV0YWlsPTImbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2RheURheSArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJ3N0YXRzX3NhbGVzX3JlcG9ydC5waHA/cmVwb3J0PTImc3RhcnREPScgKyBsYXN0WWVhckRheSArICcmc3RhcnRNPScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0WWVhck1vbnRoICsgJyZzdGFydFk9JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RZZWFyWWVhciArICcmZGV0YWlsPTImbWF4PTAmcGF5bWVudD0wJmV4cG9ydD0wJnNvcnQ9NCZlbmREPScgKyB0b2RheURheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICcmZW5kTT0nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXlNb250aCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmZW5kWT0nICsgdG9kYXlZZWFyLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbnRlcnBvbGF0aW9uIG1hcCBmb3IgcmVwbGFjaW5nIHN0cmluZ3NcbiAgICAgICAgdmFyIGludGVycG9sYXRpb25NYXAgPSB7XG4gICAgICAgICAgICB0b2RheTogJyV0b2RheSUnLFxuICAgICAgICAgICAgdGltZXNwYW46ICcldGltZXNwYW4lJ1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGUgb3ZlciB0aGUgaW50ZXJwb2xhdGlvbiBtYXBcbiAgICAgICAgICogYW5kIGludGVycG9sYXRlIHN0cmluZ3Mgd2l0aCB2YWx1ZXNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUZXh0IHRvIGludGVycG9sYXRlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZXMgLSBWYWx1ZXMgdG8gcHV0IGluXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2ludGVycG9sYXRlID0gZnVuY3Rpb24gKHRleHQsIHZhbHVlcykge1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGludGVycG9sYXRpb25NYXApIHtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJwb2xhdGlvbk1hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoaW50ZXJwb2xhdGlvbk1hcFtrZXldLCB2YWx1ZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHJpZXZlcyBkYXRhIGZyb20gc2VydmVyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpbnRlcnZhbFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXREYXRhID0gZnVuY3Rpb24gKGludGVydmFsKSB7XG4gICAgICAgICAgICAvLyBNYWtlIEFKQVggY2FsbFxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICdhZG1pbi5waHA/ZG89RGFzaGJvYXJkL0dldFN0YXRpc3RpY0JveGVzJmludGVydmFsPScgKyBpbnRlcnZhbCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gT24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBzZWN0aW9uIGluIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlW3NlY3Rpb25dO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHN0YXRpc3RpY0JveCA9ICR0aGlzLmZpbmQoJ1tkYXRhLXN0YXRpc3RpY19ib3gtaXRlbT1cIicgKyBzZWN0aW9uICsgJ1wiXScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRoZWFkaW5nID0gJHN0YXRpc3RpY0JveC5maW5kKCcuaGVhZGluZycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdWJ0ZXh0ID0gJHN0YXRpc3RpY0JveC5maW5kKCcuc3VidGV4dCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzbWFsbFRleHQgPSAkc3RhdGlzdGljQm94LmZpbmQoJy5zbWFsbC10ZXh0Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAgICAgICAgICogVmFsdWVzIG1hcFxuICAgICAgICAgICAgICAgICAgICAgICAgICogS2V5cyBzaG91bGQgYmUgdGhlIHNhbWUgYXMgaW4gdGhlIGludGVycG9sYXRpb25NYXBcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZXNwYW46IGRhdGEudGltZXNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9kYXk6IGRhdGEudG9kYXlcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0aXN0aWNCb3guZmluZCgnLmljb24tY29udGFpbmVyLCAudGV4dC1jb250YWluZXInKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAnc2xvdycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9ICRzdGF0aXN0aWNCb3guZGF0YSgnc3RhdGlzdGljX2JveEl0ZW0nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW50ZXJwb2xhdGUgaGVhZGluZyB0ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAkaGVhZGluZy50ZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pbnRlcnBvbGF0ZShtYXBbaXRlbV0uaGVhZGluZywgdmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW50ZXJwb2xhdGUgc3VidGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN1YnRleHQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaW50ZXJwb2xhdGUobWFwW2l0ZW1dLnN1YnRleHQsIHZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEludGVycG9sYXRlIHNtYWxsIHRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICRzbWFsbFRleHQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaW50ZXJwb2xhdGUobWFwW2l0ZW1dLnNtYWxsVGV4dCwgdmFsdWVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLy8gT24gZmFpbFxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gbG9hZCBzdGF0aXN0aWMgcmVzb3VyY2UuJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgY2xhc3NlcywgZXZlbnRzIGFuZCBlbGVtZW50cyB0byB0aGUgd2lkZ2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkc3RhdGlzdGljQm94IFRoZSBjdXJyZW50bHkgcHJvY2Vzc2VkIHN0YXRpc3RpYyBib3ggc2VsZWN0b3IuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3ByZXBhcmUgPSBmdW5jdGlvbiAoJHN0YXRpc3RpY0JveCkge1xuICAgICAgICAgICAgdmFyICRpY29uQ29udGFpbmVyLFxuICAgICAgICAgICAgICAgICRpY29uLFxuICAgICAgICAgICAgICAgICR0ZXh0Q29udGFpbmVyLFxuICAgICAgICAgICAgICAgICRoZWFkaW5nLFxuICAgICAgICAgICAgICAgICRzdWJ0ZXh0LFxuICAgICAgICAgICAgICAgICRzbWFsbFRleHQ7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgaWNvbiBjb250YWluZXJcbiAgICAgICAgICAgICRpY29uID0gJCgnPGk+Jyk7XG4gICAgICAgICAgICAkaWNvblxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZmEgZmEtZncgZmEtbGcnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygkc3RhdGlzdGljQm94LmRhdGEoJ3N0YXRpc3RpY19ib3hJY29uJykpO1xuXG4gICAgICAgICAgICAkaWNvbkNvbnRhaW5lciA9ICQoJzxkaXY+Jyk7XG4gICAgICAgICAgICAkaWNvbkNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaWNvbi1jb250YWluZXIgc3BhbjQnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygkc3RhdGlzdGljQm94LmRhdGEoJ3N0YXRpc3RpY19ib3hDb2xvcicpKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJGljb24pO1xuXG4gICAgICAgICAgICAvLyBQcmVwYXJlIHRleHQgY29udGFpbmVyXG4gICAgICAgICAgICAkaGVhZGluZyA9ICQoJzxkaXY+Jyk7XG4gICAgICAgICAgICAkaGVhZGluZy5hZGRDbGFzcygnaGVhZGluZycpO1xuXG4gICAgICAgICAgICAkc3VidGV4dCA9ICQoJzxkaXY+Jyk7XG4gICAgICAgICAgICAkc3VidGV4dC5hZGRDbGFzcygnc3VidGV4dCcpO1xuXG4gICAgICAgICAgICAkc21hbGxUZXh0ID0gJCgnPGRpdj4nKTtcbiAgICAgICAgICAgICRzbWFsbFRleHQuYWRkQ2xhc3MoJ3NtYWxsLXRleHQnKTtcblxuICAgICAgICAgICAgJHRleHRDb250YWluZXIgPSAkKCc8ZGl2PicpO1xuICAgICAgICAgICAgJHRleHRDb250YWluZXJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3RleHQtY29udGFpbmVyIHNwYW44JylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCRoZWFkaW5nKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJHN1YnRleHQpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkc21hbGxUZXh0KTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGNsaWNrIGV2ZW50XG4gICAgICAgICAgICAkc3RhdGlzdGljQm94Lm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIG1hcFskKHRoaXMpLmRhdGEoJ3N0YXRpc3RpY19ib3hJdGVtJyldLm9uQ2xpY2soZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENvbXBvc2UgSFRNTFxuICAgICAgICAgICAgJHN0YXRpc3RpY0JveFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygndG9vbGJhciBncmlkJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kKCRpY29uQ29udGFpbmVyKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJHRleHRDb250YWluZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkc3RhdGlzdGljQm94ZXMuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHN0YXRpc3RpY0JveCkge1xuICAgICAgICAgICAgICAgIF9wcmVwYXJlKCQoc3RhdGlzdGljQm94KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRXZlbnQgaGFuZGxlcjogVHJpZ2dlciBkYXRhIHJlcXVlc3RcbiAgICAgICAgICAgICR0aGlzLm9uKCdnZXQ6ZGF0YScsIGZ1bmN0aW9uIChldmVudCwgaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgX2dldERhdGEoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
