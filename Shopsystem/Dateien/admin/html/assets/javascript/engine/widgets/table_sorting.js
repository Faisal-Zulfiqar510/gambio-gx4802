'use strict';

/* --------------------------------------------------------------
 statistic_box.js 2016-02-18
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Table Sorting Widget
 *
 * Widget to sort the categories and customers table.
 *
 * ### Example
 *
 * ```html
 * <table data-gx-widget="table_sorting">
 *   <td data-use-table_sorting="true"
 *      data-column="model"
 *      data-section="categories"
 *      data-direction="desc"
 *      data-active-caret="false">
 *    Artikel-Nr.
 *  </td>
 * </table>
 * ```
 *
 * Parameters:
 *   - column: The column which changes the sort order
 *   - section: Section of the table. Example: "categories"
 *   - direction: Ascending or descending. Example: "desc"
 *   - active-caret: Should the caret be added to this element? Example "true"
 *
 * Events:
 *   - Triggering click event on the target element on the mapping hash
 *
 * @module Admin/Widgets/table_sorting
 * @requires jQueryUI-Library
 * @ignore
 */
gx.widgets.module('table_sorting', [], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // ELEMENT DEFINITION
    // ------------------------------------------------------------------------

    // Elements

    var $this = $(this),


    // The hidden table row which contains the links for the specific sortings
    hiddenSortbar = 'tr.dataTableHeadingRow_sortbar.hidden',
        caretUp = '<i class="fa fa-caret-up caret"></i>',
        caretDown = '<i class="fa fa-caret-down caret"></i>';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    // Widget defaults
    var defaults = {
        elementChildren: '[data-use-table_sorting="true"]',
        caret: '.caret'
    },
        options = $.extend(true, {}, defaults, data),
        module = {};

    // ------------------------------------------------------------------------
    // Mapping hash
    // ------------------------------------------------------------------------

    /**
     * Mappings to the correct links to trigger the table sorting.
     */
    var mapping = {
        categories: {
            sort: {
                asc: 'a.sort',
                desc: 'a.sort-desc'
            },
            name: {
                asc: 'a.name',
                desc: 'a.name-desc'
            },
            model: {
                asc: 'a.model',
                desc: 'a.model-desc'
            },
            stock: {
                asc: 'a.stock',
                desc: 'a.stock-desc'
            },
            status: {
                asc: 'a.status',
                desc: 'a.status-desc'
            },
            startpage: {
                asc: 'a.startpage',
                desc: 'a.startpage-desc'
            },
            price: {
                asc: 'a.price',
                desc: 'a.price-desc'
            },
            discount: {
                asc: 'a.discount',
                desc: 'a.discount-desc'
            }
        },
        customers: {
            lastName: {
                asc: 'a.customers_lastname',
                desc: 'a.customers_lastname-desc'
            },
            firstName: {
                asc: 'a.customers_firstname',
                desc: 'a.customers_firstname-desc'
            },
            dateAccountCreated: {
                asc: 'a.date_account_created',
                desc: 'a.date_account_created-desc'
            },
            dateLastLogon: {
                asc: 'a.date_last_logon',
                desc: 'a.date_last_logon-desc'
            }
        }
    };

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Find Target Selector
     *
     * Looks for the target element in the mapping hash and returns the found element.
     *
     * @param {string} section Current section (e.g. 'customers', 'categories', etc.)
     * @param {string} column Column identifier (e.g. 'model', 'price', etc)
     * @param {string} direction Sort direction (e.g. 'asc', 'desc')
     *
     * @throws Error if the element could not be found in the mapping hash
     *
     * @returns {*|jQuery|HTMLElement}
     * @private
     */
    var _findTargetSelector = function _findTargetSelector(section, column, direction) {

        // If the link is available in the mapping hash
        if (section in mapping && column in mapping[section] && direction in mapping[section][column]) {
            // Check the current sort order direction to get the opposite direction
            var targetDirection = direction === 'asc' ? 'desc' : 'asc';

            // The found element from the hash
            var $element = $(hiddenSortbar).find(mapping[section][column][targetDirection]);
            return $element;
        } else {
            throw new Error('Could not find target element');
        }
    };

    /**
     * Open Target Link
     *
     * Maps the column header click events to the correct links.
     *
     * @param event
     * @private
     */
    var _openTargetLink = function _openTargetLink(event) {
        // Clicked element
        var $sourceElement = $(event.target);

        // Retrieve data attributes from element
        var section = $sourceElement.data('section'),
            column = $sourceElement.data('column'),
            direction = $sourceElement.data('direction');

        // Find the correct target selector
        var $targetElement = _findTargetSelector(section, column, direction);

        var targetLink = $targetElement.attr('href');

        // Open the target elements link
        window.open(targetLink, '_self');
    };

    /**
     * Register Children
     *
     * @private
     */
    var _registerChildren = function _registerChildren() {
        $(options.elementChildren).on('click', _openTargetLink);

        // Trigger parent click when caret is clicked
        $(options.caret).on('click', function () {
            $(options.caret).parent().click();
        });
    };

    var _addCaret = function _addCaret() {
        var $activeCaret = $('[data-active-caret="true"]');

        if ($activeCaret.data('direction') === 'asc') {
            $activeCaret.append(caretUp);
        } else {
            $activeCaret.append(caretDown);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        _addCaret();
        _registerChildren();
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYmxlX3NvcnRpbmcuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImhpZGRlblNvcnRiYXIiLCJjYXJldFVwIiwiY2FyZXREb3duIiwiZGVmYXVsdHMiLCJlbGVtZW50Q2hpbGRyZW4iLCJjYXJldCIsIm9wdGlvbnMiLCJleHRlbmQiLCJtYXBwaW5nIiwiY2F0ZWdvcmllcyIsInNvcnQiLCJhc2MiLCJkZXNjIiwibmFtZSIsIm1vZGVsIiwic3RvY2siLCJzdGF0dXMiLCJzdGFydHBhZ2UiLCJwcmljZSIsImRpc2NvdW50IiwiY3VzdG9tZXJzIiwibGFzdE5hbWUiLCJmaXJzdE5hbWUiLCJkYXRlQWNjb3VudENyZWF0ZWQiLCJkYXRlTGFzdExvZ29uIiwiX2ZpbmRUYXJnZXRTZWxlY3RvciIsInNlY3Rpb24iLCJjb2x1bW4iLCJkaXJlY3Rpb24iLCJ0YXJnZXREaXJlY3Rpb24iLCIkZWxlbWVudCIsImZpbmQiLCJFcnJvciIsIl9vcGVuVGFyZ2V0TGluayIsImV2ZW50IiwiJHNvdXJjZUVsZW1lbnQiLCJ0YXJnZXQiLCIkdGFyZ2V0RWxlbWVudCIsInRhcmdldExpbmsiLCJhdHRyIiwid2luZG93Iiwib3BlbiIsIl9yZWdpc3RlckNoaWxkcmVuIiwib24iLCJwYXJlbnQiLCJjbGljayIsIl9hZGRDYXJldCIsIiRhY3RpdmVDYXJldCIsImFwcGVuZCIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxlQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUNBLFFBQUlDLFFBQVFDLEVBQUUsSUFBRixDQUFaOzs7QUFFSTtBQUNBQyxvQkFBZ0IsdUNBSHBCO0FBQUEsUUFJSUMsVUFB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WixFQUF3QixPQUF4QjtBQUNILEtBaEJEOztBQWtCQTs7Ozs7QUFLQSxRQUFJSSxvQkFBb0IsU0FBcEJBLGlCQUFvQixHQUFZO0FBQ2hDM0MsVUFBRU8sUUFBUUYsZUFBVixFQUEyQnVDLEVBQTNCLENBQThCLE9BQTlCLEVBQXVDVixlQUF2Qzs7QUFFQTtBQUNBbEMsVUFBRU8sUUFBUUQsS0FBVixFQUFpQnNDLEVBQWpCLENBQW9CLE9BQXBCLEVBQTZCLFlBQVk7QUFDckM1QyxjQUFFTyxRQUFRRCxLQUFWLEVBQWlCdUMsTUFBakIsR0FBMEJDLEtBQTFCO0FBQ0gsU0FGRDtBQUdILEtBUEQ7O0FBU0EsUUFBSUMsWUFBWSxTQUFaQSxTQUFZLEdBQVk7QUFDeEIsWUFBSUMsZUFBZWhELEVBQUUsNEJBQUYsQ0FBbkI7O0FBRUEsWUFBSWdELGFBQWFsRCxJQUFiLENBQWtCLFdBQWxCLE1BQW1DLEtBQXZDLEVBQThDO0FBQzFDa0QseUJBQWFDLE1BQWIsQ0FBb0IvQyxPQUFwQjtBQUNILFNBRkQsTUFFTztBQUNIOEMseUJBQWFDLE1BQWIsQ0FBb0I5QyxTQUFwQjtBQUNIO0FBQ0osS0FSRDs7QUFXQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBTixXQUFPcUQsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJKO0FBQ0FKO0FBQ0FRO0FBQ0gsS0FKRDs7QUFNQTtBQUNBLFdBQU90RCxNQUFQO0FBQ0gsQ0F0TUwiLCJmaWxlIjoidGFibGVfc29ydGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3RhdGlzdGljX2JveC5qcyAyMDE2LTAyLTE4XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBUYWJsZSBTb3J0aW5nIFdpZGdldFxuICpcbiAqIFdpZGdldCB0byBzb3J0IHRoZSBjYXRlZ29yaWVzIGFuZCBjdXN0b21lcnMgdGFibGUuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBodG1sXG4gKiA8dGFibGUgZGF0YS1neC13aWRnZXQ9XCJ0YWJsZV9zb3J0aW5nXCI+XG4gKiAgIDx0ZCBkYXRhLXVzZS10YWJsZV9zb3J0aW5nPVwidHJ1ZVwiXG4gKiAgICAgIGRhdGEtY29sdW1uPVwibW9kZWxcIlxuICogICAgICBkYXRhLXNlY3Rpb249XCJjYXRlZ29yaWVzXCJcbiAqICAgICAgZGF0YS1kaXJlY3Rpb249XCJkZXNjXCJcbiAqICAgICAgZGF0YS1hY3RpdmUtY2FyZXQ9XCJmYWxzZVwiPlxuICogICAgQXJ0aWtlbC1Oci5cbiAqICA8L3RkPlxuICogPC90YWJsZT5cbiAqIGBgYFxuICpcbiAqIFBhcmFtZXRlcnM6XG4gKiAgIC0gY29sdW1uOiBUaGUgY29sdW1uIHdoaWNoIGNoYW5nZXMgdGhlIHNvcnQgb3JkZXJcbiAqICAgLSBzZWN0aW9uOiBTZWN0aW9uIG9mIHRoZSB0YWJsZS4gRXhhbXBsZTogXCJjYXRlZ29yaWVzXCJcbiAqICAgLSBkaXJlY3Rpb246IEFzY2VuZGluZyBvciBkZXNjZW5kaW5nLiBFeGFtcGxlOiBcImRlc2NcIlxuICogICAtIGFjdGl2ZS1jYXJldDogU2hvdWxkIHRoZSBjYXJldCBiZSBhZGRlZCB0byB0aGlzIGVsZW1lbnQ/IEV4YW1wbGUgXCJ0cnVlXCJcbiAqXG4gKiBFdmVudHM6XG4gKiAgIC0gVHJpZ2dlcmluZyBjbGljayBldmVudCBvbiB0aGUgdGFyZ2V0IGVsZW1lbnQgb24gdGhlIG1hcHBpbmcgaGFzaFxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy90YWJsZV9zb3J0aW5nXG4gKiBAcmVxdWlyZXMgalF1ZXJ5VUktTGlicmFyeVxuICogQGlnbm9yZVxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAndGFibGVfc29ydGluZycsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFTEVNRU5UIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLy8gRWxlbWVudHNcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLy8gVGhlIGhpZGRlbiB0YWJsZSByb3cgd2hpY2ggY29udGFpbnMgdGhlIGxpbmtzIGZvciB0aGUgc3BlY2lmaWMgc29ydGluZ3NcbiAgICAgICAgICAgIGhpZGRlblNvcnRiYXIgPSAndHIuZGF0YVRhYmxlSGVhZGluZ1Jvd19zb3J0YmFyLmhpZGRlbicsXG4gICAgICAgICAgICBjYXJldFVwID0gJzxpIGNsYXNzPVwiZmEgZmEtY2FyZXQtdXAgY2FyZXRcIj48L2k+JyxcbiAgICAgICAgICAgIGNhcmV0RG93biA9ICc8aSBjbGFzcz1cImZhIGZhLWNhcmV0LWRvd24gY2FyZXRcIj48L2k+JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyBXaWRnZXQgZGVmYXVsdHNcbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRDaGlsZHJlbjogJ1tkYXRhLXVzZS10YWJsZV9zb3J0aW5nPVwidHJ1ZVwiXScsXG4gICAgICAgICAgICAgICAgY2FyZXQ6ICcuY2FyZXQnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBNYXBwaW5nIGhhc2hcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hcHBpbmdzIHRvIHRoZSBjb3JyZWN0IGxpbmtzIHRvIHRyaWdnZXIgdGhlIHRhYmxlIHNvcnRpbmcuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgbWFwcGluZyA9IHtcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IHtcbiAgICAgICAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICAgICAgICAgIGFzYzogJ2Euc29ydCcsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhLnNvcnQtZGVzYydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgICAgICAgICAgYXNjOiAnYS5uYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2EubmFtZS1kZXNjJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgYXNjOiAnYS5tb2RlbCcsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhLm1vZGVsLWRlc2MnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdG9jazoge1xuICAgICAgICAgICAgICAgICAgICBhc2M6ICdhLnN0b2NrJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2Euc3RvY2stZGVzYydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgICAgICBhc2M6ICdhLnN0YXR1cycsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhLnN0YXR1cy1kZXNjJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3RhcnRwYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgIGFzYzogJ2Euc3RhcnRwYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2Euc3RhcnRwYWdlLWRlc2MnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcmljZToge1xuICAgICAgICAgICAgICAgICAgICBhc2M6ICdhLnByaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2EucHJpY2UtZGVzYydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRpc2NvdW50OiB7XG4gICAgICAgICAgICAgICAgICAgIGFzYzogJ2EuZGlzY291bnQnLFxuICAgICAgICAgICAgICAgICAgICBkZXNjOiAnYS5kaXNjb3VudC1kZXNjJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXN0b21lcnM6IHtcbiAgICAgICAgICAgICAgICBsYXN0TmFtZToge1xuICAgICAgICAgICAgICAgICAgICBhc2M6ICdhLmN1c3RvbWVyc19sYXN0bmFtZScsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhLmN1c3RvbWVyc19sYXN0bmFtZS1kZXNjJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZmlyc3ROYW1lOiB7XG4gICAgICAgICAgICAgICAgICAgIGFzYzogJ2EuY3VzdG9tZXJzX2ZpcnN0bmFtZScsXG4gICAgICAgICAgICAgICAgICAgIGRlc2M6ICdhLmN1c3RvbWVyc19maXJzdG5hbWUtZGVzYydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGVBY2NvdW50Q3JlYXRlZDoge1xuICAgICAgICAgICAgICAgICAgICBhc2M6ICdhLmRhdGVfYWNjb3VudF9jcmVhdGVkJyxcbiAgICAgICAgICAgICAgICAgICAgZGVzYzogJ2EuZGF0ZV9hY2NvdW50X2NyZWF0ZWQtZGVzYydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGVMYXN0TG9nb246IHtcbiAgICAgICAgICAgICAgICAgICAgYXNjOiAnYS5kYXRlX2xhc3RfbG9nb24nLFxuICAgICAgICAgICAgICAgICAgICBkZXNjOiAnYS5kYXRlX2xhc3RfbG9nb24tZGVzYydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluZCBUYXJnZXQgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogTG9va3MgZm9yIHRoZSB0YXJnZXQgZWxlbWVudCBpbiB0aGUgbWFwcGluZyBoYXNoIGFuZCByZXR1cm5zIHRoZSBmb3VuZCBlbGVtZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VjdGlvbiBDdXJyZW50IHNlY3Rpb24gKGUuZy4gJ2N1c3RvbWVycycsICdjYXRlZ29yaWVzJywgZXRjLilcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbHVtbiBDb2x1bW4gaWRlbnRpZmllciAoZS5nLiAnbW9kZWwnLCAncHJpY2UnLCBldGMpXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkaXJlY3Rpb24gU29ydCBkaXJlY3Rpb24gKGUuZy4gJ2FzYycsICdkZXNjJylcbiAgICAgICAgICpcbiAgICAgICAgICogQHRocm93cyBFcnJvciBpZiB0aGUgZWxlbWVudCBjb3VsZCBub3QgYmUgZm91bmQgaW4gdGhlIG1hcHBpbmcgaGFzaFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7KnxqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2ZpbmRUYXJnZXRTZWxlY3RvciA9IGZ1bmN0aW9uIChzZWN0aW9uLCBjb2x1bW4sIGRpcmVjdGlvbikge1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgbGluayBpcyBhdmFpbGFibGUgaW4gdGhlIG1hcHBpbmcgaGFzaFxuICAgICAgICAgICAgaWYgKHNlY3Rpb24gaW4gbWFwcGluZyAmJlxuICAgICAgICAgICAgICAgIGNvbHVtbiBpbiBtYXBwaW5nW3NlY3Rpb25dICYmXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uIGluIG1hcHBpbmdbc2VjdGlvbl1bY29sdW1uXVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIGN1cnJlbnQgc29ydCBvcmRlciBkaXJlY3Rpb24gdG8gZ2V0IHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb25cbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0RGlyZWN0aW9uID0gKGRpcmVjdGlvbiA9PT0gJ2FzYycpID8gJ2Rlc2MnIDogJ2FzYyc7XG5cbiAgICAgICAgICAgICAgICAvLyBUaGUgZm91bmQgZWxlbWVudCBmcm9tIHRoZSBoYXNoXG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJChoaWRkZW5Tb3J0YmFyKS5maW5kKG1hcHBpbmdbc2VjdGlvbl1bY29sdW1uXVt0YXJnZXREaXJlY3Rpb25dKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgdGFyZ2V0IGVsZW1lbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBUYXJnZXQgTGlua1xuICAgICAgICAgKlxuICAgICAgICAgKiBNYXBzIHRoZSBjb2x1bW4gaGVhZGVyIGNsaWNrIGV2ZW50cyB0byB0aGUgY29ycmVjdCBsaW5rcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGV2ZW50XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29wZW5UYXJnZXRMaW5rID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBDbGlja2VkIGVsZW1lbnRcbiAgICAgICAgICAgIHZhciAkc291cmNlRWxlbWVudCA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gUmV0cmlldmUgZGF0YSBhdHRyaWJ1dGVzIGZyb20gZWxlbWVudFxuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSAkc291cmNlRWxlbWVudC5kYXRhKCdzZWN0aW9uJyksXG4gICAgICAgICAgICAgICAgY29sdW1uID0gJHNvdXJjZUVsZW1lbnQuZGF0YSgnY29sdW1uJyksXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gJHNvdXJjZUVsZW1lbnQuZGF0YSgnZGlyZWN0aW9uJyk7XG5cbiAgICAgICAgICAgIC8vIEZpbmQgdGhlIGNvcnJlY3QgdGFyZ2V0IHNlbGVjdG9yXG4gICAgICAgICAgICB2YXIgJHRhcmdldEVsZW1lbnQgPSBfZmluZFRhcmdldFNlbGVjdG9yKHNlY3Rpb24sIGNvbHVtbiwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgdmFyIHRhcmdldExpbmsgPSAkdGFyZ2V0RWxlbWVudC5hdHRyKCdocmVmJyk7XG5cbiAgICAgICAgICAgIC8vIE9wZW4gdGhlIHRhcmdldCBlbGVtZW50cyBsaW5rXG4gICAgICAgICAgICB3aW5kb3cub3Blbih0YXJnZXRMaW5rLCAnX3NlbGYnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVnaXN0ZXIgQ2hpbGRyZW5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfcmVnaXN0ZXJDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQob3B0aW9ucy5lbGVtZW50Q2hpbGRyZW4pLm9uKCdjbGljaycsIF9vcGVuVGFyZ2V0TGluayk7XG5cbiAgICAgICAgICAgIC8vIFRyaWdnZXIgcGFyZW50IGNsaWNrIHdoZW4gY2FyZXQgaXMgY2xpY2tlZFxuICAgICAgICAgICAgJChvcHRpb25zLmNhcmV0KS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJChvcHRpb25zLmNhcmV0KS5wYXJlbnQoKS5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9hZGRDYXJldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkYWN0aXZlQ2FyZXQgPSAkKCdbZGF0YS1hY3RpdmUtY2FyZXQ9XCJ0cnVlXCJdJyk7XG5cbiAgICAgICAgICAgIGlmICgkYWN0aXZlQ2FyZXQuZGF0YSgnZGlyZWN0aW9uJykgPT09ICdhc2MnKSB7XG4gICAgICAgICAgICAgICAgJGFjdGl2ZUNhcmV0LmFwcGVuZChjYXJldFVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGFjdGl2ZUNhcmV0LmFwcGVuZChjYXJldERvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIF9hZGRDYXJldCgpO1xuICAgICAgICAgICAgX3JlZ2lzdGVyQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
