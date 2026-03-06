'use strict';

/* --------------------------------------------------------------
 events.js 2018-04-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Main Table Events
 *
 * Handles the events of the main QuickEdit table.
 */
gx.controllers.module('events', ['loading_spinner', 'modal', gx.source + '/libs/button_dropdown', gx.source + '/libs/info_box'], function (data) {

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
    var module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Bulk selection change event handler.
     *
     * @param {jQuery.Event} event Contains event information.
     * @param {Boolean} [propagate = true] Whether to propagate the event or not.
     */
    function _onBulkSelectionChange(event) {
        var propagate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (propagate === false) {
            return;
        }

        $this.find('tbody input:checkbox.overview-row-selection').single_checkbox('checked', $(this).prop('checked')).trigger('change');
    }

    /**
     * Table row click event handler.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onTableRowClick(event) {
        if (!$(event.target).is('td')) {
            return;
        }

        var $singleCheckbox = $(this).find('input:checkbox.overview-row-selection');

        $singleCheckbox.prop('checked', !$(this).find('input:checkbox.overview-row-selection').prop('checked')).trigger('change');
    }

    /**
     * Enables row editing mode.
     */
    function _onTableRowEditClick() {
        var $tableRow = $(this).parents('tr');
        var $singleCheckbox = $(this).parents('tr').find('input:checkbox.overview-row-selection');

        var $dropdown = $tableRow.find('.btn-group.dropdown');
        var $saveAction = $dropdown.find('.save-row-edits');
        var $editAction = $tableRow.find('.row-edit');
        $editAction.addClass('hidden');
        $saveAction.removeClass('hidden');
        jse.libs.button_dropdown.setDefaultAction($dropdown, $saveAction);

        $tableRow.find('td.editable').each(function () {
            if ($(this).find('input:text').length > 0) {
                return;
            }

            if ($(this).hasClass('manufacturer')) {
                var rowIndex = $(this).parents('tr');
                var rowData = $this.DataTable().row(rowIndex).data();
                var options = rowData.DT_RowData.option.manufacturer;

                var html = '';

                options.forEach(function (option) {
                    html += '<option value="' + option.id + '" ' + (rowData.manufacturer == option.value ? 'selected' : '') + '>\n\t\t\t\t\t\t\t' + option.value + '\n\t\t\t\t\t\t</option>';
                });

                this.innerHTML = '<select class="form-control">' + html + '</select>';
            } else {
                this.innerHTML = '<input type="text" class="form-control" value="' + this.innerText.replace(/"/g, '&quot;') + '" />';
            }
        });

        $singleCheckbox.prop('checked', !$(this).find('input:checkbox.overview-row-selection').prop('checked')).trigger('change');
    }

    /**
     * Show product icon event handler.
     *
     * Navigates the browser to the product details page.
     */
    function _onTableRowShowClick() {
        var productId = $(this).parents('tr').data('id');

        var parameters = {
            pID: productId,
            action: 'new_product'
        };

        window.open(jse.core.config.get('appUrl') + '/admin/categories.php?' + $.param(parameters), '_blank');
    }

    /**
     * Bulk row edit event handler.
     *
     * Enables the edit mode for the selected rows.
     */
    function _onTableBulkRowEditClick() {
        var $bulkEditAction = $(this);
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.overview-row-selection');

        if ($checkedSingleCheckboxes.length) {
            var $bulkActionsDropdown = $('.overview-bulk-action');
            var $bulkSaveAction = $bulkActionsDropdown.find('.save-bulk-row-edits');
            $bulkEditAction.addClass('hidden');
            $bulkSaveAction.removeClass('hidden');
            jse.libs.button_dropdown.setDefaultAction($bulkActionsDropdown, $bulkSaveAction);
        }

        $checkedSingleCheckboxes.each(function () {
            var $tableRow = $(this).parents('tr');
            var $rowActionsDropdown = $tableRow.find('.btn-group.dropdown');
            var $saveAction = $rowActionsDropdown.find('.save-row-edits');
            var $editAction = $tableRow.find('.row-edit');

            $editAction.addClass('hidden');
            $saveAction.removeClass('hidden');
            jse.libs.button_dropdown.setDefaultAction($rowActionsDropdown, $saveAction);

            $tableRow.find('td.editable').each(function () {

                if ($(this).find('input:text').length > 0) {
                    return;
                }

                if ($(this).hasClass('manufacturer')) {
                    var rowIndex = $(this).parents('tr');
                    var rowData = $this.DataTable().row(rowIndex).data();
                    var options = rowData.DT_RowData.option.manufacturer;

                    var html = '';

                    options.forEach(function (option) {
                        html += '<option value="' + option.id + '" ' + (rowData.manufacturer == option.value ? 'selected' : '') + '>\n\t\t\t\t\t\t\t' + option.value + '\n\t\t\t\t\t\t</option>';
                    });

                    this.innerHTML = '<select class="form-control">' + html + '</select>';
                } else {
                    this.innerHTML = '<input type="text" class="form-control" value="' + this.innerText.replace(/"/g, '&quot;') + '" />';
                }
            });
        });
    }

    /**
     * Table row checkbox change event handler.
     */
    function _onTableRowCheckboxChange() {
        var $bulkActionDropdownButtons = $this.parents('.quick-edit.overview').find('.overview-bulk-action > button');
        var $tableRow = $(this).parents('tr');

        if ($this.find('input:checkbox:checked.overview-row-selection').length > 0) {
            $bulkActionDropdownButtons.removeClass('disabled');
        } else {
            $bulkActionDropdownButtons.addClass('disabled');

            var $bulkActionsDropdown = $('.overview-bulk-action');
            var $bulkSaveAction = $bulkActionsDropdown.find('.save-bulk-row-edits');

            if (!$bulkSaveAction.hasClass('hidden')) {
                var $bulkEditAction = $bulkActionsDropdown.find('.bulk-row-edit');
                $bulkEditAction.removeClass('hidden');
                $bulkSaveAction.addClass('hidden');
                jse.libs.button_dropdown.setDefaultAction($bulkActionsDropdown, $bulkEditAction);
            }
        }

        if (!$(this).prop('checked')) {
            _resolveRowChanges($(this).parents('tr'));

            var $rowActionsDropdown = $tableRow.find('.btn-group.dropdown');
            var $saveAction = $rowActionsDropdown.find('.save-row-edits');

            if (!$saveAction.hasClass('hidden')) {
                var $editAction = $tableRow.find('.row-edit');
                $editAction.removeClass('hidden');
                $saveAction.addClass('hidden');
                jse.libs.button_dropdown.setDefaultAction($rowActionsDropdown, $editAction.last());
            }
        }
    }

    /**
     * Page mode change between "edit" and "filtering".
     */
    function _onPageModeChange() {
        if ($(this).val() == 'edit-mode') {
            $this.find('tr.filter').attr('hidden', true);
            $this.find('tr.edit').attr('hidden', false);
            $this.find('thead tr:first-child th').addClass('edit-mode');
        } else {
            $this.find('tr.filter').attr('hidden', false);
            $this.find('tr.edit').attr('hidden', true);
            $this.find('thead tr:first-child th').removeClass('edit-mode');
        }
    }

    /**
     * Cancel data modifications event handler.
     */
    function _onCancelClick() {
        var $pageMode = $(this).closest('thead').find('.select-page-mode');
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.overview-row-selection');

        if ($pageMode.val() == 'edit-mode') {
            $pageMode.val('filter-mode');
        } else {
            $pageMode.val('edit-mode');
        }

        $checkedSingleCheckboxes.each(function () {
            $(this).prop('checked', !$(this).prop('checked')).trigger('change');

            _resolveRowChanges($(this).parents('tr'));
        });

        _onPageModeChange();
    }

    /**
     * Restores all the row data changes back to their original state.
     *
     * @param {jQuery.Event} $row Current row selector.
     */
    function _resolveRowChanges($row) {
        var rowIndex = $this.DataTable().row($row).index();

        $row.find('input:text, select').not('.select-tax, .select-shipping-time').each(function () {
            var $cell = $(this).closest('td');
            var columnIndex = $this.DataTable().column($cell).index();
            this.parentElement.innerHTML = $this.DataTable().cell(rowIndex, columnIndex).data();
        });
    }

    /**
     * Table row data change event handler.
     *
     * It's being triggered every time a row input/select field is changed.
     */
    function _onTableRowDataChange() {
        var $row = $(this).closest('tr');
        var rowIndex = $this.DataTable().row($row).index();

        $row.find('input:text, select').not('.select-tax, .select-shipping-time').each(function () {
            var $cell = $(this).closest('td');
            var columnIndex = $this.DataTable().column($cell).index();

            if ($.trim($(this).val()) != $this.DataTable().cell(rowIndex, columnIndex).data()) {
                $(this).addClass('modified');
                return;
            }

            $(this).removeClass('modified');
        });
    }

    /**
     * Table row switcher change event handler.
     *
     * @param {HTMLElement} switcher Current switcher element.
     */
    function _onTableRowSwitcherChange() {
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/Update';
        var productId = $(this).parents('tr').data('id');
        var $cell = $(this).closest('td');
        var columnIndex = $this.DataTable().column($cell).index();
        var columnName = $this.find('tr.filter th').eq(columnIndex).data('columnName');
        var data = {};
        var value = {};

        value[columnName] = $(this).prop('checked') ? 1 : 0;
        data[productId] = value;

        $.post(url, {
            data: data,
            pageToken: jse.core.config.get('pageToken')
        }).done(function (response) {
            if (typeof response === "string") {
                response = $.parseJSON(response);
            }

            if (response.success) {
                var content = jse.core.lang.translate('SUCCESS_PRODUCT_UPDATED', 'admin_quick_edit');

                // Show success message in the admin info box.
                jse.libs.info_box.addSuccessMessage(content);

                return;
            }

            var title = jse.core.lang.translate('MODAL_TITLE_NODE', 'admin_quick_edit');
            var message = jse.core.lang.translate('EDIT_ERROR', 'admin_quick_edit');
            var buttons = [{
                title: jse.core.lang.translate('BUTTON_CLOSE', 'admin_quick_edit'),
                callback: function callback(event) {
                    return $(event.currentTarget).parents('.modal').modal('hide');
                }
            }];

            jse.libs.modal.showMessage(title, message, buttons);
        });
    }

    /**
     * Create inventory list click event handler.
     *
     * Generates an inventory list PDF from the selected rows or from all the records if no row is selected.
     */
    function _onCreateInventoryListClick() {
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.overview-row-selection');
        var $modal = $this.parents('.quick-edit.overview').find('div.downloads');
        var $download = $modal.find('button.download-button');
        var generateUrl = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/CreateInventoryFile';
        var downloadUrl = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/DownloadInventoryFile&pageToken=' + jse.core.config.get('pageToken');
        var productsId = [];

        $checkedSingleCheckboxes.each(function () {
            var id = $(this).parents('tr').data('id');
            productsId.push(id);
        });

        var data = {
            data: 'inventoryList',
            products: productsId,
            pageToken: jse.core.config.get('pageToken')
        };

        $modal.find('.modal-body').empty().append('<p><i class="fa fa-clock-o"></i> ' + jse.core.lang.translate('TEXT_PLEASE_WAIT', 'admin_quick_edit') + '...</p>');

        $.post(generateUrl, data).done(function (response) {
            if (response.success) {
                var $documentTarget = '<a href="' + downloadUrl + '" class="btn btn-primary download-button" target="_blank">' + jse.core.lang.translate('BUTTON_DOWNLOAD', 'admin_quick_edit') + '</a>';

                $modal.find('.modal-body').html('<p><i class="fa fa-check"></i> ' + jse.core.lang.translate('TEXT_READY_TO_DOWNLOAD_DOCUMENT', 'admin_quick_edit') + '...</p>');

                $download.replaceWith($documentTarget);
                $modal.find('.download-button').on('click', function () {
                    $modal.modal('hide');
                });
            }
        });

        $modal.on('hidden.bs.modal', function () {
            var $download = $modal.find('a.download-button');
            var $downloadButton = '<button type="button" class="btn btn-primary download-button" disabled>' + jse.core.lang.translate('BUTTON_DOWNLOAD', 'admin_quick_edit') + '</button>';

            $download.replaceWith($downloadButton);
        });
    }

    /**
     * Display graduated prices management modal.
     *
     * Note: Current product ID must be set as a data "productId" value in the modal container element.
     */
    function _onTableRowGraduatedPricesClick() {
        $('.graduated-prices.modal').data('productId', $(this).parents('tr').data('id')).modal('show');
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', 'tbody tr', _onTableRowClick).on('click', '.row-edit', _onTableRowEditClick).on('click', '.show-product', _onTableRowShowClick).on('click', '.graduated-prices', _onTableRowGraduatedPricesClick).on('change', '.overview-bulk-selection', _onBulkSelectionChange).on('keyup', 'tbody tr input:text', _onTableRowDataChange).on('change', 'tbody tr select', _onTableRowDataChange);

        $this.parents('.quick-edit.overview').on('change', 'input:checkbox.overview-row-selection', _onTableRowCheckboxChange).on('change', '.select-page-mode', _onPageModeChange).on('click', '.cancel-edits', _onCancelClick).on('click', '.btn-group .bulk-row-edit', _onTableBulkRowEditClick);

        $('body').on('click', '.create-inventory-list', _onCreateInventoryListClick);

        $this.on('draw.dt', function () {
            $this.find('.convert-to-switcher').on('change', _onTableRowSwitcherChange);
            _onTableRowCheckboxChange();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvZXZlbnRzLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiX29uQnVsa1NlbGVjdGlvbkNoYW5nZSIsImV2ZW50IiwicHJvcGFnYXRlIiwiZmluZCIsInNpbmdsZV9jaGVja2JveCIsInByb3AiLCJ0cmlnZ2VyIiwiX29uVGFibGVSb3dDbGljayIsInRhcmdldCIsImlzIiwiJHNpbmdsZUNoZWNrYm94IiwiX29uVGFibGVSb3dFZGl0Q2xpY2siLCIkdGFibGVSb3ciLCJwYXJlbnRzIiwiJGRyb3Bkb3duIiwiJHNhdmVBY3Rpb24iLCIkZWRpdEFjdGlvbiIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJqc2UiLCJsaWJzIiwiYnV0dG9uX2Ryb3Bkb3duIiwic2V0RGVmYXVsdEFjdGlvbiIsImVhY2giLCJsZW5ndGgiLCJoYXNDbGFzcyIsInJvd0luZGV4Iiwicm93RGF0YSIsIkRhdGFUYWJsZSIsInJvdyIsIm9wdGlvbnMiLCJEVF9Sb3dEYXRhIiwib3B0aW9uIiwibWFudWZhY3R1cmVyIiwiaHRtbCIsImZvckVhY2giLCJpZCIsInZhbHVlIiwiaW5uZXJIVE1MIiwiaW5uZXJUZXh0IiwicmVwbGFjZSIsIl9vblRhYmxlUm93U2hvd0NsaWNrIiwicHJvZHVjdElkIiwicGFyYW1ldGVycyIsInBJRCIsImFjdGlvbiIsIndpbmRvdyIsIm9wZW4iLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwicGFyYW0iLCJfb25UYWJsZUJ1bGtSb3dFZGl0Q2xpY2siLCIkYnVsa0VkaXRBY3Rpb24iLCIkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMiLCIkYnVsa0FjdGlvbnNEcm9wZG93biIsIiRidWxrU2F2ZUFjdGlvbiIsIiRyb3dBY3Rpb25zRHJvcGRvd24iLCJfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlIiwiJGJ1bGtBY3Rpb25Ecm9wZG93bkJ1dHRvbnMiLCJfcmVzb2x2ZVJvd0NoYW5nZXMiLCJsYXN0IiwiX29uUGFnZU1vZGVDaGFuZ2UiLCJ2YWwiLCJhdHRyIiwiX29uQ2FuY2VsQ2xpY2siLCIkcGFnZU1vZGUiLCJjbG9zZXN0IiwiJHJvdyIsImluZGV4Iiwibm90IiwiJGNlbGwiLCJjb2x1bW5JbmRleCIsImNvbHVtbiIsInBhcmVudEVsZW1lbnQiLCJjZWxsIiwiX29uVGFibGVSb3dEYXRhQ2hhbmdlIiwidHJpbSIsIl9vblRhYmxlUm93U3dpdGNoZXJDaGFuZ2UiLCJ1cmwiLCJjb2x1bW5OYW1lIiwiZXEiLCJwb3N0IiwicGFnZVRva2VuIiwiZG9uZSIsInJlc3BvbnNlIiwicGFyc2VKU09OIiwic3VjY2VzcyIsImNvbnRlbnQiLCJsYW5nIiwidHJhbnNsYXRlIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsInRpdGxlIiwibWVzc2FnZSIsImJ1dHRvbnMiLCJjYWxsYmFjayIsImN1cnJlbnRUYXJnZXQiLCJtb2RhbCIsInNob3dNZXNzYWdlIiwiX29uQ3JlYXRlSW52ZW50b3J5TGlzdENsaWNrIiwiJG1vZGFsIiwiJGRvd25sb2FkIiwiZ2VuZXJhdGVVcmwiLCJkb3dubG9hZFVybCIsInByb2R1Y3RzSWQiLCJwdXNoIiwicHJvZHVjdHMiLCJlbXB0eSIsImFwcGVuZCIsIiRkb2N1bWVudFRhcmdldCIsInJlcGxhY2VXaXRoIiwib24iLCIkZG93bmxvYWRCdXR0b24iLCJfb25UYWJsZVJvd0dyYWR1YXRlZFByaWNlc0NsaWNrIiwiaW5pdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsUUFBdEIsRUFDSSxDQUNJLGlCQURKLEVBQ3VCLE9BRHZCLEVBQ21DRixHQUFHRyxNQUR0Qyw0QkFDd0VILEdBQUdHLE1BRDNFLG9CQURKLEVBSUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1KLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1BLGFBQVNLLHNCQUFULENBQWdDQyxLQUFoQyxFQUF5RDtBQUFBLFlBQWxCQyxTQUFrQix1RUFBTixJQUFNOztBQUNyRCxZQUFJQSxjQUFjLEtBQWxCLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBRURKLGNBQU1LLElBQU4sQ0FBVyw2Q0FBWCxFQUNLQyxlQURMLENBQ3FCLFNBRHJCLEVBQ2dDTCxFQUFFLElBQUYsRUFBUU0sSUFBUixDQUFhLFNBQWIsQ0FEaEMsRUFFS0MsT0FGTCxDQUVhLFFBRmI7QUFHSDs7QUFFRDs7Ozs7QUFLQSxhQUFTQyxnQkFBVCxDQUEwQk4sS0FBMUIsRUFBaUM7QUFDN0IsWUFBSSxDQUFDRixFQUFFRSxNQUFNTyxNQUFSLEVBQWdCQyxFQUFoQixDQUFtQixJQUFuQixDQUFMLEVBQStCO0FBQzNCO0FBQ0g7O0FBRUQsWUFBTUMsa0JBQWtCWCxFQUFFLElBQUYsRUFBUUksSUFBUixDQUFhLHVDQUFiLENBQXhCOztBQUVBTyx3QkFBZ0JMLElBQWhCLENBQXFCLFNBQXJCLEVBQWdDLENBQUNOLEVBQUUsSUFBRixFQUM1QkksSUFENEIsQ0FDdkIsdUNBRHVCLEVBRTVCRSxJQUY0QixDQUV2QixTQUZ1QixDQUFqQyxFQUdLQyxPQUhMLENBR2EsUUFIYjtBQUlIOztBQUVEOzs7QUFHQSxhQUFTSyxvQkFBVCxHQUFnQztBQUM1QixZQUFNQyxZQUFZYixFQUFFLElBQUYsRUFBUWMsT0FBUixDQUFnQixJQUFoQixDQUFsQjtBQUNBLFlBQU1ILGtCQUFrQlgsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JWLElBQXRCLENBQTJCLHVDQUEzQixDQUF4Qjs7QUFFQSxZQUFNVyxZQUFZRixVQUFVVCxJQUFWLENBQWUscUJBQWYsQ0FBbEI7QUFDQSxZQUFNWSxjQUFjRCxVQUFVWCxJQUFWLENBQWUsaUJBQWYsQ0FBcEI7QUFDQSxZQUFNYSxjQUFjSixVQUFVVCxJQUFWLENBQWUsV0FBZixDQUFwQjtBQUNBYSxvQkFBWUMsUUFBWixDQUFxQixRQUFyQjtBQUNBRixvQkFBWUcsV0FBWixDQUF3QixRQUF4QjtBQUNBQyxZQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLGdCQUF6QixDQUEwQ1IsU0FBMUMsRUFBcURDLFdBQXJEOztBQUVBSCxrQkFBVVQsSUFBVixDQUFlLGFBQWYsRUFBOEJvQixJQUE5QixDQUFtQyxZQUFZO0FBQzNDLGdCQUFJeEIsRUFBRSxJQUFGLEVBQVFJLElBQVIsQ0FBYSxZQUFiLEVBQTJCcUIsTUFBM0IsR0FBb0MsQ0FBeEMsRUFBMkM7QUFDdkM7QUFDSDs7QUFFRCxnQkFBSXpCLEVBQUUsSUFBRixFQUFRMEIsUUFBUixDQUFpQixjQUFqQixDQUFKLEVBQXNDO0FBQ2xDLG9CQUFNQyxXQUFXM0IsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBakI7QUFDQSxvQkFBTWMsVUFBVTdCLE1BQU04QixTQUFOLEdBQWtCQyxHQUFsQixDQUFzQkgsUUFBdEIsRUFBZ0M3QixJQUFoQyxFQUFoQjtBQUNBLG9CQUFNaUMsVUFBVUgsUUFBUUksVUFBUixDQUFtQkMsTUFBbkIsQ0FBMEJDLFlBQTFDOztBQUVBLG9CQUFJQyxPQUFPLEVBQVg7O0FBRUFKLHdCQUFRSyxPQUFSLENBQWdCLGtCQUFVO0FBQ3RCRCxnREFBMEJGLE9BQU9JLEVBQWpDLFdBQXdDVCxRQUFRTSxZQUFSLElBQXdCRCxPQUFPSyxLQUEvQixHQUF1QyxVQUF2QyxHQUFvRCxFQUE1RiwwQkFDZkwsT0FBT0ssS0FEUTtBQUdILGlCQUpEOztBQU1BLHFCQUFLQyxTQUFMLHFDQUFpREosSUFBakQ7QUFFSCxhQWZELE1BZU87QUFDSCxxQkFBS0ksU0FBTCxHQUNJLG9EQUFvRCxLQUFLQyxTQUFMLENBQWVDLE9BQWYsQ0FBdUIsSUFBdkIsRUFBNkIsUUFBN0IsQ0FBcEQsU0FESjtBQUdIO0FBRUosU0ExQkQ7O0FBNEJBOUIsd0JBQWdCTCxJQUFoQixDQUFxQixTQUFyQixFQUFnQyxDQUFDTixFQUFFLElBQUYsRUFDNUJJLElBRDRCLENBQ3ZCLHVDQUR1QixFQUU1QkUsSUFGNEIsQ0FFdkIsU0FGdUIsQ0FBakMsRUFHS0MsT0FITCxDQUdhLFFBSGI7QUFJSDs7QUFFRDs7Ozs7QUFLQSxhQUFTbUMsb0JBQVQsR0FBZ0M7QUFDNUIsWUFBTUMsWUFBWTNDLEVBQUUsSUFBRixFQUFRYyxPQUFSLENBQWdCLElBQWhCLEVBQXNCaEIsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBbEI7O0FBRUEsWUFBTThDLGFBQWE7QUFDZkMsaUJBQUtGLFNBRFU7QUFFZkcsb0JBQVE7QUFGTyxTQUFuQjs7QUFLQUMsZUFBT0MsSUFBUCxDQUFlNUIsSUFBSTZCLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsQ0FBSCw4QkFBMkRuRCxFQUFFb0QsS0FBRixDQUFRUixVQUFSLENBQXZFLEVBQTRGLFFBQTVGO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU1Msd0JBQVQsR0FBb0M7QUFDaEMsWUFBTUMsa0JBQWtCdEQsRUFBRSxJQUFGLENBQXhCO0FBQ0EsWUFBTXVELDJCQUEyQnhELE1BQU1LLElBQU4sQ0FBVywrQ0FBWCxDQUFqQzs7QUFFQSxZQUFJbUQseUJBQXlCOUIsTUFBN0IsRUFBcUM7QUFDakMsZ0JBQU0rQix1QkFBdUJ4RCxFQUFFLHVCQUFGLENBQTdCO0FBQ0EsZ0JBQU15RCxrQkFBa0JELHFCQUFxQnBELElBQXJCLENBQTBCLHNCQUExQixDQUF4QjtBQUNBa0QsNEJBQWdCcEMsUUFBaEIsQ0FBeUIsUUFBekI7QUFDQXVDLDRCQUFnQnRDLFdBQWhCLENBQTRCLFFBQTVCO0FBQ0FDLGdCQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLGdCQUF6QixDQUEwQ2lDLG9CQUExQyxFQUFnRUMsZUFBaEU7QUFDSDs7QUFFREYsaUNBQXlCL0IsSUFBekIsQ0FBOEIsWUFBWTtBQUN0QyxnQkFBTVgsWUFBWWIsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBbEI7QUFDQSxnQkFBTTRDLHNCQUFzQjdDLFVBQVVULElBQVYsQ0FBZSxxQkFBZixDQUE1QjtBQUNBLGdCQUFNWSxjQUFjMEMsb0JBQW9CdEQsSUFBcEIsQ0FBeUIsaUJBQXpCLENBQXBCO0FBQ0EsZ0JBQU1hLGNBQWNKLFVBQVVULElBQVYsQ0FBZSxXQUFmLENBQXBCOztBQUVBYSx3QkFBWUMsUUFBWixDQUFxQixRQUFyQjtBQUNBRix3QkFBWUcsV0FBWixDQUF3QixRQUF4QjtBQUNBQyxnQkFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCQyxnQkFBekIsQ0FBMENtQyxtQkFBMUMsRUFBK0QxQyxXQUEvRDs7QUFFQUgsc0JBQVVULElBQVYsQ0FBZSxhQUFmLEVBQThCb0IsSUFBOUIsQ0FBbUMsWUFBWTs7QUFFM0Msb0JBQUl4QixFQUFFLElBQUYsRUFBUUksSUFBUixDQUFhLFlBQWIsRUFBMkJxQixNQUEzQixHQUFvQyxDQUF4QyxFQUEyQztBQUN2QztBQUNIOztBQUVELG9CQUFJekIsRUFBRSxJQUFGLEVBQVEwQixRQUFSLENBQWlCLGNBQWpCLENBQUosRUFBc0M7QUFDbEMsd0JBQU1DLFdBQVczQixFQUFFLElBQUYsRUFBUWMsT0FBUixDQUFnQixJQUFoQixDQUFqQjtBQUNBLHdCQUFNYyxVQUFVN0IsTUFBTThCLFNBQU4sR0FBa0JDLEdBQWxCLENBQXNCSCxRQUF0QixFQUFnQzdCLElBQWhDLEVBQWhCO0FBQ0Esd0JBQU1pQyxVQUFVSCxRQUFRSSxVQUFSLENBQW1CQyxNQUFuQixDQUEwQkMsWUFBMUM7O0FBRUEsd0JBQUlDLE9BQU8sRUFBWDs7QUFFQUosNEJBQVFLLE9BQVIsQ0FBZ0Isa0JBQVU7QUFDdEJELG9EQUNzQkYsT0FBT0ksRUFEN0IsV0FDb0NULFFBQVFNLFlBQVIsSUFBd0JELE9BQU9LLEtBQS9CLEdBQXVDLFVBQXZDLEdBQW9ELEVBRHhGLDBCQUVuQkwsT0FBT0ssS0FGWTtBQUlILHFCQUxEOztBQU9BLHlCQUFLQyxTQUFMLHFDQUFpREosSUFBakQ7QUFFSCxpQkFoQkQsTUFnQk87QUFDSCx5QkFBS0ksU0FBTCxHQUNJLG9EQUFvRCxLQUFLQyxTQUFMLENBQWVDLE9BQWYsQ0FBdUIsSUFBdkIsRUFBNkIsUUFBN0IsQ0FBcEQsU0FESjtBQUdIO0FBQ0osYUEzQkQ7QUE0QkgsU0F0Q0Q7QUF1Q0g7O0FBRUQ7OztBQUdBLGFBQVNrQix5QkFBVCxHQUFxQztBQUNqQyxZQUFNQyw2QkFBNkI3RCxNQUFNZSxPQUFOLENBQWMsc0JBQWQsRUFDOUJWLElBRDhCLENBQ3pCLGdDQUR5QixDQUFuQztBQUVBLFlBQU1TLFlBQVliLEVBQUUsSUFBRixFQUFRYyxPQUFSLENBQWdCLElBQWhCLENBQWxCOztBQUVBLFlBQUlmLE1BQU1LLElBQU4sQ0FBVywrQ0FBWCxFQUE0RHFCLE1BQTVELEdBQXFFLENBQXpFLEVBQTRFO0FBQ3hFbUMsdUNBQTJCekMsV0FBM0IsQ0FBdUMsVUFBdkM7QUFDSCxTQUZELE1BRU87QUFDSHlDLHVDQUEyQjFDLFFBQTNCLENBQW9DLFVBQXBDOztBQUVBLGdCQUFNc0MsdUJBQXVCeEQsRUFBRSx1QkFBRixDQUE3QjtBQUNBLGdCQUFNeUQsa0JBQWtCRCxxQkFBcUJwRCxJQUFyQixDQUEwQixzQkFBMUIsQ0FBeEI7O0FBRUEsZ0JBQUksQ0FBQ3FELGdCQUFnQi9CLFFBQWhCLENBQXlCLFFBQXpCLENBQUwsRUFBeUM7QUFDckMsb0JBQU00QixrQkFBa0JFLHFCQUFxQnBELElBQXJCLENBQTBCLGdCQUExQixDQUF4QjtBQUNBa0QsZ0NBQWdCbkMsV0FBaEIsQ0FBNEIsUUFBNUI7QUFDQXNDLGdDQUFnQnZDLFFBQWhCLENBQXlCLFFBQXpCO0FBQ0FFLG9CQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLGdCQUF6QixDQUEwQ2lDLG9CQUExQyxFQUFnRUYsZUFBaEU7QUFDSDtBQUNKOztBQUVELFlBQUksQ0FBQ3RELEVBQUUsSUFBRixFQUFRTSxJQUFSLENBQWEsU0FBYixDQUFMLEVBQThCO0FBQzFCdUQsK0JBQW1CN0QsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBbkI7O0FBRUEsZ0JBQU00QyxzQkFBc0I3QyxVQUFVVCxJQUFWLENBQWUscUJBQWYsQ0FBNUI7QUFDQSxnQkFBTVksY0FBYzBDLG9CQUFvQnRELElBQXBCLENBQXlCLGlCQUF6QixDQUFwQjs7QUFFQSxnQkFBSSxDQUFDWSxZQUFZVSxRQUFaLENBQXFCLFFBQXJCLENBQUwsRUFBcUM7QUFDakMsb0JBQU1ULGNBQWNKLFVBQVVULElBQVYsQ0FBZSxXQUFmLENBQXBCO0FBQ0FhLDRCQUFZRSxXQUFaLENBQXdCLFFBQXhCO0FBQ0FILDRCQUFZRSxRQUFaLENBQXFCLFFBQXJCO0FBQ0FFLG9CQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLGdCQUF6QixDQUEwQ21DLG1CQUExQyxFQUErRHpDLFlBQVk2QyxJQUFaLEVBQS9EO0FBQ0g7QUFDSjtBQUNKOztBQUVEOzs7QUFHQSxhQUFTQyxpQkFBVCxHQUE2QjtBQUN6QixZQUFJL0QsRUFBRSxJQUFGLEVBQVFnRSxHQUFSLE1BQWlCLFdBQXJCLEVBQWtDO0FBQzlCakUsa0JBQU1LLElBQU4sQ0FBVyxXQUFYLEVBQXdCNkQsSUFBeEIsQ0FBNkIsUUFBN0IsRUFBdUMsSUFBdkM7QUFDQWxFLGtCQUFNSyxJQUFOLENBQVcsU0FBWCxFQUFzQjZELElBQXRCLENBQTJCLFFBQTNCLEVBQXFDLEtBQXJDO0FBQ0FsRSxrQkFBTUssSUFBTixDQUFXLHlCQUFYLEVBQXNDYyxRQUF0QyxDQUErQyxXQUEvQztBQUNILFNBSkQsTUFJTztBQUNIbkIsa0JBQU1LLElBQU4sQ0FBVyxXQUFYLEVBQXdCNkQsSUFBeEIsQ0FBNkIsUUFBN0IsRUFBdUMsS0FBdkM7QUFDQWxFLGtCQUFNSyxJQUFOLENBQVcsU0FBWCxFQUFzQjZELElBQXRCLENBQTJCLFFBQTNCLEVBQXFDLElBQXJDO0FBQ0FsRSxrQkFBTUssSUFBTixDQUFXLHlCQUFYLEVBQXNDZSxXQUF0QyxDQUFrRCxXQUFsRDtBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBLGFBQVMrQyxjQUFULEdBQTBCO0FBQ3RCLFlBQU1DLFlBQVluRSxFQUFFLElBQUYsRUFBUW9FLE9BQVIsQ0FBZ0IsT0FBaEIsRUFBeUJoRSxJQUF6QixDQUE4QixtQkFBOUIsQ0FBbEI7QUFDQSxZQUFNbUQsMkJBQTJCeEQsTUFBTUssSUFBTixDQUFXLCtDQUFYLENBQWpDOztBQUVBLFlBQUkrRCxVQUFVSCxHQUFWLE1BQW1CLFdBQXZCLEVBQW9DO0FBQ2hDRyxzQkFBVUgsR0FBVixDQUFjLGFBQWQ7QUFDSCxTQUZELE1BRU87QUFDSEcsc0JBQVVILEdBQVYsQ0FBYyxXQUFkO0FBQ0g7O0FBRURULGlDQUF5Qi9CLElBQXpCLENBQThCLFlBQVk7QUFDdEN4QixjQUFFLElBQUYsRUFBUU0sSUFBUixDQUFhLFNBQWIsRUFBd0IsQ0FBQ04sRUFBRSxJQUFGLEVBQ3BCTSxJQURvQixDQUNmLFNBRGUsQ0FBekIsRUFFS0MsT0FGTCxDQUVhLFFBRmI7O0FBSUFzRCwrQkFBbUI3RCxFQUFFLElBQUYsRUFBUWMsT0FBUixDQUFnQixJQUFoQixDQUFuQjtBQUNILFNBTkQ7O0FBUUFpRDtBQUNIOztBQUVEOzs7OztBQUtBLGFBQVNGLGtCQUFULENBQTRCUSxJQUE1QixFQUFrQztBQUM5QixZQUFNMUMsV0FBVzVCLE1BQU04QixTQUFOLEdBQWtCQyxHQUFsQixDQUFzQnVDLElBQXRCLEVBQTRCQyxLQUE1QixFQUFqQjs7QUFFQUQsYUFBS2pFLElBQUwsQ0FBVSxvQkFBVixFQUFnQ21FLEdBQWhDLENBQW9DLG9DQUFwQyxFQUEwRS9DLElBQTFFLENBQStFLFlBQVk7QUFDdkYsZ0JBQU1nRCxRQUFReEUsRUFBRSxJQUFGLEVBQVFvRSxPQUFSLENBQWdCLElBQWhCLENBQWQ7QUFDQSxnQkFBTUssY0FBYzFFLE1BQU04QixTQUFOLEdBQWtCNkMsTUFBbEIsQ0FBeUJGLEtBQXpCLEVBQWdDRixLQUFoQyxFQUFwQjtBQUNBLGlCQUFLSyxhQUFMLENBQW1CcEMsU0FBbkIsR0FBK0J4QyxNQUFNOEIsU0FBTixHQUFrQitDLElBQWxCLENBQXVCakQsUUFBdkIsRUFBaUM4QyxXQUFqQyxFQUE4QzNFLElBQTlDLEVBQS9CO0FBQ0gsU0FKRDtBQUtIOztBQUVEOzs7OztBQUtBLGFBQVMrRSxxQkFBVCxHQUFpQztBQUM3QixZQUFNUixPQUFPckUsRUFBRSxJQUFGLEVBQVFvRSxPQUFSLENBQWdCLElBQWhCLENBQWI7QUFDQSxZQUFNekMsV0FBVzVCLE1BQU04QixTQUFOLEdBQWtCQyxHQUFsQixDQUFzQnVDLElBQXRCLEVBQTRCQyxLQUE1QixFQUFqQjs7QUFFQUQsYUFBS2pFLElBQUwsQ0FBVSxvQkFBVixFQUFnQ21FLEdBQWhDLENBQW9DLG9DQUFwQyxFQUEwRS9DLElBQTFFLENBQStFLFlBQVk7QUFDdkYsZ0JBQU1nRCxRQUFReEUsRUFBRSxJQUFGLEVBQVFvRSxPQUFSLENBQWdCLElBQWhCLENBQWQ7QUFDQSxnQkFBTUssY0FBYzFFLE1BQU04QixTQUFOLEdBQWtCNkMsTUFBbEIsQ0FBeUJGLEtBQXpCLEVBQWdDRixLQUFoQyxFQUFwQjs7QUFFQSxnQkFBSXRFLEVBQUU4RSxJQUFGLENBQU85RSxFQUFFLElBQUYsRUFBUWdFLEdBQVIsRUFBUCxLQUF5QmpFLE1BQU04QixTQUFOLEdBQWtCK0MsSUFBbEIsQ0FBdUJqRCxRQUF2QixFQUFpQzhDLFdBQWpDLEVBQThDM0UsSUFBOUMsRUFBN0IsRUFBbUY7QUFDL0VFLGtCQUFFLElBQUYsRUFBUWtCLFFBQVIsQ0FBaUIsVUFBakI7QUFDQTtBQUNIOztBQUVEbEIsY0FBRSxJQUFGLEVBQVFtQixXQUFSLENBQW9CLFVBQXBCO0FBQ0gsU0FWRDtBQVdIOztBQUVEOzs7OztBQUtBLGFBQVM0RCx5QkFBVCxHQUFxQztBQUNqQyxZQUFNQyxNQUFNNUQsSUFBSTZCLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsUUFBcEIsSUFBZ0Msa0RBQTVDO0FBQ0EsWUFBTVIsWUFBWTNDLEVBQUUsSUFBRixFQUFRYyxPQUFSLENBQWdCLElBQWhCLEVBQXNCaEIsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBbEI7QUFDQSxZQUFNMEUsUUFBUXhFLEVBQUUsSUFBRixFQUFRb0UsT0FBUixDQUFnQixJQUFoQixDQUFkO0FBQ0EsWUFBTUssY0FBYzFFLE1BQU04QixTQUFOLEdBQWtCNkMsTUFBbEIsQ0FBeUJGLEtBQXpCLEVBQWdDRixLQUFoQyxFQUFwQjtBQUNBLFlBQU1XLGFBQWFsRixNQUFNSyxJQUFOLENBQVcsY0FBWCxFQUEyQjhFLEVBQTNCLENBQThCVCxXQUE5QixFQUEyQzNFLElBQTNDLENBQWdELFlBQWhELENBQW5CO0FBQ0EsWUFBTUEsT0FBTyxFQUFiO0FBQ0EsWUFBTXdDLFFBQVEsRUFBZDs7QUFFQUEsY0FBTTJDLFVBQU4sSUFBb0JqRixFQUFFLElBQUYsRUFBUU0sSUFBUixDQUFhLFNBQWIsSUFBMEIsQ0FBMUIsR0FBOEIsQ0FBbEQ7QUFDQVIsYUFBSzZDLFNBQUwsSUFBa0JMLEtBQWxCOztBQUVBdEMsVUFBRW1GLElBQUYsQ0FBT0gsR0FBUCxFQUFZO0FBQ1JsRixzQkFEUTtBQUVSc0YsdUJBQVdoRSxJQUFJNkIsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQjtBQUZILFNBQVosRUFHR2tDLElBSEgsQ0FHUSxvQkFBWTtBQUNoQixnQkFBSSxPQUFPQyxRQUFQLEtBQW9CLFFBQXhCLEVBQWtDO0FBQzlCQSwyQkFBV3RGLEVBQUV1RixTQUFGLENBQVlELFFBQVosQ0FBWDtBQUNIOztBQUVELGdCQUFJQSxTQUFTRSxPQUFiLEVBQXNCO0FBQ2xCLG9CQUFNQyxVQUFVckUsSUFBSTZCLElBQUosQ0FBU3lDLElBQVQsQ0FBY0MsU0FBZCxDQUF3Qix5QkFBeEIsRUFBbUQsa0JBQW5ELENBQWhCOztBQUVBO0FBQ0F2RSxvQkFBSUMsSUFBSixDQUFTdUUsUUFBVCxDQUFrQkMsaUJBQWxCLENBQW9DSixPQUFwQzs7QUFFQTtBQUNIOztBQUVELGdCQUFNSyxRQUFRMUUsSUFBSTZCLElBQUosQ0FBU3lDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixrQkFBeEIsRUFBNEMsa0JBQTVDLENBQWQ7QUFDQSxnQkFBTUksVUFBVTNFLElBQUk2QixJQUFKLENBQVN5QyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsWUFBeEIsRUFBc0Msa0JBQXRDLENBQWhCO0FBQ0EsZ0JBQU1LLFVBQVUsQ0FDWjtBQUNJRix1QkFBTzFFLElBQUk2QixJQUFKLENBQVN5QyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsY0FBeEIsRUFBd0Msa0JBQXhDLENBRFg7QUFFSU0sMEJBQVU7QUFBQSwyQkFBU2pHLEVBQUVFLE1BQU1nRyxhQUFSLEVBQXVCcEYsT0FBdkIsQ0FBK0IsUUFBL0IsRUFBeUNxRixLQUF6QyxDQUErQyxNQUEvQyxDQUFUO0FBQUE7QUFGZCxhQURZLENBQWhCOztBQU9BL0UsZ0JBQUlDLElBQUosQ0FBUzhFLEtBQVQsQ0FBZUMsV0FBZixDQUEyQk4sS0FBM0IsRUFBa0NDLE9BQWxDLEVBQTJDQyxPQUEzQztBQUNILFNBM0JEO0FBNEJIOztBQUVEOzs7OztBQUtBLGFBQVNLLDJCQUFULEdBQXVDO0FBQ25DLFlBQU05QywyQkFBMkJ4RCxNQUFNSyxJQUFOLENBQVcsK0NBQVgsQ0FBakM7QUFDQSxZQUFNa0csU0FBU3ZHLE1BQU1lLE9BQU4sQ0FBYyxzQkFBZCxFQUFzQ1YsSUFBdEMsQ0FBMkMsZUFBM0MsQ0FBZjtBQUNBLFlBQU1tRyxZQUFZRCxPQUFPbEcsSUFBUCxDQUFZLHdCQUFaLENBQWxCO0FBQ0EsWUFBTW9HLGNBQWNwRixJQUFJNkIsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUNkLCtEQUROO0FBRUEsWUFBTXNELGNBQWNyRixJQUFJNkIsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUNkLDRFQURjLEdBRWQvQixJQUFJNkIsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQixDQUZOO0FBR0EsWUFBTXVELGFBQWEsRUFBbkI7O0FBRUFuRCxpQ0FBeUIvQixJQUF6QixDQUE4QixZQUFZO0FBQ3RDLGdCQUFJYSxLQUFLckMsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JoQixJQUF0QixDQUEyQixJQUEzQixDQUFUO0FBQ0E0Ryx1QkFBV0MsSUFBWCxDQUFnQnRFLEVBQWhCO0FBQ0gsU0FIRDs7QUFLQSxZQUFNdkMsT0FBTztBQUNUQSxrQkFBTSxlQURHO0FBRVQ4RyxzQkFBVUYsVUFGRDtBQUdUdEIsdUJBQVdoRSxJQUFJNkIsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixXQUFwQjtBQUhGLFNBQWI7O0FBTUFtRCxlQUFPbEcsSUFBUCxDQUFZLGFBQVosRUFDS3lHLEtBREwsR0FFS0MsTUFGTCx1Q0FFZ0QxRixJQUFJNkIsSUFBSixDQUFTeUMsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGtCQUF4QixFQUE0QyxrQkFBNUMsQ0FGaEQ7O0FBSUEzRixVQUFFbUYsSUFBRixDQUFPcUIsV0FBUCxFQUFvQjFHLElBQXBCLEVBQTBCdUYsSUFBMUIsQ0FBK0Isb0JBQVk7QUFDdkMsZ0JBQUlDLFNBQVNFLE9BQWIsRUFBc0I7QUFDbEIsb0JBQU11QixnQ0FBOEJOLFdBQTlCLGtFQUFzR3JGLElBQUk2QixJQUFKLENBQVN5QyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsaUJBQXhCLEVBQTJDLGtCQUEzQyxDQUF0RyxTQUFOOztBQUVBVyx1QkFBT2xHLElBQVAsQ0FBWSxhQUFaLEVBQ0srQixJQURMLHFDQUM0Q2YsSUFBSTZCLElBQUosQ0FBU3lDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixpQ0FBeEIsRUFBMkQsa0JBQTNELENBRDVDOztBQUdBWSwwQkFBVVMsV0FBVixDQUFzQkQsZUFBdEI7QUFDQVQsdUJBQU9sRyxJQUFQLENBQVksa0JBQVosRUFBZ0M2RyxFQUFoQyxDQUFtQyxPQUFuQyxFQUE0QyxZQUFZO0FBQ3BEWCwyQkFBT0gsS0FBUCxDQUFhLE1BQWI7QUFDSCxpQkFGRDtBQUdIO0FBRUosU0FiRDs7QUFlQUcsZUFBT1csRUFBUCxDQUFVLGlCQUFWLEVBQTZCLFlBQVk7QUFDckMsZ0JBQU1WLFlBQVlELE9BQU9sRyxJQUFQLENBQVksbUJBQVosQ0FBbEI7QUFDQSxnQkFBTThHLDhGQUE0RjlGLElBQUk2QixJQUFKLENBQVN5QyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsaUJBQXhCLEVBQTJDLGtCQUEzQyxDQUE1RixjQUFOOztBQUVBWSxzQkFBVVMsV0FBVixDQUFzQkUsZUFBdEI7QUFDSCxTQUxEO0FBTUg7O0FBRUQ7Ozs7O0FBS0EsYUFBU0MsK0JBQVQsR0FBMkM7QUFDdkNuSCxVQUFFLHlCQUFGLEVBQ0tGLElBREwsQ0FDVSxXQURWLEVBQ3VCRSxFQUFFLElBQUYsRUFBUWMsT0FBUixDQUFnQixJQUFoQixFQUFzQmhCLElBQXRCLENBQTJCLElBQTNCLENBRHZCLEVBRUtxRyxLQUZMLENBRVcsTUFGWDtBQUdIOztBQUdEO0FBQ0E7QUFDQTs7QUFFQXZHLFdBQU93SCxJQUFQLEdBQWMsVUFBVS9CLElBQVYsRUFBZ0I7QUFDMUJ0RixjQUNLa0gsRUFETCxDQUNRLE9BRFIsRUFDaUIsVUFEakIsRUFDNkJ6RyxnQkFEN0IsRUFFS3lHLEVBRkwsQ0FFUSxPQUZSLEVBRWlCLFdBRmpCLEVBRThCckcsb0JBRjlCLEVBR0txRyxFQUhMLENBR1EsT0FIUixFQUdpQixlQUhqQixFQUdrQ3ZFLG9CQUhsQyxFQUlLdUUsRUFKTCxDQUlRLE9BSlIsRUFJaUIsbUJBSmpCLEVBSXNDRSwrQkFKdEMsRUFLS0YsRUFMTCxDQUtRLFFBTFIsRUFLa0IsMEJBTGxCLEVBSzhDaEgsc0JBTDlDLEVBTUtnSCxFQU5MLENBTVEsT0FOUixFQU1pQixxQkFOakIsRUFNd0NwQyxxQkFOeEMsRUFPS29DLEVBUEwsQ0FPUSxRQVBSLEVBT2tCLGlCQVBsQixFQU9xQ3BDLHFCQVByQzs7QUFTQTlFLGNBQU1lLE9BQU4sQ0FBYyxzQkFBZCxFQUNLbUcsRUFETCxDQUNRLFFBRFIsRUFDa0IsdUNBRGxCLEVBQzJEdEQseUJBRDNELEVBRUtzRCxFQUZMLENBRVEsUUFGUixFQUVrQixtQkFGbEIsRUFFdUNsRCxpQkFGdkMsRUFHS2tELEVBSEwsQ0FHUSxPQUhSLEVBR2lCLGVBSGpCLEVBR2tDL0MsY0FIbEMsRUFJSytDLEVBSkwsQ0FJUSxPQUpSLEVBSWlCLDJCQUpqQixFQUk4QzVELHdCQUo5Qzs7QUFNQXJELFVBQUUsTUFBRixFQUNLaUgsRUFETCxDQUNRLE9BRFIsRUFDaUIsd0JBRGpCLEVBQzJDWiwyQkFEM0M7O0FBR0F0RyxjQUFNa0gsRUFBTixDQUFTLFNBQVQsRUFBb0IsWUFBTTtBQUN0QmxILGtCQUFNSyxJQUFOLENBQVcsc0JBQVgsRUFBbUM2RyxFQUFuQyxDQUFzQyxRQUF0QyxFQUFnRGxDLHlCQUFoRDtBQUNBcEI7QUFDSCxTQUhEOztBQUtBMEI7QUFDSCxLQXpCRDs7QUEyQkEsV0FBT3pGLE1BQVA7QUFDSCxDQTliTCIsImZpbGUiOiJxdWlja19lZGl0L292ZXJ2aWV3L2V2ZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZXZlbnRzLmpzIDIwMTgtMDQtMjRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIE1haW4gVGFibGUgRXZlbnRzXG4gKlxuICogSGFuZGxlcyB0aGUgZXZlbnRzIG9mIHRoZSBtYWluIFF1aWNrRWRpdCB0YWJsZS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdldmVudHMnLFxuICAgIFtcbiAgICAgICAgJ2xvYWRpbmdfc3Bpbm5lcicsICdtb2RhbCcsIGAke2d4LnNvdXJjZX0vbGlicy9idXR0b25fZHJvcGRvd25gLCBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19ib3hgXG4gICAgXSxcbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWxrIHNlbGVjdGlvbiBjaGFuZ2UgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtwcm9wYWdhdGUgPSB0cnVlXSBXaGV0aGVyIHRvIHByb3BhZ2F0ZSB0aGUgZXZlbnQgb3Igbm90LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQnVsa1NlbGVjdGlvbkNoYW5nZShldmVudCwgcHJvcGFnYXRlID0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKHByb3BhZ2F0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3Rib2R5IGlucHV0OmNoZWNrYm94Lm92ZXJ2aWV3LXJvdy1zZWxlY3Rpb24nKVxuICAgICAgICAgICAgICAgIC5zaW5nbGVfY2hlY2tib3goJ2NoZWNrZWQnLCAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGFibGUgcm93IGNsaWNrIGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghJChldmVudC50YXJnZXQpLmlzKCd0ZCcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCAkc2luZ2xlQ2hlY2tib3ggPSAkKHRoaXMpLmZpbmQoJ2lucHV0OmNoZWNrYm94Lm92ZXJ2aWV3LXJvdy1zZWxlY3Rpb24nKTtcblxuICAgICAgICAgICAgJHNpbmdsZUNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLCAhJCh0aGlzKVxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dDpjaGVja2JveC5vdmVydmlldy1yb3ctc2VsZWN0aW9uJylcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmFibGVzIHJvdyBlZGl0aW5nIG1vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd0VkaXRDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcbiAgICAgICAgICAgIGNvbnN0ICRzaW5nbGVDaGVja2JveCA9ICQodGhpcykucGFyZW50cygndHInKS5maW5kKCdpbnB1dDpjaGVja2JveC5vdmVydmlldy1yb3ctc2VsZWN0aW9uJyk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRkcm9wZG93biA9ICR0YWJsZVJvdy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJyk7XG4gICAgICAgICAgICBjb25zdCAkc2F2ZUFjdGlvbiA9ICRkcm9wZG93bi5maW5kKCcuc2F2ZS1yb3ctZWRpdHMnKTtcbiAgICAgICAgICAgIGNvbnN0ICRlZGl0QWN0aW9uID0gJHRhYmxlUm93LmZpbmQoJy5yb3ctZWRpdCcpO1xuICAgICAgICAgICAgJGVkaXRBY3Rpb24uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHNhdmVBY3Rpb24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLnNldERlZmF1bHRBY3Rpb24oJGRyb3Bkb3duLCAkc2F2ZUFjdGlvbik7XG5cbiAgICAgICAgICAgICR0YWJsZVJvdy5maW5kKCd0ZC5lZGl0YWJsZScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJ2lucHV0OnRleHQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnbWFudWZhY3R1cmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJ3RyJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0RhdGEgPSAkdGhpcy5EYXRhVGFibGUoKS5yb3cocm93SW5kZXgpLmRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHJvd0RhdGEuRFRfUm93RGF0YS5vcHRpb24ubWFudWZhY3R1cmVyO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBodG1sID0gJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtvcHRpb24uaWR9XCIgJHtyb3dEYXRhLm1hbnVmYWN0dXJlciA9PSBvcHRpb24udmFsdWUgPyAnc2VsZWN0ZWQnIDogJyd9PlxuXHRcdFx0XHRcdFx0XHQke29wdGlvbi52YWx1ZX1cblx0XHRcdFx0XHRcdDwvb3B0aW9uPmA7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj4ke2h0bWx9PC9zZWxlY3Q+YDtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHZhbHVlPVwiYCArIHRoaXMuaW5uZXJUZXh0LnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyBgXCIgLz5gO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzaW5nbGVDaGVja2JveC5wcm9wKCdjaGVja2VkJywgISQodGhpcylcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQ6Y2hlY2tib3gub3ZlcnZpZXctcm93LXNlbGVjdGlvbicpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2hvdyBwcm9kdWN0IGljb24gZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICpcbiAgICAgICAgICogTmF2aWdhdGVzIHRoZSBicm93c2VyIHRvIHRoZSBwcm9kdWN0IGRldGFpbHMgcGFnZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93U2hvd0NsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjdElkID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoJ2lkJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgICAgICAgcElEOiBwcm9kdWN0SWQsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnbmV3X3Byb2R1Y3QnLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgd2luZG93Lm9wZW4oYCR7anNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJyl9L2FkbWluL2NhdGVnb3JpZXMucGhwP2AgKyAkLnBhcmFtKHBhcmFtZXRlcnMpLCAnX2JsYW5rJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVsayByb3cgZWRpdCBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBFbmFibGVzIHRoZSBlZGl0IG1vZGUgZm9yIHRoZSBzZWxlY3RlZCByb3dzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uVGFibGVCdWxrUm93RWRpdENsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgJGJ1bGtFZGl0QWN0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0ICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcyA9ICR0aGlzLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQub3ZlcnZpZXctcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgICAgICBpZiAoJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRidWxrQWN0aW9uc0Ryb3Bkb3duID0gJCgnLm92ZXJ2aWV3LWJ1bGstYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgJGJ1bGtTYXZlQWN0aW9uID0gJGJ1bGtBY3Rpb25zRHJvcGRvd24uZmluZCgnLnNhdmUtYnVsay1yb3ctZWRpdHMnKTtcbiAgICAgICAgICAgICAgICAkYnVsa0VkaXRBY3Rpb24uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICRidWxrU2F2ZUFjdGlvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLnNldERlZmF1bHRBY3Rpb24oJGJ1bGtBY3Rpb25zRHJvcGRvd24sICRidWxrU2F2ZUFjdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkdGFibGVSb3cgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgJHJvd0FjdGlvbnNEcm9wZG93biA9ICR0YWJsZVJvdy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgJHNhdmVBY3Rpb24gPSAkcm93QWN0aW9uc0Ryb3Bkb3duLmZpbmQoJy5zYXZlLXJvdy1lZGl0cycpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRlZGl0QWN0aW9uID0gJHRhYmxlUm93LmZpbmQoJy5yb3ctZWRpdCcpO1xuXG4gICAgICAgICAgICAgICAgJGVkaXRBY3Rpb24uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICRzYXZlQWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uc2V0RGVmYXVsdEFjdGlvbigkcm93QWN0aW9uc0Ryb3Bkb3duLCAkc2F2ZUFjdGlvbik7XG5cbiAgICAgICAgICAgICAgICAkdGFibGVSb3cuZmluZCgndGQuZWRpdGFibGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCdpbnB1dDp0ZXh0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ21hbnVmYWN0dXJlcicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9ICQodGhpcykucGFyZW50cygndHInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0RhdGEgPSAkdGhpcy5EYXRhVGFibGUoKS5yb3cocm93SW5kZXgpLmRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSByb3dEYXRhLkRUX1Jvd0RhdGEub3B0aW9uLm1hbnVmYWN0dXJlcjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCArPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgPG9wdGlvbiB2YWx1ZT1cIiR7b3B0aW9uLmlkfVwiICR7cm93RGF0YS5tYW51ZmFjdHVyZXIgPT0gb3B0aW9uLnZhbHVlID8gJ3NlbGVjdGVkJyA6ICcnfT5cblx0XHRcdFx0XHRcdFx0JHtvcHRpb24udmFsdWV9XG5cdFx0XHRcdFx0XHQ8L29wdGlvbj5gO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj4ke2h0bWx9PC9zZWxlY3Q+YDtcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHZhbHVlPVwiYCArIHRoaXMuaW5uZXJUZXh0LnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgYFwiIC8+YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGFibGUgcm93IGNoZWNrYm94IGNoYW5nZSBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uVGFibGVSb3dDaGVja2JveENoYW5nZSgpIHtcbiAgICAgICAgICAgIGNvbnN0ICRidWxrQWN0aW9uRHJvcGRvd25CdXR0b25zID0gJHRoaXMucGFyZW50cygnLnF1aWNrLWVkaXQub3ZlcnZpZXcnKVxuICAgICAgICAgICAgICAgIC5maW5kKCcub3ZlcnZpZXctYnVsay1hY3Rpb24gPiBidXR0b24nKTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcblxuICAgICAgICAgICAgaWYgKCR0aGlzLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQub3ZlcnZpZXctcm93LXNlbGVjdGlvbicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkYnVsa0FjdGlvbkRyb3Bkb3duQnV0dG9ucy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGJ1bGtBY3Rpb25Ecm9wZG93bkJ1dHRvbnMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkYnVsa0FjdGlvbnNEcm9wZG93biA9ICQoJy5vdmVydmlldy1idWxrLWFjdGlvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRidWxrU2F2ZUFjdGlvbiA9ICRidWxrQWN0aW9uc0Ryb3Bkb3duLmZpbmQoJy5zYXZlLWJ1bGstcm93LWVkaXRzJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoISRidWxrU2F2ZUFjdGlvbi5oYXNDbGFzcygnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGJ1bGtFZGl0QWN0aW9uID0gJGJ1bGtBY3Rpb25zRHJvcGRvd24uZmluZCgnLmJ1bGstcm93LWVkaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgJGJ1bGtFZGl0QWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJGJ1bGtTYXZlQWN0aW9uLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLnNldERlZmF1bHRBY3Rpb24oJGJ1bGtBY3Rpb25zRHJvcGRvd24sICRidWxrRWRpdEFjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoISQodGhpcykucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgX3Jlc29sdmVSb3dDaGFuZ2VzKCQodGhpcykucGFyZW50cygndHInKSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkcm93QWN0aW9uc0Ryb3Bkb3duID0gJHRhYmxlUm93LmZpbmQoJy5idG4tZ3JvdXAuZHJvcGRvd24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkc2F2ZUFjdGlvbiA9ICRyb3dBY3Rpb25zRHJvcGRvd24uZmluZCgnLnNhdmUtcm93LWVkaXRzJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoISRzYXZlQWN0aW9uLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkZWRpdEFjdGlvbiA9ICR0YWJsZVJvdy5maW5kKCcucm93LWVkaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgJGVkaXRBY3Rpb24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkc2F2ZUFjdGlvbi5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5zZXREZWZhdWx0QWN0aW9uKCRyb3dBY3Rpb25zRHJvcGRvd24sICRlZGl0QWN0aW9uLmxhc3QoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFBhZ2UgbW9kZSBjaGFuZ2UgYmV0d2VlbiBcImVkaXRcIiBhbmQgXCJmaWx0ZXJpbmdcIi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblBhZ2VNb2RlQ2hhbmdlKCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT0gJ2VkaXQtbW9kZScpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5maWx0ZXInKS5hdHRyKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5lZGl0JykuYXR0cignaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIHRyOmZpcnN0LWNoaWxkIHRoJykuYWRkQ2xhc3MoJ2VkaXQtbW9kZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5maWx0ZXInKS5hdHRyKCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndHIuZWRpdCcpLmF0dHIoJ2hpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIHRyOmZpcnN0LWNoaWxkIHRoJykucmVtb3ZlQ2xhc3MoJ2VkaXQtbW9kZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbmNlbCBkYXRhIG1vZGlmaWNhdGlvbnMgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkNhbmNlbENsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgJHBhZ2VNb2RlID0gJCh0aGlzKS5jbG9zZXN0KCd0aGVhZCcpLmZpbmQoJy5zZWxlY3QtcGFnZS1tb2RlJyk7XG4gICAgICAgICAgICBjb25zdCAkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMgPSAkdGhpcy5maW5kKCdpbnB1dDpjaGVja2JveDpjaGVja2VkLm92ZXJ2aWV3LXJvdy1zZWxlY3Rpb24nKTtcblxuICAgICAgICAgICAgaWYgKCRwYWdlTW9kZS52YWwoKSA9PSAnZWRpdC1tb2RlJykge1xuICAgICAgICAgICAgICAgICRwYWdlTW9kZS52YWwoJ2ZpbHRlci1tb2RlJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHBhZ2VNb2RlLnZhbCgnZWRpdC1tb2RlJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsICEkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJykpXG4gICAgICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgICAgICAgICAgIF9yZXNvbHZlUm93Q2hhbmdlcygkKHRoaXMpLnBhcmVudHMoJ3RyJykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF9vblBhZ2VNb2RlQ2hhbmdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzdG9yZXMgYWxsIHRoZSByb3cgZGF0YSBjaGFuZ2VzIGJhY2sgdG8gdGhlaXIgb3JpZ2luYWwgc3RhdGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSAkcm93IEN1cnJlbnQgcm93IHNlbGVjdG9yLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3Jlc29sdmVSb3dDaGFuZ2VzKCRyb3cpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkucm93KCRyb3cpLmluZGV4KCk7XG5cbiAgICAgICAgICAgICRyb3cuZmluZCgnaW5wdXQ6dGV4dCwgc2VsZWN0Jykubm90KCcuc2VsZWN0LXRheCwgLnNlbGVjdC1zaGlwcGluZy10aW1lJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJGNlbGwgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RkJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uSW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oJGNlbGwpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmlubmVySFRNTCA9ICR0aGlzLkRhdGFUYWJsZSgpLmNlbGwocm93SW5kZXgsIGNvbHVtbkluZGV4KS5kYXRhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUYWJsZSByb3cgZGF0YSBjaGFuZ2UgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICpcbiAgICAgICAgICogSXQncyBiZWluZyB0cmlnZ2VyZWQgZXZlcnkgdGltZSBhIHJvdyBpbnB1dC9zZWxlY3QgZmllbGQgaXMgY2hhbmdlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93RGF0YUNoYW5nZSgpIHtcbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJyk7XG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLnJvdygkcm93KS5pbmRleCgpO1xuXG4gICAgICAgICAgICAkcm93LmZpbmQoJ2lucHV0OnRleHQsIHNlbGVjdCcpLm5vdCgnLnNlbGVjdC10YXgsIC5zZWxlY3Qtc2hpcHBpbmctdGltZScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjZWxsID0gJCh0aGlzKS5jbG9zZXN0KCd0ZCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKCRjZWxsKS5pbmRleCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKSAhPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ21vZGlmaWVkJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdtb2RpZmllZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVGFibGUgcm93IHN3aXRjaGVyIGNoYW5nZSBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzd2l0Y2hlciBDdXJyZW50IHN3aXRjaGVyIGVsZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd1N3aXRjaGVyQ2hhbmdlKCkge1xuICAgICAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRPdmVydmlld0FqYXgvVXBkYXRlJztcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3QgJGNlbGwgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RkJyk7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbigkY2VsbCkuaW5kZXgoKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkdGhpcy5maW5kKCd0ci5maWx0ZXIgdGgnKS5lcShjb2x1bW5JbmRleCkuZGF0YSgnY29sdW1uTmFtZScpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB7fTtcblxuICAgICAgICAgICAgdmFsdWVbY29sdW1uTmFtZV0gPSAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSA/IDEgOiAwO1xuICAgICAgICAgICAgZGF0YVtwcm9kdWN0SWRdID0gdmFsdWU7XG5cbiAgICAgICAgICAgICQucG9zdCh1cmwsIHtcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyksXG4gICAgICAgICAgICB9KS5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gJC5wYXJzZUpTT04ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnU1VDQ0VTU19QUk9EVUNUX1VQREFURUQnLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3cgc3VjY2VzcyBtZXNzYWdlIGluIHRoZSBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01PREFMX1RJVExFX05PREUnLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRURJVF9FUlJPUicsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fQ0xPU0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGV2ZW50ID0+ICQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBpbnZlbnRvcnkgbGlzdCBjbGljayBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgYW4gaW52ZW50b3J5IGxpc3QgUERGIGZyb20gdGhlIHNlbGVjdGVkIHJvd3Mgb3IgZnJvbSBhbGwgdGhlIHJlY29yZHMgaWYgbm8gcm93IGlzIHNlbGVjdGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQ3JlYXRlSW52ZW50b3J5TGlzdENsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZC5vdmVydmlldy1yb3ctc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCAkbW9kYWwgPSAkdGhpcy5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpLmZpbmQoJ2Rpdi5kb3dubG9hZHMnKTtcbiAgICAgICAgICAgIGNvbnN0ICRkb3dubG9hZCA9ICRtb2RhbC5maW5kKCdidXR0b24uZG93bmxvYWQtYnV0dG9uJyk7XG4gICAgICAgICAgICBjb25zdCBnZW5lcmF0ZVVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpXG4gICAgICAgICAgICAgICAgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRPdmVydmlld0FqYXgvQ3JlYXRlSW52ZW50b3J5RmlsZSc7XG4gICAgICAgICAgICBjb25zdCBkb3dubG9hZFVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpXG4gICAgICAgICAgICAgICAgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRPdmVydmlld0FqYXgvRG93bmxvYWRJbnZlbnRvcnlGaWxlJnBhZ2VUb2tlbj0nXG4gICAgICAgICAgICAgICAgKyBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RzSWQgPSBbXTtcblxuICAgICAgICAgICAgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCBpZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzSWQucHVzaChpZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBkYXRhOiAnaW52ZW50b3J5TGlzdCcsXG4gICAgICAgICAgICAgICAgcHJvZHVjdHM6IHByb2R1Y3RzSWQsXG4gICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5tb2RhbC1ib2R5JylcbiAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgIC5hcHBlbmQoYDxwPjxpIGNsYXNzPVwiZmEgZmEtY2xvY2stb1wiPjwvaT4gJHtqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9QTEVBU0VfV0FJVCcsICdhZG1pbl9xdWlja19lZGl0Jyl9Li4uPC9wPmApO1xuXG4gICAgICAgICAgICAkLnBvc3QoZ2VuZXJhdGVVcmwsIGRhdGEpLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRkb2N1bWVudFRhcmdldCA9IGA8YSBocmVmPVwiJHtkb3dubG9hZFVybH1cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBkb3dubG9hZC1idXR0b25cIiB0YXJnZXQ9XCJfYmxhbmtcIj4ke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fRE9XTkxPQUQnLCAnYWRtaW5fcXVpY2tfZWRpdCcpfTwvYT5gO1xuXG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcubW9kYWwtYm9keScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuaHRtbChgPHA+PGkgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvaT4gJHtqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9SRUFEWV9UT19ET1dOTE9BRF9ET0NVTUVOVCcsICdhZG1pbl9xdWlja19lZGl0Jyl9Li4uPC9wPmApO1xuXG4gICAgICAgICAgICAgICAgICAgICRkb3dubG9hZC5yZXBsYWNlV2l0aCgkZG9jdW1lbnRUYXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmRvd25sb2FkLWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRtb2RhbC5vbignaGlkZGVuLmJzLm1vZGFsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRkb3dubG9hZCA9ICRtb2RhbC5maW5kKCdhLmRvd25sb2FkLWJ1dHRvbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRkb3dubG9hZEJ1dHRvbiA9IGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBkb3dubG9hZC1idXR0b25cIiBkaXNhYmxlZD4ke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fRE9XTkxPQUQnLCAnYWRtaW5fcXVpY2tfZWRpdCcpfTwvYnV0dG9uPmA7XG5cbiAgICAgICAgICAgICAgICAkZG93bmxvYWQucmVwbGFjZVdpdGgoJGRvd25sb2FkQnV0dG9uKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheSBncmFkdWF0ZWQgcHJpY2VzIG1hbmFnZW1lbnQgbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIE5vdGU6IEN1cnJlbnQgcHJvZHVjdCBJRCBtdXN0IGJlIHNldCBhcyBhIGRhdGEgXCJwcm9kdWN0SWRcIiB2YWx1ZSBpbiB0aGUgbW9kYWwgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd0dyYWR1YXRlZFByaWNlc0NsaWNrKCkge1xuICAgICAgICAgICAgJCgnLmdyYWR1YXRlZC1wcmljZXMubW9kYWwnKVxuICAgICAgICAgICAgICAgIC5kYXRhKCdwcm9kdWN0SWQnLCAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKSlcbiAgICAgICAgICAgICAgICAubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICd0Ym9keSB0cicsIF9vblRhYmxlUm93Q2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcucm93LWVkaXQnLCBfb25UYWJsZVJvd0VkaXRDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5zaG93LXByb2R1Y3QnLCBfb25UYWJsZVJvd1Nob3dDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5ncmFkdWF0ZWQtcHJpY2VzJywgX29uVGFibGVSb3dHcmFkdWF0ZWRQcmljZXNDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsICcub3ZlcnZpZXctYnVsay1zZWxlY3Rpb24nLCBfb25CdWxrU2VsZWN0aW9uQ2hhbmdlKVxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAndGJvZHkgdHIgaW5wdXQ6dGV4dCcsIF9vblRhYmxlUm93RGF0YUNoYW5nZSlcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsICd0Ym9keSB0ciBzZWxlY3QnLCBfb25UYWJsZVJvd0RhdGFDaGFuZ2UpO1xuXG4gICAgICAgICAgICAkdGhpcy5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnaW5wdXQ6Y2hlY2tib3gub3ZlcnZpZXctcm93LXNlbGVjdGlvbicsIF9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC1wYWdlLW1vZGUnLCBfb25QYWdlTW9kZUNoYW5nZSlcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5jYW5jZWwtZWRpdHMnLCBfb25DYW5jZWxDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4tZ3JvdXAgLmJ1bGstcm93LWVkaXQnLCBfb25UYWJsZUJ1bGtSb3dFZGl0Q2xpY2spO1xuXG4gICAgICAgICAgICAkKCdib2R5JylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5jcmVhdGUtaW52ZW50b3J5LWxpc3QnLCBfb25DcmVhdGVJbnZlbnRvcnlMaXN0Q2xpY2spO1xuXG4gICAgICAgICAgICAkdGhpcy5vbignZHJhdy5kdCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuY29udmVydC10by1zd2l0Y2hlcicpLm9uKCdjaGFuZ2UnLCBfb25UYWJsZVJvd1N3aXRjaGVyQ2hhbmdlKTtcbiAgICAgICAgICAgICAgICBfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG5cbiJdfQ==
