<?php
/**
 * GPI: saveModuleCode
 */
return function($px2me, $data){

	$broccoli = $px2me->createBroccoli(array());

	// console.log(broccoli);
	$realpath = $broccoli->getModuleRealpath($data['moduleId']);
	if( !is_dir($realpath) ){
		return false;
	}
	if( !$px2me->isEditablePath( $realpath ) ){
		// 編集可能なパスかどうか評価
		// 駄目なら上書いてはいけない。
		return false;
	}

	$px2me->fs()->rm($realpath.'/template.html');
	$px2me->fs()->rm($realpath.'/template.html.twig');
	if( strlen( $data['data']['clipJson'] ) && !strlen($data['data']['template']) ){
		// clip に値があって、 template に値がない場合、
		// クリップモジュールとみなしてテンプレートファイルの生成は行わない。
	}else{
		$px2me->fs()->save_file($realpath.'/template.'.$data['data']['templateExt'], $data['data']['template']);
	}

	$px2me->fs()->save_file($realpath.'/info.json', json_encode(json_decode($data['data']['infoJson']), JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

	$px2me->fs()->rm($realpath.'/module.css');
	$px2me->fs()->rm($realpath.'/module.css.scss');

	if( strlen( $data['data']['css'] ) ){
		$px2me->fs()->save_file($realpath.'/module.'.$data['data']['cssExt'], $data['data']['css']);
	}

	$px2me->fs()->rm($realpath.'/module.js');
	if( strlen( $data['data']['js'] ) ){
		$px2me->fs()->save_file($realpath.'/module.'.$data['data']['jsExt'], $data['data']['js']);
	}

	$px2me->fs()->rm($realpath.'/finalize.js');
	if( strlen( $data['data']['finalizeJs'] ) ){
		$px2me->fs()->save_file($realpath.'/finalize.js', $data['data']['finalizeJs']);
	}

	$px2me->fs()->rm($realpath.'/finalize.php');
	if( strlen( $data['data']['finalizePhp'] ) ){
		$px2me->fs()->save_file($realpath.'/finalize.php', $data['data']['finalizePhp']);
	}

	$px2me->fs()->rm($realpath.'/clip.json');
	if( strlen( $data['data']['clipJson'] ) ){
		$px2me->fs()->save_file($realpath.'/clip.json', json_encode(json_decode($data['data']['clipJson']), JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
	}

	return true;
};
