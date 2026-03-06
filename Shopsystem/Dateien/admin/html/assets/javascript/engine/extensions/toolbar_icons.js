'use strict';

/* --------------------------------------------------------------
 toolbar_icons.js 2015-09-19 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Toolbar Icons Extension
 *
 * This extension will search for specific-class elements inside a container and will prepend them with
 * a new `<i>` element that has the corresponding FontAwesome icon. By doing so you can dynamically inject
 * icons into existing toolbar items by setting the required classes.
 *
 * In the following list you can see the relations between the classes and their icons:
 *
 * - btn-edit: [fa-pencil](http://fortawesome.github.io/Font-Awesome/icon/pencil)
 * - btn-editdoc: [fa-pencil](http://fortawesome.github.io/Font-Awesome/icon/pencil)
 * - btn-view: [fa-eye](http://fortawesome.github.io/Font-Awesome/icon/eye)
 * - btn-delete: [fa-trash-o](http://fortawesome.github.io/Font-Awesome/icon/trash-o)
 * - btn-order: [fa-shopping-cart](http://fortawesome.github.io/Font-Awesome/icon/shopping-cart)
 * - btn-caret: [fa-caret-right](http://fortawesome.github.io/Font-Awesome/icon/caret-right)
 * - btn-folder: [fa-folder-open](http://fortawesome.github.io/Font-Awesome/icon/folder)
 * - btn-multi-action: [fa-check-square-o](http://fortawesome.github.io/Font-Awesome/icon/check-square-o)
 * - btn-cash: [fa-money](http://fortawesome.github.io/Font-Awesome/icon/money)
 * - btn-add: [fa-plus](http://fortawesome.github.io/Font-Awesome/icon/plus)
 *
 * ### Options
 *
 * The extension contains additional options that can be used to modify the display of the icons. You can
 * use them together at the same time.
 *
 * **Large Icons | `data-toolbar_icons-large` | Boolean | Optional**
 *
 * This option will add the "fa-lg" class to the icons which will make them bigger.
 *
 * ```html
 * <div class="container" data-gx-extension="toolbar_icons" data-toolbar_icons-large="true">
 *   <button class="btn-edit"></button>
 * </div>
 * ```
 *
 * **Fixed Width | `data-toolbar_icons-fixedwidth` | Boolean | Optional**
 *
 * This option will add the "fa-fw" class to the icons which will keep the icon width fixed.
 *
 * ```html
 * <div class="container" data-gx-extension="toolbar_icons" data-toolbar_icons-fixedwidth="true">
 *   <button class="btn-view"></button>
 * </div>
 * ```
 *
 * ### Example
 *
 * After the engine is initialized the following button elements will contain the corresponding FontAwesome icons.
 *
 * ```html
 * <div class="container" data-gx-extension="toolbar_icons">
 *   <button class="btn-edit">&amp;nbsp;Edit</button>
 *   <button class="btn-view">&amp;nbsp;View</button>
 *   <button class="btn-order">&amp;nbsp;Buy Item</button>
 * </div>
 * ```
 *
 * *Note that the use of **&amp;nbsp;** is required only if you want to add some space between the icon and the
 * text. You can avoid it by styling the margin space between the icon and the text.*
 *
 * FontAwesome provides many helper classes that can be used directly on the elements in order to adjust the
 * final visual result. Visit the follow link for more examples and sample code.
 * {@link https://fortawesome.github.io/Font-Awesome/examples}
 *
 * @module Admin/Extensions/toolbar_icons
 */
gx.extensions.module('toolbar_icons', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLE DEFINITION
  // ------------------------------------------------------------------------

  var
  /**
   * Extension Reference
   *
   * @type {object}
   */
  $this = $(this),


  /**
   * Default Options for Extension
   *
   * @type {object}
   *
   * @todo Add default values to the extension.
   */
  defaults = {},


  /**
   * Final Extension Options
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
   * Initialize method of the extension, called by the engine.
   */
  module.init = function (done) {

    // Define class names and the respective Font-Awesome classes here
    // @todo The selectors must be dynamic, move these to the "defaults.selectors" property.
    var classes = {
      '.btn-edit': 'fa-pencil',
      '.btn-view': 'fa-eye',
      '.btn-editdoc': 'fa-pencil',
      '.btn-delete': 'fa-trash-o',
      '.btn-order': 'fa-shopping-cart',
      '.btn-caret': 'fa-caret-right',
      '.btn-folder': 'fa-folder-open',
      '.btn-multi-action': 'fa-check-square-o',
      '.btn-cash': 'fa-money',
      '.btn-add': 'fa-plus'
    };

    // Let's rock
    $.each(classes, function (key, value) {
      var composedClassName = [value, options.large ? ' fa-lg' : '',
      // @todo "fixedwidth" must be CamelCase or underscore_separated.
      options.fixedwidth ? ' fa-fw' : ''].join('');

      var $tag = $('<i class="fa ' + composedClassName + '"></i>');
      $this.find(key).prepend($tag);
    });

    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xiYXJfaWNvbnMuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwiY2xhc3NlcyIsImVhY2giLCJrZXkiLCJ2YWx1ZSIsImNvbXBvc2VkQ2xhc3NOYW1lIiwibGFyZ2UiLCJmaXhlZHdpZHRoIiwiam9pbiIsIiR0YWciLCJmaW5kIiwicHJlcGVuZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrRUFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLGVBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7Ozs7O0FBT0FDLGFBQVcsRUFmZjs7O0FBaUJJOzs7OztBQUtBQyxZQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXRCZDs7O0FBd0JJOzs7OztBQUtBRCxXQUFTLEVBN0JiOztBQStCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBQSxTQUFPTyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjs7QUFFMUI7QUFDQTtBQUNBLFFBQUlDLFVBQVU7QUFDVixtQkFBYSxXQURIO0FBRVYsbUJBQWEsUUFGSDtBQUdWLHNCQUFnQixXQUhOO0FBSVYscUJBQWUsWUFKTDtBQUtWLG9CQUFjLGtCQUxKO0FBTVYsb0JBQWMsZ0JBTko7QUFPVixxQkFBZSxnQkFQTDtBQVFWLDJCQUFxQixtQkFSWDtBQVNWLG1CQUFhLFVBVEg7QUFVVixrQkFBWTtBQVZGLEtBQWQ7O0FBYUE7QUFDQU4sTUFBRU8sSUFBRixDQUFPRCxPQUFQLEVBQWdCLFVBQVVFLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUNsQyxVQUFJQyxvQkFBb0IsQ0FDcEJELEtBRG9CLEVBRW5CUCxRQUFRUyxLQUFSLEdBQWdCLFFBQWhCLEdBQTJCLEVBRlI7QUFHcEI7QUFDQ1QsY0FBUVUsVUFBUixHQUFxQixRQUFyQixHQUFnQyxFQUpiLEVBS3RCQyxJQUxzQixDQUtqQixFQUxpQixDQUF4Qjs7QUFPQSxVQUFJQyxPQUFPZCxFQUFFLGtCQUFrQlUsaUJBQWxCLEdBQXNDLFFBQXhDLENBQVg7QUFDQVgsWUFBTWdCLElBQU4sQ0FBV1AsR0FBWCxFQUFnQlEsT0FBaEIsQ0FBd0JGLElBQXhCO0FBQ0gsS0FWRDs7QUFZQVQ7QUFDSCxHQS9CRDs7QUFpQ0E7QUFDQSxTQUFPUixNQUFQO0FBQ0gsQ0F0RkwiLCJmaWxlIjoidG9vbGJhcl9pY29ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gdG9vbGJhcl9pY29ucy5qcyAyMDE1LTA5LTE5IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBUb29sYmFyIEljb25zIEV4dGVuc2lvblxuICpcbiAqIFRoaXMgZXh0ZW5zaW9uIHdpbGwgc2VhcmNoIGZvciBzcGVjaWZpYy1jbGFzcyBlbGVtZW50cyBpbnNpZGUgYSBjb250YWluZXIgYW5kIHdpbGwgcHJlcGVuZCB0aGVtIHdpdGhcbiAqIGEgbmV3IGA8aT5gIGVsZW1lbnQgdGhhdCBoYXMgdGhlIGNvcnJlc3BvbmRpbmcgRm9udEF3ZXNvbWUgaWNvbi4gQnkgZG9pbmcgc28geW91IGNhbiBkeW5hbWljYWxseSBpbmplY3RcbiAqIGljb25zIGludG8gZXhpc3RpbmcgdG9vbGJhciBpdGVtcyBieSBzZXR0aW5nIHRoZSByZXF1aXJlZCBjbGFzc2VzLlxuICpcbiAqIEluIHRoZSBmb2xsb3dpbmcgbGlzdCB5b3UgY2FuIHNlZSB0aGUgcmVsYXRpb25zIGJldHdlZW4gdGhlIGNsYXNzZXMgYW5kIHRoZWlyIGljb25zOlxuICpcbiAqIC0gYnRuLWVkaXQ6IFtmYS1wZW5jaWxdKGh0dHA6Ly9mb3J0YXdlc29tZS5naXRodWIuaW8vRm9udC1Bd2Vzb21lL2ljb24vcGVuY2lsKVxuICogLSBidG4tZWRpdGRvYzogW2ZhLXBlbmNpbF0oaHR0cDovL2ZvcnRhd2Vzb21lLmdpdGh1Yi5pby9Gb250LUF3ZXNvbWUvaWNvbi9wZW5jaWwpXG4gKiAtIGJ0bi12aWV3OiBbZmEtZXllXShodHRwOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9pY29uL2V5ZSlcbiAqIC0gYnRuLWRlbGV0ZTogW2ZhLXRyYXNoLW9dKGh0dHA6Ly9mb3J0YXdlc29tZS5naXRodWIuaW8vRm9udC1Bd2Vzb21lL2ljb24vdHJhc2gtbylcbiAqIC0gYnRuLW9yZGVyOiBbZmEtc2hvcHBpbmctY2FydF0oaHR0cDovL2ZvcnRhd2Vzb21lLmdpdGh1Yi5pby9Gb250LUF3ZXNvbWUvaWNvbi9zaG9wcGluZy1jYXJ0KVxuICogLSBidG4tY2FyZXQ6IFtmYS1jYXJldC1yaWdodF0oaHR0cDovL2ZvcnRhd2Vzb21lLmdpdGh1Yi5pby9Gb250LUF3ZXNvbWUvaWNvbi9jYXJldC1yaWdodClcbiAqIC0gYnRuLWZvbGRlcjogW2ZhLWZvbGRlci1vcGVuXShodHRwOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9pY29uL2ZvbGRlcilcbiAqIC0gYnRuLW11bHRpLWFjdGlvbjogW2ZhLWNoZWNrLXNxdWFyZS1vXShodHRwOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9pY29uL2NoZWNrLXNxdWFyZS1vKVxuICogLSBidG4tY2FzaDogW2ZhLW1vbmV5XShodHRwOi8vZm9ydGF3ZXNvbWUuZ2l0aHViLmlvL0ZvbnQtQXdlc29tZS9pY29uL21vbmV5KVxuICogLSBidG4tYWRkOiBbZmEtcGx1c10oaHR0cDovL2ZvcnRhd2Vzb21lLmdpdGh1Yi5pby9Gb250LUF3ZXNvbWUvaWNvbi9wbHVzKVxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogVGhlIGV4dGVuc2lvbiBjb250YWlucyBhZGRpdGlvbmFsIG9wdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBtb2RpZnkgdGhlIGRpc3BsYXkgb2YgdGhlIGljb25zLiBZb3UgY2FuXG4gKiB1c2UgdGhlbSB0b2dldGhlciBhdCB0aGUgc2FtZSB0aW1lLlxuICpcbiAqICoqTGFyZ2UgSWNvbnMgfCBgZGF0YS10b29sYmFyX2ljb25zLWxhcmdlYCB8IEJvb2xlYW4gfCBPcHRpb25hbCoqXG4gKlxuICogVGhpcyBvcHRpb24gd2lsbCBhZGQgdGhlIFwiZmEtbGdcIiBjbGFzcyB0byB0aGUgaWNvbnMgd2hpY2ggd2lsbCBtYWtlIHRoZW0gYmlnZ2VyLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBkYXRhLWd4LWV4dGVuc2lvbj1cInRvb2xiYXJfaWNvbnNcIiBkYXRhLXRvb2xiYXJfaWNvbnMtbGFyZ2U9XCJ0cnVlXCI+XG4gKiAgIDxidXR0b24gY2xhc3M9XCJidG4tZWRpdFwiPjwvYnV0dG9uPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqXG4gKiAqKkZpeGVkIFdpZHRoIHwgYGRhdGEtdG9vbGJhcl9pY29ucy1maXhlZHdpZHRoYCB8IEJvb2xlYW4gfCBPcHRpb25hbCoqXG4gKlxuICogVGhpcyBvcHRpb24gd2lsbCBhZGQgdGhlIFwiZmEtZndcIiBjbGFzcyB0byB0aGUgaWNvbnMgd2hpY2ggd2lsbCBrZWVwIHRoZSBpY29uIHdpZHRoIGZpeGVkLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIiBkYXRhLWd4LWV4dGVuc2lvbj1cInRvb2xiYXJfaWNvbnNcIiBkYXRhLXRvb2xiYXJfaWNvbnMtZml4ZWR3aWR0aD1cInRydWVcIj5cbiAqICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi12aWV3XCI+PC9idXR0b24+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogQWZ0ZXIgdGhlIGVuZ2luZSBpcyBpbml0aWFsaXplZCB0aGUgZm9sbG93aW5nIGJ1dHRvbiBlbGVtZW50cyB3aWxsIGNvbnRhaW4gdGhlIGNvcnJlc3BvbmRpbmcgRm9udEF3ZXNvbWUgaWNvbnMuXG4gKlxuICogYGBgaHRtbFxuICogPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiIGRhdGEtZ3gtZXh0ZW5zaW9uPVwidG9vbGJhcl9pY29uc1wiPlxuICogICA8YnV0dG9uIGNsYXNzPVwiYnRuLWVkaXRcIj4mYW1wO25ic3A7RWRpdDwvYnV0dG9uPlxuICogICA8YnV0dG9uIGNsYXNzPVwiYnRuLXZpZXdcIj4mYW1wO25ic3A7VmlldzwvYnV0dG9uPlxuICogICA8YnV0dG9uIGNsYXNzPVwiYnRuLW9yZGVyXCI+JmFtcDtuYnNwO0J1eSBJdGVtPC9idXR0b24+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICpcbiAqICpOb3RlIHRoYXQgdGhlIHVzZSBvZiAqKiZhbXA7bmJzcDsqKiBpcyByZXF1aXJlZCBvbmx5IGlmIHlvdSB3YW50IHRvIGFkZCBzb21lIHNwYWNlIGJldHdlZW4gdGhlIGljb24gYW5kIHRoZVxuICogdGV4dC4gWW91IGNhbiBhdm9pZCBpdCBieSBzdHlsaW5nIHRoZSBtYXJnaW4gc3BhY2UgYmV0d2VlbiB0aGUgaWNvbiBhbmQgdGhlIHRleHQuKlxuICpcbiAqIEZvbnRBd2Vzb21lIHByb3ZpZGVzIG1hbnkgaGVscGVyIGNsYXNzZXMgdGhhdCBjYW4gYmUgdXNlZCBkaXJlY3RseSBvbiB0aGUgZWxlbWVudHMgaW4gb3JkZXIgdG8gYWRqdXN0IHRoZVxuICogZmluYWwgdmlzdWFsIHJlc3VsdC4gVmlzaXQgdGhlIGZvbGxvdyBsaW5rIGZvciBtb3JlIGV4YW1wbGVzIGFuZCBzYW1wbGUgY29kZS5cbiAqIHtAbGluayBodHRwczovL2ZvcnRhd2Vzb21lLmdpdGh1Yi5pby9Gb250LUF3ZXNvbWUvZXhhbXBsZXN9XG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL3Rvb2xiYXJfaWNvbnNcbiAqL1xuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ3Rvb2xiYXJfaWNvbnMnLFxuXG4gICAgW10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXh0ZW5zaW9uIFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIEV4dGVuc2lvblxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHRvZG8gQWRkIGRlZmF1bHQgdmFsdWVzIHRvIHRoZSBleHRlbnNpb24uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgRXh0ZW5zaW9uIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgZXh0ZW5zaW9uLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgLy8gRGVmaW5lIGNsYXNzIG5hbWVzIGFuZCB0aGUgcmVzcGVjdGl2ZSBGb250LUF3ZXNvbWUgY2xhc3NlcyBoZXJlXG4gICAgICAgICAgICAvLyBAdG9kbyBUaGUgc2VsZWN0b3JzIG11c3QgYmUgZHluYW1pYywgbW92ZSB0aGVzZSB0byB0aGUgXCJkZWZhdWx0cy5zZWxlY3RvcnNcIiBwcm9wZXJ0eS5cbiAgICAgICAgICAgIHZhciBjbGFzc2VzID0ge1xuICAgICAgICAgICAgICAgICcuYnRuLWVkaXQnOiAnZmEtcGVuY2lsJyxcbiAgICAgICAgICAgICAgICAnLmJ0bi12aWV3JzogJ2ZhLWV5ZScsXG4gICAgICAgICAgICAgICAgJy5idG4tZWRpdGRvYyc6ICdmYS1wZW5jaWwnLFxuICAgICAgICAgICAgICAgICcuYnRuLWRlbGV0ZSc6ICdmYS10cmFzaC1vJyxcbiAgICAgICAgICAgICAgICAnLmJ0bi1vcmRlcic6ICdmYS1zaG9wcGluZy1jYXJ0JyxcbiAgICAgICAgICAgICAgICAnLmJ0bi1jYXJldCc6ICdmYS1jYXJldC1yaWdodCcsXG4gICAgICAgICAgICAgICAgJy5idG4tZm9sZGVyJzogJ2ZhLWZvbGRlci1vcGVuJyxcbiAgICAgICAgICAgICAgICAnLmJ0bi1tdWx0aS1hY3Rpb24nOiAnZmEtY2hlY2stc3F1YXJlLW8nLFxuICAgICAgICAgICAgICAgICcuYnRuLWNhc2gnOiAnZmEtbW9uZXknLFxuICAgICAgICAgICAgICAgICcuYnRuLWFkZCc6ICdmYS1wbHVzJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gTGV0J3Mgcm9ja1xuICAgICAgICAgICAgJC5lYWNoKGNsYXNzZXMsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBvc2VkQ2xhc3NOYW1lID0gW1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgKG9wdGlvbnMubGFyZ2UgPyAnIGZhLWxnJyA6ICcnKSxcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRvZG8gXCJmaXhlZHdpZHRoXCIgbXVzdCBiZSBDYW1lbENhc2Ugb3IgdW5kZXJzY29yZV9zZXBhcmF0ZWQuXG4gICAgICAgICAgICAgICAgICAgIChvcHRpb25zLmZpeGVkd2lkdGggPyAnIGZhLWZ3JyA6ICcnKVxuICAgICAgICAgICAgICAgIF0uam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHRhZyA9ICQoJzxpIGNsYXNzPVwiZmEgJyArIGNvbXBvc2VkQ2xhc3NOYW1lICsgJ1wiPjwvaT4nKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKGtleSkucHJlcGVuZCgkdGFnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
