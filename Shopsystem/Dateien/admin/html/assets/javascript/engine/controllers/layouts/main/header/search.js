'use strict';

/* --------------------------------------------------------------
 search.js 2018-09-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Global Search Controller Module
 */
gx.controllers.module('search', ['user_configuration_service', 'loading_spinner', gx.source + '/libs/search', gx.source + '/libs/shortcuts'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    // Module element, which represents the info box.

    var $this = $(this);

    // Module default parameters.
    var defaults = {
        // Recent search area.
        recentSearchArea: 'categories',

        // Hyperlink open mode.
        openMode: '_self'
    };

    // Module options.
    var options = $.extend(true, {}, defaults, data);

    // Elements.
    var elements = {
        // Search term input.
        input: $this.find('.input'),

        // Search area list.
        list: $this.find('.list'),

        // Search area list item.
        listItems: $this.find('.list-item'),

        // Search input trigger button.
        button: $('.actions .search')
    };

    // Element selector strings.
    var selectors = {
        // List item search term placeholder selector string.
        placeholder: '.placeholder'
    };

    // Attributes.
    var attributes = {
        // Data attributes.
        data: { searchArea: 'searchArea' }
    };

    // Event key codes.
    var keyCodes = {
        esc: 27,
        arrowUp: 38,
        arrowDown: 40,
        enter: 13
    };

    // Module object.
    var module = {
        bindings: { input: elements.input }
    };

    // Current selected search area.
    var searchArea = null;

    // Do focus on search input?
    var doInputFocus = false;

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Sets the search area and activates the respective list item element.
     *
     * @param {String} area Search area name.
     */
    function _setSearchArea(area) {
        // Active list item CSS class.
        var activeClass = 'active';

        // Set internal area value.
        searchArea = area;

        // Set class.
        elements.listItems.removeClass(activeClass).filter('li[data-search-area="' + area + '"]').addClass(activeClass);
    }

    /**
     * Handles event for the click action on the input field.
     */
    function _onInputClick() {
        _fillTermInListItems();
        _toggleDropdown(true);
    }

    /**
     * Handles event for the key up press action within the input field.
     *
     * @param {jQuery.Event} event Event fired.
     */
    function _onInputKeyUp(event) {
        switch (event.which) {
            // Hide search bar on escape key.
            case keyCodes.esc:
                _toggleDropdown(false);
                elements.input.trigger('blur');
                break;

            // Start the search on return key.
            case keyCodes.enter:
                _performSearch();
                break;

            // Cycle selection through search entity list items on vertical arrow keys.
            case keyCodes.arrowUp:
            case keyCodes.arrowDown:
                // Direction.
                var isUp = event.which === keyCodes.arrowUp;

                // Current search area list item
                var $currentItem = elements.listItems.filter('.active');

                // First search area list item.
                var $firstItem = elements.listItems.first();

                // Last search area list item.
                var $lastItem = elements.listItems.last();

                // Determine the next selected element.
                var $followingItem = isUp ? $currentItem.prev() : $currentItem.next();

                // If there is no next element, then the first/last element is selected.
                if (!$followingItem.length) {
                    $followingItem = isUp ? $lastItem : $firstItem;
                }

                // Fetch search area from next list item.
                var area = $followingItem.data(attributes.data.searchArea);

                // Set entity value and select entity on the list item and set placeholder.
                _setSearchArea(area);

                break;

            // Fill search term into dropdown list items on letter keypress.
            default:
                if ($(elements.input).val().length) {
                    $(this).parent().addClass('searching');
                } else {
                    $(this).parent().removeClass('searching');
                }
                _toggleDropdown(true);
                _fillTermInListItems();
        }
    }

    /**
     * Handles event for the click action outside of the controller area.
     *
     * @param {jQuery.Event} event Event fired.
     */
    function _onOutsideClick(event) {
        // Clicked target element.
        var $target = event.target;

        // Target element verifiers.
        var isNotTargetSearchArea = !$this.has($target).length;
        var isNotTargetSearchButton = !elements.button.has($target).length;

        // Clear the placeholder and hide dropdown,
        // if clicked target is not within search area.
        if (isNotTargetSearchArea && isNotTargetSearchButton) {
            _toggleDropdown(false);
            elements.input.trigger('blur');
        }
    }

    /**
     * Handles event for the click action on a dropdown list item.
     *
     * @param {jQuery.Event} event Event fired.
     */
    function _onListClick(event) {
        // Get entity from list item.
        var area = $(event.currentTarget).data(attributes.data.searchArea);

        _setSearchArea(area);
        _performSearch();
    }

    /**
     * Handles event for the button click action.
     *
     * @private
     */
    function _onButtonClick() {
        // Proxy click and focus to the search input field.
        elements.input.trigger('click').trigger('focus');
    }

    /**
     * Handles event for window inactivation.
     */
    function _onWindowBlur() {
        _toggleDropdown(false);
        elements.input.trigger('blur');
    }

    /**
     * Handles the set input value custom event method.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {String} value Desired input value.
     * @param {Boolean} doFocus Do focus on the input field?
     */
    function _onSetValue(event, value, doFocus) {
        // Set admin search input value.
        elements.input.val(value).trigger('keyup');

        // Register admin search input focus trigger.
        doInputFocus = !!doFocus;
    }

    /**
     * Handles JSEngine finish event.
     */
    function _onEngineFinished() {
        // Trigger focus on admin search input field, if registered.
        if (doInputFocus) {
            elements.input.trigger('focus');
        }

        // Set search entity.
        _setSearchArea(options.recentSearchArea);
    }

    /**
     * Prepends the current search term into the dropdown list items.
     */
    function _fillTermInListItems() {
        elements.list.find(selectors.placeholder).each(function (index, element) {
            return $(element).text(module.bindings.input.get());
        });
    }

    /**
     * Shows and hides the dropdown.
     *
     * @param {Boolean} doShow Show the dropdown?
     */
    function _toggleDropdown(doShow) {
        // Class for visible dropdown.
        var ACTIVE_CLASS = 'active';

        // Toggle dropdown dependent on the provided boolean value.
        elements.list[doShow ? 'addClass' : 'removeClass'](ACTIVE_CLASS);
    }

    /**
     * Saves the search entity to the user configuration and performs the search.
     */
    function _performSearch() {
        // Set default search area if non provided.
        searchArea = searchArea || defaults.recentSearchArea;

        // Check search area URL availability.
        if (!Object.keys(jse.libs.search.urls).includes(searchArea)) {
            throw new Error('No URL for search area "' + searchArea + '" found.');
        }

        // Display loading spinner.
        var $spinner = jse.libs.loading_spinner.show(elements.list, '9999');

        // Compose search URL with search term.
        var url = jse.libs.search.urls[searchArea] + encodeURIComponent(module.bindings.input.get());

        // Save selected entity to server via user configuration service.
        jse.libs.user_configuration_service.set({
            data: {
                userId: jse.core.registry.get('userId'),
                configurationKey: jse.libs.search.configurationKey,
                configurationValue: searchArea
            },
            onSuccess: function onSuccess() {
                window.open(url, searchArea !== 'manual' && searchArea !== 'forum' ? options.openMode : '_blank');
                jse.libs.loading_spinner.hide($spinner);
            },
            onError: function onError() {
                window.open(url, searchArea !== 'manual' && searchArea !== 'forum' ? options.openMode : '_blank');
                jse.libs.loading_spinner.hide($spinner);
            }
        });
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Bind list item event handler.
        elements.listItems.on('click', _onListClick);

        // Bind button event handler.
        elements.button.on('click', _onButtonClick);

        // Bind input event handlers.
        elements.input.on('click', _onInputClick).on('keyup', _onInputKeyUp);

        // Bind window event handlers.
        $(window).on('click', _onOutsideClick).on('blur', _onWindowBlur);

        // Bind set input value event handler.
        $this.on('set:value', _onSetValue);

        // Bind JSEngine ready state event handler.
        $(document).on('JSENGINE_INIT_FINISHED', _onEngineFinished);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxheW91dHMvbWFpbi9oZWFkZXIvc2VhcmNoLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJyZWNlbnRTZWFyY2hBcmVhIiwib3Blbk1vZGUiLCJvcHRpb25zIiwiZXh0ZW5kIiwiZWxlbWVudHMiLCJpbnB1dCIsImZpbmQiLCJsaXN0IiwibGlzdEl0ZW1zIiwiYnV0dG9uIiwic2VsZWN0b3JzIiwicGxhY2Vob2xkZXIiLCJhdHRyaWJ1dGVzIiwic2VhcmNoQXJlYSIsImtleUNvZGVzIiwiZXNjIiwiYXJyb3dVcCIsImFycm93RG93biIsImVudGVyIiwiYmluZGluZ3MiLCJkb0lucHV0Rm9jdXMiLCJfc2V0U2VhcmNoQXJlYSIsImFyZWEiLCJhY3RpdmVDbGFzcyIsInJlbW92ZUNsYXNzIiwiZmlsdGVyIiwiYWRkQ2xhc3MiLCJfb25JbnB1dENsaWNrIiwiX2ZpbGxUZXJtSW5MaXN0SXRlbXMiLCJfdG9nZ2xlRHJvcGRvd24iLCJfb25JbnB1dEtleVVwIiwiZXZlbnQiLCJ3aGljaCIsInRyaWdnZXIiLCJfcGVyZm9ybVNlYXJjaCIsImlzVXAiLCIkY3VycmVudEl0ZW0iLCIkZmlyc3RJdGVtIiwiZmlyc3QiLCIkbGFzdEl0ZW0iLCJsYXN0IiwiJGZvbGxvd2luZ0l0ZW0iLCJwcmV2IiwibmV4dCIsImxlbmd0aCIsInZhbCIsInBhcmVudCIsIl9vbk91dHNpZGVDbGljayIsIiR0YXJnZXQiLCJ0YXJnZXQiLCJpc05vdFRhcmdldFNlYXJjaEFyZWEiLCJoYXMiLCJpc05vdFRhcmdldFNlYXJjaEJ1dHRvbiIsIl9vbkxpc3RDbGljayIsImN1cnJlbnRUYXJnZXQiLCJfb25CdXR0b25DbGljayIsIl9vbldpbmRvd0JsdXIiLCJfb25TZXRWYWx1ZSIsInZhbHVlIiwiZG9Gb2N1cyIsIl9vbkVuZ2luZUZpbmlzaGVkIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsInRleHQiLCJnZXQiLCJkb1Nob3ciLCJBQ1RJVkVfQ0xBU1MiLCJPYmplY3QiLCJrZXlzIiwianNlIiwibGlicyIsInNlYXJjaCIsInVybHMiLCJpbmNsdWRlcyIsIkVycm9yIiwiJHNwaW5uZXIiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwidXJsIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCJzZXQiLCJ1c2VySWQiLCJjb3JlIiwicmVnaXN0cnkiLCJjb25maWd1cmF0aW9uS2V5IiwiY29uZmlndXJhdGlvblZhbHVlIiwib25TdWNjZXNzIiwid2luZG93Iiwib3BlbiIsImhpZGUiLCJvbkVycm9yIiwiaW5pdCIsIm9uIiwiZG9jdW1lbnQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7OztBQUdBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxRQURKLEVBR0ksQ0FDSSw0QkFESixFQUVJLGlCQUZKLEVBR09GLEdBQUdHLE1BSFYsbUJBSU9ILEdBQUdHLE1BSlYscUJBSEosRUFVSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTtBQUNBLFFBQU1DLFdBQVc7QUFDYjtBQUNBQywwQkFBa0IsWUFGTDs7QUFJYjtBQUNBQyxrQkFBVTtBQUxHLEtBQWpCOztBQVFBO0FBQ0EsUUFBTUMsVUFBVUosRUFBRUssTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSixRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7QUFDQSxRQUFNUSxXQUFXO0FBQ2I7QUFDQUMsZUFBT1IsTUFBTVMsSUFBTixDQUFXLFFBQVgsQ0FGTTs7QUFJYjtBQUNBQyxjQUFNVixNQUFNUyxJQUFOLENBQVcsT0FBWCxDQUxPOztBQU9iO0FBQ0FFLG1CQUFXWCxNQUFNUyxJQUFOLENBQVcsWUFBWCxDQVJFOztBQVViO0FBQ0FHLGdCQUFRWCxF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QyxhQUZoQjs7QUFJQTtBQUNBM0QsY0FBTWlHLEVBQU4sQ0FBUyxXQUFULEVBQXNCckMsV0FBdEI7O0FBRUE7QUFDQTNELFVBQUVpRyxRQUFGLEVBQVlELEVBQVosQ0FBZSx3QkFBZixFQUF5Q2xDLGlCQUF6Qzs7QUFFQTtBQUNBb0M7QUFDSCxLQXpCRDs7QUEyQkEsV0FBT3RHLE1BQVA7QUFDSCxDQXpWTCIsImZpbGUiOiJsYXlvdXRzL21haW4vaGVhZGVyL3NlYXJjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2VhcmNoLmpzIDIwMTgtMDktMTFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEdsb2JhbCBTZWFyY2ggQ29udHJvbGxlciBNb2R1bGVcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzZWFyY2gnLFxuXG4gICAgW1xuICAgICAgICAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL3NlYXJjaGAsXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9zaG9ydGN1dHNgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8vIE1vZHVsZSBlbGVtZW50LCB3aGljaCByZXByZXNlbnRzIHRoZSBpbmZvIGJveC5cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8vIE1vZHVsZSBkZWZhdWx0IHBhcmFtZXRlcnMuXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgLy8gUmVjZW50IHNlYXJjaCBhcmVhLlxuICAgICAgICAgICAgcmVjZW50U2VhcmNoQXJlYTogJ2NhdGVnb3JpZXMnLFxuXG4gICAgICAgICAgICAvLyBIeXBlcmxpbmsgb3BlbiBtb2RlLlxuICAgICAgICAgICAgb3Blbk1vZGU6ICdfc2VsZidcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNb2R1bGUgb3B0aW9ucy5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLy8gRWxlbWVudHMuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0ge1xuICAgICAgICAgICAgLy8gU2VhcmNoIHRlcm0gaW5wdXQuXG4gICAgICAgICAgICBpbnB1dDogJHRoaXMuZmluZCgnLmlucHV0JyksXG5cbiAgICAgICAgICAgIC8vIFNlYXJjaCBhcmVhIGxpc3QuXG4gICAgICAgICAgICBsaXN0OiAkdGhpcy5maW5kKCcubGlzdCcpLFxuXG4gICAgICAgICAgICAvLyBTZWFyY2ggYXJlYSBsaXN0IGl0ZW0uXG4gICAgICAgICAgICBsaXN0SXRlbXM6ICR0aGlzLmZpbmQoJy5saXN0LWl0ZW0nKSxcblxuICAgICAgICAgICAgLy8gU2VhcmNoIGlucHV0IHRyaWdnZXIgYnV0dG9uLlxuICAgICAgICAgICAgYnV0dG9uOiAkKCcuYWN0aW9ucyAuc2VhcmNoJylcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBFbGVtZW50IHNlbGVjdG9yIHN0cmluZ3MuXG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IHtcbiAgICAgICAgICAgIC8vIExpc3QgaXRlbSBzZWFyY2ggdGVybSBwbGFjZWhvbGRlciBzZWxlY3RvciBzdHJpbmcuXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJy5wbGFjZWhvbGRlcidcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBdHRyaWJ1dGVzLlxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0ge1xuICAgICAgICAgICAgLy8gRGF0YSBhdHRyaWJ1dGVzLlxuICAgICAgICAgICAgZGF0YToge3NlYXJjaEFyZWE6ICdzZWFyY2hBcmVhJ31cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBFdmVudCBrZXkgY29kZXMuXG4gICAgICAgIGNvbnN0IGtleUNvZGVzID0ge1xuICAgICAgICAgICAgZXNjOiAyNyxcbiAgICAgICAgICAgIGFycm93VXA6IDM4LFxuICAgICAgICAgICAgYXJyb3dEb3duOiA0MCxcbiAgICAgICAgICAgIGVudGVyOiAxM1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1vZHVsZSBvYmplY3QuXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHtcbiAgICAgICAgICAgIGJpbmRpbmdzOiB7aW5wdXQ6IGVsZW1lbnRzLmlucHV0fVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEN1cnJlbnQgc2VsZWN0ZWQgc2VhcmNoIGFyZWEuXG4gICAgICAgIGxldCBzZWFyY2hBcmVhID0gbnVsbDtcblxuICAgICAgICAvLyBEbyBmb2N1cyBvbiBzZWFyY2ggaW5wdXQ/XG4gICAgICAgIGxldCBkb0lucHV0Rm9jdXMgPSBmYWxzZTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgc2VhcmNoIGFyZWEgYW5kIGFjdGl2YXRlcyB0aGUgcmVzcGVjdGl2ZSBsaXN0IGl0ZW0gZWxlbWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGFyZWEgU2VhcmNoIGFyZWEgbmFtZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zZXRTZWFyY2hBcmVhKGFyZWEpIHtcbiAgICAgICAgICAgIC8vIEFjdGl2ZSBsaXN0IGl0ZW0gQ1NTIGNsYXNzLlxuICAgICAgICAgICAgY29uc3QgYWN0aXZlQ2xhc3MgPSAnYWN0aXZlJztcblxuICAgICAgICAgICAgLy8gU2V0IGludGVybmFsIGFyZWEgdmFsdWUuXG4gICAgICAgICAgICBzZWFyY2hBcmVhID0gYXJlYTtcblxuICAgICAgICAgICAgLy8gU2V0IGNsYXNzLlxuICAgICAgICAgICAgZWxlbWVudHMubGlzdEl0ZW1zXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYGxpW2RhdGEtc2VhcmNoLWFyZWE9XCIke2FyZWF9XCJdYClcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgZXZlbnQgZm9yIHRoZSBjbGljayBhY3Rpb24gb24gdGhlIGlucHV0IGZpZWxkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW5wdXRDbGljaygpIHtcbiAgICAgICAgICAgIF9maWxsVGVybUluTGlzdEl0ZW1zKCk7XG4gICAgICAgICAgICBfdG9nZ2xlRHJvcGRvd24odHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBldmVudCBmb3IgdGhlIGtleSB1cCBwcmVzcyBhY3Rpb24gd2l0aGluIHRoZSBpbnB1dCBmaWVsZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IEV2ZW50IGZpcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW5wdXRLZXlVcChldmVudCkge1xuICAgICAgICAgICAgc3dpdGNoIChldmVudC53aGljaCkge1xuICAgICAgICAgICAgICAgIC8vIEhpZGUgc2VhcmNoIGJhciBvbiBlc2NhcGUga2V5LlxuICAgICAgICAgICAgICAgIGNhc2Uga2V5Q29kZXMuZXNjOlxuICAgICAgICAgICAgICAgICAgICBfdG9nZ2xlRHJvcGRvd24oZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5pbnB1dC50cmlnZ2VyKCdibHVyJyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgdGhlIHNlYXJjaCBvbiByZXR1cm4ga2V5LlxuICAgICAgICAgICAgICAgIGNhc2Uga2V5Q29kZXMuZW50ZXI6XG4gICAgICAgICAgICAgICAgICAgIF9wZXJmb3JtU2VhcmNoKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gQ3ljbGUgc2VsZWN0aW9uIHRocm91Z2ggc2VhcmNoIGVudGl0eSBsaXN0IGl0ZW1zIG9uIHZlcnRpY2FsIGFycm93IGtleXMuXG4gICAgICAgICAgICAgICAgY2FzZSBrZXlDb2Rlcy5hcnJvd1VwOlxuICAgICAgICAgICAgICAgIGNhc2Uga2V5Q29kZXMuYXJyb3dEb3duOlxuICAgICAgICAgICAgICAgICAgICAvLyBEaXJlY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVXAgPSBldmVudC53aGljaCA9PT0ga2V5Q29kZXMuYXJyb3dVcDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDdXJyZW50IHNlYXJjaCBhcmVhIGxpc3QgaXRlbVxuICAgICAgICAgICAgICAgICAgICBjb25zdCAkY3VycmVudEl0ZW0gPSBlbGVtZW50cy5saXN0SXRlbXMuZmlsdGVyKCcuYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3Qgc2VhcmNoIGFyZWEgbGlzdCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCAkZmlyc3RJdGVtID0gZWxlbWVudHMubGlzdEl0ZW1zLmZpcnN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTGFzdCBzZWFyY2ggYXJlYSBsaXN0IGl0ZW0uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRsYXN0SXRlbSA9IGVsZW1lbnRzLmxpc3RJdGVtcy5sYXN0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBuZXh0IHNlbGVjdGVkIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgICAgIGxldCAkZm9sbG93aW5nSXRlbSA9IGlzVXAgPyAkY3VycmVudEl0ZW0ucHJldigpIDogJGN1cnJlbnRJdGVtLm5leHQoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBuZXh0IGVsZW1lbnQsIHRoZW4gdGhlIGZpcnN0L2xhc3QgZWxlbWVudCBpcyBzZWxlY3RlZC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkZm9sbG93aW5nSXRlbS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb2xsb3dpbmdJdGVtID0gaXNVcCA/ICRsYXN0SXRlbSA6ICRmaXJzdEl0ZW07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBGZXRjaCBzZWFyY2ggYXJlYSBmcm9tIG5leHQgbGlzdCBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmVhID0gJGZvbGxvd2luZ0l0ZW0uZGF0YShhdHRyaWJ1dGVzLmRhdGEuc2VhcmNoQXJlYSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IGVudGl0eSB2YWx1ZSBhbmQgc2VsZWN0IGVudGl0eSBvbiB0aGUgbGlzdCBpdGVtIGFuZCBzZXQgcGxhY2Vob2xkZXIuXG4gICAgICAgICAgICAgICAgICAgIF9zZXRTZWFyY2hBcmVhKGFyZWEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8gRmlsbCBzZWFyY2ggdGVybSBpbnRvIGRyb3Bkb3duIGxpc3QgaXRlbXMgb24gbGV0dGVyIGtleXByZXNzLlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmKCQoZWxlbWVudHMuaW5wdXQpLnZhbCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnc2VhcmNoaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdzZWFyY2hpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdG9nZ2xlRHJvcGRvd24odHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF9maWxsVGVybUluTGlzdEl0ZW1zKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBldmVudCBmb3IgdGhlIGNsaWNrIGFjdGlvbiBvdXRzaWRlIG9mIHRoZSBjb250cm9sbGVyIGFyZWEuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBFdmVudCBmaXJlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbk91dHNpZGVDbGljayhldmVudCkge1xuICAgICAgICAgICAgLy8gQ2xpY2tlZCB0YXJnZXQgZWxlbWVudC5cbiAgICAgICAgICAgIGNvbnN0ICR0YXJnZXQgPSBldmVudC50YXJnZXQ7XG5cbiAgICAgICAgICAgIC8vIFRhcmdldCBlbGVtZW50IHZlcmlmaWVycy5cbiAgICAgICAgICAgIGNvbnN0IGlzTm90VGFyZ2V0U2VhcmNoQXJlYSA9ICEkdGhpcy5oYXMoJHRhcmdldCkubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgaXNOb3RUYXJnZXRTZWFyY2hCdXR0b24gPSAhZWxlbWVudHMuYnV0dG9uLmhhcygkdGFyZ2V0KS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIENsZWFyIHRoZSBwbGFjZWhvbGRlciBhbmQgaGlkZSBkcm9wZG93bixcbiAgICAgICAgICAgIC8vIGlmIGNsaWNrZWQgdGFyZ2V0IGlzIG5vdCB3aXRoaW4gc2VhcmNoIGFyZWEuXG4gICAgICAgICAgICBpZiAoaXNOb3RUYXJnZXRTZWFyY2hBcmVhICYmIGlzTm90VGFyZ2V0U2VhcmNoQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgX3RvZ2dsZURyb3Bkb3duKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5pbnB1dC50cmlnZ2VyKCdibHVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBldmVudCBmb3IgdGhlIGNsaWNrIGFjdGlvbiBvbiBhIGRyb3Bkb3duIGxpc3QgaXRlbS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IEV2ZW50IGZpcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uTGlzdENsaWNrKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBHZXQgZW50aXR5IGZyb20gbGlzdCBpdGVtLlxuICAgICAgICAgICAgY29uc3QgYXJlYSA9ICQoZXZlbnQuY3VycmVudFRhcmdldCkuZGF0YShhdHRyaWJ1dGVzLmRhdGEuc2VhcmNoQXJlYSk7XG5cbiAgICAgICAgICAgIF9zZXRTZWFyY2hBcmVhKGFyZWEpO1xuICAgICAgICAgICAgX3BlcmZvcm1TZWFyY2goKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGV2ZW50IGZvciB0aGUgYnV0dG9uIGNsaWNrIGFjdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkJ1dHRvbkNsaWNrKCkge1xuICAgICAgICAgICAgLy8gUHJveHkgY2xpY2sgYW5kIGZvY3VzIHRvIHRoZSBzZWFyY2ggaW5wdXQgZmllbGQuXG4gICAgICAgICAgICBlbGVtZW50cy5pbnB1dFxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjbGljaycpXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBldmVudCBmb3Igd2luZG93IGluYWN0aXZhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbldpbmRvd0JsdXIoKSB7XG4gICAgICAgICAgICBfdG9nZ2xlRHJvcGRvd24oZmFsc2UpO1xuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXQudHJpZ2dlcignYmx1cicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIHNldCBpbnB1dCB2YWx1ZSBjdXN0b20gZXZlbnQgbWV0aG9kLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgRGVzaXJlZCBpbnB1dCB2YWx1ZS5cbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBkb0ZvY3VzIERvIGZvY3VzIG9uIHRoZSBpbnB1dCBmaWVsZD9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNldFZhbHVlKGV2ZW50LCB2YWx1ZSwgZG9Gb2N1cykge1xuICAgICAgICAgICAgLy8gU2V0IGFkbWluIHNlYXJjaCBpbnB1dCB2YWx1ZS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0XG4gICAgICAgICAgICAgICAgLnZhbCh2YWx1ZSlcbiAgICAgICAgICAgICAgICAudHJpZ2dlcigna2V5dXAnKTtcblxuICAgICAgICAgICAgLy8gUmVnaXN0ZXIgYWRtaW4gc2VhcmNoIGlucHV0IGZvY3VzIHRyaWdnZXIuXG4gICAgICAgICAgICBkb0lucHV0Rm9jdXMgPSAhIWRvRm9jdXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBKU0VuZ2luZSBmaW5pc2ggZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25FbmdpbmVGaW5pc2hlZCgpIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgZm9jdXMgb24gYWRtaW4gc2VhcmNoIGlucHV0IGZpZWxkLCBpZiByZWdpc3RlcmVkLlxuICAgICAgICAgICAgaWYgKGRvSW5wdXRGb2N1cykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzLmlucHV0LnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNldCBzZWFyY2ggZW50aXR5LlxuICAgICAgICAgICAgX3NldFNlYXJjaEFyZWEob3B0aW9ucy5yZWNlbnRTZWFyY2hBcmVhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmVwZW5kcyB0aGUgY3VycmVudCBzZWFyY2ggdGVybSBpbnRvIHRoZSBkcm9wZG93biBsaXN0IGl0ZW1zLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2ZpbGxUZXJtSW5MaXN0SXRlbXMoKSB7XG4gICAgICAgICAgICBlbGVtZW50cy5saXN0XG4gICAgICAgICAgICAgICAgLmZpbmQoc2VsZWN0b3JzLnBsYWNlaG9sZGVyKVxuICAgICAgICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4gJChlbGVtZW50KS50ZXh0KG1vZHVsZS5iaW5kaW5ncy5pbnB1dC5nZXQoKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIGFuZCBoaWRlcyB0aGUgZHJvcGRvd24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZG9TaG93IFNob3cgdGhlIGRyb3Bkb3duP1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3RvZ2dsZURyb3Bkb3duKGRvU2hvdykge1xuICAgICAgICAgICAgLy8gQ2xhc3MgZm9yIHZpc2libGUgZHJvcGRvd24uXG4gICAgICAgICAgICBjb25zdCBBQ1RJVkVfQ0xBU1MgPSAnYWN0aXZlJztcblxuICAgICAgICAgICAgLy8gVG9nZ2xlIGRyb3Bkb3duIGRlcGVuZGVudCBvbiB0aGUgcHJvdmlkZWQgYm9vbGVhbiB2YWx1ZS5cbiAgICAgICAgICAgIGVsZW1lbnRzLmxpc3RbZG9TaG93ID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKEFDVElWRV9DTEFTUyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZXMgdGhlIHNlYXJjaCBlbnRpdHkgdG8gdGhlIHVzZXIgY29uZmlndXJhdGlvbiBhbmQgcGVyZm9ybXMgdGhlIHNlYXJjaC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9wZXJmb3JtU2VhcmNoKCkge1xuICAgICAgICAgICAgLy8gU2V0IGRlZmF1bHQgc2VhcmNoIGFyZWEgaWYgbm9uIHByb3ZpZGVkLlxuICAgICAgICAgICAgc2VhcmNoQXJlYSA9IHNlYXJjaEFyZWEgfHwgZGVmYXVsdHMucmVjZW50U2VhcmNoQXJlYTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgc2VhcmNoIGFyZWEgVVJMIGF2YWlsYWJpbGl0eS5cbiAgICAgICAgICAgIGlmICghT2JqZWN0LmtleXMoanNlLmxpYnMuc2VhcmNoLnVybHMpLmluY2x1ZGVzKHNlYXJjaEFyZWEpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBVUkwgZm9yIHNlYXJjaCBhcmVhIFwiJHtzZWFyY2hBcmVhfVwiIGZvdW5kLmApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEaXNwbGF5IGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgIGNvbnN0ICRzcGlubmVyID0ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coZWxlbWVudHMubGlzdCwgJzk5OTknKTtcblxuICAgICAgICAgICAgLy8gQ29tcG9zZSBzZWFyY2ggVVJMIHdpdGggc2VhcmNoIHRlcm0uXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UubGlicy5zZWFyY2gudXJsc1tzZWFyY2hBcmVhXSArIGVuY29kZVVSSUNvbXBvbmVudChtb2R1bGUuYmluZGluZ3MuaW5wdXQuZ2V0KCkpO1xuXG4gICAgICAgICAgICAvLyBTYXZlIHNlbGVjdGVkIGVudGl0eSB0byBzZXJ2ZXIgdmlhIHVzZXIgY29uZmlndXJhdGlvbiBzZXJ2aWNlLlxuICAgICAgICAgICAganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2Uuc2V0KHtcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDoganNlLmNvcmUucmVnaXN0cnkuZ2V0KCd1c2VySWQnKSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleToganNlLmxpYnMuc2VhcmNoLmNvbmZpZ3VyYXRpb25LZXksXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogc2VhcmNoQXJlYVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25TdWNjZXNzKCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1cmwsIChzZWFyY2hBcmVhICE9PSAnbWFudWFsJyAmJiBzZWFyY2hBcmVhICE9PSAnZm9ydW0nKSA/IG9wdGlvbnMub3Blbk1vZGUgOiAnX2JsYW5rJyk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKCRzcGlubmVyKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uRXJyb3IoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgKHNlYXJjaEFyZWEgIT09ICdtYW51YWwnICYmIHNlYXJjaEFyZWEgIT09ICdmb3J1bScpID8gb3B0aW9ucy5vcGVuTW9kZSA6ICdfYmxhbmsnKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJHNwaW5uZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBCaW5kIGxpc3QgaXRlbSBldmVudCBoYW5kbGVyLlxuICAgICAgICAgICAgZWxlbWVudHMubGlzdEl0ZW1zLm9uKCdjbGljaycsIF9vbkxpc3RDbGljayk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgYnV0dG9uIGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAgICBlbGVtZW50cy5idXR0b24ub24oJ2NsaWNrJywgX29uQnV0dG9uQ2xpY2spO1xuXG4gICAgICAgICAgICAvLyBCaW5kIGlucHV0IGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgZWxlbWVudHMuaW5wdXRcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgX29uSW5wdXRDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2tleXVwJywgX29uSW5wdXRLZXlVcCk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgd2luZG93IGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgJCh3aW5kb3cpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9vbk91dHNpZGVDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2JsdXInLCBfb25XaW5kb3dCbHVyKTtcblxuICAgICAgICAgICAgLy8gQmluZCBzZXQgaW5wdXQgdmFsdWUgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICAgICR0aGlzLm9uKCdzZXQ6dmFsdWUnLCBfb25TZXRWYWx1ZSk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgSlNFbmdpbmUgcmVhZHkgc3RhdGUgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdKU0VOR0lORV9JTklUX0ZJTklTSEVEJywgX29uRW5naW5lRmluaXNoZWQpO1xuXG4gICAgICAgICAgICAvLyBGaW5pc2ggaW5pdGlhbGl6YXRpb24uXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
