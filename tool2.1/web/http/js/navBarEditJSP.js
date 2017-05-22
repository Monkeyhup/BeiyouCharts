/**
 * Created by z on 2017/1/9.
 */
/**
 * Created by z on 2017/1/9.
 */
/**
 * Created by lmy on 2016/11/21.
 */
define(function(require, exports, module) {
    var narBar = require("/tool2.1/http/navBarEditJSP.tpl");
    /**
     * 用户信息
     */
    var User = (function(){
        var userInfo = null;

        /**
         * 初始化数据
         */
        var init = function(){
            userInfo = null;

            //绑定事件
            bindEvent();
            //窗口拖拽
            dialogDrag();
        };

        /**
         * 获取用户登录信息
         */
        var getUserInfo =  function(callback){
            SGIS.API.get("user/is/login").json(function(re){
                userInfo = null;
                if(re && re.code == 0){
                    if(re.data){
                        //保存用户信息
                        userInfo = re.data;
                    }
                }
                if(userInfo == null){
                    //未登录
                    /*showLoginWindow();*/
                }else{
                    //已经登录
                    showUserInfo(userInfo.userName);
                }
                callback && callback(userInfo);
            });
        };

        /**
         * 展示登录窗口
         */
        var showLoginWindow = function(){
            //窗口高度
            $('#login-modal').modal("show");
            $('#login-span').removeClass("hide");
            $('#logout-span').addClass("hide");

            //删除登录名
            $("#login-name").html("");

            //判断是否保存用户名
            checkIsSaveUserLogin();
        };

        /**
         * 判断是否保存用户名
         */
        var checkIsSaveUserLogin = function(){
            var cookie = Cookie.getCookies();
            if(cookie && cookie[0]){
                $("#login_form input[name='user_login']").val(cookie[0]);
                $("#login_form input[type='checkbox']").attr("checked",true);
            }else{
                $("#login_form input[name='user_login']").val("");
                $("#login_form input[name='user_password']").val("");
                $("#login_form input[type='checkbox']").attr("checked",false);
            }
            $("#login-modal input[name='user_login']").focus();
        };

        /**
         * 设置是否保存用户名
         *
         * @param userLogin
         */
        var setIsSaveUserLogin = function(userLogin){
            var isCheck = $("#login_form input[type='checkbox']").is(":checked");
            if(isCheck){
                Cookie.addCookie(userLogin);
            }else{
                Cookie.clearCookie();
            }
        };


        /**
         * 展示用户信息
         */
        var showUserInfo = function(userName){
            $('#login-span').addClass("hide");
            $('#register-span').addClass("hide");
            $('#logout-span').removeClass("hide");
            $('#login-name').html(userName || "");
            $("#my-charts-btn").removeClass("hide");
        };

        /**
         * 展示注销后
         */
        var showLogouted = function(){
            $('#login-span').removeClass("hide");
            $('#register-span').removeClass("hide");
            $('#logout-span').addClass("hide");

            //删除登录名
            $("#login-name").html("");
            $("#my-charts-btn").addClass("hide");
        };

        /**
         * 绑定事件
         */
        var bindEvent = function(){
            //登录弹出
            $("a[data-target='#login-modal']").click(function(){
                //判断是否保存用户名
                checkIsSaveUserLogin();
            });

            // 回车事件
            $("#login-modal input[name='user_login'],#login-modal input[name='user_password']")
                .on("keypress", function(e) {
                    if (e.keyCode && e.keyCode == 13) {
                        //登录
                        login();
                    }
                });

            //登录提交
            $("#login_submit").click(function(){
                //登录
                login();
            });

            //注销
            $("#logout-btn").click(function(){
                logout();
            });

            //注册
            $("#register-span").click(function(){
                var url = SGIS.API.getToolURL("")+"http/register.html";
                window.location = url;
            })


        };

        /**
         * 判断是否登录
         */
        var checkIsLogin = function(){
            return userInfo && userInfo != null ? true : false;
        };

        /**
         * 用户登录
         */
        var login = function(){
            var $useruLogin = $("form#login_form input[name='user_login']");
            var $userPassword = $("form#login_form input[name='user_password']");
            var $loginMessage = $("form#login_form #login-message");

            var userLogin = $useruLogin.val();
            var userPassword = $userPassword.val();
            if(!userLogin || userLogin == ""){
                $loginMessage.html("登录名不能为空！");
                var $error = $useruLogin.parent(".field").addClass("error");
                setTimeout(function(){
                    $error.removeClass("error");
                    $loginMessage.html("");
                    $useruLogin.focus();
                },1500);
                return ;
            }

            if(!userPassword || userPassword == ""){
                $loginMessage.html("密码不能为空！");
                var $error2 = $userPassword.parent(".field").addClass("error");
                setTimeout(function(){
                    $error2.removeClass("error");
                    $loginMessage.html("");
                    $userPassword.focus();
                },1500);
                return ;
            }
            $("#login_submit").button("loading");
            SGIS.API.get("user/login").data({
                "userLogin":userLogin,
                "userPassword":userPassword
            }).json(function(re){
                $("#login_submit").button("reset");
                userInfo = null;
                if(re && re.code == 0){
                    if(re.data){
                        //保存用户信息
                        userInfo = re.data;
                        if(userInfo != null){
                            //设置是否保存用户名
                            setIsSaveUserLogin(userInfo.userLogin);

                            //已经登录
                            showUserInfo(userInfo.userName);

                            //登录提示
                            $loginMessage.html("登录成功！");
                            setTimeout(function(){
                                $loginMessage.html("");
                                $('#login-modal').modal("hide");
                            },500);
                        }else{
                            $loginMessage.html("登录失败，用户名或者密码错误！");
                            setTimeout(function(){
                                $loginMessage.html("");
                            },1500);
                        }
                    }else{
                        $loginMessage.html("登录失败，用户名或者密码错误！");
                        setTimeout(function(){
                            $loginMessage.html("");
                        },1500);
                    }
                }else{
                    $loginMessage.html(re.message || "登录失败，用户名或者密码错误！");
                    setTimeout(function(){
                        $loginMessage.html("");
                    },1500);
                }
            });
        };

        /**
         * 注销
         */
        var logout = function(){
            SGIS.API.get("user/logout").json(function(re){
                if(re && re.code == 0){
                    SGIS.UI.alert("注销成功!",null,false,function(modal){
                        modal.css({
                            "top":"40%",
                            "height":"60px",
                            "width":"300px",
                            "margin-left":"-20px",
                            "overflow":"hidden",
                            "background-color":"transparent",
                            "border":"none"
                        });

                        modal.find(".content>.ui.label").css({
                            "font-size":"18px"
                        });
                    });
                    userInfo = null;
                    //展示注销后
                    showLogouted();
                }
            });
        };


        //展示窗口拖拽
        var dialogDrag = function(){
            var mouseOffsetX=0;
            var mouseOffsetY=0;
            var isDraging=false;
            //  鼠标事件1 － 在标题栏上按下（要计算鼠标相对拖拽元素的左上角的坐标，并且标记元素为可拖动）
            $(".modal-header").mousedown(function(e){
                var e = e || window.event;
                mouseOffsetX = e.pageX -$(".modal-content").offsetLeft;
                mouseOffsetY = e.pageY - $(".modal-content").offsetTop;
                isDraging = true;
            });
            //  鼠标事件2 － 鼠标移动时（要检测，元素是否可标记为移动，如果是，则更新元素的位置，到当前鼠标的位置［ps：要减去第一步中获得的偏移］）
            document.onmousemove = function( e ){
                var e = e || window.event;

                var mouseX = e.pageX;   // 鼠标当前的位置
                var mouseY = e.pageY;

                var moveX = 0;  //  浮层元素的新位置
                var moveY = 0;

                if( isDraging === true ){

                    moveX = mouseX - mouseOffsetX;
                    moveY = mouseY - mouseOffsetY;

                    //  范围限定   moveX > 0 并且  moveX < (页面最大宽度 - 浮层的宽度)
                    //            moveY > 0 并且  movey < (页面最大高度 - 浮层的高度)

                    var pageWidth  = document.documentElement.clientWidth ;
                    var pageHeight = document.documentElement.clientHeight ;

                    var dialogWidth  = $(".modal-content").offsetWidth;
                    var dialogHeight = $(".modal-content").offsetHeight;

                    var maxX = pageWidth - dialogWidth;
                    var maxY = pageHeight- dialogHeight;

                    moveX = Math.min( maxX , Math.max(0,moveX) );
                    moveY = Math.min( maxY , Math.max(0,moveY) );

                    $(".modal-content").css("left",moveX + 'px')
                    $(".modal-content").css("top",moveY + 'px')
                }

            };

            //  鼠标事件3 － 鼠标松开的时候（标记元素为不可拖动即可）
            document.onmouseup = function(){
                isDraging = false;
            }

        };
        return {
            init:init,
            getUserInfo:getUserInfo,
            checkIsLogin:checkIsLogin,
            showLoginWindow:showLoginWindow
        };
    })();

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

            //绑定用户事件
            User.init();
            User.getUserInfo(function(){
                console.log("消息提示：获取用户信息成！");
            });

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