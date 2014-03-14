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
				show_class: "show",
				hide_class: "hide",
				firing_events: "click",
				toggle_self: true,
				toggle_order: "before", /* before|after */
				self_toggle_delay_offset: 100
			}, options);

		if (settings.content_element !== undefined) {
			this.on(settings.firing_events, function () {
				if (settings.pre_logic !== undefined) {
					settings.pre_logic(this);
				}
				// Toggle self (before)
				if (settings.toggle_self && settings.toggle_order == "before") {
					$self.fadeToggle(settings.delay + settings.self_toggle_delay_offset);
				}
				// Toggle continer
				settings.content_element.slideToggle(settings.delay, function () {
					settings.content_element.css("overflow", "inherit");
					if (settings.post_toggle !== undefined) {
						settings.post_toggle(this);
					}
				});
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
			delay: easing
		}, options);

		$html_body.animate({
			scrollTop: this.offset().top
		}, settings.delay);

		return this;
	};
}(jQuery));

//#endregion PLUGINS

//#region -- GLOBAL VARIABLES --

var $cta_bar,
	$need_help,
	$help_content,
	$progress_bar,
	$shipping_address_instructions,
	$btnchangeaddress,
	$btnadd_address,
	$address_wrapper,
	$address_list,
	$default_address,
	$additional_addresses,
	$new_address_form,
	$btncancel_address,
	$btnsave_address,
	$btnedit_address,
	$input_country,
	$input_name,
	$input_company,
	$input_street,
	$input_city,
	$input_state,
	$input_postal,
	$input_phone,
	footertop,
	easing = 300,
	absoluteClassName = "absolute";

//#endregion -- GLOBAL VARIABLES --

//#region -- FUNCTIONS --

$(document).ready(function () {
	SetGlobalVariables();
	WireEvents();
});

function SetGlobalVariables() {
	/// <summary>Gets DOM elements & other dynamic variable values.</summary>
	$cta_bar = $(".cta_bar");
	$need_help = $(".need-help");
	$help_content = $("#help-content");
	$progress_bar = $("#progress-bar");
	$shipping_address_instructions = $("#shipping-address .instructions");
	$btnchangeaddress = $("button.changeaddress");
	$btnadd_address = $("button.createaddress");
	$address_wrapper = $(".address-wrapper");
	$address_list = $address_wrapper.find(".address-list");
	$default_address = $address_list.find(".default");
	$additional_addresses = $address_list.find(".additional-address");
	$new_address_form = $("#new-address-form");
	$btnedit_address = $(".address-item button");
	$btncancel_address = $(".add-edit-address button.cancel");
	$btnsave_address = $(".add-edit-address button.save");
	$input_country = $("#country-input");
	$input_name = $("#name-input");
	$input_company = $("#company-input");
	$input_street = $("#address-input");
	$input_city = $("#city-input");
	$input_state = $("#state-input");
	$input_postal = $("#postal-code-input");
	$input_phone = $("#phone-input");
}

function WireEvents() {
	/// <summary>Wire up control events</summary>
	BindEvents_NeedHelp(false);
	BindEvents_AdditionalAddressButton(false);
	BindEvents_AddAddressButton(false);
	BindEvents_EditAddressButton(false);
	BindEvents_CancelAddressButton(false);
	BindEvents_SaveAddressButton(false);
	BindEvents_AddressForm(false);
}

//#endregion -- FUNCTIONS --

//#region -- EVENT HANDLERS --

function BindEvents_AdditionalAddressButton(refreshSelector) {
	if (refreshSelector) {
		$btnchangeaddress = $("'" + $btnchangeaddress.selector + "'");
	}
	$btnchangeaddress.toggleContainer({
		content_element: $additional_addresses,
		self_toggle_delay_offset: -easing
	}).toggleContainer({
		content_element: $btnadd_address,
		toggle_self: false
	});
}

function BindEvents_AddAddressButton(refreshSelector) {
	if (refreshSelector) {
		$btnadd_address = $($btnadd_address.selector);
	}
	$btnadd_address.toggleContainer({
		content_element: $new_address_form,
		self_toggle_delay_offset: -easing,
		post_toggle: function () {
			$new_address_form.animatedScroll();
		}
	});
}

function BindEvents_EditAddressButton(refreshSelector) {
	if (refreshSelector) {
		$btnedit_address = $($btnedit_address.selector);
	}
	$btnedit_address.on("click", function () {
		// Select the address being edited
		$(this).parent().trigger("click");
		// Hide the new address button
		if ($btnadd_address.is(":visible")) {
			$btnadd_address.slideUp(100);
		}
		// Set the input values
		$input_country.val("CA");
		$input_name.val("Editing Name");
		$input_company.val("Editing Company");
		$input_street.val("Editing Street Address");
		$input_city.val("Editing City");
		$input_state.val("Editing State");
		$input_postal.val("Editing Postal Code");
		$input_phone.val("Editing Phone");
		// Display the address form
		$new_address_form.slideDown(easing, function () {
			$new_address_form.animatedScroll();
		});
	});
}

function BindEvents_CancelAddressButton(refreshSelector) {
	if (refreshSelector) {
		$btncancel_address = $($btncancel_address.selector);
	}
	$btncancel_address.on("click", function() {
		if($additional_addresses.is(":visible")) {
			$btnadd_address.slideDown(easing - 200);
		}
	}).toggleContainer({
		content_element: $new_address_form,
		toggle_self: false,
		callback: function () {
			$input_country.val("");
			$input_name.val("");
			$input_company.val("");
			$input_street.val("");
			$input_city.val("");
			$input_state.val("");
			$input_postal.val("");
			$input_phone.val("");
			// Scroll to the progress bar
			$progress_bar.animatedScroll();
		}
	});
}

function BindEvents_SaveAddressButton(refreshSelector) {
	if (refreshSelector) {
		$btnsave_address = $($btnsave_address.selector);
	}
	$btnsave_address.toggleContainer({
		content_element: $btnadd_address,
		delay: 100,
		toggle_self: false
	}).toggleContainer({
		content_element: $new_address_form,
		toggle_self: false,
		pre_logic: function () {
			var $newAddress,
				mu = '<li class="additional-address grid__item one-whole desk-one-half address-item">';
			mu += '<input type="radio" name="select-address" id="address4" value="address4">';
			mu += '<label for="address4">';
			mu += '<span class="btn shiptothis secondary"></span>';
			mu += '<button class="btn edit tertiary">Edit</button>';
			mu += '<div class="address">';
			mu += '<span class="name">' + $input_name.val() + '</span>';
			mu += '<span class="company">' + $input_company.val() + '</span>';
			mu += '<span class="street">' + $input_street.val() + '</span>,';
			mu += '<span class="city">' + $input_city.val() + '</span>';
			mu += '<span class="state">' + $input_state.val() + '</span>';
			mu += '<span class="zip">' + $input_postal.val() + '</span>';
			mu += '<span class="country">' + $input_country.val() + '</span>';
			mu += '<span class="phone">' + $input_phone.val() + '</span>';
			mu += '</div></label></li>';
			$newAddress = $(mu);
			$address_list.append($newAddress);
			BindEvents_EditAddressButton(true);
			$newAddress.find("input[type=radio]").trigger("click");
		},
		callback: function (element, event) {
			$input_country.val("");
			$input_name.val("");
			$input_company.val("");
			$input_street.val("");
			$input_city.val("");
			$input_state.val("");
			$input_postal.val("");
			$input_phone.val("");
			// Scroll to the progress bar
			$("input[type=radio]:checked").parent().animatedScroll();
		}
	});
}

function BindEvents_NeedHelp(refreshSelector) {
	if (refreshSelector) {
		$need_help = $($need_help.selector);
	}
	$need_help.on("click", function (){ 
		$help_content.animatedScroll();
	});
}

function BindEvents_AddressForm(refreshSelector) {
	if (refreshSelector) {
		$new_address_form = $($new_address_form.selector);
	}
	$new_address_form.on("submit", function (e) {
		e.preventDefault();
		// DO STUFF
	});
}

//#endregion EVENT HANDLERS