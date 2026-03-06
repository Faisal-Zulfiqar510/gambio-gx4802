'use strict';

/* --------------------------------------------------------------
 payment_shipping_matrix.js 2018-05-28
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2018 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

gx.controllers.module(
// controller name
'payment_shipping_matrix',

// controller libraries
['xhr'],

// controller business logic
function (data) {
    'use strict';

    // variables
    /**
     * Controller reference.
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Default options for controller,
     *
     * @type {object}
     */
    var defaults = {};

    /**
     * Final controller options.
     *
     * @type {object}
     */
    var options = $.extend(true, {}, defaults, data);

    /**
     * Module object.
     *
     * @type {{}}
     */
    var module = {};

    var $modalBody = $this.find('.modal-body');

    var $modalFooter = $this.find('.modal-footer');

    var $modalInfoRow = void 0;

    var $countrySwitcher = void 0;

    var $countrySelectionTable = void 0;

    var languages = void 0;

    var oldData = void 0;

    // private methods
    var _initCountrySelection = function _initCountrySelection() {
        $modalBody.empty().append(_renderModalInfo());
        _renderCountryTable(true);
    };

    var _renderModalInfo = function _renderModalInfo() {
        $modalInfoRow = $('<div/>', { 'class': 'row', 'data-gx-widget': 'switcher' });
        var $descriptionCol = $('<div/>', { 'class': 'col-md-6' }).appendTo($modalInfoRow);
        var $selectionCol = $('<div/>', { 'class': 'col-md-6' }).appendTo($modalInfoRow);
        var $formGroup = $('<div/>', { 'class': 'form-group' }).appendTo($selectionCol);

        $('<span/>', {
            'class': 'modal-info',
            'text': jse.core.lang.translate('select_countries', 'shipping_and_payment_matrix')
        }).appendTo($descriptionCol);

        $('<label/>', {
            'class': 'col-md-10 text-right',
            'text': jse.core.lang.translate('show_only_enabled_countries', 'shipping_and_payment_matrix')
        }).appendTo($formGroup);
        $countrySwitcher = $('<input/>', {
            'type': 'checkbox',
            'checked': true,
            'class': 'col-md-2 show-all-countries'
        }).appendTo($formGroup);

        return $modalInfoRow;
    };

    var _renderCountryTable = function _renderCountryTable(activeOnly) {
        jse.libs.xhr.get({
            'url': './admin.php?do=ShippingPaymentMatrixAjax/getCountryList'
        }).then(function (response) {
            var i = 0;
            languages = response.languages;
            oldData = [];

            if ($modalBody.find('table').length > 0) {
                $modalBody.find('table').remove();
            }

            $countrySelectionTable = $('<table/>', { 'class': 'table', 'data-gx-widget': 'switcher' }).appendTo($modalBody);
            var $tHead = $('<thead/>').appendTo($countrySelectionTable);
            var $tBody = $('<tbody/>').appendTo($countrySelectionTable);
            var $headRow = $('<tr/>').appendTo($tHead);
            $('<th/>', { 'text': jse.core.lang.translate('country', 'shipping_and_payment_matrix') }).appendTo($headRow);
            $('<th/>', { 'text': jse.core.lang.translate('status', 'shipping_and_payment_matrix') }).appendTo($headRow);

            for (; i < response.countries.length; i++) {
                if (response.countries[i].data) {
                    oldData.push(response.countries[i].data);
                }

                if (undefined !== activeOnly && activeOnly) {
                    if (response.countries[i].active) {
                        var $row = $('<tr/>').appendTo($tBody);
                        $('<td/>', { 'text': response.countries[i].name }).appendTo($row);
                        var $statusCol = $('<td/>').appendTo($row);
                        $('<input/>', {
                            'type': 'checkbox',
                            'checked': true,
                            'value': response.countries[i].id,
                            'data-code': response.countries[i].code,
                            'data-lang-id': response.countries[i].languageId || ''
                        }).appendTo($statusCol);
                    }
                } else {
                    var _$row = $('<tr/>').appendTo($tBody);
                    $('<td/>', { 'text': response.countries[i].name }).appendTo(_$row);
                    var _$statusCol = $('<td/>').appendTo(_$row);
                    $('<input/>', {
                        'type': 'checkbox',
                        'checked': response.countries[i].active === true,
                        'value': response.countries[i].id,
                        'data-code': response.countries[i].code,
                        'data-lang-id': response.countries[i].languageId || ''
                    }).appendTo(_$statusCol);
                }
            }

            $modalFooter.empty().append($('<button/>', {
                'class': 'btn btn-default further',
                'type': 'button',
                'text': jse.core.lang.translate('button_forward', 'shipping_and_payment_matrix')
            }));

            gx.widgets.init($modalBody);
            _setEventListener();
        });
    };

    var _getSelectedCountries = function _getSelectedCountries() {
        var countries = [];
        $countrySelectionTable.find('input[type="checkbox"]:checked').each(function (index, input) {
            countries.push({
                'id': $(input).val(),
                'name': $(input).parents('tr').first().find('td').first().text(),
                'code': $(input).data('code'),
                'languageId': $(input).data('lang-id')
            });
        });

        return countries;
    };

    var _renderFormTable = function _renderFormTable(countries) {
        var $nav = $('<ul/>', {
            'class': 'nav nav-tabs',
            'role': 'tablist'
        }).appendTo($modalBody);
        var $tabContent = $('<div>', { 'class': 'tab-content' }).appendTo($modalBody);

        for (var i = 0; i < languages.length; i++) {
            var $navIcon = $('<span/>', { 'class': 'flag-icon flag-icon-' + languages[i].code.toLowerCase() });
            var $navLink = $('<a/>', {
                'href': '#payment-shipping-matrix-form-' + languages[i].code,
                'data-language': languages[i].code,
                'aria-controls': 'home',
                'role': 'tab',
                'data-toggle': 'tab'
            }).append($navIcon);
            var $navItem = $('<li/>', { 'role': 'presentation' }).append($navLink);
            $nav.append($navItem);

            var $tabPanel = $('<div/>', {
                'role': 'tabpanel',
                'class': 'tab-pane fade',
                'id': 'payment-shipping-matrix-form-' + languages[i].code,
                'data-language': languages[i].code
            }).appendTo($tabContent);

            var $matrixFormTable = $('<table/>', { 'class': 'table' }).appendTo($tabPanel);

            if (i === 0) {
                $navItem.addClass('active');
                $tabPanel.addClass('active in');
            }

            var $tHead = $('<thead/>').appendTo($matrixFormTable);
            var $tBody = $('<tbody/>').appendTo($matrixFormTable);

            var $headRow = $('<tr/>').appendTo($tHead);
            $('<th/>', { 'text': jse.core.lang.translate('country', 'shipping_and_payment_matrix') }).appendTo($headRow);
            $('<th/>', { 'text': jse.core.lang.translate('shipping_costs', 'shipping_and_payment_matrix') }).appendTo($headRow);
            $('<th/>', { 'text': jse.core.lang.translate('shipping_time', 'shipping_and_payment_matrix') }).appendTo($headRow);
            $('<th/>', { 'text': jse.core.lang.translate('payment_methods', 'shipping_and_payment_matrix') }).appendTo($headRow);

            var j = 0;
            for (; j < countries.length; j++) {
                var $row = $('<tr/>').appendTo($tBody);
                var langCode = countries[j].code;

                $('<td/>', { 'text': countries[j].name }).appendTo($row);

                var $shippingInfoTextArea = $('<textarea/>', {
                    'name': 'shipping_info[' + languages[i].id + '][' + langCode + ']'
                });
                $('<td/>').append($shippingInfoTextArea).appendTo($row);

                var $shippingTimeTextArea = $('<textarea/>', {
                    'name': 'shipping_time[' + languages[i].id + '][' + langCode + ']'
                });
                $('<td/>').append($shippingTimeTextArea).appendTo($row);

                var $paymentInfoTextArea = $('<textarea/>', {
                    'name': 'payment_info[' + languages[i].id + '][' + langCode + ']'
                });
                $('<td/>').append($paymentInfoTextArea).appendTo($row);

                for (var k = 0; k < oldData.length; k++) {

                    if (Number(languages[i].id) in oldData[k]) {
                        if (countries[j].code.toUpperCase() in oldData[k][languages[i].id]) {
                            $shippingInfoTextArea.val(oldData[k][languages[i].id][countries[j].code.toUpperCase()].shippingInfo);
                            $shippingTimeTextArea.val(oldData[k][languages[i].id][countries[j].code.toUpperCase()].shippingTime);
                            $paymentInfoTextArea.val(oldData[k][languages[i].id][countries[j].code.toUpperCase()].paymentInfo);
                        }
                    }
                }
            }
        }

        $countrySelectionTable.remove();
        _renderFormModalActions();
    };

    var _renderFormModalActions = function _renderFormModalActions() {
        $modalFooter.empty();
        var $backBtn = $('<button/>', {
            'class': 'btn btn-default',
            'text': jse.core.lang.translate('button_back', 'shipping_and_payment_matrix')
        }).appendTo($modalFooter);
        var $storeBtn = $('<button/>', {
            'class': 'btn btn-primary',
            'text': jse.core.lang.translate('button_save_and_close', 'shipping_and_payment_matrix')
        }).appendTo($modalFooter);

        $backBtn.on('click', function () {
            $modalBody.empty().append(_renderModalInfo());
            _renderCountryTable(true);
        });
        $storeBtn.on('click', function () {
            jse.libs.xhr.post({
                'url': './admin.php?do=ShippingPaymentMatrixAjax/save',
                'data': $modalBody.find('textarea').serializeArray()
            }).then(function (r) {
                $this.modal('hide');
                jse.libs.info_box.addSuccessMessage(jse.core.lang.translate('save_success', 'shipping_and_payment_matrix'));
            });
        });
    };

    var _setEventListener = function _setEventListener() {
        $countrySwitcher.off().on('change', function (e) {
            _renderCountryTable($(e.currentTarget).prop('checked'));
        });
        $this.find('.further').off().on('click', function (e) {
            $modalInfoRow.remove();
            _renderFormTable(_getSelectedCountries());
        });
    };

    // event handler

    // initialization
    module.init = function (done) {
        // initialization logic

        $this.on('show.bs.modal', _initCountrySelection);

        done();
    };

    return module;
}); // way to easy
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnRfbWFuYWdlci9wYXltZW50X3NoaXBwaW5nX21hdHJpeC5qcyJdLCJuYW1lcyI6WyJneCIsImNvbnRyb2xsZXJzIiwibW9kdWxlIiwiZGF0YSIsIiR0aGlzIiwiJCIsImRlZmF1bHRzIiwib3B0aW9ucyIsImV4dGVuZCIsIiRtb2RhbEJvZHkiLCJmaW5kIiwiJG1vZGFsRm9vdGVyIiwiJG1vZGFsSW5mb1JvdyIsIiRjb3VudHJ5U3dpdGNoZXIiLCIkY291bnRyeVNlbGVjdGlvblRhYmxlIiwibGFuZ3VhZ2VzIiwib2xkRGF0YSIsIl9pbml0Q291bnRyeVNlbGVjdGlvbiIsImVtcHR5IiwiYXBwZW5kIiwiX3JlbmRlck1vZGFsSW5mbyIsIl9yZW5kZXJDb3VudHJ5VGFibGUiLCIkZGVzY3JpcHRpb25Db2wiLCJhcHBlbmRUbyIsIiRzZWxlY3Rpb25Db2wiLCIkZm9ybUdyb3VwIiwianNlIiwiY29yZSIsImxhbmciLCJ0cmFuc2xhdGUiLCJsaWJzIiwieGhyIiwiZ2V0IiwidGhlbiIsImkiLCJyZXNwb25zZSIsImxlbmd0aCIsInJlbW92ZSIsIiR0SGVhZCIsIiR0Qm9keSIsIiRoZWFkUm93IiwiY291bnRyaWVzIiwicHVzaCIsInVuZGVmaW5lZCIsImFjdGl2ZU9ubHkiLCJhY3RpdmUiLCIkcm93IiwibmFtZSIsIiRzdGF0dXNDb2wiLCJpZCIsImNvZGUiLCJsYW5ndWFnZUlkIiwid2lkZ2V0cyIsImluaXQiLCJfc2V0RXZlbnRMaXN0ZW5lciIsIl9nZXRTZWxlY3RlZENvdW50cmllcyIsImVhY2giLCJpbmRleCIsImlucHV0IiwidmFsIiwicGFyZW50cyIsImZpcnN0IiwidGV4dCIsIl9yZW5kZXJGb3JtVGFibGUiLCIkbmF2IiwiJHRhYkNvbnRlbnQiLCIkbmF2SWNvbiIsInRvTG93ZXJDYXNlIiwiJG5hdkxpbmsiLCIkbmF2SXRlbSIsIiR0YWJQYW5lbCIsIiRtYXRyaXhGb3JtVGFibGUiLCJhZGRDbGFzcyIsImoiLCJsYW5nQ29kZSIsIiRzaGlwcGluZ0luZm9UZXh0QXJlYSIsIiRzaGlwcGluZ1RpbWVUZXh0QXJlYSIsIiRwYXltZW50SW5mb1RleHRBcmVhIiwiayIsIk51bWJlciIsInRvVXBwZXJDYXNlIiwic2hpcHBpbmdJbmZvIiwic2hpcHBpbmdUaW1lIiwicGF5bWVudEluZm8iLCJfcmVuZGVyRm9ybU1vZGFsQWN0aW9ucyIsIiRiYWNrQnRuIiwiJHN0b3JlQnRuIiwib24iLCJwb3N0Iiwic2VyaWFsaXplQXJyYXkiLCJtb2RhbCIsImluZm9fYm94IiwiYWRkU3VjY2Vzc01lc3NhZ2UiLCJvZmYiLCJlIiwiY3VycmVudFRhcmdldCIsInByb3AiLCJkb25lIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUFBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZjtBQUNJO0FBQ0EseUJBRko7O0FBSUk7QUFDQSxDQUFDLEtBQUQsQ0FMSjs7QUFPSTtBQUNBLFVBQVVDLElBQVYsRUFBZ0I7QUFDWjs7QUFFQTtBQUNBOzs7Ozs7QUFLQSxRQUFNQyxRQUFRQyxFQUFFLElBQUYsQ0FBZDs7QUFFQTs7Ozs7QUFLQSxRQUFNQyxXQUFXLEVBQWpCOztBQUVBOzs7OztBQUtBLFFBQU1DLFVBQVVGLEVBQUVHLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQkYsUUFBbkIsRUFBNkJILElBQTdCLENBQWhCOztBQUVBOzs7OztBQUtBLFFBQU1ELFNBQVMsRUFBZjs7QUFFQSxRQUFNTyxhQUFhTCxNQUFNTSxJQUFOLENBQVcsYUFBWCxDQUFuQjs7QUFFQSxRQUFNQyxlQUFlUCxNQUFNTSxJQUFOLENBQVcsZUFBWCxDQUFyQjs7QUFFQSxRQUFJRSxzQkFBSjs7QUFFQSxRQUFJQyx5QkFBSjs7QUFFQSxRQUFJQywrQkFBSjs7QUFFQSxRQUFJQyxrQkFBSjs7QUFFQSxRQUFJQyxnQkFBSjs7QUFFQTtBQUNBLFFBQU1DLHdCQUF3QixTQUF4QkEscUJBQXdCLEdBQU07QUFDaENSLG1CQUFXUyxLQUFYLEdBQW1CQyxNQUFuQixDQUEwQkMsa0JBQTFCO0FB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QUFDckNsRSxnQ0FBb0JoQixFQUFFeUYsRUFBRUMsYUFBSixFQUFtQkMsSUFBbkIsQ0FBd0IsU0FBeEIsQ0FBcEI7QUFDSCxTQUZEO0FBR0E1RixjQUFNTSxJQUFOLENBQVcsVUFBWCxFQUF1Qm1GLEdBQXZCLEdBQTZCTixFQUE3QixDQUFnQyxPQUFoQyxFQUF5QyxhQUFLO0FBQzFDM0UsMEJBQWN5QixNQUFkO0FBQ0EwQiw2QkFBaUJSLHVCQUFqQjtBQUNILFNBSEQ7QUFJSCxLQVJEOztBQVVBOztBQUVBO0FBQ0FyRCxXQUFPbUQsSUFBUCxHQUFjLGdCQUFRO0FBQ2xCOztBQUVBakQsY0FBTW1GLEVBQU4sQ0FBUyxlQUFULEVBQTBCdEUscUJBQTFCOztBQUVBZ0Y7QUFDSCxLQU5EOztBQVFBLFdBQU8vRixNQUFQO0FBQ0gsQ0FoVEwsRSxDQWlURyIsImZpbGUiOiJjb250ZW50X21hbmFnZXIvcGF5bWVudF9zaGlwcGluZ19tYXRyaXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIHBheW1lbnRfc2hpcHBpbmdfbWF0cml4LmpzIDIwMTgtMDUtMjhcbiBHYW1iaW8gR21iSFxuIGh0dHA6Ly93d3cuZ2FtYmlvLmRlXG4gQ29weXJpZ2h0IChjKSAyMDE4IEdhbWJpbyBHbWJIXG4gUmVsZWFzZWQgdW5kZXIgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIChWZXJzaW9uIDIpXG4gW2h0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy9ncGwtMi4wLmh0bWxdXG4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG5neC5jb250cm9sbGVycy5tb2R1bGUoXG4gICAgLy8gY29udHJvbGxlciBuYW1lXG4gICAgJ3BheW1lbnRfc2hpcHBpbmdfbWF0cml4JyxcblxuICAgIC8vIGNvbnRyb2xsZXIgbGlicmFyaWVzXG4gICAgWyd4aHInXSxcblxuICAgIC8vIGNvbnRyb2xsZXIgYnVzaW5lc3MgbG9naWNcbiAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb250cm9sbGVyIHJlZmVyZW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2pRdWVyeX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zIGZvciBjb250cm9sbGVyLFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluYWwgY29udHJvbGxlciBvcHRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0cywgZGF0YSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZHVsZSBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgICAgIGNvbnN0ICRtb2RhbEJvZHkgPSAkdGhpcy5maW5kKCcubW9kYWwtYm9keScpO1xuXG4gICAgICAgIGNvbnN0ICRtb2RhbEZvb3RlciA9ICR0aGlzLmZpbmQoJy5tb2RhbC1mb290ZXInKTtcblxuICAgICAgICBsZXQgJG1vZGFsSW5mb1JvdztcblxuICAgICAgICBsZXQgJGNvdW50cnlTd2l0Y2hlcjtcblxuICAgICAgICBsZXQgJGNvdW50cnlTZWxlY3Rpb25UYWJsZTtcblxuICAgICAgICBsZXQgbGFuZ3VhZ2VzO1xuXG4gICAgICAgIGxldCBvbGREYXRhO1xuXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xuICAgICAgICBjb25zdCBfaW5pdENvdW50cnlTZWxlY3Rpb24gPSAoKSA9PiB7XG4gICAgICAgICAgICAkbW9kYWxCb2R5LmVtcHR5KCkuYXBwZW5kKF9yZW5kZXJNb2RhbEluZm8oKSk7XG4gICAgICAgICAgICBfcmVuZGVyQ291bnRyeVRhYmxlKHRydWUpXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX3JlbmRlck1vZGFsSW5mbyA9ICgpID0+IHtcbiAgICAgICAgICAgICRtb2RhbEluZm9Sb3cgPSAkKCc8ZGl2Lz4nLCB7J2NsYXNzJzogJ3JvdycsICdkYXRhLWd4LXdpZGdldCc6ICdzd2l0Y2hlcid9KTtcbiAgICAgICAgICAgIGNvbnN0ICRkZXNjcmlwdGlvbkNvbCA9ICQoJzxkaXYvPicsIHsnY2xhc3MnOiAnY29sLW1kLTYnfSkuYXBwZW5kVG8oJG1vZGFsSW5mb1Jvdyk7XG4gICAgICAgICAgICBjb25zdCAkc2VsZWN0aW9uQ29sID0gJCgnPGRpdi8+JywgeydjbGFzcyc6ICdjb2wtbWQtNid9KS5hcHBlbmRUbygkbW9kYWxJbmZvUm93KTtcbiAgICAgICAgICAgIGNvbnN0ICRmb3JtR3JvdXAgPSAkKCc8ZGl2Lz4nLCB7J2NsYXNzJzogJ2Zvcm0tZ3JvdXAnfSkuYXBwZW5kVG8oJHNlbGVjdGlvbkNvbCk7XG5cbiAgICAgICAgICAgICQoJzxzcGFuLz4nLCB7XG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ21vZGFsLWluZm8nLFxuICAgICAgICAgICAgICAgICd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3NlbGVjdF9jb3VudHJpZXMnLCAnc2hpcHBpbmdfYW5kX3BheW1lbnRfbWF0cml4JylcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKCRkZXNjcmlwdGlvbkNvbCk7XG5cbiAgICAgICAgICAgICQoJzxsYWJlbC8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICdjb2wtbWQtMTAgdGV4dC1yaWdodCcsXG4gICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2hvd19vbmx5X2VuYWJsZWRfY291bnRyaWVzJywgJ3NoaXBwaW5nX2FuZF9wYXltZW50X21hdHJpeCcpXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkZm9ybUdyb3VwKTtcbiAgICAgICAgICAgICRjb3VudHJ5U3dpdGNoZXIgPVxuICAgICAgICAgICAgICAgICQoJzxpbnB1dC8+Jywge1xuICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdjaGVja2JveCcsXG4gICAgICAgICAgICAgICAgICAgICdjaGVja2VkJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgJ2NsYXNzJzogJ2NvbC1tZC0yIHNob3ctYWxsLWNvdW50cmllcydcbiAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbygkZm9ybUdyb3VwKTtcblxuICAgICAgICAgICAgcmV0dXJuICRtb2RhbEluZm9Sb3c7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX3JlbmRlckNvdW50cnlUYWJsZSA9IGFjdGl2ZU9ubHkgPT4ge1xuICAgICAgICAgICAganNlLmxpYnMueGhyLmdldCh7XG4gICAgICAgICAgICAgICAgJ3VybCc6ICcuL2FkbWluLnBocD9kbz1TaGlwcGluZ1BheW1lbnRNYXRyaXhBamF4L2dldENvdW50cnlMaXN0J1xuICAgICAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIGxhbmd1YWdlcyA9IHJlc3BvbnNlLmxhbmd1YWdlcztcbiAgICAgICAgICAgICAgICBvbGREYXRhID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAoJG1vZGFsQm9keS5maW5kKCd0YWJsZScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJG1vZGFsQm9keS5maW5kKCd0YWJsZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRjb3VudHJ5U2VsZWN0aW9uVGFibGUgPVxuICAgICAgICAgICAgICAgICAgICAkKCc8dGFibGUvPicsIHsnY2xhc3MnOiAndGFibGUnLCAnZGF0YS1neC13aWRnZXQnOiAnc3dpdGNoZXInfSkuYXBwZW5kVG8oJG1vZGFsQm9keSk7XG4gICAgICAgICAgICAgICAgY29uc3QgJHRIZWFkID0gJCgnPHRoZWFkLz4nKS5hcHBlbmRUbygkY291bnRyeVNlbGVjdGlvblRhYmxlKTtcbiAgICAgICAgICAgICAgICBjb25zdCAkdEJvZHkgPSAkKCc8dGJvZHkvPicpLmFwcGVuZFRvKCRjb3VudHJ5U2VsZWN0aW9uVGFibGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICRoZWFkUm93ID0gJCgnPHRyLz4nKS5hcHBlbmRUbygkdEhlYWQpO1xuICAgICAgICAgICAgICAgICQoJzx0aC8+Jywgeyd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ2NvdW50cnknLCAnc2hpcHBpbmdfYW5kX3BheW1lbnRfbWF0cml4Jyl9KVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJGhlYWRSb3cpO1xuICAgICAgICAgICAgICAgICQoJzx0aC8+Jywgeyd0ZXh0JzoganNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ3N0YXR1cycsICdzaGlwcGluZ19hbmRfcGF5bWVudF9tYXRyaXgnKX0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkaGVhZFJvdyk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IHJlc3BvbnNlLmNvdW50cmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuY291bnRyaWVzW2ldLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZERhdGEucHVzaChyZXNwb25zZS5jb3VudHJpZXNbaV0uZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodW5kZWZpbmVkICE9PSBhY3RpdmVPbmx5ICYmIGFjdGl2ZU9ubHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5jb3VudHJpZXNbaV0uYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0ICRyb3cgPSAkKCc8dHIvPicpLmFwcGVuZFRvKCR0Qm9keSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnPHRkLz4nLCB7J3RleHQnOiByZXNwb25zZS5jb3VudHJpZXNbaV0ubmFtZX0pLmFwcGVuZFRvKCRyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCAkc3RhdHVzQ29sID0gJCgnPHRkLz4nKS5hcHBlbmRUbygkcm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCc8aW5wdXQvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2hlY2tlZCc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHJlc3BvbnNlLmNvdW50cmllc1tpXS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtY29kZSc6IHJlc3BvbnNlLmNvdW50cmllc1tpXS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGF0YS1sYW5nLWlkJzogcmVzcG9uc2UuY291bnRyaWVzW2ldLmxhbmd1YWdlSWQgfHwgJydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbygkc3RhdHVzQ29sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCAkcm93ID0gJCgnPHRyLz4nKS5hcHBlbmRUbygkdEJvZHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnPHRkLz4nLCB7J3RleHQnOiByZXNwb25zZS5jb3VudHJpZXNbaV0ubmFtZX0pLmFwcGVuZFRvKCRyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0ICRzdGF0dXNDb2wgPSAkKCc8dGQvPicpLmFwcGVuZFRvKCRyb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnPGlucHV0Lz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnY2hlY2tib3gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjaGVja2VkJzogcmVzcG9uc2UuY291bnRyaWVzW2ldLmFjdGl2ZSA9PT0gdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiByZXNwb25zZS5jb3VudHJpZXNbaV0uaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtY29kZSc6IHJlc3BvbnNlLmNvdW50cmllc1tpXS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLWxhbmctaWQnOiByZXNwb25zZS5jb3VudHJpZXNbaV0ubGFuZ3VhZ2VJZCB8fCAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oJHN0YXR1c0NvbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkbW9kYWxGb290ZXIuZW1wdHkoKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCQoJzxidXR0b24vPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICdidG4gYnRuLWRlZmF1bHQgZnVydGhlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAndHlwZSc6ICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnYnV0dG9uX2ZvcndhcmQnLCAnc2hpcHBpbmdfYW5kX3BheW1lbnRfbWF0cml4JylcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAgICAgZ3gud2lkZ2V0cy5pbml0KCRtb2RhbEJvZHkpO1xuICAgICAgICAgICAgICAgIF9zZXRFdmVudExpc3RlbmVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBfZ2V0U2VsZWN0ZWRDb3VudHJpZXMgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJpZXMgPSBbXTtcbiAgICAgICAgICAgICRjb3VudHJ5U2VsZWN0aW9uVGFibGUuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQnKS5lYWNoKChpbmRleCwgaW5wdXQpID0+IHtcbiAgICAgICAgICAgICAgICBjb3VudHJpZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICdpZCc6ICQoaW5wdXQpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAnbmFtZSc6ICQoaW5wdXQpLnBhcmVudHMoJ3RyJykuZmlyc3QoKS5maW5kKCd0ZCcpLmZpcnN0KCkudGV4dCgpLFxuICAgICAgICAgICAgICAgICAgICAnY29kZSc6ICQoaW5wdXQpLmRhdGEoJ2NvZGUnKSxcbiAgICAgICAgICAgICAgICAgICAgJ2xhbmd1YWdlSWQnOiAkKGlucHV0KS5kYXRhKCdsYW5nLWlkJylcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gY291bnRyaWVzO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF9yZW5kZXJGb3JtVGFibGUgPSBjb3VudHJpZXMgPT4ge1xuICAgICAgICAgICAgY29uc3QgJG5hdiA9ICQoJzx1bC8+Jywge1xuICAgICAgICAgICAgICAgICdjbGFzcyc6ICduYXYgbmF2LXRhYnMnLFxuICAgICAgICAgICAgICAgICdyb2xlJzogJ3RhYmxpc3QnXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9kYWxCb2R5KTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJDb250ZW50ID0gJCgnPGRpdj4nLCB7J2NsYXNzJzogJ3RhYi1jb250ZW50J30pLmFwcGVuZFRvKCRtb2RhbEJvZHkpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhbmd1YWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCAkbmF2SWNvbiA9ICQoJzxzcGFuLz4nLCB7J2NsYXNzJzogJ2ZsYWctaWNvbiBmbGFnLWljb24tJyArIGxhbmd1YWdlc1tpXS5jb2RlLnRvTG93ZXJDYXNlKCl9KVxuICAgICAgICAgICAgICAgIGxldCAkbmF2TGluayA9ICQoJzxhLz4nLCB7XG4gICAgICAgICAgICAgICAgICAgICdocmVmJzogJyNwYXltZW50LXNoaXBwaW5nLW1hdHJpeC1mb3JtLScgKyBsYW5ndWFnZXNbaV0uY29kZSxcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEtbGFuZ3VhZ2UnOiBsYW5ndWFnZXNbaV0uY29kZSxcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiAnaG9tZScsXG4gICAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3RhYicsXG4gICAgICAgICAgICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICd0YWInXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kKCRuYXZJY29uKTtcbiAgICAgICAgICAgICAgICBsZXQgJG5hdkl0ZW0gPSAkKCc8bGkvPicsIHsncm9sZSc6ICdwcmVzZW50YXRpb24nfSkuYXBwZW5kKCRuYXZMaW5rKTtcbiAgICAgICAgICAgICAgICAkbmF2LmFwcGVuZCgkbmF2SXRlbSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgJHRhYlBhbmVsID0gJCgnPGRpdi8+Jywge1xuICAgICAgICAgICAgICAgICAgICAncm9sZSc6ICd0YWJwYW5lbCcsXG4gICAgICAgICAgICAgICAgICAgICdjbGFzcyc6ICd0YWItcGFuZSBmYWRlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogJ3BheW1lbnQtc2hpcHBpbmctbWF0cml4LWZvcm0tJyArIGxhbmd1YWdlc1tpXS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAnZGF0YS1sYW5ndWFnZSc6IGxhbmd1YWdlc1tpXS5jb2RlXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oJHRhYkNvbnRlbnQpO1xuXG4gICAgICAgICAgICAgICAgbGV0ICRtYXRyaXhGb3JtVGFibGUgPSAkKCc8dGFibGUvPicsIHsnY2xhc3MnOiAndGFibGUnfSkuYXBwZW5kVG8oJHRhYlBhbmVsKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICRuYXZJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHRhYlBhbmVsLmFkZENsYXNzKCdhY3RpdmUgaW4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkdEhlYWQgPSAkKCc8dGhlYWQvPicpLmFwcGVuZFRvKCRtYXRyaXhGb3JtVGFibGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0ICR0Qm9keSA9ICQoJzx0Ym9keS8+JykuYXBwZW5kVG8oJG1hdHJpeEZvcm1UYWJsZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkaGVhZFJvdyA9ICQoJzx0ci8+JykuYXBwZW5kVG8oJHRIZWFkKTtcbiAgICAgICAgICAgICAgICAkKCc8dGgvPicsIHsndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdjb3VudHJ5JywgJ3NoaXBwaW5nX2FuZF9wYXltZW50X21hdHJpeCcpfSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCRoZWFkUm93KTtcbiAgICAgICAgICAgICAgICAkKCc8dGgvPicsIHsndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzaGlwcGluZ19jb3N0cycsICdzaGlwcGluZ19hbmRfcGF5bWVudF9tYXRyaXgnKX0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkaGVhZFJvdyk7XG4gICAgICAgICAgICAgICAgJCgnPHRoLz4nLCB7J3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnc2hpcHBpbmdfdGltZScsICdzaGlwcGluZ19hbmRfcGF5bWVudF9tYXRyaXgnKX0pXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkaGVhZFJvdyk7XG4gICAgICAgICAgICAgICAgJCgnPHRoLz4nLCB7J3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgncGF5bWVudF9tZXRob2RzJywgJ3NoaXBwaW5nX2FuZF9wYXltZW50X21hdHJpeCcpfSlcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCRoZWFkUm93KTtcblxuICAgICAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaiA8IGNvdW50cmllcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJHJvdyA9ICQoJzx0ci8+JykuYXBwZW5kVG8oJHRCb2R5KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhbmdDb2RlID0gY291bnRyaWVzW2pdLmNvZGU7XG5cbiAgICAgICAgICAgICAgICAgICAgJCgnPHRkLz4nLCB7J3RleHQnOiBjb3VudHJpZXNbal0ubmFtZX0pLmFwcGVuZFRvKCRyb3cpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCAkc2hpcHBpbmdJbmZvVGV4dEFyZWEgPSAkKCc8dGV4dGFyZWEvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogJ3NoaXBwaW5nX2luZm9bJyArIGxhbmd1YWdlc1tpXS5pZCArICddWycgKyBsYW5nQ29kZSArICddJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnPHRkLz4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkc2hpcHBpbmdJbmZvVGV4dEFyZWEpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oJHJvdyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0ICRzaGlwcGluZ1RpbWVUZXh0QXJlYSA9ICQoJzx0ZXh0YXJlYS8+Jywge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiAnc2hpcHBpbmdfdGltZVsnICsgbGFuZ3VhZ2VzW2ldLmlkICsgJ11bJyArIGxhbmdDb2RlICsgJ10nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCc8dGQvPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCRzaGlwcGluZ1RpbWVUZXh0QXJlYSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbygkcm93KTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgJHBheW1lbnRJbmZvVGV4dEFyZWEgPSAkKCc8dGV4dGFyZWEvPicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICduYW1lJzogJ3BheW1lbnRfaW5mb1snICsgbGFuZ3VhZ2VzW2ldLmlkICsgJ11bJyArIGxhbmdDb2RlICsgJ10nXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCc8dGQvPicpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCRwYXltZW50SW5mb1RleHRBcmVhKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKCRyb3cpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgb2xkRGF0YS5sZW5ndGg7IGsrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyKGxhbmd1YWdlc1tpXS5pZCkgaW4gb2xkRGF0YVtrXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3VudHJpZXNbal0uY29kZS50b1VwcGVyQ2FzZSgpIGluIG9sZERhdGFba11bbGFuZ3VhZ2VzW2ldLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2hpcHBpbmdJbmZvVGV4dEFyZWEudmFsKG9sZERhdGFba11bbGFuZ3VhZ2VzW2ldLmlkXVtjb3VudHJpZXNbal0uY29kZS50b1VwcGVyQ2FzZSgpXS5zaGlwcGluZ0luZm8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2hpcHBpbmdUaW1lVGV4dEFyZWEudmFsKG9sZERhdGFba11bbGFuZ3VhZ2VzW2ldLmlkXVtjb3VudHJpZXNbal0uY29kZS50b1VwcGVyQ2FzZSgpXS5zaGlwcGluZ1RpbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcGF5bWVudEluZm9UZXh0QXJlYS52YWwob2xkRGF0YVtrXVtsYW5ndWFnZXNbaV0uaWRdW2NvdW50cmllc1tqXS5jb2RlLnRvVXBwZXJDYXNlKCldLnBheW1lbnRJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjb3VudHJ5U2VsZWN0aW9uVGFibGUucmVtb3ZlKCk7XG4gICAgICAgICAgICBfcmVuZGVyRm9ybU1vZGFsQWN0aW9ucygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IF9yZW5kZXJGb3JtTW9kYWxBY3Rpb25zID0gKCkgPT4ge1xuICAgICAgICAgICAgJG1vZGFsRm9vdGVyLmVtcHR5KCk7XG4gICAgICAgICAgICBjb25zdCAkYmFja0J0biA9ICQoJzxidXR0b24vPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdidXR0b25fYmFjaycsICdzaGlwcGluZ19hbmRfcGF5bWVudF9tYXRyaXgnKVxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oJG1vZGFsRm9vdGVyKTtcbiAgICAgICAgICAgIGNvbnN0ICRzdG9yZUJ0biA9ICQoJzxidXR0b24vPicsIHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAnYnRuIGJ0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdidXR0b25fc2F2ZV9hbmRfY2xvc2UnLCAnc2hpcHBpbmdfYW5kX3BheW1lbnRfbWF0cml4JylcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKCRtb2RhbEZvb3Rlcik7XG5cbiAgICAgICAgICAgICRiYWNrQnRuLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAkbW9kYWxCb2R5LmVtcHR5KCkuYXBwZW5kKF9yZW5kZXJNb2RhbEluZm8oKSk7XG4gICAgICAgICAgICAgICAgX3JlbmRlckNvdW50cnlUYWJsZSh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN0b3JlQnRuLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBqc2UubGlicy54aHIucG9zdCh7XG4gICAgICAgICAgICAgICAgICAgICd1cmwnOiAnLi9hZG1pbi5waHA/ZG89U2hpcHBpbmdQYXltZW50TWF0cml4QWpheC9zYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2RhdGEnOiAkbW9kYWxCb2R5LmZpbmQoJ3RleHRhcmVhJykuc2VyaWFsaXplQXJyYXkoKVxuICAgICAgICAgICAgICAgIH0pLnRoZW4ociA9PiB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmluZm9fYm94LmFkZFN1Y2Nlc3NNZXNzYWdlKGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdzYXZlX3N1Y2Nlc3MnLCAnc2hpcHBpbmdfYW5kX3BheW1lbnRfbWF0cml4JykpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgX3NldEV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAkY291bnRyeVN3aXRjaGVyLm9mZigpLm9uKCdjaGFuZ2UnLCBlID0+IHtcbiAgICAgICAgICAgICAgICBfcmVuZGVyQ291bnRyeVRhYmxlKCQoZS5jdXJyZW50VGFyZ2V0KS5wcm9wKCdjaGVja2VkJykpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICR0aGlzLmZpbmQoJy5mdXJ0aGVyJykub2ZmKCkub24oJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgJG1vZGFsSW5mb1Jvdy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyRm9ybVRhYmxlKF9nZXRTZWxlY3RlZENvdW50cmllcygpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGV2ZW50IGhhbmRsZXJcblxuICAgICAgICAvLyBpbml0aWFsaXphdGlvblxuICAgICAgICBtb2R1bGUuaW5pdCA9IGRvbmUgPT4ge1xuICAgICAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gbG9naWNcblxuICAgICAgICAgICAgJHRoaXMub24oJ3Nob3cuYnMubW9kYWwnLCBfaW5pdENvdW50cnlTZWxlY3Rpb24pO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgIH1cbik7IC8vIHdheSB0byBlYXN5Il19
