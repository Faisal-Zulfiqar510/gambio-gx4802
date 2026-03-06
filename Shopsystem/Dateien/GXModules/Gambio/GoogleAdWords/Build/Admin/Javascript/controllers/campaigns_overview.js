'use strict';

/* --------------------------------------------------------------
 campaigns_overview.js 2017-12-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module('campaigns_overview', ['modal'], function (data) {
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
  var defaults = {};

  /**
   * Campaigns Overview
   *
   * @type {*|jQuery|HTMLElement}
   */
  var $campaignsOverview = $('.campaigns-overview');

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
   * Handler for the account modal, that will be displayed if the user is not connected with Google AdWords
   *
   * @param {object} event jQuery event object contains information of the event.
   */
  function _showAccountModal(event) {
    if (event !== undefined) {
      event.preventDefault();
    }

    $('.adwords-account.modal').modal('show');
  }

  // ------------------------------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------------------------------

  module.init = function (done) {
    if (options.showAccountForm) {
      _showAccountModal();
      $campaignsOverview.on('click', 'td', _showAccountModal);
    }

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvY2FtcGFpZ25zX292ZXJ2aWV3LmpzIl0sIm5hbWVzIjpbImd4bW9kdWxlcyIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwiJGNhbXBhaWduc092ZXJ2aWV3Iiwib3B0aW9ucyIsImV4dGVuZCIsIl9zaG93QWNjb3VudE1vZGFsIiwiZXZlbnQiLCJ1bmRlZmluZWQiLCJwcmV2ZW50RGVmYXVsdCIsIm1vZGFsIiwiaW5pdCIsImRvbmUiLCJzaG93QWNjb3VudEZvcm0iLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxVQUFVQyxXQUFWLENBQXNCQyxNQUF0QixDQUNJLG9CQURKLEVBR0ksQ0FDSSxPQURKLENBSEosRUFPSSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxNQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLE1BQU1DLHFCQUFxQkYsRUFBRSxxQkFBRixDQUEzQjs7QUFFQTs7Ozs7QUFLQSxNQUFNRyxVQUFVSCxFQUFFSSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJILFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxNQUFNRCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLFdBQVNRLGlCQUFULENBQTJCQyxLQUEzQixFQUFrQztBQUM5QixRQUFJQSxVQUFVQyxTQUFkLEVBQXlCO0FBQ3JCRCxZQUFNRSxjQUFOO0FBQ0g7O0FBRURSLE1BQUUsd0JBQUYsRUFBNEJTLEtBQTVCLENBQWtDLE1BQWxDO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBWixTQUFPYSxJQUFQLEdBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3BCLFFBQUlSLFFBQVFTLGVBQVosRUFBNkI7QUFDekJQO0FBQ0FILHlCQUFtQlcsRUFBbkIsQ0FBc0IsT0FBdEIsRUFBK0IsSUFBL0IsRUFBcUNSLGlCQUFyQztBQUNIOztBQUVETTtBQUNILEdBUEQ7O0FBU0EsU0FBT2QsTUFBUDtBQUNILENBaEZMIiwiZmlsZSI6IkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvY2FtcGFpZ25zX292ZXJ2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBjYW1wYWlnbnNfb3ZlcnZpZXcuanMgMjAxNy0xMi0xNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4bW9kdWxlcy5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2NhbXBhaWduc19vdmVydmlldycsXG5cbiAgICBbXG4gICAgICAgICdtb2RhbCdcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FtcGFpZ25zIE92ZXJ2aWV3XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHsqfGpRdWVyeXxIVE1MRWxlbWVudH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRjYW1wYWlnbnNPdmVydmlldyA9ICQoJy5jYW1wYWlnbnMtb3ZlcnZpZXcnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIGFjY291bnQgbW9kYWwsIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgaWYgdGhlIHVzZXIgaXMgbm90IGNvbm5lY3RlZCB3aXRoIEdvb2dsZSBBZFdvcmRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93QWNjb3VudE1vZGFsKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJy5hZHdvcmRzLWFjY291bnQubW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gKGRvbmUpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNob3dBY2NvdW50Rm9ybSkge1xuICAgICAgICAgICAgICAgIF9zaG93QWNjb3VudE1vZGFsKCk7XG4gICAgICAgICAgICAgICAgJGNhbXBhaWduc092ZXJ2aWV3Lm9uKCdjbGljaycsICd0ZCcsIF9zaG93QWNjb3VudE1vZGFsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
