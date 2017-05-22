/**
 * echart单一柱状图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartBarVerticalSingle = function(){
        this.option = {
            backgroundColor:"#4F4F4F",
            title: {
                show:true,
                "backgroundColor": "#ffffff",
                text: ''
            },
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
                    //"color": "#272727",
                    "color": "#A9A9A9",
                    "fontWeight": "bold"
                },
                "selectedMode": true,
                "show": true,
                "left": "right",
                "top": "5%"
            },
            xAxis : [
                {
                    "axisTick":{
                        show:false
                    },
                    type : 'category',
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
                    name:""     //数据
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
    EChartBarVerticalSingle.prototype = {
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
                    //增加自定义x轴(必须放在getOptionFromConfig后面)
                    that.appendXAxis($("#"+config.container),config,that.getRotateFromConfig(config));
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
                            "barWidth":92,
                            "name":re.seriesName,
                            "type":"bar",
                            "data":re.seriesData,
                            "itemStyle" : {
                            	"normal": {
                                    "barBorderWidth": 0,
                                    "barBorderColor": "#F5F5F5",
                                    "barBorderRadius": [0,0,0,0],
                                    //"color":"#4169E1",
                                    "color":"#008B8B",
                                    //"color":"#00008B",
                                    //"color":"#2E8B57",

                                    //"color": function(params){
                                    //    //var colorList = [
                                    //    //    '#FC4369','#00AFCA','#00CF01','#F99F00','#535353'
                                    //    //];
                                    //    var colorList = [
                                    //        '#FC4369','#00AFCA','#00CF01','#F99F00','#C0C0C0','#FF00FF','#097B7C','#FFFF00','#7A378B','#8B0000','#00FF7F'
                                    //        ,'#303030','#FFC0CB','#6B4513','#3F4F4F','#80FFFE','#FF0000','#0000FF','#698B22','#538B8B'
                                    //    ];
                                    //    return colorList[params.dataIndex]
                                    //},
                                    "label": {
                                        "show": true,
                                        "position": "inside",
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
                        text : "2005-2009时间段PC利润统计" ,
                        left : "center",
                        textStyle: {
                            color: "#ffffff",
                            "fontWeight": 'bold'
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
                var xAxisData = [];
                var legendData = [];

                var seriesName = "";
                var seriesData = [];
                var titleName = data.title;

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
                    titleName : titleName,
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        },
        appendXAxis:function($container,config,angle){
            var that = this;
            if(that.option.xAxis[0].isShowXAxisText) {
                //找到出图容器的父节点对象
                var $containerParent = $container.parent();
                if ($containerParent.find(">#x1").length > 0) {
                    //如果存在div,清除
                    $containerParent.find(">#x1").remove();
                }
                //重新添加
                var html = "<div class=\"x1\" id=\"x1\" style=\"width:100%;position:relative; left:9%;top:-50px;display:none\">";
                $container.after(html);

                //设置xAxisLabel
                $("#x1").html("").css({"display": "block", "height": "20px"});

                var xLabelTextNum = parseInt(that.option.xAxis[0].data.length);//x轴字段数量
                var xLabelText = that.option.xAxis[0].data;
                var xLabelWide = config.width * 0.81 / xLabelTextNum;
                var xLabelTextSize = that.option.xAxis[0].axisLabel.textStyle.fontSize;
                var xLabelTextColor = that.option.xAxis[0].axisLabel.textStyle.color;
                var xLabelTextfontFamily = that.option.xAxis[0].axisLabel.textStyle.fontFamily;

                for (var i = 0; i < xLabelTextNum; i++) {
                    $("#x1").append("<div class='x1_" + i + "' id='x1_" + i + " ' style=' position:relative;border: 0px solid #a0ff4f;width: " + xLabelWide + "px;float:left;'></div>");
                }
                //为x轴字段添加span
                for (var i = 0; i < xLabelTextNum; i++) {
                    $(".x1_" + i).append("<div class='x1_text' id='x1_text' style='border: 0px solid #a0ff4f;height:" + (parseInt(xLabelTextSize) + 8) + "px;width: 500px;position:relative;font-size: " + xLabelTextSize + "px;color:" + xLabelTextColor + ";font-family:" + xLabelTextfontFamily + ";display: inline-block;-webkit-transform: rotate(" + angle + "deg);overflow:hidden;float:left;'>" + xLabelText[i] + "</div>")
                }

                //取得x轴的偏移量
                var xLabelPositionOffset = that.option.xAxis[0].positionOffset;
                //绘制x轴的偏移量
                if (xLabelPositionOffset.x != "") {
                    $("#x1 .x1_text").css("left", xLabelPositionOffset.x + "px");
                }
                if (xLabelPositionOffset.y != "") {
                    $("#x1 .x1_text").css("top", xLabelPositionOffset.y + "px");
                }
            }
        },
        getRotateFromConfig:function(config){
            var angle = 0;  //默认为0
            if(config.option && config.option.xAxis &&　config.option.xAxis[0]){
                if(config.option.xAxis[0].axisLabel && config.option.xAxis[0].axisLabel.rotate > -180){
                    //取得当前的旋转角度
                    angle = config.option.xAxis[0].axisLabel.rotate;
                }
            }
            return angle;
        }
    };


    return EChartBarVerticalSingle;
});