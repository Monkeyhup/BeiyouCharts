/**
 * echart多柱形折线图样式调整
 * Created by lmy on 2017/3/17.
 */
define(function(require, exports, module) {

    var templateHtml = require("js/module/style/echarts/echarts.nbars.line.html.tpl");
    var inputHtml = "<input type=\"color\" class=\"form-control\" style=\"width:45px;\" value=\"#26C0C0\" />";

    /**
     *
     */
    var EChartBarLineStyle = (function(){
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
         * 重新绑定颜色选择
         */
        var reBindColorSelect = function(chartObj,objConfig){
            if(!chartObj || !objConfig){
                return ;
            }

            $("#chart-bar-color-container").html("");
            //添加饼的颜色
            var currentColors = $.extend([],chartObj.currentColors || []);
            var colorsLength = currentColors.length-1;

            //若已经修改过配色，直接显示配色的
            if(_style.color && _style.color.length > 0){
                //表示没有新增数据
                if(_style.color.length >= colorsLength){
                    //修改数据长度
                    _style.color.length = colorsLength;
                    for(var c=0,cLen=colorsLength;c<cLen;c++){
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-bar-color-select-"+c).val(_style.color[c])
                            .appendTo($("#chart-bar-color-container"));
                    }
                }else{
                    //有新增的数据
                    for(var d=0,dLen=_style.color.length;d<dLen;d++){
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-bar-color-select-"+d).val(_style.color[d])
                            .appendTo($("#chart-bar-color-container"));
                    }

                    var index = _style.color.length;
                    for(var e=index,eLen=colorsLength;e<eLen;e++){
                        //添加新的颜色
                        var cc = currentColors[e%colorsLength];
                        //添加新的颜色
                        $(inputHtml).attr("id","chart-bar-color-select-"+e).val(cc)
                            .appendTo($("#chart-bar-color-container"));
                        //添加新的
                        _style.color.push(cc);
                    }
                }
            }else{
                for(var i = 0; i<colorsLength;i++){
                    //添加新的颜色
                    $(inputHtml).attr("id","chart-bar-color-select-"+i).val(currentColors[i])
                        .appendTo($("#chart-bar-color-container"));
                }
            }//end if(_style.color && _style.color.length > 0) else

            //动态绑定柱颜色
            $("#chart-bar-color-container").off("change",">input");
            $("#chart-bar-color-container").on("change",">input",function(){

                var colorArr = [];
                //找到所有的颜色
                var $inputs = $("#chart-bar-color-container").find(">input");
                $inputs.each(function(i,o){
                    var c = $(o).val();
                    if(c && c != ""){
                        colorArr.push($(o).val());
                    }
                });
                var lineColor = $("#chart-line-color-select").val();
                colorArr.push(lineColor);
                objConfig["option"] = _style = $.extend(true,_style,{
                    color:colorArr
                });
                chartObj.init(objConfig);
            });

            //折线颜色
            $("#chart-line-color-select").change(function(){
                var colorArr = [];
                //找到所有的颜色
                var $inputs = $("#chart-bar-color-container").find(">input");
                $inputs.each(function(i,o){
                    var c = $(o).val();
                    if(c && c != ""){
                        colorArr.push($(o).val());
                    }
                });
                var lineColor = $(this).val();
                colorArr.push(lineColor);
                objConfig["option"] = _style = $.extend(true,_style,{
                    color:colorArr
                });
                chartObj.init(objConfig);
            });

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
                var datalen = chartObj.currentColors.length;
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

                    //是否显示图列
                    $("#chart-show-legend-check").change(function(){
                        var isShow = $(this).is(":checked");
                        //控制是否可以修改图例文字颜色
                        $("#chart-legend-color-select").attr("disabled",!isShow);

                        objConfig["option"] = _style = $.extend(true,_style,{
                            legend:{
                                show:isShow
                            }
                        });
                        chartObj.init(objConfig);
                    });

                    //图列颜色
                    $("#chart-legend-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            "legend":{
                                "textStyle":{
                                    "color":color
                                }
                            }
                        });
                        chartObj.init(objConfig);
                    });


                    //重新绑定柱的颜色选择
                    reBindColorSelect(chartObj,objConfig);



                    //选择上边框倒角大小
                    $("#chart-bar-top-border-radius-range").change(function(){
                        var size = $(this).val();
                        size = parseInt(size);

                        var bottomSize = $("#chart-bar-bottom-border-radius-range").val();
                        bottomSize = parseInt(bottomSize);

                        //设置值
                        $("#chart-bar-top-border-radius-text").val(size);

                        var setSize=[];
                        for(var i = 0; i < datalen-1; i++){
                            setSize.push(
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "barBorderRadius": [size, size, bottomSize, bottomSize]
                                        }
                                    }
                                }
                            )
                        }


                        objConfig["option"] = _style = $.extend(true,_style,{series:setSize});
                        chartObj.init(objConfig);
                    });

                    //选择下边框倒角大小
                    $("#chart-bar-bottom-border-radius-range").change(function(){
                        var size = $(this).val();
                        size = parseInt(size);

                        var topSize = $("#chart-bar-top-border-radius-range").val();
                        topSize = parseInt(topSize);

                        //设置值
                        $("#chart-bar-bottom-border-radius-text").val(size);
                        var setSize=[];
                        for(var i = 0; i < datalen-1; i++){
                            setSize.push(
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "barBorderRadius": [topSize,topSize,size,size]
                                        }
                                    }
                                }
                            )
                        }


                        objConfig["option"] = _style = $.extend(true,_style,{series:setSize});
                        chartObj.init(objConfig);
                    });

                    //（柱）是否显示文字
                    $("#chart-bar-show-label-check").change(function(){
                        var isShow = $(this).is(":checked");

                        //控制是否可以修改
                        $("#chart-bar-font-color-select").attr("disabled",!isShow);
                        $("#chart-bar-font-size-range").attr("disabled",!isShow);
                        $("input[name='chart-bar-font-position-radio']").attr("disabled",!isShow);
                        var setIsShow=[];
                        for(var i = 0; i < datalen-1; i++){
                            setIsShow.push(
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "label": {
                                                "show":isShow
                                            }
                                        }
                                    }
                                }
                            )
                        }


                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setIsShow
                        });
                        chartObj.init(objConfig);
                    });


                    //（柱）选择字体大小
                    $("#chart-bar-font-size-range").change(function(){
                        var size = $(this).val();

                        var setSize=[];
                        for(var i = 0; i < datalen-1; i++){
                            setSize.push(
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "label": {
                                                "textStyle": {
                                                    "fontSize": size
                                                }
                                            }
                                        }
                                    }
                                }
                            )
                        }
                        //设置值
                        $("#chart-bar-font-size-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setSize
                        });
                        chartObj.init(objConfig);
                    });

                    //（柱）选择字体位置
                    $("input[name='chart-bar-font-position-radio']").click(function(){
                        var position = $(this).val();

                        var setPosition=[];
                        for(var i = 0; i < datalen-1; i++){
                            setPosition.push(
                                {
                                    "itemStyle": {
                                        "normal": {
                                            "label": {
                                                "position": position
                                            }
                                        }
                                    }
                                }
                            )
                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setPosition
                        });
                        chartObj.init(objConfig);
                    });


                    //折线是否为平滑曲线
                    $("#chart-show-smooth-check").change(function(){
                        var isShow = $(this).is(":checked");

                        var setIsShow = [];
                        for(var i = 0; i < datalen; i++){
                            if(i<datalen-1){
                                setIsShow.push({});
                            }else{
                                setIsShow.push(
                                    {
                                        smooth:isShow
                                    }
                                )
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setIsShow
                        });
                        chartObj.init(objConfig);
                    });

                    //折线宽度
                    $("#chart-line-width-range").change(function(){
                        var width = $(this).val();
                        $("#chart-line-width-text").val(width);

                        var setWidth = [];
                        for(var i = 0; i < datalen; i++){
                            if(i<datalen-1){
                                setWidth.push({});
                            }else{
                                setWidth.push(
                                    {
                                        "itemStyle": {
                                            "normal": {
                                                "lineStyle": {
                                                    width:width
                                                }
                                            }
                                        }
                                    }
                                )
                            }

                        }
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setWidth
                        });
                        chartObj.init(objConfig);
                    });

                    //(折线)是否显示文字
                    $("#chart-line-show-label-check").change(function(){
                        var isShow = $(this).is(":checked");

                        //控制是否可以修改
                        $("#chart-line-font-color-select").attr("disabled",!isShow);
                        $("#chart-line-font-size-range").attr("disabled",!isShow);
                        $("input[name='chart-line-font-position-radio']").attr("disabled",!isShow);

                        var setFontIsshow = [];
                        for(var i = 0; i < datalen; i++){
                            if(i<datalen-1){
                                setFontIsshow.push({});
                            }else{
                                setFontIsshow.push(
                                    {
                                        "itemStyle": {
                                            "normal": {
                                                "label": {
                                                    "show":isShow
                                                }
                                            }
                                        }
                                    }
                                )
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setFontIsshow
                        });
                        chartObj.init(objConfig);
                    });

                    //(折线)选择字体大小
                    $("#chart-line-font-size-range").change(function(){
                        var size = $(this).val();

                        var setFontSize = [];
                        for(var i = 0; i < datalen; i++){
                            if(i<datalen-1){
                                setFontSize.push({});
                            }else{
                                setFontSize.push(
                                    {
                                        "itemStyle": {
                                            "normal": {
                                                "label": {
                                                    "textStyle": {
                                                        "fontSize": size
                                                    }
                                                }
                                            }
                                        }
                                    }
                                )
                            }

                        }

                        //设置值
                        $("#chart-line-font-size-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setFontSize
                        });
                        chartObj.init(objConfig);
                    });

                    //(折线)选择字体位置
                    $("input[name='chart-line-font-position-radio']").click(function(){
                        var position = $(this).val();
                        var setFontPosition = [];
                        for(var i = 0; i < datalen; i++){
                            if(i<datalen-1){
                                setFontPosition.push({});
                            }else{
                                setFontPosition.push(
                                    {
                                        "itemStyle": {
                                            "normal": {
                                                "label": {
                                                    "position": position
                                                }
                                            }
                                        }
                                    }
                                )
                            }

                        }
                        objConfig["option"] = _style = $.extend(true,_style,{
                            series:setFontPosition
                        });
                        chartObj.init(objConfig);
                    });

                    //x轴位置
                    $("input[name='chart-x-position-radio']").click(function(){
                        var position = $(this).val();

                        objConfig["option"] = _style = $.extend(true,_style,{
                            xAxis: [
                                {
                                    position: position
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //x轴颜色
                    $("#chart-x-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            xAxis : [
                                {
                                    "axisLine": {
                                        "lineStyle": {
                                            "color": color
                                        }
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //x轴字体颜色
                    $("#chart-x-font-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            xAxis : [
                                {
                                    "axisLabel": {
                                        "textStyle": {
                                            "color": color
                                        }
                                    },
                                    "nameTextStyle": {
                                        "color": color
                                    },
                                    "isShowXAxisText" : true
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //x轴字体大小
                    $("#chart-x-font-size-range").change(function(){
                        var size = $(this).val();

                        //设置值
                        $("#chart-x-font-size-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            xAxis : [
                                {
                                    "axisLabel": {
                                        "textStyle": {
                                            "fontSize": size
                                        }
                                    },
                                    "nameTextStyle": {
                                        "fontSize": size
                                    },
                                    "isShowXAxisText" : true
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });


                    //y轴位置
                    $("#chart-y-position-check").change(function(){
                        var isCheck = $(this).is(":checked");

                        var setIsYcheck = [];
                        for(var i = 0; i < datalen; i++){
                            if(i == 0){
                                setIsYcheck.push({
                                    position: isCheck ? "right" : "left"
                                });
                            }else if(i == datalen-1){
                                setIsYcheck.push({
                                    position: isCheck ? "left" : "right"
                                });
                            }else{
                                setIsYcheck.push({})
                            }

                        }


                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis: setIsYcheck
                        });
                        chartObj.init(objConfig);
                    });


                    //y轴(柱)颜色
                    $("#chart-y-bar-color-select").change(function(){
                        var color = $(this).val();
                        var setIsYcolor = [];
                        for(var i = 0; i < datalen; i++){
                            if(i == 0){
                                setIsYcolor.push( {
                                    "axisLine": {
                                        "lineStyle": {
                                            "color": color
                                        }
                                    }
                                });
                            }else{
                                setIsYcolor.push({})
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : setIsYcolor
                        });
                        chartObj.init(objConfig);
                    });

                    //y轴(折线)颜色
                    $("#chart-y-line-color-select").change(function(){
                        var color = $(this).val();
                        var setIsYcolor = [];
                        for(var i = 0; i < datalen; i++){
                            if(i == datalen-1){
                                setIsYcolor.push( {
                                    "axisLine": {
                                        "lineStyle": {
                                            "color": color
                                        }
                                    }
                                });
                            }else{
                                setIsYcolor.push({})
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : setIsYcolor
                        });
                        chartObj.init(objConfig);
                    });

                    //y轴（柱）字体颜色
                    $("#chart-y-bar-font-color-select").change(function(){
                        var color = $(this).val();
                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : [
                                {
                                    "axisLabel": {
                                        "textStyle": {
                                            "color": color
                                        }
                                    },
                                    "nameTextStyle": {
                                        "color": color
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //y轴（柱）字体大小
                    $("#chart-y-bar-font-size-range").change(function(){
                        var size = $(this).val();

                        //设置值
                        $("#chart-y-bar-font-size-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : [
                                {
                                    "axisLabel": {
                                        "textStyle": {
                                            "fontSize": size
                                        }
                                    },
                                    "nameTextStyle": {
                                        "fontSize": size
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //y轴（柱）字体旋转角度
                    $("#chart-y-bar-text-rotate-range").change(function(){
                        var size = $(this).val();

                        //设置值
                        $("#chart-y-bar-text-rotate-text").val(size);
                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : [
                                {
                                    "axisLabel": {
                                        "rotate": size
                                    }
                                }
                            ]
                        });
                        chartObj.init(objConfig);
                    });

                    //y轴(折线)字体颜色
                    $("#chart-y-line-font-color-select").change(function(){
                        var color = $(this).val();
                        var setIsYFontcolor = [];
                        for(var i = 0; i < datalen; i++){
                            if(i == datalen-1){
                                setIsYFontcolor.push({
                                    "axisLabel": {
                                        "textStyle": {
                                            "color": color
                                        }
                                    },
                                    "nameTextStyle": {
                                        "color": color
                                    }
                                });
                            }else{
                                setIsYFontcolor.push({})
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : setIsYFontcolor
                        });

                        chartObj.init(objConfig);
                    });

                    //y轴(折线)字体大小
                    $("#chart-y-line-font-size-range").change(function(){
                        var size = $(this).val();

                        //设置值
                        $("#chart-y-line-font-size-text").val(size);

                        var setIsYFontSize = [];
                        for(var i = 0; i < datalen; i++){
                            if(i == datalen-1){
                                setIsYFontSize.push({
                                    "axisLabel": {
                                        "textStyle": {
                                            "fontSize": size
                                        }
                                    },
                                    "nameTextStyle": {
                                        "fontSize": size
                                    }
                                });
                            }else{
                                setIsYFontSize.push({})
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : setIsYFontSize
                        });
                        chartObj.init(objConfig);
                    });

                    //y轴(折线)字体旋转角度
                    $("#chart-y-line-text-rotate-range").change(function(){
                        var size = $(this).val();
                        //设置值
                        $("#chart-y-line-text-rotate-text").val(size);

                        var setIsYRotate = [];
                        for(var i = 0; i < datalen; i++){
                            if(i == datalen-1){
                                setIsYRotate.push({
                                    "axisLabel": {
                                        "rotate": size
                                    }
                                });
                            }else{
                                setIsYRotate.push({})
                            }

                        }

                        objConfig["option"] = _style = $.extend(true,_style,{
                            yAxis : setIsYRotate
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

            //是否显示图列
            var legendShow = (_style.legend && _style.legend.show === false) ? false :true;
            if(!legendShow){
                //控制是否可以修改图例文字颜色
                $("#chart-show-legend-check").attr("checked",false);
                $("#chart-legend-color-select").attr("disabled",true);
            }

            //图列颜色
            var legendColor = $.extend(true,{},{
                legend:{
                    textStyle:{
                        color:null
                    }
                }
            },{
                legend : _style.legend || {}
            });
            if(legendColor.legend.textStyle.color != null){
                $("#chart-legend-color-select").attr("value",legendColor.legend.textStyle.color);
                var $parent =  $("#chart-legend-color-select").parent("div");
                //保证控件刷新
                $parent.html($parent.html());
            }

            var series = _style.series;
            if(series){
                //折线是否为平滑曲线
                var seriesStyle= $.extend(true,{},{series:[
                    {
                        "itemStyle": {
                            "normal": {
                                "color": null,
                                "barBorderRadius": [-1,-1,-1,-1],
                                "label": {
                                    "textStyle": {
                                        "fontSize": -1,
                                        "color": null
                                    },
                                    "position": null
                                }
                            }
                        }
                    },{
                        "itemStyle": {
                            "smooth":true,
                            "normal": {
                                "color": null,
                                "label": {
                                    "show":true,
                                    "position": null,
                                    "textStyle": {
                                        "color":null,
                                        "fontSize": -1
                                    }
                                },
                                "lineStyle": {
                                    width:-1
                                }
                            }
                        }
                    }
                ]},{
                    series:series
                });

                //柱子颜色
                var color = seriesStyle.series[0].itemStyle.normal.color;
                if(color != null){
                    $("#chart-bar-color-select-0").attr("value",color);
                    var $parent =  $("#chart-bar-color-select-0").parent("div");
                    //保证控件刷新
                    $parent.html($parent.html());
                }

                //边框倒角
                var barBorderRadius = seriesStyle.series[0].itemStyle.normal.barBorderRadius;
                if(barBorderRadius != null){
                    if(barBorderRadius[0] > 0){
                        $("#chart-bar-top-border-radius-range").attr("value",barBorderRadius[0]).val(barBorderRadius[0]);
                        $("#chart-bar-top-border-radius-text").attr("value",barBorderRadius[0]).val(barBorderRadius[0]);
                    }

                    if(barBorderRadius[2] > 0){
                        $("#chart-bar-bottom-border-radius-range").attr("value",barBorderRadius[2]).val(barBorderRadius[2]);
                        $("#chart-bar-bottom-border-radius-text").attr("value",barBorderRadius[2]).val(barBorderRadius[2]);
                    }
                }

                //是否显示标签
                if(seriesStyle.series[0].itemStyle.normal.label.show === false){
                    $("#chart-bar-show-label-check").attr("checked",false);

                    //控制是否可以修改
                    $("#chart-bar-font-color-select").attr("disabled",true);
                    $("#chart-bar-font-size-range").attr("disabled",true);
                    $("input[name='chart-bar-font-position-radio']").attr("disabled",true);
                }
                var textStyleColor = seriesStyle.series[0].itemStyle.normal.label.textStyle.color;
                if(textStyleColor != null){
                    $("#chart-bar-font-color-select").attr("value",textStyleColor).val(textStyleColor);
                    var $textStyleColorParent =  $("#chart-bar-font-color-select").parent("div");
                    //保证控件刷新
                    $textStyleColorParent.html($textStyleColorParent.html());
                }
                var textStyleFontSize = seriesStyle.series[0].itemStyle.normal.label.textStyle.fontSize;
                if(textStyleFontSize > -1){
                    $("#chart-bar-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
                    $("#chart-bar-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
                }
                var textStylePosition = seriesStyle.series[0].itemStyle.normal.label.position;
                if(textStylePosition != null){
                    var radioId = "chart-bar-font-position-radio-";
                    switch(textStylePosition){
                        case "insideTop":
                            radioId = radioId + "0";
                        case "top":
                            radioId = radioId + "1";
                            break;
                        case "left":
                            radioId = radioId + "3";
                            break;
                        case "right":
                            radioId = radioId + "4";
                            break;
                        case "inside":
                            radioId = radioId + "5";
                            break;
                    }
                    $("input[name='chart-bar-font-position-radio']").removeAttr("checked");
                    $("input#"+radioId).attr("checked",true);
                    var $span = $("input#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                }

                //最后一个为折线的序号
                var lineIndex = seriesStyle.series.length-1;
                //是否平滑曲线
                var smoothStyle1 = seriesStyle.series[lineIndex].smooth;
                if(smoothStyle1 === true){
                    $("#chart-show-smooth-check").attr("checked",true);
                }
                //折线颜色
                var color = seriesStyle.series[lineIndex].itemStyle.normal.color;	//label.textStyle
                if(color && color != null){
                    $("#chart-line-color-select").attr("value",color);
                    var $parent =  $("#chart-line-color-select").parent("div");
                    //保证控件刷新
                    $parent.html($parent.html());
                }
                var w = seriesStyle.series[lineIndex].itemStyle.normal.lineStyle.width;
                if(w > -1){
                    $("#chart-line-width-range").attr("value",w).val(w);
                    $("#chart-line-width-text").attr("value",w).val(w);
                }
                if(seriesStyle.series[lineIndex].itemStyle.normal.label.show === false){
                    $("#chart-line-show-label-check").attr("checked",false);

                    //控制是否可以修改
                    $("#chart-line-font-color-select").attr("disabled",true);
                    $("#chart-line-font-size-range").attr("disabled",true);
                    $("input[name='chart-line-font-position-radio']").attr("disabled",true);
                }
                var textStylePosition = seriesStyle.series[lineIndex].itemStyle.normal.label.position;
                if(textStylePosition != null){
                    var radioId = "chart-line-font-position-radio-";
                    switch(textStylePosition){
                        case "top":
                            radioId = radioId + "1";
                            break;
                        case "bottom":
                            radioId = radioId + "2";
                            break;
                        case "left":
                            radioId = radioId + "3";
                            break;
                        case "right":
                            radioId = radioId + "4";
                            break;
                    }
                    $("input[name='chart-line-font-position-radio']").removeAttr("checked");
                    $("input#"+radioId).attr("checked",true);
                    var $span = $("input#"+radioId).parent(".input-group-addon");
                    $span.html($span.html());
                }
                var textStyleColor = seriesStyle.series[lineIndex].itemStyle.normal.label.textStyle.color;
                if(textStyleColor != null){
                    $("#chart-line-font-color-select").attr("value",textStyleColor).val(textStyleColor);
                    var $textStyleColorParent =  $("#chart-line-font-color-select").parent("div");
                    //保证控件刷新
                    $textStyleColorParent.html($textStyleColorParent.html());
                }
                var textStyleFontSize = seriesStyle.series[lineIndex].itemStyle.normal.label.textStyle.fontSize;
                if(textStyleFontSize > -1){
                    $("#chart-line-font-size-range").attr("value",textStyleFontSize).val(textStyleFontSize);
                    $("#chart-line-font-size-text").attr("value",textStyleFontSize).val(textStyleFontSize);
                }
            }//end if(series && series[0])

            //x轴
            var xAxisStyle = $.extend(true,{},{
                xAxis: [
                    {
                        "position": null,
                        "axisLine": {
                            "lineStyle": {
                                "color": null
                            }
                        },
                        "axisLabel": {
                            "textStyle": {
                                "color": null,
                                "fontSize": -1
                            },
                            "rotate": -1
                        },
                        positionOffset: {
                            x:0,
                            y:0
                        },
                        "isShowXAxisText" : false
                    }
                ]
            },{
                xAxis:_style.xAxis || []
            });
            var xAxisStylePosition = xAxisStyle.xAxis[0].position;
            if(xAxisStylePosition != null){
                var radioId = "chart-x-position-radio-";
                switch(xAxisStylePosition){
                    case "bottom":
                        radioId = radioId +"1";
                        break;
                    case "top":
                        radioId = radioId +"2";
                        break;
                }
                $("input[name='chart-x-position-radio']").removeAttr("checked");
                $("input#"+radioId).attr("checked",true);
                var $span = $("input#"+radioId).parent(".input-group-addon");
                $span.html($span.html());
            }//end if(xAxisStylePosition != null)
            var xAxisStyleLineColor = xAxisStyle.xAxis[0].axisLine.lineStyle.color;
            if(xAxisStyleLineColor != null){
                $("#chart-x-color-select").attr("value",xAxisStyleLineColor);
                var $xAxisStyleLineColorParent =  $("#chart-x-color-select").parent("div");
                //保证控件刷新
                $xAxisStyleLineColorParent.html($xAxisStyleLineColorParent.html());
            }//end if(xAxisStyleLineColor != null)
            var xAxisStyleTextColor = xAxisStyle.xAxis[0].axisLabel.textStyle.color;
            if(xAxisStyleTextColor != null){
                $("#chart-x-font-color-select").attr("value",xAxisStyleTextColor);
                var $xAxisStyleTextColorParent =  $("#chart-x-font-color-select").parent("div");
                //保证控件刷新
                $xAxisStyleTextColorParent.html($xAxisStyleTextColorParent.html());
            }//end if(xAxisStyleTextColor != null)
            var xAxisStyleTextSize = xAxisStyle.xAxis[0].axisLabel.textStyle.fontSize;
            if(xAxisStyleTextSize > -1){
                $("#chart-x-font-size-range").attr("value",xAxisStyleTextSize).val(xAxisStyleTextSize);
                $("#chart-x-font-size-text").attr("value",xAxisStyleTextSize).val(xAxisStyleTextSize);
            }//end if(xAxisStyleTextSize != null)
            var xAxisStyleTextRotate = xAxisStyle.xAxis[0].axisLabel.rotate;
            if(xAxisStyleTextRotate > -1){
                $("#chart-x-text-rotate-range").attr("value",xAxisStyleTextRotate).val(xAxisStyleTextRotate);
                $("#chart-x-text-rotate-text").attr("value",xAxisStyleTextRotate).val(xAxisStyleTextRotate);
            }//end if(xAxisStyleTextRotate != null)

            var xAistTylePositionOffset = xAxisStyle.xAxis[0].positionOffset;
            if(xAistTylePositionOffset.x != ""){
                $("#chart-textxy-color-container>.form-controlx").attr("value",xAistTylePositionOffset.x).val(xAistTylePositionOffset.x);
            }
            if(xAistTylePositionOffset.y != ""){
                $("#chart-textxy-color-container>.form-controly").attr("value",xAistTylePositionOffset.y).val(xAistTylePositionOffset.y);
            }
            //y轴
            var yAxisStyle = $.extend(true,{},{
                yAxis: [
                    {
                        "position": null,
                        "axisLine": {
                            "lineStyle": {
                                "color": null
                            }
                        },
                        "axisLabel": {
                            "textStyle": {
                                "color": null,
                                "fontSize": -1
                            },
                            "rotate": -1
                        }
                    },{
                        "position": null,
                        "axisLine": {
                            "lineStyle": {
                                "color": null
                            }
                        },
                        "axisLabel": {
                            "textStyle": {
                                "color": null,
                                "fontSize": -1
                            },
                            "rotate": -1
                        }
                    }
                ]
            },{
                yAxis:_style.yAxis || []
            });
            var position = yAxisStyle.yAxis[0].position;
            if(position && position == "right"){
                $("#chart-y-position-check").attr("checked",true);
            }//end if(position && position == "right")

            var yAxisStyleLineColor1 = yAxisStyle.yAxis[0].axisLine.lineStyle.color;
            if(yAxisStyleLineColor1 != null){
                $("#chart-y-bar-color-select").attr("value",yAxisStyleLineColor1);
                var $yAxisStyleLineColorParent =  $("#chart-y-bar-color-select").parent("div");
                //保证控件刷新
                $yAxisStyleLineColorParent.html($yAxisStyleLineColorParent.html());
            }//end if(yAxisStyleLineColor1 != null)
            var yAxisStyleTextColor1 = yAxisStyle.yAxis[0].axisLabel.textStyle.color;
            if(yAxisStyleTextColor1 != null){
                $("#chart-y-bar-font-color-select").attr("value",yAxisStyleTextColor1);
                var $yAxisStyleTextColorParent =  $("#chart-y-bar-font-color-select").parent("div");
                //保证控件刷新
                $yAxisStyleTextColorParent.html($yAxisStyleTextColorParent.html());
            }//end if(yAxisStyleTextColor1 != null)
            var yAxisStyleTextSize1 = yAxisStyle.yAxis[0].axisLabel.textStyle.fontSize;
            if(yAxisStyleTextSize1 > -1){
                $("#chart-y-bar-font-size-range").attr("value",yAxisStyleTextSize1).val(yAxisStyleTextSize1);
                $("#chart-y-bar-font-size-text").attr("value",yAxisStyleTextSize1).val(yAxisStyleTextSize1);
            }//end if(yAxisStyleTextSize1 != null)
            var yAxisStyleTextRotate1 = yAxisStyle.yAxis[0].axisLabel.rotate;
            if(yAxisStyleTextRotate1 > -1){
                $("#chart-y-bar-text-rotate-range").attr("value",yAxisStyleTextRotate1).val(yAxisStyleTextRotate1);
                $("#chart-y-bar-text-rotate-text").attr("value",yAxisStyleTextRotate1).val(yAxisStyleTextRotate1);
            }//end if(yAxisStyleTextRotate1 != null)

            var yAxisStyleLineColor2 = yAxisStyle.yAxis[1].axisLine.lineStyle.color;
            if(yAxisStyleLineColor2 != null){
                $("#chart-y-line-color-select").attr("value",yAxisStyleLineColor2);
                var $yAxisStyleLineColorParent =  $("#chart-y-line-color-select").parent("div");
                //保证控件刷新
                $yAxisStyleLineColorParent.html($yAxisStyleLineColorParent.html());
            }//end if(yAxisStyleLineColor2 != null)
            var yAxisStyleTextColor2 = yAxisStyle.yAxis[1].axisLabel.textStyle.color;
            if(yAxisStyleTextColor2 != null){
                $("#chart-y-line-font-color-select").attr("value",yAxisStyleTextColor2);
                var $yAxisStyleTextColorParent =  $("#chart-y-line-font-color-select").parent("div");
                //保证控件刷新
                $yAxisStyleTextColorParent.html($yAxisStyleTextColorParent.html());
            }//end if(yAxisStyleTextColor2 != null)
            var yAxisStyleTextSize2 = yAxisStyle.yAxis[1].axisLabel.textStyle.fontSize;
            if(yAxisStyleTextSize2 > -1){
                $("#chart-y-line-font-size-range").attr("value",yAxisStyleTextSize2).val(yAxisStyleTextSize2);
                $("#chart-y-line-font-size-text").attr("value",yAxisStyleTextSize2).val(yAxisStyleTextSize2);
            }//end if(yAxisStyleTextSize2 != null)
            var yAxisStyleTextRotate2 = yAxisStyle.yAxis[1].axisLabel.rotate;
            if(yAxisStyleTextRotate2 > -1){
                $("#chart-y-line-text-rotate-range").attr("value",yAxisStyleTextRotate2).val(yAxisStyleTextRotate2);
                $("#chart-y-line-text-rotate-text").attr("value",yAxisStyleTextRotate2).val(yAxisStyleTextRotate2);
            }//end if(yAxisStyleTextRotate2 != null)
        };

        return {
            init:init,
            getStyle:getStyle,
            getContainer:getContainer,
            setHeight:setHeight,
            reBindColorSelect:reBindColorSelect
        };
    })();


    return EChartBarLineStyle;
});