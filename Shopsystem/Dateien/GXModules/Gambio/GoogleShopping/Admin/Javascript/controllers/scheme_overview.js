/* --------------------------------------------------------------
 scheme_overview.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module(
    'scheme_overview',

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
         * Flag for cancelling export
         *
         * @type {object}
         */
        let cancelExport = false;

        /**
         * Modal objects
         *
         * @type {jQuery}
         */
        const $modals = {
            'delete': $('.delete-scheme.modal'),
            'export': $('.export-scheme.modal')
        };

        /**
         * Download button.
         *
         * @type {jQuery}
         */
        const $downloadButton = $('<a />', {
            class: 'download-export-button',
            html: $('<i/>', {class: 'fa fa-download'}),
            on: {
                click: event => _downloadExport(event)
            }
        });

        /**
         * Default Options
         *
         * @type {object}
         */
        const defaults = {
            'showAccountForm': true
        };

        /**
         * Final Options
         *
         * @type {object}
         */
        const options = $.extend(true, {}, defaults, data);

        /**
         * URLs for deleting different types of content
         *
         * @type {{deleteScheme: string, runExport: string}}
         */
        const urls = {
            'deleteScheme': 'admin.php?do=GoogleShoppingAjax/deleteScheme',
            'runExport': 'admin.php?do=GoogleShoppingAjax/runExport',
            'clearExport': 'admin.php?do=GoogleShoppingAjax/clearExport',
            'downloadExport': 'admin.php?do=GoogleShoppingAjax/downloadSchemeExport'
        };

        /**
         * Module Object
         *
         * @type {object}
         */
        const module = {};

        // ------------------------------------------------------------------------
        // HELPER FUNCTIONS
        // ------------------------------------------------------------------------

        /**
         * Updates the progress bar in the export modal
         *
         * @param {number} progress  Current progress in percent.
         * @param {boolean} canceled  True, if the export was canceled.
         */
        function _updateProgressBar(progress, canceled = false) {
            const $progressBar = $modals.export.find('.progress .progress-bar');

            if (canceled) {
                $progressBar.removeClass('active');
                $progressBar.addClass('progress-bar-danger');
                return;
            }

            if (!Number.isInteger(progress) || progress < 0) {
                progress = 0;
            } else if (progress > 100) {
                progress = 100;
            }

            $progressBar.removeClass('progress-bar-danger');
            $progressBar.addClass('active');
            if (progress === 100) {
                $progressBar.removeClass('active');
            }

            $progressBar.prop('aria-valuenow', progress);
            $progressBar.css('width', progress + '%');
            $progressBar.text(progress + '%');
        }


        /**
         * Returns the current time
         *
         * The time is needed for an update of the export scheme overview after an export.
         */
        function _getCurrentExportTime() {
            const date = new Date();
            const year = date.getFullYear();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let hour = date.getHours();
            let minutes = date.getMinutes();

            day = day < 10 ? '0' + day.toString() : day.toString();
            month = month < 10 ? '0' + month.toString() : month.toString();
            hour = hour < 10 ? '0' + hour.toString() : hour.toString();
            minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();

            return year.toString() + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':00';
        }


        /**
         * Run scheme export
         *
         * Runs the initial and all further post calls to the Google Shopping ajax controller to create the csv export.
         */
        function _runExport(schemeId, $schemeRow) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: urls.runExport,
                data: {schemeId},
                success: function (response) {
                    // Hide modal and show error modal if export was not successful
                    if (response['success'] === false) {
                        $modals.export.modal('hide');
                        jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), response['error']);
                        return;
                    }

                    // Cancel export if cancel button was clicked
                    if (cancelExport === true) {
                        // Update modal with informations about export canceled
                        $modals.export.find('.modal-text')
                            .text(jse.core.lang.translate('EXPORT_SCHEME_MODAL_CANCELED', 'google_shopping'));
                        $modals.export.find('button.cancel')
                            .text(jse.core.lang.translate('BUTTON_CLOSE', 'admin_buttons'))
                            .off('click')
                            .on('click', () => $modals.export.modal('hide'));
                        $modals.export.find('button.cancel')
                            .prop('disabled', false);

                        // Ajax call to clean up the export
                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: urls.clearExport,
                            data: {'schemeId': schemeId}
                        });

                        return;
                    }

                    // Update progress bar and make another ajax call if export is not completely done
                    if (response['repeat'] === true) {
                        _updateProgressBar(response['progress']);
                        _runExport(schemeId, $schemeRow);
                        return;
                    }

                    // Update progressbar to 100% and export modal
                    _updateProgressBar(100);
                    const $cancelButton = $modals.export.find('button.cancel');
                    $cancelButton
                        .text(jse.core.lang.translate('BUTTON_CLOSE', 'admin_buttons'))
                        .off('click')
                        .on('click', () => $modals.export.modal('hide'));

                    // Update export date for this scheme in the overview
                    $schemeRow.find('.last-export').html(
                        '<a class="download-export" href="#" data-scheme-id="' + schemeId + '">'
                        + _getCurrentExportTime() + '</a>'
                    );

                    $schemeRow.find('.last-export').find('.download-export').on('click', _downloadExport);

                    // Add download button to the row, if none exist yet.
                    if (!$schemeRow.find('.download-export-button').length) {
                        $downloadButton.attr('data-scheme-id', schemeId);
                        $schemeRow.find('.actions-container').prepend($downloadButton);
                    }
                },
                error: function () {
                    $modals.export.modal('hide');
                    jse.libs.modal.showMessage(
                        jse.core.lang.translate('ERROR_TITLE', 'google_shopping'),
                        jse.core.lang.translate('ERROR_EXPORT_AJAX_FAILED', 'google_shopping')
                    );
                }
            });
        }

        /**
         * Delete scheme
         *
         * Runs the post call to the Google Shopping ajax handler to delete the given scheme
         */
        function _deleteScheme(schemeId, $schemeRow) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: urls.deleteScheme,
                data: {schemeId},
                success: function (response) {
                    if (response['success'] === true) {
                        $modals.delete.modal('hide');
                        $schemeRow.remove();

                        const $tableBody = $('.schemes-overview table tbody');
                        const $tableRows = $tableBody.children();
                        const $emptyTableTemplate = $('#empty-table');

                        if ($tableRows.length < 1) {
                            $tableBody.append($emptyTableTemplate.clone().html());
                        }
                    } else {
                        $modals.delete.modal('hide');
                        jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), response['error']);
                    }

                    return response['success'];
                },
                error: function () {
                    return false;
                }
            });
        }


        // ------------------------------------------------------------------------
        // EVENT HANDLERS
        // ------------------------------------------------------------------------

        /**
         * Handler for the the click event of the cancel button in the export modal
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _cancelExport(event) {
            cancelExport = true;
            _updateProgressBar(0, true);
            $modals.export.find('.modal-text')
                .text(jse.core.lang.translate('EXPORT_SCHEME_MODAL_WILL_BE_CANCELED', 'google_shopping'));
            $modals.export.find('button.cancel')
                .prop('disabled', true);
        }

        /**
         * Click handler for the start export icons
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _onExportStart(event) {
            // Prevent default action.
            event.preventDefault();

            // Reset flag for export canceled
            cancelExport = false;

            // Collect the scheme id and the associated table row
            const schemeId = $(this).data('scheme-id');
            const $schemeRow = $(this).closest('tr');

            // Show export modal
            _updateProgressBar(0);
            $modals.export.find('button.cancel')
                .text(jse.core.lang.translate('BUTTON_CANCEL', 'admin_buttons'))
                .off('click')
                .on('click', (event) => _cancelExport(event));

            $modals.export.find('.modal-text')
                .text(jse.core.lang.translate('EXPORT_SCHEME_MODAL_MESSAGE', 'google_shopping'));

            $modals.export.modal({
                show: true,
                backdrop: "static",
                keyboard: false
            });

            // Start export
            _runExport(schemeId, $schemeRow);
        }

        /**
         * Click handler for the delete scheme icons
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _showDeleteModal(event) {
            // Prevent default action.
            event.preventDefault();

            // Collect the scheme id and the associated table row
            const schemeId = $(this).data('scheme-id');
            const $schemeRow = $(this).closest('tr');

            // Show modal
            $modals.delete.find('fieldset.scheme-data div.scheme-name').text($schemeRow.find('.scheme-name').text());
            $modals.delete.modal('show');

            // Handle delete confirmation modal button click event
            const $confirmButton = $modals.delete.find('button.confirm');
            $confirmButton
                .off('click')
                .on('click', () => _deleteScheme(schemeId, $schemeRow));
        }

        /**
         * Handler for the account modal, that will be displayed if the user is not connected with Google AdWords
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _showAccountModal(event) {
            // Prevent default action.
            if (event !== undefined) {
                event.preventDefault();
            }

            // Show modal
            $('.adwords-account.modal').modal('show');
        }

        /**
         * Click handler for the download export link
         *
         * @param {object} event jQuery event object contains information of the event.
         */
        function _downloadExport(event) {
            event.preventDefault();

            // Collect the scheme id and the associated table row
            const schemeId = $(this).data('scheme-id')
                ? $(this).data('scheme-id')
                : $(event.target).parent('a').data('scheme-id');

            // Open export for download
            window.open(urls.downloadExport + "&schemeId=" + schemeId, '_blank');
        }

        // ------------------------------------------------------------------------
        // INITIALIZATION
        // ------------------------------------------------------------------------

        module.init = function (done) {
            $('a.delete-scheme').on('click', _showDeleteModal);

            if (options.showAccountForm) {
                _showAccountModal();
                $('a.start-export').on('click', _showAccountModal);
                $('a.download-export').on('click', _showAccountModal);
                $('a.download-export-button').on('click', _showAccountModal);
            } else {
                $('a.start-export').on('click', _onExportStart);
                $('a.download-export').on('click', _downloadExport);
                $('a.download-export-button').on('click', _downloadExport);
            }

            done();
        };

        return module;
    });