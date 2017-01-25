/**
 * pages/editModule/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;
	var $previewWin,
		$previewEditorWin;


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
				$canvasContent.html('').append(html);

				$canvasContent.find('[name=infoJson]').val( moduleCode.infoJson );
				$canvasContent.find('[name=template]').val( moduleCode.template );
				$canvasContent.find('[name=templateExt]').val( moduleCode.templateExt );
				$canvasContent.find('[name=css]').val( moduleCode.css );
				$canvasContent.find('[name=cssExt]').val( moduleCode.cssExt );
				$canvasContent.find('[name=js]').val( moduleCode.js );
				$canvasContent.find('[name=jsExt]').val( moduleCode.jsExt );

				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": "モジュールを編集",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--primary">').text('OK').click(function(){
						var data = {};
						data.infoJson = $canvasContent.find('[name=infoJson]').val();
						data.template = $canvasContent.find('[name=template]').val();
						data.templateExt = $canvasContent.find('[name=templateExt]').val();
						data.css = $canvasContent.find('[name=css]').val();
						data.cssExt = $canvasContent.find('[name=cssExt]').val();
						data.js = $canvasContent.find('[name=js]').val();
						data.jsExt = $canvasContent.find('[name=jsExt]').val();
						// console.log('data =',data);

						px2me.saveModuleCode(options.moduleId, data, function(result){
							px2me.loadPage('list', {}, function(){
								px2me.closeModal();
							});
						})

					})
				]
			});
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// Preview iframe の準備
			var $preview = $canvasContent.find('.pickles2-module-editor__module-edit__preview');
			var $previewIframe = $('<iframe>').attr({'src': px2me.__dirname+'/html/preview.html'});
			$preview.html('').append($previewIframe);
			$($previewIframe.get(0).contentWindow).on('load', function(){
				$previewWin = $($previewIframe.get(0).contentWindow.document).find('body');
				$previewWin.addClass('pickles2-module-editor');
				$previewWin.append('<div>preview</div>');
				rlv();
			});

		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// Preview Editor iframe の準備
			var $previewEditor = $canvasContent.find('.pickles2-module-editor__module-edit__preview-editor');
			var $previewEditorIframe = $('<iframe>').attr({'src': px2me.__dirname+'/html/preview_editor.html'});
			$previewEditor.html('').append($previewEditorIframe);
			$($previewEditorIframe.get(0).contentWindow).on('load', function(){
				$previewEditorWin = $($previewEditorIframe.get(0).contentWindow.document).find('body');
				$previewEditorWin.addClass('pickles2-module-editor');

				// bootstrap をロード
				$previewEditorWin.append( $('<link rel="stylesheet" href="'+px2me.__dirname+'/libs/bootstrap/dist/css/bootstrap.css" />') );

				// px2style をロード
				$previewEditorWin.append( $('<link rel="stylesheet" href="'+px2me.__dirname+'/libs/px2style/dist/styles.css" />') );

				// broccoli-html-editor をロード
				$previewEditorWin.append( $('<link rel="stylesheet" href="'+px2me.__dirname+'/libs/broccoli-html-editor/client/dist/broccoli.css" />') );

				$previewEditorWin.append( $('<button class="px2-btn">test</button>') );
				rlv();
			});

		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			px2me.closeProgress(function(){
				rlv();
			});
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			callback();
			rlv();
		}); })
		.catch(function(){
			px2me.closeProgress(function(){
				px2me.loadPage('list', {}, function(){
					px2me.closeModal(function(){
						callback();
					});
				});
			});
		})
	;

}
