'use strict';

/* --------------------------------------------------------------
 offline_layer_editor.js 2016-09-08
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Site Online/Offline Layer Editor Controller
 *
 * @module Controllers/offline_layer_editor
 */
gx.controllers.module('offline_layer_editor', ['form', 'fallback', gx.source + '/libs/editor_values', gx.source + '/libs/editor_instances'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    var $this = $(this),
        defaults = {},
        options = $.extend(true, {}, defaults, data),
        lightboxParameters = $this.data('lightboxParams'),
        module = {},
        $fields = null,
        temporaryNamePostfix = '',
        $layer = $('#lightbox_package_' + lightboxParameters.identifier),
        $form = $this.find('.lightbox_content_container form'),
        $parentForm = $(lightboxParameters.element).closest('tr');

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    var _modifyFormInputNames = function _modifyFormInputNames(revertOriginalNames) {
        $fields.each(function () {
            var $field = $(this),
                name = $field.attr('name');
            name = revertOriginalNames ? name.replace(temporaryNamePostfix, '') : name + temporaryNamePostfix;
            $field.attr('name', name);
        });
    };

    var _onOkButtonClick = function _onOkButtonClick() {
        $form.find('.wysiwyg').each(function (index, textarea) {
            var $textarea = $(textarea),
                value = jse.libs.editor_values.getValue($textarea);

            $textarea.val(value);
        });

        $layer.find('form').trigger('layerClose');

        _modifyFormInputNames(true);
        jse.libs.form.prefillForm($parentForm, jse.libs.fallback.getData($form), false);
        $.lightbox_plugin('close', lightboxParameters.identifier);
        _destroyEditorInstance();

        // Set editor-type hidden fields in the timer table (they'll be saved on save/insert from PHP).
        var $textarea = $this.find('.wysiwyg'),
            editorIdentifier = $textarea.data('editorIdentifier'),
            editorType = $textarea.data('editorType'),
            $inputHidden = $form.find('[name="editor_identifiers[' + editorIdentifier + ']"]'),
            $editIcon = $('.timer-table [name="editor_identifiers[' + editorIdentifier + ']"]:first').parent().find('i.open_lightbox');

        $inputHidden.val(editorType);

        if ($editIcon.length) {
            // $editIcon.attr('data-lightbox-editor-type', editorType); 
            $editIcon.data('lightboxEditorType', editorType);
        }
    };

    var _onCloseButtonClick = function _onCloseButtonClick() {
        _modifyFormInputNames(true);
        _destroyEditorInstance();
    };

    var _destroyEditorInstance = function _destroyEditorInstance() {
        var $textarea = $this.find('.wysiwyg');

        if ($textarea.length) {
            jse.libs.editor_instances.destroy($textarea);
        }

        $(window).off('editor:initialize editor:ready');
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // -----------------------------------------------------------------------

    module.init = function (done) {
        var dataset = jse.libs.fallback.getData($parentForm);
        $fields = $parentForm.find('[name]');
        temporaryNamePostfix = '_tmp_' + parseInt(Math.random() * new Date().getTime());

        _modifyFormInputNames();
        jse.libs.form.prefillForm($form, dataset, false);
        jse.libs.fallback.setupWidgetAttr($this);

        $.when(gx.extensions.init($this), gx.controllers.init($this), gx.widgets.init($this), gx.compatibility.init($this)).then(function () {
            // Delay the editor initialization until the lightbox is ready.
            $(window).trigger('editor:initialize');
        });

        $layer.on('click', '.ok', _onOkButtonClick).on('click', '.close', _onCloseButtonClick);

        $this.find('form').trigger('language_switcher.updateField');

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3Bfb2ZmbGluZS9vZmZsaW5lX2xheWVyX2VkaXRvci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsImxpZ2h0Ym94UGFyYW1ldGVycyIsIiRmaWVsZHMiLCJ0ZW1wb3JhcnlOYW1lUG9zdGZpeCIsIiRsYXllciIsImlkZW50aWZpZXIiLCIkZm9ybSIsImZpbmQiLCIkcGFyZW50Rm9ybSIsImVsZW1lbnQiLCJjbG9zZXN0IiwiX21vZGlmeUZvcm1JbnB1dE5hbWVzIiwicmV2ZXJ0T3JpZ2luYWxOYW1lcyIsImVhY2giLCIkZmllbGQiLCJuYW1lIiwiYXR0ciIsInJlcGxhY2UiLCJfb25Pa0J1dHRvbkNsaWNrIiwiaW5kZXgiLCJ0ZXh0YXJlYSIsIiR0ZXh0YXJlYSIsInZhbHVlIiwianNlIiwibGlicyIsImVkaXRvcl92YWx1ZXMiLCJnZXRWYWx1ZSIsInZhbCIsInRyaWdnZXIiLCJmb3JtIiwicHJlZmlsbEZvcm0iLCJmYWxsYmFjayIsImdldERhdGEiLCJsaWdodGJveF9wbHVnaW4iLCJfZGVzdHJveUVkaXRvckluc3RhbmNlIiwiZWRpdG9ySWRlbnRpZmllciIsImVkaXRvclR5cGUiLCIkaW5wdXRIaWRkZW4iLCIkZWRpdEljb24iLCJwYXJlbnQiLCJsZW5ndGgiLCJfb25DbG9zZUJ1dHRvbkNsaWNrIiwiZWRpdG9yX2luc3RhbmNlcyIsImRlc3Ryb3kiLCJ3aW5kb3ciLCJvZmYiLCJpbml0IiwiZG9uZSIsImRhdGFzZXQiLCJwYXJzZUludCIsIk1hdGgiLCJyYW5kb20iLCJEYXRlIiwiZ2V0VGltZSIsInNldHVwV2lkZ2V0QXR0ciIsIndoZW4iLCJleHRlbnNpb25zIiwid2lkZ2V0cyIsImNvbXBhdGliaWxpdHkiLCJ0aGVuIiwib24iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7QUFLQUEs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QWdCbEQsS0FBaEIsQ0FISixFQUlJTCxHQUFHbUUsYUFBSCxDQUFpQlosSUFBakIsQ0FBc0JsRCxLQUF0QixDQUpKLEVBS0UrRCxJQUxGLENBS08sWUFBWTtBQUNmO0FBQ0E5RCxjQUFFK0MsTUFBRixFQUFVaEIsT0FBVixDQUFrQixtQkFBbEI7QUFDSCxTQVJEOztBQVVBeEIsZUFDS3dELEVBREwsQ0FDUSxPQURSLEVBQ2lCLEtBRGpCLEVBQ3dCMUMsZ0JBRHhCLEVBRUswQyxFQUZMLENBRVEsT0FGUixFQUVpQixRQUZqQixFQUUyQm5CLG1CQUYzQjs7QUFJQTdDLGNBQU1XLElBQU4sQ0FBVyxNQUFYLEVBQW1CcUIsT0FBbkIsQ0FBMkIsK0JBQTNCOztBQUVBbUI7QUFDSCxLQTFCRDs7QUE0QkEsV0FBT3RELE1BQVA7QUFDSCxDQXZITCIsImZpbGUiOiJzaG9wX29mZmxpbmUvb2ZmbGluZV9sYXllcl9lZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9mZmxpbmVfbGF5ZXJfZWRpdG9yLmpzIDIwMTYtMDktMDhcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIFNpdGUgT25saW5lL09mZmxpbmUgTGF5ZXIgRWRpdG9yIENvbnRyb2xsZXJcbiAqXG4gKiBAbW9kdWxlIENvbnRyb2xsZXJzL29mZmxpbmVfbGF5ZXJfZWRpdG9yXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAnb2ZmbGluZV9sYXllcl9lZGl0b3InLFxuXG4gICAgWydmb3JtJywgJ2ZhbGxiYWNrJywgZ3guc291cmNlICsgJy9saWJzL2VkaXRvcl92YWx1ZXMnLCBneC5zb3VyY2UgKyAnL2xpYnMvZWRpdG9yX2luc3RhbmNlcyddLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuICAgICAgICAgICAgbGlnaHRib3hQYXJhbWV0ZXJzID0gJHRoaXMuZGF0YSgnbGlnaHRib3hQYXJhbXMnKSxcbiAgICAgICAgICAgIG1vZHVsZSA9IHt9LFxuICAgICAgICAgICAgJGZpZWxkcyA9IG51bGwsXG4gICAgICAgICAgICB0ZW1wb3JhcnlOYW1lUG9zdGZpeCA9ICcnLFxuICAgICAgICAgICAgJGxheWVyID0gJCgnI2xpZ2h0Ym94X3BhY2thZ2VfJyArIGxpZ2h0Ym94UGFyYW1ldGVycy5pZGVudGlmaWVyKSxcbiAgICAgICAgICAgICRmb3JtID0gJHRoaXMuZmluZCgnLmxpZ2h0Ym94X2NvbnRlbnRfY29udGFpbmVyIGZvcm0nKSxcbiAgICAgICAgICAgICRwYXJlbnRGb3JtID0gJChsaWdodGJveFBhcmFtZXRlcnMuZWxlbWVudCkuY2xvc2VzdCgndHInKTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhciBfbW9kaWZ5Rm9ybUlucHV0TmFtZXMgPSBmdW5jdGlvbiAocmV2ZXJ0T3JpZ2luYWxOYW1lcykge1xuICAgICAgICAgICAgJGZpZWxkcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGZpZWxkID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9ICRmaWVsZC5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHJldmVydE9yaWdpbmFsTmFtZXMgPyBuYW1lLnJlcGxhY2UodGVtcG9yYXJ5TmFtZVBvc3RmaXgsICcnKSA6IChuYW1lICsgdGVtcG9yYXJ5TmFtZVBvc3RmaXgpO1xuICAgICAgICAgICAgICAgICRmaWVsZC5hdHRyKCduYW1lJywgbmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29uT2tCdXR0b25DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRmb3JtXG4gICAgICAgICAgICAgICAgLmZpbmQoJy53eXNpd3lnJylcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRleHRhcmVhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGV4dGFyZWEgPSAkKHRleHRhcmVhKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0ganNlLmxpYnMuZWRpdG9yX3ZhbHVlcy5nZXRWYWx1ZSgkdGV4dGFyZWEpO1xuXG4gICAgICAgICAgICAgICAgICAgICR0ZXh0YXJlYS52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkbGF5ZXJcbiAgICAgICAgICAgICAgICAuZmluZCgnZm9ybScpXG4gICAgICAgICAgICAgICAgLnRyaWdnZXIoJ2xheWVyQ2xvc2UnKTtcblxuICAgICAgICAgICAgX21vZGlmeUZvcm1JbnB1dE5hbWVzKHRydWUpO1xuICAgICAgICAgICAganNlLmxpYnMuZm9ybS5wcmVmaWxsRm9ybSgkcGFyZW50Rm9ybSwganNlLmxpYnMuZmFsbGJhY2suZ2V0RGF0YSgkZm9ybSksIGZhbHNlKTtcbiAgICAgICAgICAgICQubGlnaHRib3hfcGx1Z2luKCdjbG9zZScsIGxpZ2h0Ym94UGFyYW1ldGVycy5pZGVudGlmaWVyKTtcbiAgICAgICAgICAgIF9kZXN0cm95RWRpdG9ySW5zdGFuY2UoKTtcblxuICAgICAgICAgICAgLy8gU2V0IGVkaXRvci10eXBlIGhpZGRlbiBmaWVsZHMgaW4gdGhlIHRpbWVyIHRhYmxlICh0aGV5J2xsIGJlIHNhdmVkIG9uIHNhdmUvaW5zZXJ0IGZyb20gUEhQKS5cbiAgICAgICAgICAgIHZhciAkdGV4dGFyZWEgPSAkdGhpcy5maW5kKCcud3lzaXd5ZycpLFxuICAgICAgICAgICAgICAgIGVkaXRvcklkZW50aWZpZXIgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9ySWRlbnRpZmllcicpLFxuICAgICAgICAgICAgICAgIGVkaXRvclR5cGUgPSAkdGV4dGFyZWEuZGF0YSgnZWRpdG9yVHlwZScpLFxuICAgICAgICAgICAgICAgICRpbnB1dEhpZGRlbiA9ICRmb3JtLmZpbmQoJ1tuYW1lPVwiZWRpdG9yX2lkZW50aWZpZXJzWycgKyBlZGl0b3JJZGVudGlmaWVyICsgJ11cIl0nKSxcbiAgICAgICAgICAgICAgICAkZWRpdEljb24gPSAkKCcudGltZXItdGFibGUgW25hbWU9XCJlZGl0b3JfaWRlbnRpZmllcnNbJyArIGVkaXRvcklkZW50aWZpZXIgKyAnXVwiXTpmaXJzdCcpLnBhcmVudCgpLmZpbmQoJ2kub3Blbl9saWdodGJveCcpO1xuXG4gICAgICAgICAgICAkaW5wdXRIaWRkZW4udmFsKGVkaXRvclR5cGUpO1xuXG4gICAgICAgICAgICBpZiAoJGVkaXRJY29uLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vICRlZGl0SWNvbi5hdHRyKCdkYXRhLWxpZ2h0Ym94LWVkaXRvci10eXBlJywgZWRpdG9yVHlwZSk7IFxuICAgICAgICAgICAgICAgICRlZGl0SWNvbi5kYXRhKCdsaWdodGJveEVkaXRvclR5cGUnLCBlZGl0b3JUeXBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX29uQ2xvc2VCdXR0b25DbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF9tb2RpZnlGb3JtSW5wdXROYW1lcyh0cnVlKTtcbiAgICAgICAgICAgIF9kZXN0cm95RWRpdG9ySW5zdGFuY2UoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2Rlc3Ryb3lFZGl0b3JJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGV4dGFyZWEgPSAkdGhpcy5maW5kKCcud3lzaXd5ZycpO1xuXG4gICAgICAgICAgICBpZiAoJHRleHRhcmVhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGpzZS5saWJzLmVkaXRvcl9pbnN0YW5jZXMuZGVzdHJveSgkdGV4dGFyZWEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKCdlZGl0b3I6aW5pdGlhbGl6ZSBlZGl0b3I6cmVhZHknKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB2YXIgZGF0YXNldCA9IGpzZS5saWJzLmZhbGxiYWNrLmdldERhdGEoJHBhcmVudEZvcm0pO1xuICAgICAgICAgICAgJGZpZWxkcyA9ICRwYXJlbnRGb3JtLmZpbmQoJ1tuYW1lXScpO1xuICAgICAgICAgICAgdGVtcG9yYXJ5TmFtZVBvc3RmaXggPSAnX3RtcF8nICsgcGFyc2VJbnQoTWF0aC5yYW5kb20oKSAqIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcblxuICAgICAgICAgICAgX21vZGlmeUZvcm1JbnB1dE5hbWVzKCk7XG4gICAgICAgICAgICBqc2UubGlicy5mb3JtLnByZWZpbGxGb3JtKCRmb3JtLCBkYXRhc2V0LCBmYWxzZSk7XG4gICAgICAgICAgICBqc2UubGlicy5mYWxsYmFjay5zZXR1cFdpZGdldEF0dHIoJHRoaXMpO1xuXG4gICAgICAgICAgICAkLndoZW4oXG4gICAgICAgICAgICAgICAgZ3guZXh0ZW5zaW9ucy5pbml0KCR0aGlzKSxcbiAgICAgICAgICAgICAgICBneC5jb250cm9sbGVycy5pbml0KCR0aGlzKSxcbiAgICAgICAgICAgICAgICBneC53aWRnZXRzLmluaXQoJHRoaXMpLFxuICAgICAgICAgICAgICAgIGd4LmNvbXBhdGliaWxpdHkuaW5pdCgkdGhpcylcbiAgICAgICAgICAgICkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gRGVsYXkgdGhlIGVkaXRvciBpbml0aWFsaXphdGlvbiB1bnRpbCB0aGUgbGlnaHRib3ggaXMgcmVhZHkuXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoJ2VkaXRvcjppbml0aWFsaXplJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGxheWVyXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcub2snLCBfb25Pa0J1dHRvbkNsaWNrKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLmNsb3NlJywgX29uQ2xvc2VCdXR0b25DbGljayk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJ2Zvcm0nKS50cmlnZ2VyKCdsYW5ndWFnZV9zd2l0Y2hlci51cGRhdGVGaWVsZCcpO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
