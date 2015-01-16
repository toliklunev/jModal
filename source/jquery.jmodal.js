/* jmodal v0.1
 * © Anatoly Lunev | toliklunev.ru | toliklunev@gmail.com
 * Licensed under the MIT License */

(function($){

	var $html;
	var $body;
	var $jmodal = $('<div id="jmodal"></div>');
	var $jmodal_bg = $('<div id="jmodal_bg"></div>').appendTo($jmodal);
	var $jmodal_container = $('<div id="jmodal_container"></div>').appendTo($jmodal);
	var $jmodal_close = $('<a id="jmodal_close"></a>').appendTo($jmodal_container);
	var $jmodal_placeholder = $('<div id="jmodal_placeholder"></div>');
	var $prev_modal;
	var $modal;

	var mobile = (/mobile|android|blackberry|brew|htc|j2me|lg|midp|mot|netfront|nokia|obigo|openweb|opera\ mini|palm|psp|samsung|sanyo|sch|sonyericsson|symbian|symbos|teleca|up\.browser|wap|webos|windows\ ce/i.test(navigator.userAgent.toLowerCase()));

	$(function(){
		$html = $('html');
		$body = $('body');
		$jmodal.appendTo($body);

		if(mobile){
			$jmodal_bg.appendTo($body);
		}

		else{
			$html.addClass('desktop');
		}

		$('[data-jmodal-init]').each(function(){
			var $modal = $($(this).data('jmodal-init'));

			$(this).click(function(){
				$modal.jModal();
			});
		});
	});
	
	$(window).keydown(function(e){
		console.log(e.which);
		if(e.which == 27){
			$jmodal_close.click();
		}
	});

	$.jModalDefOptions = {
		onClose: function(){},
		onOpen: function(){}
	};
	
	$.fn.jModal = function(options){

		var c = $.extend($.jmodalDefOptions, options);
		var $close = $jmodal_bg.add($jmodal_close).add($('.jmodal_close', this));

		$modal = this;

		if(!$modal.is($prev_modal)){
			$jmodal_placeholder
					.after($prev_modal)
					.appendTo($jmodal_container);

			$prev_modal = $modal
				.after($jmodal_placeholder)
				.appendTo($jmodal_container);
		}

		if(!mobile){
			var diff = -$html.width() + $html.addClass('jmodal_shown').width();

			if(diff){
				$html.css('margin-right', diff);
			}

			$jmodal.css('margin-right', '');

			$(window).resize(function(){

				if($jmodal_container.outerHeight(true) > $jmodal.height()){
					$jmodal_bg.css('right', diff);
				}

				else{
					$jmodal_bg.css('right', '');
				}

				if($jmodal_container.outerWidth(true) > $jmodal.width()){
					$jmodal_bg.css('bottom', diff);
				}

				else{
					$jmodal_bg.css('bottom', '');
				}
			}).resize();
		}

		else{
			$html.addClass('jmodal_shown')

			$jmodal.css('top', $(window).scrollTop());
		}

		c.onOpen($jmodal, $modal);

		$close.click(function(e){
			$close.unbind(e);

			$html.removeClass('jmodal_shown');

			if(!mobile){
				if($jmodal_container.outerHeight(true) < $jmodal.height()){
					$jmodal.css('margin-right', -diff);
				}

				if($jmodal_container.outerWidth(true) < $jmodal.width()){
					$jmodal_bg.css('bottom', diff);
				}

				$jmodal_bg.css('right', '');
				$html.css('margin-right', '');
			}

			c.onClose($jmodal, $modal);
		});

		return this;
	};
	
})(jQuery);