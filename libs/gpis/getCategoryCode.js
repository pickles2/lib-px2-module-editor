/**
 * GPI: getCategoryCode
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	px2me.createBroccoli(function(broccoli){
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

		var rtn = {};
		// rtn.realpath = realpath;
		rtn.editable = px2me.isEditablePath( realpath ); // 編集可能なパスかどうか評価

		if( utils79.is_file(realpath+'/info.json') ){
			rtn.infoJson = require('fs').readFileSync(realpath+'/info.json').toString();
		}

		callback(rtn);
		return;
	});
    return;
}
