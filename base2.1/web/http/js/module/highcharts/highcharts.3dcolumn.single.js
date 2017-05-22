/**
 * highcharts 3d单柱形图
 *
 * Created by lmy 2016/4/10
 */
define(function(require, exports, module) {

    var common = require("./highcharts.common");

    /**
     *
     * @constructor
     */
    var HighCharts3DCoulmn = function(){
        this.option = {
            chart: {
                container:"",
                type: 'column',
                margin: 75,
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    depth: 50,
                    viewDistance: 25
                },
                backgroundColor: {
                    linearGradient: [0, 0,500, 500],
                    stops: [
                        [0, "#ffffff"],
                        [1, "#ffffff"]
                    ]
                },
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            series: [{
                name:"",
                data: [],
                color:""
            }],
            xAxis:{
                categories: [],
                gridLineColor:"#C0C0C0",
                gridLineWidth:1,
                gridLineDashStyle:"",
                labels:{
                    style:{
                        color:"#606060",
                        fontSize:"12px",
                        fontWeight:"bold"

                    }
                }
            },
            yAxis:{
                type: '',
                minorTickInterval: '',
                gridZIndex:1,
                gridLineWidth:1,
                labels:{
                    style:{
                        color:"#606060",
                        fontSize:"12px",
                        fontWeight:"bold"

                    }
                }


            },
            plotOptions:{
                column: {
                    depth: 5,
                    color:"",
                }
            },
            legend:{
                enabled:true,
                align:"center",
                itemStyle: {
                    color: '#000000'
                },
                itemHoverStyle: {
                    color: '#FFF'
                },
                itemHiddenStyle: {
                    color: '#606063'
                }
            },
            credits:{
                enabled:false
            }
        };
    };

    /**
     *
     * @type {{}}
     */
    HighCharts3DCoulmn.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);

            // 基于准备好的dom，初始化highcharts图表
            var myChart = common.myHighCharts.getChart(config.container);
            if(config.container!=null){
                this.getOptionFromConfig(config,function(){
                    if(config.option){
                        that.option = $.extend(true,that.option,config.option || {});
                    }
                    $(function () {
                        $(myChart).highcharts(that.option);
                        //$(myChart).highcharts(common.theme.gray);
                    });
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

                    $.extend(that.option.xAxis,{
                        categories : re.xAxisData
                    });
                    $.extend(that.option.yAxis,{
                        title:{
                            text:re.unit
                        }
                    });
                    $.extend(that.option.series,[
                        {
                             name:re.legendData,
                            "data":re.seriesData

                        }
                    ]);

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
                    seriesData : seriesData,
                    unit : unit
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        },

    };


    return HighCharts3DCoulmn;
});