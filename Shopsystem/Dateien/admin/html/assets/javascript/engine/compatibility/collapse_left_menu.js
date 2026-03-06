'use strict';

/* --------------------------------------------------------------
 collapse_left_menu.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Collapse Main Left Menu
 *
 * This module will handle the collapse and expansion of the main left menu of the admin section. The HTML
 * for the collapse button comes from the "html/compatibility/collapse_left_menu.php".
 *
 * @module Compatibility/collapse_left_menu
 */
gx.compatibility.module('collapse_left_menu', ['user_configuration_service'],

/**  @lends module:Compatibility/collapse_left_menu */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // ELEMENTS DEFINITION
    // ------------------------------------------------------------------------

    var $this = $(this),
        $menu = $('.main-left-menu'),
        $currentMenuBox = $menu.find('.leftmenu_box.current'),
        $menuToggleButton = $this.find('.menu-toggle-button'),
        $menuButtonIndicator = $menuToggleButton.find('#menu-button-indicator'),
        menuInitState = $menu.data('initState');

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var module = {},
        initialCssWidth = $menu.css('width'),
        userConfigurationService = jse.libs.user_configuration_service,
        userConfig = {
        userId: data.userId,
        configurationKey: 'menuVisibility'
    },
        stateMap = {
        collapse: {
            next: 'expand',
            button: 'right',
            class: 'collapsed',
            do: function _do(isAnimated) {
                _collapse(isAnimated);
            }
        },
        expand: {
            next: 'expand-all',
            button: 'down',
            class: 'expanded',
            do: function _do(isAnimated) {
                _expand(isAnimated);
            }
        },
        'expand-all': {
            next: 'collapse',
            button: 'left',
            class: 'expand-all',
            do: function _do(isAnimated) {
                _expandAll(isAnimated);
            }
        }
    },
        currentState;

    // ------------------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------------------

    var isMenuVisible = function isMenuVisible() {
        return !$menu.hasClass('collapsed');
    };

    // ------------------------------------------------------------------------
    // STATE CHANGE TRIGGERS
    // ------------------------------------------------------------------------

    var _changeState = function _changeState(state, isAnimated) {
        var saveConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        currentState = state;
        stateMap[currentState].do(isAnimated);

        if (saveConfig) {
            _saveConfig();
        }

        _changeButton();
    };

    var _changeButton = function _changeButton() {
        var className = 'fa fa-caret-';
        var arrowDirection = stateMap[currentState].button;
        $menuButtonIndicator.removeAttr('class').addClass(className + arrowDirection);
    };

    // ------------------------------------------------------------------------
    // COLLAPSE / EXPAND MENU
    // ------------------------------------------------------------------------

    /**
     * Collapse Left Menu
     * @param {boolean} isAnimated - Animate the hiding?
     * @private
     */
    var _collapse = function _collapse(isAnimated) {

        var currentBox = $this.parent().find('ul.current');

        // Collapse menu
        if (isAnimated) {
            $menu.animate({
                'width': '45px'
            }, 300, 'swing');
        } else {
            $menu.css('width', '45px');
            $('.columnLeft2').css('width', '45px');
        }
        currentBox.hide();

        $(document).trigger('leftmenu:collapse');

        // Fade out heading text
        $menu.find('.leftmenu_head span').fadeOut('fast');

        // Class changes
        $menu.removeClass('expanded-all').addClass('collapsed');

        $menu.find('.current:not(li)').removeClass('current');

        $menu.find('.current-menu-head').addClass('current');

        var interval = setInterval(function () {
            if (currentState === 'collapse') {
                if ($('.leftmenu_head.current').length > 1) {
                    $menu.find('.leftmenu_head.current:not(.current-menu-head)').removeClass('current');
                    clearInterval(interval);
                }
            } else {
                clearInterval(interval);
            }
        }, 1);
    };

    /**
     * Expand Left Menu
     * @private
     */
    var _expand = function _expand() {

        var currentBox = $this.parent().find('ul.current');

        // Expand menu
        $menu.animate({
            'width': initialCssWidth
        }, 300, 'swing');
        currentBox.show();

        // Fade in heading text
        $menu.find('.leftmenu_head span').fadeIn('slow');

        $(document).trigger('leftmenu:expand');

        // Class changes
        $menu.removeClass('collapsed');
        $currentMenuBox.addClass('current');
    };

    /**
     * Expand all menu items
     * @private
     */
    var _expandAll = function _expandAll(isAnimated) {

        $menu.addClass('expanded-all');

        var $headingBoxes = $menu.find('div.leftmenu_head:not(.current)');

        if (isAnimated) {
            $headingBoxes.addClass('current', 750, 'swing');
        } else {
            $headingBoxes.addClass('current');
        }

        $(document).trigger('leftmenu:expand');

        $menu.find('ul.leftmenu_box:not(.current)').addClass('current');
    };

    // ------------------------------------------------------------------------
    // USER CONFIGURATION HANDLER
    // ------------------------------------------------------------------------

    var _saveConfig = function _saveConfig() {
        userConfigurationService.set({
            data: $.extend(userConfig, {
                configurationValue: currentState
            })
        });
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _onClick = function _onClick(event) {
        if ($menuToggleButton.has(event.target).length) {
            _changeState(stateMap[currentState].next, true);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        $('div.leftmenu_head.current').addClass('current-menu-head');

        if (!isMenuVisible()) {
            $currentMenuBox.removeClass('current');
        }

        currentState = menuInitState;

        if (currentState === '') {
            currentState = 'expand'; // Default value if there is no menuInitState set yet.
        }

        _changeState(currentState, false, false);

        $this.on('click', _onClick);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbGxhcHNlX2xlZnRfbWVudS5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJG1lbnUiLCIkY3VycmVudE1lbnVCb3giLCJmaW5kIiwiJG1lbnVUb2dnbGVCdXR0b24iLCIkbWVudUJ1dHRvbkluZGljYXRvciIsIm1lbnVJbml0U3RhdGUiLCJpbml0aWFsQ3NzV2lkdGgiLCJjc3MiLCJ1c2VyQ29uZmlndXJhdGlvblNlcnZpY2UiLCJqc2UiLCJsaWJzIiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCJ1c2VyQ29uZmlnIiwidXNlcklkIiwiY29uZmlndXJhdGlvbktleSIsInN0YXRlTWFwIiwiY29sbGFwc2UiLCJuZXh0IiwiYnV0dG9uIiwiY2xhc3MiLCJkbyIsImlzQW5pbWF0ZWQiLCJfY29sbGFwc2UiLCJleHBhbmQiLCJfZXhwYW5kIiwiX2V4cGFuZEFsbCIsImN1cnJlbnRTdGF0ZSIsImlzTWVudVZpc2libGUiLCJoYXNDbGFzcyIsIl9jaGFuZ2VTdGF0ZSIsInN0YXRlIiwic2F2ZUNvbmZpZyIsIl9zYXZlQ29uZmlnIiwiX2NoYW5nZUJ1dHRvbiIsImNsYXNzTmFtZSIsImFycm93RGlyZWN0aW9uIiwicmVtb3ZlQXR0ciIsImFkZENsYXNzIiwiY3VycmVudEJveCIsInBhcmVudCIsImFuaW1hdGUiLCJoaWRlIiwiZG9jdW1lbnQiLCJ0cmlnZ2VyIiwiZmFkZU91dCIsInJlbW92ZUNsYXNzIiwiaW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImxlbmd0aCIsImNsZWFySW50ZXJ2YWwiLCJzaG93IiwiZmFkZUluIiwiJGhlYWRpbmdCb3hlcyIsInNldCIsImV4dGVuZCIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsIl9vbkNsaWNrIiwiZXZlbnQiLCJoYXMiLCJ0YXJnZXQiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7O0FBUUFBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksb0JBREosRUFHSSxDQUFDLDRCQUFELENBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUMsUUFBUUMsRUFBRSxJQUFGLENBQVo7QUFBQSxRQUNJQyxRQUFRRCxFQUFFLGlCQUFGLENBRFo7QUFBQSxRQUVJRSxrQkFBa0JELE1BQU1FLElBQU4sQ0FBVyx1QkFBWCxDQUZ0QjtBQUFBLFFBR0lDLG9CQUFvQkwsTUFBTUksSUFBTixDQUFXLHFCQUFYLENBSHhCO0FBQUEsUUFJSUUsdUJBQXVCRCxrQkFBa0JELElBQWxCLENBQXVCLHdCQUF2QixDQUozQjtBQUFBLFFBS0lHLGdCQUFnQkwsTUFBTUgsSUFBTixDQUFXLFdBQVgsQ0FMcEI7O0FBT0E7QUFDQTtBQUNBOztBQUVBLFFBQUlELFNBQVMsRUFBYjtBQUFBLFFBRUlVLGtCQUFrQk4sTUFBTU8sR0FBTixDQUFVLE9BQVYsQ0FGdEI7QUFBQSxRQUlJQywyQkFBMkJDLElBQUlDLElBQUosQ0FBU0MsMEJBSnhDO0FBQUEsUUFNSUMsYUFBYTtBQUNUQyxnQkFBUWhCLEtBQUtnQixNQURKO0FBRVRDLDBCQUFrQjtBQUZULEtBTmpCO0FBQUEsUUFXSUMsV0FBVztBQUNQQyxrQkFBVTtBQUNOQyxrQkFBTSxRQURBO0FBRU5DLG9CQUFRLE9BRkY7QUFHTkMsbUJBQU8sV0FIRDtBQUlOQyxnQkFBSSxhQUFVQyxVQUFWLEVBQXNCO0FBQ3RCQywwQkFBVUQsVUFBVjtBQUNIO0FBTkssU0FESDtBQVNQRSxnQkFBUTtBQUNKTixrQkFBTSxZQURGO0FBRUpDLG9CQUFRLE1BRko7QUFHSkMsbUJBQU8sVUFISDtBQUlKQyxnQkFBSSxhQUFVQyxVQUFWLEVBQXNCO0FBQ3RCRyx3QkFBUUgsVUFBUjtBQUNIO0FBTkcsU0FURDtBQWlCUCxzQkFBYztBQUNWSixrQkFBTSxVQURJO0FBRVZDLG9CQUFRLE1BRkU7QUFHVkMsbUJBQU8sWUFIRztBQUlWQyxnQkFBSSxhQUFVQyxVQUFWLEVBQXNCO0FBQ3RCSSwyQkFBV0osVUFBWDtBQUNIO0FBTlM7QUFqQlAsS0FYZjtBQUFBLFFBc0NJSyxZQXRDSjs7QUF3Q0E7QUFDQTtBQUNBOztBQUVBLFFBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0IsR0FBWTtBQUM1QixlQUFPLENBQUMzQixNQUFNNEIsUUFBTixDQUFlLFdBQWYsQ0FBUjtBQUNILEtBRkQ7O0FBSUE7QUFDQTtBQUNBOztBQUVBLFFBQUlDLGVBQWUsU0FBZkEsWUFBZSxDQUFVQyxLQUFWLEVBQWlCVCxVQUFqQixFQUFnRDtBQUFBLFlBQW5CVSxVQUFtQix1RUFBTixJQUFNOztBQUMvREwsdUJBQWVJLEtBQWY7QUFDQWYsaUJBQVNXLFlBQVQsRUFBdUJOLEVBQXZCLENBQTBCQyxVQUExQjs7QUFFQSxZQUFJVSxVQUFKLEVBQWdCO0FBQ1pDO0FBQ0g7O0FBRURDO0FBQ0gsS0FURDs7QUFXQSxRQUFJQSxnQkFBZ0IsU0FBaEJBLGFBQWdCLEdBQVk7QUFDNUIsWUFBSUMsWUFBWSxjQUFoQjtBQUNBLFlBQUlDLGlCQUFpQnBCLFNBQVNXLFlBQVQsRUFBdUJSLE1BQTVDO0FBQ0FkLDZCQUNLZ0MsVUFETCxDQUNnQixPQURoQixFQUVLQyxRQUZMLENBRWNILFlBQVlDLGNBRjFCO0FBR0gsS0FORDs7QUFRQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsUUFBSWIsWUFBWSxTQUFaQSxTQUFZLENBQVVELFVBQVYsRUFBc0I7O0FBRWxDLFlBQUlpQixhQUFheEMsTUFBTXlDLE1BQU4sR0FBZXJDLElBQWYsQ0FBb0IsWUFBcEIsQ0FBakI7O0FBRUE7QUFDQSxZQUFJbUIsVUFBSixFQUFnQjtBQUNackIsa0JBQU13QyxPQUFOLENBQWM7QUFDVix5QkFBUztBQURDLGFBQWQsRUFFRyxHQUZILEVBRVEsT0FGUjtBQUdILFNBSkQsTUFJTztBQUNIeEMsa0JBQU1PLEdBQU4sQ0FBVSxPQUFWLEVBQW1CLE1BQW5CO0FBQ0FSLGNBQUUsY0FBRixFQUFrQlEsR0FBbEIsQ0FBc0IsT0FBdEIsRUFBK0IsTUFBL0I7QUFDSDtBQUNEK0IsbUJBQVdHLElBQVg7O0FBRUExQyxVQUFFMkMsUUFBRixFQUFZQyxPQUFaLENBQW9CLG1CQUFwQjs7QUFFQTtBQUNBM0MsY0FDS0UsSUFETCxDQUNVLHFCQURWLEVBRUswQyxPQUZMLENBRWEsTUFGYjs7QUFJQTtBQUNBNUMsY0FDSzZDLFdBREwsQ0FDaUIsY0FEakIsRUFFS1IsUUFGTCxDQUVjLFdBRmQ7O0FBSUFyQyxjQUNLRSxJQURMLENBQ1Usa0JBRFYsRUFFSzJDLFdBRkwsQ0FFaUIsU0FGakI7O0FBSUE3QyxjQUNLRSxJQURMLENBQ1Usb0JBRFYsRUFFS21DLFFBRkwsQ0FFYyxTQUZkOztBQUlBLFlBQUlTLFdBQVdDLFlBQVksWUFBWTtBQUNuQyxnQkFBSXJCLGlCQUFpQixVQUFyQixFQUFpQztBQUM3QixvQkFBSTNCLEVBQUUsd0JBQUYsRUFBNEJpRCxNQUE1QixHQUFxQyxDQUF6QyxFQUE0QztBQUN4Q2hELDBCQUNLRSxJQURMLENBQ1UsZ0RBRFYsRUFFSzJDLFdBRkwsQ0FFaUIsU0FGakI7QUFHQUksa0NBQWNILFFBQWQ7QUFDSDtBQUNKLGFBUEQsTUFPTztBQUNIRyw4QkFBY0gsUUFBZDtBQUNIO0FBQ0osU0FYYyxFQVdaLENBWFksQ0FBZjtBQWFILEtBaEREOztBQWtEQTs7OztBQUlBLFFBQUl0QixVQUFVLFNBQVZBLE9BQVUsR0FBWTs7QUFFdEIsWUFBSWMsYUFBYXhDLE1BQU15QyxNQUFOLEdBQWVyQyxJQUFmLENBQW9CLFlBQXBCLENBQWpCOztBQUVBO0FBQ0FGLGNBQU13QyxPQUFOLENBQWM7QUFDVixxQkFBU2xDO0FBREMsU0FBZCxFQUVHLEdBRkgsRUFFUSxPQUZSO0FBR0FnQyxtQkFBV1ksSUFBWDs7QUFFQTtBQUNBbEQsY0FBTUUsSUFBTixDQUFXLHFCQUFYLEVBQWtDaUQsTUFBbEMsQ0FBeUMsTUFBekM7O0FBRUFwRCxVQUFFMkMsUUFBRixFQUFZQyxPQUFaLENBQW9CLGlCQUFwQjs7QUFFQTtBQUNBM0MsY0FBTTZDLFdBQU4sQ0FBa0IsV0FBbEI7QUFDQTVDLHdCQUFnQm9DLFFBQWhCLENBQXlCLFNBQXpCO0FBRUgsS0FuQkQ7O0FBcUJBOzs7O0FBSUEsUUFBSVosYUFBYSxTQUFiQSxVQUFhLENBQVVKLFVBQVYsRUFBc0I7O0FBRW5DckIsY0FDS3FDLFFBREwsQ0FDYyxjQURkOztBQUdBLFlBQUllLGdCQUFnQnBELE1BQ2ZFLElBRGUsQ0FDVixpQ0FEVSxDQUFwQjs7QUFHQSxZQUFJbUIsVUFBSixFQUFnQjtBQUNaK0IsMEJBQWNmLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsR0FBbEMsRUFBdUMsT0FBdkM7QUFDSCxTQUZELE1BRU87QUFDSGUsMEJBQWNmLFFBQWQsQ0FBdUIsU0FBdkI7QUFDSDs7QUFFRHRDLFVBQUUyQyxRQUFGLEVBQVlDLE9BQVosQ0FBb0IsaUJBQXBCOztBQUVBM0MsY0FDS0UsSUFETCxDQUNVLCtCQURWLEVBRUttQyxRQUZMLENBRWMsU0FGZDtBQUdILEtBbkJEOztBQXFCQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSUwsY0FBYyxTQUFkQSxXQUFjLEdBQVk7QUFDMUJ4QixpQ0FBeUI2QyxHQUF6QixDQUE2QjtBQUN6QnhELGtCQUFNRSxFQUFFdUQsTUFBRixDQUFTMUMsVUFBVCxFQUFxQjtBQUN2QjJDLG9DQUFvQjdCO0FBREcsYUFBckI7QUFEbUIsU0FBN0I7QUFLSCxLQU5EOztBQVFBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJOEIsV0FBVyxTQUFYQSxRQUFXLENBQVVDLEtBQVYsRUFBaUI7QUFDNUIsWUFBSXRELGtCQUFrQnVELEdBQWxCLENBQXNCRCxNQUFNRSxNQUE1QixFQUFvQ1gsTUFBeEMsRUFBZ0Q7QUFDNUNuQix5QkFBYWQsU0FBU1csWUFBVCxFQUF1QlQsSUFBcEMsRUFBMEMsSUFBMUM7QUFDSDtBQUNKLEtBSkQ7O0FBTUE7QUFDQTtBQUNBOztBQUVBckIsV0FBT2dFLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQjlELFVBQUUsMkJBQUYsRUFBK0JzQyxRQUEvQixDQUF3QyxtQkFBeEM7O0FBRUEsWUFBSSxDQUFDVixlQUFMLEVBQXNCO0FBQ2xCMUIsNEJBQWdCNEMsV0FBaEIsQ0FBNEIsU0FBNUI7QUFDSDs7QUFFRG5CLHVCQUFlckIsYUFBZjs7QUFFQSxZQUFJcUIsaUJBQWlCLEVBQXJCLEVBQXlCO0FBQ3JCQSwyQkFBZSxRQUFmLENBRHFCLENBQ0k7QUFDNUI7O0FBRURHLHFCQUFhSCxZQUFiLEVBQTJCLEtBQTNCLEVBQWtDLEtBQWxDOztBQUVBNUIsY0FBTWdFLEVBQU4sQ0FBUyxPQUFULEVBQWtCTixRQUFsQjs7QUFFQUs7QUFDSCxLQW5CRDs7QUFxQkEsV0FBT2pFLE1BQVA7QUFDSCxDQTlQTCIsImZpbGUiOiJjb2xsYXBzZV9sZWZ0X21lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNvbGxhcHNlX2xlZnRfbWVudS5qcyAyMDE1LTEwLTE1IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBDb2xsYXBzZSBNYWluIExlZnQgTWVudVxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgaGFuZGxlIHRoZSBjb2xsYXBzZSBhbmQgZXhwYW5zaW9uIG9mIHRoZSBtYWluIGxlZnQgbWVudSBvZiB0aGUgYWRtaW4gc2VjdGlvbi4gVGhlIEhUTUxcbiAqIGZvciB0aGUgY29sbGFwc2UgYnV0dG9uIGNvbWVzIGZyb20gdGhlIFwiaHRtbC9jb21wYXRpYmlsaXR5L2NvbGxhcHNlX2xlZnRfbWVudS5waHBcIi5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvY29sbGFwc2VfbGVmdF9tZW51XG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdjb2xsYXBzZV9sZWZ0X21lbnUnLFxuXG4gICAgWyd1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSddLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvY29sbGFwc2VfbGVmdF9tZW51ICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRUxFTUVOVFMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgJG1lbnUgPSAkKCcubWFpbi1sZWZ0LW1lbnUnKSxcbiAgICAgICAgICAgICRjdXJyZW50TWVudUJveCA9ICRtZW51LmZpbmQoJy5sZWZ0bWVudV9ib3guY3VycmVudCcpLFxuICAgICAgICAgICAgJG1lbnVUb2dnbGVCdXR0b24gPSAkdGhpcy5maW5kKCcubWVudS10b2dnbGUtYnV0dG9uJyksXG4gICAgICAgICAgICAkbWVudUJ1dHRvbkluZGljYXRvciA9ICRtZW51VG9nZ2xlQnV0dG9uLmZpbmQoJyNtZW51LWJ1dHRvbi1pbmRpY2F0b3InKSxcbiAgICAgICAgICAgIG1lbnVJbml0U3RhdGUgPSAkbWVudS5kYXRhKCdpbml0U3RhdGUnKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIG1vZHVsZSA9IHt9LFxuXG4gICAgICAgICAgICBpbml0aWFsQ3NzV2lkdGggPSAkbWVudS5jc3MoJ3dpZHRoJyksXG5cbiAgICAgICAgICAgIHVzZXJDb25maWd1cmF0aW9uU2VydmljZSA9IGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlLFxuXG4gICAgICAgICAgICB1c2VyQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHVzZXJJZDogZGF0YS51c2VySWQsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogJ21lbnVWaXNpYmlsaXR5J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc3RhdGVNYXAgPSB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dDogJ2V4cGFuZCcsXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjb2xsYXBzZWQnLFxuICAgICAgICAgICAgICAgICAgICBkbzogZnVuY3Rpb24gKGlzQW5pbWF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jb2xsYXBzZShpc0FuaW1hdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXhwYW5kOiB7XG4gICAgICAgICAgICAgICAgICAgIG5leHQ6ICdleHBhbmQtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uOiAnZG93bicsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnZXhwYW5kZWQnLFxuICAgICAgICAgICAgICAgICAgICBkbzogZnVuY3Rpb24gKGlzQW5pbWF0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9leHBhbmQoaXNBbmltYXRlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdleHBhbmQtYWxsJzoge1xuICAgICAgICAgICAgICAgICAgICBuZXh0OiAnY29sbGFwc2UnLFxuICAgICAgICAgICAgICAgICAgICBidXR0b246ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdleHBhbmQtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgZG86IGZ1bmN0aW9uIChpc0FuaW1hdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZXhwYW5kQWxsKGlzQW5pbWF0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgY3VycmVudFN0YXRlO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBIRUxQRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBpc01lbnVWaXNpYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEkbWVudS5oYXNDbGFzcygnY29sbGFwc2VkJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFNUQVRFIENIQU5HRSBUUklHR0VSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX2NoYW5nZVN0YXRlID0gZnVuY3Rpb24gKHN0YXRlLCBpc0FuaW1hdGVkLCBzYXZlQ29uZmlnID0gdHJ1ZSkge1xuICAgICAgICAgICAgY3VycmVudFN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICBzdGF0ZU1hcFtjdXJyZW50U3RhdGVdLmRvKGlzQW5pbWF0ZWQpO1xuXG4gICAgICAgICAgICBpZiAoc2F2ZUNvbmZpZykge1xuICAgICAgICAgICAgICAgIF9zYXZlQ29uZmlnKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9jaGFuZ2VCdXR0b24oKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2NoYW5nZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSAnZmEgZmEtY2FyZXQtJztcbiAgICAgICAgICAgIHZhciBhcnJvd0RpcmVjdGlvbiA9IHN0YXRlTWFwW2N1cnJlbnRTdGF0ZV0uYnV0dG9uO1xuICAgICAgICAgICAgJG1lbnVCdXR0b25JbmRpY2F0b3JcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignY2xhc3MnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhjbGFzc05hbWUgKyBhcnJvd0RpcmVjdGlvbik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIENPTExBUFNFIC8gRVhQQU5EIE1FTlVcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbGxhcHNlIExlZnQgTWVudVxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQW5pbWF0ZWQgLSBBbmltYXRlIHRoZSBoaWRpbmc/XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NvbGxhcHNlID0gZnVuY3Rpb24gKGlzQW5pbWF0ZWQpIHtcblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRCb3ggPSAkdGhpcy5wYXJlbnQoKS5maW5kKCd1bC5jdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIC8vIENvbGxhcHNlIG1lbnVcbiAgICAgICAgICAgIGlmIChpc0FuaW1hdGVkKSB7XG4gICAgICAgICAgICAgICAgJG1lbnUuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICd3aWR0aCc6ICc0NXB4J1xuICAgICAgICAgICAgICAgIH0sIDMwMCwgJ3N3aW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRtZW51LmNzcygnd2lkdGgnLCAnNDVweCcpO1xuICAgICAgICAgICAgICAgICQoJy5jb2x1bW5MZWZ0MicpLmNzcygnd2lkdGgnLCAnNDVweCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudEJveC5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoJ2xlZnRtZW51OmNvbGxhcHNlJyk7XG5cbiAgICAgICAgICAgIC8vIEZhZGUgb3V0IGhlYWRpbmcgdGV4dFxuICAgICAgICAgICAgJG1lbnVcbiAgICAgICAgICAgICAgICAuZmluZCgnLmxlZnRtZW51X2hlYWQgc3BhbicpXG4gICAgICAgICAgICAgICAgLmZhZGVPdXQoJ2Zhc3QnKTtcblxuICAgICAgICAgICAgLy8gQ2xhc3MgY2hhbmdlc1xuICAgICAgICAgICAgJG1lbnVcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2V4cGFuZGVkLWFsbCcpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjb2xsYXBzZWQnKTtcblxuICAgICAgICAgICAgJG1lbnVcbiAgICAgICAgICAgICAgICAuZmluZCgnLmN1cnJlbnQ6bm90KGxpKScpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgICAgICRtZW51XG4gICAgICAgICAgICAgICAgLmZpbmQoJy5jdXJyZW50LW1lbnUtaGVhZCcpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIHZhciBpbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFN0YXRlID09PSAnY29sbGFwc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKCcubGVmdG1lbnVfaGVhZC5jdXJyZW50JykubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG1lbnVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmxlZnRtZW51X2hlYWQuY3VycmVudDpub3QoLmN1cnJlbnQtbWVudS1oZWFkKScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjdXJyZW50Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4cGFuZCBMZWZ0IE1lbnVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZXhwYW5kID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgY3VycmVudEJveCA9ICR0aGlzLnBhcmVudCgpLmZpbmQoJ3VsLmN1cnJlbnQnKTtcblxuICAgICAgICAgICAgLy8gRXhwYW5kIG1lbnVcbiAgICAgICAgICAgICRtZW51LmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICd3aWR0aCc6IGluaXRpYWxDc3NXaWR0aFxuICAgICAgICAgICAgfSwgMzAwLCAnc3dpbmcnKTtcbiAgICAgICAgICAgIGN1cnJlbnRCb3guc2hvdygpO1xuXG4gICAgICAgICAgICAvLyBGYWRlIGluIGhlYWRpbmcgdGV4dFxuICAgICAgICAgICAgJG1lbnUuZmluZCgnLmxlZnRtZW51X2hlYWQgc3BhbicpLmZhZGVJbignc2xvdycpO1xuXG4gICAgICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKCdsZWZ0bWVudTpleHBhbmQnKTtcblxuICAgICAgICAgICAgLy8gQ2xhc3MgY2hhbmdlc1xuICAgICAgICAgICAgJG1lbnUucmVtb3ZlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xuICAgICAgICAgICAgJGN1cnJlbnRNZW51Qm94LmFkZENsYXNzKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXhwYW5kIGFsbCBtZW51IGl0ZW1zXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2V4cGFuZEFsbCA9IGZ1bmN0aW9uIChpc0FuaW1hdGVkKSB7XG5cbiAgICAgICAgICAgICRtZW51XG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdleHBhbmRlZC1hbGwnKTtcblxuICAgICAgICAgICAgdmFyICRoZWFkaW5nQm94ZXMgPSAkbWVudVxuICAgICAgICAgICAgICAgIC5maW5kKCdkaXYubGVmdG1lbnVfaGVhZDpub3QoLmN1cnJlbnQpJyk7XG5cbiAgICAgICAgICAgIGlmIChpc0FuaW1hdGVkKSB7XG4gICAgICAgICAgICAgICAgJGhlYWRpbmdCb3hlcy5hZGRDbGFzcygnY3VycmVudCcsIDc1MCwgJ3N3aW5nJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRoZWFkaW5nQm94ZXMuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcignbGVmdG1lbnU6ZXhwYW5kJyk7XG5cbiAgICAgICAgICAgICRtZW51XG4gICAgICAgICAgICAgICAgLmZpbmQoJ3VsLmxlZnRtZW51X2JveDpub3QoLmN1cnJlbnQpJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2N1cnJlbnQnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVVNFUiBDT05GSUdVUkFUSU9OIEhBTkRMRVJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9zYXZlQ29uZmlnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLnNldCh7XG4gICAgICAgICAgICAgICAgZGF0YTogJC5leHRlbmQodXNlckNvbmZpZywge1xuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IGN1cnJlbnRTdGF0ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9vbkNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJG1lbnVUb2dnbGVCdXR0b24uaGFzKGV2ZW50LnRhcmdldCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgX2NoYW5nZVN0YXRlKHN0YXRlTWFwW2N1cnJlbnRTdGF0ZV0ubmV4dCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgJCgnZGl2LmxlZnRtZW51X2hlYWQuY3VycmVudCcpLmFkZENsYXNzKCdjdXJyZW50LW1lbnUtaGVhZCcpO1xuXG4gICAgICAgICAgICBpZiAoIWlzTWVudVZpc2libGUoKSkge1xuICAgICAgICAgICAgICAgICRjdXJyZW50TWVudUJveC5yZW1vdmVDbGFzcygnY3VycmVudCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBtZW51SW5pdFN0YXRlO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0YXRlID09PSAnJykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9ICdleHBhbmQnOyAvLyBEZWZhdWx0IHZhbHVlIGlmIHRoZXJlIGlzIG5vIG1lbnVJbml0U3RhdGUgc2V0IHlldC5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2NoYW5nZVN0YXRlKGN1cnJlbnRTdGF0ZSwgZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgX29uQ2xpY2spO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
