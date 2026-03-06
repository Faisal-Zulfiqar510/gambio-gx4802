'use strict';

/* --------------------------------------------------------------
 datatable_default_actions.js 2016-10-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Enable Default Dropdown Actions
 *
 * This extension will handle the "defaultRowAction" and "defaultBulkAction" data attributes of the table upon
 * initialization or user click.
 *
 * ### Options
 *
 * **Default Row Action | `data-datatable_default_actions-row` | String | Required**
 *
 * Provide the default row action. This will automatically be mapped to the defaultRowAction data value of the table.
 *
 * **Default Bulk Action | `data-datatable_default_actions-bulk` | String | Required**
 *
 * Provide the default bulk action. This will automatically be mapped to the defaultBulkAction data value of the table.
 *
 * **Bulk Action Selector | `data-datatable_default_actions-bulk-action-selector` | String | Optional**
 *
 * Provide a selector for the bulk action dropdown widget. The default value is '.bulk-action'.
 *
 * ### Methods
 *
 * **Ensure Default Task**
 *
 * This method will make sure that there is a default task selected. Call it after you setup the row or bulk dropdown
 * actions. Sometimes the user_configuration db value might contain a default value that is not present in the dropdowns
 * anymore (e.g. removed module). In order to make sure that there will always be a default value use this method after
 * creating the dropdown actions and it will use the first dropdown action as default if needed.
 *
 * ```javascript
 * // Ensure default row actions.
 * $('.table-main').datatable_default_actions('ensure', 'row');
 *
 * // Ensure default bulk actions.
 * $('.table-main').datatable_default_actions('ensure', 'bulk');
 * ```
 *
 * @module Admin/extensions/datatable_default_actions
 */
gx.extensions.module('datatable_default_actions', [gx.source + '/libs/button_dropdown'], function (data) {

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
        bulkActionSelector: '.bulk-action'
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

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Ensure that there will be a default action in the row or bulk dropdowns.
     *
     * @param {String} type Can be whether 'row' or 'bulk'.
     */
    function _ensure(type) {
        var $table = $(this);

        switch (type) {
            case 'row':
                var $rowActions = $table.find('tbody .btn-group.dropdown');
                // debugger;
                $rowActions.each(function () {
                    if ($(this).find('button:empty').length) {
                        var $actionLink = $(this).find('ul li:first a');
                        jse.libs.button_dropdown.setDefaultAction($(this), $actionLink);
                    }
                });

                break;

            case 'bulk':
                var $bulkAction = $(options.bulkActionSelector);

                if ($bulkAction.find('button:first').text() === '') {
                    var $actionLink = $bulkAction.find('ul li:first a');
                    jse.libs.button_dropdown.setDefaultAction($bulkAction, $actionLink);
                }

                break;

            default:
                throw new Error('Invalid "ensure" type given (expected "row" or "bulk" got : "' + type + '").');
        }
    }

    /**
     * On Button Drodpown Action Click
     *
     * Update the defaultBulkAction and defaultRowAction data attributes.
     */
    function _onButtonDropdownActionClick() {
        var property = $(this).parents('.btn-group')[0] === $(options.bulkActionSelector)[0] ? 'defaultBulkAction' : 'defaultRowAction';

        $this.data(property, $(this).data('configurationValue'));
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.data({
            defaultRowAction: options.row,
            defaultBulkAction: options.bulk
        });

        $this.on('click', '.btn-group.dropdown a', _onButtonDropdownActionClick);
        $('body').on('click', options.bulkActionSelector, _onButtonDropdownActionClick);

        // Bind module api to jQuery object.
        $.fn.extend({
            datatable_default_actions: function datatable_default_actions(action) {
                switch (action) {
                    case 'ensure':
                        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        return _ensure.apply(this, args);
                }
            }
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiYnVsa0FjdGlvblNlbGVjdG9yIiwib3B0aW9ucyIsImV4dGVuZCIsIl9lbnN1cmUiLCJ0eXBlIiwiJHRhYmxlIiwiJHJvd0FjdGlvbnMiLCJmaW5kIiwiZWFjaCIsImxlbmd0aCIsIiRhY3Rpb25MaW5rIiwianNlIiwibGlicyIsImJ1dHRvbl9kcm9wZG93biIsInNldERlZmF1bHRBY3Rpb24iLCIkYnVsa0FjdGlvbiIsInRleHQiLCJFcnJvciIsIl9vbkJ1dHRvbkRyb3Bkb3duQWN0aW9uQ2xpY2siLCJwcm9wZXJ0eSIsInBhcmVudHMiLCJpbml0IiwiZG9uZSIsImRlZmF1bHRSb3dBY3Rpb24iLCJyb3ciLCJkZWZhdWx0QnVsa0FjdGlvbiIsImJ1bGsiLCJvbiIsImZuIiwiZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucyIsImFjdGlvbiIsImFyZ3MiLCJhcHBseSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0FBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUFxQiwyQkFBckIsRUFBa0QsQ0FBSUYsR0FBR0csTUFBUCwyQkFBbEQsRUFBeUYsVUFBVUMsSUFBVixFQUFnQjs7QUFFckc7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVztBQUNiQyw0QkFBb0I7QUFEUCxLQUFqQjs7QUFJQTs7Ozs7QUFLQSxRQUFNQyxVQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJILFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRixTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLGFBQVNTLE9BQVQsQ0FBaUJDLElBQWpCLEVBQXVCO0FBQ25CLFlBQU1DLFNBQVNQLEVBQUUsSUFBRixDQUFmOztBQUVBLGdCQUFRTSxJQUFSO0FBQ0ksaUJBQUssS0FBTDtBQUNJLG9CQUFNRSxjQUFjRCxPQUFPRSxJQUFQLENBQVksMkJBQVosQ0FBcEI7QUFDQTtBQUNBRCw0QkFBWUUsSUFBWixDQUFpQixZQUFZO0FBQ3pCLHdCQUFJVixFQUFFLElBQUYsRUFBUVMsSUFBUixDQUFhLGNBQWIsRUFBNkJFLE1BQWpDLEVBQXlDO0FBQ3JDLDRCQUFNQyxjQUFjWixFQUFFLElBQUYsRUFBUVMsSUFBUixDQUFhLGVBQWIsQ0FBcEI7QUFDQUksNEJBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsZ0JBQXpCLENBQTBDaEIsRUFBRSxJQUFGLENBQTFDLEVBQW1EWSxXQUFuRDtBQUNIO0FBQ0osaUJBTEQ7O0FBT0E7O0FBRUosaUJBQUssTUFBTDtBQUNJLG9CQUFNSyxjQUFjakIsRUFBRUcsUUFBUUQsa0JBQVYsQ0FBcEI7O0FBRUEsb0JBQUllLFlBQVlSLElBQVosQ0FBaUIsY0FBakIsRUFBaUNTLElBQWpDLE9BQTRDLEVBQWhELEVBQW9EO0FBQ2hELHdCQUFNTixjQUFjSyxZQUFZUixJQUFaLENBQWlCLGVBQWpCLENBQXBCO0FBQ0FJLHdCQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLGdCQUF6QixDQUEwQ0MsV0FBMUMsRUFBdURMLFdBQXZEO0FBQ0g7O0FBRUQ7O0FBRUo7QUFDSSxzQkFBTSxJQUFJTyxLQUFKLG1FQUEwRWIsSUFBMUUsU0FBTjtBQXhCUjtBQTBCSDs7QUFFRDs7Ozs7QUFLQSxhQUFTYyw0QkFBVCxHQUF3QztBQUNwQyxZQUFNQyxXQUFXckIsRUFBRSxJQUFGLEVBQVFzQixPQUFSLENBQWdCLFlBQWhCLEVBQThCLENBQTlCLE1BQXFDdEIsRUFBRUcsUUFBUUQsa0JBQVYsRUFBOEIsQ0FBOUIsQ0FBckMsR0FDWCxtQkFEVyxHQUNXLGtCQUQ1Qjs7QUFHQUgsY0FBTUQsSUFBTixDQUFXdUIsUUFBWCxFQUFxQnJCLEVBQUUsSUFBRixFQUFRRixJQUFSLENBQWEsb0JBQWIsQ0FBckI7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFGLFdBQU8yQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnpCLGNBQU1ELElBQU4sQ0FBVztBQUNQMkIsOEJBQWtCdEIsUUFBUXVCLEdBRG5CO0FBRVBDLCtCQUFtQnhCLFFBQVF5QjtBQUZwQixTQUFYOztBQUtBN0IsY0FBTThCLEVBQU4sQ0FBUyxPQUFULEVBQWtCLHVCQUFsQixFQUEyQ1QsNEJBQTNDO0FBQ0FwQixVQUFFLE1BQUYsRUFBVTZCLEVBQVYsQ0FBYSxPQUFiLEVBQXNCMUIsUUFBUUQsa0JBQTlCLEVBQWtEa0IsNEJBQWxEOztBQUVBO0FBQ0FwQixVQUFFOEIsRUFBRixDQUFLMUIsTUFBTCxDQUFZO0FBQ1IyQix1Q0FBMkIsbUNBQVVDLE1BQVYsRUFBMkI7QUFDbEQsd0JBQVFBLE1BQVI7QUFDSSx5QkFBSyxRQUFMO0FBQUEsMERBRndDQyxJQUV4QztBQUZ3Q0EsZ0NBRXhDO0FBQUE7O0FBQ0ksK0JBQU81QixRQUFRNkIsS0FBUixDQUFjLElBQWQsRUFBb0JELElBQXBCLENBQVA7QUFGUjtBQUlIO0FBTk8sU0FBWjs7QUFTQVQ7QUFDSCxLQXBCRDs7QUFzQkEsV0FBTzVCLE1BQVA7QUFFSCxDQXZIRCIsImZpbGUiOiJkYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBkYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zLmpzIDIwMTYtMTAtMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEVuYWJsZSBEZWZhdWx0IERyb3Bkb3duIEFjdGlvbnNcbiAqXG4gKiBUaGlzIGV4dGVuc2lvbiB3aWxsIGhhbmRsZSB0aGUgXCJkZWZhdWx0Um93QWN0aW9uXCIgYW5kIFwiZGVmYXVsdEJ1bGtBY3Rpb25cIiBkYXRhIGF0dHJpYnV0ZXMgb2YgdGhlIHRhYmxlIHVwb25cbiAqIGluaXRpYWxpemF0aW9uIG9yIHVzZXIgY2xpY2suXG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKkRlZmF1bHQgUm93IEFjdGlvbiB8IGBkYXRhLWRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMtcm93YCB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBQcm92aWRlIHRoZSBkZWZhdWx0IHJvdyBhY3Rpb24uIFRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIG1hcHBlZCB0byB0aGUgZGVmYXVsdFJvd0FjdGlvbiBkYXRhIHZhbHVlIG9mIHRoZSB0YWJsZS5cbiAqXG4gKiAqKkRlZmF1bHQgQnVsayBBY3Rpb24gfCBgZGF0YS1kYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zLWJ1bGtgIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIFByb3ZpZGUgdGhlIGRlZmF1bHQgYnVsayBhY3Rpb24uIFRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIG1hcHBlZCB0byB0aGUgZGVmYXVsdEJ1bGtBY3Rpb24gZGF0YSB2YWx1ZSBvZiB0aGUgdGFibGUuXG4gKlxuICogKipCdWxrIEFjdGlvbiBTZWxlY3RvciB8IGBkYXRhLWRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMtYnVsay1hY3Rpb24tc2VsZWN0b3JgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFByb3ZpZGUgYSBzZWxlY3RvciBmb3IgdGhlIGJ1bGsgYWN0aW9uIGRyb3Bkb3duIHdpZGdldC4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgJy5idWxrLWFjdGlvbicuXG4gKlxuICogIyMjIE1ldGhvZHNcbiAqXG4gKiAqKkVuc3VyZSBEZWZhdWx0IFRhc2sqKlxuICpcbiAqIFRoaXMgbWV0aG9kIHdpbGwgbWFrZSBzdXJlIHRoYXQgdGhlcmUgaXMgYSBkZWZhdWx0IHRhc2sgc2VsZWN0ZWQuIENhbGwgaXQgYWZ0ZXIgeW91IHNldHVwIHRoZSByb3cgb3IgYnVsayBkcm9wZG93blxuICogYWN0aW9ucy4gU29tZXRpbWVzIHRoZSB1c2VyX2NvbmZpZ3VyYXRpb24gZGIgdmFsdWUgbWlnaHQgY29udGFpbiBhIGRlZmF1bHQgdmFsdWUgdGhhdCBpcyBub3QgcHJlc2VudCBpbiB0aGUgZHJvcGRvd25zXG4gKiBhbnltb3JlIChlLmcuIHJlbW92ZWQgbW9kdWxlKS4gSW4gb3JkZXIgdG8gbWFrZSBzdXJlIHRoYXQgdGhlcmUgd2lsbCBhbHdheXMgYmUgYSBkZWZhdWx0IHZhbHVlIHVzZSB0aGlzIG1ldGhvZCBhZnRlclxuICogY3JlYXRpbmcgdGhlIGRyb3Bkb3duIGFjdGlvbnMgYW5kIGl0IHdpbGwgdXNlIHRoZSBmaXJzdCBkcm9wZG93biBhY3Rpb24gYXMgZGVmYXVsdCBpZiBuZWVkZWQuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogLy8gRW5zdXJlIGRlZmF1bHQgcm93IGFjdGlvbnMuXG4gKiAkKCcudGFibGUtbWFpbicpLmRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMoJ2Vuc3VyZScsICdyb3cnKTtcbiAqXG4gKiAvLyBFbnN1cmUgZGVmYXVsdCBidWxrIGFjdGlvbnMuXG4gKiAkKCcudGFibGUtbWFpbicpLmRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMoJ2Vuc3VyZScsICdidWxrJyk7XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL2V4dGVuc2lvbnMvZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9uc1xuICovXG5neC5leHRlbnNpb25zLm1vZHVsZSgnZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucycsIFtgJHtneC5zb3VyY2V9L2xpYnMvYnV0dG9uX2Ryb3Bkb3duYF0sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgYnVsa0FjdGlvblNlbGVjdG9yOiAnLmJ1bGstYWN0aW9uJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhhdCB0aGVyZSB3aWxsIGJlIGEgZGVmYXVsdCBhY3Rpb24gaW4gdGhlIHJvdyBvciBidWxrIGRyb3Bkb3ducy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIENhbiBiZSB3aGV0aGVyICdyb3cnIG9yICdidWxrJy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZW5zdXJlKHR5cGUpIHtcbiAgICAgICAgY29uc3QgJHRhYmxlID0gJCh0aGlzKTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Jvdyc6XG4gICAgICAgICAgICAgICAgY29uc3QgJHJvd0FjdGlvbnMgPSAkdGFibGUuZmluZCgndGJvZHkgLmJ0bi1ncm91cC5kcm9wZG93bicpO1xuICAgICAgICAgICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICRyb3dBY3Rpb25zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCdidXR0b246ZW1wdHknKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRhY3Rpb25MaW5rID0gJCh0aGlzKS5maW5kKCd1bCBsaTpmaXJzdCBhJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uc2V0RGVmYXVsdEFjdGlvbigkKHRoaXMpLCAkYWN0aW9uTGluayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdidWxrJzpcbiAgICAgICAgICAgICAgICBjb25zdCAkYnVsa0FjdGlvbiA9ICQob3B0aW9ucy5idWxrQWN0aW9uU2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRidWxrQWN0aW9uLmZpbmQoJ2J1dHRvbjpmaXJzdCcpLnRleHQoKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGFjdGlvbkxpbmsgPSAkYnVsa0FjdGlvbi5maW5kKCd1bCBsaTpmaXJzdCBhJyk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5zZXREZWZhdWx0QWN0aW9uKCRidWxrQWN0aW9uLCAkYWN0aW9uTGluayk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFwiZW5zdXJlXCIgdHlwZSBnaXZlbiAoZXhwZWN0ZWQgXCJyb3dcIiBvciBcImJ1bGtcIiBnb3QgOiBcIiR7dHlwZX1cIikuYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBCdXR0b24gRHJvZHBvd24gQWN0aW9uIENsaWNrXG4gICAgICpcbiAgICAgKiBVcGRhdGUgdGhlIGRlZmF1bHRCdWxrQWN0aW9uIGFuZCBkZWZhdWx0Um93QWN0aW9uIGRhdGEgYXR0cmlidXRlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25CdXR0b25Ecm9wZG93bkFjdGlvbkNsaWNrKCkge1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9ICQodGhpcykucGFyZW50cygnLmJ0bi1ncm91cCcpWzBdID09PSAkKG9wdGlvbnMuYnVsa0FjdGlvblNlbGVjdG9yKVswXVxuICAgICAgICAgICAgPyAnZGVmYXVsdEJ1bGtBY3Rpb24nIDogJ2RlZmF1bHRSb3dBY3Rpb24nO1xuXG4gICAgICAgICR0aGlzLmRhdGEocHJvcGVydHksICQodGhpcykuZGF0YSgnY29uZmlndXJhdGlvblZhbHVlJykpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICR0aGlzLmRhdGEoe1xuICAgICAgICAgICAgZGVmYXVsdFJvd0FjdGlvbjogb3B0aW9ucy5yb3csXG4gICAgICAgICAgICBkZWZhdWx0QnVsa0FjdGlvbjogb3B0aW9ucy5idWxrXG4gICAgICAgIH0pO1xuXG4gICAgICAgICR0aGlzLm9uKCdjbGljaycsICcuYnRuLWdyb3VwLmRyb3Bkb3duIGEnLCBfb25CdXR0b25Ecm9wZG93bkFjdGlvbkNsaWNrKTtcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIG9wdGlvbnMuYnVsa0FjdGlvblNlbGVjdG9yLCBfb25CdXR0b25Ecm9wZG93bkFjdGlvbkNsaWNrKTtcblxuICAgICAgICAvLyBCaW5kIG1vZHVsZSBhcGkgdG8galF1ZXJ5IG9iamVjdC5cbiAgICAgICAgJC5mbi5leHRlbmQoe1xuICAgICAgICAgICAgZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9uczogZnVuY3Rpb24gKGFjdGlvbiwgLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2Vuc3VyZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2Vuc3VyZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcblxufSk7Il19
