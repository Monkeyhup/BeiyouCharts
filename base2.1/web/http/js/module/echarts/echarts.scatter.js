/**
 * echart散点图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartScatter = function(){
    	this.currentColors = [];
    	
    	this.colors = ["#ff7f50", "#87cefa", "#da70d6", 
    	               "#32cd32", "#6495ed", "#ff69b4", 
    	               "#ba55d3", "#cd5c5c", "#ffa500", 
    	               "#40e0d0", "#1e90ff", "#ff6347", 
    	               "#7b68ee", "#00fa9a", "#ffd700", 
    	               "#6699FF", "#ff6666", "#3cb371", 
    	               "#b8860b", "#30e0e0"];
    	
    	this.currentSymbols = [];
    	
    	this.symbols = ["circle","rectangle","triangle",	//圆，矩形，三角形
	                    "pin","droplet","heart",			//标注，水滴，心形
	                    "star","emptyCircle","arrow"];	//星星，空心圆，箭头
    		
        this.option = {
            tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function(params){
                	 if (params.value.length > 1) {
                         return params.seriesName + ' :<br/>'
                            + params.value[1];
                     }else {
                         return params.seriesName + ' :<br/>'
                            + params.value;
                     }
                },
                axisPointer:{
                    show: true,
                    type : 'cross',
                    lineStyle: {
                        type : 'dashed',
                        width : 1
                    }
                }
            },
            "grid": {
                "borderWidth": 0
            },
            legend: {
                data:[''],
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color": "#26C0C0",
                    "fontWeight": "bold"
                }
            },
            xAxis : [
                 {
                     type : 'value',
                     scale:true,
                     axisLabel : {
                         formatter: "        "
                     }
                 }
            ],
            yAxis : [
                 {
                	 name :'',
                     type : 'value',
                     scale:true,
                     axisLabel : {
                         formatter: '{value}'
                     }
                 }
            ],
            series : [
                {
                    "name":"",
                    "type":"scatter",
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartScatter.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

            // 基于准备好的dom，初始化echarts图表
            var myChart = common.myECharts.getChart(config.container);
            if(myChart){
                this.getOptionFromConfig(config,function(){
                	if(config.option){
                    	that.option = $.extend(true,that.option,config.option || {});
                	}
                    myChart.setOption(that.option);
                });
            }
        },
        getOptionFromConfig:function(config,callback){
            var that = this;
            if(typeof config.data == "object" && config.data != null){
            	this.getDataFromData(config.data,function(re,indenNames){
            		goTo(re,indenNames);
                    callback && callback();
            	});
            }else{
            	this.getDataFromConfig(config.url,function(re,indenNames){
                	goTo(re,indenNames);
                    callback && callback();
                });
            }
            
            //
            function goTo(re,indenNames){
            	if(re && re != null){
                    //
            		that.option.legend.data = re.legendData;
            		
            		//获取颜色参数
                    var color = [];
                    var colorLen = that.colors.length;
                    for(var i=0,len=re.seriesData.length;i<len;i++){
                    	color.push(that.colors[i%colorLen]);
                    }
                    //保存当前colors
                    that.currentColors = $.extend([],color);
                    that.option.color = color;
                    
                    //
            		that.option.tooltip.formatter = function(params){
            			var index = -1;
            			if (params.value.length > 1) {
            				var idenName = indenNames[params.value[0]];
            				if(!idenName){
            					idenName = "";
            				}else{
            					idenName += ": ";
            				}
            				
                            return params.seriesName + ' -<br/>'+ idenName + params.value[1]+' '+re.unit;
                        }else {
            				var idenName = indenNames[params.name];
            				if(!idenName){
            					idenName = "";
            				}else{
            					idenName += ": ";
            				}
            				
                            return params.seriesName + ' -<br/>'+ idenName + params.value+' '+re.unit;
                        }
            		};
            		
                    $.extend(that.option.yAxis[0],{
                        name : re.unit
                    });
                    
                    //获取颜色参数
                    var symbols = [];
                    var symbolsLen = that.symbols.length;
                    //
                    var series = [];
                    for ( var i = 0; i < re.seriesData.length; i++) {
                    	series.push({
                            "name":re.legendData[i],	//分组指标
                            "type":"scatter",
                            "symbolSize" : function(value) {
                            	return 10;
							},
                            "data":re.seriesData[i],		//分组数据
                            "symbol":that.symbols[0]		//默认第一个
                        });
                    	
                    	symbols.push(that.symbols[0]);		//默认第一个
					}
                    that.option.series = series;
                   
                    //保存当前symbols
                    that.currentSymbols = $.extend([],symbols);
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
                var legendData = [];
                var xAxisData = [];

                var seriesName = "";
                var seriesData = [];

                var unit = "";
                
                var idenNames = [""];	//放置一个空的，与x 序号匹配
                var groupItem = [];
                var x = 0;
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
                        
                        continue;
                    }//end if (i == 0)
                    
                    if (!isNaN(data[i].value)) {
                    	//------------------------
                    	x += 1;
                    	xAxisData.push(x);
                    	groupItem.push([x,data[i].value]);
                    	
                    	//数据指标名称
                    	idenNames.push(data[i].name);
                    }else{
                    	if(groupItem.length > 0){
                        	seriesData.push(groupItem);
                        	groupItem = new Array();
                    	}
                    	
                        //分组指标名称
                        legendData.push(data[i].name);
                    }
                }
                
                //最后一组加入
                if(groupItem.length > 0){
                	seriesData.push(groupItem);
                	groupItem = new Array();
            	}
                
                var re = {
                	xAxisData:xAxisData,
                    legendData : legendData,
                    seriesName : seriesName,
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re,idenNames);
            }else{
                callback && callback(null,null);
            }
        }
    };


    return EChartScatter;
});