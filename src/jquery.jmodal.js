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
			var vars = $(this).data('jmodal-vars');
			
			if(typeof vars !== 'object'){
				vars = eval('('+ vars +')');
			}

			$(this).click(function(e){
				e.preventDefault();
				$modal.jModal({
					vars: vars || null
				});
			});
		});
	});
	
	$(window).keydown(function(e){
		if(e.which == 27){
			$jmodal_close.click();
		}
	});

	$.jModalDefOptions = {
		onClose: $.noop,
		onOpen: $.noop,
		vars: null
	};
	
	$.fn.jModal = function(options){

		var c = $.extend($.jModalDefOptions, options);
		var $close = $jmodal_bg.add($jmodal_close).add($('.jmodal_close', this));

		$modal = this;
		
		if(c.vars){
			var $inputs = $([]);
			var $containers = $([]);
			
			$modal.find('*').each(function(){
				var expr = new RegExp(/{{(.*)}}/);
				
				if($(this).is('input')){
					var $input = $(this);
					var val = $input.val();
					var res = expr.exec(val);
					
					if(res){
						var newVal = c.vars[res[1]];
						
						if(newVal){
							$input.val(newVal);
							$input.data('jmodal-var', res[0]);
							$inputs = $inputs.add($input);
						}
					}
				}
				
				else{
					$(this).contents().each(function(){
						
						if(this.nodeType === 3 && $.trim(this.nodeValue)){
							
							var res = expr.exec(this.nodeValue);
							
							if(res){
								var newVal = c.vars[res[1]];
								
								if(newVal){
									
									var $container = $(this).parent();
									$container.text(res.input.replace(res[0], newVal))
									$container.data('jmodal-text-node', res.input);
									$containers = $inputs.add($container);
								}
							}
							
						}
						
					});
				}
			
			});
		}

		/*
			Если это не то окно, которое было открыто в прошлый раз
		 */
		if(!$modal.is($prev_modal)){
			$jmodal_placeholder
					.after($prev_modal)
					.appendTo($jmodal_container);

			$prev_modal = $modal
				.after($jmodal_placeholder)
				.appendTo($jmodal_container);
		}

		if(!mobile){
			var $fixed = $('*').filter(function(){
				return $(this).css('position') === 'fixed'
			}).not($jmodal).not($jmodal_bg);
			
			$fixed.each(function(){
				$(this).css('max-width', $(this).outerWidth());
			});
			
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
			$fixed.css('max-width', '');
			
			
			$inputs.each(function(){
				var $input = $(this);
				$input.val($input.data('jmodal-var'));
			});
			
			$containers.each(function(){
				var $container = $(this);
				$container.text($container.data('jmodal-text-node'));
			});

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