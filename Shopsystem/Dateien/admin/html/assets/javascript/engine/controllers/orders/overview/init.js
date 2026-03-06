'use strict';

/* --------------------------------------------------------------
 init.js 2016-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Orders Table Controller
 *
 * This controller initializes the main orders table with a new jQuery DataTables instance.
 */
gx.controllers.module('init', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', jse.source + '/vendor/momentjs/moment.min.js', gx.source + '/libs/orders_overview_columns', gx.source + '/libs/search', 'datatable', 'modal', 'user_configuration_service'], function (data) {

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
        } else if (data.activeColumns.indexOf('number') > -1) {
            // Order by number if possible.
            index = data.activeColumns.indexOf('number');
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
        var columns = jse.libs.datatable.prepareColumns($this, jse.libs.orders_overview_columns, data.activeColumns);
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
                url: jse.core.config.get('appUrl') + '/admin/admin.php?do=OrdersOverviewAjax/DataTable',
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

        $this.on('datatable_custom_pagination:length_change', function (event, newPageLength) {
            jse.libs.user_configuration_service.set({
                data: {
                    userId: jse.core.registry.get('userId'),
                    configurationKey: 'ordersOverviewPageLength',
                    configurationValue: newPageLength
                }
            });
        });

        $this.on('draw.dt', function () {
            $this.find('thead input:checkbox').prop('checked', false).trigger('change', [false]); // No need to update the tbody checkboxes (event.js).
            $this.find('tbody').attr('data-gx-widget', 'single_checkbox');
            gx.widgets.init($this); // Initialize the checkbox widget.
        });

        // Set admin search value.
        if (Object.keys(parameters).includes('filter') && Object.keys(parameters.filter).includes('number')) {
            jse.libs.search.setValue(parameters.filter.number, true);
        }

        var urlParams = new URLSearchParams(location.search);

        if (urlParams.has('error') && urlParams.get('error') === 'pdf_encrypted') {
            var $modal = $('.bulk-pdf-encryption-error.modal');
            console.log($modal);
            $modal.modal('show');
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vdmVydmlldy9pbml0LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiX2dldE9yZGVyIiwicGFyYW1ldGVycyIsImNvbHVtbnMiLCJpbmRleCIsImRpcmVjdGlvbiIsInNvcnQiLCJjaGFyQXQiLCJjb2x1bW5OYW1lIiwic2xpY2UiLCJjb2x1bW4iLCJuYW1lIiwiaW5kZXhPZiIsImFjdGl2ZUNvbHVtbnMiLCJfZ2V0U2VhcmNoQ29scyIsImZpbHRlciIsInNlYXJjaENvbHMiLCJlbnRyeSIsInZhbHVlIiwic2VhcmNoIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwicHVzaCIsImluaXQiLCJkb25lIiwibGlicyIsImRhdGF0YWJsZSIsInByZXBhcmVDb2x1bW5zIiwib3JkZXJzX292ZXJ2aWV3X2NvbHVtbnMiLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJwYWdlTGVuZ3RoIiwicGFyc2VJbnQiLCJsZW5ndGgiLCJjcmVhdGUiLCJhdXRvV2lkdGgiLCJkb20iLCJkaXNwbGF5U3RhcnQiLCJwYWdlIiwic2VydmVyU2lkZSIsImxhbmd1YWdlIiwiZ2V0VHJhbnNsYXRpb25zIiwiY29yZSIsImNvbmZpZyIsImdldCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwicGFnZVRva2VuIiwib3JkZXJDZWxsc1RvcCIsIm9yZGVyIiwiZXJyb3IiLCJldmVudCIsInNldHRpbmdzIiwidGVjaE5vdGUiLCJtZXNzYWdlIiwidGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwibW9kYWwiLCJzaG93TWVzc2FnZSIsIm9uIiwibmV3UGFnZUxlbmd0aCIsInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlIiwic2V0IiwidXNlcklkIiwicmVnaXN0cnkiLCJjb25maWd1cmF0aW9uS2V5IiwiY29uZmlndXJhdGlvblZhbHVlIiwiZmluZCIsInByb3AiLCJ0cmlnZ2VyIiwiYXR0ciIsIndpZGdldHMiLCJPYmplY3QiLCJrZXlzIiwiaW5jbHVkZXMiLCJzZXRWYWx1ZSIsIm51bWJlciIsInVybFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsImhhcyIsIiRtb2RhbCIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksTUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgsbURBRU9ELElBQUlDLE1BRlgsa0RBR09ELElBQUlDLE1BSFgsbURBSU9ELElBQUlDLE1BSlgscUNBS09KLEdBQUdJLE1BTFYsb0NBTU9KLEdBQUdJLE1BTlYsbUJBT0ksV0FQSixFQVFJLE9BUkosRUFTSSw0QkFUSixDQUhKLEVBZUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1MLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FBUUEsYUFBU00sU0FBVCxDQUFtQkMsVUFBbkIsRUFBK0JDLE9BQS9CLEVBQXdDO0FBQ3BDLFlBQUlDLFFBQVEsQ0FBWixDQURvQyxDQUNyQjtBQUNmLFlBQUlDLFlBQVksTUFBaEIsQ0FGb0MsQ0FFWjs7QUFFeEI7QUFDQSxZQUFJSCxXQUFXSSxJQUFmLEVBQXFCO0FBQ2pCRCx3QkFBWUgsV0FBV0ksSUFBWCxDQUFnQkMsTUFBaEIsQ0FBdUIsQ0FBdkIsTUFBOEIsR0FBOUIsR0FBb0MsTUFBcEMsR0FBNkMsS0FBekQ7QUFDQSxnQkFBTUMsYUFBYU4sV0FBV0ksSUFBWCxDQUFnQkcsS0FBaEIsQ0FBc0IsQ0FBdEIsQ0FBbkI7O0FBRmlCO0FBQUE7QUFBQTs7QUFBQTtBQUlqQixxQ0FBbUJOLE9BQW5CLDhIQUE0QjtBQUFBLHdCQUFuQk8sTUFBbUI7O0FBQ3hCLHdCQUFJQSxPQUFPQyxJQUFQLEtBQWdCSCxVQUFwQixFQUFnQztB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O0FBQzNCLFNBTkQ7O0FBUUE7QUFDQSxZQUFJMkUsT0FBT0MsSUFBUCxDQUFZekUsVUFBWixFQUF3QjBFLFFBQXhCLENBQWlDLFFBQWpDLEtBQThDRixPQUFPQyxJQUFQLENBQVl6RSxXQUFXYSxNQUF2QixFQUErQjZELFFBQS9CLENBQXdDLFFBQXhDLENBQWxELEVBQXFHO0FBQ2pHaEYsZ0JBQUk0QixJQUFKLENBQVNMLE1BQVQsQ0FBZ0IwRCxRQUFoQixDQUF5QjNFLFdBQVdhLE1BQVgsQ0FBa0IrRCxNQUEzQyxFQUFtRCxJQUFuRDtBQUNIOztBQUVELFlBQU1DLFlBQVksSUFBSUMsZUFBSixDQUFvQmxELFNBQVNYLE1BQTdCLENBQWxCOztBQUVBLFlBQUk0RCxVQUFVRSxHQUFWLENBQWMsT0FBZCxLQUEwQkYsVUFBVW5DLEdBQVYsQ0FBYyxPQUFkLE1BQTJCLGVBQXpELEVBQTBFO0FBQ3pFLGdCQUFNc0MsU0FBU2xGLEVBQUUsa0NBQUYsQ0FBZjtBQUNBbUYsb0JBQVFDLEdBQVIsQ0FBWUYsTUFBWjtBQUNBQSxtQkFBT3ZCLEtBQVAsQ0FBYSxNQUFiO0FBQ0E7O0FBRURwQztBQUNILEtBaEVEOztBQWtFQSxXQUFPNUIsTUFBUDtBQUNILENBMUtMIiwiZmlsZSI6Im9yZGVycy9vdmVydmlldy9pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbml0LmpzIDIwMTYtMDktMDFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIE9yZGVycyBUYWJsZSBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGluaXRpYWxpemVzIHRoZSBtYWluIG9yZGVycyB0YWJsZSB3aXRoIGEgbmV3IGpRdWVyeSBEYXRhVGFibGVzIGluc3RhbmNlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2luaXQnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2RhdGF0YWJsZXMvanF1ZXJ5LmRhdGFUYWJsZXMubWluLmpzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS1kZXBhcmFtL2pxdWVyeS1kZXBhcmFtLm1pbi5qc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9tb21lbnRqcy9tb21lbnQubWluLmpzYCxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL29yZGVyc19vdmVydmlld19jb2x1bW5zYCxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL3NlYXJjaGAsXG4gICAgICAgICdkYXRhdGFibGUnLFxuICAgICAgICAnbW9kYWwnLFxuICAgICAgICAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBJbml0aWFsIFRhYmxlIE9yZGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIENvbnRhaW5zIHRoZSBVUkwgcGFyYW1ldGVycy5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNvbHVtbnMgQ29udGFpbnMgdGhlIGNvbHVtbiBkZWZpbml0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7QXJyYXlbXX1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRPcmRlcihwYXJhbWV0ZXJzLCBjb2x1bW5zKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSAxOyAvLyBPcmRlciBieSBmaXJzdCBjb2x1bW4gYnkgZGVmYXVsdC5cbiAgICAgICAgICAgIGxldCBkaXJlY3Rpb24gPSAnZGVzYyc7IC8vIE9yZGVyIERFU0MgYnkgZGVmYXVsdC5cblxuICAgICAgICAgICAgLy8gQXBwbHkgaW5pdGlhbCB0YWJsZSBzb3J0LlxuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcnMuc29ydCkge1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbiA9IHBhcmFtZXRlcnMuc29ydC5jaGFyQXQoMCkgPT09ICctJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSBwYXJhbWV0ZXJzLnNvcnQuc2xpY2UoMSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gb2YgY29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uLm5hbWUgPT09IGNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gY29sdW1ucy5pbmRleE9mKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5hY3RpdmVDb2x1bW5zLmluZGV4T2YoJ251bWJlcicpID4gLTEpIHsgLy8gT3JkZXIgYnkgbnVtYmVyIGlmIHBvc3NpYmxlLlxuICAgICAgICAgICAgICAgIGluZGV4ID0gZGF0YS5hY3RpdmVDb2x1bW5zLmluZGV4T2YoJ251bWJlcicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1tpbmRleCwgZGlyZWN0aW9uXV07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IEluaXRpYWwgU2VhcmNoIENvbHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQ29udGFpbnMgdGhlIFVSTCBwYXJhbWV0ZXJzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0W119IFJldHVybnMgdGhlIGluaXRpYWwgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTZWFyY2hDb2xzKHBhcmFtZXRlcnMsIGNvbHVtbnMpIHtcbiAgICAgICAgICAgIGlmICghcGFyYW1ldGVycy5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaENvbHMgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uIG9mIGNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBhcmFtZXRlcnMuZmlsdGVyW2NvbHVtbi5uYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeSA9IHtzZWFyY2g6IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNlYXJjaENvbHMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hDb2xzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbnMgPSBqc2UubGlicy5kYXRhdGFibGUucHJlcGFyZUNvbHVtbnMoJHRoaXMsIGpzZS5saWJzLm9yZGVyc19vdmVydmlld19jb2x1bW5zLFxuICAgICAgICAgICAgICAgIGRhdGEuYWN0aXZlQ29sdW1ucyk7XG4gICAgICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xuICAgICAgICAgICAgY29uc3QgcGFnZUxlbmd0aCA9IHBhcnNlSW50KHBhcmFtZXRlcnMubGVuZ3RoIHx8IGRhdGEucGFnZUxlbmd0aCk7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLmRhdGF0YWJsZS5jcmVhdGUoJHRoaXMsIHtcbiAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRvbTogJ3QnLFxuICAgICAgICAgICAgICAgIHBhZ2VMZW5ndGgsXG4gICAgICAgICAgICAgICAgZGlzcGxheVN0YXJ0OiBwYXJzZUludChwYXJhbWV0ZXJzLnBhZ2UpID8gKHBhcnNlSW50KHBhcmFtZXRlcnMucGFnZSkgLSAxKSAqIHBhZ2VMZW5ndGggOiAwLFxuICAgICAgICAgICAgICAgIHNlcnZlclNpZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IGpzZS5saWJzLmRhdGF0YWJsZS5nZXRUcmFuc2xhdGlvbnMoanNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykpLFxuICAgICAgICAgICAgICAgIGFqYXg6IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPU9yZGVyc092ZXJ2aWV3QWpheC9EYXRhVGFibGUnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3JkZXJDZWxsc1RvcDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvcmRlcjogX2dldE9yZGVyKHBhcmFtZXRlcnMsIGNvbHVtbnMpLFxuICAgICAgICAgICAgICAgIHNlYXJjaENvbHM6IF9nZXRTZWFyY2hDb2xzKHBhcmFtZXRlcnMsIGNvbHVtbnMpLFxuICAgICAgICAgICAgICAgIGNvbHVtbnNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGFibGUgZXJyb3IgaGFuZGxlci5cbiAgICAgICAgICAgIGpzZS5saWJzLmRhdGF0YWJsZS5lcnJvcigkdGhpcywgZnVuY3Rpb24gKGV2ZW50LCBzZXR0aW5ncywgdGVjaE5vdGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9ICdEYXRhVGFibGVzICcgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKTtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZSh0aXRsZSwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpsZW5ndGhfY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50LCBuZXdQYWdlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBqc2UuY29yZS5yZWdpc3RyeS5nZXQoJ3VzZXJJZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogJ29yZGVyc092ZXJ2aWV3UGFnZUxlbmd0aCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IG5ld1BhZ2VMZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIGlucHV0OmNoZWNrYm94JylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScsIFtmYWxzZV0pOyAvLyBObyBuZWVkIHRvIHVwZGF0ZSB0aGUgdGJvZHkgY2hlY2tib3hlcyAoZXZlbnQuanMpLlxuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5JykuYXR0cignZGF0YS1neC13aWRnZXQnLCAnc2luZ2xlX2NoZWNrYm94Jyk7XG4gICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCR0aGlzKTsgLy8gSW5pdGlhbGl6ZSB0aGUgY2hlY2tib3ggd2lkZ2V0LlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNldCBhZG1pbiBzZWFyY2ggdmFsdWUuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocGFyYW1ldGVycykuaW5jbHVkZXMoJ2ZpbHRlcicpICYmIE9iamVjdC5rZXlzKHBhcmFtZXRlcnMuZmlsdGVyKS5pbmNsdWRlcygnbnVtYmVyJykpIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5zZWFyY2guc2V0VmFsdWUocGFyYW1ldGVycy5maWx0ZXIubnVtYmVyLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodXJsUGFyYW1zLmhhcygnZXJyb3InKSAmJiB1cmxQYXJhbXMuZ2V0KCdlcnJvcicpID09PSAncGRmX2VuY3J5cHRlZCcpIHtcblx0ICAgICAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmJ1bGstcGRmLWVuY3J5cHRpb24tZXJyb3IubW9kYWwnKTtcblx0ICAgICAgICAgICAgY29uc29sZS5sb2coJG1vZGFsKTtcblx0ICAgICAgICAgICAgJG1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
