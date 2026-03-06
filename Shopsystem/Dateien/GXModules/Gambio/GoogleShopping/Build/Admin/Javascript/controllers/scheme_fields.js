'use strict';

/* --------------------------------------------------------------
 scheme_fields.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module('scheme_fields', ['loading_spinner', 'modal', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.js'], function (data) {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Deleting modal object
     *
     * @type {jQuery}
     */
    var $modals = {
        'edit': $('.scheme-field.modal'),
        'delete': $('.delete-field.modal')
    };

    /**
     * Sortable list
     *
     * @type {jQuery}
     */
    var $sortableList = $('.fields-list');

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * URLs for deleting different types of content
     *
     * @type {{deleteScheme: string, runExport: string}}
     */
    var urls = {
        'getFieldData': 'admin.php?do=GoogleShoppingAjax/getSchemeFieldData',
        'saveFieldData': 'admin.php?do=GoogleShoppingAjax/storeSchemeField',
        'deleteField': 'admin.php?do=GoogleShoppingAjax/deleteSchemeField',
        'updateStatus': 'admin.php?do=GoogleShoppingAjax/setSchemeFieldStatus',
        'saveSorting': 'admin.php?do=GoogleShoppingAjax/saveSchemeFieldsSorting'
    };

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Delete field
     *
     * Runs the post call to the Google Shopping ajax handler to delete the given scheme
     */
    function _deleteField(schemeId, fieldId, $fieldRow) {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: urls.deleteField,
            data: {
                'schemeId': schemeId,
                'fieldId': fieldId
            },
            success: function success(response) {
                if (response['success'] === true) {
                    $fieldRow.remove();
                }

                $modals.delete.modal('hide');
            },
            error: function error() {
                $modals.delete.modal('hide');
            }
        });
    }

    /**
     * Updates the field modal
     *
     * Resets the modal and changes the title and the input values depending of the action
     */
    function _updateFieldModal(action) {
        var fieldData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

        if (fieldData === undefined) {
            fieldData = {
                'schemeId': '',
                'name': '',
                'value': '',
                'default': ''
            };
        }

        if (action === 'create') {
            $modals.edit.find('.modal-title').text(jse.core.lang.translate('FIELD_MODAL_TITLE_CREATE', 'google_shopping'));
        } else if (action === 'edit') {
            $modals.edit.find('.modal-title').text(jse.core.lang.translate('FIELD_MODAL_TITLE_EDIT', 'google_shopping'));
        }

        $modals.edit.find('select.collective-field option').prop("selected", false);
        $modals.edit.find('select.field-variable').val('');
        $modals.edit.find('div.collective-field').addClass('hidden');
        $modals.edit.find('input[name="schemeId"]').val(fieldData.schemeId);
        $modals.edit.find('input[name="name"]').val(fieldData.name);
        $modals.edit.find('input[name="value"]').val(fieldData.value);
        $modals.edit.find('input[name="default"]').val(fieldData.default);
        $modals.edit.find('div.field-variable-description').text('').addClass('hidden');
    }

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Click handler for the create field button
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _showCreateModal(event) {
        // Prevent default action.
        event.preventDefault();

        // Show field creation modal
        _updateFieldModal('create');
        $modals.edit.modal('show');
    }

    /**
     * Click handler for the edit field icons
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _showEditModal(event) {
        // Prevent default action.
        event.preventDefault();

        // Collect field id
        var fieldId = $(this).data('field-id');

        // Fetch data with ajax controller ...
        $.ajax({
            type: "GET",
            dataType: "json",
            url: urls.getFieldData + '&fieldId=' + fieldId,
            success: function success(response) {
                // Display modal with field data on success
                if (response.success === true) {
                    _updateFieldModal('edit', {
                        'schemeId': fieldId,
                        'name': response.data.field_name,
                        'value': response.data.field_content,
                        'default': response.data.field_content_default
                    });
                    $modals.edit.modal('show');
                }
            },
            error: function error() {
                jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), jse.core.lang.translate('ERROR_AJAX_FAILED', 'google_shopping'));
            }
        });
    }

    /**
     * Click handler for the delete field icons
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _showDeleteModal(event) {
        // Prevent default action.
        event.preventDefault();

        // Collect several data
        var schemeId = $('.schemeId').val();
        var fieldId = $(this).data('field-id');
        var $fieldRow = $(this).closest('li');

        // Show modal
        $.ajax({
            type: "GET",
            dataType: "json",
            url: urls.getFieldData + '&fieldId=' + fieldId,
            success: function success(response) {
                // Display modal with field data on success
                if (response.success === true) {
                    $modals.delete.find('fieldset.field-data div.field-name').text(response.data.field_name);
                    $modals.delete.find('fieldset.field-data div.field-content').text(response.data.field_content);
                    $modals.delete.find('fieldset.field-data div.field-content-default').text(response.data.field_content_default);
                }
                $modals.delete.modal('show');
            },
            error: function error() {
                jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), jse.core.lang.translate('ERROR_AJAX_FAILED', 'google_shopping'));
            }
        });

        // Handle delete confirmation modal button click event
        var $confirmButton = $modals.delete.find('button.confirm');
        $confirmButton.off('click').on('click', function () {
            return _deleteField(schemeId, fieldId, $fieldRow);
        });
    }

    /**
     * Click handler for the scheme field status switcher
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _updateFieldStatus(event) {
        // Collect several data
        var schemeId = $('.schemeId').val();
        var fieldId = $(this).data('field-id');
        var newStatus = 0;
        if ($(this).is(':checked')) {
            newStatus = 1;
        }

        // Call ajax controller to update field status
        $.ajax({
            type: "POST",
            dataType: "json",
            url: urls.updateStatus,
            data: {
                'schemeId': schemeId,
                'fieldId': fieldId,
                'newStatus': newStatus
            },
            success: function success(response) {
                if (response.success === true) {
                    $modals.edit.modal('hide');
                }
            },
            error: function error() {
                jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), jse.core.lang.translate('ERROR_AJAX_FAILED', 'google_shopping'));
            }
        });
    }

    /**
     * Sorting event handler for sortable plugin
     *
     * Makes a call to the ajax controller after a sorting event
     *
     * @param {object} event jQuery event object contains information of the event.
     * @param {object} ui    Sortable list (ul) object with new sort order
     */
    function _saveSorting(event, ui) {
        if (!ui.item.parent().is('ul')) {
            $sortableList.sortable('cancel');
        }

        $.ajax({
            url: urls.saveSorting,
            dataType: "json",
            method: 'POST',
            data: {
                'schemeId': $('.schemeId').val(),
                'sorting': $sortableList.sortable('toArray', { attribute: 'data-field-id' })
            },
            success: function success(response) {
                if (response.success === false) {
                    jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), jse.core.lang.translate('ERROR_SORTING_FAILED', 'google_shopping'));
                }
            },
            error: function error() {
                jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), jse.core.lang.translate('ERROR_SORTING_FAILED', 'google_shopping'));
            }
        });
    }

    /**
     * Click handler to save scheme field data
     *
     * Collects the scheme field data from the edit/create modal and makes an ajax call to save them into the db.
     */
    function _saveFieldData() {
        // Collect several data
        var schemeId = $('.schemeId').val();
        var fieldId = $modals.edit.find('input[name="schemeId"]').val();
        var $fieldRow = $this.find('li[data-field-id="' + fieldId + '"]');

        var fieldName = $modals.edit.find('input[name="name"]').val();
        var fieldValue = $modals.edit.find('input[name="value"]').val();
        var fieldDefault = $modals.edit.find('input[name="default"]').val();

        // Make ajax call to ajax controller to save field data
        $.ajax({
            type: "POST",
            dataType: "json",
            url: urls.saveFieldData,
            data: {
                'schemeId': schemeId,
                'fieldId': fieldId,
                'fieldName': fieldName,
                'fieldValue': fieldValue,
                'fieldDefault': fieldDefault
            },
            success: function success(response) {
                if (response.success === true) {
                    if (fieldId === '') {
                        $this.find('.fields-list').append('\n\t\t\t\t\t\t\t\t<li class="scheme-field" data-field-id="' + response.fieldId + '">\n\t\t\t\t\t\t\t\t\t<span class="col-md-5 field-name">' + fieldName.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<span class="col-md-2 status">\n\t\t\t\t\t\t\t\t\t\t<span class="gx-container" data-gx-widget="switcher">\n\t\t\t\t\t\t\t\t\t\t\t<input type="checkbox"\n\t\t\t\t\t\t\t\t\t\t\t       class="field-status"\n\t\t\t\t\t\t\t\t\t\t\t       data-field-id="' + response.fieldId + '"\n\t\t\t\t\t\t\t\t\t\t\t\t   name="' + fieldName + '_status"\n\t\t\t\t\t\t\t\t\t\t\t\t   value="1" checked/>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t\t<span class="col-md-5 actions">\n\t\t\t\t\t\t\t\t\t\t<span class="actions-container">\n\t\t\t\t\t\t\t\t\t\t\t<a class="edit-field" href="#" data-field-id="' + response.fieldId + '">\n\t\t\t\t\t\t\t\t\t\t\t\t<i class="fa fa-pencil"></i>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<a class="delete-field" href="#" data-field-id="' + response.fieldId + '">\n\t\t\t\t\t\t\t\t\t\t\t\t<i class="fa fa-trash-o"></i>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t\t<a class="sort-handle">\n\t\t\t\t\t\t\t\t\t\t\t\t<i class="fa fa-sort"></i>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t');

                        $this.find('.fields-list .scheme-field:last a.edit-field').on('click', _showEditModal);
                        $this.find('.fields-list .scheme-field:last a.delete-field').on('click', _showDeleteModal);
                        $this.find('.fields-list .scheme-field:last input.field-status').on('change', _updateFieldStatus);

                        gx.widgets.init($this);
                    } else {
                        $fieldRow.find('.field-name').text(fieldName.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
                    }

                    $modals.edit.modal('hide');
                }
            }
        });
    }

    /**
     * Change handler for field variable in field modal
     *
     * Displays the collective fields dropdown if field variable dropdown has the correct value
     */
    function _fieldVariableChanged() {
        $modals.edit.find('div.field-variable-description').text($(this).find('option:selected')[0]['title']).removeClass('hidden');

        if ($(this).val() === 'collective_field') {
            $modals.edit.find('div.collective-field').removeClass('hidden');
        } else {
            $modals.edit.find('div.collective-field').addClass('hidden');
        }
    }

    /**
     * Click handler for add field variable button
     *
     * Adds the text for the field variable to the field value input
     */
    function _addFieldVariable(event) {
        // Prevent default action.
        event.preventDefault();

        // Collect some data
        var currentValue = $modals.edit.find('input[name="value"]').val();
        var variable = $modals.edit.find('select.field-variable').val();

        if (variable === 'collective_field') {
            // Collect selected attributes, properties, additional fields and their sources
            var atttributes = $modals.edit.find('select.collective-field').val();
            var sources = [];
            $modals.edit.find('select.collective-field').children('optgroup').each(function () {
                if ($(this).children('option:selected').length > 0) {
                    sources.push($(this).data('source'));
                }
            });

            // Add text for collective field
            $modals.edit.find('input[name="value"]').val(currentValue + '{collective_field||' + atttributes.join(';') + '||' + sources.join(';') + '}');
        } else {
            // Add text for normal field varaible
            $modals.edit.find('input[name="value"]').val(currentValue + '{' + variable + '}');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('a.create-field').on('click', _showCreateModal);
        $('a.edit-field').on('click', _showEditModal);
        $('a.delete-field').on('click', _showDeleteModal);
        $('input.field-status').on('change', _updateFieldStatus);

        $modals.edit.find('button.confirm').on('click', _saveFieldData);
        $modals.edit.find('select.field-variable').on('change', _fieldVariableChanged);
        $modals.edit.find('a.add-field-variable').on('click', _addFieldVariable);

        $sortableList.sortable({
            items: 'li.scheme-field',
            axis: 'y',
            cursor: 'move',
            handle: '.sort-handle',
            containment: 'document',
            placeholder: 'sort-placeholder'
        }).on('sortupdate', _saveSorting).disableSelection();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvc2NoZW1lX2ZpZWxkcy5qcyJdLCJuYW1lcyI6WyJneG1vZHVsZXMiLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkbW9kYWxzIiwiJHNvcnRhYmxlTGlzdCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsInVybHMiLCJfZGVsZXRlRmllbGQiLCJzY2hlbWVJZCIsImZpZWxkSWQiLCIkZmllbGRSb3ciLCJhamF4IiwidHlwZSIsImRhdGFUeXBlIiwidXJsIiwiZGVsZXRlRmllbGQiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJyZW1vdmUiLCJkZWxldGUiLCJtb2RhbCIsImVycm9yIiwiX3VwZGF0ZUZpZWxkTW9kYWwiLCJhY3Rpb24iLCJmaWVsZERhdGEiLCJ1bmRlZmluZWQiLCJlZGl0IiwiZmluZCIsInRleHQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsInByb3AiLCJ2YWwiLCJhZGRDbGFzcyIsIm5hbWUiLCJ2YWx1ZSIsImRlZmF1bHQiLCJfc2hvd0NyZWF0ZU1vZGFsIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsIl9zaG93RWRpdE1vZGFsIiwiZ2V0RmllbGREYXRhIiwiZmllbGRfbmFtZSIsImZpZWxkX2NvbnRlbnQiLCJmaWVsZF9jb250ZW50X2RlZmF1bHQiLCJsaWJzIiwic2hvd01lc3NhZ2UiLCJfc2hvd0RlbGV0ZU1vZGFsIiwiY2xvc2VzdCIsIiRjb25maXJtQnV0dG9uIiwib2ZmIiwib24iLCJfdXBkYXRlRmllbGRTdGF0dXMiLCJuZXdTdGF0dXMiLCJpcyIsInVwZGF0ZVN0YXR1cyIsIl9zYXZlU29ydGluZyIsInVpIiwiaXRlbSIsInBhcmVudCIsInNvcnRhYmxlIiwic2F2ZVNvcnRpbmciLCJtZXRob2QiLCJhdHRyaWJ1dGUiLCJfc2F2ZUZpZWxkRGF0YSIsImZpZWxkTmFtZSIsImZpZWxkVmFsdWUiLCJmaWVsZERlZmF1bHQiLCJzYXZlRmllbGREYXRhIiwiYXBwZW5kIiwicmVwbGFjZSIsImd4Iiwid2lkZ2V0cyIsImluaXQiLCJfZmllbGRWYXJpYWJsZUNoYW5nZWQiLCJyZW1vdmVDbGFzcyIsIl9hZGRGaWVsZFZhcmlhYmxlIiwiY3VycmVudFZhbHVlIiwidmFyaWFibGUiLCJhdHR0cmlidXRlcyIsInNvdXJjZXMiLCJjaGlsZHJlbiIsImVhY2giLCJsZW5ndGgiLCJwdXNoIiwiam9pbiIsImRvbmUiLCJpdGVtcyIsImF4aXMiLCJjdXJzb3IiLCJoYW5kbGUiLCJjb250YWlubWVudCIsInBsYWNlaG9sZGVyIiwiZGlzYWJsZVNlbGVjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxVQUFVQyxXQUFWLENBQXNCQyxNQUF0QixDQUNJLGVBREosRUFHSSxDQUNJLGlCQURKLEVBRUksT0FGSixFQUdPQyxJQUFJQyxNQUhYLCtDQUlPRCxJQUFJQyxNQUpYLHlDQUhKLEVBVUksVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVTtBQUNaLGdCQUFRRCxFQUFFLHFCQUFGLENBREk7QUFFWixrQkFBVUEsRUFBRSxxQkFBRjtBQUZFLEtBQWhCOztBQUtBOzs7OztBQUtBLFFBQU1FLGdCQUFnQkYsRUFBRSxjQUFGLENBQXRCOztBQUVBOzs7OztBQUtBLFFBQU1HLFdBQVcsRUFBakI7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUosRUFBRUssTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkwsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTVEsT0FBTztBQUNULHdCQUFnQixvREFEUDtBQUVULHlCQUFpQixrREFGUjtBQUdULHVCQUFlLG1EQUhOO0FBSVQsd0JBQWdCLHNEQUpQO0FBS1QsdUJBQWU7QUFMTixLQUFiOztB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cUJDLFFBQXJCLEdBQWdDLEdBQTdFO0FBQ0g7QUFDSjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFwRixXQUFPK0UsSUFBUCxHQUFjLFVBQVVhLElBQVYsRUFBZ0I7QUFDMUJ2RixVQUFFLGdCQUFGLEVBQW9Cb0QsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0NkLGdCQUFoQztBQUNBdEMsVUFBRSxjQUFGLEVBQWtCb0QsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEJYLGNBQTlCO0FBQ0F6QyxVQUFFLGdCQUFGLEVBQW9Cb0QsRUFBcEIsQ0FBdUIsT0FBdkIsRUFBZ0NKLGdCQUFoQztBQUNBaEQsVUFBRSxvQkFBRixFQUF3Qm9ELEVBQXhCLENBQTJCLFFBQTNCLEVBQXFDQyxrQkFBckM7O0FBRUFwRCxnQkFBUXlCLElBQVIsQ0FBYUMsSUFBYixDQUFrQixnQkFBbEIsRUFBb0N5QixFQUFwQyxDQUF1QyxPQUF2QyxFQUFnRGEsY0FBaEQ7QUFDQWhFLGdCQUFReUIsSUFBUixDQUFhQyxJQUFiLENBQWtCLHVCQUFsQixFQUEyQ3lCLEVBQTNDLENBQThDLFFBQTlDLEVBQXdEdUIscUJBQXhEO0FBQ0ExRSxnQkFBUXlCLElBQVIsQ0FBYUMsSUFBYixDQUFrQixzQkFBbEIsRUFBMEN5QixFQUExQyxDQUE2QyxPQUE3QyxFQUFzRHlCLGlCQUF0RDs7QUFFQTNFLHNCQUNLMkQsUUFETCxDQUNjO0FBQ04yQixtQkFBTyxpQkFERDtBQUVOQyxrQkFBTSxHQUZBO0FBR05DLG9CQUFRLE1BSEY7QUFJTkMsb0JBQVEsY0FKRjtBQUtOQyx5QkFBYSxVQUxQO0FBTU5DLHlCQUFhO0FBTlAsU0FEZCxFQVNLekMsRUFUTCxDQVNRLFlBVFIsRUFTc0JLLFlBVHRCLEVBVUtxQyxnQkFWTDs7QUFZQVA7QUFDSCxLQXZCRDs7QUF5QkEsV0FBTzVGLE1BQVA7QUFDSCxDQTNkTCIsImZpbGUiOiJBZG1pbi9KYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3NjaGVtZV9maWVsZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNjaGVtZV9maWVsZHMuanMgMjAxOS0wNy0xMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4bW9kdWxlcy5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3NjaGVtZV9maWVsZHMnLFxuXG4gICAgW1xuICAgICAgICAnbG9hZGluZ19zcGlubmVyJyxcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5taW4uY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aS5qc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlbGV0aW5nIG1vZGFsIG9iamVjdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJG1vZGFscyA9IHtcbiAgICAgICAgICAgICdlZGl0JzogJCgnLnNjaGVtZS1maWVsZC5tb2RhbCcpLFxuICAgICAgICAgICAgJ2RlbGV0ZSc6ICQoJy5kZWxldGUtZmllbGQubW9kYWwnKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTb3J0YWJsZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkc29ydGFibGVMaXN0ID0gJCgnLmZpZWxkcy1saXN0Jyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVSTHMgZm9yIGRlbGV0aW5nIGRpZmZlcmVudCB0eXBlcyBvZiBjb250ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7ZGVsZXRlU2NoZW1lOiBzdHJpbmcsIHJ1bkV4cG9ydDogc3RyaW5nfX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHVybHMgPSB7XG4gICAgICAgICAgICAnZ2V0RmllbGREYXRhJzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvZ2V0U2NoZW1lRmllbGREYXRhJyxcbiAgICAgICAgICAgICdzYXZlRmllbGREYXRhJzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvc3RvcmVTY2hlbWVGaWVsZCcsXG4gICAgICAgICAgICAnZGVsZXRlRmllbGQnOiAnYWRtaW4ucGhwP2RvPUdvb2dsZVNob3BwaW5nQWpheC9kZWxldGVTY2hlbWVGaWVsZCcsXG4gICAgICAgICAgICAndXBkYXRlU3RhdHVzJzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvc2V0U2NoZW1lRmllbGRTdGF0dXMnLFxuICAgICAgICAgICAgJ3NhdmVTb3J0aW5nJzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvc2F2ZVNjaGVtZUZpZWxkc1NvcnRpbmcnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBIRUxQRVIgRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgZmllbGRcbiAgICAgICAgICpcbiAgICAgICAgICogUnVucyB0aGUgcG9zdCBjYWxsIHRvIHRoZSBHb29nbGUgU2hvcHBpbmcgYWpheCBoYW5kbGVyIHRvIGRlbGV0ZSB0aGUgZ2l2ZW4gc2NoZW1lXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZGVsZXRlRmllbGQoc2NoZW1lSWQsIGZpZWxkSWQsICRmaWVsZFJvdykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLmRlbGV0ZUZpZWxkLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjaGVtZUlkJzogc2NoZW1lSWQsXG4gICAgICAgICAgICAgICAgICAgICdmaWVsZElkJzogZmllbGRJZFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZVsnc3VjY2VzcyddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZmllbGRSb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmRlbGV0ZS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFscy5kZWxldGUubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSBmaWVsZCBtb2RhbFxuICAgICAgICAgKlxuICAgICAgICAgKiBSZXNldHMgdGhlIG1vZGFsIGFuZCBjaGFuZ2VzIHRoZSB0aXRsZSBhbmQgdGhlIGlucHV0IHZhbHVlcyBkZXBlbmRpbmcgb2YgdGhlIGFjdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3VwZGF0ZUZpZWxkTW9kYWwoYWN0aW9uLCBmaWVsZERhdGEgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChmaWVsZERhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZpZWxkRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjaGVtZUlkJzogJycsXG4gICAgICAgICAgICAgICAgICAgICduYW1lJzogJycsXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6ICcnLFxuICAgICAgICAgICAgICAgICAgICAnZGVmYXVsdCc6ICcnXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgICAgICAgICAkbW9kYWxzLmVkaXQuZmluZCgnLm1vZGFsLXRpdGxlJylcbiAgICAgICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0ZJRUxEX01PREFMX1RJVExFX0NSRUFURScsICdnb29nbGVfc2hvcHBpbmcnKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ2VkaXQnKSB7XG4gICAgICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJy5tb2RhbC10aXRsZScpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdGSUVMRF9NT0RBTF9USVRMRV9FRElUJywgJ2dvb2dsZV9zaG9wcGluZycpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ3NlbGVjdC5jb2xsZWN0aXZlLWZpZWxkIG9wdGlvbicpLnByb3AoXCJzZWxlY3RlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICAkbW9kYWxzLmVkaXQuZmluZCgnc2VsZWN0LmZpZWxkLXZhcmlhYmxlJykudmFsKCcnKTtcbiAgICAgICAgICAgICRtb2RhbHMuZWRpdC5maW5kKCdkaXYuY29sbGVjdGl2ZS1maWVsZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICRtb2RhbHMuZWRpdC5maW5kKCdpbnB1dFtuYW1lPVwic2NoZW1lSWRcIl0nKS52YWwoZmllbGREYXRhLnNjaGVtZUlkKTtcbiAgICAgICAgICAgICRtb2RhbHMuZWRpdC5maW5kKCdpbnB1dFtuYW1lPVwibmFtZVwiXScpLnZhbChmaWVsZERhdGEubmFtZSk7XG4gICAgICAgICAgICAkbW9kYWxzLmVkaXQuZmluZCgnaW5wdXRbbmFtZT1cInZhbHVlXCJdJykudmFsKGZpZWxkRGF0YS52YWx1ZSk7XG4gICAgICAgICAgICAkbW9kYWxzLmVkaXQuZmluZCgnaW5wdXRbbmFtZT1cImRlZmF1bHRcIl0nKS52YWwoZmllbGREYXRhLmRlZmF1bHQpO1xuICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ2Rpdi5maWVsZC12YXJpYWJsZS1kZXNjcmlwdGlvbicpXG4gICAgICAgICAgICAgICAgLnRleHQoJycpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgdGhlIGNyZWF0ZSBmaWVsZCBidXR0b25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3Nob3dDcmVhdGVNb2RhbChldmVudCkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbi5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgZmllbGQgY3JlYXRpb24gbW9kYWxcbiAgICAgICAgICAgIF91cGRhdGVGaWVsZE1vZGFsKCdjcmVhdGUnKTtcbiAgICAgICAgICAgICRtb2RhbHMuZWRpdC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgZm9yIHRoZSBlZGl0IGZpZWxkIGljb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RWRpdE1vZGFsKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gQ29sbGVjdCBmaWVsZCBpZFxuICAgICAgICAgICAgY29uc3QgZmllbGRJZCA9ICQodGhpcykuZGF0YSgnZmllbGQtaWQnKTtcblxuICAgICAgICAgICAgLy8gRmV0Y2ggZGF0YSB3aXRoIGFqYXggY29udHJvbGxlciAuLi5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLmdldEZpZWxkRGF0YSArICcmZmllbGRJZD0nICsgZmllbGRJZCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSBtb2RhbCB3aXRoIGZpZWxkIGRhdGEgb24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3VwZGF0ZUZpZWxkTW9kYWwoJ2VkaXQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NjaGVtZUlkJzogZmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6IHJlc3BvbnNlLmRhdGEuZmllbGRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiByZXNwb25zZS5kYXRhLmZpZWxkX2NvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RlZmF1bHQnOiByZXNwb25zZS5kYXRhLmZpZWxkX2NvbnRlbnRfZGVmYXVsdFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmVkaXQubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfVElUTEUnLCAnZ29vZ2xlX3Nob3BwaW5nJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfQUpBWF9GQUlMRUQnLCAnZ29vZ2xlX3Nob3BwaW5nJylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgZGVsZXRlIGZpZWxkIGljb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RGVsZXRlTW9kYWwoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0IHNldmVyYWwgZGF0YVxuICAgICAgICAgICAgY29uc3Qgc2NoZW1lSWQgPSAkKCcuc2NoZW1lSWQnKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkSWQgPSAkKHRoaXMpLmRhdGEoJ2ZpZWxkLWlkJyk7XG4gICAgICAgICAgICBjb25zdCAkZmllbGRSb3cgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJyk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgbW9kYWxcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLmdldEZpZWxkRGF0YSArICcmZmllbGRJZD0nICsgZmllbGRJZCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRGlzcGxheSBtb2RhbCB3aXRoIGZpZWxkIGRhdGEgb24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFscy5kZWxldGUuZmluZCgnZmllbGRzZXQuZmllbGQtZGF0YSBkaXYuZmllbGQtbmFtZScpLnRleHQocmVzcG9uc2UuZGF0YS5maWVsZF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbHMuZGVsZXRlLmZpbmQoJ2ZpZWxkc2V0LmZpZWxkLWRhdGEgZGl2LmZpZWxkLWNvbnRlbnQnKS50ZXh0KHJlc3BvbnNlLmRhdGEuZmllbGRfY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmRlbGV0ZS5maW5kKCdmaWVsZHNldC5maWVsZC1kYXRhIGRpdi5maWVsZC1jb250ZW50LWRlZmF1bHQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KHJlc3BvbnNlLmRhdGEuZmllbGRfY29udGVudF9kZWZhdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmRlbGV0ZS5tb2RhbCgnc2hvdycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfVElUTEUnLCAnZ29vZ2xlX3Nob3BwaW5nJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfQUpBWF9GQUlMRUQnLCAnZ29vZ2xlX3Nob3BwaW5nJylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwgYnV0dG9uIGNsaWNrIGV2ZW50XG4gICAgICAgICAgICBjb25zdCAkY29uZmlybUJ1dHRvbiA9ICRtb2RhbHMuZGVsZXRlLmZpbmQoJ2J1dHRvbi5jb25maXJtJyk7XG4gICAgICAgICAgICAkY29uZmlybUJ1dHRvblxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgKCkgPT4gX2RlbGV0ZUZpZWxkKHNjaGVtZUlkLCBmaWVsZElkLCAkZmllbGRSb3cpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgc2NoZW1lIGZpZWxkIHN0YXR1cyBzd2l0Y2hlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdCBjb250YWlucyBpbmZvcm1hdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdXBkYXRlRmllbGRTdGF0dXMoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIENvbGxlY3Qgc2V2ZXJhbCBkYXRhXG4gICAgICAgICAgICBjb25zdCBzY2hlbWVJZCA9ICQoJy5zY2hlbWVJZCcpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgZmllbGRJZCA9ICQodGhpcykuZGF0YSgnZmllbGQtaWQnKTtcbiAgICAgICAgICAgIGxldCBuZXdTdGF0dXMgPSAwO1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGF0dXMgPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDYWxsIGFqYXggY29udHJvbGxlciB0byB1cGRhdGUgZmllbGQgc3RhdHVzXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICB1cmw6IHVybHMudXBkYXRlU3RhdHVzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjaGVtZUlkJzogc2NoZW1lSWQsXG4gICAgICAgICAgICAgICAgICAgICdmaWVsZElkJzogZmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgJ25ld1N0YXR1cyc6IG5ld1N0YXR1c1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmVkaXQubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfVElUTEUnLCAnZ29vZ2xlX3Nob3BwaW5nJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfQUpBWF9GQUlMRUQnLCAnZ29vZ2xlX3Nob3BwaW5nJylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTb3J0aW5nIGV2ZW50IGhhbmRsZXIgZm9yIHNvcnRhYmxlIHBsdWdpblxuICAgICAgICAgKlxuICAgICAgICAgKiBNYWtlcyBhIGNhbGwgdG8gdGhlIGFqYXggY29udHJvbGxlciBhZnRlciBhIHNvcnRpbmcgZXZlbnRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gdWkgICAgU29ydGFibGUgbGlzdCAodWwpIG9iamVjdCB3aXRoIG5ldyBzb3J0IG9yZGVyXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2F2ZVNvcnRpbmcoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICBpZiAoIXVpLml0ZW0ucGFyZW50KCkuaXMoJ3VsJykpIHtcbiAgICAgICAgICAgICAgICAkc29ydGFibGVMaXN0LnNvcnRhYmxlKCdjYW5jZWwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IHVybHMuc2F2ZVNvcnRpbmcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjaGVtZUlkJzogJCgnLnNjaGVtZUlkJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICdzb3J0aW5nJzogJHNvcnRhYmxlTGlzdC5zb3J0YWJsZSgndG9BcnJheScsIHthdHRyaWJ1dGU6ICdkYXRhLWZpZWxkLWlkJ30pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnRVJST1JfVElUTEUnLCAnZ29vZ2xlX3Nob3BwaW5nJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0VSUk9SX1NPUlRJTkdfRkFJTEVEJywgJ2dvb2dsZV9zaG9wcGluZycpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFUlJPUl9USVRMRScsICdnb29nbGVfc2hvcHBpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFUlJPUl9TT1JUSU5HX0ZBSUxFRCcsICdnb29nbGVfc2hvcHBpbmcnKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgdG8gc2F2ZSBzY2hlbWUgZmllbGQgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBDb2xsZWN0cyB0aGUgc2NoZW1lIGZpZWxkIGRhdGEgZnJvbSB0aGUgZWRpdC9jcmVhdGUgbW9kYWwgYW5kIG1ha2VzIGFuIGFqYXggY2FsbCB0byBzYXZlIHRoZW0gaW50byB0aGUgZGIuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2F2ZUZpZWxkRGF0YSgpIHtcbiAgICAgICAgICAgIC8vIENvbGxlY3Qgc2V2ZXJhbCBkYXRhXG4gICAgICAgICAgICBjb25zdCBzY2hlbWVJZCA9ICQoJy5zY2hlbWVJZCcpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgZmllbGRJZCA9ICRtb2RhbHMuZWRpdC5maW5kKCdpbnB1dFtuYW1lPVwic2NoZW1lSWRcIl0nKS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0ICRmaWVsZFJvdyA9ICR0aGlzLmZpbmQoJ2xpW2RhdGEtZmllbGQtaWQ9XCInICsgZmllbGRJZCArICdcIl0nKTtcblxuICAgICAgICAgICAgY29uc3QgZmllbGROYW1lID0gJG1vZGFscy5lZGl0LmZpbmQoJ2lucHV0W25hbWU9XCJuYW1lXCJdJykudmFsKCk7XG4gICAgICAgICAgICBjb25zdCBmaWVsZFZhbHVlID0gJG1vZGFscy5lZGl0LmZpbmQoJ2lucHV0W25hbWU9XCJ2YWx1ZVwiXScpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgZmllbGREZWZhdWx0ID0gJG1vZGFscy5lZGl0LmZpbmQoJ2lucHV0W25hbWU9XCJkZWZhdWx0XCJdJykudmFsKCk7XG5cbiAgICAgICAgICAgIC8vIE1ha2UgYWpheCBjYWxsIHRvIGFqYXggY29udHJvbGxlciB0byBzYXZlIGZpZWxkIGRhdGFcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgIHVybDogdXJscy5zYXZlRmllbGREYXRhLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3NjaGVtZUlkJzogc2NoZW1lSWQsXG4gICAgICAgICAgICAgICAgICAgICdmaWVsZElkJzogZmllbGRJZCxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpZWxkTmFtZSc6IGZpZWxkTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ2ZpZWxkVmFsdWUnOiBmaWVsZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAnZmllbGREZWZhdWx0JzogZmllbGREZWZhdWx0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZElkID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5maWVsZHMtbGlzdCcpLmFwcGVuZChgXG5cdFx0XHRcdFx0XHRcdFx0PGxpIGNsYXNzPVwic2NoZW1lLWZpZWxkXCIgZGF0YS1maWVsZC1pZD1cImAgKyByZXNwb25zZS5maWVsZElkICsgYFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjb2wtbWQtNSBmaWVsZC1uYW1lXCI+YCArIGZpZWxkTmFtZS5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKSArIGA8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiY29sLW1kLTIgc3RhdHVzXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwiZ3gtY29udGFpbmVyXCIgZGF0YS1neC13aWRnZXQ9XCJzd2l0Y2hlclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgICAgICBjbGFzcz1cImZpZWxkLXN0YXR1c1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgICAgIGRhdGEtZmllbGQtaWQ9XCJgICsgcmVzcG9uc2UuZmllbGRJZCArIGBcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgbmFtZT1cImAgKyBmaWVsZE5hbWUgKyBgX3N0YXR1c1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICB2YWx1ZT1cIjFcIiBjaGVja2VkLz5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImNvbC1tZC01IGFjdGlvbnNcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJhY3Rpb25zLWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVwiZWRpdC1maWVsZFwiIGhyZWY9XCIjXCIgZGF0YS1maWVsZC1pZD1cImAgKyByZXNwb25zZS5maWVsZElkICsgYFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1wZW5jaWxcIj48L2k+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVwiZGVsZXRlLWZpZWxkXCIgaHJlZj1cIiNcIiBkYXRhLWZpZWxkLWlkPVwiYCArIHJlc3BvbnNlLmZpZWxkSWQgKyBgXCI+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLXRyYXNoLW9cIj48L2k+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxhIGNsYXNzPVwic29ydC1oYW5kbGVcIj5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtc29ydFwiPjwvaT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8L2E+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRcdFx0XHRgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5maWVsZHMtbGlzdCAuc2NoZW1lLWZpZWxkOmxhc3QgYS5lZGl0LWZpZWxkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9zaG93RWRpdE1vZGFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuZmllbGRzLWxpc3QgLnNjaGVtZS1maWVsZDpsYXN0IGEuZGVsZXRlLWZpZWxkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9zaG93RGVsZXRlTW9kYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5maWVsZHMtbGlzdCAuc2NoZW1lLWZpZWxkOmxhc3QgaW5wdXQuZmllbGQtc3RhdHVzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCBfdXBkYXRlRmllbGRTdGF0dXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCR0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpZWxkUm93LmZpbmQoJy5maWVsZC1uYW1lJykudGV4dChmaWVsZE5hbWUucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbHMuZWRpdC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhbmdlIGhhbmRsZXIgZm9yIGZpZWxkIHZhcmlhYmxlIGluIGZpZWxkIG1vZGFsXG4gICAgICAgICAqXG4gICAgICAgICAqIERpc3BsYXlzIHRoZSBjb2xsZWN0aXZlIGZpZWxkcyBkcm9wZG93biBpZiBmaWVsZCB2YXJpYWJsZSBkcm9wZG93biBoYXMgdGhlIGNvcnJlY3QgdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9maWVsZFZhcmlhYmxlQ2hhbmdlZCgpIHtcbiAgICAgICAgICAgICRtb2RhbHMuZWRpdC5maW5kKCdkaXYuZmllbGQtdmFyaWFibGUtZGVzY3JpcHRpb24nKVxuICAgICAgICAgICAgICAgIC50ZXh0KCQodGhpcykuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF1bJ3RpdGxlJ10pXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcblxuICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT09ICdjb2xsZWN0aXZlX2ZpZWxkJykge1xuICAgICAgICAgICAgICAgICRtb2RhbHMuZWRpdC5maW5kKCdkaXYuY29sbGVjdGl2ZS1maWVsZCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ2Rpdi5jb2xsZWN0aXZlLWZpZWxkJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgZm9yIGFkZCBmaWVsZCB2YXJpYWJsZSBidXR0b25cbiAgICAgICAgICpcbiAgICAgICAgICogQWRkcyB0aGUgdGV4dCBmb3IgdGhlIGZpZWxkIHZhcmlhYmxlIHRvIHRoZSBmaWVsZCB2YWx1ZSBpbnB1dFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FkZEZpZWxkVmFyaWFibGUoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0IHNvbWUgZGF0YVxuICAgICAgICAgICAgY29uc3QgY3VycmVudFZhbHVlID0gJG1vZGFscy5lZGl0LmZpbmQoJ2lucHV0W25hbWU9XCJ2YWx1ZVwiXScpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgdmFyaWFibGUgPSAkbW9kYWxzLmVkaXQuZmluZCgnc2VsZWN0LmZpZWxkLXZhcmlhYmxlJykudmFsKCk7XG5cbiAgICAgICAgICAgIGlmICh2YXJpYWJsZSA9PT0gJ2NvbGxlY3RpdmVfZmllbGQnKSB7XG4gICAgICAgICAgICAgICAgLy8gQ29sbGVjdCBzZWxlY3RlZCBhdHRyaWJ1dGVzLCBwcm9wZXJ0aWVzLCBhZGRpdGlvbmFsIGZpZWxkcyBhbmQgdGhlaXIgc291cmNlc1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHRyaWJ1dGVzID0gJG1vZGFscy5lZGl0LmZpbmQoJ3NlbGVjdC5jb2xsZWN0aXZlLWZpZWxkJykudmFsKCk7XG4gICAgICAgICAgICAgICAgbGV0IHNvdXJjZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAkbW9kYWxzLmVkaXQuZmluZCgnc2VsZWN0LmNvbGxlY3RpdmUtZmllbGQnKS5jaGlsZHJlbignb3B0Z3JvdXAnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuY2hpbGRyZW4oJ29wdGlvbjpzZWxlY3RlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZXMucHVzaCgkKHRoaXMpLmRhdGEoJ3NvdXJjZScpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHRleHQgZm9yIGNvbGxlY3RpdmUgZmllbGRcbiAgICAgICAgICAgICAgICAkbW9kYWxzLmVkaXQuZmluZCgnaW5wdXRbbmFtZT1cInZhbHVlXCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnZhbChjdXJyZW50VmFsdWUgKyAne2NvbGxlY3RpdmVfZmllbGR8fCcgKyBhdHR0cmlidXRlcy5qb2luKCc7JykgKyAnfHwnICsgc291cmNlcy5qb2luKCc7JykgKyAnfScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgdGV4dCBmb3Igbm9ybWFsIGZpZWxkIHZhcmFpYmxlXG4gICAgICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ2lucHV0W25hbWU9XCJ2YWx1ZVwiXScpLnZhbChjdXJyZW50VmFsdWUgKyAneycgKyB2YXJpYWJsZSArICd9Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCgnYS5jcmVhdGUtZmllbGQnKS5vbignY2xpY2snLCBfc2hvd0NyZWF0ZU1vZGFsKTtcbiAgICAgICAgICAgICQoJ2EuZWRpdC1maWVsZCcpLm9uKCdjbGljaycsIF9zaG93RWRpdE1vZGFsKTtcbiAgICAgICAgICAgICQoJ2EuZGVsZXRlLWZpZWxkJykub24oJ2NsaWNrJywgX3Nob3dEZWxldGVNb2RhbCk7XG4gICAgICAgICAgICAkKCdpbnB1dC5maWVsZC1zdGF0dXMnKS5vbignY2hhbmdlJywgX3VwZGF0ZUZpZWxkU3RhdHVzKTtcblxuICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ2J1dHRvbi5jb25maXJtJykub24oJ2NsaWNrJywgX3NhdmVGaWVsZERhdGEpO1xuICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ3NlbGVjdC5maWVsZC12YXJpYWJsZScpLm9uKCdjaGFuZ2UnLCBfZmllbGRWYXJpYWJsZUNoYW5nZWQpO1xuICAgICAgICAgICAgJG1vZGFscy5lZGl0LmZpbmQoJ2EuYWRkLWZpZWxkLXZhcmlhYmxlJykub24oJ2NsaWNrJywgX2FkZEZpZWxkVmFyaWFibGUpO1xuXG4gICAgICAgICAgICAkc29ydGFibGVMaXN0XG4gICAgICAgICAgICAgICAgLnNvcnRhYmxlKHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6ICdsaS5zY2hlbWUtZmllbGQnLFxuICAgICAgICAgICAgICAgICAgICBheGlzOiAneScsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGU6ICcuc29ydC1oYW5kbGUnLFxuICAgICAgICAgICAgICAgICAgICBjb250YWlubWVudDogJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdzb3J0LXBsYWNlaG9sZGVyJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm9uKCdzb3J0dXBkYXRlJywgX3NhdmVTb3J0aW5nKVxuICAgICAgICAgICAgICAgIC5kaXNhYmxlU2VsZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
