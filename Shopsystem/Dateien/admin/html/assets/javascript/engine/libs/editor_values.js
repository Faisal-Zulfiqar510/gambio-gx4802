'use strict';

/* --------------------------------------------------------------
 editor_values.js 2016-09-06
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.editor_values = jse.core.editor_values || {};

/**
 * ## Editor Values Library
 *
 * This library provides a common API for editor widget values manipulation.
 *
 * @module Admin/Libs/editor_values
 * @exports jse.libs.editor_values
 */
(function (exports) {

    'use strict';

    /**
     * Editor Get Value Methods
     *
     * @type {Object}
     */

    var getValue = {
        ckeditor: function ckeditor($textarea) {
            var name = $textarea.attr('name');
            var instance = CKEDITOR.instances[name];
            return instance.getData();
        },
        codemirror: function codemirror($textarea) {
            var instance = $textarea.siblings('.CodeMirror')[0].CodeMirror;
            return instance.getDoc().getValue();
        }
    };

    /**
     * Editor Set Value Methods
     *
     * @type {Object}
     */
    var setValue = {
        ckeditor: function ckeditor($textarea, value) {
            var name = $textarea.attr('name');
            var instance = CKEDITOR.instances[name];
            instance.setData(value);
        },
        codemirror: function codemirror($textarea, value) {
            var instance = $textarea.siblings('.CodeMirror')[0].CodeMirror;
            instance.getDoc().setValue(value);
        }
    };

    /**
     * Get Editor Value
     *
     * @param {jQuery} $textarea Textarea selector from which the value will be returned.
     *
     * @return {String} Returns the editor value.
     */
    exports.getValue = function ($textarea) {
        var type = $textarea.data('editorType');

        if (!getValue[type]) {
            throw new Error('Provided editor element does not have the supported types: ' + type);
        }

        return getValue[type]($textarea);
    };

    /**
     * Set Editor Value
     *
     * @param {jQuery} $textarea Textarea selector to which the value will be set.
     * @param {String} value The new value of the editor.
     */
    exports.setValue = function ($textarea, value) {
        var type = $textarea.data('editorType');

        if (!getValue[type]) {
            throw new Error('Provided editor element does not have the supported types: ' + type);
        }

        setValue[type]($textarea, value);
    };
})(jse.libs.editor_values);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRvcl92YWx1ZXMuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsImVkaXRvcl92YWx1ZXMiLCJjb3JlIiwiZXhwb3J0cyIsImdldFZhbHVlIiwiY2tlZGl0b3IiLCIkdGV4dGFyZWEiLCJuYW1lIiwiYXR0ciIsImluc3RhbmNlIiwiQ0tFRElUT1IiLCJpbnN0YW5jZXMiLCJnZXREYXRhIiwiY29kZW1pcnJvciIsInNpYmxpbmdzIiwiQ29kZU1pcnJvciIsImdldERvYyIsInNldFZhbHVlIiwidmFsdWUiLCJzZXREYXRhIiwidHlwZSIsImRhdGEiLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBQSxJQUFJQyxJQUFKLENBQVNDLGFBQVQsR0FBeUJGLElBQUlHLElBQUosQ0FBU0QsYUFBVCxJQUEwQixFQUFuRDs7QUFFQTs7Ozs7Ozs7QUFRQSxDQUFDLFVBQVVFLE9BQVYsRUFBbUI7O0FBRWhCOztBQUVBOzs7Ozs7QUFLQSxRQUFNQyxXQUFXO0FBQ2JDLGdCQURhLG9CQUNKQyxTQURJLEVBQ087QUFDaEIsZ0JBQU1DLE9BQU9ELFVBQVVFLElBQVYsQ0FBZSxNQUFmLENBQWI7QUFDQSxnQkFBTUMsV0FBV0MsU0FBU0MsU0FBVCxDQUFtQkosSUFBbkIsQ0FBakI7QUFDQSxtQkFBT0UsU0FBU0csT0FBVCxFQUFQO0FBQ0gsU0FMWTtBQU9iQyxrQkFQYSxzQkFPRlAsU0FQRSxFQU9TO0FBQ2xCLGdCQUFNRyxXQUFXSCxVQUFVUSxRQUFWLENBQW1CLGFBQW5CLEVBQWtDLENBQWxDLEVBQXFDQyxVQUF0RDtBQUNBLG1CQUFPTixTQUFTTyxNQUFULEdBQWtCWixRQUFsQixFQUFQO0FBQ0g7QUFWWSxLQUFqQjs7QUFhQTs7Ozs7QUFLQSxRQUFNYSxXQUFXO0FBQ2JaLGdCQURhLG9CQUNKQyxTQURJLEVBQ09ZLEtBRFAsRUFDYztBQUN2QixnQkFBTVgsT0FBT0QsVUFBVUUsSUFBVixDQUFlLE1BQWYsQ0FBYjtBQUNBLGdCQUFNQyxXQUFXQyxTQUFTQyxTQUFULENBQW1CSixJQUFuQixDQUFqQjtBQUNBRSxxQkFBU1UsT0FBVCxDQUFpQkQsS0FBakI7QUFDSCxTQUxZO0FBT2JMLGtCQVBhLHNCQU9GUCxTQVBFLEVBT1NZLEtBUFQsRUFPZ0I7QUFDekIsZ0JBQU1ULFdBQVdILFVBQVVRLFFBQVYsQ0FBbUIsYUFBbkIsRUFBa0MsQ0FBbEMsRUFBcUNDLFVBQXREO0FBQ0FOLHFCQUFTTyxNQUFULEdBQWtCQyxRQUFsQixDQUEyQkMsS0FBM0I7QUFDSDtBQVZZLEtBQWpCOztBQWFBOzs7Ozs7O0FBT0FmLFlBQVFDLFFBQVIsR0FBbUIsVUFBVUUsU0FBVixFQUFxQjtBQUNwQyxZQUFNYyxPQUFPZCxVQUFVZSxJQUFWLENBQWUsWUFBZixDQUFiOztBQUVBLFlBQUksQ0FBQ2pCLFNBQVNnQixJQUFULENBQUwsRUFBcUI7QUFDakIsa0JBQU0sSUFBSUUsS0FBSixDQUFVLGdFQUFnRUYsSUFBMUUsQ0FBTjtBQUNIOztBQUVELGVBQU9oQixTQUFTZ0IsSUFBVCxFQUFlZCxTQUFmLENBQVA7QUFDSCxLQVJEOztBQVVBOzs7Ozs7QUFNQUgsWUFBUWMsUUFBUixHQUFtQixVQUFVWCxTQUFWLEVBQXFCWSxLQUFyQixFQUE0QjtBQUMzQyxZQUFNRSxPQUFPZCxVQUFVZSxJQUFWLENBQWUsWUFBZixDQUFiOztBQUVBLFlBQUksQ0FBQ2pCLFNBQVNnQixJQUFULENBQUwsRUFBcUI7QUFDakIsa0JBQU0sSUFBSUUsS0FBSixDQUFVLGdFQUFnRUYsSUFBMUUsQ0FBTjtBQUNIOztBQUVESCxpQkFBU0csSUFBVCxFQUFlZCxTQUFmLEVBQTBCWSxLQUExQjtBQUNILEtBUkQ7QUFVSCxDQXpFRCxFQXlFR25CLElBQUlDLElBQUosQ0FBU0MsYUF6RVoiLCJmaWxlIjoiZWRpdG9yX3ZhbHVlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gZWRpdG9yX3ZhbHVlcy5qcyAyMDE2LTA5LTA2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNiBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuanNlLmxpYnMuZWRpdG9yX3ZhbHVlcyA9IGpzZS5jb3JlLmVkaXRvcl92YWx1ZXMgfHwge307XG5cbi8qKlxuICogIyMgRWRpdG9yIFZhbHVlcyBMaWJyYXJ5XG4gKlxuICogVGhpcyBsaWJyYXJ5IHByb3ZpZGVzIGEgY29tbW9uIEFQSSBmb3IgZWRpdG9yIHdpZGdldCB2YWx1ZXMgbWFuaXB1bGF0aW9uLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vTGlicy9lZGl0b3JfdmFsdWVzXG4gKiBAZXhwb3J0cyBqc2UubGlicy5lZGl0b3JfdmFsdWVzXG4gKi9cbihmdW5jdGlvbiAoZXhwb3J0cykge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqXG4gICAgICogRWRpdG9yIEdldCBWYWx1ZSBNZXRob2RzXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IGdldFZhbHVlID0ge1xuICAgICAgICBja2VkaXRvcigkdGV4dGFyZWEpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAkdGV4dGFyZWEuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBDS0VESVRPUi5pbnN0YW5jZXNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuZ2V0RGF0YSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNvZGVtaXJyb3IoJHRleHRhcmVhKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9ICR0ZXh0YXJlYS5zaWJsaW5ncygnLkNvZGVNaXJyb3InKVswXS5Db2RlTWlycm9yO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmdldERvYygpLmdldFZhbHVlKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRWRpdG9yIFNldCBWYWx1ZSBNZXRob2RzXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IHNldFZhbHVlID0ge1xuICAgICAgICBja2VkaXRvcigkdGV4dGFyZWEsIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJHRleHRhcmVhLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gQ0tFRElUT1IuaW5zdGFuY2VzW25hbWVdO1xuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0RGF0YSh2YWx1ZSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29kZW1pcnJvcigkdGV4dGFyZWEsIHZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9ICR0ZXh0YXJlYS5zaWJsaW5ncygnLkNvZGVNaXJyb3InKVswXS5Db2RlTWlycm9yO1xuICAgICAgICAgICAgaW5zdGFuY2UuZ2V0RG9jKCkuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCBFZGl0b3IgVmFsdWVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGV4dGFyZWEgVGV4dGFyZWEgc2VsZWN0b3IgZnJvbSB3aGljaCB0aGUgdmFsdWUgd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gUmV0dXJucyB0aGUgZWRpdG9yIHZhbHVlLlxuICAgICAqL1xuICAgIGV4cG9ydHMuZ2V0VmFsdWUgPSBmdW5jdGlvbiAoJHRleHRhcmVhKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpO1xuXG4gICAgICAgIGlmICghZ2V0VmFsdWVbdHlwZV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZWQgZWRpdG9yIGVsZW1lbnQgZG9lcyBub3QgaGF2ZSB0aGUgc3VwcG9ydGVkIHR5cGVzOiAnICsgdHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2V0VmFsdWVbdHlwZV0oJHRleHRhcmVhKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IEVkaXRvciBWYWx1ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICR0ZXh0YXJlYSBUZXh0YXJlYSBzZWxlY3RvciB0byB3aGljaCB0aGUgdmFsdWUgd2lsbCBiZSBzZXQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFRoZSBuZXcgdmFsdWUgb2YgdGhlIGVkaXRvci5cbiAgICAgKi9cbiAgICBleHBvcnRzLnNldFZhbHVlID0gZnVuY3Rpb24gKCR0ZXh0YXJlYSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9ICR0ZXh0YXJlYS5kYXRhKCdlZGl0b3JUeXBlJyk7XG5cbiAgICAgICAgaWYgKCFnZXRWYWx1ZVt0eXBlXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm92aWRlZCBlZGl0b3IgZWxlbWVudCBkb2VzIG5vdCBoYXZlIHRoZSBzdXBwb3J0ZWQgdHlwZXM6ICcgKyB0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFZhbHVlW3R5cGVdKCR0ZXh0YXJlYSwgdmFsdWUpO1xuICAgIH07XG5cbn0pKGpzZS5saWJzLmVkaXRvcl92YWx1ZXMpOyAiXX0=
