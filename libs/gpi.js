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
