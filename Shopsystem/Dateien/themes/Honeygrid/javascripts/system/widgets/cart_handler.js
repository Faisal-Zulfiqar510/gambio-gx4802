'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* --------------------------------------------------------------
 cart_handler.js 2022-12-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

/**
 * Component for handling the add to cart and wishlist features
 * at the product details and the category listing pages. It cares
 * for attributes, properties, quantity and all other
 * relevant data for adding an item to the basket or wishlist
 */
gambio.widgets.module('cart_handler', ['hooks', 'form', 'xhr', 'loading_spinner', gambio.source + '/libs/events', gambio.source + '/libs/modal.ext-magnific', gambio.source + '/libs/modal'], function (data) {

	'use strict';

	// ########## VARIABLE INITIALIZATION ##########

	var $this = $(this),
	    $body = $('body'),
	    $window = $(window),
	    busy = false,
	    ajax = null,
	    timeout = 0,
	    previousModifiers = {},
	    defaults = {
		// AJAX "add to cart" URL
		addCartUrl: 'shop.php?do=Cart/BuyProduct',
		// AJAX "add to cart" URL for customizer products
		addCartCustomizerUrl: 'shop.php?do=Cart/Add',
		// AJAX URL to perform a value check
		checkUrl: 'shop.php?do=CheckStatus',
		// AJAX URL to perform the add to wishlist
		wishlistUrl: 'shop.php?do=WishList/Add',
		// Submit URL for price offer button
		priceOfferUrl: 'gm_price_offer.php',
		// Submit method for price offer
		priceOfferMethod: 'get',
		// Selector for the cart dropdown
		dropdown: '#head_shopping_cart',
		// "Add to cart" buttons selectors
		cartButtons: '.js-btn-add-to-cart',
		// "Wishlist" buttons selectors
		wishlistButtons: '.btn-wishlist',
		// "Price offer" buttons selectors
		priceOfferButtons: '.btn-price-offer',
		// Selector for the attribute fields
		attributes: '.js-calculate',
		// Selector for product property
		productOptions: '.modifier-group .modifier-content .modifier-item',
		productOptionField: '.hidden-input',
		// Selector for the quantity
		quantity: '.js-calculate-qty',
		// URL where to get the theme for the dropdown
		tpl: null,
		// Show attribute images in product images swiper (if possible)
		// -- this feature is not supported yet --
		attributImagesSwiper: false,
		// Trigger the attribute images to this selectors
		triggerAttrImagesTo: '#product_image_swiper, #product_thumbnail_swiper, ' + '#product_thumbnail_swiper_mobile',
		// Class that gets added to the button on processing
		processingClass: 'loading',
		// Duration for that the success or fail class gets added to the button
		processingDuration: 2000,
		// AJAX response content selectors
		selectorMapping: {
			buttons: '.shopping-cart-button',
			giftContent: '.gift-cart-content-wrapper',
			giftLayer: '.gift-cart-layer',
			shareContent: '.share-cart-content-wrapper',
			shareLayer: '.share-cart-layer',
			hiddenOptions: '#cart_quantity .hidden-options',
			message: '.global-error-messages',
			messageCart: '.cart-error-msg',
			messageHelp: '.help-block',
			modelNumber: '.model-number',
			modelNumberText: '.model-number-text',
			price: '.current-price-container',
			modifiersForm: '.modifiers-selection',
			quantity: '.products-quantity-value',
			quantityInfo: '.products-quantity',
			ribbonSpecial: '.ribbon-special',
			shippingInformation: '#shipping-information-layer',
			shippingTime: '.products-shipping-time-value',
			shippingTimeImage: '.img-shipping-time img',
			totals: '#cart_quantity .total-box',
			weight: '.products-details-weight-container span',
			abroadShippingInfo: '.abroad-shipping-info'
		},
		page: 'product-listing'
	},
	    options = $.extend(true, {}, defaults, data),
	    module = {},
	    mobile = $(window).width() <= 767;

	// ########## HELPER FUNCTIONS ##########

	/**
  * Helper function that updates the button
  * state with an error or success class for
  * a specified duration
  * @param   {object}        $target         jQuery selection of the target button
  * @param   {string}        state           The state string that gets added to the loading class
  * @private
  */
	var _addButtonState = function _addButtonState($target, state) {
		var timer = setTimeout(function () {
			$target.removeClass(options.processingClass + ' ' + options.processingClass + state);
		}, options.processingDuration);

		$target.data('timer', timer).addClass(options.processingClass + state);
	};

	/**
  * Helper function to set the messages and the
  * button state.
  * @param       {object}    data                Result form the ajax request
  * @param       {object}    $form               jQuery selecion of the form
  * @param       {boolean}   disableButtons      If true, the button state gets set to (in)active
  * @param       {boolean}   showNoCombiMesssage If true, the error message for missing property combination selection will be displayed
  * @private
  */
	var _stateManager = function _stateManager(data, $form, disableButtons, showNoCombiSelectedMesssage) {

		// Remove the attribute images from the common content
		// so that it doesn't get rendered anymore. Then trigger
		// an event to the given selectors and deliver the
		// attrImages object
		if (options.attributImagesSwiper && data.attrImages && data.attrImages.length) {
			delete data.content.images;
			$(options.triggerAttrImagesTo).trigger(jse.libs.theme.events.SLIDES_UPDATE(), { attributes: data.attrImages });
		}

		// Set the messages given inside the data.content object
		$.each(data.content, function (i, v) {
			var $element = $body.hasClass('page-product-info') ? $this.find(options.selectorMapping[v.selector]) : $form.parent().find(options.selectorMapping[v.selector]);

			if ((!showNoCombiSelectedMesssage || v.value === '') && i === 'messageNoCombiSelected') {
				return true;
			}

			switch (v.type) {
				case 'hide':
					if (v.value === 'true') {
						$element.hide();
					} else {
						$element.show();
					}
					break;
				case 'html':
					$element.html(v.value);
					break;
				case 'attribute':
					$element.attr(v.key, v.value);
					break;
				case 'replace':
					if (v.value) {
						$element.replaceWith(v.value);
					} else {
						$element.addClass('hidden').empty();
					}
					break;
				default:
					$element.text(v.value);
					break;
			}
		});

		// Dis- / Enable the buttons
		if (disableButtons) {
			var $buttons = $form.find(options.cartButtons);
			if (data.success) {
				$buttons.removeClass('inactive');
				$buttons.removeClass('btn-inactive');
				$buttons.prop("disabled", false);
			} else {
				$buttons.addClass('inactive');
				$buttons.addClass('btn-inactive');
				$buttons.prop("disabled", true);
			}
		}

		if (data.content.message) {
			var $errorField = $form.find(options.selectorMapping[data.content.message.selector]);
			if (data.content.message.value) {
				$errorField.removeClass('hidden').show();
			} else {
				$errorField.addClass('hidden').hide();

				if (showNoCombiSelectedMesssage && data.content.messageNoCombiSelected !== undefined && data.content.messageNoCombiSelected) {
					if (data.content.messageNoCombiSelected.value) {
						$errorField.removeClass('hidden').show();
					} else {
						$errorField.addClass('hidden').hide();
					}
				}
			}
		}

		$window.trigger(jse.libs.theme.events.STICKYBOX_CONTENT_CHANGE());
	};

	/**
  * Helper function to send the ajax
  * On success redirect to a given url, open a layer with
  * a message or add the item to the cart-dropdown directly
  * (by triggering an event to the body)
  * @param       {object}      data      Form data
  * @param       {object}      $form     The form to fill
  * @param       {string}      url       The URL for the AJAX request
  * @private
  */
	var _addToSomewhere = function _addToSomewhere(data, $form, url, $button) {
		function callback() {
			jse.libs.xhr.post({ url: url, data: data }, true).done(function (result) {
				try {
					// Fill the page with the result from the ajax
					_stateManager(result, $form, false);

					// If the AJAX was successful execute
					// a custom functionality
					if (result.success) {
						switch (result.type) {
							case 'url':
								if (result.url.substr(0, 4) !== 'http') {
									location.href = jse.core.config.get('appUrl') + '/' + result.url;
								} else {
									location.href = result.url;
								}

								break;
							case 'dropdown':
								$body.trigger(jse.libs.theme.events.CART_UPDATE(), [true]);
								break;
							case 'layer':
								jse.libs.theme.modal.info({ title: result.title, content: result.msg });
								break;
							default:
								break;
						}
					}
				} catch (ignore) {}
				_addButtonState($button, '-success');
			}).fail(function () {
				_addButtonState($button, '-fail');
			}).always(function () {
				// Reset the busy flag to be able to perform
				// further AJAX requests
				busy = false;
			});
		}

		if (!busy) {
			// only execute the ajax
			// if there is no pending ajax call
			busy = true;

			jse.libs.hooks.execute(jse.libs.hooks.keys.shop.cart.add, data, 500).then(callback).catch(callback);
		}
	};

	// ########## EVENT HANDLER ##########

	/**
  * Handler for the submit form / click
  * on "add to cart" & "wishlist" button.
  * It performs a check on the availability
  * of the combination and quantity. If
  * successful it performs the add to cart
  * or wishlist action, if it's not a
  * "check" call
  * @param       {object}    e      jQuery event object
  * @private
  */
	var _submitHandler = function _submitHandler(e) {
		if (e) {
			e.preventDefault();
		}

		var $self = $(this),
		    $form = $self.is('form') ? $self : $self.closest('form'),
		    customizer = $form.hasClass('customizer'),
		    properties = !!$form.find('.properties-selection-form').length,
		    module = properties ? '' : '/Attributes',
		    showNoCombiSelectedMesssage = e && e.data && e.data.target && e.data.target !== 'check';

		if ($form.length) {

			// Show properties overlay
			// to disable user interaction
			// before markup replace
			if (properties) {
				$this.addClass('loading');
			}

			if ($self.is('select')) {
				var price = $self.find(":selected").attr('data-price');
				$self.parents('.modifier-group').find('.selected-value-price').text(price);
			}

			var getGalleryHash = $('#current-gallery-hash').val();
			$form.find('#update-gallery-hash').val(getGalleryHash);

			var formdata = jse.libs.form.getData($form, null, true);
			formdata.target = e && e.data && e.data.target ? e.data.target : 'check';
			formdata.isProductInfo = $form.hasClass('product-info') ? 1 : 0;

			// Abort previous check ajax if
			// there is one in progress
			if (ajax && e) {
				ajax.abort();
			}

			// Add processing-class to the button
			// and remove old timed events
			if (formdata.target !== 'check') {
				var timer = $self.data('timer');
				if (timer) {
					clearTimeout(timer);
				}

				$self.removeClass(options.processingClass + '-success ' + options.processingClass + '-fail').addClass(options.processingClass);
			}

			formdata.previousModifiers = previousModifiers;

			ajax = jse.libs.xhr.get({
				url: options.checkUrl + module,
				data: formdata
			}, true).done(function (result) {
				_stateManager(result, $form, true, showNoCombiSelectedMesssage);
				$this.removeClass('loading');

				// Check if the gallery images changed
				if (formdata.target === 'check' && result.content.imageGallery.trim() !== '' && result.content.replaceGallery === true && formdata.isProductInfo === 1) {
					var loadingSpinner = jse.libs.loading_spinner.show($('.product-info-stage'), 9999);

					var swipers = [$('#product_image_swiper'), $('#product_thumbnail_swiper'), $('#product_thumbnail_swiper_mobile')];

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = swipers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var element = _step.value;

							var instance = element.swiper();

							if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) !== 'object') {
								continue;
							}

							instance.destroy(true, true);
							element.off().remove();
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

					$('#image-collection-container').html(result.content.imageGallery);
					$('#product_image_layer').html(result.content.imageModal);

					gambio.widgets.init($('.product-info-content')).done(function () {
						jse.libs.loading_spinner.hide(loadingSpinner);
					});
				} else if (formdata.target === 'check' && result.content.imageGallery.trim() === '' && result.content.replaceGallery === true) {
					$('#image-collection-container').html(result.content.imageGallery);
					$('#product_image_layer').html(result.content.imageModal);
				}

				if (result.success) {
					var event = null,
					    url = null;

					switch (formdata.target) {
						case 'wishlist':
							if (customizer) {
								event = jse.libs.theme.events.ADD_CUSTOMIZER_WISHLIST();
							}
							url = options.wishlistUrl;
							break;
						case 'cart':
							if (customizer) {
								event = jse.libs.theme.events.ADD_CUSTOMIZER_CART();
								url = options.addCartCustomizerUrl;
							} else {
								url = options.addCartUrl;
							}
							break;
						case 'price_offer':
							$form.attr('action', options.priceOfferUrl).attr('method', options.priceOfferMethod);
							$form.off('submit');
							$form.submit();

							return;
						default:
							setTimeout(function () {
								$window.trigger(jse.libs.theme.events.STICKYBOX_CONTENT_CHANGE());
							}, 250);
							break;
					}

					if (event) {
						var deferred = $.Deferred();
						deferred.done(function (customizerRandom) {
							formdata[customizerRandom] = 0;
							_addToSomewhere(formdata, $form, url, $self);
						}).fail(function () {
							_addButtonState($self, '-fail');
						});
						$body.trigger(event, [{ 'deferred': deferred, 'dataset': formdata }]);
					} else if (url) {
						_addToSomewhere(formdata, $form, url, $self);
					}
				}

				if (formdata.target === 'check') {
					previousModifiers = formdata.modifiers;
				}
			}).fail(function () {
				_addButtonState($self, '-fail');
			});
		}
	};

	/**
  * Handler for the change property option
  * */
	var _changeProductOptions = function _changeProductOptions(e) {
		var option = e.currentTarget;
		var optionValue = $(option).data('value');
		var optionContainer = $(option).parents('.modifier-group');

		$(optionContainer).find('li.active').removeClass('active');
		$(optionContainer).find('.modifier-item.active-modifier').removeClass('active-modifier');
		$(optionContainer).find('input.hidden-input').val(optionValue);
		$(optionContainer).find('input.hidden-input').trigger('blur', []);

		$(option).parents('li').addClass('active');
		$(option).addClass('active-modifier');
	};

	var _selectSelectedModifierInfo = function _selectSelectedModifierInfo(e) {
		var option = e.currentTarget;
		var price = $(option).attr('data-price');
		var label = $(option).attr('data-label');
		$(option).parents('.modifier-group').find('.selected-value-price').removeClass('temporary-value').attr('data-default-price', price);
		$(option).parents('.modifier-group').find('.selected-value').attr('data-default-value', label);
	};

	var _setSelectedModifierInfo = function _setSelectedModifierInfo(e) {
		var option = e.currentTarget;
		if (!$(option).parent().hasClass('active') && !$(option).is('select') && !$(option).hasClass('active-modifier')) {
			var price = $(option).attr('data-price');
			var label = $(option).attr('data-label');
			$(option).parents('.modifier-group').find('.selected-value-price').addClass('temporary-value').text(price);
			$(option).parents('.modifier-group').find('.selected-value').text(label);
		}
	};

	var _resetSelectedModifierInfo = function _resetSelectedModifierInfo(e) {
		var option = $(this);
		if (!$(option).parent().hasClass('active') && !$(option).is('select') && !$(option).hasClass('active-modifier')) {
			var priceHolder = $(option).parents('.modifier-group').find('.selected-value-price');
			var labelHolder = $(option).parents('.modifier-group').find('.selected-value');
			$(priceHolder).removeClass('temporary-value').text($(priceHolder).attr('data-default-price'));
			$(labelHolder).text($(labelHolder).attr('data-default-value'));
		}
	};

	/**
  * Keyup handler for quantity input field
  *
  * @param e
  * @private
  */
	var _keyupHandler = function _keyupHandler(e) {
		clearTimeout(timeout);

		timeout = setTimeout(function () {
			_submitHandler.call(this, e);
		}.bind(this), 300);
	};

	/**
  * Event handler for the add to cart button, that shows or hides the throbber.
  */
	var _addToCartThrobberHandler = function _addToCartThrobberHandler(e) {
		var $btn = $(this);
		var $btnFake = $this.find(".btn-add-to-cart-fake");
		var formReady = true;

		$(".properties-selection-form select").each(function () {
			var val = $(this).val();
			if (!val || val < 1) {
				formReady = false;
			}
		});

		if (formReady) {
			$btn.hide();
			$btnFake.show().prop("disabled", true).prepend('<span class="throbbler"></span>');
		}
	};

	/**
  * Cart dropdown oben event handler for the body.
  */
	var _cartDropdownOpenHandler = function _cartDropdownOpenHandler(e) {
		var $btn = $this.find("[name=btn-add-to-cart]");
		var $btnFake = $this.find(".btn-add-to-cart-fake");
		var fakeOrigLabel = $btnFake.html();
		var productCount = $(".cart-products-count").html();

		var textPhrases = JSON.parse($('#product-details-text-phrases').html());
		console.log(textPhrases['productsInCartSuffix']);

		$btnFake.html("<i class=\"fa fa-check\"></i> " + parseInt(productCount) + textPhrases['productsInCartSuffix']).prop("disabled", true).addClass("btn-buy-complete");

		setTimeout(function () {
			$btnFake.html(fakeOrigLabel).removeClass("btn-buy-complete").hide().prop("disabled", false);
			$(".throbbler", $btn).remove();
			$btn.show();
		}, 5000);
	};

	// ########## INITIALIZATION ##########

	/**
  * Init function of the widget
  * @constructor
  */
	module.init = function (done) {

		var $forms = $this.find('form');

		if (options.page === 'product-info') {
			$forms.find("[name=btn-add-to-cart]").on('touchstart touchmove touchend touchcancel', function () {
				return $forms.find("[name=btn-add-to-cart]").click();
			});
			$forms.find("[name=btn-add-to-cart]").on('mouseup', _addToCartThrobberHandler);
			$("body").on('CART_DROPDOWN_OPEN', _cartDropdownOpenHandler);
		}

		$forms.on('submit', { 'target': 'cart' }, _submitHandler).on('click', options.wishlistButtons, { 'target': 'wishlist' }, _submitHandler).on('click', options.priceOfferButtons, { 'target': 'price_offer' }, _submitHandler).on('change', options.attributes, { 'target': 'check' }, _submitHandler).on('mouseover', options.attributes, _setSelectedModifierInfo).on('mouseout', options.attributes, _resetSelectedModifierInfo).on('blur', options.productOptionField, { 'target': 'check' }, _submitHandler).on('click', options.productOptions, { 'target': 'check' }, function (e) {
			_selectSelectedModifierInfo(e);
			_changeProductOptions(e);
		}).on('mouseover', options.productOptions, _setSelectedModifierInfo).on('mouseout', options.productOptions, _resetSelectedModifierInfo).on('blur', options.quantity, { 'target': 'check' }, function (e) {
			_submitHandler(e);
		}).on('keyup', options.quantity, { 'target': 'check' }, _keyupHandler);

		// Fallback if the backend renders incorrect data
		// on initial page call
		$forms.not('.no-status-check').not('.product-info').each(function () {
			_submitHandler.call($(this));
		});
		done();
	};

	// Return data to widget engine
	return module;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndpZGdldHMvY2FydF9oYW5kbGVyLmpzIl0sIm5hbWVzIjpbImdhbWJpbyIsIndpZGdldHMiLCJtb2R1bGUiLCJzb3VyY2UiLCJkYXRhIiwiJHRoaXMiLCIkIiwiJGJvZHkiLCIkd2luZG93Iiwid2luZG93IiwiYnVzeSIsImFqYXgiLCJ0aW1lb3V0IiwicHJldmlvdXNNb2RpZmllcnMiLCJkZWZhdWx0cyIsImFkZENhcnRVcmwiLCJhZGRDYXJ0Q3VzdG9taXplclVybCIsImNoZWNrVXJsIiwid2lzaGxpc3RVcmwiLCJwcmljZU9mZmVyVXJsIiwicHJpY2VPZmZlck1ldGhvZCIsImRyb3Bkb3duIiwiY2FydEJ1dHRvbnMiLCJ3aXNobGlzdEJ1dHRvbnMiLCJwcmljZU9mZmVyQnV0dG9ucyIsImF0dHJpYnV0ZXMiLCJwcm9kdWN0T3B0aW9ucyIsInByb2R1Y3RPcHRpb25GaWVsZCIsInF1YW50aXR5IiwidHBsIiwiYXR0cmlidXRJbWFnZXNTd2lwZXIiLCJ0cmlnZ2VyQXR0ckltYWdlc1RvIiwicHJvY2Vzc2luZ0NsYXNzIiwicHJvY2Vzc2luZ0R1cmF0aW9uIiwic2VsZWN0b3JNYXBwaW5nIiwiYnV0dG9ucyIsImdpZnRDb250ZW50IiwiZ2lmdExheWVyIiwic2hhcmVDb250ZW50Iiwic2hhcmVMYXllciIsImhpZGRlbk9wdGlvbnMiLCJtZXNzYWdlIiwibWVzc2FnZUNhcnQiLCJtZXNzYWdlSGVscCIsIm1vZGVsTnVtYmVyIiwibW9kZWxOdW1iZXJUZXh0IiwicHJpY2UiLCJtb2RpZmllcnNGb3JtIiwicXVhbnRpdHlJbmZvIiwicmliYm9uU3BlY2lhbCIsInNoaXBwaW5nSW5mb3JtYXRpb24iLCJzaGlwcGluZ1RpbWUiLCJzaGlwcGluZ1RpbWVJbWFnZSIsInRvdGFscyIsIndlaWdodCIsImFicm9hZFNoaXBwaW5nSW5mbyIsInBhZ2UiLCJvcHRpb25zIiwiZXh0ZW5kIiwibW9iaWxlIiwid2lkdGgiLCJfYWRkQnV0dG9uU3RhdGUiLCIkdGFyZ2V0Iiwic3RhdGUiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwiX3N0YXRlTWFuYWdlciIsIiRmb3JtIiwiZGlzYWJsZUJ1dHRvbnMiLCJzaG93Tm9Db21iaVNlbGVjdGVkTWVzc3NhZ2UiLCJhdHRySW1hZ2VzIiwibGVuZ3RoIiwiY29udGVudCIsImltYWdlcyIsInRyaWdnZXIiLCJqc2UiLCJsaWJzIiwidGhlbWUiLCJldmVudHMiLCJTTElERVNfVVBEQVRFIiwiZWFjaCIsImkiLCJ2IiwiJGVsZW1lbnQiLCJoYXNDbGFzcyIsImZpbmQiLCJzZWxlY3RvciIsInBhcmVudCIsInZhbHVlIiwidHlwZSIsImhpZGUiLCJzaG93IiwiaHRtbCIsImF0dHIiLCJrZXkiLCJyZXBsYWNlV2l0aCIsImVtcHR5IiwidGV4dCIsIiRidXR0b25zIiwic3VjY2VzcyIsInByb3AiLCIkZXJyb3JGaWVsZCIsIm1lc3NhZ2VOb0NvbWJpU2VsZWN0ZWQiLCJ1bmRlZmluZWQiLCJTVElDS1lCT1hfQ09OVEVOVF9DSEFOR0UiLCJfYWRkVG9Tb21ld2hlcmUiLCJ1cmwiLCIkYnV0dG9uIiwiY2FsbGJhY2siLCJ4aHIiLCJwb3N0IiwiZG9uZSIsInJlc3VsdCIsInN1YnN0ciIsImxvY2F0aW9uIiwiaHJlZiIsImNvcmUiLCJjb25maWciLCJnZXQiLCJDQVJUX1VQREFURSIsIm1vZGFsIiwiaW5mbyIsInRpdGxlIiwibXNnIiwiaWdub3JlIiwiZmFpbCIsImFsd2F5cyIsImhvb2tzIiwiZXhlY3V0ZSIsImtleXMiLCJzaG9wIiwiY2FydCIsImFkZCIsInRoZW4iLCJjYXRjaCIsIl9zdWJtaXRIYW5kbGVyIiwiZSIsInByZXZlbnREZWZhdWx0IiwiJHNlbGYiLCJpcyIsImNsb3Nlc3QiLCJjdXN0b21pemVyIiwicHJvcGVydGllcyIsInRhcmdldCIsInBhcmVudHMiLCJnZXRHYWxsZXJ5SGFzaCIsInZhbCIsImZvcm1kYXRhIiwiZm9ybSIsImdldERhdGEiLCJpc1Byb2R1Y3RJbmZvIiwiYWJvcnQiLCJjbGVhclRpbWVvdXQiLCJpbWFnZUdhbGxlcnkiLCJ0cmltIiwicmVwbGFjZUdhbGxlcnkiLCJsb2FkaW5nU3Bpbm5lciIsImxvYWRpbmdfc3Bpbm5lciIsInN3aXBlcnMiLCJlbGVtZW50IiwiaW5zdGFuY2UiLCJzd2lwZXIiLCJkZXN0cm95Iiwib2ZmIiwicmVtb3ZlIiwiaW1hZ2VNb2RhbCIsImluaXQiLCJldmVudCIsIkFERF9DVVNUT01JWkVSX1dJU0hMSVNUIiwiQUREX0NVU1RPTUlaRVJfQ0FSVCIsInN1Ym1pdCIsImRlZmVycmVkIiwiRGVmZXJyZWQiLCJjdXN0b21pemVyUmFuZG9tIiwibW9kaWZpZXJzIiwiX2NoYW5nZVByb2R1Y3RPcHRpb25zIiwib3B0aW9uIiwiY3VycmVudFRhcmdldCIsIm9wdGlvblZhbHVlIiwib3B0aW9uQ29udGFpbmVyIiwiX3NlbGVjdFNlbGVjdGVkTW9kaWZpZXJJbmZvIiwibGFiZWwiLCJfc2V0U2VsZWN0ZWRNb2RpZmllckluZm8iLCJfcmVzZXRTZWxlY3RlZE1vZGlmaWVySW5mbyIsInByaWNlSG9sZGVyIiwibGFiZWxIb2xkZXIiLCJfa2V5dXBIYW5kbGVyIiwiY2FsbCIsImJpbmQiLCJfYWRkVG9DYXJ0VGhyb2JiZXJIYW5kbGVyIiwiJGJ0biIsIiRidG5GYWtlIiwiZm9ybVJlYWR5IiwicHJlcGVuZCIsIl9jYXJ0RHJvcGRvd25PcGVuSGFuZGxlciIsImZha2VPcmlnTGFiZWwiLCJwcm9kdWN0Q291bnQiLCJ0ZXh0UGhyYXNlcyIsIkpTT04iLCJwYXJzZSIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZUludCIsIiRmb3JtcyIsIm9uIiwiY2xpY2siLCJub3QiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7QUFNQUEsT0FBT0MsT0FBUCxDQUFlQyxNQUFmLENBQ0MsY0FERCxFQUdDLENBQ0MsT0FERCxFQUVDLE1BRkQsRUFHQyxLQUhELEVBSUMsaUJBSkQsRUFLQ0YsT0FBT0csTUFBUCxHQUFnQixjQUxqQixFQU1DSCxPQUFP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LEVBT0VxQixFQVBGLENBT0ssTUFQTCxFQU9hckosUUFBUTlCLGtCQVByQixFQU95QyxFQUFDLFVBQVUsT0FBWCxFQVB6QyxFQU84RDhHLGNBUDlELEVBUUVxRSxFQVJGLENBUUssT0FSTCxFQVFjckosUUFBUS9CLGNBUnRCLEVBUXNDLEVBQUMsVUFBVSxPQUFYLEVBUnRDLEVBUTJELFVBQVNnSCxDQUFULEVBQVk7QUFDckU0QywrQkFBNEI1QyxDQUE1QjtBQUNBdUMseUJBQXNCdkMsQ0FBdEI7QUFDQSxHQVhGLEVBWUVvRSxFQVpGLENBWUssV0FaTCxFQVlrQnJKLFFBQVEvQixjQVoxQixFQVkwQzhKLHdCQVoxQyxFQWFFc0IsRUFiRixDQWFLLFVBYkwsRUFhaUJySixRQUFRL0IsY0FiekIsRUFheUMrSiwwQkFiekMsRUFjRXFCLEVBZEYsQ0FjSyxNQWRMLEVBY2FySixRQUFRN0IsUUFkckIsRUFjK0IsRUFBQyxVQUFVLE9BQVgsRUFkL0IsRUFjb0QsVUFBUzhHLENBQVQsRUFBWTtBQUM5REQsa0JBQWVDLENBQWY7QUFDQSxHQWhCRixFQWlCRW9FLEVBakJGLENBaUJLLE9BakJMLEVBaUJjckosUUFBUTdCLFFBakJ0QixFQWlCZ0MsRUFBQyxVQUFVLE9BQVgsRUFqQmhDLEVBaUJxRGdLLGFBakJyRDs7QUFtQkE7QUFDQTtBQUNBaUIsU0FBT0csR0FBUCxDQUFXLGtCQUFYLEVBQStCQSxHQUEvQixDQUFtQyxlQUFuQyxFQUFvRDlILElBQXBELENBQXlELFlBQVc7QUFDbkV1RCxrQkFBZW9ELElBQWYsQ0FBb0J2TCxFQUFFLElBQUYsQ0FBcEI7QUFDQSxHQUZEO0FBR0EyRztBQUNBLEVBckNEOztBQXVDQTtBQUNBLFFBQU8vRyxNQUFQO0FBQ0EsQ0F2bUJGIiwiZmlsZSI6IndpZGdldHMvY2FydF9oYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiBjYXJ0X2hhbmRsZXIuanMgMjAyMi0xMi0xM1xuIEdhbWJpbyBHbWJIXG4gaHR0cDovL3d3dy5nYW1iaW8uZGVcbiBDb3B5cmlnaHQgKGMpIDIwMjIgR2FtYmlvIEdtYkhcbiBSZWxlYXNlZCB1bmRlciB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgKFZlcnNpb24gMilcbiBbaHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzL2dwbC0yLjAuaHRtbF1cbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbi8qKlxuICogQ29tcG9uZW50IGZvciBoYW5kbGluZyB0aGUgYWRkIHRvIGNhcnQgYW5kIHdpc2hsaXN0IGZlYXR1cmVzXG4gKiBhdCB0aGUgcHJvZHVjdCBkZXRhaWxzIGFuZCB0aGUgY2F0ZWdvcnkgbGlzdGluZyBwYWdlcy4gSXQgY2FyZXNcbiAqIGZvciBhdHRyaWJ1dGVzLCBwcm9wZXJ0aWVzLCBxdWFudGl0eSBhbmQgYWxsIG90aGVyXG4gKiByZWxldmFudCBkYXRhIGZvciBhZGRpbmcgYW4gaXRlbSB0byB0aGUgYmFza2V0IG9yIHdpc2hsaXN0XG4gKi9cbmdhbWJpby53aWRnZXRzLm1vZHVsZShcblx0J2NhcnRfaGFuZGxlcicsXG5cdFxuXHRbXG5cdFx0J2hvb2tzJyxcblx0XHQnZm9ybScsXG5cdFx0J3hocicsXG5cdFx0J2xvYWRpbmdfc3Bpbm5lcicsXG5cdFx0Z2FtYmlvLnNvdXJjZSArICcvbGlicy9ldmVudHMnLFxuXHRcdGdhbWJpby5zb3VyY2UgKyAnL2xpYnMvbW9kYWwuZXh0LW1hZ25pZmljJyxcblx0XHRnYW1iaW8uc291cmNlICsgJy9saWJzL21vZGFsJ1xuXHRdLFxuXHRcblx0ZnVuY3Rpb24oZGF0YSkge1xuXHRcdFxuXHRcdCd1c2Ugc3RyaWN0Jztcblx0XHRcblx0XHQvLyAjIyMjIyMjIyMjIFZBUklBQkxFIElOSVRJQUxJWkFUSU9OICMjIyMjIyMjIyNcblx0XHRcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0JGJvZHkgPSAkKCdib2R5JyksXG5cdFx0XHQkd2luZG93ID0gJCh3aW5kb3cpLFxuXHRcdFx0YnVzeSA9IGZhbHNlLFxuXHRcdFx0YWpheCA9IG51bGwsXG5cdFx0XHR0aW1lb3V0ID0gMCxcblx0XHRcdHByZXZpb3VzTW9kaWZpZXJzID0ge30sXG5cdFx0XHRkZWZhdWx0cyA9IHtcblx0XHRcdFx0Ly8gQUpBWCBcImFkZCB0byBjYXJ0XCIgVVJMXG5cdFx0XHRcdGFkZENhcnRVcmw6ICdzaG9wLnBocD9kbz1DYXJ0L0J1eVByb2R1Y3QnLFxuXHRcdFx0XHQvLyBBSkFYIFwiYWRkIHRvIGNhcnRcIiBVUkwgZm9yIGN1c3RvbWl6ZXIgcHJvZHVjdHNcblx0XHRcdFx0YWRkQ2FydEN1c3RvbWl6ZXJVcmw6ICdzaG9wLnBocD9kbz1DYXJ0L0FkZCcsXG5cdFx0XHRcdC8vIEFKQVggVVJMIHRvIHBlcmZvcm0gYSB2YWx1ZSBjaGVja1xuXHRcdFx0XHRjaGVja1VybDogJ3Nob3AucGhwP2RvPUNoZWNrU3RhdHVzJyxcblx0XHRcdFx0Ly8gQUpBWCBVUkwgdG8gcGVyZm9ybSB0aGUgYWRkIHRvIHdpc2hsaXN0XG5cdFx0XHRcdHdpc2hsaXN0VXJsOiAnc2hvcC5waHA/ZG89V2lzaExpc3QvQWRkJyxcblx0XHRcdFx0Ly8gU3VibWl0IFVSTCBmb3IgcHJpY2Ugb2ZmZXIgYnV0dG9uXG5cdFx0XHRcdHByaWNlT2ZmZXJVcmw6ICdnbV9wcmljZV9vZmZlci5waHAnLFxuXHRcdFx0XHQvLyBTdWJtaXQgbWV0aG9kIGZvciBwcmljZSBvZmZlclxuXHRcdFx0XHRwcmljZU9mZmVyTWV0aG9kOiAnZ2V0Jyxcblx0XHRcdFx0Ly8gU2VsZWN0b3IgZm9yIHRoZSBjYXJ0IGRyb3Bkb3duXG5cdFx0XHRcdGRyb3Bkb3duOiAnI2hlYWRfc2hvcHBpbmdfY2FydCcsXG5cdFx0XHRcdC8vIFwiQWRkIHRvIGNhcnRcIiBidXR0b25zIHNlbGVjdG9yc1xuXHRcdFx0XHRjYXJ0QnV0dG9uczogJy5qcy1idG4tYWRkLXRvLWNhcnQnLFxuXHRcdFx0XHQvLyBcIldpc2hsaXN0XCIgYnV0dG9ucyBzZWxlY3RvcnNcblx0XHRcdFx0d2lzaGxpc3RCdXR0b25zOiAnLmJ0bi13aXNobGlzdCcsXG5cdFx0XHRcdC8vIFwiUHJpY2Ugb2ZmZXJcIiBidXR0b25zIHNlbGVjdG9yc1xuXHRcdFx0XHRwcmljZU9mZmVyQnV0dG9uczogJy5idG4tcHJpY2Utb2ZmZXInLFxuXHRcdFx0XHQvLyBTZWxlY3RvciBmb3IgdGhlIGF0dHJpYnV0ZSBmaWVsZHNcblx0XHRcdFx0YXR0cmlidXRlczogJy5qcy1jYWxjdWxhdGUnLFxuXHRcdFx0XHQvLyBTZWxlY3RvciBmb3IgcHJvZHVjdCBwcm9wZXJ0eVxuXHRcdFx0XHRwcm9kdWN0T3B0aW9uczogJy5tb2RpZmllci1ncm91cCAubW9kaWZpZXItY29udGVudCAubW9kaWZpZXItaXRlbScsXG5cdFx0XHRcdHByb2R1Y3RPcHRpb25GaWVsZDogJy5oaWRkZW4taW5wdXQnLFxuXHRcdFx0XHQvLyBTZWxlY3RvciBmb3IgdGhlIHF1YW50aXR5XG5cdFx0XHRcdHF1YW50aXR5OiAnLmpzLWNhbGN1bGF0ZS1xdHknLFxuXHRcdFx0XHQvLyBVUkwgd2hlcmUgdG8gZ2V0IHRoZSB0aGVtZSBmb3IgdGhlIGRyb3Bkb3duXG5cdFx0XHRcdHRwbDogbnVsbCxcblx0XHRcdFx0Ly8gU2hvdyBhdHRyaWJ1dGUgaW1hZ2VzIGluIHByb2R1Y3QgaW1hZ2VzIHN3aXBlciAoaWYgcG9zc2libGUpXG5cdFx0XHRcdC8vIC0tIHRoaXMgZmVhdHVyZSBpcyBub3Qgc3VwcG9ydGVkIHlldCAtLVxuXHRcdFx0XHRhdHRyaWJ1dEltYWdlc1N3aXBlcjogZmFsc2UsXG5cdFx0XHRcdC8vIFRyaWdnZXIgdGhlIGF0dHJpYnV0ZSBpbWFnZXMgdG8gdGhpcyBzZWxlY3RvcnNcblx0XHRcdFx0dHJpZ2dlckF0dHJJbWFnZXNUbzogJyNwcm9kdWN0X2ltYWdlX3N3aXBlciwgI3Byb2R1Y3RfdGh1bWJuYWlsX3N3aXBlciwgJ1xuXHRcdFx0XHRcdCsgJyNwcm9kdWN0X3RodW1ibmFpbF9zd2lwZXJfbW9iaWxlJyxcblx0XHRcdFx0Ly8gQ2xhc3MgdGhhdCBnZXRzIGFkZGVkIHRvIHRoZSBidXR0b24gb24gcHJvY2Vzc2luZ1xuXHRcdFx0XHRwcm9jZXNzaW5nQ2xhc3M6ICdsb2FkaW5nJyxcblx0XHRcdFx0Ly8gRHVyYXRpb24gZm9yIHRoYXQgdGhlIHN1Y2Nlc3Mgb3IgZmFpbCBjbGFzcyBnZXRzIGFkZGVkIHRvIHRoZSBidXR0b25cblx0XHRcdFx0cHJvY2Vzc2luZ0R1cmF0aW9uOiAyMDAwLFxuXHRcdFx0XHQvLyBBSkFYIHJlc3BvbnNlIGNvbnRlbnQgc2VsZWN0b3JzXG5cdFx0XHRcdHNlbGVjdG9yTWFwcGluZzoge1xuXHRcdFx0XHRcdGJ1dHRvbnM6ICcuc2hvcHBpbmctY2FydC1idXR0b24nLFxuXHRcdFx0XHRcdGdpZnRDb250ZW50OiAnLmdpZnQtY2FydC1jb250ZW50LXdyYXBwZXInLFxuXHRcdFx0XHRcdGdpZnRMYXllcjogJy5naWZ0LWNhcnQtbGF5ZXInLFxuXHRcdFx0XHRcdHNoYXJlQ29udGVudDogJy5zaGFyZS1jYXJ0LWNvbnRlbnQtd3JhcHBlcicsXG5cdFx0XHRcdFx0c2hhcmVMYXllcjogJy5zaGFyZS1jYXJ0LWxheWVyJyxcblx0XHRcdFx0XHRoaWRkZW5PcHRpb25zOiAnI2NhcnRfcXVhbnRpdHkgLmhpZGRlbi1vcHRpb25zJyxcblx0XHRcdFx0XHRtZXNzYWdlOiAnLmdsb2JhbC1lcnJvci1tZXNzYWdlcycsXG5cdFx0XHRcdFx0bWVzc2FnZUNhcnQ6ICcuY2FydC1lcnJvci1tc2cnLFxuXHRcdFx0XHRcdG1lc3NhZ2VIZWxwOiAnLmhlbHAtYmxvY2snLFxuXHRcdFx0XHRcdG1vZGVsTnVtYmVyOiAnLm1vZGVsLW51bWJlcicsXG5cdFx0XHRcdFx0bW9kZWxOdW1iZXJUZXh0OiAnLm1vZGVsLW51bWJlci10ZXh0Jyxcblx0XHRcdFx0XHRwcmljZTogJy5jdXJyZW50LXByaWNlLWNvbnRhaW5lcicsXG5cdFx0XHRcdFx0bW9kaWZpZXJzRm9ybTogJy5tb2RpZmllcnMtc2VsZWN0aW9uJyxcblx0XHRcdFx0XHRxdWFudGl0eTogJy5wcm9kdWN0cy1xdWFudGl0eS12YWx1ZScsXG5cdFx0XHRcdFx0cXVhbnRpdHlJbmZvOiAnLnByb2R1Y3RzLXF1YW50aXR5Jyxcblx0XHRcdFx0XHRyaWJib25TcGVjaWFsOiAnLnJpYmJvbi1zcGVjaWFsJyxcblx0XHRcdFx0XHRzaGlwcGluZ0luZm9ybWF0aW9uOiAnI3NoaXBwaW5nLWluZm9ybWF0aW9uLWxheWVyJyxcblx0XHRcdFx0XHRzaGlwcGluZ1RpbWU6ICcucHJvZHVjdHMtc2hpcHBpbmctdGltZS12YWx1ZScsXG5cdFx0XHRcdFx0c2hpcHBpbmdUaW1lSW1hZ2U6ICcuaW1nLXNoaXBwaW5nLXRpbWUgaW1nJyxcblx0XHRcdFx0XHR0b3RhbHM6ICcjY2FydF9xdWFudGl0eSAudG90YWwtYm94Jyxcblx0XHRcdFx0XHR3ZWlnaHQ6ICcucHJvZHVjdHMtZGV0YWlscy13ZWlnaHQtY29udGFpbmVyIHNwYW4nLFxuXHRcdFx0XHRcdGFicm9hZFNoaXBwaW5nSW5mbzogJy5hYnJvYWQtc2hpcHBpbmctaW5mbydcblx0XHRcdFx0fSxcblx0XHRcdFx0cGFnZTogJ3Byb2R1Y3QtbGlzdGluZydcblx0XHRcdH0sXG5cdFx0XHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRzLCBkYXRhKSxcblx0XHRcdG1vZHVsZSA9IHt9LFxuXHRcdFx0bW9iaWxlID0gJCh3aW5kb3cpLndpZHRoKCkgPD0gNzY3O1xuXHRcdFxuXHRcdFxuXHRcdC8vICMjIyMjIyMjIyMgSEVMUEVSIEZVTkNUSU9OUyAjIyMjIyMjIyMjXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogSGVscGVyIGZ1bmN0aW9uIHRoYXQgdXBkYXRlcyB0aGUgYnV0dG9uXG5cdFx0ICogc3RhdGUgd2l0aCBhbiBlcnJvciBvciBzdWNjZXNzIGNsYXNzIGZvclxuXHRcdCAqIGEgc3BlY2lmaWVkIGR1cmF0aW9uXG5cdFx0ICogQHBhcmFtICAge29iamVjdH0gICAgICAgICR0YXJnZXQgICAgICAgICBqUXVlcnkgc2VsZWN0aW9uIG9mIHRoZSB0YXJnZXQgYnV0dG9uXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gICAgICAgIHN0YXRlICAgICAgICAgICBUaGUgc3RhdGUgc3RyaW5nIHRoYXQgZ2V0cyBhZGRlZCB0byB0aGUgbG9hZGluZyBjbGFzc1xuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dmFyIF9hZGRCdXR0b25TdGF0ZSA9IGZ1bmN0aW9uKCR0YXJnZXQsIHN0YXRlKSB7XG5cdFx0XHR2YXIgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkdGFyZ2V0LnJlbW92ZUNsYXNzKG9wdGlvbnMucHJvY2Vzc2luZ0NsYXNzICsgJyAnICsgb3B0aW9ucy5wcm9jZXNzaW5nQ2xhc3MgKyBzdGF0ZSk7XG5cdFx0XHR9LCBvcHRpb25zLnByb2Nlc3NpbmdEdXJhdGlvbik7XG5cdFx0XHRcblx0XHRcdCR0YXJnZXRcblx0XHRcdFx0LmRhdGEoJ3RpbWVyJywgdGltZXIpXG5cdFx0XHRcdC5hZGRDbGFzcyhvcHRpb25zLnByb2Nlc3NpbmdDbGFzcyArIHN0YXRlKTtcblx0XHR9O1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEhlbHBlciBmdW5jdGlvbiB0byBzZXQgdGhlIG1lc3NhZ2VzIGFuZCB0aGVcblx0XHQgKiBidXR0b24gc3RhdGUuXG5cdFx0ICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgIGRhdGEgICAgICAgICAgICAgICAgUmVzdWx0IGZvcm0gdGhlIGFqYXggcmVxdWVzdFxuXHRcdCAqIEBwYXJhbSAgICAgICB7b2JqZWN0fSAgICAkZm9ybSAgICAgICAgICAgICAgIGpRdWVyeSBzZWxlY2lvbiBvZiB0aGUgZm9ybVxuXHRcdCAqIEBwYXJhbSAgICAgICB7Ym9vbGVhbn0gICBkaXNhYmxlQnV0dG9ucyAgICAgIElmIHRydWUsIHRoZSBidXR0b24gc3RhdGUgZ2V0cyBzZXQgdG8gKGluKWFjdGl2ZVxuXHRcdCAqIEBwYXJhbSAgICAgICB7Ym9vbGVhbn0gICBzaG93Tm9Db21iaU1lc3NzYWdlIElmIHRydWUsIHRoZSBlcnJvciBtZXNzYWdlIGZvciBtaXNzaW5nIHByb3BlcnR5IGNvbWJpbmF0aW9uIHNlbGVjdGlvbiB3aWxsIGJlIGRpc3BsYXllZFxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dmFyIF9zdGF0ZU1hbmFnZXIgPSBmdW5jdGlvbihkYXRhLCAkZm9ybSwgZGlzYWJsZUJ1dHRvbnMsIHNob3dOb0NvbWJpU2VsZWN0ZWRNZXNzc2FnZSkge1xuXHRcdFx0XG5cdFx0XHQvLyBSZW1vdmUgdGhlIGF0dHJpYnV0ZSBpbWFnZXMgZnJvbSB0aGUgY29tbW9uIGNvbnRlbnRcblx0XHRcdC8vIHNvIHRoYXQgaXQgZG9lc24ndCBnZXQgcmVuZGVyZWQgYW55bW9yZS4gVGhlbiB0cmlnZ2VyXG5cdFx0XHQvLyBhbiBldmVudCB0byB0aGUgZ2l2ZW4gc2VsZWN0b3JzIGFuZCBkZWxpdmVyIHRoZVxuXHRcdFx0Ly8gYXR0ckltYWdlcyBvYmplY3Rcblx0XHRcdGlmIChvcHRpb25zLmF0dHJpYnV0SW1hZ2VzU3dpcGVyICYmIGRhdGEuYXR0ckltYWdlcyAmJiBkYXRhLmF0dHJJbWFnZXMubGVuZ3RoKSB7XG5cdFx0XHRcdGRlbGV0ZSBkYXRhLmNvbnRlbnQuaW1hZ2VzO1xuXHRcdFx0XHQkKG9wdGlvbnMudHJpZ2dlckF0dHJJbWFnZXNUbylcblx0XHRcdFx0XHQudHJpZ2dlcihqc2UubGlicy50aGVtZS5ldmVudHMuU0xJREVTX1VQREFURSgpLCB7YXR0cmlidXRlczogZGF0YS5hdHRySW1hZ2VzfSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vIFNldCB0aGUgbWVzc2FnZXMgZ2l2ZW4gaW5zaWRlIHRoZSBkYXRhLmNvbnRlbnQgb2JqZWN0XG5cdFx0XHQkLmVhY2goZGF0YS5jb250ZW50LCBmdW5jdGlvbihpLCB2KSB7XG5cdFx0XHRcdHZhciAkZWxlbWVudCA9ICRib2R5Lmhhc0NsYXNzKCdwYWdlLXByb2R1Y3QtaW5mbycpID8gJHRoaXMuZmluZChvcHRpb25zLnNlbGVjdG9yTWFwcGluZ1t2LnNlbGVjdG9yXSkgOiAkZm9ybS5wYXJlbnQoKS5maW5kKG9wdGlvbnMuc2VsZWN0b3JNYXBwaW5nW3Yuc2VsZWN0b3JdKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmICgoIXNob3dOb0NvbWJpU2VsZWN0ZWRNZXNzc2FnZSB8fCB2LnZhbHVlID09PSAnJykgJiYgaSA9PT0gJ21lc3NhZ2VOb0NvbWJpU2VsZWN0ZWQnKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHN3aXRjaCAodi50eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSAnaGlkZSc6XG5cdFx0XHRcdFx0XHRpZiAodi52YWx1ZSA9PT0gJ3RydWUnKSB7XG5cdFx0XHRcdFx0XHRcdCRlbGVtZW50LmhpZGUoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdCRlbGVtZW50LnNob3coKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2h0bWwnOlxuXHRcdFx0XHRcdFx0JGVsZW1lbnQuaHRtbCh2LnZhbHVlKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ2F0dHJpYnV0ZSc6XG5cdFx0XHRcdFx0XHQkZWxlbWVudC5hdHRyKHYua2V5LCB2LnZhbHVlKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ3JlcGxhY2UnOlxuXHRcdFx0XHRcdFx0aWYgKHYudmFsdWUpIHtcblx0XHRcdFx0XHRcdFx0JGVsZW1lbnQucmVwbGFjZVdpdGgodi52YWx1ZSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQkZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygnaGlkZGVuJylcblx0XHRcdFx0XHRcdFx0XHQuZW1wdHkoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHQkZWxlbWVudC50ZXh0KHYudmFsdWUpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHQvLyBEaXMtIC8gRW5hYmxlIHRoZSBidXR0b25zXG5cdFx0XHRpZiAoZGlzYWJsZUJ1dHRvbnMpIHtcblx0XHRcdFx0dmFyICRidXR0b25zID0gJGZvcm0uZmluZChvcHRpb25zLmNhcnRCdXR0b25zKTtcblx0XHRcdFx0aWYgKGRhdGEuc3VjY2Vzcykge1xuXHRcdFx0XHRcdCRidXR0b25zLnJlbW92ZUNsYXNzKCdpbmFjdGl2ZScpO1xuXHRcdFx0XHRcdCRidXR0b25zLnJlbW92ZUNsYXNzKCdidG4taW5hY3RpdmUnKTtcblx0XHRcdFx0XHQkYnV0dG9ucy5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRidXR0b25zLmFkZENsYXNzKCdpbmFjdGl2ZScpO1xuXHRcdFx0XHRcdCRidXR0b25zLmFkZENsYXNzKCdidG4taW5hY3RpdmUnKTtcblx0XHRcdFx0XHQkYnV0dG9ucy5wcm9wKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKGRhdGEuY29udGVudC5tZXNzYWdlKSB7XG5cdFx0XHRcdHZhciAkZXJyb3JGaWVsZCA9ICRmb3JtLmZpbmQob3B0aW9ucy5zZWxlY3Rvck1hcHBpbmdbZGF0YS5jb250ZW50Lm1lc3NhZ2Uuc2VsZWN0b3JdKTtcblx0XHRcdFx0aWYgKGRhdGEuY29udGVudC5tZXNzYWdlLnZhbHVlKSB7XG5cdFx0XHRcdFx0JGVycm9yRmllbGRcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnaGlkZGVuJylcblx0XHRcdFx0XHRcdC5zaG93KCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JGVycm9yRmllbGRcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnaGlkZGVuJylcblx0XHRcdFx0XHRcdC5oaWRlKCk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKHNob3dOb0NvbWJpU2VsZWN0ZWRNZXNzc2FnZVxuXHRcdFx0XHRcdFx0JiYgZGF0YS5jb250ZW50Lm1lc3NhZ2VOb0NvbWJpU2VsZWN0ZWQgIT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0JiYgZGF0YS5jb250ZW50Lm1lc3NhZ2VOb0NvbWJpU2VsZWN0ZWQpIHtcblx0XHRcdFx0XHRcdGlmIChkYXRhLmNvbnRlbnQubWVzc2FnZU5vQ29tYmlTZWxlY3RlZC52YWx1ZSkge1xuXHRcdFx0XHRcdFx0XHQkZXJyb3JGaWVsZFxuXHRcdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnaGlkZGVuJylcblx0XHRcdFx0XHRcdFx0XHQuc2hvdygpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JGVycm9yRmllbGRcblx0XHRcdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2hpZGRlbicpXG5cdFx0XHRcdFx0XHRcdFx0LmhpZGUoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0JHdpbmRvdy50cmlnZ2VyKGpzZS5saWJzLnRoZW1lLmV2ZW50cy5TVElDS1lCT1hfQ09OVEVOVF9DSEFOR0UoKSk7XG5cdFx0fTtcblx0XHRcblx0XHQvKipcblx0XHQgKiBIZWxwZXIgZnVuY3Rpb24gdG8gc2VuZCB0aGUgYWpheFxuXHRcdCAqIE9uIHN1Y2Nlc3MgcmVkaXJlY3QgdG8gYSBnaXZlbiB1cmwsIG9wZW4gYSBsYXllciB3aXRoXG5cdFx0ICogYSBtZXNzYWdlIG9yIGFkZCB0aGUgaXRlbSB0byB0aGUgY2FydC1kcm9wZG93biBkaXJlY3RseVxuXHRcdCAqIChieSB0cmlnZ2VyaW5nIGFuIGV2ZW50IHRvIHRoZSBib2R5KVxuXHRcdCAqIEBwYXJhbSAgICAgICB7b2JqZWN0fSAgICAgIGRhdGEgICAgICBGb3JtIGRhdGFcblx0XHQgKiBAcGFyYW0gICAgICAge29iamVjdH0gICAgICAkZm9ybSAgICAgVGhlIGZvcm0gdG8gZmlsbFxuXHRcdCAqIEBwYXJhbSAgICAgICB7c3RyaW5nfSAgICAgIHVybCAgICAgICBUaGUgVVJMIGZvciB0aGUgQUpBWCByZXF1ZXN0XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR2YXIgX2FkZFRvU29tZXdoZXJlID0gZnVuY3Rpb24oZGF0YSwgJGZvcm0sIHVybCwgJGJ1dHRvbikge1xuXHRcdFx0ZnVuY3Rpb24gY2FsbGJhY2soKSB7XG5cdFx0XHRcdGpzZS5saWJzLnhoci5wb3N0KHt1cmw6IHVybCwgZGF0YTogZGF0YX0sIHRydWUpLmRvbmUoZnVuY3Rpb24ocmVzdWx0KSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdC8vIEZpbGwgdGhlIHBhZ2Ugd2l0aCB0aGUgcmVzdWx0IGZyb20gdGhlIGFqYXhcblx0XHRcdFx0XHRcdF9zdGF0ZU1hbmFnZXIocmVzdWx0LCAkZm9ybSwgZmFsc2UpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvLyBJZiB0aGUgQUpBWCB3YXMgc3VjY2Vzc2Z1bCBleGVjdXRlXG5cdFx0XHRcdFx0XHQvLyBhIGN1c3RvbSBmdW5jdGlvbmFsaXR5XG5cdFx0XHRcdFx0XHRpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRcdFx0c3dpdGNoIChyZXN1bHQudHlwZSkge1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ3VybCc6XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAocmVzdWx0LnVybC5zdWJzdHIoMCwgNCkgIT09ICdodHRwJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0ganNlLmNvcmUuY29uZmlnLmdldCgnYXBwVXJsJykgKyAnLycgKyByZXN1bHQudXJsO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9jYXRpb24uaHJlZiA9IHJlc3VsdC51cmw7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdGNhc2UgJ2Ryb3Bkb3duJzpcblx0XHRcdFx0XHRcdFx0XHRcdCRib2R5LnRyaWdnZXIoanNlLmxpYnMudGhlbWUuZXZlbnRzLkNBUlRfVVBEQVRFKCksIFt0cnVlXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRjYXNlICdsYXllcic6XG5cdFx0XHRcdFx0XHRcdFx0XHRqc2UubGlicy50aGVtZS5tb2RhbC5pbmZvKHt0aXRsZTogcmVzdWx0LnRpdGxlLCBjb250ZW50OiByZXN1bHQubXNnfSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGNhdGNoIChpZ25vcmUpIHtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0X2FkZEJ1dHRvblN0YXRlKCRidXR0b24sICctc3VjY2VzcycpO1xuXHRcdFx0XHR9KS5mYWlsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdF9hZGRCdXR0b25TdGF0ZSgkYnV0dG9uLCAnLWZhaWwnKTtcblx0XHRcdFx0fSkuYWx3YXlzKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIFJlc2V0IHRoZSBidXN5IGZsYWcgdG8gYmUgYWJsZSB0byBwZXJmb3JtXG5cdFx0XHRcdFx0Ly8gZnVydGhlciBBSkFYIHJlcXVlc3RzXG5cdFx0XHRcdFx0YnVzeSA9IGZhbHNlO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKCFidXN5KSB7XG5cdFx0XHRcdC8vIG9ubHkgZXhlY3V0ZSB0aGUgYWpheFxuXHRcdFx0XHQvLyBpZiB0aGVyZSBpcyBubyBwZW5kaW5nIGFqYXggY2FsbFxuXHRcdFx0XHRidXN5ID0gdHJ1ZTtcblx0XHRcdFx0XG5cdFx0XHRcdGpzZS5saWJzLmhvb2tzLmV4ZWN1dGUoanNlLmxpYnMuaG9va3Mua2V5cy5zaG9wLmNhcnQuYWRkLCBkYXRhLCA1MDApXG5cdFx0XHRcdFx0LnRoZW4oY2FsbGJhY2spXG5cdFx0XHRcdFx0LmNhdGNoKGNhbGxiYWNrKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0Ly8gIyMjIyMjIyMjIyBFVkVOVCBIQU5ETEVSICMjIyMjIyMjIyNcblx0XHRcblx0XHQvKipcblx0XHQgKiBIYW5kbGVyIGZvciB0aGUgc3VibWl0IGZvcm0gLyBjbGlja1xuXHRcdCAqIG9uIFwiYWRkIHRvIGNhcnRcIiAmIFwid2lzaGxpc3RcIiBidXR0b24uXG5cdFx0ICogSXQgcGVyZm9ybXMgYSBjaGVjayBvbiB0aGUgYXZhaWxhYmlsaXR5XG5cdFx0ICogb2YgdGhlIGNvbWJpbmF0aW9uIGFuZCBxdWFudGl0eS4gSWZcblx0XHQgKiBzdWNjZXNzZnVsIGl0IHBlcmZvcm1zIHRoZSBhZGQgdG8gY2FydFxuXHRcdCAqIG9yIHdpc2hsaXN0IGFjdGlvbiwgaWYgaXQncyBub3QgYVxuXHRcdCAqIFwiY2hlY2tcIiBjYWxsXG5cdFx0ICogQHBhcmFtICAgICAgIHtvYmplY3R9ICAgIGUgICAgICBqUXVlcnkgZXZlbnQgb2JqZWN0XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHR2YXIgX3N1Ym1pdEhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRpZiAoZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciAkc2VsZiA9ICQodGhpcyksXG5cdFx0XHRcdCRmb3JtID0gKCRzZWxmLmlzKCdmb3JtJykpID8gJHNlbGYgOiAkc2VsZi5jbG9zZXN0KCdmb3JtJyksXG5cdFx0XHRcdGN1c3RvbWl6ZXIgPSAkZm9ybS5oYXNDbGFzcygnY3VzdG9taXplcicpLFxuXHRcdFx0XHRwcm9wZXJ0aWVzID0gISEkZm9ybS5maW5kKCcucHJvcGVydGllcy1zZWxlY3Rpb24tZm9ybScpLmxlbmd0aCxcblx0XHRcdFx0bW9kdWxlID0gcHJvcGVydGllcyA/ICcnIDogJy9BdHRyaWJ1dGVzJyxcblx0XHRcdFx0c2hvd05vQ29tYmlTZWxlY3RlZE1lc3NzYWdlID0gZSAmJiBlLmRhdGEgJiYgZS5kYXRhLnRhcmdldCAmJiBlLmRhdGEudGFyZ2V0ICE9PSAnY2hlY2snO1xuXHRcdFx0XG5cdFx0XHRpZiAoJGZvcm0ubGVuZ3RoKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBTaG93IHByb3BlcnRpZXMgb3ZlcmxheVxuXHRcdFx0XHQvLyB0byBkaXNhYmxlIHVzZXIgaW50ZXJhY3Rpb25cblx0XHRcdFx0Ly8gYmVmb3JlIG1hcmt1cCByZXBsYWNlXG5cdFx0XHRcdGlmIChwcm9wZXJ0aWVzKSB7XG5cdFx0XHRcdFx0JHRoaXMuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgKCRzZWxmLmlzKCdzZWxlY3QnKSkge1xuXHRcdFx0XHRcdGxldCBwcmljZSA9ICRzZWxmLmZpbmQoXCI6c2VsZWN0ZWRcIikuYXR0cignZGF0YS1wcmljZScpO1xuXHRcdFx0XHRcdCRzZWxmLnBhcmVudHMoJy5tb2RpZmllci1ncm91cCcpLmZpbmQoJy5zZWxlY3RlZC12YWx1ZS1wcmljZScpLnRleHQocHJpY2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRsZXQgZ2V0R2FsbGVyeUhhc2ggPSAkKCcjY3VycmVudC1nYWxsZXJ5LWhhc2gnKS52YWwoKTtcblx0XHRcdFx0JGZvcm0uZmluZCgnI3VwZGF0ZS1nYWxsZXJ5LWhhc2gnKS52YWwoZ2V0R2FsbGVyeUhhc2gpO1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIGZvcm1kYXRhID0ganNlLmxpYnMuZm9ybS5nZXREYXRhKCRmb3JtLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0Zm9ybWRhdGEudGFyZ2V0ID0gKGUgJiYgZS5kYXRhICYmIGUuZGF0YS50YXJnZXQpID8gZS5kYXRhLnRhcmdldCA6ICdjaGVjayc7XG5cdFx0XHRcdGZvcm1kYXRhLmlzUHJvZHVjdEluZm8gPSAkZm9ybS5oYXNDbGFzcygncHJvZHVjdC1pbmZvJykgPyAxIDogMDtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIEFib3J0IHByZXZpb3VzIGNoZWNrIGFqYXggaWZcblx0XHRcdFx0Ly8gdGhlcmUgaXMgb25lIGluIHByb2dyZXNzXG5cdFx0XHRcdGlmIChhamF4ICYmIGUpIHtcblx0XHRcdFx0XHRhamF4LmFib3J0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdC8vIEFkZCBwcm9jZXNzaW5nLWNsYXNzIHRvIHRoZSBidXR0b25cblx0XHRcdFx0Ly8gYW5kIHJlbW92ZSBvbGQgdGltZWQgZXZlbnRzXG5cdFx0XHRcdGlmIChmb3JtZGF0YS50YXJnZXQgIT09ICdjaGVjaycpIHtcblx0XHRcdFx0XHR2YXIgdGltZXIgPSAkc2VsZi5kYXRhKCd0aW1lcicpO1xuXHRcdFx0XHRcdGlmICh0aW1lcikge1xuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JHNlbGZcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyhvcHRpb25zLnByb2Nlc3NpbmdDbGFzcyArICctc3VjY2VzcyAnICsgb3B0aW9ucy5wcm9jZXNzaW5nQ2xhc3MgKyAnLWZhaWwnKVxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKG9wdGlvbnMucHJvY2Vzc2luZ0NsYXNzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Zm9ybWRhdGEucHJldmlvdXNNb2RpZmllcnMgPSBwcmV2aW91c01vZGlmaWVycztcblx0XHRcdFx0XG5cdFx0XHRcdGFqYXggPSBqc2UubGlicy54aHIuZ2V0KHtcblx0XHRcdFx0XHR1cmw6IG9wdGlvbnMuY2hlY2tVcmwgKyBtb2R1bGUsXG5cdFx0XHRcdFx0ZGF0YTogZm9ybWRhdGFcblx0XHRcdFx0fSwgdHJ1ZSkuZG9uZShmdW5jdGlvbihyZXN1bHQpIHtcblx0XHRcdFx0XHRfc3RhdGVNYW5hZ2VyKHJlc3VsdCwgJGZvcm0sIHRydWUsIHNob3dOb0NvbWJpU2VsZWN0ZWRNZXNzc2FnZSk7XG5cdFx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBnYWxsZXJ5IGltYWdlcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3JtZGF0YS50YXJnZXQgPT09ICdjaGVjaycgJiYgcmVzdWx0LmNvbnRlbnQuaW1hZ2VHYWxsZXJ5LnRyaW0oKSAhPT0gJydcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHJlc3VsdC5jb250ZW50LnJlcGxhY2VHYWxsZXJ5ID09PSB0cnVlICYmIGZvcm1kYXRhLmlzUHJvZHVjdEluZm8gPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRpbmdTcGlubmVyID0ganNlLmxpYnMubG9hZGluZ19zcGlubmVyLnNob3coJCgnLnByb2R1Y3QtaW5mby1zdGFnZScpLCA5OTk5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3dpcGVycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcHJvZHVjdF9pbWFnZV9zd2lwZXInKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcHJvZHVjdF90aHVtYm5haWxfc3dpcGVyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3Byb2R1Y3RfdGh1bWJuYWlsX3N3aXBlcl9tb2JpbGUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHN3aXBlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGVsZW1lbnQuc3dpcGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5vZmYoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2ltYWdlLWNvbGxlY3Rpb24tY29udGFpbmVyJykuaHRtbChyZXN1bHQuY29udGVudC5pbWFnZUdhbGxlcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3Byb2R1Y3RfaW1hZ2VfbGF5ZXInKS5odG1sKHJlc3VsdC5jb250ZW50LmltYWdlTW9kYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBnYW1iaW8ud2lkZ2V0cy5pbml0KCQoJy5wcm9kdWN0LWluZm8tY29udGVudCcpKS5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzZS5saWJzLmxvYWRpbmdfc3Bpbm5lci5oaWRlKGxvYWRpbmdTcGlubmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1kYXRhLnRhcmdldCA9PT0gJ2NoZWNrJyAmJiByZXN1bHQuY29udGVudC5pbWFnZUdhbGxlcnkudHJpbSgpID09PSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgcmVzdWx0LmNvbnRlbnQucmVwbGFjZUdhbGxlcnkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpbWFnZS1jb2xsZWN0aW9uLWNvbnRhaW5lcicpLmh0bWwocmVzdWx0LmNvbnRlbnQuaW1hZ2VHYWxsZXJ5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwcm9kdWN0X2ltYWdlX2xheWVyJykuaHRtbChyZXN1bHQuY29udGVudC5pbWFnZU1vZGFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcblx0XHRcdFx0XHRpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcblx0XHRcdFx0XHRcdHZhciBldmVudCA9IG51bGwsXG5cdFx0XHRcdFx0XHRcdHVybCA9IG51bGw7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHN3aXRjaCAoZm9ybWRhdGEudGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3dpc2hsaXN0Jzpcblx0XHRcdFx0XHRcdFx0XHRpZiAoY3VzdG9taXplcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZXZlbnQgPSBqc2UubGlicy50aGVtZS5ldmVudHMuQUREX0NVU1RPTUlaRVJfV0lTSExJU1QoKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0dXJsID0gb3B0aW9ucy53aXNobGlzdFVybDtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0Y2FzZSAnY2FydCc6XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGN1c3RvbWl6ZXIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGV2ZW50ID0ganNlLmxpYnMudGhlbWUuZXZlbnRzLkFERF9DVVNUT01JWkVSX0NBUlQoKTtcblx0XHRcdFx0XHRcdFx0XHRcdHVybCA9IG9wdGlvbnMuYWRkQ2FydEN1c3RvbWl6ZXJVcmw7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHVybCA9IG9wdGlvbnMuYWRkQ2FydFVybDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3ByaWNlX29mZmVyJzpcblx0XHRcdFx0XHRcdFx0XHQkZm9ybS5hdHRyKCdhY3Rpb24nLCBvcHRpb25zLnByaWNlT2ZmZXJVcmwpLmF0dHIoJ21ldGhvZCcsIG9wdGlvbnMucHJpY2VPZmZlck1ldGhvZCk7XG5cdFx0XHRcdFx0XHRcdFx0JGZvcm0ub2ZmKCdzdWJtaXQnKTtcblx0XHRcdFx0XHRcdFx0XHQkZm9ybS5zdWJtaXQoKTtcblx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdCR3aW5kb3cudHJpZ2dlcihqc2UubGlicy50aGVtZS5ldmVudHMuU1RJQ0tZQk9YX0NPTlRFTlRfQ0hBTkdFKCkpO1xuXHRcdFx0XHRcdFx0XHRcdH0sIDI1MCk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmIChldmVudCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cdFx0XHRcdFx0XHRcdGRlZmVycmVkLmRvbmUoZnVuY3Rpb24oY3VzdG9taXplclJhbmRvbSkge1xuXHRcdFx0XHRcdFx0XHRcdGZvcm1kYXRhW2N1c3RvbWl6ZXJSYW5kb21dID0gMDtcblx0XHRcdFx0XHRcdFx0XHRfYWRkVG9Tb21ld2hlcmUoZm9ybWRhdGEsICRmb3JtLCB1cmwsICRzZWxmKTtcblx0XHRcdFx0XHRcdFx0fSkuZmFpbChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRfYWRkQnV0dG9uU3RhdGUoJHNlbGYsICctZmFpbCcpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0JGJvZHkudHJpZ2dlcihldmVudCwgW3snZGVmZXJyZWQnOiBkZWZlcnJlZCwgJ2RhdGFzZXQnOiBmb3JtZGF0YX1dKTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodXJsKSB7XG5cdFx0XHRcdFx0XHRcdF9hZGRUb1NvbWV3aGVyZShmb3JtZGF0YSwgJGZvcm0sIHVybCwgJHNlbGYpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAoZm9ybWRhdGEudGFyZ2V0ID09PSAnY2hlY2snKSB7XG5cdFx0XHRcdFx0XHRwcmV2aW91c01vZGlmaWVycyA9IGZvcm1kYXRhLm1vZGlmaWVycztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pLmZhaWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0X2FkZEJ1dHRvblN0YXRlKCRzZWxmLCAnLWZhaWwnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0XHQvKipcblx0XHQgKiBIYW5kbGVyIGZvciB0aGUgY2hhbmdlIHByb3BlcnR5IG9wdGlvblxuXHRcdCAqICovXG5cdFx0dmFyIF9jaGFuZ2VQcm9kdWN0T3B0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGxldCBvcHRpb24gPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0XHRsZXQgb3B0aW9uVmFsdWUgPSAkKG9wdGlvbikuZGF0YSgndmFsdWUnKTtcblx0XHRcdGxldCBvcHRpb25Db250YWluZXIgPSAkKG9wdGlvbikucGFyZW50cygnLm1vZGlmaWVyLWdyb3VwJyk7XG5cdFx0XHRcblx0XHRcdCQob3B0aW9uQ29udGFpbmVyKS5maW5kKCdsaS5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHQkKG9wdGlvbkNvbnRhaW5lcikuZmluZCgnLm1vZGlmaWVyLWl0ZW0uYWN0aXZlLW1vZGlmaWVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZS1tb2RpZmllcicpO1xuXHRcdFx0JChvcHRpb25Db250YWluZXIpLmZpbmQoJ2lucHV0LmhpZGRlbi1pbnB1dCcpLnZhbChvcHRpb25WYWx1ZSk7XG5cdFx0XHQkKG9wdGlvbkNvbnRhaW5lcikuZmluZCgnaW5wdXQuaGlkZGVuLWlucHV0JykudHJpZ2dlcignYmx1cicsIFtdKTtcblx0XHRcdFxuXHRcdFx0JChvcHRpb24pLnBhcmVudHMoJ2xpJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JChvcHRpb24pLmFkZENsYXNzKCdhY3RpdmUtbW9kaWZpZXInKTtcblx0XHR9O1xuXHRcdFxuXHRcdHZhciBfc2VsZWN0U2VsZWN0ZWRNb2RpZmllckluZm8gPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRsZXQgb3B0aW9uID0gZS5jdXJyZW50VGFyZ2V0O1xuXHRcdFx0bGV0IHByaWNlID0gJChvcHRpb24pLmF0dHIoJ2RhdGEtcHJpY2UnKTtcblx0XHRcdGxldCBsYWJlbCA9ICQob3B0aW9uKS5hdHRyKCdkYXRhLWxhYmVsJyk7XG5cdFx0XHQkKG9wdGlvbilcblx0XHRcdFx0LnBhcmVudHMoJy5tb2RpZmllci1ncm91cCcpXG5cdFx0XHRcdC5maW5kKCcuc2VsZWN0ZWQtdmFsdWUtcHJpY2UnKVxuXHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ3RlbXBvcmFyeS12YWx1ZScpXG5cdFx0XHRcdC5hdHRyKCdkYXRhLWRlZmF1bHQtcHJpY2UnLCBwcmljZSk7XG5cdFx0XHQkKG9wdGlvbikucGFyZW50cygnLm1vZGlmaWVyLWdyb3VwJykuZmluZCgnLnNlbGVjdGVkLXZhbHVlJykuYXR0cignZGF0YS1kZWZhdWx0LXZhbHVlJywgbGFiZWwpO1xuXHRcdH07XG5cdFx0XG5cdFx0dmFyIF9zZXRTZWxlY3RlZE1vZGlmaWVySW5mbyA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGxldCBvcHRpb24gPSBlLmN1cnJlbnRUYXJnZXQ7XG5cdFx0XHRpZiAoISQob3B0aW9uKS5wYXJlbnQoKS5oYXNDbGFzcygnYWN0aXZlJykgJiYgISQob3B0aW9uKS5pcygnc2VsZWN0JykgJiYgISQob3B0aW9uKVxuXHRcdFx0XHQuaGFzQ2xhc3MoJ2FjdGl2ZS1tb2RpZmllcicpKSB7XG5cdFx0XHRcdGxldCBwcmljZSA9ICQob3B0aW9uKS5hdHRyKCdkYXRhLXByaWNlJyk7XG5cdFx0XHRcdGxldCBsYWJlbCA9ICQob3B0aW9uKS5hdHRyKCdkYXRhLWxhYmVsJyk7XG5cdFx0XHRcdCQob3B0aW9uKVxuXHRcdFx0XHRcdC5wYXJlbnRzKCcubW9kaWZpZXItZ3JvdXAnKVxuXHRcdFx0XHRcdC5maW5kKCcuc2VsZWN0ZWQtdmFsdWUtcHJpY2UnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygndGVtcG9yYXJ5LXZhbHVlJylcblx0XHRcdFx0XHQudGV4dChwcmljZSk7XG5cdFx0XHRcdCQob3B0aW9uKS5wYXJlbnRzKCcubW9kaWZpZXItZ3JvdXAnKS5maW5kKCcuc2VsZWN0ZWQtdmFsdWUnKS50ZXh0KGxhYmVsKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdHZhciBfcmVzZXRTZWxlY3RlZE1vZGlmaWVySW5mbyA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGxldCBvcHRpb24gPSAkKHRoaXMpO1xuXHRcdFx0aWYgKCEkKG9wdGlvbikucGFyZW50KCkuaGFzQ2xhc3MoJ2FjdGl2ZScpICYmICEkKG9wdGlvbikuaXMoJ3NlbGVjdCcpICYmICEkKG9wdGlvbilcblx0XHRcdFx0Lmhhc0NsYXNzKCdhY3RpdmUtbW9kaWZpZXInKSkge1xuXHRcdFx0XHRsZXQgcHJpY2VIb2xkZXIgPSAkKG9wdGlvbikucGFyZW50cygnLm1vZGlmaWVyLWdyb3VwJykuZmluZCgnLnNlbGVjdGVkLXZhbHVlLXByaWNlJyk7XG5cdFx0XHRcdGxldCBsYWJlbEhvbGRlciA9ICQob3B0aW9uKS5wYXJlbnRzKCcubW9kaWZpZXItZ3JvdXAnKS5maW5kKCcuc2VsZWN0ZWQtdmFsdWUnKTtcblx0XHRcdFx0JChwcmljZUhvbGRlcikucmVtb3ZlQ2xhc3MoJ3RlbXBvcmFyeS12YWx1ZScpLnRleHQoJChwcmljZUhvbGRlcikuYXR0cignZGF0YS1kZWZhdWx0LXByaWNlJykpO1xuXHRcdFx0XHQkKGxhYmVsSG9sZGVyKS50ZXh0KCQobGFiZWxIb2xkZXIpLmF0dHIoJ2RhdGEtZGVmYXVsdC12YWx1ZScpKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdC8qKlxuXHRcdCAqIEtleXVwIGhhbmRsZXIgZm9yIHF1YW50aXR5IGlucHV0IGZpZWxkXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gZVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0dmFyIF9rZXl1cEhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcblx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRfc3VibWl0SGFuZGxlci5jYWxsKHRoaXMsIGUpXG5cdFx0XHR9LmJpbmQodGhpcyksIDMwMCk7XG5cdFx0fTtcblx0XHRcblx0XHQvKipcblx0XHQgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgYWRkIHRvIGNhcnQgYnV0dG9uLCB0aGF0IHNob3dzIG9yIGhpZGVzIHRoZSB0aHJvYmJlci5cblx0XHQgKi9cblx0XHRjb25zdCBfYWRkVG9DYXJ0VGhyb2JiZXJIYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0Y29uc3QgJGJ0biA9ICQodGhpcyk7XG5cdFx0XHRjb25zdCAkYnRuRmFrZSA9ICR0aGlzLmZpbmQoXCIuYnRuLWFkZC10by1jYXJ0LWZha2VcIik7XG5cdFx0XHRsZXQgZm9ybVJlYWR5ID0gdHJ1ZTtcblx0XHRcdFxuXHRcdFx0JChcIi5wcm9wZXJ0aWVzLXNlbGVjdGlvbi1mb3JtIHNlbGVjdFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuXHRcdFx0XHRpZiAoIXZhbCB8fCB2YWwgPCAxKSB7XG5cdFx0XHRcdFx0Zm9ybVJlYWR5ID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpZiAoZm9ybVJlYWR5KSB7XG5cdFx0XHRcdCRidG4uaGlkZSgpO1xuXHRcdFx0XHQkYnRuRmFrZS5zaG93KClcblx0XHRcdFx0XHQucHJvcChcImRpc2FibGVkXCIsIHRydWUpXG5cdFx0XHRcdFx0LnByZXBlbmQoJzxzcGFuIGNsYXNzPVwidGhyb2JibGVyXCI+PC9zcGFuPicpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogQ2FydCBkcm9wZG93biBvYmVuIGV2ZW50IGhhbmRsZXIgZm9yIHRoZSBib2R5LlxuXHRcdCAqL1xuXHRcdGNvbnN0IF9jYXJ0RHJvcGRvd25PcGVuSGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdGNvbnN0ICRidG4gPSAkdGhpcy5maW5kKFwiW25hbWU9YnRuLWFkZC10by1jYXJ0XVwiKTtcblx0XHRcdGNvbnN0ICRidG5GYWtlID0gJHRoaXMuZmluZChcIi5idG4tYWRkLXRvLWNhcnQtZmFrZVwiKTtcblx0XHRcdGNvbnN0IGZha2VPcmlnTGFiZWwgPSAkYnRuRmFrZS5odG1sKCk7XG5cdFx0XHRjb25zdCBwcm9kdWN0Q291bnQgPSAkKFwiLmNhcnQtcHJvZHVjdHMtY291bnRcIikuaHRtbCgpO1xuXHRcdFx0XG5cdFx0XHRjb25zdCB0ZXh0UGhyYXNlcyA9IEpTT04ucGFyc2UoJCgnI3Byb2R1Y3QtZGV0YWlscy10ZXh0LXBocmFzZXMnKS5odG1sKCkpO1xuXHRcdFx0Y29uc29sZS5sb2codGV4dFBocmFzZXNbJ3Byb2R1Y3RzSW5DYXJ0U3VmZml4J10pO1xuXHRcdFx0XG5cdFx0XHQkYnRuRmFrZS5odG1sKFwiPGkgY2xhc3M9XFxcImZhIGZhLWNoZWNrXFxcIj48L2k+IFwiICsgcGFyc2VJbnQocHJvZHVjdENvdW50KVxuXHRcdFx0XHQrIHRleHRQaHJhc2VzWydwcm9kdWN0c0luQ2FydFN1ZmZpeCddKVxuXHRcdFx0XHQucHJvcChcImRpc2FibGVkXCIsIHRydWUpXG5cdFx0XHRcdC5hZGRDbGFzcyhcImJ0bi1idXktY29tcGxldGVcIik7XG5cdFx0XHRcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdCRidG5GYWtlLmh0bWwoZmFrZU9yaWdMYWJlbClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoXCJidG4tYnV5LWNvbXBsZXRlXCIpXG5cdFx0XHRcdFx0LmhpZGUoKVxuXHRcdFx0XHRcdC5wcm9wKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuXHRcdFx0XHQkKFwiLnRocm9iYmxlclwiLCAkYnRuKS5yZW1vdmUoKTtcblx0XHRcdFx0JGJ0bi5zaG93KCk7XG5cdFx0XHR9LCA1MDAwKTtcblx0XHRcdFxuXHRcdH07XG5cdFx0XG5cdFx0XG5cdFx0Ly8gIyMjIyMjIyMjIyBJTklUSUFMSVpBVElPTiAjIyMjIyMjIyMjXG5cdFx0XG5cdFx0LyoqXG5cdFx0ICogSW5pdCBmdW5jdGlvbiBvZiB0aGUgd2lkZ2V0XG5cdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0ICovXG5cdFx0bW9kdWxlLmluaXQgPSBmdW5jdGlvbihkb25lKSB7XG5cdFx0XHRcblx0XHRcdHZhciAkZm9ybXMgPSAkdGhpcy5maW5kKCdmb3JtJyk7XG5cdFx0XHRcblx0XHRcdGlmIChvcHRpb25zLnBhZ2UgPT09ICdwcm9kdWN0LWluZm8nKSB7XG5cdFx0XHRcdCRmb3Jtcy5maW5kKFwiW25hbWU9YnRuLWFkZC10by1jYXJ0XVwiKVxuXHRcdFx0XHRcdC5vbigndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwnLCAoKSA9PiAkZm9ybXMuZmluZChcIltuYW1lPWJ0bi1hZGQtdG8tY2FydF1cIilcblx0XHRcdFx0XHRcdC5jbGljaygpKTtcblx0XHRcdFx0JGZvcm1zLmZpbmQoXCJbbmFtZT1idG4tYWRkLXRvLWNhcnRdXCIpLm9uKCdtb3VzZXVwJywgX2FkZFRvQ2FydFRocm9iYmVySGFuZGxlcik7XG5cdFx0XHRcdCQoXCJib2R5XCIpLm9uKCdDQVJUX0RST1BET1dOX09QRU4nLCBfY2FydERyb3Bkb3duT3BlbkhhbmRsZXIpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQkZm9ybXNcblx0XHRcdFx0Lm9uKCdzdWJtaXQnLCB7J3RhcmdldCc6ICdjYXJ0J30sIF9zdWJtaXRIYW5kbGVyKVxuXHRcdFx0XHQub24oJ2NsaWNrJywgb3B0aW9ucy53aXNobGlzdEJ1dHRvbnMsIHsndGFyZ2V0JzogJ3dpc2hsaXN0J30sIF9zdWJtaXRIYW5kbGVyKVxuXHRcdFx0XHQub24oJ2NsaWNrJywgb3B0aW9ucy5wcmljZU9mZmVyQnV0dG9ucywgeyd0YXJnZXQnOiAncHJpY2Vfb2ZmZXInfSwgX3N1Ym1pdEhhbmRsZXIpXG5cdFx0XHRcdC5vbignY2hhbmdlJywgb3B0aW9ucy5hdHRyaWJ1dGVzLCB7J3RhcmdldCc6ICdjaGVjayd9LCBfc3VibWl0SGFuZGxlcilcblx0XHRcdFx0Lm9uKCdtb3VzZW92ZXInLCBvcHRpb25zLmF0dHJpYnV0ZXMsIF9zZXRTZWxlY3RlZE1vZGlmaWVySW5mbylcblx0XHRcdFx0Lm9uKCdtb3VzZW91dCcsIG9wdGlvbnMuYXR0cmlidXRlcywgX3Jlc2V0U2VsZWN0ZWRNb2RpZmllckluZm8pXG5cdFx0XHRcdC5vbignYmx1cicsIG9wdGlvbnMucHJvZHVjdE9wdGlvbkZpZWxkLCB7J3RhcmdldCc6ICdjaGVjayd9LCBfc3VibWl0SGFuZGxlcilcblx0XHRcdFx0Lm9uKCdjbGljaycsIG9wdGlvbnMucHJvZHVjdE9wdGlvbnMsIHsndGFyZ2V0JzogJ2NoZWNrJ30sIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRfc2VsZWN0U2VsZWN0ZWRNb2RpZmllckluZm8oZSk7XG5cdFx0XHRcdFx0X2NoYW5nZVByb2R1Y3RPcHRpb25zKGUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQub24oJ21vdXNlb3ZlcicsIG9wdGlvbnMucHJvZHVjdE9wdGlvbnMsIF9zZXRTZWxlY3RlZE1vZGlmaWVySW5mbylcblx0XHRcdFx0Lm9uKCdtb3VzZW91dCcsIG9wdGlvbnMucHJvZHVjdE9wdGlvbnMsIF9yZXNldFNlbGVjdGVkTW9kaWZpZXJJbmZvKVxuXHRcdFx0XHQub24oJ2JsdXInLCBvcHRpb25zLnF1YW50aXR5LCB7J3RhcmdldCc6ICdjaGVjayd9LCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0X3N1Ym1pdEhhbmRsZXIoZSk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5vbigna2V5dXAnLCBvcHRpb25zLnF1YW50aXR5LCB7J3RhcmdldCc6ICdjaGVjayd9LCBfa2V5dXBIYW5kbGVyKTtcblx0XHRcdFxuXHRcdFx0Ly8gRmFsbGJhY2sgaWYgdGhlIGJhY2tlbmQgcmVuZGVycyBpbmNvcnJlY3QgZGF0YVxuXHRcdFx0Ly8gb24gaW5pdGlhbCBwYWdlIGNhbGxcblx0XHRcdCRmb3Jtcy5ub3QoJy5uby1zdGF0dXMtY2hlY2snKS5ub3QoJy5wcm9kdWN0LWluZm8nKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRfc3VibWl0SGFuZGxlci5jYWxsKCQodGhpcykpO1xuXHRcdFx0fSk7XG5cdFx0XHRkb25lKCk7XG5cdFx0fTtcblx0XHRcblx0XHQvLyBSZXR1cm4gZGF0YSB0byB3aWRnZXQgZW5naW5lXG5cdFx0cmV0dXJuIG1vZHVsZTtcblx0fSk7XG4iXX0=
