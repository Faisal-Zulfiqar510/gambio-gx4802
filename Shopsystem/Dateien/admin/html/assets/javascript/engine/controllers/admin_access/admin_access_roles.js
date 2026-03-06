'use strict';

/* --------------------------------------------------------------
 admin_access_admin_edit.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'admin_access_roles',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
['modal', jse.source + '/vendor/jquery-ui-dist/jquery-ui.min.css', jse.source + '/vendor/jquery-ui-dist/jquery-ui.js'],

// ------------------------------------------------------------------------
// CONTROLLER BUSINESS LOGIC
// ------------------------------------------------------------------------
function (data) {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Controller reference.
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default options for controller,
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final controller options.
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module object.
     *
     * @type {{}}
     */
    var module = {};

    /**
     * Modal objects.
     *
     * @type {object}
     */
    var $modal = {
        'create_edit': $('.create-edit-role-modal'),
        'delete': $('.delete-role-modal')
    };

    /**
     * Sortable list.
     *
     * @type {jQuery}
     */
    var $sortableList = $('ul.overview-list');

    /**
     * URLs object. Contains all URLs that are necessary for this controller.
     *
     * @type {object}
     */
    var urls = {
        'getRoleData': 'admin.php?do=AdminAccessAjax/getRoleData',
        'deleteRole': 'admin.php?do=AdminAccessAjax/deleteRole',
        'saveRoleData': 'admin.php?do=AdminAccessAjax/saveRoleData',
        'saveSorting': 'admin.php?do=AdminAccessAjax/saveRoleSorting'
    };

    /**
     * Object for the selected role row.
     *
     * @type {object}
     */
    var $selectedRoleRow = {};

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Opens a modal with an error message for an unexpected error.
     */
    function _unexpectedError() {
        jse.libs.modal.showMessage(jse.core.lang.translate('error_modal_title', 'admin_access'), jse.core.lang.translate('error_ajax_request_failed', 'admin_access'));
    }

    /**
     * Clears the form inputs of the role modal.
     */
    function _clearModalForm() {
        $modal['create_edit'].find('input[name=roleId]').val('');
        $modal['create_edit'].find('input[name=roleName]').val('').removeClass('error');
        $modal['create_edit'].find('input[name=roleDescription]').val('');
        $modal['create_edit'].find('.nav-tabs li:first a').click();
    }

    /**
     * Updates the form inputs of the role modal.
     */
    function _updateModalForm(formdata) {
        _clearModalForm();

        $modal['create_edit'].find('input[name=roleId]').val(formdata['id']);
        $modal['create_edit'].find('input[name=roleSortOrder]').val(formdata['sortOrder']);
        for (var lang in formdata['names']) {
            $modal['create_edit'].find('input[name=roleName][data-lang=' + lang + ']').val(formdata['names'][lang]);
        }
        for (var _lang in formdata['descriptions']) {
            $modal['create_edit'].find('input[name=roleDescription][data-lang=' + _lang + ']').val(formdata['descriptions'][_lang]);
        }
    }

    /**
     * Return the form data of the role modal.
     */
    function _getModalFormData() {
        var roleId = parseInt($modal['create_edit'].find('input[name=roleId]').val());
        var names = {};
        var descriptions = {};
        var sortOrder = $('.overview-list li').length;

        $modal['create_edit'].find('input[name=roleName]').each(function (index, element) {
            names[$(element).data('lang')] = $(element).val();
        });
        $modal['create_edit'].find('input[name=roleDescription]').each(function (index, element) {
            descriptions[$(element).data('lang')] = $(element).val();
        });

        return {
            'id': roleId === NaN ? '' : roleId,
            'sortOrder': sortOrder,
            'names': names,
            'descriptions': descriptions
        };
    }

    /**
     * Refreshes the role overview
     */
    function _addRowToOverview(data) {
        if ($selectedRoleRow !== undefined) {
            $selectedRoleRow.find('.list-element-title').text(data['names'][jse.core.config.get('languageCode').toUpperCase()]);
        } else {
            $('.overview-list').append('\n\t\t\t\t\t<li class="col-md-12 list-element" data-list-element-id="' + data['id'] + '">\n\t\t\t\t\t\t<span class="list-element-text list-element-title col-md-8"\n\t\t\t\t\t\t      title="' + data['descriptions'][jse.core.config.get('languageCode').toUpperCase()] + '"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t' + data['names'][jse.core.config.get('languageCode').toUpperCase()].replace(/</g, '&lt;') + '\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class="col-md-4 list-element-actions">\n\t\t\t\t\t\t\t<a href="#" class="edit-role" data-id="' + data['id'] + '"><i class="fa fa-pencil"></i></a>\n\t\t\t\t\t\t\t<a href="admin.php?do=AdminAccess/managePermissions&id=' + data['id'] + '"><i class="fa fa-cog"></i></a>\n\t\t\t\t\t\t\t<a href="#" class="delete-role" data-id="' + data['id'] + '"><i class="fa fa-trash-o"></i></a>\n\t\t\t\t\t\t\t<a href="#" class="sort-handle ui-sortable-handle"><i class="fa fa-sort"></i></a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</li>\n\t\t\t\t');

            $('.overview-list .list-element:last a.create-role').on('click', _openCreateRoleModal);
            $('.overview-list .list-element:last a.edit-role').on('click', _openEditRoleModal);
            $('.overview-list .list-element:last a.delete-role').on('click', _openDeleteRoleModal);
            $('.overview-list .list-element:last a.sort-handle').on('click', function (event) {
                event.preventDefault();
            });
        }
    }

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    /**
     * Click handler for the create role button.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _openCreateRoleModal(event) {
        // Prevent default action.
        event.preventDefault();

        $selectedRoleRow = undefined;

        // Reset modal data and open modal
        _clearModalForm();
        $modal['create_edit'].find('.modal-title').text(jse.core.lang.translate('role_modal_create_title', 'admin_access'));
        $modal['create_edit'].find('button.confirm').text(jse.core.lang.translate('BUTTON_CREATE', 'admin_buttons'));
        $modal['create_edit'].modal('show');
    }

    /**
     * Click handler for the edit role button.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _openEditRoleModal(event) {
        // Prevent default action.
        event.preventDefault();

        var roleId = $(this).data('id');
        $selectedRoleRow = $(this).closest('.list-element');

        // Load role data and open modal on success
        $.ajax({
            type: "GET",
            dataType: "json",
            url: urls.getRoleData + '&roleId=' + roleId,
            success: function success(response) {
                if (response['success'] === true) {
                    _updateModalForm(response['data']);
                    $modal['create_edit'].find('.modal-title').text(jse.core.lang.translate('role_modal_edit_title', 'admin_access'));
                    $modal['create_edit'].find('button.confirm').text(jse.core.lang.translate('BUTTON_SAVE', 'admin_buttons'));
                    $modal['create_edit'].modal('show');

                    return;
                }
                _unexpectedError();
            },
            error: function error() {
                _unexpectedError();
            }
        });
    }

    /**
     * Click handler for the delete role button.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _openDeleteRoleModal(event) {
        // Prevent default action.
        event.preventDefault();

        var roleId = $(this).data('id');
        $selectedRoleRow = $(this).closest('.list-element');

        // Load role data and open modal on success
        $.ajax({
            type: "GET",
            dataType: "json",
            url: urls.getRoleData + '&roleId=' + roleId,
            success: function success(response) {
                if (response['success'] === true) {
                    $modal['delete'].find('input[name=roleId]').val(response['data']['id']);
                    $modal['delete'].find('fieldset .role-name').text(response['data']['names'][jse.core.config.get('languageCode').toUpperCase()]);
                    $modal['delete'].find('fieldset .role-description').text(response['data']['descriptions'][jse.core.config.get('languageCode').toUpperCase()]);
                    $modal['delete'].modal('show');

                    return;
                }
                _unexpectedError();
            },
            error: function error() {
                _unexpectedError();
            }
        });
    }

    /**
     * Click handler for the delete modal submit button.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _submitCreateEditModalForm(event) {
        // Prevent default action.
        event.preventDefault();

        var data = _getModalFormData();
        var $emptyNameInputs = $modal['create_edit'].find('input[name=roleName]').filter(function () {
            return $(this).val() === '';
        });
        var $nonEmptyNameInputs = $modal['create_edit'].find('input[name=roleName]').filter(function () {
            return $(this).val() !== '';
        });

        if ($emptyNameInputs.length > 0) {
            if ($nonEmptyNameInputs.length > 0) {
                for (var lang in data.names) {
                    if (data.names[lang] === '') {
                        data.names[lang] = $nonEmptyNameInputs.first().val();
                    }
                }
            } else {
                $emptyNameInputs.addClass('error');
                return;
            }
        }

        // Update role data
        {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: urls.saveRoleData,
                data: data,
                success: function success(response) {
                    if (response['success'] === true) {
                        $modal['create_edit'].modal('hide');
                        data['id'] = response['roleId'];
                        _addRowToOverview(data);

                        if ($('.overview-list-container').hasClass('empty')) {
                            $('.overview-list li:not(".list-headline"):first').remove();
                            $('.overview-list-container').removeClass('empty');
                        }

                        return;
                    }
                    _unexpectedError();
                },
                error: function error() {
                    _unexpectedError();
                }
            });
        }
    }

    /**
     * Click handler for the create edit modal submit button.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _submitDeleteModalForm(event) {
        // Prevent default action.
        event.preventDefault();

        var roleId = $modal['delete'].find('input[name=roleId]').val();

        // Update role data
        $.ajax({
            type: "POST",
            url: urls.deleteRole,
            dataType: "json",
            data: {
                'roleId': roleId
            },
            success: function success(response) {
                if (response['success'] === true) {
                    $modal['delete'].modal('hide');
                    $selectedRoleRow.remove();

                    if ($('.overview-list li:not(".list-headline")').length === 0) {
                        $('.overview-list').append('\n\t\t\t\t\t\t\t\t<li class="col-md-12 list-element">\n\t\t\t\t\t\t\t\t\t<span class="title">' + jse.core.lang.translate('text_empty_roles_overview_list', 'admin_access') + '</span>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t');
                        $('.overview-list-container').addClass('empty');
                    }

                    return;
                }
                _unexpectedError();
            },
            error: function error() {
                _unexpectedError();
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
                'sorting': $sortableList.sortable('toArray', { attribute: 'data-list-element-id' })
            },
            success: function success(response) {
                if (response.success === false) {
                    _unexpectedError();
                } else {
                    jse.libs.info_box.addSuccessMessage(jse.core.lang.translate('text_saved_sorting', 'admin_access'));
                }
            },
            error: function error() {
                _unexpectedError();
            }
        });
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    module.init = function (done) {
        // initialization logic
        $('a.create-role').on('click', _openCreateRoleModal);
        $('a.edit-role').on('click', _openEditRoleModal);
        $('a.delete-role').on('click', _openDeleteRoleModal);
        $('a.sort-handle').on('click', function (event) {
            event.preventDefault();
        });

        $modal['create_edit'].find('button.confirm').on('click', _submitCreateEditModalForm);
        $modal['delete'].find('button.confirm').on('click', _submitDeleteModalForm);

        $sortableList.sortable({
            items: 'li.list-element',
            axis: 'y',
            cursor: 'move',
            handle: '.sort-handle',
            containment: 'document',
            opacity: 0.75,
            placeholder: 'col-md-12 list-element sort-placeholder'
        }).on('sortupdate', _saveSorting).disableSelection();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluX2FjY2Vzcy9hZG1pbl9hY2Nlc3Nfcm9sZXMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCIkbW9kYWwiLCIkc29ydGFibGVMaXN0IiwidXJscyIsIiRzZWxlY3RlZFJvbGVSb3ciLCJfdW5leHBlY3RlZEVycm9yIiwibGlicyIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIl9jbGVhck1vZGFsRm9ybSIsImZpbmQiLCJ2YWwiLCJyZW1vdmVDbGFzcyIsImNsaWNrIiwiX3VwZGF0ZU1vZGFsRm9ybSIsImZvcm1kYXRhIiwiX2dldE1vZGFsRm9ybURhdGEiLCJyb2xlSWQiLCJwYXJzZUludCIsIm5hbWVzIiwiZGVzY3JpcHRpb25zIiwic29ydE9yZGVyIiwibGVuZ3RoIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsIk5hTiIsIl9hZGRSb3dUb092ZXJ2aWV3IiwidW5kZWZpbmVkIiwidGV4dCIsImNvbmZpZyIsImdldCIsInRvVXBwZXJDYXNlIiwiYXBwZW5kIiwicmVwbGFjZSIsIm9uIiwiX29wZW5DcmVhdGVSb2xlTW9kYWwiLCJfb3BlbkVkaXRSb2xlTW9kYWwiLCJfb3BlbkRlbGV0ZVJvbGVNb2RhbCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJjbG9zZXN0IiwiYWpheCIsInR5cGUiLCJkYXRhVHlwZSIsInVybCIsImdldFJvbGVEYXRhIiwic3VjY2VzcyIsInJlc3BvbnNlIiwiZXJyb3IiLCJfc3VibWl0Q3JlYXRlRWRpdE1vZGFsRm9ybSIsIiRlbXB0eU5hbWVJbnB1dHMiLCJmaWx0ZXIiLCIkbm9uRW1wdHlOYW1lSW5wdXRzIiwiZmlyc3QiLCJhZGRDbGFzcyIsInNhdmVSb2xlRGF0YSIsImhhc0NsYXNzIiwicmVtb3ZlIiwiX3N1Ym1pdERlbGV0ZU1vZGFsRm9ybSIsImRlbGV0ZVJvbGUiLCJfc2F2ZVNvcnRpbmciLCJ1aSIsIml0ZW0iLCJwYXJlbnQiLCJpcyIsInNvcnRhYmxlIiwic2F2ZVNvcnRpbmciLCJtZXRob2QiLCJhdHRyaWJ1dGUiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiaW5pdCIsIml0ZW1zIiwiYXhpcyIsImN1cnNvciIsImhhbmRsZSIsImNvbnRhaW5tZW50Iiwib3BhY2l0eSIsInBsYWNlaG9sZGVyIiwiZGlzYWJsZVNlbGVjdGlvbiIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmO0FBQ0k7QUFDQTtBQUNBO0FBQ0Esb0JBSko7O0FBTUk7QUFDQTtBQUNBO0FBQ0EsQ0FDSSxPQURKLEVBRU9DLElBQUlDLE1BRlgsK0NBR09ELElBQUlDLE1BSFgseUNBVEo7O0FBZUk7QUFDQTtBQUNBO0FBQ0EsVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTVMsU0FBUztBQUNYLHVCQUFlSixFQUFFLHlCQUFGLENBREo7QUFFWCxrQkFBVUEsRUFBRSxvQkFBRjtBQUZDLEtBQWY7O0FBS0E7Ozs7O0FBS0EsUUFBTUssZ0JBQWdCTCxFQUFFLGtCQUFGLENBQXRCOztBQUVBOzs7OztBQUtBLFFBQU1NLE9BQU87QUFDVCx1QkFBZSwwQ0FETjtBQUVULHNCQUFjLHlDQUZMO0FBR1Qsd0JBQWdCLDJDQUhQO0FBSVQsdUJBQWU7QUFKTixLQUFiOztBQU9BOzs7OztB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LGNBQTlDLENBQXBDO0FBQ0g7QUFDSixhQWJFO0FBY0h5QyxtQkFBTyxpQkFBWTtBQUNmL0M7QUFDSDtBQWhCRSxTQUFQO0FBa0JIOztBQUVEO0FBQ0E7QUFDQTtBQUNBYixXQUFPbUYsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCO0FBQ0E5RSxVQUFFLGVBQUYsRUFBbUJ5QyxFQUFuQixDQUFzQixPQUF0QixFQUErQkMsb0JBQS9CO0FBQ0ExQyxVQUFFLGFBQUYsRUFBaUJ5QyxFQUFqQixDQUFvQixPQUFwQixFQUE2QkUsa0JBQTdCO0FBQ0EzQyxVQUFFLGVBQUYsRUFBbUJ5QyxFQUFuQixDQUFzQixPQUF0QixFQUErQkcsb0JBQS9CO0FBQ0E1QyxVQUFFLGVBQUYsRUFBbUJ5QyxFQUFuQixDQUFzQixPQUF0QixFQUErQixVQUFDSSxLQUFELEVBQVc7QUFDdENBLGtCQUFNQyxjQUFOO0FBQ0gsU0FGRDs7QUFJQTFDLGVBQU8sYUFBUCxFQUNLWSxJQURMLENBQ1UsZ0JBRFYsRUFFS3lCLEVBRkwsQ0FFUSxPQUZSLEVBRWlCZSwwQkFGakI7QUFHQXBELGVBQU8sUUFBUCxFQUNLWSxJQURMLENBQ1UsZ0JBRFYsRUFFS3lCLEVBRkwsQ0FFUSxPQUZSLEVBRWlCd0Isc0JBRmpCOztBQUlBNUQsc0JBQ0ttRSxRQURMLENBQ2M7QUFDTk8sbUJBQU8saUJBREQ7QUFFTkMsa0JBQU0sR0FGQTtBQUdOQyxvQkFBUSxNQUhGO0FBSU5DLG9CQUFRLGNBSkY7QUFLTkMseUJBQWEsVUFMUDtBQU1OQyxxQkFBUyxJQU5IO0FBT05DLHlCQUFhO0FBUFAsU0FEZCxFQVVLNUMsRUFWTCxDQVVRLFlBVlIsRUFVc0IwQixZQVZ0QixFQVdLbUIsZ0JBWEw7O0FBYUFDO0FBQ0gsS0E5QkQ7O0FBZ0NBLFdBQU81RixNQUFQO0FBQ0gsQ0ExZUwiLCJmaWxlIjoiYWRtaW5fYWNjZXNzL2FkbWluX2FjY2Vzc19yb2xlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWRtaW5fYWNjZXNzX2FkbWluX2VkaXQuanMgMjAxOS0wNy0xMlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTkgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIE5BTUVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAnYWRtaW5fYWNjZXNzX3JvbGVzJyxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgTElCUkFSSUVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLm1pbi5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LXVpLWRpc3QvanF1ZXJ5LXVpLmpzYFxuICAgIF0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIEJVU0lORVNTIExPR0lDXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnRyb2xsZXIgcmVmZXJlbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IG9wdGlvbnMgZm9yIGNvbnRyb2xsZXIsXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBjb250cm9sbGVyIG9wdGlvbnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge3t9fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZGFsIG9iamVjdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkbW9kYWwgPSB7XG4gICAgICAgICAgICAnY3JlYXRlX2VkaXQnOiAkKCcuY3JlYXRlLWVkaXQtcm9sZS1tb2RhbCcpLFxuICAgICAgICAgICAgJ2RlbGV0ZSc6ICQoJy5kZWxldGUtcm9sZS1tb2RhbCcpXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNvcnRhYmxlIGxpc3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkc29ydGFibGVMaXN0ID0gJCgndWwub3ZlcnZpZXctbGlzdCcpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVUkxzIG9iamVjdC4gQ29udGFpbnMgYWxsIFVSTHMgdGhhdCBhcmUgbmVjZXNzYXJ5IGZvciB0aGlzIGNvbnRyb2xsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB1cmxzID0ge1xuICAgICAgICAgICAgJ2dldFJvbGVEYXRhJzogJ2FkbWluLnBocD9kbz1BZG1pbkFjY2Vzc0FqYXgvZ2V0Um9sZURhdGEnLFxuICAgICAgICAgICAgJ2RlbGV0ZVJvbGUnOiAnYWRtaW4ucGhwP2RvPUFkbWluQWNjZXNzQWpheC9kZWxldGVSb2xlJyxcbiAgICAgICAgICAgICdzYXZlUm9sZURhdGEnOiAnYWRtaW4ucGhwP2RvPUFkbWluQWNjZXNzQWpheC9zYXZlUm9sZURhdGEnLFxuICAgICAgICAgICAgJ3NhdmVTb3J0aW5nJzogJ2FkbWluLnBocD9kbz1BZG1pbkFjY2Vzc0FqYXgvc2F2ZVJvbGVTb3J0aW5nJ1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPYmplY3QgZm9yIHRoZSBzZWxlY3RlZCByb2xlIHJvdy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCAkc2VsZWN0ZWRSb2xlUm93ID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbnMgYSBtb2RhbCB3aXRoIGFuIGVycm9yIG1lc3NhZ2UgZm9yIGFuIHVuZXhwZWN0ZWQgZXJyb3IuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdW5leHBlY3RlZEVycm9yKCkge1xuICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yX21vZGFsX3RpdGxlJywgJ2FkbWluX2FjY2VzcycpLFxuICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcl9hamF4X3JlcXVlc3RfZmFpbGVkJywgJ2FkbWluX2FjY2VzcycpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFycyB0aGUgZm9ybSBpbnB1dHMgb2YgdGhlIHJvbGUgbW9kYWwuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfY2xlYXJNb2RhbEZvcm0oKSB7XG4gICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1yb2xlSWRdJylcbiAgICAgICAgICAgICAgICAudmFsKCcnKTtcbiAgICAgICAgICAgICRtb2RhbFsnY3JlYXRlX2VkaXQnXVxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dFtuYW1lPXJvbGVOYW1lXScpXG4gICAgICAgICAgICAgICAgLnZhbCgnJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2Vycm9yJyk7XG4gICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1yb2xlRGVzY3JpcHRpb25dJylcbiAgICAgICAgICAgICAgICAudmFsKCcnKTtcbiAgICAgICAgICAgICRtb2RhbFsnY3JlYXRlX2VkaXQnXVxuICAgICAgICAgICAgICAgIC5maW5kKCcubmF2LXRhYnMgbGk6Zmlyc3QgYScpXG4gICAgICAgICAgICAgICAgLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyB0aGUgZm9ybSBpbnB1dHMgb2YgdGhlIHJvbGUgbW9kYWwuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdXBkYXRlTW9kYWxGb3JtKGZvcm1kYXRhKSB7XG4gICAgICAgICAgICBfY2xlYXJNb2RhbEZvcm0oKTtcblxuICAgICAgICAgICAgJG1vZGFsWydjcmVhdGVfZWRpdCddXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9cm9sZUlkXScpXG4gICAgICAgICAgICAgICAgLnZhbChmb3JtZGF0YVsnaWQnXSk7XG4gICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1yb2xlU29ydE9yZGVyXScpXG4gICAgICAgICAgICAgICAgLnZhbChmb3JtZGF0YVsnc29ydE9yZGVyJ10pO1xuICAgICAgICAgICAgZm9yIChsZXQgbGFuZyBpbiBmb3JtZGF0YVsnbmFtZXMnXSkge1xuICAgICAgICAgICAgICAgICRtb2RhbFsnY3JlYXRlX2VkaXQnXVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1yb2xlTmFtZV1bZGF0YS1sYW5nPScgKyBsYW5nICsgJ10nKVxuICAgICAgICAgICAgICAgICAgICAudmFsKGZvcm1kYXRhWyduYW1lcyddW2xhbmddKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGxhbmcgaW4gZm9ybWRhdGFbJ2Rlc2NyaXB0aW9ucyddKSB7XG4gICAgICAgICAgICAgICAgJG1vZGFsWydjcmVhdGVfZWRpdCddXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dFtuYW1lPXJvbGVEZXNjcmlwdGlvbl1bZGF0YS1sYW5nPScgKyBsYW5nICsgJ10nKVxuICAgICAgICAgICAgICAgICAgICAudmFsKGZvcm1kYXRhWydkZXNjcmlwdGlvbnMnXVtsYW5nXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJuIHRoZSBmb3JtIGRhdGEgb2YgdGhlIHJvbGUgbW9kYWwuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0TW9kYWxGb3JtRGF0YSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvbGVJZCA9IHBhcnNlSW50KCRtb2RhbFsnY3JlYXRlX2VkaXQnXS5maW5kKCdpbnB1dFtuYW1lPXJvbGVJZF0nKS52YWwoKSk7XG4gICAgICAgICAgICBsZXQgbmFtZXMgPSB7fTtcbiAgICAgICAgICAgIGxldCBkZXNjcmlwdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRPcmRlciA9ICQoJy5vdmVydmlldy1saXN0IGxpJykubGVuZ3RoO1xuXG4gICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1yb2xlTmFtZV0nKVxuICAgICAgICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBuYW1lc1skKGVsZW1lbnQpLmRhdGEoJ2xhbmcnKV0gPSAkKGVsZW1lbnQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJG1vZGFsWydjcmVhdGVfZWRpdCddXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9cm9sZURlc2NyaXB0aW9uXScpXG4gICAgICAgICAgICAgICAgLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uc1skKGVsZW1lbnQpLmRhdGEoJ2xhbmcnKV0gPSAkKGVsZW1lbnQpLnZhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdpZCc6IHJvbGVJZCA9PT0gTmFOID8gJycgOiByb2xlSWQsXG4gICAgICAgICAgICAgICAgJ3NvcnRPcmRlcic6IHNvcnRPcmRlcixcbiAgICAgICAgICAgICAgICAnbmFtZXMnOiBuYW1lcyxcbiAgICAgICAgICAgICAgICAnZGVzY3JpcHRpb25zJzogZGVzY3JpcHRpb25zXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZnJlc2hlcyB0aGUgcm9sZSBvdmVydmlld1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FkZFJvd1RvT3ZlcnZpZXcoZGF0YSkge1xuICAgICAgICAgICAgaWYgKCRzZWxlY3RlZFJvbGVSb3cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICRzZWxlY3RlZFJvbGVSb3dcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5saXN0LWVsZW1lbnQtdGl0bGUnKVxuICAgICAgICAgICAgICAgICAgICAudGV4dChkYXRhWyduYW1lcyddW2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpLnRvVXBwZXJDYXNlKCldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLm92ZXJ2aWV3LWxpc3QnKS5hcHBlbmQoYFxuXHRcdFx0XHRcdDxsaSBjbGFzcz1cImNvbC1tZC0xMiBsaXN0LWVsZW1lbnRcIiBkYXRhLWxpc3QtZWxlbWVudC1pZD1cImAgKyBkYXRhWydpZCddICsgYFwiPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJsaXN0LWVsZW1lbnQtdGV4dCBsaXN0LWVsZW1lbnQtdGl0bGUgY29sLW1kLThcIlxuXHRcdFx0XHRcdFx0ICAgICAgdGl0bGU9XCJgICsgZGF0YVsnZGVzY3JpcHRpb25zJ11banNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykudG9VcHBlckNhc2UoKV0gKyBgXCJcblx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0YCArIGRhdGFbJ25hbWVzJ11banNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykudG9VcHBlckNhc2UoKV0ucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgICAgICAgICAgICAgICsgYFxuXHRcdFx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJjb2wtbWQtNCBsaXN0LWVsZW1lbnQtYWN0aW9uc1wiPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwiZWRpdC1yb2xlXCIgZGF0YS1pZD1cImAgKyBkYXRhWydpZCddICsgYFwiPjxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsXCI+PC9pPjwvYT5cblx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cImFkbWluLnBocD9kbz1BZG1pbkFjY2Vzcy9tYW5hZ2VQZXJtaXNzaW9ucyZpZD1gICsgZGF0YVsnaWQnXSArIGBcIj48aSBjbGFzcz1cImZhIGZhLWNvZ1wiPjwvaT48L2E+XG5cdFx0XHRcdFx0XHRcdDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJkZWxldGUtcm9sZVwiIGRhdGEtaWQ9XCJgICsgZGF0YVsnaWQnXSArIGBcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoLW9cIj48L2k+PC9hPlxuXHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiI1wiIGNsYXNzPVwic29ydC1oYW5kbGUgdWktc29ydGFibGUtaGFuZGxlXCI+PGkgY2xhc3M9XCJmYSBmYS1zb3J0XCI+PC9pPjwvYT5cblx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHQ8L2xpPlxuXHRcdFx0XHRgKTtcblxuICAgICAgICAgICAgICAgICQoJy5vdmVydmlldy1saXN0IC5saXN0LWVsZW1lbnQ6bGFzdCBhLmNyZWF0ZS1yb2xlJykub24oJ2NsaWNrJywgX29wZW5DcmVhdGVSb2xlTW9kYWwpO1xuICAgICAgICAgICAgICAgICQoJy5vdmVydmlldy1saXN0IC5saXN0LWVsZW1lbnQ6bGFzdCBhLmVkaXQtcm9sZScpLm9uKCdjbGljaycsIF9vcGVuRWRpdFJvbGVNb2RhbCk7XG4gICAgICAgICAgICAgICAgJCgnLm92ZXJ2aWV3LWxpc3QgLmxpc3QtZWxlbWVudDpsYXN0IGEuZGVsZXRlLXJvbGUnKS5vbignY2xpY2snLCBfb3BlbkRlbGV0ZVJvbGVNb2RhbCk7XG4gICAgICAgICAgICAgICAgJCgnLm92ZXJ2aWV3LWxpc3QgLmxpc3QtZWxlbWVudDpsYXN0IGEuc29ydC1oYW5kbGUnKS5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgY3JlYXRlIHJvbGUgYnV0dG9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdCBjb250YWlucyBpbmZvcm1hdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb3BlbkNyZWF0ZVJvbGVNb2RhbChldmVudCkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbi5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICRzZWxlY3RlZFJvbGVSb3cgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IG1vZGFsIGRhdGEgYW5kIG9wZW4gbW9kYWxcbiAgICAgICAgICAgIF9jbGVhck1vZGFsRm9ybSgpO1xuICAgICAgICAgICAgJG1vZGFsWydjcmVhdGVfZWRpdCddXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5tb2RhbC10aXRsZScpXG4gICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3JvbGVfbW9kYWxfY3JlYXRlX3RpdGxlJywgJ2FkbWluX2FjY2VzcycpKTtcbiAgICAgICAgICAgICRtb2RhbFsnY3JlYXRlX2VkaXQnXVxuICAgICAgICAgICAgICAgIC5maW5kKCdidXR0b24uY29uZmlybScpXG4gICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DUkVBVEUnLCAnYWRtaW5fYnV0dG9ucycpKTtcbiAgICAgICAgICAgICRtb2RhbFsnY3JlYXRlX2VkaXQnXVxuICAgICAgICAgICAgICAgIC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgZm9yIHRoZSBlZGl0IHJvbGUgYnV0dG9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdCBjb250YWlucyBpbmZvcm1hdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb3BlbkVkaXRSb2xlTW9kYWwoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCByb2xlSWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAkc2VsZWN0ZWRSb2xlUm93ID0gJCh0aGlzKS5jbG9zZXN0KCcubGlzdC1lbGVtZW50Jyk7XG5cbiAgICAgICAgICAgIC8vIExvYWQgcm9sZSBkYXRhIGFuZCBvcGVuIG1vZGFsIG9uIHN1Y2Nlc3NcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLmdldFJvbGVEYXRhICsgJyZyb2xlSWQ9JyArIHJvbGVJZCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlWydzdWNjZXNzJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF91cGRhdGVNb2RhbEZvcm0ocmVzcG9uc2VbJ2RhdGEnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLm1vZGFsLXRpdGxlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgncm9sZV9tb2RhbF9lZGl0X3RpdGxlJywgJ2FkbWluX2FjY2VzcycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbFsnY3JlYXRlX2VkaXQnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdidXR0b24uY29uZmlybScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9TQVZFJywgJ2FkbWluX2J1dHRvbnMnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF91bmV4cGVjdGVkRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIF91bmV4cGVjdGVkRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgdGhlIGRlbGV0ZSByb2xlIGJ1dHRvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29wZW5EZWxldGVSb2xlTW9kYWwoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCByb2xlSWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG4gICAgICAgICAgICAkc2VsZWN0ZWRSb2xlUm93ID0gJCh0aGlzKS5jbG9zZXN0KCcubGlzdC1lbGVtZW50Jyk7XG5cbiAgICAgICAgICAgIC8vIExvYWQgcm9sZSBkYXRhIGFuZCBvcGVuIG1vZGFsIG9uIHN1Y2Nlc3NcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLmdldFJvbGVEYXRhICsgJyZyb2xlSWQ9JyArIHJvbGVJZCxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlWydzdWNjZXNzJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbFsnZGVsZXRlJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1yb2xlSWRdJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudmFsKHJlc3BvbnNlWydkYXRhJ11bJ2lkJ10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFsWydkZWxldGUnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdmaWVsZHNldCAucm9sZS1uYW1lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGV4dChyZXNwb25zZVsnZGF0YSddWyduYW1lcyddW2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpLnRvVXBwZXJDYXNlKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbFsnZGVsZXRlJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnZmllbGRzZXQgLnJvbGUtZGVzY3JpcHRpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KHJlc3BvbnNlWydkYXRhJ11bJ2Rlc2NyaXB0aW9ucyddW2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2xhbmd1YWdlQ29kZScpLnRvVXBwZXJDYXNlKCldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbFsnZGVsZXRlJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubW9kYWwoJ3Nob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF91bmV4cGVjdGVkRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIF91bmV4cGVjdGVkRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgdGhlIGRlbGV0ZSBtb2RhbCBzdWJtaXQgYnV0dG9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdCBjb250YWlucyBpbmZvcm1hdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc3VibWl0Q3JlYXRlRWRpdE1vZGFsRm9ybShldmVudCkge1xuICAgICAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbi5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBfZ2V0TW9kYWxGb3JtRGF0YSgpO1xuICAgICAgICAgICAgY29uc3QgJGVtcHR5TmFtZUlucHV0cyA9ICRtb2RhbFsnY3JlYXRlX2VkaXQnXS5maW5kKCdpbnB1dFtuYW1lPXJvbGVOYW1lXScpLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQodGhpcykudmFsKCkgPT09ICcnO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCAkbm9uRW1wdHlOYW1lSW5wdXRzID0gJG1vZGFsWydjcmVhdGVfZWRpdCddLmZpbmQoJ2lucHV0W25hbWU9cm9sZU5hbWVdJykuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSAhPT0gJyc7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCRlbXB0eU5hbWVJbnB1dHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICgkbm9uRW1wdHlOYW1lSW5wdXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbGFuZyBpbiBkYXRhLm5hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5uYW1lc1tsYW5nXSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLm5hbWVzW2xhbmddID0gJG5vbkVtcHR5TmFtZUlucHV0cy5maXJzdCgpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVtcHR5TmFtZUlucHV0cy5hZGRDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXBkYXRlIHJvbGUgZGF0YVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJscy5zYXZlUm9sZURhdGEsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlWydzdWNjZXNzJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxbJ2NyZWF0ZV9lZGl0J11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVsnaWQnXSA9IHJlc3BvbnNlWydyb2xlSWQnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYWRkUm93VG9PdmVydmlldyhkYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKCcub3ZlcnZpZXctbGlzdC1jb250YWluZXInKS5oYXNDbGFzcygnZW1wdHknKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcub3ZlcnZpZXctbGlzdCBsaTpub3QoXCIubGlzdC1oZWFkbGluZVwiKTpmaXJzdCcpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcub3ZlcnZpZXctbGlzdC1jb250YWluZXInKS5yZW1vdmVDbGFzcygnZW1wdHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBfdW5leHBlY3RlZEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdW5leHBlY3RlZEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgdGhlIGNyZWF0ZSBlZGl0IG1vZGFsIHN1Ym1pdCBidXR0b24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zdWJtaXREZWxldGVNb2RhbEZvcm0oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBjb25zdCByb2xlSWQgPSAkbW9kYWxbJ2RlbGV0ZSddLmZpbmQoJ2lucHV0W25hbWU9cm9sZUlkXScpLnZhbCgpO1xuXG4gICAgICAgICAgICAvLyBVcGRhdGUgcm9sZSBkYXRhXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIHVybDogdXJscy5kZWxldGVSb2xlLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICdyb2xlSWQnOiByb2xlSWRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbJ3N1Y2Nlc3MnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFsWydkZWxldGUnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGVjdGVkUm9sZVJvdy5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy5vdmVydmlldy1saXN0IGxpOm5vdChcIi5saXN0LWhlYWRsaW5lXCIpJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm92ZXJ2aWV3LWxpc3QnKS5hcHBlbmQoYFxuXHRcdFx0XHRcdFx0XHRcdDxsaSBjbGFzcz1cImNvbC1tZC0xMiBsaXN0LWVsZW1lbnRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxzcGFuIGNsYXNzPVwidGl0bGVcIj5gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3RleHRfZW1wdHlfcm9sZXNfb3ZlcnZpZXdfbGlzdCcsICdhZG1pbl9hY2Nlc3MnKSArIGA8L3NwYW4+XG5cdFx0XHRcdFx0XHRcdFx0PC9saT5cblx0XHRcdFx0XHRcdFx0YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm92ZXJ2aWV3LWxpc3QtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdW5leHBlY3RlZEVycm9yKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBfdW5leHBlY3RlZEVycm9yKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNvcnRpbmcgZXZlbnQgaGFuZGxlciBmb3Igc29ydGFibGUgcGx1Z2luXG4gICAgICAgICAqXG4gICAgICAgICAqIE1ha2VzIGEgY2FsbCB0byB0aGUgYWpheCBjb250cm9sbGVyIGFmdGVyIGEgc29ydGluZyBldmVudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5IGV2ZW50IG9iamVjdCBjb250YWlucyBpbmZvcm1hdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB1aSAgICBTb3J0YWJsZSBsaXN0ICh1bCkgb2JqZWN0IHdpdGggbmV3IHNvcnQgb3JkZXJcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zYXZlU29ydGluZyhldmVudCwgdWkpIHtcbiAgICAgICAgICAgIGlmICghdWkuaXRlbS5wYXJlbnQoKS5pcygndWwnKSkge1xuICAgICAgICAgICAgICAgICRzb3J0YWJsZUxpc3Quc29ydGFibGUoJ2NhbmNlbCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogdXJscy5zYXZlU29ydGluZyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAnc29ydGluZyc6ICRzb3J0YWJsZUxpc3Quc29ydGFibGUoJ3RvQXJyYXknLCB7YXR0cmlidXRlOiAnZGF0YS1saXN0LWVsZW1lbnQtaWQnfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF91bmV4cGVjdGVkRXJyb3IoKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3RleHRfc2F2ZWRfc29ydGluZycsICdhZG1pbl9hY2Nlc3MnKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF91bmV4cGVjdGVkRXJyb3IoKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gbG9naWNcbiAgICAgICAgICAgICQoJ2EuY3JlYXRlLXJvbGUnKS5vbignY2xpY2snLCBfb3BlbkNyZWF0ZVJvbGVNb2RhbCk7XG4gICAgICAgICAgICAkKCdhLmVkaXQtcm9sZScpLm9uKCdjbGljaycsIF9vcGVuRWRpdFJvbGVNb2RhbCk7XG4gICAgICAgICAgICAkKCdhLmRlbGV0ZS1yb2xlJykub24oJ2NsaWNrJywgX29wZW5EZWxldGVSb2xlTW9kYWwpO1xuICAgICAgICAgICAgJCgnYS5zb3J0LWhhbmRsZScpLm9uKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJG1vZGFsWydjcmVhdGVfZWRpdCddXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2J1dHRvbi5jb25maXJtJylcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgX3N1Ym1pdENyZWF0ZUVkaXRNb2RhbEZvcm0pO1xuICAgICAgICAgICAgJG1vZGFsWydkZWxldGUnXVxuICAgICAgICAgICAgICAgIC5maW5kKCdidXR0b24uY29uZmlybScpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsIF9zdWJtaXREZWxldGVNb2RhbEZvcm0pO1xuXG4gICAgICAgICAgICAkc29ydGFibGVMaXN0XG4gICAgICAgICAgICAgICAgLnNvcnRhYmxlKHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6ICdsaS5saXN0LWVsZW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBheGlzOiAneScsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICAgICAgICAgICAgICBoYW5kbGU6ICcuc29ydC1oYW5kbGUnLFxuICAgICAgICAgICAgICAgICAgICBjb250YWlubWVudDogJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC43NSxcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdjb2wtbWQtMTIgbGlzdC1lbGVtZW50IHNvcnQtcGxhY2Vob2xkZXInXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAub24oJ3NvcnR1cGRhdGUnLCBfc2F2ZVNvcnRpbmcpXG4gICAgICAgICAgICAgICAgLmRpc2FibGVTZWxlY3Rpb24oKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pO1xuIl19
