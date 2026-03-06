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
 * Properties Table Actions Controller
 *
 * This module creates the bulk and row actions for the properties table.
 */
gx.controllers.module('properties_actions', [gx.source + '/libs/button_dropdown', 'user_configuration_service'], function () {

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
        var $bulkActions = $('.properties-bulk-action');
        var defaultBulkAction = 'properties-bulk-row-edit';

        // Edit
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_EDIT', 'admin_quick_edit'),
            class: 'properties-bulk-row-edit',
            data: { configurationValue: 'properties-bulk-row-edit' },
            isDefault: defaultBulkAction === 'properties-bulk-row-edit' || defaultBulkAction === 'save-properties-bulk-row-edits',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Save
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_SAVE', 'admin_quick_edit'),
            class: 'save-properties-bulk-row-edits hidden',
            data: { configurationValue: 'save-properties-bulk-row-edits' },
            isDefault: false, // "Save" must not be shown as a default value.
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        $this.datatable_default_actions('ensure', 'bulk');
    }

    function _createRowActions() {
        var defaultRowAction = $this.data('defaultRowAction') || 'row-properties-edit';

        $this.find('.btn-group.dropdown').each(function () {
            // Edit
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_EDIT', 'admin_quick_edit'),
                class: 'row-properties-edit',
                data: { configurationValue: 'row-properties-edit' },
                isDefault: defaultRowAction === 'row-properties-edit' || defaultRowAction === 'save-properties-edits',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Save
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_SAVE', 'admin_quick_edit'),
                class: 'save-properties-edits hidden',
                data: { configurationValue: 'save-properties-edits' },
                isDefault: false, // "Save" must not be shown as a default value.
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL3Byb3BlcnRpZXMvcHJvcGVydGllc19hY3Rpb25zLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCIkdGhpcyIsIiQiLCJfY3JlYXRlQnVsa0FjdGlvbnMiLCIkYnVsa0FjdGlvbnMiLCJkZWZhdWx0QnVsa0FjdGlvbiIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJhZGRBY3Rpb24iLCJ0ZXh0IiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJjbGFzcyIsImRhdGEiLCJjb25maWd1cmF0aW9uVmFsdWUiLCJpc0RlZmF1bHQiLCJjYWxsYmFjayIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMiLCJfY3JlYXRlUm93QWN0aW9ucyIsImRlZmF1bHRSb3dBY3Rpb24iLCJmaW5kIiwiZWFjaCIsImluaXQiLCJkb25lIiwid2luZG93Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksb0JBREosRUFHSSxDQUFJRixHQUFHRyxNQUFQLDRCQUFzQyw0QkFBdEMsQ0FISixFQUtJLFlBQVk7O0FBRVI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLGFBQVNJLGtCQUFULEdBQThCO0FBQzFCO0FBQ0EsWUFBTUMsZUFBZUYsRUFBRSx5QkFBRixDQUFyQjtBQUNBLFlBQU1HLG9CQUFvQiwwQkFBMUI7O0FBRUE7QUFDQUMsWUFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCQyxTQUF6QixDQUFtQ0wsWUFBbkMsRUFBaUQ7QUFDN0NNLGtCQUFNSixJQUFJSyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixhQUF4QixFQUF1QyxrQkFBdkMsQ0FEdUM7QUFFN0NDLG1CQUFPLDBCQUZzQztBQUc3Q0Msa0JBQU0sRUFBQ0Msb0JBQW9CLDBCQUFyQixFQUh1QztBQUk3Q0MsdUJBQVdaLHNCQUFzQiwwQkFBdEIsSUFDSkEsc0JBQXNCLGdDQUxnQjtBQU03Q2Esc0JBQVU7QUFBQSx1QkFBS0MsRUFBRUMsY0FBRixFQUFMO0FBQUE7QUFObUMsU0FBakQ7O0FBU0E7QUFDQWQsWUFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCQyxTQUF6QixDQUFtQ0wsWUFBbkMsRUFBaUQ7QUFDN0NNLGtCQUFNSixJQUFJSyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixhQUF4QixFQUF1QyxrQkFBdkMsQ0FEdUM7QUFFN0NDLG1CQUFPLHVDQUZzQztBQUc3Q0Msa0JBQU0sRUFBQ0Msb0JBQW9CLGdDQUFyQixFQUh1QztBQUk3Q0MsdUJBQVcsS0FKa0MsRUFJM0I7QUFDbEJDLHNCQUFVO0FBQUEsdUJBQUtDLEVBQUVDLGNBQUYsRUFBTDtBQUFBO0FBTG1DLFNBQWpEOztBQVFBbkIsY0FBTW9CLHlCQUFOLENBQWdDLFFBQWhDLEVBQTBDLE1BQTFDO0FBQ0g7O0FBRUQsYUFBU0MsaUJBQVQsR0FBNkI7QUFDekIsWUFBTUMsbUJBQW1CdEIsTUFBTWMsSUFBTixDQUFXLGtCQUFYLEtBQWtDLHFCQUEzRDs7QUFFQWQsY0FBTXVCLElBQU4sQ0FBVyxxQkFBWCxFQUFrQ0MsSUFBbEMsQ0FBdUMsWUFBWTtBQUMvQztBQUNBbkIsZ0JBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FBbUNQLEVBQUUsSUFBRixDQUFuQyxFQUE0QztBQUN4Q1Esc0JBQU1KLElBQUlLLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGFBQXhCLEVBQXVDLGtCQUF2QyxDQURrQztBQUV4Q0MsdUJBQU8scUJBRmlDO0FBR3hDQyxzQkFBTSxFQUFDQyxvQkFBb0IscUJBQXJCLEVBSGtDO0FBSXhDQywyQkFBV00scUJBQXFCLHFCQUFyQixJQUNKQSxxQkFBcUIsdUJBTFk7QUFNeENMLDBCQUFVO0FBQUEsMkJBQUtDLEVBQUVDLGNBQUYsRUFBTDtBQUFBO0FBTjhCLGFBQTVDOztBQVNBO0FBQ0FkLGdCQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLENBQW1DUCxFQUFFLElBQUYsQ0FBbkMsRUFBNEM7QUFDeENRLHNCQUFNSixJQUFJSyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixhQUF4QixFQUF1QyxrQkFBdkMsQ0FEa0M7QUFFeENDLHVCQUFPLDhCQUZpQztBQUd4Q0Msc0JBQU0sRUFBQ0Msb0JBQW9CLHVCQUFyQixFQUhrQztBQUl4Q0MsMkJBQVcsS0FKNkIsRUFJdEI7QUFDbEJDLDBCQUFVO0FBQUEsMkJBQUtDLEVBQUVDLGNBQUYsRUFBTDtBQUFBO0FBTDhCLGFBQTVDOztBQVFBbkIsa0JBQU1vQix5QkFBTixDQUFnQyxRQUFoQyxFQUEwQyxLQUExQztBQUNILFNBckJEO0FBc0JIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXRCLFdBQU8yQixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnpCLFVBQUUwQixNQUFGLEVBQVVDLEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFNO0FBQ3pDNUIsa0JBQU00QixFQUFOLENBQVMsU0FBVCxFQUFvQlAsaUJBQXBCO0FBQ0FBO0FBQ0FuQjtBQUNILFNBSkQ7O0FBTUF3QjtBQUNILEtBUkQ7O0FBVUEsV0FBTzVCLE1BQVA7QUFFSCxDQTFHTCIsImZpbGUiOiJxdWlja19lZGl0L21vZGFscy9wcm9wZXJ0aWVzL3Byb3BlcnRpZXNfYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWN0aW9ucy5qcyAyMDE3LTA1LTI5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIFRhYmxlIEFjdGlvbnMgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgbW9kdWxlIGNyZWF0ZXMgdGhlIGJ1bGsgYW5kIHJvdyBhY3Rpb25zIGZvciB0aGUgcHJvcGVydGllcyB0YWJsZS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdwcm9wZXJ0aWVzX2FjdGlvbnMnLFxuXG4gICAgW2Ake2d4LnNvdXJjZX0vbGlicy9idXR0b25fZHJvcGRvd25gLCAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnXSxcblxuICAgIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIEJ1bGsgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGNhbGxiYWNrIGNhbiBiZSBjYWxsZWQgb25jZSBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUJ1bGtBY3Rpb25zKCkge1xuICAgICAgICAgICAgLy8gQWRkIGFjdGlvbnMgdG8gdGhlIGJ1bGstYWN0aW9uIGRyb3Bkb3duLlxuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zID0gJCgnLnByb3BlcnRpZXMtYnVsay1hY3Rpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRCdWxrQWN0aW9uID0gJ3Byb3BlcnRpZXMtYnVsay1yb3ctZWRpdCc7XG5cbiAgICAgICAgICAgIC8vIEVkaXRcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9FRElUJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICBjbGFzczogJ3Byb3BlcnRpZXMtYnVsay1yb3ctZWRpdCcsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3Byb3BlcnRpZXMtYnVsay1yb3ctZWRpdCd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdwcm9wZXJ0aWVzLWJ1bGstcm93LWVkaXQnXG4gICAgICAgICAgICAgICAgICAgIHx8IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnc2F2ZS1wcm9wZXJ0aWVzLWJ1bGstcm93LWVkaXRzJyxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBTYXZlXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fU0FWRScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdzYXZlLXByb3BlcnRpZXMtYnVsay1yb3ctZWRpdHMgaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnc2F2ZS1wcm9wZXJ0aWVzLWJ1bGstcm93LWVkaXRzJ30sXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBmYWxzZSwgLy8gXCJTYXZlXCIgbXVzdCBub3QgYmUgc2hvd24gYXMgYSBkZWZhdWx0IHZhbHVlLlxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICR0aGlzLmRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMoJ2Vuc3VyZScsICdidWxrJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlUm93QWN0aW9ucygpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRSb3dBY3Rpb24gPSAkdGhpcy5kYXRhKCdkZWZhdWx0Um93QWN0aW9uJykgfHwgJ3Jvdy1wcm9wZXJ0aWVzLWVkaXQnO1xuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gRWRpdFxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0VESVQnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Jvdy1wcm9wZXJ0aWVzLWVkaXQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAncm93LXByb3BlcnRpZXMtZWRpdCd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdyb3ctcHJvcGVydGllcy1lZGl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgfHwgZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ3NhdmUtcHJvcGVydGllcy1lZGl0cycsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gU2F2ZVxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX1NBVkUnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3NhdmUtcHJvcGVydGllcy1lZGl0cyBoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnc2F2ZS1wcm9wZXJ0aWVzLWVkaXRzJ30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZmFsc2UsIC8vIFwiU2F2ZVwiIG11c3Qgbm90IGJlIHNob3duIGFzIGEgZGVmYXVsdCB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5kYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zKCdlbnN1cmUnLCAncm93Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgJHRoaXMub24oJ2RyYXcuZHQnLCBfY3JlYXRlUm93QWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgX2NyZWF0ZVJvd0FjdGlvbnMoKTtcbiAgICAgICAgICAgICAgICBfY3JlYXRlQnVsa0FjdGlvbnMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcblxuICAgIH0pOyJdfQ==
