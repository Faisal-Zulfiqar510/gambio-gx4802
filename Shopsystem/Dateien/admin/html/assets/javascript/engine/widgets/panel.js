'use strict';

/* --------------------------------------------------------------
 panel.js 2017-10-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Panel widget
 *
 * This widget creates a panel container and wraps the inner html inside the panel.
 * The user configuration service is used by this widget, so the state (whether collapsed or expanded) is stored
 * by user and will be used on future usages. To make this functionality possible, the options "user" and "section"
 * are required.
 *
 * ### Options (Required)
 *
 * **Title | `data-panel-title` | String | Required**
 *
 * Panels title value.
 *
 * ### Options (Additional)
 *
 * **Collapsed icon class | `data-panel-collapsed_icon_class` | String | Optional**
 *
 * Font awesome class for collapsed icon. If no value is provided, it defaults to **'fa fa-plus-square-o'**.
 *
 * **Expanded icon class | `data-panel-expanded_icon_class` | String | Optional**
 *
 * Font awesome class for expanded icon. If no value is provided, it defaults to **'fa fa-minus-square-o'**.
 *
 * **Container class | `data-panel-container_class` | String | Optional**
 *
 * Additional class attributes. The values will be append to the .panel element.
 *
 * **Toggle time | `data-panel-toggle_time` | String | Optional**
 *
 * Toggle time for collapsing/expanding the panel. If no value is provided, it defaults to **'200'**.
 *
 * **Collapsed | `data-panel-collapsed` | Boolean | Optional **
 *
 * Determines the panels default state. Collapsed if set to true and expanded otherwise. If no value is provided,
 * the user configuration will be used. If no user configuration was found, the default state is expanded.
 *
 * **User | `data-panel-user` | Integer | Optional**
 *
 * Customer id of user, used by user configuration service to store the collapsed state. This option should be set
 * with the "section" option and will be ignored, if the "collapsed" option is set.
 *
 * **Section | `data-panel-section` | String | Optional**
 *
 * Panel section, used by user configuration service 'configuration_key'. This option should be set with the "user"
 * option and will be ignored, if the "collapsed" option is set.
 *
 * ### Example
 *
 * ```html
 * <!-- usage of user configuration -->
 * <div data-gx-widget="panel"
 *      data-panel-title="Panel Title"
 *      data-panel-user="{$smarty.session.customer_id}"
 *      data-panel-section="panel-sample-section"
 *      data-panel-container_class="additional-sample-class">
 *     <div class="sample-class">
 *         <p>Sample Content</p>!
 *     </div>
 * </div>
 *
 * <!-- usage of collapsed option -->
 * <div data-gx-widget="panel"
 *      data-panel-title="Panel Title"
 *      data-panel-container_class="additional-sample-class"
 *      data-panel-collapsed="false|true">
 *     <div class="sample-class">
 *         <p>Sample Content</p>!
 *     </div>
 * </div>
 * ```
 *
 * @module Admin/Widgets/panel
 */
gx.widgets.module('panel',

// external libraries, used by widget
['user_configuration_service'], function (data) {
    'use strict';

    /**
     * Widget reference.
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default options for widget,
     *
     * @type {object}
     */
    var defaults = {
        collapsed_icon_class: 'fa fa-plus-square-o',
        expanded_icon_class: 'fa fa-minus-square-o',
        container_class: '',
        toggle_time: 200
    };

    /**
     * Final widget options.
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module object.
     *
     * @type {{}}
     */
    var module = {};

    /**
     * Required widget options, should passed from markup.
     *
     * @type {String[]}
     */
    var requiredOptions = ['title', 'user', 'section'];

    /**
     * User configuration service to store collapsed/expanded configuration.
     *
     * @type {jse.libs.user_configuration_service}
     */
    var userConfig = jse.libs.user_configuration_service;

    /**
     * Property like values.
     */
    var $iconContainer = void 0;
    var $collapseIcon = void 0;
    var $panelBody = void 0;

    // private methods

    /**
     * Widget initialization.
     *
     * @private
     */
    var _init = function _init() {
        var collapsed = void 0;

        if (undefined !== options.collapsed) {
            _renderPanel(options.collapsed);
        } else {
            if (undefined === options.user || undefined === options.section) {
                throw new Error('Required widget options are not set. Set whether the "collapsed" option, or use ' + 'the user configuration service with the options "user" and "section".');
            }

            userConfig.get({
                data: {
                    userId: options.user,
                    configurationKey: options.section + '_collapsed'
                },
                onSuccess: function onSuccess(result) {
                    collapsed = result.length === 0 ? false : result.configurationValue === 'true';
                    _renderPanel(collapsed);
                }
            });
        }
    };

    /**
     * Checks if all required options are passed.
     *
     * @private
     */
    var _checkRequiredOptions = function _checkRequiredOptions() {
        var i = 0;
        for (; i < requiredOptions.length; i++) {
            if (undefined === options[requiredOptions[i]]) {
                throw new Error('Required widget option "' + requiredOptions[i] + '" is no set!');
            }
        }
    };

    /**
     * Renders the panel.
     *
     * @param {boolean} collapsed If true, the panel will be collapsed.
     * @private
     */
    var _renderPanel = function _renderPanel(collapsed) {
        var $panelHeading = $('<div/>', { 'class': 'panel-heading' });
        var $panelTitle = $('<span/>', {
            'class': 'title',
            'text': options.title
        });

        $iconContainer = $('<span/>', { 'class': 'collapser pull-right cursor-pointer' });
        $collapseIcon = $('<i/>', {
            'class': collapsed ? options.collapsed_icon_class : options.expanded_icon_class
        });
        $panelBody = $('<div/>', { 'class': 'panel-body' });
        $this.children().detach().appendTo($panelBody);

        $this.addClass('panel panel-default ' + options.container_class);
        $panelHeading.append($panelTitle);
        $iconContainer.append($collapseIcon).appendTo($panelHeading);
        $this.append($panelHeading);

        if (collapsed) {
            $panelBody.css({ 'display': 'none' });
        }
        $this.append($panelBody);

        // set event handler
        $iconContainer.on('click', _toggle);
    };

    /**
     * Toggle event listener for clicks on panel heading.
     *
     * @private
     */
    var _toggle = function _toggle() {
        var isCollapsed = $collapseIcon.hasClass(options.expanded_icon_class);

        $collapseIcon.toggleClass(options.collapsed_icon_class);
        $collapseIcon.toggleClass(options.expanded_icon_class);
        $panelBody.toggle(options.toggle_time);

        userConfig.set({
            data: {
                userId: options.user,
                configurationKey: options.section + '_collapsed',
                configurationValue: isCollapsed
            }
        });
    };

    /**
     * Widget initialization function.
     *
     * @param done
     */
    module.init = function (done) {
        _checkRequiredOptions();
        _init();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhbmVsLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsImNvbGxhcHNlZF9pY29uX2NsYXNzIiwiZXhwYW5kZWRfaWNvbl9jbGFzcyIsImNvbnRhaW5lcl9jbGFzcyIsInRvZ2dsZV90aW1lIiwib3B0aW9ucyIsImV4dGVuZCIsInJlcXVpcmVkT3B0aW9ucyIsInVzZXJDb25maWciLCJqc2UiLCJsaWJzIiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCIkaWNvbkNvbnRhaW5lciIsIiRjb2xsYXBzZUljb24iLCIkcGFuZWxCb2R5IiwiX2luaXQiLCJjb2xsYXBzZWQiLCJ1bmRlZmluZWQiLCJfcmVuZGVyUGFuZWwiLCJ1c2VyIiwic2VjdGlvbiIsIkVycm9yIiwiZ2V0IiwidXNlcklkIiwiY29uZmlndXJhdGlvbktleSIsIm9uU3VjY2VzcyIsInJlc3VsdCIsImxlbmd0aCIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsIl9jaGVja1JlcXVpcmVkT3B0aW9ucyIsImkiLCIkcGFuZWxIZWFkaW5nIiwiJHBhbmVsVGl0bGUiLCJ0aXRsZSIsImNoaWxkcmVuIiwiZGV0YWNoIiwiYXBwZW5kVG8iLCJhZGRDbGFzcyIsImFwcGVuZCIsImNzcyIsIm9uIiwiX3RvZ2dsZSIsImlzQ29sbGFwc2VkIiwiaGFzQ2xhc3MiLCJ0b2dnbGVDbGFzcyIsInRvZ2dsZSIsInNldCIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEVBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxPQURKOztBQUdJO0FBQ0EsQ0FBQyw0QkFBRCxDQUpKLEVBTUksVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxR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akMsY0FBTXdDLE1BQU4sQ0FBYVAsYUFBYjs7QUFFQSxZQUFJZixTQUFKLEVBQWU7QUFDWEYsdUJBQVd5QixHQUFYLENBQWUsRUFBQyxXQUFXLE1BQVosRUFBZjtBQUNIO0FBQ0R6QyxjQUFNd0MsTUFBTixDQUFheEIsVUFBYjs7QUFFQTtBQUNBRix1QkFBZTRCLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkJDLE9BQTNCO0FBQ0gsS0ExQkQ7O0FBNEJBOzs7OztBQUtBLFFBQU1BLFVBQVUsU0FBVkEsT0FBVSxHQUFNO0FBQ2xCLFlBQU1DLGNBQWM3QixjQUFjOEIsUUFBZCxDQUF1QnRDLFFBQVFILG1CQUEvQixDQUFwQjs7QUFFQVcsc0JBQWMrQixXQUFkLENBQTBCdkMsUUFBUUosb0JBQWxDO0FBQ0FZLHNCQUFjK0IsV0FBZCxDQUEwQnZDLFFBQVFILG1CQUFsQztBQUNBWSxtQkFBVytCLE1BQVgsQ0FBa0J4QyxRQUFRRCxXQUExQjs7QUFFQUksbUJBQVdzQyxHQUFYLENBQWU7QUFDWGpELGtCQUFNO0FBQ0YwQix3QkFBUWxCLFFBQVFjLElBRGQ7QUFFRkssa0NBQWtCbkIsUUFBUWUsT0FBUixHQUFrQixZQUZsQztBQUdGUSxvQ0FBb0JjO0FBSGxCO0FBREssU0FBZjtBQU9ILEtBZEQ7O0FBZ0JBOzs7OztBQUtBOUMsV0FBT21ELElBQVAsR0FBYyxnQkFBUTtBQUNsQmxCO0FBQ0FkO0FBQ0FpQztBQUNILEtBSkQ7O0FBTUEsV0FBT3BELE1BQVA7QUFDSCxDQS9LTCIsImZpbGUiOiJwYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcGFuZWwuanMgMjAxNy0xMC0xMFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgUGFuZWwgd2lkZ2V0XG4gKlxuICogVGhpcyB3aWRnZXQgY3JlYXRlcyBhIHBhbmVsIGNvbnRhaW5lciBhbmQgd3JhcHMgdGhlIGlubmVyIGh0bWwgaW5zaWRlIHRoZSBwYW5lbC5cbiAqIFRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZSBpcyB1c2VkIGJ5IHRoaXMgd2lkZ2V0LCBzbyB0aGUgc3RhdGUgKHdoZXRoZXIgY29sbGFwc2VkIG9yIGV4cGFuZGVkKSBpcyBzdG9yZWRcbiAqIGJ5IHVzZXIgYW5kIHdpbGwgYmUgdXNlZCBvbiBmdXR1cmUgdXNhZ2VzLiBUbyBtYWtlIHRoaXMgZnVuY3Rpb25hbGl0eSBwb3NzaWJsZSwgdGhlIG9wdGlvbnMgXCJ1c2VyXCIgYW5kIFwic2VjdGlvblwiXG4gKiBhcmUgcmVxdWlyZWQuXG4gKlxuICogIyMjIE9wdGlvbnMgKFJlcXVpcmVkKVxuICpcbiAqICoqVGl0bGUgfCBgZGF0YS1wYW5lbC10aXRsZWAgfCBTdHJpbmcgfCBSZXF1aXJlZCoqXG4gKlxuICogUGFuZWxzIHRpdGxlIHZhbHVlLlxuICpcbiAqICMjIyBPcHRpb25zIChBZGRpdGlvbmFsKVxuICpcbiAqICoqQ29sbGFwc2VkIGljb24gY2xhc3MgfCBgZGF0YS1wYW5lbC1jb2xsYXBzZWRfaWNvbl9jbGFzc2AgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogRm9udCBhd2Vzb21lIGNsYXNzIGZvciBjb2xsYXBzZWQgaWNvbi4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvICoqJ2ZhIGZhLXBsdXMtc3F1YXJlLW8nKiouXG4gKlxuICogKipFeHBhbmRlZCBpY29uIGNsYXNzIHwgYGRhdGEtcGFuZWwtZXhwYW5kZWRfaWNvbl9jbGFzc2AgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogRm9udCBhd2Vzb21lIGNsYXNzIGZvciBleHBhbmRlZCBpY29uLiBJZiBubyB2YWx1ZSBpcyBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gKionZmEgZmEtbWludXMtc3F1YXJlLW8nKiouXG4gKlxuICogKipDb250YWluZXIgY2xhc3MgfCBgZGF0YS1wYW5lbC1jb250YWluZXJfY2xhc3NgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIEFkZGl0aW9uYWwgY2xhc3MgYXR0cmlidXRlcy4gVGhlIHZhbHVlcyB3aWxsIGJlIGFwcGVuZCB0byB0aGUgLnBhbmVsIGVsZW1lbnQuXG4gKlxuICogKipUb2dnbGUgdGltZSB8IGBkYXRhLXBhbmVsLXRvZ2dsZV90aW1lYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBUb2dnbGUgdGltZSBmb3IgY29sbGFwc2luZy9leHBhbmRpbmcgdGhlIHBhbmVsLiBJZiBubyB2YWx1ZSBpcyBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gKionMjAwJyoqLlxuICpcbiAqICoqQ29sbGFwc2VkIHwgYGRhdGEtcGFuZWwtY29sbGFwc2VkYCB8IEJvb2xlYW4gfCBPcHRpb25hbCAqKlxuICpcbiAqIERldGVybWluZXMgdGhlIHBhbmVscyBkZWZhdWx0IHN0YXRlLiBDb2xsYXBzZWQgaWYgc2V0IHRvIHRydWUgYW5kIGV4cGFuZGVkIG90aGVyd2lzZS4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsXG4gKiB0aGUgdXNlciBjb25maWd1cmF0aW9uIHdpbGwgYmUgdXNlZC4gSWYgbm8gdXNlciBjb25maWd1cmF0aW9uIHdhcyBmb3VuZCwgdGhlIGRlZmF1bHQgc3RhdGUgaXMgZXhwYW5kZWQuXG4gKlxuICogKipVc2VyIHwgYGRhdGEtcGFuZWwtdXNlcmAgfCBJbnRlZ2VyIHwgT3B0aW9uYWwqKlxuICpcbiAqIEN1c3RvbWVyIGlkIG9mIHVzZXIsIHVzZWQgYnkgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UgdG8gc3RvcmUgdGhlIGNvbGxhcHNlZCBzdGF0ZS4gVGhpcyBvcHRpb24gc2hvdWxkIGJlIHNldFxuICogd2l0aCB0aGUgXCJzZWN0aW9uXCIgb3B0aW9uIGFuZCB3aWxsIGJlIGlnbm9yZWQsIGlmIHRoZSBcImNvbGxhcHNlZFwiIG9wdGlvbiBpcyBzZXQuXG4gKlxuICogKipTZWN0aW9uIHwgYGRhdGEtcGFuZWwtc2VjdGlvbmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUGFuZWwgc2VjdGlvbiwgdXNlZCBieSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZSAnY29uZmlndXJhdGlvbl9rZXknLiBUaGlzIG9wdGlvbiBzaG91bGQgYmUgc2V0IHdpdGggdGhlIFwidXNlclwiXG4gKiBvcHRpb24gYW5kIHdpbGwgYmUgaWdub3JlZCwgaWYgdGhlIFwiY29sbGFwc2VkXCIgb3B0aW9uIGlzIHNldC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDwhLS0gdXNhZ2Ugb2YgdXNlciBjb25maWd1cmF0aW9uIC0tPlxuICogPGRpdiBkYXRhLWd4LXdpZGdldD1cInBhbmVsXCJcbiAqICAgICAgZGF0YS1wYW5lbC10aXRsZT1cIlBhbmVsIFRpdGxlXCJcbiAqICAgICAgZGF0YS1wYW5lbC11c2VyPVwieyRzbWFydHkuc2Vzc2lvbi5jdXN0b21lcl9pZH1cIlxuICogICAgICBkYXRhLXBhbmVsLXNlY3Rpb249XCJwYW5lbC1zYW1wbGUtc2VjdGlvblwiXG4gKiAgICAgIGRhdGEtcGFuZWwtY29udGFpbmVyX2NsYXNzPVwiYWRkaXRpb25hbC1zYW1wbGUtY2xhc3NcIj5cbiAqICAgICA8ZGl2IGNsYXNzPVwic2FtcGxlLWNsYXNzXCI+XG4gKiAgICAgICAgIDxwPlNhbXBsZSBDb250ZW50PC9wPiFcbiAqICAgICA8L2Rpdj5cbiAqIDwvZGl2PlxuICpcbiAqIDwhLS0gdXNhZ2Ugb2YgY29sbGFwc2VkIG9wdGlvbiAtLT5cbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJwYW5lbFwiXG4gKiAgICAgIGRhdGEtcGFuZWwtdGl0bGU9XCJQYW5lbCBUaXRsZVwiXG4gKiAgICAgIGRhdGEtcGFuZWwtY29udGFpbmVyX2NsYXNzPVwiYWRkaXRpb25hbC1zYW1wbGUtY2xhc3NcIlxuICogICAgICBkYXRhLXBhbmVsLWNvbGxhcHNlZD1cImZhbHNlfHRydWVcIj5cbiAqICAgICA8ZGl2IGNsYXNzPVwic2FtcGxlLWNsYXNzXCI+XG4gKiAgICAgICAgIDxwPlNhbXBsZSBDb250ZW50PC9wPiFcbiAqICAgICA8L2Rpdj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3BhbmVsXG4gKi9cbmd4LndpZGdldHMubW9kdWxlKFxuICAgICdwYW5lbCcsXG5cbiAgICAvLyBleHRlcm5hbCBsaWJyYXJpZXMsIHVzZWQgYnkgd2lkZ2V0XG4gICAgWyd1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSddLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaWRnZXQgcmVmZXJlbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IG9wdGlvbnMgZm9yIHdpZGdldCxcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgY29sbGFwc2VkX2ljb25fY2xhc3M6ICdmYSBmYS1wbHVzLXNxdWFyZS1vJyxcbiAgICAgICAgICAgIGV4cGFuZGVkX2ljb25fY2xhc3M6ICdmYSBmYS1taW51cy1zcXVhcmUtbycsXG4gICAgICAgICAgICBjb250YWluZXJfY2xhc3M6ICcnLFxuICAgICAgICAgICAgdG9nZ2xlX3RpbWU6IDIwMFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCB3aWRnZXQgb3B0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVxdWlyZWQgd2lkZ2V0IG9wdGlvbnMsIHNob3VsZCBwYXNzZWQgZnJvbSBtYXJrdXAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHJlcXVpcmVkT3B0aW9ucyA9IFsndGl0bGUnLCAndXNlcicsICdzZWN0aW9uJ107XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlIHRvIHN0b3JlIGNvbGxhcHNlZC9leHBhbmRlZCBjb25maWd1cmF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7anNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2V9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB1c2VyQ29uZmlnID0ganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByb3BlcnR5IGxpa2UgdmFsdWVzLlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0ICRpY29uQ29udGFpbmVyO1xuICAgICAgICBsZXQgJGNvbGxhcHNlSWNvbjtcbiAgICAgICAgbGV0ICRwYW5lbEJvZHk7XG5cbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpZGdldCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9pbml0ID0gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNvbGxhcHNlZDtcblxuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gb3B0aW9ucy5jb2xsYXBzZWQpIHtcbiAgICAgICAgICAgICAgICBfcmVuZGVyUGFuZWwob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IG9wdGlvbnMudXNlciB8fCB1bmRlZmluZWQgPT09IG9wdGlvbnMuc2VjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkIHdpZGdldCBvcHRpb25zIGFyZSBub3Qgc2V0LiBTZXQgd2hldGhlciB0aGUgXCJjb2xsYXBzZWRcIiBvcHRpb24sIG9yIHVzZSAnXG4gICAgICAgICAgICAgICAgICAgICAgICArICd0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2Ugd2l0aCB0aGUgb3B0aW9ucyBcInVzZXJcIiBhbmQgXCJzZWN0aW9uXCIuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdXNlckNvbmZpZy5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG9wdGlvbnMudXNlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6IG9wdGlvbnMuc2VjdGlvbiArICdfY29sbGFwc2VkJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZWQgPSByZXN1bHQubGVuZ3RoID09PSAwID8gZmFsc2UgOiByZXN1bHQuY29uZmlndXJhdGlvblZhbHVlID09PSAndHJ1ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVuZGVyUGFuZWwoY29sbGFwc2VkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgYWxsIHJlcXVpcmVkIG9wdGlvbnMgYXJlIHBhc3NlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9jaGVja1JlcXVpcmVkT3B0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgcmVxdWlyZWRPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0aW9uc1tyZXF1aXJlZE9wdGlvbnNbaV1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgd2lkZ2V0IG9wdGlvbiBcIicgKyByZXF1aXJlZE9wdGlvbnNbaV0gKyAnXCIgaXMgbm8gc2V0IScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyB0aGUgcGFuZWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29sbGFwc2VkIElmIHRydWUsIHRoZSBwYW5lbCB3aWxsIGJlIGNvbGxhcHNlZC5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW5kZXJQYW5lbCA9IGNvbGxhcHNlZCA9PiB7XG4gICAgICAgICAgICBjb25zdCAkcGFuZWxIZWFkaW5nID0gJCgnPGRpdi8+JywgeydjbGFzcyc6ICdwYW5lbC1oZWFkaW5nJ30pO1xuICAgICAgICAgICAgY29uc3QgJHBhbmVsVGl0bGUgPSAkKCc8c3Bhbi8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICd0aXRsZScsXG4gICAgICAgICAgICAgICAgJ3RleHQnOiBvcHRpb25zLnRpdGxlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGljb25Db250YWluZXIgPSAkKCc8c3Bhbi8+JywgeydjbGFzcyc6ICdjb2xsYXBzZXIgcHVsbC1yaWdodCBjdXJzb3ItcG9pbnRlcid9KVxuICAgICAgICAgICAgJGNvbGxhcHNlSWNvbiA9ICQoJzxpLz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogY29sbGFwc2VkID8gb3B0aW9ucy5jb2xsYXBzZWRfaWNvbl9jbGFzcyA6IG9wdGlvbnMuZXhwYW5kZWRfaWNvbl9jbGFzc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkcGFuZWxCb2R5ID0gJCgnPGRpdi8+JywgeydjbGFzcyc6ICdwYW5lbC1ib2R5J30pO1xuICAgICAgICAgICAgJHRoaXMuY2hpbGRyZW4oKS5kZXRhY2goKS5hcHBlbmRUbygkcGFuZWxCb2R5KTtcblxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3BhbmVsIHBhbmVsLWRlZmF1bHQgJyArIG9wdGlvbnMuY29udGFpbmVyX2NsYXNzKTtcbiAgICAgICAgICAgICRwYW5lbEhlYWRpbmcuYXBwZW5kKCRwYW5lbFRpdGxlKTtcbiAgICAgICAgICAgICRpY29uQ29udGFpbmVyLmFwcGVuZCgkY29sbGFwc2VJY29uKS5hcHBlbmRUbygkcGFuZWxIZWFkaW5nKTtcbiAgICAgICAgICAgICR0aGlzLmFwcGVuZCgkcGFuZWxIZWFkaW5nKTtcblxuICAgICAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgICAgICAgICRwYW5lbEJvZHkuY3NzKHsnZGlzcGxheSc6ICdub25lJ30pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJHRoaXMuYXBwZW5kKCRwYW5lbEJvZHkpO1xuXG4gICAgICAgICAgICAvLyBzZXQgZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgJGljb25Db250YWluZXIub24oJ2NsaWNrJywgX3RvZ2dsZSlcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9nZ2xlIGV2ZW50IGxpc3RlbmVyIGZvciBjbGlja3Mgb24gcGFuZWwgaGVhZGluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF90b2dnbGUgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc0NvbGxhcHNlZCA9ICRjb2xsYXBzZUljb24uaGFzQ2xhc3Mob3B0aW9ucy5leHBhbmRlZF9pY29uX2NsYXNzKTtcblxuICAgICAgICAgICAgJGNvbGxhcHNlSWNvbi50b2dnbGVDbGFzcyhvcHRpb25zLmNvbGxhcHNlZF9pY29uX2NsYXNzKTtcbiAgICAgICAgICAgICRjb2xsYXBzZUljb24udG9nZ2xlQ2xhc3Mob3B0aW9ucy5leHBhbmRlZF9pY29uX2NsYXNzKTtcbiAgICAgICAgICAgICRwYW5lbEJvZHkudG9nZ2xlKG9wdGlvbnMudG9nZ2xlX3RpbWUpO1xuXG4gICAgICAgICAgICB1c2VyQ29uZmlnLnNldCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG9wdGlvbnMudXNlcixcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogb3B0aW9ucy5zZWN0aW9uICsgJ19jb2xsYXBzZWQnLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IGlzQ29sbGFwc2VkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpZGdldCBpbml0aWFsaXphdGlvbiBmdW5jdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGRvbmVcbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICBfY2hlY2tSZXF1aXJlZE9wdGlvbnMoKTtcbiAgICAgICAgICAgIF9pbml0KCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG4iXX0=
