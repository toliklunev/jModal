/* jmodal v0.2.0
 * © Anatoly Lunev | toliklunev.ru | toliklunev@gmail.com
 * Licensed under the MIT License */

(function($){
  
  var $html;
  var $body;
  
  
  function jModal() {
    
    var self = this;
    
    this.$wrap        = $('<div id="jmodal"></div>');
    this.$bg          = $('<div id="jmodal-bg"></div>')
    this.$container   = $('<div id="jmodal-container"></div>')
    this.$placeholder = $('<div id="jmodal-placeholder"></div>');
    this.$close       = $('<a id="jmodal-close">&times;</a>');
    this.$prev;
    this.$modal;
    this.$fixed;
    
    this.$bg.appendTo(this.$wrap);
    this.$container.appendTo(this.$wrap);
    this.$close.appendTo(this.$container);
  
    this.isMobile = (/mobile|android|blackberry|brew|htc|j2me|lg|midp|mot|netfront|nokia|obigo|openweb|opera\ mini|palm|psp|samsung|sanyo|sch|sonyericsson|symbian|symbos|teleca|up\.browser|wap|webos|windows\ ce/i
    .test(navigator.userAgent.toLowerCase()));
  
    this.defOptions = $.extend($.jModalDefOptions, {
      onClose: $.noop,
      onOpen: $.noop,
      label: false,
      vars: null
    });
    
    this.shown = false;
    
    this.$bg.click(function(){
      self.close();
    });
    
    this.$close.click(function(){
      self.close();
    });
    
    this.varNodes = [];
  };
  
  jModal.prototype.open = function(modal, options){
    
    this.curOptions = $.extend(this.defOptions, options);
    
    if (typeof modal == 'string') {
      this.$modal = $(modal);
    }
    
    else {
      this.$modal = modal;
    }
    
    if(this.curOptions.vars){
      this.replaceVarNodes();
    }
    
    /*
      Если это не то окно, которое было открыто в прошлый раз
     */
    if(this.$modal.not(this.$prev)){
      
      if(this.$prev){
        this.$placeholder.after(this.$prev)
      }
      
      this.$modal.after(this.$placeholder)
      this.$modal.appendTo(this.$container);
      
      this.$prev = this.$modal;
    }
    
    if(!this.isMobile){
      this.diff = (-1 * $html.width()) + $html.addClass('jmodal-shown').width();
      
      if(this.diff){
        $html.css('margin-right', this.diff);
      }
      
      this.$wrap.css('margin-right', '');
      
      this.fixWidth();
    }
    
    else{
      $html.addClass('jmodal-shown')
      this.$wrap.css('top', $(window).scrollTop());
    }
    
    if(this.curOptions.label){
      this.$wrap.attr('data-jmodal-label', this.curOptions.label);
    }
    
    this.shown = true;
    
    this.curOptions.onOpen.call(this, this.$wrap, this.$modal);
  };
  
  jModal.prototype.close = function(){
    this.shown = false;
    this.$wrap.removeAttr('data-jmodal-label');
    this.$fixed.css('max-width', '');
    $html.removeClass('jmodal-shown');
    
    if(this.varNodes.length){
      this.restoreVarNodes();
    }
    
    if(!this.isMobile){
      if(this.$container.outerHeight(true) < this.$wrap.height()){
        this.$wrap.css('margin-right', (-1) * this.diff);
      }

      if(this.$container.outerWidth(true) < this.$wrap.width()){
        this.$bg.css('bottom', this.diff);
      }

      this.$bg.css('right', '');
      $html.css('margin-right', '');
    }
    
    this.curOptions.onClose.call(this, this.$wrap, this.$modal);
  };
  
  jModal.prototype.fixWidth = function(){
    
    this.$fixed = $('*').filter(function(){
      return $(this).css('position') === 'fixed';
    }).not(this.$wrap).not(this.$bg);
    
    this.$fixed.each(function(){
      $(this).css('max-width', $(this).outerWidth());
    });
  };
  
  jModal.prototype.replaceVarNodes = function(){
    
    var self = this;
    
    this.$modal.find('*').each(function(){
      
      $.map(this.attributes, function(attr){
        self.processVarNode(attr);
      });
      
      $(this).contents().each(function(){
        if(this.nodeType === 3 && $.trim(this.nodeValue)){
          self.processVarNode(this);
        }
      });
    
    });
  };
  
  jModal.prototype.processVarNode = function(node){
    
    var expr = new RegExp(/{{(.*)}}/);
    var val = node.nodeValue;
    var res = expr.exec(val);
    
    if(res){
      var newVal = this.curOptions.vars[res[1]];
      
      if(newVal){
        node.nodeValue = val.replace(res[0], newVal);
        
        this.varNodes.push({
          node: node,
          val: val
        });
      }
    }
  };
  
  jModal.prototype.restoreVarNodes = function(){
    $.map(this.varNodes, function(data){
      data.node.nodeValue = data.val;
    });
  };
  
  jModal.prototype.search = function(selector, context){
    var $obj = $(selector, context);
    
    if(!$obj.length){
      var $parent = $obj.parent();
      
      if($parent.length){
        return this.search(selector, $parent);
      }
      
      else{
        return $([]);
      }
    }
    
    else{
      return $obj;
    }
  };
  
  $.jModal = new jModal();
  
  $(function(){
    $html = $('html');
    $body = $('body');
    
    $.jModal.$wrap.appendTo($body);

    if($.jModal.isMobile){
      $.jModal.$bg.appendTo($body);
    }

    else{
      $html.addClass('desktop');
    }
  });
  
  $(window).keydown(function(e){
    if(e.which == 27){
      $.jModal.close();
    }
  });
  
  $(window).bind('resize.jmodal', function(){
    
    if(!$.jModal.shown || $.jModal.isMobile){
      return;
    }
    
    if($.jModal.$container.outerHeight(true) > $.jModal.$wrap.height()){
      $.jModal.$bg.css('right', $.jModal.diff);
    }

    else{
      $.jModal.$bg.css('right', '');
    }

    if($.jModal.$container.outerWidth(true) > $.jModal.$wrap.width()){
      $.jModal.$bg.css('bottom', $.jModal.diff);
    }

    else{
      $.jModal.$bg.css('bottom', '');
    }
  });
  
  $(document).on('click', '.jmodal-close', function(e){
    e.preventDefault();
    $.jModal.close();
  });
  
  $(document).on('click', '[data-jmodal-init]', function(e){
    e.preventDefault();
    var selector = $(this).data('jmodal-init');
    var vars = $(this).data('jmodal-vars');
    
    if(selector[0] == '#'){
      var $modal = $(selector);
    }
    
    else{
      var $modal = $.jModal.search(selector, this);
    }
    
    if(typeof vars !== 'object'){
      vars = eval('('+ vars +')');
    }
    
    $.jModal.open($modal, {
      vars: vars || null,
      label: selector
    });
  });
  
  $.fn.jModal = function(options){
    $.jModal.open(this, options);
    return this;
  };
  
})(jQuery);