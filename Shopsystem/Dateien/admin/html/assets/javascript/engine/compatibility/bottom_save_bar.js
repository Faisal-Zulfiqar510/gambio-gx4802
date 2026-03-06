'use strict';

/* --------------------------------------------------------------
 bottom_save_bar.js 2017-09-06
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Bottom Save Bar Module
 *
 * This module will move all content, that is contained in any element that has the class "bottom-save-bar-content" to
 * the Bottom Save Bar.
 *
 * @module Compatibility/bottom_save_bar
 */
gx.compatibility.module(
// Module name
'bottom_save_bar',

// Module dependencies
[],

/**  @lends module:Compatibility/bottom_save_bar */

function () {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var module = {},
        $target = $('.bottom-save-bar');

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    var _initialize = function _initialize() {
        $('.bottom-save-bar-content > *:not([type="hidden"]):not(.btn-primary)').each(function (index, element) {
            var $element = $(element).css('float', 'none');
            _handleContentType($element);
        });

        $('.bottom-save-bar-content > *.btn-primary:not([type="hidden"])').each(function (index, element) {
            var $element = $(element).css('float', 'none');
            _handleContentType($element);
        });
    };

    var _handleContentType = function _handleContentType($element) {
        if ($element.is('input:not([type="button"])') || $element.is('button[type="submit"]')) {
            _handleFormElement($element);
        } else {
            _handleOtherContent($element);
        }
    };

    var _handleFormElement = function _handleFormElement($element) {
        var $clone = $element.clone();
        $element.hide();

        if ($element.is('[type="submit"]')) {
            $clone.attr('type', 'button');
        }

        $clone.on('click', function () {
            $element.trigger('click');
        });

        $target.append($clone);
    };

    var _handleOtherContent = function _handleOtherContent($element) {
        $target.append($element);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _initialize();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJvdHRvbV9zYXZlX2Jhci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCIkdGFyZ2V0IiwiJCIsIl9pbml0aWFsaXplIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsIiRlbGVtZW50IiwiY3NzIiwiX2hhbmRsZUNvbnRlbnRUeXBlIiwiaXMiLCJfaGFuZGxlRm9ybUVsZW1lbnQiLCJfaGFuZGxlT3RoZXJDb250ZW50IiwiJGNsb25lIiwiY2xvbmUiLCJoaWRlIiwiYXR0ciIsIm9uIiwidHJpZ2dlciIsImFwcGVuZCIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7O0FBUUFBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCO0FBQ0k7QUFDQSxpQkFGSjs7QUFJSTtBQUNBLEVBTEo7O0FBT0k7O0FBRUEsWUFBWTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBTUEsU0FBUyxFQUFmO0FBQUEsUUFDSUMsVUFBVUMsRUFBRSxrQkFBRixDQURkOztBQUdBO0FBQ0E7QUFDQTs7QUFFQSxRQUFNQyxjQUFjLFNBQWRBLFdBQWMsR0FBWTtBQUM1QkQsVUFBRSxxRUFBRixFQUF5RUUsSUFBekUsQ0FBOEUsVUFBVUMsS0FBVixFQUFpQkMsT0FBakIsRUFBMEI7QUFDcEcsZ0JBQU1DLFdBQVdMLEVBQUVJLE9BQUYsRUFBV0UsR0FBWCxDQUFlLE9BQWYsRUFBd0IsTUFBeEIsQ0FBakI7QUFDQUMsK0JBQW1CRixRQUFuQjtBQUNILFNBSEQ7O0FBS0FMLFVBQUUsK0RBQUYsRUFBbUVFLElBQW5FLENBQXdFLFVBQVVDLEtBQVYsRUFBaUJDLE9BQWpCLEVBQTBCO0FBQzlGLGdCQUFNQyxXQUFXTCxFQUFFSSxPQUFGLEVBQVdFLEdBQVgsQ0FBZSxPQUFmLEVBQXdCLE1BQXhCLENBQWpCO0FBQ0FDLCtCQUFtQkYsUUFBbkI7QUFDSCxTQUhEO0FBSUgsS0FWRDs7QUFZQSxRQUFNRSxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFVRixRQUFWLEVBQW9CO0FBQzNDLFlBQUlBLFNBQVNHLEVBQVQsQ0FBWSw0QkFBWixLQUE2Q0gsU0FBU0csRUFBVCxDQUFZLHVCQUFaLENBQWpELEVBQXVGO0FBQ25GQywrQkFBbUJKLFFBQW5CO0FBQ0gsU0FGRCxNQUVPO0FBQ0hLLGdDQUFvQkwsUUFBcEI7QUFDSDtBQUNKLEtBTkQ7O0FBUUEsUUFBTUkscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBVUosUUFBVixFQUFvQjtBQUMzQyxZQUFJTSxTQUFTTixTQUFTTyxLQUFULEVBQWI7QUFDQVAsaUJBQVNRLElBQVQ7O0FBRUEsWUFBSVIsU0FBU0csRUFBVCxDQUFZLGlCQUFaLENBQUosRUFBb0M7QUFDaENHLG1CQUFPRyxJQUFQLENBQVksTUFBWixFQUFvQixRQUFwQjtBQUNIOztBQUVESCxlQUFPSSxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFZO0FBQzNCVixxQkFBU1csT0FBVCxDQUFpQixPQUFqQjtBQUNILFNBRkQ7O0FBSUFqQixnQkFBUWtCLE1BQVIsQ0FBZU4sTUFBZjtBQUNILEtBYkQ7O0FBZUEsUUFBTUQsc0JBQXNCLFNBQXRCQSxtQkFBc0IsQ0FBVUwsUUFBVixFQUFvQjtBQUM1Q04sZ0JBQVFrQixNQUFSLENBQWVaLFFBQWY7QUFDSCxLQUZEOztBQUlBO0FBQ0E7QUFDQTs7QUFFQVAsV0FBT29CLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCbEI7QUFDQWtCO0FBQ0gsS0FIRDs7QUFLQSxXQUFPckIsTUFBUDtBQUNILENBekVMIiwiZmlsZSI6ImJvdHRvbV9zYXZlX2Jhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYm90dG9tX3NhdmVfYmFyLmpzIDIwMTctMDktMDZcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEJvdHRvbSBTYXZlIEJhciBNb2R1bGVcbiAqXG4gKiBUaGlzIG1vZHVsZSB3aWxsIG1vdmUgYWxsIGNvbnRlbnQsIHRoYXQgaXMgY29udGFpbmVkIGluIGFueSBlbGVtZW50IHRoYXQgaGFzIHRoZSBjbGFzcyBcImJvdHRvbS1zYXZlLWJhci1jb250ZW50XCIgdG9cbiAqIHRoZSBCb3R0b20gU2F2ZSBCYXIuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L2JvdHRvbV9zYXZlX2JhclxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAvLyBNb2R1bGUgbmFtZVxuICAgICdib3R0b21fc2F2ZV9iYXInLFxuXG4gICAgLy8gTW9kdWxlIGRlcGVuZGVuY2llc1xuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvYm90dG9tX3NhdmVfYmFyICovXG5cbiAgICBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fSxcbiAgICAgICAgICAgICR0YXJnZXQgPSAkKCcuYm90dG9tLXNhdmUtYmFyJyk7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgY29uc3QgX2luaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcuYm90dG9tLXNhdmUtYmFyLWNvbnRlbnQgPiAqOm5vdChbdHlwZT1cImhpZGRlblwiXSk6bm90KC5idG4tcHJpbWFyeSknKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChlbGVtZW50KS5jc3MoJ2Zsb2F0JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICBfaGFuZGxlQ29udGVudFR5cGUoJGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJy5ib3R0b20tc2F2ZS1iYXItY29udGVudCA+ICouYnRuLXByaW1hcnk6bm90KFt0eXBlPVwiaGlkZGVuXCJdKScpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLmNzcygnZmxvYXQnLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIF9oYW5kbGVDb250ZW50VHlwZSgkZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfaGFuZGxlQ29udGVudFR5cGUgPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICgkZWxlbWVudC5pcygnaW5wdXQ6bm90KFt0eXBlPVwiYnV0dG9uXCJdKScpIHx8ICRlbGVtZW50LmlzKCdidXR0b25bdHlwZT1cInN1Ym1pdFwiXScpKSB7XG4gICAgICAgICAgICAgICAgX2hhbmRsZUZvcm1FbGVtZW50KCRlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2hhbmRsZU90aGVyQ29udGVudCgkZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX2hhbmRsZUZvcm1FbGVtZW50ID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgJGNsb25lID0gJGVsZW1lbnQuY2xvbmUoKTtcbiAgICAgICAgICAgICRlbGVtZW50LmhpZGUoKTtcblxuICAgICAgICAgICAgaWYgKCRlbGVtZW50LmlzKCdbdHlwZT1cInN1Ym1pdFwiXScpKSB7XG4gICAgICAgICAgICAgICAgJGNsb25lLmF0dHIoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjbG9uZS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGFyZ2V0LmFwcGVuZCgkY2xvbmUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF9oYW5kbGVPdGhlckNvbnRlbnQgPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAgICAgICAgICR0YXJnZXQuYXBwZW5kKCRlbGVtZW50KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgX2luaXRpYWxpemUoKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
