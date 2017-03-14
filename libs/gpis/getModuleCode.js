/**
 * GPI: getModuleCode
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	var rtn = {};
	px2me.createBroccoli({}, function(broccoli){
		// console.log(broccoli);
		var realpath = broccoli.getModuleRealpath(data.moduleId);
		// rtn.realpath = realpath;
		rtn.editable = px2me.isEditablePath( realpath ); // 編集可能なパスかどうか評価

		rtn.template = '';
		rtn.templateExt = 'html';
		if( utils79.is_file(realpath+'/template.html') ){
			rtn.template = require('fs').readFileSync(realpath+'/template.html').toString();
			rtn.templateExt = 'html';
		}else if( utils79.is_file(realpath+'/template.html.twig') ){
			rtn.template = require('fs').readFileSync(realpath+'/template.html.twig').toString();
			rtn.templateExt = 'html.twig';
		}
		rtn.infoJson = '';
		if( utils79.is_file(realpath+'/info.json') ){
			rtn.infoJson = require('fs').readFileSync(realpath+'/info.json').toString();
		}

		rtn.css = '';
		rtn.cssExt = 'css.scss';
		if( utils79.is_file(realpath+'/module.css') ){
			rtn.css = require('fs').readFileSync(realpath+'/module.css').toString();
			rtn.cssExt = 'css';
		}else if( utils79.is_file(realpath+'/module.css.scss') ){
			rtn.css = require('fs').readFileSync(realpath+'/module.css.scss').toString();
			rtn.cssExt = 'css.scss';
		}

		rtn.js = '';
		rtn.jsExt = 'js';
		if( utils79.is_file(realpath+'/module.js') ){
			rtn.js = require('fs').readFileSync(realpath+'/module.js').toString();
			rtn.jsExt = 'js';
		}

		rtn.finalizeJs = '';
		if( utils79.is_file(realpath+'/finalize.js') ){
			rtn.finalizeJs = require('fs').readFileSync(realpath+'/finalize.js').toString();
		}

		rtn.clipJson = '';
		if( utils79.is_file(realpath+'/clip.json') ){
			rtn.clipJson = require('fs').readFileSync(realpath+'/clip.json').toString();
		}

		callback(rtn);
	});
	return;
}
