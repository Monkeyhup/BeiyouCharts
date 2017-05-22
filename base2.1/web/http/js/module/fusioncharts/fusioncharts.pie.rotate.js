/**
 * fusionchart旋转饼图
 *
 * Created by LH on 2016/11/30.
 */
// document.write("<script src='/base2.1/http/lib/Fusioncharts/fusioncharts-3.5.1/fusioncharts.js' type='text/javascript'></script>");
define(function(require, exports, module) {

    var common = require("./fusioncharts.common");

    /**
     *
     * @constructor
     */

    var FusionChartPieRotate = function(){
        this.option = {
            type: 'pie2d',
            renderAt: 'content',
            width: '600',
            height: '500',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                    "caption": "2009-2014网络经济市场规模(亿元)",
                    //"subCaption": "Harry's SuperMart",
                    "pieRadius": "75",
                    "slicingDistance ": "20",
                    "showBorder": "0",
                    "xAxisName": "",
                    "yAxisName": "",
                    "showLegend": "1",
                    //"numberPrefix": ""
                    "theme": "fint"
                },

                "data": []
            }
        };
    };

    /**
     *
     * @type {{}}
     */
    FusionChartPieRotate.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);
            // FusionCharts.ready(function(){
            //     var fusionchart = new FusionCharts.render(that.option)
            // });
           // 基于准备好的dom，初始化fusioncharts图表
            var myChart = common.myFusionCharts.getChart(config.container);
            if(myChart){
                this.getOptionFromConfig(config,function(){
                    if(config.option){
                        that.option = $.extend(true,that.option,config.option || {});
                    }
                    // var FusionCharts;
                    FusionCharts.ready(function(){
                        var fusionchart = new FusionCharts(that.option)
                        fusionchart.render();
                    });
                    //增加自定义x轴(必须放在getOptionFromConfig后面)
                    //that.appendXAxis($("#"+config.container),config,that.getRotateFromConfig(config));
                    //myChart.render();
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
                    // that.option.legend.data = re.legendData;
                    //
                    // $.extend(that.option.xAxis[0],{
                    //     type : 'category',
                    //     data : re.xAxisData
                    // });
                    // $.extend(that.option.yAxis[0],{
                    //     name : re.unit
                    // });
                    that.option.dataSource =
                         {
                             //"data":re.seriesData
                             "chart": {
                                 "caption": "2009-2014网络经济市场规模(亿元)",
                                 //"subCaption": "Harry's SuperMart",
                                 "xAxisName": re.xname,
                                 "yAxisName": re.yname,
                                 "showBorder": "0",
                                 "showPercentValues": "0",
                                 "showPercentInTooltip": "0",
                                 "startingAngle": "0",
                                 "pieRadius": "75",
                                 "showLegend": "0",
                                 "decimals": "1",
                                 "useDataPlotColorForLabels": "1",
                                 "enableSmartLabels": "1",
                                 //Smart line cosmetics
                                 "smartLineColor": "#d11b2d",
                                 "smartLineThickness": "2",
                                 "smartLineAlpha": "100",
                                 "use3DLighting": "0",
                                 "slicingDistance ": "20",
                                 "isSmartLineSlanted": "0",
                                 //"numberPrefix": re.unit
                                 "theme": "fint"
                             },
                             "data":re.seriesData

                             // "data": [{
                             //     "label": "2009",
                             //     "value": "229.13"
                             // }, {
                             //     "label": "2010",
                             //     "value": "255.38"
                             // }, {
                             //     "label": "2011",
                             //     "value": "288.29"
                             // }, {
                             //     "label": "2012",
                             //     "value": "324.68"
                             // }]
                    }
                    // that.option.series = [
                    //     {
                    //         "barWidth":55,
                    //         "name":re.seriesName,
                    //         "type":"bar",
                    //         "data":re.seriesData,
                    //         "itemStyle" : {
                    //             "normal": {
                    //                 //"barBorderWidth": 0,
                    //                 "barBorderColor": "#F5F5F5",
                    //                 "barBorderRadius": [0,0,0,0],
                    //                 "color": function(param){
                    //                     //单独高亮一根柱子
                    //                     if(typeof config.selectedBarValue == "number"){
                    //                         if(param.data && param.data == config.selectedBarValue){
                    //                             return "#37648B";
                    //                         }else{
                    //                             return "#CDC9C9";	//灰色
                    //                         }
                    //                     }else{
                    //                         return "#37648B";
                    //                     }
                    //                 },
                    //                 "label": {
                    //                     "show": true,
                    //                     "position": "top",
                    //                     "textStyle": {
                    //                         "fontSize": 12,
                    //                         "fontFamily": "微软雅黑",
                    //                         "color": "#37648B",
                    //                         "fontWeight": "bold"
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // ];
                    // that.option.title={
                    //     show: true,
                    //     text : "国民经济R&D人员全时当量" ,
                    //     left : "center",
                    //     "top" : "0"
                    // }
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
                //var xAxisData = [];
                //var legendData = [];

                //var seriesName = "";
                var seriesData = [];
                var xname = "";
                var yname = "";
                //var titleName=data.title;

                //var unit = "";

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].value)) {
                        seriesData.push({"label":data[i].name, "value":data[i].value});
                        //xAxisData.push(data[i].name);
                    }

                    //第一行为表头
                    if (i == 0) {
                        //数据指标名称
                        xname = data[i].name;
                        yname = data[i].value;

                        // var v = regex.exec(yname);
                        // if(v && v[0]){
                        //     unit = v[0];
                        //     yname = yname.split(v)[0] || "";
                        // }

                        //数据指标名称
                        //legendData.push(seriesName);
                    }//end if (i == 0)
                }

                var re = {
                     xname:xname,
                     yname:yname,
                    //xAxisData : xAxisData,
                    //legendData : legendData,
                    //seriesName : seriesName,
                    seriesData : seriesData
                    //titleName : titleName,
                    //unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
        // appendXAxis:function($container,config,angle){
        //     var that = this;
        //     if(that.option.xAxis[0].isShowXAxisText) {
        //         //找到出图容器的父节点对象
        //         var $containerParent = $container.parent();
        //         if ($containerParent.find(">#x1").length > 0) {
        //             //如果存在div,清除
        //             $containerParent.find(">#x1").remove();
        //         }
        //         //重新添加
        //         var html = "<div class=\"x1\" id=\"x1\" style=\"width:100%;position:relative; left:9%;top:-50px;display:none\">";
        //         $container.after(html);
        //
        //         //设置xAxisLabel
        //         $("#x1").html("").css({"display": "block", "height": "20px"});
        //
        //         var xLabelTextNum = parseInt(that.option.xAxis[0].data.length);//x轴字段数量
        //         var xLabelText = that.option.xAxis[0].data;
        //         var xLabelWide = config.width * 0.81 / xLabelTextNum;
        //         var xLabelTextSize = that.option.xAxis[0].axisLabel.textStyle.fontSize;
        //         var xLabelTextColor = that.option.xAxis[0].axisLabel.textStyle.color;
        //         var xLabelTextfontFamily = that.option.xAxis[0].axisLabel.textStyle.fontFamily;
        //
        //         for (var i = 0; i < xLabelTextNum; i++) {
        //             $("#x1").append("<div class='x1_" + i + "' id='x1_" + i + " ' style=' position:relative;border: 0px solid #a0ff4f;width: " + xLabelWide + "px;float:left;'></div>");
        //         }
        //         //为x轴字段添加span
        //         for (var i = 0; i < xLabelTextNum; i++) {
        //             $(".x1_" + i).append("<div class='x1_text' id='x1_text' style='border: 0px solid #a0ff4f;height:" + (parseInt(xLabelTextSize) + 8) + "px;width: 500px;position:relative;font-size: " + xLabelTextSize + "px;color:" + xLabelTextColor + ";font-family:" + xLabelTextfontFamily + ";display: inline-block;-webkit-transform: rotate(" + angle + "deg);overflow:hidden;float:left;'>" + xLabelText[i] + "</div>")
        //         }
        //
        //         //取得x轴的偏移量
        //         var xLabelPositionOffset = that.option.xAxis[0].positionOffset;
        //         //绘制x轴的偏移量
        //         if (xLabelPositionOffset.x != "") {
        //             $("#x1 .x1_text").css("left", xLabelPositionOffset.x + "px");
        //         }
        //         if (xLabelPositionOffset.y != "") {
        //             $("#x1 .x1_text").css("top", xLabelPositionOffset.y + "px");
        //         }
        //     }
        // },
        // getRotateFromConfig:function(config){
        //     var angle = 0;  //默认为0
        //     if(config.option && config.option.xAxis &&　config.option.xAxis[0]){
        //         if(config.option.xAxis[0].axisLabel && config.option.xAxis[0].axisLabel.rotate > -180){
        //             //取得当前的旋转角度
        //             angle = config.option.xAxis[0].axisLabel.rotate;
        //         }
        //     }
        //     return angle;
        // }
    };


    return FusionChartPieRotate;
});