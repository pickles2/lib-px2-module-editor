/**
 * GPI: saveCategoryCode
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

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
		var realpath = broccoli.paths_module_template[parsedModId.package]+'/'+parsedModId.category+'/';
		if( !utils79.is_dir(realpath) ){
			callback(false);
			return;
		}
		if( !px2me.isEditablePath( realpath ) ){
			// 編集可能なパスかどうか評価
			// 駄目なら上書いてはいけない。
			callback(false);
			return;
		}

		try {
			require('fs').writeFileSync(realpath+'/info.json', JSON.stringify(JSON.parse(data.data.infoJson), null, 2));
		} catch (e) {}

		callback(true);
		return;
	});
	return;
}
