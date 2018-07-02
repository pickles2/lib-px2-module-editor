<?php
/**
 * Pickles 2 module editor
 */
namespace pickles2\libs\moduleEditor;

/**
 * Pickles 2 module editor core class
 *
 * @author Tomoya Koyanagi <tomk79@gmail.com>
 */
class main{

	// var px2agent = require('px2agent');
	// var fs = require('fs');
	// var fsx = require('fs-extra');
	// var utils79 = require('utils79');
	// var Promise = require('es6-promise').Promise;
	// var _this = this;
	// var px2me = this;
	// var nodePhpBinOptions;

	// this.entryScript;
	// this.px2proj;
	// this.page_path;
	// this.options;

	/**
	 * Constructor
	 */
	public function __construct(){
	}

	/**
	 * Initialize
	 */
	public function init($options){
		// // var_dump($options);
		// options = options || {};
		// options.appMode = options.appMode || 'web'; // web | desktop
		// options.log = options.log || function(msg){
		// 	console.error(msg);
		// };
		// this.entryScript = options.entryScript;

		// nodePhpBinOptions = (function(cmds){
		// 	try {
		// 		var nodePhpBinOptions = cmds.php;
		// 		if(!nodePhpBinOptions){
		// 			return undefined;
		// 		}
		// 		if( typeof(nodePhpBinOptions) == typeof('') ){
		// 			nodePhpBinOptions = {
		// 				'bin': nodePhpBinOptions,
		// 				'ini': null
		// 			};
		// 		}
		// 		return nodePhpBinOptions;
		// 	} catch (e) {
		// 	}
		// 	return undefined;
		// })(options.commands);

		// this.px2proj = require('px2agent').createProject(options.entryScript, nodePhpBinOptions);
		// this.options = options;

		// var LangBank = require('langbank');
		// _this.lb = new LangBank(__dirname+'/../data/language.csv', function(){
		// 	_this.lb.setLang('en'); // TODO: 仮実装

		// 	// var_dump(this.options);
		// 	_this.getProjectInfo(function(pjInfo){
		// 		// var_dump(pjInfo);
		// 		_this.pjInfo = pjInfo;
		// 		_this.px2conf = pjInfo.conf || {};
		// 		_this.pageInfo = pjInfo.pageInfo;
		// 		_this.documentRoot = pjInfo.documentRoot;
		// 		_this.contRoot = pjInfo.contRoot;
		// 		_this.packages = pjInfo.packages || {};
		// 		_this.realpathDataDir = pjInfo.realpathDataDir;
		// 		_this.pathResourceDir = pjInfo.pathResourceDir;

		// 		// configを初期化
		// 		_this.px2conf.plugins = _this.px2conf.plugins || {};
		// 		_this.px2conf.plugins.px2dt = _this.px2conf.plugins.px2dt || {};
		// 		_this.px2conf.plugins.px2dt.paths_module_template = _this.px2conf.plugins.px2dt.paths_module_template || {};
		// 		_this.px2conf.plugins.px2dt.path_module_templates_dir = _this.px2conf.plugins.px2dt.path_module_templates_dir || null;

		// 		callback();
		// 	});
		// });

		return;
	}

	// /**
	//  * プロジェクトの設定情報を取得する
	//  */
	// this.getProjectConf = function(callback){
	// 	callback = callback || function(){};
	// 	this.px2proj.get_config(function(val){
	// 		callback(val);
	// 	});
	// 	return;
	// }

	// /**
	//  * アプリケーションの実行モード設定を取得する (同期)
	//  * @return string 'web'|'desktop'
	//  */
	// this.getAppMode = function(){
	// 	var rtn = this.options.appMode;
	// 	switch(rtn){
	// 		case 'web':
	// 		case 'desktop':
	// 			break;
	// 		default:
	// 			rtn = 'web';
	// 			break;
	// 	}
	// 	return rtn;
	// }

	// /**
	//  * 編集可能なパスか調べる
	//  */
	// this.isEditablePath = function(path){
	// 	// TODO: vendor, node_modules の中にないか確認する。
	// 	if( path.match('/vendor/') ){
	// 		return false;
	// 	}
	// 	if( path.match('/node_modules/') ){
	// 		return false;
	// 	}
	// 	return true;
	// }

	// /**
	//  * プロジェクト情報をまとめて取得する
	//  */
	// this.getProjectInfo = function(callback){
	// 	callback = callback || function(){};
	// 	var pjInfo = {};
	// 	var page_info = _this.page_path;
	// 	if(!page_info){
	// 		page_info = '/px2me-dummy.html';
	// 	}

	// 	new Promise(function(rlv){rlv();})
	// 		.then(function(){ return new Promise(function(rlv, rjt){
	// 			_this.px2proj.query(page_info+'?PX=px2dthelper.get.all', {
	// 				"output": "json",
	// 				"complete": function(data, code){
	// 					try {
	// 						var allData = JSON.parse(data);
	// 						if( typeof(allData) !== typeof({}) ){
	// 							console.error("Error: Parsed JSON from `PX=px2dthelper.get.all` is NOT a object.", allData);
	// 							rlv();
	// 							return;
	// 						}
	// 						if( typeof(allData.config) !== typeof({}) ){
	// 							console.error("Error: Parsed JSON from `PX=px2dthelper.get.all` is NOT conains a config object.", allData);
	// 							rlv();
	// 							return;
	// 						}
	// 						// var_dump(allData, code);

	// 						pjInfo.conf = allData.config;
	// 						pjInfo.pageInfo = allData.page_info;
	// 						pjInfo.contRoot = allData.path_controot;
	// 						pjInfo.documentRoot = allData.realpath_docroot;
	// 						pjInfo.realpathFiles = allData.realpath_files;
	// 						pjInfo.pathFiles = allData.path_files;
	// 						pjInfo.realpathDataDir = allData.realpath_data_dir;
	// 						pjInfo.pathResourceDir = allData.path_resource_dir;
	// 						pjInfo.realpath_homedir = allData.realpath_homedir;
	// 						pjInfo.packages = allData.packages;
	// 						callback(pjInfo);
	// 						return;

	// 					} catch (e) {
	// 						// うまく解析できなかったら、
	// 						// 旧来の方法で個別に取得する
	// 						console.error("Error: FAILED to parse JSON from `PX=px2dthelper.get.all`.");
	// 						rlv();
	// 						return;
	// 					}
	// 				}
	// 			});
	// 		}); })
	// 		.then(function(){ return new Promise(function(rlv, rjt){

	// 			_this.px2proj.get_config(function(conf){
	// 				pjInfo.conf = conf;

	// 				_this.px2proj.get_page_info(page_info, function(pageInfo){
	// 					pjInfo.pageInfo = pageInfo;

	// 					_this.px2proj.get_path_docroot(function(documentRoot){
	// 						pjInfo.documentRoot = documentRoot;

	// 						_this.px2proj.realpath_files(page_info, '', function(realpathDataDir){
	// 							realpathDataDir = require('path').resolve(realpathDataDir, 'guieditor.ignore')+'/';
	// 							pjInfo.realpathDataDir = realpathDataDir;

	// 							_this.px2proj.path_files(page_info, '', function(pathResourceDir){
	// 								pathResourceDir = require('path').resolve(pathResourceDir, 'resources')+'/';
	// 								pathResourceDir = pathResourceDir.replace(new RegExp('\\\\','g'), '/').replace(new RegExp('^[a-zA-Z]\\:\\/'), '/');
	// 									// Windows でボリュームラベル "C:" などが含まれるようなパスを渡すと、
	// 									// broccoli-html-editor内 resourceMgr で
	// 									// 「Uncaught RangeError: Maximum call stack size exceeded」が起きて落ちる。
	// 									// ここで渡すのはウェブ側からみえる外部のパスでありサーバー内部パスではないので、
	// 									// ボリュームラベルが付加された値を渡すのは間違い。

	// 								pjInfo.pathResourceDir = pathResourceDir;

	// 								callback(pjInfo);

	// 							});
	// 						});
	// 					});
	// 				});
	// 			});

	// 		}); })
	// 	;


	// }

	// /**
	//  * create broccoli-html-editor object
	//  */
	// this.createBroccoli = function(options, callback){
	// 	options = options||{};
	// 	callback = callback||function(){};
	// 	this.createPickles2ContentsEditor(function(px2ce){
	// 		px2ce.createBroccoliInitOptions(function(broccoliInitOptions){
	// 			// var_dump(broccoliInitOptions);
	// 			var broccoli = new (require('broccoli-html-editor'))();
	// 			// var_dump(options);
	// 			var parsedModuleId = broccoli.parseModuleId( options.moduleId );
	// 			var previewContentName = options.previewContentName||'default';
	// 			// var_dump(parsedModuleId);
	// 			if( parsedModuleId !== false ){
	// 				broccoliInitOptions.documentRoot = require('path').resolve(broccoliInitOptions.paths_module_template[parsedModuleId.package]+'/'+parsedModuleId.category+'/'+parsedModuleId.module+'/coding-example/')+'/';
	// 				broccoliInitOptions.pathHtml = require('path').resolve('/'+previewContentName+'.html');
	// 				broccoliInitOptions.pathResourceDir = require('path').resolve('/'+previewContentName+'_files/resources/')+'/';
	// 				broccoliInitOptions.realpathDataDir = broccoliInitOptions.documentRoot+previewContentName+'_files/guieditor.ignore/';
	// 			}
	// 			// var_dump(broccoliInitOptions);
	// 			_this.initPreviewContent(options.moduleId, broccoliInitOptions, function(){
	// 				broccoli.init(
	// 					broccoliInitOptions,
	// 					function(){
	// 						// var_dump(broccoli);
	// 						callback(broccoli);
	// 					}
	// 				);
	// 			});
	// 		});
	// 	});
	// 	return;
	// }

	// /**
	//  * create pickles2-contents-editor object
	//  */
	// this.createPickles2ContentsEditor = function(callback){
	// 	callback = callback||function(){};
	// 	var Px2CE = require('pickles2-contents-editor');
	// 	var px2ce = new Px2CE();

	// 	px2ce.init(
	// 		{
	// 			'page_path': '/px2me-dummy.html', // <- 編集対象ページのパス
	// 			'appMode': _this.getAppMode(), // 'web' or 'desktop'. default to 'web'
	// 			'entryScript': this.entryScript,
	// 			'customFields': {} ,
	// 			'log': function(msg){},
	// 			'commands': (this.options.commands||undefined)
	// 		},
	// 		function(){
	// 			callback(px2ce);
	// 		}
	// 	);

	// 	return;
	// }

	// /**
	//  * プレビュー用コンテンツを初期化する
	//  */
	// this.initPreviewContent = function(modId, broccoliInitOptions, callback){
	// 	callback = callback||function(){};
	// 	if( !modId ){
	// 		callback();return;
	// 	}
	// 	if( utils79.is_file( broccoliInitOptions.realpathDataDir+'/data.json' ) ){
	// 		callback();return;
	// 	}

	// 	fsx.mkdirpSync( broccoliInitOptions.realpathDataDir );
	// 	fs.writeFileSync( broccoliInitOptions.realpathDataDir+'/data.json', JSON.stringify({
	// 		"bowl": {
	// 		 	"main": {
	// 				"modId": "_sys/root",
	// 				"fields": {
	// 					"main": [
	// 						{
	// 						 	"modId": modId,
	// 						 	"fields": {},
	// 						 	"anchor": "",
	// 						 	"dec": ""
	// 						}
	// 					]
	// 				},
	// 				"anchor": "",
	// 				"dec": ""
	// 			}
	// 		}
	// 	}, null, 1) );

	// 	callback();
	// 	return;
	// }

	// /**
	//  * 汎用API
	//  */
	// this.gpi = function(data, callback){
	// 	callback = callback||function(){};
	// 	this.page_path = data.page_path;
	// 	// var_dump(this.page_path);
	// 	var gpi = require( __dirname+'/gpi.js' );
	// 	gpi(
	// 		this,
	// 		data,
	// 		function(rtn){
	// 			callback(rtn);
	// 		}
	// 	);
	// 	return this;
	// }

	// /**
	//  * ログファイルにメッセージを出力する
	//  */
	// this.log = function(msg){
	// 	this.options.log(msg);
	// 	return;
	// }

}
