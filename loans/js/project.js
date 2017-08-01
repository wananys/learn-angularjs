/**项目信息
 * getList:获取项目信息列表
 */
var proInfo = {
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var projectType = getUrlParam({name:'projectType'});
		var _this = obj?obj:this;
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type == 's'){
			_this.currentPage = 1;
		}
		$.ajax({
			type:"post",
			url:url+"/projectInfo/list",
			data:{
				pageNum:_this.currentPage,
				projectType:projectType,
				keyWord:_this.keyWord
			},
			success: function(callback){
				_this.type = '';
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('proInfoList', data);
					if(_this.currentPage == 1){
						$('.proInfoList').html(html);
					}else{
						$('.proInfoList').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.loan-list'
						});
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
					_this.currentPage++;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init: function(){
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		this.callback = this.getList;
		this.getList();
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 项目详情
 * getInfo:获取项目详情
 */
var proInfoDetail = {
	getInfo: function(){
		var param ={
			projectNo : getUrlParam({name:'projectNo'})
		}
		$.ajax({
			type:"post",
			url:url + "/projectInfo/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('proInfoTemp', data);
					$('#proInfo').html(html);
				}else{
					$.tips({
					    content:data.msg,
					    stayTime:3000
					});
					if(data.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 项目计划
 * getList:获取项目计划列表
 */
var proPlay = {
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var _this = obj?obj:this;
		var projectNo = getUrlParam({name:'projectNo'});
		if(projectNo!=null){
			$('.loan-search').addClass('none');
		}
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type == 's'){
			_this.currentPage = 1;
		}
		$.ajax({
			type:"post",
			url:url+"/projectPlan/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord,
				projectNo:projectNo
			},
			success: function(callback){
				_this.type = '';
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('proPlayList', data);
					if(_this.currentPage == 1){
						$('.loan-list').html(html);
					}else{
						$('.loan-list').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.loan-list'
						});
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
					_this.currentPage++;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init: function(){
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		this.callback = this.getList;
		search.init(this);
		this.getList();
		scrollFunc(this);
	}
};

/**
 * 计划详情
 * getInfo:获取详情信息
 */
var proPlayDetail = {
	getInfo: function(){
		var planNo = getUrlParam({name:'planNo'});
		$.ajax({
			type:"post",
			url:url + "/projectPlan/details",
			data:{planNo:planNo},
			success:function(data){
				if(data.code == 0){
					var html = template('proPlayListTemp', data);
					$('#pro_play_list').html(html);
				}else{
					$.tips({
					    content:data.msg,
					    stayTime:3000
					});
					if(data.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				tips({
					classname:'tips-no-message',
					content:message.noMssege,
					divBox:'.loan-list'
				});
			}
		});
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 项目进度
 * getLiat:获取项目进度列表
 */
var proPlan = {
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var _this = obj?obj:this;
		var projectNo = getUrlParam({name:'projectNo'});
		if(projectNo!=null){
			$('.loan-search').addClass('none');
		}
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type == 's'){
			_this.currentPage = 1;
		}
		$.ajax({
			type:"post",
			url:url+"/planSchedule/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord,
				projectNo:projectNo
			},
			success: function(callback){
				_this.type = '';
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('proPlanTemp', data);
					if(_this.currentPage == 1){
						$('.loan-list').html(html);
					}else{
						$('.loan-list').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.loan-list'
						});
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
					_this.currentPage++;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init: function(){
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		this.callback = this.getList;
		this.getList();
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 汇报详情
 * getInfo:获取汇报详情内容
 */
var proPlanDetail = {
	getInfo: function(){
		var param = {
			scheduleNo : getUrlParam({name:'scheduleNo'}),
			planNo : getUrlParam({name:'planNo'})
		} 
		$.ajax({
			type:"post",
			url:url + "/planSchedule/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('planlistTemp', data);
					$('#proPlanList').html(html);
				}else{
					$.tips({
					    content:data.msg,
					    stayTime:3000
					});
					if(data.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 计划汇报内容
 */
var proPlayContent = {
	currentPage: 1,
	getList: function(obj){
		var _this = obj?obj:this;
		var scheduleNo = getUrlParam({name:'scheduleNo'});
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		$.ajax({
			type:"post",
			url:url+"/planSchedule/contents",
			data:{
				scheduleNo:scheduleNo,
				pageNum:_this.currentPage
			},
			success: function(callback){
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('proPlanContentTemp', data);
					if(_this.currentPage == 1){
						$('.pro-content-list').html(html);
					}else{
						$('.pro-content-list').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.pro-content-list'
						});
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
					_this.currentPage++;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init: function(){
		this.callback = this.getList;
		this.getList();
		scrollFunc(this);
	}
};

/**
 * 项目报表
 * getList:获取项目报表列表
 */
var proReport = {
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var _this = obj?obj:this;
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type == 's'){
			_this.currentPage = 1;
		}
		$.ajax({
			type:"post",
			url:url+"/projectReport/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord
			},
			success: function(callback){
				_this.type ='';
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('proReportTemp', data);
					if(_this.currentPage == 1){
						$('.loan-list').html(html);
					}else{
						$('.loan-list').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.pro-content-list'
						});
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
					_this.currentPage++;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init: function(){
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		this.callback = this.getList;
		search.init(this);
		this.getList();
		scrollFunc(this);
	}
};

/**
 * 项目报表详情
 * getInfo:获取详情内容
 */
var proReportDetail = {
	getInfo: function(){
		var projectNo = getUrlParam({name:'projectNo'});
		$.ajax({
			type:"post",
			url:url + "/projectReport/details",
			data:{projectNo:projectNo},
			success:function(result){
				if(result.code == 0){
					var html = template('proReportListTemp', result);
					$('#proReportList').html(html);
				}else{
					$.tips({
					    content:result.msg,
					    stayTime:3000
					});
					if(result.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 甘特图
 * 待重构...
 */
var gantt = {
	currentPage: 1,
	totalPage:100,
	getList:function(type,date){
		/**
		 * type说明:-1(默认,传年月)0(上一页)1(下一页)2(按周显示)
		 */
		var projectNo = getUrlParam({name:'projectNo'});
		var flag = getUrlParam({name:'flag'});
		var year;
		var month;
		var currPage_val = this.currentPage;
		if(type=='0'){
			currPage_val --;
			this.currentPage = currPage_val;
		}else if(type == 1){
			currPage_val++;
			this.currentPage = currPage_val;
		}
		if(date&&date.length>0){
			year = date[0];
			month = date[1];
		}
		
		
		$.ajax({
			type:"post",
			url:url+'/projectReport/ganttChart',
			data:{
				pageNum:currPage_val,
				projectNo:projectNo,
				year:year,
				month:month
			},
			success: function(callback){
				if(callback.code == 0){
					var data = callback.dataSource;
					this.totalPage = data.totalPage;
					if(this.totalPage == 0){
						$('#gantt').html('');
						tips({
							classname:'tips-no-message',
							content:message.noMssege
						});
						return false;
					}else if(this.totalPage == 1){
						$('.gantt-pages').addClass('none');
					}else{
						if(currPage_val==1){
						 	$('.gantt-page-pre').addClass('none');
						 	$('.gantt-page-next').removeClass('none');
						}else if(currPage_val == this.totalPage){
						 	$('.gantt-page-pre').removeClass('none');
						 	$('.gantt-page-next').addClass('none');
						}else{
						 	$('.gantt-page-pre').removeClass('none');
						 	$('.gantt-page-next').removeClass('none');
						}
						
					}
					if(type!=-1){
						var html = template('ganttTemp', data);
						$('#gantt-list').html(html);
					}
					//图
					var ganttHtml = template('ganttDayPicTemp', data);
					
					$('.gantt-pic .ui-table').html(ganttHtml);
					var weekObj = $('.gantt-head-icon');
					if(weekObj.hasClass('active')){
						$('.gantt-week-list').addClass('none');
						$('.gantt-day-list').removeClass('none');
					}else{
						$('.gantt-week-list').removeClass('none');
						$('.gantt-day-list').addClass('none');
						
					}
			
					currPage_val++;
					this.currentPage = currPage_val;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						if(flag == 'app'){
							window.app.goLogin();
							return false;
						}
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
//				el.loading("hide");
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
//				el.loading("hide");
			}
		});
	},
	getPageList:function(){
		var pThis= this;
		$('.gantt-pages').on('click','.gantt-page',function(){
			var _this = $(this);
			var type = _this.data('type');
			var dateTime = $('.cur-month').data('date');
			var param = [];
			param = dateTime.split('-');
			pThis.getList(type,param);
			document.documentElement.scrollTop = document.body.scrollTop =0;
		});
		
	},
	choosePro:function(){
		var $this = this;
		$(document).on('click','.gantt-project',function(){
			var _this = $(this);
			var time = _this.data('date');
			var param = [];
			param = time.split('-');
			$('.cur-month').html(param[1]+'月');
			$this.getList('-1',param);
			$('.cur-month').attr('data-date',time);
			_this.addClass('active').siblings().removeClass('active');
		});
	},
	todayFun:function(){
		var $this = this;
		$(document).on('click','.gantt-today',function(){
			var today = new Date();
			var year = today.getFullYear();
    		var month = today.getMonth() + 1;
    		var param = [year,month];
    		$('.cur-month').html(month+'月');
    		$('.cur-month').attr('data-date',year+'-'+month);
			$this.getList('-1',param);
		});
	},
	changeWeek:function(){
		var $this = this;
		$(document).on('click','.gantt-head-icon',function(){
			var _this = $(this);
			var type;
			if(_this.hasClass('active')){
				_this.removeClass('active');
				$('.gantt-week-list').removeClass('none');
				$('.gantt-day-list').addClass('none');
			}else{
				_this.addClass('active');
				$('.gantt-week-list').addClass('none');
				$('.gantt-day-list').removeClass('none');
			}
		});
	},
	chooseMonth:function(){
		var $this = this;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var yearsArr=[],monthsArr=[],dateList=[];
		$('.cur-month').html(month+'月');
		yearsArr=[year-1,year,year+1];
		monthsArr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
		for (var i =0;i<yearsArr.length;i++) {
			for( var j=0;j<monthsArr.length;j++) {
				var date = yearsArr[i]+'-'+monthsArr[j];
				dateList.push(date);
			}
		}
		
		var selectedMonth = month>10?month:'0'+month;
		var selectedDate = year + '-'+ selectedMonth;
		$('.cur-month').attr('data-date',selectedDate);
		var pickerDate = new WheelPicker({
		    data: [dateList],
		    value:[selectedDate],
		    onSelect: function(selected) {
		        var param = [];
		        param = selected[0].value.split('-');
		        $('.cur-month').html(param[1]+'月');
		        $this.getList('-1',param);
		        $('.cur-month').attr('data-date',selected[0].value);
		    }
		});
		$(document).on('click','.cur-month',function(){
			pickerDate.show();
    		return false;
		});
	},
	init: function(){
		this.getList();
		this.getPageList();
		this.choosePro();
		this.todayFun();
		this.changeWeek();
		this.chooseMonth();
	}
};

/**
 * 项目偶日志
 */
var proLog = {
	currentPage: 1,
	setTitle:{
		Contract:function(){
			return '合同日志';
		},
		PaymentPlan:function(){
			return '还款计划日志';
		},
		Clause:function(){
			return '条款日志';
		},
		Node:function(){
			return '节点日志';
		},
		NodeReport:function(){
			return '汇报日志';
		},
		Debtor:function(){
			return '借款公司日志';
		},
		Lender:function(){
			return '贷款人日志';
		},
		Guarantee:function(){
			return '担保日志';
		}
	},
	getList: function(obj){
		var _this = obj?obj:this;
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		var currPage_val = this.currentPage;
		$.ajax({
			type:"post",
			url:url+'/loanOperationLog/list',
			data:{
				pageNum:_this.currentPage,
				relatedCategory:_this.relatedCategory
			},
			success: function(callback){
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('proLogTemp', data);
					if(_this.currentPage == 1){
						$('.log-list').html(html);
					}else{
						$('.log-list').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.log-list'
						});
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
					$('.log-pro-detail>div').each(function() {
						var height = $(this).height();
						var pHeight = $(this).parent('.log-pro-detail').height();
						if(height>pHeight){
							$(this).addClass('box');
							$(this).parent().children('.more').removeClass('none');
						}
					});
					_this.currentPage++;
				}else{
					$.tips({
					    content:callback.msg,
					    stayTime:3000
					});
					if(callback.code == 999001){
						setTimeout(function(){
							window.location.href='login.html'
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	getMore:function(){
		$(document).on('click','.log-pro-detail .more',function(){
			var html = $(this).parents('.log-pro-detail ').children('.log_more_content').html();
		    $('.pro_log_dialog .ui-dialog-bd').html(html);
		    var dia2=$(".ui-dialog").dialog("show");
		});
	},
	init: function(){
		this.relatedCategory = getUrlParam({name:'relatedCategory'});
		document.title = this.setTitle[this.relatedCategory]();
		this.getList(this);
		this.getMore();
		this.callback = this.getList;
		scrollFunc(this);
	}
};