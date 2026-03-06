'use strict';

/* --------------------------------------------------------------
 scheme_overview.js 2019-07-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module('scheme_overview', ['modal'], function (data) {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Flag for cancelling export
     *
     * @type {object}
     */
    var cancelExport = false;

    /**
     * Modal objects
     *
     * @type {jQuery}
     */
    var $modals = {
        'delete': $('.delete-scheme.modal'),
        'export': $('.export-scheme.modal')
    };

    /**
     * Download button.
     *
     * @type {jQuery}
     */
    var $downloadButton = $('<a />', {
        class: 'download-export-button',
        html: $('<i/>', { class: 'fa fa-download' }),
        on: {
            click: function click(event) {
                return _downloadExport(event);
            }
        }
    });

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {
        'showAccountForm': true
    };

    /**
     * Final Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * URLs for deleting different types of content
     *
     * @type {{deleteScheme: string, runExport: string}}
     */
    var urls = {
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
    var module = {};

    // ------------------------------------------------------------------------
    // HELPER FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Updates the progress bar in the export modal
     *
     * @param {number} progress  Current progress in percent.
     * @param {boolean} canceled  True, if the export was canceled.
     */
    function _updateProgressBar(progress) {
        var canceled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var $progressBar = $modals.export.find('.progress .progress-bar');

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
        var date = new Date();
        var year = date.getFullYear();

        var day = date.getDate();
        var month = date.getMonth() + 1;
        var hour = date.getHours();
        var minutes = date.getMinutes();

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
            data: { schemeId: schemeId },
            success: function success(response) {
                // Hide modal and show error modal if export was not successful
                if (response['success'] === false) {
                    $modals.export.modal('hide');
                    jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), response['error']);
                    return;
                }

                // Cancel export if cancel button was clicked
                if (cancelExport === true) {
                    // Update modal with informations about export canceled
                    $modals.export.find('.modal-text').text(jse.core.lang.translate('EXPORT_SCHEME_MODAL_CANCELED', 'google_shopping'));
                    $modals.export.find('button.cancel').text(jse.core.lang.translate('BUTTON_CLOSE', 'admin_buttons')).off('click').on('click', function () {
                        return $modals.export.modal('hide');
                    });
                    $modals.export.find('button.cancel').prop('disabled', false);

                    // Ajax call to clean up the export
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: urls.clearExport,
                        data: { 'schemeId': schemeId }
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
                var $cancelButton = $modals.export.find('button.cancel');
                $cancelButton.text(jse.core.lang.translate('BUTTON_CLOSE', 'admin_buttons')).off('click').on('click', function () {
                    return $modals.export.modal('hide');
                });

                // Update export date for this scheme in the overview
                $schemeRow.find('.last-export').html('<a class="download-export" href="#" data-scheme-id="' + schemeId + '">' + _getCurrentExportTime() + '</a>');

                $schemeRow.find('.last-export').find('.download-export').on('click', _downloadExport);

                // Add download button to the row, if none exist yet.
                if (!$schemeRow.find('.download-export-button').length) {
                    $downloadButton.attr('data-scheme-id', schemeId);
                    $schemeRow.find('.actions-container').prepend($downloadButton);
                }
            },
            error: function error() {
                $modals.export.modal('hide');
                jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), jse.core.lang.translate('ERROR_EXPORT_AJAX_FAILED', 'google_shopping'));
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
            data: { schemeId: schemeId },
            success: function success(response) {
                if (response['success'] === true) {
                    $modals.delete.modal('hide');
                    $schemeRow.remove();

                    var $tableBody = $('.schemes-overview table tbody');
                    var $tableRows = $tableBody.children();
                    var $emptyTableTemplate = $('#empty-table');

                    if ($tableRows.length < 1) {
                        $tableBody.append($emptyTableTemplate.clone().html());
                    }
                } else {
                    $modals.delete.modal('hide');
                    jse.libs.modal.showMessage(jse.core.lang.translate('ERROR_TITLE', 'google_shopping'), response['error']);
                }

                return response['success'];
            },
            error: function error() {
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
        $modals.export.find('.modal-text').text(jse.core.lang.translate('EXPORT_SCHEME_MODAL_WILL_BE_CANCELED', 'google_shopping'));
        $modals.export.find('button.cancel').prop('disabled', true);
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
        var schemeId = $(this).data('scheme-id');
        var $schemeRow = $(this).closest('tr');

        // Show export modal
        _updateProgressBar(0);
        $modals.export.find('button.cancel').text(jse.core.lang.translate('BUTTON_CANCEL', 'admin_buttons')).off('click').on('click', function (event) {
            return _cancelExport(event);
        });

        $modals.export.find('.modal-text').text(jse.core.lang.translate('EXPORT_SCHEME_MODAL_MESSAGE', 'google_shopping'));

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
        var schemeId = $(this).data('scheme-id');
        var $schemeRow = $(this).closest('tr');

        // Show modal
        $modals.delete.find('fieldset.scheme-data div.scheme-name').text($schemeRow.find('.scheme-name').text());
        $modals.delete.modal('show');

        // Handle delete confirmation modal button click event
        var $confirmButton = $modals.delete.find('button.confirm');
        $confirmButton.off('click').on('click', function () {
            return _deleteScheme(schemeId, $schemeRow);
        });
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
        var schemeId = $(this).data('scheme-id') ? $(this).data('scheme-id') : $(event.target).parent('a').data('scheme-id');

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvc2NoZW1lX292ZXJ2aWV3LmpzIl0sIm5hbWVzIjpbImd4bW9kdWxlcyIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImNhbmNlbEV4cG9ydCIsIiRtb2RhbHMiLCIkZG93bmxvYWRCdXR0b24iLCJjbGFzcyIsImh0bWwiLCJvbiIsImNsaWNrIiwiX2Rvd25sb2FkRXhwb3J0IiwiZXZlbnQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJ1cmxzIiwiX3VwZGF0ZVByb2dyZXNzQmFyIiwicHJvZ3Jlc3MiLCJjYW5jZWxlZCIsIiRwcm9ncmVzc0JhciIsImV4cG9ydCIsImZpbmQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwicHJvcCIsImNzcyIsInRleHQiLCJfZ2V0Q3VycmVudEV4cG9ydFRpbWUiLCJkYXRlIiwiRGF0ZSIsInllYXIiLCJnZXRGdWxsWWVhciIsImRheSIsImdldERhdGUiLCJtb250aCIsImdldE1vbnRoIiwiaG91ciIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJ0b1N0cmluZyIsIl9ydW5FeHBvcnQiLCJzY2hlbWVJZCIsIiRzY2hlbWVSb3ciLCJhamF4IiwidHlwZSIsImRhdGFUeXBlIiwidXJsIiwicnVuRXhwb3J0Iiwic3VjY2VzcyIsInJlc3BvbnNlIiwibW9kYWwiLCJqc2UiLCJsaWJzIiwic2hvd01lc3NhZ2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIm9mZiIsImNsZWFyRXhwb3J0IiwiJGNhbmNlbEJ1dHRvbiIsImxlbmd0aCIsImF0dHIiLCJwcmVwZW5kIiwiZXJyb3IiLCJfZGVsZXRlU2NoZW1lIiwiZGVsZXRlU2NoZW1lIiwiZGVsZXRlIiwicmVtb3ZlIiwiJHRhYmxlQm9keSIsIiR0YWJsZVJvd3MiLCJjaGlsZHJlbiIsIiRlbXB0eVRhYmxlVGVtcGxhdGUiLCJhcHBlbmQiLCJjbG9uZSIsIl9jYW5jZWxFeHBvcnQiLCJfb25FeHBvcnRTdGFydCIsInByZXZlbnREZWZhdWx0IiwiY2xvc2VzdCIsInNob3ciLCJiYWNrZHJvcCIsImtleWJvYXJkIiwiX3Nob3dEZWxldGVNb2RhbCIsIiRjb25maXJtQnV0dG9uIiwiX3Nob3dBY2NvdW50TW9kYWwiLCJ1bmRlZmluZWQiLCJ0YXJnZXQiLCJwYXJlbnQiLCJ3aW5kb3ciLCJvcGVuIiwiZG93bmxvYWRFeHBvcnQiLCJpbml0IiwiZG9uZSIsInNob3dBY2NvdW50Rm9ybSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxVQUFVQyxXQUFWLENBQXNCQyxNQUF0QixDQUNJLGlCQURKLEVBR0ksQ0FDSSxPQURKLENBSEosRUFPSSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFJQyxlQUFlLEtBQW5COztBQUVBOzs7OztBQUtBLFFBQU1DLFVBQVU7QUFDWixrQkFBVUYsRUFBRSxzQkFBRixDQURFO0FBRVosa0JBQVVBLEVBQUUsc0JBQUY7QUFGRSxLQUFoQjs7QUFLQTs7Ozs7QUFLQSxRQUFNRyxrQkFBa0JILEVBQUUsT0FBRixFQUFXO0FBQy9CSSxlQUFPLHdCQUR3QjtBQUUvQkMsY0FBTUwsRUFBRSxNQUFGLEVBQVUsRUFBQ0ksT0FBTyxnQkFBUixFQUFWLENBRnlCO0FBRy9CRSxZQUFJO0FBQ0FDLG1CQUFPO0FBQUEsdUJBQVNDLGdCQUFnQkMsS0FBaEIsQ0FBVDtBQUFBO0FBRFA7QUFIMkIsS0FBWCxDQUF4Qjs7QUFRQTs7Ozs7QUFLQSxRQUFNQyxXQUFXO0FBQ2IsMkJBQW1CO0FBRE4sS0FBakI7O0FBSUE7Ozs7O0FBS0EsUUFBTUMsVUFBVVgsRUFBRVksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QlosSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7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QUFGLEVBQVFGLElBQVIsQ0FBYSxXQUFiLENBRFcsR0FFWEUsRUFBRVMsTUFBTTZFLE1BQVIsRUFBZ0JDLE1BQWhCLENBQXVCLEdBQXZCLEVBQTRCekYsSUFBNUIsQ0FBaUMsV0FBakMsQ0FGTjs7QUFJQTtBQUNBMEYsZUFBT0MsSUFBUCxDQUFZNUUsS0FBSzZFLGNBQUwsR0FBc0IsWUFBdEIsR0FBcUNoRCxRQUFqRCxFQUEyRCxRQUEzRDtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTdDLFdBQU84RixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjVGLFVBQUUsaUJBQUYsRUFBcUJNLEVBQXJCLENBQXdCLE9BQXhCLEVBQWlDNEUsZ0JBQWpDOztBQUVBLFlBQUl2RSxRQUFRa0YsZUFBWixFQUE2QjtBQUN6QlQ7QUFDQXBGLGNBQUUsZ0JBQUYsRUFBb0JNLEVBQXBCLENBQXVCLE9BQXZCLEVBQWdDOEUsaUJBQWhDO0FBQ0FwRixjQUFFLG1CQUFGLEVBQXVCTSxFQUF2QixDQUEwQixPQUExQixFQUFtQzhFLGlCQUFuQztBQUNBcEYsY0FBRSwwQkFBRixFQUE4Qk0sRUFBOUIsQ0FBaUMsT0FBakMsRUFBMEM4RSxpQkFBMUM7QUFDSCxTQUxELE1BS087QUFDSHBGLGNBQUUsZ0JBQUYsRUFBb0JNLEVBQXBCLENBQXVCLE9BQXZCLEVBQWdDc0UsY0FBaEM7QUFDQTVFLGNBQUUsbUJBQUYsRUFBdUJNLEVBQXZCLENBQTBCLE9BQTFCLEVBQW1DRSxlQUFuQztBQUNBUixjQUFFLDBCQUFGLEVBQThCTSxFQUE5QixDQUFpQyxPQUFqQyxFQUEwQ0UsZUFBMUM7QUFDSDs7QUFFRG9GO0FBQ0gsS0FmRDs7QUFpQkEsV0FBTy9GLE1BQVA7QUFDSCxDQTVZTCIsImZpbGUiOiJBZG1pbi9KYXZhc2NyaXB0L2NvbnRyb2xsZXJzL3NjaGVtZV9vdmVydmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2NoZW1lX292ZXJ2aWV3LmpzIDIwMTktMDctMTJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE5IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neG1vZHVsZXMuY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzY2hlbWVfb3ZlcnZpZXcnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGbGFnIGZvciBjYW5jZWxsaW5nIGV4cG9ydFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgbGV0IGNhbmNlbEV4cG9ydCA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2RhbCBvYmplY3RzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkbW9kYWxzID0ge1xuICAgICAgICAgICAgJ2RlbGV0ZSc6ICQoJy5kZWxldGUtc2NoZW1lLm1vZGFsJyksXG4gICAgICAgICAgICAnZXhwb3J0JzogJCgnLmV4cG9ydC1zY2hlbWUubW9kYWwnKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEb3dubG9hZCBidXR0b24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkZG93bmxvYWRCdXR0b24gPSAkKCc8YSAvPicsIHtcbiAgICAgICAgICAgIGNsYXNzOiAnZG93bmxvYWQtZXhwb3J0LWJ1dHRvbicsXG4gICAgICAgICAgICBodG1sOiAkKCc8aS8+Jywge2NsYXNzOiAnZmEgZmEtZG93bmxvYWQnfSksXG4gICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgIGNsaWNrOiBldmVudCA9PiBfZG93bmxvYWRFeHBvcnQoZXZlbnQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgJ3Nob3dBY2NvdW50Rm9ybSc6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVSTHMgZm9yIGRlbGV0aW5nIGRpZmZlcmVudCB0eXBlcyBvZiBjb250ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7ZGVsZXRlU2NoZW1lOiBzdHJpbmcsIHJ1bkV4cG9ydDogc3RyaW5nfX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IHVybHMgPSB7XG4gICAgICAgICAgICAnZGVsZXRlU2NoZW1lJzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvZGVsZXRlU2NoZW1lJyxcbiAgICAgICAgICAgICdydW5FeHBvcnQnOiAnYWRtaW4ucGhwP2RvPUdvb2dsZVNob3BwaW5nQWpheC9ydW5FeHBvcnQnLFxuICAgICAgICAgICAgJ2NsZWFyRXhwb3J0JzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvY2xlYXJFeHBvcnQnLFxuICAgICAgICAgICAgJ2Rvd25sb2FkRXhwb3J0JzogJ2FkbWluLnBocD9kbz1Hb29nbGVTaG9wcGluZ0FqYXgvZG93bmxvYWRTY2hlbWVFeHBvcnQnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBIRUxQRVIgRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIHRoZSBwcm9ncmVzcyBiYXIgaW4gdGhlIGV4cG9ydCBtb2RhbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJvZ3Jlc3MgIEN1cnJlbnQgcHJvZ3Jlc3MgaW4gcGVyY2VudC5cbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBjYW5jZWxlZCAgVHJ1ZSwgaWYgdGhlIGV4cG9ydCB3YXMgY2FuY2VsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdXBkYXRlUHJvZ3Jlc3NCYXIocHJvZ3Jlc3MsIGNhbmNlbGVkID0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNvbnN0ICRwcm9ncmVzc0JhciA9ICRtb2RhbHMuZXhwb3J0LmZpbmQoJy5wcm9ncmVzcyAucHJvZ3Jlc3MtYmFyJyk7XG5cbiAgICAgICAgICAgIGlmIChjYW5jZWxlZCkge1xuICAgICAgICAgICAgICAgICRwcm9ncmVzc0Jhci5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJHByb2dyZXNzQmFyLmFkZENsYXNzKCdwcm9ncmVzcy1iYXItZGFuZ2VyJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIocHJvZ3Jlc3MpIHx8IHByb2dyZXNzIDwgMCkge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvZ3Jlc3MgPiAxMDApIHtcbiAgICAgICAgICAgICAgICBwcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHByb2dyZXNzQmFyLnJlbW92ZUNsYXNzKCdwcm9ncmVzcy1iYXItZGFuZ2VyJyk7XG4gICAgICAgICAgICAkcHJvZ3Jlc3NCYXIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzID09PSAxMDApIHtcbiAgICAgICAgICAgICAgICAkcHJvZ3Jlc3NCYXIucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkcHJvZ3Jlc3NCYXIucHJvcCgnYXJpYS12YWx1ZW5vdycsIHByb2dyZXNzKTtcbiAgICAgICAgICAgICRwcm9ncmVzc0Jhci5jc3MoJ3dpZHRoJywgcHJvZ3Jlc3MgKyAnJScpO1xuICAgICAgICAgICAgJHByb2dyZXNzQmFyLnRleHQocHJvZ3Jlc3MgKyAnJScpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSB0aW1lIGlzIG5lZWRlZCBmb3IgYW4gdXBkYXRlIG9mIHRoZSBleHBvcnQgc2NoZW1lIG92ZXJ2aWV3IGFmdGVyIGFuIGV4cG9ydC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRDdXJyZW50RXhwb3J0VGltZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICAgICAgICAgbGV0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgbGV0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICAgIGxldCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xuICAgICAgICAgICAgbGV0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcblxuICAgICAgICAgICAgZGF5ID0gZGF5IDwgMTAgPyAnMCcgKyBkYXkudG9TdHJpbmcoKSA6IGRheS50b1N0cmluZygpO1xuICAgICAgICAgICAgbW9udGggPSBtb250aCA8IDEwID8gJzAnICsgbW9udGgudG9TdHJpbmcoKSA6IG1vbnRoLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBob3VyID0gaG91ciA8IDEwID8gJzAnICsgaG91ci50b1N0cmluZygpIDogaG91ci50b1N0cmluZygpO1xuICAgICAgICAgICAgbWludXRlcyA9IG1pbnV0ZXMgPCAxMCA/ICcwJyArIG1pbnV0ZXMudG9TdHJpbmcoKSA6IG1pbnV0ZXMudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHllYXIudG9TdHJpbmcoKSArICctJyArIG1vbnRoICsgJy0nICsgZGF5ICsgJyAnICsgaG91ciArICc6JyArIG1pbnV0ZXMgKyAnOjAwJztcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJ1biBzY2hlbWUgZXhwb3J0XG4gICAgICAgICAqXG4gICAgICAgICAqIFJ1bnMgdGhlIGluaXRpYWwgYW5kIGFsbCBmdXJ0aGVyIHBvc3QgY2FsbHMgdG8gdGhlIEdvb2dsZSBTaG9wcGluZyBhamF4IGNvbnRyb2xsZXIgdG8gY3JlYXRlIHRoZSBjc3YgZXhwb3J0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3J1bkV4cG9ydChzY2hlbWVJZCwgJHNjaGVtZVJvdykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLnJ1bkV4cG9ydCxcbiAgICAgICAgICAgICAgICBkYXRhOiB7c2NoZW1lSWR9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBIaWRlIG1vZGFsIGFuZCBzaG93IGVycm9yIG1vZGFsIGlmIGV4cG9ydCB3YXMgbm90IHN1Y2Nlc3NmdWxcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlWydzdWNjZXNzJ10gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0VSUk9SX1RJVExFJywgJ2dvb2dsZV9zaG9wcGluZycpLCByZXNwb25zZVsnZXJyb3InXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBDYW5jZWwgZXhwb3J0IGlmIGNhbmNlbCBidXR0b24gd2FzIGNsaWNrZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhbmNlbEV4cG9ydCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIG1vZGFsIHdpdGggaW5mb3JtYXRpb25zIGFib3V0IGV4cG9ydCBjYW5jZWxlZFxuICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFscy5leHBvcnQuZmluZCgnLm1vZGFsLXRleHQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFWFBPUlRfU0NIRU1FX01PREFMX0NBTkNFTEVEJywgJ2dvb2dsZV9zaG9wcGluZycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRtb2RhbHMuZXhwb3J0LmZpbmQoJ2J1dHRvbi5jYW5jZWwnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fQ0xPU0UnLCAnYWRtaW5fYnV0dG9ucycpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgKCkgPT4gJG1vZGFscy5leHBvcnQubW9kYWwoJ2hpZGUnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5maW5kKCdidXR0b24uY2FuY2VsJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFqYXggY2FsbCB0byBjbGVhbiB1cCB0aGUgZXhwb3J0XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybHMuY2xlYXJFeHBvcnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogeydzY2hlbWVJZCc6IHNjaGVtZUlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBwcm9ncmVzcyBiYXIgYW5kIG1ha2UgYW5vdGhlciBhamF4IGNhbGwgaWYgZXhwb3J0IGlzIG5vdCBjb21wbGV0ZWx5IGRvbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlWydyZXBlYXQnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3VwZGF0ZVByb2dyZXNzQmFyKHJlc3BvbnNlWydwcm9ncmVzcyddKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9ydW5FeHBvcnQoc2NoZW1lSWQsICRzY2hlbWVSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHByb2dyZXNzYmFyIHRvIDEwMCUgYW5kIGV4cG9ydCBtb2RhbFxuICAgICAgICAgICAgICAgICAgICBfdXBkYXRlUHJvZ3Jlc3NCYXIoMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNhbmNlbEJ1dHRvbiA9ICRtb2RhbHMuZXhwb3J0LmZpbmQoJ2J1dHRvbi5jYW5jZWwnKTtcbiAgICAgICAgICAgICAgICAgICAgJGNhbmNlbEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DTE9TRScsICdhZG1pbl9idXR0b25zJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAub2ZmKCdjbGljaycpXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgKCkgPT4gJG1vZGFscy5leHBvcnQubW9kYWwoJ2hpZGUnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIGV4cG9ydCBkYXRlIGZvciB0aGlzIHNjaGVtZSBpbiB0aGUgb3ZlcnZpZXdcbiAgICAgICAgICAgICAgICAgICAgJHNjaGVtZVJvdy5maW5kKCcubGFzdC1leHBvcnQnKS5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGNsYXNzPVwiZG93bmxvYWQtZXhwb3J0XCIgaHJlZj1cIiNcIiBkYXRhLXNjaGVtZS1pZD1cIicgKyBzY2hlbWVJZCArICdcIj4nXG4gICAgICAgICAgICAgICAgICAgICAgICArIF9nZXRDdXJyZW50RXhwb3J0VGltZSgpICsgJzwvYT4nXG4gICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNjaGVtZVJvdy5maW5kKCcubGFzdC1leHBvcnQnKS5maW5kKCcuZG93bmxvYWQtZXhwb3J0Jykub24oJ2NsaWNrJywgX2Rvd25sb2FkRXhwb3J0KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZG93bmxvYWQgYnV0dG9uIHRvIHRoZSByb3csIGlmIG5vbmUgZXhpc3QgeWV0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoISRzY2hlbWVSb3cuZmluZCgnLmRvd25sb2FkLWV4cG9ydC1idXR0b24nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb3dubG9hZEJ1dHRvbi5hdHRyKCdkYXRhLXNjaGVtZS1pZCcsIHNjaGVtZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY2hlbWVSb3cuZmluZCgnLmFjdGlvbnMtY29udGFpbmVyJykucHJlcGVuZCgkZG93bmxvYWRCdXR0b24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFUlJPUl9USVRMRScsICdnb29nbGVfc2hvcHBpbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFUlJPUl9FWFBPUlRfQUpBWF9GQUlMRUQnLCAnZ29vZ2xlX3Nob3BwaW5nJylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWxldGUgc2NoZW1lXG4gICAgICAgICAqXG4gICAgICAgICAqIFJ1bnMgdGhlIHBvc3QgY2FsbCB0byB0aGUgR29vZ2xlIFNob3BwaW5nIGFqYXggaGFuZGxlciB0byBkZWxldGUgdGhlIGdpdmVuIHNjaGVtZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2RlbGV0ZVNjaGVtZShzY2hlbWVJZCwgJHNjaGVtZVJvdykge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgdXJsOiB1cmxzLmRlbGV0ZVNjaGVtZSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7c2NoZW1lSWR9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VbJ3N1Y2Nlc3MnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFscy5kZWxldGUubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY2hlbWVSb3cucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICR0YWJsZUJvZHkgPSAkKCcuc2NoZW1lcy1vdmVydmlldyB0YWJsZSB0Ym9keScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJHRhYmxlUm93cyA9ICR0YWJsZUJvZHkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRlbXB0eVRhYmxlVGVtcGxhdGUgPSAkKCcjZW1wdHktdGFibGUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCR0YWJsZVJvd3MubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0YWJsZUJvZHkuYXBwZW5kKCRlbXB0eVRhYmxlVGVtcGxhdGUuY2xvbmUoKS5odG1sKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgJG1vZGFscy5kZWxldGUubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLm1vZGFsLnNob3dNZXNzYWdlKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFUlJPUl9USVRMRScsICdnb29nbGVfc2hvcHBpbmcnKSwgcmVzcG9uc2VbJ2Vycm9yJ10pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlWydzdWNjZXNzJ107XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIHRoZSBjbGljayBldmVudCBvZiB0aGUgY2FuY2VsIGJ1dHRvbiBpbiB0aGUgZXhwb3J0IG1vZGFsXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jYW5jZWxFeHBvcnQoZXZlbnQpIHtcbiAgICAgICAgICAgIGNhbmNlbEV4cG9ydCA9IHRydWU7XG4gICAgICAgICAgICBfdXBkYXRlUHJvZ3Jlc3NCYXIoMCwgdHJ1ZSk7XG4gICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5maW5kKCcubW9kYWwtdGV4dCcpXG4gICAgICAgICAgICAgICAgLnRleHQoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0VYUE9SVF9TQ0hFTUVfTU9EQUxfV0lMTF9CRV9DQU5DRUxFRCcsICdnb29nbGVfc2hvcHBpbmcnKSk7XG4gICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5maW5kKCdidXR0b24uY2FuY2VsJylcbiAgICAgICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgc3RhcnQgZXhwb3J0IGljb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vbkV4cG9ydFN0YXJ0KGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gUmVzZXQgZmxhZyBmb3IgZXhwb3J0IGNhbmNlbGVkXG4gICAgICAgICAgICBjYW5jZWxFeHBvcnQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gQ29sbGVjdCB0aGUgc2NoZW1lIGlkIGFuZCB0aGUgYXNzb2NpYXRlZCB0YWJsZSByb3dcbiAgICAgICAgICAgIGNvbnN0IHNjaGVtZUlkID0gJCh0aGlzKS5kYXRhKCdzY2hlbWUtaWQnKTtcbiAgICAgICAgICAgIGNvbnN0ICRzY2hlbWVSb3cgPSAkKHRoaXMpLmNsb3Nlc3QoJ3RyJyk7XG5cbiAgICAgICAgICAgIC8vIFNob3cgZXhwb3J0IG1vZGFsXG4gICAgICAgICAgICBfdXBkYXRlUHJvZ3Jlc3NCYXIoMCk7XG4gICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5maW5kKCdidXR0b24uY2FuY2VsJylcbiAgICAgICAgICAgICAgICAudGV4dChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnQlVUVE9OX0NBTkNFTCcsICdhZG1pbl9idXR0b25zJykpXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAoZXZlbnQpID0+IF9jYW5jZWxFeHBvcnQoZXZlbnQpKTtcblxuICAgICAgICAgICAgJG1vZGFscy5leHBvcnQuZmluZCgnLm1vZGFsLXRleHQnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdFWFBPUlRfU0NIRU1FX01PREFMX01FU1NBR0UnLCAnZ29vZ2xlX3Nob3BwaW5nJykpO1xuXG4gICAgICAgICAgICAkbW9kYWxzLmV4cG9ydC5tb2RhbCh7XG4gICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBiYWNrZHJvcDogXCJzdGF0aWNcIixcbiAgICAgICAgICAgICAgICBrZXlib2FyZDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBTdGFydCBleHBvcnRcbiAgICAgICAgICAgIF9ydW5FeHBvcnQoc2NoZW1lSWQsICRzY2hlbWVSb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsaWNrIGhhbmRsZXIgZm9yIHRoZSBkZWxldGUgc2NoZW1lIGljb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RGVsZXRlTW9kYWwoZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0IHRoZSBzY2hlbWUgaWQgYW5kIHRoZSBhc3NvY2lhdGVkIHRhYmxlIHJvd1xuICAgICAgICAgICAgY29uc3Qgc2NoZW1lSWQgPSAkKHRoaXMpLmRhdGEoJ3NjaGVtZS1pZCcpO1xuICAgICAgICAgICAgY29uc3QgJHNjaGVtZVJvdyA9ICQodGhpcykuY2xvc2VzdCgndHInKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBtb2RhbFxuICAgICAgICAgICAgJG1vZGFscy5kZWxldGUuZmluZCgnZmllbGRzZXQuc2NoZW1lLWRhdGEgZGl2LnNjaGVtZS1uYW1lJykudGV4dCgkc2NoZW1lUm93LmZpbmQoJy5zY2hlbWUtbmFtZScpLnRleHQoKSk7XG4gICAgICAgICAgICAkbW9kYWxzLmRlbGV0ZS5tb2RhbCgnc2hvdycpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGUgZGVsZXRlIGNvbmZpcm1hdGlvbiBtb2RhbCBidXR0b24gY2xpY2sgZXZlbnRcbiAgICAgICAgICAgIGNvbnN0ICRjb25maXJtQnV0dG9uID0gJG1vZGFscy5kZWxldGUuZmluZCgnYnV0dG9uLmNvbmZpcm0nKTtcbiAgICAgICAgICAgICRjb25maXJtQnV0dG9uXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2snKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAoKSA9PiBfZGVsZXRlU2NoZW1lKHNjaGVtZUlkLCAkc2NoZW1lUm93KSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlciBmb3IgdGhlIGFjY291bnQgbW9kYWwsIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgaWYgdGhlIHVzZXIgaXMgbm90IGNvbm5lY3RlZCB3aXRoIEdvb2dsZSBBZFdvcmRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIG9mIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93QWNjb3VudE1vZGFsKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuICAgICAgICAgICAgaWYgKGV2ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTaG93IG1vZGFsXG4gICAgICAgICAgICAkKCcuYWR3b3Jkcy1hY2NvdW50Lm1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGljayBoYW5kbGVyIGZvciB0aGUgZG93bmxvYWQgZXhwb3J0IGxpbmtcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IGpRdWVyeSBldmVudCBvYmplY3QgY29udGFpbnMgaW5mb3JtYXRpb24gb2YgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2Rvd25sb2FkRXhwb3J0KGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBDb2xsZWN0IHRoZSBzY2hlbWUgaWQgYW5kIHRoZSBhc3NvY2lhdGVkIHRhYmxlIHJvd1xuICAgICAgICAgICAgY29uc3Qgc2NoZW1lSWQgPSAkKHRoaXMpLmRhdGEoJ3NjaGVtZS1pZCcpXG4gICAgICAgICAgICAgICAgPyAkKHRoaXMpLmRhdGEoJ3NjaGVtZS1pZCcpXG4gICAgICAgICAgICAgICAgOiAkKGV2ZW50LnRhcmdldCkucGFyZW50KCdhJykuZGF0YSgnc2NoZW1lLWlkJyk7XG5cbiAgICAgICAgICAgIC8vIE9wZW4gZXhwb3J0IGZvciBkb3dubG9hZFxuICAgICAgICAgICAgd2luZG93Lm9wZW4odXJscy5kb3dubG9hZEV4cG9ydCArIFwiJnNjaGVtZUlkPVwiICsgc2NoZW1lSWQsICdfYmxhbmsnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkKCdhLmRlbGV0ZS1zY2hlbWUnKS5vbignY2xpY2snLCBfc2hvd0RlbGV0ZU1vZGFsKTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2hvd0FjY291bnRGb3JtKSB7XG4gICAgICAgICAgICAgICAgX3Nob3dBY2NvdW50TW9kYWwoKTtcbiAgICAgICAgICAgICAgICAkKCdhLnN0YXJ0LWV4cG9ydCcpLm9uKCdjbGljaycsIF9zaG93QWNjb3VudE1vZGFsKTtcbiAgICAgICAgICAgICAgICAkKCdhLmRvd25sb2FkLWV4cG9ydCcpLm9uKCdjbGljaycsIF9zaG93QWNjb3VudE1vZGFsKTtcbiAgICAgICAgICAgICAgICAkKCdhLmRvd25sb2FkLWV4cG9ydC1idXR0b24nKS5vbignY2xpY2snLCBfc2hvd0FjY291bnRNb2RhbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJ2Euc3RhcnQtZXhwb3J0Jykub24oJ2NsaWNrJywgX29uRXhwb3J0U3RhcnQpO1xuICAgICAgICAgICAgICAgICQoJ2EuZG93bmxvYWQtZXhwb3J0Jykub24oJ2NsaWNrJywgX2Rvd25sb2FkRXhwb3J0KTtcbiAgICAgICAgICAgICAgICAkKCdhLmRvd25sb2FkLWV4cG9ydC1idXR0b24nKS5vbignY2xpY2snLCBfZG93bmxvYWRFeHBvcnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTsiXX0=
