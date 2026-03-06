'use strict';

/* --------------------------------------------------------------
 resize.js 2016-05-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Resize Layout Controller
 *
 * During the admin layout lifecycle there are events that will change the size of the document (not the window!)
 * and the layout must react to them. This controller will make sure that the layout will remain stable after such
 * changes are marked with the "data-resize-layout" attribute as in the following example.
 *
 * ```html
 * <!-- DataTable Instance -->
 * <table data-gx-widget="datatable" data-resize-layout="draw.dt">
 *   ...
 * </table>
 * ```
 *
 * After a table draw is performed, it is possible that there will be more rows to be displayed and thus the
 * #main-content element gets bigger. Once the datatable "draw.dt" event is executed this module will make
 * sure that the layout remains solid.
 *
 * The event must bubble up to the container this module is bound.
 *
 * ### Dynamic Elements
 *
 * It is possible that during the page lifecycle there will be dynamic elements that will need to register
 * an the "resize-layout" event. In this case apply the "data-resize-layout" attribute in the dynamic
 * element and trigger the "resize:bind" event from that element. The event must bubble up to the layout
 * container which will then register the dynamic elements.
 */
gx.controllers.module('resize', [], function (data) {

  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  /**
   * Marks event listeners.
   *
   * @type {string}
   */

  var ATTRIBUTE_NAME = 'data-resize-layout';

  /**
   * Module Selector
   *
   * @type {jQuery}
   */
  var $this = $(this);

  /**
   * Module Instance
   *
   * @type {Object}
   */
  var module = {};

  /**
   * Main Header Selector
   *
   * @type {jQuery}
   */
  var $mainHeader = $('#main-header');

  /**
   * Main Menu Selector
   *
   * @type {jQuery}
   */
  var $mainMenu = $('#main-menu');

  /**
   * Main Footer Selector
   *
   * @type {jQuery}
   */
  var $mainFooter = $('#main-footer');

  /**
   * Main Footer Info
   *
   * @type {jQuery}
   */
  var $mainFooterInfo = $mainFooter.find('.info');

  /**
   * Main Footer Copyright
   *
   * @type {jQuery}
   */
  var $mainFooterCopyright = $mainFooter.find('.copyright');

  // ------------------------------------------------------------------------
  // FUNCTIONS
  // ------------------------------------------------------------------------

  /**
   * Bind resize events.
   */
  function _bindResizeEvents() {
    $this.find('[' + ATTRIBUTE_NAME + ']').each(function () {
      var event = $(this).attr(ATTRIBUTE_NAME);
      $(this).removeAttr(ATTRIBUTE_NAME).on(event, _updateLayoutComponents);
    });
  }

  /**
   * Give initial min height to main menu.
   */
  function _updateLayoutComponents() {
    var mainMenuHeight = window.innerHeight - $mainHeader.outerHeight() - $mainFooter.outerHeight() + $mainFooterCopyright.outerHeight();
    $mainMenu.css('min-height', mainMenuHeight);
    _setFooterInfoPosition();
  }

  /**
   * Calculate the correct footer info position.
   */
  function _setFooterInfoPosition() {
    if ($(document).scrollTop() + window.innerHeight - $mainFooterInfo.outerHeight() <= $mainFooter.offset().top) {
      $mainFooter.addClass('fixed');
    } else if ($mainFooterInfo.offset().top + $mainFooterInfo.height() >= $mainFooter.offset().top) {
      $mainFooter.removeClass('fixed');
    }
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    $(window).on('resize', _updateLayoutComponents).on('JSENGINE_INIT_FINISHED', _updateLayoutComponents).on('scroll', _setFooterInfoPosition).on('register:bind', _bindResizeEvents);

    _bindResizeEvents();

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9yZXNpemUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCJBVFRSSUJVVEVfTkFNRSIsIiR0aGlzIiwiJCIsIiRtYWluSGVhZGVyIiwiJG1haW5NZW51IiwiJG1haW5Gb290ZXIiLCIkbWFpbkZvb3RlckluZm8iLCJmaW5kIiwiJG1haW5Gb290ZXJDb3B5cmlnaHQiLCJfYmluZFJlc2l6ZUV2ZW50cyIsImVhY2giLCJldmVudCIsImF0dHIiLCJyZW1vdmVBdHRyIiwib24iLCJfdXBkYXRlTGF5b3V0Q29tcG9uZW50cyIsIm1haW5NZW51SGVpZ2h0Iiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJvdXRlckhlaWdodCIsImNzcyIsIl9zZXRGb290ZXJJbmZvUG9zaXRpb24iLCJkb2N1bWVudCIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsImFkZENsYXNzIiwiaGVpZ2h0IiwicmVtb3ZlQ2xhc3MiLCJpbml0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixRQUF0QixFQUFnQyxFQUFoQyxFQUFvQyxVQUFVQyxJQUFWLEVBQWdCOztBQUVoRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLE1BQU1DLGlCQUFpQixvQkFBdkI7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUosU0FBUyxFQUFmOztBQUVBOzs7OztBQUtBLE1BQU1LLGNBQWNELEVBQUUsY0FBRixDQUFwQjs7QUFFQTs7Ozs7QUFLQSxNQUFNRSxZQUFZRixFQUFFLFlBQUYsQ0FBbEI7O0FBRUE7Ozs7O0FBS0EsTUFBTUcsY0FBY0gsRUFBRSxjQUFGLENBQXBCOztBQUVBOzs7OztBQUtBLE1BQU1JLGtCQUFrQkQsWUFBWUUsSUFBWixDQUFpQixPQUFqQixDQUF4Qjs7QUFFQTs7Ozs7QUFLQSxNQUFNQyx1QkFBdUJILFlBQVlFLElBQVosQ0FBaUIsWUFBakIsQ0FBN0I7O0FBR0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQSxXQUFTRSxpQkFBVCxHQUE2QjtBQUN6QlIsVUFBTU0sSUFBTixPQUFlUCxjQUFmLFFBQWtDVSxJQUFsQyxDQUF1QyxZQUFZO0FBQy9DLFVBQUlDLFFBQVFULEVBQUUsSUFBRixFQUFRVSxJQUFSLENBQWFaLGNBQWIsQ0FBWjtBQUNBRSxRQUFFLElBQUYsRUFDS1csVUFETCxDQUNnQmIsY0FEaEIsRUFFS2MsRUFGTCxDQUVRSCxLQUZSLEVBRWVJLHVCQUZmO0FBR0gsS0FMRDtBQU1IOztBQUVEOzs7QUFHQSxXQUFTQSx1QkFBVCxHQUFtQztBQUMvQixRQUFNQyxpQkFBaUJDLE9BQU9DLFdBQVAsR0FBcUJmLFlBQVlnQixXQUFaLEVBQXJCLEdBQWlEZCxZQUFZYyxXQUFaLEVBQWpELEdBQ2pCWCxxQkFBcUJXLFdBQXJCLEVBRE47QUFFQWYsY0FBVWdCLEdBQVYsQ0FBYyxZQUFkLEVBQTRCSixjQUE1QjtBQUNBSztBQUNIOztBQUVEOzs7QUFHQSxXQUFTQSxzQkFBVCxHQUFrQztBQUM5QixRQUFLbkIsRUFBRW9CLFFBQUYsRUFBWUMsU0FBWixLQUEwQk4sT0FBT0MsV0FBakMsR0FBK0NaLGdCQUFnQmEsV0FBaEIsRUFBaEQsSUFBa0ZkLFlBQVltQixNQUFaLEdBQXFCQyxHQUEzRyxFQUFnSDtBQUM1R3BCLGtCQUFZcUIsUUFBWixDQUFxQixPQUFyQjtBQUNILEtBRkQsTUFFTyxJQUFJcEIsZ0JBQWdCa0IsTUFBaEIsR0FBeUJDLEdBQXpCLEdBQStCbkIsZ0JBQWdCcUIsTUFBaEIsRUFBL0IsSUFBMkR0QixZQUFZbUIsTUFBWixHQUFxQkMsR0FBcEYsRUFBeUY7QUFDNUZwQixrQkFBWXVCLFdBQVosQ0FBd0IsT0FBeEI7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTlCLFNBQU8rQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjVCLE1BQUVlLE1BQUYsRUFDS0gsRUFETCxDQUNRLFFBRFIsRUFDa0JDLHVCQURsQixFQUVLRCxFQUZMLENBRVEsd0JBRlIsRUFFa0NDLHVCQUZsQyxFQUdLRCxFQUhMLENBR1EsUUFIUixFQUdrQk8sc0JBSGxCLEVBSUtQLEVBSkwsQ0FJUSxlQUpSLEVBSXlCTCxpQkFKekI7O0FBTUFBOztBQUVBcUI7QUFDSCxHQVZEOztBQVlBLFNBQU9oQyxNQUFQO0FBQ0gsQ0F2SEQiLCJmaWxlIjoibGF5b3V0cy9tYWluL3Jlc2l6ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gcmVzaXplLmpzIDIwMTYtMDUtMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFJlc2l6ZSBMYXlvdXQgQ29udHJvbGxlclxuICpcbiAqIER1cmluZyB0aGUgYWRtaW4gbGF5b3V0IGxpZmVjeWNsZSB0aGVyZSBhcmUgZXZlbnRzIHRoYXQgd2lsbCBjaGFuZ2UgdGhlIHNpemUgb2YgdGhlIGRvY3VtZW50IChub3QgdGhlIHdpbmRvdyEpXG4gKiBhbmQgdGhlIGxheW91dCBtdXN0IHJlYWN0IHRvIHRoZW0uIFRoaXMgY29udHJvbGxlciB3aWxsIG1ha2Ugc3VyZSB0aGF0IHRoZSBsYXlvdXQgd2lsbCByZW1haW4gc3RhYmxlIGFmdGVyIHN1Y2hcbiAqIGNoYW5nZXMgYXJlIG1hcmtlZCB3aXRoIHRoZSBcImRhdGEtcmVzaXplLWxheW91dFwiIGF0dHJpYnV0ZSBhcyBpbiB0aGUgZm9sbG93aW5nIGV4YW1wbGUuXG4gKlxuICogYGBgaHRtbFxuICogPCEtLSBEYXRhVGFibGUgSW5zdGFuY2UgLS0+XG4gKiA8dGFibGUgZGF0YS1neC13aWRnZXQ9XCJkYXRhdGFibGVcIiBkYXRhLXJlc2l6ZS1sYXlvdXQ9XCJkcmF3LmR0XCI+XG4gKiAgIC4uLlxuICogPC90YWJsZT5cbiAqIGBgYFxuICpcbiAqIEFmdGVyIGEgdGFibGUgZHJhdyBpcyBwZXJmb3JtZWQsIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlcmUgd2lsbCBiZSBtb3JlIHJvd3MgdG8gYmUgZGlzcGxheWVkIGFuZCB0aHVzIHRoZVxuICogI21haW4tY29udGVudCBlbGVtZW50IGdldHMgYmlnZ2VyLiBPbmNlIHRoZSBkYXRhdGFibGUgXCJkcmF3LmR0XCIgZXZlbnQgaXMgZXhlY3V0ZWQgdGhpcyBtb2R1bGUgd2lsbCBtYWtlXG4gKiBzdXJlIHRoYXQgdGhlIGxheW91dCByZW1haW5zIHNvbGlkLlxuICpcbiAqIFRoZSBldmVudCBtdXN0IGJ1YmJsZSB1cCB0byB0aGUgY29udGFpbmVyIHRoaXMgbW9kdWxlIGlzIGJvdW5kLlxuICpcbiAqICMjIyBEeW5hbWljIEVsZW1lbnRzXG4gKlxuICogSXQgaXMgcG9zc2libGUgdGhhdCBkdXJpbmcgdGhlIHBhZ2UgbGlmZWN5Y2xlIHRoZXJlIHdpbGwgYmUgZHluYW1pYyBlbGVtZW50cyB0aGF0IHdpbGwgbmVlZCB0byByZWdpc3RlclxuICogYW4gdGhlIFwicmVzaXplLWxheW91dFwiIGV2ZW50LiBJbiB0aGlzIGNhc2UgYXBwbHkgdGhlIFwiZGF0YS1yZXNpemUtbGF5b3V0XCIgYXR0cmlidXRlIGluIHRoZSBkeW5hbWljXG4gKiBlbGVtZW50IGFuZCB0cmlnZ2VyIHRoZSBcInJlc2l6ZTpiaW5kXCIgZXZlbnQgZnJvbSB0aGF0IGVsZW1lbnQuIFRoZSBldmVudCBtdXN0IGJ1YmJsZSB1cCB0byB0aGUgbGF5b3V0XG4gKiBjb250YWluZXIgd2hpY2ggd2lsbCB0aGVuIHJlZ2lzdGVyIHRoZSBkeW5hbWljIGVsZW1lbnRzLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ3Jlc2l6ZScsIFtdLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNYXJrcyBldmVudCBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGNvbnN0IEFUVFJJQlVURV9OQU1FID0gJ2RhdGEtcmVzaXplLWxheW91dCc7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTWFpbiBIZWFkZXIgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJG1haW5IZWFkZXIgPSAkKCcjbWFpbi1oZWFkZXInKTtcblxuICAgIC8qKlxuICAgICAqIE1haW4gTWVudSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkbWFpbk1lbnUgPSAkKCcjbWFpbi1tZW51Jyk7XG5cbiAgICAvKipcbiAgICAgKiBNYWluIEZvb3RlciBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkbWFpbkZvb3RlciA9ICQoJyNtYWluLWZvb3RlcicpO1xuXG4gICAgLyoqXG4gICAgICogTWFpbiBGb290ZXIgSW5mb1xuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkbWFpbkZvb3RlckluZm8gPSAkbWFpbkZvb3Rlci5maW5kKCcuaW5mbycpO1xuXG4gICAgLyoqXG4gICAgICogTWFpbiBGb290ZXIgQ29weXJpZ2h0XG4gICAgICpcbiAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAqL1xuICAgIGNvbnN0ICRtYWluRm9vdGVyQ29weXJpZ2h0ID0gJG1haW5Gb290ZXIuZmluZCgnLmNvcHlyaWdodCcpO1xuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIEJpbmQgcmVzaXplIGV2ZW50cy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYmluZFJlc2l6ZUV2ZW50cygpIHtcbiAgICAgICAgJHRoaXMuZmluZChgWyR7QVRUUklCVVRFX05BTUV9XWApLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGV2ZW50ID0gJCh0aGlzKS5hdHRyKEFUVFJJQlVURV9OQU1FKTtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cihBVFRSSUJVVEVfTkFNRSlcbiAgICAgICAgICAgICAgICAub24oZXZlbnQsIF91cGRhdGVMYXlvdXRDb21wb25lbnRzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZSBpbml0aWFsIG1pbiBoZWlnaHQgdG8gbWFpbiBtZW51LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF91cGRhdGVMYXlvdXRDb21wb25lbnRzKCkge1xuICAgICAgICBjb25zdCBtYWluTWVudUhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtICRtYWluSGVhZGVyLm91dGVySGVpZ2h0KCkgLSAkbWFpbkZvb3Rlci5vdXRlckhlaWdodCgpXG4gICAgICAgICAgICArICRtYWluRm9vdGVyQ29weXJpZ2h0Lm91dGVySGVpZ2h0KCk7XG4gICAgICAgICRtYWluTWVudS5jc3MoJ21pbi1oZWlnaHQnLCBtYWluTWVudUhlaWdodCk7XG4gICAgICAgIF9zZXRGb290ZXJJbmZvUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgdGhlIGNvcnJlY3QgZm9vdGVyIGluZm8gcG9zaXRpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3NldEZvb3RlckluZm9Qb3NpdGlvbigpIHtcbiAgICAgICAgaWYgKCgkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSArIHdpbmRvdy5pbm5lckhlaWdodCAtICRtYWluRm9vdGVySW5mby5vdXRlckhlaWdodCgpKSA8PSAkbWFpbkZvb3Rlci5vZmZzZXQoKS50b3ApIHtcbiAgICAgICAgICAgICRtYWluRm9vdGVyLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9IGVsc2UgaWYgKCRtYWluRm9vdGVySW5mby5vZmZzZXQoKS50b3AgKyAkbWFpbkZvb3RlckluZm8uaGVpZ2h0KCkgPj0gJG1haW5Gb290ZXIub2Zmc2V0KCkudG9wKSB7XG4gICAgICAgICAgICAkbWFpbkZvb3Rlci5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICQod2luZG93KVxuICAgICAgICAgICAgLm9uKCdyZXNpemUnLCBfdXBkYXRlTGF5b3V0Q29tcG9uZW50cylcbiAgICAgICAgICAgIC5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsIF91cGRhdGVMYXlvdXRDb21wb25lbnRzKVxuICAgICAgICAgICAgLm9uKCdzY3JvbGwnLCBfc2V0Rm9vdGVySW5mb1Bvc2l0aW9uKVxuICAgICAgICAgICAgLm9uKCdyZWdpc3RlcjpiaW5kJywgX2JpbmRSZXNpemVFdmVudHMpO1xuXG4gICAgICAgIF9iaW5kUmVzaXplRXZlbnRzKCk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7XG4iXX0=
