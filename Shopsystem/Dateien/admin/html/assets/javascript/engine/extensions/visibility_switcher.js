'use strict';

/* --------------------------------------------------------------
 visibility_switcher.js 2015-09-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Visibility Switcher Extension
 *
 * Use this extension in a parent element to easily define the visibility of child elements during the
 * mouse hover of their containers. When the "mouseleave" event is triggered the children will be hidden.
 *
 * ### Options
 *
 * **Rows | data-visibility_switcher-rows | String | Required**
 *
 * Provide a jQuery selector string which points to the elements that have the "hover" event.
 *
 * **Selections | data-visibility_switcher-selections | String | Required**
 *
 * Provide a jQuery selector string which points to the elements to be displayed upon the "hover" event.
 *
 * ### Example
 *
 * In the following example the .row-action elements will be visible whenever the user hovers above of the
 * `<tr>` element. The initial state of the elements must be hidden (thus the 'hidden' class).
 *
 * ```html
 * <table data-gx-extension="visibility_switcher"
 *       data-visibility_switcher-rows="tr.row"
 *       data-visibility_switcher-selections="i.row-action">
 *   <tr class="row">
 *     <td>#1</td>
 *     <td>John Doe</td>
 *     <td>
 *       <i class="fa fa-pencil row-action edit hidden"></i>
 *       <i class="fa fa-trash row-action delete hidden"></i>
 *     </td>
 *   </tr>
 * </table>
 * ```
 *
 * *Whenever the user hovers at the table rows the .row-action elements will be visible and whenever the
 * mouse leaves the rows they will be hidden.*
 *
 * @module Admin/Extensions/visibility_switcher
 */
gx.extensions.module('visibility_switcher', [], function (data) {

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
     *
     * @todo Rename 'rows' option to 'containerSelector' and 'selections' to 'childrenSelector'.
     */
    defaults = {
        'rows': '.visibility_switcher',
        'selections': '.tooltip-icon'
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
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------

    var _visibility = function _visibility(e) {
        var $self = $(this);
        $self.filter(options.selections).add($self.find(options.selections)).css('visibility', e.data.state);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        $this.on('mouseenter', options.rows, { 'state': 'visible' }, _visibility).on('mouseleave', options.rows, { 'state': 'hidden' }, _visibility);

        $this.find(options.rows + ' ' + options.selections).css('visibility', 'hidden');

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpc2liaWxpdHlfc3dpdGNoZXIuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl92aXNpYmlsaXR5IiwiZSIsIiRzZWxmIiwiZmlsdGVyIiwic2VsZWN0aW9ucyIsImFkZCIsImZpbmQiLCJjc3MiLCJzdGF0ZSIsImluaXQiLCJkb25lIiwib24iLCJyb3dzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FDSSxxQkFESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7Ozs7QUFPQUMsZUFBVztBQUNQLGdCQUFRLHNCQUREO0FBRVAsc0JBQWM7QUFGUCxLQWZmOzs7QUFvQkk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBekJkOzs7QUEyQkk7Ozs7O0FBS0FELGFBQVMsRUFoQ2I7O0FBa0NBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJTyxjQUFjLFNBQWRBLFdBQWMsQ0FBVUMsQ0FBVixFQUFhO0FBQzNCLFlBQUlDLFFBQVFOLEVBQUUsSUFBRixDQUFaO0FBQ0FNLGNBQ0tDLE1BREwsQ0FDWUwsUUFBUU0sVUFEcEIsRUFFS0MsR0FGTCxDQUVTSCxNQUFNSSxJQUFOLENBQVdSLFFBQVFNLFVBQW5CLENBRlQsRUFHS0csR0FITCxDQUdTLFlBSFQsRUFHdUJOLEVBQUVQLElBQUYsQ0FBT2MsS0FIOUI7QUFJSCxLQU5EOztBQVFBO0FBQ0E7QUFDQTs7QUFFQWYsV0FBT2dCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQmYsY0FDS2dCLEVBREwsQ0FDUSxZQURSLEVBQ3NCYixRQUFRYyxJQUQ5QixFQUNvQyxFQUFDLFNBQVMsU0FBVixFQURwQyxFQUMwRFosV0FEMUQsRUFFS1csRUFGTCxDQUVRLFlBRlIsRUFFc0JiLFFBQVFjLElBRjlCLEVBRW9DLEVBQUMsU0FBUyxRQUFWLEVBRnBDLEVBRXlEWixXQUZ6RDs7QUFJQUwsY0FDS1csSUFETCxDQUNVUixRQUFRYyxJQUFSLEdBQWUsR0FBZixHQUFxQmQsUUFBUU0sVUFEdkMsRUFFS0csR0FGTCxDQUVTLFlBRlQsRUFFdUIsUUFGdkI7O0FBSUFHO0FBRUgsS0FaRDs7QUFjQSxXQUFPakIsTUFBUDtBQUNILENBOUVMIiwiZmlsZSI6InZpc2liaWxpdHlfc3dpdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHZpc2liaWxpdHlfc3dpdGNoZXIuanMgMjAxNS0wOS0yMFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgVmlzaWJpbGl0eSBTd2l0Y2hlciBFeHRlbnNpb25cbiAqXG4gKiBVc2UgdGhpcyBleHRlbnNpb24gaW4gYSBwYXJlbnQgZWxlbWVudCB0byBlYXNpbHkgZGVmaW5lIHRoZSB2aXNpYmlsaXR5IG9mIGNoaWxkIGVsZW1lbnRzIGR1cmluZyB0aGVcbiAqIG1vdXNlIGhvdmVyIG9mIHRoZWlyIGNvbnRhaW5lcnMuIFdoZW4gdGhlIFwibW91c2VsZWF2ZVwiIGV2ZW50IGlzIHRyaWdnZXJlZCB0aGUgY2hpbGRyZW4gd2lsbCBiZSBoaWRkZW4uXG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKlJvd3MgfCBkYXRhLXZpc2liaWxpdHlfc3dpdGNoZXItcm93cyB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBQcm92aWRlIGEgalF1ZXJ5IHNlbGVjdG9yIHN0cmluZyB3aGljaCBwb2ludHMgdG8gdGhlIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgXCJob3ZlclwiIGV2ZW50LlxuICpcbiAqICoqU2VsZWN0aW9ucyB8IGRhdGEtdmlzaWJpbGl0eV9zd2l0Y2hlci1zZWxlY3Rpb25zIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIFByb3ZpZGUgYSBqUXVlcnkgc2VsZWN0b3Igc3RyaW5nIHdoaWNoIHBvaW50cyB0byB0aGUgZWxlbWVudHMgdG8gYmUgZGlzcGxheWVkIHVwb24gdGhlIFwiaG92ZXJcIiBldmVudC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIEluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZSB0aGUgLnJvdy1hY3Rpb24gZWxlbWVudHMgd2lsbCBiZSB2aXNpYmxlIHdoZW5ldmVyIHRoZSB1c2VyIGhvdmVycyBhYm92ZSBvZiB0aGVcbiAqIGA8dHI+YCBlbGVtZW50LiBUaGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgZWxlbWVudHMgbXVzdCBiZSBoaWRkZW4gKHRodXMgdGhlICdoaWRkZW4nIGNsYXNzKS5cbiAqXG4gKiBgYGBodG1sXG4gKiA8dGFibGUgZGF0YS1neC1leHRlbnNpb249XCJ2aXNpYmlsaXR5X3N3aXRjaGVyXCJcbiAqICAgICAgIGRhdGEtdmlzaWJpbGl0eV9zd2l0Y2hlci1yb3dzPVwidHIucm93XCJcbiAqICAgICAgIGRhdGEtdmlzaWJpbGl0eV9zd2l0Y2hlci1zZWxlY3Rpb25zPVwiaS5yb3ctYWN0aW9uXCI+XG4gKiAgIDx0ciBjbGFzcz1cInJvd1wiPlxuICogICAgIDx0ZD4jMTwvdGQ+XG4gKiAgICAgPHRkPkpvaG4gRG9lPC90ZD5cbiAqICAgICA8dGQ+XG4gKiAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBlbmNpbCByb3ctYWN0aW9uIGVkaXQgaGlkZGVuXCI+PC9pPlxuICogICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cmFzaCByb3ctYWN0aW9uIGRlbGV0ZSBoaWRkZW5cIj48L2k+XG4gKiAgICAgPC90ZD5cbiAqICAgPC90cj5cbiAqIDwvdGFibGU+XG4gKiBgYGBcbiAqXG4gKiAqV2hlbmV2ZXIgdGhlIHVzZXIgaG92ZXJzIGF0IHRoZSB0YWJsZSByb3dzIHRoZSAucm93LWFjdGlvbiBlbGVtZW50cyB3aWxsIGJlIHZpc2libGUgYW5kIHdoZW5ldmVyIHRoZVxuICogbW91c2UgbGVhdmVzIHRoZSByb3dzIHRoZXkgd2lsbCBiZSBoaWRkZW4uKlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy92aXNpYmlsaXR5X3N3aXRjaGVyXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICd2aXNpYmlsaXR5X3N3aXRjaGVyJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0b2RvIFJlbmFtZSAncm93cycgb3B0aW9uIHRvICdjb250YWluZXJTZWxlY3RvcicgYW5kICdzZWxlY3Rpb25zJyB0byAnY2hpbGRyZW5TZWxlY3RvcicuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICdyb3dzJzogJy52aXNpYmlsaXR5X3N3aXRjaGVyJyxcbiAgICAgICAgICAgICAgICAnc2VsZWN0aW9ucyc6ICcudG9vbHRpcC1pY29uJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfdmlzaWJpbGl0eSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHNlbGZcbiAgICAgICAgICAgICAgICAuZmlsdGVyKG9wdGlvbnMuc2VsZWN0aW9ucylcbiAgICAgICAgICAgICAgICAuYWRkKCRzZWxmLmZpbmQob3B0aW9ucy5zZWxlY3Rpb25zKSlcbiAgICAgICAgICAgICAgICAuY3NzKCd2aXNpYmlsaXR5JywgZS5kYXRhLnN0YXRlKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignbW91c2VlbnRlcicsIG9wdGlvbnMucm93cywgeydzdGF0ZSc6ICd2aXNpYmxlJ30sIF92aXNpYmlsaXR5KVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsIG9wdGlvbnMucm93cywgeydzdGF0ZSc6ICdoaWRkZW4nfSwgX3Zpc2liaWxpdHkpO1xuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5maW5kKG9wdGlvbnMucm93cyArICcgJyArIG9wdGlvbnMuc2VsZWN0aW9ucylcbiAgICAgICAgICAgICAgICAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
