/* article_tabs_add.js <?php
 #   --------------------------------------------------------------
 #   article_tabs_add.js 2019-11-12
 #   Gambio GmbH
 #   http://www.gambio.de
 #   Copyright (c) 2019 Gambio GmbH
 #   Released under the GNU General Public License (Version 2)
 #   [http://www.gnu.org/licenses/gpl-2.0.html]
 #   --------------------------------------------------------------
 ?>*/

gx.widgets.init($('.article_tabs_container')).done(function () {
    setTimeout(function(){
        $(window).trigger('editor:initialize');
    }, 250);
});

$(".save", t_lightbox_package).bind("click", function () {
    'use strict';
    var tabHeadline = $.trim($(t_lightbox_package).find('.tab_headline').val()),
        tmpTabContent = '',
        id = $(container).parent().attr('id'),
        idArray = id.split('_'),
        langId = idArray[1],
        $input = $('<input />'),
        $hiddenTextarea = $('<textarea></textarea>'),
        $gridContainer = $('<div></div>'),
        $spanContainer = $('<div></div>'),
        $iconContainer = $('<div></div>'),
        $editIcon = $('<i></i>'),
        $editIconLink = $('<a></a>'),
        $removeIcon = $('<i></i>'),
        $removeIconLink = $('<a></a>');

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
        $input.attr({
            "type": "text",
            "name": "products_tab_headline_" + langId + '[]',
            "value": tabHeadline,
            "class": "hidden"
        });

        $hiddenTextarea
            .attr('name', 'products_tab_' + langId + '[]')
            .addClass('hidden')
            .text(tmpTabContent);

        $editIcon.attr('class', 'fa fa-pencil fa-fw cursor-pointer');

        $editIconLink.attr({
            "href": "article_tabs/article_tabs_edit.html?buttons=cancel-save",
            "class": "product_tabs_button js_product_tab_edit"
        });
        $editIconLink.append($editIcon);

        $removeIcon.attr('class', 'fa fa-trash-o fa-fw cursor-pointer');

        $removeIconLink.attr({
            "href": "article_tabs/article_tabs_delete.html?buttons=cancel-delete",
            "class": "product_tabs_button"
        });
        $removeIconLink.append($removeIcon);

        $iconContainer
            .attr('class', 'pull-right tab-icons-container')
            .append([$editIconLink, ' ', $removeIconLink]);

        $spanContainer
            .attr('class', 'span6')
            .append([$(
                '<i class="fa fa-sort add-margin-right-12"></i>' +
                '<span>' + tabHeadline + '</span>'), $iconContainer, $input, $hiddenTextarea]);
        $gridContainer
            .attr('class', 'grid tab-section')
            .append($spanContainer);

        $('.tab-btn-container-' + langId).before($gridContainer);

        if (use_wysiwyg === true) {
            // modify lightbox link for further clicks
            var editorType = $textarea.data('editorType') || 'ckeditor',
                editorIdentifier = $textarea.data('editorIdentifier'),
                $hiddenEditorIdentifierField = $textarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]'),
                hiddenEditorIdentifierFieldValue = $textarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]').val();

            if (location.href.search(/pID=[1-9]+/) !== -1) {
                hrefParams = "&editor_widget_attribute=data-gx-widget%3D%22editor%22%20data-editor-selector%3D%22textarea.wysiwyg%22%20data-editor-event-target%3D%22form%22%20data-editor-event-type%3D%22submit%22&editor_type=" + editorType + "&editor_identifier=" + editorIdentifier;
            } else {
                var hrefParams = "&editor_widget_attribute=data-gx-widget%3D%22editor%22%20data-editor-selector%3D%22textarea.wysiwyg%22%20&editor_type=" + editorType + "&editor_identifier=" + editorIdentifier;
            }

            if ($hiddenTextarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]').length > 0) {
                $hiddenTextarea.parent().find('input[name="editor_identifiers[' + editorIdentifier + ']"]')
                    .val(hiddenEditorIdentifierFieldValue);
            } else {
                $hiddenTextarea.after($hiddenEditorIdentifierField);
            }

            var $tabAddButton = $(container).find('a'),
                tabAddButtonCurrentIdentifier = $tabAddButton.attr('href').replace(/.*editor_identifier=[^-]+-[^-]+-[^-]+-[^-]+-([\d]+).*$/g, '$1'),
                tabAddButtonNextIdentifier = parseInt(tabAddButtonCurrentIdentifier) + 1;
            $tabAddButton.attr('href', $tabAddButton.attr('href').replace(/(editor_identifier=[^-]+-[^-]+-[^-]+-[^-]+-)([\d]+)(.*$)/g, '$1' + tabAddButtonNextIdentifier + '$3'));
            $editIconLink.attr('href', $editIconLink.attr('href') + hrefParams);

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