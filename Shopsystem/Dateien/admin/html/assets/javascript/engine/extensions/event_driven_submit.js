'use strict';

/* --------------------------------------------------------------
 event_driven_submit.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Event Driven Submit Extension
 *
 * This extension is used along with text_edit.js and ajax_search.js in the Gambio Admin
 * "Text Edit | Texte Anpassen" page.
 *
 * @module Admin/Extensions/event_driven_submit
 * @ignore
 */
gx.extensions.module('event_driven_submit', [], function (data) {

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
   * Default Options for Extension
   *
   * @type {object}
   */
  defaults = {},


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
  // META INITIALIZE
  // ------------------------------------------------------------------------

  /**
   * Initialize method of the extension, called by the engine.
   */
  module.init = function (done) {

    $this.on('submitform', function (event, deferred) {
      jse.libs.form.prefillForm($this, deferred, false);
      $this.submit();
    });

    done();
  };

  // Return data to module engine.
  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV2ZW50X2RyaXZlbl9zdWJtaXQuanMiXSwibmFtZXMiOlsiZ3giLCJleHRlbnNpb25zIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwib24iLCJldmVudCIsImRlZmVycmVkIiwianNlIiwibGlicyIsImZvcm0iLCJwcmVmaWxsRm9ybSIsInN1Ym1pdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7QUFTQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0kscUJBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxZQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxXQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBQSxTQUFPTyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjs7QUFFMUJOLFVBQU1PLEVBQU4sQ0FBUyxZQUFULEVBQXVCLFVBQVVDLEtBQVYsRUFBaUJDLFFBQWpCLEVBQTJCO0FBQzlDQyxVQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsV0FBZCxDQUEwQmIsS0FBMUIsRUFBaUNTLFFBQWpDLEVBQTJDLEtBQTNDO0FBQ0FULFlBQU1jLE1BQU47QUFDSCxLQUhEOztBQUtBUjtBQUNILEdBUkQ7O0FBVUE7QUFDQSxTQUFPUixNQUFQO0FBQ0gsQ0E3REwiLCJmaWxlIjoiZXZlbnRfZHJpdmVuX3N1Ym1pdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZXZlbnRfZHJpdmVuX3N1Ym1pdC5qcyAyMDE1LTEwLTE1IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBFdmVudCBEcml2ZW4gU3VibWl0IEV4dGVuc2lvblxuICpcbiAqIFRoaXMgZXh0ZW5zaW9uIGlzIHVzZWQgYWxvbmcgd2l0aCB0ZXh0X2VkaXQuanMgYW5kIGFqYXhfc2VhcmNoLmpzIGluIHRoZSBHYW1iaW8gQWRtaW5cbiAqIFwiVGV4dCBFZGl0IHwgVGV4dGUgQW5wYXNzZW5cIiBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9ldmVudF9kcml2ZW5fc3VibWl0XG4gKiBAaWdub3JlXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICdldmVudF9kcml2ZW5fc3VibWl0JyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIEV4dGVuc2lvbiBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBNRVRBIElOSVRJQUxJWkVcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSBleHRlbnNpb24sIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICAgICAgICAkdGhpcy5vbignc3VibWl0Zm9ybScsIGZ1bmN0aW9uIChldmVudCwgZGVmZXJyZWQpIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5mb3JtLnByZWZpbGxGb3JtKCR0aGlzLCBkZWZlcnJlZCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLnN1Ym1pdCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
