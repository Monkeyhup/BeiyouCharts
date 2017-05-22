/**
 * Created by lmy on 2016/3/28.
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
        //图1-2
       g_1_2.init();

        //图1-3
        g_1_3();

        //图2-1
        g_2_1();
        //图2-2
        g_2_2();
        //图2-3
        g_2_3();
        //图2-4
        g_2_4();
        //图2-5
        g_2_5();
        //图2-6
        g_2_6();
        //图2-7
        g_2_7();
        //图2-8
        g_2_8();
        //图2-9
        g_2_9();
        //图2-10
        g_2_10();



        showHide();
    };

    //图1-2
    var g_1_2 = (function () {
        var init = function () {
            D3Factory.getInstance(D3Factory.D3.BAR.DRILL, function (obj) {
                $("#g_1_2_1").css({
                    "margin-left": "-300px"
                });
                var config = {
                    containerId: "#g_1_2_1",
                    url: "data/jinjian/g_1_2.json",
                    dataType: "data1",
                    textWidth: 400, // 文字宽度
                    w: 1105
                    // 图宽度
                };
                obj.init(config);
                $("#g_1_2_1 svg").css({
                    "width": 1500
                });
            });
        };

        return {
            init: init
        };
    })();
    //图1-3
    var g_1_3 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3"
        };
        var path = "data/jinjian/g_1_3.json";;
        EchartsFactory.make("g_1_3_1", path, custom, "pie");
    });
    //图2-1
    var g_2_1 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3"
        };
        var path = "data/jinjian/g_2_1.json";;
        EchartsFactory.make("g_2_1_1", path, custom, "line");
    });
    //图2-2
    var g_2_2 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3",
            rotate:10
        };
        var path = "data/jinjian/g_2_2.json";
        EchartsFactory.make("g_2_2_1", path, custom, "column");
    });
    //图2-3
    var g_2_3 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3",
            rotate:10
        };
        var path = "data/jinjian/g_2_3.json";
        EchartsFactory.make("g_2_3_1", path, custom, "column");
    });
    //图2-4
    var g_2_4 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3",
            rotate:10
        };
        var path = "data/jinjian/g_2_4.json";
        EchartsFactory.make("g_2_4_1", path, custom, "column");
    });
//图2-5
    var g_2_5 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3"
        };
        var path = "data/jinjian/g_2_5.json";
        EchartsFactory.make("g_2_5_1", path, custom, "column");
    });
    //图2-6
    var g_2_6 = (function () {
        var custom1 = {
            "width": 870,
            "height": "500px",
            fontColor: "#121212",
            pieFontColor: "#121212",
            fontSize: 12
        };
        var path1=null;
        $("#g_6_btn button").click(function () {
            var $this = $(this);
            var ID = $this.attr("data-value");
            $this.parent().find(">button").removeClass("btn-success");
            $this.addClass("btn-success");
            switch (ID) {
                case "1":
                    path1 = "data/jinjian/g_2_6_1.json";
                    EchartsFactory.make("g_6_1", path1, custom1, "column");
                    break;
                case "2":
                    path1 = "data/jinjian/g_2_6_2.json";
                    EchartsFactory.make("g_6_1", path1, custom1, "column");

                    break;
                default:
                    break;
            }
        });
        path1 = "data/jinjian/g_2_6_1.json";
        EchartsFactory.make("g_6_1", path1, custom1, "column");

    });
//图2-7
    var g_2_7 = (function () {
        var custom = {
            "width" :  "870px",
            "height" : "400px",
            fontColor : "#26C0C0",
            fontSize : 12,
            colmRetain:"3"
        };
        var path = "data/jinjian/g_2_7.json";
        EchartsFactory.make("g_2_7_1", path, custom, "column");
    });
    //图2-8
    var g_2_8 = (function () {
        var custom1 = {
            "width": 870,
            "height": "500px",
            fontColor: "#121212",
            fontSize: 12,
        rotate:0
        };
        var path1=null;
        $("#g_8_btn button").click(function () {
            var $this = $(this);
            var ID = $this.attr("data-value");
            $this.parent().find(">button").removeClass("btn-success");
            $this.addClass("btn-success");
            switch (ID) {
                case "1":
                    path1 = "data/jinjian/g_2_8_1.json";
                    EchartsFactory.make("g_8_1", path1, custom1, "column");
                    break;
                case "2":
                    path1 = "data/jinjian/g_2_8_2.json";
                    EchartsFactory.make("g_8_1", path1, custom1, "column");
                    break;
                case "3":
                    path1 = "data/jinjian/g_2_8_3.json";
                    EchartsFactory.make("g_8_1", path1, custom1, "column");
                    break;
                default:
                    break;
            }
        });
        path1 = "data/jinjian/g_2_8_1.json";
        EchartsFactory.make("g_8_1", path1, custom1, "column");

    });
//图2-9
    var g_2_9 = (function () {
        var custom = {
            "width": 870,
            "height": 420,
            fontColor: "#121212",
            fontSize: 12,
            rotate:0
        };
        var path = "data/jinjian/g_2_9.json";
        EchartsFactory.make("g_2_9_1", path, custom, "line");

    });
    //图2-10
    var g_2_10 = (function () {
        var custom = {
            "width": 870,
            "height": 420,
            fontColor: "#121212",
            fontSize: 12,
            rotate:0
        };
        var path = "data/jinjian/g_2_10.json";
        EchartsFactory.make("g_2_10_1", path, custom, "column");

    });



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
