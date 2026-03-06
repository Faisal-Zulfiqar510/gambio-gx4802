'use strict';

/* --------------------------------------------------------------
 scheme_general_configuration.js 2017-11-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gxmodules.controllers.module('scheme_general_configuration', [], function (data) {
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
    var defaults = {
        'exportTypeSelection': '#cronjob-hour-interval-selection',
        'hourSelection': '#cronjob-hour',
        'intervalSelection': '#cronjob-interval'
    };

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
    // HELPER FUNCTIONS
    // ------------------------------------------------------------------------

    function _enableIntervalSelection() {
        $(options.hourSelection).attr('disabled', 'disabled');
        $(options.intervalSelection).removeAttr('disabled');
    }

    function _enableHourSelection() {
        $(options.intervalSelection).attr('disabled', 'disabled');
        $(options.hourSelection).removeAttr('disabled');
    }

    function _checkExportTypeSelection() {
        var selectionValue = $(options.exportTypeSelection).val();

        if (selectionValue === 'hour') {
            _enableHourSelection();
        } else {
            _enableIntervalSelection();
        }
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        $(document).ready(function () {
            _checkExportTypeSelection();
        });

        $(options.exportTypeSelection).on('change', function () {
            _checkExportTypeSelection();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvc2NoZW1lX2dlbmVyYWxfY29uZmlndXJhdGlvbi5qcyJdLCJuYW1lcyI6WyJneG1vZHVsZXMiLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfZW5hYmxlSW50ZXJ2YWxTZWxlY3Rpb24iLCJob3VyU2VsZWN0aW9uIiwiYXR0ciIsImludGVydmFsU2VsZWN0aW9uIiwicmVtb3ZlQXR0ciIsIl9lbmFibGVIb3VyU2VsZWN0aW9uIiwiX2NoZWNrRXhwb3J0VHlwZVNlbGVjdGlvbiIsInNlbGVjdGlvblZhbHVlIiwiZXhwb3J0VHlwZVNlbGVjdGlvbiIsInZhbCIsImluaXQiLCJkb25lIiwiZG9jdW1lbnQiLCJyZWFkeSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLFVBQVVDLFdBQVYsQ0FBc0JDLE1BQXRCLENBQ0ksOEJBREosRUFHSSxFQUhKLEVBS0ksVUFBVUMsSUFBVixFQUFnQjtBQUNaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVztBQUNiLCtCQUF1QixrQ0FEVjtBQUViLHlCQUFpQixlQUZKO0FBR2IsNkJBQXFCO0FBSFIsS0FBakI7O0FBTUE7Ozs7O0FBS0EsUUFBTUMsVUFBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTUQsU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxhQUFTTyx3QkFBVCxHQUFvQztBQUNoQ0osVUFBRUUsUUFBUUcsYUFBVixFQUF5QkMsSUFBekIsQ0FBOEIsVUFBOUIsRUFBMEMsVUFBMUM7QUFDQU4sVUFBRUUsUUFBUUssaUJBQVYsRUFBNkJDLFVBQTdCLENBQXdDLFVBQXhDO0FBQ0g7O0FBRUQsYUFBU0Msb0JBQVQsR0FBZ0M7QUFDNUJULFVBQUVFLFFBQVFLLGlCQUFWLEVBQTZCRCxJQUE3QixDQUFrQyxVQUFsQyxFQUE4QyxVQUE5QztBQUNBTixVQUFFRSxRQUFRRyxhQUFWLEVBQXlCRyxVQUF6QixDQUFvQyxVQUFwQztBQUNIOztBQUVELGFBQVNFLHlCQUFULEdBQXFDO0FBQ2pDLFlBQU1DLGlCQUFpQlgsRUFBRUUsUUFBUVUsbUJBQVYsRUFBK0JDLEdBQS9CLEVBQXZCOztBQUVBLFlBQUlGLG1CQUFtQixNQUF2QixFQUErQjtBQUMzQkY7QUFDSCxTQUZELE1BRU87QUFDSEw7QUFDSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTs7QUFFQVAsV0FBT2lCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCOztBQUUxQmYsVUFBRWdCLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFZO0FBQzFCUDtBQUNILFNBRkQ7O0FBSUFWLFVBQUVFLFFBQVFVLG1CQUFWLEVBQStCTSxFQUEvQixDQUFrQyxRQUFsQyxFQUE0QyxZQUFZO0FBQ3BEUjtBQUNILFNBRkQ7O0FBSUFLO0FBQ0gsS0FYRDs7QUFhQSxXQUFPbEIsTUFBUDtBQUNILENBdEZMIiwiZmlsZSI6IkFkbWluL0phdmFzY3JpcHQvY29udHJvbGxlcnMvc2NoZW1lX2dlbmVyYWxfY29uZmlndXJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2NoZW1lX2dlbmVyYWxfY29uZmlndXJhdGlvbi5qcyAyMDE3LTExLTIxXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuZ3htb2R1bGVzLmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc2NoZW1lX2dlbmVyYWxfY29uZmlndXJhdGlvbicsXG5cbiAgICBbXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgJ2V4cG9ydFR5cGVTZWxlY3Rpb24nOiAnI2Nyb25qb2ItaG91ci1pbnRlcnZhbC1zZWxlY3Rpb24nLFxuICAgICAgICAgICAgJ2hvdXJTZWxlY3Rpb24nOiAnI2Nyb25qb2ItaG91cicsXG4gICAgICAgICAgICAnaW50ZXJ2YWxTZWxlY3Rpb24nOiAnI2Nyb25qb2ItaW50ZXJ2YWwnXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSEVMUEVSIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBmdW5jdGlvbiBfZW5hYmxlSW50ZXJ2YWxTZWxlY3Rpb24oKSB7XG4gICAgICAgICAgICAkKG9wdGlvbnMuaG91clNlbGVjdGlvbikuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICQob3B0aW9ucy5pbnRlcnZhbFNlbGVjdGlvbikucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIF9lbmFibGVIb3VyU2VsZWN0aW9uKCkge1xuICAgICAgICAgICAgJChvcHRpb25zLmludGVydmFsU2VsZWN0aW9uKS5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgJChvcHRpb25zLmhvdXJTZWxlY3Rpb24pLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBfY2hlY2tFeHBvcnRUeXBlU2VsZWN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uVmFsdWUgPSAkKG9wdGlvbnMuZXhwb3J0VHlwZVNlbGVjdGlvbikudmFsKCk7XG5cbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25WYWx1ZSA9PT0gJ2hvdXInKSB7XG4gICAgICAgICAgICAgICAgX2VuYWJsZUhvdXJTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX2VuYWJsZUludGVydmFsU2VsZWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX2NoZWNrRXhwb3J0VHlwZVNlbGVjdGlvbigpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQob3B0aW9ucy5leHBvcnRUeXBlU2VsZWN0aW9uKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF9jaGVja0V4cG9ydFR5cGVTZWxlY3Rpb24oKVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pOyJdfQ==
