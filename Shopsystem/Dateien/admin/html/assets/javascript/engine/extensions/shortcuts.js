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

/**
 * ## Shortcuts Extension
 *
 * This extensions handles the invocation of custom registered shortcut callbacks.
 * You can also register your own shortcuts by using the library function.
 * Please refer to the library file for further information.
 *
 * @module Admin/Extensions/shortcuts
 */
gx.extensions.module('shortcuts', [gx.source + '/libs/shortcuts'], function (data) {
    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    // Module element.
    var $this = $(this);

    // Module default parameters.
    var defaults = {
        // Milliseconds to wait after pressing a key (for the shortcut check).
        delay: 100
    };

    // Module options.
    var options = $.extend(true, {}, defaults, data);

    // Module instance.
    var module = {};

    // List of currently pressed keys.
    var pressedKeys = [];

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Handles the key down event (when a key has been pressed down).
     *
     * @param {jQuery.Event} event Triggered event.
     * @private
     */
    function _onKeyDown(event) {
        // Register pressed keys.
        pressedKeys.push(event.which);
    }

    /**
     * Handles the key up event (when a key has been released).
     *
     * @private
     */
    function _onKeyUp() {
        // Perform the shortcut check after a certain delay.
        setTimeout(_checkShortcut, options.delay);
    }

    /**
     * Performs a shortcut check by matching the shortcuts in the register object.
     *
     * @private
     */
    function _checkShortcut() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = jse.libs.shortcuts.registeredShortcuts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var shortcut = _step.value;

                if (_checkArrayEquality(shortcut.combination, pressedKeys)) {
                    shortcut.callback();
                    break;
                }
            }

            // Reset pressed keys array.
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        pressedKeys = [];
    }

    /**
     * Returns whether the provided arrays are equal.
     *
     * @param {Array} a Array to compare.
     * @param {Array} b Other array to compare.
     * @returns {Boolean} Are the arrays equal?
     * @private
     */
    function _checkArrayEquality(a, b) {
        if (a === b) {
            return true;
        }
        if (a == null || b === null) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) {
                return false;
            }
        }

        return true;
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Initialize method of the widget, called by the engine.
     */
    module.init = function (done) {
        // Bind key press event handlers.
        $this.on('keydown', _onKeyDown).on('keyup', _onKeyUp);

        // Finish initialization.
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3J0Y3V0cy5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJkZWxheSIsIm9wdGlvbnMiLCJleHRlbmQiLCJwcmVzc2VkS2V5cyIsIl9vbktleURvd24iLCJldmVudCIsInB1c2giLCJ3aGljaCIsIl9vbktleVVwIiwic2V0VGltZW91dCIsIl9jaGVja1Nob3J0Y3V0IiwianNlIiwibGlicyIsInNob3J0Y3V0cyIsInJlZ2lzdGVyZWRTaG9ydGN1dHMiLCJzaG9ydGN1dCIsIl9jaGVja0FycmF5RXF1YWxpdHkiLCJjb21iaW5hdGlvbiIsImNhbGxiYWNrIiwiYSIsImIiLCJsZW5ndGgiLCJpIiwiaW5pdCIsIm9uIiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7QUFTQUEsR0FBR0MsVUFBSCxDQUFjQyxNQUFkLENBQ0ksV0FESixFQUdJLENBQ09GLEdBQUdHLE1BRFYscUJBSEosRUFPSSxVQUFVQyxJQUFWLEVBQWdCO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7QUFDQSxRQUFNQyxXQUFXO0FBQ2I7QUFDQUMsZUFBTztBQUZNLEtBQWpCOztBQUtBO0FBQ0EsUUFBTUMsVUFBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CSCxRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7QUFDQSxRQUFNRixTQUFTLEVBQWY7O0FBRUE7QUFDQSxRQUFJUyxjQUFjLEVBQWxCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBTUEsYUFBU0MsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkI7QUFDdkI7QUFDQUYsb0JBQVlHLElBQVosQ0FBaUJELE1BQU1FLEtBQXZCO0FBQ0g7O0FBRUQ7Ozs7O0FBS0EsYUFBU0MsUUFBVCxHQUFvQjtBQUNoQjtBQUNBQyxtQkFBV0MsY0FBWCxFQUEyQlQsUUFBUUQsS0FBbkM7QUFDSDs7QUFFRDs7Ozs7QUFLQSxhQUFTVSxjQUFULEdBQTBCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3RCLGlDQUF1QkMsSUFBSUMsSUFBSixDQUFTQyxTQUFULENBQW1CQyxtQkFBMUMsOEhBQStEO0FBQUEsb0JBQXBEQyxRQUFvRDs7QUFDM0Qsb0JBQUlDLG9CQUFvQkQsU0FBU0UsV0FBN0IsRUFBMENkLFdBQTFDLENBQUosRUFBNEQ7QUFDeERZLDZCQUFTRyxRQUFUO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBUnNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBU3RCZixzQkFBYyxFQUFkO0FBQ0g7O0FBRUQ7Ozs7Ozs7O0FBUUEsYUFBU2EsbUJBQVQsQ0FBNkJHLENBQTdCLEVBQWdDQyxDQUFoQyxFQUFtQztBQUMvQixZQUFJRCxNQUFNQyxDQUFWLEVBQWE7QUFDVCxtQkFBTyxJQUFQO0FBQ0g7QUFDRCxZQUFJRCxLQUFLLElBQUwsSUFBYUMsTUFBTSxJQUF2QixFQUE2QjtBQUN6QixtQkFBTyxLQUFQO0FBQ0g7QUFDRCxZQUFJRCxFQUFFRSxNQUFGLEtBQWFELEVBQUVDLE1BQW5CLEVBQTJCO0FBQ3ZCLG1CQUFPLEtBQVA7QUFDSDs7QUFFRCxhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsRUFBRUUsTUFBdEIsRUFBOEIsRUFBRUMsQ0FBaEMsRUFBbUM7QUFDL0IsZ0JBQUlILEVBQUVHLENBQUYsTUFBU0YsRUFBRUUsQ0FBRixDQUFiLEVBQW1CO0FBQ2YsdUJBQU8sS0FBUDtBQUNIO0FBQ0o7O0FBRUQsZUFBTyxJQUFQO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTVCLFdBQU82QixJQUFQLEdBQWMsZ0JBQVE7QUFDbEI7QUFDQTFCLGNBQ0syQixFQURMLENBQ1EsU0FEUixFQUNtQnBCLFVBRG5CLEVBRUtvQixFQUZMLENBRVEsT0FGUixFQUVpQmhCLFFBRmpCOztBQUlBO0FBQ0FpQjtBQUNILEtBUkQ7O0FBVUEsV0FBTy9CLE1BQVA7QUFDSCxDQXRITCIsImZpbGUiOiJzaG9ydGN1dHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHNob3J0Y3V0cy5qcyAyMDE2LTA5LTEzXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTaG9ydGN1dHMgRXh0ZW5zaW9uXG4gKlxuICogVGhpcyBleHRlbnNpb25zIGhhbmRsZXMgdGhlIGludm9jYXRpb24gb2YgY3VzdG9tIHJlZ2lzdGVyZWQgc2hvcnRjdXQgY2FsbGJhY2tzLlxuICogWW91IGNhbiBhbHNvIHJlZ2lzdGVyIHlvdXIgb3duIHNob3J0Y3V0cyBieSB1c2luZyB0aGUgbGlicmFyeSBmdW5jdGlvbi5cbiAqIFBsZWFzZSByZWZlciB0byB0aGUgbGlicmFyeSBmaWxlIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy9zaG9ydGN1dHNcbiAqL1xuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ3Nob3J0Y3V0cycsXG5cbiAgICBbXG4gICAgICAgIGAke2d4LnNvdXJjZX0vbGlicy9zaG9ydGN1dHNgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLy8gTW9kdWxlIGVsZW1lbnQuXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvLyBNb2R1bGUgZGVmYXVsdCBwYXJhbWV0ZXJzLlxuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIC8vIE1pbGxpc2Vjb25kcyB0byB3YWl0IGFmdGVyIHByZXNzaW5nIGEga2V5IChmb3IgdGhlIHNob3J0Y3V0IGNoZWNrKS5cbiAgICAgICAgICAgIGRlbGF5OiAxMDBcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNb2R1bGUgb3B0aW9ucy5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLy8gTW9kdWxlIGluc3RhbmNlLlxuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyBMaXN0IG9mIGN1cnJlbnRseSBwcmVzc2VkIGtleXMuXG4gICAgICAgIGxldCBwcmVzc2VkS2V5cyA9IFtdO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGtleSBkb3duIGV2ZW50ICh3aGVuIGEga2V5IGhhcyBiZWVuIHByZXNzZWQgZG93bikuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5LkV2ZW50fSBldmVudCBUcmlnZ2VyZWQgZXZlbnQuXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfb25LZXlEb3duKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBSZWdpc3RlciBwcmVzc2VkIGtleXMuXG4gICAgICAgICAgICBwcmVzc2VkS2V5cy5wdXNoKGV2ZW50LndoaWNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBrZXkgdXAgZXZlbnQgKHdoZW4gYSBrZXkgaGFzIGJlZW4gcmVsZWFzZWQpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX29uS2V5VXAoKSB7XG4gICAgICAgICAgICAvLyBQZXJmb3JtIHRoZSBzaG9ydGN1dCBjaGVjayBhZnRlciBhIGNlcnRhaW4gZGVsYXkuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KF9jaGVja1Nob3J0Y3V0LCBvcHRpb25zLmRlbGF5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQZXJmb3JtcyBhIHNob3J0Y3V0IGNoZWNrIGJ5IG1hdGNoaW5nIHRoZSBzaG9ydGN1dHMgaW4gdGhlIHJlZ2lzdGVyIG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja1Nob3J0Y3V0KCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBzaG9ydGN1dCBvZiBqc2UubGlicy5zaG9ydGN1dHMucmVnaXN0ZXJlZFNob3J0Y3V0cykge1xuICAgICAgICAgICAgICAgIGlmIChfY2hlY2tBcnJheUVxdWFsaXR5KHNob3J0Y3V0LmNvbWJpbmF0aW9uLCBwcmVzc2VkS2V5cykpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvcnRjdXQuY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXNldCBwcmVzc2VkIGtleXMgYXJyYXkuXG4gICAgICAgICAgICBwcmVzc2VkS2V5cyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgcHJvdmlkZWQgYXJyYXlzIGFyZSBlcXVhbC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYSBBcnJheSB0byBjb21wYXJlLlxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBiIE90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBBcmUgdGhlIGFycmF5cyBlcXVhbD9cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9jaGVja0FycmF5RXF1YWxpdHkoYSwgYikge1xuICAgICAgICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhID09IG51bGwgfHwgYiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhLmxlbmd0aCAhPT0gYi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0aWFsaXplIG1ldGhvZCBvZiB0aGUgd2lkZ2V0LCBjYWxsZWQgYnkgdGhlIGVuZ2luZS5cbiAgICAgICAgICovXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZG9uZSA9PiB7XG4gICAgICAgICAgICAvLyBCaW5kIGtleSBwcmVzcyBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdrZXlkb3duJywgX29uS2V5RG93bilcbiAgICAgICAgICAgICAgICAub24oJ2tleXVwJywgX29uS2V5VXApO1xuXG4gICAgICAgICAgICAvLyBGaW5pc2ggaW5pdGlhbGl6YXRpb24uXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pO1xuIl19
