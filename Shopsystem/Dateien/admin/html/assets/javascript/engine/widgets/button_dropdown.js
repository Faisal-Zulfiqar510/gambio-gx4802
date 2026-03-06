'use strict';

/* --------------------------------------------------------------
 button_dropdown.js 2016-07-15
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Button Dropdown Widget
 *
 * Adds the dropdown functionality to multiple elements inside a parent container. You can add new HTML
 * options to each dropdown instance manually or dynamically through the Admin/Libs/button_dropdown library.
 *
 * Optionally, the widget has also the ability to store the last clicked option and display it as the default
 * action the next time the page is loaded. This is very useful whenever there are many options inside the
 * dropdown list.
 *
 * ### Parent Container Options
 *
 * **Configuration Keys | `data-button_dropdown-config_keys` | String | Optional**
 *
 * Provide a unique key which will be used to store the latest user selection. Prefer to prefix your config key
 * in order to avoid collisions with other instances of the widget.
 *
 * **User ID | `data-button_dropdown-user_id` | Number | Optional**
 *
 * Give the current user database ID that will be used to associate his latest selection with the corresponding
 * button dropdown widget.
 *
 * ### Widget Instance Options
 *
 * **Use Button Dropdown | `data-use-button_dropdown` | Boolean | Required**
 *
 * This option-flag will mark the elements inside the parent container, that will be converted into
 * button-dropdown widgets.
 *
 * **Configuration Key | `data-config_key` | String | Required**
 *
 * Provide the configuration key for the single button-dropdown instance.
 *
 * **Configuration Value | `data-config_key` | String | Optional**
 *
 * Provide directly the configuration value in order to avoid extra AJAX requests.
 *
 * **Custom Caret Button Class | `data-custom_caret_btn_class` | String | Optional**
 *
 * Attach additional classes to the caret button element (the one with the arrow). Use this option if you
 * want to add a class that the primary button already has so that both share the same style (e.g. btn-primary).
 *
 * Change buttons disable attribute value by adding option `data-button_dropdown-disabled_state` on parent element
 *
 * ### Example
 * ```html
 * <!-- This element represents the parent container. -->
 * <div
 *   data-gx-widget="button_dropdown"
 *   data-button_dropdown-config_keys="order-single order-multi"
 *   data-button_dropdown-user_id="2">
 *
 *   <!-- This element represents the button dropdown widget. -->
 *   <div
 *       data-use-button_dropdown="true"
 *       data-config_key="order-single"
 *       data-custom_caret_btn_class="class1">
 *     <button>Primary Button</button>
 *     <ul>
 *       <li><span>Change status</span></li>
 *       <li><span>Delete</span></li>
 *     </ul>
 *   </div>
 * </div>
 * ```
 *
 * **Notice:** This widget was built for usage in compatibility mode. The new admin pages use the Bootstrap
 * button dropdown markup which already functions like this module. Do not use it on new admin pages.
 *
 * @module Admin/Widgets/button_dropdown
 */
gx.widgets.module('button_dropdown', ['user_configuration_service'], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLE DEFINITION
  // ------------------------------------------------------------------------

  var
  /**
   * Widget Reference
   * @type {object}
   */
  $this = $(this),


  /**
   * UserConfigurationService alias.
   * @type {object}
   */
  userConfigurationService = jse.libs.user_configuration_service,


  /**
   * Caret button template.
   * @type {string}
   */
  caretButtonTemplate = '<button class="btn" type="button"><i class="fa fa-caret-down"></i></button>',


  /**
   * Default Widget Options
   * @type {object}
   */
  defaults = {
    /**
     * Fade animation options.
     * @type {object}
     */
    fade: {
      duration: 300,
      easing: 'swing'
    },

    /**
     * String for dropdown selector.
     * This selector is used to find and activate all button dropdowns.
     *
     * @type {string}
     */
    dropdown_selector: '[data-use-button_dropdown]',

    /**
     * Attribute which represents the user configuration value.
     * The value of this attribute will be set.
     *
     * @type {string}
     */
    config_value_attribute: 'data-configuration_value',

    /**
     * Used to disable buttons if needed
     *
     * @type {bool}
     */
    disabled_state: false
  },


  /**
   * Final Widget Options
   * @type {object}
   */
  options = $.extend(true, {}, defaults, data),


  /**
   * Element selector shortcuts.
   * @type {object}
   */
  selectors = {
    element: options.dropdown_selector,
    mainButton: 'button:nth-child(1)',
    caretButton: 'button:nth-child(2)'
  },


  /**
   * Module Object
   * @type {object}
   */
  module = {};

  /**
   * Split space-separated entries to array values.
   * @type {array}
   */
  options.config_keys = options.config_keys ? options.config_keys.split(' ') : [];

  // ------------------------------------------------------------------------
  // PRIVATE METHODS - INITIALIZATION
  // ------------------------------------------------------------------------

  /**
   * Loads the user configuration values for each provided key.
   * Returns a Deferred object with an object with configuration
   * as key and respective values or null if no request conditions are set.
   *
   * @returns {jQuery.Deferred}
   * @private
   */
  var _loadConfigurations = function _loadConfigurations() {

    /**
     * Main deferred object which will be returned.
     * @type {jQuery.Deferred}
     */
    var deferred = $.Deferred();

    /**
     * This array will contain all deferred ajax request to the user configuration service.
     * @example
     *      [Deferred, Deferred]
     * @type {array}
     */
    var configDeferreds = [];

    /**
     * User configuration key and values storage.
     * @example
     *      {
     *          configKey: 'configValue'
     *      }
     * @type {object}
     */
    var configValues = {};

    // Return immediately if the user configuration service is not needed.
    if (!options.user_id || !options.config_keys.length) {
      return deferred.resolve(null);
    }

    // Iterate over each configuration value provided in the element
    $.each(options.config_keys, function (index, configKey) {
      // Create deferred object for configuration value fetch.
      var configDeferred = $.Deferred();

      // Fetch configuration value from service.
      // Adds the fetched value to the `configValues` object and resolves the promise.
      userConfigurationService.get({
        data: {
          userId: options.user_id,
          configurationKey: configKey
        },
        onSuccess: function onSuccess(response) {
          configValues[configKey] = response.configurationValue;
          configDeferred.resolve();
        },
        onError: function onError() {
          configDeferred.resolve();
        }
      });

      configDeferreds.push(configDeferred);
    });

    // If all requests for the configuration values has been processed
    // then the main promise will be resolved with all configuration values as given parameter.
    $.when.apply(null, configDeferreds).done(function () {
      deferred.resolve(configValues);
    });

    // Return deferred object.
    return deferred;
  };

  /**
   * Finds all dropdown elements.
   * Returns a deferred object with an element list object.
   * This function hides the dropdown elements.
   *
   * @return {jQuery.Deferred}
   * @private
   */
  var _findDropdownElements = function _findDropdownElements() {
    /**
     * Deferred object which will be returned.
     * @type {jQuery.Deferred}
     */
    var deferred = $.Deferred();

    /**
     * Elements with element and data attribute informations.
     * @example
     *      [{
     *          element: <div>,
     *          custom_caret_btn_class: 'btn-primary'
     *          configKey: 'orderMultiSelect'
     *      }]
     * @type {array}
     */
    var elements = [];

    /**
     * Array of data attributes for the dropdown elements which will be checked.
     * @type {array}
     */
    var dataAttributes = ['custom_caret_btn_class', 'config_key', 'config_value'];

    // Find dropdown elements when DOM is ready
    // and resolve promise passing found elements as parameter.
    $(document).ready(function () {
      $this.find(options.dropdown_selector).each(function (index, element) {
        /**
         * jQuery wrapped element shortcut.
         * @type {jQuery}
         */
        var $element = $(element);

        /**
         * Element info object.
         * Will be pushed to `elements` array.
         * @example
         *      {
         *          element: <div>,
         *          custom_caret_btn_class: 'btn-primary'
         *          configKey: 'orderMultiSelect'
         *      }
         * @type {object}
         */
        var elementObject = {};

        // Add element to element info object.
        elementObject.element = element;

        // Iterate over each data attribute key and check for data attribute existence.
        // If data-attribute exists, the key and value will be added to element info object.
        $.each(dataAttributes, function (index, attribute) {
          if (attribute in $element.data()) {
            elementObject[attribute] = $element.data(attribute);
          }
        });

        // Push this element info object to `elements` array.
        elements.push(elementObject);

        // Hide element
        $element.hide();
      });

      // Resolve the promise passing in the elements as argument.
      deferred.resolve(elements);
    });

    // Return deferred object.
    return deferred;
  };

  // ------------------------------------------------------------------------
  // PRIVATE METHODS - DROPDOWN TOGGLE
  // ------------------------------------------------------------------------

  /**
   * Shows dropdown action list.
   *
   * @param {HTMLElement} element Dropdown action list element.
   * @private
   */
  var _showDropdown = function _showDropdown(element) {
    // Perform fade in.
    $(element).stop().addClass('hover').fadeIn(options.fade);

    // Fix position.
    _repositionDropdown(element);
  };

  /**
   * Hides dropdown action list.
   *
   * @param {HTMLElement} element Dropdown action list element.
   * @private
   */
  var _hideDropdown = function _hideDropdown(element) {
    // Perform fade out.
    $(element).stop().removeClass('hover').fadeOut(options.fade);
  };

  /**
   * Fixes the dropdown action list to ensure that the action list is always visible.
   *
   * Sometimes when the button dropdown widget is near the window borders the list might
   * not be visible. This function will change its position in order to always be visible.
   *
   * @param {HTMLElement} element Dropdown action list element.
   * @private
   */
  var _repositionDropdown = function _repositionDropdown(element) {
    // Wrap element in jQuery and save shortcut to dropdown action list element.
    var $list = $(element);

    // Reference to button element.
    var $button = $list.closest(options.dropdown_selector);

    // Reset any possible CSS position modifications.
    $list.css({ left: '', top: '' });

    // Check dropdown position and perform reposition if needed.
    if ($list.offset().left + $list.width() > window.innerWidth) {
      var toMoveLeftPixels = $list.width() - $button.width();
      $list.css('margin-left', '-' + toMoveLeftPixels + 'px');
    }

    if ($list.offset().top + $list.height() > window.innerHeight) {
      var toMoveUpPixels = $list.height() + 10; // 10px fine-tuning
      $list.css('margin-top', '-' + toMoveUpPixels + 'px');
    }
  };

  // ------------------------------------------------------------------------
  // PRIVATE METHODS - EVENT HANDLERS
  // ------------------------------------------------------------------------

  /**
   * Handles click events on the main button (action button).
   * Performs main button action.
   *
   * @param {jQuery.Event} event
   * @private
   */
  var _mainButtonClickHandler = function _mainButtonClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    $(this).trigger('perform:action');
  };

  /**
   * Handles click events on the dropdown button (caret button).
   * Shows or hides the dropdown action list.
   *
   * @param {jQuery.Event} event
   * @private
   */
  var _caretButtonClickHandler = function _caretButtonClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    /**
     * Shortcut reference to dropdown action list element.
     * @type {jQuery}
     */
    var $list = $(this).siblings('ul');

    /**
     * Determines whether the dropdown action list is visible.
     * @type {boolean}
     */
    var listIsVisible = $list.hasClass('hover');

    // Hide or show dropdown, dependent on its visibility state.
    if (listIsVisible) {
      _hideDropdown($list);
    } else {
      _showDropdown($list);
    }
  };

  /**
   * Handles click events on the dropdown action list.
   * Hides the dropdown, saves the chosen value through
   * the user configuration service and perform the selected action.
   *
   * @param {jQuery.Event} event
   * @private
   */
  var _listItemClickHandler = function _listItemClickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    /**
     * Reference to `this` element, wrapped in jQuery.
     * @type {jQuery}
     */
    var $self = $(this);

    /**
     * Reference to dropdown action list element.
     * @type {jQuery}
     */
    var $list = $self.closest('ul');

    /**
     * Reference to button dropdown element.
     * @type {jQuery}
     */
    var $button = $self.closest(options.dropdown_selector);

    // Hide dropdown.
    _hideDropdown($list);

    // Save user configuration data.
    var configKey = $button.data('config_key'),
        configValue = $self.data('value');

    if (configKey && configValue) {
      _saveUserConfiguration(configKey, configValue);
    }

    // Perform action.
    $self.trigger('perform:action');
  };

  /**
   * Handles click events outside of the button area.
   * Hides multiple opened dropdowns.
   * @param {jQuery.Event} event
   * @private
   */
  var _outsideClickHandler = function _outsideClickHandler(event) {
    /**
     * Element shortcut to all opened dropdown action lists.
     * @type {jQuery}
     */
    var $list = $('ul.hover');

    // Hide all opened dropdowns.
    _hideDropdown($list);
  };

  // ------------------------------------------------------------------------
  // PRIVATE METHODS - CREATE WIDGETS
  // ------------------------------------------------------------------------

  /**
   * Adds the dropdown functionality to the buttons.
   *
   * Developers can manually add new `<li>` items to the list in order to display more options
   * to the users.
   *
   * This function fades the dropdown elements in.
   *
   * @param {array} elements List of elements infos object which contains the element itself and data attributes.
   * @param {object} configuration Object with fetched configuration key and values.
   *
   * @return {jQuery.Deferred}
   * @private
   */
  var _makeWidgets = function _makeWidgets(elements, configuration) {

    /**
     * Deferred object which will be returned.
     * @type {jQuery.Deferred}
     */
    var deferred = $.Deferred();

    /**
     * The secondary button which will toggle the list visibility.
     * @type {jQuery}
     */
    var $secondaryButton = $(caretButtonTemplate);

    // Iterate over each element and create dropdown widget.
    $.each(elements, function (index, elementObject) {
      /**
       * Button dropdown element.
       * @type {jQuery}
       */
      var $element = $(elementObject.element);

      /**
       * Button dropdown element's buttons.
       * @type {jQuery}
       */
      var $button = $element.find('button:first');

      /**
       * Cloned caret button template.
       * @type {jQuery}
       */
      var $caretButton = $secondaryButton.clone();

      // Add custom class to template, if defined.
      if (elementObject.custom_caret_btn_class) {
        $caretButton.addClass(elementObject.custom_caret_btn_class);
      }

      // Add CSS class to button and place the caret button.
      $button.addClass('btn').after($caretButton);

      // Add class to dropdown button element.
      $element.addClass('js-button-dropdown');

      // Add configuration value to container, if key and value exist.
      if (configuration && elementObject.config_key && configuration[elementObject.config_key] || elementObject.config_value) {
        var value = elementObject.config_value || configuration[elementObject.config_key];
        $element.attr(options.config_value_attribute, value);
      }

      // add disabled state if exists
      $button.prop('disabled', options.disabled_state);
      $caretButton.prop('disabled', options.disabled_state);

      // Attach event handler: Click on first button (main action button).
      $element.on('click', selectors.mainButton, _mainButtonClickHandler);

      // Attach event handler: Click on dropdown button (caret button).
      $element.on('click', selectors.caretButton, _caretButtonClickHandler);

      // Attach event handler: Click on dropdown action list item.
      $element.on('click', 'ul span, ul a', _listItemClickHandler);

      // Fade in element.
      $element.fadeIn(options.fade.duration, function () {
        $element.css('display', '');
      });
    });

    // Attach event handler: Close dropdown on outside click.
    $(document).on('click', _outsideClickHandler);

    // Resolve promise.
    deferred.resolve();

    // Return deferred object.
    return deferred;
  };

  // ------------------------------------------------------------------------
  // PRIVATE METHODS - SAVE USER CONFIGURATION
  // ------------------------------------------------------------------------

  /**
   * Saves a user configuration value.
   *
   * @param {string} key Configuration key.
   * @param {string} value Configuration value.
   * @private
   */
  var _saveUserConfiguration = function _saveUserConfiguration(key, value) {
    // Throw error if no complete data has been provided.
    if (!key || !value) {
      throw new Error('No configuration data passed');
    }

    // Save value to database via user configuration service.
    userConfigurationService.set({
      data: {
        userId: options.user_id,
        configurationKey: key,
        configurationValue: value
      }
    });
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  /**
   * Initialize method of the module, called by the engine.
   */
  module.init = function (done) {
    $.when(_findDropdownElements(), _loadConfigurations()).then(_makeWidgets).then(done);
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbl9kcm9wZG93bi5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwidXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlIiwianNlIiwibGlicyIsInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlIiwiY2FyZXRCdXR0b25UZW1wbGF0ZSIsImRlZmF1bHRzIiwiZmFkZSIsImR1cmF0aW9uIiwiZWFzaW5nIiwiZHJvcGRvd25fc2VsZWN0b3IiLCJjb25maWdfdmFsdWVfYXR0cmlidXRlIiwiZGlzYWJsZWRfc3RhdGUiLCJvcHRpb25zIiwiZXh0ZW5kIiwic2VsZWN0b3JzIiwiZWxlbWVudCIsIm1haW5CdXR0b24iLCJjYXJldEJ1dHRvbiIsImNvbmZpZ19rZXlzIiwic3BsaXQiLCJfbG9hZENvbmZpZ3VyYXRpb25zIiwiZGVmZXJyZWQiLCJEZWZlcnJlZCIsImNvbmZpZ0RlZmVycmVkcyIsImNvbmZpZ1ZhbHVlcyIsInVzZXJfaWQiLCJsZW5ndGgiLCJyZXNvbHZlIiwiZWFjaCIsImluZGV4IiwiY29uZmlnS2V5IiwiY29uZmlnRGVmZXJyZWQiLCJnZXQiLCJ1c2VySWQiLCJjb25maWd1cmF0aW9uS2V5Iiwib25TdWNjZXNzIiwicmVzcG9uc2UiLCJjb25maWd1cmF0aW9uVmFsdWUiLCJvbkVycm9yIiwicHVzaCIsIndoZW4iLCJhcHBseSIsImRvbmUiLCJfZmluZERyb3Bkb3duRWxlbWVudHMiLCJlbGVtZW50cyIsImRhdGFBdHRyaWJ1dGVzIiwiZG9jdW1lbnQiLCJyZWFkeSIsImZpbmQiLCIkZWxlbWVudCIsImVsZW1lbnRPYmplY3QiLCJhdHRyaWJ1dGUiLCJoaWRlIiwiX3Nob3dEcm9wZG93biIsInN0b3AiLCJhZGRDbGFzcyIsImZhZGVJbiIsIl9yZXBvc2l0aW9uRHJvcGRvd24iLCJfaGlkZURyb3Bkb3duIiwicmVtb3ZlQ2xhc3MiLCJmYWRlT3V0IiwiJGxpc3QiLCIkYnV0dG9uIiwiY2xvc2VzdCIsImNzcyIsImxlZnQiLCJ0b3AiLCJvZmZzZXQiLCJ3aWR0aCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJ0b01vdmVMZWZ0UGl4ZWxzIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJ0b01vdmVVcFBpeGVscyIsIl9tYWluQnV0dG9uQ2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInRyaWdnZXIiLCJfY2FyZXRCdXR0b25DbGlja0hhbmRsZXIiLCJzaWJsaW5ncyIsImxpc3RJc1Zpc2libGUiLCJoYXNDbGFzcyIsIl9saXN0SXRlbUNsaWNrSGFuZGxlciIsIiRzZWxmIiwiY29uZmlnVmFsdWUiLCJfc2F2ZVVzZXJDb25maWd1cmF0aW9uIiwiX291dHNpZGVDbGlja0hhbmRsZXIiLCJfbWFrZVdpZGdldHMiLCJjb25maWd1cmF0aW9uIiwiJHNlY29uZGFyeUJ1dHRvbiIsIiRjYXJldEJ1dHRvbiIsImNsb25lIiwiY3VzdG9tX2NhcmV0X2J0bl9jbGFzcyIsImFmdGVyIiwiY29uZmlnX2tleSIsImNvbmZpZ192YWx1ZSIsInZhbHVlIiwiYXR0ciIsInByb3AiLCJvbiIsImtleSIsIkVycm9yIiwic2V0IiwiaW5pdCIsInRoZW4iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1RUFBLEdBQUdDLE9BQUgsQ0FBV0MsTUFBWCxDQUNJLGlCQURKLEVBR0ksQ0FBQyw0QkFBRCxDQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7OztBQUlBQyxVQUFRQyxFQUFFLElBQUYsQ0FMWjs7O0FBT0k7Ozs7QUFJQUMsNkJBQTJCQyxJQUFJQyxJQUFKLENBQVNDLDBCQVh4Qzs7O0FBYUk7Ozs7QUFJQUMsd0JBQXNCLDZFQWpCMUI7OztBQW1CSTs7OztBQUlBQyxhQUFXO0FBQ1A7Ozs7QUFJQUMsVUFBTTtBQUNGQyxnQkFBVSxHQURSO0FBRUZDLGNBQVE7QUFGTixLQUxDOztBQVVQOzs7Ozs7QUFNQUMsdUJBQW1CLDRCQWhCWjs7QUFrQlA7Ozs7OztBQU1BQyw0QkFBd0IsMEJBeEJqQjs7QUEwQlA7Ozs7O0FBS0FDLG9CQUFnQjtBQS9CVCxHQXZCZjs7O0FBeURJOzs7O0FBSUFDLFlBQVViLEVBQUVjLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQlIsUUFBbkIsRUFBNkJSLElBQTdCLENBN0RkOzs7QUErREk7Ozs7QUFJQWlCLGNBQVk7QUFDUkMsYUFBU0gsUUFBUUgsaUJBRFQ7QUFFUk8sZ0JBQVkscUJBRko7QUFHUkMsaUJBQWE7QUFITCxHQW5FaEI7OztBQXlFSTs7OztBQUlBckIsV0FBUyxFQTdFYjs7QUErRUE7Ozs7QUFJQWdCLFVBQVFNLFdBQVIsR0FBc0JOLFFBQVFNLFdBQVIsR0FBc0JOLFFBQVFNLFdBQVIsQ0FBb0JDLEtBQXBCLENBQTBCLEdBQTFCLENBQXRCLEdBQXVELEVBQTdFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFRQSxNQUFJQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixHQUFZOztBQUVsQzs7OztBQUlBLFFBQUlDLFdBQVd0QixFQUFFdUIsUUFBRixFQUFmOztBQUVBOzs7Ozs7QUFNQSxRQUFJQyxrQkFBa0IsRUFBdEI7O0FBRUE7Ozs7Ozs7O0FBUUEsUUFBSUMsZUFBZSxFQUFuQjs7QUFFQTtBQUNBLFFBQUksQ0FBQ1osUUFBUWEsT0FBVCxJQUFvQixDQUFDYixRQUFRTSxXQUFSLENBQW9CUSxNQUE3QyxFQUFxRDtBQUNqRCxhQUFPTCxTQUFTTSxPQUFULENBQWlCLElBQWpCLENBQVA7QUFDSDs7QUFFRDtBQUNBNUIsTUFBRTZCLElBQUYsQ0FBT2hCLFFBQVFNLFdBQWYsRUFBNEIsVUFBVVcsS0FBVixFQUFpQkMsU0FBakIsRUFBNEI7QUFDcEQ7QUFDQSxVQUFJQyxpQkFBaUJoQyxFQUFFdUIsUUFBRixFQUFyQjs7QUFFQTtBQUNBO0FBQ0F0QiwrQkFBeUJnQyxHQUF6QixDQUE2QjtBQUN6Qm5DLGNBQU07QUFDRm9DLGtCQUFRckIsUUFBUWEsT0FEZDtBQUVGUyw0QkFBa0JKO0FBRmhCLFNBRG1CO0FBS3pCSyxtQkFBVyxtQkFBVUMsUUFBVixFQUFvQjtBQUMzQlosdUJBQWFNLFNBQWIsSUFBMEJNLFNBQVNDLGtCQUFuQztBQUNBTix5QkFBZUosT0FBZjtBQUNILFNBUndCO0FBU3pCVyxpQkFBUyxtQkFBWTtBQUNqQlAseUJBQWVKLE9BQWY7QUFDSDtBQVh3QixPQUE3Qjs7QUFjQUosc0JBQWdCZ0IsSUFBaEIsQ0FBcUJSLGNBQXJCO0FBQ0gsS0FyQkQ7O0FBdUJBO0FBQ0E7QUFDQWhDLE1BQUV5QyxJQUFGLENBQU9DLEtBQVAsQ0FBYSxJQUFiLEVBQW1CbEIsZUFBbkIsRUFBb0NtQixJQUFwQyxDQUF5QyxZQUFZO0FBQ2pEckIsZUFBU00sT0FBVCxDQUFpQkgsWUFBakI7QUFDSCxLQUZEOztBQUlBO0FBQ0EsV0FBT0gsUUFBUDtBQUNILEdBL0REOztBQWlFQTs7Ozs7Ozs7QUFRQSxNQUFJc0Isd0JBQXdCLFNBQXhCQSxxQkFBd0IsR0FBWTtBQUNwQzs7OztBQUlBLFFBQUl0QixXQUFXdEIsRUFBRXVCLFFBQUYsRUFBZjs7QUFFQTs7Ozs7Ozs7OztBQVVBLFFBQUlzQixXQUFXLEVBQWY7O0FBRUE7Ozs7QUFJQSxRQUFJQyxpQkFBaUIsQ0FBQyx3QkFBRCxFQUEyQixZQUEzQixFQUF5QyxjQUF6QyxDQUFyQjs7QUFFQTtBQUNBO0FBQ0E5QyxNQUFFK0MsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVk7QUFDMUJqRCxZQUFNa0QsSUFBTixDQUFXcEMsUUFBUUgsaUJBQW5CLEVBQXNDbUIsSUFBdEMsQ0FBMkMsVUFBVUMsS0FBVixFQUFpQmQsT0FBakIsRUFBMEI7QUFDakU7Ozs7QUFJQSxZQUFJa0MsV0FBV2xELEVBQUVnQixPQUFGLENBQWY7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsWUFBSW1DLGdCQUFnQixFQUFwQjs7QUFFQTtBQUNBQSxzQkFBY25DLE9BQWQsR0FBd0JBLE9BQXhCOztBQUVBO0FBQ0E7QUFDQWhCLFVBQUU2QixJQUFGLENBQU9pQixjQUFQLEVBQXVCLFVBQVVoQixLQUFWLEVBQWlCc0IsU0FBakIsRUFBNEI7QUFDL0MsY0FBSUEsYUFBYUYsU0FBU3BELElBQVQsRUFBakIsRUFBa0M7QUFDOUJxRCwwQkFBY0MsU0FBZCxJQUEyQkYsU0FBU3BELElBQVQsQ0FBY3NELFNBQWQsQ0FBM0I7QUFDSDtBQUNKLFNBSkQ7O0FBTUE7QUFDQVAsaUJBQVNMLElBQVQsQ0FBY1csYUFBZDs7QUFFQTtBQUNBRCxpQkFBU0csSUFBVDtBQUNILE9BcENEOztBQXNDQTtBQUNBL0IsZUFBU00sT0FBVCxDQUFpQmlCLFFBQWpCO0FBQ0gsS0F6Q0Q7O0FBMkNBO0FBQ0EsV0FBT3ZCLFFBQVA7QUFDSCxHQXhFRDs7QUEwRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQSxNQUFJZ0MsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFVdEMsT0FBVixFQUFtQjtBQUNuQztBQUNBaEIsTUFBRWdCLE9BQUYsRUFDS3VDLElBREwsR0FFS0MsUUFGTCxDQUVjLE9BRmQsRUFHS0MsTUFITCxDQUdZNUMsUUFBUU4sSUFIcEI7O0FBS0E7QUFDQW1ELHdCQUFvQjFDLE9BQXBCO0FBQ0gsR0FURDs7QUFXQTs7Ozs7O0FBTUEsTUFBSTJDLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVTNDLE9BQVYsRUFBbUI7QUFDbkM7QUFDQWhCLE1BQUVnQixPQUFGLEVBQ0t1QyxJQURMLEdBRUtLLFdBRkwsQ0FFaUIsT0FGakIsRUFHS0MsT0FITCxDQUdhaEQsUUFBUU4sSUFIckI7QUFJSCxHQU5EOztBQVFBOzs7Ozs7Ozs7QUFTQSxNQUFJbUQsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBVTFDLE9BQVYsRUFBbUI7QUFDekM7QUFDQSxRQUFJOEMsUUFBUTlELEVBQUVnQixPQUFGLENBQVo7O0FBRUE7QUFDQSxRQUFJK0MsVUFBVUQsTUFBTUUsT0FBTixDQUFjbkQsUUFBUUgsaUJBQXRCLENBQWQ7O0FBRUE7QUFDQW9ELFVBQU1HLEdBQU4sQ0FBVSxFQUFDQyxNQUFNLEVBQVAsRUFBV0MsS0FBSyxFQUFoQixFQUFWOztBQUVBO0FBQ0EsUUFBSUwsTUFBTU0sTUFBTixHQUFlRixJQUFmLEdBQXNCSixNQUFNTyxLQUFOLEVBQXRCLEdBQXNDQyxPQUFPQyxVQUFqRCxFQUE2RDtBQUN6RCxVQUFJQyxtQkFBbUJWLE1BQU1PLEtBQU4sS0FBZ0JOLFFBQVFNLEtBQVIsRUFBdkM7QUFDQVAsWUFBTUcsR0FBTixDQUFVLGFBQVYsRUFBeUIsTUFBT08sZ0JBQVAsR0FBMkIsSUFBcEQ7QUFDSDs7QUFFRCxRQUFJVixNQUFNTSxNQUFOLEdBQWVELEdBQWYsR0FBcUJMLE1BQU1XLE1BQU4sRUFBckIsR0FBc0NILE9BQU9JLFdBQWpELEVBQThEO0FBQzFELFVBQUlDLGlCQUFpQmIsTUFBTVcsTUFBTixLQUFpQixFQUF0QyxDQUQwRCxDQUNoQjtBQUMxQ1gsWUFBTUcsR0FBTixDQUFVLFlBQVYsRUFBd0IsTUFBT1UsY0FBUCxHQUF5QixJQUFqRDtBQUNIO0FBQ0osR0FwQkQ7O0FBc0JBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQU9BLE1BQUlDLDBCQUEwQixTQUExQkEsdUJBQTBCLENBQVVDLEtBQVYsRUFBaUI7QUFDM0NBLFVBQU1DLGNBQU47QUFDQUQsVUFBTUUsZUFBTjs7QUFFQS9FLE1BQUUsSUFBRixFQUFRZ0YsT0FBUixDQUFnQixnQkFBaEI7QUFDSCxHQUxEOztBQU9BOzs7Ozs7O0FBT0EsTUFBSUMsMkJBQTJCLFNBQTNCQSx3QkFBMkIsQ0FBVUosS0FBVixFQUFpQjtBQUM1Q0EsVUFBTUMsY0FBTjtBQUNBRCxVQUFNRSxlQUFOOztBQUVBOzs7O0FBSUEsUUFBSWpCLFFBQVE5RCxFQUFFLElBQUYsRUFBUWtGLFFBQVIsQ0FBaUIsSUFBakIsQ0FBWjs7QUFFQTs7OztBQUlBLFFBQUlDLGdCQUFnQnJCLE1BQU1zQixRQUFOLENBQWUsT0FBZixDQUFwQjs7QUFFQTtBQUNBLFFBQUlELGFBQUosRUFBbUI7QUFDZnhCLG9CQUFjRyxLQUFkO0FBQ0gsS0FGRCxNQUVPO0FBQ0hSLG9CQUFjUSxLQUFkO0FBQ0g7QUFDSixHQXRCRDs7QUF3QkE7Ozs7Ozs7O0FBUUEsTUFBSXVCLHdCQUF3QixTQUF4QkEscUJBQXdCLENBQVVSLEtBQVYsRUFBaUI7QUFDekNBLFVBQU1DLGNBQU47QUFDQUQsVUFBTUUsZUFBTjs7QUFFQTs7OztBQUlBLFFBQUlPLFFBQVF0RixFQUFFLElBQUYsQ0FBWjs7QUFFQTs7OztBQUlBLFFBQUk4RCxRQUFRd0IsTUFBTXRCLE9BQU4sQ0FBYyxJQUFkLENBQVo7O0FBRUE7Ozs7QUFJQSxRQUFJRCxVQUFVdUIsTUFBTXRCLE9BQU4sQ0FBY25ELFFBQVFILGlCQUF0QixDQUFkOztBQUVBO0FBQ0FpRCxrQkFBY0csS0FBZDs7QUFFQTtBQUNBLFFBQUkvQixZQUFZZ0MsUUFBUWpFLElBQVIsQ0FBYSxZQUFiLENBQWhCO0FBQUEsUUFDSXlGLGNBQWNELE1BQU14RixJQUFOLENBQVcsT0FBWCxDQURsQjs7QUFHQSxRQUFJaUMsYUFBYXdELFdBQWpCLEVBQThCO0FBQzFCQyw2QkFBdUJ6RCxTQUF2QixFQUFrQ3dELFdBQWxDO0FBQ0g7O0FBRUQ7QUFDQUQsVUFBTU4sT0FBTixDQUFjLGdCQUFkO0FBQ0gsR0FuQ0Q7O0FBcUNBOzs7Ozs7QUFNQSxNQUFJUyx1QkFBdUIsU0FBdkJBLG9CQUF1QixDQUFVWixLQUFWLEVBQWlCO0FBQ3hDOzs7O0FBSUEsUUFBSWYsUUFBUTlELEVBQUUsVUFBRixDQUFaOztBQUVBO0FBQ0EyRCxrQkFBY0csS0FBZDtBQUNILEdBVEQ7O0FBV0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7OztBQWNBLE1BQUk0QixlQUFlLFNBQWZBLFlBQWUsQ0FBVTdDLFFBQVYsRUFBb0I4QyxhQUFwQixFQUFtQzs7QUFFbEQ7Ozs7QUFJQSxRQUFJckUsV0FBV3RCLEVBQUV1QixRQUFGLEVBQWY7O0FBRUE7Ozs7QUFJQSxRQUFJcUUsbUJBQW1CNUYsRUFBRUssbUJBQUYsQ0FBdkI7O0FBRUE7QUFDQUwsTUFBRTZCLElBQUYsQ0FBT2dCLFFBQVAsRUFBaUIsVUFBVWYsS0FBVixFQUFpQnFCLGFBQWpCLEVBQWdDO0FBQzdDOzs7O0FBSUEsVUFBSUQsV0FBV2xELEVBQUVtRCxjQUFjbkMsT0FBaEIsQ0FBZjs7QUFFQTs7OztBQUlBLFVBQUkrQyxVQUFVYixTQUFTRCxJQUFULENBQWMsY0FBZCxDQUFkOztBQUVBOzs7O0FBSUEsVUFBSTRDLGVBQWVELGlCQUFpQkUsS0FBakIsRUFBbkI7O0FBRUE7QUFDQSxVQUFJM0MsY0FBYzRDLHNCQUFsQixFQUEwQztBQUN0Q0YscUJBQWFyQyxRQUFiLENBQXNCTCxjQUFjNEMsc0JBQXBDO0FBQ0g7O0FBRUQ7QUFDQWhDLGNBQ0tQLFFBREwsQ0FDYyxLQURkLEVBRUt3QyxLQUZMLENBRVdILFlBRlg7O0FBSUE7QUFDQTNDLGVBQ0tNLFFBREwsQ0FDYyxvQkFEZDs7QUFHQTtBQUNBLFVBQUltQyxpQkFBaUJ4QyxjQUFjOEMsVUFBL0IsSUFBNkNOLGNBQWN4QyxjQUFjOEMsVUFBNUIsQ0FBN0MsSUFBd0Y5QyxjQUFjK0MsWUFBMUcsRUFBd0g7QUFDcEgsWUFBSUMsUUFBUWhELGNBQWMrQyxZQUFkLElBQThCUCxjQUFjeEMsY0FBYzhDLFVBQTVCLENBQTFDO0FBQ0EvQyxpQkFBU2tELElBQVQsQ0FBY3ZGLFFBQVFGLHNCQUF0QixFQUE4Q3dGLEtBQTlDO0FBQ0g7O0FBRUQ7QUFDQXBDLGNBQVFzQyxJQUFSLENBQWEsVUFBYixFQUF5QnhGLFFBQVFELGNBQWpDO0FBQ0FpRixtQkFBYVEsSUFBYixDQUFrQixVQUFsQixFQUE4QnhGLFFBQVFELGNBQXRDOztBQUVBO0FBQ0FzQyxlQUFTb0QsRUFBVCxDQUFZLE9BQVosRUFBcUJ2RixVQUFVRSxVQUEvQixFQUEyQzJELHVCQUEzQzs7QUFFQTtBQUNBMUIsZUFBU29ELEVBQVQsQ0FBWSxPQUFaLEVBQXFCdkYsVUFBVUcsV0FBL0IsRUFBNEMrRCx3QkFBNUM7O0FBRUE7QUFDQS9CLGVBQVNvRCxFQUFULENBQVksT0FBWixFQUFxQixlQUFyQixFQUFzQ2pCLHFCQUF0Qzs7QUFFQTtBQUNBbkMsZUFBU08sTUFBVCxDQUFnQjVDLFFBQVFOLElBQVIsQ0FBYUMsUUFBN0IsRUFBdUMsWUFBWTtBQUMvQzBDLGlCQUFTZSxHQUFULENBQWEsU0FBYixFQUF3QixFQUF4QjtBQUNILE9BRkQ7QUFHSCxLQXhERDs7QUEwREE7QUFDQWpFLE1BQUUrQyxRQUFGLEVBQVl1RCxFQUFaLENBQWUsT0FBZixFQUF3QmIsb0JBQXhCOztBQUVBO0FBQ0FuRSxhQUFTTSxPQUFUOztBQUVBO0FBQ0EsV0FBT04sUUFBUDtBQUNILEdBakZEOztBQW1GQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQSxNQUFJa0UseUJBQXlCLFNBQXpCQSxzQkFBeUIsQ0FBVWUsR0FBVixFQUFlSixLQUFmLEVBQXNCO0FBQy9DO0FBQ0EsUUFBSSxDQUFDSSxHQUFELElBQVEsQ0FBQ0osS0FBYixFQUFvQjtBQUNoQixZQUFNLElBQUlLLEtBQUosQ0FBVSw4QkFBVixDQUFOO0FBQ0g7O0FBRUQ7QUFDQXZHLDZCQUF5QndHLEdBQXpCLENBQTZCO0FBQ3pCM0csWUFBTTtBQUNGb0MsZ0JBQVFyQixRQUFRYSxPQURkO0FBRUZTLDBCQUFrQm9FLEdBRmhCO0FBR0ZqRSw0QkFBb0I2RDtBQUhsQjtBQURtQixLQUE3QjtBQU9ILEdBZEQ7O0FBZ0JBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0F0RyxTQUFPNkcsSUFBUCxHQUFjLFVBQVUvRCxJQUFWLEVBQWdCO0FBQzFCM0MsTUFBRXlDLElBQUYsQ0FBT0csdUJBQVAsRUFBZ0N2QixxQkFBaEMsRUFDS3NGLElBREwsQ0FDVWpCLFlBRFYsRUFFS2lCLElBRkwsQ0FFVWhFLElBRlY7QUFHSCxHQUpEOztBQU1BO0FBQ0EsU0FBTzlDLE1BQVA7QUFDSCxDQWprQkwiLCJmaWxlIjoiYnV0dG9uX2Ryb3Bkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBidXR0b25fZHJvcGRvd24uanMgMjAxNi0wNy0xNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQnV0dG9uIERyb3Bkb3duIFdpZGdldFxuICpcbiAqIEFkZHMgdGhlIGRyb3Bkb3duIGZ1bmN0aW9uYWxpdHkgdG8gbXVsdGlwbGUgZWxlbWVudHMgaW5zaWRlIGEgcGFyZW50IGNvbnRhaW5lci4gWW91IGNhbiBhZGQgbmV3IEhUTUxcbiAqIG9wdGlvbnMgdG8gZWFjaCBkcm9wZG93biBpbnN0YW5jZSBtYW51YWxseSBvciBkeW5hbWljYWxseSB0aHJvdWdoIHRoZSBBZG1pbi9MaWJzL2J1dHRvbl9kcm9wZG93biBsaWJyYXJ5LlxuICpcbiAqIE9wdGlvbmFsbHksIHRoZSB3aWRnZXQgaGFzIGFsc28gdGhlIGFiaWxpdHkgdG8gc3RvcmUgdGhlIGxhc3QgY2xpY2tlZCBvcHRpb24gYW5kIGRpc3BsYXkgaXQgYXMgdGhlIGRlZmF1bHRcbiAqIGFjdGlvbiB0aGUgbmV4dCB0aW1lIHRoZSBwYWdlIGlzIGxvYWRlZC4gVGhpcyBpcyB2ZXJ5IHVzZWZ1bCB3aGVuZXZlciB0aGVyZSBhcmUgbWFueSBvcHRpb25zIGluc2lkZSB0aGVcbiAqIGRyb3Bkb3duIGxpc3QuXG4gKlxuICogIyMjIFBhcmVudCBDb250YWluZXIgT3B0aW9uc1xuICpcbiAqICoqQ29uZmlndXJhdGlvbiBLZXlzIHwgYGRhdGEtYnV0dG9uX2Ryb3Bkb3duLWNvbmZpZ19rZXlzYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgdW5pcXVlIGtleSB3aGljaCB3aWxsIGJlIHVzZWQgdG8gc3RvcmUgdGhlIGxhdGVzdCB1c2VyIHNlbGVjdGlvbi4gUHJlZmVyIHRvIHByZWZpeCB5b3VyIGNvbmZpZyBrZXlcbiAqIGluIG9yZGVyIHRvIGF2b2lkIGNvbGxpc2lvbnMgd2l0aCBvdGhlciBpbnN0YW5jZXMgb2YgdGhlIHdpZGdldC5cbiAqXG4gKiAqKlVzZXIgSUQgfCBgZGF0YS1idXR0b25fZHJvcGRvd24tdXNlcl9pZGAgfCBOdW1iZXIgfCBPcHRpb25hbCoqXG4gKlxuICogR2l2ZSB0aGUgY3VycmVudCB1c2VyIGRhdGFiYXNlIElEIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGFzc29jaWF0ZSBoaXMgbGF0ZXN0IHNlbGVjdGlvbiB3aXRoIHRoZSBjb3JyZXNwb25kaW5nXG4gKiBidXR0b24gZHJvcGRvd24gd2lkZ2V0LlxuICpcbiAqICMjIyBXaWRnZXQgSW5zdGFuY2UgT3B0aW9uc1xuICpcbiAqICoqVXNlIEJ1dHRvbiBEcm9wZG93biB8IGBkYXRhLXVzZS1idXR0b25fZHJvcGRvd25gIHwgQm9vbGVhbiB8IFJlcXVpcmVkKipcbiAqXG4gKiBUaGlzIG9wdGlvbi1mbGFnIHdpbGwgbWFyayB0aGUgZWxlbWVudHMgaW5zaWRlIHRoZSBwYXJlbnQgY29udGFpbmVyLCB0aGF0IHdpbGwgYmUgY29udmVydGVkIGludG9cbiAqIGJ1dHRvbi1kcm9wZG93biB3aWRnZXRzLlxuICpcbiAqICoqQ29uZmlndXJhdGlvbiBLZXkgfCBgZGF0YS1jb25maWdfa2V5YCB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBQcm92aWRlIHRoZSBjb25maWd1cmF0aW9uIGtleSBmb3IgdGhlIHNpbmdsZSBidXR0b24tZHJvcGRvd24gaW5zdGFuY2UuXG4gKlxuICogKipDb25maWd1cmF0aW9uIFZhbHVlIHwgYGRhdGEtY29uZmlnX2tleWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBkaXJlY3RseSB0aGUgY29uZmlndXJhdGlvbiB2YWx1ZSBpbiBvcmRlciB0byBhdm9pZCBleHRyYSBBSkFYIHJlcXVlc3RzLlxuICpcbiAqICoqQ3VzdG9tIENhcmV0IEJ1dHRvbiBDbGFzcyB8IGBkYXRhLWN1c3RvbV9jYXJldF9idG5fY2xhc3NgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIEF0dGFjaCBhZGRpdGlvbmFsIGNsYXNzZXMgdG8gdGhlIGNhcmV0IGJ1dHRvbiBlbGVtZW50ICh0aGUgb25lIHdpdGggdGhlIGFycm93KS4gVXNlIHRoaXMgb3B0aW9uIGlmIHlvdVxuICogd2FudCB0byBhZGQgYSBjbGFzcyB0aGF0IHRoZSBwcmltYXJ5IGJ1dHRvbiBhbHJlYWR5IGhhcyBzbyB0aGF0IGJvdGggc2hhcmUgdGhlIHNhbWUgc3R5bGUgKGUuZy4gYnRuLXByaW1hcnkpLlxuICpcbiAqIENoYW5nZSBidXR0b25zIGRpc2FibGUgYXR0cmlidXRlIHZhbHVlIGJ5IGFkZGluZyBvcHRpb24gYGRhdGEtYnV0dG9uX2Ryb3Bkb3duLWRpc2FibGVkX3N0YXRlYCBvbiBwYXJlbnQgZWxlbWVudFxuICpcbiAqICMjIyBFeGFtcGxlXG4gKiBgYGBodG1sXG4gKiA8IS0tIFRoaXMgZWxlbWVudCByZXByZXNlbnRzIHRoZSBwYXJlbnQgY29udGFpbmVyLiAtLT5cbiAqIDxkaXZcbiAqICAgZGF0YS1neC13aWRnZXQ9XCJidXR0b25fZHJvcGRvd25cIlxuICogICBkYXRhLWJ1dHRvbl9kcm9wZG93bi1jb25maWdfa2V5cz1cIm9yZGVyLXNpbmdsZSBvcmRlci1tdWx0aVwiXG4gKiAgIGRhdGEtYnV0dG9uX2Ryb3Bkb3duLXVzZXJfaWQ9XCIyXCI+XG4gKlxuICogICA8IS0tIFRoaXMgZWxlbWVudCByZXByZXNlbnRzIHRoZSBidXR0b24gZHJvcGRvd24gd2lkZ2V0LiAtLT5cbiAqICAgPGRpdlxuICogICAgICAgZGF0YS11c2UtYnV0dG9uX2Ryb3Bkb3duPVwidHJ1ZVwiXG4gKiAgICAgICBkYXRhLWNvbmZpZ19rZXk9XCJvcmRlci1zaW5nbGVcIlxuICogICAgICAgZGF0YS1jdXN0b21fY2FyZXRfYnRuX2NsYXNzPVwiY2xhc3MxXCI+XG4gKiAgICAgPGJ1dHRvbj5QcmltYXJ5IEJ1dHRvbjwvYnV0dG9uPlxuICogICAgIDx1bD5cbiAqICAgICAgIDxsaT48c3Bhbj5DaGFuZ2Ugc3RhdHVzPC9zcGFuPjwvbGk+XG4gKiAgICAgICA8bGk+PHNwYW4+RGVsZXRlPC9zcGFuPjwvbGk+XG4gKiAgICAgPC91bD5cbiAqICAgPC9kaXY+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqICoqTm90aWNlOioqIFRoaXMgd2lkZ2V0IHdhcyBidWlsdCBmb3IgdXNhZ2UgaW4gY29tcGF0aWJpbGl0eSBtb2RlLiBUaGUgbmV3IGFkbWluIHBhZ2VzIHVzZSB0aGUgQm9vdHN0cmFwXG4gKiBidXR0b24gZHJvcGRvd24gbWFya3VwIHdoaWNoIGFscmVhZHkgZnVuY3Rpb25zIGxpa2UgdGhpcyBtb2R1bGUuIERvIG5vdCB1c2UgaXQgb24gbmV3IGFkbWluIHBhZ2VzLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9idXR0b25fZHJvcGRvd25cbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2J1dHRvbl9kcm9wZG93bicsXG5cbiAgICBbJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJ10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFVzZXJDb25maWd1cmF0aW9uU2VydmljZSBhbGlhcy5cbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVzZXJDb25maWd1cmF0aW9uU2VydmljZSA9IGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENhcmV0IGJ1dHRvbiB0ZW1wbGF0ZS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNhcmV0QnV0dG9uVGVtcGxhdGUgPSAnPGJ1dHRvbiBjbGFzcz1cImJ0blwiIHR5cGU9XCJidXR0b25cIj48aSBjbGFzcz1cImZhIGZhLWNhcmV0LWRvd25cIj48L2k+PC9idXR0b24+JyxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBGYWRlIGFuaW1hdGlvbiBvcHRpb25zLlxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZmFkZToge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwLFxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6ICdzd2luZydcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogU3RyaW5nIGZvciBkcm9wZG93biBzZWxlY3Rvci5cbiAgICAgICAgICAgICAgICAgKiBUaGlzIHNlbGVjdG9yIGlzIHVzZWQgdG8gZmluZCBhbmQgYWN0aXZhdGUgYWxsIGJ1dHRvbiBkcm9wZG93bnMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duX3NlbGVjdG9yOiAnW2RhdGEtdXNlLWJ1dHRvbl9kcm9wZG93bl0nLFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQXR0cmlidXRlIHdoaWNoIHJlcHJlc2VudHMgdGhlIHVzZXIgY29uZmlndXJhdGlvbiB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgKiBUaGUgdmFsdWUgb2YgdGhpcyBhdHRyaWJ1dGUgd2lsbCBiZSBzZXQuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNvbmZpZ192YWx1ZV9hdHRyaWJ1dGU6ICdkYXRhLWNvbmZpZ3VyYXRpb25fdmFsdWUnLFxuICAgIFxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFVzZWQgdG8gZGlzYWJsZSBidXR0b25zIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHR5cGUge2Jvb2x9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRfc3RhdGU6IGZhbHNlXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbGVtZW50IHNlbGVjdG9yIHNob3J0Y3V0cy5cbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHNlbGVjdG9ycyA9IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50OiBvcHRpb25zLmRyb3Bkb3duX3NlbGVjdG9yLFxuICAgICAgICAgICAgICAgIG1haW5CdXR0b246ICdidXR0b246bnRoLWNoaWxkKDEpJyxcbiAgICAgICAgICAgICAgICBjYXJldEJ1dHRvbjogJ2J1dHRvbjpudGgtY2hpbGQoMiknXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTcGxpdCBzcGFjZS1zZXBhcmF0ZWQgZW50cmllcyB0byBhcnJheSB2YWx1ZXMuXG4gICAgICAgICAqIEB0eXBlIHthcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIG9wdGlvbnMuY29uZmlnX2tleXMgPSBvcHRpb25zLmNvbmZpZ19rZXlzID8gb3B0aW9ucy5jb25maWdfa2V5cy5zcGxpdCgnICcpIDogW107XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EUyAtIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMb2FkcyB0aGUgdXNlciBjb25maWd1cmF0aW9uIHZhbHVlcyBmb3IgZWFjaCBwcm92aWRlZCBrZXkuXG4gICAgICAgICAqIFJldHVybnMgYSBEZWZlcnJlZCBvYmplY3Qgd2l0aCBhbiBvYmplY3Qgd2l0aCBjb25maWd1cmF0aW9uXG4gICAgICAgICAqIGFzIGtleSBhbmQgcmVzcGVjdGl2ZSB2YWx1ZXMgb3IgbnVsbCBpZiBubyByZXF1ZXN0IGNvbmRpdGlvbnMgYXJlIHNldC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2pRdWVyeS5EZWZlcnJlZH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbG9hZENvbmZpZ3VyYXRpb25zID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1haW4gZGVmZXJyZWQgb2JqZWN0IHdoaWNoIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5LkRlZmVycmVkfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGhpcyBhcnJheSB3aWxsIGNvbnRhaW4gYWxsIGRlZmVycmVkIGFqYXggcmVxdWVzdCB0byB0aGUgdXNlciBjb25maWd1cmF0aW9uIHNlcnZpY2UuXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogICAgICBbRGVmZXJyZWQsIERlZmVycmVkXVxuICAgICAgICAgICAgICogQHR5cGUge2FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgY29uZmlnRGVmZXJyZWRzID0gW107XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXNlciBjb25maWd1cmF0aW9uIGtleSBhbmQgdmFsdWVzIHN0b3JhZ2UuXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogICAgICB7XG4gICAgICAgICAgICAgKiAgICAgICAgICBjb25maWdLZXk6ICdjb25maWdWYWx1ZSdcbiAgICAgICAgICAgICAqICAgICAgfVxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGNvbmZpZ1ZhbHVlcyA9IHt9O1xuXG4gICAgICAgICAgICAvLyBSZXR1cm4gaW1tZWRpYXRlbHkgaWYgdGhlIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlIGlzIG5vdCBuZWVkZWQuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMudXNlcl9pZCB8fCAhb3B0aW9ucy5jb25maWdfa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggY29uZmlndXJhdGlvbiB2YWx1ZSBwcm92aWRlZCBpbiB0aGUgZWxlbWVudFxuICAgICAgICAgICAgJC5lYWNoKG9wdGlvbnMuY29uZmlnX2tleXMsIGZ1bmN0aW9uIChpbmRleCwgY29uZmlnS2V5KSB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmVycmVkIG9iamVjdCBmb3IgY29uZmlndXJhdGlvbiB2YWx1ZSBmZXRjaC5cbiAgICAgICAgICAgICAgICB2YXIgY29uZmlnRGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBGZXRjaCBjb25maWd1cmF0aW9uIHZhbHVlIGZyb20gc2VydmljZS5cbiAgICAgICAgICAgICAgICAvLyBBZGRzIHRoZSBmZXRjaGVkIHZhbHVlIHRvIHRoZSBgY29uZmlnVmFsdWVzYCBvYmplY3QgYW5kIHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICAgICAgICAgICAgICAgIHVzZXJDb25maWd1cmF0aW9uU2VydmljZS5nZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG9wdGlvbnMudXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25LZXk6IGNvbmZpZ0tleVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvblN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnVmFsdWVzW2NvbmZpZ0tleV0gPSByZXNwb25zZS5jb25maWd1cmF0aW9uVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWdEZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ0RlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY29uZmlnRGVmZXJyZWRzLnB1c2goY29uZmlnRGVmZXJyZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIElmIGFsbCByZXF1ZXN0cyBmb3IgdGhlIGNvbmZpZ3VyYXRpb24gdmFsdWVzIGhhcyBiZWVuIHByb2Nlc3NlZFxuICAgICAgICAgICAgLy8gdGhlbiB0aGUgbWFpbiBwcm9taXNlIHdpbGwgYmUgcmVzb2x2ZWQgd2l0aCBhbGwgY29uZmlndXJhdGlvbiB2YWx1ZXMgYXMgZ2l2ZW4gcGFyYW1ldGVyLlxuICAgICAgICAgICAgJC53aGVuLmFwcGx5KG51bGwsIGNvbmZpZ0RlZmVycmVkcykuZG9uZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShjb25maWdWYWx1ZXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBkZWZlcnJlZCBvYmplY3QuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmRzIGFsbCBkcm9wZG93biBlbGVtZW50cy5cbiAgICAgICAgICogUmV0dXJucyBhIGRlZmVycmVkIG9iamVjdCB3aXRoIGFuIGVsZW1lbnQgbGlzdCBvYmplY3QuXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gaGlkZXMgdGhlIGRyb3Bkb3duIGVsZW1lbnRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnkuRGVmZXJyZWR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2ZpbmREcm9wZG93bkVsZW1lbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZlcnJlZCBvYmplY3Qgd2hpY2ggd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnkuRGVmZXJyZWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFbGVtZW50cyB3aXRoIGVsZW1lbnQgYW5kIGRhdGEgYXR0cmlidXRlIGluZm9ybWF0aW9ucy5cbiAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgKiAgICAgIFt7XG4gICAgICAgICAgICAgKiAgICAgICAgICBlbGVtZW50OiA8ZGl2PixcbiAgICAgICAgICAgICAqICAgICAgICAgIGN1c3RvbV9jYXJldF9idG5fY2xhc3M6ICdidG4tcHJpbWFyeSdcbiAgICAgICAgICAgICAqICAgICAgICAgIGNvbmZpZ0tleTogJ29yZGVyTXVsdGlTZWxlY3QnXG4gICAgICAgICAgICAgKiAgICAgIH1dXG4gICAgICAgICAgICAgKiBAdHlwZSB7YXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEFycmF5IG9mIGRhdGEgYXR0cmlidXRlcyBmb3IgdGhlIGRyb3Bkb3duIGVsZW1lbnRzIHdoaWNoIHdpbGwgYmUgY2hlY2tlZC5cbiAgICAgICAgICAgICAqIEB0eXBlIHthcnJheX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyIGRhdGFBdHRyaWJ1dGVzID0gWydjdXN0b21fY2FyZXRfYnRuX2NsYXNzJywgJ2NvbmZpZ19rZXknLCAnY29uZmlnX3ZhbHVlJ107XG5cbiAgICAgICAgICAgIC8vIEZpbmQgZHJvcGRvd24gZWxlbWVudHMgd2hlbiBET00gaXMgcmVhZHlcbiAgICAgICAgICAgIC8vIGFuZCByZXNvbHZlIHByb21pc2UgcGFzc2luZyBmb3VuZCBlbGVtZW50cyBhcyBwYXJhbWV0ZXIuXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZChvcHRpb25zLmRyb3Bkb3duX3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogalF1ZXJ5IHdyYXBwZWQgZWxlbWVudCBzaG9ydGN1dC5cbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIEVsZW1lbnQgaW5mbyBvYmplY3QuXG4gICAgICAgICAgICAgICAgICAgICAqIFdpbGwgYmUgcHVzaGVkIHRvIGBlbGVtZW50c2AgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgICAgICAgICAgICAqICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgICBlbGVtZW50OiA8ZGl2PixcbiAgICAgICAgICAgICAgICAgICAgICogICAgICAgICAgY3VzdG9tX2NhcmV0X2J0bl9jbGFzczogJ2J0bi1wcmltYXJ5J1xuICAgICAgICAgICAgICAgICAgICAgKiAgICAgICAgICBjb25maWdLZXk6ICdvcmRlck11bHRpU2VsZWN0J1xuICAgICAgICAgICAgICAgICAgICAgKiAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50T2JqZWN0ID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGVsZW1lbnQgdG8gZWxlbWVudCBpbmZvIG9iamVjdC5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudE9iamVjdC5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBkYXRhIGF0dHJpYnV0ZSBrZXkgYW5kIGNoZWNrIGZvciBkYXRhIGF0dHJpYnV0ZSBleGlzdGVuY2UuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGRhdGEtYXR0cmlidXRlIGV4aXN0cywgdGhlIGtleSBhbmQgdmFsdWUgd2lsbCBiZSBhZGRlZCB0byBlbGVtZW50IGluZm8gb2JqZWN0LlxuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZGF0YUF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpbmRleCwgYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlIGluICRlbGVtZW50LmRhdGEoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRPYmplY3RbYXR0cmlidXRlXSA9ICRlbGVtZW50LmRhdGEoYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUHVzaCB0aGlzIGVsZW1lbnQgaW5mbyBvYmplY3QgdG8gYGVsZW1lbnRzYCBhcnJheS5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaChlbGVtZW50T2JqZWN0KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBIaWRlIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzb2x2ZSB0aGUgcHJvbWlzZSBwYXNzaW5nIGluIHRoZSBlbGVtZW50cyBhcyBhcmd1bWVudC5cbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGVsZW1lbnRzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBSZXR1cm4gZGVmZXJyZWQgb2JqZWN0LlxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFMgLSBEUk9QRE9XTiBUT0dHTEVcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIGRyb3Bkb3duIGFjdGlvbiBsaXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IERyb3Bkb3duIGFjdGlvbiBsaXN0IGVsZW1lbnQuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Nob3dEcm9wZG93biA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIGZhZGUgaW4uXG4gICAgICAgICAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgLnN0b3AoKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaG92ZXInKVxuICAgICAgICAgICAgICAgIC5mYWRlSW4ob3B0aW9ucy5mYWRlKTtcblxuICAgICAgICAgICAgLy8gRml4IHBvc2l0aW9uLlxuICAgICAgICAgICAgX3JlcG9zaXRpb25Ecm9wZG93bihlbGVtZW50KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGlkZXMgZHJvcGRvd24gYWN0aW9uIGxpc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgRHJvcGRvd24gYWN0aW9uIGxpc3QgZWxlbWVudC5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfaGlkZURyb3Bkb3duID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vIFBlcmZvcm0gZmFkZSBvdXQuXG4gICAgICAgICAgICAkKGVsZW1lbnQpXG4gICAgICAgICAgICAgICAgLnN0b3AoKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaG92ZXInKVxuICAgICAgICAgICAgICAgIC5mYWRlT3V0KG9wdGlvbnMuZmFkZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpeGVzIHRoZSBkcm9wZG93biBhY3Rpb24gbGlzdCB0byBlbnN1cmUgdGhhdCB0aGUgYWN0aW9uIGxpc3QgaXMgYWx3YXlzIHZpc2libGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFNvbWV0aW1lcyB3aGVuIHRoZSBidXR0b24gZHJvcGRvd24gd2lkZ2V0IGlzIG5lYXIgdGhlIHdpbmRvdyBib3JkZXJzIHRoZSBsaXN0IG1pZ2h0XG4gICAgICAgICAqIG5vdCBiZSB2aXNpYmxlLiBUaGlzIGZ1bmN0aW9uIHdpbGwgY2hhbmdlIGl0cyBwb3NpdGlvbiBpbiBvcmRlciB0byBhbHdheXMgYmUgdmlzaWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBEcm9wZG93biBhY3Rpb24gbGlzdCBlbGVtZW50LlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9yZXBvc2l0aW9uRHJvcGRvd24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgLy8gV3JhcCBlbGVtZW50IGluIGpRdWVyeSBhbmQgc2F2ZSBzaG9ydGN1dCB0byBkcm9wZG93biBhY3Rpb24gbGlzdCBlbGVtZW50LlxuICAgICAgICAgICAgdmFyICRsaXN0ID0gJChlbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHRvIGJ1dHRvbiBlbGVtZW50LlxuICAgICAgICAgICAgdmFyICRidXR0b24gPSAkbGlzdC5jbG9zZXN0KG9wdGlvbnMuZHJvcGRvd25fc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAvLyBSZXNldCBhbnkgcG9zc2libGUgQ1NTIHBvc2l0aW9uIG1vZGlmaWNhdGlvbnMuXG4gICAgICAgICAgICAkbGlzdC5jc3Moe2xlZnQ6ICcnLCB0b3A6ICcnfSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGRyb3Bkb3duIHBvc2l0aW9uIGFuZCBwZXJmb3JtIHJlcG9zaXRpb24gaWYgbmVlZGVkLlxuICAgICAgICAgICAgaWYgKCRsaXN0Lm9mZnNldCgpLmxlZnQgKyAkbGlzdC53aWR0aCgpID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9Nb3ZlTGVmdFBpeGVscyA9ICRsaXN0LndpZHRoKCkgLSAkYnV0dG9uLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgJGxpc3QuY3NzKCdtYXJnaW4tbGVmdCcsICctJyArICh0b01vdmVMZWZ0UGl4ZWxzKSArICdweCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJGxpc3Qub2Zmc2V0KCkudG9wICsgJGxpc3QuaGVpZ2h0KCkgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9Nb3ZlVXBQaXhlbHMgPSAkbGlzdC5oZWlnaHQoKSArIDEwOyAvLyAxMHB4IGZpbmUtdHVuaW5nXG4gICAgICAgICAgICAgICAgJGxpc3QuY3NzKCdtYXJnaW4tdG9wJywgJy0nICsgKHRvTW92ZVVwUGl4ZWxzKSArICdweCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFMgLSBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIG1haW4gYnV0dG9uIChhY3Rpb24gYnV0dG9uKS5cbiAgICAgICAgICogUGVyZm9ybXMgbWFpbiBidXR0b24gYWN0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbWFpbkJ1dHRvbkNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ3BlcmZvcm06YWN0aW9uJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSBkcm9wZG93biBidXR0b24gKGNhcmV0IGJ1dHRvbikuXG4gICAgICAgICAqIFNob3dzIG9yIGhpZGVzIHRoZSBkcm9wZG93biBhY3Rpb24gbGlzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NhcmV0QnV0dG9uQ2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2hvcnRjdXQgcmVmZXJlbmNlIHRvIGRyb3Bkb3duIGFjdGlvbiBsaXN0IGVsZW1lbnQuXG4gICAgICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgJGxpc3QgPSAkKHRoaXMpLnNpYmxpbmdzKCd1bCcpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERldGVybWluZXMgd2hldGhlciB0aGUgZHJvcGRvd24gYWN0aW9uIGxpc3QgaXMgdmlzaWJsZS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgbGlzdElzVmlzaWJsZSA9ICRsaXN0Lmhhc0NsYXNzKCdob3ZlcicpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIG9yIHNob3cgZHJvcGRvd24sIGRlcGVuZGVudCBvbiBpdHMgdmlzaWJpbGl0eSBzdGF0ZS5cbiAgICAgICAgICAgIGlmIChsaXN0SXNWaXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgX2hpZGVEcm9wZG93bigkbGlzdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF9zaG93RHJvcGRvd24oJGxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgZHJvcGRvd24gYWN0aW9uIGxpc3QuXG4gICAgICAgICAqIEhpZGVzIHRoZSBkcm9wZG93biwgc2F2ZXMgdGhlIGNob3NlbiB2YWx1ZSB0aHJvdWdoXG4gICAgICAgICAqIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZSBhbmQgcGVyZm9ybSB0aGUgc2VsZWN0ZWQgYWN0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbGlzdEl0ZW1DbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZWZlcmVuY2UgdG8gYHRoaXNgIGVsZW1lbnQsIHdyYXBwZWQgaW4galF1ZXJ5LlxuICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBSZWZlcmVuY2UgdG8gZHJvcGRvd24gYWN0aW9uIGxpc3QgZWxlbWVudC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciAkbGlzdCA9ICRzZWxmLmNsb3Nlc3QoJ3VsJyk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVmZXJlbmNlIHRvIGJ1dHRvbiBkcm9wZG93biBlbGVtZW50LlxuICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyICRidXR0b24gPSAkc2VsZi5jbG9zZXN0KG9wdGlvbnMuZHJvcGRvd25fc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGRyb3Bkb3duLlxuICAgICAgICAgICAgX2hpZGVEcm9wZG93bigkbGlzdCk7XG5cbiAgICAgICAgICAgIC8vIFNhdmUgdXNlciBjb25maWd1cmF0aW9uIGRhdGEuXG4gICAgICAgICAgICB2YXIgY29uZmlnS2V5ID0gJGJ1dHRvbi5kYXRhKCdjb25maWdfa2V5JyksXG4gICAgICAgICAgICAgICAgY29uZmlnVmFsdWUgPSAkc2VsZi5kYXRhKCd2YWx1ZScpO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnS2V5ICYmIGNvbmZpZ1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3NhdmVVc2VyQ29uZmlndXJhdGlvbihjb25maWdLZXksIGNvbmZpZ1ZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUGVyZm9ybSBhY3Rpb24uXG4gICAgICAgICAgICAkc2VsZi50cmlnZ2VyKCdwZXJmb3JtOmFjdGlvbicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvdXRzaWRlIG9mIHRoZSBidXR0b24gYXJlYS5cbiAgICAgICAgICogSGlkZXMgbXVsdGlwbGUgb3BlbmVkIGRyb3Bkb3ducy5cbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX291dHNpZGVDbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRWxlbWVudCBzaG9ydGN1dCB0byBhbGwgb3BlbmVkIGRyb3Bkb3duIGFjdGlvbiBsaXN0cy5cbiAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciAkbGlzdCA9ICQoJ3VsLmhvdmVyJyk7XG5cbiAgICAgICAgICAgIC8vIEhpZGUgYWxsIG9wZW5lZCBkcm9wZG93bnMuXG4gICAgICAgICAgICBfaGlkZURyb3Bkb3duKCRsaXN0KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTIC0gQ1JFQVRFIFdJREdFVFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgdGhlIGRyb3Bkb3duIGZ1bmN0aW9uYWxpdHkgdG8gdGhlIGJ1dHRvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIERldmVsb3BlcnMgY2FuIG1hbnVhbGx5IGFkZCBuZXcgYDxsaT5gIGl0ZW1zIHRvIHRoZSBsaXN0IGluIG9yZGVyIHRvIGRpc3BsYXkgbW9yZSBvcHRpb25zXG4gICAgICAgICAqIHRvIHRoZSB1c2Vycy5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBmYWRlcyB0aGUgZHJvcGRvd24gZWxlbWVudHMgaW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7YXJyYXl9IGVsZW1lbnRzIExpc3Qgb2YgZWxlbWVudHMgaW5mb3Mgb2JqZWN0IHdoaWNoIGNvbnRhaW5zIHRoZSBlbGVtZW50IGl0c2VsZiBhbmQgZGF0YSBhdHRyaWJ1dGVzLlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlndXJhdGlvbiBPYmplY3Qgd2l0aCBmZXRjaGVkIGNvbmZpZ3VyYXRpb24ga2V5IGFuZCB2YWx1ZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge2pRdWVyeS5EZWZlcnJlZH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbWFrZVdpZGdldHMgPSBmdW5jdGlvbiAoZWxlbWVudHMsIGNvbmZpZ3VyYXRpb24pIHtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZlcnJlZCBvYmplY3Qgd2hpY2ggd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnkuRGVmZXJyZWR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgc2Vjb25kYXJ5IGJ1dHRvbiB3aGljaCB3aWxsIHRvZ2dsZSB0aGUgbGlzdCB2aXNpYmlsaXR5LlxuICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdmFyICRzZWNvbmRhcnlCdXR0b24gPSAkKGNhcmV0QnV0dG9uVGVtcGxhdGUpO1xuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBlbGVtZW50IGFuZCBjcmVhdGUgZHJvcGRvd24gd2lkZ2V0LlxuICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnRPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBCdXR0b24gZHJvcGRvd24gZWxlbWVudC5cbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQoZWxlbWVudE9iamVjdC5lbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIEJ1dHRvbiBkcm9wZG93biBlbGVtZW50J3MgYnV0dG9ucy5cbiAgICAgICAgICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uID0gJGVsZW1lbnQuZmluZCgnYnV0dG9uOmZpcnN0Jyk7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDbG9uZWQgY2FyZXQgYnV0dG9uIHRlbXBsYXRlLlxuICAgICAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFyICRjYXJldEJ1dHRvbiA9ICRzZWNvbmRhcnlCdXR0b24uY2xvbmUoKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBjdXN0b20gY2xhc3MgdG8gdGVtcGxhdGUsIGlmIGRlZmluZWQuXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRPYmplY3QuY3VzdG9tX2NhcmV0X2J0bl9jbGFzcykge1xuICAgICAgICAgICAgICAgICAgICAkY2FyZXRCdXR0b24uYWRkQ2xhc3MoZWxlbWVudE9iamVjdC5jdXN0b21fY2FyZXRfYnRuX2NsYXNzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgQ1NTIGNsYXNzIHRvIGJ1dHRvbiBhbmQgcGxhY2UgdGhlIGNhcmV0IGJ1dHRvbi5cbiAgICAgICAgICAgICAgICAkYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnYnRuJylcbiAgICAgICAgICAgICAgICAgICAgLmFmdGVyKCRjYXJldEJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgY2xhc3MgdG8gZHJvcGRvd24gYnV0dG9uIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdqcy1idXR0b24tZHJvcGRvd24nKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBjb25maWd1cmF0aW9uIHZhbHVlIHRvIGNvbnRhaW5lciwgaWYga2V5IGFuZCB2YWx1ZSBleGlzdC5cbiAgICAgICAgICAgICAgICBpZiAoY29uZmlndXJhdGlvbiAmJiBlbGVtZW50T2JqZWN0LmNvbmZpZ19rZXkgJiYgY29uZmlndXJhdGlvbltlbGVtZW50T2JqZWN0LmNvbmZpZ19rZXldIHx8IGVsZW1lbnRPYmplY3QuY29uZmlnX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVsZW1lbnRPYmplY3QuY29uZmlnX3ZhbHVlIHx8IGNvbmZpZ3VyYXRpb25bZWxlbWVudE9iamVjdC5jb25maWdfa2V5XTtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuYXR0cihvcHRpb25zLmNvbmZpZ192YWx1ZV9hdHRyaWJ1dGUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBhZGQgZGlzYWJsZWQgc3RhdGUgaWYgZXhpc3RzXG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIG9wdGlvbnMuZGlzYWJsZWRfc3RhdGUpO1xuICAgICAgICAgICAgICAgICRjYXJldEJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIG9wdGlvbnMuZGlzYWJsZWRfc3RhdGUpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVyOiBDbGljayBvbiBmaXJzdCBidXR0b24gKG1haW4gYWN0aW9uIGJ1dHRvbikuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgc2VsZWN0b3JzLm1haW5CdXR0b24sIF9tYWluQnV0dG9uQ2xpY2tIYW5kbGVyKTtcblxuICAgICAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVyOiBDbGljayBvbiBkcm9wZG93biBidXR0b24gKGNhcmV0IGJ1dHRvbikuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgc2VsZWN0b3JzLmNhcmV0QnV0dG9uLCBfY2FyZXRCdXR0b25DbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoIGV2ZW50IGhhbmRsZXI6IENsaWNrIG9uIGRyb3Bkb3duIGFjdGlvbiBsaXN0IGl0ZW0uXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQub24oJ2NsaWNrJywgJ3VsIHNwYW4sIHVsIGEnLCBfbGlzdEl0ZW1DbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gRmFkZSBpbiBlbGVtZW50LlxuICAgICAgICAgICAgICAgICRlbGVtZW50LmZhZGVJbihvcHRpb25zLmZhZGUuZHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQuY3NzKCdkaXNwbGF5JywgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBoYW5kbGVyOiBDbG9zZSBkcm9wZG93biBvbiBvdXRzaWRlIGNsaWNrLlxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgX291dHNpZGVDbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICAgICAvLyBSZXNvbHZlIHByb21pc2UuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBkZWZlcnJlZCBvYmplY3QuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EUyAtIFNBVkUgVVNFUiBDT05GSUdVUkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlcyBhIHVzZXIgY29uZmlndXJhdGlvbiB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBDb25maWd1cmF0aW9uIGtleS5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIENvbmZpZ3VyYXRpb24gdmFsdWUuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3NhdmVVc2VyQ29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAvLyBUaHJvdyBlcnJvciBpZiBubyBjb21wbGV0ZSBkYXRhIGhhcyBiZWVuIHByb3ZpZGVkLlxuICAgICAgICAgICAgaWYgKCFrZXkgfHwgIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBjb25maWd1cmF0aW9uIGRhdGEgcGFzc2VkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNhdmUgdmFsdWUgdG8gZGF0YWJhc2UgdmlhIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAgICAgICAgdXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLnNldCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IG9wdGlvbnMudXNlcl9pZCxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICQud2hlbihfZmluZERyb3Bkb3duRWxlbWVudHMoKSwgX2xvYWRDb25maWd1cmF0aW9ucygpKVxuICAgICAgICAgICAgICAgIC50aGVuKF9tYWtlV2lkZ2V0cylcbiAgICAgICAgICAgICAgICAudGhlbihkb25lKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
