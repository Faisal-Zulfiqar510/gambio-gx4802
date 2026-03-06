'use strict';

/* --------------------------------------------------------------
 sitemap_generator.js 2016-08-22
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Sitemap Generator Controller
 *
 * This module will execute the sitemap generation
 *
 * @module Compatibility/sitemap_generator
 */
gx.compatibility.module('sitemap_generator', [gx.source + '/libs/info_messages', 'loading_spinner'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES 
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Loading Spinner Selector
     *
     * @type {object}
     */
    $spinner,


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = { url: 'gm_sitemap_creator.php' },


    /**
     * Final Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Reference to the info messages library
     *
     * @type {object}
     */
    messages = jse.libs.info_messages,


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    var _createSitemapXml = function _createSitemapXml() {
        $.ajax({
            url: options.url,
            data: options.params
        })
        // On success
        .done(function (response) {
            messages.addSuccess(response);
            jse.libs.loading_spinner.hide($spinner);
        })
        // On Failure
        .fail(function (response) {
            jse.core.debug.error('Prepare Content Error: ', response);
        });
    };

    var _prepareCategories = function _prepareCategories(deferred) {
        var deferred = deferred || $.Deferred();

        $.ajax({
            url: options.url,
            data: {
                action: 'prepare_categories',
                page_token: jse.core.config.get('pageToken')
            },
            dataType: 'json'
        })
        // On success
        .done(function (response) {
            if (response.repeat === true) {
                _prepareCategories(deferred);
            } else {
                deferred.resolve();
            }
        })
        // On Failure
        .fail(function (response) {
            jse.core.debug.error('Prepare Categories Error: ', response);
            deferred.reject();
        });

        return deferred.promise();
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', function () {
            $spinner = jse.libs.loading_spinner.show($this.parents().eq(2));
            $.when(_prepareCategories()).done(_createSitemapXml);
            $this.blur();
            return false;
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGVtYXAvc2l0ZW1hcF9nZW5lcmF0b3IuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsIiRzcGlubmVyIiwiZGVmYXVsdHMiLCJ1cmwiLCJvcHRpb25zIiwiZXh0ZW5kIiwibWVzc2FnZXMiLCJqc2UiLCJsaWJzIiwiaW5mb19tZXNzYWdlcyIsIl9jcmVhdGVTaXRlbWFwWG1sIiwiYWpheCIsInBhcmFtcyIsImRvbmUiLCJyZXNwb25zZSIsImFkZFN1Y2Nlc3MiLCJsb2FkaW5nX3NwaW5uZXIiLCJoaWRlIiwiZmFpbCIsImNvcmUiLCJkZWJ1ZyIsImVycm9yIiwiX3ByZXBhcmVDYXRlZ29yaWVzIiwiZGVmZXJyZWQiLCJEZWZlcnJlZCIsImFjdGlvbiIsInBhZ2VfdG9rZW4iLCJjb25maWciLCJnZXQiLCJkYXRhVHlwZSIsInJlcGVhdCIsInJlc29sdmUiLCJyZWplY3QiLCJwcm9taXNlIiwiaW5pdCIsIm9uIiwic2hvdyIsInBhcmVudHMiLCJlcSIsIndoZW4iLCJibHVyIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxtQkFESixFQUdJLENBQ0lGLEdBQUdHLE1BQUgsR0FBWSxxQkFEaEIsRUFFSSxpQkFGSixDQUhKLEVBUUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxZQWJKOzs7QUFlSTs7Ozs7QUFLQUMsZUFBVyxFQUFDQyxLQUFLLHdCQUFOLEVBcEJmOzs7QUFzQkk7Ozs7O0FBS0FDLGNBQVVKLEVBQUVLLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkgsUUFBbkIsRUFBNkJKLElBQTdCLENBM0JkOzs7QUE2Qkk7Ozs7O0FBS0FRLGVBQVdDLElBQUlDLElBQUosQ0FBU0MsYUFsQ3hCOzs7QUFvQ0k7Ozs7O0FBS0FiLGFBQVMsRUF6Q2I7O0FBMkNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJYyxvQkFBb0IsU0FBcEJBLGlCQUFvQixHQUFZO0FBQ2hDVixVQUFFVyxJQUFGLENBQU87QUFDSFIsaUJBQUtDLFFBQVFELEdBRFY7QUFFSEwsa0JBQU1NLFFBQVFRO0FBRlgsU0FBUDtBQUlBO0FBSkEsU0FLS0MsSUFMTCxDQUtVLFVBQVVDLFFBQVYsRUFBb0I7QUFDdEJSLHFCQUFTUyxVQUFULENBQW9CRCxRQUFwQjtBQUNBUCxnQkFBSUMsSUFBSixDQUFTUSxlQUFULENBQXlCQyxJQUF6QixDQUE4QmhCLFFBQTlCO0FBQ0gsU0FSTDtBQVNJO0FBVEosU0FVS2lCLElBVkwsQ0FVVSxVQUFVSixRQUFWLEVBQW9CO0FBQ3RCUCxnQkFBSVksSUFBSixDQUFTQyxLQUFULENBQWVDLEtBQWYsQ0FBcUIseUJBQXJCLEVBQWdEUCxRQUFoRDtBQUNILFNBWkw7QUFhSCxLQWREOztBQWdCQSxRQUFJUSxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFVQyxRQUFWLEVBQW9CO0FBQ3pDLFlBQUlBLFdBQVdBLFlBQVl2QixFQUFFd0IsUUFBRixFQUEzQjs7QUFFQXhCLFVBQUVXLElBQUYsQ0FBTztBQUNIUixpQkFBS0MsUUFBUUQsR0FEVjtBQUVITCxrQkFBTTtBQUNGMkIsd0JBQVEsb0JBRE47QUFFRkMsNEJBQVluQixJQUFJWSxJQUFKLENBQVNRLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW9CLFdBQXBCO0FBRlYsYUFGSDtBQU1IQyxzQkFBVTtBQU5QLFNBQVA7QUFRQTtBQVJBLFNBU0toQixJQVRMLENBU1UsVUFBVUMsUUFBVixFQUFvQjtBQUN0QixnQkFBSUEsU0FBU2dCLE1BQVQsS0FBb0IsSUFBeEIsRUFBOEI7QUFDMUJSLG1DQUFtQkMsUUFBbkI7QUFDSCxhQUZELE1BRU87QUFDSEEseUJBQVNRLE9BQVQ7QUFDSDtBQUNKLFNBZkw7QUFnQkk7QUFoQkosU0FpQktiLElBakJMLENBaUJVLFVBQVVKLFFBQVYsRUFBb0I7QUFDdEJQLGdCQUFJWSxJQUFKLENBQVNDLEtBQVQsQ0FBZUMsS0FBZixDQUFxQiw0QkFBckIsRUFBbURQLFFBQW5EO0FBQ0FTLHFCQUFTUyxNQUFUO0FBQ0gsU0FwQkw7O0FBc0JBLGVBQU9ULFNBQVNVLE9BQVQsRUFBUDtBQUNILEtBMUJEOztBQTRCQTtBQUNBO0FBQ0E7O0FBRUFyQyxXQUFPc0MsSUFBUCxHQUFjLFVBQVVyQixJQUFWLEVBQWdCO0FBQzFCZCxjQUFNb0MsRUFBTixDQUFTLE9BQVQsRUFBa0IsWUFBWTtBQUMxQmxDLHVCQUFXTSxJQUFJQyxJQUFKLENBQVNRLGVBQVQsQ0FBeUJvQixJQUF6QixDQUE4QnJDLE1BQU1zQyxPQUFOLEdBQWdCQyxFQUFoQixDQUFtQixDQUFuQixDQUE5QixDQUFYO0FBQ0F0QyxjQUFFdUMsSUFBRixDQUFPakIsb0JBQVAsRUFBNkJULElBQTdCLENBQWtDSCxpQkFBbEM7QUFDQVgsa0JBQU15QyxJQUFOO0FBQ0EsbUJBQU8sS0FBUDtBQUNILFNBTEQ7O0FBT0EzQjtBQUNILEtBVEQ7O0FBV0EsV0FBT2pCLE1BQVA7QUFDSCxDQTNITCIsImZpbGUiOiJzaXRlbWFwL3NpdGVtYXBfZ2VuZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzaXRlbWFwX2dlbmVyYXRvci5qcyAyMDE2LTA4LTIyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTaXRlbWFwIEdlbmVyYXRvciBDb250cm9sbGVyXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCBleGVjdXRlIHRoZSBzaXRlbWFwIGdlbmVyYXRpb25cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvc2l0ZW1hcF9nZW5lcmF0b3JcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ3NpdGVtYXBfZ2VuZXJhdG9yJyxcblxuICAgIFtcbiAgICAgICAgZ3guc291cmNlICsgJy9saWJzL2luZm9fbWVzc2FnZXMnLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIFxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIExvYWRpbmcgU3Bpbm5lciBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRzcGlubmVyLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge3VybDogJ2dtX3NpdGVtYXBfY3JlYXRvci5waHAnfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUmVmZXJlbmNlIHRvIHRoZSBpbmZvIG1lc3NhZ2VzIGxpYnJhcnlcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtZXNzYWdlcyA9IGpzZS5saWJzLmluZm9fbWVzc2FnZXMsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9jcmVhdGVTaXRlbWFwWG1sID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IG9wdGlvbnMudXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IG9wdGlvbnMucGFyYW1zXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gT24gc3VjY2Vzc1xuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5hZGRTdWNjZXNzKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubG9hZGluZ19zcGlubmVyLmhpZGUoJHNwaW5uZXIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLy8gT24gRmFpbHVyZVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5lcnJvcignUHJlcGFyZSBDb250ZW50IEVycm9yOiAnLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9wcmVwYXJlQ2F0ZWdvcmllcyA9IGZ1bmN0aW9uIChkZWZlcnJlZCkge1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gZGVmZXJyZWQgfHwgJC5EZWZlcnJlZCgpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogb3B0aW9ucy51cmwsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdwcmVwYXJlX2NhdGVnb3JpZXMnLFxuICAgICAgICAgICAgICAgICAgICBwYWdlX3Rva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIE9uIHN1Y2Nlc3NcbiAgICAgICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlcGVhdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ByZXBhcmVDYXRlZ29yaWVzKGRlZmVycmVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLy8gT24gRmFpbHVyZVxuICAgICAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBqc2UuY29yZS5kZWJ1Zy5lcnJvcignUHJlcGFyZSBDYXRlZ29yaWVzIEVycm9yOiAnLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcy5wYXJlbnRzKCkuZXEoMikpO1xuICAgICAgICAgICAgICAgICQud2hlbihfcHJlcGFyZUNhdGVnb3JpZXMoKSkuZG9uZShfY3JlYXRlU2l0ZW1hcFhtbCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuYmx1cigpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
