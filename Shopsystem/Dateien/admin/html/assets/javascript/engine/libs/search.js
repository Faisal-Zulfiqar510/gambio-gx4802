'use strict';

/* --------------------------------------------------------------
 search.js 2018-09-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.search = jse.libs.search || {};

/**
 * ## Admin search library.
 *
 * This module provides the search URLs and the configuration key for the admin search controller.
 * Additionally you can set a pre-defined search value by overriding the default search value.
 *
 * @module Admin/Libs/search
 * @exports jse.libs.search
 */
(function (exports) {
    // User configuration key.
    exports.configurationKey = 'recent_search_area';

    // Search areas URLs.
    exports.urls = {
        // Customers
        customers: 'customers?' + $.param({ search: '' }),

        // Categories and products
        categories: 'categories.php?' + $.param({ search: '' }),

        // Orders
        orders: 'admin.php?' + $.param({
            do: 'OrdersOverview',
            filter: {
                number: ''
            }
        }),

        // Invoices
        invoices: 'admin.php?' + $.param({
            do: 'InvoicesOverview',
            filter: {
                invoiceNumber: ''
            }
        }),

        // Manual
        manual: 'admin.php?' + $.param({
            do: 'DirectHelpProxy/GoToManual',
            search: ''
        }),

        // Forum
        forum: 'admin.php?' + $.param({
            do: 'DirectHelpProxy/GoToForum',
            number: Math.floor(Math.random() * 99999999 + 1),
            search: ''
        })
    };

    /**
     * Replaces the admin search input value with the given one.
     *
     * @param {String} term Search term.
     * @param {Boolean} doFocus Do focus on the input field?
     */
    exports.setValue = function (term, doFocus) {
        return $('#search-controller').trigger('set:value', [term, doFocus]);
    };
})(jse.libs.search);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlYXJjaC5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwic2VhcmNoIiwiZXhwb3J0cyIsImNvbmZpZ3VyYXRpb25LZXkiLCJ1cmxzIiwiY3VzdG9tZXJzIiwiJCIsInBhcmFtIiwiY2F0ZWdvcmllcyIsIm9yZGVycyIsImRvIiwiZmlsdGVyIiwibnVtYmVyIiwiaW52b2ljZXMiLCJpbnZvaWNlTnVtYmVyIiwibWFudWFsIiwiZm9ydW0iLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJzZXRWYWx1ZSIsInRlcm0iLCJkb0ZvY3VzIiwidHJpZ2dlciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxJQUFJQyxJQUFKLENBQVNDLE1BQVQsR0FBa0JGLElBQUlDLElBQUosQ0FBU0MsTUFBVCxJQUFtQixFQUFyQzs7QUFFQTs7Ozs7Ozs7O0FBU0MsV0FBVUMsT0FBVixFQUFtQjtBQUNoQjtBQUNBQSxZQUFRQyxnQkFBUixHQUEyQixvQkFBM0I7O0FBRUE7QUFDQUQsWUFBUUUsSUFBUixHQUFlO0FBQ1g7QUFDQUMsbUJBQVcsZUFBZUMsRUFBRUMsS0FBRixDQUFRLEVBQUNOLFFBQVEsRUFBVCxFQUFSLENBRmY7O0FBSVg7QUFDQU8sb0JBQVksb0JBQW9CRixFQUFFQyxLQUFGLENBQVEsRUFBQ04sUUFBUSxFQUFULEVBQVIsQ0FMckI7O0FBT1g7QUFDQVEsZ0JBQVEsZUFBZUgsRUFBRUMsS0FBRixDQUFRO0FBQzNCRyxnQkFBSSxnQkFEdUI7QUFFM0JDLG9CQUFRO0FBQ0pDLHdCQUFRO0FBREo7QUFGbUIsU0FBUixDQVJaOztBQWVYO0FBQ0FDLGtCQUFVLGVBQWVQLEVBQUVDLEtBQUYsQ0FBUTtBQUM3QkcsZ0JBQUksa0JBRHlCO0FBRTdCQyxvQkFBUTtBQUNKRywrQkFBZTtBQURYO0FBRnFCLFNBQVIsQ0FoQmQ7O0FBdUJYO0FBQ0FDLGdCQUFRLGVBQWVULEVBQUVDLEtBQUYsQ0FBUTtBQUMzQkcsZ0JBQUksNEJBRHVCO0FBRTNCVCxvQkFBUTtBQUZtQixTQUFSLENBeEJaOztBQTZCWDtBQUNBZSxlQUFPLGVBQWVWLEVBQUVDLEtBQUYsQ0FBUTtBQUMxQkcsZ0JBQUksMkJBRHNCO0FBRTFCRSxvQkFBUUssS0FBS0MsS0FBTCxDQUFZRCxLQUFLRSxNQUFMLEtBQWdCLFFBQWpCLEdBQTZCLENBQXhDLENBRmtCO0FBRzFCbEIsb0JBQVE7QUFIa0IsU0FBUjtBQTlCWCxLQUFmOztBQXFDQTs7Ozs7O0FBTUFDLFlBQVFrQixRQUFSLEdBQW1CLFVBQUNDLElBQUQsRUFBT0MsT0FBUDtBQUFBLGVBQW1CaEIsRUFBRSxvQkFBRixFQUF3QmlCLE9BQXhCLENBQWdDLFdBQWhDLEVBQTZDLENBQUNGLElBQUQsRUFBT0MsT0FBUCxDQUE3QyxDQUFuQjtBQUFBLEtBQW5CO0FBQ0gsQ0FqREEsRUFpREN2QixJQUFJQyxJQUFKLENBQVNDLE1BakRWLENBQUQiLCJmaWxlIjoic2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzZWFyY2guanMgMjAxOC0wOS0xMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLnNlYXJjaCA9IGpzZS5saWJzLnNlYXJjaCB8fCB7fTtcblxuLyoqXG4gKiAjIyBBZG1pbiBzZWFyY2ggbGlicmFyeS5cbiAqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyB0aGUgc2VhcmNoIFVSTHMgYW5kIHRoZSBjb25maWd1cmF0aW9uIGtleSBmb3IgdGhlIGFkbWluIHNlYXJjaCBjb250cm9sbGVyLlxuICogQWRkaXRpb25hbGx5IHlvdSBjYW4gc2V0IGEgcHJlLWRlZmluZWQgc2VhcmNoIHZhbHVlIGJ5IG92ZXJyaWRpbmcgdGhlIGRlZmF1bHQgc2VhcmNoIHZhbHVlLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vTGlicy9zZWFyY2hcbiAqIEBleHBvcnRzIGpzZS5saWJzLnNlYXJjaFxuICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgICAvLyBVc2VyIGNvbmZpZ3VyYXRpb24ga2V5LlxuICAgIGV4cG9ydHMuY29uZmlndXJhdGlvbktleSA9ICdyZWNlbnRfc2VhcmNoX2FyZWEnO1xuXG4gICAgLy8gU2VhcmNoIGFyZWFzIFVSTHMuXG4gICAgZXhwb3J0cy51cmxzID0ge1xuICAgICAgICAvLyBDdXN0b21lcnNcbiAgICAgICAgY3VzdG9tZXJzOiAnY3VzdG9tZXJzPycgKyAkLnBhcmFtKHtzZWFyY2g6ICcnfSksXG5cbiAgICAgICAgLy8gQ2F0ZWdvcmllcyBhbmQgcHJvZHVjdHNcbiAgICAgICAgY2F0ZWdvcmllczogJ2NhdGVnb3JpZXMucGhwPycgKyAkLnBhcmFtKHtzZWFyY2g6ICcnfSksXG5cbiAgICAgICAgLy8gT3JkZXJzXG4gICAgICAgIG9yZGVyczogJ2FkbWluLnBocD8nICsgJC5wYXJhbSh7XG4gICAgICAgICAgICBkbzogJ09yZGVyc092ZXJ2aWV3JyxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIG51bWJlcjogJydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSksXG5cbiAgICAgICAgLy8gSW52b2ljZXNcbiAgICAgICAgaW52b2ljZXM6ICdhZG1pbi5waHA/JyArICQucGFyYW0oe1xuICAgICAgICAgICAgZG86ICdJbnZvaWNlc092ZXJ2aWV3JyxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGludm9pY2VOdW1iZXI6ICcnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuXG4gICAgICAgIC8vIE1hbnVhbFxuICAgICAgICBtYW51YWw6ICdhZG1pbi5waHA/JyArICQucGFyYW0oe1xuICAgICAgICAgICAgZG86ICdEaXJlY3RIZWxwUHJveHkvR29Ub01hbnVhbCcsXG4gICAgICAgICAgICBzZWFyY2g6ICcnXG4gICAgICAgIH0pLFxuXG4gICAgICAgIC8vIEZvcnVtXG4gICAgICAgIGZvcnVtOiAnYWRtaW4ucGhwPycgKyAkLnBhcmFtKHtcbiAgICAgICAgICAgIGRvOiAnRGlyZWN0SGVscFByb3h5L0dvVG9Gb3J1bScsXG4gICAgICAgICAgICBudW1iZXI6IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTk5OTk5OSkgKyAxKSxcbiAgICAgICAgICAgIHNlYXJjaDogJydcbiAgICAgICAgfSksXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIHRoZSBhZG1pbiBzZWFyY2ggaW5wdXQgdmFsdWUgd2l0aCB0aGUgZ2l2ZW4gb25lLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRlcm0gU2VhcmNoIHRlcm0uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBkb0ZvY3VzIERvIGZvY3VzIG9uIHRoZSBpbnB1dCBmaWVsZD9cbiAgICAgKi9cbiAgICBleHBvcnRzLnNldFZhbHVlID0gKHRlcm0sIGRvRm9jdXMpID0+ICQoJyNzZWFyY2gtY29udHJvbGxlcicpLnRyaWdnZXIoJ3NldDp2YWx1ZScsIFt0ZXJtLCBkb0ZvY3VzXSk7XG59KGpzZS5saWJzLnNlYXJjaCkpO1xuIl19
