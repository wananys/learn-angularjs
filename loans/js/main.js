/**
 * 登录页
 */
var login = {
	'mobile': $('input[name=mobile]'),
	'password': $('input[name=password]'),
	'code':$('input[name=code]'),
	getCodeImg: function(){
		$.ajax({
			type:"post",
			url:url+"/user/captcha",
			dataType:'json',
			success: function(callback){
				if(callback.code == 0){
					var img = "data:image/jpeg;base64," + callback.dataSource.captcha;
					$('.login-codeimg').attr('src',img);
				}
			},
			error: function(){
				$.tips({
			        content:message.serverErr,
			        stayTime:3000
			   });
			}
		});
		
	},
	changeCodeImg:function(){
		var _this = this;
		$('.login-codeimg').on('click',function(){
			_this.getCodeImg();
		});
	},
	clearMobile: function(){
		var _this = this;
		$('.login-close').on('click',function(){
			_this.mobile.val('');
		});
	},
	showPwd:function(){
		var _this = this;
		$('.login-hide').on('click',function(){
			var _type = _this.password.attr('type');
			if(_type === 'text'){
				_this.password.attr('type','password');
			}else if(_type === 'password'){
				_this.password.attr('type','text');
			}
			
		})
	},
	forgetPassword:function(){
		$('.login-fpwd').on('click',function(){
			$('.self-model').show();
		});
	},
	closeModel:function(){
		$('.self-model').on('click',function(){
			$(this).hide();
		});
	},
	loginFnc:function(){
		var _this = this;
		$('.login-btn').on('click',function(){
			var postData = {
				account: _this.mobile.val(),
				password:_this.password.val(),
				captcha:_this.code.val()
			}
			if(''===postData.account){
				$.tips({
			        content:'请输入账号',
			        stayTime:3000
			   	});
			   	_this.mobile.focus();
			   	return false;
			}
			if(''===postData.password){
				$.tips({
			        content:'请输入密码',
			        stayTime:3000
			   	});
			   	_this.password.focus();
			   	return false;
			}
			if(postData.password.length>12 || postData.password.length < 6){
				$.tips({
			        content:'密码长度为6-12位',
			        stayTime:3000
			   	});
			   	_this.password.focus();
			   	return false;
			}
			$.ajax({
				type:"post",
				url:url+'/user/login',
				data:postData,
				success:function(callback){
					if(callback.code == 0){
						window.location.href = 'index.html';
					}else{
						$.tips({
					        content:callback.msg,
					        stayTime:3000
					   	});
					   	if(callback.code == 100002){
					   		$('.login-code-row').show();
					   		$('input[name=code]').focus();
					   		_this.getCodeImg();
					   	}else if(callback.code == 100004){
					   		
					   		$('.login-code-row').show();
					   		_this.getCodeImg();
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
		});
	},
	init: function(){
		this.getCodeImg();
		this.clearMobile();
		this.showPwd();
		this.forgetPassword();
		this.closeModel();
		this.loginFnc();
		this.changeCodeImg();
	}
};

/*
 * 账户管理
 * getInfo:获取用户信息
 * exitFunc：退出登录
 */
var mine = {
	getInfo: function(){
		$.ajax({
			type:"post",
			url:url + "/user/detail",
			success:function(data){
				if(data.code == 0){
					var html = template('mineTemp', data.dataSource);
					$('.mine-box').html(html);
				}else{
					$.tips({
					    content:data.msg,
					    stayTime:3000
					});
					if(data.code == 999001){
						setTimeout(function(){
							window.location.href='login.html';
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:1000
				});
			}
		});
	},
	exitFunc:function(){
		$('.mine-exit').on('click',function(){
			$.ajax({
				type:"post",
				url:url+"/user/logout",
				success:function(callback){
					if(callback.code == 0){
						window.location.href = "login.html";
					}
				},
				error:function(){
					$.tips({
				        content:message.serverErr,
				        stayTime:1000
				   	});
				}
			});
		});
	},
	init:function(){
		this.getInfo();
		this.exitFunc();
	}
};

/**
 * 首页
 * getInfo:获取首页信息
 */
var index = {
	getInfo: function(){
		$.ajax({
			type:"post",
			url:url + "/loanHomePage/home",
			success:function(data){
				if(data.code == 0){
					var html = template('indexTemp', data.dataSource.homePageInfo);
					$('.index-boxes').html(html);
				}else{
					$.tips({
					    content:data.msg,
					    stayTime:3000
					});
					if(data.code == 999001){
						setTimeout(function(){
							window.location.href='login.html';
						},1000);
					}
				}
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:1000
				});
			}
		});
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 本月预还/本月实还/下月预还
 * getList:获取信息列表
 * showDailyDetails：点击展开收起
 */
var loanExpenditure = {
	getList: function(){
		var moduleType=getUrlParam({name:'moduleType'});
		
		$.ajax({
			type:"post",
			url:url + "/loanExpenditure/listByModule",
			data:{moduleType:moduleType},
			success:function(data){
				if(data.code == 0){
					data.dataSource.moduleType = moduleType;
					var html = template('loanExpenditureTemp', data.dataSource);
					$('.loan-list').html(html);
					if(data.dataSource.records.length != 0){
						$('.ui-loading-wrap').html(message.success);
					}
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
	showDailyDetails:function(){
		$(document).on('click','.more-bottom',function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).parent().children('.loan-more-list').addClass('none');
			}else{
				$(this).addClass('active');
				$(this).parent().children('.loan-more-list').removeClass('none');
			}
			
		});
	},
	titleName:{
		currentMonthPrepare: '本月预还',
		nextMonthPrepare: '下月预还',
		currentMonthActual: '本月实还'
	},
	init:function(){
		var moduleType=getUrlParam({name:'moduleType'});
		document.title = this.titleName[moduleType];
		this.getList();
		this.showDailyDetails();
	}
}

/**
 * 支出列表
 * getList:获取信息列表
 * showDailyDetails：点击展开收起
 */
var loanExpenditureChange = {
	getList: function(obj){
		var _this = obj?obj:this;
		var param = {
			year:_this.year
		}
		$.ajax({
			type:"post",
			url:url + "/loanExpenditure/changed",
			data:param,
			success:function(data){
				if(data.code == 0){
					var htmlHead = template('loanExpenditureChangeTempHead',data.dataSource);
					$('.loanExpenditureChangeHeadList').html(htmlHead);
					var html = template('loanExpenditureChangeTemp', data.dataSource);
					$('.loanExpenditureChangeHead').html(html);
					if(data.dataSource.records && data.dataSource.records.length != 0){
						$('.ui-loading-wrap').html(message.success);
					}
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
	showDailyDetails:function(){
		$(document).on('click','.more-bottom',function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).parent().children('.loan-more-list').addClass('none');
			}else{
				$(this).addClass('active');
				$(this).parent().children('.loan-more-list').removeClass('none');
			}
			
		});
	},
	changeYear:function(){
		//从2010年起,当前年+20
		var _this = this;
		var yearsArr=[],dateList=[];
		$('.loan-list-datetime').html(_this.year);
		yearsArr=[];
		for (var beganYear=2010;beganYear<=(_this.year+20);beganYear++) {
			dateList.push(beganYear);
		}
		$('.loan-list-datetime').attr('data-date',_this.year);
		var pickerDate = new WheelPicker({
		    data: [dateList],
		    value:[_this.year],
		    onSelect: function(selected){
		    	_this.keyWord = '';
		    	_this.year = selected[0].value;
		        _this.getList(_this);
		        $('.loan-list-datetime').html(selected[0].value);
		        $('.loan-list-datetime').attr('data-date',selected[0].value);
		        
		    }
		});
		$(document).on('click','.loan-selected-year',function(){
			pickerDate.show();
    		return false;
		});
	},
	init:function(){
		var today = new Date();
		var year = today.getFullYear();
		this.year = year;
		this.getList();
		this.changeYear();
		
		this.showDailyDetails();
	}
}

/**
 * 更多列表（本月预还/下月预还/本月实还/支出变更）
 */
var loanMoreList = {
	currentPage:1,
	getChangedMore:function(obj){
		var _this = obj?obj:this;
		$.ajax({
			type:"post",
			url:url + _this.url,
			data:_this.param,
			success:function(data){
				if(data.code == 0){
					var data = data.dataSource;
					if(_this.from == 'loan_expenditure'){//本月预还/下月预还/本月实还
						var html = template('getMoreListTemp', data);
					}else if(_this.from == 'loan_expenditure_change'){  //支出变更
						var html = template('getMoreChangeListTemp', data);
					}
					if(_this.currentPage== 1){
						$('.loan-getmore-list').html(html);
					}else{
						$('.loan-getmore-list').append(html);
					}
					if(data.totalPage==0){
						tips({
							classname:'tips-no-message',
							content:message.noMssege
						});
						$('.ui-loading-wrap').remove();
					}else if(data.totalPage <= _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
					}
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
	init: function(){
		this.from = getUrlParam({name:'from'});
		if(this.from == 'loan_expenditure'){//本月预还/下月预还/本月实还
			this.url = '/loanExpenditure/listByModuleMore';
			this.param = {
				moduleType:getUrlParam({name:'moduleType'}),
				pageNum:this.currentPage,
				day:getUrlParam({name:'day'})
			};
		}else if(this.from == 'loan_expenditure_change'){  //支出变更
			this.url = '/loanExpenditure/changedMore';
			this.param = {
				month:getUrlParam({name:'month'}),
				pageNum:this.currentPage
			};
		}
		this.callback = this.getChangedMore;
		this.getChangedMore(this);
		scrollFunc(this);
	}
}

/**
 * 搜索页面
 * pageInit：页面默认搜索提示语
 * getList:获取搜索结果列表
 */
var search_page ={
	keyWord:$('input[name=search]').val(),
	pageInit: function(){
		if(this.keyWord){
			this.getList(this);
		}else{
			tips({
				classname:'tips-search',
				content:message.searchMsg
			});
			$('.search-list').addClass('none');
			$('.ui-loading-wrap').addClass('none');
		}
		
	},
	getList: function(obj){
		this.type = 'search';
		$('.self-tips').remove();
		$('.search-list').addClass('none');
		var _this = (obj&&obj._this)?obj._this:this;
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		$.ajax({
			type:"post",
			url:url+"/search/list",
			data:{
				keyWord:_this.keyWord
			},
			success: function(callback){
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('searchTemp', data);
					$('.search-list').removeClass('none').html(html);
					if(data.records.length === 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							divBox:'.search-list',
							classname:'tips-change-word',
							content:message.changeWord
						});
					}else{
						$('.ui-loading-wrap').html(message.loadend);
					}
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
	setUrl:function(){
		var _this = this;
		template.helper('setUrl',function(module,id){
			var list_url = {
				Contract: 'loan.html?',
				RepayPayable: 'payments.html?repayCategory=Payable&',
				Node: 'loan_node.html?',
				Guarantee: 'surety.html?category=guaranteeInfo&',
				GuaranteeThing: 'surety.html?category=loanThings&',
				Debtor:'loan_debtor.html?',
				Project: 'pro_info.html?',
				ProjectPlan: 'pro_play.html?',
				PlanReport: 'pro_plan.html?',
				Attachment: 'accessory.html?',
				Lender: 'loan_lender.html?',
				LenderAccount: 'account.html?from=home&',
				ProjectReport: 'pro_report.html?'
			};
			var detail_url = {
				Contract: 'loan_list.html?contractId=',
				RepayPayable: 'payments_list.html?from=Payable&repayId=',
				Node: 'loan_node_list.html?nodeId=',
				Guarantee: 'surety_guaranteeInfo_list.html?guaranteeId=',
				GuaranteeThing: 'surety_loanThings_list.html?thingId=',
				Debtor:'loan_debtor_detail.html?debtorId=',
				Project: 'pro_info_detail.html?projectNo=',
				ProjectPlan: 'pro_play_detail.html?planNo=',
				PlanReport: 'pro_plan_detail.html?scheduleNo=',
				Attachment: 'accessoy_detail.html?attachmentId=',
				Lender: 'loan_lender_detail.html?lenderId=',
				LenderAccount: 'account_detail.html?accountId=',
				ProjectReport: 'pro_report_detail.html?projectNo='
			};
			if(id){
				return detail_url[module]+id;
			}else{
				return list_url[module]+'keyWord='+encodeURI(_this.keyWord);
			}
		});
	},
	init: function(){
		this.setUrl();
		this.callback = this.getList;
		this.callFun = this.pageInit;
		this.type = 'search';
		search.init(this);
		this.pageInit();
	}
}

/**
 * 附件
 * getList:获取附件列表
 * goDetail:跳转附件详情页
 */
var accessory = {
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var _this = obj?obj:this;
		if(_this.type == 's'){
			_this.currentPage = 1;
		}
		$('#accessory-result').removeClass('none');
		$('.accessory').addClass('none');
		$('.self-tips').remove();
		
		
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		$.ajax({
			type:"post",
			url:url+"/loanAttachment/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord
			},
			success: function(callback){
				_this.type = '';
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('accessoryTemp', data);
					if(_this.currentPage == 1){
						$('.accessory-list').html(html);
					}else{
						$('.accessory-list').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege
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
		this.type = 'fileSearch';
		this.callback = this.getList;
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
			this.getList(this);
		}
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 附件列表
 * getInfo:获取附件列表
 */
var loanAttachment = {
	getInfo: function(){
		var param = {
			relatedKey : getUrlParam({name:'relatedKey'}),
			relatedCategory : getUrlParam({name:'relatedCategory'})
		} 
		$.ajax({
			type:"post",
			url:url + "/loanAttachmentRel/list",
			data:param,
			success:function(data){
				if(data.code == 0){
					if(data.dataSource.attachmentList.length>0){
						var html = template('loanAttachmentTemp', data.dataSource);
						$('.repay-detail').html(html);
					}else{
						tips({
							classname:'tips-no-message',
							content:message.noMssege
						});
					}
					
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
 * 附件管理
 * getList：获取详情信息
 */
var accessory_detail = {
	currentPage: 1,
	getList: function(obj){
		var _this = obj?obj:this;
		var attachmentId = getUrlParam({name:'attachmentId'});
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		$.ajax({
			type:"post",
			url:url+"/loanAttachmentRel/relatedModules",
			data:{
				pageNum:_this.currentPage,
				attachmentId:attachmentId
			},
			success: function(callback){
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('accessoryDetailTemp', data);
					if(_this.currentPage == 1){
						$('.accessoryDetail').html(html);
					}else{
						$('.accessoryDetail').append(html);
					}
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
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
 * 网银看板
 * getInfo:获取列表
 */
var boardList = {
	getInfo: function(){
		var _this = this;
		$.ajax({
			type:"post",
			url:url + "/ebank/bankCards",
			success:function(data){
				if(data.code == 0){
					var html = template('boardListTemp', data.dataSource);
					$('#board-list').html(html);
					_this.setNums('all');
					document.title = $('input[name=companyName]').val();
					$('.ui-loading-wrap').remove();
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
	showSubsidiary:function(){
		$(document).on('click','.board-head-select',function(){
			var obj = $('.board-select-list');
			if(obj.hasClass('none')){
				obj.removeClass('none');
			}else{
				obj.addClass('none');
			}
		});
	},
	selectedSubsidiary:function(){
		var _this = this;
		$(document).on('click','.board-select-list li',function(){
			var id = $(this).data('id');
			$('.board-list li').attr('data-flag',0);
			if(id == "all"){
				$('.board-list li').removeClass('none');
				$('.board-head-company').removeClass('none');
				var count = $('.board-head-card').data('count');
				$('.board-head-card').html(count);
				$('#companyBalance').html($('#companyBalance').data('money'));
				$('#inflowamt').html($('#inflowamt').data('inflowamt'));
				$('#outflowamt').html($('#outflowamt').data('outflowamt'));
			}else{
				$('.board-list li').addClass('none');
				var obj = $('.board-list li.board-list-'+id);
				var money = obj.data('money')?obj.data('money'):0;
				var inflowamt = obj.data('inflowamt')?obj.data('inflowamt'):0;
				var outflowamt = obj.data('outflowamt')?obj.data('outflowamt'):0;
				$('.board-head-company').addClass('none');
				$('.board-head-card').html(obj.length?obj.length:0);
				$('#companyBalance').html(money);
				$('#inflowamt').html(inflowamt);
				$('#outflowamt').html(outflowamt);
				obj.attr('data-flag',1);
				obj.removeClass('none');
			}
			
			_this.setNums(id);	
			$('.board-select-list').addClass('none');
			return false;
		});
	},
	setNums:function(id){
		var obj = document.getElementById('board-list-a').getElementsByTagName('li');
		var status = 1;
		for (var i =0;i<obj.length;i++) {
			var flag = obj[i].getAttribute('data-flag');
			if(flag == 1 || id == "all"){
				obj[i].getElementsByClassName('board-list-num')[0].innerHTML=status;
				status++;
			}
		}
	},
	init:function(){
		this.getInfo();
		this.selectedSubsidiary();
		this.showSubsidiary();
	}
};

/**
 * 网银看板资金流水
 * getInfo:获取资金流水信息列表
 */
var boardDetail={
	getInfo: function(){
		var bankCardId = getUrlParam({name:'bankCardId'});
		$.ajax({
			type:"post",
			url:url + "/ebank/transactionRecords",
			data:{bankCardId:bankCardId},
			success:function(data){
				if(data.code == 0){
					var html = template('boardDetailTemp', data.dataSource);
					$('#boardDetail').html(html);
					$('.ui-loading-wrap').remove();
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
	getMore:function(){
		$(document).on('click','.board-detail-more',function(){
			var obj = $(this).parents('li').children('.board-detail-hidden');
			if($(this).hasClass('hidden')){
				return false;
			}else if($(this).hasClass('active')){
				obj.addClass('none');
				$(this).removeClass('active');
				$(this).removeClass('hidden');
			}else{
				if(obj.data('length') == 0){
					$(this).addClass('hidden');
				}else{
					obj.removeClass('none');
					$(this).addClass('active');
				}
			}
			return false;
		});
	},
	getTags:function(){
		$(document).on('click','.board-head-info',function(){
			$('#model-tags').show();
		});
	},
	closeTags:function(){
		$(document).on('click','.rm-dialog-close',function(){
			$(".ui-dialog").hide();
			return false;
		});
	},
	init:function(){
		this.getInfo();
		this.getMore();
		this.getTags();
		this.closeTags();
	}
};