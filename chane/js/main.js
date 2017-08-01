//菜单
var menus = {
	obj: $('.m-menu-icon'),
	showMenus: function() {
		var _this = this;
		$('.m-menu-icon').on('click', function() {
			var obj = $('.m-menus');
			if(obj.hasClass('active')) {
				obj.removeClass('active');
			} else {
				obj.addClass('active');
			}
		});
	},
	closeMenu:function(){
		$('.m-menu-close').on('click',function(){
			var obj = $('.m-menus');
			if(obj.hasClass('active')) {
				obj.removeClass('active')
			}
			
		});
	},
	init: function() {
		this.showMenus();
		this.closeMenu();
	}
}

var gotop = function(){
    var oTop = document.createElement('div');
    oTop.className = "m-gotop";
    oTop.style.display = "none";
    
	var d = document.documentElement;
	var b = document.body;
	window.onscroll = btnDisplay;
	oTop.onclick = function (){
		oTop.style.display = "none";
		window.onscroll = null;
		this.timer = setInterval(function(){
			d.scrollTop -= Math.ceil((d.scrollTop+b.scrollTop)*0.1);
			b.scrollTop -= Math.ceil((d.scrollTop+b.scrollTop)*0.1);
			if((d.scrollTop + b.scrollTop) == 0)
				clearInterval(oTop.timer,window.onscroll = btnDisplay);
		},10);
	};
	
	function btnDisplay(){
		oTop.style.display=(d.scrollTop+b.scrollTop>200)?'block':"none";
	}
    document.body.appendChild(oTop);
}