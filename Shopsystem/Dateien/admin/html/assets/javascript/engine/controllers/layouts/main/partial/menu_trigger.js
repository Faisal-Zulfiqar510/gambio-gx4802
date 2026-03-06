'use strict';

/* --------------------------------------------------------------
 menu_trigger.js 2016-04-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Menu Trigger Controller
 *
 * This controller will handle the main menu trigger. Provide the "data-menu_trigger-menu-selector" attribute
 * that must select the main menu. It also works with the "user_configuration_service" so the user ID is required.
 * Provide it with the "data-menu_trigger-customer-id" attribute.
 *
 * There are three states for the main menu: "collapse", "expand" and "expand-all".
 */
gx.controllers.module('menu_trigger', ['user_configuration_service'], function (data) {

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
     * Main Menu Selector
     *
     * @type {jQuery}
     */
    var $menu = $(data.menuSelector);

    /**
     * Menu Items List Selector
     *
     * @type {jQuery}
     */
    var $list = $menu.find('nav > ul');

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Set the menu state.
     *
     * This function will update the UI and save the state in the users_configuration db table.
     *
     * @param {String} state Accepts the "collapse", "expand" and "expandAll".
     * @param {Boolean} save Optional (false), whether to save the change with the user configuration service.
     */
    function _setMenuState(state) {
        var save = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var stateClass = '';

        switch (state) {
            case 'collapse':
            case 'expand':
            case 'expand-all':
                stateClass = state;
                break;

            case 'expandAll':
                stateClass = 'expand-all';
                break;

            default:
                stateClass = 'expand';
        }

        var $radio = $this.find('input:radio#menu-' + stateClass);

        // Set the class to the <ul> element of the main menu.
        $list.attr('class', stateClass);

        // Make sure the correct radio is selected.
        $radio.prop('checked', true);

        // Display the next-state icons.
        $radio.prev('label').hide();
        if ($radio.next('label').length > 0) {
            $radio.next('label').show();
        } else {
            $this.find('label:first').show();
        }

        // Save the configuration setting.
        if (save) {
            var saveState = state === 'expandAll' ? 'expand-all' : state;
            jse.libs.user_configuration_service.set({
                data: {
                    userId: data.customerId,
                    configurationKey: 'menuVisibility',
                    configurationValue: saveState
                },
                onSuccess: function onSuccess(response) {
                    // Trigger a window resize in order to update the position of other UI elements.
                    $(window).trigger('resize');
                }
            });
        }
    }

    /**
     * Handles the radio buttons change.
     *
     * This is triggered by the click on the menu trigger button.
     */
    function _onInputRadioChange() {
        _setMenuState($(this).val(), true);
    }

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _setMenuState(data.menuVisibility);

        $this.on('change', 'input:radio', _onInputRadioChange);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9wYXJ0aWFsL21lbnVfdHJpZ2dlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRtZW51IiwibWVudVNlbGVjdG9yIiwiJGxpc3QiLCJmaW5kIiwiX3NldE1lbnVTdGF0ZSIsInN0YXRlIiwic2F2ZSIsInN0YXRlQ2xhc3MiLCIkcmFkaW8iLCJhdHRyIiwicHJvcCIsInByZXYiLCJoaWRlIiwibmV4dCIsImxlbmd0aCIsInNob3ciLCJzYXZlU3RhdGUiLCJqc2UiLCJsaWJzIiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCJzZXQiLCJ1c2VySWQiLCJjdXN0b21lcklkIiwiY29uZmlndXJhdGlvbktleSIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsIm9uU3VjY2VzcyIsInJlc3BvbnNlIiwid2luZG93IiwidHJpZ2dlciIsIl9vbklucHV0UmFkaW9DaGFuZ2UiLCJ2YWwiLCJpbml0IiwiZG9uZSIsIm1lbnVWaXNpYmlsaXR5Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7O0FBU0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixjQUF0QixFQUFzQyxDQUFDLDRCQUFELENBQXRDLEVBQXNFLFVBQVVDLElBQVYsRUFBZ0I7O0FBRWxGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsUUFBUUQsRUFBRUYsS0FBS0ksWUFBUCxDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFFBQVFGLE1BQU1HLElBQU4sQ0FBVyxVQUFYLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTVAsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFRQSxhQUFTUSxhQUFULENBQXVCQyxLQUF2QixFQUE0QztBQUFBLFlBQWRDLElBQWMsdUVBQVAsS0FBTzs7QUFDeEMsWUFBSUMsYUFBYSxFQUFqQjs7QUFFQSxnQkFBUUYsS0FBUjtBQUNJLGlCQUFLLFVBQUw7QUFDQSxpQkFBSyxRQUFMO0FBQ0EsaUJBQUssWUFBTDtBQUNJRSw2QkFBYUYsS0FBYjtBQUNBOztBQUVKLGlCQUFLLFdBQUw7QUFDSUUsNkJBQWEsWUFBYjtBQUNBOztBQUVKO0FBQ0lBLDZCQUFhLFFBQWI7QUFaUjs7QUFlQSxZQUFNQyxTQUFTVixNQUFNSyxJQUFOLENBQVcsc0JBQXNCSSxVQUFqQyxDQUFmOztBQUVBO0FBQ0FMLGNBQU1PLElBQU4sQ0FBVyxPQUFYLEVBQW9CRixVQUFwQjs7QUFFQTtBQUNBQyxlQUFPRSxJQUFQLENBQVksU0FBWixFQUF1QixJQUF2Qjs7QUFFQTtBQUNBRixlQUFPRyxJQUFQLENBQVksT0FBWixFQUFxQkMsSUFBckI7QUFDQSxZQUFJSixPQUFPSyxJQUFQLENBQVksT0FBWixFQUFxQkMsTUFBckIsR0FBOEIsQ0FBbEMsRUFBcUM7QUFDakNOLG1CQUFPSyxJQUFQLENBQVksT0FBWixFQUFxQkUsSUFBckI7QUFDSCxTQUZELE1BRU87QUFDSGpCLGtCQUFNSyxJQUFOLENBQVcsYUFBWCxFQUEwQlksSUFBMUI7QUFDSDs7QUFFRDtBQUNBLFlBQUlULElBQUosRUFBVTtBQUNOLGdCQUFNVSxZQUFZWCxVQUFVLFdBQVYsR0FBd0IsWUFBeEIsR0FBdUNBLEtBQXpEO0FBQ0FZLGdCQUFJQyxJQUFKLENBQVNDLDBCQUFULENBQW9DQyxHQUFwQyxDQUF3QztBQUNwQ3ZCLHNCQUFNO0FBQ0Z3Qiw0QkFBUXhCLEtBQUt5QixVQURYO0FBRUZDLHNDQUFrQixnQkFGaEI7QUFHRkMsd0NBQW9CUjtBQUhsQixpQkFEOEI7QUFNcENTLDJCQUFXLG1CQUFVQyxRQUFWLEVBQW9CO0FBQzNCO0FBQ0EzQixzQkFBRTRCLE1BQUYsRUFBVUMsT0FBVixDQUFrQixRQUFsQjtBQUNIO0FBVG1DLGFBQXhDO0FBV0g7QUFDSjs7QUFFRDs7Ozs7QUFLQSxhQUFTQyxtQkFBVCxHQUErQjtBQUMzQnpCLHNCQUFjTCxFQUFFLElBQUYsRUFBUStCLEdBQVIsRUFBZCxFQUE2QixJQUE3QjtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQWxDLFdBQU9tQyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjVCLHNCQUFjUCxLQUFLb0MsY0FBbkI7O0FBRUFuQyxjQUFNb0MsRUFBTixDQUFTLFFBQVQsRUFBbUIsYUFBbkIsRUFBa0NMLG1CQUFsQzs7QUFFQUc7QUFDSCxLQU5EOztBQVFBLFdBQU9wQyxNQUFQO0FBRUgsQ0ExSEQiLCJmaWxlIjoibGF5b3V0cy9tYWluL3BhcnRpYWwvbWVudV90cmlnZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBtZW51X3RyaWdnZXIuanMgMjAxNi0wNC0yMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogTWVudSBUcmlnZ2VyIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgd2lsbCBoYW5kbGUgdGhlIG1haW4gbWVudSB0cmlnZ2VyLiBQcm92aWRlIHRoZSBcImRhdGEtbWVudV90cmlnZ2VyLW1lbnUtc2VsZWN0b3JcIiBhdHRyaWJ1dGVcbiAqIHRoYXQgbXVzdCBzZWxlY3QgdGhlIG1haW4gbWVudS4gSXQgYWxzbyB3b3JrcyB3aXRoIHRoZSBcInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlXCIgc28gdGhlIHVzZXIgSUQgaXMgcmVxdWlyZWQuXG4gKiBQcm92aWRlIGl0IHdpdGggdGhlIFwiZGF0YS1tZW51X3RyaWdnZXItY3VzdG9tZXItaWRcIiBhdHRyaWJ1dGUuXG4gKlxuICogVGhlcmUgYXJlIHRocmVlIHN0YXRlcyBmb3IgdGhlIG1haW4gbWVudTogXCJjb2xsYXBzZVwiLCBcImV4cGFuZFwiIGFuZCBcImV4cGFuZC1hbGxcIi5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdtZW51X3RyaWdnZXInLCBbJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJ10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNYWluIE1lbnUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJG1lbnUgPSAkKGRhdGEubWVudVNlbGVjdG9yKTtcblxuICAgIC8qKlxuICAgICAqIE1lbnUgSXRlbXMgTGlzdCBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkbGlzdCA9ICRtZW51LmZpbmQoJ25hdiA+IHVsJyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgbWVudSBzdGF0ZS5cbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCB1cGRhdGUgdGhlIFVJIGFuZCBzYXZlIHRoZSBzdGF0ZSBpbiB0aGUgdXNlcnNfY29uZmlndXJhdGlvbiBkYiB0YWJsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdGF0ZSBBY2NlcHRzIHRoZSBcImNvbGxhcHNlXCIsIFwiZXhwYW5kXCIgYW5kIFwiZXhwYW5kQWxsXCIuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBzYXZlIE9wdGlvbmFsIChmYWxzZSksIHdoZXRoZXIgdG8gc2F2ZSB0aGUgY2hhbmdlIHdpdGggdGhlIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9zZXRNZW51U3RhdGUoc3RhdGUsIHNhdmUgPSBmYWxzZSkge1xuICAgICAgICBsZXQgc3RhdGVDbGFzcyA9ICcnO1xuXG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvbGxhcHNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2V4cGFuZCc6XG4gICAgICAgICAgICBjYXNlICdleHBhbmQtYWxsJzpcbiAgICAgICAgICAgICAgICBzdGF0ZUNsYXNzID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2V4cGFuZEFsbCc6XG4gICAgICAgICAgICAgICAgc3RhdGVDbGFzcyA9ICdleHBhbmQtYWxsJztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBzdGF0ZUNsYXNzID0gJ2V4cGFuZCc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkcmFkaW8gPSAkdGhpcy5maW5kKCdpbnB1dDpyYWRpbyNtZW51LScgKyBzdGF0ZUNsYXNzKTtcblxuICAgICAgICAvLyBTZXQgdGhlIGNsYXNzIHRvIHRoZSA8dWw+IGVsZW1lbnQgb2YgdGhlIG1haW4gbWVudS5cbiAgICAgICAgJGxpc3QuYXR0cignY2xhc3MnLCBzdGF0ZUNsYXNzKTtcblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGNvcnJlY3QgcmFkaW8gaXMgc2VsZWN0ZWQuXG4gICAgICAgICRyYWRpby5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgLy8gRGlzcGxheSB0aGUgbmV4dC1zdGF0ZSBpY29ucy5cbiAgICAgICAgJHJhZGlvLnByZXYoJ2xhYmVsJykuaGlkZSgpO1xuICAgICAgICBpZiAoJHJhZGlvLm5leHQoJ2xhYmVsJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJHJhZGlvLm5leHQoJ2xhYmVsJykuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnbGFiZWw6Zmlyc3QnKS5zaG93KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTYXZlIHRoZSBjb25maWd1cmF0aW9uIHNldHRpbmcuXG4gICAgICAgIGlmIChzYXZlKSB7XG4gICAgICAgICAgICBjb25zdCBzYXZlU3RhdGUgPSBzdGF0ZSA9PT0gJ2V4cGFuZEFsbCcgPyAnZXhwYW5kLWFsbCcgOiBzdGF0ZTtcbiAgICAgICAgICAgIGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlLnNldCh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQ6IGRhdGEuY3VzdG9tZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogJ21lbnVWaXNpYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBzYXZlU3RhdGVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgYSB3aW5kb3cgcmVzaXplIGluIG9yZGVyIHRvIHVwZGF0ZSB0aGUgcG9zaXRpb24gb2Ygb3RoZXIgVUkgZWxlbWVudHMuXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgdGhlIHJhZGlvIGJ1dHRvbnMgY2hhbmdlLlxuICAgICAqXG4gICAgICogVGhpcyBpcyB0cmlnZ2VyZWQgYnkgdGhlIGNsaWNrIG9uIHRoZSBtZW51IHRyaWdnZXIgYnV0dG9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbklucHV0UmFkaW9DaGFuZ2UoKSB7XG4gICAgICAgIF9zZXRNZW51U3RhdGUoJCh0aGlzKS52YWwoKSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gSU5JVElBTElaRVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICBfc2V0TWVudVN0YXRlKGRhdGEubWVudVZpc2liaWxpdHkpO1xuXG4gICAgICAgICR0aGlzLm9uKCdjaGFuZ2UnLCAnaW5wdXQ6cmFkaW8nLCBfb25JbnB1dFJhZGlvQ2hhbmdlKTtcblxuICAgICAgICBkb25lKCk7XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG5cbn0pOyJdfQ==
