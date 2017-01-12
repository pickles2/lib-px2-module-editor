/**
 * pages/list/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading list page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 一覧を描画
			px2me.getPackageList( function(packageList){
				// console.log(packageList);

				var html = px2me.bindEjs(
					px2me.getTemplates('list'),
					{'packageList': packageList}
				);
				$canvasContent.html('').append(html);
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// イベントをセット
			$canvasContent.find('button').on('click', function(e){
				var $this = $(this);
				var act = $this.attr('data-pickles2-module-editor--action');
				var target = $this.attr('data-pickles2-module-editor--target');
				console.log(this);
				switch(act){
					case 'editPackage':
						px2me.loadPage('editPackage', {'moduleId': target}, function(){});
						break;
					case 'editCategory':
						px2me.loadPage('editCategory', {'moduleId': target}, function(){});
						break;
					case 'addNewCategory':
						px2me.loadPage('addNewCategory', {'moduleId': target}, function(){});
						break;
					case 'editModule':
						px2me.loadPage('editModule', {'moduleId': target}, function(){});
						break;
					case 'addNewModule':
						px2me.loadPage('addNewModule', {'moduleId': target}, function(){});
						break;
					default:
						alert('ERROR: unknown action. - '+act);
						break;
				}
				return false;
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
