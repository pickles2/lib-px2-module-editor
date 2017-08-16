/**
 * gpi.js (General Purpose Interface)
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	// console.log(data);

	var _this = this;
	callback = callback || function(){};
	var utils79 = require('utils79');
	if( !data.api.match(/^[a-zA-Z0-9\_]+$/) ){
		callback(false);
		return;
	}

	// API をロードして実行
	if( utils79.is_file(__dirname+'/gpis/'+encodeURIComponent(data.api)+'.js') ){
		var Api = require('./gpis/'+encodeURIComponent(data.api)+'.js');
		var api = new Api(px2me, data, function(result){
			callback(result);
		});
		return;
	}

	callback(false);
	return;
}
