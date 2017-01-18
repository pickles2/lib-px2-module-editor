/**
 * modal.js
 */
module.exports = function(px2me, $canvasModal){
	var $ = require('jquery');
	var $modal;

	/**
	 * ダイアログを表示する
	 */
	px2me.modal = function(opt){
		px2me.closeModal();

		opt = opt||{};
		opt.title = opt.title||'command:';
		opt.body = opt.body||$('<div>');
		opt.buttons = opt.buttons||[
			$('<button class="px2-btn px2-btn--primary">').text('OK').click(function(){
				px2me.closeModal();
			})
		];

		for( var i in opt.buttons ){
			var $btnElm = $(opt.buttons[i]);
			$btnElm.each(function(){
				if(!$(this).hasClass('btn') && !$(this).hasClass('px2-btn')){
					$(this).addClass('px2-btn');
				}
			});
			opt.buttons[i] = $btnElm;
		}

		var $modalButtons = $('<div class="pickles2-module-editor__modal__buttons">').append(opt.buttons);

		$modal = $('<div>')
			.addClass('pickles2-module-editor__modal__inner')
			.append( $('<div>')
				.addClass('pickles2-module-editor__modal__inner-box')
				.append( $('<div>')
					// .addClass('modal_box')
					.css({
						'width':'80%',
						'margin':'3em auto'
					})
					.append( $('<h1>')
						.text(opt.title)
					)
					.append( $('<div>')
						.append(opt.body)
					)
					.append( $modalButtons )
				)
			)
		;

		$canvasModal
			.append($modal)
		;
		$canvasModal.find('*')
			.attr({
				'tabindex': '-1'
			})
		;
		$modal.find('*')
			.removeAttr('tabindex')
		;
		$canvasModal.show();
		return $modal;
	}//modal()

	/**
	 * ダイアログを閉じる
	 */
	px2me.closeModal = function(){
		if( $modal ){
			$modal.remove();
			$canvasModal.find('*')
				.removeAttr('tabindex')
			;
			$canvasModal.hide();
		}
		return $modal;
	}//closeModal()

	/**
	 * イベントリスナー
	 */
	$(window).on( 'resize', function(e){
		if( typeof($modal) !== typeof( $('<div>') ) ){return;}
		$modal
			.css({
				'height': $(window).height()
			})
		;
	} );

}
