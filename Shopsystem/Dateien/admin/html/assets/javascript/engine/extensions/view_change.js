'use strict';

/* --------------------------------------------------------------
 view_change.js 2016-06-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## View Change Extension
 *
 * Use this extension to show or hide elements depending the state of a input-checkbox element. The extension
 * needs to be bound directly on the checkbox element. It requires two jQuery selector parameters that point
 * the elements that will be displayed when the checkbox is checked and when it isn't.
 *
 * ### Options
 *
 * **On State Selector | `data-view_change-on` | String | Required**
 *
 * Define a jQuery selector that selects the elements to be displayed when the checkbox is checked.
 *
 * **Off State Selector | `data-view_change-off` | String | Required**
 *
 * Define a jQuery selector that selects the elements to be displayed when the checkbox is unchecked (required).
 *
 * **Closest Parent Selector | `data-view_change-closest` | String | Optional**
 *
 * Use this jQuery selector to specify which "closest" element will be the parent of the element search. This
 * option can be useful for shrinking the search scope within a single parent container and not the whole page
 * body.
 *
 * ### Example
 *
 * In the following example only the labels that reside inside the div.container element will be affected by the
 * checkbox state. The label outside the container will always be visible.
 *
 * ```html
 * <div class="container">
 *   <input type="checkbox" data-gx-extension="view_change"
 *     data-view_change-on=".label-primary"
 *     data-view_change-off=".label-secondary"
 *     data-view_change-closest=".container" />
 *   <label class="label-primary">Test Label - Primary</label>
 *   <label class="label-secondary">Test Label - Secondary</label>
 * </div>
 *
 * <label class="label-primary">Test Label - Primary</label>
 * ```
 *
 * @module Admin/Extensions/view_change
 */
gx.extensions.module('view_change', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLE DEFINITION
  // ------------------------------------------------------------------------

  var
  /**
   * Extension Reference
   *
   * @type {object}
   */
  $this = $(this),


  /**
   * Parent Selector (default body)
   *
   * @type {object}
   */
  $parent = $('body'),


  /**
   * Default Options for Extension
   *
   * @type {object}
   */
  defaults = {
    // @todo Rename this option to activeSelector
    on: null, // Selector for the elements that are shown if the checkbox is set
    // @todo Rename this option to inactiveSelector
    off: null, // Selector for the elements that are shown if the checkbox is not set
    // @todo Rename this option to parentSelector
    closest: null // Got to the closest X-element and search inside it for the views
  },


  /**
   * Final Extension Options
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
  // FUNCTIONALITY
  // ------------------------------------------------------------------------

  /**
   * Shows or hides elements corresponding to the checkbox state.
   */
  var _changeHandler = function _changeHandler() {
    if ($this.prop('checked')) {
      $parent.find(options.on).show();
      $parent.find(options.off).hide();
      $this.attr('checked', 'checked');
    } else {
      $parent.find(options.on).hide();
      $parent.find(options.off).show();
      $this.removeAttr('checked');
    }
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  /**
   * Initialize method of the extension, called by the engine.
   */
  module.init = function (done) {
    if (options.closest) {
      $parent = $this.closest(options.closest);
    }
    $this.on('change checkbox:change', _changeHandler);
    _changeHandler();

    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdfY2hhbmdlLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkcGFyZW50IiwiZGVmYXVsdHMiLCJvbiIsIm9mZiIsImNsb3Nlc3QiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NoYW5nZUhhbmRsZXIiLCJwcm9wIiwiZmluZCIsInNob3ciLCJoaWRlIiwiYXR0ciIsInJlbW92ZUF0dHIiLCJpbml0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkNBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FDSSxhQURKLEVBR0ksRUFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFVBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsWUFBVUQsRUFBRSxNQUFGLENBYmQ7OztBQWVJOzs7OztBQUtBRSxhQUFXO0FBQ1A7QUFDQUMsUUFBSSxJQUZHLEVBRUc7QUFDVjtBQUNBQyxTQUFLLElBSkUsRUFJSTtBQUNYO0FBQ0FDLGFBQVMsSUFORixDQU1PO0FBTlAsR0FwQmY7OztBQTZCSTs7Ozs7QUFLQUMsWUFBVU4sRUFBRU8sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CTCxRQUFuQixFQUE2QkosSUFBN0IsQ0FsQ2Q7OztBQW9DSTs7Ozs7QUFLQUQsV0FBUyxFQXpDYjs7QUEyQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQSxNQUFJVyxpQkFBaUIsU0FBakJBLGNBQWlCLEdBQVk7QUFDN0IsUUFBSVQsTUFBTVUsSUFBTixDQUFXLFNBQVgsQ0FBSixFQUEyQjtBQUN2QlIsY0FBUVMsSUFBUixDQUFhSixRQUFRSCxFQUFyQixFQUF5QlEsSUFBekI7QUFDQVYsY0FBUVMsSUFBUixDQUFhSixRQUFRRixHQUFyQixFQUEwQlEsSUFBMUI7QUFDQWIsWUFBTWMsSUFBTixDQUFXLFNBQVgsRUFBc0IsU0FBdEI7QUFDSCxLQUpELE1BSU87QUFDSFosY0FBUVMsSUFBUixDQUFhSixRQUFRSCxFQUFyQixFQUF5QlMsSUFBekI7QUFDQVgsY0FBUVMsSUFBUixDQUFhSixRQUFRRixHQUFyQixFQUEwQk8sSUFBMUI7QUFDQVosWUFBTWUsVUFBTixDQUFpQixTQUFqQjtBQUNIO0FBRUosR0FYRDs7QUFhQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBakIsU0FBT2tCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCLFFBQUlWLFFBQVFELE9BQVosRUFBcUI7QUFDakJKLGdCQUFVRixNQUFNTSxPQUFOLENBQWNDLFFBQVFELE9BQXRCLENBQVY7QUFDSDtBQUNETixVQUFNSSxFQUFOLENBQVMsd0JBQVQsRUFBbUNLLGNBQW5DO0FBQ0FBOztBQUVBUTtBQUNILEdBUkQ7O0FBVUE7QUFDQSxTQUFPbkIsTUFBUDtBQUNILENBL0ZMIiwiZmlsZSI6InZpZXdfY2hhbmdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB2aWV3X2NoYW5nZS5qcyAyMDE2LTA2LTAxXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBWaWV3IENoYW5nZSBFeHRlbnNpb25cbiAqXG4gKiBVc2UgdGhpcyBleHRlbnNpb24gdG8gc2hvdyBvciBoaWRlIGVsZW1lbnRzIGRlcGVuZGluZyB0aGUgc3RhdGUgb2YgYSBpbnB1dC1jaGVja2JveCBlbGVtZW50LiBUaGUgZXh0ZW5zaW9uXG4gKiBuZWVkcyB0byBiZSBib3VuZCBkaXJlY3RseSBvbiB0aGUgY2hlY2tib3ggZWxlbWVudC4gSXQgcmVxdWlyZXMgdHdvIGpRdWVyeSBzZWxlY3RvciBwYXJhbWV0ZXJzIHRoYXQgcG9pbnRcbiAqIHRoZSBlbGVtZW50cyB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIHdoZW4gdGhlIGNoZWNrYm94IGlzIGNoZWNrZWQgYW5kIHdoZW4gaXQgaXNuJ3QuXG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKk9uIFN0YXRlIFNlbGVjdG9yIHwgYGRhdGEtdmlld19jaGFuZ2Utb25gIHwgU3RyaW5nIHwgUmVxdWlyZWQqKlxuICpcbiAqIERlZmluZSBhIGpRdWVyeSBzZWxlY3RvciB0aGF0IHNlbGVjdHMgdGhlIGVsZW1lbnRzIHRvIGJlIGRpc3BsYXllZCB3aGVuIHRoZSBjaGVja2JveCBpcyBjaGVja2VkLlxuICpcbiAqICoqT2ZmIFN0YXRlIFNlbGVjdG9yIHwgYGRhdGEtdmlld19jaGFuZ2Utb2ZmYCB8IFN0cmluZyB8IFJlcXVpcmVkKipcbiAqXG4gKiBEZWZpbmUgYSBqUXVlcnkgc2VsZWN0b3IgdGhhdCBzZWxlY3RzIHRoZSBlbGVtZW50cyB0byBiZSBkaXNwbGF5ZWQgd2hlbiB0aGUgY2hlY2tib3ggaXMgdW5jaGVja2VkIChyZXF1aXJlZCkuXG4gKlxuICogKipDbG9zZXN0IFBhcmVudCBTZWxlY3RvciB8IGBkYXRhLXZpZXdfY2hhbmdlLWNsb3Nlc3RgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFVzZSB0aGlzIGpRdWVyeSBzZWxlY3RvciB0byBzcGVjaWZ5IHdoaWNoIFwiY2xvc2VzdFwiIGVsZW1lbnQgd2lsbCBiZSB0aGUgcGFyZW50IG9mIHRoZSBlbGVtZW50IHNlYXJjaC4gVGhpc1xuICogb3B0aW9uIGNhbiBiZSB1c2VmdWwgZm9yIHNocmlua2luZyB0aGUgc2VhcmNoIHNjb3BlIHdpdGhpbiBhIHNpbmdsZSBwYXJlbnQgY29udGFpbmVyIGFuZCBub3QgdGhlIHdob2xlIHBhZ2VcbiAqIGJvZHkuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBJbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUgb25seSB0aGUgbGFiZWxzIHRoYXQgcmVzaWRlIGluc2lkZSB0aGUgZGl2LmNvbnRhaW5lciBlbGVtZW50IHdpbGwgYmUgYWZmZWN0ZWQgYnkgdGhlXG4gKiBjaGVja2JveCBzdGF0ZS4gVGhlIGxhYmVsIG91dHNpZGUgdGhlIGNvbnRhaW5lciB3aWxsIGFsd2F5cyBiZSB2aXNpYmxlLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAqICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtZ3gtZXh0ZW5zaW9uPVwidmlld19jaGFuZ2VcIlxuICogICAgIGRhdGEtdmlld19jaGFuZ2Utb249XCIubGFiZWwtcHJpbWFyeVwiXG4gKiAgICAgZGF0YS12aWV3X2NoYW5nZS1vZmY9XCIubGFiZWwtc2Vjb25kYXJ5XCJcbiAqICAgICBkYXRhLXZpZXdfY2hhbmdlLWNsb3Nlc3Q9XCIuY29udGFpbmVyXCIgLz5cbiAqICAgPGxhYmVsIGNsYXNzPVwibGFiZWwtcHJpbWFyeVwiPlRlc3QgTGFiZWwgLSBQcmltYXJ5PC9sYWJlbD5cbiAqICAgPGxhYmVsIGNsYXNzPVwibGFiZWwtc2Vjb25kYXJ5XCI+VGVzdCBMYWJlbCAtIFNlY29uZGFyeTwvbGFiZWw+XG4gKiA8L2Rpdj5cbiAqXG4gKiA8bGFiZWwgY2xhc3M9XCJsYWJlbC1wcmltYXJ5XCI+VGVzdCBMYWJlbCAtIFByaW1hcnk8L2xhYmVsPlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL3ZpZXdfY2hhbmdlXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICd2aWV3X2NoYW5nZScsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeHRlbnNpb24gUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFBhcmVudCBTZWxlY3RvciAoZGVmYXVsdCBib2R5KVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRwYXJlbnQgPSAkKCdib2R5JyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBSZW5hbWUgdGhpcyBvcHRpb24gdG8gYWN0aXZlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBvbjogbnVsbCwgLy8gU2VsZWN0b3IgZm9yIHRoZSBlbGVtZW50cyB0aGF0IGFyZSBzaG93biBpZiB0aGUgY2hlY2tib3ggaXMgc2V0XG4gICAgICAgICAgICAgICAgLy8gQHRvZG8gUmVuYW1lIHRoaXMgb3B0aW9uIHRvIGluYWN0aXZlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICBvZmY6IG51bGwsIC8vIFNlbGVjdG9yIGZvciB0aGUgZWxlbWVudHMgdGhhdCBhcmUgc2hvd24gaWYgdGhlIGNoZWNrYm94IGlzIG5vdCBzZXRcbiAgICAgICAgICAgICAgICAvLyBAdG9kbyBSZW5hbWUgdGhpcyBvcHRpb24gdG8gcGFyZW50U2VsZWN0b3JcbiAgICAgICAgICAgICAgICBjbG9zZXN0OiBudWxsIC8vIEdvdCB0byB0aGUgY2xvc2VzdCBYLWVsZW1lbnQgYW5kIHNlYXJjaCBpbnNpZGUgaXQgZm9yIHRoZSB2aWV3c1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBFeHRlbnNpb24gT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05BTElUWVxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2hvd3Mgb3IgaGlkZXMgZWxlbWVudHMgY29ycmVzcG9uZGluZyB0byB0aGUgY2hlY2tib3ggc3RhdGUuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJHRoaXMucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKG9wdGlvbnMub24pLnNob3coKTtcbiAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQob3B0aW9ucy5vZmYpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5hdHRyKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKG9wdGlvbnMub24pLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQob3B0aW9ucy5vZmYpLnNob3coKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5yZW1vdmVBdHRyKCdjaGVja2VkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSBleHRlbnNpb24sIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2xvc2VzdCkge1xuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkdGhpcy5jbG9zZXN0KG9wdGlvbnMuY2xvc2VzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlIGNoZWNrYm94OmNoYW5nZScsIF9jaGFuZ2VIYW5kbGVyKTtcbiAgICAgICAgICAgIF9jaGFuZ2VIYW5kbGVyKCk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
