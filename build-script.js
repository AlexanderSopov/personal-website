"use strict";
var utils	= require('./lib/utils.js'),
	html 	= {
				locals: utils.getLocals(),
				options:{
					compileDebug:true,
					pretty:false
				},
				path: "./dev/templates/"
			},
	babel 	= {
		srcPath: "./dev/static/js/index.js",
		destPath: "./dist/js/bundle.js",
		presets: ["es2015"],
		options: {
			minified: true,
			comments: false,
		}
	},

	stylus = {
		srcPath: "./dev/static/css/style.styl",
		destPath:"./dist/css/style.css",
		options: {compress:true, filename:"./dev/static/css/style.styl" }
	}


utils.build(html, stylus, babel);