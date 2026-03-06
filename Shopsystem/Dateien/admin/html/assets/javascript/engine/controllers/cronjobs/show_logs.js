'use strict';

/* --------------------------------------------------------------
 show_logs.js 2018-08-28
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// ------------------------------------------------------------------------
// CONTROLLER NAME
// ------------------------------------------------------------------------
'show_logs',

// ------------------------------------------------------------------------
// CONTROLLER LIBRARIES
// ------------------------------------------------------------------------
['xhr'],

// ------------------------------------------------------------------------
// CONTROLLER BUSINESS LOGIC
// ------------------------------------------------------------------------
function (data) {
  'use strict';

  // ------------------------------------------------------------------------
  // VARIABLES
  // ------------------------------------------------------------------------

  /**
   * Controller reference.
   *
   * @type {jQuery}
   */

  var $this = $(this);

  /**
   * Default options for controller,
   *
   * @type {object}
   */
  var defaults = {};

  /**
   * Final controller options.
   *
   * @type {object}
   */
  var options = $.extend(true, {}, defaults, data);

  /**
   * Module object.
   *
   * @type {{}}
   */
  var module = {};

  /**
   * Logs modal html element.
   *
   * @type {jQuery|HTMLElement}
   */
  var $modal = $('.modal.logs');

  /**
   * Button that initializes the log modal on click.
   *
   * @type {jQuery|HTMLElement}
   */
  var $btnOpenLogs = $('.open-logs');

  /**
   * Body of logs modal.
   *
   * @type {jQuery|HTMLElement}
   */
  var $modalBody = $modal.find('.modal-body');

  // Event handler callback methods

  /**
   * Setup for logs modal.
   * An ajax requests the logs data from the server.
   *
   * @param event
   * @private
   */
  var _setupLogsModal = function _setupLogsModal(event) {
    var task = $(event.target).closest('.cronjob-element').attr('data-task');

    event.preventDefault();
    $modal.find('.modal-title').text(task);

    jse.libs.xhr.get({
      url: 'admin.php?do=CronjobAjax/getLogs&task=' + task
    }, true).done(_showLogsModal).fail(_displayError).always(function () {
      return $modal.modal('show');
    });
  };

  /**
   * Tear down for logs modal.
   * Will reset the modal size and title.
   *
   * @private
   */
  var _tearDownLogsModal = function _tearDownLogsModal() {
    $modal.find('.modal-dialog').removeClass('modal-sm').addClass('modal-lg');
    $modal.find('.modal-title').text('');
  };

  // Ajax request callback methods

  /**
   * Shows the logs modal and appends the log data to the modal body.
   *
   * @param {object} response Response of ajax that should fetch log files.
   * @param {boolean} response.success Success flag must be true if this method is called.
   * @param {string} response.log Log data.
   * @private
   */
  var _showLogsModal = function _showLogsModal(response) {
    if (response.success) {
      $modalBody.empty().append(_renderLogBody(response.log));
      return;
    }

    _displayError(response);
  };

  /**
   * Displays an error message if the ajax to fetch logs failed.
   *
   * @param {object} response Response of ajax that should fetch log files.
   * @param {boolean} response.success Success flag must be false if this method is called.
   * @param {string} response.error Error message of ajax request.
   * @private
   */
  var _displayError = function _displayError(response) {
    var $msg = $('<p/>', {
      'text': response.error
    });

    $modal.find('.modal-dialog').removeClass('modal-lg').addClass('modal-sm');
    $modalBody.empty().append($msg);
  };

  // Private helper methods

  /**
   * Renders the modal body.
   *
   * @param {string} logData Logs data from server response.
   *
   * @returns {jQuery|HTMLElement}
   * @private
   */
  var _renderLogBody = function _renderLogBody(logData) {
    var $form = $('<form/>');
    var $label = $('<label/>').attr('for', 'log-messages').text(jse.core.lang.translate('log_modal_last_messages', 'cronjobs'));
    var $textArea = $('<textarea/>').attr('id', 'log-messages').val(logData).prop('readonly', true);

    return $form.append($label).append($textArea);
  };

  // Module initialization
  module.init = function (done) {
    $btnOpenLogs.on('click', _setupLogsModal);
    $modal.on('hidden.bs.modal', _tearDownLogsModal);

    done();
  };

  return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyb25qb2JzL3Nob3dfbG9ncy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIiRtb2RhbCIsIiRidG5PcGVuTG9ncyIsIiRtb2RhbEJvZHkiLCJmaW5kIiwiX3NldHVwTG9nc01vZGFsIiwidGFzayIsImV2ZW50IiwidGFyZ2V0IiwiY2xvc2VzdCIsImF0dHIiLCJwcmV2ZW50RGVmYXVsdCIsInRleHQiLCJqc2UiLCJsaWJzIiwieGhyIiwiZ2V0IiwidXJsIiwiZG9uZSIsIl9zaG93TG9nc01vZGFsIiwiZmFpbCIsIl9kaXNwbGF5RXJyb3IiLCJhbHdheXMiLCJtb2RhbCIsIl90ZWFyRG93bkxvZ3NNb2RhbCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJlbXB0eSIsImFwcGVuZCIsIl9yZW5kZXJMb2dCb2R5IiwibG9nIiwiJG1zZyIsImVycm9yIiwiJGZvcm0iLCIkbGFiZWwiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIiR0ZXh0QXJlYSIsInZhbCIsImxvZ0RhdGEiLCJwcm9wIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZjtBQUNJO0FBQ0E7QUFDQTtBQUNBLFdBSko7O0FBTUk7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxLQUFELENBVEo7O0FBV0k7QUFDQTtBQUNBO0FBQ0EsVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsTUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxNQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJ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QUE2QnJCLGtCQUE3Qjs7QUFFQU47QUFDSCxHQUxEOztBQU9BLFNBQU94QixNQUFQO0FBQ0gsQ0F0S0wiLCJmaWxlIjoiY3JvbmpvYnMvc2hvd19sb2dzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzaG93X2xvZ3MuanMgMjAxOC0wOC0yOFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTggR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBDT05UUk9MTEVSIE5BTUVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAnc2hvd19sb2dzJyxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgTElCUkFSSUVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgWyd4aHInXSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENPTlRST0xMRVIgQlVTSU5FU1MgTE9HSUNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udHJvbGxlciByZWZlcmVuY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgb3B0aW9ucyBmb3IgY29udHJvbGxlcixcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIGNvbnRyb2xsZXIgb3B0aW9ucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTG9ncyBtb2RhbCBodG1sIGVsZW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkbW9kYWwgPSAkKCcubW9kYWwubG9ncycpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCdXR0b24gdGhhdCBpbml0aWFsaXplcyB0aGUgbG9nIG1vZGFsIG9uIGNsaWNrLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fEhUTUxFbGVtZW50fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJGJ0bk9wZW5Mb2dzID0gJCgnLm9wZW4tbG9ncycpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCb2R5IG9mIGxvZ3MgbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkbW9kYWxCb2R5ID0gJG1vZGFsLmZpbmQoJy5tb2RhbC1ib2R5Jyk7XG5cbiAgICAgICAgLy8gRXZlbnQgaGFuZGxlciBjYWxsYmFjayBtZXRob2RzXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHVwIGZvciBsb2dzIG1vZGFsLlxuICAgICAgICAgKiBBbiBhamF4IHJlcXVlc3RzIHRoZSBsb2dzIGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zZXR1cExvZ3NNb2RhbCA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRhc2sgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLmNyb25qb2ItZWxlbWVudCcpLmF0dHIoJ2RhdGEtdGFzaycpO1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJG1vZGFsLmZpbmQoJy5tb2RhbC10aXRsZScpLnRleHQodGFzayk7XG5cbiAgICAgICAgICAgIGpzZS5saWJzLnhoci5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogJ2FkbWluLnBocD9kbz1Dcm9uam9iQWpheC9nZXRMb2dzJnRhc2s9JyArIHRhc2tcbiAgICAgICAgICAgIH0sIHRydWUpLmRvbmUoX3Nob3dMb2dzTW9kYWwpLmZhaWwoX2Rpc3BsYXlFcnJvcikuYWx3YXlzKCgpID0+ICRtb2RhbC5tb2RhbCgnc2hvdycpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGVhciBkb3duIGZvciBsb2dzIG1vZGFsLlxuICAgICAgICAgKiBXaWxsIHJlc2V0IHRoZSBtb2RhbCBzaXplIGFuZCB0aXRsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF90ZWFyRG93bkxvZ3NNb2RhbCA9ICgpID0+IHtcbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcubW9kYWwtZGlhbG9nJykucmVtb3ZlQ2xhc3MoJ21vZGFsLXNtJykuYWRkQ2xhc3MoJ21vZGFsLWxnJyk7XG4gICAgICAgICAgICAkbW9kYWwuZmluZCgnLm1vZGFsLXRpdGxlJykudGV4dCgnJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQWpheCByZXF1ZXN0IGNhbGxiYWNrIG1ldGhvZHNcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2hvd3MgdGhlIGxvZ3MgbW9kYWwgYW5kIGFwcGVuZHMgdGhlIGxvZyBkYXRhIHRvIHRoZSBtb2RhbCBib2R5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2UgUmVzcG9uc2Ugb2YgYWpheCB0aGF0IHNob3VsZCBmZXRjaCBsb2cgZmlsZXMuXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVzcG9uc2Uuc3VjY2VzcyBTdWNjZXNzIGZsYWcgbXVzdCBiZSB0cnVlIGlmIHRoaXMgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlLmxvZyBMb2cgZGF0YS5cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IF9zaG93TG9nc01vZGFsID0gcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAkbW9kYWxCb2R5LmVtcHR5KCkuYXBwZW5kKF9yZW5kZXJMb2dCb2R5KHJlc3BvbnNlLmxvZykpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2Rpc3BsYXlFcnJvcihyZXNwb25zZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXlzIGFuIGVycm9yIG1lc3NhZ2UgaWYgdGhlIGFqYXggdG8gZmV0Y2ggbG9ncyBmYWlsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZSBSZXNwb25zZSBvZiBhamF4IHRoYXQgc2hvdWxkIGZldGNoIGxvZyBmaWxlcy5cbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSByZXNwb25zZS5zdWNjZXNzIFN1Y2Nlc3MgZmxhZyBtdXN0IGJlIGZhbHNlIGlmIHRoaXMgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlLmVycm9yIEVycm9yIG1lc3NhZ2Ugb2YgYWpheCByZXF1ZXN0LlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX2Rpc3BsYXlFcnJvciA9IHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRtc2cgPSAkKCc8cC8+Jywge1xuICAgICAgICAgICAgICAgICd0ZXh0JzogcmVzcG9uc2UuZXJyb3JcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICRtb2RhbC5maW5kKCcubW9kYWwtZGlhbG9nJykucmVtb3ZlQ2xhc3MoJ21vZGFsLWxnJykuYWRkQ2xhc3MoJ21vZGFsLXNtJyk7XG4gICAgICAgICAgICAkbW9kYWxCb2R5LmVtcHR5KCkuYXBwZW5kKCRtc2cpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFByaXZhdGUgaGVscGVyIG1ldGhvZHNcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVuZGVycyB0aGUgbW9kYWwgYm9keS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxvZ0RhdGEgTG9ncyBkYXRhIGZyb20gc2VydmVyIHJlc3BvbnNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7alF1ZXJ5fEhUTUxFbGVtZW50fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgX3JlbmRlckxvZ0JvZHkgPSBsb2dEYXRhID0+IHtcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtID0gJCgnPGZvcm0vPicpO1xuICAgICAgICAgICAgY29uc3QgJGxhYmVsID0gJCgnPGxhYmVsLz4nKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdmb3InLCAnbG9nLW1lc3NhZ2VzJylcbiAgICAgICAgICAgICAgICAudGV4dChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnbG9nX21vZGFsX2xhc3RfbWVzc2FnZXMnLCAnY3JvbmpvYnMnKSk7XG4gICAgICAgICAgICBjb25zdCAkdGV4dEFyZWEgPSAkKCc8dGV4dGFyZWEvPicpLmF0dHIoJ2lkJywgJ2xvZy1tZXNzYWdlcycpLnZhbChsb2dEYXRhKS5wcm9wKCdyZWFkb25seScsIHRydWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gJGZvcm0uYXBwZW5kKCRsYWJlbCkuYXBwZW5kKCR0ZXh0QXJlYSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTW9kdWxlIGluaXRpYWxpemF0aW9uXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAkYnRuT3BlbkxvZ3Mub24oJ2NsaWNrJywgX3NldHVwTG9nc01vZGFsKTtcbiAgICAgICAgICAgICRtb2RhbC5vbignaGlkZGVuLmJzLm1vZGFsJywgX3RlYXJEb3duTG9nc01vZGFsKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pOyJdfQ==
