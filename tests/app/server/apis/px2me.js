/**
 * px2me.js
 */
module.exports = function(){

	var Px2ME = require('../../../../libs/main.js');

	/**
	 * create broccoli-html-editor object
	 */
	var createBroccoli = function(callback){
		callback = callback||function(){};
		var Broccoli = require('broccoli-html-editor');
		var broccoli = new Broccoli();

		var customFields = {};

		new Promise(function(rlv){rlv();})
			.then(function(){ return new Promise(function(rlv, rjt){

				broccoli.init(
					{
						'appMode': 'web' ,
						'paths_module_template': {
							'local': require('path').resolve(__dirname, '../../../htdocs/px-files/modules/')+'/'
						} ,
						'documentRoot': require('path').resolve(__dirname, '../../../htdocs')+'/',// realpath
						'pathHtml': '/index.html',
						'pathResourceDir': '/index_files/resources/',
						'realpathDataDir':  require('path').resolve(__dirname, '../../../htdocs/', './index_files/data')+'/',
						'contents_bowl_name_by': 'data-contents-area',
						'customFields': {} ,
						'bindTemplate': function(htmls, callback){
							var fin = '';
							for( var bowlId in htmls ){
								if( bowlId == 'main' ){
									fin += htmls['main'];
								}else{
									fin += "\n";
									fin += "\n";
									fin += '<?php ob_start(); ?>'+"\n";
									fin += htmls[bowlId]+"\n";
									fin += '<?php $px->bowl()->send( ob_get_clean(), '+JSON.stringify(bowlId)+' ); ?>'+"\n";
									fin += "\n";
								}
							}
							callback(fin);
							return;
						},
						'log': function(msg){
							// エラー発生時にコールされます。
							console.log(msg);
						}
					},
					function(){
						rlv();
					}
				);
				return;
			}); })
			.then(function(){ return new Promise(function(rlv, rjt){
				callback(broccoli);
			}); })
		;

		return;
	}

	return function(req, res, next){
		// console.log(req.body);

		var px2me = new Px2ME();
		createBroccoli(function(broccoli){
			// console.log(broccoli);
			px2me.init(
				{
					'appMode': 'web', // 'web' or 'desktop'. default to 'web'
					'broccoli': broccoli, // supply `broccoli` object.
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
		});

		return;
	}

}
