<?php
/**
 * GPI: deleteCategory
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
	$realpath = $broccoli->paths_module_template[$parsedModId['package']].'/'.urlencode($parsedModId['category']).'/';
	if( !$px2me->isEditablePath( $realpath ) ){
		// 編集可能なパスかどうか評価
		// 駄目なら上書いてはいけない。
		return false;
	}
	if( !is_dir($realpath) ){
		// 既に存在していない
		return false;
	}

	$result = $px2me->fs()->rm($realpath);

	return !!$result;
};
