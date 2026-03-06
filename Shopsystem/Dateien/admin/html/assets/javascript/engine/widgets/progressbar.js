'use strict';

/* --------------------------------------------------------------
 progress_bar.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Progress Bar Widget
 *
 * Enables the jQuery UI progress bar in the selected element. You can access the
 * progress value in your code, or set a value in the data-progressbar-value attribute.
 *
 * jQueryUI Progress Bar API: {@link https://api.jqueryui.com/progressbar}
 *
 * ### Options
 *
 * **Value | `data-progressbar-value` | Number | Optional**
 *
 * The progress value of the progressbar. If no value is provided, it defaults to **0**.
 *
 * ### Example
 *
 *```html
 * <div data-gx-widget="progressbar" data-progressbar-value="50"></div>
 *```
 *
 * @module Admin/Widgets/progressbar
 * @requires jQueryUI-Library
 */
gx.widgets.module('progressbar', [],

/** @lends module:Widgets/progressbar */

function (data) {

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
    $this.progressbar(options);
    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2dyZXNzYmFyLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsInZhbHVlIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwicHJvZ3Jlc3NiYXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkFBLEdBQUdDLE9BQUgsQ0FBV0MsTUFBWCxDQUNJLGFBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFVBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsYUFBVztBQUNQQyxXQUFPO0FBREEsR0FiZjs7O0FBaUJJOzs7OztBQUtBQyxZQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJILFFBQW5CLEVBQTZCSCxJQUE3QixDQXRCZDs7O0FBd0JJOzs7OztBQUtBRCxXQUFTLEVBN0JiOztBQStCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBQSxTQUFPUSxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQlAsVUFBTVEsV0FBTixDQUFrQkosT0FBbEI7QUFDQUc7QUFDSCxHQUhEOztBQUtBO0FBQ0EsU0FBT1QsTUFBUDtBQUNILENBNURMIiwiZmlsZSI6InByb2dyZXNzYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBwcm9ncmVzc19iYXIuanMgMjAxNi0wMi0yM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgUHJvZ3Jlc3MgQmFyIFdpZGdldFxuICpcbiAqIEVuYWJsZXMgdGhlIGpRdWVyeSBVSSBwcm9ncmVzcyBiYXIgaW4gdGhlIHNlbGVjdGVkIGVsZW1lbnQuIFlvdSBjYW4gYWNjZXNzIHRoZVxuICogcHJvZ3Jlc3MgdmFsdWUgaW4geW91ciBjb2RlLCBvciBzZXQgYSB2YWx1ZSBpbiB0aGUgZGF0YS1wcm9ncmVzc2Jhci12YWx1ZSBhdHRyaWJ1dGUuXG4gKlxuICogalF1ZXJ5VUkgUHJvZ3Jlc3MgQmFyIEFQSToge0BsaW5rIGh0dHBzOi8vYXBpLmpxdWVyeXVpLmNvbS9wcm9ncmVzc2Jhcn1cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqVmFsdWUgfCBgZGF0YS1wcm9ncmVzc2Jhci12YWx1ZWAgfCBOdW1iZXIgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIHByb2dyZXNzIHZhbHVlIG9mIHRoZSBwcm9ncmVzc2Jhci4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzIHRvICoqMCoqLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICpgYGBodG1sXG4gKiA8ZGl2IGRhdGEtZ3gtd2lkZ2V0PVwicHJvZ3Jlc3NiYXJcIiBkYXRhLXByb2dyZXNzYmFyLXZhbHVlPVwiNTBcIj48L2Rpdj5cbiAqYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3Byb2dyZXNzYmFyXG4gKiBAcmVxdWlyZXMgalF1ZXJ5VUktTGlicmFyeVxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAncHJvZ3Jlc3NiYXInLFxuXG4gICAgW10sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpXaWRnZXRzL3Byb2dyZXNzYmFyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IDBcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLnByb2dyZXNzYmFyKG9wdGlvbnMpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
