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
			this.on(settings.firing_events, function () {
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

	//add show/hide custom event triggers
	//$.each(['show', 'hide'], function (i, ev) {
	//	var el = $.fn[ev];
	//	$.fn[ev] = function () {
	//		this.trigger(ev);
	//		return el.apply(this, arguments);
	//	};
	//});
}(jQuery));

//#endregion PLUGINS

var hd_checkout = {
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
		},
		"ShippingAddress": {
			"$shipping_address_instructions": undefined,
			"$btnchangeaddress": undefined,
			"$btnadd_address": undefined,
			"$address_wrapper": undefined,
			"$address_list": undefined,
			"$default_address": undefined,
			"$additional_addresses": undefined,
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
			"$secondary_fields": undefined
		},
		"ShippingMethod": {
			"$loading_panel": undefined,
			"$shipping_option_list": undefined
		},
		"BillingInfo": {
			"$default_payment_container": undefined,
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
			"$input_cc_name": undefined,
			"$input_cc_number": undefined,
			"$input_cc_expiration": undefined,
			"$input_cc_security_code": undefined,
			"$input_cc_store_in_wallet": undefined,
			"$edited_card_masked_number": undefined,
			"$edited_card_type": undefined,
			"$change_billing_address_container": undefined,
			"$btnchange_billing_address": undefined,
			"$billing_address_container": undefined
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
				hd_checkout.Settings.Shared.steps = [hd_checkout.Settings.Shared.shipping_address_step_id, hd_checkout.Settings.Shared.shipping_option_step_id, hd_checkout.Settings.Shared.billing_step_id, hd_checkout.Settings.Shared.review_step_id, hd_checkout.Settings.Shared.confirmation_step_id]
				$(window).bind('hashchange', function (e) {
					var step = e.fragment.replace(hd_checkout.Settings.Shared.step_url_prefix, ""),
						previousStep = e.originalEvent !== undefined ? jQuery.param.fragment(e.originalEvent.oldURL).replace(hd_checkout.Settings.Shared.step_url_prefix, "") : undefined,
						stepNumber = jQuery.inArray(step, hd_checkout.Settings.Shared.steps);

					// Check if the hash is a step
					if (stepNumber > -1) {
						hd_checkout.Fields.Shared.$step_previous = previousStep !== undefined ? $("#" + previousStep) : undefined;
						hd_checkout.Fields.Shared.$step_current = $("#" + step);
						hd_checkout.Functions.Shared.InitCurrentStep(step);
					}
				});
				$(document).ready(function () {
					hd_checkout.Functions.Shared.SetGlobalVariables();
					hd_checkout.Functions.Shared.WireEvents();
					jQuery.bbq.pushState("#" + hd_checkout.Settings.Shared.step_url_prefix + hd_checkout.Fields.Shared.$step_current.attr("id"), 2);
					$(window).trigger('hashchange');
				});
			},
			"SetGlobalVariables": function () {
				/// <summary>Gets DOM elements & other dynamic variable values.</summary>
				hd_checkout.Fields.Shared.$cta_bar = $(".cta_bar");
				hd_checkout.Fields.Shared.$btn_next = hd_checkout.Fields.Shared.$cta_bar.find("button");
				hd_checkout.Fields.Shared.$need_help = $(".need-help");
				hd_checkout.Fields.Shared.$help_content = $("#help-content");
				hd_checkout.Fields.Shared.$progress_bar = $("#progress-bar");
				hd_checkout.Fields.Shared.$progress_bar_items = hd_checkout.Fields.Shared.$progress_bar.find("a");
				hd_checkout.Fields.Shared.$step_shipping_address = $("#" + hd_checkout.Settings.Shared.shipping_address_step_id);
				hd_checkout.Fields.Shared.$step_shipping_option = $("#" + hd_checkout.Settings.Shared.shipping_option_step_id);
				hd_checkout.Fields.Shared.$step_billing = $("#" + hd_checkout.Settings.Shared.billing_step_id);
				hd_checkout.Fields.Shared.$step_review = $("#" + hd_checkout.Settings.Shared.billing_step_id);
				hd_checkout.Fields.Shared.$step_confirmation = $("#" + hd_checkout.Settings.Shared.confirmation_step_id);
				hd_checkout.Fields.Shared.$step_current = hd_checkout.Fields.Shared.$step_shipping_address;
				hd_checkout.Fields.Shared.$step_next = hd_checkout.Fields.Shared.$step_shipping_option;
				hd_checkout.Fields.Shared.$step_previous = hd_checkout.Fields.Shared.$step_current.prev();
				hd_checkout.Fields.Shared.$form_inputs = $("input[type=text], textarea, #country-input");
				hd_checkout.Fields.ShippingAddress.$shipping_address_instructions = hd_checkout.Fields.Shared.$step_shipping_address.find(".instructions");
				hd_checkout.Fields.ShippingAddress.$btnchangeaddress = hd_checkout.Fields.Shared.$step_shipping_address.find("button.changeaddress");
				hd_checkout.Fields.ShippingAddress.$btnadd_address = hd_checkout.Fields.Shared.$step_shipping_address.find("button.createaddress");
				hd_checkout.Fields.ShippingAddress.$address_wrapper = hd_checkout.Fields.Shared.$step_shipping_address.find(".address-wrapper");
				hd_checkout.Fields.ShippingAddress.$address_list = hd_checkout.Fields.ShippingAddress.$address_wrapper.find(".address-list");
				hd_checkout.Fields.ShippingAddress.$default_address = hd_checkout.Fields.ShippingAddress.$address_list.find(".default");
				hd_checkout.Fields.ShippingAddress.$additional_addresses = hd_checkout.Fields.ShippingAddress.$address_list.find(".additional-address");
				hd_checkout.Fields.ShippingAddress.$new_address_form = hd_checkout.Fields.Shared.$step_shipping_address.find("#new-address-form");
				hd_checkout.Fields.ShippingAddress.$btnedit_address = hd_checkout.Fields.Shared.$step_shipping_address.find(".address-item button");
				hd_checkout.Fields.ShippingAddress.$btncancel_address = hd_checkout.Fields.Shared.$step_shipping_address.find(".add-edit-address button.cancel");
				hd_checkout.Fields.ShippingAddress.$btnsave_address = hd_checkout.Fields.Shared.$step_shipping_address.find(".add-edit-address button.save");
				hd_checkout.Fields.ShippingAddress.$input_country = hd_checkout.Fields.Shared.$step_shipping_address.find("#country-input");
				hd_checkout.Fields.ShippingAddress.$input_name = hd_checkout.Fields.Shared.$step_shipping_address.find("#name-input");
				hd_checkout.Fields.ShippingAddress.$input_company = hd_checkout.Fields.Shared.$step_shipping_address.find("#company-input");
				hd_checkout.Fields.ShippingAddress.$input_street = hd_checkout.Fields.Shared.$step_shipping_address.find("#address-input");
				hd_checkout.Fields.ShippingAddress.$input_city = hd_checkout.Fields.Shared.$step_shipping_address.find("#city-input");
				hd_checkout.Fields.ShippingAddress.$input_state = hd_checkout.Fields.Shared.$step_shipping_address.find("#state-input");
				hd_checkout.Fields.ShippingAddress.$input_postal = hd_checkout.Fields.Shared.$step_shipping_address.find("#postal-code-input");
				hd_checkout.Fields.ShippingAddress.$input_phone = hd_checkout.Fields.Shared.$step_shipping_address.find("#phone-input");
				hd_checkout.Fields.ShippingAddress.$secondary_fields = hd_checkout.Fields.Shared.$step_shipping_address.find(".field__secondary");
				hd_checkout.Fields.ShippingMethod.$loading_panel = hd_checkout.Fields.Shared.$step_shipping_option.find(".loading-panel");
				hd_checkout.Fields.ShippingMethod.$shipping_option_wrapper = hd_checkout.Fields.Shared.$step_shipping_option.find(".shipping-option-wrapper");
				hd_checkout.Fields.BillingInfo.$btnchange_payment_option = hd_checkout.Fields.Shared.$step_billing.find("button.change-payment-option");
				hd_checkout.Fields.BillingInfo.$default_payment_container = hd_checkout.Fields.Shared.$step_billing.find("div.default-payment");
				hd_checkout.Fields.BillingInfo.$payment_wrapper = hd_checkout.Fields.Shared.$step_billing.find("div.payment-wrapper");
				hd_checkout.Fields.BillingInfo.$payment_option_list = hd_checkout.Fields.BillingInfo.$payment_wrapper.find(".payment-option-list");
				hd_checkout.Fields.BillingInfo.$payment_option_credit_card = hd_checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-credit-card");
				hd_checkout.Fields.BillingInfo.$payment_option_paypal = hd_checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-paypal");
				hd_checkout.Fields.BillingInfo.$payment_option_default = hd_checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-default");
				hd_checkout.Fields.BillingInfo.$credit_card_wrapper = hd_checkout.Fields.Shared.$step_billing.find(".credit-card-wrapper");
				hd_checkout.Fields.BillingInfo.$credit_card_list = hd_checkout.Fields.BillingInfo.$credit_card_wrapper.find(".credit-card-list");
				hd_checkout.Fields.BillingInfo.$credit_cards = hd_checkout.Fields.BillingInfo.$credit_card_list.find(".credit-card-item input[type=radio]");
				hd_checkout.Fields.BillingInfo.$paypal_container = hd_checkout.Fields.Shared.$step_billing.find(".paypal-container");
				hd_checkout.Fields.BillingInfo.$btncreate_credit_card = hd_checkout.Fields.BillingInfo.$credit_card_wrapper.find(".create-credit-card");
				hd_checkout.Fields.BillingInfo.$credit_card_form = hd_checkout.Fields.BillingInfo.$credit_card_wrapper.find("#credit-card-form");
				hd_checkout.Fields.BillingInfo.$credit_card_form_title = hd_checkout.Fields.BillingInfo.$credit_card_form.find("h2");
				hd_checkout.Fields.BillingInfo.$btnsave_credit_card = hd_checkout.Fields.BillingInfo.$credit_card_form.find("button.save");
				hd_checkout.Fields.BillingInfo.$btncancel_credit_card = hd_checkout.Fields.BillingInfo.$credit_card_form.find("button.cancel");
				hd_checkout.Fields.BillingInfo.$btnedit_credit_card = hd_checkout.Fields.BillingInfo.$credit_card_list.find("button.edit");
				hd_checkout.Fields.BillingInfo.$input_cc_expiration = hd_checkout.Fields.BillingInfo.$credit_card_form.find("#cc-expiration-input");
				hd_checkout.Fields.BillingInfo.$input_cc_name = hd_checkout.Fields.BillingInfo.$credit_card_form.find("#cc-name-input");
				hd_checkout.Fields.BillingInfo.$input_cc_number = hd_checkout.Fields.BillingInfo.$credit_card_form.find("#cc-number-input");
				hd_checkout.Fields.BillingInfo.$input_cc_security_code = hd_checkout.Fields.BillingInfo.$credit_card_form.find("#cc-security-code-input");
				hd_checkout.Fields.BillingInfo.$input_cc_store_in_wallet = hd_checkout.Fields.BillingInfo.$credit_card_form.find("#cc-wallet-input");
				hd_checkout.Fields.BillingInfo.$edited_card_masked_number = hd_checkout.Fields.BillingInfo.$credit_card_form.find(".cc-number-masked");
				hd_checkout.Fields.BillingInfo.$edited_card_type = hd_checkout.Fields.BillingInfo.$credit_card_form.find("span.type");
				hd_checkout.Fields.BillingInfo.$btnchange_billing_address = hd_checkout.Fields.BillingInfo.$credit_card_wrapper.find("button.change-billing-address");
				hd_checkout.Fields.BillingInfo.$change_billing_address_container = hd_checkout.Fields.BillingInfo.$btnchange_billing_address.parent();
				hd_checkout.Fields.BillingInfo.$billing_address_container = hd_checkout.Fields.Shared.$step_billing.find(".billing-address-container");
			},
			"WireEvents": function () {
				/// <summary>Wire up control events</summary>
				hd_checkout.Functions.Shared.BindEvents_NeedHelp(false);
				hd_checkout.Functions.Shared.BindEvents_NextButton(false);
				hd_checkout.Functions.Shared.BindEvents_FormInputs(false);
				hd_checkout.Functions.Shared.BindEvents_ProgressBarItems(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_AdditionalAddressButton(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_AddAddressButton(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_CancelAddressButton(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_SaveAddressButton(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_AddressForm(false);
				hd_checkout.Functions.ShippingAddress.BindEvents_CountrySelect(false);
				hd_checkout.Functions.BillingInfo.BindEvents_ChangePaymentOptionButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_CreditCardOptionButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_PayPalOptionButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_DefaultOptionButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_CreateCreditCardButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_CreditCardForm(false);
				hd_checkout.Functions.BillingInfo.BindEvents_SaveCreditCardButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_CancelCreditCardButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_EditCreditCardButton(false);
				hd_checkout.Functions.BillingInfo.BindEvents_CreditCardItems(false);
				hd_checkout.Functions.BillingInfo.BindEvents_ChangeBillingAddressButton(false);
			},
			"InitCurrentStep": function (step_name) {
				var $currentProgressBarItem = $("a[href=#" + hd_checkout.Settings.Shared.step_url_prefix + hd_checkout.Fields.Shared.$step_current.attr("id") + "]").parent();
				hd_checkout.Functions.Shared.SetActiveProgressBarItem($currentProgressBarItem);
				if (hd_checkout.Fields.Shared.$step_previous !== undefined) {
					hd_checkout.Fields.Shared.$progress_bar.animatedScroll();
					hd_checkout.Fields.Shared.$step_previous.slideUp(hd_checkout.Settings.Shared.easing - 200, function () {
						hd_checkout.Functions.Shared.RestoreStepDefaultView(hd_checkout.Fields.Shared.$step_previous.attr("id"));
						hd_checkout.Fields.Shared.$step_current.slideDown(hd_checkout.Settings.Shared.easing);
					});
				}
				else {
					hd_checkout.Fields.Shared.$step_current.slideDown(hd_checkout.Settings.Shared.easing);
				}
				switch (step_name) {
					case hd_checkout.Settings.Shared.shipping_address_step_id:
						break;
					case hd_checkout.Settings.Shared.shipping_option_step_id:
						hd_checkout.Settings.ShippingMethod.loading_panel_timeout = setTimeout(function () {
							hd_checkout.Fields.ShippingMethod.$loading_panel.fadeOut(hd_checkout.Settings.Shared.easing - 200, function () {
								hd_checkout.Fields.ShippingMethod.$shipping_option_wrapper.slideDown(hd_checkout.Settings.Shared.easing, function () {
									hd_checkout.Fields.Shared.$step_shipping_option.animatedScroll();
								});
							});
						}, 3000);
						break;
					case hd_checkout.Settings.Shared.billing_step_id:
						break;
					case hd_checkout.Settings.Shared.review_step_id:
						break;
					case hd_checkout.Settings.Shared.confirmation_step_id:
						break;
				}
			},
			"SetActiveProgressBarItem": function ($activeItem) {
				$activeItem.addClass(hd_checkout.Settings.Shared.active_class).siblings().removeClass(hd_checkout.Settings.Shared.active_class);
			},
			"RestoreStepDefaultView": function (step_name) {
				/// <summary>Restores the UI to the default view so that the next time the user visits the step the interaction works correctly.</summary>
				switch (step_name) {
					case hd_checkout.Settings.Shared.shipping_address_step_id:
						break;
					case hd_checkout.Settings.Shared.shipping_option_step_id:
						hd_checkout.Fields.ShippingMethod.$loading_panel.show();
						hd_checkout.Fields.ShippingMethod.$shipping_option_wrapper.hide();
						clearTimeout(hd_checkout.Settings.ShippingMethod.loading_panel_timeout);
						break;
					case hd_checkout.Settings.Shared.billing_step_id:
						break;
					case hd_checkout.Settings.Shared.review_step_id:
						break;
					case hd_checkout.Settings.Shared.confirmation_step_id:
						break;
				}
			},
			"BindEvents_FormInputs": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.Shared.$form_inputs = $(hd_checkout.Fields.Shared.$form_inputs.selector);
				}
				hd_checkout.Fields.Shared.$form_inputs.on("change", function () {
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
					hd_checkout.Fields.Shared.$need_help = $(hd_checkout.Fields.Shared.$need_help.selector);
				}
				hd_checkout.Fields.Shared.$need_help.on("click", function () {
					hd_checkout.Fields.Shared.$help_content.animatedScroll();
				});
			},
			"BindEvents_NextButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.Shared.$btn_next = $(hd_checkout.Fields.Shared.$btn_next.selector);
				}

				hd_checkout.Fields.Shared.$btn_next.on("click", function () {
					jQuery.bbq.pushState("#" + hd_checkout.Settings.Shared.step_url_prefix + hd_checkout.Fields.Shared.$step_current.next().attr("id"), 2);
				});
			},
			"BindEvents_ProgressBarItems": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.Shared.$progress_bar_items = $(hd_checkout.Fields.Shared.$progress_bar_items.selector);
				}

				hd_checkout.Fields.Shared.$progress_bar_items.on("click", function () {
					var $parent = $(this).parent();
					hd_checkout.Functions.Shared.SetActiveProgressBarItem($parent);
				});
			}
		},
		"ShippingAddress": {
			"BindEvents_AdditionalAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$btnchangeaddress = $("'" + hd_checkout.Fields.ShippingAddress.$btnchangeaddress.selector + "'");
				}
				hd_checkout.Fields.ShippingAddress.$btnchangeaddress.toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$additional_addresses,
					self_toggle_delay_offset: -hd_checkout.Settings.Shared.easing
				}).toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$btnadd_address,
					toggle_self: false
				});
			},
			"BindEvents_AddAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$btnadd_address = $(hd_checkout.Fields.ShippingAddress.$btnadd_address.selector);
				}
				hd_checkout.Fields.ShippingAddress.$btnadd_address.toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$new_address_form,
					self_toggle_delay_offset: -hd_checkout.Settings.Shared.easing,
					post_toggle: function () {
						hd_checkout.Fields.ShippingAddress.$new_address_form.animatedScroll();
					}
				});
			},
			"BindEvents_EditAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$btnedit_address = $(hd_checkout.Fields.ShippingAddress.$btnedit_address.selector);
				}
				hd_checkout.Fields.ShippingAddress.$btnedit_address.on("click", function () {
					// Select the address being edited
					$(this).parent().trigger("click");
					// Hide the new address button
					if (hd_checkout.Fields.ShippingAddress.$btnadd_address.is(":visible")) {
						hd_checkout.Fields.ShippingAddress.$btnadd_address.slideUp(hd_checkout.Settings.Shared.easing - 200);
					}
					// Set the input values
					hd_checkout.Fields.ShippingAddress.$input_country.val("CA");
					hd_checkout.Fields.ShippingAddress.$input_name.val("Editing Name");
					hd_checkout.Fields.ShippingAddress.$input_company.val("Editing Company");
					hd_checkout.Fields.ShippingAddress.$input_street.val("Editing Street Address");
					hd_checkout.Fields.ShippingAddress.$input_city.val("Editing City");
					hd_checkout.Fields.ShippingAddress.$input_state.val("Editing State");
					hd_checkout.Fields.ShippingAddress.$input_postal.val("Editing Postal Code");
					hd_checkout.Fields.ShippingAddress.$input_phone.val("Editing Phone");
					hd_checkout.Fields.Shared.$form_inputs.trigger("change");
					hd_checkout.Fields.ShippingAddress.$secondary_fields.css("display", "");
					// Display the address form
					hd_checkout.Fields.ShippingAddress.$new_address_form.slideDown(hd_checkout.Settings.Shared.easing, function () {
						hd_checkout.Fields.ShippingAddress.$new_address_form.animatedScroll();
					});
				});
			},
			"BindEvents_CancelAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$btncancel_address = $(hd_checkout.Fields.ShippingAddress.$btncancel_address.selector);
				}
				hd_checkout.Fields.ShippingAddress.$btncancel_address.on("click", function () {
					if (hd_checkout.Fields.ShippingAddress.$additional_addresses.is(":visible")) {
						hd_checkout.Fields.ShippingAddress.$btnadd_address.slideDown(hd_checkout.Settings.Shared.easing - 200);
					}
				}).toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$new_address_form,
					toggle_self: false,
					pre_logic: function () {
						// Scroll to the progress bar
						hd_checkout.Fields.Shared.$progress_bar.animatedScroll();
					},
					callback: function () {
						hd_checkout.Fields.ShippingAddress.$input_country.val("");
						hd_checkout.Fields.ShippingAddress.$input_name.val("");
						hd_checkout.Fields.ShippingAddress.$input_company.val("");
						hd_checkout.Fields.ShippingAddress.$input_street.val("");
						hd_checkout.Fields.ShippingAddress.$input_city.val("");
						hd_checkout.Fields.ShippingAddress.$input_state.val("");
						hd_checkout.Fields.ShippingAddress.$input_postal.val("");
						hd_checkout.Fields.ShippingAddress.$input_phone.val("");
						hd_checkout.Fields.ShippingAddress.$secondary_fields.css("display", "none");
						hd_checkout.Fields.Shared.$form_inputs.trigger("change");
					}
				});
			},
			"BindEvents_SaveAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$btnsave_address = $(hd_checkout.Fields.ShippingAddress.$btnsave_address.selector);
				}
				hd_checkout.Fields.ShippingAddress.$btnsave_address.toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$btnadd_address,
					delay: hd_checkout.Settings.Shared.easing - 200,
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$new_address_form,
					toggle_self: false,
					pre_logic: function () {
						var $newAddress,
							mu = '<li class="additional-address grid__item one-whole desk-one-half address-item">';
						mu += '<input type="radio" name="select-address" id="address4" value="address4">';
						mu += '<label for="address4" class="card">';
						mu += '<span class="btn shiptothis secondary small"></span>';
						mu += '<button class="btn edit tertiary small">Edit</button>';
						mu += '<div class="address">';
						mu += '<span class="name">' + hd_checkout.Fields.ShippingAddress.$input_name.val() + '</span>';
						mu += '<span class="company">' + hd_checkout.Fields.ShippingAddress.$input_company.val() + '</span>';
						mu += '<span class="street">' + hd_checkout.Fields.ShippingAddress.$input_street.val() + '</span>,';
						mu += '<span class="city">' + hd_checkout.Fields.ShippingAddress.$input_city.val() + '</span>';
						mu += '<span class="state">' + hd_checkout.Fields.ShippingAddress.$input_state.val() + '</span>';
						mu += '<span class="zip">' + hd_checkout.Fields.ShippingAddress.$input_postal.val() + '</span>';
						mu += '<span class="country">' + hd_checkout.Fields.ShippingAddress.$input_country.val() + '</span>';
						mu += '<span class="phone">' + hd_checkout.Fields.ShippingAddress.$input_phone.val() + '</span>';
						mu += '</div></label></li>';
						$newAddress = $(mu);
						hd_checkout.Fields.ShippingAddress.$address_list.append($newAddress);
						hd_checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(true);
						$newAddress.find("input[type=radio]").trigger("click");
					},
					callback: function (element, event) {
						hd_checkout.Fields.ShippingAddress.$input_country.val("");
						hd_checkout.Fields.ShippingAddress.$input_name.val("");
						hd_checkout.Fields.ShippingAddress.$input_company.val("");
						hd_checkout.Fields.ShippingAddress.$input_street.val("");
						hd_checkout.Fields.ShippingAddress.$input_city.val("");
						hd_checkout.Fields.ShippingAddress.$input_state.val("");
						hd_checkout.Fields.ShippingAddress.$input_postal.val("");
						hd_checkout.Fields.ShippingAddress.$input_phone.val("");
						hd_checkout.Fields.Shared.$form_inputs.trigger("change");
						// Scroll to the new address
						hd_checkout.Fields.ShippingAddress.$address_list.find("input[type=radio]:checked").parent().animatedScroll();
					}
				});
			},
			"BindEvents_AddressForm": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$new_address_form = $(hd_checkout.Fields.ShippingAddress.$new_address_form.selector);
				}
				hd_checkout.Fields.ShippingAddress.$new_address_form.on("submit", function (e) {
					e.preventDefault();
					// DO STUFF
				});
			},
			"BindEvents_CountrySelect": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.ShippingAddress.$input_country = $(hd_checkout.Fields.ShippingAddress.$input_country.selector);
				}
				hd_checkout.Fields.ShippingAddress.$input_country.toggleContainer({
					content_element: hd_checkout.Fields.ShippingAddress.$secondary_fields,
					firing_events: "change",
					force_state: "show",
					toggle_self: false
				})
			}
		},
		"ShippingOption": {

		},
		"BillingInfo": {
			"BindEvents_ChangePaymentOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$btnchange_payment_option = $("'" + hd_checkout.Fields.BillingInfo.$btnchange_payment_option.selector + "'");
				}
				hd_checkout.Fields.BillingInfo.$btnchange_payment_option.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$payment_wrapper,
					self_toggle_delay_offset: -hd_checkout.Settings.Shared.easing
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$default_payment_container,
					toggle_self: false
				});
			},
			"BindEvents_CreditCardOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$payment_option_credit_card = $("'" + hd_checkout.Fields.BillingInfo.$payment_option_credit_card.selector + "'");
				}
				hd_checkout.Fields.BillingInfo.$payment_option_credit_card.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$default_payment_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$paypal_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$btncreate_credit_card,
					force_state: "show",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_wrapper,
					force_state: "show",
					toggle_self: false
				});
			},
			"BindEvents_PayPalOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$payment_option_paypal = $("'" + hd_checkout.Fields.BillingInfo.$payment_option_paypal.selector + "'");
				}
				hd_checkout.Fields.BillingInfo.$payment_option_paypal.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$default_payment_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_wrapper,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$change_billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$paypal_container,
					force_state: "show",
					toggle_self: false
				});
			},
			"BindEvents_DefaultOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$payment_option_default = $("'" + hd_checkout.Fields.BillingInfo.$payment_option_default.selector + "'");
				}

				hd_checkout.Fields.BillingInfo.$payment_option_default.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_wrapper,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$change_billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$paypal_container,
					force_state: "hide",
					toggle_self: false
				});
			},
			"BindEvents_CreateCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$btncreate_credit_card = $("'" + hd_checkout.Fields.BillingInfo.$btncreate_credit_card.selector + "'");
				}

				hd_checkout.Fields.BillingInfo.$btncreate_credit_card.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_form,
					self_toggle_delay_offset: -hd_checkout.Settings.Shared.easing,
					pre_logic: function () {
						hd_checkout.Functions.BillingInfo.ResetCreditCardForm();
						hd_checkout.Functions.BillingInfo.ToggleCreditCardFormMode("new");
					},
					callback: function () {
						hd_checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					}
				});
			},
			"BindEvents_SaveCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$btnsave_credit_card = $("'" + hd_checkout.Fields.BillingInfo.$btnsave_credit_card.selector + "'");
				}

				hd_checkout.Fields.BillingInfo.$btnsave_credit_card.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$btncreate_credit_card,
					toggle_self: false,
					delay: hd_checkout.Settings.Shared.easing - 200
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_form,
					toggle_self: false,
					callback: function () {
						hd_checkout.Functions.BillingInfo.ResetCreditCardForm();
					}
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$change_billing_address_container,
					force_state: "hide",
					toggle_self: false
				});
			},
			"BindEvents_CancelCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$btncancel_credit_card = $("'" + hd_checkout.Fields.BillingInfo.$btncancel_credit_card.selector + "'");
				}

				hd_checkout.Fields.BillingInfo.$btncancel_credit_card.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$btncreate_credit_card,
					force_state: "show",
					toggle_self: false,
					delay: hd_checkout.Settings.Shared.easing - 200
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false,
					callback: function () {
						hd_checkout.Functions.BillingInfo.ResetCreditCardForm();
					}
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$billing_address_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$change_billing_address_container,
					force_state: "hide",
					toggle_self: false
				});
			},
			"BindEvents_EditCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$btnedit_credit_card = $("'" + hd_checkout.Fields.BillingInfo.$btnedit_credit_card.selector + "'");
				}

				hd_checkout.Fields.BillingInfo.$btnedit_credit_card.on("click", function () {
					$(this).parent().trigger("click");
					hd_checkout.Fields.BillingInfo.$btncreate_credit_card.slideUp(hd_checkout.Settings.Shared.easing - 200);
					
					hd_checkout.Functions.BillingInfo.ToggleCreditCardFormMode("edit");
					hd_checkout.Functions.BillingInfo.PopulateEditCardForm($(this));
					// Display the credit card form
					hd_checkout.Fields.BillingInfo.$btnchange_billing_address.show();
					hd_checkout.Fields.BillingInfo.$change_billing_address_container.show();
					hd_checkout.Fields.BillingInfo.$credit_card_form.slideDown(hd_checkout.Settings.Shared.easing, function () {
						hd_checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					});
				});
			},
			"BindEvents_CreditCardItems": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$credit_cards = $(hd_checkout.Fields.BillingInfo.$credit_cards.selector);
				}
				hd_checkout.Fields.BillingInfo.$credit_cards.on("click", function () {
					hd_checkout.Fields.BillingInfo.$btncancel_credit_card.trigger("click");
				});
			},
			"BindEvents_ChangeBillingAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$btnchange_billing_address = $(hd_checkout.Fields.BillingInfo.$btnchange_billing_address.selector);
				}
				hd_checkout.Fields.BillingInfo.$btnchange_billing_address.toggleContainer({
					content_element: hd_checkout.Fields.BillingInfo.$billing_address_container,
					self_toggle_delay_offset: -hd_checkout.Settings.Shared.easing,
					force_state: "show",
					callback: function () {
						hd_checkout.Fields.BillingInfo.$billing_address_container.animatedScroll();
					}
				})
			},
			"BindEvents_CreditCardForm": function (refreshSelector) {
				if (refreshSelector) {
					hd_checkout.Fields.BillingInfo.$credit_card_form = $(hd_checkout.Fields.BillingInfo.$credit_card_form.selector);
				}
				hd_checkout.Fields.BillingInfo.$credit_card_form.on("submit", function (e) {
					e.preventDefault();
					// DO STUFF
				});
			},
			"ToggleCreditCardFormMode": function (mode) {
				if (mode == "edit") {
					// Set form title text
					hd_checkout.Fields.BillingInfo.$credit_card_form_title.text(hd_checkout.Fields.BillingInfo.$credit_card_form_title.attr("data-edit-text"));
					// Hide fields that should not be displayed
					hd_checkout.Fields.BillingInfo.$input_cc_number.hide();
					hd_checkout.Fields.BillingInfo.$input_cc_number.next().hide();
					hd_checkout.Fields.BillingInfo.$input_cc_store_in_wallet.parent().hide();
					// Display the fields that only appear in the edit form
					hd_checkout.Fields.BillingInfo.$edited_card_type.show();
					hd_checkout.Fields.BillingInfo.$edited_card_masked_number.show();
				}
				else {
					// Set form title text
					hd_checkout.Fields.BillingInfo.$credit_card_form_title.text(hd_checkout.Fields.BillingInfo.$credit_card_form_title.attr("data-new-text"));
					// Hide fields that should not be displayed
					hd_checkout.Fields.BillingInfo.$edited_card_type.hide();
					hd_checkout.Fields.BillingInfo.$edited_card_masked_number.hide();
					// Display the fields that only appear in the new form
					hd_checkout.Fields.BillingInfo.$input_cc_number.show();
					hd_checkout.Fields.BillingInfo.$input_cc_number.next().show();
					hd_checkout.Fields.BillingInfo.$input_cc_store_in_wallet.parent().show();
				}
			},
			"PopulateEditCardForm": function ($editedCard) {
				hd_checkout.Fields.BillingInfo.$edited_card_masked_number.html("ending: 1234");
				hd_checkout.Fields.BillingInfo.$edited_card_type.addClass("visa").html("Visa");
				hd_checkout.Fields.BillingInfo.$input_cc_name.val("Editing Name");
				hd_checkout.Fields.BillingInfo.$input_cc_expiration.val("01/15");
				hd_checkout.Fields.Shared.$form_inputs.trigger("change");
			},
			"ResetCreditCardForm": function () {
				hd_checkout.Fields.BillingInfo.$edited_card_masked_number.html("");
				hd_checkout.Fields.BillingInfo.$edited_card_type.removeClass("visa mastercard amex discover").html("");
				hd_checkout.Fields.BillingInfo.$input_cc_name.val("");
				hd_checkout.Fields.BillingInfo.$input_cc_expiration.val("");
				hd_checkout.Fields.Shared.$form_inputs.trigger("change");
			}
		}
	}
}
