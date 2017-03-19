module.exports = (function(){
	// Variables
	var activeClass,
		header,
		page,
		body,
		headerImg,
		hdHeight,
		hdImgHeight,
		bodyTop,
		linkHeight,
		activeElt;

	// Modules
	var nav 		= require('./nav'),
	 	utils	 	= require('./utils'),
		jQPlugins 	= require('./jQPlugins');

	// Initiate
	function init(){
		(function setVariables(){
			activeClass	= "active",
			header 		= $('header.stickyHD'),
			page		= document.querySelectorAll(".page"),
			body		= $("#body"),
			headerImg	= $("#header-img img"),
			hdHeight 	= header.height(),
			hdImgHeight	= headerImg.height(),
			bodyTop		= body.offset().top,
			linkHeight	= $("#navbar ul li").height();
		})();
		(function initSubModules(){
			nav.init(hdHeight, hdImgHeight, headerImg, body, header);
			jQPlugins.init();
			utils.init(hdImgHeight);
		})();
		body.css("top", (hdHeight + hdImgHeight) );
	}
	// Return object	
	var publicAPI = {
		init:init,
		nav:nav,
		utils:utils,
		jQPlugins:jQPlugins
	};
	return publicAPI;
})();
