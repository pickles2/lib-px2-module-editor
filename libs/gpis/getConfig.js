/**
 * GPI: getConfig
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var conf = {};
	conf.appMode = px2me.getAppMode();
	callback(conf);
	return;
}
