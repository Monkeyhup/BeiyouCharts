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
                        "show": true
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
                        name : re.unit,
                        "min": getYaxisDataMin(re.seriesData),
                        "max":getYaxisDataMax(re.seriesData)
                    });
                    $.extend(that.option.yAxis[0],{
                        type : 'category',
                        data : re.yAxisData
                    });
                    //that.option.xAxis[0] = [
                    //    {
                    //        name : re.unit,
                    //        "min": 5,
                    //        "max":100
                    //    }
                    //];
                    that.option.series = [
                        {
                            "name":re.seriesName,
                            "type":"bar",
                            "data":re.seriesData,
                            "itemStyle": {
                            	"normal": {
                                    "barBorderWidth": 2,
                                    "barBorderColor": "#F5F5F5",
                                    "barBorderRadius": [0,0,0,0],
                                    "color": function(param){
                                        //单独高亮一根柱子
                                        if(typeof config.selectedBarValue == "number"){
                                            if(param.data && param.data == config.selectedBarValue){
                                                return "#37648B";
                                            }else{
                                                return "#CDC9C9";	//灰色
                                            }
                                        }else{
                                            return "#37648B";
                                        }
                                    },
                                    "label": {
                                        "show": true,
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
                        }
                    ];
                    that.option.title={
                        show: true,
                        text : "劳动生产率变化情况" ,
                        left : "center",
                        "top" : "0"
                    }
                }
            }
            function getYaxisDataMin(data) {
                var min = data[0];
                var a;
                var b;
                for (var i = 1; i < data.length; i++) {
                    if (min > data[i]) {
                        min = data[i];
                    }
                }
                if (min < 1) {
                    min = 0;
                    return min;
                }
                a = Math.log10(min) + 1;
                if (a < 3) {
                    min = min - (min % 10);
                    return min;
                } else {
                    b = Math.pow(10, a - 2);
                    min = min - (min % b);
                }

                return min;
            }
            function getYaxisDataMax(data){
                var max=data[0];var a; var b;
                for(var i=1;i<data.length;i++)
                {
                    if(max<data[i]){
                        max=data[i];
                    }
                }
                if(max<1){
                    return max;
                }
                a=Math.log10(max)+1;             //a为位数
                if(a<3)
                {
                    max=max-(max%10)+10;
                    return max;
                }else{
                    b=Math.pow(10,a-2);
                    max=max-(max%b)+b;
                }
                return max;
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