"use strict";
var	fs					= require('fs'),
		pug 				= require('pug'),
		stylus			= require('stylus'),
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
		var p = html.locals.pages
			for (var key in p)
  				if (p.hasOwnProperty(key)){
  					var locals = html.locals;
  					locals.activePage = p[key];
  					fs.writeFileSync("./build/"+p[key].filename+".html", (pug.compileFile(html.path+p[key].filename+".pug",html.options))(locals))
  				}
			copyStatics("./dev/static/img/", "./build/img/");
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
	function copyStatics(srcPath,destPath){
		// console.log("\n\n At copyStatics(srcPath, destpath)");
		// console.log(srcPath);
		// console.log(srcPath);
		var files = fs.readdirSync(srcPath);
		mkdir(destPath.substring(0,destPath.length-1));
		for (var i in files)
			try{
				fs.writeFileSync(destPath + files[i], fs.readFileSync(srcPath+files[i]));
			}catch(e){
				copyStatics(srcPath+files[i]+"/", destPath+files[i]+"/");
			}
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
			// console.log("\n\nAt mkDir(path, walkedpath, found)");
			// console.log(path);
			// console.log(walkedPath);
			// console.log(found);
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