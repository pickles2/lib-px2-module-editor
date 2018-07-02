/**
 * GPI: pickles2-contents-editor
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	px2me.createPickles2ContentsEditor(function(px2ce){
		// console.log('GPI called');
		// console.log(data);
		// console.log(px2ce);
		px2ce.gpi(
			data.forPx2CE,
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
