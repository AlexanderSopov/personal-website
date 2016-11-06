(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.script = require('./script');

$(document).ready(function () {
	$("#header-img img").load(function () {
		script.init();
	});
});

(function (i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
		(i[r].q = i[r].q || []).push(arguments);
	}, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-84550083-1', 'auto');
ga('send', 'pageview');

},{"./script":4}],2:[function(require,module,exports){
'use strict';

module.exports = function () {
	function init() {
		$.fn.scrollToBottom = scrollToBottom;
		$.fn.scrollStop = scrollStop;
	}
	function scrollToBottom() {
		return $(document).height() - this.scrollTop() - this.height();
	}
	function scrollStop(callback) {
		var that = this,
		    $this = $(that);
		$this.scroll(function (ev) {
			clearTimeout($this.data('scrollTimeout'));
			$this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
		});
	};
	return {
		init: init
	};
}();

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function () {
	var isExpanded, activeLink, navbar, pages, offset, linkHeight, links, margin, tresholds, hdHeight, hdImgHeight, headerImg, body, header;
	function init(headHeight, headImgheight, headerImage, bodyObj, headerObj) {
		hdHeight = headHeight;
		hdImgHeight = headImgheight;
		headerImg = headerImage;
		body = bodyObj;
		header = headerObj;
		isExpanded = false;
		navbar = $("#navbar");
		activeLink = navbar.find("ul .active");
		pages = [];
		tresholds = [];
		offset = 0;
		linkHeight = hdHeight * 0.65;
		links = navbar.find("ul li");
		margin = navbar.find("ul li h3").css("margin-top");
		margin = margin.substring(0, margin.length - 2);
		margin = Number(margin);
		var startAt = hdHeight + hdImgHeight;
		$("#navbar ul li").each(function (i, e) {
			$(e).hover(help.hoverActive, help.hoverInactive);
		});
		$(".page").each(function (i, e) {
			if (i == 0) startAt += $(e).height();else {
				pages.push($(e));
				tresholds.push({
					startAt: startAt,
					height: pages[i - 1].height()
				});
				startAt += tresholds[i - 1].height;
			}
		});
		headerImg.on("click", help.shrink);
		body.on("click", help.shrink);
		$(window).scroll(scrollHandler);
	}

	function toggle() {
		if (isExpanded) return help.shrink();
		help.expand();
	}
	function goTo(elt) {
		if (elt.id == "logo") {
			script.utils.scrollTo($("body"));
			if (isExpanded) help.shrink();
		} else if (isExpanded) {
			var je = $(elt);
			var id = "#" + je.attr("data-value");
			if (je.hasClass("active")) {
				je.toggleClass("active");
				activeLink.toggleClass("active");
			}
			script.utils.scrollTo($(id));
			setTimeout(function () {
				help.shrink();
			}, 100);
		}
	}
	//Private Methods
	function scrollHandler() {
		if (!isExpanded) {
			var weAreAt = $(document).scrollTop(),
			    lastTsh = tresholds.length - 1;
			for (var i = lastTsh; i >= 0; i--) {
				if (passedTreshold(tresholds[i], weAreAt)) return help.animateNavbar(weAreAt, i);
			}
		}
	}
	function passedTreshold(tsh, pos) {
		if (pos > tsh.startAt) return true;
		return false;
	}

	var help = function () {
		var tmpNavOffset = 0;
		function hoverActive() {
			$(this).toggleClass("hover");
		}
		function hoverInactive() {
			$(this).toggleClass("hover");
		}

		function expand() {
			if (!isExpanded) {
				header.css("height", linkHeight * pages.length + margin + "px");
				tmpNavOffset = navbar.css("top");
				navbar.css("top", margin);
				isExpanded = true;
				links.each(function (i, el) {
					el.style.height = linkHeight + "px";
					el.childNodes[1].style["margin-top"] = "0px";
				});
			}
		}
		function shrink() {
			if (isExpanded) {
				header.css("height", hdHeight + "px");
				offset = navbar.css("top");
				navbar.css("top", tmpNavOffset);
				isExpanded = false;
				links.each(function (i, el) {
					el.style.height = hdHeight + "px";
					el.childNodes[1].style["margin-top"] = margin + "px";
				});
			}
		}
		function animateNavbar(pos, i) {
			var tsh = tresholds[i],
			    offset = tsh.height,
			    relPos = pos + hdHeight - tsh.startAt;
			moveNavbar(relPos, offset, i);
		}
		function moveNavbar(pos, offset, i) {
			var progress = pos / offset,
			    height = hdHeight * i + hdHeight * progress,
			    height = height * -1;
			// console.log(
			// 	"pos", pos,
			// 	"\noffset", offset,
			//  	"\ni",i,
			//  	"\nheight", height,
			//  	"\nprogress", progress);
			if (i != pages.length - 1) {
				if (progress > 0.3) navbar.css("top", height + "px");else roundNav(i);
			} else roundNav(i);
		}
		function roundNav(i) {
			navbar.css("top", hdHeight * i * -1 - i * 2 + "px");
		}
		return {
			shrink: shrink,
			expand: expand,
			hoverActive: hoverActive,
			hoverInactive: hoverInactive,
			roundNav: roundNav,
			animateNavbar: animateNavbar,
			moveNavbar: moveNavbar
		};
	}();
	return {
		toggle: toggle,
		goTo: goTo,
		init: init
	};
}();

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function () {
	// Variables
	var activeClass, header, page, body, headerImg, hdHeight, hdImgHeight, bodyTop, linkHeight, activeElt;

	// Modules
	var nav = require('./nav'),
	    utils = require('./utils'),
	    jQPlugins = require('./jQPlugins');

	// Initiate
	function init() {
		(function setVariables() {
			activeClass = "active", header = $('header.stickyHD'), page = document.querySelectorAll(".page"), body = $("#body"), headerImg = $("#header-img img"), hdHeight = header.height(), hdImgHeight = headerImg.height(), bodyTop = body.offset().top, linkHeight = $("#navbar ul li").height();
		})();
		(function initSubModules() {
			nav.init(hdHeight, hdImgHeight, headerImg, body, header);
			jQPlugins.init();
			utils.init(hdImgHeight);
		})();
		body.css("top", hdHeight + hdImgHeight);
	}
	// Return object	
	var publicAPI = {
		init: init,
		nav: nav,
		utils: utils,
		jQPlugins: jQPlugins
	};
	return publicAPI;
}();

},{"./jQPlugins":2,"./nav":3,"./utils":5}],5:[function(require,module,exports){
"use strict";

module.exports = function () {
	var hdImgHeight, snapable, scroller;
	function init(headImgHeight) {
		hdImgHeight = headImgHeight;
		snapable = true;
		scroller = $("html, body");
		$(document).scrollStop(snapToHeader);
	}
	function scrollTo(elt) {
		setTimeout(function () {
			$("html, body").animate({ scrollTop: elt.offset().top - 100 }, 1000);
		}, 100);
	}
	function snapToHeader() {
		var that = $(this),
		    whereWeAt = that.scrollTop(),
		    snapTreshold = 60;

		if (whereWeAt < hdImgHeight - snapTreshold) {
			snapable = true;
		} else if (whereWeAt > hdImgHeight + snapTreshold) {
			snapable = true;
		} else {
			if (snapable) {
				scroller.animate({ scrollTop: hdImgHeight + 5 }, 10);
				snapable = false;
			}
		}
	}
	return {
		init: init,
		scrollTo: scrollTo
	};
}();

},{}]},{},[1]);
