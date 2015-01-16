/* jmodal v0.1
 * © Anatoly Lunev | toliklunev.ru | toliklunev@gmail.com
 * Licensed under the MIT License */

(function($){

	var $html;
	var $body;
	var $modal;

	var mobile = (/mobile|android|blackberry|brew|htc|j2me|lg|midp|mot|netfront|nokia|obigo|openweb|opera\ mini|palm|psp|samsung|sanyo|sch|sonyericsson|symbian|symbos|teleca|up\.browser|wap|webos|windows\ ce/i.test(navigator.userAgent.toLowerCase()));

	$(function(){
		$html = $('html');
		$body = $('body');

		if(!mobile){
			$html.addClass('desktop');
		}
	});

	$.jModalDefOptions = $.jmodalDefOptions = {
		onClose: function(){},
		onOpen: function(){}
	};
	
	$.fn.jModal = $.fn.jmodal = function(options){

		$modal = this;
			
		var $jmodal = $('<div id="jmodal"></div>').insertAfter($modal);
		var $jmodal_bg = $('<div id="jmodal_bg"></div>').appendTo($jmodal);
		var $jmodal_container = $('<div id="jmodal_container"></div>').appendTo($jmodal).append($modal);
		var $jmodal_close = $('<a id="jmodal_close"></a>').appendTo($jmodal_container);

		var c = $.extend($.jmodalDefOptions, options);
		var $close = $jmodal_bg.add($jmodal_close).add($('.jmodal_close', this));

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
			$html.addClass('jmodal_shown');
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

			$modal.insertAfter($jmodal);
			$jmodal.remove();

			c.onClose($jmodal, $modal);
		});

		return this;
	};
})(jQuery);