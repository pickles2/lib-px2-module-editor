<?php
/**
 * GPI: addNewModule
 */
return function($px2me, $data){

	$broccoli = $px2me->createBroccoli(array());

	// console.log(broccoli);
	$parsedModId = $broccoli->parseModuleId($data['categoryId'].'/dmy');
	if( $parsedModId === false ){
		return false;
	}
	if( !$parsedModId['category'] ){
		return false;
	}
	$realpath = $broccoli->paths_module_template[$parsedModId['package']].'/'.$parsedModId['category'].'/';
	if( !is_dir($realpath) ){
		return false;
	}
	if( !$px2me->isEditablePath( $realpath ) ){
		// 編集可能なパスかどうか評価
		// 駄目なら上書いてはいけない。
		return false;
	}
	$realpath = $realpath.'/'.$data['data']['moduleId'];
	if( is_dir($realpath) ){
		// 既に存在する
		return false;
	}
	$px2me->fs()->mkdir_r($realpath);

	$infoJson = array();
	$infoJson['name'] = $data['data']['moduleName'];
	$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

	$px2me->fs()->save_file($realpath.'/template.html', '');
	$px2me->fs()->save_file($realpath.'/module.css.scss', '');
	$px2me->fs()->save_file($realpath.'/module.js', '');

	callback(true);
	return;};
