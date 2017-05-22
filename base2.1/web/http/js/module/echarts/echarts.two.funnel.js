/**
 * echart双漏斗图
 *
 * Created by HWLUO on 2016/05/07
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartTwoFunnel = function(){
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
            tooltip: {
                show: true,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
            },
            title:{
              "text" : "不同手机品牌每月预期销量与实际销量对比",
              "left":"center",
              "top":"-10px",
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
                "top":"30px"
            },
            series: [
                {
                    "name":"",
                    "type":"funnel",
                    "left": '10%',
                    "width": '80%',
                    "data":[]
                }
            ]
        };

    };

    /**
     *
     * @type {{}}
     */
    EChartTwoFunnel.prototype = {
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

                    //获取颜色参数
                    var color = [];
                    var colorLen = that.colors.length;
                    for(var i=0,len=2*(re.seriesData1.length);i<len;i++){
                        color.push(that.colors[i%colorLen]);
                    }
                    //保存当前colors
                    that.currentColors = $.extend([],color);
                    that.option.color = color;

                    that.option.series = [

                        {
                            "name":re.seriesName[0],
                            "type":"funnel",
                            "left": '10%',
                            "width": '80%',
                            "data":re.seriesData1,
                            "label":{
                                "normal":{
                                    formatter:'{b}',
                                    "textStyle":{
                                        "color":'#FF7F50'
                                    }
                                }
                            },
                            "labelLine":{
                                "normal":{
                                    show:false
                                }
                            },
                            "itemStyle" : {
                                "normal": {
                                    "opacity": 0.7
                                }
                            }
                        },
                        {
                            "name":re.seriesName[1],
                            "type":"funnel",
                            "left": '10%',
                            "width": '80%',
                            "maxSize": '80%',
                            "label":{
                                "normal":{
                                    "position":'inside',
                                    formatter:'{c}',
                                    "textStyle":{
                                        "color":'#ffffff'
                                    }
                                }
                            },
                            "itemStyle" : {
                                "normal": {
                                    "opacity": 0.5,
                                    "borderColor":'#fff',
                                    "borderWidth":2
                                }
                            },
                            "data":re.seriesData2
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
            if(data && data != null && data[0]){
                var data2 = data[0].name;
                var legendData = [];

                var seriesName = [];
                var seriesData1 = [];
                var seriesData2 = [];

                var unit = "";
                var rowData = data2[0];


                var regex = /\([^\)]+\)/g;
                for(var j=1;j < rowData.length;j++ ) {
                    seriesName[j-1] = data2[0][j] || "";
                    if(j==1)
                        var v = regex.exec(seriesName[j-1]);
                    if(v && v[0]){
                        unit = v[0];
                        seriesName[j-1] = seriesName[j-1].split(v)[0] || "";
                    }
                }
                for(var j=1;j<rowData.length;j++) {
                    for(var i=1;i<data2.length;i++) {
                        if(j==1)
                            if (!isNaN(data2[i][j])) {
                                seriesData1.push({
                                    value:data2[i][j],
                                    name:data2[i][0]
                                    });
                                legendData.push(
                                    data2[i][0]
                                );
                            }
                        if(j==2)
                            if (!isNaN(data2[i][j])) {
                                seriesData2.push({
                                    value:data2[i][j],
                                    name:data2[i][0]

                                });
                            }

                    }
                }

                var re = {
                    legendData : legendData,
                    seriesName : seriesName,
                    seriesData1 : seriesData1,
                    seriesData2 : seriesData2
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartTwoFunnel;
});