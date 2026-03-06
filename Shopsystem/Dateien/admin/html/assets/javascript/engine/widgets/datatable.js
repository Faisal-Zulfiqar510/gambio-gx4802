'use strict';

/* --------------------------------------------------------------
 datatable.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## DataTable Widget
 *
 * Wrapper widget for the jquery datatables plugin. You can create a whole
 * data table with sort, search, pagination and other useful utilities.
 *
 * Official DataTables Website: {@link http://www.datatables.net}
 *
 * ### Options
 *
 * **Language | `data-datatable-language` | Object | Optional**
 *
 * Provide the default language for the data table. If no language is provided, the language
 * defaults to german. [Click here](https://datatables.net/reference/option/language) to see
 * how the language object should look like.
 *
 * ### Example
 *
 * ```html
 * <table data-gx-widget="datatable">
 *   <thead>
 *     <tr>
 *       <th>Column 1</th>
 *       <th>Column 2</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Cell 1</td>
 *       <td>Cell 2</td>
 *     </tr>
 *   </tbody>
 * </table>
 * ```
 *
 * *Place the ".disable-sort" class to <th> elements that shouldn't be sorted.*
 *
 * @module Admin/Widgets/datatable
 * @requires jQuery-DataTables-Plugin
 */
gx.widgets.module('datatable', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', 'datatable'],

/** @lends module:Widgets/datatable */

function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  var
  /**
   * Widget Reference Selector
   *
   * @type {object}
   */
  $this = $(this),


  /**
   * DataTable plugin handler used for triggering API operations.
   *
   * @type {object}
   */
  $table = {},


  /**
   * Default options of Widget
   *
   * @type {object}
   */
  defaults = {
    language: jse.libs.datatable.getGermanTranslation()
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

  /**  Define Views Data */
  module.view = {};

  /** Define Models Data */
  module.model = {};

  /** Define Dependencies */
  module.dependencies = {};

  /**
   * Initialize method of the widget, called by the engine.
   */
  module.init = function (done) {
    $table = $this.DataTable(options);
    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZS5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJHRhYmxlIiwiZGVmYXVsdHMiLCJsYW5ndWFnZSIsImxpYnMiLCJkYXRhdGFibGUiLCJnZXRHZXJtYW5UcmFuc2xhdGlvbiIsIm9wdGlvbnMiLCJleHRlbmQiLCJ2aWV3IiwibW9kZWwiLCJkZXBlbmRlbmNpZXMiLCJpbml0IiwiZG9uZSIsIkRhdGFUYWJsZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0NBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxXQURKLEVBR0ksQ0FDT0MsSUFBSUMsTUFEWCxtREFFT0QsSUFBSUMsTUFGWCxrREFHSSxXQUhKLENBSEo7O0FBU0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxXQUFTLEVBYmI7OztBQWVJOzs7OztBQUtBQyxhQUFXO0FBQ1BDLGNBQVVQLElBQUlRLElBQUosQ0FBU0MsU0FBVCxDQUFtQkMsb0JBQW5CO0FBREgsR0FwQmY7OztBQXdCSTs7Ozs7QUFLQUMsWUFBVVAsRUFBRVEsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CTixRQUFuQixFQUE2QkosSUFBN0IsQ0E3QmQ7OztBQStCSTs7Ozs7QUFLQUgsV0FBUyxFQXBDYjs7QUFzQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0FBLFNBQU9jLElBQVAsR0FBYyxFQUFkOztBQUVBO0FBQ0FkLFNBQU9lLEtBQVAsR0FBZSxFQUFmOztBQUVBO0FBQ0FmLFNBQU9nQixZQUFQLEdBQXNCLEVBQXRCOztBQUVBOzs7QUFHQWhCLFNBQU9pQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQlosYUFBU0YsTUFBTWUsU0FBTixDQUFnQlAsT0FBaEIsQ0FBVDtBQUNBTTtBQUNILEdBSEQ7O0FBS0E7QUFDQSxTQUFPbEIsTUFBUDtBQUNILENBaEZMIiwiZmlsZSI6ImRhdGF0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZGF0YXRhYmxlLmpzIDIwMTYtMDItMjNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIERhdGFUYWJsZSBXaWRnZXRcbiAqXG4gKiBXcmFwcGVyIHdpZGdldCBmb3IgdGhlIGpxdWVyeSBkYXRhdGFibGVzIHBsdWdpbi4gWW91IGNhbiBjcmVhdGUgYSB3aG9sZVxuICogZGF0YSB0YWJsZSB3aXRoIHNvcnQsIHNlYXJjaCwgcGFnaW5hdGlvbiBhbmQgb3RoZXIgdXNlZnVsIHV0aWxpdGllcy5cbiAqXG4gKiBPZmZpY2lhbCBEYXRhVGFibGVzIFdlYnNpdGU6IHtAbGluayBodHRwOi8vd3d3LmRhdGF0YWJsZXMubmV0fVxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipMYW5ndWFnZSB8IGBkYXRhLWRhdGF0YWJsZS1sYW5ndWFnZWAgfCBPYmplY3QgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSB0aGUgZGVmYXVsdCBsYW5ndWFnZSBmb3IgdGhlIGRhdGEgdGFibGUuIElmIG5vIGxhbmd1YWdlIGlzIHByb3ZpZGVkLCB0aGUgbGFuZ3VhZ2VcbiAqIGRlZmF1bHRzIHRvIGdlcm1hbi4gW0NsaWNrIGhlcmVdKGh0dHBzOi8vZGF0YXRhYmxlcy5uZXQvcmVmZXJlbmNlL29wdGlvbi9sYW5ndWFnZSkgdG8gc2VlXG4gKiBob3cgdGhlIGxhbmd1YWdlIG9iamVjdCBzaG91bGQgbG9vayBsaWtlLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgaHRtbFxuICogPHRhYmxlIGRhdGEtZ3gtd2lkZ2V0PVwiZGF0YXRhYmxlXCI+XG4gKiAgIDx0aGVhZD5cbiAqICAgICA8dHI+XG4gKiAgICAgICA8dGg+Q29sdW1uIDE8L3RoPlxuICogICAgICAgPHRoPkNvbHVtbiAyPC90aD5cbiAqICAgICA8L3RyPlxuICogICA8L3RoZWFkPlxuICogICA8dGJvZHk+XG4gKiAgICAgPHRyPlxuICogICAgICAgPHRkPkNlbGwgMTwvdGQ+XG4gKiAgICAgICA8dGQ+Q2VsbCAyPC90ZD5cbiAqICAgICA8L3RyPlxuICogICA8L3Rib2R5PlxuICogPC90YWJsZT5cbiAqIGBgYFxuICpcbiAqICpQbGFjZSB0aGUgXCIuZGlzYWJsZS1zb3J0XCIgY2xhc3MgdG8gPHRoPiBlbGVtZW50cyB0aGF0IHNob3VsZG4ndCBiZSBzb3J0ZWQuKlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9kYXRhdGFibGVcbiAqIEByZXF1aXJlcyBqUXVlcnktRGF0YVRhYmxlcy1QbHVnaW5cbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2RhdGF0YWJsZScsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanNgLFxuICAgICAgICAnZGF0YXRhYmxlJ1xuICAgIF0sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpXaWRnZXRzL2RhdGF0YWJsZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEYXRhVGFibGUgcGx1Z2luIGhhbmRsZXIgdXNlZCBmb3IgdHJpZ2dlcmluZyBBUEkgb3BlcmF0aW9ucy5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGFibGUgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IG9wdGlvbnMgb2YgV2lkZ2V0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IGpzZS5saWJzLmRhdGF0YWJsZS5nZXRHZXJtYW5UcmFuc2xhdGlvbigpXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKiogIERlZmluZSBWaWV3cyBEYXRhICovXG4gICAgICAgIG1vZHVsZS52aWV3ID0ge307XG5cbiAgICAgICAgLyoqIERlZmluZSBNb2RlbHMgRGF0YSAqL1xuICAgICAgICBtb2R1bGUubW9kZWwgPSB7fTtcblxuICAgICAgICAvKiogRGVmaW5lIERlcGVuZGVuY2llcyAqL1xuICAgICAgICBtb2R1bGUuZGVwZW5kZW5jaWVzID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSB3aWRnZXQsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJHRhYmxlID0gJHRoaXMuRGF0YVRhYmxlKG9wdGlvbnMpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
