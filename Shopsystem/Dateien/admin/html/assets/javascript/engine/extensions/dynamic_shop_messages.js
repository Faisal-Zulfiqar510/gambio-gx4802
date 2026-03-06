'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------------------------------------------------------
 dynamic_shop_messages.js 2016-05-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Dynamic Shop Messages
 *
 * This extension module is meant to be executed once in every page load. Its purpose is to display
 * custom notifications into various positions of the HTML. The notification source may vary in each
 * case but the original data should come from Gambio's Customer Portal.
 *
 * The module supports the use of a "url" option which will be used for loading the JSON data through an
 * AJAX call.
 *
 * ### Options
 *
 * **Data Source URL | `data-dynamic_shop_messages-url` | String | Optional**
 *
 * Provide the URL which will be used to fetch the dynamic shop messages. By default the DynamicShopMessages
 * controller will be used.
 *
 * **Response Envelope | `data-dynamic_shop_messages-response-envelope` | String | Optional**
 *
 * Set a custom response envelop for the response object. By default "MESSAGES" will be used, because this is
 * the envelope from the Gambio Portal response.
 *
 * ### Example
 *
 * ```html
 * <div data-gx-extension="dynamic_shop_messages"
 *     data-dynamic_shop_messages-url="http://custom-url.com/myscript.php"
 *     data-dynamic_shop_messages-response-envelope="MESSAGES">
 *   <-- HTML CONTENT -->
 * </div>
 * ```
 *
 * @module Admin/Extensions/dynamic_shop_messages
 * @ignore
 */
gx.extensions.module('dynamic_shop_messages', [], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        url: jse.core.config.get('appUrl') + '/admin/admin.php?do=DynamicShopMessages',
        lifetime: 30000, // maximum search lifetime (ms)
        responseEnvelope: 'MESSAGES'
    },


    /**
     * Final Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Checks if an HTML markup string is valid.
     *
     * {@link http://stackoverflow.com/a/14216406}
     *
     * @param {string} html The HTML markup to be validated.
     *
     * @returns {bool} Returns the validation result.
     */
    var _validateHtml = function _validateHtml(html) {
        var doc = document.createElement('div');
        doc.innerHTML = html;
        return doc.innerHTML === html;
    };

    /**
     * Check the current page matches the target_page value of the JSON data.
     *
     * @param {string|array} targetPageValue Contains a URL string or an array of URLs to be matched.
     *
     * @return {bool} Returns the validation check.
     */
    var _checkTargetPage = function _checkTargetPage(targetPageValue) {
        var result = false;

        if ((typeof targetPageValue === 'undefined' ? 'undefined' : _typeof(targetPageValue)) !== 'object') {
            targetPageValue = [targetPageValue];
        }

        $.each(targetPageValue, function () {
            var regex = new RegExp(this);

            if (window.location.href === jse.core.config.get('appUrl') + '/admin/' + this || regex.test(window.location.href)) {
                result = true;
                return false; // exit loop
            }
        });

        return result;
    };

    /**
     * Try to apply the dynamic message data into the page.
     *
     * @param {array} messages
     */
    var _apply = function _apply(messages) {
        $.each(messages, function (index, entry) {
            try {
                // Check if we have target information in the message entry.
                if (entry.target_page === undefined || entry.target_selector === undefined) {
                    throw new TypeError('No target information provided. Skipping to the next entry...');
                }

                // Check if we are in the target page.
                if (!_checkTargetPage(entry.target_page)) {
                    throw new TypeError('The entry is not targeted for the current page. Skipping to the next entry...');
                }

                // Find the target selector and append the HTML message. The module will keep on searching
                // for the target selector for as long as the "options.lifetime" value is.
                var currentTimestamp = Date.now;

                var intv = setInterval(function () {
                    var $target = $this.find(entry.target_selector);

                    if ($target.length > 0) {
                        var htmlBackup = $target.html();
                        $target.append(entry.message);

                        // Check if the current HTML is valid and revert it otherwise.
                        if (!_validateHtml($target.html())) {
                            $target.html(htmlBackup);
                            jse.core.debug.error('Dynamic message couldn\'t be applied.', entry);
                        }

                        clearInterval(intv); // stop searching
                    }

                    if (Date.now - currentTimestamp > options.lifetime) {
                        clearInterval(intv);
                        throw Error('Search lifetime limit exceeded, no element matched the provided selector.');
                    }
                }, 300);
            } catch (e) {
                return true; // Continue loop with next message entry.
            }
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(document).on('JSENGINE_INIT_FINISHED', function () {
            $.getJSON(options.url).done(function (response) {
                _apply(response[options.responseEnvelope]);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                jse.core.debug.info('Could not load the dynamic shop messages.', jqXHR, textStatus, errorThrown);
            });
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImR5bmFtaWNfc2hvcF9tZXNzYWdlcy5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJ1cmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwibGlmZXRpbWUiLCJyZXNwb25zZUVudmVsb3BlIiwib3B0aW9ucyIsImV4dGVuZCIsIl92YWxpZGF0ZUh0bWwiLCJodG1sIiwiZG9jIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiX2NoZWNrVGFyZ2V0UGFnZSIsInRhcmdldFBhZ2VWYWx1ZSIsInJlc3VsdCIsImVhY2giLCJyZWdleCIsIlJlZ0V4cCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsInRlc3QiLCJfYXBwbHkiLCJtZXNzYWdlcyIsImluZGV4IiwiZW50cnkiLCJ0YXJnZXRfcGFnZSIsInVuZGVmaW5lZCIsInRhcmdldF9zZWxlY3RvciIsIlR5cGVFcnJvciIsImN1cnJlbnRUaW1lc3RhbXAiLCJEYXRlIiwibm93IiwiaW50diIsInNldEludGVydmFsIiwiJHRhcmdldCIsImZpbmQiLCJsZW5ndGgiLCJodG1sQmFja3VwIiwiYXBwZW5kIiwibWVzc2FnZSIsImRlYnVnIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwiRXJyb3IiLCJlIiwiaW5pdCIsImRvbmUiLCJvbiIsImdldEpTT04iLCJyZXNwb25zZSIsImZhaWwiLCJqcVhIUiIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsImluZm8iXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksdUJBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1BDLGFBQUtDLElBQUlDLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0MseUNBRDlCO0FBRVBDLGtCQUFVLEtBRkgsRUFFVTtBQUNqQkMsMEJBQWtCO0FBSFgsS0FiZjs7O0FBbUJJOzs7OztBQUtBQyxjQUFVVCxFQUFFVSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJULFFBQW5CLEVBQTZCSCxJQUE3QixDQXhCZDs7O0FBMEJJOzs7OztBQUtBRCxhQUFTLEVBL0JiOztBQWlDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQVNBLFFBQUljLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVUMsSUFBVixFQUFnQjtBQUNoQyxZQUFJQyxNQUFNQyxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQVY7QUFDQUYsWUFBSUcsU0FBSixHQUFnQkosSUFBaEI7QUFDQSxlQUFRQyxJQUFJRyxTQUFKLEtBQWtCSixJQUExQjtBQUNILEtBSkQ7O0FBTUE7Ozs7Ozs7QUFPQSxRQUFJSyxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFVQyxlQUFWLEVBQTJCO0FBQzlDLFlBQUlDLFNBQVMsS0FBYjs7QUFFQSxZQUFJLFFBQU9ELGVBQVAseUNBQU9BLGVBQVAsT0FBMkIsUUFBL0IsRUFBeUM7QUFDckNBLDhCQUFrQixDQUFDQSxlQUFELENBQWxCO0FBQ0g7O0FBRURsQixVQUFFb0IsSUFBRixDQUFPRixlQUFQLEVBQXdCLFlBQVk7QUFDaEMsZ0JBQUlHLFFBQVEsSUFBSUMsTUFBSixDQUFXLElBQVgsQ0FBWjs7QUFFQSxnQkFBSUMsT0FBT0MsUUFBUCxDQUFnQkMsSUFBaEIsS0FBeUJ0QixJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLElBQWdDLFNBQWhDLEdBQTRDLElBQXJFLElBQ0dlLE1BQU1LLElBQU4sQ0FBV0gsT0FBT0MsUUFBUCxDQUFnQkMsSUFBM0IsQ0FEUCxFQUN5QztBQUNyQ04seUJBQVMsSUFBVDtBQUNBLHVCQUFPLEtBQVAsQ0FGcUMsQ0FFdkI7QUFDakI7QUFDSixTQVJEOztBQVVBLGVBQU9BLE1BQVA7QUFDSCxLQWxCRDs7QUFvQkE7Ozs7O0FBS0EsUUFBSVEsU0FBUyxTQUFUQSxNQUFTLENBQVVDLFFBQVYsRUFBb0I7QUFDN0I1QixVQUFFb0IsSUFBRixDQUFPUSxRQUFQLEVBQWlCLFVBQVVDLEtBQVYsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQ3JDLGdCQUFJO0FBQ0E7QUFDQSxvQkFBSUEsTUFBTUMsV0FBTixLQUFzQkMsU0FBdEIsSUFBbUNGLE1BQU1HLGVBQU4sS0FBMEJELFNBQWpFLEVBQTRFO0FBQ3hFLDBCQUFNLElBQUlFLFNBQUosQ0FBYywrREFBZCxDQUFOO0FBQ0g7O0FBRUQ7QUFDQSxvQkFBSSxDQUFDakIsaUJBQWlCYSxNQUFNQyxXQUF2QixDQUFMLEVBQTBDO0FBQ3RDLDBCQUFNLElBQUlHLFNBQUosQ0FDRiwrRUFERSxDQUFOO0FBRUg7O0FBRUQ7QUFDQTtBQUNBLG9CQUFJQyxtQkFBbUJDLEtBQUtDLEdBQTVCOztBQUVBLG9CQUFJQyxPQUFPQyxZQUFZLFlBQVk7QUFDL0Isd0JBQUlDLFVBQVV6QyxNQUFNMEMsSUFBTixDQUFXWCxNQUFNRyxlQUFqQixDQUFkOztBQUVBLHdCQUFJTyxRQUFRRSxNQUFSLEdBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLDRCQUFJQyxhQUFhSCxRQUFRNUIsSUFBUixFQUFqQjtBQUNBNEIsZ0NBQVFJLE1BQVIsQ0FBZWQsTUFBTWUsT0FBckI7O0FBRUE7QUFDQSw0QkFBSSxDQUFDbEMsY0FBYzZCLFFBQVE1QixJQUFSLEVBQWQsQ0FBTCxFQUFvQztBQUNoQzRCLG9DQUFRNUIsSUFBUixDQUFhK0IsVUFBYjtBQUNBeEMsZ0NBQUlDLElBQUosQ0FBUzBDLEtBQVQsQ0FBZUMsS0FBZixDQUFxQix1Q0FBckIsRUFBOERqQixLQUE5RDtBQUNIOztBQUVEa0Isc0NBQWNWLElBQWQsRUFWb0IsQ0FVQztBQUN4Qjs7QUFFRCx3QkFBSUYsS0FBS0MsR0FBTCxHQUFXRixnQkFBWCxHQUE4QjFCLFFBQVFGLFFBQTFDLEVBQW9EO0FBQ2hEeUMsc0NBQWNWLElBQWQ7QUFDQSw4QkFBTVcsTUFDRiwyRUFERSxDQUFOO0FBRUg7QUFDSixpQkFyQlUsRUFxQlIsR0FyQlEsQ0FBWDtBQXVCSCxhQXZDRCxDQXVDRSxPQUFPQyxDQUFQLEVBQVU7QUFDUix1QkFBTyxJQUFQLENBRFEsQ0FDSztBQUNoQjtBQUNKLFNBM0NEO0FBNENILEtBN0NEOztBQStDQTtBQUNBO0FBQ0E7O0FBRUFyRCxXQUFPc0QsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJwRCxVQUFFYyxRQUFGLEVBQVl1QyxFQUFaLENBQWUsd0JBQWYsRUFBeUMsWUFBWTtBQUNqRHJELGNBQUVzRCxPQUFGLENBQVU3QyxRQUFRUCxHQUFsQixFQUNLa0QsSUFETCxDQUNVLFVBQVVHLFFBQVYsRUFBb0I7QUFDdEI1Qix1QkFBTzRCLFNBQVM5QyxRQUFRRCxnQkFBakIsQ0FBUDtBQUNILGFBSEwsRUFJS2dELElBSkwsQ0FJVSxVQUFVQyxLQUFWLEVBQWlCQyxVQUFqQixFQUE2QkMsV0FBN0IsRUFBMEM7QUFDNUN4RCxvQkFBSUMsSUFBSixDQUFTMEMsS0FBVCxDQUFlYyxJQUFmLENBQW9CLDJDQUFwQixFQUFpRUgsS0FBakUsRUFBd0VDLFVBQXhFLEVBQ0lDLFdBREo7QUFFSCxhQVBMO0FBUUgsU0FURDs7QUFXQVA7QUFDSCxLQWJEOztBQWVBLFdBQU92RCxNQUFQO0FBQ0gsQ0FwS0wiLCJmaWxlIjoiZHluYW1pY19zaG9wX21lc3NhZ2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBkeW5hbWljX3Nob3BfbWVzc2FnZXMuanMgMjAxNi0wNS0xMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRHluYW1pYyBTaG9wIE1lc3NhZ2VzXG4gKlxuICogVGhpcyBleHRlbnNpb24gbW9kdWxlIGlzIG1lYW50IHRvIGJlIGV4ZWN1dGVkIG9uY2UgaW4gZXZlcnkgcGFnZSBsb2FkLiBJdHMgcHVycG9zZSBpcyB0byBkaXNwbGF5XG4gKiBjdXN0b20gbm90aWZpY2F0aW9ucyBpbnRvIHZhcmlvdXMgcG9zaXRpb25zIG9mIHRoZSBIVE1MLiBUaGUgbm90aWZpY2F0aW9uIHNvdXJjZSBtYXkgdmFyeSBpbiBlYWNoXG4gKiBjYXNlIGJ1dCB0aGUgb3JpZ2luYWwgZGF0YSBzaG91bGQgY29tZSBmcm9tIEdhbWJpbydzIEN1c3RvbWVyIFBvcnRhbC5cbiAqXG4gKiBUaGUgbW9kdWxlIHN1cHBvcnRzIHRoZSB1c2Ugb2YgYSBcInVybFwiIG9wdGlvbiB3aGljaCB3aWxsIGJlIHVzZWQgZm9yIGxvYWRpbmcgdGhlIEpTT04gZGF0YSB0aHJvdWdoIGFuXG4gKiBBSkFYIGNhbGwuXG4gKlxuICogIyMjIE9wdGlvbnNcbiAqXG4gKiAqKkRhdGEgU291cmNlIFVSTCB8IGBkYXRhLWR5bmFtaWNfc2hvcF9tZXNzYWdlcy11cmxgIHwgU3RyaW5nIHwgT3B0aW9uYWwqKlxuICpcbiAqIFByb3ZpZGUgdGhlIFVSTCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gZmV0Y2ggdGhlIGR5bmFtaWMgc2hvcCBtZXNzYWdlcy4gQnkgZGVmYXVsdCB0aGUgRHluYW1pY1Nob3BNZXNzYWdlc1xuICogY29udHJvbGxlciB3aWxsIGJlIHVzZWQuXG4gKlxuICogKipSZXNwb25zZSBFbnZlbG9wZSB8IGBkYXRhLWR5bmFtaWNfc2hvcF9tZXNzYWdlcy1yZXNwb25zZS1lbnZlbG9wZWAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogU2V0IGEgY3VzdG9tIHJlc3BvbnNlIGVudmVsb3AgZm9yIHRoZSByZXNwb25zZSBvYmplY3QuIEJ5IGRlZmF1bHQgXCJNRVNTQUdFU1wiIHdpbGwgYmUgdXNlZCwgYmVjYXVzZSB0aGlzIGlzXG4gKiB0aGUgZW52ZWxvcGUgZnJvbSB0aGUgR2FtYmlvIFBvcnRhbCByZXNwb25zZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgZGF0YS1neC1leHRlbnNpb249XCJkeW5hbWljX3Nob3BfbWVzc2FnZXNcIlxuICogICAgIGRhdGEtZHluYW1pY19zaG9wX21lc3NhZ2VzLXVybD1cImh0dHA6Ly9jdXN0b20tdXJsLmNvbS9teXNjcmlwdC5waHBcIlxuICogICAgIGRhdGEtZHluYW1pY19zaG9wX21lc3NhZ2VzLXJlc3BvbnNlLWVudmVsb3BlPVwiTUVTU0FHRVNcIj5cbiAqICAgPC0tIEhUTUwgQ09OVEVOVCAtLT5cbiAqIDwvZGl2PlxuICogYGBgXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL2R5bmFtaWNfc2hvcF9tZXNzYWdlc1xuICogQGlnbm9yZVxuICovXG5neC5leHRlbnNpb25zLm1vZHVsZShcbiAgICAnZHluYW1pY19zaG9wX21lc3NhZ2VzJyxcblxuICAgIFtdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBsZXRcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIHVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1EeW5hbWljU2hvcE1lc3NhZ2VzJyxcbiAgICAgICAgICAgICAgICBsaWZldGltZTogMzAwMDAsIC8vIG1heGltdW0gc2VhcmNoIGxpZmV0aW1lIChtcylcbiAgICAgICAgICAgICAgICByZXNwb25zZUVudmVsb3BlOiAnTUVTU0FHRVMnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIGFuIEhUTUwgbWFya3VwIHN0cmluZyBpcyB2YWxpZC5cbiAgICAgICAgICpcbiAgICAgICAgICoge0BsaW5rIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE0MjE2NDA2fVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBUaGUgSFRNTCBtYXJrdXAgdG8gYmUgdmFsaWRhdGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbH0gUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3ZhbGlkYXRlSHRtbCA9IGZ1bmN0aW9uIChodG1sKSB7XG4gICAgICAgICAgICB2YXIgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBkb2MuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICAgICAgIHJldHVybiAoZG9jLmlubmVySFRNTCA9PT0gaHRtbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIHRoZSBjdXJyZW50IHBhZ2UgbWF0Y2hlcyB0aGUgdGFyZ2V0X3BhZ2UgdmFsdWUgb2YgdGhlIEpTT04gZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IHRhcmdldFBhZ2VWYWx1ZSBDb250YWlucyBhIFVSTCBzdHJpbmcgb3IgYW4gYXJyYXkgb2YgVVJMcyB0byBiZSBtYXRjaGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtib29sfSBSZXR1cm5zIHRoZSB2YWxpZGF0aW9uIGNoZWNrLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9jaGVja1RhcmdldFBhZ2UgPSBmdW5jdGlvbiAodGFyZ2V0UGFnZVZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0UGFnZVZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHRhcmdldFBhZ2VWYWx1ZSA9IFt0YXJnZXRQYWdlVmFsdWVdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2godGFyZ2V0UGFnZVZhbHVlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZiA9PT0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluLycgKyB0aGlzXG4gICAgICAgICAgICAgICAgICAgIHx8IHJlZ2V4LnRlc3Qod2luZG93LmxvY2F0aW9uLmhyZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gZXhpdCBsb29wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyeSB0byBhcHBseSB0aGUgZHluYW1pYyBtZXNzYWdlIGRhdGEgaW50byB0aGUgcGFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHthcnJheX0gbWVzc2FnZXNcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfYXBwbHkgPSBmdW5jdGlvbiAobWVzc2FnZXMpIHtcbiAgICAgICAgICAgICQuZWFjaChtZXNzYWdlcywgZnVuY3Rpb24gKGluZGV4LCBlbnRyeSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlIGhhdmUgdGFyZ2V0IGluZm9ybWF0aW9uIGluIHRoZSBtZXNzYWdlIGVudHJ5LlxuICAgICAgICAgICAgICAgICAgICBpZiAoZW50cnkudGFyZ2V0X3BhZ2UgPT09IHVuZGVmaW5lZCB8fCBlbnRyeS50YXJnZXRfc2VsZWN0b3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTm8gdGFyZ2V0IGluZm9ybWF0aW9uIHByb3ZpZGVkLiBTa2lwcGluZyB0byB0aGUgbmV4dCBlbnRyeS4uLicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgd2UgYXJlIGluIHRoZSB0YXJnZXQgcGFnZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfY2hlY2tUYXJnZXRQYWdlKGVudHJ5LnRhcmdldF9wYWdlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnVGhlIGVudHJ5IGlzIG5vdCB0YXJnZXRlZCBmb3IgdGhlIGN1cnJlbnQgcGFnZS4gU2tpcHBpbmcgdG8gdGhlIG5leHQgZW50cnkuLi4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBzZWxlY3RvciBhbmQgYXBwZW5kIHRoZSBIVE1MIG1lc3NhZ2UuIFRoZSBtb2R1bGUgd2lsbCBrZWVwIG9uIHNlYXJjaGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgdGhlIHRhcmdldCBzZWxlY3RvciBmb3IgYXMgbG9uZyBhcyB0aGUgXCJvcHRpb25zLmxpZmV0aW1lXCIgdmFsdWUgaXMuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGltZXN0YW1wID0gRGF0ZS5ub3c7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGludHYgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRhcmdldCA9ICR0aGlzLmZpbmQoZW50cnkudGFyZ2V0X3NlbGVjdG9yKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBodG1sQmFja3VwID0gJHRhcmdldC5odG1sKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhcmdldC5hcHBlbmQoZW50cnkubWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3VycmVudCBIVE1MIGlzIHZhbGlkIGFuZCByZXZlcnQgaXQgb3RoZXJ3aXNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX3ZhbGlkYXRlSHRtbCgkdGFyZ2V0Lmh0bWwoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhcmdldC5odG1sKGh0bWxCYWNrdXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5lcnJvcignRHluYW1pYyBtZXNzYWdlIGNvdWxkblxcJ3QgYmUgYXBwbGllZC4nLCBlbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnR2KTsgLy8gc3RvcCBzZWFyY2hpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGUubm93IC0gY3VycmVudFRpbWVzdGFtcCA+IG9wdGlvbnMubGlmZXRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnU2VhcmNoIGxpZmV0aW1lIGxpbWl0IGV4Y2VlZGVkLCBubyBlbGVtZW50IG1hdGNoZWQgdGhlIHByb3ZpZGVkIHNlbGVjdG9yLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCAzMDApO1xuXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gQ29udGludWUgbG9vcCB3aXRoIG5leHQgbWVzc2FnZSBlbnRyeS5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJC5nZXRKU09OKG9wdGlvbnMudXJsKVxuICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hcHBseShyZXNwb25zZVtvcHRpb25zLnJlc3BvbnNlRW52ZWxvcGVdKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmNvcmUuZGVidWcuaW5mbygnQ291bGQgbm90IGxvYWQgdGhlIGR5bmFtaWMgc2hvcCBtZXNzYWdlcy4nLCBqcVhIUiwgdGV4dFN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvclRocm93bik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
