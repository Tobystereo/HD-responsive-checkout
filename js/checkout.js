//#region -- PLUGINS --

(function ($) {
	$.fn.toggleContainer = function (options) {
		// Default options
		var $self = this,
			settings = $.extend({
				content_element: undefined,
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
				// Toggle self (before)
				if (settings.toggle_self && settings.toggle_order == "before") {
					$self.fadeToggle(settings.delay + settings.self_toggle_delay_offset);
				}
				// Toggle continer
				settings.content_element.slideToggle(settings.delay);
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
}(jQuery));
//#endregion PLUGINS

//#region -- GLOBAL VARIABLES --
var $cta_bar,
	$help_content,
	$shipping_address_instructions,
	$btnchangeaddress,
	$btncreateaddress,
	$default_address_wrapper,
	$additional_addresses,
	$new_address,
	footertop,
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
	$help_content = $("#help-content");
	$shipping_address_instructions = $("#shipping-address .instructions");
	$btnchangeaddress = $("button.changeaddress");
	$btncreateaddress = $("button.createaddress");
	$default_address_wrapper = $("div.defaultaddress-wrapper");
	$additional_addresses = $("div.additional-addresses");
	$new_address = $("form.new-address");
}

function WireEvents() {
	/// <summary>Wire up control events</summary>
	$btnchangeaddress.toggleContainer({
		content_element: $additional_addresses,
		callback: ToggleShippingInstructionText,
		self_toggle_delay_offset: -300
	});
	$btncreateaddress.toggleContainer({
		content_element: $new_address,
		self_toggle_delay_offset: -300
	});
}

function ToggleShippingInstructionText() {
	var defaultText = $shipping_address_instructions.attr("data-text"),
		altText = $shipping_address_instructions.attr("data-alt-text");

	$shipping_address_instructions.text(($shipping_address_instructions.text().trim() == defaultText ? altText : defaultText));
}

//#endregion -- FUNCTIONS --