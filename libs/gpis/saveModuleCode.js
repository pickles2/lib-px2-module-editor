/**
 * GPI: saveModuleCode
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	px2me.createBroccoli({}, function(broccoli){
		// console.log(broccoli);
		var realpath = broccoli.getModuleRealpath(data.moduleId);
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

		try { require('fs').unlinkSync(realpath+'/template.html'); } catch (e) {}
		try { require('fs').unlinkSync(realpath+'/template.html.twig'); } catch (e) {}
		try { require('fs').writeFileSync(realpath+'/template.'+data.data.templateExt, data.data.template); } catch (e) {}

		try { require('fs').writeFileSync(realpath+'/info.json', data.data.infoJson); } catch (e) {}

		try { require('fs').unlinkSync(realpath+'/module.css'); } catch (e) {}
		try { require('fs').unlinkSync(realpath+'/module.css.scss'); } catch (e) {}
		try { require('fs').writeFileSync(realpath+'/module.'+data.data.cssExt, data.data.css); } catch (e) {}

		try { require('fs').writeFileSync(realpath+'/module.'+data.data.jsExt, data.data.js); } catch (e) {}

		callback(true);
		return;
	});
	return;
}
