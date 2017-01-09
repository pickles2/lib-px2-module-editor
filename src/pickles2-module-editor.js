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

	// broccoli-html-editor をロード
	document.write('<link rel="stylesheet" href="'+__dirname+'/libs/broccoli-html-editor/client/dist/broccoli.css" />');
	document.write('<script src="'+__dirname+'/libs/broccoli-html-editor/client/dist/broccoli.js"></script>');

	window.Pickles2ModuleEditor = function(){
		var $ = require('jquery');
		var $canvas;
		var _this = this;
		this.__dirname = __dirname;
		this.options = {};

		var serverConfig;
		var editor;

		/**
		* initialize
		*/
		this.init = function(options, callback){
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

			_this.gpiBridge(
				{
					'api':'getConfig'
				} ,
				function(config){
					// console.log(config);
					serverConfig = config;
					callback();
				}
			);

		} // init()

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
