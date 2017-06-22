/**
 * GPI: getPackageList
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	px2me.createBroccoli({}, function(broccoli){
		// console.log(broccoli);
		broccoli.getPackageList(function(packageList){
			// console.log('getPackageList', packageList);
			for(var idx in packageList){
				packageList[idx].isEditable = px2me.isEditablePath(packageList[idx].realpath);
			}
			callback(packageList);
		});
	});
	return;
}
