<?php
require_once(__DIR__.'/../../../vendor/autoload.php');
$px2me = new pickles2\libs\moduleEditor\main();
$px2me->init(array(
	'appMode' => 'web', // 'web' or 'desktop'. default to 'web'
	'entryScript' => realpath(__DIR__.'/../../htdocs/.px_execute.php')
));
if(@$_GET['client_resources']){
	$value = $px2me->get_client_resources(__DIR__.'/caches/');
	header('Content-type: text/json');
	echo json_encode($value);
	exit;
}
$value = $px2me->gpi( json_decode( $_REQUEST['data'] ) );
header('Content-type: text/json');
echo json_encode($value);
exit;
