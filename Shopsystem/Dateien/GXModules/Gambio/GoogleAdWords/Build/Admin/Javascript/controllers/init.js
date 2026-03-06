'use strict';

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
gxmodules.controllers.module('init', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', jse.source + '/vendor/momentjs/moment.min.js', gxmodules.source + '/libs/adwords_overview_columns', 'datatable', 'modal', 'xhr'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this).find('.campaigns-overview-table');

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {
        getTotalsUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/getTotals',
        getTotalsWithRangeUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/getTotalsForRange&range=',
        updateDailyBudgetUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/updateDailyBudget',
        updateStatusUrl: 'admin.php?do=AdWordsCampaignsOverviewAjax/updateStatus'
    };

    var dateRangePickerSelector = '.daterangepicker-helper';

    var dateRangeSelector = '#adwords-date-range';

    /**
     * Date range picker element
     *
     * @type {jQuery}
     */
    var $dateRangePicker = $this.find(dateRangePickerSelector);

    /**
     * Final Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

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
        var index = 1; // Order by name column by default.
        var direction = 'asc'; // Order ASC by default. 

        // Apply initial table sort. 
        if (parameters.sort) {
            direction = parameters.sort.charAt(0) === '-' ? 'desc' : 'asc';
            var columnName = parameters.sort.slice(1);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var column = _step.value;

                    if (column.name === columnName) {
                        index = columns.indexOf(column);
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else if (data.activeColumns.indexOf('name') > -1) {
            // Order by name if possible.
            index = data.activeColumns.indexOf('name') - 1;
        }

        return [[index, direction]];
    }

    /**
     * Load table data.
     */
    function _loadDataTable(value) {
        var columns = jse.libs.datatable.prepareColumns($this, jse.libs.adwords_overview_columns, data.activeColumns);
        var parameters = $.deparam(window.location.search.slice(1));
        var pageLength = 0;

        var query = undefined !== value ? '&dateRange=' + value : '';
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=AdWordsCampaignsOverviewAjax/DataTable' + query;

        if (undefined !== value) {
            $this.DataTable().ajax.url(url).load();
            _loadTotals(value);
        } else {
            jse.libs.datatable.create($this, {
                autoWidth: false,
                dom: 't',
                pageLength: pageLength,
                displayStart: parseInt(parameters.page) ? (parseInt(parameters.page) - 1) * pageLength : 0,
                serverSide: true,
                language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
                ajax: {
                    url: url,
                    type: 'POST',
                    data: {
                        pageToken: jse.core.config.get('pageToken')
                    }
                },
                orderCellsTop: true,
                order: _getOrder(parameters, columns),
                searchCols: [],
                columns: columns
            });
        }
    }

    /**
     * Load totals table data.
     */
    function _loadTotals(value) {
        var query = undefined !== value ? '&dateRange=' + value : '';

        $.ajax({
            type: "GET",
            dataType: "json",
            url: options.getTotalsUrl + '&pageToken=' + jse.core.config.get('pageToken') + query,
            success: function success(response) {
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
            error: function error() {
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
        var $dailyBudget = $(this).closest('tr').find('.daily-budget');
        var dailyBudgetValue = $dailyBudget.data('budget');

        // cancel editing for all rows
        $this.find('.btn-cancel').each(function () {
            _clickCancel.call(this);
        });

        $(this).hide();
        $(this).closest('tr').find('.btn-save').text(jse.core.lang.translate('save', 'buttons')).show();
        $(this).closest('tr').find('.btn-cancel').text(jse.core.lang.translate('cancel', 'buttons')).show();

        $dailyBudget.html('<input type="text" class="form-control daily-budget-input" value="' + dailyBudgetValue + '" />');

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
        var $dailyBudget = $(this).closest('tr').find('.daily-budget');
        var $dailyBudgetInput = $(this).closest('tr').find('.daily-budget-input');
        var campaignId = $(this).closest('tr').find('.daily-budget').data('id');
        var $saveButton = $(this);
        var $cancelButton = $(this).closest('tr').find('.btn-cancel');
        var $editIcon = $(this).closest('tr').find('.row-edit');

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
            success: function success(response) {
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
            error: function error() {
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
        var $dailyBudget = $(this).closest('tr').find('.daily-budget');
        var $cancelButton = $(this);
        var $saveButton = $(this).closest('tr').find('.btn-save');
        var $editIcon = $(this).closest('tr').find('.row-edit');

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
            success: function success(response) {
                return response['success'];
            },
            error: function error() {
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
        $this.on('change', dateRangePickerSelector, function (event) {
            $this.DataTable().search(event.target.value).draw();
            _loadTotals();
        });
        $(dateRangeSelector).on('change', function () {
            var value = $(this).val();
            _loadDataTable(value);
        });

        // Add table error handler.
        jse.libs.datatable.error($this, function (event, settings, techNote, message) {
            var title = 'DataTables ' + jse.core.lang.translate('error', 'messages');
            jse.libs.modal.showMessage(title, message);
        });

        // Add draw event handler. 
        $this.on('draw.dt', function () {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvaW5pdC5qcyJdLCJuYW1lcyI6WyJneG1vZHVsZXMiLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJmaW5kIiwiZGVmYXVsdHMiLCJnZXRUb3RhbHNVcmwiLCJnZXRUb3RhbHNXaXRoUmFuZ2VVcmwiLCJ1cGRhdGVEYWlseUJ1ZGdldFVybCIsInVwZGF0ZVN0YXR1c1VybCIsImRhdGVSYW5nZVBpY2tlclNlbGVjdG9yIiwiZGF0ZVJhbmdlU2VsZWN0b3IiLCIkZGF0ZVJhbmdlUGlja2VyIiwib3B0aW9ucyIsImV4dGVuZCIsIl9nZXRPcmRlciIsInBhcmFtZXRlcnMiLCJjb2x1bW5zIiwiaW5kZXgiLCJkaXJlY3Rpb24iLCJzb3J0IiwiY2hhckF0IiwiY29sdW1uTmFtZSIsInNsaWNlIiwiY29sdW1uIiwibmFtZSIsImluZGV4T2YiLCJhY3RpdmVDb2x1bW5zIiwiX2xvYWREYXRhVGFibGUiLCJ2YWx1ZSIsImxpYnMiLCJkYXRhdGFibGUiLCJwcmVwYXJlQ29sdW1ucyIsImFkd29yZHNfb3ZlcnZpZXdfY29sdW1ucyIsImRlcGFyYW0iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInBhZ2VMZW5ndGgiLCJxdWVyeSIsInVuZGVmaW5lZCIsInVybCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJEYXRhVGFibGUiLCJhamF4IiwibG9hZCIsIl9sb2FkVG90YWxzIiwiY3JlYXRlIiwiYXV0b1dpZHRoIiwiZG9tIiwiZGlzcGxheVN0YXJ0IiwicGFyc2VJbnQiLCJwYWdlIiwic2VydmVyU2lkZSIsImxhbmd1YWdlIiwiZ2V0VHJhbnNsYXRpb25zIiwidHlwZSIsInBhZ2VUb2tlbiIsIm9yZGVyQ2VsbHNUb3AiLCJvcmRlciIsInNlYXJjaENvbHMiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInJlbW92ZUNsYXNzIiwidGV4dCIsImVycm9yIiwiX2NsaWNrRWRpdCIsImV2ZW50IiwiJGRhaWx5QnVkZ2V0IiwiY2xvc2VzdCIsImRhaWx5QnVkZ2V0VmFsdWUiLCJlYWNoIiwiX2NsaWNrQ2FuY2VsIiwiY2FsbCIsImhpZGUiLCJsYW5nIiwidHJhbnNsYXRlIiwic2hvdyIsImh0bWwiLCJvbiIsImtleUNvZGUiLCJjbGljayIsIl9jbGlja1NhdmUiLCIkZGFpbHlCdWRnZXRJbnB1dCIsImNhbXBhaWduSWQiLCIkc2F2ZUJ1dHRvbiIsIiRjYW5jZWxCdXR0b24iLCIkZWRpdEljb24iLCJhZGRDbGFzcyIsImlkIiwiZGFpbHlCdWRnZXQiLCJ2YWwiLCJhdHRyIiwiX2NoYW5nZVN0YXR1cyIsInN0YXR1cyIsImlzIiwiaW5pdCIsImRvbmUiLCJ0YXJnZXQiLCJkcmF3Iiwic2V0dGluZ3MiLCJ0ZWNoTm90ZSIsIm1lc3NhZ2UiLCJ0aXRsZSIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJneCIsIndpZGdldHMiLCJzaG93QWNjb3VudEZvcm0iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsVUFBVUMsV0FBVixDQUFzQkMsTUFBdEIsQ0FDSSxNQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCxtREFFT0QsSUFBSUMsTUFGWCxrREFHT0QsSUFBSUMsTUFIWCxxQ0FJT0osVUFBVUksTUFKakIscUNBS0ksV0FMSixFQU1JLE9BTkosRUFPSSxLQVBKLENBSEosRUFhSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLEVBQVFDLElBQVIsQ0FBYSwyQkFBYixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFdBQVc7QUFDYkMsc0JBQWMscURBREQ7QUFFYkMsK0JBQXVCLG9FQUZWO0FBR2JDLDhCQUFzQiw2REFIVDtBQUliQyx5QkFBaUI7QUFKSixLQUFqQjs7QUFPQSxRQUFNQywwQkFBMEIseUJBQWhDOztBQUVBLFFBQU1DLG9CQUFvQixx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RixFQUFOLENBQVMsU0FBVCxFQUFvQixZQUFNO0FBQ3RCaEYsa0JBQU1FLElBQU4sQ0FBVyxPQUFYLEVBQW9CMkYsSUFBcEIsQ0FBeUIsZ0JBQXpCLEVBQTJDLFVBQTNDO0FBQ0FjLGVBQUdDLE9BQUgsQ0FBV1gsSUFBWCxDQUFnQmpHLEtBQWhCLEVBRnNCLENBRUU7O0FBRXhCLGdCQUFJLENBQUNXLFFBQVFrRyxlQUFiLEVBQThCO0FBQzFCN0csc0JBQU1FLElBQU4sQ0FBVyxXQUFYLEVBQXdCOEUsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0NiLFVBQXBDO0FBQ0FuRSxzQkFBTUUsSUFBTixDQUFXLFdBQVgsRUFBd0I4RSxFQUF4QixDQUEyQixPQUEzQixFQUFvQ0csVUFBcEM7QUFDQW5GLHNCQUFNRSxJQUFOLENBQVcsYUFBWCxFQUEwQjhFLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDUCxZQUF0QztBQUNIO0FBQ0osU0FURDs7QUFXQXlCO0FBQ0gsS0FqQ0Q7O0FBbUNBLFdBQU90RyxNQUFQO0FBQ0gsQ0FwVkwiLCJmaWxlIjoiQWRtaW4vSmF2YXNjcmlwdC9jb250cm9sbGVycy9pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbml0LmpzIDIwMTktMDctMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE5IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEludm9pY2VzIFRhYmxlIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgaW5pdGlhbGl6ZXMgdGhlIG1haW4gaW52b2ljZXMgdGFibGUgd2l0aCBhIG5ldyBqUXVlcnkgRGF0YVRhYmxlcyBpbnN0YW5jZS5cbiAqL1xuZ3htb2R1bGVzLmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnaW5pdCcsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanNgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvbW9tZW50anMvbW9tZW50Lm1pbi5qc2AsXG4gICAgICAgIGAke2d4bW9kdWxlcy5zb3VyY2V9L2xpYnMvYWR3b3Jkc19vdmVydmlld19jb2x1bW5zYCxcbiAgICAgICAgJ2RhdGF0YWJsZScsXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgICd4aHInXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpLmZpbmQoJy5jYW1wYWlnbnMtb3ZlcnZpZXctdGFibGUnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGdldFRvdGFsc1VybDogJ2FkbWluLnBocD9kbz1BZFdvcmRzQ2FtcGFpZ25zT3ZlcnZpZXdBamF4L2dldFRvdGFscycsXG4gICAgICAgICAgICBnZXRUb3RhbHNXaXRoUmFuZ2VVcmw6ICdhZG1pbi5waHA/ZG89QWRXb3Jkc0NhbXBhaWduc092ZXJ2aWV3QWpheC9nZXRUb3RhbHNGb3JSYW5nZSZyYW5nZT0nLFxuICAgICAgICAgICAgdXBkYXRlRGFpbHlCdWRnZXRVcmw6ICdhZG1pbi5waHA/ZG89QWRXb3Jkc0NhbXBhaWduc092ZXJ2aWV3QWpheC91cGRhdGVEYWlseUJ1ZGdldCcsXG4gICAgICAgICAgICB1cGRhdGVTdGF0dXNVcmw6ICdhZG1pbi5waHA/ZG89QWRXb3Jkc0NhbXBhaWduc092ZXJ2aWV3QWpheC91cGRhdGVTdGF0dXMnXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZGF0ZVJhbmdlUGlja2VyU2VsZWN0b3IgPSAnLmRhdGVyYW5nZXBpY2tlci1oZWxwZXInO1xuXG4gICAgICAgIGNvbnN0IGRhdGVSYW5nZVNlbGVjdG9yID0gJyNhZHdvcmRzLWRhdGUtcmFuZ2UnO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEYXRlIHJhbmdlIHBpY2tlciBlbGVtZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkZGF0ZVJhbmdlUGlja2VyID0gJHRoaXMuZmluZChkYXRlUmFuZ2VQaWNrZXJTZWxlY3Rvcik7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBJbml0aWFsIFRhYmxlIE9yZGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIENvbnRhaW5zIHRoZSBVUkwgcGFyYW1ldGVycy5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNvbHVtbnMgQ29udGFpbnMgdGhlIGNvbHVtbiBkZWZpbml0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7QXJyYXlbXX1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRPcmRlcihwYXJhbWV0ZXJzLCBjb2x1bW5zKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAxOyAvLyBPcmRlciBieSBuYW1lIGNvbHVtbiBieSBkZWZhdWx0LlxuICAgICAgICAgICAgbGV0IGRpcmVjdGlvbiA9ICdhc2MnOyAvLyBPcmRlciBBU0MgYnkgZGVmYXVsdC4gXG5cbiAgICAgICAgICAgIC8vIEFwcGx5IGluaXRpYWwgdGFibGUgc29ydC4gXG4gICAgICAgICAgICBpZiAocGFyYW1ldGVycy5zb3J0KSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gcGFyYW1ldGVycy5zb3J0LmNoYXJBdCgwKSA9PT0gJy0nID8gJ2Rlc2MnIDogJ2FzYyc7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uTmFtZSA9IHBhcmFtZXRlcnMuc29ydC5zbGljZSgxKTtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBvZiBjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4ubmFtZSA9PT0gY29sdW1uTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBjb2x1bW5zLmluZGV4T2YoY29sdW1uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLmFjdGl2ZUNvbHVtbnMuaW5kZXhPZignbmFtZScpID4gLTEpIHsgLy8gT3JkZXIgYnkgbmFtZSBpZiBwb3NzaWJsZS5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGRhdGEuYWN0aXZlQ29sdW1ucy5pbmRleE9mKCduYW1lJykgLSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1tpbmRleCwgZGlyZWN0aW9uXV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCB0YWJsZSBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2xvYWREYXRhVGFibGUodmFsdWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBqc2UubGlicy5kYXRhdGFibGUucHJlcGFyZUNvbHVtbnMoJHRoaXMsIGpzZS5saWJzLmFkd29yZHNfb3ZlcnZpZXdfY29sdW1ucyxcbiAgICAgICAgICAgICAgICBkYXRhLmFjdGl2ZUNvbHVtbnMpO1xuICAgICAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpKTtcbiAgICAgICAgICAgIGNvbnN0IHBhZ2VMZW5ndGggPSAwO1xuXG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB1bmRlZmluZWQgIT09IHZhbHVlID8gJyZkYXRlUmFuZ2U9JyArIHZhbHVlIDogJyc7XG4gICAgICAgICAgICBsZXQgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1BZFdvcmRzQ2FtcGFpZ25zT3ZlcnZpZXdBamF4L0RhdGFUYWJsZSdcbiAgICAgICAgICAgICAgICArIHF1ZXJ5O1xuXG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmFqYXgudXJsKHVybCkubG9hZCgpO1xuICAgICAgICAgICAgICAgIF9sb2FkVG90YWxzKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmNyZWF0ZSgkdGhpcywge1xuICAgICAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkb206ICd0JyxcbiAgICAgICAgICAgICAgICAgICAgcGFnZUxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheVN0YXJ0OiBwYXJzZUludChwYXJhbWV0ZXJzLnBhZ2UpID8gKHBhcnNlSW50KHBhcmFtZXRlcnMucGFnZSkgLSAxKSAqIHBhZ2VMZW5ndGggOiAwLFxuICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJTaWRlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZToganNlLmxpYnMuZGF0YXRhYmxlLmdldFRyYW5zbGF0aW9ucyhqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSksXG4gICAgICAgICAgICAgICAgICAgIGFqYXg6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyQ2VsbHNUb3A6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyOiBfZ2V0T3JkZXIocGFyYW1ldGVycywgY29sdW1ucyksXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaENvbHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9hZCB0b3RhbHMgdGFibGUgZGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9sb2FkVG90YWxzKHZhbHVlKSB7XG4gICAgICAgICAgICBsZXQgcXVlcnkgPSB1bmRlZmluZWQgIT09IHZhbHVlID8gJyZkYXRlUmFuZ2U9JyArIHZhbHVlIDogJyc7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBvcHRpb25zLmdldFRvdGFsc1VybCArICcmcGFnZVRva2VuPScgKyBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKSArIHF1ZXJ5LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcudG90YWwtcm93IC50b3RhbC1idWRnZXQnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVsnc3VjY2VzcyddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcudG90YWwtcm93IC50b3RhbC1idWRnZXQnKS50ZXh0KHJlc3BvbnNlWydkYXRhJ11bJ2RhaWx5QnVkZ2V0J10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnRvdGFsLXJvdyAudG90YWwtY2xpY2tzJykudGV4dChyZXNwb25zZVsnZGF0YSddWydjbGlja3MnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcudG90YWwtcm93IC50b3RhbC1pbXByZXNzaW9ucycpLnRleHQocmVzcG9uc2VbJ2RhdGEnXVsnaW1wcmVzc2lvbnMnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcudG90YWwtcm93IC50b3RhbC1jdHInKS50ZXh0KHJlc3BvbnNlWydkYXRhJ11bJ2NsaWNrVGhyb3VnaFJhdGUnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcudG90YWwtcm93IC50b3RhbC1hdmVyYWdlLWNwYycpLnRleHQocmVzcG9uc2VbJ2RhdGEnXVsnY29zdFBlckNsaWNrJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnRvdGFsLXJvdyAudG90YWwtY29zdHMnKS50ZXh0KHJlc3BvbnNlWydkYXRhJ11bJ2Nvc3RzJ10pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlWydzdWNjZXNzJ107XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcudG90YWwtcm93IC50b3RhbC1idWRnZXQnKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBjbGljayBldmVudCBvZiB0aGUgZWRpdCBpY29uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBNYWtlcyB0aGUgZGFpbHkgYnVkZ2V0IHZhbHVlIGVkaXRhYmxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jbGlja0VkaXQoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0ICRkYWlseUJ1ZGdldCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5maW5kKCcuZGFpbHktYnVkZ2V0Jyk7XG4gICAgICAgICAgICBjb25zdCBkYWlseUJ1ZGdldFZhbHVlID0gJGRhaWx5QnVkZ2V0LmRhdGEoJ2J1ZGdldCcpO1xuXG4gICAgICAgICAgICAvLyBjYW5jZWwgZWRpdGluZyBmb3IgYWxsIHJvd3NcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5idG4tY2FuY2VsJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX2NsaWNrQ2FuY2VsLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZmluZCgnLmJ0bi1zYXZlJykudGV4dChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2F2ZScsICdidXR0b25zJykpLnNob3coKTtcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgndHInKS5maW5kKCcuYnRuLWNhbmNlbCcpLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NhbmNlbCcsICdidXR0b25zJykpLnNob3coKTtcblxuICAgICAgICAgICAgJGRhaWx5QnVkZ2V0Lmh0bWwoJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGRhaWx5LWJ1ZGdldC1pbnB1dFwiIHZhbHVlPVwiJyArIGRhaWx5QnVkZ2V0VmFsdWVcbiAgICAgICAgICAgICAgICArICdcIiAvPicpO1xuXG4gICAgICAgICAgICAkZGFpbHlCdWRnZXQuZmluZCgnLmRhaWx5LWJ1ZGdldC1pbnB1dCcpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZmluZCgnLmJ0bi1zYXZlJykuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgZGFpbHkgYnVkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jbGlja1NhdmUoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0ICRkYWlseUJ1ZGdldCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5maW5kKCcuZGFpbHktYnVkZ2V0Jyk7XG4gICAgICAgICAgICBjb25zdCAkZGFpbHlCdWRnZXRJbnB1dCA9ICQodGhpcykuY2xvc2VzdCgndHInKS5maW5kKCcuZGFpbHktYnVkZ2V0LWlucHV0Jyk7XG4gICAgICAgICAgICBjb25zdCBjYW1wYWlnbklkID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmZpbmQoJy5kYWlseS1idWRnZXQnKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3QgJHNhdmVCdXR0b24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgY29uc3QgJGNhbmNlbEJ1dHRvbiA9ICQodGhpcykuY2xvc2VzdCgndHInKS5maW5kKCcuYnRuLWNhbmNlbCcpO1xuICAgICAgICAgICAgY29uc3QgJGVkaXRJY29uID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmZpbmQoJy5yb3ctZWRpdCcpO1xuXG4gICAgICAgICAgICAkZGFpbHlCdWRnZXQuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgX2NsaWNrQ2FuY2VsKCk7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHVybDogb3B0aW9ucy51cGRhdGVEYWlseUJ1ZGdldFVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiBjYW1wYWlnbklkLFxuICAgICAgICAgICAgICAgICAgICBkYWlseUJ1ZGdldDogJGRhaWx5QnVkZ2V0SW5wdXQudmFsKCksXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbJ3N1Y2Nlc3MnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRhaWx5QnVkZ2V0Lmh0bWwocmVzcG9uc2VbJ2RhdGEnXVsnZGFpbHlCdWRnZXRIdG1sJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRhaWx5QnVkZ2V0LmF0dHIoJ3RpdGxlJywgcmVzcG9uc2VbJ2RhdGEnXVsnZGFpbHlCdWRnZXRIdG1sJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRhaWx5QnVkZ2V0LmRhdGEoJ2J1ZGdldCcsIHJlc3BvbnNlWydkYXRhJ11bJ2RhaWx5QnVkZ2V0J10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGRhaWx5QnVkZ2V0LmRhdGEoJ2J1ZGdldC1odG1sJywgcmVzcG9uc2VbJ2RhdGEnXVsnZGFpbHlCdWRnZXRIdG1sJ10pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2F2ZUJ1dHRvbi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkY2FuY2VsQnV0dG9uLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlZGl0SWNvbi5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRkYWlseUJ1ZGdldC5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnRvdGFsLXJvdyAudG90YWwtYnVkZ2V0JykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgX2xvYWRUb3RhbHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZVsnc3VjY2VzcyddO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRhaWx5QnVkZ2V0LnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbCBlZGl0IG1vZGUgZm9yIGRhaWx5IGJ1ZGdldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jbGlja0NhbmNlbChldmVudCkge1xuICAgICAgICAgICAgY29uc3QgJGRhaWx5QnVkZ2V0ID0gJCh0aGlzKS5jbG9zZXN0KCd0cicpLmZpbmQoJy5kYWlseS1idWRnZXQnKTtcbiAgICAgICAgICAgIGNvbnN0ICRjYW5jZWxCdXR0b24gPSAkKHRoaXMpO1xuICAgICAgICAgICAgY29uc3QgJHNhdmVCdXR0b24gPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZmluZCgnLmJ0bi1zYXZlJyk7XG4gICAgICAgICAgICBjb25zdCAkZWRpdEljb24gPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykuZmluZCgnLnJvdy1lZGl0Jyk7XG5cbiAgICAgICAgICAgICRkYWlseUJ1ZGdldC5odG1sKCRkYWlseUJ1ZGdldC5kYXRhKCdidWRnZXQtaHRtbCcpKTtcblxuICAgICAgICAgICAgJHNhdmVCdXR0b24uaGlkZSgpO1xuICAgICAgICAgICAgJGNhbmNlbEJ1dHRvbi5oaWRlKCk7XG4gICAgICAgICAgICAkZWRpdEljb24uc2hvdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYW5nZSBjYW1wYWlnbiBzdGF0dXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NoYW5nZVN0YXR1cyhldmVudCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBvcHRpb25zLnVwZGF0ZVN0YXR1c1VybCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGlkOiAkKHRoaXMpLmRhdGEoJ2lkJyksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogKyQodGhpcykuaXMoJzpjaGVja2VkJyksIC8vIGNhc3QgdG8gaW50XG4gICAgICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VbJ3N1Y2Nlc3MnXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBfbG9hZERhdGFUYWJsZSgpO1xuICAgICAgICAgICAgX2xvYWRUb3RhbHMoKTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2NoYW5nZScsICcuY2FtcGFpZ24tc3RhdHVzLWNoZWNrYm94JywgX2NoYW5nZVN0YXR1cyk7XG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgZGF0ZVJhbmdlUGlja2VyU2VsZWN0b3IsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLnNlYXJjaChldmVudC50YXJnZXQudmFsdWUpLmRyYXcoKTtcbiAgICAgICAgICAgICAgICBfbG9hZFRvdGFscygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGRhdGVSYW5nZVNlbGVjdG9yKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgX2xvYWREYXRhVGFibGUodmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0YWJsZSBlcnJvciBoYW5kbGVyLlxuICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmVycm9yKCR0aGlzLCBmdW5jdGlvbiAoZXZlbnQsIHNldHRpbmdzLCB0ZWNoTm90ZSwgbWVzc2FnZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gJ0RhdGFUYWJsZXMgJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpO1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgZHJhdyBldmVudCBoYW5kbGVyLiBcbiAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5JykuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc3dpdGNoZXInKTtcbiAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJHRoaXMpOyAvLyBJbml0aWFsaXplIHRoZSBzd2l0Y2hlciB3aWRnZXQuXG5cbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuc2hvd0FjY291bnRGb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5yb3ctZWRpdCcpLm9uKCdjbGljaycsIF9jbGlja0VkaXQpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuYnRuLXNhdmUnKS5vbignY2xpY2snLCBfY2xpY2tTYXZlKTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ0bi1jYW5jZWwnKS5vbignY2xpY2snLCBfY2xpY2tDYW5jZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
