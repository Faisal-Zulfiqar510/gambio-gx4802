'use strict';

/* --------------------------------------------------------------
 specials_bulk_delete.js 2018-04-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Specials Bulk Delete Module
 *
 * This module handels the bulk deletion for the specials.
 *
 * @module Compatibility/specials_bulk_delete
 */
gx.compatibility.module('specials_bulk_delete', [],

/**  @lends module:Compatibility/specials_bulk_delete */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Reference
     *
     * @var {object}
     */

    var $this = $(this);

    /**
     * Bulk delete modal object
     *
     * @type {object}
     */
    var $modal = $('#modal_layer_container');

    /**
     * Bulk delete form object
     *
     * @type {object}
     */
    var $form = $('#bulk_delete_confirm_form');

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @var {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------


    /**
     * Handler for the click event, that's triggered by the delete button.
     */
    var _handleDeleteButton = function _handleDeleteButton(event) {
        event.preventDefault();

        $form.find('.products-to-delete').html('');
        $.each($this.find('.delete-special:checked'), _addSpecialsToModal);

        $form.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_BULK_DELETE_SPECIALS', 'admin_specials'),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 420
        });
    };

    /**
     * Returns the modal buttons, that are used in the delete confirmation modal.
     *
     * @return {object} Buttons fpr the delete confirmation modal
     */
    var _getModalButtons = function _getModalButtons($form) {
        return [{
            'text': jse.core.lang.translate('close', 'buttons'),
            'class': 'btn',
            'click': function click() {
                $(this).dialog('close');
            }
        }, {
            'text': jse.core.lang.translate('delete', 'buttons'),
            'class': 'btn btn-primary',
            'click': function click() {
                $form.submit();
            }
        }];
    };

    /**
     * Adds the informations of the selected specials to the delete confirmation modal.
     */
    var _addSpecialsToModal = function _addSpecialsToModal(key, checkbox) {
        $form.find('.products-to-delete').append($('<li/>', {
            'text': $(checkbox).data('product-name')
        }));

        $form.find('.products-to-delete').append($('<input/>', {
            'name': 'deleteSpecial[]',
            'value': $(checkbox).data('special-id')
        }).hide());
    };

    /**
     * Handler for the click event, that's triggered by a normal checkbox in the specials overview table.
     */
    var _handleNormalCheckbox = function _handleNormalCheckbox() {
        var numChecked = $this.find('.delete-special:checked').length;
        var numNotChecked = $this.find('.delete-special').length;

        if (numChecked === numNotChecked && numChecked > 0) {
            $this.find('.select-all-checkbox').prop('checked', true);
            $this.find('.select-all-checkbox').closest('.single-checkbox').addClass('checked');
        } else {
            $this.find('.select-all-checkbox').prop('checked', false);
            $this.find('.select-all-checkbox').closest('.single-checkbox').removeClass('checked');
        }

        if (numChecked === 0) {
            $this.find('.bulk-delete').prop('disabled', true);
        } else {
            $this.find('.bulk-delete').prop('disabled', false);
        }
    };

    /**
     * Handler for the click event, that's triggered by the checkbox in the head of the specials overview table.
     */
    var _handleSelectAllCheckbox = function _handleSelectAllCheckbox() {
        var allChecked = $this.find('.select-all-checkbox').is(":checked");

        if (allChecked) {
            $this.find('.delete-special').prop('checked', true);
            $this.find('.delete-special').parent('.single-checkbox').addClass('checked');
        } else {
            $this.find('.delete-special').prop('checked', false);
            $this.find('.delete-special').parent('.single-checkbox').removeClass('checked');
        }

        if ($this.find('.select-all-checkbox').is(":checked") && $this.find('.delete-special:checked').length > 0) {
            $this.find('.bulk-delete').prop('disabled', false);
        } else {
            $this.find('.bulk-delete').prop('disabled', true);
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.find('.select-all-checkbox').on('click', _handleSelectAllCheckbox);
        $this.find('.delete-special').on('click', _handleNormalCheckbox);
        $this.find('.bulk-delete').on('click', _handleDeleteButton);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWNpYWxzL3NwZWNpYWxzX2J1bGtfZGVsZXRlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkbW9kYWwiLCIkZm9ybSIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9oYW5kbGVEZWxldGVCdXR0b24iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiZmluZCIsImh0bWwiLCJlYWNoIiwiX2FkZFNwZWNpYWxzVG9Nb2RhbCIsImRpYWxvZyIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiX2dldE1vZGFsQnV0dG9ucyIsInN1Ym1pdCIsImtleSIsImNoZWNrYm94IiwiYXBwZW5kIiwiaGlkZSIsIl9oYW5kbGVOb3JtYWxDaGVja2JveCIsIm51bUNoZWNrZWQiLCJsZW5ndGgiLCJudW1Ob3RDaGVja2VkIiwicHJvcCIsImNsb3Nlc3QiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiX2hhbmRsZVNlbGVjdEFsbENoZWNrYm94IiwiYWxsQ2hlY2tlZCIsImlzIiwicGFyZW50IiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksc0JBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxTQUFTRCxFQUFFLHdCQUFGLENBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTUUsUUFBUUYsRUFBRSwyQkFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1HLFdBQVcsRUFBakI7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUosRUFBRUssTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1C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Q0osS0FoQkQ7O0FBa0JBO0FBQ0E7QUFDQTs7QUFFQS9CLFdBQU91QyxJQUFQLEdBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3BCdEMsY0FBTVUsSUFBTixDQUFXLHNCQUFYLEVBQW1DNkIsRUFBbkMsQ0FBc0MsT0FBdEMsRUFBK0NOLHdCQUEvQztBQUNBakMsY0FBTVUsSUFBTixDQUFXLGlCQUFYLEVBQThCNkIsRUFBOUIsQ0FBaUMsT0FBakMsRUFBMENkLHFCQUExQztBQUNBekIsY0FBTVUsSUFBTixDQUFXLGNBQVgsRUFBMkI2QixFQUEzQixDQUE4QixPQUE5QixFQUF1Q2hDLG1CQUF2Qzs7QUFFQStCO0FBQ0gsS0FORDs7QUFRQSxXQUFPeEMsTUFBUDtBQUNILENBOUtMIiwiZmlsZSI6InNwZWNpYWxzL3NwZWNpYWxzX2J1bGtfZGVsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzcGVjaWFsc19idWxrX2RlbGV0ZS5qcyAyMDE4LTA0LTEwXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTcGVjaWFscyBCdWxrIERlbGV0ZSBNb2R1bGVcbiAqXG4gKiBUaGlzIG1vZHVsZSBoYW5kZWxzIHRoZSBidWxrIGRlbGV0aW9uIGZvciB0aGUgc3BlY2lhbHMuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L3NwZWNpYWxzX2J1bGtfZGVsZXRlXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdzcGVjaWFsc19idWxrX2RlbGV0ZScsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L3NwZWNpYWxzX2J1bGtfZGVsZXRlICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBSZWZlcmVuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdWxrIGRlbGV0ZSBtb2RhbCBvYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJyNtb2RhbF9sYXllcl9jb250YWluZXInKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVsayBkZWxldGUgZm9ybSBvYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRmb3JtID0gJCgnI2J1bGtfZGVsZXRlX2NvbmZpcm1fZm9ybScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVyIGZvciB0aGUgY2xpY2sgZXZlbnQsIHRoYXQncyB0cmlnZ2VyZWQgYnkgdGhlIGRlbGV0ZSBidXR0b24uXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfaGFuZGxlRGVsZXRlQnV0dG9uID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkZm9ybS5maW5kKCcucHJvZHVjdHMtdG8tZGVsZXRlJykuaHRtbCgnJyk7XG4gICAgICAgICAgICAkLmVhY2goJHRoaXMuZmluZCgnLmRlbGV0ZS1zcGVjaWFsOmNoZWNrZWQnKSwgX2FkZFNwZWNpYWxzVG9Nb2RhbCk7XG5cbiAgICAgICAgICAgICRmb3JtLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19IRUFESU5HX0JVTEtfREVMRVRFX1NQRUNJQUxTJywgJ2FkbWluX3NwZWNpYWxzJyksXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IF9nZXRNb2RhbEJ1dHRvbnMoJGZvcm0pLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDQyMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG1vZGFsIGJ1dHRvbnMsIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge29iamVjdH0gQnV0dG9ucyBmcHIgdGhlIGRlbGV0ZSBjb25maXJtYXRpb24gbW9kYWxcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9nZXRNb2RhbEJ1dHRvbnMgPSAoJGZvcm0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjbG9zZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4nLFxuICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdkZWxldGUnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGRzIHRoZSBpbmZvcm1hdGlvbnMgb2YgdGhlIHNlbGVjdGVkIHNwZWNpYWxzIHRvIHRoZSBkZWxldGUgY29uZmlybWF0aW9uIG1vZGFsLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2FkZFNwZWNpYWxzVG9Nb2RhbCA9IChrZXksIGNoZWNrYm94KSA9PiB7XG4gICAgICAgICAgICAkZm9ybS5maW5kKCcucHJvZHVjdHMtdG8tZGVsZXRlJykuYXBwZW5kKCQoJzxsaS8+Jywge1xuICAgICAgICAgICAgICAgICd0ZXh0JzogJChjaGVja2JveCkuZGF0YSgncHJvZHVjdC1uYW1lJylcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgJGZvcm0uZmluZCgnLnByb2R1Y3RzLXRvLWRlbGV0ZScpLmFwcGVuZCgkKCc8aW5wdXQvPicsIHtcbiAgICAgICAgICAgICAgICAnbmFtZSc6ICdkZWxldGVTcGVjaWFsW10nLFxuICAgICAgICAgICAgICAgICd2YWx1ZSc6ICQoY2hlY2tib3gpLmRhdGEoJ3NwZWNpYWwtaWQnKVxuICAgICAgICAgICAgfSkuaGlkZSgpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIGNsaWNrIGV2ZW50LCB0aGF0J3MgdHJpZ2dlcmVkIGJ5IGEgbm9ybWFsIGNoZWNrYm94IGluIHRoZSBzcGVjaWFscyBvdmVydmlldyB0YWJsZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9oYW5kbGVOb3JtYWxDaGVja2JveCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG51bUNoZWNrZWQgPSAkdGhpcy5maW5kKCcuZGVsZXRlLXNwZWNpYWw6Y2hlY2tlZCcpLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IG51bU5vdENoZWNrZWQgPSAkdGhpcy5maW5kKCcuZGVsZXRlLXNwZWNpYWwnKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGlmIChudW1DaGVja2VkID09PSBudW1Ob3RDaGVja2VkICYmIG51bUNoZWNrZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnNlbGVjdC1hbGwtY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnNlbGVjdC1hbGwtY2hlY2tib3gnKS5jbG9zZXN0KCcuc2luZ2xlLWNoZWNrYm94JykuYWRkQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnNlbGVjdC1hbGwtY2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5zZWxlY3QtYWxsLWNoZWNrYm94JykuY2xvc2VzdCgnLnNpbmdsZS1jaGVja2JveCcpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1DaGVja2VkID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ1bGstZGVsZXRlJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ1bGstZGVsZXRlJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXIgZm9yIHRoZSBjbGljayBldmVudCwgdGhhdCdzIHRyaWdnZXJlZCBieSB0aGUgY2hlY2tib3ggaW4gdGhlIGhlYWQgb2YgdGhlIHNwZWNpYWxzIG92ZXJ2aWV3IHRhYmxlLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2hhbmRsZVNlbGVjdEFsbENoZWNrYm94ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWxsQ2hlY2tlZCA9ICR0aGlzLmZpbmQoJy5zZWxlY3QtYWxsLWNoZWNrYm94JykuaXMoXCI6Y2hlY2tlZFwiKTtcblxuICAgICAgICAgICAgaWYgKGFsbENoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuZGVsZXRlLXNwZWNpYWwnKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmRlbGV0ZS1zcGVjaWFsJykucGFyZW50KCcuc2luZ2xlLWNoZWNrYm94JykuYWRkQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLmRlbGV0ZS1zcGVjaWFsJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuZGVsZXRlLXNwZWNpYWwnKS5wYXJlbnQoJy5zaW5nbGUtY2hlY2tib3gnKS5yZW1vdmVDbGFzcygnY2hlY2tlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJHRoaXMuZmluZCgnLnNlbGVjdC1hbGwtY2hlY2tib3gnKS5pcyhcIjpjaGVja2VkXCIpICYmICR0aGlzLmZpbmQoJy5kZWxldGUtc3BlY2lhbDpjaGVja2VkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJy5idWxrLWRlbGV0ZScpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuYnVsay1kZWxldGUnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IChkb25lKSA9PiB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcuc2VsZWN0LWFsbC1jaGVja2JveCcpLm9uKCdjbGljaycsIF9oYW5kbGVTZWxlY3RBbGxDaGVja2JveCk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcuZGVsZXRlLXNwZWNpYWwnKS5vbignY2xpY2snLCBfaGFuZGxlTm9ybWFsQ2hlY2tib3gpO1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ1bGstZGVsZXRlJykub24oJ2NsaWNrJywgX2hhbmRsZURlbGV0ZUJ1dHRvbik7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7Il19
