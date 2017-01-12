/**
 * pages/editModule/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;

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
			// イベントをセット
			$canvasContent.find('button.pickles2-module-editor__save').on('click', function(e){
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
