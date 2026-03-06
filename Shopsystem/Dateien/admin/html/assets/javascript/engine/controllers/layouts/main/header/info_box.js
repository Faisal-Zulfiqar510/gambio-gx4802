'use strict';

/* --------------------------------------------------------------
 info_box.js 2016-11-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Infobox Controller
 *
 * Handles the functionality of the info box component of the admin layout pages.
 */
gx.controllers.module('info_box', ['loading_spinner', gx.source + '/libs/info_box'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    // Module element, which represents the info box.

    var $this = $(this);

    // Notification counter icon element.
    var $counter = $this.find('.notification-count');

    // Module default parameters.
    var defaults = {
        // Popover steady time.
        closeDelay: 5000,

        // Roll on/out animation duration.
        animationDuration: 600,

        // Default open mode on links.
        linkOpenMode: '_self'
    };

    // Module options.
    var options = $.extend(true, {}, defaults, data);

    // Shortcut to info box library.
    var library = jse.libs.info_box;

    // Shortcut to spinner library.
    var spinner = jse.libs.loading_spinner;

    // Shortcut to language text service.
    var translator = jse.core.lang;

    // CSS classes.
    var classes = {
        // Active state of the message list container (for the roll in/out animation).
        containerVisible: 'visible',

        // Hidden message item.
        hidden: 'hidden'
    };

    // Selector strings.
    var selectors = {
        // Message list container.
        container: '.popover.message-list-container',

        // Message list container arrow.
        arrow: '.arrow',

        // Message list.
        list: '.popover-content',

        // Message list visibility checkbox.
        checkbox: '.visibility-checkbox',

        // Message item.
        item: '.message',

        // Hidden message item.
        hiddenItem: '[data-status="hidden"]',

        // Message item button.
        itemButton: '.message-button',

        // Message item action (remove, hide, etc.).
        itemAction: '.action-icon'
    };

    // Module object.
    var module = {};

    // Indicates whether the roll animation is still running.
    var isAnimating = false;

    // Indicates whether the message item list container is shown for a certain duration
    // Happens on new messages after a silent refresh.
    var isShownWithCloseDelay = false;

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Returns a space-separated CSS class name by replacing the periods with spaces.
     *
     * @param className CSS class.
     *
     * @return {String} Class name without periods.
     */
    function _getClassNameWithoutPeriods(className) {
        return className.split('.').join(' ');
    }

    /**
     * Returns the markup for the popover template.
     *
     * @return {String} Generated HTML string.
     */
    function _getPopoverMarkup() {
        return '\n\t\t\t\t<div class="' + _getClassNameWithoutPeriods(selectors.container) + '" role="tooltip">\n\t\t\t\t\t<div class="' + _getClassNameWithoutPeriods(selectors.arrow) + '"></div>\n\t\t\t\t\t<div class="popover-title"></div>\n\t\t\t\t\t<div class="' + _getClassNameWithoutPeriods(selectors.list) + '"></div>\n\t\t\t\t</div>\n\t\t\t';
    }

    /**
     * Returns the generated markup for a message item.
     *
     * @param {Object} message Message item.
     *
     * @return {jQuery} Markup as jQuery object.
     */
    function _getMessageItemMarkup(message) {
        // Is the message an admin action success message?
        var isSuccessMessage = message.identifier && message.identifier.includes(library.SUCCESS_MSG_IDENTIFIER_PREFIX);

        // Is the message hideable but not removable?
        var isHideableMessage = !isSuccessMessage && message.visibility && message.visibility === library.VISIBILITY_HIDEABLE;

        // Is the message always visible?
        var isAlwaysOnMessage = !isSuccessMessage && message.visibility && message.visibility === library.VISIBILITY_ALWAYS_ON;

        // Message item markup.
        var markup = '\n\t\t\t\t<div\n\t\t\t\t\tclass="message ' + message.type + ' ' + (isSuccessMessage ? 'admin-action-success' : '') + '"\n\t\t\t\t\tdata-status="' + message.status + '"\n\t\t\t\t\tdata-id="' + message.id + '"\n\t\t\t\t\tdata-visibility="' + message.visibility + '"\n\t\t\t\t\tdata-identifier="' + message.identifier + '"\n\t\t\t\t\t>\n\t\t\t\t\t<div class="action-icons">\n\t\t\t\t\t\t<span class="' + _getClassNameWithoutPeriods(selectors.itemAction) + ' do-hide fa fa-minus"></span>\n\t\t\t\t\t\t<span class="' + _getClassNameWithoutPeriods(selectors.itemAction) + ' do-remove fa fa-times"></span>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="headline">\n\t\t\t\t\t\t' + message.headline + '\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="content">\n\t\t\t\t\t\t' + message.message + '\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<a class="btn ' + _getClassNameWithoutPeriods(selectors.itemButton) + '" href="' + message.buttonLink + '">\n\t\t\t\t\t\t' + message.buttonLabel + '\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t';

        // Markup as jQuery object for manipulation purposes.
        var $markup = $(markup);

        // Remove button from markup, if no button label is defined.
        if (!message.buttonLabel) {
            $markup.find(selectors.itemButton).remove();
        }

        // Show remove/hide button, depending on the visibility value and kind of message.
        if (isAlwaysOnMessage) {
            $markup.find('' + selectors.itemAction).remove();
        } else if (isHideableMessage) {
            $markup.find(selectors.itemAction + ' do-remove').remove();
        } else if (isSuccessMessage) {
            $markup.find(selectors.itemAction + ' do-hide').remove();
        }

        return $markup;
    }

    /**
     * Returns the markup for the message items visibility checkbox.
     *
     * @return {String} Generated HTML string.
     */
    function _getVisibilityCheckboxMarkup() {
        return '\n\t\t\t\t<div class="visibility-checkbox-container">\n\t\t\t\t\t<input type="checkbox" class="' + _getClassNameWithoutPeriods(selectors.checkbox) + '">\n\t\t\t\t\t<label class="visibility-checkbox-label">' + translator.translate('SHOW_ALL', 'admin_info_boxes') + '</label>\n\t\t\t\t</div>\n\t\t\t';
    }

    /**
     * Marks each visible message item as read.
     */
    function _markMessageItemsAsRead() {
        // Message items.
        var $messageList = $(selectors.container).find(selectors.item);

        // Iterate over each message and mark as read.
        $messageList.each(function (index, element) {
            // Current iteration element.
            var $message = $(element);

            // Message data.
            var data = $message.data();

            // Indicate, if the message is declared as hidden.
            var isHidden = $message.hasClass(library.STATUS_HIDDEN);

            // Delete by ID if existent.
            if (!isHidden && data.id) {
                library.setStatus(data.id, library.STATUS_READ);
                $message.data('status', library.STATUS_READ);
            }

            // Delete success messages.
            if (data.identifier && data.identifier.includes(library.SUCCESS_MSG_IDENTIFIER_PREFIX)) {
                library.deleteByIdentifier(data.identifier);
            }
        });
    }

    /**
     * Sets the message item amount in the notification icon.
     *
     * Admin action success messages will be excluded.
     *
     * @param {Array} messages Message items.
     */
    function _setMessageCounter(messages) {
        // Hidden CSS class.
        var hiddenClass = 'hidden';

        // Message item count.
        var count = 0;

        // Iterate over each message item and check message identifier.
        if (messages.length) {
            messages.forEach(function (message) {
                return count = message.identifier.includes(library.SUCCESS_MSG_IDENTIFIER_PREFIX) ? count : ++count;
            });
        }

        // The notification count will be hidden, if there are no messages.
        if (count) {
            $counter.removeClass(hiddenClass).text(count);
        } else {
            $counter.addClass(hiddenClass);
        }
    }

    /**
     * Handles the click event on the info box action button.
     */
    function _onClick() {
        _toggleContainer(!$(selectors.container).length);
    }

    /**
     * Toggles the message list container (popover) with an animation.
     *
     * @param {Boolean} doShow Show the message list container?
     */
    function _toggleContainer(doShow) {
        // Exit immediately when the animation process is still running.
        if (isAnimating) {
            return;
        }

        // Indicate animation process.
        isAnimating = true;

        // Switch animation process indicator to false after animation duration.
        setTimeout(function () {
            return isAnimating = false;
        }, options.animationDuration);

        if (doShow) {
            // Perform message item list container roll in animation.
            $this.popover('show');
        } else {
            // Perform message item list container roll out animation and then hide.
            $(selectors.container).removeClass(classes.containerVisible);
            setTimeout(function () {
                return $this.popover('hide');
            }, options.animationDuration);
        }
    }

    /**
     * Handles the popover (message container) 'shown' event by getting the messages from the server
     * and displaying them in the container.
     */
    function _onPopoverShown() {
        // Message list container.
        var $container = $(selectors.container);

        // Indicate container visibility.
        $container.addClass(classes.containerVisible).css({ top: $container.height() * -1 });

        // Fix container and arrow position.
        _fixPositions();

        // Enable loading state.
        _toggleLoading(true);

        // Retrieve messages from server and show them in the container and mark them as read.
        library.getMessages().then(function (messages) {
            // Disable loading state.
            _toggleLoading(false);

            // Put messages into message list.
            _putMessagesIntoContainer(messages);

            // Hide hidden message items and show only the success message item if exists.
            _reviseMessageItemList();

            // Set notification count.
            _setMessageCounter(messages);

            // Mark visible message items as read.
            _markMessageItemsAsRead();
        });

        // Attach event handlers to popover.
        $container.off('click change').on('click', selectors.itemButton, _onMessageItemButtonClick).on('click', selectors.itemAction, _onMessageItemActionClick).on('change', selectors.checkbox, _onVisibilityCheckboxChange);
    }

    /**
     * Toggles the hidden message items.
     *
     * @param {Boolean} doShow Show the hidden message items?
     */
    function _toggleHiddenMessageItems(doShow) {
        // Message list container.
        var $container = $(selectors.container);

        // Hidden message items.
        var $hiddenMessageItems = $container.find(selectors.item).filter(selectors.hiddenItem);

        // Toggle visibility.
        if (doShow) {
            $hiddenMessageItems.removeClass(classes.hidden);
        } else {
            $hiddenMessageItems.addClass(classes.hidden);
        }
    }

    /**
     * Revises the message item list by hiding message items declared as hidden.
     *
     * Additionally, if an admin action success message item is found it will be solely displayed.
     */
    function _reviseMessageItemList() {
        // Message list container.
        var $container = $(selectors.container);

        // Message list.
        var $messageList = $container.find(selectors.list);

        // Message items.
        var $messageItems = $messageList.find(selectors.item);

        // Hidden message items.
        var $hiddenMessageItems = $messageItems.filter(selectors.hiddenItem);

        // Admin action success message items.
        var $successMessageItems = $messageItems.filter('[data-identifier*=' + library.SUCCESS_MSG_IDENTIFIER_PREFIX + ']');

        // Hide messages declared as hidden and add visibility checkbox.
        if ($hiddenMessageItems.length) {
            _toggleHiddenMessageItems(false);
            $messageList.append(_getVisibilityCheckboxMarkup());
        }

        // Remove all other messages (including duplicate success messages) if a success message is present.
        if ($successMessageItems.length) {
            $messageItems.not($successMessageItems.first()).hide();
        }
    }

    /**
     * Fills the message list with message items.
     *
     * @param {Array} messages Message items.
     */
    function _putMessagesIntoContainer(messages) {
        // Message list container.
        var $container = $(selectors.container);

        // Message list.
        var $messageList = $container.find(selectors.list);

        // Array containing all generated message item markups.
        var messageItemsMarkups = [];

        // Clear message list.
        $messageList.empty();

        // Show messages.
        if (messages.length) {
            // Iterate over each message item and generate markups.
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var message = _step.value;

                    // Generate markup.
                    var $markup = _getMessageItemMarkup(message);

                    // Add markup to array.
                    messageItemsMarkups.push($markup);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else {
            // Generate markup for the missing entries info message item.
            var $noEntriesMessageItemMarkup = _getMessageItemMarkup({
                message: translator.translate('NO_MESSAGES', 'admin_info_boxes'),
                visibility: library.VISIBILITY_ALWAYS_ON,
                status: library.STATUS_READ,
                headline: '',
                type: '',
                id: '',
                identifier: ''
            });

            // Add markup to array.
            messageItemsMarkups.push($noEntriesMessageItemMarkup);
        }

        // Put render messages.
        messageItemsMarkups.forEach(function (element) {
            return $messageList.append(element);
        });

        // Fade the message items in smoothly.
        $messageList.children().each(function (index, element) {
            return $(element).hide().fadeIn();
        });
    }

    /**
     * Handles the click event to a message item button by opening the link.
     */
    function _onMessageItemButtonClick(event) {
        // Prevent default behavior.
        event.preventDefault();
        event.stopPropagation();

        // Link value from button.
        var href = $(this).attr('href');

        // Check if we need to perform a special action.
        var $message = $(this).parents('.message');

        switch ($message.data('identifier')) {
            case 'clear_cache':
                $.get(href).done(function (response) {
                    library.addSuccessMessage(response);
                });
                break;
            default:
                // Open link if exists.
                if (href && href.trim().length) {
                    window.open(href, options.linkOpenMode);
                }
        }
    }

    /**
     * Handles the click event to a message item action.
     */
    function _onMessageItemActionClick() {
        // Clicked element.
        var $element = $(this);

        // Check if the clicked target indicates a message removal.
        var doRemove = $element.hasClass('do-remove');

        // ID of the message taken from the message item element.
        var id = $element.parents(selectors.item).data('id');

        // Delete/hide message depending on the clicked target.
        if (doRemove) {
            _deleteMessage(id);
        } else {
            _hideMessage(id);
        }
    }

    /**
     * Handles click event on the entire document.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onWindowClick(event) {
        // Clicked target.
        var $target = $(event.target);

        // Message list item container.
        var $container = $(selectors.container);

        // Conditions.
        var isClickedOnButton = $this.has($target).length || $this.is($target).length;
        var isContainerShown = $container.length;
        var isClickedOutsideOfPopover = !$container.has($target).length;

        // Only hide container, if clicked target is not within the container area.
        if (isClickedOutsideOfPopover && isContainerShown && !isClickedOnButton && !isShownWithCloseDelay) {
            _toggleContainer(false);
        }
    }

    /**
     * Fixes the container and arrow positions.
     */
    function _fixPositions() {
        // Offset correction values.
        var ARROW_OFFSET = 240;
        var POPOVER_OFFSET = 250;

        // Message list container (popover).
        var $container = $(selectors.container);

        // Arrow.
        var $arrow = $container.find(selectors.arrow);

        // Fix the offset for the affected elements, if popover is open.
        if ($container.length) {
            var arrowOffset = $container.offset().left + ARROW_OFFSET;
            var popoverOffset = $this.offset().left - POPOVER_OFFSET + $this.width() / 2;

            $arrow.offset({ left: arrowOffset });
            $container.offset({ left: popoverOffset });
        }
    }

    /**
     * Handles the visibility checkbox change event.
     */
    function _onVisibilityCheckboxChange() {
        // Indicates whether the checkbox is checked.
        var isCheckboxChecked = $(this).is(':checked');

        // Toggle hidden messages and mark shown messages as read.
        _toggleHiddenMessageItems(isCheckboxChecked);
        _markMessageItemsAsRead();
    }

    /**
     * Deletes a message item and refreshes the message item list.
     *
     * @param {Number} id Message ID.
     */
    function _deleteMessage(id) {
        library.deleteById(id).then(_refresh);
    }

    /**
     * Hides a message item and refreshes the message item list.
     *
     * @param {Number} id Message ID.
     */
    function _hideMessage(id) {
        library.setStatus(id, library.STATUS_HIDDEN).then(_refresh);
    }

    /**
     * Refreshes the message item list.
     */
    function _refresh() {
        // Message list container.
        var $container = $(selectors.container);

        // Show loading spinner on the message container.
        var $spinner = spinner.show($container, 9999);

        // Refresh list.
        _onPopoverShown();

        // Hide loading spinner.
        spinner.hide($spinner);
    }

    /**
     * Retrieves the messages and displays the popover if there are new messages.
     */
    function _refreshSilently() {
        // Retrieve messages from server and update the notification count.
        // Popover will we displayed if there is a new message.
        library.getMessages().then(function (messages) {
            // Set notification count.
            _setMessageCounter(messages);

            // Iterate over messages and try to find a message item declared as new.
            // If found, the container will be opened.
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var message = _step2.value;

                    if (message.status === library.STATUS_NEW) {
                        // Exit immediately when the animation process is still running
                        // or if the message list item container is already shown with a defined duration.
                        if (isAnimating || isShownWithCloseDelay) {
                            return;
                        }

                        // Open message item list container.
                        _toggleContainer(true);

                        // Indicate delayed closing.
                        isShownWithCloseDelay = true;

                        // Hide container and indicate delayed closing finish.
                        setTimeout(function () {
                            _toggleContainer(false);
                            isShownWithCloseDelay = false;
                        }, options.closeDelay);

                        break;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        });
    }

    /**
     * Toggles the loading state.
     *
     * @param {Boolean} isLoading Is the load process running?
     */
    function _toggleLoading(isLoading) {
        // Loading message class.
        var loadingMessageClass = '.loading';

        // Message item list container.
        var $messageList = $(selectors.container).find(selectors.list);

        // Loading message element.
        var $loadingMessage = $messageList.find(loadingMessageClass);

        // Loading message markup.
        var markup = '\n\t\t\t\t<div class="' + _getClassNameWithoutPeriods(loadingMessageClass) + '">\n\t\t\t\t\t' + translator.translate('LOADING', 'admin_info_boxes') + '\n\t\t\t\t</div>\n\t\t\t';

        // Remove existing loading message.
        $loadingMessage.remove();

        // Add new loading message if parameter is true.
        if (isLoading) {
            $messageList.append($(markup));
        }
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    // Module initialize function.
    module.init = function (done) {
        // Initialize popover plugin and attach event handlers.
        $this.popover({
            animation: false,
            placement: 'bottom',
            content: ' ',
            trigger: 'manual',
            template: _getPopoverMarkup()
        }).on('click', _onClick).on('shown.bs.popover', _onPopoverShown).on('show:popover', function () {
            return _toggleContainer(true);
        }).on('refresh:messages', _refreshSilently);

        // Attach event listeners to the window.
        $(window).on('resize', _fixPositions).on('click', _onWindowClick);

        // Initial message check.
        _refreshSilently();

        // Finish initialization.
        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9oZWFkZXIvaW5mb19ib3guanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkY291bnRlciIsImZpbmQiLCJkZWZhdWx0cyIsImNsb3NlRGVsYXkiLCJhbmltYXRpb25EdXJhdGlvbiIsImxpbmtPcGVuTW9kZSIsIm9wdGlvbnMiLCJleHRlbmQiLCJsaWJyYXJ5IiwianNlIiwibGlicyIsImluZm9fYm94Iiwic3Bpbm5lciIsImxvYWRpbmdfc3Bpbm5lciIsInRyYW5zbGF0b3IiLCJjb3JlIiwibGFuZyIsImNsYXNzZXMiLCJjb250YWluZXJWaXNpYmxlIiwiaGlkZGVuIiwic2VsZWN0b3JzIiwiY29udGFpbmVyIiwiYXJyb3ciLCJsaXN0IiwiY2hlY2tib3giLCJpdGVtIiwiaGlkZGVuSXRlbSIsIml0ZW1CdXR0b24iLCJpdGVtQWN0aW9uIiwiaXNBbmltYXRpbmciLCJpc1Nob3duV2l0aENsb3NlRGVsYXkiLCJfZ2V0Q2xhc3NOYW1lV2l0aG91dFBlcmlvZHMiLCJjbGFzc05hbWUiLCJzcGxpdCIsImpvaW4iLCJfZ2V0UG9wb3Zlck1hcmt1cCIsIl9nZXRNZXNzYWdlSXRlbU1hcmt1cCIsIm1lc3NhZ2UiLCJpc1N1Y2Nlc3NNZXNzYWdlIiwiaWRlbnRpZmllciIsImluY2x1ZGVzIiwiU1VDQ0VTU19NU0dfSURFTlRJRklFUl9QUkVGSVgiLCJpc0hpZGVhYmxlTWVzc2FnZSIsInZpc2liaWxpdHkiLCJWSVNJQklMSVRZX0hJREVBQkxFIiwiaXNBbHdheXNPbk1lc3NhZ2UiLCJWSVNJQklMSVRZX0FMV0FZU19PTiIsIm1hcmt1cCIsInR5cGUiLCJzdGF0dXMiLCJpZCIsImhlYWRsaW5lIiwiYnV0dG9uTGluayIsImJ1dHRvbkxhYmVsIiwiJG1hcmt1cCIsInJlbW92ZSIsIl9nZXRWaXNpYmlsaXR5Q2hlY2tib3hNYXJrdXAiLCJ0cmFuc2xhdGUiLCJfbWFya01lc3NhZ2VJdGVtc0FzUmVhZCIsIiRtZXNzYWdlTGlzdCIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiLCIkbWVzc2FnZSIsImlzSGlkZGVuIiwiaGFzQ2xhc3MiLCJTVEFUVVNfSElEREVOIiwic2V0U3RhdHVzIiwiU1RBVFVTX1JFQUQiLCJkZWxldGVCeUlkZW50aWZpZXIiLCJfc2V0TWVzc2FnZUNvdW50ZXIiLCJtZXNzYWdlcyIsImhpZGRlbkNsYXNzIiwiY291bnQiLCJsZW5ndGgiLCJmb3JFYWNoIiwicmVtb3ZlQ2xhc3MiLCJ0ZXh0IiwiYWRkQ2xhc3MiLCJfb25DbGljayIsIl90b2dnbGVDb250YWluZXIiLCJkb1Nob3ciLCJzZXRUaW1lb3V0IiwicG9wb3ZlciIsIl9vblBvcG92ZXJTaG93biIsIiRjb250YWluZXIiLCJjc3MiLCJ0b3AiLCJoZWlnaHQiLCJfZml4UG9zaXRpb25zIiwiX3RvZ2dsZUxvYWRpbmciLCJnZXRNZXNzYWdlcyIsInRoZW4iLCJfcHV0TWVzc2FnZXNJbnRvQ29udGFpbmVyIiwiX3JldmlzZU1lc3NhZ2VJdGVtTGlzdCIsIm9mZiIsIm9uIiwiX29uTWVzc2FnZUl0ZW1CdXR0b25DbGljayIsIl9vbk1lc3NhZ2VJdGVtQWN0aW9uQ2xpY2siLCJfb25WaXNpYmlsaXR5Q2hlY2tib3hDaGFuZ2UiLCJfdG9nZ2xlSGlkZGVuTWVzc2FnZUl0ZW1zIiwiJGhpZGRlbk1lc3NhZ2VJdGVtcyIsImZpbHRlciIsIiRtZXNzYWdlSXRlbXMiLCIkc3VjY2Vzc01lc3NhZ2VJdGVtcyIsImFwcGVuZCIsIm5vdCIsImZpcnN0IiwiaGlkZSIsIm1lc3NhZ2VJdGVtc01hcmt1cHMiLCJlbXB0eSIsInB1c2giLCIkbm9FbnRyaWVzTWVzc2FnZUl0ZW1NYXJrdXAiLCJjaGlsZHJlbiIsImZhZGVJbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJocmVmIiwiYXR0ciIsInBhcmVudHMiLCJnZXQiLCJkb25lIiwiYWRkU3VjY2Vzc01lc3NhZ2UiLCJyZXNwb25zZSIsInRyaW0iLCJ3aW5kb3ciLCJvcGVuIiwiJGVsZW1lbnQiLCJkb1JlbW92ZSIsIl9kZWxldGVNZXNzYWdlIiwiX2hpZGVNZXNzYWdlIiwiX29uV2luZG93Q2xpY2siLCIkdGFyZ2V0IiwidGFyZ2V0IiwiaXNDbGlja2VkT25CdXR0b24iLCJoYXMiLCJpcyIsImlzQ29udGFpbmVyU2hvd24iLCJpc0NsaWNrZWRPdXRzaWRlT2ZQb3BvdmVyIiwiQVJST1dfT0ZGU0VUIiwiUE9QT1ZFUl9PRkZTRVQiLCIkYXJyb3ciLCJhcnJvd09mZnNldCIsIm9mZnNldCIsImxlZnQiLCJwb3BvdmVyT2Zmc2V0Iiwid2lkdGgiLCJpc0NoZWNrYm94Q2hlY2tlZCIsImRlbGV0ZUJ5SWQiLCJfcmVmcmVzaCIsIiRzcGlubmVyIiwic2hvdyIsIl9yZWZyZXNoU2lsZW50bHkiLCJTVEFUVVNfTkVXIiwiaXNMb2FkaW5nIiwibG9hZGluZ01lc3NhZ2VDbGFzcyIsIiRsb2FkaW5nTWVzc2FnZSIsImluaXQiLCJhbmltYXRpb24iLCJwbGFjZW1lbnQiLCJjb250ZW50IiwidHJpZ2dlciIsInRlbXBsYXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFVBREosRUFHSSxDQUNJLGlCQURKLEVBRU9GLEdBQUdHLE1BRlYsb0JBSEosRUFRSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTtBQUNBLFFBQU1DLFdBQVdGLE1BQU1HLElBQU4sQ0FBVyxxQkFBWCxDQUFqQjs7QUFFQTtBQUNBLFFBQU1DLFdBQVc7QUFDYjtBQUNBQyxvQkFBWSxJQUZDOztBQUliO0FBQ0FDLDJCQUFtQixHQUxOOztBQU9iO0FBQ0FDLHNCQUFjO0FBUkQsS0FBakI7O0FBV0E7QUFDQSxRQUFNQyxVQUFVUCxFQUFFUSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYs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QUFDQSxXQUFPL0gsTUFBUDtBQUNILENBOXJCTCIsImZpbGUiOiJsYXlvdXRzL21haW4vaGVhZGVyL2luZm9fYm94LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbmZvX2JveC5qcyAyMDE2LTExLTEwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBJbmZvYm94IENvbnRyb2xsZXJcbiAqXG4gKiBIYW5kbGVzIHRoZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBpbmZvIGJveCBjb21wb25lbnQgb2YgdGhlIGFkbWluIGxheW91dCBwYWdlcy5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdpbmZvX2JveCcsXG5cbiAgICBbXG4gICAgICAgICdsb2FkaW5nX3NwaW5uZXInLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19ib3hgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIE1vZHVsZSBlbGVtZW50LCB3aGljaCByZXByZXNlbnRzIHRoZSBpbmZvIGJveC5cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIE5vdGlmaWNhdGlvbiBjb3VudGVyIGljb24gZWxlbWVudC5cbiAgICAgICAgY29uc3QgJGNvdW50ZXIgPSAkdGhpcy5maW5kKCcubm90aWZpY2F0aW9uLWNvdW50Jyk7XG5cbiAgICAgICAgLy8gTW9kdWxlIGRlZmF1bHQgcGFyYW1ldGVycy5cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAvLyBQb3BvdmVyIHN0ZWFkeSB0aW1lLlxuICAgICAgICAgICAgY2xvc2VEZWxheTogNTAwMCxcblxuICAgICAgICAgICAgLy8gUm9sbCBvbi9vdXQgYW5pbWF0aW9uIGR1cmF0aW9uLlxuICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDYwMCxcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCBvcGVuIG1vZGUgb24gbGlua3MuXG4gICAgICAgICAgICBsaW5rT3Blbk1vZGU6ICdfc2VsZidcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNb2R1bGUgb3B0aW9ucy5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLy8gU2hvcnRjdXQgdG8gaW5mbyBib3ggbGlicmFyeS5cbiAgICAgICAgY29uc3QgbGlicmFyeSA9IGpzZS5saWJzLmluZm9fYm94O1xuXG4gICAgICAgIC8vIFNob3J0Y3V0IHRvIHNwaW5uZXIgbGlicmFyeS5cbiAgICAgICAgY29uc3Qgc3Bpbm5lciA9IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lcjtcblxuICAgICAgICAvLyBTaG9ydGN1dCB0byBsYW5ndWFnZSB0ZXh0IHNlcnZpY2UuXG4gICAgICAgIGNvbnN0IHRyYW5zbGF0b3IgPSBqc2UuY29yZS5sYW5nO1xuXG4gICAgICAgIC8vIENTUyBjbGFzc2VzLlxuICAgICAgICBjb25zdCBjbGFzc2VzID0ge1xuICAgICAgICAgICAgLy8gQWN0aXZlIHN0YXRlIG9mIHRoZSBtZXNzYWdlIGxpc3QgY29udGFpbmVyIChmb3IgdGhlIHJvbGwgaW4vb3V0IGFuaW1hdGlvbikuXG4gICAgICAgICAgICBjb250YWluZXJWaXNpYmxlOiAndmlzaWJsZScsXG5cbiAgICAgICAgICAgIC8vIEhpZGRlbiBtZXNzYWdlIGl0ZW0uXG4gICAgICAgICAgICBoaWRkZW46ICdoaWRkZW4nXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gU2VsZWN0b3Igc3RyaW5ncy5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBsaXN0IGNvbnRhaW5lci5cbiAgICAgICAgICAgIGNvbnRhaW5lcjogJy5wb3BvdmVyLm1lc3NhZ2UtbGlzdC1jb250YWluZXInLFxuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QgY29udGFpbmVyIGFycm93LlxuICAgICAgICAgICAgYXJyb3c6ICcuYXJyb3cnLFxuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QuXG4gICAgICAgICAgICBsaXN0OiAnLnBvcG92ZXItY29udGVudCcsXG5cbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgbGlzdCB2aXNpYmlsaXR5IGNoZWNrYm94LlxuICAgICAgICAgICAgY2hlY2tib3g6ICcudmlzaWJpbGl0eS1jaGVja2JveCcsXG5cbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgaXRlbS5cbiAgICAgICAgICAgIGl0ZW06ICcubWVzc2FnZScsXG5cbiAgICAgICAgICAgIC8vIEhpZGRlbiBtZXNzYWdlIGl0ZW0uXG4gICAgICAgICAgICBoaWRkZW5JdGVtOiAnW2RhdGEtc3RhdHVzPVwiaGlkZGVuXCJdJyxcblxuICAgICAgICAgICAgLy8gTWVzc2FnZSBpdGVtIGJ1dHRvbi5cbiAgICAgICAgICAgIGl0ZW1CdXR0b246ICcubWVzc2FnZS1idXR0b24nLFxuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGl0ZW0gYWN0aW9uIChyZW1vdmUsIGhpZGUsIGV0Yy4pLlxuICAgICAgICAgICAgaXRlbUFjdGlvbjogJy5hY3Rpb24taWNvbidcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNb2R1bGUgb2JqZWN0LlxuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcm9sbCBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZy5cbiAgICAgICAgbGV0IGlzQW5pbWF0aW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1lc3NhZ2UgaXRlbSBsaXN0IGNvbnRhaW5lciBpcyBzaG93biBmb3IgYSBjZXJ0YWluIGR1cmF0aW9uXG4gICAgICAgIC8vIEhhcHBlbnMgb24gbmV3IG1lc3NhZ2VzIGFmdGVyIGEgc2lsZW50IHJlZnJlc2guXG4gICAgICAgIGxldCBpc1Nob3duV2l0aENsb3NlRGVsYXkgPSBmYWxzZTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhIHNwYWNlLXNlcGFyYXRlZCBDU1MgY2xhc3MgbmFtZSBieSByZXBsYWNpbmcgdGhlIHBlcmlvZHMgd2l0aCBzcGFjZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBjbGFzc05hbWUgQ1NTIGNsYXNzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IENsYXNzIG5hbWUgd2l0aG91dCBwZXJpb2RzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldENsYXNzTmFtZVdpdGhvdXRQZXJpb2RzKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZS5zcGxpdCgnLicpLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBtYXJrdXAgZm9yIHRoZSBwb3BvdmVyIHRlbXBsYXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IEdlbmVyYXRlZCBIVE1MIHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRQb3BvdmVyTWFya3VwKCkge1xuICAgICAgICAgICAgcmV0dXJuIGBcblx0XHRcdFx0PGRpdiBjbGFzcz1cIiR7X2dldENsYXNzTmFtZVdpdGhvdXRQZXJpb2RzKHNlbGVjdG9ycy5jb250YWluZXIpfVwiIHJvbGU9XCJ0b29sdGlwXCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cIiR7X2dldENsYXNzTmFtZVdpdGhvdXRQZXJpb2RzKHNlbGVjdG9ycy5hcnJvdyl9XCI+PC9kaXY+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiJHtfZ2V0Q2xhc3NOYW1lV2l0aG91dFBlcmlvZHMoc2VsZWN0b3JzLmxpc3QpfVwiPjwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdGA7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZ2VuZXJhdGVkIG1hcmt1cCBmb3IgYSBtZXNzYWdlIGl0ZW0uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtZXNzYWdlIE1lc3NhZ2UgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fSBNYXJrdXAgYXMgalF1ZXJ5IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRNZXNzYWdlSXRlbU1hcmt1cChtZXNzYWdlKSB7XG4gICAgICAgICAgICAvLyBJcyB0aGUgbWVzc2FnZSBhbiBhZG1pbiBhY3Rpb24gc3VjY2VzcyBtZXNzYWdlP1xuICAgICAgICAgICAgY29uc3QgaXNTdWNjZXNzTWVzc2FnZSA9IG1lc3NhZ2UuaWRlbnRpZmllclxuICAgICAgICAgICAgICAgICYmIG1lc3NhZ2UuaWRlbnRpZmllci5pbmNsdWRlcyhsaWJyYXJ5LlNVQ0NFU1NfTVNHX0lERU5USUZJRVJfUFJFRklYKTtcblxuICAgICAgICAgICAgLy8gSXMgdGhlIG1lc3NhZ2UgaGlkZWFibGUgYnV0IG5vdCByZW1vdmFibGU/XG4gICAgICAgICAgICBjb25zdCBpc0hpZGVhYmxlTWVzc2FnZSA9ICFpc1N1Y2Nlc3NNZXNzYWdlXG4gICAgICAgICAgICAgICAgJiYgbWVzc2FnZS52aXNpYmlsaXR5ICYmIG1lc3NhZ2UudmlzaWJpbGl0eSA9PT0gbGlicmFyeS5WSVNJQklMSVRZX0hJREVBQkxFO1xuXG4gICAgICAgICAgICAvLyBJcyB0aGUgbWVzc2FnZSBhbHdheXMgdmlzaWJsZT9cbiAgICAgICAgICAgIGNvbnN0IGlzQWx3YXlzT25NZXNzYWdlID0gIWlzU3VjY2Vzc01lc3NhZ2VcbiAgICAgICAgICAgICAgICAmJiBtZXNzYWdlLnZpc2liaWxpdHkgJiYgbWVzc2FnZS52aXNpYmlsaXR5ID09PSBsaWJyYXJ5LlZJU0lCSUxJVFlfQUxXQVlTX09OO1xuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGl0ZW0gbWFya3VwLlxuICAgICAgICAgICAgY29uc3QgbWFya3VwID0gYFxuXHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0Y2xhc3M9XCJtZXNzYWdlICR7bWVzc2FnZS50eXBlfSAke2lzU3VjY2Vzc01lc3NhZ2UgPyAnYWRtaW4tYWN0aW9uLXN1Y2Nlc3MnIDogJyd9XCJcblx0XHRcdFx0XHRkYXRhLXN0YXR1cz1cIiR7bWVzc2FnZS5zdGF0dXN9XCJcblx0XHRcdFx0XHRkYXRhLWlkPVwiJHttZXNzYWdlLmlkfVwiXG5cdFx0XHRcdFx0ZGF0YS12aXNpYmlsaXR5PVwiJHttZXNzYWdlLnZpc2liaWxpdHl9XCJcblx0XHRcdFx0XHRkYXRhLWlkZW50aWZpZXI9XCIke21lc3NhZ2UuaWRlbnRpZmllcn1cIlxuXHRcdFx0XHRcdD5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYWN0aW9uLWljb25zXCI+XG5cdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cIiR7X2dldENsYXNzTmFtZVdpdGhvdXRQZXJpb2RzKHNlbGVjdG9ycy5pdGVtQWN0aW9uKX0gZG8taGlkZSBmYSBmYS1taW51c1wiPjwvc3Bhbj5cblx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiJHtfZ2V0Q2xhc3NOYW1lV2l0aG91dFBlcmlvZHMoc2VsZWN0b3JzLml0ZW1BY3Rpb24pfSBkby1yZW1vdmUgZmEgZmEtdGltZXNcIj48L3NwYW4+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiaGVhZGxpbmVcIj5cblx0XHRcdFx0XHRcdCR7bWVzc2FnZS5oZWFkbGluZX1cblx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XG5cdFx0XHRcdFx0XHQke21lc3NhZ2UubWVzc2FnZX1cblx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdDxhIGNsYXNzPVwiYnRuICR7X2dldENsYXNzTmFtZVdpdGhvdXRQZXJpb2RzKHNlbGVjdG9ycy5pdGVtQnV0dG9uKX1cIiBocmVmPVwiJHttZXNzYWdlLmJ1dHRvbkxpbmt9XCI+XG5cdFx0XHRcdFx0XHQke21lc3NhZ2UuYnV0dG9uTGFiZWx9XG5cdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdGA7XG5cbiAgICAgICAgICAgIC8vIE1hcmt1cCBhcyBqUXVlcnkgb2JqZWN0IGZvciBtYW5pcHVsYXRpb24gcHVycG9zZXMuXG4gICAgICAgICAgICBjb25zdCAkbWFya3VwID0gJChtYXJrdXApO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgYnV0dG9uIGZyb20gbWFya3VwLCBpZiBubyBidXR0b24gbGFiZWwgaXMgZGVmaW5lZC5cbiAgICAgICAgICAgIGlmICghbWVzc2FnZS5idXR0b25MYWJlbCkge1xuICAgICAgICAgICAgICAgICRtYXJrdXAuZmluZChzZWxlY3RvcnMuaXRlbUJ1dHRvbikucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgcmVtb3ZlL2hpZGUgYnV0dG9uLCBkZXBlbmRpbmcgb24gdGhlIHZpc2liaWxpdHkgdmFsdWUgYW5kIGtpbmQgb2YgbWVzc2FnZS5cbiAgICAgICAgICAgIGlmIChpc0Fsd2F5c09uTWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICRtYXJrdXAuZmluZChgJHtzZWxlY3RvcnMuaXRlbUFjdGlvbn1gKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNIaWRlYWJsZU1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICAkbWFya3VwLmZpbmQoYCR7c2VsZWN0b3JzLml0ZW1BY3Rpb259IGRvLXJlbW92ZWApLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1N1Y2Nlc3NNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgJG1hcmt1cC5maW5kKGAke3NlbGVjdG9ycy5pdGVtQWN0aW9ufSBkby1oaWRlYCkucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAkbWFya3VwO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG1hcmt1cCBmb3IgdGhlIG1lc3NhZ2UgaXRlbXMgdmlzaWJpbGl0eSBjaGVja2JveC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBHZW5lcmF0ZWQgSFRNTCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VmlzaWJpbGl0eUNoZWNrYm94TWFya3VwKCkge1xuICAgICAgICAgICAgcmV0dXJuIGBcblx0XHRcdFx0PGRpdiBjbGFzcz1cInZpc2liaWxpdHktY2hlY2tib3gtY29udGFpbmVyXCI+XG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiJHtfZ2V0Q2xhc3NOYW1lV2l0aG91dFBlcmlvZHMoc2VsZWN0b3JzLmNoZWNrYm94KX1cIj5cblx0XHRcdFx0XHQ8bGFiZWwgY2xhc3M9XCJ2aXNpYmlsaXR5LWNoZWNrYm94LWxhYmVsXCI+JHt0cmFuc2xhdG9yLnRyYW5zbGF0ZSgnU0hPV19BTEwnLCAnYWRtaW5faW5mb19ib3hlcycpfTwvbGFiZWw+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXJrcyBlYWNoIHZpc2libGUgbWVzc2FnZSBpdGVtIGFzIHJlYWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfbWFya01lc3NhZ2VJdGVtc0FzUmVhZCgpIHtcbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgaXRlbXMuXG4gICAgICAgICAgICBjb25zdCAkbWVzc2FnZUxpc3QgPSAkKHNlbGVjdG9ycy5jb250YWluZXIpLmZpbmQoc2VsZWN0b3JzLml0ZW0pO1xuXG4gICAgICAgICAgICAvLyBJdGVyYXRlIG92ZXIgZWFjaCBtZXNzYWdlIGFuZCBtYXJrIGFzIHJlYWQuXG4gICAgICAgICAgICAkbWVzc2FnZUxpc3QuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBDdXJyZW50IGl0ZXJhdGlvbiBlbGVtZW50LlxuICAgICAgICAgICAgICAgIGNvbnN0ICRtZXNzYWdlID0gJChlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8vIE1lc3NhZ2UgZGF0YS5cbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gJG1lc3NhZ2UuZGF0YSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gSW5kaWNhdGUsIGlmIHRoZSBtZXNzYWdlIGlzIGRlY2xhcmVkIGFzIGhpZGRlbi5cbiAgICAgICAgICAgICAgICBjb25zdCBpc0hpZGRlbiA9ICRtZXNzYWdlLmhhc0NsYXNzKGxpYnJhcnkuU1RBVFVTX0hJRERFTik7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgYnkgSUQgaWYgZXhpc3RlbnQuXG4gICAgICAgICAgICAgICAgaWYgKCFpc0hpZGRlbiAmJiBkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpYnJhcnkuc2V0U3RhdHVzKGRhdGEuaWQsIGxpYnJhcnkuU1RBVFVTX1JFQUQpO1xuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZS5kYXRhKCdzdGF0dXMnLCBsaWJyYXJ5LlNUQVRVU19SRUFEKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgc3VjY2VzcyBtZXNzYWdlcy5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5pZGVudGlmaWVyICYmIGRhdGEuaWRlbnRpZmllci5pbmNsdWRlcyhsaWJyYXJ5LlNVQ0NFU1NfTVNHX0lERU5USUZJRVJfUFJFRklYKSkge1xuICAgICAgICAgICAgICAgICAgICBsaWJyYXJ5LmRlbGV0ZUJ5SWRlbnRpZmllcihkYXRhLmlkZW50aWZpZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIG1lc3NhZ2UgaXRlbSBhbW91bnQgaW4gdGhlIG5vdGlmaWNhdGlvbiBpY29uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBBZG1pbiBhY3Rpb24gc3VjY2VzcyBtZXNzYWdlcyB3aWxsIGJlIGV4Y2x1ZGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBtZXNzYWdlcyBNZXNzYWdlIGl0ZW1zLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3NldE1lc3NhZ2VDb3VudGVyKG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAvLyBIaWRkZW4gQ1NTIGNsYXNzLlxuICAgICAgICAgICAgY29uc3QgaGlkZGVuQ2xhc3MgPSAnaGlkZGVuJztcblxuICAgICAgICAgICAgLy8gTWVzc2FnZSBpdGVtIGNvdW50LlxuICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcblxuICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggbWVzc2FnZSBpdGVtIGFuZCBjaGVjayBtZXNzYWdlIGlkZW50aWZpZXIuXG4gICAgICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IGNvdW50ID1cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS5pZGVudGlmaWVyLmluY2x1ZGVzKGxpYnJhcnkuU1VDQ0VTU19NU0dfSURFTlRJRklFUl9QUkVGSVgpID8gY291bnQgOiArK2NvdW50KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgbm90aWZpY2F0aW9uIGNvdW50IHdpbGwgYmUgaGlkZGVuLCBpZiB0aGVyZSBhcmUgbm8gbWVzc2FnZXMuXG4gICAgICAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgICAgICAgICAkY291bnRlclxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoaGlkZGVuQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGNvdW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGNvdW50ZXIuYWRkQ2xhc3MoaGlkZGVuQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNsaWNrIGV2ZW50IG9uIHRoZSBpbmZvIGJveCBhY3Rpb24gYnV0dG9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ2xpY2soKSB7XG4gICAgICAgICAgICBfdG9nZ2xlQ29udGFpbmVyKCEkKHNlbGVjdG9ycy5jb250YWluZXIpLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9nZ2xlcyB0aGUgbWVzc2FnZSBsaXN0IGNvbnRhaW5lciAocG9wb3Zlcikgd2l0aCBhbiBhbmltYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZG9TaG93IFNob3cgdGhlIG1lc3NhZ2UgbGlzdCBjb250YWluZXI/XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdG9nZ2xlQ29udGFpbmVyKGRvU2hvdykge1xuICAgICAgICAgICAgLy8gRXhpdCBpbW1lZGlhdGVseSB3aGVuIHRoZSBhbmltYXRpb24gcHJvY2VzcyBpcyBzdGlsbCBydW5uaW5nLlxuICAgICAgICAgICAgaWYgKGlzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJbmRpY2F0ZSBhbmltYXRpb24gcHJvY2Vzcy5cbiAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gU3dpdGNoIGFuaW1hdGlvbiBwcm9jZXNzIGluZGljYXRvciB0byBmYWxzZSBhZnRlciBhbmltYXRpb24gZHVyYXRpb24uXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGlzQW5pbWF0aW5nID0gZmFsc2UsIG9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24pO1xuXG4gICAgICAgICAgICBpZiAoZG9TaG93KSB7XG4gICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBtZXNzYWdlIGl0ZW0gbGlzdCBjb250YWluZXIgcm9sbCBpbiBhbmltYXRpb24uXG4gICAgICAgICAgICAgICAgJHRoaXMucG9wb3Zlcignc2hvdycpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBQZXJmb3JtIG1lc3NhZ2UgaXRlbSBsaXN0IGNvbnRhaW5lciByb2xsIG91dCBhbmltYXRpb24gYW5kIHRoZW4gaGlkZS5cbiAgICAgICAgICAgICAgICAkKHNlbGVjdG9ycy5jb250YWluZXIpLnJlbW92ZUNsYXNzKGNsYXNzZXMuY29udGFpbmVyVmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiAkdGhpcy5wb3BvdmVyKCdoaWRlJyksIG9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIHBvcG92ZXIgKG1lc3NhZ2UgY29udGFpbmVyKSAnc2hvd24nIGV2ZW50IGJ5IGdldHRpbmcgdGhlIG1lc3NhZ2VzIGZyb20gdGhlIHNlcnZlclxuICAgICAgICAgKiBhbmQgZGlzcGxheWluZyB0aGVtIGluIHRoZSBjb250YWluZXIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Qb3BvdmVyU2hvd24oKSB7XG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QgY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgJGNvbnRhaW5lciA9ICQoc2VsZWN0b3JzLmNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIC8vIEluZGljYXRlIGNvbnRhaW5lciB2aXNpYmlsaXR5LlxuICAgICAgICAgICAgJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhjbGFzc2VzLmNvbnRhaW5lclZpc2libGUpXG4gICAgICAgICAgICAgICAgLmNzcyh7dG9wOiAkY29udGFpbmVyLmhlaWdodCgpICogLTF9KTtcblxuICAgICAgICAgICAgLy8gRml4IGNvbnRhaW5lciBhbmQgYXJyb3cgcG9zaXRpb24uXG4gICAgICAgICAgICBfZml4UG9zaXRpb25zKCk7XG5cbiAgICAgICAgICAgIC8vIEVuYWJsZSBsb2FkaW5nIHN0YXRlLlxuICAgICAgICAgICAgX3RvZ2dsZUxvYWRpbmcodHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIFJldHJpZXZlIG1lc3NhZ2VzIGZyb20gc2VydmVyIGFuZCBzaG93IHRoZW0gaW4gdGhlIGNvbnRhaW5lciBhbmQgbWFyayB0aGVtIGFzIHJlYWQuXG4gICAgICAgICAgICBsaWJyYXJ5LmdldE1lc3NhZ2VzKCkudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gRGlzYWJsZSBsb2FkaW5nIHN0YXRlLlxuICAgICAgICAgICAgICAgIF90b2dnbGVMb2FkaW5nKGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIC8vIFB1dCBtZXNzYWdlcyBpbnRvIG1lc3NhZ2UgbGlzdC5cbiAgICAgICAgICAgICAgICBfcHV0TWVzc2FnZXNJbnRvQ29udGFpbmVyKG1lc3NhZ2VzKTtcblxuICAgICAgICAgICAgICAgIC8vIEhpZGUgaGlkZGVuIG1lc3NhZ2UgaXRlbXMgYW5kIHNob3cgb25seSB0aGUgc3VjY2VzcyBtZXNzYWdlIGl0ZW0gaWYgZXhpc3RzLlxuICAgICAgICAgICAgICAgIF9yZXZpc2VNZXNzYWdlSXRlbUxpc3QoKTtcblxuICAgICAgICAgICAgICAgIC8vIFNldCBub3RpZmljYXRpb24gY291bnQuXG4gICAgICAgICAgICAgICAgX3NldE1lc3NhZ2VDb3VudGVyKG1lc3NhZ2VzKTtcblxuICAgICAgICAgICAgICAgIC8vIE1hcmsgdmlzaWJsZSBtZXNzYWdlIGl0ZW1zIGFzIHJlYWQuXG4gICAgICAgICAgICAgICAgX21hcmtNZXNzYWdlSXRlbXNBc1JlYWQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggZXZlbnQgaGFuZGxlcnMgdG8gcG9wb3Zlci5cbiAgICAgICAgICAgICRjb250YWluZXJcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljayBjaGFuZ2UnKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCBzZWxlY3RvcnMuaXRlbUJ1dHRvbiwgX29uTWVzc2FnZUl0ZW1CdXR0b25DbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgc2VsZWN0b3JzLml0ZW1BY3Rpb24sIF9vbk1lc3NhZ2VJdGVtQWN0aW9uQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBzZWxlY3RvcnMuY2hlY2tib3gsIF9vblZpc2liaWxpdHlDaGVja2JveENoYW5nZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9nZ2xlcyB0aGUgaGlkZGVuIG1lc3NhZ2UgaXRlbXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZG9TaG93IFNob3cgdGhlIGhpZGRlbiBtZXNzYWdlIGl0ZW1zP1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3RvZ2dsZUhpZGRlbk1lc3NhZ2VJdGVtcyhkb1Nob3cpIHtcbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgbGlzdCBjb250YWluZXIuXG4gICAgICAgICAgICBjb25zdCAkY29udGFpbmVyID0gJChzZWxlY3RvcnMuY29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gSGlkZGVuIG1lc3NhZ2UgaXRlbXMuXG4gICAgICAgICAgICBjb25zdCAkaGlkZGVuTWVzc2FnZUl0ZW1zID0gJGNvbnRhaW5lci5maW5kKHNlbGVjdG9ycy5pdGVtKS5maWx0ZXIoc2VsZWN0b3JzLmhpZGRlbkl0ZW0pO1xuXG4gICAgICAgICAgICAvLyBUb2dnbGUgdmlzaWJpbGl0eS5cbiAgICAgICAgICAgIGlmIChkb1Nob3cpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuTWVzc2FnZUl0ZW1zLnJlbW92ZUNsYXNzKGNsYXNzZXMuaGlkZGVuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbk1lc3NhZ2VJdGVtcy5hZGRDbGFzcyhjbGFzc2VzLmhpZGRlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV2aXNlcyB0aGUgbWVzc2FnZSBpdGVtIGxpc3QgYnkgaGlkaW5nIG1lc3NhZ2UgaXRlbXMgZGVjbGFyZWQgYXMgaGlkZGVuLlxuICAgICAgICAgKlxuICAgICAgICAgKiBBZGRpdGlvbmFsbHksIGlmIGFuIGFkbWluIGFjdGlvbiBzdWNjZXNzIG1lc3NhZ2UgaXRlbSBpcyBmb3VuZCBpdCB3aWxsIGJlIHNvbGVseSBkaXNwbGF5ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmV2aXNlTWVzc2FnZUl0ZW1MaXN0KCkge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBsaXN0IGNvbnRhaW5lci5cbiAgICAgICAgICAgIGNvbnN0ICRjb250YWluZXIgPSAkKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QuXG4gICAgICAgICAgICBjb25zdCAkbWVzc2FnZUxpc3QgPSAkY29udGFpbmVyLmZpbmQoc2VsZWN0b3JzLmxpc3QpO1xuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGl0ZW1zLlxuICAgICAgICAgICAgY29uc3QgJG1lc3NhZ2VJdGVtcyA9ICRtZXNzYWdlTGlzdC5maW5kKHNlbGVjdG9ycy5pdGVtKTtcblxuICAgICAgICAgICAgLy8gSGlkZGVuIG1lc3NhZ2UgaXRlbXMuXG4gICAgICAgICAgICBjb25zdCAkaGlkZGVuTWVzc2FnZUl0ZW1zID0gJG1lc3NhZ2VJdGVtcy5maWx0ZXIoc2VsZWN0b3JzLmhpZGRlbkl0ZW0pO1xuXG4gICAgICAgICAgICAvLyBBZG1pbiBhY3Rpb24gc3VjY2VzcyBtZXNzYWdlIGl0ZW1zLlxuICAgICAgICAgICAgY29uc3QgJHN1Y2Nlc3NNZXNzYWdlSXRlbXMgPSAkbWVzc2FnZUl0ZW1zLmZpbHRlcihgW2RhdGEtaWRlbnRpZmllcio9JHtsaWJyYXJ5LlNVQ0NFU1NfTVNHX0lERU5USUZJRVJfUFJFRklYfV1gKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBtZXNzYWdlcyBkZWNsYXJlZCBhcyBoaWRkZW4gYW5kIGFkZCB2aXNpYmlsaXR5IGNoZWNrYm94LlxuICAgICAgICAgICAgaWYgKCRoaWRkZW5NZXNzYWdlSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgX3RvZ2dsZUhpZGRlbk1lc3NhZ2VJdGVtcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VMaXN0LmFwcGVuZChfZ2V0VmlzaWJpbGl0eUNoZWNrYm94TWFya3VwKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG90aGVyIG1lc3NhZ2VzIChpbmNsdWRpbmcgZHVwbGljYXRlIHN1Y2Nlc3MgbWVzc2FnZXMpIGlmIGEgc3VjY2VzcyBtZXNzYWdlIGlzIHByZXNlbnQuXG4gICAgICAgICAgICBpZiAoJHN1Y2Nlc3NNZXNzYWdlSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VJdGVtc1xuICAgICAgICAgICAgICAgICAgICAubm90KCRzdWNjZXNzTWVzc2FnZUl0ZW1zLmZpcnN0KCkpXG4gICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlsbHMgdGhlIG1lc3NhZ2UgbGlzdCB3aXRoIG1lc3NhZ2UgaXRlbXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IG1lc3NhZ2VzIE1lc3NhZ2UgaXRlbXMuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcHV0TWVzc2FnZXNJbnRvQ29udGFpbmVyKG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QgY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgJGNvbnRhaW5lciA9ICQoc2VsZWN0b3JzLmNvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgbGlzdC5cbiAgICAgICAgICAgIGNvbnN0ICRtZXNzYWdlTGlzdCA9ICRjb250YWluZXIuZmluZChzZWxlY3RvcnMubGlzdCk7XG5cbiAgICAgICAgICAgIC8vIEFycmF5IGNvbnRhaW5pbmcgYWxsIGdlbmVyYXRlZCBtZXNzYWdlIGl0ZW0gbWFya3Vwcy5cbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VJdGVtc01hcmt1cHMgPSBbXTtcblxuICAgICAgICAgICAgLy8gQ2xlYXIgbWVzc2FnZSBsaXN0LlxuICAgICAgICAgICAgJG1lc3NhZ2VMaXN0LmVtcHR5KCk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgbWVzc2FnZXMuXG4gICAgICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIGVhY2ggbWVzc2FnZSBpdGVtIGFuZCBnZW5lcmF0ZSBtYXJrdXBzLlxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbWVzc2FnZSBvZiBtZXNzYWdlcykge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBtYXJrdXAuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRtYXJrdXAgPSBfZ2V0TWVzc2FnZUl0ZW1NYXJrdXAobWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIG1hcmt1cCB0byBhcnJheS5cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUl0ZW1zTWFya3Vwcy5wdXNoKCRtYXJrdXApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgbWFya3VwIGZvciB0aGUgbWlzc2luZyBlbnRyaWVzIGluZm8gbWVzc2FnZSBpdGVtLlxuICAgICAgICAgICAgICAgIGNvbnN0ICRub0VudHJpZXNNZXNzYWdlSXRlbU1hcmt1cCA9IF9nZXRNZXNzYWdlSXRlbU1hcmt1cCh7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHRyYW5zbGF0b3IudHJhbnNsYXRlKCdOT19NRVNTQUdFUycsICdhZG1pbl9pbmZvX2JveGVzJyksXG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHk6IGxpYnJhcnkuVklTSUJJTElUWV9BTFdBWVNfT04sXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogbGlicmFyeS5TVEFUVVNfUkVBRCxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGxpbmU6ICcnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIG1hcmt1cCB0byBhcnJheS5cbiAgICAgICAgICAgICAgICBtZXNzYWdlSXRlbXNNYXJrdXBzLnB1c2goJG5vRW50cmllc01lc3NhZ2VJdGVtTWFya3VwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUHV0IHJlbmRlciBtZXNzYWdlcy5cbiAgICAgICAgICAgIG1lc3NhZ2VJdGVtc01hcmt1cHMuZm9yRWFjaChlbGVtZW50ID0+ICRtZXNzYWdlTGlzdC5hcHBlbmQoZWxlbWVudCkpO1xuXG4gICAgICAgICAgICAvLyBGYWRlIHRoZSBtZXNzYWdlIGl0ZW1zIGluIHNtb290aGx5LlxuICAgICAgICAgICAgJG1lc3NhZ2VMaXN0XG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+ICQoZWxlbWVudCkuaGlkZSgpLmZhZGVJbigpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBjbGljayBldmVudCB0byBhIG1lc3NhZ2UgaXRlbSBidXR0b24gYnkgb3BlbmluZyB0aGUgbGluay5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbk1lc3NhZ2VJdGVtQnV0dG9uQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBiZWhhdmlvci5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgLy8gTGluayB2YWx1ZSBmcm9tIGJ1dHRvbi5cbiAgICAgICAgICAgIGNvbnN0IGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBwZXJmb3JtIGEgc3BlY2lhbCBhY3Rpb24uXG4gICAgICAgICAgICBjb25zdCAkbWVzc2FnZSA9ICQodGhpcykucGFyZW50cygnLm1lc3NhZ2UnKTtcblxuICAgICAgICAgICAgc3dpdGNoICgkbWVzc2FnZS5kYXRhKCdpZGVudGlmaWVyJykpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjbGVhcl9jYWNoZSc6XG4gICAgICAgICAgICAgICAgICAgICQuZ2V0KGhyZWYpLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlicmFyeS5hZGRTdWNjZXNzTWVzc2FnZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAvLyBPcGVuIGxpbmsgaWYgZXhpc3RzLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaHJlZiAmJiBocmVmLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKGhyZWYsIG9wdGlvbnMubGlua09wZW5Nb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGNsaWNrIGV2ZW50IHRvIGEgbWVzc2FnZSBpdGVtIGFjdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbk1lc3NhZ2VJdGVtQWN0aW9uQ2xpY2soKSB7XG4gICAgICAgICAgICAvLyBDbGlja2VkIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBjbGlja2VkIHRhcmdldCBpbmRpY2F0ZXMgYSBtZXNzYWdlIHJlbW92YWwuXG4gICAgICAgICAgICBjb25zdCBkb1JlbW92ZSA9ICRlbGVtZW50Lmhhc0NsYXNzKCdkby1yZW1vdmUnKTtcblxuICAgICAgICAgICAgLy8gSUQgb2YgdGhlIG1lc3NhZ2UgdGFrZW4gZnJvbSB0aGUgbWVzc2FnZSBpdGVtIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCBpZCA9ICRlbGVtZW50LnBhcmVudHMoc2VsZWN0b3JzLml0ZW0pLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICAgIC8vIERlbGV0ZS9oaWRlIG1lc3NhZ2UgZGVwZW5kaW5nIG9uIHRoZSBjbGlja2VkIHRhcmdldC5cbiAgICAgICAgICAgIGlmIChkb1JlbW92ZSkge1xuICAgICAgICAgICAgICAgIF9kZWxldGVNZXNzYWdlKGlkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2hpZGVNZXNzYWdlKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGNsaWNrIGV2ZW50IG9uIHRoZSBlbnRpcmUgZG9jdW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25XaW5kb3dDbGljayhldmVudCkge1xuICAgICAgICAgICAgLy8gQ2xpY2tlZCB0YXJnZXQuXG4gICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QgaXRlbSBjb250YWluZXIuXG4gICAgICAgICAgICBjb25zdCAkY29udGFpbmVyID0gJChzZWxlY3RvcnMuY29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gQ29uZGl0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IGlzQ2xpY2tlZE9uQnV0dG9uID0gJHRoaXMuaGFzKCR0YXJnZXQpLmxlbmd0aCB8fCAkdGhpcy5pcygkdGFyZ2V0KS5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBpc0NvbnRhaW5lclNob3duID0gJGNvbnRhaW5lci5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBpc0NsaWNrZWRPdXRzaWRlT2ZQb3BvdmVyID0gISRjb250YWluZXIuaGFzKCR0YXJnZXQpLmxlbmd0aDtcblxuICAgICAgICAgICAgLy8gT25seSBoaWRlIGNvbnRhaW5lciwgaWYgY2xpY2tlZCB0YXJnZXQgaXMgbm90IHdpdGhpbiB0aGUgY29udGFpbmVyIGFyZWEuXG4gICAgICAgICAgICBpZiAoaXNDbGlja2VkT3V0c2lkZU9mUG9wb3ZlciAmJiBpc0NvbnRhaW5lclNob3duICYmICFpc0NsaWNrZWRPbkJ1dHRvbiAmJiAhaXNTaG93bldpdGhDbG9zZURlbGF5KSB7XG4gICAgICAgICAgICAgICAgX3RvZ2dsZUNvbnRhaW5lcihmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRml4ZXMgdGhlIGNvbnRhaW5lciBhbmQgYXJyb3cgcG9zaXRpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2ZpeFBvc2l0aW9ucygpIHtcbiAgICAgICAgICAgIC8vIE9mZnNldCBjb3JyZWN0aW9uIHZhbHVlcy5cbiAgICAgICAgICAgIGNvbnN0IEFSUk9XX09GRlNFVCA9IDI0MDtcbiAgICAgICAgICAgIGNvbnN0IFBPUE9WRVJfT0ZGU0VUID0gMjUwO1xuXG4gICAgICAgICAgICAvLyBNZXNzYWdlIGxpc3QgY29udGFpbmVyIChwb3BvdmVyKS5cbiAgICAgICAgICAgIGNvbnN0ICRjb250YWluZXIgPSAkKHNlbGVjdG9ycy5jb250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBBcnJvdy5cbiAgICAgICAgICAgIGNvbnN0ICRhcnJvdyA9ICRjb250YWluZXIuZmluZChzZWxlY3RvcnMuYXJyb3cpO1xuXG4gICAgICAgICAgICAvLyBGaXggdGhlIG9mZnNldCBmb3IgdGhlIGFmZmVjdGVkIGVsZW1lbnRzLCBpZiBwb3BvdmVyIGlzIG9wZW4uXG4gICAgICAgICAgICBpZiAoJGNvbnRhaW5lci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJvd09mZnNldCA9ICRjb250YWluZXIub2Zmc2V0KCkubGVmdCArIEFSUk9XX09GRlNFVDtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3BvdmVyT2Zmc2V0ID0gJHRoaXMub2Zmc2V0KCkubGVmdCAtIFBPUE9WRVJfT0ZGU0VUICsgKCR0aGlzLndpZHRoKCkgLyAyKTtcblxuICAgICAgICAgICAgICAgICRhcnJvdy5vZmZzZXQoe2xlZnQ6IGFycm93T2Zmc2V0fSk7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5vZmZzZXQoe2xlZnQ6IHBvcG92ZXJPZmZzZXR9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSB2aXNpYmlsaXR5IGNoZWNrYm94IGNoYW5nZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblZpc2liaWxpdHlDaGVja2JveENoYW5nZSgpIHtcbiAgICAgICAgICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjaGVja2JveCBpcyBjaGVja2VkLlxuICAgICAgICAgICAgY29uc3QgaXNDaGVja2JveENoZWNrZWQgPSAkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpO1xuXG4gICAgICAgICAgICAvLyBUb2dnbGUgaGlkZGVuIG1lc3NhZ2VzIGFuZCBtYXJrIHNob3duIG1lc3NhZ2VzIGFzIHJlYWQuXG4gICAgICAgICAgICBfdG9nZ2xlSGlkZGVuTWVzc2FnZUl0ZW1zKGlzQ2hlY2tib3hDaGVja2VkKTtcbiAgICAgICAgICAgIF9tYXJrTWVzc2FnZUl0ZW1zQXNSZWFkKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlcyBhIG1lc3NhZ2UgaXRlbSBhbmQgcmVmcmVzaGVzIHRoZSBtZXNzYWdlIGl0ZW0gbGlzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIE1lc3NhZ2UgSUQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZGVsZXRlTWVzc2FnZShpZCkge1xuICAgICAgICAgICAgbGlicmFyeVxuICAgICAgICAgICAgICAgIC5kZWxldGVCeUlkKGlkKVxuICAgICAgICAgICAgICAgIC50aGVuKF9yZWZyZXNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIaWRlcyBhIG1lc3NhZ2UgaXRlbSBhbmQgcmVmcmVzaGVzIHRoZSBtZXNzYWdlIGl0ZW0gbGlzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGlkIE1lc3NhZ2UgSUQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfaGlkZU1lc3NhZ2UoaWQpIHtcbiAgICAgICAgICAgIGxpYnJhcnlcbiAgICAgICAgICAgICAgICAuc2V0U3RhdHVzKGlkLCBsaWJyYXJ5LlNUQVRVU19ISURERU4pXG4gICAgICAgICAgICAgICAgLnRoZW4oX3JlZnJlc2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2hlcyB0aGUgbWVzc2FnZSBpdGVtIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVmcmVzaCgpIHtcbiAgICAgICAgICAgIC8vIE1lc3NhZ2UgbGlzdCBjb250YWluZXIuXG4gICAgICAgICAgICBjb25zdCAkY29udGFpbmVyID0gJChzZWxlY3RvcnMuY29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBsb2FkaW5nIHNwaW5uZXIgb24gdGhlIG1lc3NhZ2UgY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgJHNwaW5uZXIgPSBzcGlubmVyLnNob3coJGNvbnRhaW5lciwgOTk5OSk7XG5cbiAgICAgICAgICAgIC8vIFJlZnJlc2ggbGlzdC5cbiAgICAgICAgICAgIF9vblBvcG92ZXJTaG93bigpO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgIHNwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0cmlldmVzIHRoZSBtZXNzYWdlcyBhbmQgZGlzcGxheXMgdGhlIHBvcG92ZXIgaWYgdGhlcmUgYXJlIG5ldyBtZXNzYWdlcy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9yZWZyZXNoU2lsZW50bHkoKSB7XG4gICAgICAgICAgICAvLyBSZXRyaWV2ZSBtZXNzYWdlcyBmcm9tIHNlcnZlciBhbmQgdXBkYXRlIHRoZSBub3RpZmljYXRpb24gY291bnQuXG4gICAgICAgICAgICAvLyBQb3BvdmVyIHdpbGwgd2UgZGlzcGxheWVkIGlmIHRoZXJlIGlzIGEgbmV3IG1lc3NhZ2UuXG4gICAgICAgICAgICBsaWJyYXJ5LmdldE1lc3NhZ2VzKCkudGhlbihtZXNzYWdlcyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IG5vdGlmaWNhdGlvbiBjb3VudC5cbiAgICAgICAgICAgICAgICBfc2V0TWVzc2FnZUNvdW50ZXIobWVzc2FnZXMpO1xuXG4gICAgICAgICAgICAgICAgLy8gSXRlcmF0ZSBvdmVyIG1lc3NhZ2VzIGFuZCB0cnkgdG8gZmluZCBhIG1lc3NhZ2UgaXRlbSBkZWNsYXJlZCBhcyBuZXcuXG4gICAgICAgICAgICAgICAgLy8gSWYgZm91bmQsIHRoZSBjb250YWluZXIgd2lsbCBiZSBvcGVuZWQuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLnN0YXR1cyA9PT0gbGlicmFyeS5TVEFUVVNfTkVXKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFeGl0IGltbWVkaWF0ZWx5IHdoZW4gdGhlIGFuaW1hdGlvbiBwcm9jZXNzIGlzIHN0aWxsIHJ1bm5pbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9yIGlmIHRoZSBtZXNzYWdlIGxpc3QgaXRlbSBjb250YWluZXIgaXMgYWxyZWFkeSBzaG93biB3aXRoIGEgZGVmaW5lZCBkdXJhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0FuaW1hdGluZyB8fCBpc1Nob3duV2l0aENsb3NlRGVsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZW4gbWVzc2FnZSBpdGVtIGxpc3QgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgX3RvZ2dsZUNvbnRhaW5lcih0cnVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW5kaWNhdGUgZGVsYXllZCBjbG9zaW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgaXNTaG93bldpdGhDbG9zZURlbGF5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSGlkZSBjb250YWluZXIgYW5kIGluZGljYXRlIGRlbGF5ZWQgY2xvc2luZyBmaW5pc2guXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdG9nZ2xlQ29udGFpbmVyKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1Nob3duV2l0aENsb3NlRGVsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuY2xvc2VEZWxheSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9nZ2xlcyB0aGUgbG9hZGluZyBzdGF0ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc0xvYWRpbmcgSXMgdGhlIGxvYWQgcHJvY2VzcyBydW5uaW5nP1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3RvZ2dsZUxvYWRpbmcoaXNMb2FkaW5nKSB7XG4gICAgICAgICAgICAvLyBMb2FkaW5nIG1lc3NhZ2UgY2xhc3MuXG4gICAgICAgICAgICBjb25zdCBsb2FkaW5nTWVzc2FnZUNsYXNzID0gJy5sb2FkaW5nJztcblxuICAgICAgICAgICAgLy8gTWVzc2FnZSBpdGVtIGxpc3QgY29udGFpbmVyLlxuICAgICAgICAgICAgY29uc3QgJG1lc3NhZ2VMaXN0ID0gJChzZWxlY3RvcnMuY29udGFpbmVyKS5maW5kKHNlbGVjdG9ycy5saXN0KTtcblxuICAgICAgICAgICAgLy8gTG9hZGluZyBtZXNzYWdlIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkbG9hZGluZ01lc3NhZ2UgPSAkbWVzc2FnZUxpc3QuZmluZChsb2FkaW5nTWVzc2FnZUNsYXNzKTtcblxuICAgICAgICAgICAgLy8gTG9hZGluZyBtZXNzYWdlIG1hcmt1cC5cbiAgICAgICAgICAgIGNvbnN0IG1hcmt1cCA9IGBcblx0XHRcdFx0PGRpdiBjbGFzcz1cIiR7X2dldENsYXNzTmFtZVdpdGhvdXRQZXJpb2RzKGxvYWRpbmdNZXNzYWdlQ2xhc3MpfVwiPlxuXHRcdFx0XHRcdCR7dHJhbnNsYXRvci50cmFuc2xhdGUoJ0xPQURJTkcnLCAnYWRtaW5faW5mb19ib3hlcycpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdGA7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBleGlzdGluZyBsb2FkaW5nIG1lc3NhZ2UuXG4gICAgICAgICAgICAkbG9hZGluZ01lc3NhZ2UucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBuZXcgbG9hZGluZyBtZXNzYWdlIGlmIHBhcmFtZXRlciBpcyB0cnVlLlxuICAgICAgICAgICAgaWYgKGlzTG9hZGluZykge1xuICAgICAgICAgICAgICAgICRtZXNzYWdlTGlzdC5hcHBlbmQoJChtYXJrdXApKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyBNb2R1bGUgaW5pdGlhbGl6ZSBmdW5jdGlvbi5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgcG9wb3ZlciBwbHVnaW4gYW5kIGF0dGFjaCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLnBvcG92ZXIoe1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnICcsXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdtYW51YWwnLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogX2dldFBvcG92ZXJNYXJrdXAoKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9vbkNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignc2hvd24uYnMucG9wb3ZlcicsIF9vblBvcG92ZXJTaG93bilcbiAgICAgICAgICAgICAgICAub24oJ3Nob3c6cG9wb3ZlcicsICgpID0+IF90b2dnbGVDb250YWluZXIodHJ1ZSkpXG4gICAgICAgICAgICAgICAgLm9uKCdyZWZyZXNoOm1lc3NhZ2VzJywgX3JlZnJlc2hTaWxlbnRseSk7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIHdpbmRvdy5cbiAgICAgICAgICAgICQod2luZG93KVxuICAgICAgICAgICAgICAgIC5vbigncmVzaXplJywgX2ZpeFBvc2l0aW9ucylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgX29uV2luZG93Q2xpY2spO1xuXG4gICAgICAgICAgICAvLyBJbml0aWFsIG1lc3NhZ2UgY2hlY2suXG4gICAgICAgICAgICBfcmVmcmVzaFNpbGVudGx5KCk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lLlxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
