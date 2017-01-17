/**
 * pages/editCategory/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading editCategory page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 編集画面を描画
			// console.log(options);
			px2me.getCategoryCode( options.categoryId, function(categoryCode){
				// console.log(categoryCode);

				if( !categoryCode.editable ){
					alert('このモジュールは編集許可されていないパスにあります。');
					rjt();
					return;
				}

				var html = px2me.bindEjs(
					px2me.getTemplates('editCategory'),
					{
						'categoryId': options.categoryId,
						'categoryCode': categoryCode
					}
				);
				$canvasContent.html('').append(html);

				$canvasContent.find('[name=infoJson]').val( categoryCode.infoJson );
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": "カテゴリを編集する",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--primary">').text('OK').click(function(){
						var data = {};
						data.infoJson = $canvasContent.find('[name=infoJson]').val();

						px2me.saveCategoryCode(options.categoryId, data, function(result){
							px2me.closeModal(function(){
								px2me.loadPage('list', {}, function(){});
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
				px2me.closeModal(function(){
					px2me.loadPage('list', {}, function(){
						callback();
					});
				});
			});
		})
	;

}
