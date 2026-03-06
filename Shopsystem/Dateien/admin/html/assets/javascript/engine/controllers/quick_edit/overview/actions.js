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
 * Main Table Actions
 *
 * This module creates the bulk and row actions for the table.
 */
gx.controllers.module('actions', ['user_configuration_service', gx.source + '/libs/button_dropdown'], function () {

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
        var $bulkActions = $('.overview-bulk-action');
        var defaultBulkAction = $this.data('defaultBulkAction') || 'bulk-row-edit';

        // Edit
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_EDIT', 'admin_quick_edit'),
            class: 'bulk-row-edit',
            data: { configurationValue: 'bulk-row-edit' },
            isDefault: defaultBulkAction === 'bulk-row-edit' || defaultBulkAction === 'save-bulk-row-edits',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Save
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_SAVE', 'admin_quick_edit'),
            class: 'save-bulk-row-edits hidden',
            data: { configurationValue: 'save-bulk-row-edits' },
            isDefault: false, // "Save" must not be shown as a default value.
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Properties
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_PROPERTIES', 'admin_quick_edit'),
            class: 'bulk-properties-edit',
            data: { configurationValue: 'bulk-properties-edit' },
            isDefault: defaultBulkAction === 'bulk-properties-edit',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Special Price
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_SPECIAL_PRICE', 'admin_quick_edit'),
            class: 'bulk-special-price-edit',
            data: { configurationValue: 'bulk-special-price-edit' },
            isDefault: defaultBulkAction === 'bulk-special-price-edit',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        $this.parents('.quick-edit.overview').find('a.bulk-properties-edit').attr('data-toggle', 'modal').attr('data-target', '.properties.modal');

        $this.parents('.quick-edit.overview').find('a.bulk-special-price-edit').attr('data-toggle', 'modal').attr('data-target', '.special-prices.modal');

        $this.datatable_default_actions('ensure', 'bulk');
    }

    /**
     * Create Table Row Actions
     *
     * This function must be call with every table draw.dt event.
     */
    function _createRowActions() {
        // Re-create the checkbox widgets and the row actions.
        var defaultRowAction = $this.data('defaultRowAction') || 'show-product';

        $this.find('.btn-group.dropdown').each(function () {
            var productId = $(this).parents('tr').data('id');

            // Show Product
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_SHOW', 'admin_quick_edit'),
                href: jse.core.config.get('appUrl') + '/admin/categories.php?pID=' + productId + '&action=new_product',
                class: 'show-product',
                data: { configurationValue: 'show-product' },
                isDefault: defaultRowAction === 'show-product',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Edit
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_EDIT', 'admin_quick_edit'),
                class: 'row-edit',
                data: { configurationValue: 'row-edit' },
                isDefault: defaultRowAction === 'row-edit' || defaultRowAction === 'save-row-edits',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Save
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_SAVE', 'admin_quick_edit'),
                class: 'save-row-edits hidden',
                data: { configurationValue: 'save-row-edits' },
                isDefault: false, // "Save" must not be saved as a pre-selected value.
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Properties
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_PROPERTIES', 'admin_quick_edit'),
                class: 'products-properties',
                data: { configurationValue: 'properties' },
                isDefault: defaultRowAction === 'properties',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Special Price
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_SPECIAL_PRICE', 'admin_quick_edit'),
                class: 'special-price',
                data: { configurationValue: 'special-price' },
                isDefault: defaultRowAction === 'special-price',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Graduated Prices
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_GRADUATED_PRICES', 'admin_quick_edit'),
                class: 'graduated-prices',
                data: { configurationValue: 'graduated-prices' },
                isDefault: defaultRowAction === 'graduated-prices',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            $this.parents('.quick-edit.overview').find('a.products-properties').attr('data-toggle', 'modal').attr('data-target', '.properties.modal');

            $this.parents('.quick-edit.overview').find('a.special-price').attr('data-toggle', 'modal').attr('data-target', '.special-prices.modal');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvYWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiJHRoaXMiLCIkIiwiX2NyZWF0ZUJ1bGtBY3Rpb25zIiwiJGJ1bGtBY3Rpb25zIiwiZGVmYXVsdEJ1bGtBY3Rpb24iLCJkYXRhIiwianNlIiwibGlicyIsImJ1dHRvbl9kcm9wZG93biIsImFkZEFjdGlvbiIsInRleHQiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImNsYXNzIiwiY29uZmlndXJhdGlvblZhbHVlIiwiaXNEZWZhdWx0IiwiY2FsbGJhY2siLCJlIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnRzIiwiZmluZCIsImF0dHIiLCJkYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zIiwiX2NyZWF0ZVJvd0FjdGlvbnMiLCJkZWZhdWx0Um93QWN0aW9uIiwiZWFjaCIsInByb2R1Y3RJZCIsImhyZWYiLCJjb25maWciLCJnZXQiLCJpbml0IiwiZG9uZSIsIndpbmRvdyIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFNBREosRUFHSSxDQUFDLDRCQUFELEVBQWtDRixHQUFHRyxNQUFyQywyQkFISixFQUtJLFlBQVk7O0FBRVI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSCxTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLGFBQVNJLGtCQUFULEdBQThCO0FBQzFCO0FBQ0EsWUFBTUMsZUFBZUYsRUFBRSx1QkFBRixDQUFyQjtBQUNBLFlBQU1HLG9CQUFvQkosTUFBTUssSUFBTixDQUFXLG1CQUFYLEtBQW1DLGVBQTdEOztBQUVBO0FBQ0FDLFlBQUlDLElBQUosQ0FBU0MsZUFBVCxDQUF5QkMsU0FBekIs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LElBRkwsQ0FFVSxhQUZWLEVBRXlCLE9BRnpCLEVBR0tBLElBSEwsQ0FHVSxhQUhWLEVBR3lCLG1CQUh6Qjs7QUFLQXRCLGtCQUFNb0IsT0FBTixDQUFjLHNCQUFkLEVBQ0tDLElBREwsQ0FDVSxpQkFEVixFQUVLQyxJQUZMLENBRVUsYUFGVixFQUV5QixPQUZ6QixFQUdLQSxJQUhMLENBR1UsYUFIVixFQUd5Qix1QkFIekI7O0FBS0F0QixrQkFBTXVCLHlCQUFOLENBQWdDLFFBQWhDLEVBQTBDLEtBQTFDO0FBQ0gsU0FyRUQ7QUFzRUg7O0FBRUQ7QUFDQTtBQUNBOztBQUVBekIsV0FBT2lDLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCL0IsVUFBRWdDLE1BQUYsRUFBVUMsRUFBVixDQUFhLHdCQUFiLEVBQXVDLFlBQU07QUFDekNsQyxrQkFBTWtDLEVBQU4sQ0FBUyxTQUFULEVBQW9CVixpQkFBcEI7QUFDQUE7QUFDQXRCO0FBQ0gsU0FKRDs7QUFNQThCO0FBQ0gsS0FSRDs7QUFVQSxXQUFPbEMsTUFBUDtBQUVILENBM0xMIiwiZmlsZSI6InF1aWNrX2VkaXQvb3ZlcnZpZXcvYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWN0aW9ucy5qcyAyMDE3LTA1LTI5XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBNYWluIFRhYmxlIEFjdGlvbnNcbiAqXG4gKiBUaGlzIG1vZHVsZSBjcmVhdGVzIHRoZSBidWxrIGFuZCByb3cgYWN0aW9ucyBmb3IgdGhlIHRhYmxlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2FjdGlvbnMnLFxuXG4gICAgWyd1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZScsIGAke2d4LnNvdXJjZX0vbGlicy9idXR0b25fZHJvcGRvd25gXSxcblxuICAgIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIEJ1bGsgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGNhbGxiYWNrIGNhbiBiZSBjYWxsZWQgb25jZSBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUJ1bGtBY3Rpb25zKCkge1xuICAgICAgICAgICAgLy8gQWRkIGFjdGlvbnMgdG8gdGhlIGJ1bGstYWN0aW9uIGRyb3Bkb3duLlxuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zID0gJCgnLm92ZXJ2aWV3LWJ1bGstYWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0QnVsa0FjdGlvbiA9ICR0aGlzLmRhdGEoJ2RlZmF1bHRCdWxrQWN0aW9uJykgfHwgJ2J1bGstcm93LWVkaXQnO1xuXG4gICAgICAgICAgICAvLyBFZGl0XG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fRURJVCcsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgY2xhc3M6ICdidWxrLXJvdy1lZGl0JyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnYnVsay1yb3ctZWRpdCd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdidWxrLXJvdy1lZGl0JyB8fCBkZWZhdWx0QnVsa0FjdGlvbiA9PT0gJ3NhdmUtYnVsay1yb3ctZWRpdHMnLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFNhdmVcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9TQVZFJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICBjbGFzczogJ3NhdmUtYnVsay1yb3ctZWRpdHMgaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnc2F2ZS1idWxrLXJvdy1lZGl0cyd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZmFsc2UsICAvLyBcIlNhdmVcIiBtdXN0IG5vdCBiZSBzaG93biBhcyBhIGRlZmF1bHQgdmFsdWUuXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gUHJvcGVydGllc1xuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkYnVsa0FjdGlvbnMsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX1BST1BFUlRJRVMnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnYnVsay1wcm9wZXJ0aWVzLWVkaXQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdidWxrLXByb3BlcnRpZXMtZWRpdCd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdidWxrLXByb3BlcnRpZXMtZWRpdCcsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU3BlY2lhbCBQcmljZVxuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkYnVsa0FjdGlvbnMsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX1NQRUNJQUxfUFJJQ0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnYnVsay1zcGVjaWFsLXByaWNlLWVkaXQnLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdidWxrLXNwZWNpYWwtcHJpY2UtZWRpdCd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdidWxrLXNwZWNpYWwtcHJpY2UtZWRpdCcsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRoaXMucGFyZW50cygnLnF1aWNrLWVkaXQub3ZlcnZpZXcnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdhLmJ1bGstcHJvcGVydGllcy1lZGl0JylcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS10b2dnbGUnLCAnbW9kYWwnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRhcmdldCcsICcucHJvcGVydGllcy5tb2RhbCcpO1xuXG4gICAgICAgICAgICAkdGhpcy5wYXJlbnRzKCcucXVpY2stZWRpdC5vdmVydmlldycpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2EuYnVsay1zcGVjaWFsLXByaWNlLWVkaXQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRvZ2dsZScsICdtb2RhbCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJy5zcGVjaWFsLXByaWNlcy5tb2RhbCcpO1xuXG4gICAgICAgICAgICAkdGhpcy5kYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zKCdlbnN1cmUnLCAnYnVsaycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBUYWJsZSBSb3cgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbCB3aXRoIGV2ZXJ5IHRhYmxlIGRyYXcuZHQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlUm93QWN0aW9ucygpIHtcbiAgICAgICAgICAgIC8vIFJlLWNyZWF0ZSB0aGUgY2hlY2tib3ggd2lkZ2V0cyBhbmQgdGhlIHJvdyBhY3Rpb25zLlxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFJvd0FjdGlvbiA9ICR0aGlzLmRhdGEoJ2RlZmF1bHRSb3dBY3Rpb24nKSB8fCAnc2hvdy1wcm9kdWN0JztcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RJZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpZCcpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2hvdyBQcm9kdWN0XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fU0hPVycsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9jYXRlZ29yaWVzLnBocD9wSUQ9JHtwcm9kdWN0SWR9JmFjdGlvbj1uZXdfcHJvZHVjdGAsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnc2hvdy1wcm9kdWN0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3Nob3ctcHJvZHVjdCd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdzaG93LXByb2R1Y3QnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEVkaXRcbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9FRElUJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdyb3ctZWRpdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdyb3ctZWRpdCd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdyb3ctZWRpdCcgfHwgZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ3NhdmUtcm93LWVkaXRzJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBTYXZlXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fU0FWRScsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnc2F2ZS1yb3ctZWRpdHMgaGlkZGVuJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3NhdmUtcm93LWVkaXRzJ30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZmFsc2UsIC8vIFwiU2F2ZVwiIG11c3Qgbm90IGJlIHNhdmVkIGFzIGEgcHJlLXNlbGVjdGVkIHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9QUk9QRVJUSUVTJywgJ2FkbWluX3F1aWNrX2VkaXQnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdwcm9kdWN0cy1wcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3Byb3BlcnRpZXMnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAncHJvcGVydGllcycsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gU3BlY2lhbCBQcmljZVxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX1NQRUNJQUxfUFJJQ0UnLCAnYWRtaW5fcXVpY2tfZWRpdCcpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3NwZWNpYWwtcHJpY2UnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnc3BlY2lhbC1wcmljZSd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdzcGVjaWFsLXByaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBHcmFkdWF0ZWQgUHJpY2VzXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fR1JBRFVBVEVEX1BSSUNFUycsICdhZG1pbl9xdWlja19lZGl0JyksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnZ3JhZHVhdGVkLXByaWNlcycsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdncmFkdWF0ZWQtcHJpY2VzJ30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ2dyYWR1YXRlZC1wcmljZXMnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICR0aGlzLnBhcmVudHMoJy5xdWljay1lZGl0Lm92ZXJ2aWV3JylcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2EucHJvZHVjdHMtcHJvcGVydGllcycpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRvZ2dsZScsICdtb2RhbCcpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXRhcmdldCcsICcucHJvcGVydGllcy5tb2RhbCcpO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMucGFyZW50cygnLnF1aWNrLWVkaXQub3ZlcnZpZXcnKVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgnYS5zcGVjaWFsLXByaWNlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdG9nZ2xlJywgJ21vZGFsJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtdGFyZ2V0JywgJy5zcGVjaWFsLXByaWNlcy5tb2RhbCcpO1xuXG4gICAgICAgICAgICAgICAgJHRoaXMuZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucygnZW5zdXJlJywgJ3JvdycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdKU0VOR0lORV9JTklUX0ZJTklTSEVEJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgX2NyZWF0ZVJvd0FjdGlvbnMpO1xuICAgICAgICAgICAgICAgIF9jcmVhdGVSb3dBY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgX2NyZWF0ZUJ1bGtBY3Rpb25zKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG5cbiAgICB9KTsiXX0=
