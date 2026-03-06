'use strict';

/* --------------------------------------------------------------
 cookies_notice_controller.js 2016-09-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Cookie Notice Controller
 *
 * Compatibility module that handles the "Cookie Notice" page under the "Rights" menu of "Shop Settings" section.
 * The data of the form are updated upon change and this module will just post them to LawsController. Check out
 * the fields that are language dependent, they will be changed when the user selects a language from the language
 * switcher component.
 *
 * @module Compatibility/cookie_notice_controller
 */
gx.compatibility.module('cookie_notice_controller', ['loading_spinner', gx.source + '/libs/editor_values', gx.source + '/libs/info_messages'], function (data) {

    'use strict';

    // --------------------------------------------------------------------
    // VARIABLES
    // --------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @type {object}
     */
    $this = $(this),


    /**
     * Module Instance
     *
     * @type {object}
     */
    module = {
        model: {
            formData: jse.core.config.get('appUrl') + '/admin/admin.php?do=Laws/GetCookiePreferences&pageToken=' + jse.core.config.get('pageToken')
        }
    };

    // --------------------------------------------------------------------
    // FUNCTIONS
    // --------------------------------------------------------------------

    /**
     * On Form Submit Event
     *
     * @param {object} event jQuery Event Object
     */
    var _onFormSubmit = function _onFormSubmit(event) {
        event.preventDefault();

        // Prepare form data and send them to the LawsController class. 
        var postUrl = jse.core.config.get('appUrl') + '/admin/admin.php?do=Laws/SaveCookiePreferences',
            postData = $.extend({ pageToken: jse.core.config.get('pageToken') }, module.model.formData),
            $spinner;

        $.ajax({
            url: postUrl,
            type: 'POST',
            data: postData,
            dataType: 'json',
            beforeSend: function beforeSend() {
                $spinner = jse.libs.loading_spinner.show($this, '4');
            }
        }).done(function () {
            // Display success message.
            jse.libs.info_messages.addSuccess(jse.core.lang.translate('TXT_SAVE_SUCCESS', 'admin_general'));
        }).fail(function (jqxhr, textStatus, errorThrown) {
            // Display failure message.
            jse.libs.info_messages.addError(jse.core.lang.translate('TXT_SAVE_ERROR', 'admin_general'));
            jse.core.debug.error('Could not save Cookie Notice preferences.', jqxhr, textStatus, errorThrown);
        }).always(function () {
            jse.libs.loading_spinner.hide($spinner);

            // Scroll to the top, so that the user sees the appropriate message.
            $('html, body').animate({ scrollTop: 0 });
        });
    };

    /**
     * On Language Flag Click Event
     *
     * @param {object} event jQuery event object.
     */
    var _onLanguageClick = function _onLanguageClick(event) {
        event.preventDefault();

        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        // Load the language specific fields.
        $.each(module.model.formData, function (name, value) {
            var $element = $this.find('[name="' + name + '"]');

            if ($element.data('multilingual') !== undefined) {
                var selectedLanguageCode = $('.languages a.active').data('code');
                $element.val(value[selectedLanguageCode]);
                if ($element.is('textarea') && $element.parents('.editor-wrapper').length) {
                    jse.libs.editor_values.setValue($element, value[selectedLanguageCode]);
                }
            } else {
                $element.val(value);

                if ($element.is(':checkbox') && value === 'true') {
                    $element.parent().addClass('checked');
                    $element.prop('checked', true);
                }

                if (name === 'position' && !value) {
                    $element.find('option[value="top"]').prop('selected', true).trigger('change');
                }
            }
        });
    };

    /**
     * On Input Element Change Event
     */
    var _onInputChange = function _onInputChange() {
        var $element = $(this);

        if ($element.data('multilingual') !== undefined) {
            var selectedLanguageCode = $('.languages a.active').data('code');
            module.model.formData[$element.attr('name')][selectedLanguageCode] = $element.val();
        } else {
            module.model.formData[$element.attr('name')] = $element.val();
        }
    };

    /**
     * On Switcher Widget Click Event
     */
    var _onSwitcherClick = function _onSwitcherClick() {
        module.model.formData[$(this).find('input:checkbox').attr('name')] = $(this).hasClass('checked');
    };

    // --------------------------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------------------------

    module.init = function (done) {
        // Bind form event handlers. 
        $this.on('submit', _onFormSubmit).on('click', '.languages a', _onLanguageClick).on('click', '.switcher', _onSwitcherClick);

        $this.find('input:hidden, input:text, select, textarea').on('change', _onInputChange);

        // Select active language.
        $('.languages').find('.active').trigger('click');

        // Set the color-preview colors.
        $this.find('.color-preview').each(function () {
            $(this).css('background-color', $(this).siblings('input:hidden').val());
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxhd3MvY29va2llX25vdGljZV9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJtb2RlbCIsImZvcm1EYXRhIiwianNlIiwiY29yZSIsImNvbmZpZyIsImdldCIsIl9vbkZvcm1TdWJtaXQiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwicG9zdFVybCIsInBvc3REYXRhIiwiZXh0ZW5kIiwicGFnZVRva2VuIiwiJHNwaW5uZXIiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGFUeXBlIiwiYmVmb3JlU2VuZCIsImxpYnMiLCJsb2FkaW5nX3NwaW5uZXIiLCJzaG93IiwiZG9uZSIsImluZm9fbWVzc2FnZXMiLCJhZGRTdWNjZXNzIiwibGFuZyIsInRyYW5zbGF0ZSIsImZhaWwiLCJqcXhociIsInRleHRTdGF0dXMiLCJlcnJvclRocm93biIsImFkZEVycm9yIiwiZGVidWciLCJlcnJvciIsImFsd2F5cyIsImhpZGUiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwiX29uTGFuZ3VhZ2VDbGljayIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImVhY2giLCJuYW1lIiwidmFsdWUiLCIkZWxlbWVudCIsImZpbmQiLCJ1bmRlZmluZWQiLCJzZWxlY3RlZExhbmd1YWdlQ29kZSIsInZhbCIsImlzIiwicGFyZW50cyIsImxlbmd0aCIsImVkaXRvcl92YWx1ZXMiLCJzZXRWYWx1ZSIsInBhcmVudCIsInByb3AiLCJ0cmlnZ2VyIiwiX29uSW5wdXRDaGFuZ2UiLCJhdHRyIiwiX29uU3dpdGNoZXJDbGljayIsImhhc0NsYXNzIiwiaW5pdCIsIm9uIiwiY3NzIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSwwQkFESixFQUdJLENBQUMsaUJBQUQsRUFBdUJGLEdB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O0FBQ0gsU0FGRDs7QUFJQTNCO0FBQ0gsS0FwQkQ7O0FBc0JBLFdBQU8zQixNQUFQO0FBQ0gsQ0E5SkwiLCJmaWxlIjoibGF3cy9jb29raWVfbm90aWNlX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNvb2tpZXNfbm90aWNlX2NvbnRyb2xsZXIuanMgMjAxNi0wOS0wOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQ29va2llIE5vdGljZSBDb250cm9sbGVyXG4gKlxuICogQ29tcGF0aWJpbGl0eSBtb2R1bGUgdGhhdCBoYW5kbGVzIHRoZSBcIkNvb2tpZSBOb3RpY2VcIiBwYWdlIHVuZGVyIHRoZSBcIlJpZ2h0c1wiIG1lbnUgb2YgXCJTaG9wIFNldHRpbmdzXCIgc2VjdGlvbi5cbiAqIFRoZSBkYXRhIG9mIHRoZSBmb3JtIGFyZSB1cGRhdGVkIHVwb24gY2hhbmdlIGFuZCB0aGlzIG1vZHVsZSB3aWxsIGp1c3QgcG9zdCB0aGVtIHRvIExhd3NDb250cm9sbGVyLiBDaGVjayBvdXRcbiAqIHRoZSBmaWVsZHMgdGhhdCBhcmUgbGFuZ3VhZ2UgZGVwZW5kZW50LCB0aGV5IHdpbGwgYmUgY2hhbmdlZCB3aGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBsYW5ndWFnZSBmcm9tIHRoZSBsYW5ndWFnZVxuICogc3dpdGNoZXIgY29tcG9uZW50LlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9jb29raWVfbm90aWNlX2NvbnRyb2xsZXJcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ2Nvb2tpZV9ub3RpY2VfY29udHJvbGxlcicsXG5cbiAgICBbJ2xvYWRpbmdfc3Bpbm5lcicsIGAke2d4LnNvdXJjZX0vbGlicy9lZGl0b3JfdmFsdWVzYCwgYCR7Z3guc291cmNlfS9saWJzL2luZm9fbWVzc2FnZXNgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge1xuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnL2FkbWluL2FkbWluLnBocD9kbz1MYXdzL0dldENvb2tpZVByZWZlcmVuY2VzJnBhZ2VUb2tlbj0nICsganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIEZVTkNUSU9OU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBGb3JtIFN1Ym1pdCBFdmVudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgalF1ZXJ5IEV2ZW50IE9iamVjdFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkZvcm1TdWJtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgZm9ybSBkYXRhIGFuZCBzZW5kIHRoZW0gdG8gdGhlIExhd3NDb250cm9sbGVyIGNsYXNzLiBcbiAgICAgICAgICAgIHZhciBwb3N0VXJsID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1MYXdzL1NhdmVDb29raWVQcmVmZXJlbmNlcycsXG4gICAgICAgICAgICAgICAgcG9zdERhdGEgPSAkLmV4dGVuZCh7cGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKX0sIG1vZHVsZS5tb2RlbC5mb3JtRGF0YSksXG4gICAgICAgICAgICAgICAgJHNwaW5uZXI7XG5cbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBwb3N0VXJsLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBwb3N0RGF0YSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNwaW5uZXIgPSBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuc2hvdygkdGhpcywgJzQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uICgpIHsgLy8gRGlzcGxheSBzdWNjZXNzIG1lc3NhZ2UuXG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmluZm9fbWVzc2FnZXMuYWRkU3VjY2Vzcyhqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVFhUX1NBVkVfU1VDQ0VTUycsICdhZG1pbl9nZW5lcmFsJykpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgeyAvLyBEaXNwbGF5IGZhaWx1cmUgbWVzc2FnZS5cbiAgICAgICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19tZXNzYWdlcy5hZGRFcnJvcihqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnVFhUX1NBVkVfRVJST1InLCAnYWRtaW5fZ2VuZXJhbCcpKTtcbiAgICAgICAgICAgICAgICAgICAganNlLmNvcmUuZGVidWcuZXJyb3IoJ0NvdWxkIG5vdCBzYXZlIENvb2tpZSBOb3RpY2UgcHJlZmVyZW5jZXMuJywganF4aHIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5sb2FkaW5nX3NwaW5uZXIuaGlkZSgkc3Bpbm5lcik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU2Nyb2xsIHRvIHRoZSB0b3AsIHNvIHRoYXQgdGhlIHVzZXIgc2VlcyB0aGUgYXBwcm9wcmlhdGUgbWVzc2FnZS5cbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBMYW5ndWFnZSBGbGFnIENsaWNrIEV2ZW50XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCBqUXVlcnkgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9vbkxhbmd1YWdlQ2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgLy8gTG9hZCB0aGUgbGFuZ3VhZ2Ugc3BlY2lmaWMgZmllbGRzLlxuICAgICAgICAgICAgJC5lYWNoKG1vZHVsZS5tb2RlbC5mb3JtRGF0YSwgZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtZW50ID0gJHRoaXMuZmluZCgnW25hbWU9XCInICsgbmFtZSArICdcIl0nKTtcblxuICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5kYXRhKCdtdWx0aWxpbmd1YWwnKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZExhbmd1YWdlQ29kZSA9ICQoJy5sYW5ndWFnZXMgYS5hY3RpdmUnKS5kYXRhKCdjb2RlJyk7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnZhbCh2YWx1ZVtzZWxlY3RlZExhbmd1YWdlQ29kZV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQuaXMoJ3RleHRhcmVhJykgJiYgJGVsZW1lbnQucGFyZW50cygnLmVkaXRvci13cmFwcGVyJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqc2UubGlicy5lZGl0b3JfdmFsdWVzLnNldFZhbHVlKCRlbGVtZW50LCB2YWx1ZVtzZWxlY3RlZExhbmd1YWdlQ29kZV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQudmFsKHZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQuaXMoJzpjaGVja2JveCcpICYmIHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LnBhcmVudCgpLmFkZENsYXNzKCdjaGVja2VkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudC5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gJ3Bvc2l0aW9uJyAmJiAhdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50LmZpbmQoJ29wdGlvblt2YWx1ZT1cInRvcFwiXScpLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSkudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gSW5wdXQgRWxlbWVudCBDaGFuZ2UgRXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb25JbnB1dENoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZWxlbWVudCA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIGlmICgkZWxlbWVudC5kYXRhKCdtdWx0aWxpbmd1YWwnKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkTGFuZ3VhZ2VDb2RlID0gJCgnLmxhbmd1YWdlcyBhLmFjdGl2ZScpLmRhdGEoJ2NvZGUnKTtcbiAgICAgICAgICAgICAgICBtb2R1bGUubW9kZWwuZm9ybURhdGFbJGVsZW1lbnQuYXR0cignbmFtZScpXVtzZWxlY3RlZExhbmd1YWdlQ29kZV0gPSAkZWxlbWVudC52YWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlLm1vZGVsLmZvcm1EYXRhWyRlbGVtZW50LmF0dHIoJ25hbWUnKV0gPSAkZWxlbWVudC52YWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gU3dpdGNoZXIgV2lkZ2V0IENsaWNrIEV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29uU3dpdGNoZXJDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1vZHVsZS5tb2RlbC5mb3JtRGF0YVskKHRoaXMpLmZpbmQoJ2lucHV0OmNoZWNrYm94JykuYXR0cignbmFtZScpXSA9ICQodGhpcykuaGFzQ2xhc3MoJ2NoZWNrZWQnKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIEJpbmQgZm9ybSBldmVudCBoYW5kbGVycy4gXG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignc3VibWl0JywgX29uRm9ybVN1Ym1pdClcbiAgICAgICAgICAgICAgICAub24oJ2NsaWNrJywgJy5sYW5ndWFnZXMgYScsIF9vbkxhbmd1YWdlQ2xpY2spXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcuc3dpdGNoZXInLCBfb25Td2l0Y2hlckNsaWNrKTtcblxuICAgICAgICAgICAgJHRoaXNcbiAgICAgICAgICAgICAgICAuZmluZCgnaW5wdXQ6aGlkZGVuLCBpbnB1dDp0ZXh0LCBzZWxlY3QsIHRleHRhcmVhJylcbiAgICAgICAgICAgICAgICAub24oJ2NoYW5nZScsIF9vbklucHV0Q2hhbmdlKTtcblxuICAgICAgICAgICAgLy8gU2VsZWN0IGFjdGl2ZSBsYW5ndWFnZS5cbiAgICAgICAgICAgICQoJy5sYW5ndWFnZXMnKS5maW5kKCcuYWN0aXZlJykudHJpZ2dlcignY2xpY2snKTtcblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBjb2xvci1wcmV2aWV3IGNvbG9ycy5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5jb2xvci1wcmV2aWV3JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAkKHRoaXMpLnNpYmxpbmdzKCdpbnB1dDpoaWRkZW4nKS52YWwoKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7Il19
