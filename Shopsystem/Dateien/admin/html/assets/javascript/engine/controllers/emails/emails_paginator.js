'use strict';

/* --------------------------------------------------------------
 emails_paginator.js 2022-05-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Emails Paginator Controller
 *
 * This controller will handle the main table paginator operations of the admin/emails page.
 *
 * @module Controllers/emails_paginator
 */
gx.controllers.module('emails_paginator', [gx.source + '/libs/emails', gx.source + '/libs/button_dropdown', 'loading_spinner', 'modal'],

/** @lends module:Controllers/emails_paginator */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Table Selector
     *
     * @type {object}
     */
    $table = $('#emails-table'),


    /**
     * Attachments Size Selector
     *
     * @type {object}
     */
    $attachmentsSize = $('#attachments-size'),


    /**
     * Default Module Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Module Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Refresh page data.
     *
     * @param {object} event Contains event information.
     */
    var _onRefreshData = function _onRefreshData(event) {
        $table.DataTable().ajax.reload();
    };

    /**
     * Change current page length.
     *
     * @param {object} event Contains the event data.
     */
    var _onTableLengthChange = function _onTableLengthChange(event) {
        var length = $this.find('#display-records').val();
        $table.DataTable().page.len(length).draw();
    };

    /**
     * Open handle attachments modal window.
     *
     * @param {object} event Contains event information.
     */
    var _onHandleAttachments = function _onHandleAttachments(event) {
        var $attachmentsModal = $('#attachments-modal');

        // Get current attachments size.
        jse.libs.emails.getAttachmentsSize($attachmentsSize);

        // Reset modal state.
        $attachmentsModal.find('#removal-date').val('').datepicker({
            maxDate: new Date()
        });
        $(document).find('.ui-datepicker').not('.gx-container').addClass('gx-container');

        // Display modal to the user.
        $attachmentsModal.dialog({
            title: jse.core.lang.translate('handle_attachments', 'emails'),
            width: 400,
            modal: true,
            dialogClass: 'gx-container',
            closeOnEscape: true
        });

        $('#close-modal').on('click', function () {
            $($attachmentsModal).dialog('close');
        });
    };

    /**
     * Open handle attachments modal window.
     *
     * @param {object} event Contains event information.
     */
    var _onHandleOldEmails = function _onHandleOldEmails(event) {
        var $deleteOldEmailsModal = $('#delete-old-emails-modal');

        // Reset modal state.
        $deleteOldEmailsModal.find('#email-removal-date').val('').datepicker({
            maxDate: new Date()
        });
        $(document).find('.ui-datepicker').not('.gx-container').addClass('gx-container');

        // Display modal to the user.
        $deleteOldEmailsModal.dialog({
            title: jse.core.lang.translate('handle_old_emails', 'emails'),
            width: 400,
            modal: true,
            dialogClass: 'gx-container',
            closeOnEscape: true
        });

        $('#close-old-email-modal').on('click', function () {
            $($deleteOldEmailsModal).dialog('close');
        });
    };

    /**
     * Execute the delete operation for the selected email records.
     *
     * @param {object} event Contains the event information.
     */
    var _onBulkDelete = function _onBulkDelete(event) {
        // Check if there are table rows selected.
        if ($table.find('tr td input:checked').length === 0 || $('#bulk-action').val() === '') {
            return; // No selected records, exit method.
        }

        // Get selected rows data - create a new email collection.
        var collection = jse.libs.emails.getSelectedEmails($table);

        // Display confirmation modal to the user.
        jse.libs.modal.message({
            title: jse.core.lang.translate('bulk_action', 'admin_labels'),
            content: jse.core.lang.translate('prompt_delete_collection', 'emails'),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    jse.libs.emails.deleteCollection(collection).done(function (response) {
                        $table.DataTable().ajax.reload();
                    }).fail(function (response) {
                        var title = jse.core.lang.translate('error', 'messages');

                        jse.libs.modal.message({
                            title: title,
                            content: response.message
                        });
                    });

                    $(this).dialog('close');
                    $table.find('input[type=checkbox]').prop('checked', false);
                }
            }]
        });
    };

    /**
     * Execute the send operation for the selected email records.
     *
     * @param {object} event Contains the event information.
     */
    var _onBulkSend = function _onBulkSend(event) {
        // Check if there are table rows selected.
        if ($table.find('tr td input:checked').length === 0 || $('#bulk-action').val() === '') {
            return; // No selected records, exit method.
        }

        // Get selected rows data - create a new email collection.
        var collection = jse.libs.emails.getSelectedEmails($table);

        // Display confirmation modal to the user.
        jse.libs.modal.message({
            title: jse.core.lang.translate('bulk_action', 'admin_labels'),
            content: jse.core.lang.translate('prompt_send_collection', 'emails'),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    jse.libs.emails.sendCollection(collection).done(function (response) {
                        $table.DataTable().ajax.reload();
                    }).fail(function (response) {
                        var title = jse.core.lang.translate('error', 'messages');

                        jse.libs.modal.message({
                            title: title,
                            content: response.message
                        });
                    });

                    $(this).dialog('close');
                    $table.find('input[type=checkbox]').prop('checked', false);
                }
            }]
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        // Bind paginator event handlers.
        $this.on('click', '#refresh-table', _onRefreshData).on('change', '#display-records', _onTableLengthChange);
        $('body').on('click', '#handle-attachments', _onHandleAttachments);
        $('body').on('click', '#handle-old-emails', _onHandleOldEmails);

        var $dropdown = $this.find('.bulk-action');
        jse.libs.button_dropdown.mapAction($dropdown, 'bulk_send_selected', 'emails', _onBulkSend);
        jse.libs.button_dropdown.mapAction($dropdown, 'bulk_delete_selected', 'emails', _onBulkDelete);

        done();
    };

    // Return module object to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy9lbWFpbHNfcGFnaW5hdG9yLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJHRhYmxlIiwiJGF0dGFjaG1lbnRzU2l6ZSIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9vblJlZnJlc2hEYXRhIiwiZXZlbnQiLCJEYXRhVGFibGUiLCJhamF4IiwicmVsb2FkIiwiX29uVGFibGVMZW5ndGhDaGFuZ2UiLCJsZW5ndGgiLCJmaW5kIiwidmFsIiwicGFnZSIsImxlbiIsImRyYXciLCJfb25IYW5kbGVBdHRhY2htZW50cyIsIiRhdHRhY2htZW50c01vZGFsIiwianNlIiwibGlicyIsImVtYWlscyIsImdldEF0dGFjaG1lbnRzU2l6ZSIsImRhdGVwaWNrZXIiLCJtYXhEYXRlIiwiRGF0ZSIsImRvY3VtZW50Iiwibm90IiwiYWRkQ2xhc3MiLCJkaWFsb2ciLCJ0aXRsZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwid2lkdGgiLCJtb2RhbCIsImRpYWxvZ0NsYXNzIiwiY2xvc2VPbkVzY2FwZSIsIm9uIiwiX29uSGFuZGxlT2xkRW1haWxzIiwiJGRlbGV0ZU9sZEVtYWlsc01vZGFsIiwiX29uQnVsa0RlbGV0ZSIsImNvbGxlY3Rpb24iLCJnZXRTZWxlY3RlZEVtYWlscyIsIm1lc3NhZ2UiLCJjb250ZW50IiwiYnV0dG9ucyIsInRleHQiLCJjbGljayIsImRlbGV0ZUNvbGxlY3Rpb24iLCJkb25lIiwicmVzcG9uc2UiLCJmYWlsIiwicHJvcCIsIl9vbkJ1bGtTZW5kIiwic2VuZENvbGxlY3Rpb24iLCJpbml0IiwiJGRyb3Bkb3duIiwiYnV0dG9uX2Ryb3Bkb3duIiwibWFwQWN0aW9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksa0JBREosRUFHSSxDQUNJRixHQUFHRyxN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cEMsQ0FBeUMsU0FBekMsRUFBb0QsS0FBcEQ7QUFDSDtBQWxCTCxhQVBLO0FBSFUsU0FBdkI7QUFnQ0gsS0ExQ0Q7O0FBNENBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0ExRCxXQUFPNkQsSUFBUCxHQUFjLFVBQVVOLElBQVYsRUFBZ0I7QUFDMUI7QUFDQXBELGNBQ0t3QyxFQURMLENBQ1EsT0FEUixFQUNpQixnQkFEakIsRUFDbUNqQyxjQURuQyxFQUVLaUMsRUFGTCxDQUVRLFFBRlIsRUFFa0Isa0JBRmxCLEVBRXNDNUIsb0JBRnRDO0FBR0FYLFVBQUUsTUFBRixFQUNLdUMsRUFETCxDQUNRLE9BRFIsRUFDaUIscUJBRGpCLEVBQ3dDckIsb0JBRHhDO0FBRUFsQixVQUFFLE1BQUYsRUFDS3VDLEVBREwsQ0FDUSxPQURSLEVBQ2lCLG9CQURqQixFQUN1Q0Msa0JBRHZDOztBQUdBLFlBQUlrQixZQUFZM0QsTUFBTWMsSUFBTixDQUFXLGNBQVgsQ0FBaEI7QUFDQU8sWUFBSUMsSUFBSixDQUFTc0MsZUFBVCxDQUF5QkMsU0FBekIsQ0FBbUNGLFNBQW5DLEVBQThDLG9CQUE5QyxFQUFvRSxRQUFwRSxFQUE4RUgsV0FBOUU7QUFDQW5DLFlBQUlDLElBQUosQ0FBU3NDLGVBQVQsQ0FBeUJDLFNBQXpCLENBQW1DRixTQUFuQyxFQUE4QyxzQkFBOUMsRUFBc0UsUUFBdEUsRUFBZ0ZoQixhQUFoRjs7QUFFQVM7QUFDSCxLQWZEOztBQWlCQTtBQUNBLFdBQU92RCxNQUFQO0FBQ0gsQ0E3UUwiLCJmaWxlIjoiZW1haWxzL2VtYWlsc19wYWdpbmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGVtYWlsc19wYWdpbmF0b3IuanMgMjAyMi0wNS0xNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjIgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRW1haWxzIFBhZ2luYXRvciBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIHdpbGwgaGFuZGxlIHRoZSBtYWluIHRhYmxlIHBhZ2luYXRvciBvcGVyYXRpb25zIG9mIHRoZSBhZG1pbi9lbWFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL2VtYWlsc19wYWdpbmF0b3JcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdlbWFpbHNfcGFnaW5hdG9yJyxcblxuICAgIFtcbiAgICAgICAgZ3guc291cmNlICsgJy9saWJzL2VtYWlscycsXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9idXR0b25fZHJvcGRvd24nLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJyxcbiAgICAgICAgJ21vZGFsJ1xuICAgIF0sXG5cbiAgICAvKiogQGxlbmRzIG1vZHVsZTpDb250cm9sbGVycy9lbWFpbHNfcGFnaW5hdG9yICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUYWJsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0YWJsZSA9ICQoJyNlbWFpbHMtdGFibGUnKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBdHRhY2htZW50cyBTaXplIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGF0dGFjaG1lbnRzU2l6ZSA9ICQoJyNhdHRhY2htZW50cy1zaXplJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgTW9kdWxlIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEVWRU5UIEhBTkRMRVJTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWZyZXNoIHBhZ2UgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vblJlZnJlc2hEYXRhID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAkdGFibGUuRGF0YVRhYmxlKCkuYWpheC5yZWxvYWQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhbmdlIGN1cnJlbnQgcGFnZSBsZW5ndGguXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyB0aGUgZXZlbnQgZGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25UYWJsZUxlbmd0aENoYW5nZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9ICR0aGlzLmZpbmQoJyNkaXNwbGF5LXJlY29yZHMnKS52YWwoKTtcbiAgICAgICAgICAgICR0YWJsZS5EYXRhVGFibGUoKS5wYWdlLmxlbihsZW5ndGgpLmRyYXcoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBoYW5kbGUgYXR0YWNobWVudHMgbW9kYWwgd2luZG93LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uSGFuZGxlQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkYXR0YWNobWVudHNNb2RhbCA9ICQoJyNhdHRhY2htZW50cy1tb2RhbCcpO1xuICAgIFxuICAgICAgICAgICAgLy8gR2V0IGN1cnJlbnQgYXR0YWNobWVudHMgc2l6ZS5cbiAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5nZXRBdHRhY2htZW50c1NpemUoJGF0dGFjaG1lbnRzU2l6ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFJlc2V0IG1vZGFsIHN0YXRlLlxuICAgICAgICAgICAgJGF0dGFjaG1lbnRzTW9kYWwuZmluZCgnI3JlbW92YWwtZGF0ZScpLnZhbCgnJykuZGF0ZXBpY2tlcih7XG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogbmV3IERhdGUoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS5maW5kKCcudWktZGF0ZXBpY2tlcicpLm5vdCgnLmd4LWNvbnRhaW5lcicpLmFkZENsYXNzKCdneC1jb250YWluZXInKTtcblxuICAgICAgICAgICAgLy8gRGlzcGxheSBtb2RhbCB0byB0aGUgdXNlci5cbiAgICAgICAgICAgICRhdHRhY2htZW50c01vZGFsLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdoYW5kbGVfYXR0YWNobWVudHMnLCAnZW1haWxzJyksXG4gICAgICAgICAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzczogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgY2xvc2VPbkVzY2FwZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNjbG9zZS1tb2RhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKCRhdHRhY2htZW50c01vZGFsKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT3BlbiBoYW5kbGUgYXR0YWNobWVudHMgbW9kYWwgd2luZG93LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfb25IYW5kbGVPbGRFbWFpbHMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0ICRkZWxldGVPbGRFbWFpbHNNb2RhbCA9ICQoJyNkZWxldGUtb2xkLWVtYWlscy1tb2RhbCcpO1xuXG4gICAgICAgICAgICAvLyBSZXNldCBtb2RhbCBzdGF0ZS5cbiAgICAgICAgICAgICRkZWxldGVPbGRFbWFpbHNNb2RhbC5maW5kKCcjZW1haWwtcmVtb3ZhbC1kYXRlJykudmFsKCcnKS5kYXRlcGlja2VyKHtcbiAgICAgICAgICAgICAgICBtYXhEYXRlOiBuZXcgRGF0ZSgpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmZpbmQoJy51aS1kYXRlcGlja2VyJykubm90KCcuZ3gtY29udGFpbmVyJykuYWRkQ2xhc3MoJ2d4LWNvbnRhaW5lcicpO1xuXG4gICAgICAgICAgICAvLyBEaXNwbGF5IG1vZGFsIHRvIHRoZSB1c2VyLlxuICAgICAgICAgICAgJGRlbGV0ZU9sZEVtYWlsc01vZGFsLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdoYW5kbGVfb2xkX2VtYWlscycsICdlbWFpbHMnKSxcbiAgICAgICAgICAgICAgICB3aWR0aDogNDAwLFxuICAgICAgICAgICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRpYWxvZ0NsYXNzOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBjbG9zZU9uRXNjYXBlOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI2Nsb3NlLW9sZC1lbWFpbC1tb2RhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKCRkZWxldGVPbGRFbWFpbHNNb2RhbCkuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4ZWN1dGUgdGhlIGRlbGV0ZSBvcGVyYXRpb24gZm9yIHRoZSBzZWxlY3RlZCBlbWFpbCByZWNvcmRzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgdGhlIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkJ1bGtEZWxldGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSB0YWJsZSByb3dzIHNlbGVjdGVkLlxuICAgICAgICAgICAgaWYgKCR0YWJsZS5maW5kKCd0ciB0ZCBpbnB1dDpjaGVja2VkJykubGVuZ3RoID09PSAwIHx8ICQoJyNidWxrLWFjdGlvbicpLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gTm8gc2VsZWN0ZWQgcmVjb3JkcywgZXhpdCBtZXRob2QuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEdldCBzZWxlY3RlZCByb3dzIGRhdGEgLSBjcmVhdGUgYSBuZXcgZW1haWwgY29sbGVjdGlvbi5cbiAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0ganNlLmxpYnMuZW1haWxzLmdldFNlbGVjdGVkRW1haWxzKCR0YWJsZSk7XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgY29uZmlybWF0aW9uIG1vZGFsIHRvIHRoZSB1c2VyLlxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdidWxrX2FjdGlvbicsICdhZG1pbl9sYWJlbHMnKSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgncHJvbXB0X2RlbGV0ZV9jb2xsZWN0aW9uJywgJ2VtYWlscycpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCd5ZXMnLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5lbWFpbHMuZGVsZXRlQ29sbGVjdGlvbihjb2xsZWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0YWJsZS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzcG9uc2UubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhYmxlLmZpbmQoJ2lucHV0W3R5cGU9Y2hlY2tib3hdJykucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFeGVjdXRlIHRoZSBzZW5kIG9wZXJhdGlvbiBmb3IgdGhlIHNlbGVjdGVkIGVtYWlsIHJlY29yZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyB0aGUgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uQnVsa1NlbmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSB0YWJsZSByb3dzIHNlbGVjdGVkLlxuICAgICAgICAgICAgaWYgKCR0YWJsZS5maW5kKCd0ciB0ZCBpbnB1dDpjaGVja2VkJykubGVuZ3RoID09PSAwIHx8ICQoJyNidWxrLWFjdGlvbicpLnZhbCgpID09PSAnJykge1xuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gTm8gc2VsZWN0ZWQgcmVjb3JkcywgZXhpdCBtZXRob2QuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEdldCBzZWxlY3RlZCByb3dzIGRhdGEgLSBjcmVhdGUgYSBuZXcgZW1haWwgY29sbGVjdGlvbi5cbiAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0ganNlLmxpYnMuZW1haWxzLmdldFNlbGVjdGVkRW1haWxzKCR0YWJsZSk7XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgY29uZmlybWF0aW9uIG1vZGFsIHRvIHRoZSB1c2VyLlxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdidWxrX2FjdGlvbicsICdhZG1pbl9sYWJlbHMnKSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgncHJvbXB0X3NlbmRfY29sbGVjdGlvbicsICdlbWFpbHMnKSxcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdubycsICdsaWdodGJveF9idXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgneWVzJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuZW1haWxzLnNlbmRDb2xsZWN0aW9uKGNvbGxlY3Rpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhYmxlLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpdGxlID0ganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXNwb25zZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGFibGUuZmluZCgnaW5wdXRbdHlwZT1jaGVja2JveF0nKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEJpbmQgcGFnaW5hdG9yIGV2ZW50IGhhbmRsZXJzLlxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJyNyZWZyZXNoLXRhYmxlJywgX29uUmVmcmVzaERhdGEpXG4gICAgICAgICAgICAgICAgLm9uKCdjaGFuZ2UnLCAnI2Rpc3BsYXktcmVjb3JkcycsIF9vblRhYmxlTGVuZ3RoQ2hhbmdlKTtcbiAgICAgICAgICAgICQoJ2JvZHknKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnI2hhbmRsZS1hdHRhY2htZW50cycsIF9vbkhhbmRsZUF0dGFjaG1lbnRzKTtcbiAgICAgICAgICAgICQoJ2JvZHknKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnI2hhbmRsZS1vbGQtZW1haWxzJywgX29uSGFuZGxlT2xkRW1haWxzKTtcblxuICAgICAgICAgICAgdmFyICRkcm9wZG93biA9ICR0aGlzLmZpbmQoJy5idWxrLWFjdGlvbicpO1xuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkZHJvcGRvd24sICdidWxrX3NlbmRfc2VsZWN0ZWQnLCAnZW1haWxzJywgX29uQnVsa1NlbmQpO1xuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkZHJvcGRvd24sICdidWxrX2RlbGV0ZV9zZWxlY3RlZCcsICdlbWFpbHMnLCBfb25CdWxrRGVsZXRlKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJldHVybiBtb2R1bGUgb2JqZWN0IHRvIG1vZHVsZSBlbmdpbmUuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
