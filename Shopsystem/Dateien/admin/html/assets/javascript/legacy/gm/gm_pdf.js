/*
 --------------------------------------------------------------
 gm_pdf.js 2019-01-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2019 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]

 IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
 MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
 NEW GX-ENGINE LIBRARIES INSTEAD.
 --------------------------------------------------------------
 */

var navTabHtmlBackup = '';


// Compatibility menu handling

$(document).ready(function () {
    $(document).on('click', '.nav-tab a', function () {
        var $parent = $(this).parents('.page-nav-tabs');

        if (navTabHtmlBackup != '') {
            $parent.find('.nav-tab').filter(function () {
                if ($(this).find('a').length == 0)
                    return true;
                else
                    return false;
            }).html(navTabHtmlBackup).removeClass('no-link');
        }

        navTabHtmlBackup = $(this).parent().html();
        $(this).parent().addClass('no-link');
        $(this).parent().text($(this).text());
    });

    $(document).on('click', '.tab-headline-wrapper a', function () {
        $(this).siblings('.active').removeClass('active');
        $(this).addClass('active');
    });

    // Fetch initial content for the page once the page compatibility mode is completely loaded.
    $(window).on('JSENGINE_INIT_FINISHED', function () {
        var urlHash = window.location.hash;

        if ($('.page-nav-tabs .nav-tab').length > 0) {
            if (urlHash === '#gm_pdf_bulk') {
                $('.page-nav-tabs .nav-tab:last a').click();
            } else {
                $('.page-nav-tabs .nav-tab:first a').trigger('click');
            }
        }

        renew_bottom_save_bar();
    });
});

/*
 * -> bind functions
 */
$('#colorpicker').ready(function () {
    // -> farbtastic plugin
    $('#colorpicker').farbtastic('#color');

    // -> manage escaping
    $(".close").click(function () {
        $("#gm_color_box").hide('normal');
    });

    // -> manage saving
    $(".save").click(function (e) {
        var new_color = $("input#color").val();
        var input_ref = $("input#actual").val();

        $("#" + input_ref + "_PICKER").css({
            "background-color": new_color
        });
        $("input#" + input_ref).val(new_color);

        $("#gm_color_box").hide('normal');
    });
});

function renew_bottom_save_bar() {
    $('.bottom-save-bar').text('');
    window.gx.widgets.init();
    window.gx.compatibility.init();
    $('.main-bottom-footer').attr('data-gx-compatibility', 'bottom_save_bar');
}

/*
 * -> get Position
 */
function gm_get_position(event) {
    position = new Array(2);
    var left = 0;
    var top = 0;
    var element_width = $('#gm_color_box').outerWidth();
    var element_height = $('#gm_color_box').outerHeight();

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

/*
 * -> load contents
 */
function gm_get_content(action, submenu, submenu_link, resetIndex) {
    // debugger;

    if (typeof resetIndex == 'undefined') {
        resetIndex = true;
    }

    // -> show image while loading
    $("#gm_box_content").html('<img src="../images/loading.gif" class="untouched" WIDTH="16" HEIGHT="16" BORDER="0" ALT="loading">');

    // -> hide the color picker box
    $("#gm_color_box").hide('normal');

    // -> load contents
    $("#gm_box_content").load(
        action,
        {},
        function () {
            var index = (!resetIndex) ? $('.tab-headline-wrapper a.active').index() : 0;

            var resetActiveTab = function () {
                $('.tab-headline-wrapper a:eq(' + index + ')').addClass('active');
            };

            if (submenu == 'gm_pdf_content') {
                $("#gm_box_submenu").show('fast');
                $("#gm_box_submenu").load(submenu_link, resetActiveTab);
            } else if (submenu == 'gm_pdf_conf') {
                $("#gm_box_submenu").show('fast');
                $("#gm_box_submenu").load(submenu_link, resetActiveTab);
            } else if (submenu == 'gm_pdf_fonts') {
                $("#gm_box_submenu").hide('fast');
                $.each($('#gm_pdf_form').get(0).elements, function (k, ele) {
                    $("#" + ele.id + '_PICKER').click(function (e) {
                        var position = gm_get_position(e);

                        $("#gm_color_box").show('normal');

                        $("input#color").val($("input#" + ele.id).val());

                        $("input#actual").val(ele.id);

                        $("#gm_color_box").css(
                            {
                                "position": "absolute",
                                "top": position['top'] + "px",
                                "left": position['left'] + "px"
                            });

                        $("#color").css(
                            {
                                "background-color": $("input#" + ele.id).val()
                            });
                    });
                });

            } else {
                $("#gm_box_submenu").hide('fast');
            }
            renew_bottom_save_bar();
        }
    );
}

/*
 * -> update content 'get'
 */
function gm_update_boxes(action, box) {
    $("#gm_status").html('<img src="../images/loading.gif" class="untouched" WIDTH="16" HEIGHT="16" BORDER="0" ALT="loading">');

    var getString = '';

    $.each(
        $('#gm_pdf_form').get(0).elements, function (k, ele) {
            if (ele.id != '' && ele.id.search(/PICKER/) == -1) {
                getString = ele.id + "=" + encodeURIComponent(ele.value) + '&' + getString;
            }
        });

	const bankDataColumns = $('input[name="bankDataColumn"]');
    
    // Not every tab has access to the bank detail checkboxes. Therefore, do nothing
    // and don't send the bankDataColumn key with the value of 'undefined'
	if (bankDataColumns.length) {
		
		var checkedBankDateColumnValues = [];

		bankDataColumns.each(function() {
			if ($(this).attr('checked') !== undefined) {
				checkedBankDateColumnValues.push($(this).val());
        }
		});

		if (checkedBankDateColumnValues.length) {
			getString =
				"bankDataColumn=" + encodeURIComponent(checkedBankDateColumnValues.join(', ')) + '&' + getString;
		} else {
			getString = "bankDataColumn=" + encodeURIComponent('allColumnsUnchecked') + '&' + getString;
		}
    }


    getString = getString.substr(0, getString.length - 1);

    gm_fadein_boxes(box);

    $.ajax(
        {
            type: "POST",
            url: action,
            data: getString,
            timeout: 2000,
            success: function (msg) {
                $("#" + box).html(msg);
            }
        });
}

/*
 * -> click/onChange handler for 'bankDataColumn' checkboxes
 */
function gm_update_bank_data_column(val) {
    const $selectedCheckboxes = $('input[name="bankDataColumn"]:checked');
    if ($selectedCheckboxes.length > 1) {
        $selectedCheckboxes.single_checkbox('checked', false);
        $('input[name="bankDataColumn"][value="' + val + '"]').single_checkbox('checked', true);
    }
}

/*
 * -> update content 'post'
 */
function gm_post_boxes(action, box) {

    // -> show image while loading
    $("#gm_status").html('<img src="../images/loading.gif" class="untouched" WIDTH="16" HEIGHT="16" BORDER="0" ALT="loading">');

    gm_fadein_boxes(box);
    $.post(
        action,
        {
            GM_PDF_HEADING_CONDITIONS: $("#GM_PDF_HEADING_CONDITIONS").val(),
            GM_PDF_HEADING_WITHDRAWAL: $("#GM_PDF_HEADING_WITHDRAWAL").val(),
            GM_PDF_CONDITIONS: $("#GM_PDF_CONDITIONS").val(),
            GM_PDF_WITHDRAWAL: $("#GM_PDF_WITHDRAWAL").val()
        },
        function (data) {
            $("#" + box).html(data);
        }
    );
}

/*
 * -> update color
 */
function gm_update_color(box) {
    $("#" + box + '_PICKER').css(
        {
            "background-color": $("input#" + box).val()
        });
}

/*
 * -> fade out boxes
 */
function gm_fadeout_boxes(box) {
    $("#" + box).fadeOut('normal');
}

/*
 * -> hide boxes
 */
function gm_hide_boxes(box) {
    $("#" + box).hide('fast');
}

/*
 * -> fade in boxes
 */
function gm_fadein_boxes(box) {
    $("#" + box).fadeIn('normal');
}
