/**
 * Created by z on 2016/3/23.
 */

define(function(require, exports, module) {
    var EchartsFactory = require("js/echarts/visualkization.tool.echarts.factory");
    var D3Factory = require("js/d3/visualkization.tool.d3.factory");

    /**
     * 导航
     */
    var Nav = (function () {

        var init = function () {
            // 绑定滚动条
            bindScroll();

            // 目录居中
            setDirToCenter();

            // 绑定目录点击
            bindDirEvent();

            // 绑定公报切换
            bindChangePageEvent();
        };

        /**
         * 绑定滚动条
         */
        var bindScroll = function () {
            /* 监听滚动条 */
            window.onscroll = function () {
                var t = document.documentElement.scrollTop
                    || document.body.scrollTop;
                if (t >= 300) {
                    $("#top_div").fadeIn();
                } else {
                    $("#top_div").fadeOut();
                }
            };

            // 点击出现导航条
            $(".change_label").click(function () {
                var value = $(".fix_index").attr("data-value");
                if (value == "false") {
                    $(".fix_index").fadeIn();
                    $(".fix_index").attr("data-value", "true");
                    $(".return_hov").css("background-color", "#EEEEE0");
                } else {
                    $(".fix_index").fadeOut();
                    $(".fix_index").attr("data-value", "false");
                    $(".return_hov").css("background-color", "#FFFFFF");
                }
            });

            // 点击回调顶部
            $("#top_div").click(function () {
                $("html,body").animate({
                    scrollTop: 0
                }, 500);
            });
        };

        /**
         * 设置目录居中
         */
        var setDirToCenter = function () {
            var height_css = $(".fix_index").css("height");
            var height = parseInt(height_css);
            height = Math.round(height / 2);
            $(".fix_index").css("margin-top", "-" + height + "px");
        };

        /**
         * 绑定目录点击
         */
        var bindDirEvent = function () {

            // 目录-公报切换
            $(".book1 div[id^=page_]").on("click", function () {
                var $this = $(this);
                var id = $this.attr("id");
                var index = id.substr(id.indexOf("page_") + 5, id.length);
                switch (parseInt(index)) {
                    case 1:
                        window.location = "one.html";
                        break;
                    case 2:
                        window.location = "two.html";
                        break;
                    case 3:
                        window.location = "three.html";
                        break;
                    default:
                        break;
                }
            });

            // 目录切换
            $("ul#dir-ul li").on("click", function () {
                var $li = $(this);
                var value = $li.attr("data-value");
                $("html,body").animate({
                    scrollTop: $("#mari-" + value).offset().top
                }, 500);
            });
        };

        /**
         * 绑定公报切换
         */
        var bindChangePageEvent = function () {
            var curr = $("ul.pagination li.active").attr("data-value");
            var curr = parseInt(curr);
            if (curr == 1) {
                $("ul.pagination li.pre_page").remove(); // 没有前一页
            } else if (curr == 3) {
                $("ul.pagination li.next_page").remove(); // 没有下一页
            }
            // 绑定
            $("ul.pagination li").on("click", function () {
                var $this = $(this);
                var value = $this.attr("data-value");

                if (value == "pre")
                    value = curr - 1;
                else if (value == "next")
                    value = curr + 1;

                switch (value) {
                    case "1":
                    case 1:
                        window.location = "one.html";
                        break;
                    case "2":
                    case 2:
                        window.location = "two.html";
                        break;
                    case "3":
                    case 3:
                        window.location = "three.html";
                        break;
                    default:
                        break;
                }
            });
        };

        return {
            init: init
        };
    })();
    /**
     * 入口
     */
    var init = function () {
        Nav.init();
        //图1
        g_1.init();
        // 图2
        g_2();

        //图4
        g_4.init();

        //图5
        g_5.init();

        //图6
        g_6.init();

        //图7
        g_7.init();

        showHide();
    };


//图1
    var g_1 = (function() {
        var init = function() {
            excute(); // 默认指标1
        };

        var excute = function() {
            D3Factory.getInstance(D3Factory.D3.PAN, function(obj) {
                var config = {
                    containerId : "#g_1_1",
                    url : "data/shekewen/g_1_1.json",
                    dataType : "data1",
                    w : 870, // 图宽度
                    h : 400,
                    isShowTooltipTitle: false,

                };
                obj.init(config);

                $("#g_1_btn >button").on("click", function() {
                    var $this = $(this);
                    var value = $this.attr("data-value");

                    $this.parent().find(">button").removeClass("btn-success");
                    $this.addClass("btn-success");

                    switch (value) {
                        case "1":
                        case 1:
                            config["dataType"] = "data1";
                            obj.init(config);
                            break;
                        case "2":
                        case 2:
                            config["dataType"] = "data2";
                            obj.init(config);
                            break;
                        default:
                            break;
                    }
                });
            });
        };

        return {
            init : init
        };
    })();
//图2

    var g_2=function(){
        var custom1 = {
            "width" : "48%",
            "height" : "400px",
            fontSize : 12
        };
        var custom2 = {
            "width" : "52%",
            "height" : "400px",
            fontSize : 12,
            show : true,
            color : "#E3B5AD",
            fontColor : "#121212",
        };
        var path1 = "data/shekewen/g_2_1.json";
        var path2 = "data/shekewen/g_2_2.json";
        EchartsFactory.make("g_2_1", path1, custom1, "line");
        EchartsFactory.make("g_2_2", path2, custom2, "column");

    }
//图4
    var g_4 = (function() {
        var init = function() {
            excute(); // 默认指标1
        };

        var excute = function() {
            D3Factory.getInstance(D3Factory.D3.BAR.ORDER, function(obj) {
                var config = {
                    containerId : "#g_4_1",
                    url : "data/shekewen/g_4.json",
                    dataType : "data1",
                    w : 960, // 图宽度
                    h : 620,
                    yMax : 0,
                    timeOut : 100, // 100ms
                    margin : {
                        right : 60,
                        bottom : 200,
                        left : 60
                    },
                    textRotate : 60
                };
                obj.init(config);

                $("#g_4_btn >button").on("click", function() {
                    var $this = $(this);
                    var value = $this.attr("data-value");

                    $this.parent().find(">button").removeClass("btn-success");
                    $this.addClass("btn-success");

                    switch (value) {
                        case "1":
                        case 1:
                            config["dataType"] = "data1";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "2":
                        case 2:
                            config["dataType"] = "data2";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "3":
                        case 3:
                            config["dataType"] = "data3";
                            config["yMax"] = 2800;
                            obj.init(config);
                            break;
                        default:
                            break;
                    }
                });
            });
        };

        return {
            init : init
        };
    })();
    //图5
    var g_5 = (function() {
        var init = function() {
            excute(); // 默认指标1
        };

        var excute = function() {
            D3Factory.getInstance(D3Factory.D3.BAR.ORDER, function(obj) {
                var config = {
                    containerId : "#g_5_1",
                    url : "data/shekewen/g_5.json",
                    dataType : "data1",
                    w : 870, // 图宽度
                    h : 620,
                    yMax : 0,
                    timeOut : 100, // 100ms
                    margin : {
                        right : 60,
                        bottom : 200,
                        left : 60
                    },
                    textRotate : 60
                };
                obj.init(config);

                $("#g_5_btn >button").on("click", function() {
                    var $this = $(this);
                    var value = $this.attr("data-value");

                    $this.parent().find(">button").removeClass("btn-success");
                    $this.addClass("btn-success");

                    switch (value) {
                        case "1":
                        case 1:
                            config["dataType"] = "data1";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "2":
                        case 2:
                            config["dataType"] = "data2";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "3":
                        case 3:
                            config["dataType"] = "data3";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "4":
                        case 4:
                            config["dataType"] = "data4";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        default:
                            break;
                    }
                });
            });
        };

        return {
            init : init
        };
    })();

//图6
    var g_6 = (function() {
        var init = function() {
            excute(); // 默认指标1
        };

        var excute = function() {
            D3Factory.getInstance(D3Factory.D3.BAR.ORDER, function(obj) {
                var config = {
                    containerId : "#g_6_1",
                    url : "data/shekewen/g_6.json",
                    dataType : "data1",
                    w : 870, // 图宽度
                    h : 620,
                    yMax : 0,
                    timeOut : 100, // 100ms
                    margin : {
                        right : 60,
                        bottom : 200,
                        left : 60
                    },
                    textRotate : 60
                };
                obj.init(config);

                $("#g_6_btn >button").on("click", function() {
                    var $this = $(this);
                    var value = $this.attr("data-value");

                    $this.parent().find(">button").removeClass("btn-success");
                    $this.addClass("btn-success");

                    switch (value) {
                        case "1":
                        case 1:
                            config["dataType"] = "data1";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "2":
                        case 2:
                            config["dataType"] = "data2";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "3":
                        case 3:
                            config["dataType"] = "data3";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        default:
                            break;
                    }
                });
            });
        };

        return {
            init : init
        };
    })();

    //图6
    var g_7 = (function() {
        var init = function() {
            excute(); // 默认指标1
        };

        var excute = function() {
            D3Factory.getInstance(D3Factory.D3.BAR.ORDER, function(obj) {
                var config = {
                    containerId : "#g_7_1",
                    url : "data/shekewen/g_7.json",
                    dataType : "data1",
                    w : 870, // 图宽度
                    h : 620,
                    yMax : 0,
                    timeOut : 100, // 100ms
                    margin : {
                        right : 60,
                        bottom : 200,
                        left : 60
                    },
                    textRotate : 60
                };
                obj.init(config);

                $("#g_7_btn >button").on("click", function() {
                    var $this = $(this);
                    var value = $this.attr("data-value");

                    $this.parent().find(">button").removeClass("btn-success");
                    $this.addClass("btn-success");

                    switch (value) {
                        case "1":
                        case 1:
                            config["dataType"] = "data1";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "2":
                        case 2:
                            config["dataType"] = "data2";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        case "3":
                        case 3:
                            config["dataType"] = "data3";
                            config["yMax"] = 0;
                            obj.init(config);
                            break;
                        default:
                            break;
                    }
                });
            });
        };

        return {
            init : init
        };
    })();
    /**
     * 数据隐藏显示
     */
    var showHide = function() {
        $(".ui.button").on("click", function() {
            var $this = $(this);
            var $next = $this.next();
            var value = $this.attr("data-value");
            switch (value) {
                case "hide":
                    $this.attr("data-value", "show");
                    $this.text("隐藏数据");
                    break;
                case "show":
                    $this.attr("data-value", "hide");
                    $this.text("显示数据");
                    break;
                default:
                    break;
            }
            $next.toggle();
        });
    };

    init();

})
