'use strict';

/* --------------------------------------------------------------
 datatable_custom_pagination.js 2016-06-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable Custom DataTable Pagination
 *
 * This method will bind the appropriate event handlers to the HTML markup of the "datatables_page_length.html"
 * and the "datatables_page_navigation.html" templates. This module will also set a page parameter to the URL
 * on page change but will not parse it upon initialization. This must happen from the module that initializes
 * the table.
 *
 * ### Options
 *
 * **Page Navigation Selector | `data-datatable_custom_pagination-page-navigation-selector` | String | Optional**
 *
 * Provide a selector for the page navigation container element. This option defaults to ".page-navigation" which
 * is also the class of the datatable_page_navigation.html template.
 *
 * **Page Length Selector | `data-datatable_custom_pagination-page-length-selector` | String | Optional**
 *
 * Provide a selector for the page length container element. This option defaults to ".page-length" which
 * is also the class of the datatable_page_length.html template.
 *
 * ### Events
 *
 * ```javascript
 * // Add custom callback once the page is changed (DataTable "info" object contains the new page information).
 * $('#datatable-instance').on('datatable_custom_pagination:page_change', function(event, info) { ... });
 *
 * // Add custom callback once the page length is changed (new page length is provided as second argument).
 * $('#datatable-instance').on('datatable_custom_pagination:length_change', function(event, newPageLength) { ... });
 * ```
 *
 * @module Admin/Extensions/datatable_custom_pagination
 */
gx.extensions.module('datatable_custom_pagination', [], function (data) {

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
    pageNavigationSelector: '.page-navigation',
    pageLengthSelector: '.page-length'
  };

  /**
   * Final Options
   *
   * @type {Object}
   */
  var options = $.extend(true, {}, defaults, data);

  /**
   * Page Navigation Selector
   *
   * @type {jQuery}
   */
  var $pageNavigation = $this.find(options.pageNavigationSelector);

  /**
   * Page Length Selector
   *
   * @type {jQuery}
   */
  var $pageLength = $this.find(options.pageLengthSelector);

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
   * Update Page Navigation Elements
   *
   * Update the info text, set the correct button state and make sure the select box is up-to-date
   * with the current page.
   */
  function _onDataTableDraw() {
    var info = $this.DataTable().page.info();
    var text = $this.DataTable().i18n('sInfo').replace('_START_', info.end !== 0 ? ++info.start : info.start).replace('_END_', info.end).replace('_TOTAL_', info.recordsDisplay);
    $pageNavigation.find('label').text(text);

    // Check if one of the buttons is disabled.
    $pageNavigation.find('.next').prop('disabled', info.page === info.pages - 1 || info.pages === 0);
    $pageNavigation.find('.previous').prop('disabled', info.page === 0);

    // Fill in the pagination select box.
    var $select = $pageNavigation.find('select');

    $select.empty();

    for (var i = 1; i <= info.pages; i++) {
      $select.append(new Option(i + ' ' + jse.core.lang.translate('from', 'admin_labels') + ' ' + info.pages, i));
    }

    $select.val(info.page + 1);

    // Select the initial page length.
    $pageLength.find('select').val($this.DataTable().page.len());
  }

  /**
   * On Page Navigation Select Change Event
   */
  function _onPageNavigationSelectChange() {
    // Change the table page.
    $this.DataTable().page(Number($(this).val()) - 1).draw(false);

    // Trigger Event
    var info = $this.DataTable().page.info();
    $this.trigger('datatable_custom_pagination:page_change', [info]);
  }

  /**
   * On Page Navigation Button Click Event
   */
  function _onPageNavigationButtonClick() {
    // Change the table page.
    var direction = $(this).hasClass('next') ? 'next' : 'previous';
    $this.DataTable().page(direction).draw(false);

    // Trigger Event
    var info = $this.DataTable().page.info();
    $this.trigger('datatable_custom_pagination:page_change', [info]);
  }

  /**
   * On Page Length Select Change Event
   */
  function _onPageLengthSelectChange() {
    var newPageLength = Number($pageLength.find('select').val());
    $this.DataTable().page.len(newPageLength).page(0).draw(false);

    // Trigger Event
    $this.trigger('datatable_custom_pagination:length_change', [newPageLength]);
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $this.on('draw.dt', _onDataTableDraw);

    $pageNavigation.on('change', 'select', _onPageNavigationSelectChange).on('click', 'button', _onPageNavigationButtonClick);

    $pageLength.on('change', 'select', _onPageLengthSelectChange);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbi5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJwYWdlTmF2aWdhdGlvblNlbGVjdG9yIiwicGFnZUxlbmd0aFNlbGVjdG9yIiwib3B0aW9ucyIsImV4dGVuZCIsIiRwYWdlTmF2aWdhdGlvbiIsImZpbmQiLCIkcGFnZUxlbmd0aCIsIl9vbkRhdGFUYWJsZURyYXciLCJpbmZvIiwiRGF0YVRhYmxlIiwicGFnZSIsInRleHQiLCJpMThuIiwicmVwbGFjZSIsImVuZCIsInN0YXJ0IiwicmVjb3Jkc0Rpc3BsYXkiLCJwcm9wIiwicGFnZXMiLCIkc2VsZWN0IiwiZW1wdHkiLCJpIiwiYXBwZW5kIiwiT3B0aW9uIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJ2YWwiLCJsZW4iLCJfb25QYWdlTmF2aWdhdGlvblNlbGVjdENoYW5nZSIsIk51bWJlciIsImRyYXciLCJ0cmlnZ2VyIiwiX29uUGFnZU5hdmlnYXRpb25CdXR0b25DbGljayIsImRpcmVjdGlvbiIsImhhc0NsYXNzIiwiX29uUGFnZUxlbmd0aFNlbGVjdENoYW5nZSIsIm5ld1BhZ2VMZW5ndGgiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FBcUIsNkJBQXJCLEVBQW9ELEVBQXBELEVBQXdELFVBQVVDLElBQVYsRUFBZ0I7O0FBRXBFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsV0FBVztBQUNiQyw0QkFBd0Isa0JBRFg7QUFFYkMsd0JBQW9CO0FBRlAsR0FBakI7O0FBS0E7Ozs7O0FBS0EsTUFBTUMs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QUFsQixDQUF1QkYsSUFBdkIsRUFBYjtBQUNBWCxVQUFNb0MsT0FBTixDQUFjLHlDQUFkLEVBQXlELENBQUN6QixJQUFELENBQXpEO0FBQ0g7O0FBRUQ7OztBQUdBLFdBQVM2Qix5QkFBVCxHQUFxQztBQUNqQyxRQUFNQyxnQkFBZ0JQLE9BQU96QixZQUFZRCxJQUFaLENBQWlCLFFBQWpCLEVBQTJCdUIsR0FBM0IsRUFBUCxDQUF0QjtBQUNBL0IsVUFBTVksU0FBTixHQUFrQkMsSUFBbEIsQ0FBdUJtQixHQUF2QixDQUEyQlMsYUFBM0IsRUFBMEM1QixJQUExQyxDQUErQyxDQUEvQyxFQUFrRHNCLElBQWxELENBQXVELEtBQXZEOztBQUVBO0FBQ0FuQyxVQUFNb0MsT0FBTixDQUFjLDJDQUFkLEVBQTJELENBQUNLLGFBQUQsQ0FBM0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUEzQyxTQUFPNEMsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUIzQyxVQUNLNEMsRUFETCxDQUNRLFNBRFIsRUFDbUJsQyxnQkFEbkI7O0FBR0FILG9CQUNLcUMsRUFETCxDQUNRLFFBRFIsRUFDa0IsUUFEbEIsRUFDNEJYLDZCQUQ1QixFQUVLVyxFQUZMLENBRVEsT0FGUixFQUVpQixRQUZqQixFQUUyQlAsNEJBRjNCOztBQUlBNUIsZ0JBQ0ttQyxFQURMLENBQ1EsUUFEUixFQUNrQixRQURsQixFQUM0QkoseUJBRDVCOztBQUdBRztBQUNILEdBWkQ7O0FBY0EsU0FBTzdDLE1BQVA7QUFFSCxDQWxKRCIsImZpbGUiOiJkYXRhdGFibGVfY3VzdG9tX3BhZ2luYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbi5qcyAyMDE2LTA2LTIwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBFbmFibGUgQ3VzdG9tIERhdGFUYWJsZSBQYWdpbmF0aW9uXG4gKlxuICogVGhpcyBtZXRob2Qgd2lsbCBiaW5kIHRoZSBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVycyB0byB0aGUgSFRNTCBtYXJrdXAgb2YgdGhlIFwiZGF0YXRhYmxlc19wYWdlX2xlbmd0aC5odG1sXCJcbiAqIGFuZCB0aGUgXCJkYXRhdGFibGVzX3BhZ2VfbmF2aWdhdGlvbi5odG1sXCIgdGVtcGxhdGVzLiBUaGlzIG1vZHVsZSB3aWxsIGFsc28gc2V0IGEgcGFnZSBwYXJhbWV0ZXIgdG8gdGhlIFVSTFxuICogb24gcGFnZSBjaGFuZ2UgYnV0IHdpbGwgbm90IHBhcnNlIGl0IHVwb24gaW5pdGlhbGl6YXRpb24uIFRoaXMgbXVzdCBoYXBwZW4gZnJvbSB0aGUgbW9kdWxlIHRoYXQgaW5pdGlhbGl6ZXNcbiAqIHRoZSB0YWJsZS5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqUGFnZSBOYXZpZ2F0aW9uIFNlbGVjdG9yIHwgYGRhdGEtZGF0YXRhYmxlX2N1c3RvbV9wYWdpbmF0aW9uLXBhZ2UtbmF2aWdhdGlvbi1zZWxlY3RvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBhIHNlbGVjdG9yIGZvciB0aGUgcGFnZSBuYXZpZ2F0aW9uIGNvbnRhaW5lciBlbGVtZW50LiBUaGlzIG9wdGlvbiBkZWZhdWx0cyB0byBcIi5wYWdlLW5hdmlnYXRpb25cIiB3aGljaFxuICogaXMgYWxzbyB0aGUgY2xhc3Mgb2YgdGhlIGRhdGF0YWJsZV9wYWdlX25hdmlnYXRpb24uaHRtbCB0ZW1wbGF0ZS5cbiAqXG4gKiAqKlBhZ2UgTGVuZ3RoIFNlbGVjdG9yIHwgYGRhdGEtZGF0YXRhYmxlX2N1c3RvbV9wYWdpbmF0aW9uLXBhZ2UtbGVuZ3RoLXNlbGVjdG9yYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgc2VsZWN0b3IgZm9yIHRoZSBwYWdlIGxlbmd0aCBjb250YWluZXIgZWxlbWVudC4gVGhpcyBvcHRpb24gZGVmYXVsdHMgdG8gXCIucGFnZS1sZW5ndGhcIiB3aGljaFxuICogaXMgYWxzbyB0aGUgY2xhc3Mgb2YgdGhlIGRhdGF0YWJsZV9wYWdlX2xlbmd0aC5odG1sIHRlbXBsYXRlLlxuICpcbiAqICMjIyBFdmVudHNcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBBZGQgY3VzdG9tIGNhbGxiYWNrIG9uY2UgdGhlIHBhZ2UgaXMgY2hhbmdlZCAoRGF0YVRhYmxlIFwiaW5mb1wiIG9iamVjdCBjb250YWlucyB0aGUgbmV3IHBhZ2UgaW5mb3JtYXRpb24pLlxuICogJCgnI2RhdGF0YWJsZS1pbnN0YW5jZScpLm9uKCdkYXRhdGFibGVfY3VzdG9tX3BhZ2luYXRpb246cGFnZV9jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgaW5mbykgeyAuLi4gfSk7XG4gKlxuICogLy8gQWRkIGN1c3RvbSBjYWxsYmFjayBvbmNlIHRoZSBwYWdlIGxlbmd0aCBpcyBjaGFuZ2VkIChuZXcgcGFnZSBsZW5ndGggaXMgcHJvdmlkZWQgYXMgc2Vjb25kIGFyZ3VtZW50KS5cbiAqICQoJyNkYXRhdGFibGUtaW5zdGFuY2UnKS5vbignZGF0YXRhYmxlX2N1c3RvbV9wYWdpbmF0aW9uOmxlbmd0aF9jaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgbmV3UGFnZUxlbmd0aCkgeyAuLi4gfSk7XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL0V4dGVuc2lvbnMvZGF0YXRhYmxlX2N1c3RvbV9wYWdpbmF0aW9uXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKCdkYXRhdGFibGVfY3VzdG9tX3BhZ2luYXRpb24nLCBbXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgcGFnZU5hdmlnYXRpb25TZWxlY3RvcjogJy5wYWdlLW5hdmlnYXRpb24nLFxuICAgICAgICBwYWdlTGVuZ3RoU2VsZWN0b3I6ICcucGFnZS1sZW5ndGgnXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAvKipcbiAgICAgKiBQYWdlIE5hdmlnYXRpb24gU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHBhZ2VOYXZpZ2F0aW9uID0gJHRoaXMuZmluZChvcHRpb25zLnBhZ2VOYXZpZ2F0aW9uU2VsZWN0b3IpO1xuXG4gICAgLyoqXG4gICAgICogUGFnZSBMZW5ndGggU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHBhZ2VMZW5ndGggPSAkdGhpcy5maW5kKG9wdGlvbnMucGFnZUxlbmd0aFNlbGVjdG9yKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIFBhZ2UgTmF2aWdhdGlvbiBFbGVtZW50c1xuICAgICAqXG4gICAgICogVXBkYXRlIHRoZSBpbmZvIHRleHQsIHNldCB0aGUgY29ycmVjdCBidXR0b24gc3RhdGUgYW5kIG1ha2Ugc3VyZSB0aGUgc2VsZWN0IGJveCBpcyB1cC10by1kYXRlXG4gICAgICogd2l0aCB0aGUgY3VycmVudCBwYWdlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkRhdGFUYWJsZURyYXcoKSB7XG4gICAgICAgIGNvbnN0IGluZm8gPSAkdGhpcy5EYXRhVGFibGUoKS5wYWdlLmluZm8oKTtcbiAgICAgICAgY29uc3QgdGV4dCA9ICR0aGlzLkRhdGFUYWJsZSgpLmkxOG4oJ3NJbmZvJylcbiAgICAgICAgICAgIC5yZXBsYWNlKCdfU1RBUlRfJywgaW5mby5lbmQgIT09IDAgPyArK2luZm8uc3RhcnQgOiBpbmZvLnN0YXJ0KVxuICAgICAgICAgICAgLnJlcGxhY2UoJ19FTkRfJywgaW5mby5lbmQpXG4gICAgICAgICAgICAucmVwbGFjZSgnX1RPVEFMXycsIGluZm8ucmVjb3Jkc0Rpc3BsYXkpO1xuICAgICAgICAkcGFnZU5hdmlnYXRpb24uZmluZCgnbGFiZWwnKS50ZXh0KHRleHQpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIG9uZSBvZiB0aGUgYnV0dG9ucyBpcyBkaXNhYmxlZC5cbiAgICAgICAgJHBhZ2VOYXZpZ2F0aW9uLmZpbmQoJy5uZXh0JykucHJvcCgnZGlzYWJsZWQnLCAoaW5mby5wYWdlID09PSAoaW5mby5wYWdlcyAtIDEpIHx8IGluZm8ucGFnZXMgPT09IDApKTtcbiAgICAgICAgJHBhZ2VOYXZpZ2F0aW9uLmZpbmQoJy5wcmV2aW91cycpLnByb3AoJ2Rpc2FibGVkJywgKGluZm8ucGFnZSA9PT0gMCkpO1xuXG4gICAgICAgIC8vIEZpbGwgaW4gdGhlIHBhZ2luYXRpb24gc2VsZWN0IGJveC5cbiAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRwYWdlTmF2aWdhdGlvbi5maW5kKCdzZWxlY3QnKTtcblxuICAgICAgICAkc2VsZWN0LmVtcHR5KCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gaW5mby5wYWdlczsgaSsrKSB7XG4gICAgICAgICAgICAkc2VsZWN0LmFwcGVuZChuZXcgT3B0aW9uKGAke2l9ICR7anNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Zyb20nLCAnYWRtaW5fbGFiZWxzJyl9ICR7aW5mby5wYWdlc31gLCBpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAkc2VsZWN0LnZhbChpbmZvLnBhZ2UgKyAxKTtcblxuICAgICAgICAvLyBTZWxlY3QgdGhlIGluaXRpYWwgcGFnZSBsZW5ndGguXG4gICAgICAgICRwYWdlTGVuZ3RoLmZpbmQoJ3NlbGVjdCcpLnZhbCgkdGhpcy5EYXRhVGFibGUoKS5wYWdlLmxlbigpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBQYWdlIE5hdmlnYXRpb24gU2VsZWN0IENoYW5nZSBFdmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblBhZ2VOYXZpZ2F0aW9uU2VsZWN0Q2hhbmdlKCkge1xuICAgICAgICAvLyBDaGFuZ2UgdGhlIHRhYmxlIHBhZ2UuXG4gICAgICAgICR0aGlzLkRhdGFUYWJsZSgpLnBhZ2UoTnVtYmVyKCQodGhpcykudmFsKCkpIC0gMSkuZHJhdyhmYWxzZSk7XG5cbiAgICAgICAgLy8gVHJpZ2dlciBFdmVudFxuICAgICAgICBjb25zdCBpbmZvID0gJHRoaXMuRGF0YVRhYmxlKCkucGFnZS5pbmZvKCk7XG4gICAgICAgICR0aGlzLnRyaWdnZXIoJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpwYWdlX2NoYW5nZScsIFtpbmZvXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gUGFnZSBOYXZpZ2F0aW9uIEJ1dHRvbiBDbGljayBFdmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblBhZ2VOYXZpZ2F0aW9uQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgIC8vIENoYW5nZSB0aGUgdGFibGUgcGFnZS5cbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gJCh0aGlzKS5oYXNDbGFzcygnbmV4dCcpID8gJ25leHQnIDogJ3ByZXZpb3VzJztcbiAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkucGFnZShkaXJlY3Rpb24pLmRyYXcoZmFsc2UpO1xuXG4gICAgICAgIC8vIFRyaWdnZXIgRXZlbnRcbiAgICAgICAgY29uc3QgaW5mbyA9ICR0aGlzLkRhdGFUYWJsZSgpLnBhZ2UuaW5mbygpO1xuICAgICAgICAkdGhpcy50cmlnZ2VyKCdkYXRhdGFibGVfY3VzdG9tX3BhZ2luYXRpb246cGFnZV9jaGFuZ2UnLCBbaW5mb10pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIFBhZ2UgTGVuZ3RoIFNlbGVjdCBDaGFuZ2UgRXZlbnRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25QYWdlTGVuZ3RoU2VsZWN0Q2hhbmdlKCkge1xuICAgICAgICBjb25zdCBuZXdQYWdlTGVuZ3RoID0gTnVtYmVyKCRwYWdlTGVuZ3RoLmZpbmQoJ3NlbGVjdCcpLnZhbCgpKTtcbiAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkucGFnZS5sZW4obmV3UGFnZUxlbmd0aCkucGFnZSgwKS5kcmF3KGZhbHNlKTtcblxuICAgICAgICAvLyBUcmlnZ2VyIEV2ZW50XG4gICAgICAgICR0aGlzLnRyaWdnZXIoJ2RhdGF0YWJsZV9jdXN0b21fcGFnaW5hdGlvbjpsZW5ndGhfY2hhbmdlJywgW25ld1BhZ2VMZW5ndGhdKTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9uKCdkcmF3LmR0JywgX29uRGF0YVRhYmxlRHJhdyk7XG5cbiAgICAgICAgJHBhZ2VOYXZpZ2F0aW9uXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsICdzZWxlY3QnLCBfb25QYWdlTmF2aWdhdGlvblNlbGVjdENoYW5nZSlcbiAgICAgICAgICAgIC5vbignY2xpY2snLCAnYnV0dG9uJywgX29uUGFnZU5hdmlnYXRpb25CdXR0b25DbGljayk7XG5cbiAgICAgICAgJHBhZ2VMZW5ndGhcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywgJ3NlbGVjdCcsIF9vblBhZ2VMZW5ndGhTZWxlY3RDaGFuZ2UpO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcblxufSk7IFxuIl19
