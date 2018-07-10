<?php
/**
 * GPI: addNewCategory
 */
return function($px2me, $data){

	$broccoli = $px2me->createBroccoli(array());

	// console.log(broccoli);

	if( !$data['packageId'] ){
		return false;
	}
	$realpath = $broccoli->paths_module_template[$data['packageId']].'/';
	if( !is_dir($realpath) ){
		return false;
	}

	if( !$px2me->isEditablePath( $realpath ) ){
		// 編集可能なパスかどうか評価
		// 駄目なら上書いてはいけない。
		return false;
	}
	$realpath = $realpath.'/'.urlencode($data['data']['categoryId']);
	if( is_dir($realpath) ){
		// 既に存在する
		return false;
	}

	$px2me->fs()->mkdir_r($realpath);

	$infoJson = json_decode('{}');
	$infoJson->name = $data['data']['categoryName'];
	$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

	return true;
};
