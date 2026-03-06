/* 
	--------------------------------------------------------------
	gm_order.js 2021-05-13
	Gambio GmbH
	http://www.gambio.de
	Copyright (c) 2021 Gambio GmbH
	Released under the GNU General Public License (Version 2)
	[http://www.gnu.org/licenses/gpl-2.0.html]
   
    IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
    MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
    NEW GX-ENGINE LIBRARIES INSTEAD.
	--------------------------------------------------------------
*/

function gm_mail_close(box) {
    $("#GM_" + box + "_BOX").dialog('close');

}

function gm_mail_send(file, param, box) {

    var gm_subject = $("#gm_subject").val();
    var gm_mail = $("#gm_mail").val();
    $("#GM_" + box + "_BOX").html('<img src="../images/loading.gif" WIDTH="16" HEIGHT="16" BORDER="0" ALT="loading">');

    jQuery.ajax({
        data: "gm_mail=" + gm_mail + "&gm_subject=" + gm_subject,
        url: file + '?oID=' + oID + param,
        type: "POST",
        async: true,
        success: function (t_html) {
            $("#GM_" + box + "_BOX").html(t_html)

            if (t_html == '') // Hide modal if there is nothing to display.
            {
                $("#GM_" + box + "_BOX").fadeOut();
            }
        }
    }).html;
}

function gm_get_position(event, box) {

    position = new Array(2);
    var left = 0;
    var top = 0;
    var element_width = $('#GM_' + box + '_BOX').outerWidth();
    var element_height = $('#GM_' + box + '_BOX').outerHeight();

    var browser_width = $(document).width();

    var browser_scroll_top = $(document).scrollTop();
    var browser_scroll_left = $(document).scrollLeft();


    var browser_height = $(window).height();

    if (element_width + event.pageX > browser_width + browser_scroll_left) {
        position['left'] = browser_width + browser_scroll_left - element_width - 30;
    } else {
        position['left'] = event.pageX;
    }
    if (element_height + event.pageY > browser_height + browser_scroll_top) {
        position['top'] = browser_height + browser_scroll_top - element_height - 10;
    } else {
        position['top'] = event.pageY;
    }

    return position;
}

$(document).ready(function () {

    $("#gm_check").click(function () {
        if ($("#gm_check").prop("checked") == true) {
            $('input.checkbox').parent().addClass('checked');
            $("input.checkbox").prop("checked", true);
        } else {
            $('input.checkbox').parent().removeClass('checked');
            $("input.checkbox").prop('checked', false);
        }
    });

    $(".GM_SEND_ORDER").click(function (event) {
        oID = $('#gm_order_id').val();

        $("#GM_ORDERS_MAIL_BOX").load('gm_order_menu.php?' + 'oID=' + oID + '&type=order', function () {
            $(this).dialog({
                width: 'auto',
                height: 'auto',
                modal: true,
                dialogClass: 'gx-container',
                close: function () {
                    $('.ui-dialog-title').empty()
                }
            });

            $('.ui-dialog-title').append($('#GM_ORDERS_MAIL_BOX').find('strong').text());
            $('#GM_ORDERS_MAIL_BOX').find('strong').parent().css('display', 'none');
        });
    });

});