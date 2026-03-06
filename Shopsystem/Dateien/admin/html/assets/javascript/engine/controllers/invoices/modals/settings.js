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
 * Invoices Overview Settings
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
            page: 'invoices'
        };

        var settingsModal = new SettingsModalController(dependencies.element, dependencies.userCfgService, dependencies.loadingSpinner, dependencies.userId, dependencies.defaultColumnSettings, dependencies.translator, dependencies.page);

        settingsModal.initialize();

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL21vZGFscy9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImluaXQiLCJkb25lIiwiU2V0dGluZ3NNb2RhbENvbnRyb2xsZXIiLCJqc2UiLCJsaWJzIiwib3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxfY29udHJvbGxlciIsImNsYXNzIiwiZGVwZW5kZW5jaWVzIiwiZWxlbWVudCIsInVzZXJDZmdTZXJ2aWNlIiwidXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UiLCJsb2FkaW5nU3Bpbm5lciIsImxvYWRpbmdfc3Bpbm5lciIsInVzZXJJZCIsImRlZmF1bHRDb2x1bW5TZXR0aW5ncyIsInRyYW5zbGF0b3IiLCJjb3JlIiwibGFuZyIsInBhZ2UiLCJzZXR0aW5nc01vZGFsIiwiaW5pdGlhbGl6ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLFVBREosRUFHSSxDQUNJLDRCQURKLEVBRUksaUJBRkosRUFHT0YsR0FBR0csTUFIViw4Q0FISixFQVNJLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNSixTQUFTLEVBQWY7O0FBRUE7QUFDQTtBQUNBOztBQUVBQSxXQUFPSyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQixZQUFNQywwQkFBMEJDLElBQUlDLElBQUosQ0FBU0Msa0NBQVQsQ0FBNENDLEtBQTVFOztBQUVBLFlBQU1DLGVBQWU7QUFDakJDLHFCQUFTVixLQURRO0FBRWpCVyw0QkFBZ0JOLElBQUlDLElBQUosQ0FBU00sMEJBRlI7QUFHakJDLDRCQUFnQlIsSUFBSUMsSUFBSixDQUFTUSxlQUhSO0FBSWpCQyxvQkFBUWhCLEtBQUtnQixNQUpJO0FBS2pCQyxtQ0FBdUJqQixLQUFLaUIscUJBTFg7QUFNakJDLHdCQUFZWixJQUFJYSxJQUFKLENBQVNDLElBTko7QUFPakJDLGtCQUFNO0FBUFcsU0FBckI7O0FBVUEsWUFBTUMsZ0JBQWdCLElBQUlqQix1QkFBSixDQUNsQkssYUFBYUMsT0FESyxFQUVsQkQsYUFBYUUsY0FGSyxFQUdsQkYsYUFBYUksY0FISyxFQUlsQkosYUFBYU0sTUFKSyxFQUtsQk4sYUFBYU8scUJBTEssRUFNbEJQLGFBQWFRLFVBTkssRUFPbEJSLGFBQWFXLElBUEssQ0FBdEI7O0FBVUFDLHNCQUFjQyxVQUFkOztBQUVBbkI7QUFDSCxLQTFCRDs7QUE0QkEsV0FBT04sTUFBUDtBQUNILENBaEVMIiwiZmlsZSI6Imludm9pY2VzL21vZGFscy9zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc2V0dGluZ3MuanMgMjAxNi0xMC0wNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogSW52b2ljZXMgT3ZlcnZpZXcgU2V0dGluZ3NcbiAqXG4gKiBJdCByZXRyaWV2ZXMgdGhlIHNldHRpbmdzIGRhdGEgdmlhIHRoZSB1c2VyIGNvbmZpZ3VyYXRpb24gc2VydmljZSBhbmQgc2V0cyB0aGUgdmFsdWVzLlxuICogWW91IGFyZSBhYmxlIHRvIGNoYW5nZSB0aGUgY29sdW1uIHNvcnQgb3JkZXIgYW5kIHRoZSB2aXNpYmlsaXR5IG9mIGVhY2ggY29sdW1uLiBBZGRpdGlvbmFsbHlcbiAqIHlvdSBjYW4gY2hhbmdlIHRoZSBoZWlnaHQgb2YgdGhlIHRhYmxlIHJvd3MuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnc2V0dGluZ3MnLFxuXG4gICAgW1xuICAgICAgICAndXNlcl9jb25maWd1cmF0aW9uX3NlcnZpY2UnLFxuICAgICAgICAnbG9hZGluZ19zcGlubmVyJyxcbiAgICAgICAgYCR7Z3guc291cmNlfS9saWJzL292ZXJ2aWV3X3NldHRpbmdzX21vZGFsX2NvbnRyb2xsZXJgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IFNldHRpbmdzTW9kYWxDb250cm9sbGVyID0ganNlLmxpYnMub3ZlcnZpZXdfc2V0dGluZ3NfbW9kYWxfY29udHJvbGxlci5jbGFzcztcblxuICAgICAgICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICR0aGlzLFxuICAgICAgICAgICAgICAgIHVzZXJDZmdTZXJ2aWNlOiBqc2UubGlicy51c2VyX2NvbmZpZ3VyYXRpb25fc2VydmljZSxcbiAgICAgICAgICAgICAgICBsb2FkaW5nU3Bpbm5lcjoganNlLmxpYnMubG9hZGluZ19zcGlubmVyLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogZGF0YS51c2VySWQsXG4gICAgICAgICAgICAgICAgZGVmYXVsdENvbHVtblNldHRpbmdzOiBkYXRhLmRlZmF1bHRDb2x1bW5TZXR0aW5ncyxcbiAgICAgICAgICAgICAgICB0cmFuc2xhdG9yOiBqc2UuY29yZS5sYW5nLFxuICAgICAgICAgICAgICAgIHBhZ2U6ICdpbnZvaWNlcydcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzTW9kYWwgPSBuZXcgU2V0dGluZ3NNb2RhbENvbnRyb2xsZXIoXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLmVsZW1lbnQsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLnVzZXJDZmdTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llcy5sb2FkaW5nU3Bpbm5lcixcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGRlcGVuZGVuY2llcy5kZWZhdWx0Q29sdW1uU2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLnRyYW5zbGF0b3IsXG4gICAgICAgICAgICAgICAgZGVwZW5kZW5jaWVzLnBhZ2VcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHNldHRpbmdzTW9kYWwuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
