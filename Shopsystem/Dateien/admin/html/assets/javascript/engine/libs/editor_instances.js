'use strict';

/* --------------------------------------------------------------
 editor_instances.js 2021-05-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

jse.libs.editor_instances = jse.libs.editor_instances || {};

/**
 * ## Editor Instances Library
 *
 * This library provides a common API for editor widget instances manipulation.
 *
 * @module Admin/Libs/editor_instances
 * @exports jse.libs.editor_instances
 */
(function (exports) {

    'use strict';

    /**
     * Editor construct methods
     *
     * @type {Object}
     */

    var constructors = {
        ckeditor: function ckeditor($textarea) {
            var tags = ['p', 'div', 'script', 'style', 'form'];

            var formattingRules = {
                indent: true,
                breakBeforeOpen: true,
                breakAfterOpen: true,
                breakBeforeClose: true,
                breakAfterClose: true
            };

            var config = {
                filebrowserBrowseUrl: 'includes/ckeditor/filemanager/index.html',
                baseHref: jse.core.config.get('appUrl') + '/admin',
                enterMode: CKEDITOR.ENTER_BR,
                shiftEnterMode: CKEDITOR.ENTER_P,
                language: jse.core.config.get('languageCode'),
                useRelPath: true,
                on: {
                    instanceReady: function instanceReady(event) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var tag = _step.value;

                                this.dataProcessor.writer.setRules(tag, formattingRules);
                            }
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
                    }
                }
            };

            config = $.extend({}, config, $textarea.data()); // Get textarea specific configuration.

            var name = $textarea.attr('name');
            CKEDITOR.replace(name, config);
            return CKEDITOR.instances[name];
        },
        codemirror: function codemirror($textarea) {
            var config = {
                mode: 'htmlmixed',
                lineNumbers: true,
                lineWrapping: true
            };

            return CodeMirror.fromTextArea($textarea[0], config);
        }
    };

    /**
     * Editor destruct methods
     *
     * @type {Object}
     */
    var destructors = {
        ckeditor: function ckeditor($textarea) {
            var name = $textarea.attr('name');
            CKEDITOR.instances[name].destroy();
        },
        codemirror: function codemirror($textarea) {
            var instance = $textarea.siblings('.CodeMirror')[0].CodeMirror;
            instance.toTextArea();
        }
    };

    /**
     * Editor instance methods
     *
     * @type {Object}
     */
    var getInstance = {
        ckeditor: function ckeditor($textarea) {
            return CKEDITOR.instances[$textarea.attr('name')];
        },
        codemirror: function codemirror($textarea) {
            return $textarea.siblings('.CodeMirror')[0].CodeMirror;
        }
    };

    /**
     * Create new editor instance.
     *
     * @param {jQuery} $textarea Textarea selector to be modified.
     * @param {String} type Provide a type that is supported by the widget.
     *
     * @return {CKEditor|CodeMirror} Returns the create editor instance.
     */
    exports.create = function ($textarea, type) {
        if (constructors[type] === undefined) {
            throw new Error('Provided editor type is not supported: ' + type);
        }

        var instance = constructors[type]($textarea);
        instance.type = type;

        return instance;
    };

    /**
     * Switch to a new editor type.
     *
     * @param {jQuery} $textarea Textarea selector to be modified.
     * @param {String} currentType Provide the current editor type.
     * @param {String} newType Provide the new editor type.
     *
     * @return {CKEditor|CodeMirror} Returns the new editor instance.
     */
    exports.switch = function ($textarea, currentType, newType) {
        if (destructors[currentType] === undefined) {
            throw new Error('Provided editor type is not supported: ' + currentType);
        }

        destructors[currentType]($textarea);

        return exports.create($textarea, newType);
    };

    /**
     * Destroy an existing editor instance.
     *
     * @param {jQuery} $textarea Textarea selector to be destroyed.
     * @param {String} customInitEventType Optional (''), if the editor was initialized with a custom init-event-type,
     * then this must be unbound by editor destroy.
     */
    exports.destroy = function ($textarea) {
        var customInitEventType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        if (customInitEventType && customInitEventType !== 'JSENGINE_INIT_FINISHED') {
            $(window).off(customInitEventType);
        }

        var type = $textarea.data('editorType');

        if (destructors[type] === undefined) {
            throw new Error('Provided editor type is not supported: ' + type);
        }

        destructors[type]($textarea);
    };

    /**
     * Get an editor instance.
     *
     * @param {jQuery} $textarea Textarea selector from which the instance will be retrieved.
     *
     * @return {CKEditor|CodeMirror} Returns the corresponding editor instance.
     */
    exports.getInstance = function ($textarea) {
        var type = $textarea.data('editorType');

        if (destructors[type] === undefined) {
            throw new Error('Provided editor type is not supported: ' + type);
        }

        return getInstance[type]($textarea);
    };
})(jse.libs.editor_instances);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRvcl9pbnN0YW5jZXMuanMiXSwibmFtZXMiOlsianNlIiwibGlicyIsImVkaXRvcl9pbnN0YW5jZXMiLCJleHBvcnRzIiwiY29uc3RydWN0b3JzIiwiY2tlZGl0b3IiLCIkdGV4dGFyZWEiLCJ0YWdzIiwiZm9ybWF0dGluZ1J1bGVzIiwiaW5kZW50IiwiYnJlYWtCZWZvcmVPcGVuIiwiYnJlYWtBZnRlck9wZW4iLCJicmVha0JlZm9yZUNsb3NlIiwiYnJlYWtBZnRlckNsb3NlIiwiY29uZmlnIiwiZmlsZWJyb3dzZXJCcm93c2VVcmwiLCJiYXNlSHJlZiIsImNvcmUiLCJnZXQiLCJlbnRlck1vZGUiLCJDS0VESVRPUiIsIkVOVEVSX0JSIiwic2hpZnRFbnRlck1vZGUiLCJFTlRFUl9QIiwibGFuZ3VhZ2UiLCJ1c2VSZWxQYXRoIiwib24iLCJpbnN0YW5jZVJlYWR5IiwiZXZlbnQiLCJ0YWciLCJkYXRhUHJvY2Vzc29yIiwid3JpdGVyIiwic2V0UnVsZXMiLCIkIiwiZXh0ZW5kIiwiZGF0YSIsIm5hbWUiLCJhdHRyIiwicmVwbGFjZSIsImluc3RhbmNlcyIsImNvZGVtaXJyb3IiLCJtb2RlIiwibGluZU51bWJlcnMiLCJsaW5lV3JhcHBpbmciLCJDb2RlTWlycm9yIiwiZnJvbVRleHRBcmVhIiwiZGVzdHJ1Y3RvcnMiLCJkZXN0cm95IiwiaW5zdGFuY2UiLCJzaWJsaW5ncyIsInRvVGV4dEFyZWEiLCJnZXRJbnN0YW5jZSIsImNyZWF0ZSIsInR5cGUiLCJ1bmRlZmluZWQiLCJFcnJvciIsInN3aXRjaCIsImN1cnJlbnRUeXBlIiwibmV3VHlwZSIsImN1c3RvbUluaXRFdmVudFR5cGUiLCJ3aW5kb3ciLCJvZmYiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQUEsSUFBSUMsSUFBSixDQUFTQyxnQkFBVCxHQUE0QkYsSUFBSUMsSUFBSixDQUFTQyxnQkFBVCxJQUE2QixFQUF6RDs7QUFFQTs7Ozs7Ozs7QUFRQSxDQUFDLFVBQVVDLE9BQVYs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UWdELFdBQVIsR0FBc0IsVUFBVTdDLFNBQVYsRUFBcUI7QUFDdkMsWUFBTStDLE9BQU8vQyxVQUFVNkIsSUFBVixDQUFlLFlBQWYsQ0FBYjs7QUFFQSxZQUFJVyxZQUFZTyxJQUFaLE1BQXNCQyxTQUExQixFQUFxQztBQUNqQyxrQkFBTSxJQUFJQyxLQUFKLENBQVUsNENBQTRDRixJQUF0RCxDQUFOO0FBQ0g7O0FBRUQsZUFBT0YsWUFBWUUsSUFBWixFQUFrQi9DLFNBQWxCLENBQVA7QUFDSCxLQVJEO0FBVUgsQ0F0S0QsRUFzS0dOLElBQUlDLElBQUosQ0FBU0MsZ0JBdEtaIiwiZmlsZSI6ImVkaXRvcl9pbnN0YW5jZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGVkaXRvcl9pbnN0YW5jZXMuanMgMjAyMS0wNS0xNlxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjEgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbmpzZS5saWJzLmVkaXRvcl9pbnN0YW5jZXMgPSBqc2UubGlicy5lZGl0b3JfaW5zdGFuY2VzIHx8IHt9O1xuXG4vKipcbiAqICMjIEVkaXRvciBJbnN0YW5jZXMgTGlicmFyeVxuICpcbiAqIFRoaXMgbGlicmFyeSBwcm92aWRlcyBhIGNvbW1vbiBBUEkgZm9yIGVkaXRvciB3aWRnZXQgaW5zdGFuY2VzIG1hbmlwdWxhdGlvbi5cbiAqXG4gKiBAbW9kdWxlIEFkbWluL0xpYnMvZWRpdG9yX2luc3RhbmNlc1xuICogQGV4cG9ydHMganNlLmxpYnMuZWRpdG9yX2luc3RhbmNlc1xuICovXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIEVkaXRvciBjb25zdHJ1Y3QgbWV0aG9kc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBjb25zdHJ1Y3RvcnMgPSB7XG4gICAgICAgIGNrZWRpdG9yKCR0ZXh0YXJlYSkge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IFtcbiAgICAgICAgICAgICAgICAncCcsXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgJ3NjcmlwdCcsXG4gICAgICAgICAgICAgICAgJ3N0eWxlJyxcbiAgICAgICAgICAgICAgICAnZm9ybSdcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRpbmdSdWxlcyA9IHtcbiAgICAgICAgICAgICAgICBpbmRlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgYnJlYWtCZWZvcmVPcGVuOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJyZWFrQWZ0ZXJPcGVuOiB0cnVlLFxuICAgICAgICAgICAgICAgIGJyZWFrQmVmb3JlQ2xvc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgYnJlYWtBZnRlckNsb3NlOiB0cnVlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBsZXQgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGZpbGVicm93c2VyQnJvd3NlVXJsOiAnaW5jbHVkZXMvY2tlZGl0b3IvZmlsZW1hbmFnZXIvaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgYmFzZUhyZWY6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbicsXG4gICAgICAgICAgICAgICAgZW50ZXJNb2RlOiBDS0VESVRPUi5FTlRFUl9CUixcbiAgICAgICAgICAgICAgICBzaGlmdEVudGVyTW9kZTogQ0tFRElUT1IuRU5URVJfUCxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZToganNlLmNvcmUuY29uZmlnLmdldCgnbGFuZ3VhZ2VDb2RlJyksXG4gICAgICAgICAgICAgICAgdXNlUmVsUGF0aDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVJlYWR5KGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB0YWcgb2YgdGFncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVByb2Nlc3Nvci53cml0ZXIuc2V0UnVsZXModGFnLCBmb3JtYXR0aW5nUnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICBcbiAgICAgICAgICAgIGNvbmZpZyA9ICQuZXh0ZW5kKHt9LCBjb25maWcsICR0ZXh0YXJlYS5kYXRhKCkpOyAvLyBHZXQgdGV4dGFyZWEgc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cblxuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICR0ZXh0YXJlYS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICBDS0VESVRPUi5yZXBsYWNlKG5hbWUsIGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm4gQ0tFRElUT1IuaW5zdGFuY2VzW25hbWVdO1xuICAgICAgICB9LFxuICAgICAgICBjb2RlbWlycm9yKCR0ZXh0YXJlYSkge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgICAgIG1vZGU6ICdodG1sbWl4ZWQnLFxuICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKCR0ZXh0YXJlYVswXSwgY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFZGl0b3IgZGVzdHJ1Y3QgbWV0aG9kc1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBjb25zdCBkZXN0cnVjdG9ycyA9IHtcbiAgICAgICAgY2tlZGl0b3IoJHRleHRhcmVhKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJHRleHRhcmVhLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIENLRURJVE9SLmluc3RhbmNlc1tuYW1lXS5kZXN0cm95KCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNvZGVtaXJyb3IoJHRleHRhcmVhKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9ICR0ZXh0YXJlYS5zaWJsaW5ncygnLkNvZGVNaXJyb3InKVswXS5Db2RlTWlycm9yO1xuICAgICAgICAgICAgaW5zdGFuY2UudG9UZXh0QXJlYSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVkaXRvciBpbnN0YW5jZSBtZXRob2RzXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IGdldEluc3RhbmNlID0ge1xuICAgICAgICBja2VkaXRvcigkdGV4dGFyZWEpIHtcbiAgICAgICAgICAgIHJldHVybiBDS0VESVRPUi5pbnN0YW5jZXNbJHRleHRhcmVhLmF0dHIoJ25hbWUnKV07XG4gICAgICAgIH0sXG4gICAgICAgIGNvZGVtaXJyb3IoJHRleHRhcmVhKSB7XG4gICAgICAgICAgICByZXR1cm4gJHRleHRhcmVhLnNpYmxpbmdzKCcuQ29kZU1pcnJvcicpWzBdLkNvZGVNaXJyb3I7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIG5ldyBlZGl0b3IgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRleHRhcmVhIFRleHRhcmVhIHNlbGVjdG9yIHRvIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFByb3ZpZGUgYSB0eXBlIHRoYXQgaXMgc3VwcG9ydGVkIGJ5IHRoZSB3aWRnZXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtDS0VkaXRvcnxDb2RlTWlycm9yfSBSZXR1cm5zIHRoZSBjcmVhdGUgZWRpdG9yIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGV4cG9ydHMuY3JlYXRlID0gZnVuY3Rpb24gKCR0ZXh0YXJlYSwgdHlwZSkge1xuICAgICAgICBpZiAoY29uc3RydWN0b3JzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZWQgZWRpdG9yIHR5cGUgaXMgbm90IHN1cHBvcnRlZDogJyArIHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBjb25zdHJ1Y3RvcnNbdHlwZV0oJHRleHRhcmVhKTtcbiAgICAgICAgaW5zdGFuY2UudHlwZSA9IHR5cGU7XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTd2l0Y2ggdG8gYSBuZXcgZWRpdG9yIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRleHRhcmVhIFRleHRhcmVhIHNlbGVjdG9yIHRvIGJlIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjdXJyZW50VHlwZSBQcm92aWRlIHRoZSBjdXJyZW50IGVkaXRvciB0eXBlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuZXdUeXBlIFByb3ZpZGUgdGhlIG5ldyBlZGl0b3IgdHlwZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0NLRWRpdG9yfENvZGVNaXJyb3J9IFJldHVybnMgdGhlIG5ldyBlZGl0b3IgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZXhwb3J0cy5zd2l0Y2ggPSBmdW5jdGlvbiAoJHRleHRhcmVhLCBjdXJyZW50VHlwZSwgbmV3VHlwZSkge1xuICAgICAgICBpZiAoZGVzdHJ1Y3RvcnNbY3VycmVudFR5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZWQgZWRpdG9yIHR5cGUgaXMgbm90IHN1cHBvcnRlZDogJyArIGN1cnJlbnRUeXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3RydWN0b3JzW2N1cnJlbnRUeXBlXSgkdGV4dGFyZWEpO1xuXG4gICAgICAgIHJldHVybiBleHBvcnRzLmNyZWF0ZSgkdGV4dGFyZWEsIG5ld1R5cGUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGFuIGV4aXN0aW5nIGVkaXRvciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGV4dGFyZWEgVGV4dGFyZWEgc2VsZWN0b3IgdG8gYmUgZGVzdHJveWVkLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjdXN0b21Jbml0RXZlbnRUeXBlIE9wdGlvbmFsICgnJyksIGlmIHRoZSBlZGl0b3Igd2FzIGluaXRpYWxpemVkIHdpdGggYSBjdXN0b20gaW5pdC1ldmVudC10eXBlLFxuICAgICAqIHRoZW4gdGhpcyBtdXN0IGJlIHVuYm91bmQgYnkgZWRpdG9yIGRlc3Ryb3kuXG4gICAgICovXG4gICAgZXhwb3J0cy5kZXN0cm95ID0gZnVuY3Rpb24gKCR0ZXh0YXJlYSwgY3VzdG9tSW5pdEV2ZW50VHlwZSA9ICcnKSB7XG4gICAgICAgIGlmIChjdXN0b21Jbml0RXZlbnRUeXBlICYmIGN1c3RvbUluaXRFdmVudFR5cGUgIT09ICdKU0VOR0lORV9JTklUX0ZJTklTSEVEJykge1xuICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihjdXN0b21Jbml0RXZlbnRUeXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR5cGUgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpO1xuXG4gICAgICAgIGlmIChkZXN0cnVjdG9yc1t0eXBlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3ZpZGVkIGVkaXRvciB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQ6ICcgKyB0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlc3RydWN0b3JzW3R5cGVdKCR0ZXh0YXJlYSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCBhbiBlZGl0b3IgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRleHRhcmVhIFRleHRhcmVhIHNlbGVjdG9yIGZyb20gd2hpY2ggdGhlIGluc3RhbmNlIHdpbGwgYmUgcmV0cmlldmVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Q0tFZGl0b3J8Q29kZU1pcnJvcn0gUmV0dXJucyB0aGUgY29ycmVzcG9uZGluZyBlZGl0b3IgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZXhwb3J0cy5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgkdGV4dGFyZWEpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9ICR0ZXh0YXJlYS5kYXRhKCdlZGl0b3JUeXBlJyk7XG5cbiAgICAgICAgaWYgKGRlc3RydWN0b3JzW3R5cGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvdmlkZWQgZWRpdG9yIHR5cGUgaXMgbm90IHN1cHBvcnRlZDogJyArIHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdldEluc3RhbmNlW3R5cGVdKCR0ZXh0YXJlYSk7XG4gICAgfTtcblxufSkoanNlLmxpYnMuZWRpdG9yX2luc3RhbmNlcyk7Il19
