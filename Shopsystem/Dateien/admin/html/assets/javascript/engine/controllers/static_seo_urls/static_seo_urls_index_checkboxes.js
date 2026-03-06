'use strict';

/* --------------------------------------------------------------
 static_seo_urls_index_checkboxes.js 2017-05-29
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Static Seo Urls Overview Start Page Option
 *
 * Handles the switchers toggling.
 */
gx.controllers.module('static_seo_urls_index_checkboxes', ['modal', gx.source + '/libs/info_box'], function () {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * CSS class names.
     *
     * @type {Object}
     */
    var classes = {
        switcher: 'switcher'
    };

    /**
     * Selector Strings
     *
     * @type {Object}
     */
    var selectors = {
        switcher: '.' + classes.switcher,
        switcherCheckbox: '.' + classes.switcher + ' :checkbox'
    };

    /**
     * URI map.
     *
     * @type {Object}
     */
    var uris = {
        activate: jse.core.config.get('appUrl') + '/admin/admin.php?do=StaticSeoUrlAjax/Activate',
        deactivate: jse.core.config.get('appUrl') + '/admin/admin.php?do=StaticSeoUrlAjax/Deactivate'
    };

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * Shows the submit error message modal.
     */
    function _showFailMessage() {
        // Message texts.
        var errorTitle = jse.core.lang.translate('STATIC_SEO_URL_CHECKBOX_ERROR_TITLE', 'static_seo_urls');
        var errorMessage = jse.core.lang.translate('STATIC_SEO_URL_CHECKBOX_ERROR_TEXT', 'static_seo_urls');

        // Show modal.
        jse.libs.modal.showMessage(errorTitle, errorMessage);
    }

    /**
     * Handles the switchers change events.
     *
     * @param {jQuery.Event} event Trigger event.
     */
    function _onSwitcherChange(event) {
        // Clicked element.
        var $target = $(event.target);

        // Clicked switcher element.
        var $clickedSwitcher = $target.hasClass(classes.switcher) ? $target : $target.parents(selectors.switcher);

        // Clicked static seo url ID.
        var staticSeoUrlId = $clickedSwitcher.parents('tr').data('static-seo-url-id');

        // Is staticPage set as start page static page?
        var isActive = !$clickedSwitcher.hasClass('checked');

        // Which field should be updated
        var fieldName = $target.attr('name');

        // Disable all switchers.
        _toggleSwitchers(false);

        // Activate or deactivate static seo url depending on the state.
        isActive ? _deactivate(staticSeoUrlId, $clickedSwitcher, fieldName) : _activate(staticSeoUrlId, $clickedSwitcher, fieldName);
    }

    /**
     * Deactivates the static seo url.
     *
     * @param {Number} staticSeoUrlId Static seo url ID.
     * @param {jQuery} $clickedSwitcher Clicked static seo url element.
     * @param {String} fieldName Field name to be deactivated.
     */
    function _deactivate(staticSeoUrlId, $clickedSwitcher, fieldName) {
        // Request options.
        var requestOptions = {
            type: 'POST',
            data: { staticSeoUrlId: staticSeoUrlId, fieldName: fieldName },
            url: uris.deactivate
        };

        // Handles the 'always' case by enabling the clicked static seo url.
        var handleAlways = function handleAlways() {
            return $clickedSwitcher.removeClass('disabled');
        };

        // Handles the 'done' case with the server response.
        var handleDone = function handleDone(response) {
            // Enable all switchers.
            _toggleSwitchers(true);

            // Notify user.
            _notify(response.includes('success'));
        };

        // Perform request.
        $.ajax(requestOptions).done(handleDone).fail(_showFailMessage).always(handleAlways);
    }

    /**
     * Activates the static seo url.
     *
     * @param {Number} staticSeoUrlId Static seo url ID.
     * @param {jQuery} $clickedSwitcher Clicked static seo url element.
     * @param {String} fieldName Field name to be activated.
     */
    function _activate(staticSeoUrlId, $clickedSwitcher, fieldName) {
        // Request options.
        var requestOptions = {
            type: 'POST',
            data: { staticSeoUrlId: staticSeoUrlId, fieldName: fieldName },
            url: uris.activate
        };

        // Handles the 'always' case by enabling the clicked static seo url.
        var handleAlways = function handleAlways() {
            return _toggleSwitchers(true);
        };

        // Handles the 'done' case with the server response.
        var handleDone = function handleDone(response) {
            // Clicked switcher's checkbox.
            var $checkbox = $clickedSwitcher.find(':checkbox');

            // Enable all switchers.
            _toggleSwitchers(true);

            // Check switcher.
            $checkbox.switcher('checked', true);

            // Notify user.
            _notify(response.includes('success'));
        };

        // Perform request.
        $.ajax(requestOptions).done(handleDone).fail(_showFailMessage).always(handleAlways);
    }

    /**
     * If the server response is successful, it removes any previous messages and
     * adds new success message to admin info box.
     *
     * Otherwise its shows an error message modal.
     *
     * @param {Boolean} isSuccessful Is the server response successful?
     */
    function _notify(isSuccessful) {
        if (isSuccessful) {
            jse.libs.info_box.addSuccessMessage();
        } else {
            jse.libs.modal.showMessage(jse.core.lang.translate('STATIC_SEO_URL_CHECKBOX_ERROR_TITLE', 'static_seo_urls'), jse.core.lang.translate('STATIC_SEO_URL_CHECKBOX_ERROR_TEXT', 'static_seo_urls'));
        }
    }

    /**
     * Enables or disables the switchers.
     *
     * @param {Boolean} doEnable Enable the switchers?
     */
    function _toggleSwitchers(doEnable) {
        $this.find(selectors.switcher)[(doEnable ? 'remove' : 'add') + 'Class']('disabled');
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to set start page event.
        $this.on('change', selectors.switcher, _onSwitcherChange);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpY19zZW9fdXJscy9zdGF0aWNfc2VvX3VybHNfaW5kZXhfY2hlY2tib3hlcy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiJHRoaXMiLCIkIiwiY2xhc3NlcyIsInN3aXRjaGVyIiwic2VsZWN0b3JzIiwic3dpdGNoZXJDaGVja2JveCIsInVyaXMiLCJhY3RpdmF0ZSIsImpzZSIsImNvcmUiLCJjb25maWciLCJnZXQiLCJkZWFjdGl2YXRlIiwiX3Nob3dGYWlsTWVzc2FnZSIsImVycm9yVGl0bGUiLCJsYW5nIiwidHJhbnNsYXRlIiwiZXJyb3JNZXNzYWdlIiwibGlicyIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJfb25Td2l0Y2hlckNoYW5nZSIsImV2ZW50IiwiJHRhcmdldCIsInRhcmdldCIsIiRjbGlja2VkU3dpdGNoZXIiLCJoYXNDbGFzcyIsInBhcmVudHMiLCJzdGF0aWNTZW9VcmxJZCIsImRhdGEiLCJpc0FjdGl2ZSIsImZpZWxkTmFtZSIsImF0dHIiLCJfdG9nZ2xlU3dpdGNoZXJzIiwiX2RlYWN0aXZhdGUiLCJfYWN0aXZhdGUiLCJyZXF1ZXN0T3B0aW9ucyIsInR5cGUiLCJ1cmwiLCJoYW5kbGVBbHdheXMiLCJyZW1vdmVDbGFzcyIsImhhbmRsZURvbmUiLCJfbm90aWZ5IiwicmVzcG9uc2UiLCJpbmNsdWRlcyIsImFqYXgiLCJkb25lIiwiZmFpbCIsImFsd2F5cyIsIiRjaGVja2JveCIsImZpbmQiLCJpc1N1Y2Nlc3NmdWwiLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiZG9FbmFibGUiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksa0NBREosRUFHSSxDQUNJLE9BREosRUFFT0YsR0FBR0csTUFGVixvQkFISixFQVFJLFlBQVk7O0FBRVI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFHQTs7Ozs7QUFLQSxRQUFNQyxVQUFVO0FBQ1pDLGtCQUFVO0FBREUsS0FBaEI7O0FBSUE7Ozs7O0FBS0EsUUFBTUMsWUFBWTtBQUNkRCx3QkFBY0QsUUFBUUMsUUFEUjtBQUVkRSxnQ0FBc0JILFFBQVFDLFFBQTlCO0FBRmMsS0FBbEI7O0FBTUE7Ozs7O0FBS0EsUUFBTUcsT0FBTztBQUNUQyxrQkFBYUMsSUFBSUMsSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixDQUFiLGtEQURTO0FBRVRDLG9CQUFlSixJQUFJQyxJQUFKLENBQVNDLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFFBQXBCLENBQWY7QUFGUyxLQUFiOztBQUtBOzs7OztBQUtBLFFBQU1iLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBLGFBQVNlLGdCQUFULEdBQTRCO0FBQ3hCO0FBQ0EsWUFBTUMsYUFBYU4sSUFBSUMsSUFBSixDQUFTTSxJQUFULENBQWNDLFNBQWQsQ0FBd0IscUNBQXhCLEVBQStELGlCQUEvRCxDQUFuQjtBQUNBLFlBQU1DLGVBQWVULElBQUlDLElBQUosQ0FBU00sSUFBVCxDQUFjQyxTQUFkLENBQXdCLG9DQUF4QixFQUE4RCxpQkFBOUQsQ0FBckI7O0FBRUE7QUFDQVIsWUFBSVUsSUFBSixDQUFTQyxLQUFULENBQWVDLFdBQWYsQ0FBMkJOLFVBQTNCLEVBQXVDRyxZQUF2QztBQUNIOztBQUVEOzs7OztBQUtBLGFBQVNJLGlCQUFULENBQTJCQyxLQUEzQixFQUFrQztBQUM5QjtBQUNBLFlBQU1DLFVBQVV0QixFQUFFcUIsTUFBTUUsTUFBUixDQUFoQjs7QUFFQTtBQUNBLFlBQU1DLG1CQUFtQkYsUUFBUUcsUUFBUixDQUFpQnhCLFFBQVFDLFFBQXpCLElBQXFDb0IsT0FBckMsR0FBK0NBLFFBQVFJLE9BQVIsQ0FBZ0J2QixVQUFVRCxRQUExQixDQUF4RTs7QUFFQTtBQUNBLFlBQU15QixpQkFBaUJILGlCQUFpQkUsT0FBakIsQ0FBeUIsSUFBekIsRUFBK0JFLElBQS9CLENBQW9DLG1CQUFwQyxDQUF2Qjs7QUFFQTtBQUNBLFlBQU1DLFdBQVcsQ0FBQ0wsaUJBQWlCQyxRQUFqQixDQUEwQixTQUExQixDQUFsQjs7QUFFQTtBQUNBLFlBQU1LLFlBQVlSLFFBQVFTLElBQVIsQ0FBYSxNQUFiLENBQWxCOztBQUVBO0FBQ0FDLHlCQUFpQixLQUFqQjs7QUFFQTtBQUNBSCxtQkFBV0ksWUFBWU4sY0FBWixFQUE0QkgsZ0JBQTVCLEVBQThDTSxTQUE5QyxDQUFYLEdBQXNFSSxVQUFVUCxjQUFWLEVBQTBCSCxnQkFBMUIsRUFBNENNLFNBQTVDLENBQXRFO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTRyxXQUFULENBQXFCTixjQUFyQixFQUFxQ0gsZ0JBQXJDLEVBQXVETSxTQUF2RCxFQUFrRTtBQUM5RDtBQUNBLFlBQU1LLGlCQUFpQjtBQUNuQkMsa0JBQU0sTUFEYTtBQUVuQlIsa0JBQU0sRUFBQ0QsOEJBQUQsRUFBaUJHLG9CQUFqQixFQUZhO0FBR25CTyxpQkFBS2hDLEtBQUtNO0FBSFMsU0FBdkI7O0FBTUE7QUFDQSxZQUFNMkIsZUFBZSxTQUFmQSxZQUFlO0FBQUEsbUJBQU1kLGlCQUFpQmUsV0FBakIsQ0FBNkIsVUFBN0IsQ0FBTjtBQUFBLFNBQXJCOztBQUVBO0FBQ0EsWUFBTUMsYUFBYSxTQUFiQSxVQUFhLFdBQVk7QUFDM0I7QUFDQVIsNkJBQWlCLElBQWpCOztBQUVBO0FBQ0FTLG9CQUFRQyxTQUFTQyxRQUFULENBQWtCLFNBQWxCLENBQVI7QUFDSCxTQU5EOztBQVFBO0FBQ0EzQyxVQUFFNEMsSUFBRixDQUFPVCxjQUFQLEVBQ0tVLElBREwsQ0FDVUwsVUFEVixFQUVLTSxJQUZMLENBRVVsQyxnQkFGVixFQUdLbUMsTUFITCxDQUdZVCxZQUhaO0FBSUg7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTSixTQUFULENBQW1CUCxjQUFuQixFQUFtQ0gsZ0JBQW5DLEVBQXFETSxTQUFyRCxFQUFnRTtBQUM1RDtBQUNBLFlBQU1LLGlCQUFpQjtBQUNuQkMsa0JBQU0sTUFEYTtBQUVuQlIsa0JBQU0sRUFBQ0QsOEJBQUQsRUFBaUJHLG9CQUFqQixFQUZhO0FBR25CTyxpQkFBS2hDLEtBQUtDO0FBSFMsU0FBdkI7O0FBTUE7QUFDQSxZQUFNZ0MsZUFBZSxTQUFmQSxZQUFlO0FBQUEsbUJBQU1OLGlCQUFpQixJQUFqQixDQUFOO0FBQUEsU0FBckI7O0FBRUE7QUFDQSxZQUFNUSxhQUFhLFNBQWJBLFVBQWEsV0FBWTtBQUMzQjtBQUNBLGdCQUFNUSxZQUFZeEIsaUJBQWlCeUIsSUFBakIsQ0FBc0IsV0FBdEIsQ0FBbEI7O0FBRUE7QUFDQWpCLDZCQUFpQixJQUFqQjs7QUFFQTtBQUNBZ0Isc0JBQVU5QyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCOztBQUVBO0FBQ0F1QyxvQkFBUUMsU0FBU0MsUUFBVCxDQUFrQixTQUFsQixDQUFSO0FBQ0gsU0FaRDs7QUFjQTtBQUNBM0MsVUFBRTRDLElBQUYsQ0FBT1QsY0FBUCxFQUNLVSxJQURMLENBQ1VMLFVBRFYsRUFFS00sSUFGTCxDQUVVbEMsZ0JBRlYsRUFHS21DLE1BSEwsQ0FHWVQsWUFIWjtBQUlIOztBQUVEOzs7Ozs7OztBQVFBLGFBQVNHLE9BQVQsQ0FBaUJTLFlBQWpCLEVBQStCO0FBQzNCLFlBQUlBLFlBQUosRUFBa0I7QUFDZDNDLGdCQUFJVSxJQUFKLENBQVNrQyxRQUFULENBQWtCQyxpQkFBbEI7QUFDSCxTQUZELE1BRU87QUFDSDdDLGdCQUFJVSxJQUFKLENBQVNDLEtBQVQsQ0FBZUMsV0FBZixDQUNJWixJQUFJQyxJQUFKLENBQVNNLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixxQ0FBeEIsRUFBK0QsaUJBQS9ELENBREosRUFFSVIsSUFBSUMsSUFBSixDQUFTTSxJQUFULENBQWNDLFNBQWQsQ0FBd0Isb0NBQXhCLEVBQThELGlCQUE5RCxDQUZKO0FBSUg7QUFDSjs7QUFFRDs7Ozs7QUFLQSxhQUFTaUIsZ0JBQVQsQ0FBMEJxQixRQUExQixFQUFvQztBQUNoQ3RELGNBQU1rRCxJQUFOLENBQVc5QyxVQUFVRCxRQUFyQixHQUFrQ21ELFdBQVcsUUFBWCxHQUFzQixLQUF4RCxhQUFzRSxVQUF0RTtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQXhELFdBQU95RCxJQUFQLEdBQWMsZ0JBQVE7QUFDbEI7QUFDQXZELGNBQU13RCxFQUFOLENBQVMsUUFBVCxFQUFtQnBELFVBQVVELFFBQTdCLEVBQXVDa0IsaUJBQXZDOztBQUVBO0FBQ0F5QjtBQUNILEtBTkQ7O0FBUUEsV0FBT2hELE1BQVA7QUFDSCxDQTVOTCIsImZpbGUiOiJzdGF0aWNfc2VvX3VybHMvc3RhdGljX3Nlb191cmxzX2luZGV4X2NoZWNrYm94ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHN0YXRpY19zZW9fdXJsc19pbmRleF9jaGVja2JveGVzLmpzIDIwMTctMDUtMjlcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFN0YXRpYyBTZW8gVXJscyBPdmVydmlldyBTdGFydCBQYWdlIE9wdGlvblxuICpcbiAqIEhhbmRsZXMgdGhlIHN3aXRjaGVycyB0b2dnbGluZy5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzdGF0aWNfc2VvX3VybHNfaW5kZXhfY2hlY2tib3hlcycsXG5cbiAgICBbXG4gICAgICAgICdtb2RhbCcsXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ1NTIGNsYXNzIG5hbWVzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAgICAgICAgIHN3aXRjaGVyOiAnc3dpdGNoZXInLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3RvciBTdHJpbmdzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBzZWxlY3RvcnMgPSB7XG4gICAgICAgICAgICBzd2l0Y2hlcjogYC4ke2NsYXNzZXMuc3dpdGNoZXJ9YCxcbiAgICAgICAgICAgIHN3aXRjaGVyQ2hlY2tib3g6IGAuJHtjbGFzc2VzLnN3aXRjaGVyfSA6Y2hlY2tib3hgLFxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVSSSBtYXAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCB1cmlzID0ge1xuICAgICAgICAgICAgYWN0aXZhdGU6IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9hZG1pbi5waHA/ZG89U3RhdGljU2VvVXJsQWpheC9BY3RpdmF0ZWAsXG4gICAgICAgICAgICBkZWFjdGl2YXRlOiBgJHtqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKX0vYWRtaW4vYWRtaW4ucGhwP2RvPVN0YXRpY1Nlb1VybEFqYXgvRGVhY3RpdmF0ZWAsXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIHRoZSBzdWJtaXQgZXJyb3IgbWVzc2FnZSBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RmFpbE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAvLyBNZXNzYWdlIHRleHRzLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JUaXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSUNfU0VPX1VSTF9DSEVDS0JPWF9FUlJPUl9USVRMRScsICdzdGF0aWNfc2VvX3VybHMnKTtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSUNfU0VPX1VSTF9DSEVDS0JPWF9FUlJPUl9URVhUJywgJ3N0YXRpY19zZW9fdXJscycpO1xuXG4gICAgICAgICAgICAvLyBTaG93IG1vZGFsLlxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoZXJyb3JUaXRsZSwgZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBzd2l0Y2hlcnMgY2hhbmdlIGV2ZW50cy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50IFRyaWdnZXIgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Td2l0Y2hlckNoYW5nZShldmVudCkge1xuICAgICAgICAgICAgLy8gQ2xpY2tlZCBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KTtcblxuICAgICAgICAgICAgLy8gQ2xpY2tlZCBzd2l0Y2hlciBlbGVtZW50LlxuICAgICAgICAgICAgY29uc3QgJGNsaWNrZWRTd2l0Y2hlciA9ICR0YXJnZXQuaGFzQ2xhc3MoY2xhc3Nlcy5zd2l0Y2hlcikgPyAkdGFyZ2V0IDogJHRhcmdldC5wYXJlbnRzKHNlbGVjdG9ycy5zd2l0Y2hlcik7XG5cbiAgICAgICAgICAgIC8vIENsaWNrZWQgc3RhdGljIHNlbyB1cmwgSUQuXG4gICAgICAgICAgICBjb25zdCBzdGF0aWNTZW9VcmxJZCA9ICRjbGlja2VkU3dpdGNoZXIucGFyZW50cygndHInKS5kYXRhKCdzdGF0aWMtc2VvLXVybC1pZCcpO1xuXG4gICAgICAgICAgICAvLyBJcyBzdGF0aWNQYWdlIHNldCBhcyBzdGFydCBwYWdlIHN0YXRpYyBwYWdlP1xuICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSAhJGNsaWNrZWRTd2l0Y2hlci5oYXNDbGFzcygnY2hlY2tlZCcpO1xuXG4gICAgICAgICAgICAvLyBXaGljaCBmaWVsZCBzaG91bGQgYmUgdXBkYXRlZFxuICAgICAgICAgICAgY29uc3QgZmllbGROYW1lID0gJHRhcmdldC5hdHRyKCduYW1lJyk7XG5cbiAgICAgICAgICAgIC8vIERpc2FibGUgYWxsIHN3aXRjaGVycy5cbiAgICAgICAgICAgIF90b2dnbGVTd2l0Y2hlcnMoZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBBY3RpdmF0ZSBvciBkZWFjdGl2YXRlIHN0YXRpYyBzZW8gdXJsIGRlcGVuZGluZyBvbiB0aGUgc3RhdGUuXG4gICAgICAgICAgICBpc0FjdGl2ZSA/IF9kZWFjdGl2YXRlKHN0YXRpY1Nlb1VybElkLCAkY2xpY2tlZFN3aXRjaGVyLCBmaWVsZE5hbWUpIDogX2FjdGl2YXRlKHN0YXRpY1Nlb1VybElkLCAkY2xpY2tlZFN3aXRjaGVyLCBmaWVsZE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlYWN0aXZhdGVzIHRoZSBzdGF0aWMgc2VvIHVybC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXRpY1Nlb1VybElkIFN0YXRpYyBzZW8gdXJsIElELlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGNsaWNrZWRTd2l0Y2hlciBDbGlja2VkIHN0YXRpYyBzZW8gdXJsIGVsZW1lbnQuXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZE5hbWUgRmllbGQgbmFtZSB0byBiZSBkZWFjdGl2YXRlZC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9kZWFjdGl2YXRlKHN0YXRpY1Nlb1VybElkLCAkY2xpY2tlZFN3aXRjaGVyLCBmaWVsZE5hbWUpIHtcbiAgICAgICAgICAgIC8vIFJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7c3RhdGljU2VvVXJsSWQsIGZpZWxkTmFtZX0sXG4gICAgICAgICAgICAgICAgdXJsOiB1cmlzLmRlYWN0aXZhdGUsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBIYW5kbGVzIHRoZSAnYWx3YXlzJyBjYXNlIGJ5IGVuYWJsaW5nIHRoZSBjbGlja2VkIHN0YXRpYyBzZW8gdXJsLlxuICAgICAgICAgICAgY29uc3QgaGFuZGxlQWx3YXlzID0gKCkgPT4gJGNsaWNrZWRTd2l0Y2hlci5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlcyB0aGUgJ2RvbmUnIGNhc2Ugd2l0aCB0aGUgc2VydmVyIHJlc3BvbnNlLlxuICAgICAgICAgICAgY29uc3QgaGFuZGxlRG9uZSA9IHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAvLyBFbmFibGUgYWxsIHN3aXRjaGVycy5cbiAgICAgICAgICAgICAgICBfdG9nZ2xlU3dpdGNoZXJzKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IHVzZXIuXG4gICAgICAgICAgICAgICAgX25vdGlmeShyZXNwb25zZS5pbmNsdWRlcygnc3VjY2VzcycpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFBlcmZvcm0gcmVxdWVzdC5cbiAgICAgICAgICAgICQuYWpheChyZXF1ZXN0T3B0aW9ucylcbiAgICAgICAgICAgICAgICAuZG9uZShoYW5kbGVEb25lKVxuICAgICAgICAgICAgICAgIC5mYWlsKF9zaG93RmFpbE1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgLmFsd2F5cyhoYW5kbGVBbHdheXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFjdGl2YXRlcyB0aGUgc3RhdGljIHNlbyB1cmwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGF0aWNTZW9VcmxJZCBTdGF0aWMgc2VvIHVybCBJRC5cbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICRjbGlja2VkU3dpdGNoZXIgQ2xpY2tlZCBzdGF0aWMgc2VvIHVybCBlbGVtZW50LlxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmllbGROYW1lIEZpZWxkIG5hbWUgdG8gYmUgYWN0aXZhdGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FjdGl2YXRlKHN0YXRpY1Nlb1VybElkLCAkY2xpY2tlZFN3aXRjaGVyLCBmaWVsZE5hbWUpIHtcbiAgICAgICAgICAgIC8vIFJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7c3RhdGljU2VvVXJsSWQsIGZpZWxkTmFtZX0sXG4gICAgICAgICAgICAgICAgdXJsOiB1cmlzLmFjdGl2YXRlLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlcyB0aGUgJ2Fsd2F5cycgY2FzZSBieSBlbmFibGluZyB0aGUgY2xpY2tlZCBzdGF0aWMgc2VvIHVybC5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZUFsd2F5cyA9ICgpID0+IF90b2dnbGVTd2l0Y2hlcnModHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZXMgdGhlICdkb25lJyBjYXNlIHdpdGggdGhlIHNlcnZlciByZXNwb25zZS5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZURvbmUgPSByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQ2xpY2tlZCBzd2l0Y2hlcidzIGNoZWNrYm94LlxuICAgICAgICAgICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICRjbGlja2VkU3dpdGNoZXIuZmluZCgnOmNoZWNrYm94Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBFbmFibGUgYWxsIHN3aXRjaGVycy5cbiAgICAgICAgICAgICAgICBfdG9nZ2xlU3dpdGNoZXJzKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgc3dpdGNoZXIuXG4gICAgICAgICAgICAgICAgJGNoZWNrYm94LnN3aXRjaGVyKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RpZnkgdXNlci5cbiAgICAgICAgICAgICAgICBfbm90aWZ5KHJlc3BvbnNlLmluY2x1ZGVzKCdzdWNjZXNzJykpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSByZXF1ZXN0LlxuICAgICAgICAgICAgJC5hamF4KHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgICAgICAgIC5kb25lKGhhbmRsZURvbmUpXG4gICAgICAgICAgICAgICAgLmZhaWwoX3Nob3dGYWlsTWVzc2FnZSlcbiAgICAgICAgICAgICAgICAuYWx3YXlzKGhhbmRsZUFsd2F5cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIHNlcnZlciByZXNwb25zZSBpcyBzdWNjZXNzZnVsLCBpdCByZW1vdmVzIGFueSBwcmV2aW91cyBtZXNzYWdlcyBhbmRcbiAgICAgICAgICogYWRkcyBuZXcgc3VjY2VzcyBtZXNzYWdlIHRvIGFkbWluIGluZm8gYm94LlxuICAgICAgICAgKlxuICAgICAgICAgKiBPdGhlcndpc2UgaXRzIHNob3dzIGFuIGVycm9yIG1lc3NhZ2UgbW9kYWwuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNTdWNjZXNzZnVsIElzIHRoZSBzZXJ2ZXIgcmVzcG9uc2Ugc3VjY2Vzc2Z1bD9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9ub3RpZnkoaXNTdWNjZXNzZnVsKSB7XG4gICAgICAgICAgICBpZiAoaXNTdWNjZXNzZnVsKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgICAgIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdTVEFUSUNfU0VPX1VSTF9DSEVDS0JPWF9FUlJPUl9USVRMRScsICdzdGF0aWNfc2VvX3VybHMnKSxcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NUQVRJQ19TRU9fVVJMX0NIRUNLQk9YX0VSUk9SX1RFWFQnLCAnc3RhdGljX3Nlb191cmxzJylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuYWJsZXMgb3IgZGlzYWJsZXMgdGhlIHN3aXRjaGVycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBkb0VuYWJsZSBFbmFibGUgdGhlIHN3aXRjaGVycz9cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF90b2dnbGVTd2l0Y2hlcnMoZG9FbmFibGUpIHtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoc2VsZWN0b3JzLnN3aXRjaGVyKVtgJHtkb0VuYWJsZSA/ICdyZW1vdmUnIDogJ2FkZCd9Q2xhc3NgXSgnZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBkb25lID0+IHtcbiAgICAgICAgICAgIC8vIExpc3RlbiB0byBzZXQgc3RhcnQgcGFnZSBldmVudC5cbiAgICAgICAgICAgICR0aGlzLm9uKCdjaGFuZ2UnLCBzZWxlY3RvcnMuc3dpdGNoZXIsIF9vblN3aXRjaGVyQ2hhbmdlKTtcblxuICAgICAgICAgICAgLy8gRmluaXNoIGluaXRpYWxpemF0aW9uLlxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfVxuKTtcbiJdfQ==
