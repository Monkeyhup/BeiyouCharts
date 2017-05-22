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
        //this.currentColors = [];
        //
        //this.colors = ['#37648B','#D79D4B',
        //    "#ff7f50", "#87cefa", "#da70d6",
        //    "#32cd32", "#6495ed", "#ff69b4",
        //    "#ba55d3", "#cd5c5c", "#ffa500",
        //    "#40e0d0", "#1e90ff", "#ff6347",
        //    "#7b68ee", "#00fa9a", "#ffd700",
        //    "#6699FF", "#ff6666", "#3cb371",
        //    "#b8860b", "#30e0e0"];

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
                                    "barBorderWidth": 2,
                                    "barBorderColor": "#F5F5F5",
                                    "barBorderRadius": [0,0,0,0],
                                    "color": function(params){
                                        //var colorList = [
                                        //    '#FC4369','#00AFCA','#00CF01','#F99F00','#535353'
                                        //];
                                        var colorList = [
                                            '#FC4369','#00AFCA','#00CF01','#F99F00','#C0C0C0','#FF00FF','#097B7C','#FFFF00','#7A378B','#8B0000','#00FF7F'
                                            ,'#303030','#FFC0CB','#6B4513','#3F4F4F','#80FFFE','#FF0000','#0000FF','#698B22','#538B8B'
                                        ];
                                        return colorList[params.dataIndex]
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
                        text : "2008-2012全国“十一”旅游收入" ,
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