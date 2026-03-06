'use strict';

/* --------------------------------------------------------------
 datatable_custom_sorting.js 2016-06-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable Custom DataTable Sorting
 *
 * DataTables will reset the table to the first page after sorting by default. As there is no way to override
 * this behavior, this module will remove the DataTable sorting event handlers and set its own, which will keep
 * the table to the current page. This module will also set a sort parameter to the URL on sorting change but will
 * not parse it during initialization. This must happen from the module that initializes the table.
 *
 * Important: This method will remove the click event from the "th.sorting" elements, so bind extra "click" events
 * after enabling the custom-sorting extension (on init.dt event).
 *
 * ### Events
 *
 * ```javascript
 * // Add custom callback once the column sorting was changed (the "info" object contains the column index,
 * // column name and sort direction: {index, name, direction}).
 * $('#datatable-instance').on('datatable_custom_sorting:change', function(event, info) {...});
 * ```
 *
 * @module Admin/Extensions/datatable_custom_sorting
 */
gx.extensions.module('datatable_custom_sorting', [], function (data) {

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
   * On Table Header Cell Click
   *
   * Perform the table sorting without changing the current page.
   */
  function _onTableHeaderCellClick() {
    // Change Table Order
    var index = $(this).index();
    var destination = $(this).hasClass('sorting_asc') ? 'desc' : 'asc';

    $this.DataTable().order([index, destination]).draw(false);

    // Trigger Event
    var order = $this.DataTable().order()[0];

    var _$this$DataTable$init = $this.DataTable().init(),
        columns = _$this$DataTable$init.columns;

    var info = {
      index: order[0],
      name: columns[order[0]].name,
      direction: order[1]
    };

    $this.trigger('datatable_custom_sorting:change', [info]);
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $this.on('preInit.dt', function () {
      $this.find('thead tr:first th.sorting').off('click').on('click', _onTableHeaderCellClick);
    });

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9jdXN0b21fc29ydGluZy5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiX29uVGFibGVIZWFkZXJDZWxsQ2xpY2siLCJpbmRleCIsImRlc3RpbmF0aW9uIiwiaGFzQ2xhc3MiLCJEYXRhVGFibGUiLCJvcmRlciIsImRyYXciLCJpbml0IiwiY29sdW1ucyIsImluZm8iLCJuYW1lIiwiZGlyZWN0aW9uIiwidHJpZ2dlciIsImRvbmUiLCJvbiIsImZpbmQiLCJvZmYiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FBcUIsMEJBQXJCLEVBQWlELEVBQWpELEVBQXFELFVBQVVDLElBQVYsRUFBZ0I7O0FBRWpFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUgsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxXQUFTSSx1QkFBVCxHQUFtQztBQUMvQjtBQUNBLFFBQU1DLFFBQVFGLEVBQUUsSUFBRixFQUFRRSxLQUFSLEVBQWQ7QUFDQSxRQUFNQyxjQUFjSCxFQUFFLElBQUYsRUFBUUksUUFBUixDQUFpQixhQUFqQixJQUFrQyxNQUFsQyxHQUEyQyxLQUEvRDs7QUFFQUwsVUFBTU0sU0FBTixHQUFrQkMsS0FBbEIsQ0FBd0IsQ0FBQ0osS0FBRCxFQUFRQyxXQUFSLENBQXhCLEVBQThDSSxJQUE5QyxDQUFtRCxLQUFuRDs7QUFFQTtBQUNBLFFBQU1ELFFBQVFQLE1BQU1NLFNBQU4sR0FBa0JDLEtBQWxCLEdBQTBCLENBQTFCLENBQWQ7O0FBUitCLGdDQVNiUCxNQUFNTSxTQUFOLEdBQWtCRyxJQUFsQixFQVRhO0FBQUEsUUFTeEJDLE9BVHdCLHlCQVN4QkEsT0FUd0I7O0FBVS9CLFFBQU1DLE9BQU87QUFDVFIsYUFBT0ksTUFBTSxDQUFOLENBREU7QUFFVEssWUFBTUYsUUFBUUgsTUFBTSxDQUFOLENBQVIsRUFBa0JLLElBRmY7QUFHVEMsaUJBQVdOLE1BQU0sQ0FBTjtBQUhGLEtBQWI7O0FBTUFQLFVBQU1jLE9BQU4sQ0FBYyxpQ0FBZCxFQUFpRCxDQUFDSCxJQUFELENBQWpEO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBYixTQUFPVyxJQUFQLEdBQWMsVUFBVU0sSUFBVixFQUFnQjtBQUMxQmYsVUFBTWdCLEVBQU4sQ0FBUyxZQUFULEVBQXVCLFlBQU07QUFDekJoQixZQUFNaUIsSUFBTixDQUFXLDJCQUFYLEVBQ0tDLEdBREwsQ0FDUyxPQURULEVBRUtGLEVBRkwsQ0FFUSxPQUZSLEVBRWlCZCx1QkFGakI7QUFHSCxLQUpEOztBQU1BYTtBQUNILEdBUkQ7O0FBVUEsU0FBT2pCLE1BQVA7QUFFSCxDQWxFRCIsImZpbGUiOiJkYXRhdGFibGVfY3VzdG9tX3NvcnRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGF0YWJsZV9jdXN0b21fc29ydGluZy5qcyAyMDE2LTA2LTIwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBFbmFibGUgQ3VzdG9tIERhdGFUYWJsZSBTb3J0aW5nXG4gKlxuICogRGF0YVRhYmxlcyB3aWxsIHJlc2V0IHRoZSB0YWJsZSB0byB0aGUgZmlyc3QgcGFnZSBhZnRlciBzb3J0aW5nIGJ5IGRlZmF1bHQuIEFzIHRoZXJlIGlzIG5vIHdheSB0byBvdmVycmlkZVxuICogdGhpcyBiZWhhdmlvciwgdGhpcyBtb2R1bGUgd2lsbCByZW1vdmUgdGhlIERhdGFUYWJsZSBzb3J0aW5nIGV2ZW50IGhhbmRsZXJzIGFuZCBzZXQgaXRzIG93biwgd2hpY2ggd2lsbCBrZWVwXG4gKiB0aGUgdGFibGUgdG8gdGhlIGN1cnJlbnQgcGFnZS4gVGhpcyBtb2R1bGUgd2lsbCBhbHNvIHNldCBhIHNvcnQgcGFyYW1ldGVyIHRvIHRoZSBVUkwgb24gc29ydGluZyBjaGFuZ2UgYnV0IHdpbGxcbiAqIG5vdCBwYXJzZSBpdCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIFRoaXMgbXVzdCBoYXBwZW4gZnJvbSB0aGUgbW9kdWxlIHRoYXQgaW5pdGlhbGl6ZXMgdGhlIHRhYmxlLlxuICpcbiAqIEltcG9ydGFudDogVGhpcyBtZXRob2Qgd2lsbCByZW1vdmUgdGhlIGNsaWNrIGV2ZW50IGZyb20gdGhlIFwidGguc29ydGluZ1wiIGVsZW1lbnRzLCBzbyBiaW5kIGV4dHJhIFwiY2xpY2tcIiBldmVudHNcbiAqIGFmdGVyIGVuYWJsaW5nIHRoZSBjdXN0b20tc29ydGluZyBleHRlbnNpb24gKG9uIGluaXQuZHQgZXZlbnQpLlxuICpcbiAqICMjIyBFdmVudHNcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBBZGQgY3VzdG9tIGNhbGxiYWNrIG9uY2UgdGhlIGNvbHVtbiBzb3J0aW5nIHdhcyBjaGFuZ2VkICh0aGUgXCJpbmZvXCIgb2JqZWN0IGNvbnRhaW5zIHRoZSBjb2x1bW4gaW5kZXgsXG4gKiAvLyBjb2x1bW4gbmFtZSBhbmQgc29ydCBkaXJlY3Rpb246IHtpbmRleCwgbmFtZSwgZGlyZWN0aW9ufSkuXG4gKiAkKCcjZGF0YXRhYmxlLWluc3RhbmNlJykub24oJ2RhdGF0YWJsZV9jdXN0b21fc29ydGluZzpjaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgaW5mbykgey4uLn0pO1xuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL2RhdGF0YWJsZV9jdXN0b21fc29ydGluZ1xuICovXG5neC5leHRlbnNpb25zLm1vZHVsZSgnZGF0YXRhYmxlX2N1c3RvbV9zb3J0aW5nJywgW10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE9uIFRhYmxlIEhlYWRlciBDZWxsIENsaWNrXG4gICAgICpcbiAgICAgKiBQZXJmb3JtIHRoZSB0YWJsZSBzb3J0aW5nIHdpdGhvdXQgY2hhbmdpbmcgdGhlIGN1cnJlbnQgcGFnZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25UYWJsZUhlYWRlckNlbGxDbGljaygpIHtcbiAgICAgICAgLy8gQ2hhbmdlIFRhYmxlIE9yZGVyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9ICQodGhpcykuaGFzQ2xhc3MoJ3NvcnRpbmdfYXNjJykgPyAnZGVzYycgOiAnYXNjJztcblxuICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5vcmRlcihbaW5kZXgsIGRlc3RpbmF0aW9uXSkuZHJhdyhmYWxzZSk7XG5cbiAgICAgICAgLy8gVHJpZ2dlciBFdmVudFxuICAgICAgICBjb25zdCBvcmRlciA9ICR0aGlzLkRhdGFUYWJsZSgpLm9yZGVyKClbMF07XG4gICAgICAgIGNvbnN0IHtjb2x1bW5zfSA9ICR0aGlzLkRhdGFUYWJsZSgpLmluaXQoKTtcbiAgICAgICAgY29uc3QgaW5mbyA9IHtcbiAgICAgICAgICAgIGluZGV4OiBvcmRlclswXSxcbiAgICAgICAgICAgIG5hbWU6IGNvbHVtbnNbb3JkZXJbMF1dLm5hbWUsXG4gICAgICAgICAgICBkaXJlY3Rpb246IG9yZGVyWzFdXG4gICAgICAgIH07XG5cbiAgICAgICAgJHRoaXMudHJpZ2dlcignZGF0YXRhYmxlX2N1c3RvbV9zb3J0aW5nOmNoYW5nZScsIFtpbmZvXSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJHRoaXMub24oJ3ByZUluaXQuZHQnLCAoKSA9PiB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZCB0cjpmaXJzdCB0aC5zb3J0aW5nJylcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9vblRhYmxlSGVhZGVyQ2VsbENsaWNrKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuXG59KTsgXG4iXX0=
