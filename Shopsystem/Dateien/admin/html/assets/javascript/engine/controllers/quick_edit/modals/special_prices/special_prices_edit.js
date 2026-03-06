'use strict';

/* --------------------------------------------------------------
 special_price_edit.js 2016-10-25
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Special Price Edit Controller
 *
 * This controller handles the special price editing functionality.
 */
gx.controllers.module('special_prices_edit', ['modal', jse.source + '/vendor/sumoselect/jquery.sumoselect.min.js', jse.source + '/vendor/sumoselect/sumoselect.min.css'], function (data) {

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
    var $edit = $this.find('tr.special-price-edit');

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = { bindings: {} };

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
     * Save modified data with an AJAX request.
     *
     * @param {Object} data Contains the updated data.
     */
    function _save(data) {
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditSpecialPricesAjax/Update';
        var edit = {
            data: data,
            pageToken: jse.core.config.get('pageToken')
        };

        $.post(url, edit).done(function (response) {
            $this.DataTable().draw();

            if (typeof response === "string") {
                response = $.parseJSON(response);
            }

            if (response.success) {
                $edit.find('input, select').not('.length, .select-page-mode').val('');
                $edit.find('select').not('.length, .select-page-mode').multi_select('refresh');

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
     * Deletes special price entries for provided products.
     *
     * @param {Number[]} products Contains the product IDs.
     */
    function _delete(products) {
        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditSpecialPricesAjax/Delete';
        var edit = {
            products: products,
            pageToken: jse.core.config.get('pageToken')
        };

        $.post(url, edit).done(function (response) {
            $this.DataTable().draw();

            if (typeof response === "string") {
                response = $.parseJSON(response);
            }

            if (response.success) {
                $edit.find('input, select').not('.length, .select-page-mode').val('');
                $edit.find('select').not('.length, .select-page-mode').multi_select('refresh');

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
     * Save modifications event handler.
     *
     * This method will look for modified values and send them to back-end with an AJAX request.
     */
    function _onSaveClick() {
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.special-price-row-selection');
        var edit = {};
        var data = {};

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

        $checkedSingleCheckboxes.each(function () {
            var $tableRow = $(this).parents('tr');

            if ($tableRow.find('input:text.modified').length > 0) {
                var inlineEdit = {};

                $tableRow.find('input:text.modified').each(function () {
                    var $cell = $(this).closest('td');
                    var columnIndex = $this.DataTable().column($cell).index();
                    var columnName = $edit.find('th').eq(columnIndex).data('columnName');

                    inlineEdit[columnName] = $(this).val();
                });

                data[$tableRow.attr('id')] = inlineEdit;
            } else {
                data[$tableRow.attr('id')] = edit;
            }

            $(this).prop('checked', !$(this).prop('checked')).trigger('change');
        });

        if (_checkForModifications(data) === false) {
            $checkedSingleCheckboxes.each(function () {
                _resolveRowChanges($(this).parents('tr'));
            });

            return;
        }

        _save(data);
    }

    /**
     * Delete special prices event handler.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onDeleteClick(event) {
        var products = [];

        // Perform delete row action.
        if ($(event.target).is('.row-delete-special-price')) {
            products.push($(this).parents('tr').attr('id'));
            $(this).prop('checked', !$(this).prop('checked')).trigger('change');
            _delete(products);
            return;
        }

        // Perform delete bulk selection action.
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.special-price-row-selection');

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

        $checkedSingleCheckboxes.each(function () {
            products.push($(this).parents('tr').attr('id'));
            $(this).prop('checked', !$(this).prop('checked')).trigger('change');
        });

        _delete(products);
    }

    /**
     * Checks for value modifications.
     *
     * @param {Object} data Contains current row data.
     *
     * @return {boolean} Returns whether modifications were made or not.
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

        $row.find('input:text').each(function () {
            var $cell = $(this).closest('td');
            var columnIndex = $this.DataTable().column($cell).index();
            this.parentElement.innerHTML = $this.DataTable().cell(rowIndex, columnIndex).data();
        });
    }

    /**
     * Cancel modifications event handler.
     */
    function _onCancelClick() {
        var $pageMode = $(this).closest('thead').find('.select-special-price-page-mode');
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.special-price-row-selection');

        if ($pageMode.val() == 'edit-mode') {
            $pageMode.val('filter-mode');
        } else {
            $pageMode.val('edit-mode');
        }

        $checkedSingleCheckboxes.each(function () {
            $(this).prop('checked', !$(this).prop('checked')).trigger('change');

            _resolveRowChanges($(this).parents('tr'));
        });

        _pageModeChange();
    }

    /**
     * Page Mode Change Callback
     */
    function _pageModeChange() {
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
     * Trigger filtering once the user presses the enter key inside a filter input.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onInputTextFilterKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $edit.find('.apply-special-price-edits').trigger('click');
        }
    }

    /**
     * Trigger modifications submit once the user presses the enter key inside a edit input.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onInputTextRowKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $edit.parents('.special-prices.modal').find('.save-special-price-bulk-row-edits').trigger('click');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $edit.on('keyup', 'input:text', _onInputTextFilterKeyUp).on('click', '.apply-special-price-edits', _onSaveClick).on('click', '.cancel-special-price-edits', _onCancelClick);

        $edit.parents('.quick-edit.special-price').on('keyup', 'td.editable', _onInputTextRowKeyUp).on('click', '.row-delete-special-price', _onDeleteClick);

        $edit.parents('.special-prices.modal').on('click', '.save-special-price-edits', _onSaveClick).on('click', '.save-special-price-bulk-row-edits', _onSaveClick).on('click', '.bulk-delete-special-price', _onDeleteClick);

        $this.find('[data-single_select-instance]').each(function () {
            var $select = $(this);

            $select.removeAttr('data-single_select-instance');

            $select.SumoSelect();
            $select[0].sumo.add('', '' + jse.core.lang.translate('TOOLTIP_NO_CHANGES', 'admin_quick_edit'), 0);
            $select[0].sumo.unSelectAll();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3NwZWNpYWxfcHJpY2VzL3NwZWNpYWxfcHJpY2VzX2VkaXQuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCJFTlRFUl9LRVlfQ09ERSIsIiR0aGlzIiwiJCIsIiRlZGl0IiwiZmluZCIsImJpbmRpbmdzIiwiZWFjaCIsImNvbHVtbk5hbWUiLCJmaXJzdCIsIl9zYXZlIiwidXJsIiwiY29yZSIsImNvbmZpZyIsImdldCIsImVkaXQiLCJwYWdlVG9rZW4iLCJwb3N0IiwiZG9uZSIsIkRhdGFUYWJsZSIsImRyYXciLCJyZXNwb25zZSIsInBhcnNlSlNPTiIsInN1Y2Nlc3MiLCJub3QiLCJ2YWwiLCJtdWx0aV9zZWxlY3QiLCJ0aXRsZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJtZXNzYWdlIiwiYnV0dG9ucyIsImNhbGxiYWNrIiwiZXZlbnQiLCJjdXJyZW50VGFyZ2V0IiwicGFyZW50cyIsIm1vZGFsIiwibGlicyIsInNob3dNZXNzYWdlIiwiX2RlbGV0ZSIsInByb2R1Y3RzIiwiX29uU2F2ZUNsaWNrIiwiJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzIiwibGVuZ3RoIiwidmFsdWUiLCIkdGFibGVSb3ciLCJpbmxpbmVFZGl0IiwiJGNlbGwiLCJjbG9zZXN0IiwiY29sdW1uSW5kZXgiLCJjb2x1bW4iLCJpbmRleCIsImVxIiwiYXR0ciIsInByb3AiLCJ0cmlnZ2VyIiwiX2NoZWNrRm9yTW9kaWZpY2F0aW9ucyIsIl9yZXNvbHZlUm93Q2hhbmdlcyIsIl9vbkRlbGV0ZUNsaWNrIiwidGFyZ2V0IiwiaXMiLCJwdXNoIiwibW9kaWZpY2F0aW9uRXhpc3RzIiwicHJvcGVydHkiLCJoYXNPd25Qcm9wZXJ0eSIsImlzRW1wdHlPYmplY3QiLCIkcm93Iiwicm93SW5kZXgiLCJyb3ciLCJwYXJlbnRFbGVtZW50IiwiaW5uZXJIVE1MIiwiY2VsbCIsIl9vbkNhbmNlbENsaWNrIiwiJHBhZ2VNb2RlIiwiX3BhZ2VNb2RlQ2hhbmdlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIl9vbklucHV0VGV4dEZpbHRlcktleVVwIiwid2hpY2giLCJfb25JbnB1dFRleHRSb3dLZXlVcCIsImluaXQiLCJvbiIsIiRzZWxlY3QiLCJyZW1vdmVBdHRyIiwiU3Vtb1NlbGVjdCIsInN1bW8iLCJhZGQiLCJ1blNlbGVjdEFsbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxxQkFESixFQUdJLENBQ0ksT0FESixFQUVPQyxJQUFJQyxNQUZYLGtEQUdPRCxJQUFJQyxNQUhYLDJDQUhKLEVBU0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLGlCQUFpQixFQUF2Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxRQUFRRixNQUFNRyxJQUFOLENBQVcsdUJBQVgsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNUixTQUFTLEVBQUNTLFVBQVUsRUFBWCxFQUFmOztBQUVBRixVQUFNQyxJQUFOLENBQVcsSUFBWCxFQUFpQkUsSUFBakIsQ0FBc0IsWUFBWTtBQUM5QixZQUFNQyxhQUFhTCxFQUFFLElBQUYsRUFBUUgsSUFBUixDQUFhLFlBQWIsQ0FBbkI7O0FBRUEsWUFBSVEsZUFBZSxVQUFmLElBQTZCQSxlQUFlLFNBQWhELEVBQTJEO0FBQ3ZELG1CQUFPLElBQVA7QUFDSDs7QUFFRFgsZUFBT1MsUUFBUCxDQUFnQkUsVUFBaEIsSUFBOEJMLEVBQUUsSUFBRixFQUFRRSxJQUFSLENBQWEsZUFBYixFQUE4QkksS0FBOUIsRUFBOUI7QUFDSCxLQVJEOztBQVVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxhQUFTQyxLQUFULENBQWVWLElBQWYsRUFBcUI7QUFDakIsWUFBTVcsTUFBTWIsSUFBSWMs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QixFQUFwQixPQUEyQnhGLElBQUljLElBQUosQ0FBU2dCLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixvQkFBeEIsRUFBOEMsa0JBQTlDLENBQTNCLEVBQWdHLENBQWhHO0FBQ0FxRCxvQkFBUSxDQUFSLEVBQVdHLElBQVgsQ0FBZ0JFLFdBQWhCO0FBQ0gsU0FSRDs7QUFVQXJFO0FBQ0gsS0ExQkQ7O0FBNEJBLFdBQU9yQixNQUFQO0FBQ0gsQ0FsWUwiLCJmaWxlIjoicXVpY2tfZWRpdC9tb2RhbHMvc3BlY2lhbF9wcmljZXMvc3BlY2lhbF9wcmljZXNfZWRpdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3BlY2lhbF9wcmljZV9lZGl0LmpzIDIwMTYtMTAtMjVcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFNwZWNpYWwgUHJpY2UgRWRpdCBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGhhbmRsZXMgdGhlIHNwZWNpYWwgcHJpY2UgZWRpdGluZyBmdW5jdGlvbmFsaXR5LlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3NwZWNpYWxfcHJpY2VzX2VkaXQnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9qcXVlcnkuc3Vtb3NlbGVjdC5taW4uanNgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3Ivc3Vtb3NlbGVjdC9zdW1vc2VsZWN0Lm1pbi5jc3NgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudGVyIEtleSBDb2RlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdCBSb3cgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRlZGl0ID0gJHRoaXMuZmluZCgndHIuc3BlY2lhbC1wcmljZS1lZGl0Jyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge2JpbmRpbmdzOiB7fX07XG5cbiAgICAgICAgJGVkaXQuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgaWYgKGNvbHVtbk5hbWUgPT09ICdjaGVja2JveCcgfHwgY29sdW1uTmFtZSA9PT0gJ2FjdGlvbnMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1vZHVsZS5iaW5kaW5nc1tjb2x1bW5OYW1lXSA9ICQodGhpcykuZmluZCgnaW5wdXQsIHNlbGVjdCcpLmZpcnN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhdmUgbW9kaWZpZWQgZGF0YSB3aXRoIGFuIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQ29udGFpbnMgdGhlIHVwZGF0ZWQgZGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zYXZlKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89UXVpY2tFZGl0U3BlY2lhbFByaWNlc0FqYXgvVXBkYXRlJztcbiAgICAgICAgICAgIGNvbnN0IGVkaXQgPSB7XG4gICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkLnBvc3QodXJsLCBlZGl0KVxuICAgICAgICAgICAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9ICQucGFyc2VKU09OKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWRpdC5maW5kKCdpbnB1dCwgc2VsZWN0Jykubm90KCcubGVuZ3RoLCAuc2VsZWN0LXBhZ2UtbW9kZScpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWRpdC5maW5kKCdzZWxlY3QnKS5ub3QoJy5sZW5ndGgsIC5zZWxlY3QtcGFnZS1tb2RlJykubXVsdGlfc2VsZWN0KCdyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01PREFMX1RJVExFX05PREUnLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0VESVRfRVJST1InLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBidXR0b25zID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0NMT1NFJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZXZlbnQgPT4gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UsIGJ1dHRvbnMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZXMgc3BlY2lhbCBwcmljZSBlbnRyaWVzIGZvciBwcm92aWRlZCBwcm9kdWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJbXX0gcHJvZHVjdHMgQ29udGFpbnMgdGhlIHByb2R1Y3QgSURzLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2RlbGV0ZShwcm9kdWN0cykge1xuICAgICAgICAgICAgY29uc3QgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRTcGVjaWFsUHJpY2VzQWpheC9EZWxldGUnO1xuICAgICAgICAgICAgY29uc3QgZWRpdCA9IHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0cyxcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkLnBvc3QodXJsLCBlZGl0KVxuICAgICAgICAgICAgICAgIC5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuZHJhdygpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gJC5wYXJzZUpTT04ocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlZGl0LmZpbmQoJ2lucHV0LCBzZWxlY3QnKS5ub3QoJy5sZW5ndGgsIC5zZWxlY3QtcGFnZS1tb2RlJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlZGl0LmZpbmQoJ3NlbGVjdCcpLm5vdCgnLmxlbmd0aCwgLnNlbGVjdC1wYWdlLW1vZGUnKS5tdWx0aV9zZWxlY3QoJ3JlZnJlc2gnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTU9EQUxfVElUTEVfTk9ERScsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRURJVF9FUlJPUicsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fQ0xPU0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBldmVudCA9PiAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnBhcmVudHMoJy5tb2RhbCcpLm1vZGFsKCdoaWRlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZSh0aXRsZSwgbWVzc2FnZSwgYnV0dG9ucyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSBtb2RpZmljYXRpb25zIGV2ZW50IGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgbG9vayBmb3IgbW9kaWZpZWQgdmFsdWVzIGFuZCBzZW5kIHRoZW0gdG8gYmFjay1lbmQgd2l0aCBhbiBBSkFYIHJlcXVlc3QuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25TYXZlQ2xpY2soKSB7XG4gICAgICAgICAgICBjb25zdCAkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMgPSAkdGhpcy5maW5kKCdpbnB1dDpjaGVja2JveDpjaGVja2VkLnNwZWNpYWwtcHJpY2Utcm93LXNlbGVjdGlvbicpO1xuICAgICAgICAgICAgY29uc3QgZWRpdCA9IHt9O1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICBpZiAoJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01PREFMX1RJVExFX05PREUnLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTk9fUFJPRFVDVF9TRUxFQ1RFRCcsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fQ0xPU0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGV2ZW50ID0+ICQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGVkaXQuZmluZCgndGgnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gJCh0aGlzKS5kYXRhKCdjb2x1bW5OYW1lJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29sdW1uTmFtZSA9PT0gJ2NoZWNrYm94JyB8fCBjb2x1bW5OYW1lID09PSAnYWN0aW9ucycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gbW9kdWxlLmJpbmRpbmdzW2NvbHVtbk5hbWVdLmdldCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRbY29sdW1uTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICR0YWJsZVJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcblxuICAgICAgICAgICAgICAgIGlmICgkdGFibGVSb3cuZmluZCgnaW5wdXQ6dGV4dC5tb2RpZmllZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlubGluZUVkaXQgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAkdGFibGVSb3cuZmluZCgnaW5wdXQ6dGV4dC5tb2RpZmllZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNlbGwgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbigkY2VsbCkuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkZWRpdC5maW5kKCd0aCcpLmVxKGNvbHVtbkluZGV4KS5kYXRhKCdjb2x1bW5OYW1lJyk7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lRWRpdFtjb2x1bW5OYW1lXSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbJHRhYmxlUm93LmF0dHIoJ2lkJyldID0gaW5saW5lRWRpdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhWyR0YWJsZVJvdy5hdHRyKCdpZCcpXSA9IGVkaXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgISQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChfY2hlY2tGb3JNb2RpZmljYXRpb25zKGRhdGEpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlc29sdmVSb3dDaGFuZ2VzKCQodGhpcykucGFyZW50cygndHInKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9zYXZlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0ZSBzcGVjaWFsIHByaWNlcyBldmVudCBoYW5kbGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25EZWxldGVDbGljayhldmVudCkge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjdHMgPSBbXTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSBkZWxldGUgcm93IGFjdGlvbi5cbiAgICAgICAgICAgIGlmICgkKGV2ZW50LnRhcmdldCkuaXMoJy5yb3ctZGVsZXRlLXNwZWNpYWwtcHJpY2UnKSkge1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJykpO1xuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsICEkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgX2RlbGV0ZShwcm9kdWN0cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQZXJmb3JtIGRlbGV0ZSBidWxrIHNlbGVjdGlvbiBhY3Rpb24uXG4gICAgICAgICAgICBjb25zdCAkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMgPSAkdGhpcy5maW5kKCdpbnB1dDpjaGVja2JveDpjaGVja2VkLnNwZWNpYWwtcHJpY2Utcm93LXNlbGVjdGlvbicpO1xuXG4gICAgICAgICAgICBpZiAoJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ01PREFMX1RJVExFX05PREUnLCAnYWRtaW5fcXVpY2tfZWRpdCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTk9fUFJPRFVDVF9TRUxFQ1RFRCcsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fQ0xPU0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGV2ZW50ID0+ICQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGNoZWNrZWRTaW5nbGVDaGVja2JveGVzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzLnB1c2goJCh0aGlzKS5wYXJlbnRzKCd0cicpLmF0dHIoJ2lkJykpO1xuICAgICAgICAgICAgICAgICQodGhpcykucHJvcCgnY2hlY2tlZCcsICEkKHRoaXMpLnByb3AoJ2NoZWNrZWQnKSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX2RlbGV0ZShwcm9kdWN0cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGZvciB2YWx1ZSBtb2RpZmljYXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBDb250YWlucyBjdXJyZW50IHJvdyBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufSBSZXR1cm5zIHdoZXRoZXIgbW9kaWZpY2F0aW9ucyB3ZXJlIG1hZGUgb3Igbm90LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NoZWNrRm9yTW9kaWZpY2F0aW9ucyhkYXRhKSB7XG4gICAgICAgICAgICBsZXQgbW9kaWZpY2F0aW9uRXhpc3RzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHByb3BlcnR5IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkLmlzRW1wdHlPYmplY3QoZGF0YVtwcm9wZXJ0eV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmljYXRpb25FeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW9kaWZpY2F0aW9uRXhpc3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc29sdmVzIHJvdyBjaGFuZ2VzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHJvdyBTZWxlY3RvciBvZiB0aGUgcm93IHRvIGJlIHJlc29sdmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3Jlc29sdmVSb3dDaGFuZ2VzKCRyb3cpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkucm93KCRyb3cpLmluZGV4KCk7XG5cbiAgICAgICAgICAgICRyb3cuZmluZCgnaW5wdXQ6dGV4dCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRjZWxsID0gJCh0aGlzKS5jbG9zZXN0KCd0ZCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKCRjZWxsKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbm5lckhUTUwgPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FuY2VsIG1vZGlmaWNhdGlvbnMgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkNhbmNlbENsaWNrKCkge1xuICAgICAgICAgICAgY29uc3QgJHBhZ2VNb2RlID0gJCh0aGlzKS5jbG9zZXN0KCd0aGVhZCcpLmZpbmQoJy5zZWxlY3Qtc3BlY2lhbC1wcmljZS1wYWdlLW1vZGUnKTtcbiAgICAgICAgICAgIGNvbnN0ICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcyA9ICR0aGlzLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQuc3BlY2lhbC1wcmljZS1yb3ctc2VsZWN0aW9uJyk7XG5cbiAgICAgICAgICAgIGlmICgkcGFnZU1vZGUudmFsKCkgPT0gJ2VkaXQtbW9kZScpIHtcbiAgICAgICAgICAgICAgICAkcGFnZU1vZGUudmFsKCdmaWx0ZXItbW9kZScpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRwYWdlTW9kZS52YWwoJ2VkaXQtbW9kZScpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnByb3AoJ2NoZWNrZWQnLCAhJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcpKVxuICAgICAgICAgICAgICAgICAgICAudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICAgICAgICAgICAgICBfcmVzb2x2ZVJvd0NoYW5nZXMoJCh0aGlzKS5wYXJlbnRzKCd0cicpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfcGFnZU1vZGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQYWdlIE1vZGUgQ2hhbmdlIENhbGxiYWNrXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcGFnZU1vZGVDaGFuZ2UoKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnZWRpdC1tb2RlJykge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RyLnNwZWNpYWwtcHJpY2UtZmlsdGVyJykuYXR0cignaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndHIuc3BlY2lhbC1wcmljZS1lZGl0JykuYXR0cignaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ3RoZWFkIHRyOmZpcnN0LWNoaWxkIHRoJykuYWRkQ2xhc3MoJ2VkaXQtbW9kZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5zcGVjaWFsLXByaWNlLWZpbHRlcicpLmF0dHIoJ2hpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0ci5zcGVjaWFsLXByaWNlLWVkaXQnKS5hdHRyKCdoaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0aGVhZCB0cjpmaXJzdC1jaGlsZCB0aCcpLnJlbW92ZUNsYXNzKCdlZGl0LW1vZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmlnZ2VyIGZpbHRlcmluZyBvbmNlIHRoZSB1c2VyIHByZXNzZXMgdGhlIGVudGVyIGtleSBpbnNpZGUgYSBmaWx0ZXIgaW5wdXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbklucHV0VGV4dEZpbHRlcktleVVwKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IEVOVEVSX0tFWV9DT0RFKSB7XG4gICAgICAgICAgICAgICAgJGVkaXQuZmluZCgnLmFwcGx5LXNwZWNpYWwtcHJpY2UtZWRpdHMnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyaWdnZXIgbW9kaWZpY2F0aW9ucyBzdWJtaXQgb25jZSB0aGUgdXNlciBwcmVzc2VzIHRoZSBlbnRlciBrZXkgaW5zaWRlIGEgZWRpdCBpbnB1dC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uSW5wdXRUZXh0Um93S2V5VXAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gRU5URVJfS0VZX0NPREUpIHtcbiAgICAgICAgICAgICAgICAkZWRpdC5wYXJlbnRzKCcuc3BlY2lhbC1wcmljZXMubW9kYWwnKS5maW5kKCcuc2F2ZS1zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXRzJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkZWRpdFxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAnaW5wdXQ6dGV4dCcsIF9vbklucHV0VGV4dEZpbHRlcktleVVwKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmFwcGx5LXNwZWNpYWwtcHJpY2UtZWRpdHMnLCBfb25TYXZlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuY2FuY2VsLXNwZWNpYWwtcHJpY2UtZWRpdHMnLCBfb25DYW5jZWxDbGljayk7XG5cbiAgICAgICAgICAgICRlZGl0LnBhcmVudHMoJy5xdWljay1lZGl0LnNwZWNpYWwtcHJpY2UnKVxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAndGQuZWRpdGFibGUnLCBfb25JbnB1dFRleHRSb3dLZXlVcClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5yb3ctZGVsZXRlLXNwZWNpYWwtcHJpY2UnLCBfb25EZWxldGVDbGljayk7XG5cbiAgICAgICAgICAgICRlZGl0LnBhcmVudHMoJy5zcGVjaWFsLXByaWNlcy5tb2RhbCcpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuc2F2ZS1zcGVjaWFsLXByaWNlLWVkaXRzJywgX29uU2F2ZUNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnNhdmUtc3BlY2lhbC1wcmljZS1idWxrLXJvdy1lZGl0cycsIF9vblNhdmVDbGljaylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idWxrLWRlbGV0ZS1zcGVjaWFsLXByaWNlJywgX29uRGVsZXRlQ2xpY2spO1xuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdbZGF0YS1zaW5nbGVfc2VsZWN0LWluc3RhbmNlXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRzZWxlY3QgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgJHNlbGVjdC5yZW1vdmVBdHRyKCdkYXRhLXNpbmdsZV9zZWxlY3QtaW5zdGFuY2UnKTtcblxuICAgICAgICAgICAgICAgICRzZWxlY3QuU3Vtb1NlbGVjdCgpO1xuICAgICAgICAgICAgICAgICRzZWxlY3RbMF0uc3Vtby5hZGQoJycsIGAke2pzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUT09MVElQX05PX0NIQU5HRVMnLCAnYWRtaW5fcXVpY2tfZWRpdCcpfWAsIDApO1xuICAgICAgICAgICAgICAgICRzZWxlY3RbMF0uc3Vtby51blNlbGVjdEFsbCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
