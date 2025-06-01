/**
 * pages/list/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');

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
				var html = px2me.bindEjs(
					px2me.getTemplates('list'),
					{
						'packageList': packageList,
						'px2conf': px2me.px2conf
					}
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
				// console.log(this);
				switch(act){
					case 'download':
						px2me.gpiBridge(
							{
								'api':'download',
								'target': target
							},
							function(bin){
								px2me.download(bin, 'content.'+target);
							}
						);
						break;
					case 'addNewPackage':
						px2me.loadPage('addNewPackage', {}, function(){});
						break;
					case 'editPackage':
						px2me.loadPage('editPackage', {'packageId': target}, function(){});
						break;
					case 'deletePackage':
						px2me.loadPage('deletePackage', {'packageId': target}, function(){});
						break;
					case 'addNewCategory':
						px2me.loadPage('addNewCategory', {'packageId': target}, function(){});
						break;
					case 'editCategory':
						px2me.loadPage('editCategory', {'categoryId': target}, function(){});
						break;
					case 'deleteCategory':
						px2me.loadPage('deleteCategory', {'categoryId': target}, function(){});
						break;
					case 'addNewModule':
						px2me.loadPage('addNewModule', {'categoryId': target}, function(){});
						break;
					case 'editModule':
						// 外部のモジュールエディタを開く
						px2me.openModuleEditor(target);
						break;
					case 'deleteModule':
						px2me.loadPage('deleteModule', {'moduleId': target}, function(){});
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
