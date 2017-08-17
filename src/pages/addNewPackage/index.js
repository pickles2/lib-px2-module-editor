/**
 * pages/addNewPackage/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading addNewPackage page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 編集画面を描画
			var html = px2me.bindEjs(
				px2me.getTemplates('addNewPackage'),
				{}
			);
			$canvasContent.html('').append(html);

			$canvasContent.find('[name=packageId]').val( '' );
			$canvasContent.find('[name=packageName]').val( '' );
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": "新規パッケージを追加",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn">').text('キャンセル').click(function(){
						px2me.loadPage('list', {}, function(){
							px2me.closeModal();
						});
					}),
					$('<button class="px2-btn px2-btn--primary">').text('OK').click(function(){
						var data = {};
						data.packageId = $canvasContent.find('[name=packageId]').val();
						data.packageName = $canvasContent.find('[name=packageName]').val();

						px2me.addNewPackage(data, function(result){
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
