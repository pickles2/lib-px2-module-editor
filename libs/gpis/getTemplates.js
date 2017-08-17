/**
 * GPI: getTemplates
 */
module.exports = function(px2me, data, callback){
	delete(require.cache[require('path').resolve(__filename)]);

	var templates = {};

	templates['list'] = require('fs').readFileSync(__dirname+'/../templates/list.html.ejs').toString();
	templates['editPackage'] = require('fs').readFileSync(__dirname+'/../templates/editPackage.html.ejs').toString();
	templates['editCategory'] = require('fs').readFileSync(__dirname+'/../templates/editCategory.html.ejs').toString();
	templates['editModule'] = require('fs').readFileSync(__dirname+'/../templates/editModule.html.ejs').toString();
	templates['addNewPackage'] = require('fs').readFileSync(__dirname+'/../templates/addNewPackage.html.ejs').toString();
	templates['addNewCategory'] = require('fs').readFileSync(__dirname+'/../templates/addNewCategory.html.ejs').toString();
	templates['addNewModule'] = require('fs').readFileSync(__dirname+'/../templates/addNewModule.html.ejs').toString();
	// templates['deletePackage'] = require('fs').readFileSync(__dirname+'/../templates/deletePackage.html.ejs').toString();
	// templates['deleteCategory'] = require('fs').readFileSync(__dirname+'/../templates/deleteCategory.html.ejs').toString();
	// templates['deleteModule'] = require('fs').readFileSync(__dirname+'/../templates/deleteModule.html.ejs').toString();

	callback(templates);
	return;
}
