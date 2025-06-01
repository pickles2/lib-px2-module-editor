/**
 * pages/deleteModule/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var $deleteModuleWindow,
		$previewWin,
		$previewEditorWin;
	var broccoli;
	var currentTab;

	px2me.moduleId = options.moduleId;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading deleteModule page...');
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
					px2me.getTemplates('deleteModule'),
					{
						'moduleId': options.moduleId,
						'moduleCode': moduleCode
					}
				);
				$deleteModuleWindow = $(html);
				$canvasContent.html('').append($deleteModuleWindow);

				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": "モジュールを削除",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--danger">')
						.text('削除する')
						.on('click', function(){
							px2me.deleteModule(options.moduleId, function(result){
								px2me.loadPage('list', {}, function(){
									px2me.closeModal();
								});
							});
						})
				],
				"buttonsSecondary": [
					$('<button class="px2-btn">')
						.text('キャンセル')
						.click(function(){
							px2me.loadPage('list', {}, function(){
								px2me.closeModal();
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
