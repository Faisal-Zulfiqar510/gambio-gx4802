'use strict';

/* --------------------------------------------------------------
 events.js 2017-10-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Special Prices Table Events Controller
 *
 * Handles the events of the main QuickEdit table.
 */
gx.controllers.module('special_prices_events', ['modal', 'loading_spinner'], function (data) {

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

        $this.find('tbody input:checkbox.special-price-row-selection').single_checkbox('checked', $(this).prop('checked')).trigger('change');
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

        var $singleCheckbox = $(this).find('input:checkbox.special-price-row-selection');

        $singleCheckbox.prop('checked', !$(this).find('input:checkbox.special-price-row-selection').prop('checked')).trigger('change');
    }

    /**
     * Enables row editing mode.
     */
    function _onTableRowEditClick() {
        var $tableRow = $(this).parents('tr');
        var $singleCheckbox = $(this).parents('tr').find('input:checkbox.special-price-row-selection');

        var $rowActionsDropdown = $tableRow.find('.btn-group.dropdown');
        var $saveAction = $rowActionsDropdown.find('.save-special-price-edits');
        var $editAction = $tableRow.find('.row-special-price-edit');
        $editAction.addClass('hidden');
        $saveAction.removeClass('hidden');
        jse.libs.button_dropdown.setDefaultAction($rowActionsDropdown, $saveAction);

        $tableRow.find('td.editable').each(function () {
            if ($(this).find('input:text').length > 0) {
                return;
            }

            if ($(this).hasClass('date')) {
                this.innerHTML = '<input type="text" class="form-control datepicker" value="' + this.innerText + '" />';
            } else {
                this.innerHTML = '<input type="text" class="form-control" value="' + this.innerText + '" />';
            }
        });

        $singleCheckbox.prop('checked', !$(this).find('input:checkbox.special-price-row-selection').prop('checked')).trigger('change');

        $tableRow.find('.datepicker').datepicker({
            onSelect: _onTableRowDataChange,
            dateFormat: jse.core.config.get('languageCode') === 'de' ? 'dd.mm.yy' : 'mm.dd.yy'
        });
    }

    /**
     * Bulk row edit event handler.
     *
     * Enables the edit mode for the selected rows.
     */
    function _onTableBulkRowEditClick() {
        var $bulkEditAction = $(this);
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.special-price-row-selection');

        if ($checkedSingleCheckboxes.length) {
            var $bulkActionsDropdown = $('.special-price-bulk-action');
            var $bulkSaveAction = $bulkActionsDropdown.find('.save-special-price-bulk-row-edits');
            $bulkEditAction.addClass('hidden');
            $bulkSaveAction.removeClass('hidden');
            jse.libs.button_dropdown.setDefaultAction($bulkActionsDropdown, $bulkSaveAction);
        }

        $checkedSingleCheckboxes.each(function () {
            var $tableRow = $(this).parents('tr');
            var $rowActionDropdown = $tableRow.find('.btn-group.dropdown');
            var $saveAction = $rowActionDropdown.find('.save-special-price-edits');
            var $editAction = $rowActionDropdown.find('.row-special-price-edit');

            $editAction.addClass('hidden');
            $saveAction.removeClass('hidden');
            jse.libs.button_dropdown.setDefaultAction($rowActionDropdown, $saveAction);

            $tableRow.find('td.editable').each(function () {
                if ($(this).find('input:text').length > 0) {
                    return;
                }

                if ($(this).hasClass('date')) {
                    this.innerHTML = '<input type="text" class="form-control datepicker" value="' + this.innerText + '" />';
                } else {
                    this.innerHTML = '<input type="text" class="form-control" value="' + this.innerText + '" />';
                }
            });

            $tableRow.find('.datepicker').datepicker({
                onSelect: _onTableRowDataChange
            });
        });
    }

    /**
     * Table row checkbox change event handler.
     */
    function _onTableRowCheckboxChange() {
        var $bulkActionDropdownButtons = $this.parents('.special-prices.modal').find('.special-price-bulk-action > button');
        var $tableRow = $(this).parents('tr');

        if ($this.find('input:checkbox:checked.special-price-row-selection').length > 0) {
            $bulkActionDropdownButtons.removeClass('disabled');
        } else {
            $bulkActionDropdownButtons.addClass('disabled');

            var $bulkActionsDropdown = $('.special-price-bulk-action');
            var $bulkSaveAction = $bulkActionsDropdown.find('.save-special-price-bulk-row-edits');

            if (!$bulkSaveAction.hasClass('hidden')) {
                var $bulkEditAction = $bulkActionsDropdown.find('.special-price-bulk-row-edit');
                $bulkEditAction.removeClass('hidden');
                $bulkSaveAction.addClass('hidden');
                jse.libs.button_dropdown.setDefaultAction($bulkActionsDropdown, $bulkEditAction);
            }
        }

        $tableRow.find('p.values_price').each(function () {
            if ($(this).data('special-price-price-type') == 'fix') {
                $(this).parents('td').addClass('editable');
            }
        });

        if (!$(this).prop('checked')) {
            _resolveRowChanges($(this).parents('tr'));

            var $rowActionsDropdown = $tableRow.find('.btn-group.dropdown');
            var $saveAction = $rowActionsDropdown.find('.save-special-price-edits');

            if (!$saveAction.hasClass('hidden')) {
                var $editAction = $rowActionsDropdown.find('.row-special-price-edit');
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
            $this.find('tr.special-price-filter').attr('hidden', true);
            $this.find('tr.special-price-edit').attr('hidden', false);
            $this.find('thead tr:first-child th').addClass('edit-mode');
        } else {
            $this.find('tr.special-price-filter').attr('hidden', false);
            $this.find('tr.special-price-edit').attr('hidden', true);
            $this.find('thead tr:first-child th').removeClass('edit-mode');
        }
    }

    /**
     * Restores all the row data changes back to their original state.
     *
     * @param {jQuery.Event} $row Current row selector.
     */
    function _resolveRowChanges($row) {
        var rowIndex = $this.DataTable().row($row).index();

        $row.find('input:text').each(function () {
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
        var $row = $(this).parents('tr');
        var rowIndex = $this.DataTable().row($row).index();

        $row.find('input:text').each(function () {
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
    function _onTableRowSwitcherChange(switcher) {
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditSpecialPricesAjax/Update';
        var specialPrice = $(switcher).parents('tr').attr('id');
        var $cell = $(switcher).closest('td');
        var columnIndex = $this.DataTable().column($cell).index();
        var columnName = $this.find('tr.special-price-filter th').eq(columnIndex).data('columnName');
        var data = {};
        var value = {};

        value[columnName] = $(switcher).prop('checked') ? 1 : 0;
        data[specialPrice] = value;

        $.post(url, {
            data: data,
            pageToken: jse.core.config.get('pageToken')
        }).done(function (response) {
            if (typeof response === "string") {
                response = $.parseJSON(response);
            }

            if (response.success) {
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

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', 'tbody tr', _onTableRowClick).on('click', '.row-special-price-edit', _onTableRowEditClick).on('change', '.special-price-bulk-selection', _onBulkSelectionChange).on('keyup', 'tbody tr input:text', _onTableRowDataChange);

        $this.parents('.special-prices.modal').on('change', 'input:checkbox.special-price-row-selection', _onTableRowCheckboxChange).on('change', '.select-special-price-page-mode', _onPageModeChange).on('click', '.btn-group .special-price-bulk-row-edit', _onTableBulkRowEditClick);

        $this.on('draw.dt', function () {
            $this.find('.convert-to-switcher').each(function (index, switcher) {
                var skipInitialEvent = true;
                $(switcher).on('change', function () {
                    if (skipInitialEvent) {
                        skipInitialEvent = false;
                        return;
                    }

                    _onTableRowSwitcherChange(switcher);
                });
            });

            _onTableRowCheckboxChange();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3NwZWNpYWxfcHJpY2VzL3NwZWNpYWxfcHJpY2VzX2V2ZW50cy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIl9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UiLCJldmVudCIsInByb3BhZ2F0ZSIsImZpbmQiLCJzaW5nbGVfY2hlY2tib3giLCJwcm9wIiwidHJpZ2dlciIsIl9vblRhYmxlUm93Q2xpY2siLCJ0YXJnZXQiLCJpcyIsIiRzaW5nbGVDaGVja2JveCIsIl9vblRhYmxlUm93RWRpdENsaWNrIiwiJHRhYmxlUm93IiwicGFyZW50cyIsIiRyb3dBY3Rpb25zRHJvcGRvd24iLCIkc2F2ZUFjdGlvbiIsIiRlZGl0QWN0aW9uIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJzZXREZWZhdWx0QWN0aW9uIiwiZWFjaCIsImxlbmd0aCIsImhhc0NsYXNzIiwiaW5uZXJIVE1MIiwiaW5uZXJUZXh0IiwiZGF0ZXBpY2tlciIsIm9uU2VsZWN0IiwiX29uVGFibGVSb3dEYXRhQ2hhbmdlIiwiZGF0ZUZvcm1hdCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJfb25UYWJsZUJ1bGtSb3dFZGl0Q2xpY2siLCIkYnVsa0VkaXRBY3Rpb24iLCIkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMiLCIkYnVsa0FjdGlvbnNEcm9wZG93biIsIiRidWxrU2F2ZUFjdGlvbiIsIiRyb3dBY3Rpb25Ecm9wZG93biIsIl9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UiLCIkYnVsa0FjdGlvbkRyb3Bkb3duQnV0dG9ucyIsIl9yZXNvbHZlUm93Q2hhbmdlcyIsImxhc3QiLCJfb25QYWdlTW9kZUNoYW5nZSIsInZhbCIsImF0dHIiLCIkcm93Iiwicm93SW5kZXgiLCJEYXRhVGFibGUiLCJyb3ciLCJpbmRleCIsIiRjZWxsIiwiY2xvc2VzdCIsImNvbHVtbkluZGV4IiwiY29sdW1uIiwicGFyZW50RWxlbWVudCIsImNlbGwiLCJ0cmltIiwiX29uVGFibGVSb3dTd2l0Y2hlckNoYW5nZSIsInN3aXRjaGVyIiwidXJsIiwic3BlY2lhbFByaWNlIiwiY29sdW1uTmFtZSIsImVxIiwidmFsdWUiLCJwb3N0IiwicGFnZVRva2VuIiwiZG9uZSIsInJlc3BvbnNlIiwicGFyc2VKU09OIiwic3VjY2VzcyIsInRpdGxlIiwibGFuZyIsInRyYW5zbGF0ZSIsIm1lc3NhZ2UiLCJidXR0b25zIiwiY2FsbGJhY2siLCJjdXJyZW50VGFyZ2V0IiwibW9kYWwiLCJzaG93TWVzc2FnZSIsImluaXQiLCJvbiIsInNraXBJbml0aWFsRXZlbnQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQXNCLHVCQUF0QixFQUErQyxDQUFDLE9BQUQsRUFBVSxpQkFBVixDQUEvQyxFQUE2RSxVQUFVQyxJQUFWLEVBQWdCOztBQUV6Rjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVMsRUFBZjs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1BLGFBQVNJLHNCQUFULENBQWdDQyxLQUFoQyxFQUF5RDtBQUFBLFlBQWxCQyxTQUFrQix1RUFBTixJQUFNOztBQUNyRCxZQUFJQSxjQUFjLEtBQWxCLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBRURKLGNBQU1LLElBQU4sQ0FBVyxrREFBWCxFQUNLQyxlQURMLENBQ3FCLFNBRHJCLEVBQ2dDTCxFQUFFLElBQUYsRUFBUU0sSUFBUixDQUFhLFNBQWIsQ0FEaEMsRUFFS0MsT0FGTCxDQUVhLFFBRmI7QUFHSDs7QUFFRDs7Ozs7QUFLQSxhQUFTQyxnQkFBVCxDQUEwQk4sS0FBMUIsRUFBaUM7QUFDN0IsWUFBSSxDQUFDRixFQUFFRSxNQUFNTyxNQUFSLEVBQWdCQyxFQUFo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O0FBQ3RCckYsa0JBQU1LLElBQU4sQ0FBVyxzQkFBWCxFQUFtQ29CLElBQW5DLENBQXdDLFVBQUM2QixLQUFELEVBQVFTLFFBQVIsRUFBcUI7QUFDekQsb0JBQUl1QixtQkFBbUIsSUFBdkI7QUFDQXJGLGtCQUFFOEQsUUFBRixFQUFZc0IsRUFBWixDQUFlLFFBQWYsRUFBeUIsWUFBTTtBQUMzQix3QkFBSUMsZ0JBQUosRUFBc0I7QUFDbEJBLDJDQUFtQixLQUFuQjtBQUNBO0FBQ0g7O0FBRUR4Qiw4Q0FBMEJDLFFBQTFCO0FBQ0gsaUJBUEQ7QUFRSCxhQVZEOztBQVlBcEI7QUFDSCxTQWREOztBQWdCQTRCO0FBQ0gsS0E3QkQ7O0FBK0JBLFdBQU96RSxNQUFQO0FBQ0gsQ0FoVUQiLCJmaWxlIjoicXVpY2tfZWRpdC9tb2RhbHMvc3BlY2lhbF9wcmljZXMvc3BlY2lhbF9wcmljZXNfZXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBldmVudHMuanMgMjAxNy0xMC0xMFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogU3BlY2lhbCBQcmljZXMgVGFibGUgRXZlbnRzIENvbnRyb2xsZXJcbiAqXG4gKiBIYW5kbGVzIHRoZSBldmVudHMgb2YgdGhlIG1haW4gUXVpY2tFZGl0IHRhYmxlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoJ3NwZWNpYWxfcHJpY2VzX2V2ZW50cycsIFsnbW9kYWwnLCAnbG9hZGluZ19zcGlubmVyJ10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIEZVTkNUSU9OU1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICogQnVsayBzZWxlY3Rpb24gY2hhbmdlIGV2ZW50IGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcHJvcGFnYXRlID0gdHJ1ZV0gV2hldGhlciB0byBwcm9wYWdhdGUgdGhlIGV2ZW50IG9yIG5vdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25CdWxrU2VsZWN0aW9uQ2hhbmdlKGV2ZW50LCBwcm9wYWdhdGUgPSB0cnVlKSB7XG4gICAgICAgIGlmIChwcm9wYWdhdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBpbnB1dDpjaGVja2JveC5zcGVjaWFsLXByaWNlLXJvdy1zZWxlY3Rpb24nKVxuICAgICAgICAgICAgLnNpbmdsZV9jaGVja2JveCgnY2hlY2tlZCcsICQodGhpcykucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRhYmxlIHJvdyBjbGljayBldmVudCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgaWYgKCEkKGV2ZW50LnRhcmdldCkuaXMoJ3RkJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0ICRzaW5nbGVDaGVja2JveCA9ICQodGhpcykuZmluZCgnaW5wdXQ6Y2hlY2tib3guc3BlY2lhbC1wcmljZS1yb3ctc2VsZWN0aW9uJyk7XG5cbiAgICAgICAgJHNpbmdsZUNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLCAhJCh0aGlzKVxuICAgICAgICAgICAgLmZpbmQoJ2lucHV0OmNoZWNrYm94LnNwZWNpYWwtcHJpY2Utcm93LXNlbGVjdGlvbicpXG4gICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuYWJsZXMgcm93IGVkaXRpbmcgbW9kZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25UYWJsZVJvd0VkaXRDbGljaygpIHtcbiAgICAgICAgY29uc3QgJHRhYmxlUm93ID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpO1xuICAgICAgICBjb25zdCAkc2luZ2xlQ2hlY2tib3ggPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZmluZCgnaW5wdXQ6Y2hlY2tib3guc3BlY2lhbC1wcmljZS1yb3ctc2VsZWN0aW9uJyk7XG5cbiAgICAgICAgY29uc3QgJHJvd0FjdGlvbnNEcm9wZG93biA9ICR0YWJsZVJvdy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJyk7XG4gICAgICAgIGNvbnN0ICRzYXZlQWN0aW9uID0gJHJvd0FjdGlvbnNEcm9wZG93bi5maW5kKCcuc2F2ZS1zcGVjaWFsLXByaWNlLWVkaXRzJyk7XG4gICAgICAgIGNvbnN0ICRlZGl0QWN0aW9uID0gJHRhYmxlUm93LmZpbmQoJy5yb3ctc3BlY2lhbC1wcmljZS1lZGl0Jyk7XG4gICAgICAgICRlZGl0QWN0aW9uLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgJHNhdmVBY3Rpb24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uc2V0RGVmYXVsdEFjdGlvbigkcm93QWN0aW9uc0Ryb3Bkb3duLCAkc2F2ZUFjdGlvbik7XG5cbiAgICAgICAgJHRhYmxlUm93LmZpbmQoJ3RkLmVkaXRhYmxlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCdpbnB1dDp0ZXh0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2RhdGUnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGRhdGVwaWNrZXJcIiB2YWx1ZT1cIiR7dGhpcy5pbm5lclRleHR9XCIgLz5gO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9IGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHZhbHVlPVwiJHt0aGlzLmlubmVyVGV4dH1cIiAvPmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRzaW5nbGVDaGVja2JveC5wcm9wKCdjaGVja2VkJywgISQodGhpcylcbiAgICAgICAgICAgIC5maW5kKCdpbnB1dDpjaGVja2JveC5zcGVjaWFsLXByaWNlLXJvdy1zZWxlY3Rpb24nKVxuICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgICAkdGFibGVSb3cuZmluZCgnLmRhdGVwaWNrZXInKS5kYXRlcGlja2VyKHtcbiAgICAgICAgICAgIG9uU2VsZWN0OiBfb25UYWJsZVJvd0RhdGFDaGFuZ2UsXG4gICAgICAgICAgICBkYXRlRm9ybWF0OiBqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSA9PT0gJ2RlJyA/ICdkZC5tbS55eScgOiAnbW0uZGQueXknXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1bGsgcm93IGVkaXQgZXZlbnQgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIEVuYWJsZXMgdGhlIGVkaXQgbW9kZSBmb3IgdGhlIHNlbGVjdGVkIHJvd3MuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uVGFibGVCdWxrUm93RWRpdENsaWNrKCkge1xuICAgICAgICBjb25zdCAkYnVsa0VkaXRBY3Rpb24gPSAkKHRoaXMpO1xuICAgICAgICBjb25zdCAkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMgPSAkdGhpcy5maW5kKCdpbnB1dDpjaGVja2JveDpjaGVja2VkLnNwZWNpYWwtcHJpY2Utcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgIGlmICgkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCAkYnVsa0FjdGlvbnNEcm9wZG93biA9ICQoJy5zcGVjaWFsLXByaWNlLWJ1bGstYWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCAkYnVsa1NhdmVBY3Rpb24gPSAkYnVsa0FjdGlvbnNEcm9wZG93bi5maW5kKCcuc2F2ZS1zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXRzJyk7XG4gICAgICAgICAgICAkYnVsa0VkaXRBY3Rpb24uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJGJ1bGtTYXZlQWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5zZXREZWZhdWx0QWN0aW9uKCRidWxrQWN0aW9uc0Ryb3Bkb3duLCAkYnVsa1NhdmVBY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgJHRhYmxlUm93ID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpO1xuICAgICAgICAgICAgY29uc3QgJHJvd0FjdGlvbkRyb3Bkb3duID0gJHRhYmxlUm93LmZpbmQoJy5idG4tZ3JvdXAuZHJvcGRvd24nKTtcbiAgICAgICAgICAgIGNvbnN0ICRzYXZlQWN0aW9uID0gJHJvd0FjdGlvbkRyb3Bkb3duLmZpbmQoJy5zYXZlLXNwZWNpYWwtcHJpY2UtZWRpdHMnKTtcbiAgICAgICAgICAgIGNvbnN0ICRlZGl0QWN0aW9uID0gJHJvd0FjdGlvbkRyb3Bkb3duLmZpbmQoJy5yb3ctc3BlY2lhbC1wcmljZS1lZGl0Jyk7XG5cbiAgICAgICAgICAgICRlZGl0QWN0aW9uLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICRzYXZlQWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5zZXREZWZhdWx0QWN0aW9uKCRyb3dBY3Rpb25Ecm9wZG93biwgJHNhdmVBY3Rpb24pO1xuXG4gICAgICAgICAgICAkdGFibGVSb3cuZmluZCgndGQuZWRpdGFibGUnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCdpbnB1dDp0ZXh0JykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2RhdGUnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9IGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBkYXRlcGlja2VyXCIgdmFsdWU9XCIke3RoaXMuaW5uZXJUZXh0fVwiIC8+YDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubmVySFRNTCA9IGA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHZhbHVlPVwiJHt0aGlzLmlubmVyVGV4dH1cIiAvPmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0YWJsZVJvdy5maW5kKCcuZGF0ZXBpY2tlcicpLmRhdGVwaWNrZXIoe1xuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBfb25UYWJsZVJvd0RhdGFDaGFuZ2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWJsZSByb3cgY2hlY2tib3ggY2hhbmdlIGV2ZW50IGhhbmRsZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uVGFibGVSb3dDaGVja2JveENoYW5nZSgpIHtcbiAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25Ecm9wZG93bkJ1dHRvbnMgPSAkdGhpcy5wYXJlbnRzKCcuc3BlY2lhbC1wcmljZXMubW9kYWwnKVxuICAgICAgICAgICAgLmZpbmQoJy5zcGVjaWFsLXByaWNlLWJ1bGstYWN0aW9uID4gYnV0dG9uJyk7XG4gICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcblxuICAgICAgICBpZiAoJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZC5zcGVjaWFsLXByaWNlLXJvdy1zZWxlY3Rpb24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkYnVsa0FjdGlvbkRyb3Bkb3duQnV0dG9ucy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRidWxrQWN0aW9uRHJvcGRvd25CdXR0b25zLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICBjb25zdCAkYnVsa0FjdGlvbnNEcm9wZG93biA9ICQoJy5zcGVjaWFsLXByaWNlLWJ1bGstYWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCAkYnVsa1NhdmVBY3Rpb24gPSAkYnVsa0FjdGlvbnNEcm9wZG93bi5maW5kKCcuc2F2ZS1zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXRzJyk7XG5cbiAgICAgICAgICAgIGlmICghJGJ1bGtTYXZlQWN0aW9uLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRidWxrRWRpdEFjdGlvbiA9ICRidWxrQWN0aW9uc0Ryb3Bkb3duLmZpbmQoJy5zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXQnKTtcbiAgICAgICAgICAgICAgICAkYnVsa0VkaXRBY3Rpb24ucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICRidWxrU2F2ZUFjdGlvbi5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLnNldERlZmF1bHRBY3Rpb24oJGJ1bGtBY3Rpb25zRHJvcGRvd24sICRidWxrRWRpdEFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkdGFibGVSb3cuZmluZCgncC52YWx1ZXNfcHJpY2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3NwZWNpYWwtcHJpY2UtcHJpY2UtdHlwZScpID09ICdmaXgnKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0ZCcpLmFkZENsYXNzKCdlZGl0YWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoISQodGhpcykucHJvcCgnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICBfcmVzb2x2ZVJvd0NoYW5nZXMoJCh0aGlzKS5wYXJlbnRzKCd0cicpKTtcblxuICAgICAgICAgICAgY29uc3QgJHJvd0FjdGlvbnNEcm9wZG93biA9ICR0YWJsZVJvdy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJyk7XG4gICAgICAgICAgICBjb25zdCAkc2F2ZUFjdGlvbiA9ICRyb3dBY3Rpb25zRHJvcGRvd24uZmluZCgnLnNhdmUtc3BlY2lhbC1wcmljZS1lZGl0cycpO1xuXG4gICAgICAgICAgICBpZiAoISRzYXZlQWN0aW9uLmhhc0NsYXNzKCdoaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRlZGl0QWN0aW9uID0gJHJvd0FjdGlvbnNEcm9wZG93bi5maW5kKCcucm93LXNwZWNpYWwtcHJpY2UtZWRpdCcpO1xuICAgICAgICAgICAgICAgICRlZGl0QWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkc2F2ZUFjdGlvbi5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLnNldERlZmF1bHRBY3Rpb24oJHJvd0FjdGlvbnNEcm9wZG93biwgJGVkaXRBY3Rpb24ubGFzdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhZ2UgbW9kZSBjaGFuZ2UgYmV0d2VlbiBcImVkaXRcIiBhbmQgXCJmaWx0ZXJpbmdcIi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25QYWdlTW9kZUNoYW5nZSgpIHtcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT0gJ2VkaXQtbW9kZScpIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RyLnNwZWNpYWwtcHJpY2UtZmlsdGVyJykuYXR0cignaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5zcGVjaWFsLXByaWNlLWVkaXQnKS5hdHRyKCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZCB0cjpmaXJzdC1jaGlsZCB0aCcpLmFkZENsYXNzKCdlZGl0LW1vZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RyLnNwZWNpYWwtcHJpY2UtZmlsdGVyJykuYXR0cignaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgJHRoaXMuZmluZCgndHIuc3BlY2lhbC1wcmljZS1lZGl0JykuYXR0cignaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZCB0cjpmaXJzdC1jaGlsZCB0aCcpLnJlbW92ZUNsYXNzKCdlZGl0LW1vZGUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmVzIGFsbCB0aGUgcm93IGRhdGEgY2hhbmdlcyBiYWNrIHRvIHRoZWlyIG9yaWdpbmFsIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9ICRyb3cgQ3VycmVudCByb3cgc2VsZWN0b3IuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Jlc29sdmVSb3dDaGFuZ2VzKCRyb3cpIHtcbiAgICAgICAgY29uc3Qgcm93SW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5yb3coJHJvdykuaW5kZXgoKTtcblxuICAgICAgICAkcm93LmZpbmQoJ2lucHV0OnRleHQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0ICRjZWxsID0gJCh0aGlzKS5jbG9zZXN0KCd0ZCcpO1xuICAgICAgICAgICAgY29uc3QgY29sdW1uSW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oJGNlbGwpLmluZGV4KCk7XG5cbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbm5lckhUTUwgPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWJsZSByb3cgZGF0YSBjaGFuZ2UgZXZlbnQgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIEl0J3MgYmVpbmcgdHJpZ2dlcmVkIGV2ZXJ5IHRpbWUgYSByb3cgaW5wdXQvc2VsZWN0IGZpZWxkIGlzIGNoYW5nZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uVGFibGVSb3dEYXRhQ2hhbmdlKCkge1xuICAgICAgICBjb25zdCAkcm93ID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpO1xuICAgICAgICBjb25zdCByb3dJbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLnJvdygkcm93KS5pbmRleCgpO1xuXG4gICAgICAgICRyb3cuZmluZCgnaW5wdXQ6dGV4dCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgJGNlbGwgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RkJyk7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbigkY2VsbCkuaW5kZXgoKTtcblxuICAgICAgICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKSAhPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnbW9kaWZpZWQnKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnbW9kaWZpZWQnKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGFibGUgcm93IHN3aXRjaGVyIGNoYW5nZSBldmVudCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3dpdGNoZXIgQ3VycmVudCBzd2l0Y2hlciBlbGVtZW50LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93U3dpdGNoZXJDaGFuZ2Uoc3dpdGNoZXIpIHtcbiAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRTcGVjaWFsUHJpY2VzQWpheC9VcGRhdGUnO1xuICAgICAgICBjb25zdCBzcGVjaWFsUHJpY2UgPSAkKHN3aXRjaGVyKS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJyk7XG4gICAgICAgIGNvbnN0ICRjZWxsID0gJChzd2l0Y2hlcikuY2xvc2VzdCgndGQnKTtcbiAgICAgICAgY29uc3QgY29sdW1uSW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oJGNlbGwpLmluZGV4KCk7XG4gICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkdGhpcy5maW5kKCd0ci5zcGVjaWFsLXByaWNlLWZpbHRlciB0aCcpLmVxKGNvbHVtbkluZGV4KS5kYXRhKCdjb2x1bW5OYW1lJyk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB7fTtcblxuICAgICAgICB2YWx1ZVtjb2x1bW5OYW1lXSA9ICQoc3dpdGNoZXIpLnByb3AoJ2NoZWNrZWQnKSA/IDEgOiAwO1xuICAgICAgICBkYXRhW3NwZWNpYWxQcmljZV0gPSB2YWx1ZTtcblxuICAgICAgICAkLnBvc3QodXJsLCB7XG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKSxcbiAgICAgICAgfSkuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSAkLnBhcnNlSlNPTihyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNT0RBTF9USVRMRV9OT0RFJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRURJVF9FUlJPUicsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICBjb25zdCBidXR0b25zID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fQ0xPU0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZXZlbnQgPT4gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UsIGJ1dHRvbnMpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9uKCdjbGljaycsICd0Ym9keSB0cicsIF9vblRhYmxlUm93Q2xpY2spXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5yb3ctc3BlY2lhbC1wcmljZS1lZGl0JywgX29uVGFibGVSb3dFZGl0Q2xpY2spXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsICcuc3BlY2lhbC1wcmljZS1idWxrLXNlbGVjdGlvbicsIF9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAub24oJ2tleXVwJywgJ3Rib2R5IHRyIGlucHV0OnRleHQnLCBfb25UYWJsZVJvd0RhdGFDaGFuZ2UpO1xuXG4gICAgICAgICR0aGlzLnBhcmVudHMoJy5zcGVjaWFsLXByaWNlcy5tb2RhbCcpXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsICdpbnB1dDpjaGVja2JveC5zcGVjaWFsLXByaWNlLXJvdy1zZWxlY3Rpb24nLCBfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC1zcGVjaWFsLXByaWNlLXBhZ2UtbW9kZScsIF9vblBhZ2VNb2RlQ2hhbmdlKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYnRuLWdyb3VwIC5zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXQnLCBfb25UYWJsZUJ1bGtSb3dFZGl0Q2xpY2spO1xuXG4gICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgKCkgPT4ge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmNvbnZlcnQtdG8tc3dpdGNoZXInKS5lYWNoKChpbmRleCwgc3dpdGNoZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc2tpcEluaXRpYWxFdmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgJChzd2l0Y2hlcikub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNraXBJbml0aWFsRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNraXBJbml0aWFsRXZlbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF9vblRhYmxlUm93U3dpdGNoZXJDaGFuZ2Uoc3dpdGNoZXIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xufSk7XG5cbiJdfQ==
