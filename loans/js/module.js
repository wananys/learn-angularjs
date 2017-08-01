/**
 * 贷款合同
 * getlist:获取列表(需要分页)
 */
var loan = {
	currentPage: 1,   //当前页
	keyWord:$('input[name=search]').val(),       //搜索关键词
	loading:false,    //是否请求中
	getList: function(obj){
		var param = {
			from: getUrlParam({name:'from'}),
			debtorId: getUrlParam({name:'debtorId'}),
			projectNo: getUrlParam({name:'projectNo'}),
			contractType: getUrlParam({name: 'contractType'}),
		}
		var _this = obj?obj:this;
		if(param.from === 'nosearch'){ //是否显示顶部搜索
			$('.loan-search').remove();
			menus();
		}else{
			menus('top');
		}
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type === 's'){ //点击搜索按钮
			_this.currentPage = 1;
			$('.loan-list').addClass('none');
		}
		_this.loading = true;
		if(!_this.loading)return false;
		$.ajax({
			type:"post",
			url:url+"/loanContract/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord,
				debtorId:param.debtorId,
				projectNo:param.projectNo,
				contractType: param.contractType
			},
			success: function(callback){
				_this.loading = false;
				_this.type ='';
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('loanList', data);
					if(_this.currentPage == 1){
						$('.loan-list').removeClass('none').html(html);
					}else{
						$('.loan-list').removeClass('none').append(html);
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
		this.getList();
		this.callback = this.getList;
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 贷款合同详情页
 * getInfo:获取详情页信息
 */
var loanList = {
	getInfo: function(){
		var param ={
			contractId: getUrlParam({name:'contractId'})
		};
		$.ajax({
			type:"post",
			url:url + "/loanContract/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('loan-detail-list', data.dataSource);
					$('#loanInfo').html(html);
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
		templateFun.dueDatesFun();
		menus('home');
		this.getInfo();
	}
};

/**
 * 合同/节点管理
 * getLoanClause:获取合同条款信息
 * getNodeList:获取节点信息（销售、工程、其他）
 * tabList:切换页面
 * getInfo:判断调用哪个列表
 */
var loanNode = {
	category: 'LoanClause', //记录当前切换面板(LoanClause:条款,SaleNode:销售节点,ProjectNode:工程节点,OtherNode:其他节点)
	currentPage:{
		pageLoanClause:1,  //条款节点当前页
		pageSaleNode:1,    //销售节点当前页
		pageProjectNode:1, //工程节点当前页
		pageOtherNode:1    //其他节点当前页
	},
	tabStatus:{   //记录各个tab下的点击情况
		tabLoanClause:false,  
		tabSaleNode:false,   
		tabProjectNode:false, 
		tabOtherNode:false
	},
	loading:false,
	keyWord:$('input[name=search]').val(),
	tabList: function(){
		var _this = this;
		$(document).on('click','#repay-detail>ul li',function(){
			var curType = $(this).data('type');
			$(this).addClass('current').siblings().removeClass('current');
			$('.temp'+curType).removeClass('none').siblings().addClass('none');
			_this.category = curType;
			
			var currentKeyWord = $('input[name=search]').val();
			if(_this.keyWord == currentKeyWord){
				if(_this.tabStatus['tab'+_this.category]){
					return false;
				}
			}else{
				for (var i in _this.tabStatus) {
					_this.tabStatus[i] = false;
				}
			}
			_this.keyWord = currentKeyWord;
			_this.currentPage['page'+_this.category] = 1;
			_this.getInfo(_this);
			
		});
		
	},
	getInfo: function(obj){
		var _this = obj?obj:this;
		_this.tabStatus['tab'+_this.category] = true;
		_this.contractId = getUrlParam({name:'contractId'});
//		$('.self-tips').remove();
		$('.temp'+_this.category).children('.ui-loading-wrap').removeClass('none').html(message.loading);
		_this.loading = true;
		if(!_this.loading) return false;
		if(_this.category === 'LoanClause'){
			_this.getLoanClause(_this);
			return false;
		}else{
			if(_this.type == 's'){
				_this.currentPage['page'+_this.category] = 1;
			}
			_this.getNodeList(_this);
			return false;
		}
	},
	getLoanClause:function(obj){
		$.ajax({
			type:"post",
			url:url+"/loanClause/list",
			data:{
				contractId:obj.contractId,
				pageNum:obj.currentPage.pageLoanClause
			},
			success: function(callback){
				obj.loading = false;
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('repayTempLoanClause', data);
					obj.currentPage.pageLoanClause++;
					if(obj.currentPage.pageLoanClause == 1){
						$('#repayTabLoanClause').html(html);
					}else{
						$('#repayTabLoanClause').append(html);
					}
					if(data.totalPage == 0){
						$('.temp'+obj.category).children('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'#repayTabLoanClause'
						});
					}else if(data.totalPage <= obj.currentPage.pageLoanClause){
						$('.temp'+obj.category).children('.ui-loading-wrap').html(message.success);
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
	getNodeList:function(obj){
		$.ajax({
			type:"post",
			url:url+"/loanNode/list",
			data:{
				contractId:obj.contractId,
				nodeCategory:obj.category,
				pageNum:obj.currentPage['page'+obj.category],
				keyWord:obj.keyWord
			},
			success: function(callback){
				obj.loading = false;
				if(callback.code == 0){
					var data = callback.dataSource;
					var html = template('repayTemp' + obj.category, data);
					obj.currentPage['page'+obj.category]++;
					if(obj.currentPage['page'+obj.category] == 1){
						$('#repayTab' + obj.category).html(html);
					}else{
						$('#repayTab' + obj.category).append(html);
					}
					if(data.totalPage == 0){
						$('.temp'+obj.category).children('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'#repayTab'+ obj.category
						});
					}else if(data.totalPage < obj.currentPage['page'+obj.category]){
						$('.temp'+obj.category).children('.ui-loading-wrap').html(message.success);
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
	init: function(){
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		var from = getUrlParam({name:'from'});
		if(from === 'loan_list'){
			$('.loan-search').remove();
			document.title = '合同管理';
		}else{
			$('.loan-search').removeClass('none');
			$('.loanClauseTab').remove();
			$('.tempLoanClause').remove();
			this.category = 'SaleNode';
			$('.tempSaleNode').removeClass('none');
			$('.saleNodeTab').addClass('current');
		}
		
		this.callback = this.getInfo;
		this.getInfo(this);
		this.tabList();
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 条款详情
 * getInfo:获取详情信息
 */
var LoanClauseList = {
	getInfo: function(){
		var clauseId = getUrlParam({name:'clauseId'});
		$.ajax({
			type:"post",
			url:url + "/loanClause/details",
			data:{clauseId:clauseId},
			success:function(data){
				if(data.code == 0){
					var html = template('clauseListTemp', data.dataSource);
					$('#clauseList').html(html);
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
 * 节点详情
 * getInfo:获取详情信息
 */
var loanNodeList = {
	getInfo: function(param){
		$.ajax({
			type:"post",
			url:url + "/loanNode/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					template.config("escape", false);
					var html = template('nodeListTemp', data);
					$('#nodeList').html(html);
					
					/************************处理节点汇报页面start*************************/
					if(data.dataSource.nodeReportList.length == 0&&param.from == 'loanNodeReport'){  
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.loan-list'
						});
						$('.loan-list').remove();
					}
					/*************************处理节点汇报页面end***********************/
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
		var param = {
			nodeId:getUrlParam({name:'nodeId'}),
			status:getUrlParam({name:'status'})
		};
		if(param.status == 'SaleNode'){
			document.title = '销售节点';
		}else if(status == 'ProjectNode'){
			document.title = '工程节点';
		}else if(status == 'OtherNode'){
			document.title = '其他节点';
		}
		this.getInfo(param);
	}
};

/**
 * 节点汇报
 * getInfo:获取节点汇报内容，直接调用函数节点详情loanNodeList.getInfo
 */
var loanNodeReport={
	getInfo: function(){
		var param = {
			nodeId: getUrlParam({name:'nodeId'}),
			from: 'loanNodeReport'
		}
		loanNodeList.getInfo(param);
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 担保信息（担保合同、担保物）
 * getGuaranteeInfo:获取担保合同列表
 * getLoanThings:获取担保物
 * tabList:头部切换按钮点击事件
 * getInfo:不同tab加载事件处理
 * fixTemplate:渲染模板事件处理
 */
var surety = {
	category: 'guaranteeInfo', //记录当前切换面板(guaranteeInfo:担保合同,loanThings:担保物,singleLoanThings:单个担保物)
	currentPage:{
		guaranteeInfoPage:1, //担保合同当前页
		loanThingsPage:1,    //担保物当前页
		singleLoanThingsPage:1    //担保物当前页
	},
	tabStatus:{   //记录各个tab下的点击情况
		guaranteeInfoTab:false,  
		loanThingsTab:false
	},
	keyWord:$('input[name=search]').val(),  //搜索关键词
	loading:false,   
	tabList: function(){
		var _this = this;
		$(document).on('click','.loan-detail-title>li',function(){
			var curType = $(this).data('type');
			$(this).addClass('current').siblings().removeClass('current');
			$('.'+curType+'List').removeClass('none').siblings().addClass('none');
			_this.category = curType;
			var currentKeyWord = $('input[name=search]').val();
			if(_this.keyWord == currentKeyWord){
				if(_this.tabStatus[_this.category+'Tab']){
					return false;
				}
			}else{
				for (var i in _this.tabStatus) {
					_this.tabStatus[i] = false;
				}
			}
			_this.keyWord = currentKeyWord;
			_this.currentPage[_this.category+'Page'] = 1;
			_this.getInfo(_this);
			
		});
		
	},
	getInfo: function(obj){
		var _this = obj?obj:this;
		_this.tabStatus[_this.category+'Tab'] = true;
		_this.contractId = getUrlParam({name:'contractId'});
		_this.guaranteeId = getUrlParam({name:'guaranteeId'});
		$('.'+_this.category+'List').parent().children('.self-tips').remove();
		$('.'+_this.category+'List').children('.ui-loading-wrap').removeClass('none').html(message.loading);
		_this.loading = true;
		if(!_this.loading) return false;
		if(_this.type == 's'){
			_this.currentPage[_this.category+'Page'] = 1;
		}
		if(_this.category === 'guaranteeInfo'){
			_this.getGuaranteeInfo(_this);
			return false;
		}else{
			_this.getLoanThings(_this);
			return false;
		}
	},
	getGuaranteeInfo: function(obj){
		$.ajax({
			type:"post",
			url:url+'/guaranteeInfo/list',
			data:{
				pageNum:obj.currentPage[obj.category+'Page'],
				keyWord:obj.keyWord,
				contractId:obj.contractId
			},
			success: function(callback){
				obj.fixTemplate(callback,obj);
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	getLoanThings:function(obj){
		$.ajax({
			type:"post",
			url:url+'/loanThings/list',
			data:{
				pageNum:obj.currentPage[obj.category+'Page'],
				keyWord:obj.keyWord,
				guaranteeId:obj.guaranteeId
			},
			success: function(callback){
				obj.fixTemplate(callback,obj);
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
	},
	fixTemplate:function(callback,obj){
		obj.type = '';
		if(callback.code == 0){
			var data = callback.dataSource;
			var html = template(obj.category+'Temp', data);
			if(obj.currentPage[obj.category+'Page'] == 1){
				$('.'+obj.category+'List').children('.loan-list').html(html);
			}else{
				$('.'+obj.category+'List').children('.loan-list').append(html);
			}
			obj.currentPage[obj.category+'Page']++;
			if(data.totalPage == 0){
				$('.'+obj.category+'List').children('.ui-loading-wrap').addClass('none');
				tips({
					classname:'tips-no-message',
					content:message.noMssege,
					divBox:'.'+obj.category+'List'
				});
			}else if(data.totalPage < obj.currentPage[obj.category+'Page']){
				$('.'+obj.category+'List').children('.ui-loading-wrap').html(message.success);
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
	init: function(){
		var nosearch = getUrlParam({name:'nosearch'});    //是否显示搜索栏
		var nohead = getUrlParam({name:'nohead'});       //是否显示头部
		var category = getUrlParam({name:'category'});    //类别
		this.category = category?category:this.category;
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		$('.'+this.category+'List').removeClass('none');
		$('.'+this.category+'Tab').addClass('current');
		if(nosearch){
			$('.loan-search').remove();
		}
		if(nohead){
			$('#repay-detail .loan-detail-title').remove();
		}
		this.callback = this.getInfo;
		this.getInfo(this);
		this.tabList();
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 担保合同详情
 * getInfo:获取担保合同详情
 */
var suretyGuaranteeInfo ={
	getInfo: function(){
		var param = {guaranteeId: getUrlParam({name:'guaranteeId'})};
		$.ajax({
			type:"post",
			url:url + "/guaranteeInfo/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('suretyGuaranteeInfoTemp', data.dataSource);
					$('#suretyGuaranteeInfoDetail').html(html);
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
 * 担保物详情
 * getDetails:获取担保物详情
 * getSchedule:获取担保物排期
 */
var suretyGuarantyList = {
	getDetails: function(){
		var thingId = getUrlParam({name:'thingId'});
		$.ajax({
			type:"post",
			url:url + "/loanThings/details",
			data:{thingId:thingId},
			success:function(data){
				if(data.code == 0){
					var html = template('suretyGuarantyTemp', data.dataSource);
					$('#suretyGuarantyDetail').html(html);
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
				
			}
		});
	},
	getSchedule:function(){
		var thingId = getUrlParam({name:'thingId'});
		$.ajax({
			type:"post",
			url:url + "/loanThings/schedule",
			data:{
				thingId:thingId,
				pageNum:1
			},
			success:function(data){
				if(data.code == 0){
					var html = template('suretyScheduleTemp', data.dataSource);
					$('#suretyScheduleList').append(html);
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
				
			}
		});
	},
	init:function(){
		this.getSchedule();
		this.getDetails();
	}
};


/**
 * 支出计划
 * tabList:头部tab点击事件
 * getInfo: 获取列表信息
 * fixTemplate: 渲染模板
 */
var payments = {
	category: 'Payable', //记录当前切换面板(Payable:计划还款,Actual:实际支出)
	currentPage:{    //记录当前页
		pagePayable:1,
		pageActual:1
	},
	tabStatus:{   //记录各个tab下的点击情况
		tabPayable:false,  
		tabActual:false
	},
	keyWord:$('input[name=search]').val(),  //搜索关键词
	loading:false,   
	tabList: function(){
		var _this = this;
		$(document).on('click','#payments-menu li',function(){
			var curType = $(this).data('type');
			$(this).addClass('current').siblings().removeClass('current');
			$('.list'+curType).removeClass('none').siblings().addClass('none');
			_this.category = curType;
			var currentKeyWord = $('input[name=search]').val();
			if(_this.keyWord == currentKeyWord){
				if(_this.tabStatus['tab'+_this.category]){
					return false;
				}
			}else{
				for (var i in _this.tabStatus) {
					_this.tabStatus[i] = false;
				}
			}
			_this.keyWord = currentKeyWord;
			_this.currentPage['page'+_this.category] = 1;
			_this.getInfo(_this);
		});
		
	},
	getInfo: function(obj){
		var _this = obj?obj:this;
		_this.tabStatus['tab'+_this.category] = true;
		if(_this.type == 's'){
			_this.currentPage['page'+_this.category] = 1;
		}
		var param = {
			debtorId: getUrlParam({name:'debtorId'}),
			repayDateFrom: getUrlParam({name:'repayDateFrom'}),
			repayDateTo: getUrlParam({name:'repayDateTo'}),
			pageNum: _this.currentPage['page'+_this.category],
			keyWord: _this.keyWord,
			repayCategory: _this.category
		}
		$('.list'+_this.category).parent().children('.self-tips').remove();
		$('.list'+_this.category).children('.ui-loading-wrap').removeClass('none').html(message.loading);
		_this.loading = true;
		if(!_this.loading) return false;
		$.ajax({
			type:"post",
			url:url+"/loanExpenditure/repayPlans",
			data:param,
			success: function(callback){
				_this.fixTemplate(callback,_this);
			},
			error:function(){
				$.tips({
				    content:message.serverErr,
				    stayTime:3000
				});
			}
		});
			
	},
	fixTemplate:function(callback,obj){
		obj.type = '';
		if(callback.code == 0){
			var data = callback.dataSource;
			var html = template('temp' + obj.category, data);
			if(obj.currentPage['page'+obj.category] == 1){
				$('.list'+obj.category).children('.loan-list').html(html);
			}else{
				$('.list'+obj.category).children('.loan-list').append(html);
			}
			obj.currentPage['page'+obj.category]++;
			if(data.totalPage == 0){
				$('.list'+obj.category).children('.ui-loading-wrap').addClass('none');
				tips({
					classname:'tips-no-message',
					content:message.noMssege,
					divBox:'.list'+obj.category
				});
			}else if(data.totalPage < obj.currentPage['page'+obj.category]){
				$('.list'+obj.category).children('.ui-loading-wrap').html(message.success);
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
	init: function(){
		var from = getUrlParam({name:'from'});
		var category = getUrlParam({name:'category'});
		if(from == 'period'){  //从周期表跳转
			$('.loan-search').remove();
			$('.loan-detail-title').remove();
			this.category = category;
			$('.list'+category).removeClass('none').siblings().remove();
			
		}
		var keyWord = getUrlParam({name:'keyWord',type:'decode'});
		if(keyWord != ''){
			$('input[name=search]').val(keyWord);
			this.keyWord = keyWord;
		}
		this.callback = this.getInfo;
		this.getInfo();
		this.tabList();
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 还款/支出详情
 * getInfo：获取详情信息
 */
var paymentsList = {
	getInfo: function(){
		var repayId = getUrlParam({name:'repayId'});
		var from = getUrlParam({name:'from'});
		if(from == 'Actual'){
			document.title = "支出详情";
		}
		$.ajax({
			type:"post",
			url:url + "/loanExpenditure/repayPlanDetail",
			data:{repayId:repayId},
			success:function(data){
				if(data.code == 0){
					var html = template('paymentsListTemp', data);
					$('#paymentsListDetail').html(html);
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
 * 更多还款明细列表（计划还款/实际支出）
 * 该方法待重构...
 */
var paymentsDetail = {
	getList: function(){
		var repayCategory_val = $('#repayCategoryId').val();
		var repayCategory = '';
		var contractId = getUrlParam({name:'contractId'});
		if(repayCategory_val!=''){
			repayCategory = repayCategory_val;
		}else{
			repayCategory = getUrlParam({name:'repayCategory'});
		}
		$('.tab-'+repayCategory).addClass('current').siblings().removeClass('current');
		$.ajax({
			type:"post",
			url:url+"/loanContract/repayPlans",
			data:{
				contractId:contractId,
				repayCategory:repayCategory
			},
			success: function(callback){
				if(callback.code == 0){
					$('.ui-loading-wrap').remove();
					var data = callback.dataSource;
					var html = template('repayment_detail', callback);
					$('#repaymentBox').html(html);
					$('.temp'+repayCategory).removeClass('none').siblings().addClass('none');
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
	getExplain:function(){
		$(document).on('click','#rm-explain-model',function(){
			var tab = $(this).data('tab');
			if(tab == 0){
				$('.rm-status').removeClass('none');
			}else{
				$('.rm-status').addClass('none');
			}
			$("#model-explain").show();
		});
	},
	changeList:function(){
		$(document).on('click','.repay-change',function(){
			var type= $(this).data('type');
			if(type === 1){
				$(this).html('本金余额');
				$('.loanBalance').removeClass('none');
				$('.surplusAmount').addClass('none');
				$(this).attr('data-type',0);
			}else{
				$(this).html('剩余金额');
				$('.loanBalance').addClass('none');
				$('.surplusAmount').removeClass('none');
				$(this).attr('data-type',1);
			}
		});
	},
	changeRepay:function(){
		var _this = this;
		$('#repayment-menu').on('click','li',function(){
			
			var curType = $(this).data('type');
			$('#repayCategoryId').val(curType);
			_this.getList();
			$(this).addClass('current').siblings().removeClass('current');
			$('.temp'+curType).removeClass('none').siblings().addClass('none');
			
		});
	},
	getAccount:function(){
		$(document).on('click','.acc-more',function(){
			var content = $(this).data('acc');
			var arr=[];
			arr = content.split(',');
			$('.m-accNo').html(arr[0]);
			$('.m-accName').html(arr[1]);
			$('.m-bankCardNo').html(arr[2]);
			$('.m-bankName').html(arr[3]);
			$("#model-more").show();
			return false;
		});
	},
	closeAccount:function(){
		$(document).on('click','.rm-dialog-close',function(){
			$(".ui-dialog").hide();
			return false;
		});
	},
	init: function(){
		this.getList();
		this.getExplain();
		this.changeList();
		this.changeRepay();
		this.getAccount();
		this.closeAccount();
	}
};

/**
 * 更多还款明细详情
 */
var paymentsDetailList={
	getInfo: function(){
		var repayId = getUrlParam({name:'repayId'});
		var from = getUrlParam({name:'from'});
		if(from == 'Actual'){
			document.title = "实际支出明细";
		}
		$.ajax({
			type:"post",
			url:url + "/loanExpenditure/repayPlanDetail",
			data:{repayId:repayId},
			success:function(data){
				if(data.code == 0){
					var html = template('paymentsDetailListTemp', data);
					$('#paymentsDetailListD').html(html);
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
				
			}
		});
	},
	init:function(){
		this.getInfo();
	}
};

/**
 * 借款人信息
 * getList：获取借款人列表信息
 */
var loanDebtor ={
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var _this = (obj&&obj._this)?obj._this:this;
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type === 's'){
			_this.currentPage = 1;
		}
		$.ajax({
			type:"post",
			url:url+"/loanDebtor/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord
			},
			success: function(callback){
				if(callback.code == 0){
					_this.type = '';
					var data = callback.dataSource;
					var html = template('loanDebtorTemp', data);
					if(_this.currentPage == 1){
						$('.loan-list').html(html);
					}else{
						$('.loan-list').append(html);
					}
					_this.currentPage++;
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
						classname:'tips-no-message',
						content:message.noMssege,
						divBox:'.loan-list'
					});
					}else if(data.totalPage < _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
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
}

/**
 * 借款人详情
 * getInfo：获取详情信息
 */
var loanDebtorDetail={
	getInfo: function(){
		var param ={
			debtorId: getUrlParam({name:'debtorId'})
		};
		$.ajax({
			type:"post",
			url:url + "/loanDebtor/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('loanDebtorDetailTemp', data.dataSource);
					$('#loanDebtorDetail').html(html);
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
 * 贷款人信息
 * getList: 获取贷款人信息列表
 */

var loanLender = {
	currentPage: 1,
	keyWord:$('input[name=search]').val(),
	getList: function(obj){
		var _this = (obj&&obj._this)?obj._this:this;
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type === 's'){
			_this.currentPage = 1;
		}
		$.ajax({
			type:"post",
			url:url+"/loanLender/list",
			data:{
				pageNum:_this.currentPage,
				keyWord:_this.keyWord
			},
			success: function(callback){
				if(callback.code == 0){
					_this.type = '';
					var data = callback.dataSource;
					var html = template('loanLenderTemp', data);
					if(_this.currentPage == 1){
						$('.loan-list').html(html);
					}else{
						$('.loan-list').append(html);
					}
					_this.currentPage++;
					if(data.totalPage == 0){
						$('.ui-loading-wrap').addClass('none');
						tips({
							classname:'tips-no-message',
							content:message.noMssege,
							divBox:'.loan-list'
						});
					}else if(data.totalPage < _this.currentPage){
						$('.ui-loading-wrap').html(message.success);
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
}

/**
 * 贷款人详情
 * getInfo:获取详情信息
 */
var loanLenderDetail = {
	getInfo: function(){
		var param = {
			lenderId : getUrlParam({name:'lenderId'})
		};
		$.ajax({
			type:"post",
			url:url + "/loanLender/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('loanLenderDetailTemp', data.dataSource);
					$('#loanLenderDetail').html(html);
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
				
			}
		});
	},
	init:function(){
		this.getInfo();
	}
}

/**
 * 收款账户
 * getList: 获取收款账户列表
 */
var account = {
	currentPage: 1,
	keyWord:'',
	getList: function(obj){
		var from = getUrlParam({name:'from'});
		var param ={},currentUrl='';
		if(from == 'nosearch'){
			$('.loan-search').remove();
		}
		var _this = (obj&&obj._this)?obj._this:this;
		$('.self-tips').remove();
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type === 's'){
			_this.currentPage = 1;
		}
		if(from == 'home'){   //判断页面的来源
			currentUrl= '/loanLenderAccounts/listHomePage';
			param = {
				pageNum:_this.currentPage,
				keyWord:_this.keyWord
			};
		}else{
			currentUrl= '/loanLenderAccounts/list';
			param = {lenderId:getUrlParam({name:'lenderId'})}
		}
		$.ajax({
			type:"post",
			url:url+currentUrl,
			data:param,
			success: function(callback){
				if(callback.code == 0){
					_this.type = '';
					var data = callback.dataSource;
					var html = template('accountTemp', data);
					if(from == 'home'){
						if(_this.currentPage == 1){
							$('.loan-list').removeClass('none').html(html);
						}else{
							$('.loan-list').removeClass('none').append(html);
						}
						if(data.totalPage == 0){
							$('.ui-loading-wrap').addClass('none');
							tips({
								classname:'tips-no-message',
								content:message.noMssege,
								divBox:'.loan-list'
							});
							$('.loan-list').addClass('none');
						}else if(data.totalPage <= _this.currentPage){
							$('.ui-loading-wrap').html(message.success);
						}
						_this.currentPage++;
					}else{
						$('.loan-list').html(html);
						if(data.loanLenderAccountsList.length==''){
							tips({
								classname:'tips-no-message',
								content:message.noMssege,
								divBox:'.loan-list'
							});
							$('.loan-list').remove();
							$('.ui-loading-wrap').addClass('none');
						}else{
							$('.ui-loading-wrap').html(message.success);
						}
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
	init: function(){
		this.callback = this.getList;
		this.getList();
		search.init(this);
		scrollFunc(this);
	}
};

/**
 * 收款账户详情
 * getInfo:获取详情信息
 */
var accountDetail = {
	getInfo: function(){
		var param = {accountId : getUrlParam({name:'accountId'})};
		$.ajax({
			type:"post",
			url:url + "/loanLenderAccounts/details",
			data:param,
			success:function(data){
				if(data.code == 0){
					var html = template('accountDetailTemp', data.dataSource);
					$('#accountDetail').html(html);
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
 * 周期表
 * 该方法待重构.....
 */
var period = {
	currentPage: 1,
	totalPage:100,
	keyWord:'',
	year:'',
	getList:function(obj){
		var _this = obj?obj:this;
		var repayCategory = getUrlParam({name:'repayCategory'});
		if(repayCategory == 'Actual'){
			document.title = "支出周期表";
		}
		var year = '';
		$('.ui-loading-wrap').removeClass('none').html(message.loading);
		if(_this.type == 's'){
			_this.currentPage = 1;
			
		}
		_this.year = $('.period-date').data('date');
		var status = $('input[name=loan-status]').val();//该字段用来区分年季月,0:季,1:年,2:第一季度,3:第二季度,4:第三季度,5:第四季度
		
		$.ajax({
			type:"post",
			url:url+"/loanExpenditure/periodicTable",
			data:{
				pageNum:_this.currentPage,
				debtorName:_this.keyWord,
				repayCategory:repayCategory,
				year:_this.year
			},
			success: function(callback){
				if(callback.code == 0){
					
					var data = callback.dataSource;
					var html = template('periodTemp', data);
					if(_this.currentPage == 1){
						$('#period').html(html);
					}else{
						$('#period').append(html);
					}
					var quarterId = $('.period-list-quarter');
					var yearId = $('.period-list-year');
					var monthId = $('.period-list-month');
					switch(status){
						case "0":
							quarterId.removeClass('none');
							yearId.addClass('none');
							monthId.addClass('none');
							break;
						case '1':
							quarterId.addClass('none');
							yearId.removeClass('none');
							monthId.addClass('none');
							break;
						case '2':
							quarterId.addClass('none');
							yearId.addClass('none');
							monthId.addClass('none');
							$('.curr-month0,.curr-month1,.curr-month2').removeClass('none');
							$('.quarter0').removeClass('none');
							break;
						case '3':
							quarterId.addClass('none');
							yearId.addClass('none');
							monthId.addClass('none');
							$('.curr-month3,.curr-month4,.curr-month5').removeClass('none');
							$('.quarter1').removeClass('none');
							break;
						case '4':
							quarterId.addClass('none');
							yearId.addClass('none');
							monthId.addClass('none');
							$('.curr-month6,.curr-month7,.curr-month8').removeClass('none');
							$('.quarter2').removeClass('none');
							break;
						case '5':
							quarterId.addClass('none');
							yearId.addClass('none');
							monthId.addClass('none');
							$('.curr-month9,.curr-month10,.curr-month11').removeClass('none');
							$('.quarter3').removeClass('none');
							break;
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
	chooseDate:function(){
		//从2010年起,当前年+20
		var $this = this;
		var today = new Date();
		var year = today.getFullYear();
		var yearsArr=[],dateList=[];
		$('.period-date').html(year);
		yearsArr=[];
		for (var beganYear=2010;beganYear<=(year+20);beganYear++) {
			dateList.push(beganYear);
		}
		var selectedDate = year;
		$('.period-date').attr('data-date',selectedDate);
		var pickerDate = new WheelPicker({
		    data: [dateList],
		    value:[selectedDate],
		    onSelect: function(selected){
		        $('.period-date').html(selected[0].value);
		        $('.period-date').attr('data-date',selected[0].value);
		        $this.keyWord = '';
		        $this.getList($this);
		    }
		});
		$(document).on('click','.period-date',function(){
			pickerDate.show();
    		return false;
		});
	},
	changeQuarter:function(){
		$('.period-quarter').on('click',function(){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$('.period-quarter-list').addClass('none');
			}else{
				$(this).addClass('active');
				$('.period-quarter-list').removeClass('none');
			}
		});
	},
	selectedQuarter:function(){
		var _this = $(this);
		$(document).on('click','.period-quarter-list li',function(){
			var type = $(this).data('type');
			$('.period-list-month').addClass('none');
			$('.period-list-year').addClass('none');
			$('.period-list-quarter').addClass('none');
			if(type == 1){
				$('.curr-month0,.curr-month1,.curr-month2').removeClass('none');
				$('.quarter0').removeClass('none');
				$('input[name=loan-status]').val(2);
			}else if(type ==2){
				$('.curr-month3,.curr-month4,.curr-month5').removeClass('none');
				$('.quarter1').removeClass('none');
				$('input[name=loan-status]').val(3);
			}else if(type == 3){
				$('.curr-month6,.curr-month7,.curr-month8').removeClass('none');
				$('.quarter2').removeClass('none');
				$('input[name=loan-status]').val(4);
			}else if(type == 4){
				$('.curr-month9,.curr-month10,.curr-month11').removeClass('none');
				$('.quarter3').removeClass('none');
				$('input[name=loan-status]').val(5);
			}
			$('.period-quarter').removeClass('active');
			$('.period-quarter-list').addClass('none');
			
		});
	},
	changeYear:function(){
		$('.period-year').on('click',function(){
			$(this).addClass('active').siblings().removeClass('active');
			var type = $(this).data('type');
			if(type == 0){
				$('.period-list-year').removeClass('none');
				$('.period-list-month').addClass('none');
				$('.period-list-quarter').addClass('none');
				$('input[name=loan-status]').val(1);
			}else if(type == 1){
				$('.period-list-year').addClass('none');
				$('.period-list-month').addClass('none');
				$('.period-list-quarter').removeClass('none');
				$('input[name=loan-status]').val(0);
			}
		});
	},
	goRepay:function(){
		$(document).on('click','#period .ui-col',function(){
			var dateFrom = $(this).data('from');
			var dateTo = $(this).data('to');
			var debtorId = $(this).parent().data('debtorid');
			var repayCategory = getUrlParam({name:'repayCategory'});
			var url = '';
			var params = '&debtorId='+debtorId+'&repayDateFrom='+dateFrom+'&repayDateTo='+dateTo+'&from=period';
			url= 'payments.html?category='+repayCategory;
			window.location.href = url+params;
		});
	},
	init:function(){
		this.chooseDate();
		this.changeQuarter();
		this.changeYear();
		this.selectedQuarter();
		this.callback = this.getList;
		search.init(this);
		this.getList();
		scrollFunc(this);
		this.goRepay();
	}
}
