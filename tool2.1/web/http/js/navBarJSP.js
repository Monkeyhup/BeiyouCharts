/**
 * Created by z on 2017/1/9.
 */
/**
 * Created by lmy on 2016/11/21.
 */
define(function(require, exports, module) {
    var narBar = require("/tool2.1/http/navBarJSP.tpl");

    /**
     * ui操作
     *
     */
    var UI = (function(){
        /**
         * 控制浏览器高度
         */
        var browerHeight = function() {

            //窗口高度
            $('#login-modal').css({
                'padding-top': function () {
                    var top = ($(window).height() / 2 - 250);
                    return top > 0 ? top : 0;
                }
            });
        };

        /**
         * 左侧的样式
         */
        var cssStyle = function(){
            var t = document.documentElement.scrollTop
                || document.body.scrollTop;
            //移除所有选中
            $(".row-left >div.title-name").removeClass("active");

            var activeIdIndex = 0;
            if($(window).width() > 770){
                $(".row-left").addClass("fixed-container");
                if($(window).scrollTop() >= ($(document).height()-$(window).height())){
                    activeIdIndex = 5;
                }else if (t < 260) {
                    activeIdIndex = 0;
                }else if (t >= 260 && t < 750) {
                    activeIdIndex = 1;
                }else if (t >= 750 && t < 998) {
                    activeIdIndex = 2;
                }else if (t >= 998 && t < 1234) {
                    activeIdIndex = 3;
                }else if (t >= 1234 && t < 1472) {
                    activeIdIndex = 4;
                }else if (t >= 1472 && t < 1982) {
                    activeIdIndex = 5;
                }else if (t >= 1982) {
                    activeIdIndex = 6;
                }
            }else{
                $(".row-left.fixed-container").removeClass("fixed-container");
                if (t < 288) {
                    activeIdIndex = 0;
                }else if (t >= 288 && t < 538) {
                    activeIdIndex = 1;
                }else if (t >= 538 && t < 782) {
                    activeIdIndex = 2;
                }else if (t >= 782 && t < 1038) {
                    activeIdIndex = 3;
                }else if (t >= 1038 && t < 1277) {
                    activeIdIndex = 4;
                }else if (t >= 1277 && t < 1782) {
                    activeIdIndex = 5;
                }else if (t >= 1782) {
                    activeIdIndex = 6;
                }
            }

            $("#name_"+activeIdIndex).addClass("active");
        };

        /**
         * 重置
         */
        var resize = SGIS.Util.throttle(cssStyle,100);

        /**
         * 绑定事件
         */
        var bindEvent = function(){
            //默认选中第一个
            $("#name_0").addClass("active");
            $("html,body").animate({scrollTop : 0}, 100);
            //绑定滚动样式
            window.onscroll = cssStyle;
        };


        return {
            resize:resize,
            browerHeight:browerHeight,
            bindEvent:bindEvent
        };
    })();

    var Index = (function(){
        /**
         * 初始化*
         * */
        var into = function(){
            //添加导航栏
            $("#navbar").html("").append($(narBar));
            //绑定事件
            bindEvent();

            UI.browerHeight();


        };
        var bindEvent = function(){
            /**
             *	查看我的作品
             */
            $("#go-gallery-btn").click(function(){
                //查看我的作品
                var url = SGIS.API.getToolURL("")+"http/chart.mine.thumbnail.html";
                window.location=url;
            });


            //制图界面
            $("#go-tool-btn").click(function(){
                var url = SGIS.API.getToolURL("")+"http/";
                window.location=url;
            });
            //地图界面
            $("#go-map-btn").click(function(){
                var url = SGIS.API.getWebURL("");
                window.location=url;
            });

            //首页
            $("#go-cover-btn").click(function(){
                var url=SGIS.API.getToolURL("")+"cover.html";
                window.location=url;
            });

            //专业应用
            $("#go-third-btn").click(function(){
                var url=SGIS.API.getGalleryURL("")+"http/";
                window.location=url;
            });

            //数据分析
            $("#go-data-analysis-btn").click(function(){
                var url=SGIS.API.getToolURL("")+"http/data-analysis/presentation.html";
                window.location=url;
            });
        };
        return {
            into : into
        };
    })();

    return Index;

})