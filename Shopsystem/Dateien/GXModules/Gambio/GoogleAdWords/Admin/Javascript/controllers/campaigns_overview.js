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
    'campaigns_overview',

    [
        'modal'
    ],

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
         * Campaigns Overview
         *
         * @type {*|jQuery|HTMLElement}
         */
        const $campaignsOverview = $('.campaigns-overview');

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
        // EVENT HANDLERS
        // ------------------------------------------------------------------------

        /**
         * Handler for the account modal, that will be displayed if the user is not connected with Google AdWords
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _showAccountModal(event) {
            if (event !== undefined) {
                event.preventDefault();
            }

            $('.adwords-account.modal').modal('show');
        }

        // ------------------------------------------------------------------------
        // INITIALIZATION
        // ------------------------------------------------------------------------

        module.init = (done) => {
            if (options.showAccountForm) {
                _showAccountModal();
                $campaignsOverview.on('click', 'td', _showAccountModal);
            }

            done();
        };

        return module;
    });
