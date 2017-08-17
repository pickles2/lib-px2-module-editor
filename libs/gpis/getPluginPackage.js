/**
 * GPI: getPluginPackage
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	callback(px2me.packages);
	return;
}
