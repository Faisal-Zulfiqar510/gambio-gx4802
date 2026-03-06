'use strict';

/* --------------------------------------------------------------
 graduated_prices.js 2017-03-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2016 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Graduate Prices Modal Controller
 *
 * Handles the graduate prices modal functionality.
 */
gx.controllers.module('graduated_prices', ['modal', gx.source + '/libs/info_box'], function (data) {

    'use strict';

    // ------------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------------

    /**
     * Module Selector
     *
     * @type {jQuery}
     */

    var $this = $(this);

    /**
     * Module Instance
     *
     * @type {Object}
     */
    var module = {};

    // ------------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------------

    /**
     * Creates a graduated prices form row.
     *
     * @param {Object} graduatedPrice Contains the graduated price information.
     *
     * @return {jQuery} Returns the created row selector.
     */
    function _createRow(graduatedPrice) {
        var $row = $('<div />', {
            'class': 'row',
            'data-graduated-price': graduatedPrice
        });

        var $quantityFormGroup = $('<div />', {
            'class': 'form-group col-xs-4'
        });

        var $quantityLabel = $('<label />', {
            'class': 'control-label',
            'text': jse.core.lang.translate('NUMBER_OF_PIECES', 'admin_quick_edit')
        });

        var $quantityInput = $('<input />', {
            'type': 'text',
            'class': 'form-control quantity',
            'value': graduatedPrice.quantity
        });

        $quantityFormGroup.append($quantityLabel, $quantityInput);

        var $priceFormGroup = $('<div />', {
            'class': 'form-group col-xs-4'
        });

        var $priceLabel = $('<label />', {
            'class': 'control-label',
            'text': jse.core.lang.translate('PRICE', 'admin_quick_edit')
        });

        var $priceInputGroup = $('<div />', {
            'class': 'input-group'
        });

        var $priceInput = $('<input />', {
            'type': 'text',
            'class': 'form-control price',
            'value': graduatedPrice.personal_offer
        });

        var $priceInputGroupButton = $('<span />', {
            'class': 'input-group-btn'
        });

        var $deleteButton = $('<button />', {
            'class': 'btn delete',
            'html': '<i class="fa fa-trash"></i>'
        });

        if (graduatedPrice.price_id === '') {
            $deleteButton.prop('disabled', true);
        }

        $priceInputGroupButton.append($deleteButton);

        $priceInputGroup.append($priceInput, $priceInputGroupButton);

        $priceFormGroup.append($priceLabel, $priceInputGroup);

        $row.append($quantityFormGroup, $priceFormGroup);

        return $row;
    }

    /**
     * Handles AJAX request errors.
     *
     * @param {jQuery.jqXHR} jqXHR jQuery request object.
     * @param {String} textStatus Request status string.
     * @param {Error} errorThrown Thrown error object.
     */
    function _handleRequestError(jqXHR, textStatus, errorThrown) {
        jse.libs.modal.message({
            title: jse.core.lang.translate('error', 'messages'),
            content: jse.core.lang.translate('UNEXPECTED_REQUEST_ERROR', 'admin_quick_edit')
        });
    }

    /**
     * Get graduated prices for selected product.
     *
     * @param {Number} productId Selected product ID.
     *
     * @return {jQuery.jqXHR} Returns request's deferred object.
     */
    function _getGraduatedPrices(productId) {
        return $.ajax({
            method: 'GET',
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/ProductGraduatedPrices',
            data: {
                productId: productId,
                pageToken: jse.core.config.get('pageToken')
            },
            dataType: 'json'
        });
    }

    /**
     * Renders graduated prices content.
     *
     * @param {Object} graduatedPrices Contains graduated prices info for selected product.
     */
    function _displayGraduatedPrices(graduatedPrices) {
        var $modalBody = $this.find('.modal-body');

        $modalBody.empty();

        var $tabList = $('<ul />', {
            'class': 'nav nav-tabs',
            'role': 'tablist'
        });

        var $tabContent = $('<div />', {
            'class': 'tab-content'
        });

        for (var customerStatusId in graduatedPrices.data[0].customers) {
            var customerStatus = graduatedPrices.data[0].customers[customerStatusId];

            var $tab = $('<li />');

            var graduatedPricesCount = customerStatus.graduations.length ? ' (' + customerStatus.graduations.length + ')' : '';

            var $link = $('<a />', {
                'href': '#customer-status-' + customerStatusId,
                'role': 'tab',
                'data-toggle': 'tab',
                'html': customerStatus.status_name + graduatedPricesCount
            });

            $tab.append($link);

            $tabList.append($tab);

            // Add new tab container in tab content.
            var $tabPane = $('<div />', {
                'role': 'tabpanel',
                'class': 'tab-pane fade',
                'id': 'customer-status-' + customerStatusId,
                'data-customer-status-id': customerStatusId
            });

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = customerStatus.graduations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var graduation = _step.value;

                    graduation.customer_status_id = customerStatusId;
                    $tabPane.append(_createRow(graduation));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            $tabPane.append(_createRow({
                price_id: '',
                quantity: '',
                personal_offer: '',
                customer_status_id: customerStatusId
            }));

            $tabContent.append($tabPane);
        }

        $modalBody.append($tabList, $tabContent);

        // Show the first tab contents.
        $tabList.find('a:first').tab('show');
    }

    /**
     * Updates row count in tab link.
     */
    function _updateTabCounters() {
        $this.find('.tab-pane').each(function () {
            var $tabPane = $(this);
            var graduatedPricesCount = $tabPane.find('.row').length - 1;
            var $tabLink = $this.find('[href="#' + $tabPane.attr('id') + '"]');
            var countText = graduatedPricesCount > 0 ? '(' + graduatedPricesCount + ')' : '';

            if ($tabLink.text().search(/\(.*\)/) !== -1) {
                $tabLink.text($tabLink.text().replace(/\(.*\)/, countText));
            } else {
                $tabLink.text($tabLink.text() + countText);
            }
        });
    }

    /**
     * Row input key up event handler.
     */
    function _onRowInputKeyUp() {
        var $row = $(this).parents('.row:first');
        var $lastRow = $row.parents('.tab-pane').find('.row:last');

        if ($lastRow[0] === $row[0] && $row.find('input.quantity').val() !== '') {
            var $tabPane = $row.parents('.tab-pane:first');

            $row.find('.btn.delete').prop('disabled', false);

            $tabPane.append(_createRow({
                price_id: '',
                quantity: '',
                personal_offer: '',
                customer_status_id: $tabPane.data('customerStatusId')
            }));

            _updateTabCounters();
        }
    }

    /**
     * Row delete button click event handler.
     */
    function _onRowDeleteClick() {
        $(this).parents('.row:first').remove();
        _updateTabCounters();
    }

    /**
     * Graduated prices modal show event handler.
     *
     * Loads and displays graduated price info for the selected product.
     */
    function _onModalShow() {
        _getGraduatedPrices($this.data('productId')).done(_displayGraduatedPrices).fail(_handleRequestError);
    }

    /**
     * Saves graduated prices and closes the modal.
     */
    function _onSaveClick() {
        var customerStatuses = {};

        $this.find('.tab-pane').each(function (index, tabPane) {
            var $tabPane = $(tabPane);
            var customerStatusId = $tabPane.data('customerStatusId');

            customerStatuses[customerStatusId] = [];

            $tabPane.find('.row').each(function (index, row) {
                var $row = $(row);

                if ($row.is(':last-child')) {
                    return false;
                }

                customerStatuses[customerStatusId].push({
                    price_id: $row.data('price_id'),
                    quantity: $row.find('input.quantity').val(),
                    personal_offer: $row.find('input.price').val()
                });
            });

            // Add value for empty groups.
            if (!customerStatuses[customerStatusId].length) {
                customerStatuses[customerStatusId].push('empty');
            }
        });

        $.ajax({
            method: 'POST',
            url: jse.core.config.get('appUrl') + '/admin/admin.php?do=QuickEditOverviewAjax/SaveGraduatedPrices',
            data: {
                pageToken: jse.core.config.get('pageToken'),
                productId: $this.data('productId'),
                customerStatuses: customerStatuses
            },
            dataType: 'json'
        }).done(function (response) {
            $this.modal('hide');
            jse.libs.info_box.addSuccessMessage(jse.core.lang.translate('SUCCESS_PRODUCT_UPDATED', 'admin_quick_edit'));
        }).fail(_handleRequestError);
    }

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------

    module.init = function (done) {
        $this.on('click', '.btn.delete', _onRowDeleteClick).on('click', '.btn.save', _onSaveClick).on('keyup', 'input.form-control', _onRowInputKeyUp).on('show.bs.modal', _onModalShow);

        done();
    };

    return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1aWNrX2VkaXQvbW9kYWxzL2dyYWR1YXRlZF9wcmljZXMuanMiXSwibmFtZXMiOlsiZ3giLCJjb250cm9sbGVycyIsIm1vZHVsZSIsInNvdXJjZSIsImRhdGEiLCIkdGhpcyIsIiQiLCJfY3JlYXRlUm93IiwiZ3JhZHVhdGVkUHJpY2UiLCIkcm93IiwiJHF1YW50aXR5Rm9ybUdyb3VwIiwiJHF1YW50aXR5TGFiZWwiLCJqc2UiLCJjb3JlIiwibGFuZyIsInRyYW5zbGF0ZSIsIiRxdWFudGl0eUlucHV0IiwicXVhbnRpdHkiLCJhcHBlbmQiLCIkcHJpY2VGb3JtR3JvdXAiLCIkcHJpY2VMYWJlbCIsIiRwcmljZUlucHV0R3JvdXAiLCIkcHJpY2VJbnB1dCIsInBlcnNvbmFsX29mZmVyIiwiJHByaWNlSW5wdXRHcm91cEJ1dHRvbiIsIiRkZWxldGVCdXR0b24iLCJwcmljZV9pZCIsInByb3AiLCJfaGFuZGxlUmVxdWVzdEVycm9yIiwianFYSFIiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJsaWJzIiwibW9kYWwiLCJtZXNzYWdlIiwidGl0bGUiLCJjb250ZW50IiwiX2dldEdyYWR1YXRlZFByaWNlcyIsInByb2R1Y3RJZCIsImFqYXgiLCJtZXRob2QiLCJ1cmwiLCJjb25maWciLCJnZXQiLCJwYWdlVG9rZW4iLCJkYXRhVHlwZSIsIl9kaXNwbGF5R3JhZHVhdGVkUHJpY2VzIiwiZ3JhZHVhdGVkUHJpY2VzIiwiJG1vZGFsQm9keSIsImZpbmQiLCJlbXB0eSIsIiR0YWJMaXN0IiwiJHRhYkNvbnRlbnQiLCJjdXN0b21lclN0YXR1c0lkIiwiY3VzdG9tZXJzIiwiY3VzdG9tZXJTdGF0dXMiLCIkdGFiIiwiZ3JhZHVhdGVkUHJpY2VzQ291bnQiLCJncmFkdWF0aW9ucyIsImxlbmd0aCIsIiRsaW5rIiwic3RhdHVzX25hbWUiLCIkdGFiUGFuZSIsImdyYWR1YXRpb24iLCJjdXN0b21lcl9zdGF0dXNfaWQiLCJ0YWIiLCJfdXBkYXRlVGFiQ291bnRlcnMiLCJlYWNoIiwiJHRhYkxpbmsiLCJhdHRyIiwiY291bnRUZXh0IiwidGV4dCIsInNlYXJjaCIsInJlcGxhY2UiLCJfb25Sb3dJbnB1dEtleVVwIiwicGFyZW50cyIsIiRsYXN0Um93IiwidmFsIiwiX29uUm93RGVsZXRlQ2xpY2siLCJyZW1vdmUiLCJfb25Nb2RhbFNob3ciLCJkb25lIiwiZmFpbCIsIl9vblNhdmVDbGljayIsImN1c3RvbWVyU3RhdHVzZXMiLCJpbmRleCIsInRhYlBhbmUiLCJyb3ciLCJpcyIsInB1c2giLCJpbmZvX2JveCIsImFkZFN1Y2Nlc3NNZXNzYWdlIiwiaW5pdCIsIm9uIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7O0FBVUE7Ozs7O0FBS0FBLEdBQUdDLFdBQUgsQ0FBZUMsTUFBZixDQUFzQixrQkFBdEIsRUFBMEMsQ0FBQyxPQUFELEVBQWFGLEdBQUdHLE1BQWhCLG9CQUExQyxFQUFtRixVQUFVQyxJQUFWLEVBQWdCOztBQUUvRjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7OztBQUtBLFFBQU1DLFFBQVFDLEVBQUUsSUFBRixDQUFkOztBQUVBOzs7OztBQUtBLFFBQU1KLFNBQVMsRUFBZjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUFPQSxhQUFTSyxVQUFULENBQW9CQyxjQUFwQixFQUFvQztBQUNoQyxZQUFNQyxPQUFPSCxFQUFFLFNBQUYsRUFBYTtBQUN0QixxQkFBUyxLQURhO0FBRXRCLG9DQUF3QkU7QUFGRixTQUFiLENBQWI7O0FBS0EsWUFBTUUscUJBQXFCSixFQUFFLFNBQUYsRUFBYTtBQUNwQyxxQkFBUztBQUQyQixTQUFiLENBQTNCOztBQUlBLFlBQU1LLGlCQUFpQkwsRUFBRSxXQUFGLEVBQWU7QUFDbEMscUJBQVMsZUFEeUI7QUFFbEMsb0JBQVFNLElBQUlDLElBQUosQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLENBQXdCLGtCQUF4QixFQUE0QyxrQkFBNUM7QUFGMEIsU0FBZixDQUF2Qjs7QUFLQSxZQUFNQyxpQkFBaUJWLEVBQUUsV0FBRixF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RSxJQUFJQyxJQUFKLENBQVNDLElBQVQsQ0FBY0MsU0FBZCxDQUF3Qix5QkFBeEIsRUFBbUQsa0JBQW5ELENBQXBDO0FBQ0gsU0FiTCxFQWNLbUUsSUFkTCxDQWNVdEQsbUJBZFY7QUFlSDs7QUFHRDtBQUNBO0FBQ0E7O0FBRUExQixXQUFPMEYsSUFBUCxHQUFjLFVBQVVYLElBQVYsRUFBZ0I7QUFDMUI1RSxjQUNLd0YsRUFETCxDQUNRLE9BRFIsRUFDaUIsYUFEakIsRUFDZ0NmLGlCQURoQyxFQUVLZSxFQUZMLENBRVEsT0FGUixFQUVpQixXQUZqQixFQUU4QlYsWUFGOUIsRUFHS1UsRUFITCxDQUdRLE9BSFIsRUFHaUIsb0JBSGpCLEVBR3VDbkIsZ0JBSHZDLEVBSUttQixFQUpMLENBSVEsZUFKUixFQUl5QmIsWUFKekI7O0FBTUFDO0FBQ0gsS0FSRDs7QUFVQSxXQUFPL0UsTUFBUDtBQUVILENBdFVEIiwiZmlsZSI6InF1aWNrX2VkaXQvbW9kYWxzL2dyYWR1YXRlZF9wcmljZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIGdyYWR1YXRlZF9wcmljZXMuanMgMjAxNy0wMy0wOVxuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMTYgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogR3JhZHVhdGUgUHJpY2VzIE1vZGFsIENvbnRyb2xsZXJcbiAqXG4gKiBIYW5kbGVzIHRoZSBncmFkdWF0ZSBwcmljZXMgbW9kYWwgZnVuY3Rpb25hbGl0eS5cbiAqL1xuZ3guY29udHJvbGxlcnMubW9kdWxlKCdncmFkdWF0ZWRfcHJpY2VzJywgWydtb2RhbCcsIGAke2d4LnNvdXJjZX0vbGlicy9pbmZvX2JveGBdLCBmdW5jdGlvbiAoZGF0YSkge1xuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gVkFSSUFCTEVTXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBNb2R1bGUgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIEB0eXBlIHtqUXVlcnl9XG4gICAgICovXG4gICAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgLyoqXG4gICAgICogTW9kdWxlIEluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGNvbnN0IG1vZHVsZSA9IHt9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gRlVOQ1RJT05TXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZ3JhZHVhdGVkIHByaWNlcyBmb3JtIHJvdy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBncmFkdWF0ZWRQcmljZSBDb250YWlucyB0aGUgZ3JhZHVhdGVkIHByaWNlIGluZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSBSZXR1cm5zIHRoZSBjcmVhdGVkIHJvdyBzZWxlY3Rvci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfY3JlYXRlUm93KGdyYWR1YXRlZFByaWNlKSB7XG4gICAgICAgIGNvbnN0ICRyb3cgPSAkKCc8ZGl2IC8+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ3JvdycsXG4gICAgICAgICAgICAnZGF0YS1ncmFkdWF0ZWQtcHJpY2UnOiBncmFkdWF0ZWRQcmljZVxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCAkcXVhbnRpdHlGb3JtR3JvdXAgPSAkKCc8ZGl2IC8+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2Zvcm0tZ3JvdXAgY29sLXhzLTQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0ICRxdWFudGl0eUxhYmVsID0gJCgnPGxhYmVsIC8+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2NvbnRyb2wtbGFiZWwnLFxuICAgICAgICAgICAgJ3RleHQnOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnTlVNQkVSX09GX1BJRUNFUycsICdhZG1pbl9xdWlja19lZGl0JylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgJHF1YW50aXR5SW5wdXQgPSAkKCc8aW5wdXQgLz4nLCB7XG4gICAgICAgICAgICAndHlwZSc6ICd0ZXh0JyxcbiAgICAgICAgICAgICdjbGFzcyc6ICdmb3JtLWNvbnRyb2wgcXVhbnRpdHknLFxuICAgICAgICAgICAgJ3ZhbHVlJzogZ3JhZHVhdGVkUHJpY2UucXVhbnRpdHlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHF1YW50aXR5Rm9ybUdyb3VwLmFwcGVuZCgkcXVhbnRpdHlMYWJlbCwgJHF1YW50aXR5SW5wdXQpO1xuXG4gICAgICAgIGNvbnN0ICRwcmljZUZvcm1Hcm91cCA9ICQoJzxkaXYgLz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnZm9ybS1ncm91cCBjb2wteHMtNCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgJHByaWNlTGFiZWwgPSAkKCc8bGFiZWwgLz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnY29udHJvbC1sYWJlbCcsXG4gICAgICAgICAgICAndGV4dCc6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdQUklDRScsICdhZG1pbl9xdWlja19lZGl0JylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgJHByaWNlSW5wdXRHcm91cCA9ICQoJzxkaXYgLz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAnaW5wdXQtZ3JvdXAnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0ICRwcmljZUlucHV0ID0gJCgnPGlucHV0IC8+Jywge1xuICAgICAgICAgICAgJ3R5cGUnOiAndGV4dCcsXG4gICAgICAgICAgICAnY2xhc3MnOiAnZm9ybS1jb250cm9sIHByaWNlJyxcbiAgICAgICAgICAgICd2YWx1ZSc6IGdyYWR1YXRlZFByaWNlLnBlcnNvbmFsX29mZmVyXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0ICRwcmljZUlucHV0R3JvdXBCdXR0b24gPSAkKCc8c3BhbiAvPicsIHtcbiAgICAgICAgICAgICdjbGFzcyc6ICdpbnB1dC1ncm91cC1idG4nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0ICRkZWxldGVCdXR0b24gPSAkKCc8YnV0dG9uIC8+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ2J0biBkZWxldGUnLFxuICAgICAgICAgICAgJ2h0bWwnOiAnPGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChncmFkdWF0ZWRQcmljZS5wcmljZV9pZCA9PT0gJycpIHtcbiAgICAgICAgICAgICRkZWxldGVCdXR0b24ucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRwcmljZUlucHV0R3JvdXBCdXR0b24uYXBwZW5kKCRkZWxldGVCdXR0b24pO1xuXG4gICAgICAgICRwcmljZUlucHV0R3JvdXAuYXBwZW5kKCRwcmljZUlucHV0LCAkcHJpY2VJbnB1dEdyb3VwQnV0dG9uKTtcblxuICAgICAgICAkcHJpY2VGb3JtR3JvdXAuYXBwZW5kKCRwcmljZUxhYmVsLCAkcHJpY2VJbnB1dEdyb3VwKTtcblxuICAgICAgICAkcm93LmFwcGVuZCgkcXVhbnRpdHlGb3JtR3JvdXAsICRwcmljZUZvcm1Hcm91cCk7XG5cbiAgICAgICAgcmV0dXJuICRyb3c7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBBSkFYIHJlcXVlc3QgZXJyb3JzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtqUXVlcnkuanFYSFJ9IGpxWEhSIGpRdWVyeSByZXF1ZXN0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFN0YXR1cyBSZXF1ZXN0IHN0YXR1cyBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3JUaHJvd24gVGhyb3duIGVycm9yIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlUmVxdWVzdEVycm9yKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICBqc2UubGlicy5tb2RhbC5tZXNzYWdlKHtcbiAgICAgICAgICAgIHRpdGxlOiBqc2UuY29yZS5sYW5nLnRyYW5zbGF0ZSgnZXJyb3InLCAnbWVzc2FnZXMnKSxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGpzZS5jb3JlLmxhbmcudHJhbnNsYXRlKCdVTkVYUEVDVEVEX1JFUVVFU1RfRVJST1InLCAnYWRtaW5fcXVpY2tfZWRpdCcpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCBncmFkdWF0ZWQgcHJpY2VzIGZvciBzZWxlY3RlZCBwcm9kdWN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2R1Y3RJZCBTZWxlY3RlZCBwcm9kdWN0IElELlxuICAgICAqXG4gICAgICogQHJldHVybiB7alF1ZXJ5LmpxWEhSfSBSZXR1cm5zIHJlcXVlc3QncyBkZWZlcnJlZCBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2dldEdyYWR1YXRlZFByaWNlcyhwcm9kdWN0SWQpIHtcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgdXJsOiBqc2UuY29yZS5jb25maWcuZ2V0KCdhcHBVcmwnKSArICcvYWRtaW4vYWRtaW4ucGhwP2RvPVF1aWNrRWRpdE92ZXJ2aWV3QWpheC9Qcm9kdWN0R3JhZHVhdGVkUHJpY2VzJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0SWQsXG4gICAgICAgICAgICAgICAgcGFnZVRva2VuOiBqc2UuY29yZS5jb25maWcuZ2V0KCdwYWdlVG9rZW4nKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyBncmFkdWF0ZWQgcHJpY2VzIGNvbnRlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZ3JhZHVhdGVkUHJpY2VzIENvbnRhaW5zIGdyYWR1YXRlZCBwcmljZXMgaW5mbyBmb3Igc2VsZWN0ZWQgcHJvZHVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZGlzcGxheUdyYWR1YXRlZFByaWNlcyhncmFkdWF0ZWRQcmljZXMpIHtcbiAgICAgICAgY29uc3QgJG1vZGFsQm9keSA9ICR0aGlzLmZpbmQoJy5tb2RhbC1ib2R5Jyk7XG5cbiAgICAgICAgJG1vZGFsQm9keS5lbXB0eSgpO1xuXG4gICAgICAgIGNvbnN0ICR0YWJMaXN0ID0gJCgnPHVsIC8+Jywge1xuICAgICAgICAgICAgJ2NsYXNzJzogJ25hdiBuYXYtdGFicycsXG4gICAgICAgICAgICAncm9sZSc6ICd0YWJsaXN0J1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCAkdGFiQ29udGVudCA9ICQoJzxkaXYgLz4nLCB7XG4gICAgICAgICAgICAnY2xhc3MnOiAndGFiLWNvbnRlbnQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGN1c3RvbWVyU3RhdHVzSWQgaW4gZ3JhZHVhdGVkUHJpY2VzLmRhdGFbMF0uY3VzdG9tZXJzKSB7XG4gICAgICAgICAgICBjb25zdCBjdXN0b21lclN0YXR1cyA9IGdyYWR1YXRlZFByaWNlcy5kYXRhWzBdLmN1c3RvbWVyc1tjdXN0b21lclN0YXR1c0lkXTtcblxuICAgICAgICAgICAgY29uc3QgJHRhYiA9ICQoJzxsaSAvPicpO1xuXG4gICAgICAgICAgICBjb25zdCBncmFkdWF0ZWRQcmljZXNDb3VudCA9IGN1c3RvbWVyU3RhdHVzLmdyYWR1YXRpb25zLmxlbmd0aFxuICAgICAgICAgICAgICAgID8gYCAoJHtjdXN0b21lclN0YXR1cy5ncmFkdWF0aW9ucy5sZW5ndGh9KWAgOiAnJztcblxuICAgICAgICAgICAgY29uc3QgJGxpbmsgPSAkKCc8YSAvPicsIHtcbiAgICAgICAgICAgICAgICAnaHJlZic6IGAjY3VzdG9tZXItc3RhdHVzLSR7Y3VzdG9tZXJTdGF0dXNJZH1gLFxuICAgICAgICAgICAgICAgICdyb2xlJzogJ3RhYicsXG4gICAgICAgICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ3RhYicsXG4gICAgICAgICAgICAgICAgJ2h0bWwnOiBjdXN0b21lclN0YXR1cy5zdGF0dXNfbmFtZSArIGdyYWR1YXRlZFByaWNlc0NvdW50XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHRhYi5hcHBlbmQoJGxpbmspO1xuXG4gICAgICAgICAgICAkdGFiTGlzdC5hcHBlbmQoJHRhYik7XG5cbiAgICAgICAgICAgIC8vIEFkZCBuZXcgdGFiIGNvbnRhaW5lciBpbiB0YWIgY29udGVudC5cbiAgICAgICAgICAgIGNvbnN0ICR0YWJQYW5lID0gJCgnPGRpdiAvPicsIHtcbiAgICAgICAgICAgICAgICAncm9sZSc6ICd0YWJwYW5lbCcsXG4gICAgICAgICAgICAgICAgJ2NsYXNzJzogJ3RhYi1wYW5lIGZhZGUnLFxuICAgICAgICAgICAgICAgICdpZCc6IGBjdXN0b21lci1zdGF0dXMtJHtjdXN0b21lclN0YXR1c0lkfWAsXG4gICAgICAgICAgICAgICAgJ2RhdGEtY3VzdG9tZXItc3RhdHVzLWlkJzogY3VzdG9tZXJTdGF0dXNJZFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGdyYWR1YXRpb24gb2YgY3VzdG9tZXJTdGF0dXMuZ3JhZHVhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBncmFkdWF0aW9uLmN1c3RvbWVyX3N0YXR1c19pZCA9IGN1c3RvbWVyU3RhdHVzSWQ7XG4gICAgICAgICAgICAgICAgJHRhYlBhbmUuYXBwZW5kKF9jcmVhdGVSb3coZ3JhZHVhdGlvbikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkdGFiUGFuZS5hcHBlbmQoX2NyZWF0ZVJvdyh7XG4gICAgICAgICAgICAgICAgcHJpY2VfaWQ6ICcnLFxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiAnJyxcbiAgICAgICAgICAgICAgICBwZXJzb25hbF9vZmZlcjogJycsXG4gICAgICAgICAgICAgICAgY3VzdG9tZXJfc3RhdHVzX2lkOiBjdXN0b21lclN0YXR1c0lkXG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgICR0YWJDb250ZW50LmFwcGVuZCgkdGFiUGFuZSk7XG4gICAgICAgIH1cblxuICAgICAgICAkbW9kYWxCb2R5LmFwcGVuZCgkdGFiTGlzdCwgJHRhYkNvbnRlbnQpO1xuXG4gICAgICAgIC8vIFNob3cgdGhlIGZpcnN0IHRhYiBjb250ZW50cy5cbiAgICAgICAgJHRhYkxpc3QuZmluZCgnYTpmaXJzdCcpLnRhYignc2hvdycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgcm93IGNvdW50IGluIHRhYiBsaW5rLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF91cGRhdGVUYWJDb3VudGVycygpIHtcbiAgICAgICAgJHRoaXMuZmluZCgnLnRhYi1wYW5lJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCAkdGFiUGFuZSA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBncmFkdWF0ZWRQcmljZXNDb3VudCA9ICR0YWJQYW5lLmZpbmQoJy5yb3cnKS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgY29uc3QgJHRhYkxpbmsgPSAkdGhpcy5maW5kKGBbaHJlZj1cIiMkeyR0YWJQYW5lLmF0dHIoJ2lkJyl9XCJdYCk7XG4gICAgICAgICAgICBjb25zdCBjb3VudFRleHQgPSBncmFkdWF0ZWRQcmljZXNDb3VudCA+IDAgPyBgKCR7Z3JhZHVhdGVkUHJpY2VzQ291bnR9KWAgOiAnJztcblxuICAgICAgICAgICAgaWYgKCR0YWJMaW5rLnRleHQoKS5zZWFyY2goL1xcKC4qXFwpLykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgJHRhYkxpbmsudGV4dCgkdGFiTGluay50ZXh0KCkucmVwbGFjZSgvXFwoLipcXCkvLCBjb3VudFRleHQpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJHRhYkxpbmsudGV4dCgkdGFiTGluay50ZXh0KCkgKyBjb3VudFRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3cgaW5wdXQga2V5IHVwIGV2ZW50IGhhbmRsZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gX29uUm93SW5wdXRLZXlVcCgpIHtcbiAgICAgICAgY29uc3QgJHJvdyA9ICQodGhpcykucGFyZW50cygnLnJvdzpmaXJzdCcpO1xuICAgICAgICBjb25zdCAkbGFzdFJvdyA9ICRyb3cucGFyZW50cygnLnRhYi1wYW5lJykuZmluZCgnLnJvdzpsYXN0Jyk7XG5cbiAgICAgICAgaWYgKCRsYXN0Um93WzBdID09PSAkcm93WzBdICYmICRyb3cuZmluZCgnaW5wdXQucXVhbnRpdHknKS52YWwoKSAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJQYW5lID0gJHJvdy5wYXJlbnRzKCcudGFiLXBhbmU6Zmlyc3QnKTtcblxuICAgICAgICAgICAgJHJvdy5maW5kKCcuYnRuLmRlbGV0ZScpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICAgICAgICAkdGFiUGFuZS5hcHBlbmQoX2NyZWF0ZVJvdyh7XG4gICAgICAgICAgICAgICAgcHJpY2VfaWQ6ICcnLFxuICAgICAgICAgICAgICAgIHF1YW50aXR5OiAnJyxcbiAgICAgICAgICAgICAgICBwZXJzb25hbF9vZmZlcjogJycsXG4gICAgICAgICAgICAgICAgY3VzdG9tZXJfc3RhdHVzX2lkOiAkdGFiUGFuZS5kYXRhKCdjdXN0b21lclN0YXR1c0lkJylcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgX3VwZGF0ZVRhYkNvdW50ZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3cgZGVsZXRlIGJ1dHRvbiBjbGljayBldmVudCBoYW5kbGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vblJvd0RlbGV0ZUNsaWNrKCkge1xuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5yb3c6Zmlyc3QnKS5yZW1vdmUoKTtcbiAgICAgICAgX3VwZGF0ZVRhYkNvdW50ZXJzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR3JhZHVhdGVkIHByaWNlcyBtb2RhbCBzaG93IGV2ZW50IGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBMb2FkcyBhbmQgZGlzcGxheXMgZ3JhZHVhdGVkIHByaWNlIGluZm8gZm9yIHRoZSBzZWxlY3RlZCBwcm9kdWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9vbk1vZGFsU2hvdygpIHtcbiAgICAgICAgX2dldEdyYWR1YXRlZFByaWNlcygkdGhpcy5kYXRhKCdwcm9kdWN0SWQnKSlcbiAgICAgICAgICAgIC5kb25lKF9kaXNwbGF5R3JhZHVhdGVkUHJpY2VzKVxuICAgICAgICAgICAgLmZhaWwoX2hhbmRsZVJlcXVlc3RFcnJvcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2F2ZXMgZ3JhZHVhdGVkIHByaWNlcyBhbmQgY2xvc2VzIHRoZSBtb2RhbC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfb25TYXZlQ2xpY2soKSB7XG4gICAgICAgIGNvbnN0IGN1c3RvbWVyU3RhdHVzZXMgPSB7fTtcblxuICAgICAgICAkdGhpcy5maW5kKCcudGFiLXBhbmUnKS5lYWNoKChpbmRleCwgdGFiUGFuZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgJHRhYlBhbmUgPSAkKHRhYlBhbmUpO1xuICAgICAgICAgICAgY29uc3QgY3VzdG9tZXJTdGF0dXNJZCA9ICR0YWJQYW5lLmRhdGEoJ2N1c3RvbWVyU3RhdHVzSWQnKTtcblxuICAgICAgICAgICAgY3VzdG9tZXJTdGF0dXNlc1tjdXN0b21lclN0YXR1c0lkXSA9IFtdO1xuXG4gICAgICAgICAgICAkdGFiUGFuZS5maW5kKCcucm93JykuZWFjaCgoaW5kZXgsIHJvdykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRyb3cgPSAkKHJvdyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJHJvdy5pcygnOmxhc3QtY2hpbGQnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VzdG9tZXJTdGF0dXNlc1tjdXN0b21lclN0YXR1c0lkXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcHJpY2VfaWQ6ICRyb3cuZGF0YSgncHJpY2VfaWQnKSxcbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6ICRyb3cuZmluZCgnaW5wdXQucXVhbnRpdHknKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgcGVyc29uYWxfb2ZmZXI6ICRyb3cuZmluZCgnaW5wdXQucHJpY2UnKS52YWwoKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB2YWx1ZSBmb3IgZW1wdHkgZ3JvdXBzLlxuICAgICAgICAgICAgaWYgKCFjdXN0b21lclN0YXR1c2VzW2N1c3RvbWVyU3RhdHVzSWRdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGN1c3RvbWVyU3RhdHVzZXNbY3VzdG9tZXJTdGF0dXNJZF0ucHVzaCgnZW1wdHknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICB1cmw6IGpzZS5jb3JlLmNvbmZpZy5nZXQoJ2FwcFVybCcpICsgJy9hZG1pbi9hZG1pbi5waHA/ZG89UXVpY2tFZGl0T3ZlcnZpZXdBamF4L1NhdmVHcmFkdWF0ZWRQcmljZXMnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBhZ2VUb2tlbjoganNlLmNvcmUuY29uZmlnLmdldCgncGFnZVRva2VuJyksXG4gICAgICAgICAgICAgICAgcHJvZHVjdElkOiAkdGhpcy5kYXRhKCdwcm9kdWN0SWQnKSxcbiAgICAgICAgICAgICAgICBjdXN0b21lclN0YXR1c2VzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgICR0aGlzLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAganNlLmxpYnMuaW5mb19ib3guYWRkU3VjY2Vzc01lc3NhZ2UoanNlLmNvcmUubGFuZy50cmFuc2xhdGUoJ1NVQ0NFU1NfUFJPRFVDVF9VUERBVEVEJywgJ2FkbWluX3F1aWNrX2VkaXQnKSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoX2hhbmRsZVJlcXVlc3RFcnJvcilcbiAgICB9XG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIElOSVRJQUxJWkFUSU9OXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuaW5pdCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICR0aGlzXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4uZGVsZXRlJywgX29uUm93RGVsZXRlQ2xpY2spXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgJy5idG4uc2F2ZScsIF9vblNhdmVDbGljaylcbiAgICAgICAgICAgIC5vbigna2V5dXAnLCAnaW5wdXQuZm9ybS1jb250cm9sJywgX29uUm93SW5wdXRLZXlVcClcbiAgICAgICAgICAgIC5vbignc2hvdy5icy5tb2RhbCcsIF9vbk1vZGFsU2hvdyk7XG5cbiAgICAgICAgZG9uZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuXG59KTsgIl19
