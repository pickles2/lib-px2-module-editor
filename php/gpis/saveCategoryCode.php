<?php
/**
 * GPI: saveCategoryCode
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

	$result = $px2me->fs()->save_file($realpath.'/info.json', json_encode(json_decode($data['data']['infoJson']), JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

	return !!$result;
};
