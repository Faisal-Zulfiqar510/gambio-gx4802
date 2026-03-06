'use strict';

/* --------------------------------------------------------------
 datatable_loading_spinner.js 2017-03-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable DataTable Loading Spinner
 *
 * The loading spinner will be visible during every DataTable AJAX request.
 *
 * ### Options
 *
 * ** Z-Index Reference Selector | `data-datatable_loading_spinner-z-index-reference-selector` | String | Optional**
 * Provide a reference selector that will be used as a z-index reference. Defaults to ".table-fixed-header thead.fixed".
 *
 * @module Admin/Extensions/datatable_loading_spinner
 */
gx.extensions.module('datatable_loading_spinner', ['loading_spinner'], function (data) {

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
   * Default Options
   *
   * @type {Object}
   */
  var defaults = {
    zIndexReferenceSelector: '.table-fixed-header thead.fixed'
  };

  /**
   * Final Options
   *
   * @type {Object}
   */
  var options = $.extend(true, {}, defaults, data);

  /**
   * Module Instance
   *
   * @type {Object}
   */
  var module = {};

  /**
   * Loading Spinner Selector
   *
   * @type {jQuery}
   */
  var $spinner = void 0;

  // ------------------------------------------------------------------------
  // FUNCTIONS
  // ------------------------------------------------------------------------

  /**
   * On Pre DataTable XHR Event
   *
   * Display the loading spinner on the table.
   */
  function _onDataTablePreXhr() {
    var zIndex = parseInt($(options.zIndexReferenceSelector).css('z-index'));
    $spinner = jse.libs.loading_spinner.show($this, zIndex);
  }

  /**
   * On XHR DataTable Event
   *
   * Hide the displayed loading spinner.
   */
  function _onDataTableXhr() {
    if ($spinner) {
      jse.libs.loading_spinner.hide($spinner);
    }
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $this.on('preXhr.dt', _onDataTablePreXhr).on('xhr.dt', _onDataTableXhr);

    $(window).on('JSENGINE_INIT_FINISHED', function () {
      _onDataTablePreXhr();

      // Hide the spinner if the table is already loaded.
      if ($this.DataTable().ajax.json() !== undefined) {
        _onDataTableXhr();
      }
    });

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9sb2FkaW5nX3NwaW5uZXIuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiekluZGV4UmVmZXJlbmNlU2VsZWN0b3IiLCJvcHRpb25zIiwiZXh0ZW5kIiwiJHNwaW5uZXIiLCJfb25EYXRhVGFibGVQcmVYaHIiLCJ6SW5kZXgiLCJwYXJzZUludCIsImNzcyIsImpzZSIsImxpYnMiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwiX29uRGF0YVRhYmxlWGhyIiwiaGlkZSIsImluaXQiLCJkb25lIiwib24iLCJ3aW5kb3ciLCJEYXRhVGFibGUiLCJhamF4IiwianNvbiIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7QUFZQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQXFCLDJCQUFyQixFQUFrRCxDQUFDLGlCQUFELENBQWxELEVBQXVFLFVBQVVDLElBQVYsRUFBZ0I7O0FBRW5GOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsV0FBVztBQUNiQyw2QkFBeUI7QUFEWixHQUFqQjs7QUFJQTs7Ozs7QUFLQSxNQUFNQyxVQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJILFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxNQUFNRCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsTUFBSVEsaUJBQUo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFdBQVNDLGtCQUFULEdBQThCO0FBQzFCLFFBQU1DLFNBQVNDLFNBQVNSLEVBQUVHLFFBQVFELHVCQUFWLEVBQW1DTyxHQUFuQyxDQUF1QyxTQUF2QyxDQUFULENBQWY7QUFDQUosZUFBV0ssSUFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCQyxJQUF6QixDQUE4QmQsS0FBOUIsRUFBcUNRLE1BQXJDLENBQVg7QUFDSDs7QUFFRDs7Ozs7QUFLQSxXQUFTTyxlQUFULEdBQTJCO0FBQ3ZCLFFBQUlULFFBQUosRUFBYztBQUNWSyxVQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJHLElBQXpCLENBQThCVixRQUE5QjtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOztBQUVBUixTQUFPbUIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJsQixVQUNLbUIsRUFETCxDQUNRLFdBRFIsRUFDcUJaLGtCQURyQixFQUVLWSxFQUZMLENBRVEsUUFGUixFQUVrQkosZUFGbEI7O0FBSUFkLE1BQUVtQixNQUFGLEVBQVVELEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFNO0FBQ3pDWjs7QUFFQTtBQUNBLFVBQUlQLE1BQU1xQixTQUFOLEdBQWtCQyxJQUFsQixDQUF1QkMsSUFBdkIsT0FBa0NDLFNBQXRDLEVBQWlEO0FBQzdDVDtBQUNIO0FBQ0osS0FQRDs7QUFTQUc7QUFDSCxHQWZEOztBQWlCQSxTQUFPcEIsTUFBUDtBQUVILENBN0ZEIiwiZmlsZSI6ImRhdGF0YWJsZV9sb2FkaW5nX3NwaW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGF0YWJsZV9sb2FkaW5nX3NwaW5uZXIuanMgMjAxNy0wMy0xNlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRW5hYmxlIERhdGFUYWJsZSBMb2FkaW5nIFNwaW5uZXJcbiAqXG4gKiBUaGUgbG9hZGluZyBzcGlubmVyIHdpbGwgYmUgdmlzaWJsZSBkdXJpbmcgZXZlcnkgRGF0YVRhYmxlIEFKQVggcmVxdWVzdC5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqIFotSW5kZXggUmVmZXJlbmNlIFNlbGVjdG9yIHwgYGRhdGEtZGF0YXRhYmxlX2xvYWRpbmdfc3Bpbm5lci16LWluZGV4LXJlZmVyZW5jZS1zZWxlY3RvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKiBQcm92aWRlIGEgcmVmZXJlbmNlIHNlbGVjdG9yIHRoYXQgd2lsbCBiZSB1c2VkIGFzIGEgei1pbmRleCByZWZlcmVuY2UuIERlZmF1bHRzIHRvIFwiLnRhYmxlLWZpeGVkLWhlYWRlciB0aGVhZC5maXhlZFwiLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9kYXRhdGFibGVfbG9hZGluZ19zcGlubmVyXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKCdkYXRhdGFibGVfbG9hZGluZ19zcGlubmVyJywgWydsb2FkaW5nX3NwaW5uZXInXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgekluZGV4UmVmZXJlbmNlU2VsZWN0b3I6ICcudGFibGUtZml4ZWQtaGVhZGVyIHRoZWFkLmZpeGVkJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTG9hZGluZyBTcGlubmVyIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGxldCAkc3Bpbm5lcjtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogT24gUHJlIERhdGFUYWJsZSBYSFIgRXZlbnRcbiAgICAgKlxuICAgICAqIERpc3BsYXkgdGhlIGxvYWRpbmcgc3Bpbm5lciBvbiB0aGUgdGFibGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uRGF0YVRhYmxlUHJlWGhyKCkge1xuICAgICAgICBjb25zdCB6SW5kZXggPSBwYXJzZUludCgkKG9wdGlvbnMuekluZGV4UmVmZXJlbmNlU2VsZWN0b3IpLmNzcygnei1pbmRleCcpKTtcbiAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcywgekluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBYSFIgRGF0YVRhYmxlIEV2ZW50XG4gICAgICpcbiAgICAgKiBIaWRlIHRoZSBkaXNwbGF5ZWQgbG9hZGluZyBzcGlubmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkRhdGFUYWJsZVhocigpIHtcbiAgICAgICAgaWYgKCRzcGlubmVyKSB7XG4gICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9uKCdwcmVYaHIuZHQnLCBfb25EYXRhVGFibGVQcmVYaHIpXG4gICAgICAgICAgICAub24oJ3hoci5kdCcsIF9vbkRhdGFUYWJsZVhocik7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdKU0VOR0lORV9JTklUX0ZJTklTSEVEJywgKCkgPT4ge1xuICAgICAgICAgICAgX29uRGF0YVRhYmxlUHJlWGhyKCk7XG5cbiAgICAgICAgICAgIC8vIEhpZGUgdGhlIHNwaW5uZXIgaWYgdGhlIHRhYmxlIGlzIGFscmVhZHkgbG9hZGVkLlxuICAgICAgICAgICAgaWYgKCR0aGlzLkRhdGFUYWJsZSgpLmFqYXguanNvbigpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBfb25EYXRhVGFibGVYaHIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuXG59KTsiXX0=
