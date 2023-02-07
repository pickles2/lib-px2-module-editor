<?php
/**
 * GPI: getPackageList
 */
return function($px2me, $data){
	$broccoli = $px2me->createBroccoli(array());

	$packageList = $broccoli->getPackageList();

	foreach( $packageList as $idx=>$packageInfo){
		$packageList[$idx]['isEditable'] = $px2me->isEditablePath($packageList[$idx]['realpath']);
	}

	return $packageList;
};
