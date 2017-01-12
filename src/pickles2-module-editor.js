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

	// bootstrap をロード
	document.write('<link rel="stylesheet" href="'+__dirname+'/libs/bootstrap/dist/css/bootstrap.css" />');
	document.write('<script src="'+__dirname+'/libs/bootstrap/dist/js/bootstrap.js"></script>');

	// px2style をロード
	document.write('<script src="'+__dirname+'/libs/px2style/dist/scripts.js"></script>');
	document.write('<link rel="stylesheet" href="'+__dirname+'/libs/px2style/dist/styles.css" />');

	// broccoli-html-editor をロード
	document.write('<link rel="stylesheet" href="'+__dirname+'/libs/broccoli-html-editor/client/dist/broccoli.css" />');
	document.write('<script src="'+__dirname+'/libs/broccoli-html-editor/client/dist/broccoli.js"></script>');

	window.Pickles2ModuleEditor = function(){
		var $ = require('jquery');
		var Promise = require('es6-promise').Promise;
		var $canvas,
			$canvasContent,
			$canvasModal;
		var _this = this;
		this.__dirname = __dirname;
		this.options = {};

		var px2meConf,
			templates;
		var pages = {
			'list': require('./pages/list/index.js'),
			'editModule': require('./pages/editModule/index.js'),
			'editCategory': require('./pages/editCategory/index.js'),
			'editPackage': require('./pages/editPackage/index.js'),
			'addNewCategory': require('./pages/addNewCategory/index.js'),
			'addNewModule': require('./pages/addNewModule/index.js')
		};

		/**
		* initialize
		*/
		this.init = function(options, callback){
			console.info('initialize pickles2-module-editor...');

			callback = callback || function(){};
			var _this = this;
			// console.log(options);
			this.options = options;
			this.options.gpiBridge = this.options.gpiBridge || function(){ alert('gpiBridge required.'); };
			this.options.complete = this.options.complete || function(){ alert('finished.'); };
			this.options.onMessage = this.options.onMessage || function(message){ alert('onMessage: '+message); };
			this.options.preview = this.options.preview || {};

			$canvas = $(options.elmCanvas);
			$canvas.addClass('pickles2-module-editor');
			$canvasContent = $('<div class="pickles2-module-editor__content">');
			$canvasModal = $('<div class="pickles2-module-editor__modal">');
			$canvas.html('')
				.append($canvasContent)
				.append($canvasModal.hide())
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
							console.log(tpls);
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
				_this.modal($cont, function(){
					pages[pageName](_this, $cont, options, function(){
						callback();
					});
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
		this.getCategoryCode = function(moduleId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getPackageCode',
					'moduleId': moduleId
				},
				function(moduleCode){
					callback(moduleCode);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールカテゴリのコードの変更をすべて保存する
		 */
		this.saveCategoryCode = function(moduleId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'saveCategoryCode',
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
		 * broccoli パッケージのコードをすべて取得する
		 */
		this.getPackageCode = function(moduleId, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'getPackageCode',
					'moduleId': moduleId
				},
				function(moduleCode){
					callback(moduleCode);
				}
			);
			return;
		}

		/**
		 * broccoli モジュールパッケージのコードの変更をすべて保存する
		 */
		this.savePackageCode = function(moduleId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'savePackageCode',
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
		 * broccoli モジュールカテゴリを新規追加
		 */
		this.addNewCategory = function(moduleId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'addNewCategory',
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
		 * broccoli モジュールを新規追加する
		 */
		this.addNewModule = function(moduleId, data, callback){
			callback = callback || function(){};
			this.gpiBridge(
				{
					'api':'addNewModule',
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
			if( !$progress.size() ){
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
		 * モーダルダイアログを開く
		 */
		this.modal = function( $elm, callback ){
			callback = callback||function(){};
			this.closeModal(function(){
				$canvasModal
					.append( $('<div class="pickles2-module-editor__modal__inner">')
						.append( $elm )
					)
					.show()
				;
				callback();
			});
			return;
		}

		/**
		 * モーダルダイアログを閉じる
		 */
		this.closeModal = function( callback ){
			callback = callback||function(){};
			$canvasModal.html('').hide();
			callback();
			return;
		}

		/**
		* gpiBridgeを呼び出す
		*/
		this.gpiBridge = function(data, callback){
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
