'use strict';

/* --------------------------------------------------------------
 content_manager_delete.js 2017-09-07
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Content Manager Overview Delete
 *
 * Controller Module to delete Content Manger Entries and product contents.
 *
 * Handles the delete operation of the Content Manager overview pages.
 */
gx.controllers.module('content_manager_delete', ['modal', gx.source + '/libs/info_box'], function (data) {

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
     * Content Manager delete confirmation modal.
     *
     * @type {jQuery}
     */
    var $modal = $('.delete-content.modal');

    /**
     * Content Manager elements container
     *
     * @type {jQuery}
     */
    var $elementContainer = $('.element-container');

    /**
     * Selectors for deleting different types of contents
     *
     * @type {{basic: string, page: string, element: string}}
     */
    var deleteSelectors = {
        basic: '.delete-content',
        page: '.delete-content.page',
        element: '.delete-content.element'
    };

    /**
     * URLs for deleting different types of content
     *
     * @type {{page: string, element: string}}
     */
    var urls = {
        page: jse.core.config.get('appUrl') + '/admin/admin.php?do=ContentManagerPagesAjax/delete',
        element: jse.core.config.get('appUrl') + '/admin/admin.php?do=ContentManagerElementsAjax/delete'

        /**
         * Module Instance
         *
         * @type {Object}
         */
    };var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Handles the delete click event by opening the delete confirmation modal.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {String} url URL for AjaxRequest.
     */
    function _onDeleteClick(event, url) {
        // Prevent default action.
        event.preventDefault();

        // Clicked content entry
        var $content_entry = $(event.target).closest('.content-action-icons').siblings('.content-name');

        // Id of the content that should be deleted
        var content_id = $(event.target).parents(deleteSelectors.basic).data('contentId');

        // Group Id of the content that should be deleted
        var group_id = $(event.target).parents(deleteSelectors.basic).data('groupId');

        // Delete confirmation modal button.
        var $confirmButton = $modal.find('button.confirm');

        // Empty modal body.
        $modal.find('.modal-body .form-group').remove();

        // Slider data.
        var contentData = {
            id: content_id,
            groupId: group_id,
            name: $content_entry.text()
        };

        // Put new slider information into modal body.
        $modal.find('.modal-body fieldset').html(_generateContentInfoMarkup(contentData));

        // Show modal.
        $modal.modal('show');

        // Handle delete confirmation modal button click event.
        $confirmButton.off('click').on('click', function () {
            return _onConfirmButtonClick(contentData.id, contentData.groupId, url);
        });
    }

    /**
     * Handles the delete confirmation button click event by removing the content through an AJAX request.
     *
     * @param {Number} contentId Content ID.
     * @param {Number} groupId Group ID.
     * @param {String} url URL for AjaxRequest.
     */
    function _onConfirmButtonClick(contentId, groupId, url) {
        // AJAX request options.
        var requestOptions = {
            type: 'POST',
            data: { id: groupId },
            url: url
        };

        // Perform request.
        $.ajax(requestOptions).done(function (response) {
            return _handleDeleteRequestResponse(response, contentId);
        }).always(function () {
            return $modal.modal('hide');
        });
    }

    /**
     * Handles content deletion AJAX action server response.
     *
     * @param {Object} response Server response.
     * @param {Number} contentId ID of deleted content.
     */
    function _handleDeleteRequestResponse(response, contentId) {
        // Error message phrases.
        var errorTitle = jse.core.lang.translate('DELETE_CONTENT_ERROR_TITLE', 'content_manager');
        var errorMessage = jse.core.lang.translate('DELETE_CONTENT_ERROR_TEXT', 'content_manager');

        // Element that triggers the delete action
        var $delete_trigger = $elementContainer.find('.delete-content' + ('[data-content-id="' + contentId + '"]'));

        // List element that should be removed
        var $element_to_delete = $delete_trigger.closest('li.content-manager-element');

        // List of all siblings of the removed element
        var $list_elements = $delete_trigger.closest('li.content-manager-element').siblings();

        // Element that contains all content list items
        var $list = $element_to_delete.closest('ul.content-manager-elements-list');

        // 'No results' message list element template.
        var $emptyListTemplate = $('#empty-list');

        // Check for action success.
        if (response.includes('success')) {
            // Delete respective table rows.
            $element_to_delete.remove();

            // Add success message to admin info box.
            jse.libs.info_box.addSuccessMessage();

            // If there are no rows, show 'No results' message row.
            if ($list_elements.length < 1) {
                $list.empty().append($emptyListTemplate.clone().html());
            }
        } else {
            // Show error message modal.
            jse.libs.modal.showMessage(errorTitle, errorMessage);
        }
    }

    /**
     * Generates HTML containing the content entry information for the delete confirmation modal.
     *
     * @param {Object} data Content Manager data.
     * @param {String} data.name Name of the Content Manager entry.
     * @param {Number} data.groupId Id of the Content Manager entry.
     *
     * @return {String} Created HTML string.
     */
    function _generateContentInfoMarkup(data) {
        // Label phrases.
        var contentNameLabel = jse.core.lang.translate('TEXT_TITLE', 'content_manager');
        var groupIdLabel = jse.core.lang.translate('TEXT_GROUP', 'content_manager');

        // Return markup.
        return '\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<label class="col-md-5">' + contentNameLabel + '</label>\n\t\t\t\t\t\t<div class="col-md-7">' + data.name + '</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class="form-group">\n\t\t\t\t\t\t<label class="col-md-5">' + groupIdLabel + '</label>\n\t\t\t\t\t\t<div class="col-md-7">' + data.groupId + '</div>\n\t\t\t\t\t</div>\n\t\t\t';
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to click event on delete icon
        $this.on('click', deleteSelectors.page, function (event) {
            _onDeleteClick(event, urls.page);
        });

        $this.on('click', deleteSelectors.element, function (event) {
            _onDeleteClick(event, urls.element);
        });

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9vdmVydmlldy9jb250ZW50X21hbmFnZXJfZGVsZXRlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJG1vZGFsIiwiJGVsZW1lbnRDb250YWluZXIiLCJkZWxldGVTZWxlY3RvcnMiLCJiYXNpYyIsInBhZ2UiLCJlbGVtZW50IiwidXJscyIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJfb25EZWxldGVDbGljayIsImV2ZW50IiwidXJsIiwicHJldmVudERlZmF1bHQiLCIkY29udGVudF9lbnRyeSIsInRhcmdldCIsImNsb3Nlc3QiLCJzaWJsaW5ncyIsImNvbnRlbnRfaWQiLCJwYXJlbnRzIiwiZ3JvdXBfaWQiLCIkY29uZmlybUJ1dHRvbiIsImZpbmQiLCJyZW1vdmUiLCJjb250ZW50RGF0YSIsImlkIiwiZ3JvdXBJZCIsIm5hbWUiLCJ0ZXh0IiwiaHRtbCIsIl9nZW5lcmF0ZUNvbnRlbnRJbmZvTWFya3VwIiwibW9kYWwiLCJvZmYiLCJvbiIsIl9vbkNvbmZpcm1CdXR0b25DbGljayIsImNvbnRlbnRJZCIsInJlcXVlc3RPcHRpb25zIiwidHlwZSIsImFqYXgiLCJkb25lIiwiX2hhbmRsZURlbGV0ZVJlcXVlc3RSZXNwb25zZSIsInJlc3BvbnNlIiwiYWx3YXlzIiwiZXJyb3JUaXRsZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJlcnJvck1lc3NhZ2UiLCIkZGVsZXRlX3RyaWdnZXIiLCIkZWxlbWVudF90b19kZWxldGUiLCIkbGlzdF9lbGVtZW50cyIsIiRsaXN0IiwiJGVtcHR5TGlzdFRlbXBsYXRlIiwiaW5jbHVkZXMiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsImxlbmd0aCIsImVtcHR5IiwiYXBwZW5kIiwiY2xvbmUiLCJzaG93TWVzc2FnZSIsImNvbnRlbnROYW1lTGFiZWwiLCJncm91cElkTGFiZWwiLCJp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QUVEOzs7Ozs7Ozs7QUFTQSxhQUFTaEIsMEJBQVQsQ0FBb0NsQyxJQUFwQyxFQUEwQztBQUN0QztBQUNBLFlBQU1pRSxtQkFBbUJ2RCxJQUFJQyxJQUFKLENBQVNxQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsWUFBeEIsRUFBc0MsaUJBQXRDLENBQXpCO0FBQ0EsWUFBTWlCLGVBQWV4RCxJQUFJQyxJQUFKLENBQVNxQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsWUFBeEIsRUFBc0MsaUJBQXRDLENBQXJCOztBQUVBO0FBQ0EsOEZBRW9CZ0IsZ0JBRnBCLG9EQUdrQmpFLEtBQUsrQixJQUh2Qiw0R0FPb0JtQyxZQVBwQixvREFRa0JsRSxLQUFLOEIsT0FSdkI7QUFXSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFoQyxXQUFPcUUsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCO0FBQ0FsRSxjQUFNb0MsRUFBTixDQUFTLE9BQVQsRUFBa0JoQyxnQkFBZ0JFLElBQWxDLEVBQXdDLFVBQVVRLEtBQVYsRUFBaUI7QUFDckRELDJCQUFlQyxLQUFmLEVBQXNCTixLQUFLRixJQUEzQjtBQUNILFNBRkQ7O0FBSUFOLGNBQU1vQyxFQUFOLENBQVMsT0FBVCxFQUFrQmhDLGdCQUFnQkcsT0FBbEMsRUFBMkMsVUFBVU8sS0FBVixFQUFpQjtBQUN4REQsMkJBQWVDLEtBQWYsRUFBc0JOLEtBQUtELE9BQTNCO0FBQ0gsU0FGRDs7QUFJQTtBQUNBbUM7QUFDSCxLQVpEOztBQWNBLFdBQU83QyxNQUFQO0FBQ0gsQ0FyT0wiLCJmaWxlIjoiY29udGVudF9tYW5hZ2VyL292ZXJ2aWV3L2NvbnRlbnRfbWFuYWdlcl9kZWxldGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNvbnRlbnRfbWFuYWdlcl9kZWxldGUuanMgMjAxNy0wOS0wN1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogQ29udGVudCBNYW5hZ2VyIE92ZXJ2aWV3IERlbGV0ZVxuICpcbiAqIENvbnRyb2xsZXIgTW9kdWxlIHRvIGRlbGV0ZSBDb250ZW50IE1hbmdlciBFbnRyaWVzIGFuZCBwcm9kdWN0IGNvbnRlbnRzLlxuICpcbiAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBvcGVyYXRpb24gb2YgdGhlIENvbnRlbnQgTWFuYWdlciBvdmVydmlldyBwYWdlcy5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdjb250ZW50X21hbmFnZXJfZGVsZXRlJyxcblxuICAgIFtcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL2luZm9fYm94YFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnRlbnQgTWFuYWdlciBkZWxldGUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJG1vZGFsID0gJCgnLmRlbGV0ZS1jb250ZW50Lm1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnRlbnQgTWFuYWdlciBlbGVtZW50cyBjb250YWluZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRlbGVtZW50Q29udGFpbmVyID0gJCgnLmVsZW1lbnQtY29udGFpbmVyJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbGVjdG9ycyBmb3IgZGVsZXRpbmcgZGlmZmVyZW50IHR5cGVzIG9mIGNvbnRlbnRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7YmFzaWM6IHN0cmluZywgcGFnZTogc3RyaW5nLCBlbGVtZW50OiBzdHJpbmd9fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVsZXRlU2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgYmFzaWM6ICcuZGVsZXRlLWNvbnRlbnQnLFxuICAgICAgICAgICAgcGFnZTogJy5kZWxldGUtY29udGVudC5wYWdlJyxcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcuZGVsZXRlLWNvbnRlbnQuZWxlbWVudCcsXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVSTHMgZm9yIGRlbGV0aW5nIGRpZmZlcmVudCB0eXBlcyBvZiBjb250ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7cGFnZTogc3RyaW5nLCBlbGVtZW50OiBzdHJpbmd9fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdXJscyA9IHtcbiAgICAgICAgICAgIHBhZ2U6IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9hZG1pbi5waHA/ZG89Q29udGVudE1hbmFnZXJQYWdlc0FqYXgvZGVsZXRlYCxcbiAgICAgICAgICAgIGVsZW1lbnQ6IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9hZG1pbi5waHA/ZG89Q29udGVudE1hbmFnZXJFbGVtZW50c0FqYXgvZGVsZXRlYCxcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBkZWxldGUgY2xpY2sgZXZlbnQgYnkgb3BlbmluZyB0aGUgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXJlZCBldmVudC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkwgZm9yIEFqYXhSZXF1ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRGVsZXRlQ2xpY2soZXZlbnQsIHVybCkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbi5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIENsaWNrZWQgY29udGVudCBlbnRyeVxuICAgICAgICAgICAgY29uc3QgJGNvbnRlbnRfZW50cnkgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLmNvbnRlbnQtYWN0aW9uLWljb25zJykuc2libGluZ3MoJy5jb250ZW50LW5hbWUnKTtcblxuICAgICAgICAgICAgLy8gSWQgb2YgdGhlIGNvbnRlbnQgdGhhdCBzaG91bGQgYmUgZGVsZXRlZFxuICAgICAgICAgICAgY29uc3QgY29udGVudF9pZCA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKGRlbGV0ZVNlbGVjdG9ycy5iYXNpYykuZGF0YSgnY29udGVudElkJyk7XG5cbiAgICAgICAgICAgIC8vIEdyb3VwIElkIG9mIHRoZSBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGRlbGV0ZWRcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwX2lkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoZGVsZXRlU2VsZWN0b3JzLmJhc2ljKS5kYXRhKCdncm91cElkJyk7XG5cbiAgICAgICAgICAgIC8vIERlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwgYnV0dG9uLlxuICAgICAgICAgICAgY29uc3QgJGNvbmZpcm1CdXR0b24gPSAkbW9kYWwuZmluZCgnYnV0dG9uLmNvbmZpcm0nKTtcblxuICAgICAgICAgICAgLy8gRW1wdHkgbW9kYWwgYm9keS5cbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcubW9kYWwtYm9keSAuZm9ybS1ncm91cCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBTbGlkZXIgZGF0YS5cbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnREYXRhID0ge1xuICAgICAgICAgICAgICAgIGlkOiBjb250ZW50X2lkLFxuICAgICAgICAgICAgICAgIGdyb3VwSWQ6IGdyb3VwX2lkLFxuICAgICAgICAgICAgICAgIG5hbWU6ICRjb250ZW50X2VudHJ5LnRleHQoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUHV0IG5ldyBzbGlkZXIgaW5mb3JtYXRpb24gaW50byBtb2RhbCBib2R5LlxuICAgICAgICAgICAgJG1vZGFsXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5tb2RhbC1ib2R5IGZpZWxkc2V0JylcbiAgICAgICAgICAgICAgICAuaHRtbChfZ2VuZXJhdGVDb250ZW50SW5mb01hcmt1cChjb250ZW50RGF0YSkpO1xuXG4gICAgICAgICAgICAvLyBTaG93IG1vZGFsLlxuICAgICAgICAgICAgJG1vZGFsLm1vZGFsKCdzaG93Jyk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBkZWxldGUgY29uZmlybWF0aW9uIG1vZGFsIGJ1dHRvbiBjbGljayBldmVudC5cbiAgICAgICAgICAgICRjb25maXJtQnV0dG9uXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAoKSA9PiBfb25Db25maXJtQnV0dG9uQ2xpY2soY29udGVudERhdGEuaWQsIGNvbnRlbnREYXRhLmdyb3VwSWQsIHVybCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gYnV0dG9uIGNsaWNrIGV2ZW50IGJ5IHJlbW92aW5nIHRoZSBjb250ZW50IHRocm91Z2ggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gY29udGVudElkIENvbnRlbnQgSUQuXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBncm91cElkIEdyb3VwIElELlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSTCBmb3IgQWpheFJlcXVlc3QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Db25maXJtQnV0dG9uQ2xpY2soY29udGVudElkLCBncm91cElkLCB1cmwpIHtcbiAgICAgICAgICAgIC8vIEFKQVggcmVxdWVzdCBvcHRpb25zLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtpZDogZ3JvdXBJZH0sXG4gICAgICAgICAgICAgICAgdXJsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBQZXJmb3JtIHJlcXVlc3QuXG4gICAgICAgICAgICAkLmFqYXgocmVxdWVzdE9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4gX2hhbmRsZURlbGV0ZVJlcXVlc3RSZXNwb25zZShyZXNwb25zZSwgY29udGVudElkKSlcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+ICRtb2RhbC5tb2RhbCgnaGlkZScpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIGNvbnRlbnQgZGVsZXRpb24gQUpBWCBhY3Rpb24gc2VydmVyIHJlc3BvbnNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgU2VydmVyIHJlc3BvbnNlLlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gY29udGVudElkIElEIG9mIGRlbGV0ZWQgY29udGVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9oYW5kbGVEZWxldGVSZXF1ZXN0UmVzcG9uc2UocmVzcG9uc2UsIGNvbnRlbnRJZCkge1xuICAgICAgICAgICAgLy8gRXJyb3IgbWVzc2FnZSBwaHJhc2VzLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JUaXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdERUxFVEVfQ09OVEVOVF9FUlJPUl9USVRMRScsICdjb250ZW50X21hbmFnZXInKTtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdERUxFVEVfQ09OVEVOVF9FUlJPUl9URVhUJywgJ2NvbnRlbnRfbWFuYWdlcicpO1xuXG4gICAgICAgICAgICAvLyBFbGVtZW50IHRoYXQgdHJpZ2dlcnMgdGhlIGRlbGV0ZSBhY3Rpb25cbiAgICAgICAgICAgIGNvbnN0ICRkZWxldGVfdHJpZ2dlciA9ICRlbGVtZW50Q29udGFpbmVyLmZpbmQoJy5kZWxldGUtY29udGVudCcgKyBgW2RhdGEtY29udGVudC1pZD1cIiR7Y29udGVudElkfVwiXWApO1xuXG4gICAgICAgICAgICAvLyBMaXN0IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnRfdG9fZGVsZXRlID0gJGRlbGV0ZV90cmlnZ2VyLmNsb3Nlc3QoJ2xpLmNvbnRlbnQtbWFuYWdlci1lbGVtZW50Jyk7XG5cbiAgICAgICAgICAgIC8vIExpc3Qgb2YgYWxsIHNpYmxpbmdzIG9mIHRoZSByZW1vdmVkIGVsZW1lbnRcbiAgICAgICAgICAgIGNvbnN0ICRsaXN0X2VsZW1lbnRzID0gJGRlbGV0ZV90cmlnZ2VyLmNsb3Nlc3QoJ2xpLmNvbnRlbnQtbWFuYWdlci1lbGVtZW50Jykuc2libGluZ3MoKTtcblxuICAgICAgICAgICAgLy8gRWxlbWVudCB0aGF0IGNvbnRhaW5zIGFsbCBjb250ZW50IGxpc3QgaXRlbXNcbiAgICAgICAgICAgIGNvbnN0ICRsaXN0ID0gJGVsZW1lbnRfdG9fZGVsZXRlLmNsb3Nlc3QoJ3VsLmNvbnRlbnQtbWFuYWdlci1lbGVtZW50cy1saXN0JylcblxuICAgICAgICAgICAgLy8gJ05vIHJlc3VsdHMnIG1lc3NhZ2UgbGlzdCBlbGVtZW50IHRlbXBsYXRlLlxuICAgICAgICAgICAgY29uc3QgJGVtcHR5TGlzdFRlbXBsYXRlID0gJCgnI2VtcHR5LWxpc3QnKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGFjdGlvbiBzdWNjZXNzLlxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmluY2x1ZGVzKCdzdWNjZXNzJykpIHtcbiAgICAgICAgICAgICAgICAvLyBEZWxldGUgcmVzcGVjdGl2ZSB0YWJsZSByb3dzLlxuICAgICAgICAgICAgICAgICRlbGVtZW50X3RvX2RlbGV0ZS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBzdWNjZXNzIG1lc3NhZ2UgdG8gYWRtaW4gaW5mbyBib3guXG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoKTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBubyByb3dzLCBzaG93ICdObyByZXN1bHRzJyBtZXNzYWdlIHJvdy5cbiAgICAgICAgICAgICAgICBpZiAoKCRsaXN0X2VsZW1lbnRzLmxlbmd0aCkgPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkZW1wdHlMaXN0VGVtcGxhdGUuY2xvbmUoKS5odG1sKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU2hvdyBlcnJvciBtZXNzYWdlIG1vZGFsLlxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKGVycm9yVGl0bGUsIGVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2VuZXJhdGVzIEhUTUwgY29udGFpbmluZyB0aGUgY29udGVudCBlbnRyeSBpbmZvcm1hdGlvbiBmb3IgdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIENvbnRlbnQgTWFuYWdlciBkYXRhLlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YS5uYW1lIE5hbWUgb2YgdGhlIENvbnRlbnQgTWFuYWdlciBlbnRyeS5cbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGRhdGEuZ3JvdXBJZCBJZCBvZiB0aGUgQ29udGVudCBNYW5hZ2VyIGVudHJ5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IENyZWF0ZWQgSFRNTCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2VuZXJhdGVDb250ZW50SW5mb01hcmt1cChkYXRhKSB7XG4gICAgICAgICAgICAvLyBMYWJlbCBwaHJhc2VzLlxuICAgICAgICAgICAgY29uc3QgY29udGVudE5hbWVMYWJlbCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX1RJVExFJywgJ2NvbnRlbnRfbWFuYWdlcicpO1xuICAgICAgICAgICAgY29uc3QgZ3JvdXBJZExhYmVsID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfR1JPVVAnLCAnY29udGVudF9tYW5hZ2VyJyk7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiBtYXJrdXAuXG4gICAgICAgICAgICByZXR1cm4gYFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3M9XCJjb2wtbWQtNVwiPiR7Y29udGVudE5hbWVMYWJlbH08L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbC1tZC03XCI+JHtkYXRhLm5hbWV9PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxuXHRcdFx0XHRcdFx0PGxhYmVsIGNsYXNzPVwiY29sLW1kLTVcIj4ke2dyb3VwSWRMYWJlbH08L2xhYmVsPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbC1tZC03XCI+JHtkYXRhLmdyb3VwSWR9PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgLy8gTGlzdGVuIHRvIGNsaWNrIGV2ZW50IG9uIGRlbGV0ZSBpY29uXG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBkZWxldGVTZWxlY3RvcnMucGFnZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgX29uRGVsZXRlQ2xpY2soZXZlbnQsIHVybHMucGFnZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgZGVsZXRlU2VsZWN0b3JzLmVsZW1lbnQsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIF9vbkRlbGV0ZUNsaWNrKGV2ZW50LCB1cmxzLmVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7Il19
