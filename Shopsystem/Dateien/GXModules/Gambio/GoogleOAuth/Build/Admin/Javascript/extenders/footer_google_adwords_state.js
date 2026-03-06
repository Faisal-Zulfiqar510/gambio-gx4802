'use strict';

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
        };
    }

    /**
     * Creates Google Adwords footer badge for legacy pages.
     *
     * @param {Object} options Contains the extender options.
     *
     * @return {HTMLElement} Returns the badge element.
     */
    function createLegacyBadge(options) {
        var style = ['padding: 6px', 'margin-top: -4px', 'margin-left: 42px', 'font-size: 11px', 'color: #fff', 'text-decoration: none'];

        var badge = document.createElement('a');
        badge.setAttribute('href', 'admin.php?do=GoogleOAuth');
        badge.setAttribute('style', style.join('; '));
        badge.className = 'badge ' + (options.isConnected ? 'connected badge-success' : 'disconnected badge-danger');

        var icon = document.createElement('i');
        icon.className = 'fa fa-google';
        badge.appendChild(icon);

        var text = document.createTextNode(' ' + options.text);
        badge.appendChild(text);

        var targetContainer = document.querySelector('.main-bottom-footer .version-info').parentNode;
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
        var style = ['padding: 6px', 'margin-top: -4px', 'font-size: 11px'];

        var badgeContainer = document.createElement('div');
        badgeContainer.setAttribute('style', 'min-width: 150px; display: inline-block;');
        badgeContainer.className = 'google-connection-state';

        var badge = document.createElement('a');
        badge.setAttribute('href', 'admin.php?do=GoogleOAuth');
        badge.setAttribute('style', style.join('; '));
        badge.className = 'label ' + (options.isConnected ? 'connected label-success' : 'disconnected label-danger');

        var icon = document.createElement('i');
        icon.className = 'fa fa-google';
        icon.style.marginLeft = '0';
        badge.appendChild(icon);

        var text = document.createTextNode(' ' + options.text);
        badge.appendChild(text);

        badgeContainer.appendChild(badge);

        var targetContainer = document.querySelector('#main-footer .info .version');

        targetContainer.appendChild(badgeContainer);

        var languageSelection = document.querySelector('#main-footer .info .language-selection');
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
        var options = parseDataOptions(script);

        setTimeout(function () {
            createBadge(options);
        }, 100);
    }

    var script = document.currentScript;

    if (document.readyState != 'loading') {
        initialize(script);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            return initialize(script);
        });
    }
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvZXh0ZW5kZXJzL2Zvb3Rlcl9nb29nbGVfYWR3b3Jkc19zdGF0ZS5qcyJdLCJuYW1lcyI6WyJwYXJzZURhdGFPcHRpb25zIiwic2NyaXB0IiwiaXNMZWdhY3kiLCJnZXRBdHRyaWJ1dGUiLCJpc0Nvbm5lY3RlZCIsInRleHQiLCJjcmVhdGVMZWdhY3lCYWRnZSIsIm9wdGlvbnMiLCJzdHlsZSIsImJhZGdlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0QXR0cmlidXRlIiwiam9pbiIsImNsYXNzTmFtZSIsImljb24iLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVRleHROb2RlIiwidGFyZ2V0Q29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsInBhcmVudE5vZGUiLCJtYXJnaW5SaWdodCIsImNyZWF0ZU1vZGVybkJhZGdlIiwiYmFkZ2VDb250YWluZXIiLCJtYXJnaW5MZWZ0IiwibGFuZ3VhZ2VTZWxlY3Rpb24iLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJjcmVhdGVCYWRnZSIsImluaXRpYWxpemUiLCJzZXRUaW1lb3V0IiwiY3VycmVudFNjcmlwdCIsInJlYWR5U3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7OztBQVlBLENBQUMsWUFBWTs7QUFFVDs7QUFFQTs7Ozs7Ozs7QUFPQSxhQUFTQSxnQkFBVCxDQUEwQkMsTUFBMUIsRUFBa0M7QUFDOUIsZUFBTztBQUNIQyxzQkFBVUQsT0FBT0UsWUFBUCxDQUFvQixrQkFBcEIsTUFBNEMsSUFEbkQ7QUFFSEMseUJBQWFILE9BQU9FLFlBQVAsQ0FBb0IsZ0JBQXBCLE1BQTBDLElBRnBEO0FBR0hFLGtCQUFNSixPQUFPRSxZQUFQLENBQW9CLFdBQXBCO0FBSEgsU0FBUDtBQUtIOztBQUVEOzs7Ozs7O0FBT0EsYUFBU0csaUJBQVQsQ0FBMkJDLE9BQTNCLEVBQW9DO0FBQ2hDLFlBQU1DLFFBQVEs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QVN1QixVQUFULENBQW9CN0IsTUFBcEIsRUFBNEI7QUFDeEIsWUFBTU0sVUFBVVAsaUJBQWlCQyxNQUFqQixDQUFoQjs7QUFFQThCLG1CQUFXLFlBQVk7QUFDbkJGLHdCQUFZdEIsT0FBWjtBQUNILFNBRkQsRUFFRyxHQUZIO0FBR0g7O0FBRUQsUUFBTU4sU0FBU1MsU0FBU3NCLGFBQXhCOztBQUVBLFFBQUl0QixTQUFTdUIsVUFBVCxJQUF1QixTQUEzQixFQUFzQztBQUNsQ0gsbUJBQVc3QixNQUFYO0FBQ0gsS0FGRCxNQUVPO0FBQ0hTLGlCQUFTd0IsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDO0FBQUEsbUJBQU1KLFdBQVc3QixNQUFYLENBQU47QUFBQSxTQUE5QztBQUNIO0FBRUosQ0F4SUQiLCJmaWxlIjoiQWRtaW4vSmF2YXNjcmlwdC9leHRlbmRlcnMvZm9vdGVyX2dvb2dsZV9hZHdvcmRzX3N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBmb290ZXJfZ29vZ2xlX2Fkd29yZHNfc3RhdGUuanMgMjAxOC0wNC0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTggR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogRm9vdGVyIEdvb2dsZSBBZHdvcmRzIFN0YXRlIEV4dGVuZGVyXG4gKlxuICogVGhpcyBtb2R1bGUgY3JlYXRlcyBhIEdvb2dsZSBBZHdvcmRzIHN0YXRlIGJhZGdlIGluIHRoZSBhZG1pbiBmb290ZXIgaW4gb3JkZXIgdG8gZGlzcGxheSB0aGUgY29ubmVjdGlvbiBzdGF0ZSBvZlxuICogSHViLlxuICpcbiAqIEFkZCBhIFwiZGF0YS1jb25uZWN0ZWRcIiBhdHRyaWJ1dGUgb24gdGhlIDxzY3JpcHQvPiB0YWcgaWYgdGhlcmUncyBhbiBhY3RpdmUgY29ubmVjdGlvbiB3aXRoIEdvb2dsZSBBZHdvcmRzLlxuICpcbiAqIEFkZCBhIFwiZGF0YS1sZWNhY3ktbW9kZVwiIGF0dHJpYnV0ZSBvbiB0aGUgPHNjcmlwdC8+IHRhZyB0byBlbmFibGUgY29tcGF0aWJpbGl0eSB3aXRoIG9sZGVyIHNob3AgcGFnZXMuXG4gKlxuICogQWRkIGEgXCJkYXRhLXRleHRcIiBhdHRyaWJ1dGUgb24gdGhlIDxzY3JpcHQvPiB0YWcgdG8gY2hhbmdlIHRoZSBkaXNwbGF5ZWQgdGV4dC5cbiAqL1xuKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIFBhcnNlIG9wdGlvbnMgZnJvbSBzY3JpcHQncyBkYXRhIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzY3JpcHQgRWxlbWVudCB0aGF0IGxvYWRlZCBjdXJyZW50IHNjcmlwdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3tpc0xlZ2FjeTogYm9vbGVhbiwgaXNDb25uZWN0ZWQ6IGJvb2xlYW4sIHRleHQ6IChzdHJpbmd8Kil9fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlRGF0YU9wdGlvbnMoc2NyaXB0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc0xlZ2FjeTogc2NyaXB0LmdldEF0dHJpYnV0ZSgnZGF0YS1sZWdhY3ktbW9kZScpICE9PSBudWxsLFxuICAgICAgICAgICAgaXNDb25uZWN0ZWQ6IHNjcmlwdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29ubmVjdGVkJykgIT09IG51bGwsXG4gICAgICAgICAgICB0ZXh0OiBzY3JpcHQuZ2V0QXR0cmlidXRlKCdkYXRhLXRleHQnKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBHb29nbGUgQWR3b3JkcyBmb290ZXIgYmFkZ2UgZm9yIGxlZ2FjeSBwYWdlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIENvbnRhaW5zIHRoZSBleHRlbmRlciBvcHRpb25zLlxuICAgICAqXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IFJldHVybnMgdGhlIGJhZGdlIGVsZW1lbnQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlTGVnYWN5QmFkZ2Uob3B0aW9ucykge1xuICAgICAgICBjb25zdCBzdHlsZSA9IFtcbiAgICAgICAgICAgICdwYWRkaW5nOiA2cHgnLFxuICAgICAgICAgICAgJ21hcmdpbi10b3A6IC00cHgnLFxuICAgICAgICAgICAgJ21hcmdpbi1sZWZ0OiA0MnB4JyxcbiAgICAgICAgICAgICdmb250LXNpemU6IDExcHgnLFxuICAgICAgICAgICAgJ2NvbG9yOiAjZmZmJyxcbiAgICAgICAgICAgICd0ZXh0LWRlY29yYXRpb246IG5vbmUnXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgYmFkZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGJhZGdlLnNldEF0dHJpYnV0ZSgnaHJlZicsICdhZG1pbi5waHA/ZG89R29vZ2xlT0F1dGgnKTtcbiAgICAgICAgYmFkZ2Uuc2V0QXR0cmlidXRlKCdzdHlsZScsIHN0eWxlLmpvaW4oJzsgJykpO1xuICAgICAgICBiYWRnZS5jbGFzc05hbWUgPSAnYmFkZ2UgJyArIChvcHRpb25zLmlzQ29ubmVjdGVkID8gJ2Nvbm5lY3RlZCBiYWRnZS1zdWNjZXNzJyA6ICdkaXNjb25uZWN0ZWQgYmFkZ2UtZGFuZ2VyJyk7XG5cbiAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcbiAgICAgICAgaWNvbi5jbGFzc05hbWUgPSAnZmEgZmEtZ29vZ2xlJztcbiAgICAgICAgYmFkZ2UuYXBwZW5kQ2hpbGQoaWNvbik7XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgJyArIG9wdGlvbnMudGV4dCk7XG4gICAgICAgIGJhZGdlLmFwcGVuZENoaWxkKHRleHQpO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWJvdHRvbS1mb290ZXIgLnZlcnNpb24taW5mbycpLnBhcmVudE5vZGU7XG4gICAgICAgIHRhcmdldENvbnRhaW5lci5zdHlsZS5tYXJnaW5SaWdodCA9ICcxMHB4JztcblxuICAgICAgICB0YXJnZXRDb250YWluZXIuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuXG4gICAgICAgIHJldHVybiBiYWRnZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIEdvb2dsZSBBZHdvcmRzIGZvb3RlciBiYWRnZSBmb3IgbW9kZXJuIHBhZ2VzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQ29udGFpbnMgdGhlIGV4dGVuZGVyIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gUmV0dXJucyB0aGUgYmFkZ2UgZWxlbWVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVNb2Rlcm5CYWRnZShvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gW1xuICAgICAgICAgICAgJ3BhZGRpbmc6IDZweCcsXG4gICAgICAgICAgICAnbWFyZ2luLXRvcDogLTRweCcsXG4gICAgICAgICAgICAnZm9udC1zaXplOiAxMXB4JyxcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCBiYWRnZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBiYWRnZUNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ21pbi13aWR0aDogMTUwcHg7IGRpc3BsYXk6IGlubGluZS1ibG9jazsnKTtcbiAgICAgICAgYmFkZ2VDb250YWluZXIuY2xhc3NOYW1lID0gJ2dvb2dsZS1jb25uZWN0aW9uLXN0YXRlJztcblxuICAgICAgICBjb25zdCBiYWRnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgICAgYmFkZ2Uuc2V0QXR0cmlidXRlKCdocmVmJywgJ2FkbWluLnBocD9kbz1Hb29nbGVPQXV0aCcpO1xuICAgICAgICBiYWRnZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgc3R5bGUuam9pbignOyAnKSk7XG4gICAgICAgIGJhZGdlLmNsYXNzTmFtZSA9ICdsYWJlbCAnICsgKG9wdGlvbnMuaXNDb25uZWN0ZWQgPyAnY29ubmVjdGVkIGxhYmVsLXN1Y2Nlc3MnIDogJ2Rpc2Nvbm5lY3RlZCBsYWJlbC1kYW5nZXInKTtcblxuICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xuICAgICAgICBpY29uLmNsYXNzTmFtZSA9ICdmYSBmYS1nb29nbGUnO1xuICAgICAgICBpY29uLnN0eWxlLm1hcmdpbkxlZnQgPSAnMCc7XG4gICAgICAgIGJhZGdlLmFwcGVuZENoaWxkKGljb24pO1xuXG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnICcgKyBvcHRpb25zLnRleHQpO1xuICAgICAgICBiYWRnZS5hcHBlbmRDaGlsZCh0ZXh0KTtcblxuICAgICAgICBiYWRnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChiYWRnZSk7XG5cbiAgICAgICAgbGV0IHRhcmdldENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluLWZvb3RlciAuaW5mbyAudmVyc2lvbicpO1xuXG4gICAgICAgIHRhcmdldENvbnRhaW5lci5hcHBlbmRDaGlsZChiYWRnZUNvbnRhaW5lcik7XG5cbiAgICAgICAgY29uc3QgbGFuZ3VhZ2VTZWxlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFpbi1mb290ZXIgLmluZm8gLmxhbmd1YWdlLXNlbGVjdGlvbicpO1xuICAgICAgICBsYW5ndWFnZVNlbGVjdGlvbi5zdHlsZS5tYXJnaW5MZWZ0ID0gJzMwcHgnO1xuXG4gICAgICAgIHRhcmdldENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdjb2wteHMtMScpO1xuICAgICAgICB0YXJnZXRDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnY29sLXhzLTQnKTtcblxuICAgICAgICByZXR1cm4gYmFkZ2VDb250YWluZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBHb29nbGUgQWR3b3JkcyBCYWRnZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQ29udGFpbnMgdGhlIGV4dGVuZGVyIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gUmV0dXJucyB0aGUgYmFkZ2UgZWxlbWVudC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVCYWRnZShvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmlzTGVnYWN5ID8gY3JlYXRlTGVnYWN5QmFkZ2Uob3B0aW9ucykgOiBjcmVhdGVNb2Rlcm5CYWRnZShvcHRpb25zKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIEdvb2dsZSBBZHdvcmRzIGZvb3RlciBiYWRnZSBleHRlbmRlci5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgY3JlYXRlIGEgYmFkZ2UgaW4gdGhlIGFkbWluIGZvb3RlciBzZWN0aW9uIHdoaWNoIGluZGljYXRlcyB0aGUgR29vZ2xlIEFkd29yZHMgY29ubmVjdGlvbiBzdGF0ZVxuICAgICAqIG9mIHRoZSBzaG9wLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGluaXRpYWxpemUoc2NyaXB0KSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBwYXJzZURhdGFPcHRpb25zKHNjcmlwdCk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjcmVhdGVCYWRnZShvcHRpb25zKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0O1xuXG4gICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2xvYWRpbmcnKSB7XG4gICAgICAgIGluaXRpYWxpemUoc2NyaXB0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4gaW5pdGlhbGl6ZShzY3JpcHQpKTtcbiAgICB9XG5cbn0pKCk7XG4iXX0=
