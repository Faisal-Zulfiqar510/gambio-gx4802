'use strict';

/* --------------------------------------------------------------
 order_invoice.js 2015-09-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## PayPal3 Payment Details on Order Page
 *
 * This module add the paypal3 payment informationen to the order details page.
 *
 * @module Compatibility/order_invoice
 */
gx.compatibility.module('order_invoice', ['modal'],

/**  @lends module:Compatibility/order_invoice */

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

    var _cancelInvoiceClickHandler = function _cancelInvoiceClickHandler() {
        var confirm = false;
        var $link = $(this);

        jse.libs.modal.message({
            minWidth: 400,
            title: jse.core.lang.translate('HEADING_MODAL_CANCELLATION_INVOICE', 'orders'),
            content: jse.core.lang.translate('TEXT_MODAL_CANCELLATION_INVOICE', 'orders').replace('%s', $link.data('invoice-number')),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                    window.open($link.attr('href'), '_blank');
                }
            }]
        });

        return false;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.append($('table.invoice'));
        $this.find('.cancel-invoice').on('click', _cancelInvoiceClickHandler);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcl9pbnZvaWNlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfY2FuY2VsSW52b2ljZUNsaWNrSGFuZGxlciIsImNvbmZpcm0iLCIkbGluayIsImpzZSIsImxpYnMiLCJtb2RhbCIsIm1lc3NhZ2UiLCJtaW5XaWR0aCIsInRpdGxlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJjb250ZW50IiwicmVwbGFjZSIsImJ1dHRvbnMiLCJ0ZXh0IiwiY2xpY2siLCJkaWFsb2ciLCJ3aW5kb3ciLCJvcGVuIiwiYXR0ciIsImluaXQiLCJkb25lIiwiYXBwZW5kIiwiZmluZCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxlQURKLEVBR0ksQ0FBQyxPQUFELENBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxjQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRCxhQUFTLEVBM0JiOztBQTZCQSxRQUFJTyw2QkFBNkIsU0FBN0JBLDBCQUE2QixHQUFZO0FBQ3pDLFlBQUlDLFVBQVUsS0FBZDtBQUNBLFlBQUlDLFFBQVFOLEVBQUUsSUFBRixDQUFaOztBQUVBTyxZQUFJQyxJQUFKLENBQVNDLEtBQVQsQ0FBZUMsT0FBZixDQUF1QjtBQUNuQkMsc0JBQVUsR0FEUztBQUVuQkMsbUJBQU9MLElBQUlNLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLG9DQUF4QixFQUE4RCxRQUE5RCxDQUZZO0FBR25CQyxxQkFBU1QsSUFBSU0sSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsaUNBQXhCLEVBQTJELFFBQTNELEVBQXFFRSxPQUFyRSxDQUE2RSxJQUE3RSxFQUFtRlgsTUFBTVIsSUFBTixDQUFXLGdCQUFYLENBQW5GLENBSFU7QUFJbkJvQixxQkFBUyxDQUNMO0FBQ0lDLHNCQUFNWixJQUFJTSxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixJQUF4QixFQUE4QixrQkFBOUIsQ0FEVjtBQUVJSyx1QkFBTyxpQkFBWTtBQUNmcEIsc0JBQUUsSUFBRixFQUFRcUIsTUFBUixDQUFlLE9BQWY7QUFDSDtBQUpMLGFBREssRUFPTDtBQUNJRixzQkFBTVosSUFBSU0sSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsS0FBeEIsRUFBK0Isa0JBQS9CLENBRFY7QUFFSUssdUJBQU8saUJBQVk7QUFDZnBCLHNCQUFFLElBQUYsRUFBUXFCLE1BQVIsQ0FBZSxPQUFmO0FBQ0FDLDJCQUFPQyxJQUFQLENBQVlqQixNQUFNa0IsSUFBTixDQUFXLE1BQVgsQ0FBWixFQUFnQyxRQUFoQztBQUNIO0FBTEwsYUFQSztBQUpVLFNBQXZCOztBQXFCQSxlQUFPLEtBQVA7QUFDSCxLQTFCRDs7QUE2QkE7QUFDQTtBQUNBOztBQUVBM0IsV0FBTzRCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCM0IsY0FBTTRCLE1BQU4sQ0FBYTNCLEVBQUUsZUFBRixDQUFiO0FBQ0FELGNBQU02QixJQUFOLENBQVcsaUJBQVgsRUFBOEJDLEVBQTlCLENBQWlDLE9BQWpDLEVBQTBDekIsMEJBQTFDOztBQUVBc0I7QUFDSCxLQUxEOztBQU9BLFdBQU83QixNQUFQO0FBQ0gsQ0FyRkwiLCJmaWxlIjoib3JkZXJzL29yZGVyX2ludm9pY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyX2ludm9pY2UuanMgMjAxNS0wOS0yOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgUGF5UGFsMyBQYXltZW50IERldGFpbHMgb24gT3JkZXIgUGFnZVxuICpcbiAqIFRoaXMgbW9kdWxlIGFkZCB0aGUgcGF5cGFsMyBwYXltZW50IGluZm9ybWF0aW9uZW4gdG8gdGhlIG9yZGVyIGRldGFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvb3JkZXJfaW52b2ljZVxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnb3JkZXJfaW52b2ljZScsXG5cbiAgICBbJ21vZGFsJ10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9vcmRlcl9pbnZvaWNlICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIHZhciBfY2FuY2VsSW52b2ljZUNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb25maXJtID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgJGxpbmsgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBtaW5XaWR0aDogNDAwLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnSEVBRElOR19NT0RBTF9DQU5DRUxMQVRJT05fSU5WT0lDRScsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9NT0RBTF9DQU5DRUxMQVRJT05fSU5WT0lDRScsICdvcmRlcnMnKS5yZXBsYWNlKCclcycsICRsaW5rLmRhdGEoJ2ludm9pY2UtbnVtYmVyJykpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCd5ZXMnLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbigkbGluay5hdHRyKCdocmVmJyksICdfYmxhbmsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJHRoaXMuYXBwZW5kKCQoJ3RhYmxlLmludm9pY2UnKSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcuY2FuY2VsLWludm9pY2UnKS5vbignY2xpY2snLCBfY2FuY2VsSW52b2ljZUNsaWNrSGFuZGxlcik7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
