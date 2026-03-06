'use strict';

/* --------------------------------------------------------------
 timepicker.js 2016-06-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Timepicker Widget
 *
 * Widget for creating 2 select dropdowns with specified stepping. In Case 'now' is set as initValue
 * the next possible time from now on gets selected.
 *
 * **Notice:** This module is used in old pages and will be discontinued. For new pages use the datetimepicker
 * widget from JSE/Widgets namespace.
 *
 * @module Admin/Widgets/timepicker
 * @ignore
 */
gx.widgets.module('timepicker', ['form'], function (data) {

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
    defaults = {
        'stepping': 5, // Stepping in minutes (not affecting the hours dropdown)
        'initValue': 'now' // 'now' next possible time value. Else a time can be specified. e.g.: 12:15
    },


    /**
     * Final Widget Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Instance
     *
     * @type {object}
     */
    module = {},


    /**
     * Hours Element Selector
     *
     * @type {object}
     */
    $hours = null,


    /**
     * Minutes Element Selector
     *
     * @type {object}
     */
    $minutes = null;

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        jse.core.debug.warn('The "timepicker" widget is deprecated as of v1.3. Use the datetimepicker widget ' + 'instead.');

        var $selects = $this.find('select'),
            values = [],
            i = 0,
            val = 0,
            initValues = [];

        $hours = $selects.eq(0);
        $minutes = $selects.eq(1);

        // Generating the hours dropdown.
        for (i; i < 24; i += 1) {
            val = i < 10 ? '0' + i : i;
            values.push({
                'value': val,
                'name': val
            });
        }
        jse.libs.form.createOptions($hours, values, false, false);

        // Generating the minutes dropdown.
        i = 0;
        values = [];
        for (i; i < 60; i += options.stepping) {
            val = i < 10 ? '0' + i : i;
            values.push({
                'value': val,
                'name': val
            });
        }
        jse.libs.form.createOptions($minutes, values, false, false);

        // Calculate the time values set on init
        if (options.initValue === 'now') {
            var date = new Date();
            initValues[0] = date.getHours();
            initValues[1] = Math.ceil(date.getMinutes() / options.stepping) * options.stepping;

            if (initValues[1] === 60) {
                initValues[0] += 1;
            }
        } else {
            try {
                initValues = options.initValue.split(':');
            } catch (err) {
                initValues = [];
            }
        }

        // Set the initial time values
        $hours.children('[value="' + initValues[0] + '"]').prop('selected', true);

        $minutes.children('[value="' + initValues[1] + '"]').prop('selected', true);

        $minutes.after('<span class="time" />');

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVwaWNrZXIuanMiXSwibmFtZXMiOlsiZ3giLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIiRob3VycyIsIiRtaW51dGVzIiwiaW5pdCIsImRvbmUiLCJqc2UiLCJjb3JlIiwiZGVidWciLCJ3YXJuIiwiJHNlbGVjdHMiLCJmaW5kIiwidmFsdWVzIiwiaSIsInZhbCIsImluaXRWYWx1ZXMiLCJlcSIsInB1c2giLCJsaWJzIiwiZm9ybSIsImNyZWF0ZU9wdGlvbnMiLCJzdGVwcGluZyIsImluaXRWYWx1ZSIsImRhdGUiLCJEYXRlIiwiZ2V0SG91cnMiLCJNYXRoIiwiY2VpbCIsImdldE1pbnV0ZXMiLCJzcGxpdCIsImVyciIsImNoaWxkcmVuIiwicHJvcCIsImFmdGVyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7OztBQVlBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxZQURKLEVBR0ksQ0FBQyxNQUFELENBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUCxvQkFBWSxDQURMLEVBQ1E7QUFDZixxQkFBYSxLQUZOLENBRVk7QUFGWixLQWJmOzs7QUFrQkk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBdkJkOzs7QUF5Qkk7Ozs7O0FBS0FELGFBQVMsRUE5QmI7OztBQWdDSTs7Ozs7QUFLQU8sYUFBUyxJQXJDYjs7O0FBdUNJOzs7OztBQUtBQyxlQUFXLElBNUNmOztBQThDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBUixXQUFPUyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQkMsWUFBSUMsSUFBSixDQUFTQyxLQUFULENBQWVDLElBQWYsQ0FBb0IscUZBQ2QsVUFETjs7QUFHQSxZQUFJQyxXQUFXYixNQUFNYyxJQUFOLENBQVcsUUFBWCxDQUFmO0FBQUEsWUFDSUMsU0FBUyxFQURiO0FBQUEsWUFFSUMsSUFBSSxDQUZSO0FBQUEsWUFHSUMsTUFBTSxDQUhWO0FBQUEsWUFJSUMsYUFBYSxFQUpqQjs7QUFNQWIsaUJBQVNRLFNBQVNNLEVBQVQsQ0FBWSxDQUFaLENBQVQ7QUFDQWIsbUJBQVdPLFNBQVNNLEVBQVQsQ0FBWSxDQUFaLENBQVg7O0FBRUE7QUFDQSxhQUFLSCxDQUFMLEVBQVFBLElBQUksRUFBWixFQUFnQkEsS0FBSyxDQUFyQixFQUF3QjtBQUNwQkMsa0JBQU9ELElBQUksRUFBTCxHQUFZLE1BQU1BLENBQWxCLEdBQXVCQSxDQUE3QjtBQUNBRCxtQkFBT0ssSUFBUCxDQUFZO0FBQ1IseUJBQVNILEdBREQ7QUFFUix3QkFBUUE7QUFGQSxhQUFaO0FBSUg7QUFDRFIsWUFBSVksSUFBSixDQUFTQyxJQUFULENBQWNDLGFBQWQsQ0FBNEJsQixNQUE1QixFQUFvQ1UsTUFBcEMsRUFBNEMsS0FBNUMsRUFBbUQsS0FBbkQ7O0FBRUE7QUFDQUMsWUFBSSxDQUFKO0FBQ0FELGlCQUFTLEVBQVQ7QUFDQSxhQUFLQyxDQUFMLEVBQVFBLElBQUksRUFBWixFQUFnQkEsS0FBS2IsUUFBUXFCLFFBQTdCLEVBQXVDO0FBQ25DUCxrQkFBT0QsSUFBSSxFQUFMLEdBQVksTUFBTUEsQ0FBbEIsR0FBdUJBLENBQTdCO0FBQ0FELG1CQUFPSyxJQUFQLENBQVk7QUFDUix5QkFBU0gsR0FERDtBQUVSLHdCQUFRQTtBQUZBLGFBQVo7QUFJSDtBQUNEUixZQUFJWSxJQUFKLENBQVNDLElBQVQsQ0FBY0MsYUFBZCxDQUE0QmpCLFFBQTVCLEVBQXNDUyxNQUF0QyxFQUE4QyxLQUE5QyxFQUFxRCxLQUFyRDs7QUFFQTtBQUNBLFlBQUlaLFFBQVFzQixTQUFSLEtBQXNCLEtBQTFCLEVBQWlDO0FBQzdCLGdCQUFJQyxPQUFPLElBQUlDLElBQUosRUFBWDtBQUNBVCx1QkFBVyxDQUFYLElBQWdCUSxLQUFLRSxRQUFMLEVBQWhCO0FBQ0FWLHVCQUFXLENBQVgsSUFBZ0JXLEtBQUtDLElBQUwsQ0FBVUosS0FBS0ssVUFBTCxLQUFvQjVCLFFBQVFxQixRQUF0QyxJQUFrRHJCLFFBQVFxQixRQUExRTs7QUFFQSxnQkFBSU4sV0FBVyxDQUFYLE1BQWtCLEVBQXRCLEVBQTBCO0FBQ3RCQSwyQkFBVyxDQUFYLEtBQWlCLENBQWpCO0FBQ0g7QUFFSixTQVRELE1BU087QUFDSCxnQkFBSTtBQUNBQSw2QkFBYWYsUUFBUXNCLFNBQVIsQ0FBa0JPLEtBQWxCLENBQXdCLEdBQXhCLENBQWI7QUFDSCxhQUZELENBRUUsT0FBT0MsR0FBUCxFQUFZO0FBQ1ZmLDZCQUFhLEVBQWI7QUFDSDtBQUNKOztBQUVEO0FBQ0FiLGVBQ0s2QixRQURMLENBQ2MsYUFBYWhCLFdBQVcsQ0FBWCxDQUFiLEdBQTZCLElBRDNDLEVBRUtpQixJQUZMLENBRVUsVUFGVixFQUVzQixJQUZ0Qjs7QUFJQTdCLGlCQUNLNEIsUUFETCxDQUNjLGFBQWFoQixXQUFXLENBQVgsQ0FBYixHQUE2QixJQUQzQyxFQUVLaUIsSUFGTCxDQUVVLFVBRlYsRUFFc0IsSUFGdEI7O0FBSUE3QixpQkFBUzhCLEtBQVQsQ0FBZSx1QkFBZjs7QUFFQTVCO0FBQ0gsS0FqRUQ7O0FBbUVBO0FBQ0EsV0FBT1YsTUFBUDtBQUNILENBdklMIiwiZmlsZSI6InRpbWVwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHRpbWVwaWNrZXIuanMgMjAxNi0wNi0yM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgVGltZXBpY2tlciBXaWRnZXRcbiAqXG4gKiBXaWRnZXQgZm9yIGNyZWF0aW5nIDIgc2VsZWN0IGRyb3Bkb3ducyB3aXRoIHNwZWNpZmllZCBzdGVwcGluZy4gSW4gQ2FzZSAnbm93JyBpcyBzZXQgYXMgaW5pdFZhbHVlXG4gKiB0aGUgbmV4dCBwb3NzaWJsZSB0aW1lIGZyb20gbm93IG9uIGdldHMgc2VsZWN0ZWQuXG4gKlxuICogKipOb3RpY2U6KiogVGhpcyBtb2R1bGUgaXMgdXNlZCBpbiBvbGQgcGFnZXMgYW5kIHdpbGwgYmUgZGlzY29udGludWVkLiBGb3IgbmV3IHBhZ2VzIHVzZSB0aGUgZGF0ZXRpbWVwaWNrZXJcbiAqIHdpZGdldCBmcm9tIEpTRS9XaWRnZXRzIG5hbWVzcGFjZS5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvdGltZXBpY2tlclxuICogQGlnbm9yZVxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAndGltZXBpY2tlcicsXG5cbiAgICBbJ2Zvcm0nXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBXaWRnZXQgUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9ucyBmb3IgV2lkZ2V0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgJ3N0ZXBwaW5nJzogNSwgLy8gU3RlcHBpbmcgaW4gbWludXRlcyAobm90IGFmZmVjdGluZyB0aGUgaG91cnMgZHJvcGRvd24pXG4gICAgICAgICAgICAgICAgJ2luaXRWYWx1ZSc6ICdub3cnIC8vICdub3cnIG5leHQgcG9zc2libGUgdGltZSB2YWx1ZS4gRWxzZSBhIHRpbWUgY2FuIGJlIHNwZWNpZmllZC4gZS5nLjogMTI6MTVcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBIb3VycyBFbGVtZW50IFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGhvdXJzID0gbnVsbCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNaW51dGVzIEVsZW1lbnQgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkbWludXRlcyA9IG51bGw7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGpzZS5jb3JlLmRlYnVnLndhcm4oJ1RoZSBcInRpbWVwaWNrZXJcIiB3aWRnZXQgaXMgZGVwcmVjYXRlZCBhcyBvZiB2MS4zLiBVc2UgdGhlIGRhdGV0aW1lcGlja2VyIHdpZGdldCAnXG4gICAgICAgICAgICAgICAgKyAnaW5zdGVhZC4nKTtcblxuICAgICAgICAgICAgdmFyICRzZWxlY3RzID0gJHRoaXMuZmluZCgnc2VsZWN0JyksXG4gICAgICAgICAgICAgICAgdmFsdWVzID0gW10sXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgdmFsID0gMCxcbiAgICAgICAgICAgICAgICBpbml0VmFsdWVzID0gW107XG5cbiAgICAgICAgICAgICRob3VycyA9ICRzZWxlY3RzLmVxKDApO1xuICAgICAgICAgICAgJG1pbnV0ZXMgPSAkc2VsZWN0cy5lcSgxKTtcblxuICAgICAgICAgICAgLy8gR2VuZXJhdGluZyB0aGUgaG91cnMgZHJvcGRvd24uXG4gICAgICAgICAgICBmb3IgKGk7IGkgPCAyNDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gKGkgPCAxMCkgPyAoJzAnICsgaSkgOiBpO1xuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdmFsLFxuICAgICAgICAgICAgICAgICAgICAnbmFtZSc6IHZhbFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAganNlLmxpYnMuZm9ybS5jcmVhdGVPcHRpb25zKCRob3VycywgdmFsdWVzLCBmYWxzZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBHZW5lcmF0aW5nIHRoZSBtaW51dGVzIGRyb3Bkb3duLlxuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaTsgaSA8IDYwOyBpICs9IG9wdGlvbnMuc3RlcHBpbmcpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSAoaSA8IDEwKSA/ICgnMCcgKyBpKSA6IGk7XG4gICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB2YWwsXG4gICAgICAgICAgICAgICAgICAgICduYW1lJzogdmFsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqc2UubGlicy5mb3JtLmNyZWF0ZU9wdGlvbnMoJG1pbnV0ZXMsIHZhbHVlcywgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSB0aW1lIHZhbHVlcyBzZXQgb24gaW5pdFxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaW5pdFZhbHVlID09PSAnbm93Jykge1xuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICBpbml0VmFsdWVzWzBdID0gZGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgICAgIGluaXRWYWx1ZXNbMV0gPSBNYXRoLmNlaWwoZGF0ZS5nZXRNaW51dGVzKCkgLyBvcHRpb25zLnN0ZXBwaW5nKSAqIG9wdGlvbnMuc3RlcHBpbmc7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5pdFZhbHVlc1sxXSA9PT0gNjApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdFZhbHVlc1swXSArPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpbml0VmFsdWVzID0gb3B0aW9ucy5pbml0VmFsdWUuc3BsaXQoJzonKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdFZhbHVlcyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBpbml0aWFsIHRpbWUgdmFsdWVzXG4gICAgICAgICAgICAkaG91cnNcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ1t2YWx1ZT1cIicgKyBpbml0VmFsdWVzWzBdICsgJ1wiXScpXG4gICAgICAgICAgICAgICAgLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICRtaW51dGVzXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCdbdmFsdWU9XCInICsgaW5pdFZhbHVlc1sxXSArICdcIl0nKVxuICAgICAgICAgICAgICAgIC5wcm9wKCdzZWxlY3RlZCcsIHRydWUpO1xuXG4gICAgICAgICAgICAkbWludXRlcy5hZnRlcignPHNwYW4gY2xhc3M9XCJ0aW1lXCIgLz4nKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
