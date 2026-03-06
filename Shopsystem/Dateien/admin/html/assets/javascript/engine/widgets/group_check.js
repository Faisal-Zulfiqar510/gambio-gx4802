'use strict';

/* --------------------------------------------------------------
 group_check.js 2017-10-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Group check widget
 *
 * The widget creates a panel with switcher fields for all customer groups. If the options "user" and "section" are
 * provided, the user configuration service will be used to store the panels collapsed/expanded state.
 *
 * ### Options (Required)
 *
 * **User | `data-panel-user` | Integer | Optional**
 *
 * Customer id of user, used by user configuration service to store the collapsed state.
 *
 * **Section | `data-panel-section` | String | Optional**
 *
 * Panel section, used by user configuration service 'configuration_key'. The value get a "**'group_check_'**"-prefix.
 *
 * ### Options (Additional)
 *
 * **Selected | `data-group_check-selected` | String | Additional**
 *
 * Comma separated list of customer status ids. If an switcher value is equal to one of the customer ids, the
 * switcher state is active. Alternatively you can set the value "all" to set all switchers to an active state.
 *
 * **Name | `data-group_check-name` | String | Additional**
 *
 * Name attribute of switchers hidden input:checkbox field. If no value is provided, it defaults to **'group_check'**
 *
 * ### Example
 *
 * * ```html
 * <div data-gx-widget="group_check"
 *      data-group_check-user="{$smarty.session.customer_id}"
 *      data-group_check-section="group-check-sample-section"
 *      data-group_check-active="[1,2,3]|[all]"
 *      data-group_check-name="custom-switcher-name"></div>
 * ```
 *
 * @module Admin/Widgets/group_check
 */
gx.widgets.module('group_check', ['xhr'],

/** @lends module:Widgets/group_check */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Widget Reference
     *
     * @type {object}
     */

    var $this = $(this);

    /**
     * Default Widget Options
     *
     * @type {object}
     */
    var defaults = {
        name: 'group_check'
    };

    /**
     * Final Widget Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    /**
     * Required options.
     *
     * @type {String[]}
     */
    var requiredOptions = ['user', 'section'];

    /**
     * Element for whether selecting or deselecting all other switcher.
     */
    var $allSwitcher = void 0;

    /**
     * Renders the group check box.
     *
     * @private
     */
    var _renderGroupCheck = function _renderGroupCheck() {
        jse.libs.xhr.get({
            url: './admin.php?do=JSWidgetsAjax/isGroupCheckEnabled'
        }).done(function (r) {
            if (r.status) {
                var $container = $('<div/>', {
                    'data-gx-widget': 'panel switcher',
                    'data-panel-title': jse.core.lang.translate('HEADING_GROUP_CHECK', 'content_manager'),
                    'data-panel-user': options.user,
                    'data-panel-section': 'group_check_' + options.section,
                    'data-panel-container_class': 'group-check'
                });

                $container.append(_renderBody(r.customerGroups)).appendTo($this);
                gx.widgets.init($container).then(function () {
                    _setEventListener();
                    _setSwitcherDefaultStates();
                });
            }
        });
    };

    /**
     * Sets default state of switcher elements.
     * The "selected" option is used to determine the default state.
     *
     * @private
     */
    var _setSwitcherDefaultStates = function _setSwitcherDefaultStates() {
        // just continue if option is not set
        if (undefined === options.selected || options.selected === '') {
            return;
        }

        // use bulk switcher action if option value is set to "all"
        if (options.selected === 'all') {
            $allSwitcher.find('input:checkbox').switcher('checked', true);
            _bulkSwitcherAction(true);
            return;
        }

        // activate switcher programmatically
        var preselection = void 0;
        if (Number.isInteger(options.selected)) {
            preselection = [options.selected];
        } else {
            preselection = options.selected.split(',').map(Number);
        }

        var switcher = $this.find('input:checkbox');
        var i = 0;

        for (; i < switcher.length; i++) {
            if (switcher[i].value !== 'all') {
                if (preselection.indexOf(parseInt(switcher[i].value, 10)) !== -1) {
                    $(switcher[i]).switcher('checked', true);
                }
            }
        }
        _tryActiveAllSwitcher();
    };

    /**
     * Renders the panel body.
     * @param {Object} customerGroups Serialized customer group collection, provided by ajax request.
     * @returns {jQuery} Panel body html.
     * @private
     */
    var _renderBody = function _renderBody(customerGroups) {
        var $gxContainer = $('<div/>', {
            'class': 'gx-container'
        });
        var $fieldSet = $('<fieldset/>');

        $allSwitcher = _renderFormGroup(jse.core.lang.translate('LABLE_GROUPCHECK_ALL', 'content_manager'), 'all');
        $fieldSet.append($allSwitcher);

        var i = 0;
        for (; i < customerGroups.length; i++) {
            $fieldSet.append(_renderFormGroup(customerGroups[i].names[jse.core.config.get('languageCode').toUpperCase()], customerGroups[i].id));
        }
        $gxContainer.append($fieldSet);

        return $gxContainer;
    };

    /**
     * Renders the form group elements of the group check.
     *
     * @param {string} label Label name.
     * @param {string} value Switchers value attribute.
     * @returns {jQuery} Form group html.
     * @private
     */
    var _renderFormGroup = function _renderFormGroup(label, value) {
        var $formGroup = $('<div/>', { 'class': 'form-group' });
        var $label = $('<label/>', {
            'for': 'customer-groups-' + label.toLowerCase(),
            'class': 'col-md-4',
            'text': label
        });
        var $inputContainer = $('<div/>', {
            'class': 'col-md-6'
        });
        var $input = $('<input/>', {
            'type': 'checkbox',
            'id': 'customer-groups-' + label.toLowerCase(),
            'name': options.name + '[]',
            'value': value,
            'checked': options.all_checked
        });
        $inputContainer.append($input);

        return $formGroup.append($label).append($inputContainer);
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
     * Sets the event listener for the group check widget.
     *
     * @private
     */
    var _setEventListener = function _setEventListener() {
        var switcher = $this.find('input:checkbox');

        // check all switcher if the "all" switcher is clicked
        $allSwitcher.on('change', function () {
            if ($allSwitcher.find('input:checkbox').prop('checked')) {
                _bulkSwitcherAction(true);
            } else {
                _bulkSwitcherAction(false);
            }
        });

        switcher.on('change', function (e) {
            if (!$allSwitcher.find('input:checkbox').is(e.currentTarget)) {
                // remove checked attribute from "all" switcher if one is deselected
                if (!$(e.currentTarget).prop('checked')) {
                    $allSwitcher.find('input:checkbox').switcher('checked', false);
                }

                _tryActiveAllSwitcher();
            }
        });
    };

    /**
     * This method checks if all other switcher fields instead of "all" are active.
     * If so, the "all" switcher will be activated.
     *
     * @private
     */
    var _tryActiveAllSwitcher = function _tryActiveAllSwitcher() {
        var switcher = $this.find('input:checkbox');
        var allChecked = true;
        var i = 0;

        for (; i < switcher.length; i++) {
            if (!$allSwitcher.find('input:checkbox').is($(switcher[i]))) {
                allChecked = allChecked && $(switcher[i]).prop('checked');
            }
        }
        if (allChecked) {
            $allSwitcher.find('input:checkbox').switcher('checked', true);
        }
    };

    /**
     * Bulk action for whether selecting or deselecting all switcher elements.
     *
     * @param {boolean} checked Status of "checked" property.
     * @private
     */
    var _bulkSwitcherAction = function _bulkSwitcherAction(checked) {
        var switcher = $this.find('input:checkbox');
        var i = 0;
        for (; i < switcher.length; i++) {
            if (!$allSwitcher.find('input:checkbox').is($(switcher[i]))) {
                $(switcher[i]).switcher('checked', checked);
            }
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        _checkRequiredOptions();
        _renderGroupCheck();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdyb3VwX2NoZWNrLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm5hbWUiLCJvcHRpb25zIiwiZXh0ZW5kIiwicmVxdWlyZWRPcHRpb25zIiwiJGFsbFN3aXRjaGVyIiwiX3JlbmRlckdyb3VwQ2hlY2siLCJqc2UiLCJsaWJzIiwieGhyIiwiZ2V0IiwidXJsIiwiZG9uZSIsInIiLCJzdGF0dXMiLCIkY29udGFpbmVyIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJ1c2VyIiwic2VjdGlvbiIsImFwcGVuZCIsIl9yZW5kZXJCb2R5IiwiY3VzdG9tZXJHcm91cHMiLCJhcHBlbmRUbyIsImluaXQiLCJ0aGVuIiwiX3NldEV2ZW50TGlzdGVuZXIiLCJfc2V0U3dpdGNoZXJEZWZhdWx0U3RhdGVzIiwidW5kZWZpbmVkIiwic2VsZWN0ZWQiLCJmaW5kIiwic3dpdGNoZXIiLCJfYnVsa1N3aXRjaGVyQWN0aW9uIiwicHJlc2VsZWN0aW9uIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwic3BsaXQiLCJtYXAiLCJpIiwibGVuZ3RoIiwidmFsdWUiLCJpbmRleE9mIiwicGFyc2VJbnQiLCJfdHJ5QWN0aXZlQWxsU3dpdGNoZXIiLCIkZ3hDb250YWluZXIiLCIkZmllbGRTZXQiLCJfcmVuZGVyRm9ybUdyb3VwIiwibmFtZXMiLCJjb25maWciLCJ0b1VwcGVyQ2FzZSIsImlkIiwibGFiZWwiLCIkZm9ybUdyb3VwIiwiJGxhYmVsIiwidG9Mb3dlckNhc2UiLCIkaW5wdXRDb250YWluZXIiLCIkaW5wdXQiLCJhbGxfY2hlY2tlZCIsIl9jaGVja1JlcXVpcmVkT3B0aW9ucyIsIkVycm9yIiwib24iLCJwcm9wIiwiaXMiLCJlIiwiY3VycmVudFRhcmdldCIsImFsbENoZWNrZWQiLCJjaGVja2VkIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QXNCLFVBQVc7QUFDbkMsWUFBTUQsV0FBV2xDLE1BQU1pQyxJQUFOLENBQVcsZ0JBQVgsQ0FBakI7QUFDQSxZQUFJUSxJQUFJLENBQVI7QUFDQSxlQUFPQSxJQUFJUCxTQUFTUSxNQUFwQixFQUE0QkQsR0FBNUIsRUFBaUM7QUFDN0IsZ0JBQUksQ0FBQ2xDLGFBQWEwQixJQUFiLENBQWtCLGdCQUFsQixFQUFvQ2dDLEVBQXBDLENBQXVDaEUsRUFBRWlDLFNBQVNPLENBQVQsQ0FBRixDQUF2QyxDQUFMLEVBQTZEO0FBQ3pEeEMsa0JBQUVpQyxTQUFTTyxDQUFULENBQUYsRUFBZVAsUUFBZixDQUF3QixTQUF4QixFQUFtQ21DLE9BQW5DO0FBQ0g7QUFDSjtBQUNKLEtBUkQ7O0FBVUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQXZFLFdBQU82QixJQUFQLEdBQWMsZ0JBQVE7QUFDbEJrQztBQUNBckQ7QUFDQU07QUFDSCxLQUpEOztBQU1BLFdBQU9oQixNQUFQO0FBQ0gsQ0FqUkwiLCJmaWxlIjoiZ3JvdXBfY2hlY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGdyb3VwX2NoZWNrLmpzIDIwMTctMTAtMTBcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEdyb3VwIGNoZWNrIHdpZGdldFxuICpcbiAqIFRoZSB3aWRnZXQgY3JlYXRlcyBhIHBhbmVsIHdpdGggc3dpdGNoZXIgZmllbGRzIGZvciBhbGwgY3VzdG9tZXIgZ3JvdXBzLiBJZiB0aGUgb3B0aW9ucyBcInVzZXJcIiBhbmQgXCJzZWN0aW9uXCIgYXJlXG4gKiBwcm92aWRlZCwgdGhlIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlIHdpbGwgYmUgdXNlZCB0byBzdG9yZSB0aGUgcGFuZWxzIGNvbGxhcHNlZC9leHBhbmRlZCBzdGF0ZS5cbiAqXG4gKiAjIyMgT3B0aW9ucyAoUmVxdWlyZWQpXG4gKlxuICogKipVc2VyIHwgYGRhdGEtcGFuZWwtdXNlcmAgfCBJbnRlZ2VyIHwgT3B0aW9uYWwqKlxuICpcbiAqIEN1c3RvbWVyIGlkIG9mIHVzZXIsIHVzZWQgYnkgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UgdG8gc3RvcmUgdGhlIGNvbGxhcHNlZCBzdGF0ZS5cbiAqXG4gKiAqKlNlY3Rpb24gfCBgZGF0YS1wYW5lbC1zZWN0aW9uYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQYW5lbCBzZWN0aW9uLCB1c2VkIGJ5IHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlICdjb25maWd1cmF0aW9uX2tleScuIFRoZSB2YWx1ZSBnZXQgYSBcIioqJ2dyb3VwX2NoZWNrXycqKlwiLXByZWZpeC5cbiAqXG4gKiAjIyMgT3B0aW9ucyAoQWRkaXRpb25hbClcbiAqXG4gKiAqKlNlbGVjdGVkIHwgYGRhdGEtZ3JvdXBfY2hlY2stc2VsZWN0ZWRgIHwgU3RyaW5nIHwgQWRkaXRpb25hbCoqXG4gKlxuICogQ29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgY3VzdG9tZXIgc3RhdHVzIGlkcy4gSWYgYW4gc3dpdGNoZXIgdmFsdWUgaXMgZXF1YWwgdG8gb25lIG9mIHRoZSBjdXN0b21lciBpZHMsIHRoZVxuICogc3dpdGNoZXIgc3RhdGUgaXMgYWN0aXZlLiBBbHRlcm5hdGl2ZWx5IHlvdSBjYW4gc2V0IHRoZSB2YWx1ZSBcImFsbFwiIHRvIHNldCBhbGwgc3dpdGNoZXJzIHRvIGFuIGFjdGl2ZSBzdGF0ZS5cbiAqXG4gKiAqKk5hbWUgfCBgZGF0YS1ncm91cF9jaGVjay1uYW1lYCB8IFN0cmluZyB8IEFkZGl0aW9uYWwqKlxuICpcbiAqIE5hbWUgYXR0cmlidXRlIG9mIHN3aXRjaGVycyBoaWRkZW4gaW5wdXQ6Y2hlY2tib3ggZmllbGQuIElmIG5vIHZhbHVlIGlzIHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byAqKidncm91cF9jaGVjaycqKlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogKiBgYGBodG1sXG4gKiA8ZGl2IGRhdGEtZ3gtd2lkZ2V0PVwiZ3JvdXBfY2hlY2tcIlxuICogICAgICBkYXRhLWdyb3VwX2NoZWNrLXVzZXI9XCJ7JHNtYXJ0eS5zZXNzaW9uLmN1c3RvbWVyX2lkfVwiXG4gKiAgICAgIGRhdGEtZ3JvdXBfY2hlY2stc2VjdGlvbj1cImdyb3VwLWNoZWNrLXNhbXBsZS1zZWN0aW9uXCJcbiAqICAgICAgZGF0YS1ncm91cF9jaGVjay1hY3RpdmU9XCJbMSwyLDNdfFthbGxdXCJcbiAqICAgICAgZGF0YS1ncm91cF9jaGVjay1uYW1lPVwiY3VzdG9tLXN3aXRjaGVyLW5hbWVcIj48L2Rpdj5cbiAqIGBgYFxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9ncm91cF9jaGVja1xuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnZ3JvdXBfY2hlY2snLFxuXG4gICAgWyd4aHInXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOldpZGdldHMvZ3JvdXBfY2hlY2sgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgbmFtZTogJ2dyb3VwX2NoZWNrJ1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXF1aXJlZCBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCByZXF1aXJlZE9wdGlvbnMgPSBbJ3VzZXInLCAnc2VjdGlvbiddO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbGVtZW50IGZvciB3aGV0aGVyIHNlbGVjdGluZyBvciBkZXNlbGVjdGluZyBhbGwgb3RoZXIgc3dpdGNoZXIuXG4gICAgICAgICAqL1xuICAgICAgICBsZXQgJGFsbFN3aXRjaGVyO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW5kZXJzIHRoZSBncm91cCBjaGVjayBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVuZGVyR3JvdXBDaGVjayA9ICgpID0+IHtcbiAgICAgICAgICAgIGpzZS5saWJzLnhoci5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPUpTV2lkZ2V0c0FqYXgvaXNHcm91cENoZWNrRW5hYmxlZCdcbiAgICAgICAgICAgIH0pLmRvbmUociA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHIuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRjb250YWluZXIgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1neC13aWRnZXQnOiAncGFuZWwgc3dpdGNoZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtcGFuZWwtdGl0bGUnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnSEVBRElOR19HUk9VUF9DSEVDSycsICdjb250ZW50X21hbmFnZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXBhbmVsLXVzZXInOiBvcHRpb25zLnVzZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1wYW5lbC1zZWN0aW9uJzogJ2dyb3VwX2NoZWNrXycgKyBvcHRpb25zLnNlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1wYW5lbC1jb250YWluZXJfY2xhc3MnOiAnZ3JvdXAtY2hlY2snXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuYXBwZW5kKF9yZW5kZXJCb2R5KHIuY3VzdG9tZXJHcm91cHMpKS5hcHBlbmRUbygkdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkY29udGFpbmVyKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZXRFdmVudExpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfc2V0U3dpdGNoZXJEZWZhdWx0U3RhdGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIGRlZmF1bHQgc3RhdGUgb2Ygc3dpdGNoZXIgZWxlbWVudHMuXG4gICAgICAgICAqIFRoZSBcInNlbGVjdGVkXCIgb3B0aW9uIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBkZWZhdWx0IHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NldFN3aXRjaGVyRGVmYXVsdFN0YXRlcyA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIGp1c3QgY29udGludWUgaWYgb3B0aW9uIGlzIG5vdCBzZXRcbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IG9wdGlvbnMuc2VsZWN0ZWQgfHwgb3B0aW9ucy5zZWxlY3RlZCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHVzZSBidWxrIHN3aXRjaGVyIGFjdGlvbiBpZiBvcHRpb24gdmFsdWUgaXMgc2V0IHRvIFwiYWxsXCJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNlbGVjdGVkID09PSAnYWxsJykge1xuICAgICAgICAgICAgICAgICRhbGxTd2l0Y2hlci5maW5kKCdpbnB1dDpjaGVja2JveCcpLnN3aXRjaGVyKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgX2J1bGtTd2l0Y2hlckFjdGlvbih0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGFjdGl2YXRlIHN3aXRjaGVyIHByb2dyYW1tYXRpY2FsbHlcbiAgICAgICAgICAgIGxldCBwcmVzZWxlY3Rpb247XG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLnNlbGVjdGVkKSkge1xuICAgICAgICAgICAgICAgIHByZXNlbGVjdGlvbiA9IFtvcHRpb25zLnNlbGVjdGVkXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJlc2VsZWN0aW9uID0gb3B0aW9ucy5zZWxlY3RlZC5zcGxpdCgnLCcpLm1hcChOdW1iZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzd2l0Y2hlciA9ICR0aGlzLmZpbmQoJ2lucHV0OmNoZWNrYm94Jyk7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoOyBpIDwgc3dpdGNoZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoc3dpdGNoZXJbaV0udmFsdWUgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmVzZWxlY3Rpb24uaW5kZXhPZihwYXJzZUludChzd2l0Y2hlcltpXS52YWx1ZSwgMTApKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoc3dpdGNoZXJbaV0pLnN3aXRjaGVyKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdHJ5QWN0aXZlQWxsU3dpdGNoZXIoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyB0aGUgcGFuZWwgYm9keS5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGN1c3RvbWVyR3JvdXBzIFNlcmlhbGl6ZWQgY3VzdG9tZXIgZ3JvdXAgY29sbGVjdGlvbiwgcHJvdmlkZWQgYnkgYWpheCByZXF1ZXN0LlxuICAgICAgICAgKiBAcmV0dXJucyB7alF1ZXJ5fSBQYW5lbCBib2R5IGh0bWwuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVuZGVyQm9keSA9IGN1c3RvbWVyR3JvdXBzID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRneENvbnRhaW5lciA9ICQoJzxkaXYvPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnZ3gtY29udGFpbmVyJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCAkZmllbGRTZXQgPSAkKCc8ZmllbGRzZXQvPicpO1xuXG4gICAgICAgICAgICAkYWxsU3dpdGNoZXIgPSBfcmVuZGVyRm9ybUdyb3VwKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdMQUJMRV9HUk9VUENIRUNLX0FMTCcsICdjb250ZW50X21hbmFnZXInKSwgJ2FsbCcpO1xuICAgICAgICAgICAgJGZpZWxkU2V0LmFwcGVuZCgkYWxsU3dpdGNoZXIpO1xuXG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGN1c3RvbWVyR3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJGZpZWxkU2V0LmFwcGVuZChfcmVuZGVyRm9ybUdyb3VwKGN1c3RvbWVyR3JvdXBzW2ldLm5hbWVzW2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpXG4gICAgICAgICAgICAgICAgICAgIC50b1VwcGVyQ2FzZSgpXSwgY3VzdG9tZXJHcm91cHNbaV0uaWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRneENvbnRhaW5lci5hcHBlbmQoJGZpZWxkU2V0KTtcblxuICAgICAgICAgICAgcmV0dXJuICRneENvbnRhaW5lcjtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyB0aGUgZm9ybSBncm91cCBlbGVtZW50cyBvZiB0aGUgZ3JvdXAgY2hlY2suXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYWJlbCBMYWJlbCBuYW1lLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgU3dpdGNoZXJzIHZhbHVlIGF0dHJpYnV0ZS5cbiAgICAgICAgICogQHJldHVybnMge2pRdWVyeX0gRm9ybSBncm91cCBodG1sLlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3JlbmRlckZvcm1Hcm91cCA9IChsYWJlbCwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtR3JvdXAgPSAkKCc8ZGl2Lz4nLCB7J2NsYXNzJzogJ2Zvcm0tZ3JvdXAnfSk7XG4gICAgICAgICAgICBjb25zdCAkbGFiZWwgPSAkKCc8bGFiZWwvPicsIHtcbiAgICAgICAgICAgICAgICAnZm9yJzogJ2N1c3RvbWVyLWdyb3Vwcy0nICsgbGFiZWwudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnY29sLW1kLTQnLFxuICAgICAgICAgICAgICAgICd0ZXh0JzogbGFiZWxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgJGlucHV0Q29udGFpbmVyID0gJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdjb2wtbWQtNidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJCgnPGlucHV0Lz4nLCB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICAgICdpZCc6ICdjdXN0b21lci1ncm91cHMtJyArIGxhYmVsLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgJ25hbWUnOiBvcHRpb25zLm5hbWUgKyAnW10nLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgICAgICAgICAgICdjaGVja2VkJzogb3B0aW9ucy5hbGxfY2hlY2tlZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkaW5wdXRDb250YWluZXIuYXBwZW5kKCRpbnB1dCk7XG5cbiAgICAgICAgICAgIHJldHVybiAkZm9ybUdyb3VwLmFwcGVuZCgkbGFiZWwpLmFwcGVuZCgkaW5wdXRDb250YWluZXIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgYWxsIHJlcXVpcmVkIG9wdGlvbnMgYXJlIHBhc3NlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9jaGVja1JlcXVpcmVkT3B0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgcmVxdWlyZWRPcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCA9PT0gb3B0aW9uc1tyZXF1aXJlZE9wdGlvbnNbaV1dKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgd2lkZ2V0IG9wdGlvbiBcIicgKyByZXF1aXJlZE9wdGlvbnNbaV0gKyAnXCIgaXMgbm8gc2V0IScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIHRoZSBncm91cCBjaGVjayB3aWRnZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfc2V0RXZlbnRMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN3aXRjaGVyID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgYWxsIHN3aXRjaGVyIGlmIHRoZSBcImFsbFwiIHN3aXRjaGVyIGlzIGNsaWNrZWRcbiAgICAgICAgICAgICRhbGxTd2l0Y2hlci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkYWxsU3dpdGNoZXIuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgX2J1bGtTd2l0Y2hlckFjdGlvbih0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfYnVsa1N3aXRjaGVyQWN0aW9uKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3dpdGNoZXIub24oJ2NoYW5nZScsIGUgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghJGFsbFN3aXRjaGVyLmZpbmQoJ2lucHV0OmNoZWNrYm94JykuaXMoZS5jdXJyZW50VGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgY2hlY2tlZCBhdHRyaWJ1dGUgZnJvbSBcImFsbFwiIHN3aXRjaGVyIGlmIG9uZSBpcyBkZXNlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgIGlmICghJChlLmN1cnJlbnRUYXJnZXQpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGFsbFN3aXRjaGVyLmZpbmQoJ2lucHV0OmNoZWNrYm94Jykuc3dpdGNoZXIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfdHJ5QWN0aXZlQWxsU3dpdGNoZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhpcyBtZXRob2QgY2hlY2tzIGlmIGFsbCBvdGhlciBzd2l0Y2hlciBmaWVsZHMgaW5zdGVhZCBvZiBcImFsbFwiIGFyZSBhY3RpdmUuXG4gICAgICAgICAqIElmIHNvLCB0aGUgXCJhbGxcIiBzd2l0Y2hlciB3aWxsIGJlIGFjdGl2YXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF90cnlBY3RpdmVBbGxTd2l0Y2hlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN3aXRjaGVyID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKTtcbiAgICAgICAgICAgIGxldCBhbGxDaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBpID0gMDtcblxuICAgICAgICAgICAgZm9yICg7IGkgPCBzd2l0Y2hlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghJGFsbFN3aXRjaGVyLmZpbmQoJ2lucHV0OmNoZWNrYm94JykuaXMoJChzd2l0Y2hlcltpXSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbENoZWNrZWQgPSBhbGxDaGVja2VkICYmICQoc3dpdGNoZXJbaV0pLnByb3AoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWxsQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICRhbGxTd2l0Y2hlci5maW5kKCdpbnB1dDpjaGVja2JveCcpLnN3aXRjaGVyKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVsayBhY3Rpb24gZm9yIHdoZXRoZXIgc2VsZWN0aW5nIG9yIGRlc2VsZWN0aW5nIGFsbCBzd2l0Y2hlciBlbGVtZW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIFN0YXR1cyBvZiBcImNoZWNrZWRcIiBwcm9wZXJ0eS5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9idWxrU3dpdGNoZXJBY3Rpb24gPSBjaGVja2VkID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHN3aXRjaGVyID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKTtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgc3dpdGNoZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoISRhbGxTd2l0Y2hlci5maW5kKCdpbnB1dDpjaGVja2JveCcpLmlzKCQoc3dpdGNoZXJbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICAkKHN3aXRjaGVyW2ldKS5zd2l0Y2hlcignY2hlY2tlZCcsIGNoZWNrZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSB3aWRnZXQsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIF9jaGVja1JlcXVpcmVkT3B0aW9ucygpO1xuICAgICAgICAgICAgX3JlbmRlckdyb3VwQ2hlY2soKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
