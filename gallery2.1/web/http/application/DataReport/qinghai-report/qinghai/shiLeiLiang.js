/**
 * Created by lmy on 2016/3/22.
 */
define(function(require, exports, module) {
    var EchartsFactory = require("js/echarts/visualkization.tool.echarts.factory");
    var D3Factory = require("js/d3/visualkization.tool.d3.factory");

    /**
     * 导航
     */
    var Nav = (function() {

        var init = function() {
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
        var bindScroll = function() {
            /* 监听滚动条 */
            window.onscroll = function() {
                var t = document.documentElement.scrollTop
                    || document.body.scrollTop;
                if (t >= 300) {
                    $("#top_div").fadeIn();
                } else {
                    $("#top_div").fadeOut();
                }
            };

            // 点击出现导航条
            $(".change_label").click(function() {
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
            $("#top_div").click(function() {
                $("html,body").animate({
                    scrollTop : 0
                }, 500);
            });
        };

        /**
         * 设置目录居中
         */
        var setDirToCenter = function() {
            var height_css = $(".fix_index").css("height");
            var height = parseInt(height_css);
            height = Math.round(height / 2);
            $(".fix_index").css("margin-top", "-" + height + "px");
        };

        /**
         * 绑定目录点击
         */
        var bindDirEvent = function() {

            // 目录-公报切换
            $(".book1 div[id^=page_]").on("click", function() {
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
            $("ul#dir-ul li").on("click", function() {
                var $li = $(this);
                var value = $li.attr("data-value");
                $("html,body").animate({
                    scrollTop : $("#mari-" + value).offset().top
                }, 500);
            });
        };

        /**
         * 绑定公报切换
         */
        var bindChangePageEvent = function() {
            var curr = $("ul.pagination li.active").attr("data-value");
            var curr = parseInt(curr);
            if (curr == 1) {
                $("ul.pagination li.pre_page").remove(); // 没有前一页
            } else if (curr == 3) {
                $("ul.pagination li.next_page").remove(); // 没有下一页
            }
            // 绑定
            $("ul.pagination li").on("click", function() {
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
            init : init
        };
    })();
    /**
     * 入口
     */
    var init = function() {
        Nav.init();
        //图1-1
        g_1();
        // 图1-2
        g_2();

        //图3-2
        g_10();

        //图3-3
        g_11();
        showHide();
    };

    /**
     * 图1-2
     */
    var g_2 = function() {
        var custom1 = {
            "width" : 850,
            "height" : "500px",
            fontColor : "#121212",
            pieFontColor : "#121212",
            fontSize : 12
        };
        var path = null;
        $("#g_2_btn button").click(function() {
            var $this = $(this);
            var ID = $this.attr("data-value");
            $this.parent().find(">button").removeClass("btn-success");
            $this.addClass("btn-success");
            switch (ID) {
                case "1":
                    path = "data/shiLeiLiang/g_2_1.json";
                    EchartsFactory.make("g_2_1", path, custom1, "pie");

                    break;
                case "2":
                    path = "data/shiLeiLiang/g_2_2.json";
                    EchartsFactory.make("g_2_1", path, custom1, "pie");
                    break;
                case "3":
                    path = "data/shiLeiLiang/g_2_3.json";
                    EchartsFactory.make("g_2_1", path, custom1, "pie");
                    break;
                default:
                    break;
            }
        });
        path = "data/shiLeiLiang/g_2_1.json";
        EchartsFactory.make("g_2_1", path, custom1, "pie");



    };
    /**
     * 图1-1
     */
    var g_1 = function() {
        var custom1 = {
            "width" :  "48%",
            "height" : "400px",
            fontColor : "#121212",
            pieFontColor : "#121212",
            fontSize : 12
        };
        var custom2 = {
            "width" :  "52%",
            "height" : "400px",
            fontColor : "#121212",
            pieFontColor : "#121212",
            fontSize : 12
        };
        var path1,path2 = null;
        $("#g_1_btn button").click(function() {
            var $this = $(this);
            var ID = $this.attr("data-value");
            $this.parent().find(">button").removeClass("btn-success");
            $this.addClass("btn-success");
            switch (ID) {
                case "1":
                    path1 = "data/shiLeiLiang/g_1_1_1.json";
                    path2 = "data/shiLeiLiang/g_1_1_2.json";

                   g_1(path1,path2);

                    break;
                case "2":
                    path1 = "data/shiLeiLiang/g_1_2_1.json";
                    path2 = "data/shiLeiLiang/g_1_2_2.json";
                    g_1(path1,path2);
                    break;
                case "3":
                    path1 = "data/shiLeiLiang/g_1_3_1.json";
                    path2 = "data/shiLeiLiang/g_1_3_2.json";
                    g_1(path1,path2);
                    break;
                default:
                    break;
            }
        });
        path1 = "data/shiLeiLiang/g_1_1_1.json";
        path2 = "data/shiLeiLiang/g_1_1_2.json";
        g_1(path1,path2);
        function g_1(path1,path2) {
            EchartsFactory.make("g_1_1", path1, custom1, "pie");
            EchartsFactory.make("g_1_2", path2, custom2, "pie");

        }

    };

    /**
     * 图3-2
     */
    var g_10=function(){
        var custom = {
            "width" :  "800px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3"
        };
        var path = null;
        $("#g_10_btn button").click(function() {
            var $this = $(this);
            var ID = $this.attr("data-value");
            $this.parent().find(">button").removeClass("btn-success");
            $this.addClass("btn-success");
            switch (ID) {
                case "1":
                    path = "data/shiLeiLiang/g_10_1.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");

                    break;
                case "2":
                    path = "data/shiLeiLiang/g_10_2.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");
                    break;
                case "3":
                    path = "data/shiLeiLiang/g_10_3.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");
                    break;
                case "4":
                    path = "data/shiLeiLiang/g_10_4.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");
                    break;
                case "5":
                    path = "data/shiLeiLiang/g_10_5.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");
                    break;
                case "6":
                    path = "data/shiLeiLiang/g_10_6.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");
                    break;
                case "7":
                    path = "data/shiLeiLiang/g_10_7.json";
                    EchartsFactory.make("g_10_1", path, custom, "line");
                    break;

                default:
                    break;
            }


        });
        path= "data/shiLeiLiang/g_10_1.json";
        EchartsFactory.make("g_10_1", path, custom, "line");


    }

    /**
     * 图3-3
     */
    var g_11=function(){
        var custom = {
            "width" :  "800px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3",
            color:"#89CDFC"
        };
        var path = null;
        $("#g_11_btn button").click(function() {
            var $this = $(this);
            var ID = $this.attr("data-value");
            $this.parent().find(">button").removeClass("btn-success");
            $this.addClass("btn-success");
            switch (ID) {
                case "1":
                    path = "data/shiLeiLiang/g_11_1.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");

                    break;
                case "2":
                    path = "data/shiLeiLiang/g_11_2.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");
                    break;
                case "3":
                    path = "data/shiLeiLiang/g_11_3.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");
                    break;
                case "4":
                    path = "data/shiLeiLiang/g_11_4.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");
                    break;
                case "5":
                    path = "data/shiLeiLiang/g_11_5.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");
                    break;
                case "6":
                    path = "data/shiLeiLiang/g_11_6.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");
                    break;
                case "7":
                    path = "data/shiLeiLiang/g_11_7.json";
                    EchartsFactory.make("g_11_1", path, custom, "line");
                    break;

                default:
                    break;
            }


        });
        path= "data/shiLeiLiang/g_11_1.json";
        EchartsFactory.make("g_11_1", path, custom, "line");


    }


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