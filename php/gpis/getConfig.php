<?php
/**
 * GPI: getConfig
 */
return function($px2me, $data){
	$conf = array();
	$conf['appMode'] = $px2me->getAppMode();
	$conf['languageCsv'] = file_get_contents(__DIR__.'/../../data/language.csv');
	return $conf;
};
