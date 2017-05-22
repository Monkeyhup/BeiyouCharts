/**
 * echart三饼图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartThreePie = function(){

    	this.currentColors = [];
    	
    	this.colors = ["#ff7f50", "#87cefa", "#da70d6", 
    	               "#32cd32", "#6495ed", "#ff69b4", 
    	               "#ba55d3", "#cd5c5c", "#ffa500", 
    	               "#40e0d0", "#1e90ff", "#ff6347", 
    	               "#7b68ee", "#00fa9a", "#ffd700", 
    	               "#6699FF", "#ff6666", "#3cb371", 
    	               "#b8860b", "#30e0e0"
    	];
    	
        this.option = {
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            legend: {
                data:[''],
                orient : 'vertical',
                x : 'left',
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color": "#26C0C0",
                    "fontWeight": "bold"
                },
                "selectedMode": true,
                "show": false		//不显示
            },
            series : [
                {
                    "name":"",
                    "type":"pie",
                    "radius" : ['30%', '60%'],
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartThreePie.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            //重新初始化
            this.currentColors = [];
            
            //修改主容器id
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,parseFloat(config.height)*2);
            $("#"+config.container).css({
            	"position" : "relative"
            });
            
            var marginLefts = [0,-200,220];
            var marginTops = [0,config.height,config.height];
            var pCsses = [{
            	"position" : "absolute",
            	"margin-top" : parseFloat(config.height)/2-10,
				"margin-left" : parseFloat(config.width)/2,
                "fontSize": 12,
                "fontFamily": "微软雅黑",
                "fontWeight": "bold"
            },{
            	"position" : "absolute",
            	"margin-top" : parseFloat(config.height)*3/2-10,
				"margin-left" : parseFloat(config.width)/4,
                "fontSize": 12,
                "fontFamily": "微软雅黑",
                "fontWeight": "bold"
            },{
            	"position" : "absolute",
            	"margin-top" : parseFloat(config.height)*3/2-10,
				"margin-left" : parseFloat(config.width)*3/4,
                "fontSize": 12,
                "fontFamily": "微软雅黑",
                "fontWeight": "bold"
            }];
            
            var index = 0;
            
            //取到配置的饼颜色
            var configColors = null;
            if(config.option && config.option.color){
            	configColors = $.extend([],config.option.color || []);
            	delete config.option.color;
            }
            this.getOptionFromConfig(config,function(cOption,groupName){
            	var id = null;
                var $ids = $("div[id^='"+ config.container+"_chart_']");
                if($ids.length >= 3){
                	for(var i=0;i<$ids.length;i++){
                		var myid = $($ids[i]).attr("id");
                		var array = myid.split("_");
                		if(array.length > 0){
                			if(array[array.length-1] == index){
                				id = myid;
                				
                				//修改样式
                				$($ids[i]).css({
                                	"position" : "absolute",
                    				"margin-left" : marginLefts[index%3]+"px",
                    				"margin-top" : marginTops[index%3]+"px",
                    				"height":config.height
                                });
                				break;
                			}
                		}
                	}
                }else{
                	//创建新的div容器
                	id = config.container+"_chart_"+(new Date().getTime())+"_"+index;
                    $("<div id='"+id+"'>").css({
                    	"position" : "absolute",
        				"margin-left" : marginLefts[index%3]+"px",
        				"margin-top" : marginTops[index%3]+"px"
                    }).appendTo($("#"+config.container));
                    common.Util.setContainerWidAndHei($("#"+id),config.width,config.height);
                }
                
                var pId = null;
                var $pIds = $("p[id^='"+ config.container+"_name_']");
                if($pIds.length >= 3){
                	for(var j=0;j<$pIds.length;j++){
                		var mypId = $($pIds[j]).attr("id");
                		var array = mypId.split("_");
                		if(array.length > 0){
                			if(array[array.length-1] == index){
                				pId = mypId;
                				$($pIds[j]).css(pCsses[index%3]).html(groupName);
                				
                				var width =$($pIds[j]).width();
                                var marginLeft = parseInt($($pIds[j]).css("margin-left"));
                                var newMarginLeft = (marginLeft-width/2);
                                if(index == 1){
                                	newMarginLeft = (marginLeft+40-width/2);
                                }else if(index == 2){
                                	newMarginLeft = (marginLeft-20-width/2);
                                }
                                $("#"+pId).css({
                                	"margin-left": newMarginLeft+"px"
                                });
                				
                				break;
                			}
                		}
                	}
                }else{
                	//创建每个饼的名字
                    pId = config.container+"_name_"+(new Date().getTime())+"_"+index;
                    $("<p id='"+pId+"' class='text1'>" + groupName+ "</p>").css(pCsses[index%3]).appendTo($("#"+config.container));
                    
                    var width = $("#"+pId).width();
                    var marginLeft = parseInt($("#"+pId).css("margin-left"));
                    var newMarginLeft = (marginLeft-width/2);
                    if(index == 1){
                    	newMarginLeft = (marginLeft+40-width/2);
                    }else if(index == 2){
                    	newMarginLeft = (marginLeft-20-width/2);
                    }
                    
                    $("#"+pId).css({
                    	"margin-left": newMarginLeft+"px"
                    });
                }

                //alert(groupName.replace(/[^\x00-\xff]/g,"NB").length*2);
                
            	// 基于准备好的dom，初始化echarts图表
                var myChart = common.myECharts.getChart(id);
                if(myChart){
                	if(config.option){
                		cOption = $.extend(true,cOption,config.option || {});
                	}
                	
                	//取得配置的饼的颜色
                	if(configColors && configColors != null && configColors[index]){
                		$.extend(true,cOption,{color:configColors[index]});
                	}
                	
                    myChart.setOption(cOption);
                }
                
                index++;
            });
        },
        getOptionFromConfig:function(config,callback){
            var that = this;
            if(typeof config.data == "object" && config.data != null){
            	this.getDataFromData(config.data,function(re){
            		goTo(re,callback);
            	});
            }else{
            	this.getDataFromConfig(config.url,function(re){
                	goTo(re,callback);
                });
            }
            
            //
            function goTo(re,callback){
            	if(re && re != null){
            		for ( var i = 0; i < re.length; i++) {
            			
            			//获取颜色参数
                        var color = [];
                        var colorLen = that.colors.length;
                        for(var j=0,jLen=re[i].seriesData.length;j<jLen;j++){
                        	color.push(that.colors[j%colorLen]);
                        }
                        //保存当前colors
                        that.currentColors.push($.extend([],color));
                        that.option.color = color;
						
            			var cOption = $.extend(true,{},that.option);
            			
            			cOption.legend.data = re[i].legendData;
                        
            			cOption.series = [
                            {
                                "name":re[i].seriesName,
                                "type":"pie",
                                "radius" : ['30%', '60%'],
                                "data":re[i].seriesData,
                                "itemStyle" : {
                                    normal : {
                                        label : {
                                            show : true,	//显示指标文字
                                            textStyle : {
                                                fontSize : '12',
                                                fontWeight : 'bold',
                                                "fontFamily": "微软雅黑"
                                            },
                                            formatter : '{b}:\n {c}'+re[i].unit+'({d}%)'
                                        },
                                        labelLine : {
                                            show : true	//显示指标线
                                        }
                                    },
                                    emphasis : {
                                        label : {
                                            show : true,
                                            position : 'center',
                                            textStyle : {
                                                fontSize : '30',
                                                fontWeight : 'bold',
                                                "fontFamily": "微软雅黑",
                                                "color": "#26C0C0",
                                            }
                                        }
                                    }
                                }
                            }
                        ];
                        
                        callback && callback(cOption,re[i].group);
					}//end for ( var i = 0; i < re.length; i++)
                }
            }
        },
        getDataFromConfig:function(url,callback){
        	var that = this;
            common.Ajax.getJsonData(url,function(data){
            	that.getDataFromData(data,callback);
            });
        },
        getDataFromData:function(data,callback){
        	if(data && data != null){
        		var re = [];		//结果域
        		
                var seriesName = "";
                var unit = "";
                var group = "";
                
                var legendData = [];
                var seriesData = [];

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    //第一行为表头
                    if (i == 0) {
                        //数据指标名称
                        seriesName = data[i].value || "";

                        var v = regex.exec(seriesName);
                        if(v && v[0]){
                            unit = v[0];
                            seriesName = seriesName.split(v)[0] || "";
                        }
                    }else{
                    	//数据域	
                        if (!isNaN(data[i].value)) {
                            seriesData.push({
                            	name:data[i].name,
                            	value:data[i].value
                            });
                            
                            //数据指标名称
                            legendData.push(data[i].name);
                        }else{
                        	if(seriesData.length > 0){
                        		re.push({
                        			legendData : legendData,
                                    seriesName : seriesName,
                                    seriesData : seriesData,
                                    unit : unit,
                                    group:group
                        		});
                        		
                        		//重置
                        		group = data[i].name || "";
                        		legendData = [];
                        		seriesData = [];
                        	}else{
                            	//分组域
                            	group = data[i].name || "";
                        	}
                        }
                    }//end if (i == 0)
                }
                //最后一组
                if(seriesData.length > 0){
            		re.push({
            			legendData : legendData,
                        seriesName : seriesName,
                        seriesData : seriesData,
                        unit : unit,
                        group:group
            		});
            		
            		//重置
            		group = "";
            		legendData = [];
            		seriesData = [];
            	}
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartThreePie;
});