/**
 * GPI: getPackageList
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	px2me.createBroccoli(function(broccoli){
		// console.log(broccoli);
		broccoli.getPackageList(function(packageList){
			// console.log('getPackageList', packageList);
			callback(packageList);
		});
	});
    return;
}
