/**
 * echart单一面积图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartAreaSingle = function(){
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
                            "color": "#26C0C0"
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
                    "type":"line",
                    "smooth":true,
                    "itemStyle": {normal: {areaStyle: {type: 'default'}}},
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartAreaSingle.prototype = {
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
                        type : 'category',
                        data : re.xAxisData
                    });
                    $.extend(that.option.yAxis[0],{
                        name : re.unit
                    });
                    that.option.series = [
                        {
                            "name":re.seriesName,
                            "type":"line",
                            "data":re.seriesData,
                            "smooth":true,
                            "itemStyle": {
                            	normal: {
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        "textStyle": {
                                            "fontSize": 12,
                                            "fontFamily": "微软雅黑",
                                            "fontWeight": "bold"
                                        }
                                    },
                            		areaStyle: {
                            			type: 'default'
                            		}
                            	}
                            },	//面积图
                        }
                    ];
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
                var xAxisData = [];
                var legendData = [];

                var seriesName = "";
                var seriesData = [];

                var unit = "";

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].value)) {
                        seriesData.push(data[i].value);
                        xAxisData.push(data[i].name);
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
                    xAxisData : xAxisData,
                    legendData : legendData,
                    seriesName : seriesName,
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };

    return EChartAreaSingle;
});