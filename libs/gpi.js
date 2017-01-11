/**
 * gpi.js (General Purpose Interface)
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var _this = this;
	callback = callback || function(){};
	var utils79 = require('utils79');

	switch(data.api){
		case "getConfig":
			// pickles2-contents-editor の設定を取得する
			var conf = {};
			conf.appMode = px2me.getAppMode();
			callback(conf);
			break;

		case "getTemplates":
			// EJSテンプレートを取得する
			var templates = {};

			templates['list'] = require('fs').readFileSync(__dirname+'/templates/list.html.ejs').toString();
			templates['editModule'] = require('fs').readFileSync(__dirname+'/templates/editModule.html.ejs').toString();

			callback(templates);
			break;

		case "getPackageList":
			// broccoli モジュールのパッケージ一覧を取得する

			px2me.createBroccoli(function(broccoli){
				// console.log(broccoli);
				broccoli.getPackageList(function(packageList){
					// console.log('getPackageList', packageList);
					callback(packageList);
				});
			});
			break;

		case "getModuleCode":
			// broccoli モジュールのコードをすべて取得する

			var rtn = {};
			px2me.createBroccoli(function(broccoli){
				// console.log(broccoli);
				rtn.realpath = broccoli.getModuleRealpath(data.moduleId);
				rtn.editable = px2me.isEditablePath( rtn.realpath ); // 編集可能なパスかどうか評価

				rtn.template = '';
				rtn.templateExt = 'html';
				if( utils79.is_file(rtn.realpath+'/template.html') ){
					rtn.template = require('fs').readFileSync(rtn.realpath+'/template.html').toString();
					rtn.templateExt = 'html';
				}else if( utils79.is_file(rtn.realpath+'/template.html.twig') ){
					rtn.template = require('fs').readFileSync(rtn.realpath+'/template.html.twig').toString();
					rtn.templateExt = 'html.twig';
				}
				if( utils79.is_file(rtn.realpath+'/info.json') ){
					rtn.infoJson = require('fs').readFileSync(rtn.realpath+'/info.json').toString();
				}

				rtn.css = '';
				rtn.cssExt = 'css.scss';
				if( utils79.is_file(rtn.realpath+'/module.css') ){
					rtn.css = require('fs').readFileSync(rtn.realpath+'/module.css').toString();
					rtn.cssExt = 'css';
				}else if( utils79.is_file(rtn.realpath+'/module.css.scss') ){
					rtn.css = require('fs').readFileSync(rtn.realpath+'/module.css.scss').toString();
					rtn.cssExt = 'css.scss';
				}

				rtn.js = '';
				rtn.jsExt = 'js';
				if( utils79.is_file(rtn.realpath+'/module.js') ){
					rtn.js = require('fs').readFileSync(rtn.realpath+'/module.js').toString();
					rtn.jsExt = 'js';
				}

				callback(rtn);
			});
			break;

		case "saveModuleCode":
			// broccoli モジュールのコードをすべて保存する
			px2me.createBroccoli(function(broccoli){
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
			break;

		case "getProjectConf":
			// プロジェクトの設定を取得する
			px2me.getProjectConf(function(conf){
				callback(conf);
			});
			break;

		default:
			callback(true);
			break;
	}

	return;
}
