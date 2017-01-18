/**
 * pages/addNewCategory/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading addNewCategory page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 編集画面を描画
			// console.log(options);
			px2me.getPackageCode( options.packageId, function(packageCode){
				// console.log(packageCode);

				if( !packageCode.editable ){
					alert('このモジュールは編集許可されていないパスにあります。');
					rjt();
					return;
				}

				var html = px2me.bindEjs(
					px2me.getTemplates('addNewCategory'),
					{
						'packageId': options.packageId,
						'packageCode': packageCode
					}
				);
				$canvasContent.html('').append(html);

				$canvasContent.find('[name=categoryId]').val( '' );
				$canvasContent.find('[name=categoryName]').val( '' );
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": "新規カテゴリを追加",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--primary">').text('OK').click(function(){
						var data = {};
						data.categoryId = $canvasContent.find('[name=categoryId]').val();
						data.categoryName = $canvasContent.find('[name=categoryName]').val();

						px2me.addNewCategory(options.packageId, data, function(result){
							px2me.closeModal();
							px2me.loadPage('list', {}, function(){});
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
				px2me.closeModal();
				px2me.loadPage('list', {}, function(){
					callback();
				});
			});
		})
	;

}
