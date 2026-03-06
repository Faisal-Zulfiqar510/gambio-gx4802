'use strict';

/* --------------------------------------------------------------
 categories_multi_action_controller.js 2018-04-18
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * ## Orders Table Controller
 *
 * This controller contains the mapping logic of the categories/articles multi select actions for the button
 * dropdown (on the bottom).
 *
 * @module Compatibility/categories_multi_action_controller
 */
gx.compatibility.module('categories_multi_action_controller', [gx.source + '/libs/button_dropdown'],

/**  @lends module:Compatibility/categories_multi_action_controller */

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
     * Dropdown button selector
     * @var {object}
     */
    $dropdown = $this.find('.js-bottom-dropdown'),


    /**
     * Input fields
     * @type {*|jQuery|HTMLElement}
     */
    $inputs = $('tr[data-id] input[type="checkbox"]'),


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
     * Prepare Form
     *
     * @param {string} action
     *
     * @return {object | jQuery}
     */
    var _$prepareForm = function _$prepareForm(action) {
        var cPath;
        try {
            cPath = window.location.href.match(/cPath=(.*)/)[1];
        } catch (e) {
            cPath = null;
        }

        var page_token = $('input[name="page_token"]:first').attr('value');

        var formUrl = [_getSourcePath(), 'categories.php', '?action=multi_action'].join('');

        if (cPath != null) {
            formUrl += '&cPath=' + cPath;
        }

        var search = _getUrlParameter('search');
        if (search !== 0 && search !== null) {
            formUrl += '&search=' + search;
        }

        var page = _getUrlParameter('page');
        if (page !== 0 && page !== null && formUrl.indexOf('page=') === -1) {
            formUrl += '&page=' + page;
        }

        var sorting = _getUrlParameter('sorting');
        if (sorting !== 0 && sorting !== null) {
            formUrl += '&sorting=' + sorting;
        }

        var $form = $('<form name="multi_action_form" method="post" action=' + formUrl + '></form>');
        $form.append('<input type="hidden" name="cpath" value=' + cPath + '>');
        $form.append('<input type="hidden" name="page_token" value=' + page_token + '>');
        $form.append('<input type="hidden" name=' + action + ' value="Action">');
        $form.appendTo('body');
        return $form;
    };

    var _sectionMapping = {
        delete: 'buttons',
        BUTTON_MOVE: 'admin_buttons',
        BUTTON_COPY: 'admin_buttons',
        BUTTON_STATUS_ON: 'admin_buttons',
        BUTTON_STATUS_OFF: 'admin_buttons'
    };

    /**
     * Map actions for the dropdown button
     *
     * This method will map the actions for multiple selects.
     */
    var _mapMultiActions = function _mapMultiActions() {
        var actions = ['delete', 'BUTTON_MOVE', 'BUTTON_COPY', 'BUTTON_STATUS_ON', 'BUTTON_STATUS_OFF'];

        for (var index in actions) {
            _mapAction(actions[index]);
        }
    };

    var _mapAction = function _mapAction(action) {
        var section = _sectionMapping[action],
            callback = _getActionCallback(action);
        jse.libs.button_dropdown.mapAction($dropdown, action, section, callback);
    };

    var _callbackDelete = function _callbackDelete(event) {
        // Do not do anything when no product/category is checked
        if (!$inputs.filter(':checked').length) {
            return;
        }

        // Submit cached form
        var $form = _$prepareForm('multi_delete');
        $inputs.filter(':checked').appendTo($form);
        $form.submit();
    };

    var _callbackMove = function _callbackMove(event) {
        // Do not do anything when no product/category is checked
        if (!$inputs.filter(':checked').length) {
            return;
        }

        // Submit cached form
        var $form = _$prepareForm('multi_move');
        $inputs.filter(':checked').appendTo($form);
        $form.submit();
    };

    var _callbackCopy = function _callbackCopy(event) {
        // Do not do anything when no product/category is checked
        if (!$inputs.filter(':checked').length) {
            return;
        }

        // Submit cached form
        var $form = _$prepareForm('multi_copy');
        $inputs.filter(':checked').appendTo($form);
        $form.submit();
    };

    var _callbackStatusOn = function _callbackStatusOn(event) {
        // Do not do anything when no product/category is checked
        if (!$inputs.filter(':checked').length) {
            return;
        }

        // Submit cached form
        var $form = _$prepareForm('multi_status_on');
        $inputs.filter(':checked').appendTo($form);
        $form.submit();
    };

    var _callbackStatusOff = function _callbackStatusOff(event) {
        // Do not do anything when no product/category is checked
        if (!$inputs.filter(':checked').length) {
            return;
        }

        // Submit cached form
        var $form = _$prepareForm('multi_status_off');
        $inputs.filter(':checked').appendTo($form);
        $form.submit();
    };

    var _getActionCallback = function _getActionCallback(action) {
        switch (action) {
            case 'delete':
                return _callbackDelete;
            case 'BUTTON_MOVE':
                return _callbackMove;
            case 'BUTTON_COPY':
                return _callbackCopy;
            case 'BUTTON_STATUS_ON':
                return _callbackStatusOn;
            case 'BUTTON_STATUS_OFF':
                return _callbackStatusOff;
            default:
                console.alert('_getActionCallback: Action not found');
        }
        return null;
    };

    /**
     * Get path of the admin folder
     *
     * @returns {string}
     */
    var _getSourcePath = function _getSourcePath() {
        var url = window.location.origin,
            path = window.location.pathname;

        var splittedPath = path.split('/');
        splittedPath.pop();

        var joinedPath = splittedPath.join('/');

        return url + joinedPath + '/';
    };

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        // Wait until the dropdown is filled
        var interval = setInterval(function () {
            if ($('.js-button-dropdown').length > 0) {
                clearInterval(interval);
                _mapMultiActions();
            }
        }, 200);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhdGVnb3JpZXMvY2F0ZWdvcmllc19tdWx0aV9hY3Rpb25fY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJneCIsImNvbXBhdGliaWxpdHkiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiZGVmYXVsdHMiLCIkZHJvcGRvd24iLCJmaW5kIiwiJGlucHV0cyIsIm9wdGlvbnMiLCJleHRlbmQiLCJfZ2V0VXJsUGFyYW1ldGVyIiwicGFyYW1ldGVyTmFtZSIsInJlc3VsdHMiLCJSZWdFeHAiLCJleGVjIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiXyRwcmVwYXJlRm9ybSIsImFjdGlvbiIsImNQYXRoIiwibWF0Y2giLCJlIiwicGFnZV90b2tlbiIsImF0dHIiLCJmb3JtVXJsIiwiX2dldFNvdXJjZVBhdGgiLCJqb2luIiwic2VhcmNoIiwicGFnZSIsImluZGV4T2YiLCJzb3J0aW5nIiwiJGZvcm0iLCJhcHBlbmQiLCJhcHBlbmRUbyIsIl9zZWN0aW9uTWFwcGluZyIsImRlbGV0ZSIsIkJVVFRPTl9NT1ZFIiwiQlVUVE9OX0NPUFkiLCJCVVRUT05fU1RBVFVTX09OIiwiQlVUVE9OX1NUQVRVU19PRkYiLCJfbWFwTXVsdGlBY3Rpb25zIiwiYWN0aW9ucyIsImluZGV4IiwiX21hcEFjdGlvbiIsInNlY3Rpb24iLCJjYWxsYmFjayIsIl9nZXRBY3Rpb25DYWxsYmFjayIsImpzZSIsImxpYnMiLCJidXR0b25fZHJvcGRvd24iLCJtYXBBY3Rpb24iLCJfY2FsbGJhY2tEZWxldGUiLCJldmVudCIsImZpbHRlciIsImxlbmd0aCIsInN1Ym1pdCIsIl9jYWxsYmFja01vdmUiLCJfY2FsbGJhY2tDb3B5IiwiX2NhbGxiYWNrU3RhdHVzT24iLCJfY2FsbGJhY2tTdGF0dXNPZmYiLCJjb25zb2xlIiwiYWxlcnQiLCJ1cmwiLCJvcmlnaW4iLCJwYXRoIiwicGF0aG5hbWUiLCJzcGxpdHRlZFBhdGgiLCJzcGxpdCIsInBvcCIsImpvaW5lZFBhdGgi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OiJjYXRlZ29yaWVzL2NhdGVnb3JpZXNfbXVsdGlfYWN0aW9uX2NvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGNhdGVnb3JpZXNfbXVsdGlfYWN0aW9uX2NvbnRyb2xsZXIuanMgMjAxOC0wNC0xOFxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTggR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogIyMgT3JkZXJzIFRhYmxlIENvbnRyb2xsZXJcbiAqXG4gKiBUaGlzIGNvbnRyb2xsZXIgY29udGFpbnMgdGhlIG1hcHBpbmcgbG9naWMgb2YgdGhlIGNhdGVnb3JpZXMvYXJ0aWNsZXMgbXVsdGkgc2VsZWN0IGFjdGlvbnMgZm9yIHRoZSBidXR0b25cbiAqIGRyb3Bkb3duIChvbiB0aGUgYm90dG9tKS5cbiAqXG4gKiBAbW9kdWxlIENvbXBhdGliaWxpdHkvY2F0ZWdvcmllc19tdWx0aV9hY3Rpb25fY29udHJvbGxlclxuICovXG5neC5jb21wYXRpYmlsaXR5Lm1vZHVsZShcbiAgICAnY2F0ZWdvcmllc19tdWx0aV9hY3Rpb25fY29udHJvbGxlcicsXG4gICAgXG4gICAgW1xuICAgICAgICBneC5zb3VyY2UgKyAnL2xpYnMvYnV0dG9uX2Ryb3Bkb3duJ1xuICAgIF0sXG4gICAgXG4gICAgLyoqICBAbGVuZHMgbW9kdWxlOkNvbXBhdGliaWxpdHkvY2F0ZWdvcmllc19tdWx0aV9hY3Rpb25fY29udHJvbGxlciAqL1xuICAgIFxuICAgIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgXG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAvLyBWQVJJQUJMRVMgREVGSU5JVElPTlxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgXG4gICAgICAgIHZhclxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdmFyIHtvYmplY3R9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBEZWZhdWx0IE9wdGlvbnNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBkZWZhdWx0cyA9IHt9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIERyb3Bkb3duIGJ1dHRvbiBzZWxlY3RvclxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICAkZHJvcGRvd24gPSAkdGhpcy5maW5kKCcuanMtYm90dG9tLWRyb3Bkb3duJyksXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogSW5wdXQgZmllbGRzXG4gICAgICAgICAgICAgKiBAdHlwZSB7KnxqUXVlcnl8SFRNTEVsZW1lbnR9XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICRpbnB1dHMgPSAkKCd0cltkYXRhLWlkXSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBGaW5hbCBPcHRpb25zXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHZhciB7b2JqZWN0fVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBNb2R1bGUgT2JqZWN0XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgbW9kdWxlID0ge307XG4gICAgICAgIFxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gUFJJVkFURSBNRVRIT0RTXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgVXJsIFBhcmFtZXRlclxuICAgICAgICAgKlxuICAgICAgICAgKiBHZXRzIGEgc3BlY2lmaWMgVVJMIGdldCBwYXJhbWV0ZXIgZnJvbSB0aGUgYWRkcmVzcyBiYXIsXG4gICAgICAgICAqIHdoaWNoIG5hbWUgc2hvdWxkIGJlIHByb3ZpZGVkIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1ldGVyTmFtZVxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9nZXRVcmxQYXJhbWV0ZXIgPSBmdW5jdGlvbihwYXJhbWV0ZXJOYW1lKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IG5ldyBSZWdFeHAoJ1tcXD8mXScgKyBwYXJhbWV0ZXJOYW1lICsgJz0oW14mI10qKScpLmV4ZWMod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0c1sxXSB8fCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmVwYXJlIEZvcm1cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3QgfCBqUXVlcnl9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgXyRwcmVwYXJlRm9ybSA9IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgICAgICAgdmFyIGNQYXRoO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9jUGF0aD0oLiopLylbMV07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY1BhdGggPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgcGFnZV90b2tlbiA9ICQoJ2lucHV0W25hbWU9XCJwYWdlX3Rva2VuXCJdOmZpcnN0JykuYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZvcm1VcmwgPSBbXG4gICAgICAgICAgICAgICAgX2dldFNvdXJjZVBhdGgoKSxcbiAgICAgICAgICAgICAgICAnY2F0ZWdvcmllcy5waHAnLFxuICAgICAgICAgICAgICAgICc/YWN0aW9uPW11bHRpX2FjdGlvbidcbiAgICAgICAgICAgIF0uam9pbignJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjUGF0aCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9ybVVybCArPSAnJmNQYXRoPScgKyBjUGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNlYXJjaCA9IF9nZXRVcmxQYXJhbWV0ZXIoJ3NlYXJjaCcpO1xuICAgICAgICAgICAgaWYgKHNlYXJjaCAhPT0gMCAmJiBzZWFyY2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3JtVXJsICs9ICgnJnNlYXJjaD0nICsgc2VhcmNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHBhZ2UgPSBfZ2V0VXJsUGFyYW1ldGVyKCdwYWdlJyk7XG4gICAgICAgICAgICBpZiAocGFnZSAhPT0gMCAmJiBwYWdlICE9PSBudWxsICYmIGZvcm1VcmwuaW5kZXhPZigncGFnZT0nKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBmb3JtVXJsICs9ICcmcGFnZT0nICsgcGFnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNvcnRpbmcgPSBfZ2V0VXJsUGFyYW1ldGVyKCdzb3J0aW5nJyk7XG4gICAgICAgICAgICBpZiAoc29ydGluZyAhPT0gMCAmJiBzb3J0aW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9ybVVybCArPSAnJnNvcnRpbmc9JyArIHNvcnRpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQoJzxmb3JtIG5hbWU9XCJtdWx0aV9hY3Rpb25fZm9ybVwiIG1ldGhvZD1cInBvc3RcIiBhY3Rpb249JyArIGZvcm1VcmwgKyAnPjwvZm9ybT4nKTtcbiAgICAgICAgICAgICRmb3JtLmFwcGVuZCgnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY3BhdGhcIiB2YWx1ZT0nICsgY1BhdGggKyAnPicpO1xuICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJwYWdlX3Rva2VuXCIgdmFsdWU9JyArIHBhZ2VfdG9rZW4gKyAnPicpO1xuICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCc8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9JyArIGFjdGlvbiArICcgdmFsdWU9XCJBY3Rpb25cIj4nKTtcbiAgICAgICAgICAgICRmb3JtLmFwcGVuZFRvKCdib2R5Jyk7XG4gICAgICAgICAgICByZXR1cm4gJGZvcm07XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB2YXIgX3NlY3Rpb25NYXBwaW5nID0ge1xuICAgICAgICAgICAgZGVsZXRlOiAnYnV0dG9ucycsXG4gICAgICAgICAgICBCVVRUT05fTU9WRTogJ2FkbWluX2J1dHRvbnMnLFxuICAgICAgICAgICAgQlVUVE9OX0NPUFk6ICdhZG1pbl9idXR0b25zJyxcbiAgICAgICAgICAgIEJVVFRPTl9TVEFUVVNfT046ICdhZG1pbl9idXR0b25zJyxcbiAgICAgICAgICAgIEJVVFRPTl9TVEFUVVNfT0ZGOiAnYWRtaW5fYnV0dG9ucydcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNYXAgYWN0aW9ucyBmb3IgdGhlIGRyb3Bkb3duIGJ1dHRvblxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIG1hcCB0aGUgYWN0aW9ucyBmb3IgbXVsdGlwbGUgc2VsZWN0cy5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBfbWFwTXVsdGlBY3Rpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9ucyA9IFtcbiAgICAgICAgICAgICAgICAnZGVsZXRlJyxcbiAgICAgICAgICAgICAgICAnQlVUVE9OX01PVkUnLFxuICAgICAgICAgICAgICAgICdCVVRUT05fQ09QWScsXG4gICAgICAgICAgICAgICAgJ0JVVFRPTl9TVEFUVVNfT04nLFxuICAgICAgICAgICAgICAgICdCVVRUT05fU1RBVFVTX09GRidcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGluZGV4IGluIGFjdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBfbWFwQWN0aW9uKGFjdGlvbnNbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBfbWFwQWN0aW9uID0gZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IF9zZWN0aW9uTWFwcGluZ1thY3Rpb25dLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gX2dldEFjdGlvbkNhbGxiYWNrKGFjdGlvbik7XG4gICAgICAgICAgICBqc2UubGlicy5idXR0b25fZHJvcGRvd24ubWFwQWN0aW9uKCRkcm9wZG93biwgYWN0aW9uLCBzZWN0aW9uLCBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB2YXIgX2NhbGxiYWNrRGVsZXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIERvIG5vdCBkbyBhbnl0aGluZyB3aGVuIG5vIHByb2R1Y3QvY2F0ZWdvcnkgaXMgY2hlY2tlZFxuICAgICAgICAgICAgaWYgKCEkaW5wdXRzLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFN1Ym1pdCBjYWNoZWQgZm9ybVxuICAgICAgICAgICAgdmFyICRmb3JtID0gXyRwcmVwYXJlRm9ybSgnbXVsdGlfZGVsZXRlJyk7XG4gICAgICAgICAgICAkaW5wdXRzLmZpbHRlcignOmNoZWNrZWQnKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBfY2FsbGJhY2tNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIERvIG5vdCBkbyBhbnl0aGluZyB3aGVuIG5vIHByb2R1Y3QvY2F0ZWdvcnkgaXMgY2hlY2tlZFxuICAgICAgICAgICAgaWYgKCEkaW5wdXRzLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFN1Ym1pdCBjYWNoZWQgZm9ybVxuICAgICAgICAgICAgdmFyICRmb3JtID0gXyRwcmVwYXJlRm9ybSgnbXVsdGlfbW92ZScpO1xuICAgICAgICAgICAgJGlucHV0cy5maWx0ZXIoJzpjaGVja2VkJykuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB2YXIgX2NhbGxiYWNrQ29weSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBEbyBub3QgZG8gYW55dGhpbmcgd2hlbiBubyBwcm9kdWN0L2NhdGVnb3J5IGlzIGNoZWNrZWRcbiAgICAgICAgICAgIGlmICghJGlucHV0cy5maWx0ZXIoJzpjaGVja2VkJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBTdWJtaXQgY2FjaGVkIGZvcm1cbiAgICAgICAgICAgIHZhciAkZm9ybSA9IF8kcHJlcGFyZUZvcm0oJ211bHRpX2NvcHknKTtcbiAgICAgICAgICAgICRpbnB1dHMuZmlsdGVyKCc6Y2hlY2tlZCcpLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgdmFyIF9jYWxsYmFja1N0YXR1c09uID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIERvIG5vdCBkbyBhbnl0aGluZyB3aGVuIG5vIHByb2R1Y3QvY2F0ZWdvcnkgaXMgY2hlY2tlZFxuICAgICAgICAgICAgaWYgKCEkaW5wdXRzLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFN1Ym1pdCBjYWNoZWQgZm9ybVxuICAgICAgICAgICAgdmFyICRmb3JtID0gXyRwcmVwYXJlRm9ybSgnbXVsdGlfc3RhdHVzX29uJyk7XG4gICAgICAgICAgICAkaW5wdXRzLmZpbHRlcignOmNoZWNrZWQnKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBfY2FsbGJhY2tTdGF0dXNPZmYgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy8gRG8gbm90IGRvIGFueXRoaW5nIHdoZW4gbm8gcHJvZHVjdC9jYXRlZ29yeSBpcyBjaGVja2VkXG4gICAgICAgICAgICBpZiAoISRpbnB1dHMuZmlsdGVyKCc6Y2hlY2tlZCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gU3VibWl0IGNhY2hlZCBmb3JtXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSBfJHByZXBhcmVGb3JtKCdtdWx0aV9zdGF0dXNfb2ZmJyk7XG4gICAgICAgICAgICAkaW5wdXRzLmZpbHRlcignOmNoZWNrZWQnKS5hcHBlbmRUbygkZm9ybSk7XG4gICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHZhciBfZ2V0QWN0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbihhY3Rpb24pIHtcbiAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jYWxsYmFja0RlbGV0ZTtcbiAgICAgICAgICAgICAgICBjYXNlICdCVVRUT05fTU9WRSc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY2FsbGJhY2tNb3ZlO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0JVVFRPTl9DT1BZJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jYWxsYmFja0NvcHk7XG4gICAgICAgICAgICAgICAgY2FzZSAnQlVUVE9OX1NUQVRVU19PTic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY2FsbGJhY2tTdGF0dXNPbjtcbiAgICAgICAgICAgICAgICBjYXNlICdCVVRUT05fU1RBVFVTX09GRic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY2FsbGJhY2tTdGF0dXNPZmY7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hbGVydCgnX2dldEFjdGlvbkNhbGxiYWNrOiBBY3Rpb24gbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgcGF0aCBvZiB0aGUgYWRtaW4gZm9sZGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2dldFNvdXJjZVBhdGggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luLFxuICAgICAgICAgICAgICAgIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzcGxpdHRlZFBhdGggPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICBzcGxpdHRlZFBhdGgucG9wKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBqb2luZWRQYXRoID0gc3BsaXR0ZWRQYXRoLmpvaW4oJy8nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHVybCArIGpvaW5lZFBhdGggKyAnLyc7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gSU5JVElBTElaQVRJT05cbiAgICAgICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIFxuICAgICAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uKGRvbmUpIHtcbiAgICAgICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIGRyb3Bkb3duIGlzIGZpbGxlZFxuICAgICAgICAgICAgdmFyIGludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJy5qcy1idXR0b24tZHJvcGRvd24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICBfbWFwTXVsdGlBY3Rpb25zKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICB9KTtcbiJdfQ==
