/* --------------------------------------------------------------
 connect_account.js 2017-12-15
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

(function () {
    const {iFrameResize, document} = window;
    const [iframe] = document.getElementsByTagName('iframe');
    const options = {heightCalculationMethod: 'max'};

    function onLoad() {
        iFrameResize(options, 'iframe');
    }

    if (iframe) {
        iframe.addEventListener('load', onLoad);
    }
})();