/**
 * GPI: download
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var utils79 = require('utils79');

	px2me.createBroccoli(function(broccoli){
		// console.log('GPI called');
		// console.log(api);
		// console.log(options);
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
