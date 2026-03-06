/* --------------------------------------------------------------
 campaigns_overview.js 2017-12-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module(
    'conversion_tracking_config',

    [],

    function (data) {
        'use strict';

        // ------------------------------------------------------------------------
        // VARIABLES DEFINITION
        // ------------------------------------------------------------------------

        /**
         * Module Selector
         *
         * @type {jQuery}
         */
        const $this = $(this);

        /**
         * Default Options
         *
         * @type {object}
         */
        const defaults = {};

        /**
         * Final Options
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
        // FUNCTIONS
        // ------------------------------------------------------------------------
        const _selectReadOnlyFields = option => {
            const conversionIdInput = document.getElementById('conversion-id');
            const conversionActionIdInput = document.getElementById('conversion-action-id');

            conversionIdInput.value = option.getAttribute('data-conversion-id');
            conversionActionIdInput.value = option.getAttribute('data-conversion-action-id');
        };

        // ------------------------------------------------------------------------
        // EVENT HANDLERS
        // ------------------------------------------------------------------------


        // ------------------------------------------------------------------------
        // INITIALIZATION
        // ------------------------------------------------------------------------

        module.init = (done) => {
            const conversionNameSelect = document.getElementById('conversion-name');

            if (conversionNameSelect) {
                conversionNameSelect.addEventListener('change', function (event) {
                    const option = event.target.selectedOptions[0];

                    _selectReadOnlyFields(option);
                })
            }

            done();
        };

        return module;
    });
