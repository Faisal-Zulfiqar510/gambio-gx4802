'use strict';

/* --------------------------------------------------------------
 state.js 2016-06-20
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
            $this.on('datatable_custom_pagination:page_change', _onPageChange).on('datatable_custom_pagination:length_change', _onLengthChange).on('datatable_custom_sorting:change', _onSortChange).on('orders_overview_filter:change', _onFilterChange);

            $(window).on('popstate', _onWindowPopState);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vdmVydmlldy9zdGF0ZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImhpc3RvcnlTdXBwb3J0IiwiY29yZSIsImNvbmZpZyIsImdldCIsIl9nZXRTdGF0ZSIsImRlcGFyYW0iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInNsaWNlIiwiX3NldFN0YXRlIiwic3RhdGUiLCJ1cmwiLCJvcmlnaW4iLCJwYXRobmFtZSIsInBhcmFtIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsIl9vblBhZ2VDaGFuZ2UiLCJldmVudCIsInBhZ2luYXRpb24iLCJwYWdlIiwiX29uTGVuZ3RoQ2hhbmdlIiwibGVuZ3RoIiwiX29uRmlsdGVyQ2hhbmdlIiwiZmlsdGVyIiwiX29uU29ydENoYW5nZSIsInNvcnQiLCJkaXJlY3Rpb24iLCJuYW1lIiwiX29uV2luZG93UG9wU3RhdGUiLCJvcmlnaW5hbEV2ZW50IiwiZmluZCIsInZhbCIsIkRhdGFUYWJsZSIsInBhcnNlSW50IiwibGVuIiwiaW5pdCIsImNvbHVtbnMiLCJjaGFyQXQiLCJpbmRleCIsImNvbHVtbiIsImluZGV4T2YiLCJvcmRlciIsInZhbHVlIiwiY29uc3RydWN0b3IiLCJBcnJheSIsImpvaW4iLCJkcmF3IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7OztBQVlBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxPQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCxrREFISixFQU9JLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNTCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTU0saUJBQWlCTCxJQUFJTSxJQUFK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Q0FIUixFQUcyQ3hCLGFBSDNDLEVBSUt3QixFQUpMLENBSVEsK0JBSlIsRUFJeUMxQixlQUp6Qzs7QUFNQXpCLGNBQUVPLE1BQUYsRUFDSzRDLEVBREwsQ0FDUSxVQURSLEVBQ29CcEIsaUJBRHBCO0FBRUg7O0FBRURtQjtBQUNILEtBYkQ7O0FBZUEsV0FBT3ZELE1BQVA7QUFFSCxDQWxNTCIsImZpbGUiOiJvcmRlcnMvb3ZlcnZpZXcvc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHN0YXRlLmpzIDIwMTYtMDYtMjBcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIHRhYmxlIHN0YXRlIGZvciBmaWx0ZXJpbmcsIHBhZ2luYXRpb24gYW5kIHNvcnRpbmcuXG4gKlxuICogVGhpcyBjb250cm9sbGVyIHdpbGwgdXBkYXRlIHRoZSB3aW5kb3cgaGlzdG9yeSB3aXRoIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSB0YWJsZS4gSXQgcmVhY3RzXG4gKiB0byBzcGVjaWZpYyBldmVudHMgc3VjaCBhcyBmaWx0ZXJpbmcsIHBhZ2luYXRpb24gYW5kIHNvcnRpbmcgY2hhbmdlcy4gQWZ0ZXIgdGhlIHdpbmRvdyBoaXN0b3J5XG4gKiBpcyB1cGRhdGVkIHRoZSB1c2VyIHdpbGwgYmUgYWJsZSB0byBuYXZpZ2F0ZSBmb3J0aCBvciBiYWNrd2FyZHMuXG4gKlxuICogTm90aWNlICMxOiBUaGlzIG1vZHVsZSBtdXN0IGhhbmRsZSB0aGUgd2luZG93J3MgcG9wLXN0YXRlIGV2ZW50cyBhbmQgbm90IG90aGVyIG1vZHVsZXMgYmVjYXVzZVxuICogdGhpcyB3aWxsIGxlYWQgdG8gdW5uZWNlc3NhcnkgY29kZSBkdXBsaWNhdGlvbiBhbmQgbXVsdGlwbGUgQUpBWCByZXF1ZXN0cy5cbiAqXG4gKiBOb3RpY2UgIzE6IFRoZSB3aW5kb3cgc3RhdGUgbXVzdCBiZSBhbHdheXMgaW4gc3luYyB3aXRoIHRoZSBVUkwgZm9yIGVhc2llciBtYW5pcHVsYXRpb24uXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc3RhdGUnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LWRlcGFyYW0vanF1ZXJ5LWRlcGFyYW0ubWluLmpzYCxcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpbmRvdyBIaXN0b3J5IFN1cHBvcnRcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBoaXN0b3J5U3VwcG9ydCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2hpc3RvcnknKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgcGFyc2VkIHN0YXRlIGZyb20gdGhlIFVSTCBHRVQgcGFyYW1ldGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIHRoZSB0YWJsZSBzdGF0ZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTdGF0ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSgxKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBzdGF0ZSB0byB0aGUgYnJvd3NlcidzIGhpc3RvcnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBzdGF0ZSBpcyBzdG9yZWQgZm9yIGVuYWJsaW5nIGJhY2sgYW5kIGZvcnRoIG5hdmlnYXRpb24gZnJvbSB0aGUgYnJvd3Nlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIENvbnRhaW5zIHRoZSBuZXcgdGFibGUgc3RhdGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2V0U3RhdGUoc3RhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAnPycgKyAkLnBhcmFtKHN0YXRlKTtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZSwgJycsIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHBhZ2UgbmF2aWdhdGlvbiBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwYWdpbmF0aW9uIENvbnRhaW5zIHRoZSBEYXRhVGFibGUgcGFnaW5hdGlvbiBpbmZvLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uUGFnZUNoYW5nZShldmVudCwgcGFnaW5hdGlvbikge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBfZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgc3RhdGUucGFnZSA9IHBhZ2luYXRpb24ucGFnZSArIDE7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHBhZ2UgbGVuZ3RoIHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBOZXcgcGFnZSBsZW5ndGguXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25MZW5ndGhDaGFuZ2UoZXZlbnQsIGxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBfZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgc3RhdGUucGFnZSA9IDE7XG4gICAgICAgICAgICBzdGF0ZS5sZW5ndGggPSBsZW5ndGg7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIGZpbHRlciBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXIgQ29udGFpbnMgdGhlIGZpbHRlcmluZyB2YWx1ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25GaWx0ZXJDaGFuZ2UoZXZlbnQsIGZpbHRlcikge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBfZ2V0U3RhdGUoKTtcblxuICAgICAgICAgICAgc3RhdGUucGFnZSA9IDE7XG4gICAgICAgICAgICBzdGF0ZS5maWx0ZXIgPSBmaWx0ZXI7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlIHNvcnQgc3RhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc29ydCBDb250YWlucyBjb2x1bW4gc29ydGluZyBpbmZvIHtpbmRleCwgbmFtZSwgZGlyZWN0aW9ufS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNvcnRDaGFuZ2UoZXZlbnQsIHNvcnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gX2dldFN0YXRlKCk7XG5cbiAgICAgICAgICAgIHN0YXRlLnNvcnQgPSAoc29ydC5kaXJlY3Rpb24gPT09ICdkZXNjJyA/ICctJyA6ICcrJykgKyBzb3J0Lm5hbWU7XG5cbiAgICAgICAgICAgIF9zZXRTdGF0ZShzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0IHRoZSBjb3JyZWN0IHRhYmxlIHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIHBhcnNlIHRoZSBuZXcgcG9wcGVkIHN0YXRlIGFuZCBhcHBseSBpdCBvbiB0aGUgdGFibGUuIEl0IG11c3QgYmUgdGhlIG9ubHkgcGxhY2Ugd2hlcmUgdGhpc1xuICAgICAgICAgKiBoYXBwZW5zIGluIG9yZGVyIHRvIGF2b2lkIG11bHRpcGxlIEFKQVggcmVxdWVzdHMgYW5kIGRhdGEgY29sbGlzaW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25XaW5kb3dQb3BTdGF0ZShldmVudCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBldmVudC5vcmlnaW5hbEV2ZW50LnN0YXRlIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUucGFnZSkge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5wYWdlLW5hdmlnYXRpb24gc2VsZWN0JykudmFsKHN0YXRlLnBhZ2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLnBhZ2UocGFyc2VJbnQoc3RhdGUucGFnZSkgLSAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5wYWdlLWxlbmd0aCBzZWxlY3QnKS52YWwoc3RhdGUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5wYWdlLmxlbihwYXJzZUludChzdGF0ZS5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLnNvcnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7Y29sdW1uc30gPSAkdGhpcy5EYXRhVGFibGUoKS5pbml0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gc3RhdGUuc29ydC5jaGFyQXQoMCkgPT09ICctJyA/ICdkZXNjJyA6ICdhc2MnO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBzdGF0ZS5zb3J0LnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IDE7IC8vIERlZmF1bHQgVmFsdWVcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBvZiBjb2x1bW5zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW4ubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBjb2x1bW5zLmluZGV4T2YoY29sdW1uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkub3JkZXIoW2luZGV4LCBkaXJlY3Rpb25dKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXRlLmZpbHRlcikge1xuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgZmlsdGVyaW5nIGlucHV0IGVsZW1lbnRzLlxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbHVtbiBpbiBzdGF0ZS5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gc3RhdGUuZmlsdGVyW2NvbHVtbl07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5qb2luKCd8fCcpOyAvLyBKb2luIGFycmF5cyBpbnRvIGEgc2luZ2xlIHN0cmluZy5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbihgJHtjb2x1bW59Om5hbWVgKS5zZWFyY2godmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdyhmYWxzZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBpZiAoaGlzdG9yeVN1cHBvcnQpIHtcbiAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAub24oJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpwYWdlX2NoYW5nZScsIF9vblBhZ2VDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGF0YXRhYmxlX2N1c3RvbV9wYWdpbmF0aW9uOmxlbmd0aF9jaGFuZ2UnLCBfb25MZW5ndGhDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5vbignZGF0YXRhYmxlX2N1c3RvbV9zb3J0aW5nOmNoYW5nZScsIF9vblNvcnRDaGFuZ2UpXG4gICAgICAgICAgICAgICAgICAgIC5vbignb3JkZXJzX292ZXJ2aWV3X2ZpbHRlcjpjaGFuZ2UnLCBfb25GaWx0ZXJDaGFuZ2UpO1xuXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpXG4gICAgICAgICAgICAgICAgICAgIC5vbigncG9wc3RhdGUnLCBfb25XaW5kb3dQb3BTdGF0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuXG4gICAgfSk7Il19
