/**
 * pages/addNewModule/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading addNewModule page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 編集画面を描画
			px2me.getCategoryCode( options.categoryId, function(categoryCode){

				if( !categoryCode.editable ){
					alert(px2me.lb().get('ui_message.this_module_is_in_a_path_that_does_not_allow_editing'));
					rjt();
					return;
				}

				var html = px2me.bindEjs(
					px2me.getTemplates('addNewModule'),
					{
						'categoryId': options.categoryId,
						'categoryCode': categoryCode
					}
				);
				$canvasContent.html('').append(html);

				$canvasContent.find('[name=moduleId]').val( '' );
				$canvasContent.find('[name=moduleName]').val( '' );
				rlv();
			} );

		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			px2me.modal({
				"title": px2me.lb().get('ui_label.modal_title.add_a_new_module'),
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--primary">')
						.text(px2me.lb().get('ui_label.ok'))
						.on('click', function(){
							var data = {};
							data.moduleId = $canvasContent.find('[name=moduleId]').val();
							data.moduleName = $canvasContent.find('[name=moduleName]').val();
							data.moduleType = $canvasContent.find('[name=moduleType]:checked').val();
							px2me.addNewModule(options.categoryId, data, function(result){
								px2me.loadPage('list', {}, function(){
									px2me.closeModal();
								});
							});
						})
				],
				"buttonsSecondary": [
					$('<button class="px2-btn">')
						.text(px2me.lb().get('ui_label.cancel'))
						.on('click', function(){
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
