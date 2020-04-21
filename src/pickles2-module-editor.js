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

	window.Pickles2ModuleEditor = function(){
		var $ = require('jquery');
		var Promise = require('es6-promise').Promise;
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
			'editModule': require('./pages/editModule/index.js'),
			'editCategory': require('./pages/editCategory/index.js'),
			'editPackage': require('./pages/editPackage/index.js'),
			'addNewPackage': require('./pages/addNewPackage/index.js'),
			'addNewCategory': require('./pages/addNewCategory/index.js'),
			'addNewModule': require('./pages/addNewModule/index.js'),
			'deletePackage': require('./pages/deletePackage/index.js'),
			'deleteCategory': require('./pages/deleteCategory/index.js'),
			'deleteModule': require('./pages/deleteModule/index.js')
		};
		var px2ce;

		/**
		* initialize
		*/
		this.init = function(options, callback){
			console.info('initialize pickles2-module-editor...');
			callback = callback || function(){};
			// console.log(options);

			this.options = options;
			this.options.gpiBridge = this.options.gpiBridge || function(){ alert('gpiBridge required.'); };
			this.options.complete = this.options.complete || function(){ alert('finished.'); };
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
					px2ce = new window.Pickles2ContentsEditor();
					px2ce.init(
						{
							'page_path': '/px2me-dummy.html' , // <- 編集対象ページのパス
							'elmCanvas': document.createElement('div'), // <- 編集画面を描画するための器となる要素
							'lang': _this.options.lang, // language
							'preview':{ // プレビュー用サーバーの情報を設定します。
								'origin': window.location.origin
							},
							'customFields': {},
							'gpiBridge': function(input, callback){
								// GPI(General Purpose Interface) Bridge
								// broccoliは、バックグラウンドで様々なデータ通信を行います。
								// GPIは、これらのデータ通信を行うための汎用的なAPIです。
								_this.gpiBridge(
									{
										'api':'px2ceBridge',
										'forPx2CE': input
									},
									function(result){
										callback(result);
									}
								);
								return;
							},
							'complete': function(){
								alert('完了しました。');
							},
							'onClickContentsLink': function( uri, data ){
								alert('編集: ' + uri);
							},
							'onMessage': function( message ){
								// ユーザーへ知らせるメッセージを表示する
								console.info('message: '+message);
							}
						},
						function(){
							// スタンバイ完了したら呼び出されるコールバックメソッドです。
							console.info('pickles2-contents-editor standby!!');
							rlv();
						}
					);

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
						// console.log(px2conf);
						rlv();
					} );
				}); })
				.then(function(){ return new Promise(function(rlv, rjt){
					// テンプレートをロードする
					_this.gpiBridge(
						{
							'api':'getTemplates'
						},
						function(tpls){
							// console.log(tpls);
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

		} // init()

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
			// console.info(message);
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
		 * broccoli インスタンスを生成する
		 */
		this.createBroccoli = function(options, callback){
			options = options||{};
			callback = callback||function(){};
			var broccoli = new Broccoli();
			px2ce.createBroccoliInitOptions(function(broccoliInitOptions){
				for(var key in options){
					broccoliInitOptions[key] = options[key];
				}
				broccoliInitOptions.contents_area_selector = "[data-contents-area]";
				broccoliInitOptions.contents_bowl_name_by = "data-contents-area";
				broccoliInitOptions.gpiBridge = function(api, options, callback){
					// GPI(General Purpose Interface) Bridge
					// broccoliは、バックグラウンドで様々なデータ通信を行います。
					// GPIは、これらのデータ通信を行うための汎用的なAPIです。
					// console.log(api, options);
					_this.gpiBridge(
						{
							'api': 'broccoliBridge',
							'forBroccoli':{
								'api': JSON.stringify(api) ,
								'options': JSON.stringify(options)
							}
						},
						function(rtn){
							// console.log(rtn);
							callback(rtn);
						}
					);
					return;
				}
				// console.log(broccoliInitOptions);
				broccoli.init(
					broccoliInitOptions ,
					function(){
						// console.log(broccoli);
						callback( broccoli );
					}
				);
			});
			return;
		}

		/**
		 * プログレスを表示する
		 */
		this.progress = function( callback ){
			callback = callback||function(){};
			$canvas.find('.pickles2-module-editor--progress').remove();//一旦削除
			$canvas
				.append( $('<div class="pickles2-module-editor pickles2-module-editor--progress">')
					.append( $('<div class="pickles2-module-editor--progress-inner">')
						.append( $('<div class="pickles2-module-editor--progress-inner2">')
							.append( $('<div class="px2-loading">') )
						)
					)
				)
			;
			var dom = $canvas.find('.px2-loading').get(0);
			callback(dom);
			return;
		}

		/**
		 * プログレスを閉じる
		 */
		this.closeProgress = function( callback ){
			callback = callback||function(){};
			var $progress = $canvas.find('.pickles2-module-editor--progress');
			if( !$progress.length ){
				callback();
				return;
			}
			$progress
				.fadeOut(
					'fast',
					function(){
						$(this).remove();
						callback();
					}
				)
			;
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
