'use strict';

/* --------------------------------------------------------------
 collapser.js 2016-02-19
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Collapser Widget
 *
 * This widget expands or collapses the target element. It is not visible when collapsed but visible when expanded.
 *
 * ### Options
 *
 * **Collapsed | `data-collapser-collapsed` | Boolean | Optional**
 *
 * Default state of the collapser. If no value is provided, it defaults to `false`.
 *
 * **Collapsed Icon Class | `data-collapser-collapsed_icon_class` | String | Optional**
 *
 * Default Font Awesome icon when the collapser is collapsed. If no value is provided, it defaults to **'fa-plus-square-o'**.
 *
 * **Expanded Icon Class | `data-collapser-expanded_icon_class` | String | Optional**
 *
 * Default Font Awesome icon when the collapser is expanded. If no value is provided, it defaults to **'fa-minus-square-o'**.
 *
 * **Additional Classes | `data-collapser-additional_classes` | String | Optional**
 *
 * Provide additional CSS-Classes which should be added. If no value is provided, it defaults to **'pull-right'**,
 * which applies a CSS *'float: right'* style.
 *
 * **Target Selector | `data-collapser-target_selector` | String | Required**
 *
 * Provide the target selector, which is the element thath will be collapsed or expanded.
 *
 * **Parent Selector | `data-collapser-parent_selector` | String | Optional**
 *
 * Provide a parent selector for the collapser. It's empty by default.
 *
 * ### Example
 *
 * When the page loads, the **collapser** widget will be added to the `<div>` element.
 * On click, the target selector will be shown or hidden.
 *
 * ```html
 *  <div class="headline-wrapper"
 *      data-gx-widget="collapser"
 *      data-collapser-target_selector=".content-wrapper"
 *      data-collapser-section="category_base_data"
 *      data-collapser-user_id="1"
 *      data-collapser-collapsed="true">
 *    Click This Headline
 *  </div>
 *  <div class="content-wrapper">
 *    Toggled content
 *  </div>
 * ```
 *
 * @module Admin/Widgets/collapser
 *
 * @todo Make the styling for this widget (like it is on the products site) more general. Currently, the "div" element
 * has to be wrapped in another "div" with specific CSS-Classes like ".gx-container" and ".frame-head".
 */
gx.widgets.module('collapser', ['user_configuration_service'], function (data) {

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
     * UserConfigurationService Alias
     *
     * @type {object}
     */
    userConfigurationService = jse.libs.user_configuration_service,


    /**
     * Default Options for Widget
     *
     * @type {object}
     */
    defaults = {
        collapsed: false,
        collapsed_icon_class: 'fa-plus-square-o',
        expanded_icon_class: 'fa-minus-square-o',
        additional_classes: 'pull-right',
        parent_selector: '',
        is_button_trigger: false
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
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Sets the cursor to pointer
     * @private
     */
    var _setMouseCursorPointer = function _setMouseCursorPointer() {
        $this.addClass('cursor-pointer').children().addClass('cursor-pointer');
    };

    /**
     * Sets the initial visibility according to the 'collapsed' value
     * @private
     */
    var _setInitialVisibilityState = function _setInitialVisibilityState() {
        if (options.collapsed) {
            if (options.parent_selector) {
                $this.parents(options.parent_selector).next(options.target_selector).hide();
            } else {
                $this.next(options.target_selector).hide();
            }
        }
    };

    /**
     * Creates the markup for the collapser and adds the click event handler
     * @private
     */
    var _createCollapser = function _createCollapser() {
        var $button = $('<span>', { class: 'collapser ' + options.additional_classes });
        var $icon = $('<i>', { class: 'fa ' + (options.collapsed ? options.collapsed_icon_class : options.expanded_icon_class) });

        $button.append($icon).appendTo($this);

        if (options.is_button_trigger) {
            $button.on('click', _toggleVisibilityState);
        } else {
            $this.on('click', _toggleVisibilityState);
        }
    };

    /**
     * Saves the current visibility state.
     *
     * @private
     */
    var _saveVisibilityState = function _saveVisibilityState() {
        var collapseState = $this.find('.collapser > i.fa').hasClass(options.collapsed_icon_class);

        userConfigurationService.set({
            data: {
                userId: options.user_id,
                configurationKey: options.section + '_collapse',
                configurationValue: collapseState
            }
        });
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Toggles the visibility state and switches between plus and minus icon.
     *
     * @private
     */
    var _toggleVisibilityState = function _toggleVisibilityState() {
        if (options.parent_selector) {
            $this.parents(options.parent_selector).next(options.target_selector).toggle();
        } else {
            $this.next(options.target_selector).toggle();
        }

        $this.find('.collapser > i.fa').toggleClass(options.collapsed_icon_class);
        $this.find('.collapser > i.fa').toggleClass(options.expanded_icon_class);

        _saveVisibilityState();
    };

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        _setMouseCursorPointer();
        _setInitialVisibilityState();
        _createCollapser();
        done();
    };

    // Return data to module engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbGxhcHNlci5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwidXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlIiwianNlIiwibGlicyIsInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlIiwiZGVmYXVsdHMiLCJjb2xsYXBzZWQiLCJjb2xsYXBzZWRfaWNvbl9jbGFzcyIsImV4cGFuZGVkX2ljb25fY2xhc3MiLCJhZGRpdGlvbmFsX2NsYXNzZXMiLCJwYXJlbnRfc2VsZWN0b3IiLCJpc19idXR0b25fdHJpZ2dlciIsIm9wdGlvbnMiLCJleHRlbmQiLCJfc2V0TW91c2VDdXJzb3JQb2ludGVyIiwiYWRkQ2xhc3MiLCJjaGlsZHJlbiIsIl9zZXRJbml0aWFsVmlzaWJpbGl0eVN0YXRlIiwicGFyZW50cyIsIm5leHQiLCJ0YXJnZXRfc2VsZWN0b3IiLCJoaWRlIiwiX2NyZWF0ZUNvbGxhcHNlciIsIiRidXR0b24iLCJjbGFzcyIsIiRpY29uIiwiYXBwZW5kIiwiYXBwZW5kVG8iLCJvbiIsIl90b2dnbGVWaXNpYmlsaXR5U3RhdGUiLCJfc2F2ZVZpc2liaWxpdHlTdGF0ZSIsImNvbGxhcHNlU3RhdGUiLCJmaW5kIiwiaGFzQ2xhc3MiLCJzZXQiLCJ1c2VySWQiLCJ1c2VyX2lkIiwiY29uZmlndXJhdGlvbktleSIsInNlY3Rpb24iLCJjb25maWd1cmF0aW9uVmFsdWUiLCJ0b2dnbGUiLCJ0b2dnbGVDbGFzcyIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0RBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxXQURKLEVBR0ksQ0FBQyw0QkFBRCxDQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFL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QUFnQ1MsV0FBaEMsQ0FBNEM3QixRQUFRSixtQkFBcEQ7O0FBR0FzQjtBQUNILEtBWkQ7O0FBY0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQWpDLFdBQU82QyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjdCO0FBQ0FHO0FBQ0FLO0FBQ0FxQjtBQUNILEtBTEQ7O0FBT0E7QUFDQSxXQUFPOUMsTUFBUDtBQUNILENBN0pMIiwiZmlsZSI6ImNvbGxhcHNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY29sbGFwc2VyLmpzIDIwMTYtMDItMTlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIENvbGxhcHNlciBXaWRnZXRcbiAqXG4gKiBUaGlzIHdpZGdldCBleHBhbmRzIG9yIGNvbGxhcHNlcyB0aGUgdGFyZ2V0IGVsZW1lbnQuIEl0IGlzIG5vdCB2aXNpYmxlIHdoZW4gY29sbGFwc2VkIGJ1dCB2aXNpYmxlIHdoZW4gZXhwYW5kZWQuXG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKkNvbGxhcHNlZCB8IGBkYXRhLWNvbGxhcHNlci1jb2xsYXBzZWRgIHwgQm9vbGVhbiB8IE9wdGlvbmFsKipcbiAqXG4gKiBEZWZhdWx0IHN0YXRlIG9mIHRoZSBjb2xsYXBzZXIuIElmIG5vIHZhbHVlIGlzIHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byBgZmFsc2VgLlxuICpcbiAqICoqQ29sbGFwc2VkIEljb24gQ2xhc3MgfCBgZGF0YS1jb2xsYXBzZXItY29sbGFwc2VkX2ljb25fY2xhc3NgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIERlZmF1bHQgRm9udCBBd2Vzb21lIGljb24gd2hlbiB0aGUgY29sbGFwc2VyIGlzIGNvbGxhcHNlZC4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvICoqJ2ZhLXBsdXMtc3F1YXJlLW8nKiouXG4gKlxuICogKipFeHBhbmRlZCBJY29uIENsYXNzIHwgYGRhdGEtY29sbGFwc2VyLWV4cGFuZGVkX2ljb25fY2xhc3NgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIERlZmF1bHQgRm9udCBBd2Vzb21lIGljb24gd2hlbiB0aGUgY29sbGFwc2VyIGlzIGV4cGFuZGVkLiBJZiBubyB2YWx1ZSBpcyBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gKionZmEtbWludXMtc3F1YXJlLW8nKiouXG4gKlxuICogKipBZGRpdGlvbmFsIENsYXNzZXMgfCBgZGF0YS1jb2xsYXBzZXItYWRkaXRpb25hbF9jbGFzc2VzYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGFkZGl0aW9uYWwgQ1NTLUNsYXNzZXMgd2hpY2ggc2hvdWxkIGJlIGFkZGVkLiBJZiBubyB2YWx1ZSBpcyBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gKioncHVsbC1yaWdodCcqKixcbiAqIHdoaWNoIGFwcGxpZXMgYSBDU1MgKidmbG9hdDogcmlnaHQnKiBzdHlsZS5cbiAqXG4gKiAqKlRhcmdldCBTZWxlY3RvciB8IGBkYXRhLWNvbGxhcHNlci10YXJnZXRfc2VsZWN0b3JgIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIFByb3ZpZGUgdGhlIHRhcmdldCBzZWxlY3Rvciwgd2hpY2ggaXMgdGhlIGVsZW1lbnQgdGhhdGggd2lsbCBiZSBjb2xsYXBzZWQgb3IgZXhwYW5kZWQuXG4gKlxuICogKipQYXJlbnQgU2VsZWN0b3IgfCBgZGF0YS1jb2xsYXBzZXItcGFyZW50X3NlbGVjdG9yYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgcGFyZW50IHNlbGVjdG9yIGZvciB0aGUgY29sbGFwc2VyLiBJdCdzIGVtcHR5IGJ5IGRlZmF1bHQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBXaGVuIHRoZSBwYWdlIGxvYWRzLCB0aGUgKipjb2xsYXBzZXIqKiB3aWRnZXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgYDxkaXY+YCBlbGVtZW50LlxuICogT24gY2xpY2ssIHRoZSB0YXJnZXQgc2VsZWN0b3Igd2lsbCBiZSBzaG93biBvciBoaWRkZW4uXG4gKlxuICogYGBgaHRtbFxuICogIDxkaXYgY2xhc3M9XCJoZWFkbGluZS13cmFwcGVyXCJcbiAqICAgICAgZGF0YS1neC13aWRnZXQ9XCJjb2xsYXBzZXJcIlxuICogICAgICBkYXRhLWNvbGxhcHNlci10YXJnZXRfc2VsZWN0b3I9XCIuY29udGVudC13cmFwcGVyXCJcbiAqICAgICAgZGF0YS1jb2xsYXBzZXItc2VjdGlvbj1cImNhdGVnb3J5X2Jhc2VfZGF0YVwiXG4gKiAgICAgIGRhdGEtY29sbGFwc2VyLXVzZXJfaWQ9XCIxXCJcbiAqICAgICAgZGF0YS1jb2xsYXBzZXItY29sbGFwc2VkPVwidHJ1ZVwiPlxuICogICAgQ2xpY2sgVGhpcyBIZWFkbGluZVxuICogIDwvZGl2PlxuICogIDxkaXYgY2xhc3M9XCJjb250ZW50LXdyYXBwZXJcIj5cbiAqICAgIFRvZ2dsZWQgY29udGVudFxuICogIDwvZGl2PlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL2NvbGxhcHNlclxuICpcbiAqIEB0b2RvIE1ha2UgdGhlIHN0eWxpbmcgZm9yIHRoaXMgd2lkZ2V0IChsaWtlIGl0IGlzIG9uIHRoZSBwcm9kdWN0cyBzaXRlKSBtb3JlIGdlbmVyYWwuIEN1cnJlbnRseSwgdGhlIFwiZGl2XCIgZWxlbWVudFxuICogaGFzIHRvIGJlIHdyYXBwZWQgaW4gYW5vdGhlciBcImRpdlwiIHdpdGggc3BlY2lmaWMgQ1NTLUNsYXNzZXMgbGlrZSBcIi5neC1jb250YWluZXJcIiBhbmQgXCIuZnJhbWUtaGVhZFwiLlxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnY29sbGFwc2VyJyxcblxuICAgIFsndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSBBbGlhc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVzZXJDb25maWd1cmF0aW9uU2VydmljZSA9IGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9ucyBmb3IgV2lkZ2V0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb2xsYXBzZWRfaWNvbl9jbGFzczogJ2ZhLXBsdXMtc3F1YXJlLW8nLFxuICAgICAgICAgICAgICAgIGV4cGFuZGVkX2ljb25fY2xhc3M6ICdmYS1taW51cy1zcXVhcmUtbycsXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbF9jbGFzc2VzOiAncHVsbC1yaWdodCcsXG4gICAgICAgICAgICAgICAgcGFyZW50X3NlbGVjdG9yOiAnJyxcbiAgICAgICAgICAgICAgICBpc19idXR0b25fdHJpZ2dlcjogZmFsc2VcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgY3Vyc29yIHRvIHBvaW50ZXJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2V0TW91c2VDdXJzb3JQb2ludGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2N1cnNvci1wb2ludGVyJykuY2hpbGRyZW4oKS5hZGRDbGFzcygnY3Vyc29yLXBvaW50ZXInKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgaW5pdGlhbCB2aXNpYmlsaXR5IGFjY29yZGluZyB0byB0aGUgJ2NvbGxhcHNlZCcgdmFsdWVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2V0SW5pdGlhbFZpc2liaWxpdHlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnBhcmVudF9zZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5wYXJlbnRzKG9wdGlvbnMucGFyZW50X3NlbGVjdG9yKS5uZXh0KG9wdGlvbnMudGFyZ2V0X3NlbGVjdG9yKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMubmV4dChvcHRpb25zLnRhcmdldF9zZWxlY3RvcikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyB0aGUgbWFya3VwIGZvciB0aGUgY29sbGFwc2VyIGFuZCBhZGRzIHRoZSBjbGljayBldmVudCBoYW5kbGVyXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NyZWF0ZUNvbGxhcHNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkYnV0dG9uID0gJCgnPHNwYW4+Jywge2NsYXNzOiBgY29sbGFwc2VyICR7b3B0aW9ucy5hZGRpdGlvbmFsX2NsYXNzZXN9YH0pO1xuICAgICAgICAgICAgdmFyICRpY29uID0gJCgnPGk+Jywge2NsYXNzOiBgZmEgJHtvcHRpb25zLmNvbGxhcHNlZCA/IG9wdGlvbnMuY29sbGFwc2VkX2ljb25fY2xhc3MgOiBvcHRpb25zLmV4cGFuZGVkX2ljb25fY2xhc3N9YH0pO1xuXG4gICAgICAgICAgICAkYnV0dG9uXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkaWNvbilcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHRoaXMpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pc19idXR0b25fdHJpZ2dlcikge1xuICAgICAgICAgICAgICAgICRidXR0b24ub24oJ2NsaWNrJywgX3RvZ2dsZVZpc2liaWxpdHlTdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsIF90b2dnbGVWaXNpYmlsaXR5U3RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlcyB0aGUgY3VycmVudCB2aXNpYmlsaXR5IHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zYXZlVmlzaWJpbGl0eVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbGxhcHNlU3RhdGUgPSAkdGhpcy5maW5kKCcuY29sbGFwc2VyID4gaS5mYScpLmhhc0NsYXNzKG9wdGlvbnMuY29sbGFwc2VkX2ljb25fY2xhc3MpO1xuXG4gICAgICAgICAgICB1c2VyQ29uZmlndXJhdGlvblNlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogb3B0aW9ucy51c2VyX2lkLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uS2V5OiBvcHRpb25zLnNlY3Rpb24gKyAnX2NvbGxhcHNlJyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBjb2xsYXBzZVN0YXRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb2dnbGVzIHRoZSB2aXNpYmlsaXR5IHN0YXRlIGFuZCBzd2l0Y2hlcyBiZXR3ZWVuIHBsdXMgYW5kIG1pbnVzIGljb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3RvZ2dsZVZpc2liaWxpdHlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnBhcmVudF9zZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgICR0aGlzLnBhcmVudHMob3B0aW9ucy5wYXJlbnRfc2VsZWN0b3IpLm5leHQob3B0aW9ucy50YXJnZXRfc2VsZWN0b3IpLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5uZXh0KG9wdGlvbnMudGFyZ2V0X3NlbGVjdG9yKS50b2dnbGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmNvbGxhcHNlciA+IGkuZmEnKS50b2dnbGVDbGFzcyhvcHRpb25zLmNvbGxhcHNlZF9pY29uX2NsYXNzKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5jb2xsYXBzZXIgPiBpLmZhJykudG9nZ2xlQ2xhc3Mob3B0aW9ucy5leHBhbmRlZF9pY29uX2NsYXNzKTtcblxuXG4gICAgICAgICAgICBfc2F2ZVZpc2liaWxpdHlTdGF0ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpFXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIF9zZXRNb3VzZUN1cnNvclBvaW50ZXIoKTtcbiAgICAgICAgICAgIF9zZXRJbml0aWFsVmlzaWJpbGl0eVN0YXRlKCk7XG4gICAgICAgICAgICBfY3JlYXRlQ29sbGFwc2VyKCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
