'use strict';

/* --------------------------------------------------------------
 product_content.js 2017-09-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('overview', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', 'datatable'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
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
        filterColumnIndex: 0,
        filterRegexPrefix: '^',
        expert: ''
    },


    /**
     * Final Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * URLs for deleting different types of content
     *
     * @type {{page: string, element: string, file: string, link: string}}
     */
    urls = {
        page: jse.core.config.get('appUrl') + '/admin/admin.php?do=ContentManagerAjax/Delete',
        element: jse.core.config.get('appUrl') + '/admin/admin.php?do=ContentManagerAjax/Delete',
        file: jse.core.config.get('appUrl') + '/admin/admin.php?do=ContentManagerProductContentsAjax/deleteFile',
        link: jse.core.config.get('appUrl') + '/admin/admin.php?do=ContentManagerProductContentsAjax/deleteLink'
    },


    /**
     * Content Manager delete confirmation modal.
     *
     * @type {jQuery}
     */
    $modal = $('.delete-content.modal'),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    function _createTopBar($table) {

        $table.parent().prepend('\n\t\t\t\t<div class="row headline">\n\t\t\t\t\t<div class="col-md-6 quick-search">\n\t\t\t\t\t\t<form class="form-inline form-group remove-padding">\n\t\t\t\t\t\t\t<label for="search-keyword">' + jse.core.lang.translate('search', 'admin_labels') + '</label>\n\t\t\t\t\t\t\t<input type="text" class="search-keyword" />\n\t\t\t\t\t\t</form>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="col-md-6">\n\n\t\t\t\t\t\t<div data-gx-widget="button_dropdown"\n\t\t\t\t\t\t     data-button_dropdown-user_id="{$smarty.session.customer_id}"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<div data-use-button_dropdown="true"\n\t\t\t\t\t\t\t     data-custom_caret_btn_class="btn-success"\n\t\t\t\t\t\t\t     class="pull-right"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<button data-gx-extension="link" data-link-url="admin.php?do=ContentManagerProductContents/new&type=file' + options.expert + '" class="btn btn-success">\n\t\t\t\t\t\t\t\t\t<i class="fa fa-plus btn-icon"></i>\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('BUTTON_NEW_PREFIX', 'admin_buttons') + '\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('LABEL_PRODUCT_CONTENT_FILE', 'content_manager') + '\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t\t\t<li><span data-gx-extension="link" data-link-url="admin.php?do=ContentManagerProductContents/new&type=link' + options.expert + '">\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('BUTTON_NEW_PREFIX_2', 'admin_buttons') + '\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('LABEL_PRODUCT_CONTENT_LINK', 'content_manager') + '</span></li>\n\t\t\t\t\t\t\t\t\t<li><span data-gx-extension="link" data-link-url="admin.php?do=ContentManagerProductContents/new&type=text' + options.expert + '">\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('BUTTON_NEW_PREFIX_2', 'admin_buttons') + '\n\t\t\t\t\t\t\t\t\t' + jse.core.lang.translate('LABEL_PRODUCT_CONTENT_TEXT', 'content_manager') + '</span></li>\n\t\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t');

        gx.widgets.init($table.parent());
        gx.extensions.init($table.parent());
    }

    function _createBottomBar($table) {
        var $paginator = $('<div class="paginator" />');
        var $datatableComponents = $('<div class="row datatable-components" />');

        var $pageLength = $('<select class="page-length" />');
        $pageLength.append(new Option('20 ' + jse.core.lang.translate('PER_PAGE', 'admin_general'), 20, true, true)).append(new Option('30 ' + jse.core.lang.translate('PER_PAGE', 'admin_general')), 30).append(new Option('50 ' + jse.core.lang.translate('PER_PAGE', 'admin_general')), 50).append(new Option('100 ' + jse.core.lang.translate('PER_PAGE', 'admin_general')), 100).css('float', 'left').appendTo($datatableComponents);

        $table.siblings('.dataTables_info').appendTo($datatableComponents).css('clear', 'none');

        $table.siblings('.dataTables_paginate').appendTo($datatableComponents).css('clear', 'none');

        $paginator.append($datatableComponents);

        $table.parent().append($paginator);
    }

    function _onQuickSearchSubmit(event) {
        event.preventDefault();

        var $table = $(this).parent().siblings('.data-table');
        var keyword = $(this).find('.search-keyword').val();

        $table.DataTable().search(keyword, true, false).draw();
    }

    function _onPageLengthChange() {
        var $table = $(this).parents('.paginator').siblings('.data-table');
        $table.DataTable().page.len($(this).val()).draw();
    }

    /**
     * Handles the delete click event by opening the delete confirmation modal.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {String} url URL for AjaxRequest.
     * @param {Object} $table DataTable object
     */
    function _onDeleteClicked(event, url, $table) {
        // Prevent default action.
        event.preventDefault();

        // Clicked content entry
        var $content_entry = $(event.target).closest('.content-action-icons').siblings('.content-name');

        // Id of the content that should be deleted
        var content_id = $(event.target).parents('.delete-content').data('contentId');

        // Group Id of the content that should be deleted
        var group_id = $(event.target).parents('.delete-content').data('groupId');

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
            return _onConfirmButtonClick(contentData.groupId, url, $table);
        });
    }

    /**
     * Handles the delete confirmation button click event by removing the content through an AJAX request.
     *
     * @param {Number} groupId Group ID.
     * @param {String} url URL for AjaxRequest.
     * @param {Object} $table DataTable object
     */
    function _onConfirmButtonClick(groupId, url, $table) {
        // AJAX request options.
        var requestOptions = {
            type: 'POST',
            data: { id: groupId },
            url: url
        };

        // Perform request.
        $.ajax(requestOptions).done(function (response) {
            return _handleDeleteRequestResponse(response, $table, groupId);
        }).always(function () {
            return $modal.modal('hide');
        });
    }

    /**
     * Handles content deletion AJAX action server response.
     *
     * @param {Object} response Server response.
     * @param {Object} $table DataTable object
     * @param {Number} groupId ID of deleted content.
     */
    function _handleDeleteRequestResponse(response, $table, groupId) {
        // Error message phrases.
        var errorTitle = jse.core.lang.translate('DELETE_CONTENT_ERROR_TITLE', 'content_manager');
        var errorMessage = jse.core.lang.translate('DELETE_CONTENT_ERROR_TEXT', 'content_manager');

        // Element that triggers the delete action
        var $delete_trigger = $('.delete-content' + ('[data-group-id="' + groupId + '"]'));

        // List element that should be removed
        var $element_to_delete = $delete_trigger.closest('.content-manager-element');

        // Check for action success.
        if (response.includes('success')) {
            // Delete respective table rows.

            $table.row($element_to_delete).remove().draw();

            // Add success message to admin info box.
            jse.libs.info_box.addSuccessMessage();
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

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        var $tables = $this.find('.data-table');

        $tables.on('init.dt', function (event, settings, json) {
            var $table = $(this);
            _createTopBar($table);
            _createBottomBar($table);
        });

        var $table = jse.libs.datatable.create($tables, {
            autoWidth: false,
            dom: 'rtip',
            pageLength: 20,
            language: jse.libs.datatable.getTranslations(jse.core.config.get('languageCode')),
            createdRow: function createdRow(row, data, dataIndex) {
                $(row).find('td').each(function () {
                    $(this).html($(this).html().trim().replace(/(\r\n|\n|\r)/gm, ''));
                });
            }
        });

        $this.on('submit', '.quick-search', _onQuickSearchSubmit).on('change', '.page-length', _onPageLengthChange).on('click', '.delete-content.file', function (event) {
            _onDeleteClicked(event, urls.file, $table);
        }).on('click', '.delete-content.link', function (event) {
            _onDeleteClicked(event, urls.link, $table);
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9wcm9kdWN0X2NvbnRlbnQvb3ZlcnZpZXcuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsImZpbHRlckNvbHVtbkluZGV4IiwiZmlsdGVyUmVnZXhQcmVmaXgiLCJleHBlcnQiLCJvcHRpb25zIiwiZXh0ZW5kIiwidXJscyIsInBhZ2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiZWxlbWVudCIsImZpbGUiLCJsaW5rIiwiJG1vZGFsIiwiX2NyZWF0ZVRvcEJhciIsIiR0YWJsZSIsInBhcmVudCIsInByZXBlbmQiLCJsYW5nIiwidHJhbnNsYXRlIiwid2lkZ2V0cyIsImluaXQiLCJleHRlbnNpb25zIiwiX2NyZWF0ZUJvdHRvbUJhciIsIiRwYWdpbmF0b3IiLCIkZGF0YXRhYmxlQ29tcG9uZW50cyIsIiRwYWdlTGVuZ3RoIiwiYXBwZW5kIiwiT3B0aW9uIiwiY3NzIiwiYXBwZW5kVG8iLCJzaWJsaW5ncyIsIl9vblF1aWNrU2VhcmNoU3VibWl0IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImtleXdvcmQiLCJmaW5kIiwidmFsIiwiRGF0YVRhYmxlIiwic2VhcmNoIiwiZHJhdyIsIl9vblBhZ2VMZW5ndGhDaGFuZ2UiLCJwYXJlbnRzIiwibGVuIiwiX29uRGVsZXRlQ2xpY2tlZCIsInVybCIsIiRjb250ZW50X2VudHJ5IiwidGFyZ2V0IiwiY2xvc2VzdCIsImNvbnRlbnRfaWQiLCJncm91cF9pZCIsIiRjb25maXJtQnV0dG9uIiwicmVtb3ZlIiwiY29udGVudERhdGEiLCJpZCIsImdyb3VwSWQiLCJuYW1lIiwidGV4dCIsImh0bWwiLCJfZ2VuZXJhdGVDb250ZW50SW5mb01hcmt1cCIsIm1vZGFsIiwib2ZmIiwib24iLCJfb25Db25maXJtQnV0dG9uQ2xpY2siLCJyZXF1ZXN0T3B0aW9ucyIsInR5cGUiLCJhamF4IiwiZG9uZSIsIl9oYW5kbGVEZWxldGVSZXF1ZXN0UmVzcG9uc2UiLCJyZXNwb25zZSIsImFsd2F5cyIsImVycm9yVGl0bGUiLCJlcnJvck1lc3NhZ2UiLCIkZGVsZXRlX3RyaWdnZXIiLCIkZWxlbWVudF90b19kZWxldGUiLCJpbmNsdWRlcyIsInJvdyIsImxpYnMiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwic2hvd01lc3NhZ2UiLCJjb250ZW50TmFtZUxhYmVsIiwiZ3JvdXBJZExhYmVsIiwiJHRhYmxlcyIsInNldHRpbmdzIiwianNvbiIsImRhdGF0YWJsZSIsImNyZWF0ZSIsImF1dG9XaWR0aCIsImRvbSIsInBhZ2VMZW5ndGgiLCJsYW5ndWFnZSIsImdldFRyYW5zbGF0aW9ucyIsImNyZWF0ZWRSb3ciLCJkYXRhSW5kZXgiLCJlYWNoIiwidHJpbSIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksVUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgsbURBRU9ELElBQUlDLE1BRlgsa0RBR0ksV0FISixDQUhKLEVBU0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1BDLDJCQUFtQixDQURaO0FBRVBDLDJCQUFtQixHQUZaO0FBR1BDLGdCQUFRO0FBSEQsS0FiZjs7O0FBbUJJOzs7OztBQUtBQyxjQUFVTCxFQUFFTSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJMLFFBQW5CLEVBQTZCSCxJQUE3QixDQXhCZDs7O0FBMkJJOzs7OztBQUtBUyxXQUFPO0FBQ0hDLGNBQVNaLElBQUlhLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsQ0FBVCxrREFERztBQUVIQyxpQkFBWWhCLElBQUlhLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FB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SUFBZixHQUFzQkMsT0FBdEIsQ0FBOEIsZ0JBQTlCLEVBQWdELEVBQWhELENBQWI7QUFDSCxpQkFGRDtBQUdIO0FBVDZDLFNBQW5DLENBQWY7O0FBWUFwRyxjQUNLaUUsRUFETCxDQUNRLFFBRFIsRUFDa0IsZUFEbEIsRUFDbUM5QixvQkFEbkMsRUFFSzhCLEVBRkwsQ0FFUSxRQUZSLEVBRWtCLGNBRmxCLEVBRWtDckIsbUJBRmxDLEVBR0txQixFQUhMLENBR1EsT0FIUixFQUdpQixzQkFIakIsRUFHeUMsVUFBVTdCLEtBQVYsRUFBaUI7QUFDbERXLDZCQUFpQlgsS0FBakIsRUFBd0I1QixLQUFLTSxJQUE3QixFQUFtQ0ksTUFBbkM7QUFDSCxTQUxMLEVBTUsrQyxFQU5MLENBTVEsT0FOUixFQU1pQixzQkFOakIsRUFNeUMsVUFBVTdCLEtBQVYsRUFBaUI7QUFDbERXLDZCQUFpQlgsS0FBakIsRUFBd0I1QixLQUFLTyxJQUE3QixFQUFtQ0csTUFBbkM7QUFDSCxTQVJMOztBQVVBb0Q7QUFDSCxLQWhDRDs7QUFrQ0EsV0FBTzFFLE1BQVA7QUFDSCxDQXJVTCIsImZpbGUiOiJjb250ZW50X21hbmFnZXIvcHJvZHVjdF9jb250ZW50L292ZXJ2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBwcm9kdWN0X2NvbnRlbnQuanMgMjAxNy0wOS0yMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnb3ZlcnZpZXcnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2RhdGF0YWJsZXMvanF1ZXJ5LmRhdGFUYWJsZXMubWluLmpzYCxcbiAgICAgICAgJ2RhdGF0YWJsZSdcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgZmlsdGVyQ29sdW1uSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgZmlsdGVyUmVnZXhQcmVmaXg6ICdeJyxcbiAgICAgICAgICAgICAgICBleHBlcnQ6ICcnXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFVSTHMgZm9yIGRlbGV0aW5nIGRpZmZlcmVudCB0eXBlcyBvZiBjb250ZW50XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge3twYWdlOiBzdHJpbmcsIGVsZW1lbnQ6IHN0cmluZywgZmlsZTogc3RyaW5nLCBsaW5rOiBzdHJpbmd9fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB1cmxzID0ge1xuICAgICAgICAgICAgICAgIHBhZ2U6IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9hZG1pbi5waHA/ZG89Q29udGVudE1hbmFnZXJBamF4L0RlbGV0ZWAsXG4gICAgICAgICAgICAgICAgZWxlbWVudDogYCR7anNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJyl9L2FkbWluL2FkbWluLnBocD9kbz1Db250ZW50TWFuYWdlckFqYXgvRGVsZXRlYCxcbiAgICAgICAgICAgICAgICBmaWxlOiBgJHtqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKX0vYWRtaW4vYWRtaW4ucGhwP2RvPUNvbnRlbnRNYW5hZ2VyUHJvZHVjdENvbnRlbnRzQWpheC9kZWxldGVGaWxlYCxcbiAgICAgICAgICAgICAgICBsaW5rOiBgJHtqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKX0vYWRtaW4vYWRtaW4ucGhwP2RvPUNvbnRlbnRNYW5hZ2VyUHJvZHVjdENvbnRlbnRzQWpheC9kZWxldGVMaW5rYFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb250ZW50IE1hbmFnZXIgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkbW9kYWwgPSAkKCcuZGVsZXRlLWNvbnRlbnQubW9kYWwnKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlVG9wQmFyKCR0YWJsZSkge1xuXG5cbiAgICAgICAgICAgICR0YWJsZS5wYXJlbnQoKS5wcmVwZW5kKGBcblx0XHRcdFx0PGRpdiBjbGFzcz1cInJvdyBoZWFkbGluZVwiPlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wtbWQtNiBxdWljay1zZWFyY2hcIj5cblx0XHRcdFx0XHRcdDxmb3JtIGNsYXNzPVwiZm9ybS1pbmxpbmUgZm9ybS1ncm91cCByZW1vdmUtcGFkZGluZ1wiPlxuXHRcdFx0XHRcdFx0XHQ8bGFiZWwgZm9yPVwic2VhcmNoLWtleXdvcmRcIj5gICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3NlYXJjaCcsICdhZG1pbl9sYWJlbHMnKSArIGA8L2xhYmVsPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInNlYXJjaC1rZXl3b3JkXCIgLz5cblx0XHRcdFx0XHRcdDwvZm9ybT5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sLW1kLTZcIj5cblxuXHRcdFx0XHRcdFx0PGRpdiBkYXRhLWd4LXdpZGdldD1cImJ1dHRvbl9kcm9wZG93blwiXG5cdFx0XHRcdFx0XHQgICAgIGRhdGEtYnV0dG9uX2Ryb3Bkb3duLXVzZXJfaWQ9XCJ7JHNtYXJ0eS5zZXNzaW9uLmN1c3RvbWVyX2lkfVwiXG5cdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdDxkaXYgZGF0YS11c2UtYnV0dG9uX2Ryb3Bkb3duPVwidHJ1ZVwiXG5cdFx0XHRcdFx0XHRcdCAgICAgZGF0YS1jdXN0b21fY2FyZXRfYnRuX2NsYXNzPVwiYnRuLXN1Y2Nlc3NcIlxuXHRcdFx0XHRcdFx0XHQgICAgIGNsYXNzPVwicHVsbC1yaWdodFwiXG5cdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHQ8YnV0dG9uIGRhdGEtZ3gtZXh0ZW5zaW9uPVwibGlua1wiIGRhdGEtbGluay11cmw9XCJhZG1pbi5waHA/ZG89Q29udGVudE1hbmFnZXJQcm9kdWN0Q29udGVudHMvbmV3JnR5cGU9ZmlsZWAgKyBvcHRpb25zLmV4cGVydCArIGBcIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1wbHVzIGJ0bi1pY29uXCI+PC9pPlxuXHRcdFx0XHRcdFx0XHRcdFx0YCArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fTkVXX1BSRUZJWCcsICdhZG1pbl9idXR0b25zJykgKyBgXG5cdFx0XHRcdFx0XHRcdFx0XHRgICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0xBQkVMX1BST0RVQ1RfQ09OVEVOVF9GSUxFJywgJ2NvbnRlbnRfbWFuYWdlcicpICsgYFxuXHRcdFx0XHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdDx1bD5cblx0XHRcdFx0XHRcdFx0XHRcdDxsaT48c3BhbiBkYXRhLWd4LWV4dGVuc2lvbj1cImxpbmtcIiBkYXRhLWxpbmstdXJsPVwiYWRtaW4ucGhwP2RvPUNvbnRlbnRNYW5hZ2VyUHJvZHVjdENvbnRlbnRzL25ldyZ0eXBlPWxpbmtgICsgb3B0aW9ucy5leHBlcnQgKyBgXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRgICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9ORVdfUFJFRklYXzInLCAnYWRtaW5fYnV0dG9ucycpICsgYFxuXHRcdFx0XHRcdFx0XHRcdFx0YCArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdMQUJFTF9QUk9EVUNUX0NPTlRFTlRfTElOSycsICdjb250ZW50X21hbmFnZXInKSArIGA8L3NwYW4+PC9saT5cblx0XHRcdFx0XHRcdFx0XHRcdDxsaT48c3BhbiBkYXRhLWd4LWV4dGVuc2lvbj1cImxpbmtcIiBkYXRhLWxpbmstdXJsPVwiYWRtaW4ucGhwP2RvPUNvbnRlbnRNYW5hZ2VyUHJvZHVjdENvbnRlbnRzL25ldyZ0eXBlPXRleHRgICsgb3B0aW9ucy5leHBlcnQgKyBgXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRgICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9ORVdfUFJFRklYXzInLCAnYWRtaW5fYnV0dG9ucycpICsgYFxuXHRcdFx0XHRcdFx0XHRcdFx0YCArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdMQUJFTF9QUk9EVUNUX0NPTlRFTlRfVEVYVCcsICdjb250ZW50X21hbmFnZXInKSArIGA8L3NwYW4+PC9saT5cblx0XHRcdFx0XHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdGApO1xuXG4gICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJHRhYmxlLnBhcmVudCgpKTtcbiAgICAgICAgICAgIGd4LmV4dGVuc2lvbnMuaW5pdCgkdGFibGUucGFyZW50KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUJvdHRvbUJhcigkdGFibGUpIHtcbiAgICAgICAgICAgIGNvbnN0ICRwYWdpbmF0b3IgPSAkKCc8ZGl2IGNsYXNzPVwicGFnaW5hdG9yXCIgLz4nKTtcbiAgICAgICAgICAgIGNvbnN0ICRkYXRhdGFibGVDb21wb25lbnRzID0gJCgnPGRpdiBjbGFzcz1cInJvdyBkYXRhdGFibGUtY29tcG9uZW50c1wiIC8+Jyk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRwYWdlTGVuZ3RoID0gJCgnPHNlbGVjdCBjbGFzcz1cInBhZ2UtbGVuZ3RoXCIgLz4nKTtcbiAgICAgICAgICAgICRwYWdlTGVuZ3RoXG4gICAgICAgICAgICAgICAgLmFwcGVuZChuZXcgT3B0aW9uKCcyMCAnICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1BFUl9QQUdFJywgJ2FkbWluX2dlbmVyYWwnKSwgMjAsIHRydWUsIHRydWUpKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQobmV3IE9wdGlvbignMzAgJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdQRVJfUEFHRScsICdhZG1pbl9nZW5lcmFsJykpLCAzMClcbiAgICAgICAgICAgICAgICAuYXBwZW5kKG5ldyBPcHRpb24oJzUwICcgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnUEVSX1BBR0UnLCAnYWRtaW5fZ2VuZXJhbCcpKSwgNTApXG4gICAgICAgICAgICAgICAgLmFwcGVuZChuZXcgT3B0aW9uKCcxMDAgJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdQRVJfUEFHRScsICdhZG1pbl9nZW5lcmFsJykpLCAxMDApXG4gICAgICAgICAgICAgICAgLmNzcygnZmxvYXQnLCAnbGVmdCcpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCRkYXRhdGFibGVDb21wb25lbnRzKTtcblxuICAgICAgICAgICAgJHRhYmxlLnNpYmxpbmdzKCcuZGF0YVRhYmxlc19pbmZvJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJGRhdGF0YWJsZUNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgLmNzcygnY2xlYXInLCAnbm9uZScpO1xuXG4gICAgICAgICAgICAkdGFibGUuc2libGluZ3MoJy5kYXRhVGFibGVzX3BhZ2luYXRlJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJGRhdGF0YWJsZUNvbXBvbmVudHMpXG4gICAgICAgICAgICAgICAgLmNzcygnY2xlYXInLCAnbm9uZScpO1xuXG4gICAgICAgICAgICAkcGFnaW5hdG9yXG4gICAgICAgICAgICAgICAgLmFwcGVuZCgkZGF0YXRhYmxlQ29tcG9uZW50cyk7XG5cbiAgICAgICAgICAgICR0YWJsZS5wYXJlbnQoKS5hcHBlbmQoJHBhZ2luYXRvcik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfb25RdWlja1NlYXJjaFN1Ym1pdChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgJHRhYmxlID0gJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygnLmRhdGEtdGFibGUnKTtcbiAgICAgICAgICAgIGNvbnN0IGtleXdvcmQgPSAkKHRoaXMpLmZpbmQoJy5zZWFyY2gta2V5d29yZCcpLnZhbCgpO1xuXG4gICAgICAgICAgICAkdGFibGUuRGF0YVRhYmxlKCkuc2VhcmNoKGtleXdvcmQsIHRydWUsIGZhbHNlKS5kcmF3KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfb25QYWdlTGVuZ3RoQ2hhbmdlKCkge1xuICAgICAgICAgICAgY29uc3QgJHRhYmxlID0gJCh0aGlzKS5wYXJlbnRzKCcucGFnaW5hdG9yJykuc2libGluZ3MoJy5kYXRhLXRhYmxlJyk7XG4gICAgICAgICAgICAkdGFibGUuRGF0YVRhYmxlKCkucGFnZS5sZW4oJCh0aGlzKS52YWwoKSkuZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBjbGljayBldmVudCBieSBvcGVuaW5nIHRoZSBkZWxldGUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSTCBmb3IgQWpheFJlcXVlc3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAkdGFibGUgRGF0YVRhYmxlIG9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uRGVsZXRlQ2xpY2tlZChldmVudCwgdXJsLCAkdGFibGUpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBDbGlja2VkIGNvbnRlbnQgZW50cnlcbiAgICAgICAgICAgIGNvbnN0ICRjb250ZW50X2VudHJ5ID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5jb250ZW50LWFjdGlvbi1pY29ucycpLnNpYmxpbmdzKCcuY29udGVudC1uYW1lJyk7XG5cbiAgICAgICAgICAgIC8vIElkIG9mIHRoZSBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGRlbGV0ZWRcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRfaWQgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cygnLmRlbGV0ZS1jb250ZW50JykuZGF0YSgnY29udGVudElkJyk7XG5cbiAgICAgICAgICAgIC8vIEdyb3VwIElkIG9mIHRoZSBjb250ZW50IHRoYXQgc2hvdWxkIGJlIGRlbGV0ZWRcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwX2lkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMoJy5kZWxldGUtY29udGVudCcpLmRhdGEoJ2dyb3VwSWQnKTtcblxuICAgICAgICAgICAgLy8gRGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbCBidXR0b24uXG4gICAgICAgICAgICBjb25zdCAkY29uZmlybUJ1dHRvbiA9ICRtb2RhbC5maW5kKCdidXR0b24uY29uZmlybScpO1xuXG4gICAgICAgICAgICAvLyBFbXB0eSBtb2RhbCBib2R5LlxuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5tb2RhbC1ib2R5IC5mb3JtLWdyb3VwJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgIC8vIFNsaWRlciBkYXRhLlxuICAgICAgICAgICAgY29uc3QgY29udGVudERhdGEgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IGNvbnRlbnRfaWQsXG4gICAgICAgICAgICAgICAgZ3JvdXBJZDogZ3JvdXBfaWQsXG4gICAgICAgICAgICAgICAgbmFtZTogJGNvbnRlbnRfZW50cnkudGV4dCgpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBQdXQgbmV3IHNsaWRlciBpbmZvcm1hdGlvbiBpbnRvIG1vZGFsIGJvZHkuXG4gICAgICAgICAgICAkbW9kYWxcbiAgICAgICAgICAgICAgICAuZmluZCgnLm1vZGFsLWJvZHkgZmllbGRzZXQnKVxuICAgICAgICAgICAgICAgIC5odG1sKF9nZW5lcmF0ZUNvbnRlbnRJbmZvTWFya3VwKGNvbnRlbnREYXRhKSk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgbW9kYWwuXG4gICAgICAgICAgICAkbW9kYWwubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwgYnV0dG9uIGNsaWNrIGV2ZW50LlxuICAgICAgICAgICAgJGNvbmZpcm1CdXR0b25cbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICgpID0+IF9vbkNvbmZpcm1CdXR0b25DbGljayhjb250ZW50RGF0YS5ncm91cElkLCB1cmwsICR0YWJsZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gYnV0dG9uIGNsaWNrIGV2ZW50IGJ5IHJlbW92aW5nIHRoZSBjb250ZW50IHRocm91Z2ggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gZ3JvdXBJZCBHcm91cCBJRC5cbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkwgZm9yIEFqYXhSZXF1ZXN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gJHRhYmxlIERhdGFUYWJsZSBvYmplY3RcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkNvbmZpcm1CdXR0b25DbGljayhncm91cElkLCB1cmwsICR0YWJsZSkge1xuICAgICAgICAgICAgLy8gQUpBWCByZXF1ZXN0IG9wdGlvbnMuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgZGF0YToge2lkOiBncm91cElkfSxcbiAgICAgICAgICAgICAgICB1cmxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFBlcmZvcm0gcmVxdWVzdC5cbiAgICAgICAgICAgICQuYWpheChyZXF1ZXN0T3B0aW9ucylcbiAgICAgICAgICAgICAgICAuZG9uZShyZXNwb25zZSA9PiBfaGFuZGxlRGVsZXRlUmVxdWVzdFJlc3BvbnNlKHJlc3BvbnNlLCAkdGFibGUsIGdyb3VwSWQpKVxuICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4gJG1vZGFsLm1vZGFsKCdoaWRlJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgY29udGVudCBkZWxldGlvbiBBSkFYIGFjdGlvbiBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBTZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSAkdGFibGUgRGF0YVRhYmxlIG9iamVjdFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gZ3JvdXBJZCBJRCBvZiBkZWxldGVkIGNvbnRlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlRGVsZXRlUmVxdWVzdFJlc3BvbnNlKHJlc3BvbnNlLCAkdGFibGUsIGdyb3VwSWQpIHtcbiAgICAgICAgICAgIC8vIEVycm9yIG1lc3NhZ2UgcGhyYXNlcy5cbiAgICAgICAgICAgIGNvbnN0IGVycm9yVGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnREVMRVRFX0NPTlRFTlRfRVJST1JfVElUTEUnLCAnY29udGVudF9tYW5hZ2VyJyk7XG4gICAgICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnREVMRVRFX0NPTlRFTlRfRVJST1JfVEVYVCcsICdjb250ZW50X21hbmFnZXInKTtcblxuICAgICAgICAgICAgLy8gRWxlbWVudCB0aGF0IHRyaWdnZXJzIHRoZSBkZWxldGUgYWN0aW9uXG4gICAgICAgICAgICBjb25zdCAkZGVsZXRlX3RyaWdnZXIgPSAkKCcuZGVsZXRlLWNvbnRlbnQnICsgYFtkYXRhLWdyb3VwLWlkPVwiJHtncm91cElkfVwiXWApO1xuXG4gICAgICAgICAgICAvLyBMaXN0IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnRfdG9fZGVsZXRlID0gJGRlbGV0ZV90cmlnZ2VyLmNsb3Nlc3QoJy5jb250ZW50LW1hbmFnZXItZWxlbWVudCcpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgYWN0aW9uIHN1Y2Nlc3MuXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuaW5jbHVkZXMoJ3N1Y2Nlc3MnKSkge1xuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSByZXNwZWN0aXZlIHRhYmxlIHJvd3MuXG5cbiAgICAgICAgICAgICAgICAkdGFibGUucm93KCRlbGVtZW50X3RvX2RlbGV0ZSkucmVtb3ZlKCkuZHJhdygpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHN1Y2Nlc3MgbWVzc2FnZSB0byBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTaG93IGVycm9yIG1lc3NhZ2UgbW9kYWwuXG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoZXJyb3JUaXRsZSwgZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgSFRNTCBjb250YWluaW5nIHRoZSBjb250ZW50IGVudHJ5IGluZm9ybWF0aW9uIGZvciB0aGUgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQ29udGVudCBNYW5hZ2VyIGRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhLm5hbWUgTmFtZSBvZiB0aGUgQ29udGVudCBNYW5hZ2VyIGVudHJ5LlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gZGF0YS5ncm91cElkIElkIG9mIHRoZSBDb250ZW50IE1hbmFnZXIgZW50cnkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gQ3JlYXRlZCBIVE1MIHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZW5lcmF0ZUNvbnRlbnRJbmZvTWFya3VwKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIExhYmVsIHBocmFzZXMuXG4gICAgICAgICAgICBjb25zdCBjb250ZW50TmFtZUxhYmVsID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfVElUTEUnLCAnY29udGVudF9tYW5hZ2VyJyk7XG4gICAgICAgICAgICBjb25zdCBncm91cElkTGFiZWwgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9HUk9VUCcsICdjb250ZW50X21hbmFnZXInKTtcblxuICAgICAgICAgICAgLy8gUmV0dXJuIG1hcmt1cC5cbiAgICAgICAgICAgIHJldHVybiBgXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cblx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzcz1cImNvbC1tZC01XCI+JHtjb250ZW50TmFtZUxhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sLW1kLTdcIj4ke2RhdGEubmFtZX08L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XG5cdFx0XHRcdFx0XHQ8bGFiZWwgY2xhc3M9XCJjb2wtbWQtNVwiPiR7Z3JvdXBJZExhYmVsfTwvbGFiZWw+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29sLW1kLTdcIj4ke2RhdGEuZ3JvdXBJZH08L2Rpdj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdGA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgY29uc3QgJHRhYmxlcyA9ICR0aGlzLmZpbmQoJy5kYXRhLXRhYmxlJyk7XG5cbiAgICAgICAgICAgICR0YWJsZXMub24oJ2luaXQuZHQnLCBmdW5jdGlvbiAoZXZlbnQsIHNldHRpbmdzLCBqc29uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHRhYmxlID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBfY3JlYXRlVG9wQmFyKCR0YWJsZSk7XG4gICAgICAgICAgICAgICAgX2NyZWF0ZUJvdHRvbUJhcigkdGFibGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0ICR0YWJsZSA9IGpzZS5saWJzLmRhdGF0YWJsZS5jcmVhdGUoJHRhYmxlcywge1xuICAgICAgICAgICAgICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG9tOiAncnRpcCcsXG4gICAgICAgICAgICAgICAgcGFnZUxlbmd0aDogMjAsXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IGpzZS5saWJzLmRhdGF0YWJsZS5nZXRUcmFuc2xhdGlvbnMoanNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykpLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRSb3c6IGZ1bmN0aW9uIChyb3csIGRhdGEsIGRhdGFJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAkKHJvdykuZmluZCgndGQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuaHRtbCgkKHRoaXMpLmh0bWwoKS50cmltKCkucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSwgJycpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdzdWJtaXQnLCAnLnF1aWNrLXNlYXJjaCcsIF9vblF1aWNrU2VhcmNoU3VibWl0KVxuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgJy5wYWdlLWxlbmd0aCcsIF9vblBhZ2VMZW5ndGhDaGFuZ2UpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuZGVsZXRlLWNvbnRlbnQuZmlsZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBfb25EZWxldGVDbGlja2VkKGV2ZW50LCB1cmxzLmZpbGUsICR0YWJsZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5kZWxldGUtY29udGVudC5saW5rJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIF9vbkRlbGV0ZUNsaWNrZWQoZXZlbnQsIHVybHMubGluaywgJHRhYmxlKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
