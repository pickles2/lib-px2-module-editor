/**
 * gpi.js (General Purpose Interface)
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var _this = this;
	callback = callback || function(){};

	switch(data.api){
		case "getConfig":
			// pickles2-contents-editor の設定を取得する
			var conf = {};
			conf.appMode = px2me.getAppMode();
			callback(conf);
			break;

		case "getTemplates":
			// EJSテンプレートを取得する
			var templates = {};

			templates['list'] = require('fs').readFileSync(__dirname+'/templates/list.html.ejs').toString();
			templates['editModule'] = require('fs').readFileSync(__dirname+'/templates/editModule.html.ejs').toString();

			callback(templates);
			break;

		case "getPackageList":
			// broccoli モジュールのパッケージ一覧を取得する

			px2me.createBroccoli(function(broccoli){
				// console.log(broccoli);
				broccoli.getPackageList(function(packageList){
					// console.log('getPackageList', packageList);
					callback(packageList);
				});
			});
			break;

		case "getModuleCode":
			// broccoli モジュールのコードをすべて取得する

			var rtn = {};
			px2me.createBroccoli(function(broccoli){
				// console.log(broccoli);
				console.log(data);
				rtn.realpath = broccoli.getModuleRealpath(data.moduleId);
				callback(rtn);
			});
			break;

		case "getProjectConf":
			// プロジェクトの設定を取得する
			px2me.getProjectConf(function(conf){
				callback(conf);
			});
			break;

		default:
			callback(true);
			break;
	}

	return;
}
