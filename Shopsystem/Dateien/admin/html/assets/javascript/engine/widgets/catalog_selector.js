'use strict';

/* --------------------------------------------------------------
 catalog_selector.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## CatalogSelector Widget
 *
 * This Widgets generates a selection for products (categories at not implemented yet, but possibil).
 * The given HTML code will be cloned to and modified to create this selection.
 *
 *
 * ### Parent Container Options
 *
 * **Headline text | `data-catalog_selector-headline_text` | String | Required**
 *
 * Textphrase for the collapse headline.
 *
 * **Add button text | `data-catalog_selector-add_button_text` | String | Required**
 *
 * Textphrase for the add new dropdown button.
 *
 * **Form group selector | `data-catalog_selector-group_selector` | String | Optional**
 *
 * This selector is required to select the form group that must be contained in the given HTML.
 *
 * **Label selector | `data-catalog_selector-label_selector` | String | Optional**
 *
 * This selector is required to select the label of the form group.
 *
 * **Dropdown selector | `data-catalog_selector-dropdown_selector` | String | Optional**
 *
 * This selector is required to select dropdown of the form group.
 *
 * **Remove icon column selector | `data-catalog_selector-remove_selector` | String | Optional**
 *
 * This selector is required to select the column for the remove icon of the form group.
 *
 * **Selected data | `data-catalog_selector-selected_data` | String | Optional**
 *
 * Already selected data for the selection.
 *
 *
 * ### Example
 * ```html
 * <div data-gx-widget="catalog_selector"
 *     data-catalog_selector-group_selector=".form-group"
 *     data-catalog_selector-label_selector="label"
 *     data-catalog_selector-dropdown_selector=".catalog-selector-dropdown"
 *     data-catalog_selector-remove_selector=".catalog-selector-remove"
 *     data-catalog_selector-headline_text="HEADLINE"
 *     data-catalog_selector-add_button_text="Add dropdown"
 *     data-catalog_selector-selected_data="1,2,3,4"
 * >
 *     <div class="form-group">
 *         <label class="col-md-4">{$txt.LABEL_SHOW_FOR_PRODUCT}:</label>
 *         <div class="col-md-3">
 *             <select class="form-control catalog-selector-dropdown"
 *             name="content_manager[infopage][sitemap_changefreq][{$languageCode}]"></select>
 *         </div>
 *         <div class="col-md-1 catalog-selector-remove"></div>
 *     </div>
 * </div>
 * ```
 *
 *
 * @module Admin/Widgets/catalog_selector
 */
gx.widgets.module('catalog_selector', [gx.source + '/widgets/collapser'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Widget Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Copy of the given form group
     *
     * @type {object}
     */
    $groupObject = {},


    /**
     * Data that's used to fill the dropdown.
     * Will be loaded by ajax from the widget ajax controller
     *
     * @type string
     */
    dataTreeHtml = '',


    /**
     * Default Options for Widget
     *
     * @type {object}
     */
    defaults = {
        'group_selector': '.form-group',
        'label_selector': 'label',
        'dropdown_selector': '.catalog-selector-dropdown',
        'remove_selector': '.catalog-selector-remove',
        'selected_data': ''
    },


    /**
     * Final Widget Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        // Perform ajax request to collect products and categories
        _performRequest('getProductsTreeAsOptgroups').done(function (response) {
            dataTreeHtml = response.html;
        });

        // Initialize widget html
        $this.append('\n\t\t\t\t\t<fieldset>\n\t                    <div class="frame-wrapper default">\n\t\t\t\t\t\t\t<div class="frame-head"\n\t\t\t\t\t\t\t\tdata-gx-widget="collapser"\n\t\t\t\t\t\t\t\tdata-collapser-target_selector=".frame-content">\n\t\t\t\t\t\t\t\t' + options.headline_text + '\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="frame-content">\n\t\t\t\t\t\t\t\t<div class="catalog-selection-data"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</fieldset>\n\t\t\t');
        $this.find('.catalog-selection-data').parent().append('\n\t\t\t\t\t<button type="button" class="btn catalog-selection-new-dropdown">\n\t\t\t\t\t\t' + options.add_button_text + '\n\t\t\t\t\t</button>\n\t\t\t\t').find('.catalog-selection-new-dropdown').on('click', _onNewDropdown);
        gx.widgets.init($this.parent());

        // Backup form group
        $groupObject = $this.find(options.group_selector);
        $this.find(options.group_selector).remove();

        // Fill dropdown menu of backuped form group with options
        $groupObject.find(options.dropdown_selector).append(dataTreeHtml);

        // Delete given html (It is will not be used anymore)
        $groupObject.clone().appendTo($this.find('.catalog-selection-data'));

        // Add pre-selected data
        _addSelectedData();

        done();
    };

    // ------------------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------------------

    /**
     * Performs the ajax request to collec tthe products and categories
     *
     * @param {String} action
     * @returns {String} JSON
     */
    function _performRequest(action) {
        var URL_BASE = 'admin.php?do=CatalogSelectWidgetAjax/';

        // AJAX request options.
        var ajaxOptions = {
            url: URL_BASE + action,
            async: false,
            dataType: "json"
        };

        // Returns deferred object.
        return $.ajax(ajaxOptions);
    }

    /**
     * Create a new form group with another dropdown
     */
    function _onNewDropdown() {
        $groupObject.clone().appendTo($this.find('.catalog-selection-data')).find(options.label_selector).empty().parent().find(options.remove_selector).append('<i class="fa fa-trash-o" aria-hidden="true"></i>').find('i').on('click', _removeDropdown);
    }

    /**
     * Removes a form group. Will be initialize by a click event on the remove icon.
     */
    function _removeDropdown() {
        $(this).closest(options.group_selector).remove();
    }

    /**
     * Adds the pre selected data.
     */
    function _addSelectedData() {
        if (options.selected_data == '') {
            return;
        }

        if (String(options.selected_data).indexOf(",") == -1) {
            $this.find(options.dropdown_selector + ':last').val(options.selected_data);
            _onNewDropdown();
        } else {
            var selectedData = options.selected_data.split(',');
            console.log(selectedData);
            for (var i in selectedData) {
                $this.find(options.dropdown_selector + ':last').val(selectedData[i]);
                _onNewDropdown();
            }
        }
    }

    // Return data to module engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGFsb2dfc2VsZWN0b3IuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRncm91cE9iamVjdCIsImRhdGFUcmVlSHRtbCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwiX3BlcmZvcm1SZXF1ZXN0IiwicmVzcG9uc2UiLCJodG1sIiwiYXBwZW5kIiwiaGVhZGxpbmVfdGV4dCIsImZpbmQiLCJwYXJlbnQiLCJhZGRfYnV0dG9uX3RleHQiLCJvbiIsIl9vbk5ld0Ryb3Bkb3duIiwiZ3JvdXBfc2VsZWN0b3IiLCJyZW1vdmUiLCJkcm9wZG93bl9zZWxlY3RvciIsImNsb25lIiwiYXBwZW5kVG8iLCJfYWRkU2VsZWN0ZWREYXRhIiwiYWN0aW9uIiwiVVJMX0JBU0UiLCJhamF4T3B0aW9ucyIsInVybCIsImFzeW5jIiwiZGF0YVR5cGUiLCJhamF4IiwibGFiZWxfc2VsZWN0b3IiLCJlbXB0eSIsInJlbW92ZV9zZWxlY3RvciIsIl9yZW1vdmVEcm9wZG93biIsImNsb3Nlc3QiLCJzZWxlY3RlZF9kYXRhIiwiU3RyaW5nIiwiaW5kZXhPZiIsInZhbCIsInNlbGVjdGVkRGF0YSIsInNwbGl0IiwiY29uc29sZSIsImxvZyIsImkiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0RBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxrQkFESixFQUdJLENBQ09GLEdBQUdHLE1BRFYsd0JBSEosRUFPSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLG1CQUFlLEVBYm5COzs7QUFlSTs7Ozs7O0FBTUFD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UUFBUWdDLGFBQVIsQ0FBc0JLLEtBQXRCLENBQTRCLEdBQTVCLENBQW5CO0FBQ0FDLG9CQUFRQyxHQUFSLENBQVlILFlBQVo7QUFDQSxpQkFBSyxJQUFJSSxDQUFULElBQWNKLFlBQWQsRUFBNEI7QUFDeEJ6QyxzQkFBTWMsSUFBTixDQUFXVCxRQUFRZ0IsaUJBQVIsR0FBNEIsT0FBdkMsRUFBZ0RtQixHQUFoRCxDQUFvREMsYUFBYUksQ0FBYixDQUFwRDtBQUNBM0I7QUFDSDtBQUNKO0FBQ0o7O0FBRUQ7QUFDQSxXQUFPckIsTUFBUDtBQUNILENBcE1MIiwiZmlsZSI6ImNhdGFsb2dfc2VsZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNhdGFsb2dfc2VsZWN0b3IuanMgMjAxOS0wNy0xMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQ2F0YWxvZ1NlbGVjdG9yIFdpZGdldFxuICpcbiAqIFRoaXMgV2lkZ2V0cyBnZW5lcmF0ZXMgYSBzZWxlY3Rpb24gZm9yIHByb2R1Y3RzIChjYXRlZ29yaWVzIGF0IG5vdCBpbXBsZW1lbnRlZCB5ZXQsIGJ1dCBwb3NzaWJpbCkuXG4gKiBUaGUgZ2l2ZW4gSFRNTCBjb2RlIHdpbGwgYmUgY2xvbmVkIHRvIGFuZCBtb2RpZmllZCB0byBjcmVhdGUgdGhpcyBzZWxlY3Rpb24uXG4gKlxuICpcbiAqICMjIyBQYXJlbnQgQ29udGFpbmVyIE9wdGlvbnNcbiAqXG4gKiAqKkhlYWRsaW5lIHRleHQgfCBgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLWhlYWRsaW5lX3RleHRgIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIFRleHRwaHJhc2UgZm9yIHRoZSBjb2xsYXBzZSBoZWFkbGluZS5cbiAqXG4gKiAqKkFkZCBidXR0b24gdGV4dCB8IGBkYXRhLWNhdGFsb2dfc2VsZWN0b3ItYWRkX2J1dHRvbl90ZXh0YCB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBUZXh0cGhyYXNlIGZvciB0aGUgYWRkIG5ldyBkcm9wZG93biBidXR0b24uXG4gKlxuICogKipGb3JtIGdyb3VwIHNlbGVjdG9yIHwgYGRhdGEtY2F0YWxvZ19zZWxlY3Rvci1ncm91cF9zZWxlY3RvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhpcyBzZWxlY3RvciBpcyByZXF1aXJlZCB0byBzZWxlY3QgdGhlIGZvcm0gZ3JvdXAgdGhhdCBtdXN0IGJlIGNvbnRhaW5lZCBpbiB0aGUgZ2l2ZW4gSFRNTC5cbiAqXG4gKiAqKkxhYmVsIHNlbGVjdG9yIHwgYGRhdGEtY2F0YWxvZ19zZWxlY3Rvci1sYWJlbF9zZWxlY3RvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhpcyBzZWxlY3RvciBpcyByZXF1aXJlZCB0byBzZWxlY3QgdGhlIGxhYmVsIG9mIHRoZSBmb3JtIGdyb3VwLlxuICpcbiAqICoqRHJvcGRvd24gc2VsZWN0b3IgfCBgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLWRyb3Bkb3duX3NlbGVjdG9yYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBUaGlzIHNlbGVjdG9yIGlzIHJlcXVpcmVkIHRvIHNlbGVjdCBkcm9wZG93biBvZiB0aGUgZm9ybSBncm91cC5cbiAqXG4gKiAqKlJlbW92ZSBpY29uIGNvbHVtbiBzZWxlY3RvciB8IGBkYXRhLWNhdGFsb2dfc2VsZWN0b3ItcmVtb3ZlX3NlbGVjdG9yYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBUaGlzIHNlbGVjdG9yIGlzIHJlcXVpcmVkIHRvIHNlbGVjdCB0aGUgY29sdW1uIGZvciB0aGUgcmVtb3ZlIGljb24gb2YgdGhlIGZvcm0gZ3JvdXAuXG4gKlxuICogKipTZWxlY3RlZCBkYXRhIHwgYGRhdGEtY2F0YWxvZ19zZWxlY3Rvci1zZWxlY3RlZF9kYXRhYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBBbHJlYWR5IHNlbGVjdGVkIGRhdGEgZm9yIHRoZSBzZWxlY3Rpb24uXG4gKlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8ZGl2IGRhdGEtZ3gtd2lkZ2V0PVwiY2F0YWxvZ19zZWxlY3RvclwiXG4gKiAgICAgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLWdyb3VwX3NlbGVjdG9yPVwiLmZvcm0tZ3JvdXBcIlxuICogICAgIGRhdGEtY2F0YWxvZ19zZWxlY3Rvci1sYWJlbF9zZWxlY3Rvcj1cImxhYmVsXCJcbiAqICAgICBkYXRhLWNhdGFsb2dfc2VsZWN0b3ItZHJvcGRvd25fc2VsZWN0b3I9XCIuY2F0YWxvZy1zZWxlY3Rvci1kcm9wZG93blwiXG4gKiAgICAgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLXJlbW92ZV9zZWxlY3Rvcj1cIi5jYXRhbG9nLXNlbGVjdG9yLXJlbW92ZVwiXG4gKiAgICAgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLWhlYWRsaW5lX3RleHQ9XCJIRUFETElORVwiXG4gKiAgICAgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLWFkZF9idXR0b25fdGV4dD1cIkFkZCBkcm9wZG93blwiXG4gKiAgICAgZGF0YS1jYXRhbG9nX3NlbGVjdG9yLXNlbGVjdGVkX2RhdGE9XCIxLDIsMyw0XCJcbiAqID5cbiAqICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuICogICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb2wtbWQtNFwiPnskdHh0LkxBQkVMX1NIT1dfRk9SX1BST0RVQ1R9OjwvbGFiZWw+XG4gKiAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtM1wiPlxuICogICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbCBjYXRhbG9nLXNlbGVjdG9yLWRyb3Bkb3duXCJcbiAqICAgICAgICAgICAgIG5hbWU9XCJjb250ZW50X21hbmFnZXJbaW5mb3BhZ2VdW3NpdGVtYXBfY2hhbmdlZnJlcV1beyRsYW5ndWFnZUNvZGV9XVwiPjwvc2VsZWN0PlxuICogICAgICAgICA8L2Rpdj5cbiAqICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1tZC0xIGNhdGFsb2ctc2VsZWN0b3ItcmVtb3ZlXCI+PC9kaXY+XG4gKiAgICAgPC9kaXY+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvY2F0YWxvZ19zZWxlY3RvclxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnY2F0YWxvZ19zZWxlY3RvcicsXG5cbiAgICBbXG4gICAgICAgIGAke2d4LnNvdXJjZX0vd2lkZ2V0cy9jb2xsYXBzZXJgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENvcHkgb2YgdGhlIGdpdmVuIGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkZ3JvdXBPYmplY3QgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEYXRhIHRoYXQncyB1c2VkIHRvIGZpbGwgdGhlIGRyb3Bkb3duLlxuICAgICAgICAgICAgICogV2lsbCBiZSBsb2FkZWQgYnkgYWpheCBmcm9tIHRoZSB3aWRnZXQgYWpheCBjb250cm9sbGVyXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRhdGFUcmVlSHRtbCA9ICcnLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9ucyBmb3IgV2lkZ2V0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgJ2dyb3VwX3NlbGVjdG9yJzogJy5mb3JtLWdyb3VwJyxcbiAgICAgICAgICAgICAgICAnbGFiZWxfc2VsZWN0b3InOiAnbGFiZWwnLFxuICAgICAgICAgICAgICAgICdkcm9wZG93bl9zZWxlY3Rvcic6ICcuY2F0YWxvZy1zZWxlY3Rvci1kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgJ3JlbW92ZV9zZWxlY3Rvcic6ICcuY2F0YWxvZy1zZWxlY3Rvci1yZW1vdmUnLFxuICAgICAgICAgICAgICAgICdzZWxlY3RlZF9kYXRhJzogJydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkVcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSB3aWRnZXQsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gUGVyZm9ybSBhamF4IHJlcXVlc3QgdG8gY29sbGVjdCBwcm9kdWN0cyBhbmQgY2F0ZWdvcmllc1xuICAgICAgICAgICAgX3BlcmZvcm1SZXF1ZXN0KCdnZXRQcm9kdWN0c1RyZWVBc09wdGdyb3VwcycpXG4gICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFUcmVlSHRtbCA9IHJlc3BvbnNlLmh0bWw7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgd2lkZ2V0IGh0bWxcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLmFwcGVuZChgXG5cdFx0XHRcdFx0PGZpZWxkc2V0PlxuXHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmcmFtZS13cmFwcGVyIGRlZmF1bHRcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImZyYW1lLWhlYWRcIlxuXHRcdFx0XHRcdFx0XHRcdGRhdGEtZ3gtd2lkZ2V0PVwiY29sbGFwc2VyXCJcblx0XHRcdFx0XHRcdFx0XHRkYXRhLWNvbGxhcHNlci10YXJnZXRfc2VsZWN0b3I9XCIuZnJhbWUtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0XHRcdGAgKyBvcHRpb25zLmhlYWRsaW5lX3RleHQgKyBgXG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZnJhbWUtY29udGVudFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjYXRhbG9nLXNlbGVjdGlvbi1kYXRhXCI+PC9kaXY+XG5cdFx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9maWVsZHNldD5cblx0XHRcdGApO1xuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZCgnLmNhdGFsb2ctc2VsZWN0aW9uLWRhdGEnKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoYFxuXHRcdFx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGNhdGFsb2ctc2VsZWN0aW9uLW5ldy1kcm9wZG93blwiPlxuXHRcdFx0XHRcdFx0YCArIG9wdGlvbnMuYWRkX2J1dHRvbl90ZXh0ICsgYFxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRgKVxuICAgICAgICAgICAgICAgIC5maW5kKCcuY2F0YWxvZy1zZWxlY3Rpb24tbmV3LWRyb3Bkb3duJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgX29uTmV3RHJvcGRvd24pO1xuICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCR0aGlzLnBhcmVudCgpKTtcblxuICAgICAgICAgICAgLy8gQmFja3VwIGZvcm0gZ3JvdXBcbiAgICAgICAgICAgICRncm91cE9iamVjdCA9ICR0aGlzLmZpbmQob3B0aW9ucy5ncm91cF9zZWxlY3Rvcik7XG4gICAgICAgICAgICAkdGhpcy5maW5kKG9wdGlvbnMuZ3JvdXBfc2VsZWN0b3IpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBGaWxsIGRyb3Bkb3duIG1lbnUgb2YgYmFja3VwZWQgZm9ybSBncm91cCB3aXRoIG9wdGlvbnNcbiAgICAgICAgICAgICRncm91cE9iamVjdFxuICAgICAgICAgICAgICAgIC5maW5kKG9wdGlvbnMuZHJvcGRvd25fc2VsZWN0b3IpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChkYXRhVHJlZUh0bWwpO1xuXG4gICAgICAgICAgICAvLyBEZWxldGUgZ2l2ZW4gaHRtbCAoSXQgaXMgd2lsbCBub3QgYmUgdXNlZCBhbnltb3JlKVxuICAgICAgICAgICAgJGdyb3VwT2JqZWN0LmNsb25lKCkuYXBwZW5kVG8oJHRoaXMuZmluZCgnLmNhdGFsb2ctc2VsZWN0aW9uLWRhdGEnKSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBwcmUtc2VsZWN0ZWQgZGF0YVxuICAgICAgICAgICAgX2FkZFNlbGVjdGVkRGF0YSgpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSEVMUEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUGVyZm9ybXMgdGhlIGFqYXggcmVxdWVzdCB0byBjb2xsZWMgdHRoZSBwcm9kdWN0cyBhbmQgY2F0ZWdvcmllc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IEpTT05cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9wZXJmb3JtUmVxdWVzdChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IFVSTF9CQVNFID0gJ2FkbWluLnBocD9kbz1DYXRhbG9nU2VsZWN0V2lkZ2V0QWpheC8nO1xuXG4gICAgICAgICAgICAvLyBBSkFYIHJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IGFqYXhPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogVVJMX0JBU0UgKyBhY3Rpb24sXG4gICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUmV0dXJucyBkZWZlcnJlZCBvYmplY3QuXG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KGFqYXhPcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgZm9ybSBncm91cCB3aXRoIGFub3RoZXIgZHJvcGRvd25cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbk5ld0Ryb3Bkb3duKCkge1xuICAgICAgICAgICAgJGdyb3VwT2JqZWN0XG4gICAgICAgICAgICAgICAgLmNsb25lKClcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHRoaXMuZmluZCgnLmNhdGFsb2ctc2VsZWN0aW9uLWRhdGEnKSlcbiAgICAgICAgICAgICAgICAuZmluZChvcHRpb25zLmxhYmVsX3NlbGVjdG9yKVxuICAgICAgICAgICAgICAgIC5lbXB0eSgpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLmZpbmQob3B0aW9ucy5yZW1vdmVfc2VsZWN0b3IpXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgnPGkgY2xhc3M9XCJmYSBmYS10cmFzaC1vXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2knKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBfcmVtb3ZlRHJvcGRvd24pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgYSBmb3JtIGdyb3VwLiBXaWxsIGJlIGluaXRpYWxpemUgYnkgYSBjbGljayBldmVudCBvbiB0aGUgcmVtb3ZlIGljb24uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVtb3ZlRHJvcGRvd24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3Qob3B0aW9ucy5ncm91cF9zZWxlY3RvcikucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyB0aGUgcHJlIHNlbGVjdGVkIGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfYWRkU2VsZWN0ZWREYXRhKCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0ZWRfZGF0YSA9PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFN0cmluZyhvcHRpb25zLnNlbGVjdGVkX2RhdGEpLmluZGV4T2YoXCIsXCIpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLmRyb3Bkb3duX3NlbGVjdG9yICsgJzpsYXN0JykudmFsKG9wdGlvbnMuc2VsZWN0ZWRfZGF0YSk7XG4gICAgICAgICAgICAgICAgX29uTmV3RHJvcGRvd24oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkRGF0YSA9IG9wdGlvbnMuc2VsZWN0ZWRfZGF0YS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGVjdGVkRGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBzZWxlY3RlZERhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLmRyb3Bkb3duX3NlbGVjdG9yICsgJzpsYXN0JykudmFsKHNlbGVjdGVkRGF0YVtpXSk7XG4gICAgICAgICAgICAgICAgICAgIF9vbk5ld0Ryb3Bkb3duKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
