'use strict';

/* --------------------------------------------------------------
 event_mapper.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Event Mapper Widget
 *
 * Maps events from the current element a target element.
 *
 * ### Options
 *
 * **Target Element | `data-event_mapper-target-element` | String | Required**
 *
 * Provide the target element, to which the event should be mapped to. If no target was specified, an error
 * will be thrown.
 *
 * **Event Name | `data-event_mapper-event-name` | String | Optional**
 *
 * Provide the event name. If no event is provided, it defaults to the `click` event.
 *
 * ### Example
 *
 * The new element to map.
 *
 * ```html
 * <button class="btn btn-primary"
 *     type="button"
 *     data-gx-widget="event_mapper"
 *     data-event_mapper-target-element=".my-target-element"
 *     data-event_mapper-event-name="click">
 *   Save
 * </button>
 * ```
 *
 * The target element for the event mapper, identified by the CSS-Class **my-target-element**.
 *
 * ```html
 * <button class="btn btn-primary my-target-element">
 *   My Old Button
 * </button>
 * ```
 *
 * @module Admin/Widgets/event_mapper
 * @requires jQueryUI-Library
 */
gx.widgets.module('event_mapper', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLE DEFINITION
  // ------------------------------------------------------------------------

  /**
   * Widget Reference
   *
   * @type {object}
   */

  var $this = $(this),


  /**
   * Default Options for Widget
   *
   * @type {object}
   */
  defaults = {
    eventName: 'click',
    targetElement: ''
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
    $this.off(options.eventName).on(options.eventName, function () {
      $(options.targetElement).trigger(options.eventName);
    });
    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50X21hcHBlci5qcyJdLCJuYW1lcyI6WyJneCIsIndpZGdldHMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJldmVudE5hbWUiLCJ0YXJnZXRFbGVtZW50Iiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwib2ZmIiwib24iLCJ0cmlnZ2VyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUNBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxjQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxNQUFJQyxRQUFRQyxFQUFFLElBQUYsQ0FBWjs7O0FBRUk7Ozs7O0FBS0FDLGFBQVc7QUFDUEMsZUFBVyxPQURKO0FBRVBDLG1CQUFlO0FBRlIsR0FQZjs7O0FBWUk7Ozs7O0FBS0FDLFlBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkosUUFBbkIsRUFBNkJILElBQTdCLENBakJkOzs7QUFtQkk7Ozs7O0FBS0FELFdBQVMsRUF4QmI7O0FBMEJBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FBLFNBQU9TLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCUixVQUNLUyxHQURMLENBQ1NKLFFBQVFGLFNBRGpCLEVBRUtPLEVBRkwsQ0FFUUwsUUFBUUYsU0FGaEIsRUFFMkIsWUFBWTtBQUMvQkYsUUFBRUksUUFBUUQsYUFBVixFQUF5Qk8sT0FBekIsQ0FBaUNOLFFBQVFGLFNBQXpDO0FBQ0gsS0FKTDtBQUtBSztBQUNILEdBUEQ7O0FBU0E7QUFDQSxTQUFPVixNQUFQO0FBQ0gsQ0E5REwiLCJmaWxlIjoiZXZlbnRfbWFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBldmVudF9tYXBwZXIuanMgMjAxNi0wMi0yM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRXZlbnQgTWFwcGVyIFdpZGdldFxuICpcbiAqIE1hcHMgZXZlbnRzIGZyb20gdGhlIGN1cnJlbnQgZWxlbWVudCBhIHRhcmdldCBlbGVtZW50LlxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogKipUYXJnZXQgRWxlbWVudCB8IGBkYXRhLWV2ZW50X21hcHBlci10YXJnZXQtZWxlbWVudGAgfCBTdHJpbmcgfCBSZXF1aXJlZCoqXG4gKlxuICogUHJvdmlkZSB0aGUgdGFyZ2V0IGVsZW1lbnQsIHRvIHdoaWNoIHRoZSBldmVudCBzaG91bGQgYmUgbWFwcGVkIHRvLiBJZiBubyB0YXJnZXQgd2FzIHNwZWNpZmllZCwgYW4gZXJyb3JcbiAqIHdpbGwgYmUgdGhyb3duLlxuICpcbiAqICoqRXZlbnQgTmFtZSB8IGBkYXRhLWV2ZW50X21hcHBlci1ldmVudC1uYW1lYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIHRoZSBldmVudCBuYW1lLiBJZiBubyBldmVudCBpcyBwcm92aWRlZCwgaXQgZGVmYXVsdHMgdG8gdGhlIGBjbGlja2AgZXZlbnQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBUaGUgbmV3IGVsZW1lbnQgdG8gbWFwLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIlxuICogICAgIHR5cGU9XCJidXR0b25cIlxuICogICAgIGRhdGEtZ3gtd2lkZ2V0PVwiZXZlbnRfbWFwcGVyXCJcbiAqICAgICBkYXRhLWV2ZW50X21hcHBlci10YXJnZXQtZWxlbWVudD1cIi5teS10YXJnZXQtZWxlbWVudFwiXG4gKiAgICAgZGF0YS1ldmVudF9tYXBwZXItZXZlbnQtbmFtZT1cImNsaWNrXCI+XG4gKiAgIFNhdmVcbiAqIDwvYnV0dG9uPlxuICogYGBgXG4gKlxuICogVGhlIHRhcmdldCBlbGVtZW50IGZvciB0aGUgZXZlbnQgbWFwcGVyLCBpZGVudGlmaWVkIGJ5IHRoZSBDU1MtQ2xhc3MgKipteS10YXJnZXQtZWxlbWVudCoqLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgbXktdGFyZ2V0LWVsZW1lbnRcIj5cbiAqICAgTXkgT2xkIEJ1dHRvblxuICogPC9idXR0b24+XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIEFkbWluL1dpZGdldHMvZXZlbnRfbWFwcGVyXG4gKiBAcmVxdWlyZXMgalF1ZXJ5VUktTGlicmFyeVxuICovXG5neC53aWRnZXRzLm1vZHVsZShcbiAgICAnZXZlbnRfbWFwcGVyJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpZGdldCBSZWZlcmVuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBXaWRnZXRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBldmVudE5hbWU6ICdjbGljaycsXG4gICAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudDogJydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9mZihvcHRpb25zLmV2ZW50TmFtZSlcbiAgICAgICAgICAgICAgICAub24ob3B0aW9ucy5ldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJChvcHRpb25zLnRhcmdldEVsZW1lbnQpLnRyaWdnZXIob3B0aW9ucy5ldmVudE5hbWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
