module.exports = (function(){
	var hdImgHeight,
		snapable,
		scroller;
	function init(headImgHeight){
		hdImgHeight = headImgHeight;
		snapable	= true;
		scroller	= $("html, body");
		$(document).scrollStop(snapToHeader);
	}
	function scrollTo(elt){
		setTimeout(function(){
			$("html, body").animate({scrollTop: (elt.offset().top - 100) }, 1000);
		}, 100);
	}
	function snapToHeader() {
		var that	 		= $(this),
			whereWeAt 		= that.scrollTop(),
			snapTreshold	= 60;

		if (whereWeAt < hdImgHeight-snapTreshold){
			snapable = true;
		}else if (whereWeAt > hdImgHeight+snapTreshold){
			snapable = true;
		}else{
			if (snapable){
				scroller.animate({scrollTop: (hdImgHeight+5) }, 10);
				snapable = false;
			}
		}
	}
	return {
		init:init,
		scrollTo:scrollTo
	}
})();