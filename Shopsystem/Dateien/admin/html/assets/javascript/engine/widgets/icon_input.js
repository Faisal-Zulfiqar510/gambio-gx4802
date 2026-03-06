'use strict';

/* --------------------------------------------------------------
 icon_input.js 2018-09-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Icon Input Widget
 *
 * Turns normal input fields into input fields with a provided background image.
 *
 * ### Example
 *
 * The "icon-input" activates the widget and attaches the needed styles for the background image
 * which is provided by the `data-icon` attribute.
 *
 * ```html
 * <input data-gx-widget="icon_input" data-icon="url/to/image-file.png"/>
 * ```
 *
 * @todo Add automatic image dimension adjustment. Images - for example if they are too big in dimensions - won't scale correctly at the moment.
 *
 * @module Admin/Widgets/icon_input
 */
gx.widgets.module('icon_input', ['xhr'], function (data) {

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
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Adds the dropdown functionality to the button.
     *
     * Developers can manually add new <li> items to the list in order to display more options to
     * the users.
     *
     * @private
     */
    var _setBackgroundImage = function _setBackgroundImage() {
        var iconValue = $this.attr('data-icon');
        var langId = $this.attr('data-lang-id');

        if (undefined === iconValue && undefined === langId) {
            throw new Error('Whether data-lang-id or data-icon attribute is required!');
        }

        if (undefined !== langId) {
            jse.libs.xhr.get({
                url: './admin.php?do=JSWidgetsAjax/iconInput&language_id=' + langId
            }).done(function (r) {
                return $this.css('background', 'url(' + r.iconUrl + ')' + ' no-repeat right 8px center / 20px white');
            });
        } else {
            $this.css('background', 'url(' + iconValue + ')' + ' no-repeat right 8px center white');
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        _setBackgroundImage();
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImljb25faW5wdXQuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9zZXRCYWNrZ3JvdW5kSW1hZ2UiLCJpY29uVmFsdWUiLCJhdHRyIiwibGFuZ0lkIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJqc2UiLCJsaWJzIiwieGhyIiwiZ2V0IiwidXJsIiwiZG9uZSIsImNzcyIsInIiLCJpY29uVXJsIiwiaW5pdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkFBLEdBQUdDLE9BQUgsQ0FBV0MsTUFBWCxDQUNJLFlBREosRUFHSSxDQUFDLEtBQUQsQ0FISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7Ozs7QUFLQUQsYUFBUyxFQTNCYjs7QUE2QkE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQVFBLFFBQU1PLHNCQUFzQixTQUF0QkEsbUJBQXNCLEdBQU07QUFDOUIsWUFBTUMsWUFBWU4sTUFBTU8sSUFBTixDQUFXLFdBQVgsQ0FBbEI7QUFDQSxZQUFNQyxTQUFTUixNQUFNTyxJQUFOLENBQVcsY0FBWCxDQUFmOztBQUVBLFlBQUlFLGNBQWNILFNBQWQsSUFBMkJHLGNBQWNELE1BQTdDLEVBQXFEO0FBQ2pELGtCQUFNLElBQUlFLEtBQUosQ0FBVSwwREFBVixDQUFOO0FBQ0g7O0FBRUQsWUFBSUQsY0FBY0QsTUFBbEIsRUFBMEI7QUFDdEJHLGdCQUFJQyxJQUFKLENBQVNDLEdBQVQsQ0FBYUMsR0FBYixDQUFpQjtBQUNiQyxxQkFBSyx3REFBd0RQO0FBRGhELGFBQWpCLEVBRUdRLElBRkgsQ0FFUTtBQUFBLHVCQUFLaEIsTUFBTWlCLEdBQU4sQ0FBVSxZQUFWLEVBQXdCLFNBQVNDLEVBQUVDLE9BQVgsR0FBcUIsR0FBckIsR0FBMkIsMENBQW5ELENBQUw7QUFBQSxhQUZSO0FBR0gsU0FKRCxNQUlPO0FBQ0huQixrQkFBTWlCLEdBQU4sQ0FBVSxZQUFWLEVBQXdCLFNBQVNYLFNBQVQsR0FBcUIsR0FBckIsR0FBMkIsbUNBQW5EO0FBQ0g7QUFDSixLQWZEOztBQWlCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBUixXQUFPc0IsSUFBUCxHQUFjLFVBQVVKLElBQVYsRUFBZ0I7QUFDMUJYO0FBQ0FXO0FBQ0gsS0FIRDs7QUFLQTtBQUNBLFdBQU9sQixNQUFQO0FBQ0gsQ0FyRkwiLCJmaWxlIjoiaWNvbl9pbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gaWNvbl9pbnB1dC5qcyAyMDE4LTA5LTE0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBJY29uIElucHV0IFdpZGdldFxuICpcbiAqIFR1cm5zIG5vcm1hbCBpbnB1dCBmaWVsZHMgaW50byBpbnB1dCBmaWVsZHMgd2l0aCBhIHByb3ZpZGVkIGJhY2tncm91bmQgaW1hZ2UuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBUaGUgXCJpY29uLWlucHV0XCIgYWN0aXZhdGVzIHRoZSB3aWRnZXQgYW5kIGF0dGFjaGVzIHRoZSBuZWVkZWQgc3R5bGVzIGZvciB0aGUgYmFja2dyb3VuZCBpbWFnZVxuICogd2hpY2ggaXMgcHJvdmlkZWQgYnkgdGhlIGBkYXRhLWljb25gIGF0dHJpYnV0ZS5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgZGF0YS1neC13aWRnZXQ9XCJpY29uX2lucHV0XCIgZGF0YS1pY29uPVwidXJsL3RvL2ltYWdlLWZpbGUucG5nXCIvPlxuICogYGBgXG4gKlxuICogQHRvZG8gQWRkIGF1dG9tYXRpYyBpbWFnZSBkaW1lbnNpb24gYWRqdXN0bWVudC4gSW1hZ2VzIC0gZm9yIGV4YW1wbGUgaWYgdGhleSBhcmUgdG9vIGJpZyBpbiBkaW1lbnNpb25zIC0gd29uJ3Qgc2NhbGUgY29ycmVjdGx5IGF0IHRoZSBtb21lbnQuXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL2ljb25faW5wdXRcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2ljb25faW5wdXQnLFxuXG4gICAgWyd4aHInXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZHMgdGhlIGRyb3Bkb3duIGZ1bmN0aW9uYWxpdHkgdG8gdGhlIGJ1dHRvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogRGV2ZWxvcGVycyBjYW4gbWFudWFsbHkgYWRkIG5ldyA8bGk+IGl0ZW1zIHRvIHRoZSBsaXN0IGluIG9yZGVyIHRvIGRpc3BsYXkgbW9yZSBvcHRpb25zIHRvXG4gICAgICAgICAqIHRoZSB1c2Vycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zZXRCYWNrZ3JvdW5kSW1hZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpY29uVmFsdWUgPSAkdGhpcy5hdHRyKCdkYXRhLWljb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGxhbmdJZCA9ICR0aGlzLmF0dHIoJ2RhdGEtbGFuZy1pZCcpXG5cbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgPT09IGljb25WYWx1ZSAmJiB1bmRlZmluZWQgPT09IGxhbmdJZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV2hldGhlciBkYXRhLWxhbmctaWQgb3IgZGF0YS1pY29uIGF0dHJpYnV0ZSBpcyByZXF1aXJlZCEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gbGFuZ0lkKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPUpTV2lkZ2V0c0FqYXgvaWNvbklucHV0Jmxhbmd1YWdlX2lkPScgKyBsYW5nSWRcbiAgICAgICAgICAgICAgICB9KS5kb25lKHIgPT4gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kJywgJ3VybCgnICsgci5pY29uVXJsICsgJyknICsgJyBuby1yZXBlYXQgcmlnaHQgOHB4IGNlbnRlciAvIDIwcHggd2hpdGUnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICR0aGlzLmNzcygnYmFja2dyb3VuZCcsICd1cmwoJyArIGljb25WYWx1ZSArICcpJyArICcgbm8tcmVwZWF0IHJpZ2h0IDhweCBjZW50ZXIgd2hpdGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSB3aWRnZXQsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgX3NldEJhY2tncm91bmRJbWFnZSgpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
