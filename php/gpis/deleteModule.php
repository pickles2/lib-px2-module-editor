<?php
/**
 * GPI: deleteModule
 */
return function($px2me, $data){

	$broccoli = $px2me->createBroccoli(array());

	$parsedModId = $broccoli->parseModuleId($data['moduleId']);
	$realpath = $broccoli->paths_module_template[$parsedModId['package']].'/'.urlencode($parsedModId['category']).'/'.urlencode($parsedModId['module']).'/';

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
