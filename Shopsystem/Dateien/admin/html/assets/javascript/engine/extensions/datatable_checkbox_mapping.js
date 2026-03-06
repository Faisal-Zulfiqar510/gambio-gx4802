'use strict';

/* --------------------------------------------------------------
 datatable_checkbox_mapping.js 2016-10-18
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## DataTable Checkbox Mapping Extension
 *
 * This extension maps the bulk actions from a datatable dropdown to the selected checkbox carets. Bind this
 * extension into a datatable element which has a first.
 *
 * ### Options
 *
 * **Bulk Action Selector | `data-datatable_checkbox_mapping-bulk-action` | String | Optional**
 *
 * Provide a selector for the bulk action dropdown widget. Default value is '.bulk-action'.
 *
 * **Bulk Selection Checkbox Selector | `data-datatable_checkbox_mapping-bulk-selection` | String | Optional**
 *
 * Provide a selector for the bulk selection checkbox in the table header. Default value is '.bulk-selection'.
 *
 * **Row Selection Checkbox Selector | `data-datatable_checkbox_mapping-row-selection` | String | Optional**
 *
 * Provide a selector for the row selection checkbox in the table body. Default value is 'tbody tr input:checkbox'.
 *
 * **Caret Icon Class | `data-datatable_checkbox_mapping-caret-icon-class` | String | Optional**
 *
 * Provide a FontAwesome icon class for the checkbox caret. Default value is 'fa-caret-down'. Provide only the class
 * name without dots or the "fa" class.
 *
 * @module Admin/Extensions/datatable_checkbox_mapping
 */
gx.extensions.module('datatable_checkbox_mapping', [], function (data) {

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
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {
        bulkAction: '.bulk-action',
        bulkSelection: '.bulk-selection',
        caretIconClass: 'fa-caret-down',
        rowSelection: 'tbody tr input:checkbox'
    };

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Bulk Action Selector
     *
     * @type {jQuery}
     */
    var $bulkAction = $(options.bulkAction);

    /**
     * Bulk Selection Selector
     *
     * @type {jQuery}
     */
    var $bulkSelection = $this.find(options.bulkSelection).last();

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
     * Toggle the dropdown menu under the caret.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _toggleDropdownMenu(event) {
        event.stopPropagation();
        event.preventDefault();

        if ($bulkAction.hasClass('open')) {
            $bulkAction.removeClass('open');
            return;
        }

        var caretPosition = $(event.target).offset();
        var $dropdownMenu = $bulkAction.find('.dropdown-menu');

        // Open the dropdown menu.
        $bulkAction.addClass('open');

        // Reposition the dropdown menu near the clicked caret.
        $dropdownMenu.offset({
            top: caretPosition.top + 16,
            left: caretPosition.left
        });

        // Don't show the long empty dropdown menu box when it is repositioned.
        $dropdownMenu.css({ bottom: 'initial' });

        // Show the dropdown menu under or above the caret, depending on the viewport.
        if (_dropdownIsOutOfView($dropdownMenu)) {
            $dropdownMenu.offset({
                top: caretPosition.top - $dropdownMenu.outerHeight(),
                left: caretPosition.left
            });
        }
    }

    /**
     * Reset the dropdown position to its original state.
     */
    function _resetDropdownPosition() {
        $bulkAction.find('.dropdown-menu').css({
            top: '',
            left: '',
            bottom: ''
        });
    }

    /**
     * Add a caret to the table head checked checkbox.
     */
    function _addCaretToBulkSelection() {
        var $th = $bulkSelection.parents('th');

        if ($th.find('.' + options.caretIconClass).length === 0) {
            $th.append('<i class="fa ' + options.caretIconClass + '"></i>');
        }
    }

    /**
     * Remove the caret from the bulk selection checkbox.
     */
    function _removeCaretFromBulkSelection() {
        $bulkSelection.parents('th').find('.' + options.caretIconClass).remove();
    }

    /**
     * Add a caret to the checked checkbox.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _addCaretToActivatedCheckbox(event) {
        $(event.target).parents('td').append('<i class="fa ' + options.caretIconClass + '"></i>');
    }

    /**
     * Remove the caret from the checkbox if the checkbox is unchecked.
     *
     * @param {jQuery.Event} event Triggered event.
     */
    function _removeCaretFromCheckbox(event) {
        $(event.target).parents('tr').find('.' + options.caretIconClass).remove();
    }

    /**
     * Start listening for click events for the caret symbol.
     *
     * When the caret symbol gets clicked, show the dropdown menu.
     */
    function _listenForCaretClickEvents() {
        $this.find('tr .' + options.caretIconClass).off('click').on('click', _toggleDropdownMenu);
    }

    /**
     * Set the bulk selection state.
     *
     * @param {Boolean} isChecked Whether the checkbox will be checked or not.
     */
    function _setBulkSelectionState(isChecked) {
        $bulkSelection.prop('checked', isChecked);

        if (isChecked) {
            $bulkSelection.parents('.single-checkbox').addClass('checked');
            _addCaretToBulkSelection();
            _listenForCaretClickEvents();
        } else {
            $bulkSelection.parents('.single-checkbox').removeClass('checked');
            _removeCaretFromBulkSelection();
        }
    }

    /**
     * Checks if the provided dropdown is outside of the viewport (in height).
     *
     * @param {jQuery} $dropdownMenu Dropdown menu selector.
     *
     * @return {Boolean}
     */
    function _dropdownIsOutOfView($dropdownMenu) {
        var dropDownMenuOffset = $dropdownMenu.offset().top + $dropdownMenu.outerHeight() + 50;
        var windowHeight = window.innerHeight + $(window).scrollTop();
        return dropDownMenuOffset > windowHeight;
    }

    /**
     * On Single Checkbox Ready Event
     *
     * Bind the checkbox mapping functionality on the table. We need to wait for the "single_checkbox:ready",
     * that will be triggered with every table re-draw. Whenever a row checkbox is clicked the bulk-action
     * caret icon will be added next to it.
     */
    function _onSingleCheckboxReady() {
        // Find all checkboxes table body checkboxes.
        var $tableBodyCheckboxes = $this.find(options.rowSelection);

        // Table data checkbox event handling.
        $tableBodyCheckboxes.on('change', function (event) {
            // Close any open dropdown menus.
            $bulkAction.removeClass('open');

            if ($(event.target).prop('checked')) {
                _addCaretToActivatedCheckbox(event);
                _listenForCaretClickEvents();
            } else {
                _removeCaretFromCheckbox(event);
            }

            // Activate the table head checkbox if all checkboxes are activated. Otherwise deactivate it.
            _setBulkSelectionState($tableBodyCheckboxes.not(':checked').length === 0);
        });
    }

    /**
     * Add or remove the caret from the table head checkbox.
     *
     * @param {jQuery.Event} event
     */
    function _onBulkSelectionChange(event) {
        if ($bulkSelection.parents('.single-checkbox').length === 0) {
            return; // Do not proceed with the function if the thead single-checkbox is not ready yet.
        }

        if ($bulkSelection.prop('checked')) {
            _addCaretToBulkSelection();
            _listenForCaretClickEvents();
        } else {
            _removeCaretFromBulkSelection(event);
        }
    }

    /**
     *  Event handling for the original dropdown button click.
     */
    function _onBulkActionDropdownToggleClick() {
        _resetDropdownPosition();
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('single_checkbox:ready', _onSingleCheckboxReady);
        $bulkSelection.on('change', _onBulkSelectionChange);
        $bulkAction.find('.dropdown-toggle').on('click', _onBulkActionDropdownToggleClick);
        done();
    };
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGF0YWJsZV9jaGVja2JveF9tYXBwaW5nLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsImJ1bGtBY3Rpb24iLCJidWxrU2VsZWN0aW9uIiwiY2FyZXRJY29uQ2xhc3MiLCJyb3dTZWxlY3Rpb24iLCJvcHRpb25zIiwiZXh0ZW5kIiwiJGJ1bGtBY3Rpb24iLCIkYnVsa1NlbGVjdGlvbiIsImZpbmQiLCJsYXN0IiwiX3RvZ2dsZURyb3Bkb3duTWVudSIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJoYXNDbGFzcyIsInJlbW92ZUNsYXNzIiwiY2FyZXRQb3NpdGlvbiIsInRhcmdldCIsIm9mZnNldCIsIiRkcm9wZG93bk1lbnUiLCJhZGRDbGFzcyIsInRvcCIsImxlZnQiLCJjc3MiLCJib3R0b20iLCJfZHJvcGRvd25Jc091dE9mVmlldyIsIm91dGVySGVpZ2h0IiwiX3Jlc2V0RHJvcGRvd25Qb3NpdGlvbiIsIl9hZGRDYXJldFRvQnVsa1NlbGVjdGlvbiIsIiR0aCIsInBhcmVudHMiLCJsZW5ndGgiLCJhcHBlbmQiLCJfcmVtb3ZlQ2FyZXRGcm9tQnVsa1NlbGVjdGlvbiIsInJlbW92ZSIsIl9hZGRDYXJldFRvQWN0aXZhdGVkQ2hlY2tib3giLCJfcmVtb3ZlQ2FyZXRGcm9tQ2hlY2tib3giLCJfbGlzdGVuRm9yQ2FyZXRDbGlja0V2ZW50cyIsIm9mZiIsIm9uIiwiX3NldEJ1bGtTZWxlY3Rpb25TdGF0ZSIsImlzQ2hlY2tlZCIsInByb3AiLCJkcm9wRG93bk1lbnVPZmZzZXQiLCJ3aW5kb3dIZWlnaHQiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsInNjcm9sbFRvcCIsIl9vblNpbmdsZUNoZWNrYm94UmVhZHkiLCIkdGFibGVCb2R5Q2hlY2tib3hlcyIsIm5vdCIsIl9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UiLCJfb25CdWxrQWN0aW9uRHJvcGRvd25Ub2dnbGVDbGljayIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksNEJBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFdBQVc7QUFDYkMsb0JBQVksY0FEQztBQUViQyx1QkFBZSxpQkFGRjtBQUdiQyx3QkFBZ0IsZUFISDtBQUliQyxzQkFBYztBQUpELEtBQWpCOztBQU9BOzs7OztBQUtBLFFBQU1DLFVBQVVOLEVBQUVPLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQk4sUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1VLGNBQWNSLEVBQUVNLFFBQVFKLFVBQVYsQ0FBcEI7O0FBRUE7Ozs7O0FBS0EsUUFBTU8saUJBQWlCVixNQUFNVyxJQUFOLENBQVdKLFFBQVFILGFBQW5CLEVBQWtDUSxJQUFsQyxFQUF2Qjs7QUFFQTs7Ozs7QUFLQSxRQUFNZCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLGFBQVNlLG1CQUFULENBQTZCQyxLQUE3QixFQUFvQztBQUNoQ0EsY0FBTUMsZUFBTjtBQUNBRCxjQUFNRSxjQUFOOztBQUVBLFlBQUlQLFlBQVlRLFFBQVosQ0FBcUIsTUFBckIsQ0FBSixFQUFrQztBQUM5QlIsd0JBQVlTLFdBQVosQ0FBd0IsTUFBeEI7QUFDQTtBQUNIOztBQUVELFlBQU1DLGdCQUFnQmxCLEVBQUVhLE1BQU1NLE1BQVIsRUFBZ0JDLE1BQWhCLEVBQXRCO0FBQ0EsWUFBTUMsZ0JBQWdCYixZQUFZRSxJQUFaLENBQWlCLGdCQUFqQixDQUF0Qjs7QUFFQTtBQUNBRixvQkFBWWMsUUFBWixDQUFxQixNQUFyQjs7QUFFQTtBQUNBRCxzQkFBY0QsTUFBZCxDQUFxQjtBQUNqQkcsaUJBQUtMLGNBQWNLLEdBQWQsR0FBb0IsRUFEUjtBQUVqQkMsa0JBQU1OLGNBQWNNO0FBRkgsU0FBckI7O0FBS0E7QUFDQUgsc0JBQWNJLEdBQWQsQ0FBa0IsRUFBQ0MsUUFBUSxTQUFULEVBQWxCOztBQUVBO0FBQ0EsWUFBSUMscUJBQXFCTixhQUFyQixDQUFKLEVBQXlDO0FBQ3JDQSwwQkFBY0QsTUFBZCxDQUFxQjtBQUNqQkcscUJBQUtMLGNBQWNLLEdBQWQsR0FBb0JGLGNBQWNPLFdBQWQsRUFEUjtBQUVqQkosc0JBQU1OLGNBQWNNO0FBRkgsYUFBckI7QUFJSDtBQUNKOztBQUVEOzs7QUFHQSxhQUFTSyxzQkFBVCxHQUFrQztBQUM5QnJCLG9CQUFZRSxJQUFaLENBQWlCLGdCQUFqQixFQUFtQ2UsR0FBbkMsQ0FBdUM7QUFDbkNGLGlCQUFLLEVBRDhCO0FBRW5DQyxrQkFBTSxFQUY2QjtBQUduQ0Usb0JBQVE7QUFIMkIsU0FBdkM7QUFLSDs7QUFFRDs7O0FBR0EsYUFBU0ksd0JBQVQsR0FBb0M7QUFDaEMsWUFBTUMsTUFBTXRCLGVBQWV1QixPQUFmLENBQXVCLElBQXZCLENBQVo7O0FBRUEsWUFBSUQsSUFBSXJCLElBQUosQ0FBUyxNQUFNSixRQUFRRixjQUF2QixFQUF1QzZCLE1BQXZDLEtBQWtELENBQXRELEVBQXlEO0FBQ3JERixnQkFBSUcsTUFBSixtQkFBMkI1QixRQUFRRixjQUFuQztBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBLGFBQVMrQiw2QkFBVCxHQUF5QztBQUNyQzFCLHVCQUFldUIsT0FBZixDQUF1QixJQUF2QixFQUE2QnRCLElBQTdCLENBQWtDLE1BQU1KLFFBQVFGLGNBQWhELEVBQWdFZ0MsTUFBaEU7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTQyw0QkFBVCxDQUFzQ3hCLEtBQXRDLEVBQTZDO0FBQ3pDYixVQUFFYSxNQUFNTSxNQUFSLEVBQWdCYSxPQUFoQixDQUF3QixJQUF4QixFQUE4QkUsTUFBOUIsbUJBQXFENUIsUUFBUUYsY0FBN0Q7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTa0Msd0JBQVQsQ0FBa0N6QixLQUFsQyxFQUF5QztBQUNyQ2IsVUFBRWEsTUFBTU0sTUFBUixFQUFnQmEsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEJ0QixJQUE5QixDQUFtQyxNQUFNSixRQUFRRixjQUFqRCxFQUFpRWdDLE1BQWpFO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU0csMEJBQVQsR0FBc0M7QUFDbEN4QyxjQUFNVyxJQUFOLENBQVcsU0FBU0osUUFBUUYsY0FBNUIsRUFBNENvQyxHQUE1QyxDQUFnRCxPQUFoRCxFQUF5REMsRUFBekQsQ0FBNEQsT0FBNUQsRUFBcUU3QixtQkFBckU7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTOEIsc0JBQVQsQ0FBZ0NDLFNBQWhDLEVBQTJDO0FBQ3ZDbEMsdUJBQWVtQyxJQUFmLENBQW9CLFNBQXBCLEVBQStCRCxTQUEvQjs7QUFFQSxZQUFJQSxTQUFKLEVBQWU7QUFDWGxDLDJCQUFldUIsT0FBZixDQUF1QixrQkFBdkIsRUFBMkNWLFFBQTNDLENBQW9ELFNBQXBEO0FBQ0FRO0FBQ0FTO0FBQ0gsU0FKRCxNQUlPO0FBQ0g5QiwyQkFBZXVCLE9BQWYsQ0FBdUIsa0JBQXZCLEVBQTJDZixXQUEzQyxDQUF1RCxTQUF2RDtBQUNBa0I7QUFDSDtBQUNKOztBQUVEOzs7Ozs7O0FBT0EsYUFBU1Isb0JBQVQsQ0FBOEJOLGFBQTlCLEVBQTZDO0FBQ3pDLFlBQU13QixxQkFBcUJ4QixjQUFjRCxNQUFkLEdBQXVCRyxHQUF2QixHQUE2QkYsY0FBY08sV0FBZCxFQUE3QixHQUEyRCxFQUF0RjtBQUNBLFlBQU1rQixlQUFlQyxPQUFPQyxXQUFQLEdBQXFCaEQsRUFBRStDLE1BQUYsRUFBVUUsU0FBVixFQUExQztBQUNBLGVBQU9KLHFCQUFxQkMsWUFBNUI7QUFDSDs7QUFFRDs7Ozs7OztBQU9BLGFBQVNJLHNCQUFULEdBQWtDO0FBQzlCO0FBQ0EsWUFBTUMsdUJBQXVCcEQsTUFBTVcsSUFBTixDQUFXSixRQUFRRCxZQUFuQixDQUE3Qjs7QUFFQTtBQUNBOEMsNkJBQXFCVixFQUFyQixDQUF3QixRQUF4QixFQUFrQyxpQkFBUztBQUN2QztBQUNBakMsd0JBQVlTLFdBQVosQ0FBd0IsTUFBeEI7O0FBRUEsZ0JBQUlqQixFQUFFYSxNQUFNTSxNQUFSLEVBQWdCeUIsSUFBaEIsQ0FBcUIsU0FBckIsQ0FBSixFQUFxQztBQUNqQ1AsNkNBQTZCeEIsS0FBN0I7QUFDQTBCO0FBQ0gsYUFIRCxNQUdPO0FBQ0hELHlDQUF5QnpCLEtBQXpCO0FBQ0g7O0FBRUQ7QUFDQTZCLG1DQUF1QlMscUJBQXFCQyxHQUFyQixDQUF5QixVQUF6QixFQUFxQ25CLE1BQXJDLEtBQWdELENBQXZFO0FBQ0gsU0FiRDtBQWNIOztBQUVEOzs7OztBQUtBLGFBQVNvQixzQkFBVCxDQUFnQ3hDLEtBQWhDLEVBQXVDO0FBQ25DLFlBQUlKLGVBQWV1QixPQUFmLENBQXVCLGtCQUF2QixFQUEyQ0MsTUFBM0MsS0FBc0QsQ0FBMUQsRUFBNkQ7QUFDekQsbUJBRHlELENBQ2pEO0FBQ1g7O0FBRUQsWUFBSXhCLGVBQWVtQyxJQUFmLENBQW9CLFNBQXBCLENBQUosRUFBb0M7QUFDaENkO0FBQ0FTO0FBQ0gsU0FIRCxNQUdPO0FBQ0hKLDBDQUE4QnRCLEtBQTlCO0FBQ0g7QUFDSjs7QUFFRDs7O0FBR0EsYUFBU3lDLGdDQUFULEdBQTRDO0FBQ3hDekI7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUFoQyxXQUFPMEQsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJ6RCxjQUFNMEMsRUFBTixDQUFTLHVCQUFULEVBQWtDUyxzQkFBbEM7QUFDQXpDLHVCQUFlZ0MsRUFBZixDQUFrQixRQUFsQixFQUE0Qlksc0JBQTVCO0FBQ0E3QyxvQkFBWUUsSUFBWixDQUFpQixrQkFBakIsRUFBcUMrQixFQUFyQyxDQUF3QyxPQUF4QyxFQUFpRGEsZ0NBQWpEO0FBQ0FFO0FBQ0gsS0FMRDtBQU1BLFdBQU8zRCxNQUFQO0FBQ0gsQ0E3UEwiLCJmaWxlIjoiZGF0YXRhYmxlX2NoZWNrYm94X21hcHBpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGF0YWJsZV9jaGVja2JveF9tYXBwaW5nLmpzIDIwMTYtMTAtMThcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIERhdGFUYWJsZSBDaGVja2JveCBNYXBwaW5nIEV4dGVuc2lvblxuICpcbiAqIFRoaXMgZXh0ZW5zaW9uIG1hcHMgdGhlIGJ1bGsgYWN0aW9ucyBmcm9tIGEgZGF0YXRhYmxlIGRyb3Bkb3duIHRvIHRoZSBzZWxlY3RlZCBjaGVja2JveCBjYXJldHMuIEJpbmQgdGhpc1xuICogZXh0ZW5zaW9uIGludG8gYSBkYXRhdGFibGUgZWxlbWVudCB3aGljaCBoYXMgYSBmaXJzdC5cbiAqXG4gKiAjIyMgT3B0aW9uc1xuICpcbiAqICoqQnVsayBBY3Rpb24gU2VsZWN0b3IgfCBgZGF0YS1kYXRhdGFibGVfY2hlY2tib3hfbWFwcGluZy1idWxrLWFjdGlvbmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBhIHNlbGVjdG9yIGZvciB0aGUgYnVsayBhY3Rpb24gZHJvcGRvd24gd2lkZ2V0LiBEZWZhdWx0IHZhbHVlIGlzICcuYnVsay1hY3Rpb24nLlxuICpcbiAqICoqQnVsayBTZWxlY3Rpb24gQ2hlY2tib3ggU2VsZWN0b3IgfCBgZGF0YS1kYXRhdGFibGVfY2hlY2tib3hfbWFwcGluZy1idWxrLXNlbGVjdGlvbmAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBhIHNlbGVjdG9yIGZvciB0aGUgYnVsayBzZWxlY3Rpb24gY2hlY2tib3ggaW4gdGhlIHRhYmxlIGhlYWRlci4gRGVmYXVsdCB2YWx1ZSBpcyAnLmJ1bGstc2VsZWN0aW9uJy5cbiAqXG4gKiAqKlJvdyBTZWxlY3Rpb24gQ2hlY2tib3ggU2VsZWN0b3IgfCBgZGF0YS1kYXRhdGFibGVfY2hlY2tib3hfbWFwcGluZy1yb3ctc2VsZWN0aW9uYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIGEgc2VsZWN0b3IgZm9yIHRoZSByb3cgc2VsZWN0aW9uIGNoZWNrYm94IGluIHRoZSB0YWJsZSBib2R5LiBEZWZhdWx0IHZhbHVlIGlzICd0Ym9keSB0ciBpbnB1dDpjaGVja2JveCcuXG4gKlxuICogKipDYXJldCBJY29uIENsYXNzIHwgYGRhdGEtZGF0YXRhYmxlX2NoZWNrYm94X21hcHBpbmctY2FyZXQtaWNvbi1jbGFzc2AgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSBhIEZvbnRBd2Vzb21lIGljb24gY2xhc3MgZm9yIHRoZSBjaGVja2JveCBjYXJldC4gRGVmYXVsdCB2YWx1ZSBpcyAnZmEtY2FyZXQtZG93bicuIFByb3ZpZGUgb25seSB0aGUgY2xhc3NcbiAqIG5hbWUgd2l0aG91dCBkb3RzIG9yIHRoZSBcImZhXCIgY2xhc3MuXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL2RhdGF0YWJsZV9jaGVja2JveF9tYXBwaW5nXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICdkYXRhdGFibGVfY2hlY2tib3hfbWFwcGluZycsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgYnVsa0FjdGlvbjogJy5idWxrLWFjdGlvbicsXG4gICAgICAgICAgICBidWxrU2VsZWN0aW9uOiAnLmJ1bGstc2VsZWN0aW9uJyxcbiAgICAgICAgICAgIGNhcmV0SWNvbkNsYXNzOiAnZmEtY2FyZXQtZG93bicsXG4gICAgICAgICAgICByb3dTZWxlY3Rpb246ICd0Ym9keSB0ciBpbnB1dDpjaGVja2JveCdcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJ1bGsgQWN0aW9uIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkYnVsa0FjdGlvbiA9ICQob3B0aW9ucy5idWxrQWN0aW9uKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQnVsayBTZWxlY3Rpb24gU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRidWxrU2VsZWN0aW9uID0gJHRoaXMuZmluZChvcHRpb25zLmJ1bGtTZWxlY3Rpb24pLmxhc3QoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb2dnbGUgdGhlIGRyb3Bkb3duIG1lbnUgdW5kZXIgdGhlIGNhcmV0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3RvZ2dsZURyb3Bkb3duTWVudShldmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoJGJ1bGtBY3Rpb24uaGFzQ2xhc3MoJ29wZW4nKSkge1xuICAgICAgICAgICAgICAgICRidWxrQWN0aW9uLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjYXJldFBvc2l0aW9uID0gJChldmVudC50YXJnZXQpLm9mZnNldCgpO1xuICAgICAgICAgICAgY29uc3QgJGRyb3Bkb3duTWVudSA9ICRidWxrQWN0aW9uLmZpbmQoJy5kcm9wZG93bi1tZW51Jyk7XG5cbiAgICAgICAgICAgIC8vIE9wZW4gdGhlIGRyb3Bkb3duIG1lbnUuXG4gICAgICAgICAgICAkYnVsa0FjdGlvbi5hZGRDbGFzcygnb3BlbicpO1xuXG4gICAgICAgICAgICAvLyBSZXBvc2l0aW9uIHRoZSBkcm9wZG93biBtZW51IG5lYXIgdGhlIGNsaWNrZWQgY2FyZXQuXG4gICAgICAgICAgICAkZHJvcGRvd25NZW51Lm9mZnNldCh7XG4gICAgICAgICAgICAgICAgdG9wOiBjYXJldFBvc2l0aW9uLnRvcCArIDE2LFxuICAgICAgICAgICAgICAgIGxlZnQ6IGNhcmV0UG9zaXRpb24ubGVmdFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIERvbid0IHNob3cgdGhlIGxvbmcgZW1wdHkgZHJvcGRvd24gbWVudSBib3ggd2hlbiBpdCBpcyByZXBvc2l0aW9uZWQuXG4gICAgICAgICAgICAkZHJvcGRvd25NZW51LmNzcyh7Ym90dG9tOiAnaW5pdGlhbCd9KTtcblxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgZHJvcGRvd24gbWVudSB1bmRlciBvciBhYm92ZSB0aGUgY2FyZXQsIGRlcGVuZGluZyBvbiB0aGUgdmlld3BvcnQuXG4gICAgICAgICAgICBpZiAoX2Ryb3Bkb3duSXNPdXRPZlZpZXcoJGRyb3Bkb3duTWVudSkpIHtcbiAgICAgICAgICAgICAgICAkZHJvcGRvd25NZW51Lm9mZnNldCh7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogY2FyZXRQb3NpdGlvbi50b3AgLSAkZHJvcGRvd25NZW51Lm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGNhcmV0UG9zaXRpb24ubGVmdFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0IHRoZSBkcm9wZG93biBwb3NpdGlvbiB0byBpdHMgb3JpZ2luYWwgc3RhdGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfcmVzZXREcm9wZG93blBvc2l0aW9uKCkge1xuICAgICAgICAgICAgJGJ1bGtBY3Rpb24uZmluZCgnLmRyb3Bkb3duLW1lbnUnKS5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogJycsXG4gICAgICAgICAgICAgICAgbGVmdDogJycsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGEgY2FyZXQgdG8gdGhlIHRhYmxlIGhlYWQgY2hlY2tlZCBjaGVja2JveC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9hZGRDYXJldFRvQnVsa1NlbGVjdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0aCA9ICRidWxrU2VsZWN0aW9uLnBhcmVudHMoJ3RoJyk7XG5cbiAgICAgICAgICAgIGlmICgkdGguZmluZCgnLicgKyBvcHRpb25zLmNhcmV0SWNvbkNsYXNzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkdGguYXBwZW5kKGA8aSBjbGFzcz1cImZhICR7b3B0aW9ucy5jYXJldEljb25DbGFzc31cIj48L2k+YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHRoZSBjYXJldCBmcm9tIHRoZSBidWxrIHNlbGVjdGlvbiBjaGVja2JveC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9yZW1vdmVDYXJldEZyb21CdWxrU2VsZWN0aW9uKCkge1xuICAgICAgICAgICAgJGJ1bGtTZWxlY3Rpb24ucGFyZW50cygndGgnKS5maW5kKCcuJyArIG9wdGlvbnMuY2FyZXRJY29uQ2xhc3MpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBhIGNhcmV0IHRvIHRoZSBjaGVja2VkIGNoZWNrYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FkZENhcmV0VG9BY3RpdmF0ZWRDaGVja2JveChldmVudCkge1xuICAgICAgICAgICAgJChldmVudC50YXJnZXQpLnBhcmVudHMoJ3RkJykuYXBwZW5kKGA8aSBjbGFzcz1cImZhICR7b3B0aW9ucy5jYXJldEljb25DbGFzc31cIj48L2k+YCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHRoZSBjYXJldCBmcm9tIHRoZSBjaGVja2JveCBpZiB0aGUgY2hlY2tib3ggaXMgdW5jaGVja2VkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlcmVkIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3JlbW92ZUNhcmV0RnJvbUNoZWNrYm94KGV2ZW50KSB7XG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkucGFyZW50cygndHInKS5maW5kKCcuJyArIG9wdGlvbnMuY2FyZXRJY29uQ2xhc3MpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFN0YXJ0IGxpc3RlbmluZyBmb3IgY2xpY2sgZXZlbnRzIGZvciB0aGUgY2FyZXQgc3ltYm9sLlxuICAgICAgICAgKlxuICAgICAgICAgKiBXaGVuIHRoZSBjYXJldCBzeW1ib2wgZ2V0cyBjbGlja2VkLCBzaG93IHRoZSBkcm9wZG93biBtZW51LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2xpc3RlbkZvckNhcmV0Q2xpY2tFdmVudHMoKSB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0ciAuJyArIG9wdGlvbnMuY2FyZXRJY29uQ2xhc3MpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBfdG9nZ2xlRHJvcGRvd25NZW51KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXQgdGhlIGJ1bGsgc2VsZWN0aW9uIHN0YXRlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzQ2hlY2tlZCBXaGV0aGVyIHRoZSBjaGVja2JveCB3aWxsIGJlIGNoZWNrZWQgb3Igbm90LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3NldEJ1bGtTZWxlY3Rpb25TdGF0ZShpc0NoZWNrZWQpIHtcbiAgICAgICAgICAgICRidWxrU2VsZWN0aW9uLnByb3AoJ2NoZWNrZWQnLCBpc0NoZWNrZWQpO1xuXG4gICAgICAgICAgICBpZiAoaXNDaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgJGJ1bGtTZWxlY3Rpb24ucGFyZW50cygnLnNpbmdsZS1jaGVja2JveCcpLmFkZENsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgX2FkZENhcmV0VG9CdWxrU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgX2xpc3RlbkZvckNhcmV0Q2xpY2tFdmVudHMoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGJ1bGtTZWxlY3Rpb24ucGFyZW50cygnLnNpbmdsZS1jaGVja2JveCcpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgX3JlbW92ZUNhcmV0RnJvbUJ1bGtTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGRyb3Bkb3duIGlzIG91dHNpZGUgb2YgdGhlIHZpZXdwb3J0IChpbiBoZWlnaHQpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGRyb3Bkb3duTWVudSBEcm9wZG93biBtZW51IHNlbGVjdG9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2Ryb3Bkb3duSXNPdXRPZlZpZXcoJGRyb3Bkb3duTWVudSkge1xuICAgICAgICAgICAgY29uc3QgZHJvcERvd25NZW51T2Zmc2V0ID0gJGRyb3Bkb3duTWVudS5vZmZzZXQoKS50b3AgKyAkZHJvcGRvd25NZW51Lm91dGVySGVpZ2h0KCkgKyA1MDtcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCArICQod2luZG93KS5zY3JvbGxUb3AoKTtcbiAgICAgICAgICAgIHJldHVybiBkcm9wRG93bk1lbnVPZmZzZXQgPiB3aW5kb3dIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gU2luZ2xlIENoZWNrYm94IFJlYWR5IEV2ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEJpbmQgdGhlIGNoZWNrYm94IG1hcHBpbmcgZnVuY3Rpb25hbGl0eSBvbiB0aGUgdGFibGUuIFdlIG5lZWQgdG8gd2FpdCBmb3IgdGhlIFwic2luZ2xlX2NoZWNrYm94OnJlYWR5XCIsXG4gICAgICAgICAqIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCBldmVyeSB0YWJsZSByZS1kcmF3LiBXaGVuZXZlciBhIHJvdyBjaGVja2JveCBpcyBjbGlja2VkIHRoZSBidWxrLWFjdGlvblxuICAgICAgICAgKiBjYXJldCBpY29uIHdpbGwgYmUgYWRkZWQgbmV4dCB0byBpdC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblNpbmdsZUNoZWNrYm94UmVhZHkoKSB7XG4gICAgICAgICAgICAvLyBGaW5kIGFsbCBjaGVja2JveGVzIHRhYmxlIGJvZHkgY2hlY2tib3hlcy5cbiAgICAgICAgICAgIGNvbnN0ICR0YWJsZUJvZHlDaGVja2JveGVzID0gJHRoaXMuZmluZChvcHRpb25zLnJvd1NlbGVjdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFRhYmxlIGRhdGEgY2hlY2tib3ggZXZlbnQgaGFuZGxpbmcuXG4gICAgICAgICAgICAkdGFibGVCb2R5Q2hlY2tib3hlcy5vbignY2hhbmdlJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIENsb3NlIGFueSBvcGVuIGRyb3Bkb3duIG1lbnVzLlxuICAgICAgICAgICAgICAgICRidWxrQWN0aW9uLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJChldmVudC50YXJnZXQpLnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICBfYWRkQ2FyZXRUb0FjdGl2YXRlZENoZWNrYm94KGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgX2xpc3RlbkZvckNhcmV0Q2xpY2tFdmVudHMoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfcmVtb3ZlQ2FyZXRGcm9tQ2hlY2tib3goZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFjdGl2YXRlIHRoZSB0YWJsZSBoZWFkIGNoZWNrYm94IGlmIGFsbCBjaGVja2JveGVzIGFyZSBhY3RpdmF0ZWQuIE90aGVyd2lzZSBkZWFjdGl2YXRlIGl0LlxuICAgICAgICAgICAgICAgIF9zZXRCdWxrU2VsZWN0aW9uU3RhdGUoJHRhYmxlQm9keUNoZWNrYm94ZXMubm90KCc6Y2hlY2tlZCcpLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgb3IgcmVtb3ZlIHRoZSBjYXJldCBmcm9tIHRoZSB0YWJsZSBoZWFkIGNoZWNrYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkYnVsa1NlbGVjdGlvbi5wYXJlbnRzKCcuc2luZ2xlLWNoZWNrYm94JykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBEbyBub3QgcHJvY2VlZCB3aXRoIHRoZSBmdW5jdGlvbiBpZiB0aGUgdGhlYWQgc2luZ2xlLWNoZWNrYm94IGlzIG5vdCByZWFkeSB5ZXQuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkYnVsa1NlbGVjdGlvbi5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICBfYWRkQ2FyZXRUb0J1bGtTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBfbGlzdGVuRm9yQ2FyZXRDbGlja0V2ZW50cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfcmVtb3ZlQ2FyZXRGcm9tQnVsa1NlbGVjdGlvbihldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogIEV2ZW50IGhhbmRsaW5nIGZvciB0aGUgb3JpZ2luYWwgZHJvcGRvd24gYnV0dG9uIGNsaWNrLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uQnVsa0FjdGlvbkRyb3Bkb3duVG9nZ2xlQ2xpY2soKSB7XG4gICAgICAgICAgICBfcmVzZXREcm9wZG93blBvc2l0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJHRoaXMub24oJ3NpbmdsZV9jaGVja2JveDpyZWFkeScsIF9vblNpbmdsZUNoZWNrYm94UmVhZHkpO1xuICAgICAgICAgICAgJGJ1bGtTZWxlY3Rpb24ub24oJ2NoYW5nZScsIF9vbkJ1bGtTZWxlY3Rpb25DaGFuZ2UpO1xuICAgICAgICAgICAgJGJ1bGtBY3Rpb24uZmluZCgnLmRyb3Bkb3duLXRvZ2dsZScpLm9uKCdjbGljaycsIF9vbkJ1bGtBY3Rpb25Ecm9wZG93blRvZ2dsZUNsaWNrKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
