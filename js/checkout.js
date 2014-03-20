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
			pre_logic: undefined,
			callback: undefined,
			delay: 300
		}, options);

		$.scrollTo(this.offset().top, {
			"axis": "y",
			"duration": settings.delay,
			"easing": "linear"
		});
		//$html_body.animate({
		//	scrollTop: this.offset().top
		//}, settings.delay);

		return this;
	};
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
				hd_checkout.Fields.ShippingAddress.$shipping_address_instructions = $("#shipping-address .instructions");
				hd_checkout.Fields.ShippingAddress.$btnchangeaddress = $("button.changeaddress");
				hd_checkout.Fields.ShippingAddress.$btnadd_address = $("button.createaddress");
				hd_checkout.Fields.ShippingAddress.$address_wrapper = $(".address-wrapper");
				hd_checkout.Fields.ShippingAddress.$address_list = hd_checkout.Fields.ShippingAddress.$address_wrapper.find(".address-list");
				hd_checkout.Fields.ShippingAddress.$default_address = hd_checkout.Fields.ShippingAddress.$address_list.find(".default");
				hd_checkout.Fields.ShippingAddress.$additional_addresses = hd_checkout.Fields.ShippingAddress.$address_list.find(".additional-address");
				hd_checkout.Fields.ShippingAddress.$new_address_form = $("#new-address-form");
				hd_checkout.Fields.ShippingAddress.$btnedit_address = $(".address-item button");
				hd_checkout.Fields.ShippingAddress.$btncancel_address = $(".add-edit-address button.cancel");
				hd_checkout.Fields.ShippingAddress.$btnsave_address = $(".add-edit-address button.save");
				hd_checkout.Fields.ShippingAddress.$input_country = $("#country-input");
				hd_checkout.Fields.ShippingAddress.$input_name = $("#name-input");
				hd_checkout.Fields.ShippingAddress.$input_company = $("#company-input");
				hd_checkout.Fields.ShippingAddress.$input_street = $("#address-input");
				hd_checkout.Fields.ShippingAddress.$input_city = $("#city-input");
				hd_checkout.Fields.ShippingAddress.$input_state = $("#state-input");
				hd_checkout.Fields.ShippingAddress.$input_postal = $("#postal-code-input");
				hd_checkout.Fields.ShippingAddress.$input_phone = $("#phone-input");
				hd_checkout.Fields.ShippingAddress.$secondary_fields = $(".field__secondary");
				hd_checkout.Fields.Shared.$form_inputs = $("input[type=text], textarea, #country-input");
				hd_checkout.Fields.ShippingMethod.$loading_panel = $(".loading-panel");
				hd_checkout.Fields.ShippingMethod.$shipping_option_list = $(".shipping-option-list");
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
			},
			"InitCurrentStep": function (step_name) {
				var $currentProgressBarItem = $("a[href=#" + hd_checkout.Settings.Shared.step_url_prefix + hd_checkout.Fields.Shared.$step_current.attr("id") + "]").parent();

				if (hd_checkout.Fields.Shared.$step_previous !== undefined) {
					hd_checkout.Fields.Shared.$step_previous.slideUp(hd_checkout.Settings.Shared.easing);
				}
				hd_checkout.Fields.Shared.$step_current.slideDown(hd_checkout.Settings.Shared.easing);
				hd_checkout.Functions.Shared.SetActiveProgressBarItem($currentProgressBarItem);
				switch (step_name) {
					case hd_checkout.Settings.Shared.shipping_address_step_id:
						hd_checkout.Fields.ShippingMethod.$loading_panel.show();
						hd_checkout.Fields.ShippingMethod.$shipping_option_list.hide();
						break;
					case hd_checkout.Settings.Shared.shipping_option_step_id:
						setTimeout(function () {
							hd_checkout.Fields.ShippingMethod.$loading_panel.fadeOut(hd_checkout.Settings.Shared.easing - 200, function () {
								hd_checkout.Fields.ShippingMethod.$shipping_option_list.slideDown(hd_checkout.Settings.Shared.easing, function () {
									$(this).animatedScroll();
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
						// Scroll to the progress bar
						hd_checkout.Fields.Shared.$progress_bar.animatedScroll();
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

		}
	}
}