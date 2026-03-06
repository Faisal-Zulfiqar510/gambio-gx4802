/* --------------------------------------------------------------
 footer_google_adwords_state.js 2018-04-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Footer Google Adwords State Extender
 *
 * This module creates a Google Adwords state badge in the admin footer in order to display the connection state of
 * Hub.
 *
 * Add a "data-connected" attribute on the <script/> tag if there's an active connection with Google Adwords.
 *
 * Add a "data-lecacy-mode" attribute on the <script/> tag to enable compatibility with older shop pages.
 *
 * Add a "data-text" attribute on the <script/> tag to change the displayed text.
 */
(function () {

    'use strict';

    /**
     * Parse options from script's data attributes.
     *
     * @param {HTMLElement} script Element that loaded current script.
     *
     * @return {{isLegacy: boolean, isConnected: boolean, text: (string|*)}}
     */
    function parseDataOptions(script) {
        return {
            isLegacy: script.getAttribute('data-legacy-mode') !== null,
            isConnected: script.getAttribute('data-connected') !== null,
            text: script.getAttribute('data-text')
        }
    }

    /**
     * Creates Google Adwords footer badge for legacy pages.
     *
     * @param {Object} options Contains the extender options.
     *
     * @return {HTMLElement} Returns the badge element.
     */
    function createLegacyBadge(options) {
        const style = [
            'padding: 6px',
            'margin-top: -4px',
            'margin-left: 42px',
            'font-size: 11px',
            'color: #fff',
            'text-decoration: none'
        ];

        const badge = document.createElement('a');
        badge.setAttribute('href', 'admin.php?do=GoogleOAuth');
        badge.setAttribute('style', style.join('; '));
        badge.className = 'badge ' + (options.isConnected ? 'connected badge-success' : 'disconnected badge-danger');

        const icon = document.createElement('i');
        icon.className = 'fa fa-google';
        badge.appendChild(icon);

        const text = document.createTextNode(' ' + options.text);
        badge.appendChild(text);

        const targetContainer = document.querySelector('.main-bottom-footer .version-info').parentNode;
        targetContainer.style.marginRight = '10px';

        targetContainer.appendChild(badge);

        return badge;
    }

    /**
     * Creates Google Adwords footer badge for modern pages.
     *
     * @param {Object} options Contains the extender options.
     *
     * @return {HTMLElement} Returns the badge element.
     */
    function createModernBadge(options) {
        const style = [
            'padding: 6px',
            'margin-top: -4px',
            'font-size: 11px',
        ];

        const badgeContainer = document.createElement('div');
        badgeContainer.setAttribute('style', 'min-width: 150px; display: inline-block;');
        badgeContainer.className = 'google-connection-state';

        const badge = document.createElement('a');
        badge.setAttribute('href', 'admin.php?do=GoogleOAuth');
        badge.setAttribute('style', style.join('; '));
        badge.className = 'label ' + (options.isConnected ? 'connected label-success' : 'disconnected label-danger');

        const icon = document.createElement('i');
        icon.className = 'fa fa-google';
        icon.style.marginLeft = '0';
        badge.appendChild(icon);

        const text = document.createTextNode(' ' + options.text);
        badge.appendChild(text);

        badgeContainer.appendChild(badge);

        let targetContainer = document.querySelector('#main-footer .info .version');

        targetContainer.appendChild(badgeContainer);

        const languageSelection = document.querySelector('#main-footer .info .language-selection');
        languageSelection.style.marginLeft = '30px';

        targetContainer.classList.remove('col-xs-1');
        targetContainer.classList.add('col-xs-4');

        return badgeContainer;
    }

    /**
     * Creates Google Adwords Badge
     *
     * @param {Object} options Contains the extender options.
     *
     * @return {HTMLElement} Returns the badge element.
     */
    function createBadge(options) {
        return options.isLegacy ? createLegacyBadge(options) : createModernBadge(options);
    }


    /**
     * Initializes Google Adwords footer badge extender.
     *
     * This method will create a badge in the admin footer section which indicates the Google Adwords connection state
     * of the shop.
     */
    function initialize(script) {
        const options = parseDataOptions(script);

        setTimeout(function () {
            createBadge(options);
        }, 100);
    }

    const script = document.currentScript;

    if (document.readyState != 'loading') {
        initialize(script);
    } else {
        document.addEventListener('DOMContentLoaded', () => initialize(script));
    }

})();
