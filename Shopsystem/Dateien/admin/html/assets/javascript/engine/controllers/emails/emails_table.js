'use strict';

/* --------------------------------------------------------------
 emails_table.js 2022-05-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Emails Table Controller
 *
 * This controller will handle the main table operations of the admin/emails page.
 *
 * @module Controllers/emails_table
 */
gx.controllers.module('emails_table', [jse.source + '/vendor/datatables/jquery.dataTables.min.css', jse.source + '/vendor/datatables/jquery.dataTables.min.js', gx.source + '/libs/emails', 'modal', 'datatable', 'normalize'],

/** @lends module:Controllers/emails_table */

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
     * Modal Selector
     *
     * @type {object}
     */
    $modal = $('#emails-modal'),


    /**
     * Default Module Options
     *
     * @type {object}
     */
    defaults = {
        emailsTableActions: function emailsTableActions() {
            return '<div class="row-actions">' + '<span class="send-email action-item" title="' + jse.core.lang.translate('send', 'buttons') + '">' + '<i class="fa fa-envelope-o"></i>' + '</span>' + '<span class="forward-email action-item" title="' + jse.core.lang.translate('forward', 'buttons') + '">' + '<i class="fa fa-share"></i>' + '</span>' + '<span class="delete-email action-item" title="' + jse.core.lang.translate('delete', 'buttons') + '">' + '<i class="fa fa-trash-o"></i>' + '</span>' + '<span class="preview-email action-item" title="' + jse.core.lang.translate('preview', 'buttons') + '">' + '<i class="fa fa-eye"></i>' + '</span>' + '</div>';
        },

        convertPendingToString: function convertPendingToString(data, type, row, meta) {
            return data === true ? jse.core.lang.translate('email_pending', 'emails') : jse.core.lang.translate('email_sent', 'emails');
        }
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
     * Toggle row selection for main page table.
     *
     * @param {object} event Contains event information.
     */
    var _onSelectAllRows = function _onSelectAllRows(event) {
        if ($(this).prop('checked')) {
            $this.find('tbody .single-checkbox').addClass('checked');
            $this.find('tbody input:checkbox').prop('checked', true);
        } else {
            $this.find('tbody .single-checkbox').removeClass('checked');
            $this.find('tbody input:checkbox').prop('checked', false);
        }
    };

    /**
     * Will send the email to its contacts (even if its status is "sent").
     *
     * @param {object} event Contains event information.
     */
    var _onSendEmail = function _onSendEmail(event) {
        var $row = $(this).parents('tr');

        jse.libs.modal.message({
            title: jse.core.lang.translate('send', 'buttons'),
            content: jse.core.lang.translate('prompt_send_email', 'emails'),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    var email = $row.data();
                    jse.libs.emails.sendCollection([email]).done(function (response) {
                        $this.DataTable().ajax.reload();
                    }).fail(function (response) {
                        var title = jse.core.lang.translate('error', 'messages');

                        jse.libs.modal.message({
                            title: title,
                            content: response.message
                        });
                    });
                    $(this).dialog('close');
                }
            }]
        });
    };

    /**
     * Display modal with email information but without contacts.
     *
     * The user will be able to set new contacts and send the email (kind of "duplicate" method).
     *
     * @param {object} event Contains event information.
     */
    var _onForwardEmail = function _onForwardEmail(event) {
        var email = $(this).parents('tr').data();

        jse.libs.emails.resetModal($modal);
        jse.libs.emails.loadEmailOnModal(email, $modal);

        // Clear contact fields but let the rest of the data untouched.
        $modal.find('#email-id').val('');
        $modal.find('#sender-email, #sender-name').val('');
        $modal.find('#reply-to-email, #reply-to-name').val('');
        $modal.find('#recipient-email, #recipient-name').val('');
        $modal.find('#contacts-table').DataTable().clear().draw();

        $modal.dialog({
            title: jse.core.lang.translate('forward', 'buttons'),
            width: 1000,
            height: 800,
            modal: true,
            dialogClass: 'gx-container',
            closeOnEscape: false,
            buttons: jse.libs.emails.getDefaultModalButtons($modal, $this),
            open: jse.libs.emails.colorizeButtonsForEditMode
        });
    };

    /**
     * Delete selected row email.
     *
     * @param {object} event Contains event information.
     */
    var _onDeleteEmail = function _onDeleteEmail(event) {
        var $row = $(this).parents('tr'),
            email = $row.data();

        jse.libs.modal.message({
            title: jse.core.lang.translate('delete', 'buttons'),
            content: jse.core.lang.translate('prompt_delete_email', 'emails'),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    jse.libs.emails.deleteCollection([email]).done(function (response) {
                        $this.DataTable().ajax.reload();
                    }).fail(function (response) {
                        var title = jse.core.lang.translate('error', 'messages');
                        jse.libs.modal.message({
                            title: title,
                            content: response.message
                        });
                    });
                    $(this).dialog('close');
                }
            }]
        });
    };

    /**
     * Display modal with email information
     *
     * The user can select an action to perform upon the previewed email (Send, Forward,
     * Delete, Close).
     *
     * @param  {object} event Contains event information.
     */
    var _onPreviewEmail = function _onPreviewEmail(event) {
        var email = $(this).parents('tr').data();

        jse.libs.emails.resetModal($modal);
        jse.libs.emails.loadEmailOnModal(email, $modal);

        $modal.dialog({
            title: jse.core.lang.translate('preview', 'buttons'),
            width: 1000,
            height: 800,
            modal: false,
            dialogClass: 'gx-container',
            closeOnEscape: false,
            buttons: jse.libs.emails.getPreviewModalButtons($modal, $this),
            open: jse.libs.emails.colorizeButtonsForPreviewMode
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     *
     * The emails table operates with server processing because it is much faster and efficient than preparing
     * and sending all the records in every AJAX request. Check the Emails/DataTable controller method for
     * requested data and the following link for more info about server processing in DataTables.
     *
     * {@link http://www.datatables.net/manual/server-side}
     */
    module.init = function (done) {
        // Create a DataTable instance for the email records.
        jse.libs.datatable.create($this, {
            processing: false,
            serverSide: true,
            dom: 'rtip',
            autoWidth: false,
            language: jse.core.config.get('languageCode') === 'de' ? jse.libs.datatable.getGermanTranslation() : null,
            ajax: {
                url: jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/DataTable',
                type: 'POST'
            },
            order: [[2, 'desc']],
            pageLength: 20,
            columns: [{
                data: null,
                orderable: false,
                defaultContent: '<input type="checkbox" data-single_checkbox />',
                width: '2%',
                className: 'dt-head-center dt-body-center'
            }, {
                data: 'row_count',
                orderable: false,
                width: '3%',
                className: 'dt-head-center dt-body-center'
            }, {
                data: 'creation_date',
                width: '12%'
            }, {
                data: 'sent_date',
                width: '12%'
            }, {
                data: 'sender',
                width: '12%'
            }, {
                data: 'recipient',
                width: '12%'
            }, {
                data: 'subject',
                width: '27%'
            }, {
                data: 'is_pending',
                width: '8%',
                render: options.convertPendingToString
            }, {
                data: null,
                orderable: false,
                defaultContent: '',
                render: options.emailsTableActions,
                width: '12%'
            }]
        });

        // Add table error handler.
        jse.libs.datatable.error($this, function (event, settings, techNote, message) {
            jse.libs.modal.message({
                title: 'DataTables ' + jse.core.lang.translate('error', 'messages'),
                content: message
            });
        });

        // Add ajax error handler.
        jse.libs.datatable.ajaxComplete($this, function (event, settings, json) {
            if (json.exception === true) {
                jse.core.debug.error('DataTables Processing Error', $this.get(0), json);
                jse.libs.modal.message({
                    title: 'AJAX ' + jse.core.lang.translate('error', 'messages'),
                    content: json.message
                });
            }
        });

        // Combine ".paginator" with the DataTable HTML output in order to create a unique pagination
        // frame at the bottom of the table (executed after table initialization).
        $this.on('init.dt', function (e, settings, json) {
            $('.paginator').appendTo($('#emails-table_wrapper'));
            $('#emails-table_info').appendTo($('.paginator .datatable-components')).css('clear', 'none');
            $('#emails-table_paginate').appendTo($('.paginator .datatable-components')).css('clear', 'none');
        });

        // Recreate the checkbox widgets.
        $this.on('draw.dt', function () {
            $this.find('tbody').attr('data-gx-widget', 'checkbox');
            gx.widgets.init($this); // Initialize the checkbox widget.
        });

        // Add spinner to table loading actions.
        var $spinner;
        $this.on('preXhr.dt', function (e, settings, json) {
            $spinner = jse.libs.loading_spinner.show($this);
        });
        $this.on('xhr.dt', function (e, settings, json) {
            if ($spinner) {
                jse.libs.loading_spinner.hide($spinner);
            }
        });

        // Bind event handlers of the emails table.
        $this.on('click', '#select-all-rows', _onSelectAllRows).on('click', '.send-email', _onSendEmail).on('click', '.forward-email', _onForwardEmail).on('click', '.delete-email', _onDeleteEmail).on('click', '.preview-email', _onPreviewEmail);

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy9lbWFpbHNfdGFibGUuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkbW9kYWwiLCJkZWZhdWx0cyIsImVtYWlsc1RhYmxlQWN0aW9ucyIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiY29udmVydFBlbmRpbmdUb1N0cmluZyIsInR5cGUiLCJyb3ciLCJtZXRhIiwib3B0aW9ucyIsImV4dGVuZCIsIl9vblNlbGVjdEFsbFJvd3MiLCJldmVudCIsInByb3AiLCJmaW5kIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIl9vblNlbmRFbWFpbCIsIiRyb3ciLCJwYXJlbnRzIiwibGlicyIsIm1vZGFsIiwibWVzc2FnZSIsInRpdGxlIiwiY29udGVudCIsImJ1dHRvbnMiLCJ0ZXh0IiwiY2xpY2siLCJkaWFsb2ciLCJlbWFpbCIsImVtYWlscyIsInNlbmRDb2xsZWN0aW9uIiwiZG9uZSIsInJlc3BvbnNlIiwiRGF0YVRhYmxlIiwiYWpheCIsInJlbG9hZCIsImZhaWwiLCJfb25Gb3J3YXJkRW1haWwiLCJyZXNldE1vZGFsIiwibG9hZEVtYWlsT25Nb2RhbCIsInZhbCIsImNsZWFyIiwiZHJhdyIsIndpZHRoIiwiaGVpZ2h0IiwiZGlhbG9nQ2xhc3MiLCJjbG9zZU9uRXNjYXBlIiwiZ2V0RGVmYXVsdE1vZGFsQnV0dG9ucyIsIm9wZW4iLCJjb2xvcml6ZUJ1dHRvbnNGb3JFZGl0TW9kZSIsIl9vbkRlbGV0ZUVtYWlsIiwiZGVsZXRlQ29sbGVjdGlvbiIsIl9vblByZXZpZXdFbWFpbCIsImdldFByZXZpZXdNb2RhbEJ1dHRvbnMiLCJjb2xvcml6ZUJ1dHRvbnNGb3JQcmV2aWV3TW9kZSIsImluaXQiLCJkYXRhdGFibGUiLCJjcmVhdGUiLCJwcm9jZXNzaW5nIiwic2VydmVyU2lkZSIsImRvbSIsImF1dG9XaWR0aCIsImxhbmd1YWdlIiwiY29uZmlnIiwiZ2V0IiwiZ2V0R2VybWFuVHJhbnNsYXRpb24iLCJ1cmwiLCJvcmRlciIsInBhZ2VMZW5ndGgiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZGVmYXVsdENvbnRlbnQiLCJjbGFzc05hbWUiLCJyZW5kZXIiLCJlcnJvciIsInNldHRpbmdzIiwidGVjaE5vdGUiLCJhamF4Q29tcGxldGUiLCJqc29uIiwiZXhjZXB0aW9uIiwiZGVidWciLCJvbiIsImUiLCJhcHBlbmRUbyIsImNzcyIsImF0dHIiLCJ3aWRnZXRzIiwiJHNwaW5uZXIiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwiaGlkZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGNBREosRUFHSSxDQUNJQyxJQUFJQyxNQUFKLEdBQWEsOENBRGpCLEVBRUlELElBQUlDLE1BQUosR0FBYSw2Q0FGakIsRUFHSUosR0FBR0ksTUFBSCxHQUFZLGNBSGhCLEVBSUksT0FKSixFQUtJLFdBTEosRUFNSSxXQU5KLENBSEo7O0FBWUk7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFTRCxFQUFFLGVBQUYsQ0FiYjs7O0FBZUk7Ozs7O0FBS0FFLGVBQVc7QUFDUEMsNEJBQW9CLDhCQUFZO0FBQzVCLG1CQUFPLDhCQUE4Qiw4Q0FBOUIsR0FDRFAsSUFBSVEsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FDRSxNQURGLEVBRUUsU0FGRixDQURDLEdBR2MsSUFIZCxHQUdxQixrQ0FIckIsR0FHMEQsU0FIMUQsR0FJSCxpREFKRyxHQUtEVixJQUFJUSxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixTQUF4QixFQUFtQyxTQUFuQyxDQUxDLEdBTUgsSUFORyxHQU9ILDZCQVBHLEdBTzZCLFNBUDdCLEdBUUgsZ0RBUkcsR0FRZ0RW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QUE2QjtBQUMvQ1MsdUJBQVc5RixJQUFJMEIsSUFBSixDQUFTcUUsZUFBVCxDQUF5QkMsSUFBekIsQ0FBOEI3RixLQUE5QixDQUFYO0FBQ0gsU0FGRDtBQUdBQSxjQUFNcUYsRUFBTixDQUFTLFFBQVQsRUFBbUIsVUFBVUMsQ0FBVixFQUFhUCxRQUFiLEVBQXVCRyxJQUF2QixFQUE2QjtBQUM1QyxnQkFBSVMsUUFBSixFQUFjO0FBQ1Y5RixvQkFBSTBCLElBQUosQ0FBU3FFLGVBQVQsQ0FBeUJFLElBQXpCLENBQThCSCxRQUE5QjtBQUNIO0FBQ0osU0FKRDs7QUFNQTtBQUNBM0YsY0FDS3FGLEVBREwsQ0FDUSxPQURSLEVBQ2lCLGtCQURqQixFQUNxQ3ZFLGdCQURyQyxFQUVLdUUsRUFGTCxDQUVRLE9BRlIsRUFFaUIsYUFGakIsRUFFZ0NqRSxZQUZoQyxFQUdLaUUsRUFITCxDQUdRLE9BSFIsRUFHaUIsZ0JBSGpCLEVBR21DNUMsZUFIbkMsRUFJSzRDLEVBSkwsQ0FJUSxPQUpSLEVBSWlCLGVBSmpCLEVBSWtDL0IsY0FKbEMsRUFLSytCLEVBTEwsQ0FLUSxPQUxSLEVBS2lCLGdCQUxqQixFQUttQzdCLGVBTG5DOztBQU9BckI7QUFDSCxLQXpIRDs7QUEySEE7QUFDQSxXQUFPdkMsTUFBUDtBQUNILENBelhMIiwiZmlsZSI6ImVtYWlscy9lbWFpbHNfdGFibGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGVtYWlsc190YWJsZS5qcyAyMDIyLTA1LTE0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAyMiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBFbWFpbHMgVGFibGUgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciB3aWxsIGhhbmRsZSB0aGUgbWFpbiB0YWJsZSBvcGVyYXRpb25zIG9mIHRoZSBhZG1pbi9lbWFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL2VtYWlsc190YWJsZVxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ2VtYWlsc190YWJsZScsXG5cbiAgICBbXG4gICAgICAgIGpzZS5zb3VyY2UgKyAnL3ZlbmRvci9kYXRhdGFibGVzL2pxdWVyeS5kYXRhVGFibGVzLm1pbi5jc3MnLFxuICAgICAgICBqc2Uuc291cmNlICsgJy92ZW5kb3IvZGF0YXRhYmxlcy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanMnLFxuICAgICAgICBneC5zb3VyY2UgKyAnL2xpYnMvZW1haWxzJyxcbiAgICAgICAgJ21vZGFsJyxcbiAgICAgICAgJ2RhdGF0YWJsZScsXG4gICAgICAgICdub3JtYWxpemUnXG4gICAgXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOkNvbnRyb2xsZXJzL2VtYWlsc190YWJsZSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kYWwgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkbW9kYWwgPSAkKCcjZW1haWxzLW1vZGFsJyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIGVtYWlsc1RhYmxlQWN0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJzxkaXYgY2xhc3M9XCJyb3ctYWN0aW9uc1wiPicgKyAnPHNwYW4gY2xhc3M9XCJzZW5kLWVtYWlsIGFjdGlvbi1pdGVtXCIgdGl0bGU9XCInXG4gICAgICAgICAgICAgICAgICAgICAgICArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZW5kJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYnV0dG9ucycpICsgJ1wiPicgKyAnPGkgY2xhc3M9XCJmYSBmYS1lbnZlbG9wZS1vXCI+PC9pPicgKyAnPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZm9yd2FyZC1lbWFpbCBhY3Rpb24taXRlbVwiIHRpdGxlPVwiJ1xuICAgICAgICAgICAgICAgICAgICAgICAgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZm9yd2FyZCcsICdidXR0b25zJykgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxpIGNsYXNzPVwiZmEgZmEtc2hhcmVcIj48L2k+JyArICc8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJkZWxldGUtZW1haWwgYWN0aW9uLWl0ZW1cIiB0aXRsZT1cIicgKyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGVsZXRlJywgJ2J1dHRvbnMnKSArICdcIj4nICsgJzxpIGNsYXNzPVwiZmEgZmEtdHJhc2gtb1wiPjwvaT4nICsgJzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInByZXZpZXctZW1haWwgYWN0aW9uLWl0ZW1cIiB0aXRsZT1cIidcbiAgICAgICAgICAgICAgICAgICAgICAgICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3ByZXZpZXcnLCAnYnV0dG9ucycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8aSBjbGFzcz1cImZhIGZhLWV5ZVwiPjwvaT4nICsgJzwvc3Bhbj4nICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGNvbnZlcnRQZW5kaW5nVG9TdHJpbmc6IGZ1bmN0aW9uIChkYXRhLCB0eXBlLCByb3csIG1ldGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICA9PT0gdHJ1ZSkgPyBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZW1haWxfcGVuZGluZycsICdlbWFpbHMnKSA6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2VtYWlsX3NlbnQnLCAnZW1haWxzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRvZ2dsZSByb3cgc2VsZWN0aW9uIGZvciBtYWluIHBhZ2UgdGFibGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25TZWxlY3RBbGxSb3dzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSAuc2luZ2xlLWNoZWNrYm94JykuYWRkQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBpbnB1dDpjaGVja2JveCcpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgLnNpbmdsZS1jaGVja2JveCcpLnJlbW92ZUNsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHkgaW5wdXQ6Y2hlY2tib3gnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaWxsIHNlbmQgdGhlIGVtYWlsIHRvIGl0cyBjb250YWN0cyAoZXZlbiBpZiBpdHMgc3RhdHVzIGlzIFwic2VudFwiKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vblNlbmRFbWFpbCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyICRyb3cgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJyk7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2VuZCcsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgY29udGVudDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3Byb21wdF9zZW5kX2VtYWlsJywgJ2VtYWlscycpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ25vJywgJ2xpZ2h0Ym94X2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCd5ZXMnLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW1haWwgPSAkcm93LmRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5lbWFpbHMuc2VuZENvbGxlY3Rpb24oW2VtYWlsXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnJlbG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogcmVzcG9uc2UubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXkgbW9kYWwgd2l0aCBlbWFpbCBpbmZvcm1hdGlvbiBidXQgd2l0aG91dCBjb250YWN0cy5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIHVzZXIgd2lsbCBiZSBhYmxlIHRvIHNldCBuZXcgY29udGFjdHMgYW5kIHNlbmQgdGhlIGVtYWlsIChraW5kIG9mIFwiZHVwbGljYXRlXCIgbWV0aG9kKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkZvcndhcmRFbWFpbCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGVtYWlsID0gJCh0aGlzKS5wYXJlbnRzKCd0cicpLmRhdGEoKTtcblxuICAgICAgICAgICAganNlLmxpYnMuZW1haWxzLnJlc2V0TW9kYWwoJG1vZGFsKTtcbiAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5sb2FkRW1haWxPbk1vZGFsKGVtYWlsLCAkbW9kYWwpO1xuXG4gICAgICAgICAgICAvLyBDbGVhciBjb250YWN0IGZpZWxkcyBidXQgbGV0IHRoZSByZXN0IG9mIHRoZSBkYXRhIHVudG91Y2hlZC5cbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcjZW1haWwtaWQnKS52YWwoJycpO1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNzZW5kZXItZW1haWwsICNzZW5kZXItbmFtZScpLnZhbCgnJyk7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnI3JlcGx5LXRvLWVtYWlsLCAjcmVwbHktdG8tbmFtZScpLnZhbCgnJyk7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnI3JlY2lwaWVudC1lbWFpbCwgI3JlY2lwaWVudC1uYW1lJykudmFsKCcnKTtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcjY29udGFjdHMtdGFibGUnKS5EYXRhVGFibGUoKS5jbGVhcigpLmRyYXcoKTtcblxuICAgICAgICAgICAgJG1vZGFsLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdmb3J3YXJkJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDgwMCxcbiAgICAgICAgICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkaWFsb2dDbGFzczogJ2d4LWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgY2xvc2VPbkVzY2FwZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYnV0dG9uczoganNlLmxpYnMuZW1haWxzLmdldERlZmF1bHRNb2RhbEJ1dHRvbnMoJG1vZGFsLCAkdGhpcyksXG4gICAgICAgICAgICAgICAgb3BlbjoganNlLmxpYnMuZW1haWxzLmNvbG9yaXplQnV0dG9uc0ZvckVkaXRNb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIHNlbGVjdGVkIHJvdyBlbWFpbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IENvbnRhaW5zIGV2ZW50IGluZm9ybWF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkRlbGV0ZUVtYWlsID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJHJvdyA9ICQodGhpcykucGFyZW50cygndHInKSxcbiAgICAgICAgICAgICAgICBlbWFpbCA9ICRyb3cuZGF0YSgpO1xuXG4gICAgICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2RlbGV0ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgY29udGVudDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3Byb21wdF9kZWxldGVfZW1haWwnLCAnZW1haWxzJyksXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm8nLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3llcycsICdsaWdodGJveF9idXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5kZWxldGVDb2xsZWN0aW9uKFtlbWFpbF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuRGF0YVRhYmxlKCkuYWpheC5yZWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLm1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiByZXNwb25zZS5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheSBtb2RhbCB3aXRoIGVtYWlsIGluZm9ybWF0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSB1c2VyIGNhbiBzZWxlY3QgYW4gYWN0aW9uIHRvIHBlcmZvcm0gdXBvbiB0aGUgcHJldmlld2VkIGVtYWlsIChTZW5kLCBGb3J3YXJkLFxuICAgICAgICAgKiBEZWxldGUsIENsb3NlKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtICB7b2JqZWN0fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25QcmV2aWV3RW1haWwgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBlbWFpbCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCk7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5yZXNldE1vZGFsKCRtb2RhbCk7XG4gICAgICAgICAgICBqc2UubGlicy5lbWFpbHMubG9hZEVtYWlsT25Nb2RhbChlbWFpbCwgJG1vZGFsKTtcblxuICAgICAgICAgICAgJG1vZGFsLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdwcmV2aWV3JywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDgwMCxcbiAgICAgICAgICAgICAgICBtb2RhbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGlhbG9nQ2xhc3M6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgIGNsb3NlT25Fc2NhcGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IGpzZS5saWJzLmVtYWlscy5nZXRQcmV2aWV3TW9kYWxCdXR0b25zKCRtb2RhbCwgJHRoaXMpLFxuICAgICAgICAgICAgICAgIG9wZW46IGpzZS5saWJzLmVtYWlscy5jb2xvcml6ZUJ1dHRvbnNGb3JQcmV2aWV3TW9kZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICpcbiAgICAgICAgICogVGhlIGVtYWlscyB0YWJsZSBvcGVyYXRlcyB3aXRoIHNlcnZlciBwcm9jZXNzaW5nIGJlY2F1c2UgaXQgaXMgbXVjaCBmYXN0ZXIgYW5kIGVmZmljaWVudCB0aGFuIHByZXBhcmluZ1xuICAgICAgICAgKiBhbmQgc2VuZGluZyBhbGwgdGhlIHJlY29yZHMgaW4gZXZlcnkgQUpBWCByZXF1ZXN0LiBDaGVjayB0aGUgRW1haWxzL0RhdGFUYWJsZSBjb250cm9sbGVyIG1ldGhvZCBmb3JcbiAgICAgICAgICogcmVxdWVzdGVkIGRhdGEgYW5kIHRoZSBmb2xsb3dpbmcgbGluayBmb3IgbW9yZSBpbmZvIGFib3V0IHNlcnZlciBwcm9jZXNzaW5nIGluIERhdGFUYWJsZXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIHtAbGluayBodHRwOi8vd3d3LmRhdGF0YWJsZXMubmV0L21hbnVhbC9zZXJ2ZXItc2lkZX1cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIERhdGFUYWJsZSBpbnN0YW5jZSBmb3IgdGhlIGVtYWlsIHJlY29yZHMuXG4gICAgICAgICAgICBqc2UubGlicy5kYXRhdGFibGUuY3JlYXRlKCR0aGlzLCB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2luZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2VydmVyU2lkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkb206ICdydGlwJyxcbiAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAoanNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJylcbiAgICAgICAgICAgICAgICAgICAgPT09ICdkZScpID8ganNlLmxpYnMuZGF0YXRhYmxlLmdldEdlcm1hblRyYW5zbGF0aW9uKCkgOiBudWxsLFxuICAgICAgICAgICAgICAgIGFqYXg6IHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUVtYWlscy9EYXRhVGFibGUnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9yZGVyOiBbWzIsICdkZXNjJ11dLFxuICAgICAgICAgICAgICAgIHBhZ2VMZW5ndGg6IDIwLFxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29udGVudDogJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLXNpbmdsZV9jaGVja2JveCAvPicsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzIlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2R0LWhlYWQtY2VudGVyIGR0LWJvZHktY2VudGVyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAncm93X2NvdW50JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzMlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2R0LWhlYWQtY2VudGVyIGR0LWJvZHktY2VudGVyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAnY3JlYXRpb25fZGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyJSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ3NlbnRfZGF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyJSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ3NlbmRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyJSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ3JlY2lwaWVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyJSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJ3N1YmplY3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcyNyUnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICdpc19wZW5kaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnOCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyOiBvcHRpb25zLmNvbnZlcnRQZW5kaW5nVG9TdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0Q29udGVudDogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXI6IG9wdGlvbnMuZW1haWxzVGFibGVBY3Rpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMiUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIHRhYmxlIGVycm9yIGhhbmRsZXIuXG4gICAgICAgICAgICBqc2UubGlicy5kYXRhdGFibGUuZXJyb3IoJHRoaXMsIGZ1bmN0aW9uIChldmVudCwgc2V0dGluZ3MsIHRlY2hOb3RlLCBtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnRGF0YVRhYmxlcyAnICsganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Vycm9yJywgJ21lc3NhZ2VzJyksXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgYWpheCBlcnJvciBoYW5kbGVyLlxuICAgICAgICAgICAganNlLmxpYnMuZGF0YXRhYmxlLmFqYXhDb21wbGV0ZSgkdGhpcywgZnVuY3Rpb24gKGV2ZW50LCBzZXR0aW5ncywganNvbikge1xuICAgICAgICAgICAgICAgIGlmIChqc29uLmV4Y2VwdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5lcnJvcignRGF0YVRhYmxlcyBQcm9jZXNzaW5nIEVycm9yJywgJHRoaXMuZ2V0KDApLCBqc29uKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0FKQVggJyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdlcnJvcicsICdtZXNzYWdlcycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDoganNvbi5tZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBDb21iaW5lIFwiLnBhZ2luYXRvclwiIHdpdGggdGhlIERhdGFUYWJsZSBIVE1MIG91dHB1dCBpbiBvcmRlciB0byBjcmVhdGUgYSB1bmlxdWUgcGFnaW5hdGlvblxuICAgICAgICAgICAgLy8gZnJhbWUgYXQgdGhlIGJvdHRvbSBvZiB0aGUgdGFibGUgKGV4ZWN1dGVkIGFmdGVyIHRhYmxlIGluaXRpYWxpemF0aW9uKS5cbiAgICAgICAgICAgICR0aGlzLm9uKCdpbml0LmR0JywgZnVuY3Rpb24gKGUsIHNldHRpbmdzLCBqc29uKSB7XG4gICAgICAgICAgICAgICAgJCgnLnBhZ2luYXRvcicpLmFwcGVuZFRvKCQoJyNlbWFpbHMtdGFibGVfd3JhcHBlcicpKTtcbiAgICAgICAgICAgICAgICAkKCcjZW1haWxzLXRhYmxlX2luZm8nKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJCgnLnBhZ2luYXRvciAuZGF0YXRhYmxlLWNvbXBvbmVudHMnKSlcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnY2xlYXInLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgICQoJyNlbWFpbHMtdGFibGVfcGFnaW5hdGUnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJCgnLnBhZ2luYXRvciAuZGF0YXRhYmxlLWNvbXBvbmVudHMnKSlcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnY2xlYXInLCAnbm9uZScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFJlY3JlYXRlIHRoZSBjaGVja2JveCB3aWRnZXRzLlxuICAgICAgICAgICAgJHRoaXMub24oJ2RyYXcuZHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgndGJvZHknKS5hdHRyKCdkYXRhLWd4LXdpZGdldCcsICdjaGVja2JveCcpO1xuICAgICAgICAgICAgICAgIGd4LndpZGdldHMuaW5pdCgkdGhpcyk7IC8vIEluaXRpYWxpemUgdGhlIGNoZWNrYm94IHdpZGdldC5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgc3Bpbm5lciB0byB0YWJsZSBsb2FkaW5nIGFjdGlvbnMuXG4gICAgICAgICAgICB2YXIgJHNwaW5uZXI7XG4gICAgICAgICAgICAkdGhpcy5vbigncHJlWGhyLmR0JywgZnVuY3Rpb24gKGUsIHNldHRpbmdzLCBqc29uKSB7XG4gICAgICAgICAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICR0aGlzLm9uKCd4aHIuZHQnLCBmdW5jdGlvbiAoZSwgc2V0dGluZ3MsIGpzb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNwaW5uZXIpIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJHNwaW5uZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBCaW5kIGV2ZW50IGhhbmRsZXJzIG9mIHRoZSBlbWFpbHMgdGFibGUuXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnI3NlbGVjdC1hbGwtcm93cycsIF9vblNlbGVjdEFsbFJvd3MpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuc2VuZC1lbWFpbCcsIF9vblNlbmRFbWFpbClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5mb3J3YXJkLWVtYWlsJywgX29uRm9yd2FyZEVtYWlsKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmRlbGV0ZS1lbWFpbCcsIF9vbkRlbGV0ZUVtYWlsKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnByZXZpZXctZW1haWwnLCBfb25QcmV2aWV3RW1haWwpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
