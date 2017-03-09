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
	var broccoli;

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
				$canvasContent.html('').append(html);

				$canvasContent.find('[name=infoJson]').val( moduleCode.infoJson );
				$canvasContent.find('[name=template]').val( moduleCode.template );
				$canvasContent.find('[name=templateExt]').val( moduleCode.templateExt );
				$canvasContent.find('[name=css]').val( moduleCode.css );
				$canvasContent.find('[name=cssExt]').val( moduleCode.cssExt );
				$canvasContent.find('[name=js]').val( moduleCode.js );
				$canvasContent.find('[name=jsExt]').val( moduleCode.jsExt );
				$canvasContent.find('[name=finalizeJs]').val( moduleCode.finalizeJs );

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
						save(function(result){
							broccoli.saveContents(function(result){
								$(window).off('resize.editModule');
								px2me.loadPage('list', {}, function(){
									px2me.closeModal();
								});
							});
						});
					})
				]
			});
			$canvasContent.find('button')
				.on('click', function(){
					save(function(result){
						loadBroccoli(function(){
						});
					});
				})
			;
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// broccoli-html-editor インスタンスを生成
			loadBroccoli(function(){
				$(window).on('resize.editModule', function(){
					console.log('--- window resized.');
					broccoli.redraw();
				});
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
		// console.log('data =',data);

		px2me.saveModuleCode(options.moduleId, data, function(result){
			callback(result);
		});
		return;
	}
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
	}

}
