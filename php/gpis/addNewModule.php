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
	$infoJsonInterfaceTemplate = array(
		"fields" => array(
			"mainText" => array(
				"fieldType" => "input",
				"type" => "multitext",
				"label" => "テキスト",
			),
		),
	);

	switch($data['data']['moduleName']){
		case 'html':
			$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
			$px2me->fs()->save_file($realpath.'/template.html', '<div></div>');
			break;
		case 'twig':
			$infoJson['interface'] = $infoJsonInterfaceTemplate;
			$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
			$px2me->fs()->save_file($realpath.'/template.html.twig', '<div>{{ mainText }}</div>');
			break;
		case 'clip':
			$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
			$px2me->fs()->save_file($realpath.'/clip.json', '{}');
			break;
		case 'kflow':
		default:
			$infoJson['interface'] = $infoJsonInterfaceTemplate;
			$px2me->fs()->save_file($realpath.'/info.json', json_encode($infoJson, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));

			$blockName = preg_replace('/[^a-zA-Z0-9]+/', '-', $data['categoryId']);
			$kflowSrc = '';
			ob_start(); ?>
<kflow>
	<configs>
		<config name="module-name" value="<?= htmlspecialchars($blockName) ?>" />
	</configs>
	<contents>
		<content name="main"><div>{{ mainText }}</div></content>
	</contents>
</kflow>
<?php
			$kflowSrc .= ob_get_clean();
			$px2me->fs()->mkdir($realpath.'/src/');
			$px2me->fs()->save_file($realpath.'/src/template.kflow', $kflowSrc);
			$px2me->fs()->save_file($realpath.'/template.html.twig', '');
			break;
	}

	$px2me->fs()->save_file($realpath.'/module.css.scss', '');
	$px2me->fs()->save_file($realpath.'/module.js', '');

	callback(true);
	return;
};
