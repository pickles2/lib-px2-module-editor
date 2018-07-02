<?php
/**
 * Pickles 2 module editor
 */
namespace pickles2\libs\moduleEditor;

/**
 * General Purpose Interface
 *
 * @author Tomoya Koyanagi <tomk79@gmail.com>
 */
class gpi{

	/**
	 * $px2me
	 */
	private $px2me;

	/**
	 * Constructor
	 */
	public function __construct( $px2me ){
		$this->px2me = $px2me;
	}

	/**
	 * General Purpose Interface
	 */
	public function gpi($data){
		// // var_dump(data);

		// var _this = this;
		// callback = callback || function(){};
		// var utils79 = require('utils79');
		// if( !data.api.match(/^[a-zA-Z0-9\_]+$/) ){
		// 	callback(false);
		// 	return;
		// }

		// // API をロードして実行
		// if( utils79.is_file(__dirname+'/gpis/'+encodeURIComponent(data.api)+'.js') ){
		// 	var Api = require('./gpis/'+encodeURIComponent(data.api)+'.js');
		// 	var api = new Api(px2me, data, function(result){
		// 		callback(result);
		// 	});
		// 	return;
		// }

		return false;
	}

}
