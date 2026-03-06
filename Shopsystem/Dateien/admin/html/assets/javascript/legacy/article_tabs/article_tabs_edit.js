/* article_tabs_edit.js <?php
 #   --------------------------------------------------------------
 #   article_tabs_edit.js 2019-11-12
 #   Gambio GmbH
 #   http://www.gambio.de
 #   Copyright (c) 2019 Gambio GmbH
 #   Released under the GNU General Public License (Version 2)
 #   [http://www.gnu.org/licenses/gpl-2.0.html]
 #   --------------------------------------------------------------
 ?>*/

$(".tab_headline", t_lightbox_package).val($(container).find("input").val());
$(".tab_content_" + t_lightbox_identifier).val($(container).find("textarea").val());

gx.widgets.init($('.article_tabs_container')).done(function () {
    setTimeout(function(){
        $(window).trigger('editor:initialize');
    }, 250);
});

$(".save", t_lightbox_package).bind("click", function () {
    'use strict';
    var tabHeadline = $.trim($(t_lightbox_package).find('.tab_headline').val()),
        tmpTabContent = '';

    if (use_wysiwyg === true) {
        var $textarea = $(".tab_content_" + t_lightbox_identifier),
            tmpTabContent = jse.libs.editor_values.getValue($textarea);
    } else {
        tmpTabContent = $.trim($('.tab_content_' + t_lightbox_identifier).val());
    }
    if (tmpTabContent === "<br />\n" +
        "&nbsp;") {
        tmpTabContent = '';
    }

    if (tmpTabContent !== '' && tabHeadline !== '') {

        $(container).find('span').text(tabHeadline);
        $(container).find('input').val(tabHeadline);
        $(container).find('textarea').text(tmpTabContent);

        var $hiddenTextarea = $(container).find('textarea');
        $hiddenTextarea.text(tmpTabContent);

        if (use_wysiwyg === true) {
            // modify lightbox link for further clicks
            var $editLink = $(container).find('.js_product_tab_edit'),
                editorType = $textarea.data('editorType') || 'ckeditor',
                editorIdentifier = $textarea.data('editorIdentifier'),
                $hiddenEditorIdentifierField = $textarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]'),
                hiddenEditorIdentifierFieldValue = $textarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]').val();

            if ($hiddenTextarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]').length > 0) {
                $hiddenTextarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]')
                    .val(hiddenEditorIdentifierFieldValue);
            } else {
                $hiddenTextarea.after($hiddenEditorIdentifierField);
            }

            $editLink.attr('href', $editLink.attr('href').replace(/editor_type=.*?&/g, 'editor_type=' + editorType + '&'));

            // destroy editor instance which was created inside the lightbox
            jse.libs.editor_instances.destroy($textarea, 'editor:initialize');
        }

        $.lightbox_plugin('close', t_lightbox_identifier);
    } else if (tabHeadline !== '') {
        $.lightbox_plugin('error', t_lightbox_identifier, 'article_tab_content_empty');
    } else {
        $.lightbox_plugin('error', t_lightbox_identifier, 'article_tab_headline_empty');
    }

    return false;
});

$(".cancel", t_lightbox_package).bind("click", function () {
    if (use_wysiwyg === true) {
        var $textarea = $(".tab_content_" + t_lightbox_identifier);
        // destroy editor instance which was created inside the lightbox
        jse.libs.editor_instances.destroy($textarea, 'editor:initialize');
    }
});