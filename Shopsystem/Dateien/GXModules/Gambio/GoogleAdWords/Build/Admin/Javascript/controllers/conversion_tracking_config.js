'use strict';

/* --------------------------------------------------------------
 campaigns_overview.js 2017-12-14
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module('conversion_tracking_config', [], function (data) {
    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default Options
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final Options
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

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------
    var _selectReadOnlyFields = function _selectReadOnlyFields(option) {
        var conversionIdInput = document.getElementById('conversion-id');
        var conversionActionIdInput = document.getElementById('conversion-action-id');

        conversionIdInput.value = option.getAttribute('data-conversion-id');
        conversionActionIdInput.value = option.getAttribute('data-conversion-action-id');
    };

    // ------------------------------------------------------------------------
    // EVENT HANDLERS
    // ------------------------------------------------------------------------


    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        var conversionNameSelect = document.getElementById('conversion-name');

        if (conversionNameSelect) {
            conversionNameSelect.addEventListener('change', function (event) {
                var option = event.target.selectedOptions[0];

                _selectReadOnlyFields(option);
            });
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvY29udmVyc2lvbl90cmFja2luZ19jb25maWcuanMiXSwibmFtZXMiOlsiZ3htb2R1bGVzIiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX3NlbGVjdFJlYWRPbmx5RmllbGRzIiwiY29udmVyc2lvbklkSW5wdXQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiY29udmVyc2lvbkFjdGlvbklkSW5wdXQiLCJ2YWx1ZSIsIm9wdGlvbiIsImdldEF0dHJpYnV0ZSIsImluaXQiLCJkb25lIiwiY29udmVyc2lvbk5hbWVTZWxlY3QiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ0YXJnZXQiLCJzZWxlY3RlZE9wdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsVUFBVUMsV0FBVixDQUFzQkMsTUFBdEIsQ0FDSSw0QkFESixFQUdJLEVBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLFFBQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1ELFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFNTyx3QkFBd0IsU0FBeEJBLHFCQUF3QixTQUFVO0FBQ3BDLFlBQU1DLG9CQUFvQkMsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixDQUExQjtBQUNBLFlBQU1DLDBCQUEwQkYsU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIsQ0FBaEM7O0FBRUFGLDBCQUFrQkksS0FBbEIsR0FBMEJDLE9BQU9DLFlBQVAsQ0FBb0Isb0JBQXBCLENBQTFCO0FBQ0FILGdDQUF3QkMsS0FBeEIsR0FBZ0NDLE9BQU9DLFlBQVAsQ0FBb0IsMkJBQXBCLENBQWhDO0FBQ0gsS0FORDs7QUFRQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQWQsV0FBT2UsSUFBUCxHQUFjLFVBQUNDLElBQUQsRUFBVTtBQUNwQixZQUFNQyx1QkFBdUJSLFNBQVNDLGNBQVQsQ0FBd0IsaUJBQXhCLENBQTdCOztBQUVBLFlBQUlPLG9CQUFKLEVBQTBCO0FBQ3RCQSxpQ0FBcUJDLGdCQUFyQixDQUFzQyxRQUF0QyxFQUFnRCxVQUFVQyxLQUFWLEVBQWlCO0FBQzdELG9CQUFNTixTQUFTTSxNQUFNQyxNQUFOLENBQWFDLGVBQWIsQ0FBNkIsQ0FBN0IsQ0FBZjs7QUFFQWQsc0NBQXNCTSxNQUF0QjtBQUNILGFBSkQ7QUFLSDs7QUFFREc7QUFDSCxLQVpEOztBQWNBLFdBQU9oQixNQUFQO0FBQ0gsQ0EzRUwiLCJmaWxlIjoiQWRtaW4vSmF2YXNjcmlwdC9jb250cm9sbGVycy9jb252ZXJzaW9uX3RyYWNraW5nX2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY2FtcGFpZ25zX292ZXJ2aWV3LmpzIDIwMTctMTItMTRcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neG1vZHVsZXMuY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdjb252ZXJzaW9uX3RyYWNraW5nX2NvbmZpZycsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBjb25zdCBfc2VsZWN0UmVhZE9ubHlGaWVsZHMgPSBvcHRpb24gPT4ge1xuICAgICAgICAgICAgY29uc3QgY29udmVyc2lvbklkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udmVyc2lvbi1pZCcpO1xuICAgICAgICAgICAgY29uc3QgY29udmVyc2lvbkFjdGlvbklkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udmVyc2lvbi1hY3Rpb24taWQnKTtcblxuICAgICAgICAgICAgY29udmVyc2lvbklkSW5wdXQudmFsdWUgPSBvcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnZlcnNpb24taWQnKTtcbiAgICAgICAgICAgIGNvbnZlcnNpb25BY3Rpb25JZElucHV0LnZhbHVlID0gb3B0aW9uLmdldEF0dHJpYnV0ZSgnZGF0YS1jb252ZXJzaW9uLWFjdGlvbi1pZCcpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IChkb25lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb252ZXJzaW9uTmFtZVNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb252ZXJzaW9uLW5hbWUnKTtcblxuICAgICAgICAgICAgaWYgKGNvbnZlcnNpb25OYW1lU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgY29udmVyc2lvbk5hbWVTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnNbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgX3NlbGVjdFJlYWRPbmx5RmllbGRzKG9wdGlvbik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
