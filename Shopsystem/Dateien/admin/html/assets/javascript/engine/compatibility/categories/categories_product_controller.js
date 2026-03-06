'use strict';

/* --------------------------------------------------------------
 categories_product_controller.js 2015-10-15 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Categories Product Controller
 *
 * This controller contains the mapping logic of the categories save/update buttons.
 *
 * @module Compatibility/categories_product_controller
 */
gx.compatibility.module('categories_product_controller', [gx.source + '/libs/button_dropdown'],

/**  @lends module:Compatibility/categories_product_controller */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @var {object}
     */
    $this = $(this),


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // OPERATIONS
    // ------------------------------------------------------------------------
    var _init = function _init() {
        // Hide the original buttons
        $('[name="gm_update"]').hide();
        $('[name="save_original"]').hide();

        // Map the new save option to the old save button
        jse.libs.button_dropdown.mapAction($this, 'BUTTON_SAVE', 'admin_buttons', function (event) {
            $('[name="save_original"]').trigger('click');
        });

        // Map the new update option to the old update button
        jse.libs.button_dropdown.mapAction($this, 'BUTTON_UPDATE', 'admin_buttons', function (event) {
            $('[name="gm_update"]').trigger('click');
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        _init();
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGVnb3JpZXMvY2F0ZWdvcmllc19wcm9kdWN0X2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9pbml0IiwiaGlkZSIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJtYXBBY3Rpb24iLCJldmVudCIsInRyaWdnZXIiLCJpbml0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksK0JBREosRUFHSSxDQUNJRixHQUFHRyxNQUFILEdBQVksdUJBRGhCLENBSEo7O0FBT0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxlQUFXLEVBYmY7OztBQWVJOzs7OztBQUtBQyxjQUFVRixFQUFFRyxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJGLFFBQW5CLEVBQTZCSCxJQUE3QixDQXBCZDs7O0FBc0JJOzs7OztBQUtBRixhQUFTLEVBM0JiOztBQTZCQTtBQUNBO0FBQ0E7QUFDQSxRQUFJUSxRQUFRLFNBQVJBLEtBQVEsR0FBWTtBQUNwQjtBQUNBSixVQUFFLG9CQUFGLEVBQXdCSyxJQUF4QjtBQUNBTCxVQUFFLHdCQUFGLEVBQTRCSyxJQUE1Qjs7QUFFQTtBQUNBQyxZQUFJQyxJQUFKLENBQVNDLGVBQVQsQ0FBeUJDLFNBQXpCLENBQW1DVixLQUFuQyxFQUEwQyxhQUExQyxFQUF5RCxlQUF6RCxFQUEwRSxVQUFVVyxLQUFWLEVBQWlCO0FBQ3ZGVixjQUFFLHdCQUFGLEVBQTRCVyxPQUE1QixDQUFvQyxPQUFwQztBQUNILFNBRkQ7O0FBSUE7QUFDQUwsWUFBSUMsSUFBSixDQUFTQyxlQUFULENBQXlCQyxTQUF6QixDQUFtQ1YsS0FBbkMsRUFBMEMsZUFBMUMsRUFBMkQsZUFBM0QsRUFBNEUsVUFBVVcsS0FBVixFQUFpQjtBQUN6RlYsY0FBRSxvQkFBRixFQUF3QlcsT0FBeEIsQ0FBZ0MsT0FBaEM7QUFDSCxTQUZEO0FBR0gsS0FkRDs7QUFnQkE7QUFDQTtBQUNBOztBQUVBZixXQUFPZ0IsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUJUO0FBQ0FTO0FBQ0gsS0FIRDs7QUFLQSxXQUFPakIsTUFBUDtBQUNILENBM0VMIiwiZmlsZSI6ImNhdGVnb3JpZXMvY2F0ZWdvcmllc19wcm9kdWN0X2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNhdGVnb3JpZXNfcHJvZHVjdF9jb250cm9sbGVyLmpzIDIwMTUtMTAtMTUgZ21cbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE1IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIENhdGVnb3JpZXMgUHJvZHVjdCBDb250cm9sbGVyXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGNvbnRhaW5zIHRoZSBtYXBwaW5nIGxvZ2ljIG9mIHRoZSBjYXRlZ29yaWVzIHNhdmUvdXBkYXRlIGJ1dHRvbnMuXG4gKlxuICogQG1vZHVsZSBDb21wYXRpYmlsaXR5L2NhdGVnb3JpZXNfcHJvZHVjdF9jb250cm9sbGVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdjYXRlZ29yaWVzX3Byb2R1Y3RfY29udHJvbGxlcicsXG5cbiAgICBbXG4gICAgICAgIGd4LnNvdXJjZSArICcvbGlicy9idXR0b25fZHJvcGRvd24nXG4gICAgXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L2NhdGVnb3JpZXNfcHJvZHVjdF9jb250cm9sbGVyICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBPUEVSQVRJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB2YXIgX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBvcmlnaW5hbCBidXR0b25zXG4gICAgICAgICAgICAkKCdbbmFtZT1cImdtX3VwZGF0ZVwiXScpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJ1tuYW1lPVwic2F2ZV9vcmlnaW5hbFwiXScpLmhpZGUoKTtcblxuICAgICAgICAgICAgLy8gTWFwIHRoZSBuZXcgc2F2ZSBvcHRpb24gdG8gdGhlIG9sZCBzYXZlIGJ1dHRvblxuICAgICAgICAgICAganNlLmxpYnMuYnV0dG9uX2Ryb3Bkb3duLm1hcEFjdGlvbigkdGhpcywgJ0JVVFRPTl9TQVZFJywgJ2FkbWluX2J1dHRvbnMnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAkKCdbbmFtZT1cInNhdmVfb3JpZ2luYWxcIl0nKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIE1hcCB0aGUgbmV3IHVwZGF0ZSBvcHRpb24gdG8gdGhlIG9sZCB1cGRhdGUgYnV0dG9uXG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24ubWFwQWN0aW9uKCR0aGlzLCAnQlVUVE9OX1VQREFURScsICdhZG1pbl9idXR0b25zJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgJCgnW25hbWU9XCJnbV91cGRhdGVcIl0nKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIF9pbml0KCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
