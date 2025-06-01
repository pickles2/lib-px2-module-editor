/**
 * Pickles2ModuleEditor
 */
(function(){
	var __dirname = (function() {
		if (document.currentScript) {
			return document.currentScript.src;
		} else {
			var scripts = document.getElementsByTagName('script'),
			script = scripts[scripts.length-1];
			if (script.src) {
				return script.src;
			}
		}
	})().replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');

	require('px2style/dist/px2style.js');
	const $ = require('jquery');
	const px2style = window.px2style;

	window.Pickles2ModuleEditor = function(){
		var $canvas,
			$canvasContent;

		var _this = this;
		this.__dirname = __dirname;
		this.options = {};
		this.moduleId;

		var px2meConf,
			px2conf,
			templates;
		var pages = {
			'list': require('./pages/list/index.js'),
			'editCategory': require('./pages/editCategory/index.js'),
			'editPackage': require('./pages/editPackage/index.js'),
			'addNewPackage': require('./pages/addNewPackage/index.js'),
			'addNewCategory': require('./pages/addNewCategory/index.js'),
			'addNewModule': require('./pages/addNewModule/index.js'),
			'deletePackage': require('./pages/deletePackage/index.js'),
			'deleteCategory': require('./pages/deleteCategory/index.js'),
			'deleteModule': require('./pages/deleteModule/index.js')
		};

		/**
		 * initialize
		 */
		this.init = function(options, callback){
			console.info('initialize pickles2-module-editor...');
			callback = callback || function(){};

			this.options = options;
			this.options.gpiBridge = this.options.gpiBridge || function(){ alert('gpiBridge required.'); };
			this.options.complete = this.options.complete || function(){ alert('finished.'); };
			this.options.moduleEditor = this.options.moduleEditor || function(moduleId){ alert('Edit module: '+moduleId); };
			this.options.onMessage = this.options.onMessage || function(message){ alert('onMessage: '+message); };
			this.options.preview = this.options.preview || {};
			this.options.lang = this.options.lang || 'en';

			$canvas = $(options.elmCanvas);
			$canvas.addClass('pickles2-module-editor');
			$canvasContent = $('<div class="pickles2-module-editor__content">');
			$canvas.html('')
				.append($canvasContent)
			;

			new Promise(function(rlv){rlv();})
				.then(function(){ return new Promise(function(rlv, rjt){
					_this.progress( function(){
						rlv();
					} );
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					_this.getConfig( function(conf){
						px2meConf = conf;
						_this.px2meConf = px2meConf;
						// console.log(px2meConf);
						rlv();
					} );
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					_this.getPickles2Config( function(conf){
						px2conf = conf;
						_this.px2conf = px2conf;

						_this.px2conf = _this.px2conf || {};
						_this.px2conf.plugins = _this.px2conf.plugins || {};
						_this.px2conf.plugins.px2dt = _this.px2conf.plugins.px2dt || {};
						_this.px2conf.plugins.px2dt.paths_module_template = _this.px2conf.plugins.px2dt.paths_module_template || {};
						rlv();
					} );
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					// テンプレートをロードする
					_this.gpiBridge(
						{
							'api':'getTemplates',
						},
						function(tpls){
							templates = tpls;
							rlv();
						}
					);
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					_this.closeProgress(function(){
						rlv();
					});
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					// 一覧ページを表示する。
					_this.loadPage('list', {}, function(){
						rlv();
					});
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					callback();
					rlv();
				}); })
			;

		}

		/**
		 * ページを表示する
		 */
		this.loadPage = function(pageName, options, callback){
			if( pageName == 'list' ){
				pages[pageName](_this, $canvasContent, options, function(){
					callback();
				});
			}else{
				var $cont = $('<div>');
				pages[pageName](_this, $cont, options, function(){
					callback();
				});
			}
			return;
		}

		/**
		 * canvas要素を取得する
		 */
		this.getElmCanvas = function(){
			return $canvas;
		}

		/**
		 * ユーザーへのメッセージを表示する
		 */
		this.message = function(message, callback){
			callback  = callback||function(){};
			this.options.onMessage(message);
			callback();
			return this;
		}

		/**
		 * Pickles 2 Module Editor のコンフィグ情報を取得する
		 */
		this.getConfig = function(callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getConfig'
				},
				function(conf){
					callback(conf);
				}
			);
			return;
		}

		/**
		 * Pickles 2 のコンフィグ情報を取得する
		 */
		this.getPickles2Config = function(callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getPickles2Config'
				},
				function(conf){
					callback(conf);
				}
			);
			return;
		}

		/**
		 * テンプレートを取得する
		 */
		this.getTemplates = function(tplName){
			return templates[tplName];
		}

		/**
		 * ejs テンプレートにデータをバインドする
		 */
		this.bindEjs = function( tpl, data, options ){
			var ejs = require('ejs');
			var rtn = '';
			try {
				var template = ejs.compile(tpl.toString(), options);
				rtn = template(data);
			} catch (e) {
				var errorMessage = 'TemplateEngine "EJS" Rendering ERROR.';
				console.log( errorMessage );
				rtn = errorMessage;
			}

			return rtn;
		}

		/**
		 * broccoli モジュールのパッケージ一覧を取得する
		 */
		this.getPackageList = function(callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getPackageList'
				},
				function(packageList){
					callback(packageList);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールのコードをすべて取得する
		 */
		this.getModuleCode = function(moduleId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getModuleCode',
					'moduleId': moduleId
				},
				function(moduleCode){
					callback(moduleCode);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールのコードの変更をすべて保存する
		 */
		this.saveModuleCode = function(moduleId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'saveModuleCode',
					'moduleId': moduleId,
					'data': data
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールカテゴリのコードをすべて取得する
		 */
		this.getCategoryCode = function(categoryId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getCategoryCode',
					'categoryId': categoryId
				},
				function(categoryCode){
					callback(categoryCode);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールカテゴリのコードの変更をすべて保存する
		 */
		this.saveCategoryCode = function(categoryId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'saveCategoryCode',
					'categoryId': categoryId,
					'data': data
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli パッケージのコードをすべて取得する
		 */
		this.getPackageCode = function(packageId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getPackageCode',
					'packageId': packageId
				},
				function(packageCode){
					callback(packageCode);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールパッケージのコードの変更をすべて保存する
		 */
		this.savePackageCode = function(packageId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'savePackageCode',
					'packageId': packageId,
					'data': data
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールパッケージを新規追加
		 */
		this.addNewPackage = function(data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'addNewPackage',
					'data': data
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールパッケージを削除
		 */
		this.deletePackage = function(packageId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'deletePackage',
					'packageId': packageId,
					'data': {}
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールカテゴリを新規追加
		 */
		this.addNewCategory = function(packageId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'addNewCategory',
					'packageId': packageId,
					'data': data
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールカテゴリを削除
		 */
		this.deleteCategory = function(categoryId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'deleteCategory',
					'categoryId': categoryId,
					'data': {}
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールを新規追加する
		 */
		this.addNewModule = function(categoryId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'addNewModule',
					'categoryId': categoryId,
					'data': data
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールを削除する
		 */
		this.deleteModule = function(moduleId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'deleteModule',
					'moduleId': moduleId,
					'data': {}
				},
				function(result){
					callback(result);
				}
			);
			return;
		}

		/**
		 * モジュールの編集ツールを開く
		 */
		this.openModuleEditor = function(moduleId){
			return this.options.moduleEditor(moduleId);
		}

		/**
		 * プログレスを表示する
		 */
		this.progress = function( callback ){
			callback = callback||function(){};
			px2style.loading({}, callback);
			return;
		}

		/**
		 * プログレスを閉じる
		 */
		this.closeProgress = function( callback ){
			callback = callback||function(){};
			px2style.closeLoading(callback);
			return;
		}

		/**
		 * ファイルをダウンロードする
		 */
		this.download = function(content, filename){
			var blob = new Blob([ content ], { "type" : "application/octet-stream" });

			if (window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(blob, filename);

				// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
				window.navigator.msSaveOrOpenBlob(blob, filename);
			} else {
				var $a = $('<a>');
				$a.attr({
					'href': window.URL.createObjectURL(blob),
					'download': filename
				}).get(0).click();
			}
			return;
		}

		/**
		* Open modal dialog.
		*/
		this.modal = function(options, callback){
			callback = callback||function(){};
			return px2style.modal(options, function(){
				callback();
			});
		}

		/**
		* Close modal dialog.
		*/
		this.closeModal = function(callback){
			callback = callback||function(){};
			return px2style.closeModal(function(){
				callback();
			});
		}

		/**
		* gpiBridgeを呼び出す
		*/
		this.gpiBridge = function(data, callback){
			data.moduleId = this.moduleId;
			return this.options.gpiBridge(data, callback);
		}

		/**
		* 再描画
		*/
		this.redraw = function( callback ){
			callback = callback || function(){};
			callback();
			return;
		}

		/**
		* 編集操作を完了する
		*/
		this.finish = function(){
			this.options.complete();
		}
	}
})();
