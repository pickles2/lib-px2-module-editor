/**
 * gpi.js (General Purpose Interface)
 */
module.exports = function(px2ce, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var _this = this;
	callback = callback || function(){};

	switch(data.api){
		case "getConfig":
			// pickles2-contents-editor の設定を取得する
			var conf = {};
			conf.appMode = px2ce.getAppMode();
			callback(conf);
			break;

		case "getProjectConf":
			// プロジェクトの設定を取得する
			px2ce.getProjectConf(function(conf){
				callback(conf);
			});
			break;

		default:
			callback(true);
			break;
	}

	return;
}
