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
            color:['#f5c482','#ffcc00'],
            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "shadow"
                }
            },
            title:{
                show: true,
                text : ''

            },
            "grid": {
                "borderWidth": 0,
                "containLabel": true
            },
            legend: {
                top:"5%",
                orient : 'vertical',
                x : 'left',
                left:"right",
                data:[''],
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color": "#c37648B",
                    "fontWeight": "bold"
                },
                "selectedMode": true,
                "show": true
            },
            xAxis : [
                {
                    boundaryGap : false,    //从坐标当前刻度起
                    axisTick:{
                        inside:true
                    },
                    type : 'category',
                    data : [],  //数据
                    splitArea:{
                        show:true,
                        areaStyle:{color:["gray","white"],
                            opacity:0.1
                        }
                    },

                    "axisLabel": {
                        "rotate": 0,
                        "interval": "auto",
                        "textStyle": {
                            "fontSize": 12,
                            "fontFamily": "微软雅黑",
                            "color": "#000000",
                            "fontWeight": "bold"
                        },
                        "show":true
                    },
                    "splitLine": {
                        "show": true
                    },
                    "axisLine": {
                        "lineStyle": {
                            "color": "#000000"
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
                            /*"color": "#26C0C0",*/
                            "fontWeight": "bold"
                        },
                        "formatter": "{value}"
                    },
                    "nameTextStyle": {
                        "fontSize": 12,
                        "fontFamily": "微软雅黑",
                        "color": "#000000",
                        "fontWeight": "bold"
                    },
                    //"min":
                    //"max":dataMax,
                    "splitLine": {
                        "show": true
                    },
                    /* "axisLine": {
                     "lineStyle": {
                     "color": "#26C0C0"
                     }
                     },*/
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
                    that.option.title={
                        show: true,
                        text : "2013年居民消费价格月度同比（%）" ,
                        left : "center",
                        "top" : "0"
                    }

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
                                        //opacity:1,
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
                var titleName=data.title;
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
                    titleName:titleName,
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

    return EChartAreaSingle;
});