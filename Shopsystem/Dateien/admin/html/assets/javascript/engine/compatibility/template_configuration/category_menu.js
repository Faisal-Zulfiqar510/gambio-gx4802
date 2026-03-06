'use strict';

/* --------------------------------------------------------------
 category_menu 2017-05-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.compatibility.module('category_menu', [], function (data) {

    'use strict';

    var $this = $(this),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    var $catMenuTopSwitcher = $('input:checkbox[name="CAT_MENU_TOP"]');
    var $catMenuLeftSwitcher = $('input:checkbox[name="CAT_MENU_LEFT"]');
    var $showSubcategoriesSwitcher = $('input:checkbox[name="SHOW_SUBCATEGORIES"]');
    var $useAccordionEffectSwitcher = $('input:checkbox[name="CATEGORY_ACCORDION_EFFECT"]');

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    function _onCatMenuTopSwitcherChange() {
        if ($catMenuTopSwitcher.prop('checked') === false) {
            $catMenuLeftSwitcher.parent().addClass('checked disabled');
            $showSubcategoriesSwitcher.parent().addClass('disabled').removeClass('checked');
            $useAccordionEffectSwitcher.parent().removeClass('disabled');

            $catMenuLeftSwitcher.prop('checked', true);
            $showSubcategoriesSwitcher.prop('checked', false);
        } else {
            $catMenuLeftSwitcher.parent().removeClass('disabled');
            $showSubcategoriesSwitcher.parent().removeClass('disabled');
            $useAccordionEffectSwitcher.parent().removeClass('disabled');
        }
    }

    function _onSubcategoriesSwitcherChange() {
        if ($showSubcategoriesSwitcher.prop('checked') === true) {
            $useAccordionEffectSwitcher.parent().addClass('disabled').removeClass('checked');

            $useAccordionEffectSwitcher.prop('checked', false);
        } else {
            $useAccordionEffectSwitcher.parent().removeClass('disabled');
        }
    }

    function _onAccordionSwitcherChange() {
        if ($useAccordionEffectSwitcher.prop('checked') === true || $catMenuTopSwitcher.prop('checked') === false) {
            $showSubcategoriesSwitcher.parent().addClass('disabled').removeClass('checked');

            $showSubcategoriesSwitcher.prop('checked', false);
        } else {
            $showSubcategoriesSwitcher.parent().removeClass('disabled');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------


    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        $this.on('checkbox:change', $catMenuTopSwitcher, _onCatMenuTopSwitcherChange);
        $this.on('checkbox:change', $showSubcategoriesSwitcher, _onSubcategoriesSwitcherChange);
        $this.on('checkbox:change', $useAccordionEffectSwitcher, _onAccordionSwitcherChange);

        $(document).on('JSENGINE_INIT_FINISHED', function () {
            _onCatMenuTopSwitcherChange();
            _onSubcategoriesSwitcherChange();
            _onAccordionSwitcherChange();
        });

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlbXBsYXRlX2NvbmZpZ3VyYXRpb24vY2F0ZWdvcnlfbWVudS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGNhdE1lbnVUb3BTd2l0Y2hlciIsIiRjYXRNZW51TGVmdFN3aXRjaGVyIiwiJHNob3dTdWJjYXRlZ29yaWVzU3dpdGNoZXIiLCIkdXNlQWNjb3JkaW9uRWZmZWN0U3dpdGNoZXIiLCJfb25DYXRNZW51VG9wU3dpdGNoZXJDaGFuZ2UiLCJwcm9wIiwicGFyZW50IiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIl9vblN1YmNhdGVnb3JpZXNTd2l0Y2hlckNoYW5nZSIsIl9vbkFjY29yZGlvblN3aXRjaGVyQ2hhbmdlIiwiaW5pdCIsImRvbmUiLCJvbiIsImRvY3VtZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQXdCLGVBQXhCLEVBQXlDLEVBQXpDLEVBQTZDLFVBQVVDLElBQVYsRUFBZ0I7O0FBRXpEOztBQUVBLFFBQUlDLFFBQVFDLEVBQUUsSUFBRixDQUFaOzs7QUFFSTs7Ozs7QUFLQUgsYUFBUyxFQVBiOztBQVNBLFFBQU1JLHNCQUFzQkQsRUFBRSxxQ0FBRixDQUE1QjtBQUNBLFFBQU1FLHVCQUF1QkYsRUFBRSxzQ0FBRixDQUE3QjtBQUNBLFFBQU1HLDZCQUE2QkgsRUFBRSwyQ0FBRixDQUFuQztBQUNBLFFBQU1JLDhCQUE4QkosRUFBRSxrREFBRixDQUFwQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsYUFBU0ssMkJBQVQsR0FBdUM7QUFDbkMsWUFBSUosb0JBQW9CSyxJQUFwQixDQUF5QixTQUF6QixNQUF3QyxLQUE1QyxFQUFtRDtBQUMvQ0osaUNBQXFCSyxNQUFyQixHQUE4QkMsUUFBOUIsQ0FBdUMsa0JBQXZDO0FBQ0FMLHVDQUEyQkksTUFBM0IsR0FBb0NDLFFBQXBDLENBQTZDLFVBQTdDLEVBQXlEQyxXQUF6RCxDQUFxRSxTQUFyRTtBQUNBTCx3Q0FBNEJHLE1BQTVCLEdBQXFDRSxXQUFyQyxDQUFpRCxVQUFqRDs7QUFFQVAsaUNBQXFCSSxJQUFyQixDQUEwQixTQUExQixFQUFxQyxJQUFyQztBQUNBSCx1Q0FBMkJHLElBQTNCLENBQWdDLFNBQWhDLEVBQTJDLEtBQTNDO0FBQ0gsU0FQRCxNQU9PO0FBQ0hKLGlDQUFxQkssTUFBckIsR0FBOEJFLFdBQTlCLENBQTBDLFVBQTFDO0FBQ0FOLHVDQUEyQkksTUFBM0IsR0FBb0NFLFdBQXBDLENBQWdELFVBQWhEO0FBQ0FMLHdDQUE0QkcsTUFBNUIsR0FBcUNFLFdBQXJDLENBQWlELFVBQWpEO0FBQ0g7QUFDSjs7QUFFRCxhQUFTQyw4QkFBVCxHQUEwQztBQUN0QyxZQUFJUCwyQkFBMkJHLElBQTNCLENBQWdDLFNBQWhDLE1BQStDLElBQW5ELEVBQXlEO0FBQ3JERix3Q0FBNEJHLE1BQTVCLEdBQXFDQyxRQUFyQyxDQUE4QyxVQUE5QyxFQUEwREMsV0FBMUQsQ0FBc0UsU0FBdEU7O0FBRUFMLHdDQUE0QkUsSUFBNUIsQ0FBaUMsU0FBakMsRUFBNEMsS0FBNUM7QUFDSCxTQUpELE1BSU87QUFDSEYsd0NBQTRCRyxNQUE1QixHQUFxQ0UsV0FBckMsQ0FBaUQsVUFBakQ7QUFDSDtBQUNKOztBQUVELGFBQVNFLDBCQUFULEdBQXNDO0FBQ2xDLFlBQUlQLDRCQUE0QkUsSUFBNUIsQ0FBaUMsU0FBakMsTUFBZ0QsSUFBaEQsSUFBd0RMLG9CQUFvQkssSUFBcEIsQ0FBeUIsU0FBekIsTUFBd0MsS0FBcEcsRUFBMkc7QUFDdkdILHVDQUEyQkksTUFBM0IsR0FBb0NDLFFBQXBDLENBQTZDLFVBQTdDLEVBQXlEQyxXQUF6RCxDQUFxRSxTQUFyRTs7QUFFQU4sdUNBQTJCRyxJQUEzQixDQUFnQyxTQUFoQyxFQUEyQyxLQUEzQztBQUNILFNBSkQsTUFJTztBQUNISCx1Q0FBMkJJLE1BQTNCLEdBQW9DRSxXQUFwQyxDQUFnRCxVQUFoRDtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBOzs7QUFHQTs7O0FBR0FaLFdBQU9lLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCZCxjQUFNZSxFQUFOLENBQVMsaUJBQVQsRUFBNEJiLG1CQUE1QixFQUFpREksMkJBQWpEO0FBQ0FOLGNBQU1lLEVBQU4sQ0FBUyxpQkFBVCxFQUE0QlgsMEJBQTVCLEVBQXdETyw4QkFBeEQ7QUFDQVgsY0FBTWUsRUFBTixDQUFTLGlCQUFULEVBQTRCViwyQkFBNUIsRUFBeURPLDBCQUF6RDs7QUFFQVgsVUFBRWUsUUFBRixFQUFZRCxFQUFaLENBQWUsd0JBQWYsRUFBeUMsWUFBWTtBQUNqRFQ7QUFDQUs7QUFDQUM7QUFDSCxTQUpEOztBQU9BRTtBQUNILEtBYkQ7O0FBZUE7QUFDQSxXQUFPaEIsTUFBUDtBQUNILENBbEZEIiwiZmlsZSI6InRlbXBsYXRlX2NvbmZpZ3VyYXRpb24vY2F0ZWdvcnlfbWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY2F0ZWdvcnlfbWVudSAyMDE3LTA1LTEwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoJ2NhdGVnb3J5X21lbnUnLCBbXSwgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgY29uc3QgJGNhdE1lbnVUb3BTd2l0Y2hlciA9ICQoJ2lucHV0OmNoZWNrYm94W25hbWU9XCJDQVRfTUVOVV9UT1BcIl0nKTtcbiAgICBjb25zdCAkY2F0TWVudUxlZnRTd2l0Y2hlciA9ICQoJ2lucHV0OmNoZWNrYm94W25hbWU9XCJDQVRfTUVOVV9MRUZUXCJdJyk7XG4gICAgY29uc3QgJHNob3dTdWJjYXRlZ29yaWVzU3dpdGNoZXIgPSAkKCdpbnB1dDpjaGVja2JveFtuYW1lPVwiU0hPV19TVUJDQVRFR09SSUVTXCJdJyk7XG4gICAgY29uc3QgJHVzZUFjY29yZGlvbkVmZmVjdFN3aXRjaGVyID0gJCgnaW5wdXQ6Y2hlY2tib3hbbmFtZT1cIkNBVEVHT1JZX0FDQ09SRElPTl9FRkZFQ1RcIl0nKTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBmdW5jdGlvbiBfb25DYXRNZW51VG9wU3dpdGNoZXJDaGFuZ2UoKSB7XG4gICAgICAgIGlmICgkY2F0TWVudVRvcFN3aXRjaGVyLnByb3AoJ2NoZWNrZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICRjYXRNZW51TGVmdFN3aXRjaGVyLnBhcmVudCgpLmFkZENsYXNzKCdjaGVja2VkIGRpc2FibGVkJyk7XG4gICAgICAgICAgICAkc2hvd1N1YmNhdGVnb3JpZXNTd2l0Y2hlci5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgJHVzZUFjY29yZGlvbkVmZmVjdFN3aXRjaGVyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAkY2F0TWVudUxlZnRTd2l0Y2hlci5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAkc2hvd1N1YmNhdGVnb3JpZXNTd2l0Y2hlci5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGNhdE1lbnVMZWZ0U3dpdGNoZXIucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAkc2hvd1N1YmNhdGVnb3JpZXNTd2l0Y2hlci5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICR1c2VBY2NvcmRpb25FZmZlY3RTd2l0Y2hlci5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9vblN1YmNhdGVnb3JpZXNTd2l0Y2hlckNoYW5nZSgpIHtcbiAgICAgICAgaWYgKCRzaG93U3ViY2F0ZWdvcmllc1N3aXRjaGVyLnByb3AoJ2NoZWNrZWQnKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgJHVzZUFjY29yZGlvbkVmZmVjdFN3aXRjaGVyLnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG5cbiAgICAgICAgICAgICR1c2VBY2NvcmRpb25FZmZlY3RTd2l0Y2hlci5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHVzZUFjY29yZGlvbkVmZmVjdFN3aXRjaGVyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX29uQWNjb3JkaW9uU3dpdGNoZXJDaGFuZ2UoKSB7XG4gICAgICAgIGlmICgkdXNlQWNjb3JkaW9uRWZmZWN0U3dpdGNoZXIucHJvcCgnY2hlY2tlZCcpID09PSB0cnVlIHx8ICRjYXRNZW51VG9wU3dpdGNoZXIucHJvcCgnY2hlY2tlZCcpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgJHNob3dTdWJjYXRlZ29yaWVzU3dpdGNoZXIucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJykucmVtb3ZlQ2xhc3MoJ2NoZWNrZWQnKTtcblxuICAgICAgICAgICAgJHNob3dTdWJjYXRlZ29yaWVzU3dpdGNoZXIucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzaG93U3ViY2F0ZWdvcmllc1N3aXRjaGVyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICovXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpcy5vbignY2hlY2tib3g6Y2hhbmdlJywgJGNhdE1lbnVUb3BTd2l0Y2hlciwgX29uQ2F0TWVudVRvcFN3aXRjaGVyQ2hhbmdlKTtcbiAgICAgICAgJHRoaXMub24oJ2NoZWNrYm94OmNoYW5nZScsICRzaG93U3ViY2F0ZWdvcmllc1N3aXRjaGVyLCBfb25TdWJjYXRlZ29yaWVzU3dpdGNoZXJDaGFuZ2UpO1xuICAgICAgICAkdGhpcy5vbignY2hlY2tib3g6Y2hhbmdlJywgJHVzZUFjY29yZGlvbkVmZmVjdFN3aXRjaGVyLCBfb25BY2NvcmRpb25Td2l0Y2hlckNoYW5nZSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfb25DYXRNZW51VG9wU3dpdGNoZXJDaGFuZ2UoKTtcbiAgICAgICAgICAgIF9vblN1YmNhdGVnb3JpZXNTd2l0Y2hlckNoYW5nZSgpO1xuICAgICAgICAgICAgX29uQWNjb3JkaW9uU3dpdGNoZXJDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIC8vIFJldHVybiBkYXRhIHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn0pOyJdfQ==
