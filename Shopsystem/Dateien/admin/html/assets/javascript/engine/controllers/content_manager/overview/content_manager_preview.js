'use strict';

/* --------------------------------------------------------------
 content_manager_preview.js 2017-09-07
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Content Manager Preview
 *
 * Controller Module to open preview modal
 *
 * Opens a modal with the preview of the selected Content Manager entry.
 */
gx.controllers.module('content_manager_preview', ['modal'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Preview modal.
     *
     * @type {jQuery}
     */
    var $modal = $('.preview.modal');

    /**
     * Open preview icon selector string.
     *
     * @type {String}
     */
    var openPreviewSelector = '.open-preview';

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    function _onPreviewClick(event) {
        event.preventDefault();

        // Iframe that should show the preview
        var $iframe = $modal.find('.modal-body iframe');

        // Id of the content that should be shown in preview modal
        var content_id = $(event.target).parents(openPreviewSelector).data('contentId');

        // Link of the content view
        var content_link = $(event.target).parents(openPreviewSelector).data('content-link');

        // Url of link element that should be shown in preview modal
        var link_url = $(event.target).parents(openPreviewSelector).attr('href');

        // Copy content view link button
        var $copyLinkButton = $modal.find('button.copy-link');
        if (typeof content_link == 'undefined' || !content_link.length) {
            $copyLinkButton.hide();
        } else {
            $copyLinkButton.show();
        }

        // Check if a link URL is set. If not use the content id to display a preview
        if (link_url !== '#' && link_url.indexOf('http') >= 0) {
            $iframe.css('display', 'none');
            $modal.find('.modal-body').append(_generateContentInfoMarkup(link_url));
        } else if (link_url !== '#' && link_url.indexOf('http') < 0) {
            $iframe.css('display', 'block');
            $iframe.attr('src', jse.core.config.get('appUrl') + '/' + link_url);
        } else {
            $iframe.css('display', 'block');
            $iframe.attr('src', jse.core.config.get('appUrl') + '/admin/content_preview.php?coID=' + content_id);
        }

        // Display the preview modal
        $modal.modal('show');

        // Handle copy content view link button click event.
        $copyLinkButton.off('click').on('click', function () {
            return _onCopyLinkButtonClick(content_link);
        });
    }

    /**
     * Handles the copy content view link to clipboard
     *
     * @param {String} url Content Link.
     */
    function _onCopyLinkButtonClick(url) {
        $('body').append('<input value="' + url + '" id="copy-content-view-link" style="position: fixed; left: -9999px; opacity: 0;">');
        var linkInput = $('#copy-content-view-link');
        linkInput.focus();
        linkInput.select();
        document.execCommand('copy');
        linkInput.remove();

        var $copyLinkButton = $modal.find('button.copy-link');
        // Copy Link Button Label phrases
        var copyLinkButtonLabel = jse.core.lang.translate('COPY_LINK', 'content_manager');
        var copiedButtonLabel = jse.core.lang.translate('COPIED', 'content_manager');
        $copyLinkButton.text(copiedButtonLabel);
        setTimeout(function () {
            $copyLinkButton.text(copyLinkButtonLabel);
        }, 500);
    }

    /**
     * Generates HTML containing the external link information.
     *
     * @param {String} data Link.
     *
     * @return {String} Created HTML string.
     */
    function _generateContentInfoMarkup(data) {
        // Label phrases.
        var externalLinkInfo = jse.core.lang.translate('TEXT_EXTERNAL_LINK_INFO', 'content_manager');

        // Return markup.
        return '\n\t\t\t\t\t<div class="col-md-12">\n\t\t\t\t\t\t' + data + ' ' + externalLinkInfo + '\n\t\t\t\t\t</div>\n\t\t\t';
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to click event on preview icon
        $this.on('click', openPreviewSelector, _onPreviewClick);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9vdmVydmlldy9jb250ZW50X21hbmFnZXJfcHJldmlldy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRtb2RhbCIsIm9wZW5QcmV2aWV3U2VsZWN0b3IiLCJfb25QcmV2aWV3Q2xpY2siLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiJGlmcmFtZSIsImZpbmQiLCJjb250ZW50X2lkIiwidGFyZ2V0IiwicGFyZW50cyIsImNvbnRlbnRfbGluayIsImxpbmtfdXJsIiwiYXR0ciIsIiRjb3B5TGlua0J1dHRvbiIsImxlbmd0aCIsImhpZGUiLCJzaG93IiwiaW5kZXhPZiIsImNzcyIsImFwcGVuZCIsIl9nZW5lcmF0ZUNvbnRlbnRJbmZvTWFya3VwIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsIm1vZGFsIiwib2ZmIiwib24iLCJfb25Db3B5TGlua0J1dHRvbkNsaWNrIiwidXJsIiwibGlua0lucHV0IiwiZm9jdXMiLCJzZWxlY3QiLCJkb2N1bWVudCIsImV4ZWNDb21tYW5kIiwicmVtb3ZlIiwiY29weUxpbmtCdXR0b25MYWJlbCIsImxhbmciLCJ0cmFuc2xhdGUiLCJjb3BpZWRCdXR0b25MYWJlbCIsInRleHQiLCJzZXRUaW1lb3V0IiwiZXh0ZXJuYWxMaW5rSW5mbyIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0kseUJBREosRUFHSSxDQUNJLE9BREosQ0FISixFQU9JLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxTQUFTRCxFQUFFLGdCQUFGLENBQWY7O0FBRUE7Ozs7O0FBS0EsUUFBTUUsc0JBQXNCLGVB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Z0IyQixJQUFoQixDQUFxQkQsaUJBQXJCO0FBQ0FFLG1CQUFXLFlBQU07QUFDYjVCLDRCQUFnQjJCLElBQWhCLENBQXFCSixtQkFBckI7QUFDSCxTQUZELEVBRUcsR0FGSDtBQUdIOztBQUdEOzs7Ozs7O0FBT0EsYUFBU2hCLDBCQUFULENBQW9DdkIsSUFBcEMsRUFBMEM7QUFDdEM7QUFDQSxZQUFNNkMsbUJBQW1CckIsSUFBSUMsSUFBSixDQUFTZSxJQUFULENBQWNDLFNBQWQsQ0FBd0IseUJBQXhCLEVBQW1ELGlCQUFuRCxDQUF6Qjs7QUFFQTtBQUNBLHFFQUVKekMsSUFGSSxTQUVJNkMsZ0JBRko7QUFLSDs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE5QyxXQUFPK0MsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCO0FBQ0E3QyxjQUFNNkIsRUFBTixDQUFTLE9BQVQsRUFBa0IxQixtQkFBbEIsRUFBdUNDLGVBQXZDOztBQUVBO0FBQ0EwQztBQUNILEtBTkQ7O0FBUUEsV0FBT2hELE1BQVA7QUFDSCxDQXBKTCIsImZpbGUiOiJjb250ZW50X21hbmFnZXIvb3ZlcnZpZXcvY29udGVudF9tYW5hZ2VyX3ByZXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNvbnRlbnRfbWFuYWdlcl9wcmV2aWV3LmpzIDIwMTctMDktMDdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIENvbnRlbnQgTWFuYWdlciBQcmV2aWV3XG4gKlxuICogQ29udHJvbGxlciBNb2R1bGUgdG8gb3BlbiBwcmV2aWV3IG1vZGFsXG4gKlxuICogT3BlbnMgYSBtb2RhbCB3aXRoIHRoZSBwcmV2aWV3IG9mIHRoZSBzZWxlY3RlZCBDb250ZW50IE1hbmFnZXIgZW50cnkuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnY29udGVudF9tYW5hZ2VyX3ByZXZpZXcnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUHJldmlldyBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICRtb2RhbCA9ICQoJy5wcmV2aWV3Lm1vZGFsJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wZW4gcHJldmlldyBpY29uIHNlbGVjdG9yIHN0cmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wZW5QcmV2aWV3U2VsZWN0b3IgPSAnLm9wZW4tcHJldmlldyc7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBmdW5jdGlvbiBfb25QcmV2aWV3Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIElmcmFtZSB0aGF0IHNob3VsZCBzaG93IHRoZSBwcmV2aWV3XG4gICAgICAgICAgICBjb25zdCAkaWZyYW1lID0gJG1vZGFsLmZpbmQoJy5tb2RhbC1ib2R5IGlmcmFtZScpO1xuXG4gICAgICAgICAgICAvLyBJZCBvZiB0aGUgY29udGVudCB0aGF0IHNob3VsZCBiZSBzaG93biBpbiBwcmV2aWV3IG1vZGFsXG4gICAgICAgICAgICBjb25zdCBjb250ZW50X2lkID0gJChldmVudC50YXJnZXQpLnBhcmVudHMob3BlblByZXZpZXdTZWxlY3RvcikuZGF0YSgnY29udGVudElkJyk7XG5cbiAgICAgICAgICAgIC8vIExpbmsgb2YgdGhlIGNvbnRlbnQgdmlld1xuICAgICAgICAgICAgY29uc3QgY29udGVudF9saW5rID0gJChldmVudC50YXJnZXQpLnBhcmVudHMob3BlblByZXZpZXdTZWxlY3RvcikuZGF0YSgnY29udGVudC1saW5rJyk7XG5cbiAgICAgICAgICAgIC8vIFVybCBvZiBsaW5rIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc2hvd24gaW4gcHJldmlldyBtb2RhbFxuICAgICAgICAgICAgY29uc3QgbGlua191cmwgPSAkKGV2ZW50LnRhcmdldCkucGFyZW50cyhvcGVuUHJldmlld1NlbGVjdG9yKS5hdHRyKCdocmVmJyk7XG5cbiAgICAgICAgICAgIC8vIENvcHkgY29udGVudCB2aWV3IGxpbmsgYnV0dG9uXG4gICAgICAgICAgICBjb25zdCAkY29weUxpbmtCdXR0b24gPSAkbW9kYWwuZmluZCgnYnV0dG9uLmNvcHktbGluaycpO1xuICAgICAgICAgICAgaWYodHlwZW9mIGNvbnRlbnRfbGluayA9PSAndW5kZWZpbmVkJyB8fCAhY29udGVudF9saW5rLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRjb3B5TGlua0J1dHRvbi5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRjb3B5TGlua0J1dHRvbi5zaG93KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGEgbGluayBVUkwgaXMgc2V0LiBJZiBub3QgdXNlIHRoZSBjb250ZW50IGlkIHRvIGRpc3BsYXkgYSBwcmV2aWV3XG4gICAgICAgICAgICBpZiAobGlua191cmwgIT09ICcjJyAmJiBsaW5rX3VybC5pbmRleE9mKCdodHRwJykgPj0gMCkge1xuICAgICAgICAgICAgICAgICRpZnJhbWUuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAkbW9kYWwuZmluZCgnLm1vZGFsLWJvZHknKS5hcHBlbmQoX2dlbmVyYXRlQ29udGVudEluZm9NYXJrdXAobGlua191cmwpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGlua191cmwgIT09ICcjJyAmJiBsaW5rX3VybC5pbmRleE9mKCdodHRwJykgPCAwKSB7XG4gICAgICAgICAgICAgICAgJGlmcmFtZS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgICAgICAgICAkaWZyYW1lLmF0dHIoJ3NyYycsIGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9gICsgbGlua191cmwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaWZyYW1lLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgICAgICRpZnJhbWUuYXR0cignc3JjJywgYCR7anNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJyl9L2FkbWluL2NvbnRlbnRfcHJldmlldy5waHA/Y29JRD1gICsgY29udGVudF9pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERpc3BsYXkgdGhlIHByZXZpZXcgbW9kYWxcbiAgICAgICAgICAgICRtb2RhbC5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgY29weSBjb250ZW50IHZpZXcgbGluayBidXR0b24gY2xpY2sgZXZlbnQuXG4gICAgICAgICAgICAkY29weUxpbmtCdXR0b25cbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICgpID0+IF9vbkNvcHlMaW5rQnV0dG9uQ2xpY2soY29udGVudF9saW5rKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgY29weSBjb250ZW50IHZpZXcgbGluayB0byBjbGlwYm9hcmRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBDb250ZW50IExpbmsuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Db3B5TGlua0J1dHRvbkNsaWNrKHVybCkge1xuICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZCgnPGlucHV0IHZhbHVlPVwiJysgdXJsICsnXCIgaWQ9XCJjb3B5LWNvbnRlbnQtdmlldy1saW5rXCIgc3R5bGU9XCJwb3NpdGlvbjogZml4ZWQ7IGxlZnQ6IC05OTk5cHg7IG9wYWNpdHk6IDA7XCI+Jyk7XG4gICAgICAgICAgICBsZXQgbGlua0lucHV0ID0gJCgnI2NvcHktY29udGVudC12aWV3LWxpbmsnKTtcbiAgICAgICAgICAgIGxpbmtJbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgbGlua0lucHV0LnNlbGVjdCgpO1xuICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKTtcbiAgICAgICAgICAgIGxpbmtJbnB1dC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgY29uc3QgJGNvcHlMaW5rQnV0dG9uID0gJG1vZGFsLmZpbmQoJ2J1dHRvbi5jb3B5LWxpbmsnKTtcbiAgICAgICAgICAgIC8vIENvcHkgTGluayBCdXR0b24gTGFiZWwgcGhyYXNlc1xuICAgICAgICAgICAgY29uc3QgY29weUxpbmtCdXR0b25MYWJlbCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdDT1BZX0xJTksnLCAnY29udGVudF9tYW5hZ2VyJyk7XG4gICAgICAgICAgICBjb25zdCBjb3BpZWRCdXR0b25MYWJlbCA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdDT1BJRUQnLCAnY29udGVudF9tYW5hZ2VyJyk7XG4gICAgICAgICAgICAkY29weUxpbmtCdXR0b24udGV4dChjb3BpZWRCdXR0b25MYWJlbCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkY29weUxpbmtCdXR0b24udGV4dChjb3B5TGlua0J1dHRvbkxhYmVsKTtcbiAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZW5lcmF0ZXMgSFRNTCBjb250YWluaW5nIHRoZSBleHRlcm5hbCBsaW5rIGluZm9ybWF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBMaW5rLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IENyZWF0ZWQgSFRNTCBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2VuZXJhdGVDb250ZW50SW5mb01hcmt1cChkYXRhKSB7XG4gICAgICAgICAgICAvLyBMYWJlbCBwaHJhc2VzLlxuICAgICAgICAgICAgY29uc3QgZXh0ZXJuYWxMaW5rSW5mbyA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0VYVEVSTkFMX0xJTktfSU5GTycsICdjb250ZW50X21hbmFnZXInKTtcblxuICAgICAgICAgICAgLy8gUmV0dXJuIG1hcmt1cC5cbiAgICAgICAgICAgIHJldHVybiBgXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbC1tZC0xMlwiPlxuXHRcdFx0XHRcdFx0JHtkYXRhfSAke2V4dGVybmFsTGlua0luZm99XG5cdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgLy8gTGlzdGVuIHRvIGNsaWNrIGV2ZW50IG9uIHByZXZpZXcgaWNvblxuICAgICAgICAgICAgJHRoaXMub24oJ2NsaWNrJywgb3BlblByZXZpZXdTZWxlY3RvciwgX29uUHJldmlld0NsaWNrKTtcblxuICAgICAgICAgICAgLy8gRmluaXNoIGluaXRpYWxpemF0aW9uLlxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
