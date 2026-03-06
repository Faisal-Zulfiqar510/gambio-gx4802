'use strict';

/* --------------------------------------------------------------
 init_class_fixes.js 2020-10-07
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Initialize Class Fixes
 *
 * This module must set as many compatibility classes as possible. Wherever it is
 * certain that an HTML class will be present it must be automatically set by this
 * module.
 *
 * @module Compatibility/init_class_fixes
 */
gx.compatibility.module('init_class_fixes', ['url_arguments'],

/**  @lends module:Compatibility/init_class_fixes */

function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES DEFINITION
    // ------------------------------------------------------------------------

    var
    /**
     * Module Selector
     *
     * @var {object}
     */
    $this = $(this),


    /**
     * Callbacks for checking common patterns.
     *
     * @var {array}
     */
    fixes = [],


    /**
     * Default Options
     *
     * @type {object}
     */
    defaults = {},


    /**
     * Final Options
     *
     * @var {object}
     */
    options = $.extend(true, {}, defaults, data),


    /**
     * Module Object
     *
     * @type {object}
     */
    module = {};

    // ------------------------------------------------------------------------
    // OPERATIONS
    // ------------------------------------------------------------------------

    /**
     * Add gx-compatibility class to body element.
     */
    fixes.push(function () {
        if (!$('body').hasClass('gx-compatibility')) {
            $('body').addClass('gx-compatibility');
        }
    });

    /**
     * Add the gx-container custom predefined selectors.
     */
    fixes.push(function () {
        // Append the following array with extra custom selectors.
        var customSelectors = ['.dataTableRow', '.dataTableHeadingRow', '.dataTableRowSelected', '.pdf_menu', '#log_content', '.contentTable', '.infoBoxHeading'];

        $.each(customSelectors, function () {
            if (!$(this).hasClass('gx-container')) {
                $(this).addClass('gx-container');
            }
        });
    });

    /**
     * Normalize tables by custom selectors.
     */
    fixes.push(function () {
        // Append the following array with extra custom selectors.
        var normalizeTables = ['#gm_box_content > table', '#gm_box_content > form > table'];

        $.each(normalizeTables, function () {
            if (!$(this).hasClass('normalize-table')) {
                $(this).addClass('normalize-table');
            }
        });
    });

    /**
     * Add extra classes to the table structure of configuration.php pages.
     */
    fixes.push(function () {
        var tablesArray = $('form[name="configuration"]').children();

        // set $saveBtn only if there is exactly one input[type="submit"]-Button
        if ($('input[type="submit"]').length === 1) {
            var $saveBtn = $('input[type="submit"]');
            $saveBtn.removeClass('button');
            if (!$saveBtn.hasClass('btn')) {
                $saveBtn.addClass('btn');
                $saveBtn.addClass('btn-primary');
            }
        }

        $.each(tablesArray, function (index, element) {
            var labelText = $(element).find('.dataTableContent_gm').first().children().first().text(),
                $elementObj = $(element),
                rightDataTableContent = $($elementObj.find('.dataTableContent_gm')[1]);
            $elementObj.find('tr[bgcolor]').removeAttr('bgcolor');
            $elementObj.find('.dataTableContent_gm').first().addClass('configuration-label');
            $elementObj.find('.dataTableContent_gm').first().children().first().replaceWith(labelText);

            rightDataTableContent.find('br').remove();

            $elementObj.addClass('main-table');

            if (index % 2) {
                $elementObj.addClass('even');
            } else {
                $elementObj.addClass('odd');
            }
        });
        $('.error-logging-select').removeClass('pull-left');
    });

    /**
     * Fixes for the orders table.
     *
     * Some columns swapped or hide, classes was added and some elements will be removed.
     */
    fixes.push(function () {
        var $headingBoxContainer = $('.orders_form'),
            $orderInfoBox = $('#gm_orders');

        $.each($headingBoxContainer.children(), function (index, element) {
            $(element).addClass('hidden');
        });

        $orderInfoBox.addClass('hidden');
    });

    /**
     * Fixes for customer overview page.
     */
    fixes.push(function () {
        var $compatibilityTable = $('.gx-compatibility-table.gx-customer-overview'),
            $pagerRow = $compatibilityTable.find('tr').last();

        $('.info-box').addClass('hidden');
        $('.customer-sort-links').addClass('hidden');
        $pagerRow.find('td').first().parent().parent().parent().appendTo($compatibilityTable.parent());
        $compatibilityTable.find('.arrow-icon').addClass('hidden');
        $compatibilityTable.find('tr').last().remove();

        // Delete guest accounts
        $('#delete-guest-accounts').on('click', function () {
            // Create confirmation dialog
            var $confirmation = $('<div>');
            var $content = $('<span>');
            var totalGuestAccounts;
            var remainingGuestAccounts = totalGuestAccounts = parseInt($('#delete-guest-accounts').attr('data-guest-account-count'));
            var phrase = jse.core.lang.translate('CONFIRM_DELETE_GUEST_ACCOUNTS', 'admin_customers').replace(/%s/, totalGuestAccounts);
            var setRemainingGuestAccounts = function setRemainingGuestAccounts(remaining) {

                var deleted = totalGuestAccounts - remaining;
                var percentage = remaining === 0 ? 1 : deleted / totalGuestAccounts;
                var $progress = $('#progress-bar-delete-guests');

                percentage *= 100;

                $progress.attr('aria-valuenow', percentage);
                $progress.attr('style', "width: " + percentage + '%;min-width: 70px');
                $progress.html(deleted + ' / ' + totalGuestAccounts);
            };
            var redirectToCustomersPage = function redirectToCustomersPage() {
                var t_url = window.location.href;
                if (window.location.search.search('cID=') !== -1) {
                    t_url = window.location.href.replace(/[&]?cID=[\d]+/g, '');
                }

                window.location.href = t_url;
            };

            $content.html(phrase + '<br /><br />' + '<div id="progress-bar-delete-guests" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 50px; width: 0;display:none;">0 / ' + totalGuestAccounts + '</div>');

            $confirmation.appendTo('body').append($content).addClass('gx-container').dialog({
                'title': jse.core.lang.translate('BUTTON_DELETE_GUEST_ACCOUNTS', 'admin_customers'),
                'modal': true,
                'dialogClass': 'gx-container',
                'buttons': [{
                    'text': jse.core.lang.translate('close', 'buttons'),
                    'class': 'btn',
                    'click': function click() {
                        $(this).dialog('close');
                    }
                }, {
                    'text': jse.core.lang.translate('delete', 'buttons'),
                    'class': 'btn-primary',
                    'click': async function click() {
                        while (remainingGuestAccounts > 0) {
                            await $.ajax({
                                url: [window.location.origin + window.location.pathname.replace('customers.php', ''), 'request_port.php', '?module=DeleteGuestAccounts', '&token=' + $('#delete-guest-accounts').data('token')].join(''),
                                type: 'GET',
                                dataType: 'json',
                                data: ''
                            });

                            remainingGuestAccounts -= 200;

                            if (remainingGuestAccounts <= 0) {

                                remainingGuestAccounts = 0;
                                setTimeout(redirectToCustomersPage, 1250);
                            }

                            setRemainingGuestAccounts(remainingGuestAccounts);
                        }
                    }
                }],
                'width': 420,
                'closeOnEscape': false,
                'open': function open() {
                    $('.ui-dialog-titlebar-close').hide();
                }
            });
        });
    });

    /**
     * Class fixes for the products and categories overview page.
     */
    fixes.push(function () {
        var $infoBox = $('.gx-categories').find('.info-box'),
            $sortBarRow = $('.dataTableHeadingRow_sortbar'),
            $createNewContainer = $('.create-new-container'),
            pageHeadingElementsArray = $('.pageSubHeading').children(),
            tableCellArray = $('.categories_view_data'),
            $pagerContainer = $('.articles-pager');
        $infoBox.addClass('hidden');
        $sortBarRow.addClass('hidden');
        $.each(tableCellArray, function (index, element) {
            // Replace double '-' with single one.
            var cellObj = $(element);
            if (cellObj.text() === '--') {
                cellObj.text('-');
            }
        });
        $.each(pageHeadingElementsArray, function (index, element) {
            // Page heading actions.
            $(element).addClass('hidden');
        });
        $createNewContainer.removeClass('hidden');

        $.each($pagerContainer.find('.button'), function (index, element) {
            var elementObj = $(element);
            elementObj.addClass('hidden');
            elementObj.removeClass('button');
        });
    });

    /**
     * Add Pagination styles
     */
    fixes.push(function () {
        // Define pagination area where all the pagination stuff is
        var $paginationArea = $this.find('.pagination-control').parents('table:first');

        // Add compatibility classes
        $paginationArea.addClass('gx-container paginator');
    });

    /**
     * Add extra classes to the table structure of configuration.php pages.
     */
    fixes.push(function () {
        var tablesArray = $('form[name="configuration"]').children();
        $.each(tablesArray, function (index, element) {
            var labelText = $(element).find('.dataTableContent_gm').first().children().first().text(),
                $elementObj = $(element),
                rightDataTableContent = $($elementObj.find('.dataTableContent_gm')[1]);
            $elementObj.find('tr[bgcolor]').removeAttr('bgcolor');
            $elementObj.find('.dataTableContent_gm').first().addClass('configuration-label');
            $elementObj.find('.dataTableContent_gm').first().children().first().replaceWith(labelText);

            rightDataTableContent.find('br').remove();

            $elementObj.addClass('main-table');

            if (index % 2) {
                $elementObj.addClass('even');
            } else {
                $elementObj.addClass('odd');
            }
        });
        $('.error-logging-select').removeClass('pull-left');
    });

    /**
     * Change class of all buttons from "button" and "admin_button_green" to "btn"
     */
    fixes.push(function () {
        var selectors = ['.button', '.admin_button_green'];

        $.each(selectors, function () {
            $(this).each(function () {
                if (!$(this).hasClass('btn')) {
                    $(this).addClass('btn');
                }

                $(this).removeClass('button');
                $(this).removeClass('admin_button_green');
            });
        });
    });

    /**
     * Remove img in anchor tags with class btn
     */
    fixes.push(function () {
        $('a.btn').each(function (index, element) {
            if ($(element).find('img').length) {
                $(element).find('img').remove();
            }
        });
    });

    /**
     * Hides an empty container, that takes up space
     */
    fixes.push(function () {
        if (!$('div.orders_form :visible').text().trim().length) {
            $('div.orders_form').parents('table:first').removeProp('cellpadding');
            $('div.orders_form').parents('tr:first').find('br').remove();
            $('div.orders_form').parents('td:first').css('padding', '0');
        }
    });

    /**
     *
     */
    fixes.push(function () {
        $('table.paginator').removeProp('cellspacing').removeProp('cellpadding');
    });

    /**
     * Add extra class for the modal box when a customer group should edit.
     */
    fixes.push(function () {
        var urlHelper = jse.libs.url_arguments,
            // alias
        $form = $('form[name="customers"]');

        if (urlHelper.getCurrentFile() === 'customers.php' && urlHelper.getUrlParameters().action === 'editstatus') {
            $form.find('table').addClass('edit-customer-group-table').attr('cellpadding', '0');
        }
    });

    /**
     * Fix the warning icon element in case a checkbox is next to it
     */
    fixes.push(function () {
        var warningIcon = $('.tooltip_icon.warning');
        if ($(warningIcon).parent().parent().prev('.checkbox-switch-wrapper').length) {
            warningIcon.css('margin-left', '12px');
        }
    });

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Execute the registered fixes.
        $.each(fixes, function () {
            this();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXRfY2xhc3NfZml4ZXMuanMiXSwibmFtZXMiOlsiZ3giLCJjb21wYXRpYmlsaXR5IiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImZpeGVzIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwicHVzaCIsImhhc0NsYXNzIiwiYWRkQ2xhc3MiLCJjdXN0b21TZWxlY3RvcnMiLCJlYWNoIiwibm9ybWFsaXplVGFibGVzIiwidGFibGVzQXJyYXkiLCJjaGlsZHJlbiIsImxlbmd0aCIsIiRzYXZlQnRuIiwicmVtb3ZlQ2xhc3MiLCJpbmRleCIsImVsZW1lbnQiLCJsYWJlbFRleHQiLCJmaW5kIiwiZmlyc3QiLCJ0ZXh0IiwiJGVsZW1lbnRPYmoiLCJyaWdodERhdGFUYWJsZUNvbnRlbnQiLCJyZW1vdmVBdHRyIiwicmVwbGFjZVdpdGgiLCJyZW1vdmUiLCIkaGVhZGluZ0JveENvbnRhaW5lciIsIiRvcmRlckluZm9Cb3giLCIkY29tcGF0aWJpbGl0eVRhYmxlIiwiJHBhZ2VyUm93IiwibGFzdCIsInBhcmVudCIsImFwcGVuZFRvIiwib24iLCIkY29uZmlybWF0aW9uIiwiJGNvbnRlbnQiLCJ0b3RhbEd1ZXN0QWNjb3VudHMiLCJyZW1haW5pbmdHdWVzdEFjY291bnRzIiwicGFyc2VJbnQiLCJhdHRyIiwicGhyYXNlIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJyZXBsYWNlIiwic2V0UmVtYWluaW5nR3Vlc3RBY2NvdW50cyIsInJlbWFpbmluZyIsImRlbGV0ZWQiLCJwZXJjZW50YWdlIiwiJHByb2dyZXNzIiwiaHRtbCIsInJlZGlyZWN0VG9DdXN0b21lcnNQYWdlIiwidF91cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJzZWFyY2giLCJhcHBlbmQiLCJkaWFsb2ciLCJhamF4IiwidXJsIiwib3JpZ2luIiwicGF0aG5hbWUiLCJqb2luIiwidHlwZSIsImRhdGFUeXBlIiwic2V0VGltZW91dCIsImhpZGUiLCIkaW5mb0JveCIsIiRzb3J0QmFyUm93IiwiJGNyZWF0ZU5ld0NvbnRhaW5lciIsInBhZ2VIZWFkaW5nRWxlbWVudHNBcnJheSIsInRhYmxlQ2VsbEFycmF5IiwiJHBhZ2VyQ29udGFpbmVyIiwiY2VsbE9iaiIsImVsZW1lbnRPYmoiLCIkcGFnaW5hdGlvbkFyZWEiLCJwYXJlbnRzIiwic2VsZWN0b3JzIiwidHJpbSIsInJlbW92ZVByb3AiLCJjc3MiLCJ1cmxIZWxwZXIiLCJsaWJzIiwidXJsX2FyZ3VtZW50cyIsIiRmb3JtIiwiZ2V0Q3VycmVudEZpbGUiLCJnZXRVcmxQYXJhbWV0ZXJzIiwiYWN0aW9uIiwid2FybmluZ0ljb24iLCJwcmV2IiwiaW5pdCIsImRvbmUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7O0FBU0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksa0JBREosRUFHSSxDQUFDLGVBQUQsQ0FISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLFlBQVEsRUFiWjs7O0FBZUk7Ozs7O0FBS0FDLGVBQVcsRUFwQmY7OztBQXNCSTs7Ozs7QUFLQUMsY0FBVUgsRUFBRUksTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CRixRQUFuQixFQUE2QkosSUFBN0IsQ0EzQmQ7OztBQTZCSTs7Ozs7QUFLQUQsYUFBUyxFQWxDYjs7QUFvQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQUksVUFBTUksSUFBTixDQUFXLFlBQVk7QUFDbkIsWUFBSSxDQUFDTCxFQUFFLE1BQUYsRUFBVU0sUUFBVixDQUFtQixrQkFBbkIsQ0FBTCxFQUE2QztBQUN6Q04sY0FBRSxNQUFGLEVBQVVPLFFBQVYsQ0FBbUIsa0JBQW5CO0FBQ0g7QUFDSixLQUpEOztBQU1BOzs7QUFHQU4sVUFBTUksSUFBTixDQUFXLFlBQVk7QUFDbkI7QUFDQSxZ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QUFqQyxDQUFzQywwQkFBdEMsRUFBa0UvRSxNQUF0RSxFQUE4RTtBQUMxRThFLHdCQUFZUixHQUFaLENBQWdCLGFBQWhCLEVBQStCLE1BQS9CO0FBQ0g7QUFDSixLQUxEOztBQU9BO0FBQ0E7QUFDQTs7QUFFQXRGLFdBQU9nRyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjtBQUNBOUYsVUFBRVMsSUFBRixDQUFPUixLQUFQLEVBQWMsWUFBWTtBQUN0QjtBQUNILFNBRkQ7O0FBSUE2RjtBQUNILEtBUEQ7O0FBU0EsV0FBT2pHLE1BQVA7QUFDSCxDQWphTCIsImZpbGUiOiJpbml0X2NsYXNzX2ZpeGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBpbml0X2NsYXNzX2ZpeGVzLmpzIDIwMjAtMTAtMDdcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEluaXRpYWxpemUgQ2xhc3MgRml4ZXNcbiAqXG4gKiBUaGlzIG1vZHVsZSBtdXN0IHNldCBhcyBtYW55IGNvbXBhdGliaWxpdHkgY2xhc3NlcyBhcyBwb3NzaWJsZS4gV2hlcmV2ZXIgaXQgaXNcbiAqIGNlcnRhaW4gdGhhdCBhbiBIVE1MIGNsYXNzIHdpbGwgYmUgcHJlc2VudCBpdCBtdXN0IGJlIGF1dG9tYXRpY2FsbHkgc2V0IGJ5IHRoaXNcbiAqIG1vZHVsZS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvaW5pdF9jbGFzc19maXhlc1xuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnaW5pdF9jbGFzc19maXhlcycsXG5cbiAgICBbJ3VybF9hcmd1bWVudHMnXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L2luaXRfY2xhc3NfZml4ZXMgKi9cblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXJcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ2FsbGJhY2tzIGZvciBjaGVja2luZyBjb21tb24gcGF0dGVybnMuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7YXJyYXl9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZpeGVzID0gW10sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIE9QRVJBVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBneC1jb21wYXRpYmlsaXR5IGNsYXNzIHRvIGJvZHkgZWxlbWVudC5cbiAgICAgICAgICovXG4gICAgICAgIGZpeGVzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCEkKCdib2R5JykuaGFzQ2xhc3MoJ2d4LWNvbXBhdGliaWxpdHknKSkge1xuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygnZ3gtY29tcGF0aWJpbGl0eScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIHRoZSBneC1jb250YWluZXIgY3VzdG9tIHByZWRlZmluZWQgc2VsZWN0b3JzLlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBBcHBlbmQgdGhlIGZvbGxvd2luZyBhcnJheSB3aXRoIGV4dHJhIGN1c3RvbSBzZWxlY3RvcnMuXG4gICAgICAgICAgICB2YXIgY3VzdG9tU2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgICAgICcuZGF0YVRhYmxlUm93JyxcbiAgICAgICAgICAgICAgICAnLmRhdGFUYWJsZUhlYWRpbmdSb3cnLFxuICAgICAgICAgICAgICAgICcuZGF0YVRhYmxlUm93U2VsZWN0ZWQnLFxuICAgICAgICAgICAgICAgICcucGRmX21lbnUnLFxuICAgICAgICAgICAgICAgICcjbG9nX2NvbnRlbnQnLFxuICAgICAgICAgICAgICAgICcuY29udGVudFRhYmxlJyxcbiAgICAgICAgICAgICAgICAnLmluZm9Cb3hIZWFkaW5nJ1xuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgJC5lYWNoKGN1c3RvbVNlbGVjdG9ycywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnZ3gtY29udGFpbmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnZ3gtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBOb3JtYWxpemUgdGFibGVzIGJ5IGN1c3RvbSBzZWxlY3RvcnMuXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgZm9sbG93aW5nIGFycmF5IHdpdGggZXh0cmEgY3VzdG9tIHNlbGVjdG9ycy5cbiAgICAgICAgICAgIHZhciBub3JtYWxpemVUYWJsZXMgPSBbXG4gICAgICAgICAgICAgICAgJyNnbV9ib3hfY29udGVudCA+IHRhYmxlJyxcbiAgICAgICAgICAgICAgICAnI2dtX2JveF9jb250ZW50ID4gZm9ybSA+IHRhYmxlJ1xuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgJC5lYWNoKG5vcm1hbGl6ZVRhYmxlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcygnbm9ybWFsaXplLXRhYmxlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnbm9ybWFsaXplLXRhYmxlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgZXh0cmEgY2xhc3NlcyB0byB0aGUgdGFibGUgc3RydWN0dXJlIG9mIGNvbmZpZ3VyYXRpb24ucGhwIHBhZ2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdGFibGVzQXJyYXkgPSAkKCdmb3JtW25hbWU9XCJjb25maWd1cmF0aW9uXCJdJykuY2hpbGRyZW4oKTtcblxuICAgICAgICAgICAgLy8gc2V0ICRzYXZlQnRuIG9ubHkgaWYgdGhlcmUgaXMgZXhhY3RseSBvbmUgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXS1CdXR0b25cbiAgICAgICAgICAgIGlmICgkKCdpbnB1dFt0eXBlPVwic3VibWl0XCJdJykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdmFyICRzYXZlQnRuID0gJCgnaW5wdXRbdHlwZT1cInN1Ym1pdFwiXScpO1xuICAgICAgICAgICAgICAgICRzYXZlQnRuLnJlbW92ZUNsYXNzKCdidXR0b24nKTtcbiAgICAgICAgICAgICAgICBpZiAoISRzYXZlQnRuLmhhc0NsYXNzKCdidG4nKSkge1xuICAgICAgICAgICAgICAgICAgICAkc2F2ZUJ0bi5hZGRDbGFzcygnYnRuJyk7XG4gICAgICAgICAgICAgICAgICAgICRzYXZlQnRuLmFkZENsYXNzKCdidG4tcHJpbWFyeScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5lYWNoKHRhYmxlc0FycmF5LCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGFiZWxUZXh0ID0gJChlbGVtZW50KS5maW5kKCcuZGF0YVRhYmxlQ29udGVudF9nbScpLmZpcnN0KCkuY2hpbGRyZW4oKS5maXJzdCgpLnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnRPYmogPSAkKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgICAgICByaWdodERhdGFUYWJsZUNvbnRlbnQgPSAkKCRlbGVtZW50T2JqLmZpbmQoJy5kYXRhVGFibGVDb250ZW50X2dtJylbMV0pO1xuICAgICAgICAgICAgICAgICRlbGVtZW50T2JqLmZpbmQoJ3RyW2JnY29sb3JdJykucmVtb3ZlQXR0cignYmdjb2xvcicpO1xuICAgICAgICAgICAgICAgICRlbGVtZW50T2JqLmZpbmQoJy5kYXRhVGFibGVDb250ZW50X2dtJykuZmlyc3QoKS5hZGRDbGFzcygnY29uZmlndXJhdGlvbi1sYWJlbCcpO1xuICAgICAgICAgICAgICAgICRlbGVtZW50T2JqLmZpbmQoJy5kYXRhVGFibGVDb250ZW50X2dtJykuZmlyc3QoKS5jaGlsZHJlbigpLmZpcnN0KCkucmVwbGFjZVdpdGgobGFiZWxUZXh0KTtcblxuICAgICAgICAgICAgICAgIHJpZ2h0RGF0YVRhYmxlQ29udGVudC5maW5kKCdicicpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgJGVsZW1lbnRPYmouYWRkQ2xhc3MoJ21haW4tdGFibGUnKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAlIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnRPYmouYWRkQ2xhc3MoJ2V2ZW4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudE9iai5hZGRDbGFzcygnb2RkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuZXJyb3ItbG9nZ2luZy1zZWxlY3QnKS5yZW1vdmVDbGFzcygncHVsbC1sZWZ0Jyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXhlcyBmb3IgdGhlIG9yZGVycyB0YWJsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogU29tZSBjb2x1bW5zIHN3YXBwZWQgb3IgaGlkZSwgY2xhc3NlcyB3YXMgYWRkZWQgYW5kIHNvbWUgZWxlbWVudHMgd2lsbCBiZSByZW1vdmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGhlYWRpbmdCb3hDb250YWluZXIgPSAkKCcub3JkZXJzX2Zvcm0nKSxcbiAgICAgICAgICAgICAgICAkb3JkZXJJbmZvQm94ID0gJCgnI2dtX29yZGVycycpO1xuXG4gICAgICAgICAgICAkLmVhY2goJGhlYWRpbmdCb3hDb250YWluZXIuY2hpbGRyZW4oKSwgZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJG9yZGVySW5mb0JveC5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXhlcyBmb3IgY3VzdG9tZXIgb3ZlcnZpZXcgcGFnZS5cbiAgICAgICAgICovXG4gICAgICAgIGZpeGVzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRjb21wYXRpYmlsaXR5VGFibGUgPSAkKCcuZ3gtY29tcGF0aWJpbGl0eS10YWJsZS5neC1jdXN0b21lci1vdmVydmlldycpLFxuICAgICAgICAgICAgICAgICRwYWdlclJvdyA9ICRjb21wYXRpYmlsaXR5VGFibGUuZmluZCgndHInKS5sYXN0KCk7XG5cbiAgICAgICAgICAgICQoJy5pbmZvLWJveCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICQoJy5jdXN0b21lci1zb3J0LWxpbmtzJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHBhZ2VyUm93LmZpbmQoJ3RkJykuZmlyc3QoKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5hcHBlbmRUbygkY29tcGF0aWJpbGl0eVRhYmxlLnBhcmVudCgpKTtcbiAgICAgICAgICAgICRjb21wYXRpYmlsaXR5VGFibGUuZmluZCgnLmFycm93LWljb24nKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkY29tcGF0aWJpbGl0eVRhYmxlLmZpbmQoJ3RyJykubGFzdCgpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAvLyBEZWxldGUgZ3Vlc3QgYWNjb3VudHNcbiAgICAgICAgICAgICQoJyNkZWxldGUtZ3Vlc3QtYWNjb3VudHMnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGNvbmZpcm1hdGlvbiBkaWFsb2dcbiAgICAgICAgICAgICAgICB2YXIgJGNvbmZpcm1hdGlvbiA9ICQoJzxkaXY+Jyk7XG4gICAgICAgICAgICAgICAgdmFyICRjb250ZW50ID0gJCgnPHNwYW4+Jyk7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsR3Vlc3RBY2NvdW50cztcbiAgICAgICAgICAgICAgICB2YXIgcmVtYWluaW5nR3Vlc3RBY2NvdW50cyA9IHRvdGFsR3Vlc3RBY2NvdW50cyA9IHBhcnNlSW50KCQoJyNkZWxldGUtZ3Vlc3QtYWNjb3VudHMnKS5hdHRyKCdkYXRhLWd1ZXN0LWFjY291bnQtY291bnQnKSk7XG4gICAgICAgICAgICAgICAgdmFyIHBocmFzZSA9IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdDT05GSVJNX0RFTEVURV9HVUVTVF9BQ0NPVU5UUycsICdhZG1pbl9jdXN0b21lcnMnKS5yZXBsYWNlKC8lcy8sIHRvdGFsR3Vlc3RBY2NvdW50cyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0UmVtYWluaW5nR3Vlc3RBY2NvdW50cyA9IGZ1bmN0aW9uIChyZW1haW5pbmcpIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciBkZWxldGVkID0gdG90YWxHdWVzdEFjY291bnRzIC0gcmVtYWluaW5nO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcGVyY2VudGFnZSA9IHJlbWFpbmluZyA9PT0gMCA/IDEgOiAoZGVsZXRlZCAvIHRvdGFsR3Vlc3RBY2NvdW50cyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkcHJvZ3Jlc3MgPSAkKCcjcHJvZ3Jlc3MtYmFyLWRlbGV0ZS1ndWVzdHMnKTtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudGFnZSAqPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkcHJvZ3Jlc3MuYXR0cignYXJpYS12YWx1ZW5vdycsIHBlcmNlbnRhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAkcHJvZ3Jlc3MuYXR0cignc3R5bGUnLCBcIndpZHRoOiBcIiArIHBlcmNlbnRhZ2UgKyAnJTttaW4td2lkdGg6IDcwcHgnKTtcbiAgICAgICAgICAgICAgICAgICAgJHByb2dyZXNzLmh0bWwoZGVsZXRlZCArICcgLyAnICsgdG90YWxHdWVzdEFjY291bnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZGlyZWN0VG9DdXN0b21lcnNQYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0X3VybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLnNlYXJjaC5zZWFyY2goJ2NJRD0nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRfdXJsID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi5yZXBsYWNlKC9bJl0/Y0lEPVtcXGRdKy9nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB0X3VybDtcbiAgICAgICAgICAgICAgICB9O1xuICAgIFxuICAgICAgICAgICAgICAgICRjb250ZW50Lmh0bWwocGhyYXNlICsgJzxiciAvPjxiciAvPicgKyAnPGRpdiBpZD1cInByb2dyZXNzLWJhci1kZWxldGUtZ3Vlc3RzXCIgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwibWluLXdpZHRoOiA1MHB4OyB3aWR0aDogMDtkaXNwbGF5Om5vbmU7XCI+MCAvICcrIHRvdGFsR3Vlc3RBY2NvdW50cyArICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgICAgICRjb25maXJtYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCdib2R5JylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdneC1jb250YWluZXInKVxuICAgICAgICAgICAgICAgICAgICAuZGlhbG9nKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fREVMRVRFX0dVRVNUX0FDQ09VTlRTJywgJ2FkbWluX2N1c3RvbWVycycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbnMnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjbG9zZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdkZWxldGUnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAocmVtYWluaW5nR3Vlc3RBY2NvdW50cyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgnY3VzdG9tZXJzLnBocCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAncmVxdWVzdF9wb3J0LnBocCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnP21vZHVsZT1EZWxldGVHdWVzdEFjY291bnRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmdG9rZW49JyArICQoJyNkZWxldGUtZ3Vlc3QtYWNjb3VudHMnKS5kYXRhKCd0b2tlbicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nR3Vlc3RBY2NvdW50cyAtPSAyMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZ0d1ZXN0QWNjb3VudHMgPD0gMCkge1xuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1haW5pbmdHdWVzdEFjY291bnRzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChyZWRpcmVjdFRvQ3VzdG9tZXJzUGFnZSwgMTI1MCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFJlbWFpbmluZ0d1ZXN0QWNjb3VudHMocmVtYWluaW5nR3Vlc3RBY2NvdW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogNDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2Nsb3NlT25Fc2NhcGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvcGVuJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy51aS1kaWFsb2ctdGl0bGViYXItY2xvc2UnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGFzcyBmaXhlcyBmb3IgdGhlIHByb2R1Y3RzIGFuZCBjYXRlZ29yaWVzIG92ZXJ2aWV3IHBhZ2UuXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkaW5mb0JveCA9ICQoJy5neC1jYXRlZ29yaWVzJykuZmluZCgnLmluZm8tYm94JyksXG4gICAgICAgICAgICAgICAgJHNvcnRCYXJSb3cgPSAkKCcuZGF0YVRhYmxlSGVhZGluZ1Jvd19zb3J0YmFyJyksXG4gICAgICAgICAgICAgICAgJGNyZWF0ZU5ld0NvbnRhaW5lciA9ICQoJy5jcmVhdGUtbmV3LWNvbnRhaW5lcicpLFxuICAgICAgICAgICAgICAgIHBhZ2VIZWFkaW5nRWxlbWVudHNBcnJheSA9ICQoJy5wYWdlU3ViSGVhZGluZycpLmNoaWxkcmVuKCksXG4gICAgICAgICAgICAgICAgdGFibGVDZWxsQXJyYXkgPSAkKCcuY2F0ZWdvcmllc192aWV3X2RhdGEnKSxcbiAgICAgICAgICAgICAgICAkcGFnZXJDb250YWluZXIgPSAkKCcuYXJ0aWNsZXMtcGFnZXInKTtcbiAgICAgICAgICAgICRpbmZvQm94LmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICRzb3J0QmFyUm93LmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICQuZWFjaCh0YWJsZUNlbGxBcnJheSwgZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7IC8vIFJlcGxhY2UgZG91YmxlICctJyB3aXRoIHNpbmdsZSBvbmUuXG4gICAgICAgICAgICAgICAgdmFyIGNlbGxPYmogPSAkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChjZWxsT2JqLnRleHQoKSA9PT0gJy0tJykge1xuICAgICAgICAgICAgICAgICAgICBjZWxsT2JqLnRleHQoJy0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQuZWFjaChwYWdlSGVhZGluZ0VsZW1lbnRzQXJyYXksIGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkgeyAvLyBQYWdlIGhlYWRpbmcgYWN0aW9ucy5cbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJGNyZWF0ZU5ld0NvbnRhaW5lci5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG5cbiAgICAgICAgICAgICQuZWFjaCgkcGFnZXJDb250YWluZXIuZmluZCgnLmJ1dHRvbicpLCBmdW5jdGlvbiAoaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudE9iaiA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudE9iai5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudE9iai5yZW1vdmVDbGFzcygnYnV0dG9uJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBQYWdpbmF0aW9uIHN0eWxlc1xuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBEZWZpbmUgcGFnaW5hdGlvbiBhcmVhIHdoZXJlIGFsbCB0aGUgcGFnaW5hdGlvbiBzdHVmZiBpc1xuICAgICAgICAgICAgdmFyICRwYWdpbmF0aW9uQXJlYSA9ICR0aGlzXG4gICAgICAgICAgICAgICAgLmZpbmQoJy5wYWdpbmF0aW9uLWNvbnRyb2wnKVxuICAgICAgICAgICAgICAgIC5wYXJlbnRzKCd0YWJsZTpmaXJzdCcpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY29tcGF0aWJpbGl0eSBjbGFzc2VzXG4gICAgICAgICAgICAkcGFnaW5hdGlvbkFyZWEuYWRkQ2xhc3MoJ2d4LWNvbnRhaW5lciBwYWdpbmF0b3InKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIGV4dHJhIGNsYXNzZXMgdG8gdGhlIHRhYmxlIHN0cnVjdHVyZSBvZiBjb25maWd1cmF0aW9uLnBocCBwYWdlcy5cbiAgICAgICAgICovXG4gICAgICAgIGZpeGVzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRhYmxlc0FycmF5ID0gJCgnZm9ybVtuYW1lPVwiY29uZmlndXJhdGlvblwiXScpLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICAkLmVhY2godGFibGVzQXJyYXksIGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciBsYWJlbFRleHQgPSAkKGVsZW1lbnQpLmZpbmQoJy5kYXRhVGFibGVDb250ZW50X2dtJykuZmlyc3QoKS5jaGlsZHJlbigpLmZpcnN0KCkudGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudE9iaiA9ICQoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0RGF0YVRhYmxlQ29udGVudCA9ICQoJGVsZW1lbnRPYmouZmluZCgnLmRhdGFUYWJsZUNvbnRlbnRfZ20nKVsxXSk7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnRPYmouZmluZCgndHJbYmdjb2xvcl0nKS5yZW1vdmVBdHRyKCdiZ2NvbG9yJyk7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnRPYmouZmluZCgnLmRhdGFUYWJsZUNvbnRlbnRfZ20nKS5maXJzdCgpLmFkZENsYXNzKCdjb25maWd1cmF0aW9uLWxhYmVsJyk7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnRPYmouZmluZCgnLmRhdGFUYWJsZUNvbnRlbnRfZ20nKS5maXJzdCgpLmNoaWxkcmVuKCkuZmlyc3QoKS5yZXBsYWNlV2l0aChsYWJlbFRleHQpO1xuXG4gICAgICAgICAgICAgICAgcmlnaHREYXRhVGFibGVDb250ZW50LmZpbmQoJ2JyJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkZWxlbWVudE9iai5hZGRDbGFzcygnbWFpbi10YWJsZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICUgMikge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbWVudE9iai5hZGRDbGFzcygnZXZlbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50T2JqLmFkZENsYXNzKCdvZGQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5lcnJvci1sb2dnaW5nLXNlbGVjdCcpLnJlbW92ZUNsYXNzKCdwdWxsLWxlZnQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYW5nZSBjbGFzcyBvZiBhbGwgYnV0dG9ucyBmcm9tIFwiYnV0dG9uXCIgYW5kIFwiYWRtaW5fYnV0dG9uX2dyZWVuXCIgdG8gXCJidG5cIlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgICAgICcuYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAnLmFkbWluX2J1dHRvbl9ncmVlbidcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgICQuZWFjaChzZWxlY3RvcnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2J0bicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdidG4nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2J1dHRvbicpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhZG1pbl9idXR0b25fZ3JlZW4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGltZyBpbiBhbmNob3IgdGFncyB3aXRoIGNsYXNzIGJ0blxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCdhLmJ0bicpLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZWxlbWVudCkuZmluZCgnaW1nJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdpbWcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGlkZXMgYW4gZW1wdHkgY29udGFpbmVyLCB0aGF0IHRha2VzIHVwIHNwYWNlXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghJCgnZGl2Lm9yZGVyc19mb3JtIDp2aXNpYmxlJykudGV4dCgpLnRyaW0oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCdkaXYub3JkZXJzX2Zvcm0nKS5wYXJlbnRzKCd0YWJsZTpmaXJzdCcpLnJlbW92ZVByb3AoJ2NlbGxwYWRkaW5nJyk7XG4gICAgICAgICAgICAgICAgJCgnZGl2Lm9yZGVyc19mb3JtJykucGFyZW50cygndHI6Zmlyc3QnKS5maW5kKCdicicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICQoJ2Rpdi5vcmRlcnNfZm9ybScpLnBhcmVudHMoJ3RkOmZpcnN0JykuY3NzKCdwYWRkaW5nJywgJzAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJ3RhYmxlLnBhZ2luYXRvcicpLnJlbW92ZVByb3AoJ2NlbGxzcGFjaW5nJykucmVtb3ZlUHJvcCgnY2VsbHBhZGRpbmcnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBleHRyYSBjbGFzcyBmb3IgdGhlIG1vZGFsIGJveCB3aGVuIGEgY3VzdG9tZXIgZ3JvdXAgc2hvdWxkIGVkaXQuXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmxIZWxwZXIgPSBqc2UubGlicy51cmxfYXJndW1lbnRzLCAvLyBhbGlhc1xuICAgICAgICAgICAgICAgICRmb3JtID0gJCgnZm9ybVtuYW1lPVwiY3VzdG9tZXJzXCJdJyk7XG5cbiAgICAgICAgICAgIGlmICh1cmxIZWxwZXIuZ2V0Q3VycmVudEZpbGUoKSA9PT0gJ2N1c3RvbWVycy5waHAnICYmIHVybEhlbHBlci5nZXRVcmxQYXJhbWV0ZXJzKCkuYWN0aW9uID09PVxuICAgICAgICAgICAgICAgICdlZGl0c3RhdHVzJykge1xuICAgICAgICAgICAgICAgICRmb3JtLmZpbmQoJ3RhYmxlJykuYWRkQ2xhc3MoJ2VkaXQtY3VzdG9tZXItZ3JvdXAtdGFibGUnKS5hdHRyKCdjZWxscGFkZGluZycsICcwJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXggdGhlIHdhcm5pbmcgaWNvbiBlbGVtZW50IGluIGNhc2UgYSBjaGVja2JveCBpcyBuZXh0IHRvIGl0XG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB3YXJuaW5nSWNvbiA9ICQoJy50b29sdGlwX2ljb24ud2FybmluZycpO1xuICAgICAgICAgICAgaWYgKCQod2FybmluZ0ljb24pLnBhcmVudCgpLnBhcmVudCgpLnByZXYoJy5jaGVja2JveC1zd2l0Y2gtd3JhcHBlcicpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdhcm5pbmdJY29uLmNzcygnbWFyZ2luLWxlZnQnLCAnMTJweCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gRXhlY3V0ZSB0aGUgcmVnaXN0ZXJlZCBmaXhlcy5cbiAgICAgICAgICAgICQuZWFjaChmaXhlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
