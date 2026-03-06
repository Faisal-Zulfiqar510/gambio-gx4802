'use strict';

/* --------------------------------------------------------------
 order_paypalng.js 2015-09-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## PayPalNG Payment Details on Order Page
 *
 * This module add the paypalng payment informationen to the order details page.
 *
 * @module Compatibility/order_paypalng
 */
gx.compatibility.module('order_paypalng', [],

/**  @lends module:Compatibility/order_paypalng */

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
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $('table.pdf_menu').remove();
    $this.append($('.ecdetails').parent().html());
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcl9wYXlwYWxuZy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiaW5pdCIsImRvbmUiLCJyZW1vdmUiLCJhcHBlbmQiLCJwYXJlbnQiLCJodG1sIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxnQkFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxZQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxXQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7O0FBRUFBLFNBQU9PLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCTCxNQUFFLGdCQUFGLEVBQW9CTSxNQUFwQjtBQUNBUCxVQUFNUSxNQUFOLENBQWFQLEVBQUUsWUFBRixFQUFnQlEsTUFBaEIsR0FBeUJDLElBQXpCLEVBQWI7QUFDQUo7QUFDSCxHQUpEOztBQU1BLFNBQU9SLE1BQVA7QUFDSCxDQXZETCIsImZpbGUiOiJvcmRlcnMvb3JkZXJfcGF5cGFsbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyX3BheXBhbG5nLmpzIDIwMTUtMDktMjJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFBheVBhbE5HIFBheW1lbnQgRGV0YWlscyBvbiBPcmRlciBQYWdlXG4gKlxuICogVGhpcyBtb2R1bGUgYWRkIHRoZSBwYXlwYWxuZyBwYXltZW50IGluZm9ybWF0aW9uZW4gdG8gdGhlIG9yZGVyIGRldGFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvb3JkZXJfcGF5cGFsbmdcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ29yZGVyX3BheXBhbG5nJyxcblxuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvb3JkZXJfcGF5cGFsbmcgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICQoJ3RhYmxlLnBkZl9tZW51JykucmVtb3ZlKCk7XG4gICAgICAgICAgICAkdGhpcy5hcHBlbmQoJCgnLmVjZGV0YWlscycpLnBhcmVudCgpLmh0bWwoKSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
