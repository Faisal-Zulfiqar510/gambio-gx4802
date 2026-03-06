/* --------------------------------------------------------------
 google_connection_modal.js 2018-05-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx_google_oauth.widgets.module(
    'google_connection_modal',

    ['xhr'],

    function (data) {

        'use strict';

        // ------------------------------------------------------------------------
        // VARIABLE DEFINITION
        // ------------------------------------------------------------------------

        /**
         * Widget Reference
         *
         * @type {object}
         */
        const $this = $(this);

        /**
         * Default Options for Widget
         *
         * @type {object}
         */
        const defaults = {
            'from': 'GoogleOAuth',
            'error': '0'
        };

        /**
         * Final Widget Options
         *
         * @type {object}
         */
        const options = $.extend(true, {}, defaults, data);

        /**
         * Module Object
         *
         * @type {object}
         */
        const module = {};

        // ------------------------------------------------------------------------
        // CALLBACKS
        // ------------------------------------------------------------------------
        /**
         * Renders the connection modal.
         *
         * @param {object} response XmlHttpRequests response.
         * @private
         */
        const _renderModal = response => {
            $this.addClass('adwords-account modal fade').attr('tabindex', '-1').attr('role', 'dialog');

            const $modalDialog = $('<div/>', {
                'class': 'modal-dialog'
            }).appendTo($this);

            const $modalContent = $('<div/>', {
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
        const _renderModalHeader = response => {
            const $modalHeader = $('<div/>', {
                'class': 'modal-header'
            });

            const $modalHeaderCloseBtn = $('<button/>', {
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
        const _renderModalBody = response => {
            const $modalBody = $('<div/>', {
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
            jse.libs.xhr.get({url: './admin.php?do=GoogleOAuthAjax/connectionModal'})
                .done(response => {
                    if (!response.connected) {
                        _renderModal(response);
                    }
                })
                .fail(() => {
                    throw new Error('Failed to load modal data!');
                });

            done();
        };

        return module;
    });
