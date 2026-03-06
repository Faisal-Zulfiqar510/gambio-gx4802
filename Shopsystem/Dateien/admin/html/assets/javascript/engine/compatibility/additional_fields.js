'use strict';

/* --------------------------------------------------------------
 additional_fields.js 2015-09-30 gm
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Additional Fields
 *
 * This module will handle the additional fields actions on the product page.
 *
 * @module Compatibility/additional_fields
 */
gx.compatibility.module('additional_fields', [],

/**  @lends module:Compatibility/additional_fields */

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
     * Count var for adding new fields
     *
     * @type {int}
     */
    newFieldFormCount = 1,


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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    var _add = function _add(event) {

        event.preventDefault();

        $this.find('.additional_fields').append($this.find('.new_additional_fields').html().replace(/%/g, newFieldFormCount));

        $this.find('.additional_fields input').prop('disabled', false);
        $this.find('.additional_fields textarea').prop('disabled', false);

        $this.find('.additional_fields .delete_additional_field:last').on('click', _delete);

        newFieldFormCount++;
        $(this).blur();

        return false;
    };

    var _delete = function _delete() {
        var id = $(this).data('additional_field_id'),
            $message = $('<div class="add-padding-10"><p>' + jse.core.lang.translate('additional_fields_delete_confirmation', 'new_product') + '</p></div>'),
            $addtionalField = $(this).parents('tbody:first');

        $message.dialog({
            'title': '',
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
                'class': 'btn btn-primary',
                'click': function click() {
                    if (id) {
                        $this.append('<input type="hidden" ' + 'name="additional_field_delete_array[]" value="' + id + '" />');
                    }

                    $addtionalField.remove();
                    $(this).dialog('close');
                }
            }],
            'width': 420
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {

        $this.find('.add_additional_field').on('click', _add);

        $this.find('.delete_additional_field').each(function () {
            $(this).on('click', _delete);
        });

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZGl0aW9uYWxfZmllbGRzLmpzIl0sIm5hbWVzIjpbImd4IiwiY29tcGF0aWJpbGl0eSIsIm1vZHVsZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJuZXdGaWVsZEZvcm1Db3VudCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIl9hZGQiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiZmluZCIsImFwcGVuZCIsImh0bWwiLCJyZXBsYWNlIiwicHJvcCIsIm9uIiwiX2RlbGV0ZSIsImJsdXIiLCJpZCIsIiRtZXNzYWdlIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCIkYWRkdGlvbmFsRmllbGQiLCJwYXJlbnRzIiwiZGlhbG9nIiwicmVtb3ZlIiwiaW5pdCIsImRvbmUiLCJlYWNoIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFPQUEsR0FBR0MsYUFBSCxDQUFpQkMsTUFBakIsQ0FDSSxtQkFESixFQUdJLEVBSEo7O0FBS0k7O0FBRUEsVUFBVUMsSUFBVixFQUFnQjs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTs7Ozs7QUFLQUMsWUFBUUMsRUFBRSxJQUFGLENBTlo7OztBQVFJOzs7OztBQUtBQyx3QkFBb0IsQ0FieEI7OztBQWVJOzs7OztBQUtBQyxlQUFXLEVBcEJmOzs7QUFzQkk7Ozs7O0FBS0FDLGNBQVVILEVBQUVJLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJKLElBQTdCLENBM0JkOzs7QUE2Qkk7Ozs7O0FBS0FELGFBQVMsRUFsQ2I7O0FBb0NBO0FBQ0E7QUFDQTs7QUFFQSxRQUFJUSxPQUFPLFNBQVBBLElBQU8sQ0FBVUMsS0FBVixFQUFpQjs7QUFFeEJBLGNBQU1DLGNBQU47O0FBRUFSLGNBQU1TLElBQU4sQ0FBVyxvQkFBWCxFQUFpQ0MsTUFBakMsQ0FBd0NWLE1BQU1TLElBQU4sQ0FBVyx3QkFBWCxFQUFxQ0UsSUFBckMsR0FDbkNDLE9BRG1DLENBQzNCLElBRDJCLEVBQ3JCVixpQkFEcUIsQ0FBeEM7O0FBR0FGLGNBQU1TLElBQU4sQ0FBVywwQkFBWCxFQUF1Q0ksSUFBdkMsQ0FBNEMsVUFBNUMsRUFBd0QsS0FBeEQ7QUFDQWIsY0FBTVMsSUFBTixDQUFXLDZCQUFYLEVBQTBDSSxJQUExQyxDQUErQyxVQUEvQyxFQUEyRCxLQUEzRDs7QUFFQWIsY0FBTVMsSUFBTixDQUFXLGtEQUFYLEVBQStESyxFQUEvRCxDQUFrRSxPQUFsRSxFQUEyRUMsT0FBM0U7O0FBRUFiO0FBQ0FELFVBQUUsSUFBRixFQUFRZSxJQUFSOztBQUVBLGVBQU8sS0FBUDtBQUNILEtBaEJEOztBQWtCQSxRQUFJRCxVQUFVLFNBQVZBLE9BQVUsR0FBWTtBQUN0QixZQUFJRSxLQUFLaEIsRUFBRSxJQUFGLEVBQVFGLElBQVIsQ0FBYSxxQkFBYixDQUFUO0FBQUEsWUFDSW1CLFdBQVdqQixFQUFFLG9DQUFvQ2tCLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQzdDLHVDQUQ2QyxFQUU3QyxhQUY2QyxDQUFwQyxHQUVRLFlBRlYsQ0FEZjtBQUFBLFlBSUlDLGtCQUFrQnRCLEVBQUUsSUFBRixFQUFRdUIsT0FBUixDQUFnQixhQUFoQixDQUp0Qjs7QUFNQU4saUJBQVNPLE1BQVQsQ0FBZ0I7QUFDWixxQkFBUyxFQURHO0FBRVoscUJBQVMsSUFGRztBQUdaLDJCQUFlLGNBSEg7QUFJWix1QkFBVyxDQUNQO0FBQ0ksd0JBQVFOLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLE9BQXhCLEVBQWlDLFNBQWpDLENBRFo7QUFFSSx5QkFBUyxLQUZiO0FBR0kseUJBQVMsaUJBQVk7QUFDakJyQixzQkFBRSxJQUFGLEVBQVF3QixNQUFSLENBQWUsT0FBZjtBQUNIO0FBTEwsYUFETyxFQVFQO0FBQ0ksd0JBQVFOLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLFFBQXhCLEVBQWtDLFNBQWxDLENBRFo7QUFFSSx5QkFBUyxpQkFGYjtBQUdJLHlCQUFTLGlCQUFZO0FBQ2pCLHdCQUFJTCxFQUFKLEVBQVE7QUFDSmpCLDhCQUFNVSxNQUFOLENBQWEsMEJBQ1AsZ0RBRE8sR0FDNENPLEVBRDVDLEdBQ2lELE1BRDlEO0FBRUg7O0FBRURNLG9DQUFnQkcsTUFBaEI7QUFDQXpCLHNCQUFFLElBQUYsRUFBUXdCLE1BQVIsQ0FBZSxPQUFmO0FBQ0g7QUFYTCxhQVJPLENBSkM7QUEwQloscUJBQVM7QUExQkcsU0FBaEI7QUE0QkgsS0FuQ0Q7O0FBcUNBO0FBQ0E7QUFDQTs7QUFFQTNCLFdBQU82QixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjs7QUFFMUI1QixjQUFNUyxJQUFOLENBQVcsdUJBQVgsRUFBb0NLLEVBQXBDLENBQXVDLE9BQXZDLEVBQWdEUixJQUFoRDs7QUFFQU4sY0FBTVMsSUFBTixDQUFXLDBCQUFYLEVBQXVDb0IsSUFBdkMsQ0FBNEMsWUFBWTtBQUNwRDVCLGNBQUUsSUFBRixFQUFRYSxFQUFSLENBQVcsT0FBWCxFQUFvQkMsT0FBcEI7QUFDSCxTQUZEOztBQUlBYTtBQUNILEtBVEQ7O0FBV0EsV0FBTzlCLE1BQVA7QUFDSCxDQTlITCIsImZpbGUiOiJhZGRpdGlvbmFsX2ZpZWxkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gYWRkaXRpb25hbF9maWVsZHMuanMgMjAxNS0wOS0zMCBnbVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTUgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgQWRkaXRpb25hbCBGaWVsZHNcbiAqXG4gKiBUaGlzIG1vZHVsZSB3aWxsIGhhbmRsZSB0aGUgYWRkaXRpb25hbCBmaWVsZHMgYWN0aW9ucyBvbiB0aGUgcHJvZHVjdCBwYWdlLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9hZGRpdGlvbmFsX2ZpZWxkc1xuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnYWRkaXRpb25hbF9maWVsZHMnLFxuXG4gICAgW10sXG5cbiAgICAvKiogIEBsZW5kcyBtb2R1bGU6Q29tcGF0aWJpbGl0eS9hZGRpdGlvbmFsX2ZpZWxkcyAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDb3VudCB2YXIgZm9yIGFkZGluZyBuZXcgZmllbGRzXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge2ludH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbmV3RmllbGRGb3JtQ291bnQgPSAxLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERlZmF1bHQgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGRlZmF1bHRzID0ge30sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRmluYWwgT3B0aW9uc1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB2YXIge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogTW9kdWxlIE9iamVjdFxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBFVkVOVCBIQU5ETEVSU1xuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICB2YXIgX2FkZCA9IGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAkdGhpcy5maW5kKCcuYWRkaXRpb25hbF9maWVsZHMnKS5hcHBlbmQoJHRoaXMuZmluZCgnLm5ld19hZGRpdGlvbmFsX2ZpZWxkcycpLmh0bWwoKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8lL2csIG5ld0ZpZWxkRm9ybUNvdW50KSk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5hZGRpdGlvbmFsX2ZpZWxkcyBpbnB1dCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmFkZGl0aW9uYWxfZmllbGRzIHRleHRhcmVhJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5hZGRpdGlvbmFsX2ZpZWxkcyAuZGVsZXRlX2FkZGl0aW9uYWxfZmllbGQ6bGFzdCcpLm9uKCdjbGljaycsIF9kZWxldGUpO1xuXG4gICAgICAgICAgICBuZXdGaWVsZEZvcm1Db3VudCsrO1xuICAgICAgICAgICAgJCh0aGlzKS5ibHVyKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2RlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuZGF0YSgnYWRkaXRpb25hbF9maWVsZF9pZCcpLFxuICAgICAgICAgICAgICAgICRtZXNzYWdlID0gJCgnPGRpdiBjbGFzcz1cImFkZC1wYWRkaW5nLTEwXCI+PHA+JyArIGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKFxuICAgICAgICAgICAgICAgICAgICAnYWRkaXRpb25hbF9maWVsZHNfZGVsZXRlX2NvbmZpcm1hdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICduZXdfcHJvZHVjdCcpICsgJzwvcD48L2Rpdj4nKSxcbiAgICAgICAgICAgICAgICAkYWRkdGlvbmFsRmllbGQgPSAkKHRoaXMpLnBhcmVudHMoJ3Rib2R5OmZpcnN0Jyk7XG5cbiAgICAgICAgICAgICRtZXNzYWdlLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzogJycsXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnY2xvc2UnLCAnYnV0dG9ucycpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2RlbGV0ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiICdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ25hbWU9XCJhZGRpdGlvbmFsX2ZpZWxkX2RlbGV0ZV9hcnJheVtdXCIgdmFsdWU9XCInICsgaWQgKyAnXCIgLz4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYWRkdGlvbmFsRmllbGQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICd3aWR0aCc6IDQyMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIG1vZHVsZS5pbml0ID0gZnVuY3Rpb24gKGRvbmUpIHtcblxuICAgICAgICAgICAgJHRoaXMuZmluZCgnLmFkZF9hZGRpdGlvbmFsX2ZpZWxkJykub24oJ2NsaWNrJywgX2FkZCk7XG5cbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5kZWxldGVfYWRkaXRpb25hbF9maWVsZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykub24oJ2NsaWNrJywgX2RlbGV0ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
