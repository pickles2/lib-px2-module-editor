/**
 * GPI: getProjectConf
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	px2me.getProjectConf(function(conf){
		callback(conf);
	});
    return;
}
