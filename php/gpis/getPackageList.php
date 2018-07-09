<?php
/**
 * GPI: getPackageList
 */
return function($px2me, $data){
	$broccoli = $px2me->createBroccoli(array());
	// var_dump($broccoli);

	$packageList = $broccoli->getPackageList();
	// var_dump('getPackageList', $packageList);

	foreach( $packageList as $idx=>$packageInfo){
		$packageList[$idx]['isEditable'] = $px2me->isEditablePath($packageList[$idx]['realpath']);
	}

	return $packageList;
};
