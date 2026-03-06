'use strict';

/* --------------------------------------------------------------
 content_manager_details_controller.js 2016-08-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Content Manager Controller
 *
 * This controller contains the mapping logic of the content manager page.
 *
 * @module Compatibility/content_manager_details_controller
 */
gx.compatibility.module('content_manager_details_controller', [],

/**  @lends module:Compatibility/content_manager_details_controller */

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
  // MAIN FUNCTIONALITY
  // ------------------------------------------------------------------------

  var saveButton = $this.find('[data-value="BUTTON_SAVE"]');
  var updateButton = $this.find('[data-value="BUTTON_UPDATE"]');
  var originalSaveButton = $this.find('[name="save"]');
  var originalUpdateButton = $this.find('[name="reload"]');

  saveButton.on('click', function () {
    originalSaveButton.click();
  });

  updateButton.on('click', function () {
    originalUpdateButton.click();
  });

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------
  module.init = function (done) {
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9jb250ZW50X21hbmFnZXJfZGV0YWlsc19jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJzYXZlQnV0dG9uIiwiZmluZCIsInVwZGF0ZUJ1dHRvbiIsIm9yaWdpbmFsU2F2ZUJ1dHRvbiIsIm9yaWdpbmFsVXBkYXRlQnV0dG9uIiwib24iLCJjbGljayIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxvQ0FESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxZQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxXQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7O0FBRUEsTUFBSU8sYUFBYUwsTUFBTU0sSUFBTixDQUFXLDRCQUFYLENBQWpCO0FBQ0EsTUFBSUMsZUFBZVAsTUFBTU0sSUFBTixDQUFXLDhCQUFYLENBQW5CO0FBQ0EsTUFBSUUscUJBQXFCUixNQUFNTSxJQUFOLENBQVcsZUFBWCxDQUF6QjtBQUNBLE1BQUlHLHVCQUF1QlQsTUFBTU0sSUFBTixDQUFXLGlCQUFYLENBQTNCOztBQUVBRCxhQUFXSyxFQUFYLENBQWMsT0FBZCxFQUF1QixZQUFZO0FBQy9CRix1QkFBbUJHLEtBQW5CO0FBQ0gsR0FGRDs7QUFJQUosZUFBYUcsRUFBYixDQUFnQixPQUFoQixFQUF5QixZQUFZO0FBQ2pDRCx5QkFBcUJFLEtBQXJCO0FBQ0gsR0FGRDs7QUFLQTtBQUNBO0FBQ0E7QUFDQWIsU0FBT2MsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJBO0FBQ0gsR0FGRDs7QUFJQSxTQUFPZixNQUFQO0FBQ0gsQ0F0RUwiLCJmaWxlIjoiY29udGVudF9tYW5hZ2VyL2NvbnRlbnRfbWFuYWdlcl9kZXRhaWxzX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNvbnRlbnRfbWFuYWdlcl9kZXRhaWxzX2NvbnRyb2xsZXIuanMgMjAxNi0wOC0yNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQ29udGVudCBNYW5hZ2VyIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgY29udGFpbnMgdGhlIG1hcHBpbmcgbG9naWMgb2YgdGhlIGNvbnRlbnQgbWFuYWdlciBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9jb250ZW50X21hbmFnZXJfZGV0YWlsc19jb250cm9sbGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdjb250ZW50X21hbmFnZXJfZGV0YWlsc19jb250cm9sbGVyJyxcblxuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvY29udGVudF9tYW5hZ2VyX2RldGFpbHNfY29udHJvbGxlciAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gTUFJTiBGVU5DVElPTkFMSVRZXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBzYXZlQnV0dG9uID0gJHRoaXMuZmluZCgnW2RhdGEtdmFsdWU9XCJCVVRUT05fU0FWRVwiXScpO1xuICAgICAgICB2YXIgdXBkYXRlQnV0dG9uID0gJHRoaXMuZmluZCgnW2RhdGEtdmFsdWU9XCJCVVRUT05fVVBEQVRFXCJdJyk7XG4gICAgICAgIHZhciBvcmlnaW5hbFNhdmVCdXR0b24gPSAkdGhpcy5maW5kKCdbbmFtZT1cInNhdmVcIl0nKTtcbiAgICAgICAgdmFyIG9yaWdpbmFsVXBkYXRlQnV0dG9uID0gJHRoaXMuZmluZCgnW25hbWU9XCJyZWxvYWRcIl0nKTtcblxuICAgICAgICBzYXZlQnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsU2F2ZUJ1dHRvbi5jbGljaygpO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cGRhdGVCdXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb3JpZ2luYWxVcGRhdGVCdXR0b24uY2xpY2soKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
