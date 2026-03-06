'use strict';

/* --------------------------------------------------------------
 init.js 2016-10-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Invoices Table Controller
 *
 * This controller initializes the main invoices table with a new jQuery DataTables instance.
 */
gx.controllers.module('init', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', jse.source + '/vendor/momentjs/moment.min.js', gx.source + '/libs/invoices_overview_columns', gx.source + '/libs/search', 'datatable', 'modal', 'user_configuration_service'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

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
        var index = 1; // Order by first column by default.
        var direction = 'desc'; // Order DESC by default.

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
        } else if (data.activeColumns.indexOf('invoiceDate') > -1) {
            // Order by date if possible.
            index = data.activeColumns.indexOf('invoiceDate');
        }

        return [[index, direction]];
    }

    /**
     * Get Initial Search Cols
     *
     * @param {Object} parameters Contains the URL parameters.
     *
     * @returns {Object[]} Returns the initial filtering values.
     */
    function _getSearchCols(parameters, columns) {
        if (!parameters.filter) {
            return [];
        }

        var searchCols = [];

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var column = _step2.value;

                var entry = null;
                var value = parameters.filter[column.name];

                if (value) {
                    entry = { search: decodeURIComponent(value) };
                }

                searchCols.push(entry);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return searchCols;
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        var columns = jse.libs.datatable.prepareColumns($this, jse.libs.invoices_overview_columns, data.activeColumns);
        var parameters = $.deparam(window.location.search.slice(1));
        var pageLength = parseInt(parameters.length || data.pageLength);

        jse.libs.datatable.create($this, {
            autoWidth: false,
            dom: 't',
            pageLength: pageLength,
            displayStart: parseInt(parameters.page) ? (parseInt(parameters.page) - 1) * pageLength : 0,
            serverSide: true,
            language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
            ajax: {
                url: jse.core.config.get('appUrl') + '/admin/admin.php?do=InvoicesOverviewAjax/DataTable',
                type: 'POST',
                data: {
                    pageToken: jse.core.config.get('pageToken')
                }
            },
            orderCellsTop: true,
            order: _getOrder(parameters, columns),
            searchCols: _getSearchCols(parameters, columns),
            columns: columns
        });

        // Add table error handler.
        jse.libs.datatable.error($this, function (event, settings, techNote, message) {
            var title = 'DataTables ' + jse.core.lang.translate('error', 'messages');
            jse.libs.modal.showMessage(title, message);
        });

        // Add pagination change handler.
        $this.on('datatable_custom_pagination:length_change', function (event, newPageLength) {
            jse.libs.user_configuration_service.set({
                data: {
                    userId: jse.core.registry.get('userId'),
                    configurationKey: 'invoicesOverviewPageLength',
                    configurationValue: newPageLength
                }
            });
        });

        // Add draw event handler.
        $this.on('draw.dt', function () {
            $this.find('thead input:checkbox').prop('checked', false).trigger('change', [false]); // No need to update the tbody checkboxes (event.js).
            $this.find('tbody').attr('data-gx-widget', 'single_checkbox');
            gx.widgets.init($this); // Initialize the checkbox widget.
        });

        // Set admin search value.
        if (Object.keys(parameters).includes('filter') && Object.keys(parameters.filter).includes('invoiceNumber')) {
            jse.libs.search.setValue(parameters.filter.invoiceNumber, true);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL292ZXJ2aWV3L2luaXQuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJfZ2V0T3JkZXIiLCJwYXJhbWV0ZXJzIiwiY29sdW1ucyIsImluZGV4IiwiZGlyZWN0aW9uIiwic29ydCIsImNoYXJBdCIsImNvbHVtbk5hbWUiLCJzbGljZSIsImNvbHVtbiIsIm5hbWUiLCJpbmRleE9mIiwiYWN0aXZlQ29sdW1ucyIsIl9nZXRTZWFyY2hDb2xzIiwiZmlsdGVyIiwic2VhcmNoQ29scyIsImVudHJ5IiwidmFsdWUiLCJzZWFyY2giLCJkZWNvZGVVUklDb21wb25lbnQiLCJwdXNoIiwiaW5pdCIsImRvbmUiLCJsaWJzIiwiZGF0YXRhYmxlIiwicHJlcGFyZUNvbHVtbnMiLCJpbnZvaWNlc19vdmVydmlld19jb2x1bW5zIiwiZGVwYXJhbSIsIndpbmRvdyIsImxvY2F0aW9uIiwicGFnZUxlbmd0aCIsInBhcnNlSW50IiwibGVuZ3RoIiwiY3JlYXRlIiwiYXV0b1dpZHRoIiwiZG9tIiwiZGlzcGxheVN0YXJ0IiwicGFnZSIsInNlcnZlclNpZGUiLCJsYW5ndWFnZSIsImdldFRyYW5zbGF0aW9ucyIsImNvcmUiLCJjb25maWciLCJnZXQiLCJhamF4IiwidXJsIiwidHlwZSIsInBhZ2VUb2tlbiIsIm9yZGVyQ2VsbHNUb3AiLCJvcmRlciIsImVycm9yIiwiZXZlbnQiLCJzZXR0aW5ncyIsInRlY2hOb3RlIiwibWVzc2FnZSIsInRpdGxlIiwibGFuZyIsInRyYW5zbGF0ZSIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJvbiIsIm5ld1BhZ2VMZW5ndGgiLCJ1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSIsInNldCIsInVzZXJJZCIsInJlZ2lzdHJ5IiwiY29uZmlndXJhdGlvbktleSIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsImZpbmQiLCJwcm9wIiwidHJpZ2dlciIsImF0dHIiLCJ3aWRnZXRzIiwiT2JqZWN0Iiwia2V5cyIsImluY2x1ZGVzIiwic2V0VmFsdWUiLCJpbnZvaWNlTnVtYmVyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLE1BREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLG1EQUVPRCxJQUFJQyxNQUZYLGtEQUdPRCxJQUFJQyxNQUhYLHFDQUlPSixHQUFHSSxNQUpWLHNDQUtPSixHQUFHSSxNQUxWLG1CQU1JLFdBTkosRUFPSSxPQVBKLEVBUUksNEJBUkosQ0FISixFQWNJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNTCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQVFBLGFBQVNNLFNBQVQsQ0FBbUJDLFVBQW5CLEVBQStCQyxPQUEvQixFQUF3QztBQUNwQyxZQUFJQyxRQUFRLENBQVosQ0FEb0MsQ0FDckI7QUFDZixZQUFJQyxZQUFZLE1BQWhCLENBRm9DLENBRVo7O0FBRXhCO0FBQ0EsWUFBSUgsV0FBV0ksSUFBZixFQUFxQjtBQUNqQkQsd0JBQVlILFdBQVdJLElBQVgsQ0FBZ0JDLE1BQWhCLENBQXVCLENBQXZCLE1BQThCLEdBQTlCLEdBQW9DLE1BQXBDLEdBQTZDLEtBQXpEO0FBQ0EsZ0JBQU1DLGFBQWFOLFdBQVdJLElBQVgsQ0FBZ0JHLEtBQWhCLENBQXNCLENBQXRCLENBQW5COztBQUZpQjtBQUFBO0FBQUE7O0FBQUE7QUFJakIscUNBQW1CTixPQUFuQiw4SEFBNEI7QUFBQSx3QkFBbkJPLE1BQW1COztBQUN4Qix3QkFBSUEsT0FBT0MsSUFBUCxLQUFnQkgsVUFBcEIsRUFBZ0M7QUFDNUJKLGdDQUFRRCxRQUFRUyxPQUFSLENBQWdCRixNQUFoQixDQUFSO0FBQ0E7QUFDSDtBQUNKO0FBVGdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVcEIsU0FWRCxNQVVPLElBQUlaLEtBQUtlLGFBQUwsQ0FBbUJELE9BQW5CLENBQTJCLGFBQTNCLElBQTRDLENBQUMsQ0FBakQsRUFBb0Q7QUFBRTtBQUN6RFIsb0JBQVFOLEtBQUtlLGFBQUwsQ0FBbUJELE9BQW5CLENBQTJCLGFBQTNCLENBQVI7QUFDSDs7QUFFRCxlQUFPLENBQUMsQ0FBQ1IsS0FBRCxFQUFRQyxTQUFSLENBQUQsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7O0FBT0EsYUFBU1MsY0FBVCxDQUF3QlosVUFBeEIsRUFBb0NDLE9BQXBDLEVBQTZDO0FBQ3pDLFlBQUksQ0FBQ0QsV0FBV2EsTUFBaEIsRUFBd0I7QUFDcEIsbUJBQU8sRUFBUDtBQUNIOztBQUVELFlBQU1DLGFBQWEsRUFBbkI7O0FBTHlDO0FBQUE7QUFBQTs7QUFBQTtBQU96QyxrQ0FBbUJiLE9BQW5CLG1JQUE0QjtBQUFBLG9CQUFuQk8sTUFBbUI7O0FBQ3hCLG9CQUFJTyxRQUFRLElBQVo7QUFDQSxvQkFBSUMsUUFBUWhCLFdBQVdhLE1BQVgsQ0FBa0JMLE9BQU9DLElBQXpCLENBQVo7O0FBRUEsb0JBQUlPLEtBQUosRUFBVztBQUNQRCw0QkFBUSxFQUFDRSxRQUFRQyxtQkFBbUJGLEtBQW5CLENBQVQsRUFBUjtBQUNIOztBQUVERiwyQkFBV0ssSUFBWCxDQUFnQkosS0FBaEI7QUFDSDtBQWhCd0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFrQnpDLGVBQU9ELFVBQVA7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFyQixXQUFPMkIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUIsWUFBTXBCLFVBQVVQLElBQUk0QixJQUFKLENBQVNDLFNBQVQsQ0FBbUJDLGNBQW5CLENBQWtDM0IsS0FBbEMsRUFBeUNILElBQUk0QixJQUFKLENBQVNHLHlCQUFsRCxFQUNaN0IsS0FBS2UsYUFETyxDQUFoQjtBQUVBLFlBQU1YLGFBQWFGLEVBQUU0QixPQUFGLENBQVVDLE9BQU9DLFFBQVAsQ0FBZ0JYLE1BQWhCLENBQXVCVixLQUF2QixDQUE2QixDQUE3QixDQUFWLENBQW5CO0FBQ0EsWUFBTXNCLGFBQWFDLFNBQVM5QixXQUFXK0IsTUFBWCxJQUFxQm5DLEtBQUtpQyxVQUFuQyxDQUFuQjs7QUFFQW5DLFlBQUk0QixJQUFKLENBQVNDLFNBQVQsQ0FBbUJTLE1BQW5CLENBQTBCbkMsS0FBMUIsRUFBaUM7QUFDN0JvQyx1QkFBVyxLQURrQjtBQUU3QkMsaUJBQUssR0FGd0I7QUFHN0JMLGtDQUg2QjtBQUk3Qk0sMEJBQWNMLFNBQVM5QixXQUFXb0MsSUFBcEIsSUFBNEIsQ0FBQ04sU0FBUzlCLFdBQVdvQyxJQUFwQixJQUE0QixDQUE3QixJQUFrQ1AsVUFBOUQsR0FBMkUsQ0FKNUQ7QUFLN0JRLHdCQUFZLElBTGlCO0FBTTdCQyxzQkFBVTVDLElBQUk0QixJQUFKLENBQVNDLFNBQVQsQ0FBbUJnQixlQUFuQixDQUFtQzdDLElBQUk4QyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLGNBQXBCLENBQW5DLENBTm1CO0FBTzdCQyxrQkFBTTtBQUNGQyxxQkFBS2xELElBQUk4QyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLG9EQURuQztBQUVGRyxzQkFBTSxNQUZKO0FBR0ZqRCxzQkFBTTtBQUNGa0QsK0JBQVdwRCxJQUFJOEMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQjtBQURUO0FBSEosYUFQdUI7QUFjN0JLLDJCQUFlLElBZGM7QUFlN0JDLG1CQUFPakQsVUFBVUMsVUFBVixFQUFzQkMsT0FBdEIsQ0Fmc0I7QUFnQjdCYSx3QkFBWUYsZUFBZVosVUFBZixFQUEyQkMsT0FBM0IsQ0FoQmlCO0FBaUI3QkE7QUFqQjZCLFNBQWpDOztBQW9CQTtBQUNBUCxZQUFJNEIsSUFBSixDQUFTQyxTQUFULENBQW1CMEIsS0FBbkIsQ0FBeUJwRCxLQUF6QixFQUFnQyxVQUFVcUQsS0FBVixFQUFpQkMsUUFBakIsRUFBMkJDLFFBQTNCLEVBQXFDQyxPQUFyQyxFQUE4QztBQUMxRSxnQkFBTUMsUUFBUSxnQkFBZ0I1RCxJQUFJOEMsSUFBSixDQUFTZSxJQUFULENBQWNDLFNBQWQsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBakMsQ0FBOUI7QUFDQTlELGdCQUFJNEIsSUFBSixDQUFTbUMsS0FBVCxDQUFlQyxXQUFmLENBQTJCSixLQUEzQixFQUFrQ0QsT0FBbEM7QUFDSCxTQUhEOztBQUtBO0FBQ0F4RCxjQUFNOEQsRUFBTixDQUFTLDJDQUFULEVBQXNELFVBQVVULEtBQVYsRUFBaUJVLGFBQWpCLEVBQWdDO0FBQ2xGbEUsZ0JBQUk0QixJQUFKLENBQVN1QywwQkFBVCxDQUFvQ0MsR0FBcEMsQ0FBd0M7QUFDcENsRSxzQkFBTTtBQUNGbUUsNEJBQVFyRSxJQUFJOEMsSUFBSixDQUFTd0IsUUFBVCxDQUFrQnRCLEdBQWxCLENBQXNCLFFBQXRCLENBRE47QUFFRnVCLHNDQUFrQiw0QkFGaEI7QUFHRkMsd0NBQW9CTjtBQUhsQjtBQUQ4QixhQUF4QztBQU9ILFNBUkQ7O0FBVUE7QUFDQS9ELGNBQU04RCxFQUFOLENBQVMsU0FBVCxFQUFvQixZQUFNO0FBQ3RCOUQsa0JBQU1zRSxJQUFOLENBQVcsc0JBQVgsRUFDS0MsSUFETCxDQUNVLFNBRFYsRUFDcUIsS0FEckIsRUFFS0MsT0FGTCxDQUVhLFFBRmIsRUFFdUIsQ0FBQyxLQUFELENBRnZCLEVBRHNCLENBR1c7QUFDakN4RSxrQkFBTXNFLElBQU4sQ0FBVyxPQUFYLEVBQW9CRyxJQUFwQixDQUF5QixnQkFBekIsRUFBMkMsaUJBQTNDO0FBQ0EvRSxlQUFHZ0YsT0FBSCxDQUFXbkQsSUFBWCxDQUFnQnZCLEtBQWhCLEVBTHNCLENBS0U7QUFDM0IsU0FORDs7QUFRQTtBQUNBLFlBQUkyRSxPQUFPQyxJQUFQLENBQVl6RSxVQUFaLEVBQXdCMEUsUUFBeEIsQ0FBaUMsUUFBakMsS0FBOENGLE9BQU9DLElBQVAsQ0FBWXpFLFdBQVdhLE1BQXZCLEVBQStCNkQsUUFBL0IsQ0FBd0MsZUFBeEMsQ0FBbEQsRUFBNEc7QUFDeEdoRixnQkFBSTRCLElBQUosQ0FBU0wsTUFBVCxDQUFnQjBELFFBQWhCLENBQXlCM0UsV0FBV2EsTUFBWCxDQUFrQitELGFBQTNDLEVBQTBELElBQTFEO0FBQ0g7O0FBRUR2RDtBQUNILEtBMUREOztBQTREQSxXQUFPNUIsTUFBUDtBQUNILENBbktMIiwiZmlsZSI6Imludm9pY2VzL292ZXJ2aWV3L2luaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGluaXQuanMgMjAxNi0xMC0xMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogSW52b2ljZXMgVGFibGUgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBpbml0aWFsaXplcyB0aGUgbWFpbiBpbnZvaWNlcyB0YWJsZSB3aXRoIGEgbmV3IGpRdWVyeSBEYXRhVGFibGVzIGluc3RhbmNlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2luaXQnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2RhdGF0YWJsZXMvanF1ZXJ5LmRhdGFUYWJsZXMubWluLmpzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL21vbWVudGpzL21vbWVudC5taW4uanNgLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvaW52b2ljZXNfb3ZlcnZpZXdfY29sdW1uc2AsXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9zZWFyY2hgLFxuICAgICAgICAnZGF0YXRhYmxlJyxcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgSW5pdGlhbCBUYWJsZSBPcmRlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1ldGVycyBDb250YWlucyB0aGUgVVJMIHBhcmFtZXRlcnMuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb2x1bW5zIENvbnRhaW5zIHRoZSBjb2x1bW4gZGVmaW5pdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5W119XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0T3JkZXIocGFyYW1ldGVycywgY29sdW1ucykge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMTsgLy8gT3JkZXIgYnkgZmlyc3QgY29sdW1uIGJ5IGRlZmF1bHQuXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gJ2Rlc2MnOyAvLyBPcmRlciBERVNDIGJ5IGRlZmF1bHQuXG5cbiAgICAgICAgICAgIC8vIEFwcGx5IGluaXRpYWwgdGFibGUgc29ydC5cbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXJzLnNvcnQpIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSBwYXJhbWV0ZXJzLnNvcnQuY2hhckF0KDApID09PSAnLScgPyAnZGVzYycgOiAnYXNjJztcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gcGFyYW1ldGVycy5zb3J0LnNsaWNlKDEpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbi5uYW1lID09PSBjb2x1bW5OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGNvbHVtbnMuaW5kZXhPZihjb2x1bW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuYWN0aXZlQ29sdW1ucy5pbmRleE9mKCdpbnZvaWNlRGF0ZScpID4gLTEpIHsgLy8gT3JkZXIgYnkgZGF0ZSBpZiBwb3NzaWJsZS5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGRhdGEuYWN0aXZlQ29sdW1ucy5pbmRleE9mKCdpbnZvaWNlRGF0ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1tpbmRleCwgZGlyZWN0aW9uXV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IEluaXRpYWwgU2VhcmNoIENvbHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQ29udGFpbnMgdGhlIFVSTCBwYXJhbWV0ZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0W119IFJldHVybnMgdGhlIGluaXRpYWwgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTZWFyY2hDb2xzKHBhcmFtZXRlcnMsIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGlmICghcGFyYW1ldGVycy5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaENvbHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBhcmFtZXRlcnMuZmlsdGVyW2NvbHVtbi5uYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeSA9IHtzZWFyY2g6IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlYXJjaENvbHMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hDb2xzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBqc2UubGlicy5kYXRhdGFibGUucHJlcGFyZUNvbHVtbnMoJHRoaXMsIGpzZS5saWJzLmludm9pY2VzX292ZXJ2aWV3X2NvbHVtbnMsXG4gICAgICAgICAgICAgICAgZGF0YS5hY3RpdmVDb2x1bW5zKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XG4gICAgICAgICAgICBjb25zdCBwYWdlTGVuZ3RoID0gcGFyc2VJbnQocGFyYW1ldGVycy5sZW5ndGggfHwgZGF0YS5wYWdlTGVuZ3RoKTtcblxuICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmNyZWF0ZSgkdGhpcywge1xuICAgICAgICAgICAgICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG9tOiAndCcsXG4gICAgICAgICAgICAgICAgcGFnZUxlbmd0aCxcbiAgICAgICAgICAgICAgICBkaXNwbGF5U3RhcnQ6IHBhcnNlSW50KHBhcmFtZXRlcnMucGFnZSkgPyAocGFyc2VJbnQocGFyYW1ldGVycy5wYWdlKSAtIDEpICogcGFnZUxlbmd0aCA6IDAsXG4gICAgICAgICAgICAgICAgc2VydmVyU2lkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZToganNlLmxpYnMuZGF0YXRhYmxlLmdldFRyYW5zbGF0aW9ucyhqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSksXG4gICAgICAgICAgICAgICAgYWpheDoge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89SW52b2ljZXNPdmVydmlld0FqYXgvRGF0YVRhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9yZGVyQ2VsbHNUb3A6IHRydWUsXG4gICAgICAgICAgICAgICAgb3JkZXI6IF9nZXRPcmRlcihwYXJhbWV0ZXJzLCBjb2x1bW5zKSxcbiAgICAgICAgICAgICAgICBzZWFyY2hDb2xzOiBfZ2V0U2VhcmNoQ29scyhwYXJhbWV0ZXJzLCBjb2x1bW5zKSxcbiAgICAgICAgICAgICAgICBjb2x1bW5zXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIHRhYmxlIGVycm9yIGhhbmRsZXIuXG4gICAgICAgICAgICBqc2UubGlicy5kYXRhdGFibGUuZXJyb3IoJHRoaXMsIGZ1bmN0aW9uIChldmVudCwgc2V0dGluZ3MsIHRlY2hOb3RlLCBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSAnRGF0YVRhYmxlcyAnICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBwYWdpbmF0aW9uIGNoYW5nZSBoYW5kbGVyLlxuICAgICAgICAgICAgJHRoaXMub24oJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpsZW5ndGhfY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50LCBuZXdQYWdlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBqc2UuY29yZS5yZWdpc3RyeS5nZXQoJ3VzZXJJZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogJ2ludm9pY2VzT3ZlcnZpZXdQYWdlTGVuZ3RoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogbmV3UGFnZUxlbmd0aFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIGRyYXcgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIGlucHV0OmNoZWNrYm94JylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScsIFtmYWxzZV0pOyAvLyBObyBuZWVkIHRvIHVwZGF0ZSB0aGUgdGJvZHkgY2hlY2tib3hlcyAoZXZlbnQuanMpLlxuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5JykuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc2luZ2xlX2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCR0aGlzKTsgLy8gSW5pdGlhbGl6ZSB0aGUgY2hlY2tib3ggd2lkZ2V0LlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNldCBhZG1pbiBzZWFyY2ggdmFsdWUuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1ldGVycykuaW5jbHVkZXMoJ2ZpbHRlcicpICYmIE9iamVjdC5rZXlzKHBhcmFtZXRlcnMuZmlsdGVyKS5pbmNsdWRlcygnaW52b2ljZU51bWJlcicpKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuc2VhcmNoLnNldFZhbHVlKHBhcmFtZXRlcnMuZmlsdGVyLmludm9pY2VOdW1iZXIsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
