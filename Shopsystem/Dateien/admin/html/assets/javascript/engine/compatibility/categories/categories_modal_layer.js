'use strict';

/* --------------------------------------------------------------
 categories_modal_layer.js 2015-09-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2015 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Categories Modal Layer Module
 *
 * This module will open a modal layer for categories/articles actions like deleting the article.
 *
 * @module Compatibility/categories_modal_layer
 */
gx.compatibility.module('categories_modal_layer', [],

/**  @lends module:Compatibility/categories_modal_layer */

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
     * Parent container table, which contains this part and the buttons
     * @type {object}
     */
    $container = $(this).parents('table:first'),


    /**
     * Modal Selector
     *
     * @type {object}
     */
    $modal = $('#modal_layer_container'),


    /**
     * Get checkboxes selector
     *
     * @type {object}
     */
    // $checkboxes = $('.gx-categories-table tr:not(.dataTableHeadingRow) input'),

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

    /**
     * Get Url Parameter
     *
     * Gets a specific URL get parameter from the address bar,
     * which name should be provided as an argument.
     * @param {string} parameterName
     * @returns {object}
     * @private
     */
    var _getUrlParameter = function _getUrlParameter(parameterName) {
        var results = new RegExp('[\?&]' + parameterName + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    };

    /**
     * Prepares buttons for the modal
     *
     * @returns {Array}
     */
    var _getModalButtons = function _getModalButtons() {

        var buttons = [];

        switch (options.action) {
            case 'delete':
                buttons.push({
                    'text': jse.core.lang.translate('close', 'buttons'),
                    'class': 'btn',
                    'click': function click() {
                        $(this).dialog('close');
                        var url = $container.find('a.btn').attr('href');
                        window.open(url, '_self');
                    }
                }, {
                    'text': jse.core.lang.translate('delete', 'buttons'),
                    'class': 'btn btn-primary',
                    'click': function click() {
                        var page_token = $('input[name="page_token"]').attr('value'),
                            data = $('tr[data-id]').has('input[type="checkbox"]:checked').data();

                        // Manipulate URL
                        var url = [window.location.origin, window.location.pathname, '?action=multi_action_confirm', (data.isProduct ? '&pID=' : '&cID=') + data.id, '&cPath=' + data.cpath].join('');

                        var search = _getUrlParameter('search');
                        if (search !== 0 && search !== null) {
                            url += '&search=' + search;
                        }

                        var $form = $('<form name="multi_action_form" method="post" action=' + url + '></form>');
                        $form.append('<input type="hidden" name="cPath" value=' + data.cpath + '>');
                        $form.append('<input type="hidden" name="page_token" value=' + page_token + '>');
                        $('tr[data-id]').find('input[type="checkbox"]:checked').clone().appendTo($form);
                        $(this).find('input[type="checkbox"]:checked').clone().appendTo($form);
                        $form.append('<input type="hidden" name="multi_delete_confirm" value="DeleteConfirm">');
                        $form.appendTo('body');
                        $form.submit();
                    }
                });
                break;

            case 'move':
                buttons.push({
                    'text': jse.core.lang.translate('close', 'buttons'),
                    'class': 'btn',
                    'click': function click() {
                        $(this).dialog('close');
                        var url = $container.find('a.btn').attr('href');
                        window.open(url, '_self');
                    }
                }, {
                    'text': jse.core.lang.translate('BUTTON_MOVE', 'admin_buttons'),
                    'class': 'btn btn-primary',
                    'click': function click() {
                        var page_token = $('input[name="page_token"]:first').attr('value'),
                            data = $('tr[data-id]').has('input[type="checkbox"]:checked').data(),
                            toCatId = $(this).find('select[name="move_to_category_id"] option:selected').val();

                        // Manipulate URL
                        var url = [window.location.origin, window.location.pathname, '?action=multi_action_confirm', (data.isProduct ? '&pID=' : '&cID=') + data.id, '&cPath=' + data.cpath].join('');

                        var $form = $('<form name="multi_action_form" method="post" action=' + url + '></form>');
                        $form.append('<input type="hidden" name="cPath" value=' + data.cpath + '>');
                        $form.append('<input type="hidden" name="page_token" value=' + page_token + '>');
                        $('tr[data-id]').find('input[type="checkbox"]:checked').clone().appendTo($form);
                        $container.find('input[name="src_category_id"]').clone().appendTo($form);
                        $form.append('<input type="hidden" name="move_to_category_id" value=' + toCatId + '>');
                        $form.append('<input type="hidden" name="multi_move_confirm" value="MoveConfirm">');
                        $form.appendTo('body');
                        $form.submit();
                    }
                });
                break;

            case 'copy':
                buttons.push({
                    'text': jse.core.lang.translate('close', 'buttons'),
                    'class': 'btn',
                    'click': function click() {
                        $(this).dialog('close');
                        var url = $container.find('a.btn').attr('href');
                        window.open(url, '_self');
                    }
                }, {
                    'text': jse.core.lang.translate('BUTTON_COPY', 'admin_buttons'),
                    'class': 'btn btn-primary',
                    'click': function click() {
                        var page_token = $('input[name="page_token"]:first').attr('value'),
                            data = $('tr[data-id]').has('input[type="checkbox"]:checked').data(),
                            destCatId = $(this).find('select[name="dest_category_id"] option:selected').val();

                        // Manipulate URL
                        var url = [window.location.origin, window.location.pathname, '?action=multi_action_confirm', (data.isProduct ? '&pID=' : '&cID=') + data.id, '&cPath=' + data.cpath].join('');

                        var search = _getUrlParameter('search');
                        if (search !== 0 && search !== null) {
                            url += '&search=' + search;
                        }

                        var $form = $('<form name="multi_action_form" method="post" action=' + url + '></form>');
                        $form.append('<input type="hidden" name="cPath" value=' + data.cpath + '>');
                        $form.append('<input type="hidden" name="page_token" value=' + page_token + '>');
                        $('tr[data-id]').find('input[type="checkbox"]:checked').clone().appendTo($form);
                        $container.find('input').clone().appendTo($form);
                        $form.append('<input type="hidden" name="dest_category_id" value=' + destCatId + '>');
                        $form.append('<input type="hidden" name="multi_copy_confirm" value="MoveConfirm">');
                        $form.appendTo('body');
                        $form.submit();
                    }
                });
                break;
        }

        return buttons;
    };

    /**
     * Creates dialog for single removal of an article/category
     * @private
     */
    var _openDeleteDialog = function _openDeleteDialog() {

        $this.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_DELETE_ELEMENTS', 'categories'),
            'modal': true,
            'dialogClass': 'gx-container modal-old-table',
            'buttons': _getModalButtons(),
            'width': 420,
            'closeOnEscape': false,
            'open': function open() {
                $('.ui-dialog-titlebar-close').hide();
            }
        });
    };

    /**
     * Creates dialog for the move of an article/category
     * @private
     */
    var _openMoveDialog = function _openMoveDialog() {

        $this.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_MOVE_ELEMENTS', 'categories'),
            'modal': true,
            'dialogClass': 'gx-container modal-old-table',
            'buttons': _getModalButtons(),
            'width': 420,
            'closeOnEscape': false,
            'open': function open() {
                $('.ui-dialog-titlebar-close').hide();
            }
        });
    };

    /**
     * Creates dialog for the copy of an article/category
     * @private
     */
    var _openCopyDialog = function _openCopyDialog() {
        $container.find('tr:eq(-2)').hide();

        $container.dialog({
            'title': jse.core.lang.translate('TEXT_INFO_HEADING_COPY_TO', 'categories'),
            'modal': true,
            'dialogClass': 'gx-container modal-old-table',
            'buttons': _getModalButtons(),
            'width': 420,
            'closeOnEscape': false,
            'open': function open() {
                $('.ui-dialog-titlebar-close').hide();
            }
        });
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        switch (options.action) {
            case 'delete':
                _openDeleteDialog();
                break;
            case 'move':
                _openMoveDialog();
                break;
            case 'copy':
                _openCopyDialog();
                break;
        }

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGVnb3JpZXMvY2F0ZWdvcmllc19tb2RhbF9sYXllci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGNvbnRhaW5lciIsInBhcmVudHMiLCIkbW9kYWwiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfZ2V0VXJsUGFyYW1ldGVyIiwicGFyYW1ldGVyTmFtZSIsInJlc3VsdHMiLCJSZWdFeHAiLCJleGVjIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiX2dldE1vZGFsQnV0dG9ucyIsImJ1dHRvbnMiLCJhY3Rpb24iLCJwdXNoIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJkaWFsb2ciLCJ1cmwiLCJmaW5kIiwiYXR0ciIsIm9wZW4iLCJwYWdlX3Rva2VuIiwiaGFzIiwib3JpZ2luIiwicGF0aG5hbWUiLCJpc1Byb2R1Y3QiLCJpZCIsImNwYXRoIiwiam9pbiIsInNlYXJjaCIsIiRmb3JtIiwiYXBwZW5kIiwiY2xvbmUiLCJhcHBlbmRUbyIsInN1Ym1pdCIsInRvQ2F0SWQiLCJ2YWwiLCJkZXN0Q2F0SWQiLCJfb3BlbkRlbGV0ZURpYWxvZyIsImhpZGUiLCJfb3Blbk1vdmVEaWFsb2ciLCJfb3BlbkNvcHlEaWFsb2ciLCJpbml0IiwiZG9uZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7Ozs7OztBQVdBOzs7Ozs7O0FBT0FBLEdBQUdDLGFBQUgsQ0FBaUJDLE1BQWpCLENBQ0ksd0JBREosRUFHSSxFQUhKOztBQUtJOztBQUVBLFVBQVVDLElBQVYsRUFBZ0I7O0FBRVo7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0k7Ozs7O0FBS0FDLFlBQVFDLEVBQUUsSUFBRixDQU5aOzs7QUFRSTs7OztBQUlBQyxpQkFBYUQsRUFBRSxJQUFGLEVBQVFFLE9BQVIsQ0FBZ0IsYUFBaEIsQ0FaakI7OztBQWNJOzs7OztBQUtBQyxhQUFTSCxFQUFFLHdCQUFGLENBbkJi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QkFBU0osSUFBSUMsSUFBSixDQUFTQyxJQUFULENBQWNDLFNBQWQsQ0FBd0IsMkJBQXhCLEVBQXFELFlBQXJELENBREs7QUFFZCxxQkFBUyxJQUZLO0FBR2QsMkJBQWUsOEJBSEQ7QUFJZCx1QkFBV1Asa0JBSkc7QUFLZCxxQkFBUyxHQUxLO0FBTWQsNkJBQWlCLEtBTkg7QUFPZCxvQkFBUSxnQkFBWTtBQUNoQmYsa0JBQUUsMkJBQUYsRUFBK0I4QyxJQUEvQjtBQUNIO0FBVGEsU0FBbEI7QUFXSCxLQWREOztBQWdCQTtBQUNBO0FBQ0E7O0FBRUFqRCxXQUFPb0QsSUFBUCxHQUFjLFVBQVVDLElBQVYsRUFBZ0I7QUFDMUIsZ0JBQVE3QyxRQUFRWSxNQUFoQjtBQUNJLGlCQUFLLFFBQUw7QUFDSTRCO0FBQ0E7QUFDSixpQkFBSyxNQUFMO0FBQ0lFO0FBQ0E7QUFDSixpQkFBSyxNQUFMO0FBQ0lDO0FBQ0E7QUFUUjs7QUFZQUU7QUFDSCxLQWREOztBQWdCQSxXQUFPckQsTUFBUDtBQUNILENBelRMIiwiZmlsZSI6ImNhdGVnb3JpZXMvY2F0ZWdvcmllc19tb2RhbF9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gY2F0ZWdvcmllc19tb2RhbF9sYXllci5qcyAyMDE1LTA5LTI0XG4gR2FtYmlvIEdtYkhcbiBodHRwOi8vd3d3LmdhbWJpby5kZVxuIENvcHlyaWdodCAoYykgMjAxNSBHYW1iaW8gR21iSFxuIFJlbGVhc2VkIHVuZGVyIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSAoVmVyc2lvbiAyKVxuIFtodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLTIuMC5odG1sXVxuIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuXG4vKipcbiAqICMjIENhdGVnb3JpZXMgTW9kYWwgTGF5ZXIgTW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgd2lsbCBvcGVuIGEgbW9kYWwgbGF5ZXIgZm9yIGNhdGVnb3JpZXMvYXJ0aWNsZXMgYWN0aW9ucyBsaWtlIGRlbGV0aW5nIHRoZSBhcnRpY2xlLlxuICpcbiAqIEBtb2R1bGUgQ29tcGF0aWJpbGl0eS9jYXRlZ29yaWVzX21vZGFsX2xheWVyXG4gKi9cbmd4LmNvbXBhdGliaWxpdHkubW9kdWxlKFxuICAgICdjYXRlZ29yaWVzX21vZGFsX2xheWVyJyxcblxuICAgIFtdLFxuXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvY2F0ZWdvcmllc19tb2RhbF9sYXllciAqL1xuXG4gICAgZnVuY3Rpb24gKGRhdGEpIHtcblxuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFZBUklBQkxFUyBERUZJTklUSU9OXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBQYXJlbnQgY29udGFpbmVyIHRhYmxlLCB3aGljaCBjb250YWlucyB0aGlzIHBhcnQgYW5kIHRoZSBidXR0b25zXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkY29udGFpbmVyID0gJCh0aGlzKS5wYXJlbnRzKCd0YWJsZTpmaXJzdCcpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIE1vZGFsIFNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgJG1vZGFsID0gJCgnI21vZGFsX2xheWVyX2NvbnRhaW5lcicpLFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEdldCBjaGVja2JveGVzIHNlbGVjdG9yXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gJGNoZWNrYm94ZXMgPSAkKCcuZ3gtY2F0ZWdvcmllcy10YWJsZSB0cjpub3QoLmRhdGFUYWJsZUhlYWRpbmdSb3cpIGlucHV0JyksXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRGVmYXVsdCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVmYXVsdHMgPSB7fSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG5cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIFBSSVZBVEUgRlVOQ1RJT05TXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVXJsIFBhcmFtZXRlclxuICAgICAgICAgKlxuICAgICAgICAgKiBHZXRzIGEgc3BlY2lmaWMgVVJMIGdldCBwYXJhbWV0ZXIgZnJvbSB0aGUgYWRkcmVzcyBiYXIsXG4gICAgICAgICAqIHdoaWNoIG5hbWUgc2hvdWxkIGJlIHByb3ZpZGVkIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1ldGVyTmFtZVxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXRVcmxQYXJhbWV0ZXIgPSBmdW5jdGlvbiAocGFyYW1ldGVyTmFtZSkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBuZXcgUmVnRXhwKCdbXFw/Jl0nICsgcGFyYW1ldGVyTmFtZSArICc9KFteJiNdKiknKS5leGVjKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHRzID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNbMV0gfHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUHJlcGFyZXMgYnV0dG9ucyBmb3IgdGhlIG1vZGFsXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfZ2V0TW9kYWxCdXR0b25zID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgYnV0dG9ucyA9IFtdO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKG9wdGlvbnMuYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9ucy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gJGNvbnRhaW5lci5maW5kKCdhLmJ0bicpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2RlbGV0ZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZV90b2tlbiA9ICQoJ2lucHV0W25hbWU9XCJwYWdlX3Rva2VuXCJdJykuYXR0cigndmFsdWUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSAkKCd0cltkYXRhLWlkXScpLmhhcygnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQnKS5kYXRhKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFuaXB1bGF0ZSBVUkxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnP2FjdGlvbj1tdWx0aV9hY3Rpb25fY29uZmlybScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGF0YS5pc1Byb2R1Y3QgPyAnJnBJRD0nIDogJyZjSUQ9JykgKyBkYXRhLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyZjUGF0aD0nICsgZGF0YS5jcGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWFyY2ggPSBfZ2V0VXJsUGFyYW1ldGVyKCdzZWFyY2gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlYXJjaCAhPT0gMCAmJiBzZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybCArPSAoJyZzZWFyY2g9JyArIHNlYXJjaCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgJGZvcm0gPSAkKCc8Zm9ybSBuYW1lPVwibXVsdGlfYWN0aW9uX2Zvcm1cIiBtZXRob2Q9XCJwb3N0XCIgYWN0aW9uPScgKyB1cmxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJz48L2Zvcm0+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY1BhdGhcIiB2YWx1ZT0nICsgZGF0YS5jcGF0aCArICc+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwicGFnZV90b2tlblwiIHZhbHVlPScgKyBwYWdlX3Rva2VuICsgJz4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgndHJbZGF0YS1pZF0nKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCcpLmNsb25lKCkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXTpjaGVja2VkJykuY2xvbmUoKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibXVsdGlfZGVsZXRlX2NvbmZpcm1cIiB2YWx1ZT1cIkRlbGV0ZUNvbmZpcm1cIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kVG8oJ2JvZHknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbW92ZSc6XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjbG9zZScsICdidXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0bicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9ICRjb250YWluZXIuZmluZCgnYS5idG4nKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vcGVuKHVybCwgJ19zZWxmJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdCVVRUT05fTU9WRScsICdhZG1pbl9idXR0b25zJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrJzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZV90b2tlbiA9ICQoJ2lucHV0W25hbWU9XCJwYWdlX3Rva2VuXCJdOmZpcnN0JykuYXR0cigndmFsdWUnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSAkKCd0cltkYXRhLWlkXScpLmhhcygnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQnKS5kYXRhKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b0NhdElkID0gJCh0aGlzKS5maW5kKCdzZWxlY3RbbmFtZT1cIm1vdmVfdG9fY2F0ZWdvcnlfaWRcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFuaXB1bGF0ZSBVUkxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnP2FjdGlvbj1tdWx0aV9hY3Rpb25fY29uZmlybScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZGF0YS5pc1Byb2R1Y3QgPyAnJnBJRD0nIDogJyZjSUQ9JykgKyBkYXRhLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyZjUGF0aD0nICsgZGF0YS5jcGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciAkZm9ybSA9ICQoJzxmb3JtIG5hbWU9XCJtdWx0aV9hY3Rpb25fZm9ybVwiIG1ldGhvZD1cInBvc3RcIiBhY3Rpb249JyArIHVybFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPjwvZm9ybT4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjUGF0aFwiIHZhbHVlPScgKyBkYXRhLmNwYXRoICsgJz4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJwYWdlX3Rva2VuXCIgdmFsdWU9JyArIHBhZ2VfdG9rZW4gKyAnPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCd0cltkYXRhLWlkXScpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXTpjaGVja2VkJykuY2xvbmUoKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnaW5wdXRbbmFtZT1cInNyY19jYXRlZ29yeV9pZFwiXScpLmNsb25lKCkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cIm1vdmVfdG9fY2F0ZWdvcnlfaWRcIiB2YWx1ZT0nICsgdG9DYXRJZCArICc+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibXVsdGlfbW92ZV9jb25maXJtXCIgdmFsdWU9XCJNb3ZlQ29uZmlybVwiPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb3B5JzpcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9ucy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2Nsb3NlJywgJ2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gJGNvbnRhaW5lci5maW5kKCdhLmJ0bicpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4odXJsLCAnX3NlbGYnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ0JVVFRPTl9DT1BZJywgJ2FkbWluX2J1dHRvbnMnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xpY2snOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYWdlX3Rva2VuID0gJCgnaW5wdXRbbmFtZT1cInBhZ2VfdG9rZW5cIl06Zmlyc3QnKS5hdHRyKCd2YWx1ZScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9ICQoJ3RyW2RhdGEtaWRdJykuaGFzKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCcpLmRhdGEoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RDYXRJZCA9ICQodGhpcykuZmluZCgnc2VsZWN0W25hbWU9XCJkZXN0X2NhdGVnb3J5X2lkXCJdIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1hbmlwdWxhdGUgVVJMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ub3JpZ2luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJz9hY3Rpb249bXVsdGlfYWN0aW9uX2NvbmZpcm0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGRhdGEuaXNQcm9kdWN0ID8gJyZwSUQ9JyA6ICcmY0lEPScpICsgZGF0YS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICcmY1BhdGg9JyArIGRhdGEuY3BhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VhcmNoID0gX2dldFVybFBhcmFtZXRlcignc2VhcmNoJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWFyY2ggIT09IDAgJiYgc2VhcmNoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmwgKz0gKCcmc2VhcmNoPScgKyBzZWFyY2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyICRmb3JtID0gJCgnPGZvcm0gbmFtZT1cIm11bHRpX2FjdGlvbl9mb3JtXCIgbWV0aG9kPVwicG9zdFwiIGFjdGlvbj0nICsgdXJsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc+PC9mb3JtPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNQYXRoXCIgdmFsdWU9JyArIGRhdGEuY3BhdGggKyAnPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cInBhZ2VfdG9rZW5cIiB2YWx1ZT0nICsgcGFnZV90b2tlbiArICc+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJ3RyW2RhdGEtaWRdJykuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQnKS5jbG9uZSgpLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCdpbnB1dCcpLmNsb25lKCkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRlc3RfY2F0ZWdvcnlfaWRcIiB2YWx1ZT0nICsgZGVzdENhdElkICsgJz4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJtdWx0aV9jb3B5X2NvbmZpcm1cIiB2YWx1ZT1cIk1vdmVDb25maXJtXCI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZFRvKCdib2R5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbnM7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgZGlhbG9nIGZvciBzaW5nbGUgcmVtb3ZhbCBvZiBhbiBhcnRpY2xlL2NhdGVnb3J5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29wZW5EZWxldGVEaWFsb2cgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICR0aGlzLmRpYWxvZyh7XG4gICAgICAgICAgICAgICAgJ3RpdGxlJzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1RFWFRfSU5GT19IRUFESU5HX0RFTEVURV9FTEVNRU5UUycsICdjYXRlZ29yaWVzJyksXG4gICAgICAgICAgICAgICAgJ21vZGFsJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnZGlhbG9nQ2xhc3MnOiAnZ3gtY29udGFpbmVyIG1vZGFsLW9sZC10YWJsZScsXG4gICAgICAgICAgICAgICAgJ2J1dHRvbnMnOiBfZ2V0TW9kYWxCdXR0b25zKCksXG4gICAgICAgICAgICAgICAgJ3dpZHRoJzogNDIwLFxuICAgICAgICAgICAgICAgICdjbG9zZU9uRXNjYXBlJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgJ29wZW4nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy51aS1kaWFsb2ctdGl0bGViYXItY2xvc2UnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgZGlhbG9nIGZvciB0aGUgbW92ZSBvZiBhbiBhcnRpY2xlL2NhdGVnb3J5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX29wZW5Nb3ZlRGlhbG9nID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAkdGhpcy5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fSEVBRElOR19NT1ZFX0VMRU1FTlRTJywgJ2NhdGVnb3JpZXMnKSxcbiAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXIgbW9kYWwtb2xkLXRhYmxlJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IF9nZXRNb2RhbEJ1dHRvbnMoKSxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiA0MjAsXG4gICAgICAgICAgICAgICAgJ2Nsb3NlT25Fc2NhcGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAnb3Blbic6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnVpLWRpYWxvZy10aXRsZWJhci1jbG9zZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBkaWFsb2cgZm9yIHRoZSBjb3B5IG9mIGFuIGFydGljbGUvY2F0ZWdvcnlcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHZhciBfb3BlbkNvcHlEaWFsb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJ3RyOmVxKC0yKScpLmhpZGUoKTtcblxuICAgICAgICAgICAgJGNvbnRhaW5lci5kaWFsb2coe1xuICAgICAgICAgICAgICAgICd0aXRsZSc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdURVhUX0lORk9fSEVBRElOR19DT1BZX1RPJywgJ2NhdGVnb3JpZXMnKSxcbiAgICAgICAgICAgICAgICAnbW9kYWwnOiB0cnVlLFxuICAgICAgICAgICAgICAgICdkaWFsb2dDbGFzcyc6ICdneC1jb250YWluZXIgbW9kYWwtb2xkLXRhYmxlJyxcbiAgICAgICAgICAgICAgICAnYnV0dG9ucyc6IF9nZXRNb2RhbEJ1dHRvbnMoKSxcbiAgICAgICAgICAgICAgICAnd2lkdGgnOiA0MjAsXG4gICAgICAgICAgICAgICAgJ2Nsb3NlT25Fc2NhcGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAnb3Blbic6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnVpLWRpYWxvZy10aXRsZWJhci1jbG9zZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAgICAgbW9kdWxlLmluaXQgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25zLmFjdGlvbikge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICAgICAgICAgIF9vcGVuRGVsZXRlRGlhbG9nKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICAgICAgICAgICAgICBfb3Blbk1vdmVEaWFsb2coKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29weSc6XG4gICAgICAgICAgICAgICAgICAgIF9vcGVuQ29weURpYWxvZygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgfSk7XG4iXX0=
