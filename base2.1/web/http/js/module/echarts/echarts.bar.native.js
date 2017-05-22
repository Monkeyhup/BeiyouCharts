/**
 * 双侧单柱图
 * Created by lmy on 2016/3/21.
 */
define(function(require, exports, module){
    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartBarNative = function(){
        this.option={
            //提示框组件
            tooltip:{
                show: true,
                "trigger": 'axis',
                "axisPointer" : {            // 坐标轴指示器，坐标轴触发有效
                    "type" : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }},

            //绘制网格
            grid:{
                "top": 80,
                "bottom": 30
            },

            //x轴
            xAxis:{
                type : 'value',
                "position": 'top',
                "splitLine": {
                    lineStyle:{type:'dashed'}}
            },

            //y轴
            yAxis:{
                type : 'category',
                data : [],                       //数据
                "axisLine": {show: false},
                "axisLabel": {show: false},
                "axisTick": {show: false},
                "splitLine": {show: false},

            },
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
    EChartBarNative.prototype ={
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
        getOptionFromConfig:function(config,callback) {
            var that = this;
            if (typeof config.data == "object" && config.data != null) {
                this.getDataFromData(config.data, function (re) {
                    goTo(re);
                    callback && callback();
                });
            } else {
                this.getDataFromConfig(config.url, function (re) {
                    goTo(re);
                    callback && callback();
                });
            }
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
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }

    };

    return EChartBarNative;


});