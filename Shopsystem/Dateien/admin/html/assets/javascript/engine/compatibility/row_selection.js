'use strict';

/* --------------------------------------------------------------
 row_selection.js 2015-09-20 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Row selection
 *
 * Selects (toggles the checkbox of) a table row by clicking the row
 *
 * @module Compatibility/row_selection
 */
gx.compatibility.module('row_selection', [],

/**  @lends module:Compatibility/row_selection */

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
        checkboxSelector: 'td:first input[type="checkbox"]'
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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _selectRow = function _selectRow(event) {
        var $target = $(event.target),
            $row = $target.closest('.row_selection'),
            $input = $row.find('td:first input:checkbox');

        if (!$(event.target).is('input, select, span.single-checkbox, i.fa-check')) {
            $input.trigger('click');
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.off('click', '.row_selection').on('click', '.row_selection', _selectRow);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvd19zZWxlY3Rpb24uanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiY2hlY2tib3hTZWxlY3RvciIsIm9wdGlvbnMiLCJleHRlbmQiLCJfc2VsZWN0Um93IiwiZXZlbnQiLCIkdGFyZ2V0IiwidGFyZ2V0IiwiJHJvdyIsImNsb3Nlc3QiLCIkaW5wdXQiLCJmaW5kIiwiaXMiLCJ0cmlnZ2VyIiwiaW5pdCIsImRvbmUiLCJvZmYiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksZUFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1BDLDBCQUFrQjtBQURYLEtBYmY7OztBQWlCSTs7Ozs7QUFLQUMsY0FBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSCxRQUFuQixFQUE2QkgsSUFBN0IsQ0F0QmQ7OztBQXdCSTs7Ozs7QUFLQUQsYUFBUyxFQTdCYjs7QUErQkE7QUFDQTtBQUNBOztBQUVBLFFBQUlRLGFBQWEsU0FBYkEsVUFBYSxDQUFVQyxLQUFWLEVBQWlCO0FBQzlCLFlBQUlDLFVBQVVQLEVBQUVNLE1BQU1FLE1BQVIsQ0FBZDtBQUFBLFlBQ0lDLE9BQU9GLFFBQVFHLE9BQVIsQ0FBZ0IsZ0JBQWhCLENBRFg7QUFBQSxZQUVJQyxTQUFTRixLQUFLRyxJQUFMLENBQVUseUJBQVYsQ0FGYjs7QUFJQSxZQUFJLENBQUNaLEVBQUVNLE1BQU1FLE1BQVIsRUFBZ0JLLEVBQWhCLENBQW1CLGlEQUFuQixDQUFMLEVBQTRFO0FBQ3hFRixtQkFBT0csT0FBUCxDQUFlLE9BQWY7QUFDSDtBQUNKLEtBUkQ7O0FBVUE7QUFDQTtBQUNBOztBQUVBakIsV0FBT2tCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCakIsY0FDS2tCLEdBREwsQ0FDUyxPQURULEVBQ2tCLGdCQURsQixFQUVLQyxFQUZMLENBRVEsT0FGUixFQUVpQixnQkFGakIsRUFFbUNiLFVBRm5DOztBQUlBVztBQUNILEtBTkQ7O0FBUUEsV0FBT25CLE1BQVA7QUFDSCxDQXpFTCIsImZpbGUiOiJyb3dfc2VsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiByb3dfc2VsZWN0aW9uLmpzIDIwMTUtMDktMjAgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFJvdyBzZWxlY3Rpb25cbiAqXG4gKiBTZWxlY3RzICh0b2dnbGVzIHRoZSBjaGVja2JveCBvZikgYSB0YWJsZSByb3cgYnkgY2xpY2tpbmcgdGhlIHJvd1xuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9yb3dfc2VsZWN0aW9uXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdyb3dfc2VsZWN0aW9uJyxcblxuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvcm93X3NlbGVjdGlvbiAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBjaGVja2JveFNlbGVjdG9yOiAndGQ6Zmlyc3QgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfc2VsZWN0Um93ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KSxcbiAgICAgICAgICAgICAgICAkcm93ID0gJHRhcmdldC5jbG9zZXN0KCcucm93X3NlbGVjdGlvbicpLFxuICAgICAgICAgICAgICAgICRpbnB1dCA9ICRyb3cuZmluZCgndGQ6Zmlyc3QgaW5wdXQ6Y2hlY2tib3gnKTtcblxuICAgICAgICAgICAgaWYgKCEkKGV2ZW50LnRhcmdldCkuaXMoJ2lucHV0LCBzZWxlY3QsIHNwYW4uc2luZ2xlLWNoZWNrYm94LCBpLmZhLWNoZWNrJykpIHtcbiAgICAgICAgICAgICAgICAkaW5wdXQudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycsICcucm93X3NlbGVjdGlvbicpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcucm93X3NlbGVjdGlvbicsIF9zZWxlY3RSb3cpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
