/**
 * GPI: broccoli-html-editor
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	px2me.createBroccoli({
		'moduleId': data.moduleId
	}, function(broccoli){
		console.log('GPI called - broccoliBridge');
		console.log(data);
		// console.log(px2ce);
		broccoli.gpi(
			data.forBroccoli.api,
			data.forBroccoli.options,
			function(rtn){
				// console.log(rtn);
				// console.log('GPI responced');
				callback(rtn);
			}
		);

		return;
	});
	return;
}
