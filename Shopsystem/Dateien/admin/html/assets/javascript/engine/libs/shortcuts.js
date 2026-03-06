'use strict';

/* --------------------------------------------------------------
 shortcuts.js 2016-09-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.shortcuts = jse.libs.shortcuts || {};

/**
 * ## Shortcuts library.
 *
 * This module holds the registered shortcuts and provides predefined constants for event key codes.
 * Additionally, you are allowed to register a custom shortcut by using the `registerShortcut()` function.
 *
 * Example on how to register a custom shortcut:
 *  jse.libs.shortcuts.registerShortcut('myShortcut', [17, 16, 70], _doThis);
 *
 * @module Admin/Libs/shortcuts
 * @exports jse.libs.shortcuts
 */
(function (exports) {
    // Event key codes map.
    exports.KEY_CODES = {
        // Left control key.
        CTRL_L: 17,

        // Left shift key.
        SHIFT_L: 16,

        // Above number key 1.
        NUM_1: 49,
        NUM_2: 50,
        NUM_3: 51,
        NUM_4: 52,
        NUM_5: 53,
        NUM_6: 54,
        NUM_7: 55,
        NUM_8: 56,
        NUM_9: 57
    };

    // List of registered shortcuts.
    // Structure:
    // [
    //      {
    //          name: 'openSearch',
    //          combination: [17, 16, 70],
    //          callback: () => 'Hello world!'
    //      }
    // ]
    exports.registeredShortcuts = [];

    /**
     * Registers a shortcut by adding the key combination and the respective callback function to the register object.
     *
     * @param {String} name Name of the key combination.
     * @param {Number[]} combination Array of event key numbers that represent a key combination.
     * @param {Function} callback Function to be invoked on key combination match.
     */
    exports.registerShortcut = function (name, combination, callback) {
        // Check combination name.
        if (!name || typeof name !== 'string') {
            throw new Error('Key combination name parameter is missing or invalid');
        }

        // Check combination.
        if (!combination || !Array.isArray(combination)) {
            throw new Error('Key combination parameter is missing or invalid');
        }

        // Check callback function.
        if (!callback || typeof callback !== 'function') {
            throw new Error('Callback function parameter is missing or invalid');
        }

        // Register shortcut.
        exports.registeredShortcuts.push({ name: name, combination: combination, callback: callback });
    };
})(jse.libs.shortcuts);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3J0Y3V0cy5qcyJdLCJuYW1lcyI6WyJqc2UiLCJsaWJzIiwic2hvcnRjdXRzIiwiZXhwb3J0cyIsIktFWV9DT0RFUyIsIkNUUkxfTCIsIlNISUZUX0wiLCJOVU1fMSIsIk5VTV8yIiwiTlVNXzMiLCJOVU1fNCIsIk5VTV81IiwiTlVNXzYiLCJOVU1fNyIsIk5VTV84IiwiTlVNXzkiLCJyZWdpc3RlcmVkU2hvcnRjdXRzIiwicmVnaXN0ZXJTaG9ydGN1dCIsIm5hbWUiLCJjb21iaW5hdGlvbiIsImNhbGxiYWNrIiwiRXJyb3IiLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLElBQUlDLElBQUosQ0FBU0MsU0FBVCxHQUFxQkYsSUFBSUMsSUFBSixDQUFTQyxTQUFULElBQXNCLEVBQTNDOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZQyxXQUFVQyxPQUFWLEVBQW1CO0FBQ2hCO0FBQ0FBLFlBQVFDLFNBQVIsR0FBb0I7QUFDaEI7QUFDQUMsZ0JBQVEsRUFGUTs7QUFJaEI7QUFDQUMsaUJBQVMsRUFMTzs7QUFPaEI7QUFDQUMsZUFBTyxFQVJTO0FBU2hCQyxlQUFPLEVBVFM7QUFVaEJDLGVBQU8sRUFWUztBQVdoQkMsZUFBTyxFQVhTO0FBWWhCQyxlQUFPLEVBWlM7QUFhaEJDLGVBQU8sRUFiUztBQWNoQkMsZUFBTyxFQWRTO0FBZWhCQyxlQUFPLEVBZlM7QUFnQmhCQyxlQUFPO0FBaEJTLEtBQXBCOztBQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQVosWUFBUWEsbUJBQVIsR0FBOEIsRUFBOUI7O0FBRUE7Ozs7Ozs7QUFPQWIsWUFBUWMsZ0JBQVIsR0FBMkIsVUFBQ0MsSUFBRCxFQUFPQyxXQUFQLEVBQW9CQyxRQUFwQixFQUFpQztBQUN4RDtBQUNBLFlBQUksQ0FBQ0YsSUFBRCxJQUFTLE9BQU9BLElBQVAsS0FBZ0IsUUFBN0IsRUFBdUM7QUFDbkMsa0JBQU0sSUFBSUcsS0FBSixDQUFVLHNEQUFWLENBQU47QUFDSDs7QUFFRDtBQUNBLFlBQUksQ0FBQ0YsV0FBRCxJQUFnQixDQUFDRyxNQUFNQyxPQUFOLENBQWNKLFdBQWQsQ0FBckIsRUFBaUQ7QUFDN0Msa0JBQU0sSUFBSUUsS0FBSixDQUFVLGlEQUFWLENBQU47QUFDSDs7QUFFRDtBQUNBLFlBQUksQ0FBQ0QsUUFBRCxJQUFhLE9BQU9BLFFBQVAsS0FBb0IsVUFBckMsRUFBaUQ7QUFDN0Msa0JBQU0sSUFBSUMsS0FBSixDQUFVLG1EQUFWLENBQU47QUFDSDs7QUFFRDtBQUNBbEIsZ0JBQVFhLG1CQUFSLENBQTRCUSxJQUE1QixDQUFpQyxFQUFDTixVQUFELEVBQU9DLHdCQUFQLEVBQW9CQyxrQkFBcEIsRUFBakM7QUFDSCxLQWxCRDtBQW1CSCxDQTFEQSxFQTBEQ3BCLElBQUlDLElBQUosQ0FBU0MsU0ExRFYsQ0FBRCIsImZpbGUiOiJzaG9ydGN1dHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNob3J0Y3V0cy5qcyAyMDE2LTA5LTEzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuanNlLmxpYnMuc2hvcnRjdXRzID0ganNlLmxpYnMuc2hvcnRjdXRzIHx8IHt9O1xuXG4vKipcbiAqICMjIFNob3J0Y3V0cyBsaWJyYXJ5LlxuICpcbiAqIFRoaXMgbW9kdWxlIGhvbGRzIHRoZSByZWdpc3RlcmVkIHNob3J0Y3V0cyBhbmQgcHJvdmlkZXMgcHJlZGVmaW5lZCBjb25zdGFudHMgZm9yIGV2ZW50IGtleSBjb2Rlcy5cbiAqIEFkZGl0aW9uYWxseSwgeW91IGFyZSBhbGxvd2VkIHRvIHJlZ2lzdGVyIGEgY3VzdG9tIHNob3J0Y3V0IGJ5IHVzaW5nIHRoZSBgcmVnaXN0ZXJTaG9ydGN1dCgpYCBmdW5jdGlvbi5cbiAqXG4gKiBFeGFtcGxlIG9uIGhvdyB0byByZWdpc3RlciBhIGN1c3RvbSBzaG9ydGN1dDpcbiAqICBqc2UubGlicy5zaG9ydGN1dHMucmVnaXN0ZXJTaG9ydGN1dCgnbXlTaG9ydGN1dCcsIFsxNywgMTYsIDcwXSwgX2RvVGhpcyk7XG4gKlxuICogQG1vZHVsZSBBZG1pbi9MaWJzL3Nob3J0Y3V0c1xuICogQGV4cG9ydHMganNlLmxpYnMuc2hvcnRjdXRzXG4gKi9cbihmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIC8vIEV2ZW50IGtleSBjb2RlcyBtYXAuXG4gICAgZXhwb3J0cy5LRVlfQ09ERVMgPSB7XG4gICAgICAgIC8vIExlZnQgY29udHJvbCBrZXkuXG4gICAgICAgIENUUkxfTDogMTcsXG5cbiAgICAgICAgLy8gTGVmdCBzaGlmdCBrZXkuXG4gICAgICAgIFNISUZUX0w6IDE2LFxuXG4gICAgICAgIC8vIEFib3ZlIG51bWJlciBrZXkgMS5cbiAgICAgICAgTlVNXzE6IDQ5LFxuICAgICAgICBOVU1fMjogNTAsXG4gICAgICAgIE5VTV8zOiA1MSxcbiAgICAgICAgTlVNXzQ6IDUyLFxuICAgICAgICBOVU1fNTogNTMsXG4gICAgICAgIE5VTV82OiA1NCxcbiAgICAgICAgTlVNXzc6IDU1LFxuICAgICAgICBOVU1fODogNTYsXG4gICAgICAgIE5VTV85OiA1N1xuICAgIH07XG5cbiAgICAvLyBMaXN0IG9mIHJlZ2lzdGVyZWQgc2hvcnRjdXRzLlxuICAgIC8vIFN0cnVjdHVyZTpcbiAgICAvLyBbXG4gICAgLy8gICAgICB7XG4gICAgLy8gICAgICAgICAgbmFtZTogJ29wZW5TZWFyY2gnLFxuICAgIC8vICAgICAgICAgIGNvbWJpbmF0aW9uOiBbMTcsIDE2LCA3MF0sXG4gICAgLy8gICAgICAgICAgY2FsbGJhY2s6ICgpID0+ICdIZWxsbyB3b3JsZCEnXG4gICAgLy8gICAgICB9XG4gICAgLy8gXVxuICAgIGV4cG9ydHMucmVnaXN0ZXJlZFNob3J0Y3V0cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgc2hvcnRjdXQgYnkgYWRkaW5nIHRoZSBrZXkgY29tYmluYXRpb24gYW5kIHRoZSByZXNwZWN0aXZlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHRoZSByZWdpc3RlciBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBrZXkgY29tYmluYXRpb24uXG4gICAgICogQHBhcmFtIHtOdW1iZXJbXX0gY29tYmluYXRpb24gQXJyYXkgb2YgZXZlbnQga2V5IG51bWJlcnMgdGhhdCByZXByZXNlbnQgYSBrZXkgY29tYmluYXRpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgRnVuY3Rpb24gdG8gYmUgaW52b2tlZCBvbiBrZXkgY29tYmluYXRpb24gbWF0Y2guXG4gICAgICovXG4gICAgZXhwb3J0cy5yZWdpc3RlclNob3J0Y3V0ID0gKG5hbWUsIGNvbWJpbmF0aW9uLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICAvLyBDaGVjayBjb21iaW5hdGlvbiBuYW1lLlxuICAgICAgICBpZiAoIW5hbWUgfHwgdHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0tleSBjb21iaW5hdGlvbiBuYW1lIHBhcmFtZXRlciBpcyBtaXNzaW5nIG9yIGludmFsaWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGNvbWJpbmF0aW9uLlxuICAgICAgICBpZiAoIWNvbWJpbmF0aW9uIHx8ICFBcnJheS5pc0FycmF5KGNvbWJpbmF0aW9uKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdLZXkgY29tYmluYXRpb24gcGFyYW1ldGVyIGlzIG1pc3Npbmcgb3IgaW52YWxpZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICAgIGlmICghY2FsbGJhY2sgfHwgdHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxiYWNrIGZ1bmN0aW9uIHBhcmFtZXRlciBpcyBtaXNzaW5nIG9yIGludmFsaWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZ2lzdGVyIHNob3J0Y3V0LlxuICAgICAgICBleHBvcnRzLnJlZ2lzdGVyZWRTaG9ydGN1dHMucHVzaCh7bmFtZSwgY29tYmluYXRpb24sIGNhbGxiYWNrfSk7XG4gICAgfVxufShqc2UubGlicy5zaG9ydGN1dHMpKTtcbiJdfQ==
