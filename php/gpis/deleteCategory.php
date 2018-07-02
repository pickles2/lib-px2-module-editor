/**
 * GPI: deleteCategory
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');
	var fsx = require('fs-extra');

	px2me.createBroccoli({}, function(broccoli){
		// console.log(broccoli);
		var parsedModId = broccoli.parseModuleId(data.categoryId+'/dmy');
		if( parsedModId === false ){
			callback(false);
			return;
		}
		if( !parsedModId.category ){
			callback(false);
			return;
		}
		var realpath = broccoli.paths_module_template[parsedModId.package]+'/'+encodeURIComponent(parsedModId.category)+'/';
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

		var result;
		try {
			result = fsx.removeSync(realpath);
		} catch (e) {}

		callback(!!result);
		return;
	});
	return;
}
