'use strict';

/* --------------------------------------------------------------
 static_seo_urls_details.js 2018-10-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Controller Module For Static Seo Url Edit Form
 *
 * Handles the static seo url details form operations.
 */
gx.controllers.module('static_seo_urls_details', ['modal', 'loading_spinner'], function (data) {

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
     * Master data panel selector.
     *
     * @type {jQuery}
     */
    var $masterDataPanel = $this.find('.panel.master-data');

    /**
     * Static seo url panel containers (each language holds a container, that contains the static seo url panels).
     *
     * @type {jQuery}
     */
    var $tabContents = $this.find('.tab-pane');

    /**
     * Spinner Selector
     *
     * @type {jQuery}
     */
    var $spinner = null;

    /**
     * Do a refresh instead of redirecting?
     *
     * @type {Boolean}
     */
    var doRefresh = false;

    /**
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {};

    /**
     * Final Options
     *
     * @type {Object}
     */
    var options = $.extend(true, {}, defaults, data);

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
     * Handles the form submit event.
     *
     * @param {jQuery.Event} event Triggered event.
     * @param {Object} data Event data.
     */
    function _onFormSubmit(event, data) {
        // Prevent the submit of the form.
        event.preventDefault();

        // Check refresh parameter.
        if (data && data.refresh) {
            doRefresh = true;
        }

        // Show loading spinner.
        $spinner = jse.libs.loading_spinner.show($this);

        // Upload files.
        _performSubmit().then(function () {
            return jse.libs.loading_spinner.hide($spinner);
        });
    }

    /**
     * Shows the submit error message modal.
     */
    function _showFailMessage() {
        // Message texts.
        var errorTitle = jse.core.lang.translate('FORM_SUBMIT_ERROR_MODAL_TITLE', 'static_seo_urls');
        var errorMessage = jse.core.lang.translate('FORM_SUBMIT_ERROR_MODAL_TEXT', 'static_seo_urls');

        // Show modal.
        jse.libs.modal.showMessage(errorTitle, errorMessage);

        // Hide loading spinner.
        if ($spinner) {
            jse.libs.loading_spinner.hide($spinner);
        }
    }

    /**
     * Performs the form submit AJAX request.
     *
     * @return {jQuery.jqXHR} jQuery XHR object.
     */
    function _performSubmit() {
        return $.ajax({
            method: 'POST',
            url: $this.attr('action'),
            data: _getFormData(),
            dataType: 'json'
        }).done(function (response) {
            // URL to redirect to.
            var url = doRefresh ? 'admin.php?do=StaticSeoUrl/details&id=' + response.id : options.redirectUrl;

            // Prevent that the page unload prompt is displayed on save action.
            window.onbeforeunload = null;

            // Open overview page.
            window.open(url, '_self');
        }, 'json').fail(_showFailMessage);
    }

    /**
     * Returns the gathered form data.
     *
     * @return {Object} Form data.
     */
    function _getFormData() {
        // Form data object.
        var data = {
            id: $this.data('id')
        };

        // Extend form data object with all necessary properties.
        return $.extend(true, data, _getMasterData(), _getStaticSeoUrlContentsData());
    }

    /**
     * Returns the static_seo_url's master data.
     *
     * @return {Object} Static seo urls master data.
     */
    function _getMasterData() {
        var name = $masterDataPanel.find('input[name="name"]').val();

        var sitemapEntry = $masterDataPanel.find('input[name="sitemap_entry"]').is(":checked");

        var changefreq = $masterDataPanel.find('select[name="changefreq"]').val();

        var priority = $masterDataPanel.find('select[name="priority"]').val();

        var robotsEntry = $masterDataPanel.find('input[name="robots_disallow_entry"]').is(":checked");

        var ogImage = $masterDataPanel.find('input[name="opengraph_image"]').val();

        var ogImageDelete = $masterDataPanel.find('input[name="del_og_image"]').is(':checked');

        return { name: name, sitemapEntry: sitemapEntry, changefreq: changefreq, priority: priority, robotsEntry: robotsEntry, ogImage: ogImage, ogImageDelete: ogImageDelete };
    }

    /**
     * Returns the static seo url contents data by iterating over the tab content elements
     * which represent a container for each language.
     *
     * The returned object contains a property for each language.
     * The key is the language code and the value is an array containing
     * all contents information as collection.
     *
     * Example output:
     * {
     *   de: [{
     *     id: 1,
     *     title: 'Welcome...',
     *     ...
     *   }]
     * }
     *
     * @return {Object} Static seo url contents data.
     */
    function _getStaticSeoUrlContentsData() {
        // Static seo url data object.
        var staticSeoUrlContents = {};

        // Iterate over each content panel container.
        $tabContents.each(function (index, element) {
            // Static seo url panel container element.
            var $staticSeoUrlContentPanelContainer = $(element);

            // Static seo url panel elements.
            var $staticSeoUrlContentPanels = $staticSeoUrlContentPanelContainer.find('.panel');

            // Get static seo url panel container language code.
            var languageCode = $staticSeoUrlContentPanelContainer.data('language');

            // Add property to static seo url contents data object,
            // which contains the language code as key and the static seo url contents data as value.
            staticSeoUrlContents[languageCode] = $.map($staticSeoUrlContentPanels, function (element) {
                return _getStaticSeoUrlContentData(element);
            });
        });

        return { staticSeoUrlContents: staticSeoUrlContents };
    }

    /**
     * Returns the data for a static seo url.
     *
     * @param {HTMLElement} staticSeoUrlContentPanel Static seo url content panel element.
     *
     * @return {Object} Static seo url data.
     */
    function _getStaticSeoUrlContentData(staticSeoUrlContentPanel) {
        var $element = $(staticSeoUrlContentPanel);
        return {
            id: $element.data('id'),
            title: $element.find('input[name="title"]').val(),
            description: $element.find('textarea[name="description"]').val(),
            keywords: $element.find('textarea[name="keywords"]').val()
        };
    }

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Listen to form submit event.
        $this.on('submit', _onFormSubmit);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRpY19zZW9fdXJscy9zdGF0aWNfc2VvX3VybHNfZGV0YWlscy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRtYXN0ZXJEYXRhUGFuZWwiLCJmaW5kIiwiJHRhYkNvbnRlbnRzIiwiJHNwaW5uZXIiLCJkb1JlZnJlc2giLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfb25Gb3JtU3VibWl0IiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInJlZnJlc2giLCJqc2UiLCJsaWJzIiwibG9hZGluZ19zcGlubmVyIiwic2hvdyIsIl9wZXJmb3JtU3VibWl0IiwidGhlbiIsImhpZGUiLCJfc2hvd0ZhaWxNZXNzYWdlIiwiZXJyb3JUaXRsZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiZXJyb3JNZXNzYWdlIiwibW9kYWwiLCJzaG93TWVzc2FnZSIsImFqYXgiLCJtZXRob2QiLCJ1cmwiLCJhdHRyIiwiX2dldEZvcm1EYXRhIiwiZGF0YVR5cGUiLCJkb25lIiwicmVzcG9uc2UiLCJpZCIsInJlZGlyZWN0VXJsIiwid2luZG93Iiwib25iZWZvcmV1bmxvYWQiLCJvcGVuIiwiZmFpbCIsIl9nZXRNYXN0ZXJEYXRhIiwiX2dldFN0YXRpY1Nlb1VybENvbnRlbnRzRGF0YSIsIm5hbWUiLCJ2YWwiLCJzaXRlbWFwRW50cnkiLCJpcyIsImNoYW5nZWZyZXEiLCJwcmlvcml0eSIsInJvYm90c0VudHJ5Iiwib2dJbWFnZSIsIm9nSW1hZ2VEZWxldGUiLCJzdGF0aWNTZW9VcmxDb250ZW50cyIsImVhY2giLCJpbmRleCIsImVsZW1lbnQiLCIkc3RhdGljU2VvVXJsQ29udGVudFBhbmVsQ29udGFpbmVyIiwiJHN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbHMiLCJsYW5ndWFnZUNvZGUiLCJtYXAiLCJfZ2V0U3RhdGljU2VvVXJsQ29udGVudERhdGEiLCJzdGF0aWNTZW9VcmxDb250ZW50UGFu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bkMsQ0FBd0MsUUFBeEMsQ0FBbkM7O0FBRUE7QUFDQSxnQkFBTXlELGVBQWVGLG1DQUFtQzNELElBQW5DLENBQXdDLFVBQXhDLENBQXJCOztBQUVBO0FBQ0E7QUFDQXVELGlDQUFxQk0sWUFBckIsSUFDSTNELEVBQUU0RCxHQUFGLENBQU1GLDBCQUFOLEVBQWtDO0FBQUEsdUJBQVdHLDRCQUE0QkwsT0FBNUIsQ0FBWDtBQUFBLGFBQWxDLENBREo7QUFFSCxTQWREOztBQWdCQSxlQUFPLEVBQUNILDBDQUFELEVBQVA7QUFDSDs7QUFFRDs7Ozs7OztBQU9BLGFBQVNRLDJCQUFULENBQXFDQyx3QkFBckMsRUFBK0Q7QUFDM0QsWUFBTUMsV0FBVy9ELEVBQUU4RCx3QkFBRixDQUFqQjtBQUNBLGVBQU87QUFDSDFCLGdCQUFJMkIsU0FBU2pFLElBQVQsQ0FBYyxJQUFkLENBREQ7QUFFSGtFLG1CQUFPRCxTQUFTN0QsSUFBVCxDQUFjLHFCQUFkLEVBQXFDMkMsR0FBckMsRUFGSjtBQUdIb0IseUJBQWFGLFNBQVM3RCxJQUFULENBQWMsOEJBQWQsRUFBOEMyQyxHQUE5QyxFQUhWO0FBSUhxQixzQkFBVUgsU0FBUzdELElBQVQsQ0FBYywyQkFBZCxFQUEyQzJDLEdBQTNDO0FBSlAsU0FBUDtBQU1IOztBQUVEO0FBQ0E7QUFDQTs7QUFFQWhELFdBQU9zRSxJQUFQLEdBQWMsZ0JBQVE7QUFDbEI7QUFDQXBFLGNBQU1xRSxFQUFOLENBQVMsUUFBVCxFQUFtQjNELGFBQW5COztBQUVBO0FBQ0F5QjtBQUNILEtBTkQ7O0FBUUEsV0FBT3JDLE1BQVA7QUFDSCxDQTFRTCIsImZpbGUiOiJzdGF0aWNfc2VvX3VybHMvc3RhdGljX3Nlb191cmxzX2RldGFpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHN0YXRpY19zZW9fdXJsc19kZXRhaWxzLmpzIDIwMTgtMTAtMjRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIENvbnRyb2xsZXIgTW9kdWxlIEZvciBTdGF0aWMgU2VvIFVybCBFZGl0IEZvcm1cbiAqXG4gKiBIYW5kbGVzIHRoZSBzdGF0aWMgc2VvIHVybCBkZXRhaWxzIGZvcm0gb3BlcmF0aW9ucy5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzdGF0aWNfc2VvX3VybHNfZGV0YWlscycsXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1hc3RlciBkYXRhIHBhbmVsIHNlbGVjdG9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJG1hc3RlckRhdGFQYW5lbCA9ICR0aGlzLmZpbmQoJy5wYW5lbC5tYXN0ZXItZGF0YScpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTdGF0aWMgc2VvIHVybCBwYW5lbCBjb250YWluZXJzIChlYWNoIGxhbmd1YWdlIGhvbGRzIGEgY29udGFpbmVyLCB0aGF0IGNvbnRhaW5zIHRoZSBzdGF0aWMgc2VvIHVybCBwYW5lbHMpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRhYkNvbnRlbnRzID0gJHRoaXMuZmluZCgnLnRhYi1wYW5lJyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwaW5uZXIgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGxldCAkc3Bpbm5lciA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERvIGEgcmVmcmVzaCBpbnN0ZWFkIG9mIHJlZGlyZWN0aW5nP1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBkb1JlZnJlc2ggPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgZm9ybSBzdWJtaXQgZXZlbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZXZlbnQuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEV2ZW50IGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25Gb3JtU3VibWl0KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICAvLyBQcmV2ZW50IHRoZSBzdWJtaXQgb2YgdGhlIGZvcm0uXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayByZWZyZXNoIHBhcmFtZXRlci5cbiAgICAgICAgICAgIGlmIChkYXRhICYmIGRhdGEucmVmcmVzaCkge1xuICAgICAgICAgICAgICAgIGRvUmVmcmVzaCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgbG9hZGluZyBzcGlubmVyLlxuICAgICAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcyk7XG5cbiAgICAgICAgICAgIC8vIFVwbG9hZCBmaWxlcy5cbiAgICAgICAgICAgIF9wZXJmb3JtU3VibWl0KClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3dzIHRoZSBzdWJtaXQgZXJyb3IgbWVzc2FnZSBtb2RhbC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93RmFpbE1lc3NhZ2UoKSB7XG4gICAgICAgICAgICAvLyBNZXNzYWdlIHRleHRzLlxuICAgICAgICAgICAgY29uc3QgZXJyb3JUaXRsZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdGT1JNX1NVQk1JVF9FUlJPUl9NT0RBTF9USVRMRScsICdzdGF0aWNfc2VvX3VybHMnKTtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdGT1JNX1NVQk1JVF9FUlJPUl9NT0RBTF9URVhUJywgJ3N0YXRpY19zZW9fdXJscycpO1xuXG4gICAgICAgICAgICAvLyBTaG93IG1vZGFsLlxuICAgICAgICAgICAganNlLmxpYnMubW9kYWwuc2hvd01lc3NhZ2UoZXJyb3JUaXRsZSwgZXJyb3JNZXNzYWdlKTtcblxuICAgICAgICAgICAgLy8gSGlkZSBsb2FkaW5nIHNwaW5uZXIuXG4gICAgICAgICAgICBpZiAoJHNwaW5uZXIpIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQZXJmb3JtcyB0aGUgZm9ybSBzdWJtaXQgQUpBWCByZXF1ZXN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnkuanFYSFJ9IGpRdWVyeSBYSFIgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX3BlcmZvcm1TdWJtaXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICR0aGlzLmF0dHIoJ2FjdGlvbicpLFxuICAgICAgICAgICAgICAgIGRhdGE6IF9nZXRGb3JtRGF0YSgpLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBVUkwgdG8gcmVkaXJlY3QgdG8uXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGRvUmVmcmVzaCA/IGBhZG1pbi5waHA/ZG89U3RhdGljU2VvVXJsL2RldGFpbHMmaWQ9JHtyZXNwb25zZS5pZH1gIDogb3B0aW9ucy5yZWRpcmVjdFVybDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IHRoYXQgdGhlIHBhZ2UgdW5sb2FkIHByb21wdCBpcyBkaXNwbGF5ZWQgb24gc2F2ZSBhY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gT3BlbiBvdmVydmlldyBwYWdlLlxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfc2VsZicpO1xuICAgICAgICAgICAgICAgIH0sICdqc29uJylcbiAgICAgICAgICAgICAgICAuZmFpbChfc2hvd0ZhaWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGdhdGhlcmVkIGZvcm0gZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBGb3JtIGRhdGEuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0Rm9ybURhdGEoKSB7XG4gICAgICAgICAgICAvLyBGb3JtIGRhdGEgb2JqZWN0LlxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBpZDogJHRoaXMuZGF0YSgnaWQnKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gRXh0ZW5kIGZvcm0gZGF0YSBvYmplY3Qgd2l0aCBhbGwgbmVjZXNzYXJ5IHByb3BlcnRpZXMuXG4gICAgICAgICAgICByZXR1cm4gJC5leHRlbmQodHJ1ZSwgZGF0YSwgX2dldE1hc3RlckRhdGEoKSwgX2dldFN0YXRpY1Nlb1VybENvbnRlbnRzRGF0YSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzdGF0aWNfc2VvX3VybCdzIG1hc3RlciBkYXRhLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFN0YXRpYyBzZW8gdXJscyBtYXN0ZXIgZGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRNYXN0ZXJEYXRhKCkge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICRtYXN0ZXJEYXRhUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1cIm5hbWVcIl0nKVxuICAgICAgICAgICAgICAgIC52YWwoKTtcblxuICAgICAgICAgICAgY29uc3Qgc2l0ZW1hcEVudHJ5ID0gJG1hc3RlckRhdGFQYW5lbFxuICAgICAgICAgICAgICAgIC5maW5kKCdpbnB1dFtuYW1lPVwic2l0ZW1hcF9lbnRyeVwiXScpXG4gICAgICAgICAgICAgICAgLmlzKFwiOmNoZWNrZWRcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZWZyZXEgPSAkbWFzdGVyRGF0YVBhbmVsXG4gICAgICAgICAgICAgICAgLmZpbmQoJ3NlbGVjdFtuYW1lPVwiY2hhbmdlZnJlcVwiXScpXG4gICAgICAgICAgICAgICAgLnZhbCgpO1xuXG4gICAgICAgICAgICBjb25zdCBwcmlvcml0eSA9ICRtYXN0ZXJEYXRhUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZCgnc2VsZWN0W25hbWU9XCJwcmlvcml0eVwiXScpXG4gICAgICAgICAgICAgICAgLnZhbCgpO1xuXG4gICAgICAgICAgICBjb25zdCByb2JvdHNFbnRyeSA9ICRtYXN0ZXJEYXRhUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1cInJvYm90c19kaXNhbGxvd19lbnRyeVwiXScpXG4gICAgICAgICAgICAgICAgLmlzKFwiOmNoZWNrZWRcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IG9nSW1hZ2UgPSAkbWFzdGVyRGF0YVBhbmVsXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2lucHV0W25hbWU9XCJvcGVuZ3JhcGhfaW1hZ2VcIl0nKVxuICAgICAgICAgICAgICAgIC52YWwoKTtcblxuICAgICAgICAgICAgY29uc3Qgb2dJbWFnZURlbGV0ZSA9ICRtYXN0ZXJEYXRhUGFuZWxcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXRbbmFtZT1cImRlbF9vZ19pbWFnZVwiXScpXG4gICAgICAgICAgICAgICAgLmlzKCc6Y2hlY2tlZCcpO1xuXG4gICAgICAgICAgICByZXR1cm4ge25hbWUsIHNpdGVtYXBFbnRyeSwgY2hhbmdlZnJlcSwgcHJpb3JpdHksIHJvYm90c0VudHJ5LCBvZ0ltYWdlLCBvZ0ltYWdlRGVsZXRlfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzdGF0aWMgc2VvIHVybCBjb250ZW50cyBkYXRhIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZSB0YWIgY29udGVudCBlbGVtZW50c1xuICAgICAgICAgKiB3aGljaCByZXByZXNlbnQgYSBjb250YWluZXIgZm9yIGVhY2ggbGFuZ3VhZ2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIFRoZSByZXR1cm5lZCBvYmplY3QgY29udGFpbnMgYSBwcm9wZXJ0eSBmb3IgZWFjaCBsYW5ndWFnZS5cbiAgICAgICAgICogVGhlIGtleSBpcyB0aGUgbGFuZ3VhZ2UgY29kZSBhbmQgdGhlIHZhbHVlIGlzIGFuIGFycmF5IGNvbnRhaW5pbmdcbiAgICAgICAgICogYWxsIGNvbnRlbnRzIGluZm9ybWF0aW9uIGFzIGNvbGxlY3Rpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEV4YW1wbGUgb3V0cHV0OlxuICAgICAgICAgKiB7XG4gICAgICAgICAqICAgZGU6IFt7XG4gICAgICAgICAqICAgICBpZDogMSxcbiAgICAgICAgICogICAgIHRpdGxlOiAnV2VsY29tZS4uLicsXG4gICAgICAgICAqICAgICAuLi5cbiAgICAgICAgICogICB9XVxuICAgICAgICAgKiB9XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gU3RhdGljIHNlbyB1cmwgY29udGVudHMgZGF0YS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRTdGF0aWNTZW9VcmxDb250ZW50c0RhdGEoKSB7XG4gICAgICAgICAgICAvLyBTdGF0aWMgc2VvIHVybCBkYXRhIG9iamVjdC5cbiAgICAgICAgICAgIGNvbnN0IHN0YXRpY1Nlb1VybENvbnRlbnRzID0ge307XG5cbiAgICAgICAgICAgIC8vIEl0ZXJhdGUgb3ZlciBlYWNoIGNvbnRlbnQgcGFuZWwgY29udGFpbmVyLlxuICAgICAgICAgICAgJHRhYkNvbnRlbnRzLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gU3RhdGljIHNlbyB1cmwgcGFuZWwgY29udGFpbmVyIGVsZW1lbnQuXG4gICAgICAgICAgICAgICAgY29uc3QgJHN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbENvbnRhaW5lciA9ICQoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdGF0aWMgc2VvIHVybCBwYW5lbCBlbGVtZW50cy5cbiAgICAgICAgICAgICAgICBjb25zdCAkc3RhdGljU2VvVXJsQ29udGVudFBhbmVscyA9ICRzdGF0aWNTZW9VcmxDb250ZW50UGFuZWxDb250YWluZXIuZmluZCgnLnBhbmVsJyk7XG5cbiAgICAgICAgICAgICAgICAvLyBHZXQgc3RhdGljIHNlbyB1cmwgcGFuZWwgY29udGFpbmVyIGxhbmd1YWdlIGNvZGUuXG4gICAgICAgICAgICAgICAgY29uc3QgbGFuZ3VhZ2VDb2RlID0gJHN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbENvbnRhaW5lci5kYXRhKCdsYW5ndWFnZScpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWRkIHByb3BlcnR5IHRvIHN0YXRpYyBzZW8gdXJsIGNvbnRlbnRzIGRhdGEgb2JqZWN0LFxuICAgICAgICAgICAgICAgIC8vIHdoaWNoIGNvbnRhaW5zIHRoZSBsYW5ndWFnZSBjb2RlIGFzIGtleSBhbmQgdGhlIHN0YXRpYyBzZW8gdXJsIGNvbnRlbnRzIGRhdGEgYXMgdmFsdWUuXG4gICAgICAgICAgICAgICAgc3RhdGljU2VvVXJsQ29udGVudHNbbGFuZ3VhZ2VDb2RlXSA9XG4gICAgICAgICAgICAgICAgICAgICQubWFwKCRzdGF0aWNTZW9VcmxDb250ZW50UGFuZWxzLCBlbGVtZW50ID0+IF9nZXRTdGF0aWNTZW9VcmxDb250ZW50RGF0YShlbGVtZW50KSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtzdGF0aWNTZW9VcmxDb250ZW50c307XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZGF0YSBmb3IgYSBzdGF0aWMgc2VvIHVybC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhdGljU2VvVXJsQ29udGVudFBhbmVsIFN0YXRpYyBzZW8gdXJsIGNvbnRlbnQgcGFuZWwgZWxlbWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBTdGF0aWMgc2VvIHVybCBkYXRhLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2dldFN0YXRpY1Nlb1VybENvbnRlbnREYXRhKHN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbCkge1xuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKHN0YXRpY1Nlb1VybENvbnRlbnRQYW5lbCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGlkOiAkZWxlbWVudC5kYXRhKCdpZCcpLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAkZWxlbWVudC5maW5kKCdpbnB1dFtuYW1lPVwidGl0bGVcIl0nKS52YWwoKSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJGVsZW1lbnQuZmluZCgndGV4dGFyZWFbbmFtZT1cImRlc2NyaXB0aW9uXCJdJykudmFsKCksXG4gICAgICAgICAgICAgICAga2V5d29yZHM6ICRlbGVtZW50LmZpbmQoJ3RleHRhcmVhW25hbWU9XCJrZXl3b3Jkc1wiXScpLnZhbCgpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgLy8gTGlzdGVuIHRvIGZvcm0gc3VibWl0IGV2ZW50LlxuICAgICAgICAgICAgJHRoaXMub24oJ3N1Ym1pdCcsIF9vbkZvcm1TdWJtaXQpO1xuXG4gICAgICAgICAgICAvLyBGaW5pc2ggaW5pdGlhbGl6YXRpb24uXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pXG47XG4iXX0=
