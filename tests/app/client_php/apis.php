<?php
require_once(__DIR__.'/../../../vendor/autoload.php');
$px2ｍe = new pickles2\libs\moduleEditor\main();
$px2ｍe->init(array(
	'appMode' => 'web', // 'web' or 'desktop'. default to 'web'
	'entryScript' => realpath(__DIR__.'/../../htdocs/.px_execute.php')
));
$value = $px2ｍe->gpi( json_decode( $_REQUEST['data'] ) );
header('Content-type: text/json');
echo json_encode($value);
exit;
