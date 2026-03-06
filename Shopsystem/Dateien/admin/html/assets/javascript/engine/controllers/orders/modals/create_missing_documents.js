'use strict';

/* --------------------------------------------------------------
 create_missing_documents.js 2016-10-17
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Create Missing Documents Modal
 *
 * This modal prompts the user for the creation of missing order documents (invoices or packing slips). Make sure
 * that you set the "orderIds", "orderIdsWithoutDocument", "type" data values to the modal before showing it.
 *
 * Example:
 *
 * ```
 * $modal
 *   .data({
 *     orderIds: [...], 
 *     orderIdsWithoutDocument: [...], 
 *     type: 'invoice'
 *   })
 *   .modal('show');
 * ```
 */
gx.controllers.module('create_missing_documents', ['modal'], function (data) {

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
    var module = {
        bindings: {
            createMissingDocumentsCheckbox: $this.find('.create-missing-documents-checkbox')
        }
    };

    /**
     * Proceed Event Constant
     *
     * @type {String}
     */
    var PROCEED_EVENT = 'create_missing_documents:proceed';

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Create missing documents.
     *
     * @param {Number[]} orderIds
     * @param {Number[]} orderIdsWithoutDocument
     * @param {String} type
     */
    function _createMissingDocuments(orderIds, orderIdsWithoutDocument, type) {
        var _$;

        var requests = [];
        var downloadPdfWindow = window.open('about:blank');

        orderIdsWithoutDocument.forEach(function (oID) {
            var data = {
                type: type,
                oID: oID,
                ajax: '1'
            };

            requests.push($.getJSON(jse.core.config.get('appUrl') + '/admin/gm_pdf_order.php', data));
        });

        (_$ = $).when.apply(_$, requests).done(function () {
            return $this.trigger(PROCEED_EVENT, [orderIds, type, downloadPdfWindow]);
        });
    }

    /**
     * Remove order IDs that do not have a document.
     *
     * @param {Number[]} orderIds
     * @param {Number[]} orderIdsWithoutDocument
     * @param {String} type
     */
    function _removeOrderIdsWithoutDocument(orderIds, orderIdsWithoutDocument, type) {
        orderIds.forEach(function (id, index) {
            if (orderIdsWithoutDocument.includes(String(id))) {
                orderIds.splice(index);
            }
        });

        if (!orderIds.length) {
            var title = jse.core.lang.translate('DOWNLOAD_DOCUMENTS', 'admin_orders');
            var message = jse.core.lang.translate('NO_DOCUMENTS_ERROR', 'orders');
            jse.libs.modal.showMessage(title, message);
        } else {
            $this.trigger(PROCEED_EVENT, [orderIds, type]);
        }
    }

    /**
     * On Bulk PDF Modal Confirmation Click
     *
     * Proceed with the generation of the concatenated PDF. This handler will trigger the "create_missing_document"
     */
    function _onOkButtonClick() {
        var createMissingDocuments = module.bindings.createMissingDocumentsCheckbox.get();

        var _$this$data = $this.data(),
            orderIds = _$this$data.orderIds,
            orderIdsWithoutDocument = _$this$data.orderIdsWithoutDocument,
            type = _$this$data.type;

        if (createMissingDocuments) {
            _createMissingDocuments(orderIds, orderIdsWithoutDocument, type);
        } else {
            _removeOrderIdsWithoutDocument(orderIds, orderIdsWithoutDocument, type);
        }

        $this.modal('hide');
    }

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', '.btn.ok', _onOkButtonClick);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvY3JlYXRlX21pc3NpbmdfZG9jdW1lbnRzLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiYmluZGluZ3MiLCJjcmVhdGVNaXNzaW5nRG9jdW1lbnRzQ2hlY2tib3giLCJmaW5kIiwiUFJPQ0VFRF9FVkVOVCIsIl9jcmVhdGVNaXNzaW5nRG9jdW1lbnRzIiwib3JkZXJJZHMiLCJvcmRlcklkc1dpdGhvdXREb2N1bWVudCIsInR5cGUiLCJyZXF1ZXN0cyIsImRvd25sb2FkUGRmV2luZG93Iiwid2luZG93Iiwib3BlbiIsImZvckVhY2giLCJvSUQiLCJhamF4IiwicHVzaCIsImdldEpTT04iLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0Iiwid2hlbiIsImRvbmUiLCJ0cmlnZ2VyIiwiX3JlbW92ZU9yZGVySWRzV2l0aG91dERvY3VtZW50IiwiaWQiLCJpbmRleCIsImluY2x1ZGVzIiwiU3RyaW5nIiwic3BsaWNlIiwibGVuZ3RoIiwidGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwibWVzc2FnZSIsImxpYnMiLCJtb2RhbCIsInNob3dNZXNzYWdlIiwiX29uT2tCdXR0b25DbGljayIsImNyZWF0ZU1pc3NpbmdEb2N1bWVudHMiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsMEJBQXRCLEVBQWtELENBQUMsT0FBRCxDQUFsRCxFQUE2RCxVQUFVQyxJQUFWLEVBQWdCOztBQUV6RTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVM7QUFDWEksa0JBQVU7QUFDTkMsNENBQWdDSCxNQUFNSSxJQUFOLENBQVcsb0NBQVg7QUFEMUI7QUFEQyxLQUFm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Iiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBjcmVhdGVfbWlzc2luZ19kb2N1bWVudHMuanMgMjAxNi0xMC0xN1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogQ3JlYXRlIE1pc3NpbmcgRG9jdW1lbnRzIE1vZGFsXG4gKlxuICogVGhpcyBtb2RhbCBwcm9tcHRzIHRoZSB1c2VyIGZvciB0aGUgY3JlYXRpb24gb2YgbWlzc2luZyBvcmRlciBkb2N1bWVudHMgKGludm9pY2VzIG9yIHBhY2tpbmcgc2xpcHMpLiBNYWtlIHN1cmVcbiAqIHRoYXQgeW91IHNldCB0aGUgXCJvcmRlcklkc1wiLCBcIm9yZGVySWRzV2l0aG91dERvY3VtZW50XCIsIFwidHlwZVwiIGRhdGEgdmFsdWVzIHRvIHRoZSBtb2RhbCBiZWZvcmUgc2hvd2luZyBpdC5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIGBgYFxuICogJG1vZGFsXG4gKiAgIC5kYXRhKHtcbiAqICAgICBvcmRlcklkczogWy4uLl0sIFxuICogICAgIG9yZGVySWRzV2l0aG91dERvY3VtZW50OiBbLi4uXSwgXG4gKiAgICAgdHlwZTogJ2ludm9pY2UnXG4gKiAgIH0pXG4gKiAgIC5tb2RhbCgnc2hvdycpO1xuICogYGBgXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZSgnY3JlYXRlX21pc3NpbmdfZG9jdW1lbnRzJywgWydtb2RhbCddLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHtcbiAgICAgICAgYmluZGluZ3M6IHtcbiAgICAgICAgICAgIGNyZWF0ZU1pc3NpbmdEb2N1bWVudHNDaGVja2JveDogJHRoaXMuZmluZCgnLmNyZWF0ZS1taXNzaW5nLWRvY3VtZW50cy1jaGVja2JveCcpXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUHJvY2VlZCBFdmVudCBDb25zdGFudFxuICAgICAqXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICBjb25zdCBQUk9DRUVEX0VWRU5UID0gJ2NyZWF0ZV9taXNzaW5nX2RvY3VtZW50czpwcm9jZWVkJztcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIG1pc3NpbmcgZG9jdW1lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJbXX0gb3JkZXJJZHNcbiAgICAgKiBAcGFyYW0ge051bWJlcltdfSBvcmRlcklkc1dpdGhvdXREb2N1bWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2NyZWF0ZU1pc3NpbmdEb2N1bWVudHMob3JkZXJJZHMsIG9yZGVySWRzV2l0aG91dERvY3VtZW50LCB0eXBlKSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RzID0gW107XG4gICAgICAgIGNvbnN0IGRvd25sb2FkUGRmV2luZG93ID0gd2luZG93Lm9wZW4oJ2Fib3V0OmJsYW5rJyk7XG5cbiAgICAgICAgb3JkZXJJZHNXaXRob3V0RG9jdW1lbnQuZm9yRWFjaChvSUQgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgIG9JRCxcbiAgICAgICAgICAgICAgICBhamF4OiAnMSdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlcXVlc3RzLnB1c2goJC5nZXRKU09OKGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9nbV9wZGZfb3JkZXIucGhwJywgZGF0YSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLndoZW4oLi4ucmVxdWVzdHMpLmRvbmUoKCkgPT4gJHRoaXMudHJpZ2dlcihQUk9DRUVEX0VWRU5ULCBbb3JkZXJJZHMsIHR5cGUsIGRvd25sb2FkUGRmV2luZG93XSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBvcmRlciBJRHMgdGhhdCBkbyBub3QgaGF2ZSBhIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJbXX0gb3JkZXJJZHNcbiAgICAgKiBAcGFyYW0ge051bWJlcltdfSBvcmRlcklkc1dpdGhvdXREb2N1bWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3JlbW92ZU9yZGVySWRzV2l0aG91dERvY3VtZW50KG9yZGVySWRzLCBvcmRlcklkc1dpdGhvdXREb2N1bWVudCwgdHlwZSkge1xuICAgICAgICBvcmRlcklkcy5mb3JFYWNoKChpZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChvcmRlcklkc1dpdGhvdXREb2N1bWVudC5pbmNsdWRlcyhTdHJpbmcoaWQpKSkge1xuICAgICAgICAgICAgICAgIG9yZGVySWRzLnNwbGljZShpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghb3JkZXJJZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdET1dOTE9BRF9ET0NVTUVOVFMnLCAnYWRtaW5fb3JkZXJzJyk7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ05PX0RPQ1VNRU5UU19FUlJPUicsICdvcmRlcnMnKTtcbiAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoUFJPQ0VFRF9FVkVOVCwgW29yZGVySWRzLCB0eXBlXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbiBCdWxrIFBERiBNb2RhbCBDb25maXJtYXRpb24gQ2xpY2tcbiAgICAgKlxuICAgICAqIFByb2NlZWQgd2l0aCB0aGUgZ2VuZXJhdGlvbiBvZiB0aGUgY29uY2F0ZW5hdGVkIFBERi4gVGhpcyBoYW5kbGVyIHdpbGwgdHJpZ2dlciB0aGUgXCJjcmVhdGVfbWlzc2luZ19kb2N1bWVudFwiXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uT2tCdXR0b25DbGljaygpIHtcbiAgICAgICAgY29uc3QgY3JlYXRlTWlzc2luZ0RvY3VtZW50cyA9IG1vZHVsZS5iaW5kaW5ncy5jcmVhdGVNaXNzaW5nRG9jdW1lbnRzQ2hlY2tib3guZ2V0KCk7XG4gICAgICAgIGNvbnN0IHtvcmRlcklkcywgb3JkZXJJZHNXaXRob3V0RG9jdW1lbnQsIHR5cGV9ID0gJHRoaXMuZGF0YSgpO1xuXG4gICAgICAgIGlmIChjcmVhdGVNaXNzaW5nRG9jdW1lbnRzKSB7XG4gICAgICAgICAgICBfY3JlYXRlTWlzc2luZ0RvY3VtZW50cyhvcmRlcklkcywgb3JkZXJJZHNXaXRob3V0RG9jdW1lbnQsIHR5cGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3JlbW92ZU9yZGVySWRzV2l0aG91dERvY3VtZW50KG9yZGVySWRzLCBvcmRlcklkc1dpdGhvdXREb2N1bWVudCwgdHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkdGhpcy5tb2RhbCgnaGlkZScpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgJy5idG4ub2snLCBfb25Pa0J1dHRvbkNsaWNrKTtcbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7ICJdfQ==
