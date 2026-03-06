'use strict';

/* --------------------------------------------------------------
 special_price_filter.js 2016-12-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 *  Special Prices Table Filter controller
 *
 * Handles the QuickEdit special prices table filtering.
 *
 * ### Methods
 *
 * **Reload Filtering Options**
 *
 * ```
 * // Reload the filter options with an AJAX request (optionally provide a second parameter for the AJAX URL).
 * $('.table-main').quick_edit_special_price_filter('reload');
 * ```
 */
gx.controllers.module('special_prices_filter', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', 'loading_spinner'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Enter Key Code
     *
     * @type {Number}
     */

    var ENTER_KEY_CODE = 13; // ENTER

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
    var $filter = $this.find('tr.special-price-filter');

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
     * Reload filter options with an AJAX request.
     *
     * This function implements the $('.datatable').quick_edit_special_price_filter('reload') which will reload the
     * filtering "multi_select" instances will new options. It must be used after some table data are changed and the
     * filtering options need to be updated.
     *
     * @param {String} url Optional, the URL to be used for fetching the options. Do not add the "pageToken"
     * parameter to URL, it will be appended in this method.
     */
    function _reload(url) {
        url = url || jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/FilterOptions';
        var data = { pageToken: jse.core.config.get('pageToken') };

        $.getJSON(url, data).done(function (response) {
            for (var column in response) {
                var $select = $filter.find('.SumoSelect > select.' + column);
                var currentValueBackup = $select.val();

                if (!$select.length) {
                    return;
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
     * Add public "quick_edit_special_price_filter" method to jQuery in order.
     */
    function _addPublicMethod() {
        if ($.fn.quick_edit_special_price_filter) {
            return;
        }

        $.fn.extend({
            quick_edit_special_price_filter: function quick_edit_special_price_filter(action) {
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

        $this.trigger('quick_edit_special_price_filter:change', [filter]);
        $this.DataTable().draw();
    }

    /**
     * On Reset Button Click
     *
     * Reset the filter form and reload the table data without filtering.
     */
    function _onResetFiltersClick() {
        $filter.find('input, select').not('.length, .select-page-mode').val('');
        $filter.find('select').not('.length, .select-page-mode').multi_select('refresh');
        $this.DataTable().columns().search('').draw();
        $this.trigger('quick_edit_special_price_filter:change', [{}]);
    }

    /**
     * Apply the filters when the user presses the Enter key.
     *
     * @param {jQuery.Event} event
     */
    function _onInputTextKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $filter.find('.apply-special-price-filters').trigger('click');
        }
    }

    /**
     * Parse the initial filtering parameters and apply them to the table.
     */
    function _parseFilteringParameters() {
        var _$$deparam = $.deparam(window.location.search.slice(1)),
            filter = _$$deparam.filter;

        for (var name in filter) {
            var value = filter[name];

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
        _addPublicMethod();
        _parseFilteringParameters();

        $filter.on('keyup', 'input:text', _onInputTextKeyUp).on('click', '.apply-special-price-filters', _onApplyFiltersClick);

        $filter.parents('.special-prices.modal').on('click', 'button.reset-special-price-filters', _onResetFiltersClick);

        $this.on('preXhr.dt', _normalizeArrayValues);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3NwZWNpYWxfcHJpY2VzL3NwZWNpYWxfcHJpY2VzX2ZpbHRlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIkVOVEVSX0tFWV9DT0RFIiwiJHRoaXMiLCIkIiwiJGZpbHRlciIsImZpbmQiLCJiaW5kaW5ncyIsImVhY2giLCJjb2x1bW5OYW1lIiwiZmlyc3QiLCJfcmVsb2FkIiwidXJsIiwiY29yZSIsImNvbmZpZyIsImdldCIsInBhZ2VUb2tlbiIsImdldEpTT04iLCJkb25lIiwicmVzcG9uc2UiLCJjb2x1bW4iLCIkc2VsZWN0IiwiY3VycmVudFZhbHVlQmFja3VwIiwidmFsIiwibGVuZ3RoIiwiZW1wdHkiLCJvcHRpb24iLCJhcHBlbmQiLCJPcHRpb24iLCJ0ZXh0IiwidmFsdWUiLCJtdWx0aV9zZWxlY3QiLCJfYWRkUHVibGljTWV0aG9kIiwiZm4iLCJxdWlja19lZGl0X3NwZWNpYWxfcHJpY2VfZmlsdGVyIiwiZXh0ZW5kIiwiYWN0aW9uIiwiYXJncyIsImFwcGx5IiwiX29uQXBwbHlGaWx0ZXJzQ2xpY2siLCJmaWx0ZXIiLCJEYXRhVGFibGUiLCJzZWFyY2giLCJ0cmlnZ2VyIiwiZHJhdyIsIl9vblJlc2V0RmlsdGVyc0NsaWNrIiwibm90IiwiY29sdW1ucyIsIl9vbklucHV0VGV4dEtleVVwIiwiZXZlbnQiLCJ3aGljaCIsIl9wYXJzZUZpbHRlcmluZ1BhcmFtZXRlcnMiLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJzbGljZSIsIm5hbWUiLCJzZXQiLCJfbm9ybWFsaXplQXJyYXlWYWx1ZXMiLCJzZXR0aW5ncyIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJlbnRyeSIsImluaXQiLCJvbiIsInBhcmVudHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7QUFjQUEsR0FBR0MsV0FBSCxDQUFlQyxN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QUFBQTs7QUFBQTtBQUN0QixzQ0FBbUJ2QyxLQUFLOEMsT0FBeEIsbUlBQWlDO0FBQUEsd0JBQXhCM0IsTUFBd0I7O0FBQzdCLHdCQUFJMEMsVUFBVTFDLE9BQU9vQyxJQUFqQixJQUF5QmhCLE9BQU9zQixLQUFQLEVBQWNGLFdBQWQsS0FBOEJDLEtBQTNELEVBQWtFO0FBQzlEekMsK0JBQU9zQixNQUFQLENBQWNaLEtBQWQsR0FBc0JVLE9BQU9zQixLQUFQLENBQXRCO0FBQ0E7QUFDSDtBQUNKO0FBTnFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPekI7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFoRSxXQUFPaUUsSUFBUCxHQUFjLFVBQVU3QyxJQUFWLEVBQWdCO0FBQzFCYztBQUNBbUI7O0FBRUE5QyxnQkFDSzJELEVBREwsQ0FDUSxPQURSLEVBQ2lCLFlBRGpCLEVBQytCaEIsaUJBRC9CLEVBRUtnQixFQUZMLENBRVEsT0FGUixFQUVpQiw4QkFGakIsRUFFaUR6QixvQkFGakQ7O0FBSUFsQyxnQkFBUTRELE9BQVIsQ0FBZ0IsdUJBQWhCLEVBQ0tELEVBREwsQ0FDUSxPQURSLEVBQ2lCLG9DQURqQixFQUN1RG5CLG9CQUR2RDs7QUFHQTFDLGNBQU02RCxFQUFOLENBQVMsV0FBVCxFQUFzQk4scUJBQXRCOztBQUVBeEM7QUFDSCxLQWREOztBQWdCQSxXQUFPcEIsTUFBUDtBQUNILENBL09MIiwiZmlsZSI6InF1aWNrX2VkaXQvbW9kYWxzL3NwZWNpYWxfcHJpY2VzL3NwZWNpYWxfcHJpY2VzX2ZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3BlY2lhbF9wcmljZV9maWx0ZXIuanMgMjAxNi0xMi0yMFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIFNwZWNpYWwgUHJpY2VzIFRhYmxlIEZpbHRlciBjb250cm9sbGVyXG4gKlxuICogSGFuZGxlcyB0aGUgUXVpY2tFZGl0IHNwZWNpYWwgcHJpY2VzIHRhYmxlIGZpbHRlcmluZy5cbiAqXG4gKiAjIyMgTWV0aG9kc1xuICpcbiAqICoqUmVsb2FkIEZpbHRlcmluZyBPcHRpb25zKipcbiAqXG4gKiBgYGBcbiAqIC8vIFJlbG9hZCB0aGUgZmlsdGVyIG9wdGlvbnMgd2l0aCBhbiBBSkFYIHJlcXVlc3QgKG9wdGlvbmFsbHkgcHJvdmlkZSBhIHNlY29uZCBwYXJhbWV0ZXIgZm9yIHRoZSBBSkFYIFVSTCkuXG4gKiAkKCcudGFibGUtbWFpbicpLnF1aWNrX2VkaXRfc3BlY2lhbF9wcmljZV9maWx0ZXIoJ3JlbG9hZCcpO1xuICogYGBgXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc3BlY2lhbF9wcmljZXNfZmlsdGVyJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS1kZXBhcmFtL2pxdWVyeS1kZXBhcmFtLm1pbi5qc2AsXG4gICAgICAgICdsb2FkaW5nX3NwaW5uZXInXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudGVyIEtleSBDb2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzOyAvLyBFTlRFUlxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdGVyIFJvdyBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGZpbHRlciA9ICR0aGlzLmZpbmQoJ3RyLnNwZWNpYWwtcHJpY2UtZmlsdGVyJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge2JpbmRpbmdzOiB7fX07XG5cbiAgICAgICAgLy8gRHluYW1pY2FsbHkgZGVmaW5lIHRoZSBmaWx0ZXIgcm93IGRhdGEtYmluZGluZ3MuXG4gICAgICAgICRmaWx0ZXIuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tjb2x1bW5OYW1lXSA9ICQodGhpcykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLmZpcnN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbG9hZCBmaWx0ZXIgb3B0aW9ucyB3aXRoIGFuIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBpbXBsZW1lbnRzIHRoZSAkKCcuZGF0YXRhYmxlJykucXVpY2tfZWRpdF9zcGVjaWFsX3ByaWNlX2ZpbHRlcigncmVsb2FkJykgd2hpY2ggd2lsbCByZWxvYWQgdGhlXG4gICAgICAgICAqIGZpbHRlcmluZyBcIm11bHRpX3NlbGVjdFwiIGluc3RhbmNlcyB3aWxsIG5ldyBvcHRpb25zLiBJdCBtdXN0IGJlIHVzZWQgYWZ0ZXIgc29tZSB0YWJsZSBkYXRhIGFyZSBjaGFuZ2VkIGFuZCB0aGVcbiAgICAgICAgICogZmlsdGVyaW5nIG9wdGlvbnMgbmVlZCB0byBiZSB1cGRhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIE9wdGlvbmFsLCB0aGUgVVJMIHRvIGJlIHVzZWQgZm9yIGZldGNoaW5nIHRoZSBvcHRpb25zLiBEbyBub3QgYWRkIHRoZSBcInBhZ2VUb2tlblwiXG4gICAgICAgICAqIHBhcmFtZXRlciB0byBVUkwsIGl0IHdpbGwgYmUgYXBwZW5kZWQgaW4gdGhpcyBtZXRob2QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVsb2FkKHVybCkge1xuICAgICAgICAgICAgdXJsID0gdXJsIHx8IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89UXVpY2tFZGl0T3ZlcnZpZXdBamF4L0ZpbHRlck9wdGlvbnMnO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpfTtcblxuICAgICAgICAgICAgJC5nZXRKU09OKHVybCwgZGF0YSkuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRmaWx0ZXIuZmluZCgnLlN1bW9TZWxlY3QgPiBzZWxlY3QuJyArIGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUJhY2t1cCA9ICRzZWxlY3QudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2VsZWN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5lbXB0eSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9wdGlvbiBvZiByZXNwb25zZVtjb2x1bW5dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZChuZXcgT3B0aW9uKG9wdGlvbi50ZXh0LCBvcHRpb24udmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWVCYWNrdXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3QudmFsKGN1cnJlbnRWYWx1ZUJhY2t1cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0Lm11bHRpX3NlbGVjdCgncmVmcmVzaCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBwdWJsaWMgXCJxdWlja19lZGl0X3NwZWNpYWxfcHJpY2VfZmlsdGVyXCIgbWV0aG9kIHRvIGpRdWVyeSBpbiBvcmRlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9hZGRQdWJsaWNNZXRob2QoKSB7XG4gICAgICAgICAgICBpZiAoJC5mbi5xdWlja19lZGl0X3NwZWNpYWxfcHJpY2VfZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmZuLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgcXVpY2tfZWRpdF9zcGVjaWFsX3ByaWNlX2ZpbHRlcjogZnVuY3Rpb24gKGFjdGlvbiwgLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2godGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyZWxvYWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVsb2FkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gRmlsdGVyIEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBBcHBseSB0aGUgcHJvdmlkZWQgZmlsdGVycyBhbmQgdXBkYXRlIHRoZSB0YWJsZSByb3dzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQXBwbHlGaWx0ZXJzQ2xpY2soKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgJGZpbHRlci5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnY2hlY2tib3gnIHx8IGNvbHVtbk5hbWUgPT09ICdhY3Rpb25zJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBtb2R1bGUuYmluZGluZ3NbY29sdW1uTmFtZV0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW2NvbHVtbk5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbihgJHtjb2x1bW5OYW1lfTpuYW1lYCkuc2VhcmNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oYCR7Y29sdW1uTmFtZX06bmFtZWApLnNlYXJjaCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3F1aWNrX2VkaXRfc3BlY2lhbF9wcmljZV9maWx0ZXI6Y2hhbmdlJywgW2ZpbHRlcl0pO1xuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFJlc2V0IEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBSZXNldCB0aGUgZmlsdGVyIGZvcm0gYW5kIHJlbG9hZCB0aGUgdGFibGUgZGF0YSB3aXRob3V0IGZpbHRlcmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblJlc2V0RmlsdGVyc0NsaWNrKCkge1xuICAgICAgICAgICAgJGZpbHRlci5maW5kKCdpbnB1dCwgc2VsZWN0Jykubm90KCcubGVuZ3RoLCAuc2VsZWN0LXBhZ2UtbW9kZScpLnZhbCgnJyk7XG4gICAgICAgICAgICAkZmlsdGVyLmZpbmQoJ3NlbGVjdCcpLm5vdCgnLmxlbmd0aCwgLnNlbGVjdC1wYWdlLW1vZGUnKS5tdWx0aV9zZWxlY3QoJ3JlZnJlc2gnKTtcbiAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbnMoKS5zZWFyY2goJycpLmRyYXcoKTtcbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3F1aWNrX2VkaXRfc3BlY2lhbF9wcmljZV9maWx0ZXI6Y2hhbmdlJywgW3t9XSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwbHkgdGhlIGZpbHRlcnMgd2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBFbnRlciBrZXkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW5wdXRUZXh0S2V5VXAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gRU5URVJfS0VZX0NPREUpIHtcbiAgICAgICAgICAgICAgICAkZmlsdGVyLmZpbmQoJy5hcHBseS1zcGVjaWFsLXByaWNlLWZpbHRlcnMnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlIHRoZSBpbml0aWFsIGZpbHRlcmluZyBwYXJhbWV0ZXJzIGFuZCBhcHBseSB0aGVtIHRvIHRoZSB0YWJsZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9wYXJzZUZpbHRlcmluZ1BhcmFtZXRlcnMoKSB7XG4gICAgICAgICAgICBjb25zdCB7ZmlsdGVyfSA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlcltuYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUuYmluZGluZ3NbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmJpbmRpbmdzW25hbWVdLnNldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE5vcm1hbGl6ZSBhcnJheSBmaWx0ZXJpbmcgdmFsdWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBCeSBkZWZhdWx0IGRhdGF0YWJsZXMgd2lsbCBjb25jYXRlbmF0ZSBhcnJheSBzZWFyY2ggdmFsdWVzIGludG8gYSBzdHJpbmcgc2VwYXJhdGVkIHdpdGggXCIsXCIgY29tbWFzLiBUaGlzXG4gICAgICAgICAqIGlzIG5vdCBhY2NlcHRhYmxlIHRob3VnaCBiZWNhdXNlIHNvbWUgZmlsdGVyaW5nIGVsZW1lbnRzIG1heSBjb250YWluIHZhbHVlcyB3aXRoIGNvbW1hIGFuZCB0aHVzIHRoZSBhcnJheVxuICAgICAgICAgKiBjYW5ub3QgYmUgcGFyc2VkIGZyb20gYmFja2VuZC4gVGhpcyBtZXRob2Qgd2lsbCByZXNldCB0aG9zZSBjYXNlcyBiYWNrIHRvIGFycmF5cyBmb3IgYSBjbGVhcmVyIHRyYW5zYWN0aW9uXG4gICAgICAgICAqIHdpdGggdGhlIGJhY2tlbmQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge0RhdGFUYWJsZXMuU2V0dGluZ3N9IHNldHRpbmdzIERhdGFUYWJsZXMgc2V0dGluZ3Mgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBEYXRhIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgaW4gYW4gb2JqZWN0IGZvcm0uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfbm9ybWFsaXplQXJyYXlWYWx1ZXMoZXZlbnQsIHNldHRpbmdzLCBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBtb2R1bGUuYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG1vZHVsZS5iaW5kaW5nc1tuYW1lXS5nZXQoKTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBpbiBmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gb2YgZGF0YS5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeSA9PT0gY29sdW1uLm5hbWUgJiYgZmlsdGVyW2VudHJ5XS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbi5zZWFyY2gudmFsdWUgPSBmaWx0ZXJbZW50cnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgX2FkZFB1YmxpY01ldGhvZCgpO1xuICAgICAgICAgICAgX3BhcnNlRmlsdGVyaW5nUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICAkZmlsdGVyXG4gICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsICdpbnB1dDp0ZXh0JywgX29uSW5wdXRUZXh0S2V5VXApXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYXBwbHktc3BlY2lhbC1wcmljZS1maWx0ZXJzJywgX29uQXBwbHlGaWx0ZXJzQ2xpY2spO1xuXG4gICAgICAgICAgICAkZmlsdGVyLnBhcmVudHMoJy5zcGVjaWFsLXByaWNlcy5tb2RhbCcpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICdidXR0b24ucmVzZXQtc3BlY2lhbC1wcmljZS1maWx0ZXJzJywgX29uUmVzZXRGaWx0ZXJzQ2xpY2spO1xuXG4gICAgICAgICAgICAkdGhpcy5vbigncHJlWGhyLmR0JywgX25vcm1hbGl6ZUFycmF5VmFsdWVzKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
