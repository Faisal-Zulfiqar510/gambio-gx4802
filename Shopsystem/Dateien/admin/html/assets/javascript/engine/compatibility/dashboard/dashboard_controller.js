'use strict';

/* --------------------------------------------------------------
 dashboard_controller.js 2018-01-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Dashboard Controller
 *
 * This controller will handle dashboard stats page (compatibility).
 *
 * @module Compatibility/dashboard_controller
 */
gx.compatibility.module('dashboard_controller', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', jse.source + '/vendor/DateJS/date.min.js', 'datatable', 'user_configuration_service', 'xhr'],

/**  @lends module:Compatibility/dashboard_controller */

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
     * Last Orders Table Selector
     *
     * @var {object}
     */
    $lastOrdersTable = $this.find('.latest-orders-table'),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        'collapsed': false
    },


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * UserConfiguration Service Alias
     */
    userConfigurationService = jse.libs.user_configuration_service,


    /**
     * Statistics Element Selectors
     */
    $dropdown = $('.js-interval-dropdown'),
        $container = $dropdown.parents('.toolbar:first'),
        $statisticChartTab = $('.statistic-chart'),
        $statisticGrid = $('#statistic-grid'),
        $statisticChart = $statisticChartTab.find('#dashboard-chart'),
        $itemDropdown = $('.statistic-chart-dropdown'),
        $tabDropdown = $('.statistic-tab-dropdown'),
        $tabs = $('.ui-tabs'),


    /**
     * Module
     *
     * @type {object}
     */
    module = {},
        orderStatusData;

    /**
     * Get badge class (gx-admin.css) for graphical representation of the order status.
     *
     * @param {object} rowData Contains all the row data.
     *
     * @return {string} Returns the correct badge class for the order (e.g. "badge-success", "badge-danger" ...)
     */
    var _getBadgeClass = function _getBadgeClass(rowData) {
        switch (rowData.orders_status) {
            case '1':
                return 'badge badge-warning';
            case '2':
                return 'badge badge-primary';
            case '3':
            case '7':
            case '149':
            case '161':
            case '163':
                return 'badge badge-success';
            case '0':
            case '6':
            case '99':
            case '162':
            case '171':
                return 'badge badge-danger';
            default:
                return '';
        }
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * On row click event go to the order details page.
     *
     * @param {object} event
     */
    var _onRowClick = function _onRowClick(event) {
        $(this).parent('tr').find('td:eq(0) a').get(0).click(); // click first cell link
    };

    /**
     * Initializes statistic-related stuff (specially interval dropdown actions)
     */
    var _initStatistics = function _initStatistics() {

        // Configuration parameters
        var configParams = {
            userId: $dropdown.data('userId'),
            configurationKey: 'statisticsInterval'
        };

        // Function to execute after getting configuration value from server.
        var prepare = function prepare(value) {
            // Select right value
            $dropdown.find('option[value="' + value + '"]').prop('selected', true);

            // Show dropdown again
            $container.animate({
                opacity: 1
            }, 'slow');

            // Performs action on changing value in this dropdown
            // Update values in statistic box widgets and
            // area chart widget. Additionally the value will be saved.
            $dropdown.on('change', function (event) {
                var setConfigurationValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

                // Get selected value
                var interval = $(this).find('option:selected').val();

                // Update statistic boxes
                $statisticGrid.trigger('get:data', interval);

                // Update chart (if visible)
                if ($statisticChart.is(':visible')) {
                    $statisticChart.trigger('get:data', interval);
                }

                // Save config
                if (setConfigurationValue !== false) {
                    userConfigurationService.set({
                        data: $.extend(configParams, {
                            configurationValue: interval
                        })
                    });
                }
            });

            // Trigger change to refresh data on statistics.
            $(document).on('JSENGINE_INIT_FINISHED', function () {
                $dropdown.trigger('change', [false]);
            });
        };

        // Hide element (to fade it in later after performing server request)
        $container.animate({
            'opacity': 0.1
        }, 'slow');

        // Get configuration from the server.
        var value = options.statisticsInterval || 'one_week'; // Default Value
        prepare(value);
    };

    /**
     * Initialize the statistics tab.
     */
    var _initStatisticChart = function _initStatisticChart() {
        // Configuration parameters
        var configParams = {
            userId: $dropdown.data('userId'),
            configurationKey: 'statisticsChartItem'
        };

        // Function to execute after getting configuration value from server
        function prepare(item) {
            var setConfigurationValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            // Select right value
            $itemDropdown.find('option[value="' + item + '"]').prop('selected', true);

            // Get interval value from dropdown
            var interval = $dropdown.find('option:selected').val();

            // Show dropdown again
            $itemDropdown.animate({
                'opacity': 1
            }, 'slow');

            // Update chart 
            $statisticChart.trigger('get:data', interval, item);

            // Save config
            if (setConfigurationValue) {
                userConfigurationService.set({
                    data: $.extend(configParams, {
                        configurationValue: item
                    })
                });
            }
        }

        /**
         * Get Configuration Value from Server
         */
        function getConfigurationValue() {
            var interval = setInterval(function () {
                if ($statisticChart.is(':visible')) {
                    var value = options.statisticsChartItem || 'sales'; // Default value
                    prepare(value, false);
                    clearInterval(interval);
                }
            }, 100);

            // Perform action on changing item value in dropdown
            $itemDropdown.off().on('change', function () {
                var item = $(this).find('option:selected').val();
                prepare(item);
            });
        }

        // Perform actions on opening tab.
        $('a[href="#chart"]').off().on('click', getConfigurationValue);
    };

    var _initTabSelector = function _initTabSelector() {
        var configParams = {
            userId: $dropdown.data('userId'),
            configurationKey: 'statisticsTab'
        };

        $tabDropdown.on('change', function (event) {
            var setConfigurationValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var value = $(this).find('option:selected').val();
            $tabs.trigger('show:tab', value);

            if (setConfigurationValue !== false) {
                userConfigurationService.set({
                    data: $.extend(configParams, {
                        configurationValue: value
                    })
                });
            }
        });

        function prepare(value) {
            $tabDropdown.find('option[value="' + value + '"]').prop('selected', true).trigger('change', [false]);
        }

        var value = options.statisticsTab !== '' ? options.statisticsTab : 1; // Default Value
        prepare(value);
    };

    var _initDashboardToggler = function _initDashboardToggler() {
        var $toggler = $('<i class="fa fa-angle-double-up"></i>');

        if (options.collapsed) {
            $toggler = $('<i class="fa fa-angle-double-down"></i>');
            $('.dashboard-chart').hide();
        }

        $this.find('.dashboard-toggler').append($toggler);
        $toggler.on('click', _toggleDashboard);
    };

    var _toggleDashboard = function _toggleDashboard(event, $toggler) {
        var configParams = {
            userId: $dropdown.data('userId'),
            configurationKey: 'dashboard_chart_collapse',
            configurationValue: !options.collapsed
        };

        options.collapsed = !options.collapsed;
        userConfigurationService.set({
            data: configParams
        });

        if (options.collapsed) {
            $('.dashboard-chart').slideUp();
        } else {
            $('.statistic-tab-dropdown').trigger('change');
            $('.dashboard-chart').slideDown();
        }

        $this.find('.dashboard-toggler i').toggleClass('fa-angle-double-down');
        $this.find('.dashboard-toggler i').toggleClass('fa-angle-double-up');
    };

    var _createLatestOrdersTable = function _createLatestOrdersTable() {
        // Get latest orders and create a new DataTable instance.
        jse.libs.datatable.create($lastOrdersTable, {
            processing: true,
            dom: 't',
            ordering: false,
            ajax: jse.core.config.get('appUrl') + '/admin/admin.php?do=Dashboard/GetLatestOrders',
            language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
            order: [[3, 'desc']],
            columns: [
            // Order ID
            {
                data: 'orders_id',
                className: 'text-right',
                render: function render(data, type, row, meta) {
                    return '<a href="orders.php?page=1&oID=' + data + '&action=edit">' + data + '</a>';
                }
            },
            // Customer's name
            {
                data: 'customers_name'
            },
            // Order total in text format
            {
                data: 'text',
                className: 'text-right'
            }, {
                data: 'date_purchased',
                render: function render(data, type, row, meta) {
                    var dt = Date.parse(data); // using datejs
                    return dt.toString('dd.MM.yyyy HH:mm');
                }
            },
            // Payment method
            {
                data: 'payment_method'
            },
            // Order Status name
            {
                data: 'orders_status_name',
                render: function render(data, type, row, meta) {
                    var className = _getBadgeClass(row);
                    var i;
                    var bgColor;
                    var color;

                    if (undefined === orderStatusData) {
                        return '<span class="badge ' + className + '">' + data + '</span>';
                    }

                    for (i = 0; i < orderStatusData.length; i++) {
                        if (orderStatusData[i].id === Number(row.orders_status)) {
                            bgColor = orderStatusData[i].backgroundColor;
                            color = orderStatusData[i].color;
                            break;
                        }
                    }

                    // console.log(orderStatusData);

                    return '<span class="badge" style="background-color: #' + bgColor + '; background-image: none; color: #' + color + '">' + data + '</span>';
                }
            }]
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Initialize the dashboard statistics.
        _initStatistics();
        _initStatisticChart();
        _initTabSelector();
        _initDashboardToggler();

        // fetch order status data before creating latest orders table
        if (options.orders_allowed) {
            jse.libs.xhr.get({
                url: './admin.php?do=OrderStatusAjax'
            }).done(function (r) {
                orderStatusData = r;
                _createLatestOrdersTable();
            }).fail(function (r) {
                return _createLatestOrdersTable();
            });
        }

        $lastOrdersTable.on('init.dt', function () {
            // Bind row click event only if there are rows in the table.
            if ($lastOrdersTable.DataTable().data().length > 0) {
                $lastOrdersTable.on('click', 'tbody tr td', _onRowClick);
            }

            // Show the cursor as a pointer for each row.
            $this.find('tr:not(":eq(0)")').addClass('cursor-pointer');
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC9kYXNoYm9hcmRfY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGxhc3RPcmRlcnNUYWJsZSIsImZpbmQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJ1c2VyQ29uZmlndXJhdGlvblNlcnZpY2UiLCJsaWJzIiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCIkZHJvcGRvd24iLCIkY29udGFpbmVyIiwicGFyZW50cyIsIiRzdGF0aXN0aWNDaGFydFRhYiIsIiRzdGF0aXN0aWNHcmlkIiwiJHN0YXRpc3RpY0NoYXJ0IiwiJGl0ZW1Ecm9wZG93biIsIiR0YWJEcm9wZG93biIsIiR0YWJzIiwib3JkZXJTdGF0dXNEYXRhIiwiX2dldEJhZGdlQ2xhc3MiLCJyb3dEYXRhIiwib3JkZXJzX3N0YXR1cyIsIl9vblJvd0NsaWNrIiwiZXZlbnQiLCJwYXJlbnQiLCJnZXQiLCJjbGljayIsIl9pbml0U3RhdGlzdGljcyIsImNvbmZpZ1BhcmFtcyIsInVzZXJJZCIsImNvbmZpZ3VyYXRpb25LZXkiLCJwcmVwYXJlIiwidmFsdWUiLCJwcm9wIiwiYW5pbWF0ZSIsIm9wYWNpdHkiLCJvbiIsInNldENvbmZpZ3VyYXRpb25WYWx1ZSIsImludGVydmFsIiwidmFsIiwidHJpZ2dlciIsImlzIiwic2V0IiwiY29uZmlndXJhdGlvblZhbHVlIiwiZG9jdW1lbnQiLCJzdGF0aXN0aWNzSW50ZXJ2YWwiLCJfaW5pdFN0YXRpc3RpY0NoYXJ0IiwiaXRlbSIsImdldENvbmZpZ3VyYXRpb25WYWx1ZSIsInNldEludGVydmFsIiwic3RhdGlzdGljc0NoYXJ0SXRlbSIsImNsZWFySW50ZXJ2YWwiLCJvZmYiLCJfaW5pdFRhYlNlbGVjdG9yIiwic3RhdGlzdGljc1RhYiIsIl9pbml0RGFzaGJvYXJkVG9nZ2xlciIsIiR0b2dnbGVyIiwiY29sbGFwc2VkIiwiaGlkZSIsImFwcGVuZCIsIl90b2dnbGVEYXNoYm9hcmQiLCJzbGlkZVVwIiwic2xpZGVEb3duIiwidG9nZ2xlQ2xhc3MiLCJfY3JlYXRlTGF0ZXN0T3JkZXJzVGFibGUiLCJkYXRhdGFibGUiLCJjcmVhdGUiLCJwcm9jZXNzaW5nIiwiZG9tIiwib3JkZXJpbmciLCJhamF4IiwiY29yZSIsImNvbmZpZyIsImxhbmd1YWdlIiwiZ2V0VHJhbnNsYXRpb25zIiwib3JkZXIiLCJjb2x1bW5zIiwiY2xhc3NOYW1lIiwicmVuZGVyIiwidHlwZSIsInJvdyIsIm1ldGEiLCJkdCIsIkRhdGUiLCJwYXJzZSIsInRvU3RyaW5nIiwiaSIsImJnQ29sb3IiLCJjb2xvciIsInVuZGVmaW5lZCIsImxlbmd0aCIsImlkIiwiTnVtYmVyIiwiYmFja2dyb3VuZENvbG9yIiwiaW5pdCIsImRvbmUiLCJvcmRlcnNfYWxsb3dlZCIsInhociIsInVybCIsInIiLCJmYWlsIiwiRGF0YVRhYmxlIiwiYWRkQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLHNCQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCxtREFFT0QsSUFBSUMsTUFGWCxrREFHT0QsSUFBSUMsTUFIWCxpQ0FJSSxXQUpKLEVBS0ksNEJBTEosRUFNSSxLQU5KLENBSEo7O0FBWUk7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyx1QkFBbUJGLE1BQU1HLElBQU4sQ0FBVyxzQkFBWCxDQWJ2Qjs7O0FBZUk7Ozs7O0FBS0FDLGVBQVc7QUFDUCxxQkFBYTtBQUROLEtBcEJmOzs7QUF3Qkk7Ozs7O0FBS0FDLGNBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJMLElBQTdCLENB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YXJkX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhc2hib2FyZF9jb250cm9sbGVyLmpzIDIwMTgtMDEtMjRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIERhc2hib2FyZCBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIHdpbGwgaGFuZGxlIGRhc2hib2FyZCBzdGF0cyBwYWdlIChjb21wYXRpYmlsaXR5KS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvZGFzaGJvYXJkX2NvbnRyb2xsZXJcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ2Rhc2hib2FyZF9jb250cm9sbGVyJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2RhdGF0YWJsZXMvanF1ZXJ5LmRhdGFUYWJsZXMubWluLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5qc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9EYXRlSlMvZGF0ZS5taW4uanNgLFxuICAgICAgICAnZGF0YXRhYmxlJyxcbiAgICAgICAgJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJyxcbiAgICAgICAgJ3hocidcbiAgICBdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvZGFzaGJvYXJkX2NvbnRyb2xsZXIgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTGFzdCBPcmRlcnMgVGFibGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRsYXN0T3JkZXJzVGFibGUgPSAkdGhpcy5maW5kKCcubGF0ZXN0LW9yZGVycy10YWJsZScpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICdjb2xsYXBzZWQnOiBmYWxzZVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBVc2VyQ29uZmlndXJhdGlvbiBTZXJ2aWNlIEFsaWFzXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVzZXJDb25maWd1cmF0aW9uU2VydmljZSA9IGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFN0YXRpc3RpY3MgRWxlbWVudCBTZWxlY3RvcnNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGRyb3Bkb3duID0gJCgnLmpzLWludGVydmFsLWRyb3Bkb3duJyksXG4gICAgICAgICAgICAkY29udGFpbmVyID0gJGRyb3Bkb3duLnBhcmVudHMoJy50b29sYmFyOmZpcnN0JyksXG4gICAgICAgICAgICAkc3RhdGlzdGljQ2hhcnRUYWIgPSAkKCcuc3RhdGlzdGljLWNoYXJ0JyksXG4gICAgICAgICAgICAkc3RhdGlzdGljR3JpZCA9ICQoJyNzdGF0aXN0aWMtZ3JpZCcpLFxuICAgICAgICAgICAgJHN0YXRpc3RpY0NoYXJ0ID0gJHN0YXRpc3RpY0NoYXJ0VGFiLmZpbmQoJyNkYXNoYm9hcmQtY2hhcnQnKSxcbiAgICAgICAgICAgICRpdGVtRHJvcGRvd24gPSAkKCcuc3RhdGlzdGljLWNoYXJ0LWRyb3Bkb3duJyksXG4gICAgICAgICAgICAkdGFiRHJvcGRvd24gPSAkKCcuc3RhdGlzdGljLXRhYi1kcm9wZG93bicpLFxuICAgICAgICAgICAgJHRhYnMgPSAkKCcudWktdGFicycpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9LFxuXG4gICAgICAgICAgICBvcmRlclN0YXR1c0RhdGE7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBiYWRnZSBjbGFzcyAoZ3gtYWRtaW4uY3NzKSBmb3IgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvcmRlciBzdGF0dXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByb3dEYXRhIENvbnRhaW5zIGFsbCB0aGUgcm93IGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gUmV0dXJucyB0aGUgY29ycmVjdCBiYWRnZSBjbGFzcyBmb3IgdGhlIG9yZGVyIChlLmcuIFwiYmFkZ2Utc3VjY2Vzc1wiLCBcImJhZGdlLWRhbmdlclwiIC4uLilcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZ2V0QmFkZ2VDbGFzcyA9IGZ1bmN0aW9uIChyb3dEYXRhKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHJvd0RhdGEub3JkZXJzX3N0YXR1cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJzEnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2JhZGdlIGJhZGdlLXdhcm5pbmcnO1xuICAgICAgICAgICAgICAgIGNhc2UgJzInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2JhZGdlIGJhZGdlLXByaW1hcnknO1xuICAgICAgICAgICAgICAgIGNhc2UgJzMnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzcnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzE0OSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnMTYxJzpcbiAgICAgICAgICAgICAgICBjYXNlICcxNjMnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2JhZGdlIGJhZGdlLXN1Y2Nlc3MnO1xuICAgICAgICAgICAgICAgIGNhc2UgJzAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzYnOlxuICAgICAgICAgICAgICAgIGNhc2UgJzk5JzpcbiAgICAgICAgICAgICAgICBjYXNlICcxNjInOlxuICAgICAgICAgICAgICAgIGNhc2UgJzE3MSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnYmFkZ2UgYmFkZ2UtZGFuZ2VyJztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiByb3cgY2xpY2sgZXZlbnQgZ28gdG8gdGhlIG9yZGVyIGRldGFpbHMgcGFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uUm93Q2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCd0cicpLmZpbmQoJ3RkOmVxKDApIGEnKS5nZXQoMCkuY2xpY2soKTsgLy8gY2xpY2sgZmlyc3QgY2VsbCBsaW5rXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemVzIHN0YXRpc3RpYy1yZWxhdGVkIHN0dWZmIChzcGVjaWFsbHkgaW50ZXJ2YWwgZHJvcGRvd24gYWN0aW9ucylcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaW5pdFN0YXRpc3RpY3MgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIC8vIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICAgICAgICAgICAgdmFyIGNvbmZpZ1BhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICB1c2VySWQ6ICRkcm9wZG93bi5kYXRhKCd1c2VySWQnKSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uS2V5OiAnc3RhdGlzdGljc0ludGVydmFsJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciBnZXR0aW5nIGNvbmZpZ3VyYXRpb24gdmFsdWUgZnJvbSBzZXJ2ZXIuXG4gICAgICAgICAgICB2YXIgcHJlcGFyZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdCByaWdodCB2YWx1ZVxuICAgICAgICAgICAgICAgICRkcm9wZG93blxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnb3B0aW9uW3ZhbHVlPVwiJyArIHZhbHVlICsgJ1wiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdzZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2hvdyBkcm9wZG93biBhZ2FpblxuICAgICAgICAgICAgICAgICRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9LCAnc2xvdycpO1xuXG4gICAgICAgICAgICAgICAgLy8gUGVyZm9ybXMgYWN0aW9uIG9uIGNoYW5naW5nIHZhbHVlIGluIHRoaXMgZHJvcGRvd25cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdmFsdWVzIGluIHN0YXRpc3RpYyBib3ggd2lkZ2V0cyBhbmRcbiAgICAgICAgICAgICAgICAvLyBhcmVhIGNoYXJ0IHdpZGdldC4gQWRkaXRpb25hbGx5IHRoZSB2YWx1ZSB3aWxsIGJlIHNhdmVkLlxuICAgICAgICAgICAgICAgICRkcm9wZG93bi5vbignY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50LCBzZXRDb25maWd1cmF0aW9uVmFsdWUgPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBzZWxlY3RlZCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICB2YXIgaW50ZXJ2YWwgPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBzdGF0aXN0aWMgYm94ZXNcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRpc3RpY0dyaWQudHJpZ2dlcignZ2V0OmRhdGEnLCBpbnRlcnZhbCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGNoYXJ0IChpZiB2aXNpYmxlKVxuICAgICAgICAgICAgICAgICAgICBpZiAoJHN0YXRpc3RpY0NoYXJ0LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGlzdGljQ2hhcnQudHJpZ2dlcignZ2V0OmRhdGEnLCBpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBTYXZlIGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0Q29uZmlndXJhdGlvblZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJC5leHRlbmQoY29uZmlnUGFyYW1zLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgY2hhbmdlIHRvIHJlZnJlc2ggZGF0YSBvbiBzdGF0aXN0aWNzLlxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdKU0VOR0lORV9JTklUX0ZJTklTSEVEJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd24udHJpZ2dlcignY2hhbmdlJywgW2ZhbHNlXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBIaWRlIGVsZW1lbnQgKHRvIGZhZGUgaXQgaW4gbGF0ZXIgYWZ0ZXIgcGVyZm9ybWluZyBzZXJ2ZXIgcmVxdWVzdClcbiAgICAgICAgICAgICRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgJ29wYWNpdHknOiAwLjFcbiAgICAgICAgICAgIH0sICdzbG93Jyk7XG5cbiAgICAgICAgICAgIC8vIEdldCBjb25maWd1cmF0aW9uIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG9wdGlvbnMuc3RhdGlzdGljc0ludGVydmFsIHx8ICdvbmVfd2Vlayc7IC8vIERlZmF1bHQgVmFsdWVcbiAgICAgICAgICAgIHByZXBhcmUodmFsdWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIHRoZSBzdGF0aXN0aWNzIHRhYi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaW5pdFN0YXRpc3RpY0NoYXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gQ29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAgICAgICAgICB2YXIgY29uZmlnUGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogJGRyb3Bkb3duLmRhdGEoJ3VzZXJJZCcpLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6ICdzdGF0aXN0aWNzQ2hhcnRJdGVtJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciBnZXR0aW5nIGNvbmZpZ3VyYXRpb24gdmFsdWUgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHByZXBhcmUoaXRlbSwgc2V0Q29uZmlndXJhdGlvblZhbHVlID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIFNlbGVjdCByaWdodCB2YWx1ZVxuICAgICAgICAgICAgICAgICRpdGVtRHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ29wdGlvblt2YWx1ZT1cIicgKyBpdGVtICsgJ1wiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdzZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IGludGVydmFsIHZhbHVlIGZyb20gZHJvcGRvd25cbiAgICAgICAgICAgICAgICB2YXIgaW50ZXJ2YWwgPSAkZHJvcGRvd24uZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTaG93IGRyb3Bkb3duIGFnYWluXG4gICAgICAgICAgICAgICAgJGl0ZW1Ecm9wZG93bi5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiAxXG4gICAgICAgICAgICAgICAgfSwgJ3Nsb3cnKTtcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBjaGFydCBcbiAgICAgICAgICAgICAgICAkc3RhdGlzdGljQ2hhcnQudHJpZ2dlcignZ2V0OmRhdGEnLCBpbnRlcnZhbCwgaXRlbSk7XG5cbiAgICAgICAgICAgICAgICAvLyBTYXZlIGNvbmZpZ1xuICAgICAgICAgICAgICAgIGlmIChzZXRDb25maWd1cmF0aW9uVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLmV4dGVuZChjb25maWdQYXJhbXMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHZXQgQ29uZmlndXJhdGlvbiBWYWx1ZSBmcm9tIFNlcnZlclxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRDb25maWd1cmF0aW9uVmFsdWUoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJHN0YXRpc3RpY0NoYXJ0LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBvcHRpb25zLnN0YXRpc3RpY3NDaGFydEl0ZW0gfHwgJ3NhbGVzJzsgLy8gRGVmYXVsdCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZSh2YWx1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBhY3Rpb24gb24gY2hhbmdpbmcgaXRlbSB2YWx1ZSBpbiBkcm9wZG93blxuICAgICAgICAgICAgICAgICRpdGVtRHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgLm9mZigpXG4gICAgICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSAkKHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZShpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBlcmZvcm0gYWN0aW9ucyBvbiBvcGVuaW5nIHRhYi5cbiAgICAgICAgICAgICQoJ2FbaHJlZj1cIiNjaGFydFwiXScpXG4gICAgICAgICAgICAgICAgLm9mZigpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIGdldENvbmZpZ3VyYXRpb25WYWx1ZSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2luaXRUYWJTZWxlY3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb25maWdQYXJhbXMgPSB7XG4gICAgICAgICAgICAgICAgdXNlcklkOiAkZHJvcGRvd24uZGF0YSgndXNlcklkJyksXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogJ3N0YXRpc3RpY3NUYWInXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkdGFiRHJvcGRvd24ub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChldmVudCwgc2V0Q29uZmlndXJhdGlvblZhbHVlID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG4gICAgICAgICAgICAgICAgJHRhYnMudHJpZ2dlcignc2hvdzp0YWInLCB2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2V0Q29uZmlndXJhdGlvblZhbHVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB1c2VyQ29uZmlndXJhdGlvblNlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICQuZXh0ZW5kKGNvbmZpZ1BhcmFtcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBwcmVwYXJlKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJHRhYkRyb3Bkb3duXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdvcHRpb25bdmFsdWU9XCInICsgdmFsdWUgKyAnXCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScsIFtmYWxzZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBvcHRpb25zLnN0YXRpc3RpY3NUYWIgIT09ICcnID8gb3B0aW9ucy5zdGF0aXN0aWNzVGFiIDogMTsgLy8gRGVmYXVsdCBWYWx1ZVxuICAgICAgICAgICAgcHJlcGFyZSh2YWx1ZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9pbml0RGFzaGJvYXJkVG9nZ2xlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdG9nZ2xlciA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG91YmxlLXVwXCI+PC9pPicpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAkdG9nZ2xlciA9ICQoJzxpIGNsYXNzPVwiZmEgZmEtYW5nbGUtZG91YmxlLWRvd25cIj48L2k+Jyk7XG4gICAgICAgICAgICAgICAgJCgnLmRhc2hib2FyZC1jaGFydCcpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmRhc2hib2FyZC10b2dnbGVyJykuYXBwZW5kKCR0b2dnbGVyKTtcbiAgICAgICAgICAgICR0b2dnbGVyLm9uKCdjbGljaycsIF90b2dnbGVEYXNoYm9hcmQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfdG9nZ2xlRGFzaGJvYXJkID0gZnVuY3Rpb24gKGV2ZW50LCAkdG9nZ2xlcikge1xuICAgICAgICAgICAgdmFyIGNvbmZpZ1BhcmFtcyA9IHtcbiAgICAgICAgICAgICAgICB1c2VySWQ6ICRkcm9wZG93bi5kYXRhKCd1c2VySWQnKSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uS2V5OiAnZGFzaGJvYXJkX2NoYXJ0X2NvbGxhcHNlJyxcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6ICFvcHRpb25zLmNvbGxhcHNlZFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgb3B0aW9ucy5jb2xsYXBzZWQgPSAhb3B0aW9ucy5jb2xsYXBzZWQ7XG4gICAgICAgICAgICB1c2VyQ29uZmlndXJhdGlvblNlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjb25maWdQYXJhbXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICAkKCcuZGFzaGJvYXJkLWNoYXJ0Jykuc2xpZGVVcCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuc3RhdGlzdGljLXRhYi1kcm9wZG93bicpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgICQoJy5kYXNoYm9hcmQtY2hhcnQnKS5zbGlkZURvd24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmRhc2hib2FyZC10b2dnbGVyIGknKS50b2dnbGVDbGFzcygnZmEtYW5nbGUtZG91YmxlLWRvd24nKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5kYXNoYm9hcmQtdG9nZ2xlciBpJykudG9nZ2xlQ2xhc3MoJ2ZhLWFuZ2xlLWRvdWJsZS11cCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfY3JlYXRlTGF0ZXN0T3JkZXJzVGFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBHZXQgbGF0ZXN0IG9yZGVycyBhbmQgY3JlYXRlIGEgbmV3IERhdGFUYWJsZSBpbnN0YW5jZS5cbiAgICAgICAgICAgIGpzZS5saWJzLmRhdGF0YWJsZS5jcmVhdGUoJGxhc3RPcmRlcnNUYWJsZSwge1xuICAgICAgICAgICAgICAgIHByb2Nlc3Npbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgZG9tOiAndCcsXG4gICAgICAgICAgICAgICAgb3JkZXJpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFqYXg6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89RGFzaGJvYXJkL0dldExhdGVzdE9yZGVycycsXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IGpzZS5saWJzLmRhdGF0YWJsZS5nZXRUcmFuc2xhdGlvbnMoanNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykpLFxuICAgICAgICAgICAgICAgIG9yZGVyOiBbWzMsICdkZXNjJ11dLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgLy8gT3JkZXIgSURcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ29yZGVyc19pZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd0ZXh0LXJpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKGRhdGEsIHR5cGUsIHJvdywgbWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cIm9yZGVycy5waHA/cGFnZT0xJm9JRD0nICsgZGF0YSArICcmYWN0aW9uPWVkaXRcIj4nICsgZGF0YSArICc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3VzdG9tZXIncyBuYW1lXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICdjdXN0b21lcnNfbmFtZSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgLy8gT3JkZXIgdG90YWwgaW4gdGV4dCBmb3JtYXRcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAndGV4dC1yaWdodCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ2RhdGVfcHVyY2hhc2VkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKGRhdGEsIHR5cGUsIHJvdywgbWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkdCA9IERhdGUucGFyc2UoZGF0YSk7IC8vIHVzaW5nIGRhdGVqc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkdC50b1N0cmluZygnZGQuTU0ueXl5eSBISDptbScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAvLyBQYXltZW50IG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAncGF5bWVudF9tZXRob2QnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIC8vIE9yZGVyIFN0YXR1cyBuYW1lXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICdvcmRlcnNfc3RhdHVzX25hbWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiBmdW5jdGlvbiAoZGF0YSwgdHlwZSwgcm93LCBtZXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IF9nZXRCYWRnZUNsYXNzKHJvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJnQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3JkZXJTdGF0dXNEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJiYWRnZSAnICsgY2xhc3NOYW1lICsgJ1wiPicgKyBkYXRhICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcmRlclN0YXR1c0RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yZGVyU3RhdHVzRGF0YVtpXS5pZCA9PT0gTnVtYmVyKHJvdy5vcmRlcnNfc3RhdHVzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmdDb2xvciA9IG9yZGVyU3RhdHVzRGF0YVtpXS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvciA9IG9yZGVyU3RhdHVzRGF0YVtpXS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cob3JkZXJTdGF0dXNEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJiYWRnZVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogIycgKyBiZ0NvbG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJzsgYmFja2dyb3VuZC1pbWFnZTogbm9uZTsgY29sb3I6ICMnICsgY29sb3IgKyAnXCI+JyArIGRhdGEgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBkYXNoYm9hcmQgc3RhdGlzdGljcy5cbiAgICAgICAgICAgIF9pbml0U3RhdGlzdGljcygpO1xuICAgICAgICAgICAgX2luaXRTdGF0aXN0aWNDaGFydCgpO1xuICAgICAgICAgICAgX2luaXRUYWJTZWxlY3RvcigpO1xuICAgICAgICAgICAgX2luaXREYXNoYm9hcmRUb2dnbGVyKCk7XG5cbiAgICAgICAgICAgIC8vIGZldGNoIG9yZGVyIHN0YXR1cyBkYXRhIGJlZm9yZSBjcmVhdGluZyBsYXRlc3Qgb3JkZXJzIHRhYmxlXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vcmRlcnNfYWxsb3dlZCkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLnhoci5nZXQoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1PcmRlclN0YXR1c0FqYXgnXG4gICAgICAgICAgICAgICAgfSkuZG9uZShyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJTdGF0dXNEYXRhID0gcjtcbiAgICAgICAgICAgICAgICAgICAgX2NyZWF0ZUxhdGVzdE9yZGVyc1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgfSkuZmFpbChyID0+IF9jcmVhdGVMYXRlc3RPcmRlcnNUYWJsZSgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGxhc3RPcmRlcnNUYWJsZS5vbignaW5pdC5kdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyBCaW5kIHJvdyBjbGljayBldmVudCBvbmx5IGlmIHRoZXJlIGFyZSByb3dzIGluIHRoZSB0YWJsZS5cbiAgICAgICAgICAgICAgICBpZiAoJGxhc3RPcmRlcnNUYWJsZS5EYXRhVGFibGUoKS5kYXRhKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkbGFzdE9yZGVyc1RhYmxlLm9uKCdjbGljaycsICd0Ym9keSB0ciB0ZCcsIF9vblJvd0NsaWNrKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTaG93IHRoZSBjdXJzb3IgYXMgYSBwb2ludGVyIGZvciBlYWNoIHJvdy5cbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0cjpub3QoXCI6ZXEoMClcIiknKS5hZGRDbGFzcygnY3Vyc29yLXBvaW50ZXInKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
