'use strict';

/* --------------------------------------------------------------
 static_seo_urls_index_delete.js 2017-05-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Static Seo Urls Overview Delete
 *
 * Handles the delete operation of the static seo urls overview page.
 */
gx.controllers.module('static_seo_urls_index_delete', ['modal', gx.source + '/libs/info_box'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Static seo url delete confirmation modal.
     *
     * @type {jQuery}
     */
    var $modal = $('.delete-static-seo-url.modal');

    /**
     * Delete button selector string.
     *
     * @type {String}
     */
    var deleteButtonSelector = '.btn-delete';

    /**
     * Delete static seo url action URL.
     *
     * @type {String}
     */
    var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=StaticSeoUrlAjax/DeleteStaticSeoUrl';

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Shows the submit error message modal.
     */
    function _showFailMessage() {
        // Message texts.
        var errorTitle = jse.core.lang.translate('DELETE_STATIC_SEO_URL_ERROR_TITLE', 'static_seo_urls');
        var errorMessage = jse.core.lang.translate('DELETE_STATIC_SEO_URL_ERROR_TEXT', 'static_seo_urls');

        // Show modal.
        jse.libs.modal.showMessage(errorTitle, errorMessage);
    }

    /**
     * Handles the delete click event by opening the delete confirmation modal.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _onDeleteClick(event) {
        // Prevent default action.
        event.preventDefault();

        // Table row.
        var $parentTableRow = $(event.target).parents('tr');

        // Delete confirmation modal button.
        var $confirmButton = $modal.find('button.confirm');

        // Empty modal body.
        $modal.find('.modal-body .form-group').remove();

        // Static seo url data.
        var staticSeoUrlData = {
            id: $parentTableRow.data('staticSeoUrlId'),
            name: $parentTableRow.data('staticSeoUrlName')
        };

        // Put new static seo url information into modal body.
        $modal.find('.modal-body fieldset').html(_generateStaticSeoUrlInfoMarkup(staticSeoUrlData));

        // Show modal.
        $modal.modal('show');

        // Handle delete confirmation modal button click event.
        $confirmButton.off('click').on('click', function () {
            return _onConfirmButtonClick(staticSeoUrlData.id);
        });
    }

    /**
     * Handles the delete confirmation button click event by removing the static seo url through an AJAX request.
     *
     * @param {Number} staticSeoUrlId Static Seo Url ID.
     */
    function _onConfirmButtonClick(staticSeoUrlId) {
        // AJAX request options.
        var requestOptions = {
            type: 'POST',
            data: { staticSeoUrlId: staticSeoUrlId },
            url: url
        };

        // Perform request.
        $.ajax(requestOptions).done(function (response) {
            return _handleDeleteRequestResponse(response, staticSeoUrlId);
        }).fail(_showFailMessage).always(function () {
            return $modal.modal('hide');
        });
    }

    /**
     * Handles static seo url deletion AJAX action server response.
     *
     * @param {Object} response Server response.
     * @param {Number} staticSeoUrlId ID of deleted static seo url.
     */
    function _handleDeleteRequestResponse(response, staticSeoUrlId) {
        // Error message phrases.
        var errorTitle = jse.core.lang.translate('DELETE_STATIC_SEO_URL_ERROR_TITLE', 'static_seo_urls');
        var errorMessage = jse.core.lang.translate('DELETE_STATIC_SEO_URL_ERROR_TEXT', 'static_seo_urls');

        // Table body.
        var $tableBody = $this.find('tbody');

        // Table rows.
        var $rows = $tableBody.find('[data-static-seo-url-id]');

        // Table rows that will be deleted.
        var $rowToDelete = $rows.filter('[data-static-seo-url-id="' + staticSeoUrlId + '"]');

        // 'No results' message table row template.
        var $emptyRowTemplate = $('#template-table-row-empty');

        // Check for action success.
        if (response.includes('success')) {
            // Delete respective table rows.
            $rowToDelete.remove();

            // Add success message to admin info box.
            jse.libs.info_box.addSuccessMessage();

            // If there are no rows, show 'No results' message row.
            if ($rows.length - 1 < 1) {
                $tableBody.empty().append($emptyRowTemplate.clone().html());
            }
        } else {
            // Show error message modal.
            jse.libs.modal.showMessage(errorTitle, errorMessage);
        }
    }

    /**
     * Generates HTML containing the static seo url information for the delete confirmation modal.
     *
     * @param {Object} data Static seo url data.
     *
     * @return {String} Created HTML string.
     */
    function _generateStaticSeoUrlInfoMarkup(data) {
        // Label phrases.
        var staticSeoUrlNameLabel = jse.core.lang.translate('NAME', 'static_seo_urls');

        // Return markup.
        return '\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<label class="col-md-5">' + staticSeoUrlNameLabel + '</label>\n\t\t\t\t\t\t<div class="col-md-7">' + data.name + '</div>\n\t\t\t\t\t</div>\n\t\t\t';
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to form submit event.
        $this.on('click', deleteButtonSelector, _onDeleteClick);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpY19zZW9fdXJscy9zdGF0aWNfc2VvX3VybHNfaW5kZXhfZGVsZXRlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJG1vZGFsIiwiZGVsZXRlQnV0dG9uU2VsZWN0b3IiLCJ1cmwiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiX3Nob3dGYWlsTWVzc2FnZSIsImVycm9yVGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwiZXJyb3JNZXNzYWdlIiwibGlicyIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJfb25EZWxldGVDbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCIkcGFyZW50VGFibGVSb3ciLCJ0YXJnZXQiLCJwYXJlbnRzIiwiJGNvbmZpcm1CdXR0b24iLCJmaW5kIiwicmVtb3ZlIiwic3RhdGljU2VvVXJsRGF0YSIsImlkIiwibmFtZSIsImh0bWwiLCJfZ2VuZXJhdGVTdGF0aWNTZW9VcmxJbmZvTWFya3VwIiwib2ZmIiwib24iLCJfb25Db25maXJtQnV0dG9uQ2xpY2siLCJzdGF0aWNTZW9VcmxJZCIsInJlcXVlc3RPcHRpb25zIiwidHlwZSIsImFqYXgiLCJkb25lIiwiX2hhbmRsZURlbGV0ZVJlcXVlc3RSZXNwb25zZSIsInJlc3BvbnNlIiwiZmFpbCIsImFsd2F5cyIsIiR0YWJsZUJvZHkiLCIkcm93cyIsIiRyb3dUb0RlbGV0ZSIsImZpbHRlciIsIiRlbXB0eVJvd1RlbXBsYXRlIiwiaW5jbHVkZXMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwibGVuZ3RoIiwiZW1wdHkiLCJhcHBlbmQiLCJjbG9uZSIsInN0YXRpY1Nlb1VybE5hbWVMYWJlbCIsImluaXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksOEJBREosRUFHSSxDQUNJLE9BREosRUFF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ZW9fdXJsc19pbmRleF9kZWxldGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHN0YXRpY19zZW9fdXJsc19pbmRleF9kZWxldGUuanMgMjAxNy0wNS0yNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogU3RhdGljIFNlbyBVcmxzIE92ZXJ2aWV3IERlbGV0ZVxuICpcbiAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBvcGVyYXRpb24gb2YgdGhlIHN0YXRpYyBzZW8gdXJscyBvdmVydmlldyBwYWdlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3N0YXRpY19zZW9fdXJsc19pbmRleF9kZWxldGUnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19ib3hgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RhdGljIHNlbyB1cmwgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5kZWxldGUtc3RhdGljLXNlby11cmwubW9kYWwnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIGJ1dHRvbiBzZWxlY3RvciBzdHJpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWxldGVCdXR0b25TZWxlY3RvciA9ICcuYnRuLWRlbGV0ZSc7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSBzdGF0aWMgc2VvIHVybCBhY3Rpb24gVVJMLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdXJsID0gYCR7anNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJyl9L2FkbWluL2FkbWluLnBocD9kbz1TdGF0aWNTZW9VcmxBamF4L0RlbGV0ZVN0YXRpY1Nlb1VybGA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIHRoZSBzdWJtaXQgZXJyb3IgbWVzc2FnZSBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RmFpbE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAvLyBNZXNzYWdlIHRleHRzLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JUaXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdERUxFVEVfU1RBVElDX1NFT19VUkxfRVJST1JfVElUTEUnLCAnc3RhdGljX3Nlb191cmxzJyk7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnREVMRVRFX1NUQVRJQ19TRU9fVVJMX0VSUk9SX1RFWFQnLCAnc3RhdGljX3Nlb191cmxzJyk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgbW9kYWwuXG4gICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShlcnJvclRpdGxlLCBlcnJvck1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBjbGljayBldmVudCBieSBvcGVuaW5nIHRoZSBkZWxldGUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRGVsZXRlQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBUYWJsZSByb3cuXG4gICAgICAgICAgICBjb25zdCAkcGFyZW50VGFibGVSb3cgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKTtcblxuICAgICAgICAgICAgLy8gRGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbCBidXR0b24uXG4gICAgICAgICAgICBjb25zdCAkY29uZmlybUJ1dHRvbiA9ICRtb2RhbC5maW5kKCdidXR0b24uY29uZmlybScpO1xuXG4gICAgICAgICAgICAvLyBFbXB0eSBtb2RhbCBib2R5LlxuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5tb2RhbC1ib2R5IC5mb3JtLWdyb3VwJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIFN0YXRpYyBzZW8gdXJsIGRhdGEuXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNTZW9VcmxEYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiAkcGFyZW50VGFibGVSb3cuZGF0YSgnc3RhdGljU2VvVXJsSWQnKSxcbiAgICAgICAgICAgICAgICBuYW1lOiAkcGFyZW50VGFibGVSb3cuZGF0YSgnc3RhdGljU2VvVXJsTmFtZScpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBQdXQgbmV3IHN0YXRpYyBzZW8gdXJsIGluZm9ybWF0aW9uIGludG8gbW9kYWwgYm9keS5cbiAgICAgICAgICAgICRtb2RhbFxuICAgICAgICAgICAgICAgIC5maW5kKCcubW9kYWwtYm9keSBmaWVsZHNldCcpXG4gICAgICAgICAgICAgICAgLmh0bWwoX2dlbmVyYXRlU3RhdGljU2VvVXJsSW5mb01hcmt1cChzdGF0aWNTZW9VcmxEYXRhKSk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgbW9kYWwuXG4gICAgICAgICAgICAkbW9kYWwubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwgYnV0dG9uIGNsaWNrIGV2ZW50LlxuICAgICAgICAgICAgJGNvbmZpcm1CdXR0b25cbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICgpID0+IF9vbkNvbmZpcm1CdXR0b25DbGljayhzdGF0aWNTZW9VcmxEYXRhLmlkKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgZGVsZXRlIGNvbmZpcm1hdGlvbiBidXR0b24gY2xpY2sgZXZlbnQgYnkgcmVtb3ZpbmcgdGhlIHN0YXRpYyBzZW8gdXJsIHRocm91Z2ggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhdGljU2VvVXJsSWQgU3RhdGljIFNlbyBVcmwgSUQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Db25maXJtQnV0dG9uQ2xpY2soc3RhdGljU2VvVXJsSWQpIHtcbiAgICAgICAgICAgIC8vIEFKQVggcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtzdGF0aWNTZW9VcmxJZH0sXG4gICAgICAgICAgICAgICAgdXJsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBQZXJmb3JtIHJlcXVlc3QuXG4gICAgICAgICAgICAkLmFqYXgocmVxdWVzdE9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4gX2hhbmRsZURlbGV0ZVJlcXVlc3RSZXNwb25zZShyZXNwb25zZSwgc3RhdGljU2VvVXJsSWQpKVxuICAgICAgICAgICAgICAgIC5mYWlsKF9zaG93RmFpbE1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgLmFsd2F5cygoKSA9PiAkbW9kYWwubW9kYWwoJ2hpZGUnKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyBzdGF0aWMgc2VvIHVybCBkZWxldGlvbiBBSkFYIGFjdGlvbiBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBTZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0aWNTZW9VcmxJZCBJRCBvZiBkZWxldGVkIHN0YXRpYyBzZW8gdXJsLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2hhbmRsZURlbGV0ZVJlcXVlc3RSZXNwb25zZShyZXNwb25zZSwgc3RhdGljU2VvVXJsSWQpIHtcbiAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2UgcGhyYXNlcy5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yVGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnREVMRVRFX1NUQVRJQ19TRU9fVVJMX0VSUk9SX1RJVExFJywgJ3N0YXRpY19zZW9fdXJscycpO1xuICAgICAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0RFTEVURV9TVEFUSUNfU0VPX1VSTF9FUlJPUl9URVhUJywgJ3N0YXRpY19zZW9fdXJscycpO1xuXG4gICAgICAgICAgICAvLyBUYWJsZSBib2R5LlxuICAgICAgICAgICAgY29uc3QgJHRhYmxlQm9keSA9ICR0aGlzLmZpbmQoJ3Rib2R5Jyk7XG5cbiAgICAgICAgICAgIC8vIFRhYmxlIHJvd3MuXG4gICAgICAgICAgICBjb25zdCAkcm93cyA9ICR0YWJsZUJvZHkuZmluZChgW2RhdGEtc3RhdGljLXNlby11cmwtaWRdYCk7XG5cbiAgICAgICAgICAgIC8vIFRhYmxlIHJvd3MgdGhhdCB3aWxsIGJlIGRlbGV0ZWQuXG4gICAgICAgICAgICBjb25zdCAkcm93VG9EZWxldGUgPSAkcm93cy5maWx0ZXIoYFtkYXRhLXN0YXRpYy1zZW8tdXJsLWlkPVwiJHtzdGF0aWNTZW9VcmxJZH1cIl1gKTtcblxuICAgICAgICAgICAgLy8gJ05vIHJlc3VsdHMnIG1lc3NhZ2UgdGFibGUgcm93IHRlbXBsYXRlLlxuICAgICAgICAgICAgY29uc3QgJGVtcHR5Um93VGVtcGxhdGUgPSAkKCcjdGVtcGxhdGUtdGFibGUtcm93LWVtcHR5Jyk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZvciBhY3Rpb24gc3VjY2Vzcy5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5pbmNsdWRlcygnc3VjY2VzcycpKSB7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIHJlc3BlY3RpdmUgdGFibGUgcm93cy5cbiAgICAgICAgICAgICAgICAkcm93VG9EZWxldGUucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgc3VjY2VzcyBtZXNzYWdlIHRvIGFkbWluIGluZm8gYm94LlxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmluZm9fYm94LmFkZFN1Y2Nlc3NNZXNzYWdlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gcm93cywgc2hvdyAnTm8gcmVzdWx0cycgbWVzc2FnZSByb3cuXG4gICAgICAgICAgICAgICAgaWYgKCgkcm93cy5sZW5ndGggLSAxKSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRhYmxlQm9keVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVtcHR5KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGVtcHR5Um93VGVtcGxhdGUuY2xvbmUoKS5odG1sKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlIG1vZGFsLlxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKGVycm9yVGl0bGUsIGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGVzIEhUTUwgY29udGFpbmluZyB0aGUgc3RhdGljIHNlbyB1cmwgaW5mb3JtYXRpb24gZm9yIHRoZSBkZWxldGUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBTdGF0aWMgc2VvIHVybCBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IENyZWF0ZWQgSFRNTCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2VuZXJhdGVTdGF0aWNTZW9VcmxJbmZvTWFya3VwKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIExhYmVsIHBocmFzZXMuXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNTZW9VcmxOYW1lTGFiZWwgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTkFNRScsICdzdGF0aWNfc2VvX3VybHMnKTtcblxuICAgICAgICAgICAgLy8gUmV0dXJuIG1hcmt1cC5cbiAgICAgICAgICAgIHJldHVybiBgXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzcz1cImNvbC1tZC01XCI+JHtzdGF0aWNTZW9VcmxOYW1lTGFiZWx9PC9sYWJlbD5cblx0XHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wtbWQtN1wiPiR7ZGF0YS5uYW1lfTwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIC8vIExpc3RlbiB0byBmb3JtIHN1Ym1pdCBldmVudC5cbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsIGRlbGV0ZUJ1dHRvblNlbGVjdG9yLCBfb25EZWxldGVDbGljayk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG4iXX0=
