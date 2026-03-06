'use strict';

/* --------------------------------------------------------------
 datetimepicker.js 2016-02-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Datetimepicker Widget
 *
 * This widget will convert itself or multiple elements into datetimepicker instances. Check the defaults object for a
 * list of available options.
 *
 * You can also set this module in a container element and provide the "data-datetimepicker-container" attribute and
 * this plugin will initialize all the child elements that have the "datetimepicker" class into datetimepicker widgets.
 *
 * jQuery Datetimepicker Website: {@link http://xdsoft.net/jqplugins/datetimepicker}
 *
 * ### Options
 *
 * In addition to the options stated below, you could also add many more options shown in the
 * jQuery Datetimepicker documentation.
 *
 * **Format | `data-datetimepicker-format` | String | Optional**
 *
 * Provide the default date format. If no value is provided, the default format will be set
 * to `'d.m.Y H:i'`.
 *
 * **Lang | `data-datetimepicker-lang` | String | Optional**
 *
 * Provide the default language code. If the current language is set to english, the default
 * language code will be set to `'en-GB'`, else the language code will be set to `'de'`.
 *
 * ### Examples
 *
 * ```html
 * <input type="text" placeholder="##.##.#### ##:##" data-gx-widget="datetimepicker" />
 * ```
 *
 * @deprecated Since v1.4, will be removed in v1.7. Use the one from JSE/Widgets namespace.
 *
 * @module Admin/Widgets/datetimepicker
 * @requires jQuery-Datetimepicker-Plugin
 */
gx.widgets.module('datetimepicker', [jse.source + '/vendor/datetimepicker/jquery.datetimepicker.full.min.js', jse.source + '/vendor/datetimepicker/jquery.datetimepicker.css'], function (data) {

    'use strict';

    var
    /**
     * Module Selector
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Module Options
     *
     * @type {object}
     */
    defaults = {
        format: 'd.m.Y H:i',
        lang: jse.core.config.get('languageCode') === 'en' ? 'en-GB' : 'de'
    },


    /**
     * Final Module Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Instance
     *
     * @type {object}
     */
    module = {};

    /**
     * Initialize Module
     *
     * @param {function} done Call this method once the module is initialized.
     */
    module.init = function (done) {
        // Check if the datetimepicker plugin is already loaded.
        if ($.fn.datetimepicker === undefined) {
            throw new Error('The $.fn.datetimepicker plugin must be loaded before the module is initialized.');
        }

        // Check if the current element is a container and thus need to initialize the children elements.
        if (options.container !== undefined) {
            $this.find('.datetimepicker').datetimepicker(options);
        } else {
            $this.datetimepicker(options);
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhdGV0aW1lcGlja2VyLmpzIl0sIm5hbWVzIjpbImd4Iiwid2lkZ2V0cyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsImZvcm1hdCIsImxhbmciLCJjb3JlIiwiY29uZmlnIiwiZ2V0Iiwib3B0aW9ucyIsImV4dGVuZCIsImluaXQiLCJkb25lIiwiZm4iLCJkYXRldGltZXBpY2tlciIsInVuZGVmaW5lZCIsIkVycm9yIiwiY29udGFpbmVyIiwiZmluZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUNBQSxHQUFHQyxPQUFILENBQVdDLE1BQVgsQ0FDSSxnQkFESixFQUdJLENBQUlDLElBQUlDLE1BQVIsK0RBQ09ELElBQUlDLE1BRFgsc0RBSEosRUFNSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVztBQUNQQyxnQkFBUSxXQUREO0FBRVBDLGNBQU1QLElBQUlRLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsY0FBcEIsTUFBd0MsSUFBeEMsR0FBK0MsT0FBL0MsR0FBeUQ7QUFGeEQsS0FiZjs7O0FBa0JJOzs7OztBQUtBQyxjQUFVUCxFQUFFUSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJQLFFBQW5CLEVBQTZCSCxJQUE3QixDQXZCZDs7O0FBeUJJOzs7OztBQUtBSCxhQUFTLEVBOUJiOztBQWdDQTs7Ozs7QUFLQUEsV0FBT2MsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUI7QUFDQSxZQUFJVixFQUFFVyxFQUFGLENBQUtDLGNBQUwsS0FBd0JDLFNBQTVCLEVBQXVDO0FBQ25DLGtCQUFNLElBQUlDLEtBQUosQ0FBVSxpRkFBVixDQUFOO0FBQ0g7O0FBRUQ7QUFDQSxZQUFJUCxRQUFRUSxTQUFSLEtBQXNCRixTQUExQixFQUFxQztBQUNqQ2Qsa0JBQU1pQixJQUFOLENBQVcsaUJBQVgsRUFBOEJKLGNBQTlCLENBQTZDTCxPQUE3QztBQUNILFNBRkQsTUFFTztBQUNIUixrQkFBTWEsY0FBTixDQUFxQkwsT0FBckI7QUFDSDs7QUFFREc7QUFDSCxLQWREOztBQWdCQSxXQUFPZixNQUFQO0FBQ0gsQ0FoRUwiLCJmaWxlIjoiZGF0ZXRpbWVwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRhdGV0aW1lcGlja2VyLmpzIDIwMTYtMDItMjNcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIERhdGV0aW1lcGlja2VyIFdpZGdldFxuICpcbiAqIFRoaXMgd2lkZ2V0IHdpbGwgY29udmVydCBpdHNlbGYgb3IgbXVsdGlwbGUgZWxlbWVudHMgaW50byBkYXRldGltZXBpY2tlciBpbnN0YW5jZXMuIENoZWNrIHRoZSBkZWZhdWx0cyBvYmplY3QgZm9yIGFcbiAqIGxpc3Qgb2YgYXZhaWxhYmxlIG9wdGlvbnMuXG4gKlxuICogWW91IGNhbiBhbHNvIHNldCB0aGlzIG1vZHVsZSBpbiBhIGNvbnRhaW5lciBlbGVtZW50IGFuZCBwcm92aWRlIHRoZSBcImRhdGEtZGF0ZXRpbWVwaWNrZXItY29udGFpbmVyXCIgYXR0cmlidXRlIGFuZFxuICogdGhpcyBwbHVnaW4gd2lsbCBpbml0aWFsaXplIGFsbCB0aGUgY2hpbGQgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBcImRhdGV0aW1lcGlja2VyXCIgY2xhc3MgaW50byBkYXRldGltZXBpY2tlciB3aWRnZXRzLlxuICpcbiAqIGpRdWVyeSBEYXRldGltZXBpY2tlciBXZWJzaXRlOiB7QGxpbmsgaHR0cDovL3hkc29mdC5uZXQvanFwbHVnaW5zL2RhdGV0aW1lcGlja2VyfVxuICpcbiAqICMjIyBPcHRpb25zXG4gKlxuICogSW4gYWRkaXRpb24gdG8gdGhlIG9wdGlvbnMgc3RhdGVkIGJlbG93LCB5b3UgY291bGQgYWxzbyBhZGQgbWFueSBtb3JlIG9wdGlvbnMgc2hvd24gaW4gdGhlXG4gKiBqUXVlcnkgRGF0ZXRpbWVwaWNrZXIgZG9jdW1lbnRhdGlvbi5cbiAqXG4gKiAqKkZvcm1hdCB8IGBkYXRhLWRhdGV0aW1lcGlja2VyLWZvcm1hdGAgfCBTdHJpbmcgfCBPcHRpb25hbCoqXG4gKlxuICogUHJvdmlkZSB0aGUgZGVmYXVsdCBkYXRlIGZvcm1hdC4gSWYgbm8gdmFsdWUgaXMgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGZvcm1hdCB3aWxsIGJlIHNldFxuICogdG8gYCdkLm0uWSBIOmknYC5cbiAqXG4gKiAqKkxhbmcgfCBgZGF0YS1kYXRldGltZXBpY2tlci1sYW5nYCB8IFN0cmluZyB8IE9wdGlvbmFsKipcbiAqXG4gKiBQcm92aWRlIHRoZSBkZWZhdWx0IGxhbmd1YWdlIGNvZGUuIElmIHRoZSBjdXJyZW50IGxhbmd1YWdlIGlzIHNldCB0byBlbmdsaXNoLCB0aGUgZGVmYXVsdFxuICogbGFuZ3VhZ2UgY29kZSB3aWxsIGJlIHNldCB0byBgJ2VuLUdCJ2AsIGVsc2UgdGhlIGxhbmd1YWdlIGNvZGUgd2lsbCBiZSBzZXQgdG8gYCdkZSdgLlxuICpcbiAqICMjIyBFeGFtcGxlc1xuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiIyMuIyMuIyMjIyAjIzojI1wiIGRhdGEtZ3gtd2lkZ2V0PVwiZGF0ZXRpbWVwaWNrZXJcIiAvPlxuICogYGBgXG4gKlxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuNCwgd2lsbCBiZSByZW1vdmVkIGluIHYxLjcuIFVzZSB0aGUgb25lIGZyb20gSlNFL1dpZGdldHMgbmFtZXNwYWNlLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vV2lkZ2V0cy9kYXRldGltZXBpY2tlclxuICogQHJlcXVpcmVzIGpRdWVyeS1EYXRldGltZXBpY2tlci1QbHVnaW5cbiAqL1xuZ3gud2lkZ2V0cy5tb2R1bGUoXG4gICAgJ2RhdGV0aW1lcGlja2VyJyxcblxuICAgIFtgJHtqc2Uuc291cmNlfS92ZW5kb3IvZGF0ZXRpbWVwaWNrZXIvanF1ZXJ5LmRhdGV0aW1lcGlja2VyLmZ1bGwubWluLmpzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL2RhdGV0aW1lcGlja2VyL2pxdWVyeS5kYXRldGltZXBpY2tlci5jc3NgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIGZvcm1hdDogJ2QubS5ZIEg6aScsXG4gICAgICAgICAgICAgICAgbGFuZzoganNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJykgPT09ICdlbicgPyAnZW4tR0InIDogJ2RlJ1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBNb2R1bGUgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBJbnN0YW5jZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIE1vZHVsZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkb25lIENhbGwgdGhpcyBtZXRob2Qgb25jZSB0aGUgbW9kdWxlIGlzIGluaXRpYWxpemVkLlxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGRhdGV0aW1lcGlja2VyIHBsdWdpbiBpcyBhbHJlYWR5IGxvYWRlZC5cbiAgICAgICAgICAgIGlmICgkLmZuLmRhdGV0aW1lcGlja2VyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSAkLmZuLmRhdGV0aW1lcGlja2VyIHBsdWdpbiBtdXN0IGJlIGxvYWRlZCBiZWZvcmUgdGhlIG1vZHVsZSBpcyBpbml0aWFsaXplZC4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgZWxlbWVudCBpcyBhIGNvbnRhaW5lciBhbmQgdGh1cyBuZWVkIHRvIGluaXRpYWxpemUgdGhlIGNoaWxkcmVuIGVsZW1lbnRzLlxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29udGFpbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuZGF0ZXRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlcihvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuZGF0ZXRpbWVwaWNrZXIob3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
