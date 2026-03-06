'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------------------------------------------------------
 orders_tooltip.js 2015-10-02
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Order Tooltip
 *
 * This controller displays a tooltip when hovering the order
 *
 * @module Controllers/orders_tooltip
 */
gx.controllers.module('orders_tooltip', [],

/**  @lends module:Controllers/orders_tooltip */

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
     * Default Options
     *
     * @type {object}
     */
    defaults = {
        'url': ''
    },


    /**
     * timeout for tooltip assignment
     *
     * @type {boolean}
     */
    timeout = 0,


    /**
     * delay until tooltip appears
     *
     * @type {number}
     */
    delay = 300,


    /**
     * flag, if element is hoverd
     *
     * @type {boolean}
     */
    hoverd = true,


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
    // PRIVATE METHODS
    // ------------------------------------------------------------------------

    var _loadOrderData = function _loadOrderData() {
        if (options.url !== '') {
            $.ajax({
                url: options.url,
                type: 'GET',
                dataType: 'json',
                success: function success(response) {
                    var content = '<table>';

                    for (var id in response.products) {
                        var product = response.products[id];
                        content += '<tr>';

                        for (var key in product) {

                            if (_typeof(product[key]) !== 'object') {

                                var align = key === 'price' ? ' align="right"' : '';

                                content += '<td valign="top"' + align + '>' + product[key];

                                if (key === 'name') {
                                    for (var i in product.attributes) {
                                        content += '<br />- ' + product.attributes[i].name;
                                        content += ': ' + product.attributes[i].value;
                                    }
                                }

                                content += '</td>';
                            }
                        }

                        content += '</tr>';
                    }

                    content += '<tr><td class="total_price" colspan="4" align="right">' + response.total_price + '</td></tr>';

                    content += '</table>';

                    timeout = window.setTimeout(function () {
                        $this.qtip({
                            content: content,
                            style: {
                                classes: 'gx-container gx-qtip info large'
                            },
                            position: {
                                my: 'left top',
                                at: 'right bottom'
                            },
                            show: {
                                when: false,
                                ready: hoverd,
                                delay: delay
                            },
                            hide: {
                                fixed: true
                            }
                        });

                        options.url = '';
                    }, delay);
                }
            });
        }
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('hover', _loadOrderData);
        $this.on('mouseout', function () {
            hoverd = false;
            clearTimeout(timeout);
        });

        // Finish it
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcnNfdG9vbHRpcC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwidGltZW91dCIsImRlbGF5IiwiaG92ZXJkIiwib3B0aW9ucyIsImV4dGVuZCIsIl9sb2FkT3JkZXJEYXRhIiwidXJsIiwiYWpheCIsInR5cGUiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImNvbnRlbnQiLCJpZCIsInByb2R1Y3RzIiwicHJvZHVjdCIsImtleSIsImFsaWduIiwiaSIsImF0dHJpYnV0ZXMiLCJuYW1lIiwidmFsdWUiLCJ0b3RhbF9wcmljZSIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJxdGlwIiwic3R5bGUiLCJjbGFzc2VzIiwicG9zaXRpb24iLCJteSIsImF0Iiwic2hvdyIsIndoZW4iLCJyZWFkeSIsImhpZGUiLCJmaXhlZCIsImluaXQiLCJkb25lIiwib24iLCJjbGVhclRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUNJLGdCQURKLEVBR0ksRUFISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVc7QUFDUCxlQUFPO0FBREEsS0FiZjs7O0FBaUJJOzs7OztBQUtBQyxjQUFVLENBdEJkOzs7QUF3Qkk7Ozs7O0FBS0FDLFlBQVEsR0E3Qlo7OztBQStCSTs7Ozs7QUFLQUMsYUFBUyxJQXBDYjs7O0FBc0NJOzs7OztBQUtBQyxjQUFVTCxFQUFFTSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUJMLFFBQW5CLEVBQTZCSCxJQUE3QixDQTNDZDs7O0FBNkNJOzs7OztBQUtBRCxhQUFTLEVBbERiOztBQW9EQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSVUsaUJBQWlCLFNBQWpCQSxjQUFpQixHQUFZO0FBQzdCLFlBQUlGLFFBQVFHLEdBQVIsS0FBZ0IsRUFBcEIsRUFBd0I7QUFDcEJSLGNBQUVTLElBQUYsQ0FBTztBQUNIRCxxQkFBS0gsUUFBUUcsR0FEVjtBQUVIRSxzQkFBTSxLQUZIO0FBR0hDLDBCQUFVLE1BSFA7QUFJSEMseUJBQVMsaUJBQVVDLFFBQVYsRUFBb0I7QUFDekIsd0JBQUlDLFVBQVUsU0FBZDs7QUFFQSx5QkFBSyxJQUFJQyxFQUFULElBQWVGLFNBQVNHLFFBQXhCLEVBQWtDO0FBQzlCLDRCQUFJQyxVQUFVSixTQUFTRyxRQUFULENBQWtCRCxFQUFsQixDQUFkO0FBQ0FELG1DQUFXLE1BQVg7O0FBRUEsNkJBQUssSUFBSUksR0FBVCxJQUFnQkQsT0FBaEIsRUFBeUI7O0FBRXJCLGdDQUFJLFFBQU9BLFFBQVFDLEdBQVIsQ0FBUCxNQUF3QixRQUE1QixFQUFzQzs7QUFFbEMsb0NBQUlDLFFBQVNELFFBQVEsT0FBVCxHQUFvQixnQkFBcEIsR0FBdUMsRUFBbkQ7O0FBRUFKLDJDQUFXLHFCQUFxQkssS0FBckIsR0FBNkIsR0FBN0IsR0FBbUNGLFFBQVFDLEdBQVIsQ0FBOUM7O0FBRUEsb0NBQUlBLFFBQVEsTUFBWixFQUFvQjtBQUNoQix5Q0FBSyxJQUFJRSxDQUFULElBQWNILFFBQVFJLFVBQXRCLEVBQWtDO0FBQzlCUCxtREFBVyxhQUFhRyxRQUFRSSxVQUFSLENBQW1CRCxDQUFuQixFQUFzQkUsSUFBOUM7QUFDQVIsbURBQVcsT0FBT0csUUFBUUksVUFBUixDQUFtQkQsQ0FBbkIsRUFBc0JHLEtBQXhDO0FBQ0g7QUFDSjs7QUFFRFQsMkNBQVcsT0FBWDtBQUNIO0FBQ0o7O0FBRURBLG1DQUFXLE9BQVg7QUFDSDs7QUFFREEsK0JBQ0ksMkRBQTJERCxTQUFTVyxXQUFwRSxHQUNBLFlBRko7O0FBSUFWLCtCQUFXLFVBQVg7O0FBRUFaLDhCQUFVdUIsT0FBT0MsVUFBUCxDQUFrQixZQUFZO0FBQ3BDM0IsOEJBQU00QixJQUFOLENBQVc7QUFDUGIscUNBQVNBLE9BREY7QUFFUGMsbUNBQU87QUFDSEMseUNBQVM7QUFETiw2QkFGQTtBQUtQQyxzQ0FBVTtBQUNOQyxvQ0FBSSxVQURFO0FBRU5DLG9DQUFJO0FBRkUsNkJBTEg7QUFTUEMsa0NBQU07QUFDRkMsc0NBQU0sS0FESjtBQUVGQyx1Q0FBTy9CLE1BRkw7QUFHRkQsdUNBQU9BO0FBSEwsNkJBVEM7QUFjUGlDLGtDQUFNO0FBQ0ZDLHVDQUFPO0FBREw7QUFkQyx5QkFBWDs7QUFtQkFoQyxnQ0FBUUcsR0FBUixHQUFjLEVBQWQ7QUFDSCxxQkFyQlMsRUFxQlBMLEtBckJPLENBQVY7QUFzQkg7QUE3REUsYUFBUDtBQStESDtBQUNKLEtBbEVEOztBQW9FQTtBQUNBO0FBQ0E7O0FBRUFOLFdBQU95QyxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnhDLGNBQU15QyxFQUFOLENBQVMsT0FBVCxFQUFrQmpDLGNBQWxCO0FBQ0FSLGNBQU15QyxFQUFOLENBQVMsVUFBVCxFQUFxQixZQUFZO0FBQzdCcEMscUJBQVMsS0FBVDtBQUNBcUMseUJBQWF2QyxPQUFiO0FBQ0gsU0FIRDs7QUFLQTtBQUNBcUM7QUFDSCxLQVREOztBQVdBLFdBQU8xQyxNQUFQO0FBQ0gsQ0EzSkwiLCJmaWxlIjoib3JkZXJzL29yZGVyc190b29sdGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBvcmRlcnNfdG9vbHRpcC5qcyAyMDE1LTEwLTAyXG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBPcmRlciBUb29sdGlwXG4gKlxuICogVGhpcyBjb250cm9sbGVyIGRpc3BsYXlzIGEgdG9vbHRpcCB3aGVuIGhvdmVyaW5nIHRoZSBvcmRlclxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvb3JkZXJzX3Rvb2x0aXBcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdvcmRlcnNfdG9vbHRpcCcsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb250cm9sbGVycy9vcmRlcnNfdG9vbHRpcCAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAndXJsJzogJydcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogdGltZW91dCBmb3IgdG9vbHRpcCBhc3NpZ25tZW50XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRpbWVvdXQgPSAwLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGRlbGF5IHVudGlsIHRvb2x0aXAgYXBwZWFyc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlbGF5ID0gMzAwLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGZsYWcsIGlmIGVsZW1lbnQgaXMgaG92ZXJkXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGhvdmVyZCA9IHRydWUsXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBQUklWQVRFIE1FVEhPRFNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9sb2FkT3JkZXJEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMudXJsICE9PSAnJykge1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogb3B0aW9ucy51cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gJzx0YWJsZT4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpZCBpbiByZXNwb25zZS5wcm9kdWN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gcmVzcG9uc2UucHJvZHVjdHNbaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgKz0gJzx0cj4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb2R1Y3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb2R1Y3Rba2V5XSAhPT0gJ29iamVjdCcpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsaWduID0gKGtleSA9PT0gJ3ByaWNlJykgPyAnIGFsaWduPVwicmlnaHRcIicgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSAnPHRkIHZhbGlnbj1cInRvcFwiJyArIGFsaWduICsgJz4nICsgcHJvZHVjdFtrZXldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnbmFtZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHByb2R1Y3QuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9ICc8YnIgLz4tICcgKyBwcm9kdWN0LmF0dHJpYnV0ZXNbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSAnOiAnICsgcHJvZHVjdC5hdHRyaWJ1dGVzW2ldLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSAnPC90ZD4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCArPSAnPC90cj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzx0cj48dGQgY2xhc3M9XCJ0b3RhbF9wcmljZVwiIGNvbHNwYW49XCI0XCIgYWxpZ249XCJyaWdodFwiPicgKyByZXNwb25zZS50b3RhbF9wcmljZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+PC90cj4nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50ICs9ICc8L3RhYmxlPic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMucXRpcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzOiAnZ3gtY29udGFpbmVyIGd4LXF0aXAgaW5mbyBsYXJnZSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15OiAnbGVmdCB0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXQ6ICdyaWdodCBib3R0b20nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoZW46IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZHk6IGhvdmVyZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5OiBkZWxheVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXhlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnVybCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLm9uKCdob3ZlcicsIF9sb2FkT3JkZXJEYXRhKTtcbiAgICAgICAgICAgICR0aGlzLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBob3ZlcmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gRmluaXNoIGl0XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
