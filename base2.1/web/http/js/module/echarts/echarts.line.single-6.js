/**
 * echart单一折线图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartLineSingle = function(){
        this.option = {
            backgroundColor:'#293042',
            grid:{
                left:20,
                top:'10%',
                bottom:20,
                right:40,
                containLabel:true
            },

            tooltip: {
                show: true,
                "trigger": "axis",
                "axisPointer": {
                    "type": "line"
                }
            },

            legend: {
                top:"5%",
                data:[''],
                left:"right",
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color" :'#f17a52'
                },
                "selectedMode": true,
                "show": true
            },
            xAxis : [

                {
                    boundaryGap:false,
                    axisTick:{
                        show:false,
                        inside:true
                    },
                    type : 'category',
                    data : [],  //数据
                    //splitArea:{
                    //    show:true,
                    //    areaStyle:{color:["#b0c4de","white"],
                    //        opacity:0.3
                    //    }
                    //},
                    splitLine:{
                        show:false
                    },
                    "axisLabel": {
                        textStyle: {
                            color: '#5c6076'
                        }
                    },
                    //"axisLabel": {
                    //    "rotate": 0,
                    //    "interval": "auto",
                    //    "textStyle": {
                    //        "fontSize": 12,
                    //        "fontFamily": "微软雅黑",
                    //        "color": "#000000",
                    //        "fontWeight": "bold"
                    //    },
                    //    "show":true
                    //},
                    //"splitLine": {
                    //    "show": true
                    //},
                    "axisLine":{
                        show:false
                    }
                    //"axisLine": {
                    //    "lineStyle": {
                    //        "color": "#000000"
                    //    }
                    //},

                }
            ],
            yAxis : [
                {
                    type : 'value',
                    ayisLine:{
                        show:false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#5c6076'
                        }
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#2e3547'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#384157'
                        }
                    },
                    //"axisLabel": {
                    //    "textStyle": {
                    //        "fontSize": 12,
                    //        "fontFamily": "微软雅黑",
                    //        /*"color": "#26C0C0",*/
                    //        "fontWeight": "bold"
                    //    },
                    //    "formatter": "{value}"
                    //},
                    //"nameTextStyle": {
                    //    "fontSize": 12,
                    //    "fontFamily": "微软雅黑",
                    //    "color": "#000000",
                    //    "fontWeight": "bold"
                    //},
                     //"min":
                        //"max":dataMax,
                    //"splitLine": {
                    //    "show": true
                    //},
                   /* "axisLine": {
                        "lineStyle": {
                            "color": "#26C0C0"
                        }
                    },*/
                    name:""     //数据
                }
            ],

            series : [
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartLineSingle.prototype = {
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
                    that.appendXAxis($("#"+config.container),config,that.getRotateFromConfig(config));  ///////////////////
                    myChart.setOption(that.option);

                });
            }
        },
        getOptionFromConfig:function(config,callback) {
            var that = this;
            if (typeof config.data == "object" && config.data != null) {
                this.getDataFromData(config.data, function (re) {
                    //console.log(re);
                    goTo(re);
                    callback && callback();
                });
            } else {
                this.getDataFromConfig(config.url, function (re) {

                    goTo(re);
                    callback && callback();
                });
            }

            //
            function goTo(re) {
                if (re && re != null) {
                    that.option.legend.data = re.legendData;

                    $.extend(that.option.xAxis[0], {
                        type: 'category',
                        data: re.xAxisData
                    });
                    $.extend(that.option.yAxis[0], {
                        name: re.unit
                    });
                    that.option.title={
                        show: true,
                        text : "北美电影票房统计" ,
                        left : "center",
                        "top" : "0"
                    };
                    that.option.series = [
                        {
                            type: 'line',
                            name:re.seriesName,
                            smooth:true,
                            symbolSize:10,
                            animation:false,
                            lineWidth:1.2,
                            hoverAnimation:false,
                            data:re.seriesData,
                            symbol:'circle',
                            itemStyle:{
                                normal:{
                                    color:'#f17a52',
                                    shadowBlur: 40,
                                    label:{
                                        show:false,
                                        position:'top',
                                        textStyle:{
                                            color:'#f17a52'

                                        }
                                    }
                                }
                            },
                            areaStyle:{
                                normal:{
                                    color:'#f17a52',
                                    opacity:0.08
                                }
                            }

                        },
                        {
                            type: 'bar',
                            name:'linedemo',
                            tooltip:{
                                show:false
                            },
                            animation:false,
                            barWidth:1.4,
                            hoverAnimation:false,
                            data:re.seriesData,
                            itemStyle:{
                                normal:{
                                    color:'#f17a52',
                                    opacity:0.6,
                                    label:{
                                        show:false
                                    }
                                }
                            }
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
                var titleName=data.title;

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
                    titleName :titleName,
                    seriesName : seriesName,
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
                    $(".x1_" + i).append("<div class='x1_text' id='x1_text' style='border: 0px solid #a0ff4f;height:" + (parseInt(xLabelTextSize) + 8) + "px;width:500px;position:relative;font-size: " + xLabelTextSize + "px;color:" + xLabelTextColor + ";font-family:" + xLabelTextfontFamily + ";display: inline-block;-webkit-transform: rotate(" + angle + "deg);overflow:hidden;float:left;'>" + xLabelText[i] + "</div>")
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


    return EChartLineSingle;
});