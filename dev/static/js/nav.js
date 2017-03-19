module.exports = (function(){
		var isExpanded,
			activeLink,
			navbar,
			pages,
			offset,
			linkHeight,
			links,
			margin,
			tresholds,
			hdHeight,
			hdImgHeight,
			headerImg,
			body,
			header;
		function init(headHeight, headImgheight, headerImage, bodyObj, headerObj){
			hdHeight 	= headHeight;
			hdImgHeight = headImgheight;
			headerImg 	= headerImage;
			body 		= bodyObj;
			header 		= headerObj;
			isExpanded 	= false;
			navbar		= $("#navbar");
			activeLink 	= navbar.find("ul .active");
			pages		= [];
			tresholds	= [];
			offset		= 0;
			linkHeight	= hdHeight * 0.65;
			links		= navbar.find("ul li");
			margin 		= navbar.find("ul li h3").css("margin-top");
			margin 		= margin.substring(0,margin.length-2);
			margin 		= Number(margin);
			var startAt = hdHeight+hdImgHeight;
			$("#navbar ul li").each(function(i,e){
				$(e).hover(help.hoverActive, help.hoverInactive);
			});
			$(".page").each(function(i,e){
				if(i==0)
					startAt += $(e).height();
				else{
					pages.push($(e));
					tresholds.push({
						startAt: startAt,
						height: pages[i-1].height()
					});
					startAt += tresholds[i-1].height;
				}
			});
			headerImg.on("click", help.shrink);
			body.on("click", help.shrink);
			$(window).scroll(scrollHandler);
		}

		function toggle(){
			if(isExpanded)
				return help.shrink();
			help.expand();
		}
		function goTo(elt){
			if (elt.id == "logo"){
				script.utils.scrollTo($("body"))
				if(isExpanded)
					help.shrink();
			}else if(isExpanded){
				var je = $(elt);
				var id ="#" + je.attr("data-value");
				if(je.hasClass("active")){
					je.toggleClass("active");
					activeLink.toggleClass("active");
				}
				script.utils.scrollTo($(id));
				setTimeout(function(){help.shrink();},100);
			}
		}
		//Private Methods
		function scrollHandler(){
			if (!isExpanded){
				var weAreAt = $(document).scrollTop(),
					lastTsh	= tresholds.length-1;
				for (var i = lastTsh; i>= 0; i--)
					if (passedTreshold(tresholds[i], weAreAt))
						return help.animateNavbar(weAreAt, i);
			}
		}
		function passedTreshold(tsh, pos){
			if (pos > tsh.startAt)
				return true;
			return false;
		}

		var help = (function(){
			var tmpNavOffset = 0;
			function hoverActive(){
				$(this).toggleClass("hover");
			}
			function hoverInactive(){
				$(this).toggleClass("hover");
			}

			function expand(){
				if(!isExpanded){
					header.css("height", (linkHeight*pages.length+margin) + "px");
					tmpNavOffset = navbar.css("top");
					navbar.css("top", margin);
					isExpanded = true;
					links.each(function(i, el){
						el.style.height = (linkHeight)+ "px";
						el.childNodes[1].style["margin-top"] = "0px";
					});
				}
			}
			function shrink(){
				if(isExpanded){
					header.css("height", hdHeight + "px");
					offset = navbar.css("top");
					navbar.css("top",tmpNavOffset);
					isExpanded = false;	
					links.each(function(i, el){
						el.style.height = hdHeight+ "px";
						el.childNodes[1].style["margin-top"] = margin+"px";
					});		
				}
			}
			function animateNavbar(pos, i){
				var tsh 	= tresholds[i],
					offset	= tsh.height,
					relPos 	= pos + hdHeight - tsh.startAt;
				moveNavbar(relPos, offset, i);
			}
			function moveNavbar(pos, offset, i){
				var progress 	= pos / offset,
					height 		= (hdHeight*(i)) + (hdHeight*progress),
					height 		= height *-1;
				// console.log(
				// 	"pos", pos,
				// 	"\noffset", offset,
				//  	"\ni",i,
				//  	"\nheight", height,
				//  	"\nprogress", progress);
				if (i != pages.length-1)
					if(progress > 0.3)
						navbar.css("top", height +"px");
					else
						roundNav(i);
				else
					roundNav(i);

			}
			function roundNav(i){
				navbar.css("top", (hdHeight*i*-1) - (i*2) + "px");
			}
			return {
				shrink:shrink,
				expand:expand,
				hoverActive:hoverActive,
				hoverInactive:hoverInactive,
				roundNav:roundNav,
				animateNavbar:animateNavbar,
				moveNavbar:moveNavbar
			};
		})();
		return {
			toggle:toggle,
			goTo:goTo,
			init:init
		};
	})();

