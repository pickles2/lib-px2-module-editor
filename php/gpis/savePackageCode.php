<?php
/**
 * GPI: savePackageCode
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

	$px2me->fs()->save_file($realpath.'/info.json', json_encode(json_decode($data['data']['infoJson']), JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES ));

	return true;
};
