"use strict";
var	fs			= require('fs'),
	pug 		= require('pug'),
	stylus		= require('stylus'),
	browserify 	= require('browserify');

module.exports = (function(){
	

	function build(html,cssPath, babelOptions){
		mkdir("./build");
		mkdir("./dist/css");
		mkdir("./dist/js");
		transpileCSS(cssPath);
		browserifyJS(babelOptions, function(err){
			if(err)
				throw err;
			fs.writeFileSync("./build/index.html", (pug.compileFile(html.path,html.options))(html.locals))
			copyStatics();
		});
	}


	function transpileCSS(opt, cb){
		var css 		= fs.readFileSync(opt.srcPath, "utf8"),
			transpiled	= stylus.render(css, opt.options);
		fs.writeFileSync(opt.destPath, transpiled);
	}

	function browserifyJS(babelOptions, cb){
		browserify(babelOptions.srcPath)
		.transform("babelify", babelOptions.options)
		.bundle(function(err, data){
			if(err)
				cb(err);
			fs.writeFileSync(babelOptions.destPath, data);
			cb(null);
		})
	}
	function getLocals(){
		return JSON.parse(fs.readFileSync("./dev/locals.json", "utf8"));
	}

	function copyStatics(){
		var srcImgPath 		= "./dev/static/img/",
			destImgpath 	= "./build/img/";
		var images = fs.readdirSync(srcImgPath);
		mkdir("./build/img");
		for (var i in images)
			fs.writeFileSync(destImgpath + images[i], fs.readFileSync(srcImgPath+images[i]));
	}

	function mkdir(path){
		var pathArr 	= path.split("/"),
			walkedPath	= "";

		for (var i = 0; i<pathArr.length-1;i++){
			var found = false;
			walkedPath += pathArr[i] + "/";
			var folderArr = fs.readdirSync(walkedPath);
			for (var j in folderArr){
				if(folderArr[j] == pathArr[i+1]){
					found = true;
					break;
				}
			}
			if(!found)
				fs.mkdirSync(walkedPath + pathArr[i+1]);
		}
	}
	var publicApi = {
		build:build,
		getLocals:getLocals
	};
	return publicApi;

})();