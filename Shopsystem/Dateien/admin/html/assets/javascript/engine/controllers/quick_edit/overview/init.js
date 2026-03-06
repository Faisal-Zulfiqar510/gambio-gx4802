'use strict';

/* --------------------------------------------------------------
 init.js 2017-03-06
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * QuickEdit Table Controller
 *
 * This controller initializes the main QuickEdit table with a new jQuery DataTables instance.
 */
gx.controllers.module('init', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', 'datatable', jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', gx.source + '/libs/quick_edit_overview_columns'], function (data) {

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

    /**
     * Special Price Modal
     *
     * @type {jQuery}
     */
    var $specialPriceModal = $this.parents('.quick-edit.overview').find('.special-prices.modal');

    /**
     * Search Parameters
     *
     * @type {Object}
     */
    var parameters = $.deparam(window.location.search.slice(1));

    /**
     * DataTable Columns
     *
     * @type {Object[]}
     */
    var columns = jse.libs.datatable.prepareColumns($this, jse.libs.quick_edit_overview_columns, data.activeColumns);

    /**
     * DataTable Options
     *
     * @type {Object}
     */
    var options = {
        autoWidth: false,
        dom: 't',
        pageLength: parseInt(parameters.length || data.pageLength),
        displayStart: parseInt(parameters.page) ? (parseInt(parameters.page) - 1) * 25 : 0,
        serverSide: true,
        language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
        ajax: {
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/DataTable',
            type: 'POST',
            data: {
                pageToken: jse.core.config.get('pageToken')
            }
        },
        orderCellsTop: true,
        order: _getOrder(parameters, columns),
        searchCols: _getSearchCols(parameters, columns),
        columns: columns
    };

    var dataTable = void 0;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Get Initial Table Order
     *
     * @param {Object} parameters Contains the URL parameters.
     * @param {Object} columns Contains the column definitions.
     *
     * @return {Object[]} Returns the ordered column definitions.
     */
    function _getOrder(parameters, columns) {
        var index = 1; // Order by first column by default.
        var direction = 'asc'; // Order ASC by default.
        var columnName = 'name'; // Order by products name by default.

        $this.on('click', 'th', function () {
            columnName = $(this).data('column-name');
            index = dataTable.column(this).index();
        });

        // Apply initial table sort.
        if (parameters.sort) {
            direction = parameters.sort.charAt(0) === '-' ? 'desc' : 'asc';
            var _columnName = parameters.sort.slice(1);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var column = _step.value;

                    if (column.name === _columnName) {
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
            index = data.activeColumns.indexOf('name');
        }

        return [[index, direction]];
    }

    /**
     * Get Initial Search Cols
     *
     * @param {Object} parameters Contains the URL parameters.
     * @param {Object} columns Contains the column definitions.
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
                    entry = { search: value };
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
        $specialPriceModal.on('hide.bs.modal', function () {
            $this.DataTable().ajax.reload();
        });

        $this.on('draw.dt', function () {
            $this.find('thead input:checkbox').prop('checked', false).trigger('change', [false]);
            $this.find('tbody').attr('data-gx-widget', 'single_checkbox switcher');
            $this.find('tbody').attr('data-single_checkbox-selector', '.overview-row-selection');
            $this.find('tbody').attr('data-switcher-selector', '.convert-to-switcher');

            gx.widgets.init($this);
        });

        dataTable = jse.libs.datatable.create($this, options);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvaW5pdC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRzcGVjaWFsUHJpY2VNb2RhbCIsInBhcmVudHMiLCJmaW5kIiwicGFyYW1ldGVycyIsImRlcGFyYW0iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInNsaWNlIiwiY29sdW1ucyIsImxpYnMiLCJkYXRhdGFibGUiLCJwcmVwYXJlQ29sdW1ucyIsInF1aWNrX2VkaXRfb3ZlcnZpZXdfY29sdW1ucyIsImFjdGl2ZUNvbHVtbnMiLCJvcHRpb25zIiwiYXV0b1dpZHRoIiwiZG9tIiwicGFnZUxlbmd0aCIsInBhcnNlSW50IiwibGVuZ3RoIiwiZGlzcGxheVN0YXJ0IiwicGFnZSIsInNlcnZlclNpZGUiLCJsYW5ndWFnZSIsImdldFRyYW5zbGF0aW9ucyIsImNvcmUiLCJjb25maWciLCJnZXQiLCJhamF4IiwidXJsIiwidHlwZSIsInBhZ2VUb2tlbiIsIm9yZGVyQ2VsbHNUb3AiLCJvcmRlciIsIl9nZXRPcmRlciIsInNlYXJjaENvbHMiLCJfZ2V0U2VhcmNoQ29scyIsImRhdGFUYWJsZSIsImluZGV4IiwiZGlyZWN0aW9uIiwiY29sdW1uTmFtZSIsIm9uIiwiY29sdW1uIiwic29ydCIsImNoYXJBdCIsIm5hbWUiLCJpbmRleE9mIiwiZmlsdGVyIiwiZW50cnkiLCJ2YWx1ZSIsInB1c2giLCJpbml0IiwiZG9uZSIsIkRhdGFUYWJsZSIsInJlbG9hZCIsInByb3AiLCJ0cmlnZ2VyIiwiYXR0ciIsIndpZGdldHMiLCJjcmVhdGUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksTUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgsbURBRU9ELElBQUlDLE1BRlgsa0RBR0ksV0FISixFQUlPRCxJQUFJ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QUFDMUJyRCwyQkFDSzBDLEVBREwsQ0FDUSxlQURSLEVBQ3lCLFlBQVk7QUFDN0I1QyxrQkFBTXdELFNBQU4sR0FBa0J6QixJQUFsQixDQUF1QjBCLE1BQXZCO0FBQ0gsU0FITDs7QUFLQXpELGNBQU00QyxFQUFOLENBQVMsU0FBVCxFQUFvQixZQUFNO0FBQ3RCNUMsa0JBQU1JLElBQU4sQ0FBVyxzQkFBWCxFQUNLc0QsSUFETCxDQUNVLFNBRFYsRUFDcUIsS0FEckIsRUFFS0MsT0FGTCxDQUVhLFFBRmIsRUFFdUIsQ0FBQyxLQUFELENBRnZCO0FBR0EzRCxrQkFBTUksSUFBTixDQUFXLE9BQVgsRUFBb0J3RCxJQUFwQixDQUF5QixnQkFBekIsRUFBMkMsMEJBQTNDO0FBQ0E1RCxrQkFBTUksSUFBTixDQUFXLE9BQVgsRUFBb0J3RCxJQUFwQixDQUF5QiwrQkFBekIsRUFBMEQseUJBQTFEO0FBQ0E1RCxrQkFBTUksSUFBTixDQUFXLE9BQVgsRUFBb0J3RCxJQUFwQixDQUF5Qix3QkFBekIsRUFBbUQsc0JBQW5EOztBQUVBbEUsZUFBR21FLE9BQUgsQ0FBV1AsSUFBWCxDQUFnQnRELEtBQWhCO0FBQ0gsU0FURDs7QUFXQXdDLG9CQUFZM0MsSUFBSWUsSUFBSixDQUFTQyxTQUFULENBQW1CaUQsTUFBbkIsQ0FBMEI5RCxLQUExQixFQUFpQ2lCLE9BQWpDLENBQVo7O0FBRUFzQztBQUNILEtBcEJEOztBQXNCQSxXQUFPM0QsTUFBUDtBQUNILENBakxMIiwiZmlsZSI6InF1aWNrX2VkaXQvb3ZlcnZpZXcvaW5pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gaW5pdC5qcyAyMDE3LTAzLTA2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBRdWlja0VkaXQgVGFibGUgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBpbml0aWFsaXplcyB0aGUgbWFpbiBRdWlja0VkaXQgdGFibGUgd2l0aCBhIG5ldyBqUXVlcnkgRGF0YVRhYmxlcyBpbnN0YW5jZS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdpbml0JyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2RhdGF0YWJsZXMvanF1ZXJ5LmRhdGFUYWJsZXMubWluLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5qc2AsXG4gICAgICAgICdkYXRhdGFibGUnLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LWRlcGFyYW0vanF1ZXJ5LWRlcGFyYW0ubWluLmpzYCxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL3F1aWNrX2VkaXRfb3ZlcnZpZXdfY29sdW1uc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpYWwgUHJpY2UgTW9kYWxcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRzcGVjaWFsUHJpY2VNb2RhbCA9ICR0aGlzLnBhcmVudHMoJy5xdWljay1lZGl0Lm92ZXJ2aWV3JykuZmluZCgnLnNwZWNpYWwtcHJpY2VzLm1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlYXJjaCBQYXJhbWV0ZXJzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEYXRhVGFibGUgQ29sdW1uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0W119XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBjb2x1bW5zID0ganNlLmxpYnMuZGF0YXRhYmxlLnByZXBhcmVDb2x1bW5zKCR0aGlzLCBqc2UubGlicy5xdWlja19lZGl0X292ZXJ2aWV3X2NvbHVtbnMsIGRhdGEuYWN0aXZlQ29sdW1ucyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERhdGFUYWJsZSBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgIGRvbTogJ3QnLFxuICAgICAgICAgICAgcGFnZUxlbmd0aDogcGFyc2VJbnQocGFyYW1ldGVycy5sZW5ndGggfHwgZGF0YS5wYWdlTGVuZ3RoKSxcbiAgICAgICAgICAgIGRpc3BsYXlTdGFydDogcGFyc2VJbnQocGFyYW1ldGVycy5wYWdlKSA/IChwYXJzZUludChwYXJhbWV0ZXJzLnBhZ2UpIC0gMSkgKiAyNSA6IDAsXG4gICAgICAgICAgICBzZXJ2ZXJTaWRlOiB0cnVlLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IGpzZS5saWJzLmRhdGF0YWJsZS5nZXRUcmFuc2xhdGlvbnMoanNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykpLFxuICAgICAgICAgICAgYWpheDoge1xuICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRPdmVydmlld0FqYXgvRGF0YVRhYmxlJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yZGVyQ2VsbHNUb3A6IHRydWUsXG4gICAgICAgICAgICBvcmRlcjogX2dldE9yZGVyKHBhcmFtZXRlcnMsIGNvbHVtbnMpLFxuICAgICAgICAgICAgc2VhcmNoQ29sczogX2dldFNlYXJjaENvbHMocGFyYW1ldGVycywgY29sdW1ucyksXG4gICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBkYXRhVGFibGU7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IEluaXRpYWwgVGFibGUgT3JkZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQ29udGFpbnMgdGhlIFVSTCBwYXJhbWV0ZXJzLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29sdW1ucyBDb250YWlucyB0aGUgY29sdW1uIGRlZmluaXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gUmV0dXJucyB0aGUgb3JkZXJlZCBjb2x1bW4gZGVmaW5pdGlvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0T3JkZXIocGFyYW1ldGVycywgY29sdW1ucykge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gMTsgLy8gT3JkZXIgYnkgZmlyc3QgY29sdW1uIGJ5IGRlZmF1bHQuXG4gICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gJ2FzYyc7IC8vIE9yZGVyIEFTQyBieSBkZWZhdWx0LlxuICAgICAgICAgICAgbGV0IGNvbHVtbk5hbWUgPSAnbmFtZSc7IC8vIE9yZGVyIGJ5IHByb2R1Y3RzIG5hbWUgYnkgZGVmYXVsdC5cblxuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJ3RoJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbi1uYW1lJyk7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBkYXRhVGFibGUuY29sdW1uKHRoaXMpLmluZGV4KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQXBwbHkgaW5pdGlhbCB0YWJsZSBzb3J0LlxuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMuc29ydCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IHBhcmFtZXRlcnMuc29ydC5jaGFyQXQoMCkgPT09ICctJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSBwYXJhbWV0ZXJzLnNvcnQuc2xpY2UoMSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gb2YgY29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uLm5hbWUgPT09IGNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gY29sdW1ucy5pbmRleE9mKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5hY3RpdmVDb2x1bW5zLmluZGV4T2YoJ25hbWUnKSA+IC0xKSB7IC8vIE9yZGVyIGJ5IG5hbWUgaWYgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgaW5kZXggPSBkYXRhLmFjdGl2ZUNvbHVtbnMuaW5kZXhPZignbmFtZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1tpbmRleCwgZGlyZWN0aW9uXV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IEluaXRpYWwgU2VhcmNoIENvbHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQ29udGFpbnMgdGhlIFVSTCBwYXJhbWV0ZXJzLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29sdW1ucyBDb250YWlucyB0aGUgY29sdW1uIGRlZmluaXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0W119IFJldHVybnMgdGhlIGluaXRpYWwgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTZWFyY2hDb2xzKHBhcmFtZXRlcnMsIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGlmICghcGFyYW1ldGVycy5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaENvbHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBhcmFtZXRlcnMuZmlsdGVyW2NvbHVtbi5uYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeSA9IHtzZWFyY2g6IHZhbHVlfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWFyY2hDb2xzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VhcmNoQ29scztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkc3BlY2lhbFByaWNlTW9kYWxcbiAgICAgICAgICAgICAgICAub24oJ2hpZGUuYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIGlucHV0OmNoZWNrYm94JylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScsIFtmYWxzZV0pO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5JykuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc2luZ2xlX2NoZWNrYm94IHN3aXRjaGVyJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHknKS5hdHRyKCdkYXRhLXNpbmdsZV9jaGVja2JveC1zZWxlY3RvcicsICcub3ZlcnZpZXctcm93LXNlbGVjdGlvbicpO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5JykuYXR0cignZGF0YS1zd2l0Y2hlci1zZWxlY3RvcicsICcuY29udmVydC10by1zd2l0Y2hlcicpO1xuXG4gICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCR0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkYXRhVGFibGUgPSBqc2UubGlicy5kYXRhdGFibGUuY3JlYXRlKCR0aGlzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
