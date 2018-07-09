<?php
/**
 * GPI: deletePackage
 */
return function($px2me, $data){

	$realpath = $px2me->fs()->get_realpath( $px2me->get_px2conf()->plugins->px2dt->path_module_templates_dir.'/', dirname($px2me->entry_script()));
	if( !is_dir($realpath) ){
		return false;
	}

	if( !$px2me->isEditablePath( $realpath ) ){
		// 編集可能なパスかどうか評価
		// 駄目なら上書いてはいけない。
		return false;
	}
	$realpath = $realpath.'/'.urlencode($data['packageId']).'/';
	if( !is_dir($realpath) ){
		// 既に存在していない
		return false;
	}
	$result = $px2me->fs()->rm($realpath);

	return !!$result;
};
