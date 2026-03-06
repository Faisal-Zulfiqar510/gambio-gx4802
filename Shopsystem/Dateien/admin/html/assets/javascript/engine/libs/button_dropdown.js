'use strict';

/* --------------------------------------------------------------
 button_dropdown.js 2016-06-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.button_dropdown = jse.libs.button_dropdown || {};

/**
 * ## Button Dropdown Library
 *
 * This library contains helper functions that make the manipulation of a button dropdown
 * widget easier.
 *
 * You will need to provide the full URL in order to load this library as a dependency to a module:
 *
 * ```javascript
 * gx.controller.module(
 *   'my_custom_page',
 *
 *   [
 *      gx.source + '/libs/button_dropdown'
 *   ],
 *
 *   function(data) {
 *      // Module code ... 
 *   });
 *```
 *
 * ### Example
 *
 * ```javascript
 * var $buttonDropdown = $('#my.js-button-dropdown');
 *
 * // Map an action to a dropdown item.
 * jse.libs.button_dropdown.mapAction($buttonDropdown, action, section, callback, $targetRecentButton);
 *
 * // Change recent button.
 * jse.libs.button_dropdown.changeDefualtButton($buttonDropdown, text, callback, $targetRecentButton);
 *
 * // Add a separator in a dropdown list.
 * jse.libs.button_dropdown.addDropdownSeperator($buttonDropdown);
 * ```
 *
 * @todo Further improve the code and the comments of this library.
 *
 * @module Admin/Libs/button_dropdown
 * @exports jse.libs.button_dropdown
 */
(function (exports) {

    'use strict';

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Triggers a specific event from an element.
     *
     * Some situations require a different approach than just using the "trigger" method.
     *
     * @param {object} $element Destination element to be triggered.
     * @param {object} event Event options can be used for creating new conditions.
     *
     * @private
     */

    var _triggerEvent = function _triggerEvent($element, event) {
        if ($element.prop('tagName') === 'A' && event.type === 'click') {
            $element.get(0).click();
        } else {
            $element.trigger(event.type);
        }
    };

    /**
     * Binds the event to a new dropdown action item.
     *
     * @param {object} options See bind documentation.
     *
     * @private
     */
    var _bindEvent = function _bindEvent(options) {
        var $dropdown = options.$dropdown,
            action = options.action,
            $target = options.$target,
            eventName = options.event,
            callback = options.callback || false,
            title = options.title || (options.$target.length ? options.$target.text() : '<No Action Title Provided>'),
            $li = $('<li></li>');

        $li.html('<span data-value="' + action + '">' + title + '</span>');
        $dropdown.find('ul').append($li);

        $li.find('span').on(eventName, function (event) {
            if (callback !== false) {
                //event.preventDefault();
                //event.stopPropagation();
                callback.call($li.find('span'), event);
            } else {
                _triggerEvent($target, event);
            }
        });
    };

    /**
     * Initializes the default button.
     *
     * @param {object} $dropdown The affected button dropdown selector.
     * @param {object} configValue Configuration value that comes from the UserConfigurationService.
     * @param {object} title The caption of the default action button.
     * @param {object} callback (optional) Callback function for the new action.
     * @param {object} $targetDefaultButton (optional) Selector for the default button.
     */
    var _initDefaultAction = function _initDefaultAction($dropdown, configValue, title, callback, $targetDefaultButton) {
        var interval = setInterval(function () {
            if (typeof $dropdown.attr('data-configuration_value') !== 'undefined') {
                // Sets the recent action button loaded from database.
                if ($dropdown.attr('data-configuration_value') === configValue) {
                    exports.changeDefaultAction($dropdown, title, callback, $targetDefaultButton);
                }

                clearInterval(interval);
            }
        }, 300);
    };

    // ------------------------------------------------------------------------
    // PUBLIC METHODS
    // ------------------------------------------------------------------------

    /**
     * Adds a new item to the dropdown.
     *
     * @param {string} translationPhrase Translation phrase key.
     * @param {string} translationSection Translation section of the phrase.
     * @param {function} customCallback Define a custom callback.
     * @param {object} $targetDefaultButton (optional) A custom selector which dropdown buttons should be changed.
     */
    exports.mapAction = function ($dropdown, translationPhrase, translationSection, customCallback, $targetDefaultButton) {
        var $target = $targetDefaultButton || $dropdown,
            title = translationSection !== '' ? jse.core.lang.translate(translationPhrase, translationSection) : translationPhrase;

        // Sets the first action as recent action button, if no recent action has benn set so far.
        if (!$dropdown.find('ul li').length && $dropdown.find('button:first').text().trim() === '') {
            exports.changeDefaultAction($dropdown, title, customCallback, $target);
        }

        _initDefaultAction($dropdown, translationPhrase, title, customCallback, $target);

        var options = {
            action: translationPhrase,
            $dropdown: $dropdown,
            title: title,
            event: 'perform:action',
            callback: function callback(event) {
                customCallback(event);
                exports.changeDefaultAction($(this), title, customCallback, $target);
            }
        };

        _bindEvent(options);
    };

    /**
     * Changes the default action of the button.
     *
     * @param {object} $button The affected button dropdown widget.
     * @param {string} title Text of the new button.
     * @param {string} callback The callback
     * @param {object} $targetDefaultButton A custom element for which button should be changed.
     */
    exports.changeDefaultAction = function ($dropdown, title, callback, $targetDefaultButton) {
        var $target = $targetDefaultButton || $dropdown,
            icon = $target.data('icon');

        if (title.length) {
            $target.find('button:first').off('perform:action').on('perform:action', callback);
        }

        $target.find('button:first').text(title);

        $target.find('button:first').prop('title', title.trim());

        if (typeof icon !== 'undefined') {
            $target.find('button:first').prepend($('<i class="fa fa-' + icon + ' btn-icon"></i>'));
        }
    };

    /**
     * Add button-dropdown action.
     *
     * This method works with the Bootstrap markup button-dropdowns and enables you to add actions with callbacks
     * existing button dropdown elements.
     *
     * The action object can have the following attributes and default values:
     *
     * {
     *   text: '{Undefined}', // The text to be displayed.
     *   href: '#', // URL for the <a> element.
     *   target: '', // Target attribute for <a> element.
     *   class: '', // Add custom classes to the <a> element.
     *   data: {}, // Add data to the <a> element.
     *   isDefault: false, // Whether the action is the default action.
     *   callback: function(e) {} // Callback for click event of the <a> element.
     * }
     *
     * @param {object} $dropdown The jQuery selector of the button dropdown wrapper.
     * @param {object} action An object containing the action information.
     */
    exports.addAction = function ($dropdown, action) {
        var $li = $('<li/>'),
            $a = $('<a />');

        $a.text(action.text || '{Undefined}').attr('href', action.href || '#').attr('target', action.target || '').addClass(action.class || '').data(action.data).appendTo($li);

        if (action.isDefault) {
            exports.setDefaultAction($dropdown, $a);
        }

        if (action.callback) {
            $a.on('click', action.callback);
        }

        $li.appendTo($dropdown.find('ul'));
    };

    /**
     * Adds a separator to the dropdown list.
     *
     * The separator will be added at the end of the list.
     *
     * @param {object} $dropdown The jQuery selector of the button dropdown wrapper.
     * @param {bool} compatibilityMarkup (optional) Whether to use the compatibility markup.
     */
    exports.addSeparator = function ($dropdown) {
        var compatibilityMarkup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var html = !compatibilityMarkup ? '<li role="separator" class="divider"></li>' : '<li><hr></li>';
        $dropdown.find('ul').append(html);
    };

    /**
     * Bind button dropdown default action.
     *
     * This method will update the default action of the dropdown upon click. This is useful for storing the
     * default actions and then using them to display the default one with every new instance of the button
     * dropdown.
     *
     * Important: The <a> elements need to have the "configurationValue" data property that defines a unique string
     * for the selected action.
     *
     * @param {object} $dropdowns The jQuery selector of the button dropdowns wrapper.
     * @param {number} userId The ID of the current user.
     * @param {string} configurationKey The configuration key to be saved.
     * @param {object} userConfigurationService The user_configuration_service module (needs to be passed explicitly).
     */
    exports.bindDefaultAction = function ($dropdowns, userId, configurationKey, userConfigurationService) {
        $dropdowns.on('click', 'a', function () {
            var params = {
                data: {
                    userId: userId,
                    configurationKey: configurationKey,
                    configurationValue: $(this).data('configurationValue')
                }
            };

            userConfigurationService.set(params);

            exports.setDefaultAction($dropdowns, $(this));
        });
    };

    /**
     * Set the default action item for button dropdowns.
     *
     * @param {object} $dropdowns jQuery selector for the button dropdowns.
     * @param {object} $actionLink jQuery selector for the action link to be set as default.
     */
    exports.setDefaultAction = function ($dropdowns, $actionLink) {
        $dropdowns.each(function (index, dropdown) {
            var $dropdownButton = $(dropdown).children('button:first');

            $dropdownButton.text($actionLink.text()).off('click').on('click', function () {
                // Do nothing when the dropdown is grayed out.
                if ($dropdownButton.hasClass('disabled')) {
                    return;
                }
                $(dropdown).find('li:eq(' + $actionLink.parent().index() + ') a')[0].click();
            });
        });
    };
})(jse.libs.button_dropdown);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbl9kcm9wZG93bi5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwiYnV0dG9uX2Ryb3Bkb3duIiwiZXhwb3J0cyIsIl90cmlnZ2VyRXZlbnQiLCIkZWxlbWVudCIsImV2ZW50IiwicHJvcCIsInR5cGUiLCJnZXQiLCJjbGljayIsInRyaWdnZXIiLCJfYmluZEV2ZW50Iiwib3B0aW9ucyIsIiRkcm9wZG93biIsImFjdGlvbiIsIiR0YXJnZXQiLCJldmVudE5hbWUiLCJjYWxsYmFjayIsInRpdGxlIiwibGVuZ3RoIiwidGV4dCIsIiRsaSIsIiQiLCJodG1sIiwiZmluZCIsImFwcGVuZCIsIm9uIiwiY2FsbCIsIl9pbml0RGVmYXVsdEFjdGlvbiIsImNvbmZpZ1ZhbHVlIiwiJHRhcmdldERlZmF1bHRCdXR0b24iLCJpbnRlcnZhbCIsInNldEludGVydmFsIiwiYXR0ciIsImNoYW5nZURlZmF1bHRBY3Rpb24iLCJjbGVhckludGVydmFsIiwibWFwQWN0aW9uIiwidHJhbnNsYXRpb25QaHJhc2UiLCJ0cmFuc2xhdGlvblNlY3Rpb24iLCJjdXN0b21DYWxsYmFjayIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwidHJpbSIsImljb24iLCJkYXRhIiwib2ZmIiwicHJlcGVuZCIsImFkZEFjdGlvbiIsIiRhIiwiaHJlZiIsInRhcmdldCIsImFkZENsYXNzIiwiY2xhc3MiLCJhcHBlbmRUbyIsImlzRGVmYXVsdCIsInNldERlZmF1bHRBY3Rpb24iLCJhZGRTZXBhcmF0b3IiLCJjb21wYXRpYmlsaXR5TWFya3VwIiwiYmluZERlZmF1bHRBY3Rpb24iLCIkZHJvcGRvd25zIiwidXNlcklkIiwiY29uZmlndXJhdGlvbktleSIsInVzZXJDb25maWd1cmF0aW9uU2VydmljZSIsInBhcmFtcyIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsInNldCIsIiRhY3Rpb25MaW5rIiwiZWFjaCIsImluZGV4IiwiZHJvcGRvd24iLCIkZHJvcGRvd25CdXR0b24iLCJjaGlsZHJlbiIs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QURWLEVBRUswQixHQUZMLENBRVMsT0FGVCxFQUdLcEIsRUFITCxDQUdRLE9BSFIsRUFHaUIsWUFBTTtBQUNmO0FBQ0Esb0JBQUk2QyxnQkFBZ0JFLFFBQWhCLENBQXlCLFVBQXpCLENBQUosRUFBMEM7QUFDdEM7QUFDSDtBQUNEbkQsa0JBQUVnRCxRQUFGLEVBQ0s5QyxJQURMLFlBQ21CMkMsWUFBWU8sTUFBWixHQUFxQkwsS0FBckIsRUFEbkIsVUFDc0QsQ0FEdEQsRUFFSzVELEtBRkw7QUFHSCxhQVhMO0FBWUgsU0FmRDtBQWdCSCxLQWpCRDtBQW1CSCxDQXpRRCxFQXlRR1YsSUFBSUMsSUFBSixDQUFTQyxlQXpRWiIsImZpbGUiOiJidXR0b25fZHJvcGRvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGJ1dHRvbl9kcm9wZG93bi5qcyAyMDE2LTA2LTEwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuanNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duID0ganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duIHx8IHt9O1xuXG4vKipcbiAqICMjIEJ1dHRvbiBEcm9wZG93biBMaWJyYXJ5XG4gKlxuICogVGhpcyBsaWJyYXJ5IGNvbnRhaW5zIGhlbHBlciBmdW5jdGlvbnMgdGhhdCBtYWtlIHRoZSBtYW5pcHVsYXRpb24gb2YgYSBidXR0b24gZHJvcGRvd25cbiAqIHdpZGdldCBlYXNpZXIuXG4gKlxuICogWW91IHdpbGwgbmVlZCB0byBwcm92aWRlIHRoZSBmdWxsIFVSTCBpbiBvcmRlciB0byBsb2FkIHRoaXMgbGlicmFyeSBhcyBhIGRlcGVuZGVuY3kgdG8gYSBtb2R1bGU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZ3guY29udHJvbGxlci5tb2R1bGUoXG4gKiAgICdteV9jdXN0b21fcGFnZScsXG4gKlxuICogICBbXG4gKiAgICAgIGd4LnNvdXJjZSArICcvbGlicy9idXR0b25fZHJvcGRvd24nXG4gKiAgIF0sXG4gKlxuICogICBmdW5jdGlvbihkYXRhKSB7XG4gKiAgICAgIC8vIE1vZHVsZSBjb2RlIC4uLiBcbiAqICAgfSk7XG4gKmBgYFxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyICRidXR0b25Ecm9wZG93biA9ICQoJyNteS5qcy1idXR0b24tZHJvcGRvd24nKTtcbiAqXG4gKiAvLyBNYXAgYW4gYWN0aW9uIHRvIGEgZHJvcGRvd24gaXRlbS5cbiAqIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5tYXBBY3Rpb24oJGJ1dHRvbkRyb3Bkb3duLCBhY3Rpb24sIHNlY3Rpb24sIGNhbGxiYWNrLCAkdGFyZ2V0UmVjZW50QnV0dG9uKTtcbiAqXG4gKiAvLyBDaGFuZ2UgcmVjZW50IGJ1dHRvbi5cbiAqIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5jaGFuZ2VEZWZ1YWx0QnV0dG9uKCRidXR0b25Ecm9wZG93biwgdGV4dCwgY2FsbGJhY2ssICR0YXJnZXRSZWNlbnRCdXR0b24pO1xuICpcbiAqIC8vIEFkZCBhIHNlcGFyYXRvciBpbiBhIGRyb3Bkb3duIGxpc3QuXG4gKiBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkRHJvcGRvd25TZXBlcmF0b3IoJGJ1dHRvbkRyb3Bkb3duKTtcbiAqIGBgYFxuICpcbiAqIEB0b2RvIEZ1cnRoZXIgaW1wcm92ZSB0aGUgY29kZSBhbmQgdGhlIGNvbW1lbnRzIG9mIHRoaXMgbGlicmFyeS5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0xpYnMvYnV0dG9uX2Ryb3Bkb3duXG4gKiBAZXhwb3J0cyBqc2UubGlicy5idXR0b25fZHJvcGRvd25cbiAqL1xuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXJzIGEgc3BlY2lmaWMgZXZlbnQgZnJvbSBhbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogU29tZSBzaXR1YXRpb25zIHJlcXVpcmUgYSBkaWZmZXJlbnQgYXBwcm9hY2ggdGhhbiBqdXN0IHVzaW5nIHRoZSBcInRyaWdnZXJcIiBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJGVsZW1lbnQgRGVzdGluYXRpb24gZWxlbWVudCB0byBiZSB0cmlnZ2VyZWQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IEV2ZW50IG9wdGlvbnMgY2FuIGJlIHVzZWQgZm9yIGNyZWF0aW5nIG5ldyBjb25kaXRpb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgX3RyaWdnZXJFdmVudCA9IGZ1bmN0aW9uICgkZWxlbWVudCwgZXZlbnQpIHtcbiAgICAgICAgaWYgKCRlbGVtZW50LnByb3AoJ3RhZ05hbWUnKSA9PT0gJ0EnICYmIGV2ZW50LnR5cGUgPT09ICdjbGljaycpIHtcbiAgICAgICAgICAgICRlbGVtZW50LmdldCgwKS5jbGljaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGVsZW1lbnQudHJpZ2dlcihldmVudC50eXBlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgZXZlbnQgdG8gYSBuZXcgZHJvcGRvd24gYWN0aW9uIGl0ZW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBTZWUgYmluZCBkb2N1bWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgX2JpbmRFdmVudCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHZhciAkZHJvcGRvd24gPSBvcHRpb25zLiRkcm9wZG93bixcbiAgICAgICAgICAgIGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uLFxuICAgICAgICAgICAgJHRhcmdldCA9IG9wdGlvbnMuJHRhcmdldCxcbiAgICAgICAgICAgIGV2ZW50TmFtZSA9IG9wdGlvbnMuZXZlbnQsXG4gICAgICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgZmFsc2UsXG4gICAgICAgICAgICB0aXRsZSA9IG9wdGlvbnMudGl0bGUgfHwgKG9wdGlvbnMuJHRhcmdldC5sZW5ndGggPyBvcHRpb25zLiR0YXJnZXQudGV4dCgpIDogJzxObyBBY3Rpb24gVGl0bGUgUHJvdmlkZWQ+JyksXG4gICAgICAgICAgICAkbGkgPSAkKCc8bGk+PC9saT4nKTtcblxuICAgICAgICAkbGkuaHRtbCgnPHNwYW4gZGF0YS12YWx1ZT1cIicgKyBhY3Rpb24gKyAnXCI+JyArIHRpdGxlICsgJzwvc3Bhbj4nKTtcbiAgICAgICAgJGRyb3Bkb3duLmZpbmQoJ3VsJykuYXBwZW5kKCRsaSk7XG5cbiAgICAgICAgJGxpLmZpbmQoJ3NwYW4nKS5vbihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAvL2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoJGxpLmZpbmQoJ3NwYW4nKSwgZXZlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdHJpZ2dlckV2ZW50KCR0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBkZWZhdWx0IGJ1dHRvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkZHJvcGRvd24gVGhlIGFmZmVjdGVkIGJ1dHRvbiBkcm9wZG93biBzZWxlY3Rvci5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnVmFsdWUgQ29uZmlndXJhdGlvbiB2YWx1ZSB0aGF0IGNvbWVzIGZyb20gdGhlIFVzZXJDb25maWd1cmF0aW9uU2VydmljZS5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGl0bGUgVGhlIGNhcHRpb24gb2YgdGhlIGRlZmF1bHQgYWN0aW9uIGJ1dHRvbi5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY2FsbGJhY2sgKG9wdGlvbmFsKSBDYWxsYmFjayBmdW5jdGlvbiBmb3IgdGhlIG5ldyBhY3Rpb24uXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICR0YXJnZXREZWZhdWx0QnV0dG9uIChvcHRpb25hbCkgU2VsZWN0b3IgZm9yIHRoZSBkZWZhdWx0IGJ1dHRvbi5cbiAgICAgKi9cbiAgICB2YXIgX2luaXREZWZhdWx0QWN0aW9uID0gZnVuY3Rpb24gKCRkcm9wZG93biwgY29uZmlnVmFsdWUsIHRpdGxlLCBjYWxsYmFjaywgJHRhcmdldERlZmF1bHRCdXR0b24pIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAkZHJvcGRvd24uYXR0cignZGF0YS1jb25maWd1cmF0aW9uX3ZhbHVlJykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0cyB0aGUgcmVjZW50IGFjdGlvbiBidXR0b24gbG9hZGVkIGZyb20gZGF0YWJhc2UuXG4gICAgICAgICAgICAgICAgaWYgKCRkcm9wZG93bi5hdHRyKCdkYXRhLWNvbmZpZ3VyYXRpb25fdmFsdWUnKSA9PT0gY29uZmlnVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwb3J0cy5jaGFuZ2VEZWZhdWx0QWN0aW9uKCRkcm9wZG93biwgdGl0bGUsIGNhbGxiYWNrLCAkdGFyZ2V0RGVmYXVsdEJ1dHRvbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDMwMCk7XG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFBVQkxJQyBNRVRIT0RTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgbmV3IGl0ZW0gdG8gdGhlIGRyb3Bkb3duLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zbGF0aW9uUGhyYXNlIFRyYW5zbGF0aW9uIHBocmFzZSBrZXkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zbGF0aW9uU2VjdGlvbiBUcmFuc2xhdGlvbiBzZWN0aW9uIG9mIHRoZSBwaHJhc2UuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3VzdG9tQ2FsbGJhY2sgRGVmaW5lIGEgY3VzdG9tIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkdGFyZ2V0RGVmYXVsdEJ1dHRvbiAob3B0aW9uYWwpIEEgY3VzdG9tIHNlbGVjdG9yIHdoaWNoIGRyb3Bkb3duIGJ1dHRvbnMgc2hvdWxkIGJlIGNoYW5nZWQuXG4gICAgICovXG4gICAgZXhwb3J0cy5tYXBBY3Rpb24gPVxuICAgICAgICBmdW5jdGlvbiAoJGRyb3Bkb3duLCB0cmFuc2xhdGlvblBocmFzZSwgdHJhbnNsYXRpb25TZWN0aW9uLCBjdXN0b21DYWxsYmFjaywgJHRhcmdldERlZmF1bHRCdXR0b24pIHtcbiAgICAgICAgICAgIHZhciAkdGFyZ2V0ID0gJHRhcmdldERlZmF1bHRCdXR0b24gfHwgJGRyb3Bkb3duLFxuICAgICAgICAgICAgICAgIHRpdGxlID0gKHRyYW5zbGF0aW9uU2VjdGlvbiAhPT0gJycpXG4gICAgICAgICAgICAgICAgICAgID8ganNlLmNvcmUubGFuZy50cmFuc2xhdGUodHJhbnNsYXRpb25QaHJhc2UsIHRyYW5zbGF0aW9uU2VjdGlvbilcbiAgICAgICAgICAgICAgICAgICAgOiB0cmFuc2xhdGlvblBocmFzZTtcblxuICAgICAgICAgICAgLy8gU2V0cyB0aGUgZmlyc3QgYWN0aW9uIGFzIHJlY2VudCBhY3Rpb24gYnV0dG9uLCBpZiBubyByZWNlbnQgYWN0aW9uIGhhcyBiZW5uIHNldCBzbyBmYXIuXG4gICAgICAgICAgICBpZiAoISRkcm9wZG93bi5maW5kKCd1bCBsaScpLmxlbmd0aCAmJiAkZHJvcGRvd24uZmluZCgnYnV0dG9uOmZpcnN0JykudGV4dCgpLnRyaW0oKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBleHBvcnRzLmNoYW5nZURlZmF1bHRBY3Rpb24oJGRyb3Bkb3duLCB0aXRsZSwgY3VzdG9tQ2FsbGJhY2ssICR0YXJnZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfaW5pdERlZmF1bHRBY3Rpb24oJGRyb3Bkb3duLCB0cmFuc2xhdGlvblBocmFzZSwgdGl0bGUsIGN1c3RvbUNhbGxiYWNrLCAkdGFyZ2V0KTtcblxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiB0cmFuc2xhdGlvblBocmFzZSxcbiAgICAgICAgICAgICAgICAkZHJvcGRvd246ICRkcm9wZG93bixcbiAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgZXZlbnQ6ICdwZXJmb3JtOmFjdGlvbicsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21DYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGV4cG9ydHMuY2hhbmdlRGVmYXVsdEFjdGlvbigkKHRoaXMpLCB0aXRsZSwgY3VzdG9tQ2FsbGJhY2ssICR0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF9iaW5kRXZlbnQob3B0aW9ucyk7XG4gICAgICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSBkZWZhdWx0IGFjdGlvbiBvZiB0aGUgYnV0dG9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRidXR0b24gVGhlIGFmZmVjdGVkIGJ1dHRvbiBkcm9wZG93biB3aWRnZXQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIFRleHQgb2YgdGhlIG5ldyBidXR0b24uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrIFRoZSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkdGFyZ2V0RGVmYXVsdEJ1dHRvbiBBIGN1c3RvbSBlbGVtZW50IGZvciB3aGljaCBidXR0b24gc2hvdWxkIGJlIGNoYW5nZWQuXG4gICAgICovXG4gICAgZXhwb3J0cy5jaGFuZ2VEZWZhdWx0QWN0aW9uID0gZnVuY3Rpb24gKCRkcm9wZG93biwgdGl0bGUsIGNhbGxiYWNrLCAkdGFyZ2V0RGVmYXVsdEJ1dHRvbikge1xuICAgICAgICB2YXIgJHRhcmdldCA9ICR0YXJnZXREZWZhdWx0QnV0dG9uIHx8ICRkcm9wZG93bixcbiAgICAgICAgICAgIGljb24gPSAkdGFyZ2V0LmRhdGEoJ2ljb24nKTtcblxuICAgICAgICBpZiAodGl0bGUubGVuZ3RoKSB7XG4gICAgICAgICAgICAkdGFyZ2V0XG4gICAgICAgICAgICAgICAgLmZpbmQoJ2J1dHRvbjpmaXJzdCcpXG4gICAgICAgICAgICAgICAgLm9mZigncGVyZm9ybTphY3Rpb24nKVxuICAgICAgICAgICAgICAgIC5vbigncGVyZm9ybTphY3Rpb24nLCBjYWxsYmFjayk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGFyZ2V0XG4gICAgICAgICAgICAuZmluZCgnYnV0dG9uOmZpcnN0JylcbiAgICAgICAgICAgIC50ZXh0KHRpdGxlKTtcblxuICAgICAgICAkdGFyZ2V0XG4gICAgICAgICAgICAuZmluZCgnYnV0dG9uOmZpcnN0JylcbiAgICAgICAgICAgIC5wcm9wKCd0aXRsZScsIHRpdGxlLnRyaW0oKSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpY29uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJHRhcmdldFxuICAgICAgICAgICAgICAgIC5maW5kKCdidXR0b246Zmlyc3QnKVxuICAgICAgICAgICAgICAgIC5wcmVwZW5kKCQoJzxpIGNsYXNzPVwiZmEgZmEtJyArIGljb24gKyAnIGJ0bi1pY29uXCI+PC9pPicpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYnV0dG9uLWRyb3Bkb3duIGFjdGlvbi5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdvcmtzIHdpdGggdGhlIEJvb3RzdHJhcCBtYXJrdXAgYnV0dG9uLWRyb3Bkb3ducyBhbmQgZW5hYmxlcyB5b3UgdG8gYWRkIGFjdGlvbnMgd2l0aCBjYWxsYmFja3NcbiAgICAgKiBleGlzdGluZyBidXR0b24gZHJvcGRvd24gZWxlbWVudHMuXG4gICAgICpcbiAgICAgKiBUaGUgYWN0aW9uIG9iamVjdCBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXMgYW5kIGRlZmF1bHQgdmFsdWVzOlxuICAgICAqXG4gICAgICoge1xuICAgICAqICAgdGV4dDogJ3tVbmRlZmluZWR9JywgLy8gVGhlIHRleHQgdG8gYmUgZGlzcGxheWVkLlxuICAgICAqICAgaHJlZjogJyMnLCAvLyBVUkwgZm9yIHRoZSA8YT4gZWxlbWVudC5cbiAgICAgKiAgIHRhcmdldDogJycsIC8vIFRhcmdldCBhdHRyaWJ1dGUgZm9yIDxhPiBlbGVtZW50LlxuICAgICAqICAgY2xhc3M6ICcnLCAvLyBBZGQgY3VzdG9tIGNsYXNzZXMgdG8gdGhlIDxhPiBlbGVtZW50LlxuICAgICAqICAgZGF0YToge30sIC8vIEFkZCBkYXRhIHRvIHRoZSA8YT4gZWxlbWVudC5cbiAgICAgKiAgIGlzRGVmYXVsdDogZmFsc2UsIC8vIFdoZXRoZXIgdGhlIGFjdGlvbiBpcyB0aGUgZGVmYXVsdCBhY3Rpb24uXG4gICAgICogICBjYWxsYmFjazogZnVuY3Rpb24oZSkge30gLy8gQ2FsbGJhY2sgZm9yIGNsaWNrIGV2ZW50IG9mIHRoZSA8YT4gZWxlbWVudC5cbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJGRyb3Bkb3duIFRoZSBqUXVlcnkgc2VsZWN0b3Igb2YgdGhlIGJ1dHRvbiBkcm9wZG93biB3cmFwcGVyLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBhY3Rpb24gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGFjdGlvbiBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBleHBvcnRzLmFkZEFjdGlvbiA9IGZ1bmN0aW9uICgkZHJvcGRvd24sIGFjdGlvbikge1xuICAgICAgICBsZXQgJGxpID0gJCgnPGxpLz4nKSxcbiAgICAgICAgICAgICRhID0gJCgnPGEgLz4nKTtcblxuICAgICAgICAkYVxuICAgICAgICAgICAgLnRleHQoYWN0aW9uLnRleHQgfHwgJ3tVbmRlZmluZWR9JylcbiAgICAgICAgICAgIC5hdHRyKCdocmVmJywgYWN0aW9uLmhyZWYgfHwgJyMnKVxuICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsIGFjdGlvbi50YXJnZXQgfHwgJycpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoYWN0aW9uLmNsYXNzIHx8ICcnKVxuICAgICAgICAgICAgLmRhdGEoYWN0aW9uLmRhdGEpXG4gICAgICAgICAgICAuYXBwZW5kVG8oJGxpKTtcblxuICAgICAgICBpZiAoYWN0aW9uLmlzRGVmYXVsdCkge1xuICAgICAgICAgICAgZXhwb3J0cy5zZXREZWZhdWx0QWN0aW9uKCRkcm9wZG93biwgJGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdGlvbi5jYWxsYmFjaykge1xuICAgICAgICAgICAgJGEub24oJ2NsaWNrJywgYWN0aW9uLmNhbGxiYWNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRsaS5hcHBlbmRUbygkZHJvcGRvd24uZmluZCgndWwnKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBzZXBhcmF0b3IgdG8gdGhlIGRyb3Bkb3duIGxpc3QuXG4gICAgICpcbiAgICAgKiBUaGUgc2VwYXJhdG9yIHdpbGwgYmUgYWRkZWQgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkZHJvcGRvd24gVGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgYnV0dG9uIGRyb3Bkb3duIHdyYXBwZXIuXG4gICAgICogQHBhcmFtIHtib29sfSBjb21wYXRpYmlsaXR5TWFya3VwIChvcHRpb25hbCkgV2hldGhlciB0byB1c2UgdGhlIGNvbXBhdGliaWxpdHkgbWFya3VwLlxuICAgICAqL1xuICAgIGV4cG9ydHMuYWRkU2VwYXJhdG9yID0gZnVuY3Rpb24gKCRkcm9wZG93biwgY29tcGF0aWJpbGl0eU1hcmt1cCA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBodG1sID0gIWNvbXBhdGliaWxpdHlNYXJrdXAgPyAnPGxpIHJvbGU9XCJzZXBhcmF0b3JcIiBjbGFzcz1cImRpdmlkZXJcIj48L2xpPicgOiAnPGxpPjxocj48L2xpPic7XG4gICAgICAgICRkcm9wZG93bi5maW5kKCd1bCcpLmFwcGVuZChodG1sKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQmluZCBidXR0b24gZHJvcGRvd24gZGVmYXVsdCBhY3Rpb24uXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIHVwZGF0ZSB0aGUgZGVmYXVsdCBhY3Rpb24gb2YgdGhlIGRyb3Bkb3duIHVwb24gY2xpY2suIFRoaXMgaXMgdXNlZnVsIGZvciBzdG9yaW5nIHRoZVxuICAgICAqIGRlZmF1bHQgYWN0aW9ucyBhbmQgdGhlbiB1c2luZyB0aGVtIHRvIGRpc3BsYXkgdGhlIGRlZmF1bHQgb25lIHdpdGggZXZlcnkgbmV3IGluc3RhbmNlIG9mIHRoZSBidXR0b25cbiAgICAgKiBkcm9wZG93bi5cbiAgICAgKlxuICAgICAqIEltcG9ydGFudDogVGhlIDxhPiBlbGVtZW50cyBuZWVkIHRvIGhhdmUgdGhlIFwiY29uZmlndXJhdGlvblZhbHVlXCIgZGF0YSBwcm9wZXJ0eSB0aGF0IGRlZmluZXMgYSB1bmlxdWUgc3RyaW5nXG4gICAgICogZm9yIHRoZSBzZWxlY3RlZCBhY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJGRyb3Bkb3ducyBUaGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBidXR0b24gZHJvcGRvd25zIHdyYXBwZXIuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHVzZXJJZCBUaGUgSUQgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlndXJhdGlvbktleSBUaGUgY29uZmlndXJhdGlvbiBrZXkgdG8gYmUgc2F2ZWQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHVzZXJDb25maWd1cmF0aW9uU2VydmljZSBUaGUgdXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UgbW9kdWxlIChuZWVkcyB0byBiZSBwYXNzZWQgZXhwbGljaXRseSkuXG4gICAgICovXG4gICAgZXhwb3J0cy5iaW5kRGVmYXVsdEFjdGlvbiA9IGZ1bmN0aW9uICgkZHJvcGRvd25zLCB1c2VySWQsIGNvbmZpZ3VyYXRpb25LZXksIHVzZXJDb25maWd1cmF0aW9uU2VydmljZSkge1xuICAgICAgICAkZHJvcGRvd25zLm9uKCdjbGljaycsICdhJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uS2V5LFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6ICQodGhpcykuZGF0YSgnY29uZmlndXJhdGlvblZhbHVlJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB1c2VyQ29uZmlndXJhdGlvblNlcnZpY2Uuc2V0KHBhcmFtcyk7XG5cbiAgICAgICAgICAgIGV4cG9ydHMuc2V0RGVmYXVsdEFjdGlvbigkZHJvcGRvd25zLCAkKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgZGVmYXVsdCBhY3Rpb24gaXRlbSBmb3IgYnV0dG9uIGRyb3Bkb3ducy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkZHJvcGRvd25zIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIGJ1dHRvbiBkcm9wZG93bnMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRhY3Rpb25MaW5rIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIGFjdGlvbiBsaW5rIHRvIGJlIHNldCBhcyBkZWZhdWx0LlxuICAgICAqL1xuICAgIGV4cG9ydHMuc2V0RGVmYXVsdEFjdGlvbiA9IGZ1bmN0aW9uICgkZHJvcGRvd25zLCAkYWN0aW9uTGluaykge1xuICAgICAgICAkZHJvcGRvd25zLmVhY2goKGluZGV4LCBkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGRyb3Bkb3duQnV0dG9uID0gJChkcm9wZG93bikuY2hpbGRyZW4oJ2J1dHRvbjpmaXJzdCcpO1xuXG4gICAgICAgICAgICAkZHJvcGRvd25CdXR0b25cbiAgICAgICAgICAgICAgICAudGV4dCgkYWN0aW9uTGluay50ZXh0KCkpXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvIG5vdGhpbmcgd2hlbiB0aGUgZHJvcGRvd24gaXMgZ3JheWVkIG91dC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCRkcm9wZG93bkJ1dHRvbi5oYXNDbGFzcygnZGlzYWJsZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoZHJvcGRvd24pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZChgbGk6ZXEoJHskYWN0aW9uTGluay5wYXJlbnQoKS5pbmRleCgpfSkgYWApWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxufSkoanNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duKTtcbiJdfQ==
