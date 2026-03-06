'use strict';

/* --------------------------------------------------------------
 tabs.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Tabs Widget
 *
 * This widget is a custom implementation of tabs functionality and must not be confused with
 * jQueryUI's tab widget.
 *
 * The actual `<div>` which contains the tabs, has to have a CSS-Class named **tab-headline-wrapper**.
 * The tabs will be identified by this CSS-Class. The content of the tabs has to be in a `<div>` which has to have
 * a CSS-Class called **tab-content-wrapper**. The elements inside, have to be in the same order as the tabs.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-widget="tabs">
 *   <!-- Tabs -->
 *   <div class="tab-headline-wrapper">
 *     <a href="#tab1">Tab #1</a>
 *     <a href="#tab2">Tab #2</a>
 *   </div>
 *
 *   <!-- Content -->
 *   <div class="tab-content-wrapper">
 *     <div>Content of tab #1.</div>
 *     <div>Content of tab #2.</div>
 *   </div>
 * </div>
 * ```
 *
 * @module Admin/Widgets/tabs
 */
gx.widgets.module('tabs', [], function (data) {

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
   * Headline Tags Selector
   *
   * @type {object}
   */
  $headlineTags = null,


  /**
   * Content Tags Selector
   *
   * @type {object}
   */
  $contentTags = null,


  /**
   * Default Options for Widget
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
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  /**
   * Click handler for the tabs onClick the content gets switched.
   *
   * @param {object} event jQuery event object contains information of the event.
   */
  var _clickHandler = function _clickHandler(event) {
    event.preventDefault();
    event.stopPropagation();

    $headlineTags.removeClass('active');

    var index = $(this).addClass('active').index();

    $contentTags.hide().eq(index).show();

    $this.trigger('shown:tab', { index: index });
  };

  /**
   * Handles external "show" event
   *
   * @param {object} event jQuery event object contains information of the event.
   * @param {number} tab index to show
   */
  var _showHandler = function _showHandler(event, index) {
    event.preventDefault();
    event.stopPropagation();
    $headlineTags.eq(index).trigger('click');
  };

  // ------------------------------------------------------------------------
  // INITIALIZE
  // ------------------------------------------------------------------------

  /**
   * Initialize method of the widget, called by the engine.
   */
  module.init = function (done) {
    $headlineTags = $this.children('.tab-headline-wrapper').children('a');

    $contentTags = $this.children('.tab-content-wrapper').children('div');

    $this.addClass('ui-tabs');
    $this.on('click', '.tab-headline-wrapper > a', _clickHandler);
    $this.on('show:tab', _showHandler);

    // Set first tab as selected.
    $headlineTags.eq(0).trigger('click');

    done();
  };

  // Return data to module engine
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhYnMuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRoZWFkbGluZVRhZ3MiLCIkY29udGVudFRhZ3MiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfY2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsInJlbW92ZUNsYXNzIiwiaW5kZXgiLCJhZGRDbGFzcyIsImhpZGUiLCJlcSIsInNob3ciLCJ0cmlnZ2VyIiwiX3Nob3dIYW5kbGVyIiwiaW5pdCIsImRvbmUiLCJjaGlsZHJlbiIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQUEsR0FBR0MsT0FBSCxDQUFXQyxNQUFYLENBQ0ksTUFESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxVQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGtCQUFnQixJQWJwQjs7O0FBZUk7Ozs7O0FBS0FDLGlCQUFlLElBcEJuQjs7O0FBc0JJOzs7OztBQUtBQyxhQUFXLEVBM0JmOzs7QUE2Qkk7Ozs7O0FBS0FDLFlBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJMLElBQTdCLENBbENkOzs7QUFvQ0k7Ozs7O0FBS0FELFdBQVMsRUF6Q2I7O0FBMkNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxNQUFJUyxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQVVDLEtBQVYsRUFBaUI7QUFDakNBLFVBQU1DLGNBQU47QUFDQUQsVUFBTUUsZUFBTjs7QUFFQVIsa0JBQWNTLFdBQWQsQ0FBMEIsUUFBMUI7O0FBRUEsUUFBSUMsUUFBUVgsRUFBRSxJQUFGLEVBQ1BZLFFBRE8sQ0FDRSxRQURGLEVBRVBELEtBRk8sRUFBWjs7QUFJQVQsaUJBQ0tXLElBREwsR0FFS0MsRUFGTCxDQUVRSCxLQUZSLEVBR0tJLElBSEw7O0FBS0FoQixVQUFNaUIsT0FBTixDQUFjLFdBQWQsRUFBMkIsRUFBQ0wsWUFBRCxFQUEzQjtBQUNILEdBaEJEOztBQWtCQTs7Ozs7O0FBTUEsTUFBSU0sZUFBZSxTQUFmQSxZQUFlLENBQVVWLEtBQVYsRUFBaUJJLEtBQWpCLEVBQXdCO0FBQ3ZDSixVQUFNQyxjQUFOO0FBQ0FELFVBQU1FLGVBQU47QUFDQVIsa0JBQWNhLEVBQWQsQ0FBaUJILEtBQWpCLEVBQXdCSyxPQUF4QixDQUFnQyxPQUFoQztBQUNILEdBSkQ7O0FBTUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQW5CLFNBQU9xQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQmxCLG9CQUFnQkYsTUFDWHFCLFFBRFcsQ0FDRix1QkFERSxFQUVYQSxRQUZXLENBRUYsR0FGRSxDQUFoQjs7QUFJQWxCLG1CQUFlSCxNQUNWcUIsUUFEVSxDQUNELHNCQURDLEVBRVZBLFFBRlUsQ0FFRCxLQUZDLENBQWY7O0FBSUFyQixVQUFNYSxRQUFOLENBQWUsU0FBZjtBQUNBYixVQUFNc0IsRUFBTixDQUFTLE9BQVQsRUFBa0IsMkJBQWxCLEVBQStDZixhQUEvQztBQUNBUCxVQUFNc0IsRUFBTixDQUFTLFVBQVQsRUFBcUJKLFlBQXJCOztBQUVBO0FBQ0FoQixrQkFDS2EsRUFETCxDQUNRLENBRFIsRUFFS0UsT0FGTCxDQUVhLE9BRmI7O0FBSUFHO0FBQ0gsR0FuQkQ7O0FBcUJBO0FBQ0EsU0FBT3RCLE1BQVA7QUFDSCxDQTdITCIsImZpbGUiOiJ0YWJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB0YWJzLmpzIDIwMTYtMDItMjNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFRhYnMgV2lkZ2V0XG4gKlxuICogVGhpcyB3aWRnZXQgaXMgYSBjdXN0b20gaW1wbGVtZW50YXRpb24gb2YgdGFicyBmdW5jdGlvbmFsaXR5IGFuZCBtdXN0IG5vdCBiZSBjb25mdXNlZCB3aXRoXG4gKiBqUXVlcnlVSSdzIHRhYiB3aWRnZXQuXG4gKlxuICogVGhlIGFjdHVhbCBgPGRpdj5gIHdoaWNoIGNvbnRhaW5zIHRoZSB0YWJzLCBoYXMgdG8gaGF2ZSBhIENTUy1DbGFzcyBuYW1lZCAqKnRhYi1oZWFkbGluZS13cmFwcGVyKiouXG4gKiBUaGUgdGFicyB3aWxsIGJlIGlkZW50aWZpZWQgYnkgdGhpcyBDU1MtQ2xhc3MuIFRoZSBjb250ZW50IG9mIHRoZSB0YWJzIGhhcyB0byBiZSBpbiBhIGA8ZGl2PmAgd2hpY2ggaGFzIHRvIGhhdmVcbiAqIGEgQ1NTLUNsYXNzIGNhbGxlZCAqKnRhYi1jb250ZW50LXdyYXBwZXIqKi4gVGhlIGVsZW1lbnRzIGluc2lkZSwgaGF2ZSB0byBiZSBpbiB0aGUgc2FtZSBvcmRlciBhcyB0aGUgdGFicy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJ0YWJzXCI+XG4gKiAgIDwhLS0gVGFicyAtLT5cbiAqICAgPGRpdiBjbGFzcz1cInRhYi1oZWFkbGluZS13cmFwcGVyXCI+XG4gKiAgICAgPGEgaHJlZj1cIiN0YWIxXCI+VGFiICMxPC9hPlxuICogICAgIDxhIGhyZWY9XCIjdGFiMlwiPlRhYiAjMjwvYT5cbiAqICAgPC9kaXY+XG4gKlxuICogICA8IS0tIENvbnRlbnQgLS0+XG4gKiAgIDxkaXYgY2xhc3M9XCJ0YWItY29udGVudC13cmFwcGVyXCI+XG4gKiAgICAgPGRpdj5Db250ZW50IG9mIHRhYiAjMS48L2Rpdj5cbiAqICAgICA8ZGl2PkNvbnRlbnQgb2YgdGFiICMyLjwvZGl2PlxuICogICA8L2Rpdj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3RhYnNcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ3RhYnMnLFxuXG4gICAgW10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBIZWFkbGluZSBUYWdzIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGhlYWRsaW5lVGFncyA9IG51bGwsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ29udGVudCBUYWdzIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGNvbnRlbnRUYWdzID0gbnVsbCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIFdpZGdldFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgdGFicyBvbkNsaWNrIHRoZSBjb250ZW50IGdldHMgc3dpdGNoZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICRoZWFkbGluZVRhZ3MucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5pbmRleCgpO1xuXG4gICAgICAgICAgICAkY29udGVudFRhZ3NcbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLmVxKGluZGV4KVxuICAgICAgICAgICAgICAgIC5zaG93KCk7XG5cbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3Nob3duOnRhYicsIHtpbmRleH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGV4dGVybmFsIFwic2hvd1wiIGV2ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHRhYiBpbmRleCB0byBzaG93XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Nob3dIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50LCBpbmRleCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgJGhlYWRsaW5lVGFncy5lcShpbmRleCkudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaRVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkaGVhZGxpbmVUYWdzID0gJHRoaXNcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJy50YWItaGVhZGxpbmUtd3JhcHBlcicpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdhJyk7XG5cbiAgICAgICAgICAgICRjb250ZW50VGFncyA9ICR0aGlzXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCcudGFiLWNvbnRlbnQtd3JhcHBlcicpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdkaXYnKTtcblxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3VpLXRhYnMnKTtcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsICcudGFiLWhlYWRsaW5lLXdyYXBwZXIgPiBhJywgX2NsaWNrSGFuZGxlcik7XG4gICAgICAgICAgICAkdGhpcy5vbignc2hvdzp0YWInLCBfc2hvd0hhbmRsZXIpO1xuXG4gICAgICAgICAgICAvLyBTZXQgZmlyc3QgdGFiIGFzIHNlbGVjdGVkLlxuICAgICAgICAgICAgJGhlYWRsaW5lVGFnc1xuICAgICAgICAgICAgICAgIC5lcSgwKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGljaycpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
