/**
 * echart地图
 *
 * Created by Linhao on 2015/8/13.
 */
define(function(require, exports, module) {

    var common = require("./echarts.common");

    /**
     *
     * @constructor
     */
    var EChartMap = function(){
        this.option = {
            tooltip: {
                show: true,
                trigger: 'item',
                "axisPointer": {
                    "type": "shadow"
                }
            },
            legend: {
                data:[''],
                orient : 'vertical',
                x : 'left',
                "textStyle": {
                    "fontSize": 12,
                    "fontFamily": "微软雅黑",
                    "color": "#26C0C0",
                    "fontWeight": "bold"
                },
                "selectedMode": true,
                "show": true
            },
            dataRange: {
                min: 0,
                max: 0,
                x: 'left',
                y: 'bottom',
                text:['高','低'], // 文本，默认为数值文本
                calculable : true
            },
            roamController: {
                show: true,
                x: 'right',
                mapTypeControl: {
                    'china': true
                }
            },
            series : [
                {
                    "name":"",
                    type: 'map',
                    mapType:'china',
                    roam: true,
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    "data":[]   //数据
                }
            ]
        };
    };

    /**
     *
     * @type {{}}
     */
    EChartMap.prototype = {
        init:function(config){
            var that = this;
            config = $.extend({},config);
            common.Util.setContainerWidAndHei($("#"+config.container),config.width,config.height);
            //是否不显示图例	
            if(typeof config.isShowLegend == "boolean" && config.isShowLegend === false){
            	that.option.legend.show = false;
            }
            //是否不显示地图控制
            if(typeof config.isShowRoamController == "boolean" && config.isShowRoamController === false){
            	that.option.roamController.show = false;
            }
            
            //是否不显示数据范围控制
            if(typeof config.isShowDataRangeController == "boolean" && config.isShowDataRangeController === false){
            	that.option.dataRange.show = false;
            }
            
            // 基于准备好的dom，初始化echarts图表
            var myChart = common.myECharts.getChart(config.container);
            if(myChart){
                this.getOptionFromConfig(config,function(){
                    /*echarts.registerMap('china',"js/module/map/map.geo.china.config.json");*/
                    //自定义地图
                    if(config.map){
                        //配置自定义地图数据
                        var mapType = config.map.type;

                        //兼容旧省级地图
                        if(config.map.snType && (!config.map.url || config.map.url == "")){
                            var configUrl = SGIS.Config.BASE_MODULE_URL+"js/module/component/china.all.province.config";
                            seajs.use(configUrl,function(ChinaAllProvinceConfig){
                                if(ChinaAllProvinceConfig && ChinaAllProvinceConfig[config.map.snType]){
                                    echarts.util.mapData.params.params[mapType] = {
                                        getGeoJson : function(callback) {
                                            var mapUrl = SGIS.Config.BASE_MODULE_URL
                                                +ChinaAllProvinceConfig[config.map.snType];
                                            common.Ajax.getJsonData(mapUrl,callback);
                                        }
                                    };
                                    that.option.roamController.mapTypeControl = {};
                                    that.option.roamController.mapTypeControl[mapType] = true;
                                    for ( var i = 0,len=that.option.series.length; i < len; i++) {
                                        that.option.series[i].mapType = mapType;
                                    }
                                    renderEcharts();
                                }else{
                                    console && console.log("消息提示：china.all.province.config.js配置未找到地图数据！");
                                }
                            });
                        }else{
                            var mapUrl = SGIS.Config.BASE_MODULE_URL+config.map.url;
                            $.getJSON(mapUrl, function (geoJson) {
                                echarts.registerMap(mapType, geoJson);
                                that.option.roamController.mapTypeControl = {};
                                that.option.roamController.mapTypeControl[mapType] = true;
                                for ( var i = 0,len=that.option.series.length; i < len; i++) {
                                    that.option.series[i].mapType = mapType;
                                }
                                renderEcharts();
                            })
                            /*echarts.util.mapData.params.params[mapType] = {
                                getGeoJson : function(callback) {
                                    var mapUrl = SGIS.Config.BASE_MODULE_URL+config.map.url;
                                    common.Ajax.getJsonData(mapUrl,callback);
                                }
                            };
                            that.option.roamController.mapTypeControl = {};
                            that.option.roamController.mapTypeControl[mapType] = true;
                            for ( var i = 0,len=that.option.series.length; i < len; i++) {
                                that.option.series[i].mapType = mapType;
                            }
                            renderEcharts();*/
                        }
                    }else{
                        var url= SGIS.Config.BASE_MODULE_URL+"js/module/map/map.geo.china.config.json"
                        $.get(url, function (geoJson) {
                            echarts.registerMap('china', geoJson);
                            renderEcharts();
                        })
                    }//end if(config.map)

                    function renderEcharts(){
                        //外部option
                        if(config.option){
                            that.option = $.extend(true,that.option,config.option || {});
                        }
                        myChart.setOption(that.option);

                    }
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
                    //加上单位
                    if(re.legendData instanceof Array){
                        var llLen=re.legendData.length;
                        for(var ll= 0;ll<llLen;ll++){
                            re.legendData[ll] = re.legendData[ll]+re.unit;
                        }
                        if(llLen>0){
                            re.seriesName = re.seriesName+re.unit;
                        }
                    }//end if(re.legendData instanceof Array)

                    that.option.legend.data = re.legendData;
                    
                    //最大值，最小值
                    that.option.dataRange.max = re.max;
                    that.option.dataRange.min = re.min;
                    
                    that.option.series = [
                        {
                            "name":re.seriesName,
                            "type": 'map',
                            "mapType": 'china',
                            "roam": true,
                            "data":re.seriesData,
                            "itemStyle" : {
                                normal : {
                                    label : {
                                        show : true,	//显示指标文字
                                        textStyle : {
                                            fontSize : '12',
                                            fontWeight : 'bold',
                                            "fontFamily": "微软雅黑"
                                        }
                                    },
                                	color:"#CDC9C9",
                                    labelLine : {
                                        show : true	//显示指标线
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '13',
                                            fontWeight : 'bold',
                                            "fontFamily": "微软雅黑",
                                            "color": "#26C0C0"
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
                var legendData = [];

                var seriesName = "";
                var seriesData = [];

                var unit = "";
                var max = 0;
                var min = 0;
                
                var regex = /\([^\)]+\)/g;
                for (var i = 0; i < data.length; i++) {
                    if (!isNaN(data[i].value)) {
                        seriesData.push({
                        	name:data[i].name,
                        	value:data[i].value
                        });
                        
                        if(data[i].value > max){
                        	max = data[i].value;
                        }else if(data[i].value < min){
                        	min = data[i].value;
                        }
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
                    legendData : legendData,
                    seriesName : seriesName,
                    seriesData : seriesData,
                    unit : unit,
                    max:max,
                    min:min
                };
                callback && callback(re);
            }else{
                callback && callback(null);
            }
        }
    };


    return EChartMap;
});