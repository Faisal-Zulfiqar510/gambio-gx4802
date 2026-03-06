'use strict';

/* --------------------------------------------------------------
 specials_date.js 2018-12-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## specials_date
 *
 * Updates hidden date input fields if the user changes the date via the datepicker
 *
 * @module Compatibility/specials_date
 */
gx.compatibility.module('specials_date', [],

/**  @lends module:Compatibility/specials_date */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @var {jQuery}
     */
    $this = $(this),


    /**
     * Input Selector
     *
     * @var {jQuery}
     */
    $input = $this.find('#special-date'),


    /**
     * Input Selector
     *
     * @var {jQuery}
     */
    $input_begins = $this.find('#special-begins-date'),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {},


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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * @description Retrieves the value from input field returns a formated
     * object with splitted date values.
     * @param {string} separator = '.' value date separator.
     * @param {string[]} format value date parts format array in order.
     * @returns {object}
     */
    var _getFormattedValue = function _getFormattedValue(separator, format) {
        var date, date_begins, result;

        // Separator
        separator = separator || '.';

        // Format
        format = format || ['dd', 'mm', 'yyyy'];

        // Input value
        date = $input.val().split(separator);
        date_begins = $input_begins.val().split(separator);

        // Result
        result = {
            day: '',
            month: '',
            year: '',
            day_begins: '',
            month_begins: '',
            year_begins: ''
        };

        // Fill result object
        for (var i = 0; i < format.length; i++) {
            if (format[i] === 'dd') {
                result.day = date[i];
                result.day_begins = date_begins[i];
            } else if (format[i] === 'mm') {
                result.month = date[i];
                result.month_begins = date_begins[i];
            } else if (format[i] === 'yyyy') {
                result.year = date[i];
                result.year_begins = date_begins[i];
            }
        }

        // Returns filled result object
        return result;
    };

    /**
     * @description Updates the hidden fields.
     * @param {object} date contains date part values.
     * @param {string} date.day Day value.
     * @param {string} date.month Month value.
     * @param {string} date.year Year value.
     */
    var _updateDateFields = function _updateDateFields(date) {
        date = $.extend({
            day: '',
            month: '',
            year: '',
            day_begins: '',
            month_begins: '',
            year_begins: ''
        }, date);

        $('input[name="day"]').val(date.day);
        $('input[name="month"]').val(date.month);
        $('input[name="year"]').val(date.year);
        $('input[name="begins_day"]').val(date.day_begins);
        $('input[name="begins_month"]').val(date.month_begins);
        $('input[name="begins_year"]').val(date.year_begins);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('form[name="new_special"]').on('submit', function () {
            _updateDateFields(_getFormattedValue());
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWNpYWxzL3NwZWNpYWxzX2RhdGUuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRpbnB1dCIsImZpbmQiLCIkaW5wdXRfYmVnaW5zIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2dldEZvcm1hdHRlZFZhbHVlIiwic2VwYXJhdG9yIiwiZm9ybWF0IiwiZGF0ZSIsImRhdGVfYmVnaW5zIiwicmVzdWx0IiwidmFsIiwic3BsaXQiLCJkYXkiLCJtb250aCIsInllYXIiLCJkYXlfYmVnaW5zIiwibW9udGhfYmVnaW5zIiwieWVhcl9iZWdpbnMiLCJpIiwibGVuZ3RoIiwiX3VwZGF0ZURhdGVGaWVsZHMiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxlQURKLEVBR0ksRUFISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGFBQVNGLE1BQU1HLElBQU4sQ0FBVyxlQUFYLENBYmI7OztBQWVJOzs7OztBQUtBQyxvQkFBZ0JKLE1BQU1HLElBQU4sQ0FBVyxzQkFBWCxDQXBCcEI7OztBQXNCSTs7Ozs7QUFLQUUsZUFBVyxFQTNCZjs7O0FBNkJJOzs7OztBQUtBQyxjQUFVTCxFQUFFTSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCTixJQUE3QixDQWxDZDs7O0FBb0NJOzs7OztBQUtBRCxhQUFTLEVBekNiOztBQTJDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQSxRQUFJVSxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFVQyxTQUFWLEVBQXFCQyxNQUFyQixFQUE2QjtBQUNsRCxZQUFJQyxJQUFKLEVBQVVDLFdBQVYsRUFBdUJDLE1BQXZCOztBQUVBO0FBQ0FKLG9CQUFZQSxhQUFhLEdBQXpCOztBQUVBO0FBQ0FDLGlCQUFTQSxVQUFVLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxNQUFiLENBQW5COztBQUVBO0FBQ0FDLGVBQU9ULE9BQU9ZLEdBQVAsR0FBYUMsS0FBYixDQUFtQk4sU0FBbkIsQ0FBUDtBQUNBRyxzQkFBY1IsY0FBY1UsR0FBZCxHQUFvQkMsS0FBcEIsQ0FBMEJOLFNBQTFCLENBQWQ7O0FBRUE7QUFDQUksaUJBQVM7QUFDTEcsaUJBQUssRUFEQTtBQUVMQyxtQkFBTyxFQUZGO0FBR0xDLGtCQUFNLEVBSEQ7QUFJTEMsd0JBQVksRUFKUDtBQUtMQywwQkFBYyxFQUxUO0FBTUxDLHlCQUFhO0FBTlIsU0FBVDs7QUFTQTtBQUNBLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJWixPQUFPYSxNQUEzQixFQUFtQ0QsR0FBbkMsRUFBd0M7QUFDcEMsZ0JBQUlaLE9BQU9ZLENBQVAsTUFBYyxJQUFsQixFQUF3QjtBQUNwQlQsdUJBQU9HLEdBQVAsR0FBYUwsS0FBS1csQ0FBTCxDQUFiO0FBQ0FULHVCQUFPTSxVQUFQLEdBQW9CUCxZQUFZVSxDQUFaLENBQXBCO0FBQ0gsYUFIRCxNQUdPLElBQUlaLE9BQU9ZLENBQVAsTUFBYyxJQUFsQixFQUF3QjtBQUMzQlQsdUJBQU9JLEtBQVAsR0FBZU4sS0FBS1csQ0FBTCxDQUFmO0FBQ0FULHVCQUFPTyxZQUFQLEdBQXNCUixZQUFZVSxDQUFaLENBQXRCO0FBQ0gsYUFITSxNQUdBLElBQUlaLE9BQU9ZLENBQVAsTUFBYyxNQUFsQixFQUEwQjtBQUM3QlQsdUJBQU9LLElBQVAsR0FBY1AsS0FBS1csQ0FBTCxDQUFkO0FBQ0FULHVCQUFPUSxXQUFQLEdBQXFCVCxZQUFZVSxDQUFaLENBQXJCO0FBQ0g7QUFDSjs7QUFFRDtBQUNBLGVBQU9ULE1BQVA7QUFDSCxLQXZDRDs7QUF5Q0E7Ozs7Ozs7QUFPQSxRQUFJVyxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFVYixJQUFWLEVBQWdCO0FBQ3BDQSxlQUFPVixFQUFFTSxNQUFGLENBQVM7QUFDWlMsaUJBQUssRUFETztBQUVaQyxtQkFBTyxFQUZLO0FBR1pDLGtCQUFNLEVBSE07QUFJWkMsd0JBQVksRUFKQTtBQUtaQywwQkFBYyxFQUxGO0FBTVpDLHlCQUFhO0FBTkQsU0FBVCxFQU9KVixJQVBJLENBQVA7O0FBU0FWLFVBQUUsbUJBQUYsRUFBdUJhLEdBQXZCLENBQTJCSCxLQUFLSyxHQUFoQztBQUNBZixVQUFFLHFCQUFGLEVBQXlCYSxHQUF6QixDQUE2QkgsS0FBS00sS0FBbEM7QUFDQWhCLFVBQUUsb0JBQUYsRUFBd0JhLEdBQXhCLENBQTRCSCxLQUFLTyxJQUFqQztBQUNBakIsVUFBRSwwQkFBRixFQUE4QmEsR0FBOUIsQ0FBa0NILEtBQUtRLFVBQXZDO0FBQ0FsQixVQUFFLDRCQUFGLEVBQWdDYSxHQUFoQyxDQUFvQ0gsS0FBS1MsWUFBekM7QUFDQW5CLFVBQUUsMkJBQUYsRUFBK0JhLEdBQS9CLENBQW1DSCxLQUFLVSxXQUF4QztBQUNILEtBaEJEOztBQWtCQTtBQUNBO0FBQ0E7O0FBRUF2QixXQUFPMkIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJ6QixVQUFFLDBCQUFGLEVBQThCMEIsRUFBOUIsQ0FBaUMsUUFBakMsRUFBMkMsWUFBWTtBQUNuREgsOEJBQWtCaEIsb0JBQWxCO0FBQ0gsU0FGRDs7QUFJQWtCO0FBQ0gsS0FORDs7QUFRQSxXQUFPNUIsTUFBUDtBQUNILENBcEpMIiwiZmlsZSI6InNwZWNpYWxzL3NwZWNpYWxzX2RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNwZWNpYWxzX2RhdGUuanMgMjAxOC0xMi0wNVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgc3BlY2lhbHNfZGF0ZVxuICpcbiAqIFVwZGF0ZXMgaGlkZGVuIGRhdGUgaW5wdXQgZmllbGRzIGlmIHRoZSB1c2VyIGNoYW5nZXMgdGhlIGRhdGUgdmlhIHRoZSBkYXRlcGlja2VyXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L3NwZWNpYWxzX2RhdGVcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ3NwZWNpYWxzX2RhdGUnLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9zcGVjaWFsc19kYXRlICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIElucHV0IFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7alF1ZXJ5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkaW5wdXQgPSAkdGhpcy5maW5kKCcjc3BlY2lhbC1kYXRlJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5wdXQgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtqUXVlcnl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRpbnB1dF9iZWdpbnMgPSAkdGhpcy5maW5kKCcjc3BlY2lhbC1iZWdpbnMtZGF0ZScpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyB0aGUgdmFsdWUgZnJvbSBpbnB1dCBmaWVsZCByZXR1cm5zIGEgZm9ybWF0ZWRcbiAgICAgICAgICogb2JqZWN0IHdpdGggc3BsaXR0ZWQgZGF0ZSB2YWx1ZXMuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZXBhcmF0b3IgPSAnLicgdmFsdWUgZGF0ZSBzZXBhcmF0b3IuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGZvcm1hdCB2YWx1ZSBkYXRlIHBhcnRzIGZvcm1hdCBhcnJheSBpbiBvcmRlci5cbiAgICAgICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZ2V0Rm9ybWF0dGVkVmFsdWUgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBmb3JtYXQpIHtcbiAgICAgICAgICAgIHZhciBkYXRlLCBkYXRlX2JlZ2lucywgcmVzdWx0O1xuXG4gICAgICAgICAgICAvLyBTZXBhcmF0b3JcbiAgICAgICAgICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciB8fCAnLic7XG5cbiAgICAgICAgICAgIC8vIEZvcm1hdFxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IFsnZGQnLCAnbW0nLCAneXl5eSddO1xuXG4gICAgICAgICAgICAvLyBJbnB1dCB2YWx1ZVxuICAgICAgICAgICAgZGF0ZSA9ICRpbnB1dC52YWwoKS5zcGxpdChzZXBhcmF0b3IpO1xuICAgICAgICAgICAgZGF0ZV9iZWdpbnMgPSAkaW5wdXRfYmVnaW5zLnZhbCgpLnNwbGl0KHNlcGFyYXRvcik7XG5cbiAgICAgICAgICAgIC8vIFJlc3VsdFxuICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgIGRheTogJycsXG4gICAgICAgICAgICAgICAgbW9udGg6ICcnLFxuICAgICAgICAgICAgICAgIHllYXI6ICcnLFxuICAgICAgICAgICAgICAgIGRheV9iZWdpbnM6ICcnLFxuICAgICAgICAgICAgICAgIG1vbnRoX2JlZ2luczogJycsXG4gICAgICAgICAgICAgICAgeWVhcl9iZWdpbnM6ICcnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBGaWxsIHJlc3VsdCBvYmplY3RcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZm9ybWF0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hdFtpXSA9PT0gJ2RkJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQuZGF5ID0gZGF0ZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmRheV9iZWdpbnMgPSBkYXRlX2JlZ2luc1tpXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdFtpXSA9PT0gJ21tJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQubW9udGggPSBkYXRlW2ldO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQubW9udGhfYmVnaW5zID0gZGF0ZV9iZWdpbnNbaV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtYXRbaV0gPT09ICd5eXl5Jykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQueWVhciA9IGRhdGVbaV07XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC55ZWFyX2JlZ2lucyA9IGRhdGVfYmVnaW5zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmV0dXJucyBmaWxsZWQgcmVzdWx0IG9iamVjdFxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFVwZGF0ZXMgdGhlIGhpZGRlbiBmaWVsZHMuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRlIGNvbnRhaW5zIGRhdGUgcGFydCB2YWx1ZXMuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlLmRheSBEYXkgdmFsdWUuXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBkYXRlLm1vbnRoIE1vbnRoIHZhbHVlLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0ZS55ZWFyIFllYXIgdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3VwZGF0ZURhdGVGaWVsZHMgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICAgICAgZGF0ZSA9ICQuZXh0ZW5kKHtcbiAgICAgICAgICAgICAgICBkYXk6ICcnLFxuICAgICAgICAgICAgICAgIG1vbnRoOiAnJyxcbiAgICAgICAgICAgICAgICB5ZWFyOiAnJyxcbiAgICAgICAgICAgICAgICBkYXlfYmVnaW5zOiAnJyxcbiAgICAgICAgICAgICAgICBtb250aF9iZWdpbnM6ICcnLFxuICAgICAgICAgICAgICAgIHllYXJfYmVnaW5zOiAnJ1xuICAgICAgICAgICAgfSwgZGF0ZSk7XG5cbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJkYXlcIl0nKS52YWwoZGF0ZS5kYXkpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIm1vbnRoXCJdJykudmFsKGRhdGUubW9udGgpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInllYXJcIl0nKS52YWwoZGF0ZS55ZWFyKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJiZWdpbnNfZGF5XCJdJykudmFsKGRhdGUuZGF5X2JlZ2lucyk7XG4gICAgICAgICAgICAkKCdpbnB1dFtuYW1lPVwiYmVnaW5zX21vbnRoXCJdJykudmFsKGRhdGUubW9udGhfYmVnaW5zKTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJiZWdpbnNfeWVhclwiXScpLnZhbChkYXRlLnllYXJfYmVnaW5zKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCgnZm9ybVtuYW1lPVwibmV3X3NwZWNpYWxcIl0nKS5vbignc3VibWl0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF91cGRhdGVEYXRlRmllbGRzKF9nZXRGb3JtYXR0ZWRWYWx1ZSgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
