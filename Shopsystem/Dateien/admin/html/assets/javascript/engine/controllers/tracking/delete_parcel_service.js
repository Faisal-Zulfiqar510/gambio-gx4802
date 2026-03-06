'use strict';

/* --------------------------------------------------------------
 delete_parcel_service.js 2016-07-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Delete Parcel Service Controller
 */
gx.controllers.module('delete_parcel_service', ['xhr'], function () {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  /**
   * Module Selector
   *
   * @type {jQuery}
   */

  var $this = $(this);

  /**
   * Parcel service list element.
   *
   * @type {jQuery}
   */
  var $parcelServiceList = $('#parcel_services_wrapper');

  /**
   * Module data set.
   *
   * @type {Object}
   */
  var dataset = $this.data();

  /**
   * Module Instance
   *
   * @type {Object}
   */
  var module = {};

  // ------------------------------------------------------------------------
  // EVENT HANDLERS
  // ------------------------------------------------------------------------

  /**
   * Handles the button click event in parcel services removal confirmation modal.
   * @param {Event} event Triggered event.
   */
  var _handleDeleteAction = function _handleDeleteAction(event) {
    // Clicked button element.      
    var $button = $(event.target);

    // CSS class to indicate already clicked button.
    var activeButtonClass = 'active';

    // AJAX request URL.
    var url = 'request_port.php?module=ParcelServices&action=delete_parcel_service';

    // AJAX request POST data.
    var data = {
      'parcel_service_id': dataset.lightboxParams.parcel_service_id,
      'page_token': dataset.lightboxParams.page_token
    };

    // Prevent default behavior and prevent event bubbling.
    event.preventDefault();
    event.stopPropagation();

    // Exit immediately if button has been already clicked.
    if ($button.hasClass(activeButtonClass)) {
      return false;
    }

    // Mark button as clicked to prevent multiple clicks. 
    $button.addClass(activeButtonClass);

    // Perform AJAX POST request.
    var request = jse.libs.xhr.post({ url: url, data: data });

    // AJAX request success handler.
    request.done(function (response) {
      $parcelServiceList.html(response.html);
      $.lightbox_plugin('close', dataset.lightboxParams.identifier);
    });

    // AJAX request error handler.
    request.fail(function (jqXHR, exception) {
      return $.lightbox_plugin('error', dataset.lightboxParams.identifier, jqXHR, exception);
    });
  };

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $this.on('click', '.delete', _handleDeleteAction);
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyYWNraW5nL2RlbGV0ZV9wYXJjZWxfc2VydmljZS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiJHRoaXMiLCIkIiwiJHBhcmNlbFNlcnZpY2VMaXN0IiwiZGF0YXNldCIsImRhdGEiLCJfaGFuZGxlRGVsZXRlQWN0aW9uIiwiJGJ1dHRvbiIsImV2ZW50IiwidGFyZ2V0IiwiYWN0aXZlQnV0dG9uQ2xhc3MiLCJ1cmwiLCJsaWdodGJveFBhcmFtcyIsInBhcmNlbF9zZXJ2aWNlX2lkIiwicGFnZV90b2tlbiIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInJlcXVlc3QiLCJqc2UiLCJsaWJzIiwieGhyIiwicG9zdCIsImRvbmUiLCJodG1sIiwicmVzcG9uc2UiLCJsaWdodGJveF9wbHVnaW4iLCJpZGVudGlmaWVyIiwiZmFpbCIsImpxWEhSIiwiZXhjZXB0aW9uIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7OztBQUdBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsdUJBQXRCLEVBQStDLENBQUMsS0FBRCxDQUEvQyxFQUF3RCxZQUFZOztBQUVoRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLE1BQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLE1BQU1DLHFCQUFxQkQsRUFBRSwwQkFBRixDQUEzQjs7QUFFQTs7Ozs7QUFLQSxNQUFNRSxVQUFVSCxNQUFNSSxJQUFOLEVBQWhCOztBQUVBOzs7OztBQUtBLE1BQU1MLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFJQSxNQUFNTSxzQkFBc0IsU0FBdEJBLG1CQUFzQixRQUFTO0FBQ2pDO0FBQ0EsUUFBTUMsVUFBVUwsRUFBRU0sTUFBTUMsTUFBUixDQUFoQjs7QUFFQTtBQUNBLFFBQU1DLG9CQUFvQixRQUExQjs7QUFFQTtBQUNBLFFBQU1DLE1BQU0scUVBQVo7O0FBRUE7QUFDQSxRQUFNTixPQUFPO0FBQ1QsMkJBQXFCRCxRQUFRUSxjQUFSLENBQXVCQyxpQkFEbkM7QUFFVCxvQkFBY1QsUUFBUVEsY0FBUixDQUF1QkU7QUFGNUIsS0FBYjs7QUFLQTtBQUNBTixVQUFNTyxjQUFOO0FBQ0FQLFVBQU1RLGVBQU47O0FBRUE7QUFDQSxRQUFJVCxRQUFRVSxRQUFSLENBQWlCUCxpQkFBakIsQ0FBSixFQUF5QztBQUNyQyxhQUFPLEtBQVA7QUFDSDs7QUFFRDtBQUNBSCxZQUFRVyxRQUFSLENBQWlCUixpQkFBakI7O0FBRUE7QUFDQSxRQUFNUyxVQUFVQyxJQUFJQyxJQUFKLENBQVNDLEdBQVQsQ0FBYUMsSUFBYixDQUFrQixFQUFDWixRQUFELEVBQU1OLFVBQU4sRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQWMsWUFBUUssSUFBUixDQUFhLG9CQUFZO0FBQ3JCckIseUJBQW1Cc0IsSUFBbkIsQ0FBd0JDLFNBQVNELElBQWpDO0FBQ0F2QixRQUFFeUIsZUFBRixDQUFrQixPQUFsQixFQUEyQnZCLFFBQVFRLGNBQVIsQ0FBdUJnQixVQUFsRDtBQUNILEtBSEQ7O0FBS0E7QUFDQVQsWUFBUVUsSUFBUixDQUFhLFVBQUNDLEtBQUQsRUFBUUMsU0FBUjtBQUFBLGFBQXNCN0IsRUFBRXlCLGVBQUYsQ0FBa0IsT0FBbEIsRUFBMkJ2QixRQUFRUSxjQUFSLENBQXVCZ0IsVUFBbEQsRUFBOERFLEtBQTlELEVBQXFFQyxTQUFyRSxDQUF0QjtBQUFBLEtBQWI7QUFFSCxHQXhDRDs7QUEwQ0E7QUFDQTtBQUNBOztBQUVBL0IsU0FBT2dDLElBQVAsR0FBYyxnQkFBUTtBQUNsQi9CLFVBQU1nQyxFQUFOLENBQVMsT0FBVCxFQUFrQixTQUFsQixFQUE2QjNCLG1CQUE3QjtBQUNBa0I7QUFDSCxHQUhEOztBQUtBLFNBQU94QixNQUFQO0FBQ0gsQ0FoR0QiLCJmaWxlIjoidHJhY2tpbmcvZGVsZXRlX3BhcmNlbF9zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBkZWxldGVfcGFyY2VsX3NlcnZpY2UuanMgMjAxNi0wNy0yN1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogRGVsZXRlIFBhcmNlbCBTZXJ2aWNlIENvbnRyb2xsZXJcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdkZWxldGVfcGFyY2VsX3NlcnZpY2UnLCBbJ3hociddLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBQYXJjZWwgc2VydmljZSBsaXN0IGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICRwYXJjZWxTZXJ2aWNlTGlzdCA9ICQoJyNwYXJjZWxfc2VydmljZXNfd3JhcHBlcicpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIGRhdGEgc2V0LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBkYXRhc2V0ID0gJHRoaXMuZGF0YSgpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgdGhlIGJ1dHRvbiBjbGljayBldmVudCBpbiBwYXJjZWwgc2VydmljZXMgcmVtb3ZhbCBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAqL1xuICAgIGNvbnN0IF9oYW5kbGVEZWxldGVBY3Rpb24gPSBldmVudCA9PiB7XG4gICAgICAgIC8vIENsaWNrZWQgYnV0dG9uIGVsZW1lbnQuICAgICAgXG4gICAgICAgIGNvbnN0ICRidXR0b24gPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgLy8gQ1NTIGNsYXNzIHRvIGluZGljYXRlIGFscmVhZHkgY2xpY2tlZCBidXR0b24uXG4gICAgICAgIGNvbnN0IGFjdGl2ZUJ1dHRvbkNsYXNzID0gJ2FjdGl2ZSc7XG5cbiAgICAgICAgLy8gQUpBWCByZXF1ZXN0IFVSTC5cbiAgICAgICAgY29uc3QgdXJsID0gJ3JlcXVlc3RfcG9ydC5waHA/bW9kdWxlPVBhcmNlbFNlcnZpY2VzJmFjdGlvbj1kZWxldGVfcGFyY2VsX3NlcnZpY2UnO1xuXG4gICAgICAgIC8vIEFKQVggcmVxdWVzdCBQT1NUIGRhdGEuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICAncGFyY2VsX3NlcnZpY2VfaWQnOiBkYXRhc2V0LmxpZ2h0Ym94UGFyYW1zLnBhcmNlbF9zZXJ2aWNlX2lkLFxuICAgICAgICAgICAgJ3BhZ2VfdG9rZW4nOiBkYXRhc2V0LmxpZ2h0Ym94UGFyYW1zLnBhZ2VfdG9rZW5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3IgYW5kIHByZXZlbnQgZXZlbnQgYnViYmxpbmcuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIC8vIEV4aXQgaW1tZWRpYXRlbHkgaWYgYnV0dG9uIGhhcyBiZWVuIGFscmVhZHkgY2xpY2tlZC5cbiAgICAgICAgaWYgKCRidXR0b24uaGFzQ2xhc3MoYWN0aXZlQnV0dG9uQ2xhc3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYXJrIGJ1dHRvbiBhcyBjbGlja2VkIHRvIHByZXZlbnQgbXVsdGlwbGUgY2xpY2tzLiBcbiAgICAgICAgJGJ1dHRvbi5hZGRDbGFzcyhhY3RpdmVCdXR0b25DbGFzcyk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBBSkFYIFBPU1QgcmVxdWVzdC5cbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IGpzZS5saWJzLnhoci5wb3N0KHt1cmwsIGRhdGF9KTtcblxuICAgICAgICAvLyBBSkFYIHJlcXVlc3Qgc3VjY2VzcyBoYW5kbGVyLlxuICAgICAgICByZXF1ZXN0LmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgJHBhcmNlbFNlcnZpY2VMaXN0Lmh0bWwocmVzcG9uc2UuaHRtbCk7XG4gICAgICAgICAgICAkLmxpZ2h0Ym94X3BsdWdpbignY2xvc2UnLCBkYXRhc2V0LmxpZ2h0Ym94UGFyYW1zLmlkZW50aWZpZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBSkFYIHJlcXVlc3QgZXJyb3IgaGFuZGxlci5cbiAgICAgICAgcmVxdWVzdC5mYWlsKChqcVhIUiwgZXhjZXB0aW9uKSA9PiAkLmxpZ2h0Ym94X3BsdWdpbignZXJyb3InLCBkYXRhc2V0LmxpZ2h0Ym94UGFyYW1zLmlkZW50aWZpZXIsIGpxWEhSLCBleGNlcHRpb24pKTtcblxuICAgIH07XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5kZWxldGUnLCBfaGFuZGxlRGVsZXRlQWN0aW9uKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7XG4iXX0=
