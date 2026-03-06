'use strict';

/* --------------------------------------------------------------
 google_connection_modal.js 2018-05-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx_google_oauth.widgets.module('google_connection_modal', ['xhr'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Widget Reference
     *
     * @type {object}
     */

    var $this = $(this);

    /**
     * Default Options for Widget
     *
     * @type {object}
     */
    var defaults = {
        'from': 'GoogleOAuth',
        'error': '0'
    };

    /**
     * Final Widget Options
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
    // CALLBACKS
    // ------------------------------------------------------------------------
    /**
     * Renders the connection modal.
     *
     * @param {object} response XmlHttpRequests response.
     * @private
     */
    var _renderModal = function _renderModal(response) {
        $this.addClass('adwords-account modal fade').attr('tabindex', '-1').attr('role', 'dialog');

        var $modalDialog = $('<div/>', {
            'class': 'modal-dialog'
        }).appendTo($this);

        var $modalContent = $('<div/>', {
            'class': 'modal-content'
        }).appendTo($modalDialog);

        _renderModalHeader(response).appendTo($modalContent);
        _renderModalBody(response).appendTo($modalContent);

        gx_google_oauth.widgets.init($this);

        $this.modal('show');
    };

    // ------------------------------------------------------------------------
    // UTILITY
    // ------------------------------------------------------------------------
    /**
     * Renders the modal header.
     *
     * @param {object} response XmlHttpRequests response.
     * @param {string} response.modalTitle Title of modal.
     *
     * @returns {jQuery|HTMLElement}
     * @private
     */
    var _renderModalHeader = function _renderModalHeader(response) {
        var $modalHeader = $('<div/>', {
            'class': 'modal-header'
        });

        var $modalHeaderCloseBtn = $('<button/>', {
            'type': 'button',
            'class': 'close',
            'data-dismiss': 'modal',
            'aria-label': 'close'
        }).appendTo($modalHeader);

        $('<span/>', {
            'aria-hidden': 'true',
            'html': '&times;'
        }).appendTo($modalHeaderCloseBtn);

        $('<h4/>', {
            'class': 'modal-title',
            'text': response.modalTitle
        }).appendTo($modalHeader);

        return $modalHeader;
    };

    /**
     * Renders the modal body.
     *
     * @param {object} response XmlHttpRequests response.
     * @param {string} response.iFrameUrl Url of connection iframe.
     * @param {string} response.origin Shop origin, required for redirection of api.
     * @param {string} response.language Language code of currently activated language.
     * @param {string} response.version Current shop version.
     * @returns {jQuery|HTMLElement}
     * @private
     */
    var _renderModalBody = function _renderModalBody(response) {
        var $modalBody = $('<div/>', {
            'class': 'modal-body'
        });

        $('<div/>', {
            'data-gx_google_oauth-widget': 'google_connection_iframe',
            'data-google_connection_iframe-url': response.iFrameUrl,
            'data-google_connection_iframe-origin': response.origin,
            'data-google_connection_iframe-language': response.language,
            'data-google_connection_iframe-error': options.error,
            'data-google_connection_iframe-from': options.from,
            'data-google_connection_iframe-version': response.version
        }).appendTo($modalBody);

        return $modalBody;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        jse.libs.xhr.get({ url: './admin.php?do=GoogleOAuthAjax/connectionModal' }).done(function (response) {
            if (!response.connected) {
                _renderModal(response);
            }
        }).fail(function () {
            throw new Error('Failed to load modal data!');
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvd2lkZ2V0cy9nb29nbGVfY29ubmVjdGlvbl9tb2RhbC5qcyJdLCJuYW1lcyI6WyJneF9nb29nbGVfb2F1dGgiLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9yZW5kZXJNb2RhbCIsImFkZENsYXNzIiwiYXR0ciIsIiRtb2RhbERpYWxvZyIsImFwcGVuZFRvIiwiJG1vZGFsQ29udGVudCIsIl9yZW5kZXJNb2RhbEhlYWRlciIsInJlc3BvbnNlIiwiX3JlbmRlck1vZGFsQm9keSIsImluaXQiLCJtb2RhbCIsIiRtb2RhbEhlYWRlciIsIiRtb2RhbEhlYWRlckNsb3NlQnRuIiwibW9kYWxUaXRsZSIsIiRtb2RhbEJvZHkiLCJpRnJhbWVVcmwiLCJvcmlnaW4iLCJsYW5ndWFnZSIsImVycm9yIiwiZnJvbSIsInZlcnNpb24iLCJkb25lIiwianNlIiwibGlicyIsInhociIsImdldCIsInVybCIsImNvbm5lY3RlZCIsImZhaWwiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxnQkFBZ0JDLE9BQWhCLENBQXdCQyxNQUF4QixDQUNJLHlCQURKLEVBR0ksQ0FBQyxLQUFELENBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVztBQUNiLGdCQUFRLGFBREs7QUFFYixpQkFBUztBQUZJLEtBQWpCOztBQUtBOzs7OztBQUtBLFFBQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1ELFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBTUEsUUFBTU8sZUFBZSxTQUFmQSxZQUFlLFdBQVk7QUFDN0JMLGNBQU1NLFFBQU4sQ0FBZSw0QkFBZixFQUE2Q0MsSUFBN0MsQ0FBa0QsVUFBbEQsRUFBOEQsSUFBOUQsRUFBb0VBLElBQXBFLENBQXlFLE1BQXpFLEVBQWlGLFFBQWpGOztBQUVBLFlBQU1DLGVBQWVQLEVBQUUsUUFBRixFQUFZO0FBQzdCLHFCQUFTO0FBRG9CLFNBQVosRUFFbEJRLFFBRmtCLENBRVRULEtBRlMsQ0FBckI7O0FBSUEsWUFBTVUsZ0JBQWdCVCxFQUFFLFFBQUYsRUFBWTtBQUM5QixxQkFBUztBQURxQixTQUFaLEVBRW5CUSxRQUZtQixDQUVWRCxZQUZVLENBQXRCOztBQUlBRywyQkFBbUJDLFFBQW5CLEVBQTZCSCxRQUE3QixDQUFzQ0MsYUFBdEM7QUFDQUcseUJBQWlCRCxRQUFqQixFQUEyQkgsUUFBM0IsQ0FBb0NDLGFBQXBDOztBQUVBZCx3QkFBZ0JDLE9BQWhCLENBQXdCaUIsSUFBeEIsQ0FBNkJkLEtBQTdCOztBQUVBQSxjQUFNZSxLQUFOLENBQVksTUFBWjtBQUNILEtBakJEOztBQW1CQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FBU0EsUUFBTUoscUJBQXFCLFNBQXJCQSxrQkFBcUIsV0FBWTtBQUNuQyxZQUFNSyxlQUFlZixFQUFFLFFBQUYsRUFBWTtBQUM3QixxQkFBUztBQURvQixTQUFaLENBQXJCOztBQUlBLFlBQU1nQix1QkFBdUJoQixFQUFFLFdBQUYsRUFBZTtBQUN4QyxvQkFBUSxRQURnQztBQUV4QyxxQkFBUyxPQUYrQjtBQUd4Qyw0QkFBZ0IsT0FId0I7QUFJeEMsMEJBQWM7QUFKMEIsU0FBZixFQUsxQlEsUUFMMEIsQ0FLakJPLFlBTGlCLENBQTdCOztBQU9BZixVQUFFLFNBQUYsRUFBYTtBQUNULDJCQUFlLE1BRE47QUFFVCxvQkFBUTtBQUZDLFNBQWIsRUFHR1EsUUFISCxDQUdZUSxvQkFIWjs7QUFLQWhCLFVBQUUsT0FBRixFQUFXO0FBQ1AscUJBQVMsYUFERjtBQUVQLG9CQUFRVyxTQUFTTTtBQUZWLFNBQVgsRUFHR1QsUUFISCxDQUdZTyxZQUhaOztBQUtBLGVBQU9BLFlBQVA7QUFDSCxLQXZCRDs7QUF5QkE7Ozs7Ozs7Ozs7O0FBV0EsUUFBTUgsbUJBQW1CLFNBQW5CQSxnQkFBbUIsV0FBWTtBQUNqQyxZQUFNTSxhQUFhbEIsRUFBRSxRQUFGLEVBQVk7QUFDM0IscUJBQVM7QUFEa0IsU0FBWixDQUFuQjs7QUFJQUEsVUFBRSxRQUFGLEVBQVk7QUFDUiwyQ0FBK0IsMEJBRHZCO0FBRVIsaURBQXFDVyxTQUFTUSxTQUZ0QztBQUdSLG9EQUF3Q1IsU0FBU1MsTUFIekM7QUFJUixzREFBMENULFNBQVNVLFFBSjNDO0FBS1IsbURBQXVDbkIsUUFBUW9CLEtBTHZDO0FBTVIsa0RBQXNDcEIsUUFBUXFCLElBTnRDO0FBT1IscURBQXlDWixTQUFTYTtBQVAxQyxTQUFaLEVBUUdoQixRQVJILENBUVlVLFVBUlo7O0FBVUEsZUFBT0EsVUFBUDtBQUNILEtBaEJEOztBQWtCQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBckIsV0FBT2dCLElBQVAsR0FBYyxVQUFVWSxJQUFWLEVBQWdCO0FBQzFCQyxZQUFJQyxJQUFKLENBQVNDLEdBQVQsQ0FBYUMsR0FBYixDQUFpQixFQUFDQyxLQUFLLGdEQUFOLEVBQWpCLEVBQ0tMLElBREwsQ0FDVSxvQkFBWTtBQUNkLGdCQUFJLENBQUNkLFNBQVNvQixTQUFkLEVBQXlCO0FBQ3JCM0IsNkJBQWFPLFFBQWI7QUFDSDtBQUNKLFNBTEwsRUFNS3FCLElBTkwsQ0FNVSxZQUFNO0FBQ1Isa0JBQU0sSUFBSUMsS0FBSixDQUFVLDRCQUFWLENBQU47QUFDSCxTQVJMOztBQVVBUjtBQUNILEtBWkQ7O0FBY0EsV0FBTzVCLE1BQVA7QUFDSCxDQWhLTCIsImZpbGUiOiJBZG1pbi9KYXZhc2NyaXB0L3dpZGdldHMvZ29vZ2xlX2Nvbm5lY3Rpb25fbW9kYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGdvb2dsZV9jb25uZWN0aW9uX21vZGFsLmpzIDIwMTgtMDUtMjJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neF9nb29nbGVfb2F1dGgud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2dvb2dsZV9jb25uZWN0aW9uX21vZGFsJyxcblxuICAgIFsneGhyJ10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIFdpZGdldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAnZnJvbSc6ICdHb29nbGVPQXV0aCcsXG4gICAgICAgICAgICAnZXJyb3InOiAnMCdcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gQ0FMTEJBQ0tTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyB0aGUgY29ubmVjdGlvbiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFhtbEh0dHBSZXF1ZXN0cyByZXNwb25zZS5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW5kZXJNb2RhbCA9IHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhZHdvcmRzLWFjY291bnQgbW9kYWwgZmFkZScpLmF0dHIoJ3RhYmluZGV4JywgJy0xJykuYXR0cigncm9sZScsICdkaWFsb2cnKTtcblxuICAgICAgICAgICAgY29uc3QgJG1vZGFsRGlhbG9nID0gJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdtb2RhbC1kaWFsb2cnXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkdGhpcyk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbENvbnRlbnQgPSAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ21vZGFsLWNvbnRlbnQnXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9kYWxEaWFsb2cpO1xuXG4gICAgICAgICAgICBfcmVuZGVyTW9kYWxIZWFkZXIocmVzcG9uc2UpLmFwcGVuZFRvKCRtb2RhbENvbnRlbnQpO1xuICAgICAgICAgICAgX3JlbmRlck1vZGFsQm9keShyZXNwb25zZSkuYXBwZW5kVG8oJG1vZGFsQ29udGVudCk7XG5cbiAgICAgICAgICAgIGd4X2dvb2dsZV9vYXV0aC53aWRnZXRzLmluaXQoJHRoaXMpO1xuXG4gICAgICAgICAgICAkdGhpcy5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBVVElMSVRZXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyB0aGUgbW9kYWwgaGVhZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgWG1sSHR0cFJlcXVlc3RzIHJlc3BvbnNlLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2UubW9kYWxUaXRsZSBUaXRsZSBvZiBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2pRdWVyeXxIVE1MRWxlbWVudH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9yZW5kZXJNb2RhbEhlYWRlciA9IHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbEhlYWRlciA9ICQoJzxkaXYvPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnbW9kYWwtaGVhZGVyJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRtb2RhbEhlYWRlckNsb3NlQnRuID0gJCgnPGJ1dHRvbi8+Jywge1xuICAgICAgICAgICAgICAgICd0eXBlJzogJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2Nsb3NlJyxcbiAgICAgICAgICAgICAgICAnZGF0YS1kaXNtaXNzJzogJ21vZGFsJyxcbiAgICAgICAgICAgICAgICAnYXJpYS1sYWJlbCc6ICdjbG9zZSdcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKCRtb2RhbEhlYWRlcik7XG5cbiAgICAgICAgICAgICQoJzxzcGFuLz4nLCB7XG4gICAgICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxuICAgICAgICAgICAgICAgICdodG1sJzogJyZ0aW1lczsnXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9kYWxIZWFkZXJDbG9zZUJ0bik7XG5cbiAgICAgICAgICAgICQoJzxoNC8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdtb2RhbC10aXRsZScsXG4gICAgICAgICAgICAgICAgJ3RleHQnOiByZXNwb25zZS5tb2RhbFRpdGxlXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9kYWxIZWFkZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gJG1vZGFsSGVhZGVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW5kZXJzIHRoZSBtb2RhbCBib2R5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgWG1sSHR0cFJlcXVlc3RzIHJlc3BvbnNlLlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2UuaUZyYW1lVXJsIFVybCBvZiBjb25uZWN0aW9uIGlmcmFtZS5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlLm9yaWdpbiBTaG9wIG9yaWdpbiwgcmVxdWlyZWQgZm9yIHJlZGlyZWN0aW9uIG9mIGFwaS5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlLmxhbmd1YWdlIExhbmd1YWdlIGNvZGUgb2YgY3VycmVudGx5IGFjdGl2YXRlZCBsYW5ndWFnZS5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlLnZlcnNpb24gQ3VycmVudCBzaG9wIHZlcnNpb24uXG4gICAgICAgICAqIEByZXR1cm5zIHtqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBfcmVuZGVyTW9kYWxCb2R5ID0gcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG1vZGFsQm9keSA9ICQoJzxkaXYvPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnbW9kYWwtYm9keSdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCc8ZGl2Lz4nLCB7XG4gICAgICAgICAgICAgICAgJ2RhdGEtZ3hfZ29vZ2xlX29hdXRoLXdpZGdldCc6ICdnb29nbGVfY29ubmVjdGlvbl9pZnJhbWUnLFxuICAgICAgICAgICAgICAgICdkYXRhLWdvb2dsZV9jb25uZWN0aW9uX2lmcmFtZS11cmwnOiByZXNwb25zZS5pRnJhbWVVcmwsXG4gICAgICAgICAgICAgICAgJ2RhdGEtZ29vZ2xlX2Nvbm5lY3Rpb25faWZyYW1lLW9yaWdpbic6IHJlc3BvbnNlLm9yaWdpbixcbiAgICAgICAgICAgICAgICAnZGF0YS1nb29nbGVfY29ubmVjdGlvbl9pZnJhbWUtbGFuZ3VhZ2UnOiByZXNwb25zZS5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgICAnZGF0YS1nb29nbGVfY29ubmVjdGlvbl9pZnJhbWUtZXJyb3InOiBvcHRpb25zLmVycm9yLFxuICAgICAgICAgICAgICAgICdkYXRhLWdvb2dsZV9jb25uZWN0aW9uX2lmcmFtZS1mcm9tJzogb3B0aW9ucy5mcm9tLFxuICAgICAgICAgICAgICAgICdkYXRhLWdvb2dsZV9jb25uZWN0aW9uX2lmcmFtZS12ZXJzaW9uJzogcmVzcG9uc2UudmVyc2lvblxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oJG1vZGFsQm9keSk7XG5cbiAgICAgICAgICAgIHJldHVybiAkbW9kYWxCb2R5O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBtZXRob2Qgb2YgdGhlIHdpZGdldCwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBqc2UubGlicy54aHIuZ2V0KHt1cmw6ICcuL2FkbWluLnBocD9kbz1Hb29nbGVPQXV0aEFqYXgvY29ubmVjdGlvbk1vZGFsJ30pXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3JlbmRlck1vZGFsKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBsb2FkIG1vZGFsIGRhdGEhJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
