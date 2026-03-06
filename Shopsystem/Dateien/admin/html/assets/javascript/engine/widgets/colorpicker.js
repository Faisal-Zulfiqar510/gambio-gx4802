'use strict';

/* --------------------------------------------------------------
 colorpicker.js 2016-04-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Colorpicker Widget
 *
 * Use this widget to add a colorpicker to a specific `<div>` element.
 *
 * jQuery Colpick Website: {@link https://github.com/mrgrain/colpick}
 *
 * ### Options
 *
 * **Color | `data-colorpicker-color` | String | Optional**
 *
 * Provide the default color for the color picker. If no value is provided, it defaults
 * to `'#ffffff'`.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-widget="colorpicker"
 *     data-colorpicker-color="#555dfa">
 *   <button class="btn picker">Select Color</button>
 *   <strong class="color-preview">Color Preview</strong>
 *   <input type="hidden" id="color-value" />
 * </div>
 * ```
 *
 * @module Admin/Widgets/colorpicker
 * @requires jQuery-Colpick-Plugin
 *
 * @todo Replace the global-colorpicker.css with the one from bower components
 * @todo The $preview selector must be set dynamically through an option.
 *
 */
gx.widgets.module('colorpicker', [jse.source + '/vendor/jquery-colpick/colpick.min.js'], function (data) {

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
   * Button Element Selector
   *
   * @type {object}
   */
  $button = null,


  /**
   * Preview Element Selector
   *
   * @type {object}
   */
  $preview = null,


  /**
   * Input Element Selector
   *
   * @type {object}
   */
  $input = null,


  /**
   * Default Options for Widget
   *
   * @type {object}
   */
  defaults = {
    'color': '#ffffff' // Default color
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
    $button = $this.find('.picker');
    $preview = $this.find('.color-preview');
    $input = $this.find('input[type="hidden"]');

    if ($input.val()) {
      options.color = $input.val();
    }

    // Enables the colorpicker.
    $button.colpick({
      'submitText': jse.core.lang.translate('ok', 'buttons'),
      'color': options.color,
      'onSubmit': function onSubmit(result) {
        var hex = '#' + $.colpick.hsbToHex(result);
        $preview.css('background-color', hex);
        $input.val(hex).trigger('change');
        $button.colpickHide();
      }
    });

    // Sets the default values in view.
    $preview.css('background-color', options.color);
    $input.val(options.color);

    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbG9ycGlja2VyLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkYnV0dG9uIiwiJHByZXZpZXciLCIkaW5wdXQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJpbml0IiwiZG9uZSIsImZpbmQiLCJ2YWwiLCJjb2xvciIsImNvbHBpY2siLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInJlc3VsdCIsImhleCIsImhzYlRvSGV4IiwiY3NzIiwidHJpZ2dlciIsImNvbHBpY2tIaWRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxhQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCwyQ0FISixFQU9JLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFVBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsWUFBVSxJQWJkOzs7QUFlSTs7Ozs7QUFLQUMsYUFBVyxJQXBCZjs7O0FBc0JJOzs7OztBQUtBQyxXQUFTLElBM0JiOzs7QUE2Qkk7Ozs7O0FBS0FDLGFBQVc7QUFDUCxhQUFTLFNBREYsQ0FDWTtBQURaLEdBbENmOzs7QUFzQ0k7Ozs7O0FBS0FDLFlBQVVMLEVBQUVNLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJOLElBQTdCLENBM0NkOzs7QUE2Q0k7Ozs7O0FBS0FILFdBQVMsRUFsRGI7O0FBb0RBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FBLFNBQU9ZLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCUCxjQUFVRixNQUFNVSxJQUFOLENBQVcsU0FBWCxDQUFWO0FBQ0FQLGVBQVdILE1BQU1VLElBQU4sQ0FBVyxnQkFBWCxDQUFYO0FBQ0FOLGFBQVNKLE1BQU1VLElBQU4sQ0FBVyxzQkFBWCxDQUFUOztBQUVBLFFBQUlOLE9BQU9PLEdBQVAsRUFBSixFQUFrQjtBQUNkTCxjQUFRTSxLQUFSLEdBQWdCUixPQUFPTyxHQUFQLEVBQWhCO0FBQ0g7O0FBRUQ7QUFDQVQsWUFBUVcsT0FBUixDQUFnQjtBQUNaLG9CQUFjaEIsSUFBSWlCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLElBQXhCLEVBQThCLFNBQTlCLENBREY7QUFFWixlQUFTVixRQUFRTSxLQUZMO0FBR1osa0JBQVksa0JBQVVLLE1BQVYsRUFBa0I7QUFDMUIsWUFBSUMsTUFBTSxNQUFNakIsRUFBRVksT0FBRixDQUFVTSxRQUFWLENBQW1CRixNQUFuQixDQUFoQjtBQUNBZCxpQkFBU2lCLEdBQVQsQ0FBYSxrQkFBYixFQUFpQ0YsR0FBakM7QUFDQWQsZUFBT08sR0FBUCxDQUFXTyxHQUFYLEVBQWdCRyxPQUFoQixDQUF3QixRQUF4QjtBQUNBbkIsZ0JBQVFvQixXQUFSO0FBQ0g7QUFSVyxLQUFoQjs7QUFXQTtBQUNBbkIsYUFBU2lCLEdBQVQsQ0FBYSxrQkFBYixFQUFpQ2QsUUFBUU0sS0FBekM7QUFDQVIsV0FBT08sR0FBUCxDQUFXTCxRQUFRTSxLQUFuQjs7QUFFQUg7QUFDSCxHQTFCRDs7QUE0QkE7QUFDQSxTQUFPYixNQUFQO0FBQ0gsQ0F4R0wiLCJmaWxlIjoiY29sb3JwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNvbG9ycGlja2VyLmpzIDIwMTYtMDQtMDFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIENvbG9ycGlja2VyIFdpZGdldFxuICpcbiAqIFVzZSB0aGlzIHdpZGdldCB0byBhZGQgYSBjb2xvcnBpY2tlciB0byBhIHNwZWNpZmljIGA8ZGl2PmAgZWxlbWVudC5cbiAqXG4gKiBqUXVlcnkgQ29scGljayBXZWJzaXRlOiB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL21yZ3JhaW4vY29scGlja31cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqQ29sb3IgfCBgZGF0YS1jb2xvcnBpY2tlci1jb2xvcmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSB0aGUgZGVmYXVsdCBjb2xvciBmb3IgdGhlIGNvbG9yIHBpY2tlci4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIGl0IGRlZmF1bHRzXG4gKiB0byBgJyNmZmZmZmYnYC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJjb2xvcnBpY2tlclwiXG4gKiAgICAgZGF0YS1jb2xvcnBpY2tlci1jb2xvcj1cIiM1NTVkZmFcIj5cbiAqICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBwaWNrZXJcIj5TZWxlY3QgQ29sb3I8L2J1dHRvbj5cbiAqICAgPHN0cm9uZyBjbGFzcz1cImNvbG9yLXByZXZpZXdcIj5Db2xvciBQcmV2aWV3PC9zdHJvbmc+XG4gKiAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJjb2xvci12YWx1ZVwiIC8+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9jb2xvcnBpY2tlclxuICogQHJlcXVpcmVzIGpRdWVyeS1Db2xwaWNrLVBsdWdpblxuICpcbiAqIEB0b2RvIFJlcGxhY2UgdGhlIGdsb2JhbC1jb2xvcnBpY2tlci5jc3Mgd2l0aCB0aGUgb25lIGZyb20gYm93ZXIgY29tcG9uZW50c1xuICogQHRvZG8gVGhlICRwcmV2aWV3IHNlbGVjdG9yIG11c3QgYmUgc2V0IGR5bmFtaWNhbGx5IHRocm91Z2ggYW4gb3B0aW9uLlxuICpcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2NvbG9ycGlja2VyJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS1jb2xwaWNrL2NvbHBpY2subWluLmpzYFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCdXR0b24gRWxlbWVudCBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRidXR0b24gPSBudWxsLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFByZXZpZXcgRWxlbWVudCBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRwcmV2aWV3ID0gbnVsbCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBJbnB1dCBFbGVtZW50IFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGlucHV0ID0gbnVsbCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIFdpZGdldFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICdjb2xvcic6ICcjZmZmZmZmJyAvLyBEZWZhdWx0IGNvbG9yXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkYnV0dG9uID0gJHRoaXMuZmluZCgnLnBpY2tlcicpO1xuICAgICAgICAgICAgJHByZXZpZXcgPSAkdGhpcy5maW5kKCcuY29sb3ItcHJldmlldycpO1xuICAgICAgICAgICAgJGlucHV0ID0gJHRoaXMuZmluZCgnaW5wdXRbdHlwZT1cImhpZGRlblwiXScpO1xuXG4gICAgICAgICAgICBpZiAoJGlucHV0LnZhbCgpKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb2xvciA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRW5hYmxlcyB0aGUgY29sb3JwaWNrZXIuXG4gICAgICAgICAgICAkYnV0dG9uLmNvbHBpY2soe1xuICAgICAgICAgICAgICAgICdzdWJtaXRUZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ29rJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAnY29sb3InOiBvcHRpb25zLmNvbG9yLFxuICAgICAgICAgICAgICAgICdvblN1Ym1pdCc6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhleCA9ICcjJyArICQuY29scGljay5oc2JUb0hleChyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAkcHJldmlldy5jc3MoJ2JhY2tncm91bmQtY29sb3InLCBoZXgpO1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXQudmFsKGhleCkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICRidXR0b24uY29scGlja0hpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2V0cyB0aGUgZGVmYXVsdCB2YWx1ZXMgaW4gdmlldy5cbiAgICAgICAgICAgICRwcmV2aWV3LmNzcygnYmFja2dyb3VuZC1jb2xvcicsIG9wdGlvbnMuY29sb3IpO1xuICAgICAgICAgICAgJGlucHV0LnZhbChvcHRpb25zLmNvbG9yKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
