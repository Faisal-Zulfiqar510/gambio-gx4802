'use strict';

/* --------------------------------------------------------------
 filter.js 2016-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the orders table filtering.
 *
 * ### Methods
 *
 * **Reload Filtering Options**
 *
 * ```
 * // Reload the filter options with an AJAX request (optionally provide a second parameter for the AJAX URL).
 * $('.table-main').orders_overview_filter('reload');
 * ```
 */
gx.controllers.module('filter', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Enter Key Code
     *
     * @type {Number}
     */

    var ENTER_KEY_CODE = 13;

    /**
     * Module Selector
     *
     * @type {jQuery}
     */
    var $this = $(this);

    /**
     * Filter Row Selector
     *
     * @type {jQuery}
     */
    var $filter = $this.find('tr.filter');

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = { bindings: {} };

    // Dynamically define the filter row data-bindings.
    $filter.find('th').each(function () {
        var columnName = $(this).data('columnName');

        if (columnName === 'checkbox' || columnName === 'actions') {
            return true;
        }

        module.bindings[columnName] = $(this).find('input, select').first();
    });

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Reload filter options with an Ajax request.
     *
     * This function implements the $('.datatable').orders_overview_filter('reload') which will reload the filtering
     * "multi_select" instances will new options. It must be used after some table data are changed and the filtering
     * options need to be updated.
     *
     * @param {String} url Optional, the URL to be used for fetching the options. Do not add the "pageToken"
     * parameter to URL, it will be appended in this method.
     */
    function _reload(url) {
        url = url || jse.core.config.get('appUrl') + '/admin/admin.php?do=OrdersOverviewAjax/FilterOptions';
        var data = { pageToken: jse.core.config.get('pageToken') };

        $.getJSON(url, data).done(function (response) {
            for (var column in response) {
                var $select = $filter.find('.SumoSelect > select.' + column);
                var currentValueBackup = $select.val(); // Will try to set it back if it still exists.

                if (!$select.length) {
                    return; // The select element was not found.
                }

                $select.empty();

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = response[column][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var option = _step.value;

                        $select.append(new Option(option.text, option.value));
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

                if (currentValueBackup !== null) {
                    $select.val(currentValueBackup);
                }

                $select.multi_select('refresh');
            }
        });
    }

    /**
     * Add public "orders_overview_filter" method to jQuery in order.
     */
    function _addPublicMethod() {
        if ($.fn.orders_overview_filter) {
            return;
        }

        $.fn.extend({
            orders_overview_filter: function orders_overview_filter(action) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                $.each(this, function () {
                    switch (action) {
                        case 'reload':
                            _reload.apply(this, args);
                            break;
                    }
                });
            }
        });
    }

    /**
     * On Filter Button Click
     *
     * Apply the provided filters and update the table rows.
     */
    function _onApplyFiltersClick() {
        // Prepare the object with the final filtering data.
        var filter = {};

        $filter.find('th').each(function () {
            var columnName = $(this).data('columnName');

            if (columnName === 'checkbox' || columnName === 'actions') {
                return true;
            }

            var value = module.bindings[columnName].get();

            if (value) {
                filter[columnName] = value;
                $this.DataTable().column(columnName + ':name').search(value);
            } else {
                $this.DataTable().column(columnName + ':name').search('');
            }
        });

        $this.trigger('orders_overview_filter:change', [filter]);
        $this.DataTable().draw();
    }

    /**
     * On Reset Button Click
     *
     * Reset the filter form and reload the table data without filtering.
     */
    function _onResetFiltersClick() {
        // Remove values from the input boxes.
        $filter.find('input, select').not('.length').val('');
        $filter.find('select').not('.length').multi_select('refresh');

        // Reset the filtering values.
        $this.DataTable().columns().search('').draw();

        // Trigger Event
        $this.trigger('orders_overview_filter:change', [{}]);
    }

    /**
     * Apply the filters when the user presses the Enter key.
     *
     * @param {jQuery.Event} event
     */
    function _onInputTextKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $filter.find('.apply-filters').trigger('click');
        }
    }

    /**
     * Parse the initial filtering parameters and apply them to the table.
     */
    function _parseFilteringParameters() {
        var _$$deparam = $.deparam(window.location.search.slice(1)),
            filter = _$$deparam.filter;

        for (var name in filter) {
            var value = decodeURIComponent(filter[name]);

            if (module.bindings[name]) {
                module.bindings[name].set(value);
            }
        }
    }

    /**
     * Normalize array filtering values.
     *
     * By default datatables will concatenate array search values into a string separated with "," commas. This
     * is not acceptable though because some filtering elements may contain values with comma and thus the array
     * cannot be parsed from backend. This method will reset those cases back to arrays for a clearer transaction
     * with the backend.
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {DataTables.Settings} settings DataTables settings object.
     * @param {Object} data Data that will be sent to the server in an object form.
     */
    function _normalizeArrayValues(event, settings, data) {
        var filter = {};

        for (var name in module.bindings) {
            var value = module.bindings[name].get();

            if (value && value.constructor === Array) {
                filter[name] = value;
            }
        }

        for (var entry in filter) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = data.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var column = _step2.value;

                    if (entry === column.name && filter[entry].constructor === Array) {
                        column.search.value = filter[entry];
                        break;
                    }
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
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Add public module method.
        _addPublicMethod();

        // Parse filtering GET parameters.
        _parseFilteringParameters();

        // Bind event handlers.
        $filter.on('keyup', 'input:text', _onInputTextKeyUp).on('click', '.apply-filters', _onApplyFiltersClick).on('click', '.reset-filters', _onResetFiltersClick);

        $this.on('preXhr.dt', _normalizeArrayValues);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vdmVydmlldy9maWx0ZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCJFTlRFUl9LRVlfQ09ERSIsIiR0aGlzIiwiJCIsIiRmaWx0ZXIiLCJmaW5kIiwiYmluZGluZ3MiLCJlYWNoIiwiY29sdW1uTmFtZSIsImZpcnN0IiwiX3JlbG9hZCIsInVybCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJwYWdlVG9rZW4iLCJnZXRKU09OIiwiZG9uZSIsInJlc3BvbnNlIiwiY29sdW1uIiwiJHNlbGVjdCIsImN1cnJlbnRWYWx1ZUJhY2t1cCIsInZhbCIsImxlbmd0aCIsImVtcHR5Iiwib3B0aW9uIiwiYXBwZW5kIiwiT3B0aW9uIiwidGV4dCIsInZhbHVlIiwibXVsdGlfc2VsZWN0IiwiX2FkZFB1YmxpY01ldGhvZCIsImZuIiwib3JkZXJzX292ZXJ2aWV3X2ZpbHRlciIsImV4dGVuZCIsImFjdGlvbiIsImFyZ3MiLCJhcHBseSIsIl9vbkFwcGx5RmlsdGVyc0NsaWNrIiwiZmlsdGVyIiwiRGF0YVRhYmxlIiwic2VhcmNoIiwidHJpZ2dlciIsImRyYXciLCJfb25SZXNldEZpbHRlcnNDbGljayIsIm5vdCIsImNvbHVtbnMiLCJfb25JbnB1dFRleHRLZXlVcCIsImV2ZW50Iiwid2hpY2giLCJfcGFyc2VGaWx0ZXJpbmdQYXJhbWV0ZXJzIiwiZGVwYXJhbSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2xpY2UiLCJuYW1lIiwiZGVjb2RlVVJJQ29tcG9uZW50Iiwic2V0IiwiX25vcm1hbGl6ZUFycmF5VmFsdWVzIiwic2V0dGluZ3MiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwiZW50cnkiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7O0FBWUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFFBREosRUFHSSxDQUNPQyxJQUFJQyxN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QUFBQTtBQUFBOztBQUFBO0FBQ3RCLHNDQUFtQnZDLEtBQUs4QyxPQUF4QixtSUFBaUM7QUFBQSx3QkFBeEIzQixNQUF3Qjs7QUFDN0Isd0JBQUkyQyxVQUFVM0MsT0FBT29DLElBQWpCLElBQXlCaEIsT0FBT3VCLEtBQVAsRUFBY0YsV0FBZCxLQUE4QkMsS0FBM0QsRUFBa0U7QUFDOUQxQywrQkFBT3NCLE1BQVAsQ0FBY1osS0FBZCxHQUFzQlUsT0FBT3VCLEtBQVAsQ0FBdEI7QUFDQTtBQUNIO0FBQ0o7QUFOcUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU96QjtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFFQWpFLFdBQU9rRSxJQUFQLEdBQWMsVUFBVTlDLElBQVYsRUFBZ0I7QUFDMUI7QUFDQWM7O0FBRUE7QUFDQW1COztBQUVBO0FBQ0E5QyxnQkFDSzRELEVBREwsQ0FDUSxPQURSLEVBQ2lCLFlBRGpCLEVBQytCakIsaUJBRC9CLEVBRUtpQixFQUZMLENBRVEsT0FGUixFQUVpQixnQkFGakIsRUFFbUMxQixvQkFGbkMsRUFHSzBCLEVBSEwsQ0FHUSxPQUhSLEVBR2lCLGdCQUhqQixFQUdtQ3BCLG9CQUhuQzs7QUFLQTFDLGNBQU04RCxFQUFOLENBQVMsV0FBVCxFQUFzQk4scUJBQXRCOztBQUVBekM7QUFDSCxLQWhCRDs7QUFrQkEsV0FBT3BCLE1BQVA7QUFDSCxDQXRQTCIsImZpbGUiOiJvcmRlcnMvb3ZlcnZpZXcvZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBmaWx0ZXIuanMgMjAxNi0wOS0wMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogSGFuZGxlcyB0aGUgb3JkZXJzIHRhYmxlIGZpbHRlcmluZy5cbiAqXG4gKiAjIyMgTWV0aG9kc1xuICpcbiAqICoqUmVsb2FkIEZpbHRlcmluZyBPcHRpb25zKipcbiAqXG4gKiBgYGBcbiAqIC8vIFJlbG9hZCB0aGUgZmlsdGVyIG9wdGlvbnMgd2l0aCBhbiBBSkFYIHJlcXVlc3QgKG9wdGlvbmFsbHkgcHJvdmlkZSBhIHNlY29uZCBwYXJhbWV0ZXIgZm9yIHRoZSBBSkFYIFVSTCkuXG4gKiAkKCcudGFibGUtbWFpbicpLm9yZGVyc19vdmVydmlld19maWx0ZXIoJ3JlbG9hZCcpO1xuICogYGBgXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnZmlsdGVyJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS1kZXBhcmFtL2pxdWVyeS1kZXBhcmFtLm1pbi5qc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRW50ZXIgS2V5IENvZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IEVOVEVSX0tFWV9DT0RFID0gMTM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaWx0ZXIgUm93IFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkZmlsdGVyID0gJHRoaXMuZmluZCgndHIuZmlsdGVyJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge2JpbmRpbmdzOiB7fX07XG5cbiAgICAgICAgLy8gRHluYW1pY2FsbHkgZGVmaW5lIHRoZSBmaWx0ZXIgcm93IGRhdGEtYmluZGluZ3MuXG4gICAgICAgICRmaWx0ZXIuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tjb2x1bW5OYW1lXSA9ICQodGhpcykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLmZpcnN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbG9hZCBmaWx0ZXIgb3B0aW9ucyB3aXRoIGFuIEFqYXggcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBpbXBsZW1lbnRzIHRoZSAkKCcuZGF0YXRhYmxlJykub3JkZXJzX292ZXJ2aWV3X2ZpbHRlcigncmVsb2FkJykgd2hpY2ggd2lsbCByZWxvYWQgdGhlIGZpbHRlcmluZ1xuICAgICAgICAgKiBcIm11bHRpX3NlbGVjdFwiIGluc3RhbmNlcyB3aWxsIG5ldyBvcHRpb25zLiBJdCBtdXN0IGJlIHVzZWQgYWZ0ZXIgc29tZSB0YWJsZSBkYXRhIGFyZSBjaGFuZ2VkIGFuZCB0aGUgZmlsdGVyaW5nXG4gICAgICAgICAqIG9wdGlvbnMgbmVlZCB0byBiZSB1cGRhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIE9wdGlvbmFsLCB0aGUgVVJMIHRvIGJlIHVzZWQgZm9yIGZldGNoaW5nIHRoZSBvcHRpb25zLiBEbyBub3QgYWRkIHRoZSBcInBhZ2VUb2tlblwiXG4gICAgICAgICAqIHBhcmFtZXRlciB0byBVUkwsIGl0IHdpbGwgYmUgYXBwZW5kZWQgaW4gdGhpcyBtZXRob2QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVsb2FkKHVybCkge1xuICAgICAgICAgICAgdXJsID0gdXJsIHx8IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89T3JkZXJzT3ZlcnZpZXdBamF4L0ZpbHRlck9wdGlvbnMnO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpfTtcblxuICAgICAgICAgICAgJC5nZXRKU09OKHVybCwgZGF0YSkuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRmaWx0ZXIuZmluZCgnLlN1bW9TZWxlY3QgPiBzZWxlY3QuJyArIGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUJhY2t1cCA9ICRzZWxlY3QudmFsKCk7IC8vIFdpbGwgdHJ5IHRvIHNldCBpdCBiYWNrIGlmIGl0IHN0aWxsIGV4aXN0cy5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRzZWxlY3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIFRoZSBzZWxlY3QgZWxlbWVudCB3YXMgbm90IGZvdW5kLlxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5lbXB0eSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9wdGlvbiBvZiByZXNwb25zZVtjb2x1bW5dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZChuZXcgT3B0aW9uKG9wdGlvbi50ZXh0LCBvcHRpb24udmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWVCYWNrdXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3QudmFsKGN1cnJlbnRWYWx1ZUJhY2t1cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0Lm11bHRpX3NlbGVjdCgncmVmcmVzaCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBwdWJsaWMgXCJvcmRlcnNfb3ZlcnZpZXdfZmlsdGVyXCIgbWV0aG9kIHRvIGpRdWVyeSBpbiBvcmRlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9hZGRQdWJsaWNNZXRob2QoKSB7XG4gICAgICAgICAgICBpZiAoJC5mbi5vcmRlcnNfb3ZlcnZpZXdfZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmZuLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgb3JkZXJzX292ZXJ2aWV3X2ZpbHRlcjogZnVuY3Rpb24gKGFjdGlvbiwgLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2godGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyZWxvYWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVsb2FkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gRmlsdGVyIEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBBcHBseSB0aGUgcHJvdmlkZWQgZmlsdGVycyBhbmQgdXBkYXRlIHRoZSB0YWJsZSByb3dzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQXBwbHlGaWx0ZXJzQ2xpY2soKSB7XG4gICAgICAgICAgICAvLyBQcmVwYXJlIHRoZSBvYmplY3Qgd2l0aCB0aGUgZmluYWwgZmlsdGVyaW5nIGRhdGEuXG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgJGZpbHRlci5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnY2hlY2tib3gnIHx8IGNvbHVtbk5hbWUgPT09ICdhY3Rpb25zJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBtb2R1bGUuYmluZGluZ3NbY29sdW1uTmFtZV0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW2NvbHVtbk5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbihgJHtjb2x1bW5OYW1lfTpuYW1lYCkuc2VhcmNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oYCR7Y29sdW1uTmFtZX06bmFtZWApLnNlYXJjaCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ29yZGVyc19vdmVydmlld19maWx0ZXI6Y2hhbmdlJywgW2ZpbHRlcl0pO1xuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFJlc2V0IEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBSZXNldCB0aGUgZmlsdGVyIGZvcm0gYW5kIHJlbG9hZCB0aGUgdGFibGUgZGF0YSB3aXRob3V0IGZpbHRlcmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblJlc2V0RmlsdGVyc0NsaWNrKCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHZhbHVlcyBmcm9tIHRoZSBpbnB1dCBib3hlcy5cbiAgICAgICAgICAgICRmaWx0ZXIuZmluZCgnaW5wdXQsIHNlbGVjdCcpLm5vdCgnLmxlbmd0aCcpLnZhbCgnJyk7XG4gICAgICAgICAgICAkZmlsdGVyLmZpbmQoJ3NlbGVjdCcpLm5vdCgnLmxlbmd0aCcpLm11bHRpX3NlbGVjdCgncmVmcmVzaCcpO1xuXG4gICAgICAgICAgICAvLyBSZXNldCB0aGUgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbnMoKS5zZWFyY2goJycpLmRyYXcoKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBFdmVudFxuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignb3JkZXJzX292ZXJ2aWV3X2ZpbHRlcjpjaGFuZ2UnLCBbe31dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBseSB0aGUgZmlsdGVycyB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIEVudGVyIGtleS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25JbnB1dFRleHRLZXlVcChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBFTlRFUl9LRVlfQ09ERSkge1xuICAgICAgICAgICAgICAgICRmaWx0ZXIuZmluZCgnLmFwcGx5LWZpbHRlcnMnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlIHRoZSBpbml0aWFsIGZpbHRlcmluZyBwYXJhbWV0ZXJzIGFuZCBhcHBseSB0aGVtIHRvIHRoZSB0YWJsZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9wYXJzZUZpbHRlcmluZ1BhcmFtZXRlcnMoKSB7XG4gICAgICAgICAgICBjb25zdCB7ZmlsdGVyfSA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWx0ZXJbbmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5iaW5kaW5nc1tuYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuYmluZGluZ3NbbmFtZV0uc2V0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTm9ybWFsaXplIGFycmF5IGZpbHRlcmluZyB2YWx1ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEJ5IGRlZmF1bHQgZGF0YXRhYmxlcyB3aWxsIGNvbmNhdGVuYXRlIGFycmF5IHNlYXJjaCB2YWx1ZXMgaW50byBhIHN0cmluZyBzZXBhcmF0ZWQgd2l0aCBcIixcIiBjb21tYXMuIFRoaXNcbiAgICAgICAgICogaXMgbm90IGFjY2VwdGFibGUgdGhvdWdoIGJlY2F1c2Ugc29tZSBmaWx0ZXJpbmcgZWxlbWVudHMgbWF5IGNvbnRhaW4gdmFsdWVzIHdpdGggY29tbWEgYW5kIHRodXMgdGhlIGFycmF5XG4gICAgICAgICAqIGNhbm5vdCBiZSBwYXJzZWQgZnJvbSBiYWNrZW5kLiBUaGlzIG1ldGhvZCB3aWxsIHJlc2V0IHRob3NlIGNhc2VzIGJhY2sgdG8gYXJyYXlzIGZvciBhIGNsZWFyZXIgdHJhbnNhY3Rpb25cbiAgICAgICAgICogd2l0aCB0aGUgYmFja2VuZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7RGF0YVRhYmxlcy5TZXR0aW5nc30gc2V0dGluZ3MgRGF0YVRhYmxlcyBzZXR0aW5ncyBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIERhdGEgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHNlcnZlciBpbiBhbiBvYmplY3QgZm9ybS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9ub3JtYWxpemVBcnJheVZhbHVlcyhldmVudCwgc2V0dGluZ3MsIGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG1vZHVsZS5iaW5kaW5ncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbW9kdWxlLmJpbmRpbmdzW25hbWVdLmdldCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGVudHJ5IGluIGZpbHRlcikge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBvZiBkYXRhLmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVudHJ5ID09PSBjb2x1bW4ubmFtZSAmJiBmaWx0ZXJbZW50cnldLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uLnNlYXJjaC52YWx1ZSA9IGZpbHRlcltlbnRyeV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBBZGQgcHVibGljIG1vZHVsZSBtZXRob2QuXG4gICAgICAgICAgICBfYWRkUHVibGljTWV0aG9kKCk7XG5cbiAgICAgICAgICAgIC8vIFBhcnNlIGZpbHRlcmluZyBHRVQgcGFyYW1ldGVycy5cbiAgICAgICAgICAgIF9wYXJzZUZpbHRlcmluZ1BhcmFtZXRlcnMoKTtcblxuICAgICAgICAgICAgLy8gQmluZCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAgICRmaWx0ZXJcbiAgICAgICAgICAgICAgICAub24oJ2tleXVwJywgJ2lucHV0OnRleHQnLCBfb25JbnB1dFRleHRLZXlVcClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5hcHBseS1maWx0ZXJzJywgX29uQXBwbHlGaWx0ZXJzQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcucmVzZXQtZmlsdGVycycsIF9vblJlc2V0RmlsdGVyc0NsaWNrKTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ3ByZVhoci5kdCcsIF9ub3JtYWxpemVBcnJheVZhbHVlcyk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
