/**
 * echart柱形，折线图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var ECharBartLine = function(){
        this.option = {
            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
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
                },
                "selectedMode": true,
                "show": true
            },
            xAxis : [
                {
                    type : 'category',
                    data : [],  //数据
                    "axisLabel": {
                        "rotate": 0,
                        "interval": "auto",
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#26C0C0",
                            "fontWeight": "bold"
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#666666"
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    "axisLabel": {
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#26C0C0",
                            "fontWeight": "bold"
                        },
                        "formatter": "{value}"
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#26C0C0",
                        "fontWeight": "bold"
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#26C0C0"
                        }
                    },
                    name:""     //数据
                }
            ],
            series : [
                {
                    "name":"",
                    "type":"bar",
                    "data":[]   //数据
                },
                {
                    "name":"",
                    "type":"line",
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    ECharBartLine.prototype = {
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
            	this.getDataFromData(config.data,function(re){
            		goTo(re);
                    callback && callback();
            	});
            }else{
            	this.getDataFromConfig(config.url,function(re){
                	goTo(re);
                    callback && callback();
                });
            }
            
            //
            function goTo(re){
            	if(re && re != null){
                    var colors = ['#26C0C0','#E96633'];
                    
            		//图例
                    that.option.legend.data = re.legendData;
                    
                    //x轴
                    $.extend(that.option.xAxis[0],{
                        type : 'category',
                        data : re.xAxisData
                    });
                    
                    //y轴
                    that.option.yAxis = [];
                    for ( var j = 0; j < re.units.length; j++) {
                    	var color = colors[j%2];
                    	that.option.yAxis.push({
                            type : 'value',
                            "axisLabel": {
                                "textStyle": {
                                    "fontSize": 12,
                                    "fontFamily": "微软雅黑",
                                    "color": color,
                                    "fontWeight": "bold"
                                },
                                "formatter": "{value}"
                            },
                            "nameTextStyle": {
                                "fontSize": 12,
                                "fontFamily": "微软雅黑",
                                "color": color,
                                "fontWeight": "bold"
                            },
                            "splitLine": {
                                "show": false
                            },
                            "axisLine": {
                                "lineStyle": {
                                    "color": color
                                }
                            },
                            name:re.units[j]     //数据
                        });
					}
                    
                    //数据
                    that.option.series = [];
                    for(var i=0; i< re.series.length;i++){
                    	var color = colors[i%2];
                    	var type = (i==0) ? 'bar' : 'line';
                    	var position = (i==0) ? 'insideTop' : 'top';
                    	
                    	var unit = (re.units[i] ? re.units[i] : '');
                    	that.option.series.push({
                    		"name" : re.series[i].name,
                            "type" : type,
                            "data" : re.series[i].data,
							"yAxisIndex" : i,
                            "itemStyle" : {
                            	"normal": {
                                    "barBorderWidth": 2,
                                    "barBorderColor": color,
                                    "barBorderRadius": [0,0,0,0],
                                    "color": color,	
                                    "label": {
                                        "show": true,
                                        "position": position,
                                        "textStyle": {
                                            "fontSize": 12,
                                            "fontFamily": "微软雅黑",
                                            "color": (i==0) ? '#000000': color,
                                            "fontWeight": "bold"
                                        },
                                        formatter : '{c}' + unit
                                    }
                                }
                            }
                    	});
                    }
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
        	if(data && data != null && data[0]){
        		var data2 = data[0].name;
        		
                var heads = [];		//头部
                var bodys = [];		//同一年份不同指标分组
                		
                //数据转换
                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data2.length; i++) {
                    var rowData = data2[i];
                    
                    for(var j=0;j<rowData.length;j++){
                    	//如果是第一行，则为表头
                    	if(i == 0){
                    		heads.push(rowData[j]);
                    	}else{
                    		if(!bodys[j]){
                    			var arr = [];
                    			arr.push(rowData[j]);
                    			bodys[j] = arr;
                    		}else{
                    			bodys[j].push(rowData[j]);
                    		}
                    		
                    	}
                    }
                }

                var xAxisData = [];
                var legendData = [];
                var series = [];
                var units = [];
                if(heads.length > 1){
                	//1.取单位
                	for ( var c = 1; c < heads.length; c++) {
                		var unit = heads[c];
                    	var v = /\([^\)]+\)/g.exec(unit);
                        if(v && v[0]){
                            units.push(v[0]);
                        }
					}
                	
                    
                    //去掉头部单位
                    for(var b=0;b<heads.length;b++){
                    	///\([^\)]+\)/g 设置为局部，防止全局事件
                    	var v = /\([^\)]+\)/g.exec(heads[b]);
                        if(v && v[0]){
                            heads[b] = heads[b].split(v)[0] || heads[b];
                        }
                    }
                    

                    //2.取图例
                    for(var k=1;k<heads.length;k++){
                    	legendData.push(heads[k]);
                    }
                    
                    //3.取x轴
                    xAxisData = bodys[0];
                    
                    //4.取数据
                    for(var m=1;m<bodys.length;m++){
                    	series.push({
                    		name:heads[m],		//取对比的年份
                    		data:bodys[m]		//取指定年份对应的数据
                    	});
                    }
                }//end if(heads.length > 1)
                
               
                var re = {
                    xAxisData : xAxisData,
                    legendData : legendData,
                    series : series,
                    units : units
                };
                
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return ECharBartLine;
});