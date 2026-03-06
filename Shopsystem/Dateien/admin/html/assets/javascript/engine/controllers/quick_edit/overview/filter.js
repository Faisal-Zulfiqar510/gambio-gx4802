'use strict';

/* --------------------------------------------------------------
 filter.js 2016-10-19
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the QuickEdit table filtering.
 *
 * ### Methods
 *
 * **Reload Filtering Options**
 *
 * ```
 * // Reload the filter options with an AJAX request (optionally provide a second parameter for the AJAX URL).
 * $('.table-main').quick_edit_filter('reload');
 * ```
 */
gx.controllers.module('filter', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', jse.source + '/vendor/sumoselect/jquery.sumoselect.min.js', jse.source + '/vendor/sumoselect/sumoselect.min.css'], function (data) {

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
     * Reload filter options with an AJAX request.
     *
     * This function implements the $('.datatable').quick_edit_filter('reload') which will reload the filtering
     * "multi_select" instances will new options. It must be used after some table data are changed and the filtering
     * options need to be updated.
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
     * Add public "quick_edit_filter" method to jQuery in order.
     */
    function _addPublicMethod() {
        if ($.fn.quick_edit_filter) {
            return;
        }

        $.fn.extend({
            quick_edit_filter: function quick_edit_filter(action) {
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

        $this.trigger('quick_edit_filter:change', [filter]);
        $this.DataTable().draw();
    }

    /**
     * On Reset Button Click
     *
     * Reset the filter form and reload the table data without filtering.
     */
    function _onResetFiltersClick() {
        // Remove values from the input boxes.
        $filter.find('input, select').not('.length, .select-page-mode').val('');
        $filter.find('select').not('.length, .select-page-mode').multi_select('refresh');

        // Reset the filtering values.
        $this.DataTable().columns().search('').draw();

        // Trigger Event
        $this.trigger('quick_edit_filter:change', [{}]);
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
        // Add public module method.
        _addPublicMethod();

        // Parse filtering GET parameters.
        _parseFilteringParameters();

        // Bind event handlers.
        $filter.on('keyup', 'input:text', _onInputTextKeyUp).on('click', '.apply-filters', _onApplyFiltersClick).on('click', '.reset-filters', _onResetFiltersClick);

        $('[data-multi_select-categoryinstance]').SumoSelect({
            placeholder: jse.core.lang.translate('SELECT', 'general'),
            csvDispCount: 2,
            captionFormat: '{0} ' + jse.core.lang.translate('selected', 'admin_labels'),
            locale: ['OK', jse.core.lang.translate('CANCEL', 'general'), jse.core.lang.translate('SELECT_ALL', 'general')],
            search: true,
            searchText: jse.core.lang.translate('SEARCH', 'admin_quick_edit') + ' ...',
            noMatch: jse.core.lang.translate('NO_RESULTS_FOR', 'admin_quick_edit') + ' "{0}"'
        });

        $this.on('preXhr.dt', _normalizeArrayValues);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvZmlsdGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiRU5URVJfS0VZX0NPREUiLCIkdGhpcyIsIiQiLCIkZmlsdGVyIiwiZmluZCIsImJpbmRpbmdzIiwiZWFjaCIsImNvbHVtbk5hbWUiLCJmaXJzdCIsIl9yZWxvYWQiLCJ1cmwiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwicGFnZVRva2VuIiwiZ2V0SlNPTiIsImRvbmUiLCJyZXNwb25zZSIsImNvbHVtbiIsIiRzZWxlY3QiLCJjdXJyZW50VmFsdWVCYWNrdXAiLCJ2YWwiLCJsZW5ndGgiLCJlbXB0eSIsIm9wdGlvbiIsImFwcGVuZCIsIk9wdGlvbiIsInRleHQiLCJ2YWx1ZSIsIm11bHRpX3NlbGVjdCIsIl9hZGRQdWJsaWNNZXRob2QiLCJmbiIsInF1aWNrX2VkaXRfZmlsdGVyIiwiZXh0ZW5kIiwiYWN0aW9uIiwiYXJncyIsImFwcGx5IiwiX29uQXBwbHlGaWx0ZXJzQ2xpY2siLCJmaWx0ZXIiLCJEYXRhVGFibGUiLCJzZWFyY2giLCJ0cmlnZ2VyIiwiZHJhdyIsIl9vblJlc2V0RmlsdGVyc0NsaWNrIiwibm90IiwiY29sdW1ucyIsIl9vbklucHV0VGV4dEtleVVwIiwiZXZlbnQiLCJ3aGljaCIsIl9wYXJzZUZpbHRlcmluZ1BhcmFtZXRlcnMiLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJzbGljZSIsIm5hbWUiLCJzZXQiLCJfbm9ybWFsaXplQXJyYXlWYWx1ZXMiLCJzZXR0aW5ncyIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJlbnRyeSIsImluaXQiLCJvbiIsIlN1bW9TZWxlY3QiLCJwbGFjZWhvbGRlciIsImxhbmciLCJ0cmFuc2xhdGUiLCJjc3ZEaXNwQ291bnQiLCJjYXB0aW9uRm9ybWF0IiwibG9jYWxlIiwic2VhcmNoVGV4dCIsIm5vTWF0Y2giXSwibWFwcGluZ3MiOiI7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LElBREksRUFFSnhFLElBQUljLElBQUosQ0FBU3NELElBQVQsQ0FBY0MsU0FBZCxDQUF3QixRQUF4QixFQUFrQyxTQUFsQyxDQUZJLEVBR0pyRSxJQUFJYyxJQUFKLENBQVNzRCxJQUFULENBQWNDLFNBQWQsQ0FBd0IsWUFBeEIsRUFBc0MsU0FBdEMsQ0FISSxDQUp5QztBQVNqRDFCLG9CQUFRLElBVHlDO0FBVWpEOEIsd0JBQVl6RSxJQUFJYyxJQUFKLENBQVNzRCxJQUFULENBQWNDLFNBQWQsQ0FBd0IsUUFBeEIsRUFBa0Msa0JBQWxDLElBQXdELE1BVm5CO0FBV2pESyxxQkFBUzFFLElBQUljLElBQUosQ0FBU3NELElBQVQsQ0FBY0MsU0FBZCxDQUF3QixnQkFBeEIsRUFBMEMsa0JBQTFDLElBQWdFO0FBWHhCLFNBQXJEOztBQWNBakUsY0FBTTZELEVBQU4sQ0FBUyxXQUFULEVBQXNCTixxQkFBdEI7O0FBRUF4QztBQUNILEtBOUJEOztBQWdDQSxXQUFPcEIsTUFBUDtBQUNILENBdFFMIiwiZmlsZSI6InF1aWNrX2VkaXQvb3ZlcnZpZXcvZmlsdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBmaWx0ZXIuanMgMjAxNi0xMC0xOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogSGFuZGxlcyB0aGUgUXVpY2tFZGl0IHRhYmxlIGZpbHRlcmluZy5cbiAqXG4gKiAjIyMgTWV0aG9kc1xuICpcbiAqICoqUmVsb2FkIEZpbHRlcmluZyBPcHRpb25zKipcbiAqXG4gKiBgYGBcbiAqIC8vIFJlbG9hZCB0aGUgZmlsdGVyIG9wdGlvbnMgd2l0aCBhbiBBSkFYIHJlcXVlc3QgKG9wdGlvbmFsbHkgcHJvdmlkZSBhIHNlY29uZCBwYXJhbWV0ZXIgZm9yIHRoZSBBSkFYIFVSTCkuXG4gKiAkKCcudGFibGUtbWFpbicpLnF1aWNrX2VkaXRfZmlsdGVyKCdyZWxvYWQnKTtcbiAqIGBgYFxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2ZpbHRlcicsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9qcXVlcnktZGVwYXJhbS9qcXVlcnktZGVwYXJhbS5taW4uanNgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9qcXVlcnkuc3Vtb3NlbGVjdC5taW4uanNgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9zdW1vc2VsZWN0Lm1pbi5jc3NgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudGVyIEtleSBDb2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdGVyIFJvdyBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGZpbHRlciA9ICR0aGlzLmZpbmQoJ3RyLmZpbHRlcicpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHtiaW5kaW5nczoge319O1xuXG4gICAgICAgIC8vIER5bmFtaWNhbGx5IGRlZmluZSB0aGUgZmlsdGVyIHJvdyBkYXRhLWJpbmRpbmdzLlxuICAgICAgICAkZmlsdGVyLmZpbmQoJ3RoJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gJCh0aGlzKS5kYXRhKCdjb2x1bW5OYW1lJyk7XG5cbiAgICAgICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnY2hlY2tib3gnIHx8IGNvbHVtbk5hbWUgPT09ICdhY3Rpb25zJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb2R1bGUuYmluZGluZ3NbY29sdW1uTmFtZV0gPSAkKHRoaXMpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS5maXJzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWxvYWQgZmlsdGVyIG9wdGlvbnMgd2l0aCBhbiBBSkFYIHJlcXVlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gaW1wbGVtZW50cyB0aGUgJCgnLmRhdGF0YWJsZScpLnF1aWNrX2VkaXRfZmlsdGVyKCdyZWxvYWQnKSB3aGljaCB3aWxsIHJlbG9hZCB0aGUgZmlsdGVyaW5nXG4gICAgICAgICAqIFwibXVsdGlfc2VsZWN0XCIgaW5zdGFuY2VzIHdpbGwgbmV3IG9wdGlvbnMuIEl0IG11c3QgYmUgdXNlZCBhZnRlciBzb21lIHRhYmxlIGRhdGEgYXJlIGNoYW5nZWQgYW5kIHRoZSBmaWx0ZXJpbmdcbiAgICAgICAgICogb3B0aW9ucyBuZWVkIHRvIGJlIHVwZGF0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgT3B0aW9uYWwsIHRoZSBVUkwgdG8gYmUgdXNlZCBmb3IgZmV0Y2hpbmcgdGhlIG9wdGlvbnMuIERvIG5vdCBhZGQgdGhlIFwicGFnZVRva2VuXCJcbiAgICAgICAgICogcGFyYW1ldGVyIHRvIFVSTCwgaXQgd2lsbCBiZSBhcHBlbmRlZCBpbiB0aGlzIG1ldGhvZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9yZWxvYWQodXJsKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwgfHwganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRPdmVydmlld0FqYXgvRmlsdGVyT3B0aW9ucyc7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge3BhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyl9O1xuXG4gICAgICAgICAgICAkLmdldEpTT04odXJsLCBkYXRhKS5kb25lKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBpbiByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkc2VsZWN0ID0gJGZpbHRlci5maW5kKCcuU3Vtb1NlbGVjdCA+IHNlbGVjdC4nICsgY29sdW1uKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlQmFja3VwID0gJHNlbGVjdC52YWwoKTsgLy8gV2lsbCB0cnkgdG8gc2V0IGl0IGJhY2sgaWYgaXQgc3RpbGwgZXhpc3RzLlxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghJHNlbGVjdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgLy8gVGhlIHNlbGVjdCBlbGVtZW50IHdhcyBub3QgZm91bmQuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmVtcHR5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgb3B0aW9uIG9mIHJlc3BvbnNlW2NvbHVtbl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3QuYXBwZW5kKG5ldyBPcHRpb24ob3B0aW9uLnRleHQsIG9wdGlvbi52YWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWx1ZUJhY2t1cCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC52YWwoY3VycmVudFZhbHVlQmFja3VwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3QubXVsdGlfc2VsZWN0KCdyZWZyZXNoJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIHB1YmxpYyBcInF1aWNrX2VkaXRfZmlsdGVyXCIgbWV0aG9kIHRvIGpRdWVyeSBpbiBvcmRlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9hZGRQdWJsaWNNZXRob2QoKSB7XG4gICAgICAgICAgICBpZiAoJC5mbi5xdWlja19lZGl0X2ZpbHRlcikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5mbi5leHRlbmQoe1xuICAgICAgICAgICAgICAgIHF1aWNrX2VkaXRfZmlsdGVyOiBmdW5jdGlvbiAoYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaCh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3JlbG9hZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWxvYWQuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBGaWx0ZXIgQnV0dG9uIENsaWNrXG4gICAgICAgICAqXG4gICAgICAgICAqIEFwcGx5IHRoZSBwcm92aWRlZCBmaWx0ZXJzIGFuZCB1cGRhdGUgdGhlIHRhYmxlIHJvd3MuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25BcHBseUZpbHRlcnNDbGljaygpIHtcbiAgICAgICAgICAgIC8vIFByZXBhcmUgdGhlIG9iamVjdCB3aXRoIHRoZSBmaW5hbCBmaWx0ZXJpbmcgZGF0YS5cbiAgICAgICAgICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuXG4gICAgICAgICAgICAkZmlsdGVyLmZpbmQoJ3RoJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uTmFtZSA9ICQodGhpcykuZGF0YSgnY29sdW1uTmFtZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IG1vZHVsZS5iaW5kaW5nc1tjb2x1bW5OYW1lXS5nZXQoKTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJbY29sdW1uTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKGAke2NvbHVtbk5hbWV9Om5hbWVgKS5zZWFyY2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbihgJHtjb2x1bW5OYW1lfTpuYW1lYCkuc2VhcmNoKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcigncXVpY2tfZWRpdF9maWx0ZXI6Y2hhbmdlJywgW2ZpbHRlcl0pO1xuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFJlc2V0IEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBSZXNldCB0aGUgZmlsdGVyIGZvcm0gYW5kIHJlbG9hZCB0aGUgdGFibGUgZGF0YSB3aXRob3V0IGZpbHRlcmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblJlc2V0RmlsdGVyc0NsaWNrKCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHZhbHVlcyBmcm9tIHRoZSBpbnB1dCBib3hlcy5cbiAgICAgICAgICAgICRmaWx0ZXIuZmluZCgnaW5wdXQsIHNlbGVjdCcpLm5vdCgnLmxlbmd0aCwgLnNlbGVjdC1wYWdlLW1vZGUnKS52YWwoJycpO1xuICAgICAgICAgICAgJGZpbHRlci5maW5kKCdzZWxlY3QnKS5ub3QoJy5sZW5ndGgsIC5zZWxlY3QtcGFnZS1tb2RlJykubXVsdGlfc2VsZWN0KCdyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBmaWx0ZXJpbmcgdmFsdWVzLlxuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1ucygpLnNlYXJjaCgnJykuZHJhdygpO1xuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIEV2ZW50XG4gICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdxdWlja19lZGl0X2ZpbHRlcjpjaGFuZ2UnLCBbe31dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBseSB0aGUgZmlsdGVycyB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIEVudGVyIGtleS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25JbnB1dFRleHRLZXlVcChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBFTlRFUl9LRVlfQ09ERSkge1xuICAgICAgICAgICAgICAgICRmaWx0ZXIuZmluZCgnLmFwcGx5LWZpbHRlcnMnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhcnNlIHRoZSBpbml0aWFsIGZpbHRlcmluZyBwYXJhbWV0ZXJzIGFuZCBhcHBseSB0aGVtIHRvIHRoZSB0YWJsZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9wYXJzZUZpbHRlcmluZ1BhcmFtZXRlcnMoKSB7XG4gICAgICAgICAgICBjb25zdCB7ZmlsdGVyfSA9ICQuZGVwYXJhbSh3aW5kb3cubG9jYXRpb24uc2VhcmNoLnNsaWNlKDEpKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZpbHRlcltuYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUuYmluZGluZ3NbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmJpbmRpbmdzW25hbWVdLnNldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE5vcm1hbGl6ZSBhcnJheSBmaWx0ZXJpbmcgdmFsdWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBCeSBkZWZhdWx0IGRhdGF0YWJsZXMgd2lsbCBjb25jYXRlbmF0ZSBhcnJheSBzZWFyY2ggdmFsdWVzIGludG8gYSBzdHJpbmcgc2VwYXJhdGVkIHdpdGggXCIsXCIgY29tbWFzLiBUaGlzXG4gICAgICAgICAqIGlzIG5vdCBhY2NlcHRhYmxlIHRob3VnaCBiZWNhdXNlIHNvbWUgZmlsdGVyaW5nIGVsZW1lbnRzIG1heSBjb250YWluIHZhbHVlcyB3aXRoIGNvbW1hIGFuZCB0aHVzIHRoZSBhcnJheVxuICAgICAgICAgKiBjYW5ub3QgYmUgcGFyc2VkIGZyb20gYmFja2VuZC4gVGhpcyBtZXRob2Qgd2lsbCByZXNldCB0aG9zZSBjYXNlcyBiYWNrIHRvIGFycmF5cyBmb3IgYSBjbGVhcmVyIHRyYW5zYWN0aW9uXG4gICAgICAgICAqIHdpdGggdGhlIGJhY2tlbmQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge0RhdGFUYWJsZXMuU2V0dGluZ3N9IHNldHRpbmdzIERhdGFUYWJsZXMgc2V0dGluZ3Mgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBEYXRhIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIgaW4gYW4gb2JqZWN0IGZvcm0uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfbm9ybWFsaXplQXJyYXlWYWx1ZXMoZXZlbnQsIHNldHRpbmdzLCBkYXRhKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBtb2R1bGUuYmluZGluZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG1vZHVsZS5iaW5kaW5nc1tuYW1lXS5nZXQoKTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBlbnRyeSBpbiBmaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gb2YgZGF0YS5jb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbnRyeSA9PT0gY29sdW1uLm5hbWUgJiYgZmlsdGVyW2VudHJ5XS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbi5zZWFyY2gudmFsdWUgPSBmaWx0ZXJbZW50cnldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gQWRkIHB1YmxpYyBtb2R1bGUgbWV0aG9kLlxuICAgICAgICAgICAgX2FkZFB1YmxpY01ldGhvZCgpO1xuXG4gICAgICAgICAgICAvLyBQYXJzZSBmaWx0ZXJpbmcgR0VUIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICBfcGFyc2VGaWx0ZXJpbmdQYXJhbWV0ZXJzKCk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgZXZlbnQgaGFuZGxlcnMuXG4gICAgICAgICAgICAkZmlsdGVyXG4gICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsICdpbnB1dDp0ZXh0JywgX29uSW5wdXRUZXh0S2V5VXApXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYXBwbHktZmlsdGVycycsIF9vbkFwcGx5RmlsdGVyc0NsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnJlc2V0LWZpbHRlcnMnLCBfb25SZXNldEZpbHRlcnNDbGljayk7XG5cbiAgICAgICAgICAgICQoJ1tkYXRhLW11bHRpX3NlbGVjdC1jYXRlZ29yeWluc3RhbmNlXScpLlN1bW9TZWxlY3Qoe1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU0VMRUNUJywgJ2dlbmVyYWwnKSxcbiAgICAgICAgICAgICAgICBjc3ZEaXNwQ291bnQ6IDIsXG4gICAgICAgICAgICAgICAgY2FwdGlvbkZvcm1hdDogYHswfSAke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzZWxlY3RlZCcsICdhZG1pbl9sYWJlbHMnKX1gLFxuICAgICAgICAgICAgICAgIGxvY2FsZTogW1xuICAgICAgICAgICAgICAgICAgICAnT0snLFxuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQ0FOQ0VMJywgJ2dlbmVyYWwnKSxcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NFTEVDVF9BTEwnLCAnZ2VuZXJhbCcpXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBzZWFyY2g6IHRydWUsXG4gICAgICAgICAgICAgICAgc2VhcmNoVGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NFQVJDSCcsICdhZG1pbl9xdWlja19lZGl0JykgKyAnIC4uLicsXG4gICAgICAgICAgICAgICAgbm9NYXRjaDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ05PX1JFU1VMVFNfRk9SJywgJ2FkbWluX3F1aWNrX2VkaXQnKSArICcgXCJ7MH1cIidcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy5vbigncHJlWGhyLmR0JywgX25vcm1hbGl6ZUFycmF5VmFsdWVzKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
