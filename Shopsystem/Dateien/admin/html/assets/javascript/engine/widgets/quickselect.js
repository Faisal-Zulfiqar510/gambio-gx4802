'use strict';

/* --------------------------------------------------------------
 quickselect.js 2017-09-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## QuickSelect Widget
 *
 * This widget is a custom implementation of tabs functionality.
 *
 * The actual `<div>` which contains the tabs, has to have a CSS-Class named **quickselect-headline-wrapper**.
 * The tabs will be identified by this CSS-Class. The content of the tabs has to be in a `<div>` which has to have
 * a CSS-Class called **quickselect-content-wrapper**. The elements inside, have to be in the same order as the tabs.
 *
 * ### Widget Instance Options
 *
 * **Tab alignment | `data-quickselect-align` | string | Optional**
 *
 * This option can be used to align the tabs (not the content). In some cases it is necessary to align th tabs itself
 * to righ right.
 *
 * **Start tab | `data-quickselect-start` | integer | Optional**
 *
 * This option can be used to choose a starting tab. Mind that 0 is associated with the first tab content.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-widget="quickselect" data-quickselect-align="left" data-quickselect-start="1">
 *     <!-- Tabs -->
 *     <div class="quickselect-headline-wrapper">
 *         <a href="#tab1">Tab #1</a>
 *         <a href="#tab2">Tab #2</a>
 *         <a href="#tab3">Tab #3</a>
 *     </div>
 *
 *     <!-- Content -->
 *     <div class="quickselect-content-wrapper">
 *         <div>Content of tab #1.</div>
 *         <div>Content of tab #2.</div>
 *         <div>Content of tab #3.</div>
 *     </div>
 * </div>
 * ```
 *
 * @module Admin/Widgets/quickselect
 */
gx.widgets.module('quickselect', [], function (data) {

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
        $headlineTags = $this.children('.quickselect-headline-wrapper').children('a');

        $contentTags = $this.children('.quickselect-content-wrapper').children('div');

        $this.addClass('ui-tabs');
        $this.on('click', '.quickselect-headline-wrapper > a', _clickHandler);
        $this.on('show:tab', _showHandler);

        if (options.align == 'right') {
            $this.children('.quickselect-headline-wrapper').css("float", "right");
        }

        if (Number.isInteger(options.start)) {
            $headlineTags.eq(options.start).trigger('click');
        } else {
            $headlineTags.eq(0).trigger('click');
        }

        done();
    };

    // Return data to module engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrc2VsZWN0LmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkaGVhZGxpbmVUYWdzIiwiJGNvbnRlbnRUYWdzIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NsaWNrSGFuZGxlciIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJyZW1vdmVDbGFzcyIsImluZGV4IiwiYWRkQ2xhc3MiLCJoaWRlIiwiZXEiLCJzaG93IiwidHJpZ2dlciIsIl9zaG93SGFuZGxlciIsImluaXQiLCJkb25lIiwiY2hpbGRyZW4iLCJvbiIsImFsaWduIiwiY3NzIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwic3RhcnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMENBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxhQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsb0JBQWdCLElBYnBCOzs7QUFlSTs7Ozs7QUFLQUMsbUJBQWUsSUFwQm5COzs7QUFzQkk7Ozs7O0FBS0FDLGVBQVcsRUEzQmY7OztBQTZCSTs7Ozs7QUFLQUMsY0FBVUosRUFBRUssTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkwsSUFBN0IsQ0FsQ2Q7OztBQW9DSTs7Ozs7QUFLQUQsYUFBUyxFQXpDYjs7QUEyQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFFBQUlTLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVUMsS0FBVixFQUFpQjtBQUNqQ0EsY0FBTUMsY0FBTjtBQUNBRCxjQUFNRSxlQUFOOztBQUVBUixzQkFBY1MsV0FBZCxDQUEwQixRQUExQjs7QUFFQSxZQUFJQyxRQUFRWCxFQUFFLElBQUYsRUFDUFksUUFETyxDQUNFLFFBREYsRUFFUEQsS0FGTyxFQUFaOztBQUlBVCxxQkFDS1csSUFETCxHQUVLQyxFQUZMLENBRVFILEtBRlIsRUFHS0ksSUFITDs7QUFLQWhCLGNBQU1pQixPQUFOLENBQWMsV0FBZCxFQUEyQixFQUFDTCxZQUFELEVBQTNCO0FBQ0gsS0FoQkQ7O0FBa0JBOzs7Ozs7QUFNQSxRQUFJTSxlQUFlLFNBQWZBLFlBQWUsQ0FBVVYsS0FBVixFQUFpQkksS0FBakIsRUFBd0I7QUFDdkNKLGNBQU1DLGNBQU47QUFDQUQsY0FBTUUsZUFBTjtBQUNBUixzQkFBY2EsRUFBZCxDQUFpQkgsS0FBakIsRUFBd0JLLE9BQXhCLENBQWdDLE9BQWhDO0FBQ0gsS0FKRDs7QUFNQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBbkIsV0FBT3FCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCbEIsd0JBQWdCRixNQUNYcUIsUUFEVyxDQUNGLCtCQURFLEVBRVhBLFFBRlcsQ0FFRixHQUZFLENBQWhCOztBQUlBbEIsdUJBQWVILE1BQ1ZxQixRQURVLENBQ0QsOEJBREMsRUFFVkEsUUFGVSxDQUVELEtBRkMsQ0FBZjs7QUFJQXJCLGNBQU1hLFFBQU4sQ0FBZSxTQUFmO0FBQ0FiLGNBQU1zQixFQUFOLENBQVMsT0FBVCxFQUFrQixtQ0FBbEIsRUFBdURmLGFBQXZEO0FBQ0FQLGNBQU1zQixFQUFOLENBQVMsVUFBVCxFQUFxQkosWUFBckI7O0FBRUEsWUFBSWIsUUFBUWtCLEtBQVIsSUFBaUIsT0FBckIsRUFBOEI7QUFDMUJ2QixrQkFBTXFCLFFBQU4sQ0FBZSwrQkFBZixFQUFnREcsR0FBaEQsQ0FBb0QsT0FBcEQsRUFBNkQsT0FBN0Q7QUFDSDs7QUFFRCxZQUFJQyxPQUFPQyxTQUFQLENBQWlCckIsUUFBUXNCLEtBQXpCLENBQUosRUFBcUM7QUFDakN6QiwwQkFDS2EsRUFETCxDQUNRVixRQUFRc0IsS0FEaEIsRUFFS1YsT0FGTCxDQUVhLE9BRmI7QUFHSCxTQUpELE1BSU87QUFDSGYsMEJBQ0thLEVBREwsQ0FDUSxDQURSLEVBRUtFLE9BRkwsQ0FFYSxPQUZiO0FBR0g7O0FBRURHO0FBQ0gsS0E1QkQ7O0FBOEJBO0FBQ0EsV0FBT3RCLE1BQVA7QUFDSCxDQXRJTCIsImZpbGUiOiJxdWlja3NlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcXVpY2tzZWxlY3QuanMgMjAxNy0wOS0wNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgUXVpY2tTZWxlY3QgV2lkZ2V0XG4gKlxuICogVGhpcyB3aWRnZXQgaXMgYSBjdXN0b20gaW1wbGVtZW50YXRpb24gb2YgdGFicyBmdW5jdGlvbmFsaXR5LlxuICpcbiAqIFRoZSBhY3R1YWwgYDxkaXY+YCB3aGljaCBjb250YWlucyB0aGUgdGFicywgaGFzIHRvIGhhdmUgYSBDU1MtQ2xhc3MgbmFtZWQgKipxdWlja3NlbGVjdC1oZWFkbGluZS13cmFwcGVyKiouXG4gKiBUaGUgdGFicyB3aWxsIGJlIGlkZW50aWZpZWQgYnkgdGhpcyBDU1MtQ2xhc3MuIFRoZSBjb250ZW50IG9mIHRoZSB0YWJzIGhhcyB0byBiZSBpbiBhIGA8ZGl2PmAgd2hpY2ggaGFzIHRvIGhhdmVcbiAqIGEgQ1NTLUNsYXNzIGNhbGxlZCAqKnF1aWNrc2VsZWN0LWNvbnRlbnQtd3JhcHBlcioqLiBUaGUgZWxlbWVudHMgaW5zaWRlLCBoYXZlIHRvIGJlIGluIHRoZSBzYW1lIG9yZGVyIGFzIHRoZSB0YWJzLlxuICpcbiAqICMjIyBXaWRnZXQgSW5zdGFuY2UgT3B0aW9uc1xuICpcbiAqICoqVGFiIGFsaWdubWVudCB8IGBkYXRhLXF1aWNrc2VsZWN0LWFsaWduYCB8IHN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBUaGlzIG9wdGlvbiBjYW4gYmUgdXNlZCB0byBhbGlnbiB0aGUgdGFicyAobm90IHRoZSBjb250ZW50KS4gSW4gc29tZSBjYXNlcyBpdCBpcyBuZWNlc3NhcnkgdG8gYWxpZ24gdGggdGFicyBpdHNlbGZcbiAqIHRvIHJpZ2ggcmlnaHQuXG4gKlxuICogKipTdGFydCB0YWIgfCBgZGF0YS1xdWlja3NlbGVjdC1zdGFydGAgfCBpbnRlZ2VyIHwgT3B0aW9uYWwqKlxuICpcbiAqIFRoaXMgb3B0aW9uIGNhbiBiZSB1c2VkIHRvIGNob29zZSBhIHN0YXJ0aW5nIHRhYi4gTWluZCB0aGF0IDAgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBmaXJzdCB0YWIgY29udGVudC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC13aWRnZXQ9XCJxdWlja3NlbGVjdFwiIGRhdGEtcXVpY2tzZWxlY3QtYWxpZ249XCJsZWZ0XCIgZGF0YS1xdWlja3NlbGVjdC1zdGFydD1cIjFcIj5cbiAqICAgICA8IS0tIFRhYnMgLS0+XG4gKiAgICAgPGRpdiBjbGFzcz1cInF1aWNrc2VsZWN0LWhlYWRsaW5lLXdyYXBwZXJcIj5cbiAqICAgICAgICAgPGEgaHJlZj1cIiN0YWIxXCI+VGFiICMxPC9hPlxuICogICAgICAgICA8YSBocmVmPVwiI3RhYjJcIj5UYWIgIzI8L2E+XG4gKiAgICAgICAgIDxhIGhyZWY9XCIjdGFiM1wiPlRhYiAjMzwvYT5cbiAqICAgICA8L2Rpdj5cbiAqXG4gKiAgICAgPCEtLSBDb250ZW50IC0tPlxuICogICAgIDxkaXYgY2xhc3M9XCJxdWlja3NlbGVjdC1jb250ZW50LXdyYXBwZXJcIj5cbiAqICAgICAgICAgPGRpdj5Db250ZW50IG9mIHRhYiAjMS48L2Rpdj5cbiAqICAgICAgICAgPGRpdj5Db250ZW50IG9mIHRhYiAjMi48L2Rpdj5cbiAqICAgICAgICAgPGRpdj5Db250ZW50IG9mIHRhYiAjMy48L2Rpdj5cbiAqICAgICA8L2Rpdj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3F1aWNrc2VsZWN0XG4gKi9cbmd4LndpZGdldHMubW9kdWxlKFxuICAgICdxdWlja3NlbGVjdCcsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEhlYWRsaW5lIFRhZ3MgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkaGVhZGxpbmVUYWdzID0gbnVsbCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb250ZW50IFRhZ3MgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkY29udGVudFRhZ3MgPSBudWxsLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9ucyBmb3IgV2lkZ2V0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgZm9yIHRoZSB0YWJzIG9uQ2xpY2sgdGhlIGNvbnRlbnQgZ2V0cyBzd2l0Y2hlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgJGhlYWRsaW5lVGFncy5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICAgICAgLmluZGV4KCk7XG5cbiAgICAgICAgICAgICRjb250ZW50VGFnc1xuICAgICAgICAgICAgICAgIC5oaWRlKClcbiAgICAgICAgICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgICAgICAgICAgLnNob3coKTtcblxuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcignc2hvd246dGFiJywge2luZGV4fSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgZXh0ZXJuYWwgXCJzaG93XCIgZXZlbnRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gdGFiIGluZGV4IHRvIHNob3dcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2hvd0hhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQsIGluZGV4KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAkaGVhZGxpbmVUYWdzLmVxKGluZGV4KS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpFXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICRoZWFkbGluZVRhZ3MgPSAkdGhpc1xuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignLnF1aWNrc2VsZWN0LWhlYWRsaW5lLXdyYXBwZXInKVxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignYScpO1xuXG4gICAgICAgICAgICAkY29udGVudFRhZ3MgPSAkdGhpc1xuICAgICAgICAgICAgICAgIC5jaGlsZHJlbignLnF1aWNrc2VsZWN0LWNvbnRlbnQtd3JhcHBlcicpXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdkaXYnKTtcblxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ3VpLXRhYnMnKTtcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsICcucXVpY2tzZWxlY3QtaGVhZGxpbmUtd3JhcHBlciA+IGEnLCBfY2xpY2tIYW5kbGVyKTtcbiAgICAgICAgICAgICR0aGlzLm9uKCdzaG93OnRhYicsIF9zaG93SGFuZGxlcik7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFsaWduID09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5jaGlsZHJlbignLnF1aWNrc2VsZWN0LWhlYWRsaW5lLXdyYXBwZXInKS5jc3MoXCJmbG9hdFwiLCBcInJpZ2h0XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLnN0YXJ0KSkge1xuICAgICAgICAgICAgICAgICRoZWFkbGluZVRhZ3NcbiAgICAgICAgICAgICAgICAgICAgLmVxKG9wdGlvbnMuc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaGVhZGxpbmVUYWdzXG4gICAgICAgICAgICAgICAgICAgIC5lcSgwKVxuICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmVcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
