'use strict';

/* --------------------------------------------------------------
 actions.js 2017-05-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Special Prices Table Actions Controller
 *
 * This module creates the bulk and row actions for the table.
 */
gx.controllers.module('special_prices_actions', [gx.source + '/libs/button_dropdown', 'user_configuration_service'], function () {

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
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Create Bulk Actions
     *
     * This callback can be called once during the initialization of this module.
     */
    function _createBulkActions() {
        // Add actions to the bulk-action dropdown.
        var $bulkActions = $('.special-price-bulk-action');
        var defaultBulkAction = 'special-price-bulk-row-edit';

        // Edit
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_EDIT', 'admin_quick_edit'),
            class: 'special-price-bulk-row-edit',
            data: { configurationValue: 'special-price-bulk-row-edit' },
            isDefault: defaultBulkAction === 'special-price-bulk-row-edit' || defaultBulkAction === 'save-special-price-bulk-row-edits',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Save
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_SAVE', 'admin_quick_edit'),
            class: 'save-special-price-bulk-row-edits hidden',
            data: { configurationValue: 'save-special-price-bulk-row-edits' },
            isDefault: false, // "Save" must not be shown as a default value.
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Delete
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_DELETE', 'admin_quick_edit'),
            class: 'bulk-delete-special-price',
            data: { configurationValue: 'delete-special-price' },
            isDefault: defaultBulkAction === 'delete-special-price',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        $this.datatable_default_actions('ensure', 'bulk');
    }

    function _createRowActions() {
        var defaultRowAction = $this.data('defaultRowAction') || 'row-special-price-edit';

        $this.find('.btn-group.dropdown').each(function () {
            // Edit
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_EDIT', 'admin_quick_edit'),
                class: 'row-special-price-edit',
                data: { configurationValue: 'row-special-price-edit' },
                isDefault: defaultRowAction === 'row-special-price-edit' || defaultRowAction === 'save-special-price-edits',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Save
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_SAVE', 'admin_quick_edit'),
                class: 'save-special-price-edits hidden',
                data: { configurationValue: 'save-special-price-edits' },
                isDefault: false, // "Save" must not be shown as a default value.
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Delete
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_DELETE', 'admin_quick_edit'),
                class: 'row-delete-special-price',
                data: { configurationValue: 'row-delete-special-price' },
                isDefault: defaultRowAction === 'row-delete-special-price',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            $this.datatable_default_actions('ensure', 'row');
        });
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $(window).on('JSENGINE_INIT_FINISHED', function () {
            $this.on('draw.dt', _createRowActions);
            _createRowActions();
            _createBulkActions();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3NwZWNpYWxfcHJpY2VzL3NwZWNpYWxfcHJpY2VzX2FjdGlvbnMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsIiR0aGlzIiwiJCIsIl9jcmVhdGVCdWxrQWN0aW9ucyIsIiRidWxrQWN0aW9ucyIsImRlZmF1bHRCdWxrQWN0aW9uIiwianNlIiwibGlicyIsImJ1dHRvbl9kcm9wZG93biIsImFkZEFjdGlvbiIsInRleHQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImNsYXNzIiwiZGF0YSIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsImlzRGVmYXVsdCIsImNhbGxiYWNrIiwiZSIsInByZXZlbnREZWZhdWx0IiwiZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucyIsIl9jcmVhdGVSb3dBY3Rpb25zIiwiZGVmYXVsdFJvd0FjdGlvbiIsImZpbmQiLCJlYWNoIiwiaW5pdCIsImRvbmUiLCJ3aW5kb3ciLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7OztBQUtBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSx3QkFESixFQUdJLENBQUlGLEdBQUdHLE1BQVAsNEJBQXNDLDRCQUF0QyxDQUhKLEVBS0ksWUFBWTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7O0FBS0EsYUFBU0ksa0JBQVQsR0FBOEI7QUFDMUI7QUFDQSxZQUFNQyxlQUFlRixFQUFFLDRCQUFGLENBQXJCO0FBQ0EsWUFBTUcsb0JBQW9CLDZCQUExQjs7QUFFQTtBQUNBQyxZQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLENBQW1DTCxZQUFuQyxFQUFpRDtBQUM3Q00sa0JBQU1KLElBQUlLLElBQUosQ0FBU0Ms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O0FBSXhDQywyQkFBV00scUJBQXFCLDBCQUpRO0FBS3hDTCwwQkFBVTtBQUFBLDJCQUFLQyxFQUFFQyxjQUFGLEVBQUw7QUFBQTtBQUw4QixhQUE1Qzs7QUFRQW5CLGtCQUFNb0IseUJBQU4sQ0FBZ0MsUUFBaEMsRUFBMEMsS0FBMUM7QUFDSCxTQTlCRDtBQStCSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUF0QixXQUFPMkIsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJ6QixVQUFFMEIsTUFBRixFQUFVQyxFQUFWLENBQWEsd0JBQWIsRUFBdUMsWUFBTTtBQUN6QzVCLGtCQUFNNEIsRUFBTixDQUFTLFNBQVQsRUFBb0JQLGlCQUFwQjtBQUNBQTtBQUNBbkI7QUFDSCxTQUpEOztBQU1Bd0I7QUFDSCxLQVJEOztBQVVBLFdBQU81QixNQUFQO0FBRUgsQ0E1SEwiLCJmaWxlIjoicXVpY2tfZWRpdC9tb2RhbHMvc3BlY2lhbF9wcmljZXMvc3BlY2lhbF9wcmljZXNfYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWN0aW9ucy5qcyAyMDE3LTA1LTI5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBTcGVjaWFsIFByaWNlcyBUYWJsZSBBY3Rpb25zIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIG1vZHVsZSBjcmVhdGVzIHRoZSBidWxrIGFuZCByb3cgYWN0aW9ucyBmb3IgdGhlIHRhYmxlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3NwZWNpYWxfcHJpY2VzX2FjdGlvbnMnLFxuXG4gICAgW2Ake2d4LnNvdXJjZX0vbGlicy9idXR0b25fZHJvcGRvd25gLCAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnXSxcblxuICAgIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIEJ1bGsgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGNhbGxiYWNrIGNhbiBiZSBjYWxsZWQgb25jZSBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUJ1bGtBY3Rpb25zKCkge1xuICAgICAgICAgICAgLy8gQWRkIGFjdGlvbnMgdG8gdGhlIGJ1bGstYWN0aW9uIGRyb3Bkb3duLlxuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zID0gJCgnLnNwZWNpYWwtcHJpY2UtYnVsay1hY3Rpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRCdWxrQWN0aW9uID0gJ3NwZWNpYWwtcHJpY2UtYnVsay1yb3ctZWRpdCc7XG5cbiAgICAgICAgICAgIC8vIEVkaXRcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9FRElUJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICBjbGFzczogJ3NwZWNpYWwtcHJpY2UtYnVsay1yb3ctZWRpdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3NwZWNpYWwtcHJpY2UtYnVsay1yb3ctZWRpdCd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdzcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXQnXG4gICAgICAgICAgICAgICAgICAgIHx8IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnc2F2ZS1zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXRzJyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBTYXZlXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fU0FWRScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdzYXZlLXNwZWNpYWwtcHJpY2UtYnVsay1yb3ctZWRpdHMgaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnc2F2ZS1zcGVjaWFsLXByaWNlLWJ1bGstcm93LWVkaXRzJ30sXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBmYWxzZSwgIC8vIFwiU2F2ZVwiIG11c3Qgbm90IGJlIHNob3duIGFzIGEgZGVmYXVsdCB2YWx1ZS5cbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBEZWxldGVcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9ERUxFVEUnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnYnVsay1kZWxldGUtc3BlY2lhbC1wcmljZScsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2RlbGV0ZS1zcGVjaWFsLXByaWNlJ30sXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0QnVsa0FjdGlvbiA9PT0gJ2RlbGV0ZS1zcGVjaWFsLXByaWNlJyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkdGhpcy5kYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zKCdlbnN1cmUnLCAnYnVsaycpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZVJvd0FjdGlvbnMoKSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Um93QWN0aW9uID0gJHRoaXMuZGF0YSgnZGVmYXVsdFJvd0FjdGlvbicpIHx8ICdyb3ctc3BlY2lhbC1wcmljZS1lZGl0JztcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vIEVkaXRcbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9FRElUJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdyb3ctc3BlY2lhbC1wcmljZS1lZGl0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3Jvdy1zcGVjaWFsLXByaWNlLWVkaXQnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAncm93LXNwZWNpYWwtcHJpY2UtZWRpdCdcbiAgICAgICAgICAgICAgICAgICAgICAgIHx8IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdzYXZlLXNwZWNpYWwtcHJpY2UtZWRpdHMnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFNhdmVcbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9TQVZFJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdzYXZlLXNwZWNpYWwtcHJpY2UtZWRpdHMgaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3NhdmUtc3BlY2lhbC1wcmljZS1lZGl0cyd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGZhbHNlLCAgLy8gXCJTYXZlXCIgbXVzdCBub3QgYmUgc2hvd24gYXMgYSBkZWZhdWx0IHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZVxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0RFTEVURScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAncm93LWRlbGV0ZS1zcGVjaWFsLXByaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3Jvdy1kZWxldGUtc3BlY2lhbC1wcmljZSd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdyb3ctZGVsZXRlLXNwZWNpYWwtcHJpY2UnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICR0aGlzLmRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMoJ2Vuc3VyZScsICdyb3cnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICQod2luZG93KS5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkdGhpcy5vbignZHJhdy5kdCcsIF9jcmVhdGVSb3dBY3Rpb25zKTtcbiAgICAgICAgICAgICAgICBfY3JlYXRlUm93QWN0aW9ucygpO1xuICAgICAgICAgICAgICAgIF9jcmVhdGVCdWxrQWN0aW9ucygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuXG4gICAgfSk7Il19
