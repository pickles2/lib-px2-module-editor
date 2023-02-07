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

		if( !preg_match('/^[a-zA-Z0-9\_]+$/s', $data['api']) ){
			return false;
		}

		// API をロードして実行
		if( is_file(__DIR__.'/gpis/'.urlencode($data['api']).'.php') ){
			$Api = include(__DIR__.'/gpis/'.urlencode($data['api']).'.php');
			$result = $Api($this->px2me, $data);
			return $result;
		}

		return false;
	}

}
