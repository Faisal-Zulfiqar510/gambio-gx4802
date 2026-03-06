'use strict';

/* --------------------------------------------------------------
 switcher.js 2022-02-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Switcher Widget
 *
 * This widget originates from the "switcher" mode of the existing checkbox widget. Because of the increased
 * complexity of the old widget code, the switcher mode is now server by this file. Apply the widget in a parent
 * container and it will search and convert all the checkbox/radio instances into switchers.
 *
 * ### Options
 *
 * **On State | `data-switcher-on-state` | String | Optional**
 *
 * Define the content of the "on" state.
 *
 * **Off State | `data-switcher-off-state` | String | Optional**
 *
 * Define the content of the "off" state.
 *
 * **Selector | `data-switcher-selector` | String | Optional**
 *
 * Set the selector of the checkboxes to be converted to switcher instances. It defaults to **input:checkbox**.
 *
 * ### Methods
 *
 * **Checked**
 *
 * ```js
 * // Set the checked value of the single checkbox selection (no change event will be triggered!).
 * $('table input:checkbox').switcher('checked', true);
 * ```
 *
 * ### Examples
 *
 * In the following example the checkbox element will be converted into a single-checkbox instance.
 *
 * ```html
 * <div class="wrapper" data-gx-widget="switcher">
 *   <input type="checkbox" />
 * </div>
 * ```
 *
 *
 *
 * @module Admin/Widgets/switcher
 */
gx.widgets.module('switcher', [], function (data) {

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
        onState: '<span class="fa fa-check"></span>',
        offState: '<span class="fa fa-times"></span>',
        selector: 'input:checkbox'
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
     * Set the "checked" property of the single checkbox instances.
     *
     * This method will update the value and display of the widgets without triggering a "change" event.
     *
     * @param {Boolean} isChecked The checkbox values will be updated along with their representation.
     *
     * @return {jQuery} Returns the jQuery selector for chained calls.
     */
    function _checked(isChecked) {
        $(this).prop('checked', isChecked);
        _onCheckboxChange.call(this);
        return $(this);
    }

    /**
     * Set the "disabled" property of the single checkbox instances.
     *
     * This method will update the value and display of the widgets without triggering a "change" event.
     *
     * @param {Boolean} isDisabled The checkbox values will be updated along with their representation.
     *
     * @return {jQuery} Returns the jQuery selector for chained calls.
     */
    function _disabled(isDisabled) {
        $(this).prop('disabled', isDisabled);
        _onCheckboxDisable.call(this);
        return $(this);
    }

    /**
     * Add Public Module Methods
     *
     * Example: $('input:checkbox').switcher('checked', false);
     */
    function _addPublicMethod() {
        if ($.fn.switcher) {
            return; // Method is already registered.
        }

        $.fn.extend({
            switcher: function switcher(action) {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                switch (action) {
                    case 'checked':
                        return _checked.apply(this, args);
                    case 'disabled':
                        return _disabled.apply(this, args);
                }
            }
        });
    }

    /**
     * On Switcher Click Event
     *
     * Delegate the click event to the checkbox elements which will update the DOM accordingly.
     *
     * @param {object} event
     */
    function _onSwitcherClick(event) {
        event.stopPropagation();

        if ($(this).hasClass('disabled')) {
            return false; // The switcher is disabled.
        }

        var $checkbox = $(this).find(options.selector);

        if ($checkbox.attr('type') !== 'radio' || !$checkbox.prop('checked')) {
            $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
        }
    }

    /**
     * On Checkbox Change
     *
     * This callback will update the display of the widget. It will perform the required animations and set the
     * respective state classes.
     */
    function _onCheckboxChange() {
        var $checkbox = $(this);
        var $switcher = $checkbox.parent();

        if (!$switcher.hasClass('checked') && $checkbox.prop('checked')) {
            $switcher.addClass('checked');
            if (options.selector === "input:radio") {
                $('input[name="' + $checkbox.attr('name') + '"]').not($checkbox).parents().removeClass('checked');
            }
        } else if ($switcher.hasClass('checked') && !$checkbox.prop('checked')) {
            $switcher.removeClass('checked');
        }
    }

    /**
     * On Checkbox Disable
     *
     * This callback will update the display of the widget. It will perform the required animations and set the
     * respective state classes.
     */
    function _onCheckboxDisable() {
        var $checkbox = $(this);
        var $switcher = $checkbox.parent();

        if (!$switcher.hasClass('disabled') && $checkbox.prop('disabled')) {
            $switcher.addClass('disabled');
        } else if ($switcher.hasClass('disabled') && !$checkbox.prop('disabled')) {
            $switcher.removeClass('disabled');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _addPublicMethod();
        $this.find(options.selector).each(function () {
            var $checkbox = $(this);
            var title = $checkbox.prop('title') ? 'title="' + $checkbox.prop('title') + '"' : '';
            var disabled = $checkbox.prop('disabled') ? 'disabled' : '';

            $checkbox.wrap('<div class="switcher ' + disabled + '" ' + title + '></div>').parent().append('\n                    <div class="switcher-toggler"></div>\n                    <div class="switcher-inner">\n                        <div class="switcher-state-on">' + options.onState + '</div>' + ( // avoid visible whitespace
            '<div class="switcher-state-off">' + options.offState + '</div>\n                    </div>\n                '));

            // Bind the switcher event handlers.
            $checkbox.parent().on('click', _onSwitcherClick).on('change', options.selector, _onCheckboxChange);

            // Trigger the change event to update the checkbox display.
            _onCheckboxChange.call($checkbox[0]);
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN3aXRjaGVyLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9uU3RhdGUiLCJvZmZTdGF0ZSIsInNlbGVjdG9yIiwib3B0aW9ucyIsImV4dGVuZCIsIl9jaGVja2VkIiwiaXNDaGVja2VkIiwicHJvcCIsIl9vbkNoZWNrYm94Q2hhbmdlIiwiY2FsbCIsIl9kaXNhYmxlZCIsImlzRGlzYWJsZWQiLCJfb25DaGVja2JveERpc2FibGUiLCJfYWRkUHVibGljTWV0aG9kIiwiZm4iLCJzd2l0Y2hlciIsImFjdGlvbiIsImFyZ3MiLCJhcHBseSIsIl9vblN3aXRjaGVyQ2xpY2siLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsImhhc0NsYXNzIiwiJGNoZWNrYm94IiwiZmluZCIsImF0dHIiLCJ0cmlnZ2VyIiwiJHN3aXRjaGVyIiwicGFyZW50IiwiYWRkQ2xhc3MiLCJub3QiLCJwYXJlbnRzIiwicmVtb3ZlQ2xhc3MiLCJpbml0IiwiZG9uZSIsImVhY2giLCJ0aXRsZSIsImRpc2FibGVkIiwid3JhcCIsImFwcGVuZCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNENBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FBa0IsVUFBbEIsRUFBOEIsRUFBOUIsRUFBa0MsVUFBVUMsSUFBVixFQUFnQjs7QUFFOUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxXQUFXO0FBQ2JDLGlCQUFTLG1DQURJO0FBRWJDLGtCQUFVLG1DQUZHO0FBR2JDLGtCQUFVO0FBSEcsS0FBakI7O0FBTUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUwsRUFBRU0sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CTCxR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U0F4QkQ7O0FBMEJBVztBQUNILEtBN0JEOztBQStCQSxXQUFPdkMsTUFBUDtBQUVILENBbE1EIiwiZmlsZSI6InN3aXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzd2l0Y2hlci5qcyAyMDIyLTAyLTE2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTd2l0Y2hlciBXaWRnZXRcbiAqXG4gKiBUaGlzIHdpZGdldCBvcmlnaW5hdGVzIGZyb20gdGhlIFwic3dpdGNoZXJcIiBtb2RlIG9mIHRoZSBleGlzdGluZyBjaGVja2JveCB3aWRnZXQuIEJlY2F1c2Ugb2YgdGhlIGluY3JlYXNlZFxuICogY29tcGxleGl0eSBvZiB0aGUgb2xkIHdpZGdldCBjb2RlLCB0aGUgc3dpdGNoZXIgbW9kZSBpcyBub3cgc2VydmVyIGJ5IHRoaXMgZmlsZS4gQXBwbHkgdGhlIHdpZGdldCBpbiBhIHBhcmVudFxuICogY29udGFpbmVyIGFuZCBpdCB3aWxsIHNlYXJjaCBhbmQgY29udmVydCBhbGwgdGhlIGNoZWNrYm94L3JhZGlvIGluc3RhbmNlcyBpbnRvIHN3aXRjaGVycy5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqT24gU3RhdGUgfCBgZGF0YS1zd2l0Y2hlci1vbi1zdGF0ZWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogRGVmaW5lIHRoZSBjb250ZW50IG9mIHRoZSBcIm9uXCIgc3RhdGUuXG4gKlxuICogKipPZmYgU3RhdGUgfCBgZGF0YS1zd2l0Y2hlci1vZmYtc3RhdGVgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIERlZmluZSB0aGUgY29udGVudCBvZiB0aGUgXCJvZmZcIiBzdGF0ZS5cbiAqXG4gKiAqKlNlbGVjdG9yIHwgYGRhdGEtc3dpdGNoZXItc2VsZWN0b3JgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFNldCB0aGUgc2VsZWN0b3Igb2YgdGhlIGNoZWNrYm94ZXMgdG8gYmUgY29udmVydGVkIHRvIHN3aXRjaGVyIGluc3RhbmNlcy4gSXQgZGVmYXVsdHMgdG8gKippbnB1dDpjaGVja2JveCoqLlxuICpcbiAqICMjIyBNZXRob2RzXG4gKlxuICogKipDaGVja2VkKipcbiAqXG4gKiBgYGBqc1xuICogLy8gU2V0IHRoZSBjaGVja2VkIHZhbHVlIG9mIHRoZSBzaW5nbGUgY2hlY2tib3ggc2VsZWN0aW9uIChubyBjaGFuZ2UgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQhKS5cbiAqICQoJ3RhYmxlIGlucHV0OmNoZWNrYm94Jykuc3dpdGNoZXIoJ2NoZWNrZWQnLCB0cnVlKTtcbiAqIGBgYFxuICpcbiAqICMjIyBFeGFtcGxlc1xuICpcbiAqIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSB0aGUgY2hlY2tib3ggZWxlbWVudCB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIGEgc2luZ2xlLWNoZWNrYm94IGluc3RhbmNlLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCIgZGF0YS1neC13aWRnZXQ9XCJzd2l0Y2hlclwiPlxuICogICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICpcbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvc3dpdGNoZXJcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoJ3N3aXRjaGVyJywgW10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgIG9uU3RhdGU6ICc8c3BhbiBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9zcGFuPicsXG4gICAgICAgIG9mZlN0YXRlOiAnPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj4nLFxuICAgICAgICBzZWxlY3RvcjogJ2lucHV0OmNoZWNrYm94J1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIFwiY2hlY2tlZFwiIHByb3BlcnR5IG9mIHRoZSBzaW5nbGUgY2hlY2tib3ggaW5zdGFuY2VzLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCB1cGRhdGUgdGhlIHZhbHVlIGFuZCBkaXNwbGF5IG9mIHRoZSB3aWRnZXRzIHdpdGhvdXQgdHJpZ2dlcmluZyBhIFwiY2hhbmdlXCIgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQ2hlY2tlZCBUaGUgY2hlY2tib3ggdmFsdWVzIHdpbGwgYmUgdXBkYXRlZCBhbG9uZyB3aXRoIHRoZWlyIHJlcHJlc2VudGF0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSBSZXR1cm5zIHRoZSBqUXVlcnkgc2VsZWN0b3IgZm9yIGNoYWluZWQgY2FsbHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2NoZWNrZWQoaXNDaGVja2VkKSB7XG4gICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsIGlzQ2hlY2tlZCk7XG4gICAgICAgIF9vbkNoZWNrYm94Q2hhbmdlLmNhbGwodGhpcyk7XG4gICAgICAgIHJldHVybiAkKHRoaXMpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIFwiZGlzYWJsZWRcIiBwcm9wZXJ0eSBvZiB0aGUgc2luZ2xlIGNoZWNrYm94IGluc3RhbmNlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgdXBkYXRlIHRoZSB2YWx1ZSBhbmQgZGlzcGxheSBvZiB0aGUgd2lkZ2V0cyB3aXRob3V0IHRyaWdnZXJpbmcgYSBcImNoYW5nZVwiIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBpc0Rpc2FibGVkIFRoZSBjaGVja2JveCB2YWx1ZXMgd2lsbCBiZSB1cGRhdGVkIGFsb25nIHdpdGggdGhlaXIgcmVwcmVzZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IFJldHVybnMgdGhlIGpRdWVyeSBzZWxlY3RvciBmb3IgY2hhaW5lZCBjYWxscy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZGlzYWJsZWQoaXNEaXNhYmxlZCkge1xuICAgICAgICAkKHRoaXMpLnByb3AoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gICAgICAgIF9vbkNoZWNrYm94RGlzYWJsZS5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gJCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgUHVibGljIE1vZHVsZSBNZXRob2RzXG4gICAgICpcbiAgICAgKiBFeGFtcGxlOiAkKCdpbnB1dDpjaGVja2JveCcpLnN3aXRjaGVyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9hZGRQdWJsaWNNZXRob2QoKSB7XG4gICAgICAgIGlmICgkLmZuLnN3aXRjaGVyKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIE1ldGhvZCBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQuXG4gICAgICAgIH1cblxuICAgICAgICAkLmZuLmV4dGVuZCh7XG4gICAgICAgICAgICBzd2l0Y2hlcjogZnVuY3Rpb24gKGFjdGlvbiwgLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jaGVja2VkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2Rpc2FibGVkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gU3dpdGNoZXIgQ2xpY2sgRXZlbnRcbiAgICAgKlxuICAgICAqIERlbGVnYXRlIHRoZSBjbGljayBldmVudCB0byB0aGUgY2hlY2tib3ggZWxlbWVudHMgd2hpY2ggd2lsbCB1cGRhdGUgdGhlIERPTSBhY2NvcmRpbmdseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblN3aXRjaGVyQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gVGhlIHN3aXRjaGVyIGlzIGRpc2FibGVkLlxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGNoZWNrYm94ID0gJCh0aGlzKS5maW5kKG9wdGlvbnMuc2VsZWN0b3IpO1xuICAgIFxuICAgICAgICBpZigkY2hlY2tib3guYXR0cigndHlwZScpICE9PSAncmFkaW8nIHx8ICEkY2hlY2tib3gucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkY2hlY2tib3hcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsICEkY2hlY2tib3gucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIENoZWNrYm94IENoYW5nZVxuICAgICAqXG4gICAgICogVGhpcyBjYWxsYmFjayB3aWxsIHVwZGF0ZSB0aGUgZGlzcGxheSBvZiB0aGUgd2lkZ2V0LiBJdCB3aWxsIHBlcmZvcm0gdGhlIHJlcXVpcmVkIGFuaW1hdGlvbnMgYW5kIHNldCB0aGVcbiAgICAgKiByZXNwZWN0aXZlIHN0YXRlIGNsYXNzZXMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uQ2hlY2tib3hDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICQodGhpcyk7XG4gICAgICAgIGNvbnN0ICRzd2l0Y2hlciA9ICRjaGVja2JveC5wYXJlbnQoKTtcbiAgICBcbiAgICAgICAgaWYgKCEkc3dpdGNoZXIuaGFzQ2xhc3MoJ2NoZWNrZWQnKSAmJiAkY2hlY2tib3gucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkc3dpdGNoZXIuYWRkQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNlbGVjdG9yID09PSBcImlucHV0OnJhZGlvXCIpIHtcbiAgICAgICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiJyArICRjaGVja2JveC5hdHRyKCduYW1lJykgKyAnXCJdJykubm90KCRjaGVja2JveCkucGFyZW50cygpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKCRzd2l0Y2hlci5oYXNDbGFzcygnY2hlY2tlZCcpICYmICEkY2hlY2tib3gucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkc3dpdGNoZXIucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBPbiBDaGVja2JveCBEaXNhYmxlXG4gICAgICpcbiAgICAgKiBUaGlzIGNhbGxiYWNrIHdpbGwgdXBkYXRlIHRoZSBkaXNwbGF5IG9mIHRoZSB3aWRnZXQuIEl0IHdpbGwgcGVyZm9ybSB0aGUgcmVxdWlyZWQgYW5pbWF0aW9ucyBhbmQgc2V0IHRoZVxuICAgICAqIHJlc3BlY3RpdmUgc3RhdGUgY2xhc3Nlcy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25DaGVja2JveERpc2FibGUoKSB7XG4gICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICQodGhpcyk7XG4gICAgICAgIGNvbnN0ICRzd2l0Y2hlciA9ICRjaGVja2JveC5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghJHN3aXRjaGVyLmhhc0NsYXNzKCdkaXNhYmxlZCcpICYmICRjaGVja2JveC5wcm9wKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAkc3dpdGNoZXIuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoJHN3aXRjaGVyLmhhc0NsYXNzKCdkaXNhYmxlZCcpICYmICEkY2hlY2tib3gucHJvcCgnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgJHN3aXRjaGVyLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgX2FkZFB1YmxpY01ldGhvZCgpO1xuICAgICAgICAkdGhpcy5maW5kKG9wdGlvbnMuc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgJGNoZWNrYm94ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gJGNoZWNrYm94LnByb3AoJ3RpdGxlJykgPyBgdGl0bGU9XCIkeyRjaGVja2JveC5wcm9wKCd0aXRsZScpfVwiYCA6ICcnO1xuICAgICAgICAgICAgY29uc3QgZGlzYWJsZWQgPSAkY2hlY2tib3gucHJvcCgnZGlzYWJsZWQnKSA/ICdkaXNhYmxlZCcgOiAnJztcblxuICAgICAgICAgICAgJGNoZWNrYm94XG4gICAgICAgICAgICAgICAgLndyYXAoYDxkaXYgY2xhc3M9XCJzd2l0Y2hlciAke2Rpc2FibGVkfVwiICR7dGl0bGV9PjwvZGl2PmApXG4gICAgICAgICAgICAgICAgLnBhcmVudCgpXG4gICAgICAgICAgICAgICAgLmFwcGVuZChgXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2l0Y2hlci10b2dnbGVyXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzd2l0Y2hlci1pbm5lclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXRjaGVyLXN0YXRlLW9uXCI+JHtvcHRpb25zLm9uU3RhdGV9PC9kaXY+YCArIC8vIGF2b2lkIHZpc2libGUgd2hpdGVzcGFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJzd2l0Y2hlci1zdGF0ZS1vZmZcIj4ke29wdGlvbnMub2ZmU3RhdGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGApO1xuXG4gICAgICAgICAgICAvLyBCaW5kIHRoZSBzd2l0Y2hlciBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAgICRjaGVja2JveFxuICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBfb25Td2l0Y2hlckNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgb3B0aW9ucy5zZWxlY3RvciwgX29uQ2hlY2tib3hDaGFuZ2UpO1xuXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIHRoZSBjaGFuZ2UgZXZlbnQgdG8gdXBkYXRlIHRoZSBjaGVja2JveCBkaXNwbGF5LlxuICAgICAgICAgICAgX29uQ2hlY2tib3hDaGFuZ2UuY2FsbCgkY2hlY2tib3hbMF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG5cbn0pOyJdfQ==
