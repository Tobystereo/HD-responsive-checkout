/********** PLUGINS **********/
(function ($) {
	$.fn.toggleContainer = function (options) {
		// Default options
		var settings = $.extend({
			content_element: undefined,
			callback: undefined,
			delay: 1,
			show_class: "show",
			hide_class: "hide",
			firing_events: "click"
		}, options);

		if (settings.content_element !== undefined) {
			this.on(settings.firing_events, function () {
				var content_height;
				if (settings.content_element.hasClass(settings.show_class)) {
					settings.content_element.removeClass(settings.show_class).addClass(settings.hide_class);
				}
				else {
					content_height = settings.content_element.height();
					settings.content_element.removeClass(settings.hide_class).addClass(settings.show_class);
					setTimeout(function () {
						settings.content_element.css("height", content_height + "px");
						if (settings.callback !== undefined) {
							settings.callback(this);
						}
					}, settings.delay);
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
	$additional_addresses,
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
	$additional_addresses = $("div.additional-addresses");
}

function WireEvents() {
	/// <summary>Wire up control events</summary>
	$(window).on("load scroll", function (event) {
		UpdateCtaBar();
	});
	$btnchangeaddress.toggleContainer({
		content_element: $additional_addresses
		//,callback: UpdateCtaBar
	});

	//$btnchangeaddress.on("click", function () {
	//	var additional_addresses_height = $additional_addresses.height();
	//	$additional_addresses.addClass("show");
	//	setTimeout(function () {
	//		$additional_addresses.css("height", additional_addresses_height + "px")
	//	}, 1);

	//	UpdateCtaBar();
	//});
}

function UpdateCtaBar() {
	/// <summary>Determines if the call to action bar should have the "sticky" behavior or not.</summary>
	var scrollPos = window.scrollY,
			windowheight = window.innerHeight,
			scrollbottom = scrollPos + windowheight,
			ctabarheight = $cta_bar.height(),
			footertop = $help_content.position().top;

	if (scrollbottom >= footertop + ctabarheight) {
		// Remove the call to action bar's sticky behavior
		MakeCtaBarAbsolute(absoluteClassName, footertop);
	}
	else {
		MakeCtaBarSticky(absoluteClassName);
	}
}

function MakeCtaBarSticky(absoluteClassName) {
	if ($cta_bar.hasClass(absoluteClassName)) {
		// Add the sticky behavior to the call to action bar
		$cta_bar.removeClass(absoluteClassName).css({
			"top": "auto"
		});
	}
}

function MakeCtaBarAbsolute(absoluteClassName, footertop) {
	// Remove the call to action bar's sticky behavior
	if (!$cta_bar.hasClass(absoluteClassName)) {
		$cta_bar.addClass(absoluteClassName).css({
			"top": footertop + "px"
		});
	}
}