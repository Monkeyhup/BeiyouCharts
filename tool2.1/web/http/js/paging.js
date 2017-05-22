/**
 * 分页
 * @param containerId
 * @param paging
 * @param total
 * @param clickEvent
 * @constructor
 */
function Paging(containerId,paging,total,clickEvent){
	this.PAGE_SPLIT_NUM = 5;	//页段数
	this.containerId = containerId;

	this.total = total;
	this.pageNumber = (paging && paging.getPageNumber()) ? paging.getPageNumber() : 1;
	this.pageSize = (paging && paging.getPageSize()) ? paging.getPageSize() : 10;

	//总页数
	this.totalPage = 1;
	//当前分段数
	this.pageSplitNum = this.PAGE_SPLIT_NUM;

	this.clickEvent = clickEvent;

	this.init();
}

Paging.prototype = {
	init:function(){
		var that = this;

		//计算总页数
		if(that.total > 0){
			that.totalPage = Math.floor(that.total / that.pageSize);
			if(that.total % that.pageSize > 0){
				that.totalPage = that.totalPage +1;
			}
		}

		$("#"+that.containerId).html("");

		//显示信息
		that.showInfo();

		//绑定事件
		that.bindClick();
	},
	showInfo:function(){
		var that = this;

		that.pageSplitNum = that.PAGE_SPLIT_NUM;
		if(that.pageSplitNum > that.totalPage){
			that.pageSplitNum = that.totalPage;
		}

		var html = "";
		if(that.pageNumber == 1){
			//没有上一页
			html += "<a class=\"icon item disabled\"><i class=\"left chevron icon\"></i></a>";
		}else{
			//有上一页了
			html += "<a class=\"icon item\"><i class=\"left chevron icon\"></i></a>";
		}

		//当前页所在的段数
		var splitCount = Math.floor(that.pageNumber/that.pageSplitNum);
		if(that.pageNumber%that.pageSplitNum > 0){
			splitCount = splitCount+1;
		}

		//算出页码的起始页
		var index = (splitCount-1)*that.pageSplitNum;
		var forLen = index+that.pageSplitNum;
		if(forLen > that.totalPage){
			forLen = that.totalPage;
		}
		for(var i=index;i<forLen;i++){
			//当前页
			if((i+1) == that.pageNumber){
				html += "<a class=\"item active\">"+(i+1)+"</a>";
			}else{
				html += "<a class=\"item\">"+(i+1)+"</a>";
			}
		}


		if(that.pageNumber < that.totalPage){
			//可以下一页
			html += "<a class=\"icon item\"><i class=\"right chevron icon\"></i></a>";
		}else{
			//没有下一页了
			html += "<a class=\"icon item disabled\"><i class=\"right chevron icon\"></i></a>";
		}

		html += "<span class='item info'>"+that.pageNumber+"/"+that.totalPage+"，共"+that.total+"条</span>";

		$("#"+that.containerId).html(html);
	},
	bindClick:function(){
		var that = this;

		$("#"+that.containerId).on("click","a.item:not(.active,.disabled)",function(){
			var $that1 = $(this);

			var $i = $that1.find("i");
			if($i.length > 0){
				var isLeft = $($i[0]).hasClass("left");
				var isRight = $($i[0]).hasClass("right");
				if(isLeft){
					//第一页
					if(that.pageNumber == 1){
						return false;
					}
					that.pageNumber = that.pageNumber - 1;
				}else if(isRight){
					//最后一页
					if(that.pageNumber == that.totalPage){
						return false;
					}
					that.pageNumber = that.pageNumber + 1;
				}else{
					return false;
				}
			}else{
				that.pageNumber = parseInt($that1.text());
			}

			that.showInfo();
			that.clickEvent && that.clickEvent(that.pageNumber);
		});
	},
	setClickEvent:function(clickEvent){
		this.clickEvent = clickEvent;
	}
};
