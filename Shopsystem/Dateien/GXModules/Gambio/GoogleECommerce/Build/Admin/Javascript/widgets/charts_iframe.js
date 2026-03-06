'use strict';

/* --------------------------------------------------------------
 google_connection_modal.js 2018-05-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx_google_analytics.widgets.module('charts_iframe', ['xhr'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Widget Reference
     *
     * @type {object}
     */

    var $this = $(this);

    /**
     * Default Options for Widget
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Widget Options
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {object}
     */
    var module = {};

    /**
     * CSS styles for manually rendered iframe.
     * @type {{width: string, border: string}}
     */
    var iFrameStyles = {
        width: '100%',
        border: 'none',
        minHeight: '1000px',
        height: '100%'
    };

    var $iframe = void 0;

    // ------------------------------------------------------------------------
    // CALLBACKS
    // ------------------------------------------------------------------------
    var _renderIFrame = function _renderIFrame(response) {
        $iframe = $('<iframe/>').on('load', function () {
            return _loaded(response.accessToken);
        }).css(iFrameStyles).attr('src', response.appUrl + '#analytics/charts?lang=' + response.lang);

        $this.parent().empty().append($iframe);

        // window.addEventListener('message', function(e) {
        // 	if (e.data.type === 'send_iframe_height') {
        // 		$iframe.css({
        // 			height: (Math.ceil(Number(e.data.height)) + 5) + '.px'
        // 		});
        // 	}
        // });
    };

    var _loaded = function _loaded(accessToken) {
        $iframe[0].contentWindow.postMessage({
            type: 'send_access_token',
            accessToken: accessToken
        }, '*');
        $iframe[0].contentWindow.postMessage({
            type: 'request_iframe_height'
        }, '*');
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        jse.libs.xhr.get({
            url: './admin.php?do=GoogleOAuthAjax/getAccessToken'
        }).done(_renderIFrame);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvd2lkZ2V0cy9jaGFydHNfaWZyYW1lLmpzIl0sIm5hbWVzIjpbImd4X2dvb2dsZV9hbmFseXRpY3MiLCJ3aWRnZXRzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImlGcmFtZVN0eWxlcyIsIndpZHRoIiwiYm9yZGVyIiwibWluSGVpZ2h0IiwiaGVpZ2h0IiwiJGlmcmFtZSIsIl9yZW5kZXJJRnJhbWUiLCJvbiIsIl9sb2FkZWQiLCJyZXNwb25zZSIsImFjY2Vzc1Rva2VuIiwiY3NzIiwiYXR0ciIsImFwcFVybCIsImxhbmciLCJwYXJlbnQiLCJlbXB0eSIsImFwcGVuZCIsImNvbnRlbnRXaW5kb3ciLCJwb3N0TWVzc2FnZSIsInR5cGUiLCJpbml0IiwiZG9uZSIsImpzZSIsImxpYnMiLCJ4aHIiLCJnZXQiLCJ1cmwiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsb0JBQW9CQyxPQUFwQixDQUE0QkMsTUFBNUIsQ0FDSSxlQURKLEVBR0ksQ0FBQyxLQUFELENBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVyxFQUFqQjs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxVQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQUFoQjs7QUFFQTs7Ozs7QUFLQSxRQUFNRCxTQUFTLEVBQWY7O0FBRUE7Ozs7QUFJQSxRQUFNTyxlQUFlO0FBQ2pCQyxlQUFPLE1BRFU7QUFFakJDLGdCQUFRLE1BRlM7QUFHakJDLG1CQUFXLFFBSE07QUFJakJDLGdCQUFRO0FBSlMsS0FBckI7O0FBUUEsUUFBSUMsZ0JBQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBTUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixXQUFZO0FBQzlCRCxrQkFBVVQsRUFBRSxXQUFGLEVBQ0xXLEVBREssQ0FDRixNQURFLEVBQ007QUFBQSxtQkFBTUMsUUFBUUMsU0FBU0MsV0FBakIsQ0FBTjtBQUFBLFNBRE4sRUFFTEMsR0FGSyxDQUVEWCxZQUZDLEVBR0xZLElBSEssQ0FHQSxLQUhBLEVBR09ILFNBQVNJLE1BQVQsR0FBa0IseUJBQWxCLEdBQThDSixTQUFTSyxJQUg5RCxDQUFWOztBQUtBbkIsY0FBTW9CLE1BQU4sR0FBZUMsS0FBZixHQUF1QkMsTUFBdkIsQ0FBOEJaLE9BQTlCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsS0FmRDs7QUFpQkEsUUFBTUcsVUFBVSxTQUFWQSxPQUFVLGNBQWU7QUFDM0JILGdCQUFRLENBQVIsRUFBV2EsYUFBWCxDQUF5QkMsV0FBekIsQ0FBcUM7QUFDakNDLGtCQUFNLG1CQUQyQjtBQUVqQ1Y7QUFGaUMsU0FBckMsRUFHRyxHQUhIO0FBSUFMLGdCQUFRLENBQVIsRUFBV2EsYUFBWCxDQUF5QkMsV0FBekIsQ0FBcUM7QUFDakNDLGtCQUFNO0FBRDJCLFNBQXJDLEVBRUcsR0FGSDtBQUdILEtBUkQ7O0FBVUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTNCLFdBQU80QixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQkMsWUFBSUMsSUFBSixDQUFTQyxHQUFULENBQWFDLEdBQWIsQ0FBaUI7QUFDYkMsaUJBQUs7QUFEUSxTQUFqQixFQUVHTCxJQUZILENBRVFoQixhQUZSOztBQUlBZ0I7QUFDSCxLQU5EOztBQVFBLFdBQU83QixNQUFQO0FBQ0gsQ0FyR0wiLCJmaWxlIjoiQWRtaW4vSmF2YXNjcmlwdC93aWRnZXRzL2NoYXJ0c19pZnJhbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGdvb2dsZV9jb25uZWN0aW9uX21vZGFsLmpzIDIwMTgtMDUtMjJcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neF9nb29nbGVfYW5hbHl0aWNzLndpZGdldHMubW9kdWxlKFxuICAgICdjaGFydHNfaWZyYW1lJyxcblxuICAgIFsneGhyJ10sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEUgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV2lkZ2V0IFJlZmVyZW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnMgZm9yIFdpZGdldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgV2lkZ2V0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ1NTIHN0eWxlcyBmb3IgbWFudWFsbHkgcmVuZGVyZWQgaWZyYW1lLlxuICAgICAgICAgKiBAdHlwZSB7e3dpZHRoOiBzdHJpbmcsIGJvcmRlcjogc3RyaW5nfX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGlGcmFtZVN0eWxlcyA9IHtcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgIG1pbkhlaWdodDogJzEwMDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgbGV0ICRpZnJhbWU7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIENBTExCQUNLU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgY29uc3QgX3JlbmRlcklGcmFtZSA9IHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICRpZnJhbWUgPSAkKCc8aWZyYW1lLz4nKVxuICAgICAgICAgICAgICAgIC5vbignbG9hZCcsICgpID0+IF9sb2FkZWQocmVzcG9uc2UuYWNjZXNzVG9rZW4pKVxuICAgICAgICAgICAgICAgIC5jc3MoaUZyYW1lU3R5bGVzKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdzcmMnLCByZXNwb25zZS5hcHBVcmwgKyAnI2FuYWx5dGljcy9jaGFydHM/bGFuZz0nICsgcmVzcG9uc2UubGFuZyk7XG5cbiAgICAgICAgICAgICR0aGlzLnBhcmVudCgpLmVtcHR5KCkuYXBwZW5kKCRpZnJhbWUpO1xuXG4gICAgICAgICAgICAvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIC8vIFx0aWYgKGUuZGF0YS50eXBlID09PSAnc2VuZF9pZnJhbWVfaGVpZ2h0Jykge1xuICAgICAgICAgICAgLy8gXHRcdCRpZnJhbWUuY3NzKHtcbiAgICAgICAgICAgIC8vIFx0XHRcdGhlaWdodDogKE1hdGguY2VpbChOdW1iZXIoZS5kYXRhLmhlaWdodCkpICsgNSkgKyAnLnB4J1xuICAgICAgICAgICAgLy8gXHRcdH0pO1xuICAgICAgICAgICAgLy8gXHR9XG4gICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfbG9hZGVkID0gYWNjZXNzVG9rZW4gPT4ge1xuICAgICAgICAgICAgJGlmcmFtZVswXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc2VuZF9hY2Nlc3NfdG9rZW4nLFxuICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuXG4gICAgICAgICAgICB9LCAnKicpO1xuICAgICAgICAgICAgJGlmcmFtZVswXS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncmVxdWVzdF9pZnJhbWVfaGVpZ2h0J1xuICAgICAgICAgICAgfSwgJyonKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgbWV0aG9kIG9mIHRoZSB3aWRnZXQsIGNhbGxlZCBieSB0aGUgZW5naW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnLi9hZG1pbi5waHA/ZG89R29vZ2xlT0F1dGhBamF4L2dldEFjY2Vzc1Rva2VuJ1xuICAgICAgICAgICAgfSkuZG9uZShfcmVuZGVySUZyYW1lKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
