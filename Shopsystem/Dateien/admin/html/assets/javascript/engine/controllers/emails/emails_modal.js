'use strict';

/* --------------------------------------------------------------
 emails_modal.js 2016-10-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 ----------------------------------------------------------------
 */

/**
 * ## Emails Modal Controller
 *
 * This controller will handle the modal dialog operations of the admin/emails page.
 *
 * @module Controllers/emails_modal
 */
gx.controllers.module('emails_modal', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', gx.source + '/libs/emails', 'modal', 'datatable', 'normalize'],

/** @lends module:Controllers/emails_modal */

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
     * Toolbar Selector
     *
     * @type {object}
     */
    $toolbar = $('#emails-toolbar'),


    /**
     * Contacts Table Selector
     *
     * @type {object}
     */
    $contactsTable = $this.find('#contacts-table'),


    /**
     * Attachments Table Selector
     *
     * @type {object}
     */
    $attachmentsTable = $this.find('#attachments-table'),


    /**
     * Default Module Options
     *
     * @type {object}
     */
    defaults = {
        contactsTableActions: function contactsTableActions(data, type, row, meta) {
            return '<div class="row-actions">' + '<span class="delete-contact action-item" title="' + jse.core.lang.translate('delete', 'buttons') + '">' + '<i class="fa fa-trash-o"></i>' + '</span>' + '</div>';
        },

        attachmentsTableActions: function attachmentsTableActions(data, type, row, meta) {
            // Check if attachment file exists in the server and thus can be downloaded.
            var disabled, title;

            if (data.file_exists) {
                disabled = '';
                title = jse.core.lang.translate('download', 'buttons');
            } else {
                disabled = 'disabled="disabled"';
                title = jse.core.lang.translate('message_download_attachment_error', 'emails');
            }

            // Generate table actions html for table row.
            return '<div class="row-actions">' + '<span class="delete-attachment action-item" title="' + jse.core.lang.translate('delete', 'buttons') + '">' + '<i class="fa fa-trash-o"></i>' + '</span>' + '<span class="download-attachment action-item" title="' + title + '" ' + disabled + '>' + '<i class="fa fa-download"></i>' + '</span>' + '</div>';
        },

        convertUpperCase: function convertUpperCase(data, type, row, meta) {
            return data.toUpperCase();
        },

        lengthMenu: [[5, 10], [5, 10]]
    },


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
     * Add a contact with the provided data into the contacts table.
     *
     * @param {object} event Contains event information.
     */
    var _onAddContact = function _onAddContact(event) {
        // Validate Contact Form
        $this.find('.tab-content.bcc-cc').trigger('validator.validate'); // Trigger form validation
        if ($this.find('.tab-content.bcc-cc .error').length > 0) {
            return;
        }

        // Add contact to table.
        var contact = {
            name: jse.libs.normalize.escapeHtml($this.find('#contact-name').val()),
            email: jse.libs.normalize.escapeHtml($this.find('#contact-email').val()),
            type: jse.libs.normalize.escapeHtml($this.find('#contact-type').val())
        };
        $this.find('#contacts-table').DataTable().row.add(contact).draw();
        $this.find('#contact-name, #contact-email, #contact-type').removeClass('valid error');
        $this.find('#contact-name, #contact-email').val('');
        $this.find('#contact-type option:first').prop('selected', true);
        jse.libs.emails.updateTabCounters($this);
    };

    /**
     * Remove contact from contacts table.
     *
     * @param {object} event contains event information.
     */
    var _onDeleteContact = function _onDeleteContact(event) {
        var row = $(this).parents('tr');
        $this.find('#contacts-table').DataTable().row(row).remove().draw();
        jse.libs.emails.updateTabCounters($this);
    };

    /**
     * Called after the attachment is uploaded
     *
     * @param {object} event Contains event information.
     */
    var _onUploadAttachment = function _onUploadAttachment(event, response) {
        if (response.exception) {
            jse.libs.modal.message({
                title: jse.core.lang.translate('error', 'messages'),
                content: jse.core.lang.translate('message_upload_attachment_error', 'emails') + response.message
            });
            return;
        }

        $this.find('#attachments-table').DataTable().row.add({
            path: jse.libs.normalize.escapeHtml(response.path),
            file_exists: true
        }).draw();

        $this.find('#upload-attachment').val('');
        jse.libs.emails.updateTabCounters($this);
    };

    /**
     * Called after the attachment is uploaded
     *
     * @param {object} event Contains event information.
     */
    var _onUploadAttachmentWithFileManager = function _onUploadAttachmentWithFileManager(event, response) {
        if (response.exception) {
            jse.libs.modal.message({
                title: jse.core.lang.translate('error', 'messages'),
                content: jse.core.lang.translate('message_upload_attachment_error', 'emails') + response.message
            });
            return;
        }

        $this.find('#attachments-table').DataTable().row.add({
            path: jse.libs.normalize.escapeHtml(response.path),
            file_exists: true
        }).draw();

        jse.libs.emails.updateTabCounters($this);
    };

    /**
     * Remove selected attachment from email and from server.
     *
     * @param {object} event Contains event information.
     */
    var _onDeleteAttachment = function _onDeleteAttachment(event) {
        var row = $(this).parents('tr').get(0),
            url = jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/DeleteAttachment',
            data = {
            pageToken: jse.core.config.get('pageToken'),
            attachments: [$attachmentsTable.DataTable().row(row).data().path]
        };

        $.post(url, data, function (response) {
            jse.core.debug.info('AJAX File Remove Response', response);

            if (response.exception) {
                jse.libs.modal.message({
                    title: jse.core.lang.translate('error', 'messages'),
                    content: jse.core.lang.translate('message_remove_attachment_error') + response.message
                });
                return;
            }

            $this.find('#attachments-table').DataTable().row(row).remove().draw();
            jse.libs.emails.updateTabCounters($this);
        }, 'json');
    };

    /**
     * Download selected attachment.
     *
     * A new window tab will be opened and the file download will start immediately. If
     * there are any errors from the PHP code they will be displayed in the new tab and
     * they will not affect the current page.
     *
     * @param {object} event Contains event information.
     */
    var _onDownloadAttachment = function _onDownloadAttachment(event) {
        if ($(this).attr('disabled') === 'disabled') {
            return;
        }
        var row = $(this).parents('tr').get(0),
            path = $attachmentsTable.DataTable().row(row).data().path,
            url = jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/DownloadAttachment&path=' + path;
        window.open(url, '_blank');
    };

    /**
     * Callback to the validation of the first tab of the modal.
     *
     * Make the tab headline link red so that the user can see that there is an error
     * inside the elements of this tab.
     *
     * @param {object} event Contains event information.
     */
    var _onEmailDetailsValidation = function _onEmailDetailsValidation(event) {
        // Paint the parent tab so that the user knows that there is a problem in the form.
        if ($this.find('.tab-content.details .error').length > 0) {
            $this.find('.tab-headline.details').css('color', 'red');
        } else {
            $this.find('.tab-headline.details').css('color', '');
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        // Contacts DataTable
        jse.libs.datatable.create($contactsTable, {
            autoWidth: false,
            order: [[0, 'asc'] // Email ASC
            ],
            language: jse.core.config.get('languageCode') === 'de' ? jse.libs.datatable.getGermanTranslation() : null,
            lengthMenu: options.lengthMenu,
            pageLength: 5,
            columns: [{
                data: 'email',
                width: '45%'
            }, {
                data: 'name',
                width: '35%'
            }, {
                data: 'type',
                render: options.convertUpperCase,
                width: '10%'
            }, {
                data: null,
                orderable: false,
                defaultContent: '',
                render: options.contactsTableActions,
                width: '10%',
                className: 'dt-head-center dt-body-center'
            }]
        });

        // Attachments DataTable
        jse.libs.datatable.create($attachmentsTable, {
            autoWidth: false,
            order: [[0, 'asc'] // Path ASC
            ],
            language: jse.core.config.get('languageCode') === 'de' ? jse.libs.datatable.getGermanTranslation() : null,
            lengthMenu: options.lengthMenu,
            pageLength: 5,
            columns: [{
                data: 'path',
                width: '80%'
            }, {
                data: null,
                orderable: false,
                defaultContent: '',
                render: options.attachmentsTableActions,
                width: '20%',
                className: 'dt-head-center dt-body-center'
            }]
        });

        jse.libs.emails.updateTabCounters($this);

        // Bind event handlers of the modal.
        $this.on('click', '#add-contact', _onAddContact).on('click', '.delete-contact', _onDeleteContact).on('click', '.delete-attachment', _onDeleteAttachment).on('click', '.download-attachment', _onDownloadAttachment).on('validator.validate', _onEmailDetailsValidation);

        // Bind the event handler for the email attachments to the responsive file manager
        // if it is available, else use the old implementation.
        if (gx.widgets.cache.modules.filemanager) {
            window.responsive_filemanager_callback = function (field_id) {
                var $field = $('#' + field_id);
                var url = jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/UploadAttachmentWithFileManager';
                var data = { pageToken: jse.core.config.get('pageToken'), attachmentPath: $field.val() };

                // Make the input field not editable
                $field.prop('readonly', 'readonly');

                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'json',
                    method: 'POST'
                }).done(function (response) {
                    $this.find('#attachments-table').DataTable().row.add({
                        path: response.path,
                        file_exists: true
                    }).draw();
                });

                jse.libs.emails.updateTabCounters($this);
            };
        } else {
            $this.on('upload', '#upload-attachment', _onUploadAttachment);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy9lbWFpbHNfbW9kYWwuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkdGFibGUiLCIkdG9vbGJhciIsIiRjb250YWN0c1RhYmxlIiwiZmluZCIsIiRhdHRhY2htZW50c1RhYmxlIiwiZGVmYXVsdHMiLCJjb250YWN0c1RhYmxlQWN0aW9ucyIsInR5cGUiLCJyb3ciLCJtZXRhIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJhdHRhY2htZW50c1RhYmxlQWN0aW9ucyIsImRpc2FibGVkIiwidGl0bGUiLCJmaWxlX2V4aXN0cyIsImNvbnZlcnRVcHBlckNhc2UiLCJ0b1VwcGVyQ2FzZSIsImxlbmd0aE1lbnUiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX29uQWRkQ29udGFjdCIsImV2ZW50IiwidHJpZ2dlciIsImxlbmd0aCIsImNvbnRhY3QiLCJuYW1lIiwibGlicyIsIm5vcm1hbGl6ZSIsImVzY2FwZUh0bWwiLCJ2YWwiLCJlbWFpbCIsIkRhdGFUYWJsZSIsImFkZCIsImRyYXciLCJyZW1vdmVDbGFzcyIsInByb3AiLCJlbWFpbHMiLCJ1cGRhdGVUYWJDb3VudGVycyIsIl9vbkRlbGV0ZUNvbnRhY3QiLCJwYXJlbnRzIiwicmVtb3ZlIiwiX29uVXBsb2FkQXR0YWNobWVudCIsInJlc3BvbnNlIiwiZXhjZXB0aW9uIiwibW9kYWwiLCJtZXNzYWdlIiwiY29udGVudCIsInBhdGgiLCJfb25VcGxvYWRBdHRhY2htZW50V2l0aEZpbGVNYW5hZ2VyIiwiX29uRGVsZXRlQXR0YWNobWVudCIsImdldCIsInVybCIsImNvbmZpZyIsInBhZ2VUb2tlbiIsImF0dGFjaG1lbnRzIiwicG9zdCIsImRlYnVnIiwiaW5mbyIsIl9vbkRvd25sb2FkQXR0YWNobWVudCIsImF0dHIiLCJ3aW5kb3ciLCJvcGVuIiwiX29uRW1haWxEZXRhaWxzVmFsaWRhdGlvbiIsImNzcyIsImluaXQiLCJkb25lIiwiZGF0YXRhYmxlIiwiY3JlYXRlIiwiYXV0b1dpZHRoIiwib3JkZXIiLCJsYW5ndWFnZSIsImdldEdlcm1hblRyYW5zbGF0aW9uIiwicGFnZUxlbmd0aCIsImNvbHVtbnMiLCJ3aWR0aCIsInJlbmRlciIsIm9yZGVyYWJsZSIsImRlZmF1bHRDb250ZW50IiwiY2xhc3NOYW1lIiwib24iLCJ3aWRnZXRzIiwiY2FjaGUiLCJtb2R1bGVzIiwiZmlsZW1hbmFnZXIiLCJyZXNwb25zaXZlX2ZpbGVtYW5hZ2VyX2NhbGxiYWNrIiwiZmllbGRfaWQiLCIkZmllbGQiLCJhdHRhY2htZW50UGF0aCIsImFqYXgiLCJkYXRhVHlwZSIsIm1ldGhvZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGNBREosRUFHSSxDQUNJQyxJQUFJQyxNQUFKLEdBQWEsOENBRGpCLEVBRUlELElBQUlDLE1BQUosR0FBYSw2Q0FGakIsRUFHSUosR0FBR0ksTUFBSCxHQUFZLGNBSGhCLEVBSUksT0FKSixFQUtJLFdBTEosRUFNSSxXQU5KLENBSEo7O0FBWUk7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFTRCxFQUFFLGVBQUYsQ0FiYjs7O0FBZUk7Ozs7O0FBS0FFLGVBQVdGLEVBQUUsaUJBQUYsQ0FwQmY7OztBQXNCSTs7Ozs7QUFLQUcscUJBQWlCSixNQUFNSyxJQUFOLENBQVcsaUJBQVgsQ0EzQnJCOzs7QUE2Qkk7Ozs7O0FBS0FDLHdCQUFvQk4sTUFBTUssSUFBTixDQUFXLG9CQUFYLENBbEN4Qjs7O0FBb0NJOzs7OztBQUtBRSxlQUFXO0FBQ1BDLDhCQUFzQiw4QkFBVVQsSUFBVixFQUFnQlUsSUFBaEIsRUFBc0JDLEdBQXRCLEVBQTJCQyxJQUEzQixFQUFpQztBQUNuRCxtQkFB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RUFBd0IsVUFBeEI7O0FBRUF0QyxrQkFBRTJGLElBQUYsQ0FDSTtBQUNJckMsNEJBREo7QUFFSXhELDhCQUZKO0FBR0k4Riw4QkFBVSxNQUhkO0FBSUlDLDRCQUFRO0FBSlosaUJBREosRUFPRXpCLElBUEYsQ0FPTyxVQUFVdkIsUUFBVixFQUFvQjtBQUN2QjlDLDBCQUFNSyxJQUFOLENBQVcsb0JBQVgsRUFBaUM4QixTQUFqQyxHQUE2Q3pCLEdBQTdDLENBQWlEMEIsR0FBakQsQ0FDSTtBQUNJZSw4QkFBTUwsU0FBU0ssSUFEbkI7QUFFSWpDLHFDQUFhO0FBRmpCLHFCQURKLEVBS0VtQixJQUxGO0FBTUgsaUJBZEQ7O0FBZ0JBeEMsb0JBQUlpQyxJQUFKLENBQVNVLE1BQVQsQ0FBZ0JDLGlCQUFoQixDQUFrQ3pDLEtBQWxDO0FBQ0gsYUF6QkQ7QUEyQkgsU0E1QkQsTUE0Qk87QUFDSEEsa0JBQU1tRixFQUFOLENBQVMsUUFBVCxFQUFtQixvQkFBbkIsRUFBeUN0QyxtQkFBekM7QUFDSDs7QUFFRHdCO0FBQ0gsS0E3R0Q7O0FBK0dBLFdBQU96RSxNQUFQO0FBQ0gsQ0EvWEwiLCJmaWxlIjoiZW1haWxzL2VtYWlsc19tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZW1haWxzX21vZGFsLmpzIDIwMTYtMTAtMTFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgRW1haWxzIE1vZGFsIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgd2lsbCBoYW5kbGUgdGhlIG1vZGFsIGRpYWxvZyBvcGVyYXRpb25zIG9mIHRoZSBhZG1pbi9lbWFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL2VtYWlsc19tb2RhbFxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2VtYWlsc19tb2RhbCcsXG5cbiAgICBbXG4gICAgICAgIGpzZS5zb3VyY2UgKyAnL3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5jc3MnLFxuICAgICAgICBqc2Uuc291cmNlICsgJy92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanMnLFxuICAgICAgICBneC5zb3VyY2UgKyAnL2xpYnMvZW1haWxzJyxcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgJ2RhdGF0YWJsZScsXG4gICAgICAgICdub3JtYWxpemUnXG4gICAgXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOkNvbnRyb2xsZXJzL2VtYWlsc19tb2RhbCAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVGFibGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGFibGUgPSAkKCcjZW1haWxzLXRhYmxlJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVG9vbGJhciBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0b29sYmFyID0gJCgnI2VtYWlscy10b29sYmFyJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ29udGFjdHMgVGFibGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkY29udGFjdHNUYWJsZSA9ICR0aGlzLmZpbmQoJyNjb250YWN0cy10YWJsZScpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEF0dGFjaG1lbnRzIFRhYmxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJGF0dGFjaG1lbnRzVGFibGUgPSAkdGhpcy5maW5kKCcjYXR0YWNobWVudHMtdGFibGUnKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE1vZHVsZSBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgY29udGFjdHNUYWJsZUFjdGlvbnM6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCByb3csIG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICc8ZGl2IGNsYXNzPVwicm93LWFjdGlvbnNcIj4nICsgJzxzcGFuIGNsYXNzPVwiZGVsZXRlLWNvbnRhY3QgYWN0aW9uLWl0ZW1cIiB0aXRsZT1cIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RlbGV0ZScsICdidXR0b25zJykgKyAnXCI+JyArICc8aSBjbGFzcz1cImZhIGZhLXRyYXNoLW9cIj48L2k+JyArICc8L3NwYW4+JyArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICBhdHRhY2htZW50c1RhYmxlQWN0aW9uczogZnVuY3Rpb24gKGRhdGEsIHR5cGUsIHJvdywgbWV0YSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhdHRhY2htZW50IGZpbGUgZXhpc3RzIGluIHRoZSBzZXJ2ZXIgYW5kIHRodXMgY2FuIGJlIGRvd25sb2FkZWQuXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZCwgdGl0bGU7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZmlsZV9leGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdkb3dubG9hZCcsICdidXR0b25zJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZCA9ICdkaXNhYmxlZD1cImRpc2FibGVkXCInO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbWVzc2FnZV9kb3dubG9hZF9hdHRhY2htZW50X2Vycm9yJywgJ2VtYWlscycpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgdGFibGUgYWN0aW9ucyBodG1sIGZvciB0YWJsZSByb3cuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnPGRpdiBjbGFzcz1cInJvdy1hY3Rpb25zXCI+JyArICc8c3BhbiBjbGFzcz1cImRlbGV0ZS1hdHRhY2htZW50IGFjdGlvbi1pdGVtXCIgdGl0bGU9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkZWxldGUnLCAnYnV0dG9ucycpICsgJ1wiPicgKyAnPGkgY2xhc3M9XCJmYSBmYS10cmFzaC1vXCI+PC9pPicgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZG93bmxvYWQtYXR0YWNobWVudCBhY3Rpb24taXRlbVwiIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiICcgKyBkaXNhYmxlZCArICc+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGkgY2xhc3M9XCJmYSBmYS1kb3dubG9hZFwiPjwvaT4nICsgJzwvc3Bhbj4nICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNvbnZlcnRVcHBlckNhc2U6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCByb3csIG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgbGVuZ3RoTWVudTogW1s1LCAxMF0sIFs1LCAxMF1dXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE1vZHVsZSBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGEgY29udGFjdCB3aXRoIHRoZSBwcm92aWRlZCBkYXRhIGludG8gdGhlIGNvbnRhY3RzIHRhYmxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uQWRkQ29udGFjdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gVmFsaWRhdGUgQ29udGFjdCBGb3JtXG4gICAgICAgICAgICAkdGhpcy5maW5kKCcudGFiLWNvbnRlbnQuYmNjLWNjJykudHJpZ2dlcigndmFsaWRhdG9yLnZhbGlkYXRlJyk7IC8vIFRyaWdnZXIgZm9ybSB2YWxpZGF0aW9uXG4gICAgICAgICAgICBpZiAoJHRoaXMuZmluZCgnLnRhYi1jb250ZW50LmJjYy1jYyAuZXJyb3InKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgY29udGFjdCB0byB0YWJsZS5cbiAgICAgICAgICAgIHZhciBjb250YWN0ID0ge1xuICAgICAgICAgICAgICAgIG5hbWU6IGpzZS5saWJzLm5vcm1hbGl6ZS5lc2NhcGVIdG1sKCR0aGlzLmZpbmQoJyNjb250YWN0LW5hbWUnKS52YWwoKSksXG4gICAgICAgICAgICAgICAgZW1haWw6IGpzZS5saWJzLm5vcm1hbGl6ZS5lc2NhcGVIdG1sKCR0aGlzLmZpbmQoJyNjb250YWN0LWVtYWlsJykudmFsKCkpLFxuICAgICAgICAgICAgICAgIHR5cGU6IGpzZS5saWJzLm5vcm1hbGl6ZS5lc2NhcGVIdG1sKCR0aGlzLmZpbmQoJyNjb250YWN0LXR5cGUnKS52YWwoKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcjY29udGFjdHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3cuYWRkKGNvbnRhY3QpLmRyYXcoKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJyNjb250YWN0LW5hbWUsICNjb250YWN0LWVtYWlsLCAjY29udGFjdC10eXBlJykucmVtb3ZlQ2xhc3MoJ3ZhbGlkIGVycm9yJyk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcjY29udGFjdC1uYW1lLCAjY29udGFjdC1lbWFpbCcpLnZhbCgnJyk7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCcjY29udGFjdC10eXBlIG9wdGlvbjpmaXJzdCcpLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICBqc2UubGlicy5lbWFpbHMudXBkYXRlVGFiQ291bnRlcnMoJHRoaXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgY29udGFjdCBmcm9tIGNvbnRhY3RzIHRhYmxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgY29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uRGVsZXRlQ29udGFjdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHJvdyA9ICQodGhpcykucGFyZW50cygndHInKTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJyNjb250YWN0cy10YWJsZScpLkRhdGFUYWJsZSgpLnJvdyhyb3cpLnJlbW92ZSgpLmRyYXcoKTtcbiAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy51cGRhdGVUYWJDb3VudGVycygkdGhpcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbGxlZCBhZnRlciB0aGUgYXR0YWNobWVudCBpcyB1cGxvYWRlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uVXBsb2FkQXR0YWNobWVudCA9IGZ1bmN0aW9uIChldmVudCwgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5leGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbWVzc2FnZV91cGxvYWRfYXR0YWNobWVudF9lcnJvcicsICdlbWFpbHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgKyByZXNwb25zZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCcjYXR0YWNobWVudHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3cuYWRkKHtcbiAgICAgICAgICAgICAgICBwYXRoOiBqc2UubGlicy5ub3JtYWxpemUuZXNjYXBlSHRtbChyZXNwb25zZS5wYXRoKSxcbiAgICAgICAgICAgICAgICBmaWxlX2V4aXN0czogdHJ1ZVxuICAgICAgICAgICAgfSkuZHJhdygpO1xuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCcjdXBsb2FkLWF0dGFjaG1lbnQnKS52YWwoJycpO1xuICAgICAgICAgICAganNlLmxpYnMuZW1haWxzLnVwZGF0ZVRhYkNvdW50ZXJzKCR0aGlzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbGVkIGFmdGVyIHRoZSBhdHRhY2htZW50IGlzIHVwbG9hZGVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25VcGxvYWRBdHRhY2htZW50V2l0aEZpbGVNYW5hZ2VyID0gZnVuY3Rpb24gKGV2ZW50LCByZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdtZXNzYWdlX3VwbG9hZF9hdHRhY2htZW50X2Vycm9yJywgJ2VtYWlscycpXG4gICAgICAgICAgICAgICAgICAgICAgICArIHJlc3BvbnNlLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJyNhdHRhY2htZW50cy10YWJsZScpLkRhdGFUYWJsZSgpLnJvdy5hZGQoe1xuICAgICAgICAgICAgICAgIHBhdGg6IGpzZS5saWJzLm5vcm1hbGl6ZS5lc2NhcGVIdG1sKHJlc3BvbnNlLnBhdGgpLFxuICAgICAgICAgICAgICAgIGZpbGVfZXhpc3RzOiB0cnVlXG4gICAgICAgICAgICB9KS5kcmF3KCk7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy51cGRhdGVUYWJDb3VudGVycygkdGhpcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBzZWxlY3RlZCBhdHRhY2htZW50IGZyb20gZW1haWwgYW5kIGZyb20gc2VydmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uRGVsZXRlQXR0YWNobWVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIHJvdyA9ICQodGhpcykucGFyZW50cygndHInKS5nZXQoMCksXG4gICAgICAgICAgICAgICAgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1FbWFpbHMvRGVsZXRlQXR0YWNobWVudCcsXG4gICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKSxcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNobWVudHM6IFskYXR0YWNobWVudHNUYWJsZS5EYXRhVGFibGUoKS5yb3cocm93KS5kYXRhKCkucGF0aF1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkLnBvc3QodXJsLCBkYXRhLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5pbmZvKCdBSkFYIEZpbGUgUmVtb3ZlIFJlc3BvbnNlJywgcmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdtZXNzYWdlX3JlbW92ZV9hdHRhY2htZW50X2Vycm9yJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHJlc3BvbnNlLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcjYXR0YWNobWVudHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3cocm93KS5yZW1vdmUoKS5kcmF3KCk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuZW1haWxzLnVwZGF0ZVRhYkNvdW50ZXJzKCR0aGlzKTtcbiAgICAgICAgICAgIH0sICdqc29uJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERvd25sb2FkIHNlbGVjdGVkIGF0dGFjaG1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEEgbmV3IHdpbmRvdyB0YWIgd2lsbCBiZSBvcGVuZWQgYW5kIHRoZSBmaWxlIGRvd25sb2FkIHdpbGwgc3RhcnQgaW1tZWRpYXRlbHkuIElmXG4gICAgICAgICAqIHRoZXJlIGFyZSBhbnkgZXJyb3JzIGZyb20gdGhlIFBIUCBjb2RlIHRoZXkgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdGhlIG5ldyB0YWIgYW5kXG4gICAgICAgICAqIHRoZXkgd2lsbCBub3QgYWZmZWN0IHRoZSBjdXJyZW50IHBhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25Eb3dubG9hZEF0dGFjaG1lbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ2Rpc2FibGVkJykgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcm93ID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmdldCgwKSxcbiAgICAgICAgICAgICAgICBwYXRoID0gJGF0dGFjaG1lbnRzVGFibGUuRGF0YVRhYmxlKCkucm93KHJvdykuZGF0YSgpLnBhdGgsXG4gICAgICAgICAgICAgICAgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1FbWFpbHMvRG93bmxvYWRBdHRhY2htZW50JnBhdGg9JyArIHBhdGg7XG4gICAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbGJhY2sgdG8gdGhlIHZhbGlkYXRpb24gb2YgdGhlIGZpcnN0IHRhYiBvZiB0aGUgbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIE1ha2UgdGhlIHRhYiBoZWFkbGluZSBsaW5rIHJlZCBzbyB0aGF0IHRoZSB1c2VyIGNhbiBzZWUgdGhhdCB0aGVyZSBpcyBhbiBlcnJvclxuICAgICAgICAgKiBpbnNpZGUgdGhlIGVsZW1lbnRzIG9mIHRoaXMgdGFiLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgZXZlbnQgaW5mb3JtYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uRW1haWxEZXRhaWxzVmFsaWRhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gUGFpbnQgdGhlIHBhcmVudCB0YWIgc28gdGhhdCB0aGUgdXNlciBrbm93cyB0aGF0IHRoZXJlIGlzIGEgcHJvYmxlbSBpbiB0aGUgZm9ybS5cbiAgICAgICAgICAgIGlmICgkdGhpcy5maW5kKCcudGFiLWNvbnRlbnQuZGV0YWlscyAuZXJyb3InKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnRhYi1oZWFkbGluZS5kZXRhaWxzJykuY3NzKCdjb2xvcicsICdyZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnRhYi1oZWFkbGluZS5kZXRhaWxzJykuY3NzKCdjb2xvcicsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSBtb2R1bGUsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gQ29udGFjdHMgRGF0YVRhYmxlXG4gICAgICAgICAgICBqc2UubGlicy5kYXRhdGFibGUuY3JlYXRlKCRjb250YWN0c1RhYmxlLCB7XG4gICAgICAgICAgICAgICAgYXV0b1dpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBvcmRlcjogW1xuICAgICAgICAgICAgICAgICAgICBbMCwgJ2FzYyddIC8vIEVtYWlsIEFTQ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IChqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSA9PT0gJ2RlJylcbiAgICAgICAgICAgICAgICAgICAgPyBqc2UubGlicy5kYXRhdGFibGUuZ2V0R2VybWFuVHJhbnNsYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgbGVuZ3RoTWVudTogb3B0aW9ucy5sZW5ndGhNZW51LFxuICAgICAgICAgICAgICAgIHBhZ2VMZW5ndGg6IDUsXG4gICAgICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAnZW1haWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICc0NSUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICduYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMzUlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAndHlwZScsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IG9wdGlvbnMuY29udmVydFVwcGVyQ2FzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAlJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRDb250ZW50OiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcjogb3B0aW9ucy5jb250YWN0c1RhYmxlQWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2R0LWhlYWQtY2VudGVyIGR0LWJvZHktY2VudGVyJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEF0dGFjaG1lbnRzIERhdGFUYWJsZVxuICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmNyZWF0ZSgkYXR0YWNobWVudHNUYWJsZSwge1xuICAgICAgICAgICAgICAgIGF1dG9XaWR0aDogZmFsc2UsXG4gICAgICAgICAgICAgICAgb3JkZXI6IFtcbiAgICAgICAgICAgICAgICAgICAgWzAsICdhc2MnXSAvLyBQYXRoIEFTQ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IChqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKSA9PT0gJ2RlJylcbiAgICAgICAgICAgICAgICAgICAgPyBqc2UubGlicy5kYXRhdGFibGUuZ2V0R2VybWFuVHJhbnNsYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICAgICAgbGVuZ3RoTWVudTogb3B0aW9ucy5sZW5ndGhNZW51LFxuICAgICAgICAgICAgICAgIHBhZ2VMZW5ndGg6IDUsXG4gICAgICAgICAgICAgICAgY29sdW1uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAncGF0aCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzgwJSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29udGVudDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IG9wdGlvbnMuYXR0YWNobWVudHNUYWJsZUFjdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzIwJScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdkdC1oZWFkLWNlbnRlciBkdC1ib2R5LWNlbnRlcidcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBqc2UubGlicy5lbWFpbHMudXBkYXRlVGFiQ291bnRlcnMoJHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIG9mIHRoZSBtb2RhbC5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcjYWRkLWNvbnRhY3QnLCBfb25BZGRDb250YWN0KVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmRlbGV0ZS1jb250YWN0JywgX29uRGVsZXRlQ29udGFjdClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5kZWxldGUtYXR0YWNobWVudCcsIF9vbkRlbGV0ZUF0dGFjaG1lbnQpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuZG93bmxvYWQtYXR0YWNobWVudCcsIF9vbkRvd25sb2FkQXR0YWNobWVudClcbiAgICAgICAgICAgICAgICAub24oJ3ZhbGlkYXRvci52YWxpZGF0ZScsIF9vbkVtYWlsRGV0YWlsc1ZhbGlkYXRpb24pO1xuXG4gICAgICAgICAgICAvLyBCaW5kIHRoZSBldmVudCBoYW5kbGVyIGZvciB0aGUgZW1haWwgYXR0YWNobWVudHMgdG8gdGhlIHJlc3BvbnNpdmUgZmlsZSBtYW5hZ2VyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhdmFpbGFibGUsIGVsc2UgdXNlIHRoZSBvbGQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgICBpZiAoZ3gud2lkZ2V0cy5jYWNoZS5tb2R1bGVzLmZpbGVtYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlc3BvbnNpdmVfZmlsZW1hbmFnZXJfY2FsbGJhY2sgPSBmdW5jdGlvbiAoZmllbGRfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRmaWVsZCA9ICQoJyMnICsgZmllbGRfaWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1FbWFpbHMvVXBsb2FkQXR0YWNobWVudFdpdGhGaWxlTWFuYWdlcic7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkYXRhID0ge3BhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyksIGF0dGFjaG1lbnRQYXRoOiAkZmllbGQudmFsKCl9O1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2UgdGhlIGlucHV0IGZpZWxkIG5vdCBlZGl0YWJsZVxuICAgICAgICAgICAgICAgICAgICAkZmllbGQucHJvcCgncmVhZG9ubHknLCAncmVhZG9ubHknKTtcblxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcjYXR0YWNobWVudHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3cuYWRkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVzcG9uc2UucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZV9leGlzdHM6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApLmRyYXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuZW1haWxzLnVwZGF0ZVRhYkNvdW50ZXJzKCR0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMub24oJ3VwbG9hZCcsICcjdXBsb2FkLWF0dGFjaG1lbnQnLCBfb25VcGxvYWRBdHRhY2htZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
