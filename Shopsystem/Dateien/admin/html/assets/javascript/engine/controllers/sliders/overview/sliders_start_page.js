'use strict';

/* --------------------------------------------------------------
 sliders_start_page.js 2016-12-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Sliders Overview Start Page Option
 *
 * Handles the start page switcher toggling.
 */
gx.controllers.module('sliders_start_page', ['modal', gx.source + '/libs/info_box'], function () {

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
        activate: jse.core.config.get('appUrl') + '/admin/admin.php?do=SlidersOverviewAjax/SetStartPageSlider',
        deactivate: jse.core.config.get('appUrl') + '/admin/admin.php?do=SlidersOverviewAjax/DeactivateStartPageSlider'
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
     * Handles the slider start page switcher change event.
     *
     * @param {jQuery.Event} event Trigger event.
     */
    function _onSwitcherChange(event) {
        // Clicked element.
        var $target = $(event.target);

        // Clicked switcher element.
        var $clickedSwitcher = $target.hasClass(classes.switcher) ? $target : $target.parents(selectors.switcher);

        // Clicked slider ID.
        var sliderId = $clickedSwitcher.parents('tr').data('sliderId');

        // Is slider set as start page slider?
        var isActive = !$clickedSwitcher.hasClass('checked');

        // Disable all switchers.
        _toggleSwitchers(false);

        // Activate or deactivate slider depending on the state.
        isActive ? _deactivate(sliderId, $clickedSwitcher) : _activate(sliderId, $clickedSwitcher);
    }

    /**
     * Deactivates the slider.
     *
     * @param {Number} sliderId Slider ID.
     * @param {jQuery} $clickedSwitcher Clicked slider element.
     */
    function _deactivate(sliderId, $clickedSwitcher) {
        // Request options.
        var requestOptions = {
            type: 'POST',
            data: { sliderId: sliderId },
            url: uris.deactivate
        };

        // Handles the 'always' case by enabling the clicked slider.
        var handleAlways = function handleAlways() {
            return $clickedSwitcher.removeClass('disabled');
        };

        // Handles the 'done' case with the server response.
        var handleDone = function handleDone(response) {
            // Enable all switchers.
            _toggleSwitchers(true);

            // Deactivate each slider.
            $this.find(selectors.switcherCheckbox).each(function (index, checkbox) {
                return $(checkbox).switcher('checked', false);
            });

            // Notify user.
            _notify(response.includes('success'));
        };

        // Perform request.
        $.ajax(requestOptions).done(handleDone).always(handleAlways);
    }

    /**
     * Activates the slider.
     *
     * @param {Number} sliderId Slider ID.
     * @param {jQuery} $clickedSwitcher Clicked slider element.
     */
    function _activate(sliderId, $clickedSwitcher) {
        // Request options.
        var requestOptions = {
            type: 'POST',
            data: { sliderId: sliderId },
            url: uris.activate
        };

        // Handles the 'always' case by enabling the clicked slider.
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

            // Deactivate each slider, except the clicked one.
            $this.find(selectors.switcherCheckbox).not($checkbox).each(function (index, checkbox) {
                return $(checkbox).switcher('checked', false);
            });

            // Notify user.
            _notify(response.includes('success'));
        };

        // Perform request.
        $.ajax(requestOptions).done(handleDone).always(handleAlways);
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
            jse.libs.modal.showMessage(jse.core.lang.translate('SLIDER_START_PAGE_ERROR_TITLE', 'sliders'), jse.core.lang.translate('SLIDER_START_PAGE_ERROR_TEXT', 'sliders'));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNsaWRlcnMvb3ZlcnZpZXcvc2xpZGVyc19zdGFydF9wYWdlLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJzb3VyY2UiLCIkdGhpcyIsIiQiLCJjbGFzc2VzIiwic3dpdGNoZXIiLCJzZWxlY3RvcnMiLCJzd2l0Y2hlckNoZWNrYm94IiwidXJpcyIsImFjdGl2YXRlIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsImRlYWN0aXZhdGUiLCJfb25Td2l0Y2hlckNoYW5nZSIsImV2ZW50IiwiJHRhcmdldCIsInRhcmdldCIsIiRjbGlja2VkU3dpdGNoZXIiLCJoYXNDbGFzcyIsInBhcmVudHMiLCJzbGlkZXJJZCIsImRhdGEiLCJpc0FjdGl2ZSIsIl90b2dnbGVTd2l0Y2hlcnMiLCJfZGVhY3RpdmF0ZSIsIl9hY3RpdmF0ZSIsInJlcXVlc3RPcHRpb25zIiwidHlwZSIsInVybCIsImhhbmRsZUFsd2F5cyIsInJlbW92ZUNsYXNzIiwiaGFuZGxlRG9uZSIsImZpbmQiLCJlYWNoIiwiaW5kZXgiLCJjaGVja2JveCIsIl9ub3RpZnkiLCJyZXNwb25zZSIsImluY2x1ZGVzIiwiYWpheCIsImRvbmUiLCJhbHdheXMiLCIkY2hlY2tib3giLCJub3QiLCJpc1N1Y2Nlc3NmdWwiLCJsaWJzIiwiaW5mb19ib3giLCJhZGRTdWNjZXNzTWVzc2FnZSIsIm1vZGFsIiwic2hvd01lc3NhZ2UiLCJsYW5nIiwidHJhbnNsYXRlIiwiZG9FbmFibGUiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksb0JBREosRUFHSSxDQUNJLE9BREosRUFFT0YsR0FBR0csTUFGVixvQkFISixFQVFJLFlBQVk7O0FBRVI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFHQTs7Ozs7QUFLQSxRQUFN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QW1CbEQsVUFBVUQsUUFBN0IsRUFBdUNVLGlCQUF2Qzs7QUFFQTtBQUNBMkI7QUFDSCxLQU5EOztBQVFBLFdBQU8xQyxNQUFQO0FBQ0gsQ0FwTkwiLCJmaWxlIjoic2xpZGVycy9vdmVydmlldy9zbGlkZXJzX3N0YXJ0X3BhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNsaWRlcnNfc3RhcnRfcGFnZS5qcyAyMDE2LTEyLTEzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBTbGlkZXJzIE92ZXJ2aWV3IFN0YXJ0IFBhZ2UgT3B0aW9uXG4gKlxuICogSGFuZGxlcyB0aGUgc3RhcnQgcGFnZSBzd2l0Y2hlciB0b2dnbGluZy5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzbGlkZXJzX3N0YXJ0X3BhZ2UnLFxuXG4gICAgW1xuICAgICAgICAnbW9kYWwnLFxuICAgICAgICBgJHtneC5zb3VyY2V9L2xpYnMvaW5mb19ib3hgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENTUyBjbGFzcyBuYW1lcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGNsYXNzZXMgPSB7XG4gICAgICAgICAgICBzd2l0Y2hlcjogJ3N3aXRjaGVyJyxcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogU2VsZWN0b3IgU3RyaW5nc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgc3dpdGNoZXI6IGAuJHtjbGFzc2VzLnN3aXRjaGVyfWAsXG4gICAgICAgICAgICBzd2l0Y2hlckNoZWNrYm94OiBgLiR7Y2xhc3Nlcy5zd2l0Y2hlcn0gOmNoZWNrYm94YCxcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVUkkgbWFwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgdXJpcyA9IHtcbiAgICAgICAgICAgIGFjdGl2YXRlOiBgJHtqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKX0vYWRtaW4vYWRtaW4ucGhwP2RvPVNsaWRlcnNPdmVydmlld0FqYXgvU2V0U3RhcnRQYWdlU2xpZGVyYCxcbiAgICAgICAgICAgIGRlYWN0aXZhdGU6IGAke2pzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpfS9hZG1pbi9hZG1pbi5waHA/ZG89U2xpZGVyc092ZXJ2aWV3QWpheC9EZWFjdGl2YXRlU3RhcnRQYWdlU2xpZGVyYCxcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgc2xpZGVyIHN0YXJ0IHBhZ2Ugc3dpdGNoZXIgY2hhbmdlIGV2ZW50LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnQgVHJpZ2dlciBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblN3aXRjaGVyQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBDbGlja2VkIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBDbGlja2VkIHN3aXRjaGVyIGVsZW1lbnQuXG4gICAgICAgICAgICBjb25zdCAkY2xpY2tlZFN3aXRjaGVyID0gJHRhcmdldC5oYXNDbGFzcyhjbGFzc2VzLnN3aXRjaGVyKSA/ICR0YXJnZXQgOiAkdGFyZ2V0LnBhcmVudHMoc2VsZWN0b3JzLnN3aXRjaGVyKTtcblxuICAgICAgICAgICAgLy8gQ2xpY2tlZCBzbGlkZXIgSUQuXG4gICAgICAgICAgICBjb25zdCBzbGlkZXJJZCA9ICRjbGlja2VkU3dpdGNoZXIucGFyZW50cygndHInKS5kYXRhKCdzbGlkZXJJZCcpO1xuXG4gICAgICAgICAgICAvLyBJcyBzbGlkZXIgc2V0IGFzIHN0YXJ0IHBhZ2Ugc2xpZGVyP1xuICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSAhJGNsaWNrZWRTd2l0Y2hlci5oYXNDbGFzcygnY2hlY2tlZCcpO1xuXG4gICAgICAgICAgICAvLyBEaXNhYmxlIGFsbCBzd2l0Y2hlcnMuXG4gICAgICAgICAgICBfdG9nZ2xlU3dpdGNoZXJzKGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gQWN0aXZhdGUgb3IgZGVhY3RpdmF0ZSBzbGlkZXIgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZS5cbiAgICAgICAgICAgIGlzQWN0aXZlID8gX2RlYWN0aXZhdGUoc2xpZGVySWQsICRjbGlja2VkU3dpdGNoZXIpIDogX2FjdGl2YXRlKHNsaWRlcklkLCAkY2xpY2tlZFN3aXRjaGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWFjdGl2YXRlcyB0aGUgc2xpZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc2xpZGVySWQgU2xpZGVyIElELlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGNsaWNrZWRTd2l0Y2hlciBDbGlja2VkIHNsaWRlciBlbGVtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2RlYWN0aXZhdGUoc2xpZGVySWQsICRjbGlja2VkU3dpdGNoZXIpIHtcbiAgICAgICAgICAgIC8vIFJlcXVlc3Qgb3B0aW9ucy5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7c2xpZGVySWR9LFxuICAgICAgICAgICAgICAgIHVybDogdXJpcy5kZWFjdGl2YXRlLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gSGFuZGxlcyB0aGUgJ2Fsd2F5cycgY2FzZSBieSBlbmFibGluZyB0aGUgY2xpY2tlZCBzbGlkZXIuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVBbHdheXMgPSAoKSA9PiAkY2xpY2tlZFN3aXRjaGVyLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAvLyBIYW5kbGVzIHRoZSAnZG9uZScgY2FzZSB3aXRoIHRoZSBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVEb25lID0gcmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIC8vIEVuYWJsZSBhbGwgc3dpdGNoZXJzLlxuICAgICAgICAgICAgICAgIF90b2dnbGVTd2l0Y2hlcnModHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWFjdGl2YXRlIGVhY2ggc2xpZGVyLlxuICAgICAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy5zd2l0Y2hlckNoZWNrYm94KVxuICAgICAgICAgICAgICAgICAgICAuZWFjaCgoaW5kZXgsIGNoZWNrYm94KSA9PiAkKGNoZWNrYm94KS5zd2l0Y2hlcignY2hlY2tlZCcsIGZhbHNlKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBOb3RpZnkgdXNlci5cbiAgICAgICAgICAgICAgICBfbm90aWZ5KHJlc3BvbnNlLmluY2x1ZGVzKCdzdWNjZXNzJykpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUGVyZm9ybSByZXF1ZXN0LlxuICAgICAgICAgICAgJC5hamF4KHJlcXVlc3RPcHRpb25zKVxuICAgICAgICAgICAgICAgIC5kb25lKGhhbmRsZURvbmUpXG4gICAgICAgICAgICAgICAgLmFsd2F5cyhoYW5kbGVBbHdheXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFjdGl2YXRlcyB0aGUgc2xpZGVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gc2xpZGVySWQgU2xpZGVyIElELlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJGNsaWNrZWRTd2l0Y2hlciBDbGlja2VkIHNsaWRlciBlbGVtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2FjdGl2YXRlKHNsaWRlcklkLCAkY2xpY2tlZFN3aXRjaGVyKSB7XG4gICAgICAgICAgICAvLyBSZXF1ZXN0IG9wdGlvbnMuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgZGF0YToge3NsaWRlcklkfSxcbiAgICAgICAgICAgICAgICB1cmw6IHVyaXMuYWN0aXZhdGUsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBIYW5kbGVzIHRoZSAnYWx3YXlzJyBjYXNlIGJ5IGVuYWJsaW5nIHRoZSBjbGlja2VkIHNsaWRlci5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZUFsd2F5cyA9ICgpID0+IF90b2dnbGVTd2l0Y2hlcnModHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZXMgdGhlICdkb25lJyBjYXNlIHdpdGggdGhlIHNlcnZlciByZXNwb25zZS5cbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZURvbmUgPSByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gQ2xpY2tlZCBzd2l0Y2hlcidzIGNoZWNrYm94LlxuICAgICAgICAgICAgICAgIGNvbnN0ICRjaGVja2JveCA9ICRjbGlja2VkU3dpdGNoZXIuZmluZCgnOmNoZWNrYm94Jyk7XG5cbiAgICAgICAgICAgICAgICAvLyBFbmFibGUgYWxsIHN3aXRjaGVycy5cbiAgICAgICAgICAgICAgICBfdG9nZ2xlU3dpdGNoZXJzKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgc3dpdGNoZXIuXG4gICAgICAgICAgICAgICAgJGNoZWNrYm94LnN3aXRjaGVyKCdjaGVja2VkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBEZWFjdGl2YXRlIGVhY2ggc2xpZGVyLCBleGNlcHQgdGhlIGNsaWNrZWQgb25lLlxuICAgICAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKHNlbGVjdG9ycy5zd2l0Y2hlckNoZWNrYm94KVxuICAgICAgICAgICAgICAgICAgICAubm90KCRjaGVja2JveClcbiAgICAgICAgICAgICAgICAgICAgLmVhY2goKGluZGV4LCBjaGVja2JveCkgPT4gJChjaGVja2JveCkuc3dpdGNoZXIoJ2NoZWNrZWQnLCBmYWxzZSkpO1xuXG4gICAgICAgICAgICAgICAgLy8gTm90aWZ5IHVzZXIuXG4gICAgICAgICAgICAgICAgX25vdGlmeShyZXNwb25zZS5pbmNsdWRlcygnc3VjY2VzcycpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFBlcmZvcm0gcmVxdWVzdC5cbiAgICAgICAgICAgICQuYWpheChyZXF1ZXN0T3B0aW9ucylcbiAgICAgICAgICAgICAgICAuZG9uZShoYW5kbGVEb25lKVxuICAgICAgICAgICAgICAgIC5hbHdheXMoaGFuZGxlQWx3YXlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiB0aGUgc2VydmVyIHJlc3BvbnNlIGlzIHN1Y2Nlc3NmdWwsIGl0IHJlbW92ZXMgYW55IHByZXZpb3VzIG1lc3NhZ2VzIGFuZFxuICAgICAgICAgKiBhZGRzIG5ldyBzdWNjZXNzIG1lc3NhZ2UgdG8gYWRtaW4gaW5mbyBib3guXG4gICAgICAgICAqXG4gICAgICAgICAqIE90aGVyd2lzZSBpdHMgc2hvd3MgYW4gZXJyb3IgbWVzc2FnZSBtb2RhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBpc1N1Y2Nlc3NmdWwgSXMgdGhlIHNlcnZlciByZXNwb25zZSBzdWNjZXNzZnVsP1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX25vdGlmeShpc1N1Y2Nlc3NmdWwpIHtcbiAgICAgICAgICAgIGlmIChpc1N1Y2Nlc3NmdWwpIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5pbmZvX2JveC5hZGRTdWNjZXNzTWVzc2FnZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5zaG93TWVzc2FnZShcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NMSURFUl9TVEFSVF9QQUdFX0VSUk9SX1RJVExFJywgJ3NsaWRlcnMnKSxcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NMSURFUl9TVEFSVF9QQUdFX0VSUk9SX1RFWFQnLCAnc2xpZGVycycpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbmFibGVzIG9yIGRpc2FibGVzIHRoZSBzd2l0Y2hlcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZG9FbmFibGUgRW5hYmxlIHRoZSBzd2l0Y2hlcnM/XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfdG9nZ2xlU3dpdGNoZXJzKGRvRW5hYmxlKSB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKHNlbGVjdG9ycy5zd2l0Y2hlcilbYCR7ZG9FbmFibGUgPyAncmVtb3ZlJyA6ICdhZGQnfUNsYXNzYF0oJ2Rpc2FibGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBMaXN0ZW4gdG8gc2V0IHN0YXJ0IHBhZ2UgZXZlbnQuXG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgc2VsZWN0b3JzLnN3aXRjaGVyLCBfb25Td2l0Y2hlckNoYW5nZSk7XG5cbiAgICAgICAgICAgIC8vIEZpbmlzaCBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG4iXX0=
