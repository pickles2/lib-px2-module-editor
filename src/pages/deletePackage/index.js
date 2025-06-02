/**
 * pages/deletePackage/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};

	var $ = require('jquery');

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading deletePackage page...');
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
					alert(px2me.lb().get('ui_message.this_module_is_in_a_path_that_does_not_allow_editing'));
					rjt();
					return;
				}
				var html = px2me.bindEjs(
					px2me.getTemplates('deletePackage'),
					{
						'packageId': options.packageId,
						'packageCode': packageCode
					}
				);
				$canvasContent.html('').append(html);
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": px2me.lb().get('ui_label.modal_title.delete_package'),
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--danger">')
						.text(px2me.lb().get('ui_label.delete'))
						.click(function(){
							px2me.deletePackage(options.packageId, function(result){
								px2me.loadPage('list', {}, function(){
									px2me.closeModal();
								});
							})

						})
				],
				"buttonsSecondary": [
					$('<button class="px2-btn">')
						.text(px2me.lb().get('ui_label.cancel'))
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
