/**
 * px2me.js
 */
module.exports = function(){

	var Px2ME = require('../../../../libs/main.js');

	return function(req, res, next){
		// console.log(req.body);

		var px2me = new Px2ME();
		px2me.init(
			{
				'appMode': 'web', // 'web' or 'desktop'. default to 'web
				'entryScript': require('path').resolve(__dirname,'../../../htdocs/.px_execute.php')
			},
			function(){
				px2me.gpi(JSON.parse(req.body.data), function(value){
					res
						.status(200)
						.set('Content-Type', 'text/json')
						.send( JSON.stringify(value) )
						.end();
				});
			}
		);

		return;
	}

}
