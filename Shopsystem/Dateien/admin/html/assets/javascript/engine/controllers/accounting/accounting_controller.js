'use strict';

/* --------------------------------------------------------------
 accounting_controller.js 2015-09-24 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 ----------------------------------------------------------------
 */

/**
 * ## Accounting Controller Widget
 *
 * This controller will handle the checkboxes in this page.
 *
 * @module Controllers/accounting_controller
 */
gx.controllers.module(
// Module name
'accounting_controller',

// Module dependencies
[],

/** @lends module:Controllers/accounting_controller */

function () {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var $this = $(this),
        module = {};

    // ------------------------------------------------------------------------
    // ELEMENTS DEFINITION
    // ------------------------------------------------------------------------

    var $mainCheckBox = $this.find('#check_all');
    var $checkboxes = $this.find('input[name="access[]"]');

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _onClick = function _onClick(event) {
        var $target = $(event.target);

        if ($target.is($mainCheckBox)) {
            var checked = $target.is(':checked');

            $checkboxes.each(function (index, element) {
                var $switcher = $(element).parent();

                $(element).attr('checked', checked);

                if (checked) {
                    $switcher.addClass('checked');
                } else {
                    $switcher.removeClass('checked');
                }
            });
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        $this.on('click', _onClick);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY291bnRpbmcvYWNjb3VudGluZ19jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCIkdGhpcyIsIiQiLCIkbWFpbkNoZWNrQm94IiwiZmluZCIsIiRjaGVja2JveGVzIiwiX29uQ2xpY2siLCJldmVudCIsIiR0YXJnZXQiLCJ0YXJnZXQiLCJpcyIsImNoZWNrZWQiLCJlYWNoIiwiaW5kZXgiLCJlbGVtZW50IiwiJHN3aXRjaGVyIiwicGFyZW50IiwiYXR0ciIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmO0FBQ0k7QUFDQSx1QkFGSjs7QUFJSTtBQUNBLEVBTEo7O0FBT0k7O0FBRUEsWUFBWTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUMsUUFBUUMsRUFBRSxJQUFGLENBQVo7QUFBQSxRQUNJRixTQUFTLEVBRGI7O0FBR0E7QUFDQTtBQUNBOztBQUVBLFFBQUlHLGdCQUFnQkYsTUFBTUcsSUFBTixDQUFXLFlBQVgsQ0FBcEI7QUFDQSxRQUFJQyxjQUFjSixNQUFNRyxJQUFOLENBQVcsd0JBQVgsQ0FBbEI7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFFBQUlFLFdBQVcsU0FBWEEsUUFBVyxDQUFVQyxLQUFWLEVBQWlCO0FBQzVCLFlBQUlDLFVBQVVOLEVBQUVLLE1BQU1FLE1BQVIsQ0FBZDs7QUFFQSxZQUFJRCxRQUFRRSxFQUFSLENBQVdQLGFBQVgsQ0FBSixFQUErQjtBQUMzQixnQkFBSVEsVUFBVUgsUUFBUUUsRUFBUixDQUFXLFVBQVgsQ0FBZDs7QUFFQUwsd0JBQVlPLElBQVosQ0FBaUIsVUFBVUMsS0FBVixFQUFpQkMsT0FBakIsRUFBMEI7QUFDdkMsb0JBQUlDLFlBQVliLEVBQUVZLE9BQUYsRUFBV0UsTUFBWCxFQUFoQjs7QUFFQWQsa0JBQUVZLE9BQUYsRUFBV0csSUFBWCxDQUFnQixTQUFoQixFQUEyQk4sT0FBM0I7O0FBRUEsb0JBQUlBLE9BQUosRUFBYTtBQUNUSSw4QkFBVUcsUUFBVixDQUFtQixTQUFuQjtBQUNILGlCQUZELE1BRU87QUFDSEgsOEJBQVVJLFdBQVYsQ0FBc0IsU0FBdEI7QUFDSDtBQUNKLGFBVkQ7QUFXSDtBQUNKLEtBbEJEOztBQW9CQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBbkIsV0FBT29CLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCcEIsY0FBTXFCLEVBQU4sQ0FBUyxPQUFULEVBQWtCaEIsUUFBbEI7QUFDQWU7QUFDSCxLQUhEOztBQUtBLFdBQU9yQixNQUFQO0FBQ0gsQ0FoRUwiLCJmaWxlIjoiYWNjb3VudGluZy9hY2NvdW50aW5nX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGFjY291bnRpbmdfY29udHJvbGxlci5qcyAyMDE1LTA5LTI0IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEFjY291bnRpbmcgQ29udHJvbGxlciBXaWRnZXRcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgd2lsbCBoYW5kbGUgdGhlIGNoZWNrYm94ZXMgaW4gdGhpcyBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvYWNjb3VudGluZ19jb250cm9sbGVyXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAvLyBNb2R1bGUgbmFtZVxuICAgICdhY2NvdW50aW5nX2NvbnRyb2xsZXInLFxuXG4gICAgLy8gTW9kdWxlIGRlcGVuZGVuY2llc1xuICAgIFtdLFxuXG4gICAgLyoqIEBsZW5kcyBtb2R1bGU6Q29udHJvbGxlcnMvYWNjb3VudGluZ19jb250cm9sbGVyICovXG5cbiAgICBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRUxFTUVOVFMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgJG1haW5DaGVja0JveCA9ICR0aGlzLmZpbmQoJyNjaGVja19hbGwnKTtcbiAgICAgICAgdmFyICRjaGVja2JveGVzID0gJHRoaXMuZmluZCgnaW5wdXRbbmFtZT1cImFjY2Vzc1tdXCJdJyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfb25DbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XG5cbiAgICAgICAgICAgIGlmICgkdGFyZ2V0LmlzKCRtYWluQ2hlY2tCb3gpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoZWNrZWQgPSAkdGFyZ2V0LmlzKCc6Y2hlY2tlZCcpO1xuXG4gICAgICAgICAgICAgICAgJGNoZWNrYm94ZXMuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRzd2l0Y2hlciA9ICQoZWxlbWVudCkucGFyZW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJChlbGVtZW50KS5hdHRyKCdjaGVja2VkJywgY2hlY2tlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzd2l0Y2hlci5hZGRDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN3aXRjaGVyLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSBtb2R1bGUsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgX29uQ2xpY2spO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
