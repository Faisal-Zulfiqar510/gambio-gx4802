/* --------------------------------------------------------------
 scheme_fields.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module(
    'scheme_fields',

    [
        'loading_spinner',
        'modal',
        `${jse.source}/vendor/jquery-ui-dist/jquery-ui.min.css`,
        `${jse.source}/vendor/jquery-ui-dist/jquery-ui.js`
    ],

    function (data) {
        'use strict';

        // ------------------------------------------------------------------------
        // VARIABLES DEFINITION
        // ------------------------------------------------------------------------

        /**
         * Module Selector
         *
         * @type {jQuery}
         */
        const $this = $(this);

        /**
         * Deleting modal object
         *
         * @type {jQuery}
         */
        const $modals = {
            'edit': $('.scheme-field.modal'),
            'delete': $('.delete-field.modal')
        };

        /**
         * Sortable list
         *
         * @type {jQuery}
         */
        const $sortableList = $('.fields-list');

        /**
         * Default Options
         *
         * @type {object}
         */
        const defaults = {};

        /**
         * Final Options
         *
         * @type {object}
         */
        const options = $.extend(true, {}, defaults, data);

        /**
         * URLs for deleting different types of content
         *
         * @type {{deleteScheme: string, runExport: string}}
         */
        const urls = {
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
        const module = {};

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
                success: function (response) {
                    if (response['success'] === true) {
                        $fieldRow.remove();
                    }

                    $modals.delete.modal('hide');
                },
                error: function () {
                    $modals.delete.modal('hide');
                }
            });
        }

        /**
         * Updates the field modal
         *
         * Resets the modal and changes the title and the input values depending of the action
         */
        function _updateFieldModal(action, fieldData = undefined) {
            if (fieldData === undefined) {
                fieldData = {
                    'schemeId': '',
                    'name': '',
                    'value': '',
                    'default': ''
                };
            }

            if (action === 'create') {
                $modals.edit.find('.modal-title')
                    .text(jse.core.lang.translate('FIELD_MODAL_TITLE_CREATE', 'google_shopping'));
            } else if (action === 'edit') {
                $modals.edit.find('.modal-title')
                    .text(jse.core.lang.translate('FIELD_MODAL_TITLE_EDIT', 'google_shopping'));
            }

            $modals.edit.find('select.collective-field option').prop("selected", false);
            $modals.edit.find('select.field-variable').val('');
            $modals.edit.find('div.collective-field').addClass('hidden');
            $modals.edit.find('input[name="schemeId"]').val(fieldData.schemeId);
            $modals.edit.find('input[name="name"]').val(fieldData.name);
            $modals.edit.find('input[name="value"]').val(fieldData.value);
            $modals.edit.find('input[name="default"]').val(fieldData.default);
            $modals.edit.find('div.field-variable-description')
                .text('')
                .addClass('hidden');
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
            const fieldId = $(this).data('field-id');

            // Fetch data with ajax controller ...
            $.ajax({
                type: "GET",
                dataType: "json",
                url: urls.getFieldData + '&fieldId=' + fieldId,
                success: function (response) {
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
                error: function () {
                    jse.libs.modal.showMessage(
                        jse.core.lang.translate('ERROR_TITLE', 'google_shopping'),
                        jse.core.lang.translate('ERROR_AJAX_FAILED', 'google_shopping')
                    );
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
            const schemeId = $('.schemeId').val();
            const fieldId = $(this).data('field-id');
            const $fieldRow = $(this).closest('li');

            // Show modal
            $.ajax({
                type: "GET",
                dataType: "json",
                url: urls.getFieldData + '&fieldId=' + fieldId,
                success: function (response) {
                    // Display modal with field data on success
                    if (response.success === true) {
                        $modals.delete.find('fieldset.field-data div.field-name').text(response.data.field_name);
                        $modals.delete.find('fieldset.field-data div.field-content').text(response.data.field_content);
                        $modals.delete.find('fieldset.field-data div.field-content-default')
                            .text(response.data.field_content_default);
                    }
                    $modals.delete.modal('show');
                },
                error: function () {
                    jse.libs.modal.showMessage(
                        jse.core.lang.translate('ERROR_TITLE', 'google_shopping'),
                        jse.core.lang.translate('ERROR_AJAX_FAILED', 'google_shopping')
                    );
                }
            });

            // Handle delete confirmation modal button click event
            const $confirmButton = $modals.delete.find('button.confirm');
            $confirmButton
                .off('click')
                .on('click', () => _deleteField(schemeId, fieldId, $fieldRow));
        }

        /**
         * Click handler for the scheme field status switcher
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _updateFieldStatus(event) {
            // Collect several data
            const schemeId = $('.schemeId').val();
            const fieldId = $(this).data('field-id');
            let newStatus = 0;
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
                success: function (response) {
                    if (response.success === true) {
                        $modals.edit.modal('hide');
                    }
                },
                error: function () {
                    jse.libs.modal.showMessage(
                        jse.core.lang.translate('ERROR_TITLE', 'google_shopping'),
                        jse.core.lang.translate('ERROR_AJAX_FAILED', 'google_shopping')
                    );
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
                    'sorting': $sortableList.sortable('toArray', {attribute: 'data-field-id'})
                },
                success: function (response) {
                    if (response.success === false) {
                        jse.libs.modal.showMessage(
                            jse.core.lang.translate('ERROR_TITLE', 'google_shopping'),
                            jse.core.lang.translate('ERROR_SORTING_FAILED', 'google_shopping')
                        );
                    }
                },
                error: function () {
                    jse.libs.modal.showMessage(
                        jse.core.lang.translate('ERROR_TITLE', 'google_shopping'),
                        jse.core.lang.translate('ERROR_SORTING_FAILED', 'google_shopping')
                    );
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
            const schemeId = $('.schemeId').val();
            const fieldId = $modals.edit.find('input[name="schemeId"]').val();
            const $fieldRow = $this.find('li[data-field-id="' + fieldId + '"]');

            const fieldName = $modals.edit.find('input[name="name"]').val();
            const fieldValue = $modals.edit.find('input[name="value"]').val();
            const fieldDefault = $modals.edit.find('input[name="default"]').val();

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
                success: function (response) {
                    if (response.success === true) {
                        if (fieldId === '') {
                            $this.find('.fields-list').append(`
								<li class="scheme-field" data-field-id="` + response.fieldId + `">
									<span class="col-md-5 field-name">` + fieldName.replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;') + `</span>
									
									<span class="col-md-2 status">
										<span class="gx-container" data-gx-widget="switcher">
											<input type="checkbox"
											       class="field-status"
											       data-field-id="` + response.fieldId + `"
												   name="` + fieldName + `_status"
												   value="1" checked/>
										</span>
									</span>
									
									<span class="col-md-5 actions">
										<span class="actions-container">
											<a class="edit-field" href="#" data-field-id="` + response.fieldId + `">
												<i class="fa fa-pencil"></i>
											</a>
											<a class="delete-field" href="#" data-field-id="` + response.fieldId + `">
												<i class="fa fa-trash-o"></i>
											</a>
											<a class="sort-handle">
												<i class="fa fa-sort"></i>
											</a>
										</span>
									</span>
								</li>
							`);

                            $this.find('.fields-list .scheme-field:last a.edit-field')
                                .on('click', _showEditModal);
                            $this.find('.fields-list .scheme-field:last a.delete-field')
                                .on('click', _showDeleteModal);
                            $this.find('.fields-list .scheme-field:last input.field-status')
                                .on('change', _updateFieldStatus);

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
            $modals.edit.find('div.field-variable-description')
                .text($(this).find('option:selected')[0]['title'])
                .removeClass('hidden');

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
            const currentValue = $modals.edit.find('input[name="value"]').val();
            const variable = $modals.edit.find('select.field-variable').val();

            if (variable === 'collective_field') {
                // Collect selected attributes, properties, additional fields and their sources
                const atttributes = $modals.edit.find('select.collective-field').val();
                let sources = [];
                $modals.edit.find('select.collective-field').children('optgroup').each(function () {
                    if ($(this).children('option:selected').length > 0) {
                        sources.push($(this).data('source'));
                    }
                });

                // Add text for collective field
                $modals.edit.find('input[name="value"]')
                    .val(currentValue + '{collective_field||' + atttributes.join(';') + '||' + sources.join(';') + '}');
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

            $sortableList
                .sortable({
                    items: 'li.scheme-field',
                    axis: 'y',
                    cursor: 'move',
                    handle: '.sort-handle',
                    containment: 'document',
                    placeholder: 'sort-placeholder'
                })
                .on('sortupdate', _saveSorting)
                .disableSelection();

            done();
        }

        return module;
    }
);
