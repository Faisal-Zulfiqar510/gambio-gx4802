'use strict';

/* --------------------------------------------------------------
 ajax_search.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## AJAX Search Extension
 *
 * Enables the AJAX search and display for an element. This extension is used along with text_edit.js and
 * ajax_search.js in the Gambio Admin "Text Edit | Texte Anpassen" page.
 *
 * @module Admin/Extensions/ajax_search
 * @ignore
 */
gx.extensions.module('ajax_search', ['form', jse.source + '/vendor/mustache.js/mustache.min.js'], function (data) {

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
     * Default Options for Extension.
     *
     * @type {object}
     */
    defaults = {},


    /**
     * AJAX URL
     *
     * @type {string}
     */
    url = $this.attr('action'),


    /**
     * Final Extension Options
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
    // META INITIALIZE
    // ------------------------------------------------------------------------

    /**
     * Initialize function of the extension, called by the engine.
     */
    module.init = function (done) {

        var template = $(options.template).html(),
            $target = $(options.target);

        $this.on('submit', function (event) {
            event.preventDefault();

            var data = jse.libs.form.getData($this);

            // Check for required fields.
            var abort = false;
            $this.find('[required]').each(function () {
                if ($(this).val() === '') {
                    abort = true;
                    return false; // exit $.each loop
                }
            });
            if (abort) {
                return; // abort because there is a missing field
            }

            $.ajax({
                'url': url,
                'method': 'post',
                'dataType': 'json',
                'data': data,
                'page_token': jse.core.config.get('pageToken')
            }).done(function (result) {
                var markup = Mustache.render(template, result.payload);
                $target.empty().append(markup).parent().show();
            });
        });

        done();
    };

    // Return data to module engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFqYXhfc2VhcmNoLmpzIl0sIm5hbWVzIjpbImd4IiwiZXh0ZW5zaW9ucyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsInVybCIsImF0dHIiLCJvcHRpb25zIiwiZXh0ZW5kIiwiaW5pdCIsImRvbmUiLCJ0ZW1wbGF0ZSIsImh0bWwiLCIkdGFyZ2V0IiwidGFyZ2V0Iiwib24iLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwibGlicyIsImZvcm0iLCJnZXREYXRhIiwiYWJvcnQiLCJmaW5kIiwiZWFjaCIsInZhbCIsImFqYXgiLCJjb3JlIiwiY29uZmlnIiwiZ2V0IiwicmVzdWx0IiwibWFya3VwIiwiTXVzdGFjaGUiLCJyZW5kZXIiLCJwYXlsb2FkIiwiZW1wdHkiLCJhcHBlbmQiLCJwYXJlbnQiLCJzaG93Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7OztBQVNBQSxHQUFHQyxVQUFILENBQWNDLE1BQWQsQ0FDSSxhQURKLEVBR0ksQ0FDSSxNQURKLEVBRU9DLElBQUlDLE1BRlgseUNBSEosRUFRSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLFVBQU1ILE1BQU1JLElBQU4sQ0FBVyxRQUFYLENBcEJWOzs7QUFzQkk7Ozs7O0FBS0FDLGNBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkosUUFBbkIsRUFBNkJILElBQTdCLENBM0JkOzs7QUE2Qkk7Ozs7O0FBS0FILGFBQVMsRUFsQ2I7O0FBb0NBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0FBLFdBQU9XLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQixZQUFJQyxXQUFXUixFQUFFSSxRQUFRSSxRQUFWLEVBQW9CQyxJQUFwQixFQUFmO0FBQUEsWUFDSUMsVUFBVVYsRUFBRUksUUFBUU8sTUFBVixDQURkOztBQUdBWixjQUFNYSxFQUFOLENBQVMsUUFBVCxFQUFtQixVQUFVQyxLQUFWLEVBQWlCO0FBQ2hDQSxrQkFBTUMsY0FBTjs7QUFFQSxnQkFBSWhCLE9BQU9GLElBQUltQixJQUFKLENBQVNDLElBQVQsQ0FBY0MsT0FBZCxDQUFzQmxCLEtBQXRCLENBQVg7O0FBRUE7QUFDQSxnQkFBSW1CLFFBQVEsS0FBWjtBQUNBbkIsa0JBQU1vQixJQUFOLENBQVcsWUFBWCxFQUF5QkMsSUFBekIsQ0FBOEIsWUFBWTtBQUN0QyxvQkFBSXBCLEVBQUUsSUFBRixFQUFRcUIsR0FBUixPQUFrQixFQUF0QixFQUEwQjtBQUN0QkgsNEJBQVEsSUFBUjtBQUNBLDJCQUFPLEtBQVAsQ0FGc0IsQ0FFUjtBQUNqQjtBQUNKLGFBTEQ7QUFNQSxnQkFBSUEsS0FBSixFQUFXO0FBQ1AsdUJBRE8sQ0FDQztBQUNYOztBQUVEbEIsY0FBRXNCLElBQUYsQ0FBTztBQUNILHVCQUFPcEIsR0FESjtBQUVILDBCQUFVLE1BRlA7QUFHSCw0QkFBWSxNQUhUO0FBSUgsd0JBQVFKLElBSkw7QUFLSCw4QkFBY0YsSUFBSTJCLElBQUosQ0FBU0MsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0IsV0FBcEI7QUFMWCxhQUFQLEVBTUdsQixJQU5ILENBTVEsVUFBVW1CLE1BQVYsRUFBa0I7QUFDdEIsb0JBQUlDLFNBQVNDLFNBQVNDLE1BQVQsQ0FBZ0JyQixRQUFoQixFQUEwQmtCLE9BQU9JLE9BQWpDLENBQWI7QUFDQXBCLHdCQUNLcUIsS0FETCxHQUVLQyxNQUZMLENBRVlMLE1BRlosRUFHS00sTUFITCxHQUlLQyxJQUpMO0FBS0gsYUFiRDtBQWVILFNBaENEOztBQWtDQTNCO0FBQ0gsS0F4Q0Q7O0FBMENBO0FBQ0EsV0FBT1osTUFBUDtBQUNILENBdkdMIiwiZmlsZSI6ImFqYXhfc2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBhamF4X3NlYXJjaC5qcyAyMDE1LTEwLTE1IGdtXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBBSkFYIFNlYXJjaCBFeHRlbnNpb25cbiAqXG4gKiBFbmFibGVzIHRoZSBBSkFYIHNlYXJjaCBhbmQgZGlzcGxheSBmb3IgYW4gZWxlbWVudC4gVGhpcyBleHRlbnNpb24gaXMgdXNlZCBhbG9uZyB3aXRoIHRleHRfZWRpdC5qcyBhbmRcbiAqIGFqYXhfc2VhcmNoLmpzIGluIHRoZSBHYW1iaW8gQWRtaW4gXCJUZXh0IEVkaXQgfCBUZXh0ZSBBbnBhc3NlblwiIHBhZ2UuXG4gKlxuICogQG1vZHVsZSBBZG1pbi9FeHRlbnNpb25zL2FqYXhfc2VhcmNoXG4gKiBAaWdub3JlXG4gKi9cbmd4LmV4dGVuc2lvbnMubW9kdWxlKFxuICAgICdhamF4X3NlYXJjaCcsXG5cbiAgICBbXG4gICAgICAgICdmb3JtJyxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL211c3RhY2hlLmpzL211c3RhY2hlLm1pbi5qc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb24uXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBSkFYIFVSTFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHVybCA9ICR0aGlzLmF0dHIoJ2FjdGlvbicpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIEV4dGVuc2lvbiBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBNRVRBIElOSVRJQUxJWkVcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgZnVuY3Rpb24gb2YgdGhlIGV4dGVuc2lvbiwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG5cbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9ICQob3B0aW9ucy50ZW1wbGF0ZSkuaHRtbCgpLFxuICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkKG9wdGlvbnMudGFyZ2V0KTtcblxuICAgICAgICAgICAgJHRoaXMub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGpzZS5saWJzLmZvcm0uZ2V0RGF0YSgkdGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgcmVxdWlyZWQgZmllbGRzLlxuICAgICAgICAgICAgICAgIHZhciBhYm9ydCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICR0aGlzLmZpbmQoJ1tyZXF1aXJlZF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhYm9ydCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGV4aXQgJC5lYWNoIGxvb3BcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChhYm9ydCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIGFib3J0IGJlY2F1c2UgdGhlcmUgaXMgYSBtaXNzaW5nIGZpZWxkXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgJ21ldGhvZCc6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGFUeXBlJzogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICdwYWdlX3Rva2VuJzoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmt1cCA9IE11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgcmVzdWx0LnBheWxvYWQpO1xuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0XG4gICAgICAgICAgICAgICAgICAgICAgICAuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChtYXJrdXApXG4gICAgICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZVxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
