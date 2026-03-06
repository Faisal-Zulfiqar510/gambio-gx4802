'use strict';

/* --------------------------------------------------------------
 close_alert_box.js 2016-08-25 
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Close Alert Box
 *
 * This module will hide an alert box by clicking a button with the class "close".
 *
 * @module Compatibility/close_alert_box
 */
gx.compatibility.module('close_alert_box', ['user_configuration_service'],

/**  @lends module:Compatibility/close_alert_box */

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
     * UserConfigurationService Alias
     *
     * @type {object}
     */
    userConfigurationService = jse.libs.user_configuration_service,


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
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        var $createNewWrapper = $('.create-new-wrapper');

        $this.find('button.close').on('click', function () {

            $(this).parent('.alert').hide();

            if (options.user_config_key !== undefined && options.user_config_value !== undefined) {
                userConfigurationService.set({
                    data: {
                        userId: options.user_id,
                        configurationKey: options.user_config_key,
                        configurationValue: options.user_config_value
                    }
                });
            }

            if ($createNewWrapper.length > 0 && $('.message_stack_container .alert').length - 1 === 0) {
                $createNewWrapper.removeClass('message-stack-active');
            }
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsb3NlX2FsZXJ0X2JveC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJ1c2VyQ29uZmlndXJhdGlvblNlcnZpY2UiLCJqc2UiLCJsaWJzIiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCJvcHRpb25zIiwiZXh0ZW5kIiwiaW5pdCIsImRvbmUiLCIkY3JlYXRlTmV3V3JhcHBlciIsImZpbmQiLCJvbiIsInBhcmVudCIsImhpZGUiLCJ1c2VyX2NvbmZpZ19rZXkiLCJ1bmRlZmluZWQiLCJ1c2VyX2NvbmZpZ192YWx1ZSIsInNldCIsInVzZXJJZCIsInVzZXJfaWQiLCJjb25maWd1cmF0aW9uS2V5IiwiY29uZmlndXJhdGlvblZhbHVlIiwibGVuZ3RoIiwicmVtb3ZlQ2xhc3MiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxhQUFILENBQWlCQyxNQUFqQixDQUNJLGlCQURKLEVBR0ksQ0FBQyw0QkFBRCxDQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsK0JBQTJCQyxJQUFJQyxJQUFKLENBQVNDLDBCQXBCeEM7OztBQXNCSTs7Ozs7QUFLQUMsY0FBVU4sRUFBRU8sTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CTixRQUFuQixFQUE2QkgsSUFBN0IsQ0EzQmQ7OztBQTZCSTs7Ozs7QUFLQUQsYUFBUyxFQWxDYjs7QUFvQ0E7QUFDQTtBQUNBOztBQUVBQSxXQUFPVyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQixZQUFJQyxvQkFBb0JWLEVBQUUscUJBQUYsQ0FBeEI7O0FBRUFELGNBQU1ZLElBQU4sQ0FBVyxjQUFYLEVBQTJCQyxFQUEzQixDQUE4QixPQUE5QixFQUF1QyxZQUFZOztBQUUvQ1osY0FBRSxJQUFGLEVBQVFhLE1BQVIsQ0FBZSxRQUFmLEVBQXlCQyxJQUF6Qjs7QUFFQSxnQkFBSVIsUUFBUVMsZUFBUixLQUE0QkMsU0FBNUIsSUFBeUNWLFFBQVFXLGlCQUFSLEtBQThCRCxTQUEzRSxFQUFzRjtBQUNsRmQseUNBQXlCZ0IsR0FBekIsQ0FBNkI7QUFDekJwQiwwQkFBTTtBQUNGcUIsZ0NBQVFiLFFBQVFjLE9BRGQ7QUFFRkMsMENBQWtCZixRQUFRUyxlQUZ4QjtBQUdGTyw0Q0FBb0JoQixRQUFRVztBQUgxQjtBQURtQixpQkFBN0I7QUFPSDs7QUFFRCxnQkFBSVAsa0JBQWtCYSxNQUFsQixHQUEyQixDQUEzQixJQUFpQ3ZCLEVBQUUsaUNBQUYsRUFBcUN1QixNQUFyQyxHQUE4QyxDQUEvQyxLQUFzRCxDQUExRixFQUE2RjtBQUN6RmIsa0NBQWtCYyxXQUFsQixDQUE4QixzQkFBOUI7QUFDSDtBQUNKLFNBakJEOztBQW1CQWY7QUFDSCxLQXZCRDs7QUF5QkEsV0FBT1osTUFBUDtBQUNILENBakZMIiwiZmlsZSI6ImNsb3NlX2FsZXJ0X2JveC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY2xvc2VfYWxlcnRfYm94LmpzIDIwMTYtMDgtMjUgXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBDbG9zZSBBbGVydCBCb3hcbiAqXG4gKiBUaGlzIG1vZHVsZSB3aWxsIGhpZGUgYW4gYWxlcnQgYm94IGJ5IGNsaWNraW5nIGEgYnV0dG9uIHdpdGggdGhlIGNsYXNzIFwiY2xvc2VcIi5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvY2xvc2VfYWxlcnRfYm94XG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdjbG9zZV9hbGVydF9ib3gnLFxuXG4gICAgWyd1c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSddLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvY2xvc2VfYWxlcnRfYm94ICovXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJHRoaXMgPSAkKHRoaXMpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlIEFsaWFzXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlID0ganNlLmxpYnMudXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB2YXIgJGNyZWF0ZU5ld1dyYXBwZXIgPSAkKCcuY3JlYXRlLW5ldy13cmFwcGVyJyk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ2J1dHRvbi5jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCcuYWxlcnQnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy51c2VyX2NvbmZpZ19rZXkgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zLnVzZXJfY29uZmlnX3ZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdXNlckNvbmZpZ3VyYXRpb25TZXJ2aWNlLnNldCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkOiBvcHRpb25zLnVzZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbktleTogb3B0aW9ucy51c2VyX2NvbmZpZ19rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBvcHRpb25zLnVzZXJfY29uZmlnX3ZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkY3JlYXRlTmV3V3JhcHBlci5sZW5ndGggPiAwICYmICgkKCcubWVzc2FnZV9zdGFja19jb250YWluZXIgLmFsZXJ0JykubGVuZ3RoIC0gMSkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJGNyZWF0ZU5ld1dyYXBwZXIucmVtb3ZlQ2xhc3MoJ21lc3NhZ2Utc3RhY2stYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
