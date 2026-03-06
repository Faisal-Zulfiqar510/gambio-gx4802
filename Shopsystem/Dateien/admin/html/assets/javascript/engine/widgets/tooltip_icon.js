'use strict';

/* --------------------------------------------------------------
 tooltip_icon.js 2018-08-09 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Tooltip Icon Widget
 *
 * This widget will automatically transform the following markup to an icon widget.
 *
 * ### Options
 *
 * **Type | `data-tooltip_icon-type` | String | Optional**
 *
 * The type of the tooltip icon. Possible options are `'info'` and `'warning'`.
 *
 * ### Example
 *
 * ```html
 * <div class="gx-container" style="width:50px">
 *   <span data-gx-widget="tooltip_icon" data-tooltip_icon-type="warning">
 *     This is the tooltip content of the warning tooltip icon.
 *   </span>
 *   <span data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
 *     This is the tooltip content of the info tooltip icon.
 *   </span>
 * </div>
 * ```
 * **Note:** Currently, the wrapping `<div>` of the tooltip icon widget, has to have a CSS-Style
 * of `50px`.
 *
 * @todo Make sure to set the width automatically. Currently, a style of 50px has to be applied manually.
 * @module Admin/Widgets/tooltip_icon
 */
gx.widgets.module('tooltip_icon', [jse.source + '/vendor/qtip2/jquery.qtip.css', jse.source + '/vendor/qtip2/jquery.qtip.js'],

/**  @lends module:Widgets/tooltip_icon */

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
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        type: 'info'
    },


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Gets the content and tries to add the
     * images at "Configuration > Image-Options" to the content.
     * @returns {String | HTML}
     */
    var _getContent = function _getContent() {
        // Is this from a configuration.php row?
        var $parentConfigRow = $this.parents('[data-config-key]:first');
        var isConfigRow = !!$parentConfigRow.length;

        // Try to get image and append it to the tooltip description
        if (isConfigRow) {
            var $image = $parentConfigRow.find('img:first');
            var hasImage = !!$image.length;

            if (hasImage) {
                $this.append('<br><br>');
                $this.append($image);
            }
        }

        return $this.html();
    };

    /**
     * Get the image tag element selector for the widget.
     *
     * This method will return a different image depending on the provided type option.
     */
    var _getImageElement = function _getImageElement() {
        var $icon;

        switch (options.type) {
            case 'warning':
                $icon = $('<span class="gx-container tooltip-icon pull-left ' + options.type + '">' + '<i class="fa fa-exclamation-triangle"></i>' + '</span>');
                break;
            case 'info':
                $icon = $('<span class="gx-container tooltip-icon ' + options.type + '">' + '<i class="fa fa-info-circle"></i>' + '</span>');
                break;
        }

        $icon.qtip({
            content: _getContent(),
            style: {
                classes: 'gx-container gx-qtip ' + options.type // use the type as a class for styling
            },
            position: {
                my: options.type === 'warning' ? 'bottom left' : 'left center',
                at: options.type === 'warning' ? 'top left' : 'right center',
                viewport: $(window)
            },
            hide: { // Delay the tooltip hide by 300ms so that users can interact with it.
                fixed: true,
                delay: 300
            }
        });

        return $icon;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        if ($this.text().replace(/\s+/, '') !== '') {
            var $icon = _getImageElement();

            $this.text('');

            $icon.appendTo($this);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXBfaWNvbi5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJ0eXBlIiwib3B0aW9ucyIsImV4dGVuZCIsIl9nZXRDb250ZW50IiwiJHBhcmVudENvbmZpZ1JvdyIsInBhcmVudHMiLCJpc0NvbmZpZ1JvdyIsImxlbmd0aCIsIiRpbWFnZSIsImZpbmQiLCJoYXNJbWFnZSIsImFwcGVuZCIsImh0bWwiLCJfZ2V0SW1hZ2VFbGVtZW50IiwiJGljb24iLCJxdGlwIiwiY29udGVudCIsInN0eWxlIiwiY2xhc3NlcyIsInBvc2l0aW9uIiwibXkiLCJhdCIsInZpZXdwb3J0Iiwid2luZG93IiwiaGlkZSIsImZpeGVkIiwiZGVsYXkiLCJpbml0IiwiZG9uZSIsInRleHQiLCJyZXBsYWNlIiwiYXBwZW5kVG8iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkFBLEdBQUdDLE9BQUgsQ0FBV0MsTUFBWCxDQUNJLGNBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLG9DQUVPRCxJQUFJQyxNQUZYLGtDQUhKOztBQVFJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVztBQUNQQyxjQUFNO0FBREMsS0FiZjs7O0FBaUJJOzs7OztBQUtBQyxjQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJILFFBQW5CLEVBQTZCSCxJQUE3QixDQXRCZDs7O0FBd0JJOzs7OztBQUtBSCxhQUFTLEVBN0JiOztBQStCQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsUUFBSVUsY0FBYyxTQUFkQSxXQUFjLEdBQVk7QUFDMUI7QUFDQSxZQUFJQyxtQkFBbUJQLE1BQU1RLE9BQU4sQ0FBYyx5QkFBZCxDQUF2QjtBQUNBLFlBQUlDLGNBQWMsQ0FBQyxDQUFDRixpQkFBaUJHLE1BQXJDOztBQUVBO0FBQ0EsWUFBSUQsV0FBSixFQUFpQjtBQUNiLGdCQUFJRSxTQUFTSixpQkFBaUJLLElBQWpCLENBQXNCLFdBQXRCLENBQWI7QUFDQSxnQkFBSUMsV0FBVyxDQUFDLENBQUNGLE9BQU9ELE1BQXhCOztBQUVBLGdCQUFJRyxRQUFKLEVBQWM7QUFDVmIsc0JBQU1jLE1BQU4sQ0FBYSxVQUFiO0FBQ0FkLHNCQUFNYyxNQUFOLENBQWFILE1BQWI7QUFDSDtBQUNKOztBQUVELGVBQU9YLE1BQU1lLElBQU4sRUFBUDtBQUVILEtBbEJEOztBQW9CQTs7Ozs7QUFLQSxRQUFJQyxtQkFBbUIsU0FBbkJBLGdCQUFtQixHQUFZO0FBQy9CLFlBQUlDLEtBQUo7O0FBRUEsZ0JBQVFiLFFBQVFELElBQWhCO0FBQ0ksaUJBQUssU0FBTDtBQUNJYyx3QkFBUWhCLEVBQUUsc0RBQXNERyxRQUFRRCxJQUE5RCxHQUFxRSxJQUFyRSxHQUNOLDRDQURNLEdBRU4sU0FGSSxDQUFSO0FBR0E7QUFDSixpQkFBSyxNQUFMO0FBQ0ljLHdCQUFRaEIsRUFBRSw0Q0FBNENHLFFBQVFELElBQXBELEdBQTJELElBQTNELEdBQ04sbUNBRE0sR0FFTixTQUZJLENBQVI7QUFHQTtBQVZSOztBQWFBYyxjQUFNQyxJQUFOLENBQVc7QUFDUEMscUJBQVNiLGFBREY7QUFFUGMsbUJBQU87QUFDSEMseUJBQVMsMEJBQTBCakIsUUFBUUQsSUFEeEMsQ0FDNkM7QUFEN0MsYUFGQTtBQUtQbUIsc0JBQVU7QUFDTkMsb0JBQUluQixRQUFRRCxJQUFSLEtBQWlCLFNBQWpCLEdBQTZCLGFBQTdCLEdBQTZDLGFBRDNDO0FBRU5xQixvQkFBSXBCLFFBQVFELElBQVIsS0FBaUIsU0FBakIsR0FBNkIsVUFBN0IsR0FBMEMsY0FGeEM7QUFHTnNCLDBCQUFVeEIsRUFBRXlCLE1BQUY7QUFISixhQUxIO0FBVVBDLGtCQUFNLEVBQUU7QUFDSkMsdUJBQU8sSUFETDtBQUVGQyx1QkFBTztBQUZMO0FBVkMsU0FBWDs7QUFnQkEsZUFBT1osS0FBUDtBQUNILEtBakNEOztBQW1DQTtBQUNBO0FBQ0E7O0FBRUFyQixXQUFPa0MsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7O0FBRTFCLFlBQUkvQixNQUFNZ0MsSUFBTixHQUFhQyxPQUFiLENBQXFCLEtBQXJCLEVBQTRCLEVBQTVCLE1BQW9DLEVBQXhDLEVBQTRDO0FBQ3hDLGdCQUFJaEIsUUFBUUQsa0JBQVo7O0FBRUFoQixrQkFBTWdDLElBQU4sQ0FBVyxFQUFYOztBQUVBZixrQkFBTWlCLFFBQU4sQ0FBZWxDLEtBQWY7QUFDSDs7QUFFRCtCO0FBQ0gsS0FYRDs7QUFhQSxXQUFPbkMsTUFBUDtBQUNILENBeElMIiwiZmlsZSI6InRvb2x0aXBfaWNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gdG9vbHRpcF9pY29uLmpzIDIwMTgtMDgtMDkgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFRvb2x0aXAgSWNvbiBXaWRnZXRcbiAqXG4gKiBUaGlzIHdpZGdldCB3aWxsIGF1dG9tYXRpY2FsbHkgdHJhbnNmb3JtIHRoZSBmb2xsb3dpbmcgbWFya3VwIHRvIGFuIGljb24gd2lkZ2V0LlxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipUeXBlIHwgYGRhdGEtdG9vbHRpcF9pY29uLXR5cGVgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFRoZSB0eXBlIG9mIHRoZSB0b29sdGlwIGljb24uIFBvc3NpYmxlIG9wdGlvbnMgYXJlIGAnaW5mbydgIGFuZCBgJ3dhcm5pbmcnYC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgY2xhc3M9XCJneC1jb250YWluZXJcIiBzdHlsZT1cIndpZHRoOjUwcHhcIj5cbiAqICAgPHNwYW4gZGF0YS1neC13aWRnZXQ9XCJ0b29sdGlwX2ljb25cIiBkYXRhLXRvb2x0aXBfaWNvbi10eXBlPVwid2FybmluZ1wiPlxuICogICAgIFRoaXMgaXMgdGhlIHRvb2x0aXAgY29udGVudCBvZiB0aGUgd2FybmluZyB0b29sdGlwIGljb24uXG4gKiAgIDwvc3Bhbj5cbiAqICAgPHNwYW4gZGF0YS1neC13aWRnZXQ9XCJ0b29sdGlwX2ljb25cIiBkYXRhLXRvb2x0aXBfaWNvbi10eXBlPVwiaW5mb1wiPlxuICogICAgIFRoaXMgaXMgdGhlIHRvb2x0aXAgY29udGVudCBvZiB0aGUgaW5mbyB0b29sdGlwIGljb24uXG4gKiAgIDwvc3Bhbj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKiAqKk5vdGU6KiogQ3VycmVudGx5LCB0aGUgd3JhcHBpbmcgYDxkaXY+YCBvZiB0aGUgdG9vbHRpcCBpY29uIHdpZGdldCwgaGFzIHRvIGhhdmUgYSBDU1MtU3R5bGVcbiAqIG9mIGA1MHB4YC5cbiAqXG4gKiBAdG9kbyBNYWtlIHN1cmUgdG8gc2V0IHRoZSB3aWR0aCBhdXRvbWF0aWNhbGx5LiBDdXJyZW50bHksIGEgc3R5bGUgb2YgNTBweCBoYXMgdG8gYmUgYXBwbGllZCBtYW51YWxseS5cbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy90b29sdGlwX2ljb25cbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ3Rvb2x0aXBfaWNvbicsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9xdGlwMi9qcXVlcnkucXRpcC5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvcXRpcDIvanF1ZXJ5LnF0aXAuanNgXG4gICAgXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpXaWRnZXRzL3Rvb2x0aXBfaWNvbiAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5mbydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldHMgdGhlIGNvbnRlbnQgYW5kIHRyaWVzIHRvIGFkZCB0aGVcbiAgICAgICAgICogaW1hZ2VzIGF0IFwiQ29uZmlndXJhdGlvbiA+IEltYWdlLU9wdGlvbnNcIiB0byB0aGUgY29udGVudC5cbiAgICAgICAgICogQHJldHVybnMge1N0cmluZyB8IEhUTUx9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2dldENvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBJcyB0aGlzIGZyb20gYSBjb25maWd1cmF0aW9uLnBocCByb3c/XG4gICAgICAgICAgICB2YXIgJHBhcmVudENvbmZpZ1JvdyA9ICR0aGlzLnBhcmVudHMoJ1tkYXRhLWNvbmZpZy1rZXldOmZpcnN0Jyk7XG4gICAgICAgICAgICB2YXIgaXNDb25maWdSb3cgPSAhISRwYXJlbnRDb25maWdSb3cubGVuZ3RoO1xuXG4gICAgICAgICAgICAvLyBUcnkgdG8gZ2V0IGltYWdlIGFuZCBhcHBlbmQgaXQgdG8gdGhlIHRvb2x0aXAgZGVzY3JpcHRpb25cbiAgICAgICAgICAgIGlmIChpc0NvbmZpZ1Jvdykge1xuICAgICAgICAgICAgICAgIHZhciAkaW1hZ2UgPSAkcGFyZW50Q29uZmlnUm93LmZpbmQoJ2ltZzpmaXJzdCcpO1xuICAgICAgICAgICAgICAgIHZhciBoYXNJbWFnZSA9ICEhJGltYWdlLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmIChoYXNJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5hcHBlbmQoJzxicj48YnI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmFwcGVuZCgkaW1hZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICR0aGlzLmh0bWwoKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgdGhlIGltYWdlIHRhZyBlbGVtZW50IHNlbGVjdG9yIGZvciB0aGUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIHJldHVybiBhIGRpZmZlcmVudCBpbWFnZSBkZXBlbmRpbmcgb24gdGhlIHByb3ZpZGVkIHR5cGUgb3B0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXRJbWFnZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGljb247XG5cbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnd2FybmluZyc6XG4gICAgICAgICAgICAgICAgICAgICRpY29uID0gJCgnPHNwYW4gY2xhc3M9XCJneC1jb250YWluZXIgdG9vbHRpcC1pY29uIHB1bGwtbGVmdCAnICsgb3B0aW9ucy50eXBlICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtZXhjbGFtYXRpb24tdHJpYW5nbGVcIj48L2k+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9zcGFuPicpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgICAgICAgICAgICAgJGljb24gPSAkKCc8c3BhbiBjbGFzcz1cImd4LWNvbnRhaW5lciB0b29sdGlwLWljb24gJyArIG9wdGlvbnMudHlwZSArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cImZhIGZhLWluZm8tY2lyY2xlXCI+PC9pPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRpY29uLnF0aXAoe1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IF9nZXRDb250ZW50KCksXG4gICAgICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NlczogJ2d4LWNvbnRhaW5lciBneC1xdGlwICcgKyBvcHRpb25zLnR5cGUgLy8gdXNlIHRoZSB0eXBlIGFzIGEgY2xhc3MgZm9yIHN0eWxpbmdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIG15OiBvcHRpb25zLnR5cGUgPT09ICd3YXJuaW5nJyA/ICdib3R0b20gbGVmdCcgOiAnbGVmdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBhdDogb3B0aW9ucy50eXBlID09PSAnd2FybmluZycgPyAndG9wIGxlZnQnIDogJ3JpZ2h0IGNlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0OiAkKHdpbmRvdylcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhpZGU6IHsgLy8gRGVsYXkgdGhlIHRvb2x0aXAgaGlkZSBieSAzMDBtcyBzbyB0aGF0IHVzZXJzIGNhbiBpbnRlcmFjdCB3aXRoIGl0LlxuICAgICAgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDMwMFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gJGljb247XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgaWYgKCR0aGlzLnRleHQoKS5yZXBsYWNlKC9cXHMrLywgJycpICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHZhciAkaWNvbiA9IF9nZXRJbWFnZUVsZW1lbnQoKTtcblxuICAgICAgICAgICAgICAgICR0aGlzLnRleHQoJycpO1xuXG4gICAgICAgICAgICAgICAgJGljb24uYXBwZW5kVG8oJHRoaXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
