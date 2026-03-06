'use strict';

/* --------------------------------------------------------------
 zones_handler.js 2017-05-31
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * The Component for handling the federal state dropdown depending on the country.
 * The field will be blacked out if there are no federal states for the selected
 * country.
 */
gx.compatibility.module('zones_handler', ['form', 'xhr'], function (data) {

    'use strict';

    // ########## VARIABLE INITIALIZATION ##########

    var $this = $(this),
        $states = $('select[name=entry_state]'),
        $selectedState = $('input[name=selected_zone_id]'),
        $statesFormGroup = $('select[name=entry_state]').closest('tr.no-hover'),
        defaults = {
        loadStates: 'admin.php?do=Zones',
        country: 'select[name=entry_country_id]'
    },
        options = $.extend(true, {}, defaults, data),
        module = {};

    var _changeHandler = function _changeHandler() {

        var dataset = jse.libs.form.getData($this);

        jse.libs.xhr.ajax({ url: options.loadStates, data: dataset }, true).done(function (result) {

            if (result.success) {

                $states.children('option').remove();
                $selectedState.prop("disabled", false);
                $states.prop("disabled", false);

                $.each(result.data, function (key, value) {
                    if (options.nameinsteadofid == true) {
                        value.id = value.name;
                    }

                    if (value.selected) {
                        $states.append($("<option selected/>").val(value.id).text(value.name));
                    } else {
                        $states.append($("<option />").val(value.id).text(value.name));
                    }
                });

                $statesFormGroup.show();
            } else {

                $statesFormGroup.hide().prop("disabled", true);
                $selectedState.prop("disabled", true);
                $states.prop("disabled", true);
            }
        });
    };

    // ########## INITIALIZATION ##########

    /**
     * Init function of the widget
     * @constructor
     */
    module.init = function (done) {

        _changeHandler();

        $this.on('change', options.country, _changeHandler);

        done();
    };

    // Return data to widget engine
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbWVycy96b25lc19oYW5kbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkc3RhdGVzIiwiJHNlbGVjdGVkU3RhdGUiLCIkc3RhdGVzRm9ybUdyb3VwIiwiY2xvc2VzdCIsImRlZmF1bHRzIiwibG9hZFN0YXRlcyIsImNvdW50cnkiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX2NoYW5nZUhhbmRsZXIiLCJkYXRhc2V0IiwianNlIiwibGlicyIsImZvcm0iLCJnZXREYXRhIiwieGhyIiwiYWpheCIsInVybCIsImRvbmUiLCJyZXN1bHQiLCJzdWNjZXNzIiwiY2hpbGRyZW4iLCJyZW1vdmUiLCJwcm9wIiwiZWFjaCIsImtleSIsInZhbHVlIiwibmFtZWluc3RlYWRvZmlkIiwiaWQiLCJuYW1lIiwic2VsZWN0ZWQiLCJhcHBlbmQiLCJ2YWwiLCJ0ZXh0Iiwic2hvdyIsImhpZGUiLCJpbml0Iiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxlQURKLEVBR0ksQ0FDSSxNQURKLEVBRUksS0FGSixDQUhKLEVBUUksVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTs7QUFFQSxRQUFJQyxRQUFRQyxFQUFFLElBQUYsQ0FBWjtBQUFBLFFBQ0lDLFVBQVVELEVBQUUsMEJBQUYsQ0FEZDtBQUFBLFFBRUlFLGlCQUFpQkYsRUFBRSw4QkFBRixDQUZyQjtBQUFBLFFBR0lHLG1CQUFtQkgsRUFBRSwwQkFBRixFQUE4QkksT0FBOUIsQ0FBc0MsYUFBdEMsQ0FIdkI7QUFBQSxRQUtJQyxXQUFXO0FBQ1BDLG9CQUFZLG9CQURMO0FBRVBDLGlCQUFTO0FBRkYsS0FMZjtBQUFBLFFBU0lDLFVBQVVSLEVBQUVTLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkosUUFBbkIsRUFBNkJQLElBQTdCLENBVGQ7QUFBQSxRQVVJRCxTQUFTLEVBVmI7O0FBWUEsUUFBSWEsaUJBQWlCLFNBQWpCQSxjQUFpQixHQUFZOztBQUU3QixZQUFJQyxVQUFVQyxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsT0FBZCxDQUFzQmhCLEtBQXRCLENBQWQ7O0FBRUFhLFlBQUlDLElBQUosQ0FBU0csR0FBVCxDQUFhQyxJQUFiLENBQWtCLEVBQUNDLEtBQUtWLFFBQVFGLFVBQWQsRUFBMEJSLE1BQU1hLE9BQWhDLEVBQWxCLEVBQTRELElBQTVELEVBQWtFUSxJQUFsRSxDQUF1RSxVQUFVQyxNQUFWLEVBQWtCOztBQUVyRixnQkFBSUEsT0FBT0MsT0FBWCxFQUFvQjs7QUFFaEJwQix3QkFBUXFCLFFBQVIsQ0FBaUIsUUFBakIsRUFBMkJDLE1BQTNCO0FBQ0FyQiwrQkFBZXNCLElBQWYsQ0FBb0IsVUFBcEIsRUFBZ0MsS0FBaEM7QUFDQXZCLHdCQUFRdUIsSUFBUixDQUFhLFVBQWIsRUFBeUIsS0FBekI7O0FBRUF4QixrQkFBRXlCLElBQUYsQ0FBT0wsT0FBT3RCLElBQWQsRUFBb0IsVUFBVTRCLEdBQVYsRUFBZUMsS0FBZixFQUFzQjtBQUN0Qyx3QkFBSW5CLFFBQVFvQixlQUFSLElBQTJCLElBQS9CLEVBQXFDO0FBQ2pDRCw4QkFBTUUsRUFBTixHQUFXRixNQUFNRyxJQUFqQjtBQUNIOztBQUVELHdCQUFJSCxNQUFNSSxRQUFWLEVBQW9CO0FBQ2hCOUIsZ0NBQVErQixNQUFSLENBQWVoQyxFQUFFLG9CQUFGLEVBQXdCaUMsR0FBeEIsQ0FBNEJOLE1BQU1FLEVBQWxDLEVBQXNDSyxJQUF0QyxDQUEyQ1AsTUFBTUcsSUFBakQsQ0FBZjtBQUNILHFCQUZELE1BRU87QUFDSDdCLGdDQUFRK0IsTUFBUixDQUFlaEMsRUFBRSxZQUFGLEVBQWdCaUMsR0FBaEIsQ0FBb0JOLE1BQU1FLEVBQTFCLEVBQThCSyxJQUE5QixDQUFtQ1AsTUFBTUcsSUFBekMsQ0FBZjtBQUNIO0FBQ0osaUJBVkQ7O0FBWUEzQixpQ0FBaUJnQyxJQUFqQjtBQUVILGFBcEJELE1Bb0JPOztBQUVIaEMsaUNBQWlCaUMsSUFBakIsR0FBd0JaLElBQXhCLENBQTZCLFVBQTdCLEVBQXlDLElBQXpDO0FBQ0F0QiwrQkFBZXNCLElBQWYsQ0FBb0IsVUFBcEIsRUFBZ0MsSUFBaEM7QUFDQXZCLHdCQUFRdUIsSUFBUixDQUFhLFVBQWIsRUFBeUIsSUFBekI7QUFFSDtBQUVKLFNBOUJEO0FBZ0NILEtBcENEOztBQXNDQTs7QUFFQTs7OztBQUlBM0IsV0FBT3dDLElBQVAsR0FBYyxVQUFVbEIsSUFBVixFQUFnQjs7QUFFMUJUOztBQUVBWCxjQUFNdUMsRUFBTixDQUFTLFFBQVQsRUFBbUI5QixRQUFRRCxPQUEzQixFQUFvQ0csY0FBcEM7O0FBRUFTO0FBQ0gsS0FQRDs7QUFTQTtBQUNBLFdBQU90QixNQUFQO0FBQ0gsQ0FqRkwiLCJmaWxlIjoiY3VzdG9tZXJzL3pvbmVzX2hhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHpvbmVzX2hhbmRsZXIuanMgMjAxNy0wNS0zMVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogVGhlIENvbXBvbmVudCBmb3IgaGFuZGxpbmcgdGhlIGZlZGVyYWwgc3RhdGUgZHJvcGRvd24gZGVwZW5kaW5nIG9uIHRoZSBjb3VudHJ5LlxuICogVGhlIGZpZWxkIHdpbGwgYmUgYmxhY2tlZCBvdXQgaWYgdGhlcmUgYXJlIG5vIGZlZGVyYWwgc3RhdGVzIGZvciB0aGUgc2VsZWN0ZWRcbiAqIGNvdW50cnkuXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICd6b25lc19oYW5kbGVyJyxcblxuICAgIFtcbiAgICAgICAgJ2Zvcm0nLFxuICAgICAgICAneGhyJ1xuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAjIyMjIyMjIyMjIFZBUklBQkxFIElOSVRJQUxJWkFUSU9OICMjIyMjIyMjIyNcblxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgJHN0YXRlcyA9ICQoJ3NlbGVjdFtuYW1lPWVudHJ5X3N0YXRlXScpLFxuICAgICAgICAgICAgJHNlbGVjdGVkU3RhdGUgPSAkKCdpbnB1dFtuYW1lPXNlbGVjdGVkX3pvbmVfaWRdJyksXG4gICAgICAgICAgICAkc3RhdGVzRm9ybUdyb3VwID0gJCgnc2VsZWN0W25hbWU9ZW50cnlfc3RhdGVdJykuY2xvc2VzdCgndHIubm8taG92ZXInKSxcblxuICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgbG9hZFN0YXRlczogJ2FkbWluLnBocD9kbz1ab25lcycsXG4gICAgICAgICAgICAgICAgY291bnRyeTogJ3NlbGVjdFtuYW1lPWVudHJ5X2NvdW50cnlfaWRdJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIHZhciBfY2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyIGRhdGFzZXQgPSBqc2UubGlicy5mb3JtLmdldERhdGEoJHRoaXMpO1xuXG4gICAgICAgICAgICBqc2UubGlicy54aHIuYWpheCh7dXJsOiBvcHRpb25zLmxvYWRTdGF0ZXMsIGRhdGE6IGRhdGFzZXR9LCB0cnVlKS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZXMuY2hpbGRyZW4oJ29wdGlvbicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0ZWRTdGF0ZS5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGVzLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHJlc3VsdC5kYXRhLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubmFtZWluc3RlYWRvZmlkID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5pZCA9IHZhbHVlLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZXMuYXBwZW5kKCQoXCI8b3B0aW9uIHNlbGVjdGVkLz5cIikudmFsKHZhbHVlLmlkKS50ZXh0KHZhbHVlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlcy5hcHBlbmQoJChcIjxvcHRpb24gLz5cIikudmFsKHZhbHVlLmlkKS50ZXh0KHZhbHVlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlc0Zvcm1Hcm91cC5zaG93KCk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZXNGb3JtR3JvdXAuaGlkZSgpLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdGVkU3RhdGUucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAkc3RhdGVzLnByb3AoXCJkaXNhYmxlZFwiLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvLyAjIyMjIyMjIyMjIElOSVRJQUxJWkFUSU9OICMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBmdW5jdGlvbiBvZiB0aGUgd2lkZ2V0XG4gICAgICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAgICAgKi9cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICAgICAgICBfY2hhbmdlSGFuZGxlcigpO1xuXG4gICAgICAgICAgICAkdGhpcy5vbignY2hhbmdlJywgb3B0aW9ucy5jb3VudHJ5LCBfY2hhbmdlSGFuZGxlcik7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZXR1cm4gZGF0YSB0byB3aWRnZXQgZW5naW5lXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
