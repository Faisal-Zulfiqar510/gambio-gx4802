'use strict';

/* --------------------------------------------------------------
 pages_form.js 2017-09-19
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('type_selection', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES DEFINITION
  // ------------------------------------------------------------------------

  var
  /**
   * Module Selector
   *
   * @type {jQuery}
   */
  $this = $(this),


  /**
   * Dropdown for the selection
   *
   * @type {jQuery}
   */
  $selection = $(this).find('.content-manager-type-selection'),
      $contentContainer = $(this).find('.content-manager-type-selection-content'),


  /**
   * Corresponding contents for this selection
   *
   * @type {jQuery}
   */
  $contents = $contentContainer.children('div'),


  /**
   * Save buttons
   *
   * @type {jQuery}
   */
  $saveButtons = $('#main-footer .bottom-save-bar').find('button[type="submit"]'),


  /**
   * Default Options
   *
   * @type {object}
   */
  defaults = {},


  /**
   * Final Options
   *
   * @type {object}
   */
  options = $.extend(true, {}, defaults, data),


  /**
   * URLs for deleting different types of content
   *
   * @type {{page: string, element: string, file: string, link: string}}
   */
  urls = {},


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
   * Click handler for the tabs onClick the content gets switched.
   *
   * @param {object} event jQuery event object contains information of the event.
   */
  var _selectionChanged = function _selectionChanged() {
    $contents.hide();
    $contentContainer.find('.' + $selection.val()).show();
    $saveButtons.attr('form', $selection.val());
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    _selectionChanged();

    $selection.on('change', _selectionChanged);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci90eXBlX3NlbGVjdGlvbi5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRzZWxlY3Rpb24iLCJmaW5kIiwiJGNvbnRlbnRDb250YWluZXIiLCIkY29udGVudHMiLCJjaGlsZHJlbiIsIiRzYXZlQnV0dG9ucyIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsInVybHMiLCJfc2VsZWN0aW9uQ2hhbmdlZCIsImhpZGUiLCJ2YWwiLCJzaG93IiwiYXR0ciIsImluaXQiLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksZ0JBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFhRCxFQUFFLElBQUYsRUFBUUUsSUFBUixDQUFhLGlDQUFiLENBYmpCO0FBQUEsTUFlSUMsb0JBQW9CSCxFQUFFLElBQUYsRUFBUUUsSUFBUixDQUFhLHlDQUFiLENBZnhCOzs7QUFpQkk7Ozs7O0FBS0FFLGNBQVlELGtCQUFrQkUsUUFBbEIsQ0FBMkIsS0FBM0IsQ0F0QmhCOzs7QUF3Qkk7Ozs7O0FBS0FDLGlCQUFlTixFQUFFLCtCQUFGLEVBQW1DRSxJQUFuQyxDQUF3Qyx1QkFBeEMsQ0E3Qm5COzs7QUErQkk7Ozs7O0FBS0FLLGFBQVcsRUFwQ2Y7OztBQXNDSTs7Ozs7QUFLQUMsWUFBVVIsRUFBRVMsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QlQsSUFBN0IsQ0EzQ2Q7OztBQThDSTs7Ozs7QUFLQVksU0FBTyxFQW5EWDs7O0FBcURJOzs7OztBQUtBYixXQUFTLEVBMURiOztBQTREQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsTUFBTWMsb0JBQW9CLFNBQXBCQSxpQkFBb0IsR0FBWTtBQUNsQ1AsY0FBVVEsSUFBVjtBQUNBVCxzQkFDS0QsSUFETCxDQUNVLE1BQU1ELFdBQVdZLEdBQVgsRUFEaEIsRUFFS0MsSUFGTDtBQUdBUixpQkFBYVMsSUFBYixDQUFrQixNQUFsQixFQUEwQmQsV0FBV1ksR0FBWCxFQUExQjtBQUNILEdBTkQ7O0FBUUE7QUFDQTtBQUNBOztBQUVBaEIsU0FBT21CLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCTjs7QUFFQVYsZUFDS2lCLEVBREwsQ0FDUSxRQURSLEVBQ2tCUCxpQkFEbEI7O0FBR0FNO0FBQ0gsR0FQRDs7QUFTQSxTQUFPcEIsTUFBUDtBQUNILENBeEdMIiwiZmlsZSI6ImNvbnRlbnRfbWFuYWdlci90eXBlX3NlbGVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcGFnZXNfZm9ybS5qcyAyMDE3LTA5LTE5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICd0eXBlX3NlbGVjdGlvbicsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERyb3Bkb3duIGZvciB0aGUgc2VsZWN0aW9uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHNlbGVjdGlvbiA9ICQodGhpcykuZmluZCgnLmNvbnRlbnQtbWFuYWdlci10eXBlLXNlbGVjdGlvbicpLFxuXG4gICAgICAgICAgICAkY29udGVudENvbnRhaW5lciA9ICQodGhpcykuZmluZCgnLmNvbnRlbnQtbWFuYWdlci10eXBlLXNlbGVjdGlvbi1jb250ZW50JyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ29ycmVzcG9uZGluZyBjb250ZW50cyBmb3IgdGhpcyBzZWxlY3Rpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkY29udGVudHMgPSAkY29udGVudENvbnRhaW5lci5jaGlsZHJlbignZGl2JyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2F2ZSBidXR0b25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHNhdmVCdXR0b25zID0gJCgnI21haW4tZm9vdGVyIC5ib3R0b20tc2F2ZS1iYXInKS5maW5kKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVVJMcyBmb3IgZGVsZXRpbmcgZGlmZmVyZW50IHR5cGVzIG9mIGNvbnRlbnRcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7e3BhZ2U6IHN0cmluZywgZWxlbWVudDogc3RyaW5nLCBmaWxlOiBzdHJpbmcsIGxpbms6IHN0cmluZ319XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVybHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgdGFicyBvbkNsaWNrIHRoZSBjb250ZW50IGdldHMgc3dpdGNoZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zZWxlY3Rpb25DaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGNvbnRlbnRzLmhpZGUoKTtcbiAgICAgICAgICAgICRjb250ZW50Q29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmZpbmQoJy4nICsgJHNlbGVjdGlvbi52YWwoKSlcbiAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgJHNhdmVCdXR0b25zLmF0dHIoJ2Zvcm0nLCAkc2VsZWN0aW9uLnZhbCgpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgX3NlbGVjdGlvbkNoYW5nZWQoKTtcblxuICAgICAgICAgICAgJHNlbGVjdGlvblxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgX3NlbGVjdGlvbkNoYW5nZWQpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTsiXX0=
