'use strict';

/* --------------------------------------------------------------
 menu.js 2017-05-30
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Main Menu Controller
 *
 * Whenever the user clicks on a menu item the browser must be redirected to the respective location.
 *
 * Middle button clicks are also supported.
 */
gx.controllers.module('menu', [jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.js', jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', 'user_configuration_service', gx.source + '/libs/shortcuts'], function (data) {

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
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Menu List Selector
     *
     * @type {Object}
     */
    var $list = $this.children('ul');

    /**
     * Sub-list Selector
     *
     * This object is used for correctly displaying the sub-list <ul> element whenever it goes out
     * of viewport.
     *
     * @type {jQuery}
     */
    var $sublist = null;

    /**
     * Favorites Box
     *
     * @type {Object}
     */
    var $favoritesMenu = $this.find('ul li').first();

    /**
     * Draggable Menu Items
     *
     * @type {Object}
     */
    var $draggableMenuItems = $this.find('.fav-drag-item');

    /**
     * Dropzone Box
     *
     * The draggable elements will be placed here.
     *
     * @type {Object}
     */
    var favDropzoneBox = '#fav-dropzone-box';

    /**
     * Drag and drop flag to prevent the default action of a menu item when it is dragged.
     *
     * @type {Boolean} True while am item is dragged.
     */
    var onDragAndDrop = false;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Makes all menu items draggable.
     *
     * This function should be executed in the module.init() method.
     *
     * @param {Object} $draggableMenuItems Menu item jQuery selector.
     */
    function _makeMenuItemsDraggable($draggableMenuItems) {
        $draggableMenuItems.draggable({
            helper: 'clone', // Clone the element, don't move the element itself.
            start: function start(event, ui) {
                onDragAndDrop = true;
                ui.helper.addClass('currentlyDragged');
                _createFavoritesDropzone(this);
            },
            stop: function stop(event) {
                onDragAndDrop = false;
                $(favDropzoneBox).remove();
            }
        });
    }

    /**
     * Creates the favorites box, where the draggable items can be dropped on.
     *
     * @param {HTMLElement} draggedElement Dragged menu item.
     */
    function _createFavoritesDropzone(draggedElement) {
        var dropzoneBox = '';
        var action = '';

        if ($(draggedElement).parents('li').find('.fa-heart').length === 0) {
            dropzoneBox = '\n\t\t\t\t<div id="fav-dropzone-box" class="fav-add">\n\t\t\t\t\t<i class="fa fa-heart"></i>\n\t\t\t\t</div>\n\t\t\t';
            action = 'save';
        } else {
            dropzoneBox = '\n\t\t\t\t<div id="fav-dropzone-box" class="fav-delete">\n\t\t\t\t\t<i class="fa fa-trash"></i>\n\t\t\t\t</div>\n\t\t\t';
            action = 'delete';
        }

        _positionDropzoneBox(dropzoneBox, draggedElement);

        $(favDropzoneBox).droppable(_getObjectFromAction(action, draggedElement));
    }

    /**
     * Stores the menu item as a favorite in the database.
     *
     * @param {String} linkKey Unique link key from the menu item.
     * @param {Object} draggedElement Dragged menu item.
     */
    function _saveToFavorites(linkKey, draggedElement) {
        $.ajax({
            url: 'admin.php?do=AdminFavoritesAjax/AddMenuItem&link_key=' + linkKey,
            error: function error(_error) {
                console.error('Could not save the menu item with the link key: ' + linkKey);
            },
            success: function success() {
                if (!_isLinkKeyInFavorites(linkKey)) {
                    var $newLink = $(draggedElement).clone().addClass('fav-drag-item');
                    var $newListItem = $('<li/>').append($newLink);
                    if ($favoritesMenu.find('ul').children().length === 0) {
                        $favoritesMenu.append($('<ul/>'));
                    }
                    $favoritesMenu.find('ul').append($newListItem);
                    _makeMenuItemsDraggable($newListItem.find('.fav-drag-item'));
                }
            }
        });
    }

    /**
     * Deletes the menu item as a favorite from the database.
     *
     * @param {String} linkKey Unique link key from the menu item.
     * @param {Object} draggedElement Dragged menu item.
     */
    function _deleteFromFavorites(linkKey, draggedElement) {
        $.ajax({
            url: 'admin.php?do=AdminFavoritesAjax/RemoveMenuItem&link_key=' + linkKey,
            error: function error(_error2) {
                console.error('Could not remove the menu item with the link key: ' + linkKey);
            },
            success: function success() {
                $(draggedElement).parent('li').remove();
                if ($favoritesMenu.find('ul').children().length === 0) {
                    $favoritesMenu.find('ul').remove();
                }
            }
        });
    }

    /**
     * Checks if a menu item is already stored in the favorites menu.
     *
     * @param {String} linkKey Unique link key of a menu item.
     *
     * @return {Boolean} True if menu item is already stored, else false will be returned.
     */
    function _isLinkKeyInFavorites(linkKey) {
        return $favoritesMenu.find('#' + linkKey).length !== 0;
    }

    /**
     * Get jQueryUI droppable options object
     *
     * @param {String} action Action to execute value=save|delete.
     * @param {Object} draggedElement Dragged meu item.
     *
     * @return {Object} jQueryUI droppable options.
     */
    function _getObjectFromAction(action, draggedElement) {
        var droppableOptions = {
            accept: '.fav-drag-item',
            tolerance: 'pointer',
            // Function when hovering over the favorites box.
            over: function over() {
                $(favDropzoneBox).css('opacity', '1.0');
            },
            // Function when hovering out from the favorites box.
            out: function out() {
                $(favDropzoneBox).css('opacity', '0.9');
            },
            // Function when dropping an element on the favorites box.
            drop: function drop(event, ui) {
                var linkKey = $(ui.draggable).attr('id');

                if (action === 'save') {
                    _saveToFavorites(linkKey, draggedElement);
                } else if (action === 'delete') {
                    _deleteFromFavorites(linkKey, draggedElement);
                }
            }
        };

        return droppableOptions;
    }

    /**
     * Positions the DropzoneBox at the correct place.
     *
     * @param {String} dropzoneBox DropzoneBox HTML.
     * @param {Object} draggedElement Dragged menu item.
     */
    function _positionDropzoneBox(dropzoneBox, draggedElement) {
        var $dropzoneBox = $(dropzoneBox);

        $(draggedElement).parent('li').prepend($dropzoneBox);

        var dropzoneBoxHeight = $dropzoneBox.outerHeight();

        $dropzoneBox.css({
            top: $(draggedElement).position().top - dropzoneBoxHeight / 2
        });
    }

    /**
     * Open the active menu group.
     *
     * This method will find the menu item that contains the same "do" GET parameter and set the "active"
     * class to its parent.
     */
    function _toggleActiveMenuGroup() {
        var currentUrlParameters = $.deparam(window.location.search.slice(1));

        $list.find('li:gt(0) ul li a').each(function (index, link) {
            var linkUrlParameters = $.deparam($(link).attr('href').replace(/.*(\?)/, '$1').slice(1));

            if (currentUrlParameters.length > 0 && linkUrlParameters.do === currentUrlParameters.do) {
                $(link).parents('li:lt(2)').addClass('active');
                return false;
            }
        });

        if ($list.find('.active').length) {
            return;
        }

        // If no match was found, check for sub-page links in content navigation.
        $('#main-content .content-navigation .nav-item').each(function (index, navItem) {
            var $navItem = $(navItem);
            var navItemUrl = $navItem.find('a').attr('href');

            $list.find('li:gt(1) a').each(function (index, link) {
                var $link = $(link);
                var linkUrl = $link.attr('href').split('/').pop();

                if (linkUrl === navItemUrl) {
                    $link.parents('li:lt(2)').addClass('active');
                    return false;
                }
            });
        });

        if ($list.find('.active').length) {
            return;
        }

        // If no match was found, only check for the controller name.
        var currentControllerName = _getControllerName(currentUrlParameters.do);

        $list.find('li:gt(0) ul li a').each(function (index, link) {
            var linkUrlParameters = $.deparam($(link).attr('href').replace(/.*(\?)/, '$1').slice(1));
            var linkControllerName = _getControllerName(linkUrlParameters.do);

            if (undefined !== currentControllerName && linkControllerName === currentControllerName) {
                $(link).parents('li:lt(2)').addClass('active');
                return false;
            }
        });
    }

    /**
     * Registers a shortcut to open the favorite entries.
     *
     * @private
     */
    function _registerShortcut() {
        // Shortcut library abbreviation.
        var lib = jse.libs.shortcuts;

        // Combination name.
        var name = 'openFavoriteMenuEntry';

        // Callback function.
        var callback = function callback(index) {
            // Get link from favorite entry.
            var link = $favoritesMenu.children().eq(index).find('a').attr('href');

            // Open link in same window.
            window.open(link, '_self');
        };

        // Iterating over each above number key starting with '1' until '9'.
        var firstKeyCode = jse.libs.shortcuts.KEY_CODES.NUM_1;

        var _loop = function _loop(iteration) {
            // Key combination (CTRL + SHIFT + keyCode).
            var combination = [lib.KEY_CODES.CTRL_L, lib.KEY_CODES.SHIFT_L, firstKeyCode + iteration];

            // Register shortcut.
            lib.registerShortcut(name + iteration, combination, function () {
                return callback(iteration);
            });
        };

        for (var iteration = 0; iteration < 9; iteration++) {
            _loop(iteration);
        }
    }

    /**
     * Returns only the PHP controller value from the provided link.
     *
     * Example:
     *   Input: GoogleShopping/editScheme
     *   Output: GoogleShopping
     *
     * @param link do parameter from the fetched window.location
     */
    function _getControllerName(link) {
        return link && link.indexOf('/') !== -1 ? link.split('/')[0] : link;
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _makeMenuItemsDraggable($draggableMenuItems);
        _toggleActiveMenuGroup();
        _registerShortcut();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9tZW51L21lbnUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkbGlzdCIsImNoaWxkcmVuIiwiJHN1Ymxpc3QiLCIkZmF2b3JpdGVzTWVudSIsImZpbmQiLCJmaXJzdCIsIiRkcmFnZ2FibGVNZW51SXRlbXMiLCJmYXZEcm9wem9uZUJveCIsIm9uRHJhZ0FuZERyb3AiLCJfbWFrZU1lbnVJdGVtc0RyYWdnYWJsZSIsImRyYWdnYWJsZSIsImhlbHBlciIsInN0YXJ0IiwiZXZlbnQiLCJ1aSIsImFkZENsYXNzIiwiX2NyZWF0ZUZhdm9yaXRlc0Ryb3B6b25lIiwic3RvcCIsInJlbW92ZSIsImRyYWdnZWRFbGVtZW50IiwiZHJvcHpvbmVCb3giLCJhY3Rpb24iLCJwYXJlbnRzIiwibGVuZ3RoIiwiX3Bvc2l0aW9uRHJvcHpvbmVCb3giLCJkcm9wcGFibGUiLCJfZ2V0T2JqZWN0RnJvbUFjdGlvbiIsIl9zYXZlVG9GYXZvcml0ZXMiLCJsaW5rS2V5IiwiYWpheCIsInVybCIsImVycm9yIiwiY29uc29sZSIsInN1Y2Nlc3MiLCJfaXNMaW5rS2V5SW5GYXZvcml0ZXMiLCIkbmV3TGluayIsImNsb25lIiwiJG5ld0xpc3RJdGVtIiwiYXBwZW5kIiwiX2RlbGV0ZUZyb21GYXZvcml0ZXMiLCJwYXJlbnQiLCJkcm9wcGFibGVPcHRpb25zIiwiYWNjZXB0IiwidG9sZXJhbmNlIiwib3ZlciIsImNzcyIsIm91dCIsImRyb3AiLCJhdHRyIiwiJGRyb3B6b25lQm94IiwicHJlcGVuZCIsImRyb3B6b25lQm94SGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJ0b3AiLCJwb3NpdGlvbiIsIl90b2dnbGVBY3RpdmVNZW51R3JvdXAiLCJjdXJyZW50VXJsUGFyYW1ldGVycyIsImRlcGFyYW0iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInNlYXJjaCIsInNsaWNlIiwiZWFjaCIsImluZGV4IiwibGluayIsImxpbmtVcmxQYXJhbWV0ZXJzIiwicmVwbGFjZSIsImRvIiwibmF2SXRlbSIsIiRuYXZJdGVtIiwibmF2SXRlbVVybCIsIiRsaW5rIiwibGlua1VybCIsInNwbGl0IiwicG9wIiwiY3VycmVudENvbnRyb2xsZXJOYW1lIiwiX2dldENvbnRyb2xsZXJOYW1lIiwibGlua0NvbnRyb2xsZXJOYW1lIiwidW5kZWZpbmVkIiwiX3JlZ2lzdGVyU2hvcnRjdXQiLCJsaWIiLCJsaWJzIiwic2hvcnRjdXRzIiwibmFtZSIsImNhbGxiYWNrIiwiZXEiLCJvcGVuIiwiZmlyc3RLZXlDb2RlIiwiS0VZX0NPREVTIiwiTlVNXzEiLCJpdGVyYXRpb24iLCJjb21iaW5hdGlvbiIsIkNUUkxfTCIsIlNISUZUX0wiLCJyZWdpc3RlclNob3J0Y3V0IiwiaW5kZXhPZiIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksTUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgsK0NBRU9ELElBQUlDLE1BRlgsOENBR09ELElBQUlDLE1BSFgsbURBSUksNEJBSkosRUFLT0osR0FBR0ksTUFMVixxQkFISixFQVdJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNTCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTU0sUUFBUUYsTUFBTUcsUUFBTixDQUFlLElBQWYsQ0FBZDs7QUFFQTs7Ozs7Ozs7QUFRQSxRQUFJQyxXQUFXLElBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsaUJBQWlCTCxNQUFNTSxJQUFOLENBQVcsT0FBWCxFQUFvQkMsS0FBcEIsRUFBdkI7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsc0JBQXNCUixNQUFNTSxJQUFOLENBQVcsZ0JBQVgsQ0FBNUI7O0FBRUE7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LE1BQXNCLENBQUMsQ0FBL0IsR0FBbUMvQixLQUFLUyxLQUFMLENBQVcsR0FBWCxFQUFnQixDQUFoQixDQUFuQyxHQUF3RFQsSUFBL0Q7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUF0RSxXQUFPc0csSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJ4RixnQ0FBd0JILG1CQUF4QjtBQUNBaUQ7QUFDQXdCOztBQUVBa0I7QUFDSCxLQU5EOztBQVFBLFdBQU92RyxNQUFQO0FBQ0gsQ0E5V0wiLCJmaWxlIjoibGF5b3V0cy9tYWluL21lbnUvbWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gbWVudS5qcyAyMDE3LTA1LTMwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBNYWluIE1lbnUgQ29udHJvbGxlclxuICpcbiAqIFdoZW5ldmVyIHRoZSB1c2VyIGNsaWNrcyBvbiBhIG1lbnUgaXRlbSB0aGUgYnJvd3NlciBtdXN0IGJlIHJlZGlyZWN0ZWQgdG8gdGhlIHJlc3BlY3RpdmUgbG9jYXRpb24uXG4gKlxuICogTWlkZGxlIGJ1dHRvbiBjbGlja3MgYXJlIGFsc28gc3VwcG9ydGVkLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ21lbnUnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5qc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9qcXVlcnktZGVwYXJhbS9qcXVlcnktZGVwYXJhbS5taW4uanNgLFxuICAgICAgICAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvc2hvcnRjdXRzYFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTWVudSBMaXN0IFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkbGlzdCA9ICR0aGlzLmNoaWxkcmVuKCd1bCcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdWItbGlzdCBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG9iamVjdCBpcyB1c2VkIGZvciBjb3JyZWN0bHkgZGlzcGxheWluZyB0aGUgc3ViLWxpc3QgPHVsPiBlbGVtZW50IHdoZW5ldmVyIGl0IGdvZXMgb3V0XG4gICAgICAgICAqIG9mIHZpZXdwb3J0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0ICRzdWJsaXN0ID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmF2b3JpdGVzIEJveFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGZhdm9yaXRlc01lbnUgPSAkdGhpcy5maW5kKCd1bCBsaScpLmZpcnN0KCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERyYWdnYWJsZSBNZW51IEl0ZW1zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkZHJhZ2dhYmxlTWVudUl0ZW1zID0gJHRoaXMuZmluZCgnLmZhdi1kcmFnLWl0ZW0nKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJvcHpvbmUgQm94XG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSBkcmFnZ2FibGUgZWxlbWVudHMgd2lsbCBiZSBwbGFjZWQgaGVyZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGZhdkRyb3B6b25lQm94ID0gJyNmYXYtZHJvcHpvbmUtYm94JztcblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhZyBhbmQgZHJvcCBmbGFnIHRvIHByZXZlbnQgdGhlIGRlZmF1bHQgYWN0aW9uIG9mIGEgbWVudSBpdGVtIHdoZW4gaXQgaXMgZHJhZ2dlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59IFRydWUgd2hpbGUgYW0gaXRlbSBpcyBkcmFnZ2VkLlxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IG9uRHJhZ0FuZERyb3AgPSBmYWxzZTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYWtlcyBhbGwgbWVudSBpdGVtcyBkcmFnZ2FibGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgZnVuY3Rpb24gc2hvdWxkIGJlIGV4ZWN1dGVkIGluIHRoZSBtb2R1bGUuaW5pdCgpIG1ldGhvZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9ICRkcmFnZ2FibGVNZW51SXRlbXMgTWVudSBpdGVtIGpRdWVyeSBzZWxlY3Rvci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9tYWtlTWVudUl0ZW1zRHJhZ2dhYmxlKCRkcmFnZ2FibGVNZW51SXRlbXMpIHtcbiAgICAgICAgICAgICRkcmFnZ2FibGVNZW51SXRlbXMuZHJhZ2dhYmxlKHtcbiAgICAgICAgICAgICAgICBoZWxwZXI6ICdjbG9uZScsIC8vIENsb25lIHRoZSBlbGVtZW50LCBkb24ndCBtb3ZlIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICAgICAgICAgICAgICBzdGFydDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBvbkRyYWdBbmREcm9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdWkuaGVscGVyLmFkZENsYXNzKCdjdXJyZW50bHlEcmFnZ2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIF9jcmVhdGVGYXZvcml0ZXNEcm9wem9uZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBvbkRyYWdBbmREcm9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICQoZmF2RHJvcHpvbmVCb3gpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgdGhlIGZhdm9yaXRlcyBib3gsIHdoZXJlIHRoZSBkcmFnZ2FibGUgaXRlbXMgY2FuIGJlIGRyb3BwZWQgb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGRyYWdnZWRFbGVtZW50IERyYWdnZWQgbWVudSBpdGVtLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUZhdm9yaXRlc0Ryb3B6b25lKGRyYWdnZWRFbGVtZW50KSB7XG4gICAgICAgICAgICBsZXQgZHJvcHpvbmVCb3ggPSAnJztcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSAnJztcblxuICAgICAgICAgICAgaWYgKCQoZHJhZ2dlZEVsZW1lbnQpLnBhcmVudHMoJ2xpJykuZmluZCgnLmZhLWhlYXJ0JykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZHJvcHpvbmVCb3ggPSBgXG5cdFx0XHRcdDxkaXYgaWQ9XCJmYXYtZHJvcHpvbmUtYm94XCIgY2xhc3M9XCJmYXYtYWRkXCI+XG5cdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1oZWFydFwiPjwvaT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRgO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICdzYXZlJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHJvcHpvbmVCb3ggPSBgXG5cdFx0XHRcdDxkaXYgaWQ9XCJmYXYtZHJvcHpvbmUtYm94XCIgY2xhc3M9XCJmYXYtZGVsZXRlXCI+XG5cdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT5cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRgO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICdkZWxldGUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfcG9zaXRpb25Ecm9wem9uZUJveChkcm9wem9uZUJveCwgZHJhZ2dlZEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAkKGZhdkRyb3B6b25lQm94KS5kcm9wcGFibGUoX2dldE9iamVjdEZyb21BY3Rpb24oYWN0aW9uLCBkcmFnZ2VkRWxlbWVudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0b3JlcyB0aGUgbWVudSBpdGVtIGFzIGEgZmF2b3JpdGUgaW4gdGhlIGRhdGFiYXNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbGlua0tleSBVbmlxdWUgbGluayBrZXkgZnJvbSB0aGUgbWVudSBpdGVtLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZHJhZ2dlZEVsZW1lbnQgRHJhZ2dlZCBtZW51IGl0ZW0uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2F2ZVRvRmF2b3JpdGVzKGxpbmtLZXksIGRyYWdnZWRFbGVtZW50KSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJ2FkbWluLnBocD9kbz1BZG1pbkZhdm9yaXRlc0FqYXgvQWRkTWVudUl0ZW0mbGlua19rZXk9JyArIGxpbmtLZXksXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBzYXZlIHRoZSBtZW51IGl0ZW0gd2l0aCB0aGUgbGluayBrZXk6ICcgKyBsaW5rS2V5KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9pc0xpbmtLZXlJbkZhdm9yaXRlcyhsaW5rS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJG5ld0xpbmsgPSAkKGRyYWdnZWRFbGVtZW50KS5jbG9uZSgpLmFkZENsYXNzKCdmYXYtZHJhZy1pdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCAkbmV3TGlzdEl0ZW0gPSAkKCc8bGkvPicpLmFwcGVuZCgkbmV3TGluayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJGZhdm9yaXRlc01lbnUuZmluZCgndWwnKS5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmYXZvcml0ZXNNZW51LmFwcGVuZCgkKCc8dWwvPicpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRmYXZvcml0ZXNNZW51LmZpbmQoJ3VsJykuYXBwZW5kKCRuZXdMaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbWFrZU1lbnVJdGVtc0RyYWdnYWJsZSgkbmV3TGlzdEl0ZW0uZmluZCgnLmZhdi1kcmFnLWl0ZW0nKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGVzIHRoZSBtZW51IGl0ZW0gYXMgYSBmYXZvcml0ZSBmcm9tIHRoZSBkYXRhYmFzZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmtLZXkgVW5pcXVlIGxpbmsga2V5IGZyb20gdGhlIG1lbnUgaXRlbS5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRyYWdnZWRFbGVtZW50IERyYWdnZWQgbWVudSBpdGVtLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2RlbGV0ZUZyb21GYXZvcml0ZXMobGlua0tleSwgZHJhZ2dlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnYWRtaW4ucGhwP2RvPUFkbWluRmF2b3JpdGVzQWpheC9SZW1vdmVNZW51SXRlbSZsaW5rX2tleT0nICsgbGlua0tleSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IHJlbW92ZSB0aGUgbWVudSBpdGVtIHdpdGggdGhlIGxpbmsga2V5OiAnICsgbGlua0tleSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgJChkcmFnZ2VkRWxlbWVudCkucGFyZW50KCdsaScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGZhdm9yaXRlc01lbnUuZmluZCgndWwnKS5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZhdm9yaXRlc01lbnUuZmluZCgndWwnKS5yZW1vdmUoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIGEgbWVudSBpdGVtIGlzIGFscmVhZHkgc3RvcmVkIGluIHRoZSBmYXZvcml0ZXMgbWVudS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmtLZXkgVW5pcXVlIGxpbmsga2V5IG9mIGEgbWVudSBpdGVtLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIG1lbnUgaXRlbSBpcyBhbHJlYWR5IHN0b3JlZCwgZWxzZSBmYWxzZSB3aWxsIGJlIHJldHVybmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2lzTGlua0tleUluRmF2b3JpdGVzKGxpbmtLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiAoJGZhdm9yaXRlc01lbnUuZmluZCgnIycgKyBsaW5rS2V5KS5sZW5ndGggIT09IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdldCBqUXVlcnlVSSBkcm9wcGFibGUgb3B0aW9ucyBvYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvbiBBY3Rpb24gdG8gZXhlY3V0ZSB2YWx1ZT1zYXZlfGRlbGV0ZS5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRyYWdnZWRFbGVtZW50IERyYWdnZWQgbWV1IGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0galF1ZXJ5VUkgZHJvcHBhYmxlIG9wdGlvbnMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0T2JqZWN0RnJvbUFjdGlvbihhY3Rpb24sIGRyYWdnZWRFbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBkcm9wcGFibGVPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGFjY2VwdDogJy5mYXYtZHJhZy1pdGVtJyxcbiAgICAgICAgICAgICAgICB0b2xlcmFuY2U6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAvLyBGdW5jdGlvbiB3aGVuIGhvdmVyaW5nIG92ZXIgdGhlIGZhdm9yaXRlcyBib3guXG4gICAgICAgICAgICAgICAgb3ZlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKGZhdkRyb3B6b25lQm94KS5jc3MoJ29wYWNpdHknLCAnMS4wJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyBGdW5jdGlvbiB3aGVuIGhvdmVyaW5nIG91dCBmcm9tIHRoZSBmYXZvcml0ZXMgYm94LlxuICAgICAgICAgICAgICAgIG91dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKGZhdkRyb3B6b25lQm94KS5jc3MoJ29wYWNpdHknLCAnMC45Jyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyBGdW5jdGlvbiB3aGVuIGRyb3BwaW5nIGFuIGVsZW1lbnQgb24gdGhlIGZhdm9yaXRlcyBib3guXG4gICAgICAgICAgICAgICAgZHJvcDogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGlua0tleSA9ICQodWkuZHJhZ2dhYmxlKS5hdHRyKCdpZCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09ICdzYXZlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NhdmVUb0Zhdm9yaXRlcyhsaW5rS2V5LCBkcmFnZ2VkRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAnZGVsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RlbGV0ZUZyb21GYXZvcml0ZXMobGlua0tleSwgZHJhZ2dlZEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGRyb3BwYWJsZU9wdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUG9zaXRpb25zIHRoZSBEcm9wem9uZUJveCBhdCB0aGUgY29ycmVjdCBwbGFjZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRyb3B6b25lQm94IERyb3B6b25lQm94IEhUTUwuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkcmFnZ2VkRWxlbWVudCBEcmFnZ2VkIG1lbnUgaXRlbS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9wb3NpdGlvbkRyb3B6b25lQm94KGRyb3B6b25lQm94LCBkcmFnZ2VkRWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgJGRyb3B6b25lQm94ID0gJChkcm9wem9uZUJveCk7XG5cbiAgICAgICAgICAgICQoZHJhZ2dlZEVsZW1lbnQpLnBhcmVudCgnbGknKS5wcmVwZW5kKCRkcm9wem9uZUJveCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRyb3B6b25lQm94SGVpZ2h0ID0gJGRyb3B6b25lQm94Lm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgICRkcm9wem9uZUJveC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogJChkcmFnZ2VkRWxlbWVudCkucG9zaXRpb24oKS50b3AgLSAoZHJvcHpvbmVCb3hIZWlnaHQgLyAyKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiB0aGUgYWN0aXZlIG1lbnUgZ3JvdXAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgZmluZCB0aGUgbWVudSBpdGVtIHRoYXQgY29udGFpbnMgdGhlIHNhbWUgXCJkb1wiIEdFVCBwYXJhbWV0ZXIgYW5kIHNldCB0aGUgXCJhY3RpdmVcIlxuICAgICAgICAgKiBjbGFzcyB0byBpdHMgcGFyZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3RvZ2dsZUFjdGl2ZU1lbnVHcm91cCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRVcmxQYXJhbWV0ZXJzID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpO1xuXG4gICAgICAgICAgICAkbGlzdC5maW5kKCdsaTpndCgwKSB1bCBsaSBhJykuZWFjaCgoaW5kZXgsIGxpbmspID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rVXJsUGFyYW1ldGVycyA9ICQuZGVwYXJhbSgkKGxpbmspLmF0dHIoJ2hyZWYnKS5yZXBsYWNlKC8uKihcXD8pLywgJyQxJykuc2xpY2UoMSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRVcmxQYXJhbWV0ZXJzLmxlbmd0aCA+IDAgJiYgbGlua1VybFBhcmFtZXRlcnMuZG8gPT09IGN1cnJlbnRVcmxQYXJhbWV0ZXJzLmRvKSB7XG4gICAgICAgICAgICAgICAgICAgICQobGluaykucGFyZW50cygnbGk6bHQoMiknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCRsaXN0LmZpbmQoJy5hY3RpdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG5vIG1hdGNoIHdhcyBmb3VuZCwgY2hlY2sgZm9yIHN1Yi1wYWdlIGxpbmtzIGluIGNvbnRlbnQgbmF2aWdhdGlvbi5cbiAgICAgICAgICAgICQoJyNtYWluLWNvbnRlbnQgLmNvbnRlbnQtbmF2aWdhdGlvbiAubmF2LWl0ZW0nKS5lYWNoKChpbmRleCwgbmF2SXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRuYXZJdGVtID0gJChuYXZJdGVtKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuYXZJdGVtVXJsID0gJG5hdkl0ZW0uZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgICRsaXN0LmZpbmQoJ2xpOmd0KDEpIGEnKS5lYWNoKChpbmRleCwgbGluaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkbGluayA9ICQobGluayk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtVcmwgPSAkbGluay5hdHRyKCdocmVmJykuc3BsaXQoJy8nKS5wb3AoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlua1VybCA9PT0gbmF2SXRlbVVybCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxpbmsucGFyZW50cygnbGk6bHQoMiknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoJGxpc3QuZmluZCgnLmFjdGl2ZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gbWF0Y2ggd2FzIGZvdW5kLCBvbmx5IGNoZWNrIGZvciB0aGUgY29udHJvbGxlciBuYW1lLlxuICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRyb2xsZXJOYW1lID0gX2dldENvbnRyb2xsZXJOYW1lKGN1cnJlbnRVcmxQYXJhbWV0ZXJzLmRvKTtcblxuICAgICAgICAgICAgJGxpc3QuZmluZCgnbGk6Z3QoMCkgdWwgbGkgYScpLmVhY2goKGluZGV4LCBsaW5rKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlua1VybFBhcmFtZXRlcnMgPSAkLmRlcGFyYW0oJChsaW5rKS5hdHRyKCdocmVmJykucmVwbGFjZSgvLiooXFw/KS8sICckMScpLnNsaWNlKDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rQ29udHJvbGxlck5hbWUgPSBfZ2V0Q29udHJvbGxlck5hbWUobGlua1VybFBhcmFtZXRlcnMuZG8pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gY3VycmVudENvbnRyb2xsZXJOYW1lICYmIGxpbmtDb250cm9sbGVyTmFtZSA9PT0gY3VycmVudENvbnRyb2xsZXJOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICQobGluaykucGFyZW50cygnbGk6bHQoMiknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWdpc3RlcnMgYSBzaG9ydGN1dCB0byBvcGVuIHRoZSBmYXZvcml0ZSBlbnRyaWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3JlZ2lzdGVyU2hvcnRjdXQoKSB7XG4gICAgICAgICAgICAvLyBTaG9ydGN1dCBsaWJyYXJ5IGFiYnJldmlhdGlvbi5cbiAgICAgICAgICAgIGNvbnN0IGxpYiA9IGpzZS5saWJzLnNob3J0Y3V0cztcblxuICAgICAgICAgICAgLy8gQ29tYmluYXRpb24gbmFtZS5cbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAnb3BlbkZhdm9yaXRlTWVudUVudHJ5JztcblxuICAgICAgICAgICAgLy8gQ2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGluZGV4ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBHZXQgbGluayBmcm9tIGZhdm9yaXRlIGVudHJ5LlxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmsgPSAkZmF2b3JpdGVzTWVudVxuICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdhJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgICAgICAgIC8vIE9wZW4gbGluayBpbiBzYW1lIHdpbmRvdy5cbiAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihsaW5rLCAnX3NlbGYnKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGluZyBvdmVyIGVhY2ggYWJvdmUgbnVtYmVyIGtleSBzdGFydGluZyB3aXRoICcxJyB1bnRpbCAnOScuXG4gICAgICAgICAgICBjb25zdCBmaXJzdEtleUNvZGUgPSBqc2UubGlicy5zaG9ydGN1dHMuS0VZX0NPREVTLk5VTV8xO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCA5OyBpdGVyYXRpb24rKykge1xuICAgICAgICAgICAgICAgIC8vIEtleSBjb21iaW5hdGlvbiAoQ1RSTCArIFNISUZUICsga2V5Q29kZSkuXG4gICAgICAgICAgICAgICAgY29uc3QgY29tYmluYXRpb24gPSBbbGliLktFWV9DT0RFUy5DVFJMX0wsIGxpYi5LRVlfQ09ERVMuU0hJRlRfTCwgZmlyc3RLZXlDb2RlICsgaXRlcmF0aW9uXTtcblxuICAgICAgICAgICAgICAgIC8vIFJlZ2lzdGVyIHNob3J0Y3V0LlxuICAgICAgICAgICAgICAgIGxpYi5yZWdpc3RlclNob3J0Y3V0KG5hbWUgKyBpdGVyYXRpb24sIGNvbWJpbmF0aW9uLCAoKSA9PiBjYWxsYmFjayhpdGVyYXRpb24pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIG9ubHkgdGhlIFBIUCBjb250cm9sbGVyIHZhbHVlIGZyb20gdGhlIHByb3ZpZGVkIGxpbmsuXG4gICAgICAgICAqXG4gICAgICAgICAqIEV4YW1wbGU6XG4gICAgICAgICAqICAgSW5wdXQ6IEdvb2dsZVNob3BwaW5nL2VkaXRTY2hlbWVcbiAgICAgICAgICogICBPdXRwdXQ6IEdvb2dsZVNob3BwaW5nXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsaW5rIGRvIHBhcmFtZXRlciBmcm9tIHRoZSBmZXRjaGVkIHdpbmRvdy5sb2NhdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldENvbnRyb2xsZXJOYW1lKGxpbmspIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rICYmIGxpbmsuaW5kZXhPZignLycpICE9PSAtMSA/IGxpbmsuc3BsaXQoJy8nKVswXSA6IGxpbms7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgX21ha2VNZW51SXRlbXNEcmFnZ2FibGUoJGRyYWdnYWJsZU1lbnVJdGVtcyk7XG4gICAgICAgICAgICBfdG9nZ2xlQWN0aXZlTWVudUdyb3VwKCk7XG4gICAgICAgICAgICBfcmVnaXN0ZXJTaG9ydGN1dCgpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
