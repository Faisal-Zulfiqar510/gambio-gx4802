'use strict';

/* --------------------------------------------------------------
 state.js 2016-10-19
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
 * Notice #2: The window state must be always in sync with the URL for easier manipulation.
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
     * @param {jQuery.Event} event jQuery event object.
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
            $this.on('datatable_custom_pagination:page_change', _onPageChange).on('datatable_custom_pagination:length_change', _onLengthChange).on('datatable_custom_sorting:change', _onSortChange).on('quick_edit_filter:change', _onFilterChange);

            $(window).on('popstate', _onWindowPopState);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvc3RhdGUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJoaXN0b3J5U3VwcG9ydCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJfZ2V0U3RhdGUiLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzbGljZSIsIl9zZXRTdGF0ZSIsInN0YXRlIiwidXJsIiwib3JpZ2luIiwicGF0aG5hbWUiLCJwYXJhbSIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJfb25QYWdlQ2hhbmdlIiwiZXZlbnQiLCJwYWdpbmF0aW9uIiwicGFnZSIsIl9vbkxlbmd0aENoYW5nZSIsImxlbmd0aCIsIl9vbkZpbHRlckNoYW5nZSIsImZpbHRlciIsIl9vblNvcnRDaGFuZ2UiLCJzb3J0IiwiZGlyZWN0aW9uIiwibmFtZSIsIl9vbldpbmRvd1BvcFN0YXRlIiwib3JpZ2luYWxFdmVudCIsImZpbmQiLCJ2YWwiLCJEYXRhVGFibGUiLCJwYXJzZUludCIsImxlbiIsImluaXQiLCJjb2x1bW5zIiwiY2hhckF0IiwiaW5kZXgiLCJjb2x1bW4iLCJpbmRleE9mIiwib3JkZXIiLCJ2YWx1ZSIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJqb2luIiwiZHJhdyIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7QUFZQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksT0FESixFQUdJLENBQ09DLElBQUlDLE1BRFgsa0RBSEosRUFPSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUwsU0FBUyxFQUFmOztBQUVBOzs7OztBQUtBLFFBQU1NLGlCQUFpQkwsSUFBSU0sSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixTQUFwQixDQUF2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0MsU0FBVCxHQUFxQjtBQUNqQixlQUFPTCxFQUFFTSxPQUFGLENBQVVDLE9BQU9DLFFBQVAsQ0FBZ0JDLE1BQWhCLENBQXVCQyxLQUF2QixDQUE2QixDQUE3QixDQUFWLENBQVA7QUFDSDs7QUFFRDs7Ozs7OztBQU9BLGFBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQ3RCLFlBQU1DLE1BQU1OLE9BQU9DLFFBQVAsQ0FBZ0JNLE1BQWhCLEdBQXlCUCxPQUFPQyxRQUFQLENBQWdCTyxRQUF6QyxHQUFvRCxHQUFwRCxHQUEwRGYsRUFBRWdCLEtBQUYsQ0FBUUosS0FBUixDQUF0RTtBQUNBTCxlQUFPVSxPQUFQLENBQWVDLFNBQWYsQ0FBeUJOLEtBQXpCLEVBQWdDLEVBQWhDLEVBQW9DQyxHQUFwQztBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTTSxhQUFULENBQXVCQyxLQUF2QixFQUE4QkMsVUFBOUIsRUFBMEM7QUFDdEMsWUFBTVQsUUFBUVAsV0FBZDs7QUFFQU8sY0FBTVUsSUFBTixHQUFhRCxXQUFXQyxJQUFYLEdBQWtCLENBQS9COztBQUVBWCxrQkFBVUMsS0FBVjtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTVyxlQUFULENBQXlCSCxLQUF6QixFQUFnQ0ksTUFBaEMsRUFBd0M7QUFDcEMsWUFBTVosUUFBUVAsV0FBZDs7QUFFQU8sY0FBTVUsSUFBTixHQUFhLENBQWI7QUFDQVYsY0FBTVksTUFBTixHQUFlQSxNQUFmOztBQUVBYixrQkFBVUMsS0FBVjtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTYSxlQUFULENBQXlCTCxLQUF6QixFQUFnQ00sTUFBaEMsRUFBd0M7QUFDcEMsWUFBTWQsUUFBUVAsV0FBZDs7QUFFQU8sY0FBTVUsSUFBTixHQUFhLENBQWI7QUFDQVYsY0FBTWMsTUFBTixHQUFlQSxNQUFmOztBQUVBZixrQkFBVUMsS0FBVjtBQUNIOztBQUVEOzs7Ozs7QUFNQSxhQUFTZSxhQUFULENBQXVCUCxLQUF2QixFQUE4QlEsSUFBOUIsRUFBb0M7QUFDaEMsWUFBTWhCLFFBQVFQLFdBQWQ7O0FBRUFPLGNBQU1nQixJQUFOLEdBQWEsQ0FBQ0EsS0FBS0MsU0FBTCxLQUFtQixNQUFuQixHQUE0QixHQUE1QixHQUFrQyxHQUFuQyxJQUEwQ0QsS0FBS0UsSUFBNUQ7O0FBRUFuQixrQkFBVUMsS0FBVjtBQUNIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVNtQixpQkFBVCxDQUEyQlgsS0FBM0IsRUFBa0M7QUFDOUIsWUFBTVIsUUFBUVEsTUFBTVksYUFBTixDQUFvQnBCLEtBQXBCLElBQTZCLEVBQTNDOztBQUVBLFlBQUlBLE1BQU1VLElBQVYsRUFBZ0I7QUFDWnZCLGtCQUFNa0MsSUFBTixDQUFXLHlCQUFYLEVBQXNDQyxHQUF0QyxDQUEwQ3RCLE1BQU1VLElBQWhEO0FBQ0F2QixrQkFBTW9DLFNBQU4sR0FBa0JiLElBQWxCLENBQXVCYyxTQUFTeEIsTUFBTVUsSUFBZixJQUF1QixDQUE5QztBQUNIOztBQUVELFlBQUlWLE1BQU1ZLE1BQVYsRUFBa0I7QUFDZHpCLGtCQUFNa0MsSUFBTixDQUFXLHFCQUFYLEVBQWtDQyxHQUFsQyxDQUFzQ3RCLE1BQU1ZLE1BQTVDO0FBQ0F6QixrQkFBTW9DLFNBQU4sR0FBa0JiLElBQWxCLENBQXVCZSxHQUF2QixDQUEyQkQsU0FBU3hCLE1BQU1ZLE1BQWYsQ0FBM0I7QUFDSDs7QUFFRCxZQUFJWixNQUFNZ0IsSUFBVixFQUFnQjtBQUFBLHdDQUNNN0IsTUFBTW9DLFNBQU4sR0FBa0JHLElBQWxCLEVBRE47QUFBQSxnQkFDTEMsT0FESyx5QkFDTEEsT0FESzs7QUFFWixnQkFBTVYsWUFBWWpCLE1BQU1nQixJQUFOLENBQVdZLE1BQVgsQ0FBa0IsQ0FBbEIsTUFBeUIsR0FBekIsR0FBK0IsTUFBL0IsR0FBd0MsS0FBMUQ7QUFDQSxnQkFBTVYsT0FBT2xCLE1BQU1nQixJQUFOLENBQVdsQixLQUFYLENBQWlCLENBQWpCLENBQWI7QUFDQSxnQkFBSStCLFFBQVEsQ0FBWixDQUpZLENBSUc7O0FBSkg7QUFBQTtBQUFBOztBQUFBO0FBTVoscUNBQW1CRixPQUFuQiw4SEFBNEI7QUFBQSx3QkFBbkJHLE1BQW1COztBQUN4Qix3QkFBSUEsT0FBT1osSUFBUCxLQUFnQkEsSUFBcEIsRUFBMEI7QUFDdEJXLGdDQUFRRixRQUFRSSxPQUFSLENBQWdCRCxNQUFoQixDQUFSO0FBQ0E7QUFDSDtBQUNKO0FBWFc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFhWjNDLGtCQUFNb0MsU0FBTixHQUFrQlMsS0FBbEIsQ0FBd0IsQ0FBQ0gsS0FBRCxFQUFRWixTQUFSLENBQXhCO0FBQ0g7O0FBRUQsWUFBSWpCLE1BQU1jLE1BQVYsRUFBa0I7QUFDZDtBQUNBLGlCQUFLLElBQUlnQixPQUFULElBQW1COUIsTUFBTWMsTUFBekIsRUFBaUM7QUFDN0Isb0JBQUltQixRQUFRakMsTUFBTWMsTUFBTixDQUFhZ0IsT0FBYixDQUFaOztBQUVBLG9CQUFJRyxNQUFNQyxXQUFOLEtBQXNCQyxLQUExQixFQUFpQztBQUM3QkYsNEJBQVFBLE1BQU1HLElBQU4sQ0FBVyxJQUFYLENBQVIsQ0FENkIsQ0FDSDtBQUM3Qjs7QUFFRGpELHNCQUFNb0MsU0FBTixHQUFrQk8sTUFBbEIsQ0FBNEJBLE9BQTVCLFlBQTJDakMsTUFBM0MsQ0FBa0RvQyxLQUFsRDtBQUNIO0FBQ0o7O0FBRUQ5QyxjQUFNb0MsU0FBTixHQUFrQmMsSUFBbEIsQ0FBdUIsS0FBdkI7QUFFSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUF0RCxXQUFPMkMsSUFBUCxHQUFjLFVBQVVZLElBQVYsRUFBZ0I7QUFDMUIsWUFBSWpELGNBQUosRUFBb0I7QUFDaEJGLGtCQUNLb0QsRUFETCxDQUNRLHlDQURSLEVBQ21EaEMsYUFEbkQsRUFFS2dDLEVBRkwsQ0FFUSwyQ0FGUixFQUVxRDVCLGVBRnJELEVBR0s0QixFQUhMLENBR1EsaUNBSFIsRUFHMkN4QixhQUgzQyxFQUlLd0IsRUFKTCxDQUlRLDBCQUpSLEVBSW9DMUIsZUFKcEM7O0FBTUF6QixjQUFFTyxNQUFGLEVBQ0s0QyxFQURMLENBQ1EsVUFEUixFQUNvQnBCLGlCQURwQjtBQUVIOztBQUVEbUI7QUFDSCxLQWJEOztBQWVBLFdBQU92RCxNQUFQO0FBRUgsQ0FsTUwiLCJmaWxlIjoicXVpY2tfZWRpdC9vdmVydmlldy9zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3RhdGUuanMgMjAxNi0xMC0xOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogSGFuZGxlcyB0aGUgdGFibGUgc3RhdGUgZm9yIGZpbHRlcmluZywgcGFnaW5hdGlvbiBhbmQgc29ydGluZy5cbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgd2lsbCB1cGRhdGUgdGhlIHdpbmRvdyBoaXN0b3J5IHdpdGggdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHRhYmxlLiBJdCByZWFjdHNcbiAqIHRvIHNwZWNpZmljIGV2ZW50cyBzdWNoIGFzIGZpbHRlcmluZywgcGFnaW5hdGlvbiBhbmQgc29ydGluZyBjaGFuZ2VzLiBBZnRlciB0aGUgd2luZG93IGhpc3RvcnlcbiAqIGlzIHVwZGF0ZWQgdGhlIHVzZXIgd2lsbCBiZSBhYmxlIHRvIG5hdmlnYXRlIGZvcnRoIG9yIGJhY2t3YXJkcy5cbiAqXG4gKiBOb3RpY2UgIzE6IFRoaXMgbW9kdWxlIG11c3QgaGFuZGxlIHRoZSB3aW5kb3cncyBwb3Atc3RhdGUgZXZlbnRzIGFuZCBub3Qgb3RoZXIgbW9kdWxlcyBiZWNhdXNlXG4gKiB0aGlzIHdpbGwgbGVhZCB0byB1bm5lY2Vzc2FyeSBjb2RlIGR1cGxpY2F0aW9uIGFuZCBtdWx0aXBsZSBBSkFYIHJlcXVlc3RzLlxuICpcbiAqIE5vdGljZSAjMjogVGhlIHdpbmRvdyBzdGF0ZSBtdXN0IGJlIGFsd2F5cyBpbiBzeW5jIHdpdGggdGhlIFVSTCBmb3IgZWFzaWVyIG1hbmlwdWxhdGlvbi5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzdGF0ZScsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9qcXVlcnktZGVwYXJhbS9qcXVlcnktZGVwYXJhbS5taW4uanNgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaW5kb3cgSGlzdG9yeSBTdXBwb3J0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgaGlzdG9yeVN1cHBvcnQgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdoaXN0b3J5Jyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHBhcnNlZCBzdGF0ZSBmcm9tIHRoZSBVUkwgR0VUIHBhcmFtZXRlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyB0aGUgdGFibGUgc3RhdGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0U3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgc3RhdGUgdG8gdGhlIGJyb3dzZXIncyBoaXN0b3J5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgc3RhdGUgaXMgc3RvcmVkIGZvciBlbmFibGluZyBiYWNrIGFuZCBmb3J0aCBuYXZpZ2F0aW9uIGZyb20gdGhlIGJyb3dzZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBDb250YWlucyB0aGUgbmV3IHRhYmxlIHN0YXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3NldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgJz8nICsgJC5wYXJhbShzdGF0ZSk7XG4gICAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGUsICcnLCB1cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBwYWdlIG5hdmlnYXRpb24gc3RhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcGFnaW5hdGlvbiBDb250YWlucyB0aGUgRGF0YVRhYmxlIHBhZ2luYXRpb24gaW5mby5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblBhZ2VDaGFuZ2UoZXZlbnQsIHBhZ2luYXRpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gX2dldFN0YXRlKCk7XG5cbiAgICAgICAgICAgIHN0YXRlLnBhZ2UgPSBwYWdpbmF0aW9uLnBhZ2UgKyAxO1xuXG4gICAgICAgICAgICBfc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBwYWdlIGxlbmd0aCBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggTmV3IHBhZ2UgbGVuZ3RoLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uTGVuZ3RoQ2hhbmdlKGV2ZW50LCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gX2dldFN0YXRlKCk7XG5cbiAgICAgICAgICAgIHN0YXRlLnBhZ2UgPSAxO1xuICAgICAgICAgICAgc3RhdGUubGVuZ3RoID0gbGVuZ3RoO1xuXG4gICAgICAgICAgICBfc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBmaWx0ZXIgc3RhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZmlsdGVyIENvbnRhaW5zIHRoZSBmaWx0ZXJpbmcgdmFsdWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRmlsdGVyQ2hhbmdlKGV2ZW50LCBmaWx0ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gX2dldFN0YXRlKCk7XG5cbiAgICAgICAgICAgIHN0YXRlLnBhZ2UgPSAxO1xuICAgICAgICAgICAgc3RhdGUuZmlsdGVyID0gZmlsdGVyO1xuXG4gICAgICAgICAgICBfc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZSBzb3J0IHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNvcnQgQ29udGFpbnMgY29sdW1uIHNvcnRpbmcgaW5mbyB7aW5kZXgsIG5hbWUsIGRpcmVjdGlvbn0uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Tb3J0Q2hhbmdlKGV2ZW50LCBzb3J0KSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IF9nZXRTdGF0ZSgpO1xuXG4gICAgICAgICAgICBzdGF0ZS5zb3J0ID0gKHNvcnQuZGlyZWN0aW9uID09PSAnZGVzYycgPyAnLScgOiAnKycpICsgc29ydC5uYW1lO1xuXG4gICAgICAgICAgICBfc2V0U3RhdGUoc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldCB0aGUgY29ycmVjdCB0YWJsZSBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBwYXJzZSB0aGUgbmV3IHBvcHBlZCBzdGF0ZSBhbmQgYXBwbHkgaXQgb24gdGhlIHRhYmxlLiBJdCBtdXN0IGJlIHRoZSBvbmx5IHBsYWNlIHdoZXJlIHRoaXNcbiAgICAgICAgICogaGFwcGVucyBpbiBvcmRlciB0byBhdm9pZCBtdWx0aXBsZSBBSkFYIHJlcXVlc3RzIGFuZCBkYXRhIGNvbGxpc2lvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uV2luZG93UG9wU3RhdGUoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gZXZlbnQub3JpZ2luYWxFdmVudC5zdGF0ZSB8fCB7fTtcblxuICAgICAgICAgICAgaWYgKHN0YXRlLnBhZ2UpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcucGFnZS1uYXZpZ2F0aW9uIHNlbGVjdCcpLnZhbChzdGF0ZS5wYWdlKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5wYWdlKHBhcnNlSW50KHN0YXRlLnBhZ2UpIC0gMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcucGFnZS1sZW5ndGggc2VsZWN0JykudmFsKHN0YXRlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkucGFnZS5sZW4ocGFyc2VJbnQoc3RhdGUubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zb3J0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge2NvbHVtbnN9ID0gJHRoaXMuRGF0YVRhYmxlKCkuaW5pdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHN0YXRlLnNvcnQuY2hhckF0KDApID09PSAnLScgPyAnZGVzYycgOiAnYXNjJztcbiAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gc3RhdGUuc29ydC5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSAxOyAvLyBEZWZhdWx0IFZhbHVlXG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gb2YgY29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sdW1uLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gY29sdW1ucy5pbmRleE9mKGNvbHVtbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLm9yZGVyKFtpbmRleCwgZGlyZWN0aW9uXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5maWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGZpbHRlcmluZyBpbnB1dCBlbGVtZW50cy5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb2x1bW4gaW4gc3RhdGUuZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHN0YXRlLmZpbHRlcltjb2x1bW5dO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuam9pbignfHwnKTsgLy8gSm9pbiBhcnJheXMgaW50byBhIHNpbmdsZSBzdHJpbmcuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oYCR7Y29sdW1ufTpuYW1lYCkuc2VhcmNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLmRyYXcoZmFsc2UpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgaWYgKGhpc3RvcnlTdXBwb3J0KSB7XG4gICAgICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdkYXRhdGFibGVfY3VzdG9tX3BhZ2luYXRpb246cGFnZV9jaGFuZ2UnLCBfb25QYWdlQ2hhbmdlKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpsZW5ndGhfY2hhbmdlJywgX29uTGVuZ3RoQ2hhbmdlKVxuICAgICAgICAgICAgICAgICAgICAub24oJ2RhdGF0YWJsZV9jdXN0b21fc29ydGluZzpjaGFuZ2UnLCBfb25Tb3J0Q2hhbmdlKVxuICAgICAgICAgICAgICAgICAgICAub24oJ3F1aWNrX2VkaXRfZmlsdGVyOmNoYW5nZScsIF9vbkZpbHRlckNoYW5nZSk7XG5cbiAgICAgICAgICAgICAgICAkKHdpbmRvdylcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdwb3BzdGF0ZScsIF9vbldpbmRvd1BvcFN0YXRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG5cbiAgICB9KTsiXX0=
