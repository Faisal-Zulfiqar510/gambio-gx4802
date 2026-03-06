'use strict';

/* --------------------------------------------------------------
 slider_selection.js 2017-11-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('slider_selection', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES DEFINITION
  // ------------------------------------------------------------------------

  /**
   * Module Selector
   *
   * @type {jQuery}
   */

  var $this = $(this);

  /**
   * Default Options
   *
   * @type {object}
   */
  var defaults = {
    contentSliderSelector: '.content-slider-selection',
    formSelector: 'form.content-manager-form',
    hiddenFieldSelector: 'input.content-manager-slider-id'
  };

  /**
   * Final Options
   *
   * @type {object}
   */
  var options = $.extend(true, {}, defaults, data);

  /**
   * Module Object
   *
   * @type {object}
   */
  var module = {};

  // ------------------------------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  /**
   * Change handler for content slider selection.
   */
  var _selectionChanged = function _selectionChanged() {
    $(options.formSelector + ' ' + options.hiddenFieldSelector).val($this.find(options.contentSliderSelector).val());
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    _selectionChanged();

    $this.on('change', options.contentSliderSelector, _selectionChanged);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9zbGlkZXJfc2VsZWN0aW9uLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJjb250ZW50U2xpZGVyU2VsZWN0b3IiLCJmb3JtU2VsZWN0b3IiLCJoaWRkZW5GaWVsZFNlbGVjdG9yIiwib3B0aW9ucyIsImV4dGVuZCIsIl9zZWxlY3Rpb25DaGFuZ2VkIiwidmFsIiwiZmluZCIsImluaXQiLCJkb25lIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksa0JBREosRUFDd0IsRUFEeEIsRUFHSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsV0FBVztBQUNiQywyQkFBdUIsMkJBRFY7QUFFYkMsa0JBQWMsMkJBRkQ7QUFHYkMseUJBQXFCO0FBSFIsR0FBakI7O0FBTUE7Ozs7O0FBS0EsTUFBTUMsVUFBVUwsRUFBRU0sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CTCxRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsTUFBTUQsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0EsTUFBTVUsb0JBQW9CLFNBQXBCQSxpQkFBb0IsR0FBTTtBQUM1QlAsTUFBRUssUUFBUUYsWUFBUixHQUF1QixHQUF2QixHQUE2QkUsUUFBUUQsbUJBQXZDLEVBQTRESSxHQUE1RCxDQUFnRVQsTUFBTVUsSUFBTixDQUFXSixRQUFRSCxxQkFBbkIsRUFBMENNLEdBQTFDLEVBQWhFO0FBQ0gsR0FGRDs7QUFJQTtBQUNBO0FBQ0E7O0FBRUFYLFNBQU9hLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCSjs7QUFFQVIsVUFBTWEsRUFBTixDQUFTLFFBQVQsRUFBbUJQLFFBQVFILHFCQUEzQixFQUFrREssaUJBQWxEOztBQUVBSTtBQUNILEdBTkQ7O0FBUUEsU0FBT2QsTUFBUDtBQUNILENBbkVMIiwiZmlsZSI6ImNvbnRlbnRfbWFuYWdlci9zbGlkZXJfc2VsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzbGlkZXJfc2VsZWN0aW9uLmpzIDIwMTctMTEtMjdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3NsaWRlcl9zZWxlY3Rpb24nLCBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjb250ZW50U2xpZGVyU2VsZWN0b3I6ICcuY29udGVudC1zbGlkZXItc2VsZWN0aW9uJyxcbiAgICAgICAgICAgIGZvcm1TZWxlY3RvcjogJ2Zvcm0uY29udGVudC1tYW5hZ2VyLWZvcm0nLFxuICAgICAgICAgICAgaGlkZGVuRmllbGRTZWxlY3RvcjogJ2lucHV0LmNvbnRlbnQtbWFuYWdlci1zbGlkZXItaWQnLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFuZ2UgaGFuZGxlciBmb3IgY29udGVudCBzbGlkZXIgc2VsZWN0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3NlbGVjdGlvbkNoYW5nZWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAkKG9wdGlvbnMuZm9ybVNlbGVjdG9yICsgJyAnICsgb3B0aW9ucy5oaWRkZW5GaWVsZFNlbGVjdG9yKS52YWwoJHRoaXMuZmluZChvcHRpb25zLmNvbnRlbnRTbGlkZXJTZWxlY3RvcikudmFsKCkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBfc2VsZWN0aW9uQ2hhbmdlZCgpO1xuXG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgb3B0aW9ucy5jb250ZW50U2xpZGVyU2VsZWN0b3IsIF9zZWxlY3Rpb25DaGFuZ2VkKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
