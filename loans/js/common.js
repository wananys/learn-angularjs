/**
 * 浏览器自适应
 * @param {Object} doc
 * @param {Object} win
 */
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
			if(clientWidth >= 640) {
				docEl.style.fontSize = '100px';
			} else {
				docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
			}
		};

	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

/*
 * 系统配置
 */
var url = 'http://fptooltest.jiaxinmore.com/chaneapp/api';
//var	url = '/chaneapp/api';
var message = {
	serverErr: '貌似网络不给力哦，请刷新页面!',
	noMssege: '管理员你赖皮，说好有的内容不见了!',
	loading: '正在努力加载,请等待...',
	loadend: '想要的都帮你找出来了，去看一下吧!',
	success: '已经加载完毕',
	searchMsg: '想找的全在这里，快输入内容吧!',
	changeWord:'真可惜你要的我给不了你，请换一个吧！'
}

/*
 * 获取url参数
 * 参数：
 * 	obj:{name:想要获取的url参数,type:是否需要解码}
 */
var getUrlParam = function(obj) {
	var url = window.location.search;
	if(obj.type && obj.type === 'decode'){
		url = decodeURI(url);
	}
    var reg = new RegExp("(^|&)" + obj.name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = url.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); 
    return null; //返回参数值
};

/*
 * 404错误提示
 * 参数：
 *  opt{classname:所需样式(tips-no-message:无内容，tips-change-word:搜索换关键词,tips-search:搜索页提示),content:弹出内容,divBox:父元素id或class}
 */
var tips = function(opt){
	var className = opt.classname;
	var content = opt.content;
	var oDiv = document.createElement('div');
	var oEm = document.createElement('em');
	var oP = document.createElement('p');
	
	oP.innerHTML = content;
	oDiv.className = 'self-tips';
	oEm.className = className;
	oDiv.appendChild(oEm);
	oDiv.appendChild(oP);
	if(opt.divBox){
		$(opt.divBox).before(oDiv);
	}else{
		document.body.appendChild(oDiv);
	}
};

/**
 * 滚动事件
 * obj{callback:调用函数,obj:当前对象this}
 */
var scrollFunc = function(obj){
	$(window).scroll(function() {　　
		var scrollTop = $(this).scrollTop();　　
		var scrollHeight = $(document).height();　　
		var windowHeight = $(this).height();　　
		if(scrollTop + windowHeight == scrollHeight) {　　　　
			obj.callback(obj);
		}
	});
}

/**
 * 悬浮菜单
 * @param {Object} type(top:返回顶部,home:返回主页,默认都显示)
 */
var menus = function(type){
    var oMenus = document.createElement('div');
    var oTop = document.createElement('div');
    var oHome = document.createElement('a');
    oMenus.className = 'sus-menus';
    oTop.className = "goTop";
    oTop.style.display = "none";
    oHome.className = "gotoHome";
    oHome.href = 'index.html';
    
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
    if(type){
    	if(type == 'top'){
    		oMenus.appendChild(oTop);
    	}else if(type== 'home'){
    		oMenus.appendChild(oHome);
    	}else{
    		oMenus.appendChild(oTop);
    		oMenus.appendChild(oHome);
    	}
    }else{
    	oMenus.appendChild(oTop);
    	oMenus.appendChild(oHome);
    }
    document.body.appendChild(oMenus);
}

/**
 * 搜索功能
 * searchData:搜索按钮点击事件
 * backAll:返回全部
 * clearWord:清空输入框
 * 参数 obj{callback:调用函数,type:类型(s表示从搜索页过去),this:当前对象,keyWord:搜索关键字}
 */
var search = {
	'searchInput': $('input[name=search]'),   //搜索按钮
	clearWord: function(){
		var _this = this;
		$('.loan-search-clear').on('click',function(){
			_this.searchInput.val('');
		});
	},
	searchData:function(obj){
		var _this = this;
		$(document).on('click','.loan-search-btn',function(){
			obj.keyWord = _this.searchInput.val();
			if(obj.type === 'search' || obj.type === 'fileSearch'){
				if(obj.keyWord === ''){
					$.tips({
				        content:'请输入搜索关键词',
				        stayTime:3000
				   	});
				   	return false;
				}
			}else{
				obj.type = 's';
			}
			$('.loan-search').addClass('active');
			$('.loan-back').removeClass('none');
			obj.callback(obj);
		});
	},
	backAll:function(obj){
		var _this = this;
		$('.loan-back').on('click',function(){
			$('.loan-search').removeClass('active');
			$('.loan-back').addClass('none');
			if(obj.type && obj.type === 'fileSearch'){//附件搜索单独处理
				$('.accessory').removeClass('none');
				$('#accessory-result').addClass('none');
			}else 
			if((obj.type && obj.type === 'search')){
				obj.keyWord = '';
				obj.callFun();
			}else{
				obj.type = 's';
				obj.keyWord = '';
				obj.callback(obj);
			}
			_this.searchInput.val('');
		});
	},
	init:function(obj){
		if(obj && obj.keyWord && obj.keyword != ''){
			$('.loan-search').addClass('active');
			$('.loan-back').removeClass('none');
		}
		search.clearWord();
		search.searchData(obj);
		search.backAll(obj);
	}
};

/**
 * 常用模板函数helper
 */
var templateFun = {
	dueDatesFun: function(){  //切割逗号(,)字符串,并分行
		template.helper('dueDatesFun', function (date) {
			if(date){
				var html = date.join(',');
				return html.replace(/,/g,'<br>');
			}
		});
	},
	splitWord:function(){
		template.helper('splitWord', function (data) {
			var str = data.replace(' ','<br>');
			return str;
		});
	},
	dateFormat : function(){ //artTemplate年月处理
		template.helper('dateFormat', function (date) {
			if(date){
				return date.substr(5);
			}
		});
	},
	isToday : function(){
		template.helper('isToday', function (date) {
			var datetime = parseInt(date.replace(/-/g,''));
			var today = new Date();
			var year = (today.getFullYear()).toString();
		    var month = (today.getMonth() + 1).toString();
		    month = month>=10?month:'0'+month;
		    var day = today.getDate();
		    day = day>=10?day:'0'+day;
		    today = parseInt(year+month+day);
		    if(datetime == today){
		    	return 'gantt-today-line';
		    }
		});
	},
	strLength :function(){
		template.helper('strLength',function(list){
			var length = list.length;
			return length;
		});
	},
	strLengthOmit : function(){
		template.helper('strLengthOmit',function(list){
			var length = list.length;
			if(length<=2){
				return 'self-omit active';
			}
			
		});
	},
	weekDate : function(){
		template.helper('weekDate',function(beginDate,endDate){
			var beginDateArr = [];
			var endDateArr = [];
			beginDateArr = beginDate.split('-');
			endDateArr = endDate.split('-');
			if(beginDateArr[1] == endDateArr[1]){
				if(beginDateArr[2] == endDateArr[2]){
					return 	beginDateArr[1]+'月'+beginDateArr[2];
				}else{
					return beginDateArr[1]+'月'+beginDateArr[2]+'-'+ endDateArr[2];
				}
			}else{
				return beginDateArr[1]+'月'+beginDateArr[2]+'-'+endDateArr[1]+'月'+endDateArr[2];
			}
			
		});
	},
	//artTemplate处理日期
    compareDate : function(){
		template.helper('compareDate', function (date,planBeginDate,planEndDate,status) {
			var datetime = parseInt(date.replace(/-/g,''));
			var beginDate = parseInt(planBeginDate.replace(/-/g,''));
			var endDate = parseInt(planEndDate.replace(/-/g,''));
			var today = new Date();
			var year = (today.getFullYear()).toString();
	    	var month = (today.getMonth() + 1).toString();
	    	month = month>=10?month:'0'+month;
	    	var day = today.getDate();
	    	day = day>=10?day:'0'+day;
	    	today = parseInt(year+month+day);
	    	var type = '';
	    	if(datetime>=beginDate&&datetime<=endDate){
		    	if(status=='01'){ //未开始
					type = 'gantt-status-begin';
				}else if(status == '02'){//执行中
					type = 'gantt-status-going';
				}else if(status == '03'){//已完成
					type = 'gantt-status-finish';
				}else if(status == '04'){//已搁置
					type = 'gantt-status-end';
				}
			}else{
				if(status == '02'&& endDate < today && datetime<=today && datetime>beginDate){
					type = 'gantt-status-delay';
				}
			}
			return type;
		});
	},
	proGantt:function(){  //甘特图
		this.dateFormat();
    	this.isToday();
    	this.strLength();
    	this.strLengthOmit();
    	this.weekDate();
    	this.compareDate();
	},
	getBoardTags:function(){
		template.helper('getBoardTags',function(data){
			var html = '';
			for (var i=0;i<data.length;i++) {
				html += '<span>'+data[i].substr(0,6)+'</span>'; 
			}
			return html;
		});
	}
}
