// Global Variables
var $cta_bar,
	$help_content,
	$btnchangeaddress,
	$btncreateaddress,
	$additional_addresses,
	footertop,
	absoluteClassName = "absolute";

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
	$btnchangeaddress.on("click", function () {
		$additional_addresses.removeClass("hidden");
		UpdateCtaBar();
	});
	$btnchangeaddress.on("click", function () {

	});
}

function UpdateCtaBar() {
	/// <summary>Determines if the call to action bar should have the "sticky" behavior or not.</summary>
	var scrollPos = window.scrollY,
			windowheight = window.innerHeight,
			scrollbottom = scrollPos + windowheight,
			ctabarheight = $cta_bar.height(),
			footertop = $help_content.position().top;

	if (scrollbottom >= footertop) {
		// Remove the call to action bar's sticky behavior
		if (!$cta_bar.hasClass(absoluteClassName)) {
			$cta_bar.addClass(absoluteClassName).css({
				"top": footertop + "px"
			});
		}
	}
	else {
		if ($cta_bar.hasClass(absoluteClassName)) {
			// Add the sticky behavior to the call to action bar
			$cta_bar.removeClass(absoluteClassName).css({
				"top": "auto"
			});
		}
	}
}