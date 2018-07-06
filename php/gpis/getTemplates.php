<?php
/**
 * GPI: getTemplates
 */
return function($px2me, $data){
	$templates = array();

	$templates['list'] = file_get_contents(__DIR__.'/../templates/list.html.ejs');
	$templates['editPackage'] = file_get_contents(__DIR__.'/../templates/editPackage.html.ejs');
	$templates['editCategory'] = file_get_contents(__DIR__.'/../templates/editCategory.html.ejs');
	$templates['editModule'] = file_get_contents(__DIR__.'/../templates/editModule.html.ejs');
	$templates['addNewPackage'] = file_get_contents(__DIR__.'/../templates/addNewPackage.html.ejs');
	$templates['addNewCategory'] = file_get_contents(__DIR__.'/../templates/addNewCategory.html.ejs');
	$templates['addNewModule'] = file_get_contents(__DIR__.'/../templates/addNewModule.html.ejs');
	$templates['deletePackage'] = file_get_contents(__DIR__.'/../templates/deletePackage.html.ejs');
	$templates['deleteCategory'] = file_get_contents(__DIR__.'/../templates/deleteCategory.html.ejs');
	$templates['deleteModule'] = file_get_contents(__DIR__.'/../templates/deleteModule.html.ejs');

	return $templates;
};
