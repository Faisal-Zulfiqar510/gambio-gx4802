'use strict';

/* --------------------------------------------------------------
 product_tooltip.js 2016-03-31
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Product Tooltip
 *
 * This controller displays a tooltip when hovering the product name.
 *
 * Use attribute 'data-product_tooltip-image-url' to set the image url to load.
 * Use attribute 'data-product_tooltip-description' to set the text content.
 *
 * @module Controllers/product_tooltip
 */
gx.controllers.module('product_tooltip', [jse.source + '/vendor/qtip2/jquery.qtip.min.css', jse.source + '/vendor/qtip2/jquery.qtip.min.js'],

/**  @lends module:Controllers/product_tooltip */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @var {object}
     */
    $this = $(this),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {},


    /**
     * qTip plugin options object.
     * @type {Object}
     */
    tooltipOptions = {
        style: {
            classes: 'gx-container gx-qtip info large'
        },
        position: {
            my: 'left top',
            at: 'right bottom'
        }
    },


    /**
     * Hover trigger.
     * @type {jQuery}
     */
    $trigger = $this.find('[data-tooltip-trigger]');

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Prepares the tooltip content by fetching the image and setting the description.
     * @param {jQuery.Event} event Hover event.
     * @param {Object} api qTip plugin internal API.
     * @private
     */
    var _getContent = function _getContent(event, api) {
        var $content = $('<div/>');

        var $description = $.parseHTML(data.description);
        $content.append($description);

        // Fetch image.
        var image = new Image();
        $(image).load(function () {
            var $imageContainer = $('<div class="text-center" style="margin-bottom: 24px;"></div>');

            $imageContainer.append($('<br>')).prepend(image);

            $content.prepend($imageContainer);

            // Set new tooltip content.
            api.set('content.text', $content);
        }).attr({ src: data.imageUrl });

        return $content;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        if ($trigger.length) {
            var options = $.extend(true, tooltipOptions, { content: { text: _getContent } });
            $trigger.qtip(options);
        } else {
            throw new Error('Could not find trigger element');
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3QvcHJvZHVjdF90b29sdGlwLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwidG9vbHRpcE9wdGlvbnMiLCJzdHlsZSIsImNsYXNzZXMiLCJwb3NpdGlvbiIsIm15IiwiYXQiLCIkdHJpZ2dlciIsImZpbmQiLCJfZ2V0Q29udGVudCIsImV2ZW50IiwiYXBpIiwiJGNvbnRlbnQiLCIkZGVzY3JpcHRpb24iLCJwYXJzZUhUTUwiLCJkZXNjcmlwdGlvbiIsImFwcGVuZCIsImltYWdlIiwiSW1hZ2UiLCJsb2FkIiwiJGltYWdlQ29udGFpbmVyIiwicHJlcGVuZCIsInNldCIsImF0dHIiLCJzcmMiLCJpbWFnZVVybCIsImluaXQiLCJkb25lIiwibGVuZ3RoIiwib3B0aW9ucyIsImV4dGVuZCIsImNvbnRlbnQiLCJ0ZXh0IiwicXRpcCIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksaUJBREosRUFHSSxDQUNJQyxJQUFJQyxNQUFKLEdBQWEsbUNBRGpCLEVBRUlELElBQUlDLE1BQUosR0FBYSxrQ0FGakIsQ0FISjs7QUFRSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FMLGFBQVMsRUFiYjs7O0FBZUk7Ozs7QUFJQU0scUJBQWlCO0FBQ2JDLGVBQU87QUFDSEMscUJBQVM7QUFETixTQURNO0FBSWJDLGtCQUFVO0FBQ05DLGdCQUFJLFVBREU7QUFFTkMsZ0JBQUk7QUFGRTtBQUpHLEtBbkJyQjs7O0FBNkJJOzs7O0FBSUFDLGVBQVdSLE1BQU1TLElBQU4sQ0FBVyx3QkFBWCxDQWpDZjs7QUFtQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFNQSxRQUFJQyxjQUFjLFNBQWRBLFdBQWMsQ0FBVUMsS0FBVixFQUFpQkMsR0FBakIsRUFBc0I7QUFDcEMsWUFBSUMsV0FBV1osRUFBRSxRQUFGLENBQWY7O0FBRUEsWUFBSWEsZUFBZWIsRUFBRWMsU0FBRixDQUFZaEIsS0FBS2lCLFdBQWpCLENBQW5CO0FBQ0FILGlCQUFTSSxNQUFULENBQWdCSCxZQUFoQjs7QUFFQTtBQUNBLFlBQUlJLFFBQVEsSUFBSUMsS0FBSixFQUFaO0FBQ0FsQixVQUFFaUIsS0FBRixFQUNLRSxJQURMLENBQ1UsWUFBWTtBQUNkLGdCQUFJQyxrQkFBa0JwQixFQUFFLDhEQUFGLENBQXRCOztBQUVBb0IsNEJBQ0tKLE1BREwsQ0FDWWhCLEVBQUUsTUFBRixDQURaLEVBRUtxQixPQUZMLENBRWFKLEtBRmI7O0FBSUFMLHFCQUFTUyxPQUFULENBQWlCRCxlQUFqQjs7QUFFQTtBQUNBVCxnQkFBSVcsR0FBSixDQUFRLGNBQVIsRUFBd0JWLFFBQXhCO0FBQ0gsU0FaTCxFQWFLVyxJQWJMLENBYVUsRUFBQ0MsS0FBSzFCLEtBQUsyQixRQUFYLEVBYlY7O0FBZUEsZUFBT2IsUUFBUDtBQUNILEtBeEJEOztBQTBCQTtBQUNBO0FBQ0E7O0FBRUFqQixXQUFPK0IsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUIsWUFBSXBCLFNBQVNxQixNQUFiLEVBQXFCO0FBQ2pCLGdCQUFJQyxVQUFVN0IsRUFBRThCLE1BQUYsQ0FBUyxJQUFULEVBQWU3QixjQUFmLEVBQStCLEVBQUM4QixTQUFTLEVBQUNDLE1BQU12QixXQUFQLEVBQVYsRUFBL0IsQ0FBZDtBQUNBRixxQkFBUzBCLElBQVQsQ0FBY0osT0FBZDtBQUNILFNBSEQsTUFHTztBQUNILGtCQUFNLElBQUlLLEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQ0g7O0FBRURQO0FBQ0gsS0FURDs7QUFXQSxXQUFPaEMsTUFBUDtBQUNILENBekdMIiwiZmlsZSI6InByb2R1Y3QvcHJvZHVjdF90b29sdGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBwcm9kdWN0X3Rvb2x0aXAuanMgMjAxNi0wMy0zMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgUHJvZHVjdCBUb29sdGlwXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGRpc3BsYXlzIGEgdG9vbHRpcCB3aGVuIGhvdmVyaW5nIHRoZSBwcm9kdWN0IG5hbWUuXG4gKlxuICogVXNlIGF0dHJpYnV0ZSAnZGF0YS1wcm9kdWN0X3Rvb2x0aXAtaW1hZ2UtdXJsJyB0byBzZXQgdGhlIGltYWdlIHVybCB0byBsb2FkLlxuICogVXNlIGF0dHJpYnV0ZSAnZGF0YS1wcm9kdWN0X3Rvb2x0aXAtZGVzY3JpcHRpb24nIHRvIHNldCB0aGUgdGV4dCBjb250ZW50LlxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvcHJvZHVjdF90b29sdGlwXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAncHJvZHVjdF90b29sdGlwJyxcblxuICAgIFtcbiAgICAgICAganNlLnNvdXJjZSArICcvdmVuZG9yL3F0aXAyL2pxdWVyeS5xdGlwLm1pbi5jc3MnLFxuICAgICAgICBqc2Uuc291cmNlICsgJy92ZW5kb3IvcXRpcDIvanF1ZXJ5LnF0aXAubWluLmpzJ1xuICAgIF0sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29udHJvbGxlcnMvcHJvZHVjdF90b29sdGlwICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBxVGlwIHBsdWdpbiBvcHRpb25zIG9iamVjdC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRvb2x0aXBPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdneC1jb250YWluZXIgZ3gtcXRpcCBpbmZvIGxhcmdlJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgbXk6ICdsZWZ0IHRvcCcsXG4gICAgICAgICAgICAgICAgICAgIGF0OiAncmlnaHQgYm90dG9tJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSG92ZXIgdHJpZ2dlci5cbiAgICAgICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0cmlnZ2VyID0gJHRoaXMuZmluZCgnW2RhdGEtdG9vbHRpcC10cmlnZ2VyXScpO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFByZXBhcmVzIHRoZSB0b29sdGlwIGNvbnRlbnQgYnkgZmV0Y2hpbmcgdGhlIGltYWdlIGFuZCBzZXR0aW5nIHRoZSBkZXNjcmlwdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IEhvdmVyIGV2ZW50LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYXBpIHFUaXAgcGx1Z2luIGludGVybmFsIEFQSS5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZ2V0Q29udGVudCA9IGZ1bmN0aW9uIChldmVudCwgYXBpKSB7XG4gICAgICAgICAgICB2YXIgJGNvbnRlbnQgPSAkKCc8ZGl2Lz4nKTtcblxuICAgICAgICAgICAgdmFyICRkZXNjcmlwdGlvbiA9ICQucGFyc2VIVE1MKGRhdGEuZGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgJGNvbnRlbnQuYXBwZW5kKCRkZXNjcmlwdGlvbik7XG5cbiAgICAgICAgICAgIC8vIEZldGNoIGltYWdlLlxuICAgICAgICAgICAgdmFyIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAkKGltYWdlKVxuICAgICAgICAgICAgICAgIC5sb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRpbWFnZUNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMjRweDtcIj48L2Rpdj4nKTtcblxuICAgICAgICAgICAgICAgICAgICAkaW1hZ2VDb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJCgnPGJyPicpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnByZXBlbmQoaW1hZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICRjb250ZW50LnByZXBlbmQoJGltYWdlQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgbmV3IHRvb2x0aXAgY29udGVudC5cbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldCgnY29udGVudC50ZXh0JywgJGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmF0dHIoe3NyYzogZGF0YS5pbWFnZVVybH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gJGNvbnRlbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGlmICgkdHJpZ2dlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHRvb2x0aXBPcHRpb25zLCB7Y29udGVudDoge3RleHQ6IF9nZXRDb250ZW50fX0pO1xuICAgICAgICAgICAgICAgICR0cmlnZ2VyLnF0aXAob3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgdHJpZ2dlciBlbGVtZW50Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
