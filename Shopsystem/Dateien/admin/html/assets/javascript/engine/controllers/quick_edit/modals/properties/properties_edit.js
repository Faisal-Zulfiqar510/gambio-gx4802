'use strict';

/* --------------------------------------------------------------
 edit.js 2016-10-25
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Properties Table Editing Controller
 *
 * Handles the editing functionality of the properties modal table.
 */
gx.controllers.module('properties_edit', ['modal', jse.source + '/vendor/sumoselect/jquery.sumoselect.min.js', jse.source + '/vendor/sumoselect/sumoselect.min.css'], function (data) {

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
    var $edit = $this.find('tr.properties-edit');

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
        var $checkedSingleCheckboxes = $this.find('input:checkbox:checked.properties-row-selection');
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
     * Trigger filtering once the user presses the enter key inside a filter input.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onInputTextFilterKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $edit.find('.apply-properties-edits').trigger('click');
        }
    }

    /**
     * Trigger modifications submit once the user presses the enter key inside a edit input.
     *
     * @param {jQuery.Event} event Contains event information.
     */
    function _onInputTextRowKeyUp(event) {
        if (event.which === ENTER_KEY_CODE) {
            $edit.parents('.properties.modal').find('.save-properties-bulk-row-edits').trigger('click');
        }
    }

    /**
     * Stores the change of a shipping time value.
     */
    function _onTableRowShippingTimeChange() {
        var propertiesId = $(this).parents('tr').attr('id');
        var shippingTimeId = $(this).val();
        var edit = {};
        var data = {};

        edit['combiShippingStatusName'] = shippingTimeId;
        data[propertiesId] = edit;

        _save(data, false);
    }

    /**
     * Stores the change of a price type value.
     */
    function _onTableRowPriceTypeChange() {
        var propertiesId = $(this).parents('tr').attr('id');
        var priceType = $(this).val();
        var edit = {};
        var data = {};

        edit['combiPriceType'] = priceType;
        data[propertiesId] = edit;

        _save(data, false);
    }

    /**
     * Save modified data with an AJAX request.
     *
     * @param {Object} data Contains the updated data.
     * @param {Boolean} [reload=true] Reload the page after the request is done.
     */
    function _save(data) {
        var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditProductPropertiesAjax/Update';
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

                if (reload) {
                    $this.DataTable().ajax.reload();
                }

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
        $this.on('change', '.select-properties-shipping-time', _onTableRowShippingTimeChange).on('change', '.select-properties-price-type', _onTableRowPriceTypeChange);

        $edit.on('keyup', 'input:text', _onInputTextFilterKeyUp).on('click', '.apply-properties-edits', _onSaveClick);

        $edit.parents('.quick-edit.properties').on('keyup', 'td.editable', _onInputTextRowKeyUp);

        $edit.parents('.properties.modal').on('click', '.save-properties-edits', _onSaveClick).on('click', '.save-properties-bulk-row-edits', _onSaveClick);

        // Initialize the elements.
        $this.find('[data-single_select-instance]').each(function () {
            var $select = $(this);

            $select.removeAttr('data-single_select-instance');

            // Instantiate the widget without an AJAX request.
            $select.SumoSelect();
            $select[0].sumo.add('', '' + jse.core.lang.translate('TOOLTIP_NO_CHANGES', 'admin_quick_edit'), 0);
            $select[0].sumo.unSelectAll();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19lZGl0LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiRU5URVJfS0VZX0NPREUiLCIkdGhpcyIsIiQiLCIkZWRpdCIsImZpbmQiLCJiaW5kaW5ncyIsImVhY2giLCJjb2x1bW5OYW1lIiwiZmlyc3QiLCJfb25TYXZlQ2xpY2siLCIkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMiLCJlZGl0IiwibGVuZ3RoIiwidGl0bGUiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIm1lc3NhZ2UiLCJidXR0b25zIiwiY2FsbGJhY2siLCJldmVudCIsImN1cnJlbnRUYXJnZXQiLCJwYXJlbnRzIiwibW9kYWwiLCJsaWJzIiwic2hvd01lc3NhZ2UiLCJ2YWx1ZSIsImdldCIsIiR0YWJsZVJvdyIsImlubGluZUVkaXQiLCIkY2VsbCIsImNsb3Nlc3QiLCJjb2x1bW5JbmRleCIsIkRhdGFUYWJsZSIsImNvbHVtbiIsImluZGV4IiwiZXEiLCJ2YWwiLCJhdHRyIiwicHJvcCIsInRyaWdnZXIiLCJfY2hlY2tGb3JNb2RpZmljYXRpb25zIiwiX3Jlc29sdmVSb3dDaGFuZ2VzIiwiX3NhdmUiLCJtb2RpZmljYXRpb25FeGlzdHMiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiaXNFbXB0eU9iamVjdCIsIiRyb3ciLCJyb3dJbmRleCIsInJvdyIsInBhcmVudEVsZW1lbnQiLCJpbm5lckhUTUwiLCJjZWxsIiwiX29uSW5wdXRUZXh0RmlsdGVyS2V5VXAiLCJ3aGljaCIsIl9vbklucHV0VGV4dFJvd0tleVVwIiwiX29uVGFibGVSb3dTaGlwcGluZ1RpbWVDaGFuZ2UiLCJwcm9wZXJ0aWVzSWQiLCJzaGlwcGluZ1RpbWVJZCIsIl9vblRhYmxlUm93UHJpY2VUeXBlQ2hhbmdlIiwicHJpY2VUeXBlIiwicmVsb2FkIiwidXJsIiwiY29uZmlnIiwicGFnZVRva2VuIiwicG9zdCIsImRvbmUiLCJyZXNwb25zZSIsInBhcnNlSlNPTiIsInN1Y2Nlc3MiLCJub3QiLCJtdWx0aV9zZWxlY3QiLCJhamF4IiwiaW5pdCIsIm9uIiwiJHNlbGVjdCIsInJlbW92ZUF0dHIiLCJTdW1vU2VsZWN0Iiwic3VtbyIsImFkZCIsInVuU2VsZWN0QWxsIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGlCQURKLEVBR0ksQ0FDSSxPQURKLEVBRU9DLElBQUlDLE1BRlgsa0RBR09ELElBQUlDLE1BSFgsMkNBSEosRUFTSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBOzs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFFBQVFGLE1BQU1HLElBQU4sQ0FBVyxvQkFBWCxDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1SLFNBQVMsRUFBQ1MsVUFBVSxFQUFYLEVBQWY7O0FBRUE7QUFDQUYsVUFBTUMsSUFBTixDQUFXLElBQVgsRUFBaUJFLElBQWpCLENBQXNCLFlBQVk7QUFDOUIsWUFBTUMsYUFBYUwsRUFBRSxJQUFGLEVBQVFILElBQVIsQ0FBYSxZQUFiLENBQW5COztBQUVBLFlBQUlRLGVBQWUsVUFBZixJQUE2QkEsZUFBZSxTQUFoRCxFQUEyRDtBQUN2RCxtQkFBTyxJQUFQO0FBQ0g7O0FBRURYLGVBQU9TLFFBQVAsQ0FBZ0JFLFVBQWhCLElBQThCTCxFQUFFLElBQUYsRUFBUUUsSUFBUixDQUFhLGVBQWIsRUFBOEJJLEtBQTlCLEVBQTlCO0FBQ0gsS0FSRDs7QUFVQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0MsWUFBVCxHQUF3QjtBQUNwQixZQUFNQywyQkFBMkJULE1BQU1HLElBQU4sQ0FBVyxpREFBWCxDQUFqQztBQUNBLFlB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QW9CLEVBQXBCLE9BQTJCbkYsSUFBSWlCLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLG9CQUF4QixFQUE4QyxrQkFBOUMsQ0FBM0IsRUFBZ0csQ0FBaEc7QUFDQTRELG9CQUFRLENBQVIsRUFBV0csSUFBWCxDQUFnQkUsV0FBaEI7QUFDSCxTQVREOztBQVdBZDtBQUNILEtBNUJEOztBQThCQSxXQUFPdkUsTUFBUDtBQUNILENBN1NMIiwiZmlsZSI6InF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19lZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBlZGl0LmpzIDIwMTYtMTAtMjVcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFByb3BlcnRpZXMgVGFibGUgRWRpdGluZyBDb250cm9sbGVyXG4gKlxuICogSGFuZGxlcyB0aGUgZWRpdGluZyBmdW5jdGlvbmFsaXR5IG9mIHRoZSBwcm9wZXJ0aWVzIG1vZGFsIHRhYmxlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3Byb3BlcnRpZXNfZWRpdCcsXG5cbiAgICBbXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9zdW1vc2VsZWN0L2pxdWVyeS5zdW1vc2VsZWN0Lm1pbi5qc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9zdW1vc2VsZWN0L3N1bW9zZWxlY3QubWluLmNzc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRW50ZXIgS2V5IENvZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IEVOVEVSX0tFWV9DT0RFID0gMTM7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFZGl0IFJvdyBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGVkaXQgPSAkdGhpcy5maW5kKCd0ci5wcm9wZXJ0aWVzLWVkaXQnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7YmluZGluZ3M6IHt9fTtcblxuICAgICAgICAvLyBEeW5hbWljYWxseSBkZWZpbmUgdGhlIGVkaXQgcm93IGRhdGEtYmluZGluZ3MuXG4gICAgICAgICRlZGl0LmZpbmQoJ3RoJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5OYW1lID0gJCh0aGlzKS5kYXRhKCdjb2x1bW5OYW1lJyk7XG5cbiAgICAgICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnY2hlY2tib3gnIHx8IGNvbHVtbk5hbWUgPT09ICdhY3Rpb25zJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb2R1bGUuYmluZGluZ3NbY29sdW1uTmFtZV0gPSAkKHRoaXMpLmZpbmQoJ2lucHV0LCBzZWxlY3QnKS5maXJzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIG1vZGlmaWNhdGlvbnMgZXZlbnQgaGFuZGxlci5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBtZXRob2Qgd2lsbCBsb29rIGZvciBtb2RpZmllZCB2YWx1ZXMgYW5kIHNlbmQgdGhlbSB0byBiYWNrLWVuZCB3aXRoIGFuIEFKQVggcmVxdWVzdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNhdmVDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0ICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcyA9ICR0aGlzLmZpbmQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQucHJvcGVydGllcy1yb3ctc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBlZGl0ID0ge307XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICAgIGlmICgkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTU9EQUxfVElUTEVfTk9ERScsICdhZG1pbl9xdWlja19lZGl0Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdOT19QUk9EVUNUX1NFTEVDVEVEJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBidXR0b25zID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DTE9TRScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZXZlbnQgPT4gJChldmVudC5jdXJyZW50VGFyZ2V0KS5wYXJlbnRzKCcubW9kYWwnKS5tb2RhbCgnaGlkZScpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UodGl0bGUsIG1lc3NhZ2UsIGJ1dHRvbnMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkZWRpdC5maW5kKCd0aCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSAkKHRoaXMpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2x1bW5OYW1lID09PSAnY2hlY2tib3gnIHx8IGNvbHVtbk5hbWUgPT09ICdhY3Rpb25zJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBtb2R1bGUuYmluZGluZ3NbY29sdW1uTmFtZV0uZ2V0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWRpdFtjb2x1bW5OYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkY2hlY2tlZFNpbmdsZUNoZWNrYm94ZXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgJHRhYmxlUm93ID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCR0YWJsZVJvdy5maW5kKCdpbnB1dDp0ZXh0Lm1vZGlmaWVkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5saW5lRWRpdCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgICR0YWJsZVJvdy5maW5kKCdpbnB1dDp0ZXh0Lm1vZGlmaWVkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCAkY2VsbCA9ICQodGhpcykuY2xvc2VzdCgndGQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gJHRoaXMuRGF0YVRhYmxlKCkuY29sdW1uKCRjZWxsKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29sdW1uTmFtZSA9ICRlZGl0LmZpbmQoJ3RoJykuZXEoY29sdW1uSW5kZXgpLmRhdGEoJ2NvbHVtbk5hbWUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5saW5lRWRpdFtjb2x1bW5OYW1lXSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbJHRhYmxlUm93LmF0dHIoJ2lkJyldID0gaW5saW5lRWRpdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkYXRhWyR0YWJsZVJvdy5hdHRyKCdpZCcpXSA9IGVkaXQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgISQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnKSlcbiAgICAgICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChfY2hlY2tGb3JNb2RpZmljYXRpb25zKGRhdGEpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICRjaGVja2VkU2luZ2xlQ2hlY2tib3hlcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3Jlc29sdmVSb3dDaGFuZ2VzKCQodGhpcykucGFyZW50cygndHInKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9zYXZlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrcyBmb3IgdmFsdWUgbW9kaWZpY2F0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQ29udGFpbnMgY3VycmVudCByb3cgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7Ym9vbGVhbn0gUmV0dXJucyB3aGV0aGVyIG1vZGlmaWNhdGlvbnMgd2VyZSBtYWRlIG9yIG5vdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja0Zvck1vZGlmaWNhdGlvbnMoZGF0YSkge1xuICAgICAgICAgICAgbGV0IG1vZGlmaWNhdGlvbkV4aXN0cyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghJC5pc0VtcHR5T2JqZWN0KGRhdGFbcHJvcGVydHldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpY2F0aW9uRXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vZGlmaWNhdGlvbkV4aXN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNvbHZlcyByb3cgY2hhbmdlcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICRyb3cgU2VsZWN0b3Igb2YgdGhlIHJvdyB0byBiZSByZXNvbHZlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9yZXNvbHZlUm93Q2hhbmdlcygkcm93KSB7XG4gICAgICAgICAgICBjb25zdCByb3dJbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLnJvdygkcm93KS5pbmRleCgpO1xuXG4gICAgICAgICAgICAkcm93LmZpbmQoJ2lucHV0OnRleHQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCAkY2VsbCA9ICQodGhpcykuY2xvc2VzdCgndGQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2x1bW5JbmRleCA9ICR0aGlzLkRhdGFUYWJsZSgpLmNvbHVtbigkY2VsbCkuaW5kZXgoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5pbm5lckhUTUwgPSAkdGhpcy5EYXRhVGFibGUoKS5jZWxsKHJvd0luZGV4LCBjb2x1bW5JbmRleCkuZGF0YSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVHJpZ2dlciBmaWx0ZXJpbmcgb25jZSB0aGUgdXNlciBwcmVzc2VzIHRoZSBlbnRlciBrZXkgaW5zaWRlIGEgZmlsdGVyIGlucHV0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25JbnB1dFRleHRGaWx0ZXJLZXlVcChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBFTlRFUl9LRVlfQ09ERSkge1xuICAgICAgICAgICAgICAgICRlZGl0LmZpbmQoJy5hcHBseS1wcm9wZXJ0aWVzLWVkaXRzJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUcmlnZ2VyIG1vZGlmaWNhdGlvbnMgc3VibWl0IG9uY2UgdGhlIHVzZXIgcHJlc3NlcyB0aGUgZW50ZXIga2V5IGluc2lkZSBhIGVkaXQgaW5wdXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbklucHV0VGV4dFJvd0tleVVwKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IEVOVEVSX0tFWV9DT0RFKSB7XG4gICAgICAgICAgICAgICAgJGVkaXQucGFyZW50cygnLnByb3BlcnRpZXMubW9kYWwnKS5maW5kKCcuc2F2ZS1wcm9wZXJ0aWVzLWJ1bGstcm93LWVkaXRzJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdG9yZXMgdGhlIGNoYW5nZSBvZiBhIHNoaXBwaW5nIHRpbWUgdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25UYWJsZVJvd1NoaXBwaW5nVGltZUNoYW5nZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3BlcnRpZXNJZCA9ICQodGhpcykucGFyZW50cygndHInKS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hpcHBpbmdUaW1lSWQgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgZWRpdCA9IHt9O1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgICAgICAgICBlZGl0Wydjb21iaVNoaXBwaW5nU3RhdHVzTmFtZSddID0gc2hpcHBpbmdUaW1lSWQ7XG4gICAgICAgICAgICBkYXRhW3Byb3BlcnRpZXNJZF0gPSBlZGl0O1xuXG4gICAgICAgICAgICBfc2F2ZShkYXRhLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU3RvcmVzIHRoZSBjaGFuZ2Ugb2YgYSBwcmljZSB0eXBlIHZhbHVlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uVGFibGVSb3dQcmljZVR5cGVDaGFuZ2UoKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0aWVzSWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuYXR0cignaWQnKTtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlVHlwZSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICBjb25zdCBlZGl0ID0ge307XG4gICAgICAgICAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAgICAgICAgIGVkaXRbJ2NvbWJpUHJpY2VUeXBlJ10gPSBwcmljZVR5cGU7XG4gICAgICAgICAgICBkYXRhW3Byb3BlcnRpZXNJZF0gPSBlZGl0O1xuXG4gICAgICAgICAgICBfc2F2ZShkYXRhLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2F2ZSBtb2RpZmllZCBkYXRhIHdpdGggYW4gQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBDb250YWlucyB0aGUgdXBkYXRlZCBkYXRhLlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxvYWQ9dHJ1ZV0gUmVsb2FkIHRoZSBwYWdlIGFmdGVyIHRoZSByZXF1ZXN0IGlzIGRvbmUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2F2ZShkYXRhLCByZWxvYWQgPSB0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVF1aWNrRWRpdFByb2R1Y3RQcm9wZXJ0aWVzQWpheC9VcGRhdGUnO1xuICAgICAgICAgICAgY29uc3QgZWRpdCA9IHtcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICQucG9zdCh1cmwsIGVkaXQpXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9ICQucGFyc2VKU09OKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWRpdC5maW5kKCdpbnB1dCwgc2VsZWN0Jykubm90KCcubGVuZ3RoLCAuc2VsZWN0LXBhZ2UtbW9kZScpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWRpdC5maW5kKCdzZWxlY3QnKS5ub3QoJy5sZW5ndGgsIC5zZWxlY3QtcGFnZS1tb2RlJykubXVsdGlfc2VsZWN0KCdyZWZyZXNoJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdNT0RBTF9USVRMRV9OT0RFJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFRElUX0VSUk9SJywgJ2FkbWluX3F1aWNrX2VkaXQnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DTE9TRScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGV2ZW50ID0+ICQoZXZlbnQuY3VycmVudFRhcmdldCkucGFyZW50cygnLm1vZGFsJykubW9kYWwoJ2hpZGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKHRpdGxlLCBtZXNzYWdlLCBidXR0b25zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgJy5zZWxlY3QtcHJvcGVydGllcy1zaGlwcGluZy10aW1lJywgX29uVGFibGVSb3dTaGlwcGluZ1RpbWVDaGFuZ2UpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnLnNlbGVjdC1wcm9wZXJ0aWVzLXByaWNlLXR5cGUnLCBfb25UYWJsZVJvd1ByaWNlVHlwZUNoYW5nZSk7XG5cbiAgICAgICAgICAgICRlZGl0XG4gICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsICdpbnB1dDp0ZXh0JywgX29uSW5wdXRUZXh0RmlsdGVyS2V5VXApXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuYXBwbHktcHJvcGVydGllcy1lZGl0cycsIF9vblNhdmVDbGljayk7XG5cbiAgICAgICAgICAgICRlZGl0LnBhcmVudHMoJy5xdWljay1lZGl0LnByb3BlcnRpZXMnKVxuICAgICAgICAgICAgICAgIC5vbigna2V5dXAnLCAndGQuZWRpdGFibGUnLCBfb25JbnB1dFRleHRSb3dLZXlVcCk7XG5cbiAgICAgICAgICAgICRlZGl0LnBhcmVudHMoJy5wcm9wZXJ0aWVzLm1vZGFsJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5zYXZlLXByb3BlcnRpZXMtZWRpdHMnLCBfb25TYXZlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuc2F2ZS1wcm9wZXJ0aWVzLWJ1bGstcm93LWVkaXRzJywgX29uU2F2ZUNsaWNrKTtcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgZWxlbWVudHMuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCdbZGF0YS1zaW5nbGVfc2VsZWN0LWluc3RhbmNlXScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRzZWxlY3QgPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgJHNlbGVjdC5yZW1vdmVBdHRyKCdkYXRhLXNpbmdsZV9zZWxlY3QtaW5zdGFuY2UnKTtcblxuICAgICAgICAgICAgICAgIC8vIEluc3RhbnRpYXRlIHRoZSB3aWRnZXQgd2l0aG91dCBhbiBBSkFYIHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgJHNlbGVjdC5TdW1vU2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgJHNlbGVjdFswXS5zdW1vLmFkZCgnJywgYCR7anNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RPT0xUSVBfTk9fQ0hBTkdFUycsICdhZG1pbl9xdWlja19lZGl0Jyl9YCwgMCk7XG4gICAgICAgICAgICAgICAgJHNlbGVjdFswXS5zdW1vLnVuU2VsZWN0QWxsKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
