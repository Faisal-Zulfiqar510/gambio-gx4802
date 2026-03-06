'use strict';

/* --------------------------------------------------------------
 filter.js 2016-09-30
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the invoices table filtering.
 *
 * ### Methods
 *
 * **Reload Filtering Options**
 *
 * ```
 * // Reload the filter options with an AJAX request (optionally provide a second parameter for the AJAX URL).
 * $('.table-main').invoices_overview_filter('reload');
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
     * This function implements the $('.datatable').invoices_overview_filter('reload') which will reload the filtering
     * "multi_select" instances will new options. It must be used after some table data are changed and the filtering
     * options need to be updated.
     *
     * @param {String} url Optional, the URL to be used for fetching the options. Do not add the "pageToken"
     * parameter to URL, it will be appended in this method.
     */
    function _reload(url) {
        url = url || jse.core.config.get('appUrl') + '/admin/admin.php?do=InvoicesOverviewAjax/FilterOptions';
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
     * Add public "invoices_overview_filter" method to jQuery in order.
     */
    function _addPublicMethod() {
        if ($.fn.invoices_overview_filter) {
            return;
        }

        $.fn.extend({
            invoices_overview_filter: function invoices_overview_filter(action) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                $.each(this, function (instance) {
                    switch (action) {
                        case 'reload':
                            _reload.apply(instance, args);
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

        $this.trigger('invoices_overview_filter:change', [filter]);
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
        $this.trigger('invoices_overview_filter:change', [{}]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL292ZXJ2aWV3L2ZpbHRlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIkVOVEVSX0tFWV9DT0RFIiwiJHRoaXMiLCIkIiwiJGZpbHRlciIsImZpbmQiLCJiaW5kaW5ncyIsImVhY2giLCJjb2x1bW5OYW1lIiwiZmlyc3QiLCJfcmVsb2FkIiwidXJsIiwiY29yZSIsImNvbmZpZyIsImdldCIsInBhZ2VUb2tlbiIsImdldEpTT04iLCJkb25lIiwicmVzcG9uc2UiLCJjb2x1bW4iLCIkc2VsZWN0IiwiY3VycmVudFZhbHVlQmFja3VwIiwidmFsIiwibGVuZ3RoIiwiZW1wdHkiLCJvcHRpb24iLCJhcHBlbmQiLCJPcHRpb24iLCJ0ZXh0IiwidmFsdWUiLCJtdWx0aV9zZWxlY3QiLCJfYWRkUHVibGljTWV0aG9kIiwiZm4iLCJpbnZvaWNlc19vdmVydmlld19maWx0ZXIiLCJleHRlbmQiLCJhY3Rpb24iLCJhcmdzIiwiaW5zdGFuY2UiLCJhcHBseSIsIl9vbkFwcGx5RmlsdGVyc0NsaWNrIiwiZmlsdGVyIiwiRGF0YVRhYmxlIiwic2VhcmNoIiwidHJpZ2dlciIsImRyYXciLCJfb25SZXNldEZpbHRlcnNDbGljayIsIm5vdCIsImNvbHVtbnMiLCJfb25JbnB1dFRleHRLZXlVcCIsImV2ZW50Iiwid2hpY2giLCJfcGFyc2VGaWx0ZXJpbmdQYXJhbWV0ZXJzIiwiZGVwYXJhbSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2xpY2UiLCJuYW1lIiwiZGVjb2RlVVJJQ29tcG9uZW50Iiwic2V0IiwiX25vcm1hbGl6ZUFycmF5VmFsdWVzIiwic2V0dGluZ3MiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwiZW50cnkiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7O0FBWUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFFBREosRUFH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QUFULElBQWtCdkIsTUFBbEIsRUFBMEI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDdEIsc0NBQW1CeEMsS0FBSytDLE9BQXhCLG1JQUFpQztBQUFBLHdCQUF4QjVCLE1BQXdCOztBQUM3Qix3QkFBSTRDLFVBQVU1QyxPQUFPcUMsSUFBakIsSUFBeUJoQixPQUFPdUIsS0FBUCxFQUFjRixXQUFkLEtBQThCQyxLQUEzRCxFQUFrRTtBQUM5RDNDLCtCQUFPdUIsTUFBUCxDQUFjYixLQUFkLEdBQXNCVyxPQUFPdUIsS0FBUCxDQUF0QjtBQUNBO0FBQ0g7QUFDSjtBQU5xQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT3pCO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOztBQUVBbEUsV0FBT21FLElBQVAsR0FBYyxVQUFVL0MsSUFBVixFQUFnQjtBQUMxQjtBQUNBYzs7QUFFQTtBQUNBb0I7O0FBRUE7QUFDQS9DLGdCQUNLNkQsRUFETCxDQUNRLE9BRFIsRUFDaUIsWUFEakIsRUFDK0JqQixpQkFEL0IsRUFFS2lCLEVBRkwsQ0FFUSxPQUZSLEVBRWlCLGdCQUZqQixFQUVtQzFCLG9CQUZuQyxFQUdLMEIsRUFITCxDQUdRLE9BSFIsRUFHaUIsZ0JBSGpCLEVBR21DcEIsb0JBSG5DOztBQUtBM0MsY0FBTStELEVBQU4sQ0FBUyxXQUFULEVBQXNCTixxQkFBdEI7O0FBRUExQztBQUNILEtBaEJEOztBQWtCQSxXQUFPcEIsTUFBUDtBQUNILENBdFBMIiwiZmlsZSI6Imludm9pY2VzL292ZXJ2aWV3L2ZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZmlsdGVyLmpzIDIwMTYtMDktMzBcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIGludm9pY2VzIHRhYmxlIGZpbHRlcmluZy5cbiAqXG4gKiAjIyMgTWV0aG9kc1xuICpcbiAqICoqUmVsb2FkIEZpbHRlcmluZyBPcHRpb25zKipcbiAqXG4gKiBgYGBcbiAqIC8vIFJlbG9hZCB0aGUgZmlsdGVyIG9wdGlvbnMgd2l0aCBhbiBBSkFYIHJlcXVlc3QgKG9wdGlvbmFsbHkgcHJvdmlkZSBhIHNlY29uZCBwYXJhbWV0ZXIgZm9yIHRoZSBBSkFYIFVSTCkuXG4gKiAkKCcudGFibGUtbWFpbicpLmludm9pY2VzX292ZXJ2aWV3X2ZpbHRlcigncmVsb2FkJyk7XG4gKiBgYGBcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdmaWx0ZXInLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LWRlcGFyYW0vanF1ZXJ5LWRlcGFyYW0ubWluLmpzYFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbnRlciBLZXkgQ29kZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgRU5URVJfS0VZX0NPREUgPSAxMztcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRlciBSb3cgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRmaWx0ZXIgPSAkdGhpcy5maW5kKCd0ci5maWx0ZXInKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7YmluZGluZ3M6IHt9fTtcblxuICAgICAgICAvLyBEeW5hbWljYWxseSBkZWZpbmUgdGhlIGZpbHRlciByb3cgZGF0YS1iaW5kaW5ncy5cbiAgICAgICAgJGZpbHRlci5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgY29sdW1uTmFtZSA9ICQodGhpcykuZGF0YSgnY29sdW1uTmFtZScpO1xuXG4gICAgICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gJ2NoZWNrYm94JyB8fCBjb2x1bW5OYW1lID09PSAnYWN0aW9ucycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9kdWxlLmJpbmRpbmdzW2NvbHVtbk5hbWVdID0gJCh0aGlzKS5maW5kKCdpbnB1dCwgc2VsZWN0JykuZmlyc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVsb2FkIGZpbHRlciBvcHRpb25zIHdpdGggYW4gQWpheCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIGltcGxlbWVudHMgdGhlICQoJy5kYXRhdGFibGUnKS5pbnZvaWNlc19vdmVydmlld19maWx0ZXIoJ3JlbG9hZCcpIHdoaWNoIHdpbGwgcmVsb2FkIHRoZSBmaWx0ZXJpbmdcbiAgICAgICAgICogXCJtdWx0aV9zZWxlY3RcIiBpbnN0YW5jZXMgd2lsbCBuZXcgb3B0aW9ucy4gSXQgbXVzdCBiZSB1c2VkIGFmdGVyIHNvbWUgdGFibGUgZGF0YSBhcmUgY2hhbmdlZCBhbmQgdGhlIGZpbHRlcmluZ1xuICAgICAgICAgKiBvcHRpb25zIG5lZWQgdG8gYmUgdXBkYXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBPcHRpb25hbCwgdGhlIFVSTCB0byBiZSB1c2VkIGZvciBmZXRjaGluZyB0aGUgb3B0aW9ucy4gRG8gbm90IGFkZCB0aGUgXCJwYWdlVG9rZW5cIlxuICAgICAgICAgKiBwYXJhbWV0ZXIgdG8gVVJMLCBpdCB3aWxsIGJlIGFwcGVuZGVkIGluIHRoaXMgbWV0aG9kLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3JlbG9hZCh1cmwpIHtcbiAgICAgICAgICAgIHVybCA9IHVybCB8fCBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUludm9pY2VzT3ZlcnZpZXdBamF4L0ZpbHRlck9wdGlvbnMnO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpfTtcblxuICAgICAgICAgICAgJC5nZXRKU09OKHVybCwgZGF0YSkuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRmaWx0ZXIuZmluZCgnLlN1bW9TZWxlY3QgPiBzZWxlY3QuJyArIGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUJhY2t1cCA9ICRzZWxlY3QudmFsKCk7IC8vIFdpbGwgdHJ5IHRvIHNldCBpdCBiYWNrIGlmIGl0IHN0aWxsIGV4aXN0cy5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRzZWxlY3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIFRoZSBzZWxlY3QgZWxlbWVudCB3YXMgbm90IGZvdW5kLlxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5lbXB0eSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9wdGlvbiBvZiByZXNwb25zZVtjb2x1bW5dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZChuZXcgT3B0aW9uKG9wdGlvbi50ZXh0LCBvcHRpb24udmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWVCYWNrdXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3QudmFsKGN1cnJlbnRWYWx1ZUJhY2t1cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0Lm11bHRpX3NlbGVjdCgncmVmcmVzaCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBwdWJsaWMgXCJpbnZvaWNlc19vdmVydmlld19maWx0ZXJcIiBtZXRob2QgdG8galF1ZXJ5IGluIG9yZGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FkZFB1YmxpY01ldGhvZCgpIHtcbiAgICAgICAgICAgIGlmICgkLmZuLmludm9pY2VzX292ZXJ2aWV3X2ZpbHRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5mbi5leHRlbmQoe1xuICAgICAgICAgICAgICAgIGludm9pY2VzX292ZXJ2aWV3X2ZpbHRlcihhY3Rpb24sIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHRoaXMsIChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyZWxvYWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVsb2FkLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIEZpbHRlciBCdXR0b24gQ2xpY2tcbiAgICAgICAgICpcbiAgICAgICAgICogQXBwbHkgdGhlIHByb3ZpZGVkIGZpbHRlcnMgYW5kIHVwZGF0ZSB0aGUgdGFibGUgcm93cy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkFwcGx5RmlsdGVyc0NsaWNrKCkge1xuICAgICAgICAgICAgLy8gUHJlcGFyZSB0aGUgb2JqZWN0IHdpdGggdGhlIGZpbmFsIGZpbHRlcmluZyBkYXRhLlxuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0ge307XG5cbiAgICAgICAgICAgICRmaWx0ZXIuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gJCh0aGlzKS5kYXRhKCdjb2x1bW5OYW1lJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gJ2NoZWNrYm94JyB8fCBjb2x1bW5OYW1lID09PSAnYWN0aW9ucycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gbW9kdWxlLmJpbmRpbmdzW2NvbHVtbk5hbWVdLmdldCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcltjb2x1bW5OYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oYCR7Y29sdW1uTmFtZX06bmFtZWApLnNlYXJjaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKGAke2NvbHVtbk5hbWV9Om5hbWVgKS5zZWFyY2goJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdpbnZvaWNlc19vdmVydmlld19maWx0ZXI6Y2hhbmdlJywgW2ZpbHRlcl0pO1xuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFJlc2V0IEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBSZXNldCB0aGUgZmlsdGVyIGZvcm0gYW5kIHJlbG9hZCB0aGUgdGFibGUgZGF0YSB3aXRob3V0IGZpbHRlcmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblJlc2V0RmlsdGVyc0NsaWNrKCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHZhbHVlcyBmcm9tIHRoZSBpbnB1dCBib3hlcy5cbiAgICAgICAgICAgICRmaWx0ZXIuZmluZCgnaW5wdXQsIHNlbGVjdCcpLm5vdCgnLmxlbmd0aCcpLnZhbCgnJyk7XG4gICAgICAgICAgICAkZmlsdGVyLmZpbmQoJ3NlbGVjdCcpLm5vdCgnLmxlbmd0aCcpLm11bHRpX3NlbGVjdCgncmVmcmVzaCcpO1xuXG4gICAgICAgICAgICAvLyBSZXNldCB0aGUgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbnMoKS5zZWFyY2goJycpLmRyYXcoKTtcblxuICAgICAgICAgICAgLy8gVHJpZ2dlciBFdmVudFxuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignaW52b2ljZXNfb3ZlcnZpZXdfZmlsdGVyOmNoYW5nZScsIFt7fV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5IHRoZSBmaWx0ZXJzIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgRW50ZXIga2V5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbklucHV0VGV4dEtleVVwKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IEVOVEVSX0tFWV9DT0RFKSB7XG4gICAgICAgICAgICAgICAgJGZpbHRlci5maW5kKCcuYXBwbHktZmlsdGVycycpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUGFyc2UgdGhlIGluaXRpYWwgZmlsdGVyaW5nIHBhcmFtZXRlcnMgYW5kIGFwcGx5IHRoZW0gdG8gdGhlIHRhYmxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3BhcnNlRmlsdGVyaW5nUGFyYW1ldGVycygpIHtcbiAgICAgICAgICAgIGNvbnN0IHtmaWx0ZXJ9ID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIGZpbHRlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGZpbHRlcltuYW1lXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmJpbmRpbmdzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tuYW1lXS5zZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBOb3JtYWxpemUgYXJyYXkgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQnkgZGVmYXVsdCBkYXRhdGFibGVzIHdpbGwgY29uY2F0ZW5hdGUgYXJyYXkgc2VhcmNoIHZhbHVlcyBpbnRvIGEgc3RyaW5nIHNlcGFyYXRlZCB3aXRoIFwiLFwiIGNvbW1hcy4gVGhpc1xuICAgICAgICAgKiBpcyBub3QgYWNjZXB0YWJsZSB0aG91Z2ggYmVjYXVzZSBzb21lIGZpbHRlcmluZyBlbGVtZW50cyBtYXkgY29udGFpbiB2YWx1ZXMgd2l0aCBjb21tYSBhbmQgdGh1cyB0aGUgYXJyYXlcbiAgICAgICAgICogY2Fubm90IGJlIHBhcnNlZCBmcm9tIGJhY2tlbmQuIFRoaXMgbWV0aG9kIHdpbGwgcmVzZXQgdGhvc2UgY2FzZXMgYmFjayB0byBhcnJheXMgZm9yIGEgY2xlYXJlciB0cmFuc2FjdGlvblxuICAgICAgICAgKiB3aXRoIHRoZSBiYWNrZW5kLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtEYXRhVGFibGVzLlNldHRpbmdzfSBzZXR0aW5ncyBEYXRhVGFibGVzIHNldHRpbmdzIG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgRGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIGluIGFuIG9iamVjdCBmb3JtLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX25vcm1hbGl6ZUFycmF5VmFsdWVzKGV2ZW50LCBzZXR0aW5ncywgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0ge307XG5cbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gbW9kdWxlLmJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBtb2R1bGUuYmluZGluZ3NbbmFtZV0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcltuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgaW4gZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uIG9mIGRhdGEuY29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkgPT09IGNvbHVtbi5uYW1lICYmIGZpbHRlcltlbnRyeV0uY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc2VhcmNoLnZhbHVlID0gZmlsdGVyW2VudHJ5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEFkZCBwdWJsaWMgbW9kdWxlIG1ldGhvZC5cbiAgICAgICAgICAgIF9hZGRQdWJsaWNNZXRob2QoKTtcblxuICAgICAgICAgICAgLy8gUGFyc2UgZmlsdGVyaW5nIEdFVCBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgX3BhcnNlRmlsdGVyaW5nUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgJGZpbHRlclxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAnaW5wdXQ6dGV4dCcsIF9vbklucHV0VGV4dEtleVVwKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmFwcGx5LWZpbHRlcnMnLCBfb25BcHBseUZpbHRlcnNDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5yZXNldC1maWx0ZXJzJywgX29uUmVzZXRGaWx0ZXJzQ2xpY2spO1xuXG4gICAgICAgICAgICAkdGhpcy5vbigncHJlWGhyLmR0JywgX25vcm1hbGl6ZUFycmF5VmFsdWVzKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
