<?php
/**
 * GPI: getModuleCode
 */
return function($px2me, $data){

	$rtn = array();
	$broccoli = $px2me->createBroccoli(array());

	// console.log(broccoli);
	$realpath = $broccoli->getModuleRealpath($data['moduleId']);
	// $rtn['realpath'] = $realpath;
	$rtn['editable'] = $px2me->isEditablePath( $realpath ); // 編集可能なパスかどうか評価

	$rtn['template'] = '';
	$rtn['templateExt'] = 'html';
	if( is_file($realpath.'/template.html') ){
		$rtn['template'] = file_get_contents($realpath.'/template.html');
		$rtn['templateExt'] = 'html';
	}elseif( is_file($realpath.'/template.html.twig') ){
		$rtn['template'] = file_get_contents($realpath.'/template.html.twig');
		$rtn['templateExt'] = 'html.twig';
	}
	$rtn['infoJson'] = '';
	if( is_file($realpath.'/info.json') ){
		$rtn['infoJson'] = file_get_contents($realpath.'/info.json');
	}

	$rtn['css'] = '';
	$rtn['cssExt'] = 'css.scss';
	if( is_file($realpath.'/module.css') ){
		$rtn['css'] = file_get_contents($realpath.'/module.css');
		$rtn['cssExt'] = 'css';
	}else if( is_file($realpath.'/module.css.scss') ){
		$rtn['css'] = file_get_contents($realpath.'/module.css.scss');
		$rtn['cssExt'] = 'css.scss';
	}

	$rtn['js'] = '';
	$rtn['jsExt'] = 'js';
	if( is_file($realpath.'/module.js') ){
		$rtn['js'] = file_get_contents($realpath.'/module.js');
		$rtn['jsExt'] = 'js';
	}

	$rtn['finalizeJs'] = '';
	if( is_file($realpath.'/finalize.js') ){
		$rtn['finalizeJs'] = file_get_contents($realpath.'/finalize.js');
	}

	$rtn['finalizePhp'] = '';
	if( is_file($realpath.'/finalize.php') ){
		$rtn['finalizePhp'] = file_get_contents($realpath.'/finalize.php');
	}

	$rtn['clipJson'] = '';
	if( is_file($realpath.'/clip.json') ){
		$rtn['clipJson'] = file_get_contents($realpath.'/clip.json');
	}

	return $rtn;
};
