module.exports = (function(){
	var sliders = $(".slider");
	var second = 1000;
	var timeout = 40*second/1;
	var fadeout = 1*second;
	var sliderObj = {};
	

	for(var i = 0; i < sliders.length; i++){
		var slide = $(sliders[i]);
		sliderObj[slide.attr("id")] = init(slide);
	}

	return {
		goTo:goTo,
		goRight:goRight,
		goLeft:goLeft
	}


	function goRight(sliderId){
		sliderObj[sliderId].resetInterval();
		sliderObj[sliderId].goRight();
	}

	function goLeft(sliderId){
		sliderObj[sliderId].resetInterval();
		sliderObj[sliderId].goLeft();		
	}

	function goTo(nr, sliderId){
		sliderObj[sliderId].resetInterval();
		sliderObj[sliderId].goTo(nr);
	}



	function init(slider){
		var id = slider.attr("id");
		var slides = slider.find(".slide-cont");
		var dots = slider.find(".dot");
		var activeSlide = 0;
		var oldActive;
		var interval = setInterval(spin, timeout);
		function spin(){
			goRight();
		}

		function goTo(nr){
			if(nr < activeSlide)
				return jumpFromRight(nr);
			var steps = nr - activeSlide;
			for (var i = 0; i<steps; i++){
				goRight();
			}
		}

		function jumpFromRight(nr){
			var steps = activeSlide - nr;
			for (var i = 0; i<steps; i++)
				goLeft();
		}
		function goRight(){
			if (activeSlide+1==slides.length)
				return reset();
			oldActive = activeSlide++;
			toggle();
			turnLeft();
		}
		function goLeft(){
			if (activeSlide == 0)
				return inverseReset();
			oldActive = activeSlide--;
			turnRight();
			toggle();
		}

		function toggle(){
			$(slides[oldActive]).toggleClass("active");
			$(slides[activeSlide]).toggleClass("active");
			$(dots[oldActive]).toggleClass("active");
			$(dots[activeSlide]).toggleClass("active");
		}
		function reset(){
			oldActive = activeSlide;
			activeSlide = 0;
			removeLefties();
			toggle();
			turnLeft();
			removeLefties();
		}
		function inverseReset(){
			oldActive = activeSlide;
			activeSlide = slides.length -1;
			addLefties();
			turnRight();
			toggle();
		}

		function turnLeft(){
			$(slides[oldActive]).toggleClass("left");
		}

		function turnRight(){
			$(slides[activeSlide]).toggleClass("left");
		}


		function resetInterval(){
			clearInterval(interval);
			interval = setInterval(spin, timeout);
		}
		function removeLefties(){
			for(var i=0; i<slides.length; i++){
				var sl = $(slides[i]);
				sl.toggleClass("fast-speed");
				if (sl.hasClass("left")){
					sl.toggleClass("left");
				}
				sl.toggleClass("fast-speed");
			}
		}
		function addLefties(){
			for(var i=1; i<slides.length; i++){
				var sl = $(slides[i]);
				sl.toggleClass("fast-speed");
				sl.toggleClass("left");
				sl.toggleClass("fast-speed");
			}
			$(slides[0]).toggleClass("left")
		}
		return {
			goTo:goTo,
			goRight:goRight,
			goLeft:goLeft,
			resetInterval:resetInterval
		}
	}
})();