'use strict';

/* --------------------------------------------------------------
 delete_old_emails_modal.js 2018-06-07
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 ----------------------------------------------------------------
 */

/**
 * ## Attachments Modal Controller
 *
 * This controller will handle the attachments modal dialog operations of the admin/emails page.
 *
 * @module Controllers/attachments_modal
 */
gx.controllers.module('delete_old_emails_modal', ['modal', gx.source + '/libs/emails'],

/** @lends module:Controllers/attachments_modal */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Reference
     *
     * @type {object}
     */

    var $this = $(this);

    /**
     * Emails Main Table Selector
     *
     * @type {object}
     */
    var $table = $('#emails-table');

    /**
     * Default Module Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Module Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Delete old emails request.
     *
     * @param {object} event Contains the event information.
     */
    var _onDeleteOldEmails = function _onDeleteOldEmails(event) {
        // Validate selected date before making the request.
        if ($this.find('#email-removal-date').val() === '') {
            return; // do not proceed
        }

        // Display confirmation modal before proceeding.
        var removalDate = $this.find('#email-removal-date').datepicker('getDate').toString('yyyy-MM-dd');

        var modalOptions = {
            title: jse.core.lang.translate('delete', 'buttons') + ' - ' + removalDate,
            content: jse.core.lang.translate('prompt_delete_old_emails', 'emails'),
            buttons: [{
                text: jse.core.lang.translate('no', 'lightbox_buttons'),
                click: function click() {
                    $(this).dialog('close');
                }
            }, {
                text: jse.core.lang.translate('yes', 'lightbox_buttons'),
                click: function click() {
                    jse.libs.emails.deleteOldEmails(removalDate).done(function (response) {
                        var message = jse.core.lang.translate('message_delete_old_emails_success', 'emails');

                        jse.libs.modal.message({
                            title: 'Info',
                            content: message
                        });

                        $table.DataTable().ajax.reload();
                        $this.dialog('close');
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
        };

        jse.libs.modal.message(modalOptions);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        $this.on('click', '#delete-old-emails', _onDeleteOldEmails);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy9kZWxldGVfb2xkX2VtYWlsc19tb2RhbC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiR0YWJsZSIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9vbkRlbGV0ZU9sZEVtYWlscyIsImV2ZW50IiwiZmluZCIsInZhbCIsInJlbW92YWxEYXRlIiwiZGF0ZXBpY2tlciIsInRvU3RyaW5nIiwibW9kYWxPcHRpb25zIiwidGl0bGUiLCJqc2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImNvbnRlbnQiLCJidXR0b25zIiwidGV4dCIsImNsaWNrIiwiZGlhbG9nIiwibGlicyIsImVtYWlscyIsImRlbGV0ZU9sZEVtYWlscyIsImRvbmUiLCJyZXNwb25zZSIsIm1lc3NhZ2UiLCJtb2RhbCIsIkRhdGFUYWJsZSIsImFqYXgiLCJyZWxvYWQiLCJmYWlsIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0kseUJBREosRUFHSSxDQUNJLE9BREosRUFFSUYsR0FBR0csTUFBSCxHQUFZLGNBRmhCLENBSEo7O0FBUUk7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1DLFNBQVNELEVBQUUsZUFBRixDQUFmOztBQUVBOzs7OztBQUtBLFFBQU1FLFdBQVcsRUFBakI7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkosSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTUYsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQSxRQUFNUyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFVQyxLQUFWLEVBQWlCO0FBQ3hDO0FBQ0EsWUFBSVAsTUFBTVEsSUFBTixDQUFXLHFCQUFYLEVBQWtDQyxHQUFsQyxPQUE0QyxFQUFoRCxFQUFvRDtBQUNoRCxtQkFEZ0QsQ0FDeEM7QUFDWDs7QUFFRDtBQUNBLFlBQU1DLGNBQWNWLE1BQU1RLElBQU4sQ0FBVyxxQkFBWCxFQUFrQ0csVUFBbEMsQ0FBNkMsU0FBN0MsRUFBd0RDLFFBQXhELENBQWlFLFlBQWpFLENBQXBCOztBQUVBLFlBQU1DLGVBQWU7QUFDakJDLG1CQUFPQyxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixRQUF4QixFQUFrQyxTQUFsQyxJQUErQyxLQUEvQyxHQUF1RFIsV0FEN0M7QUFFakJTLHFCQUFTSixJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QiwwQkFBeEIsRUFBb0QsUUFBcEQsQ0FGUTtBQUdqQkUscUJBQVMsQ0FDTDtBQUNJQyxzQkFBTU4sSUFBSUMsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsSUFBeEIsRUFBOEIsa0JBQTlCLENBRFY7QUFFSUksdUJBQU8saUJBQVk7QUFDZnJCLHNCQUFFLElBQUYsRUFBUXNCLE1BQVIsQ0FBZSxPQUFmO0FBQ0g7QUFKTCxhQURLLEVBT0w7QUFDSUYsc0JBQU1OLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLEtBQXhCLEVBQStCLGtCQUEvQixDQURWO0FBRUlJLHVCQUFPLGlCQUFZO0FBQ2ZQLHdCQUFJUyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLGVBQWhCLENBQWdDaEIsV0FBaEMsRUFDS2lCLElBREwsQ0FDVSxVQUFVQyxRQUFWLEVBQW9CO0FBQ3RCLDRCQUFNQyxVQUNGZCxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixtQ0FBeEIsRUFBNkQsUUFBN0QsQ0FESjs7QUFHQUgsNEJBQUlTLElBQUosQ0FBU00sS0FBVCxDQUFlRCxPQUFmLENBQXVCO0FBQ25CZixtQ0FBTyxNQURZO0FBRW5CSyxxQ0FBU1U7QUFGVSx5QkFBdkI7O0FBS0EzQiwrQkFBTzZCLFNBQVAsR0FBbUJDLElBQW5CLENBQXdCQyxNQUF4QjtBQUNBakMsOEJBQU11QixNQUFOLENBQWEsT0FBYjtBQUNILHFCQVpMLEVBYUtXLElBYkwsQ0FhVSxVQUFVTixRQUFWLEVBQW9CO0FBQ3RCLDRCQUFNZCxRQUFRQyxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixPQUF4QixFQUFpQyxVQUFqQyxDQUFkOztBQUVBSCw0QkFBSVMsSUFBSixDQUFTTSxLQUFULENBQWVELE9BQWYsQ0FBdUI7QUFDbkJmLG1DQUFPQSxLQURZO0FBRW5CSyxxQ0FBU1MsU0FBU0M7QUFGQyx5QkFBdkI7QUFJSCxxQkFwQkw7O0FBc0JBNUIsc0JBQUUsSUFBRixFQUFRc0IsTUFBUixDQUFlLE9BQWY7QUFDSDtBQTFCTCxhQVBLO0FBSFEsU0FBckI7O0FBeUNBUixZQUFJUyxJQUFKLENBQVNNLEtBQVQsQ0FBZUQsT0FBZixDQUF1QmhCLFlBQXZCO0FBQ0gsS0FuREQ7O0FBcURBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FoQixXQUFPc0MsSUFBUCxHQUFjLFVBQVVSLElBQVYsRUFBZ0I7QUFDMUIzQixjQUFNb0MsRUFBTixDQUFTLE9BQVQsRUFBa0Isb0JBQWxCLEVBQXdDOUIsa0JBQXhDO0FBQ0FxQjtBQUNILEtBSEQ7O0FBS0EsV0FBTzlCLE1BQVA7QUFDSCxDQWhJTCIsImZpbGUiOiJlbWFpbHMvZGVsZXRlX29sZF9lbWFpbHNfbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRlbGV0ZV9vbGRfZW1haWxzX21vZGFsLmpzIDIwMTgtMDYtMDdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQXR0YWNobWVudHMgTW9kYWwgQ29udHJvbGxlclxuICpcbiAqIFRoaXMgY29udHJvbGxlciB3aWxsIGhhbmRsZSB0aGUgYXR0YWNobWVudHMgbW9kYWwgZGlhbG9nIG9wZXJhdGlvbnMgb2YgdGhlIGFkbWluL2VtYWlscyBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvYXR0YWNobWVudHNfbW9kYWxcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdkZWxldGVfb2xkX2VtYWlsc19tb2RhbCcsXG5cbiAgICBbXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9lbWFpbHMnXG4gICAgXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOkNvbnRyb2xsZXJzL2F0dGFjaG1lbnRzX21vZGFsICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFJlZmVyZW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbWFpbHMgTWFpbiBUYWJsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRhYmxlID0gJCgnI2VtYWlscy10YWJsZScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE1vZHVsZSBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVsZXRlIG9sZCBlbWFpbHMgcmVxdWVzdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IENvbnRhaW5zIHRoZSBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9vbkRlbGV0ZU9sZEVtYWlscyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gVmFsaWRhdGUgc2VsZWN0ZWQgZGF0ZSBiZWZvcmUgbWFraW5nIHRoZSByZXF1ZXN0LlxuICAgICAgICAgICAgaWYgKCR0aGlzLmZpbmQoJyNlbWFpbC1yZW1vdmFsLWRhdGUnKS52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIGRvIG5vdCBwcm9jZWVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgY29uZmlybWF0aW9uIG1vZGFsIGJlZm9yZSBwcm9jZWVkaW5nLlxuICAgICAgICAgICAgY29uc3QgcmVtb3ZhbERhdGUgPSAkdGhpcy5maW5kKCcjZW1haWwtcmVtb3ZhbC1kYXRlJykuZGF0ZXBpY2tlcignZ2V0RGF0ZScpLnRvU3RyaW5nKCd5eXl5LU1NLWRkJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1vZGFsT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZToganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2RlbGV0ZScsICdidXR0b25zJykgKyAnIC0gJyArIHJlbW92YWxEYXRlLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdwcm9tcHRfZGVsZXRlX29sZF9lbWFpbHMnLCAnZW1haWxzJyksXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbm8nLCAnbGlnaHRib3hfYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3llcycsICdsaWdodGJveF9idXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5kZWxldGVPbGRFbWFpbHMocmVtb3ZhbERhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ21lc3NhZ2VfZGVsZXRlX29sZF9lbWFpbHNfc3VjY2VzcycsICdlbWFpbHMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdJbmZvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRhYmxlLkRhdGFUYWJsZSgpLmFqYXgucmVsb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHJlc3BvbnNlLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwubWVzc2FnZShtb2RhbE9wdGlvbnMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIG1vZHVsZSwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnI2RlbGV0ZS1vbGQtZW1haWxzJywgX29uRGVsZXRlT2xkRW1haWxzKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
