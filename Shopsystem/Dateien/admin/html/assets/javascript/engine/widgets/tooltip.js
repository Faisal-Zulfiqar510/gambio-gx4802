'use strict';

/* --------------------------------------------------------------
 tooltip.js 2016-09-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Tooltip Widget
 *
 * Enables qTip2 tooltips for child elements with a title attribute. You can change the default tooltip
 * position and other options, if you set a data-tooltip-position attribute to the parent element.
 *
 * **Important:** If you use this widgets on elements inside a modal then it will not work,
 * because the modal elements are reset before they are displayed.
 *
 * ### Example
 *
 * ```html
 * <form data-gx-widget="tooltip">
 *   <input type="text" title="This is a tooltip widget" />
 * </form>
 * ```
 *
 * @module Admin/Widgets/tooltip
 * @requires jQuery-qTip2-Plugin
 */
gx.widgets.module('tooltip', [jse.source + '/vendor/qtip2/jquery.qtip.css', jse.source + '/vendor/qtip2/jquery.qtip.js'],

/** @lends module:Widgets/tooltip */

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
        style: {
            classes: 'qtip-tipsy'
        },
        position: {
            my: data.positionMy || 'bottom+200 top center',
            at: data.positionAt || 'top center'
        }
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
        delete options.positionMy;
        delete options.positionAt;

        $this.find('[title]').qtip(options);
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwic3R5bGUiLCJjbGFzc2VzIiwicG9zaXRpb24iLCJteSIsInBvc2l0aW9uTXkiLCJhdCIsInBvc2l0aW9uQXQiLCJvcHRpb25zIiwiZXh0ZW5kIiwiaW5pdCIsImRvbmUiLCJmaW5kIiwicXRpcCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQUEsR0FBR0MsT0FBSCxDQUFXQyxNQUFYLENBQ0ksU0FESixFQUdJLENBQ09DLElBQUlDLE1BRFgsb0NBRU9ELElBQUlDLE1BRlgsa0NBSEo7O0FBUUk7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1BDLGVBQU87QUFDSEMscUJBQVM7QUFETixTQURBO0FBSVBDLGtCQUFVO0FBQ05DLGdCQUFJUCxLQUFLUSxVQUFMLElBQW1CLHVCQURqQjtBQUVOQyxnQkFBSVQsS0FBS1UsVUFBTCxJQUFtQjtBQUZqQjtBQUpILEtBYmY7OztBQXVCSTs7Ozs7QUFLQUMsY0FBVVQsRUFBRVUsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CVCxRQUFuQixFQUE2QkgsSUFBN0IsQ0E1QmQ7OztBQThCSTs7Ozs7QUFLQUgsYUFBUyxFQW5DYjs7QUFxQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQUEsV0FBT2dCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCLGVBQU9ILFFBQVFILFVBQWY7QUFDQSxlQUFPRyxRQUFRRCxVQUFmOztBQUVBVCxjQUFNYyxJQUFOLENBQVcsU0FBWCxFQUFzQkMsSUFBdEIsQ0FBMkJMLE9BQTNCO0FBQ0FHO0FBQ0gsS0FORDs7QUFRQTtBQUNBLFdBQU9qQixNQUFQO0FBQ0gsQ0F4RUwiLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gdG9vbHRpcC5qcyAyMDE2LTA5LTA5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBUb29sdGlwIFdpZGdldFxuICpcbiAqIEVuYWJsZXMgcVRpcDIgdG9vbHRpcHMgZm9yIGNoaWxkIGVsZW1lbnRzIHdpdGggYSB0aXRsZSBhdHRyaWJ1dGUuIFlvdSBjYW4gY2hhbmdlIHRoZSBkZWZhdWx0IHRvb2x0aXBcbiAqIHBvc2l0aW9uIGFuZCBvdGhlciBvcHRpb25zLCBpZiB5b3Ugc2V0IGEgZGF0YS10b29sdGlwLXBvc2l0aW9uIGF0dHJpYnV0ZSB0byB0aGUgcGFyZW50IGVsZW1lbnQuXG4gKlxuICogKipJbXBvcnRhbnQ6KiogSWYgeW91IHVzZSB0aGlzIHdpZGdldHMgb24gZWxlbWVudHMgaW5zaWRlIGEgbW9kYWwgdGhlbiBpdCB3aWxsIG5vdCB3b3JrLFxuICogYmVjYXVzZSB0aGUgbW9kYWwgZWxlbWVudHMgYXJlIHJlc2V0IGJlZm9yZSB0aGV5IGFyZSBkaXNwbGF5ZWQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybSBkYXRhLWd4LXdpZGdldD1cInRvb2x0aXBcIj5cbiAqICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdGl0bGU9XCJUaGlzIGlzIGEgdG9vbHRpcCB3aWRnZXRcIiAvPlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL3Rvb2x0aXBcbiAqIEByZXF1aXJlcyBqUXVlcnktcVRpcDItUGx1Z2luXG4gKi9cbmd4LndpZGdldHMubW9kdWxlKFxuICAgICd0b29sdGlwJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL3F0aXAyL2pxdWVyeS5xdGlwLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9xdGlwMi9qcXVlcnkucXRpcC5qc2BcbiAgICBdLFxuXG4gICAgLyoqIEBsZW5kcyBtb2R1bGU6V2lkZ2V0cy90b29sdGlwICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlczogJ3F0aXAtdGlwc3knXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBteTogZGF0YS5wb3NpdGlvbk15IHx8ICdib3R0b20rMjAwIHRvcCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBhdDogZGF0YS5wb3NpdGlvbkF0IHx8ICd0b3AgY2VudGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLnBvc2l0aW9uTXk7XG4gICAgICAgICAgICBkZWxldGUgb3B0aW9ucy5wb3NpdGlvbkF0O1xuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdbdGl0bGVdJykucXRpcChvcHRpb25zKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
