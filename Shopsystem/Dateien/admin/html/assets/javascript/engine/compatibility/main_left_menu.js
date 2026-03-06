'use strict';

/* --------------------------------------------------------------
 main_left_menu.js 2020-12-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Compatibility Main Left Menu Handler
 *
 * This module will transform the old menu to the new theme.
 *
 * @module Compatibility/main_left_menu
 */
gx.compatibility.module('main_left_menu', [],

/**  @lends module:Compatibility/main_left_menu */

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
     * setTimeout variable for clearing timeout
     *
     * @var {int}
     */
    timeout = 0,


    /**
     * Delay until submenu opens after entering left menu
     *
     * @var {int}
     */
    initialShowSubmenuDelay = 100,


    /**
     * Delay until submenu appears. Will be set to zero after first submenu was displayed
     * and reset to the initial value after leaving the left menu.
     *
     * @var {int}
     */
    showSubmenuDelay = initialShowSubmenuDelay,


    /**
     * Save mouseDown event for not closing the submenu on dragging an entry into the favs-box
     *
     * @type {boolean}
     */
    mouseDown = false,


    /**
     * Submenu box wherein the mouseDown event was triggered
     *
     * @type {null}
     */
    $mouseDownBox = null,


    /**
     * Mouse X position on mousedown event
     *
     * @type {number}
     */
    mouseX = 0,


    /**
     * Mouse Y position on mousedown event
     *
     * @type {number}
     */
    mouseY = 0,


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
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    var _showMenuBox = function _showMenuBox($box) {

        var isCurrentBox = $box.hasClass('current');

        if ($box.find('li').length === 0 || isCurrentBox) {
            return;
        }

        if (!$box.is(':visible')) {
            var $menuParent = $box.prev().prev(),
                isFirstBox = $('.leftmenu_box').index($box) === 0,
                marginTop = isFirstBox ? -4 : -5,
                // Fine tuning for the top position
            marginBottom = 10,
                marginLeft = -10,
                windowBottomY = $(window).scrollTop() + window.innerHeight,


            // error message box on dashboard page
            headerExtraContentHeight = $('.main-page-content').offset().top - $('.main-top-header').height(),
                topPosition = $menuParent.offset().top - headerExtraContentHeight + marginTop,
                bottomPosition = windowBottomY - $box.height() - headerExtraContentHeight + marginTop - marginBottom;

            $box.css({
                'left': $('.main-left-menu').width() + marginLeft
            }); // fine tuning left

            if (topPosition < bottomPosition) {
                $box.css({
                    'top': topPosition
                }); // display submenu next to hovered menu item if it fits on screen
            } else {
                $box.css({
                    'top': bottomPosition
                }); // else display submenu at the bottom of the screen
            }

            $box.fadeIn(100);
            $box.addClass('floating');
            $menuParent.addClass('active');
        }
    };

    var _hideMenuBox = function _hideMenuBox($box) {
        var isCurrentBox = $box.hasClass('current');

        if ($box.is(':visible') && !isCurrentBox && !mouseDown) {
            $box.fadeOut(100);
            $box.removeClass('floating');
            $box.prev().prev().removeClass('active');
        }
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * On menu head mouse enter menu event handler.
     *
     * @param {object} event
     */
    var _onMenuHeadMouseEnter = function _onMenuHeadMouseEnter(event) {
        $(this).addClass('hover');
        var $that = $(this);

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            _showMenuBox($that.next().next());
            showSubmenuDelay = 0;
        }, showSubmenuDelay);
    };

    /**
     * On menu head mouse leave menu event handler.
     *
     * @param {object} event
     */
    var _onMenuHeadMouseLeave = function _onMenuHeadMouseLeave(event) {
        clearTimeout(timeout);
        $(this).removeClass('hover');
        var $box = $(this).next().next(),
            $head = $(this);
        setTimeout(function () {
            if (!$box.hasClass('hover') && !$head.hasClass('hover') && !$box.hasClass('leftmenu_head')) {
                _hideMenuBox($box);
            }
        }, 10);
    };

    /**
     * On menu mouse move event handler.
     *
     * Sometimes after multiple hovers the submenus remains hidden and this event handler
     * will ensure that it will not happen while the user hovers the menu item.
     *
     * @param {option} event
     */
    var _onMenuHeadMouseMove = function _onMenuHeadMouseMove(event) {
        if (!$(this).hasClass('hover')) {
            $(this).addClass('hover');
        }

        var $box = $(this).next().next();
    };

    /**
     * On menu box mouse enter menu event handler.
     *
     * @param {object} event
     */
    var _onMenuBoxMouseEnter = function _onMenuBoxMouseEnter(event) {
        $(this).addClass('hover');
    };

    /**
     * On menu box mouse leave menu event handler.
     *
     * @param {object} event
     */
    var _onMenuBoxMouseLeave = function _onMenuBoxMouseLeave(event) {
        $(this).removeClass('hover');

        var $box = $(this),
            $head = $box.prev().prev();

        setTimeout(function () {
            if (!$box.hasClass('hover') && !$head.hasClass('hover')) {
                _hideMenuBox($box);
            }
        }, 10);
    };

    var _onMenuHeadingDown = function _onMenuHeadingDown(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    };

    /**
     * On menu heading click event handler.
     *
     * @param {object} event
     */
    var _onMenuHeadingClick = function _onMenuHeadingClick(event) {

        // do not open link if mouse was moved more than 5px during mousdown event
        if (mouseX > event.pageX + 5 || mouseX < event.pageX - 5 || mouseY > event.pageY + 5 || mouseY < event.pageY - 5) {
            return false;
        }

        // 1 = left click, 2 = middle click
        if (event.which === 1 || event.which === 2) {
            event.preventDefault();
            event.stopPropagation();

            var $heading = $(event.currentTarget);
            var $firstSubItem = $heading.next().next().find('li:first').find('a:first');

            var target = event.which === 1 ? '_self' : '_blank';

            // Open the first sub item's link
            if ($firstSubItem.prop('href')) {
                window.open($firstSubItem.prop('href'), target);
            }
        }
    };

    /**
     * Reset submenu display delay after leaving the left menu
     */
    var _resetShowSubmenuDelay = function _resetShowSubmenuDelay() {
        showSubmenuDelay = initialShowSubmenuDelay;
    };

    /**
     * Save submenu wherein the mouseDown event was triggered
     */
    var _onMenuBoxMouseDown = function _onMenuBoxMouseDown() {
        $mouseDownBox = $(this);
        mouseDown = true;
    };

    /**
     * Hide submenu on mouseUp event after dragging an entry into the favs-box
     */
    var _onMouseUp = function _onMouseUp() {
        mouseDown = false;

        if ($mouseDownBox) {
            _hideMenuBox($mouseDownBox);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZE CONTROLLER
    // ------------------------------------------------------------------------

    /**
     * Initialize controller.
     */
    module.init = function (done) {
        $this.on('mouseenter', '.leftmenu_head', _onMenuHeadMouseEnter).on('mouseleave', '.leftmenu_head', _onMenuHeadMouseLeave).on('mousemove', '.leftmenu_head', _onMenuHeadMouseMove).on('mouseenter', '.leftmenu_box', _onMenuBoxMouseEnter).on('mouseleave', '.leftmenu_box', _onMenuBoxMouseLeave).on('mousedown', '.leftmenu_box', _onMenuBoxMouseDown).on('mousedown', '.leftmenu_head', _onMenuHeadingDown).on('mouseup', '.leftmenu_head', _onMenuHeadingClick).on('mouseleave', _resetShowSubmenuDelay);

        $(document).on('mouseup', _onMouseUp);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW5fbGVmdF9tZW51LmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsInRpbWVvdXQiLCJpbml0aWFsU2hvd1N1Ym1lbnVEZWxheSIsInNob3dTdWJtZW51RGVsYXkiLCJtb3VzZURvd24iLCIkbW91c2VEb3duQm94IiwibW91c2VYIiwibW91c2VZIiwib3B0aW9ucyIsImV4dGVuZCIsIl9zaG93TWVudUJveCIsIiRib3giLCJpc0N1cnJlbnRCb3giLCJoYXNDbGFzcyIsImZpbmQiLCJsZW5ndGgiLCJpcyIsIiRtZW51UGFyZW50IiwicHJldiIsImlzRmlyc3RCb3giLCJpbmRleCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbkxlZnQiLCJ3aW5kb3dCb3R0b21ZIiwid2luZG93Iiwic2Nyb2xsVG9wIiwiaW5uZXJIZWlnaHQiLCJoZWFkZXJFeHRyYUNvbnRlbnRIZWlnaHQiLCJvZmZzZXQiLCJ0b3AiLCJoZWlnaHQiLCJ0b3BQb3NpdGlvbiIsImJvdHRvbVBvc2l0aW9uIiwiY3NzIiwid2lkdGgiLCJmYWRlSW4iLCJhZGRDbGFzcyIsIl9oaWRlTWVudUJveCIsImZhZGVPdXQiLCJyZW1vdmVDbGFzcyIsIl9vbk1lbnVIZWFkTW91c2VFbnRlciIsImV2ZW50IiwiJHRoYXQiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwibmV4dCIsIl9vbk1lbnVIZWFkTW91c2VMZWF2ZSIsIiRoZWFkIiwiX29uTWVudUhlYWRNb3VzZU1vdmUiLCJfb25NZW51Qm94TW91c2VFbnRlciIsIl9vbk1lbnVCb3hNb3VzZUxlYXZlIiwiX29uTWVudUhlYWRpbmdEb3duIiwicGFnZVgiLCJwYWdlWSIsIl9vbk1lbnVIZWFkaW5nQ2xpY2siLCJ3aGljaCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiJGhlYWRpbmciLCJjdXJyZW50VGFyZ2V0IiwiJGZpcnN0U3ViSXRlbSIsInRhcmdldCIsInByb3AiLCJvcGVuIiwiX3Jlc2V0U2hvd1N1Ym1lbnVEZWxheSIsIl9vbk1lbnVCb3hNb3VzZURvd24iLCJfb25Nb3VzZVVwIiwiaW5pdCIsImRvbmUiLCJvbiIsImRvY3VtZW50Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxnQkFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxjQUFVLENBcEJkOzs7QUFzQkk7Ozs7O0FBS0FDLDhCQUEwQixHQTNCOUI7OztBQTZCSTs7Ozs7O0FBTUFDLHVCQUFtQkQsdUJBbkN2Qjs7O0FBcUNJOzs7OztBQUtBRSxnQkFBWSxLQTFDaEI7OztBQTRDSTs7Ozs7QUFLQUMsb0JBQWdCLElBakRwQjs7O0FBbURJOzs7OztBQUtBQyxhQUFTLENBeERiOzs7QUEwREk7Ozs7O0FBS0FDLGFBQVMsQ0EvRGI7OztBQWlFSTs7Ozs7QUFLQUMsY0FBVVQsRUFBRVUsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CVCxRQUFuQixFQUE2QkgsSUFBN0IsQ0F0RWQ7OztBQXdFSTs7Ozs7QUFLQUQsYUFBUyxFQTdFYjs7QUErRUE7QUFDQTtBQUNBOztBQUVBLFFBQUljLGVBQWUsU0FBZkEsWUFBZSxDQUFVQyxJQUFWLEVBQWdCOztBQUUvQixZQUFJQyxlQUFlRCxLQUFLRSxRQUFMLENBQWMsU0FBZCxDQUFuQjs7QUFFQSxZQUFJRixLQUFLRyxJQUFMLENBQVUsSUFBVixFQUFnQkMsTUFBaEIsS0FBMkIsQ0FBM0IsSUFBZ0NILFlBQXBDLEVBQWtEO0FBQzlDO0FBQ0g7O0FBRUQsWUFBSSxDQUFDRCxLQUFLSyxFQUFMLENBQVEsVUFB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QjtBQUNBSyxvQkFBWSxJQUFaO0FBQ0gsS0FIRDs7QUFLQTs7O0FBR0EsUUFBSStELGFBQWEsU0FBYkEsVUFBYSxHQUFZO0FBQ3pCL0Qsb0JBQVksS0FBWjs7QUFFQSxZQUFJQyxhQUFKLEVBQW1CO0FBQ2ZpQyx5QkFBYWpDLGFBQWI7QUFDSDtBQUNKLEtBTkQ7O0FBUUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQVQsV0FBT3dFLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCdkUsY0FDS3dFLEVBREwsQ0FDUSxZQURSLEVBQ3NCLGdCQUR0QixFQUN3QzdCLHFCQUR4QyxFQUVLNkIsRUFGTCxDQUVRLFlBRlIsRUFFc0IsZ0JBRnRCLEVBRXdDdkIscUJBRnhDLEVBR0t1QixFQUhMLENBR1EsV0FIUixFQUdxQixnQkFIckIsRUFHdUNyQixvQkFIdkMsRUFJS3FCLEVBSkwsQ0FJUSxZQUpSLEVBSXNCLGVBSnRCLEVBSXVDcEIsb0JBSnZDLEVBS0tvQixFQUxMLENBS1EsWUFMUixFQUtzQixlQUx0QixFQUt1Q25CLG9CQUx2QyxFQU1LbUIsRUFOTCxDQU1RLFdBTlIsRUFNcUIsZUFOckIsRUFNc0NKLG1CQU50QyxFQU9LSSxFQVBMLENBT1EsV0FQUixFQU9xQixnQkFQckIsRUFPdUNsQixrQkFQdkMsRUFRS2tCLEVBUkwsQ0FRUSxTQVJSLEVBUW1CLGdCQVJuQixFQVFxQ2YsbUJBUnJDLEVBU0tlLEVBVEwsQ0FTUSxZQVRSLEVBU3NCTCxzQkFUdEI7O0FBV0FsRSxVQUFFd0UsUUFBRixFQUFZRCxFQUFaLENBQWUsU0FBZixFQUEwQkgsVUFBMUI7O0FBRUFFO0FBQ0gsS0FmRDs7QUFpQkEsV0FBT3pFLE1BQVA7QUFDSCxDQWxVTCIsImZpbGUiOiJtYWluX2xlZnRfbWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gbWFpbl9sZWZ0X21lbnUuanMgMjAyMC0xMi0xMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjAgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQ29tcGF0aWJpbGl0eSBNYWluIExlZnQgTWVudSBIYW5kbGVyXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCB0cmFuc2Zvcm0gdGhlIG9sZCBtZW51IHRvIHRoZSBuZXcgdGhlbWUuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L21haW5fbGVmdF9tZW51XG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdtYWluX2xlZnRfbWVudScsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L21haW5fbGVmdF9tZW51ICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogc2V0VGltZW91dCB2YXJpYWJsZSBmb3IgY2xlYXJpbmcgdGltZW91dFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge2ludH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGltZW91dCA9IDAsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVsYXkgdW50aWwgc3VibWVudSBvcGVucyBhZnRlciBlbnRlcmluZyBsZWZ0IG1lbnVcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtpbnR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGluaXRpYWxTaG93U3VibWVudURlbGF5ID0gMTAwLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlbGF5IHVudGlsIHN1Ym1lbnUgYXBwZWFycy4gV2lsbCBiZSBzZXQgdG8gemVybyBhZnRlciBmaXJzdCBzdWJtZW51IHdhcyBkaXNwbGF5ZWRcbiAgICAgICAgICAgICAqIGFuZCByZXNldCB0byB0aGUgaW5pdGlhbCB2YWx1ZSBhZnRlciBsZWF2aW5nIHRoZSBsZWZ0IG1lbnUuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7aW50fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBzaG93U3VibWVudURlbGF5ID0gaW5pdGlhbFNob3dTdWJtZW51RGVsYXksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogU2F2ZSBtb3VzZURvd24gZXZlbnQgZm9yIG5vdCBjbG9zaW5nIHRoZSBzdWJtZW51IG9uIGRyYWdnaW5nIGFuIGVudHJ5IGludG8gdGhlIGZhdnMtYm94XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vdXNlRG93biA9IGZhbHNlLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFN1Ym1lbnUgYm94IHdoZXJlaW4gdGhlIG1vdXNlRG93biBldmVudCB3YXMgdHJpZ2dlcmVkXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge251bGx9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRtb3VzZURvd25Cb3ggPSBudWxsLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vdXNlIFggcG9zaXRpb24gb24gbW91c2Vkb3duIGV2ZW50XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW91c2VYID0gMCxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb3VzZSBZIHBvc2l0aW9uIG9uIG1vdXNlZG93biBldmVudFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vdXNlWSA9IDAsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9zaG93TWVudUJveCA9IGZ1bmN0aW9uICgkYm94KSB7XG5cbiAgICAgICAgICAgIHZhciBpc0N1cnJlbnRCb3ggPSAkYm94Lmhhc0NsYXNzKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgICAgIGlmICgkYm94LmZpbmQoJ2xpJykubGVuZ3RoID09PSAwIHx8IGlzQ3VycmVudEJveCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEkYm94LmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgICAgICAgdmFyICRtZW51UGFyZW50ID0gJGJveC5wcmV2KCkucHJldigpLFxuICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0Qm94ID0gKCQoJy5sZWZ0bWVudV9ib3gnKS5pbmRleCgkYm94KSA9PT0gMCksXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcCA9IGlzRmlyc3RCb3ggPyAtNCA6IC01LCAvLyBGaW5lIHR1bmluZyBmb3IgdGhlIHRvcCBwb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b20gPSAxMCxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luTGVmdCA9IC0xMCxcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Qm90dG9tWSA9ICQod2luZG93KS5zY3JvbGxUb3AoKSArIHdpbmRvdy5pbm5lckhlaWdodCxcblxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBtZXNzYWdlIGJveCBvbiBkYXNoYm9hcmQgcGFnZVxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJFeHRyYUNvbnRlbnRIZWlnaHQgPSAkKCcubWFpbi1wYWdlLWNvbnRlbnQnKS5vZmZzZXQoKS50b3AgLSAkKCcubWFpbi10b3AtaGVhZGVyJykuaGVpZ2h0KCksXG5cbiAgICAgICAgICAgICAgICAgICAgdG9wUG9zaXRpb24gPSAkbWVudVBhcmVudC5vZmZzZXQoKS50b3AgLSBoZWFkZXJFeHRyYUNvbnRlbnRIZWlnaHQgKyBtYXJnaW5Ub3AsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbVBvc2l0aW9uID0gd2luZG93Qm90dG9tWSAtICRib3guaGVpZ2h0KCkgLSBoZWFkZXJFeHRyYUNvbnRlbnRIZWlnaHQgKyBtYXJnaW5Ub3AgLVxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tO1xuXG4gICAgICAgICAgICAgICAgJGJveC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnbGVmdCc6ICQoJy5tYWluLWxlZnQtbWVudScpLndpZHRoKCkgKyBtYXJnaW5MZWZ0XG4gICAgICAgICAgICAgICAgfSk7IC8vIGZpbmUgdHVuaW5nIGxlZnRcblxuICAgICAgICAgICAgICAgIGlmICh0b3BQb3NpdGlvbiA8IGJvdHRvbVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICRib3guY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0b3AnOiB0b3BQb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICB9KTsgLy8gZGlzcGxheSBzdWJtZW51IG5leHQgdG8gaG92ZXJlZCBtZW51IGl0ZW0gaWYgaXQgZml0cyBvbiBzY3JlZW5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkYm94LmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndG9wJzogYm90dG9tUG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgfSk7IC8vIGVsc2UgZGlzcGxheSBzdWJtZW51IGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRib3guZmFkZUluKDEwMCk7XG4gICAgICAgICAgICAgICAgJGJveC5hZGRDbGFzcygnZmxvYXRpbmcnKTtcbiAgICAgICAgICAgICAgICAkbWVudVBhcmVudC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9oaWRlTWVudUJveCA9IGZ1bmN0aW9uICgkYm94KSB7XG4gICAgICAgICAgICB2YXIgaXNDdXJyZW50Qm94ID0gJGJveC5oYXNDbGFzcygnY3VycmVudCcpO1xuXG4gICAgICAgICAgICBpZiAoJGJveC5pcygnOnZpc2libGUnKSAmJiAhaXNDdXJyZW50Qm94ICYmICFtb3VzZURvd24pIHtcbiAgICAgICAgICAgICAgICAkYm94LmZhZGVPdXQoMTAwKTtcbiAgICAgICAgICAgICAgICAkYm94LnJlbW92ZUNsYXNzKCdmbG9hdGluZycpO1xuICAgICAgICAgICAgICAgICRib3gucHJldigpLnByZXYoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBtZW51IGhlYWQgbW91c2UgZW50ZXIgbWVudSBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25NZW51SGVhZE1vdXNlRW50ZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgICB2YXIgJHRoYXQgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3Nob3dNZW51Qm94KCR0aGF0Lm5leHQoKS5uZXh0KCkpO1xuICAgICAgICAgICAgICAgIHNob3dTdWJtZW51RGVsYXkgPSAwO1xuICAgICAgICAgICAgfSwgc2hvd1N1Ym1lbnVEZWxheSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIG1lbnUgaGVhZCBtb3VzZSBsZWF2ZSBtZW51IGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbk1lbnVIZWFkTW91c2VMZWF2ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnaG92ZXInKTtcbiAgICAgICAgICAgIHZhciAkYm94ID0gJCh0aGlzKS5uZXh0KCkubmV4dCgpLFxuICAgICAgICAgICAgICAgICRoZWFkID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJGJveC5oYXNDbGFzcygnaG92ZXInKSAmJiAhJGhlYWQuaGFzQ2xhc3MoJ2hvdmVyJykgJiYgISRib3guaGFzQ2xhc3MoJ2xlZnRtZW51X2hlYWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBfaGlkZU1lbnVCb3goJGJveCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBtZW51IG1vdXNlIG1vdmUgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICpcbiAgICAgICAgICogU29tZXRpbWVzIGFmdGVyIG11bHRpcGxlIGhvdmVycyB0aGUgc3VibWVudXMgcmVtYWlucyBoaWRkZW4gYW5kIHRoaXMgZXZlbnQgaGFuZGxlclxuICAgICAgICAgKiB3aWxsIGVuc3VyZSB0aGF0IGl0IHdpbGwgbm90IGhhcHBlbiB3aGlsZSB0aGUgdXNlciBob3ZlcnMgdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvcHRpb259IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uTWVudUhlYWRNb3VzZU1vdmUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnaG92ZXInKSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkYm94ID0gJCh0aGlzKS5uZXh0KCkubmV4dCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBtZW51IGJveCBtb3VzZSBlbnRlciBtZW51IGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbk1lbnVCb3hNb3VzZUVudGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdob3ZlcicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBtZW51IGJveCBtb3VzZSBsZWF2ZSBtZW51IGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbk1lbnVCb3hNb3VzZUxlYXZlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuXG4gICAgICAgICAgICB2YXIgJGJveCA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJGhlYWQgPSAkYm94LnByZXYoKS5wcmV2KCk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJGJveC5oYXNDbGFzcygnaG92ZXInKSAmJiAhJGhlYWQuaGFzQ2xhc3MoJ2hvdmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgX2hpZGVNZW51Qm94KCRib3gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29uTWVudUhlYWRpbmdEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBtb3VzZVggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICAgIG1vdXNlWSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBtZW51IGhlYWRpbmcgY2xpY2sgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uTWVudUhlYWRpbmdDbGljayA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICAvLyBkbyBub3Qgb3BlbiBsaW5rIGlmIG1vdXNlIHdhcyBtb3ZlZCBtb3JlIHRoYW4gNXB4IGR1cmluZyBtb3VzZG93biBldmVudFxuICAgICAgICAgICAgaWYgKG1vdXNlWCA+IChldmVudC5wYWdlWCArIDUpIHx8IG1vdXNlWCA8IChldmVudC5wYWdlWCAtIDUpIHx8IG1vdXNlWSA+IChldmVudC5wYWdlWSArIDUpIHx8XG4gICAgICAgICAgICAgICAgbW91c2VZIDwgKGV2ZW50LnBhZ2VZIC1cbiAgICAgICAgICAgICAgICAgICAgNSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIDEgPSBsZWZ0IGNsaWNrLCAyID0gbWlkZGxlIGNsaWNrXG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEgfHwgZXZlbnQud2hpY2ggPT09IDIpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgdmFyICRoZWFkaW5nID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB2YXIgJGZpcnN0U3ViSXRlbSA9ICRoZWFkaW5nXG4gICAgICAgICAgICAgICAgICAgIC5uZXh0KClcbiAgICAgICAgICAgICAgICAgICAgLm5leHQoKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnbGk6Zmlyc3QnKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnYTpmaXJzdCcpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IChldmVudC53aGljaCA9PT0gMSkgPyAnX3NlbGYnIDogJ19ibGFuayc7XG5cbiAgICAgICAgICAgICAgICAvLyBPcGVuIHRoZSBmaXJzdCBzdWIgaXRlbSdzIGxpbmtcbiAgICAgICAgICAgICAgICBpZiAoJGZpcnN0U3ViSXRlbS5wcm9wKCdocmVmJykpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJGZpcnN0U3ViSXRlbS5wcm9wKCdocmVmJyksIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldCBzdWJtZW51IGRpc3BsYXkgZGVsYXkgYWZ0ZXIgbGVhdmluZyB0aGUgbGVmdCBtZW51XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Jlc2V0U2hvd1N1Ym1lbnVEZWxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNob3dTdWJtZW51RGVsYXkgPSBpbml0aWFsU2hvd1N1Ym1lbnVEZWxheTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSBzdWJtZW51IHdoZXJlaW4gdGhlIG1vdXNlRG93biBldmVudCB3YXMgdHJpZ2dlcmVkXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uTWVudUJveE1vdXNlRG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRtb3VzZURvd25Cb3ggPSAkKHRoaXMpO1xuICAgICAgICAgICAgbW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGlkZSBzdWJtZW51IG9uIG1vdXNlVXAgZXZlbnQgYWZ0ZXIgZHJhZ2dpbmcgYW4gZW50cnkgaW50byB0aGUgZmF2cy1ib3hcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25Nb3VzZVVwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbW91c2VEb3duID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICgkbW91c2VEb3duQm94KSB7XG4gICAgICAgICAgICAgICAgX2hpZGVNZW51Qm94KCRtb3VzZURvd25Cb3gpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpFIENPTlRST0xMRVJcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgY29udHJvbGxlci5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyJywgJy5sZWZ0bWVudV9oZWFkJywgX29uTWVudUhlYWRNb3VzZUVudGVyKVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsICcubGVmdG1lbnVfaGVhZCcsIF9vbk1lbnVIZWFkTW91c2VMZWF2ZSlcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlbW92ZScsICcubGVmdG1lbnVfaGVhZCcsIF9vbk1lbnVIZWFkTW91c2VNb3ZlKVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VlbnRlcicsICcubGVmdG1lbnVfYm94JywgX29uTWVudUJveE1vdXNlRW50ZXIpXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlJywgJy5sZWZ0bWVudV9ib3gnLCBfb25NZW51Qm94TW91c2VMZWF2ZSlcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlZG93bicsICcubGVmdG1lbnVfYm94JywgX29uTWVudUJveE1vdXNlRG93bilcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlZG93bicsICcubGVmdG1lbnVfaGVhZCcsIF9vbk1lbnVIZWFkaW5nRG93bilcbiAgICAgICAgICAgICAgICAub24oJ21vdXNldXAnLCAnLmxlZnRtZW51X2hlYWQnLCBfb25NZW51SGVhZGluZ0NsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZScsIF9yZXNldFNob3dTdWJtZW51RGVsYXkpO1xuXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignbW91c2V1cCcsIF9vbk1vdXNlVXApO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
