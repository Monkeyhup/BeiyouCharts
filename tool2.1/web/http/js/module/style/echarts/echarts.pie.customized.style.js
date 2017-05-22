/**
 * echart嵌套饼图样式调整
 *
 * Created by Linhao on 2015/9/14.
 */
define(function(require, exports, module) {

    var templateHtml = require("js/module/style/echarts/echarts.pie.customized.html.tpl");
    /**
     *
     */
    var EChartPieSingleStyle = (function(){
        var _isInit = false;
        var _style = {};
        var _container = {};

        /**
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
                        objConfig["option"] = _style = $.extend(true,_style,{
                            "backgroundColor":color
                        });
                        chartObj.init(objConfig);
                    });

                    //小圆饼半径(内边框)
                    $("#chart-inner-pie-r-inner-range").change(function(){
                        var innerR1 = $(this).val();
                        var innerR2 = $("#chart-inner-pie-r-outter-range").val();

                        //设置值
                        $("#chart-inner-pie-r-inner-text").val(innerR1);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    radius : [innerR1+'%', innerR2+'%']
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //小圆饼半径(外边框)
                    $("#chart-inner-pie-r-outter-range").change(function(){
                        var innerR1 = $("#chart-inner-pie-r-inner-range").val();
                        var innerR2 = $(this).val();

                        //设置值
                        $("#chart-inner-pie-r-outter-text").val(innerR2);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    radius : [innerR1+'%', innerR2+'%']
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //pie顏色修改
                    $("#chart-PieColor-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                itemStyle: {
                                    normal: {
                                        color: color
                                            }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //是否显示标签
                    $("#chart-show-label-check").change(function(){
                        var isShow = $(this).is(":checked");

                        //控制是否可以修改
                        $("#chart-font-color-select").attr("disabled",!isShow);
                        $("#chart-font-size-range").attr("disabled",!isShow);

                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    label: {
                                        normal: {
                                            show: isShow
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });
                    //选择阴影大小
                    $("#chart-shadow-range").change(function(){
                        var size = $(this).val();

                        //设置值
                        $("#chart-shadow-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    itemStyle: {
                                        normal: {
                                            shadowBlur: size,
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //选择字体大小
                    $("#chart-font-size-range").change(function(){
                        var size = $(this).val();

                        //设置值
                        $("#chart-font-size-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    label: {
                                        normal: {
                                            textStyle:{
                                                fontSize:size
                                            }
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });
                    //字体颜色
                    $("#chart-textColor-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    label: {
                                        normal: {
                                            textStyle:{
                                                color:color
                                            }
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });
                    //选择字体样式
                    $("input[name='chart-font-style']").click(function(){
                        var style = $(this).val();

                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:[
                                {
                                    label: {
                                        normal: {
                                            textStyle:{
                                                fontStyle:style
                                            }
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
            if(_style.backgroundColor) {
                var pieCustomStyle = $.extend(true,{},{
                    backgroundColor: null //背景颜色
                },{
                    backgroundColor:_style.backgroundColor || []
                });

                var pieCustomStyleBackgroundColor = pieCustomStyle.backgroundColor;
                if(pieCustomStyleBackgroundColor != null) {
                    $("#chart-backgroundColor-select").attr("value",pieCustomStyleBackgroundColor).val(pieCustomStyleBackgroundColor);
                    var $pieCustomStyleBackgroundColorParent =  $("#chart-backgroundColor-select").parent("div");
                    $pieCustomStyleBackgroundColorParent.html($pieCustomStyleBackgroundColorParent.html());
                    //保证控件刷新
                }
            }
            var series = _style.series;
            if(series && series[0]){
                //样式
                var seriesStyle= $.extend(true,{},{series:[
                    {
                        "radius": [null,null], //内外半径
                        label: {
                            normal: {
                                show:true,  //是否显示标签
                                textStyle: {
                                    fontSize: -1, //标签字体大小
                                    fontStyle:null,  //字体风格
                                    color:null    //字体颜色
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: null, //饼系列颜色
                                shadowBlur:-1   //阴影大小
                            }
                        }
                    }
                ]},{
                    series:series
                });
                //标签是否显示
                if(seriesStyle.series[0].label.normal.show === false){
                    $("#chart-show-label-check").attr("checked",false);
                    //控制是否可以修改
                    $("#chart-font-size-range").attr("disabled",true);
                }
                //字体大小
                var seriesStyleFontSize = seriesStyle.series[0].label.normal.textStyle.fontSize;
                if(seriesStyleFontSize > -1){
                    $("#chart-font-size-range").attr("value",seriesStyleFontSize).val(seriesStyleFontSize);
                    $("#chart-font-size-text").attr("value",seriesStyleFontSize).val(seriesStyleFontSize);
                }
                //阴影大小
                var shadowSize = seriesStyle.series[0].itemStyle.normal.shadowBlur;
                if(shadowSize > -1){
                    $("#chart-shadow-range").attr("value",shadowSize).val(shadowSize);
                    $("#chart-shadow-text").attr("value",shadowSize).val(shadowSize);
                }
                //字体颜色
                var textColor = seriesStyle.series[0].label.normal.textStyle.color;
                if(textColor != null){
                    $("#chart-textColor-select").attr("value",textColor).val(textColor);
                    var $colorParent =  $("#chart-textColor-select").parent("div");
                    //保证控件刷新
                    $colorParent.html($colorParent.html());
                }
                //字体风格
                var textStyle = seriesStyle.series[0].label.normal.textStyle.fontStyle;
                if(textStyle != null){
                    var radioId = "chart-font-style-radio-";
                    switch(textStyle){
                        case "normal":
                            radioId = radioId + "1";
                            break;
                        case "italic":
                            radioId = radioId + "2";
                            break;
                        case "oblique":
                            radioId = radioId + "3";
                            break;
                    }
                    $("input[name='chart-font-style']").removeAttr("checked");
                    $("input#"+radioId).attr("checked",true);
                    var $span = $("input#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                }
                //饼系列颜色
                var seriesStyleColor = seriesStyle.series[0].itemStyle.normal.color;
                if(seriesStyleColor != null){
                    $("#chart-PieColor-select").attr("value",seriesStyleColor).val(seriesStyleColor);
                    var $seriesStyleColoParent =  $("#chart-PieColor-select").parent("div");
                    //保证控件刷新
                    $seriesStyleColoParent.html($seriesStyleColoParent.html());
                }
                //内外半径
                var radius = seriesStyle.series[0].radius;
                if(radius[0] != null){
                    var r = radius[0];
                    if(typeof r == "string"){
                        r = r.replace("%","");
                    }
                    $("#chart-inner-pie-r-inner-range").attr("value",r).val(r);
                    $("#chart-inner-pie-r-inner-text").attr("value",r).val(r);
                }
                if(radius[1] != null){
                    var r = radius[1];
                    if(typeof r == "string"){
                        r = r.replace("%","");
                    }
                    $("#chart-inner-pie-r-outter-range").attr("value",r).val(r);
                    $("#chart-inner-pie-r-outter-text").attr("value",r).val(r);
                }
            }

        };

        return {
            init:init,
            getStyle:getStyle,
            getContainer:getContainer,
            setHeight:setHeight
            //reBindColorSelect:reBindColorSelect
        };
    })();


    return EChartPieSingleStyle;
});