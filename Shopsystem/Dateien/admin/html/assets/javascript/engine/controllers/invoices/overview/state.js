'use strict';

/* --------------------------------------------------------------
 state.js 2016-09-30
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the table state for filtering, pagination and sorting.
 *
 * This controller will update the window history with the current state of the table. It reacts
 * to specific events such as filtering, pagination and sorting changes. After the window history
 * is updated the user will be able to navigate forth or backwards.
 *
 * Notice #1: This module must handle the window's pop-state events and not other modules because
 * this will lead to unnecessary code duplication and multiple AJAX requests.
 *
 * Notice #1: The window state must be always in sync with the URL for easier manipulation.
 */
gx.controllers.module('state', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js'], function (data) {

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
     * Window History Support
     *
     * @type {Boolean}
     */
    var historySupport = jse.core.config.get('history');

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Get parsed state from the URL GET parameters.
     *
     * @return {Object} Returns the table state.
     */
    function _getState() {
        return $.deparam(window.location.search.slice(1));
    }

    /**
     * Set the state to the browser's history.
     *
     * The state is stored for enabling back and forth navigation from the browser.
     *
     * @param {Object} state Contains the new table state.
     */
    function _setState(state) {
        var url = window.location.origin + window.location.pathname + '?' + $.param(state);
        window.history.pushState(state, '', url);
    }

    /**
     * Update page navigation state.
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {Object} pagination Contains the DataTable pagination info.
     */
    function _onPageChange(event, pagination) {
        var state = _getState();

        state.page = pagination.page + 1;

        _setState(state);
    }

    /**
     * Update page length state.
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {Number} length New page length.
     */
    function _onLengthChange(event, length) {
        var state = _getState();

        state.page = 1;
        state.length = length;

        _setState(state);
    }

    /**
     * Update filter state.
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {Object} filter Contains the filtering values.
     */
    function _onFilterChange(event, filter) {
        var state = _getState();

        state.page = 1;
        state.filter = filter;

        _setState(state);
    }

    /**
     * Update sort state.
     *
     * @param {jQuery.Event} event jQuery event object.
     * @param {Object} sort Contains column sorting info {index, name, direction}.
     */
    function _onSortChange(event, sort) {
        var state = _getState();

        state.sort = (sort.direction === 'desc' ? '-' : '+') + sort.name;

        _setState(state);
    }

    /**
     * Set the correct table state.
     *
     * This method will parse the new popped state and apply it on the table. It must be the only place where this
     * happens in order to avoid multiple AJAX requests and data collisions.
     *
     * @param {jQuery.Event} event
     */
    function _onWindowPopState(event) {
        var state = event.originalEvent.state || {};

        if (state.page) {
            $this.find('.page-navigation select').val(state.page);
            $this.DataTable().page(parseInt(state.page) - 1);
        }

        if (state.length) {
            $this.find('.page-length select').val(state.length);
            $this.DataTable().page.len(parseInt(state.length));
        }

        if (state.sort) {
            var _$this$DataTable$init = $this.DataTable().init(),
                columns = _$this$DataTable$init.columns;

            var direction = state.sort.charAt(0) === '-' ? 'desc' : 'asc';
            var name = state.sort.slice(1);
            var index = 1; // Default Value

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var column = _step.value;

                    if (column.name === name) {
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

            $this.DataTable().order([index, direction]);
        }

        if (state.filter) {
            // Update the filtering input elements.
            for (var _column in state.filter) {
                var value = state.filter[_column];

                if (value.constructor === Array) {
                    value = value.join('||'); // Join arrays into a single string.
                }

                $this.DataTable().column(_column + ':name').search(value);
            }
        }

        $this.DataTable().draw(false);
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        if (historySupport) {
            $this.on('datatable_custom_pagination:page_change', _onPageChange).on('datatable_custom_pagination:length_change', _onLengthChange).on('datatable_custom_sorting:change', _onSortChange).on('invoices_overview_filter:change', _onFilterChange);

            $(window).on('popstate', _onWindowPopState);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL292ZXJ2aWV3L3N0YXRlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiaGlzdG9yeVN1cHBvcnQiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiX2dldFN0YXRlIiwiZGVwYXJhbSIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwic2xpY2UiLCJfc2V0U3RhdGUiLCJzdGF0ZSIsInVybCIsIm9yaWdpbiIsInBhdGhuYW1lIiwicGFyYW0iLCJoaXN0b3J5IiwicHVzaFN0YXRlIiwiX29uUGFnZUNoYW5nZSIsImV2ZW50IiwicGFnaW5hdGlvbiIsInBhZ2UiLCJfb25MZW5ndGhDaGFuZ2UiLCJsZW5ndGgiLCJfb25GaWx0ZXJDaGFuZ2UiLCJmaWx0ZXIiLCJfb25Tb3J0Q2hhbmdlIiwic29ydCIsImRpcmVjdGlvbiIsIm5hbWUiLCJfb25XaW5kb3dQb3BTdGF0ZSIsIm9yaWdpbmFsRXZlbnQiLCJmaW5kIiwidmFsIiwiRGF0YVRhYmxlIiwicGFyc2VJbnQiLCJsZW4iLCJpbml0IiwiY29sdW1ucyIsImNoYXJBdCIsImluZGV4IiwiY29sdW1uIiwiaW5kZXhPZiIsIm9yZGVyIiwidmFsdWUiLCJjb25zdHJ1Y3RvciIsIkFycmF5Iiwiam9pbiIsImRyYXciLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7O0FBWUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLE9BREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLGtEQUhKLEVBT0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1MLFNBQVMsRUFBZjs7QUFFQTs7Ozs7QUFLQSxRQUFNTSxpQkFBaUJMLElBQUlNLElB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LGlDQUhSLEVBRzJDeEIsYUFIM0MsRUFJS3dCLEVBSkwsQ0FJUSxpQ0FKUixFQUkyQzFCLGVBSjNDOztBQU1BekIsY0FBRU8sTUFBRixFQUNLNEMsRUFETCxDQUNRLFVBRFIsRUFDb0JwQixpQkFEcEI7QUFFSDs7QUFFRG1CO0FBQ0gsS0FiRDs7QUFlQSxXQUFPdkQsTUFBUDtBQUVILENBbE1MIiwiZmlsZSI6Imludm9pY2VzL292ZXJ2aWV3L3N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzdGF0ZS5qcyAyMDE2LTA5LTMwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBIYW5kbGVzIHRoZSB0YWJsZSBzdGF0ZSBmb3IgZmlsdGVyaW5nLCBwYWdpbmF0aW9uIGFuZCBzb3J0aW5nLlxuICpcbiAqIFRoaXMgY29udHJvbGxlciB3aWxsIHVwZGF0ZSB0aGUgd2luZG93IGhpc3Rvcnkgd2l0aCB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGFibGUuIEl0IHJlYWN0c1xuICogdG8gc3BlY2lmaWMgZXZlbnRzIHN1Y2ggYXMgZmlsdGVyaW5nLCBwYWdpbmF0aW9uIGFuZCBzb3J0aW5nIGNoYW5nZXMuIEFmdGVyIHRoZSB3aW5kb3cgaGlzdG9yeVxuICogaXMgdXBkYXRlZCB0aGUgdXNlciB3aWxsIGJlIGFibGUgdG8gbmF2aWdhdGUgZm9ydGggb3IgYmFja3dhcmRzLlxuICpcbiAqIE5vdGljZSAjMTogVGhpcyBtb2R1bGUgbXVzdCBoYW5kbGUgdGhlIHdpbmRvdydzIHBvcC1zdGF0ZSBldmVudHMgYW5kIG5vdCBvdGhlciBtb2R1bGVzIGJlY2F1c2VcbiAqIHRoaXMgd2lsbCBsZWFkIHRvIHVubmVjZXNzYXJ5IGNvZGUgZHVwbGljYXRpb24gYW5kIG11bHRpcGxlIEFKQVggcmVxdWVzdHMuXG4gKlxuICogTm90aWNlICMxOiBUaGUgd2luZG93IHN0YXRlIG11c3QgYmUgYWx3YXlzIGluIHN5bmMgd2l0aCB0aGUgVVJMIGZvciBlYXNpZXIgbWFuaXB1bGF0aW9uLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3N0YXRlJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS1kZXBhcmFtL2pxdWVyeS1kZXBhcmFtLm1pbi5qc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpbmRvdyBIaXN0b3J5IFN1cHBvcnRcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBoaXN0b3J5U3VwcG9ydCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2hpc3RvcnknKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgcGFyc2VkIHN0YXRlIGZyb20gdGhlIFVSTCBHRVQgcGFyYW1ldGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIHRoZSB0YWJsZSBzdGF0ZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBzdGF0ZSB0byB0aGUgYnJvd3NlcidzIGhpc3RvcnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBzdGF0ZSBpcyBzdG9yZWQgZm9yIGVuYWJsaW5nIGJhY2sgYW5kIGZvcnRoIG5hdmlnYXRpb24gZnJvbSB0aGUgYnJvd3Nlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIENvbnRhaW5zIHRoZSBuZXcgdGFibGUgc3RhdGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAnPycgKyAkLnBhcmFtKHN0YXRlKTtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgJycsIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHBhZ2UgbmF2aWdhdGlvbiBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWdpbmF0aW9uIENvbnRhaW5zIHRoZSBEYXRhVGFibGUgcGFnaW5hdGlvbiBpbmZvLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uUGFnZUNoYW5nZShldmVudCwgcGFnaW5hdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBfZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgc3RhdGUucGFnZSA9IHBhZ2luYXRpb24ucGFnZSArIDE7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHBhZ2UgbGVuZ3RoIHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBOZXcgcGFnZSBsZW5ndGguXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25MZW5ndGhDaGFuZ2UoZXZlbnQsIGxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBfZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgc3RhdGUucGFnZSA9IDE7XG4gICAgICAgICAgICBzdGF0ZS5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIGZpbHRlciBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXIgQ29udGFpbnMgdGhlIGZpbHRlcmluZyB2YWx1ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25GaWx0ZXJDaGFuZ2UoZXZlbnQsIGZpbHRlcikge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBfZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgc3RhdGUucGFnZSA9IDE7XG4gICAgICAgICAgICBzdGF0ZS5maWx0ZXIgPSBmaWx0ZXI7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHNvcnQgc3RhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc29ydCBDb250YWlucyBjb2x1bW4gc29ydGluZyBpbmZvIHtpbmRleCwgbmFtZSwgZGlyZWN0aW9ufS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNvcnRDaGFuZ2UoZXZlbnQsIHNvcnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gX2dldFN0YXRlKCk7XG5cbiAgICAgICAgICAgIHN0YXRlLnNvcnQgPSAoc29ydC5kaXJlY3Rpb24gPT09ICdkZXNjJyA/ICctJyA6ICcrJykgKyBzb3J0Lm5hbWU7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBjb3JyZWN0IHRhYmxlIHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIHBhcnNlIHRoZSBuZXcgcG9wcGVkIHN0YXRlIGFuZCBhcHBseSBpdCBvbiB0aGUgdGFibGUuIEl0IG11c3QgYmUgdGhlIG9ubHkgcGxhY2Ugd2hlcmUgdGhpc1xuICAgICAgICAgKiBoYXBwZW5zIGluIG9yZGVyIHRvIGF2b2lkIG11bHRpcGxlIEFKQVggcmVxdWVzdHMgYW5kIGRhdGEgY29sbGlzaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25XaW5kb3dQb3BTdGF0ZShldmVudCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBldmVudC5vcmlnaW5hbEV2ZW50LnN0YXRlIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUucGFnZSkge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5wYWdlLW5hdmlnYXRpb24gc2VsZWN0JykudmFsKHN0YXRlLnBhZ2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLnBhZ2UocGFyc2VJbnQoc3RhdGUucGFnZSkgLSAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5wYWdlLWxlbmd0aCBzZWxlY3QnKS52YWwoc3RhdGUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5wYWdlLmxlbihwYXJzZUludChzdGF0ZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLnNvcnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7Y29sdW1uc30gPSAkdGhpcy5EYXRhVGFibGUoKS5pbml0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gc3RhdGUuc29ydC5jaGFyQXQoMCkgPT09ICctJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzdGF0ZS5zb3J0LnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IDE7IC8vIERlZmF1bHQgVmFsdWVcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBvZiBjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBjb2x1bW5zLmluZGV4T2YoY29sdW1uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkub3JkZXIoW2luZGV4LCBkaXJlY3Rpb25dKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmZpbHRlcikge1xuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgZmlsdGVyaW5nIGlucHV0IGVsZW1lbnRzLlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBpbiBzdGF0ZS5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc3RhdGUuZmlsdGVyW2NvbHVtbl07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5qb2luKCd8fCcpOyAvLyBKb2luIGFycmF5cyBpbnRvIGEgc2luZ2xlIHN0cmluZy5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbihgJHtjb2x1bW59Om5hbWVgKS5zZWFyY2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdyhmYWxzZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBpZiAoaGlzdG9yeVN1cHBvcnQpIHtcbiAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAub24oJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpwYWdlX2NoYW5nZScsIF9vblBhZ2VDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGF0YXRhYmxlX2N1c3RvbV9wYWdpbmF0aW9uOmxlbmd0aF9jaGFuZ2UnLCBfb25MZW5ndGhDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGF0YXRhYmxlX2N1c3RvbV9zb3J0aW5nOmNoYW5nZScsIF9vblNvcnRDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5vbignaW52b2ljZXNfb3ZlcnZpZXdfZmlsdGVyOmNoYW5nZScsIF9vbkZpbHRlckNoYW5nZSk7XG5cbiAgICAgICAgICAgICAgICAkKHdpbmRvdylcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdwb3BzdGF0ZScsIF9vbldpbmRvd1BvcFN0YXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG5cbiAgICB9KTsiXX0=
