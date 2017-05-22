/**
 * echart 饼图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartPanel = function(){

        this.option = {
            "backgroundColor": '#2c343c',
            tooltip : {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    "name": "",
                    "type":"gauge",
                    "data": []
                }
            ]
        };

    };

    /**
     *
     * @type {{}}
     */
    EChartPanel.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

            if(typeof config.isShowLegend == "boolean" && config.isShowLegend == false){
                that.option.legend.show = false;
            }

            // 基于准备好的dom，初始化echarts图表
            var myChart = common.myECharts.getChart(config.container);
            if(myChart){
                this.getOptionFromConfig(config,function(){
                    //是否设置点击事件
                    if(config.isClick){
                        that.setClickEvent(myChart,config.clickEvent);
                    }
                    if(config.option){
                        that.option = $.extend(true,that.option,config.option || {});
                    }
                    myChart.setOption(that.option);
                });
            }
        },
        //设置点击事件
        setClickEvent:function(myChart,callback){
            var ecConfig = echarts.config;
            myChart.on(ecConfig.EVENT.CLICK, function(param) {
                callback && $.isFunction(callback) && callback(param);
            });
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
                    that.option.series = [
                        {
                            "name":re.seriesName,
                            "startAngle":225,
                            "endAngle":-45,
                            "splitNumber":10,
                            "max":100,
                            "type":"gauge",
                            "radius":"75%",
                            "data":re.seriesData
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
                var legendData = [];

                var seriesName = "";
                var seriesData = [];

                var unit = "";

                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].value)) {
                        seriesData.push({
                            name:data[i].name,
                            value:data[i].value
                        });

                        //数据指标名称
                        legendData.push(data[i].name);
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
                    }//end if (i == 0)
                }

                var re = {
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


    return EChartPanel;
});