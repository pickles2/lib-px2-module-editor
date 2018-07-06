<?php
/**
 * GPI: pickles2-contents-editor
 */
return function($px2me, $data){
	// var_dump($data);
	$px2ce = $px2me->createPickles2ContentsEditor();
	$rtn = $px2ce->gpi( $data['forPx2CE'] );
	return $rtn;
};
