'use strict';

/* --------------------------------------------------------------
 edit.js 2018-04-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the QuickEdit table editing.
 */
gx.controllers.module('edit', ['modal', gx.source + '/libs/info_box', jse.source + '/vendor/sumoselect/jquery.sumoselect.min.js', jse.source + '/vendor/sumoselect/sumoselect.min.css'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Enter Key Code
     *
     * @type {Number}
     */

    var ENTER_KEY_CODE = 13;

    /**
     * Module Selector
     *
     * @type {jQuery}
     */
    var $this = $(this);

    /**
     * Edit Row Selector
     *
     * @type {jQuery}
     */
    var $edit = $this.find('tr.edit');

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = { bindings: {} };

    // Dynamically define the edit row data-bindings.
    $edit.find('th').each(function () {
        var columnName = $(this).data('columnName');

        if (columnName === 'checkbox' || columnName === 'actions') {
            return true;
        }

        module.bindings[columnName] = $(this).find('input, select').first();
    });

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Save modifications event handler.
     *
     * This method will look for modified values and send them to back-end with an AJAX request.
     */
    function _onSaveClick() {
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.overview-row-selection');
        var edit = {};
        var data = {};

        if (!$edit.prop('hidden')) {
            $edit.find('th').each(function () {
                var columnName = $(this).data('columnName');

                if (columnName === 'checkbox' || columnName === 'actions') {
                    return true;
                }

                var value = module.bindings[columnName].get();

                if (value) {
                    edit[columnName] = value;
                }
            });
        }

        $checkedSingleCheckboxes.each(function () {
            var $tableRow = $(this).parents('tr');

            if ($tableRow.find('input:text.modified, select.modified').length > 0) {
                var inlineEdit = {};

                $tableRow.find('input:text.modified, select.modified').each(function () {
                    var $cell = $(this).closest('td');
                    var columnIndex = $this.DataTable().column($cell).index();
                    var columnName = $edit.find('th').eq(columnIndex).data('columnName');

                    inlineEdit[columnName] = $(this).val();
                });

                data[$tableRow.data('id')] = inlineEdit;
            } else {
                data[$tableRow.data('id')] = edit;
            }

            $(this).prop('checked', !$(this).prop('checked')).trigger('change');
        });

        if ($checkedSingleCheckboxes.length === 0) {
            var title = jse.core.lang.translate('MODAL_TITLE_NODE', 'admin_quick_edit');
            var message = jse.core.lang.translate('NO_PRODUCT_SELECTED', 'admin_quick_edit');
            var buttons = [{
                title: jse.core.lang.translate('BUTTON_CLOSE', 'admin_quick_edit'),
                callback: function callback(event) {
                    return $(event.currentTarget).parents('.modal').modal('hide');
                }
            }];

            jse.libs.modal.showMessage(title, message, buttons);

            return;
        }

        if (_checkForModifications(data) === false) {
            $checkedSingleCheckboxes.each(function () {
                _resolveRowChanges($(this).parents('tr'));
            });

            return;
        }

        _save(data);
    }

    /**
     * Checks for value modifications.
     *
     * @param {Object} data Contains current row data.
     *
     * @return {Boolean} Returns whether modifications were made or not.
     */
    function _checkForModifications(data) {
        var modificationExists = false;

        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                if (!$.isEmptyObject(data[property])) {
                    modificationExists = true;
                }
            }
        }

        return modificationExists;
    }

    /**
     * Resolves row changes.
     *
     * @param {jQuery} $row Selector of the row to be resolved.
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
     * Stores the change of a tax value.
     */
    function _onTableRowTaxChange() {
        var productId = $(this).parents('tr').data('id');
        var taxClassId = $(this).val();
        var edit = {};
        var data = {};

        edit['tax'] = taxClassId;
        data[productId] = edit;

        _save(data, false);
    }

    /**
     * Stores the change of a shipping time value.
     */
    function _onTableRowShippingTimeChange() {
        var productId = $(this).parents('tr').data('id');
        var shippingTimeId = $(this).val();
        var edit = {};
        var data = {};

        edit['shippingStatusName'] = shippingTimeId;
        data[productId] = edit;

        _save(data, false);
    }

    /**
     * Trigger filtering once the user presses the enter key inside a filter input.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onInputTextFilterKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $edit.find('.apply-edits').trigger('click');
        }
    }

    /**
     * Trigger modifications submit once the user presses the enter key inside a edit input.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onInputTextRowKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $edit.parents('.quick-edit.overview').find('.save-bulk-row-edits').trigger('click');
        }
    }

    /**
     * Save modified data with an AJAX request.
     *
     * @param {Object} data Contains the updated data.
     * @param {Boolean} [reload=true] Reload the page after the request is done.
     */
    function _save(data) {
        var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/Update';
        var edit = {
            data: data,
            pageToken: jse.core.config.get('pageToken')
        };

        $.post(url, edit).done(function (response) {

            if (typeof response === "string") {
                response = $.parseJSON(response);
            }

            if (response.success) {
                $edit.find('input, select').not('.length, .select-page-mode').val('');
                $edit.find('select').not('.length, .select-page-mode').multi_select('refresh');

                var content = jse.core.lang.translate('SUCCESS_PRODUCT_UPDATED', 'admin_quick_edit');

                if (reload) {
                    $this.DataTable().ajax.reload(null, false);
                }

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

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $edit.on('keyup', 'input:text', _onInputTextFilterKeyUp).on('click', '.apply-edits', _onSaveClick);

        $edit.parents('.quick-edit.overview').on('keyup', 'td.editable', _onInputTextRowKeyUp).on('click', '.btn-group .save-bulk-row-edits', _onSaveClick).on('click', '.save-row-edits', _onSaveClick).on('change', '.select-tax', _onTableRowTaxChange).on('change', '.select-shipping-time', _onTableRowShippingTimeChange);

        // Initialize the elements.
        $this.find('[data-single_select-instance]').each(function () {
            var $select = $(this);

            $select.removeAttr('data-single_select-instance');

            // Instantiate the widget without an AJAX request.
            $select.SumoSelect();
            $select[0].sumo.add('', '' + jse.core.lang.translate('TOOLTIP_NO_CHANGES', 'admin_quick_edit'), 0);
            $select[0].sumo.unSelectAll();
            $select[0].sumo.selectItem(0);
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvZWRpdC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwianNlIiwiZGF0YSIsIkVOVEVSX0tFWV9DT0RFIiwiJHRoaXMiLCIkIiwiJGVkaXQiLCJmaW5kIiwiYmluZGluZ3MiLCJlYWNoIiwiY29sdW1uTmFtZSIsImZpcnN0IiwiX29uU2F2ZUNsaWNrIiwiJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzIiwiZWRpdCIsInByb3AiLCJ2YWx1ZSIsImdldCIsIiR0YWJsZVJvdyIsInBhcmVudHMiLCJsZW5ndGgiLCJpbmxpbmVFZGl0IiwiJGNlbGwiLCJjbG9zZXN0IiwiY29sdW1uSW5kZXgiLCJEYXRhVGFibGUiLCJjb2x1bW4iLCJpbmRleCIsImVxIiwidmFsIiwidHJpZ2dlciIsInRpdGxlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJtZXNzYWdlIiwiYnV0dG9ucyIsImNhbGxiYWNrIiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwibW9kYWwiLCJsaWJzIiwic2hvd01lc3NhZ2UiLCJfY2hlY2tGb3JNb2RpZmljYXRpb25zIiwiX3Jlc29sdmVSb3dDaGFuZ2VzIiwiX3NhdmUiLCJtb2RpZmljYXRpb25FeGlzdHMiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiaXNFbXB0eU9iamVjdCIsIiRyb3ciLCJyb3dJbmRleCIsInJvdyIsIm5vdCIsInBhcmVudEVsZW1lbnQiLCJpbm5lckhUTUwiLCJjZWxsIiwiX29uVGFibGVSb3dUYXhDaGFuZ2UiLCJwcm9kdWN0SWQiLCJ0YXhDbGFzc0lkIiwiX29uVGFibGVSb3dTaGlwcGluZ1RpbWVDaGFuZ2UiLCJzaGlwcGluZ1RpbWVJZCIsIl9vbklucHV0VGV4dEZpbHRlcktleVVwIiwid2hpY2giLCJfb25JbnB1dFRleHRSb3dLZXlVcCIsInJlbG9hZCIsInVybCIsImNvbmZpZyIsInBhZ2VUb2tlbiIsInBvc3QiLCJkb25lIiwicmVzcG9uc2UiLCJwYXJzZUpTT04iLCJzdWNjZXNzIiwibXVsdGlfc2VsZWN0IiwiY29udGVudCIsImFqYXgiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiaW5pdCIsIm9uIiwiJHNlbGVjdCIsInJlbW92ZUF0dHIiLCJTdW1vU2VsZWN0Iiwic3VtbyIsImFkZCIsInVuU2VsZWN0QWxsIiwic2VsZWN0SXRlbSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7QUFHQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksTUFESixFQUdJLENBQ0ksT0FESixFQUVPRixHQUFHRyxNQUZWLHFCQUdPQyxJQUFJRCxNQUhYLGtEQUlPQyxJQUFJRCxNQUpYLDJDQUhKLEVBVUksVUFBVUUsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLGlCQUFpQixFQUF2Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxRQUFRRixNQUFNRyxJQUFOLENBQVcsU0FBWCxDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1SLFNBQVMsRUFBQ1MsVUFBVSxFQUFYLEVBQWY7O0FBRUE7QUFDQUYsVUFBTUMsSUFBTixDQUFXLElBQVgsRUFBaUJFLElBQWpCLENBQXNCLFlBQVk7QUFDOUIsWUFBTUMsYUFBYUwsRUFBRSxJQUFGLEVBQVFILElBQVIsQ0FBYSxZQUFiLENBQW5COztBQUVBLFlBQUlRLGVBQWUsVUFBZixJQUE2QkEsZUFBZSxTQUFoRCxFQUEyRDtBQUN2RCxtQkFBTyxJQUFQO0FBQ0g7O0FBRURYLGVBQU9TLFFBQVAsQ0FBZ0JFLFVBQWhCLElBQThCTCxFQUFFLElBQUYsRUFBUUUsSUFBUixDQUFhLGVBQWIsRUFBOEJJLEtBQTlCLEVBQTlCO0FBQ0gsS0FSRDs7QUFVQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0MsWUFBVCxHQUF3QjtBQUNwQixZQUFNQywyQkFBMkJULE1BQU1HLElBQU4sQ0FBVywrQ0FBWCxDQUFqQztBQUNBLFlBQU1PLE9BQU8sRUFBYjtBQUNBLFlBQU1aLE9BQU8sRUFBYjs7QUFFQSxZQUFJLENBQUNJLE1BQU1TLElBQU4sQ0FBVyxRQUFYLENBQUwsRUFBMkI7QUFDdkJULGtCQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkUsSUFBakIsQ0FBc0IsWUFBWTtBQUM5QixvQkFBTUMsYUFBYUwsRUFBRSxJQUFGLEVBQVFILElBQVIsQ0FBYSxZQUFiLENBQW5COztBQUVBLG9CQUFJUSxlQUFlLFVBQWYsSUFBNkJBLGVBQWUsU0FBaEQsRUFBMkQ7QUFDdkQsMkJBQU8sSUFBUDtBQUNIOztBQUVELG9CQUFNTSxRQUFRakIsT0FBT1MsUUFBUCxDQUFnQkUsVUFBaEIsRUFBNEJPLEdBQTVCLEVBQWQ7O0FBRUEsb0JBQUlELEtBQUosRUFBVztBQUNQRix5QkFBS0osVUFBTCxJQUFtQk0sS0FBbkI7QUFDSDtBQUNKLGFBWkQ7QUFhSDs7QUFFREgsaUNBQXlCSixJQUF6QixDQUE4QixZQUFZO0FBQ3RDLGdCQUFNUyxZQUFZYixFQUFFLElBQUYsRUFBUWMsT0FBUixDQUFnQixJQUFoQixDQUFsQjs7QUFFQSxnQkFBSUQsVUFBVVgsSUFBVixDQUFlLHNDQUFmLEVBQXVEYSxNQUF2RCxHQUFnRSxDQUFwRSxFQUF1RTtBQUNuRSxvQkFBTUMsYUFBYSxFQUFuQjs7QUFFQUgsMEJBQVVYLElBQVYsQ0FBZSxzQ0FBZixFQUF1REUsSUFBdkQsQ0FBNEQsWUFBWTtBQUNwRSx3QkFBTWEsUUFBUWpCLEVBQUUsSUFBRixFQUFRa0IsT0FBUixDQUFnQixJQUFoQixDQUFkO0FBQ0Esd0JBQU1DLGNBQWNwQixNQUFNcUIsU0FBTixHQUFrQkMsTUFBbEIsQ0FBeUJKLEtBQXpCLEVBQWdDSyxLQUFoQyxFQUFwQjtBQUNBLHdCQUFNakIsYUFBYUosTUFBTUMsSUFBTixDQUFXLElBQVgsRUFBaUJxQixFQUFqQixDQUFvQkosV0FBcEIsRUFBaUN0QixJQUFqQyxDQUFzQyxZQUF0QyxDQUFuQjs7QUFFQW1CLCtCQUFXWCxVQUFYLElBQXlCTCxFQUFFLElBQUYsRUFBUXdCLEdBQVIsRUFBekI7QUFDSCxpQkFORDs7QUFRQTNCLHFCQUFLZ0IsVUFBVWhCLElBQVYsQ0FBZSxJQUFmLENBQUwsSUFBNkJtQixVQUE3QjtBQUNILGFBWkQsTUFZTztBQUNIbkIscUJBQUtnQixVQUFVaEIsSUFBVixDQUFlLElBQWYsQ0FBTCxJQUE2QlksSUFBN0I7QUFDSDs7QUFFRFQsY0FBRSxJQUFGLEVBQVFVLElBQVIsQ0FBYSxTQUFiLEVBQXdCLENBQUNWLEVBQUUsSUFBRixFQUNwQlUsSUFEb0IsQ0FDZixTQURlLENBQXpCLEVBRUtlLE9BRkwsQ0FFYSxRQUZiO0FBR0gsU0F0QkQ7O0FBd0JBLFlBQUlqQix5QkFBeUJPLE1BQXpCLEtBQW9DLENBQXhDLEVBQTJDO0FBQ3ZDLGdCQUFNVyxRQUFROUIsSUFBSStCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGtCQUF4QixFQUE0QyxrQkFBNUMsQ0FBZDtBQUNBLGdCQUFNQyxVQUFVbEMsSUFBSStCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLHFCQUF4QixFQUErQyxrQkFBL0MsQ0FBaEI7QUFDQSxnQkFBTUUsVUFBVSxDQUNaO0FBQ0lMLHVCQUFPOUIsSUFBSStCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGNBQXhCLEVBQXdDLGtCQUF4QyxDQURYO0FBRUlHLDBCQUFVO0FBQUEsMkJBQVNoQyxFQUFFaUMsTUFBTUMsYUFBUixFQUF1QnBCLE9BQXZCLENBQStCLFFBQS9CLEVBQXlDcUIsS0FBekMsQ0FBK0MsTUFBL0MsQ0FBVDtBQUFBO0FBRmQsYUFEWSxDQUFoQjs7QUFPQXZDLGdCQUFJd0MsSUFBSixDQUFTRCxLQUFULENBQWVFLFdBQWYsQ0FBMkJYLEtBQTNCLEVBQWtDSSxPQUFsQyxFQUEyQ0MsT0FBM0M7O0FBRUE7QUFDSDs7QUFFRCxZQUFJTyx1QkFBdUJ6QyxJQUF2QixNQUFpQyxLQUFyQyxFQUE0QztBQUN4Q1cscUNBQXlCSixJQUF6QixDQUE4QixZQUFZO0FBQ3RDbUMsbUNBQW1CdkMsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBbkI7QUFDSCxhQUZEOztBQUlBO0FBQ0g7O0FBRUQwQixjQUFNM0MsSUFBTjtBQUNIOztBQUVEOzs7Ozs7O0FBT0EsYUFBU3lDLHNCQUFULENBQWdDekMsSUFBaEMsRUFBc0M7QUFDbEMsWUFBSTRDLHFCQUFxQixLQUF6Qjs7QUFFQSxhQUFLLElBQUlDLFFBQVQsSUFBcUI3QyxJQUFyQixFQUEyQjtBQUN2QixnQkFBSUEsS0FBSzhDLGNBQUwsQ0FBb0JELFFBQXBCLENBQUosRUFBbUM7QUFDL0Isb0JBQUksQ0FBQzFDLEVBQUU0QyxhQUFGLENBQWdCL0MsS0FBSzZDLFFBQUwsQ0FBaEIsQ0FBTCxFQUFzQztBQUNsQ0QseUNBQXFCLElBQXJCO0FBQ0g7QUFDSjtBQUNKOztBQUVELGVBQU9BLGtCQUFQO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU0Ysa0JBQVQsQ0FBNEJNLElBQTVCLEVBQWtDO0FBQzlCLFlBQU1DLFdBQVcvQyxNQUFNcUIsU0FBTixHQUFrQjJCLEdBQWxCLENBQXNCRixJQUF0QixFQUE0QnZCLEtBQTVCLEVBQWpCOztBQUVBdUIsYUFBSzNDLElBQUwsQ0FBVSxvQkFBVixFQUFnQzhDLEdBQWhDLENBQW9DLG9DQUFwQyxFQUEwRTVDLElBQTFFLENBQStFLFlBQVk7QUFDdkYsZ0JBQU1hLFFBQVFqQixFQUFFLElBQUYsRUFBUWtCLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBZDtBQUNBLGdCQUFNQyxjQUFjcEIsTUFBTXFCLFNBQU4sR0FBa0JDLE1BQWxCLENBQXlCSixLQUF6QixFQUFnQ0ssS0FBaEMsRUFBcEI7QUFDQSxpQkFBSzJCLGFBQUwsQ0FBbUJDLFNBQW5CLEdBQStCbkQsTUFBTXFCLFNBQU4sR0FBa0IrQixJQUFsQixDQUF1QkwsUUFBdkIsRUFBaUMzQixXQUFqQyxFQUE4Q3RCLElBQTlDLEVBQS9CO0FBQ0gsU0FKRDtBQUtIOztBQUVEOzs7QUFHQSxhQUFTdUQsb0JBQVQsR0FBZ0M7QUFDNUIsWUFBTUMsWUFBWXJELEVBQUUsSUFBRixFQUFRYyxPQUFSLENBQWdCLElBQWhCLEVBQXNCakIsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBbEI7QUFDQSxZQUFNeUQsYUFBYXRELEVBQUUsSUFBRixFQUFRd0IsR0FBUixFQUFuQjtBQUNBLFlBQU1mLE9BQU8sRUFBYjtBQUNBLFlBQU1aLE9BQU8sRUFBYjs7QUFFQVksYUFBSyxLQUFMLElBQWM2QyxVQUFkO0FBQ0F6RCxhQUFLd0QsU0FBTCxJQUFrQjVDLElBQWxCOztBQUVBK0IsY0FBTTNDLElBQU4sRUFBWSxLQUFaO0FBQ0g7O0FBRUQ7OztBQUdBLGFBQVMwRCw2QkFBVCxHQUF5QztBQUNyQyxZQUFNRixZQUFZckQsRUFBRSxJQUFGLEVBQVFjLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0JqQixJQUF0QixDQUEyQixJQUEzQixDQUFsQjtBQUNBLFlBQU0yRCxpQkFBaUJ4RCxFQUFFLElBQUYsRUFBUXdCLEdBQVIsRUFBdkI7QUFDQSxZQUFNZixPQUFPLEVBQWI7QUFDQSxZQUFNWixPQUFPLEVBQWI7O0FBRUFZLGFBQUssb0JBQUwsSUFBNkIrQyxjQUE3QjtBQUNBM0QsYUFBS3dELFNBQUwsSUFBa0I1QyxJQUFsQjs7QUFFQStCLGNBQU0zQyxJQUFOLEVBQVksS0FBWjtBQUNIOztBQUVEOzs7OztBQUtBLGFBQVM0RCx1QkFBVCxDQUFpQ3hCLEtBQWpDLEVBQXdDO0FBQ3BDLFlBQUlBLE1BQU15QixLQUFOLEtBQWdCNUQsY0FBcEIsRUFBb0M7QUFDaENHLGtCQUFNQyxJQUFOLENBQVcsY0FBWCxFQUEyQnVCLE9BQTNCLENBQW1DLE9BQW5DO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7QUFLQSxhQUFTa0Msb0JBQVQsQ0FBOEIxQixLQUE5QixFQUFxQztBQUNqQyxZQUFJQSxNQUFNeUIsS0FBTixLQUFnQjVELGNBQXBCLEVBQW9DO0FBQ2hDRyxrQkFBTWEsT0FBTixDQUFjLHNCQUFkLEVBQXNDWixJQUF0QyxDQUEyQyxzQkFBM0MsRUFBbUV1QixPQUFuRSxDQUEyRSxPQUEzRTtBQUNIO0FBQ0o7O0FBRUQ7Ozs7OztBQU1BLGFBQVNlLEtBQVQsQ0FBZTNDLElBQWYsRUFBb0M7QUFBQSxZQUFmK0QsTUFBZSx1RUFBTixJQUFNOztBQUNoQyxZQUFNQyxNQUFNakUsSUFBSStCLElBQUosQ0FBU21DLE1BQVQsQ0FBZ0JsRCxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxrREFBNUM7QUFDQSxZQUFNSCxPQUFPO0FBQ1RaLHNCQURTO0FBRVRrRSx1QkFBV25FLElBQUkrQixJQUFKLENBQVNtQyxNQUFULENBQWdCbEQsR0FBaEIsQ0FBb0IsV0FBcEI7QUFGRixTQUFiOztBQUtBWixVQUFFZ0UsSUFBRixDQUFPSCxHQUFQLEVBQVlwRCxJQUFaLEVBQ0t3RCxJQURMLENBQ1Usb0JBQVk7O0FBRWQsZ0JBQUksT0FBT0MsUUFBUCxLQUFvQixRQUF4QixFQUFpQztBQUM3QkEsMkJBQVdsRSxFQUFFbUUsU0FBRixDQUFZRCxRQUFaLENBQVg7QUFDSDs7QUFFRCxnQkFBSUEsU0FBU0UsT0FBYixFQUFzQjtBQUNsQm5FLHNCQUFNQyxJQUFOLENBQVcsZUFBWCxFQUE0QjhDLEdBQTVCLENBQWdDLDRCQUFoQyxFQUE4RHhCLEdBQTlELENBQWtFLEVBQWxFO0FBQ0F2QixzQkFBTUMsSUFBTixDQUFXLFFBQVgsRUFBcUI4QyxHQUFyQixDQUF5Qiw0QkFBekIsRUFBdURxQixZQUF2RCxDQUFvRSxTQUFwRTs7QUFFQSxvQkFBTUMsVUFBVTFFLElBQUkrQixJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3Qix5QkFBeEIsRUFBbUQsa0JBQW5ELENBQWhCOztBQUVBLG9CQUFJK0IsTUFBSixFQUFZO0FBQ1I3RCwwQkFBTXFCLFNBQU4sR0FBa0JtRCxJQUFsQixDQUF1QlgsTUFBdkIsQ0FBOEIsSUFBOUIsRUFBb0MsS0FBcEM7QUFDSDs7QUFFRDtBQUNBaEUsb0JBQUl3QyxJQUFKLENBQVNvQyxRQUFULENBQWtCQyxpQkFBbEIsQ0FBb0NILE9BQXBDOztBQUVBO0FBQ0g7O0FBRUQsZ0JBQU01QyxRQUFROUIsSUFBSStCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGtCQUF4QixFQUE0QyxrQkFBNUMsQ0FBZDtBQUNBLGdCQUFNQyxVQUFVbEMsSUFBSStCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLFlBQXhCLEVBQXNDLGtCQUF0QyxDQUFoQjtBQUNBLGdCQUFNRSxVQUFVLENBQ1o7QUFDSUwsdUJBQU85QixJQUFJK0IsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsY0FBeEIsRUFBd0Msa0JBQXhDLENBRFg7QUFFSUcsMEJBQVU7QUFBQSwyQkFBU2hDLEVBQUVpQyxNQUFNQyxhQUFSLEVBQXVCcEIsT0FBdkIsQ0FBK0IsUUFBL0IsRUFBeUNxQixLQUF6QyxDQUErQyxNQUEvQyxDQUFUO0FBQUE7QUFGZCxhQURZLENBQWhCOztBQU9BdkMsZ0JBQUl3QyxJQUFKLENBQVNELEtBQVQsQ0FBZUUsV0FBZixDQUEyQlgsS0FBM0IsRUFBa0NJLE9BQWxDLEVBQTJDQyxPQUEzQztBQUNILFNBakNMO0FBa0NIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXJDLFdBQU9nRixJQUFQLEdBQWMsVUFBVVQsSUFBVixFQUFnQjtBQUMxQmhFLGNBQ0swRSxFQURMLENBQ1EsT0FEUixFQUNpQixZQURqQixFQUMrQmxCLHVCQUQvQixFQUVLa0IsRUFGTCxDQUVRLE9BRlIsRUFFaUIsY0FGakIsRUFFaUNwRSxZQUZqQzs7QUFJQU4sY0FBTWEsT0FBTixDQUFjLHNCQUFkLEVBQ0s2RCxFQURMLENBQ1EsT0FEUixFQUNpQixhQURqQixFQUNnQ2hCLG9CQURoQyxFQUVLZ0IsRUFGTCxDQUVRLE9BRlIsRUFFaUIsaUNBRmpCLEVBRW9EcEUsWUFGcEQsRUFHS29FLEVBSEwsQ0FHUSxPQUhSLEVBR2lCLGlCQUhqQixFQUdvQ3BFLFlBSHBDLEVBSUtvRSxFQUpMLENBSVEsUUFKUixFQUlrQixhQUpsQixFQUlpQ3ZCLG9CQUpqQyxFQUtLdUIsRUFMTCxDQUtRLFFBTFIsRUFLa0IsdUJBTGxCLEVBSzJDcEIsNkJBTDNDOztBQU9BO0FBQ0F4RCxjQUFNRyxJQUFOLENBQVcsK0JBQVgsRUFBNENFLElBQTVDLENBQWlELFlBQVk7QUFDekQsZ0JBQU13RSxVQUFVNUUsRUFBRSxJQUFGLENBQWhCOztBQUVBNEUsb0JBQVFDLFVBQVIsQ0FBbUIsNkJBQW5COztBQUVBO0FBQ0FELG9CQUFRRSxVQUFSO0FBQ0FGLG9CQUFRLENBQVIsRUFBV0csSUFBWCxDQUFnQkMsR0FBaEIsQ0FBb0IsRUFBcEIsT0FBMkJwRixJQUFJK0IsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0Isb0JBQXhCLEVBQThDLGtCQUE5QyxDQUEzQixFQUFnRyxDQUFoRztBQUNBK0Msb0JBQVEsQ0FBUixFQUFXRyxJQUFYLENBQWdCRSxXQUFoQjtBQUNBTCxvQkFBUSxDQUFSLEVBQVdHLElBQVgsQ0FBZ0JHLFVBQWhCLENBQTJCLENBQTNCO0FBQ0gsU0FWRDs7QUFZQWpCO0FBQ0gsS0ExQkQ7O0FBNEJBLFdBQU92RSxNQUFQO0FBQ0gsQ0FuVEwiLCJmaWxlIjoicXVpY2tfZWRpdC9vdmVydmlldy9lZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBlZGl0LmpzIDIwMTgtMDQtMjRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIFF1aWNrRWRpdCB0YWJsZSBlZGl0aW5nLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2VkaXQnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19ib3hgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9qcXVlcnkuc3Vtb3NlbGVjdC5taW4uanNgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9zdW1vc2VsZWN0Lm1pbi5jc3NgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudGVyIEtleSBDb2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdCBSb3cgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRlZGl0ID0gJHRoaXMuZmluZCgndHIuZWRpdCcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgSW5zdGFuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHtiaW5kaW5nczoge319O1xuXG4gICAgICAgIC8vIER5bmFtaWNhbGx5IGRlZmluZSB0aGUgZWRpdCByb3cgZGF0YS1iaW5kaW5ncy5cbiAgICAgICAgJGVkaXQuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tjb2x1bW5OYW1lXSA9ICQodGhpcykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLmZpcnN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgbW9kaWZpY2F0aW9ucyBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIGxvb2sgZm9yIG1vZGlmaWVkIHZhbHVlcyBhbmQgc2VuZCB0aGVtIHRvIGJhY2stZW5kIHdpdGggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uU2F2ZUNsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzID0gJHRoaXMuZmluZCgnaW5wdXQ6Y2hlY2tib3g6Y2hlY2tlZC5vdmVydmlldy1yb3ctc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBlZGl0ID0ge307XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICAgIGlmICghJGVkaXQucHJvcCgnaGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICAkZWRpdC5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gJCh0aGlzKS5kYXRhKCdjb2x1bW5OYW1lJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gbW9kdWxlLmJpbmRpbmdzW2NvbHVtbk5hbWVdLmdldCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWRpdFtjb2x1bW5OYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkdGFibGVSb3cgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHRhYmxlUm93LmZpbmQoJ2lucHV0OnRleHQubW9kaWZpZWQsIHNlbGVjdC5tb2RpZmllZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5saW5lRWRpdCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgICR0YWJsZVJvdy5maW5kKCdpbnB1dDp0ZXh0Lm1vZGlmaWVkLCBzZWxlY3QubW9kaWZpZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRjZWxsID0gJCh0aGlzKS5jbG9zZXN0KCd0ZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sdW1uSW5kZXggPSAkdGhpcy5EYXRhVGFibGUoKS5jb2x1bW4oJGNlbGwpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gJGVkaXQuZmluZCgndGgnKS5lcShjb2x1bW5JbmRleCkuZGF0YSgnY29sdW1uTmFtZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmxpbmVFZGl0W2NvbHVtbk5hbWVdID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZGF0YVskdGFibGVSb3cuZGF0YSgnaWQnKV0gPSBpbmxpbmVFZGl0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFbJHRhYmxlUm93LmRhdGEoJ2lkJyldID0gZWRpdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCAhJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNT0RBTF9USVRMRV9OT0RFJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ05PX1BST0RVQ1RfU0VMRUNURUQnLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0NMT1NFJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBldmVudCA9PiAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnBhcmVudHMoJy5tb2RhbCcpLm1vZGFsKCdoaWRlJylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZSh0aXRsZSwgbWVzc2FnZSwgYnV0dG9ucyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfY2hlY2tGb3JNb2RpZmljYXRpb25zKGRhdGEpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlc29sdmVSb3dDaGFuZ2VzKCQodGhpcykucGFyZW50cygndHInKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9zYXZlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBmb3IgdmFsdWUgbW9kaWZpY2F0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQ29udGFpbnMgY3VycmVudCByb3cgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB3aGV0aGVyIG1vZGlmaWNhdGlvbnMgd2VyZSBtYWRlIG9yIG5vdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja0Zvck1vZGlmaWNhdGlvbnMoZGF0YSkge1xuICAgICAgICAgICAgbGV0IG1vZGlmaWNhdGlvbkV4aXN0cyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGRhdGFbcHJvcGVydHldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpY2F0aW9uRXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vZGlmaWNhdGlvbkV4aXN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNvbHZlcyByb3cgY2hhbmdlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICRyb3cgU2VsZWN0b3Igb2YgdGhlIHJvdyB0byBiZSByZXNvbHZlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9yZXNvbHZlUm93Q2hhbmdlcygkcm93KSB7XG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLnJvdygkcm93KS5pbmRleCgpO1xuXG4gICAgICAgICAgICAkcm93LmZpbmQoJ2lucHV0OnRleHQsIHNlbGVjdCcpLm5vdCgnLnNlbGVjdC10YXgsIC5zZWxlY3Qtc2hpcHBpbmctdGltZScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjZWxsID0gJCh0aGlzKS5jbG9zZXN0KCd0ZCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKCRjZWxsKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbm5lckhUTUwgPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcmVzIHRoZSBjaGFuZ2Ugb2YgYSB0YXggdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd1RheENoYW5nZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3QgdGF4Q2xhc3NJZCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICBjb25zdCBlZGl0ID0ge307XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICAgIGVkaXRbJ3RheCddID0gdGF4Q2xhc3NJZDtcbiAgICAgICAgICAgIGRhdGFbcHJvZHVjdElkXSA9IGVkaXQ7XG5cbiAgICAgICAgICAgIF9zYXZlKGRhdGEsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdG9yZXMgdGhlIGNoYW5nZSBvZiBhIHNoaXBwaW5nIHRpbWUgdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd1NoaXBwaW5nVGltZUNoYW5nZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hpcHBpbmdUaW1lSWQgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgZWRpdCA9IHt9O1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICBlZGl0WydzaGlwcGluZ1N0YXR1c05hbWUnXSA9IHNoaXBwaW5nVGltZUlkO1xuICAgICAgICAgICAgZGF0YVtwcm9kdWN0SWRdID0gZWRpdDtcblxuICAgICAgICAgICAgX3NhdmUoZGF0YSwgZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaWdnZXIgZmlsdGVyaW5nIG9uY2UgdGhlIHVzZXIgcHJlc3NlcyB0aGUgZW50ZXIga2V5IGluc2lkZSBhIGZpbHRlciBpbnB1dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW5wdXRUZXh0RmlsdGVyS2V5VXAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gRU5URVJfS0VZX0NPREUpIHtcbiAgICAgICAgICAgICAgICAkZWRpdC5maW5kKCcuYXBwbHktZWRpdHMnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaWdnZXIgbW9kaWZpY2F0aW9ucyBzdWJtaXQgb25jZSB0aGUgdXNlciBwcmVzc2VzIHRoZSBlbnRlciBrZXkgaW5zaWRlIGEgZWRpdCBpbnB1dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW5wdXRUZXh0Um93S2V5VXAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gRU5URVJfS0VZX0NPREUpIHtcbiAgICAgICAgICAgICAgICAkZWRpdC5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpLmZpbmQoJy5zYXZlLWJ1bGstcm93LWVkaXRzJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIG1vZGlmaWVkIGRhdGEgd2l0aCBhbiBBSkFYIHJlcXVlc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIENvbnRhaW5zIHRoZSB1cGRhdGVkIGRhdGEuXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlbG9hZD10cnVlXSBSZWxvYWQgdGhlIHBhZ2UgYWZ0ZXIgdGhlIHJlcXVlc3QgaXMgZG9uZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zYXZlKGRhdGEsIHJlbG9hZCA9IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89UXVpY2tFZGl0T3ZlcnZpZXdBamF4L1VwZGF0ZSc7XG4gICAgICAgICAgICBjb25zdCBlZGl0ID0ge1xuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJC5wb3N0KHVybCwgZWRpdClcbiAgICAgICAgICAgICAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlID09PSBcInN0cmluZ1wiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gJC5wYXJzZUpTT04ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlZGl0LmZpbmQoJ2lucHV0LCBzZWxlY3QnKS5ub3QoJy5sZW5ndGgsIC5zZWxlY3QtcGFnZS1tb2RlJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlZGl0LmZpbmQoJ3NlbGVjdCcpLm5vdCgnLmxlbmd0aCwgLnNlbGVjdC1wYWdlLW1vZGUnKS5tdWx0aV9zZWxlY3QoJ3JlZnJlc2gnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udGVudCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVUNDRVNTX1BST0RVQ1RfVVBEQVRFRCcsICdhZG1pbl9xdWlja19lZGl0Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnJlbG9hZChudWxsLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNob3cgc3VjY2VzcyBtZXNzYWdlIGluIHRoZSBhZG1pbiBpbmZvIGJveC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmluZm9fYm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNT0RBTF9USVRMRV9OT0RFJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFRElUX0VSUk9SJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DTE9TRScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGV2ZW50ID0+ICQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkZWRpdFxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAnaW5wdXQ6dGV4dCcsIF9vbklucHV0VGV4dEZpbHRlcktleVVwKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmFwcGx5LWVkaXRzJywgX29uU2F2ZUNsaWNrKTtcblxuICAgICAgICAgICAgJGVkaXQucGFyZW50cygnLnF1aWNrLWVkaXQub3ZlcnZpZXcnKVxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAndGQuZWRpdGFibGUnLCBfb25JbnB1dFRleHRSb3dLZXlVcClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4tZ3JvdXAgLnNhdmUtYnVsay1yb3ctZWRpdHMnLCBfb25TYXZlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuc2F2ZS1yb3ctZWRpdHMnLCBfb25TYXZlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC10YXgnLCBfb25UYWJsZVJvd1RheENoYW5nZSlcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsICcuc2VsZWN0LXNoaXBwaW5nLXRpbWUnLCBfb25UYWJsZVJvd1NoaXBwaW5nVGltZUNoYW5nZSk7XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgdGhlIGVsZW1lbnRzLlxuICAgICAgICAgICAgJHRoaXMuZmluZCgnW2RhdGEtc2luZ2xlX3NlbGVjdC1pbnN0YW5jZV0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkc2VsZWN0ID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICAgICRzZWxlY3QucmVtb3ZlQXR0cignZGF0YS1zaW5nbGVfc2VsZWN0LWluc3RhbmNlJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBJbnN0YW50aWF0ZSB0aGUgd2lkZ2V0IHdpdGhvdXQgYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgICAgICAgICRzZWxlY3QuU3Vtb1NlbGVjdCgpO1xuICAgICAgICAgICAgICAgICRzZWxlY3RbMF0uc3Vtby5hZGQoJycsIGAke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUT09MVElQX05PX0NIQU5HRVMnLCAnYWRtaW5fcXVpY2tfZWRpdCcpfWAsIDApO1xuICAgICAgICAgICAgICAgICRzZWxlY3RbMF0uc3Vtby51blNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgICAgICRzZWxlY3RbMF0uc3Vtby5zZWxlY3RJdGVtKDApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
