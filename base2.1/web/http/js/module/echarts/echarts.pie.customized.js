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
    var EchartsPieCustomized = function(){
        this.currentColors = [];

        this.colors = ["#ff7f50", "#87cefa", "#da70d6",
            "#32cd32", "#6495ed", "#ff69b4",
            "#ba55d3", "#cd5c5c", "#ffa500",
            "#40e0d0", "#1e90ff", "#ff6347",
            "#7b68ee", "#00fa9a", "#ffd700",
            "#6699FF", "#ff6666", "#3cb371",
            "#b8860b", "#30e0e0"
        ];
        this.option = {
            backgroundColor: '#2c343c',

            title: {
                text :"2014年4月某企业邮件来源",
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#fff'
                }
            },

            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },

            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series : [
                {
                    name:'访问来源',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:[],
                    roseType: 'angle',
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontStyle:"italic"
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

    };

    /**
     *
     * @type {{}}
     */
    EchartsPieCustomized.prototype = {
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
                    //that.option.legend.data = re.legendData;

                    //获取颜色参数
                    var color = [];
                    var colorLen = that.colors.length;
                    for(var i=0,len=re.seriesData.length;i<len;i++){
                        color.push(that.colors[i%colorLen]);
                    }
                    //保存当前colors
                    that.currentColors = $.extend([],color);
                    that.option.color = color;

                    that.option.series = [
                        {
                            //backgroundColor: '#2c343c',
                            //
                            //title: {
                            //    text: 'Customized Pie',
                            //    left: 'center',
                            //    top: 20,
                            //    textStyle: {
                            //        color: '#ccc'
                            //    }
                            //},
                            //
                            //tooltip : {
                            //    trigger: 'item',
                            //    formatter: "{a} <br/>{b} : {c} ({d}%)"
                            //},
                            //
                            //visualMap: {
                            //    show: false,
                            //    min: 80,
                            //    max: 600,
                            //    inRange: {
                            //        colorLightness: [0, 1]
                            //    }
                            //},

                                    name:'访问来源',
                                    type:'pie',
                                    radius : ['0','55%'],
                                    center: ['50%', '50%'],
                                    data:re.seriesData,
                                    roseType: 'angle',
                                    label: {
                                        normal: {
                                            show:true,
                                            textStyle: {
                                                color: "rgba(255, 255, 255, 0.3)",
                                                fontStyle:"normal"
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            lineStyle: {
                                                color: 'rgba(255, 255, 255, 0.3)'
                                            },
                                            smooth: 0.2,
                                            length: 10,
                                            length2: 20
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: '#c23531',
                                            shadowBlur: 200,
                                            shadowColor: 'rgba(0, 0, 0, 0.5)'
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


    return EchartsPieCustomized;
});