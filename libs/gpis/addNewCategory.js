/**
 * GPI: addNewCategory
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	px2me.createBroccoli(function(broccoli){
		// console.log(broccoli);

		if( !data.packageId ){
			callback(false);
			return;
		}
		var realpath = broccoli.paths_module_template[data.packageId]+'/';
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
		realpath = realpath+'/'+data.data.categoryId;
		if( utils79.is_dir(realpath) ){
			// 既に存在する
			callback(false);
			return;
		}

		require('fs').mkdirSync(realpath);

		var infoJson = {};
		infoJson.name = data.data.categoryName;
		try { require('fs').writeFileSync(realpath+'/info.json', JSON.stringify(infoJson)); } catch (e) {}

		callback(true);
		return;
	});
	return;
}
