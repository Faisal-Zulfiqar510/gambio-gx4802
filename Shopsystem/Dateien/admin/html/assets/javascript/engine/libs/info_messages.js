'use strict';

/* --------------------------------------------------------------
 info_messages.js 2016-07-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.info_messages = jse.libs.info_messages || {};

/**
 * ## Info Messages library
 *
 * Use this library to add messages into admin's notification system (top right corner). There are multiple
 * types of notification entries 'error', 'info', 'warning' and 'success'. Use the respective method for
 * each one of them.
 *
 * You will need to provide the full URL in order to load this library as a dependency to a module:
 *
 * ```javascript
 * gx.controller.module(
 *   'my_custom_page',
 *
 *   [
 *      gx.source + '/libs/info_messages'
 *   ],
 *
 *   function(data) {
 *      // Module code ... 
 *   });
 *```
 *
 * @todo This library does not yet support the new admin layout pages.
 *
 * @module Admin/Libs/info_messages
 * @exports jse.libs.info_messages
 */
(function (exports) {

  'use strict';

  /**
   * Container element for info messages
   *
   * @type {object}
   */

  var $messagesContainer = $('.message_stack_container, .message-stack');

  /**
   * Appends a message box to the info messages container and displays it
   *
   * @param {string} message Message to be displayed.
   * @param {string} type Message type can be one of the "info", "warning", "error" & "success".
   *
   * @private
   */
  var _add = function _add(message, type) {
    var $alert = $('<div class="alert alert-' + type + '" data-gx-compatibility="close_alert_box">' + '<button type="button" class="close" data-dismuss="alert">×</button>' + message + '</div>');

    $alert.find('.close').on('click', function () {
      $(this).parent('.alert').hide();
    });

    $messagesContainer.append($alert);
    $messagesContainer.show();
  };

  /**
   * Removes all messages inside the message container.
   */
  exports.truncate = function () {
    $messagesContainer.empty();
  };

  /**
   * Adds a red error message.
   *
   * @param {string} message Message to be displayed.
   */
  exports.addError = function (message) {
    _add(message, 'danger');
  };

  /**
   * Adds a blue info message.
   *
   * @param {string} message Message to be displayed.
   */
  exports.addInfo = function (message) {
    _add(message, 'info');
  };

  /**
   * Adds a green success message.
   *
   * @param {string} message Message to be displayed.
   */
  exports.addSuccess = function (message) {
    _add(message, 'success');
  };

  /**
   * Adds a yellow warning message.
   *
   * @param {string} message Message to be displayed.
   */
  exports.addWarning = function (message) {
    _add(message, 'warning');
  };
})(jse.libs.info_messages);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZm9fbWVzc2FnZXMuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsImluZm9fbWVzc2FnZXMiLCJleHBvcnRzIiwiJG1lc3NhZ2VzQ29udGFpbmVyIiwiJCIsIl9hZGQiLCJtZXNzYWdlIiwidHlwZSIsIiRhbGVydCIsImZpbmQiLCJvbiIsInBhcmVudCIsImhpZGUiLCJhcHBlbmQiLCJzaG93IiwidHJ1bmNhdGUiLCJlbXB0eSIsImFkZEVycm9yIiwiYWRkSW5mbyIsImFkZFN1Y2Nlc3MiLCJhZGRXYXJuaW5nIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLElBQUlDLElBQUosQ0FBU0MsYUFBVCxHQUF5QkYsSUFBSUMsSUFBSixDQUFTQyxhQUFULElBQTBCLEVBQW5EOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsQ0FBQyxVQUFVQyxPQUFWLEVBQW1COztBQUVoQjs7QUFFQTs7Ozs7O0FBS0EsTUFBSUMscUJBQXFCQyxFQUFFLDBDQUFGLENBQXpCOztBQUVBOzs7Ozs7OztBQVFBLE1BQUlDLE9BQU8sU0FBUEEsSUFBTyxDQUFVQyxPQUFWLEVBQW1CQyxJQUFuQixFQUF5QjtBQUNoQyxRQUFJQyxTQUFTSixFQUFFLDZCQUE2QkcsSUFBN0IsR0FBb0MsNENBQXBDLEdBQ1gscUVBRFcsR0FDNkRELE9BRDdELEdBQ3VFLFFBRHpFLENBQWI7O0FBR0FFLFdBQU9DLElBQVAsQ0FBWSxRQUFaLEVBQXNCQyxFQUF0QixDQUF5QixPQUF6QixFQUFrQyxZQUFZO0FBQzFDTixRQUFFLElBQUYsRUFBUU8sTUFBUixDQUFlLFFBQWYsRUFBeUJDLElBQXpCO0FBQ0gsS0FGRDs7QUFJQVQsdUJBQW1CVSxNQUFuQixDQUEwQkwsTUFBMUI7QUFDQUwsdUJBQW1CVyxJQUFuQjtBQUNILEdBVkQ7O0FBWUE7OztBQUdBWixVQUFRYSxRQUFSLEdBQW1CLFlBQVk7QUFDM0JaLHVCQUFtQmEsS0FBbkI7QUFDSCxHQUZEOztBQUlBOzs7OztBQUtBZCxVQUFRZSxRQUFSLEdBQW1CLFVBQVVYLE9BQVYsRUFBbUI7QUFDbENELFNBQUtDLE9BQUwsRUFBYyxRQUFkO0FBQ0gsR0FGRDs7QUFJQTs7Ozs7QUFLQUosVUFBUWdCLE9BQVIsR0FBa0IsVUFBVVosT0FBVixFQUFtQjtBQUNqQ0QsU0FBS0MsT0FBTCxFQUFjLE1BQWQ7QUFDSCxHQUZEOztBQUlBOzs7OztBQUtBSixVQUFRaUIsVUFBUixHQUFxQixVQUFVYixPQUFWLEVBQW1CO0FBQ3BDRCxTQUFLQyxPQUFMLEVBQWMsU0FBZDtBQUNILEdBRkQ7O0FBSUE7Ozs7O0FBS0FKLFVBQVFrQixVQUFSLEdBQXFCLFVBQVVkLE9BQVYsRUFBbUI7QUFDcENELFNBQUtDLE9BQUwsRUFBYyxTQUFkO0FBQ0gsR0FGRDtBQUlILENBMUVELEVBMEVHUCxJQUFJQyxJQUFKLENBQVNDLGFBMUVaIiwiZmlsZSI6ImluZm9fbWVzc2FnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGluZm9fbWVzc2FnZXMuanMgMjAxNi0wNy0yN1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLmluZm9fbWVzc2FnZXMgPSBqc2UubGlicy5pbmZvX21lc3NhZ2VzIHx8IHt9O1xuXG4vKipcbiAqICMjIEluZm8gTWVzc2FnZXMgbGlicmFyeVxuICpcbiAqIFVzZSB0aGlzIGxpYnJhcnkgdG8gYWRkIG1lc3NhZ2VzIGludG8gYWRtaW4ncyBub3RpZmljYXRpb24gc3lzdGVtICh0b3AgcmlnaHQgY29ybmVyKS4gVGhlcmUgYXJlIG11bHRpcGxlXG4gKiB0eXBlcyBvZiBub3RpZmljYXRpb24gZW50cmllcyAnZXJyb3InLCAnaW5mbycsICd3YXJuaW5nJyBhbmQgJ3N1Y2Nlc3MnLiBVc2UgdGhlIHJlc3BlY3RpdmUgbWV0aG9kIGZvclxuICogZWFjaCBvbmUgb2YgdGhlbS5cbiAqXG4gKiBZb3Ugd2lsbCBuZWVkIHRvIHByb3ZpZGUgdGhlIGZ1bGwgVVJMIGluIG9yZGVyIHRvIGxvYWQgdGhpcyBsaWJyYXJ5IGFzIGEgZGVwZW5kZW5jeSB0byBhIG1vZHVsZTpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBneC5jb250cm9sbGVyLm1vZHVsZShcbiAqICAgJ215X2N1c3RvbV9wYWdlJyxcbiAqXG4gKiAgIFtcbiAqICAgICAgZ3guc291cmNlICsgJy9saWJzL2luZm9fbWVzc2FnZXMnXG4gKiAgIF0sXG4gKlxuICogICBmdW5jdGlvbihkYXRhKSB7XG4gKiAgICAgIC8vIE1vZHVsZSBjb2RlIC4uLiBcbiAqICAgfSk7XG4gKmBgYFxuICpcbiAqIEB0b2RvIFRoaXMgbGlicmFyeSBkb2VzIG5vdCB5ZXQgc3VwcG9ydCB0aGUgbmV3IGFkbWluIGxheW91dCBwYWdlcy5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0xpYnMvaW5mb19tZXNzYWdlc1xuICogQGV4cG9ydHMganNlLmxpYnMuaW5mb19tZXNzYWdlc1xuICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5lciBlbGVtZW50IGZvciBpbmZvIG1lc3NhZ2VzXG4gICAgICpcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIHZhciAkbWVzc2FnZXNDb250YWluZXIgPSAkKCcubWVzc2FnZV9zdGFja19jb250YWluZXIsIC5tZXNzYWdlLXN0YWNrJyk7XG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmRzIGEgbWVzc2FnZSBib3ggdG8gdGhlIGluZm8gbWVzc2FnZXMgY29udGFpbmVyIGFuZCBkaXNwbGF5cyBpdFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgTWVzc2FnZSB0eXBlIGNhbiBiZSBvbmUgb2YgdGhlIFwiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiICYgXCJzdWNjZXNzXCIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHZhciBfYWRkID0gZnVuY3Rpb24gKG1lc3NhZ2UsIHR5cGUpIHtcbiAgICAgICAgdmFyICRhbGVydCA9ICQoJzxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC0nICsgdHlwZSArICdcIiBkYXRhLWd4LWNvbXBhdGliaWxpdHk9XCJjbG9zZV9hbGVydF9ib3hcIj4nICtcbiAgICAgICAgICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtdXNzPVwiYWxlcnRcIj7DlzwvYnV0dG9uPicgKyBtZXNzYWdlICsgJzwvZGl2PicpO1xuXG4gICAgICAgICRhbGVydC5maW5kKCcuY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgnLmFsZXJ0JykuaGlkZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkbWVzc2FnZXNDb250YWluZXIuYXBwZW5kKCRhbGVydCk7XG4gICAgICAgICRtZXNzYWdlc0NvbnRhaW5lci5zaG93KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIG1lc3NhZ2VzIGluc2lkZSB0aGUgbWVzc2FnZSBjb250YWluZXIuXG4gICAgICovXG4gICAgZXhwb3J0cy50cnVuY2F0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJG1lc3NhZ2VzQ29udGFpbmVyLmVtcHR5KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSByZWQgZXJyb3IgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkLlxuICAgICAqL1xuICAgIGV4cG9ydHMuYWRkRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICBfYWRkKG1lc3NhZ2UsICdkYW5nZXInKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGJsdWUgaW5mbyBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQuXG4gICAgICovXG4gICAgZXhwb3J0cy5hZGRJbmZvID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgX2FkZChtZXNzYWdlLCAnaW5mbycpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgZ3JlZW4gc3VjY2VzcyBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgTWVzc2FnZSB0byBiZSBkaXNwbGF5ZWQuXG4gICAgICovXG4gICAgZXhwb3J0cy5hZGRTdWNjZXNzID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICAgICAgX2FkZChtZXNzYWdlLCAnc3VjY2VzcycpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgeWVsbG93IHdhcm5pbmcgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIE1lc3NhZ2UgdG8gYmUgZGlzcGxheWVkLlxuICAgICAqL1xuICAgIGV4cG9ydHMuYWRkV2FybmluZyA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XG4gICAgICAgIF9hZGQobWVzc2FnZSwgJ3dhcm5pbmcnKTtcbiAgICB9O1xuXG59KShqc2UubGlicy5pbmZvX21lc3NhZ2VzKTtcbiJdfQ==
