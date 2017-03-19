module.exports = (function(){
	function init(){
		$.fn.scrollToBottom = scrollToBottom;
		$.fn.scrollStop = scrollStop;
	}
	function scrollToBottom() { 
		return $(document).height() - this.scrollTop() - this.height(); 
	}
	function scrollStop(callback) {
		var that = this, $this = $(that);
		$this.scroll(function(ev) {
			clearTimeout($this.data('scrollTimeout'));
			$this.data('scrollTimeout', setTimeout(callback.bind(that), 250, ev));
		});
	};
	return {
		init:init
	};
})();
