/// <reference path="jquery.ba-bbq.js"/>
/// <reference path="animatescroll.js" />
/// <reference path="modal.js" />

//#region -- PLUGINS --

(function ($) {
	var $html_body = $('html, body');

	$.fn.toggleContainer = function (options) {
		// Default options
		var $self = this,
			shouldToggle = true,
			settings = $.extend({
				content_element: undefined,
				pre_logic: undefined,
				post_toggle: undefined,
				callback: undefined,
				delay: 300,
				enable_logging: false,
				force_state: "", /* show|hide */
				firing_events: "click",
				toggle_self: true,
				toggle_order: "before", /* before|after */
				self_toggle_delay_offset: 100,
				toggle_condition: undefined,
				refresh_element: false
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
				if (settings.refresh_element) {
					settings.content_element = $(settings.content_element.selector);
				}
				if (settings.enable_logging) {
					var action = settings.force_state != "" ? settings.force_state + " (forced)" : "";
					if (action == "") {
						if (settings.content_element.is(":visible")) {
							action = "hide";
						}
						else {
							action = "show";
						}
					}
					console.info("toggleContainer", {
						"action": action,
						"toggled_element": settings.content_element,
						"firing_element": this
					});
				}
				if (settings.toggle_condition !== undefined) {
					shouldToggle = settings.toggle_condition();
					if (!shouldToggle) {
						if (settings.enable_logging) {
							console.log("Toggle condition failed. Exiting toggleContainer.");
						}
						return this;
					}
				}

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

	$.fn.requireConfirmation = function (options) {
		// Default options
		var settings = $.extend({
			action: undefined,
			firing_events: "click",
			callback: undefined,
			delay: 300,
			yes_text: "Yes",
			no_text: "No",
			confirm_class: "confirm",
			confirm_text: "Are you sure?"
		}, options),
		$wrapper = $("<div class='remove-confirmation'></div>"),
		$confirm_element = $("<span><p>" + settings.confirm_text + "</p><button class='btn small tertiary yes'>" + settings.yes_text + "</button>" + "<button class='btn small tertiary no'>" + settings.no_text + "</button></span>");

		this.each(function (index) {
			var $current_button = $(this),
				$new_button = $current_button.clone(),
				$current_wrapper = $wrapper.clone(),
				$current_confirm_element = $confirm_element.clone();
			// wire initiator action
			$new_button.on(settings.firing_events, function (e) {
				e.preventDefault();
				$(this).parent().addClass(settings.confirm_class);
			});

			// wire confirm action
			if (settings.action !== undefined) {
				$current_confirm_element.find(".yes").on(settings.firing_events, function (e) {
					e.preventDefault();
					settings.action($(this));
				});
			}
			// wire cancel action
			$current_confirm_element.find(".no").on(settings.firing_events, function (e) {
				e.preventDefault();
				$(this).parent().parent().removeClass(settings.confirm_class);
			});

			// Put the elements in the wrapper
			$current_wrapper.append($new_button);
			$current_wrapper.append($current_confirm_element);
			$current_button.replaceWith($current_wrapper);
		});

		return this;
	};

}(jQuery));

//#endregion PLUGINS

//#region -- HANDLEBARS HELPERS --

Handlebars.registerHelper('ToLower', function (value, options) {
	return new Handlebars.SafeString(value.toLowerCase());
});

//#endregion

var Checkout = {
	"Data": {
		"cart_items": [
			{
				"id": 1,
				"name": "ProTouch No Sweat 4oz",
				"thumbnail": "images/product_1_thumb.png",
				"unit_price": 9.95,
				"quantity": 1,
				"extended_price": 9.95
			},
			{
				"id": 2,
				"name": "C22 Citrus Solvent 12oz",
				"thumbnail": "images/product_2_thumb.png",
				"unit_price": 14.90,
				"quantity": 2,
				"extended_price": 29.80
			},
			{
				"id": 3,
				"name": "Walker Adhesive Remover 4oz",
				"thumbnail": "images/product_3_thumb.png",
				"unit_price": 4.95,
				"quantity": 5,
				"extended_price": 24.75
			}
		],
		"addresses": [
			{
				"id": 1,
				"name": "John Doe",
				"company": "",
				"street": "123 A street",
				"city": "Mobile",
				"state": "AK",
				"postal": "88739",
				"country_code": "US",
				"country_name": "United States",
				"phone": "+1-222-333-4567",
				"default_shipping": true,
				"default_billing": true
			},
			{
				"id": 2,
				"name": "Jane Doe",
				"company": "Northwind Ltd.",
				"street": "1866 Industry Rd.",
				"city": "Lancaster",
				"state": "PA",
				"postal": "17601",
				"country_code": "US",
				"country_name": "United States",
				"phone": "+1-555-555-5555",
				"default_shipping": false,
				"default_billing": false
			},
			{
				"id": 3,
				"name": "Jane Doe",
				"company": "",
				"street": "456 Hollow Dr.",
				"city": "Lancaster",
				"state": "PA",
				"postal": "17603",
				"country_code": "US",
				"country_name": "United States",
				"phone": "+1-444-444-3444",
				"default_shipping": false,
				"default_billing": false
			}
		],
		"credit_cards": [
			{
				"id": 1,
				"name": "John Doe",
				"type": "Visa",
				"last_four": "8237",
				"expiration": "10/16",
				"addressId": 1,
				"default": true,
				"in_wallet": true
			},
			{
				"id": 2,
				"name": "John Doe",
				"type": "MasterCard",
				"last_four": "7812",
				"expiration": "03/16",
				"addressId": 1,
				"default": false,
				"in_wallet": true
			},
			{
				"id": 3,
				"name": "Jane Doe",
				"type": "AMEX",
				"last_four": "2254",
				"expiration": "01/13",
				"addressId": 3,
				"default": false,
				"in_wallet": true
			}
		],
		"countries": [
			{
				"name": "United States",
				"value": "US",
				"states": [
					{ "name": "Alabama", "value": "AL" },
					{ "name": "Alaska", "value": "AK" },
					{ "name": "Arizona", "value": "AZ" },
					{ "name": "Arkansas", "value": "AR" },
					{ "name": "California", "value": "CA" },
					{ "name": "Colorado", "value": "CO" },
					{ "name": "Connecticut", "value": "CT" },
					{ "name": "Delaware", "value": "DE" },
					{ "name": "Florida", "value": "FL" },
					{ "name": "Georgia", "value": "GA" },
					{ "name": "Guam", "value": "GU" },
					{ "name": "Hawaii", "value": "HI" },
					{ "name": "Idaho", "value": "ID" },
					{ "name": "Illinois", "value": "IL" },
					{ "name": "Indiana", "value": "IN" },
					{ "name": "Iowa", "value": "IA" },
					{ "name": "Kansas", "value": "KS" },
					{ "name": "Kentucky", "value": "KY" },
					{ "name": "Louisiana", "value": "LA" },
					{ "name": "Maine", "value": "ME" },
					{ "name": "Maryland", "value": "MD" },
					{ "name": "Marshall Islands", "value": "MH" },
					{ "name": "Massachusetts", "value": "MA" },
					{ "name": "Michigan", "value": "MI" },
					{ "name": "Minnesota", "value": "MN" },
					{ "name": "Mississippi", "value": "MS" },
					{ "name": "Missouri", "value": "MO" },
					{ "name": "Montana", "value": "MT" },
					{ "name": "Nebraska", "value": "NE" },
					{ "name": "Nevada", "value": "NV" },
					{ "name": "New Hampshire", "value": "NH" },
					{ "name": "New Jersey", "value": "NJ" },
					{ "name": "New Mexico", "value": "NM" },
					{ "name": "New York", "value": "NY" },
					{ "name": "North Carolina", "value": "NC" },
					{ "name": "North Dakota", "value": "ND" },
					{ "name": "Ohio", "value": "OH" },
					{ "name": "Oklahoma", "value": "OK" },
					{ "name": "Oregon", "value": "OR" },
					{ "name": "Pennsylvania", "value": "PA" },
					{ "name": "Rhode Island", "value": "RI" },
					{ "name": "Puerto Rico", "value": "PR" },
					{ "name": "South Carolina", "value": "SC" },
					{ "name": "South Dakota", "value": "SD" },
					{ "name": "Tennessee", "value": "TN" },
					{ "name": "Texas", "value": "TX" },
					{ "name": "Utah", "value": "UT" },
					{ "name": "Vermont", "value": "VT" },
					{ "name": "Virgin Islands", "value": "VI" },
					{ "name": "Virginia", "value": "VA" },
					{ "name": "Washington", "value": "WA" },
					{ "name": "West Virginia", "value": "WV" },
					{ "name": "Wisconsin", "value": "WI" },
					{ "name": "Wyoming", "value": "WY" },
					{ "name": "American Samoa", "value": "AS" },
					{ "name": "Micronesia", "value": "FM" },
					{ "name": "Armed Forces Pacific", "value": "AP" },
					{ "name": "District of Columbia", "value": "DC" },
					{ "name": "Armed Forces Americas", "value": "AA" },
					{ "name": "Armed Forces Europe", "value": "AE" }
				]
			},
			{
				"name": "Canada",
				"value": "CA",
				"states": [
					{ "name": "Alberta", "value": "AB" },
					{ "name": "British Columbia", "value": "BC" },
					{ "name": "Manitoba", "value": "MB" },
					{ "name": "New Brunswick", "value": "NB" },
					{ "name": "Newfoundland and Labrador", "value": "NL" },
					{ "name": "Northwest Territories", "value": "NT" },
					{ "name": "Nova Scotia", "value": "NS" },
					{ "name": "Nunavut", "value": "NU" },
					{ "name": "Ontario", "value": "ON" },
					{ "name": "Prince Edward Island", "value": "PE" },
					{ "name": "Quebec", "value": "QC" },
					{ "name": "Saskatchewan", "value": "SK" },
					{ "name": "Yukon", "value": "YT" },
				]
			},
			{
				"name": "Germany",
				"value": "DE"
			},
			{
				"name": "United Kingdom",
				"value": "UK"
			}
		],
		"checkout_details": {
			"subtotal": 0,
			"tax_rate": 0,
			"tax_amount": 0,
			"shipping_amount": 0,
			"shipping_tax_amount": 0,
			"promo_code": "",
			"promo_amount": 0,
			"grand_total": 0,
			"shipping_address": {
				"name": "",
				"company": "",
				"street": "",
				"city": "",
				"state": "",
				"postal_code": "",
				"country": "",
				"phone_number": ""
			},
			"shipping_option": {
				"carrier": "",
				"option": "",
				"delivery_date": ""
			},
			"billing_address": {
				"name": "",
				"company": "",
				"street": "",
				"city": "",
				"state": "",
				"postal_code": "",
				"country": "",
				"phone_number": ""
			},
			"billing_method": "",
			"credit_card_data": {
				"type": "",
				"last_four": "",
				"expiration": ""
			}
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
			"$required_fields": undefined,
			"$footer": undefined,
			"$order_total": undefined,
			"$error_container": undefined,
			"$required_field_error": undefined
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
			"$new_address_form_title": undefined,
			"$btncancel_address": undefined,
			"$btnsave_address": undefined,
			"$btnedit_address": undefined,
			"$input_country": undefined,
			"$autocomplete_county": undefined,
			"$input_name": undefined,
			"$input_company": undefined,
			"$input_street": undefined,
			"$input_city": undefined,
			"$input_state": undefined,
			"$autocomplete_state": undefined,
			"$input_state_select": undefined,
			"$input_postal": undefined,
			"$input_phone": undefined,
			"$secondary_fields": undefined,
			"$address_inputs": undefined,
			"$required_address_inputs": undefined
		},
		"ShippingMethod": {
			"$loading_panel": undefined,
			"$shipping_option_wrapper": undefined,
			"$shipping_option_items": undefined
		},
		"BillingInfo": {
			"$promo_code_form": undefined,
			"$btnpromo_code": undefined,
			"$input_promo_code": undefined,
			"$promo_details": undefined,
			"$promo_error": undefined,
			"$payment_wrapper": undefined,
			"$payment_option_list": undefined,
			"$payment_option_credit_card": undefined,
			"$payment_option_paypal": undefined,
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
			"$required_credit_card_inputs": undefined,
			"$btnchange_billing_address": undefined,
			"$billing_address_container": undefined,
			"$card_billing_address_container": undefined,
			"$card_billing_address_street": undefined,
			"$card_billing_address_city": undefined,
			"$card_billing_address_state": undefined,
			"$card_billing_address_postal": undefined,
			"$billing_address_items": undefined,
			"$billing_address_list": undefined,
			"$btnadd_billing_address": undefined,
			"$billing_address_form": undefined,
			"$billing_address_form_title": undefined,
			"$input_country": undefined,
			"$autocomplete_county": undefined,
			"$input_name": undefined,
			"$input_company": undefined,
			"$input_street": undefined,
			"$input_city": undefined,
			"$input_state": undefined,
			"$autocomplete_state": undefined,
			"$input_state_select": undefined,
			"$input_postal": undefined,
			"$input_phone": undefined,
			"$secondary_fields": undefined,
			"$address_inputs": undefined,
			"$required_address_inputs": undefined,
			"$credit_card_inputs": undefined,
			"$btnsave_address": undefined,
			"$btncancel_address": undefined,
			"$btnedit_address": undefined,
			"$expiration_date_error": undefined
		},
		"Review": {
			"$cost_breakdown_container": undefined,
			"$subtotal": undefined,
			"$shipping_cost": undefined,
			"$tax": undefined,
			"$discount": undefined,
			"$total": undefined,
			"$shipping_address_container": undefined,
			"$shipping_address_name": undefined,
			"$shipping_address_company": undefined,
			"$shipping_address_street": undefined,
			"$shipping_address_city": undefined,
			"$shipping_address_state": undefined,
			"$shipping_address_postal": undefined,
			"$shipping_address_country": undefined,
			"$shipping_address_phone": undefined,
			"$shipping_option_container": undefined,
			"$shipping_option_carrier": undefined,
			"$shipping_option_method": undefined,
			"$shipping_option_delivery_date": undefined,
			"$shipping_option_price": undefined,
			"$billing_data_container": undefined,
			"$billing_address_container": undefined,
			"$billing_address_name": undefined,
			"$billing_address_company": undefined,
			"$billing_address_street": undefined,
			"$billing_address_city": undefined,
			"$billing_address_state": undefined,
			"$billing_address_postal": undefined,
			"$billing_address_country": undefined,
			"$billing_address_phone": undefined,
			"$shopping_cart_container": undefined,
			"$btnupdate_cart_item": undefined,
			"$btnremove_cart_item": undefined,
			"$quantity_inputs": undefined,
			"$btnchange_selection": undefined
		}
	},
	"Settings": {
		"Shared": {
			"mode": "return",
			"footertop": undefined,
			"easing_duration": 300,
			"step_url_prefix": "checkout-",
			"absoluteClassName": "absolute",
			"error_class": "error",
			"success_class": "success",
			"complete_class": "complete",
			"required_class": "required",
			"secondary_field_class": "field__secondary",
			"shipping_address_step_id": "shipping-address",
			"shipping_option_step_id": "shipping-method",
			"billing_step_id": "billing-information",
			"review_step_id": "order-review",
			"confirmation_step_id": "order-confirmation",
			"active_class": "active",
			"steps": [],
			"addresses_template": undefined,
			"country_select_template": undefined,
			"state_select_template": undefined,
			"error_item_template": undefined,
			"required_field_slide_up_exceptions": ["cc-expiration-input"],
			"countries_with_states": ["US", "CA"]
		},
		"ShippingAddress": {
			"is_step_valid": true
		},
		"ShippingMethod": {
			"loading_panel_timeout": undefined
		},
		"BillingInfo": {
			"credit_card_template": undefined,
			"is_credit_card_valid": true,
			"is_address_valid": true,
			"is_step_valid": true
		}
	},
	"Functions": {
		"Shared": {
			"Init": function () {
				Checkout.Settings.Shared.steps = [Checkout.Settings.Shared.shipping_address_step_id, Checkout.Settings.Shared.shipping_option_step_id, Checkout.Settings.Shared.billing_step_id, Checkout.Settings.Shared.review_step_id, Checkout.Settings.Shared.confirmation_step_id];
				if (Checkout.Settings.Shared.mode == "new") {
					Checkout.Data.addresses = [];
					Checkout.Data.credit_cards = [];
				}
				Checkout.Functions.Shared.BindEvents_Window();
				Checkout.Functions.Shared.BindEvents_Document();
			},
			"GetFields": function () {
				/// <summary>Gets DOM elements & other dynamic variable values.</summary>
				Checkout.Fields.Shared.$need_help = $(".need-help");
				Checkout.Fields.Shared.$help_content = $("#help-content");
				Checkout.Fields.Shared.$progress_bar = $("#progress-bar");
				Checkout.Fields.Shared.$progress_bar_items = Checkout.Fields.Shared.$progress_bar.find("a");
				Checkout.Fields.Shared.$step_shipping_address = $("#" + Checkout.Settings.Shared.shipping_address_step_id);
				Checkout.Fields.Shared.$step_shipping_option = $("#" + Checkout.Settings.Shared.shipping_option_step_id);
				Checkout.Fields.Shared.$step_billing = $("#" + Checkout.Settings.Shared.billing_step_id);
				Checkout.Fields.Shared.$step_review = $("#" + Checkout.Settings.Shared.review_step_id);
				Checkout.Fields.Shared.$step_confirmation = $("#" + Checkout.Settings.Shared.confirmation_step_id);
				Checkout.Fields.Shared.$step_current = Checkout.Fields.Shared.$step_shipping_address;
				Checkout.Fields.Shared.$step_next = Checkout.Fields.Shared.$step_shipping_option;
				Checkout.Fields.Shared.$step_previous = Checkout.Fields.Shared.$step_current.prev();
				Checkout.Fields.Shared.$form_inputs = $("input[type=text], input[type=tel], textarea, #country-input, #billing-country-input");
				Checkout.Fields.Shared.$required_fields = Checkout.Fields.Shared.$form_inputs.filter("." + Checkout.Settings.Shared.required_class);
				Checkout.Fields.Shared.$footer = $(".checkout > footer");
				Checkout.Fields.Shared.$cta_bar = Checkout.Fields.Shared.$footer.find(".cta_bar");
				Checkout.Fields.Shared.$btn_next = Checkout.Fields.Shared.$cta_bar.find("button");
				Checkout.Fields.Shared.$order_total = Checkout.Fields.Shared.$cta_bar.find(".total");
				Checkout.Fields.Shared.$error_container = $("#error-container");
				Checkout.Fields.ShippingAddress.$shipping_address_instructions = Checkout.Fields.Shared.$step_shipping_address.find(".instructions");
				Checkout.Fields.ShippingAddress.$btnchangeaddress = Checkout.Fields.Shared.$step_shipping_address.find("button.changeaddress");
				Checkout.Fields.ShippingAddress.$btnadd_address = Checkout.Fields.Shared.$step_shipping_address.find("button.createaddress");
				Checkout.Fields.ShippingAddress.$address_wrapper = Checkout.Fields.Shared.$step_shipping_address.find(".address-wrapper");
				Checkout.Fields.ShippingAddress.$address_list = Checkout.Fields.ShippingAddress.$address_wrapper.find(".address-list");
				Checkout.Fields.ShippingAddress.$new_address_form = Checkout.Fields.Shared.$step_shipping_address.find("#new-address-form");
				Checkout.Fields.ShippingAddress.$new_address_form_title = Checkout.Fields.ShippingAddress.$new_address_form.find("h2");
				Checkout.Fields.ShippingAddress.$required_address_inputs = Checkout.Fields.ShippingAddress.$new_address_form.find("input.required, select.required, textarea.required");
				Checkout.Fields.ShippingAddress.$btncancel_address = Checkout.Fields.ShippingAddress.$new_address_form.find(".add-edit-address button.cancel");
				Checkout.Fields.ShippingAddress.$btnsave_address = Checkout.Fields.ShippingAddress.$new_address_form.find(".add-edit-address button.save");
				Checkout.Fields.ShippingAddress.$input_country = Checkout.Fields.ShippingAddress.$new_address_form.find("#country-input");
				Checkout.Fields.ShippingAddress.$input_name = Checkout.Fields.ShippingAddress.$new_address_form.find("#name-input");
				Checkout.Fields.ShippingAddress.$input_company = Checkout.Fields.ShippingAddress.$new_address_form.find("#company-input");
				Checkout.Fields.ShippingAddress.$input_street = Checkout.Fields.ShippingAddress.$new_address_form.find("#address-input");
				Checkout.Fields.ShippingAddress.$input_city = Checkout.Fields.ShippingAddress.$new_address_form.find("#city-input");
				Checkout.Fields.ShippingAddress.$input_state = Checkout.Fields.ShippingAddress.$new_address_form.find("#state-input");
				Checkout.Fields.ShippingAddress.$input_state_select = Checkout.Fields.ShippingAddress.$new_address_form.find("#state-input-select");
				Checkout.Fields.ShippingAddress.$input_postal = Checkout.Fields.ShippingAddress.$new_address_form.find("#postal-code-input");
				Checkout.Fields.ShippingAddress.$input_phone = Checkout.Fields.ShippingAddress.$new_address_form.find("#phone-input");
				Checkout.Fields.ShippingAddress.$secondary_fields = Checkout.Fields.ShippingAddress.$new_address_form.find(".field__secondary");
				Checkout.Fields.ShippingAddress.$address_inputs = Checkout.Fields.ShippingAddress.$new_address_form.find("input[type=text], input[type=tel], textarea, #country-input");
				Checkout.Fields.ShippingMethod.$loading_panel = Checkout.Fields.Shared.$step_shipping_option.find(".loading-panel");
				Checkout.Fields.ShippingMethod.$shipping_option_wrapper = Checkout.Fields.Shared.$step_shipping_option.find(".shipping-option-wrapper");
				Checkout.Fields.ShippingMethod.$shipping_option_items = Checkout.Fields.ShippingMethod.$shipping_option_wrapper.find(".shipping-option-item input[type=radio]");
				Checkout.Fields.BillingInfo.$promo_code_form = Checkout.Fields.Shared.$step_billing.find("#promo-code-form");
				Checkout.Fields.BillingInfo.$btnpromo_code = Checkout.Fields.BillingInfo.$promo_code_form.find("button");
				Checkout.Fields.BillingInfo.$input_promo_code = Checkout.Fields.BillingInfo.$promo_code_form.find("#promo-code-input");
				Checkout.Fields.BillingInfo.$promo_details = Checkout.Fields.BillingInfo.$promo_code_form.find(".promo-details");
				Checkout.Fields.BillingInfo.$promo_error = Checkout.Fields.BillingInfo.$promo_code_form.find(".promo-error-message");
				Checkout.Fields.BillingInfo.$payment_wrapper = Checkout.Fields.Shared.$step_billing.find("div.payment-wrapper");
				Checkout.Fields.BillingInfo.$payment_option_list = Checkout.Fields.BillingInfo.$payment_wrapper.find(".payment-option-list");
				Checkout.Fields.BillingInfo.$payment_option_credit_card = Checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-credit-card");
				Checkout.Fields.BillingInfo.$payment_option_paypal = Checkout.Fields.BillingInfo.$payment_option_list.find("#payment-option-paypal");
				Checkout.Fields.BillingInfo.$credit_card_wrapper = Checkout.Fields.Shared.$step_billing.find(".credit-card-wrapper");
				Checkout.Fields.BillingInfo.$credit_card_list = Checkout.Fields.BillingInfo.$credit_card_wrapper.find(".credit-card-list");
				Checkout.Fields.BillingInfo.$paypal_container = Checkout.Fields.Shared.$step_billing.find(".paypal-container");
				Checkout.Fields.BillingInfo.$btncreate_credit_card = Checkout.Fields.BillingInfo.$credit_card_wrapper.find(".create-credit-card");
				Checkout.Fields.BillingInfo.$credit_card_form = Checkout.Fields.BillingInfo.$credit_card_wrapper.find("#credit-card-form");
				Checkout.Fields.BillingInfo.$credit_card_form_title = Checkout.Fields.BillingInfo.$credit_card_form.find("h2");
				Checkout.Fields.BillingInfo.$btnsave_credit_card = Checkout.Fields.BillingInfo.$credit_card_form.find("button.save");
				Checkout.Fields.BillingInfo.$btncancel_credit_card = Checkout.Fields.BillingInfo.$credit_card_form.find("button.cancel");
				Checkout.Fields.BillingInfo.$input_cc_expiration = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-expiration-input");
				Checkout.Fields.BillingInfo.$input_cc_name = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-name-input");
				Checkout.Fields.BillingInfo.$input_cc_number = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-number-input");
				Checkout.Fields.BillingInfo.$input_cc_security_code = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-security-code-input");
				Checkout.Fields.BillingInfo.$input_cc_store_in_wallet = Checkout.Fields.BillingInfo.$credit_card_form.find("#cc-wallet-input");
				Checkout.Fields.BillingInfo.$edited_card_masked_number = Checkout.Fields.BillingInfo.$credit_card_form.find(".cc-number-masked");
				Checkout.Fields.BillingInfo.$edited_card_type = Checkout.Fields.BillingInfo.$credit_card_form.find("span.type");
				Checkout.Fields.BillingInfo.$required_credit_card_inputs = Checkout.Fields.BillingInfo.$credit_card_form.find("input.required, select.required, textarea.required");
				Checkout.Fields.BillingInfo.$card_billing_address_container = Checkout.Fields.BillingInfo.$credit_card_form.find(".billing-address");
				Checkout.Fields.BillingInfo.$card_billing_address_street = Checkout.Fields.BillingInfo.$card_billing_address_container.find(".street");
				Checkout.Fields.BillingInfo.$card_billing_address_city = Checkout.Fields.BillingInfo.$card_billing_address_container.find(".city");
				Checkout.Fields.BillingInfo.$card_billing_address_state = Checkout.Fields.BillingInfo.$card_billing_address_container.find(".state");
				Checkout.Fields.BillingInfo.$card_billing_address_postal = Checkout.Fields.BillingInfo.$card_billing_address_container.find(".zip");
				Checkout.Fields.BillingInfo.$btnchange_billing_address = Checkout.Fields.BillingInfo.$credit_card_form.find("button.change-billing-address");
				Checkout.Fields.BillingInfo.$billing_address_container = Checkout.Fields.BillingInfo.$credit_card_wrapper.find(".billing-address-container");
				Checkout.Fields.BillingInfo.$billing_address_list = Checkout.Fields.BillingInfo.$billing_address_container.find("ul.address-list");
				Checkout.Fields.BillingInfo.$btnadd_billing_address = Checkout.Fields.BillingInfo.$billing_address_container.find(".create-billing-address");
				Checkout.Fields.BillingInfo.$billing_address_form = Checkout.Fields.BillingInfo.$billing_address_container.find("#billing-address-form");
				Checkout.Fields.BillingInfo.$billing_address_form_title = Checkout.Fields.BillingInfo.$billing_address_container.find("h3.title");
				Checkout.Fields.BillingInfo.$input_country = Checkout.Fields.BillingInfo.$billing_address_form.find("#billing-country-input");
				Checkout.Fields.BillingInfo.$input_name = Checkout.Fields.BillingInfo.$billing_address_form.find("#name-input");
				Checkout.Fields.BillingInfo.$input_company = Checkout.Fields.BillingInfo.$billing_address_form.find("#company-input");
				Checkout.Fields.BillingInfo.$input_street = Checkout.Fields.BillingInfo.$billing_address_form.find("#address-input");
				Checkout.Fields.BillingInfo.$input_city = Checkout.Fields.BillingInfo.$billing_address_form.find("#city-input");
				Checkout.Fields.BillingInfo.$input_state = Checkout.Fields.BillingInfo.$billing_address_form.find("#state-input");
				Checkout.Fields.BillingInfo.$input_state_select = Checkout.Fields.BillingInfo.$billing_address_form.find("#state-input-select");
				Checkout.Fields.BillingInfo.$input_postal = Checkout.Fields.BillingInfo.$billing_address_form.find("#postal-code-input");
				Checkout.Fields.BillingInfo.$input_phone = Checkout.Fields.BillingInfo.$billing_address_form.find("#phone-input");
				Checkout.Fields.BillingInfo.$secondary_fields = Checkout.Fields.BillingInfo.$billing_address_form.find(".field__secondary");
				Checkout.Fields.BillingInfo.$address_inputs = Checkout.Fields.BillingInfo.$billing_address_form.find("input[type=text], input[type=tel], textarea, #billing-country-input");
				Checkout.Fields.BillingInfo.$required_address_inputs = Checkout.Fields.BillingInfo.$billing_address_form.find("input.required, select.required, textarea.required");
				Checkout.Fields.BillingInfo.$credit_card_inputs = Checkout.Fields.BillingInfo.$credit_card_form.find("input[type=text], textarea");
				Checkout.Fields.BillingInfo.$btncancel_address = Checkout.Fields.BillingInfo.$billing_address_form.find("button.cancel");
				Checkout.Fields.BillingInfo.$btnsave_address = Checkout.Fields.BillingInfo.$billing_address_form.find("button.save");
				Checkout.Fields.Review.$cost_breakdown_container = Checkout.Fields.Shared.$step_review.find(".cost-breakdown");
				Checkout.Fields.Review.$subtotal = Checkout.Fields.Review.$cost_breakdown_container.find(".subtotal .value");
				Checkout.Fields.Review.$shipping_cost = Checkout.Fields.Review.$cost_breakdown_container.find(".shipping .value");
				Checkout.Fields.Review.$tax = Checkout.Fields.Review.$cost_breakdown_container.find(".tax .value");
				Checkout.Fields.Review.$discount = Checkout.Fields.Review.$cost_breakdown_container.find(".discount .value");
				Checkout.Fields.Review.$total = Checkout.Fields.Review.$cost_breakdown_container.find(".total .value");
				Checkout.Fields.Review.$shipping_address_container = Checkout.Fields.Shared.$step_review.find("li.shipping-address");
				Checkout.Fields.Review.$shipping_address_name = Checkout.Fields.Review.$shipping_address_container.find(".name");
				Checkout.Fields.Review.$shipping_address_company = Checkout.Fields.Review.$shipping_address_container.find(".company");
				Checkout.Fields.Review.$shipping_address_street = Checkout.Fields.Review.$shipping_address_container.find(".street");
				Checkout.Fields.Review.$shipping_address_city = Checkout.Fields.Review.$shipping_address_container.find(".city");
				Checkout.Fields.Review.$shipping_address_state = Checkout.Fields.Review.$shipping_address_container.find(".state");
				Checkout.Fields.Review.$shipping_address_postal = Checkout.Fields.Review.$shipping_address_container.find(".zip");
				Checkout.Fields.Review.$shipping_address_country = Checkout.Fields.Review.$shipping_address_container.find(".country");
				Checkout.Fields.Review.$shipping_address_phone = Checkout.Fields.Review.$shipping_address_container.find(".phone");
				Checkout.Fields.Review.$shipping_option_container = Checkout.Fields.Shared.$step_review.find("li.shipping-option");
				Checkout.Fields.Review.$shipping_option_carrier = Checkout.Fields.Review.$shipping_option_container.find(".carrier");
				Checkout.Fields.Review.$shipping_option_delivery_date = Checkout.Fields.Review.$shipping_option_container.find(".delivery-date");
				Checkout.Fields.Review.$shipping_option_method = Checkout.Fields.Review.$shipping_option_container.find(".method");
				Checkout.Fields.Review.$shipping_option_price = Checkout.Fields.Review.$shipping_option_container.find(".price");
				Checkout.Fields.Review.$billing_data_container = Checkout.Fields.Shared.$step_review.find("li.billing-information");
				Checkout.Fields.Review.$billing_address_container = Checkout.Fields.Review.$billing_data_container.find(".address");
				Checkout.Fields.Review.$billing_address_name = Checkout.Fields.Review.$billing_address_container.find(".name");
				Checkout.Fields.Review.$billing_address_company = Checkout.Fields.Review.$billing_address_container.find(".company");
				Checkout.Fields.Review.$billing_address_street = Checkout.Fields.Review.$billing_address_container.find(".street");
				Checkout.Fields.Review.$billing_address_city = Checkout.Fields.Review.$billing_address_container.find(".city");
				Checkout.Fields.Review.$billing_address_state = Checkout.Fields.Review.$billing_address_container.find(".state");
				Checkout.Fields.Review.$billing_address_postal = Checkout.Fields.Review.$billing_address_container.find(".zip");
				Checkout.Fields.Review.$billing_address_country = Checkout.Fields.Review.$billing_address_container.find(".country");
				Checkout.Fields.Review.$billing_address_phone = Checkout.Fields.Review.$billing_address_container.find(".phone");
				Checkout.Fields.Review.$shopping_cart_container = Checkout.Fields.Shared.$step_review.find(".shopping-cart-container");
				Checkout.Fields.Review.$btnupdate_cart_item = Checkout.Fields.Review.$shopping_cart_container.find("button.update-cart-item");
				Checkout.Fields.Review.$btnremove_cart_item = Checkout.Fields.Review.$shopping_cart_container.find("button.remove-cart-item");
				Checkout.Fields.Review.$quantity_inputs = Checkout.Fields.Review.$shopping_cart_container.find(".quantity input");
				Checkout.Fields.Review.$btnchange_selection = Checkout.Fields.Shared.$step_review.find(".selection-container button.change");
			},
			"GetDynamicFields": function () {
				Checkout.Fields.ShippingAddress.$default_address = Checkout.Fields.ShippingAddress.$address_list.find(".default");
				Checkout.Fields.ShippingAddress.$additional_addresses = Checkout.Fields.ShippingAddress.$address_list.find(".additional-address");
				Checkout.Fields.ShippingAddress.$address_items = Checkout.Fields.ShippingAddress.$address_list.find("input[type=radio]");
				Checkout.Fields.ShippingAddress.$btnedit_address = Checkout.Fields.ShippingAddress.$address_list.find(".address-item button");
				Checkout.Fields.BillingInfo.$billing_address_items = Checkout.Fields.BillingInfo.$billing_address_container.find("input[type=radio]");
				Checkout.Fields.BillingInfo.$btnedit_address = Checkout.Fields.BillingInfo.$billing_address_list.find("button.edit");
				Checkout.Fields.BillingInfo.$credit_cards = Checkout.Fields.BillingInfo.$credit_card_list.find(".credit-card-item input[type=radio]");
				Checkout.Fields.BillingInfo.$btnedit_credit_card = Checkout.Fields.BillingInfo.$credit_card_list.find("button.edit-credit-card");
			},
			"WireEvents": function () {
				/// <summary>Wire up control events</summary>
				Checkout.Functions.Shared.BindEvents_NeedHelp(false);
				Checkout.Functions.Shared.BindEvents_NextButton(false);
				Checkout.Functions.Shared.BindEvents_FormInputs(false);
				Checkout.Functions.Shared.BindEvents_ProgressBarItems(false);
				Checkout.Functions.Shared.BindEvents_RequiredFields(false);
				Checkout.Functions.ShippingAddress.BindEvents_AdditionalAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_AddressItems(false);
				Checkout.Functions.ShippingAddress.BindEvents_AddAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_CancelAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_SaveAddressButton(false);
				Checkout.Functions.ShippingAddress.BindEvents_AddressForm(false);
				Checkout.Functions.ShippingAddress.BindEvents_CountrySelect(false);
				Checkout.Functions.ShippingAddress.BindEvents_RequiredAddressFields(false);
				Checkout.Functions.ShippingOption.BindEvents_ShippingOptionItems(false);
				Checkout.Functions.BillingInfo.BindEvents_PromoCodeForm(false);
				Checkout.Functions.BillingInfo.BindEvents_PromoCodeButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardOptionButton(false);
				Checkout.Functions.BillingInfo.BindEvents_PayPalOptionButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreateCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardForm(false);
				Checkout.Functions.BillingInfo.BindEvents_SaveCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CancelCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_EditCreditCardButton(false);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardItems(false);
				Checkout.Functions.BillingInfo.BindEvents_ChangeBillingAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_BillingAddressItem(false);
				Checkout.Functions.BillingInfo.BindEvents_AddBillingAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_BillingAddressForm(false);
				Checkout.Functions.BillingInfo.BindEvents_BillingCountrySelect(false);
				Checkout.Functions.BillingInfo.BindEvents_RequiredAddressFields(false);
				Checkout.Functions.BillingInfo.BindEvents_CancelAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_SaveAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_EditAddressButton(false);
				Checkout.Functions.BillingInfo.BindEvents_ExpirationDate(false);
				Checkout.Functions.Review.BindEvents_QuantityInputs(false);
				Checkout.Functions.Review.BindEvents_UpdateCartItemButton(false);
				Checkout.Functions.Review.BindEvents_RemoveCartItemButton(false);
				Checkout.Functions.Review.BindEvents_ChangeSelectionButton(false);
			},
			"InitCurrentStep": function (step_name) {
				var $currentProgressBarItem = $("a[href=#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.attr("id") + "]").parent();
				Checkout.Functions.Shared.SetActiveProgressBarItem($currentProgressBarItem);
				Checkout.Fields.Shared.$btn_next.text(Checkout.Fields.Shared.$btn_next.attr("data-text-next"));
				if (Checkout.Fields.Shared.$step_previous !== undefined) {
					Checkout.Fields.Shared.$progress_bar.animatedScroll();
					Checkout.Fields.Shared.$step_previous.slideUp(Checkout.Settings.Shared.easing_duration - 200, function () {
						Checkout.Functions.Shared.RestoreStepDefaultView(Checkout.Fields.Shared.$step_previous.attr("id"));
						Checkout.Fields.Shared.$step_current.slideDown(Checkout.Settings.Shared.easing_duration);
					});
				}
				else {
					Checkout.Fields.Shared.$step_current.slideDown(Checkout.Settings.Shared.easing_duration);
				}
				switch (step_name) {
					case Checkout.Settings.Shared.shipping_address_step_id:
						if (Checkout.Fields.ShippingAddress.$address_items !== undefined && Checkout.Data.checkout_details.shipping_address.street == "") {
							Checkout.Fields.ShippingAddress.$address_items.filter("[checked]").trigger("click");
						}
						break;
					case Checkout.Settings.Shared.shipping_option_step_id:
						Checkout.Settings.ShippingMethod.loading_panel_timeout = setTimeout(function () {
							Checkout.Fields.ShippingMethod.$loading_panel.fadeOut(Checkout.Settings.Shared.easing_duration - 200, function () {
								Checkout.Fields.ShippingMethod.$shipping_option_wrapper.slideDown(Checkout.Settings.Shared.easing_duration, function () {
									if (Checkout.Data.checkout_details.shipping_option.option == "") {
										Checkout.Fields.ShippingMethod.$shipping_option_items.filter("[checked]").trigger("click");
									}
									Checkout.Fields.Shared.$step_shipping_option.animatedScroll();
								});
							});
						}, 3000);
						break;
					case Checkout.Settings.Shared.billing_step_id:
						if (Checkout.Settings.Shared.mode === "return" && Checkout.Data.checkout_details.billing_method == "") {
							Checkout.Functions.BillingInfo.SelectDefaultOption();
						}
						break;
					case Checkout.Settings.Shared.review_step_id:
						Checkout.Fields.Shared.$btn_next.text(Checkout.Fields.Shared.$btn_next.attr("data-text-complete"));
						break;
					case Checkout.Settings.Shared.confirmation_step_id:
						Checkout.Fields.Shared.$progress_bar.hide();
						Checkout.Fields.Shared.$cta_bar.hide();
						Checkout.Fields.Shared.$footer.hide();
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
				Checkout.Functions.Shared.CalculateGrandTotal();
				Checkout.Fields.Shared.$order_total.text("$" + Checkout.Data.checkout_details.grand_total.toFixed(2));
				Checkout.Functions.Review.UpdateOrderReviewTotals();
			},
			"InitializeAddressData": function () {
				var $address_items = Checkout.Fields.ShippingAddress.$address_list.children(),
					$billing_address_items = Checkout.Fields.BillingInfo.$billing_address_list.children(),
					$cc_addresses = Checkout.Fields.BillingInfo.$credit_card_list.find(".address");

				$address_items.eq(0).data("addressId", Checkout.Data.addresses[0].id);
				$address_items.eq(1).data("addressId", Checkout.Data.addresses[1].id);
				$address_items.eq(2).data("addressId", Checkout.Data.addresses[2].id);
				$billing_address_items.eq(0).data("addressId", Checkout.Data.addresses[0].id);
				$billing_address_items.eq(1).data("addressId", Checkout.Data.addresses[1].id);
				$billing_address_items.eq(2).data("addressId", Checkout.Data.addresses[2].id);
				$cc_addresses.eq(0).data("addressId", Checkout.Data.addresses[0].id);
				$cc_addresses.eq(1).data("addressId", Checkout.Data.addresses[2].id);
				$cc_addresses.eq(2).data("addressId", Checkout.Data.addresses[0].id);
			},
			"CalculateCartTotal": function () {
				// reset the subotal
				Checkout.Data.checkout_details.subtotal = 0;
				$.each(Checkout.Data.cart_items, function (i, cart_item) {
					Checkout.Data.checkout_details.subtotal = (Checkout.Functions.Shared.GetDecimal(Checkout.Data.checkout_details.subtotal) + Checkout.Functions.Shared.GetDecimal(cart_item.extended_price));
				});
			},
			"CalculateTaxAmount": function () {
				Checkout.Data.checkout_details.tax_amount = Checkout.Functions.Shared.GetDecimal((Checkout.Data.checkout_details.subtotal - Checkout.Data.checkout_details.promo_amount) * Checkout.Data.checkout_details.tax_rate);
				Checkout.Data.checkout_details.shipping_tax_amount = Checkout.Functions.Shared.GetDecimal(Checkout.Data.checkout_details.shipping_amount * Checkout.Data.checkout_details.tax_rate);
			},
			"CalculateGrandTotal": function () {
				Checkout.Functions.Shared.CalculateCartTotal();
				Checkout.Functions.Shared.CalculateTaxAmount();
				Checkout.Data.checkout_details.grand_total = (Checkout.Data.checkout_details.subtotal - Checkout.Data.checkout_details.promo_amount + Checkout.Data.checkout_details.tax_amount + Checkout.Data.checkout_details.shipping_amount + Checkout.Data.checkout_details.shipping_tax_amount);
			},
			"GetAddressById": function (id) {
				var address = undefined,
					index = -1;
				if (id > 0) {
					$.each(Checkout.Data.addresses, function (i, item) {
						if (item.id === id) {
							index = i;
							return false;
						}
					});
					if (index > -1) {
						address = Checkout.Data.addresses[index];
					}
				}
				return address;
			},
			"GetDefaultShippingAddress": function () {
				var address = undefined;
				$.each(Checkout.Data.addresses, function (i, item) {
					if (item.default_shipping) {
						address = item;
						return false;
					}
				});
				return address;
			},
			"GetDefaultBillingAddress": function () {
				var address = undefined;
				$.each(Checkout.Data.addresses, function (i, item) {
					if (item.default_billing) {
						address = item;
						return false;
					}
				});
				return address;
			},
			"ConfigureNewUserVersion": function () {
				// Configure shipping address step
				Checkout.Fields.ShippingAddress.$btnchangeaddress.hide();
				Checkout.Fields.ShippingAddress.$btncancel_address.attr("disabled", "disabled");
				Checkout.Fields.ShippingAddress.$new_address_form.slideDown(Checkout.Settings.Shared.easing_duration);
				Checkout.Functions.ShippingAddress.ToggleAddressFormMode("new");
				// Configure billing info step
				Checkout.Fields.BillingInfo.$btncreate_credit_card.hide();
				Checkout.Functions.BillingInfo.ToggleCreditCardFormMode("new");
				Checkout.Fields.BillingInfo.$credit_card_form.show();
				Checkout.Fields.BillingInfo.$btncancel_credit_card.attr("disabled", "disabled");
			},
			"UpdateAddress": function (addressData, $address_element, type) {
				var addressDataEntry = Checkout.Functions.Shared.GetAddressById(addressData.id),
				$shipping_address_items = type == "billing" ? Checkout.Fields.ShippingAddress.$address_list.children() : undefined,
				$billing_address_items = type == "shipping" ? Checkout.Fields.BillingInfo.$billing_address_list.children() : undefined,
				$cc_addresses = Checkout.Fields.BillingInfo.$credit_card_list.find(".address"),
				$updatedElement = undefined;

				// Update address data entry
				addressDataEntry.name = addressData.name;
				addressDataEntry.company = addressData.company;
				addressDataEntry.street = addressData.street;
				addressDataEntry.city = addressData.city;
				addressDataEntry.state = addressData.state;
				addressDataEntry.postal = addressData.postal;
				addressDataEntry.country_code = addressData.country_code;
				addressDataEntry.country_name = addressData.country_name;
				addressDataEntry.phone = addressData.phone;

				// Update the supplied element
				$updatedElement = Checkout.Functions.Shared.UpdateAddressMarkup($address_element, addressData, "full-" + type);

				// Update shipping address element
				if ($shipping_address_items !== undefined) {
					$.each($shipping_address_items, function (i, element) {
						var $element = $(element);
						if ($element.data("addressId") === addressData.id) {
							Checkout.Functions.Shared.UpdateAddressMarkup($element, addressData, "full-" + type);
							return false;
						}
					});
				}
				// Update shipping address element
				if ($billing_address_items !== undefined) {
					$.each($billing_address_items, function (i, element) {
						var $element = $(element);
						if ($element.data("addressId") === addressData.id) {
							Checkout.Functions.Shared.UpdateAddressMarkup($element, addressData, "full-" + type);
							return false;
						}
					});
				}
				// Update credit card address data
				$.each($cc_addresses, function (i, element) {
					var $element = $(element);
					if ($element.data("addressId") === addressData.id) {
						Checkout.Functions.Shared.UpdateAddressMarkup($element, addressData, "partial");
						return false;
					}
				});
				// Determine if the review shipping address was updated
				if (Checkout.Fields.Review.$shipping_address_container.data("addressId") === addressData.id) {
					Checkout.Functions.Shared.UpdateAddressMarkup(Checkout.Fields.Review.$shipping_address_container, addressData, "partial");
				}
				// Determine if the review billing address was updated
				if (Checkout.Fields.Review.$billing_address_container.data("addressId") === addressData.id) {
					Checkout.Functions.Shared.UpdateAddressMarkup(Checkout.Fields.Review.$billing_address_container, addressData, "partial");
				}

				// Refresh event bindings
				Checkout.Functions.ShippingAddress.BindEvents_AddressItems(true);
				Checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(true);
				Checkout.Functions.BillingInfo.BindEvents_BillingAddressItem(true);
				Checkout.Functions.BillingInfo.BindEvents_EditAddressButton(true);
				if ($updatedElement !== undefined && $updatedElement.length > 0) {
					$updatedElement.find("input[type=radio]").trigger("click");
				}

			},
			"UpdateAddressMarkup": function ($element, data, type) {
				var $newElement = undefined,
					updatedElements = [];

				if ($element !== undefined && $element.length > 0) {
					updatedElements.push(data);
					$newElement = $(Checkout.Settings.Shared.addresses_template(updatedElements));
					$newElement.data("addressId", data.id);

					switch (type) {
						case "full-shipping":
							$newElement.find("span.btn").addClass("shiptothis");
							$element.replaceWith($newElement);
							break;
						case "full-billing":
							$newElement.find("span.btn").addClass("billtothis");
							$element.replaceWith($newElement);
							break;
						case "partial":
							$element.replaceWith($newElement.find(".address"));
							break;
					}
				}
				return $newElement;
			},
			"CompileUITemplates": function () {
				Checkout.Settings.Shared.error_item_template = Handlebars.compile($("#error-message-template").html());
				Checkout.Settings.Shared.country_select_template = Handlebars.compile($("#country-select-template").html());
				Checkout.Settings.Shared.state_select_template = Handlebars.compile($("#state-select-template").html());
				Checkout.Settings.Shared.addresses_template = Handlebars.compile($("#customer-addresses-template").html());
				Checkout.Settings.BillingInfo.credit_card_template = Handlebars.compile($("#customer-credit-card-template").html());
			},
			"BindUIElements": function () {
				Checkout.Functions.Shared.CompileUITemplates();
				Checkout.Functions.Shared.BindCountryElements();
				if (Checkout.Data.addresses.length > 0) {
					Checkout.Functions.Shared.BindAddressElements();
				}
				if (Checkout.Data.credit_cards.length > 0) {
					Checkout.Functions.BillingInfo.BindCreditCardElements();
				}
			},
			"BindAddressElements": function () {
				var addressHtml = Checkout.Settings.Shared.addresses_template(Checkout.Data.addresses),
					$shippingAddressesMarkup = $(addressHtml),
					$billingAddressesMarkup = $shippingAddressesMarkup.clone(),
					$shippingAddressItems = $shippingAddressesMarkup.filter("li.address-item"),
					$billingAddressItems = $billingAddressesMarkup.filter("li.address-item"),
					$shippingAddressButtons = $shippingAddressItems.find("label.card > span.btn"),
					$billingAddressButtons = $billingAddressItems.find("label.card > span.btn"),
					$shippingAddressInputs = $shippingAddressItems.find("input[type=radio]"),
					$billingAddressInputs = $billingAddressItems.find("input[type=radio]"),
					$billingAddressLabels = $billingAddressItems.find("label"),
					defaultShippingId = Checkout.Functions.Shared.GetDefaultShippingAddress().id,
					defaultBillingId = Checkout.Functions.Shared.GetDefaultBillingAddress().id;

				$shippingAddressButtons.addClass("shiptothis");
				$billingAddressButtons.addClass("billtothis");

				$billingAddressInputs.each(function (index) {
					var $this = $(this),
						id = parseInt($this.attr("id").replace("address", ""));
					$this.attr("id", "billing-" + $this.attr("id")).val("billing-" + $this.val());
					if (id === defaultBillingId) {
						Checkout.Fields.BillingInfo.$card_billing_address_container.html($this.parent().find(".address")[0].outerHTML);
					}
				});

				$billingAddressLabels.each(function (index) {
					var $this = $(this);
					$this.attr("for", "billing-" + $this.attr("for"));
				});

				$shippingAddressInputs.each(function (index) {
					var $this = $(this),
						id = parseInt($this.attr("id").replace("address", ""));

					if (id === defaultShippingId) {
						$this.attr("checked", "checked").parent().addClass("default");
					}
					else {
						$this.parent().addClass("additional-address").css("display", "none");
					}
				});

				Checkout.Fields.ShippingAddress.$address_list.html($shippingAddressesMarkup);
				Checkout.Fields.BillingInfo.$billing_address_list.prepend($billingAddressesMarkup);
			},
			"BindCountryElements": function () {
				var shippingContext = {
					"id": "country-input",
					"countries": Checkout.Data.countries
				},
				billingContext = {
					"id": "billing-country-input",
					"countries": Checkout.Data.countries
				},
				shipping_markup = Checkout.Settings.Shared.country_select_template(shippingContext),
				billing_markup = Checkout.Settings.Shared.country_select_template(billingContext);
				Checkout.Fields.ShippingAddress.$input_country.replaceWith(shipping_markup);
				Checkout.Fields.BillingInfo.$input_country.replaceWith(billing_markup);
				Checkout.Fields.ShippingAddress.$input_country = $(Checkout.Fields.ShippingAddress.$input_country.selector);
				Checkout.Fields.BillingInfo.$input_country = $(Checkout.Fields.BillingInfo.$input_country.selector);
			},
			"GetStateSelectElement": function ($state_element, country_code) {
				var states = undefined,
					context = undefined,
					markup = "";
				$.each(Checkout.Data.countries, function (index, country) {
					if (country.value === country_code) {
						states = country.states;
						return false;
					}
				});
				if (states !== undefined) {
					context = {
						id: $state_element.attr("id"),
						states: states
					};
					markup = Checkout.Settings.Shared.state_select_template(context);
				}
				return markup;
			},
			"EvaluateFieldCompleteness": function ($element, toggleCompleteClass) {
				var $element_label = $element.siblings("label");

				if ($element_label !== undefined && $element_label.length > 0) {
					if ($element.val() !== "") {
						if (toggleCompleteClass) {
							$element.addClass("complete");
						}
						$element.siblings("label").addClass("notempty");
					}
					else {
						if (toggleCompleteClass) {
							
							$element.removeClass("complete");
						}
						$element.siblings("label").removeClass("notempty");
					}
				}
			},
			"InitAutoComplete": function ($select_element, on_select) {
				var $autocomplete_field = undefined,
					required = $select_element.hasClass(Checkout.Settings.Shared.required_class);

				// Remove existing autocomplete fields
				$select_element.siblings(".show-all").remove();
				$select_element.siblings("input.autocomplete").remove();
				$select_element.siblings("label").removeClass("notempty");

				$select_element.selectToAutocomplete({
					"remove-valueless-options": false,
					"copy-attributes-to-text-field": false,
					"input_class": required ? Checkout.Settings.Shared.required_class : "" + " text-input",
					"appendTo": $select_element.parent()
				});
				$autocomplete_field = $select_element.siblings("input.autocomplete");

				if (on_select !== undefined) {
					$autocomplete_field.on("autocompleteselect", function (event, ui) {
						on_select();
					});
				}
				$autocomplete_field.next().attr("for", $autocomplete_field.attr("id"));
				$autocomplete_field.on("blur", function () {
					Checkout.Functions.Shared.EvaluateFieldCompleteness($(this), false);
				});
				if (required) {
					Checkout.Fields.Shared.$required_fields = Checkout.Fields.Shared.$required_fields.add($autocomplete_field);
				}
				return $autocomplete_field;
			},
			"EvaluateAddressFormCompleteness": function ($required_address_inputs, $save_address_button) {
				var isFormComplete = true;

				$required_address_inputs.each(function () {
					var $this = $(this);
					if ($this.is(":visible") && !$this.hasClass(Checkout.Settings.Shared.complete_class)) {
						isFormComplete = false;
						return false;
					}
				});
				if (isFormComplete) {
					$save_address_button.removeAttr("disabled");
				}
				else {
					$save_address_button.attr("disabled", "disabled");
				}
			},
			"GetDecimal": function (number) {
				/// <summary>Converts a string to a decimal (2 places).</summary>
				/// <param name="number" type="String">The string to convert.</param>
				/// <returns type="Decimal" />
				return parseFloat(Math.round(number * 100) / 100);
			},
			"ValidateForm": function () {
				var isValid = true;

				switch (Checkout.Fields.Shared.$step_current.attr("id")) {
					case Checkout.Settings.Shared.shipping_address_step_id:

						break;
					case Checkout.Settings.Shared.shipping_option_step_id:
						break;
					case Checkout.Settings.Shared.billing_step_id:
						break;
					case Checkout.Settings.Shared.review_step_id:
						break;
					case Checkout.Settings.Shared.confirmation_step_id:
						break;
				}
				return isValid;
			},
			"ValidateFormRequiredFields": function ($form, $required_inputs) {
				var isFormValid = true,
					isFieldValid = true,
					errorDetails = "";

				if ($form.is(":visible")) {
					$required_inputs.each(function (index) {
						isFieldValid = Checkout.Functions.Shared.ValidateRequiredField($(this));
						if (!isFieldValid) {
							isFormValid = false;
						}
					});
					if (!isFormValid) {
						Checkout.Functions.Shared.SetRequiredFieldErrorMarkup($required_inputs.filter(".error"));
					}
				}

				if (isFormValid && Checkout.Fields.Shared.$required_field_error !== undefined) {
					Checkout.Fields.Shared.$required_field_error.remove();
				}

				return isFormValid;
			},
			"SetRequiredFieldErrorMarkup": function ($error_fields) {
				var error = {
					"message": "All required fields must be completed prior to proceeding to the next step.",
					"detail_message": "Please complete the following fields:",
					"field_names": []
				}

				$error_fields.each(function (index) {
					error.field_names.push($(this).next().text());
				});

				Checkout.Fields.Shared.$required_field_error = $(Checkout.Settings.Shared.error_item_template(error));
				Checkout.Fields.Shared.$error_container.append(Checkout.Fields.Shared.$required_field_error).slideDown(Checkout.Settings.Shared.easing_duration).animatedScroll();
			},
			"ValidateRequiredField": function ($element) {
				var isValid = true,
					$error_element = $element.siblings(".error"),
					$element_label = $element.siblings("label"),
					masked_text = $element.attr("data-masked-text");
				if ($element.is(":visible") && ($element.val() === "" || $element.val() === masked_text)) {
					isValid = false;
					$element.removeClass(Checkout.Settings.Shared.success_class).removeClass(Checkout.Settings.Shared.complete_class).addClass(Checkout.Settings.Shared.error_class).one("keydown change", function () {
						var $this = $(this);
						setTimeout(function () {
							Checkout.Functions.Shared.ValidateRequiredField($this);
						}, 50);
					});
					if ($error_element === undefined || $error_element.length === 0) {
						$error_element = $("<div style='display:none;' class='error'>" + $element_label.text() + " is required</div>");
						$element.parent().append($error_element);
					}
					$error_element.slideDown(Checkout.Settings.Shared.easing_duration);
				}
				else {
					if ($element.hasClass(Checkout.Settings.Shared.error_class)) {
						$element.removeClass(Checkout.Settings.Shared.error_class).addClass(Checkout.Settings.Shared.success_class);
					}
					$element.addClass(Checkout.Settings.Shared.complete_class);
					if ($.inArray($element.attr("id"), Checkout.Settings.Shared.required_field_slide_up_exceptions) === -1) {
						$error_element.slideUp(Checkout.Settings.Shared.easing_duration);
					}
				}
				return isValid;
			},
			"IsErrorPanelHidden": function () {
				if (Checkout.Fields.Shared.$error_container.is(":visible")) {
					return false;
				}
				else {
					return true;
				}
			},
			"HideErrorPanel": function () {
				if (Checkout.Fields.Shared.$error_container.children().length === 0) {
					Checkout.Fields.Shared.$error_container.hide();
				}
			},
			"BindEvents_Window": function () {
				$(window).bind('hashchange', function (e) {
					var step = e.fragment.replace(Checkout.Settings.Shared.step_url_prefix, ""),
						previousStep = e.originalEvent !== undefined ? jQuery.param.fragment(e.originalEvent.oldURL).replace(Checkout.Settings.Shared.step_url_prefix, "") : undefined,
						stepNumber = jQuery.inArray(step, Checkout.Settings.Shared.steps);

					if (previousStep !== undefined && previousStep.indexOf("-modal") > -1) {
						// If coming from a modal we need to manually set the step sequence.
						jQuery.bbq.pushState("#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.attr("id"), 2);
						$(window).trigger('hashchange');
					}
						// Check if the hash is a step
					else if (stepNumber > -1) {
						Checkout.Fields.Shared.$step_previous = previousStep !== undefined ? $("#" + previousStep) : undefined;
						Checkout.Fields.Shared.$step_current = $("#" + step);
						if (previousStep == Checkout.Settings.Shared.confirmation_step_id) {
							location.reload();
						}
						else {
							Checkout.Functions.Shared.InitCurrentStep(step);
						}
					}
				});
			},
			"BindEvents_Document": function () {
				$(document).ready(function () {
					Checkout.Functions.Shared.GetFields();
					Checkout.Functions.Shared.BindUIElements();
					Checkout.Functions.ShippingAddress.InitializeCountryDropdown();
					Checkout.Functions.BillingInfo.InitializeCountryDropdown();
					Checkout.Functions.Shared.GetDynamicFields();
					Checkout.Functions.Shared.WireEvents();
					if (Checkout.Settings.Shared.mode == "new") {
						Checkout.Functions.Shared.ConfigureNewUserVersion();
					}
					else {
						Checkout.Functions.Shared.InitializeAddressData();
						Checkout.Functions.BillingInfo.InitializeCreditCardData();
					}
					Checkout.Functions.Shared.UpdateOrderTotal();
					Checkout.Fields.BillingInfo.$input_cc_expiration.mask("99/99");
					Checkout.Fields.BillingInfo.$input_cc_number.mask("9999-9999-9999-9999");
					jQuery.bbq.pushState("#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.attr("id"), 2);
					$(window).trigger('hashchange');
				});
			},
			"BindEvents_FormInputs": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$form_inputs = $(Checkout.Fields.Shared.$form_inputs.selector);
				}
				Checkout.Fields.Shared.$form_inputs.on("keydown", function () {
					var $this = $(this);
					setTimeout(function () {
						Checkout.Functions.Shared.EvaluateFieldCompleteness($this, true);
					}, 25);
				});
			},
			"BindEvents_RequiredFields": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$required_fields = $("." + Checkout.Settings.Shared.required_class);
				}

				Checkout.Fields.Shared.$required_fields.on("blur", function () {
					Checkout.Functions.Shared.ValidateRequiredField($(this));
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
					var currentStepHref = "#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.attr("id"),
						isValid = true,
						errorDetails = "";

					switch (Checkout.Fields.Shared.$step_current.attr("id")) {
						case Checkout.Settings.Shared.shipping_address_step_id:
							if (Checkout.Fields.ShippingAddress.$new_address_form.is(":visible")) {
								Checkout.Fields.ShippingAddress.$btnsave_address.trigger("click");
							}
							break;
						case Checkout.Settings.Shared.shipping_option_step_id:
							break;
						case Checkout.Settings.Shared.billing_step_id:
							if (Checkout.Fields.BillingInfo.$credit_card_form.is(":visible")) {
								Checkout.Fields.BillingInfo.$btnsave_credit_card.trigger("click");
							}
							if (Checkout.Fields.BillingInfo.$billing_address_form.is(":visible")) {
								Checkout.Fields.BillingInfo.$btnsave_address.trigger("click");
							}
							break;
						case Checkout.Settings.Shared.review_step_id:
							break;
						case Checkout.Settings.Shared.confirmation_step_id:
							break;
					}

					isValid = Checkout.Functions.Shared.ValidateForm();
					if (isValid && Checkout.Settings.ShippingAddress.is_step_valid && Checkout.Settings.BillingInfo.is_step_valid) {
						// Mark the current step as completed
						Checkout.Fields.Shared.$progress_bar_items.filter("[href=" + currentStepHref + "]").parent().addClass("completed");
						// Progress to the next step
						jQuery.bbq.pushState("#" + Checkout.Settings.Shared.step_url_prefix + Checkout.Fields.Shared.$step_current.next().attr("id"), 2);
						// Mark the new step as active.
					}
				});
			},
			"BindEvents_ProgressBarItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Shared.$progress_bar_items = $(Checkout.Fields.Shared.$progress_bar_items.selector);
				}

				Checkout.Fields.Shared.$progress_bar_items.on("click", function (e) {
					var $parent = $(this).parent();
					if ($parent.hasClass("active") || $parent.hasClass("completed")) {
						Checkout.Functions.Shared.SetActiveProgressBarItem($parent);
					}
					else {
						e.preventDefault();
					}
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
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing_duration
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
					toggle_self: false
				});
			},
			"BindEvents_AddressItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$address_items = $(Checkout.Fields.ShippingAddress.$address_items.selector);
				}
				if (Checkout.Fields.ShippingAddress.$address_items !== undefined) {
					Checkout.Fields.ShippingAddress.$address_items.on("click", function () {
						Checkout.Functions.ShippingAddress.EvaluateSelectedAddress($(this).parent());
					}).toggleContainer({
						content_element: Checkout.Fields.ShippingAddress.$new_address_form,
						toggle_self: false,
						force_state: "hide"
					}).toggleContainer({
						content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
						toggle_self: false,
						force_state: "show",
						toggle_condition: function () {
							if (Checkout.Fields.ShippingAddress.$btnchangeaddress.is(":visible")) {
								return false;
							}
							else {
								return true;
							}
						}
					});
				}
			},
			"BindEvents_AddAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btnadd_address = $(Checkout.Fields.ShippingAddress.$btnadd_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btnadd_address.toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing_duration,
					pre_logic: function () {
						Checkout.Fields.ShippingAddress.$address_items.removeAttr("checked");
						Checkout.Functions.ShippingAddress.ResetAddressForm();
						Checkout.Functions.ShippingAddress.ToggleAddressFormMode("new");
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
				if (Checkout.Fields.ShippingAddress.$btnedit_address !== undefined) {
					Checkout.Fields.ShippingAddress.$btnedit_address.on("click", function (e) {
						var $this = $(this),
							$parent = $this.parent().parent(),
							data = Checkout.Functions.Shared.GetAddressById($parent.data("addressId"));
						e.stopPropagation();
						$parent.find("input[type=radio]").attr("checked", "checked");
						// Hide the new address button
						Checkout.Fields.ShippingAddress.$btnadd_address.slideUp(Checkout.Settings.Shared.easing_duration - 200);
						// Set the input values
						Checkout.Fields.ShippingAddress.$input_country.val(data.country_code);
						Checkout.Fields.ShippingAddress.$autocomplete_county.val(Checkout.Fields.ShippingAddress.$input_country.find(":selected").text());
						Checkout.Fields.ShippingAddress.$input_name.val(data.name);
						Checkout.Fields.ShippingAddress.$input_company.val(data.company);
						Checkout.Fields.ShippingAddress.$input_street.val(data.street);
						Checkout.Fields.ShippingAddress.$input_city.val(data.city);
						Checkout.Functions.ShippingAddress.InitializeStateField();
						if ($.inArray(data.country_code, Checkout.Settings.Shared.countries_with_states) !== -1) {
							Checkout.Fields.ShippingAddress.$input_state_select.val(data.state);
							Checkout.Fields.ShippingAddress.$autocomplete_state.val(Checkout.Fields.ShippingAddress.$input_state_select.find("[value=" + Checkout.Fields.ShippingAddress.$input_state_select.val() + "]").text());
						}
						else {
							Checkout.Fields.ShippingAddress.$input_state.val(data.state);
						}
						Checkout.Fields.ShippingAddress.$input_postal.val(data.postal);
						Checkout.Fields.ShippingAddress.$input_phone.val(data.phone);
						Checkout.Fields.ShippingAddress.$address_inputs.each(function () {
							var $this = $(this);
							if ($this.hasClass(Checkout.Settings.Shared.required_class)) {
								Checkout.Functions.Shared.ValidateRequiredField($this);
							}
							Checkout.Functions.Shared.EvaluateFieldCompleteness($this, true);
						});
						Checkout.Fields.ShippingAddress.$secondary_fields.css("display", "");
						Checkout.Fields.ShippingAddress.$btnsave_address.removeAttr("disabled");
						// Display the address form
						Checkout.Functions.ShippingAddress.ToggleAddressFormMode("edit");
						Checkout.Fields.ShippingAddress.$new_address_form.slideDown(Checkout.Settings.Shared.easing_duration, function () {
							Checkout.Fields.ShippingAddress.$new_address_form.animatedScroll();
						});
						return false;
					});
				}
			},
			"BindEvents_CancelAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btncancel_address = $(Checkout.Fields.ShippingAddress.$btncancel_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btncancel_address.on("click", function () {
					if (Checkout.Fields.ShippingAddress.$additional_addresses.is(":visible")) {
						Checkout.Fields.ShippingAddress.$btnadd_address.slideDown(Checkout.Settings.Shared.easing_duration - 200);
					}
				}).toggleContainer({
					toggle_condition: function () {
						if (Checkout.Fields.ShippingAddress.$btnchangeaddress.is(":visible")) {
							return false;
						}
						else {
							return true;
						}
					},
					content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
					delay: Checkout.Settings.Shared.easing_duration - 200,
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					toggle_self: false,
					pre_logic: function () {
						// Scroll to the progress bar
						Checkout.Fields.Shared.$progress_bar.animatedScroll();
					},
					post_toggle: function () {
						Checkout.Functions.ShippingAddress.ResetAddressForm();
						Checkout.Settings.ShippingAddress.is_step_valid = Checkout.Functions.ShippingAddress.ValidateAddressForm();
						$(Checkout.Fields.ShippingAddress.$address_items[0]).trigger("click");
					}
				});
			},
			"BindEvents_SaveAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$btnsave_address = $(Checkout.Fields.ShippingAddress.$btnsave_address.selector);
				}
				Checkout.Fields.ShippingAddress.$btnsave_address.on("click", function () {
					Checkout.Settings.ShippingAddress.is_step_valid = Checkout.Functions.ShippingAddress.ValidateAddressForm();
					if (Checkout.Settings.ShippingAddress.is_step_valid) {
						Checkout.Functions.Shared.HideErrorPanel();
					}
				}).toggleContainer({
					toggle_condition: function () {
						if (Checkout.Fields.Shared.$error_container.is(":visible") || Checkout.Fields.ShippingAddress.$btnchangeaddress.is(":visible")) {
							return false;
						}
						else {
							return true;
						}
					},
					content_element: Checkout.Fields.ShippingAddress.$btnadd_address,
					delay: Checkout.Settings.Shared.easing_duration - 200,
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$new_address_form,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					toggle_self: false,
					force_state: "hide",
					pre_logic: function () {
						if (Checkout.Fields.ShippingAddress.$new_address_form.attr("data-mode") == "new") {
							Checkout.Functions.ShippingAddress.CreateNewAddressElement();
						}
						else {
							Checkout.Functions.ShippingAddress.EditAddressElement();
						}
					},
					post_toggle: function () {
						Checkout.Fields.ShippingAddress.$btncancel_address.removeAttr("disabled");
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
				Checkout.Fields.ShippingAddress.$input_country.on("change", Checkout.Functions.ShippingAddress.InitializeStateField).toggleContainer({
					content_element: Checkout.Fields.ShippingAddress.$secondary_fields,
					refresh_element: true,
					firing_events: "change",
					force_state: "show",
					toggle_self: false
				})
			},
			"BindEvents_RequiredAddressFields": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingAddress.$required_address_inputs = $(Checkout.Fields.ShippingAddress.$required_address_inputs.selector);
				}
				Checkout.Fields.ShippingAddress.$required_address_inputs.on("keydown", function () {
					setTimeout(function () {
						Checkout.Functions.Shared.EvaluateAddressFormCompleteness(Checkout.Fields.ShippingAddress.$required_address_inputs, Checkout.Fields.ShippingAddress.$btnsave_address);
					}, 50);
				});
			},
			"EvaluateSelectedAddress": function ($address) {
				var $state = $address.find("span.state");

				if ($state.text() == "PA") {
					Checkout.Data.checkout_details.tax_rate = .06;
				}
				else {
					Checkout.Data.checkout_details.tax_rate = 0;
				}
				Checkout.Functions.ShippingAddress.UpdateShippingAddressData($address);
				Checkout.Functions.Review.RefreshOrderReviewSelectionData();
				Checkout.Functions.Shared.UpdateOrderTotal();
			},
			"ToggleAddressFormMode": function (mode) {
				// Set the mode on the form
				Checkout.Fields.ShippingAddress.$new_address_form.attr("data-mode", mode);
				if (mode == "edit") {
					// Set form title text
					Checkout.Fields.ShippingAddress.$new_address_form_title.text(Checkout.Fields.ShippingAddress.$new_address_form_title.attr("data-edit-text"));
				}
				else {
					Checkout.Fields.ShippingAddress.$new_address_form_title.text(Checkout.Fields.ShippingAddress.$new_address_form_title.attr("data-new-text"));
				}
			},
			"CreateNewAddressElement": function () {
				var $newAddress,
					new_address_data = {},
					id = Checkout.Data.addresses.length === 0 ? 1 : Checkout.Data.addresses[Checkout.Data.addresses.length - 1].id + 1,
					name = Checkout.Fields.ShippingAddress.$input_name.val(),
					company = Checkout.Fields.ShippingAddress.$input_company.val(),
					street = Checkout.Fields.ShippingAddress.$input_street.val(),
					city = Checkout.Fields.ShippingAddress.$input_city.val(),
					postal = Checkout.Fields.ShippingAddress.$input_postal.val(),
					country_code = Checkout.Fields.ShippingAddress.$input_country.val(),
					country_name = Checkout.Fields.ShippingAddress.$input_country.find("option:selected").text(),
					state = ($.inArray(country_code, Checkout.Settings.Shared.countries_with_states) !== -1) ? Checkout.Fields.ShippingAddress.$input_state_select.val() : Checkout.Fields.ShippingAddress.$input_state.val(),
					phone = Checkout.Fields.ShippingAddress.$input_phone.val(),
					addresses_to_add = [];

				new_address_data = {
					"id": id,
					"name": name,
					"company": company,
					"street": street,
					"city": city,
					"state": state,
					"postal": postal,
					"country_code": country_code,
					"country_name": country_name,
					"phone": phone,
					"default_shipping": Checkout.Data.addresses.length === 0 ? true : false,
					"default_billing": Checkout.Data.addresses.length === 0 ? true : false
				};
				Checkout.Data.addresses.push(new_address_data);
				addresses_to_add.push(new_address_data);
				$newAddress = $(Checkout.Settings.Shared.addresses_template(addresses_to_add));
				$newAddress.data("addressId", id);
				$newAddress.find("span.btn").addClass("shiptothis");
				Checkout.Fields.ShippingAddress.$address_list.append($newAddress);
				Checkout.Functions.ShippingAddress.BindEvents_AddressItems(true);
				Checkout.Functions.ShippingAddress.BindEvents_EditAddressButton(true);
				$newAddress.find("input[type=radio]").trigger("click");
				if (new_address_data.default_billing) {
					Checkout.Fields.BillingInfo.$card_billing_address_container.html($newAddress.find(".address")[0].outerHTML).find(".address").prepend("<span class='label'>Billing Address:</span>");
				}
			},
			"EditAddressElement": function () {
				var $address_input = Checkout.Fields.ShippingAddress.$address_items.filter("[checked]"),
					$address_element = $address_input.parent(),
					id = $address_element.data("addressId"),
					name = Checkout.Fields.ShippingAddress.$input_name.val(),
					company = Checkout.Fields.ShippingAddress.$input_company.val(),
					street = Checkout.Fields.ShippingAddress.$input_street.val(),
					city = Checkout.Fields.ShippingAddress.$input_city.val(),
					postal = Checkout.Fields.ShippingAddress.$input_postal.val(),
					country_code = Checkout.Fields.ShippingAddress.$input_country.val(),
					country_name = Checkout.Fields.ShippingAddress.$input_country.find("option:selected").text(),
					state = ($.inArray(country_code, Checkout.Settings.Shared.countries_with_states) !== -1) ? Checkout.Fields.ShippingAddress.$input_state_select.val() : Checkout.Fields.ShippingAddress.$input_state.val(),
					phone = Checkout.Fields.ShippingAddress.$input_phone.val(),
					addressData = {
						"id": id,
						"name": name,
						"company": company,
						"street": street,
						"city": city,
						"state": state,
						"postal": postal,
						"country_code": country_code,
						"country_name": country_name,
						"phone": phone
					};

				// Update the address data and markup
				Checkout.Functions.Shared.UpdateAddress(addressData, $address_element, "shipping");
				$address_input.trigger("click");
			},
			"UpdateShippingAddressData": function (selected_address) {
				var data = Checkout.Functions.Shared.GetAddressById(selected_address.data("addressId"));

				Checkout.Data.checkout_details.shipping_address.name = data.name;
				Checkout.Data.checkout_details.shipping_address.company = data.company;
				Checkout.Data.checkout_details.shipping_address.street = data.street;
				Checkout.Data.checkout_details.shipping_address.city = data.city;
				Checkout.Data.checkout_details.shipping_address.state = data.state;
				Checkout.Data.checkout_details.shipping_address.postal_code = data.postal;
				Checkout.Data.checkout_details.shipping_address.country = data.country_name;
				Checkout.Data.checkout_details.shipping_address.phone_number = data.phone;
			},
			"ResetAddressForm": function () {
				Checkout.Fields.ShippingAddress.$input_country.val("");
				if (Checkout.Fields.ShippingAddress.$autocomplete_county !== undefined) {
					Checkout.Fields.ShippingAddress.$autocomplete_county.val("");
				}
				Checkout.Fields.ShippingAddress.$input_name.val("");
				Checkout.Fields.ShippingAddress.$input_company.val("");
				Checkout.Fields.ShippingAddress.$input_street.val("");
				Checkout.Fields.ShippingAddress.$input_city.val("");
				Checkout.Fields.ShippingAddress.$input_state.val("");
				Checkout.Fields.ShippingAddress.$input_state_select.val("");
				if (Checkout.Fields.ShippingAddress.$autocomplete_state !== undefined) {
					Checkout.Fields.ShippingAddress.$autocomplete_state.val("");
				}
				Checkout.Fields.ShippingAddress.$input_postal.val("");
				Checkout.Fields.ShippingAddress.$input_phone.val("");
				Checkout.Fields.ShippingAddress.$required_address_inputs.removeClass(Checkout.Settings.Shared.error_class).removeClass(Checkout.Settings.Shared.complete_class);
				Checkout.Fields.ShippingAddress.$address_inputs.each(function () {
					Checkout.Functions.Shared.EvaluateFieldCompleteness($(this), false);
				});
				Checkout.Fields.ShippingAddress.$secondary_fields.css("display", "none");
			},
			"ValidateAddressForm": function () {
				return Checkout.Functions.Shared.ValidateFormRequiredFields(Checkout.Fields.ShippingAddress.$new_address_form, Checkout.Fields.ShippingAddress.$required_address_inputs);
			},
			"InitializeCountryDropdown": function () {
				Checkout.Fields.ShippingAddress.$autocomplete_county = Checkout.Functions.Shared.InitAutoComplete(Checkout.Fields.ShippingAddress.$input_country, function () {
					Checkout.Fields.ShippingAddress.$autocomplete_county.trigger("change");
				});
				Checkout.Fields.Shared.$form_inputs = Checkout.Fields.Shared.$form_inputs.add(Checkout.Fields.ShippingAddress.$autocomplete_county);
				Checkout.Fields.ShippingAddress.$address_inputs = Checkout.Fields.ShippingAddress.$address_inputs.add(Checkout.Fields.ShippingAddress.$autocomplete_county);
			},
			"InitializeStateField": function () {
				var country_code = Checkout.Fields.ShippingAddress.$input_country.val();

				if ($.inArray(country_code, Checkout.Settings.Shared.countries_with_states) !== -1) {
					// Hide the standard state input
					Checkout.Fields.ShippingAddress.$input_state.parent().removeClass(Checkout.Settings.Shared.secondary_field_class).hide();
					// Populate the state drop down field with the states for the current country.
					Checkout.Fields.ShippingAddress.$input_state_select.replaceWith(Checkout.Functions.Shared.GetStateSelectElement(Checkout.Fields.ShippingAddress.$input_state_select, country_code));
					// Refresh the state drop down variable
					Checkout.Fields.ShippingAddress.$input_state_select = $(Checkout.Fields.ShippingAddress.$input_state_select.selector);
					// Make the state drop down field an auto-complete field.
					Checkout.Fields.ShippingAddress.$autocomplete_state = Checkout.Functions.Shared.InitAutoComplete(Checkout.Fields.ShippingAddress.$input_state_select, function () {
						setTimeout(function () {
							Checkout.Fields.ShippingAddress.$autocomplete_state.addClass(Checkout.Settings.Shared.complete_class);
							Checkout.Functions.Shared.ValidateRequiredField(Checkout.Fields.ShippingAddress.$autocomplete_state);
							Checkout.Functions.Shared.EvaluateAddressFormCompleteness(Checkout.Fields.ShippingAddress.$required_address_inputs, Checkout.Fields.ShippingAddress.$btnsave_address);
						}, 50);
					});
					// Add the new auto-complete input to the collection of form inputs
					Checkout.Fields.Shared.$form_inputs = Checkout.Fields.Shared.$form_inputs.add(Checkout.Fields.ShippingAddress.$autocomplete_state);
					// Add the new auto-complete input to the collection of address inputs
					Checkout.Fields.ShippingAddress.$address_inputs = Checkout.Fields.ShippingAddress.$address_inputs.add(Checkout.Fields.ShippingAddress.$autocomplete_state);
					// Make the state select drop down required, and it's container the displayed field.
					Checkout.Fields.ShippingAddress.$input_state_select.addClass(Checkout.Settings.Shared.required_class).parent().addClass(Checkout.Settings.Shared.secondary_field_class);
				}
				else {
					// Hide the state select field and make it optional.
					Checkout.Fields.ShippingAddress.$input_state_select.removeClass(Checkout.Settings.Shared.required_class).parent().removeClass(Checkout.Settings.Shared.secondary_field_class).hide();
					// Make the standard not-required state input visible
					Checkout.Fields.ShippingAddress.$input_state.parent().addClass(Checkout.Settings.Shared.secondary_field_class);
				}
				Checkout.Fields.ShippingAddress.$secondary_fields = $(Checkout.Fields.ShippingAddress.$secondary_fields.selector);
				// Re-bind applicable events
				Checkout.Functions.Shared.BindEvents_FormInputs(false);
				Checkout.Functions.Shared.BindEvents_RequiredFields(true);
				Checkout.Functions.ShippingAddress.BindEvents_RequiredAddressFields(true);
			},
		},
		"ShippingOption": {
			"BindEvents_ShippingOptionItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.ShippingMethod.$shipping_option_items = $(Checkout.Fields.ShippingMethod.$shipping_option_items.selector);
				}

				Checkout.Fields.ShippingMethod.$shipping_option_items.on("click", function () {
					var $option = $(this).parent(),
						$price = $option.find(".price"),
						$carrier = $option.find(".carrier"),
						$method = $option.find(".method"),
						$delivery_date = $option.find(".delivery-date");

					Checkout.Data.checkout_details.shipping_amount = Checkout.Functions.Shared.GetDecimal($price.text().replace("$", ""));
					Checkout.Data.checkout_details.shipping_option.carrier = $carrier.text();
					Checkout.Data.checkout_details.shipping_option.delivery_date = $delivery_date.text();
					Checkout.Data.checkout_details.shipping_option.option = $method.text();
					Checkout.Functions.Review.RefreshOrderReviewSelectionData();
					Checkout.Functions.Shared.UpdateOrderTotal();
				});
			}
		},
		"BillingInfo": {
			"BindEvents_PromoCodeButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnpromo_code = $(Checkout.Fields.BillingInfo.$btnpromo_code.selector);
				}
				Checkout.Fields.BillingInfo.$btnpromo_code.on("click", function () {
					var $this = $(this),
						mode = $this.text(),
						promoVal = Checkout.Fields.BillingInfo.$input_promo_code.val().toUpperCase(),
						applyMode = $this.attr("data-text"),
						unapplyMode = $this.attr("data-text-alt");
					if (mode == applyMode) {
						Checkout.Fields.BillingInfo.$promo_error.fadeOut(Checkout.Settings.Shared.easing_duration - 200).html("");
						if (promoVal === "10HDBUCKS") {
							Checkout.Fields.BillingInfo.$promo_code_form.removeClass("error").addClass("success");
							Checkout.Data.checkout_details.promo_code = promoVal;
							Checkout.Data.checkout_details.promo_amount = 10.00;
							$this.text(unapplyMode);
							Checkout.Fields.BillingInfo.$input_promo_code.fadeOut(Checkout.Settings.Shared.easing_duration - 200).val("").next().hide();
							Checkout.Fields.BillingInfo.$promo_details.html("Promo code <span>" + promoVal + "</span> has been applied to your order. You saved: $10.00");
							Checkout.Fields.BillingInfo.$promo_details.fadeIn(Checkout.Settings.Shared.easing_duration - 200);
						}
						else {
							Checkout.Fields.BillingInfo.$promo_code_form.removeClass("success").addClass("error");
							Checkout.Fields.BillingInfo.$promo_error.html("Promo code <span>" + promoVal + "</span> is no longer available for use.");
							Checkout.Fields.BillingInfo.$promo_error.fadeIn(Checkout.Settings.Shared.easing_duration - 200);
						}
					}
					else {
						Checkout.Fields.BillingInfo.$promo_code_form.removeClass("error success");
						Checkout.Data.checkout_details.promo_code = "";
						Checkout.Data.checkout_details.promo_amount = 0.00;
						$this.text(applyMode);
						Checkout.Fields.BillingInfo.$promo_details.html("")
						Checkout.Fields.BillingInfo.$promo_details.fadeOut(Checkout.Settings.Shared.easing_duration - 200);
						Checkout.Fields.BillingInfo.$input_promo_code.val("").fadeIn(Checkout.Settings.Shared.easing_duration - 200).next().removeClass("notempty").show();
					}
					Checkout.Functions.Shared.UpdateOrderTotal();
				});
			},
			"BindEvents_CreditCardOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$payment_option_credit_card = $(Checkout.Fields.BillingInfo.$payment_option_credit_card.selector);
				}
				Checkout.Fields.BillingInfo.$payment_option_credit_card.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$paypal_container,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					toggle_condition: function () {
						if (Checkout.Fields.BillingInfo.$credit_cards.length === 0) {
							return false;
						}
						else {
							return true;
						}
					},
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					toggle_condition: function () {
						if (Checkout.Fields.BillingInfo.$credit_cards.length === 0) {
							return true;
						}
						else {
							return false;
						}
					},
					force_state: "show",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					toggle_condition: function () {
						if (Checkout.Fields.BillingInfo.$credit_cards.length === 0) {
							return false;
						}
						else {
							return true;
						}
					},
					force_state: "show",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_list,
					force_state: "show",
					toggle_self: false
				});
			},
			"BindEvents_PayPalOptionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$payment_option_paypal = $(Checkout.Fields.BillingInfo.$payment_option_paypal.selector);
				}
				Checkout.Fields.BillingInfo.$payment_option_paypal.on("click", function () {
					Checkout.Data.checkout_details.billing_method = "PayPal";
					Checkout.Data.checkout_details.billing_address.name = "Ethan Koser";
					Checkout.Data.checkout_details.billing_address.company = "";
					Checkout.Data.checkout_details.billing_address.street = "123 A street";
					Checkout.Data.checkout_details.billing_address.city = "Mobile";
					Checkout.Data.checkout_details.billing_address.state = "AK";
					Checkout.Data.checkout_details.billing_address.postal_code = "88739";
					Checkout.Data.checkout_details.billing_address.country = "United States";
					Checkout.Data.checkout_details.billing_address.phone_number = "+1-222-333-4567";
					Checkout.Functions.Review.RefreshOrderReviewSelectionData();
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
					toggle_self: false
				});
			},
			"BindEvents_CreateCreditCardButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btncreate_credit_card = $(Checkout.Fields.BillingInfo.$btncreate_credit_card.selector);
				}

				Checkout.Fields.BillingInfo.$btncreate_credit_card.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "show",
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing_duration,
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

				Checkout.Fields.BillingInfo.$btnsave_credit_card.on("click", function () {
					Checkout.Settings.BillingInfo.is_credit_card_valid = Checkout.Functions.BillingInfo.ValidateCreditCardForm();
					if (!Checkout.Settings.BillingInfo.is_credit_card_valid || !Checkout.Settings.BillingInfo.is_address_valid) {
						Checkout.Settings.BillingInfo.is_step_valid = false;
					}
					else {
						Checkout.Settings.BillingInfo.is_step_valid = true;
						Checkout.Functions.Shared.HideErrorPanel();
						if (Checkout.Fields.BillingInfo.$credit_card_form.attr("data-mode") == "new") {
							Checkout.Functions.BillingInfo.CreateNewCreditCardElement();
						}
						else {
							Checkout.Functions.BillingInfo.UpdateCreditCardElement();
						}
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					toggle_self: false,
					delay: Checkout.Settings.Shared.easing_duration - 200,
					post_toggle: function () {
						var $checked = Checkout.Fields.BillingInfo.$credit_card_list.find("input:checked");
						if ($checked !== undefined && $checked.length > 0) {
							$checked.animatedScroll();
						}
						else {
							Checkout.Fields.BillingInfo.$credit_card_list.find(".edit-mode").animatedScroll();
						}
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					post_toggle: function () {
						if (Checkout.Data.credit_cards.length > 0) {
							Checkout.Fields.BillingInfo.$btncancel_credit_card.removeAttr("disabled");
						}
					},
					toggle_self: false,
					force_state: "hide"
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					force_state: "hide",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					force_state: "show",
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
					delay: Checkout.Settings.Shared.easing_duration - 200,
					post_toggle: function () {
						var $selectedCard = undefined;
						$selectedCard = Checkout.Fields.BillingInfo.$credit_card_list.find("input[type=radio]:checked");
						if ($selectedCard !== undefined && $selectedCard.length > 0) {
							$selectedCard.parent().animatedScroll();
						}
						else {
							Checkout.Fields.BillingInfo.$credit_card_list.animatedScroll();
						}
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$credit_card_form,
					force_state: "hide",
					toggle_self: false
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
				if (Checkout.Fields.BillingInfo.$btnedit_credit_card !== undefined) {
					Checkout.Fields.BillingInfo.$btnedit_credit_card.on("click", function (e) {
						var $parent = $(this).parent().parent(),
							$radioBtn = $parent.find("input[type=radio]");

						e.stopPropagation();
						$parent.parent().find("li").removeClass("edit-mode").find("input[type=radio]").removeAttr("checked");
						$parent.addClass("edit-mode");
						if ($radioBtn.attr("disabled") === undefined) {
							$radioBtn.attr("checked", "checked");
						}
						Checkout.Fields.BillingInfo.$btncreate_credit_card.slideUp(Checkout.Settings.Shared.easing_duration - 200);
						Checkout.Functions.BillingInfo.ToggleCreditCardFormMode("edit");
						Checkout.Functions.BillingInfo.PopulateEditCardForm($parent);
						// Display the credit card form
						Checkout.Fields.BillingInfo.$btnchange_billing_address.show();
						Checkout.Fields.BillingInfo.$credit_card_form.slideDown(Checkout.Settings.Shared.easing_duration, function () {
							Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
						});
						return false;
					});
				}
			},
			"BindEvents_CreditCardItems": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$credit_cards = Checkout.Fields.BillingInfo.$credit_card_list.find(".credit-card-item input[type=radio]");
				}
				if (Checkout.Fields.BillingInfo.$credit_cards !== undefined) {
					Checkout.Fields.BillingInfo.$credit_cards.on("click", function (e) {
						var $parent = $(this).parent();
						e.stopPropagation();
						Checkout.Data.checkout_details.billing_method = "Credit Card";
						Checkout.Functions.BillingInfo.UpdateCreditCardData($parent.find(".credit-card"));
						Checkout.Functions.BillingInfo.UpdateBillingAddressData($parent);
						Checkout.Functions.Review.RefreshOrderReviewSelectionData();
					}).toggleContainer({
						content_element: Checkout.Fields.BillingInfo.$btncreate_credit_card,
						force_state: "show",
						toggle_self: false,
						delay: Checkout.Settings.Shared.easing_duration - 200
					}).toggleContainer({
						content_element: Checkout.Fields.BillingInfo.$credit_card_form,
						force_state: "hide",
						toggle_self: false
					}).toggleContainer({
						content_element: Checkout.Fields.BillingInfo.$billing_address_container,
						force_state: "hide",
						toggle_self: false
					});
				}
			},
			"BindEvents_ChangeBillingAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnchange_billing_address = $(Checkout.Fields.BillingInfo.$btnchange_billing_address.selector);
				}
				Checkout.Fields.BillingInfo.$btnchange_billing_address.toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					pre_logic: function () {
						Checkout.Fields.BillingInfo.$billing_address_items.removeAttr("checked");
						if (Checkout.Data.addresses.length > 1) {
							// TODO: Hide the address item currently associated to the credit card.

							Checkout.Fields.BillingInfo.$btnadd_billing_address.show();
							Checkout.Fields.BillingInfo.$billing_address_form.hide();
						}
						else {
							Checkout.Fields.BillingInfo.$btnadd_billing_address.hide();
							Checkout.Functions.BillingInfo.ToggleAddressFormMode("new");
							Checkout.Fields.BillingInfo.$billing_address_form.show();
						}
					},
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing_duration,
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
				if (Checkout.Fields.BillingInfo.$billing_address_items !== undefined) {
					Checkout.Fields.BillingInfo.$billing_address_items.toggleContainer({
						content_element: Checkout.Fields.BillingInfo.$btnchange_billing_address,
						pre_logic: function (self) {
							var address = Checkout.Functions.Shared.GetAddressById($(self).parent().data("addressId")),
								mu = Checkout.Functions.BillingInfo.GetCreditCardAddressMarkup(address.street, address.city, address.state, address.postal);

							Checkout.Fields.BillingInfo.$card_billing_address_container.data("addressId", address.id).html(mu);
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
				}
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
					self_toggle_delay_offset: -Checkout.Settings.Shared.easing_duration,
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
				Checkout.Fields.BillingInfo.$input_country.on("change", Checkout.Functions.BillingInfo.InitializeStateField).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$secondary_fields,
					refresh_element: true,
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
					delay: Checkout.Settings.Shared.easing_duration - 200,
					post_toggle: function () {
						// Scroll to the billing address container
						Checkout.Fields.BillingInfo.$billing_address_container.animatedScroll();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_form,
					toggle_self: false,
					pre_logic: function () {
						// Scroll to the progress bar
						Checkout.Fields.BillingInfo.$billing_address_container.animatedScroll();
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
				Checkout.Fields.BillingInfo.$btnsave_address.on("click", function () {
					Checkout.Settings.BillingInfo.is_address_valid = Checkout.Functions.BillingInfo.ValidateAddressForm();
					if (!Checkout.Settings.BillingInfo.is_credit_card_valid || !Checkout.Settings.BillingInfo.is_address_valid) {
						Checkout.Settings.BillingInfo.is_step_valid = false;
					}
					else {
						Checkout.Settings.BillingInfo.is_step_valid = true;
						Checkout.Functions.Shared.HideErrorPanel();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btnadd_billing_address,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					delay: Checkout.Settings.Shared.easing_duration - 200,
					toggle_self: false,
					pre_logic: function () {
						Checkout.Fields.BillingInfo.$credit_card_form.animatedScroll();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$btnchange_billing_address,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					delay: Checkout.Settings.Shared.easing_duration - 200,
					force_state: "show",
					toggle_self: false
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_form,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					toggle_self: false,
					force_state: "hide",
					pre_logic: function () {
						if (Checkout.Fields.BillingInfo.$billing_address_form.attr("data-mode") == "new") {
							Checkout.Functions.BillingInfo.CreateNewAddressElement();
						}
						else {
							Checkout.Functions.BillingInfo.EditAddressElement();
						}
					},
					callback: function (element, event) {
						Checkout.Functions.BillingInfo.ResetAddressForm();
					}
				}).toggleContainer({
					content_element: Checkout.Fields.BillingInfo.$billing_address_container,
					toggle_condition: Checkout.Functions.Shared.IsErrorPanelHidden,
					toggle_self: false,
					force_state: "hide"
				});
			},
			"BindEvents_EditAddressButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$btnedit_address = $(Checkout.Fields.BillingInfo.$btnedit_address.selector);
				}
				if (Checkout.Fields.BillingInfo.$btnedit_address !== undefined) {
					Checkout.Fields.BillingInfo.$btnedit_address.on("click", function (e) {
						var $this = $(this),
							addressData = Checkout.Functions.Shared.GetAddressById($this.parent().parent().data("addressId"));
						e.stopPropagation();
						$this.parent().parent().find("input[type=radio]").attr("checked", "checked");
						// Hide the new address button
						Checkout.Fields.ShippingAddress.$btnadd_address.slideUp(Checkout.Settings.Shared.easing_duration - 200);
						// Set the input values
						Checkout.Fields.BillingInfo.$input_country.val(addressData.country_code);
						Checkout.Fields.BillingInfo.$autocomplete_county.val(Checkout.Fields.BillingInfo.$input_country.find(":selected").text());
						Checkout.Fields.BillingInfo.$input_name.val(addressData.name);
						Checkout.Fields.BillingInfo.$input_company.val(addressData.company);
						Checkout.Fields.BillingInfo.$input_street.val(addressData.street);
						Checkout.Fields.BillingInfo.$input_city.val(addressData.city);
						Checkout.Functions.BillingInfo.InitializeStateField();
						if ($.inArray(addressData.country_code, Checkout.Settings.Shared.countries_with_states) !== -1) {
							Checkout.Fields.BillingInfo.$input_state_select.val(addressData.state);
							Checkout.Fields.BillingInfo.$autocomplete_state.val(Checkout.Fields.BillingInfo.$input_state_select.find("[value=" + Checkout.Fields.BillingInfo.$input_state_select.val() + "]").text());
						}
						else {
							Checkout.Fields.BillingInfo.$input_state.val(addressData.state);
						}
						Checkout.Fields.BillingInfo.$input_postal.val(addressData.postal);
						Checkout.Fields.BillingInfo.$input_phone.val(addressData.phone);
						Checkout.Fields.BillingInfo.$address_inputs.each(function () {
							var $this = $(this);
							if ($this.hasClass(Checkout.Settings.Shared.required_class)) {
								Checkout.Functions.Shared.ValidateRequiredField($this);
							}
							Checkout.Functions.Shared.EvaluateFieldCompleteness($this, true);
						});
						Checkout.Fields.BillingInfo.$secondary_fields.css("display", "");
						Checkout.Fields.BillingInfo.$btnsave_address.removeAttr("disabled");
						// Display the address form
						Checkout.Functions.BillingInfo.ToggleAddressFormMode("edit");
						Checkout.Fields.BillingInfo.$billing_address_form.slideDown(Checkout.Settings.Shared.easing_duration, function () {
							Checkout.Fields.BillingInfo.$billing_address_form.animatedScroll();
						});
						return false;
					});
				}
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
			"BindEvents_RequiredAddressFields": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$required_address_inputs = $(Checkout.Fields.BillingInfo.$required_address_inputs.selector);
				}
				Checkout.Fields.BillingInfo.$required_address_inputs.on("change", function () {
					setTimeout(function () {
						Checkout.Functions.Shared.EvaluateAddressFormCompleteness(Checkout.Fields.BillingInfo.$required_address_inputs, Checkout.Fields.BillingInfo.$btnsave_address);
					}, 50);
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
			"BindEvents_ExpirationDate": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.BillingInfo.$input_cc_expiration = $(Checkout.Fields.BillingInfo.$input_cc_expiration.selector);
				}
				Checkout.Fields.BillingInfo.$input_cc_expiration.on("keydown", function () {
					setTimeout(function () {
						Checkout.Functions.BillingInfo.ValidateExpirationDate();
					}, 50)
				}).on("change", function () {
					Checkout.Functions.BillingInfo.ValidateExpirationDate();
				});
			},
			"InitializeCreditCardData": function () {
				var $credit_cards = Checkout.Fields.BillingInfo.$credit_card_list.children();

				$credit_cards.eq(0).data("credit-card-id", 1);
				$credit_cards.eq(1).data("credit-card-id", 2);
				$credit_cards.eq(2).data("credit-card-id", 3);
			},
			"InitializeCountryDropdown": function () {
				Checkout.Fields.BillingInfo.$autocomplete_county = Checkout.Functions.Shared.InitAutoComplete(Checkout.Fields.BillingInfo.$input_country, function () {
					Checkout.Fields.BillingInfo.$autocomplete_county.trigger("change");
				});
				Checkout.Fields.Shared.$form_inputs = Checkout.Fields.Shared.$form_inputs.add(Checkout.Fields.BillingInfo.$autocomplete_county);
				Checkout.Fields.BillingInfo.$address_inputs = Checkout.Fields.BillingInfo.$address_inputs.add(Checkout.Fields.BillingInfo.$autocomplete_county);
			},
			"InitializeStateField": function () {
				var country_code = Checkout.Fields.BillingInfo.$input_country.val();

				if ($.inArray(country_code, Checkout.Settings.Shared.countries_with_states) !== -1) {
					// Hide the standard state input
					Checkout.Fields.BillingInfo.$input_state.parent().removeClass(Checkout.Settings.Shared.secondary_field_class).hide();
					// Populate the state drop down field with the states for the current country.
					Checkout.Fields.BillingInfo.$input_state_select.replaceWith(Checkout.Functions.Shared.GetStateSelectElement(Checkout.Fields.BillingInfo.$input_state_select, country_code));
					// Refresh the state drop down variable
					Checkout.Fields.BillingInfo.$input_state_select = $(Checkout.Fields.BillingInfo.$input_state_select.selector);
					// Make the state drop down field an auto-complete field.
					Checkout.Fields.BillingInfo.$autocomplete_state = Checkout.Functions.Shared.InitAutoComplete(Checkout.Fields.BillingInfo.$input_state_select, function () {
						setTimeout(function () {
							Checkout.Fields.BillingInfo.$autocomplete_state.addClass(Checkout.Settings.Shared.complete_class);
							Checkout.Functions.Shared.ValidateRequiredField(Checkout.Fields.BillingInfo.$autocomplete_state);
							Checkout.Functions.Shared.EvaluateAddressFormCompleteness(Checkout.Fields.BillingInfo.$required_address_inputs, Checkout.Fields.BillingInfo.$btnsave_address);
						}, 50);
					});
					// Add the new auto-complete input to the collection of form inputs
					Checkout.Fields.Shared.$form_inputs = Checkout.Fields.Shared.$form_inputs.add(Checkout.Fields.BillingInfo.$autocomplete_state);
					// Add the new auto-complete input to the collection of address inputs
					Checkout.Fields.BillingInfo.$address_inputs = Checkout.Fields.BillingInfo.$address_inputs.add(Checkout.Fields.BillingInfo.$autocomplete_state);
					// Make the state select drop down required, and it's container the displayed field.
					Checkout.Fields.BillingInfo.$input_state_select.addClass(Checkout.Settings.Shared.required_class).parent().addClass(Checkout.Settings.Shared.secondary_field_class);
				}
				else {
					// Hide the state select field and make it optional.
					Checkout.Fields.BillingInfo.$input_state_select.removeClass(Checkout.Settings.Shared.required_class).parent().removeClass(Checkout.Settings.Shared.secondary_field_class).hide();
					// Make the standard not-required state input visible
					Checkout.Fields.BillingInfo.$input_state.parent().addClass(Checkout.Settings.Shared.secondary_field_class);
				}
				Checkout.Fields.BillingInfo.$secondary_fields = $(Checkout.Fields.BillingInfo.$secondary_fields.selector);
				// Re-bind applicable events
				Checkout.Functions.Shared.BindEvents_FormInputs(false);
				Checkout.Functions.Shared.BindEvents_RequiredFields(true);
				Checkout.Functions.BillingInfo.BindEvents_RequiredAddressFields(true);
			},
			"BindCreditCardElements": function () {
				var creditCardData = [],
					creditCardMarkup = undefined;

				$.each(Checkout.Data.credit_cards, function (index, item) {
					creditCardData.push(Checkout.Functions.BillingInfo.GetCreditCardDataObject(item));
				});

				creditCardMarkup = Checkout.Settings.BillingInfo.credit_card_template(creditCardData);
				Checkout.Fields.BillingInfo.$credit_card_list.prepend(creditCardMarkup);
			},
			"GetCreditCardDataObject": function (credit_card_item) {
				var addressData = Checkout.Functions.Shared.GetAddressById(credit_card_item.addressId),
						isExpired = Checkout.Functions.BillingInfo.IsDateExpired(credit_card_item.expiration);

				return {
					"id": credit_card_item.id,
					"type": credit_card_item.type,
					"last_four": credit_card_item.last_four,
					"expiration": credit_card_item.expiration,
					"street": addressData.street,
					"city": addressData.city,
					"state": addressData.state,
					"postal": addressData.postal,
					"default": credit_card_item.default ? "default" : "",
					"default_checked": credit_card_item.default ? "checked" : "",
					"disabled": isExpired ? "disabled=disabled" : "",
					"expired_class": isExpired ? " expired" : "",
					"incomplete_class": credit_card_item.in_wallet ? "" : " incomplete"
				};
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
				var creditCardData = Checkout.Functions.BillingInfo.GetCreditCardById($editedCard.data("credit-card-id")),
					addressData = Checkout.Functions.Shared.GetAddressById(creditCardData.addressId);
				Checkout.Functions.BillingInfo.ResetCreditCardForm();
				Checkout.Fields.BillingInfo.$edited_card_masked_number.text("ending in: " + creditCardData.last_four);
				Checkout.Fields.BillingInfo.$edited_card_type.removeClass("amex mastercard visa discover").addClass(creditCardData.type.toLowerCase()).text(creditCardData.type);
				Checkout.Fields.BillingInfo.$input_cc_name.val(creditCardData.name);
				Checkout.Fields.BillingInfo.$input_cc_expiration.val(creditCardData.expiration);
				Checkout.Fields.BillingInfo.$card_billing_address_container.data("addressId", addressData.id).html(Checkout.Functions.BillingInfo.GetCreditCardAddressMarkup(addressData.street, addressData.city, addressData.state, addressData.postal));
				Checkout.Fields.BillingInfo.$credit_card_inputs.trigger("change");
			},
			"ResetCreditCardForm": function () {
				var address = Checkout.Functions.Shared.GetDefaultBillingAddress();
				Checkout.Fields.BillingInfo.$edited_card_masked_number.html("");
				Checkout.Fields.BillingInfo.$edited_card_type.removeClass("visa mastercard amex discover").html("");
				Checkout.Fields.BillingInfo.$input_cc_name.val("");
				Checkout.Fields.BillingInfo.$input_cc_number.val("");
				Checkout.Fields.BillingInfo.$input_cc_expiration.val("");
				Checkout.Fields.BillingInfo.$input_cc_security_code.val("");
				Checkout.Fields.BillingInfo.$input_cc_store_in_wallet.removeAttr("checked");
				if (address !== undefined) {
					Checkout.Fields.BillingInfo.$card_billing_address_container.data("addressId", address.id).html(Checkout.Functions.BillingInfo.GetCreditCardAddressMarkup(address.street, address.city, address.state, address.postal));
				}
				Checkout.Fields.BillingInfo.$btnchange_billing_address.show();
				if (Checkout.Fields.BillingInfo.$credit_card_inputs !== undefined) {
					Checkout.Fields.BillingInfo.$credit_card_inputs.trigger("change");
				}
			},
			"ResetAddressForm": function () {
				Checkout.Fields.BillingInfo.$input_country.val("");
				if (Checkout.Fields.BillingInfo.$autocomplete_county !== undefined) {
					Checkout.Fields.BillingInfo.$autocomplete_county.val("");
				}
				Checkout.Fields.BillingInfo.$input_name.val("");
				Checkout.Fields.BillingInfo.$input_company.val("");
				Checkout.Fields.BillingInfo.$input_street.val("");
				Checkout.Fields.BillingInfo.$input_city.val("");
				Checkout.Fields.BillingInfo.$input_state.val("");
				Checkout.Fields.BillingInfo.$input_state_select.val("");
				if (Checkout.Fields.BillingInfo.$autocomplete_state !== undefined) {
					Checkout.Fields.BillingInfo.$autocomplete_state.val("");
				}
				Checkout.Fields.BillingInfo.$input_postal.val("");
				Checkout.Fields.BillingInfo.$input_phone.val("");
				Checkout.Fields.BillingInfo.$required_address_inputs.removeClass(Checkout.Settings.Shared.error_class).removeClass(Checkout.Settings.Shared.complete_class);
				Checkout.Fields.BillingInfo.$address_inputs.each(function () {
					Checkout.Functions.Shared.EvaluateFieldCompleteness($(this), false);
				});
				Checkout.Fields.BillingInfo.$secondary_fields.css("display", "none");
			},
			"GetCreditCardById": function (id) {
				var card = undefined,
					index = -1;
				if (id > 0) {
					$.each(Checkout.Data.credit_cards, function (i, item) {
						if (item.id === id) {
							index = i;
							return false;
						}
					});
					if (index > -1) {
						card = Checkout.Data.credit_cards[index];
					}
				}
				return card;
			},
			"IsDateExpired": function (expiration) {
				var parts,
					year,
					month,
					expDate,
					today = new Date()
					isValid = true;

				try {
					parts = expiration.split('/');
					if (parts.length !== 2) {
						alert("parts.length is not 2: " + parts.length);
						isValid = false;
					}
					else {
						month = parts[0];
						year = parts[1];
						expDate = new Date(year, month);
						alert("today: " + today.getDate() + " | expDate: " + expDate.getDate())
						isValid = today.getDate() <= expDate.getDate();
					}
				}
				catch(err) {
					isValid = false;
					console.error(err.message, err);
				}
				
				return isValid;
			},
			"GetCreditCardAddressMarkup": function (street, city, state, postal) {
				var mu = '<div class="address"><span class="label">Billing Address:</span>';
				mu += '<span class="street">' + street + '</span>';
				mu += '<span class="city">' + city + '</span>';
				mu += '<span class="state">' + state + '</span>';
				mu += '<span class="zip">' + postal + '</span>';
				mu += '</div>';
				return mu;
			},
			"CreateNewCreditCardElement": function () {
				var $newCard,
					id = Checkout.Data.credit_cards.length > 0 ? Checkout.Data.credit_cards[Checkout.Data.credit_cards.length - 1].id + 1 : 1,
					addressId = Checkout.Fields.BillingInfo.$card_billing_address_container.data("addressId"),
					name = Checkout.Fields.BillingInfo.$input_cc_name.val(),
					cc_starting_digit = parseInt(Checkout.Fields.BillingInfo.$input_cc_number.val().substring(0, 1)),
					last_four = Checkout.Fields.BillingInfo.$input_cc_number.val().substring(Checkout.Fields.BillingInfo.$input_cc_number.val().length - 4),
					expiration = Checkout.Fields.BillingInfo.$input_cc_expiration.val(),
					in_wallet = Checkout.Fields.BillingInfo.$input_cc_store_in_wallet.is(":checked"),
					type = "",
					cc_data = {},
					new_card_markup = undefined,
					cards_to_add = [];

				addressId = addressId === undefined ? Checkout.Functions.Shared.GetDefaultBillingAddress().id : addressId;
				switch (cc_starting_digit) {
					case 4:
						type = "Visa";
						break;
					case 5:
						type = "MasterCard";
						break;
					case 6:
						type = "Discover";
						break;
					default:
						type = "AMEX";
						break;
				}
				cc_data = {
					"id": id,
					"name": name,
					"type": type,
					"last_four": last_four,
					"expiration": expiration,
					"addressId": addressId,
					"default": false,
					"in_wallet": in_wallet
				},
				Checkout.Data.credit_cards.push(cc_data);
				cards_to_add.push(Checkout.Functions.BillingInfo.GetCreditCardDataObject(cc_data));
				$newCard = $(Checkout.Settings.BillingInfo.credit_card_template(cards_to_add));
				$newCard.data("credit-card-id", id);
				Checkout.Fields.BillingInfo.$credit_card_list.find("li:last-child").before($newCard);
				Checkout.Functions.BillingInfo.BindEvents_EditCreditCardButton(true);
				Checkout.Functions.BillingInfo.BindEvents_CreditCardItems(true);
				$newCard.find("input[type=radio]").trigger("click");
			},
			"UpdateCreditCardElement": function () {
				var cc_data = undefined,
					addressId = Checkout.Fields.BillingInfo.$card_billing_address_container.data("addressId"),
					name = Checkout.Fields.BillingInfo.$input_cc_name.val(),
					expiration = Checkout.Fields.BillingInfo.$input_cc_expiration.val(),
					$newElement = undefined,
					updatedElements = [],
					$elementToReplace = Checkout.Fields.BillingInfo.$credit_card_list.find(".edit-mode");

				if ($elementToReplace !== undefined && $elementToReplace.length > 0) {
					cc_data = Checkout.Functions.BillingInfo.GetCreditCardById($elementToReplace.data("credit-card-id"));
					// Update the credit card data
					cc_data.addressId = addressId;
					cc_data.name = name;
					cc_data.expiration = expiration;
					updatedElements.push(Checkout.Functions.BillingInfo.GetCreditCardDataObject(cc_data));
					$newElement = $(Checkout.Settings.BillingInfo.credit_card_template(updatedElements));
					$newElement.data("credit-card-id", cc_data.id);
					$elementToReplace.replaceWith($newElement);
					Checkout.Functions.BillingInfo.BindEvents_CreditCardItems(true);
					Checkout.Functions.BillingInfo.BindEvents_EditCreditCardButton(true);
					$newElement.find("input[type=radio]").trigger("click");
				}
			},
			"CreateNewAddressElement": function () {
				var $newAddress,
					id = Checkout.Data.addresses[Checkout.Data.addresses.length - 1].id + 1,
					name = Checkout.Fields.BillingInfo.$input_name.val(),
					company = Checkout.Fields.BillingInfo.$input_company.val(),
					street = Checkout.Fields.BillingInfo.$input_street.val(),
					city = Checkout.Fields.BillingInfo.$input_city.val(),
					postal = Checkout.Fields.BillingInfo.$input_postal.val(),
					country_code = Checkout.Fields.BillingInfo.$input_country.val(),
					country_name = Checkout.Fields.BillingInfo.$input_country.find("option:selected").text(),
					state = ($.inArray(country_code, Checkout.Settings.Shared.countries_with_states) !== -1) ? Checkout.Fields.BillingInfo.$input_state_select.val() : Checkout.Fields.BillingInfo.$input_state.val(),
					phone = Checkout.Fields.BillingInfo.$input_phone.val(),
					new_address_data = {},
					addresses_to_add = [];

				new_address_data = {
					"id": id,
					"name": name,
					"company": company,
					"street": street,
					"city": city,
					"state": state,
					"postal": postal,
					"country_code": country_code,
					"country_name": country_name,
					"phone": phone,
					"default_shipping": Checkout.Data.addresses.length === 0 ? true : false,
					"default_billing": Checkout.Data.addresses.length === 0 ? true : false
				};

				Checkout.Data.addresses.push(new_address_data);
				addresses_to_add.push(new_address_data);
				$newAddress = $(Checkout.Settings.Shared.addresses_template(addresses_to_add));
				$newAddress.data("addressId", id);
				$newAddress.find("span.btn").addClass("billtothis");
				Checkout.Fields.BillingInfo.$billing_address_list.find("li:last-child").before($newAddress);
				Checkout.Functions.BillingInfo.BindEvents_BillingAddressItem(true);
				Checkout.Functions.BillingInfo.BindEvents_EditAddressButton(true);
				$newAddress.find("input[type=radio]").trigger("click");
			},
			"EditAddressElement": function () {
				var $address_input = Checkout.Fields.BillingInfo.$billing_address_items.filter("[checked]"),
					$address_element = $address_input.parent(),
					id = $address_element.data("addressId"),
					name = Checkout.Fields.BillingInfo.$input_name.val(),
					company = Checkout.Fields.BillingInfo.$input_company.val(),
					street = Checkout.Fields.BillingInfo.$input_street.val(),
					city = Checkout.Fields.BillingInfo.$input_city.val(),
					postal = Checkout.Fields.BillingInfo.$input_postal.val(),
					country_code = Checkout.Fields.BillingInfo.$input_country.val(),
					country_name = Checkout.Fields.BillingInfo.$input_country.find("option:selected").text(),
					state = ($.inArray(country_code, Checkout.Settings.Shared.countries_with_states) !== -1) ? Checkout.Fields.BillingInfo.$input_state_select.val() : Checkout.Fields.BillingInfo.$input_state.val(),
					phone = Checkout.Fields.BillingInfo.$input_phone.val(),
					addressData = {
						"id": id,
						"name": name,
						"company": company,
						"street": street,
						"city": city,
						"state": state,
						"postal": postal,
						"country_code": country_code,
						"country_name": country_name,
						"phone": phone
					};

				// Update the address data and markup
				Checkout.Functions.Shared.UpdateAddress(addressData, $address_element, "billing");
				$address_input.trigger("click");
			},
			"SelectDefaultOption": function () {
				var $defaultCardItem = Checkout.Fields.BillingInfo.$credit_card_list.find("li.default");

				Checkout.Data.checkout_details.billing_method = "Credit Card";
				Checkout.Functions.BillingInfo.UpdateCreditCardData($defaultCardItem.find(".credit-card"));
				Checkout.Functions.BillingInfo.UpdateBillingAddressData($defaultCardItem);
				Checkout.Functions.Review.RefreshOrderReviewSelectionData();
			},
			"UpdateCreditCardData": function (selected_card) {
				var $type = selected_card.find(".type"),
					$last_four = selected_card.find(".masked-number"),
					$expiration = selected_card.find(".expiration");

				Checkout.Data.checkout_details.credit_card_data.type = $type.length > 0 ? $type.text() : "";
				Checkout.Data.checkout_details.credit_card_data.last_four = $last_four.length > 0 ? $last_four.text().replace("ending in: ", "") : "";
				Checkout.Data.checkout_details.credit_card_data.expiration = $expiration.length > 0 ? $expiration.text().replace("Expires: ", "") : "";
			},
			"UpdateBillingAddressData": function ($selected_card) {
				var cardData = Checkout.Functions.BillingInfo.GetCreditCardById($selected_card.data("credit-card-id")),
					addressData = Checkout.Functions.Shared.GetAddressById(cardData.addressId);

				Checkout.Data.checkout_details.billing_address.name = addressData.name;
				Checkout.Data.checkout_details.billing_address.company = addressData.company;
				Checkout.Data.checkout_details.billing_address.street = addressData.street
				Checkout.Data.checkout_details.billing_address.city = addressData.city;
				Checkout.Data.checkout_details.billing_address.state = addressData.state;
				Checkout.Data.checkout_details.billing_address.postal_code = addressData.postal;
				Checkout.Data.checkout_details.billing_address.country = addressData.country_name;
				Checkout.Data.checkout_details.billing_address.phone_number = addressData.phone;
			},
			"ValidateCreditCardForm": function () {
				var requiredFieldsValid = true,
					expirationValid = true,
					isValid = true;

				// Perform required field validation
				requiredFieldsValid = Checkout.Functions.Shared.ValidateFormRequiredFields(Checkout.Fields.BillingInfo.$credit_card_form, Checkout.Fields.BillingInfo.$required_credit_card_inputs);
				// Validate the expiration date
				expirationValid = Checkout.Functions.BillingInfo.ValidateExpirationDate();
				if (!requiredFieldsValid || !expirationValid) {
					isValid = false;
				}
				return isValid;
			},
			"ValidateExpirationDate": function () {
				var expiration = Checkout.Fields.BillingInfo.$input_cc_expiration.val(),
					isValid = true,
					dateValid = true,
					lengthValid = true,
					$error_element = Checkout.Fields.BillingInfo.$input_cc_expiration.siblings(".error"),
					$error_label = Checkout.Fields.BillingInfo.$input_cc_expiration.siblings("label"),
					error_message = "";

				// Verify the length
				if (expiration === Checkout.Fields.BillingInfo.$input_cc_expiration.attr("data-masked-text") || expiration.length !== 5) {
					lengthValid = false;
					isValid = false;
					alert("length is invalid");
					error_message = $error_label.text() + " is required.";
				}
				if (lengthValid) {
					// Check the date
					dateValid = !Checkout.Functions.BillingInfo.IsDateExpired(expiration);
					if (!dateValid) {
						isValid = false;
						error_message = "Cannot enter an expired date";
					}
				}

				if (!isValid) {
					Checkout.Fields.BillingInfo.$input_cc_expiration.removeClass(Checkout.Settings.Shared.success_class).addClass(Checkout.Settings.Shared.error_class);
					if ($error_element.length === 0) {
						$error_element = $("<div style='display:none;' class='error'>" + error_message + "</div>");
						Checkout.Fields.BillingInfo.$input_cc_expiration.siblings("label").after($error_element);
					}
					else {
						$error_element.text(error_message);
					}
					$error_element.slideDown(Checkout.Settings.Shared.easing_duration);
				}
				else {
					Checkout.Fields.BillingInfo.$input_cc_expiration.removeClass(Checkout.Settings.Shared.error_class).addClass(Checkout.Settings.Shared.success_class);
					Checkout.Fields.BillingInfo.$input_cc_expiration.siblings(".error").slideUp(Checkout.Settings.Shared.easing_duration);
				}
				return isValid;
			},
			"ValidateAddressForm": function () {
				return Checkout.Functions.Shared.ValidateFormRequiredFields(Checkout.Fields.BillingInfo.$billing_address_form, Checkout.Fields.BillingInfo.$required_address_inputs);
			},
			"SetExpirationDateErrorMarkup": function () {
				var error = {
					"message": "Cannot enter an expired date.",
					"detail_message": "",
					"field_names": []
				};

				Checkout.Fields.BillingInfo.$expiration_date_error = $(Checkout.Settings.Shared.error_item_template(error));
				Checkout.Fields.Shared.$error_container.append(Checkout.Fields.BillingInfo.$expiration_date_error).slideDown(Checkout.Settings.Shared.easing_duration).animatedScroll();
			},
		},
		"Review": {
			"BindEvents_QuantityInputs": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Review.$quantity_inputs = $(Checkout.Fields.Review.$quantity_inputs.selector);
				}
				Checkout.Fields.Review.$quantity_inputs.on("keydown", function () {
					var $this = $(this);
					setTimeout(function () {
						val = parseInt($this.val()),
						orig_val = parseInt($this.attr("data-orig-val"));

						if (val === orig_val) {
							$this.next().addClass("tertiary").removeClass("secondary");
						}
						else {
							$this.next().addClass("secondary").removeClass("tertiary");
						}
					}, 50);
				});
			},
			"BindEvents_UpdateCartItemButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Review.$btnupdate_cart_item = $(Checkout.Fields.Review.$btnupdate_cart_item.selector);
				}
				Checkout.Fields.Review.$btnupdate_cart_item.on("click", function (e) {
					var $this = $(this),
						$cart_item = $this.parents("li.cart-item");
					e.preventDefault();
					Checkout.Functions.Review.UpdateCartItem($cart_item);
					$this.addClass("tertiary").removeClass("secondary");
				});
			},
			"BindEvents_RemoveCartItemButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Review.$btnremove_cart_item = $(Checkout.Fields.Review.$btnremove_cart_item.selector);
				}
				Checkout.Fields.Review.$btnremove_cart_item.requireConfirmation({
					action: function ($remove_button) {
						var $cart_item = $remove_button.parents("li.cart-item");
						Checkout.Functions.Review.RemoveCartItem($cart_item);
					},
				});
			},
			"BindEvents_ChangeSelectionButton": function (refreshSelector) {
				if (refreshSelector) {
					Checkout.Fields.Review.$btnchange_selection = $(Checkout.Fields.Review.$btnchange_selection.selector);
				}
				Checkout.Fields.Review.$btnchange_selection.on("click", function (e) {
					var step = $(this).attr("data-related-step");
					e.preventDefault();
					jQuery.bbq.pushState(step, 2);
				});
			},
			"UpdateCartItem": function ($cart_item) {
				var quantity = Checkout.Functions.Shared.GetDecimal($cart_item.find(".quantity input").val()),
					product_id = parseInt($cart_item.find("input.product-id").val()),
					$total_value = $cart_item.find(".total > .value"),
					updated_item = undefined;
				if (quantity < 0 || quantity == 0) {
					Checkout.Functions.Review.RemoveCartItem($cart_item);
				}
				else {
					// Update the data in the cart items array
					$.each(Checkout.Data.cart_items, function (i, item) {
						if (item.id === product_id) {
							item.quantity = quantity;
							item.extended_price = Checkout.Functions.Shared.GetDecimal(item.unit_price * item.quantity);
							updated_item = item;
							return false;
						}
					});
					if (updated_item !== undefined) {
						// Refresh the UI
						$total_value.text("$" + updated_item.extended_price.toFixed(2));
						Checkout.Functions.Shared.UpdateOrderTotal();
					}
				}
			},
			"RemoveCartItem": function ($cart_item) {
				var product_id = parseInt($cart_item.find("input.product-id").val()),
					index_to_remove = -1;

				// Find the item to remove from the cart item array;
				$.each(Checkout.Data.cart_items, function (i, item) {
					if (item.id === product_id) {
						index_to_remove = i;
						return false;
					}
				});
				if (index_to_remove > -1 && Checkout.Data.cart_items.length > 1) {
					Checkout.Data.cart_items.splice(index_to_remove, 1);
					Checkout.Functions.Shared.UpdateOrderTotal();
					// Remove the cart item from the UI
					$cart_item.fadeOut(Checkout.Settings.Shared.easing_duration);
				}
				else {
					alert("This action is not supported in the prototype");
				}
			},
			"RefreshOrderReviewSelectionData": function () {
				var billing_markup = "";
				// Update shipping address data
				Checkout.Fields.Review.$shipping_address_name.text(Checkout.Data.checkout_details.shipping_address.name);
				Checkout.Fields.Review.$shipping_address_company.text(Checkout.Data.checkout_details.shipping_address.company);
				Checkout.Fields.Review.$shipping_address_street.text(Checkout.Data.checkout_details.shipping_address.street);
				Checkout.Fields.Review.$shipping_address_city.text(Checkout.Data.checkout_details.shipping_address.city);
				Checkout.Fields.Review.$shipping_address_state.text(Checkout.Data.checkout_details.shipping_address.state);
				Checkout.Fields.Review.$shipping_address_postal.text(Checkout.Data.checkout_details.shipping_address.postal_code);
				Checkout.Fields.Review.$shipping_address_country.text(Checkout.Data.checkout_details.shipping_address.country);
				Checkout.Fields.Review.$shipping_address_phone.text(Checkout.Data.checkout_details.shipping_address.phone_number);
				// Update shipping option data
				Checkout.Fields.Review.$shipping_option_carrier.text(Checkout.Data.checkout_details.shipping_option.carrier);
				Checkout.Fields.Review.$shipping_option_delivery_date.text(Checkout.Data.checkout_details.shipping_option.delivery_date);
				Checkout.Fields.Review.$shipping_option_method.text(Checkout.Data.checkout_details.shipping_option.option);
				Checkout.Fields.Review.$shipping_option_price.text("$" + (Checkout.Data.checkout_details.shipping_amount + Checkout.Data.checkout_details.shipping_tax_amount).toFixed(2));
				// Update billing data
				Checkout.Fields.Review.$billing_address_name.text(Checkout.Data.checkout_details.billing_address.name);
				Checkout.Fields.Review.$billing_address_company.text(Checkout.Data.checkout_details.billing_address.company);
				Checkout.Fields.Review.$billing_address_street.text(Checkout.Data.checkout_details.billing_address.street);
				Checkout.Fields.Review.$billing_address_city.text(Checkout.Data.checkout_details.billing_address.city);
				Checkout.Fields.Review.$billing_address_state.text(Checkout.Data.checkout_details.billing_address.state);
				Checkout.Fields.Review.$billing_address_postal.text(Checkout.Data.checkout_details.billing_address.postal_code);
				Checkout.Fields.Review.$billing_address_country.text(Checkout.Data.checkout_details.billing_address.country);
				Checkout.Fields.Review.$billing_address_phone.text(Checkout.Data.checkout_details.billing_address.phone_number);
				if (Checkout.Data.checkout_details.billing_method == "Credit Card") {
					billing_markup += "<div class='credit-card'>";
					billing_markup += "<span class='type " + Checkout.Data.checkout_details.credit_card_data.type.toLowerCase() + "'>" + Checkout.Data.checkout_details.credit_card_data.type + "</span>";
					billing_markup += "<span class='masked-number'>ending in: " + Checkout.Data.checkout_details.credit_card_data.last_four + "</span>";
					billing_markup += "<span class='expiration'>Expires: " + Checkout.Data.checkout_details.credit_card_data.expiration + "</span>";
					billing_markup += "</div>";
				}
				else if (Checkout.Data.checkout_details.billing_method == "PayPal") {
					billing_markup += "<div class='paypal'>";
					billing_markup += "<span>PayPal payment</span>";
					billing_markup += "</div>";
				}
				Checkout.Fields.Review.$billing_data_container.find(".paypal, .credit-card").remove();
				Checkout.Fields.Review.$billing_address_container.before(billing_markup);
			},
			"UpdateOrderReviewTotals": function () {
				Checkout.Fields.Review.$subtotal.text("$" + Checkout.Data.checkout_details.subtotal.toFixed(2));
				Checkout.Fields.Review.$shipping_cost.text("$" + Checkout.Data.checkout_details.shipping_amount.toFixed(2));
				Checkout.Fields.Review.$tax.text("$" + (Checkout.Data.checkout_details.tax_amount + Checkout.Data.checkout_details.shipping_tax_amount).toFixed(2));
				Checkout.Fields.Review.$discount.text("$" + Checkout.Data.checkout_details.promo_amount.toFixed(2));
				Checkout.Fields.Review.$total.text("$" + Checkout.Data.checkout_details.grand_total.toFixed(2));
			}
		}
	}
}