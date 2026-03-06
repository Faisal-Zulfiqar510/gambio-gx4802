'use strict';

/* --------------------------------------------------------------
 order_customizer.js 2017-05-24 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Orders Modal Layer Module
 *
 * This module will open a modal layer for order actions like deleting or changing the oder status.
 *
 * @module Compatibility/order_customizer
 */
gx.compatibility.module('order_customizer', [],

/**  @lends module:Compatibility/order_customizer */

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
    // PRIVATE FUNCTIONS
    // ------------------------------------------------------------------------

    var _openCustomizerSet = function _openCustomizerSet(event) {

        var $customizer = $(options.selector);

        $('select[id^="element_"]').each(function (j) {
            var attr_id = $(this).attr('id');
            var attr_class = $(this).attr('class');
            var attr_name = $(this).attr('name');
            var attr_style = $(this).attr('style');
            var attr_value = $(this).children('option').val();

            $(this).replaceWith('<input type="text" name="' + attr_name + '" id="' + attr_id + '" class="' + attr_class + '" style="' + attr_style + '" value="' + attr_value + '">');
        });

        //event.preventDefault();
        //event.stopPropagation();
        $customizer.dialog({
            'title': jse.core.lang.translate('HEADING_GX_CUSTOMIZER', 'orders'),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': [{
                'text': jse.core.lang.translate('save', 'buttons'),
                'class': 'btn',
                'click': function click() {
                    var content_div = $customizer.children('[id^="gm_gprint_content"]');
                    var _error = false;
                    content_div.children('[id^="surface_"]').each(function (i) {
                        var surface_id = $(this).attr('id');
                        var inputs = {};
                        var container_div = $(this).children('[id^="element_container_"]');

                        container_div.children('input[id^="element_"]').each(function (j) {
                            var input_id = $(this).attr('id');
                            var input = {};
                            input.id = input_id.substring(input_id.lastIndexOf('_') + 1);
                            input.value = $(this).val();
                            inputs[input_id] = input;
                        });
                        container_div.children('textarea[id^="element_"]').each(function (j) {
                            var input_id = $(this).attr('id');
                            var input = {};
                            input.id = input_id.substring(input_id.lastIndexOf('_') + 1);
                            input.value = $(this).val();
                            inputs[input_id] = input;
                        });

                        if (Object.keys(inputs).length > 0) {
                            $.ajax({
                                type: 'POST',
                                url: 'request_port.php?module=GPrintOrder&action=save_surfaces_group_inputs',
                                dataType: 'json',
                                context: this,
                                async: false,
                                data: {
                                    "inputs": inputs,
                                    "surface_id": surface_id.substring(surface_id.lastIndexOf('_') + 1)
                                },
                                success: function success() {
                                    console.log('gut');
                                },
                                error: function error() {
                                    console.log('error');
                                    _error = true;
                                }
                            });
                        }
                    });

                    if (_error) {
                        alert(jse.core.lang.translate('GM_GPRINT_SAVE_FAILED', 'admin_gm_gprint'));
                    } else {
                        alert(jse.core.lang.translate('GM_GPRINT_SAVE_SUCCESSFULL', 'admin_gm_gprint'));
                    }
                }
            }, {
                'text': jse.core.lang.translate('close', 'buttons'),
                'class': 'btn',
                'click': function click() {
                    $(this).dialog('close');
                }
            }],
            'width': 420,
            open: function open() {
                this.style.overflow = '';
            }
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', _openCustomizerSet);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZGVycy9vcmRlcl9jdXN0b21pemVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfb3BlbkN1c3RvbWl6ZXJTZXQiLCJldmVudCIsIiRjdXN0b21pemVyIiwic2VsZWN0b3IiLCJlYWNoIiwiaiIsImF0dHJfaWQiLCJhdHRyIiwiYXR0cl9jbGFzcyIsImF0dHJfbmFtZSIsImF0dHJfc3R5bGUiLCJhdHRyX3ZhbHVlIiwiY2hpbGRyZW4iLCJ2YWwiLCJyZXBsYWNlV2l0aCIsImRpYWxvZyIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiY2xpY2siLCJjb250ZW50X2RpdiIsImVycm9yIiwiaSIsInN1cmZhY2VfaWQiLCJpbnB1dHMiLCJjb250YWluZXJfZGl2IiwiaW5wdXRfaWQiLCJpbnB1dCIsImlkIiwic3Vic3RyaW5nIiwibGFzdEluZGV4T2YiLCJ2YWx1ZSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJhamF4IiwidHlwZSIsInVybCIsImRhdGFUeXBlIiwiY29udGV4dCIsImFzeW5jIiwic3VjY2VzcyIsImNvbnNvbGUiLCJsb2ciLCJhbGVydCIsIm9wZW4iLCJzdHlsZSIsIm92ZXJmbG93IiwiaW5pdCIsImRvbmUiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksa0JBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7Ozs7QUFLQUMsZUFBVyxFQWJmOzs7QUFlSTs7Ozs7QUFLQUMsY0FBVUYsRUFBRUcsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1C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O0FBTEYsYUF2REksQ0FKSTtBQW1FZixxQkFBUyxHQW5FTTtBQW9FZitCLGdCQXBFZSxrQkFvRVI7QUFDSCxxQkFBS0MsS0FBTCxDQUFXQyxRQUFYLEdBQXNCLEVBQXRCO0FBQ0g7QUF0RWMsU0FBbkI7QUF3RUgsS0F6RkQ7O0FBMkZBO0FBQ0E7QUFDQTs7QUFFQXZELFdBQU93RCxJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQnZELGNBQU13RCxFQUFOLENBQVMsT0FBVCxFQUFrQm5ELGtCQUFsQjtBQUNBa0Q7QUFDSCxLQUhEOztBQUtBLFdBQU96RCxNQUFQO0FBQ0gsQ0FySkwiLCJmaWxlIjoib3JkZXJzL29yZGVyX2N1c3RvbWl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIG9yZGVyX2N1c3RvbWl6ZXIuanMgMjAxNy0wNS0yNCBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTcgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgT3JkZXJzIE1vZGFsIExheWVyIE1vZHVsZVxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgb3BlbiBhIG1vZGFsIGxheWVyIGZvciBvcmRlciBhY3Rpb25zIGxpa2UgZGVsZXRpbmcgb3IgY2hhbmdpbmcgdGhlIG9kZXIgc3RhdHVzLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9vcmRlcl9jdXN0b21pemVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdvcmRlcl9jdXN0b21pemVyJyxcblxuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvb3JkZXJfY3VzdG9taXplciAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9vcGVuQ3VzdG9taXplclNldCA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICB2YXIgJGN1c3RvbWl6ZXIgPSAkKG9wdGlvbnMuc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAkKCdzZWxlY3RbaWRePVwiZWxlbWVudF9cIl0nKS5lYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJfaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJfY2xhc3MgPSAkKHRoaXMpLmF0dHIoJ2NsYXNzJyk7XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJfbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHZhciBhdHRyX3N0eWxlID0gJCh0aGlzKS5hdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgIHZhciBhdHRyX3ZhbHVlID0gJCh0aGlzKS5jaGlsZHJlbignb3B0aW9uJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlcGxhY2VXaXRoKCc8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiJyArIGF0dHJfbmFtZSArICdcIiBpZD1cIicgKyBhdHRyX2lkICtcbiAgICAgICAgICAgICAgICAgICAgJ1wiIGNsYXNzPVwiJyArIGF0dHJfY2xhc3MgKyAnXCIgc3R5bGU9XCInICsgYXR0cl9zdHlsZSArICdcIiB2YWx1ZT1cIicgKyBhdHRyX3ZhbHVlICsgJ1wiPicpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAkY3VzdG9taXplci5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdIRUFESU5HX0dYX0NVU1RPTUlaRVInLCAnb3JkZXJzJyksXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2F2ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50X2RpdiA9ICRjdXN0b21pemVyLmNoaWxkcmVuKCdbaWRePVwiZ21fZ3ByaW50X2NvbnRlbnRcIl0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50X2Rpdi5jaGlsZHJlbignW2lkXj1cInN1cmZhY2VfXCJdJykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3VyZmFjZV9pZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlucHV0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyX2RpdiA9ICQodGhpcykuY2hpbGRyZW4oJ1tpZF49XCJlbGVtZW50X2NvbnRhaW5lcl9cIl0nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJfZGl2LmNoaWxkcmVuKCdpbnB1dFtpZF49XCJlbGVtZW50X1wiXScpLmVhY2goZnVuY3Rpb24gKGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dF9pZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuaWQgPSBpbnB1dF9pZC5zdWJzdHJpbmcoaW5wdXRfaWQubGFzdEluZGV4T2YoJ18nKSArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2lucHV0X2lkXSA9IGlucHV0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyX2Rpdi5jaGlsZHJlbigndGV4dGFyZWFbaWRePVwiZWxlbWVudF9cIl0nKS5lYWNoKGZ1bmN0aW9uIChqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXRfaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LmlkID0gaW5wdXRfaWQuc3Vic3RyaW5nKGlucHV0X2lkLmxhc3RJbmRleE9mKCdfJykgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0c1tpbnB1dF9pZF0gPSBpbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGlucHV0cykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAncmVxdWVzdF9wb3J0LnBocD9tb2R1bGU9R1ByaW50T3JkZXImYWN0aW9uPXNhdmVfc3VyZmFjZXNfZ3JvdXBfaW5wdXRzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnB1dHNcIjogaW5wdXRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN1cmZhY2VfaWRcIjogc3VyZmFjZV9pZC5zdWJzdHJpbmcoc3VyZmFjZV9pZC5sYXN0SW5kZXhPZignXycpICsgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdndXQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnR01fR1BSSU5UX1NBVkVfRkFJTEVEJywgJ2FkbWluX2dtX2dwcmludCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnR01fR1BSSU5UX1NBVkVfU1VDQ0VTU0ZVTEwnLCAnYWRtaW5fZ21fZ3ByaW50JykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDQyMCxcbiAgICAgICAgICAgICAgICBvcGVuKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICR0aGlzLm9uKCdjbGljaycsIF9vcGVuQ3VzdG9taXplclNldCk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
