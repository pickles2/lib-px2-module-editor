/**
 * GPI: addNewPackage
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');
	var fs = require('fs');
	var fsx = require('fs-extra');

	px2me.createBroccoli({}, function(broccoli){
		// console.log(broccoli);

		var realpath;
		try {
			realpath = require('path').resolve(px2me.entryScript, '..', px2me.px2conf.plugins.px2dt.path_module_templates_dir)+'/';
		} catch (e) {
		}
		if( !utils79.is_dir(realpath) ){
			callback({
				'result': false,
				'msg': 'テンプレートディレクトリが存在しません。',
			});
			return;
		}

		if( !px2me.isEditablePath( realpath ) ){
			// 編集可能なパスかどうか評価
			// 駄目なら上書いてはいけない。
			callback({
				'result': false,
				'msg': 'テンプレートディレクトリが編集できないパスを指しています。',
			});
			return;
		}
		realpath = realpath+'/'+encodeURIComponent(data.data.packageId)+'/';
		if( utils79.is_dir(realpath) && !data.data.force ){
			// 既に存在する
			callback({
				'result': false,
				'msg': 'そのパッケージIDはすでに存在します。',
			});
			return;
		}

		fs.mkdirSync(realpath);

		if( data.data.importFrom.length ){
			data.data.importFrom.match(/^(moduleCollection|modulePlugin)\:([\S]+)$/);
			var fromDiv = RegExp.$1;
			var fromId = RegExp.$2;
			if( fromDiv == 'moduleCollection' ){
				fsx.copySync(
					broccoli.paths_module_template[fromId],
					realpath
				);
			}else if(fromDiv == 'modulePlugin'){
				try {
					var pluginInfo = px2me.packages.package_list.broccoliModules[fromId];
					fsx.copySync(
						pluginInfo.path,
						realpath
					);
				} catch (e) {
				}
			}
		}


		var infoJson = {};
		if( utils79.is_file( realpath+'/info.json' ) ){
			try {
				infoJson = JSON.parse( fs.readFileSync( realpath+'/info.json' ) );
			} catch (e) {
			}
		}
		infoJson.name = data.data.packageName;
		try {
			fs.writeFileSync(realpath+'/info.json', JSON.stringify(infoJson));
		} catch (e) {}

		callback({
			'result': true,
			'msg': 'OK',
		});
		return;
	});
	return;
}
