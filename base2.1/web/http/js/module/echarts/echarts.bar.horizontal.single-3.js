/**
 * echart单一条形图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartBarHorizontalSingle = function(){
        this.option = {
            backgroundColor:"#404040",
            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            title: {
                show: true,
                text: ''
            },
            "grid": {
                "borderWidth": 0,
                "containLabel": true
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
                "top": "5%"
            },
            xAxis : [
                {
                    type : 'value',
                    data : [],  //数据
                    "axisLabel": {
                        "rotate": 0,
                        "interval": "auto",
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#A9A9A9",
                            "fontWeight": "bold"
                        }
                    },
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#A9A9A9"
                        }
                    },
                    positionOffset:{
                        x:0,
                        y:0
                    },
                    "isShowXAxisText" : false
                }
				//{
				//    type : 'value',
                 //   "axisLabel": {
                 //       "rotate": 0,
                 //       "interval": "auto",
                 //       "textStyle": {
                 //           "fontSize": 12,
                 //           "fontFamily": "微软雅黑",
                 //           "color": "#272727",
                 //           "fontWeight": "bold"
                 //       }
                 //   },
                 //   "splitLine": {
                 //       "show": false
                 //   },
                 //   "axisLine": {
                 //       "lineStyle": {
                 //           "color": "#272727"
                 //       }
                 //   },
                 //   "nameTextStyle": {
                 //       "fontSize": 12,
                 //       "fontFamily": "微软雅黑",
                 //       "color": "#272727",
                 //       "fontWeight": "bold"
                 //   },
				//    name:""     //数据
				//}
            ],
            yAxis : [
                {
                    type : 'value',
                    "axisLabel": {
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#A9A9A9",
                            "fontWeight": "bold"
                        },
                        "formatter": "{value}"
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#A9A9A9",
                        "fontWeight": "bold"
                    },
                    "splitLine": {
                        "show": true
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#A9A9A9"
                        }
                    },
                    name:"" ,    //数据
                    positionOffset:{
                        x:0,
                        y:0
                    },
                    "isShowXAxisText" : false
                }
				//{
				//    type : 'category',
				//    data : [],  //数据
                 //   "axisLabel": {
                 //       "textStyle": {
                 //           "fontSize": 12,
                 //           "fontFamily": "微软雅黑",
                 //           "color": "#272727",
                 //           "fontWeight": "bold"
                 //       },
                 //       "formatter": "{value}"
                 //   },
                 //   "nameTextStyle": {
                 //       "fontSize": 12,
                 //       "fontFamily": "微软雅黑",
                 //       "color": "#272727",
                 //       "fontWeight": "bold"
                 //   },
                 //   "splitLine": {
                 //       "show": true
                 //   },
                 //   "axisTick": {
                 //       show: false
                 //   },
                 //   "axisLine": {
                 //       "lineStyle": {
                 //           "color": "#272727"
                 //       }
                 //   }
				//}
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
    EChartBarHorizontalSingle.prototype = {
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
                    that.option.series = [
                        {
                            "name":re.seriesName,
                            "type":"bar",
                            "data":re.seriesData,

                            "itemStyle": {
                            	"normal": {
                                    "barBorderWidth": 0,
                                    "barBorderColor": "#F5F5F5",
                                    "barBorderRadius": [4,4,4,4],
                                    "color": function(param){
                                        //单独高亮一根柱子
                                        if(typeof config.selectedBarValue == "number"){
                                            if(param.data && param.data == config.selectedBarValue){
                                                return "#fbc201";
                                            }else{
                                                return "#CDC9C9";	//灰色fbc201  D79D4B
                                            }
                                        }else{
                                            return "#fbc201";
                                        }
                                    },
                                    "label": {
                                        "show": true,
                                        //"position": "right",
                                        "textStyle": {
                                            "fontSize": 12,
                                            "fontFamily": "微软雅黑",
                                            "color": "#ffffff",
                                            "fontWeight": "bold"
                                        }
                                    }
                                }
                            }
                        }
                    ];
                    that.option.title={
                        show: true,
                        text : "2015年城市居民消费价格比上年涨跌幅度（%）" ,
                        left : "center",
                        "textStyle" : {
                            "color": "#ffffff",
                            "fontWeight": "bold"
                        },
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
        	if(data && data != null){
                var yAxisData = [];
                var legendData = [];

                var seriesName = "";
                var seriesData = [];
                var titleName = data.title;

                var unit = "";

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].value)) {
                        seriesData.push(data[i].value);
                        yAxisData.push(data[i].name);
                    }

                    //第一行为表头
                    if (i == 0) {
                        //数据指标名称
                        seriesName = data[i].value || "";

                        var v = regex.exec(seriesName);
                        if(v && v[0]){
                            unit = v[0];
                            seriesName = seriesName.split(v)[0] || "";
                        }

                        //数据指标名称
                        legendData.push(seriesName);
                    }//end if (i == 0)
                }

                var re = {
                    yAxisData : yAxisData,
                    legendData : legendData,
                    seriesName : seriesName,
                    titleName : titleName,
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartBarHorizontalSingle;
});