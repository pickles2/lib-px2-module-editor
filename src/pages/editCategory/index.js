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
			px2me.getCategoryCode( options.moduleId, function(getCategoryCode){
				// console.log(getCategoryCode);

				if( !getCategoryCode.editable ){
					alert('このモジュールは編集許可されていないパスにあります。');
					rjt();
					return;
				}

				var html = px2me.bindEjs(
					px2me.getTemplates('editCategory'),
					{
						'moduleId': options.moduleId,
						'getCategoryCode': getCategoryCode
					}
				);
				$canvasContent.html('').append(html);

				// $canvasContent.find('[name=infoJson]').val( getCategoryCode.infoJson );
				// $canvasContent.find('[name=template]').val( getCategoryCode.template );
				// $canvasContent.find('[name=templateExt]').val( getCategoryCode.templateExt );
				// $canvasContent.find('[name=css]').val( getCategoryCode.css );
				// $canvasContent.find('[name=cssExt]').val( getCategoryCode.cssExt );
				// $canvasContent.find('[name=js]').val( getCategoryCode.js );
				// $canvasContent.find('[name=jsExt]').val( getCategoryCode.jsExt );
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// イベントをセット
			$canvasContent.find('button.pickles2-module-editor__save').on('click', function(e){
				var data = {};
				// data.infoJson = $canvasContent.find('[name=infoJson]').val();
				// data.template = $canvasContent.find('[name=template]').val();
				// data.templateExt = $canvasContent.find('[name=templateExt]').val();
				// data.css = $canvasContent.find('[name=css]').val();
				// data.cssExt = $canvasContent.find('[name=cssExt]').val();
				// data.js = $canvasContent.find('[name=js]').val();
				// data.jsExt = $canvasContent.find('[name=jsExt]').val();

				px2me.saveModuleCode(options.moduleId, data, function(result){
					px2me.closeModal(function(){
						px2me.loadPage('list', {}, function(){});
					});
				})
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
