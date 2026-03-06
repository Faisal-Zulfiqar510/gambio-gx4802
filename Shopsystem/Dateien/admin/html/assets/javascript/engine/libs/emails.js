'use strict';

/* --------------------------------------------------------------
 emails.js 2022-05-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.emails = jse.libs.emails || {};

/**
 * ## Emails Library
 *
 * This library contains all the admin/emails page common functionality and is used by the page
 * controllers. You might also use this library in other pages where you need to trigger specific
 * email operations in the server.
 *
 * You will need to provide the full URL in order to load this library as a dependency to a module:
 *
 * ```javascript
 * gx.controller.module(
 *   'my_custom_page',
 *
 *   [
 *      gx.source + '/libs/emails'
 *   ],
 *
 *   function(data) {
 *      // Module code ...
 *   });
 *```
 *
 * Required Translation Sections: 'admin_labels', 'buttons', 'db_backup', 'emails', 'lightbox_buttons', 'messages'
 *
 * @module Admin/Libs/emails
 * @exports jse.libs.emails
 */
(function (exports) {

    'use strict';

    exports.CONTACT_TYPE_SENDER = 'sender';
    exports.CONTACT_TYPE_RECIPIENT = 'recipient';
    exports.CONTACT_TYPE_REPLY_TO = 'reply_to';
    exports.CONTACT_TYPE_BCC = 'bcc';
    exports.CONTACT_TYPE_CC = 'cc';

    /**
     * Reset Modal (DOM)
     *
     * This method will reset the emails modal back to its initial state. The default
     * modal markup is used in the admin/emails page, but this method can work without
     * all the elements too.
     *
     * @param {object} $modal jQuery selector for the modal.
     */
    exports.resetModal = function ($modal) {
        // Clear basic elements
        $modal.find('input, textarea').val('');
        $modal.find('select option:first').prop('selected', 'selected');

        // Remove validation classes.
        $modal.trigger('validator.reset');

        // Remove all rows from DataTables.
        if ($modal.find('.dataTables_wrapper').length > 0) {
            $modal.find('.dataTables_wrapper table').DataTable().clear().draw();
            $modal.find('.dataTables_wrapper').find('.dataTables_length select option:eq(0)').prop('selected', true);
        }

        // Set all tab widgets to the first tab.
        if ($modal.find('.tab-headline-wrapper').length > 0) {
            $modal.find('.tab-headline').css('color', '').show();
            $modal.find('.tab-headline-wrapper').each(function () {
                $(this).find('a:eq(0)').trigger('click'); // toggle first tab
            });
        }

        // Need to recreate the ckeditor instance every time the modal appears.
        if ($modal.find('#content-html').length > 0) {
            if (CKEDITOR.instances['content-html'] !== undefined) {
                CKEDITOR.instances['content-html'].destroy();
            }
            CKEDITOR.replace('content-html', {
                language: jse.core.config.get('languageCode')
            });
            CKEDITOR.instances['content-html'].setData('');
        }

        // If contact type hidden inputs are present then we have to re-apply their value.
        if ($modal.find('#sender-type').length > 0) {
            $modal.find('#sender-type').val('sender');
        }
        if ($modal.find('#recipient-type').length > 0) {
            $modal.find('#recipient-type').val('recipient');
        }
        if ($modal.find('#reply-to-type').length > 0) {
            $modal.find('#reply-to-type').val('reply_to');
        }

        // Update Tab Counters
        jse.libs.emails.updateTabCounters($modal);
    };

    /**
     * Returns the email information from modal (DOM).
     *
     * The method will grab the values from the modal and bundle them in a single object.
     * The returned object will have the same structure as the valueMapping object. This
     * method is recursive.
     *
     * @param {object} $modal jQuery selector for the modal.
     *
     * @return {object} Returns the email data of the modal.
     */
    exports.getEmailFromModal = function ($modal) {
        var email = {};

        // Required Email Fields
        email.sender = {
            email_address: $modal.find('#sender-email').val(),
            contact_name: $modal.find('#sender-name').val(),
            contact_type: exports.CONTACT_TYPE_SENDER
        };

        email.recipient = {
            email_address: $modal.find('#recipient-email').val(),
            contact_name: $modal.find('#recipient-name').val(),
            contact_type: exports.CONTACT_TYPE_RECIPIENT
        };

        email.subject = $modal.find('#subject').val();
        email.content_html = CKEDITOR.instances['content-html'].getData();

        // Optional Email fields
        email.email_id = $modal.find('#email-id').val() !== '' ? $modal.find('#email-id').val() : null;
        email.is_pending = $modal.find('#is-pending').val() === 'true';
        email.content_plain = $modal.find('#content-plain').val() !== '' ? $modal.find('#content-plain').val() : null;

        email.reply_to = $modal.find('#reply-to-email').val() !== '' ? {} : null;
        if (email.reply_to) {
            email.reply_to.email_address = $modal.find('#reply-to-email').val();
            email.reply_to.contact_name = $modal.find('#reply-to-name').val();
            email.reply_to.contact_type = exports.CONTACT_TYPE_REPLY_TO;
        }

        // BCC & CC Contacts
        email.bcc = null;
        email.cc = null;
        var contacts = $modal.find('#contacts-table').DataTable().rows().data();

        $.each(contacts, function (index, contact) {
            if (email[contact.type] == null) {
                email[contact.type] = [];
            }

            email[contact.type].push({
                email_address: contact.email,
                contact_name: contact.name,
                contact_type: contact.type
            });
        });

        // Attachments
        email.attachments = null;
        var attachments = $modal.find('#attachments-table').DataTable().rows().data();
        $.each(attachments, function (index, attachment) {
            if (email.attachments === null) {
                email.attachments = [];
            }
            email.attachments.push(attachment);
        });

        return email;
    };

    /**
     * Loads email data on modal (DOM).
     *
     * @param {object} email Contains the email data.
     * @param {object} $modal jQuery selector for the modal.
     */
    exports.loadEmailOnModal = function (email, $modal) {
        // Required Email Fields
        $modal.find('#sender-email').val(email.sender.email_address);
        $modal.find('#sender-name').val(email.sender.contact_name);

        $modal.find('#recipient-email').val(email.recipient.email_address);
        $modal.find('#recipient-name').val(email.recipient.contact_name);

        $modal.find('#subject').val(email.subject);
        CKEDITOR.instances['content-html'].setData(email.content_html);

        $modal.find('#is-pending').val(email.is_pending ? 'true' : 'false');

        // Optional Email Fields

        if (email.email_id !== null) {
            $modal.find('#email-id').val(email.email_id);
        }

        if (email.creation_date !== null) {
            $modal.find('#creation-date').val(email.creation_date);
        }

        if (email.sent_date !== null) {
            $modal.find('#sent-date').val(email.sent_date);
        }

        if (email.reply_to !== null) {
            $modal.find('#reply-to-email').val(email.reply_to.email_address);
            $modal.find('#reply-to-name').val(email.reply_to.contact_name);
        }

        if (email.content_plain !== null) {
            $modal.find('#content-plain').val(email.content_plain);
        }

        if (email.bcc !== null) {
            $.each(email.bcc, function (index, contact) {
                var row = {
                    email: jse.libs.normalize.escapeHtml(contact.email_address),
                    name: jse.libs.normalize.escapeHtml(contact.contact_name),
                    type: jse.libs.normalize.escapeHtml(contact.contact_type)
                };
                $modal.find('#contacts-table').DataTable().row.add(row).draw();
            });
        }

        if (email.cc !== null) {
            $.each(email.cc, function (index, contact) {
                var row = {
                    email: jse.libs.normalize.escapeHtml(contact.email_address),
                    name: jse.libs.normalize.escapeHtml(contact.contact_name),
                    type: jse.libs.normalize.escapeHtml(contact.contact_type)
                };
                $modal.find('#contacts-table').DataTable().row.add(row).draw();
            });
        }

        if (email.attachments !== null) {
            $.each(email.attachments, function (index, attachment) {
                attachment.path = jse.libs.normalize.escapeHtml(attachment.path);
                $modal.find('#attachments-table').DataTable().row.add(attachment).draw();
            });
        }

        // Update Tab Counters
        jse.libs.emails.updateTabCounters($modal);
    };

    /**
     * Sends an email collection
     *
     * Provide an array of email objects and this method will send them to the requested
     * URL through AJAX POST. You can omit the url and the default EmailsController will
     * be used.
     *
     * @param {array} collection Array of email objects.
     * @param {string} ajaxUrl (optional) The AJAX URL for the POST request.
     *
     * @return {object} Returns a promise object that will provide the server's response.
     */
    exports.sendCollection = function (collection, ajaxUrl) {
        ajaxUrl = ajaxUrl || jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/Send';

        var deferred = $.Deferred(),
            data = {
            pageToken: jse.core.config.get('pageToken'),
            collection: collection
        };

        $.post(ajaxUrl, data, function (response) {
            if (response.exception) {
                deferred.reject(response);
                return;
            }
            deferred.resolve(response);
        }, 'json');

        return deferred.promise();
    };

    /**
     * Queues the email collection
     *
     * Provide an array of email objects and this method will queue them to the requested
     * URL through AJAX POST. You can omit the url and the default EmailsController will
     * be used.
     *
     * @param {array} collection Array of email objects.
     * @param {string} ajaxUrl (optional) The AJAX URL for the POST request.
     *
     * @return {object} Returns a promise object that will provide the server's response.
     */
    exports.queueCollection = function (collection, ajaxUrl) {
        ajaxUrl = ajaxUrl || jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/Queue';

        var deferred = $.Deferred(),
            data = {
            pageToken: jse.core.config.get('pageToken'),
            collection: collection
        };

        $.post(ajaxUrl, data, function (response) {
            if (response.exception) {
                deferred.reject(response);
                return;
            }
            deferred.resolve(response);
        }, 'json');

        return deferred.promise();
    };

    /**
     * Deletes an email collection
     *
     * Provide an array of email objects and this method will delete them to the requested
     * URL through AJAX POST. You can omit the url and the default EmailsController will
     * be used.
     *
     * @param {array} collection Array of email objects.
     * @param {string} ajaxUrl (optional) The AJAX URL for the POST request.
     *
     * @return {object} Returns a promise object that will provide the server's response.
     */
    exports.deleteCollection = function (collection, ajaxUrl) {
        ajaxUrl = ajaxUrl || jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/Delete';

        var deferred = $.Deferred(),
            data = {
            pageToken: jse.core.config.get('pageToken'),
            collection: collection
        };

        $.post(ajaxUrl, data, function (response) {
            if (response.exception) {
                deferred.reject(response);
                return;
            }
            deferred.resolve(response);
        }, 'json');

        return deferred.promise();
    };

    /**
     * Returns default modal buttons
     *
     * Used by various sections of the admin/emails page. With the proper use of valueMapping object
     * you can use this method in other pages too.
     *
     * @param {object} $modal jQuery selector for the modal.
     * @param {object} $table jQuery selector for the main table.
     *
     * @return {object} Returns the dialog modal buttons.
     */
    exports.getDefaultModalButtons = function ($modal, $table) {
        var buttons = [{
            text: jse.core.lang.translate('close', 'buttons'),
            click: function click() {
                $(this).dialog('close');
            }
        }, {
            text: jse.core.lang.translate('queue', 'buttons'),
            click: function click() {
                $modal.find('.tab-content.details').trigger('validator.validate');
                if ($modal.find('.tab-content.details .error').length > 0) {
                    return; // There are fields with errors.
                }
                var email = jse.libs.emails.getEmailFromModal($modal);
                jse.libs.emails.queueCollection([email]).done(function (response) {
                    $table.DataTable().ajax.reload();
                }).fail(function (response) {
                    jse.libs.modal.message({
                        title: jse.core.lang.translate('error', 'messages'),
                        content: response.message
                    });
                });
                $(this).dialog('close');
            }
        }, {
            text: jse.core.lang.translate('send', 'buttons'),
            click: function click() {
                $modal.find('.tab-content.details').trigger('validator.validate');
                if ($modal.find('.tab-content.details .error').length > 0) {
                    return; // There are fields with errors.
                }
                var email = jse.libs.emails.getEmailFromModal($modal);
                jse.libs.emails.sendCollection([email]).done(function (response) {
                    $table.DataTable().ajax.reload();
                }).fail(function (response) {
                    jse.libs.modal.message({
                        title: jse.core.lang.translate('error', 'messages'),
                        content: response.message
                    });
                });
                $(this).dialog('close');
            }
        }];

        return buttons;
    };

    /**
     * Returns preview modal buttons
     *
     * This method will return the preview modal buttons for the jQuery UI dialog widget. With the proper
     * use of valueMapping object you can use this method in other pages too.
     *
     * @param {object} $modal jQuery selector for the modal.
     * @param {object} $table jQuery selector for the main table.
     *
     * @return {object} Returns the dialog modal buttons.
     */
    exports.getPreviewModalButtons = function ($modal, $table) {
        var buttons = [{
            text: jse.core.lang.translate('close', 'buttons'),
            click: function click() {
                $(this).dialog('close');
            }
        }, {
            text: jse.core.lang.translate('delete', 'buttons'),
            click: function click() {
                var modalOptions = {
                    title: 'Delete Email Record',
                    content: 'Are you sure that you want to delete this email record?',
                    buttons: [{
                        text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                        click: function click() {
                            var email = jse.libs.emails.getEmailFromModal($modal);

                            jse.libs.emails.deleteCollection([email]).done(function (response) {
                                $table.DataTable().ajax.reload();
                            }).fail(function (response) {
                                jse.libs.modal.message({
                                    title: jse.core.lang.translate('error', 'messages'),
                                    content: response.message
                                });
                            });
                            $(this).dialog('close');
                            $modal.dialog('close');
                        }
                    }, {
                        text: jse.core.lang.translate('no', 'lightbox_buttons'),
                        click: function click() {
                            $(this).dialog('close');
                        }
                    }]
                };

                jse.libs.modal.message(modalOptions);
            }
        }, {
            text: jse.core.lang.translate('queue', 'buttons'),
            click: function click() {
                var email = jse.libs.emails.getEmailFromModal($modal);

                // Duplicate record only if the original one is already sent.
                // Otherwise we just need to update the data of the current email record.
                if (!email.is_pending) {
                    delete email.email_id; // will duplicate the record
                }

                jse.libs.emails.queueCollection([email]).done(function (response) {
                    $table.DataTable().ajax.reload();
                }).fail(function (response) {
                    jse.libs.modal.message({
                        title: jse.core.lang.translate('error', 'messages'),
                        content: response.message
                    });
                });
                $(this).dialog('close');
            }
        }, {
            text: jse.core.lang.translate('send', 'buttons'),
            click: function click() {
                var email = jse.libs.emails.getEmailFromModal($modal);
                jse.libs.emails.sendCollection([email]).done(function (response) {
                    $table.DataTable().ajax.reload();
                }).fail(function (response) {
                    jse.libs.modal.message({
                        title: jse.core.lang.translate('error', 'messages'),
                        content: response.message
                    });
                });
                $(this).dialog('close');
            }
        }];

        return buttons;
    };

    /**
     * Colorizes modal buttons for the edit mode
     *
     * jQuery UI does not support direct addition of classes to the dialog buttons,
     * so we need to apply the classes during the "create" event of the dialog.
     *
     * @param event {event} Event to trigger this function.
     * @param ui {object} Dialog UI.
     */
    exports.colorizeButtonsForEditMode = function (event, ui) {
        $(this).closest('.ui-dialog').find('.ui-button').eq(3).addClass('btn-primary'); // Send Button
    };

    /**
     * Colorizes modal buttons for preview mode
     *
     * jQuery UI does not support direct addition of classes to the dialog buttons,
     * so we need to apply the classes during the "create" event of the dialog.
     *
     * @param event {object} Event to trigger this function.
     * @param ui {object} Dialog UI.
     */
    exports.colorizeButtonsForPreviewMode = function (event, ui) {
        $(this).closest('.ui-dialog').find('.ui-button').eq(4).addClass('btn-primary'); // Send Button
    };

    /**
     * Deletes old attachments from selected removal date and before.
     *
     * @param {date} removalDate The date when the removal should start.
     * @param {object} ajaxUrl (optional) Specific ajaxUrl to be used for the request.
     * @returns {object} Returns a promise object to be used when the requests ends.
     */
    exports.deleteOldAttachments = function (removalDate, ajaxUrl) {
        ajaxUrl = ajaxUrl || jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/DeleteOldAttachments';

        var deferred = $.Deferred(),
            data = {
            pageToken: jse.core.config.get('pageToken'),
            removalDate: removalDate
        };

        $.post(ajaxUrl, data, function (response) {
            if (response.exception) {
                deferred.reject(response);
                return;
            }
            deferred.resolve(response);
        }, 'json');

        return deferred.promise();
    };

    /**
     * Deletes old emails from selected removal date and before.
     *
     * @param {string} removalDate The date when the removal should start.
     * @param {object} ajaxUrl (optional) Specific ajaxUrl to be used for the request.
     * @returns {object} Returns a promise object to be used when the requests ends.
     */
    exports.deleteOldEmails = function (removalDate, ajaxUrl) {
        ajaxUrl = ajaxUrl || jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/DeleteOldEmails';

        var deferred = $.Deferred(),
            data = {
            pageToken: jse.core.config.get('pageToken'),
            removalDate: removalDate
        };

        $.post(ajaxUrl, data, function (response) {
            if (response.exception) {
                deferred.reject(response);
                return;
            }
            deferred.resolve(response);
        }, 'json');

        return deferred.promise();
    };

    /**
     * Returns the attachments size in MB and refreshes the UI.
     *
     * This method will make a GET request to the server in order to fetch and display
     * the total attachments size, so that users know when it is time to remove old
     * attachments.
     *
     * @param {object} $target jQuery selector for the element to contain the size info.
     * @param {string} ajaxUrl (optional) Specific ajaxUrl to be used for the request.
     *
     * @return {object} Returns the promise object for chaining callbacks.
     */
    exports.getAttachmentsSize = function ($target, ajaxUrl) {
        ajaxUrl = ajaxUrl || jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/GetAttachmentsSize';

        var deferred = $.Deferred();

        $.get(ajaxUrl, function (response) {
            if (response.exception) {
                jse.libs.modal.message({
                    title: jse.core.lang.translate('error', 'messages'),
                    content: response.message
                });
                deferred.reject(response);
                return;
            }

            var size = response.size.megabytes !== 0 ? response.size.megabytes + ' MB' : response.size.bytes + ' bytes';

            $target.text(size);
            deferred.resolve(response);
        }, 'json');

        return deferred.promise();
    };

    /**
     * Updates modal tabs counters.
     *
     * Displays item number on tabs so that users know how many items there are
     * included in the contacts and attachments tables.
     *
     * @param {object} $modal The modal selector to be updated.
     * @param {object} $contactsTable (optional) The contacts table selector, default selector: '#contacts-table'.
     * @param {object} $contactsTab (optional) The contacts tab selector, default selector: '.tab-headline.bcc-cc'.
     * @param {object} $attachmentsTable (optional) The attachments table selector, default
     * selector: '#attachments-table'.
     * @param {object} $attachmentsTab (optional) The attachments tab selector, default
     * selector: '.tab-headline.attachments'.
     */
    exports.updateTabCounters = function ($modal, $contactsTable, $contactsTab, $attachmentsTable, $attachmentsTab) {
        $contactsTable = $contactsTable || $modal.find('#contacts-table');
        $contactsTab = $contactsTab || $modal.find('.tab-headline.bcc-cc');
        $attachmentsTable = $attachmentsTable || $modal.find('#attachments-table');
        $attachmentsTab = $attachmentsTab || $modal.find('.tab-headline.attachments');

        if ($contactsTable.length === 0) {
            return; // There is no such table (emails.js unit testing).
        }

        var contactsCount = $contactsTable.DataTable().rows().data().length,
            newContactsText = $contactsTab.text().replace(/\(.*\)/g, '(' + contactsCount + ')'),
            attachmentsCount = $attachmentsTable.DataTable().rows().data().length,
            newAttachmentsText = $attachmentsTab.text().replace(/\(.*\)/g, '(' + attachmentsCount + ')');

        if (newContactsText.indexOf('(') === -1) {
            newContactsText += ' (' + contactsCount + ')';
        }

        if (newAttachmentsText.indexOf('(') === -1) {
            newAttachmentsText += ' (' + attachmentsCount + ')';
        }

        $contactsTab.text(newContactsText);
        $attachmentsTab.text(newAttachmentsText);
    };

    /**
     * Returns an object array with the selected emails of the main emails table.
     *
     * @param {object} $table (optional) The main table selector, if omitted the "#emails-table" selector
     * will be used.
     *
     * @returns {array} Returns an array with the emails data (collection).
     */
    exports.getSelectedEmails = function ($table) {
        $table = $table || $('#emails-table');

        var collection = [];

        $table.find('tr td input:checked').each(function (index, checkbox) {
            collection.push($(checkbox).parents('tr').data());
        });

        return collection;
    };
})(jse.libs.emails);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwiZW1haWxzIiwiZXhwb3J0cyIsIkNPTlRBQ1RfVFlQRV9TRU5ERVIiLCJDT05UQUNUX1RZUEVfUkVDSVBJRU5UIiwiQ09OVEFDVF9UWVBFX1JFUExZX1RPIiwiQ09OVEFDVF9UWVBFX0JDQyIsIkNPTlRBQ1RfVFlQRV9DQyIsInJlc2V0TW9kYWwiLCIkbW9kYWwiLCJmaW5kIiwidmFsIiwicHJvcCIsInRyaWdnZXIiLCJsZW5ndGgiLCJEYXRhVGFibGUiLCJjbGVhciIsImRyYXciLCJjc3MiLCJzaG93IiwiZWFjaCIsIiQiLCJDS0VESVRPUiIsImluc3RhbmNlcyIsInVuZGVmaW5lZCIsImRlc3Ryb3kiLCJyZXBsYWNlIiwibGFuZ3VhZ2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0Iiwic2V0RGF0YSIsInVwZGF0ZVRhYkNvdW50ZXJzIiwiZ2V0RW1haWxGcm9tTW9kYWwiLCJlbWFpbCIsInNlbmRlciIsImVtYWlsX2FkZHJlc3MiLCJjb250YWN0X25hbWUiLCJjb250YWN0X3R5cGUiLCJyZWNpcGllbnQiLCJzdWJqZWN0IiwiY29udGVudF9odG1sIiwiZ2V0RGF0YSIsImVtYWlsX2lkIiwiaXNfcGVuZGluZyIsImNvbnRlbnRfcGxhaW4iLCJyZXBseV90byIsImJjYyIsImNjIiwiY29udGFjdHMiLCJyb3dzIiwiZGF0YSIsImluZGV4IiwiY29udGFjdCIsInR5cGUiLCJwdXNoIiwibmFtZSIsImF0dGFjaG1lbnRzIiwiYXR0YWNobWVudCIsImxvYWRFbWFpbE9uTW9kYWwiLCJjcmVhdGlvbl9kYXRlIiwic2VudF9kYXRlIiwicm93Iiwibm9ybWFsaXplIiwiZXNjYXBlSHRtbCIsImFkZCIsInBhdGgiLCJzZW5kQ29sbGVjdGlvbiIsImNvbGxlY3Rpb24iLCJhamF4VXJsIiwiZGVmZXJyZWQiLCJEZWZlcnJlZCIsInBhZ2VUb2tlbiIsInBvc3QiLCJyZXNwb25zZSIsImV4Y2VwdGlvbiIsInJlamVjdCIsInJlc29sdmUiLCJwcm9taXNlIiwicXVldWVDb2xsZWN0aW9uIiwiZGVsZXRlQ29sbGVjdGlvbiIsImdldERlZmF1bHRNb2RhbEJ1dHRvbnMiLCIkdGFibGUiLCJidXR0b25zIiwidGV4dCIsImxhbmciLCJ0cmFuc2xhdGUiLCJjbGljayIsImRpYWxvZyIsImRvbmUiLCJhamF4IiwicmVsb2FkIiwiZmFpbCIsIm1vZGFsIiwibWVzc2FnZSIsInRpdGxlIiwiY29udGVudCIsImdldFByZXZpZXdNb2RhbEJ1dHRvbnMiLCJtb2RhbE9wdGlvbnMiLCJjb2xvcml6ZUJ1dHRvbnNGb3JFZGl0TW9kZSIsImV2ZW50IiwidWkiLCJjbG9zZXN0IiwiZXEiLCJhZGRDbGFzcyIsImNvbG9yaXplQnV0dG9uc0ZvclByZXZpZXdNb2RlIiwiZGVsZXRlT2xkQXR0YWNobWVudHMiLCJyZW1vdmFsRGF0ZSIsImRlbGV0ZU9sZEVtYWlscyIsImdldEF0dGFjaG1lbnRzU2l6ZSIsIiR0YXJnZXQiLCJzaXplIiwibWVnYWJ5dGVzIiwiYnl0ZXMiLCIkY29udGFjdHNUYWJsZSIsIiRjb250YWN0c1RhYiIsIiRhdHRhY2htZW50c1RhYmxlIiwiJGF0dGFjaG1lbnRzVGFiIiwiY29udGFjdHNDb3VudCIsIm5ld0NvbnRhY3RzVGV4dCIsImF0dGFjaG1lbnRzQ291bnQiLCJuZXdBdHRhY2htZW50c1RleHQiLCJpbmRleE9mIiwiZ2V0U2VsZWN0ZWRFbWFpbHMiLCJjaGVja2JveCIsInBhcmVudHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQyxNQUFULEdBQWtCRixJQUFJQyxJQUFKLENBQVNDLE1BQVQsSUFBbUIsRUFBckM7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxDQUFDLFVBQVVDLE9BQVYsRUFBbUI7O0FBRWhCOztBQUVBQSxZQUFRQyxtQkFBUixHQUE4QixRQUE5QjtBQUNBRCxZQUFRRSxzQkFBUixHQUFpQyxXQUFqQztBQUNBRixZQUFRRyxx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LENBQUMsQ0FBekMsRUFBNEM7QUFDeENELGtDQUFzQixPQUFPRCxnQkFBUCxHQUEwQixHQUFoRDtBQUNIOztBQUVETCxxQkFBYS9CLElBQWIsQ0FBa0JtQyxlQUFsQjtBQUNBRix3QkFBZ0JqQyxJQUFoQixDQUFxQnFDLGtCQUFyQjtBQUNILEtBMUJEOztBQTRCQTs7Ozs7Ozs7QUFRQXZILFlBQVF5SCxpQkFBUixHQUE0QixVQUFVekMsTUFBVixFQUFrQjtBQUMxQ0EsaUJBQVNBLFVBQVU3RCxFQUFFLGVBQUYsQ0FBbkI7O0FBRUEsWUFBSStDLGFBQWEsRUFBakI7O0FBRUFjLGVBQ0t4RSxJQURMLENBQ1UscUJBRFYsRUFFS1UsSUFGTCxDQUVVLFVBQVVnQyxLQUFWLEVBQWlCd0UsUUFBakIsRUFBMkI7QUFDN0J4RCx1QkFBV2IsSUFBWCxDQUFnQmxDLEVBQUV1RyxRQUFGLEVBQVlDLE9BQVosQ0FBb0IsSUFBcEIsRUFBMEIxRSxJQUExQixFQUFoQjtBQUNILFNBSkw7O0FBTUEsZUFBT2lCLFVBQVA7QUFDSCxLQVpEO0FBY0gsQ0F4cEJELEVBd3BCR3JFLElBQUlDLElBQUosQ0FBU0MsTUF4cEJaIiwiZmlsZSI6ImVtYWlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZW1haWxzLmpzIDIwMjItMDUtMTRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDIyIEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5qc2UubGlicy5lbWFpbHMgPSBqc2UubGlicy5lbWFpbHMgfHwge307XG5cbi8qKlxuICogIyMgRW1haWxzIExpYnJhcnlcbiAqXG4gKiBUaGlzIGxpYnJhcnkgY29udGFpbnMgYWxsIHRoZSBhZG1pbi9lbWFpbHMgcGFnZSBjb21tb24gZnVuY3Rpb25hbGl0eSBhbmQgaXMgdXNlZCBieSB0aGUgcGFnZVxuICogY29udHJvbGxlcnMuIFlvdSBtaWdodCBhbHNvIHVzZSB0aGlzIGxpYnJhcnkgaW4gb3RoZXIgcGFnZXMgd2hlcmUgeW91IG5lZWQgdG8gdHJpZ2dlciBzcGVjaWZpY1xuICogZW1haWwgb3BlcmF0aW9ucyBpbiB0aGUgc2VydmVyLlxuICpcbiAqIFlvdSB3aWxsIG5lZWQgdG8gcHJvdmlkZSB0aGUgZnVsbCBVUkwgaW4gb3JkZXIgdG8gbG9hZCB0aGlzIGxpYnJhcnkgYXMgYSBkZXBlbmRlbmN5IHRvIGEgbW9kdWxlOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGd4LmNvbnRyb2xsZXIubW9kdWxlKFxuICogICAnbXlfY3VzdG9tX3BhZ2UnLFxuICpcbiAqICAgW1xuICogICAgICBneC5zb3VyY2UgKyAnL2xpYnMvZW1haWxzJ1xuICogICBdLFxuICpcbiAqICAgZnVuY3Rpb24oZGF0YSkge1xuICogICAgICAvLyBNb2R1bGUgY29kZSAuLi5cbiAqICAgfSk7XG4gKmBgYFxuICpcbiAqIFJlcXVpcmVkIFRyYW5zbGF0aW9uIFNlY3Rpb25zOiAnYWRtaW5fbGFiZWxzJywgJ2J1dHRvbnMnLCAnZGJfYmFja3VwJywgJ2VtYWlscycsICdsaWdodGJveF9idXR0b25zJywgJ21lc3NhZ2VzJ1xuICpcbiAqIEBtb2R1bGUgQWRtaW4vTGlicy9lbWFpbHNcbiAqIEBleHBvcnRzIGpzZS5saWJzLmVtYWlsc1xuICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGV4cG9ydHMuQ09OVEFDVF9UWVBFX1NFTkRFUiA9ICdzZW5kZXInO1xuICAgIGV4cG9ydHMuQ09OVEFDVF9UWVBFX1JFQ0lQSUVOVCA9ICdyZWNpcGllbnQnO1xuICAgIGV4cG9ydHMuQ09OVEFDVF9UWVBFX1JFUExZX1RPID0gJ3JlcGx5X3RvJztcbiAgICBleHBvcnRzLkNPTlRBQ1RfVFlQRV9CQ0MgPSAnYmNjJztcbiAgICBleHBvcnRzLkNPTlRBQ1RfVFlQRV9DQyA9ICdjYyc7XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBNb2RhbCAoRE9NKVxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCByZXNldCB0aGUgZW1haWxzIG1vZGFsIGJhY2sgdG8gaXRzIGluaXRpYWwgc3RhdGUuIFRoZSBkZWZhdWx0XG4gICAgICogbW9kYWwgbWFya3VwIGlzIHVzZWQgaW4gdGhlIGFkbWluL2VtYWlscyBwYWdlLCBidXQgdGhpcyBtZXRob2QgY2FuIHdvcmsgd2l0aG91dFxuICAgICAqIGFsbCB0aGUgZWxlbWVudHMgdG9vLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRtb2RhbCBqUXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBtb2RhbC5cbiAgICAgKi9cbiAgICBleHBvcnRzLnJlc2V0TW9kYWwgPSBmdW5jdGlvbiAoJG1vZGFsKSB7XG4gICAgICAgIC8vIENsZWFyIGJhc2ljIGVsZW1lbnRzXG4gICAgICAgICRtb2RhbC5maW5kKCdpbnB1dCwgdGV4dGFyZWEnKS52YWwoJycpO1xuICAgICAgICAkbW9kYWwuZmluZCgnc2VsZWN0IG9wdGlvbjpmaXJzdCcpLnByb3AoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHZhbGlkYXRpb24gY2xhc3Nlcy5cbiAgICAgICAgJG1vZGFsLnRyaWdnZXIoJ3ZhbGlkYXRvci5yZXNldCcpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgcm93cyBmcm9tIERhdGFUYWJsZXMuXG4gICAgICAgIGlmICgkbW9kYWwuZmluZCgnLmRhdGFUYWJsZXNfd3JhcHBlcicpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcuZGF0YVRhYmxlc193cmFwcGVyIHRhYmxlJykuRGF0YVRhYmxlKCkuY2xlYXIoKS5kcmF3KCk7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLmRhdGFUYWJsZXNfd3JhcHBlcicpLmZpbmQoJy5kYXRhVGFibGVzX2xlbmd0aCBzZWxlY3Qgb3B0aW9uOmVxKDApJykucHJvcChcbiAgICAgICAgICAgICAgICAnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBhbGwgdGFiIHdpZGdldHMgdG8gdGhlIGZpcnN0IHRhYi5cbiAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcudGFiLWhlYWRsaW5lLXdyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLnRhYi1oZWFkbGluZScpLmNzcygnY29sb3InLCAnJykuc2hvdygpO1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy50YWItaGVhZGxpbmUtd3JhcHBlcicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnYTplcSgwKScpLnRyaWdnZXIoJ2NsaWNrJyk7IC8vIHRvZ2dsZSBmaXJzdCB0YWJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTmVlZCB0byByZWNyZWF0ZSB0aGUgY2tlZGl0b3IgaW5zdGFuY2UgZXZlcnkgdGltZSB0aGUgbW9kYWwgYXBwZWFycy5cbiAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcjY29udGVudC1odG1sJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKENLRURJVE9SLmluc3RhbmNlc1snY29udGVudC1odG1sJ10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIENLRURJVE9SLmluc3RhbmNlc1snY29udGVudC1odG1sJ10uZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQ0tFRElUT1IucmVwbGFjZSgnY29udGVudC1odG1sJywge1xuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiBqc2UuY29yZS5jb25maWcuZ2V0KCdsYW5ndWFnZUNvZGUnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBDS0VESVRPUi5pbnN0YW5jZXNbJ2NvbnRlbnQtaHRtbCddLnNldERhdGEoJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgY29udGFjdCB0eXBlIGhpZGRlbiBpbnB1dHMgYXJlIHByZXNlbnQgdGhlbiB3ZSBoYXZlIHRvIHJlLWFwcGx5IHRoZWlyIHZhbHVlLlxuICAgICAgICBpZiAoJG1vZGFsLmZpbmQoJyNzZW5kZXItdHlwZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcjc2VuZGVyLXR5cGUnKS52YWwoJ3NlbmRlcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkbW9kYWwuZmluZCgnI3JlY2lwaWVudC10eXBlJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNyZWNpcGllbnQtdHlwZScpLnZhbCgncmVjaXBpZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcjcmVwbHktdG8tdHlwZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcjcmVwbHktdG8tdHlwZScpLnZhbCgncmVwbHlfdG8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSBUYWIgQ291bnRlcnNcbiAgICAgICAganNlLmxpYnMuZW1haWxzLnVwZGF0ZVRhYkNvdW50ZXJzKCRtb2RhbCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGVtYWlsIGluZm9ybWF0aW9uIGZyb20gbW9kYWwgKERPTSkuXG4gICAgICpcbiAgICAgKiBUaGUgbWV0aG9kIHdpbGwgZ3JhYiB0aGUgdmFsdWVzIGZyb20gdGhlIG1vZGFsIGFuZCBidW5kbGUgdGhlbSBpbiBhIHNpbmdsZSBvYmplY3QuXG4gICAgICogVGhlIHJldHVybmVkIG9iamVjdCB3aWxsIGhhdmUgdGhlIHNhbWUgc3RydWN0dXJlIGFzIHRoZSB2YWx1ZU1hcHBpbmcgb2JqZWN0LiBUaGlzXG4gICAgICogbWV0aG9kIGlzIHJlY3Vyc2l2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkbW9kYWwgalF1ZXJ5IHNlbGVjdG9yIGZvciB0aGUgbW9kYWwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgdGhlIGVtYWlsIGRhdGEgb2YgdGhlIG1vZGFsLlxuICAgICAqL1xuICAgIGV4cG9ydHMuZ2V0RW1haWxGcm9tTW9kYWwgPSBmdW5jdGlvbiAoJG1vZGFsKSB7XG4gICAgICAgIHZhciBlbWFpbCA9IHt9O1xuXG4gICAgICAgIC8vIFJlcXVpcmVkIEVtYWlsIEZpZWxkc1xuICAgICAgICBlbWFpbC5zZW5kZXIgPSB7XG4gICAgICAgICAgICBlbWFpbF9hZGRyZXNzOiAkbW9kYWwuZmluZCgnI3NlbmRlci1lbWFpbCcpLnZhbCgpLFxuICAgICAgICAgICAgY29udGFjdF9uYW1lOiAkbW9kYWwuZmluZCgnI3NlbmRlci1uYW1lJykudmFsKCksXG4gICAgICAgICAgICBjb250YWN0X3R5cGU6IGV4cG9ydHMuQ09OVEFDVF9UWVBFX1NFTkRFUlxuICAgICAgICB9O1xuXG4gICAgICAgIGVtYWlsLnJlY2lwaWVudCA9IHtcbiAgICAgICAgICAgIGVtYWlsX2FkZHJlc3M6ICRtb2RhbC5maW5kKCcjcmVjaXBpZW50LWVtYWlsJykudmFsKCksXG4gICAgICAgICAgICBjb250YWN0X25hbWU6ICRtb2RhbC5maW5kKCcjcmVjaXBpZW50LW5hbWUnKS52YWwoKSxcbiAgICAgICAgICAgIGNvbnRhY3RfdHlwZTogZXhwb3J0cy5DT05UQUNUX1RZUEVfUkVDSVBJRU5UXG4gICAgICAgIH07XG5cbiAgICAgICAgZW1haWwuc3ViamVjdCA9ICRtb2RhbC5maW5kKCcjc3ViamVjdCcpLnZhbCgpO1xuICAgICAgICBlbWFpbC5jb250ZW50X2h0bWwgPSBDS0VESVRPUi5pbnN0YW5jZXNbJ2NvbnRlbnQtaHRtbCddLmdldERhdGEoKTtcblxuICAgICAgICAvLyBPcHRpb25hbCBFbWFpbCBmaWVsZHNcbiAgICAgICAgZW1haWwuZW1haWxfaWQgPSAoJG1vZGFsLmZpbmQoJyNlbWFpbC1pZCcpLnZhbCgpICE9PSAnJykgPyAkbW9kYWwuZmluZCgnI2VtYWlsLWlkJykudmFsKCkgOlxuICAgICAgICAgICAgbnVsbDtcbiAgICAgICAgZW1haWwuaXNfcGVuZGluZyA9ICgkbW9kYWwuZmluZCgnI2lzLXBlbmRpbmcnKS52YWwoKSA9PT0gJ3RydWUnKTtcbiAgICAgICAgZW1haWwuY29udGVudF9wbGFpbiA9ICgkbW9kYWwuZmluZCgnI2NvbnRlbnQtcGxhaW4nKS52YWwoKSAhPT0gJycpID8gJG1vZGFsLmZpbmQoXG4gICAgICAgICAgICAnI2NvbnRlbnQtcGxhaW4nKS52YWwoKSA6IG51bGw7XG5cbiAgICAgICAgZW1haWwucmVwbHlfdG8gPSAoJG1vZGFsLmZpbmQoJyNyZXBseS10by1lbWFpbCcpLnZhbCgpICE9PSAnJykgPyB7fSA6IG51bGw7XG4gICAgICAgIGlmIChlbWFpbC5yZXBseV90bykge1xuICAgICAgICAgICAgZW1haWwucmVwbHlfdG8uZW1haWxfYWRkcmVzcyA9ICRtb2RhbC5maW5kKCcjcmVwbHktdG8tZW1haWwnKS52YWwoKTtcbiAgICAgICAgICAgIGVtYWlsLnJlcGx5X3RvLmNvbnRhY3RfbmFtZSA9ICRtb2RhbC5maW5kKCcjcmVwbHktdG8tbmFtZScpLnZhbCgpO1xuICAgICAgICAgICAgZW1haWwucmVwbHlfdG8uY29udGFjdF90eXBlID0gZXhwb3J0cy5DT05UQUNUX1RZUEVfUkVQTFlfVE87XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCQ0MgJiBDQyBDb250YWN0c1xuICAgICAgICBlbWFpbC5iY2MgPSBudWxsO1xuICAgICAgICBlbWFpbC5jYyA9IG51bGw7XG4gICAgICAgIHZhciBjb250YWN0cyA9ICRtb2RhbC5maW5kKCcjY29udGFjdHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKCkuZGF0YSgpO1xuXG4gICAgICAgICQuZWFjaChjb250YWN0cywgZnVuY3Rpb24gKGluZGV4LCBjb250YWN0KSB7XG4gICAgICAgICAgICBpZiAoZW1haWxbY29udGFjdC50eXBlXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZW1haWxbY29udGFjdC50eXBlXSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbWFpbFtjb250YWN0LnR5cGVdLnB1c2goe1xuICAgICAgICAgICAgICAgIGVtYWlsX2FkZHJlc3M6IGNvbnRhY3QuZW1haWwsXG4gICAgICAgICAgICAgICAgY29udGFjdF9uYW1lOiBjb250YWN0Lm5hbWUsXG4gICAgICAgICAgICAgICAgY29udGFjdF90eXBlOiBjb250YWN0LnR5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBdHRhY2htZW50c1xuICAgICAgICBlbWFpbC5hdHRhY2htZW50cyA9IG51bGw7XG4gICAgICAgIHZhciBhdHRhY2htZW50cyA9ICRtb2RhbC5maW5kKCcjYXR0YWNobWVudHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3dzKCkuZGF0YSgpO1xuICAgICAgICAkLmVhY2goYXR0YWNobWVudHMsIGZ1bmN0aW9uIChpbmRleCwgYXR0YWNobWVudCkge1xuICAgICAgICAgICAgaWYgKGVtYWlsLmF0dGFjaG1lbnRzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZW1haWwuYXR0YWNobWVudHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVtYWlsLmF0dGFjaG1lbnRzLnB1c2goYXR0YWNobWVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBlbWFpbDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTG9hZHMgZW1haWwgZGF0YSBvbiBtb2RhbCAoRE9NKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlbWFpbCBDb250YWlucyB0aGUgZW1haWwgZGF0YS5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJG1vZGFsIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIG1vZGFsLlxuICAgICAqL1xuICAgIGV4cG9ydHMubG9hZEVtYWlsT25Nb2RhbCA9IGZ1bmN0aW9uIChlbWFpbCwgJG1vZGFsKSB7XG4gICAgICAgIC8vIFJlcXVpcmVkIEVtYWlsIEZpZWxkc1xuICAgICAgICAkbW9kYWwuZmluZCgnI3NlbmRlci1lbWFpbCcpLnZhbChlbWFpbC5zZW5kZXIuZW1haWxfYWRkcmVzcyk7XG4gICAgICAgICRtb2RhbC5maW5kKCcjc2VuZGVyLW5hbWUnKS52YWwoZW1haWwuc2VuZGVyLmNvbnRhY3RfbmFtZSk7XG5cbiAgICAgICAgJG1vZGFsLmZpbmQoJyNyZWNpcGllbnQtZW1haWwnKS52YWwoZW1haWwucmVjaXBpZW50LmVtYWlsX2FkZHJlc3MpO1xuICAgICAgICAkbW9kYWwuZmluZCgnI3JlY2lwaWVudC1uYW1lJykudmFsKGVtYWlsLnJlY2lwaWVudC5jb250YWN0X25hbWUpO1xuXG4gICAgICAgICRtb2RhbC5maW5kKCcjc3ViamVjdCcpLnZhbChlbWFpbC5zdWJqZWN0KTtcbiAgICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzWydjb250ZW50LWh0bWwnXS5zZXREYXRhKGVtYWlsLmNvbnRlbnRfaHRtbCk7XG5cbiAgICAgICAgJG1vZGFsLmZpbmQoJyNpcy1wZW5kaW5nJykudmFsKChlbWFpbC5pc19wZW5kaW5nKSA/ICd0cnVlJyA6ICdmYWxzZScpO1xuXG4gICAgICAgIC8vIE9wdGlvbmFsIEVtYWlsIEZpZWxkc1xuXG4gICAgICAgIGlmIChlbWFpbC5lbWFpbF9pZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNlbWFpbC1pZCcpLnZhbChlbWFpbC5lbWFpbF9pZCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW1haWwuY3JlYXRpb25fZGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNjcmVhdGlvbi1kYXRlJykudmFsKGVtYWlsLmNyZWF0aW9uX2RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVtYWlsLnNlbnRfZGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNzZW50LWRhdGUnKS52YWwoZW1haWwuc2VudF9kYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbWFpbC5yZXBseV90byAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNyZXBseS10by1lbWFpbCcpLnZhbChlbWFpbC5yZXBseV90by5lbWFpbF9hZGRyZXNzKTtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcjcmVwbHktdG8tbmFtZScpLnZhbChlbWFpbC5yZXBseV90by5jb250YWN0X25hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVtYWlsLmNvbnRlbnRfcGxhaW4gIT09IG51bGwpIHtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcjY29udGVudC1wbGFpbicpLnZhbChlbWFpbC5jb250ZW50X3BsYWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbWFpbC5iY2MgIT09IG51bGwpIHtcbiAgICAgICAgICAgICQuZWFjaChlbWFpbC5iY2MsIGZ1bmN0aW9uIChpbmRleCwgY29udGFjdCkge1xuICAgICAgICAgICAgICAgIHZhciByb3cgPSB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBqc2UubGlicy5ub3JtYWxpemUuZXNjYXBlSHRtbChjb250YWN0LmVtYWlsX2FkZHJlc3MpLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBqc2UubGlicy5ub3JtYWxpemUuZXNjYXBlSHRtbChjb250YWN0LmNvbnRhY3RfbmFtZSksXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IGpzZS5saWJzLm5vcm1hbGl6ZS5lc2NhcGVIdG1sKGNvbnRhY3QuY29udGFjdF90eXBlKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNjb250YWN0cy10YWJsZScpLkRhdGFUYWJsZSgpLnJvdy5hZGQocm93KS5kcmF3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbWFpbC5jYyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgJC5lYWNoKGVtYWlsLmNjLCBmdW5jdGlvbiAoaW5kZXgsIGNvbnRhY3QpIHtcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0ge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDoganNlLmxpYnMubm9ybWFsaXplLmVzY2FwZUh0bWwoY29udGFjdC5lbWFpbF9hZGRyZXNzKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZToganNlLmxpYnMubm9ybWFsaXplLmVzY2FwZUh0bWwoY29udGFjdC5jb250YWN0X25hbWUpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBqc2UubGlicy5ub3JtYWxpemUuZXNjYXBlSHRtbChjb250YWN0LmNvbnRhY3RfdHlwZSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcjY29udGFjdHMtdGFibGUnKS5EYXRhVGFibGUoKS5yb3cuYWRkKHJvdykuZHJhdygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW1haWwuYXR0YWNobWVudHMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICQuZWFjaChlbWFpbC5hdHRhY2htZW50cywgZnVuY3Rpb24gKGluZGV4LCBhdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5wYXRoID0ganNlLmxpYnMubm9ybWFsaXplLmVzY2FwZUh0bWwoYXR0YWNobWVudC5wYXRoKTtcbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnI2F0dGFjaG1lbnRzLXRhYmxlJykuRGF0YVRhYmxlKCkucm93LmFkZChhdHRhY2htZW50KS5kcmF3KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZSBUYWIgQ291bnRlcnNcbiAgICAgICAganNlLmxpYnMuZW1haWxzLnVwZGF0ZVRhYkNvdW50ZXJzKCRtb2RhbCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNlbmRzIGFuIGVtYWlsIGNvbGxlY3Rpb25cbiAgICAgKlxuICAgICAqIFByb3ZpZGUgYW4gYXJyYXkgb2YgZW1haWwgb2JqZWN0cyBhbmQgdGhpcyBtZXRob2Qgd2lsbCBzZW5kIHRoZW0gdG8gdGhlIHJlcXVlc3RlZFxuICAgICAqIFVSTCB0aHJvdWdoIEFKQVggUE9TVC4gWW91IGNhbiBvbWl0IHRoZSB1cmwgYW5kIHRoZSBkZWZhdWx0IEVtYWlsc0NvbnRyb2xsZXIgd2lsbFxuICAgICAqIGJlIHVzZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBjb2xsZWN0aW9uIEFycmF5IG9mIGVtYWlsIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFqYXhVcmwgKG9wdGlvbmFsKSBUaGUgQUpBWCBVUkwgZm9yIHRoZSBQT1NUIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgYSBwcm9taXNlIG9iamVjdCB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAgICovXG4gICAgZXhwb3J0cy5zZW5kQ29sbGVjdGlvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBhamF4VXJsKSB7XG4gICAgICAgIGFqYXhVcmwgPSBhamF4VXJsIHx8IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89RW1haWxzL1NlbmQnO1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKSxcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKSxcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICQucG9zdChhamF4VXJsLCBkYXRhLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5leGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9LCAnanNvbicpO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFF1ZXVlcyB0aGUgZW1haWwgY29sbGVjdGlvblxuICAgICAqXG4gICAgICogUHJvdmlkZSBhbiBhcnJheSBvZiBlbWFpbCBvYmplY3RzIGFuZCB0aGlzIG1ldGhvZCB3aWxsIHF1ZXVlIHRoZW0gdG8gdGhlIHJlcXVlc3RlZFxuICAgICAqIFVSTCB0aHJvdWdoIEFKQVggUE9TVC4gWW91IGNhbiBvbWl0IHRoZSB1cmwgYW5kIHRoZSBkZWZhdWx0IEVtYWlsc0NvbnRyb2xsZXIgd2lsbFxuICAgICAqIGJlIHVzZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBjb2xsZWN0aW9uIEFycmF5IG9mIGVtYWlsIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFqYXhVcmwgKG9wdGlvbmFsKSBUaGUgQUpBWCBVUkwgZm9yIHRoZSBQT1NUIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgYSBwcm9taXNlIG9iamVjdCB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAgICovXG4gICAgZXhwb3J0cy5xdWV1ZUNvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgYWpheFVybCkge1xuICAgICAgICBhamF4VXJsID0gYWpheFVybCB8fCBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUVtYWlscy9RdWV1ZSc7XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpLFxuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpLFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IGNvbGxlY3Rpb25cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgJC5wb3N0KGFqYXhVcmwsIGRhdGEsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0sICdqc29uJyk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBhbiBlbWFpbCBjb2xsZWN0aW9uXG4gICAgICpcbiAgICAgKiBQcm92aWRlIGFuIGFycmF5IG9mIGVtYWlsIG9iamVjdHMgYW5kIHRoaXMgbWV0aG9kIHdpbGwgZGVsZXRlIHRoZW0gdG8gdGhlIHJlcXVlc3RlZFxuICAgICAqIFVSTCB0aHJvdWdoIEFKQVggUE9TVC4gWW91IGNhbiBvbWl0IHRoZSB1cmwgYW5kIHRoZSBkZWZhdWx0IEVtYWlsc0NvbnRyb2xsZXIgd2lsbFxuICAgICAqIGJlIHVzZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FycmF5fSBjb2xsZWN0aW9uIEFycmF5IG9mIGVtYWlsIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFqYXhVcmwgKG9wdGlvbmFsKSBUaGUgQUpBWCBVUkwgZm9yIHRoZSBQT1NUIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgYSBwcm9taXNlIG9iamVjdCB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgc2VydmVyJ3MgcmVzcG9uc2UuXG4gICAgICovXG4gICAgZXhwb3J0cy5kZWxldGVDb2xsZWN0aW9uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIGFqYXhVcmwpIHtcbiAgICAgICAgYWpheFVybCA9IGFqYXhVcmwgfHwganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1FbWFpbHMvRGVsZXRlJztcblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCksXG4gICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyksXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAkLnBvc3QoYWpheFVybCwgZGF0YSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgfSwgJ2pzb24nKTtcblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGRlZmF1bHQgbW9kYWwgYnV0dG9uc1xuICAgICAqXG4gICAgICogVXNlZCBieSB2YXJpb3VzIHNlY3Rpb25zIG9mIHRoZSBhZG1pbi9lbWFpbHMgcGFnZS4gV2l0aCB0aGUgcHJvcGVyIHVzZSBvZiB2YWx1ZU1hcHBpbmcgb2JqZWN0XG4gICAgICogeW91IGNhbiB1c2UgdGhpcyBtZXRob2QgaW4gb3RoZXIgcGFnZXMgdG9vLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRtb2RhbCBqUXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBtb2RhbC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJHRhYmxlIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIG1haW4gdGFibGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgdGhlIGRpYWxvZyBtb2RhbCBidXR0b25zLlxuICAgICAqL1xuICAgIGV4cG9ydHMuZ2V0RGVmYXVsdE1vZGFsQnV0dG9ucyA9IGZ1bmN0aW9uICgkbW9kYWwsICR0YWJsZSkge1xuICAgICAgICB2YXIgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3F1ZXVlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLnRhYi1jb250ZW50LmRldGFpbHMnKS50cmlnZ2VyKCd2YWxpZGF0b3IudmFsaWRhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcudGFiLWNvbnRlbnQuZGV0YWlscyAuZXJyb3InKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIFRoZXJlIGFyZSBmaWVsZHMgd2l0aCBlcnJvcnMuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0ganNlLmxpYnMuZW1haWxzLmdldEVtYWlsRnJvbU1vZGFsKCRtb2RhbCk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5xdWV1ZUNvbGxlY3Rpb24oW2VtYWlsXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0YWJsZS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlc3BvbnNlLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzZW5kJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLnRhYi1jb250ZW50LmRldGFpbHMnKS50cmlnZ2VyKCd2YWxpZGF0b3IudmFsaWRhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRtb2RhbC5maW5kKCcudGFiLWNvbnRlbnQuZGV0YWlscyAuZXJyb3InKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIFRoZXJlIGFyZSBmaWVsZHMgd2l0aCBlcnJvcnMuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGVtYWlsID0ganNlLmxpYnMuZW1haWxzLmdldEVtYWlsRnJvbU1vZGFsKCRtb2RhbCk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5zZW5kQ29sbGVjdGlvbihbZW1haWxdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhYmxlLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzcG9uc2UubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gYnV0dG9ucztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBwcmV2aWV3IG1vZGFsIGJ1dHRvbnNcbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgcmV0dXJuIHRoZSBwcmV2aWV3IG1vZGFsIGJ1dHRvbnMgZm9yIHRoZSBqUXVlcnkgVUkgZGlhbG9nIHdpZGdldC4gV2l0aCB0aGUgcHJvcGVyXG4gICAgICogdXNlIG9mIHZhbHVlTWFwcGluZyBvYmplY3QgeW91IGNhbiB1c2UgdGhpcyBtZXRob2QgaW4gb3RoZXIgcGFnZXMgdG9vLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRtb2RhbCBqUXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBtb2RhbC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJHRhYmxlIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIG1haW4gdGFibGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgdGhlIGRpYWxvZyBtb2RhbCBidXR0b25zLlxuICAgICAqL1xuICAgIGV4cG9ydHMuZ2V0UHJldmlld01vZGFsQnV0dG9ucyA9IGZ1bmN0aW9uICgkbW9kYWwsICR0YWJsZSkge1xuICAgICAgICB2YXIgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2RlbGV0ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1vZGFsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVsZXRlIEVtYWlsIFJlY29yZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiAnQXJlIHlvdSBzdXJlIHRoYXQgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgZW1haWwgcmVjb3JkPycsXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgneWVzJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbWFpbCA9IGpzZS5saWJzLmVtYWlscy5nZXRFbWFpbEZyb21Nb2RhbCgkbW9kYWwpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5lbWFpbHMuZGVsZXRlQ29sbGVjdGlvbihbZW1haWxdKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGFibGUuRGF0YVRhYmxlKCkuYWpheC5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdtZXNzYWdlcycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzcG9uc2UubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm8nLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZShtb2RhbE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3F1ZXVlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZW1haWwgPSBqc2UubGlicy5lbWFpbHMuZ2V0RW1haWxGcm9tTW9kYWwoJG1vZGFsKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBEdXBsaWNhdGUgcmVjb3JkIG9ubHkgaWYgdGhlIG9yaWdpbmFsIG9uZSBpcyBhbHJlYWR5IHNlbnQuXG4gICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSB3ZSBqdXN0IG5lZWQgdG8gdXBkYXRlIHRoZSBkYXRhIG9mIHRoZSBjdXJyZW50IGVtYWlsIHJlY29yZC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbWFpbC5pc19wZW5kaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZW1haWwuZW1haWxfaWQ7IC8vIHdpbGwgZHVwbGljYXRlIHRoZSByZWNvcmRcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5xdWV1ZUNvbGxlY3Rpb24oW2VtYWlsXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0YWJsZS5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlc3BvbnNlLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzZW5kJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZW1haWwgPSBqc2UubGlicy5lbWFpbHMuZ2V0RW1haWxGcm9tTW9kYWwoJG1vZGFsKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuZW1haWxzLnNlbmRDb2xsZWN0aW9uKFtlbWFpbF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGFibGUuRGF0YVRhYmxlKCkuYWpheC5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXNwb25zZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBdO1xuXG4gICAgICAgIHJldHVybiBidXR0b25zO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb2xvcml6ZXMgbW9kYWwgYnV0dG9ucyBmb3IgdGhlIGVkaXQgbW9kZVxuICAgICAqXG4gICAgICogalF1ZXJ5IFVJIGRvZXMgbm90IHN1cHBvcnQgZGlyZWN0IGFkZGl0aW9uIG9mIGNsYXNzZXMgdG8gdGhlIGRpYWxvZyBidXR0b25zLFxuICAgICAqIHNvIHdlIG5lZWQgdG8gYXBwbHkgdGhlIGNsYXNzZXMgZHVyaW5nIHRoZSBcImNyZWF0ZVwiIGV2ZW50IG9mIHRoZSBkaWFsb2cuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQge2V2ZW50fSBFdmVudCB0byB0cmlnZ2VyIHRoaXMgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHVpIHtvYmplY3R9IERpYWxvZyBVSS5cbiAgICAgKi9cbiAgICBleHBvcnRzLmNvbG9yaXplQnV0dG9uc0ZvckVkaXRNb2RlID0gZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy51aS1kaWFsb2cnKS5maW5kKCcudWktYnV0dG9uJykuZXEoMykuYWRkQ2xhc3MoJ2J0bi1wcmltYXJ5Jyk7IC8vIFNlbmQgQnV0dG9uXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbG9yaXplcyBtb2RhbCBidXR0b25zIGZvciBwcmV2aWV3IG1vZGVcbiAgICAgKlxuICAgICAqIGpRdWVyeSBVSSBkb2VzIG5vdCBzdXBwb3J0IGRpcmVjdCBhZGRpdGlvbiBvZiBjbGFzc2VzIHRvIHRoZSBkaWFsb2cgYnV0dG9ucyxcbiAgICAgKiBzbyB3ZSBuZWVkIHRvIGFwcGx5IHRoZSBjbGFzc2VzIGR1cmluZyB0aGUgXCJjcmVhdGVcIiBldmVudCBvZiB0aGUgZGlhbG9nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IHtvYmplY3R9IEV2ZW50IHRvIHRyaWdnZXIgdGhpcyBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gdWkge29iamVjdH0gRGlhbG9nIFVJLlxuICAgICAqL1xuICAgIGV4cG9ydHMuY29sb3JpemVCdXR0b25zRm9yUHJldmlld01vZGUgPSBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICQodGhpcykuY2xvc2VzdCgnLnVpLWRpYWxvZycpLmZpbmQoJy51aS1idXR0b24nKS5lcSg0KS5hZGRDbGFzcygnYnRuLXByaW1hcnknKTsgLy8gU2VuZCBCdXR0b25cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBvbGQgYXR0YWNobWVudHMgZnJvbSBzZWxlY3RlZCByZW1vdmFsIGRhdGUgYW5kIGJlZm9yZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7ZGF0ZX0gcmVtb3ZhbERhdGUgVGhlIGRhdGUgd2hlbiB0aGUgcmVtb3ZhbCBzaG91bGQgc3RhcnQuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGFqYXhVcmwgKG9wdGlvbmFsKSBTcGVjaWZpYyBhamF4VXJsIHRvIGJlIHVzZWQgZm9yIHRoZSByZXF1ZXN0LlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IFJldHVybnMgYSBwcm9taXNlIG9iamVjdCB0byBiZSB1c2VkIHdoZW4gdGhlIHJlcXVlc3RzIGVuZHMuXG4gICAgICovXG4gICAgZXhwb3J0cy5kZWxldGVPbGRBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChyZW1vdmFsRGF0ZSwgYWpheFVybCkge1xuICAgICAgICBhamF4VXJsID0gYWpheFVybCB8fCBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUVtYWlscy9EZWxldGVPbGRBdHRhY2htZW50cyc7XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpLFxuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwYWdlVG9rZW46IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ3BhZ2VUb2tlbicpLFxuICAgICAgICAgICAgICAgIHJlbW92YWxEYXRlOiByZW1vdmFsRGF0ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAkLnBvc3QoYWpheFVybCwgZGF0YSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UuZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgfSwgJ2pzb24nKTtcblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIG9sZCBlbWFpbHMgZnJvbSBzZWxlY3RlZCByZW1vdmFsIGRhdGUgYW5kIGJlZm9yZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdmFsRGF0ZSBUaGUgZGF0ZSB3aGVuIHRoZSByZW1vdmFsIHNob3VsZCBzdGFydC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYWpheFVybCAob3B0aW9uYWwpIFNwZWNpZmljIGFqYXhVcmwgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3QuXG4gICAgICogQHJldHVybnMge29iamVjdH0gUmV0dXJucyBhIHByb21pc2Ugb2JqZWN0IHRvIGJlIHVzZWQgd2hlbiB0aGUgcmVxdWVzdHMgZW5kcy5cbiAgICAgKi9cbiAgICBleHBvcnRzLmRlbGV0ZU9sZEVtYWlscyA9IGZ1bmN0aW9uIChyZW1vdmFsRGF0ZSwgYWpheFVybCkge1xuICAgICAgICBhamF4VXJsID0gYWpheFVybCB8fCBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUVtYWlscy9EZWxldGVPbGRFbWFpbHMnO1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKSxcbiAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKSxcbiAgICAgICAgICAgICAgICByZW1vdmFsRGF0ZTogcmVtb3ZhbERhdGVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgJC5wb3N0KGFqYXhVcmwsIGRhdGEsIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH0sICdqc29uJyk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYXR0YWNobWVudHMgc2l6ZSBpbiBNQiBhbmQgcmVmcmVzaGVzIHRoZSBVSS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgbWFrZSBhIEdFVCByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgaW4gb3JkZXIgdG8gZmV0Y2ggYW5kIGRpc3BsYXlcbiAgICAgKiB0aGUgdG90YWwgYXR0YWNobWVudHMgc2l6ZSwgc28gdGhhdCB1c2VycyBrbm93IHdoZW4gaXQgaXMgdGltZSB0byByZW1vdmUgb2xkXG4gICAgICogYXR0YWNobWVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJHRhcmdldCBqUXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBlbGVtZW50IHRvIGNvbnRhaW4gdGhlIHNpemUgaW5mby5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWpheFVybCAob3B0aW9uYWwpIFNwZWNpZmljIGFqYXhVcmwgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFJldHVybnMgdGhlIHByb21pc2Ugb2JqZWN0IGZvciBjaGFpbmluZyBjYWxsYmFja3MuXG4gICAgICovXG4gICAgZXhwb3J0cy5nZXRBdHRhY2htZW50c1NpemUgPSBmdW5jdGlvbiAoJHRhcmdldCwgYWpheFVybCkge1xuICAgICAgICBhamF4VXJsID0gYWpheFVybCB8fCBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUVtYWlscy9HZXRBdHRhY2htZW50c1NpemUnO1xuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgICAgICAkLmdldChhamF4VXJsLCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5leGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXNwb25zZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBzaXplID0gKHJlc3BvbnNlLnNpemUubWVnYWJ5dGVzICE9PSAwKSA/IHJlc3BvbnNlLnNpemUubWVnYWJ5dGVzICsgJyBNQicgOiByZXNwb25zZS5zaXplXG4gICAgICAgICAgICAgICAgLmJ5dGVzICsgJyBieXRlcyc7XG5cbiAgICAgICAgICAgICR0YXJnZXQudGV4dChzaXplKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9LCAnanNvbicpO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgbW9kYWwgdGFicyBjb3VudGVycy5cbiAgICAgKlxuICAgICAqIERpc3BsYXlzIGl0ZW0gbnVtYmVyIG9uIHRhYnMgc28gdGhhdCB1c2VycyBrbm93IGhvdyBtYW55IGl0ZW1zIHRoZXJlIGFyZVxuICAgICAqIGluY2x1ZGVkIGluIHRoZSBjb250YWN0cyBhbmQgYXR0YWNobWVudHMgdGFibGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRtb2RhbCBUaGUgbW9kYWwgc2VsZWN0b3IgdG8gYmUgdXBkYXRlZC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhY3RzVGFibGUgKG9wdGlvbmFsKSBUaGUgY29udGFjdHMgdGFibGUgc2VsZWN0b3IsIGRlZmF1bHQgc2VsZWN0b3I6ICcjY29udGFjdHMtdGFibGUnLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFjdHNUYWIgKG9wdGlvbmFsKSBUaGUgY29udGFjdHMgdGFiIHNlbGVjdG9yLCBkZWZhdWx0IHNlbGVjdG9yOiAnLnRhYi1oZWFkbGluZS5iY2MtY2MnLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSAkYXR0YWNobWVudHNUYWJsZSAob3B0aW9uYWwpIFRoZSBhdHRhY2htZW50cyB0YWJsZSBzZWxlY3RvciwgZGVmYXVsdFxuICAgICAqIHNlbGVjdG9yOiAnI2F0dGFjaG1lbnRzLXRhYmxlJy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gJGF0dGFjaG1lbnRzVGFiIChvcHRpb25hbCkgVGhlIGF0dGFjaG1lbnRzIHRhYiBzZWxlY3RvciwgZGVmYXVsdFxuICAgICAqIHNlbGVjdG9yOiAnLnRhYi1oZWFkbGluZS5hdHRhY2htZW50cycuXG4gICAgICovXG4gICAgZXhwb3J0cy51cGRhdGVUYWJDb3VudGVycyA9IGZ1bmN0aW9uICgkbW9kYWwsICRjb250YWN0c1RhYmxlLCAkY29udGFjdHNUYWIsICRhdHRhY2htZW50c1RhYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGF0dGFjaG1lbnRzVGFiKSB7XG4gICAgICAgICRjb250YWN0c1RhYmxlID0gJGNvbnRhY3RzVGFibGUgfHwgJG1vZGFsLmZpbmQoJyNjb250YWN0cy10YWJsZScpO1xuICAgICAgICAkY29udGFjdHNUYWIgPSAkY29udGFjdHNUYWIgfHwgJG1vZGFsLmZpbmQoJy50YWItaGVhZGxpbmUuYmNjLWNjJyk7XG4gICAgICAgICRhdHRhY2htZW50c1RhYmxlID0gJGF0dGFjaG1lbnRzVGFibGUgfHwgJG1vZGFsLmZpbmQoJyNhdHRhY2htZW50cy10YWJsZScpO1xuICAgICAgICAkYXR0YWNobWVudHNUYWIgPSAkYXR0YWNobWVudHNUYWIgfHwgJG1vZGFsLmZpbmQoJy50YWItaGVhZGxpbmUuYXR0YWNobWVudHMnKTtcblxuICAgICAgICBpZiAoJGNvbnRhY3RzVGFibGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIFRoZXJlIGlzIG5vIHN1Y2ggdGFibGUgKGVtYWlscy5qcyB1bml0IHRlc3RpbmcpLlxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnRhY3RzQ291bnQgPSAkY29udGFjdHNUYWJsZS5EYXRhVGFibGUoKS5yb3dzKCkuZGF0YSgpLmxlbmd0aCxcbiAgICAgICAgICAgIG5ld0NvbnRhY3RzVGV4dCA9ICRjb250YWN0c1RhYi50ZXh0KCkucmVwbGFjZSgvXFwoLipcXCkvZywgJygnICsgY29udGFjdHNDb3VudCArICcpJyksXG4gICAgICAgICAgICBhdHRhY2htZW50c0NvdW50ID0gJGF0dGFjaG1lbnRzVGFibGUuRGF0YVRhYmxlKCkucm93cygpLmRhdGEoKS5sZW5ndGgsXG4gICAgICAgICAgICBuZXdBdHRhY2htZW50c1RleHQgPSAkYXR0YWNobWVudHNUYWIudGV4dCgpLnJlcGxhY2UoL1xcKC4qXFwpL2csICcoJyArIGF0dGFjaG1lbnRzQ291bnQgKyAnKScpO1xuXG4gICAgICAgIGlmIChuZXdDb250YWN0c1RleHQuaW5kZXhPZignKCcpID09PSAtMSkge1xuICAgICAgICAgICAgbmV3Q29udGFjdHNUZXh0ICs9ICcgKCcgKyBjb250YWN0c0NvdW50ICsgJyknO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld0F0dGFjaG1lbnRzVGV4dC5pbmRleE9mKCcoJykgPT09IC0xKSB7XG4gICAgICAgICAgICBuZXdBdHRhY2htZW50c1RleHQgKz0gJyAoJyArIGF0dGFjaG1lbnRzQ291bnQgKyAnKSc7XG4gICAgICAgIH1cblxuICAgICAgICAkY29udGFjdHNUYWIudGV4dChuZXdDb250YWN0c1RleHQpO1xuICAgICAgICAkYXR0YWNobWVudHNUYWIudGV4dChuZXdBdHRhY2htZW50c1RleHQpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIG9iamVjdCBhcnJheSB3aXRoIHRoZSBzZWxlY3RlZCBlbWFpbHMgb2YgdGhlIG1haW4gZW1haWxzIHRhYmxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICR0YWJsZSAob3B0aW9uYWwpIFRoZSBtYWluIHRhYmxlIHNlbGVjdG9yLCBpZiBvbWl0dGVkIHRoZSBcIiNlbWFpbHMtdGFibGVcIiBzZWxlY3RvclxuICAgICAqIHdpbGwgYmUgdXNlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthcnJheX0gUmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBlbWFpbHMgZGF0YSAoY29sbGVjdGlvbikuXG4gICAgICovXG4gICAgZXhwb3J0cy5nZXRTZWxlY3RlZEVtYWlscyA9IGZ1bmN0aW9uICgkdGFibGUpIHtcbiAgICAgICAgJHRhYmxlID0gJHRhYmxlIHx8ICQoJyNlbWFpbHMtdGFibGUnKTtcblxuICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFtdO1xuXG4gICAgICAgICR0YWJsZVxuICAgICAgICAgICAgLmZpbmQoJ3RyIHRkIGlucHV0OmNoZWNrZWQnKVxuICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24gKGluZGV4LCBjaGVja2JveCkge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucHVzaCgkKGNoZWNrYm94KS5wYXJlbnRzKCd0cicpLmRhdGEoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9O1xuXG59KShqc2UubGlicy5lbWFpbHMpO1xuIl19
