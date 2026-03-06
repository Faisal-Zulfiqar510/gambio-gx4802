'use strict';

/* --------------------------------------------------------------
 admin_search.js 2018-09-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Admin Search Extension
 *
 * Extension for search in orders, customers and categories in the admin panel
 *
 * @module Admin/Extension/admin_search
 * @requires jQueryUI
 * @ignore
 */
gx.extensions.module('admin_search', ['user_configuration_service', 'url_arguments', 'loading_spinner'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    // Elements.

    var $this = $(this),
        $button = $(data.button),
        $dropdown = $('ul.searchable:first'),
        recentSearch = $.trim(decodeURIComponent(jse.libs.url_arguments.getUrlParameters(location.href).search || ''));

    // Current search area.
    var searchArea;

    // Text labels.
    var labels = {
        searchIn: jse.core.lang.translate('admin_search_in_label', 'admin_labels'),
        searchInAlternative: jse.core.lang.translate('admin_search_in_label_alternative', 'admin_labels'),
        orders: jse.core.lang.translate('admin_search_orders', 'admin_labels'),
        invoices: jse.core.lang.translate('admin_search_invoices', 'admin_labels'),
        customers: jse.core.lang.translate('admin_search_customers', 'admin_labels'),
        categories: jse.core.lang.translate('admin_search_categories', 'admin_labels'),
        configurations: jse.core.lang.translate('admin_search_configurations', 'admin_labels'),
        manual: jse.core.lang.translate('admin_search_manual', 'admin_labels'),
        forum: jse.core.lang.translate('admin_search_forum', 'admin_labels')
    };

    // Key code map.
    var keyMap = {
        ESC: 27,
        ARROW_UP: 38,
        ARROW_DOWN: 40,
        ENTER: 13
    };

    // Library access shortcuts.
    var userConfigurationService = jse.libs.user_configuration_service,
        urlArguments = jse.libs.url_arguments;

    // Configuration settings for UserConfigurationService.
    var configurationContainer = {
        userId: data.customer_id,
        configurationKey: 'recent_search_area'
    };

    // Module object (JSEngine).
    var module = {};

    // ------------------------------------------------------------------------
    // METHODS
    // ------------------------------------------------------------------------

    /**
     * Refreshes the search area variable
     *
     * Shows the new search area in the button
     * @private
     */
    var _refreshSearchArea = function _refreshSearchArea() {
        // Abort if no new search area is provided
        if (!$('.search-item.active').length) {
            console.error('No active list item!');
        }

        // Assign new search area
        searchArea = $('.search-item.active').data('searchArea');
        $this.trigger('refresh:search-area');
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    var _initializeInput = function _initializeInput() {

        // Click event
        $this.parent('*').on('click', function () {
            $this.trigger('refresh:search-area');
            if ($this.val() === '') {
                $this.val(recentSearch);
            }
            $dropdown.trigger('show:dropdown');
            $this.trigger('focus');
        });

        // Keyboard events
        $this.on('keyup', function (event) {
            switch (event.which) {

                // Perform search if enter key is pressed
                case keyMap.ENTER:
                    $this.trigger('perform:search');
                    break;

                // Close dropdown if escape key is pressed
                case keyMap.ESC:
                    $dropdown.trigger('hide:dropdown');
                    return;

                // Navigate up in dropdown
                case keyMap.ARROW_UP:
                    $dropdown.trigger('select:item:previous');
                    break;
                case keyMap.ARROW_DOWN:
                    $dropdown.trigger('select:item:next');
                    break;
            }
            $dropdown.trigger('refresh:search-item');
        });

        // Search events
        $this.on('perform:search', function () {
            var inputValue = encodeURIComponent($this.val()),
                openMode = '_self',
                url;

            switch (searchArea) {
                case 'customers':
                    url = ['customers', '?search=', inputValue].join('');
                    break;
                case 'categories':
                    url = ['categories.php', '?search=', inputValue].join('');
                    break;
                case 'configurations':
                    url = ['configurations', '?query=', inputValue].join('');
                    break;
                case 'orders':
                    url = ['admin.php', '?', $.param({
                        do: 'OrdersOverview',
                        filter: {
                            number: inputValue
                        }
                    })].join('');
                    break;
                case 'invoices':
                    url = ['admin.php', '?', $.param({
                        do: 'InvoicesOverview',
                        filter: {
                            invoiceNumber: inputValue
                        }
                    })].join('');
                    break;
                case 'manual':
                    url = ['admin.php', '?', $.param({
                        do: 'DirectHelpProxy/GoToManual',
                        search: inputValue
                    })].join('');
                    openMode = '_blank';
                    $dropdown.trigger('hide:dropdown');
                    break;
                case 'forum':
                    url = ['admin.php', '?', $.param({
                        do: 'DirectHelpProxy/GoToForum',
                        number: Math.floor(Math.random() * 99999999 + 1),
                        search: inputValue
                    })].join('');
                    openMode = '_blank';
                    $dropdown.trigger('hide:dropdown');
                    break;
            }

            // Display loading spinner.
            var $spinner = jse.libs.loading_spinner.show($dropdown, '9999');

            userConfigurationService.set({
                data: $.extend(configurationContainer, {
                    configurationValue: searchArea
                }),
                onSuccess: function onSuccess() {
                    window.open(url, openMode);
                    jse.libs.loading_spinner.hide($spinner);
                },
                onError: function onError() {
                    window.open(url, openMode);
                    jse.libs.loading_spinner.hide($spinner);
                }
            });
        });

        // Remove placeholder when input is inactive
        $this.on('blur', function () {
            $dropdown.trigger('hide:dropdown');
        });
    };

    var _initializeButton = function _initializeButton() {
        $button.on('click', function () {
            $this.trigger('refresh:search-area');
            $this.val(recentSearch);
            $dropdown.trigger('show:dropdown');
            $this.trigger('focus');
        });
    };

    var _initializeDropdown = function _initializeDropdown() {
        // Select item
        $dropdown.on('select:item', function () {
            $dropdown.find('li[data-search-area=' + searchArea + ']').addClass('active');
        });

        // Show event
        $dropdown.on('show:dropdown', function () {
            $dropdown.fadeIn();
            $dropdown.trigger('select:item');
            $dropdown.trigger('refresh:search-item');
        });

        // Select first item
        $dropdown.on('select:item:first', function () {
            var $activeListItem = $dropdown.find('li.search-item.active');
            var $firstListItem = $dropdown.find('li.search-item:first');
            $activeListItem.removeClass('active');
            $firstListItem.addClass('active');
            _refreshSearchArea();
            $dropdown.trigger('select:item');
        });

        $dropdown.on('select:item:last', function () {
            var $activeListItem = $dropdown.find('li.search-item.active');
            var $lastListItem = $dropdown.find('li.search-item:last');
            $activeListItem.removeClass('active');
            $lastListItem.addClass('active');
            _refreshSearchArea();
            $dropdown.trigger('select:item');
        });

        // Select previous item event
        $dropdown.on('select:item:previous', function () {
            var $activeListItem = $dropdown.find('li.search-item.active');
            var $prev = $activeListItem.prev();

            if ($prev.length) {
                $activeListItem.removeClass('active');
                $prev.addClass('active');
                _refreshSearchArea();
                $dropdown.trigger('select:item');
            } else {
                $dropdown.trigger('select:item:last');
            }
        });

        // Select previous item event
        $dropdown.on('select:item:next', function () {
            var $activeListItem = $dropdown.find('li.search-item.active');
            var $next = $activeListItem.next();

            if ($next.length) {
                $activeListItem.removeClass('active');
                $next.addClass('active');
                _refreshSearchArea();
                $dropdown.trigger('select:item');
            } else {
                $dropdown.trigger('select:item:first');
            }
        });

        // Hide event
        $dropdown.on('hide:dropdown', function () {
            $dropdown.fadeOut();
        });

        // Item click event
        $dropdown.on('click', function (event) {
            event.stopPropagation();

            $dropdown.find('li').removeClass('active');

            var $elementToActivate = $(event.target).is('span') ? $(event.target).parents('li:first') : $(event.target);

            $elementToActivate.addClass('active');

            _refreshSearchArea();
            $dropdown.trigger('hide:dropdown');
            $this.trigger('perform:search');
        });

        // Item search event
        $dropdown.on('refresh:search-item', function () {
            $('.search-item').each(function () {
                // Update search query
                $(this).find('.search-query-item').text($this.val());

                // Update search description
                var searchAreaText = [labels.searchIn, labels[$(this).data('searchArea')]].join(' ');

                if ($(this).attr('data-search-area') === 'manual' || $(this).attr('data-search-area') === 'forum') {
                    searchAreaText = [labels.searchInAlternative, labels[$(this).data('searchArea')]].join(' ');
                }

                $(this).find('.search-query-description').text(searchAreaText);
            });
        });
    };

    var _initializeRecentSearch = function _initializeRecentSearch() {
        $(document).on('JSENGINE_INIT_FINISHED', function () {
            if (recentSearch != '') {
                $this.prop('value', recentSearch);
                $this.focus();
                $dropdown.trigger('show:dropdown');
                $dropdown.trigger('refresh:search-item');
            }
        });
    };

    /**
     * Initialize method of the extension, called by the engine.
     */
    module.init = function (done) {
        _initializeInput();
        _initializeDropdown();
        _initializeButton();
        _initializeRecentSearch();

        searchArea = data.recentSearchArea || 'categories';
        $dropdown.trigger('select:item');

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluX3NlYXJjaC5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGJ1dHRvbiIsImJ1dHRvbiIsIiRkcm9wZG93biIsInJlY2VudFNlYXJjaCIsInRyaW0iLCJkZWNvZGVVUklDb21wb25lbnQiLCJqc2UiLCJsaWJzIiwidXJsX2FyZ3VtZW50cyIsImdldFVybFBhcmFtZXRlcnMiLCJsb2NhdGlvbiIsImhyZWYiLCJzZWFyY2giLCJzZWFyY2hBcmVhIiwibGFiZWxzIiwic2VhcmNoSW4iLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInNlYXJjaEluQWx0ZXJuYXRpdmUiLCJvcmRlcnMiLCJpbnZvaWNlcyIsImN1c3RvbWVycyIsImNhdGVnb3JpZXMiLCJjb25maWd1cmF0aW9ucyIsIm1hbnVhbCIsImZvcnVtIiwia2V5TWFwIiwiRVNDIiwiQVJST1dfVVAiLCJBUlJPV19ET1dOIiwiRU5URVIiLCJ1c2VyQ29uZmlndXJhdGlvblNlcnZpY2UiLCJ1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSIsInVybEFyZ3VtZW50cyIsImNvbmZpZ3VyYXRpb25Db250YWluZXIiLCJ1c2VySWQiLCJjdXN0b21lcl9pZCIsImNvbmZpZ3VyYXRpb25LZXkiLCJfcmVmcmVzaFNlYXJjaEFyZWEiLCJsZW5ndGgiLCJjb25zb2xlIiwiZXJyb3IiLCJ0cmlnZ2VyIiwiX2luaXRpYWxpemVJbnB1dCIsInBhcmVudCIsIm9uIiwidmFsIiwiZXZlbnQiLCJ3aGljaCIsImlucHV0VmFsdWUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJvcGVuTW9kZSIsInVybCIsImpvaW4iLCJwYXJhbSIsImRvIiwiZmlsdGVyIiwibnVtYmVyIiwiaW52b2ljZU51bWJlciIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIiRzcGlubmVyIiwibG9hZGluZ19zcGlubmVyIiwic2hvdyIsInNldCIsImV4dGVuZCIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsIm9uU3VjY2VzcyIsIndpbmRvdyIsIm9wZW4iLCJoaWRlIiwib25FcnJvciIsIl9pbml0aWFsaXplQnV0dG9uIiwiX2luaXRpYWxpemVEcm9wZG93biIsImZpbmQiLCJhZGRDbGFzcyIsImZhZGVJbiIsIiRhY3RpdmVMaXN0SXRlbSIsIiRmaXJzdExpc3RJdGVtIiwicmVtb3ZlQ2xhc3MiLCIkbGFzdExpc3RJdGVtIiwiJHByZXYiLCJwcmV2IiwiJG5leHQiLCJuZXh0IiwiZmFkZU91dCIsInN0b3BQcm9wYWdhdGlvbiIsIiRlbGVtZW50VG9BY3RpdmF0ZSIsInRhcmdldCIsImlzIiwicGFyZW50cyIsImVhY2giLCJ0ZXh0Iiwic2VhcmNoQXJlYVRleHQiLCJhdHRyIiwiX2luaXRpYWxpemVSZWNlbnRTZWFyY2giLCJkb2N1bWVudCIsInByb3AiLCJmb2N1cyIsImluaXQiLCJkb25lIiwicmVjZW50U2VhcmNoQXJlYSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7QUFTQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksY0FESixFQUdJLENBQUMsNEJBQUQsRUFBK0IsZUFBL0IsRUFBZ0QsaUJBQWhELENBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQSxRQUFJQyxRQUFRQyxFQUFFLElBQUYsQ0FBWjtBQUFBLFFBQ0lDLFVBQVVELEVBQUVGLEtBQUtJLE1BQVAsQ0FEZDtBQUFBLFFBRUlDLFlBQVlILEVBQUUscUJBQUYsQ0FGaEI7QUFBQSxRQUdJSSxlQUFlSixFQUFFSyxJQUFGLENBQU9DLG1CQUFtQkMsSUFBSUMsSUFBSixDQUFTQyxhQUFULENBQXVCQyxnQkFBdkIsQ0FBd0NDLFNBQVNDLElBQWpELEVBQXVEQyxNQUF2RCxJQUFpRSxFQUFwRixDQUFQLENBSG5COztBQUtBO0FBQ0EsUUFBSUMsVUFBSjs7QUFFQTtBQUNBLFFBQUlDLFNBQVM7QUFDVEMsa0JBQVVULElBQUlVLElBQUosQ0FBU0Ms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Q0FBYSxrQkFBYixNQUFxQyxRQUFyQyxJQUFpRGpHLEVBQUUsSUFBRixFQUFRaUcsSUFBUixDQUFhLGtCQUFiLE1BQXFDLE9BQTFGLEVBQW1HO0FBQy9GRCxxQ0FBaUIsQ0FDYmpGLE9BQU9LLG1CQURNLEVBRWJMLE9BQU9mLEVBQUUsSUFBRixFQUFRRixJQUFSLENBQWEsWUFBYixDQUFQLENBRmEsRUFHZnlELElBSGUsQ0FHVixHQUhVLENBQWpCO0FBSUg7O0FBRUR2RCxrQkFBRSxJQUFGLEVBQ0s2RSxJQURMLENBQ1UsMkJBRFYsRUFFS2tCLElBRkwsQ0FFVUMsY0FGVjtBQUdILGFBdEJEO0FBdUJILFNBeEJEO0FBeUJILEtBbkhEOztBQXFIQSxRQUFJRSwwQkFBMEIsU0FBMUJBLHVCQUEwQixHQUFZO0FBQ3RDbEcsVUFBRW1HLFFBQUYsRUFBWXBELEVBQVosQ0FBZSx3QkFBZixFQUF5QyxZQUFZO0FBQ2pELGdCQUFJM0MsZ0JBQWdCLEVBQXBCLEVBQXdCO0FBQ3BCTCxzQkFBTXFHLElBQU4sQ0FBVyxPQUFYLEVBQW9CaEcsWUFBcEI7QUFDQUwsc0JBQU1zRyxLQUFOO0FBQ0FsRywwQkFBVXlDLE9BQVYsQ0FBa0IsZUFBbEI7QUFDQXpDLDBCQUFVeUMsT0FBVixDQUFrQixxQkFBbEI7QUFDSDtBQUNKLFNBUEQ7QUFRSCxLQVREOztBQVdBOzs7QUFHQS9DLFdBQU95RyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjFEO0FBQ0ErQjtBQUNBRDtBQUNBdUI7O0FBRUFwRixxQkFBYWhCLEtBQUswRyxnQkFBTCxJQUF5QixZQUF0QztBQUNBckcsa0JBQVV5QyxPQUFWLENBQWtCLGFBQWxCOztBQUVBMkQ7QUFDSCxLQVZEOztBQVlBO0FBQ0EsV0FBTzFHLE1BQVA7QUFDSCxDQXBYTCIsImZpbGUiOiJhZG1pbl9zZWFyY2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGFkbWluX3NlYXJjaC5qcyAyMDE4LTA5LTEyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBBZG1pbiBTZWFyY2ggRXh0ZW5zaW9uXG4gKlxuICogRXh0ZW5zaW9uIGZvciBzZWFyY2ggaW4gb3JkZXJzLCBjdXN0b21lcnMgYW5kIGNhdGVnb3JpZXMgaW4gdGhlIGFkbWluIHBhbmVsXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb24vYWRtaW5fc2VhcmNoXG4gKiBAcmVxdWlyZXMgalF1ZXJ5VUlcbiAqIEBpZ25vcmVcbiAqL1xuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ2FkbWluX3NlYXJjaCcsXG5cbiAgICBbJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJywgJ3VybF9hcmd1bWVudHMnLCAnbG9hZGluZ19zcGlubmVyJ10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvLyBFbGVtZW50cy5cbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICRidXR0b24gPSAkKGRhdGEuYnV0dG9uKSxcbiAgICAgICAgICAgICRkcm9wZG93biA9ICQoJ3VsLnNlYXJjaGFibGU6Zmlyc3QnKSxcbiAgICAgICAgICAgIHJlY2VudFNlYXJjaCA9ICQudHJpbShkZWNvZGVVUklDb21wb25lbnQoanNlLmxpYnMudXJsX2FyZ3VtZW50cy5nZXRVcmxQYXJhbWV0ZXJzKGxvY2F0aW9uLmhyZWYpLnNlYXJjaCB8fCAnJykpO1xuXG4gICAgICAgIC8vIEN1cnJlbnQgc2VhcmNoIGFyZWEuXG4gICAgICAgIHZhciBzZWFyY2hBcmVhO1xuXG4gICAgICAgIC8vIFRleHQgbGFiZWxzLlxuICAgICAgICB2YXIgbGFiZWxzID0ge1xuICAgICAgICAgICAgc2VhcmNoSW46IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdhZG1pbl9zZWFyY2hfaW5fbGFiZWwnLCAnYWRtaW5fbGFiZWxzJyksXG4gICAgICAgICAgICBzZWFyY2hJbkFsdGVybmF0aXZlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX2luX2xhYmVsX2FsdGVybmF0aXZlJywgJ2FkbWluX2xhYmVscycpLFxuICAgICAgICAgICAgb3JkZXJzOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX29yZGVycycsICdhZG1pbl9sYWJlbHMnKSxcbiAgICAgICAgICAgIGludm9pY2VzOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX2ludm9pY2VzJywgJ2FkbWluX2xhYmVscycpLFxuICAgICAgICAgICAgY3VzdG9tZXJzOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX2N1c3RvbWVycycsICdhZG1pbl9sYWJlbHMnKSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdhZG1pbl9zZWFyY2hfY2F0ZWdvcmllcycsICdhZG1pbl9sYWJlbHMnKSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25zOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX2NvbmZpZ3VyYXRpb25zJywgJ2FkbWluX2xhYmVscycpLFxuICAgICAgICAgICAgbWFudWFsOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX21hbnVhbCcsICdhZG1pbl9sYWJlbHMnKSxcbiAgICAgICAgICAgIGZvcnVtOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYWRtaW5fc2VhcmNoX2ZvcnVtJywgJ2FkbWluX2xhYmVscycpLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEtleSBjb2RlIG1hcC5cbiAgICAgICAgdmFyIGtleU1hcCA9IHtcbiAgICAgICAgICAgIEVTQzogMjcsXG4gICAgICAgICAgICBBUlJPV19VUDogMzgsXG4gICAgICAgICAgICBBUlJPV19ET1dOOiA0MCxcbiAgICAgICAgICAgIEVOVEVSOiAxM1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIExpYnJhcnkgYWNjZXNzIHNob3J0Y3V0cy5cbiAgICAgICAgdmFyIHVzZXJDb25maWd1cmF0aW9uU2VydmljZSA9IGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlLFxuICAgICAgICAgICAgdXJsQXJndW1lbnRzID0ganNlLmxpYnMudXJsX2FyZ3VtZW50cztcblxuICAgICAgICAvLyBDb25maWd1cmF0aW9uIHNldHRpbmdzIGZvciBVc2VyQ29uZmlndXJhdGlvblNlcnZpY2UuXG4gICAgICAgIHZhciBjb25maWd1cmF0aW9uQ29udGFpbmVyID0ge1xuICAgICAgICAgICAgdXNlcklkOiBkYXRhLmN1c3RvbWVyX2lkLFxuICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogJ3JlY2VudF9zZWFyY2hfYXJlYSdcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNb2R1bGUgb2JqZWN0IChKU0VuZ2luZSkuXG4gICAgICAgIHZhciBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gTUVUSE9EU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVmcmVzaGVzIHRoZSBzZWFyY2ggYXJlYSB2YXJpYWJsZVxuICAgICAgICAgKlxuICAgICAgICAgKiBTaG93cyB0aGUgbmV3IHNlYXJjaCBhcmVhIGluIHRoZSBidXR0b25cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfcmVmcmVzaFNlYXJjaEFyZWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBBYm9ydCBpZiBubyBuZXcgc2VhcmNoIGFyZWEgaXMgcHJvdmlkZWRcbiAgICAgICAgICAgIGlmICghJCgnLnNlYXJjaC1pdGVtLmFjdGl2ZScpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIGFjdGl2ZSBsaXN0IGl0ZW0hJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFzc2lnbiBuZXcgc2VhcmNoIGFyZWFcbiAgICAgICAgICAgIHNlYXJjaEFyZWEgPSAkKCcuc2VhcmNoLWl0ZW0uYWN0aXZlJykuZGF0YSgnc2VhcmNoQXJlYScpO1xuICAgICAgICAgICAgJHRoaXMudHJpZ2dlcigncmVmcmVzaDpzZWFyY2gtYXJlYScpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX2luaXRpYWxpemVJbnB1dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgLy8gQ2xpY2sgZXZlbnRcbiAgICAgICAgICAgICR0aGlzLnBhcmVudCgnKicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdyZWZyZXNoOnNlYXJjaC1hcmVhJyk7XG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy52YWwocmVjZW50U2VhcmNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ3Nob3c6ZHJvcGRvd24nKTtcbiAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdmb2N1cycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEtleWJvYXJkIGV2ZW50c1xuICAgICAgICAgICAgJHRoaXMub24oJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC53aGljaCkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm0gc2VhcmNoIGlmIGVudGVyIGtleSBpcyBwcmVzc2VkXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5TWFwLkVOVEVSOlxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcigncGVyZm9ybTpzZWFyY2gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENsb3NlIGRyb3Bkb3duIGlmIGVzY2FwZSBrZXkgaXMgcHJlc3NlZFxuICAgICAgICAgICAgICAgICAgICBjYXNlIGtleU1hcC5FU0M6XG4gICAgICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd24udHJpZ2dlcignaGlkZTpkcm9wZG93bicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5hdmlnYXRlIHVwIGluIGRyb3Bkb3duXG4gICAgICAgICAgICAgICAgICAgIGNhc2Uga2V5TWFwLkFSUk9XX1VQOlxuICAgICAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ3NlbGVjdDppdGVtOnByZXZpb3VzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBrZXlNYXAuQVJST1dfRE9XTjpcbiAgICAgICAgICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbTpuZXh0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ3JlZnJlc2g6c2VhcmNoLWl0ZW0nKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBTZWFyY2ggZXZlbnRzXG4gICAgICAgICAgICAkdGhpcy5vbigncGVyZm9ybTpzZWFyY2gnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0VmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoJHRoaXMudmFsKCkpLFxuICAgICAgICAgICAgICAgICAgICBvcGVuTW9kZSA9ICdfc2VsZicsXG4gICAgICAgICAgICAgICAgICAgIHVybDtcblxuICAgICAgICAgICAgICAgIHN3aXRjaCAoc2VhcmNoQXJlYSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjdXN0b21lcnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjdXN0b21lcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc/c2VhcmNoPScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjYXRlZ29yaWVzJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcy5waHAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc/c2VhcmNoPScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdjb25maWd1cmF0aW9ucyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyYXRpb25zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnP3F1ZXJ5PScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvcmRlcnMnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhZG1pbi5waHAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc/JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG86ICdPcmRlcnNPdmVydmlldycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiBpbnB1dFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdpbnZvaWNlcyc6XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FkbWluLnBocCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJz8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkbzogJ0ludm9pY2VzT3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludm9pY2VOdW1iZXI6IGlucHV0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21hbnVhbCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FkbWluLnBocCcsICc/JywgJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvOiAnRGlyZWN0SGVscFByb3h5L0dvVG9NYW51YWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IGlucHV0VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5Nb2RlID0gJ19ibGFuayc7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd24udHJpZ2dlcignaGlkZTpkcm9wZG93bicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ZvcnVtJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRtaW4ucGhwJywgJz8nLCAkLnBhcmFtKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG86ICdEaXJlY3RIZWxwUHJveHkvR29Ub0ZvcnVtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5OTk5OTkpICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlYXJjaDogaW5wdXRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3Blbk1vZGUgPSAnX2JsYW5rJztcbiAgICAgICAgICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdoaWRlOmRyb3Bkb3duJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGxvYWRpbmcgc3Bpbm5lci5cbiAgICAgICAgICAgICAgICBjb25zdCAkc3Bpbm5lciA9IGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5zaG93KCRkcm9wZG93biwgJzk5OTknKTtcblxuICAgICAgICAgICAgICAgIHVzZXJDb25maWd1cmF0aW9uU2VydmljZS5zZXQoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiAkLmV4dGVuZChjb25maWd1cmF0aW9uQ29udGFpbmVyLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IHNlYXJjaEFyZWFcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG9uU3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCBvcGVuTW9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgb3Blbk1vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJHNwaW5uZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgcGxhY2Vob2xkZXIgd2hlbiBpbnB1dCBpcyBpbmFjdGl2ZVxuICAgICAgICAgICAgJHRoaXMub24oJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ2hpZGU6ZHJvcGRvd24nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfaW5pdGlhbGl6ZUJ1dHRvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ3JlZnJlc2g6c2VhcmNoLWFyZWEnKTtcbiAgICAgICAgICAgICAgICAkdGhpcy52YWwocmVjZW50U2VhcmNoKTtcbiAgICAgICAgICAgICAgICAkZHJvcGRvd24udHJpZ2dlcignc2hvdzpkcm9wZG93bicpO1xuICAgICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2luaXRpYWxpemVEcm9wZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIFNlbGVjdCBpdGVtXG4gICAgICAgICAgICAkZHJvcGRvd24ub24oJ3NlbGVjdDppdGVtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICRkcm9wZG93blxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnbGlbZGF0YS1zZWFyY2gtYXJlYT0nICsgc2VhcmNoQXJlYSArICddJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBTaG93IGV2ZW50XG4gICAgICAgICAgICAkZHJvcGRvd24ub24oJ3Nob3c6ZHJvcGRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLmZhZGVJbigpO1xuICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbScpO1xuICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdyZWZyZXNoOnNlYXJjaC1pdGVtJyk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBTZWxlY3QgZmlyc3QgaXRlbVxuICAgICAgICAgICAgJGRyb3Bkb3duLm9uKCdzZWxlY3Q6aXRlbTpmaXJzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGFjdGl2ZUxpc3RJdGVtID0gJGRyb3Bkb3duLmZpbmQoJ2xpLnNlYXJjaC1pdGVtLmFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciAkZmlyc3RMaXN0SXRlbSA9ICRkcm9wZG93bi5maW5kKCdsaS5zZWFyY2gtaXRlbTpmaXJzdCcpO1xuICAgICAgICAgICAgICAgICRhY3RpdmVMaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJGZpcnN0TGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIF9yZWZyZXNoU2VhcmNoQXJlYSgpO1xuICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRkcm9wZG93bi5vbignc2VsZWN0Oml0ZW06bGFzdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGFjdGl2ZUxpc3RJdGVtID0gJGRyb3Bkb3duLmZpbmQoJ2xpLnNlYXJjaC1pdGVtLmFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciAkbGFzdExpc3RJdGVtID0gJGRyb3Bkb3duLmZpbmQoJ2xpLnNlYXJjaC1pdGVtOmxhc3QnKTtcbiAgICAgICAgICAgICAgICAkYWN0aXZlTGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRsYXN0TGlzdEl0ZW0uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIF9yZWZyZXNoU2VhcmNoQXJlYSgpO1xuICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNlbGVjdCBwcmV2aW91cyBpdGVtIGV2ZW50XG4gICAgICAgICAgICAkZHJvcGRvd24ub24oJ3NlbGVjdDppdGVtOnByZXZpb3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkYWN0aXZlTGlzdEl0ZW0gPSAkZHJvcGRvd24uZmluZCgnbGkuc2VhcmNoLWl0ZW0uYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdmFyICRwcmV2ID0gJGFjdGl2ZUxpc3RJdGVtLnByZXYoKTtcblxuICAgICAgICAgICAgICAgIGlmICgkcHJldi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGFjdGl2ZUxpc3RJdGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHByZXYuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICBfcmVmcmVzaFNlYXJjaEFyZWEoKTtcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ3NlbGVjdDppdGVtJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGRyb3Bkb3duLnRyaWdnZXIoJ3NlbGVjdDppdGVtOmxhc3QnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2VsZWN0IHByZXZpb3VzIGl0ZW0gZXZlbnRcbiAgICAgICAgICAgICRkcm9wZG93bi5vbignc2VsZWN0Oml0ZW06bmV4dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGFjdGl2ZUxpc3RJdGVtID0gJGRyb3Bkb3duLmZpbmQoJ2xpLnNlYXJjaC1pdGVtLmFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHZhciAkbmV4dCA9ICRhY3RpdmVMaXN0SXRlbS5uZXh0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJG5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICRhY3RpdmVMaXN0SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgX3JlZnJlc2hTZWFyY2hBcmVhKCk7XG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbTpmaXJzdCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBIaWRlIGV2ZW50XG4gICAgICAgICAgICAkZHJvcGRvd24ub24oJ2hpZGU6ZHJvcGRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJGRyb3Bkb3duLmZhZGVPdXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJdGVtIGNsaWNrIGV2ZW50XG4gICAgICAgICAgICAkZHJvcGRvd24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAkZHJvcGRvd25cbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIHZhciAkZWxlbWVudFRvQWN0aXZhdGUgPSAkKGV2ZW50LnRhcmdldCkuaXMoJ3NwYW4nKSA/XG4gICAgICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCdsaTpmaXJzdCcpIDpcbiAgICAgICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnRUb0FjdGl2YXRlLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgIF9yZWZyZXNoU2VhcmNoQXJlYSgpO1xuICAgICAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdoaWRlOmRyb3Bkb3duJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcigncGVyZm9ybTpzZWFyY2gnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJdGVtIHNlYXJjaCBldmVudFxuICAgICAgICAgICAgJGRyb3Bkb3duLm9uKCdyZWZyZXNoOnNlYXJjaC1pdGVtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJy5zZWFyY2gtaXRlbScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgc2VhcmNoIHF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2VhcmNoLXF1ZXJ5LWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoJHRoaXMudmFsKCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBzZWFyY2ggZGVzY3JpcHRpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlYXJjaEFyZWFUZXh0ID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzLnNlYXJjaEluLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxzWyQodGhpcykuZGF0YSgnc2VhcmNoQXJlYScpXVxuICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCdkYXRhLXNlYXJjaC1hcmVhJykgPT09ICdtYW51YWwnIHx8ICQodGhpcykuYXR0cignZGF0YS1zZWFyY2gtYXJlYScpID09PSAnZm9ydW0nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWFyY2hBcmVhVGV4dCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHMuc2VhcmNoSW5BbHRlcm5hdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbHNbJCh0aGlzKS5kYXRhKCdzZWFyY2hBcmVhJyldXG4gICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuc2VhcmNoLXF1ZXJ5LWRlc2NyaXB0aW9uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KHNlYXJjaEFyZWFUZXh0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfaW5pdGlhbGl6ZVJlY2VudFNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdKU0VOR0lORV9JTklUX0ZJTklTSEVEJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChyZWNlbnRTZWFyY2ggIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMucHJvcCgndmFsdWUnLCByZWNlbnRTZWFyY2gpO1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd24udHJpZ2dlcignc2hvdzpkcm9wZG93bicpO1xuICAgICAgICAgICAgICAgICAgICAkZHJvcGRvd24udHJpZ2dlcigncmVmcmVzaDpzZWFyY2gtaXRlbScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgZXh0ZW5zaW9uLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIF9pbml0aWFsaXplSW5wdXQoKTtcbiAgICAgICAgICAgIF9pbml0aWFsaXplRHJvcGRvd24oKTtcbiAgICAgICAgICAgIF9pbml0aWFsaXplQnV0dG9uKCk7XG4gICAgICAgICAgICBfaW5pdGlhbGl6ZVJlY2VudFNlYXJjaCgpO1xuXG4gICAgICAgICAgICBzZWFyY2hBcmVhID0gZGF0YS5yZWNlbnRTZWFyY2hBcmVhIHx8ICdjYXRlZ29yaWVzJztcbiAgICAgICAgICAgICRkcm9wZG93bi50cmlnZ2VyKCdzZWxlY3Q6aXRlbScpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
