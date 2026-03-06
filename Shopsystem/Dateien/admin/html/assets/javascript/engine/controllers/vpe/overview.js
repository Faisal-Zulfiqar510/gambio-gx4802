'use strict';

/* --------------------------------------------------------------
 create_missing_documents.js 2020-10-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module('overview', ['modal', 'xhr', gx.source + '/libs/info_box'], function (data) {

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
     * Default Module Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Module Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    /**
     * VPE Creation modal.
     *
     * @type {*}
     */
    var $creationModal = $('.create-modal');

    /**
     * VPE edit modal.
     *
     * @type {*}
     */
    var $editModal = $('.edit-modal');

    /**
     * VPE remove confirmation modal.
     *
     * @type {*}
     */
    var $removeConfirmationModal = $('.remove-confirmation-modal');

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Initializes the creation modal.
     *
     * @private
     */
    var _initCreationModal = function _initCreationModal() {
        var $inputs = $creationModal.find('input[type="text"]');
        var i = 0;

        for (; i < $inputs.length; i++) {
            $inputs[i].value = '';
            $($inputs[i]).parent().removeClass('has-error');
        }
        $creationModal.find('p.vpe-modal-info').first().text(jse.core.lang.translate('TEXT_INFO_INSERT_INTRO', 'products_vpe')).removeClass('text-danger');
        $creationModal.modal('show');
    };

    /**
     * Initializes the edit modal.
     *
     * @param e Event object to fetch targets id.
     * @private
     */
    var _initEditModal = function _initEditModal(e) {
        jse.libs.xhr.get({
            url: './admin.php?do=VPEAjax/getById&id=' + e.target.dataset.id
        }).done(function (r) {
            var $editModalForm = $editModal.find('form');
            var $idInput = $('<input/>').attr('type', 'hidden').attr('name', 'id');
            var $hiddenDefaultInput = void 0;
            $editModalForm.empty();

            $idInput.val(r.id.toString());
            $editModalForm.append($idInput);
            $editModal.find('p.vpe-modal-info').first().text(jse.core.lang.translate('TEXT_INFO_EDIT_INTRO', 'products_vpe')).removeClass('text-danger');

            $editModal.find('p.vpe-modal-id-info').text('ID: ' + r.id).removeClass('invisible');

            for (var languageCode in r.names) {
                var $formGroup = $('<div/>').addClass('form-group');
                var $inputContainer = $('<div/>').addClass('col-sm-12');
                var $input = $('<input/>').attr('type', 'text').attr('data-gx-widget', 'icon_input').attr('data-lang-id', r.languageIds[languageCode]).attr('name', 'name[' + r.languageIds[languageCode] + ']').addClass('form-control').val(r.names[languageCode]);

                $inputContainer.append($input);
                $formGroup.append($inputContainer);
                $editModalForm.append($formGroup);
            }

            if (r.default) {
                $hiddenDefaultInput = $('<input/>').attr('type', 'hidden').attr('name', 'is-default').val('1');
                $editModalForm.append($hiddenDefaultInput);
            }

            $editModalForm.append(_createDefaultSwitcher(r.default));
            gx.widgets.init($editModalForm);
            $editModal.modal('show');
        });
    };

    /**
     * Creates the switcher to set the vpe default.
     *
     * @param {bool} isDefault If true, the switcher is checked.
     * @private
     */
    var _createDefaultSwitcher = function _createDefaultSwitcher(isDefault) {
        var $formGroup = $('<div/>').addClass('form-group');
        var $label = $('<label/>').addClass('col-sm-2 control-label').text(jse.core.lang.translate('TEXT_DEFAULT', 'admin_general'));
        var $checkboxContainer = $('<div/>').addClass('col-sm-10').attr('data-gx-widget', 'checkbox');
        var $checkbox = $('<input/>').attr('type', 'checkbox').attr('name', 'default').attr('title', jse.core.lang.translate('TEXT_DEFAULT', 'admin_general'));
        if (isDefault) {
            $checkbox.prop('checked', true);
        }
        $checkboxContainer.append($checkbox);

        return $formGroup.append($label).append($checkboxContainer);
    };

    /**
     * Initializes the remove confirmation modal.
     *
     * @param e Event object to fetch targets id.
     * @private
     */
    var _initRemoveConfirmationModal = function _initRemoveConfirmationModal(e) {
        $removeConfirmationModal.modal('show');
        jse.libs.xhr.get({
            url: './admin.php?do=VPEAjax/getById&id=' + e.target.dataset.id
        }).done(function (r) {
            var $info = $('.vpe-modal-remove-info');
            $info.empty();
            $('.vpe-remove-id').val(r.id);

            for (var languageCode in r.names) {
                var newContent = languageCode + ': ' + r.names[languageCode] + '<br/>';
                var oldContent = $info.html();
                $info.html(oldContent + newContent);
            }
        });
    };

    /**
     * Sends an ajax request to store a new vpe entity.
     *
     * @private
     */
    var _storeVpe = function _storeVpe() {
        if (_validateInputFields('create')) {
            jse.libs.xhr.post({
                url: './admin.php?do=VPEAjax/store',
                data: _inputData('create')
            }).done(function () {
                return _renderTable(jse.core.lang.translate('TEXT_INFO_ADD_SUCCESS', 'products_vpe'));
            });
        }
    };

    /**
     * Sends an ajax request to update a new vpe entity.
     *
     * @private
     */
    var _editVpe = function _editVpe() {
        if (_validateInputFields('edit')) {
            jse.libs.xhr.post({
                url: './admin.php?do=VPEAjax/edit',
                data: _inputData('edit')
            }).done(function () {
                return _renderTable(jse.core.lang.translate('TEXT_INFO_EDIT_SUCCESS', 'products_vpe'));
            });
        }
    };

    /**
     * Sends an ajax request to remove a new vpe entity.
     *
     * @private
     */
    var _removeVpe = function _removeVpe() {
        jse.libs.xhr.post({
            url: './admin.php?do=VPEAjax/remove',
            data: {
                id: $('.vpe-remove-id').val()
            }
        }).done(function () {
            return _renderTable(jse.core.lang.translate('TEXT_INFO_DELETE_SUCCESS', 'products_vpe'));
        });
    };

    /**
     * Renders the vpe table again.
     *
     * @private
     */
    var _renderTable = function _renderTable(msg) {
        $creationModal.modal('hide');
        $editModal.modal('hide');
        $removeConfirmationModal.modal('hide');

        if (undefined !== msg) {
            jse.libs.info_box.addSuccessMessage(msg);
        }

        jse.libs.xhr.get({
            url: './admin.php?do=VPEAjax/getData'
        }).done(function (r) {
            var i = 0;
            var $body = $('.vpe-table tbody');
            $body.empty();

            for (; i < r.data.length; i++) {
                var $row = $('<tr/>');
                var $dataCol = $('<td/>');
                var $actionsCol = $('<td/>').addClass('actions');
                var $actionsContainer = $('<div/>').addClass('pull-right action-list visible-on-hover');
                var $edit = $('<i/>').addClass('fa fa-pencil edit').attr('data-id', r.data[i].id);
                var isDefault = r.data[i].default ? ' (' + jse.core.lang.translate('TEXT_DEFAULT', 'admin_general') + ')' : '';
                var $delete = void 0;

                $actionsContainer.append($edit);

                if (!r.data[i].default) {
                    $delete = $('<i/>').addClass('fa fa-trash-o delete').attr('data-id', r.data[i].id);
                    $actionsContainer.append($delete);
                }

                $actionsCol.append($actionsContainer);
                $dataCol.text(r.data[i].names[r.languageCode] + isDefault);

                $row.append($dataCol).append($actionsCol);
                $body.append($row);
            }
            $this.find('.edit').on('click', _initEditModal);
            $this.find('.delete').on('click', _initRemoveConfirmationModal);
        });
    };

    /**
     * Validates the input fields, returns true if they are valid and false otherwise.
     *
     * @param {string} modal Modal instance, whether 'create' or 'edit'.
     * @returns {boolean}
     * @private
     */
    var _validateInputFields = function _validateInputFields(modal) {
        var $modal = modal === 'edit' ? $editModal : $creationModal;
        var $inputs = $modal.find('input[type="text"]');
        var valid = false;

        for (var i = 0; i < $inputs.length; i++) {
            if ($inputs[i].value !== '') {
                valid = true;
            }
        }

        if (!valid) {
            for (var _i = 0; _i < $inputs.length; _i++) {
                $($inputs[_i]).parent().addClass('has-error');
            }
            $modal.find('p.vpe-modal-info').first().text(jse.core.lang.translate('ERROR_INVALID_INPUT_FIELDS', 'products_vpe')).removeClass('text-info').addClass('text-danger');

            return false;
        } else {
            for (var _i2 = 0; _i2 < $inputs.length; _i2++) {
                $($inputs[_i2]).parent().removeClass('has-error');
            }
            var textConstant = modal === 'edit' ? 'TEXT_INFO_EDIT_INTRO' : 'TEXT_INFO_INSERT_INTRO';
            $modal.find('p.vpe-modal-info').first().text(jse.core.lang.translate(textConstant, 'products_vpe')).removeClass('text-danger');

            return true;
        }
    };

    /**
     * Fetches the data from the input fields.
     *
     * @param {string} modal Modal instance, whether 'create' or 'edit'.
     * @returns {{id: int, name: object}}
     * @private
     */
    var _inputData = function _inputData(modal) {
        var data = {};
        var $modal = modal === 'edit' ? $editModal : $creationModal;
        var $inputs = $modal.find('input[type="text"]');
        var $default = $modal.find('input[name="default"]');
        var $id = $modal.find('input[name="id"]').val();
        var $isDefault = $modal.find('input[name="is-default"]').val();

        for (var i = 0; i < $inputs.length; i++) {
            data[$inputs[i].getAttribute('name')] = $inputs[i].value;
        }

        if ($default.parent().hasClass('checked')) {
            data['default'] = true;
        }

        if (undefined !== $id) {
            data['id'] = $id;
        }

        if (undefined !== $isDefault) {
            data['isDefault'] = $isDefault;
        }

        return data;
    };

    // ------------------------------------------------------------------------
    // INITIALIZE
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $('#add-vpe').on('click', _initCreationModal);
        $this.find('.edit').on('click', _initEditModal);
        $this.find('.delete').on('click', _initRemoveConfirmationModal);

        // actions
        $('#create-vpe').on('click', _storeVpe);
        $('#edit-vpe').on('click', _editVpe);
        $('#remove-vpe').on('click', _removeVpe);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZwZS9vdmVydmlldy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIiRjcmVhdGlvbk1vZGFsIiwiJGVkaXRNb2RhbCIsIiRyZW1vdmVDb25maXJtYXRpb25Nb2RhbCIsIl9pbml0Q3JlYXRpb25Nb2RhbCIsIiRpbnB1dHMiLCJmaW5kIiwiaSIsImxlbmd0aCIsInZhbHVlIiwicGFyZW50IiwicmVtb3ZlQ2xhc3MiLCJmaXJzdCIsInRleHQiLCJqc2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIm1vZGFsIiwiX2luaXRFZGl0TW9kYWwiLCJsaWJzIiwieGhyIiwiZ2V0IiwidXJsIiwiZSIsInRhcmdldCIsImRhdGFzZXQiLCJpZCIsImRvbmUiLCIkZWRpdE1vZGFsRm9ybSIsIiRpZElucHV0IiwiYXR0ciIsIiRoaWRkZW5EZWZhdWx0SW5wdXQiLCJlbXB0eSIsInZhbCIsInIiLCJ0b1N0cmluZyIsImFwcGVuZCIsImxhbmd1YWdlQ29kZSIsIm5hbWVzIiwiJGZvcm1Hcm91cCIsImFkZENsYXNzIiwiJGlucHV0Q29udGFpbmVyIiwiJGlucHV0IiwibGFuZ3VhZ2VJZHMiLCJkZWZhdWx0IiwiX2NyZWF0ZURlZmF1bHRTd2l0Y2hlciIsIndpZGdldHMiLCJpbml0IiwiaXNEZWZhdWx0IiwiJGxhYmVsIiwiJGNoZWNrYm94Q29udGFpbmVyIiwiJGNoZWNrYm94IiwicHJvcCIsIl9pbml0UmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwiLCIkaW5mbyIsIm5ld0NvbnRlbnQiLCJvbGRDb250ZW50IiwiaHRtbCIsIl9zdG9yZVZwZSIsIl92YWxpZGF0ZUlucHV0RmllbGRzIiwicG9zdCIsIl9pbnB1dERhdGEiLCJfcmVuZGVyVGFibGUiLCJfZWRpdFZwZSIsIl9yZW1vdmVWcGUiLCJtc2ciLCJ1bmRlZmluZWQiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiJGJvZHkiLCIkcm93IiwiJGRhdGFDb2wiLCIkYWN0aW9uc0NvbCIsIiRhY3Rpb25zQ29udGFpbmVyIiwiJGVkaXQiLCIkZGVsZXRlIiwib24iLCIkbW9kYWwiLCJ2YWxpZCIsInRleHRDb25zdGFudCIsIiRkZWZhdWx0IiwiJGlkIiwiJGlzRGVmYXVsdCIsImdldEF0dHJpYnV0ZSIsImhhc0NsYXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixVQUF0QixFQUFrQyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCRixHQUFHRyxNQUFILEdBQVksZ0JBQTdCLENBQWxDLEVBQWtGLFVBQVVDLElBQVYsRUFBZ0I7O0FBRTlGOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRixTQUFTLEVBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTVEsaUJBQWlCSixFQUFFLGVBQUYsQ0FBdkI7O0FBRUE7Ozs7O0FBS0EsUUFBTUssYUFBYUwsRUFBRSxhQUFGLENBQW5COztBQUVBOzs7OztBQUtBLFFBQU1NLDJCQUEyQk4sRUFBRSw0QkFBRixDQUFqQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsUUFBTU8scUJBQXFCLFNBQXJCQSxrQkFBcUIsR0FBTTtBQUM3QixZQUFNQyxVQUFVSixlQUFlSyxJQUFmLENBQW9CLG9CQUFwQixDQUFoQjtBQUNBLFlBQUlDLElBQUksQ0FBUjs7QUFFQSxlQUFPQSxJQUFJRixRQUFRRyxNQUFuQixFQUEyQkQsR0FBM0IsRUFBZ0M7QUFDNUJGLG9CQUFRRSxDQUFSLEVB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Q1osaUJBQUtVLFFBQVFFLENBQVIsRUFBVzZFLFlBQVgsQ0FBd0IsTUFBeEIsQ0FBTCxJQUF3Qy9FLFFBQVFFLENBQVIsRUFBV0UsS0FBbkQ7QUFDSDs7QUFFRCxZQUFJd0UsU0FBU3ZFLE1BQVQsR0FBa0IyRSxRQUFsQixDQUEyQixTQUEzQixDQUFKLEVBQTJDO0FBQ3ZDMUYsaUJBQUssU0FBTCxJQUFrQixJQUFsQjtBQUNIOztBQUVELFlBQUl3RSxjQUFjZSxHQUFsQixFQUF1QjtBQUNuQnZGLGlCQUFLLElBQUwsSUFBYXVGLEdBQWI7QUFDSDs7QUFFRCxZQUFJZixjQUFjZ0IsVUFBbEIsRUFBOEI7QUFDMUJ4RixpQkFBSyxXQUFMLElBQW9Cd0YsVUFBcEI7QUFDSDs7QUFFRCxlQUFPeEYsSUFBUDtBQUNILEtBekJEOztBQTRCQTtBQUNBO0FBQ0E7O0FBRUFGLFdBQU91RCxJQUFQLEdBQWMsVUFBVXBCLElBQVYsRUFBZ0I7QUFDMUIvQixVQUFFLFVBQUYsRUFBY2dGLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEJ6RSxrQkFBMUI7QUFDQVIsY0FBTVUsSUFBTixDQUFXLE9BQVgsRUFBb0J1RSxFQUFwQixDQUF1QixPQUF2QixFQUFnQzFELGNBQWhDO0FBQ0F2QixjQUFNVSxJQUFOLENBQVcsU0FBWCxFQUFzQnVFLEVBQXRCLENBQXlCLE9BQXpCLEVBQWtDdkIsNEJBQWxDOztBQUVBO0FBQ0F6RCxVQUFFLGFBQUYsRUFBaUJnRixFQUFqQixDQUFvQixPQUFwQixFQUE2QmxCLFNBQTdCO0FBQ0E5RCxVQUFFLFdBQUYsRUFBZWdGLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkJiLFFBQTNCO0FBQ0FuRSxVQUFFLGFBQUYsRUFBaUJnRixFQUFqQixDQUFvQixPQUFwQixFQUE2QlosVUFBN0I7O0FBRUFyQztBQUNILEtBWEQ7O0FBYUEsV0FBT25DLE1BQVA7QUFDSCxDQWhYRCIsImZpbGUiOiJ2cGUvb3ZlcnZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNyZWF0ZV9taXNzaW5nX2RvY3VtZW50cy5qcyAyMDIwLTEwLTIxXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29udHJvbGxlcnMubW9kdWxlKCdvdmVydmlldycsIFsnbW9kYWwnLCAneGhyJywgZ3guc291cmNlICsgJy9saWJzL2luZm9fYm94J10sIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBWQVJJQUJMRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAqXG4gICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgKi9cbiAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IE1vZHVsZSBPcHRpb25zXG4gICAgICpcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBGaW5hbCBNb2R1bGUgT3B0aW9uc1xuICAgICAqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgIC8qKlxuICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgKlxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAvKipcbiAgICAgKiBWUEUgQ3JlYXRpb24gbW9kYWwuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Kn1cbiAgICAgKi9cbiAgICBjb25zdCAkY3JlYXRpb25Nb2RhbCA9ICQoJy5jcmVhdGUtbW9kYWwnKTtcblxuICAgIC8qKlxuICAgICAqIFZQRSBlZGl0IG1vZGFsLlxuICAgICAqXG4gICAgICogQHR5cGUgeyp9XG4gICAgICovXG4gICAgY29uc3QgJGVkaXRNb2RhbCA9ICQoJy5lZGl0LW1vZGFsJyk7XG5cbiAgICAvKipcbiAgICAgKiBWUEUgcmVtb3ZlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHsqfVxuICAgICAqL1xuICAgIGNvbnN0ICRyZW1vdmVDb25maXJtYXRpb25Nb2RhbCA9ICQoJy5yZW1vdmUtY29uZmlybWF0aW9uLW1vZGFsJyk7XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBGVU5DVElPTlNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBjcmVhdGlvbiBtb2RhbC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX2luaXRDcmVhdGlvbk1vZGFsID0gKCkgPT4ge1xuICAgICAgICBjb25zdCAkaW5wdXRzID0gJGNyZWF0aW9uTW9kYWwuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuXG4gICAgICAgIGZvciAoOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJGlucHV0c1tpXS52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgJCgkaW5wdXRzW2ldKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgJGNyZWF0aW9uTW9kYWwuZmluZCgncC52cGUtbW9kYWwtaW5mbycpXG4gICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19JTlNFUlRfSU5UUk8nLCAncHJvZHVjdHNfdnBlJykpXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG4gICAgICAgICRjcmVhdGlvbk1vZGFsLm1vZGFsKCdzaG93Jyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBlZGl0IG1vZGFsLlxuICAgICAqXG4gICAgICogQHBhcmFtIGUgRXZlbnQgb2JqZWN0IHRvIGZldGNoIHRhcmdldHMgaWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfaW5pdEVkaXRNb2RhbCA9IGUgPT4ge1xuICAgICAgICBqc2UubGlicy54aHIuZ2V0KHtcbiAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPVZQRUFqYXgvZ2V0QnlJZCZpZD0nICsgZS50YXJnZXQuZGF0YXNldC5pZFxuICAgICAgICB9KS5kb25lKHIgPT4ge1xuICAgICAgICAgICAgY29uc3QgJGVkaXRNb2RhbEZvcm0gPSAkZWRpdE1vZGFsLmZpbmQoJ2Zvcm0nKTtcbiAgICAgICAgICAgIGNvbnN0ICRpZElucHV0ID0gJCgnPGlucHV0Lz4nKS5hdHRyKCd0eXBlJywgJ2hpZGRlbicpLmF0dHIoJ25hbWUnLCAnaWQnKTtcbiAgICAgICAgICAgIGxldCAkaGlkZGVuRGVmYXVsdElucHV0O1xuICAgICAgICAgICAgJGVkaXRNb2RhbEZvcm0uZW1wdHkoKTtcblxuICAgICAgICAgICAgJGlkSW5wdXQudmFsKHIuaWQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAkZWRpdE1vZGFsRm9ybS5hcHBlbmQoJGlkSW5wdXQpO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5maW5kKCdwLnZwZS1tb2RhbC1pbmZvJylcbiAgICAgICAgICAgICAgICAuZmlyc3QoKVxuICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fRURJVF9JTlRSTycsICdwcm9kdWN0c192cGUnKSlcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICRlZGl0TW9kYWwuZmluZCgncC52cGUtbW9kYWwtaWQtaW5mbycpLnRleHQoYElEOiAke3IuaWR9YCkucmVtb3ZlQ2xhc3MoJ2ludmlzaWJsZScpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBsYW5ndWFnZUNvZGUgaW4gci5uYW1lcykge1xuICAgICAgICAgICAgICAgIGxldCAkZm9ybUdyb3VwID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2Zvcm0tZ3JvdXAnKTtcbiAgICAgICAgICAgICAgICBsZXQgJGlucHV0Q29udGFpbmVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2NvbC1zbS0xMicpO1xuICAgICAgICAgICAgICAgIGxldCAkaW5wdXQgPSAkKCc8aW5wdXQvPicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1neC13aWRnZXQnLCAnaWNvbl9pbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLWxhbmctaWQnLCByLmxhbmd1YWdlSWRzW2xhbmd1YWdlQ29kZV0pXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCduYW1lJywgJ25hbWVbJyArIHIubGFuZ3VhZ2VJZHNbbGFuZ3VhZ2VDb2RlXSArICddJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdmb3JtLWNvbnRyb2wnKVxuICAgICAgICAgICAgICAgICAgICAudmFsKHIubmFtZXNbbGFuZ3VhZ2VDb2RlXSk7XG5cbiAgICAgICAgICAgICAgICAkaW5wdXRDb250YWluZXIuYXBwZW5kKCRpbnB1dCk7XG4gICAgICAgICAgICAgICAgJGZvcm1Hcm91cC5hcHBlbmQoJGlucHV0Q29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAkZWRpdE1vZGFsRm9ybS5hcHBlbmQoJGZvcm1Hcm91cCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyLmRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuRGVmYXVsdElucHV0ID0gJCgnPGlucHV0Lz4nKS5hdHRyKCd0eXBlJywgJ2hpZGRlbicpLmF0dHIoJ25hbWUnLCAnaXMtZGVmYXVsdCcpLnZhbCgnMScpO1xuICAgICAgICAgICAgICAgICRlZGl0TW9kYWxGb3JtLmFwcGVuZCgkaGlkZGVuRGVmYXVsdElucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGVkaXRNb2RhbEZvcm0uYXBwZW5kKF9jcmVhdGVEZWZhdWx0U3dpdGNoZXIoci5kZWZhdWx0KSk7XG4gICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJGVkaXRNb2RhbEZvcm0pO1xuICAgICAgICAgICAgJGVkaXRNb2RhbC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBzd2l0Y2hlciB0byBzZXQgdGhlIHZwZSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sfSBpc0RlZmF1bHQgSWYgdHJ1ZSwgdGhlIHN3aXRjaGVyIGlzIGNoZWNrZWQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfY3JlYXRlRGVmYXVsdFN3aXRjaGVyID0gKGlzRGVmYXVsdCkgPT4ge1xuICAgICAgICBjb25zdCAkZm9ybUdyb3VwID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2Zvcm0tZ3JvdXAnKTtcbiAgICAgICAgY29uc3QgJGxhYmVsID0gJCgnPGxhYmVsLz4nKVxuICAgICAgICAgICAgLmFkZENsYXNzKCdjb2wtc20tMiBjb250cm9sLWxhYmVsJylcbiAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0RFRkFVTFQnLCAnYWRtaW5fZ2VuZXJhbCcpKTtcbiAgICAgICAgY29uc3QgJGNoZWNrYm94Q29udGFpbmVyID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2NvbC1zbS0xMCcpLmF0dHIoJ2RhdGEtZ3gtd2lkZ2V0JywgJ2NoZWNrYm94Jyk7XG4gICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICQoJzxpbnB1dC8+JylcbiAgICAgICAgICAgIC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JylcbiAgICAgICAgICAgIC5hdHRyKCduYW1lJywgJ2RlZmF1bHQnKVxuICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfREVGQVVMVCcsICdhZG1pbl9nZW5lcmFsJykpO1xuICAgICAgICBpZiAoaXNEZWZhdWx0KSB7XG4gICAgICAgICAgICAkY2hlY2tib3gucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgICRjaGVja2JveENvbnRhaW5lci5hcHBlbmQoJGNoZWNrYm94KTtcblxuICAgICAgICByZXR1cm4gJGZvcm1Hcm91cC5hcHBlbmQoJGxhYmVsKS5hcHBlbmQoJGNoZWNrYm94Q29udGFpbmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgcmVtb3ZlIGNvbmZpcm1hdGlvbiBtb2RhbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBlIEV2ZW50IG9iamVjdCB0byBmZXRjaCB0YXJnZXRzIGlkLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX2luaXRSZW1vdmVDb25maXJtYXRpb25Nb2RhbCA9IGUgPT4ge1xuICAgICAgICAkcmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1WUEVBamF4L2dldEJ5SWQmaWQ9JyArIGUudGFyZ2V0LmRhdGFzZXQuaWRcbiAgICAgICAgfSkuZG9uZShyID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRpbmZvID0gJCgnLnZwZS1tb2RhbC1yZW1vdmUtaW5mbycpO1xuICAgICAgICAgICAgJGluZm8uZW1wdHkoKTtcbiAgICAgICAgICAgICQoJy52cGUtcmVtb3ZlLWlkJykudmFsKHIuaWQpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBsYW5ndWFnZUNvZGUgaW4gci5uYW1lcykge1xuICAgICAgICAgICAgICAgIGxldCBuZXdDb250ZW50ID0gbGFuZ3VhZ2VDb2RlICsgJzogJyArIHIubmFtZXNbbGFuZ3VhZ2VDb2RlXSArICc8YnIvPic7XG4gICAgICAgICAgICAgICAgbGV0IG9sZENvbnRlbnQgPSAkaW5mby5odG1sKCk7XG4gICAgICAgICAgICAgICAgJGluZm8uaHRtbChvbGRDb250ZW50ICsgbmV3Q29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmRzIGFuIGFqYXggcmVxdWVzdCB0byBzdG9yZSBhIG5ldyB2cGUgZW50aXR5LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfc3RvcmVWcGUgPSAoKSA9PiB7XG4gICAgICAgIGlmIChfdmFsaWRhdGVJbnB1dEZpZWxkcygnY3JlYXRlJykpIHtcbiAgICAgICAgICAgIGpzZS5saWJzLnhoci5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1WUEVBamF4L3N0b3JlJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBfaW5wdXREYXRhKCdjcmVhdGUnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiBfcmVuZGVyVGFibGUoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19BRERfU1VDQ0VTUycsICdwcm9kdWN0c192cGUnKSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYW4gYWpheCByZXF1ZXN0IHRvIHVwZGF0ZSBhIG5ldyB2cGUgZW50aXR5LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdCBfZWRpdFZwZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKF92YWxpZGF0ZUlucHV0RmllbGRzKCdlZGl0JykpIHtcbiAgICAgICAgICAgIGpzZS5saWJzLnhoci5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcuL2FkbWluLnBocD9kbz1WUEVBamF4L2VkaXQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IF9pbnB1dERhdGEoJ2VkaXQnKVxuICAgICAgICAgICAgfSkuZG9uZSgoKSA9PiBfcmVuZGVyVGFibGUoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19FRElUX1NVQ0NFU1MnLCAncHJvZHVjdHNfdnBlJykpKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhbiBhamF4IHJlcXVlc3QgdG8gcmVtb3ZlIGEgbmV3IHZwZSBlbnRpdHkuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0IF9yZW1vdmVWcGUgPSAoKSA9PiB7XG4gICAgICAgIGpzZS5saWJzLnhoci5wb3N0KHtcbiAgICAgICAgICAgIHVybDogJy4vYWRtaW4ucGhwP2RvPVZQRUFqYXgvcmVtb3ZlJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBpZDogJCgnLnZwZS1yZW1vdmUtaWQnKS52YWwoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5kb25lKCgpID0+IF9yZW5kZXJUYWJsZShqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9JTkZPX0RFTEVURV9TVUNDRVNTJywgJ3Byb2R1Y3RzX3ZwZScpKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhlIHZwZSB0YWJsZSBhZ2Fpbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX3JlbmRlclRhYmxlID0gKG1zZykgPT4ge1xuICAgICAgICAkY3JlYXRpb25Nb2RhbC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAkZWRpdE1vZGFsLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICRyZW1vdmVDb25maXJtYXRpb25Nb2RhbC5tb2RhbCgnaGlkZScpO1xuXG4gICAgICAgIGlmICh1bmRlZmluZWQgIT09IG1zZykge1xuICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UobXNnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGpzZS5saWJzLnhoci5nZXQoe1xuICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89VlBFQWpheC9nZXREYXRhJ1xuICAgICAgICB9KS5kb25lKHIgPT4ge1xuICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgY29uc3QgJGJvZHkgPSAkKCcudnBlLXRhYmxlIHRib2R5Jyk7XG4gICAgICAgICAgICAkYm9keS5lbXB0eSgpO1xuXG4gICAgICAgICAgICBmb3IgKDsgaSA8IHIuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCAkcm93ID0gJCgnPHRyLz4nKTtcbiAgICAgICAgICAgICAgICBsZXQgJGRhdGFDb2wgPSAkKCc8dGQvPicpO1xuICAgICAgICAgICAgICAgIGxldCAkYWN0aW9uc0NvbCA9ICQoJzx0ZC8+JykuYWRkQ2xhc3MoJ2FjdGlvbnMnKTtcbiAgICAgICAgICAgICAgICBsZXQgJGFjdGlvbnNDb250YWluZXIgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygncHVsbC1yaWdodCBhY3Rpb24tbGlzdCB2aXNpYmxlLW9uLWhvdmVyJyk7XG4gICAgICAgICAgICAgICAgbGV0ICRlZGl0ID0gJCgnPGkvPicpLmFkZENsYXNzKCdmYSBmYS1wZW5jaWwgZWRpdCcpLmF0dHIoJ2RhdGEtaWQnLCByLmRhdGFbaV0uaWQpO1xuICAgICAgICAgICAgICAgIGxldCBpc0RlZmF1bHQgPSByLmRhdGFbaV0uZGVmYXVsdCA/ICcgKCcgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9ERUZBVUxUJywgJ2FkbWluX2dlbmVyYWwnKVxuICAgICAgICAgICAgICAgICAgICArICcpJyA6ICcnO1xuICAgICAgICAgICAgICAgIGxldCAkZGVsZXRlO1xuXG4gICAgICAgICAgICAgICAgJGFjdGlvbnNDb250YWluZXIuYXBwZW5kKCRlZGl0KTtcblxuICAgICAgICAgICAgICAgIGlmICghci5kYXRhW2ldLmRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGRlbGV0ZSA9ICQoJzxpLz4nKS5hZGRDbGFzcygnZmEgZmEtdHJhc2gtbyBkZWxldGUnKS5hdHRyKCdkYXRhLWlkJywgci5kYXRhW2ldLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgJGFjdGlvbnNDb250YWluZXIuYXBwZW5kKCRkZWxldGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRhY3Rpb25zQ29sLmFwcGVuZCgkYWN0aW9uc0NvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgJGRhdGFDb2wudGV4dChyLmRhdGFbaV0ubmFtZXNbci5sYW5ndWFnZUNvZGVdICsgaXNEZWZhdWx0KTtcblxuICAgICAgICAgICAgICAgICRyb3cuYXBwZW5kKCRkYXRhQ29sKS5hcHBlbmQoJGFjdGlvbnNDb2wpO1xuICAgICAgICAgICAgICAgICRib2R5LmFwcGVuZCgkcm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5lZGl0Jykub24oJ2NsaWNrJywgX2luaXRFZGl0TW9kYWwpO1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmRlbGV0ZScpLm9uKCdjbGljaycsIF9pbml0UmVtb3ZlQ29uZmlybWF0aW9uTW9kYWwpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIHRoZSBpbnB1dCBmaWVsZHMsIHJldHVybnMgdHJ1ZSBpZiB0aGV5IGFyZSB2YWxpZCBhbmQgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsIE1vZGFsIGluc3RhbmNlLCB3aGV0aGVyICdjcmVhdGUnIG9yICdlZGl0Jy5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0IF92YWxpZGF0ZUlucHV0RmllbGRzID0gKG1vZGFsKSA9PiB7XG4gICAgICAgIGNvbnN0ICRtb2RhbCA9IG1vZGFsID09PSAnZWRpdCcgPyAkZWRpdE1vZGFsIDogJGNyZWF0aW9uTW9kYWw7XG4gICAgICAgIGNvbnN0ICRpbnB1dHMgPSAkbW9kYWwuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKTtcbiAgICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XG5cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRpbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgkaW5wdXRzW2ldLnZhbHVlICE9PSAnJykge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICQoJGlucHV0c1tpXSkucGFyZW50KCkuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJ3AudnBlLW1vZGFsLWluZm8nKVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0VSUk9SX0lOVkFMSURfSU5QVVRfRklFTERTJywgJ3Byb2R1Y3RzX3ZwZScpKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygndGV4dC1pbmZvJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3RleHQtZGFuZ2VyJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICQoJGlucHV0c1tpXSkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHRleHRDb25zdGFudCA9IG1vZGFsID09PSAnZWRpdCcgPyAnVEVYVF9JTkZPX0VESVRfSU5UUk8nIDogJ1RFWFRfSU5GT19JTlNFUlRfSU5UUk8nO1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJ3AudnBlLW1vZGFsLWluZm8nKVxuICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUodGV4dENvbnN0YW50LCAncHJvZHVjdHNfdnBlJykpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0ZXh0LWRhbmdlcicpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBkYXRhIGZyb20gdGhlIGlucHV0IGZpZWxkcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbCBNb2RhbCBpbnN0YW5jZSwgd2hldGhlciAnY3JlYXRlJyBvciAnZWRpdCcuXG4gICAgICogQHJldHVybnMge3tpZDogaW50LCBuYW1lOiBvYmplY3R9fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY29uc3QgX2lucHV0RGF0YSA9IChtb2RhbCkgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0ICRtb2RhbCA9IG1vZGFsID09PSAnZWRpdCcgPyAkZWRpdE1vZGFsIDogJGNyZWF0aW9uTW9kYWw7XG4gICAgICAgIGNvbnN0ICRpbnB1dHMgPSAkbW9kYWwuZmluZCgnaW5wdXRbdHlwZT1cInRleHRcIl0nKTtcbiAgICAgICAgY29uc3QgJGRlZmF1bHQgPSAkbW9kYWwuZmluZCgnaW5wdXRbbmFtZT1cImRlZmF1bHRcIl0nKTtcbiAgICAgICAgY29uc3QgJGlkID0gJG1vZGFsLmZpbmQoJ2lucHV0W25hbWU9XCJpZFwiXScpLnZhbCgpO1xuICAgICAgICBjb25zdCAkaXNEZWZhdWx0ID0gJG1vZGFsLmZpbmQoJ2lucHV0W25hbWU9XCJpcy1kZWZhdWx0XCJdJykudmFsKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkaW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkYXRhWyRpbnB1dHNbaV0uZ2V0QXR0cmlidXRlKCduYW1lJyldID0gJGlucHV0c1tpXS52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgkZGVmYXVsdC5wYXJlbnQoKS5oYXNDbGFzcygnY2hlY2tlZCcpKSB7XG4gICAgICAgICAgICBkYXRhWydkZWZhdWx0J10gPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gJGlkKSB7XG4gICAgICAgICAgICBkYXRhWydpZCddID0gJGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gJGlzRGVmYXVsdCkge1xuICAgICAgICAgICAgZGF0YVsnaXNEZWZhdWx0J10gPSAkaXNEZWZhdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJTklUSUFMSVpFXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICQoJyNhZGQtdnBlJykub24oJ2NsaWNrJywgX2luaXRDcmVhdGlvbk1vZGFsKTtcbiAgICAgICAgJHRoaXMuZmluZCgnLmVkaXQnKS5vbignY2xpY2snLCBfaW5pdEVkaXRNb2RhbCk7XG4gICAgICAgICR0aGlzLmZpbmQoJy5kZWxldGUnKS5vbignY2xpY2snLCBfaW5pdFJlbW92ZUNvbmZpcm1hdGlvbk1vZGFsKTtcblxuICAgICAgICAvLyBhY3Rpb25zXG4gICAgICAgICQoJyNjcmVhdGUtdnBlJykub24oJ2NsaWNrJywgX3N0b3JlVnBlKTtcbiAgICAgICAgJCgnI2VkaXQtdnBlJykub24oJ2NsaWNrJywgX2VkaXRWcGUpO1xuICAgICAgICAkKCcjcmVtb3ZlLXZwZScpLm9uKCdjbGljaycsIF9yZW1vdmVWcGUpO1xuXG4gICAgICAgIGRvbmUoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG1vZHVsZTtcbn0pO1xuIl19
