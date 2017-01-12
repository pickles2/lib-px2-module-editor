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
		var method = '';
		switch(data.target){
			case "css":
				method = 'buildModuleCss';
				break;
			case "js":
				method = 'buildModuleJs';
				break;
			default:
				callback(false);
				break;
		}


		broccoli[method](function(bin){
			callback(bin);
		});

		return;
	});
	return;
}
