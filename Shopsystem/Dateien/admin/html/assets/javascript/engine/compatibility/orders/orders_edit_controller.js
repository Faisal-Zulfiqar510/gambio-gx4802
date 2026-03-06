'use strict';

/* --------------------------------------------------------------
 orders_edit_controller.js 2015-08-24 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Orders Edit Controller
 *
 * This controller contains the mapping logic of orders edit table.
 *
 * @module Compatibility/orders_edit_controller
 */
gx.compatibility.module('orders_edit_controller', [],

/**  @lends module:Compatibility/orders_edit_controller */

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
  // OPERATIONS
  // ------------------------------------------------------------------------

  /**
   * Map trash icon to submit button
   */
  $('[data-new-delete-button]').on('click', function () {
    $(this).closest('form[name="product_option_delete"]').submit();
  });

  /**
   * Hide the original submit and save button and set the icon
   * font size to 1 em
   */
  $(document).ready($('[name="save_original"]').hide(), $(this).find('.btn-delete').closest('form').find(':submit').hide(), $(this).find('.fa-trash-o').css('font-size', '16px'));

  /**
   * Map the new save button to the old one on click
   */
  $('[data-new-save-button]').on('click', function (e) {
    e.preventDefault();

    $(this).closest('tr').find('[name="save_original"]').click();
  });

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfZWRpdF9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJvbiIsImNsb3Nlc3QiLCJzdWJtaXQiLCJkb2N1bWVudCIsInJlYWR5IiwiaGlkZSIsImZpbmQiLCJjc3MiLCJlIiwicHJldmVudERlZmF1bHQiLCJjbGljayIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSx3QkFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsVUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxZQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxXQUFTLEVBM0JiO0FBNEJBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FHLElBQUUsMEJBQUYsRUFBOEJJLEVBQTlCLENBQWlDLE9BQWpDLEVBQTBDLFlBQVk7QUFDbERKLE1BQUUsSUFBRixFQUNLSyxPQURMLENBQ2Esb0NBRGIsRUFFS0MsTUFGTDtBQUdILEdBSkQ7O0FBTUE7Ozs7QUFJQU4sSUFBRU8sUUFBRixFQUFZQyxLQUFaLENBQ0lSLEVBQUUsd0JBQUYsRUFBNEJTLElBQTVCLEVBREosRUFFSVQsRUFBRSxJQUFGLEVBQVFVLElBQVIsQ0FBYSxhQUFiLEVBQTRCTCxPQUE1QixDQUFvQyxNQUFwQyxFQUE0Q0ssSUFBNUMsQ0FBaUQsU0FBakQsRUFBNERELElBQTVELEVBRkosRUFHSVQsRUFBRSxJQUFGLEVBQVFVLElBQVIsQ0FBYSxhQUFiLEVBQTRCQyxHQUE1QixDQUFnQyxXQUFoQyxFQUE2QyxNQUE3QyxDQUhKOztBQU1BOzs7QUFHQVgsSUFBRSx3QkFBRixFQUE0QkksRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsVUFBVVEsQ0FBVixFQUFhO0FBQ2pEQSxNQUFFQyxjQUFGOztBQUVBYixNQUFFLElBQUYsRUFDS0ssT0FETCxDQUNhLElBRGIsRUFFS0ssSUFGTCxDQUVVLHdCQUZWLEVBR0tJLEtBSEw7QUFJSCxHQVBEOztBQVNBO0FBQ0E7QUFDQTs7QUFFQWpCLFNBQU9rQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQkE7QUFDSCxHQUZEOztBQUlBLFNBQU9uQixNQUFQO0FBQ0gsQ0F2RkwiLCJmaWxlIjoib3JkZXJzL29yZGVyc19lZGl0X2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyc19lZGl0X2NvbnRyb2xsZXIuanMgMjAxNS0wOC0yNCBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgT3JkZXJzIEVkaXQgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciBjb250YWlucyB0aGUgbWFwcGluZyBsb2dpYyBvZiBvcmRlcnMgZWRpdCB0YWJsZS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvb3JkZXJzX2VkaXRfY29udHJvbGxlclxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnb3JkZXJzX2VkaXRfY29udHJvbGxlcicsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L29yZGVyc19lZGl0X2NvbnRyb2xsZXIgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBPUEVSQVRJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgdHJhc2ggaWNvbiB0byBzdWJtaXQgYnV0dG9uXG4gICAgICAgICAqL1xuICAgICAgICAkKCdbZGF0YS1uZXctZGVsZXRlLWJ1dHRvbl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJ2Zvcm1bbmFtZT1cInByb2R1Y3Rfb3B0aW9uX2RlbGV0ZVwiXScpXG4gICAgICAgICAgICAgICAgLnN1Ym1pdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGlkZSB0aGUgb3JpZ2luYWwgc3VibWl0IGFuZCBzYXZlIGJ1dHRvbiBhbmQgc2V0IHRoZSBpY29uXG4gICAgICAgICAqIGZvbnQgc2l6ZSB0byAxIGVtXG4gICAgICAgICAqL1xuICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShcbiAgICAgICAgICAgICQoJ1tuYW1lPVwic2F2ZV9vcmlnaW5hbFwiXScpLmhpZGUoKSxcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmJ0bi1kZWxldGUnKS5jbG9zZXN0KCdmb3JtJykuZmluZCgnOnN1Ym1pdCcpLmhpZGUoKSxcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmZhLXRyYXNoLW8nKS5jc3MoJ2ZvbnQtc2l6ZScsICcxNnB4JylcbiAgICAgICAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWFwIHRoZSBuZXcgc2F2ZSBidXR0b24gdG8gdGhlIG9sZCBvbmUgb24gY2xpY2tcbiAgICAgICAgICovXG4gICAgICAgICQoJ1tkYXRhLW5ldy1zYXZlLWJ1dHRvbl0nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJ3RyJylcbiAgICAgICAgICAgICAgICAuZmluZCgnW25hbWU9XCJzYXZlX29yaWdpbmFsXCJdJylcbiAgICAgICAgICAgICAgICAuY2xpY2soKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
