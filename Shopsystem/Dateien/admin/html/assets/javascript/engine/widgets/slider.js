'use strict';

/* --------------------------------------------------------------
 slider.js 2016-02-19 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Slider Widget
 *
 * Enables the jQuery UI slider widget in the selected element.
 *
 * jQueryUI Slider API: {@link http://api.jqueryui.com/slider}
 *
 * ### Options
 *
 * **Value | `data-slider-value` | Number | Optional**
 *
 * The starting value for the slider widget. If no value is provided, it defaults to **0**.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-widget="slider" data-slider-value="10"></div>
 * ```
 *
 * @module Admin/Widgets/slider
 * @requires jQueryUI-Library
 */
gx.widgets.module('slider', [], function (data) {

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
   * Default Widget Options
   *
   * @type {object}
   */
  defaults = {
    value: 0
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
  // INITIALIZATION
  // ------------------------------------------------------------------------

  /**
   * Initialize method of the widget, called by the engine.
   */
  module.init = function (done) {
    $this.slider(options);
    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlci5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJleHRlbmQiLCJpbml0IiwiZG9uZSIsInNsaWRlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxRQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFVBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsYUFBVztBQUNQQyxXQUFPO0FBREEsR0FiZjs7O0FBaUJJOzs7OztBQUtBQyxZQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJILFFBQW5CLEVBQTZCSCxJQUE3QixDQXRCZDs7O0FBd0JJOzs7OztBQUtBRCxXQUFTLEVBN0JiOztBQStCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBQSxTQUFPUSxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQlAsVUFBTVEsTUFBTixDQUFhSixPQUFiO0FBQ0FHO0FBQ0gsR0FIRDs7QUFLQTtBQUNBLFNBQU9ULE1BQVA7QUFDSCxDQTFETCIsImZpbGUiOiJzbGlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNsaWRlci5qcyAyMDE2LTAyLTE5IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTbGlkZXIgV2lkZ2V0XG4gKlxuICogRW5hYmxlcyB0aGUgalF1ZXJ5IFVJIHNsaWRlciB3aWRnZXQgaW4gdGhlIHNlbGVjdGVkIGVsZW1lbnQuXG4gKlxuICogalF1ZXJ5VUkgU2xpZGVyIEFQSToge0BsaW5rIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL3NsaWRlcn1cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqVmFsdWUgfCBgZGF0YS1zbGlkZXItdmFsdWVgIHwgTnVtYmVyIHwgT3B0aW9uYWwqKlxuICpcbiAqIFRoZSBzdGFydGluZyB2YWx1ZSBmb3IgdGhlIHNsaWRlciB3aWRnZXQuIElmIG5vIHZhbHVlIGlzIHByb3ZpZGVkLCBpdCBkZWZhdWx0cyB0byAqKjAqKi5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJzbGlkZXJcIiBkYXRhLXNsaWRlci12YWx1ZT1cIjEwXCI+PC9kaXY+XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvc2xpZGVyXG4gKiBAcmVxdWlyZXMgalF1ZXJ5VUktTGlicmFyeVxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnc2xpZGVyJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFdpZGdldCBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAwXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5zbGlkZXIob3B0aW9ucyk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
