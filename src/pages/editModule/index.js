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
			console.log(options);
			px2me.getModuleCode( options.moduleId, function(getModuleCode){
				console.log(getModuleCode);

				var html = px2me.bindEjs(
					px2me.getTemplates('editModule'),
					{
						'moduleId': options.moduleId,
						'getModuleCode': getModuleCode
					}
				);
				$canvasContent.html('').append(html);
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// イベントをセット
			$canvasContent.find('button.pickles2-module-editor__save').on('click', function(e){
				alert('開発中です。');
				px2me.closeModal(function(){
					px2me.loadPage('list', {}, function(){});
				});
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
	;

}
