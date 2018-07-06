<?php
/**
 * GPI: getConfig
 */
return function($px2me, $data){
	$conf = array();
	$conf['appMode'] = $px2me->getAppMode();
	return $conf;
};
