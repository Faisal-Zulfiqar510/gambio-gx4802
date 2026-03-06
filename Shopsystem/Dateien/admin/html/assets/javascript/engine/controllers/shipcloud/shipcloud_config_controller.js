'use strict';

/* --------------------------------------------------------------
 shipcloud_config_controller.js 2016-01-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// Module name
'shipcloud_config_controller',
// Module dependencies
[], function () {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var $this = $(this),
        module = {};

    // ------------------------------------------------------------------------

    var _initCarrierCheckboxes = function _initCarrierCheckboxes() {
        $('input[name="preselected_carriers[]"]').on('change', function (e) {
            if ($(this).get(0).checked == true) {
                $('input[name="checked_carriers[]"]', $(this).closest('tr')).removeAttr('disabled');
            } else {
                $('input[name="checked_carriers[]"]', $(this).closest('tr')).attr('disabled', 'disabled');
            }
        });
        $('input[name="preselected_carriers[]"]').trigger('change');
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the module, called by the engine.
     */
    module.init = function (done) {
        _initCarrierCheckboxes();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNoaXBjbG91ZC9zaGlwY2xvdWRfY29uZmlnX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsIiR0aGlzIiwiJCIsIl9pbml0Q2FycmllckNoZWNrYm94ZXMiLCJvbiIsImUiLCJnZXQiLCJjaGVja2VkIiwiY2xvc2VzdCIsInJlbW92ZUF0dHIiLCJhdHRyIiwidHJpZ2dlciIsImluaXQiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZjtBQUNJO0FBQ0EsNkJBRko7QUFHSTtBQUNBLEVBSkosRUFLSSxZQUFZO0FBQ1I7O0FBRUE7QUFDQTtBQUNBOztBQUVBLFFBQUlDLFFBQVFDLEVBQUUsSUFBRixDQUFaO0FBQUEsUUFDSUYsU0FBUyxFQURiOztBQUdBOztBQUVBLFFBQUlHLHlCQUF5QixTQUF6QkEsc0JBQXlCLEdBQVk7QUFDckNELFVBQUUsc0NBQUYsRUFBMENFLEVBQTFDLENBQTZDLFFBQTdDLEVBQXVELFVBQVVDLENBQVYsRUFBYTtBQUNoRSxnQkFBSUgsRUFBRSxJQUFGLEVBQVFJLEdBQVIsQ0FBWSxDQUFaLEVBQWVDLE9BQWYsSUFBMEIsSUFBOUIsRUFBb0M7QUFDaENMLGtCQUFFLGtDQUFGLEVBQXNDQSxFQUFFLElBQUYsRUFBUU0sT0FBUixDQUFnQixJQUFoQixDQUF0QyxFQUE2REMsVUFBN0QsQ0FBd0UsVUFBeEU7QUFDSCxhQUZELE1BRU87QUFDSFAsa0JBQUUsa0NBQUYsRUFBc0NBLEVBQUUsSUFBRixFQUFRTSxPQUFSLENBQWdCLElBQWhCLENBQXRDLEVBQTZERSxJQUE3RCxDQUFrRSxVQUFsRSxFQUE4RSxVQUE5RTtBQUNIO0FBQ0osU0FORDtBQU9BUixVQUFFLHNDQUFGLEVBQTBDUyxPQUExQyxDQUFrRCxRQUFsRDtBQUNILEtBVEQ7O0FBV0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQVgsV0FBT1ksSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJWO0FBQ0FVO0FBQ0gsS0FIRDs7QUFLQSxXQUFPYixNQUFQO0FBQ0gsQ0F6Q0wiLCJmaWxlIjoic2hpcGNsb3VkL3NoaXBjbG91ZF9jb25maWdfY29udHJvbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2hpcGNsb3VkX2NvbmZpZ19jb250cm9sbGVyLmpzIDIwMTYtMDEtMjdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgLy8gTW9kdWxlIG5hbWVcbiAgICAnc2hpcGNsb3VkX2NvbmZpZ19jb250cm9sbGVyJyxcbiAgICAvLyBNb2R1bGUgZGVwZW5kZW5jaWVzXG4gICAgW10sXG4gICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfaW5pdENhcnJpZXJDaGVja2JveGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cInByZXNlbGVjdGVkX2NhcnJpZXJzW11cIl0nKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5nZXQoMCkuY2hlY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJjaGVja2VkX2NhcnJpZXJzW11cIl0nLCAkKHRoaXMpLmNsb3Nlc3QoJ3RyJykpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cImNoZWNrZWRfY2FycmllcnNbXVwiXScsICQodGhpcykuY2xvc2VzdCgndHInKSkuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCJwcmVzZWxlY3RlZF9jYXJyaWVyc1tdXCJdJykudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgbW9kdWxlLCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIF9pbml0Q2FycmllckNoZWNrYm94ZXMoKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7XG4iXX0=
