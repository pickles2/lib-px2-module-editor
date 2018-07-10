<?php
/**
 * GPI: broccoli-html-editor
 */
return function($px2me, $data){

	$broccoli = $px2me->createBroccoli(array( 'moduleId' => $data['moduleId'] ));

	$rtn = $broccoli->gpi(
		json_decode($data['forBroccoli']['api'], true),
		json_decode($data['forBroccoli']['options'], true)
	);

	return $rtn;
};
