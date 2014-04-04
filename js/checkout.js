/// <reference path="jquery.ba-bbq.js"/>

//#region -- PLUGINS --

(function ($) {
	var $html_body = $('html, body');

	$.fn.toggleContainer = function (options) {
		// Default options
		var $self = this,
			settings = $.extend({
				content_element: undefined,
				pre_logic: undefined,
				post_toggle: undefined,
				callback: undefined,
				delay: 300,
				force_state: "", /* show|hide */
				firing_events: "click",
				toggle_self: true,
				toggle_order: "before", /* before|after */
				self_toggle_delay_offset: 100
			}, options),
			event_post_toggle = function (element) {
				settings.content_element.css("overflow", "inherit");
				if (settings.post_toggle !== undefined) {
					settings.post_toggle(element);
				}
			};

		if (settings.content_element !== undefined) {
			this.on(settings.firing_events, function (e) {
				e.stopPropagation();
				if (settings.pre_logic !== undefined) {
					settings.pre_logic(this);
				}
				// Toggle self (before)
				if (settings.toggle_self && settings.toggle_order == "before") {
					$self.fadeToggle(settings.delay + settings.self_toggle_delay_offset);
				}
				if (settings.force_state == "") {
					// Toggle container
					settings.content_element.slideToggle(settings.delay, function () {
						event_post_toggle(this);
					});
				}
				else {
					// Slide-up container
					if (settings.force_state == "show") {
						settings.content_element.slideDown(settings.delay, function () {
							event_post_toggle(this);
						});
					}
					else if (settings.force_state == "hide") {
						settings.content_element.slideUp(settings.delay, function () {
							event_post_toggle(this);
						});
					}
					else {
						settings.content_element.slideToggle(settings.delay, function () {
							event_post_toggle(this);
						});
					}
					// Slide-down container
				}
				// Toggle self (after)
				if (settings.toggle_self && settings.toggle_order == "after") {
					$self.fadeToggle(settings.delay + settings.self_toggle_delay_offset);
				}
				// Fire Callback
				if (settings.callback !== undefined) {
					settings.callback(this);
				}
			});
		}

		return this;
	};

	$.fn.animatedScroll = function (options) {
		// Default options
		var settings = $.extend({
			callback: undefined,
			delay: 300,
			easing: "linear"
		}, options);

		this.animatescroll({
			easing: settings.easing,
			scrollSpeed: settings.delay,
			afterScroll: settings.callback
		});

		return this;
	};
}(jQuery));

//#endregion PLUGINS

var Checkout = {
	"Data": {
		"cart_items": [
			{
				"name": "ProTouch No Sweat 4oz",
				"thumbnail": "images/product_1_thumb.png",
				"unit_price": 9.95,
				"quantity": 1,
				"extended_price": 9.95
			},
			{
				"name": "C22 Citrus Solvent 12oz",
				"thumbnail": "images/product_2_thumb.png",
				"unit_price": 14.90,
				"quantity": 2,
				"extended_price": 29.80
			},
			{
				"name": "Walker Adhesive Remover 4oz",
				"thumbnail": "images/product_3_thumb.png",
				"unit_price": 4.95,
				"quantity": 5,
				"extended_price": 24.75
			}
		],
		"checkout_costs": {
			"subtotal": 100
		}
	},
	"Fields": {
		"Shared": {
			"$cta_bar": undefined,
			"$btn_next": undefined,
			"$need_help": undefined,
			"$help_content": undefined,
			"$progress_bar": undefined,
			"$progress_bar_items": undefined,
			"$step_shipping_address": undefined,
			"$step_shipping_option": undefined,
			"$step_billing": undefined,
			"$step_review": undefined,
			"$step_confirmation": undefined,
			"$step_current": undefined,
			"$step_next": undefined,
			"$step_previous": undefined,
			"$form_inputs": undefined,
			"$footer": undefined,
			"$order_total": undefined
		},
		"ShippingAddress": {
			"$shipping_address_instructions": undefined,
			"$btnchangeaddress": undefined,
			"$btnadd_address": undefined,
			"$address_wrapper": undefined,
			"$address_list": undefined,
			"$default_address": undefined,
			"$additional_addresses": undefined,
			"$address_items": undefined,
			"$new_address_form": undefined,
			"$btncancel_address": undefined,
			"$btnsave_address": undefined,
			"$btnedit_address": undefined,
			"$input_country": undefined,
			"$input_name": undefined,
			"$input_company": undefined,
			"$input_street": undefined,
			"$input_city": undefined,
			"$input_state": undefined,
			"$input_postal": undefined,
			"$input_phone": undefined,
			"$secondary_fields": undefined,
			"$address_inputs": undefined
		},
		"ShippingMethod": {
			"$loading_panel": undefined,
			"$shipping_option_list": undefined
		},
		"BillingInfo": {
			"$promo_code_form": undefined,
			"$btnpromo_code": undefined,
			"$input_promo_code": undefined,
			"$promo_details": undefined,
			"$default_payment_container": undefined,
			"$default_payment": undefined,
			"$btnchange_payment_option": undefined,
			"$payment_wrapper": undefined,
			"$payment_option_list": undefined,
			"$payment_option_credit_card": undefined,
			"$payment_option_paypal": undefined,
			"$payment_option_default": undefined,
			"$credit_card_wrapper": undefined,
			"$credit_card_list": undefined,
			"$credit_cards": undefined,
			"$paypal_container": undefined,
			"$btncreate_credit_card": undefined,
			"$credit_card_form": undefined,
			"$credit_card_form_title": undefined,
			"$btnsave_credit_card": undefined,
			"$btncancel_credit_card": undefined,
			"$btnedit_credit_card": undefined,
			"$btnedit_default_credit_card": undefined,
			"$input_cc_name": undefined,
			"$input_cc_number": undefined,
			"$input_cc_expiration": undefined,
			"$input_cc_security_code": undefined,
			"$input_cc_store_in_wallet": undefined,
			"$edited_card_masked_number": undefined,
			"$edited_card_type": undefined,
			"$btnchange_billing_address": undefined,
			"$billing_address_container": undefined,
			"$card_billing_address_container": undefined,
			"$billing_address_items": undefined,
			"$billing_address_list": undefined,
			"$btnadd_billing_address": undefined,
			"$billing_address_form": undefined,
			"$billing_address_form_title": undefined,
			"$input_country": undefined,
			"$input_name": undefined,
			"$input_company": undefined,
			"$input_street": undefined,
			"$input_city": undefined,
			"$input_state": undefined,
			"$input_postal": undefined,
			"$input_phone": undefined,
			"$secondary_fields": undefined,
			"$address_inputs": undefined,
			"$credit_card_inputs": undefined,
			"$btnsave_address": undefined,
			"$btncancel_address": undefined,
			"$btnedit_address": undefined
		}
	},
	"Settings": {
		"Shared": {
			"footertop": undefined,
			"easing": 300,
			"step_url_prefix": "checkout-",
			"absoluteClassName": "absolute",
			"shipping_address_step_id": "shipping-address",
			"shipping_option_step_id": "shipping-method",
			"billing_step_id": "billing-information",
			"review_step_id": "order-review",
			"confirmation_step_id": "order-confirmation",
			"active_class": "active",
			"steps": []
		},
		"ShippingMethod": {
			"loading_panel_timeout": undefined
		}
	},
	"Functions": {
		"Shared": {
			"Init": function () {
				Checkout.Settings.Shared.steps = [Checkout.Settings.Shared.shipping_address_step_id, Checkout.Settings.Shared.shipping_option_step_id, Checkout.Settings.Shared.billing_step_id, Checkout.Settings.Shared.review_step_id, Checkout.Settings.Shared.confirmation_step_id]
				
				$(window).bind('hashchange', function (e) {
					var step = e.fragment.replace(Checkout.Settings.Shared.step_url_prefix, ""),
						previousStep = e.originalEvent !== undefined ? jQuery.param.fragment(e.originalEvent.oldURL).replace(Checkout.Settings.Shared.step_url_prefix, "") : undefined,
						stepNumber = jQuery.inArray(step, Checkout.Settings.Shared.steps);

					// Check if the hash is a step
					if (stepNumber > -1) {
						Checkout.Fields.Shared.$step_previous = previousStep !== undefined ? $("#" + previousStep) : undefined;
						Checkout.Fields.Shared.$step_current = $("#" + step);
						Checkout.Functions.Shared.InitCurrentStep(step);
					}
				});
				$(document).ready(function () {
					Checkout.Functions.Shared.SetGlobalVariables();
					Checkout.Functions.Shared.WireEvents();
					jQuery.bbq.pushState("#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.attr("id"), 2);
					$(window).trigger('hashchange');
				});
			},
			"SetGlobalVariables": function () {
				/// <summary>Gets DOM elements & other dynamic variable values.</summary>
				Checkout.Fields.Shared.$cta_bar = $(".cta_bar");
				Checkout.Fields.Shared.$btn_next = Checkout.Fields.Shared.$cta_bar.find("button");
				Checkout.Fields.Shared.$need_help = $(".need-help");
				Checkout.Fields.Shared.$help_content = $("#help-content");
				Checkout.Fields.Shared.$progress_bar = $("#progress-bar");
				Checkout.Fields.Shared.$progress_bar_items = Checkout.Fields.Shared.$progress_bar.find("a");
				Checkout.Fields.Shared.$step_shipping_address = $("#" + Checkout.Settings.Shared.shipping_address_step_id);
				Checkout.Fields.Shared.$step_shipping_option = $("#" + Checkout.Settings.Shared.shipping_option_step_id);
				Checkout.Fields.Shared.$step_billing = $("#" + Checkout.Settings.Shared.billing_step_id);
				Checkout.Fields.Shared.$step_review = $("#" + Checkout.Settings.Shared.billing_step_id);
				Checkout.Fields.Shared.$step_confirmation = $("#" + Checkout.Settings.Shared.confirmation_step_id);
				Checkout.Fields.Shared.$step_current = Checkout.Fields.Shared.$step_shipping_address;
				Checkout.Fields.Shared.$step_next = Checkout.Fields.Shared.$step_shipping_option;
				Checkout.Fields.Shared.$step_previous = Checkout.Fields.Shared.$step_current.prev();
				Checkout.Fields.Shared.$form_inputs = $("input[type=text], textarea, #country-input");
				Checkout.Fields.ShippingAddress.$shipping_address_instructions = Checkout.Fields.Shared.$step_shipping_address.find(".instructions");
				Checkout.Fields.ShippingAddress.$btnchangeaddress = Checkout.Fields.Shared.$step_shipping_address.find("button.changeaddress");
				Checkout.Fields.ShippingAddress.$btnadd_address = Checkout.Fields.Shared.$step_shipping_address.find("button.createaddress");
				Checkout.Fields.ShippingAddress.$address_wrapper = Checkout.Fields.Shared.$step_shipping_address.find(".address-wrapper");
				Checkout.Fields.ShippingAddress.$address_list = Checkout.Fields.ShippingAddress.$address_wrapper.find(".address-list");
				Checkout.Fields.ShippingAddress.$default_address = Checkout.Fields.ShippingAddress.$address_list.find(".default");
				Checkout.Fields.ShippingAddress.$additional_addresses = Checkout.Fields.ShippingAddress.$address_list.find(".additional-address");
				Checkout.Fields.ShippingAddress.$address_items = Checkout.Fields.ShippingAddress.$address_list.find("input[type=radio]");
				Checkout.Fields.ShippingAddress.$new_address_form = Checkout.Fields.Shared.$step_shipping_address.find("#new-address-form");
				Checkout.Fields.ShippingAddress.$btnedit_address = Checkout.Fields.Shared.$step_shipping_address.find(".address-item button");
				Checkout.Fields.ShippingAddress.$btncancel_address = Checkout.Fields.Shared.$step_shipping_address.find(".add-edit-address button.cancel");
				Checkout.Fields.ShippingAddress.$btnsave_address = Checkout.Fields.Shared.$step_shipping_address.find(".add-edit-address button.save");
				Checkout.Fields.ShippingAddress.$input_country = Checkout.Fields.Shared.$step_shipping_address.find("#country-input");
				Checkout.Fields.ShippingAddress.$input_name = Checkout.Fields.Shared.$step_shipping_address.find("#name-input");
				Checkout.Fields.ShippingAddress.$input_company = Checkout.Fields.Shared.$step_shipping_address.find("#company-input");
				Checkout.Fields.ShippingAddress.$input_street = Checkout.Fields.Shared.$step_shipping_address.find("#address-input");
				Checkout.Fields.ShippingAddress.$input_city = Checkout.Fields.Shared.$step_shipping_address.find("#city-input");
				Checkout.Fields.ShippingAddress.$input_state = Checkout.Fields.Shared.$step_shipping_address.find("#state-input");
				Checkout.Fields.ShippingAddress.$input_postal = Checkout.Fields.Shared.$step_shipping_address.find("#postal-code-input");
				Checkout.Fields.ShippingAddress.$input_phone = Checkout.Fields.Shared.$step_shipping_address.find("#phone-input");
				Checkout.Fields.ShippingAddress.$secondary_fields = Checkout.Fields.Shared.$step_shipping_address.find(".field__secondary");
				Checkout.Fields.ShippingAddress.$address_inputs = Checkout.Fields.Shared.$step_shipping_address.find("input[type=text], textarea, #country-input");
				Checkout.Fields.ShippingMethod.$loading_panel = Checkout.Fields.Shared.$step_shipping_option.find(".loading-panel");
				Checkout.Fields.ShippingMethod.$shipping_option_wrapper = Checkout.Fields.Shared.$step_shipping_option.find(".shipping-option-wrapper");
				Checkout.Fields.BillingInfo.$promo_code_form = Checkout.Fields.Shared.$step_billing.find("#promo-code-form");
				Checkout.Fields.BillingInfo.$btnpromo_code = Checkout.Fields.BillingInfo.$promo_code_form.find("button");
				Checkout.Fields.BillingInfo.$input_promo_code = Checkout.Fields.BillingInfo.$promo_code_form.find("#promo-code-input");
				Checkout.Fields.BillingInfo.$promo_details = Checkout.Fields.BillingInfo.$promo_code_form.find(".promo-details");
				Checkout.Fields.BillingInfo.$btnchange_payment_option = Checkout.Fields.Shared.$step_billing.find("button.change-payment-option");
				Checkout.Fields.BillingInfo.$default_payment_container = Checkout.Fields.Shared.$step_billing.find("div.default-payment");
				Checkout.Fields.BillingInfo.$default_payment = Checkout.Fields.BillingInfo.$default_payment_container.find("div.default");
				Checkout.Fields.BillingInfo.$payment_wrapper = Checkout.Fields.Shared.$step_billing.find("div.payment-wrapper");
				Checkout.Fields.BillingInfo.$payment_option_list = Checkout.Fields.BillingInfo.$payment_wrapper.find(".payment-option-list");
				Checkout.Fields.BillingInfo.$payment_option_credit_card = Checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-credit-card");
				Checkout.Fields.BillingInfo.$payment_option_paypal = Checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-paypal");
				Checkout.Fields.BillingInfo.$payment_option_default = Checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-default");
				Checkout.Fields.BillingInfo.$credit_card_wrapper = Checkout.Fields.Shared.$step_billing.find(".credit-card-wrapper");
				Checkout.Fields.BillingInfo.$credit_card_list = Checkout.Fields.BillingInfo.$credit_card_wrapper.find(".credit-card-list");
				Checkout.Fields.BillingInfo.$credit_cards = Checkout.Fields.BillingInfo.$credit_card_list.find(".credit-card-item input[type=radio]");
				Checkout.Fields.BillingInfo.$paypal_container = Checkout.Fields.Shared.$step_billing.find(".paypal-container");
				Checkout.Fields.BillingInfo.$btncreate_credit_card = Checkout.Fields.BillingInfo.$credit_card_wrapper.find(".create-credit-card");
				Checkout.Fields.BillingInfo.$credit_card_form = Checkout.Fields.BillingInfo.$credit_card_wrapper.find("#credit-card-form");
				Checkout.Fields.BillingInfo.$credit_card_form_title = Checkout.Fields.BillingInfo.$credit_card_form.find("h2");
				Checkout.Fields.BillingInfo.$btnsave_credit_card = Checkout.Fields.BillingInfo.$credit_card_form.find("button.save");
				Checkout.Fields.BillingInfo.$btncancel_credit_card = Checkout.Fields.BillingInfo.$credit_card_form.find("button.cancel");
				Checkout.Fields.BillingInfo.$btnedit_credit_card = Checkout.Fields.BillingInfo.$credit_card_list.find("button.edit-credit-card");
				Checkout.Fields.BillingInfo.$btnedit_default_credit_card = Checkout.Fields.BillingInfo.$default_payment_container.find("button.edit-credit-card");
				Checkout.Fields.BillingInfo.$input_cc_expiration = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-expiration-input");
				Checkout.Fields.BillingInfo.$input_cc_name = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-name-input");
				Checkout.Fields.BillingInfo.$input_cc_number = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-number-input");
				Checkout.Fields.BillingInfo.$input_cc_security_code = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-security-code-input");
				Checkout.Fields.BillingInfo.$input_cc_store_in_wallet = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-wallet-input");
				Checkout.Fields.BillingInfo.$edited_card_masked_number = Checkout.Fields.BillingInfo.$credit_card_form.find(".cc-number-masked");
				Checkout.Fields.BillingInfo.$edited_card_type = Checkout.Fields.BillingInfo.$credit_card_form.find("span.type");
				Checkout.Fields.BillingInfo.$card_billing_address_container = Checkout.Fields.BillingInfo.$credit_card_form.find(".billing-address");
				Checkout.Fields.BillingInfo.$btnchange_billing_address = Checkout.Fields.BillingInfo.$credit_card_form.find("button.change-billing-address");
				Checkout.Fields.BillingInfo.$billing_address_container = Checkout.Fields.Shared.$step_billing.find(".billing-address-container");
				Checkout.Fields.BillingInfo.$billing_address_list = Checkout.Fields.BillingInfo.$billing_address_container.find("ul.address-list");
				Checkout.Fields.BillingInfo.$billing_address_items = Checkout.Fields.BillingInfo.$billing_address_container.find("input[type=radio]");
				Checkout.Fields.BillingInfo.$btnadd_billing_address = Checkout.Fields.BillingInfo.$billing_address_container.find(".create-billing-address");
				Checkout.Fields.BillingInfo.$billing_address_form = Checkout.Fields.BillingInfo.$billing_address_container.find("#billing-address-form");
				Checkout.Fields.BillingInfo.$billing_address_form_title = Checkout.Fields.BillingInfo.$billing_address_container.find("h3.title");
				Checkout.Fields.BillingInfo.$input_country = Checkout.Fields.BillingInfo.$billing_address_form.find("#country-input");
				Checkout.Fields.BillingInfo.$input_name = Checkout.Fields.BillingInfo.$billing_address_form.find("#name-input");
				Checkout.Fields.BillingInfo.$input_company = Checkout.Fields.BillingInfo.$billing_address_form.find("#company-input");
				Checkout.Fields.BillingInfo.$input_street = Checkout.Fields.BillingInfo.$billing_address_form.find("#address-input");
				Checkout.Fields.BillingInfo.$input_city = Checkout.Fields.BillingInfo.$billing_address_form.find("#city-input");
				Checkout.Fields.BillingInfo.$input_state = Checkout.Fields.BillingInfo.$billing_address_form.find("#state-input");
				Checkout.Fields.BillingInfo.$input_postal = Checkout.Fields.BillingInfo.$billing_address_form.find("#postal-code-input");
				Checkout.Fields.BillingInfo.$input_phone = Checkout.Fields.BillingInfo.$billing_address_form.find("#phone-input");
				Checkout.Fields.BillingInfo.$secondary_fields = Checkout.Fields.BillingInfo.$billing_address_form.find(".field__secondary");
				Checkout.Fields.BillingInfo.$address_inputs = Checkout.Fields.BillingInfo.$billing_address_form.find("input[type=text], textarea, #country-input");
				Checkout.Fields.BillingInfo.$credit_card_inputs = Checkout.Fields.BillingInfo.$credit_card_form.find("input[type=text], textarea");
				Checkout.Fields.BillingInfo.$btncancel_address = Checkout.Fields.BillingInfo.$billing_address_form.find("button.cancel");
				Checkout.Fields.BillingInfo.$btnsave_address = Checkout.Fields.BillingInfo.$billing_address_form.find("button.save");
				Checkout.Fields.BillingInfo.$btnedit_address = Checkout.Fields.BillingInfo.$billing_address_list.find("button.edit");
			},
			"WireEvents": function () {
				/// <summary>Wire up control events</summary>
				Checkout.Functions.Shared.BindEvents_NeedHelp(false);
				Checkout.Functions.Shared.BindEvents_NextButton(false);
				Checkout.Functions.Shared.BindEvents_FormInputs(false);
				Checkout.Functions.Shared.BindEvents_ProgressBarItems(false);
				Checkout.Functions.ShippingAddress.BindEvents_AdditionalAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_AddressItems(false);
				Checkout.Functions.ShippingAddress.BindEvents_AddAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_CancelAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_SaveAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_AddressForm(false);
				Checkout.Functions.ShippingAddress.BindEvents_CountrySelect(false);
				Checkout.Functions.BillingInfo.BindEvents_PromoCodeForm(false);
				Checkout.Functions.BillingInfo.BindEvents_PromoCodeButton(false);
				Checkout.Functions.BillingInfo.BindEvents_ChangePaymentOptionButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardOptionButton(false);
				Checkout.Functions.BillingInfo.BindEvents_PayPalOptionButton(false);
				Checkout.Functions.BillingInfo.BindEvents_DefaultOptionButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreateCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardForm(false);
				Checkout.Functions.BillingInfo.BindEvents_SaveCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CancelCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_EditCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_EditDefaultCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardItems(false);
				Checkout.Functions.BillingInfo.BindEvents_ChangeBillingAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_BillingAddressItem(false);
				Checkout.Functions.BillingInfo.BindEvents_AddBillingAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_BillingAddressForm(false);
				Checkout.Functions.BillingInfo.BindEvents_BillingCountrySelect(false);
				Checkout.Functions.BillingInfo.BindEvents_CancelAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_SaveAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_EditAddressButton(false);
			},
			"InitCurrentStep": function (step_name) {
				var $currentProgressBarItem = $("a[href=#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.attr("id") + "]").parent();
				Checkout.Functions.Shared.SetActiveProgressBarItem($currentProgressBarItem);
				if (Checkout.Fields.Shared.$step_previous !== undefined) {
					Checkout.Fields.Shared.$progress_bar.animatedScroll();
					Checkout.Fields.Shared.$step_previous.slideUp(Checkout.Settings.Shared.easing - 200, function () {
						Checkout.Functions.Shared.RestoreStepDefaultView(Checkout.Fields.Shared.$step_previous.attr("id"));
						Checkout.Fields.Shared.$step_current.slideDown(Checkout.Settings.Shared.easing);
					});
				}
				else {
					Checkout.Fields.Shared.$step_current.slideDown(Checkout.Settings.Shared.easing);
				}
				switch (step_name) {
					case Checkout.Settings.Shared.shipping_address_step_id:
						break;
					case Checkout.Settings.Shared.shipping_option_step_id:
						Checkout.Settings.ShippingMethod.loading_panel_timeout = setTimeout(function () {
							Checkout.Fields.ShippingMethod.$loading_panel.fadeOut(Checkout.Settings.Shared.easing - 200, function () {
								Checkout.Fields.ShippingMethod.$shipping_option_wrapper.slideDown(Checkout.Settings.Shared.easing, function () {
									Checkout.Fields.Shared.$step_shipping_option.animatedScroll();
								});
							});
						}, 3000);
						break;
					case Checkout.Settings.Shared.billing_step_id:
						break;
					case Checkout.Settings.Shared.review_step_id:
						break;
					case Checkout.Settings.Shared.confirmation_step_id:
						break;
				}
			},
			"SetActiveProgressBarItem": function ($activeItem) {
				$activeItem.addClass(Checkout.Settings.Shared.active_class).siblings().removeClass(Checkout.Settings.Shared.active_class);
			},
			"RestoreStepDefaultView": function (step_name) {
				/// <summary>Restores the UI to the default view so that the next time the user visits the step the interaction works correctly.</summary>
				switch (step_name) {
					case Checkout.Settings.Shared.shipping_address_step_id:
						break;
					case Checkout.Settings.Shared.shipping_option_step_id:
						Checkout.Fields.ShippingMethod.$loading_panel.show();
						Checkout.Fields.ShippingMethod.$shipping_option_wrapper.hide();
						clearTimeout(Checkout.Settings.ShippingMethod.loading_panel_timeout);
						break;
					case Checkout.Settings.Shared.billing_step_id:
						break;
					case Checkout.Settings.Shared.review_step_id:
						break;
					case Checkout.Settings.Shared.confirmation_step_id:
						break;
				}
			},
			"UpdateOrderTotal": function () {
				Checkout.Functions.Shared.CalculateCartTotal();
			},
			"CalculateCartTotal": function () {
				// reset the subotal
				Checkout.Data.checkout_costs.subtotal = 0;
				$.each(Checkout.Data.cart_items, function (i, cart_item) {
					Checkout.Data.checkout_costs.subtotal = Checkout.Functions.Shared.GetDecimal(Checkout.Functions.Shared.GetDecimal(Checkout.Data.checkout_costs.subtotal, 2) + Checkout.Functions.Shared.GetDecimal(cart_item.extended_price, 2));
				});
			},
			"GetDecimal": function (number, decimalPlaces) {
				/// <summary>Converts a string to a decimal.</summary>
				/// <param name="number" type="String">The string to convert.</param>
				/// <param name="decimalPlaces" type="Int">The number of decimals to format the number to.</param>
				/// <returns type="Decimal" />
				return parseFloat(parseFloat(number).toFixed(decimalPlaces));
			},
			"BindEvents_FormInputs": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$form_inputs = $(Checkout.Fields.Shared.$form_inputs.selector);
				}
				Checkout.Fields.Shared.$form_inputs.on("change", function () {
					var $this = $(this);
					if ($this.val() != "") {
						$this.siblings().addClass("notempty");
					}
					else {
						$this.siblings().removeClass("notempty");
					}
				});
			},
			"BindEvents_NeedHelp": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$need_help = $(Checkout.Fields.Shared.$need_help.selector);
				}
				Checkout.Fields.Shared.$need_help.on("click", function () {
					Checkout.Fields.Shared.$help_content.animatedScroll();
				});
			},
			"BindEvents_NextButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$btn_next = $(Checkout.Fields.Shared.$btn_next.selector);
				}

				Checkout.Fields.Shared.$btn_next.on("click", function () {
					jQuery.bbq.pushState("#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.next().attr("id"), 2);
				});
			},
			"BindEvents_ProgressBarItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$progress_bar_items = $(Checkout.Fields.Shared.$progress_bar_items.selector);
				}

				Checkout.Fields.Shared.$progress_bar_items.on("click", function () {
					var $parent = $(this).parent();
					Checkout.Functions.Shared.SetActiveProgressBarItem($parent);
				});
			}
		},
		"ShippingAddress": {
			"BindEvents_AdditionalAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btnchangeaddress = $("'" + Checkout.Fields.ShippingAddress.$btnchangeaddress.selector + "'");
				}
				Checkout.Fields.ShippingAddress.$btnchangeaddress.toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$additional_addresses,
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
					toggle_self: false
				});
			},
			"BindEvents_AddressItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$address_items = $(Checkout.Fields.ShippingAddress.$address_items.selector);
				}
				Checkout.Fields.ShippingAddress.$address_items.toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					toggle_self: false,
					force_state: "hide"
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
					toggle_self: false,
					force_state: "show"
				});
			},
			"BindEvents_AddAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btnadd_address = $(Checkout.Fields.ShippingAddress.$btnadd_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btnadd_address.toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing,
					pre_logic: function () {
						Checkout.Functions.ShippingAddress.ResetAddressForm();
					},
					post_toggle: function () {
						Checkout.Fields.ShippingAddress.$new_address_form.animatedScroll();
					}
				});
			},
			"BindEvents_EditAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btnedit_address = $(Checkout.Fields.ShippingAddress.$btnedit_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btnedit_address.on("click", function (e) {
					var $this = $(this);
					e.stopPropagation();
					$this.parent().parent().find("input[type=radio]").trigger("click");
					// Hide the new address button
					Checkout.Fields.ShippingAddress.$btnadd_address.slideUp(Checkout.Settings.Shared.easing - 200);
					// Set the input values
					Checkout.Fields.ShippingAddress.$input_country.val("CA");
					Checkout.Fields.ShippingAddress.$input_name.val("Editing Name");
					Checkout.Fields.ShippingAddress.$input_company.val("Editing Company");
					Checkout.Fields.ShippingAddress.$input_street.val("Editing Street Address");
					Checkout.Fields.ShippingAddress.$input_city.val("Editing City");
					Checkout.Fields.ShippingAddress.$input_state.val("Editing State");
					Checkout.Fields.ShippingAddress.$input_postal.val("Editing Postal Code");
					Checkout.Fields.ShippingAddress.$input_phone.val("Editing Phone");
					Checkout.Fields.ShippingAddress.$address_inputs.trigger("change");
					Checkout.Fields.ShippingAddress.$secondary_fields.css("display", "");
					// Display the address form
					Checkout.Fields.ShippingAddress.$new_address_form.slideDown(Checkout.Settings.Shared.easing, function () {
						Checkout.Fields.ShippingAddress.$new_address_form.animatedScroll();
					});
					return false;
				});
			},
			"BindEvents_CancelAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btncancel_address = $(Checkout.Fields.ShippingAddress.$btncancel_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btncancel_address.on("click", function () {
					if (Checkout.Fields.ShippingAddress.$additional_addresses.is(":visible")) {
						Checkout.Fields.ShippingAddress.$btnadd_address.slideDown(Checkout.Settings.Shared.easing - 200);
					}
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					toggle_self: false,
					pre_logic: function () {
						// Scroll to the progress bar
						Checkout.Fields.Shared.$progress_bar.animatedScroll();
					},
					callback: Checkout.Functions.ShippingAddress.ResetAddressForm
				});
			},
			"BindEvents_SaveAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btnsave_address = $(Checkout.Fields.ShippingAddress.$btnsave_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btnsave_address.toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
					delay: Checkout.Settings.Shared.easing - 200,
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					toggle_self: false,
					pre_logic: function () {
						var $newAddress,
							mu = '<li class="additional-address grid__item one-whole desk-one-half address-item">';
						mu += '<input type="radio" name="select-address" id="address4" value="address4">';
						mu += '<label for="address4" class="card">';
						mu += '<span class="btn shiptothis secondary small"></span>';
						mu += '<button class="btn edit tertiary small">Edit</button>';
						mu += '<div class="address">';
						mu += '<span class="name">' + Checkout.Fields.ShippingAddress.$input_name.val() + '</span>';
						mu += '<span class="company">' + Checkout.Fields.ShippingAddress.$input_company.val() + '</span>';
						mu += '<span class="street">' + Checkout.Fields.ShippingAddress.$input_street.val() + '</span>,';
						mu += '<span class="city">' + Checkout.Fields.ShippingAddress.$input_city.val() + '</span>';
						mu += '<span class="state">' + Checkout.Fields.ShippingAddress.$input_state.val() + '</span>';
						mu += '<span class="zip">' + Checkout.Fields.ShippingAddress.$input_postal.val() + '</span>';
						mu += '<span class="country">' + Checkout.Fields.ShippingAddress.$input_country.val() + '</span>';
						mu += '<span class="phone">' + Checkout.Fields.ShippingAddress.$input_phone.val() + '</span>';
						mu += '</div></label></li>';
						$newAddress = $(mu);
						Checkout.Fields.ShippingAddress.$address_list.append($newAddress);
						Checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(true);
						$newAddress.find("input[type=radio]").trigger("click");
					},
					callback: function (element, event) {
						Checkout.Functions.ShippingAddress.ResetAddressForm();
						// Scroll to the new address
						Checkout.Fields.ShippingAddress.$address_list.find("input[type=radio]:checked").parent().animatedScroll();
					}
				});
			},
			"BindEvents_AddressForm": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$new_address_form = $(Checkout.Fields.ShippingAddress.$new_address_form.selector);
				}
				Checkout.Fields.ShippingAddress.$new_address_form.on("submit", function (e) {
					e.preventDefault();
					// DO STUFF
				});
			},
			"BindEvents_CountrySelect": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$input_country = $(Checkout.Fields.ShippingAddress.$input_country.selector);
				}
				Checkout.Fields.ShippingAddress.$input_country.toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$secondary_fields,
					firing_events: "change",
					force_state: "show",
					toggle_self: false
				})
			},
			"ResetAddressForm": function () {
				Checkout.Fields.ShippingAddress.$input_country.val("");
				Checkout.Fields.ShippingAddress.$input_name.val("");
				Checkout.Fields.ShippingAddress.$input_company.val("");
				Checkout.Fields.ShippingAddress.$input_street.val("");
				Checkout.Fields.ShippingAddress.$input_city.val("");
				Checkout.Fields.ShippingAddress.$input_state.val("");
				Checkout.Fields.ShippingAddress.$input_postal.val("");
				Checkout.Fields.ShippingAddress.$input_phone.val("");
				Checkout.Fields.ShippingAddress.$address_inputs.trigger("change");
				Checkout.Fields.ShippingAddress.$secondary_fields.css("display", "none");
			}
		},
		"ShippingOption": {

		},
		"BillingInfo": {
			"BindEvents_PromoCodeButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnpromo_code = $(Checkout.Fields.BillingInfo.$btnpromo_code.selector);
				}
				Checkout.Fields.BillingInfo.$btnpromo_code.on("click", function () {
					var $this = $(this),
						mode = $this.text(),
						applyMode = $this.attr("data-text"),
						unapplyMode = $this.attr("data-text-alt");
					if (mode == applyMode) {
						$this.text(unapplyMode);
						Checkout.Fields.BillingInfo.$promo_details.html("Promo code <span>" + Checkout.Fields.BillingInfo.$input_promo_code.val() + "</span> has been applied to your order. You saved: $3.75")
						Checkout.Fields.BillingInfo.$input_promo_code.fadeOut(Checkout.Settings.Shared.easing - 200).val("").next().hide();
						Checkout.Fields.BillingInfo.$promo_details.fadeIn(Checkout.Settings.Shared.easing - 200);
					}
					else {
						$this.text(applyMode);
						Checkout.Fields.BillingInfo.$promo_details.html("")
						Checkout.Fields.BillingInfo.$promo_details.fadeOut(Checkout.Settings.Shared.easing - 200);
						Checkout.Fields.BillingInfo.$input_promo_code.val("").fadeIn(Checkout.Settings.Shared.easing - 200).next().removeClass("notempty").show();
					}
				});
			},
			"BindEvents_ChangePaymentOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnchange_payment_option = $(Checkout.Fields.BillingInfo.$btnchange_payment_option.selector);
				}
				Checkout.Fields.BillingInfo.$btnchange_payment_option.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$payment_wrapper,
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$default_payment_container,
					toggle_self: false,
					post_toggle: function () {
						Checkout.Fields.BillingInfo.$payment_wrapper.animatedScroll();
					}
				});
			},
			"BindEvents_CreditCardOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$payment_option_credit_card = $(Checkout.Fields.BillingInfo.$payment_option_credit_card.selector);
				}
				Checkout.Fields.BillingInfo.$payment_option_credit_card.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$default_payment,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$paypal_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					force_state: "show",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_list,
					force_state: "show",
					toggle_self: false,
					post_toggle: function () {
						Checkout.Fields.BillingInfo.$credit_card_list.animatedScroll();
					}
				});
			},
			"BindEvents_PayPalOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$payment_option_paypal = $(Checkout.Fields.BillingInfo.$payment_option_paypal.selector);
				}
				Checkout.Fields.BillingInfo.$payment_option_paypal.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$default_payment,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_list,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$paypal_container,
					force_state: "show",
					toggle_self: false,
					post_toggle: function () {
						Checkout.Fields.BillingInfo.$paypal_container.animatedScroll();
					}
				});
			},
			"BindEvents_DefaultOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$payment_option_default = $(Checkout.Fields.BillingInfo.$payment_option_default.selector);
				}

				Checkout.Fields.BillingInfo.$payment_option_default.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					pre_logic: function () {
						Checkout.Fields.BillingInfo.$default_payment.insertAfter(Checkout.Fields.BillingInfo.$payment_option_list).wrap("<div class='grid'></div>").find("h3").hide();
						Checkout.Functions.BillingInfo.BindEvents_EditDefaultCreditCardButton(true);
					},
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_list,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$paypal_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$default_payment,
					force_state: "show",
					toggle_self: false,
					post_toggle: function () {
						Checkout.Fields.BillingInfo.$default_payment.animatedScroll();
					}
				});
			},
			"BindEvents_CreateCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btncreate_credit_card = $(Checkout.Fields.BillingInfo.$btncreate_credit_card.selector);
				}

				Checkout.Fields.BillingInfo.$btncreate_credit_card.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing,
					pre_logic: function () {
						Checkout.Functions.BillingInfo.ResetCreditCardForm();
						Checkout.Functions.BillingInfo.ToggleCreditCardFormMode("new");
					},
					callback: function () {
						Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					}
				});
			},
			"BindEvents_SaveCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnsave_credit_card = $(Checkout.Fields.BillingInfo.$btnsave_credit_card.selector);
				}

				Checkout.Fields.BillingInfo.$btnsave_credit_card.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					toggle_self: false,
					pre_logic: function () {
						if (Checkout.Fields.BillingInfo.$credit_card_form.attr("data-mode") == "new") {
							Checkout.Functions.BillingInfo.CreateNewCreditCardElement();
						}
					},
					delay: Checkout.Settings.Shared.easing - 200,
					post_toggle: function () {
						if (Checkout.Fields.BillingInfo.$payment_option_credit_card.is(":checked")) {
							Checkout.Fields.BillingInfo.$credit_card_list.find("input[type=radio]:checked").parent().animatedScroll();
						}
						else {
							Checkout.Fields.BillingInfo.$default_payment.animatedScroll();
						}
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					toggle_self: false,
					callback: function () {
						Checkout.Functions.BillingInfo.ResetCreditCardForm();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				});
			},
			"BindEvents_CancelCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btncancel_credit_card = $(Checkout.Fields.BillingInfo.$btncancel_credit_card.selector);
				}

				Checkout.Fields.BillingInfo.$btncancel_credit_card.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					force_state: "show",
					toggle_self: false,
					delay: Checkout.Settings.Shared.easing - 200,
					post_toggle: function () {
						if (Checkout.Fields.BillingInfo.$payment_option_credit_card.is(":checked")) {
							Checkout.Fields.BillingInfo.$credit_card_list.find("input[type=radio]:checked").parent().animatedScroll();
						}
						else {
							Checkout.Fields.BillingInfo.$default_payment.animatedScroll();
						}
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false,
					callback: function () {
						Checkout.Functions.BillingInfo.ResetCreditCardForm();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				});
			},
			"BindEvents_EditCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnedit_credit_card = $(Checkout.Fields.BillingInfo.$btnedit_credit_card.selector);
				}

				Checkout.Fields.BillingInfo.$btnedit_credit_card.on("click", function (e) {
					var $this = $(this);
					e.stopPropagation();
					$this.parent().parent().find("input[type=radio]").trigger("click");
					Checkout.Fields.BillingInfo.$btncreate_credit_card.slideUp(Checkout.Settings.Shared.easing - 200);
					Checkout.Functions.BillingInfo.ToggleCreditCardFormMode("edit");
					Checkout.Functions.BillingInfo.PopulateEditCardForm($this);
					// Display the credit card form
					Checkout.Fields.BillingInfo.$btnchange_billing_address.show();
					Checkout.Fields.BillingInfo.$credit_card_form.slideDown(Checkout.Settings.Shared.easing, function () {
						Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					});
				});
			},
			"BindEvents_EditDefaultCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnedit_default_credit_card = $(Checkout.Fields.BillingInfo.$btnedit_default_credit_card.selector);
				}

				Checkout.Fields.BillingInfo.$btnedit_default_credit_card.on("click", function (e) {
					var $this = $(this);
					e.stopPropagation();
					$this.parent().parent().find("input[type=radio]").trigger("click");
					Checkout.Fields.BillingInfo.$btncreate_credit_card.slideUp(Checkout.Settings.Shared.easing - 200);
					Checkout.Functions.BillingInfo.ToggleCreditCardFormMode("edit");
					Checkout.Functions.BillingInfo.PopulateEditCardForm($this);
					// Display the credit card form
					Checkout.Fields.BillingInfo.$btnchange_payment_option.hide();
					Checkout.Fields.BillingInfo.$btnchange_billing_address.show();
					Checkout.Fields.BillingInfo.$payment_wrapper.show();
					if ($this.parents(".default-payment").length > 0) {
						Checkout.Fields.BillingInfo.$payment_option_default.trigger("click");
					}
					Checkout.Fields.BillingInfo.$btnchange_billing_address.show();
					Checkout.Fields.BillingInfo.$credit_card_form.slideDown(Checkout.Settings.Shared.easing, function () {
						Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					});
				});
			},
			"BindEvents_CreditCardItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$credit_cards = $(Checkout.Fields.BillingInfo.$credit_cards.selector);
				}
				Checkout.Fields.BillingInfo.$credit_cards.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					force_state: "show",
					toggle_self: false,
					delay: Checkout.Settings.Shared.easing - 200
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false,
					callback: function () {
						Checkout.Functions.BillingInfo.ResetCreditCardForm();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				});
			},
			"BindEvents_ChangeBillingAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnchange_billing_address = $(Checkout.Fields.BillingInfo.$btnchange_billing_address.selector);
				}
				Checkout.Fields.BillingInfo.$btnchange_billing_address.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					pre_logic: function () {
						Checkout.Fields.BillingInfo.$billing_address_items.removeAttr("checked");
						Checkout.Fields.BillingInfo.$btnadd_billing_address.show();
						Checkout.Fields.BillingInfo.$billing_address_form.hide();
					},
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing,
					force_state: "show",
					callback: function () {
						Checkout.Fields.BillingInfo.$billing_address_container.animatedScroll();
					}
				});
			},
			"BindEvents_BillingAddressItem": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$billing_address_items = $(Checkout.Fields.BillingInfo.$billing_address_items.selector);
				}
				Checkout.Fields.BillingInfo.$billing_address_items.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btnchange_billing_address,
					pre_logic: function (self) {
						var selected = $(self).parent().find(".address").clone();
						selected.find(".name").remove();
						selected.find(".company").remove();
						selected.find(".country").remove();
						selected.find(".phone").remove();
						Checkout.Fields.BillingInfo.$card_billing_address_container.html("Billing Address:" + selected.html());
					},
					toggle_self: false,
					force_state: "show",
					callback: function () {
						Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					toggle_self: false,
					force_state: "hide"
				});
			},
			"BindEvents_CreditCardForm": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$credit_card_form = $(Checkout.Fields.BillingInfo.$credit_card_form.selector);
				}
				Checkout.Fields.BillingInfo.$credit_card_form.on("submit", function (e) {
					e.preventDefault();
					// DO STUFF
				});
			},
			"BindEvents_AddBillingAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnadd_billing_address = $(Checkout.Fields.BillingInfo.$btnadd_billing_address.selector);
				}
				Checkout.Fields.BillingInfo.$btnadd_billing_address.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_form,
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing,
					pre_logic: function () {
						Checkout.Fields.BillingInfo.$secondary_fields.hide();
						Checkout.Functions.BillingInfo.ResetAddressForm();
						Checkout.Functions.BillingInfo.ToggleAddressFormMode("new");
					},
					post_toggle: function () {
						Checkout.Fields.BillingInfo.$billing_address_form.animatedScroll();
					}
				});
			},
			"BindEvents_BillingCountrySelect": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$input_country = $(Checkout.Fields.BillingInfo.$input_country.selector);
				}
				Checkout.Fields.BillingInfo.$input_country.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$secondary_fields,
					firing_events: "change",
					force_state: "show",
					toggle_self: false
				});
			},
			"BindEvents_CancelAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btncancel_address = $(Checkout.Fields.BillingInfo.$btncancel_address.selector);
				}
				Checkout.Fields.BillingInfo.$btncancel_address.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btnadd_billing_address,
					toggle_self: false,
					delay: Checkout.Settings.Shared.easing - 200,
					post_toggle: function () {
						// Scroll to the billing address container
						Checkout.Fields.BillingInfo.$billing_address_container.animatedScroll();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_form,
					toggle_self: false,
					pre_logic: function () {
						// Scroll to the progress bar
						Checkout.Fields.BillingInfo.$billing_address_items.animatedScroll();
					},
					callback: function () {
						Checkout.Functions.BillingInfo.ResetAddressForm();
					}
				});
			},
			"BindEvents_SaveAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnsave_address = $(Checkout.Fields.BillingInfo.$btnsave_address.selector);
				}
				Checkout.Fields.BillingInfo.$btnsave_address.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btnadd_billing_address,
					delay: Checkout.Settings.Shared.easing - 200,
					toggle_self: false,
					pre_logic: function () {
						Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btnchange_billing_address,
					delay: Checkout.Settings.Shared.easing - 200,
					force_state: "show",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_form,
					toggle_self: false,
					force_state: "hide",
					pre_logic: function () {
						if (Checkout.Fields.BillingInfo.$billing_address_form.attr("data-mode") == "new") {
							Checkout.Functions.BillingInfo.CreateNewAddressElement();
						}
					},
					callback: function (element, event) {
						Checkout.Functions.BillingInfo.ResetAddressForm();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					toggle_self: false,
					force_state: "hide"
				});
			},
			"BindEvents_EditAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnedit_address = $(Checkout.Fields.BillingInfo.$btnedit_address.selector);
				}

				Checkout.Fields.BillingInfo.$btnedit_address.on("click", function (e) {
					var $this = $(this);
					e.stopPropagation();
					$this.parent().parent().find("input[type=radio]").trigger("click");
					// Set the input values
					Checkout.Functions.BillingInfo.ToggleAddressFormMode("edit");
					Checkout.Fields.BillingInfo.$input_country.val("CA");
					Checkout.Fields.BillingInfo.$input_name.val("Editing Name");
					Checkout.Fields.BillingInfo.$input_company.val("Editing Company");
					Checkout.Fields.BillingInfo.$input_street.val("Editing Street Address");
					Checkout.Fields.BillingInfo.$input_city.val("Editing City");
					Checkout.Fields.BillingInfo.$input_state.val("Editing State");
					Checkout.Fields.BillingInfo.$input_postal.val("Editing Postal Code");
					Checkout.Fields.BillingInfo.$input_phone.val("Editing Phone");
					Checkout.Fields.BillingInfo.$address_inputs.trigger("change");
					Checkout.Fields.BillingInfo.$secondary_fields.css("display", "");

					Checkout.Fields.BillingInfo.$btnadd_billing_address.slideUp(Checkout.Settings.Shared.easing - 200);
					Checkout.Fields.BillingInfo.$billing_address_form.slideDown(Checkout.Settings.Shared.easing, function () {
						Checkout.Fields.BillingInfo.$billing_address_form.animatedScroll();
					});
					return false;
				});
			},
			"BindEvents_BillingAddressForm": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$billing_address_form = $(Checkout.Fields.BillingInfo.$billing_address_form.selector);
				}
				Checkout.Fields.BillingInfo.$billing_address_form.on("submit", function (e) {
					e.preventDefault();
					// DO STUFF
				});
			},
			"BindEvents_PromoCodeForm": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$promo_code_form = $(Checkout.Fields.BillingInfo.$promo_code_form.selector);
				}
				Checkout.Fields.BillingInfo.$promo_code_form.on("submit", function (e) {
					e.preventDefault();
					// DO STUFF
				});
			},
			"ToggleCreditCardFormMode": function (mode) {
				// Set the mode on the form
				Checkout.Fields.BillingInfo.$credit_card_form.attr("data-mode", mode);
				if (mode == "edit") {
					// Set form title text
					Checkout.Fields.BillingInfo.$credit_card_form_title.text(Checkout.Fields.BillingInfo.$credit_card_form_title.attr("data-edit-text"));
					// Set button text
					Checkout.Fields.BillingInfo.$btnsave_credit_card.text(Checkout.Fields.BillingInfo.$btnsave_credit_card.attr("data-edit-text"));
					// Hide fields that should not be displayed
					Checkout.Fields.BillingInfo.$input_cc_number.hide();
					Checkout.Fields.BillingInfo.$input_cc_number.next().hide();
					Checkout.Fields.BillingInfo.$input_cc_store_in_wallet.parent().hide();
					// Display the fields that only appear in the edit form
					Checkout.Fields.BillingInfo.$edited_card_type.show();
					Checkout.Fields.BillingInfo.$edited_card_masked_number.show();
				}
				else {
					// Set form title text
					Checkout.Fields.BillingInfo.$credit_card_form_title.text(Checkout.Fields.BillingInfo.$credit_card_form_title.attr("data-new-text"));
					// Set button text
					Checkout.Fields.BillingInfo.$btnsave_credit_card.text(Checkout.Fields.BillingInfo.$btnsave_credit_card.attr("data-new-text"));
					// Hide fields that should not be displayed
					Checkout.Fields.BillingInfo.$edited_card_type.hide();
					Checkout.Fields.BillingInfo.$edited_card_masked_number.hide();
					// Display the fields that only appear in the new form
					Checkout.Fields.BillingInfo.$input_cc_number.show();
					Checkout.Fields.BillingInfo.$input_cc_number.next().show();
					Checkout.Fields.BillingInfo.$input_cc_store_in_wallet.parent().show();
				}
			},
			"ToggleAddressFormMode": function (mode) {
				// Set the mode on the form
				Checkout.Fields.BillingInfo.$billing_address_form.attr("data-mode", mode);
				if (mode == "edit") {
					// Set form title text
					Checkout.Fields.BillingInfo.$billing_address_form_title.text(Checkout.Fields.BillingInfo.$billing_address_form_title.attr("data-edit-text"));
				}
				else {
					Checkout.Fields.BillingInfo.$billing_address_form_title.text(Checkout.Fields.BillingInfo.$billing_address_form_title.attr("data-new-text"));
				}
			},
			"PopulateEditCardForm": function ($editedCard) {
				Checkout.Fields.BillingInfo.$edited_card_masked_number.html("ending in: 1234");
				Checkout.Fields.BillingInfo.$edited_card_type.addClass("visa").html("Visa");
				Checkout.Fields.BillingInfo.$input_cc_name.val("Editing Name");
				Checkout.Fields.BillingInfo.$input_cc_expiration.val("01/15");
				Checkout.Fields.BillingInfo.$credit_card_inputs.trigger("change");
			},
			"ResetCreditCardForm": function () {
				Checkout.Fields.BillingInfo.$edited_card_masked_number.html("");
				Checkout.Fields.BillingInfo.$edited_card_type.removeClass("visa mastercard amex discover").html("");
				Checkout.Fields.BillingInfo.$input_cc_name.val("");
				Checkout.Fields.BillingInfo.$input_cc_number.val("");
				Checkout.Fields.BillingInfo.$input_cc_expiration.val("");
				Checkout.Fields.BillingInfo.$input_cc_store_in_wallet.removeAttr("checked");
				Checkout.Fields.BillingInfo.$btnchange_billing_address.show();
				Checkout.Fields.BillingInfo.$credit_card_inputs.trigger("change");
			},
			"ResetAddressForm": function () {
				Checkout.Fields.BillingInfo.$input_country.val("");
				Checkout.Fields.BillingInfo.$input_name.val("");
				Checkout.Fields.BillingInfo.$input_company.val("");
				Checkout.Fields.BillingInfo.$input_street.val("");
				Checkout.Fields.BillingInfo.$input_city.val("");
				Checkout.Fields.BillingInfo.$input_state.val("");
				Checkout.Fields.BillingInfo.$input_postal.val("");
				Checkout.Fields.BillingInfo.$input_phone.val("");
				Checkout.Fields.BillingInfo.$secondary_fields.css("display", "none");
				Checkout.Fields.BillingInfo.$billing_address_form.find("label").removeClass("notempty");
			},
			"CreateNewCreditCardElement": function () {
				var $newCard,
					mu = '<li class="default grid__item one-whole desk-one-half credit-card-item">';
				mu += '<input type="radio" name="select-credit-card" id="card6" value="card6">';
				mu += '<label for="card6" class="card incomplete">';
				mu += '<span class="btn paywiththis secondary small"></span>';
				mu += '<button class="btn edit-credit-card tertiary small">Edit</button>';
				mu += '<div class="credit-card">';
				mu += '<span class="type visa">Visa</span>';
				mu += '<span class="masked-number">ending in: ' + Checkout.Fields.BillingInfo.$input_cc_number.val().substring(Checkout.Fields.BillingInfo.$input_cc_number.val().length - 4) + '</span>';
				mu += '<span class="expiration">Expires: ' + Checkout.Fields.BillingInfo.$input_cc_expiration.val() + '</span>';
				mu += '</div><div class="address">Billing Address:';
				mu += '<span class="street"></span>';
				mu += '<span class="city"></span>';
				mu += '<span class="state"></span>';
				mu += '<span class="zip"></span>';
				mu += '</div></label></li>';
				$newCard = $(mu);
				Checkout.Fields.BillingInfo.$credit_card_list.find("li:last-child").before($newCard);
				Checkout.Functions.BillingInfo.BindEvents_EditCreditCardButton(true);
				$newCard.find("input[type=radio]").trigger("click");
			},
			"CreateNewAddressElement": function () {
				var $newAddress,
					mu = '<li class="additional-address grid__item one-whole desk-one-half address-item">';
				mu += '<input type="radio" name="select-address" id="billing-address9" value="billing-address9">';
				mu += '<label for="billing-address9" class="card">';
				mu += '<span class="btn billtothis secondary small"></span>';
				mu += '<button class="btn edit tertiary small">Edit</button>';
				mu += '<div class="address">';
				mu += '<span class="name">' + Checkout.Fields.BillingInfo.$input_name.val() + '</span>';
				mu += '<span class="company">' + Checkout.Fields.BillingInfo.$input_company.val() + '</span>';
				mu += '<span class="street">' + Checkout.Fields.BillingInfo.$input_street.val() + '</span>,';
				mu += '<span class="city">' + Checkout.Fields.BillingInfo.$input_city.val() + '</span>';
				mu += '<span class="state">' + Checkout.Fields.BillingInfo.$input_state.val() + '</span>';
				mu += '<span class="zip">' + Checkout.Fields.BillingInfo.$input_postal.val() + '</span>';
				mu += '<span class="country">' + Checkout.Fields.BillingInfo.$input_country.val() + '</span>';
				mu += '<span class="phone">' + Checkout.Fields.BillingInfo.$input_phone.val() + '</span>';
				mu += '</div></label></li>';
				$newAddress = $(mu);
				Checkout.Fields.BillingInfo.$billing_address_list.find("li:last-child").before($newAddress);
				Checkout.Functions.BillingInfo.BindEvents_EditAddressButton(true);
				$newAddress.find("input[type=radio]").trigger("click");
			}
		}
	}
}
