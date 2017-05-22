/**
 * echart水球图样式调整
 *
 * Created by lmy on 2017/3/7.
 */
define(function(require, exports, module) {

    var templateHtml = require("js/module/style/echarts/echarts.liquid.html.tpl");

    /**
     *
     */
    var EChartLineSingleStyle = (function(){
        var _isInit = false;
        var _style = {};
        var _container = {};

        /*
         * 初始化数据
         * @param currentHanlder
         * 			当前处理的对象（chart.echarts.js
         * 			或者chart.echarts.edit.js的对象）
         * @param chartParam
         * 			当为图编辑时传入的初始化参数，新建时为null
         * @param callback
         * 			回调方法
         */
        var init = function(currentHanlder,chartParam,callback){
            if(_isInit){
                callback && callback();
                return
            }
            _style = {};
            _container = {};

            //添加内容
            $("#param-pane").html("").append($(templateHtml));
            //初始化样式参数时必须放在【添加内容】后面
            if(chartParam != null){
                //设置参数并初始化数据
                setChartParam(chartParam);
            }

            _isInit = true;
            initEventBind(currentHanlder,callback);
        };

        /**
         * 初始化绑定事件
         * @param currentHanlder
         * @param callback
         */
        var initEventBind = function(currentHanlder,callback){
            if(currentHanlder && currentHanlder != null){
                eventBind(currentHanlder,callback);
            }else{
                //默认选择（chart.echarts）
                seajs.use("chart.echarts",function(hanlder){
                    eventBind(hanlder,callback);
                });
            }
        };

        /**
         * 绑定事件
         * @param hanlder
         * @param callback
         */
        var eventBind = function(hanlder,callback){
            if(hanlder){
                var chartObj = hanlder.getChartObj();
                var objConfig = hanlder.getChartConfig();


                if(chartObj && objConfig){
                    //修改图的高度
                    $("#chart-chart-height-range").change(function(){
                        var height = $(this).val();
                        //设置值
                        $("#chart-chart-height-text").val(height);

                        _container["height"] = height;
                        objConfig["height"] = height;
                        chartObj.init(objConfig);
                    });

                    //背景颜色
                    $("#chart-backgroundColor-select").change(function(){
                        var color = $(this).val();
                        //注意：修改折线颜色，文字颜色也被改
                        $("#chart-backgroundColor-select").val(color);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[{
                                "backgroundStyle": {
                                    "color": color
                                }
                            }]
                        });
                        chartObj.init(objConfig);
                    });

                    //内边框宽度
                    $("#chart-border-range").change(function(){
                        var width = $(this).val();
                        $("#chart-border-text").val(width);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "backgroundStyle": {
                                        "borderWidth": width
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //内边框颜色
                    $("#chart-borderColor-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "backgroundStyle": {
                                        "borderColor": color
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //内边框阴影宽度
                    $("#chart-inner-shadowborder-range").change(function(){
                        var width = $(this).val();
                        $("#chart-inner-shadowborder-text").val(width);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "backgroundStyle": {
                                        "shadowBlur": width
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //内边框阴影颜色
                    $("#chart-inner-shadowColor-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "backgroundStyle": {
                                        "shadowColor": color
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //外边框宽度
                    $("#chart-out-border-range").change(function(){
                        var width = $(this).val();
                        $("#chart-out-border-text").val(width);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "outline": {
                                        "itemStyle": {
                                            "borderWidth" : width
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //外边框颜色
                    $("#chart-out-borderColor-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "outline": {
                                        "itemStyle": {
                                            "borderColor" : color
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //外边框阴影宽度
                    $("#chart-outter-shadowborder-range").change(function(){
                        var width = $(this).val();
                        $("#chart-outter-shadowborder-text").val(width);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "outline": {
                                        "itemStyle": {
                                            "shadowBlur" : width
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //外边框阴影颜色
                    $("#chart-outter-shadowColor-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "outline": {
                                        "itemStyle": {
                                            "shadowColor" : color
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });


                    //改变标题
                    $("input[id='chart-name']").change(function(){
                        var val=$(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            "title" :{
                                text : val
                            }
                        })
                        chartObj.init(objConfig);

                    })

                    //圆半径
                    $("#chart-radius-range").change(function(){
                        var width = $(this).val();
                        $("#chart-radius-text").val(width);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "radius": width + "%"
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //波纹是否摆动
                    $("#chart-rock-check").change(function(){
                        var isRock=$(this).is(":checked");;
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "waveAnimation": isRock
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //波浪弧度
                    $("#chart-radian-range").change(function(){
                        var radian = $(this).val();
                        $("#chart-radian-text").val(radian);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    "amplitude": radian
                                }
                            ]
                        });
                        chartObj.init(objConfig);

                    });

                    //波浪1颜色
                    $("#chart-wave1-select").change(function(){
                        var color = $(this).val();
                        var color2 = $("#chart-wave2-select").val();
                        var color3 = $("#chart-wave3-select").val();
                        var color4 = $("#chart-wave4-select").val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series : [
                                {
                                    color :　[color,color2,color3,color4]
                                }
                            ]

                        });
                        chartObj.init(objConfig);
                    });
                    //波浪2颜色
                    $("#chart-wave2-select").change(function(){
                        var color1 = $("#chart-wave1-select").val();
                        var color = $(this).val();
                        var color3 = $("#chart-wave3-select").val();
                        var color4 = $("#chart-wave4-select").val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series : [
                                {
                                    color :　[color1,color,color3,color4]
                                }
                            ]

                        });
                        chartObj.init(objConfig);
                    });
                    //波浪3颜色
                    $("#chart-wave3-select").change(function(){
                        var color = $(this).val();
                        var color2 = $("#chart-wave2-select").val();
                        var color1 = $("#chart-wave1-select").val();
                        var color4 = $("#chart-wave4-select").val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series : [
                                {
                                    color :　[color1,color2,color,color4]
                                }
                            ]

                        });
                        chartObj.init(objConfig);
                    });
                    //波浪4颜色
                    $("#chart-wave4-select").change(function(){
                        var color = $(this).val();
                        var color2 = $("#chart-wave2-select").val();
                        var color3 = $("#chart-wave3-select").val();
                        var color1 = $("#chart-wave1-select").val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series : [
                                {
                                    color :　[color1,color2,color3,color]
                                }
                            ]

                        });
                        chartObj.init(objConfig);
                    });
                }//end if(chartObj && objConfig)
            }//end if(hanlder)

            callback && callback();
        };

        /**
         * 取得style
         */
        var getStyle = function(){
            return _style;
        };

        /**
         * 取得container
         */
        var getContainer = function(){
            return _container;
        };

        /**
         * 设置高度
         * @param height
         */
        var setHeight = function(height){
            if(height && height > 0){
                _container["height"] = height;
            }
        };

        /**
         * 设置参数（编辑时使用）
         *
         * @param chartParam
         * 			设置参数
         */
        var setChartParam = function(chartParam){
            if(chartParam && typeof chartParam == "object"){
                if(chartParam.container){
                    _container = $.extend(true,_container || {},chartParam.container);
                }

                if(chartParam.style){
                    _style = $.extend(true,_style || {},chartParam.style);
                }
            }

            //初始化控件的值
            initControlStyle();
        };

        /**
         * 初始化控件的值（编辑时使用）
         */
        var initControlStyle = function(){
            var series = _style.series;
            if(series && series[0]){
                var seriesStyle= $.extend(true,{},{series:[
                    {
                        "amplitude": "10%",
                        "waveAnimation": true,
                        "center": ['50%', '60%'],
                        "radius": '70%',
                        "color" : ["#2A4887","#1255A6","#1A84CA","#42B8F9"],
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
                ]},{
                    series:series
                });

                //背景颜色
                var groundColor = seriesStyle.series[0].backgroundStyle.color;
                if(groundColor != null){
                        $("#chart-backgroundColor-select").attr("value",groundColor);
                    }


                //内边框宽度
                var innerBorderWidth = seriesStyle.series[0].backgroundStyle.borderWidth;
                if (innerBorderWidth != null) {
                        $("#chart-border-range").attr("value",innerBorderWidth);
                        $("#chart-border-text").attr("value",innerBorderWidth);
                    }


                // 内边框颜色
                var innerBorderColor = seriesStyle.series[0].backgroundStyle.borderColor;
                if (innerBorderColor != null) {
                        $("#chart-borderColor-select").attr("value",innerBorderColor);
                    }




                //内边框阴影宽度
                var innerShadowWidth = seriesStyle.series[0].backgroundStyle.shadowBlur;
                if (innerShadowWidth != null) {
                        $("#chart-inner-shadowborder-range").attr("value",innerShadowWidth);
                        $("#chart-inner-shadowborder-text").attr("value",innerShadowWidth);
                    }



                //内边框阴影颜色
                var innerShadowColor = seriesStyle.series[0].backgroundStyle.shadowColor;
                if (innerShadowColor != null) {
                        $("#chart-inner-shadowColor-select").attr("value",innerShadowColor);
                    }



                //外边框宽度
                var outterBorderWidth = seriesStyle.series[0].outline.itemStyle.borderWidth;
                if (outterBorderWidth != null) {
                    $("#chart-out-border-range").attr("value",outterBorderWidth);
                    $("#chart-out-border-text").attr("value",outterBorderWidth);
                }

                // 外边框颜色
                var outterBorderColor = seriesStyle.series[0].outline.itemStyle.borderColor;
                if (outterBorderColor != null) {
                    $("#chart-out-borderColor-select").attr("value",outterBorderColor);
                }

                // 外边框阴影宽度
                var outterShadowWidth = seriesStyle.series[0].outline.itemStyle.shadowBlur;
                if (outterShadowWidth != null) {
                    $("#chart-outter-shadowborder-range").attr("value",outterShadowWidth);
                    $("#chart-outter-shadowborder-text").attr("value",outterShadowWidth);
                }

                // 外边框阴影颜色
                var outterShadowColor = seriesStyle.series[0].outline.itemStyle.shadowColor;
                if (outterShadowColor != null) {
                    $("#chart-outter-shadowColor-select").attr("value",outterShadowColor);
                }

                //半径大小
                var radius = seriesStyle.series[0].radius;
                if (radius != null){
                    $("#chart-radius-range").attr("value",radius);
                    $("#chart-radius-text").attr("value" , radius.split("%")[0]) ;
                }
                //波纹是否摆动
                var isRock = seriesStyle.series[0].waveAnimation;
                if(isRock != null){
                    $("#chart-rock-check").attr("checked",isRock);

                }

                //波浪1颜色
                var wave1Color = seriesStyle.series[0].color[0];
                if(wave1Color != null){
                    $("#chart-wave1-select").attr("value",wave1Color);

                }
                //波浪2颜色
                var wave2Color = seriesStyle.series[0].color[1];
                if(wave1Color != null){
                    $("#chart-wave2-select").attr("value",wave2Color);

                }
                //波浪3颜色
                var wave3Color = seriesStyle.series[0].color[2];
                if(wave3Color != null){
                    $("#chart-wave3-select").attr("value",wave3Color);

                }
                //波浪4颜色
                var wave4Color = seriesStyle.series[0].color[3];
                if(wave4Color != null){
                    $("#chart-wave4-select").attr("value",wave4Color);

                }



            }//end if(series && series[0])



        };

        return {
            init:init,
            getStyle:getStyle,
            getContainer:getContainer,
            setHeight:setHeight
        };
    })();


    return EChartLineSingleStyle;
});