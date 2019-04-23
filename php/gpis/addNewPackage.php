<?php
/**
 * GPI: addNewPackage
 */
return function($px2me, $data){

	$broccoli = $px2me->createBroccoli(array());

	// var_dump($broccoli);

	$realpath = $px2me->fs()->get_realpath($px2me->get_px2conf()->plugins->px2dt->path_module_templates_dir.'/', dirname($px2me->entry_script()));
	if( !is_dir($realpath) ){
		return array(
			'result' => false,
			'msg' => 'テンプレートディレクトリが存在しません。',
		);
	}

	if( !$px2me->isEditablePath( $realpath ) ){
		// 編集可能なパスかどうか評価
		// 駄目なら上書いてはいけない。
		return array(
			'result' => false,
			'msg' => 'テンプレートディレクトリが編集できないパスを指しています。',
		);
	}
	$realpath = $realpath.'/'.urlencode($data['data']['packageId']).'/';
	if( is_dir($realpath) && !$data['data']['force'] ){
		// 既に存在する
		return array(
			'result' => false,
			'msg' => 'そのパッケージIDはすでに存在します。',
		);
	}

	$px2me->fs()->mkdir_r($realpath);

	if( strlen($data['data']['importFrom']) ){
		preg_match('/^(moduleCollection|modulePlugin)\:([\S]+)$/s', $data['data']['importFrom'], $matched);
		$fromDiv = $matched[1];
		$fromId = $matched[2];
		if( $fromDiv == 'moduleCollection' ){
			$px2me->fs()->copy_r(
				$broccoli->paths_module_template[$fromId],
				$realpath
			);
		}elseif($fromDiv == 'modulePlugin'){
			$pluginInfo = $px2me->get_packages()->package_list->broccoliModules[$fromId];
			$px2me->fs()->copy_r(
				$pluginInfo->path,
				$realpath
			);
		}
	}


	$infoJson = json_decode('{}');
	if( is_file( $realpath.'/info.json' ) ){
		$infoJson = @json_decode( file_get_contents( $realpath.'/info.json' ) );
	}
	$infoJson->name = $data['data']['packageName'];
	$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson));

	return array(
		'result' => true,
		'msg' => 'OK',
	);
};
