/**
 * pages/addNewPackage/index.js
 */
module.exports = function(px2me, $canvasContent, options, callback){
	callback = callback||function(){};
	var $ = require('jquery');
	var utils79 = require('utils79');
	var Promise = require('es6-promise').Promise;
	var pluginPackages = [],
		broccoliPackages = [];

	new Promise(function(rlv){rlv();})
		.then(function(){ return new Promise(function(rlv, rjt){
			console.log('loading addNewPackage page...');
			px2me.progress( function(){
				rlv();
			} );
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// インポート元の一覧を取得 - プラグインパッケージより
			px2me.gpiBridge(
				{
					'api':'getPluginPackage'
				},
				function(packages){
					try {
						pluginPackages = packages.package_list.broccoliModules;
					} catch (e) {
					}
					// console.log(pluginPackages);
					rlv();
				}
			);
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// インポート元の一覧を取得 - broccoliより
			px2me.getPackageList(function(packageList){
				try {
					broccoliPackages = packageList;
				} catch (e) {
				}
				// console.log(broccoliPackages);
				rlv();
			});
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// 編集画面を描画
			var html = px2me.bindEjs(
				px2me.getTemplates('addNewPackage'),
				{
					'pluginPackages': pluginPackages,
					'broccoliPackages': broccoliPackages
				}
			);
			$canvasContent.html('').append(html);

			$canvasContent.find('[name=packageId]').val( '' );
			$canvasContent.find('[name=packageName]').val( '' );
			$canvasContent.find('input[type=radio][name=import_from]').on('change', function(){
				var $checkedRadio = $canvasContent.find('input[type=radio][name=import_from]:checked');

				var $inputId = $canvasContent.find('[name=packageId]');
				var isInchangedId = $inputId.attr('placeholder') == $inputId.val();
				$inputId.attr( {'placeholder':$checkedRadio.attr('data-package-id')} );
				if((isInchangedId || !$inputId.val().length) && $checkedRadio.attr('data-package-id').length){
					$inputId.val( $checkedRadio.attr('data-package-id') );
				}

				var $inputName = $canvasContent.find('[name=packageName]');
				var isInchangedName = $inputName.attr('placeholder') == $inputName.val();
				$inputName.attr( {'placeholder':$checkedRadio.attr('data-package-name')} );
				if((isInchangedName || !$inputName.val().length) && $checkedRadio.attr('data-package-name').length){
					$inputName.val( $checkedRadio.attr('data-package-name') );
				}
			});
			rlv();
		}); })
		.then(function(){ return new Promise(function(rlv, rjt){
			// モーダルダイアログを開く
			var modalObj = px2style.modal({
				"title": "新規パッケージを追加",
				"body": $canvasContent,
				"buttons": [
					$('<button class="px2-btn px2-btn--primary">')
						.text('OK')
						.on('click', function(){
							px2style.loading();
							modalObj.lock();

							var data = {};
							data.packageId = $canvasContent.find('[name=packageId]').val();
							data.packageName = $canvasContent.find('[name=packageName]').val();
							data.importFrom = $canvasContent.find('[name=import_from]:checked').val();
							data.force = $canvasContent.find('[name=force]:checked').val();

							px2me.addNewPackage(data, function(result){
								px2style.closeLoading();
								modalObj.unlock();
								if( !result.result ){
									alert(result.msg);
									return;
								}
								px2me.loadPage('list', {}, function(){
									px2style.closeModal();
								});
							});
						})
				],
				"buttonsSecondary": [
					$('<button class="px2-btn">')
						.text('キャンセル')
						.on('click', function(){
							px2me.loadPage('list', {}, function(){
								px2style.closeModal();
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
					px2style.closeModal(function(){
						callback();
					});
				});
			});
		})
	;

}
