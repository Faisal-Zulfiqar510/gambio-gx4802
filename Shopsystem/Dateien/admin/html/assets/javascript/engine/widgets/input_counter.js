'use strict';

/* --------------------------------------------------------------
 input_counter.js 2016-08-25
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Input Counter Widget
 *
 * Adds a counter element to input and textarea elements.
 *
 * ### Options:
 *
 * **Persistence | `data-input_counter-persistent` | bool | Optional**
 *
 * Omits to hide the counter element. This option is optional and the default value is true, so
 * the counter element is permanent displayed.
 *
 * **Pull | `data-input_counter-persistent` | bool/string | Optional**
 *
 * The option gives the possibility to pull the counter element to whether the right or left side.
 *
 * ### Example
 * ```html
 * <!-- Default input counter element -->
 * <input type="text" data-gx-widget="input_counter">
 * <textarea data-gx-widget="input_counter"></textarea>
 *
 * <!-- Show element on focus and hide on blur -->
 * <input type="text" data-input_counter-persistent="false">
 *
 * <!-- Disable counter pull -->
 * <input type="text" data-input_counter-pull="false">
 *
 * <!-- Pull counter to left side -->
 * <input type="text" data-input_counter-pull="left">
 * ```
 *
 * @module Admin/Widgets/input_counter
 */

gx.widgets.module('input_counter', [], function (data) {
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
        persistent: true,
        pull: 'right',
        label: false
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
    module = {},
        counterLabel = jse.core.lang.translate('COUNTER', 'admin_general'),
        $counter = $('<span/>');

    var _showCharCounter = function _showCharCounter(event) {
        $this.parent().append($counter);
        if (options.max) {
            $counter.text($this.val().length + '/' + options.max);
            options.label ? $counter.append(' - ' + counterLabel) : '';
        } else {
            $counter.text($this.val().length);
            options.label ? $counter.append(' - ' + counterLabel) : '';
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        // check and set handling of persistent pull
        if (options.pull) {
            $counter.addClass('pull-' + options.pull);
        }

        // check and set handling of persistent option
        if (options.persistent) {
            _showCharCounter();
        } else {
            $this.focus(_showCharCounter);
            $this.blur(function () {
                $counter.remove();
            });
        }

        $this.on('keyup', _showCharCounter);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlucHV0X2NvdW50ZXIuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwicGVyc2lzdGVudCIsInB1bGwiLCJsYWJlbCIsIm9wdGlvbnMiLCJleHRlbmQiLCJjb3VudGVyTGFiZWwiLCJqc2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIiRjb3VudGVyIiwiX3Nob3dDaGFyQ291bnRlciIsImV2ZW50IiwicGFyZW50IiwiYXBwZW5kIiwibWF4IiwidGV4dCIsInZhbCIsImxlbmd0aCIsImluaXQiLCJkb25lIiwiYWRkQ2xhc3MiLCJmb2N1cyIsImJsdXIiLCJyZW1vdmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQUEsR0FBR0MsT0FBSCxDQUFXQyxNQUFYLENBQ0ksZUFESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVztBQUNQQyxvQkFBWSxJQURMO0FBRVBDLGNBQU0sT0FGQztBQUdQQyxlQUFPO0FBSEEsS0FiZjs7O0FBbUJJOzs7OztBQUtBQyxjQUFVTCxFQUFFTSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJMLFFBQW5CLEVBQTZCSCxJQUE3QixDQXhCZDs7O0FBMEJJOzs7OztBQUtBRCxhQUFTLEVBL0JiO0FBQUEsUUFpQ0lVLGVBQWVDLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLFNBQXhCLEVBQW1DLGVBQW5DLENBakNuQjtBQUFBLFFBbUNJQyxXQUFXWixFQUFFLFNBQUYsQ0FuQ2Y7O0FBcUNBLFFBQUlhLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQVVDLEtBQVYsRUFBaUI7QUFDcENmLGNBQU1nQixNQUFOLEdBQWVDLE1BQWYsQ0FBc0JKLFFBQXRCO0FBQ0EsWUFBSVAsUUFBUVksR0FBWixFQUFpQjtBQUNiTCxxQkFBU00sSUFBVCxDQUFjbkIsTUFBTW9CLEdBQU4sR0FBWUMsTUFBWixHQUFxQixHQUFyQixHQUEyQmYsUUFBUVksR0FBakQ7QUFDQVosb0JBQVFELEtBQVIsR0FBZ0JRLFNBQVNJLE1BQVQsU0FBc0JULFlBQXRCLENBQWhCLEdBQXdELEVBQXhEO0FBQ0gsU0FIRCxNQUdPO0FBQ0hLLHFCQUFTTSxJQUFULENBQWNuQixNQUFNb0IsR0FBTixHQUFZQyxNQUExQjtBQUNBZixvQkFBUUQsS0FBUixHQUFnQlEsU0FBU0ksTUFBVCxTQUFzQlQsWUFBdEIsQ0FBaEIsR0FBd0QsRUFBeEQ7QUFDSDtBQUNKLEtBVEQ7O0FBV0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQVYsV0FBT3dCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCO0FBQ0EsWUFBSWpCLFFBQVFGLElBQVosRUFBa0I7QUFDZFMscUJBQVNXLFFBQVQsQ0FBa0IsVUFBVWxCLFFBQVFGLElBQXBDO0FBQ0g7O0FBRUQ7QUFDQSxZQUFJRSxRQUFRSCxVQUFaLEVBQXdCO0FBQ3BCVztBQUNILFNBRkQsTUFFTztBQUNIZCxrQkFBTXlCLEtBQU4sQ0FBWVgsZ0JBQVo7QUFDQWQsa0JBQU0wQixJQUFOLENBQVcsWUFBWTtBQUNuQmIseUJBQVNjLE1BQVQ7QUFDSCxhQUZEO0FBR0g7O0FBRUQzQixjQUFNNEIsRUFBTixDQUFTLE9BQVQsRUFBa0JkLGdCQUFsQjtBQUNBUztBQUNILEtBbEJEOztBQW9CQSxXQUFPekIsTUFBUDtBQUNILENBeEZMIiwiZmlsZSI6ImlucHV0X2NvdW50ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGlucHV0X2NvdW50ZXIuanMgMjAxNi0wOC0yNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgSW5wdXQgQ291bnRlciBXaWRnZXRcbiAqXG4gKiBBZGRzIGEgY291bnRlciBlbGVtZW50IHRvIGlucHV0IGFuZCB0ZXh0YXJlYSBlbGVtZW50cy5cbiAqXG4gKiAjIyMgT3B0aW9uczpcbiAqXG4gKiAqKlBlcnNpc3RlbmNlIHwgYGRhdGEtaW5wdXRfY291bnRlci1wZXJzaXN0ZW50YCB8IGJvb2wgfCBPcHRpb25hbCoqXG4gKlxuICogT21pdHMgdG8gaGlkZSB0aGUgY291bnRlciBlbGVtZW50LiBUaGlzIG9wdGlvbiBpcyBvcHRpb25hbCBhbmQgdGhlIGRlZmF1bHQgdmFsdWUgaXMgdHJ1ZSwgc29cbiAqIHRoZSBjb3VudGVyIGVsZW1lbnQgaXMgcGVybWFuZW50IGRpc3BsYXllZC5cbiAqXG4gKiAqKlB1bGwgfCBgZGF0YS1pbnB1dF9jb3VudGVyLXBlcnNpc3RlbnRgIHwgYm9vbC9zdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogVGhlIG9wdGlvbiBnaXZlcyB0aGUgcG9zc2liaWxpdHkgdG8gcHVsbCB0aGUgY291bnRlciBlbGVtZW50IHRvIHdoZXRoZXIgdGhlIHJpZ2h0IG9yIGxlZnQgc2lkZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICogYGBgaHRtbFxuICogPCEtLSBEZWZhdWx0IGlucHV0IGNvdW50ZXIgZWxlbWVudCAtLT5cbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtZ3gtd2lkZ2V0PVwiaW5wdXRfY291bnRlclwiPlxuICogPHRleHRhcmVhIGRhdGEtZ3gtd2lkZ2V0PVwiaW5wdXRfY291bnRlclwiPjwvdGV4dGFyZWE+XG4gKlxuICogPCEtLSBTaG93IGVsZW1lbnQgb24gZm9jdXMgYW5kIGhpZGUgb24gYmx1ciAtLT5cbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXRfY291bnRlci1wZXJzaXN0ZW50PVwiZmFsc2VcIj5cbiAqXG4gKiA8IS0tIERpc2FibGUgY291bnRlciBwdWxsIC0tPlxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1pbnB1dF9jb3VudGVyLXB1bGw9XCJmYWxzZVwiPlxuICpcbiAqIDwhLS0gUHVsbCBjb3VudGVyIHRvIGxlZnQgc2lkZSAtLT5cbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtaW5wdXRfY291bnRlci1wdWxsPVwibGVmdFwiPlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9XaWRnZXRzL2lucHV0X2NvdW50ZXJcbiAqL1xuXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnaW5wdXRfY291bnRlcicsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IFdpZGdldCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgcGVyc2lzdGVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwdWxsOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIGxhYmVsOiBmYWxzZVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBXaWRnZXQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fSxcblxuICAgICAgICAgICAgY291bnRlckxhYmVsID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0NPVU5URVInLCAnYWRtaW5fZ2VuZXJhbCcpLFxuXG4gICAgICAgICAgICAkY291bnRlciA9ICQoJzxzcGFuLz4nKTtcblxuICAgICAgICB2YXIgX3Nob3dDaGFyQ291bnRlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgJHRoaXMucGFyZW50KCkuYXBwZW5kKCRjb3VudGVyKTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heCkge1xuICAgICAgICAgICAgICAgICRjb3VudGVyLnRleHQoJHRoaXMudmFsKCkubGVuZ3RoICsgJy8nICsgb3B0aW9ucy5tYXgpO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubGFiZWwgPyAkY291bnRlci5hcHBlbmQoYCAtICR7Y291bnRlckxhYmVsfWApIDogJyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRjb3VudGVyLnRleHQoJHRoaXMudmFsKCkubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmxhYmVsID8gJGNvdW50ZXIuYXBwZW5kKGAgLSAke2NvdW50ZXJMYWJlbH1gKSA6ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBhbmQgc2V0IGhhbmRsaW5nIG9mIHBlcnNpc3RlbnQgcHVsbFxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucHVsbCkge1xuICAgICAgICAgICAgICAgICRjb3VudGVyLmFkZENsYXNzKCdwdWxsLScgKyBvcHRpb25zLnB1bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjaGVjayBhbmQgc2V0IGhhbmRsaW5nIG9mIHBlcnNpc3RlbnQgb3B0aW9uXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5wZXJzaXN0ZW50KSB7XG4gICAgICAgICAgICAgICAgX3Nob3dDaGFyQ291bnRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5mb2N1cyhfc2hvd0NoYXJDb3VudGVyKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5ibHVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNvdW50ZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aGlzLm9uKCdrZXl1cCcsIF9zaG93Q2hhckNvdW50ZXIpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
