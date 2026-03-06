/* --------------------------------------------------------------
 google_connection_modal.js 2018-05-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx_google_analytics.widgets.module(
    'charts_iframe',

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
        const defaults = {};

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

        /**
         * CSS styles for manually rendered iframe.
         * @type {{width: string, border: string}}
         */
        const iFrameStyles = {
            width: '100%',
            border: 'none',
            minHeight: '1000px',
            height: '100%'
        };


        let $iframe;

        // ------------------------------------------------------------------------
        // CALLBACKS
        // ------------------------------------------------------------------------
        const _renderIFrame = response => {
            $iframe = $('<iframe/>')
                .on('load', () => _loaded(response.accessToken))
                .css(iFrameStyles)
                .attr('src', response.appUrl + '#analytics/charts?lang=' + response.lang);

            $this.parent().empty().append($iframe);

            // window.addEventListener('message', function(e) {
            // 	if (e.data.type === 'send_iframe_height') {
            // 		$iframe.css({
            // 			height: (Math.ceil(Number(e.data.height)) + 5) + '.px'
            // 		});
            // 	}
            // });
        };

        const _loaded = accessToken => {
            $iframe[0].contentWindow.postMessage({
                type: 'send_access_token',
                accessToken
            }, '*');
            $iframe[0].contentWindow.postMessage({
                type: 'request_iframe_height'
            }, '*');
        };

        // ------------------------------------------------------------------------
        // INITIALIZATION
        // ------------------------------------------------------------------------

        /**
         * Initialize method of the widget, called by the engine.
         */
        module.init = function (done) {
            jse.libs.xhr.get({
                url: './admin.php?do=GoogleOAuthAjax/getAccessToken'
            }).done(_renderIFrame);

            done();
        };

        return module;
    }
);
