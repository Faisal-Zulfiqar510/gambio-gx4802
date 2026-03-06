'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------------------------------------------------------
 menu.js 2022-03-07
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * This widget handles the horizontal menu/dropdown functionality.
 *
 * It's used for the top category navigation, the cart dropdown or the top menu (for example). It is
 * able to re-order the menu entries to a special "More" submenu to save space if the entries don't
 * fit in the current view. It's also able to work with different event types for opening/closing menu
 * items in the different view types.
 */
gambio.widgets.module('menu', [gambio.source + '/libs/events', gambio.source + '/libs/responsive', gambio.source + '/libs/interaction'], function (data) {

    'use strict';

    // ########## VARIABLE INITIALIZATION ##########

    var $this = $(this),
        $window = $(window),
        $body = $('body'),
        $list = null,
        $entries = null,
        $more = null,
        $moreEntries = null,
        $menuEntries = null,
        $custom = null,
        $categories = null,
        touchEvents = null,
        currentWidth = null,
        mode = null,
        mobile = false,
        enterTimer = null,
        leaveTimer = null,
        initializedPos = false,
        onEnter = false,
        toucheStartEvent = null,
        toucheEndEvent = null,
        transition = {},
        isTouchDevice = Modernizr.touchevents || navigator.userAgent.search(/Touch/i) !== -1,
        defaults = {
        // The menu type must be either 'horizontal' or 'vertical'
        menuType: 'horizontal',

        // Vertical menu options.
        unfoldLevel: 0,
        accordion: false,
        showAllLink: false,

        // Minimum breakpoint to switch to mobile view
        breakpoint: 40,
        // Delay in ms after a mouseenter the element gets shown
        enterDelay: 0,
        // Delay in ms after a mouseleave an element gets hidden
        leaveDelay: 50,
        // Tolerance in px which gets substracted from the nav-width to prevent flickering
        widthTolerance: 10,
        // Class that gets added to an opened menu list item
        openClass: 'open',
        // If true, elements get moved from/to the more menu if there isn't enough space
        switchElementPosition: true,
        // Ignore menu functionality on elements inside this selection
        ignoreClass: 'ignore-menu',
        // Tolerance in px which is allowed for a "click" event on touch
        touchMoveTolerance: 10,
        // If true, the li with the active class gets opened
        openActive: false,
        events: {
            // Event types that open the menus in desktop view.
            // Possible values: ['click']; ['hover']; ['touch', 'hover']; ['click', 'hover']
            desktop: ['touch', 'hover'],
            // Event types that open the menus in mobile view.
            // Possible values: ['click']; ['hover']; ['touch', 'hover']; ['click', 'hover']; ['touch', 'click']
            mobile: ['touch', 'click']
        }
    },
        options = $.extend({}, defaults, data),
        module = {};

    // ########## HELPER FUNCTIONS ##########

    /**
     * Helper function to calculate the tolerance
     * between the touchstart and touchend event.
     * If the max tolarance is exceeded return true
     * @param       {object}        e       jQuery event object
     * @return     {boolean}               If true it is a move event
     * @private
     */
    var _touchMoveDetect = function _touchMoveDetect() {
        toucheEndEvent = toucheEndEvent || toucheStartEvent;
        var diff = Math.abs(toucheEndEvent.event.originalEvent.pageY - toucheStartEvent.event.originalEvent.pageY);
        toucheEndEvent = null;
        return diff > options.touchMoveTolerance;
    };

    /**
     * Updates the jQuery selection, because the
     * list elements can be moved
     *
     * @private
     */
    var _getSelections = function _getSelections() {
        $list = $this.children('ul');
        // Exclude the ".navbar-topbar-item" elements because they
        // are cloned to this menu and are only shown in mobile view
        $entries = $list.children('li').not('.navbar-topbar-item');
        $more = $entries.filter('.dropdown-more');
        $moreEntries = $more.children('ul');
        $custom = $entries.filter('.custom');
        $menuEntries = $entries.not($more);
        $categories = $menuEntries.not($custom);
    };

    /**
     * Helper function that detaches an element from the
     * menu and attaches it to the correct position at
     * the target
     * @param       {object}    $item       jQuery selection of the item that gets detached / attached
     * @param       {object}    $target     jQuery selection of the target container
     * @private
     */
    var _setItem = function _setItem($item, $target) {
        var positionId = $item.data('position'),
            done = false;

        // Look for the first item that has a higher
        // positionId that the item and insert it
        // before the found entry
        $target.children().each(function () {
            var $self = $(this),
                position = $self.data('position');

            if (position > positionId) {
                $self.before($item.detach());
                done = true;
                return false;
            }
        });

        // Append the item if the positionId has
        // a higher value as the last item int the
        // target
        if (!done) {
            $target.append($item);
        }
    };

    /**
     * Helper function that checks which elements needs
     * to be added to the menu. Every element that needs
     * to be added gets passed to the function
     * "_setItem"
     * @param       {integer}       diff        Amount of pixels that were free
     * @private
     */
    var _addElement = function _addElement(diff) {

        var done = false;

        /**
         * Helper function that loops through the elements
         * and tries to add the elements to the menu if
         * it would fit.
         * @param       {object}    $elements       jQuery selection of the entries inside the more-menu
         * @private
         */
        var _showElements = function _showElements($elements) {
            $elements.each(function () {
                var $self = $(this),
                    width = $self.data().width;

                if (diff > width) {
                    // Add the item to the menu
                    _setItem($self, $list);
                    diff -= width;
                } else {
                    // The next item wouldn't fit anymore',
                    // quit the loop
                    done = true;
                    return false;
                }
            });
        };

        // Update the selection of the visible menu items.
        _getSelections();

        // Add the content manager entries to the menu first.
        // If there is still space, add the "normal" category
        // items also
        _showElements($moreEntries.children('.custom'));
        if (!done) {
            _showElements($moreEntries.children());
        }

        // Check if the items still in the more menu
        // would fit inside the main menu if the more
        // menu would get hidden
        var width = 0;
        $moreEntries.children().each(function () {
            width += $(this).data().width;
        });

        if (width === 0) {
            $more.hide();
        } else if (width < $more.data().width + diff) {
            $more.hide();
            diff += $more.data().width;
            _showElements($moreEntries.children());
        }
    };

    /**
     * Helper function that checks which elements needs
     * to be removed from the menu, so that it fits
     * inside one menu line. Every element that needs
     * to be removed gets passed to the function
     * "_setItem"
     * @param       {integer}       diff        Amount of pixels that needs to be saved
     * @private
     */
    var _removeElement = function _removeElement(diff) {

        var done = false;

        /**
         * Helper function that contains the check
         * loop for determining which elements
         * needs to be removed
         * @param           {object}    $elements       jQuery selection of the menu items
         * @private
         */
        var _hideElements = function _hideElements($elements) {
            $elements.each(function () {
                var $self = $(this),
                    width = $self.data().width;

                // Remove the possibly set open state
                $self.filter('.' + options.openClass).add($self.find('.' + options.openClass)).removeClass(options.openClass);

                // Add the entry to the more-menu
                _setItem($self, $moreEntries);

                diff -= width;

                if (diff < 0) {
                    // Enough elements are removed,
                    // quit the loop
                    done = true;
                    return false;
                }
            });
        };

        // Update the selection of the visible menu items
        _getSelections();

        // Add the width of the more entry if it's not
        // visible, because it will get shown during this
        // function call
        if ($more.is(':hidden')) {
            diff += $more.data().width;
            $more.removeClass('style');
            $more.show();
        }

        // First remove "normal" category entries. If that
        // isn't enough remove the content manager entries also
        _hideElements($($categories.get().reverse()));
        if (!done) {
            _hideElements($($custom.get().reverse()));
        }
    };

    /**
     * Sets a data attribute to the menu items
     * that contains the width of the elements.
     * This is needed because if it is display
     * none the detected with will be zero. It
     * sets position id also.
     * @private
     */
    var _initElementSizesAndPosition = function _initElementSizesAndPosition() {
        $entries.each(function (i) {
            var $self = $(this),
                width = $self.outerWidth();

            $self.data({ width: width, position: i });
        });
    };

    /**
     * Helper function to close all menu entries.
     * Needed for the desktop <-> mobile view
     * change, mostly.
     * @private
     */
    var _closeMenu = function _closeMenu(e) {
        $this.find('li.' + options.openClass).each(function () {
            if ($(this).parents('.navbar-categories-left').length > 0) {
                return true;
            }
            $(this).removeClass(options.openClass);
        });

        var isObject = (typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object',
            isEvent = isObject ? e.hasOwnProperty('originalEvent') : false;
        if (isEvent) {
            e.stopPropagation();
            e.preventDefault();
        }
    };

    /**
     * Helper function to clear all pending
     * functions
     * @private
     */
    var _clearTimeouts = function _clearTimeouts() {
        enterTimer = enterTimer ? clearTimeout(enterTimer) : null;
        leaveTimer = leaveTimer ? clearTimeout(leaveTimer) : null;
    };

    /**
     * Helper function to reset the css of the menu.
     * This is needed to remove the overflow & height
     * settings of the menu of the css file. The
     * directives were set to prevent flickering on page
     * load
     * @private
     */
    var _resetInitialCss = function _resetInitialCss() {
        $this.css({
            'overflow': 'visible'
        });
    };

    /**
     * Helper function to set positioning classes
     * to the opend flyout. This is needed to keep
     * the flyout inside the boundaries of the navigation
     * @private
     */
    var _repositionOpenLayer = function _repositionOpenLayer() {
        var listWidth = $list.width(),
            $openLayer = $entries.filter('.' + options.openClass).children('ul');

        $openLayer.each(function () {
            var $self = $(this),
                $parent = $self.parent();

            // Reset the classes to prevent wrong calculation due to special styles
            $parent.removeClass('flyout-right flyout-left flyout-center flyout-wont-fit');

            var width = $self.outerWidth(),
                parentPosition = $parent.position().left,
                parentWidth = $parent.outerWidth();

            // Check witch class needs to be set
            if (listWidth > parentPosition + width) {
                $parent.addClass('flyout-right');
            } else if (parentPosition + parentWidth - width > 0) {
                $parent.addClass('flyout-left');
            } else if (width < listWidth) {
                $parent.addClass('flyout-center');
            } else {
                $parent.addClass('flyout-wont-fit');
            }
        });
    };

    /**
     * Helper function to calculate the difference between
     * the size of the visible elements in the menu and the
     * container size. If there is space, it calls the function
     * to activate an menu entry else it calls the function to
     * deactivate a menu entry
     * @param       {object}    e         jQuery event object
     * @param       {string}    eventName Event name parameter of the event object
     * @private
     */
    var _updateCategoryMenu = function _updateCategoryMenu(e, eventName) {
        var containerWidth = $this.innerWidth() - options.widthTolerance,
            width = 0;

        // Check if the container width has changed since last call
        if (options.menuType === 'horizontal' && (currentWidth !== containerWidth || eventName === 'switchedToDesktop')) {

            $list.children(':visible').each(function () {
                width += $(this).data('width');
            });

            // Add or remove elements depending on the size of the
            // visible elements
            if (containerWidth < width) {
                _removeElement(width - containerWidth);
            } else {
                _addElement(containerWidth - width);
            }

            _repositionOpenLayer();

            currentWidth = containerWidth;
        }
    };

    /**
     * Helper function to switch to the mobile
     * mode of the menu.
     * @private
     */
    var _switchToMobileView = function _switchToMobileView() {
        // Reset the current width so that
        // the "_updateCategoryMenu" will
        // perform correctly on the next view
        // change to desktop
        currentWidth = -1;
        _addElement(99999999);

        $('.level-1').css('padding-bottom', '200px'); // This padding corrects expand/collapse behavior of lower menu items in various mobile browsers. 

        // Use the vertical menu on mobile view.
        if (options.menuType === 'vertical') {
            // fixes display horizontal menu after a switch to mobile and back to desktop is performed
            if ($('#categories nav.navbar-default:first').not('.nav-categories-left').length > 0) {
                $('#categories nav.navbar-default:first').css({
                    opacity: 0,
                    height: 0
                }).children().hide();
            }

            // move topmenu-content items from horizontal menu to vertical menu
            $this.find('ul.level-1 li.navbar-topbar-item:first').before($('#categories nav.navbar-default li.topmenu-content').detach());

            $this.appendTo('#categories > .navbar-collapse');
            $this.addClass('navbar-default navbar-categories');
            $this.find('ul.level-1').addClass('navbar-nav');
            $this.find('.navbar-topbar-item').not('.topbar-search').show();

            _bindHorizontalEventHandlers();

            $body.trigger(jse.libs.theme.events.MENU_REPOSITIONED(), ['switchedToMobile']);
        }
    };

    /**
     * Helper function to switch to the desktop
     * mode of the menu. Additionally, in case that
     * the desktop mode is shown for the first time
     * set the position and width of the elements
     * @private
     */
    var _switchToDesktopView = function _switchToDesktopView() {
        $('.level-1').css('padding-bottom', ''); // Reset display fix for mobile browsers.

        // Revert all the changes made during the switch to mobile.
        if (options.menuType === 'vertical') {
            // fixes display horizontal menu after a switch to mobile and back to desktop is performed
            if ($('#categories nav.navbar-default:first').not('.nav-categories-left').length > 0) {
                $('#categories nav.navbar-default:first').css({
                    opacity: 1,
                    height: 'auto'
                }).children().show();
            }

            // move topmenu-content items back to horizontal menu
            var $topmenuContentElements = $this.find('li.topmenu-content').detach();
            $('#categories nav.navbar-default ul.level-1:first').append($topmenuContentElements);

            $this.appendTo('.box-categories');
            $this.removeClass('navbar-default navbar-categories');
            $this.find('ul.level-1').removeClass('navbar-nav');
            $this.find('.navbar-topbar-item').hide();
            _unbindHorizontalEventHandlers();

            $body.trigger(jse.libs.theme.events.MENU_REPOSITIONED(), ['switchedToDesktop']);
        }

        if (!initializedPos) {
            _initElementSizesAndPosition();
            initializedPos = true;
        }

        if (options.menuType === 'horizontal') {
            _updateCategoryMenu();

            if (isTouchDevice) {
                $list.find('.enter-category').show();
                $list.find('.dropdown > a').click(function (e) {
                    e.preventDefault();
                });
            }
        }
    };

    /**
     * Helper function to add the class to the li-element
     * depending on the open event. This can be a "touch"
     * or a "mouse" class
     * @param       {object}    $target         jQuery selection of the li-element
     * @param       {string}    className       Name of the class that gets added
     * @private
     */
    var _setEventTypeClass = function _setEventTypeClass($target, className) {
        $target.removeClass('touch mouse').addClass(className || '');
    };

    // ########## MAIN FUNCTIONALITY ##########

    /**
     * Function that gets called by the breakpoint trigger
     * (which is fired on browser resize). It checks for
     * CSS view changes and reconfigures the the JS behaviour
     * of the menu in that case
     * @private
     */
    var _breakpointHandler = function _breakpointHandler() {

        // Get the current viewmode
        var oldMode = mode || {},
            newMode = jse.libs.theme.responsive.breakpoint();

        // Only do something if the view was changed
        if (newMode.id !== oldMode.id) {

            // Check if a view change between mobile and desktop view was made
            var switchToMobile = newMode.id <= options.breakpoint && (!mobile || oldMode.id === undefined),
                switchToDesktop = newMode.id > options.breakpoint && (mobile || oldMode.id === undefined);

            // Store the new view settings
            mobile = newMode.id <= options.breakpoint;
            mode = $.extend({}, newMode);

            if (switchToMobile || switchToDesktop) {
                _clearTimeouts();
                if (options.menuType !== 'vertical') {
                    _closeMenu();
                }

                // Change the visibility of the menu items
                // in case of desktop <-> mobile view change
                if (options.switchElementPosition) {
                    if (switchToMobile) {
                        _switchToMobileView();
                    } else {
                        _switchToDesktopView();
                    }
                } else {
                    _repositionOpenLayer();
                }
            } else if (!mobile && options.switchElementPosition) {
                // Update the visibility of the menu items
                // if the view change was desktop to desktop only
                _updateCategoryMenu();
            } else if (!mobile) {
                _repositionOpenLayer();
            }
        }
    };

    // ######### EVENT HANDLER ##########

    /**
     * Changes the epand / collapse state of the menu,
     * if there is an submenu. In the other case it
     * will let execute the default action (most times
     * the execution of a link)
     * @param {object}  e       jQuery event object
     * @param {string}  mode    The current view mode (can be "mobile" or "desktop"
     * @param {integer} delay   Custom delay (in ms) for opening closing the menu (needed for click / touch events)
     * @private
     */
    var _openMenu = function _openMenu(e, type, delay) {

        var $self = $(this),
            $submenu = $self.children("ul.dropdown-menu"),
            length = $submenu.length,
            level = $submenu.length ? $submenu.data('level') || '0' : 99,
            validSubmenu = parseInt(level, 10) <= 2 && mode.id > options.breakpoint || mode.id <= options.breakpoint;

        if (type === 'mobile') {
            e.stopPropagation();
        }

        // Only change the state if there is
        // a submenu
        if (length && validSubmenu) {
            e.preventDefault();

            if (type === 'mobile') {
                // Simply toggle the openClass in mobile mode
                $self.toggleClass(options.openClass);
            } else {
                // Perform the else case for the desktop view

                var visible = $self.hasClass(options.openClass),
                    leave = $self.hasClass('leave'),
                    action = e.data && e.data.action ? e.data.action : visible && leave ? 'enter' : visible ? 'leave' : 'enter';

                // Depending on the visibility and the event-action-parameter
                // the submenu gets opened or closed
                switch (action) {
                    case 'enter':
                        if (!onEnter && !jse.libs.theme.interaction.isMouseDown()) {
                            onEnter = true;
                            // Set a timer for opening if the submenu (delayed opening)
                            _clearTimeouts();
                            enterTimer = setTimeout(function () {

                                // Remove all openClass-classes from the
                                // menu except the element to open and it's parents
                                $list.find('.' + options.openClass).not($self).not($self.parentsUntil($this, '.' + options.openClass)).trigger(jse.libs.theme.events.TRANSITION_STOP(), []).removeClass(options.openClass);

                                $list.find('.leave').trigger(jse.libs.theme.events.TRANSITION_STOP(), []).removeClass('leave');

                                // Open the submenu
                                transition.open = true;

                                // Set and unset the "onEnter" to prevent
                                // closing the menu immediately after opening if
                                // the cursor is at an place over the opening menu
                                // (this can happen if other components trigger the
                                // open event)
                                $self.off(jse.libs.theme.events.TRANSITION_FINISHED()).one(jse.libs.theme.events.TRANSITION_FINISHED(), function () {
                                    onEnter = false;
                                }).trigger(jse.libs.theme.events.TRANSITION(), transition).trigger(jse.libs.theme.events.OPEN_FLYOUT(), [$this]);

                                _repositionOpenLayer();
                            }, typeof delay === 'number' ? delay : options.enterDelay);
                        }

                        break;
                    case 'leave':
                        onEnter = false;
                        // Set a timer for closing if the submenu (delayed closing)
                        _clearTimeouts();
                        $self.addClass('leave');
                        leaveTimer = setTimeout(function () {
                            // Remove all openClass-classes from the
                            // menu except the elements parents
                            transition.open = false;
                            $list.find('.' + options.openClass).not($self.parentsUntil($this, '.' + options.openClass)).off(jse.libs.theme.events.TRANSITION_FINISHED()).one(jse.libs.theme.events.TRANSITION_FINISHED(), function () {
                                _setEventTypeClass($self, '');
                                $self.removeClass('leave');
                            }).trigger(jse.libs.theme.events.TRANSITION(), transition);
                        }, typeof delay === 'number' ? delay : options.leaveDelay);
                        break;
                    default:
                        break;
                }
            }
        }
    };

    /**
     * Event handler for the click / mouseenter / mouseleave event
     * on the navigation li elements. It checks if the event type
     * is supported for the current view type and calls the
     * openMenu-function if so.
     * @param       {object}    e           jQuery event object
     * @private
     */
    var _mouseHandler = function _mouseHandler(e) {
        var $self = $(this),
            viewport = mode.id <= options.breakpoint ? 'mobile' : 'desktop',
            events = options.events && options.events[viewport] ? options.events[viewport] : [];

        _setEventTypeClass($self, 'mouse');
        if ($.inArray(e.data.event, events) > -1) {
            _openMenu.call($self, e, viewport, e.data.delay);
        }

        // Perform navigation for custom links and category links on touch devices if no subcategories are found.
        if (($self.hasClass('custom') || isTouchDevice && $self.children('ul').length == 0) && e.data.event === 'click' && !$self.find('form').length) {
            e.preventDefault();
            e.stopPropagation();

            if ($self.find('a').attr('target') === '_blank') {
                window.open($self.find('a').attr('href'));
            } else {
                location.href = $self.find('a').attr('href');
            }
        }
    };

    /**
     * Event handler for the touchstart event (or "pointerdown"
     * depending on the browser). It removes the other critical
     * event handler (that would open the menu) from the list
     * element if the the mouseenter was executed before and
     * a click or touch event will be performed afterwards. This
     * is needed to prevent the browser engine workarounds which
     * will automatically perform mouse / click-events on touch
     * also.
     * @private
     */
    var _touchHandler = function _touchHandler(e) {
        e.stopPropagation();

        var $self = $(this),
            viewport = mode.id <= options.breakpoint ? 'mobile' : 'desktop',
            events = options.events && options.events[viewport] ? options.events[viewport] : [];

        $list.find('.enter-category').show();
        $list.find('.dropdown > a').on('click', function (e) {
            e.preventDefault();
        });

        if (e.data.type === 'start') {
            toucheStartEvent = { event: e, timestamp: new Date().getTime(), top: $window.scrollTop() };
            $list.off('mouseenter.menu mouseleave.menu');
        } else if ($.inArray('touch', events) > -1 && !_touchMoveDetect(e)) {
            _setEventTypeClass($self, 'touch');

            if ($.inArray('hover', events) === -1 || touchEvents.start !== 'pointerdown') {
                _openMenu.call($self, e, viewport);
            }

            $list.on('mouseleave', function () {
                $list.on('mouseenter.menu', 'li', { event: 'hover' }, _mouseHandler).on('mouseleave.menu', 'li', { event: 'hover', action: 'leave' }, _mouseHandler);
            });
        }
    };

    /**
     * Stores the last touch position on touchmove
     * @param       e       jQuery event object
     * @private
     */
    var _touchMoveHandler = function _touchMoveHandler(e) {
        toucheEndEvent = { event: e, timestamp: new Date().getTime(), top: $window.scrollTop() };
    };

    /**
     * Event handler for closing the menu if
     * the user interacts with the page
     * outside of the menu
     * @param       {object}    e       jQuery event object
     * @param       {object}    d       jQuery selection of the event emitter
     * @private
     */
    var _closeFlyout = function _closeFlyout(e, d) {
        if (d !== $this && $this.find($(e.target)).length === 0) {
            // Remove open and close timer
            _clearTimeouts();

            // Remove all state-classes from the menu
            if (options.menuType === 'horizontal') {
                $list.find('.touch, .mouse, .leave, .' + options.openClass).removeClass('touch mouse leave ' + options.openClass);
            }
        }
    };

    var _onClickAccordion = function _onClickAccordion(e) {
        e.preventDefault();
        e.stopPropagation();

        if ($(this).parents('.navbar-topbar-item').length > 0) {
            return;
        }

        if ($(this).hasClass('dropdown')) {
            if ($(this).hasClass(options.openClass)) {
                $(this).removeClass(options.openClass).find('.' + options.openClass).removeClass(options.openClass);
            } else {
                $(this).addClass(options.openClass).parentsUntil($this, 'li').addClass(options.openClass);
            }
        } else {
            location.href = $(this).find('a').attr('href');
        }
    };

    var _bindHorizontalEventHandlers = function _bindHorizontalEventHandlers() {
        $list.on(touchEvents.start + '.menu', 'li', { type: 'start' }, _touchHandler).on(touchEvents.move + '.menu', 'li', { type: 'start' }, _touchMoveHandler).on(touchEvents.end + '.menu', 'li', { type: 'end' }, _touchHandler).on('click.menu', 'li', { event: 'click', 'delay': 0 }, _mouseHandler).on('mouseenter.menu', 'li', { event: 'hover', action: 'enter' }, _mouseHandler).on('mouseleave.menu', 'li', { event: 'hover', action: 'leave' }, _mouseHandler);

        $body.on(jse.libs.theme.events.MENU_REPOSITIONED(), _updateCategoryMenu);
    };

    var _unbindHorizontalEventHandlers = function _unbindHorizontalEventHandlers() {
        $list.off(touchEvents.start + '.menu', 'li').off(touchEvents.move + '.menu', 'li').off(touchEvents.end + '.menu', 'li').off('click.menu', 'li').off('mouseenter.menu', 'li').off('mouseleave.menu', 'li');
    };

    // ########## INITIALIZATION ##########

    /**
     * Init function of the widget
     * @constructor
     */
    module.init = function (done) {
        // @todo Getting the "touchEvents" config value produces problems in tablet devices.
        touchEvents = jse.core.config.get('touch');
        transition.classOpen = options.openClass;

        _getSelections();
        _resetInitialCss();

        $body.on(jse.libs.theme.events.BREAKPOINT(), _breakpointHandler).on(jse.libs.theme.events.OPEN_FLYOUT() + ' click ' + touchEvents.end, _closeFlyout);

        $('.close-menu-container').on('touchstart touchend click', _closeMenu);

        $('.close-flyout').on('touchstart touchend click', _closeMenu);

        if (options.menuType === 'horizontal') {
            _bindHorizontalEventHandlers();
        }

        if (options.menuType === 'vertical') {
            if (options.accordion === true) {
                $this.on('click', 'li', _onClickAccordion);
            }

            // if there is no top header we must create dummy html because other modules will not work correctly
            if ($('#categories').length === 0) {
                var html = '<div id="categories"><div class="navbar-collapse collapse">' + '<nav class="navbar-default navbar-categories hidden"></nav></div></div>';
                $('#header').append(html);
            }
        }

        _breakpointHandler();

        /**
         * Stop the propagation of the events inside this container
         * (Workaround for the "more"-dropdown)
         */
        $this.find('.' + options.ignoreClass).on('mouseleave.menu mouseenter.menu click.menu ' + touchEvents.start + ' ' + touchEvents.end, 'li', function (e) {
            e.stopPropagation();
        });

        if (options.openActive) {
            var $active = $this.find('.active');
            $active.parentsUntil($this, 'li').addClass('open');
        }

        $('li.custom-entries a').on('click', function (e) {
            e.stopPropagation();
        });

        var viewport = mode.id <= options.breakpoint ? 'mobile' : 'desktop';

        if (viewport == 'mobile') {
            $('.level-1').css('padding-bottom', '200px'); // This padding corrects expand/collapse behavior of lower menu items in various mobile browsers. 
        }

        done();
    };

    // Return data to widget engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpZGdldHMvbWVudS5qcyJdLCJuYW1lcyI6WyJnYW1iaW8iLCJ3aWRnZXRzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiR3aW5kb3ciLCJ3aW5kb3ciLCIkYm9keSIsIiRsaXN0IiwiJGVudHJpZXMiLCIkbW9yZSIsIiRtb3JlRW50cmllcyIsIiRtZW51RW50cmllcyIsIiRjdXN0b20iLCIkY2F0ZWdvcmllcyIsInRvdWNoRXZlbnRzIiwiY3VycmVudFdpZHRoIiwibW9kZSIsIm1vYmlsZSIsImVudGVyVGltZXIiLCJsZWF2ZVRpbWVyIiwiaW5pdGlhbGl6ZWRQb3MiLCJvbkVudGVyIiwidG91Y2hlU3RhcnRFdmVudCIsInRvdWNoZUVuZEV2ZW50IiwidHJhbnNpdGlvbiIsImlzVG91Y2hEZXZpY2UiLCJNb2Rlcm5penIiLCJ0b3VjaGV2ZW50cyIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInNlYXJjaCIsImRlZmF1bHRzIiwibWVudVR5cGUiLCJ1bmZvbGRMZXZlbCIsImFjY29yZGlvbiIsInNob3dBbGxMaW5rIiwiYnJlYWtwb2ludCIsImVudGVyRGVsYXkiLCJsZWF2ZURlbGF5Iiwid2lkdGhUb2xlcmFuY2UiLCJvcGVuQ2xhc3MiLCJzd2l0Y2hFbGVtZW50UG9zaXRpb24iLCJpZ25vcmVDbGFzcyIsInRvdWNoTW92ZVRvbGVyYW5jZSIsIm9wZW5BY3RpdmUiLCJldmVudHMiLCJkZXNrdG9wIiwib3B0aW9ucyIsImV4dGVuZCIsIl90b3VjaE1vdmVEZXRlY3QiLCJkaWZmIiwiTWF0aCIsImFicyIsImV2ZW50Iiwib3JpZ2luYWxFdmVudCIsInBhZ2VZIiwiX2dldFNlbGVjdGlvbnMiLCJjaGlsZHJlbiIsIm5vdCIsImZpbHRlciIsIl9zZXRJdGVtIiwiJGl0ZW0iLCIkdGFyZ2V0IiwicG9zaXRpb25JZCIsImRvbmUiLCJlYWNoIiwiJHNlbGYiLCJwb3NpdGlvbiIsImJlZm9yZSIsImRldGFjaCIsImFwcGVuZCIsIl9hZGRFbGVtZW50IiwiX3Nob3dFbGVtZW50cyIsIiRlbGVtZW50cyIsIndpZHRoIiwiaGlkZSIsIl9yZW1vdmVFbGVtZW50IiwiX2hpZGVFbGVtZW50cyIsImFkZCIsImZpbmQiLCJyZW1vdmVDbGFzcyIsImlzIiwic2hvdyIsImdldCIsInJldmVyc2UiLCJfaW5pdEVsZW1lbnRTaXplc0FuZFBvc2l0aW9uIiwiaSIsIm91dGVyV2lkdGgiLCJfY2xvc2VNZW51IiwiZSIsInBhcmVudHMiLCJsZW5ndGgiLCJpc09iamVjdCIsImlzRXZlbnQiLCJoYXNPd25Qcm9wZXJ0eSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwiX2NsZWFyVGltZW91dHMiLCJjbGVhclRpbWVvdXQiLCJfcmVzZXRJbml0aWFsQ3NzIiwiY3NzIiwiX3JlcG9zaXRpb25PcGVuTGF5ZXIiLCJsaXN0V2lkdGgiLCIkb3BlbkxheWVyIiwiJHBhcmVudCIsInBhcmVudCIsInBhcmVudFBvc2l0aW9uIiwibGVmdCIsInBhcmVudFdpZHRoIiwiYWRkQ2xhc3MiLCJfdXBkYXRlQ2F0ZWdvcnlNZW51IiwiZXZlbnROYW1lIiwiY29udGFpbmVyV2lkdGgiLCJpbm5lcldpZHRoIiwiX3N3aXRjaFRvTW9iaWxlVmlldyIsIm9wYWNpdHkiLCJoZWlnaHQiLCJhcHBlbmRUbyIsIl9iaW5kSG9yaXpvbnRhbEV2ZW50SGFuZGxlcnMiLCJ0cmlnZ2VyIiwianNlIiwibGlicyIsInRoZW1lIiwiTUVOVV9SRVBPU0lUSU9ORUQiLCJfc3dpdGNoVG9EZXNrdG9wVmlldyIsIiR0b3BtZW51Q29udGVudEVsZW1lbnRzIiwiX3VuYmluZEhvcml6b250YWxFdmVudEhhbmRsZXJzIiwiY2xpY2siLCJfc2V0RXZlbnRUeXBlQ2xhc3MiLCJjbGFzc05hbWUiLCJfYnJlYWtwb2ludEhhbmRsZXIiLCJvbGRNb2RlIiwibmV3TW9kZSIsInJlc3BvbnNpdmUiLCJpZCIsInN3aXRjaFRvTW9iaWxlIiwidW5kZWZpbmVkIiwic3dpdGNoVG9EZXNrdG9wIiwiX29wZW5NZW51IiwidHlwZSIsImRlbGF5IiwiJHN1Ym1lbnUiLCJsZXZlbCIsInZhbGlkU3VibWVudSIsInBhcnNlSW50IiwidG9nZ2xlQ2xhc3MiLCJ2aXNpYmxlIiwiaGFzQ2xhc3MiLCJsZWF2ZSIsImFjdGlvbiIsImludGVyYWN0aW9uIiwiaXNNb3VzZURvd24iLCJzZXRUaW1lb3V0IiwicGFyZW50c1VudGlsIiwiVFJBTlNJVElPTl9TVE9QIiwib3BlbiIsIm9mZiIsIlRSQU5TSVRJT05fRklOSVNIRUQiLCJvbmUiLCJUUkFOU0lUSU9OIiwiT1BFTl9GTFlPVVQiLCJfbW91c2VIYW5kbGVyIiwidmlld3BvcnQiLCJpbkFycmF5IiwiY2FsbCIsImF0dHIiLCJsb2NhdGlvbiIsImhyZWYiLCJfdG91Y2hIYW5kbGVyIiwib24iLCJ0aW1lc3RhbXAiLCJEYXRlIiwiZ2V0VGltZSIsInRvcCIsInNjcm9sbFRvcCIsInN0YXJ0IiwiX3RvdWNoTW92ZUhhbmRsZXIiLCJfY2xvc2VGbHlvdXQiLCJkIiwidGFyZ2V0IiwiX29uQ2xpY2tBY2NvcmRpb24iLCJtb3ZlIiwiZW5kIiwiaW5pdCIsImNvcmUiLCJjb25maWciLCJjbGFzc09wZW4iLCJCUkVBS1BPSU5UIiwiaHRtbCIsIiRhY3RpdmUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7OztBQVFBQSxPQUFPQyxPQUFQLENBQWVDLE1BQWYsQ0FDSSxNQURKLEVBR0ksQ0FDSUYsT0FBT0csTUFBUCxHQUFnQixjQURwQixFQUVJSCxPQUFPRyxNQUFQLEdBQWdCLGtCQUZwQixFQUdJSCxPQUFPRyxNQUFQLEdBQWdCLG1CQUhwQixDQUhKLEVBU0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFUjs7QUFFUSxRQUFJQyxRQUFRQyxFQUFFLElBQUYsQ0FBWjtBQUFBLFFBQ0lDLFVBQVVELEVBQUVFLE1BQUYsQ0FEZDtBQUFBLFFBRUlDLFFBQVFILEVBQUUsTUFBRixDQUZaO0FBQUEsUUFHSUksUUFBUSxJQUhaO0FBQUEsUUFJSUMsV0FB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RDtBQUNBLGdCQUFJakwsRUFBRSxhQUFGLEVBQWlCd0YsTUFBakIsS0FBNEIsQ0FBaEMsRUFBbUM7QUFDL0Isb0JBQUlpRyxPQUFPLGdFQUNMLHlFQUROO0FBRUF6TCxrQkFBRSxTQUFGLEVBQWFtRSxNQUFiLENBQW9Cc0gsSUFBcEI7QUFDSDtBQUNKOztBQUVEMUQ7O0FBRUE7Ozs7QUFJQWhJLGNBQ0s2RSxJQURMLENBQ1UsTUFBTWhDLFFBQVFMLFdBRHhCLEVBRUsrSCxFQUZMLENBRVEsZ0RBQWdEM0osWUFBWWlLLEtBQTVELEdBQW9FLEdBQXBFLEdBQ0VqSyxZQUFZd0ssR0FIdEIsRUFHMkIsSUFIM0IsRUFHaUMsVUFBVTdGLENBQVYsRUFBYTtBQUN0Q0EsY0FBRU0sZUFBRjtBQUNILFNBTEw7O0FBT0EsWUFBSWhELFFBQVFILFVBQVosRUFBd0I7QUFDcEIsZ0JBQUlpSixVQUFVM0wsTUFBTTZFLElBQU4sQ0FBVyxTQUFYLENBQWQ7QUFDQThHLG9CQUNLcEMsWUFETCxDQUNrQnZKLEtBRGxCLEVBQ3lCLElBRHpCLEVBRUsyRyxRQUZMLENBRWMsTUFGZDtBQUdIOztBQUVEMUcsVUFBRSxxQkFBRixFQUF5QnNLLEVBQXpCLENBQTRCLE9BQTVCLEVBQXFDLFVBQVVoRixDQUFWLEVBQWE7QUFDOUNBLGNBQUVNLGVBQUY7QUFDSCxTQUZEOztBQUlBLFlBQUltRSxXQUFXbEosS0FBS3NILEVBQUwsSUFBV3ZGLFFBQVFYLFVBQW5CLEdBQWdDLFFBQWhDLEdBQTJDLFNBQTFEOztBQUVBLFlBQUk4SCxZQUFZLFFBQWhCLEVBQTBCO0FBQ3RCL0osY0FBRSxVQUFGLEVBQWNpRyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxPQUFwQyxFQURzQixDQUN3QjtBQUNqRDs7QUFFRHBDO0FBQ0gsS0FoRUQ7O0FBa0VBO0FBQ0EsV0FBT2pFLE1BQVA7QUFDSCxDQXQ2QkwiLCJmaWxlIjoid2lkZ2V0cy9tZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBtZW51LmpzIDIwMjItMDMtMDdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDIyIEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFRoaXMgd2lkZ2V0IGhhbmRsZXMgdGhlIGhvcml6b250YWwgbWVudS9kcm9wZG93biBmdW5jdGlvbmFsaXR5LlxuICpcbiAqIEl0J3MgdXNlZCBmb3IgdGhlIHRvcCBjYXRlZ29yeSBuYXZpZ2F0aW9uLCB0aGUgY2FydCBkcm9wZG93biBvciB0aGUgdG9wIG1lbnUgKGZvciBleGFtcGxlKS4gSXQgaXNcbiAqIGFibGUgdG8gcmUtb3JkZXIgdGhlIG1lbnUgZW50cmllcyB0byBhIHNwZWNpYWwgXCJNb3JlXCIgc3VibWVudSB0byBzYXZlIHNwYWNlIGlmIHRoZSBlbnRyaWVzIGRvbid0XG4gKiBmaXQgaW4gdGhlIGN1cnJlbnQgdmlldy4gSXQncyBhbHNvIGFibGUgdG8gd29yayB3aXRoIGRpZmZlcmVudCBldmVudCB0eXBlcyBmb3Igb3BlbmluZy9jbG9zaW5nIG1lbnVcbiAqIGl0ZW1zIGluIHRoZSBkaWZmZXJlbnQgdmlldyB0eXBlcy5cbiAqL1xuZ2FtYmlvLndpZGdldHMubW9kdWxlKFxuICAgICdtZW51JyxcblxuICAgIFtcbiAgICAgICAgZ2FtYmlvLnNvdXJjZSArICcvbGlicy9ldmVudHMnLFxuICAgICAgICBnYW1iaW8uc291cmNlICsgJy9saWJzL3Jlc3BvbnNpdmUnLFxuICAgICAgICBnYW1iaW8uc291cmNlICsgJy9saWJzL2ludGVyYWN0aW9uJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuLy8gIyMjIyMjIyMjIyBWQVJJQUJMRSBJTklUSUFMSVpBVElPTiAjIyMjIyMjIyMjXG5cbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgICAgICAkYm9keSA9ICQoJ2JvZHknKSxcbiAgICAgICAgICAgICRsaXN0ID0gbnVsbCxcbiAgICAgICAgICAgICRlbnRyaWVzID0gbnVsbCxcbiAgICAgICAgICAgICRtb3JlID0gbnVsbCxcbiAgICAgICAgICAgICRtb3JlRW50cmllcyA9IG51bGwsXG4gICAgICAgICAgICAkbWVudUVudHJpZXMgPSBudWxsLFxuICAgICAgICAgICAgJGN1c3RvbSA9IG51bGwsXG4gICAgICAgICAgICAkY2F0ZWdvcmllcyA9IG51bGwsXG4gICAgICAgICAgICB0b3VjaEV2ZW50cyA9IG51bGwsXG4gICAgICAgICAgICBjdXJyZW50V2lkdGggPSBudWxsLFxuICAgICAgICAgICAgbW9kZSA9IG51bGwsXG4gICAgICAgICAgICBtb2JpbGUgPSBmYWxzZSxcbiAgICAgICAgICAgIGVudGVyVGltZXIgPSBudWxsLFxuICAgICAgICAgICAgbGVhdmVUaW1lciA9IG51bGwsXG4gICAgICAgICAgICBpbml0aWFsaXplZFBvcyA9IGZhbHNlLFxuICAgICAgICAgICAgb25FbnRlciA9IGZhbHNlLFxuICAgICAgICAgICAgdG91Y2hlU3RhcnRFdmVudCA9IG51bGwsXG4gICAgICAgICAgICB0b3VjaGVFbmRFdmVudCA9IG51bGwsXG4gICAgICAgICAgICB0cmFuc2l0aW9uID0ge30sXG4gICAgICAgICAgICBpc1RvdWNoRGV2aWNlID0gTW9kZXJuaXpyLnRvdWNoZXZlbnRzIHx8IG5hdmlnYXRvci51c2VyQWdlbnQuc2VhcmNoKC9Ub3VjaC9pKSAhPT0gLTEsXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbWVudSB0eXBlIG11c3QgYmUgZWl0aGVyICdob3Jpem9udGFsJyBvciAndmVydGljYWwnXG4gICAgICAgICAgICAgICAgbWVudVR5cGU6ICdob3Jpem9udGFsJyxcblxuICAgICAgICAgICAgICAgIC8vIFZlcnRpY2FsIG1lbnUgb3B0aW9ucy5cbiAgICAgICAgICAgICAgICB1bmZvbGRMZXZlbDogMCxcbiAgICAgICAgICAgICAgICBhY2NvcmRpb246IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNob3dBbGxMaW5rOiBmYWxzZSxcblxuICAgICAgICAgICAgICAgIC8vIE1pbmltdW0gYnJlYWtwb2ludCB0byBzd2l0Y2ggdG8gbW9iaWxlIHZpZXdcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiA0MCxcbiAgICAgICAgICAgICAgICAvLyBEZWxheSBpbiBtcyBhZnRlciBhIG1vdXNlZW50ZXIgdGhlIGVsZW1lbnQgZ2V0cyBzaG93blxuICAgICAgICAgICAgICAgIGVudGVyRGVsYXk6IDAsXG4gICAgICAgICAgICAgICAgLy8gRGVsYXkgaW4gbXMgYWZ0ZXIgYSBtb3VzZWxlYXZlIGFuIGVsZW1lbnQgZ2V0cyBoaWRkZW5cbiAgICAgICAgICAgICAgICBsZWF2ZURlbGF5OiA1MCxcbiAgICAgICAgICAgICAgICAvLyBUb2xlcmFuY2UgaW4gcHggd2hpY2ggZ2V0cyBzdWJzdHJhY3RlZCBmcm9tIHRoZSBuYXYtd2lkdGggdG8gcHJldmVudCBmbGlja2VyaW5nXG4gICAgICAgICAgICAgICAgd2lkdGhUb2xlcmFuY2U6IDEwLFxuICAgICAgICAgICAgICAgIC8vIENsYXNzIHRoYXQgZ2V0cyBhZGRlZCB0byBhbiBvcGVuZWQgbWVudSBsaXN0IGl0ZW1cbiAgICAgICAgICAgICAgICBvcGVuQ2xhc3M6ICdvcGVuJyxcbiAgICAgICAgICAgICAgICAvLyBJZiB0cnVlLCBlbGVtZW50cyBnZXQgbW92ZWQgZnJvbS90byB0aGUgbW9yZSBtZW51IGlmIHRoZXJlIGlzbid0IGVub3VnaCBzcGFjZVxuICAgICAgICAgICAgICAgIHN3aXRjaEVsZW1lbnRQb3NpdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmUgbWVudSBmdW5jdGlvbmFsaXR5IG9uIGVsZW1lbnRzIGluc2lkZSB0aGlzIHNlbGVjdGlvblxuICAgICAgICAgICAgICAgIGlnbm9yZUNsYXNzOiAnaWdub3JlLW1lbnUnLFxuICAgICAgICAgICAgICAgIC8vIFRvbGVyYW5jZSBpbiBweCB3aGljaCBpcyBhbGxvd2VkIGZvciBhIFwiY2xpY2tcIiBldmVudCBvbiB0b3VjaFxuICAgICAgICAgICAgICAgIHRvdWNoTW92ZVRvbGVyYW5jZTogMTAsXG4gICAgICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIGxpIHdpdGggdGhlIGFjdGl2ZSBjbGFzcyBnZXRzIG9wZW5lZFxuICAgICAgICAgICAgICAgIG9wZW5BY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgICAgICAvLyBFdmVudCB0eXBlcyB0aGF0IG9wZW4gdGhlIG1lbnVzIGluIGRlc2t0b3Agdmlldy5cbiAgICAgICAgICAgICAgICAgICAgLy8gUG9zc2libGUgdmFsdWVzOiBbJ2NsaWNrJ107IFsnaG92ZXInXTsgWyd0b3VjaCcsICdob3ZlciddOyBbJ2NsaWNrJywgJ2hvdmVyJ11cbiAgICAgICAgICAgICAgICAgICAgZGVza3RvcDogWyd0b3VjaCcsICdob3ZlciddLFxuICAgICAgICAgICAgICAgICAgICAvLyBFdmVudCB0eXBlcyB0aGF0IG9wZW4gdGhlIG1lbnVzIGluIG1vYmlsZSB2aWV3LlxuICAgICAgICAgICAgICAgICAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6IFsnY2xpY2snXTsgWydob3ZlciddOyBbJ3RvdWNoJywgJ2hvdmVyJ107IFsnY2xpY2snLCAnaG92ZXInXTsgWyd0b3VjaCcsICdjbGljayddXG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZTogWyd0b3VjaCcsICdjbGljayddXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGRhdGEpLFxuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cblxuLy8gIyMjIyMjIyMjIyBIRUxQRVIgRlVOQ1RJT05TICMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSB0aGUgdG9sZXJhbmNlXG4gICAgICAgICAqIGJldHdlZW4gdGhlIHRvdWNoc3RhcnQgYW5kIHRvdWNoZW5kIGV2ZW50LlxuICAgICAgICAgKiBJZiB0aGUgbWF4IHRvbGFyYW5jZSBpcyBleGNlZWRlZCByZXR1cm4gdHJ1ZVxuICAgICAgICAgKiBAcGFyYW0gICAgICAge29iamVjdH0gICAgICAgIGUgICAgICAgalF1ZXJ5IGV2ZW50IG9iamVjdFxuICAgICAgICAgKiBAcmV0dXJuICAgICB7Ym9vbGVhbn0gICAgICAgICAgICAgICBJZiB0cnVlIGl0IGlzIGEgbW92ZSBldmVudFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF90b3VjaE1vdmVEZXRlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0b3VjaGVFbmRFdmVudCA9IHRvdWNoZUVuZEV2ZW50IHx8IHRvdWNoZVN0YXJ0RXZlbnQ7XG4gICAgICAgICAgICB2YXIgZGlmZiA9IE1hdGguYWJzKHRvdWNoZUVuZEV2ZW50LmV2ZW50Lm9yaWdpbmFsRXZlbnQucGFnZVkgLSB0b3VjaGVTdGFydEV2ZW50LmV2ZW50Lm9yaWdpbmFsRXZlbnQucGFnZVkpO1xuICAgICAgICAgICAgdG91Y2hlRW5kRXZlbnQgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGRpZmYgPiBvcHRpb25zLnRvdWNoTW92ZVRvbGVyYW5jZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyB0aGUgalF1ZXJ5IHNlbGVjdGlvbiwgYmVjYXVzZSB0aGVcbiAgICAgICAgICogbGlzdCBlbGVtZW50cyBjYW4gYmUgbW92ZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZ2V0U2VsZWN0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRsaXN0ID0gJHRoaXMuY2hpbGRyZW4oJ3VsJyk7XG4gICAgICAgICAgICAvLyBFeGNsdWRlIHRoZSBcIi5uYXZiYXItdG9wYmFyLWl0ZW1cIiBlbGVtZW50cyBiZWNhdXNlIHRoZXlcbiAgICAgICAgICAgIC8vIGFyZSBjbG9uZWQgdG8gdGhpcyBtZW51IGFuZCBhcmUgb25seSBzaG93biBpbiBtb2JpbGUgdmlld1xuICAgICAgICAgICAgJGVudHJpZXMgPSAkbGlzdC5jaGlsZHJlbignbGknKS5ub3QoJy5uYXZiYXItdG9wYmFyLWl0ZW0nKTtcbiAgICAgICAgICAgICRtb3JlID0gJGVudHJpZXMuZmlsdGVyKCcuZHJvcGRvd24tbW9yZScpO1xuICAgICAgICAgICAgJG1vcmVFbnRyaWVzID0gJG1vcmUuY2hpbGRyZW4oJ3VsJyk7XG4gICAgICAgICAgICAkY3VzdG9tID0gJGVudHJpZXMuZmlsdGVyKCcuY3VzdG9tJyk7XG4gICAgICAgICAgICAkbWVudUVudHJpZXMgPSAkZW50cmllcy5ub3QoJG1vcmUpO1xuICAgICAgICAgICAgJGNhdGVnb3JpZXMgPSAkbWVudUVudHJpZXMubm90KCRjdXN0b20pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdGhhdCBkZXRhY2hlcyBhbiBlbGVtZW50IGZyb20gdGhlXG4gICAgICAgICAqIG1lbnUgYW5kIGF0dGFjaGVzIGl0IHRvIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGF0XG4gICAgICAgICAqIHRoZSB0YXJnZXRcbiAgICAgICAgICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgICRpdGVtICAgICAgIGpRdWVyeSBzZWxlY3Rpb24gb2YgdGhlIGl0ZW0gdGhhdCBnZXRzIGRldGFjaGVkIC8gYXR0YWNoZWRcbiAgICAgICAgICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgICR0YXJnZXQgICAgIGpRdWVyeSBzZWxlY3Rpb24gb2YgdGhlIHRhcmdldCBjb250YWluZXJcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2V0SXRlbSA9IGZ1bmN0aW9uICgkaXRlbSwgJHRhcmdldCkge1xuICAgICAgICAgICAgdmFyIHBvc2l0aW9uSWQgPSAkaXRlbS5kYXRhKCdwb3NpdGlvbicpLFxuICAgICAgICAgICAgICAgIGRvbmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gTG9vayBmb3IgdGhlIGZpcnN0IGl0ZW0gdGhhdCBoYXMgYSBoaWdoZXJcbiAgICAgICAgICAgIC8vIHBvc2l0aW9uSWQgdGhhdCB0aGUgaXRlbSBhbmQgaW5zZXJ0IGl0XG4gICAgICAgICAgICAvLyBiZWZvcmUgdGhlIGZvdW5kIGVudHJ5XG4gICAgICAgICAgICAkdGFyZ2V0XG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICRzZWxmLmRhdGEoJ3Bvc2l0aW9uJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID4gcG9zaXRpb25JZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuYmVmb3JlKCRpdGVtLmRldGFjaCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgaXRlbSBpZiB0aGUgcG9zaXRpb25JZCBoYXNcbiAgICAgICAgICAgIC8vIGEgaGlnaGVyIHZhbHVlIGFzIHRoZSBsYXN0IGl0ZW0gaW50IHRoZVxuICAgICAgICAgICAgLy8gdGFyZ2V0XG4gICAgICAgICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgICAgICAgICAkdGFyZ2V0LmFwcGVuZCgkaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IGNoZWNrcyB3aGljaCBlbGVtZW50cyBuZWVkc1xuICAgICAgICAgKiB0byBiZSBhZGRlZCB0byB0aGUgbWVudS4gRXZlcnkgZWxlbWVudCB0aGF0IG5lZWRzXG4gICAgICAgICAqIHRvIGJlIGFkZGVkIGdldHMgcGFzc2VkIHRvIHRoZSBmdW5jdGlvblxuICAgICAgICAgKiBcIl9zZXRJdGVtXCJcbiAgICAgICAgICogQHBhcmFtICAgICAgIHtpbnRlZ2VyfSAgICAgICBkaWZmICAgICAgICBBbW91bnQgb2YgcGl4ZWxzIHRoYXQgd2VyZSBmcmVlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2FkZEVsZW1lbnQgPSBmdW5jdGlvbiAoZGlmZikge1xuXG4gICAgICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IGxvb3BzIHRocm91Z2ggdGhlIGVsZW1lbnRzXG4gICAgICAgICAgICAgKiBhbmQgdHJpZXMgdG8gYWRkIHRoZSBlbGVtZW50cyB0byB0aGUgbWVudSBpZlxuICAgICAgICAgICAgICogaXQgd291bGQgZml0LlxuICAgICAgICAgICAgICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgICRlbGVtZW50cyAgICAgICBqUXVlcnkgc2VsZWN0aW9uIG9mIHRoZSBlbnRyaWVzIGluc2lkZSB0aGUgbW9yZS1tZW51XG4gICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgX3Nob3dFbGVtZW50cyA9IGZ1bmN0aW9uICgkZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA9ICRzZWxmLmRhdGEoKS53aWR0aDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZiA+IHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGl0ZW0gdG8gdGhlIG1lbnVcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZXRJdGVtKCRzZWxmLCAkbGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaWZmIC09IHdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5leHQgaXRlbSB3b3VsZG4ndCBmaXQgYW55bW9yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBxdWl0IHRoZSBsb29wXG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBzZWxlY3Rpb24gb2YgdGhlIHZpc2libGUgbWVudSBpdGVtcy5cbiAgICAgICAgICAgIF9nZXRTZWxlY3Rpb25zKCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgY29udGVudCBtYW5hZ2VyIGVudHJpZXMgdG8gdGhlIG1lbnUgZmlyc3QuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBzdGlsbCBzcGFjZSwgYWRkIHRoZSBcIm5vcm1hbFwiIGNhdGVnb3J5XG4gICAgICAgICAgICAvLyBpdGVtcyBhbHNvXG4gICAgICAgICAgICBfc2hvd0VsZW1lbnRzKCRtb3JlRW50cmllcy5jaGlsZHJlbignLmN1c3RvbScpKTtcbiAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgIF9zaG93RWxlbWVudHMoJG1vcmVFbnRyaWVzLmNoaWxkcmVuKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgaXRlbXMgc3RpbGwgaW4gdGhlIG1vcmUgbWVudVxuICAgICAgICAgICAgLy8gd291bGQgZml0IGluc2lkZSB0aGUgbWFpbiBtZW51IGlmIHRoZSBtb3JlXG4gICAgICAgICAgICAvLyBtZW51IHdvdWxkIGdldCBoaWRkZW5cbiAgICAgICAgICAgIHZhciB3aWR0aCA9IDA7XG4gICAgICAgICAgICAkbW9yZUVudHJpZXNcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggKz0gJCh0aGlzKS5kYXRhKCkud2lkdGg7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh3aWR0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICRtb3JlLmhpZGUoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCAoJG1vcmUuZGF0YSgpLndpZHRoICsgZGlmZikpIHtcbiAgICAgICAgICAgICAgICAkbW9yZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgZGlmZiArPSAkbW9yZS5kYXRhKCkud2lkdGg7XG4gICAgICAgICAgICAgICAgX3Nob3dFbGVtZW50cygkbW9yZUVudHJpZXMuY2hpbGRyZW4oKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIHdoaWNoIGVsZW1lbnRzIG5lZWRzXG4gICAgICAgICAqIHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgbWVudSwgc28gdGhhdCBpdCBmaXRzXG4gICAgICAgICAqIGluc2lkZSBvbmUgbWVudSBsaW5lLiBFdmVyeSBlbGVtZW50IHRoYXQgbmVlZHNcbiAgICAgICAgICogdG8gYmUgcmVtb3ZlZCBnZXRzIHBhc3NlZCB0byB0aGUgZnVuY3Rpb25cbiAgICAgICAgICogXCJfc2V0SXRlbVwiXG4gICAgICAgICAqIEBwYXJhbSAgICAgICB7aW50ZWdlcn0gICAgICAgZGlmZiAgICAgICAgQW1vdW50IG9mIHBpeGVscyB0aGF0IG5lZWRzIHRvIGJlIHNhdmVkXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3JlbW92ZUVsZW1lbnQgPSBmdW5jdGlvbiAoZGlmZikge1xuXG4gICAgICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0aGF0IGNvbnRhaW5zIHRoZSBjaGVja1xuICAgICAgICAgICAgICogbG9vcCBmb3IgZGV0ZXJtaW5pbmcgd2hpY2ggZWxlbWVudHNcbiAgICAgICAgICAgICAqIG5lZWRzIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgICAqIEBwYXJhbSAgICAgICAgICAge29iamVjdH0gICAgJGVsZW1lbnRzICAgICAgIGpRdWVyeSBzZWxlY3Rpb24gb2YgdGhlIG1lbnUgaXRlbXNcbiAgICAgICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHZhciBfaGlkZUVsZW1lbnRzID0gZnVuY3Rpb24gKCRlbGVtZW50cykge1xuICAgICAgICAgICAgICAgICRlbGVtZW50cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoID0gJHNlbGYuZGF0YSgpLndpZHRoO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgcG9zc2libHkgc2V0IG9wZW4gc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgJHNlbGZcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoJy4nICsgb3B0aW9ucy5vcGVuQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkKCRzZWxmLmZpbmQoJy4nICsgb3B0aW9ucy5vcGVuQ2xhc3MpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKG9wdGlvbnMub3BlbkNsYXNzKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIGVudHJ5IHRvIHRoZSBtb3JlLW1lbnVcbiAgICAgICAgICAgICAgICAgICAgX3NldEl0ZW0oJHNlbGYsICRtb3JlRW50cmllcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGlmZiAtPSB3aWR0aDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVub3VnaCBlbGVtZW50cyBhcmUgcmVtb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHF1aXQgdGhlIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgdGhlIHNlbGVjdGlvbiBvZiB0aGUgdmlzaWJsZSBtZW51IGl0ZW1zXG4gICAgICAgICAgICBfZ2V0U2VsZWN0aW9ucygpO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIHdpZHRoIG9mIHRoZSBtb3JlIGVudHJ5IGlmIGl0J3Mgbm90XG4gICAgICAgICAgICAvLyB2aXNpYmxlLCBiZWNhdXNlIGl0IHdpbGwgZ2V0IHNob3duIGR1cmluZyB0aGlzXG4gICAgICAgICAgICAvLyBmdW5jdGlvbiBjYWxsXG4gICAgICAgICAgICBpZiAoJG1vcmUuaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgIGRpZmYgKz0gJG1vcmUuZGF0YSgpLndpZHRoO1xuICAgICAgICAgICAgICAgICRtb3JlLnJlbW92ZUNsYXNzKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICRtb3JlLnNob3coKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRmlyc3QgcmVtb3ZlIFwibm9ybWFsXCIgY2F0ZWdvcnkgZW50cmllcy4gSWYgdGhhdFxuICAgICAgICAgICAgLy8gaXNuJ3QgZW5vdWdoIHJlbW92ZSB0aGUgY29udGVudCBtYW5hZ2VyIGVudHJpZXMgYWxzb1xuICAgICAgICAgICAgX2hpZGVFbGVtZW50cygkKCRjYXRlZ29yaWVzLmdldCgpLnJldmVyc2UoKSkpO1xuICAgICAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgICAgICAgX2hpZGVFbGVtZW50cygkKCRjdXN0b20uZ2V0KCkucmV2ZXJzZSgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgYSBkYXRhIGF0dHJpYnV0ZSB0byB0aGUgbWVudSBpdGVtc1xuICAgICAgICAgKiB0aGF0IGNvbnRhaW5zIHRoZSB3aWR0aCBvZiB0aGUgZWxlbWVudHMuXG4gICAgICAgICAqIFRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgaWYgaXQgaXMgZGlzcGxheVxuICAgICAgICAgKiBub25lIHRoZSBkZXRlY3RlZCB3aXRoIHdpbGwgYmUgemVyby4gSXRcbiAgICAgICAgICogc2V0cyBwb3NpdGlvbiBpZCBhbHNvLlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9pbml0RWxlbWVudFNpemVzQW5kUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkZW50cmllcy5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAkc2VsZi5vdXRlcldpZHRoKCk7XG5cbiAgICAgICAgICAgICAgICAkc2VsZi5kYXRhKHt3aWR0aDogd2lkdGgsIHBvc2l0aW9uOiBpfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNsb3NlIGFsbCBtZW51IGVudHJpZXMuXG4gICAgICAgICAqIE5lZWRlZCBmb3IgdGhlIGRlc2t0b3AgPC0+IG1vYmlsZSB2aWV3XG4gICAgICAgICAqIGNoYW5nZSwgbW9zdGx5LlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jbG9zZU1lbnUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnbGkuJyArIG9wdGlvbnMub3BlbkNsYXNzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKCcubmF2YmFyLWNhdGVnb3JpZXMtbGVmdCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3Mob3B0aW9ucy5vcGVuQ2xhc3MpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBpc09iamVjdCA9IHR5cGVvZiBlICA9PT0nb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBpc0V2ZW50ICA9IGlzT2JqZWN0ID8gZS5oYXNPd25Qcm9wZXJ0eSgnb3JpZ2luYWxFdmVudCcpIDogZmFsc2U7XG4gICAgICAgICAgICBpZihpc0V2ZW50KSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjbGVhciBhbGwgcGVuZGluZ1xuICAgICAgICAgKiBmdW5jdGlvbnNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfY2xlYXJUaW1lb3V0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVudGVyVGltZXIgPSBlbnRlclRpbWVyID8gY2xlYXJUaW1lb3V0KGVudGVyVGltZXIpIDogbnVsbDtcbiAgICAgICAgICAgIGxlYXZlVGltZXIgPSBsZWF2ZVRpbWVyID8gY2xlYXJUaW1lb3V0KGxlYXZlVGltZXIpIDogbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHJlc2V0IHRoZSBjc3Mgb2YgdGhlIG1lbnUuXG4gICAgICAgICAqIFRoaXMgaXMgbmVlZGVkIHRvIHJlbW92ZSB0aGUgb3ZlcmZsb3cgJiBoZWlnaHRcbiAgICAgICAgICogc2V0dGluZ3Mgb2YgdGhlIG1lbnUgb2YgdGhlIGNzcyBmaWxlLiBUaGVcbiAgICAgICAgICogZGlyZWN0aXZlcyB3ZXJlIHNldCB0byBwcmV2ZW50IGZsaWNrZXJpbmcgb24gcGFnZVxuICAgICAgICAgKiBsb2FkXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Jlc2V0SW5pdGlhbENzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICR0aGlzLmNzcyh7XG4gICAgICAgICAgICAgICAgJ292ZXJmbG93JzogJ3Zpc2libGUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBwb3NpdGlvbmluZyBjbGFzc2VzXG4gICAgICAgICAqIHRvIHRoZSBvcGVuZCBmbHlvdXQuIFRoaXMgaXMgbmVlZGVkIHRvIGtlZXBcbiAgICAgICAgICogdGhlIGZseW91dCBpbnNpZGUgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIG5hdmlnYXRpb25cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfcmVwb3NpdGlvbk9wZW5MYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsaXN0V2lkdGggPSAkbGlzdC53aWR0aCgpLFxuICAgICAgICAgICAgICAgICRvcGVuTGF5ZXIgPSAkZW50cmllc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCcuJyArIG9wdGlvbnMub3BlbkNsYXNzKVxuICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJ3VsJyk7XG5cbiAgICAgICAgICAgICRvcGVuTGF5ZXIuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgJHBhcmVudCA9ICRzZWxmLnBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIGNsYXNzZXMgdG8gcHJldmVudCB3cm9uZyBjYWxjdWxhdGlvbiBkdWUgdG8gc3BlY2lhbCBzdHlsZXNcbiAgICAgICAgICAgICAgICAkcGFyZW50LnJlbW92ZUNsYXNzKCdmbHlvdXQtcmlnaHQgZmx5b3V0LWxlZnQgZmx5b3V0LWNlbnRlciBmbHlvdXQtd29udC1maXQnKTtcblxuICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9ICRzZWxmLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50UG9zaXRpb24gPSAkcGFyZW50LnBvc2l0aW9uKCkubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50V2lkdGggPSAkcGFyZW50Lm91dGVyV2lkdGgoKTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHdpdGNoIGNsYXNzIG5lZWRzIHRvIGJlIHNldFxuICAgICAgICAgICAgICAgIGlmIChsaXN0V2lkdGggPiBwYXJlbnRQb3NpdGlvbiArIHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuYWRkQ2xhc3MoJ2ZseW91dC1yaWdodCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyZW50UG9zaXRpb24gKyBwYXJlbnRXaWR0aCAtIHdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkcGFyZW50LmFkZENsYXNzKCdmbHlvdXQtbGVmdCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAod2lkdGggPCBsaXN0V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHBhcmVudC5hZGRDbGFzcygnZmx5b3V0LWNlbnRlcicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuYWRkQ2xhc3MoJ2ZseW91dC13b250LWZpdCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjYWxjdWxhdGUgdGhlIGRpZmZlcmVuY2UgYmV0d2VlblxuICAgICAgICAgKiB0aGUgc2l6ZSBvZiB0aGUgdmlzaWJsZSBlbGVtZW50cyBpbiB0aGUgbWVudSBhbmQgdGhlXG4gICAgICAgICAqIGNvbnRhaW5lciBzaXplLiBJZiB0aGVyZSBpcyBzcGFjZSwgaXQgY2FsbHMgdGhlIGZ1bmN0aW9uXG4gICAgICAgICAqIHRvIGFjdGl2YXRlIGFuIG1lbnUgZW50cnkgZWxzZSBpdCBjYWxscyB0aGUgZnVuY3Rpb24gdG9cbiAgICAgICAgICogZGVhY3RpdmF0ZSBhIG1lbnUgZW50cnlcbiAgICAgICAgICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgIGUgICAgICAgICBqUXVlcnkgZXZlbnQgb2JqZWN0XG4gICAgICAgICAqIEBwYXJhbSAgICAgICB7c3RyaW5nfSAgICBldmVudE5hbWUgRXZlbnQgbmFtZSBwYXJhbWV0ZXIgb2YgdGhlIGV2ZW50IG9iamVjdFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF91cGRhdGVDYXRlZ29yeU1lbnUgPSBmdW5jdGlvbiAoZSwgZXZlbnROYW1lKSB7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVyV2lkdGggPSAkdGhpcy5pbm5lcldpZHRoKCkgLSBvcHRpb25zLndpZHRoVG9sZXJhbmNlLFxuICAgICAgICAgICAgICAgIHdpZHRoID0gMDtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGNvbnRhaW5lciB3aWR0aCBoYXMgY2hhbmdlZCBzaW5jZSBsYXN0IGNhbGxcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1lbnVUeXBlID09PSAnaG9yaXpvbnRhbCdcbiAgICAgICAgICAgICAgICAmJiAoY3VycmVudFdpZHRoICE9PSBjb250YWluZXJXaWR0aCB8fCBldmVudE5hbWUgPT09ICdzd2l0Y2hlZFRvRGVza3RvcCcpKSB7XG5cbiAgICAgICAgICAgICAgICAkbGlzdFxuICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oJzp2aXNpYmxlJylcbiAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggKz0gJCh0aGlzKS5kYXRhKCd3aWR0aCcpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBvciByZW1vdmUgZWxlbWVudHMgZGVwZW5kaW5nIG9uIHRoZSBzaXplIG9mIHRoZVxuICAgICAgICAgICAgICAgIC8vIHZpc2libGUgZWxlbWVudHNcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbmVyV2lkdGggPCB3aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBfcmVtb3ZlRWxlbWVudCh3aWR0aCAtIGNvbnRhaW5lcldpZHRoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfYWRkRWxlbWVudChjb250YWluZXJXaWR0aCAtIHdpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBfcmVwb3NpdGlvbk9wZW5MYXllcigpO1xuXG4gICAgICAgICAgICAgICAgY3VycmVudFdpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHN3aXRjaCB0byB0aGUgbW9iaWxlXG4gICAgICAgICAqIG1vZGUgb2YgdGhlIG1lbnUuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3N3aXRjaFRvTW9iaWxlVmlldyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IHdpZHRoIHNvIHRoYXRcbiAgICAgICAgICAgIC8vIHRoZSBcIl91cGRhdGVDYXRlZ29yeU1lbnVcIiB3aWxsXG4gICAgICAgICAgICAvLyBwZXJmb3JtIGNvcnJlY3RseSBvbiB0aGUgbmV4dCB2aWV3XG4gICAgICAgICAgICAvLyBjaGFuZ2UgdG8gZGVza3RvcFxuICAgICAgICAgICAgY3VycmVudFdpZHRoID0gLTE7XG4gICAgICAgICAgICBfYWRkRWxlbWVudCg5OTk5OTk5OSk7XG5cbiAgICAgICAgICAgICQoJy5sZXZlbC0xJykuY3NzKCdwYWRkaW5nLWJvdHRvbScsICcyMDBweCcpOyAvLyBUaGlzIHBhZGRpbmcgY29ycmVjdHMgZXhwYW5kL2NvbGxhcHNlIGJlaGF2aW9yIG9mIGxvd2VyIG1lbnUgaXRlbXMgaW4gdmFyaW91cyBtb2JpbGUgYnJvd3NlcnMuIFxuXG4gICAgICAgICAgICAvLyBVc2UgdGhlIHZlcnRpY2FsIG1lbnUgb24gbW9iaWxlIHZpZXcuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tZW51VHlwZSA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgIC8vIGZpeGVzIGRpc3BsYXkgaG9yaXpvbnRhbCBtZW51IGFmdGVyIGEgc3dpdGNoIHRvIG1vYmlsZSBhbmQgYmFjayB0byBkZXNrdG9wIGlzIHBlcmZvcm1lZFxuICAgICAgICAgICAgICAgIGlmICgkKCcjY2F0ZWdvcmllcyBuYXYubmF2YmFyLWRlZmF1bHQ6Zmlyc3QnKS5ub3QoJy5uYXYtY2F0ZWdvcmllcy1sZWZ0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjY2F0ZWdvcmllcyBuYXYubmF2YmFyLWRlZmF1bHQ6Zmlyc3QnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuKCkuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIG1vdmUgdG9wbWVudS1jb250ZW50IGl0ZW1zIGZyb20gaG9yaXpvbnRhbCBtZW51IHRvIHZlcnRpY2FsIG1lbnVcbiAgICAgICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgICAgICAuZmluZCgndWwubGV2ZWwtMSBsaS5uYXZiYXItdG9wYmFyLWl0ZW06Zmlyc3QnKVxuICAgICAgICAgICAgICAgICAgICAuYmVmb3JlKCQoJyNjYXRlZ29yaWVzIG5hdi5uYXZiYXItZGVmYXVsdCBsaS50b3BtZW51LWNvbnRlbnQnKS5kZXRhY2goKSk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5hcHBlbmRUbygnI2NhdGVnb3JpZXMgPiAubmF2YmFyLWNvbGxhcHNlJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ25hdmJhci1kZWZhdWx0IG5hdmJhci1jYXRlZ29yaWVzJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndWwubGV2ZWwtMScpLmFkZENsYXNzKCduYXZiYXItbmF2Jyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLm5hdmJhci10b3BiYXItaXRlbScpLm5vdCgnLnRvcGJhci1zZWFyY2gnKS5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICBfYmluZEhvcml6b250YWxFdmVudEhhbmRsZXJzKCk7XG5cbiAgICAgICAgICAgICAgICAkYm9keS50cmlnZ2VyKGpzZS5saWJzLnRoZW1lLmV2ZW50cy5NRU5VX1JFUE9TSVRJT05FRCgpLCBbJ3N3aXRjaGVkVG9Nb2JpbGUnXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBzd2l0Y2ggdG8gdGhlIGRlc2t0b3BcbiAgICAgICAgICogbW9kZSBvZiB0aGUgbWVudS4gQWRkaXRpb25hbGx5LCBpbiBjYXNlIHRoYXRcbiAgICAgICAgICogdGhlIGRlc2t0b3AgbW9kZSBpcyBzaG93biBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgICogc2V0IHRoZSBwb3NpdGlvbiBhbmQgd2lkdGggb2YgdGhlIGVsZW1lbnRzXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3N3aXRjaFRvRGVza3RvcFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcubGV2ZWwtMScpLmNzcygncGFkZGluZy1ib3R0b20nLCAnJyk7IC8vIFJlc2V0IGRpc3BsYXkgZml4IGZvciBtb2JpbGUgYnJvd3NlcnMuXG5cbiAgICAgICAgICAgIC8vIFJldmVydCBhbGwgdGhlIGNoYW5nZXMgbWFkZSBkdXJpbmcgdGhlIHN3aXRjaCB0byBtb2JpbGUuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tZW51VHlwZSA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgICAgIC8vIGZpeGVzIGRpc3BsYXkgaG9yaXpvbnRhbCBtZW51IGFmdGVyIGEgc3dpdGNoIHRvIG1vYmlsZSBhbmQgYmFjayB0byBkZXNrdG9wIGlzIHBlcmZvcm1lZFxuICAgICAgICAgICAgICAgIGlmICgkKCcjY2F0ZWdvcmllcyBuYXYubmF2YmFyLWRlZmF1bHQ6Zmlyc3QnKS5ub3QoJy5uYXYtY2F0ZWdvcmllcy1sZWZ0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjY2F0ZWdvcmllcyBuYXYubmF2YmFyLWRlZmF1bHQ6Zmlyc3QnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2hpbGRyZW4oKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0b3BtZW51LWNvbnRlbnQgaXRlbXMgYmFjayB0byBob3Jpem9udGFsIG1lbnVcbiAgICAgICAgICAgICAgICB2YXIgJHRvcG1lbnVDb250ZW50RWxlbWVudHMgPSAkdGhpcy5maW5kKCdsaS50b3BtZW51LWNvbnRlbnQnKS5kZXRhY2goKTtcbiAgICAgICAgICAgICAgICAkKCcjY2F0ZWdvcmllcyBuYXYubmF2YmFyLWRlZmF1bHQgdWwubGV2ZWwtMTpmaXJzdCcpLmFwcGVuZCgkdG9wbWVudUNvbnRlbnRFbGVtZW50cyk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5hcHBlbmRUbygnLmJveC1jYXRlZ29yaWVzJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoJ25hdmJhci1kZWZhdWx0IG5hdmJhci1jYXRlZ29yaWVzJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndWwubGV2ZWwtMScpLnJlbW92ZUNsYXNzKCduYXZiYXItbmF2Jyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLm5hdmJhci10b3BiYXItaXRlbScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBfdW5iaW5kSG9yaXpvbnRhbEV2ZW50SGFuZGxlcnMoKTtcblxuICAgICAgICAgICAgICAgICRib2R5LnRyaWdnZXIoanNlLmxpYnMudGhlbWUuZXZlbnRzLk1FTlVfUkVQT1NJVElPTkVEKCksIFsnc3dpdGNoZWRUb0Rlc2t0b3AnXSk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKCFpbml0aWFsaXplZFBvcykge1xuICAgICAgICAgICAgICAgIF9pbml0RWxlbWVudFNpemVzQW5kUG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBpbml0aWFsaXplZFBvcyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1lbnVUeXBlID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgICAgICBfdXBkYXRlQ2F0ZWdvcnlNZW51KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNUb3VjaERldmljZSkge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdC5maW5kKCcuZW50ZXItY2F0ZWdvcnknKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0LmZpbmQoJy5kcm9wZG93biA+IGEnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBhZGQgdGhlIGNsYXNzIHRvIHRoZSBsaS1lbGVtZW50XG4gICAgICAgICAqIGRlcGVuZGluZyBvbiB0aGUgb3BlbiBldmVudC4gVGhpcyBjYW4gYmUgYSBcInRvdWNoXCJcbiAgICAgICAgICogb3IgYSBcIm1vdXNlXCIgY2xhc3NcbiAgICAgICAgICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgICR0YXJnZXQgICAgICAgICBqUXVlcnkgc2VsZWN0aW9uIG9mIHRoZSBsaS1lbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSAgICAgICB7c3RyaW5nfSAgICBjbGFzc05hbWUgICAgICAgTmFtZSBvZiB0aGUgY2xhc3MgdGhhdCBnZXRzIGFkZGVkXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3NldEV2ZW50VHlwZUNsYXNzID0gZnVuY3Rpb24gKCR0YXJnZXQsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgJHRhcmdldFxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygndG91Y2ggbW91c2UnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhjbGFzc05hbWUgfHwgJycpO1xuICAgICAgICB9O1xuXG5cbi8vICMjIyMjIyMjIyMgTUFJTiBGVU5DVElPTkFMSVRZICMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogRnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCBieSB0aGUgYnJlYWtwb2ludCB0cmlnZ2VyXG4gICAgICAgICAqICh3aGljaCBpcyBmaXJlZCBvbiBicm93c2VyIHJlc2l6ZSkuIEl0IGNoZWNrcyBmb3JcbiAgICAgICAgICogQ1NTIHZpZXcgY2hhbmdlcyBhbmQgcmVjb25maWd1cmVzIHRoZSB0aGUgSlMgYmVoYXZpb3VyXG4gICAgICAgICAqIG9mIHRoZSBtZW51IGluIHRoYXQgY2FzZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9icmVha3BvaW50SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBjdXJyZW50IHZpZXdtb2RlXG4gICAgICAgICAgICB2YXIgb2xkTW9kZSA9IG1vZGUgfHwge30sXG4gICAgICAgICAgICAgICAgbmV3TW9kZSA9IGpzZS5saWJzLnRoZW1lLnJlc3BvbnNpdmUuYnJlYWtwb2ludCgpO1xuXG4gICAgICAgICAgICAvLyBPbmx5IGRvIHNvbWV0aGluZyBpZiB0aGUgdmlldyB3YXMgY2hhbmdlZFxuICAgICAgICAgICAgaWYgKG5ld01vZGUuaWQgIT09IG9sZE1vZGUuaWQpIHtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGEgdmlldyBjaGFuZ2UgYmV0d2VlbiBtb2JpbGUgYW5kIGRlc2t0b3AgdmlldyB3YXMgbWFkZVxuICAgICAgICAgICAgICAgIHZhciBzd2l0Y2hUb01vYmlsZSA9IChuZXdNb2RlLmlkIDw9IG9wdGlvbnMuYnJlYWtwb2ludCAmJiAoIW1vYmlsZSB8fCBvbGRNb2RlLmlkID09PSB1bmRlZmluZWQpKSxcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoVG9EZXNrdG9wID0gKG5ld01vZGUuaWQgPiBvcHRpb25zLmJyZWFrcG9pbnQgJiYgKG1vYmlsZSB8fCBvbGRNb2RlLmlkID09PSB1bmRlZmluZWQpKTtcblxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBuZXcgdmlldyBzZXR0aW5nc1xuICAgICAgICAgICAgICAgIG1vYmlsZSA9IG5ld01vZGUuaWQgPD0gb3B0aW9ucy5icmVha3BvaW50O1xuICAgICAgICAgICAgICAgIG1vZGUgPSAkLmV4dGVuZCh7fSwgbmV3TW9kZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3dpdGNoVG9Nb2JpbGUgfHwgc3dpdGNoVG9EZXNrdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIF9jbGVhclRpbWVvdXRzKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm1lbnVUeXBlICE9PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xvc2VNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgdGhlIHZpc2liaWxpdHkgb2YgdGhlIG1lbnUgaXRlbXNcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gY2FzZSBvZiBkZXNrdG9wIDwtPiBtb2JpbGUgdmlldyBjaGFuZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3dpdGNoRWxlbWVudFBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3dpdGNoVG9Nb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3dpdGNoVG9Nb2JpbGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zd2l0Y2hUb0Rlc2t0b3BWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVwb3NpdGlvbk9wZW5MYXllcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFtb2JpbGUgJiYgb3B0aW9ucy5zd2l0Y2hFbGVtZW50UG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBtZW51IGl0ZW1zXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB2aWV3IGNoYW5nZSB3YXMgZGVza3RvcCB0byBkZXNrdG9wIG9ubHlcbiAgICAgICAgICAgICAgICAgICAgX3VwZGF0ZUNhdGVnb3J5TWVudSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIW1vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBfcmVwb3NpdGlvbk9wZW5MYXllcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG5cblxuLy8gIyMjIyMjIyMjIEVWRU5UIEhBTkRMRVIgIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFuZ2VzIHRoZSBlcGFuZCAvIGNvbGxhcHNlIHN0YXRlIG9mIHRoZSBtZW51LFxuICAgICAgICAgKiBpZiB0aGVyZSBpcyBhbiBzdWJtZW51LiBJbiB0aGUgb3RoZXIgY2FzZSBpdFxuICAgICAgICAgKiB3aWxsIGxldCBleGVjdXRlIHRoZSBkZWZhdWx0IGFjdGlvbiAobW9zdCB0aW1lc1xuICAgICAgICAgKiB0aGUgZXhlY3V0aW9uIG9mIGEgbGluaylcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9ICBlICAgICAgIGpRdWVyeSBldmVudCBvYmplY3RcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICBtb2RlICAgIFRoZSBjdXJyZW50IHZpZXcgbW9kZSAoY2FuIGJlIFwibW9iaWxlXCIgb3IgXCJkZXNrdG9wXCJcbiAgICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBkZWxheSAgIEN1c3RvbSBkZWxheSAoaW4gbXMpIGZvciBvcGVuaW5nIGNsb3NpbmcgdGhlIG1lbnUgKG5lZWRlZCBmb3IgY2xpY2sgLyB0b3VjaCBldmVudHMpXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29wZW5NZW51ID0gZnVuY3Rpb24gKGUsIHR5cGUsIGRlbGF5KSB7XG5cbiAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHN1Ym1lbnUgPSAkc2VsZi5jaGlsZHJlbihcInVsLmRyb3Bkb3duLW1lbnVcIiksXG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gJHN1Ym1lbnUubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGxldmVsID0gKCRzdWJtZW51Lmxlbmd0aCkgPyAoJHN1Ym1lbnUuZGF0YSgnbGV2ZWwnKSB8fCAnMCcpIDogOTksXG4gICAgICAgICAgICAgICAgdmFsaWRTdWJtZW51ID0gKHBhcnNlSW50KGxldmVsLCAxMCkgPD0gMiAmJiBtb2RlLmlkID4gb3B0aW9ucy5icmVha3BvaW50KSB8fCBtb2RlLmlkXG4gICAgICAgICAgICAgICAgICAgIDw9IG9wdGlvbnMuYnJlYWtwb2ludDtcblxuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtb2JpbGUnKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gT25seSBjaGFuZ2UgdGhlIHN0YXRlIGlmIHRoZXJlIGlzXG4gICAgICAgICAgICAvLyBhIHN1Ym1lbnVcbiAgICAgICAgICAgIGlmIChsZW5ndGggJiYgdmFsaWRTdWJtZW51KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtb2JpbGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbXBseSB0b2dnbGUgdGhlIG9wZW5DbGFzcyBpbiBtb2JpbGUgbW9kZVxuICAgICAgICAgICAgICAgICAgICAkc2VsZi50b2dnbGVDbGFzcyhvcHRpb25zLm9wZW5DbGFzcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUGVyZm9ybSB0aGUgZWxzZSBjYXNlIGZvciB0aGUgZGVza3RvcCB2aWV3XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpc2libGUgPSAkc2VsZi5oYXNDbGFzcyhvcHRpb25zLm9wZW5DbGFzcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWF2ZSA9ICRzZWxmLmhhc0NsYXNzKCdsZWF2ZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gKGUuZGF0YSAmJiBlLmRhdGEuYWN0aW9uKSA/IGUuZGF0YS5hY3Rpb24gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2aXNpYmxlICYmIGxlYXZlKSA/ICdlbnRlcicgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlID8gJ2xlYXZlJyA6ICdlbnRlcic7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGVwZW5kaW5nIG9uIHRoZSB2aXNpYmlsaXR5IGFuZCB0aGUgZXZlbnQtYWN0aW9uLXBhcmFtZXRlclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgc3VibWVudSBnZXRzIG9wZW5lZCBvciBjbG9zZWRcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VudGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9uRW50ZXIgJiYgIWpzZS5saWJzLnRoZW1lLmludGVyYWN0aW9uLmlzTW91c2VEb3duKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FbnRlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBhIHRpbWVyIGZvciBvcGVuaW5nIGlmIHRoZSBzdWJtZW51IChkZWxheWVkIG9wZW5pbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGVhclRpbWVvdXRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudGVyVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvcGVuQ2xhc3MtY2xhc3NlcyBmcm9tIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWVudSBleGNlcHQgdGhlIGVsZW1lbnQgdG8gb3BlbiBhbmQgaXQncyBwYXJlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuJyArIG9wdGlvbnMub3BlbkNsYXNzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ub3QoJHNlbGYpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5vdCgkc2VsZi5wYXJlbnRzVW50aWwoJHRoaXMsICcuJyArIG9wdGlvbnMub3BlbkNsYXNzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcihqc2UubGlicy50aGVtZS5ldmVudHMuVFJBTlNJVElPTl9TVE9QKCksIFtdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhvcHRpb25zLm9wZW5DbGFzcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5sZWF2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoanNlLmxpYnMudGhlbWUuZXZlbnRzLlRSQU5TSVRJT05fU1RPUCgpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2xlYXZlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9wZW4gdGhlIHN1Ym1lbnVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24ub3BlbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBhbmQgdW5zZXQgdGhlIFwib25FbnRlclwiIHRvIHByZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNsb3NpbmcgdGhlIG1lbnUgaW1tZWRpYXRlbHkgYWZ0ZXIgb3BlbmluZyBpZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGN1cnNvciBpcyBhdCBhbiBwbGFjZSBvdmVyIHRoZSBvcGVuaW5nIG1lbnVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICh0aGlzIGNhbiBoYXBwZW4gaWYgb3RoZXIgY29tcG9uZW50cyB0cmlnZ2VyIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3BlbiBldmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9mZihqc2UubGlicy50aGVtZS5ldmVudHMuVFJBTlNJVElPTl9GSU5JU0hFRCgpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbmUoanNlLmxpYnMudGhlbWUuZXZlbnRzLlRSQU5TSVRJT05fRklOSVNIRUQoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkVudGVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcihqc2UubGlicy50aGVtZS5ldmVudHMuVFJBTlNJVElPTigpLCB0cmFuc2l0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKGpzZS5saWJzLnRoZW1lLmV2ZW50cy5PUEVOX0ZMWU9VVCgpLCBbJHRoaXNdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlcG9zaXRpb25PcGVuTGF5ZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgKHR5cGVvZiBkZWxheSA9PT0gJ251bWJlcicpID8gZGVsYXkgOiBvcHRpb25zLmVudGVyRGVsYXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdsZWF2ZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FbnRlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBhIHRpbWVyIGZvciBjbG9zaW5nIGlmIHRoZSBzdWJtZW51IChkZWxheWVkIGNsb3NpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NsZWFyVGltZW91dHMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5hZGRDbGFzcygnbGVhdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWF2ZVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgb3BlbkNsYXNzLWNsYXNzZXMgZnJvbSB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWVudSBleGNlcHQgdGhlIGVsZW1lbnRzIHBhcmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5vcGVuID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLicgKyBvcHRpb25zLm9wZW5DbGFzcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ub3QoJHNlbGYucGFyZW50c1VudGlsKCR0aGlzLCAnLicgKyBvcHRpb25zLm9wZW5DbGFzcykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub2ZmKGpzZS5saWJzLnRoZW1lLmV2ZW50cy5UUkFOU0lUSU9OX0ZJTklTSEVEKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAub25lKGpzZS5saWJzLnRoZW1lLmV2ZW50cy5UUkFOU0lUSU9OX0ZJTklTSEVEKCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2V0RXZlbnRUeXBlQ2xhc3MoJHNlbGYsICcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5yZW1vdmVDbGFzcygnbGVhdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcihqc2UubGlicy50aGVtZS5ldmVudHMuVFJBTlNJVElPTigpLCB0cmFuc2l0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgKHR5cGVvZiBkZWxheSA9PT0gJ251bWJlcicpID8gZGVsYXkgOiBvcHRpb25zLmxlYXZlRGVsYXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXZlbnQgaGFuZGxlciBmb3IgdGhlIGNsaWNrIC8gbW91c2VlbnRlciAvIG1vdXNlbGVhdmUgZXZlbnRcbiAgICAgICAgICogb24gdGhlIG5hdmlnYXRpb24gbGkgZWxlbWVudHMuIEl0IGNoZWNrcyBpZiB0aGUgZXZlbnQgdHlwZVxuICAgICAgICAgKiBpcyBzdXBwb3J0ZWQgZm9yIHRoZSBjdXJyZW50IHZpZXcgdHlwZSBhbmQgY2FsbHMgdGhlXG4gICAgICAgICAqIG9wZW5NZW51LWZ1bmN0aW9uIGlmIHNvLlxuICAgICAgICAgKiBAcGFyYW0gICAgICAge29iamVjdH0gICAgZSAgICAgICAgICAgalF1ZXJ5IGV2ZW50IG9iamVjdFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9tb3VzZUhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB2aWV3cG9ydCA9IG1vZGUuaWQgPD0gb3B0aW9ucy5icmVha3BvaW50ID8gJ21vYmlsZScgOiAnZGVza3RvcCcsXG4gICAgICAgICAgICAgICAgZXZlbnRzID0gKG9wdGlvbnMuZXZlbnRzICYmIG9wdGlvbnMuZXZlbnRzW3ZpZXdwb3J0XSkgPyBvcHRpb25zLmV2ZW50c1t2aWV3cG9ydF0gOiBbXTtcblxuICAgICAgICAgICAgX3NldEV2ZW50VHlwZUNsYXNzKCRzZWxmLCAnbW91c2UnKTtcbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZS5kYXRhLmV2ZW50LCBldmVudHMpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBfb3Blbk1lbnUuY2FsbCgkc2VsZiwgZSwgdmlld3BvcnQsIGUuZGF0YS5kZWxheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBlcmZvcm0gbmF2aWdhdGlvbiBmb3IgY3VzdG9tIGxpbmtzIGFuZCBjYXRlZ29yeSBsaW5rcyBvbiB0b3VjaCBkZXZpY2VzIGlmIG5vIHN1YmNhdGVnb3JpZXMgYXJlIGZvdW5kLlxuICAgICAgICAgICAgaWYgKCgkc2VsZi5oYXNDbGFzcygnY3VzdG9tJykgfHwgKGlzVG91Y2hEZXZpY2UgJiYgJHNlbGYuY2hpbGRyZW4oJ3VsJykubGVuZ3RoID09IDApKVxuICAgICAgICAgICAgICAgICYmIGUuZGF0YS5ldmVudCA9PT0gJ2NsaWNrJyAmJiAhJHNlbGYuZmluZCgnZm9ybScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRzZWxmLmZpbmQoJ2EnKS5hdHRyKCd0YXJnZXQnKSA9PT0gJ19ibGFuaycpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oJHNlbGYuZmluZCgnYScpLmF0dHIoJ2hyZWYnKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9ICRzZWxmLmZpbmQoJ2EnKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgdG91Y2hzdGFydCBldmVudCAob3IgXCJwb2ludGVyZG93blwiXG4gICAgICAgICAqIGRlcGVuZGluZyBvbiB0aGUgYnJvd3NlcikuIEl0IHJlbW92ZXMgdGhlIG90aGVyIGNyaXRpY2FsXG4gICAgICAgICAqIGV2ZW50IGhhbmRsZXIgKHRoYXQgd291bGQgb3BlbiB0aGUgbWVudSkgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKiBlbGVtZW50IGlmIHRoZSB0aGUgbW91c2VlbnRlciB3YXMgZXhlY3V0ZWQgYmVmb3JlIGFuZFxuICAgICAgICAgKiBhIGNsaWNrIG9yIHRvdWNoIGV2ZW50IHdpbGwgYmUgcGVyZm9ybWVkIGFmdGVyd2FyZHMuIFRoaXNcbiAgICAgICAgICogaXMgbmVlZGVkIHRvIHByZXZlbnQgdGhlIGJyb3dzZXIgZW5naW5lIHdvcmthcm91bmRzIHdoaWNoXG4gICAgICAgICAqIHdpbGwgYXV0b21hdGljYWxseSBwZXJmb3JtIG1vdXNlIC8gY2xpY2stZXZlbnRzIG9uIHRvdWNoXG4gICAgICAgICAqIGFsc28uXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3RvdWNoSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHZpZXdwb3J0ID0gbW9kZS5pZCA8PSBvcHRpb25zLmJyZWFrcG9pbnQgPyAnbW9iaWxlJyA6ICdkZXNrdG9wJyxcbiAgICAgICAgICAgICAgICBldmVudHMgPSAob3B0aW9ucy5ldmVudHMgJiYgb3B0aW9ucy5ldmVudHNbdmlld3BvcnRdKSA/IG9wdGlvbnMuZXZlbnRzW3ZpZXdwb3J0XSA6IFtdO1xuXG4gICAgICAgICAgICAkbGlzdC5maW5kKCcuZW50ZXItY2F0ZWdvcnknKS5zaG93KCk7XG4gICAgICAgICAgICAkbGlzdC5maW5kKCcuZHJvcGRvd24gPiBhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGUuZGF0YS50eXBlID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgICAgICAgdG91Y2hlU3RhcnRFdmVudCA9IHtldmVudDogZSwgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgdG9wOiAkd2luZG93LnNjcm9sbFRvcCgpfTtcbiAgICAgICAgICAgICAgICAkbGlzdC5vZmYoJ21vdXNlZW50ZXIubWVudSBtb3VzZWxlYXZlLm1lbnUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJC5pbkFycmF5KCd0b3VjaCcsIGV2ZW50cykgPiAtMSAmJiAhX3RvdWNoTW92ZURldGVjdChlKSkge1xuICAgICAgICAgICAgICAgIF9zZXRFdmVudFR5cGVDbGFzcygkc2VsZiwgJ3RvdWNoJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KCdob3ZlcicsIGV2ZW50cykgPT09IC0xIHx8IHRvdWNoRXZlbnRzLnN0YXJ0ICE9PSAncG9pbnRlcmRvd24nKSB7XG4gICAgICAgICAgICAgICAgICAgIF9vcGVuTWVudS5jYWxsKCRzZWxmLCBlLCB2aWV3cG9ydCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJGxpc3Qub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXIubWVudScsICdsaScsIHtldmVudDogJ2hvdmVyJ30sIF9tb3VzZUhhbmRsZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUubWVudScsICdsaScsIHtldmVudDogJ2hvdmVyJywgYWN0aW9uOiAnbGVhdmUnfSwgX21vdXNlSGFuZGxlcik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdG9yZXMgdGhlIGxhc3QgdG91Y2ggcG9zaXRpb24gb24gdG91Y2htb3ZlXG4gICAgICAgICAqIEBwYXJhbSAgICAgICBlICAgICAgIGpRdWVyeSBldmVudCBvYmplY3RcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfdG91Y2hNb3ZlSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB0b3VjaGVFbmRFdmVudCA9IHtldmVudDogZSwgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgdG9wOiAkd2luZG93LnNjcm9sbFRvcCgpfTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRXZlbnQgaGFuZGxlciBmb3IgY2xvc2luZyB0aGUgbWVudSBpZlxuICAgICAgICAgKiB0aGUgdXNlciBpbnRlcmFjdHMgd2l0aCB0aGUgcGFnZVxuICAgICAgICAgKiBvdXRzaWRlIG9mIHRoZSBtZW51XG4gICAgICAgICAqIEBwYXJhbSAgICAgICB7b2JqZWN0fSAgICBlICAgICAgIGpRdWVyeSBldmVudCBvYmplY3RcbiAgICAgICAgICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgIGQgICAgICAgalF1ZXJ5IHNlbGVjdGlvbiBvZiB0aGUgZXZlbnQgZW1pdHRlclxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jbG9zZUZseW91dCA9IGZ1bmN0aW9uIChlLCBkKSB7XG4gICAgICAgICAgICBpZiAoZCAhPT0gJHRoaXMgJiYgJHRoaXMuZmluZCgkKGUudGFyZ2V0KSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIG9wZW4gYW5kIGNsb3NlIHRpbWVyXG4gICAgICAgICAgICAgICAgX2NsZWFyVGltZW91dHMoKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgc3RhdGUtY2xhc3NlcyBmcm9tIHRoZSBtZW51XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubWVudVR5cGUgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgICAgICAgICAkbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy50b3VjaCwgLm1vdXNlLCAubGVhdmUsIC4nICsgb3B0aW9ucy5vcGVuQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RvdWNoIG1vdXNlIGxlYXZlICcgKyBvcHRpb25zLm9wZW5DbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfb25DbGlja0FjY29yZGlvbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wYXJlbnRzKCcubmF2YmFyLXRvcGJhci1pdGVtJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2Ryb3Bkb3duJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhvcHRpb25zLm9wZW5DbGFzcykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKG9wdGlvbnMub3BlbkNsYXNzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy4nICsgb3B0aW9ucy5vcGVuQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3B0aW9ucy5vcGVuQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhvcHRpb25zLm9wZW5DbGFzcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnRzVW50aWwoJHRoaXMsICdsaScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3Mob3B0aW9ucy5vcGVuQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9ICQodGhpcykuZmluZCgnYScpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2JpbmRIb3Jpem9udGFsRXZlbnRIYW5kbGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRsaXN0XG4gICAgICAgICAgICAgICAgLm9uKHRvdWNoRXZlbnRzLnN0YXJ0ICsgJy5tZW51JywgJ2xpJywge3R5cGU6ICdzdGFydCd9LCBfdG91Y2hIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbih0b3VjaEV2ZW50cy5tb3ZlICsgJy5tZW51JywgJ2xpJywge3R5cGU6ICdzdGFydCd9LCBfdG91Y2hNb3ZlSGFuZGxlcilcbiAgICAgICAgICAgICAgICAub24odG91Y2hFdmVudHMuZW5kICsgJy5tZW51JywgJ2xpJywge3R5cGU6ICdlbmQnfSwgX3RvdWNoSGFuZGxlcilcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrLm1lbnUnLCAnbGknLCB7ZXZlbnQ6ICdjbGljaycsICdkZWxheSc6IDB9LCBfbW91c2VIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VlbnRlci5tZW51JywgJ2xpJywge2V2ZW50OiAnaG92ZXInLCBhY3Rpb246ICdlbnRlcid9LCBfbW91c2VIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZS5tZW51JywgJ2xpJywge2V2ZW50OiAnaG92ZXInLCBhY3Rpb246ICdsZWF2ZSd9LCBfbW91c2VIYW5kbGVyKTtcblxuICAgICAgICAgICAgJGJvZHlcbiAgICAgICAgICAgICAgICAub24oanNlLmxpYnMudGhlbWUuZXZlbnRzLk1FTlVfUkVQT1NJVElPTkVEKCksIF91cGRhdGVDYXRlZ29yeU1lbnUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfdW5iaW5kSG9yaXpvbnRhbEV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkbGlzdFxuICAgICAgICAgICAgICAgIC5vZmYodG91Y2hFdmVudHMuc3RhcnQgKyAnLm1lbnUnLCAnbGknKVxuICAgICAgICAgICAgICAgIC5vZmYodG91Y2hFdmVudHMubW92ZSArICcubWVudScsICdsaScpXG4gICAgICAgICAgICAgICAgLm9mZih0b3VjaEV2ZW50cy5lbmQgKyAnLm1lbnUnLCAnbGknKVxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLm1lbnUnLCAnbGknKVxuICAgICAgICAgICAgICAgIC5vZmYoJ21vdXNlZW50ZXIubWVudScsICdsaScpXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VsZWF2ZS5tZW51JywgJ2xpJyk7XG4gICAgICAgIH07XG5cbi8vICMjIyMjIyMjIyMgSU5JVElBTElaQVRJT04gIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IGZ1bmN0aW9uIG9mIHRoZSB3aWRnZXRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAvLyBAdG9kbyBHZXR0aW5nIHRoZSBcInRvdWNoRXZlbnRzXCIgY29uZmlnIHZhbHVlIHByb2R1Y2VzIHByb2JsZW1zIGluIHRhYmxldCBkZXZpY2VzLlxuICAgICAgICAgICAgdG91Y2hFdmVudHMgPSBqc2UuY29yZS5jb25maWcuZ2V0KCd0b3VjaCcpO1xuICAgICAgICAgICAgdHJhbnNpdGlvbi5jbGFzc09wZW4gPSBvcHRpb25zLm9wZW5DbGFzcztcblxuICAgICAgICAgICAgX2dldFNlbGVjdGlvbnMoKTtcbiAgICAgICAgICAgIF9yZXNldEluaXRpYWxDc3MoKTtcblxuICAgICAgICAgICAgJGJvZHlcbiAgICAgICAgICAgICAgICAub24oanNlLmxpYnMudGhlbWUuZXZlbnRzLkJSRUFLUE9JTlQoKSwgX2JyZWFrcG9pbnRIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbihqc2UubGlicy50aGVtZS5ldmVudHMuT1BFTl9GTFlPVVQoKSArICcgY2xpY2sgJyArIHRvdWNoRXZlbnRzLmVuZCwgX2Nsb3NlRmx5b3V0KTtcblxuICAgICAgICAgICAgJCgnLmNsb3NlLW1lbnUtY29udGFpbmVyJykub24oJ3RvdWNoc3RhcnQgdG91Y2hlbmQgY2xpY2snLCBfY2xvc2VNZW51KVxuXG4gICAgICAgICAgICAkKCcuY2xvc2UtZmx5b3V0Jykub24oJ3RvdWNoc3RhcnQgdG91Y2hlbmQgY2xpY2snLCBfY2xvc2VNZW51KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWVudVR5cGUgPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgICAgIF9iaW5kSG9yaXpvbnRhbEV2ZW50SGFuZGxlcnMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWVudVR5cGUgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5hY2NvcmRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJ2xpJywgX29uQ2xpY2tBY2NvcmRpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHRvcCBoZWFkZXIgd2UgbXVzdCBjcmVhdGUgZHVtbXkgaHRtbCBiZWNhdXNlIG90aGVyIG1vZHVsZXMgd2lsbCBub3Qgd29yayBjb3JyZWN0bHlcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2NhdGVnb3JpZXMnKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGh0bWwgPSAnPGRpdiBpZD1cImNhdGVnb3JpZXNcIj48ZGl2IGNsYXNzPVwibmF2YmFyLWNvbGxhcHNlIGNvbGxhcHNlXCI+J1xuICAgICAgICAgICAgICAgICAgICAgICAgKyAnPG5hdiBjbGFzcz1cIm5hdmJhci1kZWZhdWx0IG5hdmJhci1jYXRlZ29yaWVzIGhpZGRlblwiPjwvbmF2PjwvZGl2PjwvZGl2Pic7XG4gICAgICAgICAgICAgICAgICAgICQoJyNoZWFkZXInKS5hcHBlbmQoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfYnJlYWtwb2ludEhhbmRsZXIoKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBTdG9wIHRoZSBwcm9wYWdhdGlvbiBvZiB0aGUgZXZlbnRzIGluc2lkZSB0aGlzIGNvbnRhaW5lclxuICAgICAgICAgICAgICogKFdvcmthcm91bmQgZm9yIHRoZSBcIm1vcmVcIi1kcm9wZG93bilcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZCgnLicgKyBvcHRpb25zLmlnbm9yZUNsYXNzKVxuICAgICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZS5tZW51IG1vdXNlZW50ZXIubWVudSBjbGljay5tZW51ICcgKyB0b3VjaEV2ZW50cy5zdGFydCArICcgJ1xuICAgICAgICAgICAgICAgICAgICArIHRvdWNoRXZlbnRzLmVuZCwgJ2xpJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMub3BlbkFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHZhciAkYWN0aXZlID0gJHRoaXMuZmluZCgnLmFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRhY3RpdmVcbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudHNVbnRpbCgkdGhpcywgJ2xpJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJ2xpLmN1c3RvbS1lbnRyaWVzIGEnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIHZpZXdwb3J0ID0gbW9kZS5pZCA8PSBvcHRpb25zLmJyZWFrcG9pbnQgPyAnbW9iaWxlJyA6ICdkZXNrdG9wJztcblxuICAgICAgICAgICAgaWYgKHZpZXdwb3J0ID09ICdtb2JpbGUnKSB7XG4gICAgICAgICAgICAgICAgJCgnLmxldmVsLTEnKS5jc3MoJ3BhZGRpbmctYm90dG9tJywgJzIwMHB4Jyk7IC8vIFRoaXMgcGFkZGluZyBjb3JyZWN0cyBleHBhbmQvY29sbGFwc2UgYmVoYXZpb3Igb2YgbG93ZXIgbWVudSBpdGVtcyBpbiB2YXJpb3VzIG1vYmlsZSBicm93c2Vycy4gXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byB3aWRnZXQgZW5naW5lXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
