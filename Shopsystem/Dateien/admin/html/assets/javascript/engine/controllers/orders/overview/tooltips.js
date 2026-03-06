'use strict';

/* --------------------------------------------------------------
 tooltip.js 2018-01-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Orders Table Tooltip
 *
 * This controller displays tooltips for the orders overview table. The tooltips are loaded after the
 * table data request is ready for optimization purposes.
 */
gx.controllers.module('tooltips', [jse.source + '/vendor/qtip2/jquery.qtip.css', jse.source + '/vendor/qtip2/jquery.qtip.js'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @var {jQuery}
     */

    var $this = $(this);

    /**
     * Default Options
     *
     * @type {Object}
     */
    var defaults = {
        sourceUrl: jse.core.config.get('appUrl') + '/admin/admin.php?do=OrdersOverviewAjax/Tooltips',
        selectors: {
            mouseenter: {
                orderItems: '.tooltip-order-items',
                invoices: '.tooltip-invoices',
                customerMemos: '.tooltip-customer-memos',
                customerAddresses: '.tooltip-customer-addresses',
                orderSumBlock: '.tooltip-order-sum-block',
                orderStatusHistory: '.tooltip-order-status-history',
                orderWithdrawals: '.tooltip-order-withdrawals',
                orderComment: '.tooltip-order-comment',
                trackingLinks: '.tooltip-tracking-links'
            }
        }
    };

    /**
     * Final Options
     *
     * @var {Object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module Object
     *
     * @type {Object}
     */
    var module = {};

    /**
     * Tooltip Contents
     *
     * Contains the rendered HTML of the tooltips. The HTML is rendered with each table draw.
     *
     * e.g. tooltips.400210.orderItems >> HTML for order items tooltip of order #400210.
     *
     * @type {Object}
     */
    var tooltips = void 0;

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Get Target Position
     *
     * @param {jQuery} $target
     *
     * @return {String}
     */
    function _getTargetPosition($target) {
        var horizontal = $target.offset().left - $(window).scrollLeft() > $(window).width() / 2 ? 'left' : 'right';
        var vertical = $target.offset().top - $(window).scrollTop() > $(window).height() / 2 ? 'top' : 'bottom';

        return horizontal + ' ' + vertical;
    }

    /**
     * Get Tooltip Position
     *
     * @param {jQuery} $target
     *
     * @return {String}
     */
    function _getTooltipPosition($target) {
        var horizontal = $target.offset().left - $(window).scrollLeft() > $(window).width() / 2 ? 'right' : 'left';
        var vertical = $target.offset().top - $(window).scrollTop() > $(window).height() / 2 ? 'bottom' : 'top';

        return horizontal + ' ' + vertical;
    }

    /**
     * If there is only one link then open it in a new tab.
     */
    function _onTrackingLinksClick() {
        var trackingLinks = $(this).parents('tr').data('trackingLinks');

        if (trackingLinks.length === 1) {
            window.open(trackingLinks[0], '_blank');
        }
    }

    /**
     * Initialize tooltip for static table data.
     *
     * Replaces the browsers default tooltip with a qTip instance for every element on the table which has
     * a title attribute.
     */
    function _initTooltipsForStaticContent() {
        $this.find('tbody [title]').qtip({
            style: { classes: 'gx-qtip info' }
        });
    }

    /**
     * Show Tooltip
     *
     * Display the Qtip instance of the target. The tooltip contents are fetched after the table request
     * is finished for performance reasons. This method will not show anything until the tooltip contents
     * are fetched.
     *
     * @param {jQuery.Event} event
     */
    function _showTooltip(event) {
        event.stopPropagation();

        var orderId = $(this).parents('tr').data('id');

        if (!tooltips || !tooltips[orderId]) {
            return; // The requested tooltip is not loaded, do not continue.
        }

        var tooltipPosition = _getTooltipPosition($(this));
        var targetPosition = _getTargetPosition($(this));

        $(this).qtip({
            content: tooltips[orderId][event.data.name],
            style: {
                classes: 'gx-qtip info'
            },
            position: {
                my: tooltipPosition,
                at: targetPosition,
                effect: false,
                viewport: $(window),
                adjust: {
                    method: 'none shift'
                }
            },
            hide: {
                fixed: true,
                delay: 300
            },
            show: {
                ready: true,
                delay: 100
            },
            events: {
                hidden: function hidden(event, api) {
                    api.destroy(true);
                }
            }
        });
    }

    /**
     * Get Tooltips
     *
     * Fetches the tooltips with an AJAX request, based on the current state of the table.
     */
    function _getTooltips() {
        tooltips = [];
        var datatablesXhrParameters = $this.DataTable().ajax.params();
        $.post(options.sourceUrl, datatablesXhrParameters, function (response) {
            return tooltips = response;
        }, 'json');
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('draw.dt', _initTooltipsForStaticContent).on('xhr.dt', _getTooltips).on('click', '.tooltip-tracking-links', _onTrackingLinksClick);

        $(window).on('JSENGINE_INIT_FINISHED', function () {
            if ($this.DataTable().ajax.json() !== undefined && tooltips === undefined) {
                _getTooltips();
            }
        });

        for (var event in options.selectors) {
            for (var name in options.selectors[event]) {
                $this.on(event, options.selectors[event][name], { name: name }, _showTooltip);
            }
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vdmVydmlldy90b29sdGlwcy5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwianNlIiwic291cmNlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwic291cmNlVXJsIiwiY29yZSIsImNvbmZpZyIsImdldCIsInNlbGVjdG9ycyIsIm1vdXNlZW50ZXIiLCJvcmRlckl0ZW1zIiwiaW52b2ljZXMiLCJjdXN0b21lck1lbW9zIiwiY3VzdG9tZXJBZGRyZXNzZXMiLCJvcmRlclN1bUJsb2NrIiwib3JkZXJTdGF0dXNIaXN0b3J5Iiwib3JkZXJXaXRoZHJhd2FscyIsIm9yZGVyQ29tbWVudCIsInRyYWNraW5nTGlua3MiLCJvcHRpb25zIiwiZXh0ZW5kIiwidG9vbHRpcHMiLCJfZ2V0VGFyZ2V0UG9zaXRpb24iLCIkdGFyZ2V0IiwiaG9yaXpvbnRhbCIsIm9mZnNldCIsImxlZnQiLCJ3aW5kb3ciLCJzY3JvbGxMZWZ0Iiwid2lkdGgiLCJ2ZXJ0aWNhbCIsInRvcCIsInNjcm9sbFRvcCIsImhlaWdodCIsIl9nZXRUb29sdGlwUG9zaXRpb24iLCJfb25UcmFja2luZ0xpbmtzQ2xpY2siLCJwYXJlbnRzIiwibGVuZ3RoIiwib3BlbiIsIl9pbml0VG9vbHRpcHNGb3JTdGF0aWNDb250ZW50IiwiZmluZCIsInF0aXAiLCJzdHlsZSIsImNsYXNzZXMiLCJfc2hvd1Rvb2x0aXAiLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsIm9yZGVySWQiLCJ0b29sdGlwUG9zaXRpb24iLCJ0YXJnZXRQb3NpdGlvbiIsImNvbnRlbnQiLCJuYW1lIiwicG9zaXRpb24iLCJteSIsImF0IiwiZWZmZWN0Iiwidmlld3BvcnQiLCJhZGp1c3QiLCJtZXRob2QiLCJoaWRlIiwiZml4ZWQiLCJkZWxheSIsInNob3ciLCJyZWFkeSIsImV2ZW50cyIsImhpZGRlbiIsImFwaSIsImRlc3Ryb3kiLCJfZ2V0VG9vbHRpcHMiLCJkYXRhdGFibGVzWGhyUGFyYW1ldGVycyIsIkRhdGFUYWJsZSIsImFqYXgiLCJwYXJhbXMiLCJwb3N0IiwicmVzcG9uc2UiLCJpbml0IiwiZG9uZSIsIm9uIiwianNvbiIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFNQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksVUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgsb0NBRU9ELElBQUlDLE1BRlgsa0NBSEosRUFRSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVztBQUNiQyxtQkFBV04sSUFBSU8sSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxpREFEOUI7QUFFYkMsbUJBQVc7QUFDUEMsd0JBQVk7QUFDUkMsNEJBQVksc0JBREo7QUFFUkMsMEJBQVUsbUJBRkY7QUFHUkMsK0JBQWUseUJBSFA7QUFJUkMsbUNBQW1CLDZCQUpYO0FBS1JDLCtCQUFlLDBCQUxQO0FBTVJDLG9DQUFvQiwrQkFOWjtBQU9SQyxrQ0FBa0IsNEJBUFY7QUFRUkMsOEJBQWMsd0JBUk47QUFTUkMsK0JBQWU7QUFUUDtBQURMO0FBRkUsS0FBakI7O0FBaUJBOzs7OztBQUtBLFFBQU1DLFVBQVVqQixFQUFFa0IsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CakIsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1ILFNBQVMsRUFBZjs7QUFFQTs7Ozs7Ozs7O0FBU0EsUUFBSXdCLGlCQUFKOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQU9BLGFBQVNDLGtCQUFULENBQTRCQyxPQUE1QixFQUFxQztBQUNqQyxZQUFNQyxhQUFhRCxRQUFRRSxNQUFSLEdBQWlCQyxJQUFqQixHQUF3QnhCLEVBQUV5QixNQUFGLEVBQVVDLFVB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dmlldy90b29sdGlwcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gdG9vbHRpcC5qcyAyMDE4LTAxLTE2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxOCBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBPcmRlcnMgVGFibGUgVG9vbHRpcFxuICpcbiAqIFRoaXMgY29udHJvbGxlciBkaXNwbGF5cyB0b29sdGlwcyBmb3IgdGhlIG9yZGVycyBvdmVydmlldyB0YWJsZS4gVGhlIHRvb2x0aXBzIGFyZSBsb2FkZWQgYWZ0ZXIgdGhlXG4gKiB0YWJsZSBkYXRhIHJlcXVlc3QgaXMgcmVhZHkgZm9yIG9wdGltaXphdGlvbiBwdXJwb3Nlcy5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICd0b29sdGlwcycsXG5cbiAgICBbXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9xdGlwMi9qcXVlcnkucXRpcC5jc3NgLFxuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvcXRpcDIvanF1ZXJ5LnF0aXAuanNgXG4gICAgXSxcblxuICAgIGZ1bmN0aW9uIChkYXRhKSB7XG5cbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBTZWxlY3RvclxuICAgICAgICAgKlxuICAgICAgICAgKiBAdmFyIHtqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBzb3VyY2VVcmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89T3JkZXJzT3ZlcnZpZXdBamF4L1Rvb2x0aXBzJyxcbiAgICAgICAgICAgIHNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJJdGVtczogJy50b29sdGlwLW9yZGVyLWl0ZW1zJyxcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZXM6ICcudG9vbHRpcC1pbnZvaWNlcycsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyTWVtb3M6ICcudG9vbHRpcC1jdXN0b21lci1tZW1vcycsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyQWRkcmVzc2VzOiAnLnRvb2x0aXAtY3VzdG9tZXItYWRkcmVzc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJTdW1CbG9jazogJy50b29sdGlwLW9yZGVyLXN1bS1ibG9jaycsXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyU3RhdHVzSGlzdG9yeTogJy50b29sdGlwLW9yZGVyLXN0YXR1cy1oaXN0b3J5JyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJXaXRoZHJhd2FsczogJy50b29sdGlwLW9yZGVyLXdpdGhkcmF3YWxzJyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJDb21tZW50OiAnLnRvb2x0aXAtb3JkZXItY29tbWVudCcsXG4gICAgICAgICAgICAgICAgICAgIHRyYWNraW5nTGlua3M6ICcudG9vbHRpcC10cmFja2luZy1saW5rcycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB2YXIge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9vbHRpcCBDb250ZW50c1xuICAgICAgICAgKlxuICAgICAgICAgKiBDb250YWlucyB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGUgdG9vbHRpcHMuIFRoZSBIVE1MIGlzIHJlbmRlcmVkIHdpdGggZWFjaCB0YWJsZSBkcmF3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBlLmcuIHRvb2x0aXBzLjQwMDIxMC5vcmRlckl0ZW1zID4+IEhUTUwgZm9yIG9yZGVyIGl0ZW1zIHRvb2x0aXAgb2Ygb3JkZXIgIzQwMDIxMC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCB0b29sdGlwcztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVGFyZ2V0IFBvc2l0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRUYXJnZXRQb3NpdGlvbigkdGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBob3Jpem9udGFsID0gJHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKSA+ICQod2luZG93KS53aWR0aCgpIC8gMlxuICAgICAgICAgICAgICAgID8gJ2xlZnQnXG4gICAgICAgICAgICAgICAgOiAncmlnaHQnO1xuICAgICAgICAgICAgY29uc3QgdmVydGljYWwgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSA+ICQod2luZG93KS5oZWlnaHQoKSAvIDJcbiAgICAgICAgICAgICAgICA/ICd0b3AnXG4gICAgICAgICAgICAgICAgOiAnYm90dG9tJztcblxuICAgICAgICAgICAgcmV0dXJuIGhvcml6b250YWwgKyAnICcgKyB2ZXJ0aWNhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVG9vbHRpcCBQb3NpdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhcmdldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VG9vbHRpcFBvc2l0aW9uKCR0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGhvcml6b250YWwgPSAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpID4gJCh3aW5kb3cpLndpZHRoKCkgLyAyXG4gICAgICAgICAgICAgICAgPyAncmlnaHQnXG4gICAgICAgICAgICAgICAgOiAnbGVmdCc7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0aWNhbCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gJCh3aW5kb3cpLmhlaWdodCgpIC8gMlxuICAgICAgICAgICAgICAgID8gJ2JvdHRvbSdcbiAgICAgICAgICAgICAgICA6ICd0b3AnO1xuXG4gICAgICAgICAgICByZXR1cm4gaG9yaXpvbnRhbCArICcgJyArIHZlcnRpY2FsO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZXJlIGlzIG9ubHkgb25lIGxpbmsgdGhlbiBvcGVuIGl0IGluIGEgbmV3IHRhYi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRyYWNraW5nTGlua3NDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWNraW5nTGlua3MgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgndHJhY2tpbmdMaW5rcycpO1xuXG4gICAgICAgICAgICBpZiAodHJhY2tpbmdMaW5rcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih0cmFja2luZ0xpbmtzWzBdLCAnX2JsYW5rJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSB0b29sdGlwIGZvciBzdGF0aWMgdGFibGUgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogUmVwbGFjZXMgdGhlIGJyb3dzZXJzIGRlZmF1bHQgdG9vbHRpcCB3aXRoIGEgcVRpcCBpbnN0YW5jZSBmb3IgZXZlcnkgZWxlbWVudCBvbiB0aGUgdGFibGUgd2hpY2ggaGFzXG4gICAgICAgICAqIGEgdGl0bGUgYXR0cmlidXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2luaXRUb29sdGlwc0ZvclN0YXRpY0NvbnRlbnQoKSB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBbdGl0bGVdJykucXRpcCh7XG4gICAgICAgICAgICAgICAgc3R5bGU6IHtjbGFzc2VzOiAnZ3gtcXRpcCBpbmZvJ31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3cgVG9vbHRpcFxuICAgICAgICAgKlxuICAgICAgICAgKiBEaXNwbGF5IHRoZSBRdGlwIGluc3RhbmNlIG9mIHRoZSB0YXJnZXQuIFRoZSB0b29sdGlwIGNvbnRlbnRzIGFyZSBmZXRjaGVkIGFmdGVyIHRoZSB0YWJsZSByZXF1ZXN0XG4gICAgICAgICAqIGlzIGZpbmlzaGVkIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBzaG93IGFueXRoaW5nIHVudGlsIHRoZSB0b29sdGlwIGNvbnRlbnRzXG4gICAgICAgICAqIGFyZSBmZXRjaGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93VG9vbHRpcChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9yZGVySWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgICAgaWYgKCF0b29sdGlwcyB8fCAhdG9vbHRpcHNbb3JkZXJJZF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIFRoZSByZXF1ZXN0ZWQgdG9vbHRpcCBpcyBub3QgbG9hZGVkLCBkbyBub3QgY29udGludWUuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRvb2x0aXBQb3NpdGlvbiA9IF9nZXRUb29sdGlwUG9zaXRpb24oJCh0aGlzKSk7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRQb3NpdGlvbiA9IF9nZXRUYXJnZXRQb3NpdGlvbigkKHRoaXMpKTtcblxuICAgICAgICAgICAgJCh0aGlzKS5xdGlwKHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0b29sdGlwc1tvcmRlcklkXVtldmVudC5kYXRhLm5hbWVdLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdneC1xdGlwIGluZm8nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBteTogdG9vbHRpcFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBhdDogdGFyZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0OiAkKHdpbmRvdyksXG4gICAgICAgICAgICAgICAgICAgIGFkanVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnbm9uZSBzaGlmdCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGlkZToge1xuICAgICAgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDMwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvdzoge1xuICAgICAgICAgICAgICAgICAgICByZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDEwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbjogKGV2ZW50LCBhcGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5kZXN0cm95KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IFRvb2x0aXBzXG4gICAgICAgICAqXG4gICAgICAgICAqIEZldGNoZXMgdGhlIHRvb2x0aXBzIHdpdGggYW4gQUpBWCByZXF1ZXN0LCBiYXNlZCBvbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGFibGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VG9vbHRpcHMoKSB7XG4gICAgICAgICAgICB0b29sdGlwcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZGF0YXRhYmxlc1hoclBhcmFtZXRlcnMgPSAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnBhcmFtcygpO1xuICAgICAgICAgICAgJC5wb3N0KG9wdGlvbnMuc291cmNlVXJsLCBkYXRhdGFibGVzWGhyUGFyYW1ldGVycywgcmVzcG9uc2UgPT4gdG9vbHRpcHMgPSByZXNwb25zZSwgJ2pzb24nKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdkcmF3LmR0JywgX2luaXRUb29sdGlwc0ZvclN0YXRpY0NvbnRlbnQpXG4gICAgICAgICAgICAgICAgLm9uKCd4aHIuZHQnLCBfZ2V0VG9vbHRpcHMpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcudG9vbHRpcC10cmFja2luZy1saW5rcycsIF9vblRyYWNraW5nTGlua3NDbGljayk7XG5cbiAgICAgICAgICAgICQod2luZG93KS5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuRGF0YVRhYmxlKCkuYWpheC5qc29uKCkgIT09IHVuZGVmaW5lZCAmJiB0b29sdGlwcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF9nZXRUb29sdGlwcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBpbiBvcHRpb25zLnNlbGVjdG9ycykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3B0aW9ucy5zZWxlY3RvcnNbZXZlbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm9uKGV2ZW50LCBvcHRpb25zLnNlbGVjdG9yc1tldmVudF1bbmFtZV0sIHtuYW1lfSwgX3Nob3dUb29sdGlwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7Il19
