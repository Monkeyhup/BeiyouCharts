/**
 * echart多条形图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartBarHorizontalMulti = function(){
        this.option = {
            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            color: ['#D79D4B','#37648B'],
            "grid": {
                "borderWidth": 0,
                "containLabel": true
            },
            title: {
                show: true,
                text:''
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
                "show": true,
                "left": "right",
                "top":"5%",
                "orient": 'vertical',
                "align": 'right'
            },
            xAxis : [
				{
				    type : 'value',
                    "axisLabel": {
                        "rotate": 0,
                        "interval": "auto",
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#272727",
                            "fontWeight": "bold"
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#272727"
                        }
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#272727",
                        "fontWeight": "bold"
                    },
				    name:""     //数据
				}
            ],
            yAxis : [
				{
				    type : 'category',
				    data : [],  //数据
                    "axisLabel": {
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#272727",
                            "fontWeight": "bold"
                        },
                        "formatter": "{value}"
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#272727",
                        "fontWeight": "bold"
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisTick": {
                        show: false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#272727"
                        }
                    }
				}
            ],
            series : [
                {
                    "name":"",
                    "type":"bar",
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartBarHorizontalMulti.prototype = {
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
                    that.option.legend.data = re.legendData;

                    $.extend(that.option.xAxis[0],{
                        name : re.unit
                    });
                    
                    $.extend(that.option.yAxis[0],{
                        type : 'category',
                        data : re.yAxisData
                    });
                    
                    that.option.series = [];
                    
                    for(var i=0; i< re.series.length;i++){
                    	that.option.series.push({
                    		"name":re.series[i].name,
                            "type":"bar",
                            "data":re.series[i].data,
                            "markPoint": {
                                symbolRotate:270,
                                "label":{
                                    "normal":{
                                        "textStyle":{
                                            "color":"#000000"
                                        }
                                    }
                                },
                                data: [
                                    {type: 'max',value: '最大值'},
                                    {type: 'min',value: '最小值'}
                                ]
                            },
                            "itemStyle": {
                            	"normal": {
                                    "barBorderWidth": 2,
                                    "barBorderColor": "#F5F5F5",
                                    "barBorderRadius": [0,0,0,0],
                                    "label": {
                                        "show": false,
                                        "position": "right",
                                        "textStyle": {
                                            "fontSize": 12,
                                            "fontFamily": "微软雅黑",
                                            "color": "#26C0C0",
                                            "fontWeight": "bold"
                                        }
                                    }
                                }
                            }
                    	});
                    }
                    that.option.title={
                        show: true,
                        text : "中国方便面消费量与餐饮O2O市场规模变化情况" ,
                        left : "center",
                        "top" : "0"
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

                var titleName = data.title;
                		
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

                var yAxisData = [];
                var legendData = [];
                var series = [];
                var unit = "";
                if(heads.length > 1){
                	//1.取单位
                	unit = heads[1];
                	var v = regex.exec(unit);
                    if(v && v[0]){
                        unit = v[0];
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
                    yAxisData = bodys[0];
                    
                    //4.取数据
                    for(var m=1;m<bodys.length;m++){
                    	series.push({
                    		name:heads[m],		//取对比的年份
                    		data:bodys[m]		//取指定年份对应的数据
                    	});
                    }
                }//end if(heads.length > 1)
                
               
                var re = {
                    yAxisData : yAxisData,
                    legendData : legendData,
                    titleName : titleName,
                    series : series,
                    unit : unit
                };
                
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartBarHorizontalMulti;
});