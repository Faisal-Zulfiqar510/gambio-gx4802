'use strict';

/* --------------------------------------------------------------
 images_input.js 2017-09-21
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Product Images Input Fields Controller
 *
 * This controller adds indices to the images input
 *
 * @module Controllers/images_input
 */
gx.controllers.module('images_input', [], function () {
    var elements = {
        module: $(this)
    };

    var selectors = {
        imageWrapper: '.product-image-wrapper',
        inputs: {
            showImageCheckbox: '[data-show-image]'
        }
    };

    var module = {};

    function onFormSubmit() {
        var imageWrappers = elements.module.find(selectors.imageWrapper);

        function modifyShowImageCheckbox(index, element) {
            var inputElement = $(element).find(selectors.inputs.showImageCheckbox);
            var isChecked = inputElement.parent().hasClass('checked');

            inputElement.attr('name', 'image_show[' + index + ']').val(isChecked ? 'on' : 'off');
        }

        imageWrappers.each(modifyShowImageCheckbox);
    }

    module.init = function (done) {
        elements.module.on('submit', onFormSubmit);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2R1Y3QvaW1hZ2VzX2lucHV0LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJlbGVtZW50cyIsIiQiLCJzZWxlY3RvcnMiLCJpbWFnZVdyYXBwZXIiLCJpbnB1dHMiLCJzaG93SW1hZ2VDaGVja2JveCIsIm9uRm9ybVN1Ym1pdCIsImltYWdlV3JhcHBlcnMiLCJmaW5kIiwibW9kaWZ5U2hvd0ltYWdlQ2hlY2tib3giLCJpbmRleCIsImVsZW1lbnQiLCJpbnB1dEVsZW1lbnQiLCJpc0NoZWNrZWQiLCJwYXJlbnQiLCJoYXNDbGFzcyIsImF0dHIiLCJ2YWwiLCJlYWNoIiwiaW5pdCIsIm9uIiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGNBREosRUFHSSxFQUhKLEVBS0ksWUFBWTtBQUNSLFFBQU1DLFdBQVc7QUFDYkQsZ0JBQVFFLEVBQUUsSUFBRjtBQURLLEtBQWpCOztBQUlBLFFBQU1DLFlBQVk7QUFDZEMsc0JBQWMsd0JBREE7QUFFZEMsZ0JBQVE7QUFDSkMsK0JBQW1CO0FBRGY7QUFGTSxLQUFsQjs7QUFPQSxRQUFNTixTQUFTLEVBQWY7O0FBRUEsYUFBU08sWUFBVCxHQUF3QjtBQUNwQixZQUFNQyxnQkFBZ0JQLFNBQVNELE1BQVQsQ0FBZ0JTLElBQWhCLENBQXFCTixVQUFVQyxZQUEvQixDQUF0Qjs7QUFFQSxpQkFBU00sdUJBQVQsQ0FBaUNDLEtBQWpDLEVBQXdDQyxPQUF4QyxFQUFpRDtBQUM3QyxnQkFBTUMsZUFBZVgsRUFBRVUsT0FBRixFQUFXSCxJQUFYLENBQWdCTixVQUFVRSxNQUFWLENBQWlCQyxpQkFBakMsQ0FBckI7QUFDQSxnQkFBTVEsWUFBWUQsYUFBYUUsTUFBYixHQUFzQkMsUUFBdEIsQ0FBK0IsU0FBL0IsQ0FBbEI7O0FBRUFILHlCQUNLSSxJQURMLENBQ1UsTUFEVixrQkFDZ0NOLEtBRGhDLFFBRUtPLEdBRkwsQ0FFU0osWUFBWSxJQUFaLEdBQW1CLEtBRjVCO0FBR0g7O0FBRUROLHNCQUFjVyxJQUFkLENBQW1CVCx1QkFBbkI7QUFDSDs7QUFFRFYsV0FBT29CLElBQVAsR0FBYyxnQkFBUTtBQUNsQm5CLGlCQUFTRCxNQUFULENBQWdCcUIsRUFBaEIsQ0FBbUIsUUFBbkIsRUFBNkJkLFlBQTdCOztBQUVBZTtBQUNILEtBSkQ7O0FBTUEsV0FBT3RCLE1BQVA7QUFDSCxDQXpDTCIsImZpbGUiOiJwcm9kdWN0L2ltYWdlc19pbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gaW1hZ2VzX2lucHV0LmpzIDIwMTctMDktMjFcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFByb2R1Y3QgSW1hZ2VzIElucHV0IEZpZWxkcyBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGFkZHMgaW5kaWNlcyB0byB0aGUgaW1hZ2VzIGlucHV0XG4gKlxuICogQG1vZHVsZSBDb250cm9sbGVycy9pbWFnZXNfaW5wdXRcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdpbWFnZXNfaW5wdXQnLFxuXG4gICAgW10sXG5cbiAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0ge1xuICAgICAgICAgICAgbW9kdWxlOiAkKHRoaXMpXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0ge1xuICAgICAgICAgICAgaW1hZ2VXcmFwcGVyOiAnLnByb2R1Y3QtaW1hZ2Utd3JhcHBlcicsXG4gICAgICAgICAgICBpbnB1dHM6IHtcbiAgICAgICAgICAgICAgICBzaG93SW1hZ2VDaGVja2JveDogJ1tkYXRhLXNob3ctaW1hZ2VdJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uRm9ybVN1Ym1pdCgpIHtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlV3JhcHBlcnMgPSBlbGVtZW50cy5tb2R1bGUuZmluZChzZWxlY3RvcnMuaW1hZ2VXcmFwcGVyKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gbW9kaWZ5U2hvd0ltYWdlQ2hlY2tib3goaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dEVsZW1lbnQgPSAkKGVsZW1lbnQpLmZpbmQoc2VsZWN0b3JzLmlucHV0cy5zaG93SW1hZ2VDaGVja2JveCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDaGVja2VkID0gaW5wdXRFbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKCdjaGVja2VkJyk7XG5cbiAgICAgICAgICAgICAgICBpbnB1dEVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ25hbWUnLCBgaW1hZ2Vfc2hvd1ske2luZGV4fV1gKVxuICAgICAgICAgICAgICAgICAgICAudmFsKGlzQ2hlY2tlZCA/ICdvbicgOiAnb2ZmJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGltYWdlV3JhcHBlcnMuZWFjaChtb2RpZnlTaG93SW1hZ2VDaGVja2JveCk7XG4gICAgICAgIH1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgZWxlbWVudHMubW9kdWxlLm9uKCdzdWJtaXQnLCBvbkZvcm1TdWJtaXQpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
