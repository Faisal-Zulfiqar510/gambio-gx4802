'use strict';

/* --------------------------------------------------------------
 single_checkbox.js 2016-10-17
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Single Checkbox Widget
 *
 * This widget originates from the "single-checkbox" mode of the existing checkbox widget. Because of the
 * increased complexity of the old widget code, the single-checkbox mode is now served by this file. Apply the
 * widget in a parent container and it will search and convert all the instances into fine checkboxes.
 *
 * If you want to dynamically change the state of the checkbox, apply the new "checked" prop in the input:checkbox
 * element and then trigger the "change" event. This will also update the .single-checkbox wrapper.
 *
 * ### Options
 *
 * **Selector | `data-single_checkbox-selector` | String | Optional**
 *
 * Set the selector of the checkboxes to be converted to single checkbox instances. It defaults to **input:checkbox**.
 *
 * ### Methods
 *
 * **Checked**
 *
 * ```js
 * // Set the checked value of the single checkbox selection (no change event will be triggered!).
 * $('table input:checkbox').single_checkbox('checked', true);
 * ```
 *
 * ### Events
 *
 * **Initialization**
 *
 * This module triggers the "single_checkbox:ready" event, which will be handled in the `checkbox_mapping.js` file.
 * It is needed to add the caret symbol next to the checkbox and to open the multi select dropdown menu next to it.
 *
 * ### Examples
 *
 * In the following example the checkbox element will be converted into a single-checkbox instance.
 *
 * ```html
 * <div class="wrapper" data-gx-widget="single_checkbox">
 *   <input type="checkbox" />
 * </div>
 * ```
 */
gx.widgets.module('single_checkbox', [], function (data) {

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
     * Add Public Module Methods
     *
     * Example: $('input:checkbox').single_checkbox('checked', false);
     */
    function _addPublicMethod() {
        if ($.fn.single_checkbox) {
            return; // Method is already registered.
        }

        $.fn.extend({
            single_checkbox: function single_checkbox(action) {
                switch (action) {
                    case 'checked':
                        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                            args[_key - 1] = arguments[_key];
                        }

                        return _checked.apply(this, args);
                }
            }
        });
    }

    /**
     * Wrap the checkbox elements with an external <span> which will be styled with CSS.
     *
     * This method will also bind the event handlers of each checkbox element.
     */
    function _wrapCheckboxElements() {
        $this.find(options.selector).each(function () {
            var checked = $(this).prop('checked') ? 'checked' : '';
            var disabled = $(this).prop('disabled') ? 'disabled' : '';
            var title = $(this).attr('title');

            $(this).css({
                position: 'absolute',
                left: '-100000px'
            }).wrap('<span class="single-checkbox ' + checked + ' ' + disabled + '" ' + (title ? title = '"' + title + '"' : '') + '></span>').parent().append('<i class="fa fa-check"></i>');

            $(this).on('focus', _onCheckboxFocus).on('blur', _onCheckboxBlur).on('change', _onCheckboxChange);
        });
    }

    /**
     * On Checkbox Change
     *
     * This event handler will make sure that the parent has the correct classes depending the checkbox state.
     */
    function _onCheckboxChange() {
        var $wrapper = $(this).parent();
        var isChecked = $(this).prop('checked');

        if (isChecked && !$wrapper.hasClass('checked')) {
            $wrapper.addClass('checked');
        } else if (!isChecked && $wrapper.hasClass('checked')) {
            $wrapper.removeClass('checked');
        }
    }

    /**
     * On Checkbox Focus
     *
     * This event handler will add the "focused" class which is used for styling.
     */
    function _onCheckboxFocus() {
        $(this).parent().addClass('focused');
    }

    /**
     * On Checkbox Blur
     *
     * This event handler will remove the "focused" class which is used for styling.
     */
    function _onCheckboxBlur() {
        $(this).parent().removeClass('focused');
    }

    /**
     * On Wrapper Click
     *
     * This event handler will delegate the click to the checkbox and must not change the state of the widget.
     *
     * @param event {object}
     */
    function _onWrapperClick(event) {
        event.stopPropagation();

        if ($(this).hasClass('disabled') || $this.find('.dataTables_empty').length) {
            return;
        }

        var $checkbox = $(this).children('input:checkbox');

        $checkbox.prop('checked', !$checkbox.prop('checked')).trigger('change');
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _addPublicMethod();
        _wrapCheckboxElements();

        $this.off('click', '.single-checkbox').on('click', '.single-checkbox', _onWrapperClick);

        $this.trigger('single_checkbox:ready'); // Needed for the checkbox_mapping.js file.

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpbmdsZV9jaGVja2JveC5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJzZWxlY3RvciIsIm9wdGlvbnMiLCJleHRlbmQiLCJfY2hlY2tlZCIsImlzQ2hlY2tlZCIsInByb3AiLCJfb25DaGVja2JveENoYW5nZSIsImNhbGwiLCJfYWRkUHVibGljTWV0aG9kIiwiZm4iLCJzaW5nbGVfY2hlY2tib3giLCJhY3Rpb24iLCJhcmdzIiwiYXBwbHkiLCJfd3JhcENoZWNrYm94RWxlbWVudHMiLCJmaW5kIiwiZWFjaCIsImNoZWNrZWQiLCJkaXNhYmxlZCIsInRpdGxlIiwiYXR0ciIsImNzcyIsInBvc2l0aW9uIiwibGVmdCIsIndyYXAiLCJwYXJlbnQiLCJhcHBlbmQiLCJvbiIsIl9vbkNoZWNrYm94Rm9jdXMiLCJfb25DaGVja2JveEJsdXIiLCIkd3JhcHBlciIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIl9vbldyYXBwZXJDbGljayIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwibGVuZ3RoIiwiJGNoZWNrYm94IiwiY2hpbGRyZW4iLCJ0cmlnZ2VyIiwiaW5pdCIsImRvbmUiLCJvZmYiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMENBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FBa0IsaUJBQWxCLEVBQXFDLEVBQXJDLEVBQXlDLFVBQVVDLElBQVYsRUFBZ0I7O0FBRXJEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVztBQUNiQyxrQkFBVTtBQURHLEtBQWpCOztBQUlBOzs7OztBQUtBLFFBQU1DLFVBQVVILEVBQUVJLE1BQUYsQ0FBUyxJQUFULEVBQWUs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RUFBUWlDLFFBQVIsQ0FBaUIsVUFBakIsS0FBZ0NsQyxNQUFNa0IsSUFBTixDQUFXLG1CQUFYLEVBQWdDc0IsTUFBcEUsRUFBNEU7QUFDeEU7QUFDSDs7QUFFRCxZQUFNQyxZQUFZeEMsRUFBRSxJQUFGLEVBQVF5QyxRQUFSLENBQWlCLGdCQUFqQixDQUFsQjs7QUFFQUQsa0JBQ0tqQyxJQURMLENBQ1UsU0FEVixFQUNxQixDQUFDaUMsVUFBVWpDLElBQVYsQ0FBZSxTQUFmLENBRHRCLEVBRUttQyxPQUZMLENBRWEsUUFGYjtBQUdIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTdDLFdBQU84QyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQmxDO0FBQ0FNOztBQUVBakIsY0FDSzhDLEdBREwsQ0FDUyxPQURULEVBQ2tCLGtCQURsQixFQUVLaEIsRUFGTCxDQUVRLE9BRlIsRUFFaUIsa0JBRmpCLEVBRXFDTyxlQUZyQzs7QUFJQXJDLGNBQU0yQyxPQUFOLENBQWMsdUJBQWQsRUFSMEIsQ0FRYzs7QUFFeENFO0FBQ0gsS0FYRDs7QUFhQSxXQUFPL0MsTUFBUDtBQUNILENBakxEIiwiZmlsZSI6InNpbmdsZV9jaGVja2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2luZ2xlX2NoZWNrYm94LmpzIDIwMTYtMTAtMTdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFNpbmdsZSBDaGVja2JveCBXaWRnZXRcbiAqXG4gKiBUaGlzIHdpZGdldCBvcmlnaW5hdGVzIGZyb20gdGhlIFwic2luZ2xlLWNoZWNrYm94XCIgbW9kZSBvZiB0aGUgZXhpc3RpbmcgY2hlY2tib3ggd2lkZ2V0LiBCZWNhdXNlIG9mIHRoZVxuICogaW5jcmVhc2VkIGNvbXBsZXhpdHkgb2YgdGhlIG9sZCB3aWRnZXQgY29kZSwgdGhlIHNpbmdsZS1jaGVja2JveCBtb2RlIGlzIG5vdyBzZXJ2ZWQgYnkgdGhpcyBmaWxlLiBBcHBseSB0aGVcbiAqIHdpZGdldCBpbiBhIHBhcmVudCBjb250YWluZXIgYW5kIGl0IHdpbGwgc2VhcmNoIGFuZCBjb252ZXJ0IGFsbCB0aGUgaW5zdGFuY2VzIGludG8gZmluZSBjaGVja2JveGVzLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIGR5bmFtaWNhbGx5IGNoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIGNoZWNrYm94LCBhcHBseSB0aGUgbmV3IFwiY2hlY2tlZFwiIHByb3AgaW4gdGhlIGlucHV0OmNoZWNrYm94XG4gKiBlbGVtZW50IGFuZCB0aGVuIHRyaWdnZXIgdGhlIFwiY2hhbmdlXCIgZXZlbnQuIFRoaXMgd2lsbCBhbHNvIHVwZGF0ZSB0aGUgLnNpbmdsZS1jaGVja2JveCB3cmFwcGVyLlxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipTZWxlY3RvciB8IGBkYXRhLXNpbmdsZV9jaGVja2JveC1zZWxlY3RvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogU2V0IHRoZSBzZWxlY3RvciBvZiB0aGUgY2hlY2tib3hlcyB0byBiZSBjb252ZXJ0ZWQgdG8gc2luZ2xlIGNoZWNrYm94IGluc3RhbmNlcy4gSXQgZGVmYXVsdHMgdG8gKippbnB1dDpjaGVja2JveCoqLlxuICpcbiAqICMjIyBNZXRob2RzXG4gKlxuICogKipDaGVja2VkKipcbiAqXG4gKiBgYGBqc1xuICogLy8gU2V0IHRoZSBjaGVja2VkIHZhbHVlIG9mIHRoZSBzaW5nbGUgY2hlY2tib3ggc2VsZWN0aW9uIChubyBjaGFuZ2UgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQhKS5cbiAqICQoJ3RhYmxlIGlucHV0OmNoZWNrYm94Jykuc2luZ2xlX2NoZWNrYm94KCdjaGVja2VkJywgdHJ1ZSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgRXZlbnRzXG4gKlxuICogKipJbml0aWFsaXphdGlvbioqXG4gKlxuICogVGhpcyBtb2R1bGUgdHJpZ2dlcnMgdGhlIFwic2luZ2xlX2NoZWNrYm94OnJlYWR5XCIgZXZlbnQsIHdoaWNoIHdpbGwgYmUgaGFuZGxlZCBpbiB0aGUgYGNoZWNrYm94X21hcHBpbmcuanNgIGZpbGUuXG4gKiBJdCBpcyBuZWVkZWQgdG8gYWRkIHRoZSBjYXJldCBzeW1ib2wgbmV4dCB0byB0aGUgY2hlY2tib3ggYW5kIHRvIG9wZW4gdGhlIG11bHRpIHNlbGVjdCBkcm9wZG93biBtZW51IG5leHQgdG8gaXQuXG4gKlxuICogIyMjIEV4YW1wbGVzXG4gKlxuICogSW4gdGhlIGZvbGxvd2luZyBleGFtcGxlIHRoZSBjaGVja2JveCBlbGVtZW50IHdpbGwgYmUgY29udmVydGVkIGludG8gYSBzaW5nbGUtY2hlY2tib3ggaW5zdGFuY2UuXG4gKlxuICogYGBgaHRtbFxuICogPGRpdiBjbGFzcz1cIndyYXBwZXJcIiBkYXRhLWd4LXdpZGdldD1cInNpbmdsZV9jaGVja2JveFwiPlxuICogICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgLz5cbiAqIDwvZGl2PlxuICogYGBgXG4gKi9cbmd4LndpZGdldHMubW9kdWxlKCdzaW5nbGVfY2hlY2tib3gnLCBbXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFZBUklBQkxFU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgc2VsZWN0b3I6ICdpbnB1dDpjaGVja2JveCdcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmluYWwgT3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBcImNoZWNrZWRcIiBwcm9wZXJ0eSBvZiB0aGUgc2luZ2xlIGNoZWNrYm94IGluc3RhbmNlcy5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgdXBkYXRlIHRoZSB2YWx1ZSBhbmQgZGlzcGxheSBvZiB0aGUgd2lkZ2V0cyB3aXRob3V0IHRyaWdnZXJpbmcgYSBcImNoYW5nZVwiIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBpc0NoZWNrZWQgVGhlIGNoZWNrYm94IHZhbHVlcyB3aWxsIGJlIHVwZGF0ZWQgYWxvbmcgd2l0aCB0aGVpciByZXByZXNlbnRhdGlvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0gUmV0dXJucyB0aGUgalF1ZXJ5IHNlbGVjdG9yIGZvciBjaGFpbmVkIGNhbGxzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9jaGVja2VkKGlzQ2hlY2tlZCkge1xuICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCBpc0NoZWNrZWQpO1xuICAgICAgICBfb25DaGVja2JveENoYW5nZS5jYWxsKHRoaXMpO1xuICAgICAgICByZXR1cm4gJCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgUHVibGljIE1vZHVsZSBNZXRob2RzXG4gICAgICpcbiAgICAgKiBFeGFtcGxlOiAkKCdpbnB1dDpjaGVja2JveCcpLnNpbmdsZV9jaGVja2JveCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYWRkUHVibGljTWV0aG9kKCkge1xuICAgICAgICBpZiAoJC5mbi5zaW5nbGVfY2hlY2tib3gpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gTWV0aG9kIGlzIGFscmVhZHkgcmVnaXN0ZXJlZC5cbiAgICAgICAgfVxuXG4gICAgICAgICQuZm4uZXh0ZW5kKHtcbiAgICAgICAgICAgIHNpbmdsZV9jaGVja2JveDogZnVuY3Rpb24gKGFjdGlvbiwgLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NoZWNrZWQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jaGVja2VkLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV3JhcCB0aGUgY2hlY2tib3ggZWxlbWVudHMgd2l0aCBhbiBleHRlcm5hbCA8c3Bhbj4gd2hpY2ggd2lsbCBiZSBzdHlsZWQgd2l0aCBDU1MuXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGFsc28gYmluZCB0aGUgZXZlbnQgaGFuZGxlcnMgb2YgZWFjaCBjaGVja2JveCBlbGVtZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF93cmFwQ2hlY2tib3hFbGVtZW50cygpIHtcbiAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLnNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrZWQgPSAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSA/ICdjaGVja2VkJyA6ICcnO1xuICAgICAgICAgICAgY29uc3QgZGlzYWJsZWQgPSAkKHRoaXMpLnByb3AoJ2Rpc2FibGVkJykgPyAnZGlzYWJsZWQnIDogJyc7XG4gICAgICAgICAgICBsZXQgdGl0bGUgPSAkKHRoaXMpLmF0dHIoJ3RpdGxlJyk7XG5cbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICctMTAwMDAwcHgnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAud3JhcChgPHNwYW4gY2xhc3M9XCJzaW5nbGUtY2hlY2tib3ggJHtjaGVja2VkfSAke2Rpc2FibGVkfVwiICR7dGl0bGUgPyB0aXRsZSA9IGBcIiR7dGl0bGV9XCJgIDogJyd9Pjwvc3Bhbj5gKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxpIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L2k+Jyk7XG5cbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzJywgX29uQ2hlY2tib3hGb2N1cylcbiAgICAgICAgICAgICAgICAub24oJ2JsdXInLCBfb25DaGVja2JveEJsdXIpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBfb25DaGVja2JveENoYW5nZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIENoZWNrYm94IENoYW5nZVxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBoYW5kbGVyIHdpbGwgbWFrZSBzdXJlIHRoYXQgdGhlIHBhcmVudCBoYXMgdGhlIGNvcnJlY3QgY2xhc3NlcyBkZXBlbmRpbmcgdGhlIGNoZWNrYm94IHN0YXRlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkNoZWNrYm94Q2hhbmdlKCkge1xuICAgICAgICBjb25zdCAkd3JhcHBlciA9ICQodGhpcykucGFyZW50KCk7XG4gICAgICAgIGNvbnN0IGlzQ2hlY2tlZCA9ICQodGhpcykucHJvcCgnY2hlY2tlZCcpO1xuXG4gICAgICAgIGlmIChpc0NoZWNrZWQgJiYgISR3cmFwcGVyLmhhc0NsYXNzKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICR3cmFwcGVyLmFkZENsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQ2hlY2tlZCAmJiAkd3JhcHBlci5oYXNDbGFzcygnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkd3JhcHBlci5yZW1vdmVDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gQ2hlY2tib3ggRm9jdXNcbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgaGFuZGxlciB3aWxsIGFkZCB0aGUgXCJmb2N1c2VkXCIgY2xhc3Mgd2hpY2ggaXMgdXNlZCBmb3Igc3R5bGluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25DaGVja2JveEZvY3VzKCkge1xuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdmb2N1c2VkJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT24gQ2hlY2tib3ggQmx1clxuICAgICAqXG4gICAgICogVGhpcyBldmVudCBoYW5kbGVyIHdpbGwgcmVtb3ZlIHRoZSBcImZvY3VzZWRcIiBjbGFzcyB3aGljaCBpcyB1c2VkIGZvciBzdHlsaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbkNoZWNrYm94Qmx1cigpIHtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZm9jdXNlZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIFdyYXBwZXIgQ2xpY2tcbiAgICAgKlxuICAgICAqIFRoaXMgZXZlbnQgaGFuZGxlciB3aWxsIGRlbGVnYXRlIHRoZSBjbGljayB0byB0aGUgY2hlY2tib3ggYW5kIG11c3Qgbm90IGNoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIHdpZGdldC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCB7b2JqZWN0fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbldyYXBwZXJDbGljayhldmVudCkge1xuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSB8fCAkdGhpcy5maW5kKCcuZGF0YVRhYmxlc19lbXB0eScpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgJGNoZWNrYm94ID0gJCh0aGlzKS5jaGlsZHJlbignaW5wdXQ6Y2hlY2tib3gnKTtcblxuICAgICAgICAkY2hlY2tib3hcbiAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgISRjaGVja2JveC5wcm9wKCdjaGVja2VkJykpXG4gICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgX2FkZFB1YmxpY01ldGhvZCgpO1xuICAgICAgICBfd3JhcENoZWNrYm94RWxlbWVudHMoKTtcblxuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9mZignY2xpY2snLCAnLnNpbmdsZS1jaGVja2JveCcpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5zaW5nbGUtY2hlY2tib3gnLCBfb25XcmFwcGVyQ2xpY2spO1xuXG4gICAgICAgICR0aGlzLnRyaWdnZXIoJ3NpbmdsZV9jaGVja2JveDpyZWFkeScpOyAvLyBOZWVkZWQgZm9yIHRoZSBjaGVja2JveF9tYXBwaW5nLmpzIGZpbGUuXG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7IFxuIl19
