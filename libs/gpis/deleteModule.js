/**
 * GPI: deleteModule
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');
	var fsx = require('fs-extra');

	px2me.createBroccoli({}, function(broccoli){
		var parsedModId = broccoli.parseModuleId(data.moduleId);
		var realpath;
		try {
			realpath = broccoli.paths_module_template[parsedModId.package]+'/'+encodeURIComponent(parsedModId.category)+'/'+encodeURIComponent(parsedModId.module)+'/';
		} catch (e) {
		}

		if( !px2me.isEditablePath( realpath ) ){
			// 編集可能なパスかどうか評価
			// 駄目なら上書いてはいけない。
			callback(false);
			return;
		}
		if( !utils79.is_dir(realpath) ){
			// 既に存在していない
			callback(false);
			return;
		}
		var result = fsx.removeSync(realpath);

		callback(!!result);
	});

	return;
}
