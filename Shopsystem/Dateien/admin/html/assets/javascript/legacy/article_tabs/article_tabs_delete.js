/* article_tabs_delete.js <?php
 #   --------------------------------------------------------------
 #   article_tabs_delete.js 2016-09-08
 #   Gambio GmbH
 #   http://www.gambio.de
 #   Copyright (c) 2016 Gambio GmbH
 #   Released under the GNU General Public License (Version 2)
 #   [http://www.gnu.org/licenses/gpl-2.0.html]
 #   --------------------------------------------------------------
 ?>*/
var headingName = $(t_lightbox_package).find('.tab_message').html().replace('#tab_headline#',
    $(container).find('span').html());
$(t_lightbox_package).find('.tab_message').text(headingName);

$(".delete", t_lightbox_package).bind("click", function () {
    var $tabAddButton = $(container).closest('.product-tabs').find('.add_tab_button'),
        tabAddButtonCurrentIdentifier = $tabAddButton.attr('href').replace(/.*editor_identifier=[^-]+-[^-]+-[^-]+-[^-]+-([\d]+).*$/g, '$1'),
        tabAddButtonNextIdentifier = parseInt(tabAddButtonCurrentIdentifier) - 1;
    $tabAddButton.attr('href', $tabAddButton.attr('href').replace(/(editor_identifier=[^-]+-[^-]+-[^-]+-[^-]+-)([\d]+)(.*$)/g, '$1' + tabAddButtonNextIdentifier + '$3'));

    $(container).parent().remove();
    $.lightbox_plugin("close", t_lightbox_identifier);
    return false;
});