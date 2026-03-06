'use strict';

/* --------------------------------------------------------------
 action_mapper.js 2016-02-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.action_mapper = jse.libs.action_mapper || {};

/**
 * ## Action Mapper Library
 *
 * Maps a dropdown button action item event to another page element ($button). This library
 * must be used to quickly redirect user actions to existing but hidden UI elements like table row
 * actions. When a callback function is passed as an argument the action item will override the default
 * behaviour.
 *
 * You will need to provide the full URL in order to load this library as a dependency to a module:
 *
 * ```javascript
 * gx.controller.module(
 *   'my_custom_page',
 *
 *   [
 *      gx.source + '/libs/action_mapper'
 *   ],
 *
 *   function(data) {
 *      // Module code ... 
 *   });
 *```
 * ### Example
 *
 * The HTML for the target button:
 *
 * ```html
 * <button id="button1">Button 1</button>
 * ```
 *
 * The JavaScript code that will map an action to to a button dropdown widget for the target button:
 *
 * ```javascript
 * // Define a custom callback function.
 * function customCallbackFunc(event) {
 *     console.log('Function called!');
 * };
 *
 * // Map an event to a new dropdown action item.
 * var options = {
 *   // A new action item will be created in this widget.
 *   $dropdown: $('#button-dropdown'), 
 *
 *   // Target element will be triggered when the user clicks the dropdown action item.  
 *   $target: $('#target-button'), 
 *   
 *   // Target event name to be triggered.
 *   event: 'click',   
 *   
 *   // (optional) Provide a function to override the default event handler.
 *   callback: customCallbackFunc, 
 *   
 *   // (optional) Add a custom action title for the dropdown button.
 *   title: 'Action Title' 
 * }
 *
 * jse.libs.action_mapper.bind(options);
 * ```
 *
 * By clicking on the "Button 1" you will receive a "Function called!" in the console!
 *
 * @module Admin/Libs/action_mapper
 * @exports jse.libs.action_mapper
 */
(function (exports) {

    'use strict';

    /**
     * Triggers a specific event from an element.
     *
     * Some situations require a different approach than just using the "trigger" method.
     *
     * @param {object} $element Destination element to be triggered.
     * @param {object} event Event options can be used for creating new conditions.
     *
     * @private
     */

    var _triggerEvent = function _triggerEvent($element, event) {
        if ($element.prop('tagName') === 'A' && event.type === 'click') {
            $element.get(0).click();
        } else {
            $element.trigger(event.type);
        }
    };

    /**
     * Binds the event to a new dropdown action item.
     *
     * @param options See bind documentation.
     *
     * @private
     */
    var _bindEvent = function _bindEvent(options) {
        var $dropdown = options.$dropdown,
            action = options.action,
            $target = options.$target,
            eventName = options.event,
            callback = options.callback || false,
            title = options.title || (options.$target.length ? options.$target.text() : '<No Action Title Provided>'),
            $li = $('<li></li>');

        $li.html('<span data-value="' + action + '">' + title + '</span>');
        $dropdown.find('ul').append($li);

        $li.find('span').on(eventName, function (event) {
            if (callback !== false) {
                //event.preventDefault();
                //event.stopPropagation();
                callback.call($li.find('span'), event);
            } else {
                _triggerEvent($target, event);
            }
        });
    };

    /**
     * Binds the event
     *
     * This method is the initializing point for all event bindings.
     *
     * @param {object} options Contains all elements, function and event description
     * @param {string} options.$dropdown Selector for the button dropdown element (div).
     * @param {string} [options.$target] (optional) Selector for the target element of the mapping.
     * @param {string} options.event The name of the event. The event will be triggered on source and
     * destination element (e.g. "click", "mouseleave").
     * @param {function} [options.callback] (optional) Function that will be called when the event of the
     * destination element is triggered. OVERWRITES THE ACTUAL EVENT FOR THE  DESTINATION ELEMENT.
     * @param {string} title (optional) Provide an action title for the dropdown if no $target was defined.
     */
    exports.bind = function (options) {
        _bindEvent(options);
    };
})(jse.libs.action_mapper);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjdGlvbl9tYXBwZXIuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsImFjdGlvbl9tYXBwZXIiLCJleHBvcnRzIiwiX3RyaWdnZXJFdmVudCIsIiRlbGVtZW50IiwiZXZlbnQiLCJwcm9wIiwidHlwZSIsImdldCIsImNsaWNrIiwidHJpZ2dlciIsIl9iaW5kRXZlbnQiLCJvcHRpb25zIiwiJGRyb3Bkb3duIiwiYWN0aW9uIiwiJHRhcmdldCIsImV2ZW50TmFtZSIsImNhbGxiYWNrIiwidGl0bGUiLCJsZW5ndGgiLCJ0ZXh0IiwiJGxpIiwiJCIsImh0bWwiLCJmaW5kIiwiYXBwZW5kIiwib24iLCJjYWxsIiwiYmluZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxJQUFJQyxJQUFKLENBQVNDLGFBQVQsR0FBeUJGLElBQUlDLElBQUosQ0FBU0MsYUFBVCxJQUEwQixFQUFuRDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdFQSxDQUFDLFVBQVVDLE9BQVYsRUFBbUI7O0FBRWhCOztBQUVBOzs7Ozs7Ozs7OztBQVVBLFFBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVUMsUUFBVixFQUFvQkMsS0FBcEIsRUFBMkI7QUFDM0MsWUFBSUQsU0FBU0UsSUFBVCxDQUFjLFNBQWQsTUFBNkIsR0FBN0IsSUFBb0NELE1BQU1FLElBQU4sS0FBZSxPQUF2RCxFQUFnRTtBQUM1REgscUJBQVNJLEdBQVQsQ0FBYSxDQUFiLEVBQWdCQyxLQUFoQjtBQUNILFNBRkQsTUFFTztBQUNITCxxQkFBU00sT0FBVCxDQUFpQkwsTUFBTUUsSUFBdkI7QUFDSDtBQUNKLEtBTkQ7O0FBUUE7Ozs7Ozs7QUFPQSxRQUFJSSxhQUFhLFNBQWJBLFVBQWEsQ0FBVUMsT0FBVixFQUFtQjtBQUNoQyxZQUFJQyxZQUFZRCxRQUFRQyxTQUF4QjtBQUFBLFlBQ0lDLFNBQVNGLFFBQVFFLE1BRHJCO0FBQUEsWUFFSUMsVUFBVUgsUUFBUUcsT0FGdEI7QUFBQSxZQUdJQyxZQUFZSixRQUFRUCxLQUh4QjtBQUFBLFlBSUlZLFdBQVdMLFFBQVFLLFFBQVIsSUFBb0IsS0FKbkM7QUFBQSxZQUtJQyxRQUFRTixRQUFRTSxLQUFSLEtBQWtCTixRQUFRRyxPQUFSLENBQWdCSSxNQUFoQixHQUF5QlAsUUFBUUcsT0FBUixDQUFnQkssSUFBaEIsRUFBekIsR0FBa0QsNEJBQXBFLENBTFo7QUFBQSxZQU1JQyxNQUFNQyxFQUFFLFdBQUYsQ0FOVjs7QUFRQUQsWUFBSUUsSUFBSixDQUFTLHVCQUF1QlQsTUFBdkIsR0FBZ0MsSUFBaEMsR0FBdUNJLEtBQXZDLEdBQStDLFNBQXhEO0FBQ0FMLGtCQUFVVyxJQUFWLENBQWUsSUFBZixFQUFxQkMsTUFBckIsQ0FBNEJKLEdBQTVCOztBQUVBQSxZQUFJRyxJQUFKLENBQVMsTUFBVCxFQUFpQkUsRUFBakIsQ0FBb0JWLFNBQXBCLEVBQStCLFVBQVVYLEtBQVYsRUFBaUI7QUFDNUMsZ0JBQUlZLGFBQWEsS0FBakIsRUFBd0I7QUFDcEI7QUFDQTtBQUNBQSx5QkFBU1UsSUFBVCxDQUFjTixJQUFJRyxJQUFKLENBQVMsTUFBVCxDQUFkLEVBQWdDbkIsS0FBaEM7QUFDSCxhQUpELE1BSU87QUFDSEYsOEJBQWNZLE9BQWQsRUFBdUJWLEtBQXZCO0FBQ0g7QUFDSixTQVJEO0FBU0gsS0FyQkQ7O0FBdUJBOzs7Ozs7Ozs7Ozs7OztBQWNBSCxZQUFRMEIsSUFBUixHQUFlLFVBQVVoQixPQUFWLEVBQW1CO0FBQzlCRCxtQkFBV0MsT0FBWDtBQUNILEtBRkQ7QUFJSCxDQXRFRCxFQXNFR2IsSUFBSUMsSUFBSixDQUFTQyxhQXRFWiIsImZpbGUiOiJhY3Rpb25fbWFwcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBhY3Rpb25fbWFwcGVyLmpzIDIwMTYtMDItMjJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5qc2UubGlicy5hY3Rpb25fbWFwcGVyID0ganNlLmxpYnMuYWN0aW9uX21hcHBlciB8fCB7fTtcblxuLyoqXG4gKiAjIyBBY3Rpb24gTWFwcGVyIExpYnJhcnlcbiAqXG4gKiBNYXBzIGEgZHJvcGRvd24gYnV0dG9uIGFjdGlvbiBpdGVtIGV2ZW50IHRvIGFub3RoZXIgcGFnZSBlbGVtZW50ICgkYnV0dG9uKS4gVGhpcyBsaWJyYXJ5XG4gKiBtdXN0IGJlIHVzZWQgdG8gcXVpY2tseSByZWRpcmVjdCB1c2VyIGFjdGlvbnMgdG8gZXhpc3RpbmcgYnV0IGhpZGRlbiBVSSBlbGVtZW50cyBsaWtlIHRhYmxlIHJvd1xuICogYWN0aW9ucy4gV2hlbiBhIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0aGUgYWN0aW9uIGl0ZW0gd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdFxuICogYmVoYXZpb3VyLlxuICpcbiAqIFlvdSB3aWxsIG5lZWQgdG8gcHJvdmlkZSB0aGUgZnVsbCBVUkwgaW4gb3JkZXIgdG8gbG9hZCB0aGlzIGxpYnJhcnkgYXMgYSBkZXBlbmRlbmN5IHRvIGEgbW9kdWxlOlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGd4LmNvbnRyb2xsZXIubW9kdWxlKFxuICogICAnbXlfY3VzdG9tX3BhZ2UnLFxuICpcbiAqICAgW1xuICogICAgICBneC5zb3VyY2UgKyAnL2xpYnMvYWN0aW9uX21hcHBlcidcbiAqICAgXSxcbiAqXG4gKiAgIGZ1bmN0aW9uKGRhdGEpIHtcbiAqICAgICAgLy8gTW9kdWxlIGNvZGUgLi4uIFxuICogICB9KTtcbiAqYGBgXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIFRoZSBIVE1MIGZvciB0aGUgdGFyZ2V0IGJ1dHRvbjpcbiAqXG4gKiBgYGBodG1sXG4gKiA8YnV0dG9uIGlkPVwiYnV0dG9uMVwiPkJ1dHRvbiAxPC9idXR0b24+XG4gKiBgYGBcbiAqXG4gKiBUaGUgSmF2YVNjcmlwdCBjb2RlIHRoYXQgd2lsbCBtYXAgYW4gYWN0aW9uIHRvIHRvIGEgYnV0dG9uIGRyb3Bkb3duIHdpZGdldCBmb3IgdGhlIHRhcmdldCBidXR0b246XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogLy8gRGVmaW5lIGEgY3VzdG9tIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICogZnVuY3Rpb24gY3VzdG9tQ2FsbGJhY2tGdW5jKGV2ZW50KSB7XG4gKiAgICAgY29uc29sZS5sb2coJ0Z1bmN0aW9uIGNhbGxlZCEnKTtcbiAqIH07XG4gKlxuICogLy8gTWFwIGFuIGV2ZW50IHRvIGEgbmV3IGRyb3Bkb3duIGFjdGlvbiBpdGVtLlxuICogdmFyIG9wdGlvbnMgPSB7XG4gKiAgIC8vIEEgbmV3IGFjdGlvbiBpdGVtIHdpbGwgYmUgY3JlYXRlZCBpbiB0aGlzIHdpZGdldC5cbiAqICAgJGRyb3Bkb3duOiAkKCcjYnV0dG9uLWRyb3Bkb3duJyksIFxuICpcbiAqICAgLy8gVGFyZ2V0IGVsZW1lbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgdXNlciBjbGlja3MgdGhlIGRyb3Bkb3duIGFjdGlvbiBpdGVtLiAgXG4gKiAgICR0YXJnZXQ6ICQoJyN0YXJnZXQtYnV0dG9uJyksIFxuICogICBcbiAqICAgLy8gVGFyZ2V0IGV2ZW50IG5hbWUgdG8gYmUgdHJpZ2dlcmVkLlxuICogICBldmVudDogJ2NsaWNrJywgICBcbiAqICAgXG4gKiAgIC8vIChvcHRpb25hbCkgUHJvdmlkZSBhIGZ1bmN0aW9uIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IGV2ZW50IGhhbmRsZXIuXG4gKiAgIGNhbGxiYWNrOiBjdXN0b21DYWxsYmFja0Z1bmMsIFxuICogICBcbiAqICAgLy8gKG9wdGlvbmFsKSBBZGQgYSBjdXN0b20gYWN0aW9uIHRpdGxlIGZvciB0aGUgZHJvcGRvd24gYnV0dG9uLlxuICogICB0aXRsZTogJ0FjdGlvbiBUaXRsZScgXG4gKiB9XG4gKlxuICoganNlLmxpYnMuYWN0aW9uX21hcHBlci5iaW5kKG9wdGlvbnMpO1xuICogYGBgXG4gKlxuICogQnkgY2xpY2tpbmcgb24gdGhlIFwiQnV0dG9uIDFcIiB5b3Ugd2lsbCByZWNlaXZlIGEgXCJGdW5jdGlvbiBjYWxsZWQhXCIgaW4gdGhlIGNvbnNvbGUhXG4gKlxuICogQG1vZHVsZSBBZG1pbi9MaWJzL2FjdGlvbl9tYXBwZXJcbiAqIEBleHBvcnRzIGpzZS5saWJzLmFjdGlvbl9tYXBwZXJcbiAqL1xuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VycyBhIHNwZWNpZmljIGV2ZW50IGZyb20gYW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIFNvbWUgc2l0dWF0aW9ucyByZXF1aXJlIGEgZGlmZmVyZW50IGFwcHJvYWNoIHRoYW4ganVzdCB1c2luZyB0aGUgXCJ0cmlnZ2VyXCIgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9ICRlbGVtZW50IERlc3RpbmF0aW9uIGVsZW1lbnQgdG8gYmUgdHJpZ2dlcmVkLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBFdmVudCBvcHRpb25zIGNhbiBiZSB1c2VkIGZvciBjcmVhdGluZyBuZXcgY29uZGl0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdmFyIF90cmlnZ2VyRXZlbnQgPSBmdW5jdGlvbiAoJGVsZW1lbnQsIGV2ZW50KSB7XG4gICAgICAgIGlmICgkZWxlbWVudC5wcm9wKCd0YWdOYW1lJykgPT09ICdBJyAmJiBldmVudC50eXBlID09PSAnY2xpY2snKSB7XG4gICAgICAgICAgICAkZWxlbWVudC5nZXQoMCkuY2xpY2soKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRlbGVtZW50LnRyaWdnZXIoZXZlbnQudHlwZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQmluZHMgdGhlIGV2ZW50IHRvIGEgbmV3IGRyb3Bkb3duIGFjdGlvbiBpdGVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgU2VlIGJpbmQgZG9jdW1lbnRhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdmFyIF9iaW5kRXZlbnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB2YXIgJGRyb3Bkb3duID0gb3B0aW9ucy4kZHJvcGRvd24sXG4gICAgICAgICAgICBhY3Rpb24gPSBvcHRpb25zLmFjdGlvbixcbiAgICAgICAgICAgICR0YXJnZXQgPSBvcHRpb25zLiR0YXJnZXQsXG4gICAgICAgICAgICBldmVudE5hbWUgPSBvcHRpb25zLmV2ZW50LFxuICAgICAgICAgICAgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8IGZhbHNlLFxuICAgICAgICAgICAgdGl0bGUgPSBvcHRpb25zLnRpdGxlIHx8IChvcHRpb25zLiR0YXJnZXQubGVuZ3RoID8gb3B0aW9ucy4kdGFyZ2V0LnRleHQoKSA6ICc8Tm8gQWN0aW9uIFRpdGxlIFByb3ZpZGVkPicpLFxuICAgICAgICAgICAgJGxpID0gJCgnPGxpPjwvbGk+Jyk7XG5cbiAgICAgICAgJGxpLmh0bWwoJzxzcGFuIGRhdGEtdmFsdWU9XCInICsgYWN0aW9uICsgJ1wiPicgKyB0aXRsZSArICc8L3NwYW4+Jyk7XG4gICAgICAgICRkcm9wZG93bi5maW5kKCd1bCcpLmFwcGVuZCgkbGkpO1xuXG4gICAgICAgICRsaS5maW5kKCdzcGFuJykub24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgLy9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCRsaS5maW5kKCdzcGFuJyksIGV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RyaWdnZXJFdmVudCgkdGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyB0aGUgZXZlbnRcbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIHRoZSBpbml0aWFsaXppbmcgcG9pbnQgZm9yIGFsbCBldmVudCBiaW5kaW5ncy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIENvbnRhaW5zIGFsbCBlbGVtZW50cywgZnVuY3Rpb24gYW5kIGV2ZW50IGRlc2NyaXB0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuJGRyb3Bkb3duIFNlbGVjdG9yIGZvciB0aGUgYnV0dG9uIGRyb3Bkb3duIGVsZW1lbnQgKGRpdikuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLiR0YXJnZXRdIChvcHRpb25hbCkgU2VsZWN0b3IgZm9yIHRoZSB0YXJnZXQgZWxlbWVudCBvZiB0aGUgbWFwcGluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5ldmVudCBUaGUgbmFtZSBvZiB0aGUgZXZlbnQuIFRoZSBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBvbiBzb3VyY2UgYW5kXG4gICAgICogZGVzdGluYXRpb24gZWxlbWVudCAoZS5nLiBcImNsaWNrXCIsIFwibW91c2VsZWF2ZVwiKS5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbb3B0aW9ucy5jYWxsYmFja10gKG9wdGlvbmFsKSBGdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IG9mIHRoZVxuICAgICAqIGRlc3RpbmF0aW9uIGVsZW1lbnQgaXMgdHJpZ2dlcmVkLiBPVkVSV1JJVEVTIFRIRSBBQ1RVQUwgRVZFTlQgRk9SIFRIRSAgREVTVElOQVRJT04gRUxFTUVOVC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgKG9wdGlvbmFsKSBQcm92aWRlIGFuIGFjdGlvbiB0aXRsZSBmb3IgdGhlIGRyb3Bkb3duIGlmIG5vICR0YXJnZXQgd2FzIGRlZmluZWQuXG4gICAgICovXG4gICAgZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgX2JpbmRFdmVudChvcHRpb25zKTtcbiAgICB9O1xuXG59KShqc2UubGlicy5hY3Rpb25fbWFwcGVyKTtcbiJdfQ==
