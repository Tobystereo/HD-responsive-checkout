$(document).ready(function () {
	var $cta_bar = $('.cta_bar'),
		footertop = $('#help-content').position().top;

	$(window).on("load scroll", function (event) {
		var scrollPos = window.scrollY,
			windowheight = window.innerHeight,
			scrollbottom = scrollPos + windowheight,
			ctabarheight = $cta_bar.height();

		if (scrollbottom >= footertop) {
			if (!$cta_bar.hasClass('absolute')) {
				$cta_bar.addClass('absolute').css({
					"top": footertop + "px"
				});
			}
		}
		else {
			if ($cta_bar.hasClass('absolute')) {
				$cta_bar.removeClass('absolute').css({
					"top": "auto"
				});
			}
		}
	});
});