'use strict';

/* --------------------------------------------------------------
 actions.js 2019-02-26
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Main Table Actions
 *
 * This module creates the bulk and row actions for the table.
 */
gx.controllers.module('actions', ['user_configuration_service', gx.source + '/libs/button_dropdown'], function (data) {

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
        var $bulkActions = $('.bulk-action');
        var defaultBulkAction = $this.data('defaultBulkAction') || 'bulk-email-invoice';

        jse.libs.button_dropdown.bindDefaultAction($bulkActions, jse.core.registry.get('userId'), 'invoicesOverviewBulkAction', jse.libs.user_configuration_service);

        // Email
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_EMAIL', 'admin_buttons'),
            class: 'bulk-email-invoice',
            data: { configurationValue: 'bulk-email-invoice' },
            isDefault: defaultBulkAction === 'bulk-email-invoice',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Change status
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_MULTI_CHANGE_ORDER_STATUS', 'orders'),
            class: 'change-status',
            data: { configurationValue: 'change-status' },
            isDefault: defaultBulkAction === 'change-status',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Download invoices
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BULK_DOWNLOAD_INVOICES', 'admin_invoices'),
            class: 'bulk-download-invoice',
            data: { configurationValue: 'bulk-download-invoice' },
            isDefault: defaultBulkAction === 'bulk-download-invoice',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Cancellation Invoice
        if (!!data.isPdfCreatorInstalled) {
            jse.libs.button_dropdown.addAction($bulkActions, {
                text: jse.core.lang.translate('CANCELLATION_INVOICE', 'admin_invoices'),
                class: 'bulk-cancellation-invoice',
                data: { configurationValue: 'bulk-cancellation-invoice' },
                isDefault: defaultBulkAction === 'bulk-cancellation-invoice',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });
        }

        $this.datatable_default_actions('ensure', 'bulk');
    }

    /**
     * Create Table Row Actions
     *
     * This function must be call with every table draw.dt event.
     */
    function _createRowActions() {
        // Re-create the checkbox widgets and the row actions.
        var defaultRowAction = $this.data('defaultRowAction') || 'view';

        jse.libs.button_dropdown.bindDefaultAction($this.find('.btn-group.dropdown'), jse.core.registry.get('userId'), 'invoicesOverviewRowAction', jse.libs.user_configuration_service);

        $this.find('.btn-group.dropdown').each(function () {
            var _$$parents$data = $(this).parents('tr').data(),
                invoiceNumber = _$$parents$data.invoiceNumber,
                orderId = _$$parents$data.orderId,
                isCancellationInvoice = _$$parents$data.isCancellationInvoice,
                country = _$$parents$data.country;

            // View


            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TEXT_SHOW', 'orders'),
                href: 'request_port.php?module=OrderAdmin&action=showPdf&type=invoice' + ('&invoice_number=' + invoiceNumber + '&order_id=' + orderId),
                target: '_blank',
                class: 'view',
                data: { configurationValue: 'view' },
                isDefault: defaultRowAction === 'view'
            });

            // Download
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_DOWNLOAD', 'admin_buttons'),
                href: 'request_port.php?module=OrderAdmin&action=downloadPdf&type=invoice' + ('&invoice_number=' + invoiceNumber + '&order_id=' + orderId),
                target: '_blank',
                class: 'download',
                data: { configurationValue: 'download' },
                isDefault: defaultRowAction === 'download'
            });

            // Email
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_EMAIL', 'admin_buttons'),
                class: 'email-invoice',
                data: { configurationValue: 'email-invoice' },
                isDefault: defaultRowAction === 'email-invoice',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Change Status
            if (orderId > 0) {
                jse.libs.button_dropdown.addAction($(this), {
                    text: jse.core.lang.translate('TEXT_GM_STATUS', 'orders'),
                    class: 'change-status',
                    data: { configurationValue: 'change-status' },
                    isDefault: defaultRowAction === 'change-status',
                    callback: function callback(e) {
                        return e.preventDefault();
                    }
                });
            }

            // Cancellation invoice
            if (isCancellationInvoice === false && orderId > 0 && country !== '' && !!data.isPdfCreatorInstalled) {
                jse.libs.button_dropdown.addAction($(this), {
                    text: jse.core.lang.translate('CANCELLATION_INVOICE', 'admin_invoices'),
                    class: 'cancellation-invoice',
                    data: { configurationValue: 'cancellation-invoice' },
                    isDefault: defaultRowAction === 'cancellation-invoice',
                    callback: function callback(e) {
                        return e.preventDefault();
                    }
                });
            }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL292ZXJ2aWV3L2FjdGlvbnMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJfY3JlYXRlQnVsa0FjdGlvbnMiLCIkYnVsa0FjdGlvbnMiLCJkZWZhdWx0QnVsa0FjdGlvbiIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJiaW5kRGVmYXVsdEFjdGlvbiIsImNvcmUiLCJyZWdpc3RyeSIsImdldCIsInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlIiwiYWRkQWN0aW9uIiwidGV4dCIsImxhbmciLCJ0cmFuc2xhdGUiLCJjbGFzcyIsImNvbmZpZ3VyYXRpb25WYWx1ZSIsImlzRGVmYXVsdCIsImNhbGxiYWNrIiwiZSIsInByZXZlbnREZWZhdWx0IiwiaXNQZGZDcmVhdG9ySW5zdGFsbGVkIiwiZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucyIsIl9jcmVhdGVSb3dBY3Rpb25zIiwiZGVmYXVsdFJvd0FjdGlvbiIsImZpbmQiLCJlYWNoIiwicGFyZW50cyIsImludm9pY2VOdW1iZXIiLCJvcmRlcklkIiwiaXNDYW5jZWxsYXRpb25JbnZvaWNlIiwiY291bnRyeSIsImhyZWYiLCJ0YXJnZXQiLCJpbml0IiwiZG9uZSIsIndpbmRvdyIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFNBREosRUFHSSxDQUFDLDRCQUFELEVBQWtDRixHQUFHRyxNQUFyQywyQkFISixFQUtJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSixTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtBLGFBQVNLLGtCQUFULEdBQThCO0FBQzFC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QUFvQixzQkFBckIsRUFIa0M7QUFJeENDLCtCQUFXTyxxQkFBcUIsc0JBSlE7QUFLeENOLDhCQUFVO0FBQUEsK0JBQUtDLEVBQUVDLGNBQUYsRUFBTDtBQUFBO0FBTDhCLGlCQUE1QztBQU9IOztBQUVEdEIsa0JBQU13Qix5QkFBTixDQUFnQyxRQUFoQyxFQUEwQyxLQUExQztBQUNILFNBekREO0FBMERIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTNCLFdBQU91QyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnBDLFVBQUVxQyxNQUFGLEVBQVVDLEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFNO0FBQ3pDdkMsa0JBQU11QyxFQUFOLENBQVMsU0FBVCxFQUFvQmQsaUJBQXBCO0FBQ0FBO0FBQ0F2QjtBQUNILFNBSkQ7O0FBTUFtQztBQUNILEtBUkQ7O0FBVUEsV0FBT3hDLE1BQVA7QUFFSCxDQTdLTCIsImZpbGUiOiJpbnZvaWNlcy9vdmVydmlldy9hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBhY3Rpb25zLmpzIDIwMTktMDItMjZcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIE1haW4gVGFibGUgQWN0aW9uc1xuICpcbiAqIFRoaXMgbW9kdWxlIGNyZWF0ZXMgdGhlIGJ1bGsgYW5kIHJvdyBhY3Rpb25zIGZvciB0aGUgdGFibGUuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnYWN0aW9ucycsXG5cbiAgICBbJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJywgYCR7Z3guc291cmNlfS9saWJzL2J1dHRvbl9kcm9wZG93bmBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIEJ1bGsgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGNhbGxiYWNrIGNhbiBiZSBjYWxsZWQgb25jZSBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUJ1bGtBY3Rpb25zKCkge1xuICAgICAgICAgICAgLy8gQWRkIGFjdGlvbnMgdG8gdGhlIGJ1bGstYWN0aW9uIGRyb3Bkb3duLlxuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zID0gJCgnLmJ1bGstYWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0QnVsa0FjdGlvbiA9ICR0aGlzLmRhdGEoJ2RlZmF1bHRCdWxrQWN0aW9uJykgfHwgJ2J1bGstZW1haWwtaW52b2ljZSc7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5iaW5kRGVmYXVsdEFjdGlvbigkYnVsa0FjdGlvbnMsIGpzZS5jb3JlLnJlZ2lzdHJ5LmdldCgndXNlcklkJyksXG4gICAgICAgICAgICAgICAgJ2ludm9pY2VzT3ZlcnZpZXdCdWxrQWN0aW9uJywganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UpO1xuXG4gICAgICAgICAgICAvLyBFbWFpbFxuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkYnVsa0FjdGlvbnMsIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0VNQUlMJywgJ2FkbWluX2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjbGFzczogJ2J1bGstZW1haWwtaW52b2ljZScsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2J1bGstZW1haWwtaW52b2ljZSd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdidWxrLWVtYWlsLWludm9pY2UnLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENoYW5nZSBzdGF0dXNcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9NVUxUSV9DSEFOR0VfT1JERVJfU1RBVFVTJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnY2hhbmdlLXN0YXR1cycsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2NoYW5nZS1zdGF0dXMnfSxcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnY2hhbmdlLXN0YXR1cycsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRG93bmxvYWQgaW52b2ljZXNcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVTEtfRE9XTkxPQURfSU5WT0lDRVMnLCAnYWRtaW5faW52b2ljZXMnKSxcbiAgICAgICAgICAgICAgICBjbGFzczogJ2J1bGstZG93bmxvYWQtaW52b2ljZScsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2J1bGstZG93bmxvYWQtaW52b2ljZSd9LFxuICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdidWxrLWRvd25sb2FkLWludm9pY2UnLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIENhbmNlbGxhdGlvbiBJbnZvaWNlXG4gICAgICAgICAgICBpZiAoISFkYXRhLmlzUGRmQ3JlYXRvckluc3RhbGxlZCkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdDQU5DRUxMQVRJT05fSU5WT0lDRScsICdhZG1pbl9pbnZvaWNlcycpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2J1bGstY2FuY2VsbGF0aW9uLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnYnVsay1jYW5jZWxsYXRpb24taW52b2ljZSd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnYnVsay1jYW5jZWxsYXRpb24taW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGhpcy5kYXRhdGFibGVfZGVmYXVsdF9hY3Rpb25zKCdlbnN1cmUnLCAnYnVsaycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZSBUYWJsZSBSb3cgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbCB3aXRoIGV2ZXJ5IHRhYmxlIGRyYXcuZHQgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlUm93QWN0aW9ucygpIHtcbiAgICAgICAgICAgIC8vIFJlLWNyZWF0ZSB0aGUgY2hlY2tib3ggd2lkZ2V0cyBhbmQgdGhlIHJvdyBhY3Rpb25zLlxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFJvd0FjdGlvbiA9ICR0aGlzLmRhdGEoJ2RlZmF1bHRSb3dBY3Rpb24nKSB8fCAndmlldyc7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5iaW5kRGVmYXVsdEFjdGlvbigkdGhpcy5maW5kKCcuYnRuLWdyb3VwLmRyb3Bkb3duJyksXG4gICAgICAgICAgICAgICAganNlLmNvcmUucmVnaXN0cnkuZ2V0KCd1c2VySWQnKSwgJ2ludm9pY2VzT3ZlcnZpZXdSb3dBY3Rpb24nLCBqc2UubGlicy51c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5idG4tZ3JvdXAuZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7aW52b2ljZU51bWJlciwgb3JkZXJJZCwgaXNDYW5jZWxsYXRpb25JbnZvaWNlLCBjb3VudHJ5fSA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBWaWV3XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX1NIT1cnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGByZXF1ZXN0X3BvcnQucGhwP21vZHVsZT1PcmRlckFkbWluJmFjdGlvbj1zaG93UGRmJnR5cGU9aW52b2ljZWBcbiAgICAgICAgICAgICAgICAgICAgICAgICsgYCZpbnZvaWNlX251bWJlcj0ke2ludm9pY2VOdW1iZXJ9Jm9yZGVyX2lkPSR7b3JkZXJJZH1gLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3ZpZXcnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAndmlldyd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICd2aWV3J1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gRG93bmxvYWRcbiAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9ET1dOTE9BRCcsICdhZG1pbl9idXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGByZXF1ZXN0X3BvcnQucGhwP21vZHVsZT1PcmRlckFkbWluJmFjdGlvbj1kb3dubG9hZFBkZiZ0eXBlPWludm9pY2VgXG4gICAgICAgICAgICAgICAgICAgICAgICArIGAmaW52b2ljZV9udW1iZXI9JHtpbnZvaWNlTnVtYmVyfSZvcmRlcl9pZD0ke29yZGVySWR9YCxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdkb3dubG9hZCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdkb3dubG9hZCd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdkb3dubG9hZCdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEVtYWlsXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fRU1BSUwnLCAnYWRtaW5fYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2VtYWlsLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnZW1haWwtaW52b2ljZSd9LFxuICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdlbWFpbC1pbnZvaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgU3RhdHVzXG4gICAgICAgICAgICAgICAgaWYgKG9yZGVySWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfR01fU1RBVFVTJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjaGFuZ2Utc3RhdHVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdjaGFuZ2Utc3RhdHVzJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdjaGFuZ2Utc3RhdHVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDYW5jZWxsYXRpb24gaW52b2ljZVxuICAgICAgICAgICAgICAgIGlmIChpc0NhbmNlbGxhdGlvbkludm9pY2UgPT09IGZhbHNlICYmIG9yZGVySWQgPiAwICYmIGNvdW50cnkgIT09ICcnICYmICEhZGF0YS5pc1BkZkNyZWF0b3JJbnN0YWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQ0FOQ0VMTEFUSU9OX0lOVk9JQ0UnLCAnYWRtaW5faW52b2ljZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnY2FuY2VsbGF0aW9uLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2NhbmNlbGxhdGlvbi1pbnZvaWNlJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdjYW5jZWxsYXRpb24taW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHRoaXMuZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucygnZW5zdXJlJywgJ3JvdycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdKU0VOR0lORV9JTklUX0ZJTklTSEVEJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLm9uKCdkcmF3LmR0JywgX2NyZWF0ZVJvd0FjdGlvbnMpO1xuICAgICAgICAgICAgICAgIF9jcmVhdGVSb3dBY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgX2NyZWF0ZUJ1bGtBY3Rpb25zKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG5cbiAgICB9KTtcbiJdfQ==
