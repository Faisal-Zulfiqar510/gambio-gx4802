/* --------------------------------------------------------------
 scheme_general_configuration.js 2017-11-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module(
    'scheme_general_configuration',

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
        const defaults = {
            'exportTypeSelection': '#cronjob-hour-interval-selection',
            'hourSelection': '#cronjob-hour',
            'intervalSelection': '#cronjob-interval'
        };

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
        // HELPER FUNCTIONS
        // ------------------------------------------------------------------------

        function _enableIntervalSelection() {
            $(options.hourSelection).attr('disabled', 'disabled');
            $(options.intervalSelection).removeAttr('disabled');
        }

        function _enableHourSelection() {
            $(options.intervalSelection).attr('disabled', 'disabled');
            $(options.hourSelection).removeAttr('disabled');
        }

        function _checkExportTypeSelection() {
            const selectionValue = $(options.exportTypeSelection).val();

            if (selectionValue === 'hour') {
                _enableHourSelection();
            } else {
                _enableIntervalSelection();
            }
        }

        // ------------------------------------------------------------------------
        // INITIALIZATION
        // ------------------------------------------------------------------------

        module.init = function (done) {

            $(document).ready(function () {
                _checkExportTypeSelection();
            });

            $(options.exportTypeSelection).on('change', function () {
                _checkExportTypeSelection()
            });

            done();
        };

        return module;
    });