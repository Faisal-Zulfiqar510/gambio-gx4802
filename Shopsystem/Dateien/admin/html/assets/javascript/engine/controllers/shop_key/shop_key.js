'use strict';

/* --------------------------------------------------------------
 shop_key.js 2016-03-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Shop Key
 *
 * This module will update the information in the textarea of the shop key page and opens a modal layer for
 * more detailed information of the shop key
 *
 * @module Controllers/shop_key
 */
gx.controllers.module('shop_key', [],

/**  @lends module:Controllers/shop_key */

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
    // EVENT HANDLERS
    // ------------------------------------------------------------------------

    /**
     * Entering the shop key into the input field updates the content of the textarea containing shop information
     * like the shop key
     *
     * @private
     */
    var _updateTextarea = function _updateTextarea() {
        var $textarea = $this.find('#shop-key-data'),
            html = $textarea.html().replace(/shop_key=.*?\nlanguage/g, 'shop_key=' + $.trim($(this).val()) + '\nlanguage');

        $textarea.html(html);
    };

    /**
     * Clicking the link for more information about the shop key opens a modal box
     *
     * @param event
     * @private
     */
    var _showInformation = function _showInformation(event) {
        var $information = $('<p class="shop-key-information">' + jse.core.lang.translate('purpose_description', 'shop_key') + '</p>');

        event.preventDefault();

        $information.dialog({
            'title': jse.core.lang.translate('page_title', 'shop_key'),
            'modal': true,
            'dialogClass': 'gx-container',
            'buttons': [{
                'text': jse.core.lang.translate('close', 'buttons'),
                'class': 'btn',
                'click': function click() {
                    $(this).dialog('close');
                }
            }],
            'width': 420
        });
    };

    var _saveShopKey = function _saveShopKey(event) {
        var actionUrl = $this.attr('action');

        event.preventDefault();

        actionUrl = actionUrl.replace('do=ShopKey/Destroy', 'do=ShopKey/Store');
        $this.attr('action', actionUrl);

        $this.submit();
    };

    /**
     * Update action parameter of form to the delete-url if delete button is clicked
     *
     * @param event
     * @private
     */
    var _deleteShopKey = function _deleteShopKey(event) {
        var actionUrl = $this.attr('action');

        event.preventDefault();

        actionUrl = actionUrl.replace('do=ShopKey/Store', 'do=ShopKey/Destroy');
        $this.attr('action', actionUrl);

        $this.submit();
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('change', '#gambio-shop-key', _updateTextarea).on('keyup', '#gambio-shop-key', _updateTextarea).on('click', '.show-shop-key-information', _showInformation);

        document.querySelector('button[name="save"]').addEventListener('click', _saveShopKey);
        document.querySelector('button[name="delete"]').addEventListener('click', _deleteShopKey);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNob3Bfa2V5L3Nob3Bfa2V5LmpzIl0sIm5hbWVzIjpbImd4IiwiY29udHJvbGxlcnMiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCJvcHRpb25zIiwiZXh0ZW5kIiwiX3VwZGF0ZVRleHRhcmVhIiwiJHRleHRhcmVhIiwiZmluZCIsImh0bWwiLCJyZXBsYWNlIiwidHJpbSIsInZhbCIsIl9zaG93SW5mb3JtYXRpb24iLCJldmVudCIsIiRpbmZvcm1hdGlvbiIsImpzZSIsImNvcmUiLCJsYW5nIiwidHJhbnNsYXRlIiwicHJldmVudERlZmF1bHQiLCJkaWFsb2ciLCJfc2F2ZVNob3BLZXkiLCJhY3Rpb25VcmwiLCJhdHRyIiwic3VibWl0IiwiX2RlbGV0ZVNob3BLZXkiLCJpbml0IiwiZG9uZSIsIm9uIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7OztBQVFBQSxHQUFHQyxXQUFILENBQWVDLE1BQWYsQ0FDSSxVQURKLEVBR0ksRUFISjs7QUFLSTs7QUFFQSxVQUFVQyxJQUFWLEVBQWdCOztBQUVaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJOzs7OztBQUtBQyxZQUFRQyxFQUFFLElBQUYsQ0FOWjs7O0FBUUk7Ozs7O0FBS0FDLGVBQVcsRUFiZjs7O0FBZUk7Ozs7O0FBS0FDLGNBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBcEJkOzs7QUFzQkk7Ozs7O0FBS0FELGFBQVMsRUEzQmI7O0FBNkJBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7O0FBTUEsUUFBSU8sa0JBQWtCLFNBQWxCQSxlQUFrQixHQUFZO0FBQzlCLFlBQUlDLFlBQVlOLE1BQU1PLElBQU4sQ0FBVyxnQkFBWCxDQUFoQjtBQUFBLFlBQ0lDLE9BQU9GLFVBQVVFLElBQVYsR0FBaUJDLE9BQWpCLENBQXlCLHlCQUF6QixFQUFvRCxjQUFjUixFQUFFUyxJQUFGLENBQU9ULEVBQUUsSUFBRixFQUFRVSxHQUFSLEVBQVAsQ0FBZCxHQUN2RCxZQURHLENBRFg7O0FBSUFMLGtCQUFVRSxJQUFWLENBQWVBLElBQWY7QUFDSCxLQU5EOztBQVFBOzs7Ozs7QUFNQSxRQUFJSSxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFVQyxLQUFWLEVBQWlCO0FBQ3BDLFlBQUlDLGVBQWViLEVBQUUscUNBQ2pCYyxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3QixxQkFBeEIsRUFBK0MsVUFBL0MsQ0FEaUIsR0FFakIsTUFGZSxDQUFuQjs7QUFJQUwsY0FBTU0sY0FBTjs7QUFFQUwscUJBQWFNLE1BQWIsQ0FBb0I7QUFDaEIscUJBQVNMLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLFlBQXhCLEVBQXNDLFVBQXRDLENBRE87QUFFaEIscUJBQVMsSUFGTztBQUdoQiwyQkFBZSxjQUhDO0FBSWhCLHVCQUFXLENBQ1A7QUFDSSx3QkFBUUgsSUFBSUMsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsT0FBeEIsRUFBaUMsU0FBakMsQ0FEWjtBQUVJLHlCQUFTLEtBRmI7QUFHSSx5QkFBUyxpQkFBWTtBQUNqQmpCLHNCQUFFLElBQUYsRUFBUW1CLE1BQVIsQ0FBZSxPQUFmO0FBQ0g7QUFMTCxhQURPLENBSks7QUFhaEIscUJBQVM7QUFiTyxTQUFwQjtBQWVILEtBdEJEOztBQXdCQSxRQUFJQyxlQUFlLFNBQWZBLFlBQWUsQ0FBVVIsS0FBVixFQUFpQjtBQUNoQyxZQUFJUyxZQUFZdEIsTUFBTXVCLElBQU4sQ0FBVyxRQUFYLENBQWhCOztBQUVBVixjQUFNTSxjQUFOOztBQUVBRyxvQkFBWUEsVUFBVWIsT0FBVixDQUFrQixvQkFBbEIsRUFBd0Msa0JBQXhDLENBQVo7QUFDQVQsY0FBTXVCLElBQU4sQ0FBVyxRQUFYLEVBQXFCRCxTQUFyQjs7QUFFQXRCLGNBQU13QixNQUFOO0FBQ0gsS0FURDs7QUFXQTs7Ozs7O0FBTUEsUUFBSUMsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFVWixLQUFWLEVBQWlCO0FBQ2xDLFlBQUlTLFlBQVl0QixNQUFNdUIsSUFBTixDQUFXLFFBQVgsQ0FBaEI7O0FBRUFWLGNBQU1NLGNBQU47O0FBRUFHLG9CQUFZQSxVQUFVYixPQUFWLENBQWtCLGtCQUFsQixFQUFzQyxvQkFBdEMsQ0FBWjtBQUNBVCxjQUFNdUIsSUFBTixDQUFXLFFBQVgsRUFBcUJELFNBQXJCOztBQUVBdEIsY0FBTXdCLE1BQU47QUFDSCxLQVREOztBQVdBO0FBQ0E7QUFDQTs7QUFFQTFCLFdBQU80QixJQUFQLEdBQWMsVUFBVUMsSUFBVixFQUFnQjtBQUMxQjNCLGNBQ0s0QixFQURMLENBQ1EsUUFEUixFQUNrQixrQkFEbEIsRUFDc0N2QixlQUR0QyxFQUVLdUIsRUFGTCxDQUVRLE9BRlIsRUFFaUIsa0JBRmpCLEVBRXFDdkIsZUFGckMsRUFHS3VCLEVBSEwsQ0FHUSxPQUhSLEVBR2lCLDRCQUhqQixFQUcrQ2hCLGdCQUgvQzs7QUFLQWlCLGlCQUFTQyxhQUFULENBQXVCLHFCQUF2QixFQUE4Q0MsZ0JBQTlDLENBQStELE9BQS9ELEVBQXdFVixZQUF4RTtBQUNBUSxpQkFBU0MsYUFBVCxDQUF1Qix1QkFBdkIsRUFBZ0RDLGdCQUFoRCxDQUFpRSxPQUFqRSxFQUEwRU4sY0FBMUU7O0FBRUFFO0FBQ0gsS0FWRDs7QUFZQSxXQUFPN0IsTUFBUDtBQUNILENBeklMIiwiZmlsZSI6InNob3Bfa2V5L3Nob3Bfa2V5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBzaG9wX2tleS5qcyAyMDE2LTAzLTE2XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuLyoqXG4gKiAjIyBTaG9wIEtleVxuICpcbiAqIFRoaXMgbW9kdWxlIHdpbGwgdXBkYXRlIHRoZSBpbmZvcm1hdGlvbiBpbiB0aGUgdGV4dGFyZWEgb2YgdGhlIHNob3Aga2V5IHBhZ2UgYW5kIG9wZW5zIGEgbW9kYWwgbGF5ZXIgZm9yXG4gKiBtb3JlIGRldGFpbGVkIGluZm9ybWF0aW9uIG9mIHRoZSBzaG9wIGtleVxuICpcbiAqIEBtb2R1bGUgQ29udHJvbGxlcnMvc2hvcF9rZXlcbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKFxuICAgICdzaG9wX2tleScsXG5cbiAgICBbXSxcblxuICAgIC8qKiAgQGxlbmRzIG1vZHVsZTpDb250cm9sbGVycy9zaG9wX2tleSAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEZpbmFsIE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdHMsIGRhdGEpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZHVsZSBPYmplY3RcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBtb2R1bGUgPSB7fTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gRVZFTlQgSEFORExFUlNcbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEVudGVyaW5nIHRoZSBzaG9wIGtleSBpbnRvIHRoZSBpbnB1dCBmaWVsZCB1cGRhdGVzIHRoZSBjb250ZW50IG9mIHRoZSB0ZXh0YXJlYSBjb250YWluaW5nIHNob3AgaW5mb3JtYXRpb25cbiAgICAgICAgICogbGlrZSB0aGUgc2hvcCBrZXlcbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfdXBkYXRlVGV4dGFyZWEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJHRleHRhcmVhID0gJHRoaXMuZmluZCgnI3Nob3Ata2V5LWRhdGEnKSxcbiAgICAgICAgICAgICAgICBodG1sID0gJHRleHRhcmVhLmh0bWwoKS5yZXBsYWNlKC9zaG9wX2tleT0uKj9cXG5sYW5ndWFnZS9nLCAnc2hvcF9rZXk9JyArICQudHJpbSgkKHRoaXMpLnZhbCgpKSArXG4gICAgICAgICAgICAgICAgICAgICdcXG5sYW5ndWFnZScpO1xuXG4gICAgICAgICAgICAkdGV4dGFyZWEuaHRtbChodG1sKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xpY2tpbmcgdGhlIGxpbmsgZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHNob3Aga2V5IG9wZW5zIGEgbW9kYWwgYm94XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBldmVudFxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9zaG93SW5mb3JtYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkaW5mb3JtYXRpb24gPSAkKCc8cCBjbGFzcz1cInNob3Ata2V5LWluZm9ybWF0aW9uXCI+JyArXG4gICAgICAgICAgICAgICAganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3B1cnBvc2VfZGVzY3JpcHRpb24nLCAnc2hvcF9rZXknKSArXG4gICAgICAgICAgICAgICAgJzwvcD4nKTtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJGluZm9ybWF0aW9uLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3BhZ2VfdGl0bGUnLCAnc2hvcF9rZXknKSxcbiAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICdidXR0b25zJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjbG9zZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGljayc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogNDIwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX3NhdmVTaG9wS2V5ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uVXJsID0gJHRoaXMuYXR0cignYWN0aW9uJyk7XG4gICAgXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFxuICAgICAgICAgICAgYWN0aW9uVXJsID0gYWN0aW9uVXJsLnJlcGxhY2UoJ2RvPVNob3BLZXkvRGVzdHJveScsICdkbz1TaG9wS2V5L1N0b3JlJyk7XG4gICAgICAgICAgICAkdGhpcy5hdHRyKCdhY3Rpb24nLCBhY3Rpb25VcmwpO1xuICAgIFxuICAgICAgICAgICAgJHRoaXMuc3VibWl0KCk7XG4gICAgICAgIH07XG4gICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGUgYWN0aW9uIHBhcmFtZXRlciBvZiBmb3JtIHRvIHRoZSBkZWxldGUtdXJsIGlmIGRlbGV0ZSBidXR0b24gaXMgY2xpY2tlZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZXZlbnRcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZGVsZXRlU2hvcEtleSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGFjdGlvblVybCA9ICR0aGlzLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICAgICAgYWN0aW9uVXJsID0gYWN0aW9uVXJsLnJlcGxhY2UoJ2RvPVNob3BLZXkvU3RvcmUnLCAnZG89U2hvcEtleS9EZXN0cm95Jyk7XG4gICAgICAgICAgICAkdGhpcy5hdHRyKCdhY3Rpb24nLCBhY3Rpb25VcmwpO1xuICAgICAgICBcbiAgICAgICAgICAgICR0aGlzLnN1Ym1pdCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBJTklUSUFMSVpBVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAkdGhpc1xuICAgICAgICAgICAgICAgIC5vbignY2hhbmdlJywgJyNnYW1iaW8tc2hvcC1rZXknLCBfdXBkYXRlVGV4dGFyZWEpXG4gICAgICAgICAgICAgICAgLm9uKCdrZXl1cCcsICcjZ2FtYmlvLXNob3Ata2V5JywgX3VwZGF0ZVRleHRhcmVhKVxuICAgICAgICAgICAgICAgIC5vbignY2xpY2snLCAnLnNob3ctc2hvcC1rZXktaW5mb3JtYXRpb24nLCBfc2hvd0luZm9ybWF0aW9uKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW25hbWU9XCJzYXZlXCJdJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfc2F2ZVNob3BLZXkpO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW25hbWU9XCJkZWxldGVcIl0nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9kZWxldGVTaG9wS2V5KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
