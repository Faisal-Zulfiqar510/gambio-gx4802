'use strict';

/* --------------------------------------------------------------
 emails_toolbar.js 2016-10-11
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Emails Toolbar Controller
 *
 * This controller will handle the main toolbar operations of the admin/emails page.
 *
 * @module Controllers/emails_toolbar
 */
gx.controllers.module('emails_toolbar', [gx.source + '/libs/emails', 'url_arguments'],

/** @lends module:Controllers/emails_toolbar */

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
     * Table Selector
     *
     * @type {object}
     */
    $table = $('#emails-table'),


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
    module = {
        model: {
            settings: jse.core.config.get('appUrl') + '/admin/admin.php?do=Emails/GetEmailSettings'
        }
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Convert the line breaks to <br> elements.
     *
     * @param {string} text Text to be converted.
     *
     * @return {string} Returns the converted string.
     */
    var _nl2br = function _nl2br(text) {
        return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    };

    /**
     * Display create new email modal.
     *
     * @param {object} event Contains event information.
     */
    var _onCreateNewEmail = function _onCreateNewEmail(event) {
        // Reset modal elements to initial state.
        jse.libs.emails.resetModal($modal);

        // Apply Email Settings to the Email Modal
        if (typeof module.model.settings !== 'undefined' && module.model.settings !== null) {
            // Set the email signature (if not empty). We'll only set the signature to the CKEditor because
            // if the signature contains HTML markup it cannot be sanitized properly for the plain content.
            if (module.model.settings.signature !== null && module.model.settings.signature !== '') {
                var signatureHtml = '<br><p>-----<br>' + _nl2br(module.model.settings.signature) + '</p>';
                CKEDITOR.instances['content-html'].setData(signatureHtml);
                var signaturePlain = '\n\n-----\n' + module.model.settings.signature.replace(/(<([^>]+)>)/gi, '');
                $modal.find('#content-plain').val(signaturePlain);
            }

            // Disable the HTML content if the shop uses only plain content for the emails.
            if (module.model.settings.useHtml === false) {
                $modal.find('.content').find('.tab-headline:eq(0), .tab-content:eq(0)').hide();
                $modal.find('.content').find('.tab-headline:eq(1)').trigger('click');
            }

            // Preload sender and reply to contact data if provided.
            if (typeof module.model.settings.replyAddress !== 'undefined' && module.model.settings.replyAddress !== '') {
                $modal.find('#sender-email, #reply-to-email').val(module.model.settings.replyAddress);
            }
            if (typeof module.model.settings.replyName !== 'undefined' && module.model.settings.replyName !== '') {
                $modal.find('#sender-name, #reply-to-name').val(module.model.settings.replyName);
            }
        }

        // Prepare and display new modal window.
        $modal.dialog({
            title: jse.core.lang.translate('new_mail', 'buttons'),
            width: 1000,
            height: 800,
            modal: false,
            dialogClass: 'gx-container',
            closeOnEscape: false,
            buttons: jse.libs.emails.getDefaultModalButtons($modal, $table),
            open: jse.libs.emails.colorizeButtonsForEditMode
        });
    };

    /**
     * Perform search request on the DataTable instance.
     *
     * @param {object} event Contains the event data.
     */
    var _onTableSearchSubmit = function _onTableSearchSubmit(event) {
        event.preventDefault();
        var keyword = $this.find('#search-keyword').val();
        $table.DataTable().search(keyword).draw();
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        // Set default "#bulk-action" value.
        $this.find('#bulk-action').val('');

        // Bind Event Handlers
        $this.on('click', '#create-new-email', _onCreateNewEmail).on('submit', '#quick-search', _onTableSearchSubmit);

        // Check if the "mail_to" parameter is present and process its value within the new email modal layer.
        var getParameters = jse.libs.url_arguments.getUrlParameters();
        if (typeof getParameters.mailto !== 'undefined') {
            _onCreateNewEmail({}); // Display the new email modal.
            $modal.find('#recipient-email').val(getParameters.mailto);
        }

        done();
    };

    // Return module object to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtYWlscy9lbWFpbHNfdG9vbGJhci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRtb2RhbCIsIiR0YWJsZSIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIm1vZGVsIiwic2V0dGluZ3MiLCJqc2UiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwiX25sMmJyIiwidGV4dCIsInJlcGxhY2UiLCJfb25DcmVhdGVOZXdFbWFpbCIsImV2ZW50IiwibGlicyIsImVtYWlscyIsInJlc2V0TW9kYWwiLCJzaWduYXR1cmUiLCJzaWduYXR1cmVIdG1sIiwiQ0tFRElUT1IiLCJpbnN0YW5jZXMiLCJzZXREYXRhIiwic2lnbmF0dXJlUGxhaW4iLCJmaW5kIiwidmFsIiwidXNlSHRtbCIsImhpZGUiLCJ0cmlnZ2VyIiwicmVwbHlBZGRyZXNzIiwicmVwbHlOYW1lIiwiZGlhbG9nIiwidGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwid2lkdGgiLCJoZWlnaHQiLCJtb2RhbCIsImRpYWxvZ0NsYXNzIiwiY2xvc2VPbkVzY2FwZSIsImJ1dHRvbnMiLCJnZXREZWZhdWx0TW9kYWxCdXR0b25zIiwib3BlbiIsImNvbG9yaXplQnV0dG9uc0ZvckVkaXRNb2RlIiwiX29uVGFibGVTZWFyY2hTdWJtaXQiLCJwcmV2ZW50RGVmYXVsdCIsImtleXdvcmQiLCJEYXRhVGFibGUiLCJzZWFyY2giLCJkcmF3IiwiaW5pdCIsImRvbmUiLCJvbiIsImdldFBhcmFtZXRlcnMiLCJ1cmxfYXJndW1lbnRzIiwiZ2V0VXJsUGFyYW1ldGVycyIsIm1haWx0byJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGdCQURKLEVBR0ksQ0FDSUYsR0FBR0csTUFBSCxHQUFZLGNBRGhCLEVBRUksZUFGSixDQUhKOztBQVFJOztBQUVBLFVB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LGdCQUFnQi9DLElBQUlTLElBQUosQ0FBU3VDLGFBQVQsQ0FBdUJDLGdCQUF2QixFQUFwQjtBQUNBLFlBQUksT0FBT0YsY0FBY0csTUFBckIsS0FBZ0MsV0FBcEMsRUFBaUQ7QUFDN0MzQyw4QkFBa0IsRUFBbEIsRUFENkMsQ0FDdEI7QUFDdkJkLG1CQUFPeUIsSUFBUCxDQUFZLGtCQUFaLEVBQWdDQyxHQUFoQyxDQUFvQzRCLGNBQWNHLE1BQWxEO0FBQ0g7O0FBRURMO0FBQ0gsS0FqQkQ7O0FBbUJBO0FBQ0EsV0FBT3pELE1BQVA7QUFDSCxDQTFLTCIsImZpbGUiOiJlbWFpbHMvZW1haWxzX3Rvb2xiYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGVtYWlsc190b29sYmFyLmpzIDIwMTYtMTAtMTFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEVtYWlscyBUb29sYmFyIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgd2lsbCBoYW5kbGUgdGhlIG1haW4gdG9vbGJhciBvcGVyYXRpb25zIG9mIHRoZSBhZG1pbi9lbWFpbHMgcGFnZS5cbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL2VtYWlsc190b29sYmFyXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnZW1haWxzX3Rvb2xiYXInLFxuXG4gICAgW1xuICAgICAgICBneC5zb3VyY2UgKyAnL2xpYnMvZW1haWxzJyxcbiAgICAgICAgJ3VybF9hcmd1bWVudHMnXG4gICAgXSxcblxuICAgIC8qKiBAbGVuZHMgbW9kdWxlOkNvbnRyb2xsZXJzL2VtYWlsc190b29sYmFyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFJlZmVyZW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2RhbCBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRtb2RhbCA9ICQoJyNlbWFpbHMtbW9kYWwnKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUYWJsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0YWJsZSA9ICQoJyNlbWFpbHMtdGFibGUnKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE1vZHVsZSBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89RW1haWxzL0dldEVtYWlsU2V0dGluZ3MnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbnZlcnQgdGhlIGxpbmUgYnJlYWtzIHRvIDxicj4gZWxlbWVudHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gYmUgY29udmVydGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX25sMmJyID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAodGV4dCArICcnKS5yZXBsYWNlKC8oW14+XFxyXFxuXT8pKFxcclxcbnxcXG5cXHJ8XFxyfFxcbikvZywgJyQxJyArICc8YnI+JyArICckMicpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwbGF5IGNyZWF0ZSBuZXcgZW1haWwgbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBDb250YWlucyBldmVudCBpbmZvcm1hdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25DcmVhdGVOZXdFbWFpbCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgLy8gUmVzZXQgbW9kYWwgZWxlbWVudHMgdG8gaW5pdGlhbCBzdGF0ZS5cbiAgICAgICAgICAgIGpzZS5saWJzLmVtYWlscy5yZXNldE1vZGFsKCRtb2RhbCk7XG5cbiAgICAgICAgICAgIC8vIEFwcGx5IEVtYWlsIFNldHRpbmdzIHRvIHRoZSBFbWFpbCBNb2RhbFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUubW9kZWwuc2V0dGluZ3MgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5tb2RlbC5zZXR0aW5ncyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgZW1haWwgc2lnbmF0dXJlIChpZiBub3QgZW1wdHkpLiBXZSdsbCBvbmx5IHNldCB0aGUgc2lnbmF0dXJlIHRvIHRoZSBDS0VkaXRvciBiZWNhdXNlXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHNpZ25hdHVyZSBjb250YWlucyBIVE1MIG1hcmt1cCBpdCBjYW5ub3QgYmUgc2FuaXRpemVkIHByb3Blcmx5IGZvciB0aGUgcGxhaW4gY29udGVudC5cbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlLm1vZGVsLnNldHRpbmdzLnNpZ25hdHVyZSAhPT0gbnVsbCAmJiBtb2R1bGUubW9kZWwuc2V0dGluZ3Muc2lnbmF0dXJlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2lnbmF0dXJlSHRtbCA9ICc8YnI+PHA+LS0tLS08YnI+JyArIF9ubDJicihtb2R1bGUubW9kZWwuc2V0dGluZ3Muc2lnbmF0dXJlKSArICc8L3A+JztcbiAgICAgICAgICAgICAgICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzWydjb250ZW50LWh0bWwnXS5zZXREYXRhKHNpZ25hdHVyZUh0bWwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2lnbmF0dXJlUGxhaW4gPSAnXFxuXFxuLS0tLS1cXG4nICsgbW9kdWxlLm1vZGVsLnNldHRpbmdzLnNpZ25hdHVyZS5yZXBsYWNlKC8oPChbXj5dKyk+KS9naSxcbiAgICAgICAgICAgICAgICAgICAgICAgICcnKTtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNjb250ZW50LXBsYWluJykudmFsKHNpZ25hdHVyZVBsYWluKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIHRoZSBIVE1MIGNvbnRlbnQgaWYgdGhlIHNob3AgdXNlcyBvbmx5IHBsYWluIGNvbnRlbnQgZm9yIHRoZSBlbWFpbHMuXG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5tb2RlbC5zZXR0aW5ncy51c2VIdG1sID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLmNvbnRlbnQnKS5maW5kKCcudGFiLWhlYWRsaW5lOmVxKDApLCAudGFiLWNvbnRlbnQ6ZXEoMCknKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcuY29udGVudCcpLmZpbmQoJy50YWItaGVhZGxpbmU6ZXEoMSknKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFByZWxvYWQgc2VuZGVyIGFuZCByZXBseSB0byBjb250YWN0IGRhdGEgaWYgcHJvdmlkZWQuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUubW9kZWwuc2V0dGluZ3MucmVwbHlBZGRyZXNzICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUubW9kZWwuc2V0dGluZ3MucmVwbHlBZGRyZXNzICE9PVxuICAgICAgICAgICAgICAgICAgICAnJykge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnI3NlbmRlci1lbWFpbCwgI3JlcGx5LXRvLWVtYWlsJykudmFsKG1vZHVsZS5tb2RlbC5zZXR0aW5ncy5yZXBseUFkZHJlc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vZHVsZS5tb2RlbC5zZXR0aW5ncy5yZXBseU5hbWUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5tb2RlbC5zZXR0aW5ncy5yZXBseU5hbWUgIT09XG4gICAgICAgICAgICAgICAgICAgICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICRtb2RhbC5maW5kKCcjc2VuZGVyLW5hbWUsICNyZXBseS10by1uYW1lJykudmFsKG1vZHVsZS5tb2RlbC5zZXR0aW5ncy5yZXBseU5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUHJlcGFyZSBhbmQgZGlzcGxheSBuZXcgbW9kYWwgd2luZG93LlxuICAgICAgICAgICAgJG1vZGFsLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgdGl0bGU6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCduZXdfbWFpbCcsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA4MDAsXG4gICAgICAgICAgICAgICAgbW9kYWw6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRpYWxvZ0NsYXNzOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICBjbG9zZU9uRXNjYXBlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBidXR0b25zOiBqc2UubGlicy5lbWFpbHMuZ2V0RGVmYXVsdE1vZGFsQnV0dG9ucygkbW9kYWwsICR0YWJsZSksXG4gICAgICAgICAgICAgICAgb3BlbjoganNlLmxpYnMuZW1haWxzLmNvbG9yaXplQnV0dG9uc0ZvckVkaXRNb2RlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUGVyZm9ybSBzZWFyY2ggcmVxdWVzdCBvbiB0aGUgRGF0YVRhYmxlIGluc3RhbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgQ29udGFpbnMgdGhlIGV2ZW50IGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uVGFibGVTZWFyY2hTdWJtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIga2V5d29yZCA9ICR0aGlzLmZpbmQoJyNzZWFyY2gta2V5d29yZCcpLnZhbCgpO1xuICAgICAgICAgICAgJHRhYmxlLkRhdGFUYWJsZSgpLnNlYXJjaChrZXl3b3JkKS5kcmF3KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIFNldCBkZWZhdWx0IFwiI2J1bGstYWN0aW9uXCIgdmFsdWUuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCcjYnVsay1hY3Rpb24nKS52YWwoJycpO1xuXG4gICAgICAgICAgICAvLyBCaW5kIEV2ZW50IEhhbmRsZXJzXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnI2NyZWF0ZS1uZXctZW1haWwnLCBfb25DcmVhdGVOZXdFbWFpbClcbiAgICAgICAgICAgICAgICAub24oJ3N1Ym1pdCcsICcjcXVpY2stc2VhcmNoJywgX29uVGFibGVTZWFyY2hTdWJtaXQpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgXCJtYWlsX3RvXCIgcGFyYW1ldGVyIGlzIHByZXNlbnQgYW5kIHByb2Nlc3MgaXRzIHZhbHVlIHdpdGhpbiB0aGUgbmV3IGVtYWlsIG1vZGFsIGxheWVyLlxuICAgICAgICAgICAgdmFyIGdldFBhcmFtZXRlcnMgPSBqc2UubGlicy51cmxfYXJndW1lbnRzLmdldFVybFBhcmFtZXRlcnMoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZ2V0UGFyYW1ldGVycy5tYWlsdG8gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgX29uQ3JlYXRlTmV3RW1haWwoe30pOyAvLyBEaXNwbGF5IHRoZSBuZXcgZW1haWwgbW9kYWwuXG4gICAgICAgICAgICAgICAgJG1vZGFsLmZpbmQoJyNyZWNpcGllbnQtZW1haWwnKS52YWwoZ2V0UGFyYW1ldGVycy5tYWlsdG8pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIG1vZHVsZSBvYmplY3QgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
