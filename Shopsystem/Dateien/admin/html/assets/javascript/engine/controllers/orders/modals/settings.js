'use strict';

/* --------------------------------------------------------------
 settings.js 2016-10-04
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Handles the settings modal.
 *
 * It retrieves the settings data via the user configuration service and sets the values.
 * You are able to change the column sort order and the visibility of each column. Additionally
 * you can change the height of the table rows.
 */
gx.controllers.module('settings', ['user_configuration_service', 'loading_spinner', gx.source + '/libs/overview_settings_modal_controller'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        var SettingsModalController = jse.libs.overview_settings_modal_controller.class;

        var dependencies = {
            element: $this,
            userCfgService: jse.libs.user_configuration_service,
            loadingSpinner: jse.libs.loading_spinner,
            userId: data.userId,
            defaultColumnSettings: data.defaultColumnSettings,
            translator: jse.core.lang,
            page: 'orders'
        };

        var settingsModal = new SettingsModalController(dependencies.element, dependencies.userCfgService, dependencies.loadingSpinner, dependencies.userId, dependencies.defaultColumnSettings, dependencies.translator, dependencies.page);

        settingsModal.initialize();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9tb2RhbHMvc2V0dGluZ3MuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJpbml0IiwiZG9uZSIsIlNldHRpbmdzTW9kYWxDb250cm9sbGVyIiwianNlIiwibGlicyIsIm92ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXIiLCJjbGFzcyIsImRlcGVuZGVuY2llcyIsImVsZW1lbnQiLCJ1c2VyQ2ZnU2VydmljZSIsInVzZXJfY29uZmlndXJhdGlvbl9zZXJ2aWNlIiwibG9hZGluZ1NwaW5uZXIiLCJsb2FkaW5nX3NwaW5uZXIiLCJ1c2VySWQiLCJkZWZhdWx0Q29sdW1uU2V0dGluZ3MiLCJ0cmFuc2xhdG9yIiwiY29yZSIsImxhbmciLCJwYWdlIiwic2V0dGluZ3NNb2RhbCIsImluaXRpYWxpemUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7OztBQU9BQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxVQURKLEVBR0ksQ0FDSSw0QkFESixFQUVJLGlCQUZKLEVBR09GLEdBQUdHLE1BSFYsOENBSEosRUFTSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUosU0FBUyxFQUFmOztBQUVBO0FBQ0E7QUFDQTs7QUFFQUEsV0FBT0ssSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUIsWUFBTUMsMEJBQTBCQyxJQUFJQyxJQUFKLENBQVNDLGtDQUFULENBQTRDQyxLQUE1RTs7QUFFQSxZQUFNQyxlQUFlO0FBQ2pCQyxxQkFBU1YsS0FEUTtBQUVqQlcsNEJBQWdCTixJQUFJQyxJQUFKLENBQVNNLDBCQUZSO0FBR2pCQyw0QkFBZ0JSLElBQUlDLElBQUosQ0FBU1EsZUFIUjtBQUlqQkMsb0JBQVFoQixLQUFLZ0IsTUFKSTtBQUtqQkMsbUNBQXVCakIsS0FBS2lCLHFCQUxYO0FBTWpCQyx3QkFBWVosSUFBSWEsSUFBSixDQUFTQyxJQU5KO0FBT2pCQyxrQkFBTTtBQVBXLFNBQXJCOztBQVVBLFlBQU1DLGdCQUFnQixJQUFJakIsdUJBQUosQ0FDbEJLLGFBQWFDLE9BREssRUFFbEJELGFBQWFFLGNBRkssRUFHbEJGLGFBQWFJLGNBSEssRUFJbEJKLGFBQWFNLE1BSkssRUFLbEJOLGFBQWFPLHFCQUxLLEVBTWxCUCxhQUFhUSxVQU5LLEVBT2xCUixhQUFhVyxJQVBLLENBQXRCOztBQVVBQyxzQkFBY0MsVUFBZDs7QUFFQW5CO0FBQ0gsS0ExQkQ7O0FBNEJBLFdBQU9OLE1BQVA7QUFDSCxDQWhFTCIsImZpbGUiOiJvcmRlcnMvbW9kYWxzL3NldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzZXR0aW5ncy5qcyAyMDE2LTEwLTA0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBIYW5kbGVzIHRoZSBzZXR0aW5ncyBtb2RhbC5cbiAqXG4gKiBJdCByZXRyaWV2ZXMgdGhlIHNldHRpbmdzIGRhdGEgdmlhIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZSBhbmQgc2V0cyB0aGUgdmFsdWVzLlxuICogWW91IGFyZSBhYmxlIHRvIGNoYW5nZSB0aGUgY29sdW1uIHNvcnQgb3JkZXIgYW5kIHRoZSB2aXNpYmlsaXR5IG9mIGVhY2ggY29sdW1uLiBBZGRpdGlvbmFsbHlcbiAqIHlvdSBjYW4gY2hhbmdlIHRoZSBoZWlnaHQgb2YgdGhlIHRhYmxlIHJvd3MuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc2V0dGluZ3MnLFxuXG4gICAgW1xuICAgICAgICAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL292ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXJgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IFNldHRpbmdzTW9kYWxDb250cm9sbGVyID0ganNlLmxpYnMub3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxfY29udHJvbGxlci5jbGFzcztcblxuICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICR0aGlzLFxuICAgICAgICAgICAgICAgIHVzZXJDZmdTZXJ2aWNlOiBqc2UubGlicy51c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSxcbiAgICAgICAgICAgICAgICBsb2FkaW5nU3Bpbm5lcjoganNlLmxpYnMubG9hZGluZ19zcGlubmVyLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogZGF0YS51c2VySWQsXG4gICAgICAgICAgICAgICAgZGVmYXVsdENvbHVtblNldHRpbmdzOiBkYXRhLmRlZmF1bHRDb2x1bW5TZXR0aW5ncyxcbiAgICAgICAgICAgICAgICB0cmFuc2xhdG9yOiBqc2UuY29yZS5sYW5nLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICdvcmRlcnMnXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBjb25zdCBzZXR0aW5nc01vZGFsID0gbmV3IFNldHRpbmdzTW9kYWxDb250cm9sbGVyKFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llcy5lbGVtZW50LFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llcy51c2VyQ2ZnU2VydmljZSxcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMubG9hZGluZ1NwaW5uZXIsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMuZGVmYXVsdENvbHVtblNldHRpbmdzLFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llcy50cmFuc2xhdG9yLFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llcy5wYWdlXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBzZXR0aW5nc01vZGFsLmluaXRpYWxpemUoKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
