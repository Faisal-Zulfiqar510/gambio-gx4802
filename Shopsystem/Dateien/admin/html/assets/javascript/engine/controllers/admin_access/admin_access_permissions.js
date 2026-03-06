'use strict';

/* --------------------------------------------------------------
 admin_access_permissions.js 2018-02-05
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'admin_access_permissions',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
['modal'],

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

    // ------------------------------------------------------------------------
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    /**
     * Opens a modal with an error message for an unexpected error.
     */
    function _setAllPermissionGrantingSwitcherValues() {
        var $readingAll = $('input.all-permission-checkbox[data-permission-type=reading]');
        var $writingAll = $('input.all-permission-checkbox[data-permission-type=writing]');
        var $deletingAll = $('input.all-permission-checkbox[data-permission-type=deleting]');
        if ($readingAll !== undefined) {
            $readingAll.switcher('checked', $('input.permission-checkbox[data-permission-type=reading]').length === $('input.permission-checkbox[data-permission-type=reading]:checked').length);
        }
        if ($writingAll !== undefined) {
            $writingAll.switcher('checked', $('input.permission-checkbox[data-permission-type=writing]').length === $('input.permission-checkbox[data-permission-type=writing]:checked').length);
        }
        if ($deletingAll !== undefined) {
            $deletingAll.switcher('checked', $('input.permission-checkbox[data-permission-type=deleting]').length === $('input.permission-checkbox[data-permission-type=deleting]:checked').length);
        }
    }

    // ------------------------------------------------------------------------
    // EVENT HANDLER
    // ------------------------------------------------------------------------

    /**
     * Click handler for the permission granting switchers.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _updatePermissionGranting(event) {
        // Set checkbox for parent group or child groups for special conditions
        if ($(this).data('parent-id') > 0 && $(this).is(':checked')) {
            $('input.permission-checkbox[data-group-id=' + $(this).data('parent-id') + '][data-permission-type=' + $(this).data('permission-type') + ']').switcher('checked', true);
        }
        if ($(this).data('group-id') > 0 && $(this).is(':checked') === false) {
            $('input.permission-checkbox[data-parent-id=' + $(this).data('group-id') + '][data-permission-type=' + $(this).data('permission-type') + ']').switcher('checked', false);
        }

        _setAllPermissionGrantingSwitcherValues();
    }

    /**
     * Click handler for the all permission granting switchers.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _updateAllPermissionGranting(event) {
        if ($(this).is(':checked')) {
            $('input.permission-checkbox[data-permission-type=' + $(this).data('permission-type') + ']:not(:checked)').switcher('checked', true);
        } else {
            $('input.permission-checkbox[data-permission-type=' + $(this).data('permission-type') + ']:checked').switcher('checked', false);
        }
    }

    /**
     * Click handler for the group collapse handler.
     *
     * @param {object} event jQuery event object contains information of the event.
     */
    function _collapsePermissionSubGroups(event) {
        var groupId = $(this).data('groupId');
        var $icon = $(this).find('span');

        if ($('li[data-parent-group-id=' + groupId + ']').length) {
            if ($icon.hasClass('fa-minus-square-o')) {
                $('li[data-parent-group-id=' + groupId + ']').hide();
                $icon.removeClass('fa-minus-square-o');
                $icon.addClass('fa-plus-square-o');
            } else {
                $('li[data-parent-group-id=' + groupId + ']').show();
                $icon.addClass('fa-minus-square-o');
                $icon.removeClass('fa-plus-square-o');
            }
            $('li.list-element').css('background-color', '#FFFFFF');
            $('li.list-element:visible:even').css('background-color', '#F9F9F9');
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    module.init = function (done) {
        // initialization logic
        $('input.permission-checkbox').on('change', _updatePermissionGranting);
        $('input.all-permission-checkbox').on('change', _updateAllPermissionGranting);
        $('span.list-element-collapse-handler').on('click', _collapsePermissionSubGroups);
        _setAllPermissionGrantingSwitcherValues();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluX2FjY2Vzcy9hZG1pbl9hY2Nlc3NfcGVybWlzc2lvbnMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfc2V0QWxsUGVybWlzc2lvbkdyYW50aW5nU3dpdGNoZXJWYWx1ZXMiLCIkcmVhZGluZ0FsbCIsIiR3cml0aW5nQWxsIiwiJGRlbGV0aW5nQWxsIiwidW5kZWZpbmVkIiwic3dpdGNoZXIiLCJsZW5ndGgiLCJfdXBkYXRlUGVybWlzc2lvbkdyYW50aW5nIiwiZXZlbnQiLCJpcyIsIl91cGRhdGVBbGxQZXJtaXNzaW9uR3JhbnRpbmciLCJfY29sbGFwc2VQZXJtaXNzaW9uU3ViR3JvdXBzIiwiZ3JvdXBJZCIsIiRpY29uIiwiZmluZCIsImhhc0NsYXNzIiwiaGlkZSIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJzaG93IiwiY3NzIiwiaW5pdCIsIm9uIiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxHQUFHQyxXQUFILENBQWVDLE1BQWY7QUFDSTtBQUNBO0FBQ0E7QUFDQSwwQkFKSjs7QUFNSTtBQUNBO0FBQ0E7QUFDQSxDQUNJLE9BREosQ0FUSjs7QUFhSTtBQUNBO0FBQ0E7QUFDQSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLFFBQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1ELFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBLGFBQVNPLHVDQUFULEdBQW1EO0FBQy9D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QkFBTUssUUFBTixDQUFlLGtCQUFmO0FBQ0gsYUFKRCxNQUlPO0FBQ0h0QixrQkFBRSw2QkFBNkJnQixPQUE3QixHQUF1QyxHQUF6QyxFQUE4Q08sSUFBOUM7QUFDQU4sc0JBQU1LLFFBQU4sQ0FBZSxtQkFBZjtBQUNBTCxzQkFBTUksV0FBTixDQUFrQixrQkFBbEI7QUFDSDtBQUNEckIsY0FBRSxpQkFBRixFQUFxQndCLEdBQXJCLENBQXlCLGtCQUF6QixFQUE2QyxTQUE3QztBQUNBeEIsY0FBRSw4QkFBRixFQUFrQ3dCLEdBQWxDLENBQXNDLGtCQUF0QyxFQUEwRCxTQUExRDtBQUNIO0FBQ0o7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EzQixXQUFPNEIsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCO0FBQ0F6QixVQUFFLDJCQUFGLEVBQStCMEIsRUFBL0IsQ0FBa0MsUUFBbEMsRUFBNENmLHlCQUE1QztBQUNBWCxVQUFFLCtCQUFGLEVBQW1DMEIsRUFBbkMsQ0FBc0MsUUFBdEMsRUFBZ0RaLDRCQUFoRDtBQUNBZCxVQUFFLG9DQUFGLEVBQXdDMEIsRUFBeEMsQ0FBMkMsT0FBM0MsRUFBb0RYLDRCQUFwRDtBQUNBWDs7QUFFQXVCO0FBQ0gsS0FSRDs7QUFVQSxXQUFPOUIsTUFBUDtBQUNILENBM0pMIiwiZmlsZSI6ImFkbWluX2FjY2Vzcy9hZG1pbl9hY2Nlc3NfcGVybWlzc2lvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGFkbWluX2FjY2Vzc19wZXJtaXNzaW9ucy5qcyAyMDE4LTAyLTA1XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgTkFNRVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICdhZG1pbl9hY2Nlc3NfcGVybWlzc2lvbnMnLFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQ09OVFJPTExFUiBMSUJSQVJJRVNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBbXG4gICAgICAgICdtb2RhbCcsXG4gICAgXSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgQlVTSU5FU1MgTE9HSUNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udHJvbGxlciByZWZlcmVuY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgb3B0aW9ucyBmb3IgY29udHJvbGxlcixcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIGNvbnRyb2xsZXIgb3B0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcGVucyBhIG1vZGFsIHdpdGggYW4gZXJyb3IgbWVzc2FnZSBmb3IgYW4gdW5leHBlY3RlZCBlcnJvci5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zZXRBbGxQZXJtaXNzaW9uR3JhbnRpbmdTd2l0Y2hlclZhbHVlcygpIHtcbiAgICAgICAgICAgIGNvbnN0ICRyZWFkaW5nQWxsID0gJCgnaW5wdXQuYWxsLXBlcm1pc3Npb24tY2hlY2tib3hbZGF0YS1wZXJtaXNzaW9uLXR5cGU9cmVhZGluZ10nKTtcbiAgICAgICAgICAgIGNvbnN0ICR3cml0aW5nQWxsID0gJCgnaW5wdXQuYWxsLXBlcm1pc3Npb24tY2hlY2tib3hbZGF0YS1wZXJtaXNzaW9uLXR5cGU9d3JpdGluZ10nKTtcbiAgICAgICAgICAgIGNvbnN0ICRkZWxldGluZ0FsbCA9ICQoJ2lucHV0LmFsbC1wZXJtaXNzaW9uLWNoZWNrYm94W2RhdGEtcGVybWlzc2lvbi10eXBlPWRlbGV0aW5nXScpO1xuICAgICAgICAgICAgaWYgKCRyZWFkaW5nQWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkcmVhZGluZ0FsbFxuICAgICAgICAgICAgICAgICAgICAuc3dpdGNoZXIoJ2NoZWNrZWQnLCAkKCdpbnB1dC5wZXJtaXNzaW9uLWNoZWNrYm94W2RhdGEtcGVybWlzc2lvbi10eXBlPXJlYWRpbmddJykubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICAgICA9PT0gJCgnaW5wdXQucGVybWlzc2lvbi1jaGVja2JveFtkYXRhLXBlcm1pc3Npb24tdHlwZT1yZWFkaW5nXTpjaGVja2VkJykubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkd3JpdGluZ0FsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHdyaXRpbmdBbGxcbiAgICAgICAgICAgICAgICAgICAgLnN3aXRjaGVyKCdjaGVja2VkJywgJCgnaW5wdXQucGVybWlzc2lvbi1jaGVja2JveFtkYXRhLXBlcm1pc3Npb24tdHlwZT13cml0aW5nXScpLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgPT09ICQoJ2lucHV0LnBlcm1pc3Npb24tY2hlY2tib3hbZGF0YS1wZXJtaXNzaW9uLXR5cGU9d3JpdGluZ106Y2hlY2tlZCcpLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJGRlbGV0aW5nQWxsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkZGVsZXRpbmdBbGxcbiAgICAgICAgICAgICAgICAgICAgLnN3aXRjaGVyKCdjaGVja2VkJywgJCgnaW5wdXQucGVybWlzc2lvbi1jaGVja2JveFtkYXRhLXBlcm1pc3Npb24tdHlwZT1kZWxldGluZ10nKS5sZW5ndGhcbiAgICAgICAgICAgICAgICAgICAgICAgID09PSAkKCdpbnB1dC5wZXJtaXNzaW9uLWNoZWNrYm94W2RhdGEtcGVybWlzc2lvbi10eXBlPWRlbGV0aW5nXTpjaGVja2VkJykubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgcGVybWlzc2lvbiBncmFudGluZyBzd2l0Y2hlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF91cGRhdGVQZXJtaXNzaW9uR3JhbnRpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFNldCBjaGVja2JveCBmb3IgcGFyZW50IGdyb3VwIG9yIGNoaWxkIGdyb3VwcyBmb3Igc3BlY2lhbCBjb25kaXRpb25zXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5kYXRhKCdwYXJlbnQtaWQnKSA+IDAgJiYgJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICQoJ2lucHV0LnBlcm1pc3Npb24tY2hlY2tib3hbZGF0YS1ncm91cC1pZD0nICsgJCh0aGlzKS5kYXRhKCdwYXJlbnQtaWQnKSArICddW2RhdGEtcGVybWlzc2lvbi10eXBlPSdcbiAgICAgICAgICAgICAgICAgICAgKyAkKHRoaXMpLmRhdGEoJ3Blcm1pc3Npb24tdHlwZScpICsgJ10nKS5zd2l0Y2hlcignY2hlY2tlZCcsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgnZ3JvdXAtaWQnKSA+IDAgJiYgJCh0aGlzKS5pcygnOmNoZWNrZWQnKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkKCdpbnB1dC5wZXJtaXNzaW9uLWNoZWNrYm94W2RhdGEtcGFyZW50LWlkPScgKyAkKHRoaXMpLmRhdGEoJ2dyb3VwLWlkJykgKyAnXVtkYXRhLXBlcm1pc3Npb24tdHlwZT0nXG4gICAgICAgICAgICAgICAgICAgICsgJCh0aGlzKS5kYXRhKCdwZXJtaXNzaW9uLXR5cGUnKSArICddJykuc3dpdGNoZXIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9zZXRBbGxQZXJtaXNzaW9uR3JhbnRpbmdTd2l0Y2hlclZhbHVlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgZm9yIHRoZSBhbGwgcGVybWlzc2lvbiBncmFudGluZyBzd2l0Y2hlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF91cGRhdGVBbGxQZXJtaXNzaW9uR3JhbnRpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJCgnaW5wdXQucGVybWlzc2lvbi1jaGVja2JveFtkYXRhLXBlcm1pc3Npb24tdHlwZT0nICsgJCh0aGlzKS5kYXRhKCdwZXJtaXNzaW9uLXR5cGUnKSArICddOm5vdCg6Y2hlY2tlZCknKVxuICAgICAgICAgICAgICAgICAgICAuc3dpdGNoZXIoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnaW5wdXQucGVybWlzc2lvbi1jaGVja2JveFtkYXRhLXBlcm1pc3Npb24tdHlwZT0nICsgJCh0aGlzKS5kYXRhKCdwZXJtaXNzaW9uLXR5cGUnKSArICddOmNoZWNrZWQnKVxuICAgICAgICAgICAgICAgICAgICAuc3dpdGNoZXIoJ2NoZWNrZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2sgaGFuZGxlciBmb3IgdGhlIGdyb3VwIGNvbGxhcHNlIGhhbmRsZXIuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jb2xsYXBzZVBlcm1pc3Npb25TdWJHcm91cHMoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwSWQgPSAkKHRoaXMpLmRhdGEoJ2dyb3VwSWQnKTtcbiAgICAgICAgICAgIGNvbnN0ICRpY29uID0gJCh0aGlzKS5maW5kKCdzcGFuJyk7XG5cbiAgICAgICAgICAgIGlmICgkKCdsaVtkYXRhLXBhcmVudC1ncm91cC1pZD0nICsgZ3JvdXBJZCArICddJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRpY29uLmhhc0NsYXNzKCdmYS1taW51cy1zcXVhcmUtbycpKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJ2xpW2RhdGEtcGFyZW50LWdyb3VwLWlkPScgKyBncm91cElkICsgJ10nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICRpY29uLnJlbW92ZUNsYXNzKCdmYS1taW51cy1zcXVhcmUtbycpO1xuICAgICAgICAgICAgICAgICAgICAkaWNvbi5hZGRDbGFzcygnZmEtcGx1cy1zcXVhcmUtbycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJ2xpW2RhdGEtcGFyZW50LWdyb3VwLWlkPScgKyBncm91cElkICsgJ10nKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICRpY29uLmFkZENsYXNzKCdmYS1taW51cy1zcXVhcmUtbycpO1xuICAgICAgICAgICAgICAgICAgICAkaWNvbi5yZW1vdmVDbGFzcygnZmEtcGx1cy1zcXVhcmUtbycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKCdsaS5saXN0LWVsZW1lbnQnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnI0ZGRkZGRicpO1xuICAgICAgICAgICAgICAgICQoJ2xpLmxpc3QtZWxlbWVudDp2aXNpYmxlOmV2ZW4nKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAnI0Y5RjlGOScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gbG9naWNcbiAgICAgICAgICAgICQoJ2lucHV0LnBlcm1pc3Npb24tY2hlY2tib3gnKS5vbignY2hhbmdlJywgX3VwZGF0ZVBlcm1pc3Npb25HcmFudGluZyk7XG4gICAgICAgICAgICAkKCdpbnB1dC5hbGwtcGVybWlzc2lvbi1jaGVja2JveCcpLm9uKCdjaGFuZ2UnLCBfdXBkYXRlQWxsUGVybWlzc2lvbkdyYW50aW5nKTtcbiAgICAgICAgICAgICQoJ3NwYW4ubGlzdC1lbGVtZW50LWNvbGxhcHNlLWhhbmRsZXInKS5vbignY2xpY2snLCBfY29sbGFwc2VQZXJtaXNzaW9uU3ViR3JvdXBzKTtcbiAgICAgICAgICAgIF9zZXRBbGxQZXJtaXNzaW9uR3JhbnRpbmdTd2l0Y2hlclZhbHVlcygpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7Il19
