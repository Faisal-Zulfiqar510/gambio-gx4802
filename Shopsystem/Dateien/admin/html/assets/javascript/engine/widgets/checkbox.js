'use strict';

/* --------------------------------------------------------------
 checkbox.js 2016-06-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Checkbox Widget
 *
 * This extension can serve multiple types of checkboxes (simple switchers, text switchers and gambio-styled
 * checkboxes, radio-button switcher). Apply the widget in a parent container and it will search and convert
 * all the instances into fine checkboxes
 *
 * ### Options
 *
 * **Filter | `data-checkbox-filter` | String | Optional**
 *
 * Provide a jQuery selector string for filtering the children elements of the parent container.
 *
 * **Checked State URL | `data-checkbox-on_url` | String | Optional**
 *
 * If provided the user will be navigated to the given URL once he clicks a checked instance of the widget.
 *
 * **Unchecked State URL | `dat-acheckbox-off_url` | String | Optional**
 *
 * If provided the user will be navigated ot the given URL once he clicks an unchecked instance of the widget.
 *
 * **Checked State Text | `data-checkbox-on_text` | String | Optional**
 *
 * If provided it will be displayed instead of the normal check icon.
 *
 * **Unchecked State Text | `data-checkbox-off_text` | String | Optional**
 *
 * If provided it will be displayed instead of the normal X icon.
 *
 * **Custom Checkbox Class | `data-checkbox-class` | String | Optional**
 *
 * Provide additional custom classes to the checkbox element.
 *
 * **Check Status | `data-checkbox-check` | Boolean | Optional**
 *
 * Defines whether the checkbox is checked or not. Use this option to override the original checkbox state.
 *
 * ### Examples
 *
 * **Single Checkbox Example**
 *
 * A single checkbox is just a better styled checkbox that can be used for seamless integration into the
 * Gambio Admin pages.
 *
 * ```html
 * <label for="my-checkbox">Single Checkbox (checked)</label>
 * <input type="checkbox" id="my-checkbox" title="Single Checkbox" data-single_checkbox checked />
 * ```
 *
 * **Switcher Checkbox**
 *
 * Displays a nice mobile-like switcher that is bound on the original checkbox. That means that any change done
 * on the switcher will affect the original checkbox element.
 *
 * ```html
 * <label for="my-checkbox">Receive Notifications</label>
 * <input type="checkbox" id="my-checkbox" title="Receive Notifications" />
 * ```
 *
 * **Radio Checkbox**
 *
 * The checkbox widget can also serve cases with two radio buttons that define a yes or no use case. Consider
 * the following example where the first radio element contains the "activate" and the second "deactivate" status.
 *
 * ```html
 * <input type="radio" name="status" value="1" title="Activated" checked />
 * <input type="radio" name="status" value="0" title="Deactivated" />
 * ```
 *
 * **URL Switcher**
 *
 * If you need to change the status of something by navigating the user to a specific url use the "on_url"
 * and "off_url" options which will forward the user to the required URL.
 *
 * ```html
 * <div data-gx-widget="checkbox"
 *   data-checkbox-checked="true"
 *   data-checkbox-on_url="#installed"
 *   data-checkbox-off_url="#uninstalled"
 *   data-checkbox-on_label="Installed"
 *   data-checkbox-off_label="Uninstalled"
 *   data-checkbox-class="labeled"></div>
 * ```
 *
 * **Notice:** This widget was highly modified for use in compatibility pages. It's complexity and performance
 * are not optimal anymore. Use the single_checkbox and switcher widgets instead.
 *
 * @module Admin/Widgets/checkbox
 */
gx.widgets.module('checkbox', ['fallback'], function (data) {

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
     * Default Options for Widget
     *
     * @type {object}
     */
    defaults = {
        'filter': '', // Only select checkboxes with the following selector

        // Url Switcher Options:
        'on_url': '', // Open url when switcher is turned on
        'off_url': '', // Open url when switcher is turned off
        'on_label': '', // Text shown on the switcher when turned on
        'off_label': '', // Text shown on the switcher when turned off
        'on_text': '', // Text shown next to the switcher when turned on
        'off_text': '', // Text shown next to the switcher when turned off
        'class': '', // Add class(es) to the on and off switcher
        'checked': false // Initial status of the switcher: true = on, false = off
    },


    /**
     * Status of mouse down event
     *
     * @type {boolean}
     */
    mouseDown = false,


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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Change the styling of the new switcher depending on the original checkbox/radio box setting
     * Additionally set the new state of the original checkbox/radio box and trigger the change event on it.
     *
     * @private
     */
    var _switcherChangeHandler = function _switcherChangeHandler(event) {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        var $self = $(this),
            $checkbox = $self.find('input:checkbox'),
            $onElement = $self.find('input:radio').first(),
            $offElement = $self.find('input:radio').last(),
            $select = $self.find('select').first(),
            dataset = $self.parent().data('checkbox');

        $self.toggleClass('checked');

        $self.find('.state-description').show().fadeOut('slow');

        $checkbox.prop('checked', $self.hasClass('checked')).trigger('checkbox:change');

        $onElement.prop('checked', $self.hasClass('checked'));

        $offElement.prop('checked', !$self.hasClass('checked'));

        $select.find('option').removeAttr('selected');

        var selectOptionToSelect = $self.hasClass('checked') ? 1 : 0;

        $select.find('option[value="' + selectOptionToSelect + '"]').attr('selected', true);

        if (options.on_url !== '' && options.off_url !== '') {
            event.preventDefault();
            event.stopPropagation();

            if (options.checked) {
                window.location.href = options.off_url;
                options.checked = false;

                return false;
            }

            window.location.href = options.on_url;
            options.checked = true;
        }
    };

    /**
     * Change the styling of the new checkbox depending on the original checkbox setting
     * Additionally set the new state of the original checkbox and trigger the change event on it.
     *
     * @private
     */
    var _checkboxChangeHandler = function _checkboxChangeHandler() {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        mouseDown = true;
        $(this).find('input:checkbox').focus();
    };

    /**
     * Imitate mouse up behaviour of the checkbox
     *
     * @private
     */
    var _checkboxMouseUpHandler = function _checkboxMouseUpHandler() {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        $(this).toggleClass('checked');
        $(this).find('input:checkbox').focus();
        $(this).find('input:checkbox').trigger('click');
        mouseDown = false;
    };

    // ------------------------------------------------------------------------
    // INITIALISATION FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Wrap the checkboxes and generate markup for the new checkbox style.
     *
     * @private
     */
    var _initCheckboxes = function _initCheckboxes($target) {

        var $container = $target || $this;

        $container.find('input:checkbox').filter(options.filter || '*').each(function () {
            var $self = $(this),
                dataset = jse.libs.fallback._data($self, 'checkbox'),
                className = dataset.className || '',
                title = $self.prop('title'),
                isChecked = $self.prop('checked') ? 'checked' : '',
                isDisabled = $self.prop('disabled') ? 'disabled' : '';

            if (typeof $self.data('single_checkbox') !== 'undefined') {
                $self.css({
                    'position': 'absolute',
                    'left': '-100000px'
                }).wrap('<span class="single-checkbox ' + isChecked + ' ' + isDisabled + '" title="' + title + '"></span>').parent().append('<i class="fa fa-check"></i>');

                $self.on('focus', function () {
                    $('.single_checkbox').removeClass('focused');
                    $(this).parent().addClass('focused');
                });

                $self.on('blur', function () {
                    $(this).parent().removeClass('focused');
                });

                $self.on('change', function () {
                    if (mouseDown === false) {
                        $(this).parent().toggleClass('checked');
                    }
                });
            } else {
                var onText = $self.attr('data-checkbox-on_text') ? $self.attr('data-checkbox-on_text') : '<span class="fa fa-check"></span>';

                var offText = $self.attr('data-checkbox-on_text') ? $self.attr('data-checkbox-off_text') : '<span class="fa fa-times"></span>';

                $self.wrap('<div class="switcher ' + isChecked + ' ' + isDisabled + '" title="' + title + '"></div>').parent().data('checkbox', dataset).addClass(className).append('<div class="switcher-toggler"></div>' + '<div class="switcher-inner">' + '<div class="switcher-state-on">' + onText + '</div>' + '<div class="switcher-state-off">' + offText + '</div>' + '</div>' + '<div class="switcher-text-on">' + options.on_text + '</div>' + '<div class="switcher-text-off">' + options.off_text + '</div>');
            }
        });
    };

    /**
     * Wrap the radio boxes and generate markup for the new checkbox style.
     *
     * @private
     */
    var _initRadioOptions = function _initRadioOptions() {
        if ($this.find('input:radio').filter(options.filter || '*').length === 2) {
            var $onElement = $this.find('input:radio').filter(options.filter || '*').first(),
                onTitle = $onElement.prop('title'),
                $offElement = $this.find('input:radio').filter(options.filter || '*').last(),
                offTitle = $offElement.prop('title'),
                onLabel = options.on_label !== '' ? ' data-checkbox-label="' + options.on_label + '"' : '',
                offLabel = options.off_label !== '' ? ' data-checkbox-label="' + options.off_label + '"' : '',
                dataset = options,
                isChecked = $onElement.prop('checked') ? 'checked' : '',
                isDisabled = $onElement.prop('disabled') ? 'disabled' : '';

            var $switcher = $('<div class="switcher ' + isChecked + ' ' + isDisabled + '"></div>');

            $onElement.after($switcher);

            $onElement.appendTo($switcher);
            $offElement.appendTo($switcher);

            $switcher.data('checkbox', dataset).addClass(options.class).append('<div class="switcher-toggler"></div>' + '<div class="switcher-inner">' + '<div class="switcher-state-on" title="' + onTitle + '"' + onLabel + '><span class="fa fa-check"></span></div>' + '<div class="switcher-state-off" title="' + offTitle + '"' + offLabel + '><span class="fa fa-times"></span></div>' + '<div class="switcher-text-on">' + options.on_text + '</div>' + '<div class="switcher-text-off">' + options.off_text + '</div>' + '</div>');

            // toggle switcher if hidden radio option status changes (there is no default case for that)
            $onElement.on('change', function () {
                $(this).parent().toggleClass('checked');
            });

            // toggle switcher if hidden radio option status changes (there is no default case for that)
            $offElement.on('change', function () {
                $(this).parent().toggleClass('checked');
            });
        }
    };

    /**
     * build markup for the url switcher
     *
     * @private
     */
    var _initUrlSwitcher = function _initUrlSwitcher() {
        if (options.on_url !== '' && options.off_url !== '') {
            var dataset = jse.libs.fallback._data($this, 'checkbox'),
                onLabel = options.on_label !== '' ? ' data-checkbox-label="' + options.on_label + '"' : '',
                offLabel = options.off_label !== '' ? ' data-checkbox-label="' + options.off_label + '"' : '',
                isChecked = options.checked ? 'checked' : '';

            $this.data('checkbox', dataset).addClass('switcher').addClass(isChecked).addClass(options.class).append('<div class="switcher-toggler"></div>' + '<div class="switcher-inner">' + '<div class="switcher-state-on" title="' + options.off_url + '"' + onLabel + '><span class="fa fa-check"></span></div>' + '<div class="switcher-state-off" title="' + options.on_url + '"' + offLabel + '><span class="fa fa-times"></span></div>' + '</div>').on('click', _switcherChangeHandler);
        }
    };

    /**
     * Bind events that change the checkbox or switcher
     *
     * @private
     */
    var _initEventHandlers = function _initEventHandlers() {
        $this.on('click', '.switcher', _switcherChangeHandler);

        $this.off('mousedown', '.single-checkbox');
        $this.on('mousedown', '.single-checkbox', _checkboxChangeHandler);
        $this.off('mouseup', '.single-checkbox');
        $this.on('mouseup', '.single-checkbox', _checkboxMouseUpHandler);

        $this.on('mousedown', 'label', function () {
            mouseDown = true;
        });

        $this.on('mouseup', 'label', function () {
            mouseDown = false;
        });

        $this.on('FORM_UPDATE', function (e) {
            var $target = $(e.target);
            $target.find('input:checkbox').each(function () {
                var $self = $(this),
                    $wrapper = $self.closest('.switcher');

                if ($wrapper.length) {
                    $wrapper.find('div').remove();
                    $self.unwrap();
                }
            });

            _initCheckboxes($target);
        });
    };

    var _initSelects = function _initSelects() {
        // Iterate over select fields
        $this.find('[data-convert-checkbox]').each(function (index, element) {
            // Shortcuts
            var $optionTrue = $(element).find('option[value="1"]'),
                $optionFalse = $(element).find('option[value="0"]');

            // States
            var isChecked = $optionTrue.is(':selected') ? 'checked' : '',
                isDisabled = $(element).is(':disabled') ? 'disabled' : '';

            // Switcher Template
            var $switcher = $('<div class="switcher ' + isChecked + ' ' + isDisabled + '"></div>');
            $switcher.addClass($(element).data('newClass')).data('checkbox', options).append('<div class="switcher-toggler"></div>' + '<div class="switcher-inner">' + '<div class="switcher-state-on"><span class="fa fa-check"></span></div>' + '<div class="switcher-state-off"><span class="fa fa-times"></span></div>' + '</div>');

            $(element).after($switcher).appendTo($switcher).hide();
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {

        // sanitize url preventing cross site scripting
        options.on_url = options.on_url.replace('"', '');
        options.off_url = options.off_url.replace('"', '');

        _initCheckboxes();
        _initRadioOptions();
        _initSelects();
        _initUrlSwitcher();
        _initEventHandlers();

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoZWNrYm94LmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm1vdXNlRG93biIsIm9wdGlvbnMiLCJleHRlbmQiLCJfc3dpdGNoZXJDaGFuZ2VIYW5kbGVyIiwiZXZlbnQiLCJoYXNDbGFzcyIsIiRzZWxmIiwiJGNoZWNrYm94IiwiZmluZCIsIiRvbkVsZW1lbnQiLCJmaXJzdCIsIiRvZmZFbGVtZW50IiwibGFzdCIsIiRzZWxlY3QiLCJkYXRhc2V0IiwicGFyZW50IiwidG9nZ2xlQ2xhc3MiLCJzaG93IiwiZmFkZU91dCIsInByb3AiLCJ0cmlnZ2VyIiwicmVtb3ZlQXR0ciIsInNlbGVjdE9wdGlvblRvU2VsZWN0IiwiYXR0ciIsIm9uX3VybCIsIm9mZl91cmwiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImNoZWNrZWQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJfY2hlY2tib3hDaGFuZ2VIYW5kbGVyIiwiZm9jdXMiLCJfY2hlY2tib3hNb3VzZVVwSGFuZGxlciIsIl9pbml0Q2hlY2tib3hlcyIsIiR0YXJnZXQiLCIkY29udGFpbmVyIiwiZmlsdGVyIiwiZWFjaCIsImpzZSIsImxpYnMiLCJmYWxsYmFjayIsIl9kYXRhIiwiY2xhc3NOYW1lIiwidGl0bGUiLCJpc0NoZWNrZWQiLCJpc0Rpc2FibGVkIiwiY3NzIiwid3JhcCIsImFwcGVuZCIsIm9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIm9uVGV4dCIsIm9mZlRleHQiLCJvbl90ZXh0Iiwib2ZmX3RleHQiLCJfaW5pdFJhZGlvT3B0aW9ucyIsImxlbmd0aCIsIm9uVGl0bGUiLCJvZmZUaXRsZSIsIm9uTGFiZWwiLCJvbl9sYWJlbCIsIm9mZkxhYmVsIiwib2ZmX2xhYmVsIiwiJHN3aXRjaGVyIiwiYWZ0ZXIiLCJhcHBlbmRUbyIsImNsYXNzIiwiX2luaXRVcmxTd2l0Y2hlciIsIl9pbml0RXZlbnRIYW5kbGVycyIsIm9mZiIsImUiLCJ0YXJnZXQiLCIkd3JhcHBlciIsImNsb3Nlc3QiLCJyZW1vdmUiLCJ1bndyYXAiLCJfaW5pdFNlbGVjdHMiLCJpbmRleCIsImVsZW1lbnQiLCIkb3B0aW9uVHJ1ZSIsIiRvcHRpb25GYWxzZSIsImlzIiwiaGlkZSIsImluaXQiLCJkb25lIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlGQUEsR0FBR0MsT0FBSCxDQUFXQyxNQUFYLENBQ0ksVUFESixFQUdJLENBQUMsVUFBRCxDQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1Asa0JBQVUsRUFESCxFQUNPOztBQUVkO0FBQ0Esa0JBQVUsRUFKSCxFQUlPO0FBQ2QsbUJBQVcsRUFMSixFQUtRO0FBQ2Ysb0JBQVksRUFOTCxFQU1TO0FBQ2hCLHFCQUFhLEVBUE4sRUFPVTtBQUNqQixtQkFBVyxFQVJKLEVBUVE7QUFDZixvQkFBWSxFQVRMLEVBU1M7QUFDaEIsaUJBQVMsRUFWRixFQVVNO0FBQ2IsbUJBQVcsS0FYSixDQVdVO0FBWFYsS0FiZjs7O0FBMkJJOzs7OztBQUtBQyxnQkFBWSxLQWhDaEI7OztBQWtDSTs7Ozs7QUFLQUMsY0FBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSCxRQUFuQixFQUE2QkgsSUFBN0IsQ0F2Q2Q7OztBQXlDSTs7Ozs7QUFLQUQsYUFBUyxFQTlDYjs7QUFnREE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQSxRQUFJUSx5QkFBeUIsU0FBekJBLHNCQUF5QixDQUFVQyxLQUFWLEVBQWlCO0FBQzFDLFlB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QixVQUE3QixHQUEwQyxFQUQzRDs7QUFHQTtBQUNBLGdCQUFJbEIsWUFBWXBFLEVBQUUsMEJBQTBCZ0QsU0FBMUIsR0FBc0MsR0FBdEMsR0FBNENDLFVBQTVDLEdBQXlELFVBQTNELENBQWhCO0FBQ0FtQixzQkFDS2IsUUFETCxDQUNjdkQsRUFBRW1GLE9BQUYsRUFBV3JGLElBQVgsQ0FBZ0IsVUFBaEIsQ0FEZCxFQUVLQSxJQUZMLENBRVUsVUFGVixFQUVzQkssT0FGdEIsRUFHS2lELE1BSEwsQ0FHWSx5Q0FBeUMsOEJBQXpDLEdBQ0osd0VBREksR0FFSix5RUFGSSxHQUV3RSxRQUxwRjs7QUFRQXBELGNBQUVtRixPQUFGLEVBQ0tkLEtBREwsQ0FDV0QsU0FEWCxFQUVLRSxRQUZMLENBRWNGLFNBRmQsRUFHS21CLElBSEw7QUFJSCxTQXZCRDtBQXdCSCxLQTFCRDs7QUE0QkE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTFGLFdBQU8yRixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjs7QUFFMUI7QUFDQXRGLGdCQUFRdUIsTUFBUixHQUFpQnZCLFFBQVF1QixNQUFSLENBQWVnRSxPQUFmLENBQXVCLEdBQXZCLEVBQTRCLEVBQTVCLENBQWpCO0FBQ0F2RixnQkFBUXdCLE9BQVIsR0FBa0J4QixRQUFRd0IsT0FBUixDQUFnQitELE9BQWhCLENBQXdCLEdBQXhCLEVBQTZCLEVBQTdCLENBQWxCOztBQUVBckQ7QUFDQXVCO0FBQ0FxQjtBQUNBVDtBQUNBQzs7QUFFQWdCO0FBQ0gsS0FiRDs7QUFlQTtBQUNBLFdBQU81RixNQUFQO0FBQ0gsQ0FqWkwiLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNoZWNrYm94LmpzIDIwMTYtMDYtMDFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIENoZWNrYm94IFdpZGdldFxuICpcbiAqIFRoaXMgZXh0ZW5zaW9uIGNhbiBzZXJ2ZSBtdWx0aXBsZSB0eXBlcyBvZiBjaGVja2JveGVzIChzaW1wbGUgc3dpdGNoZXJzLCB0ZXh0IHN3aXRjaGVycyBhbmQgZ2FtYmlvLXN0eWxlZFxuICogY2hlY2tib3hlcywgcmFkaW8tYnV0dG9uIHN3aXRjaGVyKS4gQXBwbHkgdGhlIHdpZGdldCBpbiBhIHBhcmVudCBjb250YWluZXIgYW5kIGl0IHdpbGwgc2VhcmNoIGFuZCBjb252ZXJ0XG4gKiBhbGwgdGhlIGluc3RhbmNlcyBpbnRvIGZpbmUgY2hlY2tib3hlc1xuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipGaWx0ZXIgfCBgZGF0YS1jaGVja2JveC1maWx0ZXJgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFByb3ZpZGUgYSBqUXVlcnkgc2VsZWN0b3Igc3RyaW5nIGZvciBmaWx0ZXJpbmcgdGhlIGNoaWxkcmVuIGVsZW1lbnRzIG9mIHRoZSBwYXJlbnQgY29udGFpbmVyLlxuICpcbiAqICoqQ2hlY2tlZCBTdGF0ZSBVUkwgfCBgZGF0YS1jaGVja2JveC1vbl91cmxgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIElmIHByb3ZpZGVkIHRoZSB1c2VyIHdpbGwgYmUgbmF2aWdhdGVkIHRvIHRoZSBnaXZlbiBVUkwgb25jZSBoZSBjbGlja3MgYSBjaGVja2VkIGluc3RhbmNlIG9mIHRoZSB3aWRnZXQuXG4gKlxuICogKipVbmNoZWNrZWQgU3RhdGUgVVJMIHwgYGRhdC1hY2hlY2tib3gtb2ZmX3VybGAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogSWYgcHJvdmlkZWQgdGhlIHVzZXIgd2lsbCBiZSBuYXZpZ2F0ZWQgb3QgdGhlIGdpdmVuIFVSTCBvbmNlIGhlIGNsaWNrcyBhbiB1bmNoZWNrZWQgaW5zdGFuY2Ugb2YgdGhlIHdpZGdldC5cbiAqXG4gKiAqKkNoZWNrZWQgU3RhdGUgVGV4dCB8IGBkYXRhLWNoZWNrYm94LW9uX3RleHRgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIElmIHByb3ZpZGVkIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluc3RlYWQgb2YgdGhlIG5vcm1hbCBjaGVjayBpY29uLlxuICpcbiAqICoqVW5jaGVja2VkIFN0YXRlIFRleHQgfCBgZGF0YS1jaGVja2JveC1vZmZfdGV4dGAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogSWYgcHJvdmlkZWQgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW5zdGVhZCBvZiB0aGUgbm9ybWFsIFggaWNvbi5cbiAqXG4gKiAqKkN1c3RvbSBDaGVja2JveCBDbGFzcyB8IGBkYXRhLWNoZWNrYm94LWNsYXNzYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGFkZGl0aW9uYWwgY3VzdG9tIGNsYXNzZXMgdG8gdGhlIGNoZWNrYm94IGVsZW1lbnQuXG4gKlxuICogKipDaGVjayBTdGF0dXMgfCBgZGF0YS1jaGVja2JveC1jaGVja2AgfCBCb29sZWFuIHwgT3B0aW9uYWwqKlxuICpcbiAqIERlZmluZXMgd2hldGhlciB0aGUgY2hlY2tib3ggaXMgY2hlY2tlZCBvciBub3QuIFVzZSB0aGlzIG9wdGlvbiB0byBvdmVycmlkZSB0aGUgb3JpZ2luYWwgY2hlY2tib3ggc3RhdGUuXG4gKlxuICogIyMjIEV4YW1wbGVzXG4gKlxuICogKipTaW5nbGUgQ2hlY2tib3ggRXhhbXBsZSoqXG4gKlxuICogQSBzaW5nbGUgY2hlY2tib3ggaXMganVzdCBhIGJldHRlciBzdHlsZWQgY2hlY2tib3ggdGhhdCBjYW4gYmUgdXNlZCBmb3Igc2VhbWxlc3MgaW50ZWdyYXRpb24gaW50byB0aGVcbiAqIEdhbWJpbyBBZG1pbiBwYWdlcy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8bGFiZWwgZm9yPVwibXktY2hlY2tib3hcIj5TaW5nbGUgQ2hlY2tib3ggKGNoZWNrZWQpPC9sYWJlbD5cbiAqIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIm15LWNoZWNrYm94XCIgdGl0bGU9XCJTaW5nbGUgQ2hlY2tib3hcIiBkYXRhLXNpbmdsZV9jaGVja2JveCBjaGVja2VkIC8+XG4gKiBgYGBcbiAqXG4gKiAqKlN3aXRjaGVyIENoZWNrYm94KipcbiAqXG4gKiBEaXNwbGF5cyBhIG5pY2UgbW9iaWxlLWxpa2Ugc3dpdGNoZXIgdGhhdCBpcyBib3VuZCBvbiB0aGUgb3JpZ2luYWwgY2hlY2tib3guIFRoYXQgbWVhbnMgdGhhdCBhbnkgY2hhbmdlIGRvbmVcbiAqIG9uIHRoZSBzd2l0Y2hlciB3aWxsIGFmZmVjdCB0aGUgb3JpZ2luYWwgY2hlY2tib3ggZWxlbWVudC5cbiAqXG4gKiBgYGBodG1sXG4gKiA8bGFiZWwgZm9yPVwibXktY2hlY2tib3hcIj5SZWNlaXZlIE5vdGlmaWNhdGlvbnM8L2xhYmVsPlxuICogPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwibXktY2hlY2tib3hcIiB0aXRsZT1cIlJlY2VpdmUgTm90aWZpY2F0aW9uc1wiIC8+XG4gKiBgYGBcbiAqXG4gKiAqKlJhZGlvIENoZWNrYm94KipcbiAqXG4gKiBUaGUgY2hlY2tib3ggd2lkZ2V0IGNhbiBhbHNvIHNlcnZlIGNhc2VzIHdpdGggdHdvIHJhZGlvIGJ1dHRvbnMgdGhhdCBkZWZpbmUgYSB5ZXMgb3Igbm8gdXNlIGNhc2UuIENvbnNpZGVyXG4gKiB0aGUgZm9sbG93aW5nIGV4YW1wbGUgd2hlcmUgdGhlIGZpcnN0IHJhZGlvIGVsZW1lbnQgY29udGFpbnMgdGhlIFwiYWN0aXZhdGVcIiBhbmQgdGhlIHNlY29uZCBcImRlYWN0aXZhdGVcIiBzdGF0dXMuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzdGF0dXNcIiB2YWx1ZT1cIjFcIiB0aXRsZT1cIkFjdGl2YXRlZFwiIGNoZWNrZWQgLz5cbiAqIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic3RhdHVzXCIgdmFsdWU9XCIwXCIgdGl0bGU9XCJEZWFjdGl2YXRlZFwiIC8+XG4gKiBgYGBcbiAqXG4gKiAqKlVSTCBTd2l0Y2hlcioqXG4gKlxuICogSWYgeW91IG5lZWQgdG8gY2hhbmdlIHRoZSBzdGF0dXMgb2Ygc29tZXRoaW5nIGJ5IG5hdmlnYXRpbmcgdGhlIHVzZXIgdG8gYSBzcGVjaWZpYyB1cmwgdXNlIHRoZSBcIm9uX3VybFwiXG4gKiBhbmQgXCJvZmZfdXJsXCIgb3B0aW9ucyB3aGljaCB3aWxsIGZvcndhcmQgdGhlIHVzZXIgdG8gdGhlIHJlcXVpcmVkIFVSTC5cbiAqXG4gKiBgYGBodG1sXG4gKiA8ZGl2IGRhdGEtZ3gtd2lkZ2V0PVwiY2hlY2tib3hcIlxuICogICBkYXRhLWNoZWNrYm94LWNoZWNrZWQ9XCJ0cnVlXCJcbiAqICAgZGF0YS1jaGVja2JveC1vbl91cmw9XCIjaW5zdGFsbGVkXCJcbiAqICAgZGF0YS1jaGVja2JveC1vZmZfdXJsPVwiI3VuaW5zdGFsbGVkXCJcbiAqICAgZGF0YS1jaGVja2JveC1vbl9sYWJlbD1cIkluc3RhbGxlZFwiXG4gKiAgIGRhdGEtY2hlY2tib3gtb2ZmX2xhYmVsPVwiVW5pbnN0YWxsZWRcIlxuICogICBkYXRhLWNoZWNrYm94LWNsYXNzPVwibGFiZWxlZFwiPjwvZGl2PlxuICogYGBgXG4gKlxuICogKipOb3RpY2U6KiogVGhpcyB3aWRnZXQgd2FzIGhpZ2hseSBtb2RpZmllZCBmb3IgdXNlIGluIGNvbXBhdGliaWxpdHkgcGFnZXMuIEl0J3MgY29tcGxleGl0eSBhbmQgcGVyZm9ybWFuY2VcbiAqIGFyZSBub3Qgb3B0aW1hbCBhbnltb3JlLiBVc2UgdGhlIHNpbmdsZV9jaGVja2JveCBhbmQgc3dpdGNoZXIgd2lkZ2V0cyBpbnN0ZWFkLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9jaGVja2JveFxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnY2hlY2tib3gnLFxuXG4gICAgWydmYWxsYmFjayddLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFdpZGdldCBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBXaWRnZXRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAnZmlsdGVyJzogJycsIC8vIE9ubHkgc2VsZWN0IGNoZWNrYm94ZXMgd2l0aCB0aGUgZm9sbG93aW5nIHNlbGVjdG9yXG5cbiAgICAgICAgICAgICAgICAvLyBVcmwgU3dpdGNoZXIgT3B0aW9uczpcbiAgICAgICAgICAgICAgICAnb25fdXJsJzogJycsIC8vIE9wZW4gdXJsIHdoZW4gc3dpdGNoZXIgaXMgdHVybmVkIG9uXG4gICAgICAgICAgICAgICAgJ29mZl91cmwnOiAnJywgLy8gT3BlbiB1cmwgd2hlbiBzd2l0Y2hlciBpcyB0dXJuZWQgb2ZmXG4gICAgICAgICAgICAgICAgJ29uX2xhYmVsJzogJycsIC8vIFRleHQgc2hvd24gb24gdGhlIHN3aXRjaGVyIHdoZW4gdHVybmVkIG9uXG4gICAgICAgICAgICAgICAgJ29mZl9sYWJlbCc6ICcnLCAvLyBUZXh0IHNob3duIG9uIHRoZSBzd2l0Y2hlciB3aGVuIHR1cm5lZCBvZmZcbiAgICAgICAgICAgICAgICAnb25fdGV4dCc6ICcnLCAvLyBUZXh0IHNob3duIG5leHQgdG8gdGhlIHN3aXRjaGVyIHdoZW4gdHVybmVkIG9uXG4gICAgICAgICAgICAgICAgJ29mZl90ZXh0JzogJycsIC8vIFRleHQgc2hvd24gbmV4dCB0byB0aGUgc3dpdGNoZXIgd2hlbiB0dXJuZWQgb2ZmXG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJycsIC8vIEFkZCBjbGFzcyhlcykgdG8gdGhlIG9uIGFuZCBvZmYgc3dpdGNoZXJcbiAgICAgICAgICAgICAgICAnY2hlY2tlZCc6IGZhbHNlIC8vIEluaXRpYWwgc3RhdHVzIG9mIHRoZSBzd2l0Y2hlcjogdHJ1ZSA9IG9uLCBmYWxzZSA9IG9mZlxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTdGF0dXMgb2YgbW91c2UgZG93biBldmVudFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb3VzZURvd24gPSBmYWxzZSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYW5nZSB0aGUgc3R5bGluZyBvZiB0aGUgbmV3IHN3aXRjaGVyIGRlcGVuZGluZyBvbiB0aGUgb3JpZ2luYWwgY2hlY2tib3gvcmFkaW8gYm94IHNldHRpbmdcbiAgICAgICAgICogQWRkaXRpb25hbGx5IHNldCB0aGUgbmV3IHN0YXRlIG9mIHRoZSBvcmlnaW5hbCBjaGVja2JveC9yYWRpbyBib3ggYW5kIHRyaWdnZXIgdGhlIGNoYW5nZSBldmVudCBvbiBpdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc3dpdGNoZXJDaGFuZ2VIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAkY2hlY2tib3ggPSAkc2VsZi5maW5kKCdpbnB1dDpjaGVja2JveCcpLFxuICAgICAgICAgICAgICAgICRvbkVsZW1lbnQgPSAkc2VsZi5maW5kKCdpbnB1dDpyYWRpbycpLmZpcnN0KCksXG4gICAgICAgICAgICAgICAgJG9mZkVsZW1lbnQgPSAkc2VsZi5maW5kKCdpbnB1dDpyYWRpbycpLmxhc3QoKSxcbiAgICAgICAgICAgICAgICAkc2VsZWN0ID0gJHNlbGYuZmluZCgnc2VsZWN0JykuZmlyc3QoKSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0ID0gJHNlbGYucGFyZW50KCkuZGF0YSgnY2hlY2tib3gnKTtcblxuICAgICAgICAgICAgJHNlbGYudG9nZ2xlQ2xhc3MoJ2NoZWNrZWQnKTtcblxuICAgICAgICAgICAgJHNlbGYuZmluZCgnLnN0YXRlLWRlc2NyaXB0aW9uJykuc2hvdygpLmZhZGVPdXQoJ3Nsb3cnKTtcblxuICAgICAgICAgICAgJGNoZWNrYm94XG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCAkc2VsZi5oYXNDbGFzcygnY2hlY2tlZCcpKS50cmlnZ2VyKCdjaGVja2JveDpjaGFuZ2UnKTtcblxuICAgICAgICAgICAgJG9uRWxlbWVudFxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJywgJHNlbGYuaGFzQ2xhc3MoJ2NoZWNrZWQnKSk7XG5cbiAgICAgICAgICAgICRvZmZFbGVtZW50XG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLCAhJHNlbGYuaGFzQ2xhc3MoJ2NoZWNrZWQnKSk7XG5cbiAgICAgICAgICAgICRzZWxlY3RcbiAgICAgICAgICAgICAgICAuZmluZCgnb3B0aW9uJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignc2VsZWN0ZWQnKTtcblxuICAgICAgICAgICAgdmFyIHNlbGVjdE9wdGlvblRvU2VsZWN0ID0gJHNlbGYuaGFzQ2xhc3MoJ2NoZWNrZWQnKSA/IDEgOiAwO1xuXG4gICAgICAgICAgICAkc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoJ29wdGlvblt2YWx1ZT1cIicgKyBzZWxlY3RPcHRpb25Ub1NlbGVjdCArICdcIl0nKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdzZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5vbl91cmwgIT09ICcnICYmIG9wdGlvbnMub2ZmX3VybCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG9wdGlvbnMub2ZmX3VybDtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jaGVja2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gb3B0aW9ucy5vbl91cmw7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFuZ2UgdGhlIHN0eWxpbmcgb2YgdGhlIG5ldyBjaGVja2JveCBkZXBlbmRpbmcgb24gdGhlIG9yaWdpbmFsIGNoZWNrYm94IHNldHRpbmdcbiAgICAgICAgICogQWRkaXRpb25hbGx5IHNldCB0aGUgbmV3IHN0YXRlIG9mIHRoZSBvcmlnaW5hbCBjaGVja2JveCBhbmQgdHJpZ2dlciB0aGUgY2hhbmdlIGV2ZW50IG9uIGl0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jaGVja2JveENoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKS5mb2N1cygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbWl0YXRlIG1vdXNlIHVwIGJlaGF2aW91ciBvZiB0aGUgY2hlY2tib3hcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2hlY2tib3hNb3VzZVVwSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0OmNoZWNrYm94JykuZm9jdXMoKTtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgbW91c2VEb3duID0gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJU0FUSU9OIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcCB0aGUgY2hlY2tib3hlcyBhbmQgZ2VuZXJhdGUgbWFya3VwIGZvciB0aGUgbmV3IGNoZWNrYm94IHN0eWxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9pbml0Q2hlY2tib3hlcyA9IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XG5cbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJHRhcmdldCB8fCAkdGhpcztcblxuICAgICAgICAgICAgJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dDpjaGVja2JveCcpXG4gICAgICAgICAgICAgICAgLmZpbHRlcihvcHRpb25zLmZpbHRlciB8fCAnKicpXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXNldCA9IGpzZS5saWJzLmZhbGxiYWNrLl9kYXRhKCRzZWxmLCAnY2hlY2tib3gnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IGRhdGFzZXQuY2xhc3NOYW1lIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSAkc2VsZi5wcm9wKCd0aXRsZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDaGVja2VkID0gKCRzZWxmLnByb3AoJ2NoZWNrZWQnKSkgPyAnY2hlY2tlZCcgOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGlzYWJsZWQgPSAoJHNlbGYucHJvcCgnZGlzYWJsZWQnKSkgPyAnZGlzYWJsZWQnIDogJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAkc2VsZi5kYXRhKCdzaW5nbGVfY2hlY2tib3gnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdsZWZ0JzogJy0xMDAwMDBweCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53cmFwKCc8c3BhbiBjbGFzcz1cInNpbmdsZS1jaGVja2JveCAnICsgaXNDaGVja2VkICsgJyAnICsgaXNEaXNhYmxlZCArICdcIiB0aXRsZT1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSArICdcIj48L3NwYW4+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPicpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNpbmdsZV9jaGVja2JveCcpLnJlbW92ZUNsYXNzKCdmb2N1c2VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnZm9jdXNlZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb3VzZURvd24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9uVGV4dCA9ICgkc2VsZi5hdHRyKCdkYXRhLWNoZWNrYm94LW9uX3RleHQnKSkgPyAkc2VsZi5hdHRyKCdkYXRhLWNoZWNrYm94LW9uX3RleHQnKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZmEgZmEtY2hlY2tcIj48L3NwYW4+JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9mZlRleHQgPSAoJHNlbGYuYXR0cignZGF0YS1jaGVja2JveC1vbl90ZXh0JykpID8gJHNlbGYuYXR0cignZGF0YS1jaGVja2JveC1vZmZfdGV4dCcpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvc3Bhbj4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC53cmFwKCc8ZGl2IGNsYXNzPVwic3dpdGNoZXIgJyArIGlzQ2hlY2tlZCArICcgJyArIGlzRGlzYWJsZWQgKyAnXCIgdGl0bGU9XCInICsgdGl0bGUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCI+PC9kaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZGF0YSgnY2hlY2tib3gnLCBkYXRhc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhjbGFzc05hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgnPGRpdiBjbGFzcz1cInN3aXRjaGVyLXRvZ2dsZXJcIj48L2Rpdj4nICsgJzxkaXYgY2xhc3M9XCJzd2l0Y2hlci1pbm5lclwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN3aXRjaGVyLXN0YXRlLW9uXCI+JyArIG9uVGV4dCArICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzd2l0Y2hlci1zdGF0ZS1vZmZcIj4nICsgb2ZmVGV4dCArICc8L2Rpdj4nICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN3aXRjaGVyLXRleHQtb25cIj4nICsgb3B0aW9ucy5vbl90ZXh0ICsgJzwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN3aXRjaGVyLXRleHQtb2ZmXCI+JyArIG9wdGlvbnMub2ZmX3RleHQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcCB0aGUgcmFkaW8gYm94ZXMgYW5kIGdlbmVyYXRlIG1hcmt1cCBmb3IgdGhlIG5ldyBjaGVja2JveCBzdHlsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaW5pdFJhZGlvT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkdGhpcy5maW5kKCdpbnB1dDpyYWRpbycpLmZpbHRlcihvcHRpb25zLmZpbHRlciB8fCAnKicpLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIHZhciAkb25FbGVtZW50ID0gJHRoaXMuZmluZCgnaW5wdXQ6cmFkaW8nKS5maWx0ZXIob3B0aW9ucy5maWx0ZXIgfHwgJyonKS5maXJzdCgpLFxuICAgICAgICAgICAgICAgICAgICBvblRpdGxlID0gJG9uRWxlbWVudC5wcm9wKCd0aXRsZScpLFxuICAgICAgICAgICAgICAgICAgICAkb2ZmRWxlbWVudCA9ICR0aGlzLmZpbmQoJ2lucHV0OnJhZGlvJykuZmlsdGVyKG9wdGlvbnMuZmlsdGVyIHx8ICcqJykubGFzdCgpLFxuICAgICAgICAgICAgICAgICAgICBvZmZUaXRsZSA9ICRvZmZFbGVtZW50LnByb3AoJ3RpdGxlJyksXG4gICAgICAgICAgICAgICAgICAgIG9uTGFiZWwgPSAob3B0aW9ucy5vbl9sYWJlbCAhPT0gJycpID8gJyBkYXRhLWNoZWNrYm94LWxhYmVsPVwiJyArIG9wdGlvbnMub25fbGFiZWwgKyAnXCInIDogJycsXG4gICAgICAgICAgICAgICAgICAgIG9mZkxhYmVsID0gKG9wdGlvbnMub2ZmX2xhYmVsICE9PSAnJykgPyAnIGRhdGEtY2hlY2tib3gtbGFiZWw9XCInICsgb3B0aW9ucy5vZmZfbGFiZWwgKyAnXCInIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhc2V0ID0gb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgaXNDaGVja2VkID0gKCRvbkVsZW1lbnQucHJvcCgnY2hlY2tlZCcpKSA/ICdjaGVja2VkJyA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkID0gKCRvbkVsZW1lbnQucHJvcCgnZGlzYWJsZWQnKSkgPyAnZGlzYWJsZWQnIDogJyc7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHN3aXRjaGVyID0gJCgnPGRpdiBjbGFzcz1cInN3aXRjaGVyICcgKyBpc0NoZWNrZWQgKyAnICcgKyBpc0Rpc2FibGVkICsgJ1wiPjwvZGl2PicpO1xuXG4gICAgICAgICAgICAgICAgJG9uRWxlbWVudC5hZnRlcigkc3dpdGNoZXIpO1xuXG4gICAgICAgICAgICAgICAgJG9uRWxlbWVudC5hcHBlbmRUbygkc3dpdGNoZXIpO1xuICAgICAgICAgICAgICAgICRvZmZFbGVtZW50LmFwcGVuZFRvKCRzd2l0Y2hlcik7XG5cbiAgICAgICAgICAgICAgICAkc3dpdGNoZXJcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoJ2NoZWNrYm94JywgZGF0YXNldClcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKG9wdGlvbnMuY2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJzd2l0Y2hlci10b2dnbGVyXCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwic3dpdGNoZXItaW5uZXJcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic3dpdGNoZXItc3RhdGUtb25cIiB0aXRsZT1cIicgKyBvblRpdGxlICsgJ1wiJyArIG9uTGFiZWwgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJz48c3BhbiBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9zcGFuPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzd2l0Y2hlci1zdGF0ZS1vZmZcIiB0aXRsZT1cIicgKyBvZmZUaXRsZSArICdcIicgKyBvZmZMYWJlbCArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPjxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwic3dpdGNoZXItdGV4dC1vblwiPidcbiAgICAgICAgICAgICAgICAgICAgICAgICsgb3B0aW9ucy5vbl90ZXh0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic3dpdGNoZXItdGV4dC1vZmZcIj4nICsgb3B0aW9ucy5vZmZfdGV4dCArICc8L2Rpdj4nICsgJzwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIHRvZ2dsZSBzd2l0Y2hlciBpZiBoaWRkZW4gcmFkaW8gb3B0aW9uIHN0YXR1cyBjaGFuZ2VzICh0aGVyZSBpcyBubyBkZWZhdWx0IGNhc2UgZm9yIHRoYXQpXG4gICAgICAgICAgICAgICAgJG9uRWxlbWVudC5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyB0b2dnbGUgc3dpdGNoZXIgaWYgaGlkZGVuIHJhZGlvIG9wdGlvbiBzdGF0dXMgY2hhbmdlcyAodGhlcmUgaXMgbm8gZGVmYXVsdCBjYXNlIGZvciB0aGF0KVxuICAgICAgICAgICAgICAgICRvZmZFbGVtZW50Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBidWlsZCBtYXJrdXAgZm9yIHRoZSB1cmwgc3dpdGNoZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaW5pdFVybFN3aXRjaGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMub25fdXJsICE9PSAnJyAmJiBvcHRpb25zLm9mZl91cmwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGFzZXQgPSBqc2UubGlicy5mYWxsYmFjay5fZGF0YSgkdGhpcywgJ2NoZWNrYm94JyksXG4gICAgICAgICAgICAgICAgICAgIG9uTGFiZWwgPSAob3B0aW9ucy5vbl9sYWJlbCAhPT0gJycpID8gJyBkYXRhLWNoZWNrYm94LWxhYmVsPVwiJyArIG9wdGlvbnMub25fbGFiZWwgKyAnXCInIDogJycsXG4gICAgICAgICAgICAgICAgICAgIG9mZkxhYmVsID0gKG9wdGlvbnMub2ZmX2xhYmVsICE9PSAnJykgPyAnIGRhdGEtY2hlY2tib3gtbGFiZWw9XCInICsgb3B0aW9ucy5vZmZfbGFiZWwgKyAnXCInIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICBpc0NoZWNrZWQgPSAob3B0aW9ucy5jaGVja2VkKSA/ICdjaGVja2VkJyA6ICcnO1xuXG4gICAgICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoJ2NoZWNrYm94JywgZGF0YXNldClcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzd2l0Y2hlcicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhpc0NoZWNrZWQpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhvcHRpb25zLmNsYXNzKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCc8ZGl2IGNsYXNzPVwic3dpdGNoZXItdG9nZ2xlclwiPjwvZGl2PicgKyAnPGRpdiBjbGFzcz1cInN3aXRjaGVyLWlubmVyXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInN3aXRjaGVyLXN0YXRlLW9uXCIgdGl0bGU9XCInICsgb3B0aW9ucy5vZmZfdXJsICsgJ1wiJyArIG9uTGFiZWwgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJz48c3BhbiBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9zcGFuPjwvZGl2PicgKyAnPGRpdiBjbGFzcz1cInN3aXRjaGVyLXN0YXRlLW9mZlwiIHRpdGxlPVwiJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm9uX3VybCArICdcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgb2ZmTGFiZWwgKyAnPjxzcGFuIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L3NwYW4+PC9kaXY+JyArICc8L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9zd2l0Y2hlckNoYW5nZUhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCaW5kIGV2ZW50cyB0aGF0IGNoYW5nZSB0aGUgY2hlY2tib3ggb3Igc3dpdGNoZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaW5pdEV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLnN3aXRjaGVyJywgX3N3aXRjaGVyQ2hhbmdlSGFuZGxlcik7XG5cbiAgICAgICAgICAgICR0aGlzLm9mZignbW91c2Vkb3duJywgJy5zaW5nbGUtY2hlY2tib3gnKTtcbiAgICAgICAgICAgICR0aGlzLm9uKCdtb3VzZWRvd24nLCAnLnNpbmdsZS1jaGVja2JveCcsIF9jaGVja2JveENoYW5nZUhhbmRsZXIpO1xuICAgICAgICAgICAgJHRoaXMub2ZmKCdtb3VzZXVwJywgJy5zaW5nbGUtY2hlY2tib3gnKTtcbiAgICAgICAgICAgICR0aGlzLm9uKCdtb3VzZXVwJywgJy5zaW5nbGUtY2hlY2tib3gnLCBfY2hlY2tib3hNb3VzZVVwSGFuZGxlcik7XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdtb3VzZWRvd24nLCAnbGFiZWwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy5vbignbW91c2V1cCcsICdsYWJlbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy5vbignRk9STV9VUERBVEUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgJHRhcmdldFxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQ6Y2hlY2tib3gnKVxuICAgICAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3cmFwcGVyID0gJHNlbGYuY2xvc2VzdCgnLnN3aXRjaGVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkd3JhcHBlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd3JhcHBlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLnVud3JhcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIF9pbml0Q2hlY2tib3hlcygkdGFyZ2V0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9pbml0U2VsZWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBzZWxlY3QgZmllbGRzXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdbZGF0YS1jb252ZXJ0LWNoZWNrYm94XScpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgICAgICAgICAgdmFyICRvcHRpb25UcnVlID0gJChlbGVtZW50KS5maW5kKCdvcHRpb25bdmFsdWU9XCIxXCJdJyksXG4gICAgICAgICAgICAgICAgICAgICRvcHRpb25GYWxzZSA9ICQoZWxlbWVudCkuZmluZCgnb3B0aW9uW3ZhbHVlPVwiMFwiXScpO1xuXG4gICAgICAgICAgICAgICAgLy8gU3RhdGVzXG4gICAgICAgICAgICAgICAgdmFyIGlzQ2hlY2tlZCA9ICRvcHRpb25UcnVlLmlzKCc6c2VsZWN0ZWQnKSA/ICdjaGVja2VkJyA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpc0Rpc2FibGVkID0gJChlbGVtZW50KS5pcygnOmRpc2FibGVkJykgPyAnZGlzYWJsZWQnIDogJyc7XG5cbiAgICAgICAgICAgICAgICAvLyBTd2l0Y2hlciBUZW1wbGF0ZVxuICAgICAgICAgICAgICAgIHZhciAkc3dpdGNoZXIgPSAkKCc8ZGl2IGNsYXNzPVwic3dpdGNoZXIgJyArIGlzQ2hlY2tlZCArICcgJyArIGlzRGlzYWJsZWQgKyAnXCI+PC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgJHN3aXRjaGVyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygkKGVsZW1lbnQpLmRhdGEoJ25ld0NsYXNzJykpXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKCdjaGVja2JveCcsIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJzxkaXYgY2xhc3M9XCJzd2l0Y2hlci10b2dnbGVyXCI+PC9kaXY+JyArICc8ZGl2IGNsYXNzPVwic3dpdGNoZXItaW5uZXJcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic3dpdGNoZXItc3RhdGUtb25cIj48c3BhbiBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9zcGFuPjwvZGl2PicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJzd2l0Y2hlci1zdGF0ZS1vZmZcIj48c3BhbiBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9zcGFuPjwvZGl2PicgKyAnPC9kaXY+J1xuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAuYWZ0ZXIoJHN3aXRjaGVyKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHN3aXRjaGVyKVxuICAgICAgICAgICAgICAgICAgICAuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgLy8gc2FuaXRpemUgdXJsIHByZXZlbnRpbmcgY3Jvc3Mgc2l0ZSBzY3JpcHRpbmdcbiAgICAgICAgICAgIG9wdGlvbnMub25fdXJsID0gb3B0aW9ucy5vbl91cmwucmVwbGFjZSgnXCInLCAnJyk7XG4gICAgICAgICAgICBvcHRpb25zLm9mZl91cmwgPSBvcHRpb25zLm9mZl91cmwucmVwbGFjZSgnXCInLCAnJyk7XG5cbiAgICAgICAgICAgIF9pbml0Q2hlY2tib3hlcygpO1xuICAgICAgICAgICAgX2luaXRSYWRpb09wdGlvbnMoKTtcbiAgICAgICAgICAgIF9pbml0U2VsZWN0cygpO1xuICAgICAgICAgICAgX2luaXRVcmxTd2l0Y2hlcigpO1xuICAgICAgICAgICAgX2luaXRFdmVudEhhbmRsZXJzKCk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
