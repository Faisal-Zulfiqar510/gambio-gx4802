'use strict';

/* --------------------------------------------------------------
 depending_selects.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Depending Selects Extension
 *
 * Extension that fills other dropdowns with data that relate with the value of the
 * dropdown the listener is bound on.
 *
 * @module Admin/Extensions/depending_selects
 *
 * @deprecated Since JS Engine v1.3
 *
 * @ignore
 */
gx.extensions.module('depending_selects', ['form', 'fallback'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        'cache': false, // Cache requested data, so that an ajax is only called once
        'requestOnInit': true // Update the values on init
    },


    /**
     * Cache Object
     *
     * @type {object}
     */
    cache = {},


    /**
     * Final Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONALITY
    // ------------------------------------------------------------------------

    /**
     * Generate Options
     *
     * Function that generates the option fields for the "other" dropdowns
     *
     * @param {object} dataset Data given by the AJAX-call.
     */
    var _generateOptions = function _generateOptions(dataset) {
        $.each(dataset, function (index, value) {
            var $select = $this.find(index);
            $select.empty();
            jse.libs.form.createOptions($select, value, false, false);
        });
    };

    /**
     * Change Handler
     *
     * Event handler for the change-event on the main dropdown.
     */
    var _changeHandler = function _changeHandler() {
        var $self = $(this),
            $option = $self.children(':selected'),
            dataset = jse.libs.fallback._data($option, 'depending_selects');

        if (cache[dataset.url]) {
            // Use cached data if available
            _generateOptions(cache[dataset.url]);
        } else if (dataset.url) {
            // If an URL is given, request the data via an AJAX-call.
            $.get(dataset.url).done(function (result) {
                if (result.success) {
                    if (options.cache) {
                        // Cache the data if the option is given
                        cache[dataset.url] = result.data;
                    }
                    _generateOptions(result.data);
                }
            });
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize function of the extension, called by the engine.
     */
    module.init = function (done) {
        // Display Deprecation Mark
        jse.core.debug.warn('The "depending_selects" extension is deprecated as of v1.3.0, do not use it ' + 'on new pages.');

        // Bind the change handler on the main dropdown object.
        var $source = $this.find(options.target);
        $source.on('change', _changeHandler);

        // Sets the values of the other dropdowns.
        if (options.requestOnInit) {
            $source.trigger('change', []);
        }

        done();
    };

    // Return data to module engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlcGVuZGluZ19zZWxlY3RzLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsImNhY2hlIiwib3B0aW9ucyIsImV4dGVuZCIsIl9nZW5lcmF0ZU9wdGlvbnMiLCJkYXRhc2V0IiwiZWFjaCIsImluZGV4IiwidmFsdWUiLCIkc2VsZWN0IiwiZmluZCIsImVtcHR5IiwianNlIiwibGlicyIsImZvcm0iLCJjcmVhdGVPcHRpb25zIiwiX2NoYW5nZUhhbmRsZXIiLCIkc2VsZiIsIiRvcHRpb24iLCJjaGlsZHJlbiIsImZhbGxiYWNrIiwiX2RhdGEiLCJ1cmwiLCJnZXQiLCJkb25lIiwicmVzdWx0Iiwic3VjY2VzcyIsImluaXQiLCJjb3JlIiwiZGVidWciLCJ3YXJuIiwiJHNvdXJjZSIsInRhcmdldCIsIm9uIiwicmVxdWVzdE9uSW5pdCIsInRyaWdnZXIiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7O0FBWUFBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLG1CQURKLEVBR0ksQ0FBQyxNQUFELEVBQVMsVUFBVCxDQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXO0FBQ1AsaUJBQVMsS0FERixFQUNTO0FBQ2hCLHlCQUFpQixJQUZWLENBRWU7QUFGZixLQWJmOzs7QUFrQkk7Ozs7O0FBS0FDLFlBQVEsRUF2Qlo7OztBQXlCSTs7Ozs7QUFLQUMsY0FBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSCxRQUFuQixFQUE2QkgsSUFBN0IsQ0E5QmQ7OztBQWdDSTs7Ozs7QUFLQUQsYUFBUyxFQXJDYjs7QUF1Q0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FBT0EsUUFBSVEsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBVUMsT0FBVixFQUFtQjtBQUN0Q04sVUFBRU8sSUFBRixDQUFPRCxPQUFQLEVBQWdCLFVBQVVFLEtBQVYsRUFBaUJDLEtBQWpCLEVBQXdCO0FBQ3BDLGdCQUFJQyxVQUFVWCxNQUFNWSxJQUFOLENBQVdILEtBQVgsQ0FBZDtBQUNBRSxvQkFBUUUsS0FBUjtBQUNBQyxnQkFBSUMsSUFBSixDQUFTQyxJQUFULENBQWNDLGFBQWQsQ0FBNEJOLE9BQTVCLEVBQXFDRCxLQUFyQyxFQUE0QyxLQUE1QyxFQUFtRCxLQUFuRDtBQUNILFNBSkQ7QUFLSCxLQU5EOztBQVFBOzs7OztBQUtBLFFBQUlRLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBWTtBQUM3QixZQUFJQyxRQUFRbEIsRUFBRSxJQUFGLENBQVo7QUFBQSxZQUNJbUIsVUFBVUQsTUFBTUUsUUFBTixDQUFlLFdBQWYsQ0FEZDtBQUFBLFlBRUlkLFVBQVVPLElBQUlDLElBQUosQ0FBU08sUUFBVCxDQUFrQkMsS0FBbEIsQ0FBd0JILE9BQXhCLEVBQWlDLG1CQUFqQyxDQUZkOztBQUlBLFlBQUlqQixNQUFNSSxRQUFRaUIsR0FBZCxDQUFKLEVBQXdCO0FBQ3BCO0FBQ0FsQiw2QkFBaUJILE1BQU1JLFFBQVFpQixHQUFkLENBQWpCO0FBQ0gsU0FIRCxNQUdPLElBQUlqQixRQUFRaUIsR0FBWixFQUFpQjtBQUNwQjtBQUNBdkIsY0FBRXdCLEdBQUYsQ0FBTWxCLFFBQVFpQixHQUFkLEVBQW1CRSxJQUFuQixDQUF3QixVQUFVQyxNQUFWLEVBQWtCO0FBQ3RDLG9CQUFJQSxPQUFPQyxPQUFYLEVBQW9CO0FBQ2hCLHdCQUFJeEIsUUFBUUQsS0FBWixFQUFtQjtBQUNmO0FBQ0FBLDhCQUFNSSxRQUFRaUIsR0FBZCxJQUFxQkcsT0FBTzVCLElBQTVCO0FBQ0g7QUFDRE8scUNBQWlCcUIsT0FBTzVCLElBQXhCO0FBQ0g7QUFDSixhQVJEO0FBU0g7QUFDSixLQXBCRDs7QUFzQkE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQUQsV0FBTytCLElBQVAsR0FBYyxVQUFVSCxJQUFWLEVBQWdCO0FBQzFCO0FBQ0FaLFlBQUlnQixJQUFKLENBQVNDLEtBQVQsQ0FBZUMsSUFBZixDQUFvQixpRkFDZCxlQUROOztBQUdBO0FBQ0EsWUFBSUMsVUFBVWpDLE1BQU1ZLElBQU4sQ0FBV1IsUUFBUThCLE1BQW5CLENBQWQ7QUFDQUQsZ0JBQVFFLEVBQVIsQ0FBVyxRQUFYLEVBQXFCakIsY0FBckI7O0FBRUE7QUFDQSxZQUFJZCxRQUFRZ0MsYUFBWixFQUEyQjtBQUN2Qkgsb0JBQVFJLE9BQVIsQ0FBZ0IsUUFBaEIsRUFBMEIsRUFBMUI7QUFDSDs7QUFFRFg7QUFDSCxLQWZEOztBQWlCQTtBQUNBLFdBQU81QixNQUFQO0FBQ0gsQ0E1SEwiLCJmaWxlIjoiZGVwZW5kaW5nX3NlbGVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGRlcGVuZGluZ19zZWxlY3RzLmpzIDIwMTUtMTAtMTUgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIERlcGVuZGluZyBTZWxlY3RzIEV4dGVuc2lvblxuICpcbiAqIEV4dGVuc2lvbiB0aGF0IGZpbGxzIG90aGVyIGRyb3Bkb3ducyB3aXRoIGRhdGEgdGhhdCByZWxhdGUgd2l0aCB0aGUgdmFsdWUgb2YgdGhlXG4gKiBkcm9wZG93biB0aGUgbGlzdGVuZXIgaXMgYm91bmQgb24uXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL2RlcGVuZGluZ19zZWxlY3RzXG4gKlxuICogQGRlcHJlY2F0ZWQgU2luY2UgSlMgRW5naW5lIHYxLjNcbiAqXG4gKiBAaWdub3JlXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICdkZXBlbmRpbmdfc2VsZWN0cycsXG5cbiAgICBbJ2Zvcm0nLCAnZmFsbGJhY2snXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRSBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeHRlbnNpb24gUmVmZXJlbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgICdjYWNoZSc6IGZhbHNlLCAvLyBDYWNoZSByZXF1ZXN0ZWQgZGF0YSwgc28gdGhhdCBhbiBhamF4IGlzIG9ubHkgY2FsbGVkIG9uY2VcbiAgICAgICAgICAgICAgICAncmVxdWVzdE9uSW5pdCc6IHRydWUgLy8gVXBkYXRlIHRoZSB2YWx1ZXMgb24gaW5pdFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDYWNoZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjYWNoZSA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OQUxJVFlcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdlbmVyYXRlIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogRnVuY3Rpb24gdGhhdCBnZW5lcmF0ZXMgdGhlIG9wdGlvbiBmaWVsZHMgZm9yIHRoZSBcIm90aGVyXCIgZHJvcGRvd25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhc2V0IERhdGEgZ2l2ZW4gYnkgdGhlIEFKQVgtY2FsbC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZ2VuZXJhdGVPcHRpb25zID0gZnVuY3Rpb24gKGRhdGFzZXQpIHtcbiAgICAgICAgICAgICQuZWFjaChkYXRhc2V0LCBmdW5jdGlvbiAoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyICRzZWxlY3QgPSAkdGhpcy5maW5kKGluZGV4KTtcbiAgICAgICAgICAgICAgICAkc2VsZWN0LmVtcHR5KCk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuZm9ybS5jcmVhdGVPcHRpb25zKCRzZWxlY3QsIHZhbHVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYW5nZSBIYW5kbGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSBjaGFuZ2UtZXZlbnQgb24gdGhlIG1haW4gZHJvcGRvd24uXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2NoYW5nZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICRvcHRpb24gPSAkc2VsZi5jaGlsZHJlbignOnNlbGVjdGVkJyksXG4gICAgICAgICAgICAgICAgZGF0YXNldCA9IGpzZS5saWJzLmZhbGxiYWNrLl9kYXRhKCRvcHRpb24sICdkZXBlbmRpbmdfc2VsZWN0cycpO1xuXG4gICAgICAgICAgICBpZiAoY2FjaGVbZGF0YXNldC51cmxdKSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlIGNhY2hlZCBkYXRhIGlmIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgIF9nZW5lcmF0ZU9wdGlvbnMoY2FjaGVbZGF0YXNldC51cmxdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YXNldC51cmwpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBhbiBVUkwgaXMgZ2l2ZW4sIHJlcXVlc3QgdGhlIGRhdGEgdmlhIGFuIEFKQVgtY2FsbC5cbiAgICAgICAgICAgICAgICAkLmdldChkYXRhc2V0LnVybCkuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWNoZSB0aGUgZGF0YSBpZiB0aGUgb3B0aW9uIGlzIGdpdmVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVbZGF0YXNldC51cmxdID0gcmVzdWx0LmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBfZ2VuZXJhdGVPcHRpb25zKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSBmdW5jdGlvbiBvZiB0aGUgZXh0ZW5zaW9uLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIERpc3BsYXkgRGVwcmVjYXRpb24gTWFya1xuICAgICAgICAgICAganNlLmNvcmUuZGVidWcud2FybignVGhlIFwiZGVwZW5kaW5nX3NlbGVjdHNcIiBleHRlbnNpb24gaXMgZGVwcmVjYXRlZCBhcyBvZiB2MS4zLjAsIGRvIG5vdCB1c2UgaXQgJ1xuICAgICAgICAgICAgICAgICsgJ29uIG5ldyBwYWdlcy4nKTtcblxuICAgICAgICAgICAgLy8gQmluZCB0aGUgY2hhbmdlIGhhbmRsZXIgb24gdGhlIG1haW4gZHJvcGRvd24gb2JqZWN0LlxuICAgICAgICAgICAgdmFyICRzb3VyY2UgPSAkdGhpcy5maW5kKG9wdGlvbnMudGFyZ2V0KTtcbiAgICAgICAgICAgICRzb3VyY2Uub24oJ2NoYW5nZScsIF9jaGFuZ2VIYW5kbGVyKTtcblxuICAgICAgICAgICAgLy8gU2V0cyB0aGUgdmFsdWVzIG9mIHRoZSBvdGhlciBkcm9wZG93bnMuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZXF1ZXN0T25Jbml0KSB7XG4gICAgICAgICAgICAgICAgJHNvdXJjZS50cmlnZ2VyKCdjaGFuZ2UnLCBbXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byBtb2R1bGUgZW5naW5lXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
