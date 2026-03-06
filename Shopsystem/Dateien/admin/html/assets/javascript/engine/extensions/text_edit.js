'use strict';

/* --------------------------------------------------------------
 text_edit.js 2015-09-17 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Text Edit Extension
 *
 * This extension is used along with text_edit.js and ajax_search.js in the Gambio Admin
 * "Text Edit | Texte Anpassen" page.
 *
 * @module Admin/Extensions/text_edit
 * @ignore
 */
gx.extensions.module('text_edit', ['xhr', 'modal', 'fallback'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLE DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Extension Reference
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Default Options for Extension
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Extension Options
     *
     * @type {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {},


    /**
     * Filter Selector
     *
     * @type {object}
     */
    $filter = null;

    // ------------------------------------------------------------------------
    // FUNCTIONALITY
    // ------------------------------------------------------------------------

    /**
     * Reset Form Event Handler
     *
     * @param {object} $parent
     * @param {boolean} resetValue
     */
    var _resetForm = function _resetForm($parent, resetValue) {
        var $textarea = $parent.find('textarea'),
            $buttons = $parent.find('ul.actions li'),
            original = $textarea.data('data');

        $textarea.prop('disabled', true);

        if (resetValue) {
            $textarea.val(original);
        }

        $buttons.hide().filter('.edit').show();

        if ($textarea.data('texteditEdited')) {
            $buttons.filter('.reset').show();
        } else {
            $buttons.filter('.reset').hide();
        }
    };

    /**
     * Edit Event Handler
     */
    var _editHandler = function _editHandler() {
        var $self = $(this),
            $parent = $self.closest('.dataTableRow'),
            $textarea = $parent.find('textarea'),
            $buttons = $parent.find('ul.actions li'),
            value = $textarea.val();

        $textarea.data('data', value).val('').prop('disabled', false).focus().val(value);

        $self.hide().siblings().show();

        if ($textarea.data('texteditEdited')) {
            $buttons.filter('.reset').show();
        } else {
            $buttons.filter('.reset').hide();
        }
    };

    /**
     * Abort Event Handler
     */
    var _abortHandler = function _abortHandler() {
        var $self = $(this),
            $parent = $self.closest('.dataTableRow'),
            $textarea = $parent.find('textarea'),
            value = $textarea.val(),
            original = $textarea.data('data');

        if (value !== original) {
            jse.libs.modal.confirm({
                'content': jse.core.lang.translate('discard_changes_prompt', 'messages'),
                'title': jse.core.lang.translate('abort', 'buttons'),
                'position': {
                    'my': 'center',
                    'at': 'center',
                    'of': $parent
                }
            }).done(function () {
                _resetForm($parent, true);
            });
        } else {
            _resetForm($parent);
        }
    };

    /**
     * Save Event Handler
     */
    var _saveHandler = function _saveHandler() {
        var $self = $(this),
            $parent = $self.closest('.dataTableRow'),
            $textarea = $parent.find('textarea'),
            value = $textarea.val(),
            original = $textarea.data('data'),
            data = jse.libs.fallback._data($textarea, 'text_edit');

        data.value = value;
        if (!$self.hasClass('pending')) {
            if (value !== original) {
                $self.addClass('pending');

                jse.libs.xhr.ajax({
                    'url': options.url,
                    'data': data
                }).done(function (result) {
                    $textarea.data('texteditEdited', result.edited);
                    $parent.find('.searchSection').attr('title', result.source);
                    _resetForm($parent);
                }).fail(function () {
                    jse.libs.modal.error({
                        'content': 'Error',
                        'title': 'Error',
                        'position': {
                            'my': 'center',
                            'at': 'center',
                            'of': $parent
                        }
                    });
                }).always(function () {
                    $self.removeClass('pending');
                });
            } else {
                _resetForm($parent);
            }
        }
    };

    /**
     * Reset Event Handler
     */
    var _resetHandler = function _resetHandler() {
        var $self = $(this),
            $parent = $self.closest('.dataTableRow'),
            $textarea = $parent.find('textarea');
        data = jse.libs.fallback._data($self, 'text_edit');

        if (!$self.hasClass('pending')) {
            $self.addClass('pending');

            jse.libs.xhr.ajax({
                'url': options.url,
                'data': data
            }).done(function (result) {
                if (result.success) {
                    $parent.find('.searchSection').attr('title', result.source);
                    $textarea.val(result.value);
                    $textarea.data('texteditEdited', false);
                    _resetForm($parent);
                    $self.hide();
                }
            }).fail(function () {
                jse.libs.modal.error({
                    'content': 'Error',
                    'title': 'Error',
                    'position': {
                        'my': 'center',
                        'at': 'center',
                        'of': $parent
                    }
                });
            }).always(function () {
                $self.removeClass('pending');
            });
        }
    };

    /**
     * Filter Event Handler
     */
    var _filterHandler = function _filterHandler() {
        var $self = $(this),
            settings = jse.libs.fallback._data($(this), 'text_edit');

        $filter.trigger('submitform', [settings]);
        window.scrollTo(0, 0);
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    /**
     * Init function of the extension, called by the engine.
     */
    module.init = function (done) {
        $filter = $('#' + options.filter);

        $this.on('click', '.edit', _editHandler).on('click', '.save', _saveHandler).on('click', '.abort', _abortHandler).on('click', '.reset', _resetHandler);

        if ($filter.length) {
            $this.on('click', '.searchPhrase, .searchSection', _filterHandler);
        }

        $('#needle').focus();

        done();
    };

    // Return data to module engine.
    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRleHRfZWRpdC5qcyJdLCJuYW1lcyI6WyJneCIsImV4dGVuc2lvbnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiJGZpbHRlciIsIl9yZXNldEZvcm0iLCIkcGFyZW50IiwicmVzZXRWYWx1ZSIsIiR0ZXh0YXJlYSIsImZpbmQiLCIkYnV0dG9ucyIsIm9yaWdpbmFsIiwicHJvcCIsInZhbCIsImhpZGUiLCJmaWx0ZXIiLCJzaG93IiwiX2VkaXRIYW5kbGVyIiwiJHNlbGYiLCJjbG9zZXN0IiwidmFsdWUiLCJmb2N1cyIsInNpYmxpbmdzIiwiX2Fib3J0SGFuZGxlciIsImpzZSIsImxpYnMiLCJtb2RhbCIsImNvbmZpcm0iLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsImRvbmUiLCJfc2F2ZUhhbmRsZXIiLCJmYWxsYmFjayIsIl9kYXRhIiwiaGFzQ2xhc3MiLCJhZGRDbGFzcyIsInhociIsImFqYXgiLCJ1cmwiLCJyZXN1bHQiLCJlZGl0ZWQiLCJhdHRyIiwic291cmNlIiwiZmFpbCIsImVycm9yIiwiYWx3YXlzIiwicmVtb3ZlQ2xhc3MiLCJfcmVzZXRIYW5kbGVyIiwic3VjY2VzcyIsIl9maWx0ZXJIYW5kbGVyIiwic2V0dGluZ3MiLCJ0cmlnZ2VyIiwid2luZG93Iiwic2Nyb2xsVG8iLCJpbml0Iiwib24iLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7O0FBU0FBLEdBQUdDLFVBQUgsQ0FBY0MsTUFBZCxDQUNJLFdBREosRUFHSSxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFVBQWpCLENBSEosRUFLSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLGNBQVVGLEVB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QUFRcUQsTUFBWixFQUFvQjtBQUNoQjFELGtCQUFNeUQsRUFBTixDQUFTLE9BQVQsRUFBa0IsK0JBQWxCLEVBQW1ETixjQUFuRDtBQUNIOztBQUVEbEQsVUFBRSxTQUFGLEVBQWFxQixLQUFiOztBQUVBVTtBQUNILEtBaEJEOztBQWtCQTtBQUNBLFdBQU9sQyxNQUFQO0FBQ0gsQ0ExUUwiLCJmaWxlIjoidGV4dF9lZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB0ZXh0X2VkaXQuanMgMjAxNS0wOS0xNyBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgVGV4dCBFZGl0IEV4dGVuc2lvblxuICpcbiAqIFRoaXMgZXh0ZW5zaW9uIGlzIHVzZWQgYWxvbmcgd2l0aCB0ZXh0X2VkaXQuanMgYW5kIGFqYXhfc2VhcmNoLmpzIGluIHRoZSBHYW1iaW8gQWRtaW5cbiAqIFwiVGV4dCBFZGl0IHwgVGV4dGUgQW5wYXNzZW5cIiBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQWRtaW4vRXh0ZW5zaW9ucy90ZXh0X2VkaXRcbiAqIEBpZ25vcmVcbiAqL1xuZ3guZXh0ZW5zaW9ucy5tb2R1bGUoXG4gICAgJ3RleHRfZWRpdCcsXG5cbiAgICBbJ3hocicsICdtb2RhbCcsICdmYWxsYmFjayddLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFIERFRklOSVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4dGVuc2lvbiBSZWZlcmVuY2VcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zIGZvciBFeHRlbnNpb25cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIEV4dGVuc2lvbiBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbHRlciBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRmaWx0ZXIgPSBudWxsO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBGVU5DVElPTkFMSVRZXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldCBGb3JtIEV2ZW50IEhhbmRsZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9ICRwYXJlbnRcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSByZXNldFZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Jlc2V0Rm9ybSA9IGZ1bmN0aW9uICgkcGFyZW50LCByZXNldFZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgJHRleHRhcmVhID0gJHBhcmVudC5maW5kKCd0ZXh0YXJlYScpLFxuICAgICAgICAgICAgICAgICRidXR0b25zID0gJHBhcmVudC5maW5kKCd1bC5hY3Rpb25zIGxpJyksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWwgPSAkdGV4dGFyZWEuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICAkdGV4dGFyZWEucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcblxuICAgICAgICAgICAgaWYgKHJlc2V0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAkdGV4dGFyZWEudmFsKG9yaWdpbmFsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGJ1dHRvbnNcbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLmZpbHRlcignLmVkaXQnKVxuICAgICAgICAgICAgICAgIC5zaG93KCk7XG5cbiAgICAgICAgICAgIGlmICgkdGV4dGFyZWEuZGF0YSgndGV4dGVkaXRFZGl0ZWQnKSkge1xuICAgICAgICAgICAgICAgICRidXR0b25zXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoJy5yZXNldCcpXG4gICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRidXR0b25zXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoJy5yZXNldCcpXG4gICAgICAgICAgICAgICAgICAgIC5oaWRlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRWRpdCBFdmVudCBIYW5kbGVyXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2VkaXRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAkcGFyZW50ID0gJHNlbGYuY2xvc2VzdCgnLmRhdGFUYWJsZVJvdycpLFxuICAgICAgICAgICAgICAgICR0ZXh0YXJlYSA9ICRwYXJlbnQuZmluZCgndGV4dGFyZWEnKSxcbiAgICAgICAgICAgICAgICAkYnV0dG9ucyA9ICRwYXJlbnQuZmluZCgndWwuYWN0aW9ucyBsaScpLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gJHRleHRhcmVhLnZhbCgpO1xuXG4gICAgICAgICAgICAkdGV4dGFyZWFcbiAgICAgICAgICAgICAgICAuZGF0YSgnZGF0YScsIHZhbHVlKVxuICAgICAgICAgICAgICAgIC52YWwoJycpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgICAgICAgLmZvY3VzKClcbiAgICAgICAgICAgICAgICAudmFsKHZhbHVlKTtcblxuICAgICAgICAgICAgJHNlbGZcbiAgICAgICAgICAgICAgICAuaGlkZSgpXG4gICAgICAgICAgICAgICAgLnNpYmxpbmdzKClcbiAgICAgICAgICAgICAgICAuc2hvdygpO1xuXG4gICAgICAgICAgICBpZiAoJHRleHRhcmVhLmRhdGEoJ3RleHRlZGl0RWRpdGVkJykpIHtcbiAgICAgICAgICAgICAgICAkYnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCcucmVzZXQnKVxuICAgICAgICAgICAgICAgICAgICAuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkYnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKCcucmVzZXQnKVxuICAgICAgICAgICAgICAgICAgICAuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBYm9ydCBFdmVudCBIYW5kbGVyXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2Fib3J0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRzZWxmLmNsb3Nlc3QoJy5kYXRhVGFibGVSb3cnKSxcbiAgICAgICAgICAgICAgICAkdGV4dGFyZWEgPSAkcGFyZW50LmZpbmQoJ3RleHRhcmVhJyksXG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkdGV4dGFyZWEudmFsKCksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWwgPSAkdGV4dGFyZWEuZGF0YSgnZGF0YScpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IG9yaWdpbmFsKSB7XG4gICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuY29uZmlybSh7XG4gICAgICAgICAgICAgICAgICAgICdjb250ZW50JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Rpc2NhcmRfY2hhbmdlc19wcm9tcHQnLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Fib3J0JywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ215JzogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXQnOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvZic6ICRwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBfcmVzZXRGb3JtKCRwYXJlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfcmVzZXRGb3JtKCRwYXJlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYXZlIEV2ZW50IEhhbmRsZXJcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfc2F2ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICRwYXJlbnQgPSAkc2VsZi5jbG9zZXN0KCcuZGF0YVRhYmxlUm93JyksXG4gICAgICAgICAgICAgICAgJHRleHRhcmVhID0gJHBhcmVudC5maW5kKCd0ZXh0YXJlYScpLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gJHRleHRhcmVhLnZhbCgpLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsID0gJHRleHRhcmVhLmRhdGEoJ2RhdGEnKSxcbiAgICAgICAgICAgICAgICBkYXRhID0ganNlLmxpYnMuZmFsbGJhY2suX2RhdGEoJHRleHRhcmVhLCAndGV4dF9lZGl0Jyk7XG5cbiAgICAgICAgICAgIGRhdGEudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICghJHNlbGYuaGFzQ2xhc3MoJ3BlbmRpbmcnKSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gb3JpZ2luYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ3BlbmRpbmcnKTtcblxuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy54aHIuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAndXJsJzogb3B0aW9ucy51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGV4dGFyZWEuZGF0YSgndGV4dGVkaXRFZGl0ZWQnLCByZXN1bHQuZWRpdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLnNlYXJjaFNlY3Rpb24nKS5hdHRyKCd0aXRsZScsIHJlc3VsdC5zb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc2V0Rm9ybSgkcGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5tb2RhbC5lcnJvcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiAnRXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0aXRsZSc6ICdFcnJvcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbXknOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F0JzogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvZic6ICRwYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkuYWx3YXlzKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdwZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF9yZXNldEZvcm0oJHBhcmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXNldCBFdmVudCBIYW5kbGVyXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX3Jlc2V0SGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9ICRzZWxmLmNsb3Nlc3QoJy5kYXRhVGFibGVSb3cnKSxcbiAgICAgICAgICAgICAgICAkdGV4dGFyZWEgPSAkcGFyZW50LmZpbmQoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICBkYXRhID0ganNlLmxpYnMuZmFsbGJhY2suX2RhdGEoJHNlbGYsICd0ZXh0X2VkaXQnKTtcblxuICAgICAgICAgICAgaWYgKCEkc2VsZi5oYXNDbGFzcygncGVuZGluZycpKSB7XG4gICAgICAgICAgICAgICAgJHNlbGYuYWRkQ2xhc3MoJ3BlbmRpbmcnKTtcblxuICAgICAgICAgICAgICAgIGpzZS5saWJzLnhoci5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgJ3VybCc6IG9wdGlvbnMudXJsLFxuICAgICAgICAgICAgICAgICAgICAnZGF0YSc6IGRhdGFcbiAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoJy5zZWFyY2hTZWN0aW9uJykuYXR0cigndGl0bGUnLCByZXN1bHQuc291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZXh0YXJlYS52YWwocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZXh0YXJlYS5kYXRhKCd0ZXh0ZWRpdEVkaXRlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZXNldEZvcm0oJHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMubW9kYWwuZXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQnOiAnRXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RpdGxlJzogJ0Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbXknOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXQnOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnb2YnOiAkcGFyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pLmFsd2F5cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICRzZWxmLnJlbW92ZUNsYXNzKCdwZW5kaW5nJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpbHRlciBFdmVudCBIYW5kbGVyXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2ZpbHRlckhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzID0ganNlLmxpYnMuZmFsbGJhY2suX2RhdGEoJCh0aGlzKSwgJ3RleHRfZWRpdCcpO1xuXG4gICAgICAgICAgICAkZmlsdGVyLnRyaWdnZXIoJ3N1Ym1pdGZvcm0nLCBbc2V0dGluZ3NdKTtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgZnVuY3Rpb24gb2YgdGhlIGV4dGVuc2lvbiwgY2FsbGVkIGJ5IHRoZSBlbmdpbmUuXG4gICAgICAgICAqL1xuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkZmlsdGVyID0gJCgnIycgKyBvcHRpb25zLmZpbHRlcik7XG5cbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuZWRpdCcsIF9lZGl0SGFuZGxlcilcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5zYXZlJywgX3NhdmVIYW5kbGVyKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmFib3J0JywgX2Fib3J0SGFuZGxlcilcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5yZXNldCcsIF9yZXNldEhhbmRsZXIpO1xuXG4gICAgICAgICAgICBpZiAoJGZpbHRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCAnLnNlYXJjaFBocmFzZSwgLnNlYXJjaFNlY3Rpb24nLCBfZmlsdGVySGFuZGxlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQoJyNuZWVkbGUnKS5mb2N1cygpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmV0dXJuIGRhdGEgdG8gbW9kdWxlIGVuZ2luZS5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
