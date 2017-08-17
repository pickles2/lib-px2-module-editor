/**
 * pages/editModule/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;
	var $editModuleWindow,
		$previewWin,
		$previewEditorWin;
	var broccoli;
	var currentTab;

	px2me.moduleId = options.moduleId;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading editModule page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 編集画面を描画
			// console.log(options);
			console.log('module ID:', options.moduleId);
			px2me.getModuleCode( options.moduleId, function(moduleCode){
				// console.log(moduleCode);

				if( !moduleCode.editable ){
					alert('このモジュールは編集許可されていないパスにあります。');
					rjt();
					return;
				}

				var html = px2me.bindEjs(
					px2me.getTemplates('editModule'),
					{
						'moduleId': options.moduleId,
						'moduleCode': moduleCode
					}
				);
				$editModuleWindow = $(html);
				$canvasContent.html('').append($editModuleWindow);

				$editModuleWindow.find('[name=infoJson]').val( moduleCode.infoJson );
				$editModuleWindow.find('[name=template]').val( moduleCode.template );
				$editModuleWindow.find('[name=templateExt]').val( moduleCode.templateExt );
				$editModuleWindow.find('[name=css]').val( moduleCode.css );
				$editModuleWindow.find('[name=cssExt]').val( moduleCode.cssExt );
				$editModuleWindow.find('[name=js]').val( moduleCode.js );
				$editModuleWindow.find('[name=jsExt]').val( moduleCode.jsExt );
				$editModuleWindow.find('[name=finalizeJs]').val( moduleCode.finalizeJs );
				$editModuleWindow.find('[name=clipJson]').val( moduleCode.clipJson );

				$editModuleWindow.find('.pickles2-module-editor__module-edit__tab button').on('click', function(e){
					// タブ切り替え
					var $this = $(this);
					var target = $this.attr('data-pickles2-module-editor-target');
					changeTabTo(target);
				})
				windowResizedEvent();
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": "モジュールを編集",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn">').text('キャンセル').click(function(){
						px2me.loadPage('list', {}, function(){
							px2me.closeModal();
						});
					}),
					$('<button class="px2-btn px2-btn--primary">')
						.text('SAVE & CLOSE')
						.on('click', function(){
							save(function(result){
								$(window).off('resize.editModule');
								px2me.loadPage('list', {}, function(){
									px2me.closeModal();
								});
							});
						})
				]
			});
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			px2me.closeProgress(function(){
				rlv();
			});
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 画面の調整
			windowResizedEvent();
			$(window).on('resize.editModule', function(){
				windowResizedEvent();
			});

			callback();
			rlv();
		}); })
		.catch(function(){
			windowResizedEvent();

			px2me.closeProgress(function(){
				px2me.loadPage('list', {}, function(){
					px2me.closeModal(function(){
						callback();
					});
				});
			});
		})
	;

	function save(callback){
		callback = callback || function(){};
		var data = {};
		data.infoJson = $canvasContent.find('[name=infoJson]').val();
		data.template = $canvasContent.find('[name=template]').val();
		data.templateExt = $canvasContent.find('[name=templateExt]').val();
		data.css = $canvasContent.find('[name=css]').val();
		data.cssExt = $canvasContent.find('[name=cssExt]').val();
		data.js = $canvasContent.find('[name=js]').val();
		data.jsExt = $canvasContent.find('[name=jsExt]').val();
		data.finalizeJs = $canvasContent.find('[name=finalizeJs]').val();
		data.clipJson = $canvasContent.find('[name=clipJson]').val();
		// console.log('data =',data);

		px2me.saveModuleCode(options.moduleId, data, function(result){
			callback(result);
		});
		return;
	}

	/**
	 * broccoli-html-editorをロードしてプレビュー画面を生成する
	 */
	function loadBroccoli(callback){
		callback = callback || function(){};

		px2me.gpiBridge(
			{
				'api':'download',
				'target': 'css'
			},
			function(cssBin){
				px2me.gpiBridge(
					{
						'api':'download',
						'target': 'js'
					},
					function(jsBin){
						var $frame = $canvasContent
							.find('.pickles2-module-editor__module-edit__preview')
						;
						var $canvas = $('<div>');
						var $palette = $('<div>');
						$frame.html('').append($canvas).append($palette);
						$canvas.attr({
							"data-broccoli-preview": px2me.__dirname+'/html/preview.html'
								+'?css='+encodeURIComponent(utils79.base64_encode(cssBin))
								+'&js='+encodeURIComponent(utils79.base64_encode(jsBin))
						});

						px2me.createBroccoli(
							{
								'elmCanvas': $canvas.get(0),
								'elmModulePalette': $palette.get(0)
							},
							function(b){
								broccoli = b;
								callback();
							}
						);
					}
				);
			}
		);

		return;
	} // loadBroccoli();

	/**
	 * broccoli-html-editorをアンロードする
	 */
	function unloadBroccoli(callback){
		callback = callback || function(){};

		var $frame = $canvasContent
			.find('.pickles2-module-editor__module-edit__preview')
		;
		$frame.html('');

		broccoli = undefined;
		delete(broccoli);
		callback();

		return;
	} // unloadBroccoli();


	function changeTabTo(target){
		if(target){
			currentTab = target;
		}
		if(!target){
			currentTab = 'html'; // デフォルトのタブ
		}
		$editModuleWindow.find('.pickles2-module-editor__module-edit__tab *').removeAttr('disabled');
		$editModuleWindow.find('.pickles2-module-editor__module-edit__tab *[data-pickles2-module-editor-target='+currentTab+']').attr({'disabled': 'disabled'});

		$editModuleWindow.find('.pickles2-module-editor__module-edit__layout__content').hide();
		var $targetTab = $editModuleWindow.find('.pickles2-module-editor__module-edit__layout__content--'+currentTab).show();
		$targetTab.show();
		var height_h2 = $targetTab.find('h2').outerHeight();
		var height_select = $targetTab.find('select').outerHeight();
		$targetTab.find('textarea').css({
			'height': $editModuleWindow.innerHeight() - 60 - height_h2 - height_select
		});

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){
				if( currentTab == 'preview' ){
					px2me.progress( function(){
						save(function(result){
							loadBroccoli(function(){
								px2me.closeProgress(function(){
									rlv();
								});
							});
						});
					} );
				}else{
					unloadBroccoli(function(){
						rlv();
					});
				}
			}); })
		;
	}

	function windowResizedEvent(){
		console.log('--- window resized.');
		$editModuleWindow.css({
			'height': function(){
				return $(window).innerHeight() - 200;
			}
		})
		changeTabTo();
		if(broccoli){
			broccoli.redraw();
		}
	}

}
