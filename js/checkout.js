/********** PLUGINS **********/
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
				toggle_order: "before" /* before|after */
			}, options);

		if (settings.content_element !== undefined) {
			this.on(settings.firing_events, function () {
				// Toggle self (before)
				if (settings.toggle_self && settings.toggle_order == "before") {
					$self.fadeToggle(settings.delay - 100);
				}
				// Toggle continer
				settings.content_element.slideToggle(settings.delay);
				// Toggle self (after)
				if (settings.toggle_self && settings.toggle_order == "after") {
					$self.fadeToggle(settings.delay + 100);
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
/********** GLOBAL VARIABLES **********/
var $cta_bar,
	$help_content,
	$btnchangeaddress,
	$btncreateaddress,
	$default_address_wrapper,
	$additional_addresses,
	$new_address,
	footertop,
	absoluteClassName = "absolute";

/********** FUNCTIONS **********/

$(document).ready(function () {
	SetGlobalVariables();
	WireEvents();
});

function SetGlobalVariables() {
	/// <summary>Gets DOM elements & other dynamic variable values.</summary>
	$cta_bar = $(".cta_bar");
	$help_content = $("#help-content");
	$btnchangeaddress = $("button.changeaddress");
	$btncreateaddress = $("button.createaddress");
	$default_address_wrapper = $("div.defaultaddress-wrapper");
	$additional_addresses = $("div.additional-addresses");
	$new_address = $("form.new-address");
}

function WireEvents() {
	/// <summary>Wire up control events</summary>
	$btnchangeaddress.toggleContainer({
		content_element: $default_address_wrapper,
		toggle_self: false
	}).toggleContainer({
		content_element: $additional_addresses
	});
	$btncreateaddress.toggleContainer({
		content_element: $default_address_wrapper,
		toggle_self: false
	}).toggleContainer({
		content_element: $new_address
	});
}