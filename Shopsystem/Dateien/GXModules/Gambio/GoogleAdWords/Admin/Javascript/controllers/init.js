/* --------------------------------------------------------------
 init.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Invoices Table Controller
 *
 * This controller initializes the main invoices table with a new jQuery DataTables instance.
 */
gxmodules.controllers.module(
    'init',

    [
        `${jse.source}/vendor/datatables/jquery.dataTables.min.css`,
        `${jse.source}/vendor/datatables/jquery.dataTables.min.js`,
        `${jse.source}/vendor/momentjs/moment.min.js`,
        `${gxmodules.source}/libs/adwords_overview_columns`,
        'datatable',
        'modal',
        'xhr'
    ],

    function (data) {

        'use strict';

        // ------------------------------------------------------------------------
        // VARIABLES
        // ------------------------------------------------------------------------

        /**
         * Module Selector
         *
         * @type {jQuery}
         */
        const $this = $(this).find('.campaigns-overview-table');

        /**
         * Default Options
         *
         * @type {object}
         */
        const defaults = {
            getTotalsUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/getTotals',
            getTotalsWithRangeUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/getTotalsForRange&range=',
            updateDailyBudgetUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/updateDailyBudget',
            updateStatusUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/updateStatus'
        };

        const dateRangePickerSelector = '.daterangepicker-helper';

        const dateRangeSelector = '#adwords-date-range';

        /**
         * Date range picker element
         *
         * @type {jQuery}
         */
        const $dateRangePicker = $this.find(dateRangePickerSelector);

        /**
         * Final Options
         *
         * @type {object}
         */
        const options = $.extend(true, {}, defaults, data);

        /**
         * Module Instance
         *
         * @type {Object}
         */
        const module = {};

        // ------------------------------------------------------------------------
        // FUNCTIONS
        // ------------------------------------------------------------------------

        /**
         * Get Initial Table Order
         *
         * @param {Object} parameters Contains the URL parameters.
         * @param {Object} columns Contains the column definitions.
         *
         * @return {Array[]}
         */
        function _getOrder(parameters, columns) {
            let index = 1; // Order by name column by default.
            let direction = 'asc'; // Order ASC by default. 

            // Apply initial table sort. 
            if (parameters.sort) {
                direction = parameters.sort.charAt(0) === '-' ? 'desc' : 'asc';
                const columnName = parameters.sort.slice(1);

                for (let column of columns) {
                    if (column.name === columnName) {
                        index = columns.indexOf(column);
                        break;
                    }
                }
            } else if (data.activeColumns.indexOf('name') > -1) { // Order by name if possible.
                index = data.activeColumns.indexOf('name') - 1;
            }

            return [[index, direction]];
        }

        /**
         * Load table data.
         */
        function _loadDataTable(value) {
            const columns = jse.libs.datatable.prepareColumns($this, jse.libs.adwords_overview_columns,
                data.activeColumns);
            const parameters = $.deparam(window.location.search.slice(1));
            const pageLength = 0;

            let query = undefined !== value ? '&dateRange=' + value : '';
            let url = jse.core.config.get('appUrl') + '/admin/admin.php?do=AdWordsCampaignsOverviewAjax/DataTable'
                + query;

            if (undefined !== value) {
                $this.DataTable().ajax.url(url).load();
                _loadTotals(value);
            } else {
                jse.libs.datatable.create($this, {
                    autoWidth: false,
                    dom: 't',
                    pageLength,
                    displayStart: parseInt(parameters.page) ? (parseInt(parameters.page) - 1) * pageLength : 0,
                    serverSide: true,
                    language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
                    ajax: {
                        url,
                        type: 'POST',
                        data: {
                            pageToken: jse.core.config.get('pageToken')
                        }
                    },
                    orderCellsTop: true,
                    order: _getOrder(parameters, columns),
                    searchCols: [],
                    columns
                });
            }
        }

        /**
         * Load totals table data.
         */
        function _loadTotals(value) {
            let query = undefined !== value ? '&dateRange=' + value : '';

            $.ajax({
                type: "GET",
                dataType: "json",
                url: options.getTotalsUrl + '&pageToken=' + jse.core.config.get('pageToken') + query,
                success: function (response) {
                    $this.find('.total-row .total-budget').removeClass('loading');

                    if (response['success'] === true) {
                        $this.find('.total-row .total-budget').text(response['data']['dailyBudget']);
                        $this.find('.total-row .total-clicks').text(response['data']['clicks']);
                        $this.find('.total-row .total-impressions').text(response['data']['impressions']);
                        $this.find('.total-row .total-ctr').text(response['data']['clickThroughRate']);
                        $this.find('.total-row .total-average-cpc').text(response['data']['costPerClick']);
                        $this.find('.total-row .total-costs').text(response['data']['costs']);
                    }

                    return response['success'];
                },
                error: function () {
                    $this.find('.total-row .total-budget').removeClass('loading');

                    return false;
                }
            });
        }


        // ------------------------------------------------------------------------
        // EVENT HANDLERS
        // ------------------------------------------------------------------------

        /**
         * Handles the click event of the edit icon.
         *
         * Makes the daily budget value editable.
         *
         * @param event
         */
        function _clickEdit(event) {
            const $dailyBudget = $(this).closest('tr').find('.daily-budget');
            const dailyBudgetValue = $dailyBudget.data('budget');

            // cancel editing for all rows
            $this.find('.btn-cancel').each(function () {
                _clickCancel.call(this);
            });

            $(this).hide();
            $(this).closest('tr').find('.btn-save').text(jse.core.lang.translate('save', 'buttons')).show();
            $(this).closest('tr').find('.btn-cancel').text(jse.core.lang.translate('cancel', 'buttons')).show();

            $dailyBudget.html('<input type="text" class="form-control daily-budget-input" value="' + dailyBudgetValue
                + '" />');

            $dailyBudget.find('.daily-budget-input').on('keyup', function (event) {
                if (event.keyCode === 13) {
                    $(this).closest('tr').find('.btn-save').click();
                }
            });
        }

        /**
         * Update daily budget.
         *
         * @param event
         */
        function _clickSave(event) {
            const $dailyBudget = $(this).closest('tr').find('.daily-budget');
            const $dailyBudgetInput = $(this).closest('tr').find('.daily-budget-input');
            const campaignId = $(this).closest('tr').find('.daily-budget').data('id');
            const $saveButton = $(this);
            const $cancelButton = $(this).closest('tr').find('.btn-cancel');
            const $editIcon = $(this).closest('tr').find('.row-edit');

            $dailyBudget.addClass('loading');

            _clickCancel();

            $.ajax({
                type: "POST",
                dataType: "json",
                url: options.updateDailyBudgetUrl,
                data: {
                    id: campaignId,
                    dailyBudget: $dailyBudgetInput.val(),
                    pageToken: jse.core.config.get('pageToken')
                },
                success: function (response) {
                    if (response['success'] === true) {
                        $dailyBudget.html(response['data']['dailyBudgetHtml']);
                        $dailyBudget.attr('title', response['data']['dailyBudgetHtml']);
                        $dailyBudget.data('budget', response['data']['dailyBudget']);
                        $dailyBudget.data('budget-html', response['data']['dailyBudgetHtml']);

                        $saveButton.hide();
                        $cancelButton.hide();
                        $editIcon.show();

                        $dailyBudget.removeClass('loading');
                        $this.find('.total-row .total-budget').addClass('loading');

                        _loadTotals();
                    }

                    return response['success'];
                },
                error: function () {
                    $dailyBudget.removeClass('loading');

                    return false;
                }
            });
        }

        /**
         * Cancel edit mode for daily budget
         *
         * @param event
         */
        function _clickCancel(event) {
            const $dailyBudget = $(this).closest('tr').find('.daily-budget');
            const $cancelButton = $(this);
            const $saveButton = $(this).closest('tr').find('.btn-save');
            const $editIcon = $(this).closest('tr').find('.row-edit');

            $dailyBudget.html($dailyBudget.data('budget-html'));

            $saveButton.hide();
            $cancelButton.hide();
            $editIcon.show();
        }

        /**
         * Change campaign status.
         *
         * @param event
         */
        function _changeStatus(event) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: options.updateStatusUrl,
                data: {
                    id: $(this).data('id'),
                    status: +$(this).is(':checked'), // cast to int
                    pageToken: jse.core.config.get('pageToken')
                },
                success: function (response) {
                    return response['success'];
                },
                error: function () {
                    return false;
                }
            });
        }

        // ------------------------------------------------------------------------
        // INITIALIZATION
        // ------------------------------------------------------------------------

        module.init = function (done) {
            _loadDataTable();
            _loadTotals();

            $this.on('change', '.campaign-status-checkbox', _changeStatus);
            $this.on('change', dateRangePickerSelector, (event) => {
                $this.DataTable().search(event.target.value).draw();
                _loadTotals();
            });
            $(dateRangeSelector).on('change', function () {
                let value = $(this).val();
                _loadDataTable(value);
            });

            // Add table error handler.
            jse.libs.datatable.error($this, function (event, settings, techNote, message) {
                const title = 'DataTables ' + jse.core.lang.translate('error', 'messages');
                jse.libs.modal.showMessage(title, message);
            });

            // Add draw event handler. 
            $this.on('draw.dt', () => {
                $this.find('tbody').attr('data-gx-widget', 'switcher');
                gx.widgets.init($this); // Initialize the switcher widget.

                if (!options.showAccountForm) {
                    $this.find('.row-edit').on('click', _clickEdit);
                    $this.find('.btn-save').on('click', _clickSave);
                    $this.find('.btn-cancel').on('click', _clickCancel);
                }
            });

            done();
        };

        return module;
    });
