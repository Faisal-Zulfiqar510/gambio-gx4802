'use strict';

/* --------------------------------------------------------------
 init_html_fixes.js 2016-02-10
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Admin HTML Fixes
 *
 * This module will be executed in page load and will perform minor HTML fixes for each pages
 * so that they don't have to be performed manually. Apply this module to the page wrapper element.
 *
 * @module Compatibility/init_html_fixes
 */
gx.compatibility.module('init_html_fixes', ['url_arguments'],

/**  @lends module:Compatibility/init_html_fixes */

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
     * Array of callbacks.
     *
     * @type {array}
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
    // HTML FIXES
    // ------------------------------------------------------------------------

    /**
     * Wrap main page content into container.
     */
    fixes.push(function () {
        $('.pageHeading').eq(1).removeClass('pageHeading');
        $('.boxCenter:not(.no-wrap)').wrapInner('<div class="boxCenterWrapper"></div>');
        $('.pageHeading:first-child').prependTo('.boxCenter');
        $('.pageHeading').css('float', 'none');

        var $firstChild = $($('.boxCenterWrapper').children()[0]);

        if ($firstChild.is('br')) {
            $firstChild.remove();
        }

        if ($('div.gx-configuration-box').length) {
            $('.boxCenterWrapper').wrap('<div class="boxCenterAndConfigurationWrapper" style="overflow: auto"></div>');
            $('.boxCenterAndConfigurationWrapper').append($('div.gx-configuration-box'));
        }
    });

    /**
     * Remove unnecessary <br> tag after page wrapper element.
     */
    fixes.push(function () {
        var $nextElement = $this.next(),
            tagName = $nextElement.prop('tagName');

        if (tagName === 'BR') {
            $nextElement.remove();
        }
    });

    /**
     * Ensure that the left menu parent has the columnLeft2 class because there
     * are some pages where this class is not defined and it will lead to styling issues.
     */
    fixes.push(function () {
        var $columnLeft2 = $('.main-left-menu').parent('td');
        if (!$columnLeft2.hasClass('columnLeft2')) {
            $columnLeft2.addClass('columnLeft2');
        }
    });

    /**
     * Remove width attribute from ".columnLeft2" element.
     */
    fixes.push(function () {
        $('.columnLeft2').removeAttr('width');
    });

    /**
     * Move message stack container to correct place.
     */
    fixes.push(function () {
        var $messageStackContainer = $('.message_stack_container'),
            $message = $messageStackContainer.find('.alert'),
            $createNewWrapper = $('.create-new-wrapper');

        if ($('.boxCenterWrapper').length > 0) {
            $messageStackContainer.prependTo('.boxCenterWrapper').show();
        } else {
            $messageStackContainer.prependTo('.order-edit-content').show();
            $messageStackContainer.prependTo('.dashboard-content').show();
        }

        /**
         * Fix if there are more than one message stack container classes.
         * This fix only work, if there are two containers.
         * Improve it if you recognize pages with more than two container classes.
         */
        if ($messageStackContainer.length > 1) {
            $($messageStackContainer[0]).remove();
        }

        if ($message.length > 0 && $createNewWrapper.length > 0) {
            $createNewWrapper.addClass('message-stack-active');
        }
    });

    /**
     * Changing behavior in the orders page.
     */
    fixes.push(function () {
        // Checks if current page is order and return immediately if its not the case
        var isCurrentPage = window.location.href.indexOf('orders.php') > -1;

        if (!isCurrentPage) {
            return;
        }

        // Prepare customer link
        var customerLinkPrefix = window.location.href.replace(window.location.search, '').replace('orders.php', 'customers.php?action=edit&cID=');

        // Do the modifications on the table rows
        var rowsSelectors = ['tr.gx-container.dataTableRowSelected', 'tr.gx-container.dataTableRow'].join(', ');
        var $rows = $this.find(rowsSelectors);

        // Remove the on click event on the entire row add special events
        $rows.each(function (index, element) {
            // Extract order link from element
            var orderLink = $(element).find('td[onclick]:first').attr('onclick');
            if (typeof orderLink !== 'undefined') {
                orderLink.replace('document.location.href="', '').replace('&action=edit', '').slice(0, -1);
            }

            // Customer ID
            var customerId = $(this).find('a[data-customer-id]').data('customerId');

            // Remove onclick attributes from elements
            $(element).find('[onclick]').removeAttr('onclick');
        });
    });

    /**
     * Remove inline class javascript changes.
     */
    fixes.push(function () {
        var selectors = ['.dataTableRow', '.dataTableRowSelected'];

        $.each(selectors, function () {
            $(this).each(function () {
                if ($(this).attr('onmouseover') && $(this).attr('onmouseover').indexOf('this.className') > -1) {
                    $(this).removeAttr('onmouseover');
                }

                if ($(this).attr('onmouseout') && $(this).attr('onmouseout').indexOf('this.className') > -1) {
                    $(this).removeAttr('onmouseout');
                }
            });
        });
    });

    /**
     * Remove the old markup for editing or creating a new category
     */
    fixes.push(function () {
        $('#old-category-table').remove();
    });

    /**
     * Orders form fix.
     */
    fixes.push(function () {
        var $headingBoxContainer = $('.orders_form');
        $.each($headingBoxContainer.children(), function (index, element) {
            $(element).addClass('hidden');
        });
    });

    /**
     * Fix margins and cell spacing of left menu
     */
    fixes.push(function () {
        $('.columnLeft2').parents('table:first').css({
            'border-spacing': 0
        });
    });

    fixes.push(function () {
        var urlHelper = jse.libs.url_arguments;

        if (urlHelper.getCurrentFile() === 'categories.php') {
            $('.columnLeft2').parents('table:first').css('width', '');
        }
    });

    fixes.push(function () {
        var urlHelper = jse.libs.url_arguments;
        var file = urlHelper.getCurrentFile(),
            doParameter = urlHelper.getUrlParameters().do || '',
            largePages = ['gm_emails.php'],
            smallPages = ['gm_seo_boost.php', 'parcel_services.php'];

        if ($.inArray(file, largePages) > -1 || file === 'admin.php' && $.inArray(doParameter, largePages) > -1) {
            $('.boxCenterWrapper').addClass('breakpoint-large');
        }

        if ($.inArray(file, smallPages) > -1 || file === 'admin.php' && $.inArray(doParameter, smallPages) > -1) {
            $('.boxCenterWrapper').addClass('breakpoint-small');
        }
    });

    /**
     * Helper to add css breakpoint classes to pages which use the controller mechanism.
     * Extend whether the array 'largePages' or 'smallPages' to add the breakpoint class.
     * Add as element the controller name (like in the url behind do=) and the action with trailing slash.
     * (the action is the string in the 'do' argument behind the slash)
     */
    fixes.push(function () {
        var urlHelper = jse.libs.url_arguments,
            currentFile = urlHelper.getCurrentFile(),
            controllerAction = urlHelper.getUrlParameters().do,
            largePages = [],
            smallPages = ['JanolawModuleCenterModule/Config'];

        if (currentFile === 'admin.php') {

            if ($.inArray(controllerAction, largePages) > -1) {
                $('#container').addClass('breakpoint-large');
            }

            if ($.inArray(controllerAction, smallPages) > -1) {
                $('#container').addClass('breakpoint-small');
            }
        }
    });

    /**
     * Cleans the header of the configuration box from tables
     */
    fixes.push(function () {
        var $contents = $('div.configuration-box-header h2 table.contentTable tr td > *');
        $contents.each(function (index, elem) {
            $('div.configuration-box-header h2').append(elem);
            $('div.configuration-box-header h2').find('table.contentTable').remove();
        });
    });

    /**
     * Convert all the simple checkboxes to the JS Engine widget.
     *
     * This fix will fine-tune the html markup of the checkbox and then it will dynamically
     * initialize the checkbox widget.
     */
    fixes.push(function () {
        var selectors = ['table .categories_view_data input:checkbox', 'table .dataTableHeadingRow td input:checkbox', 'table thead tr th:first input:checkbox', 'table.gx-orders-table tr:not(.dataTableHeadingRow) td:first-child input:checkbox', 'form[name="quantity_units"] input:checkbox', 'form[name="sliderset"] input:checkbox', 'form[name="featurecontrol"] input:checkbox:not(.checkbox-switcher)', '.feature-table tr td:last-child input:checkbox'];

        if ($(selectors).length > 120) {
            return;
        }

        $.each(selectors, function () {
            $(this).each(function () {
                if (!$(this).parent().hasClass('single-checkbox')) {
                    $(this).attr('data-single_checkbox', '').parent().attr('data-gx-widget', 'checkbox');
                    gx.widgets.init($(this).parent());
                }
            });
        });
    });

    /**
     * Make the top header bar clickable to activate the search bar
     */
    fixes.push(function () {
        var $topHeader = $('.top-header'),
            $searchInput = $('input[name="admin_search"]');

        $topHeader.on('click', function (event) {
            if ($topHeader.is(event.target)) {
                $searchInput.trigger('click');
            }
        });

        $searchInput.on('keyup', function () {
            if ($(this).val().length) {
                $(this).parent().addClass('searching');
            } else {
                $(this).parent().removeClass('searching');
            }
        });
    });

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Execute all the existing fixes.
        $.each(fixes, function () {
            this();
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXRfaHRtbF9maXhlcy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZml4ZXMiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJwdXNoIiwiZXEiLCJyZW1vdmVDbGFzcyIsIndyYXBJbm5lciIsInByZXBlbmRUbyIsImNzcyIsIiRmaXJzdENoaWxkIiwiY2hpbGRyZW4iLCJpcyIsInJlbW92ZSIsImxlbmd0aCIsIndyYXAiLCJhcHBlbmQiLCIkbmV4dEVsZW1lbnQiLCJuZXh0IiwidGFnTmFtZSIsInByb3AiLCIkY29sdW1uTGVmdDIiLCJwYXJlbnQiLCJoYXNDbGFzcyIsImFkZENsYXNzIiwicmVtb3ZlQXR0ciIsIiRtZXNzYWdlU3RhY2tDb250YWluZXIiLCIkbWVzc2FnZSIsImZpbmQiLCIkY3JlYXRlTmV3V3JhcHBlciIsInNob3ciLCJpc0N1cnJlbnRQYWdlIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaW5kZXhPZiIsImN1c3RvbWVyTGlua1ByZWZpeCIsInJlcGxhY2UiLCJzZWFyY2giLCJyb3dzU2VsZWN0b3JzIiwiam9pbiIsIiRyb3dzIiwiZWFjaCIsImluZGV4IiwiZWxlbWVudCIsIm9yZGVyTGluayIsImF0dHIiLCJzbGljZSIsImN1c3RvbWVySWQiLCJzZWxlY3RvcnMiLCIkaGVhZGluZ0JveENvbnRhaW5lciIsInBhcmVudHMiLCJ1cmxIZWxwZXIiLCJqc2UiLCJsaWJzIiwidXJsX2FyZ3VtZW50cyIsImdldEN1cnJlbnRGaWxlIiwiZmlsZSIsImRvUGFyYW1ldGVyIiwiZ2V0VXJsUGFyYW1ldGVycyIsImRvIiwibGFyZ2VQYWdlcyIsInNtYWxsUGFnZXMiLCJpbkFycmF5IiwiY3VycmVudEZpbGUiLCJjb250cm9sbGVyQWN0aW9uIiwiJGNvbnRlbnRzIiwiZWxlbSIsIndpZGdldHMiLCJpbml0IiwiJHRvcEhlYWRlciIsIiRzZWFyY2hJbnB1dCIs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Q0FBYzZELE1BQU1DLE1BQXBCLENBQUosRUFBaUM7QUFDN0JILDZCQUFhSSxPQUFiLENBQXFCLE9BQXJCO0FBQ0g7QUFDSixTQUpEOztBQU1BSixxQkFBYUMsRUFBYixDQUFnQixPQUFoQixFQUF5QixZQUFZO0FBQ2pDLGdCQUFHekUsRUFBRSxJQUFGLEVBQVE2RSxHQUFSLEdBQWM5RCxNQUFqQixFQUF5QjtBQUNyQmYsa0JBQUUsSUFBRixFQUFRdUIsTUFBUixHQUFpQkUsUUFBakIsQ0FBMEIsV0FBMUI7QUFDSCxhQUZELE1BRU87QUFDSHpCLGtCQUFFLElBQUYsRUFBUXVCLE1BQVIsR0FBaUJoQixXQUFqQixDQUE2QixXQUE3QjtBQUNIO0FBQ0osU0FORDtBQVFILEtBbEJEOztBQW9CQTtBQUNBO0FBQ0E7O0FBRUFWLFdBQU95RSxJQUFQLEdBQWMsVUFBVVEsSUFBVixFQUFnQjtBQUMxQjtBQUNBOUUsVUFBRTJDLElBQUYsQ0FBTzFDLEtBQVAsRUFBYyxZQUFZO0FBQ3RCO0FBQ0gsU0FGRDs7QUFJQTZFO0FBQ0gsS0FQRDs7QUFTQSxXQUFPakYsTUFBUDtBQUNILENBelhMIiwiZmlsZSI6ImluaXRfaHRtbF9maXhlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gaW5pdF9odG1sX2ZpeGVzLmpzIDIwMTYtMDItMTBcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE2IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqICMjIEFkbWluIEhUTUwgRml4ZXNcbiAqXG4gKiBUaGlzIG1vZHVsZSB3aWxsIGJlIGV4ZWN1dGVkIGluIHBhZ2UgbG9hZCBhbmQgd2lsbCBwZXJmb3JtIG1pbm9yIEhUTUwgZml4ZXMgZm9yIGVhY2ggcGFnZXNcbiAqIHNvIHRoYXQgdGhleSBkb24ndCBoYXZlIHRvIGJlIHBlcmZvcm1lZCBtYW51YWxseS4gQXBwbHkgdGhpcyBtb2R1bGUgdG8gdGhlIHBhZ2Ugd3JhcHBlciBlbGVtZW50LlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9pbml0X2h0bWxfZml4ZXNcbiAqL1xuZ3guY29tcGF0aWJpbGl0eS5tb2R1bGUoXG4gICAgJ2luaXRfaHRtbF9maXhlcycsXG5cbiAgICBbJ3VybF9hcmd1bWVudHMnXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb21wYXRpYmlsaXR5L2luaXRfaHRtbF9maXhlcyAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBcnJheSBvZiBjYWxsYmFja3MuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2FycmF5fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmaXhlcyA9IFtdLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBIVE1MIEZJWEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwIG1haW4gcGFnZSBjb250ZW50IGludG8gY29udGFpbmVyLlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcucGFnZUhlYWRpbmcnKS5lcSgxKS5yZW1vdmVDbGFzcygncGFnZUhlYWRpbmcnKTtcbiAgICAgICAgICAgICQoJy5ib3hDZW50ZXI6bm90KC5uby13cmFwKScpLndyYXBJbm5lcignPGRpdiBjbGFzcz1cImJveENlbnRlcldyYXBwZXJcIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICQoJy5wYWdlSGVhZGluZzpmaXJzdC1jaGlsZCcpLnByZXBlbmRUbygnLmJveENlbnRlcicpO1xuICAgICAgICAgICAgJCgnLnBhZ2VIZWFkaW5nJykuY3NzKCdmbG9hdCcsICdub25lJyk7XG5cbiAgICAgICAgICAgIHZhciAkZmlyc3RDaGlsZCA9ICQoJCgnLmJveENlbnRlcldyYXBwZXInKS5jaGlsZHJlbigpWzBdKTtcblxuICAgICAgICAgICAgaWYgKCRmaXJzdENoaWxkLmlzKCdicicpKSB7XG4gICAgICAgICAgICAgICAgJGZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkKCdkaXYuZ3gtY29uZmlndXJhdGlvbi1ib3gnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCcuYm94Q2VudGVyV3JhcHBlcicpLndyYXAoJzxkaXYgY2xhc3M9XCJib3hDZW50ZXJBbmRDb25maWd1cmF0aW9uV3JhcHBlclwiIHN0eWxlPVwib3ZlcmZsb3c6IGF1dG9cIj48L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAkKCcuYm94Q2VudGVyQW5kQ29uZmlndXJhdGlvbldyYXBwZXInKS5hcHBlbmQoJCgnZGl2Lmd4LWNvbmZpZ3VyYXRpb24tYm94JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHVubmVjZXNzYXJ5IDxicj4gdGFnIGFmdGVyIHBhZ2Ugd3JhcHBlciBlbGVtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJG5leHRFbGVtZW50ID0gJHRoaXMubmV4dCgpLFxuICAgICAgICAgICAgICAgIHRhZ05hbWUgPSAkbmV4dEVsZW1lbnQucHJvcCgndGFnTmFtZScpO1xuXG4gICAgICAgICAgICBpZiAodGFnTmFtZSA9PT0gJ0JSJykge1xuICAgICAgICAgICAgICAgICRuZXh0RWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVuc3VyZSB0aGF0IHRoZSBsZWZ0IG1lbnUgcGFyZW50IGhhcyB0aGUgY29sdW1uTGVmdDIgY2xhc3MgYmVjYXVzZSB0aGVyZVxuICAgICAgICAgKiBhcmUgc29tZSBwYWdlcyB3aGVyZSB0aGlzIGNsYXNzIGlzIG5vdCBkZWZpbmVkIGFuZCBpdCB3aWxsIGxlYWQgdG8gc3R5bGluZyBpc3N1ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkY29sdW1uTGVmdDIgPSAkKCcubWFpbi1sZWZ0LW1lbnUnKS5wYXJlbnQoJ3RkJyk7XG4gICAgICAgICAgICBpZiAoISRjb2x1bW5MZWZ0Mi5oYXNDbGFzcygnY29sdW1uTGVmdDInKSkge1xuICAgICAgICAgICAgICAgICRjb2x1bW5MZWZ0Mi5hZGRDbGFzcygnY29sdW1uTGVmdDInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSB3aWR0aCBhdHRyaWJ1dGUgZnJvbSBcIi5jb2x1bW5MZWZ0MlwiIGVsZW1lbnQuXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5jb2x1bW5MZWZ0MicpLnJlbW92ZUF0dHIoJ3dpZHRoJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb3ZlIG1lc3NhZ2Ugc3RhY2sgY29udGFpbmVyIHRvIGNvcnJlY3QgcGxhY2UuXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkbWVzc2FnZVN0YWNrQ29udGFpbmVyID0gJCgnLm1lc3NhZ2Vfc3RhY2tfY29udGFpbmVyJyksXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2UgPSAkbWVzc2FnZVN0YWNrQ29udGFpbmVyLmZpbmQoJy5hbGVydCcpLFxuICAgICAgICAgICAgICAgICRjcmVhdGVOZXdXcmFwcGVyID0gJCgnLmNyZWF0ZS1uZXctd3JhcHBlcicpO1xuXG4gICAgICAgICAgICBpZiAoJCgnLmJveENlbnRlcldyYXBwZXInKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VTdGFja0NvbnRhaW5lci5wcmVwZW5kVG8oJy5ib3hDZW50ZXJXcmFwcGVyJykuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVN0YWNrQ29udGFpbmVyLnByZXBlbmRUbygnLm9yZGVyLWVkaXQtY29udGVudCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVN0YWNrQ29udGFpbmVyLnByZXBlbmRUbygnLmRhc2hib2FyZC1jb250ZW50Jykuc2hvdygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpeCBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIG9uZSBtZXNzYWdlIHN0YWNrIGNvbnRhaW5lciBjbGFzc2VzLlxuICAgICAgICAgICAgICogVGhpcyBmaXggb25seSB3b3JrLCBpZiB0aGVyZSBhcmUgdHdvIGNvbnRhaW5lcnMuXG4gICAgICAgICAgICAgKiBJbXByb3ZlIGl0IGlmIHlvdSByZWNvZ25pemUgcGFnZXMgd2l0aCBtb3JlIHRoYW4gdHdvIGNvbnRhaW5lciBjbGFzc2VzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAoJG1lc3NhZ2VTdGFja0NvbnRhaW5lci5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgJCgkbWVzc2FnZVN0YWNrQ29udGFpbmVyWzBdKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCRtZXNzYWdlLmxlbmd0aCA+IDAgJiYgJGNyZWF0ZU5ld1dyYXBwZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRjcmVhdGVOZXdXcmFwcGVyLmFkZENsYXNzKCdtZXNzYWdlLXN0YWNrLWFjdGl2ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhbmdpbmcgYmVoYXZpb3IgaW4gdGhlIG9yZGVycyBwYWdlLlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBDaGVja3MgaWYgY3VycmVudCBwYWdlIGlzIG9yZGVyIGFuZCByZXR1cm4gaW1tZWRpYXRlbHkgaWYgaXRzIG5vdCB0aGUgY2FzZVxuICAgICAgICAgICAgdmFyIGlzQ3VycmVudFBhZ2UgPSAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignb3JkZXJzLnBocCcpID4gLTEpO1xuXG4gICAgICAgICAgICBpZiAoIWlzQ3VycmVudFBhZ2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFByZXBhcmUgY3VzdG9tZXIgbGlua1xuICAgICAgICAgICAgdmFyIGN1c3RvbWVyTGlua1ByZWZpeCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgICAgICAgICAgLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLnNlYXJjaCwgJycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoJ29yZGVycy5waHAnLCAnY3VzdG9tZXJzLnBocD9hY3Rpb249ZWRpdCZjSUQ9Jyk7XG5cbiAgICAgICAgICAgIC8vIERvIHRoZSBtb2RpZmljYXRpb25zIG9uIHRoZSB0YWJsZSByb3dzXG4gICAgICAgICAgICB2YXIgcm93c1NlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICAgICAndHIuZ3gtY29udGFpbmVyLmRhdGFUYWJsZVJvd1NlbGVjdGVkJyxcbiAgICAgICAgICAgICAgICAndHIuZ3gtY29udGFpbmVyLmRhdGFUYWJsZVJvdydcbiAgICAgICAgICAgIF0uam9pbignLCAnKTtcbiAgICAgICAgICAgIHZhciAkcm93cyA9ICR0aGlzLmZpbmQocm93c1NlbGVjdG9ycyk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgb24gY2xpY2sgZXZlbnQgb24gdGhlIGVudGlyZSByb3cgYWRkIHNwZWNpYWwgZXZlbnRzXG4gICAgICAgICAgICAkcm93cy5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIC8vIEV4dHJhY3Qgb3JkZXIgbGluayBmcm9tIGVsZW1lbnRcbiAgICAgICAgICAgICAgICB2YXIgb3JkZXJMaW5rID0gJChlbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAuZmluZCgndGRbb25jbGlja106Zmlyc3QnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignb25jbGljaycpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3JkZXJMaW5rICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBvcmRlckxpbmtcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkb2N1bWVudC5sb2NhdGlvbi5ocmVmPVwiJywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnJmFjdGlvbj1lZGl0JywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEN1c3RvbWVyIElEXG4gICAgICAgICAgICAgICAgdmFyIGN1c3RvbWVySWQgPSAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdhW2RhdGEtY3VzdG9tZXItaWRdJylcbiAgICAgICAgICAgICAgICAgICAgLmRhdGEoJ2N1c3RvbWVySWQnKTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBvbmNsaWNrIGF0dHJpYnV0ZXMgZnJvbSBlbGVtZW50c1xuICAgICAgICAgICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ1tvbmNsaWNrXScpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdvbmNsaWNrJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBpbmxpbmUgY2xhc3MgamF2YXNjcmlwdCBjaGFuZ2VzLlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgICAgICcuZGF0YVRhYmxlUm93JyxcbiAgICAgICAgICAgICAgICAnLmRhdGFUYWJsZVJvd1NlbGVjdGVkJ1xuICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgJC5lYWNoKHNlbGVjdG9ycywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ29ubW91c2VvdmVyJykgJiYgJCh0aGlzKS5hdHRyKCdvbm1vdXNlb3ZlcicpLmluZGV4T2YoJ3RoaXMuY2xhc3NOYW1lJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdvbm1vdXNlb3ZlcicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cignb25tb3VzZW91dCcpICYmICQodGhpcykuYXR0cignb25tb3VzZW91dCcpLmluZGV4T2YoJ3RoaXMuY2xhc3NOYW1lJykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVBdHRyKCdvbm1vdXNlb3V0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIHRoZSBvbGQgbWFya3VwIGZvciBlZGl0aW5nIG9yIGNyZWF0aW5nIGEgbmV3IGNhdGVnb3J5XG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJyNvbGQtY2F0ZWdvcnktdGFibGUnKS5yZW1vdmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9yZGVycyBmb3JtIGZpeC5cbiAgICAgICAgICovXG4gICAgICAgIGZpeGVzLnB1c2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRoZWFkaW5nQm94Q29udGFpbmVyID0gJCgnLm9yZGVyc19mb3JtJyk7XG4gICAgICAgICAgICAkLmVhY2goJGhlYWRpbmdCb3hDb250YWluZXIuY2hpbGRyZW4oKSwgZnVuY3Rpb24gKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpeCBtYXJnaW5zIGFuZCBjZWxsIHNwYWNpbmcgb2YgbGVmdCBtZW51XG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5jb2x1bW5MZWZ0MicpXG4gICAgICAgICAgICAgICAgLnBhcmVudHMoJ3RhYmxlOmZpcnN0JylcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2JvcmRlci1zcGFjaW5nJzogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmxIZWxwZXIgPSBqc2UubGlicy51cmxfYXJndW1lbnRzO1xuXG4gICAgICAgICAgICBpZiAodXJsSGVscGVyLmdldEN1cnJlbnRGaWxlKCkgPT09ICdjYXRlZ29yaWVzLnBocCcpIHtcbiAgICAgICAgICAgICAgICAkKCcuY29sdW1uTGVmdDInKVxuICAgICAgICAgICAgICAgICAgICAucGFyZW50cygndGFibGU6Zmlyc3QnKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCd3aWR0aCcsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdXJsSGVscGVyID0ganNlLmxpYnMudXJsX2FyZ3VtZW50cztcbiAgICAgICAgICAgIHZhciBmaWxlID0gdXJsSGVscGVyLmdldEN1cnJlbnRGaWxlKCksXG4gICAgICAgICAgICAgICAgZG9QYXJhbWV0ZXIgPSB1cmxIZWxwZXIuZ2V0VXJsUGFyYW1ldGVycygpLmRvIHx8ICcnLFxuICAgICAgICAgICAgICAgIGxhcmdlUGFnZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICdnbV9lbWFpbHMucGhwJ1xuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgc21hbGxQYWdlcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgJ2dtX3Nlb19ib29zdC5waHAnLFxuICAgICAgICAgICAgICAgICAgICAncGFyY2VsX3NlcnZpY2VzLnBocCdcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KGZpbGUsIGxhcmdlUGFnZXMpID4gLTFcbiAgICAgICAgICAgICAgICB8fCAoZmlsZSA9PT0gJ2FkbWluLnBocCcgJiYgJC5pbkFycmF5KGRvUGFyYW1ldGVyLCBsYXJnZVBhZ2VzKSA+IC0xKSkge1xuICAgICAgICAgICAgICAgICQoJy5ib3hDZW50ZXJXcmFwcGVyJylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdicmVha3BvaW50LWxhcmdlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZmlsZSwgc21hbGxQYWdlcykgPiAtMVxuICAgICAgICAgICAgICAgIHx8IChmaWxlID09PSAnYWRtaW4ucGhwJyAmJiAkLmluQXJyYXkoZG9QYXJhbWV0ZXIsIHNtYWxsUGFnZXMpID4gLTEpKSB7XG4gICAgICAgICAgICAgICAgJCgnLmJveENlbnRlcldyYXBwZXInKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2JyZWFrcG9pbnQtc21hbGwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhlbHBlciB0byBhZGQgY3NzIGJyZWFrcG9pbnQgY2xhc3NlcyB0byBwYWdlcyB3aGljaCB1c2UgdGhlIGNvbnRyb2xsZXIgbWVjaGFuaXNtLlxuICAgICAgICAgKiBFeHRlbmQgd2hldGhlciB0aGUgYXJyYXkgJ2xhcmdlUGFnZXMnIG9yICdzbWFsbFBhZ2VzJyB0byBhZGQgdGhlIGJyZWFrcG9pbnQgY2xhc3MuXG4gICAgICAgICAqIEFkZCBhcyBlbGVtZW50IHRoZSBjb250cm9sbGVyIG5hbWUgKGxpa2UgaW4gdGhlIHVybCBiZWhpbmQgZG89KSBhbmQgdGhlIGFjdGlvbiB3aXRoIHRyYWlsaW5nIHNsYXNoLlxuICAgICAgICAgKiAodGhlIGFjdGlvbiBpcyB0aGUgc3RyaW5nIGluIHRoZSAnZG8nIGFyZ3VtZW50IGJlaGluZCB0aGUgc2xhc2gpXG4gICAgICAgICAqL1xuICAgICAgICBmaXhlcy5wdXNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmxIZWxwZXIgPSBqc2UubGlicy51cmxfYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRGaWxlID0gdXJsSGVscGVyLmdldEN1cnJlbnRGaWxlKCksXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFjdGlvbiA9IHVybEhlbHBlci5nZXRVcmxQYXJhbWV0ZXJzKCkuZG8sXG4gICAgICAgICAgICAgICAgbGFyZ2VQYWdlcyA9IFtdLFxuICAgICAgICAgICAgICAgIHNtYWxsUGFnZXMgPSBbJ0phbm9sYXdNb2R1bGVDZW50ZXJNb2R1bGUvQ29uZmlnJ107XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50RmlsZSA9PT0gJ2FkbWluLnBocCcpIHtcblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoY29udHJvbGxlckFjdGlvbiwgbGFyZ2VQYWdlcykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnYnJlYWtwb2ludC1sYXJnZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoY29udHJvbGxlckFjdGlvbiwgc21hbGxQYWdlcykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnYnJlYWtwb2ludC1zbWFsbCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsZWFucyB0aGUgaGVhZGVyIG9mIHRoZSBjb25maWd1cmF0aW9uIGJveCBmcm9tIHRhYmxlc1xuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGNvbnRlbnRzID0gJCgnZGl2LmNvbmZpZ3VyYXRpb24tYm94LWhlYWRlciBoMiB0YWJsZS5jb250ZW50VGFibGUgdHIgdGQgPiAqJyk7XG4gICAgICAgICAgICAkY29udGVudHMuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW0pIHtcbiAgICAgICAgICAgICAgICAkKCdkaXYuY29uZmlndXJhdGlvbi1ib3gtaGVhZGVyIGgyJykuYXBwZW5kKGVsZW0pO1xuICAgICAgICAgICAgICAgICQoJ2Rpdi5jb25maWd1cmF0aW9uLWJveC1oZWFkZXIgaDInKS5maW5kKCd0YWJsZS5jb250ZW50VGFibGUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29udmVydCBhbGwgdGhlIHNpbXBsZSBjaGVja2JveGVzIHRvIHRoZSBKUyBFbmdpbmUgd2lkZ2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIGZpeCB3aWxsIGZpbmUtdHVuZSB0aGUgaHRtbCBtYXJrdXAgb2YgdGhlIGNoZWNrYm94IGFuZCB0aGVuIGl0IHdpbGwgZHluYW1pY2FsbHlcbiAgICAgICAgICogaW5pdGlhbGl6ZSB0aGUgY2hlY2tib3ggd2lkZ2V0LlxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgICAgICd0YWJsZSAuY2F0ZWdvcmllc192aWV3X2RhdGEgaW5wdXQ6Y2hlY2tib3gnLFxuICAgICAgICAgICAgICAgICd0YWJsZSAuZGF0YVRhYmxlSGVhZGluZ1JvdyB0ZCBpbnB1dDpjaGVja2JveCcsXG4gICAgICAgICAgICAgICAgJ3RhYmxlIHRoZWFkIHRyIHRoOmZpcnN0IGlucHV0OmNoZWNrYm94JyxcbiAgICAgICAgICAgICAgICAndGFibGUuZ3gtb3JkZXJzLXRhYmxlIHRyOm5vdCguZGF0YVRhYmxlSGVhZGluZ1JvdykgdGQ6Zmlyc3QtY2hpbGQgaW5wdXQ6Y2hlY2tib3gnLFxuICAgICAgICAgICAgICAgICdmb3JtW25hbWU9XCJxdWFudGl0eV91bml0c1wiXSBpbnB1dDpjaGVja2JveCcsXG4gICAgICAgICAgICAgICAgJ2Zvcm1bbmFtZT1cInNsaWRlcnNldFwiXSBpbnB1dDpjaGVja2JveCcsXG4gICAgICAgICAgICAgICAgJ2Zvcm1bbmFtZT1cImZlYXR1cmVjb250cm9sXCJdIGlucHV0OmNoZWNrYm94Om5vdCguY2hlY2tib3gtc3dpdGNoZXIpJyxcbiAgICAgICAgICAgICAgICAnLmZlYXR1cmUtdGFibGUgdHIgdGQ6bGFzdC1jaGlsZCBpbnB1dDpjaGVja2JveCdcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGlmICgkKHNlbGVjdG9ycykubGVuZ3RoID4gMTIwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmVhY2goc2VsZWN0b3JzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLnBhcmVudCgpLmhhc0NsYXNzKCdzaW5nbGUtY2hlY2tib3gnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNpbmdsZV9jaGVja2JveCcsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKS5hdHRyKCdkYXRhLWd4LXdpZGdldCcsICdjaGVja2JveCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCQodGhpcykucGFyZW50KCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1ha2UgdGhlIHRvcCBoZWFkZXIgYmFyIGNsaWNrYWJsZSB0byBhY3RpdmF0ZSB0aGUgc2VhcmNoIGJhclxuICAgICAgICAgKi9cbiAgICAgICAgZml4ZXMucHVzaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHRvcEhlYWRlciA9ICQoJy50b3AtaGVhZGVyJyksXG4gICAgICAgICAgICAgICAgJHNlYXJjaElucHV0ID0gJCgnaW5wdXRbbmFtZT1cImFkbWluX3NlYXJjaFwiXScpO1xuXG4gICAgICAgICAgICAkdG9wSGVhZGVyLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgkdG9wSGVhZGVyLmlzKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNlYXJjaElucHV0LnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRzZWFyY2hJbnB1dC5vbigna2V5dXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYoJCh0aGlzKS52YWwoKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcygnc2VhcmNoaW5nJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnc2VhcmNoaW5nJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgLy8gRXhlY3V0ZSBhbGwgdGhlIGV4aXN0aW5nIGZpeGVzLlxuICAgICAgICAgICAgJC5lYWNoKGZpeGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcygpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH0pO1xuIl19
