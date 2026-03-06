'use strict';

/* --------------------------------------------------------------
 events.js 2016-10-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Properties Table Events Controller
 *
 * Handles the events of the properties table.
 */
gx.controllers.module('properties_events', ['loading_spinner', gx.source + '/libs/button_dropdown'], function (data) {

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

        $this.find('tbody input:checkbox.properties-row-selection').single_checkbox('checked', $(this).prop('checked')).trigger('change');
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

        var $singleCheckbox = $(this).find('input:checkbox.properties-row-selection');

        $singleCheckbox.prop('checked', !$(this).find('input:checkbox.properties-row-selection').prop('checked')).trigger('change');
    }

    /**
     * Enables row editing mode.
     */
    function _onTableRowEditClick() {
        var $tableRow = $(this).parents('tr');
        var $singleCheckbox = $(this).parents('tr').find('input:checkbox.properties-row-selection');

        $tableRow.find('td.editable').each(function () {
            if ($(this).find('input:text').length > 0) {
                return;
            }

            if ($(this).find('p.values_price').length > 0) {
                $(this).find('p.values_price').each(function () {
                    var html = '<input data-properties-price-type="' + $(this).data('properties-price-type') + '"\n\t\t\t\t\t\t\t\t\t   type="text" \n\t\t\t\t\t\t\t\t\t   class="form-control values-price" \n\t\t\t\t\t\t\t\t\t   value="' + this.innerText + '" />';

                    $(this).replaceWith(html);
                });
            } else {
                this.innerHTML = '<input type="text" class="form-control" value="' + this.innerText + '" />';
            }
        });

        $singleCheckbox.prop('checked', !$(this).find('input:checkbox.properties-row-selection').prop('checked')).trigger('change');

        var $rowActionsDropdown = $tableRow.find('.dropdown');
        var $editAction = $(this);
        var $saveAction = $rowActionsDropdown.find('.save-properties-edits');
        $editAction.addClass('hidden');
        $saveAction.removeClass('hidden');
        jse.libs.button_dropdown.setDefaultAction($rowActionsDropdown, $saveAction);
    }

    /**
     * Bulk row edit event handler.
     *
     * Enables the edit mode for the selected rows.
     */
    function _onTableBulkRowEditClick() {
        var $bulkEditAction = $(this);
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.properties-row-selection');

        if ($checkedSingleCheckboxes.length) {
            var $bulkActionsDropdown = $('.properties-bulk-action');
            var $bulkSaveAction = $bulkActionsDropdown.find('.save-properties-bulk-row-edits');
            $bulkEditAction.addClass('hidden');
            $bulkSaveAction.removeClass('hidden');
            jse.libs.button_dropdown.setDefaultAction($bulkActionsDropdown, $bulkSaveAction);
        }

        $checkedSingleCheckboxes.each(function () {
            var $tableRow = $(this).parents('tr');
            var $rowActionDropdown = $tableRow.find('.btn-group.dropdown');
            var $saveAction = $rowActionDropdown.find('.save-properties-edits');
            var $editAction = $rowActionDropdown.find('.row-properties-edit');

            $editAction.addClass('hidden');
            $saveAction.removeClass('hidden');
            jse.libs.button_dropdown.setDefaultAction($rowActionDropdown, $saveAction);

            $tableRow.find('td.editable').each(function () {
                if ($(this).find('input:text').length > 0) {
                    return;
                }

                if ($(this).find('p.values_price').length > 0) {
                    $(this).find('p.values_price').each(function () {
                        var html = '<input data-properties-price-type="' + $(this).data('properties-price-type') + '"\n\t\t\t\t\t\t\t\t\t\t   type="text" \n\t\t\t\t\t\t\t\t\t\t   class="form-control values-price" \n\t\t\t\t\t\t\t\t\t\t   value="' + $(this).context.innerText + '" />';

                        $(this).replaceWith(html);
                    });
                } else {
                    this.innerHTML = '<input type="text" class="form-control" value="' + this.innerText + '" />';
                }
            });
        });
    }

    /**
     * Table row checkbox change event handler.
     */
    function _onTableRowCheckboxChange() {
        var $bulkActionDropdownButtons = $this.parents('.properties.modal').find('.properties-bulk-action > button');
        var $tableRow = $(this).parents('tr');

        if ($this.find('input:checkbox:checked.properties-row-selection').length > 0) {
            $bulkActionDropdownButtons.removeClass('disabled');
        } else {
            $bulkActionDropdownButtons.addClass('disabled');

            var $bulkActionsDropdown = $('.properties-bulk-action');
            var $bulkSaveAction = $bulkActionsDropdown.find('.save-properties-bulk-row-edits');

            if (!$bulkSaveAction.hasClass('hidden')) {
                var $bulkEditAction = $bulkActionsDropdown.find('.properties-bulk-row-edit');
                $bulkEditAction.removeClass('hidden');
                $bulkSaveAction.addClass('hidden');
                jse.libs.button_dropdown.setDefaultAction($bulkActionsDropdown, $bulkEditAction);
            }
        }

        $(this).parents('tr').find('p.values_price').each(function () {
            if ($(this).data('properties-price-type') == 'fix') {
                $(this).parents('td').addClass('editable');
            }
        });

        if (!$(this).prop('checked')) {
            _resolveRowChanges($(this).parents('tr'));

            var $rowActionsDropdown = $tableRow.find('.btn-group.dropdown');
            var $saveAction = $rowActionsDropdown.find('.save-properties-edits');

            if (!$saveAction.hasClass('hidden')) {
                var $editAction = $tableRow.find('.row-properties-edit');
                $editAction.removeClass('hidden');
                $saveAction.addClass('hidden');
                jse.libs.button_dropdown.setDefaultAction($rowActionsDropdown, $editAction.last());
            }
        }
    }

    /**
     * Cancel data modifications event handler.
     */
    function _onCancelClick() {
        var $pageMode = $(this).closest('thead').find('.select-properties-page-mode');
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.properties-row-selection');

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
     * Page mode change between "edit" and "filtering".
     */
    function _onPageModeChange() {
        if ($(this).val() == 'edit-mode') {
            $this.find('tr.properties-filter').attr('hidden', true);
            $this.find('tr.properties-edit').attr('hidden', false);
            $this.find('thead tr:first-child th').addClass('edit-mode');
        } else {
            $this.find('tr.properties-filter').attr('hidden', false);
            $this.find('tr.properties-edit').attr('hidden', true);
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

        $row.find('input:text:not(.values-price)').each(function () {
            var $cell = $(this).closest('td');
            var columnIndex = $this.DataTable().column($cell).index();

            this.parentElement.innerHTML = $this.DataTable().cell(rowIndex, columnIndex).data();
        });

        $row.find('input:text.values-price').each(function () {
            var $cell = $(this).closest('td');
            var columnIndex = $this.DataTable().column($cell).index();
            var cellData = $this.DataTable().cell(rowIndex, columnIndex).data();

            var html = '<div class="col-lg-12">\n\t\t\t\t\t\t\t<label class="control-label">' + cellData.values_name + '</label>\n\t\t\t\t\t\t\t<p data-properties-price-type="' + $(this).data('properties-price-type') + '"\n\t\t\t\t\t\t\t   class="form-control-static values_price">' + cellData.values_price + '</p>\n\t\t\t\t\t\t</div>';

            $(this).closest('div.form-group').replaceWith('<div class="form-group">' + html + '</div>');
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

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', 'tbody tr', _onTableRowClick).on('click', '.row-properties-edit', _onTableRowEditClick).on('change', '.properties-bulk-selection', _onBulkSelectionChange).on('keyup', 'tbody tr input:text', _onTableRowDataChange);

        $this.parents('.properties.modal').on('change', 'input:checkbox.properties-row-selection', _onTableRowCheckboxChange).on('change', '.select-properties-page-mode', _onPageModeChange).on('click', '.cancel-properties-edits', _onCancelClick).on('click', '.btn-group .properties-bulk-row-edit', _onTableBulkRowEditClick);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19ldmVudHMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJfb25CdWxrU2VsZWN0aW9uQ2hhbmdlIiwiZXZlbnQiLCJwcm9wYWdhdGUiLCJmaW5kIiwic2luZ2xlX2NoZWNrYm94IiwicHJvcCIsInRyaWdnZXIiLCJfb25UYWJsZVJvd0NsaWNrIiwidGFyZ2V0IiwiaXMiLCIkc2luZ2xlQ2hlY2tib3giLCJfb25UYWJsZVJvd0VkaXRDbGljayIsIiR0YWJsZVJvdyIsInBhcmVudHMiLCJlYWNoIiwibGVuZ3RoIiwiaHRtbCIsImlubmVyVGV4dCIsInJlcGxhY2VXaXRoIiwiaW5uZXJIVE1MIiwiJHJvd0FjdGlvbnNEcm9wZG93biIsIiRlZGl0QWN0aW9uIiwiJHNhdmVBY3Rpb24iLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwianNlIiwibGlicyIsImJ1dHRvbl9kcm9wZG93biIsInNldERlZmF1bHRBY3Rpb24iLCJfb25UYWJsZUJ1bGtSb3dFZGl0Q2xpY2siLCIkYnVsa0VkaXRBY3Rpb24iLCIkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMiLCIkYnVsa0FjdGlvbnNEcm9wZG93biIsIiRidWxrU2F2ZUFjdGlvbiIsIiRyb3dBY3Rpb25Ecm9wZG93biIsImNvbnRleHQiLCJfb25UYWJsZVJvd0NoZWNrYm94Q2hhbmdlIiwiJGJ1bGtBY3Rpb25Ecm9wZG93bkJ1dHRvbnMiLCJoYXNDbGFzcyIsIl9yZXNvbHZlUm93Q2hhbmdlcyIsImxhc3QiLCJfb25DYW5jZWxDbGljayIsIiRwYWdlTW9kZSIsImNsb3Nlc3QiLCJ2YWwiLCJfb25QYWdlTW9kZUNoYW5nZSIsImF0dHIiLCIkcm93Iiwicm93SW5kZXgiLCJEYXRhVGFibGUiLCJyb3ciLCJpbmRleCIsIiRjZWxsIiwiY29sdW1uSW5kZXgiLCJjb2x1bW4iLCJwYXJlbnRFbGVtZW50IiwiY2VsbCIsImNlbGxEYXRhIiwidmFsdWVzX25hbWUiLCJ2YWx1ZXNfcHJpY2UiLCJfb25UYWJsZVJvd0RhdGFDaGFuZ2UiLCJ0cmltIiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FBc0IsbUJBQXRCLEVBQTJDLENBQUMsaUJBQUQsRUFBdUJGLEdBQUdHLE1BQTFCLDJCQUEzQyxFQUFxRyxVQUFVQyxJQUFWLEVBQWdCOztBQUVqSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1KLFNBQVMsRUFBZjs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQU1BLGFBQVNLLHNCQUFULENBQWdDQyxLQUFoQyxFQUF5RDtBQUFBLFlBQWxCQyxTQUFrQix1RUFBTixJQUFNOztBQUNyRCxZQUFJQSxjQUFjLEtBQWxCLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBRURKLGNBQU1LLElBQU4sQ0FBVywrQ0FBWCxFQUNLQyxlQURMLENBQ3FCLFNBRHJCLEVBQ2dDTCxFQUFFLElBQUYsRUFBUU0sSUFBUixDQUFhLFNBQWIsQ0FEaEMsRUFFS0MsT0FGTCxDQUVhLFFBRmI7QUFHSDs7QUFFRDs7Ozs7QUFLQSxhQUFTQyxnQkFBVCxDQUEwQk4sS0FBMUIsRUFBaUM7QUFDN0IsWUFBSSxDQUFDRixFQUFFRSxNQUFNTyxNQUFSLEVBQWdCQyxFQUFoQixDQUFtQixJQUFuQixDQUFMLEVBQStCO0FBQzNCO0FBQ0g7O0FBRUQsWUFBTUMsa0JBQWtCWCxFQUFFLElBQUYsRUFBUUksSUFBUixDQUFhLHlDQUFiLENBQXhCOztBQUVBTyx3QkFBZ0JMLElBQWhCLENBQXFCLFNBQXJCLEVBQWdDLENBQUNOLEVBQUUsSUFBRixFQUM1QkksSUFENEIsQ0FDdkIseUNBRHVCLEVBRTVCRSxJQUY0QixDQUV2QixTQUZ1QixD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QTdCLFdBQU9tRSxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQmpFLGNBQ0trRSxFQURMLENBQ1EsT0FEUixFQUNpQixVQURqQixFQUM2QnpELGdCQUQ3QixFQUVLeUQsRUFGTCxDQUVRLE9BRlIsRUFFaUIsc0JBRmpCLEVBRXlDckQsb0JBRnpDLEVBR0txRCxFQUhMLENBR1EsUUFIUixFQUdrQiw0QkFIbEIsRUFHZ0RoRSxzQkFIaEQsRUFJS2dFLEVBSkwsQ0FJUSxPQUpSLEVBSWlCLHFCQUpqQixFQUl3Q0oscUJBSnhDOztBQU1BOUQsY0FBTWUsT0FBTixDQUFjLG1CQUFkLEVBQ0ttRCxFQURMLENBQ1EsUUFEUixFQUNrQix5Q0FEbEIsRUFDNkQ1Qix5QkFEN0QsRUFFSzRCLEVBRkwsQ0FFUSxRQUZSLEVBRWtCLDhCQUZsQixFQUVrRG5CLGlCQUZsRCxFQUdLbUIsRUFITCxDQUdRLE9BSFIsRUFHaUIsMEJBSGpCLEVBRzZDdkIsY0FIN0MsRUFJS3VCLEVBSkwsQ0FJUSxPQUpSLEVBSWlCLHNDQUpqQixFQUl5RG5DLHdCQUp6RDs7QUFNQWtDO0FBQ0gsS0FkRDs7QUFnQkEsV0FBT3BFLE1BQVA7QUFDSCxDQXBURCIsImZpbGUiOiJxdWlja19lZGl0L21vZGFscy9wcm9wZXJ0aWVzL3Byb3BlcnRpZXNfZXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBldmVudHMuanMgMjAxNi0xMC0xMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogUHJvcGVydGllcyBUYWJsZSBFdmVudHMgQ29udHJvbGxlclxuICpcbiAqIEhhbmRsZXMgdGhlIGV2ZW50cyBvZiB0aGUgcHJvcGVydGllcyB0YWJsZS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdwcm9wZXJ0aWVzX2V2ZW50cycsIFsnbG9hZGluZ19zcGlubmVyJywgYCR7Z3guc291cmNlfS9saWJzL2J1dHRvbl9kcm9wZG93bmBdLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIEJ1bGsgc2VsZWN0aW9uIGNoYW5nZSBldmVudCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3Byb3BhZ2F0ZSA9IHRydWVdIFdoZXRoZXIgdG8gcHJvcGFnYXRlIHRoZSBldmVudCBvciBub3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uQnVsa1NlbGVjdGlvbkNoYW5nZShldmVudCwgcHJvcGFnYXRlID0gdHJ1ZSkge1xuICAgICAgICBpZiAocHJvcGFnYXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3gucHJvcGVydGllcy1yb3ctc2VsZWN0aW9uJylcbiAgICAgICAgICAgIC5zaW5nbGVfY2hlY2tib3goJ2NoZWNrZWQnLCAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWJsZSByb3cgY2xpY2sgZXZlbnQgaGFuZGxlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25UYWJsZVJvd0NsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICghJChldmVudC50YXJnZXQpLmlzKCd0ZCcpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCAkc2luZ2xlQ2hlY2tib3ggPSAkKHRoaXMpLmZpbmQoJ2lucHV0OmNoZWNrYm94LnByb3BlcnRpZXMtcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgICRzaW5nbGVDaGVja2JveC5wcm9wKCdjaGVja2VkJywgISQodGhpcylcbiAgICAgICAgICAgIC5maW5kKCdpbnB1dDpjaGVja2JveC5wcm9wZXJ0aWVzLXJvdy1zZWxlY3Rpb24nKVxuICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIHJvdyBlZGl0aW5nIG1vZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uVGFibGVSb3dFZGl0Q2xpY2soKSB7XG4gICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcbiAgICAgICAgY29uc3QgJHNpbmdsZUNoZWNrYm94ID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ2lucHV0OmNoZWNrYm94LnByb3BlcnRpZXMtcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgICR0YWJsZVJvdy5maW5kKCd0ZC5lZGl0YWJsZScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnaW5wdXQ6dGV4dCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJ3AudmFsdWVzX3ByaWNlJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgncC52YWx1ZXNfcHJpY2UnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBgPGlucHV0IGRhdGEtcHJvcGVydGllcy1wcmljZS10eXBlPVwiJHskKHRoaXMpLmRhdGEoJ3Byb3BlcnRpZXMtcHJpY2UtdHlwZScpfVwiXG5cdFx0XHRcdFx0XHRcdFx0XHQgICB0eXBlPVwidGV4dFwiIFxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgY2xhc3M9XCJmb3JtLWNvbnRyb2wgdmFsdWVzLXByaWNlXCIgXG5cdFx0XHRcdFx0XHRcdFx0XHQgICB2YWx1ZT1cIiR7dGhpcy5pbm5lclRleHR9XCIgLz5gO1xuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVwbGFjZVdpdGgoaHRtbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9XCIke3RoaXMuaW5uZXJUZXh0fVwiIC8+YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNpbmdsZUNoZWNrYm94LnByb3AoJ2NoZWNrZWQnLCAhJCh0aGlzKVxuICAgICAgICAgICAgLmZpbmQoJ2lucHV0OmNoZWNrYm94LnByb3BlcnRpZXMtcm93LXNlbGVjdGlvbicpXG4gICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICAgIGNvbnN0ICRyb3dBY3Rpb25zRHJvcGRvd24gPSAkdGFibGVSb3cuZmluZCgnLmRyb3Bkb3duJyk7XG4gICAgICAgIGNvbnN0ICRlZGl0QWN0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgY29uc3QgJHNhdmVBY3Rpb24gPSAkcm93QWN0aW9uc0Ryb3Bkb3duLmZpbmQoJy5zYXZlLXByb3BlcnRpZXMtZWRpdHMnKTtcbiAgICAgICAgJGVkaXRBY3Rpb24uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAkc2F2ZUFjdGlvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5zZXREZWZhdWx0QWN0aW9uKCRyb3dBY3Rpb25zRHJvcGRvd24sICRzYXZlQWN0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdWxrIHJvdyBlZGl0IGV2ZW50IGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBFbmFibGVzIHRoZSBlZGl0IG1vZGUgZm9yIHRoZSBzZWxlY3RlZCByb3dzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblRhYmxlQnVsa1Jvd0VkaXRDbGljaygpIHtcbiAgICAgICAgY29uc3QgJGJ1bGtFZGl0QWN0aW9uID0gJCh0aGlzKTtcbiAgICAgICAgY29uc3QgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZC5wcm9wZXJ0aWVzLXJvdy1zZWxlY3Rpb24nKTtcblxuICAgICAgICBpZiAoJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zRHJvcGRvd24gPSAkKCcucHJvcGVydGllcy1idWxrLWFjdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgJGJ1bGtTYXZlQWN0aW9uID0gJGJ1bGtBY3Rpb25zRHJvcGRvd24uZmluZCgnLnNhdmUtcHJvcGVydGllcy1idWxrLXJvdy1lZGl0cycpO1xuICAgICAgICAgICAgJGJ1bGtFZGl0QWN0aW9uLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICRidWxrU2F2ZUFjdGlvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uc2V0RGVmYXVsdEFjdGlvbigkYnVsa0FjdGlvbnNEcm9wZG93biwgJGJ1bGtTYXZlQWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcbiAgICAgICAgICAgIGNvbnN0ICRyb3dBY3Rpb25Ecm9wZG93biA9ICR0YWJsZVJvdy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJyk7XG4gICAgICAgICAgICBjb25zdCAkc2F2ZUFjdGlvbiA9ICRyb3dBY3Rpb25Ecm9wZG93bi5maW5kKCcuc2F2ZS1wcm9wZXJ0aWVzLWVkaXRzJyk7XG4gICAgICAgICAgICBjb25zdCAkZWRpdEFjdGlvbiA9ICRyb3dBY3Rpb25Ecm9wZG93bi5maW5kKCcucm93LXByb3BlcnRpZXMtZWRpdCcpO1xuXG4gICAgICAgICAgICAkZWRpdEFjdGlvbi5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkc2F2ZUFjdGlvbi5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uc2V0RGVmYXVsdEFjdGlvbigkcm93QWN0aW9uRHJvcGRvd24sICRzYXZlQWN0aW9uKTtcblxuICAgICAgICAgICAgJHRhYmxlUm93LmZpbmQoJ3RkLmVkaXRhYmxlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnaW5wdXQ6dGV4dCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJ3AudmFsdWVzX3ByaWNlJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ3AudmFsdWVzX3ByaWNlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IGA8aW5wdXQgZGF0YS1wcm9wZXJ0aWVzLXByaWNlLXR5cGU9XCIkeyQodGhpcykuZGF0YSgncHJvcGVydGllcy1wcmljZS10eXBlJyl9XCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgdHlwZT1cInRleHRcIiBcblx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgY2xhc3M9XCJmb3JtLWNvbnRyb2wgdmFsdWVzLXByaWNlXCIgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgIHZhbHVlPVwiJHskKHRoaXMpLmNvbnRleHQuaW5uZXJUZXh0fVwiIC8+YDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZXBsYWNlV2l0aChodG1sKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT1cIiR7dGhpcy5pbm5lclRleHR9XCIgLz5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGFibGUgcm93IGNoZWNrYm94IGNoYW5nZSBldmVudCBoYW5kbGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnN0ICRidWxrQWN0aW9uRHJvcGRvd25CdXR0b25zID0gJHRoaXMucGFyZW50cygnLnByb3BlcnRpZXMubW9kYWwnKS5maW5kKCcucHJvcGVydGllcy1idWxrLWFjdGlvbiA+IGJ1dHRvbicpO1xuICAgICAgICBjb25zdCAkdGFibGVSb3cgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJyk7XG5cbiAgICAgICAgaWYgKCR0aGlzLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQucHJvcGVydGllcy1yb3ctc2VsZWN0aW9uJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJGJ1bGtBY3Rpb25Ecm9wZG93bkJ1dHRvbnMucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkYnVsa0FjdGlvbkRyb3Bkb3duQnV0dG9ucy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zRHJvcGRvd24gPSAkKCcucHJvcGVydGllcy1idWxrLWFjdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgJGJ1bGtTYXZlQWN0aW9uID0gJGJ1bGtBY3Rpb25zRHJvcGRvd24uZmluZCgnLnNhdmUtcHJvcGVydGllcy1idWxrLXJvdy1lZGl0cycpO1xuXG4gICAgICAgICAgICBpZiAoISRidWxrU2F2ZUFjdGlvbi5oYXNDbGFzcygnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkYnVsa0VkaXRBY3Rpb24gPSAkYnVsa0FjdGlvbnNEcm9wZG93bi5maW5kKCcucHJvcGVydGllcy1idWxrLXJvdy1lZGl0Jyk7XG4gICAgICAgICAgICAgICAgJGJ1bGtFZGl0QWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkYnVsa1NhdmVBY3Rpb24uYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5zZXREZWZhdWx0QWN0aW9uKCRidWxrQWN0aW9uc0Ryb3Bkb3duLCAkYnVsa0VkaXRBY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCd0cicpLmZpbmQoJ3AudmFsdWVzX3ByaWNlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdwcm9wZXJ0aWVzLXByaWNlLXR5cGUnKSA9PSAnZml4Jykge1xuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50cygndGQnKS5hZGRDbGFzcygnZWRpdGFibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCEkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgX3Jlc29sdmVSb3dDaGFuZ2VzKCQodGhpcykucGFyZW50cygndHInKSk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRyb3dBY3Rpb25zRHJvcGRvd24gPSAkdGFibGVSb3cuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpO1xuICAgICAgICAgICAgY29uc3QgJHNhdmVBY3Rpb24gPSAkcm93QWN0aW9uc0Ryb3Bkb3duLmZpbmQoJy5zYXZlLXByb3BlcnRpZXMtZWRpdHMnKTtcblxuICAgICAgICAgICAgaWYgKCEkc2F2ZUFjdGlvbi5oYXNDbGFzcygnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkZWRpdEFjdGlvbiA9ICR0YWJsZVJvdy5maW5kKCcucm93LXByb3BlcnRpZXMtZWRpdCcpO1xuICAgICAgICAgICAgICAgICRlZGl0QWN0aW9uLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkc2F2ZUFjdGlvbi5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLnNldERlZmF1bHRBY3Rpb24oJHJvd0FjdGlvbnNEcm9wZG93biwgJGVkaXRBY3Rpb24ubGFzdCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbmNlbCBkYXRhIG1vZGlmaWNhdGlvbnMgZXZlbnQgaGFuZGxlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25DYW5jZWxDbGljaygpIHtcbiAgICAgICAgY29uc3QgJHBhZ2VNb2RlID0gJCh0aGlzKS5jbG9zZXN0KCd0aGVhZCcpLmZpbmQoJy5zZWxlY3QtcHJvcGVydGllcy1wYWdlLW1vZGUnKTtcbiAgICAgICAgY29uc3QgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZC5wcm9wZXJ0aWVzLXJvdy1zZWxlY3Rpb24nKTtcblxuICAgICAgICBpZiAoJHBhZ2VNb2RlLnZhbCgpID09ICdlZGl0LW1vZGUnKSB7XG4gICAgICAgICAgICAkcGFnZU1vZGUudmFsKCdmaWx0ZXItbW9kZScpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkcGFnZU1vZGUudmFsKCdlZGl0LW1vZGUnKVxuICAgICAgICB9XG5cbiAgICAgICAgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgISQodGhpcylcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgICAgICAgX3Jlc29sdmVSb3dDaGFuZ2VzKCQodGhpcykucGFyZW50cygndHInKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF9vblBhZ2VNb2RlQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFnZSBtb2RlIGNoYW5nZSBiZXR3ZWVuIFwiZWRpdFwiIGFuZCBcImZpbHRlcmluZ1wiLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblBhZ2VNb2RlQ2hhbmdlKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnZWRpdC1tb2RlJykge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgndHIucHJvcGVydGllcy1maWx0ZXInKS5hdHRyKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RyLnByb3BlcnRpZXMtZWRpdCcpLmF0dHIoJ2hpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIHRyOmZpcnN0LWNoaWxkIHRoJykuYWRkQ2xhc3MoJ2VkaXQtbW9kZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgndHIucHJvcGVydGllcy1maWx0ZXInKS5hdHRyKCdoaWRkZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5wcm9wZXJ0aWVzLWVkaXQnKS5hdHRyKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIHRyOmZpcnN0LWNoaWxkIHRoJykucmVtb3ZlQ2xhc3MoJ2VkaXQtbW9kZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZXMgYWxsIHRoZSByb3cgZGF0YSBjaGFuZ2VzIGJhY2sgdG8gdGhlaXIgb3JpZ2luYWwgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gJHJvdyBDdXJyZW50IHJvdyBzZWxlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVzb2x2ZVJvd0NoYW5nZXMoJHJvdykge1xuICAgICAgICBjb25zdCByb3dJbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLnJvdygkcm93KS5pbmRleCgpO1xuXG4gICAgICAgICRyb3cuZmluZCgnaW5wdXQ6dGV4dDpub3QoLnZhbHVlcy1wcmljZSknKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0ICRjZWxsID0gJCh0aGlzKS5jbG9zZXN0KCd0ZCcpO1xuICAgICAgICAgICAgY29uc3QgY29sdW1uSW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oJGNlbGwpLmluZGV4KCk7XG5cbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbm5lckhUTUwgPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm93LmZpbmQoJ2lucHV0OnRleHQudmFsdWVzLXByaWNlJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCAkY2VsbCA9ICQodGhpcykuY2xvc2VzdCgndGQnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKCRjZWxsKS5pbmRleCgpO1xuICAgICAgICAgICAgY29uc3QgY2VsbERhdGEgPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpO1xuXG4gICAgICAgICAgICBsZXQgaHRtbCA9IGA8ZGl2IGNsYXNzPVwiY29sLWxnLTEyXCI+XG5cdFx0XHRcdFx0XHRcdDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWxcIj4ke2NlbGxEYXRhLnZhbHVlc19uYW1lfTwvbGFiZWw+XG5cdFx0XHRcdFx0XHRcdDxwIGRhdGEtcHJvcGVydGllcy1wcmljZS10eXBlPVwiJHskKHRoaXMpLmRhdGEoJ3Byb3BlcnRpZXMtcHJpY2UtdHlwZScpfVwiXG5cdFx0XHRcdFx0XHRcdCAgIGNsYXNzPVwiZm9ybS1jb250cm9sLXN0YXRpYyB2YWx1ZXNfcHJpY2VcIj4ke2NlbGxEYXRhLnZhbHVlc19wcmljZX08L3A+XG5cdFx0XHRcdFx0XHQ8L2Rpdj5gO1xuXG5cbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnZGl2LmZvcm0tZ3JvdXAnKS5yZXBsYWNlV2l0aChgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4ke2h0bWx9PC9kaXY+YCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRhYmxlIHJvdyBkYXRhIGNoYW5nZSBldmVudCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogSXQncyBiZWluZyB0cmlnZ2VyZWQgZXZlcnkgdGltZSBhIHJvdyBpbnB1dC9zZWxlY3QgZmllbGQgaXMgY2hhbmdlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25UYWJsZVJvd0RhdGFDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnN0ICRyb3cgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJyk7XG4gICAgICAgIGNvbnN0IHJvd0luZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkucm93KCRyb3cpLmluZGV4KCk7XG5cbiAgICAgICAgJHJvdy5maW5kKCdpbnB1dDp0ZXh0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCAkY2VsbCA9ICQodGhpcykuY2xvc2VzdCgndGQnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKCRjZWxsKS5pbmRleCgpO1xuXG4gICAgICAgICAgICBpZiAoJC50cmltKCQodGhpcykudmFsKCkpICE9ICR0aGlzLkRhdGFUYWJsZSgpLmNlbGwocm93SW5kZXgsIGNvbHVtbkluZGV4KS5kYXRhKCkpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdtb2RpZmllZCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdtb2RpZmllZCcpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAkdGhpc1xuICAgICAgICAgICAgLm9uKCdjbGljaycsICd0Ym9keSB0cicsIF9vblRhYmxlUm93Q2xpY2spXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5yb3ctcHJvcGVydGllcy1lZGl0JywgX29uVGFibGVSb3dFZGl0Q2xpY2spXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsICcucHJvcGVydGllcy1idWxrLXNlbGVjdGlvbicsIF9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UpXG4gICAgICAgICAgICAub24oJ2tleXVwJywgJ3Rib2R5IHRyIGlucHV0OnRleHQnLCBfb25UYWJsZVJvd0RhdGFDaGFuZ2UpO1xuXG4gICAgICAgICR0aGlzLnBhcmVudHMoJy5wcm9wZXJ0aWVzLm1vZGFsJylcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywgJ2lucHV0OmNoZWNrYm94LnByb3BlcnRpZXMtcm93LXNlbGVjdGlvbicsIF9vblRhYmxlUm93Q2hlY2tib3hDaGFuZ2UpXG4gICAgICAgICAgICAub24oJ2NoYW5nZScsICcuc2VsZWN0LXByb3BlcnRpZXMtcGFnZS1tb2RlJywgX29uUGFnZU1vZGVDaGFuZ2UpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5jYW5jZWwtcHJvcGVydGllcy1lZGl0cycsIF9vbkNhbmNlbENsaWNrKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYnRuLWdyb3VwIC5wcm9wZXJ0aWVzLWJ1bGstcm93LWVkaXQnLCBfb25UYWJsZUJ1bGtSb3dFZGl0Q2xpY2spO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn0pO1xuXG4iXX0=
