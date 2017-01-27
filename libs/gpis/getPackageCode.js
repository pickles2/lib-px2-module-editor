/**
 * GPI: getPackageCode
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	px2me.createBroccoli({}, function(broccoli){
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
