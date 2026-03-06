'use strict';

/* --------------------------------------------------------------
 spinner.js 2016-02-19 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Spinner Widget
 *
 * Converts a simple text input element to a value spinner.
 *
 * jQueryUI Spinner API: {@link http://api.jqueryui.com/slider}
 *
 * ### Options
 *
 * **Min | `data-spinner-min` | Number | Optional**
 *
 * The minimum value of the spinner. If no value is provided, no minimum limit is set.
 *
 * **Max | `data-spinner-max` | Number | Optional**
 *
 * The maximum value of the spinner. If no value is provided, no maximum limit is set.
 *
 * ### Example
 *
 * ```html
 * <input type="text" data-gx-widget="spinner" data-spinner-min="1" data-spinner-max="10" />
 * ```
 *
 * @module Admin/Widgets/spinner
 * @requires jQueryUI-Library
 */
gx.widgets.module('spinner', [], function (data) {

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
  defaults = {},


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
    $this.spinner(options);
    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwaW5uZXIuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwic3Bpbm5lciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQUEsR0FBR0MsT0FBSCxDQUFXQyxNQUFYLENBQ0ksU0FESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxVQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGFBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLFlBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBcEJkOzs7QUFzQkk7Ozs7O0FBS0FELFdBQVMsRUEzQmI7O0FBNkJBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FBLFNBQU9PLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCTixVQUFNTyxPQUFOLENBQWNKLE9BQWQ7QUFDQUc7QUFDSCxHQUhEOztBQUtBO0FBQ0EsU0FBT1IsTUFBUDtBQUNILENBeERMIiwiZmlsZSI6InNwaW5uZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNwaW5uZXIuanMgMjAxNi0wMi0xOSBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgU3Bpbm5lciBXaWRnZXRcbiAqXG4gKiBDb252ZXJ0cyBhIHNpbXBsZSB0ZXh0IGlucHV0IGVsZW1lbnQgdG8gYSB2YWx1ZSBzcGlubmVyLlxuICpcbiAqIGpRdWVyeVVJIFNwaW5uZXIgQVBJOiB7QGxpbmsgaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vc2xpZGVyfVxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipNaW4gfCBgZGF0YS1zcGlubmVyLW1pbmAgfCBOdW1iZXIgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIG1pbmltdW0gdmFsdWUgb2YgdGhlIHNwaW5uZXIuIElmIG5vIHZhbHVlIGlzIHByb3ZpZGVkLCBubyBtaW5pbXVtIGxpbWl0IGlzIHNldC5cbiAqXG4gKiAqKk1heCB8IGBkYXRhLXNwaW5uZXItbWF4YCB8IE51bWJlciB8IE9wdGlvbmFsKipcbiAqXG4gKiBUaGUgbWF4aW11bSB2YWx1ZSBvZiB0aGUgc3Bpbm5lci4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIG5vIG1heGltdW0gbGltaXQgaXMgc2V0LlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1neC13aWRnZXQ9XCJzcGlubmVyXCIgZGF0YS1zcGlubmVyLW1pbj1cIjFcIiBkYXRhLXNwaW5uZXItbWF4PVwiMTBcIiAvPlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3NwaW5uZXJcbiAqIEByZXF1aXJlcyBqUXVlcnlVSS1MaWJyYXJ5XG4gKi9cbmd4LndpZGdldHMubW9kdWxlKFxuICAgICdzcGlubmVyJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFdpZGdldCBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLnNwaW5uZXIob3B0aW9ucyk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
