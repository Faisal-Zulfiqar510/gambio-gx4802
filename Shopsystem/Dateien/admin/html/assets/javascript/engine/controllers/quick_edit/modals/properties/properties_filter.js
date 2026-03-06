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
 * Properties Filter Controller
 *
 * Handles the QuickEdit properties table filtering.
 *
 * ### Methods
 *
 * **Reload Filtering Options**
 *
 * ```
 * // Reload the filter options with an AJAX request (optionally provide a second parameter for the AJAX URL).
 * $('.table-main').quick_edit_properties_filter('reload');
 * ```
 */
gx.controllers.module('properties_filter', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', 'loading_spinner'], function (data) {

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
    var $filter = $this.find('tr.properties-filter');

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
     * This function implements the $('.datatable').quick_edit_properties_filter('reload') which will reload the filtering
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
     * Add public "quick_edit_properties_filter" method to jQuery in order.
     */
    function _addPublicMethod() {
        if ($.fn.quick_edit_properties_filter) {
            return;
        }

        $.fn.extend({
            quick_edit_properties_filter: function quick_edit_properties_filter(action) {
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

        $this.trigger('quick_edit_properties_filter:change', [filter]);
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
        $this.trigger('quick_edit_properties_filter:change', [{}]);
    }

    /**
     * Apply the filters when the user presses the Enter key.
     *
     * @param {jQuery.Event} event
     */
    function _onInputTextKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $filter.find('.apply-properties-filters').trigger('click');
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
        $filter.on('keyup', 'input:text', _onInputTextKeyUp).on('click', '.apply-properties-filters', _onApplyFiltersClick);

        $filter.parents('.properties.modal').on('click', 'button.reset-properties-filters', _onResetFiltersClick);

        $this.on('preXhr.dt', _normalizeArrayValues);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19maWx0ZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCJFTlRFUl9LRVlfQ09ERSIsIiR0aGlzIiwiJCIsIiRmaWx0ZXIiLCJmaW5kIiwiYmluZGluZ3MiLCJlYWNoIiwiY29sdW1uTmFtZSIsImZpcnN0IiwiX3JlbG9hZCIsInVybCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJwYWdlVG9rZW4iLCJnZXRKU09OIiwiZG9uZSIsInJlc3BvbnNlIiwiY29sdW1uIiwiJHNlbGVjdCIsImN1cnJlbnRWYWx1ZUJhY2t1cCIsInZhbCIsImxlbmd0aCIsImVtcHR5Iiwib3B0aW9uIiwiYXBwZW5kIiwiT3B0aW9uIiwidGV4dCIsInZhbHVlIiwibXVsdGlfc2VsZWN0IiwiX2FkZFB1YmxpY01ldGhvZCIsImZuIiwicXVpY2tfZWRpdF9wcm9wZXJ0aWVzX2ZpbHRlciIsImV4dGVuZCIsImFjdGlvbiIsImFyZ3MiLCJhcHBseSIsIl9vbkFwcGx5RmlsdGVyc0NsaWNrIiwiZmlsdGVyIiwiRGF0YVRhYmxlIiwic2VhcmNoIiwidHJpZ2dlciIsImRyYXciLCJfb25SZXNldEZpbHRlcnNDbGljayIsIm5vdCIsImNvbHVtbnMiLCJfb25JbnB1dFRleHRLZXlVcCIsImV2ZW50Iiwid2hpY2giLCJfcGFyc2VGaWx0ZXJpbmdQYXJhbWV0ZXJzIiwiZGVwYXJhbSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2xpY2UiLCJuYW1lIiwic2V0IiwiX25vcm1hbGl6ZUFycmF5VmFsdWVzIiwic2V0dGluZ3MiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwiZW50cnkiLCJpbml0Iiwib24iLCJwYXJlbnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7O0FBY0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLG1C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LEtBQVQsSUFBa0J0QixNQUFsQixFQUEwQjtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUN0QixzQ0FBbUJ2QyxLQUFLOEMsT0FBeEIsbUlBQWlDO0FBQUEsd0JBQXhCM0IsTUFBd0I7O0FBQzdCLHdCQUFJMEMsVUFBVTFDLE9BQU9vQyxJQUFqQixJQUF5QmhCLE9BQU9zQixLQUFQLEVBQWNGLFdBQWQsS0FBOEJDLEtBQTNELEVBQWtFO0FBQzlEekMsK0JBQU9zQixNQUFQLENBQWNaLEtBQWQsR0FBc0JVLE9BQU9zQixLQUFQLENBQXRCO0FBQ0E7QUFDSDtBQUNKO0FBTnFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPekI7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFoRSxXQUFPaUUsSUFBUCxHQUFjLFVBQVU3QyxJQUFWLEVBQWdCO0FBQzFCO0FBQ0FjOztBQUVBO0FBQ0FtQjs7QUFFQTtBQUNBOUMsZ0JBQ0syRCxFQURMLENBQ1EsT0FEUixFQUNpQixZQURqQixFQUMrQmhCLGlCQUQvQixFQUVLZ0IsRUFGTCxDQUVRLE9BRlIsRUFFaUIsMkJBRmpCLEVBRThDekIsb0JBRjlDOztBQUlBbEMsZ0JBQVE0RCxPQUFSLENBQWdCLG1CQUFoQixFQUNLRCxFQURMLENBQ1EsT0FEUixFQUNpQixpQ0FEakIsRUFDb0RuQixvQkFEcEQ7O0FBR0ExQyxjQUFNNkQsRUFBTixDQUFTLFdBQVQsRUFBc0JOLHFCQUF0Qjs7QUFFQXhDO0FBQ0gsS0FsQkQ7O0FBb0JBLFdBQU9wQixNQUFQO0FBQ0gsQ0F6UEwiLCJmaWxlIjoicXVpY2tfZWRpdC9tb2RhbHMvcHJvcGVydGllcy9wcm9wZXJ0aWVzX2ZpbHRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZmlsdGVyLmpzIDIwMTYtMTAtMTlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFByb3BlcnRpZXMgRmlsdGVyIENvbnRyb2xsZXJcbiAqXG4gKiBIYW5kbGVzIHRoZSBRdWlja0VkaXQgcHJvcGVydGllcyB0YWJsZSBmaWx0ZXJpbmcuXG4gKlxuICogIyMjIE1ldGhvZHNcbiAqXG4gKiAqKlJlbG9hZCBGaWx0ZXJpbmcgT3B0aW9ucyoqXG4gKlxuICogYGBgXG4gKiAvLyBSZWxvYWQgdGhlIGZpbHRlciBvcHRpb25zIHdpdGggYW4gQUpBWCByZXF1ZXN0IChvcHRpb25hbGx5IHByb3ZpZGUgYSBzZWNvbmQgcGFyYW1ldGVyIGZvciB0aGUgQUpBWCBVUkwpLlxuICogJCgnLnRhYmxlLW1haW4nKS5xdWlja19lZGl0X3Byb3BlcnRpZXNfZmlsdGVyKCdyZWxvYWQnKTtcbiAqIGBgYFxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3Byb3BlcnRpZXNfZmlsdGVyJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS1kZXBhcmFtL2pxdWVyeS1kZXBhcmFtLm1pbi5qc2AsXG4gICAgICAgICdsb2FkaW5nX3NwaW5uZXInXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudGVyIEtleSBDb2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzOyAvLyBFTlRFUlxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsdGVyIFJvdyBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGZpbHRlciA9ICR0aGlzLmZpbmQoJ3RyLnByb3BlcnRpZXMtZmlsdGVyJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge2JpbmRpbmdzOiB7fX07XG5cbiAgICAgICAgLy8gRHluYW1pY2FsbHkgZGVmaW5lIHRoZSBmaWx0ZXIgcm93IGRhdGEtYmluZGluZ3MuXG4gICAgICAgICRmaWx0ZXIuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tjb2x1bW5OYW1lXSA9ICQodGhpcykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLmZpcnN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbG9hZCBmaWx0ZXIgb3B0aW9ucyB3aXRoIGFuIEFqYXggcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBpbXBsZW1lbnRzIHRoZSAkKCcuZGF0YXRhYmxlJykucXVpY2tfZWRpdF9wcm9wZXJ0aWVzX2ZpbHRlcigncmVsb2FkJykgd2hpY2ggd2lsbCByZWxvYWQgdGhlIGZpbHRlcmluZ1xuICAgICAgICAgKiBcIm11bHRpX3NlbGVjdFwiIGluc3RhbmNlcyB3aWxsIG5ldyBvcHRpb25zLiBJdCBtdXN0IGJlIHVzZWQgYWZ0ZXIgc29tZSB0YWJsZSBkYXRhIGFyZSBjaGFuZ2VkIGFuZCB0aGUgZmlsdGVyaW5nXG4gICAgICAgICAqIG9wdGlvbnMgbmVlZCB0byBiZSB1cGRhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIE9wdGlvbmFsLCB0aGUgVVJMIHRvIGJlIHVzZWQgZm9yIGZldGNoaW5nIHRoZSBvcHRpb25zLiBEbyBub3QgYWRkIHRoZSBcInBhZ2VUb2tlblwiXG4gICAgICAgICAqIHBhcmFtZXRlciB0byBVUkwsIGl0IHdpbGwgYmUgYXBwZW5kZWQgaW4gdGhpcyBtZXRob2QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVsb2FkKHVybCkge1xuICAgICAgICAgICAgdXJsID0gdXJsIHx8IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89UXVpY2tFZGl0T3ZlcnZpZXdBamF4L0ZpbHRlck9wdGlvbnMnO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpfTtcblxuICAgICAgICAgICAgJC5nZXRKU09OKHVybCwgZGF0YSkuZG9uZSgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRmaWx0ZXIuZmluZCgnLlN1bW9TZWxlY3QgPiBzZWxlY3QuJyArIGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZUJhY2t1cCA9ICRzZWxlY3QudmFsKCk7IC8vIFdpbGwgdHJ5IHRvIHNldCBpdCBiYWNrIGlmIGl0IHN0aWxsIGV4aXN0cy5cblxuICAgICAgICAgICAgICAgICAgICBpZiAoISRzZWxlY3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIFRoZSBzZWxlY3QgZWxlbWVudCB3YXMgbm90IGZvdW5kLlxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5lbXB0eSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG9wdGlvbiBvZiByZXNwb25zZVtjb2x1bW5dKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmFwcGVuZChuZXcgT3B0aW9uKG9wdGlvbi50ZXh0LCBvcHRpb24udmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VmFsdWVCYWNrdXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxlY3QudmFsKGN1cnJlbnRWYWx1ZUJhY2t1cCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0Lm11bHRpX3NlbGVjdCgncmVmcmVzaCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBwdWJsaWMgXCJxdWlja19lZGl0X3Byb3BlcnRpZXNfZmlsdGVyXCIgbWV0aG9kIHRvIGpRdWVyeSBpbiBvcmRlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9hZGRQdWJsaWNNZXRob2QoKSB7XG4gICAgICAgICAgICBpZiAoJC5mbi5xdWlja19lZGl0X3Byb3BlcnRpZXNfZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmZuLmV4dGVuZCh7XG4gICAgICAgICAgICAgICAgcXVpY2tfZWRpdF9wcm9wZXJ0aWVzX2ZpbHRlcjogZnVuY3Rpb24gKGFjdGlvbiwgLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2godGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdyZWxvYWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVsb2FkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gRmlsdGVyIEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBBcHBseSB0aGUgcHJvdmlkZWQgZmlsdGVycyBhbmQgdXBkYXRlIHRoZSB0YWJsZSByb3dzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQXBwbHlGaWx0ZXJzQ2xpY2soKSB7XG4gICAgICAgICAgICAvLyBQcmVwYXJlIHRoZSBvYmplY3Qgd2l0aCB0aGUgZmluYWwgZmlsdGVyaW5nIGRhdGEuXG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7fTtcblxuICAgICAgICAgICAgJGZpbHRlci5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnY2hlY2tib3gnIHx8IGNvbHVtbk5hbWUgPT09ICdhY3Rpb25zJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBtb2R1bGUuYmluZGluZ3NbY29sdW1uTmFtZV0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyW2NvbHVtbk5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbihgJHtjb2x1bW5OYW1lfTpuYW1lYCkuc2VhcmNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oYCR7Y29sdW1uTmFtZX06bmFtZWApLnNlYXJjaCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3F1aWNrX2VkaXRfcHJvcGVydGllc19maWx0ZXI6Y2hhbmdlJywgW2ZpbHRlcl0pO1xuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIFJlc2V0IEJ1dHRvbiBDbGlja1xuICAgICAgICAgKlxuICAgICAgICAgKiBSZXNldCB0aGUgZmlsdGVyIGZvcm0gYW5kIHJlbG9hZCB0aGUgdGFibGUgZGF0YSB3aXRob3V0IGZpbHRlcmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblJlc2V0RmlsdGVyc0NsaWNrKCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHZhbHVlcyBmcm9tIHRoZSBpbnB1dCBib3hlcy5cbiAgICAgICAgICAgICRmaWx0ZXIuZmluZCgnaW5wdXQsIHNlbGVjdCcpLm5vdCgnLmxlbmd0aCwgLnNlbGVjdC1wYWdlLW1vZGUnKS52YWwoJycpO1xuICAgICAgICAgICAgJGZpbHRlci5maW5kKCdzZWxlY3QnKS5ub3QoJy5sZW5ndGgsIC5zZWxlY3QtcGFnZS1tb2RlJykubXVsdGlfc2VsZWN0KCdyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBmaWx0ZXJpbmcgdmFsdWVzLlxuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1ucygpLnNlYXJjaCgnJykuZHJhdygpO1xuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIEV2ZW50XG4gICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdxdWlja19lZGl0X3Byb3BlcnRpZXNfZmlsdGVyOmNoYW5nZScsIFt7fV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5IHRoZSBmaWx0ZXJzIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgRW50ZXIga2V5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbklucHV0VGV4dEtleVVwKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IEVOVEVSX0tFWV9DT0RFKSB7XG4gICAgICAgICAgICAgICAgJGZpbHRlci5maW5kKCcuYXBwbHktcHJvcGVydGllcy1maWx0ZXJzJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQYXJzZSB0aGUgaW5pdGlhbCBmaWx0ZXJpbmcgcGFyYW1ldGVycyBhbmQgYXBwbHkgdGhlbSB0byB0aGUgdGFibGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcGFyc2VGaWx0ZXJpbmdQYXJhbWV0ZXJzKCkge1xuICAgICAgICAgICAgY29uc3Qge2ZpbHRlcn0gPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBmaWx0ZXJbbmFtZV07XG5cbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLmJpbmRpbmdzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tuYW1lXS5zZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBOb3JtYWxpemUgYXJyYXkgZmlsdGVyaW5nIHZhbHVlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQnkgZGVmYXVsdCBkYXRhdGFibGVzIHdpbGwgY29uY2F0ZW5hdGUgYXJyYXkgc2VhcmNoIHZhbHVlcyBpbnRvIGEgc3RyaW5nIHNlcGFyYXRlZCB3aXRoIFwiLFwiIGNvbW1hcy4gVGhpc1xuICAgICAgICAgKiBpcyBub3QgYWNjZXB0YWJsZSB0aG91Z2ggYmVjYXVzZSBzb21lIGZpbHRlcmluZyBlbGVtZW50cyBtYXkgY29udGFpbiB2YWx1ZXMgd2l0aCBjb21tYSBhbmQgdGh1cyB0aGUgYXJyYXlcbiAgICAgICAgICogY2Fubm90IGJlIHBhcnNlZCBmcm9tIGJhY2tlbmQuIFRoaXMgbWV0aG9kIHdpbGwgcmVzZXQgdGhvc2UgY2FzZXMgYmFjayB0byBhcnJheXMgZm9yIGEgY2xlYXJlciB0cmFuc2FjdGlvblxuICAgICAgICAgKiB3aXRoIHRoZSBiYWNrZW5kLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtEYXRhVGFibGVzLlNldHRpbmdzfSBzZXR0aW5ncyBEYXRhVGFibGVzIHNldHRpbmdzIG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgRGF0YSB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc2VydmVyIGluIGFuIG9iamVjdCBmb3JtLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX25vcm1hbGl6ZUFycmF5VmFsdWVzKGV2ZW50LCBzZXR0aW5ncywgZGF0YSkge1xuICAgICAgICAgICAgY29uc3QgZmlsdGVyID0ge307XG5cbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gbW9kdWxlLmJpbmRpbmdzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBtb2R1bGUuYmluZGluZ3NbbmFtZV0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcltuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgZW50cnkgaW4gZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29sdW1uIG9mIGRhdGEuY29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkgPT09IGNvbHVtbi5uYW1lICYmIGZpbHRlcltlbnRyeV0uY29uc3RydWN0b3IgPT09IEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uc2VhcmNoLnZhbHVlID0gZmlsdGVyW2VudHJ5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEFkZCBwdWJsaWMgbW9kdWxlIG1ldGhvZC5cbiAgICAgICAgICAgIF9hZGRQdWJsaWNNZXRob2QoKTtcblxuICAgICAgICAgICAgLy8gUGFyc2UgZmlsdGVyaW5nIEdFVCBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgX3BhcnNlRmlsdGVyaW5nUGFyYW1ldGVycygpO1xuXG4gICAgICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgJGZpbHRlclxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAnaW5wdXQ6dGV4dCcsIF9vbklucHV0VGV4dEtleVVwKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmFwcGx5LXByb3BlcnRpZXMtZmlsdGVycycsIF9vbkFwcGx5RmlsdGVyc0NsaWNrKTtcblxuICAgICAgICAgICAgJGZpbHRlci5wYXJlbnRzKCcucHJvcGVydGllcy5tb2RhbCcpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICdidXR0b24ucmVzZXQtcHJvcGVydGllcy1maWx0ZXJzJywgX29uUmVzZXRGaWx0ZXJzQ2xpY2spO1xuXG4gICAgICAgICAgICAkdGhpcy5vbigncHJlWGhyLmR0JywgX25vcm1hbGl6ZUFycmF5VmFsdWVzKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
