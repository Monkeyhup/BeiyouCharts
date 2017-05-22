/**
 * Created by lmy on 2017/1/8.
 */

define(function(require, exports, module) {
    /**
     * 浏览器判断
     */
    var browerHanlder = function() {
        var agent = navigator.userAgent.toLowerCase();
        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi;
        var regStr_chrome = /chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;

        // IE
        var userAgent = navigator.userAgent.toLowerCase();
        jQuery.browser = {
            version : (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
            safari : /webkit/.test(userAgent),
            opera : /opera/.test(userAgent),
            msie : /msie/.test(userAgent) && !/opera/.test(userAgent),
            mozilla : /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
        };

        $("#remove-top-btn").click(function() {
            $("#top-alert-container").hide();
        });
        //IE 不支持
        if (agent.indexOf("msie") > 0) {
            var test = jQuery.browser.version;
            var version = parseInt(test);
//		if (version < 10) {
//		} else {
//			$("#top-alert-container").hide();
//		}

            $("#top-alert-container").show();
            return version;
        }

        //edge不支持
        if(agent.indexOf("edge") > 0){
            $("#top-alert-container").show();
            return "edge";
        }

        // Chrome
        if (agent.indexOf("chrome") > 0) {
            $("#top-alert-container").hide();
            return agent.match(regStr_chrome);
        }
        // firefox
        if (agent.indexOf("firefox") > 0) {
            $("#top-alert-container").hide();
            return agent.match(regStr_ff);
        }

        // Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            $("#top-alert-container").hide();
            return agent.match(regStr_saf);
        }

        //默认不支持
        $("#top-alert-container").show();
    };


    //UI类视图
    var UI=(function(){
        /**
         * 控制浏览器高度
         */
        var browerHeight = function() {
            // 不同显示屏显示浏览器的高度
            var windowHeight = $(window).height();

            //不同显示屏显示浏览器的宽度
            var bodyWidth = $('.container').width();
            var windowWidth = $(window).width();

            //contaeiner高度
            $('.container').css({
                'height': function () {
                    var top = (windowHeight -30);
                    return top > 0 ? top : 0;
                }
            });

            $('.ApplicationModule').css({
                'height': function () {
                    var top = (windowHeight/2-130);
                    return top > 0 ? top : 0;
                }
            });
            $('.ui.purple.inverted.menu').css({
                'width':function(){
                    return bodyWidth > windowWidth?bodyWidth:windowWidth
                }
            })
        };


        /**
         * 重置
         */
        var resize = SGIS.Util.throttle(browerHeight,100);
        return {
            browerHeight :browerHeight,
            resize :resize

        }

    })();

    var into =(function(){
            // 浏览器操作
            browerHanlder();

            // 控制浏览器高度
            UI.browerHeight();

            //设置重置方式
            $(window).resize(UI.resize);

    });

    return {
        into : into,

    }
})


