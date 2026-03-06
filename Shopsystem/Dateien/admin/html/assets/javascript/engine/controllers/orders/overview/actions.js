'use strict';

/* --------------------------------------------------------------
 actions.js 2019-02-26
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Main Table Actions
 *
 * This module creates the bulk and row actions for the table.
 */
gx.controllers.module('actions', [jse.source + '/vendor/jquery-deparam/jquery-deparam.min.js', 'user_configuration_service', gx.source + '/libs/button_dropdown'], function (data) {

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
        var defaultBulkAction = $this.data('defaultBulkAction') || 'change-status';

        jse.libs.button_dropdown.bindDefaultAction($bulkActions, jse.core.registry.get('userId'), 'ordersOverviewBulkAction', jse.libs.user_configuration_service);

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

        // Cancel
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_MULTI_CANCEL', 'orders'),
            class: 'cancel',
            data: { configurationValue: 'cancel' },
            isDefault: defaultBulkAction === 'cancel',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        // Send order confirmation.
        jse.libs.button_dropdown.addAction($bulkActions, {
            text: jse.core.lang.translate('BUTTON_MULTI_SEND_ORDER', 'orders'),
            class: 'bulk-email-order',
            data: { configurationValue: 'bulk-email-order' },
            isDefault: defaultBulkAction === 'bulk-email-order',
            callback: function callback(e) {
                return e.preventDefault();
            }
        });

        if (data.isPdfCreatorInstalled === 1) {
            if (data.invoicesGranted) {
                // Send invoice.
                jse.libs.button_dropdown.addAction($bulkActions, {
                    text: jse.core.lang.translate('BUTTON_MULTI_SEND_INVOICE', 'orders'),
                    class: 'bulk-email-invoice',
                    data: { configurationValue: 'bulk-email-invoice' },
                    isDefault: defaultBulkAction === 'bulk-email-invoice',
                    callback: function callback(e) {
                        return e.preventDefault();
                    }
                });

                // Download invoices.
                jse.libs.button_dropdown.addAction($bulkActions, {
                    text: jse.core.lang.translate('TITLE_DOWNLOAD_INVOICES', 'orders'),
                    class: 'bulk-download-invoice',
                    data: { configurationValue: 'bulk-download-invoice' },
                    isDefault: defaultBulkAction === 'bulk-download-invoice',
                    callback: function callback(e) {
                        return e.preventDefault();
                    }
                });

                // Download packing slips.
                jse.libs.button_dropdown.addAction($bulkActions, {
                    text: jse.core.lang.translate('TITLE_DOWNLOAD_PACKINGSLIP', 'orders'),
                    class: 'bulk-download-packing-slip',
                    data: { configurationValue: 'bulk-download-packing-slip' },
                    isDefault: defaultBulkAction === 'bulk-download-packing-slip',
                    callback: function callback(e) {
                        return e.preventDefault();
                    }
                });
            }
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
        var defaultRowAction = $this.data('defaultRowAction') || 'edit';

        jse.libs.button_dropdown.bindDefaultAction($this.find('.btn-group.dropdown'), jse.core.registry.get('userId'), 'ordersOverviewRowAction', jse.libs.user_configuration_service);

        $this.find('.btn-group.dropdown').each(function () {
            var orderId = $(this).parents('tr').data('id');
            var editUrl = 'orders.php?' + $.param({
                oID: orderId,
                action: 'edit',
                overview: $.deparam(window.location.search.slice(1))
            });

            // Edit
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TEXT_SHOW', 'orders'),
                href: editUrl,
                class: 'edit',
                data: { configurationValue: 'edit' },
                isDefault: defaultRowAction === 'edit'
            });

            // Change Status
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TEXT_GM_STATUS', 'orders'),
                class: 'change-status',
                data: { configurationValue: 'change-status' },
                isDefault: defaultRowAction === 'change-status',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            // Cancel
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('BUTTON_GM_CANCEL', 'orders'),
                class: 'cancel',
                data: { configurationValue: 'cancel' },
                isDefault: defaultRowAction === 'cancel',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });
            if (data.isPdfCreatorInstalled === 1) {
                if (data.invoicesGranted) {
                    // Email Invoice
                    jse.libs.button_dropdown.addAction($(this), {
                        text: jse.core.lang.translate('TITLE_INVOICE_MAIL', 'orders'),
                        class: 'email-invoice',
                        data: { configurationValue: 'email-invoice' },
                        isDefault: defaultRowAction === 'email-invoice',
                        callback: function callback(e) {
                            return e.preventDefault();
                        }
                    });

                    if (data.hasInvoices === undefined) {
                        // Create Invoice
                        jse.libs.button_dropdown.addAction($(this), {
                            text: jse.core.lang.translate('TITLE_CREATE_INVOICE', 'orders'),
                            href: 'gm_pdf_order.php?oID=' + orderId + '&type=invoice',
                            target: '_blank',
                            class: 'create-invoice',
                            data: { configurationValue: 'create-invoice' },
                            isDefault: defaultRowAction === 'create-invoice',
                            callback: function callback(e) {
                                return e.preventDefault();
                            }
                        });
                    } else if (orderId in data.hasInvoices) {
                        // Show Invoice
                        jse.libs.button_dropdown.addAction($(this), {
                            text: jse.core.lang.translate('TITLE_SHOW_INVOICE', 'orders'),
                            class: 'show-invoice',
                            data: { configurationValue: 'show-invoice' },
                            isDefault: defaultRowAction === 'show-invoice',
                            callback: function callback(e) {
                                return e.preventDefault();
                            }
                        });
                    } else {
                        // Create Invoice
                        jse.libs.button_dropdown.addAction($(this), {
                            text: jse.core.lang.translate('TITLE_CREATE_INVOICE', 'orders'),
                            href: 'gm_pdf_order.php?oID=' + orderId + '&type=invoice',
                            target: '_blank',
                            class: 'create-invoice',
                            data: { configurationValue: 'create-invoice' },
                            isDefault: defaultRowAction === 'create-invoice',
                            callback: function callback(e) {
                                return e.preventDefault();
                            }
                        });
                    }

                    if (data.hasPackingSlips === undefined || !(orderId in data.hasPackingSlips)) {
                        // Create Packing Slip
                        jse.libs.button_dropdown.addAction($(this), {
                            text: jse.core.lang.translate('TITLE_CREATE_PACKINGSLIP', 'orders'),
                            href: 'gm_pdf_order.php?oID=' + orderId + '&type=packingslip',
                            target: '_blank',
                            class: 'packing-slip',
                            data: { configurationValue: 'packing-slip' },
                            isDefault: defaultRowAction === 'packing-slip'
                        });
                    } else {
                        // Show Packing Slip
                        jse.libs.button_dropdown.addAction($(this), {
                            text: jse.core.lang.translate('TITLE_SHOW_PACKINGSLIP', 'orders'),
                            class: 'show-packing-slip',
                            data: { configurationValue: 'show-packing-slip' },
                            isDefault: defaultRowAction === 'show-packing-slip',
                            callback: function callback(e) {
                                return e.preventDefault();
                            }
                        });
                    }
                }
            }

            // Show Order Acceptance
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TITLE_ORDER', 'orders'),
                href: 'gm_send_order.php?oID=' + orderId + '&type=order',
                target: '_blank',
                class: 'show-acceptance',
                data: { configurationValue: 'show-acceptance' },
                isDefault: defaultRowAction === 'show-acceptance'
            });

            // Recreate Order Acceptance
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TITLE_RECREATE_ORDER', 'orders'),
                href: 'gm_send_order.php?oID=' + orderId + '&type=recreate_order',
                target: '_blank',
                class: 'recreate-order-acceptance',
                data: { configurationValue: 'recreate-order-acceptance' },
                isDefault: defaultRowAction === 'recreate-order-acceptance'
            });

            // Email Order
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TITLE_SEND_ORDER', 'orders'),
                class: 'email-order',
                data: { configurationValue: 'email-order' },
                isDefault: defaultRowAction === 'email-order',
                callback: function callback(e) {
                    return e.preventDefault();
                }
            });

            if (data.withdrawalsGranted) {
                // Create Withdrawal
                jse.libs.button_dropdown.addAction($(this), {
                    text: jse.core.lang.translate('TEXT_CREATE_WITHDRAWAL', 'orders'),
                    href: '../withdrawal.php?order_id=' + orderId,
                    target: '_blank',
                    class: 'create-withdrawal',
                    data: { configurationValue: 'create-withdrawal' },
                    isDefault: defaultRowAction === 'create-withdrawal'
                });
            }

            // Add Tracking Code
            jse.libs.button_dropdown.addAction($(this), {
                text: jse.core.lang.translate('TXT_PARCEL_TRACKING_SENDBUTTON_TITLE', 'parcel_services'),
                class: 'add-tracking-number',
                data: { configurationValue: 'add-tracking-number' },
                isDefault: defaultRowAction === 'add-tracking-number',
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
            // If there is only a singular item, data.hasInvoices automatically becomes an array,
            // if there is more, it becomes a string(as this is an edge case, since arrays are
            // not natively supported by this implementation) so this is a fix for that scenario.
            if (typeof data.hasInvoices === 'string' && data.hasInvoices !== '') {
                data.hasInvoices = data.hasInvoices.replace(/\\/g, "");
                data.hasInvoices = JSON.parse(data.hasInvoices);
            }

            if (typeof data.hasPackingSlips === 'string' && data.hasPackingSlips !== '') {
                data.hasPackingSlips = data.hasPackingSlips.replace(/\\/g, "");
                data.hasPackingSlips = JSON.parse(data.hasPackingSlips);
            }

            $this.on('draw.dt', _createRowActions);
            _createRowActions();
            _createBulkActions();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vdmVydmlldy9hY3Rpb25zLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiX2NyZWF0ZUJ1bGtBY3Rpb25zIiwiJGJ1bGtBY3Rpb25zIiwiZGVmYXVsdEJ1bGtBY3Rpb24iLCJsaWJzIiwiYnV0dG9uX2Ryb3Bkb3duIiwiYmluZERlZmF1bHRBY3Rpb24iLCJjb3JlIiwicmVnaXN0cnkiLCJnZXQiLCJ1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSIsImFkZEFjdGlvbiIsInRleHQiLCJsYW5nIiwidHJhbnNsYXRlIiwiY2xhc3MiLCJjb25maWd1cmF0aW9uVmFsdWUiLCJpc0RlZmF1bHQiLCJjYWxsYmFjayIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImlzUGRmQ3JlYXRvckluc3RhbGxlZCIsImludm9pY2VzR3JhbnRlZCIsImRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMiLCJfY3JlYXRlUm93QWN0aW9ucyIsImRlZmF1bHRSb3dBY3Rpb24iLCJmaW5kIiwiZWFjaCIsIm9yZGVySWQiLCJwYXJlbnRzIiwiZWRpdFVybCIsInBhcmFtIiwib0lEIiwiYWN0aW9uIiwib3ZlcnZpZXciLCJkZXBhcmFtIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJzbGljZSIsImhyZWYiLCJoYXNJbnZvaWNlcyIsInVuZGVmaW5lZCIsInRhcmdldCIsImhhc1BhY2tpbmdTbGlwcyIsIndpdGhkcmF3YWxzR3JhbnRlZCIsImluaXQiLCJkb25lIiwib24iLCJyZXBsYWNlIiwiSlNPTiIsInBhcnNlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFNBREosRUFHSSxDQUNPQyxJQUFJQyxNQURYLG1EQUVJLDRCQUZKLEVBR09KLEdBQUdJLE1BSFYsMkJBSEosRUFTSSxVQUFVQyxJQUFWLEVB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QyxlQUFMLEdBQXVCTSxLQUFLQyxLQUFMLENBQVdyRCxLQUFLOEMsZUFBaEIsQ0FBdkI7QUFDQTs7QUFFRTdDLGtCQUFNaUQsRUFBTixDQUFTLFNBQVQsRUFBb0J4QixpQkFBcEI7QUFDQUE7QUFDQXZCO0FBQ0gsU0FqQkQ7O0FBbUJBOEM7QUFDSCxLQXJCRDs7QUF1QkEsV0FBT3BELE1BQVA7QUFFSCxDQWxUTCIsImZpbGUiOiJvcmRlcnMvb3ZlcnZpZXcvYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWN0aW9ucy5qcyAyMDE5LTAyLTI2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBNYWluIFRhYmxlIEFjdGlvbnNcbiAqXG4gKiBUaGlzIG1vZHVsZSBjcmVhdGVzIHRoZSBidWxrIGFuZCByb3cgYWN0aW9ucyBmb3IgdGhlIHRhYmxlLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2FjdGlvbnMnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvanF1ZXJ5LWRlcGFyYW0vanF1ZXJ5LWRlcGFyYW0ubWluLmpzYCxcbiAgICAgICAgJ3VzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL2J1dHRvbl9kcm9wZG93bmBcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlIEJ1bGsgQWN0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGNhbGxiYWNrIGNhbiBiZSBjYWxsZWQgb25jZSBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZUJ1bGtBY3Rpb25zKCkge1xuICAgICAgICAgICAgLy8gQWRkIGFjdGlvbnMgdG8gdGhlIGJ1bGstYWN0aW9uIGRyb3Bkb3duLlxuICAgICAgICAgICAgY29uc3QgJGJ1bGtBY3Rpb25zID0gJCgnLmJ1bGstYWN0aW9uJyk7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0QnVsa0FjdGlvbiA9ICR0aGlzLmRhdGEoJ2RlZmF1bHRCdWxrQWN0aW9uJykgfHwgJ2NoYW5nZS1zdGF0dXMnO1xuXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYmluZERlZmF1bHRBY3Rpb24oJGJ1bGtBY3Rpb25zLCBqc2UuY29yZS5yZWdpc3RyeS5nZXQoJ3VzZXJJZCcpLFxuICAgICAgICAgICAgICAgICdvcmRlcnNPdmVydmlld0J1bGtBY3Rpb24nLCBqc2UubGlicy51c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSk7XG5cbiAgICAgICAgICAgIC8vIENoYW5nZSBzdGF0dXNcbiAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9NVUxUSV9DSEFOR0VfT1JERVJfU1RBVFVTJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnY2hhbmdlLXN0YXR1cycsXG4gICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2NoYW5nZS1zdGF0dXMnfSxcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnY2hhbmdlLXN0YXR1cycsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ2FuY2VsXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fTVVMVElfQ0FOQ0VMJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgIGNsYXNzOiAnY2FuY2VsJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnY2FuY2VsJ30sXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0QnVsa0FjdGlvbiA9PT0gJ2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gU2VuZCBvcmRlciBjb25maXJtYXRpb24uXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fTVVMVElfU0VORF9PUkRFUicsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICBjbGFzczogJ2J1bGstZW1haWwtb3JkZXInLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdidWxrLWVtYWlsLW9yZGVyJ30sXG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0QnVsa0FjdGlvbiA9PT0gJ2J1bGstZW1haWwtb3JkZXInLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLmlzUGRmQ3JlYXRvckluc3RhbGxlZCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmludm9pY2VzR3JhbnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZW5kIGludm9pY2UuXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJGJ1bGtBY3Rpb25zLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX01VTFRJX1NFTkRfSU5WT0lDRScsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnYnVsay1lbWFpbC1pbnZvaWNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdidWxrLWVtYWlsLWludm9pY2UnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdEJ1bGtBY3Rpb24gPT09ICdidWxrLWVtYWlsLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERvd25sb2FkIGludm9pY2VzLlxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCRidWxrQWN0aW9ucywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RJVExFX0RPV05MT0FEX0lOVk9JQ0VTJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdidWxrLWRvd25sb2FkLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2J1bGstZG93bmxvYWQtaW52b2ljZSd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0QnVsa0FjdGlvbiA9PT0gJ2J1bGstZG93bmxvYWQtaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRG93bmxvYWQgcGFja2luZyBzbGlwcy5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkYnVsa0FjdGlvbnMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUSVRMRV9ET1dOTE9BRF9QQUNLSU5HU0xJUCcsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnYnVsay1kb3dubG9hZC1wYWNraW5nLXNsaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2J1bGstZG93bmxvYWQtcGFja2luZy1zbGlwJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRCdWxrQWN0aW9uID09PSAnYnVsay1kb3dubG9hZC1wYWNraW5nLXNsaXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHRoaXMuZGF0YXRhYmxlX2RlZmF1bHRfYWN0aW9ucygnZW5zdXJlJywgJ2J1bGsnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGUgVGFibGUgUm93IEFjdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGwgd2l0aCBldmVyeSB0YWJsZSBkcmF3LmR0IGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2NyZWF0ZVJvd0FjdGlvbnMoKSB7XG4gICAgICAgICAgICAvLyBSZS1jcmVhdGUgdGhlIGNoZWNrYm94IHdpZGdldHMgYW5kIHRoZSByb3cgYWN0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRSb3dBY3Rpb24gPSAkdGhpcy5kYXRhKCdkZWZhdWx0Um93QWN0aW9uJykgfHwgJ2VkaXQnO1xuXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYmluZERlZmF1bHRBY3Rpb24oJHRoaXMuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLFxuICAgICAgICAgICAgICAgIGpzZS5jb3JlLnJlZ2lzdHJ5LmdldCgndXNlcklkJyksICdvcmRlcnNPdmVydmlld1Jvd0FjdGlvbicsIGpzZS5saWJzLnVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlKTtcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmJ0bi1ncm91cC5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9yZGVySWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlZGl0VXJsID0gJ29yZGVycy5waHA/JyArICQucGFyYW0oe1xuICAgICAgICAgICAgICAgICAgICBvSUQ6IG9yZGVySWQsXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2VkaXQnLFxuICAgICAgICAgICAgICAgICAgICBvdmVydmlldzogJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc2xpY2UoMSkpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBFZGl0XG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX1NIT1cnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGVkaXRVcmwsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnZWRpdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdlZGl0J30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ2VkaXQnXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGFuZ2UgU3RhdHVzXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0dNX1NUQVRVUycsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjaGFuZ2Utc3RhdHVzJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2NoYW5nZS1zdGF0dXMnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnY2hhbmdlLXN0YXR1cycsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FuY2VsXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fR01fQ0FOQ0VMJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2NhbmNlbCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdjYW5jZWwnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnY2FuY2VsJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuaXNQZGZDcmVhdG9ySW5zdGFsbGVkID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmludm9pY2VzR3JhbnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW1haWwgSW52b2ljZVxuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RJVExFX0lOVk9JQ0VfTUFJTCcsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2VtYWlsLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdlbWFpbC1pbnZvaWNlJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnZW1haWwtaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaGFzSW52b2ljZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBJbnZvaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUSVRMRV9DUkVBVEVfSU5WT0lDRScsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogYGdtX3BkZl9vcmRlci5waHA/b0lEPSR7b3JkZXJJZH0mdHlwZT1pbnZvaWNlYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjcmVhdGUtaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdjcmVhdGUtaW52b2ljZSd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdjcmVhdGUtaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcmRlcklkIGluIGRhdGEuaGFzSW52b2ljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTaG93IEludm9pY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24uYWRkQWN0aW9uKCQodGhpcyksIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RJVExFX1NIT1dfSU5WT0lDRScsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdzaG93LWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnc2hvdy1pbnZvaWNlJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ3Nob3ctaW52b2ljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBlID0+IGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgSW52b2ljZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfQ1JFQVRFX0lOVk9JQ0UnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IGBnbV9wZGZfb3JkZXIucGhwP29JRD0ke29yZGVySWR9JnR5cGU9aW52b2ljZWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ19ibGFuaycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnY3JlYXRlLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7Y29uZmlndXJhdGlvblZhbHVlOiAnY3JlYXRlLWludm9pY2UnfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnY3JlYXRlLWludm9pY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmhhc1BhY2tpbmdTbGlwcyA9PT0gdW5kZWZpbmVkIHx8ICEob3JkZXJJZCBpbiBkYXRhLmhhc1BhY2tpbmdTbGlwcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBQYWNraW5nIFNsaXBcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUSVRMRV9DUkVBVEVfUEFDS0lOR1NMSVAnLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogYGdtX3BkZl9vcmRlci5waHA/b0lEPSR7b3JkZXJJZH0mdHlwZT1wYWNraW5nc2xpcGAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3BhY2tpbmctc2xpcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3BhY2tpbmctc2xpcCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ3BhY2tpbmctc2xpcCdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2hvdyBQYWNraW5nIFNsaXBcblx0ICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfU0hPV19QQUNLSU5HU0xJUCcsICdvcmRlcnMnKSxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnc2hvdy1wYWNraW5nLXNsaXAnLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3Nob3ctcGFja2luZy1zbGlwJ30sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHQ6IGRlZmF1bHRSb3dBY3Rpb24gPT09ICdzaG93LXBhY2tpbmctc2xpcCcsXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcblx0ICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2hvdyBPcmRlciBBY2NlcHRhbmNlXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUSVRMRV9PUkRFUicsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgaHJlZjogYGdtX3NlbmRfb3JkZXIucGhwP29JRD0ke29yZGVySWR9JnR5cGU9b3JkZXJgLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Nob3ctYWNjZXB0YW5jZScsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdzaG93LWFjY2VwdGFuY2UnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnc2hvdy1hY2NlcHRhbmNlJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVjcmVhdGUgT3JkZXIgQWNjZXB0YW5jZVxuICAgICAgICAgICAgICAgIGpzZS5saWJzLmJ1dHRvbl9kcm9wZG93bi5hZGRBY3Rpb24oJCh0aGlzKSwge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVElUTEVfUkVDUkVBVEVfT1JERVInLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgICAgIGhyZWY6IGBnbV9zZW5kX29yZGVyLnBocD9vSUQ9JHtvcmRlcklkfSZ0eXBlPXJlY3JlYXRlX29yZGVyYCxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAnX2JsYW5rJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdyZWNyZWF0ZS1vcmRlci1hY2NlcHRhbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ3JlY3JlYXRlLW9yZGVyLWFjY2VwdGFuY2UnfSxcbiAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAncmVjcmVhdGUtb3JkZXItYWNjZXB0YW5jZSdcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEVtYWlsIE9yZGVyXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUSVRMRV9TRU5EX09SREVSJywgJ29yZGVycycpLFxuICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2VtYWlsLW9yZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge2NvbmZpZ3VyYXRpb25WYWx1ZTogJ2VtYWlsLW9yZGVyJ30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ2VtYWlsLW9yZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGUgPT4gZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS53aXRoZHJhd2Fsc0dyYW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIFdpdGhkcmF3YWxcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVEVYVF9DUkVBVEVfV0lUSERSQVdBTCcsICdvcmRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IGAuLi93aXRoZHJhd2FsLnBocD9vcmRlcl9pZD0ke29yZGVySWR9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldDogJ19ibGFuaycsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2NyZWF0ZS13aXRoZHJhd2FsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdjcmVhdGUtd2l0aGRyYXdhbCd9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNEZWZhdWx0OiBkZWZhdWx0Um93QWN0aW9uID09PSAnY3JlYXRlLXdpdGhkcmF3YWwnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFkZCBUcmFja2luZyBDb2RlXG4gICAgICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLmFkZEFjdGlvbigkKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdUWFRfUEFSQ0VMX1RSQUNLSU5HX1NFTkRCVVRUT05fVElUTEUnLCAncGFyY2VsX3NlcnZpY2VzJyksXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnYWRkLXRyYWNraW5nLW51bWJlcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtjb25maWd1cmF0aW9uVmFsdWU6ICdhZGQtdHJhY2tpbmctbnVtYmVyJ30sXG4gICAgICAgICAgICAgICAgICAgIGlzRGVmYXVsdDogZGVmYXVsdFJvd0FjdGlvbiA9PT0gJ2FkZC10cmFja2luZy1udW1iZXInLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZSA9PiBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICR0aGlzLmRhdGF0YWJsZV9kZWZhdWx0X2FjdGlvbnMoJ2Vuc3VyZScsICdyb3cnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICQod2luZG93KS5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBvbmx5IGEgc2luZ3VsYXIgaXRlbSwgZGF0YS5oYXNJbnZvaWNlcyBhdXRvbWF0aWNhbGx5IGJlY29tZXMgYW4gYXJyYXksXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbW9yZSwgaXQgYmVjb21lcyBhIHN0cmluZyhhcyB0aGlzIGlzIGFuIGVkZ2UgY2FzZSwgc2luY2UgYXJyYXlzIGFyZVxuICAgICAgICAgICAgICAgIC8vIG5vdCBuYXRpdmVseSBzdXBwb3J0ZWQgYnkgdGhpcyBpbXBsZW1lbnRhdGlvbikgc28gdGhpcyBpcyBhIGZpeCBmb3IgdGhhdCBzY2VuYXJpby5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEuaGFzSW52b2ljZXMgPT09ICdzdHJpbmcnICYmIGRhdGEuaGFzSW52b2ljZXMgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaGFzSW52b2ljZXMgPSBkYXRhLmhhc0ludm9pY2VzLnJlcGxhY2UoL1xcXFwvZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuaGFzSW52b2ljZXMgPSBKU09OLnBhcnNlKGRhdGEuaGFzSW52b2ljZXMpO1xuICAgICAgICAgICAgICAgIH1cblx0XG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5oYXNQYWNraW5nU2xpcHMgPT09ICdzdHJpbmcnICYmIGRhdGEuaGFzUGFja2luZ1NsaXBzICE9PSAnJykge1xuXHRcdCAgICAgICAgICAgIGRhdGEuaGFzUGFja2luZ1NsaXBzID0gZGF0YS5oYXNQYWNraW5nU2xpcHMucmVwbGFjZSgvXFxcXC9nLCBcIlwiKTtcblx0ICAgICAgICAgICAgXHRkYXRhLmhhc1BhY2tpbmdTbGlwcyA9IEpTT04ucGFyc2UoZGF0YS5oYXNQYWNraW5nU2xpcHMpO1xuXHQgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJHRoaXMub24oJ2RyYXcuZHQnLCBfY3JlYXRlUm93QWN0aW9ucyk7XG4gICAgICAgICAgICAgICAgX2NyZWF0ZVJvd0FjdGlvbnMoKTtcbiAgICAgICAgICAgICAgICBfY3JlYXRlQnVsa0FjdGlvbnMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcblxuICAgIH0pO1xuIl19
