'use strict';

/* --------------------------------------------------------------
 tooltip.js 2017-05-18
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Invoices Table Tooltip
 *
 * This controller displays tooltips for the invoices overview table. The tooltips are loaded after the
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
        sourceUrl: jse.core.config.get('appUrl') + '/admin/admin.php?do=InvoicesOverviewAjax/Tooltips',
        selectors: {
            mouseenter: {
                invoiceItems: '.tooltip-invoice-items',
                customerMemos: '.tooltip-customer-memos',
                customerAddresses: '.tooltip-customer-addresses',
                orderStatusHistory: '.tooltip-invoice-status-history'
            },
            click: {
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
     * e.g. tooltips.400210.invoiceItems >> HTML for invoice items tooltip of invoice #400210.
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

        var invoiceId = $(this).parents('tr').data('invoiceId');

        if (!tooltips[invoiceId]) {
            return; // The requested tooltip is not loaded, do not continue.
        }

        var tooltipPosition = _getTooltipPosition($(this));
        var targetPosition = _getTargetPosition($(this));

        $(this).qtip({
            content: tooltips[invoiceId][event.data.name],
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludm9pY2VzL292ZXJ2aWV3L3Rvb2x0aXBzLmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJqc2UiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJzb3VyY2VVcmwiLCJjb3JlIiwiY29uZmlnIiwiZ2V0Iiwic2VsZWN0b3JzIiwibW91c2VlbnRlciIsImludm9pY2VJdGVtcyIsImN1c3RvbWVyTWVtb3MiLCJjdXN0b21lckFkZHJlc3NlcyIsIm9yZGVyU3RhdHVzSGlzdG9yeSIsImNsaWNrIiwidHJhY2tpbmdMaW5rcyIsIm9wdGlvbnMiLCJleHRlbmQiLCJ0b29sdGlwcyIsIl9nZXRUYXJnZXRQb3NpdGlvbiIsIiR0YXJnZXQiLCJob3Jpem9udGFsIiwib2Zmc2V0IiwibGVmdCIsIndpbmRvdyIsInNjcm9sbExlZnQiLCJ3aWR0aCIsInZlcnRpY2FsIiwidG9wIiwic2Nyb2xsVG9wIiwiaGVpZ2h0IiwiX2dldFRvb2x0aXBQb3NpdGlvbiIsIl9vblRyYWNraW5nTGlua3NDbGljayIsInBhcmVudHMiLCJsZW5ndGgiLCJvcGVuIiwiX2luaXRUb29sdGlwc0ZvclN0YXRpY0NvbnRlbnQiLCJmaW5kIiwicXRpcCIsInN0eWxlIiwiY2xhc3NlcyIsIl9zaG93VG9vbHRpcCIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiaW52b2ljZUlkIiwidG9vbHRpcFBvc2l0aW9uIiwidGFyZ2V0UG9zaXRpb24iLCJjb250ZW50IiwibmFtZSIsInBvc2l0aW9uIiwibXkiLCJhdCIsImVmZmVjdCIsInZpZXdwb3J0IiwiYWRqdXN0IiwibWV0aG9kIiwiaGlkZSIsImZpeGVkIiwiZGVsYXkiLCJzaG93IiwicmVhZHkiLCJldmVudHMiLCJoaWRkZW4iLCJhcGkiLCJkZXN0cm95IiwiX2dldFRvb2x0aXBzIiwiZGF0YXRhYmxlc1hoclBhcmFtZXRlcnMiLCJEYXRhVGFibGUiLCJhamF4IiwicGFyYW1zIiwicG9zdCIs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LElBQUYsQ0FBT3RELFFBQVFaLFNBQWYsRUFBMEI4RCx1QkFBMUIsRUFBbUQ7QUFBQSxtQkFBWWhELFdBQVdxRCxRQUF2QjtBQUFBLFNBQW5ELEVBQW9GLE1BQXBGO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBOztBQUVBMUUsV0FBTzJFLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCeEUsY0FDS3lFLEVBREwsQ0FDUSxTQURSLEVBQ21CdEMsNkJBRG5CLEVBRUtzQyxFQUZMLENBRVEsUUFGUixFQUVrQlQsWUFGbEIsRUFHS1MsRUFITCxDQUdRLE9BSFIsRUFHaUIseUJBSGpCLEVBRzRDMUMscUJBSDVDOztBQUtBOUIsVUFBRXNCLE1BQUYsRUFBVWtELEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFNO0FBQ3pDLGdCQUFJekUsTUFBTWtFLFNBQU4sR0FBa0JDLElBQWxCLENBQXVCTyxJQUF2QixPQUFrQ0MsU0FBbEMsSUFBK0MxRCxhQUFhMEQsU0FBaEUsRUFBMkU7QUFDdkVYO0FBQ0g7QUFDSixTQUpEOztBQU1BLGFBQUssSUFBSXZCLEtBQVQsSUFBa0IxQixRQUFRUixTQUExQixFQUFxQztBQUNqQyxpQkFBSyxJQUFJd0MsSUFBVCxJQUFpQmhDLFFBQVFSLFNBQVIsQ0FBa0JrQyxLQUFsQixDQUFqQixFQUEyQztBQUN2Q3pDLHNCQUFNeUUsRUFBTixDQUFTaEMsS0FBVCxFQUFnQjFCLFFBQVFSLFNBQVIsQ0FBa0JrQyxLQUFsQixFQUF5Qk0sSUFBekIsQ0FBaEIsRUFBZ0QsRUFBQ0EsVUFBRCxFQUFoRCxFQUF3RFAsWUFBeEQ7QUFDSDtBQUNKOztBQUVEZ0M7QUFDSCxLQW5CRDs7QUFxQkEsV0FBTzVFLE1BQVA7QUFDSCxDQTNOTCIsImZpbGUiOiJpbnZvaWNlcy9vdmVydmlldy90b29sdGlwcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gdG9vbHRpcC5qcyAyMDE3LTA1LTE4XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNyBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiBJbnZvaWNlcyBUYWJsZSBUb29sdGlwXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGRpc3BsYXlzIHRvb2x0aXBzIGZvciB0aGUgaW52b2ljZXMgb3ZlcnZpZXcgdGFibGUuIFRoZSB0b29sdGlwcyBhcmUgbG9hZGVkIGFmdGVyIHRoZVxuICogdGFibGUgZGF0YSByZXF1ZXN0IGlzIHJlYWR5IGZvciBvcHRpbWl6YXRpb24gcHVycG9zZXMuXG4gKi9cbmd4LmNvbnRyb2xsZXJzLm1vZHVsZShcbiAgICAndG9vbHRpcHMnLFxuXG4gICAgW1xuICAgICAgICBgJHtqc2Uuc291cmNlfS92ZW5kb3IvcXRpcDIvanF1ZXJ5LnF0aXAuY3NzYCxcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL3F0aXAyL2pxdWVyeS5xdGlwLmpzYFxuICAgIF0sXG5cbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gVkFSSUFCTEVTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICpcbiAgICAgICAgICogQHZhciB7alF1ZXJ5fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgc291cmNlVXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPUludm9pY2VzT3ZlcnZpZXdBamF4L1Rvb2x0aXBzJyxcbiAgICAgICAgICAgIHNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgIG1vdXNlZW50ZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZUl0ZW1zOiAnLnRvb2x0aXAtaW52b2ljZS1pdGVtcycsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyTWVtb3M6ICcudG9vbHRpcC1jdXN0b21lci1tZW1vcycsXG4gICAgICAgICAgICAgICAgICAgIGN1c3RvbWVyQWRkcmVzc2VzOiAnLnRvb2x0aXAtY3VzdG9tZXItYWRkcmVzc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJTdGF0dXNIaXN0b3J5OiAnLnRvb2x0aXAtaW52b2ljZS1zdGF0dXMtaGlzdG9yeScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbGljazoge1xuICAgICAgICAgICAgICAgICAgICB0cmFja2luZ0xpbmtzOiAnLnRvb2x0aXAtdHJhY2tpbmctbGlua3MnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB2YXIge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9vbHRpcCBDb250ZW50c1xuICAgICAgICAgKlxuICAgICAgICAgKiBDb250YWlucyB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGUgdG9vbHRpcHMuIFRoZSBIVE1MIGlzIHJlbmRlcmVkIHdpdGggZWFjaCB0YWJsZSBkcmF3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBlLmcuIHRvb2x0aXBzLjQwMDIxMC5pbnZvaWNlSXRlbXMgPj4gSFRNTCBmb3IgaW52b2ljZSBpdGVtcyB0b29sdGlwIG9mIGludm9pY2UgIzQwMDIxMC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCB0b29sdGlwcztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVGFyZ2V0IFBvc2l0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRUYXJnZXRQb3NpdGlvbigkdGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBob3Jpem9udGFsID0gJHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKSA+ICQod2luZG93KS53aWR0aCgpIC8gMlxuICAgICAgICAgICAgICAgID8gJ2xlZnQnXG4gICAgICAgICAgICAgICAgOiAncmlnaHQnO1xuICAgICAgICAgICAgY29uc3QgdmVydGljYWwgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSA+ICQod2luZG93KS5oZWlnaHQoKSAvIDJcbiAgICAgICAgICAgICAgICA/ICd0b3AnXG4gICAgICAgICAgICAgICAgOiAnYm90dG9tJztcblxuICAgICAgICAgICAgcmV0dXJuIGhvcml6b250YWwgKyAnICcgKyB2ZXJ0aWNhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVG9vbHRpcCBQb3NpdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhcmdldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VG9vbHRpcFBvc2l0aW9uKCR0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGhvcml6b250YWwgPSAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpID4gJCh3aW5kb3cpLndpZHRoKCkgLyAyXG4gICAgICAgICAgICAgICAgPyAncmlnaHQnXG4gICAgICAgICAgICAgICAgOiAnbGVmdCc7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0aWNhbCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gJCh3aW5kb3cpLmhlaWdodCgpIC8gMlxuICAgICAgICAgICAgICAgID8gJ2JvdHRvbSdcbiAgICAgICAgICAgICAgICA6ICd0b3AnO1xuXG4gICAgICAgICAgICByZXR1cm4gaG9yaXpvbnRhbCArICcgJyArIHZlcnRpY2FsO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIHRoZXJlIGlzIG9ubHkgb25lIGxpbmsgdGhlbiBvcGVuIGl0IGluIGEgbmV3IHRhYi5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9vblRyYWNraW5nTGlua3NDbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWNraW5nTGlua3MgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgndHJhY2tpbmdMaW5rcycpO1xuXG4gICAgICAgICAgICBpZiAodHJhY2tpbmdMaW5rcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cub3Blbih0cmFja2luZ0xpbmtzWzBdLCAnX2JsYW5rJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdGlhbGl6ZSB0b29sdGlwIGZvciBzdGF0aWMgdGFibGUgZGF0YS5cbiAgICAgICAgICpcbiAgICAgICAgICogUmVwbGFjZXMgdGhlIGJyb3dzZXJzIGRlZmF1bHQgdG9vbHRpcCB3aXRoIGEgcVRpcCBpbnN0YW5jZSBmb3IgZXZlcnkgZWxlbWVudCBvbiB0aGUgdGFibGUgd2hpY2ggaGFzXG4gICAgICAgICAqIGEgdGl0bGUgYXR0cmlidXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gX2luaXRUb29sdGlwc0ZvclN0YXRpY0NvbnRlbnQoKSB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKCd0Ym9keSBbdGl0bGVdJykucXRpcCh7XG4gICAgICAgICAgICAgICAgc3R5bGU6IHtjbGFzc2VzOiAnZ3gtcXRpcCBpbmZvJ31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3cgVG9vbHRpcFxuICAgICAgICAgKlxuICAgICAgICAgKiBEaXNwbGF5IHRoZSBRdGlwIGluc3RhbmNlIG9mIHRoZSB0YXJnZXQuIFRoZSB0b29sdGlwIGNvbnRlbnRzIGFyZSBmZXRjaGVkIGFmdGVyIHRoZSB0YWJsZSByZXF1ZXN0XG4gICAgICAgICAqIGlzIGZpbmlzaGVkIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBzaG93IGFueXRoaW5nIHVudGlsIHRoZSB0b29sdGlwIGNvbnRlbnRzXG4gICAgICAgICAqIGFyZSBmZXRjaGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeS5FdmVudH0gZXZlbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9zaG93VG9vbHRpcChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGludm9pY2VJZCA9ICQodGhpcykucGFyZW50cygndHInKS5kYXRhKCdpbnZvaWNlSWQnKTtcblxuICAgICAgICAgICAgaWYgKCF0b29sdGlwc1tpbnZvaWNlSWRdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBUaGUgcmVxdWVzdGVkIHRvb2x0aXAgaXMgbm90IGxvYWRlZCwgZG8gbm90IGNvbnRpbnVlLlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b29sdGlwUG9zaXRpb24gPSBfZ2V0VG9vbHRpcFBvc2l0aW9uKCQodGhpcykpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UG9zaXRpb24gPSBfZ2V0VGFyZ2V0UG9zaXRpb24oJCh0aGlzKSk7XG5cbiAgICAgICAgICAgICQodGhpcykucXRpcCh7XG4gICAgICAgICAgICAgICAgY29udGVudDogdG9vbHRpcHNbaW52b2ljZUlkXVtldmVudC5kYXRhLm5hbWVdLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdneC1xdGlwIGluZm8nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBteTogdG9vbHRpcFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBhdDogdGFyZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0OiAkKHdpbmRvdyksXG4gICAgICAgICAgICAgICAgICAgIGFkanVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnbm9uZSBzaGlmdCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGlkZToge1xuICAgICAgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDMwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvdzoge1xuICAgICAgICAgICAgICAgICAgICByZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDEwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbjogKGV2ZW50LCBhcGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5kZXN0cm95KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IFRvb2x0aXBzXG4gICAgICAgICAqXG4gICAgICAgICAqIEZldGNoZXMgdGhlIHRvb2x0aXBzIHdpdGggYW4gQUpBWCByZXF1ZXN0LCBiYXNlZCBvbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGFibGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VG9vbHRpcHMoKSB7XG4gICAgICAgICAgICB0b29sdGlwcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZGF0YXRhYmxlc1hoclBhcmFtZXRlcnMgPSAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnBhcmFtcygpO1xuICAgICAgICAgICAgJC5wb3N0KG9wdGlvbnMuc291cmNlVXJsLCBkYXRhdGFibGVzWGhyUGFyYW1ldGVycywgcmVzcG9uc2UgPT4gdG9vbHRpcHMgPSByZXNwb25zZSwgJ2pzb24nKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdkcmF3LmR0JywgX2luaXRUb29sdGlwc0ZvclN0YXRpY0NvbnRlbnQpXG4gICAgICAgICAgICAgICAgLm9uKCd4aHIuZHQnLCBfZ2V0VG9vbHRpcHMpXG4gICAgICAgICAgICAgICAgLm9uKCdjbGljaycsICcudG9vbHRpcC10cmFja2luZy1saW5rcycsIF9vblRyYWNraW5nTGlua3NDbGljayk7XG5cbiAgICAgICAgICAgICQod2luZG93KS5vbignSlNFTkdJTkVfSU5JVF9GSU5JU0hFRCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoJHRoaXMuRGF0YVRhYmxlKCkuYWpheC5qc29uKCkgIT09IHVuZGVmaW5lZCAmJiB0b29sdGlwcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF9nZXRUb29sdGlwcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBldmVudCBpbiBvcHRpb25zLnNlbGVjdG9ycykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gb3B0aW9ucy5zZWxlY3RvcnNbZXZlbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm9uKGV2ZW50LCBvcHRpb25zLnNlbGVjdG9yc1tldmVudF1bbmFtZV0sIHtuYW1lfSwgX3Nob3dUb29sdGlwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7Il19
