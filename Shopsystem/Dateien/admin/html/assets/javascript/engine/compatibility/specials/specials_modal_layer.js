'use strict';

/* --------------------------------------------------------------
 specials_modal_layer.js 2015-09-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/* globals Lang */

/**
 * ## Specials Modal Layer Module
 *
 * This module will open a modal layer for order actions like deleting or changing the oder status.
 *
 * @module Compatibility/specials_modal_layer
 */
gx.compatibility.module('specials_modal_layer', [],

/**  @lends module:Compatibility/specials_modal_layer */

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
     * Modal Selector
     *
     * @type {object}
     */
    $modal = $('#modal_layer_container'),


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

    var _openDeleteDialog = function _openDeleteDialog(event) {

        var $form = $('#delete_confirm_form');
        var stringPos = $form.attr('action').indexOf('&sID=');

        if (stringPos !== -1) {
            $form.attr('action', $form.attr('action').substr(0, stringPos));
        }

        $form.attr('action', $form.attr('action') + '&sID=' + options.special_id);

        $form.find('.product-name').html(options.name);

        event.preventDefault();
        $form.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_DELETE_SPECIALS', 'admin_specials'),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': _getModalButtons($form),
            'width': 420
        });
    };

    var _getModalButtons = function _getModalButtons($form) {
        var buttons = [{
            'text': jse.core.lang.translate('close', 'buttons'),
            'class': 'btn',
            'click': function click() {
                $(this).dialog('close');
            }
        }, {
            'text': jse.core.lang.translate('delete', 'buttons'),
            'class': 'btn btn-primary',
            'click': function click() {
                $form.submit();
            }
        }];

        return buttons;
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', _openDeleteDialog);
        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWNpYWxzL3NwZWNpYWxzX21vZGFsX2xheWVyLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCIkbW9kYWwiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfb3BlbkRlbGV0ZURpYWxvZyIsImV2ZW50IiwiJGZvcm0iLCJzdHJpbmdQb3MiLCJhdHRyIiwiaW5kZXhPZiIsInN1YnN0ciIsInNwZWNpYWxfaWQiLCJmaW5kIiwiaHRtbCIsIm5hbWUiLCJwcmV2ZW50RGVmYXVsdCIsImRpYWxvZyIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwiX2dldE1vZGFsQnV0dG9ucyIsImJ1dHRvbnMiLCJzdWJtaXQiLCJpbml0IiwiZG9uZSIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7O0FBRUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxzQkFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyxhQUFTRCxFQUFFLHdCQUFGLENBYmI7OztBQWVJOzs7OztBQUtBRSxlQUFXLEVBcEJmOzs7QUFzQkk7Ozs7O0FBS0FDLGNBQVVILEVBQUVJLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJKLElBQTdCLENBM0JkOzs7QUE2Qkk7Ozs7O0FBS0FELGFBQVMsRUFsQ2I7O0FBb0NBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJUSxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFVQyxLQUFWLEVBQWlCOztBQUVyQyxZQUFJQyxRQUFRUCxFQUFFLHNCQUFGLENBQVo7QUFDQSxZQUFJUSxZQUFZRCxNQUFNRSxJQUFOLENBQVcsUUFBWCxFQUFxQkMsT0FBckIsQ0FBNkIsT0FBN0IsQ0FBaEI7O0FBRUEsWUFBSUYsY0FBYyxDQUFDLENBQW5CLEVBQXNCO0FBQ2xCRCxrQkFBTUUsSUFBTixDQUFXLFFBQVgsRUFBcUJGLE1BQU1FLElBQU4sQ0FBVyxRQUFYLEVBQXFCRSxNQUFyQixDQUE0QixDQUE1QixFQUErQkgsU0FBL0IsQ0FBckI7QUFDSDs7QUFFREQsY0FBTUUsSUFBTixDQUFXLFFBQVgsRUFBcUJGLE1BQU1FLElBQU4sQ0FBVyxRQUFYLElBQXVCLE9BQXZCLEdBQWlDTixRQUFRUyxVQUE5RDs7QUFFQUwsY0FBTU0sSUFBTixDQUFXLGVBQVgsRUFBNEJDLElBQTVCLENBQWlDWCxRQUFRWSxJQUF6Qzs7QUFFQVQsY0FBTVUsY0FBTjtBQUNBVCxjQUFNVSxNQUFOLENBQWE7QUFDVCxxQkFBU0MsSUFBSUMsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsbUNBQXhCLEVBQTZELGdCQUE3RCxDQURBO0FBRVQscUJBQVMsSUFGQTtBQUdULDJCQUFlLGNBSE47QUFJVCx1QkFBV0MsaUJBQWlCZixLQUFqQixDQUpGO0FBS1QscUJBQVM7QUFMQSxTQUFiO0FBUUgsS0F0QkQ7O0FBd0JBLFFBQUllLG1CQUFtQixTQUFuQkEsZ0JBQW1CLENBQVVmLEtBQVYsRUFBaUI7QUFDcEMsWUFBSWdCLFVBQVUsQ0FDVjtBQUNJLG9CQUFRTCxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixPQUF4QixFQUFpQyxTQUFqQyxDQURaO0FBRUkscUJBQVMsS0FGYjtBQUdJLHFCQUFTLGlCQUFZO0FBQ2pCckIsa0JBQUUsSUFBRixFQUFRaUIsTUFBUixDQUFlLE9BQWY7QUFDSDtBQUxMLFNBRFUsRUFRVjtBQUNJLG9CQUFRQyxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixRQUF4QixFQUFrQyxTQUFsQyxDQURaO0FBRUkscUJBQVMsaUJBRmI7QUFHSSxxQkFBUyxpQkFBWTtBQUNqQmQsc0JBQU1pQixNQUFOO0FBQ0g7QUFMTCxTQVJVLENBQWQ7O0FBaUJBLGVBQU9ELE9BQVA7QUFDSCxLQW5CRDs7QUFxQkE7QUFDQTtBQUNBOztBQUVBMUIsV0FBTzRCLElBQVAsR0FBYyxVQUFVQyxJQUFWLEVBQWdCO0FBQzFCM0IsY0FBTTRCLEVBQU4sQ0FBUyxPQUFULEVBQWtCdEIsaUJBQWxCO0FBQ0FxQjtBQUNILEtBSEQ7O0FBS0EsV0FBTzdCLE1BQVA7QUFDSCxDQTlHTCIsImZpbGUiOiJzcGVjaWFscy9zcGVjaWFsc19tb2RhbF9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gc3BlY2lhbHNfbW9kYWxfbGF5ZXIuanMgMjAxNS0wOS0yNFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qIGdsb2JhbHMgTGFuZyAqL1xuXG4vKipcbiAqICMjIFNwZWNpYWxzIE1vZGFsIExheWVyIE1vZHVsZVxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgb3BlbiBhIG1vZGFsIGxheWVyIGZvciBvcmRlciBhY3Rpb25zIGxpa2UgZGVsZXRpbmcgb3IgY2hhbmdpbmcgdGhlIG9kZXIgc3RhdHVzLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9zcGVjaWFsc19tb2RhbF9sYXllclxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnc3BlY2lhbHNfbW9kYWxfbGF5ZXInLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9zcGVjaWFsc19tb2RhbF9sYXllciAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2RhbCBTZWxlY3RvclxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRtb2RhbCA9ICQoJyNtb2RhbF9sYXllcl9jb250YWluZXInKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBGVU5DVElPTlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgdmFyIF9vcGVuRGVsZXRlRGlhbG9nID0gZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQoJyNkZWxldGVfY29uZmlybV9mb3JtJyk7XG4gICAgICAgICAgICB2YXIgc3RyaW5nUG9zID0gJGZvcm0uYXR0cignYWN0aW9uJykuaW5kZXhPZignJnNJRD0nKTtcblxuICAgICAgICAgICAgaWYgKHN0cmluZ1BvcyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCAkZm9ybS5hdHRyKCdhY3Rpb24nKS5zdWJzdHIoMCwgc3RyaW5nUG9zKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsICRmb3JtLmF0dHIoJ2FjdGlvbicpICsgJyZzSUQ9JyArIG9wdGlvbnMuc3BlY2lhbF9pZCk7XG5cbiAgICAgICAgICAgICRmb3JtLmZpbmQoJy5wcm9kdWN0LW5hbWUnKS5odG1sKG9wdGlvbnMubmFtZSk7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkZm9ybS5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fSEVBRElOR19ERUxFVEVfU1BFQ0lBTFMnLCAnYWRtaW5fc3BlY2lhbHMnKSxcbiAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICdidXR0b25zJzogX2dldE1vZGFsQnV0dG9ucygkZm9ybSksXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogNDIwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfZ2V0TW9kYWxCdXR0b25zID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2RlbGV0ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIHJldHVybiBidXR0b25zO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpcy5vbignY2xpY2snLCBfb3BlbkRlbGV0ZURpYWxvZyk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
