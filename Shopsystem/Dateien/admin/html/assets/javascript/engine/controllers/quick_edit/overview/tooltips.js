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
 * QuickEdit Table Tooltip
 *
 * This controller displays tooltips for the QuickEdit overview table. The tooltips are loaded after the
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
        sourceUrl: jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/Tooltips',
        selectors: {
            mouseenter: {
                special_price: '.tooltip-products-special-price'
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
     * Initialize tooltip for static table data.
     *
     * Replaces the browsers default tooltip with a qTip instance for every element on the table which has
     * a title attribute.
     */
    function _initTooltipsForStaticContent() {
        $this.find('[title]').qtip({
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

        var productId = $(this).parents('tr').data('id');

        if (!tooltips[productId]) {
            return; // The requested tooltip is not loaded, do not continue.
        }

        var tooltipPosition = _getTooltipPosition($(this));
        var targetPosition = _getTargetPosition($(this));

        $(this).qtip({
            content: tooltips[productId][event.data.name],
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
                delay: 100
            },
            show: {
                ready: true,
                delay: 300
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
        $this.on('draw.dt', _initTooltipsForStaticContent).on('xhr.dt', _getTooltips);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvb3ZlcnZpZXcvdG9vbHRpcHMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsImpzZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsInNvdXJjZVVybCIsImNvcmUiLCJjb25maWciLCJnZXQiLCJzZWxlY3RvcnMiLCJtb3VzZWVudGVyIiwic3BlY2lhbF9wcmljZSIsIm9wdGlvbnMiLCJleHRlbmQiLCJ0b29sdGlwcyIsIl9nZXRUYXJnZXRQb3NpdGlvbiIsIiR0YXJnZXQiLCJob3Jpem9udGFsIiwib2Zmc2V0IiwibGVmdCIsIndpbmRvdyIsInNjcm9sbExlZnQiLCJ3aWR0aCIsInZlcnRpY2FsIiwidG9wIiwic2Nyb2xsVG9wIiwiaGVpZ2h0IiwiX2dldFRvb2x0aXBQb3NpdGlvbiIsIl9pbml0VG9vbHRpcHNGb3JTdGF0aWNDb250ZW50IiwiZmluZCIsInF0aXAiLCJzdHlsZSIsImNsYXNzZXMiLCJfc2hvd1Rvb2x0aXAiLCJldmVudCIsInN0b3BQcm9wYWdhdGlvbiIsInByb2R1Y3RJZCIsInBhcmVudHMiLCJ0b29sdGlwUG9zaXRpb24iLCJ0YXJnZXRQb3NpdGlvbiIsImNvbnRlbnQiLCJuYW1lIiwicG9zaXRpb24iLCJteSIsImF0IiwiZWZmZWN0Iiwidmlld3BvcnQiLCJhZGp1c3QiLCJtZXRob2QiLCJoaWRlIiwiZml4ZWQiLCJkZWxheSIsInNob3ciLCJyZWFkeSIsImV2ZW50cyIsImhpZGRlbiIsImFwaSIsImRlc3Ryb3kiLCJfZ2V0VG9vbHRpcHMiLCJkYXRhdGFibGVzWGhyUGFyYW1ldGVycyIsIkRhdGFUYWJsZSIsImFqYXgiLCJwYXJhbXMiLCJwb3N0IiwicmVzcG9uc2UiLCJpbml0IiwiZG9uZSIsIm9uIiwianNvbiIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFNQUEsR0FBR0MsV0FBSCxDQUFlQyxNQUFmLENBQ0ksVUFESixFQUdJLENBQ09DLElBQUlDLE1BRFgsb0NBRU9ELElBQUlDLE1BRlgsa0NBSEosRUFRSSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBS0EsUUFBTUMsUUFBUUMsRUFBRSxJQUFGLENBQWQ7O0FBRUE7Ozs7O0FBS0EsUUFBTUMsV0FBVztBQUNiQyxtQkFBV04sSUFBSU8sSUFBSixDQUFTQyxNQUFULENBQWdCQyxHQUFoQixDQUFvQixRQUFwQixJQUFnQyxvREFEOUI7QUFFYkMsbUJBQVc7QUFDUEMsd0JBQVk7QUFDUkMsK0JBQWU7QUFEUDtBQURMO0FBRkUsS0FBakI7O0FBU0E7Ozs7O0FBS0EsUUFBTUMsVUFBVVQsRUFBRVUsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CVCxRQUFuQixFQUE2QkgsSUFBN0IsQ0FBaEI7O0FBRUE7Ozs7O0FBS0EsUUFBTUgsU0FBUyxFQUFmOztBQUVBOzs7Ozs7Ozs7QUFTQSxRQUFJZ0IsaUJBQUo7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FBT0EsYUFBU0Msa0JBQVQsQ0FBNEJDLE9BQTVCLEVBQXFDO0FBQ2pDLFlBQU1DLGFBQWFELFFBQVFFLE1BQVIsR0FBaUJDLElBQWpCLEdBQXdCaEIsRUFBRWlCLE1BQUYsRUFBVUMsVUFBVixFQUF4QixHQUFpRGxCLEVBQUVpQixNQUFGLEVBQVVFLEtBQVYsS0FBb0IsQ0FBckUsR0FDYixNQURhLEdBRWIsT0FGTjtBQUdBLFlBQU1DLFdBQVdQLFFBQVFFLE1BQVIsR0FBaUJNLEdBQWpCLEdBQXVCckIsRUFBRWlCLE1BQUYsRUFBVUssU0FBVixFQUF2QixHQUErQ3RCLEVBQUVpQixNQUFGLEVBQVVNLE1BQVYsS0FBcUIsQ0FBcEUsR0FDWCxLQURXLEdBRVgsUUFGTjs7QUFJQSxlQUFPVCxhQUFhLEdBQWIsR0FBbUJNLFFBQTFCO0FBQ0g7O0FBRUQ7Ozs7Ozs7QUFPQSxhQUFTSSxtQkFBVCxDQUE2QlgsT0FBN0IsRUFBc0M7QUFDbEMsWUFBTUMsYUFBYUQsUUFBUUUsTUFBUixHQUFpQkMsSUFBakIsR0FBd0JoQixFQUFFaUIsTUFBRixFQUFVQyxVQUFWLEVBQXhCLEdBQWlEbEIsRUFBRWlCLE1BQUYsRUFBVUUsS0FBVixLQUFvQixDQUFyRSxHQUNiLE9BRGEsR0FFYixNQUZOO0FBR0EsWUFBTUMsV0FBV1AsUUFBUUUsTUFBUixHQUFpQk0sR0FBakIsR0FBdUJyQixFQUFFaUIsTUFBRixFQUFVSyxTQUFWLEVBQXZCLEdBQStDdEIsRUFBRWlCLE1BQUYsRUFBVU0sTUFBVixLQUFxQixDQUFwRSxHQUNYLFFBRFcsR0FFWCxLQUZOOztBQUlBLGVBQU9ULGFBQWEsR0FBYixHQUFtQk0sUUFBMUI7QUFDSDs7QUFFRDs7Ozs7O0FBTUEsYUFBU0ssNkJBQVQsR0FBeUM7QUFDckMxQixjQUFNMkIsSUFBTixDQUFXLFNBQVgsRUFBc0JDLElBQXRCLENBQTJCO0FBQ3ZCQyxtQkFBTyxFQUFDQyxTQUFTLGNBQVY7QUFEZ0IsU0FBM0I7QUFHSDs7QUFFRDs7Ozs7Ozs7O0FBU0EsYUFBU0MsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkI7QUFDekJBLGNBQU1DLGVBQU47O0FBRUEsWUFBTUMsWUFBWWpDLEVBQUUsSUFBRixFQUFRa0MsT0FBUixDQUFnQixJQUFoQixFQUFzQnBDLElBQXRCLENBQTJCLElBQTNCLENBQWxCOztBQUVBLFlBQUksQ0FBQ2EsU0FBU3NCLFNBQVQsQ0FBTCxFQUEwQjtBQUN0QixtQkFEc0IsQ0FDZDtBQUNYOztBQUVELFlBQU1FLGtCQUFrQlgsb0JBQW9CeEIsRUFBRSxJQUFGLENBQXBCLENBQXhCO0FBQ0EsWUFBTW9DLGlCQUFpQnhCLG1CQUFtQlosRUFBRSxJQUFGLENBQW5CLENBQXZCOztBQUVBQSxVQUFFLElBQUYsRUFBUTJCLElBQVIsQ0FBYTtBQUNUVSxxQkFBUzFCLFNBQVNzQixTQUFULEVBQW9CRixNQUFNakMsSUFBTixDQUFXd0MsSUFBL0IsQ0FEQTtBQUVUVixtQkFBTztBQUNIQyx5QkFBUztBQUROLGFBRkU7QUFLVFUsc0JBQVU7QUFDTkMsb0JBQUlMLGVBREU7QUFFTk0sb0JBQUlMLGNBRkU7QUFHTk0sd0JBQVEsS0FIRjtBQUlOQywwQkFBVTNDLEVBQUVpQixNQUFGLENBSko7QUFLTjJCLHdCQUFRO0FBQ0pDLDRCQUFRO0FBREo7QUFMRixhQUxEO0FBY1RDLGtCQUFNO0FBQ0ZDLHVCQUFPLElBREw7QUFFRkMsdUJBQU87QUFGTCxhQWRHO0FBa0JUQyxrQkFBTTtBQUNGQyx1QkFBTyxJQURMO0FBRUZGLHVCQUFPO0FBRkwsYUFsQkc7QUFzQlRHLG9CQUFRO0FBQ0pDLHdCQUFRLGdCQUFDckIsS0FBRCxFQUFRc0IsR0FBUixFQUFnQjtBQUNwQkEsd0JBQUlDLE9BQUosQ0FBWSxJQUFaO0FBQ0g7QUFIRztBQXRCQyxTQUFiO0FBNEJIOztBQUVEOzs7OztBQUtBLGFBQVNDLFlBQVQsR0FBd0I7QUFDcEI1QyxtQkFBVyxFQUFYO0FBQ0EsWUFBTTZDLDBCQUEwQnpELE1BQU0wRCxTQUFOLEdBQWtCQyxJQUFsQixDQUF1QkMsTUFBdkIsRUFBaEM7QUFDQTNELFVBQUU0RCxJQUFGLENBQU9uRCxRQUFRUCxTQUFmLEVBQTBCc0QsdUJBQTFCLEVBQW1EO0FBQUEsbUJBQVk3QyxXQUFXa0QsUUFBdkI7QUFBQSxTQUFuRCxFQUFvRixNQUFwRjtBQUNIOztBQUVEO0FBQ0E7QUFDQTs7QUFFQWxFLFdBQU9tRSxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQmhFLGNBQ0tpRSxFQURMLENBQ1EsU0FEUixFQUNtQnZDLDZCQURuQixFQUVLdUMsRUFGTCxDQUVRLFFBRlIsRUFFa0JULFlBRmxCOztBQUlBdkQsVUFBRWlCLE1BQUYsRUFBVStDLEVBQVYsQ0FBYSx3QkFBYixFQUF1QyxZQUFNO0FBQ3pDLGdCQUFJakUsTUFBTTBELFNBQU4sR0FBa0JDLElBQWxCLENBQXVCTyxJQUF2QixPQUFrQ0MsU0FBbEMsSUFBK0N2RCxhQUFhdUQsU0FBaEUsRUFBMkU7QUFDdkVYO0FBQ0g7QUFDSixTQUpEOztBQU1BLGFBQUssSUFBSXhCLEtBQVQsSUFBa0J0QixRQUFRSCxTQUExQixFQUFxQztBQUNqQyxpQkFBSyxJQUFJZ0MsSUFBVCxJQUFpQjdCLFFBQVFILFNBQVIsQ0FBa0J5QixLQUFsQixDQUFqQixFQUEyQztBQUN2Q2hDLHNCQUFNaUUsRUFBTixDQUFTakMsS0FBVCxFQUFnQnRCLFFBQVFILFNBQVIsQ0FBa0J5QixLQUFsQixFQUF5Qk8sSUFBekIsQ0FBaEIsRUFBZ0QsRUFBQ0EsVUFBRCxFQUFoRCxFQUF3RFIsWUFBeEQ7QUFDSDtBQUNKOztBQUVEaUM7QUFDSCxLQWxCRDs7QUFvQkEsV0FBT3BFLE1BQVA7QUFDSCxDQXpNTCIsImZpbGUiOiJxdWlja19lZGl0L292ZXJ2aWV3L3Rvb2x0aXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiB0b29sdGlwLmpzIDIwMTctMDUtMThcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE3IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4vKipcbiAqIFF1aWNrRWRpdCBUYWJsZSBUb29sdGlwXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGRpc3BsYXlzIHRvb2x0aXBzIGZvciB0aGUgUXVpY2tFZGl0IG92ZXJ2aWV3IHRhYmxlLiBUaGUgdG9vbHRpcHMgYXJlIGxvYWRlZCBhZnRlciB0aGVcbiAqIHRhYmxlIGRhdGEgcmVxdWVzdCBpcyByZWFkeSBmb3Igb3B0aW1pemF0aW9uIHB1cnBvc2VzLlxuICovXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgJ3Rvb2x0aXBzJyxcblxuICAgIFtcbiAgICAgICAgYCR7anNlLnNvdXJjZX0vdmVuZG9yL3F0aXAyL2pxdWVyeS5xdGlwLmNzc2AsXG4gICAgICAgIGAke2pzZS5zb3VyY2V9L3ZlbmRvci9xdGlwMi9qcXVlcnkucXRpcC5qc2BcbiAgICBdLFxuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW9kdWxlIFNlbGVjdG9yXG4gICAgICAgICAqXG4gICAgICAgICAqIEB2YXIge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHNvdXJjZVVybDoganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnL2FkbWluL2FkbWluLnBocD9kbz1RdWlja0VkaXRPdmVydmlld0FqYXgvVG9vbHRpcHMnLFxuICAgICAgICAgICAgc2VsZWN0b3JzOiB7XG4gICAgICAgICAgICAgICAgbW91c2VlbnRlcjoge1xuICAgICAgICAgICAgICAgICAgICBzcGVjaWFsX3ByaWNlOiAnLnRvb2x0aXAtcHJvZHVjdHMtc3BlY2lhbC1wcmljZScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAqXG4gICAgICAgICAqIEB2YXIge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVG9vbHRpcCBDb250ZW50c1xuICAgICAgICAgKlxuICAgICAgICAgKiBDb250YWlucyB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGUgdG9vbHRpcHMuIFRoZSBIVE1MIGlzIHJlbmRlcmVkIHdpdGggZWFjaCB0YWJsZSBkcmF3LlxuICAgICAgICAgKlxuICAgICAgICAgKiBlLmcuIHRvb2x0aXBzLjQwMDIxMC5vcmRlckl0ZW1zID4+IEhUTUwgZm9yIG9yZGVyIGl0ZW1zIHRvb2x0aXAgb2Ygb3JkZXIgIzQwMDIxMC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIGxldCB0b29sdGlwcztcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVGFyZ2V0IFBvc2l0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdGFyZ2V0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9nZXRUYXJnZXRQb3NpdGlvbigkdGFyZ2V0KSB7XG4gICAgICAgICAgICBjb25zdCBob3Jpem9udGFsID0gJHRhcmdldC5vZmZzZXQoKS5sZWZ0IC0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKSA+ICQod2luZG93KS53aWR0aCgpIC8gMlxuICAgICAgICAgICAgICAgID8gJ2xlZnQnXG4gICAgICAgICAgICAgICAgOiAncmlnaHQnO1xuICAgICAgICAgICAgY29uc3QgdmVydGljYWwgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCAtICQod2luZG93KS5zY3JvbGxUb3AoKSA+ICQod2luZG93KS5oZWlnaHQoKSAvIDJcbiAgICAgICAgICAgICAgICA/ICd0b3AnXG4gICAgICAgICAgICAgICAgOiAnYm90dG9tJztcblxuICAgICAgICAgICAgcmV0dXJuIGhvcml6b250YWwgKyAnICcgKyB2ZXJ0aWNhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVG9vbHRpcCBQb3NpdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHRhcmdldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VG9vbHRpcFBvc2l0aW9uKCR0YXJnZXQpIHtcbiAgICAgICAgICAgIGNvbnN0IGhvcml6b250YWwgPSAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpID4gJCh3aW5kb3cpLndpZHRoKCkgLyAyXG4gICAgICAgICAgICAgICAgPyAncmlnaHQnXG4gICAgICAgICAgICAgICAgOiAnbGVmdCc7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0aWNhbCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wIC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gJCh3aW5kb3cpLmhlaWdodCgpIC8gMlxuICAgICAgICAgICAgICAgID8gJ2JvdHRvbSdcbiAgICAgICAgICAgICAgICA6ICd0b3AnO1xuXG4gICAgICAgICAgICByZXR1cm4gaG9yaXpvbnRhbCArICcgJyArIHZlcnRpY2FsO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXRpYWxpemUgdG9vbHRpcCBmb3Igc3RhdGljIHRhYmxlIGRhdGEuXG4gICAgICAgICAqXG4gICAgICAgICAqIFJlcGxhY2VzIHRoZSBicm93c2VycyBkZWZhdWx0IHRvb2x0aXAgd2l0aCBhIHFUaXAgaW5zdGFuY2UgZm9yIGV2ZXJ5IGVsZW1lbnQgb24gdGhlIHRhYmxlIHdoaWNoIGhhc1xuICAgICAgICAgKiBhIHRpdGxlIGF0dHJpYnV0ZS5cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIF9pbml0VG9vbHRpcHNGb3JTdGF0aWNDb250ZW50KCkge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnW3RpdGxlXScpLnF0aXAoe1xuICAgICAgICAgICAgICAgIHN0eWxlOiB7Y2xhc3NlczogJ2d4LXF0aXAgaW5mbyd9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG93IFRvb2x0aXBcbiAgICAgICAgICpcbiAgICAgICAgICogRGlzcGxheSB0aGUgUXRpcCBpbnN0YW5jZSBvZiB0aGUgdGFyZ2V0LiBUaGUgdG9vbHRpcCBjb250ZW50cyBhcmUgZmV0Y2hlZCBhZnRlciB0aGUgdGFibGUgcmVxdWVzdFxuICAgICAgICAgKiBpcyBmaW5pc2hlZCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy4gVGhpcyBtZXRob2Qgd2lsbCBub3Qgc2hvdyBhbnl0aGluZyB1bnRpbCB0aGUgdG9vbHRpcCBjb250ZW50c1xuICAgICAgICAgKiBhcmUgZmV0Y2hlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnkuRXZlbnR9IGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfc2hvd1Rvb2x0aXAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0SWQgPSAkKHRoaXMpLnBhcmVudHMoJ3RyJykuZGF0YSgnaWQnKTtcblxuICAgICAgICAgICAgaWYgKCF0b29sdGlwc1twcm9kdWN0SWRdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBUaGUgcmVxdWVzdGVkIHRvb2x0aXAgaXMgbm90IGxvYWRlZCwgZG8gbm90IGNvbnRpbnVlLlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b29sdGlwUG9zaXRpb24gPSBfZ2V0VG9vbHRpcFBvc2l0aW9uKCQodGhpcykpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0UG9zaXRpb24gPSBfZ2V0VGFyZ2V0UG9zaXRpb24oJCh0aGlzKSk7XG5cbiAgICAgICAgICAgICQodGhpcykucXRpcCh7XG4gICAgICAgICAgICAgICAgY29udGVudDogdG9vbHRpcHNbcHJvZHVjdElkXVtldmVudC5kYXRhLm5hbWVdLFxuICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdneC1xdGlwIGluZm8nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICBteTogdG9vbHRpcFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBhdDogdGFyZ2V0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0OiAkKHdpbmRvdyksXG4gICAgICAgICAgICAgICAgICAgIGFkanVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnbm9uZSBzaGlmdCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGlkZToge1xuICAgICAgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDEwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvdzoge1xuICAgICAgICAgICAgICAgICAgICByZWFkeTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGVsYXk6IDMwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbjogKGV2ZW50LCBhcGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5kZXN0cm95KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IFRvb2x0aXBzXG4gICAgICAgICAqXG4gICAgICAgICAqIEZldGNoZXMgdGhlIHRvb2x0aXBzIHdpdGggYW4gQUpBWCByZXF1ZXN0LCBiYXNlZCBvbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgdGFibGUuXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBfZ2V0VG9vbHRpcHMoKSB7XG4gICAgICAgICAgICB0b29sdGlwcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZGF0YXRhYmxlc1hoclBhcmFtZXRlcnMgPSAkdGhpcy5EYXRhVGFibGUoKS5hamF4LnBhcmFtcygpO1xuICAgICAgICAgICAgJC5wb3N0KG9wdGlvbnMuc291cmNlVXJsLCBkYXRhdGFibGVzWGhyUGFyYW1ldGVycywgcmVzcG9uc2UgPT4gdG9vbHRpcHMgPSByZXNwb25zZSwgJ2pzb24nKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzXG4gICAgICAgICAgICAgICAgLm9uKCdkcmF3LmR0JywgX2luaXRUb29sdGlwc0ZvclN0YXRpY0NvbnRlbnQpXG4gICAgICAgICAgICAgICAgLm9uKCd4aHIuZHQnLCBfZ2V0VG9vbHRpcHMpO1xuXG4gICAgICAgICAgICAkKHdpbmRvdykub24oJ0pTRU5HSU5FX0lOSVRfRklOSVNIRUQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCR0aGlzLkRhdGFUYWJsZSgpLmFqYXguanNvbigpICE9PSB1bmRlZmluZWQgJiYgdG9vbHRpcHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBfZ2V0VG9vbHRpcHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnQgaW4gb3B0aW9ucy5zZWxlY3RvcnMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG9wdGlvbnMuc2VsZWN0b3JzW2V2ZW50XSkge1xuICAgICAgICAgICAgICAgICAgICAkdGhpcy5vbihldmVudCwgb3B0aW9ucy5zZWxlY3RvcnNbZXZlbnRdW25hbWVdLCB7bmFtZX0sIF9zaG93VG9vbHRpcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9XG4pOyJdfQ==
