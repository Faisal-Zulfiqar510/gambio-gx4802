'use strict';

/* --------------------------------------------------------------
 lightbox.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Lightbox Widget
 *
 * Widget to easily configure and open lightboxes.
 *
 * Lightbox Project Website: {@link http://lokeshdhakar.com/projects/lightbox2}
 *
 * **Notice:** This widget is used by some old pages. The use of lightboxes in new pages is not suggested and
 * instead you should use the Bootstrap modals.
 *
 * @module Admin/Widgets/lightbox
 * @requires Lightbox-Library
 * @ignore
 */
gx.widgets.module('lightbox', ['fallback'], function (data) {

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
     * Click handler that opens the lightbox and initializes the default behavior.
     *
     * @param {object} event jQuery-event-object
     */
    var _clickHandler = function _clickHandler(event) {
        event.preventDefault();
        event.stopPropagation();

        var $self = $(this),
            dataset = jse.libs.fallback._data($self, 'lightbox'),
            settingDataSet = {},
            paramDataSet = {};

        $.each(dataset, function (key, value) {
            if (key.indexOf('setting') === 0) {
                settingDataSet[key.replace('setting_', '')] = value;
            } else {
                paramDataSet[key.replace('param_', '')] = value;
            }
        });

        $self.lightbox_plugin(settingDataSet, paramDataSet);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        jse.core.debug.warn('The "lightbox" widget is deprecated as of v1.3. Use the jQueryUI dialog ' + 'method instead.');

        $this.on('click', '.open_lightbox', _clickHandler);
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpZ2h0Ym94LmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfY2xpY2tIYW5kbGVyIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsIiRzZWxmIiwiZGF0YXNldCIsImpzZSIsImxpYnMiLCJmYWxsYmFjayIsIl9kYXRhIiwic2V0dGluZ0RhdGFTZXQiLCJwYXJhbURhdGFTZXQiLCJlYWNoIiwia2V5IiwidmFsdWUiLCJpbmRleE9mIiwicmVwbGFjZSIsImxpZ2h0Ym94X3BsdWdpbiIsImluaXQiLCJkb25lIiwiY29yZSIsImRlYnVnIiwid2FybiIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7O0FBY0FBLEdBQUdDLE9BQUgsQ0FBV0MsTUFBWCxDQUNJLFVBREosRUFHSSxDQUFDLFVBQUQsQ0FISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FwQmQ7OztBQXNCSTs7Ozs7QUFLQUQsYUFBUyxFQTNCYjs7QUE2QkE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFFBQUlPLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVUMsS0FBVixFQUFpQjtBQUNqQ0EsY0FBTUMsY0FBTjtBQUNBRCxjQUFNRSxlQUFOOztBQUVBLFlBQUlDLFFBQVFSLEVBQUUsSUFBRixDQUFaO0FBQUEsWUFDSVMsVUFBVUMsSUFBSUMsSUFBSixDQUFTQyxRQUFULENBQWtCQyxLQUFsQixDQUF3QkwsS0FBeEIsRUFBK0IsVUFBL0IsQ0FEZDtBQUFBLFlBRUlNLGlCQUFpQixFQUZyQjtBQUFBLFlBR0lDLGVBQWUsRUFIbkI7O0FBS0FmLFVBQUVnQixJQUFGLENBQU9QLE9BQVAsRUFBZ0IsVUFBVVEsR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQ2xDLGdCQUFJRCxJQUFJRSxPQUFKLENBQVksU0FBWixNQUEyQixDQUEvQixFQUFrQztBQUM5QkwsK0JBQWVHLElBQUlHLE9BQUosQ0FBWSxVQUFaLEVBQXdCLEVBQXhCLENBQWYsSUFBOENGLEtBQTlDO0FBQ0gsYUFGRCxNQUVPO0FBQ0hILDZCQUFhRSxJQUFJRyxPQUFKLENBQVksUUFBWixFQUFzQixFQUF0QixDQUFiLElBQTBDRixLQUExQztBQUNIO0FBQ0osU0FORDs7QUFRQVYsY0FBTWEsZUFBTixDQUFzQlAsY0FBdEIsRUFBc0NDLFlBQXRDO0FBQ0gsS0FsQkQ7O0FBb0JBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FsQixXQUFPeUIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJiLFlBQUljLElBQUosQ0FBU0MsS0FBVCxDQUFlQyxJQUFmLENBQW9CLDZFQUNkLGlCQUROOztBQUdBM0IsY0FBTTRCLEVBQU4sQ0FBUyxPQUFULEVBQWtCLGdCQUFsQixFQUFvQ3ZCLGFBQXBDO0FBQ0FtQjtBQUNILEtBTkQ7O0FBUUE7QUFDQSxXQUFPMUIsTUFBUDtBQUNILENBeEZMIiwiZmlsZSI6ImxpZ2h0Ym94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBsaWdodGJveC5qcyAyMDE2LTAyLTIzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBMaWdodGJveCBXaWRnZXRcbiAqXG4gKiBXaWRnZXQgdG8gZWFzaWx5IGNvbmZpZ3VyZSBhbmQgb3BlbiBsaWdodGJveGVzLlxuICpcbiAqIExpZ2h0Ym94IFByb2plY3QgV2Vic2l0ZToge0BsaW5rIGh0dHA6Ly9sb2tlc2hkaGFrYXIuY29tL3Byb2plY3RzL2xpZ2h0Ym94Mn1cbiAqXG4gKiAqKk5vdGljZToqKiBUaGlzIHdpZGdldCBpcyB1c2VkIGJ5IHNvbWUgb2xkIHBhZ2VzLiBUaGUgdXNlIG9mIGxpZ2h0Ym94ZXMgaW4gbmV3IHBhZ2VzIGlzIG5vdCBzdWdnZXN0ZWQgYW5kXG4gKiBpbnN0ZWFkIHlvdSBzaG91bGQgdXNlIHRoZSBCb290c3RyYXAgbW9kYWxzLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9saWdodGJveFxuICogQHJlcXVpcmVzIExpZ2h0Ym94LUxpYnJhcnlcbiAqIEBpZ25vcmVcbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2xpZ2h0Ym94JyxcblxuICAgIFsnZmFsbGJhY2snXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9ucyBmb3IgV2lkZ2V0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgdGhhdCBvcGVucyB0aGUgbGlnaHRib3ggYW5kIGluaXRpYWxpemVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5LWV2ZW50LW9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jbGlja0hhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhc2V0ID0ganNlLmxpYnMuZmFsbGJhY2suX2RhdGEoJHNlbGYsICdsaWdodGJveCcpLFxuICAgICAgICAgICAgICAgIHNldHRpbmdEYXRhU2V0ID0ge30sXG4gICAgICAgICAgICAgICAgcGFyYW1EYXRhU2V0ID0ge307XG5cbiAgICAgICAgICAgICQuZWFjaChkYXRhc2V0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZignc2V0dGluZycpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdEYXRhU2V0W2tleS5yZXBsYWNlKCdzZXR0aW5nXycsICcnKV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbURhdGFTZXRba2V5LnJlcGxhY2UoJ3BhcmFtXycsICcnKV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNlbGYubGlnaHRib3hfcGx1Z2luKHNldHRpbmdEYXRhU2V0LCBwYXJhbURhdGFTZXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy53YXJuKCdUaGUgXCJsaWdodGJveFwiIHdpZGdldCBpcyBkZXByZWNhdGVkIGFzIG9mIHYxLjMuIFVzZSB0aGUgalF1ZXJ5VUkgZGlhbG9nICdcbiAgICAgICAgICAgICAgICArICdtZXRob2QgaW5zdGVhZC4nKTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5vcGVuX2xpZ2h0Ym94JywgX2NsaWNrSGFuZGxlcik7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
