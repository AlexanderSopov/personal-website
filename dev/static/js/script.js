module.exports = (function(){
	// Variables
	// Modules
	// var nav 		= require('./nav'),
	// 	 utils	 	= require('./utils'),
	// 	jQPlugins 	= require('./jQPlugins'),
	var	slider		= require('./slider');

	// Initiate
	function init(){
		(function setVariables(){
		})();
		(function initSubModules(){
			// nav.init(hdHeight, hdImgHeight, headerImg, body, header);
			// jQPlugins.init();
			// utils.init(hdImgHeight);
		})();
	}
	// Return object	
	var publicAPI = {
		init:init,
		// nav:nav,
		// utils:utils,
		// jQPlugins:jQPlugins
		slider:slider
	};
	return publicAPI;
})();
