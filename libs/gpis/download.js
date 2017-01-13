/**
 * GPI: download
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	px2me.createBroccoli(function(broccoli){
		// console.log(broccoli);
		if( !data.target ){
			callback(false);
			return;
		}

		/*
		(↓)broccoli-html-editor の実装を利用
			nodeJs で実装されている。
			broccoli-html-editor オリジナルの実装なのでこれを採用したかったが、
			`node-sass` が NW.js 上で動作しないため、Pickles 2 Desktop Tool に載せられなかった。
		*/
		// var method = '';
		// switch(data.target){
		// 	case "css":
		// 		method = 'buildModuleCss';
		// 		break;
		// 	case "js":
		// 		method = 'buildModuleJs';
		// 		break;
		// 	default:
		// 		callback(false);
		// 		break;
		// }
		// broccoli[method](function(bin){
		// 	callback(bin);
		// });

		/*
		(↓)pickles2/px2-px2dthelper の実装を利用
			こちらは Pickles 2 のプラグイン pickles2/px2-px2dthelper に PHP で実装されている。
			SASSエンジンが異なるので、本家 broccoli-html-editor のビルド結果とは微妙に異なるが、ほぼ同じ結果が得られる。
			この方法なら NW.js 上からも呼び出すことができるので、こちらを採用。
		*/
		px2me.px2proj.query('/?PX=px2dthelper.document_modules.build_'+data.target, {
			"output": "json",
			"userAgent": "Mozilla/5.0",
			"success": function(row){
				// console.log(row);
			},
			"complete": function(bin, code){
				// console.log(bin, code);
				callback(bin);
			}
		});

		return;
	});
	return;
}
