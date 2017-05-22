/**
 * echart水球图
 *
 * Created by lmy on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");
    var secondWive;
    var thirdWive;
    var forthWive;

    /**
     *
     * @constructor
     */
    var EChartLiquid = function(){
        this.option = {
            title:{
                show: true,
                top:"10%",
                text : ''


            },
            series : [
                {
                    "name":"",
                    "type":"liquidFill",
                    "data":[],   //数据
                    "color" : ["#2A4887","#1255A6","#1A84CA","#42B8F9"],
                    "backgroundStyle" : {
                        color : "#E3F7FF"
                    }
                }
            ],


        };
    };

    /**
     *
     * @type {{}}
     */
    EChartLiquid.prototype = {
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
                    var redata=re.seriesName;
                        secondWive=redata-0.1;
                        thirdWive=secondWive-0.1;
                        forthWive=thirdWive-0.1;

                    that.option.title={
                        show: true,
                        text : "城乡居民收入倍差" ,
                        left : "center",
                        "top" : "20"
                    }
                    that.option.series = [
                        {

                            "type" : "liquidFill",
                            "data" : [redata,secondWive,thirdWive,forthWive],
                            "amplitude": "10%",
                            "waveAnimation": true,
                            "center": ['50%', '60%'],
                            "radius": '70%',
                            "outline": {
                                show: true,
                                itemStyle : {color: 'none',
                                    borderColor: '#294D99',
                                    borderWidth: 8,
                                    shadowBlur: 50
                                }
                            },
                            "backgroundStyle": {
                                color : "#E3F7FF",
                                borderColor: '#156ACF',
                                borderWidth: 1,
                                shadowColor: '#D1D1D1',
                                shadowBlur: 20
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
        }
    };


    return EChartLiquid;
});